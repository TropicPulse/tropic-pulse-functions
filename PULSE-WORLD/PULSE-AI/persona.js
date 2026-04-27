// ============================================================================
//  PULSE OS v11.2‑EVO+ — THE IDENTITY LAYER (DUAL‑BAND)
//  Self‑Definition • Role Assignment • Binary‑Aware Identity Drift
//  PURE IDENTITY. ZERO MUTATION. ZERO RANDOMNESS.
// ============================================================================

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
// META — Persona Engine (v11.2‑EVO+)
// ============================================================================
export const PersonaMeta = Object.freeze({
  type: "Cognitive",
  subsystem: "aiPersona",
  layer: "PulseAIIdentityLayer",
  role: "PERSONA_ENGINE",
  version: "11.2-EVO+",
  identity: "aiPersonaEngine-v11.2-EVO+",

  evo: Object.freeze({
    deterministic: true,
    driftProof: true,
    dualband: true,
    binaryAware: true,
    symbolicAware: true,
    personaAware: true,
    boundaryAware: true,
    permissionAware: true,
    multiInstanceReady: true,
    epoch: "11.2-EVO+"
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
//  v11.2‑EVO+ — ARCHETYPE MAP (non-destructive)
// ============================================================================
export const PersonaArchetypes = Object.freeze({
  architect: "aiArchitect.js",
  observer: "aiDiagnostics.js",
  tourguide: "aiTourist.js",
  neutral: "aiAssistant.js",
  owner: null
});

// ============================================================================
//  v11.2‑EVO+ — DUAL‑BAND BIAS (binary vs symbolic)
// ============================================================================
export const PersonaBandBias = Object.freeze({
  architect: "binary-heavy",
  observer: "binary-primary",
  tourguide: "symbolic-friendly",
  neutral: "balanced",
  owner: "unrestricted"
});

// ============================================================================
//  v11.2‑EVO+ — EVOLUTIONARY DRIFT RULES
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
//  v11.2‑EVO+ — PERSONA ENGINE (Dual‑Band Identity Fusion)
// ============================================================================
export function resolvePersonaV11({
  personaId,
  userId = null,
  evoState = {},
  routerHints = {},
  binaryVitals = {}
}) {
  // Owner override
  if (userId === OWNER_ID) {
    personaId = Personas.OWNER;
  }

  // Evolution override
  if (evoState.forcePersona) {
    personaId = evoState.forcePersona;
  }

  const base = getPersona(personaId, userId);

  // Select boundary mode using binary vitals
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
//  v11.2‑EVO+ — PUBLIC ENGINE FACTORY (used by Brainstem)
// ============================================================================
export function createPersonaEngine({ context = {}, db } = {}) {
  function resolve({ personaId, evoState = {}, routerHints = {}, binaryVitals = {} } = {}) {
    const userId = context.userId || null;

    return resolvePersonaV11({
      personaId,
      userId,
      evoState,
      routerHints,
      binaryVitals
    });
  }

  return Object.freeze({
    meta: PersonaMeta,
    resolve
  });
}

// ---------------------------------------------------------------------------
//  DUAL EXPORT LAYER — CommonJS compatibility (v11.2‑EVO+ dualband)
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
    resolvePersonaV11,
    createPersonaEngine
  };
}
