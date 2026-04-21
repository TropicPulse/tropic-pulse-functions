// ============================================================================
// FILE: /apps/organs/immune/PulseMeshImmuneSystem.js
// PULSE OS — v9.1
// MESH IMMUNE SYSTEM COMMANDER — “THE IMMUNE COMMANDER”
// LOCAL‑FIRST • OFFLINE‑CAPABLE • ZERO DRIFT • PURE LOGIC
// ============================================================================
//
// ROLE (v9.1):
//   • Receives analysis from PulseImmunity (mesh + global drift).
//   • Prioritizes issues (triage).
//   • Dispatches to real healers (GPU, routing, backend).
//   • Emits declarative repair directives (mesh, identity).
//   • Ensures safe, ordered, non-destructive healing.
//   • Operates fully offline when backend is unavailable.
//
// This organ does NOT heal anything directly.
// It COMMANDS the healers.
// ============================================================================
//
// SUBSYSTEM IDENTITY — “IMMUNE SYSTEM”  [PURPLE]
// ----------------------------------------------------------------------------
// This organ is the TOP of the immune hierarchy.
// It commands (via directives):
//   • GPUHealer (muscular immune response)
//   • RouteDownResponder (router immune response)
//   • Mesh layer (PulseMesh routing spine) via mesh directives
//   • Identity (self-healing) via declarative identity directives
//   • Any future healers added to the registry
//
// v9.1: IdentityHealer removed — Identity is self-repairing.
// ============================================================================


// ============================================================================
// FACTORY — ALL DEPENDENCIES INJECTED BY THE CNS BRAIN
// IMMUNE COMMANDER MUST HAVE ZERO IMPORTS
// ============================================================================
export function createPulseMeshImmuneSystem({
  PulseImmunity,
  GPUHealer,
  RouteDownResponder,
  OFFLINE_MODE = false,
  log,
  warn,
  error
}) {

  // ========================================================================
  // HEALER REGISTRY (v9.1)
  // ========================================================================
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
        return RouteDownResponder(issue);
      }
    },
    {
      // Identity is self-healing — commander emits a directive only
      name: "IdentityDirective",
      match: /identity|auth|token|session|bbb/i,
      handler: (issue) => ({
        ok: true,
        type: "identity_repair_directive",
        target: "PulseIdentity",
        action: "self_repair",
        details: {
          driftType: issue.driftType ?? "unspecified",
          severity: issue.severity ?? "info",
          note: issue.message ?? issue.note ?? null
        },
        issue
      })
    },
    {
      // Mesh routing / spine / reflex / stall / missing node
      name: "MeshRoutingDirective",
      match: /mesh|routing_stall|missing_node|reflex_drop|PulseMesh/i,
      handler: (issue) => ({
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
      })
    }
  ];


  // ========================================================================
  // IMMUNE COMMANDER — TOP OF IMMUNE SYSTEM (v9.1)
  // ========================================================================
  const PulseMeshImmuneSystem = {

    // ----------------------------------------------------------
    // TRIAGE (v9.1)
    // ----------------------------------------------------------
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
    // DISPATCH (v9.1)
    // ----------------------------------------------------------
    async dispatch(issue) {
      const msg = issue.message || "";

      for (const healer of HEALER_REGISTRY) {
        if (healer.match.test(msg)) {
          return healer.handler(issue);
        }
      }

      return {
        ok: false,
        message: "No healer found for issue",
        issue
      };
    },

    // ----------------------------------------------------------
    // COMMAND CYCLE (v9.1)
    // ----------------------------------------------------------
    async command(diagSnapshot) {
      const analysis = PulseImmunity.analyze(diagSnapshot);

      const orderedIssues = this.triage(analysis);

      const results = [];

      for (const issue of orderedIssues) {
        const res = await this.dispatch(issue);
        results.push({ issue, result: res });
      }

      return {
        commander: "PulseMeshImmuneSystem",
        mode: OFFLINE_MODE ? "offline" : "online",
        analysis,
        orderedIssues,
        results
      };
    }
  };

  return PulseMeshImmuneSystem;
}
