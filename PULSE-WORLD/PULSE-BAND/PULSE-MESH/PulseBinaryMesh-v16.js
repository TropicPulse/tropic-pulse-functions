// ============================================================================
// FILE: BinaryMesh-v16.js
// BINARY MESH — v16-Immortal
// “PURE BINARY CONNECTIVE TISSUE / BINARY-FIRST / SYMBOLIC FALLBACK”
// ============================================================================
//
// ROLE:
//   • Primary binary connective tissue between binary organs.
//   • Zero symbolic data in the binary path (0/1 arrays only).
//   • Deterministic, drift-proof, mutation-safe, presence-aware.
//   • Dual-band aware (binary primary, symbolic fallback).
//   • Falls back to symbolic PulseMesh when binary contract is violated.
//   • Exposes read-only BinaryMeshArtery v2 for NodeAdmin/Overmind.
//
// ARCHITECTURAL POSITION:
//   • Lives in mesh_binary layer.
//   • Sits under OrganismMesh as the binary nervous system.
//   • Talks to symbolic mesh via fallback (PulseMeshFlow, PresenceRelay, etc.).
//   • Never routes, never computes semantics — only validates and passes bits.
//
// GUARANTEES:
//   • No randomness, no timing-based behavior, no env access.
//   • No dynamic imports, no eval.
//   • No network, no filesystem.
//   • Zero mutation of input bits.
//   • Mesh-topology-aware only via symbolic fallback.
//   • Presence-aware only via control metadata (band, presenceTag).
//   • Artery metrics are local, read-only, advisory-only.
//
// CONTRACT (v16-Immortal):
//   • INPUT (data path):
//       - bits: number[] (0 or 1 only)
//   • INPUT (control path):
//       - from: string
//       - options: { band?, presenceTag?, trace? }
//   • OUTPUT:
//       - bits (unchanged) OR symbolic fallback result
//       - optional: binaryMeshArtery snapshot (read-only)
// ============================================================================

/*
AI_EXPERIENCE_META = {
  identity: "PulseBinaryMesh",
  version: "v16-Immortal",
  layer: "mesh_binary",
  role: "binary_mesh_kernel",
  lineage: [
    "PulseMesh-v14",
    "BinaryMesh-v15-Evo-Immortal",
    "BinaryMesh-v16-Immortal"
  ],

  evo: {
    binaryPrimary: true,
    symbolicAware: true,
    dualBand: true,

    deterministic: true,
    driftProof: true,
    zeroMutationOfInput: true,
    zeroNetwork: true,
    zeroFilesystem: true,

    meshTopologyAware: true,
    meshPresenceAware: true,
    meshAuraAware: true,

    nonExecutableBinary: true,
    metadataOnly: true,
    safeRouteFree: true,

    arteryAware: true,
    nodeAdminAware: true,
    overmindAware: true
  },

  contract: {
    always: [
      "PulseMeshFlow",
      "PulseMeshAwareness",
      "PulseMeshPresenceRelay",
      "PulseNodeAdmin",
      "PulseOvermindPrime"
    ],
    never: [
      "safeRoute",
      "fetchViaCNS",
      "legacyBinaryMesh",
      "directNetworkIO",
      "directFilesystemIO"
    ]
  }
}
*/

// ============================================================================
// META — v16-Immortal
// ============================================================================
export const BinaryMeshMeta = Object.freeze({
  layer: "BinaryNervousSystem",
  role: "PURE_BINARY_MESH",
  version: "v16-Immortal",
  identity: "BinaryMesh-v16-Immortal",
  guarantees: Object.freeze({
    pureBinaryPath: true,            // Only 0/1 arrays on data path
    zeroSymbolicInDataPath: true,    // No strings/objects in binary path
    deterministic: true,             // Same call sequence → same behavior
    driftProof: true,                // No topology or behavior drift
    mutationSafe: true,              // Never mutates input bits
    presenceAware: true,             // Reads band/presenceTag metadata
    bandAware: true,                 // Binary primary, symbolic fallback
    noRandomness: true,              // No RNG
    noTiming: true,                  // No timing-based branching
    noEnvAccess: true,               // No env, no process
    zeroNetwork: true,               // No network access
    zeroFilesystem: true,            // No FS access
    nonExecutableBinary: true,       // Bits are data, never code
    metadataOnly: true,              // No semantic interpretation of bits
    arteryAware: true                // Exposes local BinaryMeshArtery v2
  }),
  contract: Object.freeze({
    inputDataPath: ["bits"],
    inputControlPath: ["from", "band", "presenceTag", "trace"],
    outputDataPath: ["bits"],
    outputFallback: ["fallbackResult"],
    arteryPath: ["binaryMeshArtery"]
  })
});

// ============================================================================
// IMPORTS — MESH SUBSYSTEMS (SYMBOLIC SIDE)
// ============================================================================

// 0 — CORE ORGANISM BOOT
import { createOrganismMesh } from "./PulseMeshOrganism-v16.js";

// 1 — SPINE (root of mesh nervous system)
import PulseMeshSpine from "./PulseMeshSpine.js";

// 2 — FLOW (mesh circulation)
import PulseMeshFlow from "./PulseMeshFlow.js";

// 3 — PRESENCE RELAY (mesh → world presence)
import PulseMeshPresenceRelay from "./PulseMeshPresenceRelay-v16.js";

// 4 — COGNITION (mesh-level cognition)
import PulseMeshCognition from "./PulseMeshCognition.js";

// 5 — ENDOCRINE (mesh hormones)
import PulseMeshEndocrineSystem from "./PulseMeshEndocrineSystem.js";

// 6 — IMMUNE SYSTEM (mesh immune layer)
import PulseMeshImmuneSystem from "./PulseMeshImmuneSystem.js";

// 7 — ORGANS (mesh organ registry)
import PulseMeshOrgans from "./PulseMeshOrgans.js";

// 8 — THALAMUS (relay after organs)
import PulseMeshThalamus from "./PulseMeshThalamus.js";

// ============================================================================
// WORLD / PRESENCE LAYER
// ============================================================================
import PresenceAIView from "./PulseMeshPresenceAIView.js";
import MentorUpgradeRequest from "./PulseMeshMentorUpgradeRequest.js";
import { createPulseWorldSocialGraph } from "./PulseWorldSocialGraph.js";

// ============================================================================
// CORTEX + TENDONS (SHAPING LAYERS — ALWAYS LAST)
// ============================================================================
import { applyPulseCortex } from "./PulseMeshCortex.js";
import { applyPulseMeshTendons } from "./PulseMeshTendons.js";

// ============================================================================
// INTERNAL HELPERS
// ============================================================================
function isPureBinary(bits, maxBitsLength) {
  if (!Array.isArray(bits)) return false;
  const len = bits.length;
  if (len === 0 || len > maxBitsLength) return false;
  for (let i = 0; i < len; i++) {
    const b = bits[i];
    if (b !== 0 && b !== 1) return false;
  }
  return true;
}

function safeLog(fn, fallback) {
  if (typeof fn === "function") return fn;
  if (typeof console !== "undefined" && typeof fallback === "function") return fallback;
  return () => {};
}

// BinaryMeshArtery v2 — local, read-only, no timing-based branching
function computeBinaryMeshArtery(state) {
  const total = state.totalTransmits;
  const fallbacks = state.totalFallbacks;
  const maxBits = state.maxBitsLength || 1;

  const fallbackRatio = total > 0 ? Math.min(1, fallbacks / total) : 0;
  const avgBits = total > 0 ? Math.min(1, state.totalBits / (total * maxBits)) : 0;

  const pressure = Math.max(0, Math.min(1, (fallbackRatio * 0.7 + avgBits * 0.3)));
  const throughput = Math.max(0, Math.min(1, 1 - pressure));
  const cost = Math.max(0, Math.min(1, pressure * (1 - throughput)));
  const budget = Math.max(0, Math.min(1, throughput - cost));

  function bucket(v) {
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

  return Object.freeze({
    totalTransmits: total,
    totalFallbacks: fallbacks,
    totalBits: state.totalBits,
    maxBitsLength: maxBits,
    fallbackRatio,
    avgBitsRatio: avgBits,
    throughput,
    pressure,
    cost,
    budget,
    throughputBucket: bucket(throughput),
    pressureBucket: bucketPressure(pressure),
    costBucket: bucketCost(cost),
    budgetBucket: bucket(budget),
    lastFallbackReason: state.lastFallbackReason || null,
    lastFrom: state.lastFrom || null
  });
}

// ============================================================================
// BINARY MESH FACTORY — v16-Immortal (WITH CORTEX + TENDONS APPLIED)
// ============================================================================
export function createBinaryMesh({
  symbolicMesh,
  trace = false,
  maxBitsLength = 64,
  defaultBand = "binary",
  defaultPresenceTag = "BinaryMesh-v16"
} = {}) {

  const links = Object.create(null);

  const logWarn = safeLog(globalThis?.warn, console?.warn);
  const logInfo = safeLog(globalThis?.log, console?.log);

  // local artery state (no timing-based branching)
  const arteryState = {
    totalTransmits: 0,
    totalFallbacks: 0,
    totalBits: 0,
    lastFallbackReason: null,
    lastFrom: null,
    maxBitsLength
  };

  function link(from, to) {
    links[from] = to;
  }

  function getBinaryMeshArtery() {
    return computeBinaryMeshArtery(arteryState);
  }

  // -------------------------------------------------------------------------
  // SYMBOLIC FALLBACK (binary → symbolic) WITH CORTEX + TENDONS
  // -------------------------------------------------------------------------
  function fallback(reason, from, bits, {
    band = defaultBand,
    presenceTag = defaultPresenceTag
  } = {}) {

    arteryState.totalFallbacks += 1;
    arteryState.lastFallbackReason = reason;
    arteryState.lastFrom = from;
    arteryState.totalBits += Array.isArray(bits) ? bits.length : 0;

    if (!symbolicMesh) {
      throw new Error(`BinaryMesh fallback (${reason}) from:${from} but no symbolicMesh provided`);
    }

    if (trace) {
      logWarn(
        `[BinaryMesh v16] FALLBACK (${reason}) from:${from} band:${band} presence:${presenceTag}`,
        bits
      );
    }

    const impulse = {
      type: "binaryFallback",
      reason,
      from,
      bits,
      band,
      presenceTag,
      flags: {
        binary_fallback: true,
        binary_reason: reason,
        binary_presence_tag: presenceTag
      }
    };

    applyPulseCortex(impulse, {
      binaryMode: false,
      dualMode: false,
      symbolicMode: true
    });

    applyPulseMeshTendons(impulse);

    return symbolicMesh.transmit(from, impulse, {
      band: "symbolic",
      presenceTag: "PulseMesh-v16"
    });
  }

  // -------------------------------------------------------------------------
  // PURE BINARY TRANSMISSION
  // -------------------------------------------------------------------------
  function transmit(from, bits, {
    band = defaultBand,
    presenceTag = defaultPresenceTag
  } = {}) {

    arteryState.totalTransmits += 1;
    arteryState.totalBits += Array.isArray(bits) ? bits.length : 0;

    const to = links[from];

    if (!to) {
      return fallback("missing-link", from, bits, { band, presenceTag });
    }

    if (!isPureBinary(bits, maxBitsLength)) {
      return fallback("non-binary-input", from, bits, { band, presenceTag });
    }

    if (trace) {
      logInfo(
        `[BinaryMesh v16] ${from} → ${to} band:${band} presence:${presenceTag}`,
        bits
      );
    }

    // pure binary path: bits are passed unchanged
    return bits;
  }

  return Object.freeze({
    meta: BinaryMeshMeta,
    link,
    transmit,
    fallback,
    getBinaryMeshArtery
  });
}

// ============================================================================
// LOCAL BINARY SUBSYSTEMS — LIVE ON THIS PAGE (v16-Immortal)
// ============================================================================
//
//  PulseBinaryMeshPresence:
//    • Thin wrapper that exposes a `pulse` API over the binary mesh.
//    • Used for presence-band binary signaling (pings, heartbeats, etc.).
//
//  PulseBinaryMeshPrime:
//    • Extension point for future binary-first logic.
//    • Currently just forwards to binaryMesh.transmit (pure connective tissue).
// ============================================================================

const PulseBinaryMeshPresence = {
  create({ context, binaryMesh, log, warn }) {
    function prewarm() {
      log?.("[BinaryPresence v16] prewarm");
    }

    function pulse(from, bits, options) {
      return binaryMesh.transmit(from, bits, options);
    }

    function artery() {
      return binaryMesh.getBinaryMeshArtery();
    }

    return Object.freeze({
      prewarm,
      pulse,
      artery
    });
  }
};

const PulseBinaryMeshPrime = {
  create({ context, binaryMesh, log, warn }) {
    function prewarm() {
      log?.("[BinaryPrime v16] prewarm");
    }

    function process(from, bits, options) {
      return binaryMesh.transmit(from, bits, options);
    }

    function artery() {
      return binaryMesh.getBinaryMeshArtery();
    }

    return Object.freeze({
      prewarm,
      process,
      artery
    });
  }
};

// ============================================================================
// BINARY MESH ENVIRONMENT — v16-Immortal
//   BINARY BARREL: BOOT ORGANISM, LOAD SUBSYSTEMS, WIRE, PREWARM
// ============================================================================
export function createBinaryMeshEnvironment({
  context = {},
  trace = false,
  maxBitsLength = 64,
  defaultBand = "binary",
  defaultPresenceTag = "BinaryMesh-v16"
} = {}) {

  const log   = context.log   || safeLog(globalThis?.log, console?.log);
  const warn  = context.warn  || safeLog(globalThis?.warn, console?.warn);
  const error = context.error || safeLog(globalThis?.error, console?.error);

  // -------------------------------------------------------
  // 0) BOOT THE ORGANISM (CORTEX + TENDONS INJECTED)
  // -------------------------------------------------------
  const organism = createOrganismMesh({
    context: {
      ...context,
      applyPulseCortex,
      applyPulseMeshTendons
    },
    symbolicMeshEnv: context.symbolicMeshEnv,
    binaryMeshEnv: context.binaryMeshEnv,
    trace
  });

  const symbolicMesh =
    organism.symbolicMeshEnv?.symbolicMesh || organism.symbolicMeshEnv;

  const binaryMesh = createBinaryMesh({
    symbolicMesh,
    trace,
    maxBitsLength,
    defaultBand,
    defaultPresenceTag
  });

  // -------------------------------------------------------
  // 1) BINARY SUBSYSTEMS
  // -------------------------------------------------------
  const binaryPresence = PulseBinaryMeshPresence?.create
    ? PulseBinaryMeshPresence.create({ context, binaryMesh, log, warn })
    : null;

  const binaryPrime = PulseBinaryMeshPrime?.create
    ? PulseBinaryMeshPrime.create({ context, binaryMesh, log, warn })
    : null;

  // -------------------------------------------------------
  // 2) SYMBOLIC-ADJACENT SUBSYSTEMS
  // -------------------------------------------------------
  const meshFlow = PulseMeshFlow?.create
    ? PulseMeshFlow.create({ context, mesh: symbolicMesh, log, warn })
    : null;

  const meshPresenceRelay = PulseMeshPresenceRelay?.create
    ? PulseMeshPresenceRelay.create({
        MeshBus: context.MeshBus,
        SystemClock: context.SystemClock,
        IdentityDirectory: context.IdentityDirectory,
        log
      })
    : null;

  const meshCognition = PulseMeshCognition?.create
    ? PulseMeshCognition.create({ context, mesh: symbolicMesh, flow: meshFlow, log, warn })
    : null;

  const meshEndocrine = PulseMeshEndocrineSystem?.create
    ? PulseMeshEndocrineSystem.create({ context, mesh: symbolicMesh, log, warn })
    : null;

  const meshImmune = PulseMeshImmuneSystem?.create
    ? PulseMeshImmuneSystem.create({ context, mesh: symbolicMesh, log, warn })
    : null;

  const meshOrgans = PulseMeshOrgans?.create
    ? PulseMeshOrgans.create({ context, mesh: symbolicMesh, log, warn })
    : null;

  const meshThalamus = PulseMeshThalamus?.create
    ? PulseMeshThalamus.create({
        log,
        warn,
        error,
        groupCollapsed: context.groupCollapsed || console.groupCollapsed?.bind(console),
        groupEnd: context.groupEnd || console.groupEnd?.bind(console)
      })
    : null;

  const meshSpine = typeof PulseMeshSpine?.create === "function"
    ? PulseMeshSpine.create({ context, mesh: symbolicMesh, log, warn })
    : null;

  const presenceAIView = PresenceAIView?.create
    ? PresenceAIView.create({ context, mesh: symbolicMesh, log, warn })
    : null;

  const mentorUpgradeRequest = MentorUpgradeRequest?.create
    ? MentorUpgradeRequest.create({ context, mesh: symbolicMesh, log, warn })
    : null;

  const socialGraph = typeof createPulseWorldSocialGraph === "function"
    ? createPulseWorldSocialGraph({
        PowerUserRanking: context.PowerUserRanking,
        log,
        warn,
        error
      })
    : null;

  // -------------------------------------------------------
  // 3) REGISTRY
  // -------------------------------------------------------
  const ALL_SYSTEMS = Object.freeze({
    // core
    binaryMesh,

    // binary subsystems
    binaryPresence,
    binaryPrime,

    // symbolic-adjacent subsystems
    meshFlow,
    meshPresenceRelay,
    meshCognition,
    meshEndocrine,
    meshImmune,
    meshOrgans,
    meshThalamus,
    meshSpine,
    presenceAIView,
    mentorUpgradeRequest,
    socialGraph
  });

  // -------------------------------------------------------
  // 4) PREWARM
  // -------------------------------------------------------
  function prewarm() {
    log("[BinaryMesh v16] Prewarm start");

    for (const [name, system] of Object.entries(ALL_SYSTEMS)) {
      if (system && typeof system.prewarm === "function") {
        try {
          system.prewarm();
          log("[BinaryMesh v16] Prewarmed system", { name });
        } catch (e) {
          warn("[BinaryMesh v16] Prewarm failed", { name, error: e?.message });
        }
      }
    }

    log("[BinaryMesh v16] Prewarm complete");
  }

  // -------------------------------------------------------
  // 5) PUBLIC ENVIRONMENT API
  // -------------------------------------------------------
  return Object.freeze({
    meta: BinaryMeshMeta,

    // core
    binaryMesh,

    // binary subsystems
    binaryPresence,
    binaryPrime,

    // symbolic-adjacent subsystems
    meshFlow,
    meshPresenceRelay,
    meshCognition,
    meshEndocrine,
    meshImmune,
    meshOrgans,
    meshThalamus,
    meshSpine,
    presenceAIView,
    mentorUpgradeRequest,
    socialGraph,

    prewarm,
    systems: ALL_SYSTEMS,

    organism
  });
}

export default {
  BinaryMeshMeta,
  createBinaryMesh,
  createBinaryMeshEnvironment
};
