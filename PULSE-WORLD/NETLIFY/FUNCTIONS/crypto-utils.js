// FILE: tropic-pulse-functions/PULSE-WORLD/netlify/lib/crypto-utils.js
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
//   Cryptographic utility module providing JWT, crypto, bcrypt, and UUID helpers.
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
//   ALWAYS use named exports (`export const` or `export { ... }`)
//   NEVER use default exports
//
// IMPORT RULES:
//   Only import modules that ALREADY exist in the repo
//   Do NOT assume new files or dependencies unless Aldwyn explicitly approves
//
// STRUCTURE:
//   Lives in /netlify/lib (shared logic folder)
//   This file is a pure utility module — no initialization, no side effects
//
// DEPENDENCY RULES:
//   This file must remain lightweight and stable
//   This file may be imported by ANY Netlify function or logic module
//
// SAFETY NOTES:
//   Keep deterministic; no global state
//   Do NOT add new crypto libraries without explicit approval
//   This module should remain minimal and safe
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";

export { jwt, bcrypt, uuidv4 };