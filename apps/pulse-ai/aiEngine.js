// FILE: tropic-pulse-functions/apps/pulse-ai/aiEngine.js

//
// ------------------------------------------------------
// 📘 PAGE INDEX — Source of Truth for This File
// ------------------------------------------------------
//
// ROLE:
//   PulseAIEngine — orchestrates AI operations by building context,
//   running translators/specs, collecting diagnostics, and returning
//   a safe, human‑readable trace of what happened.
//
// PURPOSE:
//   • Central execution wrapper for all AI tasks
//   • Build AI context (persona, permissions, boundaries, diagnostics)
//   • Run safe operations (translate, analyze, validate)
//   • Capture slowdown causes, mismatches, missing fields, drift
//   • Return results + trace for debugging
//
// OUTPUT:
//   • { result, context: { trace[], diagnostics{} } }
//
// RESPONSIBILITIES:
//   • Build context via aiContext
//   • Enforce persona permissions + boundaries
//   • Run translators/specs safely
//   • Log diagnostic steps
//   • Return deterministic results
//
// SAFETY RULES (CRITICAL):
//   • READ‑ONLY — no file writes
//   • NO eval(), NO Function(), NO dynamic imports
//   • NO executing user code
//   • NO network calls
//   • NO chain‑of‑thought — only SAFE summaries
//
// ------------------------------------------------------
// Pulse‑AI Engine
// ------------------------------------------------------

import { createAIContext } from "./aiContext.js";
import { checkPermission } from "./permissions.js";

/**
 * runAI(request, operation)
 *
 * request = {
 *   intent: "analyze" | "generate" | "heal" | "migrate",
 *   touchesBackend: boolean,
 *   touchesFrontend: boolean,
 *   touchesSchemas: boolean,
 *   touchesFiles: boolean,
 *   userIsOwner: boolean
 * }
 *
 * operation = a SAFE function that receives (context) and returns a result
 *
 * Returns:
 * {
 *   result,
 *   context: {
 *     trace: [...],
 *     diagnostics: {...}
 *   }
 * }
 */
export async function runAI(request = {}, operation) {
  // 1) Build context
  const context = createAIContext(request);
  context.logStep("AI context initialized.");

  // 2) Permission check
  const allowed = checkPermission(
    context.personaId,
    request.intent === "generate" ? "canGenerateFunctions" : "canReadFiles"
  );

  if (!allowed) {
    context.logStep(
      `Permission denied for persona "${context.personaId}" on intent "${request.intent}".`
    );
    return {
      result: null,
      context,
    };
  }

  context.logStep(
    `Permission granted for persona "${context.personaId}" to perform intent "${request.intent}".`
  );

  // 3) Execute operation safely
  let result = null;

  try {
    context.logStep("Executing AI operation...");
    result = await operation(context);
    context.logStep("AI operation completed successfully.");
  } catch (err) {
    context.flagSlowdown("Operation threw an exception.");
    context.logStep(`Error: ${err.message}`);
    result = null;
  }

  // 4) Return result + diagnostics
  return {
    result,
    context,
  };
}
