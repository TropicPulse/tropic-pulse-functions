// ---------------------------------------------------------
// PulseBusCacheManager.js (v3)
// ---------------------------------------------------------
// This module:
// 1. Loads local business cache from localStorage
// 2. Loads CACHE_CONTROL from backend
// 3. Compares CACHE_CONTROL.businessVersion to local version
// 4. Fetches full business cache if version mismatch
// 5. Validates hash
// 6. Micro‑hydrates using updatedAt
// 7. Saves final cache back to localStorage
// 8. Always returns a COMPLETE, CORRECT BUSINESS CACHE
// ---------------------------------------------------------

// -----------------------------
// LocalStorage Keys
// -----------------------------
const LS_BUS_CACHE   = "tp_business_cache";
const LS_BUS_VERSION = "tp_business_version";
const LS_BUS_HASH    = "tp_business_hash";

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

    if (window.pulseband?.emit) {
      window.pulseband.emit("log", log);
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
function loadLocalBusCache() {
  try {
    const cache   = JSON.parse(localStorage.getItem(LS_BUS_CACHE) || "null");
    const version = Number(localStorage.getItem(LS_BUS_VERSION) || "0");
    const hash    = localStorage.getItem(LS_BUS_HASH) || null;
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
function saveLocalBusCache(cache, version, hash) {
  localStorage.setItem(LS_BUS_CACHE, JSON.stringify(cache));
  localStorage.setItem(LS_BUS_VERSION, String(version));
  localStorage.setItem(LS_BUS_HASH, hash);
}

// ---------------------------------------------------------
// SERVER CALLS
// ---------------------------------------------------------
async function fetchCacheControl() {
  return await window.pulseband.requestCacheControl();
}

async function fetchFullBusinessCache() {
  return await window.pulseband.requestFullBusinessCache();
}

// ---------------------------------------------------------
// CORE ENGINE
// ---------------------------------------------------------
async function applyBusinessMergeOrFallback() {

  // 1️⃣ Load CACHE_CONTROL first
  const cc = await fetchCacheControl();
  const serverVersion = cc.businessVersion;
  const serverHash    = cc.businessHash;

  // 2️⃣ Load local cache
  let { cache, version, hash } = loadLocalBusCache();

  // 3️⃣ No local cache → full load
  if (!cache || !version || !hash) {
    const full = await fetchFullBusinessCache();
    saveLocalBusCache(full.data, serverVersion, serverHash);
    return full.data;
  }

  // 4️⃣ Version mismatch → full replace
  if (version !== serverVersion) {
    const full = await fetchFullBusinessCache();
    saveLocalBusCache(full.data, serverVersion, serverHash);
    return full.data;
  }

  // 5️⃣ Validate local hash BEFORE fetching fresh
  const localHash = await hashJson(cache);
  if (localHash !== hash) {
    const full = await fetchFullBusinessCache();
    saveLocalBusCache(full.data, serverVersion, serverHash);
    return full.data;
  }

  // 6️⃣ Fetch fresh full snapshot
  const fresh = await fetchFullBusinessCache();

  // 7️⃣ Validate fresh snapshot hash
  const freshHash = await hashJson(fresh.data);
  if (freshHash !== serverHash) {
    saveLocalBusCache(fresh.data, serverVersion, serverHash);
    return fresh.data;
  }

  // 8️⃣ Micro‑hydration using updatedAt
  try {
    const map = new Map(cache.map((b) => [b.id, b]));

    for (const freshBiz of fresh.data) {
      const oldBiz = map.get(freshBiz.id);

      if (!oldBiz) {
        map.set(freshBiz.id, freshBiz);
        continue;
      }

      if (freshBiz.updatedAt > oldBiz.updatedAt) {
        map.set(freshBiz.id, freshBiz);
      }
    }

    const merged = Array.from(map.values());

    // 9️⃣ Validate merged hash
    const mergedHash = await hashJson(merged);
    if (mergedHash !== serverHash) {
      saveLocalBusCache(fresh.data, serverVersion, serverHash);
      return fresh.data;
    }

    // 🔟 Commit merged cache
    saveLocalBusCache(merged, serverVersion, mergedHash);
    return merged;

  } catch (err) {
    console.log(err);
    saveLocalBusCache(fresh.data, serverVersion, serverHash);
    return fresh.data;
  }
}

// ---------------------------------------------------------
// PUBLIC API
// ---------------------------------------------------------
export async function ensureBusinessCache() {
  return applyBusinessMergeOrFallback();
}