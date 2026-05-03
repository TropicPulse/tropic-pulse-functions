/*
===============================================================================
FILE: /PULSE-UI/PulseRouteMemory.js
LAYER: REFLEX MEMORY ORGAN
===============================================================================
===============================================================================
AI_EXPERIENCE_META = {
  identity: "PulseUI.RouteMemory",
  version: "v14-IMMORTAL",
  layer: "pulse_ui",
  role: "reflex_route_memory",
  lineage: "SkinReflex.RouteMemory-v12 → v14-IMMORTAL",

  evo: {
    reflexMemory: true,
    degradationAware: true,
    binaryShadowAware: true,
    routeTraceAware: true,
    coreMemoryAware: true,

    deterministic: true,
    driftProof: true,
    pureCompute: true,

    futureEvolutionReady: true
  },

  contract: {
    always: [
      "PulseUI.SkinReflex",
      "PulseCoreMemory",
      "PulseUIErrors"
    ],
    never: [
      "eval",
      "Function",
      "dynamicImport",
      "fetchViaCNS"
    ]
  }
}
===============================================================================
EXPORT_META = {
  organ: "PulseUI.RouteMemory",
  layer: "pulse_ui",
  stability: "IMMORTAL",
  deterministic: true,
  pure: true,

  consumes: [
    "Message",
    "Frames",
    "RouteTrace",
    "Overrides"
  ],

  produces: [
    "RouteMemoryEntry",
    "RouteTrace",
    "DegradationTier"
  ],

  sideEffects: "core_memory_write_only",
  network: "none",
  filesystem: "none"
}

*/

import PulseUIErrors from "./PulseUIErrors-v12-Evo.js";
import { PulseProofBridge } from "./PulseProofBridge.js";


export const RouteMemoryRole = {
  type: "Organ",
  subsystem: "UI",
  layer: "RouteMemory",
  version: "14.0-IMMORTAL",
  identity: "PulseRouteMemory",

  evo: {
    driftProof: true,
    deterministic: true,
    reflexMemory: true,
    degradationAware: true,
    binaryShadowAware: true,
    routeTraceAware: true,
    coreMemoryAware: true,
    futureEvolutionReady: true,

    // IMMORTAL OFFLINE SURFACE
    offlineFirst: true,
    localStoreMirrored: true,
    replayAware: true
  }
};

function safeNormalizeError(err, origin) {
  try {
    PulseUIErrors.broadcast(PulseUIErrors.normalizeError(err, origin));
  } catch {}
}

// ============================================================================
// LOCAL OFFLINE MEMORY SURFACE — ROUTE MEMORY STORE (LocalStorage)
// ============================================================================

const ROUTE_MEMORY_LS_KEY = "PulseUI.RouteMemory.v14.buffer";
const ROUTE_MEMORY_LS_MAX_ENTRIES = 2000;

function hasLocalStorage() {
  try {
    if (typeof window === "undefined" || !window.localStorage) return false;
    const testKey = "__pulse_route_memory_test__";
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

function loadRouteMemoryBuffer() {
  if (!hasLocalStorage()) return [];
  try {
    const raw = window.localStorage.getItem(ROUTE_MEMORY_LS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveRouteMemoryBuffer(buffer) {
  if (!hasLocalStorage()) return;
  try {
    const trimmed =
      buffer.length > ROUTE_MEMORY_LS_MAX_ENTRIES
        ? buffer.slice(buffer.length - ROUTE_MEMORY_LS_MAX_ENTRIES)
        : buffer;
    window.localStorage.setItem(ROUTE_MEMORY_LS_KEY, JSON.stringify(trimmed));
  } catch {
    // never throw
  }
}

function appendRouteMemoryEntry(kind, key, entrySnapshot) {
  const record = {
    ts: Date.now(),
    kind,
    key,
    entry: entrySnapshot
  };

  const buffer = loadRouteMemoryBuffer();
  buffer.push(record);
  saveRouteMemoryBuffer(buffer);
}

export const PulseRouteMemoryStore = {
  getAll() {
    return loadRouteMemoryBuffer();
  },
  clear() {
    saveRouteMemoryBuffer([]);
  },
  tail(n = 200) {
    const buf = loadRouteMemoryBuffer();
    if (n <= 0) return [];
    return buf.slice(Math.max(0, buf.length - n));
  }
};

// ============================================================================
// FACTORY — creates the RouteMemory organ
// ============================================================================
export function createPulseRouteMemory({
  bucketId = "skinreflex-route-memory",
  log = console.log,
  warn = console.warn
} = {}) {

  const Core = PulseProofBridge.coreMemory;

  let seq = 0;

  const RouteMemoryState = {
    bucketId,
    lastKey: null,
    lastEntry: null
  };

  function logProtector(stage, details = {}) {
    try {
      log(
        JSON.stringify({
          pulseLayer: "ROUTE-MEMORY",
          pulseName: "SkinReflex Route Memory",
          pulseRole: "Reflex degradation + trace memory",
          pulseVer: RouteMemoryRole.version,
          stage,
          ...details
        })
      );
    } catch {}
  }

  function makeKey(message, frames) {
    try {
      const top = (frames && frames[0]) || "NO_FRAME";
      return message + "::" + top;
    } catch (err) {
      safeNormalizeError(err, "routememory.makeKey");
      return message + "::NO_FRAME";
    }
  }

  function classifyTier(healthScore) {
    try {
      const h = typeof healthScore === "number" ? healthScore : 1.0;

      if (h >= 0.95) return "microDegrade";
      if (h >= 0.85) return "softDegrade";
      if (h >= 0.50) return "midDegrade";
      if (h >= 0.15) return "hardDegrade";
      return "criticalDegrade";
    } catch (err) {
      safeNormalizeError(err, "routememory.classifyTier");
      return "microDegrade";
    }
  }

  function remember(message, frames, routeTrace, overrides = {}) {
    try {
      const key = makeKey(message, frames);
      const baseHealth = overrides.healthScore ?? 1.0;
      const tier = classifyTier(baseHealth);

      const entry = {
        seq: ++seq,
        message,
        frames,
        routeTrace,
        degraded: !!overrides.degraded,
        healthScore: baseHealth,
        tier,
        dnaTag: overrides.binaryAware
          ? "A1_BINARY_SHADOW"
          : "A1_SURFACE",
        ...overrides
      };

      RouteMemoryState.lastKey = key;
      RouteMemoryState.lastEntry = entry;

      // Persist into CoreMemory bucket
      try {
        const bucket = Core.getBucket(bucketId) || {};
        bucket[key] = entry;
        Core.setBucket(bucketId, bucket);
      } catch (err) {
        safeNormalizeError(err, "routememory.corePersist");
      }

      // Mirror into LocalStorage route memory store
      appendRouteMemoryEntry("remember", key, entry);

      logProtector("ROUTE_MEMORY_SAVED", {
        key,
        frames: frames.length,
        degraded: entry.degraded,
        healthScore: entry.healthScore,
        tier: entry.tier,
        dnaTag: entry.dnaTag
      });
    } catch (err) {
      safeNormalizeError(err, "routememory.remember");
    }
  }

  function markDegraded(message, frames, healthScore = 0.85, binaryAware = false) {
    try {
      const key = makeKey(message, frames);

      let bucket = Core.getBucket(bucketId) || {};
      const entry = bucket[key];
      if (!entry) return;

      entry.degraded = true;
      entry.healthScore = healthScore;
      entry.tier = classifyTier(healthScore);
      entry.dnaTag = binaryAware
        ? "A1_BINARY_SHADOW_DEGRADED"
        : "A1_SURFACE_DEGRADED";

      bucket[key] = entry;
      Core.setBucket(bucketId, bucket);

      RouteMemoryState.lastKey = key;
      RouteMemoryState.lastEntry = entry;

      // Mirror into LocalStorage route memory store
      appendRouteMemoryEntry("markDegraded", key, entry);

      logProtector("ROUTE_MEMORY_DEGRADED", {
        key,
        healthScore,
        tier: entry.tier,
        dnaTag: entry.dnaTag
      });
    } catch (err) {
      safeNormalizeError(err, "routememory.markDegraded");
    }
  }

  function recall(message, frames) {
    try {
      const key = makeKey(message, frames);
      const bucket = Core.getBucket(bucketId) || {};
      const entry = bucket[key];
      if (!entry) return null;

      RouteMemoryState.lastKey = key;
      RouteMemoryState.lastEntry = entry;

      logProtector("ROUTE_MEMORY_HIT", {
        key,
        frames: entry.frames.length,
        degraded: entry.degraded,
        healthScore: entry.healthScore,
        tier: entry.tier,
        dnaTag: entry.dnaTag
      });

      // Optional mirror of recall hits (lightweight)
      appendRouteMemoryEntry("recall", key, {
        seq: entry.seq,
        degraded: entry.degraded,
        healthScore: entry.healthScore,
        tier: entry.tier,
        dnaTag: entry.dnaTag
      });

      return entry.routeTrace;
    } catch (err) {
      safeNormalizeError(err, "routememory.recall");
      return null;
    }
  }

  function getEntry(message, frames) {
    try {
      const key = makeKey(message, frames);
      const bucket = Core.getBucket(bucketId) || {};
      return bucket[key] || null;
    } catch (err) {
      safeNormalizeError(err, "routememory.getEntry");
      return null;
    }
  }

  const PulseRouteMemory = {
    RouteMemoryRole,
    RouteMemoryState,
    remember,
    markDegraded,
    recall,
    getEntry,
    core: Core,
    store: PulseRouteMemoryStore
  };

  logProtector("INIT", {
    bucketId,
    version: RouteMemoryRole.version
  });

  return PulseRouteMemory;
}



export default createPulseRouteMemory;

// ============================================================================
// GLOBAL BINDING FOR ROUTE MEMORY STORE (MODE-AGNOSTIC UI HOOK)
// ============================================================================

try {
  if (typeof window !== "undefined") {
    window.PulseRouteMemoryStore = PulseRouteMemoryStore;
  }
  if (typeof globalThis !== "undefined") {
    globalThis.PulseRouteMemoryStore = PulseRouteMemoryStore;
  }
} catch {
  // never throw
}
