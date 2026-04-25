// ============================================================================
//  PulseBinaryOverlay.js — v11‑EVO‑BINARY‑MEMBRANE
//  ORGANISM‑WIDE BINARY MEMORY OVERLAY (BETWEEN RAM AND SPINES)
//  “GRAB ONCE. CANONICALIZE ONCE. REUSE FOREVER. RAM IS A SCRATCHPAD.”
// ============================================================================

import { createPulseCoreGovernor } from "./PulseCoreGovernor.js";
// (Optionally) import Brain directly if you want tighter coupling
// import { createPulseCoreBrain } from "./PulseCoreBrain.js";

export const BinaryOverlayRole = {
  type: "Organ",
  subsystem: "Core",
  layer: "BinaryOverlay",
  version: "11.4-Evo-Binary-Membrane",
  identity: "PulseBinaryOverlay",

  evo: {
    binaryNative: true,        // Operates on binary identity, not text
    memorySpineAligned: true,  // Uses CoreGovernor/CoreMemory/CoreLayers
    loopTheoryAware: true,     // Knows about hot keys / spin sets
    routeAware: true,          // Can scope by route
    dnaAware: true,            // Future: dnaTag-based overlays
    proxyAligned: true,        // Designed to sit under Proxy/Router/Send/Mesh
    ramOptional: true          // Treats RAM as scratchpad, not dependency
  }
};

// ============================================================================
//  SIMPLE BINARY HELPERS (PLACEHOLDERS)
//  You can swap these for GPU / native binary engines later.
// ============================================================================

function toBinaryKey(blobOrStruct) {
  // Very simple identity helper: normalize then hash-ish.
  const json = typeof blobOrStruct === "string"
    ? blobOrStruct
    : JSON.stringify(blobOrStruct || {});
  let h = 0;
  for (let i = 0; i < json.length; i++) {
    h = (h * 31 + json.charCodeAt(i)) | 0;
  }
  return "bin-" + (h >>> 0).toString(16);
}

// ============================================================================
//  CREATE BINARY OVERLAY
//  • Sits logically between RAM and the Spines
//  • Uses CoreGovernor as its brain/spine
//  • Does NOT own truth — it owns lifecycle + reuse
// ============================================================================

export function createPulseBinaryOverlay({
  log = console.log,
  warn = console.warn,
  // Optionally inject an existing governor; otherwise we create one.
  coreGovernor = null
} = {}) {
  const Governor = coreGovernor || createPulseCoreGovernor({ log, warn });
  const CoreMemory = Governor.CoreMemory;

  // In‑process scratchpad (RAM‑only, disposable)
  const Scratch = {
    // binaryKey -> { value, routeId, lastAccess }
    byKey: Object.create(null)
  };

  function safeLog(stage, details = {}) {
    try { log("[PulseBinaryOverlay]", stage, JSON.stringify(details)); }
    catch {}
  }

  // ---------------------------------------------------------------------------
  //  CORE IDEA:
  //    • Any spine can hand us a blob/struct
  //    • We:
  //        1) derive a binaryKey
  //        2) check if we’ve seen it
  //        3) if new → store canonical in CoreMemory
  //        4) keep a RAM scratch entry for hot reuse
  // ---------------------------------------------------------------------------

  function canonicalize(routeId, blobOrStruct, options = {}) {
    const route = routeId || "global";
    const binaryKey = toBinaryKey(blobOrStruct);
    const dataType = options.dataType || "generic";

    // 1) Check RAM scratchpad
    const scratchEntry = Scratch.byKey[binaryKey];
    if (scratchEntry) {
      scratchEntry.lastAccess = Date.now();
      Governor.set(route, binaryKey, scratchEntry.value, { dataType }); // refresh CoreMemory if needed
      safeLog("CANONICALIZE_HIT_RAM", { route, binaryKey, dataType });
      return { binaryKey, value: scratchEntry.value, reused: true };
    }

    // 2) Check CoreMemory
    const existing = Governor.get(route, binaryKey, { dataType });
    if (existing !== undefined) {
      Scratch.byKey[binaryKey] = {
        value: existing,
        routeId: route,
        lastAccess: Date.now()
      };
      safeLog("CANONICALIZE_HIT_CORE", { route, binaryKey, dataType });
      return { binaryKey, value: existing, reused: true };
    }

    // 3) New: store in CoreMemory + scratch
    Governor.set(route, binaryKey, blobOrStruct, { dataType });
    Scratch.byKey[binaryKey] = {
      value: blobOrStruct,
      routeId: route,
      lastAccess: Date.now()
    };

    safeLog("CANONICALIZE_NEW", { route, binaryKey, dataType });
    return { binaryKey, value: blobOrStruct, reused: false };
  }

  // ---------------------------------------------------------------------------
  //  INBOUND / OUTBOUND HOOKS FOR SPINES
  //  • Spines call these instead of touching CoreMemory directly
  // ---------------------------------------------------------------------------

  function interceptInbound(routeId, payload, options = {}) {
    // Example: Proxy/Router inbound data
    return canonicalize(routeId, payload, {
      dataType: options.dataType || "inbound"
    });
  }

  function interceptOutbound(routeId, payload, options = {}) {
    // Example: Send/Mesh outbound data
    return canonicalize(routeId, payload, {
      dataType: options.dataType || "outbound"
    });
  }

  // ---------------------------------------------------------------------------
  //  RAM FLUSH / REBUILD
  //  • Flush scratchpad (RAM)
//  • CoreMemory remains authoritative
  // ---------------------------------------------------------------------------

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
        lastAccess: now
      };
    }

    safeLog("REBUILD_WORKING_SET", {
      routeId,
      keys: Object.keys(snapshot).length
    });
  }

  // ---------------------------------------------------------------------------
  //  LOOP THEORY HOOKS
  //  • Use Governor.getHotKeys to see what should spin in RAM/GPU
  // ---------------------------------------------------------------------------

  function spinHotKeys(minHits = 3) {
    const hot = Governor.getHotKeys(minHits);
    const now = Date.now();

    for (const { id } of hot) {
      // id is routeId:key
      const [routeId, key] = id.split(":");
      const value = Governor.get(routeId, key, { dataType: "hot" });
      if (value !== undefined) {
        Scratch.byKey[key] = {
          value,
          routeId,
          lastAccess: now
        };
      }
    }

    safeLog("SPIN_HOT_KEYS", { count: hot.length });
  }

  // ---------------------------------------------------------------------------
  //  PUBLIC API
  // ---------------------------------------------------------------------------

  const PulseBinaryOverlay = {
    BinaryOverlayRole,
    Governor,
    CoreMemory,

    // Core canonicalization
    canonicalize,

    // Spine hooks
    interceptInbound,
    interceptOutbound,

    // RAM lifecycle
    flushRam,
    rebuildWorkingSetFromCore,

    // Loop theory
    spinHotKeys
  };

  safeLog("INIT", {
    identity: BinaryOverlayRole.identity,
    version: BinaryOverlayRole.version
  });

  return PulseBinaryOverlay;
}
