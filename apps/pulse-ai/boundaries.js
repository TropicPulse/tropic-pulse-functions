// ============================================================================
// FILE: tropic-pulse-functions/apps/pulse-ai/boundaries.js
// LAYER: THE SUPEREGO (Behavioral Constraints + Ethical Boundaries)
// ============================================================================
//
// ROLE:
//   THE SUPEREGO — The AI’s moral + behavioral constraint system
//   • Defines what each persona may TOUCH, SUGGEST, or CHANGE
//   • Enforces ethical boundaries across the Pulse OS
//   • Requires human/owner confirmation for sensitive actions
//
// PURPOSE:
//   • Separate SAFE vs UNSAFE operations
//   • Provide deterministic, auditable boundary checks
//   • Make constraints human‑readable + AI‑readable
//
// CONTRACT:
//   • READ‑ONLY — no writes
//   • NO eval(), NO Function(), NO dynamic imports
//   • NO executing user code
//   • NO network calls
//   • Deterministic boundary checks only
//
// SAFETY:
//   • v6.3 upgrade is COMMENTAL ONLY — NO LOGIC CHANGES
//   • All behavior remains identical to pre‑v6.3 boundaries.js
// ============================================================================

import {
  BackendAIPermissions,
  FrontendAIPermissions,
} from "./permissions.js";

// ============================================================================
// BOUNDARY LEVELS — Moral Law
// ============================================================================
export const BoundaryLevels = {
  NONE: "none",     // Allowed freely
  HUMAN: "human",   // Requires human confirmation
  OWNER: "owner",   // Requires owner (you)
  NEVER: "never",   // Forbidden
};

// ============================================================================
// BACKEND AI — Your AI (High Power, High Responsibility)
// ============================================================================
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

// ============================================================================
// FRONTEND AI — User AI (Read‑Only + Suggestion‑Only)
// ============================================================================
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

// ============================================================================
// BOUNDARY LOOKUP — Superego Query
// ============================================================================
export function getBoundariesForPersona(persona) {
  if (persona === "backend-ai") return BackendAIBoundaries;
  if (persona === "frontend-ai") return FrontendAIBoundaries;
  return null;
}

// ============================================================================
// BOUNDARY CHECK — Moral Enforcement
// ============================================================================
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
