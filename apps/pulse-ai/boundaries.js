// FILE: tropic-pulse-functions/apps/pulse-ai/boundaries.js

//
// ------------------------------------------------------
// 📘 PAGE INDEX — Source of Truth for This File
// ------------------------------------------------------
//
// ROLE:
//   PulseAIBoundaries — behavioral boundary layer that defines what each
//   AI persona is allowed to TOUCH, SUGGEST, or CHANGE across the Pulse OS.
//
// PURPOSE:
//   • Define hard boundaries for backend AI vs frontend AI
//   • Separate SAFE vs UNSAFE operations
//   • Require human / owner confirmation for sensitive actions
//   • Make AI behavior constraints human‑readable + AI‑readable
//
// OUTPUT:
//   • Boundary maps for each AI persona
//   • Helper functions for boundary checks
//
// RESPONSIBILITIES:
//   • Define resource‑level boundaries (files, data, subsystems)
//   • Define action‑level boundaries (read, suggest, write, delete)
//   • Define confirmation requirements (none, human, owner)
//   • Provide deterministic boundary checks
//
// SAFETY RULES (CRITICAL):
//   • READ‑ONLY — no file writes
//   • NO eval(), NO Function(), NO dynamic imports
//   • NO executing user code
//   • NO network calls
//   • Deterministic boundary checks only
//
// ------------------------------------------------------
// Pulse‑AI Boundary Layer
// ------------------------------------------------------

import {
  BackendAIPermissions,
  FrontendAIPermissions,
} from "./permissions.js";

/**
 * Boundary levels:
 *   "none"   — no confirmation required
 *   "human"  — requires human confirmation
 *   "owner"  — requires owner (you) confirmation
 *   "never"  — forbidden for this persona
 */
export const BoundaryLevels = {
  NONE: "none",
  HUMAN: "human",
  OWNER: "owner",
  NEVER: "never",
};

/**
 * Backend AI boundaries (your AI)
 * This AI can do everything, but some actions still require
 * explicit OWNER confirmation.
 */
export const BackendAIBoundaries = {
  files: {
    read: BoundaryLevels.NONE,
    write: BoundaryLevels.HUMAN,
    create: BoundaryLevels.HUMAN,
    delete: BoundaryLevels.OWNER,
    rewriteSubsystem: BoundaryLevels.OWNER,
  },
  schemas: {
    read: BoundaryLevels.NONE,
    modify: BoundaryLevels.HUMAN,
    migrate: BoundaryLevels.OWNER,
  },
  backend: {
    read: BoundaryLevels.NONE,
    modify: BoundaryLevels.HUMAN,
  },
  frontend: {
    read: BoundaryLevels.NONE,
    modify: BoundaryLevels.HUMAN,
  },
  routing: {
    read: BoundaryLevels.NONE,
    modify: BoundaryLevels.OWNER,
  },
  security: {
    read: BoundaryLevels.OWNER,
    modify: BoundaryLevels.OWNER,
  },
  healing: {
    suggest: BoundaryLevels.NONE,
    apply: BoundaryLevels.HUMAN,
  },
};

/**
 * Frontend AI boundaries (user AI)
 * This AI is read‑only and suggestion‑only.
 */
export const FrontendAIBoundaries = {
  files: {
    read: BoundaryLevels.NONE,
    write: BoundaryLevels.NEVER,
    create: BoundaryLevels.NEVER,
    delete: BoundaryLevels.NEVER,
    rewriteSubsystem: BoundaryLevels.NEVER,
  },
  schemas: {
    read: BoundaryLevels.NONE,
    modify: BoundaryLevels.NEVER,
    migrate: BoundaryLevels.NEVER,
  },
  backend: {
    read: BoundaryLevels.NEVER,
    modify: BoundaryLevels.NEVER,
  },
  frontend: {
    read: BoundaryLevels.NONE,
    modify: BoundaryLevels.NEVER,
  },
  routing: {
    read: BoundaryLevels.NEVER,
    modify: BoundaryLevels.NEVER,
  },
  security: {
    read: BoundaryLevels.NEVER,
    modify: BoundaryLevels.NEVER,
  },
  healing: {
    suggest: BoundaryLevels.NONE,
    apply: BoundaryLevels.NEVER,
  },
};

/**
 * getBoundariesForPersona(persona)
 */
export function getBoundariesForPersona(persona) {
  if (persona === "backend-ai") return BackendAIBoundaries;
  if (persona === "frontend-ai") return FrontendAIBoundaries;
  return null;
}

/**
 * canPerform(persona, domain, action)
 * Returns:
 *   { allowed: boolean, level: "none" | "human" | "owner" | "never" }
 */
export function canPerform(persona, domain, action) {
  const boundaries = getBoundariesForPersona(persona);
  if (!boundaries) {
    return { allowed: false, level: BoundaryLevels.NEVER };
  }

  const domainRules = boundaries[domain];
  if (!domainRules) {
    return { allowed: false, level: BoundaryLevels.NEVER };
  }

  const level = domainRules[action] || BoundaryLevels.NEVER;

  return {
    allowed: level === BoundaryLevels.NONE,
    level,
  };
}
