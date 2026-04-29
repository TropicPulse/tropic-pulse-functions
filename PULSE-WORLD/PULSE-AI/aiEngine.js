// ============================================================================
//  aiExecutionEngine.js — Pulse OS v12.3‑Presence
//  Dual‑Band Execution • Persona Routing • Organ Dispatch • Packet‑Ready
//  PURE EXECUTION. ZERO MUTATION. ZERO RANDOMNESS.
// ============================================================================

export const ExecutionEngineMeta = Object.freeze({
  layer: "PulseAIExecutionKernel",
  role: "EXECUTION_ENGINE",
  version: "12.3-Presence",
  identity: "aiExecutionEngine-v12.3-Presence",

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

    packetAware: true,
    windowAware: true,
    evolutionAware: true,
    presenceAware: true,
    chunkingAware: true,
    gpuFriendly: true,

    multiInstanceReady: true,
    epoch: "12.3-Presence"
  }),

  contract: Object.freeze({
    purpose:
      "Execute AI operations through persona routing, boundaries, and dual-band context.",
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
      "return unified response packet",
      "emit deterministic execution packets"
    ])
  }),

  presence: Object.freeze({
    organId: "ExecutionEngine",
    organKind: "Kernel",
    physiologyBand: "DualBand",
    warmStrategy: "prewarm-on-boot",
    attachStrategy: "per-request",
    concurrency: "multi-instance",
    observability: {
      traceEvents: [
        "prewarm",
        "prewarm-error",
        "start",
        "permission-denied",
        "mode-selected",
        "complete",
        "error"
      ]
    }
  })
});

import { createCognitiveFrame as createAIContext } from "./aiContext.js";
import { createBrainstem } from "./aiBrainstem.js";
import { resolvePersonaV12 as resolvePersonaV11 } from "./persona.js";
import { routeAIRequest } from "./aiRouter-v11-Evo.js";
import { canPerformDynamic } from "./boundaries.js";

import { createArchitectOrgan as runArchitectMode } from "./aiArchitect.js";
import { createClinicianOrgan as runObserverMode } from "./aiClinician.js";
import { createTouristAPI as runTourGuideMode } from "./aiTourist.js";

// ============================================================================
//  PACKET EMITTER — deterministic, execution-scoped
// ============================================================================
function emitExecutionPacket(type, payload = {}) {
  return Object.freeze({
    meta: ExecutionEngineMeta,
    packetType: `execution-${type}`,
    timestamp: Date.now(),
    epoch: ExecutionEngineMeta.evo.epoch,
    layer: ExecutionEngineMeta.layer,
    role: ExecutionEngineMeta.role,
    identity: ExecutionEngineMeta.identity,
    ...payload
  });
}

// ============================================================================
//  PREWARM — warms routing + persona + boundaries (Presence‑grade)
// ============================================================================
export function prewarmExecutionEngine({ trace = false } = {}) {
  try {
    const sampleRequest = { domain: "system", action: "read" };

    const packet = emitExecutionPacket("prewarm", {
      message: "Execution engine prewarmed and routing pathways aligned.",
      sampleRequest
    });

    if (trace) console.log("[ExecutionEngine] prewarm", packet);
    return packet;
  } catch (err) {
    return emitExecutionPacket("prewarm-error", {
      error: String(err),
      message: "Execution engine prewarm failed."
    });
  }
}

// ============================================================================
//  MAIN EXECUTION ENTRY — v12.3‑Presence
// ============================================================================
export async function runAI(request = {}, operation, deps = {}, dualBand = null) {
  const { db, fsAPI, routeAPI, schemaAPI } = deps || {};

  // 1) Build Cognitive Frame
  const context = createAIContext(request);
  context.logStep?.("AI context initialized.");

  const startPacket = emitExecutionPacket("start", {
    requestSummary: {
      domain: request.domain || "system",
      action: request.action || "read"
    }
  });

  // 2) Build Brainstem
  const brainstem = createBrainstem(request, db, fsAPI, routeAPI, schemaAPI);
  Object.assign(context, brainstem.context);
  context.organs = brainstem.organs;
  context.brainstemPacket = brainstem.packet;

  // 3) Dual‑Band Routing
  const routing = routeAIRequest(request, dualBand);
  context.routing = routing;

  const binaryVitals = {
    metabolic: {
      pressure: routing.dualBand?.binaryPressure ?? 0,
      load: routing.dualBand?.binaryLoad ?? 0
    }
  };

  const persona = resolvePersonaV11({
    personaId: routing.personaId,
    userId: context.userId,
    evoState: context.evoState || {},
    routerHints: routing.dualBand,
    binaryVitals
  });

  context.persona = persona;
  context.personaId = persona.id;

  // 4) Boundary Mode + Permissions
  const boundaryMode = persona.boundaryMode;
  context.boundaryMode = boundaryMode;

  const permCheck = canPerformDynamic(
    persona.id,
    request.domain || "system",
    request.action || "read",
    boundaryMode,
    binaryVitals
  );

  context.permissions = permCheck;

  if (!permCheck.allowed) {
    context.logStep?.("Permission denied by dual‑band boundaries.");
    const packet = emitExecutionPacket("permission-denied", {
      personaId: persona.id,
      domain: request.domain || "system",
      action: request.action || "read",
      boundaryMode,
      binaryVitals
    });
    return buildAIResponse(null, context, packet, startPacket, null);
  }

  // 5) Persona Execution Pathway
  let result = null;
  let modePacket = emitExecutionPacket("mode-selected", {
    personaId: persona.id,
    boundaryMode,
    binaryVitals
  });

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

    const completePacket = emitExecutionPacket("complete", {
      personaId: persona.id,
      boundaryMode,
      binaryVitals
    });

    return buildAIResponse(
      result,
      context,
      completePacket,
      startPacket,
      modePacket
    );
  } catch (err) {
    context.flagSlowdown?.("Operation threw an exception.");
    context.logStep?.(`Error: ${err.message}`);

    const errorPacket = emitExecutionPacket("error", {
      personaId: persona.id,
      boundaryMode,
      binaryVitals,
      error: String(err)
    });

    return buildAIResponse(
      null,
      context,
      errorPacket,
      startPacket,
      modePacket
    );
  }
}

// ============================================================================
//  RESPONSE BUILDER — v12.3‑Presence
// ============================================================================
function buildAIResponse(result, context, packet, startPacket, modePacket) {
  return Object.freeze({
    result,
    context,
    persona: context.persona,
    routing: context.routing,
    boundaryMode: context.boundaryMode,
    permissions: context.permissions,
    organs: context.organs,
    packets: {
      start: startPacket || null,
      mode: modePacket || null,
      final: packet || null
    }
  });
}

// ============================================================================
//  DUAL‑MODE EXPORTS (ESM + CommonJS)
// ============================================================================
export default runAI;

if (typeof module !== "undefined") {
  module.exports = {
    ExecutionEngineMeta,
    runAI,
    default: runAI,
    prewarmExecutionEngine
  };
}
