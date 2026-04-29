// ============================================================================
//  PULSE OS v13‑SPINE — BRAINSTEM
//  Organ Assembly • Dual‑Band Context Binding • CNS Integration
//  PURE ORGANISM. ZERO MUTATION. ZERO RANDOMNESS.
// ============================================================================

export const BrainstemMeta = Object.freeze({
  type: "Cognitive",
  subsystem: "aiBrainstem",
  layer: "OrganAssembly",
  role: "BRAINSTEM_ORGAN",
  version: "13-SPINE",
  identity: "aiBrainstem-v13-SPINE",

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
    epoch: "v13-SPINE"
  }),

  contract: Object.freeze({
    purpose:
      "Assemble all CNS engines, symbolic organs, and the dual-band organism into a unified, deterministic, drift-proof Pulse OS organism.",

    never: Object.freeze([
      "mutate external organs",
      "introduce randomness",
      "override organ contracts",
      "modify persona boundaries",
      "modify permissions",
      "generate symbolic state",
      "block organism execution"
    ]),

    always: Object.freeze([
      "assemble deterministically",
      "bind identity and persona engines",
      "bind boundaries and permissions",
      "bind router and cortex",
      "bind dual-band organism",
      "return a frozen organism map",
      "remain read-only and drift-proof"
    ])
  }),

  boundaryReflex() {
    return "Brainstem assembly is deterministic and read-only — it cannot mutate or override any organ.";
  }
});

// ============================================================================
//  IMPORTS
// ============================================================================

// ⭐ CNS‑SAFE v13 Chunker
import { createPulseChunker } from "../PULSE-OS/PulseChunker-v13-SPINE.js";

import PulseOSPresence from "../PULSE-OS/PulseOSPresence-v12.4-EVO.js";
import PulseMeshPresenceRelay from "../PULSE-MESH/PulseMeshPresenceRelay-v12.4-EVO.js";

import { createArchitectAPI } from "./aiArchitect.js";
import { createTouristAPI, prewarmTourist } from "./aiTourist.js";

import { createEnvironmentAPI } from "./aiEnvironment.js";
import { createPowerAPI } from "./aiPowerPrime.js";
import { createEvolutionAPI } from "./aiEvolution.js";
import { createEarnAPI } from "./aiEarn.js";
import { createDiagnosticsWriteAPI } from "./aiDiagnosticsWrite.js";

import { createPersonaEngine } from "./persona.js";
import { createBoundariesEngine } from "./boundaries.js";
import { createPermissionsEngine } from "./permissions.js";
import { createRouterEngine } from "./aiRouter-v11-Evo.js";
import { createCortex } from "./aiCortex-v11-Evo.js";

import { createDualBandOrganism } from "./aiDualBand-v11-Evo.js";

// Non-binary symbolic organs
import { createDoctorAPI } from "./aiDoctor.js";
import { createSurgeonAPI } from "./aiSurgeon.js";
import { createLawyerAPI } from "./aiLawyer.js";
import { createEntrepreneurAPI } from "./aiEntrepreneur.js";
import { createVeterinarianAPI } from "./aiVeterinarian.js";
import { createClinicianAPI } from "./aiClinician.js";
import { createEvolutionaryAPI } from "./aiEvolutionary.js";

// ============================================================================
//  ORGAN ASSEMBLY — v13‑SPINE (Universal Chunk Fabric Brainstem)
// ============================================================================
export function createOrgans(context, db, fsAPI, routeAPI, schemaAPI) {

  // ------------------------------------------------------------------------
  // 0) UNIVERSAL CNS GLOBAL SURFACE
  // ------------------------------------------------------------------------
  global.db    = db;
  global.log   = context.log;
  global.warn  = context.warn;
  global.error = context.error;

  global.fsAPI     = fsAPI;
  global.routeAPI  = routeAPI;
  global.schemaAPI = schemaAPI;
  global.fetchAPI  = context.fetchAPI || global.fetchAPI || null;

  // Optional aliasing for chunker that wants admin/db unified
  const admin = global.db;

  // ------------------------------------------------------------------------
  // 1) CNS CHUNKER — v13 PulseBandSession + Logger‑routed
  // ------------------------------------------------------------------------
  const chunker = createPulseChunker({
    Brain: {
      log: context.log,
      warn: context.warn,
      error: context.error,
      firebase: () => db,
      fsAPI,
      routeAPI,
      schemaAPI
    },
    Logger: context
  });

  if (typeof chunker.startPulseBandSession === "function") {
    chunker.startPulseBandSession({
      trace: context.trace,
      db,
      fsAPI,
      routeAPI,
      schemaAPI
    });
  }

  // ------------------------------------------------------------------------
  // 2) CNS ENGINES (identity, persona, boundaries, permissions)
  // ------------------------------------------------------------------------
  const personaEngine = createPersonaEngine({ context, db });
  const boundariesEngine = createBoundariesEngine({ context, db });
  const permissionsEngine = createPermissionsEngine({ context, db });

  // ------------------------------------------------------------------------
  // 3) ROUTER + CORTEX (symbolic CNS)
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
  // 4) DUAL‑BAND ORGANISM (symbolic ↔ binary)
  // ------------------------------------------------------------------------
  const dualBand = createDualBandOrganism({
    trace: context.trace,
    db,
    fsAPI,
    routeAPI,
    schemaAPI
  });

  // ------------------------------------------------------------------------
  // 5) REAL ORGANS (symbolic service organs)
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
  // 6) CORE ORGANS (v10.4 → v13‑SPINE)
  // ------------------------------------------------------------------------
  const architect = createArchitectAPI({ context, db });
  const tourist = createTouristAPI({ context, db });
  const environment = createEnvironmentAPI({ context, db, fsAPI, routeAPI });
  const power = createPowerAPI({ context, db });
  const evolution = createEvolutionAPI({ context, fsAPI, routeAPI, schemaAPI });
  const earn = createEarnAPI({ context, db });
  const diagnosticsWrite = createDiagnosticsWriteAPI({ context, db });

  // ------------------------------------------------------------------------
  // 7) UNIVERSAL SYSTEM MAP
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
  });

  // ------------------------------------------------------------------------
  // 8) REGISTER CHUNKER WITH DUAL‑BAND + ROUTER
  // ------------------------------------------------------------------------
  dualBand?.registerBackendOrgan?.("chunker", chunker);
  router?.registerBackendOrgan?.("chunker", chunker);

  // ------------------------------------------------------------------------
  // 9) UNIVERSAL REGISTRATION WITH CHUNKER
  // ------------------------------------------------------------------------
  if (chunker?.registerBackendOrgan) {
    for (const [name, system] of Object.entries(ALL_SYSTEMS)) {
      if (system?.chunk) {
        chunker.registerBackendOrgan(name, {
          chunk: system.chunk,
          prewarm: system.prewarm
        });
      }
    }
  }

  // ------------------------------------------------------------------------
  // 10) UNIVERSAL PREWARM
  // ------------------------------------------------------------------------
  chunker?.prewarm?.();

  for (const system of Object.values(ALL_SYSTEMS)) {
    system?.prewarm?.();
  }

  // ------------------------------------------------------------------------
  // 11) RETURN FULL ORGANISM MAP
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
