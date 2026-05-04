/* global log,warn,error */
// ============================================================================
// FILE: tropic-pulse-functions/PULSE-WORLD/functions/security-report.js
// PULSE SECURITY REPORTER — v7.1+
// “THE IMMUNE SENTINEL / FORENSIC ANTIGEN CAPTURE LAYER”
// ============================================================================
//
// ROLE (v7.1+):
//   reportSuspiciousClient is the **IMMUNE SENTINEL** of PulseOS.
//   It is the **FORENSIC ANTIGEN CAPTURE LAYER** — the subsystem that
//   passively observes suspicious client behavior and records it for
//   downstream immune analysis.
//
//   • Captures forensic metadata (identity, token, device, browser, IP)
//   • Logs incidents to CHANGES (global immune memory)
//   • Logs per‑user danger events (IdentityHistory/{uid}/danger)
//   • Never mutates identity documents
//   • Never exposes forensic metadata to clients
//   • Never blocks or intervenes — pure antigen capture
//
// WHAT THIS FILE *IS* (v7.1+):
//   • A deterministic immune surveillance organ
//   • A passive forensic recorder
//   • A stable, backward‑compatible Firebase endpoint
//
// WHAT THIS FILE *IS NOT*:
//   • NOT a Netlify function
//   • NOT identity mutation
//   • NOT a scoring engine
//   • NOT a router
//
// SAFETY CONTRACT (v7.1+):
//   • Always validate “reason”
//   • Never mutate identity documents
//   • Never expose forensic metadata
//   • IP extraction must remain defensive
//   • Never trust frontend payloads
//   • Never throw unhandled errors
//
// VERSION TAG:
//   version: 7.1+
// ============================================================================

import { onRequest } from "firebase-functions/v2/https";
import { admin, db } from "./helpers.js";
// ============================================================================
// LAYER CONSTANTS + DIAGNOSTICS
// ============================================================================
const LAYER_ID = "IMMUNE-LAYER";
const LAYER_NAME = "IMMUNE SENTINEL";
const LAYER_ROLE = "FORENSIC ANTIGEN CAPTURE";

const REPORTER_DIAGNOSTICS_ENABLED =
  process.env.PULSE_REPORTER_DIAGNOSTICS === "true" ||
  process.env.PULSE_DIAGNOSTICS === "true";

const logReporter = (stage, details = {}) => {
  if (!REPORTER_DIAGNOSTICS_ENABLED) return;

  log(
    JSON.stringify({
      pulseLayer: LAYER_ID,
      pulseName: LAYER_NAME,
      pulseRole: LAYER_ROLE,
      stage,
      ...details
    })
  );
};

// ============================================================================
// BACKEND ENTRY POINT — “IMMUNE SENTINEL CAPTURE”
// ============================================================================
export const reportSuspiciousClient = onRequest(
  { cors: true, maxInstances: 10 },
  async (req, res) => {
    logReporter("INTAKE_START", {
      hasBody: !!req?.body,
      ipHeader: req.headers["x-forwarded-for"]
    });

    try {
      const {
        reason,
        identitySnapshot,
        tokenSnapshot,
        userAgent,
        ts,
        language,
        platform,
        deviceMemory,
        hardwareConcurrency,
        screenWidth,
        screenHeight,
        referrer,
        url
      } = req.body || {};

      // -----------------------------------------------------------------------
      // ⭐ VALIDATION — immune sentinel never trusts foreign payloads
      // -----------------------------------------------------------------------
      if (!reason) {
        logReporter("MISSING_REASON", {});
        return res.status(400).json({
          success: false,
          error: "Missing reason"
        });
      }

      // -----------------------------------------------------------------------
      // ⭐ FORENSIC IP EXTRACTION — defensive
      // -----------------------------------------------------------------------
      const ip =
        req.headers["x-forwarded-for"]?.split(",")[0]?.trim() ||
        req.ip ||
        "unknown";

      const uid =
        identitySnapshot && identitySnapshot.uid
          ? identitySnapshot.uid
          : null;

      // -----------------------------------------------------------------------
      // ⭐ FORENSIC PAYLOAD CONSTRUCTION — antigen capture
      // -----------------------------------------------------------------------
      const payload = {
        reason,
        uid,
        identitySnapshot: identitySnapshot || null,
        tokenSnapshot: tokenSnapshot || null,
        userAgent: userAgent || null,
        clientTimestamp: ts || null,
        serverTimestamp: admin.firestore.FieldValue.serverTimestamp(),
        language: language || null,
        platform: platform || null,
        deviceMemory: deviceMemory || null,
        hardwareConcurrency: hardwareConcurrency || null,
        screenWidth: screenWidth || null,
        screenHeight: screenHeight || null,
        referrer: referrer || null,
        url: url || null,
        ip,
        source: "reportDanger",
        actor: "client"
      };

      logReporter("FORENSIC_PAYLOAD_BUILT", {
        uid,
        reason,
        hasIdentitySnapshot: !!identitySnapshot,
        hasTokenSnapshot: !!tokenSnapshot
      });

      // -----------------------------------------------------------------------
      // ⭐ GLOBAL IMMUNE MEMORY (CHANGES)
      // -----------------------------------------------------------------------
      await db.collection("CHANGES").add({
        type: "suspiciousClient",
        ...payload
      });

      logReporter("GLOBAL_LOG_WRITTEN", { uid });

      // -----------------------------------------------------------------------
      // ⭐ PER‑USER IMMUNE MEMORY (IdentityHistory/{uid}/danger)
      // -----------------------------------------------------------------------
      if (uid) {
        await db
          .collection("IdentityHistory")
          .doc(uid)
          .collection("danger")
          .add(payload);

        logReporter("USER_LOG_WRITTEN", { uid });
      }

      logReporter("INTAKE_COMPLETE", { uid });

      return res.json({ success: true });

    } catch (err) {
      error("reportSuspiciousClient error", err);

      logReporter("FATAL_ERROR", {
        message: err?.message || "Unknown error"
      });

      return res.status(500).json({
        success: false,
        error: "Internal error"
      });
    }
  }
);
