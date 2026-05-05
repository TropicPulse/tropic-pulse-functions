// ============================================================================
// FILE: OrganismMesh-v16.js
// PULSE ORGANISM MESH — OVERMIND-PRIME ORGANISM BRAIN + GLOBAL MESH COORDINATOR
// “One page. One route. Whole organism. One mesh that knows everything.”
// ============================================================================

/*
AI_EXPERIENCE_META = {
  identity: "OrganismMesh",
  version: "v16-IMMORTAL",
  layer: "organism_mesh",
  role: "overmind_prime_organism_brain",
  lineage: "OrganismMesh-v2-MESH-COORD → v16-IMMORTAL",

  evo: {
    meshAware: true,
    presenceAware: true,
    binaryAware: true,
    dualBand: true,

    deterministic: true,
    driftProof: true,
    zeroNetworkFetch: true,
    zeroMutationOfInput: true,
    safeRouteFree: true,

    meshCoordinator: true,
    meshStateAware: true,
    meshEventsAware: true,

    organismArteryAware: true,
    organismConsciousnessAware: true,
    organismModeAware: true,

    nodeAdminAware: true,
    overmindPrimeAware: true,
    serviceGatewayAware: true,
    safetyFrameAware: true,
    earnArteryAware: true,
    reproductionArteryAware: true
  },

  contract: {
    always: [
      "symbolicMeshEnv",
      "binaryMeshEnv",
      "PulseMeshPresenceRelay",
      "PulsePresence",
      "PresenceAwareness",
      "NodeAdmin",
      "OvermindPrime",
      "ServiceGateway",
      "SafetyFrame"
    ],
    never: [
      "legacyMesh",
      "legacyPresenceRelay",
      "safeRoute",
      "fetchViaCNS",
      "directNetworkFetch",
      "directFilesystemAccess"
    ]
  }
}
*/

// NOTE (from v2):
//   “Organism DOES NOT create meshes.
//    Organism DOES NOT import mesh constructors.
//    Organism DOES NOT import environments.
//    The BARREL passes symbolicMeshEnv + binaryMeshEnv IN.
//    This file ONLY builds coordination + state on top of what is passed in.”

import { createPulseOrgans } from "./PulseMeshOrgans.js";

// ============================================================================
// META — v16-IMMORTAL
// ============================================================================
export const OrganismMeshMeta = Object.freeze({
  layer: "Organism",
  role: "OVERMIND_PRIME_ORGANISM_MESH_ROOT",
  version: "v16-IMMORTAL",
  identity: "OrganismMesh-v16-IMMORTAL",
  guarantees: Object.freeze({
    deterministic: true,
    driftProof: true,
    mutationSafe: true,
    presenceAware: true,
    bandAware: true,
    dualMesh: true,
    survivalOrgansAttached: true,
    meshCoordinatorAttached: true,
    meshStateAttached: true,
    meshEventsAttached: true,
    organismArteryAttached: true,
    organismConsciousnessAttached: true,
    organismModeEngineAttached: true,
    nodeAdminBridgeAttached: true,
    overmindPrimeBridgeAttached: true
  })
});

// ============================================================================
// INTERNAL HELPERS
// ============================================================================

function safeLog(fn, fallback) {
  if (typeof fn === "function") return fn;
  if (typeof console !== "undefined" && typeof fallback === "function") return fallback;
  return () => {};
}

function freezeClone(obj) {
  return Object.freeze({ ...(obj || {}) });
}

function clamp(v, min, max) {
  return v < min ? min : v > max ? max : v;
}

function bucketLevel(v) {
  if (v >= 0.9) return "elite";
  if (v >= 0.75) return "high";
  if (v >= 0.5) return "medium";
  if (v >= 0.25) return "low";
  return "critical";
}

function bucketPressure(v) {
  if (v >= 0.9) return "overload";
  if (v >= 0.7) return "high";
  if (v >= 0.4) return "medium";
  if (v > 0) return "low";
  return "none";
}

function bucketCost(v) {
  if (v >= 0.8) return "heavy";
  if (v >= 0.5) return "moderate";
  if (v >= 0.2) return "light";
  if (v > 0) return "negligible";
  return "none";
}

// ============================================================================
// ORGANISM ARTERY v4 — GLOBAL ORGANISM-LEVEL ARTERY
//   • Synthesizes symbolic, binary, safety, service, earn, reproduction, presence.
//   • Purely derived metrics; no side effects.
// ============================================================================

function createOrganismArtery({ trace, log }) {
  let windowStart = Date.now();
  let windowMs = 60000;

  let calls = 0;
  let errors = 0;
  let slowCalls = 0;

  let totalCalls = 0;
  let totalErrors = 0;

  let slowThresholdMs = 1500;

  function rollWindow(now) {
    if (now - windowStart >= windowMs) {
      windowStart = now;
      calls = 0;
      errors = 0;
      slowCalls = 0;
    }
  }

  function recordCall(durationMs, isError) {
    const now = Date.now();
    rollWindow(now);

    totalCalls += 1;
    calls += 1;

    if (isError) {
      totalErrors += 1;
      errors += 1;
    }

    if (durationMs >= slowThresholdMs) {
      slowCalls += 1;
    }
  }

  function snapshot({
    symbolicArtery = null,
    binaryArtery = null,
    nodeAdminArtery = null,
    serviceGatewayArtery = null,
    safetyFrameArtery = null,
    earnArtery = null,
    reproductionArtery = null,
    presenceMetrics = null,
    meshStateMetrics = null
  } = {}) {
    const now = Date.now();
    rollWindow(now);

    const elapsedMs = Math.max(1, now - windowStart);
    const callsPerMs = calls / elapsedMs;
    const callsPerSec = callsPerMs * 1000;

    const errorRate = calls > 0 ? Math.min(1, errors / calls) : 0;
    const slowRate = calls > 0 ? Math.min(1, slowCalls / calls) : 0;

    const symbolicLoad = symbolicArtery?.pressure ?? 0;
    const binaryLoad = binaryArtery?.pressure ?? 0;
    const nodeAdminLoad = nodeAdminArtery?.pressure ?? 0;
    const serviceLoad = serviceGatewayArtery?.pressure ?? 0;
    const safetyLoad = safetyFrameArtery?.pressure ?? 0;
    const earnLoad = earnArtery?.pressure ?? 0;
    const reproductionLoad = reproductionArtery?.pressure ?? 0;

    const avgSubsystemPressure = (
      symbolicLoad +
      binaryLoad +
      nodeAdminLoad +
      serviceLoad +
      safetyLoad +
      earnLoad +
      reproductionLoad
    ) / 7;

    const presenceDensity = presenceMetrics?.density ?? 0;
    const presenceVolatility = presenceMetrics?.volatility ?? 0;

    const meshResourceCount = meshStateMetrics?.resourceCount ?? 0;
    const meshChunkCount = meshStateMetrics?.chunkCount ?? 0;
    const meshReadyCount = meshStateMetrics?.readyCount ?? 0;

    const loadFactor = Math.min(1, (avgSubsystemPressure + errorRate + slowRate) / 3);
    const pressure = loadFactor;

    const throughputBase = Math.max(0, 1 - pressure);
    const throughput = Math.max(0, Math.min(1, throughputBase));

    const cost = Math.max(0, Math.min(1, pressure * (1 - throughput)));
    const budget = Math.max(0, Math.min(1, throughput - cost));

    const artery = Object.freeze({
      windowMs,
      windowCalls: calls,
      windowErrors: errors,
      windowSlowCalls: slowCalls,
      totalCalls,
      totalErrors,
      callsPerSec,
      errorRate,
      slowRate,

      pressure,
      throughput,
      cost,
      budget,

      pressureBucket: bucketPressure(pressure),
      throughputBucket: bucketLevel(throughput),
      costBucket: bucketCost(cost),
      budgetBucket: bucketLevel(budget),

      subsystems: {
        symbolic: symbolicArtery,
        binary: binaryArtery,
        nodeAdmin: nodeAdminArtery,
        serviceGateway: serviceGatewayArtery,
        safetyFrame: safetyFrameArtery,
        earn: earnArtery,
        reproduction: reproductionArtery
      },

      presence: {
        density: presenceDensity,
        volatility: presenceVolatility
      },

      meshState: {
        resourceCount: meshResourceCount,
        chunkCount: meshChunkCount,
        readyCount: meshReadyCount
      }
    });

    if (trace) {
      log?.("[OrganismMesh] Artery snapshot", artery);
    }

    return artery;
  }

  return Object.freeze({
    recordCall,
    snapshot
  });
}

// ============================================================================
// ORGANISM CONSCIOUSNESS SNAPSHOT — v16-IMMORTAL
//   • Derived from organism artery + mesh state + presence + modes.
//   • Purely descriptive; no side effects.
// ============================================================================

function createOrganismConsciousness({ trace, log }) {
  function compute({
    artery,
    meshStateMetrics,
    presenceMetrics,
    organismMode
  }) {
    const pressure = artery?.pressure ?? 0;
    const errorRate = artery?.errorRate ?? 0;
    const slowRate = artery?.slowRate ?? 0;
    const throughput = artery?.throughput ?? 0;
    const budget = artery?.budget ?? 0;

    const resourceCount = meshStateMetrics?.resourceCount ?? 0;
    const readyCount = meshStateMetrics?.readyCount ?? 0;
    const chunkCount = meshStateMetrics?.chunkCount ?? 0;

    const presenceDensity = presenceMetrics?.density ?? 0;
    const presenceVolatility = presenceMetrics?.volatility ?? 0;

    const stabilityIndex = clamp(
      (throughput * 0.4) +
      (budget * 0.3) +
      ((1 - errorRate) * 0.2) +
      ((1 - slowRate) * 0.1),
      0,
      1
    );

    const entropyIndex = clamp(
      (pressure * 0.4) +
      (errorRate * 0.3) +
      (slowRate * 0.2) +
      (presenceVolatility * 0.1),
      0,
      1
    );

    const expansionReadiness = clamp(
      (budget * 0.5) +
      (stabilityIndex * 0.3) +
      (presenceDensity * 0.2),
      0,
      1
    );

    const recoveryNeed = clamp(
      (pressure * 0.5) +
      (entropyIndex * 0.3) +
      ((1 - stabilityIndex) * 0.2),
      0,
      1
    );

    const consciousness = Object.freeze({
      organismMode,
      stabilityIndex,
      entropyIndex,
      expansionReadiness,
      recoveryNeed,

      artery: {
        pressure,
        throughput,
        budget,
        errorRate,
        slowRate,
        pressureBucket: artery?.pressureBucket,
        throughputBucket: artery?.throughputBucket,
        budgetBucket: artery?.budgetBucket
      },

      mesh: {
        resourceCount,
        readyCount,
        chunkCount
      },

      presence: {
        density: presenceDensity,
        volatility: presenceVolatility
      }
    });

    if (trace) {
      log?.("[OrganismMesh] Consciousness snapshot", consciousness);
    }

    return consciousness;
  }

  return Object.freeze({
    compute
  });
}

// ============================================================================
// ORGANISM MODE ENGINE — v16-IMMORTAL
//   • Advisory-only organism-level mode.
//   • Uses artery + consciousness to pick a mode.
// ============================================================================

function createOrganismModeEngine({ trace, log }) {
  const MODES = Object.freeze([
    "idle",
    "stable",
    "elevated",
    "high-pressure",
    "critical",
    "expansion",
    "recovery",
    "cooling",
    "harmonizing"
  ]);

  function selectMode({ artery, consciousness }) {
    const pressure = artery?.pressure ?? 0;
    const stability = consciousness?.stabilityIndex ?? 0;
    const entropy = consciousness?.entropyIndex ?? 0;
    const expansionReadiness = consciousness?.expansionReadiness ?? 0;
    const recoveryNeed = consciousness?.recoveryNeed ?? 0;

    let mode = "idle";

    if (pressure < 0.2 && stability > 0.8) {
      mode = "stable";
    } else if (pressure < 0.4 && stability > 0.6) {
      mode = "elevated";
    } else if (pressure >= 0.4 && pressure < 0.7) {
      mode = "high-pressure";
    } else if (pressure >= 0.7) {
      mode = "critical";
    }

    if (expansionReadiness > 0.7 && pressure < 0.6 && stability > 0.6) {
      mode = "expansion";
    }

    if (recoveryNeed > 0.6 && pressure > 0.4) {
      mode = "recovery";
    }

    if (entropy < 0.3 && pressure < 0.4 && stability > 0.7) {
      mode = "cooling";
    }

    if (entropy > 0.4 && pressure < 0.6) {
      mode = "harmonizing";
    }

    if (trace) {
      log?.("[OrganismMesh] Mode selected", { mode, pressure, stability, entropy });
    }

    return { mode, modes: MODES };
  }

  return Object.freeze({
    MODES,
    selectMode
  });
}

// ============================================================================
// MESH STATE v16 — RESOURCE / CHUNK / LANE STATE
// ============================================================================

function createMeshState() {
  const resources = new Map(); // resourceId -> { state, chunks: Set<chunkId>, lanes: Set<laneId>, meta }
  const laneWork  = new Map(); // laneId -> Set<resourceId>

  function getResource(resourceId) {
    return resources.get(resourceId) || null;
  }

  function ensureResource(resourceId) {
    let r = resources.get(resourceId);
    if (!r) {
      r = {
        id: resourceId,
        state: "pending",
        chunks: new Set(),
        lanes: new Set(),
        meta: Object.create(null)
      };
      resources.set(resourceId, r);
    }
    return r;
  }

  function assignLane(resourceId, laneId) {
    const r = ensureResource(resourceId);
    r.lanes.add(laneId);
    r.state = r.state === "pending" ? "chunking" : r.state;

    if (!laneWork.has(laneId)) laneWork.set(laneId, new Set());
    laneWork.get(laneId).add(resourceId);
  }

  function releaseLane(resourceId, laneId) {
    const r = resources.get(resourceId);
    if (r) {
      r.lanes.delete(laneId);
    }
    const work = laneWork.get(laneId);
    if (work) {
      work.delete(resourceId);
      if (work.size === 0) laneWork.delete(laneId);
    }
  }

  function addChunk(resourceId, chunkId) {
    const r = ensureResource(resourceId);
    r.chunks.add(chunkId);
    return r;
  }

  function setState(resourceId, state) {
    const r = ensureResource(resourceId);
    r.state = state;
    return r;
  }

  function markStale(resourceId) {
    const r = ensureResource(resourceId);
    r.state = "stale";
    r.chunks.clear();
    r.lanes.clear();
    return r;
  }

  function snapshotResource(resourceId) {
    const r = resources.get(resourceId);
    if (!r) return null;
    return Object.freeze({
      id: r.id,
      state: r.state,
      chunks: Object.freeze(Array.from(r.chunks)),
      lanes: Object.freeze(Array.from(r.lanes)),
      meta: freezeClone(r.meta)
    });
  }

  function snapshotAll() {
    const out = [];
    for (const r of resources.values()) {
      out.push(snapshotResource(r.id));
    }
    return Object.freeze(out);
  }

  function metrics() {
    let resourceCount = 0;
    let readyCount = 0;
    let chunkCount = 0;

    for (const r of resources.values()) {
      resourceCount += 1;
      if (r.state === "ready") readyCount += 1;
      chunkCount += r.chunks.size;
    }

    return Object.freeze({
      resourceCount,
      readyCount,
      chunkCount
    });
  }

  return Object.freeze({
    getResource,
    ensureResource,
    assignLane,
    releaseLane,
    addChunk,
    setState,
    markStale,
    snapshotResource,
    snapshotAll,
    metrics
  });
}

// ============================================================================
// MESH EVENTS v16 — ORGANISM-LEVEL EVENT BUS
// ============================================================================

function createMeshEvents({ warn }) {
  const listeners = new Map(); // eventName -> Set<fn>

  function on(eventName, handler) {
    if (typeof handler !== "function") return () => {};
    if (!listeners.has(eventName)) listeners.set(eventName, new Set());
    const set = listeners.get(eventName);
    set.add(handler);
    return () => {
      set.delete(handler);
      if (set.size === 0) listeners.delete(eventName);
    };
  }

  function emit(eventName, payload) {
    const set = listeners.get(eventName);
    if (!set || set.size === 0) return;
    for (const fn of set) {
      try {
        fn(payload);
      } catch (e) {
        warn("[OrganismMesh] meshEvents handler failed", {
          eventName,
          error: e?.message
        });
      }
    }
  }

  return Object.freeze({
    on,
    emit
  });
}

// ============================================================================
// MESH COORDINATOR v16 — GLOBAL CHUNK/RESOURCE COORDINATOR
// ============================================================================

function createMeshCoordinator({ meshState, meshEvents, tlog }) {
  function requestWork(resourceId, laneId) {
    if (!resourceId && resourceId !== 0) return null;
    if (laneId === undefined || laneId === null) return null;

    const existing = meshState.getResource(resourceId);

    if (existing && existing.state === "ready") {
      tlog("requestWork: resource already ready", { resourceId, laneId });
      return null;
    }

    if (
      existing &&
      existing.state === "chunking" &&
      existing.lanes.size > 0 &&
      !existing.lanes.has(laneId)
    ) {
      tlog("requestWork: resource already chunking on other lane", {
        resourceId,
        laneId,
        lanes: Array.from(existing.lanes)
      });
      return null;
    }

    const r = meshState.ensureResource(resourceId);
    meshState.assignLane(resourceId, laneId);
    meshState.setState(resourceId, "chunking");

    meshEvents.emit("MESH_RESOURCE_ASSIGNED", {
      resourceId,
      laneId
    });

    return meshState.snapshotResource(resourceId);
  }

  function reportChunkDone({ resourceId, laneId, chunkId }) {
    if (!resourceId && resourceId !== 0) return null;
    if (!chunkId && chunkId !== 0) return null;

    const r = meshState.addChunk(resourceId, chunkId);
    meshState.releaseLane(resourceId, laneId);

    meshEvents.emit("MESH_CHUNK_DONE", {
      resourceId,
      laneId,
      chunkId
    });

    return meshState.snapshotResource(resourceId);
  }

  function markResourceReady(resourceId) {
    const r = meshState.setState(resourceId, "ready");
    meshEvents.emit("MESH_RESOURCE_READY", {
      resourceId,
      chunks: Array.from(r.chunks)
    });
    return meshState.snapshotResource(resourceId);
  }

  function markResourceStale(resourceId) {
    const r = meshState.markStale(resourceId);
    meshEvents.emit("MESH_RESOURCE_STALE", {
      resourceId
    });
    return meshState.snapshotResource(resourceId);
  }

  function getResourceView(resourceId) {
    return meshState.snapshotResource(resourceId);
  }

  function getAllResources() {
    return meshState.snapshotAll();
  }

  return Object.freeze({
    requestWork,
    reportChunkDone,
    markResourceReady,
    markResourceStale,
    getResourceView,
    getAllResources
  });
}

// ============================================================================
// ORGANISM MESH FACTORY — v16-IMMORTAL
// ============================================================================

export function createOrganismMesh({
  context = {},
  symbolicMeshEnv,   // PASSED IN BY BARREL
  binaryMeshEnv,     // PASSED IN BY BARREL
  nodeAdminBridge = null,   // { getArtery?, getSnapshot? }
  overmindPrimeBridge = null, // { emit?, pullDirectives? }
  serviceGatewayBridge = null, // { getArtery? }
  safetyFrameBridge = null,    // { getArtery? }
  earnBridge = null,           // { getArtery? }
  reproductionBridge = null,   // { getArtery? }
  trace = false
} = {}) {

  const log   = context.log   || safeLog(globalThis?.log, console?.log);
  const warn  = context.warn  || safeLog(globalThis?.warn, console?.warn);

  const tlog = trace ? (...args) => log("[OrganismMesh]", ...args) : () => {};

  // -------------------------------------------------------------------------
  // 1) SURVIVAL ORGANS
  // -------------------------------------------------------------------------
  const survivalOrgans = createPulseOrgans();

  // -------------------------------------------------------------------------
  // 2) MESH STATE + EVENTS + COORDINATOR
  // -------------------------------------------------------------------------
  const meshState = createMeshState();
  const meshEvents = createMeshEvents({ warn });
  const meshCoordinator = createMeshCoordinator({ meshState, meshEvents, tlog });

  // -------------------------------------------------------------------------
  // 3) ORGANISM ARTERY + CONSCIOUSNESS + MODE ENGINE
  // -------------------------------------------------------------------------
  const organismArtery = createOrganismArtery({ trace, log });
  const organismConsciousness = createOrganismConsciousness({ trace, log });
  const organismModeEngine = createOrganismModeEngine({ trace, log });

  let lastArterySnapshot = null;
  let lastConsciousnessSnapshot = null;
  let lastOrganismMode = "idle";

  // -------------------------------------------------------------------------
  // 4) PRESENCE / WORLD METRICS (symbolic-only, metadata-only)
// -------------------------------------------------------------------------
  function computePresenceMetrics() {
    const presenceRelay = symbolicMeshEnv?.meshPresenceRelay;
    const socialGraph = symbolicMeshEnv?.socialGraph;

    let density = 0;
    let volatility = 0;

    try {
      if (presenceRelay?.getPresenceMetrics) {
        const m = presenceRelay.getPresenceMetrics();
        density = Number(m?.density || 0);
        volatility = Number(m?.volatility || 0);
      } else if (socialGraph?.metrics) {
        const m = socialGraph.metrics();
        density = Number(m?.presenceDensity || 0);
        volatility = Number(m?.presenceVolatility || 0);
      }
    } catch {
      // best-effort only
    }

    return Object.freeze({
      density: clamp(density, 0, 1),
      volatility: clamp(volatility, 0, 1)
    });
  }

  // -------------------------------------------------------------------------
  // 5) SUBSYSTEM ARTERIES (NODEADMIN / SERVICE / SAFETY / EARN / REPRODUCTION)
// -------------------------------------------------------------------------
  function getSubsystemArteries() {
    const symbolicArtery = symbolicMeshEnv?.meta?.artery || null;
    const binaryArtery = binaryMeshEnv?.meta?.artery || null;
    const nodeAdminArtery = nodeAdminBridge?.getArtery?.() || null;
    const serviceGatewayArtery = serviceGatewayBridge?.getArtery?.() || null;
    const safetyFrameArtery = safetyFrameBridge?.getArtery?.() || null;
    const earnArtery = earnBridge?.getArtery?.() || null;
    const reproductionArtery = reproductionBridge?.getArtery?.() || null;

    return {
      symbolicArtery,
      binaryArtery,
      nodeAdminArtery,
      serviceGatewayArtery,
      safetyFrameArtery,
      earnArtery,
      reproductionArtery
    };
  }

  // -------------------------------------------------------------------------
  // 6) ORGANISM SNAPSHOT PIPELINE
  // -------------------------------------------------------------------------
  function computeOrganismSnapshots() {
    const meshStateMetrics = meshState.metrics();
    const presenceMetrics = computePresenceMetrics();
    const subsystemArteries = getSubsystemArteries();

    const artery = organismArtery.snapshot({
      ...subsystemArteries,
      presenceMetrics,
      meshStateMetrics
    });

    const { mode } = organismModeEngine.selectMode({
      artery,
      consciousness: lastConsciousnessSnapshot
    });

    const consciousness = organismConsciousness.compute({
      artery,
      meshStateMetrics,
      presenceMetrics,
      organismMode: mode
    });

    lastArterySnapshot = artery;
    lastConsciousnessSnapshot = consciousness;
    lastOrganismMode = mode;

    return { artery, consciousness, mode };
  }

  // -------------------------------------------------------------------------
  // 7) OVERMIND PRIME BRIDGE (ADVISORY-ONLY)
// -------------------------------------------------------------------------
  function emitToOvermind(eventType, payload) {
    if (!overmindPrimeBridge || typeof overmindPrimeBridge.emit !== "function") return;
    const { artery, consciousness, mode } = computeOrganismSnapshots();
    overmindPrimeBridge.emit({
      eventType,
      payload,
      organism: {
        meta: OrganismMeshMeta,
        artery,
        consciousness,
        mode
      }
    });
  }

  // -------------------------------------------------------------------------
  // 8) PREWARM — CALLS ONLY ENVS + SURVIVAL ORGANS
  // -------------------------------------------------------------------------
  function prewarm() {
    log("[OrganismMesh] Prewarm start");

    try {
      symbolicMeshEnv?.prewarm?.();
      log("[OrganismMesh] Prewarmed symbolic mesh");
    } catch (e) {
      warn("[OrganismMesh] Symbolic mesh prewarm failed", { error: e?.message });
    }

    try {
      binaryMeshEnv?.prewarm?.();
      log("[OrganismMesh] Prewarmed binary mesh");
    } catch (e) {
      warn("[OrganismMesh] Binary mesh prewarm failed", { error: e?.message });
    }

    try {
      survivalOrgans?.prewarm?.();
      log("[OrganismMesh] Prewarmed survival organs");
    } catch (e) {
      warn("[OrganismMesh] Survival organs prewarm failed", { error: e?.message });
    }

    computeOrganismSnapshots();
    log("[OrganismMesh] Prewarm complete");
  }

  // -------------------------------------------------------------------------
  // 9) ORGANISM ROUTES (USE ONLY ENVS PASSED IN)
// -------------------------------------------------------------------------
  function classifyImpulse(impulse) {
    return survivalOrgans.apply(impulse);
  }

  function transmitSymbolic(from, packet, options = {}) {
    const start = Date.now();
    let error = null;
    try {
      const result = symbolicMeshEnv.transmit(from, packet, options);
      const duration = Date.now() - start;
      organismArtery.recordCall(duration, false);
      return result;
    } catch (e) {
      const duration = Date.now() - start;
      organismArtery.recordCall(duration, true);
      error = e;
      emitToOvermind("symbolic-transmit-error", {
        from,
        error: String(e?.message || e)
      });
      throw e;
    }
  }

  function transmitBinary(from, bits, options = {}) {
    const start = Date.now();
    let error = null;
    try {
      const result = binaryMeshEnv.binaryMesh.transmit(from, bits, options);
      const duration = Date.now() - start;
      organismArtery.recordCall(duration, false);
      return result;
    } catch (e) {
      const duration = Date.now() - start;
      organismArtery.recordCall(duration, true);
      error = e;
      emitToOvermind("binary-transmit-error", {
        from,
        error: String(e?.message || e)
      });
      throw e;
    }
  }

  // -------------------------------------------------------------------------
  // 10) PUBLIC ORGANISM FACADE
  // -------------------------------------------------------------------------
  function getOrganismArtery() {
    if (!lastArterySnapshot) {
      computeOrganismSnapshots();
    }
    return lastArterySnapshot;
  }

  function getOrganismConsciousness() {
    if (!lastConsciousnessSnapshot) {
      computeOrganismSnapshots();
    }
    return lastConsciousnessSnapshot;
  }

  function getOrganismMode() {
    if (!lastOrganismMode) {
      computeOrganismSnapshots();
    }
    return lastOrganismMode;
  }

  function getOrganismReport() {
    const { artery, consciousness, mode } = computeOrganismSnapshots();
    return Object.freeze({
      meta: OrganismMeshMeta,
      mode,
      artery,
      consciousness,
      meshState: meshState.snapshotAll()
    });
  }

  return Object.freeze({
    meta: OrganismMeshMeta,

    // environments (PASSED IN)
    symbolicMeshEnv,
    binaryMeshEnv,

    // survival organs
    survivalOrgans,

    // mesh organs
    meshState,
    meshEvents,
    meshCoordinator,

    // organism intelligence
    organismArtery,
    organismConsciousness,
    organismModeEngine,

    // snapshots
    getOrganismArtery,
    getOrganismConsciousness,
    getOrganismMode,
    getOrganismReport,

    // lifecycle
    prewarm,

    // routes
    classifyImpulse,
    transmitSymbolic,
    transmitBinary,

    // overmind bridge
    emitToOvermind
  });
}

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

export default {
  OrganismMeshMeta,
  createOrganismMesh
};
