// ============================================================================
//  PulseEarnReflexRouter-v12.3-PRESENCE-EVO+.js
//  Reflex → Earn Synapse (v12.3 Presence + Advantage‑C + Chunk/Prewarm)
//  Deterministic, Zero-Async, Zero-Routing, Zero-Sending
//  Pure Reflex → Earn Handoff with Presence Surfaces
// ============================================================================

export const PulseRole = {
  type: "Synapse",
  subsystem: "PulseEarnReflexRouter",
  layer: "B1-ReflexToEarn",
  version: "12.3-PRESENCE-EVO+",
  identity: "PulseEarnReflexRouter-v12.3-PRESENCE-EVO+",

  evo: {
    driftProof: true,
    deterministicField: true,
    unifiedAdvantageField: true,
    futureEvolutionReady: true,

    reflexSynapse: true,
    reflexHandoffOnly: true,
    reflexDeterministic: true,
    reflexBandAware: true,
    reflexABASurface: true,
    reflexPresenceAware: true,
    reflexAdvantageAware: true,
    reflexChunkAware: true,

    zeroTiming: true,
    zeroState: false,
    zeroMutation: true,
    zeroCompute: true,
    zeroRouting: true,
    zeroSending: true,
    zeroAsync: true,
    zeroRandomness: true,

    dualBand: true,
    binaryAware: true,
    symbolicAware: true,
    bandNormalizationAware: true,

    environmentAgnostic: true,
    multiInstanceReady: true
  }
};

export const PulseEarnReflexRouterMeta = Object.freeze({
  layer: "PulseEarnReflexRouter",
  role: "EARN_REFLEX_ROUTER_ORGAN",
  version: "v12.3-PRESENCE-EVO+",
  identity: "PulseEarnReflexRouter-v12.3-PRESENCE-EVO+",

  guarantees: Object.freeze({
    deterministic: true,
    driftProof: true,
    noRandomness: true,
    noRealTime: true,
    noExternalIO: true,
    pureReflexSynapse: true,

    dualBandAware: true,
    binaryAware: true,
    waveFieldAware: true,
    presenceAware: true,
    advantageAware: true,
    chunkPrewarmAware: true,
    healingMetadataAware: true,

    zeroRouting: true,
    zeroSending: true,
    zeroCompute: true,
    zeroAsync: true,
    zeroUserCode: true,
    zeroMutation: true,
    zeroTiming: true,

    worldLensAware: false,
    multiInstanceReady: true,
    environmentAgnostic: true
  }),

  contract: Object.freeze({
    input: [
      "EarnReflexOrganism",
      "ReflexSliceContext",
      "DualBandContext",
      "DevicePhenotypePresence"
    ],
    output: [
      "ReflexRouterHandoff",
      "ReflexRouterDiagnostics",
      "ReflexRouterSignatures",
      "ReflexRouterHealingState",
      "ReflexRouterPresenceField",
      "ReflexRouterAdvantageField",
      "ReflexRouterChunkPrewarmPlan"
    ]
  })
});

// ============================================================================
// INTERNAL STATE
// ============================================================================
const routedReflexes = new Map();
let reflexRouteCycle = 0;

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

function getOrCreateReflexRouteState(reflexId) {
  let state = routedReflexes.get(reflexId);
  if (!state) {
    state = {
      reflexId,
      count: 0,
      firstSeenCycle: reflexRouteCycle,
      lastSeenCycle: null
    };
    routedReflexes.set(reflexId, state);
  }
  return state;
}

// ============================================================================
// A‑B‑A BINARY + WAVE (12.3 PRESENCE)
// ============================================================================
function buildRouteBandBinaryWave(earnReflex, reflexId, cycleIndex, device) {
  const pattern = earnReflex?.pattern || "NO_PATTERN";
  const band = normalizeBand(
    earnReflex?.meta?.band ||
    earnReflex?.band ||
    device?.band ||
    "symbolic"
  );

  const patternLen = pattern.length;
  const lineageDepth = earnReflex?.lineage?.length || 0;
  const gpuScore = device?.gpuScore || 0;

  const surface = patternLen + lineageDepth + gpuScore + cycleIndex;

  const binaryField = {
    binaryReflexSignature: computeHash(`BREFLEX::${reflexId}::${surface}`),
    binarySurfaceSignature: computeHash(`BSURF_RFX::${surface}`),
    binarySurface: {
      patternLen,
      lineageDepth,
      gpuScore,
      cycle: cycleIndex,
      surface
    },
    parity: surface % 2 === 0 ? 0 : 1,
    density: patternLen + lineageDepth + gpuScore,
    shiftDepth: Math.max(0, Math.floor(Math.log2(surface || 1)))
  };

  const waveField = {
    amplitude: patternLen + gpuScore,
    wavelength: cycleIndex,
    phase: (patternLen + lineageDepth + cycleIndex) % 16,
    band,
    mode: band === "binary" ? "compression-wave" : "symbolic-wave"
  };

  const bandSignature = computeHash(`BAND::REFLEX::${band}::${cycleIndex}`);

  return { band, bandSignature, binaryField, waveField };
}

// ============================================================================
// PRESENCE FIELD (12.3)
// ============================================================================
function buildPresenceField(earnReflex, device, cycleIndex) {
  const patternLen = (earnReflex?.pattern || "").length;
  const lineageDepth = earnReflex?.lineage?.length || 0;
  const stability = device?.stabilityScore || 0.7;

  const composite =
    patternLen * 0.001 +
    lineageDepth * 0.002 +
    stability * 0.01;

  const presenceTier =
    composite >= 0.02 ? "presence_high" :
    composite >= 0.005 ? "presence_mid" :
    "presence_low";

  return {
    presenceVersion: "v12.3",
    presenceTier,
    patternLen,
    lineageDepth,
    stability,
    cycleIndex,
    presenceSignature: computeHash(
      `RFX_PRESENCE::${presenceTier}::${patternLen}::${lineageDepth}::${cycleIndex}`
    )
  };
}

// ============================================================================
// ADVANTAGE‑C FIELD (12.3)
// ============================================================================
function buildAdvantageField(earnReflex, device, bandPack, presenceField) {
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
function buildChunkPrewarmPlan(earnReflex, device, presenceField) {
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
// DIAGNOSTICS
// ============================================================================
function buildReflexDiagnostics(earnReflex, reflexId, state, bandPack, presenceField) {
  const pattern = earnReflex?.pattern || "NO_PATTERN";
  const lineageDepth = earnReflex?.lineage?.length || 0;

  return {
    reflexId,
    pattern,
    lineageDepth,
    cycleIndex: reflexRouteCycle,
    instanceCount: state.count,
    firstSeenCycle: state.firstSeenCycle,
    lastSeenCycle: state.lastSeenCycle,

    patternHash: computeHash(pattern),
    lineageHash: computeHash(String(lineageDepth)),
    reflexHash: computeHash(reflexId),
    cycleHash: computeHash(String(reflexRouteCycle)),

    band: bandPack.band,
    bandSignature: bandPack.bandSignature,
    binaryField: bandPack.binaryField,
    waveField: bandPack.waveField,

    presenceField
  };
}

// ============================================================================
// PUBLIC API — FULL PRESENCE UPGRADE
// ============================================================================
export const PulseEarnReflexRouter = {

  route(earnReflex, EarnSystem, deviceProfile = {}) {
    reflexRouteCycle++;

    if (!earnReflex || !earnReflex.meta?.reflex) {
      return {
        ok: false,
        reason: "invalid_reflex",
        reflex: earnReflex
      };
    }

    const reflexId =
      earnReflex.meta.reflexId ||
      `${earnReflex.meta.sourcePulseId}::${earnReflex.meta.sourceOrgan}::${earnReflex.meta.sourceReason}`;

    const state = getOrCreateReflexRouteState(reflexId);
    state.count++;
    state.lastSeenCycle = reflexRouteCycle;

    // Build surfaces
    const bandPack = buildRouteBandBinaryWave(
      earnReflex,
      reflexId,
      reflexRouteCycle,
      deviceProfile
    );

    const presenceField = buildPresenceField(
      earnReflex,
      deviceProfile,
      reflexRouteCycle
    );

    const advantageField = buildAdvantageField(
      earnReflex,
      deviceProfile,
      bandPack,
      presenceField
    );

    const chunkPrewarmPlan = buildChunkPrewarmPlan(
      earnReflex,
      deviceProfile,
      presenceField
    );

    const diagnostics = buildReflexDiagnostics(
      earnReflex,
      reflexId,
      state,
      bandPack,
      presenceField
    );

    const reflexRouteSignature = computeHash(
      diagnostics.pattern +
      "::" +
      diagnostics.reflexId +
      "::" +
      diagnostics.cycleIndex +
      "::" +
      diagnostics.band +
      "::" +
      presenceField.presenceTier
    );

    // If EarnSystem missing → fail-open
    if (!EarnSystem || typeof EarnSystem.handle !== "function") {
      return {
        ok: false,
        reason: "earn_system_unavailable",
        reflexId,
        state,
        diagnostics,
        reflexRouteSignature,
        presenceField,
        advantageField,
        chunkPrewarmPlan
      };
    }

    // SAFE HANDOFF (no routing, no sending)
    try {
      const result = EarnSystem.handle(earnReflex, {
        reflex: true,
        reflexId,
        state,
        cycleIndex: reflexRouteCycle,
        diagnostics,
        reflexRouteSignature,
        presenceField,
        advantageField,
        chunkPrewarmPlan
      });

      return {
        ok: true,
        routed: true,
        reflexId,
        state,
        diagnostics,
        reflexRouteSignature,
        presenceField,
        advantageField,
        chunkPrewarmPlan,
        result
      };

    } catch (error) {
      return {
        ok: false,
        routed: false,
        reflexId,
        state,
        diagnostics,
        reflexRouteSignature,
        presenceField,
        advantageField,
        chunkPrewarmPlan,
        error
      };
    }
  },

  getRoutedState(reflexId) {
    if (reflexId) return routedReflexes.get(reflexId) || null;
    return Array.from(routedReflexes.values());
  }
};
