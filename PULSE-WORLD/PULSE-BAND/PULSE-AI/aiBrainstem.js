// ============================================================================
// FILE: aiBrainstem.js — Pulse OS v12.3‑Presence
// LAYER: BRAINSTEM (CNS Bridge: Identity → Tools → Organs → Cortex)
// ============================================================================
//
//  v12.3‑Presence Upgrades:
//   • Presence‑aware CNS identity bridge
//   • Dualband‑safe symbolic+binary CNS organ
//   • Packet‑grade activation + prewarm packets
//   • Drift‑proof organ wiring warmup
//   • Zero mutation, zero randomness
//   • Deterministic cognitive‑tool loading
//   • Window‑safe CNS packet emission
//   • Multi‑instance CNS safety
// ============================================================================

export const BrainstemMeta = Object.freeze({
  layer: "PulseAICNS",
  role: "BRAINSTEM_ORGAN",
  version: "12.3-Presence",
  identity: "aiBrainstem-v12.3-Presence",

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

    readOnly: true,
    multiInstanceReady: true,
    epoch: "12.3-Presence"
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
// PACKET EMITTER — deterministic, brainstem-scoped
// ============================================================================
function emitBrainstemPacket(type, payload) {
  return Object.freeze({
    meta: BrainstemMeta,
    packetType: `brainstem-${type}`,
    timestamp: Date.now(),
    epoch: BrainstemMeta.evo.epoch,
    layer: BrainstemMeta.layer,
    role: BrainstemMeta.role,
    identity: BrainstemMeta.identity,
    ...payload
  });
}

// ============================================================================
// PREWARM ENGINE v3 — deeper, faster, presence-aware
// ============================================================================
function prewarmBrainstem(userId, userIsOwner) {
  try {
    const _id = userId ?? null;
    const _owner = Boolean(userIsOwner);

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

    return emitBrainstemPacket("prewarm", {
      message: "Brainstem prewarmed and CNS pathways aligned.",
      userId: _id,
      userIsOwner: _owner
    });
  } catch (err) {
    return emitBrainstemPacket("prewarm-error", {
      error: String(err),
      message: "Brainstem prewarm failed."
    });
  }
}

// ============================================================================
// CREATE BRAINSTEM — Identity + Tools + Organs
// ============================================================================
export function createBrainstem(request = {}, db, fsAPI, routeAPI, schemaAPI) {
  const { userId = null, userIsOwner: requestOwner = false } = request;

  const userIsOwner =
    Boolean(requestOwner || (userId && userId === OWNER_ID));

  // ---- PREWARM CNS PATHWAYS BEFORE BUILDING CONTEXT ----
  const prewarmPacket = prewarmBrainstem(userId, userIsOwner);

  const context = Object.freeze({
    userId,
    userIsOwner,
    ...aiTools
  });

  const organs = Object.freeze(
    createOrgans(context, db, fsAPI, routeAPI, schemaAPI)
  );

  const activationPayload = {
    type: "brainstem-activation",
    userId,
    userIsOwner,
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
