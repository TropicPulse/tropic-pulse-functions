// ============================================================================
//  PULSE OS v11.2‑EVO+ — BRAINSTEM
//  Organ Assembly • Dual‑Band Context Binding • CNS Integration
//  PURE ORGANISM. ZERO MUTATION. ZERO RANDOMNESS.
// ============================================================================

export const BrainstemMeta = Object.freeze({
  type: "Cognitive",
  subsystem: "aiBrainstem",
  layer: "OrganAssembly",
  role: "BRAINSTEM_ORGAN",
  version: "11.2-EVO+",
  identity: "aiBrainstem-v11.2-EVO+",

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
    epoch: "v11.2-EVO+"
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
import { createArchitectAPI } from "./aiArchitect.js";
import { createTouristAPI } from "./aiTourist.js";
import { createEnvironmentAPI } from "./aiEnvironment.js";
import { createPowerAPI } from "./aiPower.js";
import { createEvolutionAPI } from "./aiEvolution.js";
import { createEarnAPI } from "./aiEarn.js";
import { createDiagnosticsWriteAPI } from "./aiDiagnosticsWrite.js";

import { createPersonaEngine } from "./persona.js";
import { createBoundariesEngine } from "./boundaries.js";
import { createPermissionsEngine } from "./permissions.js";
import { createRouterEngine } from "./aiRouter-v11-Evo.js";
import { createCortex } from "./aiCortex-v11-Evo.js";

import { createDualBandOrganism } from "./aiDualBand-v11-Evo.js";

// ⭐ NEW: backend chunker organ factory (pre-chunk before organ creation)
import { createPulseChunker } from "../PULSE-OS/PulseChunker-v1.js";

// Non-binary symbolic organs
import { createDoctorAPI } from "./aiDoctor.js";
import { createSurgeonAPI } from "./aiSurgeon.js";
import { createLawyerAPI } from "./aiLawyer.js";
import { createEntrepreneurAPI } from "./aiEntrepreneur.js";
import { createVeterinarianAPI } from "./aiVeterinarian.js";
import { createClinicianAPI } from "./aiClinician.js";
import { createEvolutionaryAPI } from "./aiEvolutionary.js";

// ============================================================================
//  ORGAN ASSEMBLY — v11.2‑EVO+ (Dual‑Band Brainstem)
// ============================================================================
export function createOrgans(context, db, fsAPI, routeAPI, schemaAPI) {

  // ------------------------------------------------------------------------
  // 0) BACKEND CHUNKER — PRE-CHUNK BEFORE ORGAN CREATION
  // ------------------------------------------------------------------------
  const chunker = createPulseChunker({
    context,
    db,
    fsAPI,
    routeAPI,
    schemaAPI
  });

  // ------------------------------------------------------------------------
  // 1) CNS ENGINES (identity, persona, boundaries, permissions)
  // ------------------------------------------------------------------------
  const personaEngine = createPersonaEngine({ context, db });
  const boundariesEngine = createBoundariesEngine({ context, db });
  const permissionsEngine = createPermissionsEngine({ context, db });

  // ------------------------------------------------------------------------
  // 2) ROUTER + CORTEX (symbolic CNS)
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
  // 3) DUAL‑BAND ORGANISM (symbolic ↔ binary)
  // ------------------------------------------------------------------------
  const dualBand = createDualBandOrganism({
    trace: context.trace,
    db,
    fsAPI,
    routeAPI,
    schemaAPI
  });

  // wire chunker into dual-band / router if supported
  if (dualBand && typeof dualBand.registerBackendOrgan === "function") {
    dualBand.registerBackendOrgan("chunker", chunker);
  }

  if (router && typeof router.registerBackendOrgan === "function") {
    router.registerBackendOrgan("chunker", chunker);
  }

  // ------------------------------------------------------------------------
  // 4) REAL ORGANS (symbolic service organs)
  // ------------------------------------------------------------------------
  const doctor = createDoctorAPI({ context, db });
  const surgeon = createSurgeonAPI({ context, db });
  const lawyer = createLawyerAPI({ context, db });
  const entrepreneur = createEntrepreneurAPI({ context, db });
  const veterinarian = createVeterinarianAPI({ context, db });
  const clinician = createClinicianAPI({ context, db });
  const evolutionary = createEvolutionaryAPI({ context, db });

  // ------------------------------------------------------------------------
  // 5) CORE ORGANS (v10.4 → v11.2‑EVO+)
  // ------------------------------------------------------------------------
  const architect = createArchitectAPI({ context, db });
  const tourist = createTouristAPI({ context, db });
  const environment = createEnvironmentAPI({ context, db, fsAPI, routeAPI });
  const power = createPowerAPI({ context, db });
  const evolution = createEvolutionAPI({ context, fsAPI, routeAPI, schemaAPI });
  const earn = createEarnAPI({ context, db });
  const diagnosticsWrite = createDiagnosticsWriteAPI({ context, db });

  // evolution / diagnostics awareness of chunker if surfaces exist
  if (evolution && typeof evolution.registerOrgan === "function") {
    evolution.registerOrgan("chunker", chunker);
  }

  if (diagnosticsWrite && typeof diagnosticsWrite.register === "function") {
    diagnosticsWrite.register("chunker", chunker);
  }

  // ------------------------------------------------------------------------
  // 6) RETURN FULL ORGANISM MAP (dual‑band unified)
  // ------------------------------------------------------------------------
  return Object.freeze({
    // CNS
    personaEngine,
    boundariesEngine,
    permissionsEngine,
    router,
    cortex,

    // Dual‑Band Organism
    dualBand,

    // Backend infrastructure organ (pre-chunked)
    chunker,

    // Service organs
    doctor,
    surgeon,
    lawyer,
    entrepreneur,
    veterinarian,
    clinician,
    evolutionary,

    // Core
    architect,
    tourist,
    environment,
    power,
    evolution,
    earn,
    diagnosticsWrite
  });
}

// ---------------------------------------------------------------------------
//  DUAL EXPORT LAYER — CommonJS compatibility (v11.2‑EVO+ dualband)
// ---------------------------------------------------------------------------
/* c8 ignore next 10 */
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    BrainstemMeta,
    createOrgans
  };
}
