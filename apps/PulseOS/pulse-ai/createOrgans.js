// ============================================================================
// FILE: tropic-pulse-functions/apps/PULSE-AI/createOrgans.js
// LAYER: BRAINSTEM (Organ Assembly + Context Binding)
// ============================================================================
//
// ROLE:
//   • Assemble all AI organs into a unified organism.
//   • Bind organs to context (persona, user, owner).
//   • Provide deterministic, read‑only access to system data.
//   • Enforce identity safety + owner gating at the organ level.
//
// CONTRACT:
//   • READ‑ONLY — except for the diagnosticsWrite organ.
//   • NO eval(), NO Function(), NO dynamic imports.
//   • Deterministic organ assembly only.
// ============================================================================

import { createArchitectAPI } from "./aiArchitect.js";
import { createTouristAPI } from "./aiTourist.js";
import { createEnvironmentAPI } from "./aiEnvironment.js";
import { createPowerAPI } from "./aiPower.js";
import { createEvolutionAPI } from "./aiEvolution.js";
import { createEarnAPI } from "./aiEarn.js";
import { createDiagnosticsWriteAPI } from "./aiDiagnosticsWrite.js";

// --------------------------------------------------------------------------
// ORGAN ASSEMBLY
// --------------------------------------------------------------------------
export function createOrgans(context, db, fsAPI, routeAPI, schemaAPI) {
  return {
    // High‑level architectural reasoning
    architect: createArchitectAPI({
      context,
      db
    }),

    // Persona‑driven conversational organ
    tourist: createTouristAPI({
      context,
      db
    }),

    // Environment sensing (read‑only)
    environment: createEnvironmentAPI({
      context,
      db,
      fsAPI,
      routeAPI
    }),

    // Power / capability awareness (read‑only)
    power: createPowerAPI({
      context,
      db
    }),

    // Evolution / drift detection (read‑only)
    evolution: createEvolutionAPI({
      context,
      fsAPI,
      routeAPI,
      schemaAPI
    }),

    // Earn / economics organ (read‑only)
    earn: createEarnAPI({
      context,
      db
    }),

    // ----------------------------------------------------------------------
    // NEW: AI LOGGING ORGAN (writes to AI_LOGS)
    // ----------------------------------------------------------------------
    diagnosticsWrite: createDiagnosticsWriteAPI({
      context,
      db
    })
  };
}
