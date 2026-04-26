// ============================================================================
//  PULSE OS v11‑EVO — CONTEXT ENGINE
//  Context Fusion • Routing Frame • Safety + Persona Snapshot
//  PURE CONTEXT. ZERO MUTATION. ZERO RANDOMNESS.
// ============================================================================

export const ContextEngineMeta = Object.freeze({
  layer: "PulseAIContextEngine",
  role: "CONTEXT_ENGINE_ORGAN",
  version: "11.1-EVO",
  identity: "aiContextEngine-v11-EVO",

  evo: Object.freeze({
    driftProof: true,
    deterministic: true,
    dualband: true,
    routerAware: true,
    personaAware: true,
    safetyAware: true,
    personalAware: true,
    overmindAware: true,
    organismAware: true,
    multiInstanceReady: true,
    epoch: "v11-EVO"
  }),

  contract: Object.freeze({
    purpose: [
      "Fuse Brainstem context, Router packet, Persona state, and safety into a single ContextFrame",
      "Expose a stable, deterministic context surface for aiOvermind and Cortex",
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
      "return frozen context frames"
    ])
  })
});

// ============================================================================
//  CORE IMPLEMENTATION
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

    return Object.freeze({
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
  }
}

// ============================================================================
//  PUBLIC API
// ============================================================================

export function createContextEngine(config = {}) {
  const core = new AiContextEngine({
    safetyFrame: config.safetyFrame || null,
    experienceFrame: config.experienceFrame || null
  });

  return Object.freeze({
    meta: ContextEngineMeta,
    buildContextFrame(payload) {
      return core.buildContextFrame(payload);
    }
  });
}
