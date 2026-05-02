// ============================================================================
// PULSE-WORLD : PulseMesh-v13-PRESENCE-EVO+.js
// ORGAN TYPE: Connectivity / Mesh Organism
// VERSION: v13-PRESENCE-EVO+ (Hybrid, Every-Advantage, Pressure-Aware, Multi-Mesh)
// ============================================================================
//
// ROLE:
//   PulseMesh is the connective tissue of PulseWorld.
//   It links users, castles, regions, and neighboring meshes into a coherent
//   local-first, multi-mesh network.
//   It prefers local paths, bridges between castles when needed, and reports
//   density + health + pressure back to PulseExpansion, PulseCastle, Router,
//   and OS/User views.
//
// CONTRACT:
//   - Prefer local routes over remote whenever possible.
//   - Must cooperate with PulseExpansion + PulseCastle + Router.
//   - Must not fragment the network or create loops.
//   - Must respect SafetyFrame and cost constraints.
//   - Must expose clear density + health + pressure signals.
//   - Must remain deterministic, synthetic, and drift-proof.
//   - Must support multi-mesh / world-mesh aggregation (symbolic only).
//
// ARCHITECTURE:
//   A = Baseline mesh structure (nodes, links, regions).
//   B = Adaptive behavior (density-aware, cost-aware, bridge-aware,
//       pressure-aware, multi-instance-aware, multi-mesh-aware).
//   A = Return to deterministic contracts and limits.
//
// DEPENDENCIES (SYMBOLIC):
//   - PulseExpansion
//   - PulseCastle
//   - PulseRouter
//   - SafetyFrame
//   - PulseBeaconEngine (for presence + mesh status)
//   - Optional: world / neighbor mesh snapshots (symbolic only)
// ============================================================================
/*
AI_EXPERIENCE_META = {
  identity: "PulseMesh",
  version: "v14-IMMORTAL",
  layer: "presence_mesh_core",
  role: "symbolic_mesh_kernel",
  lineage: "PulsePresence-v14",

  evo: {
    meshKernel: true,
    meshFlow: true,
    meshAwareness: true,
    meshPresence: true,

    symbolicPrimary: true,
    binaryAware: true,
    dualBand: true,

    deterministic: true,
    driftProof: true,
    zeroMutationOfInput: true,
    zeroNetwork: true,
    zeroFilesystem: true
  },

  contract: {
    always: [
      "PulseRouter",
      "PulseExpansion",
      "PulseBeaconEngine"
    ],
    never: [
      "safeRoute",
      "fetchViaCNS"
    ]
  }
}
*/

export const PulseMeshMeta = Object.freeze({
  organId: "PulseMesh-v13-PRESENCE-EVO+",
  role: "CONNECTIVE_TISSUE",
  version: "13-PRESENCE-EVO+",
  epoch: "v13-PRESENCE-EVO+",
  layer: "Connectivity",
  safety: Object.freeze({
    deterministic: true,
    noRandomness: true,
    noAsyncDrift: true,
    syntheticOnly: true
  }),
  evo: Object.freeze({
    presenceAware: true,
    advantageAware: true,
    fallbackBandAware: true,
    meshPressureAware: true,
    densityAware: true,
    costAware: true,
    bridgeAware: true,
    multiInstanceAware: true,
    expansionAware: true,
    dualbandSafe: true,
    // v13+ extensions
    multiMeshAware: true,
    worldMeshAware: true,
    userMeshAware: true,
    routerAware: true,
    osBrainAware: true,
    chunkPrewarmAware: true,
    regionPresenceAware: true,
    regionAdvantageAware: true
  })
});

// ============================================================================
// FACTORY: createPulseMesh — v13-PRESENCE-EVO+
// ============================================================================

export function createPulseMesh({
  meshID = null,
  regionID = null,
  trace = false,
  globalHints = null   // presenceContext, advantageContext, fallbackBandLevel, etc.
} = {}) {

  // --------------------------------------------------------------------------
  // 1. Identity & Scope (A)
  // --------------------------------------------------------------------------
  const Identity = Object.freeze({
    meshID,
    regionID,
    createdBy: "PulseExpansion",
    version: "v13-PRESENCE-EVO+"
  });

  function log(...args) {
    if (trace) console.log("[PulseMesh v13]", ...args);
  }

  log("PulseMesh created:", { meshID, regionID });

  // --------------------------------------------------------------------------
  // 2. Topology (A → B → A)
  // --------------------------------------------------------------------------
  const Topology = {
    A_nodes: {
      userNodes: [],      // user device IDs
      castleNodes: [],    // castle IDs
      bridgeNodes: []     // special nodes bridging regions
    },
    A_links: {
      edges: []           // { from, to, weight, type }
    },
    B_adaptive: {
      autoAddUserNodes: true,
      autoRemoveIdleNodes: true,
      autoReweightLinksOnLoad: true
    },
    A_limits: Object.freeze({
      maxNodesPerRegion: 5000,
      maxEdgesPerNode: 64
    })
  };

  // --------------------------------------------------------------------------
  // 3. Density, Health & Pressure (A → B → A)
  // --------------------------------------------------------------------------
  const DensityHealth = {
    A_metrics: {
      userCount: 0,
      castleCount: 0,
      avgLatencyMs: null,
      packetLossRate: 0,
      meshStrength: "unknown", // unknown | weak | stable | strong

      relayLoadScore: 0,
      pingFrequencyScore: 0,
      meshContributionScore: 0,
      meshPressureIndex: 0
    },
    B_adaptive: {
      densityAware: true,
      costAware: true,
      preferShortLocalPaths: true,
      computePressureIndex: true
    },
    A_thresholds: Object.freeze({
      weakThresholdUsers: 1,
      stableThresholdUsers: 5,
      strongThresholdUsers: 20,
      highPressureThreshold: 70 // 0-100 scale
    })
  };

  // --------------------------------------------------------------------------
  // 4. Routing Logic (A → B → A)
  // --------------------------------------------------------------------------
  const Routing = {
    A_baseline: {
      preferLocalCastle: true,
      fallbackToRemote: true,
      avoidLoops: true
    },
    B_behavior: {
      dynamicWeighting: true,
      congestionAware: true,
      canBridgeBetweenCastles: true
    },
    A_contracts: Object.freeze({
      mustRespectSafetyFrame: true,
      mustNotBypassCostLimits: true
    })
  };

  // --------------------------------------------------------------------------
  // 5. Castle Integration (Mesh ↔ PulseCastle)
  // --------------------------------------------------------------------------
  const CastleIntegration = {
    A_links: {
      attachedCastles: [] // list of castle IDs
    },
    B_behavior: {
      routeThroughNearestHealthyCastle: true,
      reportCastleHealthToExpansion: true,
      supportCastleRetirement: true
    },
    A_contracts: Object.freeze({
      mustNotOverloadSingleCastle: true,
      mustSupportMultiCastleRegions: true
    })
  };

  // --------------------------------------------------------------------------
  // 6. Expansion Integration (Mesh ↔ PulseExpansion)
  // --------------------------------------------------------------------------
  const ExpansionIntegration = {
    A_links: {
      expansionOrganID: "PulseExpansion"
    },
    B_behavior: {
      reportDensityToExpansion: true,
      reportMeshPressureToExpansion: true,
      suggestCastleSpinUpOnDemand: true,
      suggestCastleSpinDownWhenStable: true
    },
    A_contracts: Object.freeze({
      mustProvideAccurateDensitySignals: true,
      mustProvideAccurateMeshStrength: true,
      mustProvideAccurateMeshPressure: true
    })
  };

  // --------------------------------------------------------------------------
  // 7. Multi-Instance & Region Handling (A → B → A)
  // --------------------------------------------------------------------------
  const MultiInstance = {
    A_baseline: {
      oneMeshPerRegionPreferred: true,
      allowSubMeshesForLargeRegions: true
    },
    B_governor: {
      governedBy: "PulseExpansion.SafetyFrame.multiInstanceGovernor",
      preventMeshFragmentation: true,
      mergeSubMeshesWhenPossible: true,
      splitOnlyOnHighLoad: true
    },
    A_rules: Object.freeze({
      mustMaintainSingleLogicalViewPerRegion: true
    })
  };

  // --------------------------------------------------------------------------
  // 8. Multi-Mesh / World-Mesh Integration (v13+)
// --------------------------------------------------------------------------
  const MultiMeshIntegration = {
    A_links: {
      worldMeshID: "PulseWorldMesh",
      neighborMeshes: Object.create(null) // id -> { getSnapshot }
    },
    B_behavior: {
      aggregateNeighborDensity: true,
      aggregateNeighborPressure: true,
      preferLocalRegionFirst: true,
      worldMeshAware: true
    },
    A_contracts: Object.freeze({
      mustRemainSymbolicOnly: true,
      mustNotDirectlyControlNeighborMeshes: true
    })
  };

  function registerNeighborMesh(meshId, snapshotProvider) {
    if (!meshId || typeof snapshotProvider !== "function") {
      return { ok: false, reason: "invalid-arguments" };
    }
    MultiMeshIntegration.A_links.neighborMeshes[meshId] = snapshotProvider;
    return { ok: true };
  }

  function unregisterNeighborMesh(meshId) {
    if (!meshId) return { ok: false, reason: "invalid-arguments" };
    delete MultiMeshIntegration.A_links.neighborMeshes[meshId];
    return { ok: true };
  }

  function buildWorldMeshSignal() {
    const neighbors = MultiMeshIntegration.A_links.neighborMeshes;
    let totalUserCount = DensityHealth.A_metrics.userCount;
    let totalCastleCount = DensityHealth.A_metrics.castleCount;
    let maxPressure = DensityHealth.A_metrics.meshPressureIndex;

    for (const provider of Object.values(neighbors)) {
      try {
        const snap = provider();
        const dh = snap?.densityHealth?.A_metrics || {};
        totalUserCount += dh.userCount || 0;
        totalCastleCount += dh.castleCount || 0;
        if (typeof dh.meshPressureIndex === "number") {
          maxPressure = Math.max(maxPressure, dh.meshPressureIndex);
        }
      } catch {
        // ignore neighbor failures
      }
    }

    return Object.freeze({
      worldMeshID: MultiMeshIntegration.A_links.worldMeshID,
      regionID,
      localUserCount: DensityHealth.A_metrics.userCount,
      localCastleCount: DensityHealth.A_metrics.castleCount,
      localMeshPressureIndex: DensityHealth.A_metrics.meshPressureIndex,
      aggregatedUserCount: totalUserCount,
      aggregatedCastleCount: totalCastleCount,
      aggregatedMaxPressureIndex: maxPressure
    });
  }

  // --------------------------------------------------------------------------
  // 9. Telemetry & Logging
  // --------------------------------------------------------------------------
  const Telemetry = {
    metrics: {
      lastUpdatedAt: null,
      userCount: 0,
      castleCount: 0,
      avgLatencyMs: null,
      meshStrength: "unknown",
      meshPressureIndex: 0
    },
    reportTargets: {
      toExpansion: true,
      toLogger: true
    }
  };

  // --------------------------------------------------------------------------
  // 10. Contracts (DNA)
  // --------------------------------------------------------------------------
  const Contracts = Object.freeze({
    preferLocalFirst: true,
    mustCooperateWithCastles: true,
    mustRespectSafetyFrame: true,
    mustAvoidLoops: true
  });

  // --------------------------------------------------------------------------
  // 11. Global Hints (presence/advantage/fallback)
  // --------------------------------------------------------------------------
  let lastGlobalHints = globalHints || null;

  function setGlobalHints(hints) {
    lastGlobalHints = hints || null;
    return { ok: true, hints: lastGlobalHints };
  }

  function getGlobalHints() {
    return lastGlobalHints;
  }

  // --------------------------------------------------------------------------
  // 12. Presence & Advantage Fields (Mesh View)
  // --------------------------------------------------------------------------
  function buildPresenceField() {
    const gh = lastGlobalHints || {};
    return Object.freeze({
      bandPresence: gh.presenceContext?.bandPresence || "unknown",
      routerPresence: gh.presenceContext?.routerPresence || "unknown",
      devicePresence: gh.presenceContext?.devicePresence || "unknown",
      meshPresence: DensityHealth.A_metrics.meshStrength || "unknown"
    });
  }

  function buildAdvantageField() {
    const gh = lastGlobalHints || {};
    return Object.freeze({
      advantageScore: gh.advantageContext?.score ?? null,
      advantageBand: gh.advantageContext?.band ?? "neutral",
      fallbackBandLevel: gh.fallbackBandLevel ?? null
    });
  }

  // --------------------------------------------------------------------------
  // 13. Compute Density & Pressure (deterministic)
  // --------------------------------------------------------------------------
  function computeDensityAndPressure({
    userCount,
    castleCount,
    avgLatencyMs,
    packetLossRate,
    relayLoadScore,
    pingFrequencyScore,
    meshContributionScore
  }) {
    DensityHealth.A_metrics.userCount = userCount;
    DensityHealth.A_metrics.castleCount = castleCount;
    DensityHealth.A_metrics.avgLatencyMs = avgLatencyMs;
    DensityHealth.A_metrics.packetLossRate = packetLossRate;
    DensityHealth.A_metrics.relayLoadScore = relayLoadScore;
    DensityHealth.A_metrics.pingFrequencyScore = pingFrequencyScore;
    DensityHealth.A_metrics.meshContributionScore = meshContributionScore;

    let meshStrength = "unknown";
    const thresholds = DensityHealth.A_thresholds;

    if (userCount >= thresholds.strongThresholdUsers) {
      meshStrength = "strong";
    } else if (userCount >= thresholds.stableThresholdUsers) {
      meshStrength = "stable";
    } else if (userCount >= thresholds.weakThresholdUsers) {
      meshStrength = "weak";
    }

    const pressure =
      (relayLoadScore * 0.4) +
      (pingFrequencyScore * 0.3) +
      (meshContributionScore * 0.3);

    const meshPressureIndex = Math.max(0, Math.min(100, Math.round(pressure)));

    DensityHealth.A_metrics.meshStrength = meshStrength;
    DensityHealth.A_metrics.meshPressureIndex = meshPressureIndex;

    Telemetry.metrics.lastUpdatedAt = Date.now();
    Telemetry.metrics.userCount = userCount;
    Telemetry.metrics.castleCount = castleCount;
    Telemetry.metrics.avgLatencyMs = avgLatencyMs;
    Telemetry.metrics.meshStrength = meshStrength;
    Telemetry.metrics.meshPressureIndex = meshPressureIndex;

    return Object.freeze({
      meshStrength,
      meshPressureIndex,
      userCount,
      castleCount
    });
  }

  // --------------------------------------------------------------------------
  // 14. Mesh → Expansion / Castle / User / World Signals (symbolic)
// --------------------------------------------------------------------------
  function buildExpansionSignal() {
    const presenceField = buildPresenceField();
    const advantageField = buildAdvantageField();

    return Object.freeze({
      density: DensityHealth.A_metrics.userCount,
      meshStrength: DensityHealth.A_metrics.meshStrength,
      meshPressureIndex: DensityHealth.A_metrics.meshPressureIndex,
      presenceField,
      advantageField
    });
  }

  function buildCastleSignal() {
    const presenceField = buildPresenceField();
    const advantageField = buildAdvantageField();

    return Object.freeze({
      meshStrength: DensityHealth.A_metrics.meshStrength,
      meshPressureIndex: DensityHealth.A_metrics.meshPressureIndex,
      presenceField,
      advantageField
    });
  }

  function buildUserMeshSignal() {
    const presenceField = buildPresenceField();
    const advantageField = buildAdvantageField();

    return Object.freeze({
      regionID,
      meshID,
      presenceField,
      advantageField,
      meshPressureIndex: DensityHealth.A_metrics.meshPressureIndex
    });
  }

  // --------------------------------------------------------------------------
  // 15. Prewarm (chunk / cache awareness)
// --------------------------------------------------------------------------
  function prewarm() {
    log("Prewarm: PulseMesh v13 starting prewarm.");
    // Symbolic-only: mark that density/pressure path is hot.
    // No external side effects; this is a readiness hint.
    return {
      ok: true,
      meta: {
        organId: PulseMeshMeta.organId,
        version: PulseMeshMeta.version,
        prewarmKind: "connectivity-density-pressure"
      }
    };
  }

  // --------------------------------------------------------------------------
  // 16. Snapshot & Manual
  // --------------------------------------------------------------------------
  function getSnapshot() {
    return Object.freeze({
      organId: PulseMeshMeta.organId,
      identity: Identity,
      topology: Topology,
      densityHealth: DensityHealth,
      routing: Routing,
      castleIntegration: CastleIntegration,
      expansionIntegration: ExpansionIntegration,
      multiInstance: MultiInstance,
      multiMeshIntegration: {
        worldMeshID: MultiMeshIntegration.A_links.worldMeshID,
        neighborMeshIds: Object.keys(MultiMeshIntegration.A_links.neighborMeshes)
      },
      telemetry: Telemetry,
      contracts: Contracts,
      globalHints: lastGlobalHints,
      presenceField: buildPresenceField(),
      advantageField: buildAdvantageField()
    });
  }

  function getManual() {
    return {
      meta: PulseMeshMeta,
      description:
        "PulseMesh is the connective tissue of PulseWorld. It reports density, health, mesh pressure, and multi-mesh signals to Expansion, Castle, Router, and OS/User views.",
      usage: {
        setGlobalHints:
          "mesh.setGlobalHints({ presenceContext?, advantageContext?, fallbackBandLevel?, ... })",
        computeDensityAndPressure:
          "mesh.computeDensityAndPressure({ userCount, castleCount, avgLatencyMs, packetLossRate, relayLoadScore, pingFrequencyScore, meshContributionScore })",
        buildExpansionSignal:
          "mesh.buildExpansionSignal() // for PulseExpansion",
        buildCastleSignal:
          "mesh.buildCastleSignal() // for PulseCastle",
        buildUserMeshSignal:
          "mesh.buildUserMeshSignal() // for user/OS views",
        buildWorldMeshSignal:
          "mesh.buildWorldMeshSignal() // for world/neighbor mesh aggregation",
        registerNeighborMesh:
          "mesh.registerNeighborMesh(meshId, () => neighborMesh.getSnapshot())",
        getSnapshot:
          "mesh.getSnapshot()"
      }
    };
  }

  // --------------------------------------------------------------------------
  // 17. Public API
  // --------------------------------------------------------------------------
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
    getSnapshot,
    getManual
  });
}

export default createPulseMesh;
