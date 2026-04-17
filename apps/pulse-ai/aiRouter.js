// FILE: tropic-pulse-functions/apps/pulse-ai/aiRouter.js

//
// ------------------------------------------------------
// 📘 PAGE INDEX — Source of Truth for This File
// ------------------------------------------------------
//
// ROLE:
//   PulseAIRouter — decides WHICH persona (backend‑ai vs frontend‑ai)
//   should handle a given request, and exposes a deterministic routing
//   decision + reasoning summary.
//
// PURPOSE:
//   • Route requests to the correct AI persona
//   • Make routing logic explicit and inspectable
//   • Expose a human‑readable “thought process” summary
//
// OUTPUT:
//   • { personaId, permissions, boundaries, reasoning[] }
//
// RESPONSIBILITIES:
//   • Inspect request intent + flags
//   • Decide backend vs frontend persona
//   • Attach permissions + boundaries
//   • Produce a step‑by‑step reasoning trace (non‑secret, non‑code‑exec)
//
// SAFETY RULES (CRITICAL):
//   • READ‑ONLY — no file writes
//   • NO eval(), NO Function(), NO dynamic imports
//   • NO executing user code
//   • NO network calls
//   • Deterministic routing only
//
// ------------------------------------------------------
// Pulse‑AI Router
// ------------------------------------------------------

import { Personas, getPersona } from "./persona.js";
import { checkPermission } from "./permissions.js";
import { BoundaryLevels, canPerform } from "./boundaries.js";

/**
 * routeAIRequest(request)
 *
 * Input shape (example):
 * {
 *   intent: "analyze" | "generate" | "heal" | "migrate" | "explain",
 *   touchesBackend: boolean,
 *   touchesFrontend: boolean,
 *   touchesSchemas: boolean,
 *   touchesFiles: boolean,
 *   userIsOwner: boolean
 * }
 *
 * Output:
 * {
 *   personaId,
 *   persona,
 *   permissions,
 *   boundaries,
 *   reasoning: [step1, step2, ...]
 * }
 */
export function routeAIRequest(request = {}) {
  const reasoning = [];

  // 1) Normalize intent
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

  // 2) Decide persona
  let personaId = Personas.FRONTEND_AI;

  // Any backend / schema / file mutation intent → backend‑ai (if owner)
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
      personaId = Personas.FRONTEND_AI;
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

  // 3) Attach permissions + boundaries
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

/**
 * explainRoutingDecision(request)
 * Returns a compact, step‑style explanation of the routing logic.
 */
export function explainRoutingDecision(request = {}) {
  const result = routeAIRequest(request);

  return {
    personaId: result.personaId,
    reasoning: result.reasoning,
  };
}
