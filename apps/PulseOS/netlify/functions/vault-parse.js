// FILE: tropic-pulse-functions/functions/vault-parse.js
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
//   Legacy Firebase HTTPS endpoint that exposes the reminder‑parsing engine.
//   Accepts raw reminder text, forwards it to parseReminderText(), and returns
//   a normalized parsed object.
//
//   This file IS a Firebase handler (legacy).
//   This file SHOULD NOT grow — all new Vault logic belongs in Netlify.
//
// WHAT THIS FILE IS:
//   • A thin HTTP wrapper around parseReminderText()
//   • A CORS‑enabled Firebase endpoint
//   • A validator for empty text + missing trigger
//
// WHAT THIS FILE IS NOT:
//   • Not a parser (logic lives in vaultCore.js)
//   • Not a reminder engine
//   • Not a storage or scheduling module
//   • Not allowed to contain business logic
//
// DEPLOYMENT:
//   Runs ONLY on Firebase Functions (legacy).
//   Must remain stable until Vault parsing is migrated to Netlify.
//   No new Firebase Functions should be added.
//
// SYNTAX RULES:
//   ESM JavaScript ONLY — no TypeScript, no CommonJS, no require().
//   Named exports ONLY — no default exports.
//
// IMPORT RULES:
//   Allowed:
//     • onRequest from firebase-functions/v2/https
//     • parseReminderText from ./vaultCore.js
//
//   Forbidden:
//     • Firebase Admin (not needed here)
//     • Stripe
//     • Twilio
//     • Any new dependencies not explicitly approved
//
// INTERNAL LOGIC SUMMARY:
//   • Handles CORS preflight
//   • Validates req.body.text
//   • Calls parseReminderText(text)
//   • Ensures parsed.trigger exists
//   • Returns structured JSON response
//
// SAFETY NOTES:
//   • Never mutate Firestore here — this endpoint is parse‑only
//   • Never expose internal parser errors to users
//   • Keep responses stable for all clients using Vault

import { onRequest } from "firebase-functions/v2/https";
import { parseReminderText } from "./vaultCore.js";

export const parseReminder = onRequest(
  {
    region: "us-central1",
    timeoutSeconds: 15,
    memory: "256MiB"
  },
  async (req, res) => {
    // CORS
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");

    if (req.method === "OPTIONS") {
      return res.status(204).send("");
    }

    try {
      const text = req.body?.text || "";

      if (!text.trim()) {
        return res.json({
          success: false,
          error: "Empty reminder text",
          parsed: null
        });
      }

      // Call vaultcore logic
      const parsed = parseReminderText(text);

      if (!parsed?.trigger) {
        return res.json({
          success: false,
          error: "Unable to parse reminder",
          parsed: null
        });
      }

      return res.json({ success: true, parsed });

    } catch (err) {
      error("parseReminder error:", err);
      return res.json({
        success: false,
        error: "Server error: " + err.message,
        parsed: null
      });
    }
  }
);