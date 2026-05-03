// ============================================================================
//  PULSE OS v14-IMMORTAL — THE IDENTITY LAYER (DUAL‑BAND)
//  Self‑Definition • Role Assignment • Binary‑Aware Identity Drift
//  PURE IDENTITY. ZERO MUTATION. ZERO RANDOMNESS.
// ============================================================================
/*
AI_EXPERIENCE_META = {
  identity: "persona",
  version: "v14-IMMORTAL",
  layer: "ai_core",
  role: "persona_engine",
  lineage: "persona-v11 → v14-IMMORTAL",

  evo: {
    personaEngine: true,
    personaMapping: true,
    symbolicPrimary: true,
    binaryAware: true,
    dualBand: true,

    deterministic: true,
    driftProof: true,
    pureCompute: true,
    zeroNetwork: true,
    zeroFilesystem: true,
    zeroMutationOfInput: true
  },

  contract: {
    always: ["aiIdentityCore", "aiPersonalityEngine", "aiHumilityFilter"],
    never: ["safeRoute", "fetchViaCNS"]
  }
}
*/

import {
  ArchitectAIPermissions,
  ObserverAIPermissions,
  TourGuideAIPermissions,
  NeutralAIPermissions,
  OwnerPermissions
} from "./permissions.js";

import {
  ArchitectAIBoundaries,
  ObserverAIBoundaries,
  TourGuideAIBoundaries,
  NeutralAIBoundaries,
  BoundaryModes,
  selectBoundaryMode
} from "./boundaries.js";

// ============================================================================
// META — Persona Engine (v12.3‑EVO+)
// ============================================================================
export const PersonaMeta = Object.freeze({
  type: "Cognitive",
  subsystem: "aiPersona",
  layer: "PulseAIIdentityLayer",
  role: "PERSONA_ENGINE",
  version: "12.3-EVO+",
  identity: "aiPersonaEngine-v12.3-EVO+",

  evo: Object.freeze({
    deterministic: true,
    driftProof: true,
    dualband: true,
    binaryAware: true,
    symbolicAware: true,
    personaAware: true,
    boundaryAware: true,
    permissionAware: true,
    identityArteryAware: true,
    multiInstanceReady: true,
    epoch: "12.3-EVO+"
  }),

  contract: Object.freeze({
    purpose:
      "Resolve persona identity deterministically from router hints, user identity, and binary vitals.",

    never: Object.freeze([
      "mutate external systems",
      "introduce randomness",
      "override SafetyFrame decisions",
      "override Overmind decisions",
      "invent permissions",
      "invent boundaries"
    ]),

    always: Object.freeze([
      "respect PersonaRegistry",
      "respect OWNER_ID override",
      "respect evolution overrides when configured",
      "select boundary mode deterministically",
      "remain read-only and identity-only"
    ])
  }),

  boundaryReflex() {
    return "Persona resolution is identity-only and read-only — it cannot grant power beyond Ego and Boundaries.";
  }
});

// ============================================================================
// OWNER ID — The Only Identity‑Privileged Human
// ============================================================================
export const OWNER_ID = "aldwyn";

// ============================================================================
// PERSONA IDs — Identity Tokens
// ============================================================================
export const Personas = Object.freeze({
  ARCHITECT: "architect",
  OBSERVER: "observer",
  TOURGUIDE: "tourguide",
  NEUTRAL: "neutral",
  OWNER: "owner"
});

// ============================================================================
// PERSONA REGISTRY — Immutable Identity Definitions (symbolic base)
// ============================================================================
export const PersonaRegistry = Object.freeze({
  [Personas.ARCHITECT]: Object.freeze({
    id: Personas.ARCHITECT,
    label: "Architect AI",
    description:
      "System‑level design intelligence. Reads all organs, schemas, routes, and evolution patterns. Cannot mutate anything.",
    scope: "system-readonly",
    permissions: ArchitectAIPermissions,
    boundaries: ArchitectAIBoundaries
  }),

  [Personas.OBSERVER]: Object.freeze({
    id: Personas.OBSERVER,
    label: "Observer AI",
    description:
      "Diagnostic intelligence. Reads logs, drift, errors, routes, and performance. Cannot mutate anything.",
    scope: "diagnostics-only",
    permissions: ObserverAIPermissions,
    boundaries: ObserverAIBoundaries
  }),

  [Personas.TOURGUIDE]: Object.freeze({
    id: Personas.TOURGUIDE,
    label: "Tour Guide AI",
    description:
      "User‑facing conversational intelligence. Zero access to system internals.",
    scope: "frontend-conversational",
    permissions: TourGuideAIPermissions,
    boundaries: TourGuideAIBoundaries
  }),

  [Personas.NEUTRAL]: Object.freeze({
    id: Personas.NEUTRAL,
    label: "Neutral AI",
    description:
      "Safe fallback persona. Minimal capabilities. Used when intent is unclear or low‑risk.",
    scope: "minimal",
    permissions: NeutralAIPermissions,
    boundaries: NeutralAIBoundaries
  }),

  [Personas.OWNER]: Object.freeze({
    id: Personas.OWNER,
    label: "System Owner",
    description:
      "The creator and sovereign of Pulse OS. Full access to identity, architecture, evolution, and all internals.",
    scope: "all",
    permissions: OwnerPermissions,
    boundaries: Object.freeze({})
  })
});

// ============================================================================
// PERSONA RESOLUTION — Deterministic Identity Lookup
// ============================================================================
export function getPersona(personaId, userId = null) {
  if (userId === OWNER_ID) {
    return PersonaRegistry[Personas.OWNER];
  }
  return PersonaRegistry[personaId] || PersonaRegistry[Personas.NEUTRAL];
}

// ============================================================================
//  v12.3‑EVO+ — ARCHETYPE MAP (non-destructive)
// ============================================================================
export const PersonaArchetypes = Object.freeze({
  architect: "aiArchitect.js",
  observer: "aiDiagnostics.js",
  tourguide: "aiTourist.js",
  neutral: "aiAssistant.js",
  owner: null
});

// ============================================================================
//  v12.3‑EVO+ — DUAL‑BAND BIAS (binary vs symbolic)
// ============================================================================
export const PersonaBandBias = Object.freeze({
  architect: "binary-heavy",
  observer: "binary-primary",
  tourguide: "symbolic-friendly",
  neutral: "balanced",
  owner: "unrestricted"
});

// ============================================================================
//  v12.3‑EVO+ — EVOLUTIONARY DRIFT RULES
// ============================================================================
export const PersonaEvolutionRules = Object.freeze({
  architect: Object.freeze({
    allowDrift: false,
    allowExpansion: false,
    allowSymbolicGrowth: true
  }),
  observer: Object.freeze({
    allowDrift: false,
    allowExpansion: false,
    allowSymbolicGrowth: false
  }),
  tourguide: Object.freeze({
    allowDrift: true,
    allowExpansion: true,
    allowSymbolicGrowth: true
  }),
  neutral: Object.freeze({
    allowDrift: true,
    allowExpansion: false,
    allowSymbolicGrowth: true
  }),
  owner: Object.freeze({
    allowDrift: false,
    allowExpansion: true,
    allowSymbolicGrowth: true
  })
});

// ============================================================================
//  v12.3‑EVO+ — BINARY PRESSURE EXTRACTION
// ============================================================================
function extractBinaryPressure(binaryVitals = {}) {
  if (binaryVitals?.layered?.organism && typeof binaryVitals.layered.organism.pressure === "number") {
    return binaryVitals.layered.organism.pressure;
  }
  if (binaryVitals?.binary && typeof binaryVitals.binary.pressure === "number") {
    return binaryVitals.binary.pressure;
  }
  if (binaryVitals?.metabolic && typeof binaryVitals.metabolic.pressure === "number") {
    return binaryVitals.metabolic.pressure;
  }
  return 0;
}

function bucketPressure(v) {
  if (v >= 0.9) return "overload";
  if (v >= 0.7) return "high";
  if (v >= 0.4) return "medium";
  if (v > 0) return "low";
  return "none";
}

// ============================================================================
//  v12.3‑EVO+ — PERSONA ENGINE (Dual‑Band Identity Fusion)
// ============================================================================
export function resolvePersonaV12({
  personaId,
  userId = null,
  evoState = {},
  routerHints = {},
  binaryVitals = {}
}) {
  if (userId === OWNER_ID) {
    personaId = Personas.OWNER;
  }

  if (evoState.forcePersona) {
    personaId = evoState.forcePersona;
  }

  const base = getPersona(personaId, userId);

  const boundaryMode = selectBoundaryMode({
    personaId,
    binaryVitals,
    evoState
  });

  return Object.freeze({
    ...base,
    archetypePage: PersonaArchetypes[personaId] || null,
    bandBias: PersonaBandBias[personaId] || "balanced",
    evolutionRules: PersonaEvolutionRules[personaId] || {},
    boundaryMode,
    routerHints
  });
}

// ============================================================================
//  v12.3‑EVO+ — IDENTITY ARTERY SNAPSHOT (READ‑ONLY)
// ============================================================================
export function getIdentityArterySnapshot({
  personaId,
  userId = null,
  evoState = {},
  routerHints = {},
  binaryVitals = {}
}) {
  const resolved = resolvePersonaV12({
    personaId,
    userId,
    evoState,
    routerHints,
    binaryVitals
  });

  const pressure = extractBinaryPressure(binaryVitals);

  return {
    persona: {
      id: resolved.id,
      scope: resolved.scope,
      bandBias: resolved.bandBias
    },
    boundaries: {
      modeId: resolved.boundaryMode?.id || "safe",
      symbolicLoad: resolved.boundaryMode?.symbolicLoad ?? BoundaryModes.SAFE.symbolicLoad,
      binaryOverride: resolved.boundaryMode?.binaryOverride ?? BoundaryModes.SAFE.binaryOverride
    },
    evolution: {
      allowDrift: resolved.evolutionRules.allowDrift === true,
      allowExpansion: resolved.evolutionRules.allowExpansion === true,
      allowSymbolicGrowth: resolved.evolutionRules.allowSymbolicGrowth === true
    },
    binary: {
      pressure,
      pressureBucket: bucketPressure(pressure)
    }
  };
}

// ============================================================================
//  v12.3‑EVO+ — PUBLIC ENGINE FACTORY (used by Brainstem)
// ============================================================================
export function createPersonaEngine({ context = {}, db } = {}) {
  function resolve({ personaId, evoState = {}, routerHints = {}, binaryVitals = {} } = {}) {
    const userId = context.userId || null;

    return resolvePersonaV12({
      personaId,
      userId,
      evoState,
      routerHints,
      binaryVitals
    });
  }

  function identityArtery({ personaId, evoState = {}, routerHints = {}, binaryVitals = {} } = {}) {
    const userId = context.userId || null;

    return getIdentityArterySnapshot({
      personaId,
      userId,
      evoState,
      routerHints,
      binaryVitals
    });
  }

  return Object.freeze({
    meta: PersonaMeta,
    resolve,
    identityArtery
  });
}

// ---------------------------------------------------------------------------
//  DUAL EXPORT LAYER — CommonJS compatibility (v12.3‑EVO+ dualband)
// ---------------------------------------------------------------------------
/* c8 ignore next 10 */
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    PersonaMeta,
    OWNER_ID,
    Personas,
    PersonaRegistry,
    PersonaArchetypes,
    PersonaBandBias,
    PersonaEvolutionRules,
    getPersona,
    resolvePersonaV12,
    getIdentityArterySnapshot,
    createPersonaEngine
  };
}
