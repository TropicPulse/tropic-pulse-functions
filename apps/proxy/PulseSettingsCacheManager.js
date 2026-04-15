// ---------------------------------------------------------
// PulseSettingsCacheManager.js (v3)
// ---------------------------------------------------------
// This module:
// 1. Loads local Settings cache from localStorage
// 2. Fetches full Settings snapshot from backend (via proxy or PulseBand full)
// 3. Compares updatedAt timestamps to detect micro-level changes
// 4. Merges only changed fields
// 5. Validates hash
// 6. Falls back to full cache if anything is off
// 7. Saves final cache back to localStorage
// 8. Always returns a COMPLETE, CORRECT SETTINGS OBJECT
// ---------------------------------------------------------

// -----------------------------
// LocalStorage Keys
// -----------------------------
const LS_SETTINGS_CACHE = "tp_settings_cache";
const LS_SETTINGS_VERSION = "tp_settings_version";
const LS_SETTINGS_HASH = "tp_settings_hash";
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
function loadLocalSettingsCache() {
  try {
    const cache = JSON.parse(localStorage.getItem(LS_SETTINGS_CACHE) || "null");
    const version = Number(localStorage.getItem(LS_SETTINGS_VERSION) || "0");
    const hash = localStorage.getItem(LS_SETTINGS_HASH) || null;
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
function saveLocalSettingsCache(cache, version, hash) {
  localStorage.setItem(LS_SETTINGS_CACHE, JSON.stringify(cache));
  localStorage.setItem(LS_SETTINGS_VERSION, String(version));
  localStorage.setItem(LS_SETTINGS_HASH, hash);
}

// ---------------------------------------------------------
// SERVER CALL — ALWAYS FULL CACHE (Settings do NOT use delta sessions)
// ---------------------------------------------------------
async function fetchFullSettingsCache() {
  // Wire this to PulseBand full OR your /proxy endpoint
  return await window.pulseband.requestFullSettingsCache();
}

// ---------------------------------------------------------
// CORE ENGINE: MICRO-HYDRATION OR FULL FALLBACK
// ---------------------------------------------------------
async function applySettingsMergeOrFallback() {
  let { cache, version, hash } = loadLocalSettingsCache();

  // 1️⃣ No local cache → full load
  if (!cache || !version || !hash) {
    const full = await fetchFullSettingsCache();
    saveLocalSettingsCache(full.data, full.version, full.hash);
    return full.data;
  }

  // 2️⃣ Fetch fresh full snapshot from backend
  const fresh = await fetchFullSettingsCache();

  // 3️⃣ Version mismatch → full replace
  if (fresh.version !== version) {
    saveLocalSettingsCache(fresh.data, fresh.version, fresh.hash);
    return fresh.data;
  }

  // 4️⃣ Hash mismatch → full fallback
  const localHash = await hashJson(cache);
  if (localHash !== hash) {
    saveLocalSettingsCache(fresh.data, fresh.version, fresh.hash);
    return fresh.data;
  }

  // 5️⃣ Micro-hydration using updatedAt
  try {
    const merged = { ...cache };

    // If updatedAt changed → replace entire settings object
    if (fresh.data.updatedAt > cache.updatedAt) {
      Object.assign(merged, fresh.data);
    }

    // 6️⃣ Validate merged hash
    const mergedHash = await hashJson(merged);
    if (mergedHash !== fresh.hash) {
      saveLocalSettingsCache(fresh.data, fresh.version, fresh.hash);
      return fresh.data;
    }

    // 7️⃣ Commit merged cache
    saveLocalSettingsCache(merged, fresh.version, mergedHash);
    return merged;

  } catch (err) {
    pushPulseLog({
      type: "cache_fallback_error",
      error: String(err),
      stack: err?.stack || null
    });
    saveLocalSettingsCache(fresh.data, fresh.version, fresh.hash);
    return fresh.data;
  }
}

// ---------------------------------------------------------
// PUBLIC API: ALWAYS RETURNS A FULL, CORRECT SETTINGS OBJECT
// ---------------------------------------------------------
export async function ensureSettingsCache() {
  return applySettingsMergeOrFallback();
}