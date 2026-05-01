// ============================================================================
//  PULSE-WORLD : PulseBeaconMesh-v13-PRESENCE-EVO++
//  ROLE: Local membrane simulator + density/mode/advantage debugger
//  VERSION: v13-PRESENCE-EVO++
//  LAYER: BeaconMesh
//  IDENTITY: PulseBeaconMesh-v13-PRESENCE-EVO++
// ============================================================================
//
// PURPOSE:
//   This organ simulates local world conditions and feeds them into the
//   PulseBeaconEngine. It does NOT compute signal physics itself.
//
//   It is the "muscle" of PulseWorld expansion — it lets you:
//     - simulate density (low/medium/high/peak)
//     - simulate demand (low/medium/high/burst)
//     - simulate region types (home/venue/campus/city/metro/hub)
//     - simulate mesh strength (unknown/weak/stable/strong/overloaded)
//     - inspect broadcast profiles + history
//     - inspect presence / band / advantage / chunk-prewarm fields
//     - inspect multi-instance behavior
//     - inspect regioning / band signatures (if engine exposes them)
//
// CONTRACT:
//   - Never mutate the Beacon Engine.
//   - Never compute signal shaping.
//   - Never override global hints.
//   - Only call Beacon Engine APIs.
//   - Always deterministic.
//   - Pure membrane surface (symbolic composition only).
// ============================================================================

// ============================================================================
//  META (v13-PRESENCE-EVO++)
// ============================================================================
export const PulseBeaconMeshMeta = Object.freeze({
  layer: "BeaconMesh",
  role: "LOCAL_MEMBRANE_SIMULATOR",
  version: "v13-PRESENCE-EVO++",
  identity: "PulseBeaconMesh-v13-PRESENCE-EVO++",

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

    // Awareness flags
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
//  INTERNAL HELPERS (symbolic only, no physics)
// ============================================================================
function clamp01(x) {
  if (x == null || Number.isNaN(x)) return 0;
  return Math.max(0, Math.min(1, x));
}

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
  presenceTier = "normal",   // low | normal | high
  advantageBand = "neutral", // neutral | positive | negative
  fallbackBandLevel = null   // optional numeric/symbolic
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
//  ORGAN: PulseBeaconMesh (v13-PRESENCE-EVO++)
// ============================================================================
export function PulseBeaconMesh({ beacon }) {
  if (!beacon)
    throw new Error("PulseBeaconMesh requires a Beacon Engine instance");

  // --------------------------------------------------------------------------
  // INTERNAL META SNAPSHOT (non-invasive)
// --------------------------------------------------------------------------
  const snapshotMeta = Object.freeze({
    engineIdentity: beacon?.meta?.identity ?? null,
    engineVersion: beacon?.meta?.version ?? null,
    engineLayer: beacon?.meta?.layer ?? null,
    engineRole: beacon?.meta?.role ?? null,
    engineBandSignature: beacon?.meta?.bandSignature ?? null,
    engineRegioningSignature: beacon?.meta?.regioningPhysicsSignature ?? null
  });

  // --------------------------------------------------------------------------
  // SYMBOLIC COMPOSITE FIELDS (no physics, just composition)
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
      advantageField?.meshPressureIndex ??
      presenceField?.meshPressureIndex ??
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

  function getRegioningSignature() {
    // Prefer explicit engine API if present, otherwise meta hint, otherwise null
    if (typeof beacon.getRegioningSignature === "function") {
      return beacon.getRegioningSignature();
    }
    return (
      beacon?.meta?.regioningPhysicsSignature ??
      beacon?.meta?.physicsSig ??
      null
    );
  }

  function getMultiInstanceView() {
    if (typeof beacon.getMultiInstanceSnapshot === "function") {
      return beacon.getMultiInstanceSnapshot();
    }
    if (typeof beacon.getStateSnapshot === "function") {
      const snap = beacon.getStateSnapshot();
      return {
        snapshot: snap,
        note: "Engine does not expose explicit multi-instance snapshot; returning generic state snapshot."
      };
    }
    return {
      snapshot: null,
      note: "Engine does not expose multi-instance or state snapshot APIs."
    };
  }

  // --------------------------------------------------------------------------
  // PRESET SCENARIOS (symbolic, no shaping)
// --------------------------------------------------------------------------
  function simulateScenarioPreset(preset = "default") {
    // presets are symbolic; they only choose hints, engine still does shaping
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
      case "metro_mesh_weak":
        return simulate({
          densityHint: "medium",
          demandHint: "medium",
          regionType: "metro",
          meshStatus: "weak"
        });
      default:
        return simulate({});
    }
  }

  function simulateBatch(scenarios = []) {
    if (!Array.isArray(scenarios) || scenarios.length === 0) {
      return [];
    }
    const out = [];
    for (const s of scenarios) {
      const profile = buildScenarioProfile(s || {});
      const result = simulate({
        densityHint: profile.densityHint,
        demandHint: profile.demandHint,
        regionType: profile.regionType,
        meshStatus: profile.meshStatus
      });
      out.push({
        profile,
        result
      });
    }
    return Object.freeze(out);
  }

  // --------------------------------------------------------------------------
  // CORE SIMULATION SURFACE (delegates to beacon)
// --------------------------------------------------------------------------
  function simulate({
    densityHint = "medium",   // low | medium | high | peak
    demandHint = "medium",    // low | medium | high | burst
    regionType = "venue",     // home | venue | campus | city | metro | hub
    meshStatus = "unknown"    // unknown | weak | stable | strong | overloaded
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

    // META
    meta: PulseBeaconMeshMeta,
    engineMeta: snapshotMeta,

    // SIMULATION (single + presets + batch)
    simulate,
    simulateScenarioPreset,
    simulateBatch,
    buildScenarioProfile,

    // TELEMETRY: Inspect broadcast history + last profile
    getTelemetry() {
      return beacon.getTelemetry();
    },

    // SNAPSHOT: Full membrane / engine state
    getSnapshot() {
      return beacon.getStateSnapshot();
    },

    // PRESENCE FIELD: Local presence field (mesh, castle, region, band)
    getPresenceField() {
      return beacon.buildPresenceField();
    },

    // BAND FIELD (symbolic/binary)
    getBandField() {
      return beacon.buildBandField?.() ?? null;
    },

    // ADVANTAGE FIELD (EVO+)
    getAdvantageField() {
      return beacon.buildAdvantageField?.() ?? null;
    },

    // CHUNK PREWARM FIELD (EVO+)
    getChunkPrewarmField() {
      return beacon.buildChunkPrewarmField?.() ?? null;
    },

    // COMPOSITE FIELD (symbolic composition of presence/band/advantage/chunk)
    getCompositeField: buildCompositeField,

    // REGIONING / BAND SIGNATURES (if engine exposes them)
    getRegioningSignature,
    getMultiInstanceView
  });
}
