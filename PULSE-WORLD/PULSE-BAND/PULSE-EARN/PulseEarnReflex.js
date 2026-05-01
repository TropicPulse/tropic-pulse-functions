// ============================================================================
//  PulseEarnReflex-v12.3-PRESENCE-EVO+.js
//  Side-Attached Earn Reflex (v12.3 Presence + Advantage‑C + Chunk/Prewarm)
//  Pure deterministic reflex builder (zero routing, zero sending)
//  Binary-first A-B-A + Presence surfaces
// ============================================================================

// ============================================================================
// ORGAN IDENTITY — v12.3-PRESENCE-EVO+
// ============================================================================
export const PulseRole = {
  type: "Reflex",
  subsystem: "PulseEarnReflex",
  layer: "B1-SubHealerReflexArc",
  version: "12.3-PRESENCE-EVO+",
  identity: "PulseEarnReflex-v12.3-PRESENCE-EVO+",

  evo: {
    driftProof: true,
    deterministicField: true,
    unifiedAdvantageField: true,
    futureEvolutionReady: true,

    reflexArc: true,
    reflexDeterministic: true,
    reflexHandoffOnly: true,
    reflexInstanceLaw: true,
    reflexABASurface: true,
    reflexPresenceAware: true,
    reflexAdvantageAware: true,
    reflexChunkAware: true,

    zeroRouting: true,
    zeroSending: true,
    zeroCompute: true,
    zeroAsync: true,
    zeroRandomness: true,
    zeroMutation: true,
    zeroTiming: true,

    zeroState: false,

    dualBand: true,
    binaryAware: true,
    symbolicAware: true,
    bandNormalizationAware: true,

    environmentAgnostic: true,
    multiInstanceReady: true
  }
};

export const PulseEarnReflexMeta = Object.freeze({
  layer: "PulseEarnReflex",
  role: "EARN_REFLEX_ORGAN",
  version: "v12.3-PRESENCE-EVO+",
  identity: "PulseEarnReflex-v12.3-PRESENCE-EVO+",

  guarantees: Object.freeze({
    deterministic: true,
    driftProof: true,
    noRandomness: true,
    noRealTime: true,
    noExternalIO: true,
    pureReflex: true,

    dualBandAware: true,
    binaryAware: true,
    waveFieldAware: true,
    presenceAware: true,
    advantageAware: true,
    chunkPrewarmAware: true,
    healingMetadataAware: true,

    reflexArc: true,
    reflexDeterministic: true,
    reflexInstanceLaw: true,
    reflexHandoffOnly: true,

    zeroRouting: true,
    zeroSending: true,
    zeroCompute: true,
    zeroAsync: true,
    zeroUserCode: true,
    zeroMutation: true,

    worldLensAware: false,
    multiInstanceReady: true
  }),

  contract: Object.freeze({
    input: [
      "GovernorEvent",
      "ReflexSliceContext",
      "DualBandContext",
      "DevicePhenotypePresence"
    ],
    output: [
      "EarnReflexOrganism",
      "ReflexDiagnostics",
      "ReflexSignatures",
      "ReflexHealingState",
      "ReflexPresenceField",
      "ReflexAdvantageField",
      "ReflexChunkPrewarmPlan"
    ]
  })
});

// ============================================================================
// INTERNAL STATE
// ============================================================================
const reflexInstances = new Map();
let reflexCycle = 0;

// ============================================================================
// HELPERS
// ============================================================================
function computeHash(str) {
  let h = 0;
  const s = String(str || "");
  for (let i = 0; i < s.length; i++)
    h = (h + s.charCodeAt(i) * (i + 1)) % 100000;
  return `h${h}`;
}

function normalizeBand(b) {
  const x = String(b || "symbolic").toLowerCase();
  return x === "binary" ? "binary" : "symbolic";
}

function getPulseId(p) {
  return (
    p?.pulseId ||
    p?.id ||
    p?.tickId ||
    p?.jobId ||
    "UNKNOWN_PULSE"
  );
}

function getOrgan(e) {
  return e.organ || e.module || "UNKNOWN_ORGAN";
}

function getReason(e) {
  return e.reason || "unknown_reason";
}

function getReflexId(event, pulse) {
  return `${getPulseId(pulse)}::${getOrgan(event)}::${getReason(event)}`;
}

// ============================================================================
// A-B-A BINARY + WAVE (12.3 PRESENCE)
// ============================================================================
function buildReflexBandBinaryWave(event, pulse, reflexId, cycleIndex, device) {
  const band = normalizeBand(
    event.band ||
    pulse?.band ||
    pulse?.meta?.band ||
    device?.band ||
    "symbolic"
  );

  const pulseLen = String(getPulseId(pulse)).length;
  const organLen = String(getOrgan(event)).length;
  const reasonLen = String(getReason(event)).length;
  const gpuScore = device?.gpuScore || 0;

  const surface = pulseLen + organLen + reasonLen + gpuScore + cycleIndex;

  const binaryField = {
    binaryReflexSignature: computeHash(`BREFLEX::${reflexId}::${surface}`),
    binarySurfaceSignature: computeHash(`BSURF_RFX::${surface}`),
    binarySurface: {
      pulseLen,
      organLen,
      reasonLen,
      gpuScore,
      cycle: cycleIndex,
      surface
    },
    parity: surface % 2 === 0 ? 0 : 1,
    density: organLen + reasonLen + gpuScore,
    shiftDepth: Math.max(0, Math.floor(Math.log2(surface || 1)))
  };

  const waveField = {
    amplitude: organLen + gpuScore,
    wavelength: cycleIndex,
    phase: (organLen + reasonLen + cycleIndex) % 16,
    band,
    mode: band === "binary" ? "compression-wave" : "symbolic-wave"
  };

  const bandSignature = computeHash(`BAND::REFLEX::${band}::${cycleIndex}`);

  return { band, bandSignature, binaryField, waveField };
}

// ============================================================================
// PRESENCE FIELD (12.3)
// ============================================================================
function buildPresenceField(event, pulse, device, cycleIndex) {
  const organLen = String(getOrgan(event)).length;
  const reasonLen = String(getReason(event)).length;
  const stability = device?.stabilityScore || 0.7;

  const composite =
    organLen * 0.001 +
    reasonLen * 0.001 +
    stability * 0.01;

  const presenceTier =
    composite >= 0.02 ? "presence_high" :
    composite >= 0.005 ? "presence_mid" :
    "presence_low";

  return {
    presenceVersion: "v12.3",
    presenceTier,
    organLen,
    reasonLen,
    stability,
    cycleIndex,
    presenceSignature: computeHash(
      `RFX_PRESENCE::${presenceTier}::${organLen}::${reasonLen}::${cycleIndex}`
    )
  };
}

// ============================================================================
// ADVANTAGE‑C FIELD (12.3)
// ============================================================================
function buildAdvantageField(event, pulse, device, bandPack, presenceField) {
  const gpuScore = device?.gpuScore || 0;
  const bandwidth = device?.bandwidthMbps || 0;
  const density = bandPack.binaryField.density;
  const amplitude = bandPack.waveField.amplitude;

  const advantageScore =
    gpuScore * 0.0005 +
    bandwidth * 0.0002 +
    density * 0.00001 +
    amplitude * 0.00001 +
    (presenceField.presenceTier === "presence_high" ? 0.01 : 0);

  return {
    advantageVersion: "C",
    band: bandPack.band,
    gpuScore,
    bandwidth,
    binaryDensity: density,
    waveAmplitude: amplitude,
    presenceTier: presenceField.presenceTier,
    advantageScore
  };
}

// ============================================================================
// CHUNK / CACHE / PREWARM PLAN (12.3)
// ============================================================================
function buildChunkPrewarmPlan(event, pulse, device, presenceField) {
  const basePriority =
    presenceField.presenceTier === "presence_high"
      ? 3
      : presenceField.presenceTier === "presence_mid"
      ? 2
      : 1;

  const gpuBoost = (device?.gpuScore || 0) > 600 ? 1 : 0;
  const priority = basePriority + gpuBoost;

  return {
    planVersion: "v12.3-AdvantageC",
    priority,
    band: presenceField.presenceTier,
    chunks: {
      reflexEnvelope: true,
      earnHandoff: true
    },
    cache: {
      reflexDiagnostics: true
    },
    prewarm: {
      earnSystem: presenceField.presenceTier !== "presence_low"
    }
  };
}

// ============================================================================
// REFLEX ORGANISM BUILDER
// ============================================================================
function buildReflexEarn(event, pulse, instanceContext) {
  const pulseId = getPulseId(pulse);
  const organ = getOrgan(event);
  const reason = getReason(event);

  const pattern = `EarnReflex:${organ}:${reason}`;
  const patternSignature = computeHash(pattern);

  return {
    EarnRole: {
      kind: "EarnReflex",
      version: "12.3",
      identity: "EarnReflex-v12.3-PRESENCE"
    },

    jobId: pulseId,
    pattern,
    patternSignature,

    payload: {
      pulseId,
      organ,
      reason,
      blocked: !!event.blocked,
      lineageDepth: event.lineageDepth,
      returnToDepth: event.returnToDepth,
      fallbackDepth: event.fallbackDepth,
      instanceContext,
      cycleIndex: reflexCycle,
      rawEvent: event
    },

    priority: "low",
    returnTo: null,
    lineage: [],

    meta: {
      reflex: true,
      origin: "PulseEarnReflex-v12.3-PRESENCE",
      sourceOrgan: organ,
      sourceReason: reason,
      sourcePulseId: pulseId,
      instanceContext,
      cycleIndex: reflexCycle,
      patternSignature
    }
  };
}

// ============================================================================
// PUBLIC API — FULL PRESENCE UPGRADE
// ============================================================================
export const PulseEarnReflex = {

  fromGovernorEvent(event, pulse, instanceContext, deviceProfile = {}) {
    reflexCycle++;

    const reflexId = getReflexId(event, pulse);

    let state = reflexInstances.get(reflexId);
    if (!state) {
      state = {
        reflexId,
        count: 0,
        firstSeenCycle: reflexCycle,
        lastSeenCycle: null
      };
      reflexInstances.set(reflexId, state);
    }

    state.count++;
    state.lastSeenCycle = reflexCycle;

    const earnReflex = buildReflexEarn(event, pulse, instanceContext);

    const bandPack = buildReflexBandBinaryWave(
      event,
      pulse,
      reflexId,
      reflexCycle,
      deviceProfile
    );

    const presenceField = buildPresenceField(
      event,
      pulse,
      deviceProfile,
      reflexCycle
    );

    const advantageField = buildAdvantageField(
      event,
      pulse,
      deviceProfile,
      bandPack,
      presenceField
    );

    const chunkPrewarmPlan = buildChunkPrewarmPlan(
      event,
      pulse,
      deviceProfile,
      presenceField
    );

    const diagnostics = {
      reflexId,
      pulseId: getPulseId(pulse),
      organ: getOrgan(event),
      reason: getReason(event),
      cycleIndex: reflexCycle,
      instanceCount: state.count,
      firstSeenCycle: state.firstSeenCycle,
      lastSeenCycle: state.lastSeenCycle,
      band: bandPack.band,
      bandSignature: bandPack.bandSignature,
      binaryField: bandPack.binaryField,
      waveField: bandPack.waveField,
      presenceField
    };

    const reflexSignature = computeHash(
      `${reflexId}::${reflexCycle}::${presenceField.presenceTier}`
    );

    return {
      ok: true,
      reflexId,
      state,
      instanceContext,
      diagnostics,
      reflexSignature,
      presenceField,
      advantageField,
      chunkPrewarmPlan,
      earnReflex
    };
  },

  getReflexState(reflexId) {
    if (reflexId) return reflexInstances.get(reflexId) || null;
    return Array.from(reflexInstances.values());
  }
};
