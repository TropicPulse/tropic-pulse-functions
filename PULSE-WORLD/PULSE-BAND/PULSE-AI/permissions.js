// ============================================================================
//  PULSE OS v14-IMMORTAL — THE EGO
//  Capability Contract • Self‑Regulation Layer • Evolutionary Control
//  PURE PERMISSIONS. ZERO MUTATION. ZERO TIME. ZERO RANDOMNESS.
// ============================================================================
/*
AI_EXPERIENCE_META = {
  identity: "permissions",
  version: "v14-IMMORTAL",
  layer: "ai_core",
  role: "permissions_surface",
  lineage: "permissions-v11 → v14-IMMORTAL",

  evo: {
    permissionsSurface: true,
    policyMapping: true,
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
    always: ["aiPermissionsEngine", "aiGovernorAdaptor", "aiBoundariesEngine"],
    never: ["safeRoute", "fetchViaCNS"]
  }
}
*/

export const EgoMeta = Object.freeze({
  type: "Cognitive",
  subsystem: "aiEgo",
  layer: "PulseAIEgo",
  role: "EGO_ORGAN",
  version: "12.3-EVO+",
  identity: "aiEgo-v12.3-EVO+",

  evo: Object.freeze({
    driftProof: true,
    deterministic: true,
    dualband: true,
    binaryAware: true,
    symbolicAware: true,
    readOnly: true,
    mutationSafe: true,
    nonBlocking: true,
    lineageAware: true,
    multiInstanceReady: true,
    capabilityArteryAware: true,
    epoch: "12.3-EVO+"
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
// PERSONA PERMISSIONS (unchanged, drift-proof)
// ============================================================================
export const OwnerPermissions = Object.freeze({
  canAccessIdentity: true,
  canAccessAllOrgans: true,
  canModifyEverything: true,
  canViewEverything: true,
  persona: "owner"
});

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
// CAPABILITY ARTERY v3 — Pure, Read‑Only, Deterministic
// ============================================================================
function bucketPressure(v) {
  if (v >= 0.9) return "overload";
  if (v >= 0.7) return "high";
  if (v >= 0.4) return "medium";
  if (v > 0) return "low";
  return "none";
}

function bucketLevel(v) {
  if (v >= 0.9) return "elite";
  if (v >= 0.75) return "high";
  if (v >= 0.5) return "medium";
  if (v >= 0.25) return "low";
  return "critical";
}

function extractBinaryPressure(binaryVitals = {}) {
  if (binaryVitals?.layered?.organism?.pressure != null)
    return binaryVitals.layered.organism.pressure;
  if (binaryVitals?.binary?.pressure != null)
    return binaryVitals.binary.pressure;
  return 0;
}

function extractBoundaryPressure(boundaryArtery = {}) {
  if (boundaryArtery?.vitals?.pressure != null)
    return boundaryArtery.vitals.pressure;
  if (boundaryArtery?.pressure != null)
    return boundaryArtery.pressure;
  return 0;
}

export function getCapabilityArterySnapshot({
  persona,
  userIsOwner = false,
  binaryVitals = {},
  boundaryArtery = {}
}) {
  const permissions = getPermissionsForPersona(persona, userIsOwner);

  const readCount = Object.values(permissions).filter(v => v === true).length;
  const forbiddenCount = Object.values(ForbiddenActions).filter(v => v === false).length;

  const binaryPressure = extractBinaryPressure(binaryVitals);
  const boundaryPressure = extractBoundaryPressure(boundaryArtery);

  const localPressure = forbiddenCount > 0 ? 0.4 : 0.1;

  const fusedPressure = Math.max(
    0,
    Math.min(
      1,
      0.5 * localPressure +
        0.3 * binaryPressure +
        0.2 * boundaryPressure
    )
  );

  const throughput = Math.max(0, Math.min(1, 1 - fusedPressure));
  const cost = Math.max(0, Math.min(1, fusedPressure * (1 - throughput)));
  const budget = Math.max(0, Math.min(1, throughput - cost));

  return {
    organism: {
      pressure: fusedPressure,
      cost,
      budget,
      pressureBucket: bucketPressure(fusedPressure),
      budgetBucket: bucketLevel(budget)
    },
    persona: {
      id: persona,
      capabilityClass: PersonaCapabilityClass[persona] || "minimal"
    },
    forbidden: {
      count: forbiddenCount,
      severity: bucketPressure(localPressure)
    },
    permissions: {
      readCount,
      writeCount: 0,
      systemCount: 0
    },
    boundaries: {
      pressure: boundaryPressure,
      pressureBucket: bucketPressure(boundaryPressure)
    },
    binary: {
      pressure: binaryPressure,
      pressureBucket: bucketPressure(binaryPressure)
    }
  };
}

// ============================================================================
// HIGH-LEVEL RESOLVER (unchanged logic, drift-proof)
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

// ---------------------------------------------------------------------------
//  DUAL EXPORT LAYER — CommonJS compatibility (v12.3‑EVO+ dualband)
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
    getCapabilityArterySnapshot
  };
}
