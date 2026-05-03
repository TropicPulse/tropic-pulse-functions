// ============================================================================
//  PULSE OS v15‑IMMORTAL — PERMISSIONS ENGINE
//  Dual‑Band Safety Contract • Deterministic • Drift‑Proof • Persona‑Aware
//  PURE CONTRACT ORACLE. ZERO MUTATION. ZERO RANDOMNESS.
// ============================================================================

/*
AI_EXPERIENCE_META = {
  identity: "aiPermissionsEngine",
  version: "v15-IMMORTAL",
  layer: "ai_core",
  role: "permissions_engine",
  lineage: "aiPermissionsEngine-v11 → v15-IMMORTAL",

  evo: {
    permissionsEngine: true,
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
    always: [
      "aiGovernorAdapter",
      "aiBoundariesEngine",
      "aiBrainstem",
      "aiSafetyFrame",
      "aiLoggerAdapter",
      "aiGenome",
      "aiIdentityCore"
    ],
    never: [
      "safeRoute",
      "fetchViaCNS",
      "mutateExternalState",
      "performCognition",
      "logSensitivePayloadsDirectly"
    ]
  }
}
*/

import { getPermissionsForPersona, ForbiddenActions } from "./permissions.js";

export const PermissionsMeta = Object.freeze({
  layer: "PulseAIPermissionsLayer",
  role: "PERMISSIONS_ENGINE",
  version: "15-IMMORTAL",
  identity: "aiPermissionsEngine-v15-IMMORTAL",

  // --------------------------------------------------------------------------
  //  EVO — IMMORTAL-GRADE CAPABILITY MAP
  // --------------------------------------------------------------------------
  evo: Object.freeze({
    deterministic: true,
    driftProof: true,
    dualband: true,

    permissionAware: true,
    boundaryAware: true,
    personaAware: true,
    ownerAware: true,
    forbiddenAware: true,

    lineageAware: true,
    packetAware: true,
    windowAware: true,
    arteryAware: true,

    governorAware: true,
    genomeAware: true,
    safetyFrameAware: true,
    loggerAware: true,

    microPipeline: true,
    speedOptimized: true,
    readOnly: true,
    multiInstanceReady: true,

    epoch: "15-IMMORTAL"
  }),

  // --------------------------------------------------------------------------
  //  CONTRACT — IMMUTABLE SAFETY CONTRACT
  // --------------------------------------------------------------------------
  contract: Object.freeze({
    purpose:
      "Resolve permissions deterministically from persona, owner state, lineage, and universal forbidden actions.",

    never: Object.freeze([
      "mutate external systems",
      "introduce randomness",
      "invent permissions",
      "override forbidden actions",
      "override SafetyFrame decisions",
      "bypass persona boundaries",
      "bypass owner authority",
      "interpret symbolic meaning",
      "perform cognition",
      "log sensitive payloads directly",
      "emit persona or forbidden lists in snapshots"
    ]),

    always: Object.freeze([
      "respect universal forbidden actions",
      "respect persona permissions",
      "respect owner override",
      "respect lineage constraints",
      "remain deterministic",
      "remain read-only",
      "resolve capabilities canonically",
      "enforce dualband boundaries",
      "emit window-safe snapshots",
      "emit deterministic packets"
    ])
  }),

  boundaryReflex() {
    return "PermissionsEngine is a deterministic oracle — it never mutates state or performs cognition.";
  }
});

// ============================================================================
//  PACKET EMITTER — deterministic, permissions-scoped
// ============================================================================
function emitPermissionsPacket(type, payload) {
  return Object.freeze({
    meta: PermissionsMeta,
    packetType: `permissions-${type}`,
    packetId: `permissions-${type}-${Date.now()}`,
    timestamp: Date.now(),
    epoch: PermissionsMeta.evo.epoch,
    ...payload
  });
}

// ============================================================================
//  PREWARM — IMMORTAL-grade
// ============================================================================
export function prewarmPermissionsEngine({ trace = false } = {}) {
  const packet = emitPermissionsPacket("prewarm", {
    message: "Permissions engine prewarmed and lineage oracle aligned."
  });

  if (trace) console.log("[PermissionsEngine] prewarm", packet);
  return packet;
}

// ============================================================================
//  PERMISSIONS ENGINE — v15‑IMMORTAL
//  Deterministic resolver with lineage‑aware drift protection
// ============================================================================
export function createPermissionsEngine({ context = {} } = {}) {
  const userIsOwner = context.userIsOwner === true;
  const lineage = context.lineage || null;

  // --------------------------------------------------------------------------
  //  IMMORTAL: lineage‑aware permission drift correction
  // --------------------------------------------------------------------------
  function applyLineageDrift(basePerms) {
    if (!lineage || !Array.isArray(lineage.changes)) return basePerms;

    const drifted = new Set(lineage.changes.map(c => c.capability));

    const corrected = { ...basePerms };
    for (const cap of drifted) {
      if (corrected[cap] === true) corrected[cap] = false;
    }

    return corrected;
  }

  // --------------------------------------------------------------------------
  //  RESOLVE — persona → base permissions → lineage → forbidden actions
  // --------------------------------------------------------------------------
  function resolve(personaId) {
    const persona = personaId || "neutral";

    const base = getPermissionsForPersona(persona, userIsOwner);
    const lineageCorrected = applyLineageDrift(base);

    const merged = Object.freeze({
      ...lineageCorrected,
      ...ForbiddenActions
    });

    emitPermissionsPacket("resolve", {
      persona,
      ownerMode: userIsOwner === true,
      lineageAware: !!lineage
    });

    return merged;
  }

  // --------------------------------------------------------------------------
  //  CHECK — deterministic capability check
  // --------------------------------------------------------------------------
  function check(personaId, action) {
    const perms = resolve(personaId);
    const allowed = perms[action] === true;

    emitPermissionsPacket("check", {
      persona: personaId || "neutral",
      action,
      allowed
    });

    return allowed;
  }

  // --------------------------------------------------------------------------
  //  WINDOW‑SAFE SNAPSHOT — IMMORTAL-GRADE
  // --------------------------------------------------------------------------
  function snapshot() {
    const snap = Object.freeze({
      version: PermissionsMeta.version,
      epoch: PermissionsMeta.evo.epoch,
      lineageAware: !!lineage,
      ownerMode: userIsOwner === true
    });

    return emitPermissionsPacket("snapshot", snap);
  }

  // --------------------------------------------------------------------------
  //  IMMORTAL ENGINE EXPORT
  // --------------------------------------------------------------------------
  return Object.freeze({
    meta: PermissionsMeta,
    resolve,
    check,
    snapshot
  });
}

// ============================================================================
//  DUAL‑MODE EXPORTS (ESM + CommonJS)
// ============================================================================
if (typeof module !== "undefined") {
  module.exports = {
    PermissionsMeta,
    createPermissionsEngine,
    prewarmPermissionsEngine
  };
}
