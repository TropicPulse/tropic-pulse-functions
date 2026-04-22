// ============================================================================
// FILE: tropic-pulse-functions/apps/pulse-ai/aiRouter.js
// LAYER: THE INTERPRETER (Intent Decoder + Persona Selector + Language Cortex)
// ============================================================================
//
// ROLE (v7.1+):
//   THE INTERPRETER — Decodes intent + selects the correct AI persona.
//   • Inspects request intent + flags.
//   • Chooses backend‑ai vs frontend‑ai.
//   • Attaches permissions + boundaries.
//   • Produces a SAFE reasoning trace (not chain‑of‑thought).
//   • Acts as the “language cortex” of Pulse AI — decoding meaning.
//
// PURPOSE (v7.1+):
//   • Provide deterministic persona routing.
//   • Make routing logic explicit + inspectable.
//   • Explain routing decisions in human‑readable form.
//   • Surface evolutionary patterns in how intent is interpreted.
//
// CONTRACT (unchanged):
//   • READ‑ONLY — no writes.
//   • NO eval(), NO Function(), NO dynamic imports.
//   • NO executing user code.
//   • NO network calls.
//   • Deterministic routing only.
//
// SAFETY (unchanged):
//   • v7.1+ upgrade is COMMENTAL + DIAGNOSTIC ONLY — NO LOGIC CHANGES.
//   • All behavior remains identical to pre‑v7.1 aiRouter.
// ============================================================================

import { Personas, getPersona } from "./persona.js";
import { checkPermission } from "./permissions.js";
import { BoundaryLevels, canPerform } from "./boundaries.js";

// ============================================================================
// PUBLIC API — Interpret + Route
// ============================================================================
export function routeAIRequest(request = {}) {
  const reasoning = [];

  // --------------------------------------------------------------------------
  // 1) Normalize Intent — Interpreter Step (Language Cortex)
  // --------------------------------------------------------------------------
  const intent = (request.intent || "analyze").toLowerCase();
  reasoning.push(`Intent detected: "${intent}"`);

  const {
    touchesBackend = false,
    touchesFrontend = false,
    touchesSchemas = false,
    touchesFiles = false,
    userIsOwner = false,
  } = request;

  if (touchesBackend) reasoning.push("Request touches BACKEND.");
  if (touchesFrontend) reasoning.push("Request touches FRONTEND.");
  if (touchesSchemas) reasoning.push("Request touches SCHEMAS.");
  if (touchesFiles) reasoning.push("Request touches FILES.");
  if (userIsOwner) reasoning.push("User is OWNER (has elevated rights).");

  // --------------------------------------------------------------------------
  // 2) Persona Selection — Interpreter Decision
  // --------------------------------------------------------------------------
  let personaId = Personas.FRONTEND_AI;

  const wantsMutation =
    intent === "generate" ||
    intent === "heal" ||
    intent === "migrate" ||
    intent === "modify" ||
    intent === "create";

  if ((touchesBackend || touchesSchemas || touchesFiles) && wantsMutation) {
    if (userIsOwner) {
      personaId = Personas.BACKEND_AI;
      reasoning.push(
        "Routing to BACKEND AI: mutation requested on backend/schemas/files and user is owner."
      );
    } else {
      reasoning.push(
        "Staying on FRONTEND AI: mutation requested but user is NOT owner."
      );
    }
  } else {
    reasoning.push(
      "Routing to FRONTEND AI: intent is read‑only (analyze/explain) or frontend‑only."
    );
  }

  const persona = getPersona(personaId);

  // --------------------------------------------------------------------------
  // 3) Attach Permissions + Boundaries
  // --------------------------------------------------------------------------
  const permissions = persona?.permissions || {};
  const boundaries = persona?.boundaries || {};

  reasoning.push(`Persona selected: ${personaId}`);

  return {
    personaId,
    persona,
    permissions,
    boundaries,
    reasoning,
  };
}

// ============================================================================
// EXPLAIN ROUTING — Interpreter Summary
// ============================================================================
export function explainRoutingDecision(request = {}) {
  const result = routeAIRequest(request);

  return {
    personaId: result.personaId,
    reasoning: result.reasoning,
  };
}
