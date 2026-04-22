// ============================================================================
// FILE: tropic-pulse-functions/apps/pulse-ai/permissions.js
// LAYER: THE EGO (Capability Contract + Self‑Regulation Layer + Evolutionary Control)
// ============================================================================
//
// ROLE (v7.1+):
//   THE EGO — Defines what each AI persona *can* do.
//   • Mediates between desire (intent) and law (Superego).
//   • Provides the capability map for backend‑ai vs frontend‑ai.
//   • Enforces strict separation of power.
//   • Acts as the “executive ego” of the digital organism.
//
// PURPOSE (v7.1+):
//   • Prevent unauthorized mutation or backend access.
//   • Allow safe read‑only operations for user AI.
//   • Allow full creation + mutation for owner AI.
//   • Provide deterministic, human‑readable permissions.
//   • Surface evolutionary capability patterns (conceptual only).
//
// CONTRACT (unchanged):
//   • READ‑ONLY — no writes.
//   • NO eval(), NO Function(), NO dynamic imports.
//   • NO executing user code.
//   • NO network calls.
//   • Deterministic permission checks only.
//
// SAFETY (unchanged):
//   • v7.1+ upgrade is COMMENTAL ONLY — NO LOGIC CHANGES.
//   • All behavior remains identical to pre‑v7.1 permissions.js.
// ============================================================================

// ============================================================================
// BACKEND AI — The Owner’s Ego (Full Capability)
// ============================================================================
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

// ============================================================================
// FRONTEND AI — The User’s Ego (Read‑Only + Safe Transformations)
// ============================================================================
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

// ============================================================================
// UNIVERSAL FORBIDDEN ACTIONS — No Persona May Ever Do These
// ============================================================================
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

// ============================================================================
// PERMISSION CHECK — Ego Decision
// ============================================================================
export function checkPermission(persona, action) {
  // Universal forbidden actions override everything
  if (ForbiddenActions[action] === false) return false;

  if (persona === "backend-ai") {
    return BackendAIPermissions[action] === true;
  }

  if (persona === "frontend-ai") {
    return FrontendAIPermissions[action] === true;
  }

  return false;
}
