// ============================================================================
// FILE: /apps/netlify/functions/timerLogout.js
// PULSE RESET ENGINE — v7.1+
// “THE AUTONOMIC RESET ORGAN / HOMEOSTATIC RESTORATION ENGINE”
// ============================================================================
//
// ROLE (v7.1+):
//   timerLogout is the **AUTONOMIC RESET ORGAN** of PulseOS.
//   It is the **HOMEOSTATIC RESTORATION ENGINE** — the subsystem that
//   restores baseline state, resets inactive users, repairs lineage,
//   and reconstructs missing pulse history snapshots.
//
//   • Logs out inactive users (parasympathetic reset)
//   • Repairs loyalty state (homeostasis)
//   • Fixes missing pulse history snapshots (memory recollection)
//   • Ensures lineage integrity (baseline restoration)
//   • Writes reset logs for diagnostics
//
// WHAT THIS FILE *IS* (v7.1+):
//   ✔ A deterministic autonomic reset engine
//   ✔ A lineage repair + recollection subsystem
//   ✔ A population integrity maintainer
//
// WHAT THIS FILE *IS NOT*:
//   ✘ NOT a scheduler (The Heart calls this)
//   ✘ NOT a scoring engine
//   ✘ NOT a security sweep
//   ✘ NOT a router
//
// SAFETY CONTRACT (v7.1+):
//   • Never mutate root tokens
//   • Only reset session + loyalty state
//   • Always repair missing snapshots deterministically
//   • Always log lineage corrections
//   • Fail‑open per user: errors logged, reset continues
//
// VERSION TAG:
//   version: 7.1+
// ============================================================================

import * as admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";

if (!admin.apps.length) {
  admin.initializeApp();
}
const db = getFirestore();

// ============================================================================
// LAYER CONSTANTS + DIAGNOSTICS
// ============================================================================
const LAYER_ID = "AUTONOMIC-RESET-LAYER";
const LAYER_NAME = "THE AUTONOMIC RESET ORGAN";
const LAYER_ROLE = "HOMEOSTATIC RESTORATION ENGINE";

const CUSTODIAN_DIAGNOSTICS_ENABLED =
  process.env.PULSE_CUSTODIAN_DIAGNOSTICS === "true" ||
  process.env.PULSE_DIAGNOSTICS === "true";

const logCustodian = (stage, details = {}) => {
  if (!CUSTODIAN_DIAGNOSTICS_ENABLED) return;

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
// BACKEND ENTRY POINT — “AUTONOMIC RESET REFLEX”
// ============================================================================
export async function timerLogout() {
  const runId = crypto.randomUUID();
  const logId = `LOGOUT_${runId}`;
  const errorPrefix = `ERR_${runId}_`;

  const userChanges = {};
  const pulseChanges = {};

  logCustodian("RESET_START", { runId });

  try {
    const now = Date.now();
    const cutoff = new Date(now - 15 * 60 * 1000);

    // ---------------------------------------------------------
    // ⭐ 1. LOAD SETTINGS (homeostatic parameters)
    // ---------------------------------------------------------
    let settings = {};
    let seasonalActive = false;
    let seasonalName = null;
    let seasonalMultiplier = 1;
    let calculationVersion = 1;

    try {
      const settingsSnap = await db.collection("TPSettings").doc("global").get();
      settings = settingsSnap.exists ? settingsSnap.data() : {};

      const season = getSeasonFromSettings(settings);
      seasonalActive = season.seasonalActive;
      seasonalName = season.seasonalName;
      seasonalMultiplier = season.seasonalMultiplier;

      calculationVersion = settings.calculationVersion ?? 1;

      logCustodian("SETTINGS_LOADED", { seasonalActive, seasonalName });

    } catch (err) {
      logCustodian("SETTINGS_ERROR", { message: String(err) });

      await db.collection("FUNCTION_ERRORS").doc(`${errorPrefix}SETTINGS`).set({
        fn: "timerLogout",
        stage: "settings_load",
        error: String(err),
        runId,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }

    // ---------------------------------------------------------
    // ⭐ 2. LOGOUT USERS (parasympathetic reset)
// ---------------------------------------------------------
    try {
      const snap = await db.collection("Users")
        .where("TPSecurity.lastAppActive", "<", cutoff)
        .where("TPSecurity.isLoggedIn", "==", true)
        .get();

      logCustodian("LOGOUT_QUERY", { count: snap.size });

      for (const docSnap of snap.docs) {
        const uid = docSnap.id;

        try {
          const u = docSnap.data() || {};
          const TPLoyalty = u.TPLoyalty || {};

          const correctedLoyalty = {
            ...TPLoyalty,
            seasonalActive,
            seasonalName,
            seasonalMultiplier,
            streakMultiplier: TPLoyalty.streakMultiplier ?? 1,
            streakCount: TPLoyalty.streakCount ?? 0,
            streakExpires: TPLoyalty.streakExpires ?? null,
            calculationVersion,
            updated: admin.firestore.FieldValue.serverTimestamp()
          };

          await docSnap.ref.update({
            "TPSecurity.isLoggedIn": false,
            "TPLoyalty": correctedLoyalty
          });

          userChanges[uid] = "LogoutCHANGE";

          logCustodian("USER_LOGOUT", { uid });

        } catch (err) {
          userChanges[uid] = "LogoutNOCHANGE";

          logCustodian("USER_LOGOUT_ERROR", { uid, message: String(err) });

          await db.collection("FUNCTION_ERRORS").doc(`${errorPrefix}${uid}`).set({
            fn: "timerLogout",
            stage: "logout_update",
            uid,
            error: String(err),
            runId,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
          });
        }
      }

    } catch (err) {
      logCustodian("LOGOUT_BLOCK_ERROR", { message: String(err) });

      await db.collection("FUNCTION_ERRORS").doc(`${errorPrefix}LOGOUT_BLOCK`).set({
        fn: "timerLogout",
        stage: "logout_block",
        error: String(err),
        runId,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }

    // ---------------------------------------------------------
    // ⭐ 3. FIX PULSE HISTORY (memory recollection)
// ---------------------------------------------------------
    try {
      const usersSnap = await db.collection("Users").get();

      logCustodian("PULSE_QUERY_USERS", { count: usersSnap.size });

      for (const userDoc of usersSnap.docs) {
        const uid = userDoc.id;

        try {
          const histRef = db.collection("PulseHistory").doc(uid).collection("entries");
          const histSnap = await histRef.where("pointsSnapshot", "==", null).limit(50).get();

          if (histSnap.empty) continue;

          logCustodian("PULSE_MISSING", { uid, count: histSnap.size });

          for (const entry of histSnap.docs) {
            const entryKey = `${uid}/${entry.id}`;

            try {
              const h = entry.data();

              const snapshot = {
                type: h.type,
                label: h.label,
                amount: h.amount,
                basePoints: h.amount,
                tierMultiplier: h.tierMultiplier ?? 1,
                streakMultiplier: h.streakMultiplier ?? 1,
                seasonalMultiplier,
                tierBonusPoints: 0,
                streakBonusPoints: 0,
                seasonalBonusPoints: 0,
                fastDeliveryBonus: 0,
                delayPenalty: 0,
                totalPointsEarned: h.amount,
                seasonalActive,
                seasonalName,
                calculationVersion,
                ts: h.ts ?? now,
                createdAt: h.createdAt ?? now
              };

              await entry.ref.update({ pointsSnapshot: snapshot });

              pulseChanges[entryKey] = "LogoutCHANGE";

              logCustodian("PULSE_REPAIRED", { entryKey });

            } catch (err) {
              pulseChanges[entryKey] = "LogoutNOCHANGE";

              logCustodian("PULSE_REPAIR_ERROR", {
                entryKey,
                message: String(err)
              });

              await db.collection("FUNCTION_ERRORS").doc(`${errorPrefix}${entryKey.replace("/", "_")}`).set({
                fn: "timerLogout",
                stage: "pulsehistory_fix",
                uid,
                entryId: entry.id,
                error: String(err),
                runId,
                createdAt: admin.firestore.FieldValue.serverTimestamp()
              });
            }
          }

        } catch (err) {
          logCustodian("PULSE_QUERY_ERROR", { uid, message: String(err) });

          await db.collection("FUNCTION_ERRORS").doc(`${errorPrefix}${uid}`).set({
            fn: "timerLogout",
            stage: "pulsehistory_query",
            uid,
            error: String(err),
            runId,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
          });
        }
      }

    } catch (err) {
      logCustodian("PULSE_BLOCK_ERROR", { message: String(err) });

      await db.collection("FUNCTION_ERRORS").doc(`${errorPrefix}PULSE_BLOCK`).set({
        fn: "timerLogout",
        stage: "pulse_block",
        error: String(err),
        runId,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }

    // ---------------------------------------------------------
    // ⭐ 4. ALWAYS WRITE TIMER LOG
    // ---------------------------------------------------------
    await db.collection("TIMER_LOGS").doc(logId).set({
      fn: "timerLogout",
      runId,
      users: userChanges,
      pulseHistory: pulseChanges,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    logCustodian("RESET_COMPLETE", { runId });

  } catch (err) {
    // ---------------------------------------------------------
    // ⭐ 5. FATAL ERROR
    // ---------------------------------------------------------
    logCustodian("FATAL_ERROR", { message: String(err) });

    await db.collection("FUNCTION_ERRORS").doc(`ERR_FATAL_${runId}`).set({
      fn: "timerLogout",
      stage: "fatal",
      error: String(err),
      runId,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
  }

  return {
    ok: true,
    runId,
    users: userChanges,
    pulseHistory: pulseChanges
  };
}
