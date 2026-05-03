// ============================================================================
//  v14‑IMMORTAL‑Presence — BOUNDARIES ENGINE (Dual‑Band Superego Contract)
//  “SEE EVERYTHING. MUTATE NOTHING. NEVER DRIFT.”
// ============================================================================

/*
AI_EXPERIENCE_META = {
  identity: "aiBoundariesEngine",
  version: "v14-IMMORTAL",
  layer: "ai_core",
  role: "ai_boundary_enforcer",
  lineage: "aiBoundariesEngine-v11 → v12.3 → v14-IMMORTAL",

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
    zeroMutationOfInput: true
  },

  contract: {
    always: [
      "aiBrainstem",
      "aiAssistant",
      "aiAnatomy"
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
//  META — v14 IMMORTAL, MEMORY + GPU + CHUNKING AWARE
// ============================================================================
export const BoundariesMeta = Object.freeze({
  layer: "PulseAIBoundariesLayer",
  role: "BOUNDARIES_ENGINE",
  version: "14-IMMORTAL",
  identity: "aiBoundariesEngine-v14-IMMORTAL",

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

    multiInstanceReady: true,
    readOnly: true,
    epoch: "14-IMMORTAL"
  }),

  contract: Object.freeze({
    purpose:
      "Resolve symbolic + binary-aware boundaries deterministically from persona, mode, vitals, and memory state.",

    never: Object.freeze([
      "mutate external systems",
      "introduce randomness",
      "invent boundaries",
      "override SafetyFrame decisions",
      "override Overmind decisions",
      "inject symbolic metadata",
      "alter boundary meaning"
    ]),

    always: Object.freeze([
      "respect static persona boundaries",
      "respect universal boundary levels",
      "respect boundary modes",
      "respect binary vitals",
      "respect memory vitals",
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
  })
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
  // We stay read‑only: no routing, only reflect what we know.
  return {
    pressure: binaryVitals?.pressure ?? null,
    mode: binaryVitals?.mode ?? null,
    session: binaryVitals?.session ?? null
  };
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
  context = {}
} = {}) {
  try {
    const windowId = computeWindowId({ personaId: persona, mode, context });
    const memoryVitals = readMemoryVitals(memory);
    const gpuVitals = readGpuVitals(gpu, binaryVitals);

    const packet = emitBoundaryPacket("prewarm", {
      message: "Boundaries engine prewarmed and static tables aligned.",
      persona,
      mode,
      windowId,
      binaryVitals,
      memoryVitals,
      gpuVitals
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
//  ENGINE IMPLEMENTATION — v14‑IMMORTAL
// ============================================================================
export function createBoundariesEngine({
  context = {},
  memory = null,          // PulseCoreMemory (v13+)
  overlay = null,         // PulseBinaryCoreOverlay (optional)
  gpu = null,             // PulseGPUOrchestrator (optional, read-only)
  dnaTag = "default-dna",
  version = "14-IMMORTAL",
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

    return emitBoundaryPacket("resolve", {
      personaId,
      mode,
      windowId,
      binaryVitals,
      memoryVitals,
      gpuVitals,
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
    routeId
  });

  try {
    log("[BoundariesEngine] INIT", {
      identity: BoundariesMeta.identity,
      version: BoundariesMeta.version,
      dnaTag,
      routeId
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
