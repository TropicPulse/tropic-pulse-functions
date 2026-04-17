// FILE: tropic-pulse-functions/apps/pulse-ai/aiContext.js

//
// ------------------------------------------------------
// 📘 PAGE INDEX — Source of Truth for This File
// ------------------------------------------------------
//
// ROLE:
//   PulseAIContext — builds the execution context for any AI operation.
//   This includes persona, permissions, boundaries, and a safe,
//   human‑readable diagnostic trace of how the AI interpreted the request.
//
// PURPOSE:
//   • Provide a unified context object for all AI operations
//   • Attach persona, permissions, boundaries
//   • Maintain a SAFE reasoning trace (not chain‑of‑thought)
//   • Provide a diagnostic map for debugging slowdowns or confusion
//
// OUTPUT:
//   • { persona, permissions, boundaries, trace[], diagnostics{} }
//
// RESPONSIBILITIES:
//   • Build AI context deterministically
//   • Track step‑by‑step reasoning summaries
//   • Detect mismatches, missing fields, schema drift
//   • Provide a human‑readable explanation of AI decisions
//
// SAFETY RULES (CRITICAL):
//   • READ‑ONLY — no file writes
//   • NO eval(), NO Function(), NO dynamic imports
//   • NO executing user code
//   • NO network calls
//   • NO chain‑of‑thought — only SAFE summaries
//
// ------------------------------------------------------
// Pulse‑AI Context Builder
// ------------------------------------------------------

import { routeAIRequest } from "./aiRouter.js";

/**
 * createAIContext(request)
 *
 * Returns:
 * {
 *   personaId,
 *   persona,
 *   permissions,
 *   boundaries,
 *   trace: [...],
 *   diagnostics: {
 *     mismatches: [],
 *     missingFields: [],
 *     driftDetected: false,
 *     slowdownCauses: [],
 *   }
 * }
 */
export function createAIContext(request = {}) {
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

    /**
     * logStep(message)
     * Adds a human‑readable step to the trace.
     */
    logStep(message) {
      this.trace.push(message);
    },

    /**
     * flagMismatch(field, expected, actual)
     */
    flagMismatch(field, expected, actual) {
      this.diagnostics.mismatches.push({ field, expected, actual });
      this.trace.push(
        `Mismatch detected on "${field}": expected ${expected}, got ${actual}`
      );
    },

    /**
     * flagMissingField(field)
     */
    flagMissingField(field) {
      this.diagnostics.missingFields.push(field);
      this.trace.push(`Missing field detected: "${field}"`);
    },

    /**
     * flagSlowdown(reason)
     */
    flagSlowdown(reason) {
      this.diagnostics.slowdownCauses.push(reason);
      this.trace.push(`Potential slowdown cause: ${reason}`);
    },

    /**
     * flagDrift(reason)
     */
    flagDrift(reason) {
      this.diagnostics.driftDetected = true;
      this.trace.push(`Drift detected: ${reason}`);
    },
  };

  return context;
}
