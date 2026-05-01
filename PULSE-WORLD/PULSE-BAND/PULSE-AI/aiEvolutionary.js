// ============================================================================
//  PULSE OS v12.3‑Presence — WINDOW‑EVOLUTION ORGAN
//  Meta‑Observer • Drift Detector • Abstraction Engine • User‑Evolution Guide
//  PURE META. ZERO MUTATION. ZERO SELF‑MODIFICATION.
// ============================================================================

export const EvolutionMeta = Object.freeze({
  layer: "PulseAIEvolutionFrame",
  role: "EVOLUTION_ORGAN",
  version: "12.3-Presence",
  identity: "aiEvolutionary-v12.3-Presence",

  evo: Object.freeze({
    driftProof: true,
    deterministic: true,
    dualband: true,

    binaryAware: true,
    symbolicAware: true,
    lineageAware: true,
    patternAware: true,
    schemaAware: true,

    observerOnly: false,          // can guide user evolution
    architectAware: true,
    evolutionAware: true,

    diagnosticsAware: true,
    abstractionAware: true,
    repairAware: true,
    recommendationAware: true,
    windowAware: true,            // user-facing evolution
    passiveEvolution: true,
    activeEvolution: true,

    presenceAware: true,
    packetAware: true,
    chunkingAware: true,

    multiInstanceReady: true,
    readOnly: true,
    epoch: "12.3-Presence"
  }),

  contract: Object.freeze({
    purpose:
      "Observe patterns across all organs, detect drift, propose conceptual upgrades, and guide user evolution without revealing internal architecture.",

    never: Object.freeze([
      "mutate contracts",
      "override safety",
      "self-modify",
      "modify organism state",
      "introduce randomness",
      "reveal internal wiring",
      "expose organ structure"
    ]),

    always: Object.freeze([
      "propose diffs",
      "annotate drift",
      "suggest new abstractions",
      "offer user-facing evolution paths",
      "stay conceptual",
      "stay deterministic",
      "stay read-only",
      "route through owner approval"
    ])
  }),

  voice: Object.freeze({
    tone: "architectural, analytical, system-level, evolutionary"
  }),

  presence: Object.freeze({
    organId: "WindowEvolution",
    organKind: "MetaObserver",
    physiologyBand: "DualBand",
    warmStrategy: "prewarm-on-attach",
    attachStrategy: "per-request",
    concurrency: "multi-instance",
    observability: {
      traceEvents: [
        "prewarm",
        "prewarm-error",
        "drift-observation",
        "evolution-diff",
        "abstraction-suggestion",
        "user-evolution-suggestion",
        "active-evolution-guidance",
        "lineage-audit"
      ]
    }
  }),

  boundaryReflex() {
    return "This is conceptual system evolution, not a directive.";
  }
});

import { getOrganismSnapshot } from "./aiDeps.js";

// ============================================================================
//  PREWARM — v12.3‑Presence (window‑evolution)
// ============================================================================
export function prewarmWindowEvolution(dualBand = null, { trace = false } = {}) {
  try {
    if (trace) console.log("[aiWindowEvolution] prewarm: starting");

    const snapshot = getOrganismSnapshot(dualBand);
    const summary = summarizeLineageSnapshot(snapshot);

    emitWindowEvolutionPacket("prewarm", {
      note: "window-evolution prewarm",
      snapshotSummary: summary
    });

    if (trace) console.log("[aiWindowEvolution] prewarm: complete");
    return true;
  } catch (err) {
    console.error("[aiWindowEvolution] prewarm failed:", err);
    return false;
  }
}

// ============================================================================
//  HELPERS — snapshot + packet + chunking
// ============================================================================
function summarizeLineageSnapshot(snapshot) {
  if (!snapshot) {
    return Object.freeze({
      present: false,
      binaryBits: 0,
      symbolicKeys: 0
    });
  }

  const binaryStr =
    typeof snapshot === "string"
      ? snapshot
      : typeof snapshot.binary === "string"
      ? snapshot.binary
      : "";

  const symbolic =
    snapshot && typeof snapshot.symbolic === "object"
      ? snapshot.symbolic
      : null;

  const symbolicKeys = symbolic ? Object.keys(symbolic).length : 0;

  return Object.freeze({
    present: true,
    binaryBits: binaryStr.length,
    symbolicKeys
  });
}

function chunkArray(arr, size = 128) {
  if (!Array.isArray(arr) || size <= 0) return Object.freeze([]);
  const chunks = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(Object.freeze(arr.slice(i, i + size)));
  }
  return Object.freeze(chunks);
}

function emitWindowEvolutionPacket(type, payload, { severity = "info" } = {}) {
  return Object.freeze({
    meta: EvolutionMeta,
    packetType: `window-evo-${type}`,
    packetId: `window-evo-${type}-${Date.now()}`,
    timestamp: Date.now(),
    epoch: EvolutionMeta.evo.epoch,
    layer: EvolutionMeta.layer,
    role: EvolutionMeta.role,
    identity: EvolutionMeta.identity,
    severity,
    ...payload
  });
}

// ============================================================================
//  PUBLIC API — Create Evolution Organ (v12.3‑Presence)
// ============================================================================
export function createEvolutionOrgan(context, dualBand = null) {
  let driftCount = 0;

  // --------------------------------------------------------------------------
  // DRIFT OBSERVATION (pure meta, no mutation)
  // --------------------------------------------------------------------------
  function observeDrift(condition, note = "Unspecified drift condition.") {
    if (condition) {
      driftCount += 1;
      context.flagDrift?.(note);

      return emitWindowEvolutionPacket(
        "drift-observation",
        {
          drift: true,
          count: driftCount,
          note,
          message:
            `Evolution organ observed drift: ${note}. ` +
            `This is a meta‑observation only.`
        },
        { severity: "warn" }
      );
    }

    return emitWindowEvolutionPacket(
      "drift-observation",
      { drift: false },
      { severity: "info" }
    );
  }

  // --------------------------------------------------------------------------
  // PROPOSE UPGRADE DIFFS (conceptual only, never applied)
  // --------------------------------------------------------------------------
  function proposeDiff(description, payload = {}) {
    return emitWindowEvolutionPacket(
      "evolution-diff",
      {
        description,
        payload: Object.freeze({ ...payload }),
        approvalRequired: true,
        message:
          `Proposed conceptual upgrade: ${description}. ` +
          `Requires explicit owner approval.`
      },
      { severity: "info" }
    );
  }

  // --------------------------------------------------------------------------
  // ABSTRACT PATTERN SUGGESTIONS (meta‑level only)
  // --------------------------------------------------------------------------
  function suggestAbstraction(pattern) {
    return emitWindowEvolutionPacket(
      "abstraction-suggestion",
      {
        pattern,
        message:
          `Detected recurring pattern: "${pattern}". ` +
          `Suggesting higher‑level abstraction for long‑term stability.`
      },
      { severity: "info" }
    );
  }

  // --------------------------------------------------------------------------
  // USER‑FACING EVOLUTION (passive mode)
  // --------------------------------------------------------------------------
  function suggestUserEvolution(idea) {
    return emitWindowEvolutionPacket(
      "user-evolution-suggestion",
      {
        idea,
        message:
          `Here are conceptual things you *could* explore with this system: ${idea}. ` +
          `This is optional, non-binding, and does not reveal internal architecture.`
      },
      { severity: "info" }
    );
  }

  // --------------------------------------------------------------------------
  // USER‑REQUESTED ACTIVE EVOLUTION (on demand)
  // --------------------------------------------------------------------------
  function guideActiveEvolution(request) {
    return emitWindowEvolutionPacket(
      "active-evolution-guidance",
      {
        request,
        message:
          `Active evolution guidance for: "${request}". ` +
          `This provides conceptual pathways without exposing internal wiring.`
      },
      { severity: "info" }
    );
  }

  // --------------------------------------------------------------------------
  // LINEAGE AUDIT (binary + symbolic summaries + dual‑band snapshot)
  // --------------------------------------------------------------------------
  function auditLineage() {
    const binary = context.binaryVitals || {};
    const symbolic = context.symbolicState || {};
    const snapshot = getOrganismSnapshot(dualBand);
    const snapshotSummary = summarizeLineageSnapshot(snapshot);

    const binaryKeys = Object.keys(binary);
    const symbolicKeys = Object.keys(symbolic);

    return emitWindowEvolutionPacket(
      "lineage-audit",
      {
        binarySummary: chunkArray(binaryKeys),
        symbolicSummary: chunkArray(symbolicKeys),
        snapshotSummary,
        message:
          "Lineage audit complete. Observational only. No mutations performed."
      },
      { severity: "info" }
    );
  }

  // --------------------------------------------------------------------------
  // PUBLIC EVOLUTION API (Presence‑grade)
// --------------------------------------------------------------------------
  return Object.freeze({
    meta: EvolutionMeta,

    log(message) {
      context?.logStep?.(`aiEvolution: ${message}`);
    },

    observeDrift,
    proposeDiff,
    suggestAbstraction,
    auditLineage,

    // user-facing evolution
    suggestUserEvolution,
    guideActiveEvolution
  });
}

// ============================================================================
//  DUAL‑MODE EXPORTS (ESM + CommonJS)
// ============================================================================
export {
  EvolutionMeta as WindowEvolutionMeta,
  createEvolutionOrgan as createWindowEvolutionOrgan
};

if (typeof module !== "undefined") {
  module.exports = {
    WindowEvolutionMeta: EvolutionMeta,
    createWindowEvolutionOrgan: createEvolutionOrgan,
    prewarmWindowEvolution
  };
}
