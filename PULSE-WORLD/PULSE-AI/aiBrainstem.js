// ============================================================================
// FILE: aiBrainstem.js — Pulse OS v11.3‑EVO
// LAYER: BRAINSTEM (CNS Bridge: Identity → Tools → Organs → Cortex)
// ============================================================================
//
// NEW (v11.3‑EVO):
//   • Prewarm Engine v2 (faster, deeper, deterministic)
//   • Packet‑aware brainstem activation
//   • Dualband‑aware identity bridge
//   • Window‑safe brainstem packet
//   • Drift‑proof organ wiring warmup
//   • Zero mutation, zero randomness
// ============================================================================

export const BrainstemMeta = Object.freeze({
  layer: "PulseAICNS",
  role: "BRAINSTEM_ORGAN",
  version: "11.3-EVO",
  identity: "aiBrainstem-v11.3-EVO",

  evo: Object.freeze({
    driftProof: true,
    deterministic: true,
    dualband: true,
    binaryAware: true,
    symbolicAware: true,
    identitySafe: true,
    readOnly: true,
    organismAware: true,
    cognitiveAware: true,
    packetAware: true,
    prewarmAware: true,
    multiInstanceReady: true,
    epoch: "v11.3-EVO"
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
    ...payload
  });
}

// ============================================================================
// PREWARM ENGINE v2 — deeper, faster, deterministic
// ============================================================================
function prewarmBrainstem(userId, userIsOwner) {
  try {
    // Identity warmup
    const _id = userId ?? null;
    const _owner = Boolean(userIsOwner);

    // Tool warmup
    for (const t of Object.keys(aiTools)) {
      const _ = aiTools[t];
    }

    // Encoder warmup
    if (aiTools.encode) {
      aiTools.encode("{}");
    }

    // Organ wiring warmup (null adapters)
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

  const userIsOwner = Boolean(requestOwner || (userId && userId === OWNER_ID));

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
