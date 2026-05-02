// ============================================================================
//  PulseEarnSendSystem-v13.0-PRESENCE-IMMORTAL.js
//  Earn Nervous System Conductor (v13.0 Presence‑IMMORTAL + Advantage‑M + Prewarm)
//  Deterministic Single‑Pass Earn → Pulse → Send (No async, No loops)
//  v13.0: Presence surfaces + Advantage‑M + Chunk/Prewarm + Factoring signal
// ============================================================================
//
//  SAFETY CONTRACT (v13.0-PRESENCE-IMMORTAL):
//  -----------------------------------------
//  • No async.
//  • No network.
//  • No GPU.
//  • No miner.
//  • No compute beyond structural math.
//  • Zero randomness.
//  • Zero timestamps.
//  • Zero mutation outside instance.
// ============================================================================
/*
AI_EXPERIENCE_META = {
  identity: "PulseEarnSendSystem",
  version: "v14-IMMORTAL",
  layer: "earn_send",
  role: "earn_send_conductor",
  lineage: "PulseEarnSendSystem-v10.4 → v11-Evo → v14-IMMORTAL",

  evo: {
    sendConductor: true,
    jobPackaging: true,
    jobForwarding: true,
    dualBand: true,
    symbolicPrimary: true,
    binaryAware: true,

    deterministic: true,
    driftProof: true,
    pureCompute: true,
    zeroNetwork: true,
    zeroFilesystem: true,
    zeroMutationOfInput: true
  },

  contract: {
    always: [
      "PulseSendSystem",
      "PulseEarnNervousSystem",
      "PulseEarnCell"
    ],
    never: [
      "safeRoute",
      "fetchViaCNS"
    ]
  }
}
*/

export const PulseEarnSendSystemMeta = Object.freeze({
  layer: "PulseEarnSendSystem",
  role: "EARN_SEND_CONDUCTOR",
  version: "v13.0-PRESENCE-IMMORTAL",
  identity: "PulseEarnSendSystem-v13.0-PRESENCE-IMMORTAL",

  guarantees: Object.freeze({
    deterministic: true,
    driftProof: true,
    noRandomness: true,
    noRealTime: true,
    noExternalIO: true,

    // GOVERNED laws
    governedSinglePass: true,
    governedNoLoops: true,
    governedNoAsync: true,
    governedNoNetwork: true,
    governedNoCompute: true,
    governedNoGPU: true,
    governedNoMiner: true,
    governedNoTimestamps: true,
    governedNoMutationOutsideInstance: true,

    // Band + metadata
    dualBandAware: true,
    binaryAware: true,
    waveFieldAware: true,
    healingMetadataAware: true,

    // Presence + Advantage‑M + prewarm + factoring
    presenceAware: true,
    advantageFieldAware: true,
    chunkPrewarmAware: true,
    factoringAware: true,
    continuanceAware: true,

    // Safety
    zeroUserCode: true,
    zeroDynamicImports: true,
    zeroEval: true,
    worldLensAware: false,

    // Environment
    multiInstanceReady: true
  }),

  contract: Object.freeze({
    input: [
      "EarnOrganismOrLegacyImpulse",
      "PulseSendSystem",
      "ContinuancePulse",
      "DualBandContext",
      "DevicePhenotypePresence",
      "MeshSignals",
      "ServerAdvantageHints",
      "GlobalHints"
    ],
    output: [
      "SendConductorResult",
      "SendConductorDiagnostics",
      "SendConductorSignatures",
      "SendConductorHealingState",
      "SendConductorPresenceField",
      "SendConductorAdvantageField",
      "SendConductorChunkPrewarmPlan"
    ]
  }),

  lineage: Object.freeze({
    root: "PulseOS-v13-PRESENCE-IMMORTAL",
    parent: "PulseEarn-v13.0-PRESENCE-IMMORTAL",
    ancestry: [
      "PulseEarnSendSystem-v9",
      "PulseEarnSendSystem-v10",
      "PulseEarnSendSystem-v11",
      "PulseEarnSendSystem-v11-Evo",
      "PulseEarnSendSystem-v11.2-EVO",
      "PulseEarnSendSystem-v12.3-Presence"
    ]
  }),

  bands: Object.freeze({
    supported: ["symbolic", "binary"],
    default: "symbolic",
    behavior: "metadata-only",
    priority: "binary-first"
  }),

  architecture: Object.freeze({
    pattern: "A-B-A",
    baseline: "deterministic Earn → Pulse → Send conductor",
    adaptive: "binary/wave surfaces + dual-band signatures + presence/advantage/factoring fields",
    return: "deterministic send result + healing metadata + prewarm hints"
  })
});

// Legacy bridge imports (v12.3 Earn / Continuance) kept as compatibility layer.
import { createEarn, evolveEarn } from "./PulseEarn-v12.3-Presence.js";
import { PulseEarnContinuancePulse } from "./PulseEarnContinuancePulse-v12.3-Presence.js";


// ============================================================================
//  INTERNAL HELPERS — deterministic, tiny, pure
// ============================================================================

function computeHash(str) {
  let h = 0;
  const s = String(str || "");
  for (let i = 0; i < s.length; i++) {
    h = (h + s.charCodeAt(i) * (i + 1)) % 100000;
  }
  return `h${h}`;
}

function normalizeBand(band) {
  const b = String(band || "symbolic").toLowerCase();
  return b === "binary" ? "binary" : "symbolic";
}

function clamp01(x) {
  if (x == null || Number.isNaN(x)) return 0;
  return Math.max(0, Math.min(1, x));
}

function normalizeCachePriority(p) {
  if (!p) return "normal";
  const v = String(p).toLowerCase();
  if (v === "critical" || v === "high" || v === "low") return v;
  return "normal";
}

function deriveFactoringSignalFromContext({
  meshPressureIndex = 0,
  cachePriority = "normal",
  prewarmNeeded = false
}) {
  const pressure = clamp01(meshPressureIndex / 100);
  const highPressure = pressure >= 0.7;
  const criticalCache = cachePriority === "critical";

  if (criticalCache || prewarmNeeded) return 1;
  if (highPressure) return 1;
  return 0;
}


// ============================================================================
//  HEALING STATE — Send Conductor Health Snapshot (v13.0-PRESENCE-IMMORTAL)
// ============================================================================

const sendHealing = {
  cycleCount: 0,
  lastImpulseId: null,
  lastEarnPattern: null,
  lastEarnLineageDepth: 0,
  lastFallbackUsed: false,

  lastBand: "symbolic",
  lastBandSignature: null,
  lastBinaryField: null,
  lastWaveField: null,

  lastPresenceField: null,
  lastAdvantageField: null,
  lastChunkPrewarmPlan: null,
  lastFactoringSignal: 0,

  lastSendSignature: null,
  lastError: null
};

export function getPulseEarnSendSystemHealingState() {
  return { ...sendHealing };
}


// ============================================================================
//  GOVERNOR — Earn Loop Guard (v13.0-PRESENCE-IMMORTAL)
// ============================================================================

function isEarnReentryImpulse(impulse) {
  if (!impulse || !impulse.payload) return false;

  const earn = impulse.payload.earn;
  if (!earn) return false;

  if (earn.role?.identity === "PulseEarn-v11-Evo") return true;
  if (earn.__earnEnvelope === true) return true;

  return false;
}

function tagImpulseAsEarnSent(impulse, pulseCompatibleEarn) {
  const basePayload = impulse.payload || {};

  return {
    ...impulse,
    payload: {
      ...basePayload,
      earn: {
        ...(pulseCompatibleEarn || {}),
        __earnEnvelope: true
      },
      __earnSent: true
    }
  };
}


// ============================================================================
//  LEGACY BRIDGE — Try Earn v11 / v1 (kept as compatibility path)
// ============================================================================

function tryEarnV11(impulse) {
  try {
    const baseEarn = createEarn({
      jobId: impulse.tickId,
      pattern:
        impulse.intent ||
        impulse.payload?.pattern ||
        "UNKNOWN_EARN_PATTERN",
      payload: impulse.payload || {},
      priority: impulse.payload?.priority || "normal",
      returnTo: impulse.payload?.returnTo || null,
      parentLineage: impulse.payload?.parentLineage || null,
      pageId: impulse.payload?.pageId || "NO_PAGE"
    });

    const evolved =
      typeof evolveEarn === "function"
        ? evolveEarn(baseEarn, {
            source: "PulseEarnSendSystem-v13.0-PRESENCE-IMMORTAL",
            intent: impulse.intent,
            lineage: impulse.payload?.parentLineage || null
          })
        : baseEarn;

    return { ok: true, earn: evolved || baseEarn };
  } catch (err) {
    return { ok: false, error: err };
  }
}

function buildEarnV1Continuance(impulse) {
  const cont = PulseEarnContinuancePulse.build(impulse);
  return cont.earn;
}


// ============================================================================
//  WRAP Earn organism into Pulse-compatible shape (bridge-safe)
// ============================================================================

function wrapEarnForPulse(earn) {
  return {
    PulseRole: earn.EarnRole,
    jobId: earn.jobId,
    pattern: earn.pattern,
    payload: earn.payload,
    priority: earn.priority,
    returnTo: earn.returnTo,
    lineage: earn.lineage,
    pageId: earn.pageId,
    meta: {
      ...(earn.meta || {}),
      origin: "Earn",
      earnVersion: earn.EarnRole?.version || "unknown",
      earnIdentity: earn.EarnRole?.identity || "Earn",
      earnEnvelope: true
    },

    earn: {
      role: earn.EarnRole,
      pattern: earn.pattern,
      lineage: earn.lineage,
      meta: earn.meta,
      __earnEnvelope: true
    }
  };
}


// ============================================================================
//  A-B-A Dual-Band + Binary + Wave Builder (v13.0-PRESENCE-IMMORTAL)
// ============================================================================

function buildEarnSendBandBinaryWave(earn, fallbackUsed, cycleIndex, deviceProfile) {
  const band = normalizeBand(
    earn?.meta?.band ||
    earn?.band ||
    deviceProfile?.band ||
    "symbolic"
  );

  const patternLen = String(earn.pattern || "").length;
  const lineageDepth = earn.lineage?.length || 0;
  const fallbackFlag = fallbackUsed ? 1 : 0;

  const surface =
    patternLen +
    lineageDepth +
    fallbackFlag +
    (deviceProfile?.gpuScore || 0) +
    cycleIndex;

  const binaryField = {
    binaryEarnSendSignature: computeHash(`BESEND::${surface}`),
    binarySurfaceSignature: computeHash(`BSURF_ESEND::${surface}`),
    binarySurface: {
      patternLen,
      lineageDepth,
      fallbackFlag,
      gpuScore: deviceProfile?.gpuScore || 0,
      cycle: cycleIndex,
      surface
    },
    parity: surface % 2 === 0 ? 0 : 1,
    density: patternLen + lineageDepth + (deviceProfile?.gpuScore || 0),
    shiftDepth: Math.max(0, Math.floor(Math.log2(surface || 1)))
  };

  const waveField = {
    amplitude: patternLen + (deviceProfile?.gpuScore || 0),
    wavelength: cycleIndex || 1,
    phase: (patternLen + lineageDepth + cycleIndex) % 8,
    band,
    mode: band === "binary" ? "compression-wave" : "symbolic-wave"
  };

  const bandSignature = computeHash(`BAND::ESEND::${band}::${cycleIndex}`);

  sendHealing.lastBand = band;
  sendHealing.lastBandSignature = bandSignature;
  sendHealing.lastBinaryField = binaryField;
  sendHealing.lastWaveField = waveField;

  return { band, bandSignature, binaryField, waveField };
}


// ============================================================================
//  Presence + Advantage‑M + Chunk/Prewarm + Factoring (v13.0-PRESENCE-IMMORTAL)
// ============================================================================

function buildPresenceField(earn, deviceProfile, fallbackUsed) {
  const patternLen = String(earn.pattern || "").length;
  const lineageDepth = earn.lineage?.length || 0;
  const band = normalizeBand(deviceProfile?.band || earn.band || "symbolic");

  const composite =
    patternLen * 0.001 +
    lineageDepth * 0.002 +
    (fallbackUsed ? -0.003 : 0.003) +
    (deviceProfile?.stabilityScore || 0.7) * 0.01;

  const presenceTier =
    composite >= 0.02 ? "presence_high" :
    composite >= 0.005 ? "presence_mid" :
    patternLen + lineageDepth > 0 ? "presence_low" :
    "presence_idle";

  const presenceField = {
    presenceVersion: "v13.0-PRESENCE-IMMORTAL",
    presenceTier,
    band,
    patternLen,
    lineageDepth,
    fallbackUsed
  };

  sendHealing.lastPresenceField = presenceField;
  return presenceField;
}

function buildAdvantageField({
  earn,
  deviceProfile,
  bandPack,
  presenceField,
  factoringSignal
}) {
  const gpuScore = deviceProfile?.gpuScore || 0;
  const bandwidth = deviceProfile?.bandwidthMbps || 0;
  const density = bandPack.binaryField.density || 0;
  const amplitude = bandPack.waveField.amplitude || 0;

  const advantageScore =
    gpuScore * 0.0005 +
    bandwidth * 0.0002 +
    density * 0.00001 +
    amplitude * 0.00001 +
    (presenceField.presenceTier === "presence_high" ? 0.01 : 0) +
    factoringSignal * 0.01;

  const advantageField = {
    advantageVersion: "M-13.0",
    band: bandPack.band,
    gpuScore,
    bandwidth,
    binaryDensity: density,
    waveAmplitude: amplitude,
    presenceTier: presenceField.presenceTier,
    factoringSignal,
    advantageScore
  };

  sendHealing.lastAdvantageField = advantageField;
  sendHealing.lastFactoringSignal = factoringSignal;
  return advantageField;
}

function buildChunkPrewarmPlan({
  earn,
  deviceProfile,
  presenceField,
  factoringSignal
}) {
  let priorityLabel = "normal";
  if (presenceField.presenceTier === "presence_high") priorityLabel = "high";
  else if (presenceField.presenceTier === "presence_mid") priorityLabel = "medium";
  else if (presenceField.presenceTier === "presence_low") priorityLabel = "low";
  else priorityLabel = "idle";

  const plan = {
    planVersion: "v13.0-AdvantageM",
    priorityLabel,
    bandPresence: presenceField.presenceTier,
    factoringSignal,
    chunks: {
      jobEnvelope: true,
      metabolismBlueprint: true,
      marketplaceHandshake: true
    },
    cache: {
      deviceProfile: true,
      survivalDiagnostics: true
    },
    prewarm: {
      metabolismOrgan: presenceField.presenceTier !== "presence_idle",
      lymphaticHandshake: presenceField.presenceTier !== "presence_idle",
      immuneSystemScan: presenceField.presenceTier === "presence_high"
    }
  };

  sendHealing.lastChunkPrewarmPlan = plan;
  return plan;
}


// ============================================================================
//  FACTORY — Presence‑IMMORTAL PulseEarnSendSystem (v13.0)
// ============================================================================
//
//  NOTE: This is the canonical v13 conductor. Legacy Earn (v11/v1) is treated
//  as a bridge path; once Earn v13 is universal, the bridge can be removed
//  without changing this contract.
//
export function createPulseEarnSendSystem({
  sendSystem,
  sdn = null,
  log = console.log,
  deviceProfile = null // Presence‑aware skeletal phenotype
}) {
  if (!sendSystem || typeof sendSystem.send !== "function") {
    throw new Error("[PulseEarnSendSystem-v13.0-PRESENCE-IMMORTAL] sendSystem.send(impulse) required.");
  }

  function emitSDN(event, payload) {
    if (!sdn || typeof sdn.emitImpulse !== "function") return;
    try {
      sdn.emitImpulse(event, payload);
    } catch (err) {
      log && log("[PulseEarnSendSystem-v13.0-PRESENCE-IMMORTAL] SDN emit failed (non‑fatal)", {
        event,
        err
      });
    }
  }

  return {
    // -----------------------------------------------------------------------
    // send(impulse, context?) — Deterministic Single‑Pass Earn → Pulse → Send
    // context: { meshSignals, serverAdvantageHints, globalHints }
    // -----------------------------------------------------------------------
    send(impulse, context = {}) {
      sendHealing.cycleCount++;

      const cycleIndex = impulse?.tickId || sendHealing.cycleCount;
      const meshSignals = context.meshSignals || {};
      const serverAdvantageHints = context.serverAdvantageHints || {};
      const globalHints = context.globalHints || {};

      const cachePriority = normalizeCachePriority(globalHints.cacheHints?.priority);
      const prewarmNeeded = !!(globalHints.prewarmHints?.shouldPrewarm);
      const meshPressureIndex = meshSignals.meshPressureIndex || 0;

      const factoringSignal = deriveFactoringSignalFromContext({
        meshPressureIndex,
        cachePriority,
        prewarmNeeded
      });

      emitSDN("earnSend:begin", {
        tickId: impulse?.tickId,
        intent: impulse?.intent,
        cycleIndex,
        cachePriority,
        prewarmNeeded,
        meshPressureIndex,
        factoringSignal
      });

      sendHealing.lastImpulseId = impulse?.tickId || null;
      sendHealing.lastError = null;

      // 0. GOVERNOR — block Earn re-entry
      if (isEarnReentryImpulse(impulse)) {
        const blocked = {
          ok: false,
          blocked: true,
          reason: "earn_reentry_blocked",
          impulse,
          note: "Earn → Send → Earn loop prevented.",
          factoringSignal
        };
        sendHealing.lastError = "earn_reentry_blocked";
        emitSDN("earnSend:blocked", blocked);
        return blocked;
      }

      // 1. Legacy bridge: Try Earn v11, then v1 continuance
      const v11 = tryEarnV11(impulse);

      let earn = null;
      let usedFallback = false;

      if (v11.ok) {
        earn = v11.earn;
        emitSDN("earnSend:earn-v11", {
          tickId: impulse.tickId,
          pattern: earn.pattern,
          lineageDepth: earn.lineage.length
        });
      } else {
        earn = buildEarnV1Continuance(impulse);
        usedFallback = true;
        emitSDN("earnSend:earn-v1-fallback", {
          tickId: impulse.tickId,
          error: String(v11.error),
          pattern: earn.pattern
        });
      }

      sendHealing.lastEarnPattern = earn.pattern || null;
      sendHealing.lastEarnLineageDepth = earn.lineage?.length || 0;
      sendHealing.lastFallbackUsed = usedFallback;

      // 2. Wrap Earn organism for Pulse
      const pulseCompatibleEarn = wrapEarnForPulse(earn);

      emitSDN("earnSend:wrapped", {
        tickId: impulse.tickId,
        earnIdentity: earn.EarnRole.identity,
        pulseCompatibleEarn
      });

      // 3. Tag impulse as Earn → Pulse (single-pass)
      const governedImpulse = tagImpulseAsEarnSent(
        impulse,
        pulseCompatibleEarn
      );

      // 4. A‑B‑A Dual-Band + Binary + Wave metadata
      const bandPack = buildEarnSendBandBinaryWave(
        earn,
        usedFallback,
        cycleIndex,
        deviceProfile || {}
      );

      const earnSendSignature = computeHash(
        earn.pattern +
        "::" +
        earn.lineage.length +
        "::" +
        (usedFallback ? "fallback" : "primary") +
        "::" +
        bandPack.band +
        "::" +
        factoringSignal
      );

      sendHealing.lastSendSignature = earnSendSignature;

      // 5. Presence + Advantage‑M + Chunk/Prewarm + Factoring
      const presenceField = buildPresenceField(
        earn,
        deviceProfile || {},
        usedFallback
      );

      const advantageField = buildAdvantageField({
        earn,
        deviceProfile: deviceProfile || {},
        bandPack,
        presenceField,
        factoringSignal
      });

      const chunkPrewarmPlan = buildChunkPrewarmPlan({
        earn,
        deviceProfile: deviceProfile || {},
        presenceField,
        factoringSignal
      });

      // 6. Delegate to PulseSendSystem (deterministic)
      let result;
      try {
        result = sendSystem.send(governedImpulse);
      } catch (err) {
        sendHealing.lastError = String(err && err.message ? err.message : err);
        const failure = {
          ok: false,
          error: sendHealing.lastError,
          earn,
          pulseCompatibleEarn,
          fallback: usedFallback,
          earnSendSignature,
          band: bandPack.band,
          bandSignature: bandPack.bandSignature,
          binaryField: bandPack.binaryField,
          waveField: bandPack.waveField,
          presenceField,
          advantageField,
          chunkPrewarmPlan,
          factoringSignal
        };
        emitSDN("earnSend:error", failure);
        return failure;
      }

      const out = {
        ok: true,
        earn,
        pulseCompatibleEarn,
        result,
        fallback: usedFallback,
        earnSendSignature,

        band: bandPack.band,
        bandSignature: bandPack.bandSignature,
        binaryField: bandPack.binaryField,
        waveField: bandPack.waveField,

        presenceField,
        advantageField,
        chunkPrewarmPlan,
        factoringSignal
      };

      emitSDN("earnSend:complete", out);
      return out;
    }
  };
}
