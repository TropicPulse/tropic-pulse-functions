// ============================================================================
// FILE: tropic-pulse-functions/functions/security-report.js
// PULSE SECURITY REPORTER — v6.3
// “THE REPORTER / FORENSIC INCIDENT LOGGING LAYER”
// ============================================================================
//
// ⭐ v6.3 COMMENT LOG
// - THEME: “THE REPORTER / FORENSIC INCIDENT LOGGING LAYER”
// - ROLE: Passive forensic recorder for suspicious client activity
// - Added LAYER CONSTANTS + DIAGNOSTICS helper
// - Added structured JSON logs (for DOM-visible inspector pipelines)
// - Added explicit STAGE markers for forensic traceability
// - Preserved legacy Firebase behavior (no Netlify migration)
// - ZERO logic changes to payload, Firestore writes, or endpoint behavior
//
// ============================================================================
// PERSONALITY + ROLE — “THE REPORTER”
// ----------------------------------------------------------------------------
// reportSuspiciousClient is the **REPORTER** of the security subsystem.
// It is the **FORENSIC INCIDENT LOGGING LAYER** — responsible for observing,
// capturing, and recording suspicious or malicious client behavior.
//
//   • Captures forensic metadata (identity, token, device, browser, IP)
//   • Logs incidents to CHANGES (global) and IdentityHistory/{uid}/danger (per-user)
//   • Never mutates identity documents
//   • Never exposes forensic data to clients
//   • Never blocks or intervenes — it only reports
//
// This is the OS’s “black box” for security events.
//
// ============================================================================
// WHAT THIS FILE IS
// ----------------------------------------------------------------------------
//   ✔ A legacy Firebase HTTPS endpoint for security reporting
//   ✔ A deterministic forensic logger
//   ✔ A stable, backward-compatible security component
//
// WHAT THIS FILE IS NOT
// ----------------------------------------------------------------------------
//   ✘ NOT a Netlify function
//   ✘ NOT a scoring engine
//   ✘ NOT business logic
//   ✘ NOT identity mutation
//
// ============================================================================
// DEPLOYMENT
// ----------------------------------------------------------------------------
//   • Runs ONLY on Firebase Functions (legacy).
//   • Must remain stable until fully migrated.
//   • No new Firebase Functions should be added.
//
// ============================================================================
// SAFETY CONTRACT (v6.3)
// ----------------------------------------------------------------------------
//   • Always validate “reason”
//   • Never mutate identity documents
//   • Never expose forensic metadata
//   • IP extraction must remain defensive
//   • This endpoint is security-critical — changes ripple across identity + fraud systems
//
// ============================================================================

import { onRequest } from "firebase-functions/v2/https";
import admin from "firebase-admin";

if (!admin.apps.length) admin.initializeApp();
const db = admin.firestore();

// ============================================================================
// LAYER CONSTANTS + DIAGNOSTICS
// ============================================================================
const LAYER_ID = "SECURITY-LAYER";
const LAYER_NAME = "THE REPORTER";
const LAYER_ROLE = "FORENSIC INCIDENT LOGGING";

const REPORTER_DIAGNOSTICS_ENABLED =
  process.env.PULSE_REPORTER_DIAGNOSTICS === "true" ||
  process.env.PULSE_DIAGNOSTICS === "true";

const logReporter = (stage, details = {}) => {
  if (!REPORTER_DIAGNOSTICS_ENABLED) return;

  console.log(
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
// BACKEND ENTRY POINT — “THE REPORTER’S NOTEBOOK”
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
      // ⭐ VALIDATION
      // -----------------------------------------------------------------------
      if (!reason) {
        logReporter("MISSING_REASON", {});
        return res.status(400).json({
          success: false,
          error: "Missing reason"
        });
      }

      // -----------------------------------------------------------------------
      // ⭐ FORENSIC IP EXTRACTION
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
      // ⭐ FORENSIC PAYLOAD CONSTRUCTION
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
      // ⭐ GLOBAL LOG (CHANGES)
      // -----------------------------------------------------------------------
      await db.collection("CHANGES").add({
        type: "suspiciousClient",
        ...payload
      });

      logReporter("GLOBAL_LOG_WRITTEN", { uid });

      // -----------------------------------------------------------------------
      // ⭐ PER-USER LOG (IdentityHistory/{uid}/danger)
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
      console.error("reportSuspiciousClient error", err);

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
