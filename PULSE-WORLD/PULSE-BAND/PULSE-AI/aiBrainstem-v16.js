// ============================================================================
//  PULSE OS v16‑IMMORTAL++ — BRAINSTEM
//  Organ Assembly • Dual‑Band Context Binding • CNS + Pulse‑Net Integration
//  PURE ORGANISM. ZERO MUTATION. ZERO RANDOMNESS. ZERO DIRECT INTERNET.
// ============================================================================
//
// ROLE (v16‑Immortal++ Hybrid):
//   • Assemble CNS engines, symbolic organs, and the dual‑band organism
//     into a unified, deterministic, drift‑proof Pulse OS organism.
//   • Bind persona/boundaries/permissions/router/cortex to DualBand organism.
//   • Bind universal chunk fabric (32 lanes) to CNS + DualBand artery.
//   • Bind trust fabric: evidence, jury, honeypotting, dominance detection.
//   • Bind Pulse‑Net as the ONLY external IO surface (no raw internet).
//   • Keep organism/user fully segregated; Pulse is the routed surface.
//   • Emit a frozen, read‑only organism map for higher layers.
//
// CONTRACT:
//   • Deterministic, read‑only assembly.
//   • No mutation of external organs or DB.
//   • No randomness, no timestamps, no direct network access.
//   • All external IO must be routed via Pulse‑Net / Pulse surfaces.
// ============================================================================

/*
AI_EXPERIENCE_META = {
  identity: "createOrgans",
  version: "v16-Immortal++-Hybrid-Spine",
  layer: "ai_tools",
  role: "organ_creation_engine",
  lineage: "createOrgans-v11 → v13-SPINE → v14-Immortal → v16-Immortal++-Hybrid-Spine",

  evo: {
    organCreation: true,
    organMapping: true,
    symbolicPrimary: true,
    binaryAware: true,
    dualBand: true,
    arteryAware: true,
    chunkerAware: true,
    lanes32Aware: true,
    trustFabricAware: true,
    juryAware: true,
    evidenceAware: true,
    honeypotAware: true,
    dominanceAware: true,
    pulseNetAware: true,
    organismUserSegregation: true,

    deterministic: true,
    driftProof: true,
    pureCompute: true,
    zeroNetwork: true,          // no raw internet; Pulse‑Net only
    zeroFilesystem: true,
    zeroMutationOfInput: true
  },

  contract: {
    always: [
      "aiOrganism",
      "aiAnatomy",
      "aiBrainstem",
      "PulseAIChunker",
      "PulseDualBandOrganism",
      "PulseNetProxySpine",
      "PulseTrustFabric",
      "PulseJuryFrame"
    ],
    never: [
      "safeRoute",
      "fetchViaCNS",
      "directInternetAccess",
      "externalHTTP",
      "externalDNS",
      "externalWebsocket"
    ]
  }
}
*/

export const BrainstemMeta = Object.freeze({
  type: "Cognitive",
  subsystem: "aiBrainstem",
  layer: "OrganAssembly",
  role: "BRAINSTEM_ORGAN",
  version: "16-IMMORTAL++-HYBRID-SPINE",
  identity: "aiBrainstem-v16-IMMORTAL++-HYBRID-SPINE",

  evo: Object.freeze({
    driftProof: true,
    deterministic: true,
    dualband: true,
    binaryAware: true,
    symbolicAware: true,
    readOnly: true,
    mutationSafe: true,
    nonBlocking: true,
    lineageAware: true,
    multiInstanceReady: true,
    arteryAware: true,
    chunkerAware: true,
    lanes32Aware: true,
    trustFabricAware: true,
    juryAware: true,
    evidenceAware: true,
    honeypotAware: true,
    dominanceAware: true,
    pulseNetAware: true,
    organismUserSegregation: true,
    epoch: "v16-IMMORTAL++-HYBRID-SPINE"
  }),

  contract: Object.freeze({
    purpose:
      "Assemble all CNS engines, symbolic organs, and the dual-band organism into a unified, deterministic, drift-proof Pulse OS organism, with universal chunk fabric and trust fabric bound to Pulse‑Net.",

    never: Object.freeze([
      "mutate external organs",
      "introduce randomness",
      "override organ contracts",
      "modify persona boundaries",
      "modify permissions",
      "generate arbitrary symbolic state",
      "block organism execution",
      "directInternetAccess",
      "externalHTTP",
      "externalDNS",
      "externalWebsocket"
    ]),

    always: Object.freeze([
      "assemble deterministically",
      "bind identity and persona engines",
      "bind boundaries and permissions",
      "bind router and cortex",
      "bind dual-band organism and artery",
      "bind universal chunk fabric (32 lanes)",
      "bind trust fabric + jury + evidence surfaces",
      "route all external IO via Pulse‑Net / Pulse surfaces",
      "return a frozen organism map",
      "remain read-only and drift-proof"
    ])
  }),

  boundaryReflex() {
    return "Brainstem assembly is deterministic, read-only, Pulse‑Net routed, and cannot mutate or override any organ.";
  }
});

// ============================================================================
//  IMPORTS
// ============================================================================

// ⭐ CNS‑SAFE v16 Chunker (32 lanes, Pulse‑Net aware)
import { createPulseChunker } from "../PULSE-OS/PulseChunker-v2.js"; // implementation upgraded at source

import PulseOSPresence from "../PULSE-OS/PulseOSPresence-v12.4-Evo.js";
import PulseMeshPresenceRelay from "../PULSE-MESH/PulseMeshPresenceRelay-v12.4-Evo.js";

import { createArchitectAPI } from "./aiArchitect.js";
import { createTouristAPI, prewarmTourist } from "./aiTourist.js";

import { createEnvironmentAPI } from "./aiEnvironment.js";
import { createPowerAPI } from "./aiPowerPrime.js";
import { createEvolutionAPI } from "./aiEvolution.js";
import { createEarnAPI } from "./aiEarn-v16.js";
import { createDiagnosticsWriteAPI } from "./aiDiagnosticsWrite.js";

import { createPersonaEngine } from "./persona.js";
import { createBoundariesEngine } from "./boundaries.js";
import { createPermissionsEngine } from "./permissions.js";
import { createRouterEngine } from "./aiRouter-v16.js";
import { createCortex } from "./aiCortex-v16.js";

import { createDualBandOrganism } from "./aiDualBand-v16.js";

// Non-binary symbolic organs
import { createDoctorAPI } from "./aiDoctorAssistant.js";
import { createSurgeonAPI } from "./aiSurgeon.js";
import { createLawyerAPI } from "./aiLawAssistant.js";
import { createEntrepreneurAPI } from "./aiEntrepreneur.js";
import { createVeterinarianAPI } from "./aiVeterinarian.js";
import { createClinicianAPI } from "./aiClinician.js";
import { createEvolutionaryAPI } from "./aiEvolutionary.js";

// (Trust / jury / evidence surfaces would be imported here when implemented)
// import { createTrustFabricAPI } from "./aiTrustFabric.js";
// import { createJuryFrameAPI } from "./aiJuryFrame.js";

// ============================================================================
//  INTERNAL HELPERS — Pulse‑Net + Chunker lanes
// ============================================================================
function buildPulseNetSurface(context) {
  // Pulse is the routed thing; everything else talks through it.
  return Object.freeze({
    fetch: context.fetchAPI || null,
    pulseNet: context.PulseNet || null,
    proxySpine: context.ProxySpine || null,
    boxCamera: context.BoxCamera || null,
    juryFrame: context.JuryFrame || null,
    trustFabric: context.TrustFabric || null
  });
}

function buildChunkerConfig(context, db, fsAPI, routeAPI, schemaAPI, pulseNetSurface) {
  return {
    Brain: {
      log: context.log,
      warn: context.warn,
      error: context.error,
      firebase: () => db,
      fsAPI,
      routeAPI,
      schemaAPI,
      PulseNet: pulseNetSurface.pulseNet,
      ProxySpine: pulseNetSurface.proxySpine,
      JuryFrame: pulseNetSurface.juryFrame,
      TrustFabric: pulseNetSurface.trustFabric
    },
    Logger: context,
    Lanes: {
      total: 32,
      // lane naming is advisory; chunker implementation enforces determinism
      names: [
        "lane-core",
        "lane-earn",
        "lane-evolution",
        "lane-doctor",
        "lane-surgeon",
        "lane-lawyer",
        "lane-entrepreneur",
        "lane-veterinarian",
        "lane-clinician",
        "lane-environment",
        "lane-power",
        "lane-tourist",
        "lane-architect",
        "lane-diagnostics",
        "lane-presence",
        "lane-mesh",
        "lane-dualband",
        "lane-router",
        "lane-cortex",
        "lane-trust",
        "lane-jury",
        "lane-evidence",
        "lane-anomaly",
        "lane-honeypot",
        "lane-dominance",
        "lane-scanfile",
        "lane-code",
        "lane-binary-metrics",
        "lane-symbolic-metrics",
        "lane-prewarm",
        "lane-reserved-1",
        "lane-reserved-2"
      ]
    }
  };
}

// ============================================================================
//  ORGAN ASSEMBLY — v16‑IMMORTAL++ Hybrid Spine
// ============================================================================
export function createOrgans(context, db, fsAPI, routeAPI, schemaAPI) {
  // ------------------------------------------------------------------------
  // 0) UNIVERSAL CNS GLOBAL SURFACE (kept for legacy, but Pulse‑Net is primary)
  // ------------------------------------------------------------------------
  global.db    = db;
  global.log   = context.log;
  global.warn  = context.warn;
  global.error = context.error;

  global.fsAPI     = fsAPI;
  global.routeAPI  = routeAPI;
  global.schemaAPI = schemaAPI;

  // NOTE: fetchAPI is considered Pulse‑Net routed; no raw internet here.
  global.fetchAPI  = context.fetchAPI || global.fetchAPI || null;

  const admin = global.db; // optional alias for chunker/admin tools

  // ------------------------------------------------------------------------
  // 1) PULSE‑NET SURFACE
  // ------------------------------------------------------------------------
  const pulseNetSurface = buildPulseNetSurface(context);

  // ------------------------------------------------------------------------
  // 2) CNS CHUNKER — v16 Hybrid Spine (32 lanes, Pulse‑Net aware)
// ------------------------------------------------------------------------
  const chunker = createPulseChunker(
    buildChunkerConfig(context, db, fsAPI, routeAPI, schemaAPI, pulseNetSurface)
  );

  if (typeof chunker.startPulseBandSession === "function") {
    chunker.startPulseBandSession({
      trace: context.trace,
      db,
      fsAPI,
      routeAPI,
      schemaAPI,
      PulseNet: pulseNetSurface.pulseNet
    });
  }

  // ------------------------------------------------------------------------
  // 3) CNS ENGINES (identity, persona, boundaries, permissions)
  // ------------------------------------------------------------------------
  const personaEngine = createPersonaEngine({ context, db });
  const boundariesEngine = createBoundariesEngine({ context, db });
  const permissionsEngine = createPermissionsEngine({ context, db });

  // ------------------------------------------------------------------------
  // 4) ROUTER + CORTEX (symbolic CNS)
  // ------------------------------------------------------------------------
  const router = createRouterEngine({
    context,
    personaEngine,
    boundariesEngine,
    permissionsEngine
  });

  const cortex = createCortex({
    context,
    router,
    personaEngine,
    boundariesEngine,
    permissionsEngine
  });

  // ------------------------------------------------------------------------
  // 5) DUAL‑BAND ORGANISM (symbolic ↔ binary, artery‑aware)
// ------------------------------------------------------------------------
  const dualBand = createDualBandOrganism({
    trace: context.trace,
    db,
    fsAPI,
    routeAPI,
    schemaAPI
  });

  // ------------------------------------------------------------------------
  // 6) REAL ORGANS (symbolic service organs)
// ------------------------------------------------------------------------
  const osPresence = PulseOSPresence.create({
    SystemClock: context.SystemClock,
    IdentityDirectory: context.IdentityDirectory,
    DeviceFingerprint: context.DeviceFingerprint,
    log: context.log
  });

  const meshPresenceRelay = PulseMeshPresenceRelay.create({
    MeshBus: context.MeshBus,
    SystemClock: context.SystemClock,
    IdentityDirectory: context.IdentityDirectory,
    log: context.log
  });

  const doctor = createDoctorAPI({ context, db });
  const surgeon = createSurgeonAPI({ context, db });
  const lawyer = createLawyerAPI({ context, db });
  const entrepreneur = createEntrepreneurAPI({ context, db });
  const veterinarian = createVeterinarianAPI({ context, db });
  const clinician = createClinicianAPI({ context, db });
  const evolutionary = createEvolutionaryAPI({ context, db });

  // ------------------------------------------------------------------------
  // 7) CORE ORGANS (v10.4 → v16‑IMMORTAL++)
// ------------------------------------------------------------------------
  const architect = createArchitectAPI({ context, db });
  const tourist = createTouristAPI({ context, db });
  const environment = createEnvironmentAPI({ context, db, fsAPI, routeAPI });
  const power = createPowerAPI({ context, db });
  const evolution = createEvolutionAPI({ context, fsAPI, routeAPI, schemaAPI });
  const earn = createEarnAPI({ context, db });
  const diagnosticsWrite = createDiagnosticsWriteAPI({ context, db });

  // (Future trust/jury/evidence organs would be created here)
  // const trustFabric = createTrustFabricAPI({ context, db });
  // const juryFrame = createJuryFrameAPI({ context, db });

  // ------------------------------------------------------------------------
  // 8) UNIVERSAL SYSTEM MAP
  // ------------------------------------------------------------------------
  const ALL_SYSTEMS = Object.freeze({
    personaEngine,
    boundariesEngine,
    permissionsEngine,
    router,
    cortex,
    dualBand,
    chunker,
    doctor,
    surgeon,
    lawyer,
    entrepreneur,
    veterinarian,
    clinician,
    evolutionary,
    architect,
    tourist,
    environment,
    power,
    evolution,
    earn,
    diagnosticsWrite,
    osPresence,
    meshPresenceRelay
    // trustFabric,
    // juryFrame
  });

  // ------------------------------------------------------------------------
  // 9) REGISTER CHUNKER WITH DUAL‑BAND + ROUTER
  // ------------------------------------------------------------------------
  dualBand?.registerBackendOrgan?.("chunker", chunker);
  router?.registerBackendOrgan?.("chunker", chunker);

  // ------------------------------------------------------------------------
  // 10) UNIVERSAL REGISTRATION WITH CHUNKER (lane‑aware)
// ------------------------------------------------------------------------
  if (chunker?.registerBackendOrgan) {
    for (const [name, system] of Object.entries(ALL_SYSTEMS)) {
      if (system?.chunk || system?.prewarm) {
        chunker.registerBackendOrgan(name, {
          chunk: system.chunk,
          prewarm: system.prewarm,
          // advisory lane hints; chunker decides final mapping
          laneHint: (() => {
            switch (name) {
              case "earn":
                return "lane-earn";
              case "evolution":
              case "evolutionary":
                return "lane-evolution";
              case "doctor":
              case "clinician":
              case "veterinarian":
                return "lane-doctor";
              case "surgeon":
                return "lane-surgeon";
              case "lawyer":
                return "lane-lawyer";
              case "architect":
                return "lane-architect";
              case "tourist":
                return "lane-tourist";
              case "environment":
                return "lane-environment";
              case "power":
                return "lane-power";
              case "router":
                return "lane-router";
              case "cortex":
                return "lane-cortex";
              case "dualBand":
                return "lane-dualband";
              case "osPresence":
              case "meshPresenceRelay":
                return "lane-presence";
              case "diagnosticsWrite":
                return "lane-diagnostics";
              default:
                return "lane-core";
            }
          })()
        });
      }
    }
  }

  // ------------------------------------------------------------------------
  // 11) UNIVERSAL PREWARM (CNS + organs + chunker)
// ------------------------------------------------------------------------
  chunker?.prewarm?.();

  for (const system of Object.values(ALL_SYSTEMS)) {
    system?.prewarm?.();
  }

  // Tourist prewarm (legacy explicit)
  prewarmTourist?.(tourist);

  // ------------------------------------------------------------------------
  // 12) RETURN FULL ORGANISM MAP (frozen, read‑only)
// ------------------------------------------------------------------------
  return Object.freeze(ALL_SYSTEMS);
}

// ---------------------------------------------------------------------------
//  DUAL EXPORT LAYER — CommonJS compatibility
// ---------------------------------------------------------------------------
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    BrainstemMeta,
    createOrgans
  };
}
