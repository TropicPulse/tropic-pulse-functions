// ============================================================================
// FILE: /apps/organs/immune/PulseSurgeonGeneral.js
// PULSE OS — v6.4+
// IMMUNE SYSTEM COMMANDER — “THE SURGEON GENERAL”
// ============================================================================
//
// ROLE (v6.4+):
//   • Receives analysis from PulseImmunity
//   • Identifies root causes
//   • Prioritizes repair order (A → B → A)
//   • Activates the correct healer subsystem
//   • Coordinates backend immune responders
//   • Ensures safe, ordered, non-destructive healing
//
// This file does NOT heal anything directly.
// It LEADS the healers.
//
// ============================================================================
// SUBSYSTEM IDENTITY — “IMMUNE SYSTEM”  [PURPLE]
// ----------------------------------------------------------------------------
// This organ is the TOP of the immune hierarchy.
// It commands:
//   • GPUHealer (muscular immune response)
//   • RouteDownResponder (router immune response)
//   • IdentityHealer (identity/BBB immune response)
//   • Any future healers added to the registry
//
// ============================================================================
// IMPORTS
// ============================================================================

import { PulseImmunity } from "./PulseImmunity.js";

// Local immune responders (may live in different folders)
import { GPUHealer } from "../../../pulse-gpu/GPUHealer.js";
import { IdentityHealer } from "../identity/IdentityHealer.js";

// Wrap Netlify function as responder
import { handler as RouteDownResponder } from "../../../../netlify/functions/RouteDownAlert.js";

// ============================================================================
// HEALER REGISTRY (v6.4+)
// ----------------------------------------------------------------------------
// This makes the system evolvable without rewriting dispatch().
// Add new healers here and the commander auto-detects them.
// ============================================================================

const HEALER_REGISTRY = [
  {
    name: "GPUHealer",
    match: /gpu|render|frame|canvas/i,
    handler: (issue) => GPUHealer.repair(issue)
  },
  {
    name: "RouteDownResponder",
    match: /route|network|down|offline|timeout/i,
    handler: (issue) => RouteDownResponder({ body: JSON.stringify(issue) })
  },
  {
    name: "IdentityHealer",
    match: /identity|auth|token|session/i,
    handler: (issue) => IdentityHealer.repair(issue)
  }
];

// ============================================================================
// SURGEON GENERAL — COMMANDER ORGAN
// ============================================================================

export const PulseSurgeonGeneral = {

  // ----------------------------------------------------------
  // TRIAGE (v6.4+)
  // ----------------------------------------------------------
  triage(analysis) {
    const { issues } = analysis;

    // Rank by severity → probability → systemic impact
    return issues.sort((a, b) => {
      const sa = a.severity || 1;
      const sb = b.severity || 1;
      return sb - sa;
    });
  },

  // ----------------------------------------------------------
  // DISPATCH (v6.4+)
  // ----------------------------------------------------------
  async dispatch(issue) {
    const msg = issue.message || "";

    for (const healer of HEALER_REGISTRY) {
      if (healer.match.test(msg)) {
        return healer.handler(issue);
      }
    }

    // Default fallback
    return {
      ok: false,
      message: "No healer found for issue",
      issue
    };
  },

  // ----------------------------------------------------------
  // COMMAND CYCLE (v6.4+)
  // ----------------------------------------------------------
  async command(diagSnapshot) {
    // Step 1: Analyze
    const analysis = PulseImmunity.analyze(diagSnapshot);

    // Step 2: Triage
    const orderedIssues = this.triage(analysis);

    const results = [];

    // Step 3: Dispatch each issue to correct healer
    for (const issue of orderedIssues) {
      const res = await this.dispatch(issue);
      results.push({ issue, result: res });
    }

    return {
      commander: "PulseSurgeonGeneral",
      analysis,
      orderedIssues,
      results
    };
  }
};

// ============================================================================
// END OF FILE — IMMUNE SYSTEM COMMANDER  [PURPLE]
// ============================================================================
