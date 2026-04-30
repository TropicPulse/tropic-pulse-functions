// ============================================================================
// FILE: PulseMesh-v13-Evo.js
// PULSE MESH — v13-EVO-PRIME
// “PURE SYMBOLIC CONNECTIVE TISSUE / SYMBOLIC-FIRST / SMART FALLBACK”
// ============================================================================
//
// ROLE:
//   • Primary symbolic connective tissue between organs.
//   • Pure symbolic packets (objects, no arrays as root).
//   • Deterministic, drift-proof, mutation-safe.
//   • Presence-aware + dual-band.
//   • Falls back via fallbackProxy when contract is violated.
//
// CONTRACT (v13):
//   • INPUT (data path):
//       - packet: object (non-array)
//   • INPUT (control path):
//       - from: string
//       - options: { band?, presenceTag?, trace? }
//   • OUTPUT:
//       - packet (unchanged) OR fallback result
//
// SAFETY:
//   • No randomness, no timing, no env access.
//   • No dynamic imports, no eval.
// ============================================================================

export const PulseMeshMeta = Object.freeze({
  layer: "SymbolicNervousSystem",
  role: "PURE_SYMBOLIC_MESH",
  version: "v13-EVO-PRIME",
  identity: "PulseMesh-v13-EVO-PRIME",
  guarantees: Object.freeze({
    pureSymbolicPath: true,
    deterministic: true,
    driftProof: true,
    mutationSafe: true,
    presenceAware: true,
    bandAware: true,
    noRandomness: true,
    noTiming: true,
    noEnvAccess: true
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
  return packet && typeof packet === "object" && !Array.isArray(packet);
}

function safeLog(fn, fallback) {
  if (typeof fn === "function") return fn;
  if (typeof console !== "undefined" && typeof fallback === "function") return fallback;
  return () => {};
}

// ============================================================================
// PULSE MESH CORE — v13‑EVO‑PRIME
// ============================================================================
export function createPulseMesh({
  fallbackProxy,
  trace = false,
  defaultBand = "symbolic",
  defaultPresenceTag = "PulseMesh-v13"
} = {}) {

  const links = Object.create(null);

  const logWarn = safeLog(globalThis?.warn, console?.warn);
  const logInfo = safeLog(globalThis?.log, console?.log);

  // -------------------------------------------------------------------------
  // LINK REGISTRATION (symbolic-only)
  // -------------------------------------------------------------------------
  function link(from, to) {
    links[from] = to;
  }

  // -------------------------------------------------------------------------
  // SMART SYMBOLIC FALLBACK (presence-aware)
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
        `[PulseMesh v13] FALLBACK (${reason}) from:${from} band:${band} presence:${presenceTag}`,
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
        `[PulseMesh v13] ${from} → ${to} band:${band} presence:${presenceTag}`,
        packet
      );
    }

    // Never mutate symbolic packets
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
// PULSE MESH ENVIRONMENT — v13‑EVO‑PRIME
//   LOAD ALL MESH SYSTEMS, WIRE, PREWARM, BOOT VIA ORGANISM
// ============================================================================

export function createPulseMeshEnvironment({
  context = {},
  fallbackProxy,
  trace = false,
  defaultBand = "symbolic",
  defaultPresenceTag = "PulseMesh-v13"
} = {}) {

  const log   = context.log   || safeLog(globalThis?.log, console?.log);
  const warn  = context.warn  || safeLog(globalThis?.warn, console?.warn);
  const error = context.error || safeLog(globalThis?.error, console?.error);

  // -------------------------------------------------------
  // 0) BOOT THE ORGANISM (THE ROUTE)
  // -------------------------------------------------------
  const organism = createOrganismMesh({
    context,
    fallbackProxy,
    trace,
    defaultBand,
    defaultPresenceTag
  });

  // organism gives you BOTH meshes:
  //   organism.symbolicMeshEnv
  //   organism.binaryMeshEnv

  const symbolicMesh = organism.symbolicMeshEnv.symbolicMesh;

  // -------------------------------------------------------
  // 1) FLOW / TOPOLOGY
  // -------------------------------------------------------
  const meshFlow = PulseMeshFlow?.create
    ? PulseMeshFlow.create({ context, mesh: symbolicMesh, log, warn })
    : null;

  // 2) PRESENCE RELAY
  const meshPresenceRelay = PulseMeshPresenceRelay?.create
    ? PulseMeshPresenceRelay.create({
        MeshBus: context.MeshBus,
        SystemClock: context.SystemClock,
        IdentityDirectory: context.IdentityDirectory,
        log
      })
    : null;

  // 3) HIGHER-ORDER MESH SYSTEMS
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
    ? PulseMeshThalamus.create({ context, mesh: symbolicMesh, log, warn })
    : null;

  // 4) VIEWS / UPGRADE / UX LAYERS
  const presenceAIView = PresenceAIView?.create
    ? PresenceAIView.create({ context, mesh: symbolicMesh, log, warn })
    : null;

  const mentorUpgradeRequest = MentorUpgradeRequest?.create
    ? MentorUpgradeRequest.create({ context, mesh: symbolicMesh, log, warn })
    : null;

  // 5) ENVIRONMENT REGISTRY
  const ALL_MESH_SYSTEMS = Object.freeze({
    symbolicMesh,
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

  // 6) UNIVERSAL PREWARM
  function prewarm() {
    log("[PulseMesh v13] Prewarm start");

    for (const [name, system] of Object.entries(ALL_MESH_SYSTEMS)) {
      if (system && typeof system.prewarm === "function") {
        try {
          system.prewarm();
          log("[PulseMesh v13] Prewarmed mesh system", { name });
        } catch (e) {
          warn("[PulseMesh v13] Prewarm failed for mesh system", {
            name,
            error: e?.message
          });
        }
      }
    }

    log("[PulseMesh v13] Prewarm complete");
  }

  // 7) PUBLIC FACADE
  function link(from, to) {
    symbolicMesh.link(from, to);
  }

  function transmit(from, packet, options = {}) {
    return symbolicMesh.transmit(from, packet, options);
  }

  function fallback(reason, from, packet, options = {}) {
    return symbolicMesh.fallback(reason, from, packet, options);
  }

  // 8) PUBLIC ENVIRONMENT API
  const meshEnvironment = Object.freeze({
    meta: PulseMeshMeta,

    // core
    symbolicMesh,

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
