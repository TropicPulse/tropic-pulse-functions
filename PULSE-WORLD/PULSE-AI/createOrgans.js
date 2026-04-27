// ============================================================================
//  PULSE OS v11‑EVO — BRAINSTEM
//  Organ Assembly • Dual‑Band Context Binding • CNS Integration
//  PURE ORGANISM. ZERO MUTATION. ZERO RANDOMNESS.
// ============================================================================

import { createArchitectAPI } from "./aiArchitect.js";
import { createTouristAPI } from "./aiTourist.js";
import { createEnvironmentAPI } from "./aiEnvironment.js";
import { createPowerAPI } from "./aiPower.js";
import { createEvolutionAPI } from "./aiEvolution.js";
import { createEarnAPI } from "./aiEarn.js";
import { createDiagnosticsWriteAPI } from "./aiDiagnosticsWrite.js";

// v11‑EVO CNS engines
import { createPersonaEngine } from "./persona.js";
import { createBoundariesEngine } from "./boundaries.js";
import { createPermissionsEngine } from "./permissions.js";
import { createRouterEngine } from "./aiRouter-v11-Evo.js";
import { createCortex } from "./aiCortex-v11-Evo.js";

// NEW: Dual‑Band organism (symbolic ↔ binary)
import { createDualBandOrganism } from "./aiDualBand-v11-Evo.js";

// Non‑binary organs
import { createDoctorAPI } from "./aiDoctor.js";
import { createSurgeonAPI } from "./aiSurgeon.js";
import { createLawyerAPI } from "./aiLawyer.js";
import { createEntrepreneurAPI } from "./aiEntrepreneur.js";
import { createVeterinarianAPI } from "./aiVeterinarian.js";
import { createClinicianAPI } from "./aiClinician.js";
import { createEvolutionaryAPI } from "./aiEvolutionary.js";

// ============================================================================
//  ORGAN ASSEMBLY — v11‑EVO (Dual‑Band Brainstem)
// ============================================================================
export function createOrgans(context, db, fsAPI, routeAPI, schemaAPI) {

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
  // 5) CORE ORGANS (v10.4 → v11‑EVO)
  // ------------------------------------------------------------------------
  const architect = createArchitectAPI({ context, db });
  const tourist = createTouristAPI({ context, db });
  const environment = createEnvironmentAPI({ context, db, fsAPI, routeAPI });
  const power = createPowerAPI({ context, db });
  const evolution = createEvolutionAPI({ context, fsAPI, routeAPI, schemaAPI });
  const earn = createEarnAPI({ context, db });
  const diagnosticsWrite = createDiagnosticsWriteAPI({ context, db });

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

    // Dual‑Band Organism (symbolic + binary)
    dualBand,

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
