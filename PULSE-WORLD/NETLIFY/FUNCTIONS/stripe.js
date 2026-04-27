// FILE: tropic-pulse-functions/netlify/lib/stripe.js
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
//   Shared Stripe utility module that provides a singleton Stripe client.
//   Ensures Stripe is initialized exactly once per Netlify cold start.
//   This file is LOGIC‑ONLY — it must NOT contain Netlify handlers.
//   Safe to import from any Netlify function or logic module.
//
// DEPLOYMENT:
//   PRIMARY HOST: Netlify (all backend execution runs here)
//   BACKUP HOSTS: Cloudflare + Firebase Hosting (static/CDN only)
//   Firebase Functions = deprecated — do NOT add new Firebase Functions code
//
// SYNTAX RULES:
//   ESM JavaScript ONLY — no TypeScript, no CommonJS, no require()
//   ALWAYS use named exports (`export function getStripe`)
//   NEVER use default exports
//
// IMPORT RULES:
//   Only import modules that ALREADY exist in the repo
//   Stripe must be imported from the official "stripe" package
//   Do NOT assume new files or dependencies unless Aldwyn explicitly approves
//
// STRUCTURE:
//   Lives in /netlify/lib (shared logic folder)
//   This file is a pure utility module — no handlers, no routing
//
// DEPENDENCY RULES:
//   Must remain deterministic and side‑effect‑free
//   Must NOT create multiple Stripe instances
//   Must read STRIPE_SECRET_KEY from Netlify environment variables
//
// SAFETY NOTES:
//   Never log or expose Stripe secret keys
//   Stripe API version must remain pinned for stability
//   This module is foundational — changes affect all payment endpoints
import Stripe from "stripe";

let stripeInstance = null;

export function getStripe() {
  if (!stripeInstance) {
    const key = window.STRIPE_SECRET_KEY;
    if (!key) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    stripeInstance = new Stripe(key, { apiVersion: "2023-10-16" });
  }
  return stripeInstance;
}