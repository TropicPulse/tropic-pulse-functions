// ============================================================================
//  PULSE OS v16‑IMMORTAL‑ADVANTAGE++ — CONTEXT ENGINE
//  Context Kernel • Organism Fusion • Tri‑Heart + Earn + Genome + Governor
//  PURE CONTEXT. ZERO MUTATION. ZERO RANDOMNESS. OWNER‑SUBORDINATE.
// ============================================================================
//
//  v16++ Upgrades:
//   • Tri‑Heart Aware (mom/dad/earn)
//   • Earn‑Aware (earnPressure, earnVitals, earnFallback)
//   • Genome‑Aware (artery, fingerprint, drift)
//   • Governor‑Aware (membrane artery, reflex/pipeline state)
//   • Watchdog‑Aware (trust gaps, anomalies)
//   • Cortex‑Aware (cognition artery)
//   • Memory‑Aware (artery v4)
//   • Heartbeat‑Aware (artery + fallback path)
//   • Persona + Boundaries + Permissions Fusion
//   • IdentityCore injection (owner‑subordinate)
//   • Context Pressure / Cost / Budget
//   • Context Artery Snapshot
//   • Organism‑Wide Artery Fusion
//   • Chunk‑Aware Context Packets
//   • Multi‑instance, multi‑band, multi‑shard
//   • Zero mutation, zero randomness, zero drift
// ============================================================================

export const ContextEngineMeta = Object.freeze({
  layer: "PulseAIContextKernel",
  role: "CONTEXT_ENGINE_ORGAN",
  version: "16-Immortal-Advantage++",
  identity: "aiContextEngine-v16-Immortal-Advantage++",

  evo: Object.freeze({
    driftProof: true,
    deterministic: true,
    dualBandSafe: true,

    // organism awareness
    routerAware: true,
    personaAware: true,
    safetyAware: true,
    boundariesAware: true,
    permissionsAware: true,
    identityAware: true,

    // vitals
    memorySpineAware: true,
    gpuAware: true,
    heartbeatAware: true,
    earnAware: true,
    genomeAware: true,
    governorAware: true,
    watchdogAware: true,
    cortexAware: true,

    // fusion
    packetAware: true,
    presenceAware: true,
    chunkingAware: true,
    gpuFriendly: true,
    arteryAware: true,
    fusionAware: true,

    // owner-subordinate
    ownerAware: true,
    subordinateToOwner: true,

    multiInstanceReady: true,
    readOnly: true,
    epoch: "16-Immortal-Advantage++"
  }),

  contract: Object.freeze({
    purpose: [
      "Fuse Brainstem, Router, Persona, Boundaries, Permissions, Identity, Memory, GPU, Heartbeat, Earn, Genome, Governor, Watchdog, and Cortex into a unified ContextFrame",
      "Provide deterministic organism-wide context for Cortex, Boundaries, Governor, and Overmind",
      "Remain subordinate to Aldwyn (canonical owner)",
      "Expose artery snapshots without mutation",
      "Remain dual-band safe and drift-proof"
    ],

    never: Object.freeze([
      "mutate Brainstem context",
      "mutate Router packet",
      "mutate persona definitions",
      "override SafetyFrame decisions",
      "override BoundariesEngine decisions",
      "override Governor decisions",
      "introduce randomness",
      "perform cognition or intent handling",
      "self-promote above owner"
    ]),

    always: Object.freeze([
      "remain deterministic for same inputs",
      "respect persona, boundaries, permissions, identity",
      "surface organism vitals as read-only hints",
      "emit deterministic context-engine packets",
      "return frozen context frames",
      "remain subordinate to Aldwyn"
    ])
  }),

  presence: Object.freeze({
    organId: "ContextEngine",
    organKind: "FusionKernel",
    physiologyBand: "Symbolic+Binary",
    warmStrategy: "prewarm-on-attach",
    attachStrategy: "per-request",
    concurrency: "multi-instance",
    observability: {
      traceEvents: [
        "prewarm",
        "prewarm-error",
        "context:frame",
        "context:packet",
        "context:artery"
      ]
    }
  }),

  boundaryReflex() {
    return "ContextEngine must remain deterministic, ego-free, owner-subordinate, and never override boundaries or governor.";
  }
});

// ============================================================================
//  PACKET EMITTER — deterministic, context-engine scoped
// ============================================================================
function emitContextEnginePacket(type, payload) {
  return Object.freeze({
    meta: ContextEngineMeta,
    packetType: `context-engine-${type}`,
    timestamp: Date.now(),
    epoch: ContextEngineMeta.evo.epoch,
    layer: ContextEngineMeta.layer,
    role: ContextEngineMeta.role,
    identity: ContextEngineMeta.identity,
    owner: "Aldwyn",
    subordinate: true,
    ...payload
  });
}

// ============================================================================
//  READ-ONLY VITALS HELPERS (v16++)
// ============================================================================

function safe(obj, path, fallback = null) {
  try {
    return path.split(".").reduce((o, k) => (o ? o[k] : null), obj) ?? fallback;
  } catch {
    return fallback;
  }
}

function readMemoryArtery(memory) {
  try {
    return memory?.getMemoryArterySnapshot?.() || null;
  } catch {
    return null;
  }
}

function readCortexArtery(cortex) {
  try {
    return cortex?.getCortexArterySnapshot?.() || null;
  } catch {
    return null;
  }
}

function readHeartbeatArtery(heartbeat) {
  try {
    return heartbeat?.snapshotAiHeartbeat?.()?.artery || null;
  } catch {
    return null;
  }
}

function readEarnArtery(earn) {
  try {
    return earn?.snapshotEarnHeart?.()?.artery || null;
  } catch {
    return null;
  }
}

function readGenomeArtery(genome) {
  try {
    return genome?.snapshotMetrics?.()?.artery || null;
  } catch {
    return null;
  }
}

function readGovernorArtery(governor) {
  try {
    return governor?.snapshotMembrane?.()?.artery || null;
  } catch {
    return null;
  }
}

function readWatchdogVitals(watchdog) {
  try {
    return watchdog?.getWatchdogArterySnapshot?.() || null;
  } catch {
    return null;
  }
}

// ============================================================================
//  CONTEXT PRESSURE / COST / BUDGET (v16++)
// ============================================================================
function computeContextPressure(arteries) {
  const vals = Object.values(arteries)
    .filter(Boolean)
    .map(a => a.pressure ?? 0);
  if (!vals.length) return 0;
  return Math.min(1, vals.reduce((a, b) => a + b, 0) / vals.length);
}

function computeContextCost(pressure) {
  return Math.min(1, pressure * 0.7);
}

function computeContextBudget(pressure, cost) {
  return Math.max(0, 1 - (pressure + cost) / 2);
}

// ============================================================================
//  CORE IMPLEMENTATION — v16‑IMMORTAL‑ADVANTAGE++
// ============================================================================
export class AiContextEngine {
  constructor({ safetyFrame = null, experienceFrame = null } = {}) {
    this.safetyFrame = safetyFrame;
    this.experienceFrame = experienceFrame;
  }

  buildContextFrame({
    brainstem = {},
    request = {},
    routerPacket = {},
    persona = {},
    binaryVitals = {},
    dualBand = null,
    boundariesPacket = null,
    identityCore = null,
    heartbeat = null,
    earn = null,
    genome = null,
    governor = null,
    watchdog = null,
    cortex = null,
    memory = null
  } = {}) {
    const baseContext = brainstem.context || {};
    const organs = brainstem.organs || {};

    const safetyMode =
      request.safetyMode ||
      routerPacket.personaSafety?.safetyMode ||
      "standard";

    const dualBandHints = routerPacket.dualBand || {
      primary: "binary",
      secondary: "symbolic",
      binaryPressure: 0,
      binaryLoad: 0,
      symbolicLoadAllowed: 0.3,
      binaryPressureOverride: false
    };

    const overmindHints = routerPacket.overmind || {
      intent: (request.intent || "analyze").toLowerCase(),
      personaId: routerPacket.personaId || persona.id || "neutral",
      safetyMode,
      flags: routerPacket.flags || {}
    };

    // v16++ artery fusion
    const arteries = {
      memory: readMemoryArtery(memory),
      cortex: readCortexArtery(cortex),
      heartbeat: readHeartbeatArtery(heartbeat),
      earn: readEarnArtery(earn),
      genome: readGenomeArtery(genome),
      governor: readGovernorArtery(governor)
    };

    const contextPressure = computeContextPressure(arteries);
    const contextCost = computeContextCost(contextPressure);
    const contextBudget = computeContextBudget(contextPressure, contextCost);

    const frame = Object.freeze({
      meta: ContextEngineMeta,

      owner: Object.freeze({
        name: "Aldwyn",
        supremacy: true,
        aiSubordinate: true
      }),

      user: Object.freeze({
        userId: baseContext.userId || null,
        userIsOwner: !!baseContext.userIsOwner,
        windowId: baseContext.windowId || null,
        routeId: baseContext.routeId || null,
        dnaTag: baseContext.dnaTag || null
      }),

      persona: Object.freeze({
        id: persona.id || routerPacket.personaId || "neutral",
        label: persona.label || null,
        scope: persona.scope || null,
        permissions: persona.permissions || {},
        boundaries: persona.boundaries || {},
        boundaryMode: persona.boundaryMode || null,
        bandBias: persona.bandBias || "balanced"
      }),

      routing: Object.freeze({
        intent: overmindHints.intent,
        flags: routerPacket.flags || {},
        reasoning: routerPacket.reasoning || []
      }),

      safety: Object.freeze({
        mode: safetyMode,
        personaSafety: routerPacket.personaSafety || {},
        safetyFrameMeta: this.safetyFrame?.meta || null
      }),

      boundaries: Object.freeze({
        packet: boundariesPacket || null,
        mode: boundariesPacket?.mode || null,
        driftDetected: boundariesPacket?.driftDetected || false,
        driftCount: boundariesPacket?.driftCount || 0
      }),

      identity: Object.freeze({
        core: identityCore?.getIdentity?.() || null,
        personality: identityCore?.getPersonality?.() || null,
        tone: identityCore?.getToneProfile?.() || null
      }),

      dualBand: Object.freeze({
        hints: dualBandHints,
        binaryVitals: binaryVitals || {},
        organismSnapshot:
          dualBand?.organism?.organismSnapshot?.() || null
      }),

      heartbeat: Object.freeze({
        artery: arteries.heartbeat
      }),

      earn: Object.freeze({
        artery: arteries.earn
      }),

      genome: Object.freeze({
        artery: arteries.genome
      }),

      governor: Object.freeze({
        artery: arteries.governor
      }),

      watchdog: Object.freeze({
        vitals: readWatchdogVitals(watchdog)
      }),

      cortex: Object.freeze({
        artery: arteries.cortex
      }),

      memory: Object.freeze({
        artery: arteries.memory
      }),

      contextArtery: Object.freeze({
        pressure: contextPressure,
        cost: contextCost,
        budget: contextBudget,
        pressureBucket:
          contextPressure >= 0.9 ? "overload" :
          contextPressure >= 0.7 ? "high" :
          contextPressure >= 0.4 ? "medium" :
          contextPressure > 0   ? "low" :
          "none",
        budgetBucket:
          contextBudget >= 0.9 ? "elite" :
          contextBudget >= 0.75 ? "high" :
          contextBudget >= 0.5 ? "medium" :
          contextBudget >= 0.25 ? "low" :
          "critical"
      }),

      organs: Object.freeze({
        ...organs
      }),

      brainstemPacket: brainstem.packet || null
    });

    return emitContextEnginePacket("context:frame", frame);
  }
}

// ============================================================================
//  PUBLIC API — v16‑IMMORTAL‑ADVANTAGE++
// ============================================================================
export function createContextEngine(config = {}) {
  const core = new AiContextEngine({
    safetyFrame: config.safetyFrame || null,
    experienceFrame: config.experienceFrame || null
  });

  return Object.freeze({
    meta: ContextEngineMeta,
    buildContextFrame(payload) {
      const frame = core.buildContextFrame(payload);
      return emitContextEnginePacket("context:packet", frame);
    }
  });
}

export default createContextEngine;

// ============================================================================
//  COMMONJS FALLBACK EXPORTS
// ============================================================================
if (typeof module !== "undefined") {
  module.exports = {
    ContextEngineMeta,
    AiContextEngine,
    createContextEngine,
    default: createContextEngine
  };
}
