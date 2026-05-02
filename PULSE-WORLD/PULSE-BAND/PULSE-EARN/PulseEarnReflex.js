// ============================================================================
//  PulseEarnReflex-v13.0-PRESENCE-IMMORTAL.js
//  Side-Attached Earn Reflex (v13.0 Presence-IMMORTAL + Advantage‑M + Chunk/Prewarm)
//  Pure deterministic reflex builder (zero routing, zero sending)
//  Binary-first A-B-A + Presence surfaces (metadata-only)
// ============================================================================
/*
AI_EXPERIENCE_META = {
  identity: "PulseEarnReflex",
  version: "v14-IMMORTAL",
  layer: "earn_reflex",
  role: "earn_reflex_arc",
  lineage: "PulseEarnReflex-v11 → v12.3 → v14-IMMORTAL",

  evo: {
    reflexArc: true,
    threatResponse: true,
    fastPath: true,
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
      "PulseEarnReflexRouter",
      "PulseEarnMuscleSystem",
      "PulseEarnNervousSystem"
    ],
    never: [
      "safeRoute",
      "fetchViaCNS"
    ]
  }
}
*/

// ============================================================================
// ORGAN IDENTITY — v13.0-PRESENCE-IMMORTAL
// ============================================================================
export const PulseRole = {
  type: "Reflex",
  subsystem: "PulseEarnReflex",
  layer: "B1-SubHealerReflexArc",
  version: "13.0-PRESENCE-IMMORTAL",
  identity: "PulseEarnReflex-v13.0-PRESENCE-IMMORTAL",

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
  version: "v13.0-PRESENCE-IMMORTAL",
  identity: "PulseEarnReflex-v13.0-PRESENCE-IMMORTAL",

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
// A-B-A BINARY + WAVE (v13.0 PRESENCE-IMMORTAL)
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
// PRESENCE FIELD (v13.0-PRESENCE-IMMORTAL)
// ============================================================================
function buildPresenceField(event, pulse, device, cycleIndex) {
  const organLen = String(getOrgan(event)).length;
  const reasonLen = String(getReason(event)).length;
  const stability = device?.stabilityScore ?? 0.7;

  const magnitude = organLen + reasonLen;
  let presenceTier = "presence_idle";
  if (magnitude >= 40) presenceTier = "presence_high";
  else if (magnitude >= 10) presenceTier = "presence_mid";
  else if (magnitude > 0) presenceTier = "presence_low";

  return {
    presenceVersion: "v13.0-PRESENCE-IMMORTAL",
    presenceTier,
    organLen,
    reasonLen,
    stability,
    cycleIndex,
    presenceSignature: computeHash(
      `RFX_PRESENCE_V13::${presenceTier}::${organLen}::${reasonLen}::${cycleIndex}`
    )
  };
}

// ============================================================================
// ADVANTAGE‑M FIELD (v13.0, structural-only)
// ============================================================================
function buildAdvantageField(event, pulse, device, bandPack, presenceField) {
  const gpuScore = device?.gpuScore || 0;
  const bandwidth = device?.bandwidthMbps || 0;
  const density = bandPack.binaryField.density;
  const amplitude = bandPack.waveField.amplitude;

  return {
    advantageVersion: "M-13.0",
    band: bandPack.band,
    gpuScore,
    bandwidth,
    binaryDensity: density,
    waveAmplitude: amplitude,
    presenceTier: presenceField.presenceTier
  };
}

// ============================================================================
// CHUNK / CACHE / PREWARM PLAN (v13.0-AdvantageM)
// ============================================================================
function buildChunkPrewarmPlan(event, pulse, device, presenceField) {
  let priorityLabel = "normal";
  if (presenceField.presenceTier === "presence_high") priorityLabel = "high";
  else if (presenceField.presenceTier === "presence_mid") priorityLabel = "medium";
  else if (presenceField.presenceTier === "presence_low") priorityLabel = "low";

  return {
    planVersion: "v13.0-AdvantageM",
    priorityLabel,
    bandPresence: presenceField.presenceTier,
    chunks: {
      reflexEnvelope: true,
      earnHandoff: true
    },
    cache: {
      reflexDiagnostics: true
    },
    prewarm: {
      earnSystem: presenceField.presenceTier !== "presence_idle"
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
      version: "13.0-PRESENCE-IMMORTAL",
      identity: "EarnReflex-v13.0-PRESENCE-IMMORTAL"
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
      origin: "PulseEarnReflex-v13.0-PRESENCE-IMMORTAL",
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
// PUBLIC API — FULL PRESENCE-IMMORTAL REFLEX
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
