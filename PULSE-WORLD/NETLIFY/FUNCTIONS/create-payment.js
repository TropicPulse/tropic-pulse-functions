/* global log,warn,error */
// FILE: tropic-pulse-functions/PULSE-WORLD/netlify/functions/create-payment.js
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
//   Netlify HTTP endpoint that creates Stripe PaymentIntents for marketplace
//   vendor payments. Handles reserve logic, metadata normalization, and
//   returns clientSecret + paymentIntentId to the frontend.
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
//   Only import modules that ALREADY exist in the repo
//   getStripe() must come from ./stripe.js (approved)
//   Firestore Admin SDK usage is allowed (confirmed by Aldwyn)
//
// STRUCTURE:
//   Lives in /netlify/functions (flat) unless Aldwyn creates subfolders
//   This file is a pure endpoint — no shared logic should be embedded here
//
// DEPENDENCY RULES:
//   Must remain deterministic and side‑effect‑free
//   Must NOT create global state
//   Stripe PaymentIntent creation must follow marketplace rules:
//     - amount in cents (integer)
//     - reserveAmount in cents (integer)
//     - metadata must be STRING‑ONLY
//     - transfer_data.destination must be vendor’s Stripe account
//
// SAFETY NOTES:
//   Validate required fields (amount, vendorId, stripeAccountID)
//   Never expose secrets in responses
//   Log errors clearly but do not leak sensitive details
//   This endpoint is critical — changes affect all vendor payments

import { admin, db } from "./helpers.js";
import { getStripe } from "./stripe.js";

// ---------------------------------------------------------------------------
//  INITIALIZE ADMIN SDK (ONE TIME PER COLD START)
// ---------------------------------------------------------------------------

export async function handler(event, context) {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const body = JSON.parse(event.body || "{}");
    const stripe = getStripe();

    const {
      amount,
      vendorId,
      stripeAccountID,
      reserveAmount,
      currency = "usd",
      description,
      metadata = {}
    } = body;

    // -----------------------------
    // VALIDATION
    // -----------------------------
    if (!amount || !vendorId || !stripeAccountID) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          error: "Missing required fields: amount, vendorId, stripeAccountID"
        })
      };
    }

    if (!Number.isInteger(amount)) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          error: "Amount must be an integer in cents"
        })
      };
    }

    if (!Number.isInteger(reserveAmount)) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          error: "reserveAmount must be an integer in cents"
        })
      };
    }

    // -----------------------------
    // METADATA (STRING-ONLY)
    // -----------------------------
    const fullMetadata = {
      vendorId: String(vendorId),
      reserveAmount: String(reserveAmount || 0),
      ...Object.fromEntries(
        Object.entries(metadata).map(([k, v]) => [k, String(v)])
      )
    };

    // -----------------------------
    // CREATE PAYMENT INTENT
    // -----------------------------
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      description: description ? String(description).trim() : "",
      metadata: fullMetadata,
      transfer_data: {
        destination: stripeAccountID
      }
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      })
    };

  } catch (err) {
    error("Create-payment error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, error: err.message })
    };
  }
}