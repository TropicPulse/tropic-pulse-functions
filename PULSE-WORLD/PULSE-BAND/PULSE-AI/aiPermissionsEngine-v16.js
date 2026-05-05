// ============================================================================
//  PULSE OS v16‑IMMORTAL++ — PERMISSIONS ENGINE
//  Dual‑Band Safety Contract • Deterministic • Drift‑Proof • Trust‑Aware
//  PURE CONTRACT ORACLE. ZERO MUTATION. ZERO RANDOMNESS.
// ============================================================================

/*
AI_EXPERIENCE_META = {
  identity: "aiPermissionsEngine",
  version: "v16-Immortal++",
  layer: "ai_core",
  role: "permissions_engine",
  lineage: "aiPermissionsEngine-v11 → v15-Immortal → v16-Immortal++",

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
    zeroMutationOfInput: true,

    permissionAware: true,
    boundaryAware: true,
    personaAware: true,
    ownerAware: true,
    forbiddenAware: true,

    lineageAware: true,
    packetAware: true,
    windowAware: true,
    arteryAware: true,
    capabilityArteryAware: true,
    trustFabricAware: true,
    juryAware: true,
    safetyFrameAware: true,
    governorAware: true,
    genomeAware: true,
    loggerAware: true,

    microPipeline: true,
    speedOptimized: true,
    readOnly: true,
    multiInstanceReady: true
  },

  contract: {
    always: [
      "aiGovernorAdapter",
      "aiBoundariesEngine",
      "aiBrainstem",
      "aiSafetyFrame",
      "aiLoggerAdapter",
      "aiGenome",
      "aiIdentityCore",
      "aiTrustFabric",
      "aiJuryFrame"
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
  version: "16-Immortal++",
  identity: "aiPermissionsEngine-v16-Immortal++",

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
    capabilityArteryAware: true,
    trustFabricAware: true,
    juryAware: true,
    safetyFrameAware: true,
    governorAware: true,
    genomeAware: true,
    loggerAware: true,

    microPipeline: true,
    speedOptimized: true,
    readOnly: true,
    multiInstanceReady: true,

    epoch: "16-Immortal++"
  }),

  contract: Object.freeze({
    purpose:
      "Resolve permissions deterministically from persona, owner state, lineage, universal forbidden actions, and trust fabric signals.",

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
      "respect trust fabric risk signals",
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
//  INTERNAL HELPERS
// ============================================================================
function bucketLevel(v) {
  if (v >= 0.9) return "elite";
  if (v >= 0.75) return "high";
  if (v >= 0.5) return "medium";
  if (v >= 0.25) return "low";
  return "critical";
}

function extractTrustSignals(trustArtery = {}) {
  return {
    honeypotRisk: trustArtery?.honeypotRisk ?? 0,
    dominanceRisk: trustArtery?.dominanceRisk ?? 0,
    anomalyScore: trustArtery?.anomalyScore ?? 0
  };
}

// ============================================================================
//  PACKET EMITTER — deterministic, permissions-scoped
// ============================================================================
function emitPermissionsPacket(type, payload) {
  return Object.freeze({
    meta: {
      version: PermissionsMeta.version,
      epoch: PermissionsMeta.evo.epoch,
      identity: PermissionsMeta.identity
    },
    packetType: `permissions-${type}`,
    timestamp: Date.now(),
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
//  PERMISSIONS ENGINE — v16‑IMMORTAL++
// ============================================================================
export function createPermissionsEngine({
  context = {},
  trustFabric = null,
  juryFrame = null
} = {}) {
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

    const packet = emitPermissionsPacket("resolve", {
      persona,
      ownerMode: userIsOwner === true,
      lineageAware: !!lineage
    });

    trustFabric?.recordPermissionsResolve?.({
      persona,
      ownerMode: userIsOwner === true,
      lineageAware: !!lineage
    });

    juryFrame?.recordEvidence?.("permissions-resolve", packet);

    return merged;
  }

  // --------------------------------------------------------------------------
  //  CHECK — deterministic capability check
  // --------------------------------------------------------------------------
  function check(personaId, action, { trustArtery = {} } = {}) {
    const perms = resolve(personaId);
    const allowed = perms[action] === true;

    const trust = extractTrustSignals(trustArtery);
    const risk =
      Math.max(trust.honeypotRisk, trust.dominanceRisk, trust.anomalyScore);

    const packet = emitPermissionsPacket("check", {
      persona: personaId || "neutral",
      action,
      allowed,
      trustRisk: risk
    });

    trustFabric?.recordPermissionsCheck?.({
      persona: personaId || "neutral",
      action,
      allowed,
      trustRisk: risk
    });

    juryFrame?.recordEvidence?.("permissions-check", packet);

    return allowed;
  }

  // --------------------------------------------------------------------------
  //  CAPABILITY ARTERY SNAPSHOT — window-safe, aggregate only
  // --------------------------------------------------------------------------
  function capabilityArterySnapshot(personaId) {
    const persona = personaId || "neutral";
    const perms = resolve(persona);

    let allowedCount = 0;
    let forbiddenCount = 0;

    for (const [k, v] of Object.entries(perms)) {
      if (k in ForbiddenActions) {
        if (ForbiddenActions[k] === false) forbiddenCount += 1;
      } else if (v === true) {
        allowedCount += 1;
      }
    }

    const budget = Math.max(0, Math.min(1, allowedCount / (allowedCount + forbiddenCount || 1)));
    const bucket = bucketLevel(budget);

    const artery = Object.freeze({
      organism: {
        budget,
        budgetBucket: bucket
      },
      persona: {
        id: persona,
        ownerMode: userIsOwner === true
      },
      forbidden: {
        count: forbiddenCount
      },
      meta: {
        version: PermissionsMeta.version,
        epoch: PermissionsMeta.evo.epoch,
        identity: PermissionsMeta.identity
      }
    });

    const packet = emitPermissionsPacket("artery", {
      persona,
      organismBudget: budget,
      budgetBucket: bucket
    });

    trustFabric?.recordPermissionsArtery?.({
      persona,
      budget,
      bucket
    });

    juryFrame?.recordEvidence?.("permissions-artery", packet);

    return artery;
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

    const packet = emitPermissionsPacket("snapshot", snap);

    trustFabric?.recordPermissionsSnapshot?.({
      ownerMode: userIsOwner === true,
      lineageAware: !!lineage
    });

    juryFrame?.recordEvidence?.("permissions-snapshot", packet);

    return packet;
  }

  // --------------------------------------------------------------------------
  //  IMMORTAL ENGINE EXPORT
  // --------------------------------------------------------------------------
  return Object.freeze({
    meta: PermissionsMeta,
    resolve,
    check,
    snapshot,
    capabilityArterySnapshot
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
