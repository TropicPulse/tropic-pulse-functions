/*
===========================================================
 PULSE-WORLD : PulseExpansion-v1.js
 ORGAN TYPE: Expansion Organism
 VERSION: v1.2-EVO (A-B-A Upgrade, Pressure-Aware)

 META BLOCK:
 ----------------------------------------------------------
 ROLE:
   Expansion Organism for PulseWorld. Spawns, maintains,
   and retires Pulse Castles (local servers), manages
   mesh-aware expansion, broadcasts Bluetooth presence,
   and coordinates NodeAdmin reproduction.

 CONTRACT:
   - No auto-actions without user opt-in.
   - Always respect SafetyFrame boundaries.
   - Expand only when density + demand justify it.
   - De-expand gracefully when idle or cost-heavy.
   - Use multi-instance formulas to prevent job explosion.
   - Use mesh pressure as a signal, never as an auto-trigger.

 ARCHITECTURE:
   A = Baseline deterministic structure.
   B = Evolutionary enhancements (adaptive, density-aware,
       pressure-aware, multi-instance, cost-governed).
   A = Return to deterministic clarity with evolved rules.
===========================================================
*/

const PulseExpansion = {

  // -------------------------------------------------------
  // 1. PulseBeaconEngine — Bluetooth Layer (A → B)
  // -------------------------------------------------------
  BeaconEngine: {
    A_modes: {
      discovery: "High-power beacon for new users",
      presence: "Low-power heartbeat for known Pulse devices"
    },
    B_adaptiveModes: {
      autoSwitch: true,
      densityAware: true,
      demandAware: true
    },
    A_payload: {
      regionTag: null,
      loadHint: null,
      meshStatus: null,
      castlePresence: false
    },
    signalShaping: {
      powerLevel: "auto",
      interval: "auto",
      densityAware: true
    },
    optInFlow: {
      requiresUserTap: true,
      requiresConsent: true
    }
  },

  // -------------------------------------------------------
  // 2. GeoSpinCastle — Location → Local Server Spawner
  // -------------------------------------------------------
  GeoSpinCastle: {
    A_triggers: {
      onUserConnectAttempt: true,
      onRegionDemandSpike: true
    },
    B_spinUp: {
      timeTarget: "under_60_seconds",
      microServerTemplate: "PulseCastle-v1",
      broadcastOnReady: true,
      multiInstanceAware: true
    },
    A_spinDown: {
      idleTimeout: "regionBased",
      costAware: true,
      safeRetirement: true
    },
    regionState: {
      hasCastle: false,
      castleID: null,
      meshSupportLevel: 0
    }
  },

  // -------------------------------------------------------
  // 3. NodeAdminReproductionCore — Reproductive Nucleus
  // -------------------------------------------------------
  NodeAdminCore: {
    A_reproductionRules: {
      spawnChildNodesOnDensity: true,
      healDeadNodes: true
    },
    B_handoffLogic: {
      strategy: "nearestHealthyNode",
      autoMerge: true,
      autoRepair: true
    },
    A_limits: {
      reproductionLimit: "regionBased"
    }
  },

  // -------------------------------------------------------
  // 4. MeshExpansionBrain — Castle + Mesh Logic (Pressure-Aware)
  // -------------------------------------------------------
  MeshBrain: {
    A_densityThresholds: {
      minUsersForCastle: 1,
      minUsersForMeshOnly: 3
    },
    B_expansionRules: {
      preferMeshOverCastle: true,
      bridgeUsersBetweenCastles: true,
      autoExpandOnDemand: true,
      multiInstanceAware: true,

      // Pressure-aware behavior
      useMeshPressureForCastleSuggestions: true,
      highPressureThreshold: 70 // must align with PulseMesh.DensityHealth.A_thresholds.highPressureThreshold
    },
    A_deExpansionRules: {
      retireCastleIfMeshStable: true,
      collapseNodesIfCostHigh: true
    }
  },

  // -------------------------------------------------------
  // 5. MeshPressureIntegration — Reads Mesh Pressure Signals
  // -------------------------------------------------------
  MeshPressureIntegration: {
    receiveMeshPressureIndex: true,
    considerPressureForCastleSpinUp: true,
    requireSafetyFrameApproval: true,
    requireUserOptIn: true,
    neverAutoSpawnOnPressureAlone: true
  },

  // -------------------------------------------------------
  // 6. LocalWorldExperience — The “Coolest Experience”
  // -------------------------------------------------------
  LocalExperience: {
    A_intro: {
      zeroLoad: true,
      preRendered: true,
      graphicalImpact: "high"
    },
    B_animation: {
      style: "instantPulseWave",
      densityAware: true
    },
    A_ui: {
      localDashboard: true,
      tools: ["MyDay", "MyTools", "Evolution", "LocalPulse"],
      offlineFirst: true
    }
  },

  // -------------------------------------------------------
  // 7. EvolutionOptInContract — Consent Layer
  // -------------------------------------------------------
  EvolutionContract: {
    description:
      "Pulse will help coordinate timing, tools, and flows you approve.",
    requiresExplicitToggle: true,
    reversible: true,
    scope: {
      onlyUserApprovedDomains: true
    }
  },

  // -------------------------------------------------------
  // 8. ExpansionSafetyFrame — Expand + De-Expand
  // -------------------------------------------------------
  SafetyFrame: {
    A_spinDownLogic: {
      regionIdle: true,
      costTooHigh: true,
      meshStable: true
    },
    B_multiInstanceGovernor: {
      enabled: true,
      formula: "useInstancesWisely",
      preventJobExplosion: true,
      mergeSmallJobs: true,
      splitHeavyJobs: true
    },
    A_boundaries: {
      noAutoActions: true,
      noTracking: true,
      optInOnly: true
    }
  },

  // -------------------------------------------------------
  // 9. ExpansionLogger — Memory Organ
  // -------------------------------------------------------
  Logger: {
    logCastleSpawn: true,
    logCastleRetire: true,
    logMeshLinks: true,
    logBeaconEvents: true,
    logOptIns: true,
    logCosts: true,
    regionMap: true
  },

  // -------------------------------------------------------
  // 10. ExpansionContracts — Hard Rules (DNA)
  // -------------------------------------------------------
  Contracts: {
    minUsersPerCastle: 1,
    maxCastlesPerRegion: 3,
    preferMesh: true,
    spinUpTargetSeconds: 60,
    spinDownGrace: "regionBased"
  },

  // -------------------------------------------------------
  // 11. Boot Hook — Registered Organ
  // -------------------------------------------------------
  Boot: {
    registerWithRouter: true,
    registerWithNodeAdmin: true,
    initializeBeacon: true,
    initializeGeoSpin: true,
    initializeMeshBrain: true,
    waitForOptIn: true
  }

};

export default PulseExpansion;
