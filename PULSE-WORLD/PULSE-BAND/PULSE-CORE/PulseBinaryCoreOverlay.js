// ============================================================================
//  PulseBinaryOverlay.js — v12‑EVO‑PRESENCE‑MAX
//  ORGANISM‑WIDE BINARY MEMORY OVERLAY
//  “GRAB ONCE. CANONICALIZE ONCE. REUSE FOREVER. NEVER DRIFT.”
//  • MetaBlock (v12 identity)
//  • dnaTag + version aware
//  • presence aware
//  • hot‑loop integrated
//  • dual‑band aligned
//  • lineage + ancestry
//  • advantage scoring
//  • governor + evolution aligned
//  • RAM as scratchpad, CoreMemory as truth
// ============================================================================
import { createPulseCoreGovernor } from "./PulseCoreGovernor.js";

export const BinaryOverlayRole = {
  type: "Organ",
  subsystem: "Core",
  layer: "BinaryOverlay",
  identity: "PulseBinaryOverlay",
  version: "12.0-Evo-Presence",

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
    ramOptional: true
  }
};

// ---------------------------------------------------------------------------
//  v12 IDENTITY BLOCK (MetaBlock)
// ---------------------------------------------------------------------------
export const BinaryOverlayMetaBlock = {
  identity: "PulseBinaryOverlay",
  subsystem: "Core",
  layer: "BinaryOverlay",
  role: "Binary-Memory-Membrane",
  version: "12.0-Evo-Presence",
  evo: BinaryOverlayRole.evo
};

// ---------------------------------------------------------------------------
//  SIMPLE BINARY KEY (STRUCTURAL HASH)
// ---------------------------------------------------------------------------
function toBinaryKey(blobOrStruct) {
  const json = typeof blobOrStruct === "string"
    ? blobOrStruct
    : JSON.stringify(blobOrStruct || {});
  let h = 0;
  for (let i = 0; i < json.length; i++) {
    h = (h * 31 + json.charCodeAt(i)) | 0;
  }
  return "bin-" + (h >>> 0).toString(16);
}

// ---------------------------------------------------------------------------
//  CREATE BINARY OVERLAY (v12)
// ---------------------------------------------------------------------------
export function createPulseBinaryOverlay({
  dnaTag = "default-dna",
  version = "12.0-Evo-Presence",
  coreGovernor = null,
  log = console.log,
  warn = console.warn
} = {}) {

  const Governor = coreGovernor || createPulseCoreGovernor({ dnaTag, version, log, warn });
  const CoreMemory = Governor.CoreMemory;

  // RAM scratchpad
  const Scratch = {
    byKey: Object.create(null)
  };

  function safeLog(stage, details = {}) {
    try { log("[PulseBinaryOverlay]", stage, JSON.stringify(details)); }
    catch {}
  }

  // -------------------------------------------------------------------------
  //  INTERNAL: ADVANTAGE SCORING (v12)
  // -------------------------------------------------------------------------
  function scoreEntry(routeId, dataType) {
    let score = 0;
    if (routeId !== "global") score += 1;
    if (dataType.includes("gpu")) score += 2;
    if (dataType.includes("ai")) score += 1;
    return score;
  }

  // -------------------------------------------------------------------------
  //  CANONICALIZE (v12)
// -------------------------------------------------------------------------
  function canonicalize(routeId, blobOrStruct, options = {}) {
    const route = routeId || "global";
    const binaryKey = toBinaryKey(blobOrStruct);
    const dataType = options.dataType || "generic";
    const now = Date.now();

    // Presence‑touch
    try { Governor.CoreMemory.prewarm(); } catch {}
    try { if (Governor.overlay?.touch) Governor.overlay.touch(route, now); } catch {}

    // 1) RAM scratchpad
    const scratch = Scratch.byKey[binaryKey];
    if (scratch) {
      scratch.lastAccess = now;
      Governor.set(route, binaryKey, scratch.value, { dataType });
      safeLog("CANONICALIZE_HIT_RAM", { route, binaryKey, dataType });
      return { binaryKey, value: scratch.value, reused: true };
    }

    // 2) CoreMemory
    const existing = Governor.get(route, binaryKey, { dataType });
    if (existing !== undefined) {
      Scratch.byKey[binaryKey] = {
        value: existing,
        routeId: route,
        lastAccess: now,
        score: scoreEntry(route, dataType)
      };
      safeLog("CANONICALIZE_HIT_CORE", { route, binaryKey, dataType });
      return { binaryKey, value: existing, reused: true };
    }

    // 3) New entry
    Governor.set(route, binaryKey, blobOrStruct, { dataType });
    Scratch.byKey[binaryKey] = {
      value: blobOrStruct,
      routeId: route,
      lastAccess: now,
      score: scoreEntry(route, dataType)
    };

    safeLog("CANONICALIZE_NEW", { route, binaryKey, dataType });
    return { binaryKey, value: blobOrStruct, reused: false };
  }

  // -------------------------------------------------------------------------
  //  INBOUND / OUTBOUND
  // -------------------------------------------------------------------------
  function interceptInbound(routeId, payload, options = {}) {
    return canonicalize(routeId, payload, {
      dataType: options.dataType || "inbound"
    });
  }

  function interceptOutbound(routeId, payload, options = {}) {
    return canonicalize(routeId, payload, {
      dataType: options.dataType || "outbound"
    });
  }

  // -------------------------------------------------------------------------
  //  RAM FLUSH / REBUILD
  // -------------------------------------------------------------------------
  function flushRam() {
    Scratch.byKey = Object.create(null);
    safeLog("FLUSH_RAM");
  }

  function rebuildWorkingSetFromCore(routeId = "global") {
    const snapshot = Governor.getRouteSnapshot(routeId) || {};
    const now = Date.now();

    for (const key of Object.keys(snapshot)) {
      Scratch.byKey[key] = {
        value: snapshot[key],
        routeId,
        lastAccess: now,
        score: scoreEntry(routeId, "rebuild")
      };
    }

    safeLog("REBUILD_WORKING_SET", {
      routeId,
      keys: Object.keys(snapshot).length
    });
  }

  // -------------------------------------------------------------------------
  //  LOOP THEORY (v12)
// -------------------------------------------------------------------------
  function spinHotKeys(minHits = 3) {
    const hot = Governor.getHotKeys(minHits);
    const now = Date.now();

    for (const { id } of hot) {
      const [routeId, key] = id.split(":");
      const value = Governor.get(routeId, key, { dataType: "hot" });
      if (value !== undefined) {
        Scratch.byKey[key] = {
          value,
          routeId,
          lastAccess: now,
          score: scoreEntry(routeId, "hot")
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
    version: BinaryOverlayRole.version
  });

  return PulseBinaryOverlay;
}
