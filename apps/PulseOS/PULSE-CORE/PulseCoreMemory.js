// ============================================================================
//  PulseCoreMemory.js — v11‑EVO‑DUALBAND‑MAX
//  ORGANISM‑WIDE BINARY MEMORY SPINE (DUAL‑BAND + FALLBACK + LOOP THEORY)
//  “LOAD RARELY, SERVE CONSTANTLY, FLUSH INTENTIONALLY, HEAL WHILE SPINNING”
// ============================================================================

export const CoreMemoryRole = {
  type: "Organ",
  subsystem: "Core",
  layer: "MemorySpine",
  version: "11.4-Evo-DualBand-Max",
  identity: "PulseCoreMemory",

  evo: {
    binaryNative: true,      // Binary‑first representation
    bulkLoad: true,          // Load once, serve many
    bulkFlush: true,         // Flush intentionally, not constantly
    cacheFirst: true,        // Prefer in‑process cache
    routeAware: true,        // Route‑scoped buckets
    dnaAware: true,          // Future: dnaTag‑aware segments
    lowHostChurn: true,      // Minimize host storage writes

    dualBand: true,          // PRIMARY + SECONDARY storage bands
    fallbackable: true,      // If primary fails, use secondary
    loopTheory: true         // Keep hot data “spinning” for speed
  }
};

// ---------------------------------------------------------------------------
//  SIMPLE BINARY HELPERS
//  (You can later swap to GPU / native binary engine.)
// ---------------------------------------------------------------------------
function encodeToBinary(obj) {
  const json = JSON.stringify(obj || {});
  const bits = [];
  for (let i = 0; i < json.length; i++) {
    const code = json.charCodeAt(i);
    for (let b = 7; b >= 0; b--) bits.push((code >> b) & 1);
  }
  return bits;
}

function decodeFromBinary(bits) {
  if (!Array.isArray(bits) || bits.length % 8 !== 0) return null;
  let json = "";
  for (let i = 0; i < bits.length; i += 8) {
    let code = 0;
    for (let b = 0; b < 8; b++) code = (code << 1) | (bits[i + b] & 1);
    json += String.fromCharCode(code);
  }
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
//  STORAGE KEYS + BANDS
//  • PRIMARY: fast, preferred (e.g., localStorage)
//  • SECONDARY: fallback (e.g., sessionStorage / alt backend / shim)
// ---------------------------------------------------------------------------
const CORE_KEY_PRIMARY = "pulse-core-memory-v11-primary";
const CORE_KEY_SECONDARY = "pulse-core-memory-v11-secondary";
const META_KEY_PRIMARY = "pulse-core-memory-meta-primary";
const META_KEY_SECONDARY = "pulse-core-memory-meta-secondary";

export function createPulseCoreMemory({
  primaryStorage = window.localStorage,
  secondaryStorage = window.sessionStorage,
  log = console.log,
  warn = console.warn
} = {}) {
  const Cache = {
    loaded: false,
    lastLoadEpoch: 0,
    data: Object.create(null), // { routeId: { ... }, global: { ... } }

    // LOOP THEORY: hot keys that should stay “spinning” in process
    hotLoop: Object.create(null) // { routeId:key -> hitCount }
  };

  const Meta = {
    lastFlushEpoch: 0,
    lastLoadEpoch: 0,
    version: CoreMemoryRole.version,
    lastBandUsed: "primary", // "primary" | "secondary"
    fallbackUsed: false
  };

  function safeLog(stage, details = {}) {
    try {
      log("[PulseCoreMemory]", stage, JSON.stringify(details));
    } catch {}
  }

  // -------------------------------------------------------------------------
  //  INTERNAL: BAND HELPERS
  // -------------------------------------------------------------------------
  function readBand(storage, coreKey, metaKey) {
    try {
      const raw = storage.getItem(coreKey);
      const metaRaw = storage.getItem(metaKey);
      const meta = metaRaw ? JSON.parse(metaRaw) : null;
      if (!raw) return { ok: true, data: null, meta };
      const bits = JSON.parse(raw);
      const decoded = decodeFromBinary(bits) || {};
      return { ok: true, data: decoded, meta };
    } catch (err) {
      warn("[PulseCoreMemory] READ_BAND_ERROR", String(err));
      return { ok: false, data: null, meta: null };
    }
  }

  function writeBand(storage, coreKey, metaKey, data, meta) {
    try {
      const bits = encodeToBinary(data);
      storage.setItem(coreKey, JSON.stringify(bits));
      storage.setItem(metaKey, JSON.stringify(meta));
      return true;
    } catch (err) {
      warn("[PulseCoreMemory] WRITE_BAND_ERROR", String(err));
      return false;
    }
  }

  // -------------------------------------------------------------------------
  //  BULK LOAD / PREWARM (DUALBAND + FALLBACK)
  // -------------------------------------------------------------------------
  function shouldReloadNow() {
    const now = Date.now();
    const ONE_DAY = 24 * 60 * 60 * 1000;
    return !Cache.loaded || now - Cache.lastLoadEpoch > ONE_DAY;
  }

  function bulkLoad() {
    // 1) Try PRIMARY band
    const primary = readBand(primaryStorage, CORE_KEY_PRIMARY, META_KEY_PRIMARY);

    if (primary.ok && primary.data) {
      Cache.data = primary.data;
      Cache.loaded = true;
      Cache.lastLoadEpoch = Date.now();
      Meta.lastLoadEpoch = Cache.lastLoadEpoch;
      Meta.lastBandUsed = "primary";
      Meta.fallbackUsed = false;

      if (primary.meta) Object.assign(Meta, primary.meta);

      safeLog("BULK_LOAD_PRIMARY_OK", {
        routes: Object.keys(Cache.data || {}).length
      });
      return;
    }

    // 2) Fallback to SECONDARY band
    const secondary = readBand(
      secondaryStorage,
      CORE_KEY_SECONDARY,
      META_KEY_SECONDARY
    );

    if (secondary.ok && secondary.data) {
      Cache.data = secondary.data;
      Cache.loaded = true;
      Cache.lastLoadEpoch = Date.now();
      Meta.lastLoadEpoch = Cache.lastLoadEpoch;
      Meta.lastBandUsed = "secondary";
      Meta.fallbackUsed = true;

      if (secondary.meta) Object.assign(Meta, secondary.meta);

      safeLog("BULK_LOAD_SECONDARY_OK", {
        routes: Object.keys(Cache.data || {}).length
      });
      return;
    }

    // 3) Nothing found — start clean
    Cache.loaded = true;
    Cache.lastLoadEpoch = Date.now();
    Meta.lastLoadEpoch = Cache.lastLoadEpoch;
    Meta.lastBandUsed = "primary";
    Meta.fallbackUsed = false;

    safeLog("BULK_LOAD_EMPTY");
  }

  function prewarm() {
    if (shouldReloadNow()) bulkLoad();
  }

  // -------------------------------------------------------------------------
  //  BULK FLUSH (DUALBAND MIRROR + HEALING)
  //  • PRIMARY is authoritative when available
  //  • SECONDARY is a safety mirror
  // -------------------------------------------------------------------------
  function bulkFlush() {
    try {
      Meta.lastFlushEpoch = Date.now();

      const primaryOk = writeBand(
        primaryStorage,
        CORE_KEY_PRIMARY,
        META_KEY_PRIMARY,
        Cache.data,
        Meta
      );

      const secondaryOk = writeBand(
        secondaryStorage,
        CORE_KEY_SECONDARY,
        META_KEY_SECONDARY,
        Cache.data,
        Meta
      );

      Meta.lastBandUsed = primaryOk ? "primary" : secondaryOk ? "secondary" : Meta.lastBandUsed;
      Meta.fallbackUsed = !primaryOk && secondaryOk;

      safeLog("BULK_FLUSH_OK", {
        routes: Object.keys(Cache.data || {}).length,
        primaryOk,
        secondaryOk
      });
    } catch (err) {
      warn("[PulseCoreMemory] BULK_FLUSH_ERROR", String(err));
    }
  }

  // -------------------------------------------------------------------------
  //  ROUTE‑AWARE ACCESSORS + LOOP THEORY
  //  • ensureRoute: guarantees bucket
  //  • hotLoop: tracks hot keys to keep them “spinning” in process
  // -------------------------------------------------------------------------
  function ensureRoute(routeId = "global") {
    if (!Cache.data[routeId]) Cache.data[routeId] = {};
    return Cache.data[routeId];
  }

  function markHot(routeId, key) {
    const id = `${routeId}:${key}`;
    const current = Cache.hotLoop[id] || 0;
    const next = current + 1;
    Cache.hotLoop[id] = next;

    // LOOP THEORY:
    // If something is hit often enough, we treat it as “spin‑locked” in memory.
    // You can later plug this into GPU / binary engine / pre‑hydration.
    // For now, we just track it.
    return next;
  }

  function get(routeId, key) {
    prewarm();
    const bucket = ensureRoute(routeId);
    const value = bucket[key];

    if (value !== undefined) {
      markHot(routeId, key);
    }

    return value;
  }

  function set(routeId, key, value) {
    prewarm();
    const bucket = ensureRoute(routeId);
    bucket[key] = value;
    markHot(routeId, key);
    // NOTE: we do NOT flush immediately — intentional.
  }

  function getRouteSnapshot(routeId) {
    prewarm();
    return { ...(Cache.data[routeId] || {}) };
  }

  function setRouteSnapshot(routeId, snapshot) {
    prewarm();
    Cache.data[routeId] = { ...(snapshot || {}) };
  }

  function clearRoute(routeId) {
    prewarm();
    delete Cache.data[routeId];
  }

  function clearAll() {
    Cache.data = Object.create(null);
    Cache.hotLoop = Object.create(null);
    bulkFlush();
  }

  // -------------------------------------------------------------------------
  //  LOOP THEORY UTILITIES
  //  • getHotKeys: see what’s spinning
  //  • coolDown: optional manual cooling
  // -------------------------------------------------------------------------
  function getHotKeys(minHits = 3) {
    const result = [];
    for (const id in Cache.hotLoop) {
      if (Cache.hotLoop[id] >= minHits) result.push({ id, hits: Cache.hotLoop[id] });
    }
    return result;
  }

  function coolDown(routeId, key) {
    const id = `${routeId}:${key}`;
    delete Cache.hotLoop[id];
  }

  // -------------------------------------------------------------------------
  //  PUBLIC API
  // -------------------------------------------------------------------------
  const PulseCoreMemory = {
    CoreMemoryRole,
    Meta,
    Cache,

    prewarm,
    bulkLoad,
    bulkFlush,

    get,
    set,
    getRouteSnapshot,
    setRouteSnapshot,
    clearRoute,
    clearAll,

    // Loop theory helpers
    getHotKeys,
    coolDown
  };

  safeLog("INIT", {
    identity: CoreMemoryRole.identity,
    version: CoreMemoryRole.version,
    dualBand: CoreMemoryRole.evo.dualBand
  });

  return PulseCoreMemory;
}
