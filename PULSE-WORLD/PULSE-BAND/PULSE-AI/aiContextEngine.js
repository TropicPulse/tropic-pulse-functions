// ============================================================================
//  PULSE OS v12.3‑Presence — CONTEXT ENGINE
//  Context Fusion • Routing Frame • Safety + Persona Snapshot
//  PURE CONTEXT. ZERO MUTATION. ZERO RANDOMNESS.
// ============================================================================

export const ContextEngineMeta = Object.freeze({
  layer: "PulseAIContextEngine",
  role: "CONTEXT_ENGINE_ORGAN",
  version: "12.3-Presence",
  identity: "aiContextEngine-v12.3-Presence",

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

    packetAware: true,
    presenceAware: true,
    chunkingAware: true,
    gpuFriendly: true,

    multiInstanceReady: true,
    readOnly: true,
    epoch: "12.3-Presence"
  }),

  contract: Object.freeze({
    purpose: [
      "Fuse Brainstem context, Router packet, Persona state, and SafetyFrame into a unified ContextFrame",
      "Expose a deterministic context surface for Overmind and Cortex",
      "Keep identity, permissions, and boundaries read-only and explicit"
    ],

    never: Object.freeze([
      "mutate Brainstem context",
      "mutate Router packet",
      "mutate persona definitions",
      "override SafetyFrame decisions",
      "introduce randomness",
      "perform cognition or intent handling"
    ]),

    always: Object.freeze([
      "remain deterministic for same inputs",
      "respect persona, boundaries, and permissions contracts",
      "surface dual-band vitals as read-only hints",
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
//  CONTEXT ENGINE PREWARM — v12.3‑Presence
// ============================================================================
export function prewarmContextEngine(config = {}) {
  try {
    const { safetyFrame, experienceFrame } = config;

    const warm = new AiContextEngine({ safetyFrame, experienceFrame });

    const warmBrainstem = {
      context: { userId: "prewarm", userIsOwner: false },
      organs: { encoder: {}, memory: {} }
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
      }
    };

    warm.buildContextFrame({
      brainstem: warmBrainstem,
      request: warmRequest,
      routerPacket: warmRouter,
      persona: warmPersona,
      binaryVitals: warmBinaryVitals,
      dualBand: warmDualBand
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
//  CORE IMPLEMENTATION — v12.3‑Presence (Hybrid)
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
    dualBand = null
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

    const frame = Object.freeze({
      meta: ContextEngineMeta,

      user: Object.freeze({
        userId: baseContext.userId || null,
        userIsOwner: !!baseContext.userIsOwner
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

      dualBand: Object.freeze({
        hints: dualBandHints,
        binaryVitals: binaryVitals || {},
        organismSnapshot:
          dualBand?.organism?.organismSnapshot?.() || null
      }),

      organs: Object.freeze({
        ...organs
      })
    });

    return emitContextEnginePacket("context:frame", frame);
  }
}

// ============================================================================
//  PUBLIC API — v12.3‑Presence
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
