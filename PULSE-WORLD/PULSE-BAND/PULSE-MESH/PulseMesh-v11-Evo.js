// ============================================================================
// FILE: PulseMesh-v15-EVO.js
// PULSE SYMBOLIC MESH — v15-EVO-IMMORTAL
// “PURE SYMBOLIC CONNECTIVE TISSUE / SEMANTIC PATH / BINARY-AWARE”
// ============================================================================
//
// ROLE:
//   • Primary symbolic connective tissue between symbolic organs.
//   • Carries semantic packets (objects) only — no raw binary arrays.
//   • Deterministic, drift-proof, mutation-safe, presence-aware.
//   • Dual-band aware (symbolic primary, binary-aware via metadata).
//   • Falls back to a provided fallbackProxy when contract is violated.
//
// ARCHITECTURAL POSITION:
//   • Lives in SymbolicNervousSystem layer.
//   • Sits under OrganismMesh as the symbolic nervous system.
//   • Talks to binary mesh via fallbackProxy or higher layers.
//   • Never executes code, never routes by itself — only validates + passes.
//
// GUARANTEES:
//   • No randomness, no timing, no env access.
//   • No dynamic imports, no eval.
//   • No network, no filesystem.
//   • Zero mutation of input packets.
//   • Presence-aware only via control metadata (band, presenceTag).
//
// CONTRACT (v15):
//   • INPUT (data path):
//       - packet: object (symbolic, non-array)
//   • INPUT (control path):
//       - from: string
//       - options: { band?, presenceTag?, trace? }
//   • OUTPUT:
//       - packet (unchanged) OR fallback result from fallbackProxy.
//
// SAFETY:
//   • Pure symbolic path is metadata-only, non-executable.
//   • Fallback path is delegated to injected fallbackProxy.
// ============================================================================

/*
AI_EXPERIENCE_META = {
  identity: "PulseMesh",
  version: "v14-IMMORTAL",
  layer: "mesh_symbolic",
  role: "symbolic_mesh_kernel",
  lineage: "PulseMesh-v14",

  evo: {
    symbolicPrimary: true,
    binaryAware: true,
    dualBand: true,

    deterministic: true,
    driftProof: true,
    zeroNetwork: true,
    zeroFilesystem: true,

    meshTopologyAware: true,
    meshPresenceAware: true,
    meshAuraAware: true,
    meshFlowAware: true,

    safeRouteFree: true,
    zeroMutationOfInput: true
  },

  contract: {
    always: [
      "PulseMeshFlow",
      "PulseMeshAwareness",
      "PulseMeshCognition",
      "PulseMeshPresenceRelay"
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
  version: "v15-EVO-IMMORTAL",
  identity: "PulseMesh-v15-EVO-IMMORTAL",
  guarantees: Object.freeze({
    pureSymbolicPath: true,          // Only object packets on data path
    deterministic: true,             // Same input → same output
    driftProof: true,                // No topology or behavior drift
    mutationSafe: true,              // Never mutates input packets
    presenceAware: true,             // Reads band/presenceTag metadata
    bandAware: true,                 // Symbolic primary, binary-aware
    noRandomness: true,              // No RNG
    noTiming: true,                  // No timing-based behavior
    noEnvAccess: true,               // No env, no process
    zeroNetwork: true,               // No network access
    zeroFilesystem: true,            // No FS access
    metadataOnly: true               // No execution, no side-effectful compute
  }),
  contract: Object.freeze({
    inputDataPath: ["packet"],
    inputControlPath: ["from", "band", "presenceTag", "trace"],
    outputDataPath: ["packet"],
    outputFallback: ["fallbackResult"]
  })
});
// ============================================================================
// IMPORTS — MESH SUBSYSTEMS (SYMBOLIC SIDE)
// ============================================================================

// 0 — CORE ORGANISM BOOT
import { createOrganismMesh } from "./OrganismMesh-v1-EVO.js";

// 1 — SPINE (root of mesh nervous system)
import PulseMeshSpine from "./PulseMeshSpine.js";

// 2 — FLOW (mesh circulation)
import PulseMeshFlow from "./PulseMeshFlow.js";

// 3 — PRESENCE RELAY (mesh → world presence)
import PulseMeshPresenceRelay from "./PulseMeshPresenceRelay-v12.4-EVO.js";

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
import MentorUpgradeRequest from "./MentorUpgradeRequest.js";
import { createPulseWorldSocialGraph } from "./PulseWorldSocialGraph.js";

// ============================================================================
// CORTEX + TENDONS (SHAPING LAYERS — ALWAYS LAST)
// ============================================================================
import { applyPulseCortex } from "./PulseMeshCortex.js";
import { applyPulseMeshTendons } from "./PulseMeshTendons.js";

// ============================================================================
// INTERNAL HELPERS
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

// ============================================================================
// PULSE MESH CORE — v15‑EVO‑IMMORTAL
// ============================================================================
export function createPulseMesh({
  fallbackProxy,
  trace = false,
  defaultBand = "symbolic",
  defaultPresenceTag = "PulseMesh-v15"
} = {}) {

  // links[from] = to
  const links = Object.create(null);

  const logWarn = safeLog(globalThis?.warn, console?.warn);
  const logInfo = safeLog(globalThis?.log, console?.log);

  // -------------------------------------------------------------------------
  // LINK REGISTRATION (symbolic-only)
  // -------------------------------------------------------------------------
  //  ROLE:
  //    • Declares a symbolic path from one organ to another.
  //    • Purely topological — no routing policy, no semantics.
  // -------------------------------------------------------------------------
  function link(from, to) {
    links[from] = to;
  }

  // -------------------------------------------------------------------------
  // SMART SYMBOLIC FALLBACK (presence-aware)
// -------------------------------------------------------------------------
//  TRIGGERS:
//    • missing-link        — no symbolic path for `from`
//    • non-symbolic-input  — packet not a plain object
//
//  BEHAVIOR:
//    • Logs (if trace).
//    • Delegates to fallbackProxy (function or .exchange API).
// -------------------------------------------------------------------------
  function fallback(reason, from, packet, {
    band = defaultBand,
    presenceTag = defaultPresenceTag
  } = {}) {

    if (!fallbackProxy) {
      throw new Error(
        `PulseMesh fallback triggered (${reason}) from:${from} but no fallbackProxy provided`
      );
    }

    if (trace) {
      logWarn(
        `[PulseMesh v15] FALLBACK (${reason}) from:${from} band:${band} presence:${presenceTag}`,
        packet
      );
    }

    return fallbackProxy.exchange
      ? fallbackProxy.exchange(packet, { band, presenceTag, reason })
      : fallbackProxy(packet, { band, presenceTag, reason });
  }

  // -------------------------------------------------------------------------
  // PURE SYMBOLIC TRANSMISSION (semantic connective tissue)
// -------------------------------------------------------------------------
//  INPUT:
//    • from: string
//    • packet: object (symbolic)
//    • options: { band?, presenceTag? }
//
//  OUTPUT:
//    • packet (unchanged) OR fallback result.
//
//  RULES:
//    • If no link[from] → fallback("missing-link").
//    • If packet not symbolic → fallback("non-symbolic-input").
//    • Otherwise: return packet as-is (pure symbolic path).
// -------------------------------------------------------------------------
  function transmit(from, packet, {
    band = defaultBand,
    presenceTag = defaultPresenceTag
  } = {}) {

    const to = links[from];

    if (!to) {
      return fallback("missing-link", from, packet, { band, presenceTag });
    }

    if (!isSymbolicPacket(packet)) {
      return fallback("non-symbolic-input", from, packet, { band, presenceTag });
    }

    if (trace) {
      logInfo(
        `[PulseMesh v15] ${from} → ${to} band:${band} presence:${presenceTag}`,
        packet
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
    fallback
  });
}

// ============================================================================
// PULSE MESH ENVIRONMENT — v15‑EVO‑IMMORTAL
//   LOAD ALL MESH SYSTEMS, WIRE, PREWARM, BOOT VIA ORGANISM
// ============================================================================
//
//  ROLE:
//    • Creates the symbolic mesh core.
//    • Boots OrganismMesh with Cortex + Tendons injected.
//    • Wires symbolic mesh subsystems in correct IMMORTAL order.
//    • Provides a single `prewarm` entrypoint for the symbolic mesh world.
// ============================================================================

export function createPulseMeshEnvironment({
  context = {},
  fallbackProxy,
  trace = false,
  defaultBand = "symbolic",
  defaultPresenceTag = "PulseMesh-v15"
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
    defaultPresenceTag
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
    log("[PulseMesh v15] Prewarm start");

    for (const [name, system] of Object.entries(ALL_MESH_SYSTEMS)) {
      if (system?.prewarm) {
        try {
          system.prewarm();
          log("[PulseMesh v15] Prewarmed mesh system", { name });
        } catch (e) {
          warn("[PulseMesh v15] Prewarm failed", { name, error: e?.message });
        }
      }
    }

    log("[PulseMesh v15] Prewarm complete");
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
