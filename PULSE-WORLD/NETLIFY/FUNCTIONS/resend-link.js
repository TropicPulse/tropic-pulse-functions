/* global log,warn,error */
// FILE: tropic-pulse-functions/netlify/functions/resend-link.js
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
//   Netlify HTTP endpoint that regenerates and resends a Stripe onboarding
//   link for a vendor using either:
//     • Permanent UserToken (legacy)
//     • TPIdentity.resendToken (current)
//   Handles phone normalization, SMS opt‑in, JWT creation, Stripe metadata
//   hashing, and onboarding link generation.
//
//   This file IS a Netlify handler — routing is allowed here.
//   Heavy logic should remain minimal; deeper logic belongs in shared modules.
//
// DEPLOYMENT:
//   PRIMARY HOST: Netlify (all backend execution runs here)
//   BACKUP HOSTS: Cloudflare + Firebase Hosting (static/CDN only)
//   Firebase Functions = deprecated — do NOT add new Firebase Functions code
//
// SYNTAX RULES:
//   ESM JavaScript ONLY — no TypeScript, no CommonJS, no require()
//   ALWAYS use named exports (`export function handler`)
//   NEVER use default exports
//
// IMPORT RULES:
//   Only import modules that ALREADY exist in the repo:
//     • getStripe() from ./stripe.js
//     • normalizePhone() from ./utils.js
//     • getTwilioClient(), MESSAGING_SERVICE_SID from ./twilio.js
//     • Firebase Admin SDK (allowed)
//   Do NOT assume new files or dependencies unless Aldwyn explicitly approves
//
// STRUCTURE:
//   Lives in /netlify/functions (flat) unless Aldwyn creates subfolders
//   This file is a pure endpoint — no shared logic should be embedded here
//
// DEPENDENCY RULES:
//   Must remain deterministic and side‑effect‑free
//   Must NOT create global state
//   Must NOT mutate user objects beyond intended Firestore updates
//
// SAFETY NOTES:
//   • Validate GET method only
//   • Clean token defensively (reject template injection artifacts)
//   • Never expose JWT or tokenHash in logs or responses
//   • Respect SMS opt‑in (TPNotifications.receiveSMS)
//   • Stripe onboarding links must use approved refresh_url + return_url
//   • This endpoint is critical — changes affect all vendor onboarding flows

import admin from "firebase-admin";
import crypto from "crypto";
import { getStripe } from "./stripe.js";
import { normalizePhone } from "./utils.js";
import { getTwilioClient, MESSAGING_SERVICE_SID } from "./twilio.js";

if (!admin.apps.length) admin.initializeApp();
const db = admin.firestore();

export async function handler(event, context) {
  try {
    if (event.httpMethod !== "GET") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    log("🔵 [/resend-link] START");

    const stripe = getStripe();
    const twilioClient = getTwilioClient();

    const params = event.queryStringParameters || {};

    // Clean token
    const clean = (v) => {
      if (!v) return null;
      const s = String(v).trim();
      if (
        s === "" ||
        s.includes("{{") ||
        s.includes("add_more_field") ||
        s.includes("fieldLebal") ||
        s.includes("fieldValue") ||
        s.includes("*")
      ) return null;
      return s;
    };

    const token = clean(params.token);
    if (!token) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, error: "Missing token" })
      };
    }

    const usersRef = db.collection("Users");

    // 1️⃣ Try permanent token first
    let snap = await usersRef.where("UserToken", "==", token).limit(1).get();

    // 2️⃣ Try current resend token
    if (snap.empty) {
      snap = await usersRef.where("TPIdentity.resendToken", "==", token).limit(1).get();
    }

    if (snap.empty) {
      return {
        statusCode: 404,
        body: JSON.stringify({ success: false, error: "Invalid token" })
      };
    }

    const user = snap.docs[0].data();
    const userRef = snap.docs[0].ref;

    // -----------------------------
    // PHONE
    // -----------------------------
    let phone =
      user.UserPhone ||
      user.Phone ||
      user.phone ||
      user.phonenumber ||
      user.userphone ||
      null;

    const country = user.UserCountry || "BZ";
    if (phone) phone = normalizePhone(phone, country);

    if (!phone) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          error: "No phone number on file for SMS resend"
        })
      };
    }

    // -----------------------------
    // STRIPE ACCOUNT ID
    // -----------------------------
    const stripeAccountID = user.TPIdentity?.stripeAccountID || null;

    if (!stripeAccountID) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          error: "User missing Stripe account ID"
        })
      };
    }

    // -----------------------------
    // JWT (for return_url)
    // -----------------------------
    const jwt = await admin.auth().createCustomToken(
      user.TPIdentity?.uid || user.UserID,
      {
        email: user.TPIdentity?.email || user.UserEmail,
        stripeAccountID
      }
    );

    // Hash for Stripe metadata
    const hash = crypto.createHash("sha256").update(jwt).digest("hex").slice(0, 32);

    await stripe.accounts.update(stripeAccountID, {
      metadata: { tokenHash: hash }
    });

    // -----------------------------
    // NOTIFICATIONS: SMS Opt-In
    // -----------------------------
    const receiveSMS = user.TPNotifications?.receiveSMS ?? false;

    if (!receiveSMS) {
      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          message: "SMS Not Sent (User Opted Out)"
        })
      };
    }

    // -----------------------------
    // STRIPE ONBOARDING LINK
    // -----------------------------
    try {
      const link = await stripe.accountLinks.create({
        account: stripeAccountID,
        refresh_url: "/expire.html",
        return_url: `/StripeSetupComplete.html?token=${encodeURIComponent(jwt)}`,
        type: "account_onboarding"
      });

      const newUrl = link.url;

      // -----------------------------
      // UPDATE NOTIFICATIONS TIMESTAMP
      // -----------------------------
      await userRef.set(
        {
          TPNotifications: {
            lastSMSSentAt: admin.firestore.FieldValue.serverTimestamp()
          }
        },
        { merge: true }
      );

      return {
        statusCode: 200,
        body: JSON.stringify({
          success: true,
          message: "Link resent",
          url: newUrl
        })
      };

    } catch (err) {
      error("Resend-Link error:", err.message);
      return {
        statusCode: 500,
        body: JSON.stringify({
          success: false,
          error: err.message
        })
      };
    }

  } catch (err) {
    error("Resend-Link fatal error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: err.message })
    };
  }
}