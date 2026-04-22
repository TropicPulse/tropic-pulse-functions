// FILE: tropic-pulse-functions/netlify/lib/http.js
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
//   Shared HTTP utilities for Tropic Pulse, including:
//     • pulseCors — universal CORS middleware for all Netlify functions
//     • corsHandler — legacy alias for backward compatibility
//     • fetch — server‑side fetch (node-fetch) re-export
//   This file is LOGIC‑ONLY — it must NOT contain Netlify handlers.
//   Safe to import from any Netlify function or logic module.
//
// DEPLOYMENT:
//   PRIMARY HOST: Netlify (all backend execution runs here)
//   BACKUP HOSTS: Cloudflare + Firebase Hosting (static/CDN only)
//   Firebase Functions = deprecated — do NOT add new Firebase Functions code
//
// CORS RULES:
//   • Allow-Origin: *
//   • Allow-Headers: Content-Type, Authorization, X-Pulse-Device, X-Pulse-Remember
//   • Allow-Methods: GET, POST, OPTIONS
//   • OPTIONS requests MUST return 204 immediately
//   • Middleware must remain deterministic and side‑effect‑free
//
// SYNTAX RULES:
//   ESM JavaScript ONLY — no TypeScript, no CommonJS, no require()
//   ALWAYS use named exports (`export function`, `export const`)
//   NEVER use default exports
//
// IMPORT RULES:
//   Only import modules that ALREADY exist in the repo
//   This module must remain dependency‑light (cors + node-fetch only)
//   Do NOT assume new files or dependencies unless Aldwyn explicitly approves
//
// STRUCTURE:
//   Lives in /netlify/lib (shared logic folder)
//   This file is a pure utility module — no routing, no handlers
//
// SAFETY NOTES:
//   • CORS must remain consistent across all endpoints
//   • Do NOT weaken CORS rules without explicit approval
//   • fetch re-export must remain stable for server-side HTTP calls
import cors from "cors";
import fetch from "node-fetch";

export function pulseCors(req, res, next) {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Pulse-Device, X-Pulse-Remember");
  res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.status(204).send("");
  }

  next();
}

export const corsHandler = pulseCors;
export { fetch };