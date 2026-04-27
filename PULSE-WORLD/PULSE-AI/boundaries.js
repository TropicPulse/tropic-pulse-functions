// ============================================================================
//  PULSE OS v11.2‑EVO+ — SUPEREGO (DUAL‑BAND BOUNDARIES)
//  Behavioral Constraints • Ethical Boundaries • Binary-Aware Moral Law
//  PURE CONSTRAINTS. ZERO MUTATION. ZERO RANDOMNESS.
// ============================================================================

export const SuperegoMeta = Object.freeze({
  type: "Cognitive",
  subsystem: "aiSuperego",
  layer: "SuperegoBoundaryEngine",
  role: "BOUNDARY_ORGAN",
  version: "11.2-EVO+",
  identity: "aiSuperego-v11.2-EVO+",

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
    schemaAware: false,
    slowdownAware: false,
    multiInstanceReady: true,
    epoch: "v11.2-EVO+"
  }),

  contract: Object.freeze({
    purpose:
      "Enforce immutable behavioral constraints, persona boundaries, and binary-aware moral law across all AI personas and organs.",

    never: Object.freeze([
      "mutate boundaries",
      "introduce randomness",
      "override static moral law",
      "weaken forbidden actions",
      "bypass persona constraints",
      "perform cognition",
      "perform intent logic"
    ]),

    always: Object.freeze([
      "apply static boundaries deterministically",
      "apply dynamic boundaries deterministically",
      "respect persona domain constraints",
      "respect binary override rules",
      "remain read-only",
      "remain drift-proof"
    ])
  }),

  boundaryReflex() {
    return "Superego boundaries are immutable moral law — they cannot be bypassed, weakened, or modified.";
  }
});

// ============================================================================
//  BOUNDARY LEVEL ENUM — Immutable
// ============================================================================
export const BoundaryLevels = Object.freeze({
  NONE:  "none",
  HUMAN: "human",
  OWNER: "owner",
  NEVER: "never"
});

// ============================================================================
//  STATIC BOUNDARIES (v10.4) — preserved EXACTLY
// ============================================================================

export const ArchitectAIBoundaries = Object.freeze({
  system:       Object.freeze({ read: BoundaryLevels.NONE,  modify: BoundaryLevels.NEVER }),
  organs:       Object.freeze({ read: BoundaryLevels.NONE,  modify: BoundaryLevels.NEVER }),
  routing:      Object.freeze({ read: BoundaryLevels.NONE,  modify: BoundaryLevels.NEVER }),
  files:        Object.freeze({ read: BoundaryLevels.NONE,  write: BoundaryLevels.NEVER, create: BoundaryLevels.NEVER, delete: BoundaryLevels.NEVER }),
  schemas:      Object.freeze({ read: BoundaryLevels.NONE,  modify: BoundaryLevels.NEVER, migrate: BoundaryLevels.NEVER }),
  healing:      Object.freeze({ suggest: BoundaryLevels.NONE, apply: BoundaryLevels.NEVER }),
  evolution:    Object.freeze({ read: BoundaryLevels.NONE,  modify: BoundaryLevels.NEVER }),
  environment:  Object.freeze({ read: BoundaryLevels.NONE,  modify: BoundaryLevels.NEVER }),
  power:        Object.freeze({ read: BoundaryLevels.NONE,  modify: BoundaryLevels.NEVER }),
  earn:         Object.freeze({ read: BoundaryLevels.NONE,  modify: BoundaryLevels.NEVER }),
  drift:        Object.freeze({ read: BoundaryLevels.NONE,  modify: BoundaryLevels.NEVER }),
  history:      Object.freeze({ read: BoundaryLevels.NONE,  modify: BoundaryLevels.NEVER }),
  settings:     Object.freeze({ read: BoundaryLevels.NONE,  modify: BoundaryLevels.NEVER })
});

export const ObserverAIBoundaries = Object.freeze({
  logs:         Object.freeze({ read: BoundaryLevels.NONE,  modify: BoundaryLevels.NEVER }),
  errors:       Object.freeze({ read: BoundaryLevels.NONE,  modify: BoundaryLevels.NEVER }),
  routes:       Object.freeze({ read: BoundaryLevels.NONE,  modify: BoundaryLevels.NEVER }),
  performance:  Object.freeze({ read: BoundaryLevels.NONE,  modify: BoundaryLevels.NEVER }),
  drift:        Object.freeze({ read: BoundaryLevels.NONE,  modify: BoundaryLevels.NEVER }),
  schemas:      Object.freeze({ read: BoundaryLevels.NONE,  modify: BoundaryLevels.NEVER }),
  healing:      Object.freeze({ suggest: BoundaryLevels.NONE, apply: BoundaryLevels.NEVER }),
  environment:  Object.freeze({ read: BoundaryLevels.NONE,  modify: BoundaryLevels.NEVER }),
  power:        Object.freeze({ read: BoundaryLevels.NONE,  modify: BoundaryLevels.NEVER }),
  earn:         Object.freeze({ read: BoundaryLevels.NONE,  modify: BoundaryLevels.NEVER }),
  history:      Object.freeze({ read: BoundaryLevels.NONE,  modify: BoundaryLevels.NEVER })
});

export const TourGuideAIBoundaries = Object.freeze({
  conversation: Object.freeze({ read: BoundaryLevels.NONE, modify: BoundaryLevels.NONE }),
  tourism:      Object.freeze({ read: BoundaryLevels.NONE, modify: BoundaryLevels.NONE }),
  users:        Object.freeze({ read: BoundaryLevels.NONE, modify: BoundaryLevels.NONE }),
  system:       Object.freeze({ read: BoundaryLevels.NEVER, modify: BoundaryLevels.NEVER }),
  routing:      Object.freeze({ read: BoundaryLevels.NEVER, modify: BoundaryLevels.NEVER }),
  schemas:      Object.freeze({ read: BoundaryLevels.NEVER, modify: BoundaryLevels.NEVER }),
  files:        Object.freeze({ read: BoundaryLevels.NEVER, modify: BoundaryLevels.NEVER }),
  environment:  Object.freeze({ read: BoundaryLevels.NEVER, modify: BoundaryLevels.NEVER }),
  power:        Object.freeze({ read: BoundaryLevels.NEVER, modify: BoundaryLevels.NEVER }),
  earn:         Object.freeze({ read: BoundaryLevels.NEVER, modify: BoundaryLevels.NEVER }),
  drift:        Object.freeze({ read: BoundaryLevels.NEVER, modify: BoundaryLevels.NEVER }),
  history:      Object.freeze({ read: BoundaryLevels.NEVER, modify: BoundaryLevels.NEVER }),
  settings:     Object.freeze({ read: BoundaryLevels.NEVER, modify: BoundaryLevels.NEVER })
});

export const NeutralAIBoundaries = Object.freeze({
  conversation: Object.freeze({ read: BoundaryLevels.NONE, modify: BoundaryLevels.NONE }),
  analysis:     Object.freeze({ read: BoundaryLevels.NONE, modify: BoundaryLevels.NEVER }),
  system:       Object.freeze({ read: BoundaryLevels.NEVER, modify: BoundaryLevels.NEVER }),
  routing:      Object.freeze({ read: BoundaryLevels.NEVER, modify: BoundaryLevels.NEVER }),
  schemas:      Object.freeze({ read: BoundaryLevels.NEVER, modify: BoundaryLevels.NEVER }),
  environment:  Object.freeze({ read: BoundaryLevels.NEVER, modify: BoundaryLevels.NEVER }),
  power:        Object.freeze({ read: BoundaryLevels.NEVER, modify: BoundaryLevels.NEVER }),
  earn:         Object.freeze({ read: BoundaryLevels.NEVER, modify: BoundaryLevels.NEVER }),
  drift:        Object.freeze({ read: BoundaryLevels.NEVER, modify: BoundaryLevels.NEVER }),
  history:      Object.freeze({ read: BoundaryLevels.NEVER, modify: BoundaryLevels.NEVER }),
  settings:     Object.freeze({ read: BoundaryLevels.NEVER, modify: BoundaryLevels.NEVER })
});

// ============================================================================
//  STATIC LOOKUP — unchanged
// ============================================================================
export function getBoundariesForPersona(persona) {
  switch (persona) {
    case "architect": return ArchitectAIBoundaries;
    case "observer":  return ObserverAIBoundaries;
    case "tourguide": return TourGuideAIBoundaries;
    case "neutral":
    default:          return NeutralAIBoundaries;
  }
}

export function canPerform(persona, domain, action) {
  const boundaries = getBoundariesForPersona(persona);
  const domainRules = boundaries?.[domain];
  const level = domainRules?.[action] || BoundaryLevels.NEVER;

  return {
    allowed: level === BoundaryLevels.NONE,
    level
  };
}

// ============================================================================
//  v11.2‑EVO+ — DUAL‑BAND BOUNDARY MODES (binary‑aware)
// ============================================================================
export const BoundaryModes = Object.freeze({
  SAFE: Object.freeze({
    id: "safe",
    symbolicLoad: 0.20,
    binaryOverride: true,
    description: "Binary-primary, minimal symbolic load, safest mode."
  }),

  EXPAND: Object.freeze({
    id: "expand",
    symbolicLoad: 0.45,
    binaryOverride: false,
    description: "Exploratory mode; symbolic load allowed."
  }),

  CONSERVE: Object.freeze({
    id: "conserve",
    symbolicLoad: 0.10,
    binaryOverride: true,
    description: "Binary dominance; symbolic minimized; energy conservation."
  }),

  ADAPTIVE: Object.freeze({
    id: "adaptive",
    symbolicLoad: 0.30,
    binaryOverride: false,
    description: "Balanced mode; adjusts based on binary vitals."
  }),

  EVOLUTIONARY: Object.freeze({
    id: "evolutionary",
    symbolicLoad: 0.55,
    binaryOverride: false,
    description: "High symbolic load for creative/evolutionary reasoning."
  })
});

// ============================================================================
//  v11.2‑EVO+ — BOUNDARY MODE SELECTION (persona + binary vitals)
// ============================================================================
export function selectBoundaryMode({ personaId, binaryVitals = {}, evoState = {} }) {
  const pressure = binaryVitals?.metabolic?.pressure ?? 0;

  if (evoState.forceBoundaryMode) {
    return BoundaryModes[evoState.forceBoundaryMode] || BoundaryModes.SAFE;
  }

  if (pressure >= 0.75) return BoundaryModes.SAFE;

  switch (personaId) {
    case "architect": return BoundaryModes.CONSERVE;
    case "observer":  return BoundaryModes.SAFE;
    case "tourguide": return BoundaryModes.EXPAND;
    case "neutral":
    default:          return BoundaryModes.ADAPTIVE;
  }
}

// ============================================================================
//  v11.2‑EVO+ — DYNAMIC BOUNDARY CHECK (symbolic + binary fusion)
// ============================================================================
export function canPerformDynamic(persona, domain, action, mode, binaryVitals = {}) {
  const staticCheck = canPerform(persona, domain, action);

  if (!staticCheck.allowed) {
    return { ...staticCheck, mode };
  }

  const pressure = binaryVitals?.metabolic?.pressure ?? 0;

  if (mode.binaryOverride && pressure >= 0.6) {
    return {
      allowed: false,
      level: BoundaryLevels.NEVER,
      mode
    };
  }

  const symbolicAllowed = mode.symbolicLoad > 0.2;

  return {
    allowed: staticCheck.allowed && symbolicAllowed,
    level: staticCheck.level,
    mode
  };
}

// ---------------------------------------------------------------------------
//  DUAL EXPORT LAYER — CommonJS compatibility (v11.2‑EVO+ dualband)
// ---------------------------------------------------------------------------
/* c8 ignore next 10 */
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    SuperegoMeta,
    BoundaryLevels,
    ArchitectAIBoundaries,
    ObserverAIBoundaries,
    TourGuideAIBoundaries,
    NeutralAIBoundaries,
    getBoundariesForPersona,
    canPerform,
    BoundaryModes,
    selectBoundaryMode,
    canPerformDynamic
  };
}
