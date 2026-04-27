// ============================================================================
// FILE: /apps/PulseOS/Organs/Instincts/PulseOSSurvivalInstincts.js
// PULSE OS — v11-Evo-Prime
// “THE SURVIVAL INSTINCTS / ORGANISM IDENTITY ANCHOR”
// STRUCTURAL MEMORY • ORGANISM SIGNATURE • EVOLUTION SENTINEL
// ============================================================================
//
// ORGAN IDENTITY (v11-Evo-Prime):
//   • Organ Type: Instincts / Structural Memory
//   • Layer: Instinct Layer (I‑Layer)
//   • Biological Analog: Survival instincts + structural organism memory
//   • System Role: Remember last safe organism configuration + detect evolution
//
// SAFETY CONTRACT (v11-Evo-Prime):
//   • Pure structural memory — NEVER mutate impulses
//   • Never compute payloads or business logic
//   • Never depend on filenames or pages
//   • Store structure, not state
//   • Zero timestamps, zero randomness, zero timers
//   • Zero network, zero routing, zero environment access
//   • Safe for organisms that grow new layers over time
//   • Deterministic: same snapshot → same signature
// ============================================================================
export const PulseOSSurvivalInstinctsMeta = Object.freeze({
  layer: "PulseOSSurvivalInstincts",
  role: "STRUCTURAL_MEMORY_ORGAN",
  version: "v11.2-EVO-BINARY-MAX",
  identity: "PulseOSSurvivalInstincts-v11.2-EVO-BINARY-MAX",

  guarantees: Object.freeze({
    deterministic: true,
    driftProof: true,
    multiInstanceReady: true,

    // Structural memory laws
    structuralMemoryOrgan: true,
    organismIdentityAnchor: true,
    survivalInstincts: true,
    evolutionSentinel: true,
    lastSafeConfigurationKeeper: true,
    structuralSignatureBuilder: true,
    lineageAware: true,
    organismGrowthSafe: true,

    // Execution prohibitions
    zeroMutationOfImpulses: true,
    zeroBusinessLogic: true,
    zeroPayloadCompute: true,
    zeroTimestamps: true,
    zeroRandomness: true,
    zeroTimers: true,
    zeroNetwork: true,
    zeroRouting: true,
    zeroEnvironmentAccess: true,
    zeroExternalMutation: true,
    zeroDynamicImports: true,
    zeroEval: true,

    // Awareness
    symbolicAware: true,
    binaryAware: true,
    dualModeAware: true,

    // Environment
    worldLensAware: false
  }),

  contract: Object.freeze({
    input: [
      "OrganismStructure",
      "RouteDNA",
      "EvolutionContext",
      "DualBandContext"
    ],
    output: [
      "StructuralSignature",
      "EvolutionDetection",
      "InstinctsDiagnostics",
      "InstinctsHealingState"
    ]
  }),

  lineage: Object.freeze({
    root: "PulseOS-v11-EVO",
    parent: "PulseOS-v11.2-EVO",
    ancestry: [
      "PulseOSSurvivalInstincts-v9",
      "PulseOSSurvivalInstincts-v10",
      "PulseOSSurvivalInstincts-v11",
      "PulseOSSurvivalInstincts-v11-Evo",
      "PulseOSSurvivalInstincts-v11-Evo-Prime"
    ]
  }),

  bands: Object.freeze({
    supported: ["symbolic", "binary"],
    default: "symbolic",
    behavior: "structural-memory"
  }),

  architecture: Object.freeze({
    pattern: "A-B-A",
    baseline: "organism structure → structural signature → evolution detection",
    adaptive: "binary-tagged structural overlays",
    return: "deterministic structural memory + signatures"
  })
});


// ============================================================================
// INTERNAL MEMORY STORE (long-term structural memory)
// ============================================================================
const _store = {
  pathway: null,
  signature: null,
  history: [],
  lastLearnedRouteId: null,
  evolutionCount: 0
};


// ============================================================================
// HELPERS — cloning + signature building
// ============================================================================
function clone(obj) {
  return obj == null ? obj : JSON.parse(JSON.stringify(obj));
}

// Hybrid core: OS + GPU + Orchestrator + Brain + Router (no tiny organs)
function extractOrganismCore(snapshot = {}) {
  const core = snapshot.organismCore || snapshot.core || {};

  return {
    osKernelVersion: core.osKernelVersion || null,
    binaryKernelVersion: core.binaryKernelVersion || null,
    gpuOrganVersion: core.gpuOrganVersion || null,
    binaryGpuOrganVersion: core.binaryGpuOrganVersion || null,
    orchestratorVersion: core.orchestratorVersion || null,
    brainVersion: core.brainVersion || null,
    routerVersion: core.routerVersion || null
  };
}

function extractExecutionContext(snapshot = {}) {
  const ec = snapshot.executionContext || snapshot.gpuExecutionContext || {};
  return {
    binaryMode: ec.binaryMode || "auto",
    pipelineId: ec.pipelineId || "",
    sceneType: ec.sceneType || "",
    workloadClass: ec.workloadClass || "",
    resolution: ec.resolution || "",
    refreshRate: typeof ec.refreshRate === "number" ? ec.refreshRate : 0,
    dispatchSignature: ec.dispatchSignature || snapshot.dispatchSignature || "",
    shapeSignature: ec.shapeSignature || snapshot.shapeSignature || ""
  };
}

function extractPressure(snapshot = {}) {
  const p = snapshot.pressureSnapshot || {};
  return {
    gpuLoadPressure: typeof p.gpuLoadPressure === "number" ? p.gpuLoadPressure : 0,
    thermalPressure: typeof p.thermalPressure === "number" ? p.thermalPressure : 0,
    memoryPressure: typeof p.memoryPressure === "number" ? p.memoryPressure : 0,
    meshStormPressure: typeof p.meshStormPressure === "number" ? p.meshStormPressure : 0,
    auraTension: typeof p.auraTension === "number" ? p.auraTension : 0
  };
}

function computePathwaySignature(hops) {
  return hops
    .map((h) =>
      `${h.layerId || "X"}:${h.layerVersion || "?"}:` +
      `${h.organId || h.organ || "?"}:${h.role || "?"}`
    )
    .join("|");
}

function computeCoreSignature(core) {
  return [
    core.osKernelVersion || "?",
    core.binaryKernelVersion || "?",
    core.gpuOrganVersion || "?",
    core.binaryGpuOrganVersion || "?",
    core.orchestratorVersion || "?",
    core.brainVersion || "?",
    core.routerVersion || "?"
  ].join("/");
}

function computeExecutionContextSignature(ec) {
  return [
    ec.binaryMode || "auto",
    ec.pipelineId || "",
    ec.sceneType || "",
    ec.workloadClass || "",
    ec.resolution || "",
    ec.refreshRate || 0
  ].join(":");
}

function computePressureSignature(p) {
  return [
    p.gpuLoadPressure || 0,
    p.thermalPressure || 0,
    p.memoryPressure || 0,
    p.meshStormPressure || 0,
    p.auraTension || 0
  ].join(":");
}

// FULL organism-wide structural signature (hybrid)
function computeSignatureFromSnapshot(snapshot) {
  const hops = snapshot?.pathway?.hops || [];
  const pathwaySig = computePathwaySignature(hops);

  const core = extractOrganismCore(snapshot);
  const coreSig = computeCoreSignature(core);

  const ec = extractExecutionContext(snapshot);
  const ecSig = computeExecutionContextSignature(ec);

  const p = extractPressure(snapshot);
  const pSig = computePressureSignature(p);

  const dispatchSig = ec.dispatchSignature || "";
  const shapeSig = ec.shapeSignature || "";

  return [
    pathwaySig,
    coreSig,
    ecSig,
    `${dispatchSig}|${shapeSig}`,
    pSig
  ].join("#");
}

function signaturesMatch(a, b) {
  return a === b;
}


// ============================================================================
// SURVIVAL INSTINCT ENGINE — v11-Evo-Prime (Organism-Wide)
// ============================================================================
export const PulseOSSurvivalInstincts = {

  meta: {
    organ: "PulseOSSurvivalInstincts",
    layer: "Instinct Layer",
    role: "Structural Memory / Organism Identity Anchor",
    version: "11.0-Evo-Prime",
    generation: "v11",
    evo: {
      driftProof: true,
      deterministicNeuron: true,
      unifiedAdvantageField: true,
      multiInstanceReady: true,
      zeroNetwork: true,
      zeroMutation: true,
      zeroTiming: true,
      futureEvolutionReady: true,

      organismWideAnchor: true,
      binaryAware: true,
      symbolicAware: true,
      gpuDispatchAware: true,
      gpuMemoryAware: true
    }
  },

  // --------------------------------------------------------------------------
  // RECORD IMPULSE — organism-wide structural memory only
  // --------------------------------------------------------------------------
  recordImpulse(snapshot) {
    if (!snapshot || !Array.isArray(snapshot?.pathway?.hops)) return;

    const hops = snapshot.pathway.hops;
    const newSignature = computeSignatureFromSnapshot(snapshot);

    // FIRST DISCOVERY
    if (!_store.pathway) {
      _store.pathway = clone(hops);
      _store.signature = newSignature;

      _store.history.push({
        index: 0,
        event: "INITIAL_DISCOVERY",
        signature: newSignature,
        pathway: clone(hops),
        core: extractOrganismCore(snapshot),
        executionContext: extractExecutionContext(snapshot),
        pressure: extractPressure(snapshot),
        tickId: snapshot.tickId || null
      });

      return;
    }

    // NO EVOLUTION
    if (signaturesMatch(_store.signature, newSignature)) {
      return;
    }

    // EVOLUTION DETECTED
    const oldSignature = _store.signature;
    const oldPathway = clone(_store.pathway);
    const oldCore = _store.history.length
      ? clone(_store.history[_store.history.length - 1].core)
      : null;

    _store.evolutionCount += 1;

    const eventIndex = _store.history.length;

    _store.history.push({
      index: eventIndex,
      event: "EVOLUTION_DETECTED",
      oldSignature,
      newSignature,
      oldPathway,
      newPathway: clone(hops),
      oldCore,
      newCore: extractOrganismCore(snapshot),
      executionContext: extractExecutionContext(snapshot),
      pressure: extractPressure(snapshot),
      tickId: snapshot.tickId || null
    });

    _store.pathway = clone(hops);
    _store.signature = newSignature;
  },

  // --------------------------------------------------------------------------
  // ACCESSORS
  // --------------------------------------------------------------------------
  getPathway() {
    return clone(_store.pathway || []);
  },

  getHistory() {
    return clone(_store.history);
  },

  getEvolutionCount() {
    return _store.evolutionCount;
  },

  hasEvolved(snapshot) {
    if (!snapshot || !Array.isArray(snapshot?.pathway?.hops)) return false;
    const newSignature = computeSignatureFromSnapshot(snapshot);
    return !signaturesMatch(_store.signature, newSignature);
  },

  setLearnedRouteId(routeId) {
    _store.lastLearnedRouteId = routeId;
  },

  getLearnedRouteId() {
    return _store.lastLearnedRouteId;
  },

  clear() {
    _store.pathway = null;
    _store.signature = null;
    _store.history = [];
    _store.lastLearnedRouteId = null;
    _store.evolutionCount = 0;
  }
};
