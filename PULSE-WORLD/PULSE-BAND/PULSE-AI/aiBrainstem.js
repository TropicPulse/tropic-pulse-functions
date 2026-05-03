// ============================================================================
// FILE: aiBrainstem.js — Pulse OS v14‑IMMORTAL
// LAYER: BRAINSTEM (CNS Bridge: Identity → Tools → Organs → Cortex)
// ============================================================================
//
//  v14‑IMMORTAL Upgrades:
//   • Presence‑aware CNS identity bridge (windowId + routeId)
//   • Dualband‑safe symbolic+binary CNS organ
//   • Packet‑grade activation + prewarm packets
//   • Drift‑proof organ wiring warmup
//   • Zero mutation, zero randomness
//   • Deterministic cognitive‑tool loading
//   • Memory + GPU + Boundaries‑aware (read‑only)
//   • Multi‑instance CNS safety
// ============================================================================
/*
AI_EXPERIENCE_META = {
  identity: "aiBrainstem",
  version: "v14-IMMORTAL",
  layer: "ai_core",
  role: "ai_brainstem",
  lineage: "aiBrainstem-v9 → v11-Evo → v12.3-Presence → v14-IMMORTAL",

  evo: {
    brainstem: true,
    identityBridge: true,
    ownershipBridge: true,
    organLoader: true,
    dualBand: true,
    symbolicPrimary: true,
    binaryAware: true,

    deterministic: true,
    driftProof: true,
    pureCompute: true,
    zeroNetwork: true,
    zeroFilesystem: true,
    zeroMutationOfInput: true
  },

  contract: {
    always: [
      "aiAnatomy",
      "aiBoundariesEngine",
      "aiBinaryOrganRegistry",
      "ai-v11-evo"
    ],
    never: [
      "safeRoute",
      "fetchViaCNS"
    ]
  }
}
*/

export const BrainstemMeta = Object.freeze({
  layer: "PulseAICNS",
  role: "BRAINSTEM_ORGAN",
  version: "14-IMMORTAL",
  identity: "aiBrainstem-v14-IMMORTAL",

  evo: Object.freeze({
    driftProof: true,
    deterministic: true,
    dualBandSafe: true,
    binaryAware: true,
    symbolicAware: true,
    identitySafe: true,
    organismAware: true,
    cognitiveAware: true,
    packetAware: true,
    prewarmAware: true,

    presenceAware: true,
    chunkingAware: true,
    gpuFriendly: true,
    memorySpineAware: true,
    overlayAware: true,
    boundariesAware: true,

    readOnly: true,
    multiInstanceReady: true,
    epoch: "14-IMMORTAL"
  }),

  contract: Object.freeze({
    purpose:
      "Bridge identity, ownership, cognitive tools, and organ wiring into the CNS before Cortex activation.",

    never: Object.freeze([
      "mutate external systems",
      "introduce randomness",
      "override persona logic",
      "override permissions logic",
      "override boundaries logic",
      "override router logic",
      "override cortex logic",
      "leak identity beyond userId/owner flag",
      "perform cognition",
      "perform intent logic"
    ]),

    always: Object.freeze([
      "attach identity deterministically",
      "attach ownership deterministically",
      "load cognitive tools from aiTools.js",
      "wire organs deterministically",
      "emit deterministic brainstem packets",
      "remain read-only",
      "remain drift-proof",
      "remain deterministic",
      "remain pulse-safe",
      "prewarm cognitive pathways"
    ])
  }),

  presence: Object.freeze({
    organId: "Brainstem",
    organKind: "CNS",
    physiologyBand: "Symbolic+Binary",
    warmStrategy: "prewarm-on-attach",
    attachStrategy: "on-demand",
    concurrency: "multi-instance",
    observability: {
      traceEvents: [
        "prewarm",
        "prewarm-error",
        "activation"
      ]
    }
  })
});

import { OWNER_ID } from "./persona.js";
import { createOrgans } from "./createOrgans.js";
import * as aiTools from "./aiTools.js";

// ============================================================================
// INTERNAL HELPERS
// ============================================================================
function safeNow() {
  return Date.now();
}

function computeWindowId({ userId, userIsOwner, routeId }) {
  const base = `${userId || "anon"}:${userIsOwner ? "owner" : "guest"}:${routeId || "cns"}`;
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

function readGpuVitals(gpu) {
  if (!gpu) return null;
  return {
    identity: gpu.GPUOrchestratorMeta?.identity || null,
    version: gpu.GPUOrchestratorMeta?.version || null
  };
}

// ============================================================================
// PACKET EMITTER — deterministic, brainstem-scoped
// ============================================================================
function emitBrainstemPacket(type, payload) {
  return Object.freeze({
    meta: BrainstemMeta,
    packetType: `brainstem-${type}`,
    timestamp: safeNow(),
    epoch: BrainstemMeta.evo.epoch,
    layer: BrainstemMeta.layer,
    role: BrainstemMeta.role,
    identity: BrainstemMeta.identity,
    ...payload
  });
}

// ============================================================================
// PREWARM ENGINE v4 — presence + memory + gpu aware
// ============================================================================
function prewarmBrainstem({
  userId,
  userIsOwner,
  routeId,
  memory,
  gpu,
  trace = false
} = {}) {
  try {
    const _id = userId ?? null;
    const _owner = Boolean(userIsOwner);
    const windowId = computeWindowId({ userId: _id, userIsOwner: _owner, routeId });

    // Warm cognitive tools
    for (const key of Object.keys(aiTools)) {
      const _ = aiTools[key];
    }

    // Warm encoder
    if (aiTools.encode) aiTools.encode("{}");

    // Warm organ wiring (null adapters)
    createOrgans(
      { userId: _id, userIsOwner: _owner, ...aiTools },
      null,
      null,
      null,
      null
    );

    const memoryVitals = readMemoryVitals(memory);
    const gpuVitals = readGpuVitals(gpu);

    const packet = emitBrainstemPacket("prewarm", {
      message: "Brainstem prewarmed and CNS pathways aligned.",
      userId: _id,
      userIsOwner: _owner,
      windowId,
      routeId,
      memoryVitals,
      gpuVitals
    });

    if (trace) console.log("[Brainstem] prewarm", packet);
    return packet;
  } catch (err) {
    return emitBrainstemPacket("prewarm-error", {
      error: String(err),
      message: "Brainstem prewarm failed."
    });
  }
}

// ============================================================================
// CREATE BRAINSTEM — Identity + Tools + Organs (v14‑IMMORTAL)
// ============================================================================
export function createBrainstem(
  request = {},
  db,
  fsAPI,
  routeAPI,
  schemaAPI,
  {
    memory = null,      // PulseCoreMemory v13+
    overlay = null,     // PulseBinaryOverlay (optional, read-only touch)
    gpu = null,         // GPUOrchestrator (optional, read-only)
    dnaTag = "default-dna",
    routeId = "brainstem",
    tracePrewarm = false,
    log = console.log
  } = {}
) {
  const { userId = null, userIsOwner: requestOwner = false } = request;

  const userIsOwner =
    Boolean(requestOwner || (userId && userId === OWNER_ID));

  // Presence‑touch (read‑only semantics)
  try {
    if (overlay && overlay.touch) {
      overlay.touch(routeId, safeNow());
    } else if (memory && memory.prewarm) {
      memory.prewarm();
    }
  } catch {
    // ignore, brainstem stays read‑only
  }

  const prewarmPacket = prewarmBrainstem({
    userId,
    userIsOwner,
    routeId,
    memory,
    gpu,
    trace: tracePrewarm
  });

  const windowId = computeWindowId({ userId, userIsOwner, routeId });

  const context = Object.freeze({
    userId,
    userIsOwner,
    windowId,
    dnaTag,
    routeId,
    memory,
    overlay,
    gpu,
    ...aiTools
  });

  const organs = Object.freeze(
    createOrgans(context, db, fsAPI, routeAPI, schemaAPI)
  );

  const activationPayload = {
    type: "brainstem-activation",
    userId,
    userIsOwner,
    windowId,
    routeId,
    dnaTag,
    toolCount: Object.keys(aiTools).length,
    prewarm: prewarmPacket
  };

  const json = JSON.stringify(activationPayload);
  const bits = aiTools.encode ? aiTools.encode(json) : null;

  const packet = emitBrainstemPacket("activation", {
    ...activationPayload,
    bits,
    bitLength: bits ? bits.length : 0
  });

  try {
    log("[Brainstem] INIT", {
      identity: BrainstemMeta.identity,
      version: BrainstemMeta.version,
      userId,
      userIsOwner,
      windowId,
      routeId,
      dnaTag
    });
  } catch {}

  return Object.freeze({
    meta: BrainstemMeta,
    context,
    organs,
    packet
  });
}

// ============================================================================
// EXPORTS
// ============================================================================
export default createBrainstem;

if (typeof module !== "undefined") {
  module.exports = {
    BrainstemMeta,
    createBrainstem,
    default: createBrainstem
  };
}
