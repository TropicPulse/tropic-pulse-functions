// ============================================================================
//  PULSE OS v11‑EVO — AI EXECUTION ENGINE
//  Dual‑Band Execution • Persona Routing • Organ Dispatch
//  PURE EXECUTION. ZERO MUTATION. ZERO RANDOMNESS.
// ============================================================================

export const ExecutionEngineMeta = Object.freeze({
  layer: "PulseAIExecutionKernel",
  role: "EXECUTION_ENGINE",
  version: "11.1-EVO", // aligned with Router/Cortex/Safety/Experience
  identity: "aiExecutionEngine-v11-EVO",

  evo: Object.freeze({
    driftProof: true,
    deterministic: true,
    dualband: true,
    personaAware: true,
    boundaryAware: true,
    permissionAware: true,
    routingAware: true,
    symbolicAware: true,
    binaryAware: true,
    multiInstanceReady: true,
    epoch: "11.1-EVO"
  }),

  contract: Object.freeze({
    purpose: "Execute AI operations through persona routing, boundaries, and dual-band context.",
    never: Object.freeze([
      "mutate context",
      "mutate organs",
      "bypass boundaries",
      "bypass permissions",
      "introduce randomness",
      "alter persona logic"
    ]),
    always: Object.freeze([
      "build deterministic cognitive frame",
      "attach brainstem organs",
      "resolve persona safely",
      "enforce boundaries",
      "enforce permissions",
      "route execution through correct mode",
      "return unified response packet"
    ])
  })
});

import { createAIContext } from "./aiContext.js";
import { createBrainstem } from "./aiBrainstem.js";
import { resolvePersonaV11 } from "./persona.js";
import { routeAIRequest } from "./aiRouter-v11-Evo.js";
import { canPerformDynamic } from "./boundaries.js"; // selectBoundaryMode no longer needed

// Organ modes
import { runArchitectMode } from "./modes/architect.js";
import { runObserverMode } from "./modes/observer.js";
import { runTourGuideMode } from "./modes/tourguide.js";


// ============================================================================
//  MAIN EXECUTION ENTRY — v11‑EVO
// ============================================================================
export async function runAI(request = {}, operation, deps = {}, dualBand = null) {
  const { db, fsAPI, routeAPI, schemaAPI } = deps;

  // --------------------------------------------------------------------------
  // 1) Build Cognitive Frame (identity + request normalization)
  // --------------------------------------------------------------------------
  const context = createAIContext(request);
  context.logStep?.("AI context initialized.");

  // --------------------------------------------------------------------------
  // 2) Build Brainstem (organs + persona + boundaries + permissions)
  // --------------------------------------------------------------------------
  const brainstem = createBrainstem(request, db, fsAPI, routeAPI, schemaAPI);
  Object.assign(context, brainstem.context);
  context.organs = brainstem.organs;

  // --------------------------------------------------------------------------
  // 3) Dual‑Band Routing (persona + archetypes + binary vitals)
  // --------------------------------------------------------------------------
  const routing = routeAIRequest(request, dualBand);
  context.routing = routing;

  // Derive binary vitals from routing dual‑band hints (single source of truth)
  const binaryVitals = {
    metabolic: {
      pressure: routing.dualBand?.binaryPressure ?? 0,
      load: routing.dualBand?.binaryLoad ?? 0
    }
  };

  // Persona resolution (dual‑band)
  const persona = resolvePersonaV11({
    personaId: routing.personaId,
    userId: context.userId,
    evoState: context.evoState || {},
    routerHints: routing.dualBand,
    binaryVitals
  });

  context.persona = persona;
  context.personaId = persona.id;

  // --------------------------------------------------------------------------
  // 4) Boundary Mode (dual‑band)
  // --------------------------------------------------------------------------
  const boundaryMode = persona.boundaryMode;
  context.boundaryMode = boundaryMode;

  // Permission check (dual‑band)
  const permCheck = canPerformDynamic(
    persona.id,
    request.domain || "system",
    request.action || "read",
    boundaryMode,
    binaryVitals
  );

  if (!permCheck.allowed) {
    context.logStep?.("Permission denied by dual‑band boundaries.");
    return buildAIResponse(null, context);
  }

  // --------------------------------------------------------------------------
  // 5) Persona Execution Pathway
  // --------------------------------------------------------------------------
  let result = null;

  try {
    context.logStep?.("Executing AI operation...");

    switch (persona.id) {
      case "architect":
        result = await runArchitectMode(request, context, operation);
        break;

      case "observer":
        result = await runObserverMode(request, context, operation);
        break;

      case "tourguide":
        result = await runTourGuideMode(request, context, operation);
        break;

      default:
        result = await operation(context);
        break;
    }

    context.logStep?.("AI operation completed successfully.");

  } catch (err) {
    context.flagSlowdown?.("Operation threw an exception.");
    context.logStep?.(`Error: ${err.message}`);
    result = null;
  }

  // --------------------------------------------------------------------------
  // 6) Build Unified Response Packet (v11‑EVO)
  // --------------------------------------------------------------------------
  return buildAIResponse(result, context);
}

// ============================================================================
//  RESPONSE BUILDER — v11‑EVO
// ============================================================================
function buildAIResponse(result, context) {
  return Object.freeze({
    result,
    context,
    persona: context.persona,
    routing: context.routing,
    boundaryMode: context.boundaryMode,
    permissions: context.permissions,
    organs: context.organs
  });
}

// ============================================================================
//  DUAL‑MODE EXPORTS (ESM + CommonJS)
// ============================================================================

// ESM named exports already above
export default runAI;

if (typeof module !== "undefined") {
  module.exports = {
    ExecutionEngineMeta,
    runAI,
    default: runAI
  };
}
