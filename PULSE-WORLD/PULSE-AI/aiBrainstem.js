// ============================================================================
// FILE: tropic-pulse-functions/apps/PULSE-AI/aiBrainstem.js
// LAYER: BRAINSTEM (CNS Bridge: Identity → Tools → Organs → Cortex)
// ============================================================================
//
// NEW (v11‑EVO‑PREWARM):
//   • Cognitive Prewarm Engine
//   • Pre-initialize identity, ownership, tools, organ wiring, encoder
//   • Zero mutation, zero drift, zero autonomy
//   • Pure deterministic warm-up of CNS pathways
// ============================================================================

export const BrainstemMeta = Object.freeze({
  layer: "PulseAICNS",
  role: "BRAINSTEM_ORGAN",
  version: "11.0-EVO",
  identity: "aiBrainstem-v11-EVO",

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
    multiInstanceReady: true,
    prewarmAware: true,        // ← NEW
    epoch: "v11-EVO"
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
      "prewarm cognitive pathways"   // ← NEW
    ])
  })
});

import { OWNER_ID } from "./persona.js";
import { createOrgans } from "./createOrgans.js";
import * as aiTools from "./aiTools.js";

// ============================================================================
//  COGNITIVE PREWARM ENGINE (v11‑EVO)
//  - Warms internal CNS pathways used on every pulse
//  - Does NOT mutate external systems
//  - Does NOT perform cognition
//  - Pure deterministic warm-up
// ============================================================================
function prewarmBrainstem(userId, userIsOwner) {
  try {
    // Prewarm identity pathway
    const _id = userId ?? null;
    const _owner = Boolean(userIsOwner);

    // Prewarm tool access
    const toolNames = Object.keys(aiTools);
    for (const t of toolNames) {
      const _ = aiTools[t]; // touch tool reference
    }

    // Prewarm encoder (binary packet path)
    if (aiTools.encode) {
      aiTools.encode("{}"); // warm encoder
    }

    // Prewarm organ wiring logic (no mutation)
    // We simulate organ creation with null adapters
    createOrgans(
      { userId: _id, userIsOwner: _owner, ...aiTools },
      null,
      null,
      null,
      null
    );

    return true;
  } catch (err) {
    console.error("[Brainstem Prewarm] Failed:", err);
    return false;
  }
}

// ============================================================================
// CREATE BRAINSTEM — Identity + Tools + Organs
// ============================================================================
export function createBrainstem(request = {}, db, fsAPI, routeAPI, schemaAPI) {
  const { userId = null, userIsOwner: requestOwner = false } = request;

  const userIsOwner = Boolean(requestOwner || (userId && userId === OWNER_ID));

  // ---- PREWARM CNS PATHWAYS BEFORE BUILDING CONTEXT ----
  prewarmBrainstem(userId, userIsOwner);

  const context = Object.freeze({
    userId,
    userIsOwner,
    ...aiTools
  });

  const organs = Object.freeze(
    createOrgans(context, db, fsAPI, routeAPI, schemaAPI)
  );

  const packetPayload = {
    type: "brainstem-activation",
    timestamp: Date.now(),
    userId,
    userIsOwner,
    toolCount: Object.keys(aiTools).length
  };

  const packetJson = JSON.stringify(packetPayload);
  const packetBits = aiTools.encode
    ? aiTools.encode(packetJson)
    : null;

  const packet = Object.freeze({
    ...packetPayload,
    bits: packetBits,
    bitLength: packetBits ? packetBits.length : 0
  });

  return Object.freeze({
    meta: BrainstemMeta,
    context,
    organs,
    packet
  });
}

// ============================================================================
//  ESM EXPORTS (v11‑EVO)
// ============================================================================
export {
  createBrainstem
};

export default createBrainstem;

// ============================================================================
//  COMMONJS FALLBACK EXPORTS
// ============================================================================
if (typeof module !== "undefined") {
  module.exports = {
    BrainstemMeta,
    createBrainstem,
    default: createBrainstem
  };
}
