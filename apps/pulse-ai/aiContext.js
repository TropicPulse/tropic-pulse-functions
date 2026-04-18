// ============================================================================
// FILE: tropic-pulse-functions/apps/pulse-ai/aiContext.js
// LAYER: THE COGNITIVE FRAME
// ============================================================================
//
// ROLE:
//   THE COGNITIVE FRAME — The AI’s mental model constructor
//   • Builds persona, permissions, boundaries
//   • Shapes the AI’s understanding of the request
//   • Creates SAFE reasoning trace (not chain‑of‑thought)
//   • Provides diagnostics for mismatches, drift, slowdown
//
// PURPOSE:
//   • Provide a unified cognitive context for all AI operations
//   • Define expectations + boundaries
//   • Build a deterministic mental frame
//   • Track reasoning summaries step‑by‑step
//   • Detect schema drift + missing fields
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
//   • All behavior remains identical to pre‑v6.3 aiContext
// ============================================================================

import { routeAIRequest } from "./aiRouter.js";

// ============================================================================
// LAYER CONSTANTS + DIAGNOSTICS
// ============================================================================
const COG_LAYER_ID = "COGNITIVE-FRAME-LAYER";
const COG_LAYER_NAME = "THE COGNITIVE FRAME";
const COG_LAYER_ROLE = "Understanding Layer + Expectation Builder";

const COG_DIAGNOSTICS_ENABLED =
  process?.env?.PULSE_COGNITIVE_DIAGNOSTICS === "true" ||
  process?.env?.PULSE_DIAGNOSTICS === "true";

const cogLog = (stage, details = {}) => {
  if (!COG_DIAGNOSTICS_ENABLED) return;

  console.log(
    JSON.stringify({
      pulseLayer: COG_LAYER_ID,
      pulseName: COG_LAYER_NAME,
      pulseRole: COG_LAYER_ROLE,
      stage,
      ...details
    })
  );
};

cogLog("COGNITIVE_FRAME_INIT", {});

// ============================================================================
// PUBLIC API — Build Cognitive Frame
// ============================================================================
export function createAIContext(request = {}) {
  cogLog("CREATE_CONTEXT_START");

  const routing = routeAIRequest(request);

  const context = {
    personaId: routing.personaId,
    persona: routing.persona,
    permissions: routing.permissions,
    boundaries: routing.boundaries,

    // SAFE reasoning trace (not chain‑of‑thought)
    trace: [...routing.reasoning],

    // Diagnostics the AI can fill in during processing
    diagnostics: {
      mismatches: [],
      missingFields: [],
      driftDetected: false,
      slowdownCauses: [],
    },

    // ------------------------------------------------------------------------
    // TRACE HELPERS — Cognitive Breadcrumbs
    // ------------------------------------------------------------------------
    logStep(message) {
      this.trace.push(message);
      cogLog("TRACE_STEP", { message });
    },

    // ------------------------------------------------------------------------
    // DIAGNOSTIC HELPERS — Cognitive Integrity Checks
    // ------------------------------------------------------------------------
    flagMismatch(field, expected, actual) {
      this.diagnostics.mismatches.push({ field, expected, actual });
      this.trace.push(
        `Mismatch detected on "${field}": expected ${expected}, got ${actual}`
      );
      cogLog("FLAG_MISMATCH", { field, expected, actual });
    },

    flagMissingField(field) {
      this.diagnostics.missingFields.push(field);
      this.trace.push(`Missing field detected: "${field}"`);
      cogLog("FLAG_MISSING_FIELD", { field });
    },

    flagSlowdown(reason) {
      this.diagnostics.slowdownCauses.push(reason);
      this.trace.push(`Potential slowdown cause: ${reason}`);
      cogLog("FLAG_SLOWDOWN", { reason });
    },

    flagDrift(reason) {
      this.diagnostics.driftDetected = true;
      this.trace.push(`Drift detected: ${reason}`);
      cogLog("FLAG_DRIFT", { reason });
    },
  };

  cogLog("CREATE_CONTEXT_COMPLETE", {
    personaId: context.personaId,
    traceLength: context.trace.length
  });

  return context;
}
