/*
===========================================================
 PULSE-WORLD : PulseWorldCore-v1.js
 ORGAN TYPE: Local OS / Experience Orchestrator
 VERSION: v1.0-EVO (A-B-A Pattern)

 META BLOCK:
 ----------------------------------------------------------
 ROLE:
   PulseWorldCore is the local OS layer that boots when a
   user taps the beacon. It binds Beacon → Router → Castle
   → Mesh into a coherent local-first experience, loads
   tools, and respects Evolution + SafetyFrame contracts.

 CONTRACT:
   - Must only boot after explicit user opt-in.
   - Must respect offline-first and local-first principles.
   - Must route via PulseRouter, not directly to castles/mesh.
   - Must expose clear, minimal, reversible controls.

 ARCHITECTURE:
   A = Baseline experience shell (identity, boot, tools).
   B = Adaptive behavior (density-aware UI, local/remote blending).
   A = Return to deterministic, predictable UX contracts.

 DEPENDENCIES:
   - PulseBeaconEngine
   - PulseRouter
   - PulseExpansion
   - PulseCastle
   - PulseMesh
   - SafetyFrame
===========================================================
*/

const PulseWorldCore = {

  // -------------------------------------------------------
  // 1. Identity & Scope (A)
  // -------------------------------------------------------
  Identity: {
    coreID: "PulseWorldCore",
    version: "v1.0-EVO",
    createdBy: "PulseOS",
    regionID: null
  },

  // -------------------------------------------------------
  // 2. Boot Sequence (Beacon Tap → Core)
  // -------------------------------------------------------
  Boot: {
    A_triggers: {
      fromBeaconTap: true,
      fromLocalShortcut: true
    },
    B_contextAwareness: {
      readRegionFromBeacon: true,
      readCastlePresenceFromExpansion: true,
      readMeshStrengthFromMesh: true
    },
    A_contracts: {
      mustRequireUserOptIn: true,
      mustRespectSafetyFrame: true
    }
  },

  // -------------------------------------------------------
  // 3. Routing Integration (Core ↔ PulseRouter)
  // -------------------------------------------------------
  Routing: {
    A_links: {
      routerOrganID: "PulseRouter"
    },
    B_behavior: {
      preferLocalFirst: true,
      askRouterForBestPath: true,
      avoidDirectCastleBypass: true
    },
    A_contracts: {
      mustNotOverrideRouterPolicy: true
    }
  },

  // -------------------------------------------------------
  // 4. Experience Shell (Local Dashboard + Tools)
  // -------------------------------------------------------
  Experience: {
    A_layout: {
      hasLocalDashboard: true,
      hasToolsTray: true,
      hasEvolutionPanel: true
    },
    B_adaptiveUI: {
      densityAwareUI: true,
      meshStrengthIndicators: true,
      castlePresenceIndicators: true
    },
    A_tools: {
      defaultTools: ["MyDay", "MyTools", "Evolution", "LocalPulse"],
      offlineFirst: true
    }
  },

  // -------------------------------------------------------
  // 5. Evolution & Consent Integration
  // -------------------------------------------------------
  Evolution: {
    A_links: {
      expansionOrganID: "PulseExpansion"
    },
    B_behavior: {
      showEvolutionOptIn: true,
      showScopeOfCoordination: true
    },
    A_contracts: {
      mustBeReversible: true,
      mustBeExplicit: true
    }
  },

  // -------------------------------------------------------
  // 6. Telemetry & Contracts
  // -------------------------------------------------------
  Telemetry: {
    metrics: {
      sessionsStarted: 0,
      localSessions: 0,
      remoteSessions: 0
    },
    reportTargets: {
      toExpansion: true,
      toLogger: true
    }
  },

  Contracts: {
    mustRespectUserTime: true,
    mustPreferLocalFirst: true,
    mustRespectSafetyFrame: true
  }

};

export default PulseWorldCore;
