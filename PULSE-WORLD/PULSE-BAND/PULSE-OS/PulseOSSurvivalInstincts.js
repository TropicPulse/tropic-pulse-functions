// ============================================================================
// FILE: /PulseOS/Organs/Instincts/PulseOSSurvivalInstincts.js
// PULSE OS — v12.3-Evo-Presence-Max
// “THE SURVIVAL INSTINCTS / ORGANISM IDENTITY ANCHOR”
// STRUCTURAL MEMORY • ORGANISM SIGNATURE • EVOLUTION SENTINEL
// CHUNKED ROUTE-DNA CACHE • PREWARMED MULTI-PRESENCE SNAPSHOTS
// ============================================================================
//
// ORGAN IDENTITY (v12.3-Evo-Presence-Max):
//   • Organ Type: Instincts / Structural Memory
//   • Layer: Instinct Layer (I‑Layer)
//   • Biological Analog: Survival instincts + structural organism memory
//   • System Role: Remember last safe organism configuration + detect evolution
//                  + prewarm structural signatures across presences / routes.
//
// SAFETY CONTRACT (v12.3-Evo-Presence-Max):
//   • Pure structural memory — NEVER mutate impulses
//   • Never compute payloads or business logic
//   • Never depend on filenames or pages
//   • Store structure, not stateful runtime
//   • Zero timestamps, zero randomness, zero timers
//   • Zero network, zero routing, zero environment access
//   • Safe for organisms that grow new layers over time
//   • Deterministic: same snapshot → same signature
//   • Prewarm + chunking are purely structural, offline-absolute
// ============================================================================

export const PulseOSSurvivalInstinctsMeta = Object.freeze({
  layer: "PulseOSSurvivalInstincts",
  role: "STRUCTURAL_MEMORY_ORGAN",
  version: "v12.3-EVO-PRESENCE-MAX",
  identity: "PulseOSSurvivalInstincts-v12.3-EVO-PRESENCE-MAX",

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

    // Presence + chunking
    multiPresenceAware: true,
    routeDNACacheAware: true,
    structuralChunkCache: true,
    prewarmReady: true,
    offlinePrewarmOnly: true,

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
      "DualBandContext",
      "PresenceContext",
      "PrewarmChunks"
    ],
    output: [
      "StructuralSignature",
      "EvolutionDetection",
      "InstinctsDiagnostics",
      "InstinctsHealingState",
      "PrewarmedRouteDNACache",
      "PresenceStructuralMap"
    ]
  }),

  lineage: Object.freeze({
    root: "PulseOS-v12-EVO",
    parent: "PulseOS-v12.3-EVO-PRESENCE",
    ancestry: [
      "PulseOSSurvivalInstincts-v9",
      "PulseOSSurvivalInstincts-v10",
      "PulseOSSurvivalInstincts-v11",
      "PulseOSSurvivalInstincts-v11-Evo",
      "PulseOSSurvivalInstincts-v11-Evo-Prime",
      "PulseOSSurvivalInstincts-v12-Evo",
      "PulseOSSurvivalInstincts-v12.3-Evo-Presence-Max"
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
    adaptive: "binary-tagged structural overlays + prewarmed route-DNA chunks + multi-presence map",
    return: "deterministic structural memory + signatures + prewarmed caches"
  })
});

// ============================================================================
// INTERNAL MEMORY STORE (long-term structural memory + prewarm + presence)
// ============================================================================
const _store = {
  pathway: null,
  signature: null,
  history: [],
  lastLearnedRouteId: null,
  evolutionCount: 0,

  // Route-DNA chunk cache: { routeId: { signature, pathway, core, ec, pressure } }
  routeDNACache: Object.create(null),

  // Structural chunks keyed by chunkId (pure structural slices)
  structuralChunks: Object.create(null),

  // Multi-presence structural mirrors: { presenceId: { snapshot, signature } }
  presenceMap: Object.create(null)
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

// Build a deterministic route-DNA key from snapshot / route context
function buildRouteDNAKey(routeDNA = {}) {
  const id = routeDNA.routeId || routeDNA.routeName || "";
  const band = routeDNA.modeKind || "symbolic";
  const ext = routeDNA.extensionId || "";
  const sys = routeDNA.systemId || "";
  return [id, band, ext, sys].join("::");
}

// Build a deterministic presence key
function buildPresenceKey(presenceContext = {}) {
  const device = presenceContext.deviceId || "";
  const scene = presenceContext.sceneType || "";
  const profile = presenceContext.profileId || "";
  return [device, scene, profile].join("::");
}

// Chunk structural pathway into deterministic slices (no timing, no randomness)
function chunkPathway(hops, chunkSize) {
  if (!Array.isArray(hops) || chunkSize <= 0) return [];
  const chunks = [];
  for (let i = 0; i < hops.length; i += chunkSize) {
    const slice = hops.slice(i, i + chunkSize);
    chunks.push(slice);
  }
  return chunks;
}

// ============================================================================
// SURVIVAL INSTINCT ENGINE — v12.3-Evo-Presence-Max (Organism-Wide)
// ============================================================================
export const PulseOSSurvivalInstincts = {

  meta: {
    organ: "PulseOSSurvivalInstincts",
    layer: "Instinct Layer",
    role: "Structural Memory / Organism Identity Anchor",
    version: "12.3-Evo-Presence-Max",
    generation: "v12.3",
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
      gpuMemoryAware: true,

      multiPresenceAware: true,
      routeDNACacheAware: true,
      structuralChunkCache: true,
      prewarmReady: true
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
    if (_store.pathway == null) {
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
  // PREWARM ENGINE — route-DNA cache + structural chunks (offline-only)
  // --------------------------------------------------------------------------
  prewarmFromRouteDNA(routeDNAList = []) {
    if (!Array.isArray(routeDNAList)) return;

    for (const item of routeDNAList) {
      const { snapshot, routeDNA, chunkSize = 8 } = item || {};
      if (!snapshot || !Array.isArray(snapshot?.pathway?.hops)) continue;

      const key = buildRouteDNAKey(routeDNA || {});
      const signature = computeSignatureFromSnapshot(snapshot);
      const hops = clone(snapshot.pathway.hops);

      // Cache full route-DNA
      _store.routeDNACache[key] = {
        signature,
        pathway: hops,
        core: extractOrganismCore(snapshot),
        executionContext: extractExecutionContext(snapshot),
        pressure: extractPressure(snapshot)
      };

      // Chunk + cache structural slices
      const chunks = chunkPathway(hops, chunkSize);
      _store.structuralChunks[key] = chunks.map((c, idx) => ({
        chunkIndex: idx,
        hops: c
      }));
    }
  },

  getRouteDNACache(routeDNA = {}) {
    const key = buildRouteDNAKey(routeDNA);
    const entry = _store.routeDNACache[key];
    return entry ? clone(entry) : null;
  },

  getRouteChunks(routeDNA = {}) {
    const key = buildRouteDNAKey(routeDNA);
    const chunks = _store.structuralChunks[key];
    return chunks ? clone(chunks) : [];
  },

  // --------------------------------------------------------------------------
  // MULTI-PRESENCE STRUCTURAL MAP — per-device / per-scene mirrors
  // --------------------------------------------------------------------------
  registerPresence(presenceContext = {}, snapshot) {
    if (!snapshot || !Array.isArray(snapshot?.pathway?.hops)) return;
    const presenceKey = buildPresenceKey(presenceContext);
    const signature = computeSignatureFromSnapshot(snapshot);

    _store.presenceMap[presenceKey] = {
      presenceContext: clone(presenceContext),
      snapshot: clone(snapshot),
      signature
    };
  },

  getPresence(presenceContext = {}) {
    const presenceKey = buildPresenceKey(presenceContext);
    const entry = _store.presenceMap[presenceKey];
    return entry ? clone(entry) : null;
  },

  listPresences() {
    const result = [];
    for (const key of Object.keys(_store.presenceMap)) {
      const entry = _store.presenceMap[key];
      result.push({
        key,
        presenceContext: clone(entry.presenceContext),
        signature: entry.signature
      });
    }
    return result;
  },

  // --------------------------------------------------------------------------
  // ACCESSORS — legacy structural memory surface
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

  // --------------------------------------------------------------------------
  // CLEAR — full reset (structural memory + caches + presences)
// --------------------------------------------------------------------------
  clear() {
    _store.pathway = null;
    _store.signature = null;
    _store.history = [];
    _store.lastLearnedRouteId = null;
    _store.evolutionCount = 0;

    _store.routeDNACache = Object.create(null);
    _store.structuralChunks = Object.create(null);
    _store.presenceMap = Object.create(null);
  }
};
