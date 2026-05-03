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
// IMPORTS — SYMBOLIC MESH SUBSYSTEMS (NO SELF-IMPORT)
// ============================================================================
import { createOrganismMesh } from "./OrganismMesh-v1-EVO.js";
import PulseMeshFlow from "./PulseMeshFlow.js";
import PulseMeshPresenceRelay from "./PulseMeshPresenceRelay-v12.4-EVO.js";

import PulseMeshCognition from "./PulseMeshCognition.js";
import PulseMeshEndocrineSystem from "./PulseMeshEndocrineSystem.js";
import PulseMeshImmuneSystem from "./PulseMeshImmuneSystem.js";
import PulseMeshOrgans from "./PulseMeshOrgans.js";
import PulseMeshThalamus from "./PulseMeshThalamus.js";

import PresenceAIView from "./PresenceAIView.js";
import MentorUpgradeRequest from "./MentorUpgradeRequest.js";

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
//    • Boots OrganismMesh and exposes organism hooks.
//    • Wires symbolic mesh subsystems (flow, cognition, endocrine, etc.).
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
  // 0) CREATE SYMBOLIC CORE
  // -------------------------------------------------------
  const symbolicMesh = createPulseMesh({
    fallbackProxy,
    trace,
    defaultBand,
    defaultPresenceTag
  });

  // -------------------------------------------------------
  // 1) BOOT THE ORGANISM (THE ROUTE)
// -------------------------------------------------------
//  NOTE:
//    • OrganismMesh does not create meshes; it receives envs.
//    • We pass symbolicMesh in as symbolicMeshEnv.
//    • binaryMeshEnv is expected to be provided in context (from BinaryMesh env).
// -------------------------------------------------------
  const organism = createOrganismMesh({
    context,
    symbolicMeshEnv: { symbolicMesh },
    binaryMeshEnv: context.binaryMeshEnv,
    trace
  });

  // organism exposes both meshes via its envs
  const organismSymbolicEnv = organism.symbolicMeshEnv || { symbolicMesh };
  const meshCore = organismSymbolicEnv.symbolicMesh || symbolicMesh;

  // -------------------------------------------------------
  // 2) FLOW / TOPOLOGY
  // -------------------------------------------------------
  const meshFlow = PulseMeshFlow?.create
    ? PulseMeshFlow.create({ context, mesh: meshCore, log, warn })
    : null;

  // 3) PRESENCE RELAY
  const meshPresenceRelay = PulseMeshPresenceRelay?.create
    ? PulseMeshPresenceRelay.create({
        MeshBus: context.MeshBus,
        SystemClock: context.SystemClock,
        IdentityDirectory: context.IdentityDirectory,
        log
      })
    : null;

  // 4) HIGHER-ORDER MESH SYSTEMS
  const meshCognition = PulseMeshCognition?.create
    ? PulseMeshCognition.create({ context, mesh: meshCore, flow: meshFlow, log, warn })
    : null;

  const meshEndocrine = PulseMeshEndocrineSystem?.create
    ? PulseMeshEndocrineSystem.create({ context, mesh: meshCore, log, warn })
    : null;

  const meshImmune = PulseMeshImmuneSystem?.create
    ? PulseMeshImmuneSystem.create({ context, mesh: meshCore, log, warn })
    : null;

  const meshOrgans = PulseMeshOrgans?.create
    ? PulseMeshOrgans.create({ context, mesh: meshCore, log, warn })
    : null;

  const meshThalamus = PulseMeshThalamus?.create
    ? PulseMeshThalamus.create({ context, mesh: meshCore, log, warn })
    : null;

  // 5) VIEWS / UPGRADE / UX LAYERS
  const presenceAIView = PresenceAIView?.create
    ? PresenceAIView.create({ context, mesh: meshCore, log, warn })
    : null;

  const mentorUpgradeRequest = MentorUpgradeRequest?.create
    ? MentorUpgradeRequest.create({ context, mesh: meshCore, log, warn })
    : null;

  // 6) ENVIRONMENT REGISTRY
  const ALL_MESH_SYSTEMS = Object.freeze({
    symbolicMesh: meshCore,
    meshFlow,
    meshPresenceRelay,
    meshCognition,
    meshEndocrine,
    meshImmune,
    meshOrgans,
    meshThalamus,
    presenceAIView,
    mentorUpgradeRequest
  });

  // 7) UNIVERSAL PREWARM
  function prewarm() {
    log("[PulseMesh v15] Prewarm start");

    for (const [name, system] of Object.entries(ALL_MESH_SYSTEMS)) {
      if (system && typeof system.prewarm === "function") {
        try {
          system.prewarm();
          log("[PulseMesh v15] Prewarmed mesh system", { name });
        } catch (e) {
          warn("[PulseMesh v15] Prewarm failed for mesh system", {
            name,
            error: e?.message
          });
        }
      }
    }

    log("[PulseMesh v15] Prewarm complete");
  }

  // 8) PUBLIC FACADE
  function link(from, to) {
    meshCore.link(from, to);
  }

  function transmit(from, packet, options = {}) {
    return meshCore.transmit(from, packet, options);
  }

  function fallback(reason, from, packet, options = {}) {
    return meshCore.fallback(reason, from, packet, options);
  }

  // 9) PUBLIC ENVIRONMENT API
  const meshEnvironment = Object.freeze({
    meta: PulseMeshMeta,

    // core
    symbolicMesh: meshCore,

    // subsystems
    meshFlow,
    meshPresenceRelay,
    meshCognition,
    meshEndocrine,
    meshImmune,
    meshOrgans,
    meshThalamus,
    presenceAIView,
    mentorUpgradeRequest,

    // controls
    link,
    transmit,
    fallback,
    prewarm,

    // raw map
    systems: ALL_MESH_SYSTEMS,

    // organism hooks
    organism
  });

  return meshEnvironment;
}

export default {
  PulseMeshMeta,
  createPulseMesh,
  createPulseMeshEnvironment
};
