// ============================================================================
//  PULSE-WORLD : PulseBeaconMesh-v14-IMMORTAL.js
//  ROLE: Local membrane simulator + density/mode/advantage debugger
//  VERSION: v14-IMMORTAL
//  LAYER: BeaconMesh
//  IDENTITY: PulseBeaconMesh-v14-IMMORTAL
// ============================================================================
//
// PURPOSE:
//   This organ simulates local world conditions and feeds them into the
//   PulseBeaconEngine-v14-IMMORTAL. It does NOT compute signal physics.
//
//   It is the "muscle" of PulseWorld expansion — it lets you:
//     - simulate density (low/medium/high/peak)
//     - simulate demand (low/medium/high/burst)
//     - simulate region types (home/venue/campus/city/metro/hub)
//     - simulate mesh strength (unknown/weak/stable/strong/overloaded)
//     - inspect broadcast profiles + history
//     - inspect presence / band / advantage / chunk-prewarm fields
//     - inspect multi-instance behavior
//     - inspect regioning / band signatures
//
// CONTRACT:
//   - Never mutate the Beacon Engine.
//   - Never compute signal shaping.
//   - Never override global hints.
//   - Only call Beacon Engine APIs.
//   - Always deterministic.
//   - Pure membrane surface (symbolic composition only).
// ============================================================================

export const PulseBeaconMeshMeta = Object.freeze({
  layer: "BeaconMesh",
  role: "LOCAL_MEMBRANE_SIMULATOR",
  version: "v14-IMMORTAL",
  identity: "PulseBeaconMesh-v14-IMMORTAL",

  guarantees: Object.freeze({
    deterministic: true,
    driftProof: true,
    zeroRandomness: true,
    zeroTimers: true,
    zeroAsync: true,
    zeroNetwork: true,
    zeroEval: true,
    zeroDynamicImports: true,
    zeroMutation: true,
    zeroExternalMutation: true,

    meshAware: true,
    presenceFieldAware: true,
    bandAware: true,
    advantageAware: true,
    chunkPrewarmAware: true,
    multiInstanceReady: true,
    regionAware: true,
    castleAware: true,
    expansionAware: true,
    routerAware: true,
    meshPressureAware: true,
    presenceTierAware: true,
    advantageBandAware: true,
    chunkPlanAware: true
  })
});

// ============================================================================
//  INTERNAL HELPERS (symbolic only)
// ============================================================================
function stableHash(str) {
  let h = 0;
  const s = String(str || "");
  for (let i = 0; i < s.length; i++) {
    h = (h + s.charCodeAt(i) * (i + 1)) % 100000;
  }
  return `bm${h}`;
}

function buildScenarioProfile({
  densityHint = "medium",
  demandHint = "medium",
  regionType = "venue",
  meshStatus = "unknown",
  presenceTier = "normal",
  advantageBand = "neutral",
  fallbackBandLevel = null
} = {}) {
  return Object.freeze({
    densityHint,
    demandHint,
    regionType,
    meshStatus,
    presenceTier,
    advantageBand,
    fallbackBandLevel,
    scenarioSignature: stableHash(
      `SCENARIO::${densityHint}::${demandHint}::${regionType}::${meshStatus}::${presenceTier}::${advantageBand}::${fallbackBandLevel}`
    )
  });
}

// ============================================================================
//  ORGAN: PulseBeaconMesh (v14-IMMORTAL)
// ============================================================================
export function PulseBeaconMesh({ beacon }) {
  if (!beacon)
    throw new Error("PulseBeaconMesh requires a Beacon Engine instance");

  const snapshotMeta = Object.freeze({
    engineIdentity: beacon?.meta?.identity ?? null,
    engineVersion: beacon?.meta?.version ?? null,
    engineLayer: beacon?.meta?.layer ?? null,
    engineRole: beacon?.meta?.role ?? null
  });

  // --------------------------------------------------------------------------
  // COMPOSITE FIELD (symbolic composition of presence/band/advantage/chunk)
// --------------------------------------------------------------------------
  function buildCompositeField() {
    const presenceField = beacon.buildPresenceField?.() ?? null;
    const bandField = beacon.buildBandField?.() ?? null;
    const advantageField = beacon.buildAdvantageField?.() ?? null;
    const chunkPrewarmField = beacon.buildChunkPrewarmField?.() ?? null;

    const presenceTier =
      presenceField?.presenceTier ??
      presenceField?.routerPresence ??
      presenceField?.bandPresence ??
      "unknown";

    const advantageBand =
      advantageField?.advantageBand ??
      advantageField?.band ??
      "neutral";

    const meshStrength =
      presenceField?.meshPresence ??
      presenceField?.meshStrength ??
      "unknown";

    const meshPressureIndex =
      presenceField?.meshPressureIndex ??
      advantageField?.meshPressureIndex ??
      null;

    const chunkPriority =
      chunkPrewarmField?.priority ??
      chunkPrewarmField?.planPriority ??
      null;

    return Object.freeze({
      presenceField,
      bandField,
      advantageField,
      chunkPrewarmField,
      presenceTier,
      advantageBand,
      meshStrength,
      meshPressureIndex,
      chunkPriority,
      compositeSignature: stableHash(
        `COMPOSITE::${presenceTier}::${advantageBand}::${meshStrength}::${meshPressureIndex}::${chunkPriority}`
      )
    });
  }

  // --------------------------------------------------------------------------
  // REGIONING SIGNATURE
  // --------------------------------------------------------------------------
  function getRegioningSignature() {
    if (typeof beacon.getRegioningSignature === "function") {
      return beacon.getRegioningSignature();
    }
    return beacon?.meta?.regioningPhysicsSignature ?? null;
  }

  // --------------------------------------------------------------------------
  // MULTI-INSTANCE VIEW
  // --------------------------------------------------------------------------
  function getMultiInstanceView() {
    if (typeof beacon.getMultiInstanceSnapshot === "function") {
      return beacon.getMultiInstanceSnapshot();
    }
    const snap = beacon.getStateSnapshot?.();
    return {
      snapshot: snap,
      note: "Engine does not expose explicit multi-instance snapshot; returning generic state snapshot."
    };
  }

  // --------------------------------------------------------------------------
  // PRESET SCENARIOS (symbolic only)
// --------------------------------------------------------------------------
  function simulateScenarioPreset(preset = "default") {
    switch (preset) {
      case "home_low":
        return simulate({
          densityHint: "low",
          demandHint: "low",
          regionType: "home",
          meshStatus: "stable"
        });
      case "venue_peak":
        return simulate({
          densityHint: "high",
          demandHint: "high",
          regionType: "venue",
          meshStatus: "strong"
        });
      case "campus_burst":
        return simulate({
          densityHint: "high",
          demandHint: "burst",
          regionType: "campus",
          meshStatus: "stable"
        });
      case "city_overloaded":
        return simulate({
          densityHint: "peak",
          demandHint: "high",
          regionType: "city",
          meshStatus: "overloaded"
        });
      default:
        return simulate({});
    }
  }

  function simulateBatch(scenarios = []) {
    if (!Array.isArray(scenarios) || scenarios.length === 0) return [];
    return Object.freeze(
      scenarios.map(s => {
        const profile = buildScenarioProfile(s || {});
        const result = simulate({
          densityHint: profile.densityHint,
          demandHint: profile.demandHint,
          regionType: profile.regionType,
          meshStatus: profile.meshStatus
        });
        return { profile, result };
      })
    );
  }

  // --------------------------------------------------------------------------
  // CORE SIMULATION SURFACE (delegates to beacon)
// --------------------------------------------------------------------------
  function simulate({
    densityHint = "medium",
    demandHint = "medium",
    regionType = "venue",
    meshStatus = "unknown"
  } = {}) {
    return beacon.broadcastOnce({
      densityHint,
      demandHint,
      regionType,
      meshStatus
    });
  }

  // --------------------------------------------------------------------------
  // PUBLIC ORGAN SURFACE
  // --------------------------------------------------------------------------
  return Object.freeze({
    meta: PulseBeaconMeshMeta,
    engineMeta: snapshotMeta,

    simulate,
    simulateScenarioPreset,
    simulateBatch,
    buildScenarioProfile,

    getTelemetry() {
      return beacon.getTelemetry();
    },

    getSnapshot() {
      return beacon.getStateSnapshot();
    },

    getPresenceField() {
      return beacon.buildPresenceField();
    },

    getBandField() {
      return beacon.buildBandField?.() ?? null;
    },

    getAdvantageField() {
      return beacon.buildAdvantageField?.() ?? null;
    },

    getChunkPrewarmField() {
      return beacon.buildChunkPrewarmField?.() ?? null;
    },

    getCompositeField: buildCompositeField,

    getRegioningSignature,
    getMultiInstanceView
  });
}
