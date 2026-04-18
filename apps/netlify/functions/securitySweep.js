// ============================================================================
// FILE: /apps/netlify/functions/securitySweep.js
// PULSE SECURITY SWEEP — v6.3
// “THE RELIABILITY OFFICER / TRUST ENFORCEMENT ENGINE”
// ============================================================================
//
// ⭐ v6.3 COMMENT LOG
// - THEME: “THE RELIABILITY OFFICER / TRUST ENFORCEMENT ENGINE”
// - ROLE: Scheduled identity integrity + trust enforcement across the graph
// - Added LAYER CONSTANTS + DIAGNOSTICS helper
// - Added structured JSON logs (for inspector / DOM-visible pipelines)
// - Added explicit STAGE markers for sweep phases
// - Preserved deterministic rotation + flagging behavior
// - ZERO logic changes to security rules, Firestore writes, or rotation logic
//
// ============================================================================
// PERSONALITY + ROLE — “THE RELIABILITY OFFICER”
// ----------------------------------------------------------------------------
// securitySweep is the **RELIABILITY OFFICER** of the Pulse OS.
// It is the **TRUST ENFORCEMENT ENGINE** — responsible for walking the
// entire identity graph on a schedule and ensuring that tokens, flags,
// and security state remain trustworthy, consistent, and safe.
//
//   • Performs daily + weekly + bi‑weekly integrity sweeps
//   • Detects danger flags (vaultLockdown, appLocked, hackerFlag, etc.)
//   • Detects IP jumps + device jumps
//   • Decides when identities need early refresh vs. 30‑day rotation
//   • Rotates session tokens (resendToken) deterministically
//   • Logs identity changes to TPIdentityHistory
//   • Updates Users records with corrected security state
//   • Produces rotatedUsers + flaggedUsers for downstream monitoring
//
// ============================================================================
// WHAT THIS FILE IS
// ----------------------------------------------------------------------------
//   ✔ A deterministic identity integrity sweep
//   ✔ A trust maintenance + reliability enforcement layer
//   ✔ A heartbeat‑driven backend function (no external scheduler)
//
// WHAT THIS FILE IS NOT
// ----------------------------------------------------------------------------
//   ✘ NOT a router
//   ✘ NOT a scoring engine
//   ✘ NOT a generic cleanup function
//   ✘ NOT a personality or memory layer
//
// ============================================================================
// SAFETY CONTRACT (v6.3)
// ----------------------------------------------------------------------------
//   • Never mutate root tokens (UserToken)
//   • Only rotate session tokens (TPIdentity.resendToken)
//   • Always log identity changes to TPIdentityHistory
//   • Always record danger flags + sweep metadata in TIMER_LOGS
//   • Fail‑open per user: errors are logged, sweep continues
//
// ============================================================================

import * as admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import jwt from "jsonwebtoken"; // ensure this is installed
import { JWT_SECRET } from "./secrets.js"; // adjust path as needed

if (!admin.apps.length) {
  admin.initializeApp();
}
const db = getFirestore();

// ============================================================================
// LAYER CONSTANTS + DIAGNOSTICS
// ============================================================================
const LAYER_ID = "SECURITY-SWEEP-LAYER";
const LAYER_NAME = "THE RELIABILITY OFFICER";
const LAYER_ROLE = "TRUST ENFORCEMENT ENGINE";

const SECURITY_SWEEP_DIAGNOSTICS_ENABLED =
  process.env.PULSE_SECURITY_SWEEP_DIAGNOSTICS === "true" ||
  process.env.PULSE_DIAGNOSTICS === "true";

const logReliability = (stage, details = {}) => {
  if (!SECURITY_SWEEP_DIAGNOSTICS_ENABLED) return;

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
// BACKEND ENTRY POINT (CALLED BY HEARTBEAT)
// ============================================================================
export async function securitySweep() {
  const runId = crypto.randomUUID();
  const logId = `SECURE_${runId}`;
  const errorPrefix = `ERR_${runId}_`;

  const rotatedUsers = [];
  const flaggedUsers = [];

  logReliability("RUN_START", { runId });

  try {
    const nowMs = Date.now();
    const now = new Date(nowMs);
    const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

    const dayOfWeek = now.getUTCDay();
    const weekNumber = Math.floor(nowMs / (7 * 24 * 60 * 60 * 1000));

    const isWeeklyCheckDay = dayOfWeek === 1;
    const isBiWeeklyIntegrityCheck = isWeeklyCheckDay && (weekNumber % 2 === 0);

    const usersSnap = await db.collection("Users").get();

    logReliability("USERS_LOADED", {
      runId,
      userCount: usersSnap.size,
      isWeeklyCheckDay,
      isBiWeeklyIntegrityCheck
    });

    // ---------------------------------------------------------
    // ⭐ 1. IDENTITY SWEEP (PER‑USER RELIABILITY PASS)
    // ---------------------------------------------------------
    try {
      for (const doc of usersSnap.docs) {
        const uid = doc.id;

        try {
          const u = doc.data() || {};
          const TPIdentity = u.TPIdentity || {};
          const TPSecurity = u.TPSecurity || {};

          // -----------------------------
          // TIMESTAMP NORMALIZATION
          // -----------------------------
          let lastJWT = null;

          if (TPIdentity.lastJWTIssuedAt) {
            if (typeof TPIdentity.lastJWTIssuedAt.toMillis === "function") {
              lastJWT = TPIdentity.lastJWTIssuedAt.toMillis();
            } else if (TPIdentity.lastJWTIssuedAt._seconds) {
              lastJWT = TPIdentity.lastJWTIssuedAt._seconds * 1000;
            } else if (typeof TPIdentity.lastJWTIssuedAt === "number") {
              lastJWT = TPIdentity.lastJWTIssuedAt;
            }
          }

          const age = lastJWT ? nowMs - lastJWT : Infinity;
          const needs30DayRefresh = age > THIRTY_DAYS;

          // -----------------------------
          // SECURITY FLAGS
          // -----------------------------
          const danger =
            TPSecurity.vaultLockdown ||
            TPSecurity.appLocked ||
            TPSecurity.hackerFlag ||
            TPSecurity.forceIdentityRefresh ||
            (TPSecurity.failedLoginAttempts > 5);

          const ipJump =
            TPSecurity.lastKnownIP &&
            TPSecurity.previousIP &&
            TPSecurity.lastKnownIP !== TPSecurity.previousIP;

          const deviceJump =
            TPSecurity.lastKnownDevice &&
            TPSecurity.previousDevice &&
            TPSecurity.lastKnownDevice !== TPSecurity.previousDevice;

          const needsEarlyRefresh = danger || ipJump || deviceJump;

          const totalFlags =
            (TPSecurity.failedLoginAttempts || 0) +
            (TPSecurity.hackerFlag ? 3 : 0) +
            (TPSecurity.vaultLockdown ? 5 : 0) +
            (TPSecurity.appLocked ? 5 : 0);

          if (totalFlags >= 10) {
            const flagged = {
              uid,
              email: TPIdentity.email || null,
              failedLoginAttempts: TPSecurity.failedLoginAttempts || 0,
              vaultLockdown: !!TPSecurity.vaultLockdown,
              appLocked: !!TPSecurity.appLocked,
              hackerFlag: !!TPSecurity.hackerFlag
            };
            flaggedUsers.push(flagged);

            logReliability("USER_FLAGGED", {
              runId,
              uid,
              ...flagged
            });
          }

          if (!needs30DayRefresh && !needsEarlyRefresh) continue;

          // -----------------------------
          // ROOT TOKEN (PERMANENT)
          // -----------------------------
          const rootResendToken = u.UserToken || null;

          // -----------------------------
          // SESSION TOKEN (ROTATING)
          // -----------------------------
          const oldSessionToken = TPIdentity.resendToken || null;

          let newSessionToken;
          try {
            newSessionToken = jwt.sign(
              {
                uid,
                email: TPIdentity.email || null,
                name: TPIdentity.name || TPIdentity.displayName || null
              },
              JWT_SECRET.value(),
              { expiresIn: "30d" }
            );
          } catch (err) {
            logReliability("JWT_SIGN_ERROR", {
              runId,
              uid,
              message: String(err)
            });

            await db.collection("FUNCTION_ERRORS").doc(`${errorPrefix}${uid}`).set({
              fn: "securitySweep",
              stage: "jwt_sign",
              uid,
              error: String(err),
              runId,
              createdAt: admin.firestore.FieldValue.serverTimestamp()
            });
            continue;
          }

          const reason = needsEarlyRefresh
            ? "early_security_refresh"
            : "30_day_rotation";

          // -----------------------------
          // WRITE TO TPIdentityHistory
          // -----------------------------
          try {
            await db.collection("TPIdentityHistory").add({
              uid,
              rootResendToken,
              oldSessionToken,
              newSessionToken,
              reason,
              dangerFlags: {
                vaultLockdown: TPSecurity.vaultLockdown || false,
                appLocked: TPSecurity.appLocked || false,
                hackerFlag: TPSecurity.hackerFlag || false,
                failedLoginAttempts: TPSecurity.failedLoginAttempts || 0,
                ipJump,
                deviceJump
              },
              runId,
              createdAt: admin.firestore.FieldValue.serverTimestamp()
            });
          } catch (err) {
            logReliability("IDENTITY_LOG_ERROR", {
              runId,
              uid,
              message: String(err)
            });

            await db.collection("FUNCTION_ERRORS").doc(`${errorPrefix}${uid}`).set({
              fn: "securitySweep",
              stage: "identity_log",
              uid,
              error: String(err),
              runId,
              createdAt: admin.firestore.FieldValue.serverTimestamp()
            });
            continue;
          }

          // -----------------------------
          // UPDATE USER RECORD
          // -----------------------------
          try {
            await doc.ref.update({
              "TPIdentity.resendToken": newSessionToken,
              "TPIdentity.lastJWTIssuedAt": admin.firestore.FieldValue.serverTimestamp(),

              "TPSecurity.previousIP": TPSecurity.lastKnownIP || null,
              "TPSecurity.previousDevice": TPSecurity.lastKnownDevice || null,

              "TPSecurity.lastKnownIP": TPSecurity.lastKnownIP || null,
              "TPSecurity.lastKnownDevice": TPSecurity.lastKnownDevice || null,

              "TPSecurity.forceIdentityRefresh": false
            });
          } catch (err) {
            logReliability("USER_UPDATE_ERROR", {
              runId,
              uid,
              message: String(err)
            });

            await db.collection("FUNCTION_ERRORS").doc(`${errorPrefix}${uid}`).set({
              fn: "securitySweep",
              stage: "user_update",
              uid,
              error: String(err),
              runId,
              createdAt: admin.firestore.FieldValue.serverTimestamp()
            });
            continue;
          }

          rotatedUsers.push(uid);

          logReliability("USER_ROTATED", {
            runId,
            uid,
            reason,
            ipJump,
            deviceJump,
            needsEarlyRefresh,
            needs30DayRefresh
          });

        } catch (err) {
          logReliability("USER_LOOP_ERROR", {
            runId,
            uid,
            message: String(err)
          });

          await db.collection("FUNCTION_ERRORS").doc(`${errorPrefix}${uid}`).set({
            fn: "securitySweep",
            stage: "user_loop",
            uid,
            error: String(err),
            runId,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
          });
        }
      }
    } catch (err) {
      logReliability("IDENTITY_SWEEP_BLOCK_ERROR", {
        runId,
        message: String(err)
      });

      await db.collection("FUNCTION_ERRORS").doc(`ERR_IDENTITY_SWEEP_${runId}`).set({
        fn: "securitySweep",
        stage: "identity_sweep_block",
        error: String(err),
        runId,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }

    // ---------------------------------------------------------
    // ⭐ 2. TIMER LOG (SWEEP SUMMARY)
    // ---------------------------------------------------------
    await db.collection("TIMER_LOGS").doc(logId).set({
      fn: "securitySweep",
      runId,
      rotatedUsers,
      flaggedUsers,
      sweepType: isWeeklyCheckDay ? "weekly" : "daily",
      integrityCheck: isBiWeeklyIntegrityCheck,
      rotationCount: rotatedUsers.length,
      flaggedCount: flaggedUsers.length,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    logReliability("SWEEP_SUMMARY_RECORDED", {
      runId,
      rotationCount: rotatedUsers.length,
      flaggedCount: flaggedUsers.length
    });

  } catch (err) {
    logReliability("FATAL_ERROR", {
      runId,
      message: String(err)
    });

    await db.collection("FUNCTION_ERRORS").doc(`ERR_FATAL_${runId}`).set({
      fn: "securitySweep",
      stage: "fatal",
      error: String(err),
      runId,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
  }

  logReliability("RUN_COMPLETE", {
    runId,
    rotationCount: rotatedUsers.length,
    flaggedCount: flaggedUsers.length
  });

  return {
    ok: true,
    runId,
    rotatedUsers,
    flaggedUsers
  };
}
