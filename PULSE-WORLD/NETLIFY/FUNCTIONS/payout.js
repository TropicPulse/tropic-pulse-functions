/* global log,warn,error */
// FILE: tropic-pulse-functions/netlify/functions/payout.js
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
//   Core payout‑calculation engine for Tropic Pulse. Provides:
//     • determinePayoutCurrency — Stripe‑aware currency selection
//     • calculateReleaseDate — reserve release timestamp logic
//     • calculatePlatformReserve — platform reserve math (default 5%)
//     • calculateVendorPayout — vendor net payout after reserve
//     • buildPayoutSummary — unified vendor + reserve + currency summary
//
//   This file is LOGIC‑ONLY — it must NOT contain Netlify handlers.
//   Safe to import from any Netlify function or logic module.
//
// DEPLOYMENT:
//   PRIMARY HOST: Netlify (all backend execution runs here)
//   BACKUP HOSTS: Cloudflare + Firebase Hosting (static/CDN only)
//   Firebase Functions = deprecated — do NOT add new Firebase Functions code
//
// STRIPE RULES:
//   • Stripe account capabilities determine payout currency
//   • Priority: BZD → USD → fallback to account.default_currency
//   • All amounts must be integers in cents
//   • FX_RATE_USD_TO_BZD is fixed at 2.0 unless explicitly changed
//
// SYNTAX RULES:
//   ESM JavaScript ONLY — no TypeScript, no CommonJS, no require()
//   ALWAYS use named exports (`export function ...`)
//   NEVER use default exports
//
// IMPORT RULES:
//   Only import modules that ALREADY exist in the repo
//   This module must remain dependency‑light (Stripe + admin passed in)
//   Do NOT assume new files or dependencies unless Aldwyn explicitly approves
//
// STRUCTURE:
//   Lives in /netlify/functions (flat) unless Aldwyn creates subfolders
//   This file is a pure logic module — no initialization, no handlers
//
// DEPENDENCY RULES:
//   Must remain deterministic and side‑effect‑free
//   Must NOT mutate Stripe objects or Firestore timestamps
//   Must NOT introduce global state
//
// SAFETY NOTES:
//   • All returned values must be safe for direct use in PaymentIntents
//   • Release‑date logic must handle Firestore Timestamp OR raw dates
//   • This module is foundational — changes ripple across all payouts
/* ------------------------------------------------------
   Determine payout currency for a connected Stripe account
   PRIORITY: BZD → USD → fallback to default
------------------------------------------------------ */
export async function determinePayoutCurrency(stripe, stripeAccountID, payoutAmountCents) {
  log("🔵 [determinePayoutCurrency] START");

  const payoutAmountUSD = payoutAmountCents / 100;

  let account;
  try {
    account = await stripe.accounts.retrieve(stripeAccountID);
  } catch (err) {
    error("❌ Stripe account retrieval failed:", err.message);
    return {
      accountCurrency: "usd",
      transferCurrency: "usd",
      transferAmount: payoutAmountCents,
      displayAmount: payoutAmountUSD,
      displayCurrency: "$"
    };
  }

  const defaultCurrency = (account.default_currency || "usd").toLowerCase();

  const supported = new Set([
    ...(account.supported_payment_currencies || []),
    ...(account.supported_transfer_currencies || [])
  ]);

  const supportsBZD = supported.has("bzd");
  const supportsUSD = supported.has("usd");

  const FX_RATE_USD_TO_BZD = 2.0;

  let transferCurrency;
  let transferAmount;
  let displayCurrency;
  let displayAmount;

  // PRIORITY: BZD → USD → fallback
  if (supportsBZD) {
    transferCurrency = "bzd";
    const bzdDollars = payoutAmountUSD * FX_RATE_USD_TO_BZD;
    transferAmount = Math.round(bzdDollars * 100);
    displayCurrency = "BZ$";
    displayAmount = bzdDollars;

  } else if (supportsUSD) {
    transferCurrency = "usd";
    transferAmount = payoutAmountCents;
    displayCurrency = "$";
    displayAmount = payoutAmountUSD;

  } else {
    transferCurrency = defaultCurrency;
    transferAmount = payoutAmountCents;
    displayCurrency = defaultCurrency.toUpperCase();
    displayAmount = payoutAmountUSD;
  }

  return {
    accountCurrency: defaultCurrency,
    transferCurrency,
    transferAmount,
    displayAmount,
    displayCurrency
  };
}

/* ------------------------------------------------------
   Calculate reserve release date (3-day default)
------------------------------------------------------ */
export function calculateReleaseDate(deliveredAt, delayDays = 3, admin) {
  try {
    if (!deliveredAt) return null;

    let date;

    if (typeof deliveredAt.toDate === "function") {
      date = deliveredAt.toDate();
    } else {
      date = new Date(deliveredAt);
    }

    if (isNaN(date.getTime())) return null;

    date.setDate(date.getDate() + delayDays);

    return admin.firestore.Timestamp.fromDate(date);
  } catch (err) {
    log("❌ calculateReleaseDate error:", err.message);
    return null;
  }
}

/* ------------------------------------------------------
   Calculate platform reserve (default 5%)
------------------------------------------------------ */
export function calculatePlatformReserve(amountCents, reservePercent = 5) {
  const reserve = Math.round((amountCents * reservePercent) / 100);
  return {
    reserveCents: reserve,
    reservePercent
  };
}

/* ------------------------------------------------------
   Calculate vendor payout after reserve
------------------------------------------------------ */
export function calculateVendorPayout(amountCents, reservePercent = 5) {
  const { reserveCents } = calculatePlatformReserve(amountCents, reservePercent);
  const vendorCents = amountCents - reserveCents;

  return {
    vendorCents,
    reserveCents
  };
}

/* ------------------------------------------------------
   Calculate full payout summary (vendor + reserve + currency)
------------------------------------------------------ */
export async function buildPayoutSummary({
  stripe,
  stripeAccountID,
  amountCents,
  reservePercent = 5
}) {
  const { vendorCents, reserveCents } = calculateVendorPayout(amountCents, reservePercent);

  const currencyInfo = await determinePayoutCurrency(
    stripe,
    stripeAccountID,
    vendorCents
  );

  return {
    vendorCents,
    reserveCents,
    ...currencyInfo
  };
}