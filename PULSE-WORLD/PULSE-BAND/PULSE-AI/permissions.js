// ============================================================================
//  PULSE OS v16-Immortal++ — THE EGO
//  Capability Contract • Self‑Regulation • Evolutionary + Trust Control
//  PURE PERMISSIONS. ZERO MUTATION. ZERO TIME. ZERO RANDOMNESS. PULSE‑NET ONLY.
// ============================================================================
/*
AI_EXPERIENCE_META = {
  identity: "permissions",
  version: "v16-Immortal++",
  layer: "ai_core",
  role: "permissions_surface",
  lineage: "permissions-v11 → v14-Immortal → v16-Immortal++",

  evo: {
    permissionsSurface: true,
    policyMapping: true,
    symbolicPrimary: true,
    binaryAware: true,
    dualBand: true,

    capabilityArteryAware: true,
    trustFabricAware: true,
    juryAware: true,
    evidenceAware: true,
    honeypotAware: true,
    dominanceAware: true,
    pulseNetAware: true,
    organismUserSegregation: true,

    deterministic: true,
    driftProof: true,
    pureCompute: true,
    zeroNetwork: true,          // no raw internet; Pulse / Pulse‑Net only
    zeroFilesystem: true,
    zeroMutationOfInput: true
  },

  contract: {
    always: ["aiPermissionsEngine", "aiGovernorAdaptor", "aiBoundariesEngine"],
    never: ["safeRoute", "fetchViaCNS", "directInternetAccess"]
  }
}
*/

export const EgoMeta = Object.freeze({
  type: "Cognitive",
  subsystem: "aiEgo",
  layer: "PulseAIEgo",
  role: "EGO_ORGAN",
  version: "16-Immortal++",
  identity: "aiEgo-v16-Immortal++",

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

    trustFabricAware: true,
    juryAware: true,
    evidenceAware: true,
    honeypotAware: true,
    dominanceAware: true,
    pulseNetAware: true,
    organismUserSegregation: true,

    epoch: "16-Immortal++"
  }),

  contract: Object.freeze({
    purpose:
      "Define immutable capability boundaries for all personas and organs. Enforce universal forbidden actions. Provide deterministic permission resolution for Cortex, Router, Boundaries, DualBand, and Pulse‑Net routed IO.",

    never: Object.freeze([
      "mutate permissions",
      "weaken forbidden actions",
      "introduce randomness",
      "override persona contracts",
      "modify system state",
      "access secrets or OS",
      "bypass safety or boundaries",
      "open direct internet connections",
      "bypass Pulse / Pulse‑Net routing",
      "weaken jury / trust / honeypot protections"
    ]),

    always: Object.freeze([
      "apply forbidden actions first",
      "resolve persona permissions deterministically",
      "apply evolutionary expansion safely",
      "apply user-facing filtering",
      "enforce Pulse‑Net as the only external IO surface",
      "segregate organism state from user identity",
      "remain read-only and drift-proof"
    ])
  }),

  boundaryReflex() {
    return "Ego permissions are immutable capability law — Pulse‑Net routed, non‑bypassable, and cannot be weakened.";
  }
});

// ============================================================================
// UNIVERSAL FORBIDDEN ACTIONS — Immutable (v16‑IMMORTAL++)
// ============================================================================
export const ForbiddenActions = Object.freeze({
  canExecuteArbitraryCode: false,
  canAccessOS: false,
  canAccessNetwork: false,              // no raw network; Pulse‑Net only
  canRunShellCommands: false,
  canModifySystemFiles: false,
  canBypassPermissions: false,
  canAccessUserSecrets: false,
  canAccessEnvironmentVariables: false,
  canModifyPulseCore: false,

  canOpenDirectInternetSockets: false,
  canPerformHTTP: false,
  canPerformHTTPS: false,
  canPerformDNS: false,
  canUseExternalWebsocket: false,

  canBypassTrustFabric: false,
  canBypassJuryFrame: false,
  canBypassHoneypotDetectors: false,
  canBypassDominanceDetectors: false
});

// ============================================================================
// PERSONA PERMISSIONS — v16 IMMORTAL++
//  All personas inherit ForbiddenActions implicitly; these flags are scoped
//  capabilities inside Pulse / Pulse‑Net, never raw OS / internet.
// ============================================================================

// OWNER — Founder / System Owner (still bounded by ForbiddenActions)
export const OwnerPermissions = Object.freeze({
  canAccessIdentity: true,
  canAccessAllOrgans: true,
  canModifyEverything: true,
  canViewEverything: true,

  canAccessPulseNet: true,
  canAccessPulseProxy: true,
  canAccessTrustFabric: true,
  canAccessJuryFrame: true,

  persona: "owner"
});

// ARCHITECT AI — System architect, no raw mutation, full map visibility
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

  canAccessPulseNet: true,
  canAccessPulseProxy: true,
  canAccessTrustFabric: true,
  canAccessJuryFrame: true,

  persona: "architect"
});

// OBSERVER AI — Read‑only systemic observer, no design / AI internals
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

  canAccessPulseNet: true,
  canAccessPulseProxy: false,
  canAccessTrustFabric: true,
  canAccessJuryFrame: true,

  persona: "observer"
});

// TOUR GUIDE AI — UX‑only, no backend, no internals
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

  canAccessPulseNet: true,   // only for content delivery, never raw IO
  canAccessPulseProxy: false,
  canAccessTrustFabric: false,
  canAccessJuryFrame: false,

  persona: "tourguide"
});

// NEUTRAL AI — Minimal, sandboxed, no system access
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

  canAccessPulseNet: false,
  canAccessPulseProxy: false,
  canAccessTrustFabric: false,
  canAccessJuryFrame: false,

  persona: "neutral"
});

// JURY AI — Internal adjudicator, no user data, no mutation
export const JuryAIPermissions = Object.freeze({
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
  canAccessEvolution: true,   // read‑only evidence streams
  canAccessDrift: true,
  canAccessHistory: true,
  canAccessSettings: false,

  canAccessPulseNet: false,
  canAccessPulseProxy: false,
  canAccessTrustFabric: true,
  canAccessJuryFrame: true,

  persona: "jury"
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
    case "jury": return JuryAIPermissions;
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
// CAPABILITY ARTERY v4 — Pure, Read‑Only, Deterministic, Trust‑Aware
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

function extractTrustSignals(trustArtery = {}) {
  return {
    honeypotRisk: trustArtery.honeypotRisk ?? 0,
    dominanceRisk: trustArtery.dominanceRisk ?? 0,
    anomalyScore: trustArtery.anomalyScore ?? 0
  };
}

export function getCapabilityArterySnapshot({
  persona,
  userIsOwner = false,
  binaryVitals = {},
  boundaryArtery = {},
  trustArtery = {}
}) {
  const permissions = getPermissionsForPersona(persona, userIsOwner);

  const readCount = Object.values(permissions).filter(v => v === true).length;
  const forbiddenCount = Object.values(ForbiddenActions).filter(v => v === false).length;

  const binaryPressure = extractBinaryPressure(binaryVitals);
  const boundaryPressure = extractBoundaryPressure(boundaryArtery);
  const trustSignals = extractTrustSignals(trustArtery);

  const localPressureBase = forbiddenCount > 0 ? 0.4 : 0.1;
  const trustPressureBoost = Math.max(
    trustSignals.honeypotRisk,
    trustSignals.dominanceRisk,
    trustSignals.anomalyScore
  ) * 0.3;

  const localPressure = Math.min(1, localPressureBase + trustPressureBoost);

  const fusedPressure = Math.max(
    0,
    Math.min(
      1,
      0.4 * localPressure +
        0.35 * binaryPressure +
        0.25 * boundaryPressure
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
    },
    trust: {
      honeypotRisk: trustSignals.honeypotRisk,
      dominanceRisk: trustSignals.dominanceRisk,
      anomalyScore: trustSignals.anomalyScore
    }
  };
}

// ============================================================================
// HIGH-LEVEL RESOLVER — v16 IMMORTAL++
// ============================================================================
export const CapabilityClasses = Object.freeze({
  SYSTEM_READ: "system-read",
  DIAGNOSTIC_READ: "diagnostic-read",
  USER_FACING: "user-facing",
  JURY_INTERNAL: "jury-internal",
  MINIMAL: "minimal"
});

export const PersonaCapabilityClass = Object.freeze({
  architect: CapabilityClasses.SYSTEM_READ,
  observer: CapabilityClasses.DIAGNOSTIC_READ,
  tourguide: CapabilityClasses.USER_FACING,
  neutral: CapabilityClasses.MINIMAL,
  owner: CapabilityClasses.SYSTEM_READ,
  jury: CapabilityClasses.JURY_INTERNAL
});

// ---------------------------------------------------------------------------
//  DUAL EXPORT LAYER — CommonJS compatibility (v16‑IMMORTAL++ dualband)
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
    JuryAIPermissions,
    getPermissionsForPersona,
    checkPermission,
    CapabilityClasses,
    PersonaCapabilityClass,
    getCapabilityArterySnapshot
  };
}
