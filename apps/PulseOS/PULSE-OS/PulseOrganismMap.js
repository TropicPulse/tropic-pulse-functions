// ============================================================================
// FILE: /apps/PulseOS/Brain/PulseOrganismMap.js
// PULSE ORGANISM MAP — v11‑EVO‑BINARY‑MAX
// “DESIGNED ORGANISM / NO MIDDLEMEN / BINARY‑FIRST NERVOUS SYSTEM”
// ============================================================================
//
//  ROLE:
//  -----
//  • Single source of truth for the organism layout
//  • Text‑only blueprint: NO imports, NO execution, NO dynamic logic
//  • Describes systems, organs, aliases, and route chains
//
//  v11‑EVO‑BINARY‑MAX DIRECTION:
//  -----------------------------
//  • Binary‑first nervous system — BinaryRouter / BinaryProxy / Mesh / Send / Pulse
//  • No middlemen between intent and machine — no translator cores
//  • Pulse‑* (backend) folders = repairable backend organs
//  • Non‑Pulse‑* folders = frontend / UX / surface
//  • Proxy Spine v11 = unified backend spine + vitals pump (no business logic)
//  • New repair organs: PulseHistoryRepair (short‑term memory repair),
//    PulseBandCleanup (pulseband session/error cleanup)
//
//  CONTRACT:
//  ---------
//  • This file is DESIGN‑ONLY, not executable logic
//  • Must stay deterministic, static, and text‑only
//  • Must align with PulseIntentMap (v11‑EVO‑BINARY) and PulseIQMap
// ============================================================================

export const PulseOrganismMap = {
  version: "11‑EVO‑BINARY‑MAX",

  // ========================================================================
  // SYSTEMS — Compact, but complete (backend = pulse‑* roots)
  // ========================================================================
  systems: {

    // ----------------------------------------------------------------------
    // CORE OS — CNS / Memory / Reflex / Immune / SDN / GPU‑v11
    // ----------------------------------------------------------------------
    "pulse-os": {
      role: "CNS / Memory / Reflex / Immune / SDN / GPU‑v11",
      root: "pulse-os",
      organs: [
        // Identity + Brain
        "PulseOrganismMap","PulseIntentMap","PulseIQMap",
        "PulseOSBrain","PulseOSBrainCortex","PulseOSBrainStem","PulseOSBrainEvolution",

        // Nervous System
        "PulseSDN","PulseGPUv11",

        // Reflex + Immune
        "PulseOSFightFlightResponse","PulseOSImmuneSystem","PulseOSInflammatoryResponse",

        // Memory
        "PulseOSLongTermMemory","PulseOSShortTermMemory","PulseOSLiverMemory",

        // Membranes
        "PulseOSBBB","PulseOSMucusMembrane","PulseOSOrganMembrane","PulseOSTissueMembrane",

        // Senses + Reflex
        "PulseOSSensoryCortex","PulseOSSkinReflex",

        // Survival
        "PulseOSSurvivalInstincts","PulseOSThymus",

        // Alerts
        "RouteDownAlert"
      ]
    },

    // ----------------------------------------------------------------------
    // BINARY NERVOUS SYSTEM — Pure binary + fallback tiers
    //  • First‑class binary organism on binary‑designed hardware
    //  • No translator core between binary nerves and CPU
    // ----------------------------------------------------------------------
    "pulse-binary": {
      role: "Binary Nervous System / Pure Binary Nerves / Tiered Fallback",
      root: "pulse-binary",
      organs: [
        // Pure binary nerves (no middlemen)
        "BinaryProxy-v11-PURE-EVO","BinaryRouter-v11-PURE-EVO",
        "BinaryMesh-v11-PURE-EVO","BinarySend-v11-PURE-EVO","BinaryPulse-v11-PURE-EVO",

        // Binary organism bootloader
        "AIBinaryOrganism",

        // Binary cortex organs
        "BinaryAgent","BinaryMemory","BinaryPipeline","BinaryReflex",
        "BinaryLoggerAdapter","BinaryPageScannerAdapter","BinaryEvolution",
        "BinaryGovernorAdapter","BinaryOrganRegistry","BinaryDelta","BinaryConductor",

        // Binary scanners
        "BinaryMRI","BinaryWaveScanner","BinaryLoopScanner",

        // Binary archetypes
        "BinaryDoctor","BinaryCommunicator"
      ]
    },

    // ----------------------------------------------------------------------
    // DESIGN SYSTEM — Repo / Manifest / Translation (text‑side only)
    // ----------------------------------------------------------------------
    "pulse-design": {
      role: "Design / Repo / Manifest / Translation",
      root: "pulse-design",
      organs: ["fileClassifier","manifestBuilder","manifestWriter","translator","repoWalker"]
    },

    // ----------------------------------------------------------------------
    // EARN SYSTEM — Economy / Market / Biological Engine
    // ----------------------------------------------------------------------
    "pulse-earn": {
      role: "Economy / Market / Biological Earn Engine",
      root: "pulse-earn",
      organs: [
        "PulseEarn","PulseEarnCell","PulseEarnCirculatorySystem","PulseEarnCustomReceptor",
        "PulseEarnEndocrineSystem","PulseEarnGeneticMemory","PulseEarnGenome","PulseEarnHeart",
        "PulseEarnImmuneSystem","PulseEarnLymphNodes","PulseEarnMetabolism","PulseEarnMktAmbassador",
        "PulseEarnMktAuctioneer","PulseEarnMktBroker","PulseEarnMktConsulate","PulseEarnMktCourier",
        "PulseEarnMktEmbassyLedger","PulseEarnMktForager","PulseEarnMuscleSystem","PulseEarnNervousSystem",
        "PulseEarnReceptor","PulseEarnReflex","PulseEarnReflexRouter","PulseEarnSkeletalSystem",
        "PulseEarnSurvivalInstincts","PulseEarnSendSystem","PulseEarnContinuancePulse","PulseEarnTest"
      ]
    },

    // ----------------------------------------------------------------------
    // GPU SYSTEM — Deterministic GPU v11
    // ----------------------------------------------------------------------
    "pulse-gpu": {
      role: "GPU / Deterministic Compute",
      root: "pulse-gpu",
      organs: ["PulseGPUv11"]
    },

    // ----------------------------------------------------------------------
    // MESH SYSTEM — Aura / Cognition / Endocrine / Immune / Cortex
    // ----------------------------------------------------------------------
    "pulse-mesh": {
      role: "Mesh / Aura / Cognition / Endocrine / Immune / Cortex",
      root: "pulse-mesh",
      organs: [
        "PulseMeshAura","PulseMeshAwareness","PulseMeshCognition","PulseMeshCortex",
        "PulseMeshEcho","PulseMeshEndocrineSystem","PulseMeshEnvironmentalField",
        "PulseMeshEvolutionaryWiring","PulseMeshOrgans","PulseMeshFlow","PulseMeshHormones",
        "PulseMeshImmuneMembrane","PulseMeshImmuneSystem","PulseMeshSenses","PulseMeshSkin",
        "PulseMeshSpine","PulseMeshSurvivalInstincts","PulseMeshTendons","PulseMeshThalamus"
      ]
    },

    // ----------------------------------------------------------------------
    // PROXY SYSTEM — Edge / Pressure / Vitals / Spine / Blood
    //  • Backend spine (PulseProxySpine v11) is organism‑correct, no business logic
    //  • New repair organs live here: PulseHistoryRepair, PulseBandCleanup
    // ----------------------------------------------------------------------
    "pulse-proxy": {
      role: "Proxy / Edge / Pressure / Vitals / Spine / Blood",
      root: "pulse-proxy",
      organs: [
        // Legacy proxy
        "CheckBand","CheckIdentity","CheckRouterMemory","PulseProxyAdrenalSystem",
        "PulseProxyBBB","PulseProxyBloodPressure","PulseProxyBloodStream",
        "PulseProxyCirculatorySystem","PulseProxyHeart","PulseProxyHeartBeat",
        "PulseProxyHypothalamus","PulseProxyImpulse","PulseProxyLimbic",
        "PulseProxyOuterAgent","PulseProxySpine","PulseProxySynapse",
        "PulseProxyVitalsLogger","PulseProxyVitalsMonitor","PulseProxyWBCells",

        // v11‑EVO proxy spine + repair
        "PulseProxy-v11-Evo","BinaryProxyFallbackTier",
        "PulseHistoryRepair","PulseBandCleanup"
      ]
    },

    // ----------------------------------------------------------------------
    // ROUTER SYSTEM — Evolutionary Thought + Binary Routing
    // ----------------------------------------------------------------------
    "pulse-router": {
      role: "Routing / Evolutionary Thought / Binary Routing",
      root: "pulse-router",
      organs: ["PulseRouterEvolutionaryThought","BinaryRouter-v11-PURE-EVO"]
    },

    // ----------------------------------------------------------------------
    // SEND SYSTEM — Outbound Delivery (Legacy + Binary)
    // ----------------------------------------------------------------------
    "pulse-send": {
      role: "Outbound / Delivery / Deterministic Send / Binary Send",
      root: "pulse-send",
      organs: ["PulseSendSystem","BinarySend-v11-PURE-EVO"]
    },

    // ----------------------------------------------------------------------
    // PULSE SYSTEM — Heartbeat + Binary Pulse
    // ----------------------------------------------------------------------
    "pulse-pulse": {
      role: "Heartbeat / Pulse / Binary Pulse",
      root: "pulse-pulse",
      organs: ["PulseShifterEvolutionaryPulse","BinaryPulse-v11-PURE-EVO"]
    },

    // ----------------------------------------------------------------------
    // SCANNER SYSTEM — MRI / Wave / Loop
    // ----------------------------------------------------------------------
    "pulse-scanner": {
      role: "Scanning / MRI / Wave / Loop",
      root: "pulse-scanner",
      organs: ["BinaryMRI","BinaryWaveScanner","BinaryLoopScanner"]
    },

    // ----------------------------------------------------------------------
    // ARCHETYPE SYSTEM — AI Archetypes
    // ----------------------------------------------------------------------
    "pulse-archetypes": {
      role: "AI Archetypes / Doctor / Communicator / Agent",
      root: "pulse-archetypes",
      organs: ["BinaryDoctor","BinaryCommunicator","BinaryAgent"]
    },

    // ----------------------------------------------------------------------
    // DYNAMIC PAGE SYSTEM — Evolutionary UI (front‑of‑organism)
//  Text/UI layer; binary stays underneath as nervous system.
// ----------------------------------------------------------------------
    "pulse-dynamic": {
      role: "Dynamic Page System / Evolutionary UI",
      root: "pulse-dynamic",
      organs: ["PulseEvolutionaryPage","PageEvo","DynamicWrapperPage"]
    }
  },

  // ========================================================================
  // ALIASES — Compact but complete (legacy → v11 → binary)
//  NOTE: These are TEXT‑ONLY mappings; execution lives in Pulse‑* folders.
// ========================================================================
  aliases: {
    base: {
      PulseBand: {
        old: ["PulseBand"],
        now: ["PulseOSSkinReflex","PulseOSSensoryCortex","PulseProxyImpulse"]
      },
      PulseNet:  {
        old: ["PulseNet"],
        now: ["PulseSDN"]
      },
      PulseClient: {
        old: ["PulseClient"],
        now: ["PulseProxyImpulse","PulseProxySpine"]
      },
      PulseUpdate: {
        old: ["PulseUpdate"],
        now: ["PulseOSBrainEvolution","PulseIQ"]
      },
      PulseIdentity: {
        old: ["PulseIdentity"],
        now: ["PulseProxyBBB"]
      }
    },

    routing: {
      Router: {
        old: ["router.js","PulseRouter"],
        now: ["PulseRouterEvolutionaryThought"]
      },
      RouterMemory: {
        old: ["RouterMemory"],
        now: ["PulseOSShortTermMemory","PulseOSTissueMembrane"]
      },
      BackendEndpoint: {
        old: ["Endpoint"],
        now: ["PulseProxyOuterAgent"]
      },
      BackendRouter: {
        old: ["BackendRouter"],
        now: ["PulseProxySpine"]
      }
    },

    // --------------------------------------------------------------------
    // LEGACY ROUTE CHAIN — Text‑first historical path (for reference only)
    // --------------------------------------------------------------------
    routeChain: {
      old: ["PulseBand","PulseNet","PulseClient","router.js","organ","PulseSend","backend"],
      now: [
        "PulseOSSkinReflex / PulseOSSensoryCortex",
        "PulseSDN",
        "PulseProxyImpulse",
        "PulseRouterEvolutionaryThought",
        "Organ (PulseOrganismMap)",
        "PulseSendSystem",
        "PulseProxySpine"
      ]
    },

    // --------------------------------------------------------------------
    // BINARY ROUTE CHAIN — v11‑EVO‑BINARY (no middlemen)
//  This is the “game‑change” path: binary‑first, binary‑on‑binary hardware.
// --------------------------------------------------------------------
    binaryRouteChain: {
      old: [],
      now: [
        "PulseOSSkinReflex / PulseOSSensoryCortex",
        "PulseSDN",
        "BinaryRouter-v11-PURE-EVO",
        "BinaryProxy-v11-PURE-EVO",
        "BinaryMesh-v11-PURE-EVO",
        "BinarySend-v11-PURE-EVO",
        "BinaryPulse-v11-PURE-EVO"
      ]
    }
  }
};

// ============================================================================
// END OF FILE — PULSE ORGANISM MAP / v11‑EVO‑BINARY‑MAX
// Text‑only blueprint of a binary‑first organism on binary‑designed hardware.
// All backend repair targets live in pulse‑* (PULSE‑*) folders.
// ============================================================================
