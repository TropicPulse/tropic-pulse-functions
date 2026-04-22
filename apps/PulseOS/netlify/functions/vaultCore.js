// FILE: tropic-pulse-functions/netlify/functions/vault-core.js
//
// INTENT-CHECK: If you paste this while confused or frustrated, gently re-read your INTENT; if I am unsure of intent, I will ask you for the full INTENT paragraph.
// 📘 PAGE INDEX — Source of Truth for This File
//
// This PAGE INDEX defines the identity, purpose, boundaries, and allowed
// behavior of this file. It is the compressed representation of the entire
// page. Keep this updated as functions, responsibilities, and logic evolve.
//
// If AI becomes uncertain or drifts, request: "Rules Design (Trust/Data)"
//
// CONTENTS TO MAINTAIN:
//   • What this file IS
//   • What this file IS NOT
//   • Its responsibilities
//   • Its exported functions
//   • Its internal logic summary
//   • Allowed imports
//   • Forbidden imports
//   • Deployment rules
//   • Safety constraints
//
// The PAGE INDEX + SUB‑COMMENTS allow full reconstruction of the file
// without needing to paste the entire codebase. Keep summaries accurate.
// The comments are the source of truth — if code and comments disagree,
// the comments win.
//
// ROLE:
//   Core backend utility module for shared logic across the entire system.
//   This file is LOGIC‑ONLY — it must NOT contain Netlify HTTP handlers.
//   Handlers live in separate Netlify function endpoint files.
//
// DEPLOYMENT:
//   PRIMARY HOST: Netlify (all backend execution runs here)
//   BACKUP HOSTS: Cloudflare + Firebase Hosting (static/CDN only)
//   Firebase Functions = deprecated — do NOT add new Firebase Functions code
//
// SYNTAX RULES:
//   ESM JavaScript ONLY — no TypeScript, no CommonJS, no require()
//   ALWAYS use `export const` or `export function` — NEVER default exports
//
// IMPORT RULES:
//   Only import modules that ALREADY exist in the repo
//   Do NOT assume new files or dependencies unless Aldwyn explicitly approves
//   Stripe + emailTemplates imports are allowed ONLY because Aldwyn confirmed them
//
// STRUCTURE:
//   Lives in /functions (flat structure) unless Aldwyn creates subfolders
//   This is a top‑level logic module used by many other Netlify functions
//
// DEPENDENCY RULES:
//   This file may be imported by ANY Netlify function or logic module
//   This file must remain side‑effect‑free (no global state, no handlers)
//
// SAFETY NOTES:
//   Keep deterministic; no external API calls except Stripe (explicitly approved)
//   Do NOT add new imports without confirmation
//   Do NOT add new modules unless Aldwyn approves
//   This file is foundational — changes ripple across the entire system
//
// -----------------------------------------------------------------------------
// BEGIN MODULE IMPLEMENTATION
// -----------------------------------------------------------------------------

// Shared Vault utilities for TPSecurity patching + logging

import admin from "firebase-admin";
import Stripe from "stripe";
import emailTemplates from "./emailTemplates.js";
import { VAULT_PATCH_TWILIGHT } from "./vault-patches.js";

const db = admin.firestore();

/* ------------------------------------------------------
   EMAIL + STRIPE UTILITIES (ADDED)
------------------------------------------------------ */

/**
 * Render an email template by type.
 */
export function getEmailHTML(type, payload) {
  return emailTemplates[type].html(payload);
}

/**
 * Send a 1x1 tracking pixel.
 */
export function sendPixel(res) {
  const pixel = Buffer.from(
    "R0lGODlhAQABAPAAAAAAAAAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==",
    "base64"
  );

  res.set("Content-Type", "image/gif");
  res.send(pixel);
}

/**
 * Retrieve a user's Stripe balance (pending + available).
 */
export async function findUserStripeBalance(stripeAccountID, stripeSecret) {
  log("🔵 [findUserStripeBalance] START", { stripeAccountID });

  const stripe = new Stripe(stripeSecret);

  try {
    const balance = await stripe.balance.retrieve({
      stripeAccount: stripeAccountID
    });

    const available = balance?.available?.[0]?.amount ?? 0;
    const pending = balance?.pending?.[0]?.amount ?? 0;

    const toBZD = (v) => {
      const n = Number(v);
      return isNaN(n) ? "0.00" : (n / 100).toFixed(2);
    };

    const result = {
      pendingBalance: toBZD(pending),
      availableBalance: toBZD(available)
    };

    log("🟢 [findUserStripeBalance] RESULT", result);
    return result;

  } catch (err) {
    error("❌ [findUserStripeBalance] ERROR:", {
      message: err.message,
      type: err.type,
      code: err.code
    });

    return {
      pendingBalance: "N/A",
      availableBalance: "N/A"
    };
  }
}

/* ------------------------------------------------------
   SECURITY PATCH LOGGING
------------------------------------------------------ */

/**
 * Log a security patch event for a user.
 */
export async function logSecurityPatch(uid, patch, reason = "auto") {
  if (!uid) return;

  try {
    const ref = db
      .collection("securityPatchHistory")
      .doc(uid)
      .collection("entries")
      .doc();

    await ref.set({
      uid,
      patchSignature: patch.signature,
      patchVersion: patch.version,
      patchType: patch.type,
      reason,
      invoked: patch.invoked,
      description: patch.description,
      note: patch.note,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    log("🧾 Security patch logged:", uid, patch.signature);
  } catch (err) {
    error("🔥 logSecurityPatch failed:", err);
  }
}

/* ------------------------------------------------------
   APPLY TWILIGHT PATCH
------------------------------------------------------ */

/**
 * Apply the Twilight Patch to a user's TPSecurity block.
 */
export async function applyTwilightPatch(uid, reason = "auto") {
  if (!uid) return;

  try {
    const patch = VAULT_PATCH_TWILIGHT;

    const userRef = db.collection("Users").doc(uid);
    const snap = await userRef.get();

    if (!snap.exists) {
      log("❌ User not found:", uid);
      return;
    }

    const data = snap.data() || {};
    const sec = data.TPSecurity || {};

    const updatedSecurity = {
      ...sec,

      // Patch metadata
      patchSignature: patch.signature,
      patchVersion: patch.version,
      patchType: patch.type,
      lastPatchedAt: admin.firestore.FieldFieldValue.serverTimestamp(),

      // Fixes
      requiresPin: sec.requiresPin ?? true,
      dangerMode: sec.dangerMode ?? false,

      // Keep your calculation version
      calculationVersion: sec.calculationVersion || 1,

      // Update timestamps
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      lastUpdatedAt: admin.firestore.FieldValue.serverTimestamp()
    };

    await userRef.update({ TPSecurity: updatedSecurity });

    log("🌒 Twilight Patch applied to:", uid, updatedSecurity);

    await logSecurityPatch(uid, patch, reason);
  } catch (err) {
    error("🔥 applyTwilightPatch failed:", err);
  }
}