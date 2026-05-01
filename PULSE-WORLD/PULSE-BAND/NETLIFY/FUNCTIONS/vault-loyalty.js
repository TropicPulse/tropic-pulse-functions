// FILE: tropic-pulse-functions/PULSE-WORLD/netlify/functions/vault-loyalty.js
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
//   Netlify Function module for Vault Loyalty logic + HTTP endpoints.
//   This file IS allowed to contain Netlify handlers (router + logic).
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
//
// STRUCTURE:
//   Lives in /netlify/functions (flat) unless Aldwyn creates subfolders
//   This file contains BOTH logic functions AND the Netlify `handler` router
//
// DEPENDENCY RULES:
//   This file may import vault-core.js or other logic modules if needed
//   This file exposes HTTP endpoints for save-loyalty + save-last-vault-visit
//
// SAFETY NOTES:
//   Keep deterministic; no global state
//   Firestore Admin SDK usage is allowed (confirmed by Aldwyn)
//   No external API calls unless explicitly approved

import admin from "firebase-admin";

if (!admin.apps.length) admin.initializeApp();
const db = admin.firestore();

/* ----------------------------------------------------
   SAVE LAST VAULT VISIT
---------------------------------------------------- */
export async function saveLastVaultVisit(userId) {
  const ref = db.collection("Users").doc(userId);

  const payload = {
    TPWallet: {
      lastVaultVisit: admin.firestore.Timestamp.now(),
      vaultVisitCount: admin.firestore.FieldValue.increment(1)
    }
  };

  await ref.set(payload, { merge: true });

  // CHANGES log
  await db.collection("CHANGES").add({
    type: "vaultVisit",
    uid: userId,
    payload,
    reason: "vaultVisit",
    actor: "user",
    source: "app",
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });

  // IdentityHistory snapshot
  await db
    .collection("IdentityHistory")
    .doc(userId)
    .collection("snapshots")
    .add({
      snapshotType: "vaultVisit",
      payload,
      reason: "vaultVisit",
      actor: "user",
      source: "app",
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

  // VaultHistory entry
  await db
    .collection("VaultHistory")
    .doc(userId)
    .collection("entries")
    .add({
      type: "visit",
      userAction: "opened_vault",
      systemResponse: "vault_loaded_successfully",
      metadata: payload,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
}

/* ----------------------------------------------------
   GET LAST VAULT VISIT
---------------------------------------------------- */
export async function getLastVaultVisit(userId) {
  const snap = await db.collection("Users").doc(userId).get();

  if (!snap.exists) {
    return {
      lastVaultVisit: null,
      vaultVisitCount: 0
    };
  }

  const data = snap.data().TPWallet || {};

  return {
    lastVaultVisit: data.lastVaultVisit || null,
    vaultVisitCount: data.vaultVisitCount || 0
  };
}

/* ----------------------------------------------------
   LOAD LOYALTY
---------------------------------------------------- */
export async function loadLoyalty(userId) {
  const snap = await db.collection("Users").doc(userId).get();
  if (!snap.exists) return null;

  return snap.data().TPLoyalty || null;
}

/* ----------------------------------------------------
   SAVE LOYALTY
---------------------------------------------------- */
export async function saveLoyalty(userId, loyalty) {
  const ref = db.collection("Users").doc(userId);

  const allowedFields = [
    "tier",
    "tierKey",
    "tierMultiplier",
    "seasonalActive",
    "seasonalName",
    "seasonalMultiplier",
    "streakCount",
    "streakMultiplier",
    "streakExpires",
    "calculationVersion"
  ];

  const filtered = {};

  for (const key of allowedFields) {
    if (loyalty[key] !== undefined) {
      filtered[key] = loyalty[key];
    }
  }

  filtered.updated = admin.firestore.Timestamp.now();

  await ref.set({ TPLoyalty: filtered }, { merge: true });

  // CHANGES log
  await db.collection("CHANGES").add({
    type: "loyaltyUpdate",
    uid: userId,
    payload: filtered,
    reason: "loyaltyUpdate",
    actor: "system",
    source: "app",
    createdAt: admin.firestore.FieldValue.serverTimestamp()
  });

  // IdentityHistory snapshot
  await db
    .collection("IdentityHistory")
    .doc(userId)
    .collection("snapshots")
    .add({
      snapshotType: "loyaltyUpdate",
      payload: filtered,
      reason: "loyaltyUpdate",
      actor: "system",
      source: "app",
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

  // VaultHistory entry
  await db
    .collection("VaultHistory")
    .doc(userId)
    .collection("entries")
    .add({
      type: "loyalty_update",
      userAction: "vault_loyalty_saved",
      systemResponse: "loyalty_updated",
      metadata: filtered,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
}

/* ----------------------------------------------------
   LOG VAULT CONVERSATION
---------------------------------------------------- */
export async function logVaultConversation(userId, sessionId, role, message) {
  await db
    .collection("VaultHistory")
    .doc(userId)
    .collection("sessions")
    .doc(sessionId)
    .collection("entries")
    .add({
      role,       // "user" or "vault"
      message,    // short text
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
}

/* ----------------------------------------------------
   LOYALTY PREDICTION ENGINE (NEW SCHEMA)
---------------------------------------------------- */
export function predictLoyaltyOutcome(L, estimatedPoints) {
  if (!L) return "";

  const out = [];
  const est = estimatedPoints || 0;

  const current = L.pointsBalance || 0;
  const lifetime = L.lifetimePoints || 0;

  const newTotal = current + est;
  const newLifetime = lifetime + est;

  // REWARD PROGRESSION
  if (typeof L.nextRewardPoints === "number") {
    const needed = L.nextRewardPoints - newTotal;

    if (needed <= 0) {
      out.push("🎁 This would give you enough points to redeem a reward.");
    } else {
      out.push(`🎁 You would be <b>${needed}</b> points away from your next reward.`);
    }
  }

  // RANK PROGRESSION
  if (typeof L.nextRankPoints === "number" && L.nextRank) {
    const neededRank = L.nextRankPoints - newLifetime;

    if (neededRank <= 0) {
      out.push(`🌟 This would push you into <b>${L.nextRank}</b> rank.`);
    } else {
      out.push(`🌟 You would be <b>${neededRank}</b> points away from <b>${L.nextRank}</b> rank.`);
    }
  }

  // STREAK EXPIRATION
  if (L.lastEarnedDate?.toMillis) {
    const last = new Date(L.lastEarnedDate.toMillis());
    const today = new Date();

    const diffDays = Math.floor(
      (today - last) / (1000 * 60 * 60 * 24)
    );

    if (diffDays >= 2) {
      out.push("⏳ Your streak expires today — this would refresh it.");
    }
  }

  return out.join("<br>");
}

/* ----------------------------------------------------
   ENDPOINT HANDLER (NETLIFY)
---------------------------------------------------- */
export async function handler(event, context) {
  const path = event.path || "";

  // Route: /save-loyalty
  if (path.endsWith("/save-loyalty")) {
    if (event.httpMethod === "OPTIONS") {
      return { statusCode: 204, body: "" };
    }

    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const { userId, loyalty } = JSON.parse(event.body || "{}");

    await saveLoyalty(userId, loyalty);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  }

  // Route: /save-last-vault-visit
  if (path.endsWith("/save-last-vault-visit")) {
    if (event.httpMethod === "OPTIONS") {
      return { statusCode: 204, body: "" };
    }

    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const { userId } = JSON.parse(event.body || "{}");

    await saveLastVaultVisit(userId);

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  }

  return {
    statusCode: 404,
    body: "Not Found"
  };
}