// ============================================================================
//  PULSE OS v14‑IMMORTAL — CONTEXT ENGINE
//  Context Fusion • Routing Frame • Safety + Persona + Memory Snapshot
//  PURE CONTEXT. ZERO MUTATION. ZERO RANDOMNESS.
// ============================================================================
//
//  v14‑IMMORTAL Upgrades:
//   • Presence‑aware (windowId + routeId + dnaTag)
//   • Dualband‑safe symbolic+binary fusion
//   • MemorySpine + GPU + Boundaries‑aware (read‑only vitals)
//   • Brainstem v14‑IMMORTAL compatible
//   • Deterministic ContextFrame + ContextPacket emission
//   • Multi‑instance, per‑request attach
// ============================================================================
/*
AI_EXPERIENCE_META = {
  identity: "aiContextEngine",
  version: "v14-IMMORTAL",
  layer: "ai_core",
  role: "context_engine",
  lineage: "aiContextEngine-v10 → v12 → v12.3-Presence → v14-IMMORTAL",

  evo: {
    contextEngine: true,
    hydration: true,
    dehydration: true,
    dualBand: true,
    symbolicPrimary: true,
    binaryAware: true,
    deterministic: true,
    driftProof: true,
    pureCompute: true,
    zeroNetwork: true,
    zeroFilesystem: true,
    zeroMutationOfInput: true
  },

  contract: {
    always: ["aiContext", "aiCortex", "aiBrainstem"],
    never: ["safeRoute", "fetchViaCNS"]
  }
}
*/

export const ContextEngineMeta = Object.freeze({
  layer: "PulseAIContextEngine",
  role: "CONTEXT_ENGINE_ORGAN",
  version: "14-IMMORTAL",
  identity: "aiContextEngine-v14-IMMORTAL",

  evo: Object.freeze({
    driftProof: true,
    deterministic: true,
    dualBandSafe: true,

    routerAware: true,
    personaAware: true,
    safetyAware: true,
    personalAware: true,
    overmindAware: true,
    organismAware: true,
    memorySpineAware: true,
    gpuAware: true,
    boundariesAware: true,

    packetAware: true,
    presenceAware: true,
    chunkingAware: true,
    gpuFriendly: true,

    multiInstanceReady: true,
    readOnly: true,
    epoch: "14-IMMORTAL"
  }),

  contract: Object.freeze({
    purpose: [
      "Fuse Brainstem context, Router packet, Persona state, SafetyFrame, and Memory/GPU vitals into a unified ContextFrame",
      "Expose a deterministic context surface for Overmind and Cortex",
      "Keep identity, permissions, and boundaries read-only and explicit"
    ],

    never: Object.freeze([
      "mutate Brainstem context",
      "mutate Router packet",
      "mutate persona definitions",
      "override SafetyFrame decisions",
      "override BoundariesEngine decisions",
      "introduce randomness",
      "perform cognition or intent handling"
    ]),

    always: Object.freeze([
      "remain deterministic for same inputs",
      "respect persona, boundaries, and permissions contracts",
      "surface dual-band vitals as read-only hints",
      "surface memory + gpu vitals as read-only hints",
      "emit deterministic context-engine packets",
      "return frozen context frames"
    ])
  }),

  presence: Object.freeze({
    organId: "ContextEngine",
    organKind: "Fusion",
    physiologyBand: "Symbolic+Binary",
    warmStrategy: "prewarm-on-attach",
    attachStrategy: "per-request",
    concurrency: "multi-instance",
    observability: {
      traceEvents: [
        "prewarm",
        "prewarm-error",
        "context:frame",
        "context:packet"
      ]
    }
  })
});

// ============================================================================
//  PACKET EMITTER — deterministic, context-engine scoped
// ============================================================================
function emitContextEnginePacket(type, payload) {
  return Object.freeze({
    meta: ContextEngineMeta,
    packetType: `context-engine-${type}`,
    timestamp: Date.now(),
    epoch: ContextEngineMeta.evo.epoch,
    layer: ContextEngineMeta.layer,
    role: ContextEngineMeta.role,
    identity: ContextEngineMeta.identity,
    ...payload
  });
}

// ============================================================================
//  INTERNAL VITALS HELPERS (read-only)
// ============================================================================
function readMemoryVitals(memory) {
  if (!memory) return null;
  try {
    const hot = typeof memory.getHotKeys === "function"
      ? memory.getHotKeys(3)
      : [];
    const meta = memory.Meta || {};
    return Object.freeze({
      hotKeyCount: hot.length || 0,
      lastFlushEpoch: meta.lastFlushEpoch || 0,
      lastLoadEpoch: meta.lastLoadEpoch || 0,
      fallbackUsed: !!meta.fallbackUsed,
      lastBandUsed: meta.lastBandUsed || null,
      version: meta.version || null,
      dnaTag: meta.dnaTag || null
    });
  } catch {
    return null;
  }
}

function readGpuVitals(gpu) {
  if (!gpu) return null;
  try {
    const meta = gpu.GPUOrchestratorMeta || gpu.meta || {};
    return Object.freeze({
      identity: meta.identity || null,
      version: meta.version || null
    });
  } catch {
    return null;
  }
}

function readBoundariesVitals(boundariesPacket) {
  if (!boundariesPacket) return null;
  return Object.freeze({
    packetType: boundariesPacket.packetType || null,
    personaId: boundariesPacket.personaId || null,
    mode: boundariesPacket.mode || null,
    driftDetected: !!boundariesPacket.driftDetected,
    driftCount: boundariesPacket.driftCount || 0
  });
}

// ============================================================================
//  CONTEXT ENGINE PREWARM — v14‑IMMORTAL
// ============================================================================
export function prewarmContextEngine(config = {}) {
  try {
    const { safetyFrame, experienceFrame } = config;

    const warm = new AiContextEngine({ safetyFrame, experienceFrame });

    const warmBrainstem = {
      context: {
        userId: "prewarm",
        userIsOwner: false,
        windowId: "win-prewarm",
        routeId: "context-prewarm",
        dnaTag: "prewarm-dna"
      },
      organs: { encoder: {}, memory: {} },
      packet: { packetType: "brainstem-prewarm" }
    };

    const warmRequest = {
      intent: "prewarm",
      safetyMode: "standard"
    };

    const warmRouter = {
      personaId: "ARCHITECT",
      personaSafety: { safetyMode: "standard" },
      flags: { stable: true },
      reasoning: ["prewarm"],
      dualBand: {
        primary: "binary",
        secondary: "symbolic",
        binaryPressure: 0,
        binaryLoad: 0,
        symbolicLoadAllowed: 0.3
      },
      overmind: {
        intent: "prewarm",
        personaId: "ARCHITECT",
        safetyMode: "standard",
        flags: { stable: true }
      }
    };

    const warmPersona = {
      id: "ARCHITECT",
      label: "Architect",
      scope: "system",
      permissions: { allow: true },
      boundaries: { mode: "safe" },
      boundaryMode: "safe",
      bandBias: "balanced"
    };

    const warmBinaryVitals = {
      throughput: 1,
      pressure: 0,
      cost: 0,
      budget: 1
    };

    const warmDualBand = {
      organism: {
        organismSnapshot: () => ({ snapshot: "prewarm" })
      },
      memory: null,
      gpu: null
    };

    warm.buildContextFrame({
      brainstem: warmBrainstem,
      request: warmRequest,
      routerPacket: warmRouter,
      persona: warmPersona,
      binaryVitals: warmBinaryVitals,
      dualBand: warmDualBand,
      boundariesPacket: null
    });

    return emitContextEnginePacket("prewarm", {
      message: "Context Engine prewarmed and fusion pathways aligned."
    });
  } catch (err) {
    return emitContextEnginePacket("prewarm-error", {
      error: String(err),
      message: "Context Engine prewarm failed."
    });
  }
}

// ============================================================================
//  CORE IMPLEMENTATION — v14‑IMMORTAL
// ============================================================================
export class AiContextEngine {
  constructor({ safetyFrame = null, experienceFrame = null } = {}) {
    this.safetyFrame = safetyFrame;
    this.experienceFrame = experienceFrame;
  }

  buildContextFrame({
    brainstem = {},
    request = {},
    routerPacket = {},
    persona = {},
    binaryVitals = {},
    dualBand = null,
    boundariesPacket = null
  } = {}) {
    const baseContext = brainstem.context || {};
    const organs = brainstem.organs || {};

    const safetyMode =
      request.safetyMode ||
      routerPacket.personaSafety?.safetyMode ||
      "standard";

    const dualBandHints = routerPacket.dualBand || {
      primary: "binary",
      secondary: "symbolic",
      binaryPressure: 0,
      binaryLoad: 0,
      symbolicLoadAllowed: 0.3,
      binaryPressureOverride: false
    };

    const overmindHints = routerPacket.overmind || {
      intent: (request.intent || "analyze").toLowerCase(),
      personaId: routerPacket.personaId || persona.id || "neutral",
      safetyMode,
      flags: routerPacket.flags || {},
      archetypePrimaryPage: routerPacket.archetypes?.primaryPage || null
    };

    const memory = dualBand?.memory || baseContext.memory || null;
    const gpu = dualBand?.gpu || baseContext.gpu || null;

    const frame = Object.freeze({
      meta: ContextEngineMeta,

      user: Object.freeze({
        userId: baseContext.userId || null,
        userIsOwner: !!baseContext.userIsOwner,
        windowId: baseContext.windowId || null,
        routeId: baseContext.routeId || null,
        dnaTag: baseContext.dnaTag || null
      }),

      persona: Object.freeze({
        id: persona.id || routerPacket.personaId || "neutral",
        label: persona.label || null,
        scope: persona.scope || null,
        permissions: persona.permissions || {},
        boundaries: persona.boundaries || {},
        boundaryMode: persona.boundaryMode || null,
        bandBias: persona.bandBias || "balanced"
      }),

      routing: Object.freeze({
        intent: overmindHints.intent,
        flags: routerPacket.flags || {},
        archetypes: routerPacket.archetypes || {},
        reasoning: routerPacket.reasoning || []
      }),

      safety: Object.freeze({
        mode: safetyMode,
        personaSafety: routerPacket.personaSafety || {},
        safetyFrameMeta: this.safetyFrame?.meta || null
      }),

      boundaries: Object.freeze({
        packet: boundariesPacket || null,
        vitals: readBoundariesVitals(boundariesPacket)
      }),

      dualBand: Object.freeze({
        hints: dualBandHints,
        binaryVitals: binaryVitals || {},
        organismSnapshot:
          dualBand?.organism?.organismSnapshot?.() || null
      }),

      memory: Object.freeze({
        vitals: readMemoryVitals(memory)
      }),

      gpu: Object.freeze({
        vitals: readGpuVitals(gpu)
      }),

      organs: Object.freeze({
        ...organs
      }),

      brainstemPacket: brainstem.packet || null
    });

    return emitContextEnginePacket("context:frame", frame);
  }
}

// ============================================================================
//  PUBLIC API — v14‑IMMORTAL
// ============================================================================
export function createContextEngine(config = {}) {
  prewarmContextEngine(config);

  const core = new AiContextEngine({
    safetyFrame: config.safetyFrame || null,
    experienceFrame: config.experienceFrame || null
  });

  return Object.freeze({
    meta: ContextEngineMeta,
    buildContextFrame(payload) {
      const frame = core.buildContextFrame(payload);
      return emitContextEnginePacket("context:packet", frame);
    }
  });
}

export default createContextEngine;

// ============================================================================
//  COMMONJS FALLBACK EXPORTS
// ============================================================================
if (typeof module !== "undefined") {
  module.exports = {
    ContextEngineMeta,
    AiContextEngine,
    createContextEngine,
    default: createContextEngine,
    prewarmContextEngine
  };
}
