// ============================================================================
// FILE: /apps/organs/immune/PulseMeshImmuneSystem.js
// PULSE OS — v9.2
// MESH IMMUNE SYSTEM COMMANDER — “THE IMMUNE COMMANDER”
// LOCAL‑FIRST • OFFLINE‑CAPABLE • ZERO DRIFT • PURE LOGIC
// ============================================================================
//
// ROLE (v9.2):
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
// v9.2: Identity is self-repairing — commander emits declarative directives.
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
  // IMMUNE COMMANDER META (v9.2)
  // ========================================================================
  const meta = {
    layer: "PulseMeshImmuneSystem",
    role: "IMMUNE_COMMANDER",
    version: 9.2,
    target: "full-mesh",
    selfRepairable: true,
    evo: {
      dualMode: true,
      localAware: true,
      internetAware: true,

      advantageCascadeAware: true,
      pulseEfficiencyAware: true,
      driftProof: true,
      multiInstanceReady: true,

      unifiedAdvantageField: true,
      deterministicField: true,
      futureEvolutionReady: true,

      signalFactoringAware: true,
      meshPressureAware: true,
      auraPressureAware: true
    }
  };

  // ========================================================================
  // HEALER REGISTRY (v9.2)
  // ========================================================================
  const HEALER_REGISTRY = [
    {
      name: "GPUHealer",
      match: /gpu|render|frame|canvas|advisor|auto_opt/i,
      handler: (issue) => ({
        ok: true,
        type: "gpu_repair_directive",
        target: "PulseGPU",
        action: "repair",
        details: {
          driftType: issue.driftType ?? "unspecified",
          severity: issue.severity ?? "info",
          note: issue.message ?? issue.note ?? null
        },
        result: GPUHealer.repair(issue),
        issue
      })
    },
    {
      name: "RouteDownResponder",
      match: /route|network|down|offline|timeout|stall/i,
      handler: (issue) => {
        if (OFFLINE_MODE) {
          return {
            ok: false,
            skipped: true,
            reason: "offline-mode",
            issue
          };
        }
        return {
          ok: true,
          type: "routing_repair_directive",
          target: "PulseMesh",
          action: "route_repair",
          details: {
            driftType: issue.driftType ?? "unspecified",
            severity: issue.severity ?? "info",
            note: issue.message ?? issue.note ?? null
          },
          result: RouteDownResponder(issue),
          issue
        };
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
      // Mesh routing / spine / reflex / stall / missing node / factoring
      name: "MeshRoutingDirective",
      match: /mesh|routing|routing_stall|missing_node|reflex_drop|PulseMesh|factoring/i,
      handler: (issue) => ({
        ok: true,
        type: "mesh_repair_directive",
        target: "PulseMesh",
        action: "analyze_and_repair_route",
        details: {
          meshNodeId: issue.meshNodeId ?? null,
          routeId: issue.routeId ?? null,
          driftType: issue.driftType ?? "unspecified",
          factoringDepth: issue.factoringDepth ?? null,
          severity: issue.severity ?? "info",
          note: issue.message ?? issue.note ?? null
        },
        issue
      })
    }
  ];


  // ========================================================================
  // IMMUNE COMMANDER — TOP OF IMMUNE SYSTEM (v9.2)
  // ========================================================================
  const PulseMeshImmuneSystem = {

    meta,

    // ----------------------------------------------------------
    // TRIAGE (v9.2)
    // ----------------------------------------------------------
    triage(analysis) {
      const { issues } = analysis;

      return issues.slice().sort((a, b) => {
        const sa = a.severity || 1;
        const sb = b.severity || 1;

        // Higher severity first
        if (sb !== sa) return sb - sa;

        const aMsg = a.message || "";
        const bMsg = b.message || "";

        const aIsMesh =
          /mesh|PulseMesh|routing|routing_stall|missing_node|reflex_drop|factoring/i.test(aMsg) ||
          a.subsystem === "Mesh";

        const bIsMesh =
          /mesh|PulseMesh|routing|routing_stall|missing_node|reflex_drop|factoring/i.test(bMsg) ||
          b.subsystem === "Mesh";

        if (aIsMesh && !bIsMesh) return -1;
        if (!aIsMesh && bIsMesh) return 1;

        return 0;
      });
    },

    // ----------------------------------------------------------
    // DISPATCH (v9.2)
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
    // COMMAND CYCLE (v9.2)
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
        meta,
        analysis,
        orderedIssues,
        results
      };
    }
  };

  return PulseMeshImmuneSystem;
}
