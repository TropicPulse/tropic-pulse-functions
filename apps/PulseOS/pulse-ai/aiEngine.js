// ============================================================================
// FILE: tropic-pulse-functions/apps/pulse-ai/aiEngine.js
// LAYER: THE CORTEX (Execution Layer + Safety Enforcer + Evolutionary Control Center)
// ============================================================================
//
// ROLE (v7.1+):
//   THE CORTEX — The execution + control center of Pulse AI.
//   • Builds the cognitive frame (persona, permissions, boundaries).
//   • Enforces safety + permissions deterministically.
//   • Executes AI operations in a controlled environment.
//   • Captures diagnostics: drift, mismatches, slowdown.
//   • Returns result + trace for debugging + evolutionary insight.
//
// PURPOSE (v7.1+):
//   • Central orchestrator for all AI tasks.
//   • Provide a safe, deterministic execution environment.
//   • Log reasoning summaries (SAFE, not chain‑of‑thought).
//   • Guarantee auditable, predictable behavior.
//   • Act as the “motor cortex” of the digital organism.
//
// CONTRACT (unchanged):
//   • READ‑ONLY — no writes.
//   • NO eval(), NO Function(), NO dynamic imports.
//   • NO executing user code.
//   • NO network calls.
//   • SAFE summaries only — never chain‑of‑thought.
//
// SAFETY (unchanged):
//   • v7.1+ upgrade is COMMENTAL + DIAGNOSTIC ONLY — NO LOGIC CHANGES.
//   • All behavior remains identical to pre‑v7.1 aiEngine.
// ============================================================================

import { createAIContext } from "./aiContext.js";
import { checkPermission } from "./permissions.js";

// ============================================================================
// PUBLIC API — Cortex Execution Wrapper
// ============================================================================
export async function runAI(request = {}, operation) {
  // --------------------------------------------------------------------------
  // 1) Build Cognitive Frame — Cortex Initialization
  // --------------------------------------------------------------------------
  const context = createAIContext(request);
  context.logStep("AI context initialized.");

  // --------------------------------------------------------------------------
  // 2) Permission Enforcement — Executive Control
  // --------------------------------------------------------------------------
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

  // --------------------------------------------------------------------------
  // 3) Execute Operation — Cortex Action Pathway
  // --------------------------------------------------------------------------
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

  // --------------------------------------------------------------------------
  // 4) Return Result + Cognitive Trace — Cortex Output
  // --------------------------------------------------------------------------
  return {
    result,
    context,
  };
}
