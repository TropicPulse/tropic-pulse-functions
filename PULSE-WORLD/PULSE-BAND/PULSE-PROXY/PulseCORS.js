// FILE: tropic-pulse-functions/PULSE-WORLD/netlify/lib/http.js
//
// INTENT-CHECK: If you paste this while confused or frustrated, gently re-read your INTENT; 
// if I am unsure of intent, I will ask you for the full INTENT paragraph.
//
// 📘 PAGE INDEX — Source of Truth for This File
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
//   • Allow-Headers: Content-Type, Authorization, X-Pulse-Device, X-Pulse-Remember, X-Requested-With, *
//   • Allow-Methods: GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS
//   • OPTIONS requests MUST return 204 immediately
//   • Middleware must remain deterministic and side‑effect‑free
//
// SYNTAX RULES:
//   ESM JavaScript ONLY — no TypeScript, no CommonJS, no require()
//   ALWAYS use named exports
//   NEVER use default exports
//
// SAFETY NOTES:
//   • CORS must remain consistent across all endpoints
//   • Do NOT weaken CORS rules without explicit approval
//   • fetch re-export must remain stable for server-side HTTP calls

import cors from "cors";
import fetch from "node-fetch";

export function pulseCors(req, res, next) {
  // Universal backend CORS membrane for all Netlify functions
  res.set("Access-Control-Allow-Origin", "*");
  res.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Pulse-Device, X-Pulse-Remember, X-Requested-With, *"
  );
  res.set(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS"
  );
  res.set("Access-Control-Max-Age", "86400"); // 24h preflight cache

  if (req.method === "OPTIONS") {
    return res.status(204).send("");
  }

  next();
}

export const corsHandler = pulseCors;
export { fetch };
