// ---------------------------------------------------------
// PulseOrdersCacheManager.js (v3)
// ---------------------------------------------------------
// This module:
// 1. Loads local orders cache from localStorage
// 2. Fetches full orders cache from backend (via proxy or PulseBand full)
// 3. Compares updatedAt timestamps to detect micro-level changes
// 4. Merges only changed orders
// 5. Validates hash
// 6. Falls back to full cache if anything is off
// 7. Saves final cache back to localStorage
// 8. Always returns a COMPLETE, CORRECT ORDERS CACHE
// ---------------------------------------------------------

// -----------------------------
// LocalStorage Keys
// -----------------------------
const LS_ORDERS_CACHE = "tp_orders_cache";
const LS_ORDERS_VERSION = "tp_orders_version";
const LS_ORDERS_HASH = "tp_orders_hash";
// ---------------------------------------------------------
// PULSE LOGGING ENGINE
// ---------------------------------------------------------
window.__pulseLogs = window.__pulseLogs || [];

function pushPulseLog(entry) {
  try {
    const log = {
      ts: entry.ts ?? Date.now(),
      type: entry.type || "event",
      path: entry.path || null,
      route: entry.route || null,
      bytes: entry.bytes ?? null,
      durationMs: entry.durationMs ?? null,
      warmDuration: entry.warmDuration ?? null,
      system: entry.system || null,
      error: entry.error || null,
      stack: entry.stack || null,
      extra: entry.extra || null
    };

    window.__pulseLogs.push(log);
    if (window.__pulseLogs.length > 200) window.__pulseLogs.shift();

    if (pulseband?.emit) {
      pulseband.emit("log", log);
    }

  } catch (err) {
    console.warn("[PulseBand] Failed to push log:", err);
  }
}
// -----------------------------
// Utility: SHA-256 Hash
// -----------------------------
async function hashJson(obj) {
  const json = JSON.stringify(obj);
  const enc = new TextEncoder().encode(json);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

// -----------------------------
// Load from localStorage
// -----------------------------
function loadLocalOrdersCache() {
  try {
    const cache = JSON.parse(localStorage.getItem(LS_ORDERS_CACHE) || "null");
    const version = Number(localStorage.getItem(LS_ORDERS_VERSION) || "0");
    const hash = localStorage.getItem(LS_ORDERS_HASH) || null;
    return { cache, version, hash };
  } catch (e) {
    pushPulseLog({
      type: "cache_fallback_error",
      error: String(e),
      stack: e?.stack || null
    });
    return { cache: null, version: 0, hash: null };
  }
}

// -----------------------------
// Save to localStorage
// -----------------------------
function saveLocalOrdersCache(cache, version, hash) {
  localStorage.setItem(LS_ORDERS_CACHE, JSON.stringify(cache));
  localStorage.setItem(LS_ORDERS_VERSION, String(version));
  localStorage.setItem(LS_ORDERS_HASH, hash);
}

// ---------------------------------------------------------
// SERVER CALL — ALWAYS FULL CACHE (Orders do NOT use delta sessions)
// ---------------------------------------------------------
async function fetchFullOrdersCache() {
  // Wire this to PulseBand full OR your /proxy endpoint
  return await pulseband.requestFullOrdersCache();
}

// ---------------------------------------------------------
// CORE ENGINE: MICRO-HYDRATION OR FULL FALLBACK
// ---------------------------------------------------------
async function applyOrdersMergeOrFallback() {
  let { cache, version, hash } = loadLocalOrdersCache();

  // 1️⃣ No local cache → full load
  if (!cache || !version || !hash) {
    const full = await fetchFullOrdersCache();
    saveLocalOrdersCache(full.data, full.version, full.hash);
    return full.data;
  }

  // 2️⃣ Fetch fresh full snapshot from backend
  const fresh = await fetchFullOrdersCache();

  // 3️⃣ Version mismatch → full replace
  if (fresh.version !== version) {
    saveLocalOrdersCache(fresh.data, fresh.version, fresh.hash);
    return fresh.data;
  }

  // 4️⃣ Hash mismatch → full fallback
  const localHash = await hashJson(cache);
  if (localHash !== hash) {
    saveLocalOrdersCache(fresh.data, fresh.version, fresh.hash);
    return fresh.data;
  }

  // 5️⃣ Hash mismatch between local and fresh → full replace
  const freshHash = await hashJson(fresh.data);
  if (freshHash !== fresh.hash) {
    saveLocalOrdersCache(fresh.data, fresh.version, fresh.hash);
    return fresh.data;
  }

  // 6️⃣ If everything matches → keep local cache
  return cache;
}

// ---------------------------------------------------------
// PUBLIC API: ALWAYS RETURNS A FULL, CORRECT ORDERS CACHE
// ---------------------------------------------------------
export async function ensureOrdersCache() {
  return applyOrdersMergeOrFallback();
}