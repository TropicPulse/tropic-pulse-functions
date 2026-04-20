// ============================================================================
// FILE: /apps/organs/immune/PulseSurgeonGeneral.js
// PULSE OS — v8.0
// IMMUNE SYSTEM COMMANDER — “THE SURGEON GENERAL”
// LOCAL‑FIRST • OFFLINE‑CAPABLE • ZERO DRIFT • PURE LOGIC
// ============================================================================
//
// ROLE (v8.0):
//   • Receives analysis from PulseImmunity (including mesh + global drift).
//   • Identifies root causes and prioritizes repair order (A → B → A).
//   • Activates the correct healer subsystem via declarative commands.
//   • Coordinates backend immune responders (optional).
//   • Issues mesh‑aware repair directives (routing, nodes, reflex).
//   • Ensures safe, ordered, non-destructive healing.
//   • Operates fully offline when backend is unavailable.
//
// This file does NOT heal anything directly.
// It LEADS the healers with structured commands.
//
// ============================================================================
// SUBSYSTEM IDENTITY — “IMMUNE SYSTEM”  [PURPLE]
// ----------------------------------------------------------------------------
// This organ is the TOP of the immune hierarchy.
// It commands (via directives):
//   • GPUHealer (muscular immune response)
//   • RouteDownResponder (router immune response)
//   • IdentityHealer (identity/BBB immune response)
//   • Mesh layer (PulseMesh routing spine) via mesh directives
//   • Any future healers added to the registry
//
// v8.0: Surgeon General is now mesh‑aware and drift‑aware across layers.
// ============================================================================

// ============================================================================
// IMPORTS
// ============================================================================
import { PulseImmunity } from "./PulseImmunity.js";

// Local immune responders
import { GPUHealer } from "../../../pulse-gpu/GPUHealer.js";
import { IdentityHealer } from "../identity/IdentityHealer.js";

// Backend immune responder (optional)
import { handler as RouteDownResponder } from "../../../../netlify/functions/RouteDownAlert.js";

// ============================================================================
// MODE — v8.0 LOCAL-FIRST IMMUNE COMMANDER
// ----------------------------------------------------------------------------
// If PULSE_OFFLINE_MODE = "1", backend responders are skipped.
// All local healers still run normally.
// ============================================================================
const OFFLINE_MODE =
  (typeof window !== "undefined" && window.PULSE_OFFLINE_MODE === "1") ||
  false;

// ============================================================================
// HEALER REGISTRY (v8.0)
// ----------------------------------------------------------------------------
// Evolvable registry. Add new healers here.
// v8.0: Mesh-aware directives added (no direct mesh imports).
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
    handler: (issue) => {
      if (OFFLINE_MODE) {
        return {
          ok: false,
          skipped: true,
          reason: "offline-mode",
          issue
        };
      }
      return RouteDownResponder({ body: JSON.stringify(issue) });
    }
  },
  {
    name: "IdentityHealer",
    match: /identity|auth|token|session/i,
    handler: (issue) => IdentityHealer.repair(issue)
  },
  {
    // Mesh routing / spine / reflex / stall / missing node
    name: "MeshRoutingDirective",
    match: /mesh|routing_stall|missing_node|reflex_drop|PulseMesh/i,
    handler: (issue) => {
      // Surgeon General does NOT touch PulseMesh directly.
      // It emits a declarative command for the mesh layer to consume.
      return {
        ok: true,
        type: "mesh_repair_directive",
        target: "PulseMesh",
        action: "analyze_and_repair_route",
        details: {
          meshNodeId: issue.meshNodeId ?? null,
          routeId: issue.routeId ?? null,
          driftType: issue.driftType ?? "unspecified",
          severity: issue.severity ?? "info",
          note: issue.message ?? issue.note ?? null
        },
        issue
      };
    }
  }
];

// ============================================================================
// SURGEON GENERAL — COMMANDER ORGAN (v8.0)
// ============================================================================
export const PulseSurgeonGeneral = {

  // ----------------------------------------------------------
  // TRIAGE (v8.0)
  // ----------------------------------------------------------
  // Mesh + global issues can be prioritized slightly higher
  // when severity is equal, to keep routing stable.
  triage(analysis) {
    const { issues } = analysis;

    return issues.slice().sort((a, b) => {
      const sa = a.severity || 1;
      const sb = b.severity || 1;

      if (sb !== sa) return sb - sa;

      const aIsMesh =
        /mesh|PulseMesh|routing_stall|missing_node|reflex_drop/i.test(
          a.message || ""
        ) || a.subsystem === "Mesh";

      const bIsMesh =
        /mesh|PulseMesh|routing_stall|missing_node|reflex_drop/i.test(
          b.message || ""
        ) || b.subsystem === "Mesh";

      if (aIsMesh && !bIsMesh) return -1;
      if (!aIsMesh && bIsMesh) return 1;

      return 0;
    });
  },

  // ----------------------------------------------------------
  // DISPATCH (v8.0)
  // ----------------------------------------------------------
  async dispatch(issue) {
    const msg = issue.message || "";

    for (const healer of HEALER_REGISTRY) {
      if (healer.match.test(msg)) {
        return healer.handler(issue);
      }
    }

    // Fallback: no direct healer match — return a neutral directive
    return {
      ok: false,
      message: "No healer found for issue",
      issue
    };
  },

  // ----------------------------------------------------------
  // COMMAND CYCLE (v8.0)
  // ----------------------------------------------------------
  // Receives a diagnostic snapshot (including mesh + global drift),
  // asks PulseImmunity to analyze, triages, then dispatches to healers.
  async command(diagSnapshot) {
    const analysis = PulseImmunity.analyze(diagSnapshot);

    const orderedIssues = this.triage(analysis);

    const results = [];

    for (const issue of orderedIssues) {
      const res = await this.dispatch(issue);
      results.push({ issue, result: res });
    }

    return {
      commander: "PulseSurgeonGeneral",
      mode: OFFLINE_MODE ? "offline" : "online",
      analysis,
      orderedIssues,
      results
    };
  }
};

// ============================================================================
// END OF FILE — IMMUNE SYSTEM COMMANDER  [PURPLE]
// ============================================================================
