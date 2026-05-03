// ============================================================================
// FILE: /organs/immune/PulseMeshImmuneSystem.js
// PULSE OS — v15-EVO-IMMORTAL
// MESH IMMUNE SYSTEM COMMANDER — “THE IMMUNE COMMANDER”
// Deterministic • Declarative • Zero Drift • Pure Logic • Presence/Band-Aware
// ============================================================================
//
// ROLE (v15-EVO-IMMORTAL):
//   • Receives diagnostic snapshots (Halo, Echo, Field, SDN).
//   • Performs deterministic triage (no pressure thresholds).
//   • Emits declarative repair directives for:
//        - GPUHealer (GPU immune response)
//        - RouteResponder (router immune response)
//        - Identity (self-repair directives)
//        - Mesh (pathway diagnostics)
//   • Never heals directly — only commands healers.
//   • Fully offline-capable (OFFLINE_MODE).
//   • Presence-aware, binary-aware, dual-band-ready.
//   • Zero randomness, zero timestamps, zero mutation.
// ============================================================================

/*
AI_EXPERIENCE_META = {
  identity: "PulseMeshImmuneSystem",
  version: "v15.0-MESH-IMMUNE-IMMORTAL",
  layer: "mesh",
  role: "mesh_immune_engine",
  lineage: "PulseMesh-v15",

  evo: {
    immune: true,
    anomalyDetection: true,
    driftDetection: true,
    binaryAware: true,
    symbolicAware: true,
    dualBand: true,
    deterministic: true,
    driftProof: true,
    metadataOnly: true,
    zeroMutationOfInput: true,
    zeroNetworkFetch: true,
    safeRouteFree: true,
    zeroExternalMutation: true
  },

  contract: {
    always: [
      "PulseMeshFlow",
      "PulseMeshEndocrineSystem",
      "PulseMeshAwareness",
      "PulseMeshImmuneMembrane"
    ],
    never: [
      "legacyMeshImmuneSystem",
      "safeRoute",
      "fetchViaCNS"
    ]
  }
}
*/

export function createPulseMeshImmuneSystem({
  PulseImmunity,
  GPUHealer,
  RouteResponder,
  OFFLINE_MODE = false,
  log,
  warn,
  error
}) {

  // ---------------------------------------------------------------------------
  // META — v15-EVO-IMMORTAL identity
  // ---------------------------------------------------------------------------
  const meta = {
    layer: "PulseMeshImmuneSystem",
    role: "IMMUNE_COMMANDER",
    version: "15-EVO-IMMORTAL",
    target: "full-mesh",
    selfRepairable: true,
    evo: {
      dualMode: true,
      binaryAware: true,
      symbolicAware: true,
      presenceAware: true,
      bandAware: true,
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
      auraPressureAware: true,
      flowAware: true,
      driftAware: true,

      zeroCompute: true,
      zeroMutation: true,
      zeroRoutingInfluence: true
    },
    // optional: surface the underlying immunity engine meta for backend AI
    immunityEngine: PulseImmunity?.meta || null
  };


  // ---------------------------------------------------------------------------
  // ISSUE ENRICHMENT (v15)
  // Deterministic enrichment with mode/band + lineage hints.
  // ---------------------------------------------------------------------------
  function enrichIssue(issue, context = {}) {
    const base = issue || {};

    return {
      ...base,
      // mode/band awareness
      binaryMode: !!context.binaryMode,
      dualMode: !!context.dualMode,
      presenceBand: context.presenceBand || base.presenceBand || "symbolic",

      // lineage hints (if present in diag snapshot issue)
      lineageDepth: typeof base.lineageDepth === "number"
        ? base.lineageDepth
        : null,
      meshNodeId: base.meshNodeId ?? null,
      factoringDepth: base.factoringDepth ?? null,

      // severity normalization
      severity: normalizeSeverity(base.severity),

      // stable tags
      tags: Array.isArray(base.tags) ? base.tags.slice() : []
    };
  }

  function normalizeSeverity(sev) {
    if (sev == null) return 1;
    if (typeof sev !== "number" || Number.isNaN(sev)) return 1;
    if (sev < 0) return 0;
    if (sev > 10) return 10;
    return sev;
  }


  // ---------------------------------------------------------------------------
  // HEALER REGISTRY (v15)
  // Declarative — no direct mutation.
  // ---------------------------------------------------------------------------
  const HEALER_REGISTRY = [
    {
      name: "GPUHealer",
      match: /gpu|render|advisor|auto_opt/i,
      handler: (issue) => ({
        ok: true,
        type: "gpu_repair_directive",
        target: "PulseGPU",
        action: "repair",
        details: {
          driftType: issue.driftType ?? "unspecified",
          severity: issue.severity ?? 1,
          note: issue.message ?? null,
          presenceBand: issue.presenceBand ?? null,
          lineageDepth: issue.lineageDepth ?? null
        },
        result: GPUHealer?.repair
          ? GPUHealer.repair(issue)
          : null,
        issue
      })
    },
    {
      name: "RouteResponder",
      match: /route|network|timeout|stall|down/i,
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
          target: "PulseRouter",
          action: "route_repair",
          details: {
            driftType: issue.driftType ?? "unspecified",
            severity: issue.severity ?? 1,
            note: issue.message ?? null,
            presenceBand: issue.presenceBand ?? null,
            lineageDepth: issue.lineageDepth ?? null
          },
          result: RouteResponder
            ? RouteResponder(issue)
            : null,
          issue
        };
      }
    },
    {
      name: "IdentityDirective",
      match: /identity|auth|token|session/i,
      handler: (issue) => ({
        ok: true,
        type: "identity_repair_directive",
        target: "PulseIdentity",
        action: "self_repair",
        details: {
          driftType: issue.driftType ?? "unspecified",
          severity: issue.severity ?? 1,
          note: issue.message ?? null,
          presenceBand: issue.presenceBand ?? null
        },
        issue
      })
    },
    {
      name: "MeshDirective",
      match: /mesh|pathway|factoring|missing_node|stall/i,
      handler: (issue) => ({
        ok: true,
        type: "mesh_repair_directive",
        target: "PulseMesh",
        action: "analyze_pathway",
        details: {
          driftType: issue.driftType ?? "unspecified",
          factoringDepth: issue.factoringDepth ?? null,
          meshNodeId: issue.meshNodeId ?? null,
          severity: issue.severity ?? 1,
          note: issue.message ?? null,
          presenceBand: issue.presenceBand ?? null
        },
        issue
      })
    }
  ];


  // ---------------------------------------------------------------------------
  // TRIAGE (v15)
  // Deterministic ordering — no pressure thresholds.
  // ---------------------------------------------------------------------------
  function triage(analysis) {
    const { issues } = analysis;

    return issues.slice().sort((a, b) => {
      const sa = a.severity || 1;
      const sb = b.severity || 1;

      // Higher severity first
      if (sb !== sa) return sb - sa;

      // Mesh issues prioritized secondarily
      const aMsg = a.message || "";
      const bMsg = b.message || "";

      const aIsMesh = /mesh|pathway|factoring|stall|missing_node/i.test(aMsg);
      const bIsMesh = /mesh|pathway|factoring|stall|missing_node/i.test(bMsg);

      if (aIsMesh && !bIsMesh) return -1;
      if (!aIsMesh && bIsMesh) return 1;

      return 0;
    });
  }


  // ---------------------------------------------------------------------------
  // DISPATCH (v15)
  // Declarative — no direct healing.
  // ---------------------------------------------------------------------------
  async function dispatch(issue) {
    const msg = issue.message || "";

    for (const healer of HEALER_REGISTRY) {
      if (healer.match.test(msg)) {
        const res = healer.handler(issue);
        log && log("[PulseMeshImmuneSystem] Dispatch", {
          healer: healer.name,
          issueMessage: msg,
          severity: issue.severity,
          presenceBand: issue.presenceBand
        });
        return res;
      }
    }

    warn && warn("[PulseMeshImmuneSystem] No healer found for issue", {
      message: msg,
      severity: issue.severity
    });

    return {
      ok: false,
      message: "No healer found for issue",
      issue
    };
  }


  // ---------------------------------------------------------------------------
  // COMMAND CYCLE (v15)
  // Pure triage + directive emission.
  // ---------------------------------------------------------------------------
  async function command(diagSnapshot, context = {}) {
    const analysis = PulseImmunity.analyze(diagSnapshot, {
      binaryMode: context.binaryMode,
      dualMode: context.dualMode,
      presenceBand: context.presenceBand
    });

    const enrichedIssues = (analysis.issues || []).map((issue) =>
      enrichIssue(issue, context)
    );

    const orderedIssues = triage({ ...analysis, issues: enrichedIssues });

    const results = [];

    for (const issue of orderedIssues) {
      const res = await dispatch(issue);
      results.push({ issue, result: res });
    }

    return {
      commander: "PulseMeshImmuneSystem",
      mode: OFFLINE_MODE ? "offline" : "online",
      binaryMode: !!context.binaryMode,
      dualMode: !!context.dualMode,
      presenceBand: context.presenceBand || "symbolic",
      meta,
      analysis: {
        ...analysis,
        issues: enrichedIssues
      },
      orderedIssues,
      results
    };
  }


  // ---------------------------------------------------------------------------
  // PUBLIC INTERFACE
  // ---------------------------------------------------------------------------
  return {
    meta,
    triage,
    dispatch,
    command
  };
}
