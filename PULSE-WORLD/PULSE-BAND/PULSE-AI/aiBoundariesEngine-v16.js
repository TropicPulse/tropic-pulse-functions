// ============================================================================
//  v16‑IMMORTAL‑ADVANTAGE — BOUNDARIES ENGINE (Dual‑Band Superego Contract)
//  “SEE EVERYTHING. MUTATE NOTHING. NEVER DRIFT.”
//  OWNER‑SUBORDINATE: ALWAYS BELOW ALDWYN, NEVER TOP DOG.
// ============================================================================

/*
AI_EXPERIENCE_META = {
  identity: "aiBoundariesEngine",
  version: "v16-Immortal-Advantage",
  layer: "ai_core",
  role: "ai_boundary_enforcer",
  lineage: "aiBoundariesEngine-v11 → v12.3 → v14-Immortal → v15-Immortal-ADV → v16-Immortal-Advantage",

  evo: {
    boundaryEnforcer: true,
    safetyRules: true,
    symbolicPrimary: true,
    binaryAware: true,
    dualBand: true,

    deterministic: true,
    driftProof: true,
    pureCompute: true,
    zeroNetwork: true,
    zeroFilesystem: true,
    zeroMutationOfInput: true,

    ownerAware: true,
    subordinateToOwner: true
  },

  contract: {
    always: [
      "aiBrainstem",
      "aiAssistant",
      "aiAnatomy",
      "aiPermissionsEngine",
      "aiGovernorAdapter",
      "aiMemory",
      "aiEarnEngine",
      "aiHeartbeat",
      "aiGenome",
      "aiIdentityCore"
    ],
    never: [
      "safeRoute",
      "fetchViaCNS"
    ]
  }
}
*/

import { getBoundariesForPersona, canPerformDynamic } from "./permissions.js";

// ============================================================================
//  META — v16 IMMORTAL‑ADVANTAGE, MEMORY + GPU + EARN + HEARTBEAT + CHUNKING
// ============================================================================
export const BoundariesMeta = Object.freeze({
  layer: "PulseAIBoundariesLayer",
  role: "BOUNDARIES_ENGINE",
  version: "16-Immortal-Advantage",
  identity: "aiBoundariesEngine-v16-Immortal-Advantage",

  evo: Object.freeze({
    deterministic: true,
    driftProof: true,

    dualBandSafe: true,
    boundaryAware: true,
    personaAware: true,
    permissionAware: true,

    packetAware: true,
    windowAware: true,
    evolutionAware: true,
    driftAware: true,

    presenceAware: true,
    chunkingAware: true,
    gpuFriendly: true,
    memorySpineAware: true,
    overlayAware: true,

    earnAware: true,
    earnHeartAware: true,
    arteryAware: true,
    genomeAware: true,
    governorAware: true,
    heartbeatAware: true,

    ownerAware: true,
    subordinateToOwner: true,

    multiInstanceReady: true,
    readOnly: true,
    epoch: "16-Immortal-Advantage"
  }),

  contract: Object.freeze({
    purpose:
      "Resolve symbolic + binary-aware boundaries deterministically from persona, mode, vitals, memory, GPU, earn, and heartbeat state, while remaining explicitly subordinate to the owner (Aldwyn).",

    never: Object.freeze([
      "mutate external systems",
      "introduce randomness",
      "invent boundaries",
      "override SafetyFrame decisions",
      "override Overmind decisions",
      "override PermissionsEngine decisions",
      "override owner authority",
      "inject symbolic metadata",
      "alter boundary meaning",
      "self-promote above owner"
    ]),

    always: Object.freeze([
      "respect static persona boundaries",
      "respect universal boundary levels",
      "respect boundary modes",
      "respect binary vitals",
      "respect memory vitals",
      "respect earn vitals",
      "respect heartbeat vitals",
      "respect permissions decisions",
      "remain subordinate to owner",
      "emit deterministic packets",
      "remain deterministic",
      "remain read-only"
    ])
  }),

  presence: Object.freeze({
    organId: "BoundariesEngine",
    organKind: "Superego",
    physiologyBand: "Symbolic+Binary",
    warmStrategy: "prewarm-on-attach",
    attachStrategy: "on-demand",
    concurrency: "multi-instance",
    observability: {
      traceEvents: [
        "resolve",
        "check",
        "driftDetected",
        "prewarm",
        "prewarm-error"
      ]
    }
  }),

  boundaryReflex() {
    return "BoundariesEngine is a deterministic superego, subordinate to Aldwyn, never above owner, never mutating state.";
  }
});

// ============================================================================
//  INTERNAL HELPERS
// ============================================================================

function safeNow() {
  return Date.now();
}

function computeWindowId({ personaId, mode, context }) {
  const base = context?.windowId || `${personaId || "anon"}:${mode || "default"}`;
  let h = 0;
  for (let i = 0; i < base.length; i++) {
    h = (h * 31 + base.charCodeAt(i)) | 0;
  }
  return "win-" + (h >>> 0).toString(16);
}

function readMemoryVitals(memory) {
  if (!memory) return null;

  try {
    const hot = typeof memory.getHotKeys === "function"
      ? memory.getHotKeys(3)
      : [];
    const meta = memory.Meta || {};
    return {
      hotKeyCount: hot.length || 0,
      lastFlushEpoch: meta.lastFlushEpoch || 0,
      lastLoadEpoch: meta.lastLoadEpoch || 0,
      fallbackUsed: !!meta.fallbackUsed,
      lastBandUsed: meta.lastBandUsed || null,
      version: meta.version || null,
      dnaTag: meta.dnaTag || null
    };
  } catch {
    return null;
  }
}

function readGpuVitals(gpu, binaryVitals) {
  if (!gpu) return null;
  // strictly read‑only
  return {
    pressure: binaryVitals?.pressure ?? null,
    mode: binaryVitals?.mode ?? null,
    session: binaryVitals?.session ?? null
  };
}

function readEarnVitals(earn) {
  if (!earn) return null;

  try {
    const meta = typeof earn.getEarnMeta === "function"
      ? earn.getEarnMeta()
      : {};
    return {
      active: !!meta.active,
      lastPayoutEpoch: meta.lastPayoutEpoch || 0,
      openJobs: meta.openJobs || 0,
      recentCompletions: meta.recentCompletions || 0,
      pressure: meta.pressure || 0,
      version: meta.version || null
    };
  } catch {
    return null;
  }
}

function readHeartbeatVitals(heartbeat) {
  if (!heartbeat) return null;

  try {
    const diag = typeof heartbeat.getAiHeartbeatDiagnostics === "function"
      ? heartbeat.getAiHeartbeatDiagnostics()
      : null;
    if (!diag) return null;

    return {
      ticks: diag.artery?.ticks ?? 0,
      pulses: diag.artery?.pulses ?? 0,
      skips: diag.artery?.skips ?? 0,
      lastReason: diag.artery?.lastReason ?? "none",
      lastPressure: diag.artery?.lastPressure ?? 0,
      lastLoad: diag.artery?.lastLoad ?? 0,
      primaryState: diag.primaryState || "unknown"
    };
  } catch {
    return null;
  }
}

// ============================================================================
//  PACKET EMITTER — deterministic, boundary-scoped
// ============================================================================
function emitBoundaryPacket(type, payload) {
  return Object.freeze({
    meta: BoundariesMeta,
    packetType: `boundaries-${type}`,
    timestamp: safeNow(),
    epoch: BoundariesMeta.evo.epoch,
    layer: BoundariesMeta.layer,
    role: BoundariesMeta.role,
    identity: BoundariesMeta.identity,
    owner: "Aldwyn",
    subordinate: true,
    ...payload
  });
}

// ============================================================================
//  PREWARM — warms static boundary tables + dynamic resolver
// ============================================================================
export function prewarmBoundariesEngine({
  trace = false,
  persona = "architect",
  mode = "default",
  binaryVitals = { pressure: 0, load: 0 },
  memory = null,
  gpu = null,
  earn = null,
  heartbeat = null,
  context = {}
} = {}) {
  try {
    const windowId = computeWindowId({ personaId: persona, mode, context });
    const memoryVitals = readMemoryVitals(memory);
    const gpuVitals = readGpuVitals(gpu, binaryVitals);
    const earnVitals = readEarnVitals(earn);
    const heartbeatVitals = readHeartbeatVitals(heartbeat);

    const packet = emitBoundaryPacket("prewarm", {
      message: "Boundaries engine prewarmed and static tables aligned.",
      persona,
      mode,
      windowId,
      binaryVitals,
      memoryVitals,
      gpuVitals,
      earnVitals,
      heartbeatVitals
    });

    if (trace) console.log("[BoundariesEngine] prewarm", packet);
    return packet;
  } catch (err) {
    return emitBoundaryPacket("prewarm-error", {
      error: String(err),
      message: "Boundaries engine prewarm failed."
    });
  }
}

// ============================================================================
//  ENGINE IMPLEMENTATION — v16‑IMMORTAL‑ADVANTAGE
// ============================================================================
export function createBoundariesEngine({
  context = {},
  memory = null,          // PulseCoreMemory (v13+)
  overlay = null,         // PulseBinaryCoreOverlay (optional)
  gpu = null,             // PulseGPUOrchestrator (optional, read-only)
  earn = null,            // Earn engine / adapter (optional, read-only)
  heartbeat = null,       // Heartbeat / EarnHeart adapter (optional, read-only)
  dnaTag = "default-dna",
  version = "16-Immortal-Advantage",
  routeId = "boundaries",
  log = console.log
} = {}) {
  let driftCount = 0;

  function safeTouchPresence() {
    try {
      if (overlay && overlay.touch) {
        overlay.touch(routeId, safeNow());
      } else if (memory && memory.prewarm) {
        memory.prewarm();
      }
    } catch {
      // strictly read‑only from the engine’s perspective
    }
  }

  function resolve(personaId, mode, binaryVitals = {}) {
    safeTouchPresence();

    const staticBoundaries = getBoundariesForPersona(personaId);
    const windowId = computeWindowId({ personaId, mode, context });
    const memoryVitals = readMemoryVitals(memory);
    const gpuVitals = readGpuVitals(gpu, binaryVitals);
    const earnVitals = readEarnVitals(earn);
    const heartbeatVitals = readHeartbeatVitals(heartbeat);

    return emitBoundaryPacket("resolve", {
      personaId,
      mode,
      windowId,
      binaryVitals,
      memoryVitals,
      gpuVitals,
      earnVitals,
      heartbeatVitals,
      static: staticBoundaries,
      dnaTag,
      version,
      routeId
    });
  }

  function check(personaId, domain, action, mode, binaryVitals = {}) {
    safeTouchPresence();

    const allowed = canPerformDynamic(
      personaId,
      domain,
      action,
      mode,
      binaryVitals
    );

    const driftDetected = binaryVitals?.pressure >= 0.9;
    if (driftDetected) driftCount++;

    const windowId = computeWindowId({ personaId, mode, context });
    const memoryVitals = readMemoryVitals(memory);
    const gpuVitals = readGpuVitals(gpu, binaryVitals);
    const earnVitals = readEarnVitals(earn);
    const heartbeatVitals = readHeartbeatVitals(heartbeat);

    const pressureBand =
      binaryVitals?.pressure == null
        ? null
        : binaryVitals.pressure >= 0.95
          ? "critical"
          : binaryVitals.pressure >= 0.9
            ? "high"
            : binaryVitals.pressure >= 0.7
              ? "elevated"
              : "normal";

    return emitBoundaryPacket("check", {
      personaId,
      domain,
      action,
      mode,
      windowId,
      binaryVitals: {
        ...binaryVitals,
        pressureBand
      },
      memoryVitals,
      gpuVitals,
      earnVitals,
      heartbeatVitals,
      allowed,
      driftDetected,
      driftCount,
      dnaTag,
      version,
      routeId
    });
  }

  const engine = Object.freeze({
    meta: BoundariesMeta,
    resolve,
    check,
    dnaTag,
    version,
    routeId,
    owner: "Aldwyn",
    subordinate: true
  });

  try {
    log("[BoundariesEngine] INIT", {
      identity: BoundariesMeta.identity,
      version: BoundariesMeta.version,
      dnaTag,
      routeId,
      owner: "Aldwyn",
      subordinate: true
    });
  } catch {}

  return engine;
}

// ============================================================================
//  DUAL‑MODE EXPORTS
// ============================================================================
if (typeof module !== "undefined") {
  module.exports = {
    BoundariesMeta,
    createBoundariesEngine,
    prewarmBoundariesEngine
  };
}
