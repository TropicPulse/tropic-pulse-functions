// ============================================================================
// FILE: BinaryMesh-v13-Evo.js
// BINARY MESH — v13-EVO-PRIME
// “PURE BINARY CONNECTIVE TISSUE / BINARY-FIRST / SYMBOLIC FALLBACK”
// ============================================================================
//
// ROLE:
//   • Primary binary connective tissue between binary organs.
//   • Zero symbolic data in the binary path (0/1 arrays only).
//   • Deterministic, drift-proof, mutation-safe.
//   • Presence-aware + dual-band.
//   • Falls back to symbolic PulseMesh when binary contract is violated.
//
// CONTRACT (v13):
//   • INPUT (data path):
//       - bits: number[] (0 or 1 only)
//   • INPUT (control path):
//       - from: string.
//       - options: { band?, presenceTag?, trace? }
//   • OUTPUT:
//       - bits (unchanged) OR symbolic fallback result
//
// SAFETY:
//   • No randomness, no timing, no env access.
//   • No dynamic imports, no eval.
// ============================================================================

export const BinaryMeshMeta = Object.freeze({
  layer: "BinaryNervousSystem",
  role: "PURE_BINARY_MESH",
  version: "v13-EVO-PRIME",
  identity: "BinaryMesh-v13-EVO-PRIME",
  guarantees: Object.freeze({
    pureBinaryPath: true,
    zeroSymbolicInDataPath: true,
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
    inputDataPath: ["bits"],
    inputControlPath: ["from", "band", "presenceTag", "trace"],
    outputDataPath: ["bits"],
    outputFallback: ["fallbackResult"]
  })
});

// ============================================================================
// IMPORTS — MESH SUBSYSTEMS
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
// BINARY MESH FACTORY — v13-EVO-PRIME
// ============================================================================
export function createBinaryMesh({
  symbolicMesh,           // PulseMesh-v13 (symbolic fallback)
  trace = false,
  maxBitsLength = 64,
  defaultBand = "binary",
  defaultPresenceTag = "BinaryMesh-v13"
} = {}) {

  const links = Object.create(null);

  const logWarn = safeLog(globalThis?.warn, console?.warn);
  const logInfo = safeLog(globalThis?.log, console?.log);

  // -------------------------------------------------------------------------
  // LINK REGISTRATION
  // -------------------------------------------------------------------------
  function link(from, to) {
    links[from] = to;
  }

  // -------------------------------------------------------------------------
  // SYMBOLIC FALLBACK (binary → symbolic)
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
        `[BinaryMesh v13] FALLBACK (${reason}) from:${from} band:${band} presence:${presenceTag}`,
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
      presenceTag: "PulseMesh-v13"
    });
  }

  // -------------------------------------------------------------------------
  // PURE BINARY TRANSMISSION (binary-first)
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
        `[BinaryMesh v13] ${from} → ${to} band:${band} presence:${presenceTag}`,
        bits
      );
    }

    // Pure binary path — never mutate bits
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
      // extend with your prime binary logic as needed
      return binaryMesh.transmit(from, bits, options);
    }

    return Object.freeze({
      prewarm,
      process
    });
  }
};

// ============================================================================
// BINARY MESH ENVIRONMENT — v13-EVO-PRIME
//   BINARY BARREL: BOOT ORGANISM, LOAD SUBSYSTEMS, WIRE, PREWARM
// ============================================================================
export function createBinaryMeshEnvironment({
  context = {},
  trace = false,
  maxBitsLength = 64,
  defaultBand = "binary",
  defaultPresenceTag = "BinaryMesh-v13"
} = {}) {

  const log   = context.log   || safeLog(globalThis?.log, console?.log);
  const warn  = context.warn  || safeLog(globalThis?.warn, console?.warn);
  const error = context.error || safeLog(globalThis?.error, console?.error);

  // -------------------------------------------------------
  // 0) BOOT THE ORGANISM (ROUTE THROUGH ORGANISMMESH)
// -------------------------------------------------------
  const organism = createOrganismMesh({
    context,
    fallbackProxy: null,          // binary → symbolic handled by binaryMesh itself
    trace,
    defaultBand,
    defaultPresenceTag
  });

  // organism exposes both meshes
  const symbolicMesh = organism.symbolicMeshEnv.symbolicMesh;
  const binaryMesh   = organism.binaryMeshEnv.binaryMesh;

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
    log("[BinaryMesh v13] Prewarm start");

    for (const [name, system] of Object.entries(ALL_SYSTEMS)) {
      if (system && typeof system.prewarm === "function") {
        try {
          system.prewarm();
          log("[BinaryMesh v13] Prewarmed system", { name });
        } catch (e) {
          warn("[BinaryMesh v13] Prewarm failed", { name, error: e?.message });
        }
      }
    }

    log("[BinaryMesh v13] Prewarm complete");
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
