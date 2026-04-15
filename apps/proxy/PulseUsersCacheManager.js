// ---------------------------------------------------------
// PulseUsersCacheManager.js (v3)
// ---------------------------------------------------------
// This module:
// 1. Loads local cache from localStorage
// 2. Requests delta from PulseBand
// 3. Validates delta (version + hash)
// 4. Applies delta safely
// 5. Falls back to full cache if ANYTHING is off
// 6. Saves final cache back to localStorage
// 7. Always returns a COMPLETE, CORRECT USERS CACHE
// ---------------------------------------------------------

// -----------------------------
// LocalStorage Keys
// -----------------------------
const LS_USERS_CACHE = "tp_users_cache";
const LS_USERS_VERSION = "tp_users_version";
const LS_USERS_HASH = "tp_users_hash";
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
function loadLocalCache() {
  try {
    const cache = JSON.parse(localStorage.getItem(LS_USERS_CACHE) || "null");
    const version = Number(localStorage.getItem(LS_USERS_VERSION) || "0");
    const hash = localStorage.getItem(LS_USERS_HASH) || null;
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
function saveLocalCache(cache, version, hash) {
  localStorage.setItem(LS_USERS_CACHE, JSON.stringify(cache));
  localStorage.setItem(LS_USERS_VERSION, String(version));
  localStorage.setItem(LS_USERS_HASH, hash);
}

// ---------------------------------------------------------
// SERVER CALLS (NOW WIRED TO PULSEBAND)
// ---------------------------------------------------------

// ⭐ FULL CACHE (fallback or initial load)
async function fetchFullUsersCache() {
  return await window.pulseband.requestFullUsersCache();
}

// ⭐ DELTA CACHE (v3 optimization)
async function fetchUsersDelta(baseVersion) {
  return await window.pulseband.requestUsersCacheDelta(baseVersion);
}

// ---------------------------------------------------------
// CORE ENGINE: APPLY DELTA OR FALL BACK TO FULL
// ---------------------------------------------------------
async function applyDeltaOrFallback() {
  let { cache, version, hash } = loadLocalCache();

  // 1️⃣ No local cache → full load
  if (!cache || !version || !hash) {
    const full = await fetchFullUsersCache();
    saveLocalCache(full.data, full.version, full.hash);
    return full.data;
  }

  // 2️⃣ Request delta from backend
  const delta = await fetchUsersDelta(version);

  // Backend may return full instead of delta
  if (delta.type === "full") {
    saveLocalCache(delta.data, delta.version, delta.hash);
    return delta.data;
  }

  // 3️⃣ Version mismatch → full fallback
  if (delta.baseVersion !== version) {
    const full = await fetchFullUsersCache();
    saveLocalCache(full.data, full.version, full.hash);
    return full.data;
  }

  // 4️⃣ Validate hashBefore
  const localHash = await hashJson(cache);
  if (localHash !== delta.hashBefore) {
    const full = await fetchFullUsersCache();
    saveLocalCache(full.data, full.version, full.hash);
    return full.data;
  }

  // 5️⃣ Apply delta safely
  try {
    const map = new Map(cache.map((u) => [u.id, u]));

    // Remove users
    for (const id of delta.removedUserIds) {
      map.delete(id);
    }

    // Apply changed users
    for (const changed of delta.changedUsers) {
      const existing = map.get(changed.id) || {};
      map.set(changed.id, { ...existing, ...changed });
    }

    // Add new users
    for (const added of delta.addedUsers || []) {
      map.set(added.id, added);
    }

    const newCache = Array.from(map.values());

    // 6️⃣ Validate hashAfter
    const newHash = await hashJson(newCache);
    if (newHash !== delta.hashAfter) {
      const full = await fetchFullUsersCache();
      saveLocalCache(full.data, full.version, full.hash);
      return full.data;
    }

    // 7️⃣ Commit delta
    saveLocalCache(newCache, delta.newVersion, newHash);
    return newCache;

  } catch (err) {
    pushPulseLog({
      type: "cache_fallback_error",
      error: String(err),
      stack: err?.stack || null
    });

    const full = await fetchFullUsersCache();
    saveLocalCache(full.data, full.version, full.hash);
    return full.data;
  }
}

// ---------------------------------------------------------
// PUBLIC API: ALWAYS RETURNS A FULL, CORRECT CACHE
// ---------------------------------------------------------
export async function ensureUsersCache() {
  return applyDeltaOrFallback();
}