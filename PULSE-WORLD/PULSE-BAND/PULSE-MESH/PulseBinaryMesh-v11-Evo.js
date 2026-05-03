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
// BINARY MESH FACTORY — v15-EVO-IMMORTAL (WITH CORTEX + TENDONS APPLIED)
// ============================================================================
export function createBinaryMesh({
  symbolicMesh,
  trace = false,
  maxBitsLength = 64,
  defaultBand = "binary",
  defaultPresenceTag = "BinaryMesh-v15"
} = {}) {

  const links = Object.create(null);

  const logWarn = safeLog(globalThis?.warn, console?.warn);
  const logInfo = safeLog(globalThis?.log, console?.log);

  function link(from, to) {
    links[from] = to;
  }

  // -------------------------------------------------------------------------
  // SYMBOLIC FALLBACK (binary → symbolic) WITH CORTEX + TENDONS
  // -------------------------------------------------------------------------
  function fallback(reason, from, bits, {
    band = defaultBand,
    presenceTag = defaultPresenceTag
  } = {}) {

    if (!symbolicMesh) {
      throw new Error(`BinaryMesh fallback (${reason}) from:${from} but no symbolicMesh provided`);
    }

    if (trace) {
      logWarn(
        `[BinaryMesh v15] FALLBACK (${reason}) from:${from} band:${band} presence:${presenceTag}`,
        bits
      );
    }

    // IMMORTAL: wrap bits into a symbolic impulse
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

    // IMMORTAL: apply Cortex → Tendons before symbolic routing
    applyPulseCortex(impulse, {
      binaryMode: false,
      dualMode: false,
      symbolicMode: true
    });

    applyPulseMeshTendons(impulse);

    return symbolicMesh.transmit(from, impulse, {
      band: "symbolic",
      presenceTag: "PulseMesh-v15"
    });
  }

  // -------------------------------------------------------------------------
  // PURE BINARY TRANSMISSION
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

    return bits; // pure binary path
  }

  return Object.freeze({
    meta: BinaryMeshMeta,
    link,
    transmit,
    fallback
  });
}

// ============================================================================
// LOCAL BINARY SUBSYSTEMS — LIVE ON THIS PAGE (v15-IMMORTAL)
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
      log?.("[BinaryPresence v15] prewarm");
    }

    function pulse(from, bits, options) {
      // pure binary path; Cortex/Tendons are applied only on fallback in binaryMesh
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
      log?.("[BinaryPrime v15] prewarm");
    }

    function process(from, bits, options) {
      // extension point for prime binary logic — keep pure, metadata-only
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

  // organism exposes both meshes via its envs
  const symbolicMesh = organism.symbolicMeshEnv?.symbolicMesh || organism.symbolicMeshEnv;

  // IMMORTAL: binaryMesh created here, with Cortex/Tendons-aware fallback
  const binaryMesh = createBinaryMesh({
    symbolicMesh,
    trace,
    maxBitsLength,
    defaultBand,
    defaultPresenceTag
  });

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
