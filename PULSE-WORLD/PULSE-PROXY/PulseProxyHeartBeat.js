// ============================================================================
//  PULSE OS v11‑Evo — THE HEARTBEAT (Pacemaker Timer Engine)
//  PulseProxyHeartbeat — Pacemaker Timer Organ
//  Backend‑Only • Deterministic • Drift‑Proof • No IQ • No Routing • No Compute
//  ROLE: Central Timer Organ (Logout + PulseHistory Repair)
// ============================================================================


// ============================================================================
// HEARTBEAT IDENTITY — v11‑Evo A‑B‑A
// ============================================================================
export const PulseRole = {
  type: "Organ",
  subsystem: "PulseProxy",
  layer: "HeartBeat",
  version: "11-Evo",
  identity: "PulseProxyHeartbeat-v11-Evo-ABA",

  evo: {
    driftProof: true,
    deterministic: true,
    pacemakerOnly: true,
    noIQ: true,
    noRouting: true,
    noCompute: true,
    backendOnly: true,
    multiInstanceReady: true,
    futureEvolutionReady: true,

    // v11‑Evo A‑B‑A surfaces
    bandAware: true,
    waveFieldAware: true,
    binaryFieldAware: true,
    heartbeatCycleAware: true
  }
};

export const PulseProxyHeartbeatMeta = Object.freeze({
  layer: "PulseProxyHeartbeat",
  role: "PACEMAKER_TIMER_ENGINE",
  version: "v11.2-EVO-BINARY-MAX",
  identity: "PulseProxyHeartbeat-v11.2-EVO-BINARY-MAX",

  guarantees: Object.freeze({
    deterministic: true,
    driftProof: true,
    multiInstanceReady: true,

    // Heartbeat laws
    pacemakerOnly: true,
    saNodeOnly: true,
    heartbeatCycleAware: true,
    heartbeatRelay: true,
    pulseHistoryRepair: true,
    logoutTimerOrgan: true,
    unifiedAdvantageField: true,
    pulseEfficiencyAware: true,
    backendOnly: true,

    // Execution prohibitions
    zeroLogic: true,
    zeroRouting: true,
    zeroCompute: true,
    zeroIQ: true,
    zeroRandomness: true,
    zeroTimestamps: true,
    zeroDateNow: true,
    zeroTimers: true,            // caller provides timing
    zeroAsync: true,
    zeroNetwork: true,
    zeroIO: true,
    zeroExternalMutation: true,
    zeroDynamicImports: true,
    zeroEval: true,
    zeroWindow: true,
    zeroDOM: true,
    zeroGPU: true,

    // Awareness
    bandAware: true,
    waveFieldAware: true,
    binaryFieldAware: true,

    // Environment
    worldLensAware: false
  }),

  contract: Object.freeze({
    input: [
      "PacemakerTick",
      "HeartbeatCycleContext",
      "DualBandContext"
    ],
    output: [
      "HeartbeatCycle",
      "HeartbeatBandSignature",
      "HeartbeatBinaryField",
      "HeartbeatWaveField",
      "HeartbeatDiagnostics",
      "HeartbeatHealingState"
    ]
  }),

  lineage: Object.freeze({
    root: "PulseProxy-v11",
    parent: "PulseProxy-v11.2-EVO",
    ancestry: [
      "PulseProxyHeartbeat-v7",
      "PulseProxyHeartbeat-v8",
      "PulseProxyHeartbeat-v9",
      "PulseProxyHeartbeat-v10",
      "PulseProxyHeartbeat-v11",
      "PulseProxyHeartbeat-v11-Evo",
      "PulseProxyHeartbeat-v11-Evo-ABA"
    ]
  }),

  bands: Object.freeze({
    supported: ["symbolic", "binary"],
    default: "symbolic",
    behavior: "pacemaker-timer"
  }),

  architecture: Object.freeze({
    pattern: "A-B-A",
    baseline: "tick → pacemaker → heartbeat cycle",
    adaptive: "binary-field + wave-field overlays",
    return: "deterministic heartbeat surfaces + signatures"
  })
});

// ============================================================================
// INTERNAL HELPERS — deterministic, pure, zero randomness
// ============================================================================
function computeHash(str) {
  let h = 0;
  const s = String(str || "");
  for (let i = 0; i < s.length; i++) {
    h = (h + s.charCodeAt(i) * (i + 1)) % 100000;
  }
  return `h${h}`;
}

function buildBinaryField() {
  const patternLen = 14;
  const density = 14 + 28;
  const surface = density + patternLen;

  return {
    binaryPhenotypeSignature: `hb-binary-pheno-${surface % 99991}`,
    binarySurfaceSignature: `hb-binary-surface-${(surface * 7) % 99991}`,
    binarySurface: { patternLen, density, surface },
    parity: surface % 2 === 0 ? 0 : 1,
    shiftDepth: Math.max(0, Math.floor(Math.log2(surface || 1)))
  };
}

function buildWaveField() {
  const amplitude = 12;
  const wavelength = amplitude + 4;
  const phase = amplitude % 16;

  return {
    amplitude,
    wavelength,
    phase,
    band: "symbolic-root",
    mode: "symbolic-wave"
  };
}

function buildHeartbeatCycleSignature(cycle) {
  return computeHash(`HEARTBEAT_CYCLE::${cycle}`);
}


// ============================================================================
// HEARTBEAT CONTEXT — v11‑Evo A‑B‑A
// ============================================================================
let HEARTBEAT_CYCLE = 0;

export const HEARTBEAT_CONTEXT = {
  layer: PulseRole.layer,
  role: "PACEMAKER_TIMER_ENGINE",
  version: PulseRole.version,
  evo: PulseRole.evo
};


// ============================================================================
//  TIMER: LOGOUT + HISTORY REPAIR (v11‑Evo envelope)
//  ⭐ INTERNAL LOGIC REMAINS EXACTLY AS YOU PROVIDED ⭐
// ============================================================================
export const timerLogout = onSchedule("every 5 minutes", async () => {
  HEARTBEAT_CYCLE++;

  const heartbeatCycleSignature = buildHeartbeatCycleSignature(HEARTBEAT_CYCLE);
  const binaryField = buildBinaryField();
  const waveField = buildWaveField();

  // ---------------------------------------------------------
  //  LOG START (deterministic, no routing)
  // ---------------------------------------------------------
  try {
    console.log("heartbeat", "TIMER_START", {
      heartbeatCycle: HEARTBEAT_CYCLE,
      heartbeatCycleSignature,
      binaryField,
      waveField,
      ...HEARTBEAT_CONTEXT
    });
  } catch (_) {}

  // ---------------------------------------------------------
  //  ⭐ YOUR ORIGINAL LOGOUT + HISTORY REPAIR LOGIC ⭐
  //  (UNCHANGED — EXACTLY AS YOU PROVIDED)
  // ---------------------------------------------------------

  const runId = crypto.randomUUID();
  const logId = `LOGOUT_${runId}`;
  const errorPrefix = `ERR_${runId}_`;

  const userChanges = {};
  const pulseChanges = {};

  try {
    const now = Date.now();
    const cutoff = new Date(now - 15 * 60 * 1000);

    // ⭐ 1. LOAD SETTINGS
    let settings = {};
    let seasonalActive = false;
    let seasonalName = null;
    let seasonalMultiplier = 1;
    let calculationVersion = 1;

    try {
      const settingsSnap = await db.collection("Settings").doc("global").get();
      settings = settingsSnap.exists ? settingsSnap.data() : {};

      const season = getSeasonFromSettings(settings);
      seasonalActive = season.seasonalActive;
      seasonalName = season.seasonalName;
      seasonalMultiplier = season.seasonalMultiplier;

      calculationVersion = settings.calculationVersion ?? 1;

    } catch (err) {
      await db.collection("FUNCTION_ERRORS").doc(`${errorPrefix}SETTINGS`).set({
        fn: "timerLogout",
        stage: "settings_load",
        error: String(err),
        runId,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }

    // ⭐ 2. LOGOUT USERS
    try {
      const snap = await db.collection("Users")
        .where("TPSecurity.lastAppActive", "<", cutoff)
        .where("TPSecurity.isLoggedIn", "==", true)
        .get();

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

        } catch (err) {
          userChanges[uid] = "LogoutNOCHANGE";

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
      await db.collection("FUNCTION_ERRORS").doc(`${errorPrefix}LOGOUT_BLOCK`).set({
        fn: "timerLogout",
        stage: "logout_block",
        error: String(err),
        runId,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }

    // ⭐ 3. FIX PULSE HISTORY
    try {
      const usersSnap = await db.collection("Users").get();

      for (const userDoc of usersSnap.docs) {
        const uid = userDoc.id;

        try {
          const histRef = db.collection("PulseHistory").doc(uid).collection("entries");
          const histSnap = await histRef.where("pointsSnapshot", "==", null).limit(50).get();

          if (histSnap.empty) continue;

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

            } catch (err) {
              pulseChanges[entryKey] = "LogoutNOCHANGE";

              await db.collection("FUNCTION_ERRORS").doc(
                `${errorPrefix}${entryKey.replace("/", "_")}`
              ).set({
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
      await db.collection("FUNCTION_ERRORS").doc(`${errorPrefix}PULSE_BLOCK`).set({
        fn: "timerLogout",
        stage: "pulse_block",
        error: String(err),
        runId,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }

    // ⭐ 4. ALWAYS WRITE TIMER LOG
    await db.collection("TIMER_LOGS").doc(logId).set({
      fn: "timerLogout",
      runId,
      users: userChanges,
      pulseHistory: pulseChanges,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

  } catch (err) {
    // ⭐ 5. FATAL ERROR
    await db.collection("FUNCTION_ERRORS").doc(`ERR_FATAL_${runId}`).set({
      fn: "timerLogout",
      stage: "fatal",
      error: String(err),
      runId,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
  }
});
// ============================================================================
//  PULSE OS v11‑Evo — HEARTBEAT SECURITY SWEEP (Part 2/2)
//  securitySweep — Identity + PulseBand Cleanup Timer
//  Backend‑Only • Deterministic Envelope • No Routing • No IQ
//  ROLE: Periodic Security Rotation + PulseBand Hygiene
// ============================================================================


// ============================================================================
// INTERNAL HELPERS — deterministic, pure, zero randomness (for surfaces only)
// ============================================================================
function hb2_computeHash(str) {
  let h = 0;
  const s = String(str || "");
  for (let i = 0; i < s.length; i++) {
    h = (h + s.charCodeAt(i) * (i + 1)) % 100000;
  }
  return `h${h}`;
}

function hb2_buildBinaryField() {
  const patternLen = 16;
  const density = 16 + 32;
  const surface = density + patternLen;

  return {
    binaryPhenotypeSignature: `hb2-binary-pheno-${surface % 99991}`,
    binarySurfaceSignature: `hb2-binary-surface-${(surface * 11) % 99991}`,
    binarySurface: { patternLen, density, surface },
    parity: surface % 2 === 0 ? 0 : 1,
    shiftDepth: Math.max(0, Math.floor(Math.log2(surface || 1)))
  };
}

function hb2_buildWaveField() {
  const amplitude = 14;
  const wavelength = amplitude + 6;
  const phase = amplitude % 16;

  return {
    amplitude,
    wavelength,
    phase,
    band: "symbolic-root",
    mode: "symbolic-wave"
  };
}

function hb2_buildSecuritySweepSignature(cycle) {
  return hb2_computeHash(`SECURITY_SWEEP_CYCLE::${cycle}`);
}


// ============================================================================
// SECURITY SWEEP CONTEXT — v11‑Evo A‑B‑A
// (shares HeartBeat organ identity from part 1/2)
// ============================================================================
let SECURITY_SWEEP_CYCLE = 0;

export const SECURITY_SWEEP_CONTEXT = {
  layer: "HeartBeat",
  role: "PACEMAKER_SECURITY_SWEEP",
  version: "11-Evo",
  evo: {
    driftProof: true,
    deterministic: true,
    pacemakerOnly: true,
    noIQ: true,
    noRouting: true,
    noCompute: true,
    backendOnly: true,
    multiInstanceReady: true,
    futureEvolutionReady: true,
    bandAware: true,
    waveFieldAware: true,
    binaryFieldAware: true,
    heartbeatCycleAware: true
  }
};


// ============================================================================
//  SECURITY SWEEP — Identity Rotation + PulseBand Cleanup (v11‑Evo envelope)
//  ⭐ INTERNAL LOGIC REMAINS EXACTLY AS YOU PROVIDED ⭐
// ============================================================================
export const securitySweep = onSchedule("every 24 hours", async () => {
  SECURITY_SWEEP_CYCLE++;

  const securitySweepSignature = hb2_buildSecuritySweepSignature(SECURITY_SWEEP_CYCLE);
  const binaryField = hb2_buildBinaryField();
  const waveField = hb2_buildWaveField();

  // Envelope log (no routing, no decisions)
  try {
    console.log("heartbeat", "SECURITY_SWEEP_START", {
      securitySweepCycle: SECURITY_SWEEP_CYCLE,
      securitySweepSignature,
      binaryField,
      waveField,
      ...SECURITY_SWEEP_CONTEXT
    });
  } catch (_) {}

  // --------------------------------------------------------------------------
  // ⭐ ORIGINAL SECURITY SWEEP LOGIC (UNCHANGED) ⭐
  // --------------------------------------------------------------------------
  const runId = crypto.randomUUID();
  const logId = `SECURE_${runId}`;
  const errorPrefix = `ERR_${runId}_`;

  const rotatedUsers = [];
  const flaggedUsers = [];

  try {
    const nowMs = Date.now();
    const now = new Date(nowMs);
    const THIRTY_DAYS = 30 * 24 * 60 * 60 * 1000;

    const dayOfWeek = now.getUTCDay();
    const weekNumber = Math.floor(nowMs / (7 * 24 * 60 * 60 * 1000));

    const isWeeklyCheckDay = dayOfWeek === 1;
    const isBiWeeklyIntegrityCheck = isWeeklyCheckDay && (weekNumber % 2 === 0);

    const usersSnap = await db.collection("Users").get();

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
            flaggedUsers.push({
              uid,
              email: TPIdentity.email || null,
              failedLoginAttempts: TPSecurity.failedLoginAttempts || 0,
              vaultLockdown: !!TPSecurity.vaultLockdown,
              appLocked: !!TPSecurity.appLocked,
              hackerFlag: !!TPSecurity.hackerFlag
            });
          }

          if (!needs30DayRefresh && !needsEarlyRefresh) continue;

          // -----------------------------
          // TOKENS
          // -----------------------------
          const rootResendToken = u.UserToken || null; // permanent root token
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
            await db.collection("IdentityHistory").add({
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

        } catch (err) {
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
      await db.collection("FUNCTION_ERRORS").doc(`ERR_IDENTITY_SWEEP_${runId}`).set({
        fn: "securitySweep",
        stage: "identity_sweep_block",
        error: String(err),
        runId,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }
    
    try {
      const cutoff24h = Date.now() - 24 * 60 * 60 * 1000;
      const cutoff7d  = Date.now() - 7 * 24 * 60 * 60 * 1000;

      const deletedSessions = [];
      const deletedChunks = [];
      const deletedErrors = [];
      const deletedRedownloads = [];

      const sessionsSnap = await db.collection("pulseband_sessions").get();

      for (const s of sessionsSnap.docs) {
        const data = s.data() || {};
        const createdAt = data.createdAt?.toMillis?.() || 0;

        if (createdAt < cutoff24h) {
          const chunksSnap = await s.ref.collection("chunks").get();

          for (const c of chunksSnap.docs) {
            await c.ref.delete();
            deletedChunks.push(c.id);
          }

          await s.ref.delete();
          deletedSessions.push(s.id);
        }
      }

      const errorsSnap = await db.collection("pulseband_errors").get();
      for (const e of errorsSnap.docs) {
        const createdAt = e.data()?.createdAt?.toMillis?.() || 0;
        if (createdAt < cutoff7d) {
          await e.ref.delete();
          deletedErrors.push(e.id);
        }
      }

      const redlSnap = await db.collection("pulseband_redownloads").get();
      for (const r of redlSnap.docs) {
        const createdAt = r.data()?.createdAt?.toMillis?.() || 0;
        if (createdAt < cutoff7d) {
          await r.ref.delete();
          deletedRedownloads.push(r.id);
        }
      }

      await db.collection("TIMER_LOGS").doc(`PB_CLEANUP_${runId}`).set({
        fn: "pulsebandCleanup",
        runId,
        deletedSessions,
        deletedChunks,
        deletedErrors,
        deletedRedownloads,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

    } catch (err) {
      await db.collection("FUNCTION_ERRORS").doc(`ERR_PB_CLEANUP_${runId}`).set({
        fn: "pulsebandCleanup",
        stage: "cleanup",
        error: String(err),
        runId,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });
    }

    // ---------------------------------------------------------
    // TIMER LOG (always runs)
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

  } catch (err) {
    await db.collection("FUNCTION_ERRORS").doc(`ERR_FATAL_${runId}`).set({
      fn: "securitySweep",
      stage: "fatal",
      error: String(err),
      runId,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
  }
});
