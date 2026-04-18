// ============================================================================
// FILE: tropic-pulse-functions/apps/pulse-ai/aiEngine.js
// LAYER: THE CORTEX (Execution Layer + Safety Enforcer)
// ============================================================================
//
// ROLE:
//   THE CORTEX — The execution + control center of Pulse AI
//   • Builds cognitive context (persona, permissions, boundaries)
//   • Enforces safety + permissions
//   • Executes AI operations deterministically
//   • Captures diagnostics, drift, mismatches, slowdown
//   • Returns result + trace for debugging
//
// PURPOSE:
//   • Central orchestrator for all AI tasks
//   • Provide safe execution environment
//   • Log reasoning summaries (SAFE, not chain‑of‑thought)
//   • Guarantee deterministic, auditable behavior
//
// CONTRACT:
//   • READ‑ONLY — no writes
//   • NO eval(), NO Function(), NO dynamic imports
//   • NO executing user code
//   • NO network calls
//   • SAFE summaries only — never chain‑of‑thought
//
// SAFETY:
//   • v6.3 upgrade is COMMENTAL + DIAGNOSTIC ONLY — NO LOGIC CHANGES
//   • All behavior remains identical to pre‑v6.3 aiEngine
// ============================================================================

import { createAIContext } from "./aiContext.js";
import { checkPermission } from "./permissions.js";

// ============================================================================
// PUBLIC API — Cortex Execution Wrapper
// ============================================================================
export async function runAI(request = {}, operation) {
  // --------------------------------------------------------------------------
  // 1) Build Cognitive Frame
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
  // 3) Execute Operation — Cortex Action
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
  // 4) Return Result + Cognitive Trace
  // --------------------------------------------------------------------------
  return {
    result,
    context,
  };
}
