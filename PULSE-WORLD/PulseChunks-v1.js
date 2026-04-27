// ============================================================================
//  PulseChunks-v1.5-EVO
//  FRONTEND CHUNK MEMBRANE — 2026 Transport Layer
//  Chunking • Caching • Prewarm • Zero-Latency Surface
//  Prevents backend + long-term memory from EVER being chunked
// ============================================================================

console.log("[PulseChunks-v1.5-EVO] Membrane chunker loading...");

// ============================================================================
//  SAFETY FENCE — OUTLIER RULES
//  (This is the firewall. Nothing backend EVER crosses this line.)
// ============================================================================
function shouldSkipChunk(filePath, fileSize = 0) {
  if (!filePath) return true;

  // Never chunk backend long-term memory
  if (filePath.includes("PulseOSLongTermMemory.js")) {
    console.warn("[PulseChunks] BLOCKED: Long-term memory file");
    return true;
  }

  // Never chunk backend index.js (firebase-admin lives here)
  if (filePath.includes("index.js")) {
    console.warn("[PulseChunks] BLOCKED: Backend index.js");
    return true;
  }

  // Never chunk firebase-admin or server imports
  if (filePath.includes("firebase-admin")) {
    console.warn("[PulseChunks] BLOCKED: firebase-admin");
    return true;
  }

  // Only chunk frontend assets
  if (
    !filePath.startsWith("/public") &&
    !filePath.startsWith("/frontend") &&
    !filePath.startsWith("/assets")
  ) {
    console.warn("[PulseChunks] BLOCKED: Outside frontend scope");
    return true;
  }

  // Never chunk huge files (>1MB)
  if (fileSize > 1024 * 1024) {
    console.warn("[PulseChunks] BLOCKED: File too large");
    return true;
  }

  return false;
}

// ============================================================================
//  UNIVERSAL FRONTEND CACHE (Images, CSS, JS, JSON, Fonts)
// ============================================================================
const chunkCache = new Map();

// ============================================================================
//  UNIVERSAL CHUNK FETCHER
//  (This is the real 2026 engine. Everything visible flows through here.)
// ============================================================================
async function fetchChunk(url) {
  if (!url) return url;

  // Cached? Instant 0–1ms return.
  if (chunkCache.has(url)) {
    return chunkCache.get(url);
  }

  try {
    const res = await fetch(url);
    const contentType = res.headers.get("content-type") || "";

    // IMAGE → blob URL
    if (contentType.startsWith("image/")) {
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      chunkCache.set(url, blobUrl);
      return blobUrl;
    }

    // JSON → parsed object
    if (contentType.includes("application/json")) {
      const json = await res.json();
      chunkCache.set(url, json);
      return json;
    }

    // CSS / JS / TEXT → text
    const text = await res.text();
    chunkCache.set(url, text);
    return text;

  } catch (err) {
    console.error("[PulseChunks] Failed to fetch chunk:", url, err);
    return url; // fallback
  }
}

// ============================================================================
//  IMAGE-SPECIFIC CHUNKER (Used by Window Portal)
// ============================================================================
export async function getImage(url) {
  return await fetchChunk(url);
}

// ============================================================================
//  GENERIC CHUNKER ENTRY — SAFE WRAPPER
// ============================================================================
export async function PulseChunker(filePath, fileSize = 0) {
  if (shouldSkipChunk(filePath, fileSize)) {
    return null;
  }

  console.log("[PulseChunks] Chunking allowed:", filePath);

  const chunk = await fetchChunk(filePath);

  return {
    chunk,
    chunked: true,
    safe: true
  };
}

// ============================================================================
//  PREWARM ENGINE — Preload assets BEFORE the browser asks
// ============================================================================
export function prewarm(urls = []) {
  urls.forEach((url) => {
    if (!chunkCache.has(url)) {
      fetchChunk(url);
    }
  });
}

// ============================================================================
//  EXPOSE TO WINDOW (Membrane-safe)
// ============================================================================
window.PulseChunks = {
  getImage,
  fetchChunk,
  prewarm,
  PulseChunker
};

console.log("[PulseChunks-v1.5-EVO] Ready — membrane chunker active.");
