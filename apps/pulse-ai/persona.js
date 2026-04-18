// ============================================================================
// FILE: tropic-pulse-functions/apps/pulse-ai/persona.js
// LAYER: THE IDENTITY LAYER (Self‑Definition + Role Assignment)
// ============================================================================
//
// ROLE:
//   THE IDENTITY LAYER — Defines who each AI persona *is*
//   • Provides explicit identity metadata
//   • Binds personas to permissions + boundaries
//   • Gives each AI a clear role + scope inside Pulse OS
//
// PURPOSE:
//   • Make AI identity human‑readable + AI‑readable
//   • Provide deterministic persona resolution
//   • Serve as the foundation for routing + cognition
//
// CONTRACT:
//   • READ‑ONLY — no writes
//   • NO eval(), NO Function(), NO dynamic imports
//   • NO executing user code
//   • NO network calls
//   • Deterministic persona lookup only
//
// SAFETY:
//   • v6.3 upgrade is COMMENTAL ONLY — NO LOGIC CHANGES
//   • All behavior remains identical to pre‑v6.3 persona.js
// ============================================================================

import {
  BackendAIPermissions,
  FrontendAIPermissions,
} from "./permissions.js";

import {
  BackendAIBoundaries,
  FrontendAIBoundaries,
} from "./boundaries.js";

// ============================================================================
// PERSONA IDs — Identity Tokens
// ============================================================================
export const Personas = {
  BACKEND_AI: "backend-ai",
  FRONTEND_AI: "frontend-ai",
};

// ============================================================================
// PERSONA REGISTRY — Identity Definitions
// ============================================================================
export const PersonaRegistry = {
  [Personas.BACKEND_AI]: {
    id: Personas.BACKEND_AI,
    label: "Backend AI (Owner)",
    description:
      "Full‑access creator AI for the Pulse OS owner. Can design, generate, heal, and refactor backend + frontend, subject to confirmation rules.",
    scope: "backend+frontend",
    permissions: BackendAIPermissions,
    boundaries: BackendAIBoundaries,
  },

  [Personas.FRONTEND_AI]: {
    id: Personas.FRONTEND_AI,
    label: "Frontend AI (User‑Safe)",
    description:
      "Read‑only, suggestion‑only AI for end users. Can analyze, explain, and propose changes, but cannot directly mutate backend or files.",
    scope: "frontend-only",
    permissions: FrontendAIPermissions,
    boundaries: FrontendAIBoundaries,
  },
};

// ============================================================================
// PERSONA RESOLUTION — Identity Lookup
// ============================================================================
export function getPersona(personaId) {
  return PersonaRegistry[personaId] || null;
}
