// ============================================================================
//  PULSE OS v11.2‑EVO+ — THE EGO
//  Capability Contract • Self‑Regulation Layer • Evolutionary Control
//  PURE PERMISSIONS. ZERO MUTATION. ZERO TIME. ZERO RANDOMNESS.
// ============================================================================

export const EgoMeta = Object.freeze({
  type: "Cognitive",
  subsystem: "aiEgo",
  layer: "PulseAIEgo",
  role: "EGO_ORGAN",
  version: "11.2-EVO+",
  identity: "aiEgo-v11.2-EVO+",

  evo: Object.freeze({
    driftProof: true,
    deterministic: true,
    dualband: true,
    binaryAware: false,
    symbolicAware: true,
    readOnly: true,
    mutationSafe: true,
    nonBlocking: true,
    lineageAware: true,
    multiInstanceReady: true,
    epoch: "v11.2-EVO+"
  }),

  contract: Object.freeze({
    purpose:
      "Define immutable capability boundaries for all personas and organs. Enforce universal forbidden actions. Provide deterministic permission resolution for Cortex, Router, and Boundaries.",

    never: Object.freeze([
      "mutate permissions",
      "weaken forbidden actions",
      "introduce randomness",
      "override persona contracts",
      "modify system state",
      "access secrets or OS",
      "bypass safety or boundaries"
    ]),

    always: Object.freeze([
      "apply forbidden actions first",
      "resolve persona permissions deterministically",
      "apply evolutionary expansion safely",
      "apply user-facing filtering",
      "remain read-only and drift-proof"
    ])
  }),

  boundaryReflex() {
    return "Ego permissions are immutable capability law — they cannot be bypassed or weakened.";
  }
});

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
  canReadFiles: true,
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
  canAccessPulseDesign: true,
  canAccessPulseAI: true,

  canAccessIdentity: false,

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
  if (ForbiddenActions[action] === false) return false;

  const permissions = getPermissionsForPersona(persona, userIsOwner);
  return permissions[action] === true;
}

// ============================================================================
//  v11.2‑EVO+ — PERMISSION ENGINE EXTENSION
// ============================================================================
export const CapabilityClasses = Object.freeze({
  SYSTEM_READ: "system-read",
  DIAGNOSTIC_READ: "diagnostic-read",
  USER_FACING: "user-facing",
  MINIMAL: "minimal"
});

export const PersonaCapabilityClass = Object.freeze({
  architect: CapabilityClasses.SYSTEM_READ,
  observer: CapabilityClasses.DIAGNOSTIC_READ,
  tourguide: CapabilityClasses.USER_FACING,
  neutral: CapabilityClasses.MINIMAL,
  owner: CapabilityClasses.SYSTEM_READ
});

// User-facing safety filter
export function filterPermissionsForUserFacing(permissions) {
  return Object.freeze({
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

    canAccessPulseSpecs: permissions.canAccessPulseSpecs === true,
    canAccessPulseTranslators: permissions.canAccessPulseTranslators === true,
    canAccessPulseDesign: permissions.canAccessPulseDesign === true,
    canAccessPulseAI: permissions.canAccessPulseAI === true,

    canAccessIdentity: false,

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

// Evolutionary expansion (read-only)
function expandPermissionsForEvolution(base, { persona, archetypeId = null, evoState = {} }) {
  const expanded = { ...base };

  const allowExpansion = evoState.allowExpansion !== false;
  const allowSymbolicGrowth = evoState.allowSymbolicGrowth !== false;

  if (!allowExpansion && !allowSymbolicGrowth) {
    return Object.freeze(expanded);
  }

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

  return Object.freeze(expanded);
}

// High-level resolver
export function resolvePermissionsV11({
  persona,
  userIsOwner = false,
  userFacing = true,
  archetypeId = null,
  evoState = {}
}) {
  if (userIsOwner) {
    return OwnerPermissions;
  }

  const base = getPermissionsForPersona(persona, false);
  const expanded = expandPermissionsForEvolution(base, { persona, archetypeId, evoState });

  if (!userFacing) {
    return expanded;
  }

  return filterPermissionsForUserFacing(expanded);
}

// ---------------------------------------------------------------------------
//  DUAL EXPORT LAYER — CommonJS compatibility (v11.2‑EVO+ dualband)
// ---------------------------------------------------------------------------
/* c8 ignore next 10 */
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    EgoMeta,
    ForbiddenActions,
    OwnerPermissions,
    ArchitectAIPermissions,
    ObserverAIPermissions,
    TourGuideAIPermissions,
    NeutralAIPermissions,
    getPermissionsForPersona,
    checkPermission,
    CapabilityClasses,
    PersonaCapabilityClass,
    filterPermissionsForUserFacing,
    resolvePermissionsV11
  };
}
