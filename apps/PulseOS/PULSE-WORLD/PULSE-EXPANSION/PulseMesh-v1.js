/*
===========================================================
 PULSE-WORLD : PulseMesh-v1.js
 ORGAN TYPE: Connectivity / Mesh Organism
 VERSION: v1.0-EVO (A-B-A Pattern)

 META BLOCK:
 ----------------------------------------------------------
 ROLE:
   PulseMesh is the connective tissue of PulseWorld.
   It links users, castles, and regions into a coherent
   local-first network. It prefers local paths, bridges
   between castles when needed, and reports density +
   health back to PulseExpansion.

 CONTRACT:
   - Prefer local routes over remote whenever possible.
   - Must cooperate with PulseExpansion + PulseCastle.
   - Must not fragment the network or create loops.
   - Must respect SafetyFrame and cost constraints.
   - Must expose clear density + health signals.

 ARCHITECTURE:
   A = Baseline mesh structure (nodes, links, regions).
   B = Adaptive behavior (density-aware, cost-aware,
       bridge-aware, multi-instance-aware).
   A = Return to deterministic contracts and limits.

 DEPENDENCIES:
   - PulseExpansion
   - PulseCastle
   - SafetyFrame
===========================================================
*/
/*
===========================================================
 PULSE-WORLD : PulseMesh-v1.js
 ORGAN TYPE: Connectivity / Mesh Organism
 VERSION: v1.1-EVO (A-B-A Pattern, Pressure-Aware)
===========================================================
*/

const PulseMesh = {

  // 1. Identity & Scope (A)
  Identity: {
    meshID: null,
    regionID: null,
    createdBy: "PulseExpansion",
    version: "v1.1-EVO"
  },

  // 2. Nodes & Links (A → B → A)
  Topology: {
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
    A_limits: {
      maxNodesPerRegion: 5000,
      maxEdgesPerNode: 64
    }
  },

  // 3. Density, Health & Pressure (A → B → A)
  DensityHealth: {
    A_metrics: {
      userCount: 0,
      castleCount: 0,
      avgLatencyMs: null,
      packetLossRate: 0,
      meshStrength: "unknown", // unknown | weak | stable | strong

      // Pressure-related
      relayLoadScore: 0,        // how much a user is relaying for others
      pingFrequencyScore: 0,    // how often nodes are being hit
      meshContributionScore: 0, // how much a node contributes to others
      meshPressureIndex: 0      // combined pressure metric
    },
    B_adaptive: {
      densityAware: true,
      costAware: true,
      preferShortLocalPaths: true,
      computePressureIndex: true
    },
    A_thresholds: {
      weakThresholdUsers: 1,
      stableThresholdUsers: 5,
      strongThresholdUsers: 20,
      highPressureThreshold: 70 // 0-100 scale
    }
  },

  // 4. Routing Logic (A → B → A)
  Routing: {
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
    A_contracts: {
      mustRespectSafetyFrame: true,
      mustNotBypassCostLimits: true
    }
  },

  // 5. Castle Integration (Mesh ↔ PulseCastle)
  CastleIntegration: {
    A_links: {
      attachedCastles: [] // list of castle IDs
    },
    B_behavior: {
      routeThroughNearestHealthyCastle: true,
      reportCastleHealthToExpansion: true,
      supportCastleRetirement: true
    },
    A_contracts: {
      mustNotOverloadSingleCastle: true,
      mustSupportMultiCastleRegions: true
    }
  },

  // 6. Expansion Integration (Mesh ↔ PulseExpansion)
  ExpansionIntegration: {
    A_links: {
      expansionOrganID: "PulseExpansion"
    },
    B_behavior: {
      reportDensityToExpansion: true,
      reportMeshPressureToExpansion: true,
      suggestCastleSpinUpOnDemand: true,
      suggestCastleSpinDownWhenStable: true
    },
    A_contracts: {
      mustProvideAccurateDensitySignals: true,
      mustProvideAccurateMeshStrength: true,
      mustProvideAccurateMeshPressure: true
    }
  },

  // 7. Multi-Instance & Region Handling (A → B → A)
  MultiInstance: {
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
    A_rules: {
      mustMaintainSingleLogicalViewPerRegion: true
    }
  },

  // 8. Telemetry & Logging
  Telemetry: {
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
  },

  // 9. Contracts (DNA)
  Contracts: {
    preferLocalFirst: true,
    mustCooperateWithCastles: true,
    mustRespectSafetyFrame: true,
    mustAvoidLoops: true
  }

};

export default PulseMesh;
