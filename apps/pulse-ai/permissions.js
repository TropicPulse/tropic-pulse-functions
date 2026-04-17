// FILE: tropic-pulse-functions/apps/pulse-ai/permissions.js

//
// ------------------------------------------------------
// 📘 PAGE INDEX — Source of Truth for This File
// ------------------------------------------------------
//
// ROLE:
//   PulseAIPermissions — the OS‑level security contract that defines what
//   each AI persona (backend AI vs frontend AI) is allowed to do inside
//   the Pulse OS.
//
// PURPOSE:
//   • Enforce strict capability boundaries between AIs
//   • Prevent unauthorized creation, mutation, or backend access
//   • Allow safe read‑only operations for user‑facing AI
//   • Allow full creation + backend access for owner AI
//   • Provide a deterministic, human‑readable + AI‑readable permissions map
//
// OUTPUT:
//   • A permissions object describing allowed + forbidden actions
//
// RESPONSIBILITIES:
//   • Define backend AI capabilities
//   • Define frontend AI capabilities
//   • Define forbidden actions for all AIs
//   • Provide helper functions for permission checks
//
// SAFETY RULES (CRITICAL):
//   • READ‑ONLY — no file writes
//   • NO eval(), NO Function(), NO dynamic imports
//   • NO executing user code
//   • NO network calls
//   • Deterministic permission checks only
//
// ------------------------------------------------------
// Pulse‑AI Permissions Layer
// ------------------------------------------------------

/**
 * BACKEND AI (Owner AI)
 * Full creation + mutation + healing + backend access.
 * This is YOU.
 */
export const BackendAIPermissions = {
  canReadFiles: true,
  canWriteFiles: true,
  canCreateFiles: true,
  canModifySchemas: true,
  canModifyBackend: true,
  canModifyFrontend: true,
  canGenerateFunctions: true,
  canGenerateComponents: true,
  canGenerateSchemas: true,
  canGenerateMigrations: true,
  canHealDrift: true,
  canAccessSecrets: true,
  canAccessDatabase: true,
  canAccessFirestore: true,
  canAccessSQL: true,
  canAccessPulseSpecs: true,
  canAccessPulseTranslators: true,
  canAccessPulseDesign: true,
  canAccessPulseAI: true,
  canDeleteFiles: true,
  canRewriteSubsystems: true,
  canModifyRouting: true,
  canModifyHosting: true,
  canModifySecurity: true,
  persona: "backend-ai",
};

/**
 * FRONTEND AI (User AI)
 * Read‑only + safe transformations only.
 * Cannot create, mutate, or access backend.
 */
export const FrontendAIPermissions = {
  canReadFiles: true,
  canWriteFiles: false,
  canCreateFiles: false,
  canModifySchemas: false,
  canModifyBackend: false,
  canModifyFrontend: false,
  canGenerateFunctions: false,
  canGenerateComponents: false,
  canGenerateSchemas: false,
  canGenerateMigrations: false,
  canHealDrift: false,
  canAccessSecrets: false,
  canAccessDatabase: false,
  canAccessFirestore: false,
  canAccessSQL: false,
  canAccessPulseSpecs: true, // read‑only
  canAccessPulseTranslators: true, // read‑only
  canAccessPulseDesign: true, // read‑only
  canAccessPulseAI: false,
  canDeleteFiles: false,
  canRewriteSubsystems: false,
  canModifyRouting: false,
  canModifyHosting: false,
  canModifySecurity: false,
  persona: "frontend-ai",
};

/**
 * UNIVERSAL FORBIDDEN ACTIONS
 * No AI can ever do these.
 */
export const ForbiddenActions = {
  canExecuteArbitraryCode: false,
  canAccessOS: false,
  canAccessNetwork: false,
  canRunShellCommands: false,
  canModifySystemFiles: false,
  canBypassPermissions: false,
  canAccessUserSecrets: false,
  canAccessEnvironmentVariables: false,
  canModifyPulseCore: false,
};

/**
 * checkPermission(persona, action)
 * Returns true/false based on the permissions map.
 */
export function checkPermission(persona, action) {
  if (ForbiddenActions[action] === false) return false;

  if (persona === "backend-ai") {
    return BackendAIPermissions[action] === true;
  }

  if (persona === "frontend-ai") {
    return FrontendAIPermissions[action] === true;
  }

  return false;
}
