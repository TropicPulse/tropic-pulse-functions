// ============================================================================
// FILE: PulseMesh-v16.js
// PULSE SYMBOLIC MESH — v16-IMMORTAL
// “PURE SYMBOLIC CONNECTIVE TISSUE / SEMANTIC PATH / BINARY-AWARE / CHUNK-AWARE”
// ============================================================================
//
// ROLE:
//   • Primary symbolic connective tissue between symbolic organs.
//   • Carries semantic packets (plain objects) only — no raw binary arrays.
//   • Deterministic, drift-proof, mutation-safe, presence-aware, chunk-aware.
//   • Dual-band aware (symbolic primary, binary-aware via metadata).
//   • Falls back to a provided fallbackProxy when contract is violated.
//   • Exposes IMMORTAL-grade mesh artery metrics (throughput, pressure, cost, budget).
//
// ARCHITECTURAL POSITION:
//   • Lives in SymbolicNervousSystem layer.
//   • Sits under OrganismMesh as the symbolic nervous system.
//   • Talks to binary mesh via fallbackProxy or higher layers.
//   • Never executes code, never routes by itself — only validates + passes.
//   • Chunk/prewarm-aware only via metadata (never imperative).
//
// GUARANTEES (v16-IMMORTAL):
//   • No randomness, no timing, no env access.
//   • No dynamic imports, no eval.
//   • No network, no filesystem.
//   • Zero mutation of input packets.
//   • Presence-aware only via control metadata (band, presenceTag, bandSignature).
//   • Chunk/prewarm/cache hints are metadata-only, non-imperative.
//   • Mesh artery metrics are deterministic, window-based, and read-only.
//
// CONTRACT (v16):
//   • INPUT (data path):
//       - packet: object (symbolic, non-array)
//   • INPUT (control path):
//       - from: string
//       - options: {
//           band?,
//           presenceTag?,
//           bandSignature?,
//           trace?,
//           chunkHint?,
//           prewarmHint?,
//           cacheHint?
//         }
//   • OUTPUT:
//       - packet (unchanged) OR fallback result from fallbackProxy.
//       - meshArtery snapshot available via getMeshArtery().
//
// SAFETY:
//   • Pure symbolic path is metadata-only, non-executable.
//   • Fallback path is delegated to injected fallbackProxy.
//   • Mesh artery is observational only — never used to mutate routing.
// ============================================================================

/*
AI_EXPERIENCE_META = {
  identity: "PulseMesh",
  version: "v16-IMMORTAL",
  layer: "mesh_symbolic",
  role: "symbolic_mesh_kernel",
  lineage: "PulseMesh-v14 → v15-Evo-Immortal → v16-IMMORTAL",

  evo: {
    symbolicPrimary: true,
    binaryAware: true,
    dualBand: true,

    deterministic: true,
    driftProof: true,
    zeroNetwork: true,
    zeroFilesystem: true,
    zeroMutationOfInput: true,

    meshTopologyAware: true,
    meshPresenceAware: true,
    meshAuraAware: true,
    meshFlowAware: true,

    chunkAware: true,
    prewarmAware: true,
    cacheAware: true,
    arteryAware: true,

    safeRouteFree: true
  },

  contract: {
    always: [
      "PulseMeshFlow",
      "PulseMeshCognition",
      "PulseMeshPresenceRelay",
      "PulseMeshEndocrineSystem",
      "PulseMeshImmuneSystem",
      "PulseMeshOrgans",
      "PulseMeshThalamus"
    ],
    never: [
      "legacyMesh",
      "safeRoute",
      "fetchViaCNS"
    ]
  }
}
*/

export const PulseMeshMeta = Object.freeze({
  layer: "SymbolicNervousSystem",
  role: "PURE_SYMBOLIC_MESH",
  version: "v16-IMMORTAL",
  identity: "PulseMesh-v16-IMMORTAL",
  guarantees: Object.freeze({
    pureSymbolicPath: true,          // Only object packets on data path
    deterministic: true,             // Same input → same output
    driftProof: true,                // No topology or behavior drift
    mutationSafe: true,              // Never mutates input packets
    presenceAware: true,             // Reads band/presenceTag metadata
    bandAware: true,                 // Symbolic primary, binary-aware
    bandSignatureAware: true,        // Reads bandSignature metadata
    chunkAware: true,                // Reads chunkHint metadata
    prewarmAware: true,              // Reads prewarmHint metadata
    cacheAware: true,                // Reads cacheHint metadata
    arteryAware: true,               // Exposes mesh artery metrics
    noRandomness: true,              // No RNG
    noTiming: true,                  // No timing-based behavior
    noEnvAccess: true,               // No env, no process
    zeroNetwork: true,               // No network access
    zeroFilesystem: true,            // No FS access
    metadataOnly: true               // No execution, no side-effectful compute
  }),
  contract: Object.freeze({
    inputDataPath: ["packet"],
    inputControlPath: [
      "from",
      "band",
      "presenceTag",
      "bandSignature",
      "trace",
      "chunkHint",
      "prewarmHint",
      "cacheHint"
    ],
    outputDataPath: ["packet"],
    outputFallback: ["fallbackResult"],
    arteryPath: ["meshArtery"]
  })
});

// ============================================================================
// IMPORTS — MESH SUBSYSTEMS (SYMBOLIC SIDE)
// ============================================================================

// 0 — CORE ORGANISM BOOT
import { createOrganismMesh } from "./OrganismMesh-v16.js";

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
import PresenceAIView from "./PresenceAIView.js";
import MentorUpgradeRequest from "./PulseMeshMentorUpgradeRequest.js";
import { createPulseWorldSocialGraph } from "./PulseWorldSocialGraph.js";

// ============================================================================
// CORTEX + TENDONS (SHAPING LAYERS — ALWAYS LAST)
// ============================================================================
import { applyPulseCortex } from "./PulseMeshCortex.js";
import { applyPulseMeshTendons } from "./PulseMeshTendons.js";

// ============================================================================
// INTERNAL HELPERS — v16-IMMORTAL
// ============================================================================
function isSymbolicPacket(packet) {
  // Symbolic packets are plain objects (non-null, non-array).
  return packet && typeof packet === "object" && !Array.isArray(packet);
}

function safeLog(fn, fallback) {
  if (typeof fn === "function") return fn;
  if (typeof console !== "undefined" && typeof fallback === "function") return fallback;
  return () => {};
}

// ---------------------------------------------------------------------------
// MESH ARTERY HELPERS — v4 (PURE, STATEFUL BUT LOCAL TO MESH CORE)
// ---------------------------------------------------------------------------
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

function computeMeshArtery({
  total,
  window,
  windowMs,
  errors,
  fallbacks
}) {
  const evalDensity = Math.min(1, window / 1024);
  const errorRate = window > 0 ? Math.min(1, errors / window) : 0;
  const fallbackRate = window > 0 ? Math.min(1, fallbacks / window) : 0;

  const pressureBase = Math.max(
    0,
    Math.min(1, (evalDensity * 0.5 + errorRate * 0.3 + fallbackRate * 0.2))
  );

  const pressure = pressureBase;
  const throughput = Math.max(0, Math.min(1, 1 - pressure));
  const cost = Math.max(0, Math.min(1, pressure * (1 - throughput)));
  const budget = Math.max(0, Math.min(1, throughput - cost));

  return Object.freeze({
    total,
    window,
    windowMs,
    errors,
    fallbacks,
    evalDensity,
    errorRate,
    fallbackRate,
    throughput,
    pressure,
    cost,
    budget,
    throughputBucket: bucketLevel(throughput),
    pressureBucket: bucketPressure(pressure),
    costBucket: bucketCost(cost),
    budgetBucket: bucketLevel(budget)
  });
}

// ============================================================================
// PULSE MESH CORE — v16‑IMMORTAL
// ============================================================================
export function createPulseMesh({
  fallbackProxy,
  trace = false,
  defaultBand = "symbolic",
  defaultPresenceTag = "PulseMesh-v16",
  windowMs = 60000
} = {}) {

  // links[from] = to
  const links = Object.create(null);

  const logWarn = safeLog(globalThis?.warn, console?.warn);
  const logInfo = safeLog(globalThis?.log, console?.log);

  // artery counters
  let _total = 0;
  let _window = 0;
  let _errors = 0;
  let _fallbacks = 0;
  let _windowStart = Date.now();

  function rollWindow(now) {
    if (now - _windowStart >= windowMs) {
      _windowStart = now;
      _window = 0;
      _errors = 0;
      _fallbacks = 0;
    }
  }

  function getMeshArtery() {
    const now = Date.now();
    rollWindow(now);
    return computeMeshArtery({
      total: _total,
      window: _window,
      windowMs,
      errors: _errors,
      fallbacks: _fallbacks
    });
  }

  // -------------------------------------------------------------------------
  // LINK REGISTRATION (symbolic-only)
  // -------------------------------------------------------------------------
  function link(from, to) {
    links[from] = to;
  }

  // -------------------------------------------------------------------------
  // SMART SYMBOLIC FALLBACK (presence-aware, artery-aware)
  // -------------------------------------------------------------------------
  function fallback(reason, from, packet, {
    band = defaultBand,
    presenceTag = defaultPresenceTag,
    bandSignature = null,
    chunkHint = null,
    prewarmHint = null,
    cacheHint = null
  } = {}) {

    if (!fallbackProxy) {
      _errors++;
      throw new Error(
        `PulseMesh v16 fallback triggered (${reason}) from:${from} but no fallbackProxy provided`
      );
    }

    _fallbacks++;

    if (trace) {
      logWarn(
        `[PulseMesh v16] FALLBACK (${reason}) from:${from} band:${band} presence:${presenceTag} bandSig:${bandSignature || "none"}`,
        { packet, chunkHint, prewarmHint, cacheHint }
      );
    }

    const artery = getMeshArtery();
    const control = {
      band,
      presenceTag,
      bandSignature,
      reason,
      chunkHint,
      prewarmHint,
      cacheHint,
      meshArtery: artery
    };

    return fallbackProxy.exchange
      ? fallbackProxy.exchange(packet, control)
      : fallbackProxy(packet, control);
  }

  // -------------------------------------------------------------------------
  // PURE SYMBOLIC TRANSMISSION (semantic connective tissue)
// -------------------------------------------------------------------------
  function transmit(from, packet, {
    band = defaultBand,
    presenceTag = defaultPresenceTag,
    bandSignature = null,
    chunkHint = null,
    prewarmHint = null,
    cacheHint = null
  } = {}) {

    const now = Date.now();
    rollWindow(now);
    _total++;
    _window++;

    const to = links[from];

    if (!to) {
      return fallback("missing-link", from, packet, {
        band,
        presenceTag,
        bandSignature,
        chunkHint,
        prewarmHint,
        cacheHint
      });
    }

    if (!isSymbolicPacket(packet)) {
      return fallback("non-symbolic-input", from, packet, {
        band,
        presenceTag,
        bandSignature,
        chunkHint,
        prewarmHint,
        cacheHint
      });
    }

    if (trace) {
      logInfo(
        `[PulseMesh v16] ${from} → ${to} band:${band} presence:${presenceTag} bandSig:${bandSignature || "none"}`,
        { packet, chunkHint, prewarmHint, cacheHint }
      );
    }

    // Pure symbolic path — never mutate packets, never interpret them.
    return packet;
  }

  // -------------------------------------------------------------------------
  // PUBLIC CORE API
  // -------------------------------------------------------------------------
  return Object.freeze({
    meta: PulseMeshMeta,
    link,
    transmit,
    fallback,
    getMeshArtery
  });
}

// ============================================================================
// PULSE MESH ENVIRONMENT — v16‑IMMORTAL
//   LOAD ALL MESH SYSTEMS, WIRE, PREWARM, BOOT VIA ORGANISM
// ============================================================================
//
//  ROLE:
//    • Creates the symbolic mesh core (v16-IMMORTAL).
//    • Boots OrganismMesh with Cortex + Tendons injected.
//    • Wires symbolic mesh subsystems in correct IMMORTAL order.
//    • Provides a single `prewarm` entrypoint for the symbolic mesh world.
//    • Exposes mesh artery snapshot via meshCore.getMeshArtery().
// ============================================================================

export function createPulseMeshEnvironment({
  context = {},
  fallbackProxy,
  trace = false,
  defaultBand = "symbolic",
  defaultPresenceTag = "PulseMesh-v16",
  windowMs = 60000
} = {}) {

  const log   = context.log   || safeLog(globalThis?.log, console?.log);
  const warn  = context.warn  || safeLog(globalThis?.warn, console?.warn);
  const error = context.error || safeLog(globalThis?.error, console?.error);

  // -------------------------------------------------------
  // 0) CREATE SYMBOLIC CORE (CORTEX + TENDONS APPLIED IN FALLBACK)
  // -------------------------------------------------------
  const symbolicMesh = createPulseMesh({
    fallbackProxy,
    trace,
    defaultBand,
    defaultPresenceTag,
    windowMs
  });

  // -------------------------------------------------------
  // 1) BOOT ORGANISM (CORTEX + TENDONS INJECTED)
  // -------------------------------------------------------
  const organism = createOrganismMesh({
    context: {
      ...context,
      applyPulseCortex,
      applyPulseMeshTendons
    },
    symbolicMeshEnv: { symbolicMesh },
    binaryMeshEnv: context.binaryMeshEnv,
    trace
  });

  const meshCore = organism.symbolicMeshEnv?.symbolicMesh || symbolicMesh;

  // -------------------------------------------------------
  // 2) SPINE (ROOT OF MESH NERVOUS SYSTEM)
  // -------------------------------------------------------
  const meshSpine = PulseMeshSpine?.create
    ? PulseMeshSpine.create({ context, mesh: meshCore, log, warn })
    : null;

  // -------------------------------------------------------
  // 3) FLOW (MESH CIRCULATION)
  // -------------------------------------------------------
  const meshFlow = PulseMeshFlow?.create
    ? PulseMeshFlow.create({ context, mesh: meshCore, log, warn })
    : null;

  // -------------------------------------------------------
  // 4) PRESENCE RELAY (MESH → WORLD PRESENCE)
  // -------------------------------------------------------
  const meshPresenceRelay = PulseMeshPresenceRelay?.create
    ? PulseMeshPresenceRelay.create({
        MeshBus: context.MeshBus,
        SystemClock: context.SystemClock,
        IdentityDirectory: context.IdentityDirectory,
        log
      })
    : null;

  // -------------------------------------------------------
  // 5) COGNITION (MESH-LEVEL COGNITION)
  // -------------------------------------------------------
  const meshCognition = PulseMeshCognition?.create
    ? PulseMeshCognition.create({ context, mesh: meshCore, flow: meshFlow, log, warn })
    : null;

  // -------------------------------------------------------
  // 6) ENDOCRINE / IMMUNE / ORGANS (STRUCTURAL LAYERS)
  // -------------------------------------------------------
  const meshEndocrine = PulseMeshEndocrineSystem?.create
    ? PulseMeshEndocrineSystem.create({ context, mesh: meshCore, log, warn })
    : null;

  const meshImmune = PulseMeshImmuneSystem?.create
    ? PulseMeshImmuneSystem.create({ context, mesh: meshCore, log, warn })
    : null;

  const meshOrgans = PulseMeshOrgans?.create
    ? PulseMeshOrgans.create({ context, mesh: meshCore, log, warn })
    : null;

  // -------------------------------------------------------
  // 7) THALAMUS (AFTER ORGANS)
  // -------------------------------------------------------
  const meshThalamus = PulseMeshThalamus?.create
    ? PulseMeshThalamus.create({
        log,
        warn,
        error,
        groupCollapsed: context.groupCollapsed || console.groupCollapsed?.bind(console),
        groupEnd: context.groupEnd || console.groupEnd?.bind(console)
      })
    : null;

  // -------------------------------------------------------
  // 8) WORLD LAYER (PRESENCE + MENTOR + SOCIAL GRAPH)
  // -------------------------------------------------------
  const presenceAIView = PresenceAIView?.create
    ? PresenceAIView.create({ context, mesh: meshCore, log, warn })
    : null;

  const mentorUpgradeRequest = MentorUpgradeRequest?.create
    ? MentorUpgradeRequest.create({ context, mesh: meshCore, log, warn })
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
  // 9) ENVIRONMENT REGISTRY (IMMORTAL ORDER)
  // -------------------------------------------------------
  const ALL_MESH_SYSTEMS = Object.freeze({
    symbolicMesh: meshCore,
    meshSpine,
    meshFlow,
    meshPresenceRelay,
    meshCognition,
    meshEndocrine,
    meshImmune,
    meshOrgans,
    meshThalamus,
    presenceAIView,
    mentorUpgradeRequest,
    socialGraph
  });

  // -------------------------------------------------------
  // 10) UNIVERSAL PREWARM (IMMORTAL ORDER)
  // -------------------------------------------------------
  function prewarm() {
    log("[PulseMesh v16] Prewarm start");

    for (const [name, system] of Object.entries(ALL_MESH_SYSTEMS)) {
      if (system?.prewarm) {
        try {
          system.prewarm();
          log("[PulseMesh v16] Prewarmed mesh system", { name });
        } catch (e) {
          warn("[PulseMesh v16] Prewarm failed", { name, error: e?.message });
        }
      }
    }

    log("[PulseMesh v16] Prewarm complete");
  }

  // -------------------------------------------------------
  // 11) PUBLIC API
  // -------------------------------------------------------
  return Object.freeze({
    meta: PulseMeshMeta,

    // core
    symbolicMesh: meshCore,

    // subsystems
    meshSpine,
    meshFlow,
    meshPresenceRelay,
    meshCognition,
    meshEndocrine,
    meshImmune,
    meshOrgans,
    meshThalamus,
    presenceAIView,
    mentorUpgradeRequest,
    socialGraph,

    // controls
    link: meshCore.link,
    transmit: meshCore.transmit,
    fallback: meshCore.fallback,
    getMeshArtery: meshCore.getMeshArtery,
    prewarm,

    systems: ALL_MESH_SYSTEMS,
    organism
  });
}

export default {
  PulseMeshMeta,
  createPulseMesh,
  createPulseMeshEnvironment
};
