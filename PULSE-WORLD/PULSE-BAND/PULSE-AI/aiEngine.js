// ============================================================================
//  aiExecutionEngine.js — Pulse OS v14‑IMMORTAL
//  Dual‑Band Execution • Persona Routing • Organ Dispatch • Context Fusion
//  PURE EXECUTION. ZERO MUTATION. ZERO RANDOMNESS.
// ============================================================================
/*
AI_EXPERIENCE_META = {
  identity: "aiEngine",
  version: "v14-IMMORTAL",
  layer: "ai_core",
  role: "ai_execution_engine",
  lineage: "aiEngine-v9 → v11 → v12.3-Presence → v14-IMMORTAL",

  evo: {
    executionEngine: true,
    organRouting: true,
    dualBand: true,
    symbolicPrimary: true,
    binaryAware: true,
    contextAware: true,
    arteryAware: true,
    emotionAware: true,
    deliveryAware: true,

    deterministic: true,
    driftProof: true,
    pureCompute: true,
    zeroNetwork: true,
    zeroFilesystem: true,
    zeroMutationOfInput: true
  },

  contract: {
    always: ["aiBrainstem", "aiCortex", "aiContextEngine", "aiDualBand"],
    never: ["safeRoute", "fetchViaCNS"]
  }
}
*/

export const ExecutionEngineMeta = Object.freeze({
  layer: "PulseAIExecutionKernel",
  role: "EXECUTION_ENGINE",
  version: "14-IMMORTAL",
  identity: "aiExecutionEngine-v14-IMMORTAL",

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
    contextAware: true,
    arteryAware: true,
    emotionAware: true,
    deliveryAware: true,

    packetAware: true,
    windowAware: true,
    evolutionAware: true,
    presenceAware: true,
    chunkingAware: true,
    gpuFriendly: true,

    multiInstanceReady: true,
    epoch: "14-IMMORTAL"
  }),

  contract: Object.freeze({
    purpose:
      "Execute AI operations through persona routing, boundaries, dual-band context, and artery-aware vitals.",
    never: Object.freeze([
      "mutate context",
      "mutate organs",
      "bypass boundaries",
      "bypass permissions",
      "introduce randomness",
      "alter persona logic",
      "override dual-band safety",
      "ignore artery pressure"
    ]),
    always: Object.freeze([
      "build deterministic cognitive frame",
      "attach brainstem organs",
      "resolve persona safely",
      "enforce boundaries",
      "enforce permissions",
      "respect dual-band artery vitals",
      "route execution through correct mode",
      "emit context + execution packets deterministically",
      "return unified response packet"
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
        "context-frame",
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
//  PREWARM — warms routing + persona + boundaries + artery (IMMORTAL‑grade)
// ============================================================================
export function prewarmExecutionEngine({ trace = false } = {}) {
  try {
    const sampleRequest = { domain: "system", action: "read", intent: "prewarm" };

    const packet = emitExecutionPacket("prewarm", {
      message: "Execution engine prewarmed and routing + persona pathways aligned.",
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
//  MAIN EXECUTION ENTRY — v14‑IMMORTAL (Dual‑Band + Context‑Fusion)
// ============================================================================
export async function runAI(request = {}, operation, deps = {}, dualBand = null) {
  const { db, fsAPI, routeAPI, schemaAPI } = deps || {};

  // 1) Build initial Cognitive Frame (symbolic baseline)
  const context = createAIContext(request);
  context.logStep?.("AI context initialized.");

  const startPacket = emitExecutionPacket("start", {
    requestSummary: {
      domain: request.domain || "system",
      action: request.action || "read",
      intent: request.intent || "analyze"
    }
  });

  // 2) Build Brainstem
  const brainstem = createBrainstem(request, db, fsAPI, routeAPI, schemaAPI);
  Object.assign(context, brainstem.context);
  context.organs = brainstem.organs;
  context.brainstemPacket = brainstem.packet;

  // 3) Dual‑Band Routing (symbolic router + dualBand hints)
  const routing = routeAIRequest(request, dualBand);
  context.routing = routing;

  const binaryVitals = {
    metabolic: {
      pressure: routing.dualBand?.binaryPressure ?? 0,
      load: routing.dualBand?.binaryLoad ?? 0
    },
    artery: dualBand?.artery?.organism || null
  };

  // 4) Persona Resolution (dual‑band aware)
  const persona = resolvePersonaV11({
    personaId: routing.personaId,
    userId: context.userId,
    evoState: context.evoState || {},
    routerHints: routing.dualBand,
    binaryVitals
  });

  context.persona = persona;
  context.personaId = persona.id;

  // 5) Boundary Mode + Permissions (dual‑band aware)
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

  // 6) Dual‑Band Context Fusion (if dualBand surface is available)
  let contextFramePacket = null;
  if (dualBand && dualBand.symbolic && dualBand.symbolic.contextEngine) {
    const contextEngine = dualBand.symbolic.contextEngine;
    const dualBandPayload = {
      brainstem: {
        context: { userId: context.userId, userIsOwner: context.userIsOwner },
        organs: context.organs
      },
      request,
      routerPacket: routing,
      persona,
      binaryVitals: {
        throughput: routing.dualBand?.binaryThroughput ?? 1,
        pressure: binaryVitals.metabolic.pressure ?? 0,
        load: binaryVitals.metabolic.load ?? 0
      },
      dualBand
    };

    contextFramePacket = contextEngine.buildContextFrame(dualBandPayload);
    context.contextFrame = contextFramePacket;
  }

  const modePacket = emitExecutionPacket("mode-selected", {
    personaId: persona.id,
    boundaryMode,
    binaryVitals
  });

  // 7) Persona Execution Pathway (architect / observer / tourguide / default)
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

    const completePacket = emitExecutionPacket("complete", {
      personaId: persona.id,
      boundaryMode,
      binaryVitals,
      artery: binaryVitals.artery || null
    });

    return buildAIResponse(
      result,
      context,
      completePacket,
      startPacket,
      modePacket,
      contextFramePacket
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
      modePacket,
      contextFramePacket
    );
  }
}

// ============================================================================
//  RESPONSE BUILDER — v14‑IMMORTAL (Dual‑Band + Context Frame)
// ============================================================================
function buildAIResponse(
  result,
  context,
  packet,
  startPacket,
  modePacket,
  contextFramePacket
) {
  return Object.freeze({
    result,
    context,
    persona: context.persona,
    routing: context.routing,
    boundaryMode: context.boundaryMode,
    permissions: context.permissions,
    organs: context.organs,
    contextFrame: context.contextFrame || null,
    packets: {
      start: startPacket || null,
      mode: modePacket || null,
      contextFrame: contextFramePacket || null,
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
