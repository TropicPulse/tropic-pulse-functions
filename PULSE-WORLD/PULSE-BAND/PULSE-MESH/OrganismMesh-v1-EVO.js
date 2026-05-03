// ============================================================================
// FILE: OrganismMesh-v2-MESH-COORD.js
// PULSE ORGANISM MESH — TOP-LEVEL ORGANISM LOADER + GLOBAL MESH COORDINATOR
// “One page. One route. Whole organism. One mesh that knows everything.”
// ============================================================================
/*
AI_EXPERIENCE_META = {
  identity: "OrganismMesh",
  version: "v15.0-MESH-COORD",
  layer: "mesh",
  role: "mesh_presence_graph",
  lineage: "PulseMesh-v15",

  evo: {
    meshAware: true,                // Core mesh organ
    presenceAware: true,            // Uses presence field
    binaryAware: true,              // Mesh hops + binary hints
    deterministic: true,            // Mesh graph must be stable
    driftProof: true,               // No drift in mesh topology
    dualBand: true,                 // Symbolic + binary mesh
    zeroNetworkFetch: true,
    zeroMutationOfInput: true,
    safeRouteFree: true,
    meshCoordinator: true,          // NEW: global coordinator organ
    meshStateAware: true,           // NEW: global mesh state map
    meshEventsAware: true           // NEW: mesh event bus
  },

  contract: {
    always: [
      "PulseMeshPresenceRelay",
      "PulsePresence",
      "PresenceAwareness"
    ],
    never: [
      "legacyMesh",
      "legacyPresenceRelay",
      "safeRoute",
      "fetchViaCNS"
    ]
  }
}
*/

import { createPulseOrgans } from "./PulseMeshOrgans.js";

// ============================================================================
// META
// ============================================================================
export const OrganismMeshMeta = Object.freeze({
  layer: "Organism",
  role: "ORGANISM_MESH_ROOT",
  version: "v2-MESH-COORD",
  identity: "OrganismMesh-v2-MESH-COORD",
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
    meshEventsAttached: true
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

// ============================================================================
// ORGANISM MESH FACTORY
// IMPORTANT:
//   • Organism DOES NOT create meshes.
//   • Organism DOES NOT import mesh constructors.
//   • Organism DOES NOT import environments.
//   • The BARREL passes symbolicMeshEnv + binaryMeshEnv IN.
//   • This file ONLY builds coordination + state on top of what is passed in.
// ============================================================================
export function createOrganismMesh({
  context = {},
  symbolicMeshEnv,   // <-- PASSED IN BY BARREL
  binaryMeshEnv,     // <-- PASSED IN BY BARREL
  trace = false
} = {}) {

  const log   = context.log   || safeLog(globalThis?.log, console?.log);
  const warn  = context.warn  || safeLog(globalThis?.warn, console?.warn);

  const tlog = trace ? (...args) => log("[OrganismMesh]", ...args) : () => {};

  // -------------------------------------------------------------------------
  // 1) SURVIVAL ORGANS (ONLY SUBSYSTEM CREATED HERE)
  // -------------------------------------------------------------------------
  const survivalOrgans = createPulseOrgans();

  // -------------------------------------------------------------------------
  // 2) GLOBAL MESH STATE + EVENTS + COORDINATOR (IN-MEMORY, DETERMINISTIC)
  // -------------------------------------------------------------------------
  // Resource state machine:
  //   pending   → chunking → chunked → assembling → ready
  //   ready     → stale    → pending (re-chunk)
  //
  // resourceId: string (image URL, page URL, link, etc.)
  // laneId:     string | number (chunker lane identity)
  //
  // NOTE:
  //   • No network fetch.
  //   • No mutation of external inputs.
  //   • All state is internal to this closure.
  // -------------------------------------------------------------------------

  const meshState = (() => {
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

    return Object.freeze({
      getResource,
      ensureResource,
      assignLane,
      releaseLane,
      addChunk,
      setState,
      markStale,
      snapshotResource,
      snapshotAll
    });
  })();

  const meshEvents = (() => {
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
          warn("[OrganismMesh] meshEvents handler failed", { eventName, error: e?.message });
        }
      }
    }

    return Object.freeze({
      on,
      emit
    });
  })();

  const meshCoordinator = (() => {
    // -----------------------------------------------------------------------
    // PUBLIC CONTRACT (ORGANISM-LEVEL):
    //
    //   • requestWork(resourceId, laneId)
    //   • reportChunkDone({ resourceId, laneId, chunkId })
    //   • markResourceStale(resourceId)
    //   • markResourceReady(resourceId)
    //   • getResourceView(resourceId)
    //   • getAllResources()
    //
    // This is the “global brain” for chunker + images/pages/links.
    // -----------------------------------------------------------------------

    function requestWork(resourceId, laneId) {
      if (!resourceId && resourceId !== 0) return null;
      if (laneId === undefined || laneId === null) return null;

      const existing = meshState.getResource(resourceId);

      // If already ready and not stale, no work needed.
      if (existing && existing.state === "ready") {
        tlog("requestWork: resource already ready", { resourceId, laneId });
        return null;
      }

      // If another lane is already chunking this, avoid duplication.
      if (existing && existing.state === "chunking" && existing.lanes.size > 0 && !existing.lanes.has(laneId)) {
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

      // NOTE:
      //   We do NOT assume “all chunks are done” here.
      //   Higher-level logic (symbolicMeshEnv / binaryMeshEnv / world) can
      //   decide when a resource is fully assembled and call markResourceReady.
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
  })();

  // -------------------------------------------------------------------------
  // 3) PREWARM (CALLS ONLY SUBSYSTEMS + ENVS PASSED IN)
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

    log("[OrganismMesh] Prewarm complete");
  }

  // -------------------------------------------------------------------------
  // 4) ORGANISM ROUTES (USE ONLY ENVS PASSED IN)
  // -------------------------------------------------------------------------
  function classifyImpulse(impulse) {
    return survivalOrgans.apply(impulse);
  }

  function transmitSymbolic(from, packet, options = {}) {
    return symbolicMeshEnv.transmit(from, packet, options);
  }

  function transmitBinary(from, bits, options = {}) {
    return binaryMeshEnv.binaryMesh.transmit(from, bits, options);
  }

  // -------------------------------------------------------------------------
  // 5) PUBLIC ORGANISM FACADE
  // -------------------------------------------------------------------------
  return Object.freeze({
    meta: OrganismMeshMeta,

    // environments (PASSED IN)
    symbolicMeshEnv,
    binaryMeshEnv,

    // survival organs (SUBSYSTEM)
    survivalOrgans,

    // mesh organs (NEW)
    meshState,
    meshEvents,
    meshCoordinator,

    // lifecycle
    prewarm,

    // routes
    classifyImpulse,
    transmitSymbolic,
    transmitBinary
  });
}

// ============================================================================
// DEFAULT EXPORT
// ============================================================================
export default {
  OrganismMeshMeta,
  createOrganismMesh
};
