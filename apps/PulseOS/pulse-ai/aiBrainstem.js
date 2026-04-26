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
      "remain read-only",
      "remain drift-proof",
      "remain deterministic",
      "remain pulse-safe"
    ])
  })
});

import { OWNER_ID } from "./persona.js";
import { createOrgans } from "./createOrgans.js";

// ---------------------------------------------------------------------------
// COGNITIVE TOOLKIT IMPORT (v11‑EVO)
// Import EVERYTHING from aiTools.js.
// This is the single cognitive organ for the entire AI organism.
// ---------------------------------------------------------------------------
import * as aiTools from "./aiTools.js";

// ---------------------------------------------------------------------------
// CREATE BRAINSTEM — Identity + Tools + Organs
// ---------------------------------------------------------------------------
export function createBrainstem(request = {}, db, fsAPI, routeAPI, schemaAPI) {
  const { userId = null, userIsOwner: requestOwner = false } = request;

  // -------------------------------------------------------------------------
  // OWNERSHIP RESOLUTION (Deterministic)
  // -------------------------------------------------------------------------
  const userIsOwner = Boolean(requestOwner || (userId && userId === OWNER_ID));

  // -------------------------------------------------------------------------
  // BRAINSTEM CONTEXT (Merged into Cognitive Frame by aiCortex)
  // -------------------------------------------------------------------------
  // NOTE:
  //   Brainstem does NOT set persona, personaId, permissions, or boundaries.
  //   Those belong to aiRouter + aiContext.
  //
  //   Brainstem ONLY handles:
  //     • identity
  //     • ownership
  //     • cognitive tools (from aiTools.js)
  //     • organ wiring
  // -------------------------------------------------------------------------
  const context = {
    userId,
    userIsOwner,

    // Attach ALL cognitive tools (intent, reasoning, assistant, api, etc.)
    ...aiTools
  };

  // -------------------------------------------------------------------------
  // ORGANS (Environment Adapters)
  // -------------------------------------------------------------------------
  const organs = createOrgans(context, db, fsAPI, routeAPI, schemaAPI);

  // -------------------------------------------------------------------------
  // RETURN CNS ORGANISM
  // -------------------------------------------------------------------------
  return {
    context,
    organs
  };
}

// ============================================================================
// EXPORT (v11‑EVO)
// Brainstem is a stable CNS organ — no logic, only wiring.
// ============================================================================
export default createBrainstem;
