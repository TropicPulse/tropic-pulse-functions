// ---------------------------------------------------------
// PulseHistoryCacheManager.js (v3)
// ---------------------------------------------------------
// This module:
// 1. Loads local PulseHistory cache from localStorage
// 2. Loads CACHE_CONTROL from backend
// 3. Compares CACHE_CONTROL.historyVersion to local version
// 4. Fetches full history cache if version mismatch
// 5. Validates hash
// 6. Micro‑hydrates using updatedAt or ts
// 7. Saves final cache back to localStorage
// 8. Always returns a COMPLETE, CORRECT HISTORY CACHE
// ---------------------------------------------------------

// -----------------------------
// LocalStorage Keys
// -----------------------------
const LS_HISTORY_CACHE   = "tp_history_cache";
const LS_HISTORY_VERSION = "tp_history_version";
const LS_HISTORY_HASH    = "tp_history_hash";
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
// Utility: SHA‑256 Hash
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
function loadLocalHistoryCache() {
  try {
    const cache   = JSON.parse(localStorage.getItem(LS_HISTORY_CACHE) || "null");
    const version = Number(localStorage.getItem(LS_HISTORY_VERSION) || "0");
    const hash    = localStorage.getItem(LS_HISTORY_HASH) || null;
    return { cache, version, hash };
  } catch (e) {
    pushPulseLog({
      ts: Date.now(),
      type: "cache_load_error",
      error: String(e),
      stack: e?.stack || null,
      path: "history/localStorage"
    });

    return { cache: null, version: 0, hash: null };
  }
}

// -----------------------------
// Save to localStorage
// -----------------------------
function saveLocalHistoryCache(cache, version, hash) {
  localStorage.setItem(LS_HISTORY_CACHE, JSON.stringify(cache));
  localStorage.setItem(LS_HISTORY_VERSION, String(version));
  localStorage.setItem(LS_HISTORY_HASH, hash);
}

// ---------------------------------------------------------
// SERVER CALLS
// ---------------------------------------------------------
async function fetchCacheControl() {
  return await window.pulseband.requestCacheControl();
}

async function fetchFullHistoryCache() {
  return await window.pulseband.requestFullHistoryCache();
}

// ---------------------------------------------------------
// CORE ENGINE
// ---------------------------------------------------------
async function applyHistoryMergeOrFallback() {

  // 1️⃣ Load CACHE_CONTROL first
  const cc = await fetchCacheControl();
  const serverVersion = cc.historyVersion;
  const serverHash    = cc.historyHash;

  // 2️⃣ Load local cache
  let { cache, version, hash } = loadLocalHistoryCache();

  // 3️⃣ No local cache → full load
  if (!cache || !version || !hash) {
    const full = await fetchFullHistoryCache();
    saveLocalHistoryCache(full.data, serverVersion, serverHash);
    return full.data;
  }

  // 4️⃣ Version mismatch → full replace
  if (version !== serverVersion) {
    const full = await fetchFullHistoryCache();
    saveLocalHistoryCache(full.data, serverVersion, serverHash);
    return full.data;
  }

  // 5️⃣ Validate local hash BEFORE fetching fresh
  const localHash = await hashJson(cache);
  if (localHash !== hash) {
    const full = await fetchFullHistoryCache();
    saveLocalHistoryCache(full.data, serverVersion, serverHash);
    return full.data;
  }

  // 6️⃣ Fetch fresh full snapshot
  const fresh = await fetchFullHistoryCache();

  // 7️⃣ Validate fresh snapshot hash
  const freshHash = await hashJson(fresh.data);
  if (freshHash !== serverHash) {
    saveLocalHistoryCache(fresh.data, serverVersion, serverHash);
    return fresh.data;
  }

  // 8️⃣ Micro‑hydration using updatedAt or ts
  try {
    const map = new Map(cache.map((h) => [h.id, h]));

    for (const freshEntry of fresh.data) {
      const oldEntry = map.get(freshEntry.id);

      if (!oldEntry) {
        map.set(freshEntry.id, freshEntry);
        continue;
      }

      const freshStamp = freshEntry.updatedAt || freshEntry.ts;
      const oldStamp   = oldEntry.updatedAt || oldEntry.ts;

      if (freshStamp > oldStamp) {
        map.set(freshEntry.id, freshEntry);
      }
    }

    const merged = Array.from(map.values());

    // 9️⃣ Validate merged hash
    const mergedHash = await hashJson(merged);
    if (mergedHash !== serverHash) {
      saveLocalHistoryCache(fresh.data, serverVersion, serverHash);
      return fresh.data;
    }

    // 🔟 Commit merged cache
    saveLocalHistoryCache(merged, serverVersion, mergedHash);
    return merged;

  } catch (err) {
    console.log(err);
    saveLocalHistoryCache(fresh.data, serverVersion, serverHash);
    return fresh.data;
  }
}

// ---------------------------------------------------------
// PUBLIC API
// ---------------------------------------------------------
export async function ensureHistoryCache() {
  return applyHistoryMergeOrFallback();
}