// ============================================================================
//  PulseEarnContinuancePulse-v13.0-PRESENCE-IMMORTAL.js
//  Earn v1 Continuance Wrapper (v13 IMMORTAL SAFE MODE)
//  NO PulseSendSystem, NO network, NO routing, NO loops.
//  Only: build LegacyEarn v1 + Pulse-compatible envelope and return it.
//  Presence/Advantage/Chunk/Band/Binary/Wave aware as METADATA ONLY.
// ============================================================================
/*
AI_EXPERIENCE_META = {
  identity: "PulseEarnContinuancePulse",
  version: "v14-IMMORTAL",
  layer: "earn_continuance",
  role: "earn_continuance_pulse",
  lineage: "PulseEarnContinuancePulse-v11 → v12.3 → v14-IMMORTAL",

  evo: {
    continuancePulse: true,
    fallbackAware: true,
    survivalHeuristics: true,
    dualBand: true,
    symbolicPrimary: true,
    binaryAware: true,

    deterministic: true,
    driftProof: true,
    pureCompute: true,
    zeroMutationOfInput: true,
    zeroNetwork: true,
    zeroFilesystem: true
  },

  contract: {
    always: [
      "PulseEarn",
      "PulseEarnGeneticMemory",
      "PulseEarnEndocrineSystem"
    ],
    never: [
      "safeRoute",
      "fetchViaCNS"
    ]
  }
}
*/

export const PulseEarnContinuancePulseMeta = Object.freeze({
  layer: "PulseEarnContinuancePulse",
  role: "EARN_CONTINUANCE_ORGAN",
  version: "v13.0-PRESENCE-IMMORTAL",
  identity: "PulseEarnContinuancePulse-v13.0-PRESENCE-IMMORTAL",

  guarantees: Object.freeze({
    deterministic: true,
    noRandomness: true,
    noRealTime: true,
    noExternalIO: true,
    pureBuilder: true,
    safeFallback: true,

    dualBandAware: true,
    binaryAware: true,
    waveFieldAware: true,
    factoringAware: true,

    presenceAware: true,
    advantageAware: true,
    chunkPrewarmAware: true,
    hintsAware: true,

    loopTheorySafe: true,
    worldLensAware: false
  }),

  contract: Object.freeze({
    input: [
      "EarnImpulse",
      "DualBandContext",
      "LegacyLineage",
      "PatternShape",
      "GlobalHintsPresenceField"
    ],
    output: [
      "LegacyEarnV1",
      "PulseCompatibleEarnEnvelope",
      "ContinuanceDiagnostics"
    ]
  })
});

// ============================================================================
// Deterministic cycle counter (replaces timestamps)
// ============================================================================
let continuanceCycle = 0;

// ============================================================================
// Deterministic Hash Helper
// ============================================================================
function computeHash(str) {
  let h = 0;
  const s = String(str || "");
  for (let i = 0; i < s.length; i++)
    h = (h + s.charCodeAt(i) * (i + 1)) % 100000;
  return `h${h}`;
}

function normalizeBand(band) {
  const b = String(band || "symbolic").toLowerCase();
  return b === "binary" ? "binary" : "symbolic";
}

// ============================================================================
// v13 Presence Field (IMMORTAL)
// ============================================================================
function classifyPresenceTier(pressure) {
  if (pressure >= 150) return "critical";
  if (pressure >= 100) return "high";
  if (pressure >= 50) return "elevated";
  if (pressure > 0) return "soft";
  return "idle";
}

function buildPresenceFieldV13(globalHints = {}, cycle) {
  const ghP = globalHints.presenceContext || {};
  const mesh = globalHints.meshSignals || {};
  const castle = globalHints.castleSignals || {};
  const region = globalHints.regionContext || {};

  const meshStrength = Number(mesh.meshStrength || 0);
  const meshPressureExternal = Number(mesh.meshPressureIndex || 0);
  const castleLoadExternal = Number(castle.loadLevel || 0);

  const internalComposite = cycle * 0.0001;
  const internalPressure = Math.floor(internalComposite * 1000);

  const meshPressureIndex = meshPressureExternal + internalPressure;
  const castleLoadLevel = castleLoadExternal;

  const pressure = meshPressureIndex + castleLoadLevel;
  const presenceTier = classifyPresenceTier(pressure);

  return {
    presenceVersion: "v13.0-PRESENCE-IMMORTAL",
    presenceTier,

    bandPresence: ghP.bandPresence || "symbolic",
    routerPresence: ghP.routerPresence || "stable",
    devicePresence: ghP.devicePresence || "continuance",

    meshPresence: ghP.meshPresence || (meshStrength > 0 ? "mesh-active" : "mesh-idle"),
    castlePresence: ghP.castlePresence || castle.castlePresence || "continuance-region",
    regionPresence: ghP.regionPresence || region.regionTag || "unknown-region",

    regionId: region.regionId || "continuance-region",
    castleId: castle.castleId || "continuance-castle",

    meshStrength,
    meshPressureIndex,
    castleLoadLevel,

    cycle,

    presenceSignature: computeHash(
      `CONTINUANCE_PRESENCE::${presenceTier}::${meshPressureIndex}::${castleLoadLevel}`
    )
  };
}

// ============================================================================
// Advantage‑C v13
// ============================================================================
function buildAdvantageFieldV13(binaryField, waveField, presenceField, globalHints = {}) {
  const density = binaryField.binarySurface.density;
  const amplitude = waveField.amplitude;

  const baseScore =
    density * 0.00001 +
    amplitude * 0.00001;

  const presenceBoost =
    presenceField.presenceTier === "critical" ? 0.02 :
    presenceField.presenceTier === "high" ? 0.015 :
    presenceField.presenceTier === "elevated" ? 0.01 :
    presenceField.presenceTier === "soft" ? 0.005 :
    0;

  const advantageScore = baseScore + presenceBoost;

  let advantageTier = 0;
  if (advantageScore >= 0.05) advantageTier = 3;
  else if (advantageScore >= 0.02) advantageTier = 2;
  else if (advantageScore > 0) advantageTier = 1;

  return {
    advantageVersion: "C-13.0",
    advantageScore,
    advantageTier,
    fallbackBandLevel: globalHints.fallbackBandLevel ?? 0
  };
}

// ============================================================================
// Chunk / Cache / Prewarm Plan v13
// ============================================================================
function buildChunkPrewarmPlanV13(presenceField, advantageField) {
  const basePriority =
    presenceField.presenceTier === "critical"
      ? 4
      : presenceField.presenceTier === "high"
      ? 3
      : presenceField.presenceTier === "elevated"
      ? 2
      : presenceField.presenceTier === "soft"
      ? 1
      : 0;

  const advantageBoost =
    advantageField.advantageTier >= 3 ? 2 :
    advantageField.advantageTier === 2 ? 1 :
    0;

  return {
    planVersion: "v13.0-Continuance-AdvantageC",
    priority: basePriority + advantageBoost,
    band: presenceField.presenceTier,
    chunks: {
      continuanceEnvelope: true,
      legacyEarnBlueprint: true
    },
    cache: {
      continuanceDiagnostics: true
    },
    prewarm: {
      nervousSystem: true,
      muscleSystem: true,
      lymphNodes: true
    }
  };
}

// ============================================================================
// Binary + Wave Surfaces (v13)
// ============================================================================
function buildBinaryFieldV13(pattern, lineage, cycle) {
  const size = pattern.length + lineage.length;
  const density = size + cycle;
  const surface = density + size;

  return {
    binaryShapeSignature: computeHash(`bshape::${pattern}::${lineage.join("::")}`),
    binarySurfaceSignature: computeHash(`bsurf::${surface}`),
    binarySurface: {
      size,
      density,
      surface
    },
    parity: surface % 2 === 0 ? 0 : 1,
    shiftDepth: Math.max(0, Math.floor(Math.log2(surface || 1)))
  };
}

function buildWaveFieldV13(pattern, lineage, cycle, band) {
  const amplitude = lineage.length + cycle;
  const wavelength = pattern.length + 1;
  const phase = (pattern.length + lineage.length + cycle) % 16;

  return {
    amplitude,
    wavelength,
    phase,
    band,
    mode: band === "binary" ? "compression-wave" : "symbolic-wave"
  };
}

// ============================================================================
// Build Legacy Earn v1 (unchanged logic, upgraded metadata surfaces)
// ============================================================================
function buildLegacyEarnV1(impulse, globalHints = {}) {
  continuanceCycle++;

  const payload = impulse?.payload || {};

  const jobId   = impulse.tickId || payload.jobId || "UNKNOWN_JOB";
  const pattern = impulse.intent || payload.pattern || "UNKNOWN_PATTERN";
  const lineage = payload.parentLineage || [];

  const band =
    (payload.band && String(payload.band).toLowerCase() === "binary")
      ? "binary"
      : "symbolic";

  const factoringSignal =
    typeof payload.factoringSignal === "number"
      ? (payload.factoringSignal ? 1 : 0)
      : 1;

  const patternSignature = computeHash(pattern);
  const lineageSignature = computeHash(lineage.join("::"));

  // v13 surfaces
  const presenceField = buildPresenceFieldV13(globalHints, continuanceCycle);
  const binaryField = buildBinaryFieldV13(pattern, lineage, continuanceCycle);
  const waveField = buildWaveFieldV13(pattern, lineage, continuanceCycle, band);
  const advantageField = buildAdvantageFieldV13(binaryField, waveField, presenceField, globalHints);
  const chunkPlan = buildChunkPrewarmPlanV13(presenceField, advantageField);

  return {
    EarnRole: {
      kind: "Earn",
      version: "1.0",
      identity: "Earn-v1-Continuance-v13.0-PRESENCE-IMMORTAL"
    },

    jobId,
    pattern,
    patternSignature,

    payload,
    priority: payload.priority || "normal",
    returnTo: payload.returnTo || null,
    lineage,
    lineageSignature,

    band,
    factoringSignal,

    binaryField,
    waveField,
    presenceField,
    advantageField,
    chunkPlan,

    meta: {
      ...(payload.meta || {}),
      legacy: true,
      origin: "ContinuancePulse-v13.0-PRESENCE-IMMORTAL",
      cycleIndex: continuanceCycle,
      patternSignature,
      lineageSignature
    }
  };
}

// ============================================================================
// Build Pulse-Compatible Envelope (v13 surfaces)
// ============================================================================
function buildPulseCompatibleEarnV13(earn) {
  if (!earn) return null;

  const continuanceSignature = computeHash(
    `${earn.jobId}::${earn.patternSignature}::${earn.meta.cycleIndex}`
  );

  return {
    PulseRole: earn.EarnRole,

    jobId: earn.jobId,
    pattern: earn.pattern,
    patternSignature: earn.patternSignature,

    payload: earn.payload,
    priority: earn.priority,
    returnTo: earn.returnTo,
    lineage: earn.lineage,
    lineageSignature: earn.lineageSignature,

    band: earn.band,
    factoringSignal: earn.factoringSignal,

    binaryField: earn.binaryField,
    waveField: earn.waveField,
    presenceField: earn.presenceField,
    advantageField: earn.advantageField,
    chunkPlan: earn.chunkPlan,

    meta: {
      ...(earn.meta || {}),
      origin: "ContinuancePulse-v13.0-PRESENCE-IMMORTAL",
      earnVersion: "1.0",
      earnIdentity: "Earn-v1-Continuance-v13.0-PRESENCE-IMMORTAL",
      earnEnvelope: true,
      cycleIndex: earn.meta.cycleIndex,
      continuanceSignature,
      bandSignature: computeHash(earn.band),
      factoringSignature: computeHash(String(earn.factoringSignal)),
      binarySignature: earn.binaryField.binaryShapeSignature,
      waveSignature: computeHash(JSON.stringify(earn.waveField))
    },

    earn: {
      ...earn,
      __earnEnvelope: true
    }
  };
}

// ============================================================================
// PUBLIC API — PulseEarnContinuancePulse (v13 IMMORTAL SAFE MODE)
// ============================================================================
export const PulseEarnContinuancePulse = {

  build(impulse, globalHints = {}) {
    const earnV1 = buildLegacyEarnV1(impulse, globalHints);
    const pulseCompatibleEarn = buildPulseCompatibleEarnV13(earnV1);

    return {
      ok: true,
      earn: earnV1,
      pulseCompatibleEarn,
      fallback: true
    };
  }
};
