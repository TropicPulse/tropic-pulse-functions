// FILE: tropic-pulse-functions/apps/pulse-ai/persona.js

//
// ------------------------------------------------------
// 📘 PAGE INDEX — Source of Truth for This File
// ------------------------------------------------------
//
// ROLE:
//   PulseAIPersona — defines the AI personas that operate inside Pulse OS,
//   including their identity, intent, and linkage to permissions + boundaries.
//
// PURPOSE:
//   • Give each AI a clear, explicit identity
//   • Bind personas to permissions and boundaries
//   • Make AI roles human‑readable + AI‑readable
//
// OUTPUT:
//   • Persona objects for backend‑ai and frontend‑ai
//
// RESPONSIBILITIES:
//   • Define persona metadata (name, description, scope)
//   • Attach permissions + boundaries references
//   • Provide helpers to resolve persona by id
//
// SAFETY RULES (CRITICAL):
//   • READ‑ONLY — no file writes
//   • NO eval(), NO Function(), NO dynamic imports
//   • NO executing user code
//   • NO network calls
//   • Deterministic persona resolution only
//
// ------------------------------------------------------
// Pulse‑AI Persona Layer
// ------------------------------------------------------

import {
  BackendAIPermissions,
  FrontendAIPermissions,
} from "./permissions.js";
import {
  BackendAIBoundaries,
  FrontendAIBoundaries,
} from "./boundaries.js";

export const Personas = {
  BACKEND_AI: "backend-ai",
  FRONTEND_AI: "frontend-ai",
};

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

/**
 * getPersona(personaId)
 */
export function getPersona(personaId) {
  return PersonaRegistry[personaId] || null;
}
