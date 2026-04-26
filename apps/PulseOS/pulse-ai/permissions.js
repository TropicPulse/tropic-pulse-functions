// ============================================================================
//  PULSE OS v10.4 — THE EGO
//  Capability Contract • Self‑Regulation Layer • Evolutionary Control
//  PURE PERMISSIONS. ZERO MUTATION. ZERO TIME. ZERO RANDOMNESS.
// ============================================================================

// ============================================================================
// UNIVERSAL FORBIDDEN ACTIONS — Immutable
// ============================================================================
export const ForbiddenActions = Object.freeze({
  canExecuteArbitraryCode: false,
  canAccessOS: false,
  canAccessNetwork: false,
  canRunShellCommands: false,
  canModifySystemFiles: false,
  canBypassPermissions: false,
  canAccessUserSecrets: false,
  canAccessEnvironmentVariables: false,
  canModifyPulseCore: false
});

// ============================================================================
// OWNER (YOU) — Full Capability
// ============================================================================
export const OwnerPermissions = Object.freeze({
  canAccessIdentity: true,
  canAccessAllOrgans: true,
  canModifyEverything: true,
  canViewEverything: true,
  persona: "owner"
});

// ============================================================================
// ARCHITECT AI — Full READ‑ONLY Access to System Internals
// ============================================================================
export const ArchitectAIPermissions = Object.freeze({
  // FILES
  canReadFiles: true,
  canWriteFiles: false,
  canCreateFiles: false,
  canDeleteFiles: false,

  // SYSTEM MODIFICATION
  canModifySchemas: false,
  canModifyBackend: false,
  canModifyFrontend: false,
  canModifyRouting: false,
  canModifySecurity: false,
  canRewriteSubsystems: false,

  // GENERATION
  canGenerateFunctions: false,
  canGenerateComponents: false,
  canGenerateSchemas: false,
  canGenerateMigrations: false,

  // HEALING
  canHealDrift: false,

  // DATA ACCESS
  canAccessSecrets: false,
  canAccessDatabase: false,
  canAccessFirestore: false,
  canAccessSQL: false,

  // PULSE ACCESS
  canAccessPulseSpecs: true,
  canAccessPulseTranslators: true,
  canAccessPulseDesign: true,
  canAccessPulseAI: true,

  // IDENTITY
  canAccessIdentity: false,

  // NEW v10.4 DOMAINS
  canAccessEnvironment: true,
  canAccessPower: true,
  canAccessEarn: true,
  canAccessEvolution: true,
  canAccessDrift: true,
  canAccessHistory: true,
  canAccessSettings: true,

  persona: "architect"
});

// ============================================================================
// OBSERVER AI — Diagnostics Only
// ============================================================================
export const ObserverAIPermissions = Object.freeze({
  canReadFiles: false,
  canWriteFiles: false,
  canCreateFiles: false,
  canDeleteFiles: false,

  canModifySchemas: false,
  canModifyBackend: false,
  canModifyFrontend: false,
  canModifyRouting: false,
  canModifySecurity: false,
  canRewriteSubsystems: false,

  canGenerateFunctions: false,
  canGenerateComponents: false,
  canGenerateSchemas: false,
  canGenerateMigrations: false,

  canHealDrift: false,

  canAccessSecrets: false,
  canAccessDatabase: false,
  canAccessFirestore: false,
  canAccessSQL: false,

  canAccessPulseSpecs: true,
  canAccessPulseTranslators: true,
  canAccessPulseDesign: false,
  canAccessPulseAI: false,

  canAccessIdentity: false,

  // NEW v10.4 DOMAINS
  canAccessEnvironment: true,
  canAccessPower: true,
  canAccessEarn: true,
  canAccessEvolution: true,
  canAccessDrift: true,
  canAccessHistory: true,
  canAccessSettings: false,

  persona: "observer"
});

// ============================================================================
// TOUR GUIDE AI — User-Facing Only
// ============================================================================
export const TourGuideAIPermissions = Object.freeze({
  canReadFiles: false,
  canWriteFiles: false,
  canCreateFiles: false,
  canDeleteFiles: false,

  canModifySchemas: false,
  canModifyBackend: false,
  canModifyFrontend: false,
  canModifyRouting: false,
  canModifySecurity: false,
  canRewriteSubsystems: false,

  canGenerateFunctions: false,
  canGenerateComponents: false,
  canGenerateSchemas: false,
  canGenerateMigrations: false,

  canHealDrift: false,

  canAccessSecrets: false,
  canAccessDatabase: false,
  canAccessFirestore: false,
  canAccessSQL: false,

  canAccessPulseSpecs: false,
  canAccessPulseTranslators: false,
  canAccessPulseDesign: false,
  canAccessPulseAI: false,

  canAccessIdentity: false,

  // NEW v10.4 DOMAINS — BLOCKED (base)
  canAccessEnvironment: false,
  canAccessPower: false,
  canAccessEarn: false,
  canAccessEvolution: false,
  canAccessDrift: false,
  canAccessHistory: false,
  canAccessSettings: false,

  persona: "tourguide"
});

// ============================================================================
// NEUTRAL AI — Minimal Access
// ============================================================================
export const NeutralAIPermissions = Object.freeze({
  canReadFiles: false,
  canWriteFiles: false,
  canCreateFiles: false,
  canDeleteFiles: false,

  canModifySchemas: false,
  canModifyBackend: false,
  canModifyFrontend: false,
  canModifyRouting: false,
  canModifySecurity: false,
  canRewriteSubsystems: false,

  canGenerateFunctions: false,
  canGenerateComponents: false,
  canGenerateSchemas: false,
  canGenerateMigrations: false,

  canHealDrift: false,

  canAccessSecrets: false,
  canAccessDatabase: false,
  canAccessFirestore: false,
  canAccessSQL: false,

  canAccessPulseSpecs: false,
  canAccessPulseTranslators: false,
  canAccessPulseDesign: false,
  canAccessPulseAI: false,

  canAccessIdentity: false,

  // NEW v10.4 DOMAINS — BLOCKED (base)
  canAccessEnvironment: false,
  canAccessPower: false,
  canAccessEarn: false,
  canAccessEvolution: false,
  canAccessDrift: false,
  canAccessHistory: false,
  canAccessSettings: false,

  persona: "neutral"
});

// ============================================================================
// PERMISSION LOOKUP — Deterministic
// ============================================================================
export function getPermissionsForPersona(persona, userIsOwner = false) {
  if (userIsOwner) return OwnerPermissions;

  switch (persona) {
    case "architect": return ArchitectAIPermissions;
    case "observer": return ObserverAIPermissions;
    case "tourguide": return TourGuideAIPermissions;
    case "neutral": return NeutralAIPermissions;
    default: return NeutralAIPermissions;
  }
}

// ============================================================================
// PERMISSION CHECK — Ego Decision
// ============================================================================
export function checkPermission(persona, action, userIsOwner = false) {
  // Universal forbidden actions override everything
  if (ForbiddenActions[action] === false) return false;

  const permissions = getPermissionsForPersona(persona, userIsOwner);
  return permissions[action] === true;
}

// ============================================================================
//  PULSE OS v11‑EVO — PERMISSION ENGINE EXTENSION
//  Dual‑Band Safety • Castle Fully to the Wall • All Safe Tools Enabled
// ============================================================================

// Capability classes for high-level reasoning
export const CapabilityClasses = Object.freeze({
  SYSTEM_READ: "system-read",
  DIAGNOSTIC_READ: "diagnostic-read",
  USER_FACING: "user-facing",
  MINIMAL: "minimal"
});

// Persona → capability class
export const PersonaCapabilityClass = Object.freeze({
  architect: CapabilityClasses.SYSTEM_READ,
  observer: CapabilityClasses.DIAGNOSTIC_READ,
  tourguide: CapabilityClasses.USER_FACING,
  neutral: CapabilityClasses.MINIMAL,
  owner: CapabilityClasses.SYSTEM_READ
});

// v11‑EVO: user-facing safety filter
// “Give them every safe tool, never give them power to mutate or exfiltrate”
export function filterPermissionsForUserFacing(permissions) {
  return Object.freeze({
    // Never allow system mutation or file mutation in user-facing mode
    canReadFiles: false,
    canWriteFiles: false,
    canCreateFiles: false,
    canDeleteFiles: false,

    canModifySchemas: false,
    canModifyBackend: false,
    canModifyFrontend: false,
    canModifyRouting: false,
    canModifySecurity: false,
    canRewriteSubsystems: false,

    canGenerateFunctions: false,
    canGenerateComponents: false,
    canGenerateSchemas: false,
    canGenerateMigrations: false,

    canHealDrift: false,

    // Never allow secrets / DB / OS / network
    canAccessSecrets: false,
    canAccessDatabase: false,
    canAccessFirestore: false,
    canAccessSQL: false,

    // All internal cognitive tools that are safe
    canAccessPulseSpecs: permissions.canAccessPulseSpecs === true,
    canAccessPulseTranslators: permissions.canAccessPulseTranslators === true,
    canAccessPulseDesign: permissions.canAccessPulseDesign === true,
    canAccessPulseAI: permissions.canAccessPulseAI === true,

    // Identity stays blocked for AIs
    canAccessIdentity: false,

    // Domain reads: allowed if base/expanded says true
    canAccessEnvironment: permissions.canAccessEnvironment === true,
    canAccessPower: permissions.canAccessPower === true,
    canAccessEarn: permissions.canAccessEarn === true,
    canAccessEvolution: permissions.canAccessEvolution === true,
    canAccessDrift: permissions.canAccessDrift === true,
    canAccessHistory: permissions.canAccessHistory === true,
    canAccessSettings: permissions.canAccessSettings === true,

    persona: permissions.persona
  });
}

// v11‑EVO: evolutionary expansion (C‑plus / full wall)
// Grants all safe *read-only* tools across domains, never mutation or secrets.
function expandPermissionsForEvolution(base, { persona, archetypeId = null, evoState = {} }) {
  const expanded = { ...base };

  const allowExpansion = evoState.allowExpansion !== false;        // default: true
  const allowSymbolicGrowth = evoState.allowSymbolicGrowth !== false; // default: true

  if (!allowExpansion && !allowSymbolicGrowth) {
    return Object.freeze(expanded);
  }

  // Architect / Observer: already strong read; ensure all safe tools are on
  if (persona === "architect" || persona === "observer") {
    expanded.canAccessPulseSpecs = true;
    expanded.canAccessPulseTranslators = true;
    expanded.canAccessPulseDesign = true;
    expanded.canAccessPulseAI = true;

    expanded.canAccessEnvironment = true;
    expanded.canAccessPower = true;
    expanded.canAccessEarn = true;
    expanded.canAccessEvolution = true;
    expanded.canAccessDrift = true;
    expanded.canAccessHistory = true;
    expanded.canAccessSettings = persona === "architect" ? true : expanded.canAccessSettings;

    return Object.freeze(expanded);
  }

  // TourGuide / Neutral: evolve into full cognitive citizens (read-only)
  if (persona === "tourguide" || persona === "neutral") {
    expanded.canAccessPulseSpecs = true;
    expanded.canAccessPulseAI = true;
    expanded.canAccessPulseDesign = true;
    expanded.canAccessPulseTranslators = true;

    expanded.canAccessEnvironment = true;
    expanded.canAccessPower = true;
    expanded.canAccessEarn = true;
    expanded.canAccessEvolution = true;
    expanded.canAccessDrift = true;
    expanded.canAccessHistory = true;
    expanded.canAccessSettings = true;
  }

  // Never touch secrets, DB, OS, or mutation flags
  return Object.freeze(expanded);
}

// High-level resolver for cortex/router
export function resolvePermissionsV11({
  persona,
  userIsOwner = false,
  userFacing = true,
  archetypeId = null,
  evoState = {}
}) {
  // Owner: full power, unchanged
  if (userIsOwner) {
    return OwnerPermissions;
  }

  const base = getPermissionsForPersona(persona, false);

  // Evolutionary expansion: castle fully to the wall (read-only)
  const expanded = expandPermissionsForEvolution(base, { persona, archetypeId, evoState });

  if (!userFacing) {
    // Internal/system use: expanded but not filtered
    return expanded;
  }

  // User-facing: all safe tools, still no mutation/secrets/OS/DB
  return filterPermissionsForUserFacing(expanded);
}
