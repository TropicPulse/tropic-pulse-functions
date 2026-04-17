// ---------------------------------------------------------
// PulseEventCacheManager.js (v3)
// ---------------------------------------------------------
// This module:
// 1. Loads local event cache from localStorage
// 2. Loads CACHE_CONTROL from backend
// 3. Compares CACHE_CONTROL.eventVersion to local version
// 4. Fetches full event cache if version mismatch
// 5. Validates hash
// 6. Micro‑hydrates using updatedAt
// 7. Saves final cache back to localStorage
// 8. Always returns a COMPLETE, CORRECT EVENTS CACHE
// ---------------------------------------------------------

// -----------------------------
// LocalStorage Keys
// -----------------------------
const LS_EVENT_CACHE   = "tp_event_cache";
const LS_EVENT_VERSION = "tp_event_version";
const LS_EVENT_HASH    = "tp_event_hash";
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
function loadLocalEventCache() {
  try {
    const cache   = JSON.parse(localStorage.getItem(LS_EVENT_CACHE) || "null");
    const version = Number(localStorage.getItem(LS_EVENT_VERSION) || "0");
    const hash    = localStorage.getItem(LS_EVENT_HASH) || null;
    return { cache, version, hash };
  } catch (e) {

    pushPulseLog({
      ts: Date.now(),
      type: "event_cache_load_error",
      error: String(e),
      stack: e?.stack || null,
      path: "events/localStorage"
    });

    return { cache: null, version: 0, hash: null };
  }
}

// -----------------------------
// Save to localStorage
// -----------------------------
function saveLocalEventCache(cache, version, hash) {
  localStorage.setItem(LS_EVENT_CACHE, JSON.stringify(cache));
  localStorage.setItem(LS_EVENT_VERSION, String(version));
  localStorage.setItem(LS_EVENT_HASH, hash);
}

// ---------------------------------------------------------
// SERVER CALLS
// ---------------------------------------------------------
async function fetchCacheControl() {
  return await pulseband.requestCacheControl();
}

async function fetchFullEventCache() {
  return await pulseband.requestFullEventCache();
}

// ---------------------------------------------------------
// CORE ENGINE
// ---------------------------------------------------------
async function applyEventMergeOrFallback() {

  // 1️⃣ Load CACHE_CONTROL first
  const cc = await fetchCacheControl();
  const serverVersion = cc.eventVersion;
  const serverHash    = cc.eventHash;

  // 2️⃣ Load local cache
  let { cache, version, hash } = loadLocalEventCache();

  // 3️⃣ No local cache → full load
  if (!cache || !version || !hash) {
    const full = await fetchFullEventCache();
    saveLocalEventCache(full.data, serverVersion, serverHash);
    return full.data;
  }

  // 4️⃣ Version mismatch → full replace
  if (version !== serverVersion) {
    const full = await fetchFullEventCache();
    saveLocalEventCache(full.data, serverVersion, serverHash);
    return full.data;
  }

  // 5️⃣ Validate local hash BEFORE fetching fresh
  const localHash = await hashJson(cache);
  if (localHash !== hash) {
    const full = await fetchFullEventCache();
    saveLocalEventCache(full.data, serverVersion, serverHash);
    return full.data;
  }

  // 6️⃣ Fetch fresh full snapshot
  const fresh = await fetchFullEventCache();

  // 7️⃣ Validate fresh snapshot hash
  const freshHash = await hashJson(fresh.data);
  if (freshHash !== serverHash) {
    saveLocalEventCache(fresh.data, serverVersion, serverHash);
    return fresh.data;
  }

  // 8️⃣ Micro‑hydration using updatedAt
  try {
    const map = new Map(cache.map((ev) => [ev.id, ev]));

    for (const freshEvent of fresh.data) {
      const oldEvent = map.get(freshEvent.id);

      if (!oldEvent) {
        map.set(freshEvent.id, freshEvent);
        continue;
      }

      if (freshEvent.updatedAt > oldEvent.updatedAt) {
        map.set(freshEvent.id, freshEvent);
      }
    }

    const merged = Array.from(map.values());

    // 9️⃣ Validate merged hash
    const mergedHash = await hashJson(merged);
    if (mergedHash !== serverHash) {
      saveLocalEventCache(fresh.data, serverVersion, serverHash);
      return fresh.data;
    }

    // 🔟 Commit merged cache
    saveLocalEventCache(merged, serverVersion, mergedHash);
    return merged;

  } catch (err) {
    console.log(err);
    saveLocalEventCache(fresh.data, serverVersion, serverHash);
    return fresh.data;
  }
}

// ---------------------------------------------------------
// PUBLIC API
// ---------------------------------------------------------
export async function ensureEventCache() {
  return applyEventMergeOrFallback();
}