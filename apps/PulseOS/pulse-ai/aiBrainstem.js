// ============================================================================
// FILE: tropic-pulse-functions/apps/PULSE-AI/aiBrainstem.js
// LAYER: BRAINSTEM (CNS Bridge: Identity → Tools → Organs → Cortex)
// ============================================================================
//
// ROLE (v11‑EVO):
//   The Brainstem is the FIRST organ that receives the AI pulse.
//   It bridges binary ↔ non-binary, long-term ↔ short-term, organism ↔ AI.
//
//   • Attach user + ownership state to the cognitive frame.
//   • Load ALL cognitive tools from aiTools.js (single source of truth).
//   • Provide deterministic access to intent, reasoning, assistant, and API tools.
//   • Wire organs with DB, FS, Route, Schema adapters.
//   • Enforce identity, ownership, and deterministic contracts.
//   • NEVER mutate external systems.
//   • NEVER override persona, permissions, or boundaries chosen by aiRouter.
//   • NEVER introduce randomness, drift, or autonomy.
//
// ARCHITECTURE (v11‑EVO):
//   Brainstem = Central Nervous System Bridge
//     → Receives pulse
//     → Loads cognitive tools (from aiTools.js)
//     → Attaches identity + ownership
//     → Wires organs
//     → Hands off to Cortex
//
// EVOLUTION POLICY (NEW):
//   • ALL cognitive evolution happens ONLY in aiTools.js.
//   • Brainstem NEVER evolves logic — only wiring.
//   • All AI organs import from aiTools.js (import *).
//   • Updating aiTools.js evolves the entire AI organism instantly.
//   • Brainstem remains stable, deterministic, and drift‑proof.
//
// CONTRACT:
//   • READ‑ONLY (re: external systems).
//   • ZERO RANDOMNESS.
//   • ZERO AUTONOMY.
//   • ZERO IDENTITY LEAKAGE beyond userId/owner flag.
//   • PURE, DETERMINISTIC, PULSE‑SAFE.
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
    packetAware: true,          // NEW
    multiInstanceReady: true,
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
      "emit deterministic brainstem packets",   // NEW
      "remain read-only",
      "remain drift-proof",
      "remain deterministic",
      "remain pulse-safe"
    ])
  })
});

import { OWNER_ID } from "./persona.js";
import { createOrgans } from "./createOrgans.js";
import * as aiTools from "./aiTools.js";

// ============================================================================
// CREATE BRAINSTEM — Identity + Tools + Organs
// ============================================================================
export function createBrainstem(request = {}, db, fsAPI, routeAPI, schemaAPI) {
  const { userId = null, userIsOwner: requestOwner = false } = request;

  // -------------------------------------------------------------------------
  // OWNERSHIP RESOLUTION (Deterministic)
  // -------------------------------------------------------------------------
  const userIsOwner = Boolean(requestOwner || (userId && userId === OWNER_ID));

  // -------------------------------------------------------------------------
  // BRAINSTEM CONTEXT (Merged into Cognitive Frame by aiCortex)
  // -------------------------------------------------------------------------
  const context = Object.freeze({
    userId,
    userIsOwner,
    ...aiTools
  });

  // -------------------------------------------------------------------------
  // ORGANS (Environment Adapters)
  // -------------------------------------------------------------------------
  const organs = Object.freeze(
    createOrgans(context, db, fsAPI, routeAPI, schemaAPI)
  );

  // -------------------------------------------------------------------------
  // BRAINSTEM PACKET (Deterministic)
  // -------------------------------------------------------------------------
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

  // -------------------------------------------------------------------------
  // RETURN CNS ORGANISM (Frozen)
  // -------------------------------------------------------------------------
  return Object.freeze({
    meta: BrainstemMeta,
    context,
    organs,
    packet
  });
}

// ============================================================================
// EXPORT (v11‑EVO)
// ============================================================================
export default createBrainstem;
