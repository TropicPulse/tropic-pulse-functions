// FILE: tropic-pulse-functions/netlify/lib/sms.js
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
//   Shared Netlify library that initializes and exposes the Twilio client
//   using environment variables. Provides:
//     • getTwilioClient() — validated Twilio client factory
//     • MESSAGING_SERVICE_SID — exported Twilio Messaging Service SID
//
// WHAT THIS FILE IS:
//   • A thin Twilio integration layer
//   • A safe, validated accessor for Twilio credentials
//   • A shared library used by Netlify functions
//
// WHAT THIS FILE IS NOT:
//   • Not a Netlify endpoint
//   • Not a messaging engine
//   • Not allowed to send SMS directly
//   • Not allowed to contain business logic
//
// DEPLOYMENT:
//   Lives in /netlify/lib as a shared logic module
//   Must remain ESM‑only and side‑effect‑free
//
// SYNTAX RULES:
//   ESM JavaScript ONLY — no TypeScript, no CommonJS, no require()
//   Named exports ONLY — no default exports
//
// IMPORT RULES:
//   Allowed:
//     • twilio (official SDK)
//
//   Forbidden:
//     • Firebase Admin
//     • Stripe
//     • Any environment‑specific modules
//
// SAFETY NOTES:
//   • Never hard‑code Twilio credentials
//   • Always read ACCOUNT_SID, AUTH_TOKEN, and MESSAGING_SERVICE_SID from env
//   • Throw immediately if credentials are missing
//   • This file must remain extremely stable — all SMS flows depend on it
import twilio from "twilio";

export function getTwilioClient() {
  const accountSid = window.ACCOUNT_SID;
  const authToken = window.AUTH_TOKEN;

  if (!accountSid || !authToken) {
    throw new Error("Twilio credentials not set");
  }

  return twilio(accountSid, authToken);
}

export const MESSAGING_SERVICE_SID = window.MESSAGING_SERVICE_SID;