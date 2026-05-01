// ============================================================================
// FILE: PulseMeshSpine.js
// PULSE OS — v12.3+ PRESENCE-EVO
// COMMUNITY_SPINE_LAYER  // teal
// Distributed Routing Spine • Reflex + Cortex + Tendons + Signal Factoring
// Full Advantage Stack: Prewarm • Chunk • Cache • Presence-Band
// Metadata-Only • Deterministic • Drift-Proof • Local-First • Dual-Mode
// ============================================================================
//
// IDENTITY — THE SPINE (v12.3+ PRESENCE-EVO):
// ------------------------------------------
// • Routes impulses between nodes (devices, services, earners).
// • Applies 1/0 reflex at each hop (instinct-style filtering).
// • Applies cortex shaping (risk, novelty, cooperation, load).
// • Applies tendon shaping (intent, routeHint, energy shaping).
// • Applies SIGNAL FACTORING (progressive 1/0 branch reduction).
// • Accumulates mesh metadata: hops, score, energy, routeHint.
// • Emits drift + flow + factoring + presence signals to Mesh Immune / GlobalHealer.
// • NEVER mutates payload data, NEVER performs compute.
// • Deterministic-field, mesh-pressure-aware, aura-pressure-aware.
// • v12.3+: binary-aware, dual-mode-ready, unified-advantage-field,
//           prewarm-aware, chunk-aware, cache-aware, presence-aware.
// ============================================================================
//
// SAFETY CONTRACT (v12.3+):
// -------------------------
// • Metadata-only.
// • No payload access.
// • No compute.
// • No autonomy.
// • No async, no timestamps, no randomness.
// • Deterministic, drift-proof routing behavior.
// • Local-first; internet paths are explicit, not default.
// • Healing only via routed healers / directives, never inline.
// • All advantages are metadata-only: prewarm/chunk/cache/presence
//   are tags + snapshots, never side-effectful I/O.
// ============================================================================

import { createCommunityReflex } from "./CommunityReflex.js";
import { applyPulseCortex } from "./PulseMeshCortex.js";
import { applyPulseMeshTendons } from "./PulseMeshTendons.js";
import { applyMeshSignalFactoring } from "./PulseMeshSignalFactoring.js";
import { recordMeshDriftEvent } from "./GlobalHealer.js";
import "./MeshScanner.js";

// ============================================================================
// MeshMemory — lineage + drift + flow + factoring + advantage (metadata-only)
// ============================================================================
export const MeshMemory = {
  drift: [],
  flow: [],
  lineage: [],
  hops: [],
  trust: [],
  load: [],
  factoring: [],
  factoringDepth: [],
  factoringBias: [],

  // v12.3+ advantage memory
  prewarm: [],
  chunks: [],
  cache: [],
  presence: []
};

// Deterministic cycle counter (replaces timestamps)
let meshCycle = 0;

// ============================================================================
// Mesh Factory (v12.3+ PRESENCE-EVO)
// ============================================================================
export function createPulseMesh() {
  return {
    nodes: new Map(),
    reflex: createCommunityReflex(),
    meta: {
      layer: "PulseMeshSpine",
      role: "ROUTING_SPINE",
      version: "12.3+",
      target: "full-mesh",
      selfRepairable: true,
      evo: {
        dualMode: true,
        binaryAware: true,
        symbolicAware: true,
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

        // v12.3+ advantage flags
        prewarmAware: true,
        chunkAware: true,
        cacheAware: true,
        presenceAware: true,
        dualBandReady: true,
        gpuWarmAware: true,

        zeroCompute: true,
        zeroMutation: true,
        zeroRoutingInfluence: true
      },
      reach: {
        estimatedHops: 0,
        estimatedMeters: 0,
        mode: "direct"
      }
    }
  };
}

// ============================================================================
// Node Registration
// ============================================================================
export function registerMeshNode(mesh, nodeConfig) {
  if (!nodeConfig?.id) {
    throw new Error("[pulse:mesh] nodeConfig.id required");
  }

  mesh.nodes.set(nodeConfig.id, {
    id: nodeConfig.id,
    kind: nodeConfig.kind || "service",
    neighbors: nodeConfig.neighbors || [],
    reflex: nodeConfig.reflex || mesh.reflex,
    trustLevel: nodeConfig.trustLevel ?? 0.5,
    load: nodeConfig.load ?? 0.0,
    locality: nodeConfig.locality || "local" // "local" | "edge" | "internet"
  });

  return mesh;
}

// ============================================================================
// Flow Recorder (metadata-only, deterministic)
// ============================================================================
function recordFlow(mesh, from, to) {
  MeshMemory.flow.push({
    cycle: meshCycle,
    from,
    to
  });
}

// ============================================================================
// Factoring Recorder (metadata-only, deterministic)
// ============================================================================
function recordFactoring(impulse) {
  const flags = impulse.flags || {};
  const depth = flags.mesh_factor_depth || 0;
  const bias = flags.mesh_factor_bias || 0;
  const factored = !!flags.mesh_factored;

  if (!factored && depth === 0 && bias === 0) return;

  MeshMemory.factoring.push({
    cycle: meshCycle,
    depth,
    bias,
    factored
  });

  MeshMemory.factoringDepth.push({
    cycle: meshCycle,
    depth
  });

  MeshMemory.factoringBias.push({
    cycle: meshCycle,
    bias
  });
}

// ============================================================================
// v12.3+ ADVANTAGE SURFACES (metadata-only)
// Prewarm • Chunk • Cache • Presence-Band
// ============================================================================

// Presence-band classification (binary / symbolic / dual)
function classifyPresenceBand(impulse) {
  const f = impulse.flags || {};
  if (f.binary_mode && f.dual_mode) return "dual";
  if (f.binary_mode) return "binary";
  if (f.dual_mode) return "dual";
  return "symbolic";
}

// Prewarm snapshot: next-hop candidates, mode, locality bias
function recordPrewarmSurface(mesh, impulse, node, context) {
  const neighbors = node.neighbors || [];
  const presenceBand = classifyPresenceBand(impulse);

  const snapshot = {
    cycle: meshCycle,
    nodeId: node.id,
    presenceBand,
    binaryMode: !!context.binaryMode,
    dualMode: !!context.dualMode,
    neighbors: neighbors.slice().sort(), // deterministic
    routeHint: impulse.routeHint || null,
    score: typeof impulse.score === "number" ? impulse.score : null,
    energy: typeof impulse.energy === "number" ? impulse.energy : null
  };

  MeshMemory.prewarm.push(snapshot);

  impulse.flags = impulse.flags || {};
  impulse.flags.mesh_prewarm_surface = true;
  impulse.flags.mesh_prewarm_presence_band = presenceBand;
}

// Chunk snapshot: lineage + factoring + trust/load at this hop
function recordChunkSurface(impulse, node) {
  const presenceBand = classifyPresenceBand(impulse);
  const flags = impulse.flags || {};

  const chunk = {
    cycle: meshCycle,
    nodeId: node.id,
    presenceBand,
    hops: impulse.hops || 0,
    mesh_factor_depth: flags.mesh_factor_depth || 0,
    mesh_factor_bias: flags.mesh_factor_bias || 0,
    mesh_factor_pressure: flags.mesh_factor_pressure || 0,
    aura_factoring_bias: flags.aura_factoring_bias || 0,
    aura_prefers_stable_routes: !!flags.aura_prefers_stable_routes
  };

  MeshMemory.chunks.push(chunk);

  impulse.flags = impulse.flags || {};
  impulse.flags.mesh_chunk_surface = true;
  impulse.flags.mesh_chunk_presence_band = presenceBand;
}

// Cache snapshot: stable route profile (locality + trust/load + mode)
function recordCacheSurface(mesh, impulse, node) {
  const presenceBand = classifyPresenceBand(impulse);

  const neighbors = node.neighbors || [];
  const neighborProfiles = neighbors
    .map((id) => {
      const n = mesh.nodes.get(id);
      if (!n) {
        return {
          id,
          locality: "unknown",
          trust: 0,
          load: 1
        };
      }
      return {
        id: n.id,
        locality: n.locality || "local",
        trust: typeof n.trustLevel === "number" ? n.trustLevel : 0.5,
        load: typeof n.load === "number" ? n.load : 0
      };
    })
    .sort((a, b) => String(a.id).localeCompare(String(b.id)));

  const cacheProfile = {
    cycle: meshCycle,
    nodeId: node.id,
    presenceBand,
    binaryMode: !!impulse.flags?.binary_mode,
    dualMode: !!impulse.flags?.dual_mode,
    neighborProfiles
  };

  MeshMemory.cache.push(cacheProfile);

  impulse.flags = impulse.flags || {};
  impulse.flags.mesh_cache_surface = true;
  impulse.flags.mesh_cache_presence_band = presenceBand;
}

// Presence snapshot: global presence-band + mode + hop index
function recordPresenceSurface(impulse, node) {
  const presenceBand = classifyPresenceBand(impulse);

  const presence = {
    cycle: meshCycle,
    nodeId: node.id,
    presenceBand,
    binaryMode: !!impulse.flags?.binary_mode,
    dualMode: !!impulse.flags?.dual_mode,
    symbolicMode: !impulse.flags?.binary_mode,
    hopIndex: impulse.hops || 0
  };

  MeshMemory.presence.push(presence);

  impulse.flags = impulse.flags || {};
  impulse.flags.mesh_presence_surface = true;
  impulse.flags.mesh_presence_band = presenceBand;
}

// ============================================================================
// Routing Entry Point (v12.3+ PRESENCE-EVO)
// Metadata-only • Deterministic • Local-first • Dual-Mode • Full Advantage
// ============================================================================
export function routeImpulse(mesh, impulse, entryNodeId, context = {}) {
  meshCycle++;

  impulse.flags = impulse.flags || {};
  impulse.flags.mesh_meta = mesh.meta;
  impulse.flags.mesh_route_started = true;

  // v12.3+: mode tagging (binary / dual / symbolic)
  const binaryMode = !!context.binaryMode || !!impulse.flags.binary_mode;
  const dualMode = !!context.dualMode || !!impulse.flags.dual_mode;

  impulse.flags.binary_mode = binaryMode;
  impulse.flags.dual_mode = dualMode;
  impulse.flags.mesh_mode = binaryMode ? "binary" : dualMode ? "dual" : "symbolic";

  const visited = new Set();
  let currentNodeId = entryNodeId;

  const MAX_HOPS = context.maxHops ?? 256;

  while (currentNodeId) {
    const node = mesh.nodes.get(currentNodeId);

    // -------------------------------------------------------
    // DRIFT: Missing node
    // -------------------------------------------------------
    if (!node) {
      recordMeshDriftEvent({
        driftType: "missing_node",
        severity: "warning",
        meshNodeId: currentNodeId,
        note: "Mesh node missing during routing",
        fileName: "PulseMeshSpine.js",
        functionName: "routeImpulse",
        fieldName: "nodes"
      });

      MeshMemory.drift.push({
        cycle: meshCycle,
        type: "missing_node",
        node: currentNodeId
      });

      impulse.flags.mesh_missing_node = true;
      break;
    }

    visited.add(currentNodeId);

    // -------------------------------------------------------
    // HOPS + LINEAGE
    // -------------------------------------------------------
    impulse.hops = (impulse.hops || 0) + 1;

    MeshMemory.hops.push({ cycle: meshCycle, node: node.id });

    MeshMemory.lineage.push({
      cycle: meshCycle,
      node: node.id,
      trust: node.trustLevel ?? 0.5,
      load: node.load ?? 0.0,
      mode: impulse.flags.mesh_mode
    });

    MeshMemory.trust.push({
      cycle: meshCycle,
      node: node.id,
      trust: node.trustLevel ?? 0.5
    });

    MeshMemory.load.push({
      cycle: meshCycle,
      node: node.id,
      load: node.load ?? 0.0
    });

    if (impulse.hops > MAX_HOPS) {
      impulse.flags.mesh_max_hops_exceeded = true;

      recordMeshDriftEvent({
        driftType: "routing_stall",
        severity: "warning",
        meshNodeId: node.id,
        note: "Mesh routing exceeded max hops — safety stop",
        fileName: "PulseMeshSpine.js",
        functionName: "routeImpulse",
        fieldName: "hops"
      });

      MeshMemory.drift.push({
        cycle: meshCycle,
        type: "routing_stall",
        node: node.id
      });

      break;
    }

    // -------------------------------------------------------
    // v12.3+ ADVANTAGE SURFACES (prewarm/chunk/cache/presence)
    // -------------------------------------------------------
    recordPrewarmSurface(mesh, impulse, node, { binaryMode, dualMode });
    recordChunkSurface(impulse, node);
    recordCacheSurface(mesh, impulse, node);
    recordPresenceSurface(impulse, node);

    // -------------------------------------------------------
    // 0. SIGNAL PRESSURE SURFACE (factoring + aura hints)
    // -------------------------------------------------------
    impulse.flags = impulse.flags || {};
    const factorDepth = impulse.flags.mesh_factor_depth || 0;
    const factorBias = impulse.flags.mesh_factor_bias || 0;
    const auraBias = impulse.flags.aura_factoring_bias || 0;

    impulse.flags.mesh_factor_pressure =
      factorDepth + factorBias + auraBias;

    // -------------------------------------------------------
    // 1. REFLEX (1/0 instinct)
    // -------------------------------------------------------
    const decision = node.reflex(impulse, node);

    if (decision === 0) {
      impulse.flags[`reflex_drop_at_${node.id}`] = true;

      recordMeshDriftEvent({
        driftType: "reflex_drop",
        severity: "info",
        meshNodeId: node.id,
        note: "Reflex dropped impulse",
        fileName: "PulseMeshSpine.js",
        functionName: "routeImpulse",
        fieldName: "reflex"
      });

      MeshMemory.drift.push({
        cycle: meshCycle,
        type: "reflex_drop",
        node: node.id
      });

      break;
    }

    // -------------------------------------------------------
    // 2. CORTEX (strategic shaping, dual-mode-aware)
    // -------------------------------------------------------
    applyPulseCortex(impulse, {
      ...context,
      globalLoad: node.load,
      trustLevel: node.trustLevel,
      binaryMode,
      dualMode
    });

    // -------------------------------------------------------
    // 3. TENDONS (intent + routeHint + energy shaping)
    // -------------------------------------------------------
    applyPulseMeshTendons(impulse);

    // -------------------------------------------------------
    // 4. Energy decay (instinctive fatigue, metadata-only)
    // -------------------------------------------------------
    impulse.energy =
      typeof impulse.energy === "number" ? impulse.energy * 0.9 : 0.9;

    if (impulse.energy <= 0.05) {
      impulse.flags.mesh_energy_exhausted = true;
      break;
    }

    // -------------------------------------------------------
    // 4.5 SIGNAL FACTORING (1/0, metadata-only)
    // -------------------------------------------------------
    applyMeshSignalFactoring(impulse);
    recordFactoring(impulse);

    // -------------------------------------------------------
    // 5. Earner delivery check
    // -------------------------------------------------------
    if (node.kind === "earner" && shouldDeliverToEarner(impulse, node)) {
      impulse.flags[`delivered_to_${node.id}`] = true;
      impulse.flags.reached_earn_engine = true;
      break;
    }

    // -------------------------------------------------------
    // 6. Next hop selection (factoring + load + locality + mode aware)
    // -------------------------------------------------------
    const nextId = selectNextHop(mesh, node, visited, impulse, {
      binaryMode,
      dualMode
    });

    // DRIFT: Routing stall
    if (!nextId) {
      impulse.flags[`stalled_at_${node.id}`] = true;

      recordMeshDriftEvent({
        driftType: "routing_stall",
        severity: "warning",
        meshNodeId: node.id,
        note: "Mesh routing stalled — no available neighbors",
        fileName: "PulseMeshSpine.js",
        functionName: "routeImpulse",
        fieldName: "neighbors"
      });

      MeshMemory.drift.push({
        cycle: meshCycle,
        type: "routing_stall",
        node: node.id
      });

      break;
    }

    recordFlow(mesh, currentNodeId, nextId);
    currentNodeId = nextId;
  }

  impulse.flags.mesh_route_completed = true;
  return impulse;
}

// ============================================================================
// Next Hop Selection (factoring-aware, load-aware, locality-aware, mode-aware)
// ============================================================================
function selectNextHop(mesh, node, visited, impulse, { binaryMode, dualMode }) {
  const neighbors = node.neighbors || [];
  if (!neighbors.length) return null;

  const factorPressure = impulse.flags?.mesh_factor_pressure || 0;
  const prefersStableRoutes = !!impulse.flags?.aura_prefers_stable_routes;

  const candidates = neighbors
    .filter((n) => !visited.has(n))
    .map((id) => {
      const n = mesh.nodes.get(id);

      if (!n) {
        return {
          id,
          load: 1,
          trust: 0,
          locality: "unknown",
          penalty: 1
        };
      }

      const load = typeof n.load === "number" ? n.load : 0;
      const trust = typeof n.trustLevel === "number" ? n.trustLevel : 0.5;
      const locality = n.locality || "local";

      let penalty = 0;

      // higher load → higher penalty
      if (load > 0.5) penalty += (load - 0.5) * 0.6;

      // lower trust → higher penalty
      if (trust < 0.5) penalty += (0.5 - trust) * 0.5;

      // factoring pressure → prefer shorter / more stable paths
      if (factorPressure > 0) {
        penalty += factorPressure * 0.3;
      }

      // aura stable-route hint → extra penalty for high-load nodes
      if (prefersStableRoutes && load > 0.3) {
        penalty += (load - 0.3) * 0.4;
      }

      // locality preference: local < edge < internet
      if (locality === "edge") penalty += 0.05;
      if (locality === "internet") penalty += 0.15;

      // v12.3+: mode-aware tweaks
      // binary mode prefers lower-hop, higher-trust, local-first paths
      if (binaryMode) {
        if (locality === "internet") penalty += 0.1;
        if (trust < 0.6) penalty += 0.1;
      }

      // dual mode: slightly favor local/edge mix, keep deterministic
      if (dualMode && locality === "edge") {
        penalty -= 0.02;
      }

      return {
        id,
        load,
        trust,
        locality,
        penalty
      };
    })
    .sort((a, b) => {
      if (a.penalty !== b.penalty) return a.penalty - b.penalty;
      // deterministic tie-breaker: id lexicographic
      return String(a.id).localeCompare(String(b.id));
    });

  const best = candidates[0];
  return best ? best.id : null;
}

// ============================================================================
// Earner Targeting Helper
// ============================================================================
function shouldDeliverToEarner(impulse, node) {
  const hint = impulse.routeHint;
  if (!hint) return true;
  if (hint === node.id) return true;
  if (hint === node.kind) return true;

  return false;
}

// ============================================================================
// Mesh Reach Snapshot (Metadata-Only)
// ============================================================================
export function getMeshReachSnapshot(mesh) {
  const nodeCount = mesh.nodes.size;

  const avgDegree =
    nodeCount === 0
      ? 0
      : Array.from(mesh.nodes.values()).reduce(
          (sum, n) => sum + (n.neighbors?.length || 0),
          0
        ) / nodeCount;

  const estimatedHops = Math.max(1, Math.round(avgDegree || 1));
  const estimatedMeters = estimatedHops * 30;

  let mode = "direct";
  if (estimatedHops >= 3 && estimatedHops < 6) mode = "cluster";
  if (estimatedHops >= 6) mode = "wide";

  const locals = Array.from(mesh.nodes.values()).filter(
    (n) => (n.locality || "local") === "local"
  ).length;

  const localityRatio = nodeCount === 0 ? 1 : locals / nodeCount;
  const localityMode =
    localityRatio > 0.7 ? "local-first" : localityRatio < 0.3 ? "internet-mixed" : "hybrid";

  return {
    layer: mesh.meta.layer,
    role: mesh.meta.role,
    version: mesh.meta.version,
    nodeCount,
    avgDegree,
    reach: { estimatedHops, estimatedMeters, mode, localityMode }
  };
}
