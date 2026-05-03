// ============================================================================
// FILE: BinaryMesh-v15-EVO.js
// BINARY MESH — v15-EVO-IMMORTAL
// “PURE BINARY CONNECTIVE TISSUE / BINARY-FIRST / SYMBOLIC FALLBACK”
// ============================================================================
//
// ROLE:
//   • Primary binary connective tissue between binary organs.
//   • Zero symbolic data in the binary path (0/1 arrays only).
//   • Deterministic, drift-proof, mutation-safe, presence-aware.
//   • Dual-band aware (binary primary, symbolic fallback).
//   • Falls back to symbolic PulseMesh when binary contract is violated.
//
// ARCHITECTURAL POSITION:
//   • Lives in mesh_binary layer.
//   • Sits under OrganismMesh as the binary nervous system.
//   • Talks to symbolic mesh via fallback (PulseMeshFlow, PresenceRelay, etc.).
//   • Never routes, never computes semantics — only validates and passes bits.
//
// GUARANTEES:
//   • No randomness, no timing, no env access.
//   • No dynamic imports, no eval.
//   • No network, no filesystem.
//   • Zero mutation of input bits.
//   • Mesh-topology-aware only via symbolic fallback.
//   • Presence-aware only via control metadata (band, presenceTag).
//
// CONTRACT (v15):
//   • INPUT (data path):
//       - bits: number[] (0 or 1 only)
//   • INPUT (control path):
//       - from: string
//       - options: { band?, presenceTag?, trace? }
//   • OUTPUT:
//       - bits (unchanged) OR symbolic fallback result
//
// SAFETY:
//   • Pure binary path is metadata-only, non-executable.
//   • Fallback path is symbolicMesh.transmit with explicit reason.
// ============================================================================

/*
AI_EXPERIENCE_META = {
  identity: "PulseBinaryMesh",
  version: "v14-IMMORTAL",
  layer: "mesh_binary",
  role: "binary_mesh_kernel",
  lineage: "PulseMesh-v14",

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
    safeRouteFree: true
  },

  contract: {
    always: [
      "PulseMeshFlow",
      "PulseMeshAwareness",
      "PulseMeshPresenceRelay"
    ],
    never: [
      "safeRoute",
      "fetchViaCNS",
      "legacyBinaryMesh"
    ]
  }
}
*/

// ============================================================================
// META — v15-EVO-IMMORTAL
// ============================================================================
export const BinaryMeshMeta = Object.freeze({
  layer: "BinaryNervousSystem",
  role: "PURE_BINARY_MESH",
  version: "v15-EVO-IMMORTAL",
  identity: "BinaryMesh-v15-EVO-IMMORTAL",
  guarantees: Object.freeze({
    pureBinaryPath: true,            // Only 0/1 arrays on data path
    zeroSymbolicInDataPath: true,    // No strings/objects in binary path
    deterministic: true,             // Same input → same output
    driftProof: true,                // No topology or behavior drift
    mutationSafe: true,              // Never mutates input bits
    presenceAware: true,             // Reads band/presenceTag metadata
    bandAware: true,                 // Binary primary, symbolic fallback
    noRandomness: true,              // No RNG
    noTiming: true,                  // No timing-based behavior
    noEnvAccess: true,               // No env, no process
    zeroNetwork: true,               // No network access
    zeroFilesystem: true,            // No FS access
    nonExecutableBinary: true,       // Bits are data, never code
    metadataOnly: true               // No semantic interpretation of bits
  }),
  contract: Object.freeze({
    inputDataPath: ["bits"],
    inputControlPath: ["from", "band", "presenceTag", "trace"],
    outputDataPath: ["bits"],
    outputFallback: ["fallbackResult"]
  })
});

// ============================================================================
// IMPORTS — MESH SUBSYSTEMS (SYMBOLIC SIDE)
// ============================================================================
import { createOrganismMesh } from "./OrganismMesh-v1-EVO.js";

// symbolic-side mesh systems
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

// ============================================================================
// BINARY MESH FACTORY — v15-EVO-IMMORTAL
// ============================================================================
export function createBinaryMesh({
  symbolicMesh,           // PulseMesh (symbolic fallback)
  trace = false,
  maxBitsLength = 64,
  defaultBand = "binary",
  defaultPresenceTag = "BinaryMesh-v15"
} = {}) {

  // links[from] = to
  const links = Object.create(null);

  const logWarn = safeLog(globalThis?.warn, console?.warn);
  const logInfo = safeLog(globalThis?.log, console?.log);

  // -------------------------------------------------------------------------
  // LINK REGISTRATION
  // -------------------------------------------------------------------------
  //  ROLE:
  //    • Declares a binary path from one organ to another.
  //    • Purely topological — no semantics, no routing logic.
  // -------------------------------------------------------------------------
  function link(from, to) {
    links[from] = to;
  }

  // -------------------------------------------------------------------------
  // SYMBOLIC FALLBACK (binary → symbolic)
  // -------------------------------------------------------------------------
  //  TRIGGERS:
  //    • missing-link        — no binary path for `from`
  //    • non-binary-input    — bits not pure 0/1 or length invalid
  //
  //  BEHAVIOR:
  //    • Logs (if trace).
  //    • Wraps bits + metadata into a symbolic packet.
  //    • Calls symbolicMesh.transmit(from, packet, { band: "symbolic", ... }).
  // -------------------------------------------------------------------------
  function fallback(reason, from, bits, {
    band = defaultBand,
    presenceTag = defaultPresenceTag
  } = {}) {

    if (!symbolicMesh) {
      throw new Error(
        `BinaryMesh fallback (${reason}) from:${from} but no symbolicMesh provided`
      );
    }

    if (trace) {
      logWarn(
        `[BinaryMesh v15] FALLBACK (${reason}) from:${from} band:${band} presence:${presenceTag}`,
        bits
      );
    }

    const packet = {
      type: "binaryFallback",
      reason,
      from,
      bits,
      band,
      presenceTag
    };

    return symbolicMesh.transmit(from, packet, {
      band: "symbolic",
      presenceTag: "PulseMesh-v15"
    });
  }

  // -------------------------------------------------------------------------
  // PURE BINARY TRANSMISSION (binary-first)
// -------------------------------------------------------------------------
//  INPUT:
//    • from: string
//    • bits: number[] (0/1 only)
//    • options: { band?, presenceTag? }
//
//  OUTPUT:
//    • bits (unchanged) OR symbolic fallback result
//
//  RULES:
//    • If no link[from] → fallback("missing-link").
//    • If bits not pure binary or length invalid → fallback("non-binary-input").
//    • Otherwise: return bits as-is (pure binary path).
// -------------------------------------------------------------------------
  function transmit(from, bits, {
    band = defaultBand,
    presenceTag = defaultPresenceTag
  } = {}) {

    const to = links[from];

    if (!to) {
      return fallback("missing-link", from, bits, { band, presenceTag });
    }

    if (!isPureBinary(bits, maxBitsLength)) {
      return fallback("non-binary-input", from, bits, { band, presenceTag });
    }

    if (trace) {
      logInfo(
        `[BinaryMesh v15] ${from} → ${to} band:${band} presence:${presenceTag}`,
        bits
      );
    }

    // Pure binary path — never mutate bits, never interpret them.
    return bits;
  }

  // -------------------------------------------------------------------------
  // PUBLIC API
  // -------------------------------------------------------------------------
  return Object.freeze({
    meta: BinaryMeshMeta,
    link,
    transmit,
    fallback
  });
}

// ============================================================================
// LOCAL BINARY SUBSYSTEMS — LIVE ON THIS PAGE
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
      log?.("[BinaryPresence] prewarm");
    }

    function pulse(from, bits, options) {
      return binaryMesh.transmit(from, bits, options);
    }

    return Object.freeze({
      prewarm,
      pulse
    });
  }
};

const PulseBinaryMeshPrime = {
  create({ context, binaryMesh, log, warn }) {
    function prewarm() {
      log?.("[BinaryPrime] prewarm");
    }

    function process(from, bits, options) {
      // Extension point for prime binary logic — keep pure, metadata-only.
      return binaryMesh.transmit(from, bits, options);
    }

    return Object.freeze({
      prewarm,
      process
    });
  }
};

// ============================================================================
// BINARY MESH ENVIRONMENT — v15-EVO-IMMORTAL
//   BINARY BARREL: BOOT ORGANISM, LOAD SUBSYSTEMS, WIRE, PREWARM
// ============================================================================
//
//  ROLE:
//    • Boots OrganismMesh (symbolic + binary envs).
//    • Exposes binaryMesh + local binary subsystems.
//    • Wires symbolic-adjacent mesh subsystems.
//    • Provides a single `prewarm` entrypoint for the whole binary environment.
// ============================================================================
export function createBinaryMeshEnvironment({
  context = {},
  trace = false,
  maxBitsLength = 64,
  defaultBand = "binary",
  defaultPresenceTag = "BinaryMesh-v15"
} = {}) {

  const log   = context.log   || safeLog(globalThis?.log, console?.log);
  const warn  = context.warn  || safeLog(globalThis?.warn, console?.warn);
  const error = context.error || safeLog(globalThis?.error, console?.error);

  // -------------------------------------------------------
  // 0) BOOT THE ORGANISM (ROUTE THROUGH ORGANISMMESH)
  // -------------------------------------------------------
  const organism = createOrganismMesh({
    context,
    symbolicMeshEnv: context.symbolicMeshEnv,
    binaryMeshEnv: context.binaryMeshEnv,
    trace
  });

  // organism exposes both meshes via its envs
  const symbolicMesh = organism.symbolicMeshEnv?.symbolicMesh || organism.symbolicMeshEnv;
  const binaryMesh   = organism.binaryMeshEnv?.binaryMesh   || organism.binaryMeshEnv;

  // -------------------------------------------------------
  // 1) BINARY SUBSYSTEMS (LOCAL)
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
    ? PulseMeshThalamus.create({ context, mesh: symbolicMesh, log, warn })
    : null;

  const presenceAIView = PresenceAIView?.create
    ? PresenceAIView.create({ context, mesh: symbolicMesh, log, warn })
    : null;

  const mentorUpgradeRequest = MentorUpgradeRequest?.create
    ? MentorUpgradeRequest.create({ context, mesh: symbolicMesh, log, warn })
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
    presenceAIView,
    mentorUpgradeRequest
  });

  // -------------------------------------------------------
  // 4) PREWARM
  // -------------------------------------------------------
  function prewarm() {
    log("[BinaryMesh v15] Prewarm start");

    for (const [name, system] of Object.entries(ALL_SYSTEMS)) {
      if (system && typeof system.prewarm === "function") {
        try {
          system.prewarm();
          log("[BinaryMesh v15] Prewarmed system", { name });
        } catch (e) {
          warn("[BinaryMesh v15] Prewarm failed", { name, error: e?.message });
        }
      }
    }

    log("[BinaryMesh v15] Prewarm complete");
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
    presenceAIView,
    mentorUpgradeRequest,

    prewarm,
    systems: ALL_SYSTEMS,

    // organism hook
    organism
  });
}

export default {
  BinaryMeshMeta,
  createBinaryMesh,
  createBinaryMeshEnvironment
};
