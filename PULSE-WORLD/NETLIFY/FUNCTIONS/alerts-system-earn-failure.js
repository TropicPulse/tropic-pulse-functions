/* global log, error,warn */
// FILE: tropic-pulse-functions/netlify/functions/alerts-system-Earn-failure.js
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
//   Netlify HTTP endpoint that receives system‑Earn failure alerts
//   from the EarnEngine running on the frontend or system worker.
//   This file IS a Netlify handler — routing is allowed here.
//   Logic should remain minimal; deeper logic (email, DB logging)
//   belongs in shared modules.
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
//   Firestore Admin SDK usage is allowed (confirmed by Aldwyn)
//   Email + DB logging should be delegated to shared modules
//
// STRUCTURE:
//   Lives in /netlify/functions (flat) unless Aldwyn creates subfolders
//   This file is a pure alert endpoint — no shared logic should be embedded here
//
// DEPENDENCY RULES:
//   Must remain deterministic and side‑effect‑free
//   Must NOT expose internal system details in responses
//   Must NOT throw — always return structured JSON errors
//
// SAFETY NOTES:
//   Validate POST method only
//   Never expose secrets or stack traces
//   This endpoint is critical for system‑Earn monitoring
//   Payloads may contain sensitive failure data — handle carefully
import admin from "firebase-admin";

if (!admin.apps.length) admin.initializeApp();

export async function handler(event, context) {
  try {
    if (event.httpMethod !== "POST") {
      return { statusCode: 405, body: "Method Not Allowed" };
    }

    const payload = JSON.parse(event.body || "{}");

    error("SYSTEM Earn FAILURE:", payload);

    // TODO: send email, log to DB, etc.

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };

  } catch (err) {
    error("Earn failure alert error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        success: false,
        error: "Internal Server Error"
      })
    };
  }
}