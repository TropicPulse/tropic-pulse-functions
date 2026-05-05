/*
===============================================================================
FILE: /PULSE-UI/PulseRouteMemory.js
LAYER: REFLEX MEMORY ORGAN
===============================================================================
===============================================================================
AI_EXPERIENCE_META = {
  identity: "PulseUI.RouteMemory",
  version: "v16-Immortal",
  layer: "pulse_ui",
  role: "reflex_route_memory",
  lineage: "SkinReflex.RouteMemory-v12 → v14-Immortal → v16-Immortal",

  evo: {
    reflexMemory: true,
    degradationAware: true,
    binaryShadowAware: true,
    routeTraceAware: true,
    coreMemoryAware: true,
    routeAware: true,
    lineageAware: true,
    unifiedAdvantageField: true,
    tierAware: true,
    channelAware: true,

    deterministic: true,
    driftProof: true,
    pureCompute: true,
    dualBand: true,
    binaryAware: true,
    symbolicAware: true,

    futureEvolutionReady: true,

    // v15+ / v16 IMMORTAL SURFACE
    schemaVersioned: true,
    envelopeAware: true,
    integrityAware: true,
    bulkFlushAware: true,
    offlineFirst: true,
    localStoreMirrored: true,
    replayAware: true
  },

  contract: {
    always: [
      "PulseUI.SkinReflex",
      "PulseCoreMemory",
      "PulseUIErrors",
      "PulseProofBridge"
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
    "DegradationTier",
    "RouteMemoryEnvelope"
  ],

  sideEffects: "core_memory_write_only",
  network: "none",
  filesystem: "none"
}
*/

// Global handle
const g =
  typeof globalThis !== "undefined"
    ? globalThis
    : typeof global !== "undefined"
    ? global
    : typeof window !== "undefined"
    ? window
    : typeof g !== "undefined"
    ? g
    : {};

// Prefer global db if present (logger page / server)
const db =
  (g && g.db) ||
  (typeof global !== "undefined" && global.db) ||
  (typeof globalThis !== "undefined" && globalThis.db) ||
  (typeof window !== "undefined" && window.db) ||
  null;

import PulseUIErrors from "./PulseUIErrors-v16.js";
import { PulseProofBridge } from "../_BACKEND/PulseProofBridge.js";

export const RouteMemoryRole = {
  type: "Organ",
  subsystem: "UI",
  layer: "RouteMemory",
  version: "16.0-Immortal",
  identity: "PulseRouteMemory",

  evo: {
    driftProof: true,
    deterministic: true,
    reflexMemory: true,
    degradationAware: true,
    binaryShadowAware: true,
    routeTraceAware: true,
    coreMemoryAware: true,
    routeAware: true,
    lineageAware: true,
    unifiedAdvantageField: true,
    tierAware: true,
    channelAware: true,
    futureEvolutionReady: true,

    dualBand: true,
    binaryAware: true,
    symbolicAware: true,

    // IMMORTAL OFFLINE SURFACE
    offlineFirst: true,
    localStoreMirrored: true,
    replayAware: true,

    // v16 IMMORTAL ENVELOPE
    schemaVersioned: true,
    envelopeAware: true,
    integrityAware: true,
    bulkFlushAware: true
  }
};

const ROUTE_MEMORY_SCHEMA_VERSION = "v3";

// ---------------------------------------------------------------------------
// ERROR NORMALIZATION
// ---------------------------------------------------------------------------
function safeNormalizeError(err, origin) {
  try {
    const packet = PulseUIErrors.normalizeError(err, origin);
    PulseUIErrors.broadcast(packet);
  } catch {}
}

// ---------------------------------------------------------------------------
// LOCALSTORAGE MIRROR
// ---------------------------------------------------------------------------
const ROUTE_MEMORY_LS_KEY = "PulseUI.RouteMemory.v16.buffer";
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

function appendRouteMemoryEntry(kind, key, envelopeSnapshot) {
  const record = {
    ts: Date.now(),
    kind,
    key,
    envelope: envelopeSnapshot
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

// ---------------------------------------------------------------------------
// FACTORY — v16 IMMORTAL REFLEX ROUTE MEMORY (CoreMemory via PulseProofBridge)
// ---------------------------------------------------------------------------
export function createPulseRouteMemory({
  bucketId = "skinreflex-route-memory",
  log = console.log,
  warn = console.warn
} = {}) {
  // CoreMemory is accessed exclusively through the bridge
  const Core = PulseProofBridge.coreMemory;

  const RouteMemoryState = {
    bucketId,
    lastKey: null,
    lastEntry: null,
    lastEnvelope: null,
    lastTier: null,
    lastChannel: "ui",
    lastError: null,
    eventSeq: 0
  };

  function nextSeq() {
    RouteMemoryState.eventSeq += 1;
    return RouteMemoryState.eventSeq;
  }

  function safeLog(stage, details = {}) {
    try {
      log(
        JSON.stringify({
          pulseLayer: "ROUTE-MEMORY",
          pulseName: "SkinReflex Route Memory",
          pulseRole: "Reflex degradation + trace memory",
          pulseVer: RouteMemoryRole.version,
          schemaVersion: ROUTE_MEMORY_SCHEMA_VERSION,
          seq: RouteMemoryState.eventSeq,
          bucketId,
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

  const DegradationTiers = Object.freeze({
    microDegrade: "microDegrade",
    softDegrade: "softDegrade",
    midDegrade: "midDegrade",
    hardDegrade: "hardDegrade",
    criticalDegrade: "criticalDegrade"
  });

  function classifyTier(healthScore) {
    try {
      const h = typeof healthScore === "number" ? healthScore : 1.0;

      if (h >= 0.95) return DegradationTiers.microDegrade;
      if (h >= 0.85) return DegradationTiers.softDegrade;
      if (h >= 0.50) return DegradationTiers.midDegrade;
      if (h >= 0.15) return DegradationTiers.hardDegrade;
      return DegradationTiers.criticalDegrade;
    } catch (err) {
      safeNormalizeError(err, "routememory.classifyTier");
      return DegradationTiers.microDegrade;
    }
  }

  function buildEnvelope(key, entry, channel = "ui") {
    return {
      schemaVersion: ROUTE_MEMORY_SCHEMA_VERSION,
      role: RouteMemoryRole.identity,
      version: RouteMemoryRole.version,
      bucketId,
      key,
      channel,
      tier: entry.tier,
      degraded: entry.degraded,
      healthScore: entry.healthScore,
      dnaTag: entry.dnaTag,
      entry,
      timestamp: "NO_TIMESTAMP_v16"
    };
  }

  function unwrapEnvelope(raw) {
    if (!raw) return { envelope: null, entry: null };
    if (raw && typeof raw === "object" && raw.schemaVersion) {
      return { envelope: raw, entry: raw.entry || null };
    }
    return {
      envelope: null,
      entry: raw
    };
  }

  function remember(message, frames, routeTrace, overrides = {}) {
    nextSeq();
    try {
      const key = makeKey(message, frames);
      const baseHealth = overrides.healthScore ?? 1.0;
      const tier = classifyTier(baseHealth);

      const entry = {
        seq: RouteMemoryState.eventSeq,
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

      const channel = overrides.channel || "ui";
      const envelope = buildEnvelope(key, entry, channel);

      RouteMemoryState.lastKey = key;
      RouteMemoryState.lastEntry = entry;
      RouteMemoryState.lastEnvelope = envelope;
      RouteMemoryState.lastTier = tier;
      RouteMemoryState.lastChannel = channel;

      try {
        const bucket = Core.getBucket(bucketId) || {};
        bucket[key] = envelope;
        Core.setBucket(bucketId, bucket);
      } catch (err) {
        RouteMemoryState.lastError = String(err);
        safeNormalizeError(err, "routememory.corePersist");
      }

      appendRouteMemoryEntry("remember", key, envelope);

      safeLog("ROUTE_MEMORY_SAVED", {
        key,
        frames: Array.isArray(frames) ? frames.length : 0,
        degraded: entry.degraded,
        healthScore: entry.healthScore,
        tier: entry.tier,
        dnaTag: entry.dnaTag,
        channel
      });
    } catch (err) {
      RouteMemoryState.lastError = String(err);
      safeNormalizeError(err, "routememory.remember");
    }
  }

  function markDegraded(
    message,
    frames,
    healthScore = 0.85,
    binaryAware = false,
    channel = "ui"
  ) {
    nextSeq();
    try {
      const key = makeKey(message, frames);

      let bucket = Core.getBucket(bucketId) || {};
      const raw = bucket[key];
      if (!raw) return;

      const { envelope: existingEnvelope, entry: existingEntry } = unwrapEnvelope(
        raw
      );
      if (!existingEntry) return;

      const entry = {
        ...existingEntry,
        degraded: true,
        healthScore,
        tier: classifyTier(healthScore),
        dnaTag: binaryAware
          ? "A1_BINARY_SHADOW_DEGRADED"
          : "A1_SURFACE_DEGRADED"
      };

      const envelope = buildEnvelope(key, entry, channel);

      bucket[key] = envelope;
      Core.setBucket(bucketId, bucket);

      RouteMemoryState.lastKey = key;
      RouteMemoryState.lastEntry = entry;
      RouteMemoryState.lastEnvelope = envelope;
      RouteMemoryState.lastTier = entry.tier;
      RouteMemoryState.lastChannel = channel;

      appendRouteMemoryEntry("markDegraded", key, envelope);

      safeLog("ROUTE_MEMORY_DEGRADED", {
        key,
        healthScore,
        tier: entry.tier,
        dnaTag: entry.dnaTag,
        channel
      });
    } catch (err) {
      RouteMemoryState.lastError = String(err);
      safeNormalizeError(err, "routememory.markDegraded");
    }
  }

  function recall(message, frames) {
    nextSeq();
    try {
      const key = makeKey(message, frames);
      const bucket = Core.getBucket(bucketId) || {};
      const raw = bucket[key];
      if (!raw) return null;

      const { envelope, entry } = unwrapEnvelope(raw);
      if (!entry) return null;

      RouteMemoryState.lastKey = key;
      RouteMemoryState.lastEntry = entry;
      RouteMemoryState.lastEnvelope = envelope || buildEnvelope(key, entry);
      RouteMemoryState.lastTier = entry.tier;
      RouteMemoryState.lastChannel =
        (envelope && envelope.channel) || RouteMemoryState.lastChannel || "ui";

      safeLog("ROUTE_MEMORY_HIT", {
        key,
        frames: Array.isArray(entry.frames) ? entry.frames.length : 0,
        degraded: entry.degraded,
        healthScore: entry.healthScore,
        tier: entry.tier,
        dnaTag: entry.dnaTag,
        channel: RouteMemoryState.lastChannel
      });

      appendRouteMemoryEntry("recall", key, RouteMemoryState.lastEnvelope);

      return entry.routeTrace;
    } catch (err) {
      RouteMemoryState.lastError = String(err);
      safeNormalizeError(err, "routememory.recall");
      return null;
    }
  }

  function getEntry(message, frames) {
    nextSeq();
    try {
      const key = makeKey(message, frames);
      const bucket = Core.getBucket(bucketId) || {};
      const raw = bucket[key];
      if (!raw) return null;

      const { envelope, entry } = unwrapEnvelope(raw);
      const out = {
        key,
        envelope: envelope || buildEnvelope(key, entry || {}),
        entry: entry || null
      };

      appendRouteMemoryEntry("getEntry", key, out.envelope);

      return out;
    } catch (err) {
      RouteMemoryState.lastError = String(err);
      safeNormalizeError(err, "routememory.getEntry");
      return null;
    }
  }

  function flushBucket() {
    nextSeq();
    try {
      Core.setBucket(bucketId, {});
      appendRouteMemoryEntry("flushBucket", bucketId, {
        schemaVersion: ROUTE_MEMORY_SCHEMA_VERSION,
        bucketId,
        cleared: true
      });
      safeLog("ROUTE_MEMORY_FLUSH_OK", { bucketId });
      return { ok: true };
    } catch (err) {
      RouteMemoryState.lastError = String(err);
      safeNormalizeError(err, "routememory.flushBucket");
      safeLog("ROUTE_MEMORY_FLUSH_ERROR", { bucketId, error: String(err) });
      return { ok: false, error: "FlushError" };
    }
  }

  const PulseRouteMemory = {
    RouteMemoryRole,
    RouteMemoryState,
    DegradationTiers,
    remember,
    markDegraded,
    recall,
    getEntry,
    flushBucket,
    core: Core,
    store: PulseRouteMemoryStore
  };

  safeLog("INIT", {
    bucketId,
    version: RouteMemoryRole.version
  });

  return PulseRouteMemory;
}

export default createPulseRouteMemory;

try {
  if (typeof window !== "undefined") {
    window.PulseRouteMemory = createPulseRouteMemory;
    window.PulseRouteMemoryStore = PulseRouteMemoryStore;
  }
  if (typeof globalThis !== "undefined") {
    globalThis.PulseRouteMemory = createPulseRouteMemory;
    globalThis.PulseRouteMemoryStore = PulseRouteMemoryStore;
  }
  if (typeof g !== "undefined") {
    g.PulseRouteMemory = createPulseRouteMemory;
    g.PulseRouteMemoryStore = PulseRouteMemoryStore;
  }
  if (typeof global !== "undefined") {
    global.PulseRouteMemory = createPulseRouteMemory;
    global.PulseRouteMemoryStore = PulseRouteMemoryStore;
  }
} catch {
  // never throw
}
