// ============================================================================
// PULSE-WORLD : PulseMesh-v15-IMMORTAL.js
// ORGAN TYPE: Connectivity / Symbolic Mesh Organism
// VERSION: v15-IMMORTAL (Pure Symbolic Mesh, Deterministic, Drift-Proof)
// ============================================================================
//
// ROLE:
//   PulseMesh is the symbolic connective tissue of PulseWorld.
//   It does NOT route, send, forward, or execute anything.
//   It ONLY computes and emits symbolic signals:
//
//     - density
//     - health
//     - pressure
//     - presence
//     - advantage
//     - world-mesh aggregation
//
//   It feeds Router, Castle, Expansion, User, Server, and WorldMesh.
//
// CONTRACT:
//   - Pure symbolic mesh (no routing, no sending, no execution).
//   - Prefer local-first symbolic signals.
//   - Must expose clear density + health + pressure signals.
//   - Must remain deterministic, synthetic, and drift-proof.
//   - Must support multi-mesh / world-mesh aggregation (symbolic only).
//   - Must never mutate input.
//   - Must never perform network or filesystem operations.
//
// ============================================================================

export const PulseMeshMeta = Object.freeze({
  organId: "PulseMesh-v15-IMMORTAL",
  role: "SYMBOLIC_MESH_KERNEL",
  version: "v15-IMMORTAL",
  epoch: "v15-IMMORTAL",
  layer: "Connectivity",

  guarantees: Object.freeze({
    deterministic: true,
    driftProof: true,
    symbolicPrimary: true,
    binaryAware: true,
    dualBandAware: true,

    zeroNetwork: true,
    zeroFilesystem: true,
    zeroMutationOfInput: true,
    zeroDynamicImports: true,
    zeroEval: true,

    presenceAware: true,
    advantageAware: true,
    fallbackBandAware: true,
    meshPressureAware: true,
    densityAware: true,
    costAware: true,
    bridgeAware: true,
    multiInstanceAware: true,
    expansionAware: true,
    routerAware: true,
    userAware: true,
    worldMeshAware: true,
    osBrainAware: true
  })
});

// ============================================================================
// FACTORY: createPulseMesh — v15-IMMORTAL
// ============================================================================

export function createPulseMesh({
  meshID = null,
  regionID = null,
  trace = false,
  globalHints = null
} = {}) {

  const Identity = Object.freeze({
    meshID,
    regionID,
    createdBy: "PulseExpansion",
    version: "v15-IMMORTAL"
  });

  const log = (...args) => trace && console.log("[PulseMesh v15]", ...args);
  log("PulseMesh created:", { meshID, regionID });

  // ==========================================================================
  // 1. Topology (symbolic only)
  // ==========================================================================
  const Topology = {
    nodes: {
      userNodes: [],
      castleNodes: [],
      bridgeNodes: []
    },
    links: {
      edges: []
    },
    limits: Object.freeze({
      maxNodesPerRegion: 5000,
      maxEdgesPerNode: 64
    })
  };

  // ==========================================================================
  // 2. Density, Health & Pressure (deterministic)
  // ==========================================================================
  const DensityHealth = {
    metrics: {
      userCount: 0,
      castleCount: 0,
      avgLatencyMs: null,
      packetLossRate: 0,
      meshStrength: "unknown",
      relayLoadScore: 0,
      pingFrequencyScore: 0,
      meshContributionScore: 0,
      meshPressureIndex: 0
    },
    thresholds: Object.freeze({
      weakThresholdUsers: 1,
      stableThresholdUsers: 5,
      strongThresholdUsers: 20,
      highPressureThreshold: 70
    })
  };

  // ==========================================================================
  // 3. Global Hints
  // ==========================================================================
  let lastGlobalHints = globalHints || null;

  const setGlobalHints = hints => (lastGlobalHints = hints || null, { ok: true });
  const getGlobalHints = () => lastGlobalHints;

  // ==========================================================================
  // 4. Presence & Advantage Fields
  // ==========================================================================
  function buildPresenceField() {
    const gh = lastGlobalHints || {};
    return Object.freeze({
      bandPresence: gh.presenceContext?.bandPresence || "unknown",
      routerPresence: gh.presenceContext?.routerPresence || "unknown",
      devicePresence: gh.presenceContext?.devicePresence || "unknown",
      meshPresence: DensityHealth.metrics.meshStrength || "unknown"
    });
  }

  function buildAdvantageField() {
    const gh = lastGlobalHints || {};
    return Object.freeze({
      advantageScore: gh.advantageContext?.score ?? null,
      advantageBand: gh.advantageContext?.band ?? "neutral",
      fallbackBandLevel: gh.fallbackBandLevel ?? 0
    });
  }

  // ==========================================================================
  // 5. Density + Pressure Computation
  // ==========================================================================
  function computeDensityAndPressure({
    userCount,
    castleCount,
    avgLatencyMs,
    packetLossRate,
    relayLoadScore,
    pingFrequencyScore,
    meshContributionScore
  }) {
    DensityHealth.metrics.userCount = userCount;
    DensityHealth.metrics.castleCount = castleCount;
    DensityHealth.metrics.avgLatencyMs = avgLatencyMs;
    DensityHealth.metrics.packetLossRate = packetLossRate;
    DensityHealth.metrics.relayLoadScore = relayLoadScore;
    DensityHealth.metrics.pingFrequencyScore = pingFrequencyScore;
    DensityHealth.metrics.meshContributionScore = meshContributionScore;

    const t = DensityHealth.thresholds;

    let meshStrength = "unknown";
    if (userCount >= t.strongThresholdUsers) meshStrength = "strong";
    else if (userCount >= t.stableThresholdUsers) meshStrength = "stable";
    else if (userCount >= t.weakThresholdUsers) meshStrength = "weak";

    const pressure =
      (relayLoadScore * 0.4) +
      (pingFrequencyScore * 0.3) +
      (meshContributionScore * 0.3);

    const meshPressureIndex = Math.max(0, Math.min(100, Math.round(pressure)));

    DensityHealth.metrics.meshStrength = meshStrength;
    DensityHealth.metrics.meshPressureIndex = meshPressureIndex;

    return Object.freeze({
      meshStrength,
      meshPressureIndex,
      userCount,
      castleCount
    });
  }

  // ==========================================================================
  // 6. Symbolic Signals for Expansion / Castle / User / Router
  // ==========================================================================
  function buildExpansionSignal() {
    return Object.freeze({
      density: DensityHealth.metrics.userCount,
      meshStrength: DensityHealth.metrics.meshStrength,
      meshPressureIndex: DensityHealth.metrics.meshPressureIndex,
      presenceField: buildPresenceField(),
      advantageField: buildAdvantageField()
    });
  }

  function buildCastleSignal() {
    return Object.freeze({
      meshStrength: DensityHealth.metrics.meshStrength,
      meshPressureIndex: DensityHealth.metrics.meshPressureIndex,
      presenceField: buildPresenceField(),
      advantageField: buildAdvantageField()
    });
  }

  function buildUserMeshSignal() {
    return Object.freeze({
      regionID,
      meshID,
      presenceField: buildPresenceField(),
      advantageField: buildAdvantageField(),
      meshPressureIndex: DensityHealth.metrics.meshPressureIndex
    });
  }

  // ==========================================================================
  // 7. Multi-Mesh / World-Mesh Aggregation
  // ==========================================================================
  const neighborMeshes = Object.create(null);

  function registerNeighborMesh(meshId, snapshotProvider) {
    if (!meshId || typeof snapshotProvider !== "function") {
      return { ok: false, reason: "invalid-arguments" };
    }
    neighborMeshes[meshId] = snapshotProvider;
    return { ok: true };
  }

  function unregisterNeighborMesh(meshId) {
    delete neighborMeshes[meshId];
    return { ok: true };
  }

  function buildWorldMeshSignal() {
    let totalUsers = DensityHealth.metrics.userCount;
    let totalCastles = DensityHealth.metrics.castleCount;
    let maxPressure = DensityHealth.metrics.meshPressureIndex;

    for (const provider of Object.values(neighborMeshes)) {
      try {
        const snap = provider();
        const dh = snap?.densityHealth?.metrics || {};
        totalUsers += dh.userCount || 0;
        totalCastles += dh.castleCount || 0;
        if (typeof dh.meshPressureIndex === "number") {
          maxPressure = Math.max(maxPressure, dh.meshPressureIndex);
        }
      } catch {}
    }

    return Object.freeze({
      worldMeshID: "PulseWorldMesh",
      regionID,
      localUserCount: DensityHealth.metrics.userCount,
      localCastleCount: DensityHealth.metrics.castleCount,
      localMeshPressureIndex: DensityHealth.metrics.meshPressureIndex,
      aggregatedUserCount: totalUsers,
      aggregatedCastleCount: totalCastles,
      aggregatedMaxPressureIndex: maxPressure
    });
  }

  // ==========================================================================
  // 8. Prewarm
  // ==========================================================================
  function prewarm() {
    log("Prewarm: PulseMesh v15 symbolic prewarm.");
    return {
      ok: true,
      meta: {
        organId: PulseMeshMeta.organId,
        version: PulseMeshMeta.version,
        prewarmKind: "symbolic-mesh"
      }
    };
  }

  // ==========================================================================
  // 9. Snapshot
  // ==========================================================================
  function getSnapshot() {
    return Object.freeze({
      organId: PulseMeshMeta.organId,
      identity: Identity,
      topology: Topology,
      densityHealth: DensityHealth,
      presenceField: buildPresenceField(),
      advantageField: buildAdvantageField(),
      worldMesh: buildWorldMeshSignal(),
      globalHints: lastGlobalHints
    });
  }

  // ==========================================================================
  // 10. Public API
  // ==========================================================================
  return Object.freeze({
    meta: PulseMeshMeta,
    identity: Identity,

    // hints
    setGlobalHints,
    getGlobalHints,

    // fields
    buildPresenceField,
    buildAdvantageField,

    // density + pressure
    computeDensityAndPressure,
    buildExpansionSignal,
    buildCastleSignal,
    buildUserMeshSignal,
    buildWorldMeshSignal,

    // multi-mesh
    registerNeighborMesh,
    unregisterNeighborMesh,

    // prewarm
    prewarm,

    // introspection
    getSnapshot
  });
}

export default createPulseMesh;
