// ============================================================================
//  PulseBinaryOverlay.js — v15-IMMORTAL-BINARY-OVERLAY
//  ORGANISM‑WIDE BINARY MEMORY OVERLAY
//  “GRAB ONCE. CANONICALIZE ONCE. REUSE FOREVER. NEVER DRIFT.”
//  • v15 AI_EXPERIENCE_META (IMMORTAL identity)
//  • dnaTag + version aware
//  • presence / band aware (via Governor + overlay)
//  • hot‑loop integrated (spinHotKeys + rebuild)
//  • dual‑band aligned (dataType + band hints)
//  • lineage + ancestry via Governor/CoreMemory
//  • advantage scoring (route + dataType + band)
//  • governor + evolution aligned
//  • RAM as scratchpad, CoreMemory as truth
// ============================================================================

/*
AI_EXPERIENCE_META = {
  identity: "PulseBinaryCoreOverlay",
  version: "v15-IMMORTAL-BINARY-OVERLAY",
  layer: "corememory_binary",
  role: "binary_overlay_engine",
  lineage: "PulseCoreMemory-v15-IMMORTAL",

  evo: {
    binaryPrimary: true,
    symbolicAware: true,
    dualBand: true,

    overlayEngine: true,
    hydrationEngine: true,
    dehydrationEngine: true,

    deterministic: true,
    driftProof: true,
    pureCompute: true,

    zeroMutationOfInput: true,
    zeroNetwork: true,
    zeroFilesystem: true
  },

  contract: {
    always: [
      "PulseCoreBrain",
      "PulseCoreEvolution",
      "PulseCoreGovernor"
    ],
    never: [
      "safeRoute",
      "fetchViaCNS"
    ]
  }
};
*/

import { createPulseCoreGovernor } from "./PulseCoreGovernor.js";

export const BinaryOverlayRole = {
  type: "Organ",
  subsystem: "Core",
  layer: "BinaryOverlay",
  identity: "PulseBinaryOverlay",
  version: "15.0-IMMORTAL-BINARY-OVERLAY",

  evo: {
    binaryNative: true,
    memorySpineAligned: true,
    loopTheoryAware: true,
    routeAware: true,
    dnaAware: true,
    presenceAware: true,
    versionAware: true,
    dualBandSafe: true,
    lineageAware: true,
    advantageAware: true,
    ramOptional: true,
    overlayAware: true
  }
};

// ---------------------------------------------------------------------------
//  v15 IDENTITY BLOCK (MetaBlock)
// ---------------------------------------------------------------------------
export const BinaryOverlayMetaBlock = {
  identity: "PulseBinaryOverlay",
  subsystem: "Core",
  layer: "BinaryOverlay",
  role: "Binary-Memory-Membrane",
  version: "15.0-IMMORTAL-BINARY-OVERLAY",
  evo: BinaryOverlayRole.evo
};

// ---------------------------------------------------------------------------
//  SIMPLE BINARY KEY (STRUCTURAL HASH)
// ---------------------------------------------------------------------------
function toBinaryKey(blobOrStruct) {
  const json =
    typeof blobOrStruct === "string"
      ? blobOrStruct
      : JSON.stringify(blobOrStruct || {});
  let h = 0;
  for (let i = 0; i < json.length; i++) {
    h = (h * 31 + json.charCodeAt(i)) | 0;
  }
  return "bin-" + (h >>> 0).toString(16);
}

// deterministic overlay epoch (for touch / logs)
let OVERLAY_EPOCH = 0;
function nextOverlayEpoch() {
  OVERLAY_EPOCH += 1;
  return OVERLAY_EPOCH;
}

// ---------------------------------------------------------------------------
//  CREATE BINARY OVERLAY — v15-IMMORTAL
// ---------------------------------------------------------------------------
export function createPulseBinaryOverlay({
  dnaTag = "default-dna",
  version = "15.0-IMMORTAL-BINARY-OVERLAY",
  coreGovernor = null,
  log = console.log,
  warn = console.warn
} = {}) {

  const Governor =
    coreGovernor ||
    createPulseCoreGovernor({
      dnaTag,
      version,
      log,
      warn
    });

  const CoreMemory = Governor.CoreMemory;

  // RAM scratchpad
  const Scratch = {
    byKey: Object.create(null)
  };

  function safeLog(stage, details = {}) {
    try {
      log("[PulseBinaryOverlay-v15]", stage, JSON.stringify(details));
    } catch {
      // fail-open
    }
  }

  // -------------------------------------------------------------------------
  //  INTERNAL: ADVANTAGE SCORING (v15)
  //  • routeId (non-global)
//  • dataType (gpu/ai aware)
//  • band (binary vs symbolic)
//  • optional overlay hook
  // -------------------------------------------------------------------------
  function scoreEntry(routeId, dataType, band = "symbolic") {
    let score = 0;

    if (routeId !== "global") score += 1;
    if (dataType.includes("gpu")) score += 2;
    if (dataType.includes("ai")) score += 1;
    if (band === "binary") score += 1;

    if (Governor.overlay && typeof Governor.overlay.scoreBinaryEntry === "function") {
      try {
        const extra = Governor.overlay.scoreBinaryEntry({
          routeId,
          dataType,
          band,
          dnaTag,
          version
        });
        if (typeof extra === "number") score += extra;
      } catch (err) {
        warn("[PulseBinaryOverlay-v15] OVERLAY_SCORE_ERROR", String(err));
      }
    }

    return score;
  }

  // -------------------------------------------------------------------------
  //  CANONICALIZE (v15-IMMORTAL)
//  • RAM scratchpad first
//  • CoreMemory second
//  • New entry last
//  • presence / overlay touch via Governor
  // -------------------------------------------------------------------------
  function canonicalize(routeId, blobOrStruct, options = {}) {
    const route = routeId || "global";
    const binaryKey = toBinaryKey(blobOrStruct);
    const dataType = options.dataType || "generic";
    const band = options.band || "binary";

    const epoch = nextOverlayEpoch();

    // Presence‑touch via CoreMemory + Governor overlay
    try {
      CoreMemory.prewarm();
    } catch {}
    try {
      if (Governor.overlay?.touch) {
        Governor.overlay.touch(route, epoch, {
          band,
          dataType,
          binaryKey
        });
      }
    } catch {}

    // 1) RAM scratchpad
    const scratch = Scratch.byKey[binaryKey];
    if (scratch) {
      scratch.lastEpoch = epoch;
      Governor.set(route, binaryKey, scratch.value, { dataType, band });
      safeLog("CANONICALIZE_HIT_RAM", { route, binaryKey, dataType, band });
      return { binaryKey, value: scratch.value, reused: true };
    }

    // 2) CoreMemory
    const existing = Governor.get(route, binaryKey, { dataType, band });
    if (existing !== undefined) {
      Scratch.byKey[binaryKey] = {
        value: existing,
        routeId: route,
        lastEpoch: epoch,
        score: scoreEntry(route, dataType, band)
      };
      safeLog("CANONICALIZE_HIT_CORE", { route, binaryKey, dataType, band });
      return { binaryKey, value: existing, reused: true };
    }

    // 3) New entry
    Governor.set(route, binaryKey, blobOrStruct, { dataType, band });
    Scratch.byKey[binaryKey] = {
      value: blobOrStruct,
      routeId: route,
      lastEpoch: epoch,
      score: scoreEntry(route, dataType, band)
    };

    safeLog("CANONICALIZE_NEW", { route, binaryKey, dataType, band });
    return { binaryKey, value: blobOrStruct, reused: false };
  }

  // -------------------------------------------------------------------------
  //  INBOUND / OUTBOUND
  // -------------------------------------------------------------------------
  function interceptInbound(routeId, payload, options = {}) {
    return canonicalize(routeId, payload, {
      dataType: options.dataType || "inbound",
      band: options.band || "binary"
    });
  }

  function interceptOutbound(routeId, payload, options = {}) {
    return canonicalize(routeId, payload, {
      dataType: options.dataType || "outbound",
      band: options.band || "binary"
    });
  }

  // -------------------------------------------------------------------------
  //  RAM FLUSH / REBUILD
  // -------------------------------------------------------------------------
  function flushRam() {
    Scratch.byKey = Object.create(null);
    safeLog("FLUSH_RAM", {});
  }

  function rebuildWorkingSetFromCore(routeId = "global") {
    const snapshot = Governor.getRouteSnapshot(routeId) || {};
    const epoch = nextOverlayEpoch();

    // snapshot is route-level; CoreMemory implementation decides shape
    const keys = Object.keys(snapshot);
    for (const key of keys) {
      const value = snapshot[key];
      Scratch.byKey[key] = {
        value,
        routeId,
        lastEpoch: epoch,
        score: scoreEntry(routeId, "rebuild", "binary")
      };
    }

    safeLog("REBUILD_WORKING_SET", {
      routeId,
      keys: keys.length
    });
  }

  // -------------------------------------------------------------------------
  //  LOOP THEORY (v15)
//  • spin hot keys into RAM scratchpad
  // -------------------------------------------------------------------------
  function spinHotKeys(minHits = 3) {
    const hot = Governor.getHotKeys(minHits);
    const epoch = nextOverlayEpoch();

    for (const { id } of hot) {
      const [routeId, key] = id.split(":");
      const value = Governor.get(routeId, key, { dataType: "hot", band: "binary" });
      if (value !== undefined) {
        Scratch.byKey[key] = {
          value,
          routeId,
          lastEpoch: epoch,
          score: scoreEntry(routeId, "hot", "binary")
        };
      }
    }

    safeLog("SPIN_HOT_KEYS", { count: hot.length });
  }

  // -------------------------------------------------------------------------
  //  PUBLIC API
  // -------------------------------------------------------------------------
  const PulseBinaryOverlay = {
    BinaryOverlayRole,
    BinaryOverlayMetaBlock,
    Governor,
    CoreMemory,

    canonicalize,
    interceptInbound,
    interceptOutbound,

    flushRam,
    rebuildWorkingSetFromCore,

    spinHotKeys,

    dnaTag,
    version
  };

  safeLog("INIT", {
    identity: BinaryOverlayRole.identity,
    version: BinaryOverlayRole.version,
    dnaTag
  });

  return PulseBinaryOverlay;
}
