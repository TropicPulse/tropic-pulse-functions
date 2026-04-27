/*
===========================================================
 PULSE-WORLD : PulseRouter-v1.js
 ORGAN TYPE: Routing / Traffic Brain
 VERSION: v1.0-EVO (A-B-A Pattern)

 META BLOCK:
 ----------------------------------------------------------
 ROLE:
   PulseRouter is the traffic brain of a region. It decides
   how to route user requests: via local castle, via mesh,
   or via remote cloud as a last resort.

 CONTRACT:
   - Prefer local-first routing (castle, then mesh).
   - Avoid loops and fragmentation.
   - Respect SafetyFrame and user opt-in.
   - Be pressure-aware but never auto-expand.

 ARCHITECTURE:
   A = Baseline routing policy (local-first, loop-avoidance).
   B = Adaptive behavior (pressure-aware, latency-aware, cost-aware).
   A = Return to deterministic, explainable routing rules.

 DEPENDENCIES:
   - PulseMesh
   - PulseCastle
   - PulseExpansion
   - SafetyFrame
===========================================================
*/

const PulseRouter = {

  // -------------------------------------------------------
  // 1. Identity & Scope (A)
  // -------------------------------------------------------
  Identity: {
    routerID: null,
    regionID: null,
    createdBy: "PulseWorldCore",
    version: "v1.0-EVO"
  },

  // -------------------------------------------------------
  // 2. Inputs (What the Router Can See)
  // -------------------------------------------------------
  Inputs: {
    A_sources: {
      meshOrganID: "PulseMesh",
      expansionOrganID: "PulseExpansion",
      castleOrganID: "PulseCastle",
      beaconOrganID: "PulseBeaconEngine"
    },
    B_stateAwareness: {
      readMeshStrength: true,
      readMeshPressureIndex: true,
      readCastleHealth: true,
      readExpansionContracts: true
    },
    A_contracts: {
      mustNotRouteWithoutSafetyFrame: true
    }
  },

  // -------------------------------------------------------
  // 3. Routing Policy (A → B → A)
  // -------------------------------------------------------
  Policy: {
    A_baseline: {
      preferLocalCastle: true,
      preferLocalMesh: true,
      fallbackToRemoteCloud: true,
      avoidLoops: true
    },
    B_adaptive: {
      pressureAware: true,
      latencyAware: true,
      costAware: true
    },
    A_limits: {
      maxHops: 8
    }
  },

  // -------------------------------------------------------
  // 4. Decision Engine (How Routes Are Chosen)
  // -------------------------------------------------------
  DecisionEngine: {
    A_rules: {
      routeToNearestHealthyCastleWhenAvailable: true,
      routeViaMeshWhenNoCastle: true,
      routeToCloudAsLastResort: true
    },
    B_behavior: {
      adjustRouteOnHighPressure: true,
      avoidOverloadedCastles: true,
      preferPathsThatReduceMeshPressure: true
    },
    A_contracts: {
      mustRespectUserOptIn: true,
      mustRespectSafetyFrame: true
    }
  },

  // -------------------------------------------------------
  // 5. Telemetry & Logging
  // -------------------------------------------------------
  Telemetry: {
    metrics: {
      routedRequests: 0,
      localRouted: 0,
      meshRouted: 0,
      cloudRouted: 0,
      avgRouteLatencyMs: null
    },
    reportTargets: {
      toExpansion: true,
      toLogger: true
    }
  },

  // -------------------------------------------------------
  // 6. Contracts (DNA)
  // -------------------------------------------------------
  Contracts: {
    mustPreferLocalFirst: true,
    mustAvoidLoops: true,
    mustRespectSafetyFrame: true
  }

};

export default PulseRouter;
