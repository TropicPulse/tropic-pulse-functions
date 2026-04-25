// ============================================================================
// FILE: tropic-pulse-functions/apps/PULSE-AI/aiBrainstem.js
// LAYER: BRAINSTEM (Context + Organs + Pulse Awareness)
// ============================================================================
//
// ROLE:
//   • Attach user + ownership state to the cognitive frame.
//   • Wire organs with DB, FS, Route, Schema adapters.
//   • Never override persona, permissions, or boundaries chosen by aiRouter.
//   • Never mutate anything outside the provided context object.
//   • Pure, deterministic wiring.
//
// CONTRACT:
//   • READ‑ONLY (re: external systems).
//   • ZERO RANDOMNESS.
//   • ZERO IDENTITY LEAKAGE beyond userId/owner flag.
// ============================================================================

import { OWNER_ID } from "./persona.js";
import { createOrgans } from "./createOrgans.js";

// --------------------------------------------------------------------------
// CREATE BRAINSTEM — Attach Organs + User State
// --------------------------------------------------------------------------
export function createBrainstem(request = {}, db, fsAPI, routeAPI, schemaAPI) {
  const { userId = null, userIsOwner: requestOwner = false } = request;

  // Ownership is derived deterministically:
  //  • explicit userIsOwner flag on request
  //  • OR match against OWNER_ID
  const userIsOwner = Boolean(requestOwner || (userId && userId === OWNER_ID));

  // Base brainstem context — merged into Cognitive Frame by aiCortex
  // NOTE: we DO NOT set personaId/persona/permissions/boundaries here;
  // those are owned by aiRouter + aiContext.
  const context = {
    userId,
    userIsOwner
  };

  // Organs (inject environment APIs)
  const organs = createOrgans(context, db, fsAPI, routeAPI, schemaAPI);

  // Return organism (context will be merged into the main AI context)
  return {
    context,
    organs
  };
}
