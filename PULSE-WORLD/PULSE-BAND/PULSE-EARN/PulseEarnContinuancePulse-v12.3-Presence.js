// ============================================================================
//  PulseEarnContinuancePulse-v14.4-IMMORTAL-INTEL.js
//  Earn v1 Continuance Wrapper (v14.4 IMMORTAL SAFE MODE)
//  NO PulseSendSystem, NO network, NO routing, NO loops.
//  Only: build LegacyEarn v1 + Pulse-compatible envelope and return it.
//  Presence/Advantage/Chunk/Band/Binary/Wave aware as METADATA ONLY.
//  v14.4-INTEL: adds pulseIntelligence (solvedness, factoring, computeTier, readiness).
// ============================================================================

/*
AI_EXPERIENCE_META = {
  identity: "PulseEarnContinuancePulse",
  version: "v14.4-IMMORTAL-INTEL",
  layer: "earn_continuance",
  role: "earn_continuance_pulse",
  lineage: "PulseEarnContinuancePulse-v11 → v12.3 → v13 → v14.4-IMMORTAL-INTEL",

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
    zeroFilesystem: true,

    pulseIntelligenceReady: true
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

// ============================================================================
// ⭐ PulseRole — identifies this as the Earn Continuance Pulse Organ (v14.4)
// ============================================================================
export const PulseRole = {
  type: "PulseEarnContinuance",
  subsystem: "Earn",
  layer: "Organ",
  version: "14.4",
  identity: "PulseEarnContinuancePulse-v14.4-IMMORTAL-INTEL",

  evo: {
    continuancePulse: true,
    fallbackAware: true,
    survivalHeuristics: true,

    deterministic: true,
    driftProof: true,
    pureCompute: true,
    zeroMutationOfInput: true,
    zeroNetwork: true,
    zeroFilesystem: true,

    presenceAware: true,
    advantageAware: true,
    chunkPrewarmAware: true,
    binaryAware: true,
    waveFieldAware: true,
    bandAware: true,
    factoringAware: true,

    // Intelligence surface (logic-only, no heavy compute)
    pulseIntelligenceReady: true,
    solvednessAware: true,
    computeTierAware: true,
    readinessAware: true
  },

  routingContract: "PulseRouter-v14.4",
  meshContract: "PulseMesh-v14.4",
  sendContract: "PulseSend-v14.4",
  gpuOrganContract: "PulseGPU-v14.4",
  earnCompatibility: "PulseEarn-v14.4"
};

export const PulseEarnContinuancePulseMeta = Object.freeze({
  layer: "PulseEarnContinuancePulse",
  role: "EARN_CONTINUANCE_ORGAN",
  version: "v14.4-IMMORTAL-INTEL",
  identity: "PulseEarnContinuancePulse-v14.4-IMMORTAL-INTEL",

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
// v14.4 Presence Field (IMMORTAL)
// ============================================================================
function classifyPresenceTier(pressure) {
  if (pressure >= 150) return "critical";
  if (pressure >= 100) return "high";
  if (pressure >= 50) return "elevated";
  if (pressure > 0) return "soft";
  return "idle";
}

function buildPresenceFieldV14(globalHints = {}, cycle) {
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
    presenceVersion: "v14.4-PRESENCE-IMMORTAL-INTEL",
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
// Advantage‑C v14.4
// ============================================================================
function buildAdvantageFieldV14(binaryField, waveField, presenceField, globalHints = {}) {
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
    advantageVersion: "C-14.4-INTEL",
    advantageScore,
    advantageTier,
    fallbackBandLevel: globalHints.fallbackBandLevel ?? 0
  };
}

// ============================================================================
// Chunk / Cache / Prewarm Plan v14.4
// ============================================================================
function buildChunkPrewarmPlanV14(presenceField, advantageField) {
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
    planVersion: "v14.4-Continuance-AdvantageC-INTEL",
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
// Binary + Wave Surfaces (v14.4)
// ============================================================================
function buildBinaryFieldV14(pattern, lineage, cycle) {
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

function buildWaveFieldV14(pattern, lineage, cycle, band) {
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
// Pulse Intelligence for Earn Continuance (logic-only)
// ============================================================================
function computePulseIntelligenceForEarn({ band, factoringSignal, presenceField, advantageField }) {
  const bandIsBinary = band === "binary" ? 1 : 0;
  const factoring = factoringSignal ? 1 : 0;

  const advantageScore = advantageField.advantageScore || 0;
  const advantageTier = advantageField.advantageTier || 0;

  const presenceTier = presenceField.presenceTier || "idle";
  const presenceWeight =
    presenceTier === "critical" ? 1.0 :
    presenceTier === "high" ? 0.8 :
    presenceTier === "elevated" ? 0.6 :
    presenceTier === "soft" ? 0.4 :
    0.2;

  const solvednessScore = Math.max(
    0,
    Math.min(
      advantageScore * 10 * 0.5 +
      presenceWeight * 0.3 +
      factoring * 0.2,
      1
    )
  );

  const computeTier =
    solvednessScore >= 0.9 ? "nearSolution" :
    solvednessScore >= 0.7 ? "highValue"    :
    solvednessScore >= 0.4 ? "normal"       :
    solvednessScore >= 0.2 ? "lowPriority"  :
    "avoidCompute";

  const readinessScore = Math.max(
    0,
    Math.min(
      solvednessScore * 0.6 +
      (bandIsBinary ? 0.2 : 0.0) +
      (advantageTier >= 2 ? 0.2 : advantageTier === 1 ? 0.1 : 0),
      1
    )
  );

  return {
    solvednessScore,
    factoringSignal: factoring ? "high" : "low",
    computeTier,
    readinessScore,
    band,
    advantageTier
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

  const band = normalizeBand(payload.band);

  const factoringSignal =
    typeof payload.factoringSignal === "number"
      ? (payload.factoringSignal ? 1 : 0)
      : 1;

  const patternSignature = computeHash(pattern);
  const lineageSignature = computeHash(lineage.join("::"));

  const presenceField = buildPresenceFieldV14(globalHints, continuanceCycle);
  const binaryField = buildBinaryFieldV14(pattern, lineage, continuanceCycle);
  const waveField = buildWaveFieldV14(pattern, lineage, continuanceCycle, band);
  const advantageField = buildAdvantageFieldV14(binaryField, waveField, presenceField, globalHints);
  const chunkPlan = buildChunkPrewarmPlanV14(presenceField, advantageField);

  const pulseIntelligence = computePulseIntelligenceForEarn({
    band,
    factoringSignal,
    presenceField,
    advantageField
  });

  return {
    EarnRole: {
      kind: "Earn",
      version: "1.0",
      identity: "Earn-v1-Continuance-v14.4-IMMORTAL-INTEL"
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

    pulseIntelligence,

    meta: {
      ...(payload.meta || {}),
      legacy: true,
      origin: "ContinuancePulse-v14.4-IMMORTAL-INTEL",
      cycleIndex: continuanceCycle,
      patternSignature,
      lineageSignature
    }
  };
}

// ============================================================================
// Build Pulse-Compatible Envelope (v14.4 surfaces)
// ============================================================================
function buildPulseCompatibleEarnV14(earn) {
  if (!earn) return null;

  const continuanceSignature = computeHash(
    `${earn.jobId}::${earn.patternSignature}::${earn.meta.cycleIndex}`
  );

  return {
    PulseRole,

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

    pulseIntelligence: earn.pulseIntelligence,

    meta: {
      ...(earn.meta || {}),
      origin: "ContinuancePulse-v14.4-IMMORTAL-INTEL",
      earnVersion: "1.0",
      earnIdentity: "Earn-v1-Continuance-v14.4-IMMORTAL-INTEL",
      earnEnvelope: true,
      cycleIndex: earn.meta.cycleIndex,
      continuanceSignature,
      bandSignature: computeHash(earn.band),
      factoringSignature: computeHash(String(earn.factoringSignal)),
      binarySignature: earn.binaryField.binaryShapeSignature,
      waveSignature: computeHash(JSON.stringify(earn.waveField)),
      pulseIntelligenceSignature: computeHash(JSON.stringify(earn.pulseIntelligence))
    },

    earn: {
      ...earn,
      __earnEnvelope: true
    }
  };
}

// ============================================================================
// PUBLIC API — PulseEarnContinuancePulse (v14.4 IMMORTAL-INTEL SAFE MODE)
// ============================================================================
export const PulseEarnContinuancePulse = {
  build(impulse, globalHints = {}) {
    const earnV1 = buildLegacyEarnV1(impulse, globalHints);
    const pulseCompatibleEarn = buildPulseCompatibleEarnV14(earnV1);

    return {
      ok: true,
      earn: earnV1,
      pulseCompatibleEarn,
      fallback: true
    };
  }
};
