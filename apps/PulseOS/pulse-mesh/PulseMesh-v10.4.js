// ============================================================================
//  PulseMesh-v10.4
//  Deterministic Pathway Engine • Pulse-Agnostic • Evolution-Aware
// ============================================================================
//
//  WHAT THIS ORGAN IS:
//  --------------------
//  • The wiring / pathway engine for the organism.
//  • Given a targetOrgan + mode, returns a deterministic pathway descriptor.
//  • Pulse-agnostic: works with Pulse v1, v2, v3.
//  • Pattern-aware, lineage-aware (via optional pulse), mode-aware.
//  • Zero randomness, zero timestamps, zero external mutation.
//
//  WHAT THIS ORGAN IS NOT:
//  ------------------------
//  • Not a router (PulseRouter chooses the target organ).
//  • Not a mover (PulseSendMover performs movement).
//  • Not a compute engine.
//  • Not a healer or brain.
//  • Not a network layer.
//
//  SAFETY CONTRACT (v10.4):
//  ------------------------
//  • No imports.
//  • No randomness.
//  • No timestamps.
//  • No external mutation.
//  • Pure deterministic pathway selection.
// ============================================================================


// ============================================================================
// ⭐ PulseRole — identifies this as the PulseMesh Organ (v10.4)
// ============================================================================
export const PulseRole = {
  type: "Mesh",
  subsystem: "PulseMesh",
  layer: "PathwayEngine",
  version: "10.4",
  identity: "PulseMesh-v10.4",

  evo: {
    driftProof: true,
    patternAware: true,
    lineageAware: true,
    modeAware: true,
    identityAware: true,
    advantageAware: true,
    deterministicPathways: true,
    futureEvolutionReady: true,

    unifiedAdvantageField: true,
    pulseMesh10Ready: true
  },

  pulseContract: "Pulse-v1/v2/v3",
  routerContract: "PulseRouter-v10.4",
  sendContract: "PulseSend-v10.4"
};


// ============================================================================
//  INTERNAL: Pathway profiles (deterministic, static)
// ============================================================================
//
//  These are abstract pathway “styles” the system can choose from.
//  They are NOT network routes — just internal wiring descriptors.
// ============================================================================

const BASE_PATHWAYS = {
  GPU: {
    style: "direct-burst",
    hops: ["Kernel", "GPUCluster", "GPUWorker"],
    reliability: 0.98
  },
  Earn: {
    style: "credit-chain",
    hops: ["Kernel", "EarnCore", "Ledger"],
    reliability: 0.97
  },
  OS: {
    style: "system-bridge",
    hops: ["Kernel", "OSBridge"],
    reliability: 0.99
  },
  Mesh: {
    style: "intra-mesh",
    hops: ["MeshHub"],
    reliability: 0.995
  },
  DEFAULT: {
    style: "neutral",
    hops: ["Kernel"],
    reliability: 0.96
  }
};


// ============================================================================
//  INTERNAL: Deterministic pathway selection
// ============================================================================
//
//  Inputs:
//    • targetOrgan (string)
//    • mode (string)
//    • optional pulse (for diagnostics / future use)
//
//  Output:
//    • pathway descriptor object
// ============================================================================

function buildPathway(targetOrgan, mode, pulse) {
  const organKey = targetOrgan || "DEFAULT";
  const base = BASE_PATHWAYS[organKey] || BASE_PATHWAYS.DEFAULT;

  const modeLabel = mode || "normal";

  // Deterministic mode bias (no randomness)
  let modeBias = "neutral";
  if (modeLabel === "stress") modeBias = "low-latency";
  else if (modeLabel === "drain") modeBias = "low-energy";
  else if (modeLabel === "recovery") modeBias = "high-reliability";

  const lineageDepth = Array.isArray(pulse?.lineage) ? pulse.lineage.length : 0;
  const pattern = pulse?.pattern || "UNKNOWN_PATTERN";
  const pulseType = pulse?.pulseType || pulse?.PulseRole?.identity || "UNKNOWN_PULSE_TYPE";

  return {
    meshRole: PulseRole,
    targetOrgan: organKey,
    style: base.style,
    hops: base.hops.slice(), // copy to avoid mutation
    reliability: base.reliability,
    mode: modeLabel,
    modeBias,
    diagnostics: {
      pattern,
      lineageDepth,
      pulseType
    }
  };
}


// ============================================================================
//  PUBLIC API — PulseMesh (v10.4)
// ============================================================================
export const PulseMesh = {

  PulseRole,

  // --------------------------------------------------------------------------
  //  pathwayFor(targetOrgan, mode, pulse?)
  // --------------------------------------------------------------------------
  //
  //  Primary contract used by PulseSend / ReturnArc / Impulse.
  //  pulse is optional; when provided, it is only read, never mutated.
  // --------------------------------------------------------------------------
  pathwayFor(targetOrgan, mode = "normal", pulse = null) {
    return buildPathway(targetOrgan, mode, pulse);
  },

  // --------------------------------------------------------------------------
  //  diagnostics() — optional introspection
  // --------------------------------------------------------------------------
  diagnostics() {
    return {
      PulseRole,
      basePathways: BASE_PATHWAYS
    };
  }
};
