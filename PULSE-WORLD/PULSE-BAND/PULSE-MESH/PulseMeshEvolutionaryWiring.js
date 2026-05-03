// ============================================================================
//  EvolutionaryWiring.js — v15-EVO-IMMORTAL
//  PulseMesh Wiring Organ • Nervous System Pathway Selector
//  Binary-Aware • Presence-Aware • Advantage-Aware • Drift-Proof
// ============================================================================
//
//  WHAT THIS ORGAN IS:
//  --------------------
//  • The wiring layer of the Pulse Nervous System.
//  • Chooses wiring surfaces for symbolic + binary + dual-band pulses.
//  • Pattern-aware, lineage-aware, presence-aware, advantage-aware, deterministic.
//  • Self-repairing: bad wiring auto-corrects to safe defaults.
//  • Zero compute on payloads, zero mutation of input impulses.
//
//  WHAT THIS ORGAN IS NOT:
//  ------------------------
//  • Not a router (PulseRouter handles destination).
//  • Not a mover (PulseSend handles movement).
//  • Not a compute engine.
//  • Not a network layer.
//  • Not a messenger.
//
//  SAFETY CONTRACT (v15):
//  -----------------------
//  • No imports.
//  • No network.
//  • No randomness.
//  • No timestamps.
//  • Pure deterministic wiring logic.
//  • Zero mutation of input impulses.
//  • Presence-aware, binary-aware, dual-band-aware, advantage-aware.
// ============================================================================

/*
AI_EXPERIENCE_META = {
  identity: "PulseMeshEvolutionaryWiring",
  version: "v15-EVO-IMMORTAL",
  layer: "mesh",
  role: "mesh_lineage_and_wiring_engine",
  lineage: "PulseMesh-v15",

  evo: {
    evolutionaryWiring: true,
    lineageAware: true,
    signatureAware: true,
    deterministic: true,
    driftProof: true,
    metadataOnly: true,
    dualBand: true,
    presenceAware: true,
    binaryAware: true,
    bandAware: true,
    advantageAware: true,
    zeroMutationOfInput: true,
    zeroNetworkFetch: true,
    safeRouteFree: true,
    zeroExternalMutation: true
  },

  contract: {
    always: [
      "PulseMeshFlow",
      "PulseMeshCognition",
      "PulseMeshAwareness"
    ],
    never: [
      "legacyMeshWiring",
      "safeRoute",
      "fetchViaCNS"
    ]
  }
}
*/


// ⭐ PulseRole — identifies this as the PulseMesh Wiring Organ (v15)
export const PulseRole = {
  type: "Mesh",
  subsystem: "PulseMesh",
  layer: "Wiring",
  version: "15-EVO-IMMORTAL",
  identity: "PulseMesh-Wiring-v15",

  evo: {
    driftProof: true,
    patternAware: true,
    lineageAware: true,
    reflexReady: true,
    wiringReady: true,
    selfRepairReady: true,
    dualModeReady: true,
    binaryAware: true,
    symbolicAware: true,
    presenceAware: true,
    bandAware: true,
    advantageAware: true,
    futureEvolutionReady: true,

    unifiedAdvantageField: true,
    deterministicField: true,
    pulseMesh15Ready: true
  },

  pulseContract: "Pulse-v1/v2/v3",
  routerContract: "PulseRouter-v15",
  sendContract: "PulseSend-v15"
};


// ============================================================================
//  INTERNAL HELPERS — deterministic, tiny, pure
// ============================================================================

// Build a wiring key from organ + lineage depth + mode + band + presenceTag + pattern hash
function buildWiringKey(targetOrgan, pulse) {
  const depth = Array.isArray(pulse.lineage) ? pulse.lineage.length : 0;
  const mode = pulse.mode || "symbolic";
  const band = pulse.band || "symbolic";
  const presenceTag = pulse.flags?.aura_presence_tag || "none";
  const pattern = (pulse.pattern || "").toLowerCase();
  const patternHash = simplePatternHash(pattern);

  return `${targetOrgan}::d${depth}::${mode}::${band}::${presenceTag}::p${patternHash}`;
}

// Very small deterministic hash for pattern strings (metadata-only)
function simplePatternHash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;
  }
  return h.toString(16);
}

// Infer default wiring surface from organ + pattern + mode + presence band + advantage hints
function inferDefaultWiring(targetOrgan, pulse) {
  const p = (pulse.pattern || "").toLowerCase();
  const mode = pulse.mode || "symbolic";
  const band = pulse.band || "symbolic";

  const binaryBias = clamp01(pulse.flags?.aura_binary_mesh_bias ?? 0);
  const factoringBias = clamp01(pulse.flags?.aura_factoring_bias ?? 0);

  const prefersBinary = band === "binary" || mode === "binary" || binaryBias > 0.3;
  const prefersDual = band === "dual" || mode === "dual";
  const prefersFactored = factoringBias > 0.4;

  // Presence-band + advantage bias first
  if (prefersBinary) {
    if (targetOrgan === "GPU") return prefersFactored ? "gpuBinaryFactoredBurst" : "gpuBinaryBurst";
    if (targetOrgan === "Earn") return prefersFactored ? "earnBinaryFactoredChain" : "earnBinaryChain";
    if (targetOrgan === "OS") return "osBinaryBridge";
    if (targetOrgan === "Mesh") return prefersFactored ? "meshBinaryFactoredSignal" : "meshBinarySignal";
    return prefersFactored ? "binaryFactoredPreferred" : "binaryPreferred";
  }

  if (prefersDual) {
    if (targetOrgan === "GPU") return prefersFactored ? "gpuDualFactoredBurst" : "gpuDualBurst";
    if (targetOrgan === "Earn") return prefersFactored ? "earnDualFactoredChain" : "earnDualChain";
    if (targetOrgan === "OS") return "osDualBridge";
    if (targetOrgan === "Mesh") return prefersFactored ? "meshDualFactoredSignal" : "meshDualSignal";
    return prefersFactored ? "dualFactoredPreferred" : "dualPreferred";
  }

  // Symbolic defaults with pattern hints
  if (targetOrgan === "GPU") return prefersFactored ? "gpuFactoredBurst" : "gpuBurst";
  if (targetOrgan === "Earn") return prefersFactored ? "earnFactoredCreditChain" : "earnCreditChain";
  if (targetOrgan === "OS") return "osBridge";
  if (targetOrgan === "Mesh") return prefersFactored ? "meshFactoredSignal" : "meshSignal";

  if (p.includes("gpu")) return prefersFactored ? "gpuFactoredBurst" : "gpuBurst";
  if (p.includes("earn")) return prefersFactored ? "earnFactoredCreditChain" : "earnCreditChain";
  if (p.includes("os")) return "osBridge";
  if (p.includes("mesh")) return prefersFactored ? "meshFactoredSignal" : "meshSignal";

  return prefersFactored ? "neutralFactored" : "neutral";
}

function clamp01(v) {
  if (typeof v !== "number" || Number.isNaN(v)) return 0;
  return Math.max(0, Math.min(1, v));
}


// ============================================================================
//  FACTORY — Create PulseMesh Wiring Organ (v15-EVO-IMMORTAL)
// ============================================================================
//
//  Behavior:
//    • wiringFor(targetOrgan, pulse) → returns wiring surface
//    • remember(targetOrgan, pulse, outcome) → stores reflexive wiring memory
//    • snapshot() → returns wiring meta-memory for backendAI / Awareness
//
//  Memory model:
//    • internal map: wiringKey → { surface, successCount, failureCount, band, presenceTag, advantage }
//    • deterministic fallback: if failures dominate → safeFallback
//    • presence-aware: wiring memory is band + presenceTag scoped
//    • advantage-aware: tracks binary/factored preference usage
// ============================================================================

export function createPulseMeshWiring({ log } = {}) {
  const memory = Object.create(null); // wiringKey → entry

  const meta = {
    layer: "PulseMeshWiring",
    role: "WIRING_ORGAN",
    version: "15-EVO-IMMORTAL",
    target: "full-mesh",
    selfRepairable: true,
    evo: {
      driftProof: true,
      patternAware: true,
      lineageAware: true,
      reflexReady: true,
      wiringReady: true,
      selfRepairReady: true,
      dualModeReady: true,
      binaryAware: true,
      symbolicAware: true,
      presenceAware: true,
      bandAware: true,
      advantageAware: true,
      unifiedAdvantageField: true,
      deterministicField: true,
      futureEvolutionReady: true
    }
  };

  function wiringFor(targetOrgan, pulse) {
    const key = buildWiringKey(targetOrgan, pulse);
    let entry = memory[key];

    if (!entry) {
      const surface = inferDefaultWiring(targetOrgan, pulse);
      entry = memory[key] = createEntry(surface, pulse);
    }

    log && log("[PulseMesh-Wiring-v15] Selecting wiring surface", {
      jobId: pulse.jobId,
      pattern: pulse.pattern,
      targetOrgan,
      lineageDepth: Array.isArray(pulse.lineage) ? pulse.lineage.length : 0,
      mode: pulse.mode || "symbolic",
      band: pulse.band || "symbolic",
      presenceTag: pulse.flags?.aura_presence_tag || "none",
      wiringKey: key,
      surface: entry.surface,
      successCount: entry.successCount,
      failureCount: entry.failureCount,
      advantage: entry.advantage
    });

    return entry.surface;
  }

  function remember(targetOrgan, pulse, outcome = "success") {
    const key = buildWiringKey(targetOrgan, pulse);
    let entry = memory[key];

    if (!entry) {
      const surface = inferDefaultWiring(targetOrgan, pulse);
      entry = memory[key] = createEntry(surface, pulse);
    }

    if (outcome === "success") {
      entry.successCount += 1;
    } else if (outcome === "failure") {
      entry.failureCount += 1;
    }

    // Advantage tracking
    const binaryBias = clamp01(pulse.flags?.aura_binary_mesh_bias ?? 0);
    const factoringBias = clamp01(pulse.flags?.aura_factoring_bias ?? 0);

    if (binaryBias > 0) {
      entry.advantage.binaryPreferenceSamples += 1;
      entry.advantage.binaryPreferenceTotal += binaryBias;
    }

    if (factoringBias > 0) {
      entry.advantage.factoringBiasSamples += 1;
      entry.advantage.factoringBiasTotal += factoringBias;
    }

    // ⭐ Self-repair: if failures dominate, switch to safeFallback
    if (entry.failureCount > entry.successCount) {
      entry.surface = "safeFallback";
    }

    log && log("[PulseMesh-Wiring-v15] Remembering wiring", {
      jobId: pulse.jobId,
      pattern: pulse.pattern,
      targetOrgan,
      mode: pulse.mode || "symbolic",
      band: pulse.band || "symbolic",
      presenceTag: pulse.flags?.aura_presence_tag || "none",
      wiringKey: key,
      surface: entry.surface,
      successCount: entry.successCount,
      failureCount: entry.failureCount,
      advantage: entry.advantage
    });

    return entry;
  }

  function createEntry(surface, pulse) {
    return {
      surface,
      successCount: 0,
      failureCount: 0,
      band: pulse.band || "symbolic",
      presenceTag: pulse.flags?.aura_presence_tag || "none",
      advantage: {
        binaryPreferenceSamples: 0,
        binaryPreferenceTotal: 0,
        factoringBiasSamples: 0,
        factoringBiasTotal: 0
      }
    };
  }

  // Snapshot for cognition / awareness / backend AI
  function snapshot() {
    const entries = [];
    for (const key in memory) {
      if (!Object.prototype.hasOwnProperty.call(memory, key)) continue;
      const e = memory[key];
      entries.push({
        key,
        surface: e.surface,
        successCount: e.successCount,
        failureCount: e.failureCount,
        band: e.band,
        presenceTag: e.presenceTag,
        advantage: {
          binaryPreferenceSamples: e.advantage.binaryPreferenceSamples,
          binaryPreferenceAvg:
            e.advantage.binaryPreferenceSamples > 0
              ? e.advantage.binaryPreferenceTotal / e.advantage.binaryPreferenceSamples
              : 0,
          factoringBiasSamples: e.advantage.factoringBiasSamples,
          factoringBiasAvg:
            e.advantage.factoringBiasSamples > 0
              ? e.advantage.factoringBiasTotal / e.advantage.factoringBiasSamples
              : 0
        }
      });
    }

    return {
      meta,
      entriesCount: entries.length,
      entries
    };
  }

  return {
    PulseRole,
    meta,
    wiringFor,
    remember,
    snapshot
  };
}
