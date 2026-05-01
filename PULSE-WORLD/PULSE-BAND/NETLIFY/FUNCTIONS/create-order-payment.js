/* global log,warn,error */
// FILE: tropic-pulse-functions/PULSE-WORLD/netlify/functions/create-order-payment.js
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
//   Advanced Netlify HTTP endpoint for marketplace order payments.
//   Handles multi‑value amount parsing, vendor lookup, payout currency
//   determination, 5% reserve logic, payment method attachment, and
//   PaymentIntent creation with transfer_data for vendor payouts.
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
//   determinePayoutCurrency() must come from ./utils.js (approved)
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
//     - reserveAmount = 5% of amount (integer)
//     - metadata must be STRING‑ONLY
//     - transfer_data.destination must be vendor’s Stripe account
//     - payment method MUST be attached before confirming
//
// SAFETY NOTES:
//   Validate required fields (amount, vendorId, customerId, paymentMethodId)
//   Validate vendor existence + stripeAccountID
//   Never expose secrets in responses
//   Log errors clearly but do not leak sensitive details
//   This endpoint is critical — changes affect all order payments

import admin from "firebase-admin";
import { getStripe } from "./stripe.js";
import { determinePayoutCurrency } from "./utils.js";

if (!admin.apps.length) admin.initializeApp();
const db = admin.firestore();

export async function handler(event, context) {
  log("🔵 [/create-order-payment] START");

  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const body = JSON.parse(event.body || "{}");
    const stripe = getStripe();

    // -----------------------------
    // CLEANERS
    // -----------------------------
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

    const num = (v) => {
      if (v == null) return 0;
      const decoded = decodeURIComponent(String(v));
      if (decoded.includes("|")) {
        return decoded
          .split("|")
          .map(x => Number(x) || 0)
          .reduce((a, b) => a + b, 0);
      }
      const n = Number(decoded);
      return isNaN(n) ? 0 : Number(n.toFixed(2));
    };

    // -----------------------------
    // INPUTS
    // -----------------------------
    const amount = Math.round(num(body.amount) * 100);
    const vendorId = clean(body.vendorId);
    const customerId = clean(body.customerId);
    const paymentMethodId = clean(body.paymentMethodId);

    if (!amount || !vendorId || !customerId || !paymentMethodId) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          error: "Missing required fields"
        })
      };
    }

    // -----------------------------
    // VENDOR LOOKUP
    // -----------------------------
    const vendorSnap = await db.collection("Users").doc(vendorId).get();
    if (!vendorSnap.exists) {
      return {
        statusCode: 404,
        body: JSON.stringify({
          success: false,
          error: "Vendor not found"
        })
      };
    }

    const { stripeAccountID } = vendorSnap.data();
    if (!stripeAccountID) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          error: "Vendor missing Stripe account"
        })
      };
    }

    // -----------------------------
    // DETERMINE CURRENCY
    // -----------------------------
    const info = await determinePayoutCurrency(stripe, stripeAccountID, amount);

    // 5% reserve
    const reserveAmount = Math.round(amount * 0.05);

    // -----------------------------
    // ATTACH PAYMENT METHOD
    // -----------------------------
    await stripe.paymentMethods.attach(paymentMethodId, { customer: customerId });

    // -----------------------------
    // CREATE PAYMENT INTENT
    // -----------------------------
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: info.transferCurrency,
      customer: customerId,
      payment_method: paymentMethodId,
      confirm: true,
      application_fee_amount: reserveAmount,
      transfer_data: {
        destination: stripeAccountID
      },
      metadata: {
        vendorId,
        reserveAmount
      }
    });

    log("✅ PaymentIntent created:", paymentIntent.id);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        clientSecret: paymentIntent.client_secret,
        paymentIntentId: paymentIntent.id
      })
    };

  } catch (err) {
    error("❌ Error creating PaymentIntent:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: "Error creating payment"
      })
    };
  }
}