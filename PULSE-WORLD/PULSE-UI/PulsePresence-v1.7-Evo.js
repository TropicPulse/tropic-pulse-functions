// ============================================================================
//  PulseChunks-v1.8-EVO-FALLBACK
//  FRONTEND CHUNK MEMBRANE — 2026 Transport Layer
//  Chunking • Caching • Prewarm • Zero-Latency Surface
//  Lore injection • PulseBand integration • Sectional fallback
//  + Universal de-chunking via PulseChunkNormalizer
// ============================================================================
console.log("Presence");
console.log("[PulseChunks-v1.8-EVO-FALLBACK] Membrane chunker loading...");

import { safeRoute as route } from "./PulseProofBridge.js";
import { normalizeChunkValue, normalizeImage } from "./PulsePresenceNormalizer.js";

// ============================================================================
//  LORE TRANSLATOR — Evolvable, deterministic, metadata-driven
// ============================================================================

// Deterministic selector (no randomness, no timers)
function stableIndexFromString(str, max) {
  let sum = 0;
  for (let i = 0; i < str.length; i++) sum += str.charCodeAt(i);
  return sum % max;
}

function generateLoreHeader({ meta, context, pulseRole, route }) {
  if (!meta || !context || !pulseRole) return "";

  const evoFlags = Object.keys(meta.evo || {}).filter(k => meta.evo[k]);
  const neverRules = meta.contract?.never || [];
  const alwaysRules = meta.contract?.always || [];

  const openings = [
    `The ${meta.role.replace(/_/g, " ").toLowerCase()} stirs beneath the surface.`,
    `A quiet hum rises from the ${meta.layer.toLowerCase()} artery.`,
    `The organ awakens, shaping the unseen pathways.`,
    `A pulse of logic ripples through the ${meta.layer.toLowerCase()} membrane.`,
    `The ${meta.identity} shifts, aligning with the organism’s intent.`
  ];

  const middles = [
    `Wrapped in the ${meta.layer}, it bridges worlds the traveler cannot see.`,
    `Its presence binds symbolic and structural layers into coherence.`,
    `It listens to the organism’s pressure and adjusts its flow.`,
    `It maintains the ancient contract without hesitation.`,
    `Its architecture remains sealed, but its story leaks through.`
  ];

  const closings = [
    `The organism reveals only its story, never its mechanisms.`,
    `Only the narrative escapes; the architecture stays hidden.`,
    `Its lore evolves, but its structure remains immutable.`,
    `The system speaks in myth, not in code.`,
    `Its voice shifts with each route, yet stays deterministic.`
  ];

  const open = openings[stableIndexFromString(meta.identity, openings.length)];
  const mid = middles[stableIndexFromString(context.lineage, middles.length)];
  const close = closings[stableIndexFromString(pulseRole.identity, closings.length)];

  return `
/*
  ────────────────────────────────────────────────────────────────
  LORE FRAGMENT — ROUTE: ${route}
  ORGAN: ${meta.identity}
  LAYER: ${meta.layer}
  ROLE: ${meta.role}
  VERSION: ${meta.version}
  LINEAGE: ${context.lineage}
  ────────────────────────────────────────────────────────────────

  ${open}
  ${mid}

  Evolution Traits:
    • ${evoFlags.join("\n    • ")}

  Boundaries:
    ✘ NEVER:
      ${neverRules.map(r => "• " + r).join("\n      ")}

    ✔ ALWAYS:
      ${alwaysRules.map(r => "• " + r).join("\n      ")}

  PulseRole Archetype — ${pulseRole.identity}
    Type: ${pulseRole.type}
    Subsystem: ${pulseRole.subsystem}
    Layer: ${pulseRole.layer}
    Version: ${pulseRole.version}

  Purpose:
    ${pulseRole.contract.purpose}

  Tone: ${pulseRole.voice.tone}
  Style: ${pulseRole.voice.style}

  ${close}
  ────────────────────────────────────────────────────────────────
*/
`;
}

// ============================================================================
//  SAFETY FENCE — OUTLIER RULES
// ============================================================================
function shouldSkipChunk(filePath = "", fileSize = 0) {
  if (!filePath) return true;

  // 1. Never chunk firebase-admin (backend-only)
  if (filePath.includes("firebase-admin")) return true;
  if (filePath.includes("env")) return true;
  if (filePath.includes("package")) return true;
  if (filePath.includes("PulseCORS")) return true;
  if (filePath.includes("PulseOSLongTermMemory")) return true;
  if (filePath.includes("index.html")) return true;

  // 2. Never chunk the chunker itself (prevents recursion)
  if (filePath.includes("PulseChunker") ||
      filePath.includes("Brainstem") ||
      filePath.includes("Organs") ||
      filePath.includes("PulsePresence")) {
    return true;
  }

  // 3. Never chunk extremely large files
  if (fileSize > 1024 * 1024 * 5) return true; // 5MB safety cap

  // 4. Everything else is allowed
  return false;
}

// ============================================================================
//  CHUNKS STATE — SECTIONAL FALLBACK
// ============================================================================
const chunkCache = new Map();
const chunkFailures = new Map();
let chunksDegraded = false;
const MAX_FAILURES_PER_URL = 3;
const MAX_GLOBAL_FAILURES = 20;
let globalFailures = 0;

function markChunkFailure(url, err) {
  globalFailures++;
  const prev = chunkFailures.get(url) || 0;
  const next = prev + 1;
  chunkFailures.set(url, next);

  console.warn("[PulseChunks] Chunk failure:", { url, count: next, err });

  if (next >= MAX_FAILURES_PER_URL || globalFailures >= MAX_GLOBAL_FAILURES) {
    if (!chunksDegraded) {
      chunksDegraded = true;
      console.warn("[PulseChunks] Entering DEGRADED mode — falling back to regular loading.");
    }
  }
}

function resetChunksState() {
  chunksDegraded = false;
  globalFailures = 0;
  chunkFailures.clear();
  console.log("[PulseChunks] Chunks state reset — re-enabling advantages.");
}

function isChunksDegraded() {
  return chunksDegraded === true;
}

// ============================================================================
//  PRESENCE / BAND ENVELOPE HELPERS — v12.5‑EVO‑PRESENCE
// ============================================================================
function buildChunkPresenceEnvelope({ url, fromCache, degraded, kind }) {
  const presence =
    degraded ? "degraded-fallback" :
    fromCache ? "cache-hit" :
    "fresh";

  const wave =
    degraded ? "distorted" :
    fromCache ? "stable" :
    "coherent";

  const band = "symbolic";    // chunker lives in symbolic band
  const dualBand = false;     // can be flipped when binary overlays join

  return {
    url,
    presence,
    wave,
    band,
    dualBand,
    kind
  };
}

// ============================================================================
//  UNIVERSAL CHUNK FETCHER — v12.5‑EVO‑PRESENCE + ROUTED
//  1) Route via CNS → endpoint → InnerAgent → PulseProxy
//  2) On error → mark failure, fall back to original URL
//  Returns: { ok, value, envelope, error? }
// ============================================================================
async function fetchChunk(url) {
  // ⭐ MAKE DNA VISIBLE IN NETWORK — FRONTEND LOGGING ENDPOINT
  try {
    await route("proxy.dnaVisibility", {
      url,
      timestamp: Date.now(),
      degraded: chunksDegraded,
      presence: "frontend-dna-request",
      membrane: "PulseChunks-v1.8"
    });
  } catch (err) {
    console.warn("[PulseDNA] Network visibility logging failed:", err);
  }

  if (!url) {
    return {
      ok: false,
      value: url,
      envelope: buildChunkPresenceEnvelope({
        url,
        fromCache: false,
        degraded: chunksDegraded,
        kind: "none"
      })
    };
  }

  // If CHUNKS is degraded, fall back immediately to regular behavior.
  if (chunksDegraded) {
    return {
      ok: false,
      value: url,
      envelope: buildChunkPresenceEnvelope({
        url,
        fromCache: false,
        degraded: true,
        kind: "fallback"
      })
    };
  }

  // Cache hit
  if (chunkCache.has(url)) {
    const cached = chunkCache.get(url);
    return {
      ok: true,
      value: cached,
      envelope: buildChunkPresenceEnvelope({
        url,
        fromCache: true,
        degraded: false,
        kind: typeof cached === "string" ? "text-or-url" : "object"
      })
    };
  }

  try {
    // ⭐ ROUTED, NOT FETCHED: ALL CHUNK LOADS GO THROUGH CNS → BACKEND
    const routed = await window.route("fetchExternalResource", {
      url,
      layer: "A1",
      reflexOrigin: "PulseChunks",
      binaryAware: true,
      dualBand: true,
      presenceAware: true,
      kind: "chunk"
    });

    // Contract: backend returns { ok, data, kind? }
    const ok = routed && routed.ok !== false;
    if (!ok) {
      throw new Error(routed?.error || `Chunk route failed for ${url}`);
    }

    const value = routed.data ?? routed.result ?? url;
    const kind = routed.kind || (
      typeof value === "string" ? "text-or-url" : "object"
    );

    chunkCache.set(url, value);

    return {
      ok: true,
      value,
      envelope: buildChunkPresenceEnvelope({
        url,
        fromCache: false,
        degraded: false,
        kind
      })
    };

  } catch (err) {
    markChunkFailure(url, err);

    return {
      ok: false,
      value: url,
      error: String(err),
      envelope: buildChunkPresenceEnvelope({
        url,
        fromCache: false,
        degraded: true,
        kind: "fallback"
      })
    };
  }
}

// ============================================================================
//  IMAGE-SPECIFIC CHUNKER — WITH PRESENCE-AWARE ROUTED FETCH
// ============================================================================
export async function getImage(url) {
  const { value } = await fetchChunk(url);
  return value;
}

function attachLore(chunk, metaPack) {
  const lore = generateLoreHeader(metaPack);

  if (typeof chunk === "string") {
    return lore + "\n" + chunk;
  }

  return {
    __lore: lore,
    __chunk: chunk
  };
}

// ============================================================================
//  GENERIC CHUNKER ENTRY — NOW WITH UNIVERSAL LORE INJECTION (DNA MODE)
// ============================================================================
export async function PulseChunker(filePath, fileSize = 0, metaPack = null) {
  if (shouldSkipChunk(filePath, fileSize)) {
    return null;
  }

  console.log("[PulseChunks] DNA allowed:", filePath);

  const { value: chunk, envelope } = await fetchChunk(filePath);

  // If no lore or degraded, return raw DNA
  if (!metaPack || chunksDegraded) {
    return {
      dna: chunk,
      dnaEncoded: !chunksDegraded,
      safe: true,
      presence: envelope
    };
  }

  // ⭐ ALWAYS generate lore
  const lore = generateLoreHeader(metaPack);

  // ⭐ If DNA is text → prepend lore
  if (typeof chunk === "string") {
    return {
      dna: lore + "\n" + chunk,
      dnaEncoded: true,
      safe: true,
      presence: envelope
    };
  }

  // ⭐ If DNA is NOT text → wrap it with lore metadata
  return {
    dna: {
      __lore: lore,
      __dna: chunk
    },
    dnaEncoded: true,
    safe: true,
    presence: envelope
  };
}

// ============================================================================
//  PREWARM ENGINE — NON-BLOCKING, ROUTED
// ============================================================================
export function prewarm(urls = []) {
  urls.forEach((url) => {
    if (!chunkCache.has(url) && !chunksDegraded) {
      fetchChunk(url); // fire-and-forget, still routed + presence-aware
    }
  });
}

// ============================================================================
//  PULSEBAND INTEGRATION — v12-EVO
//  Allows backend chunker to push chunk packets to the membrane.
// ============================================================================
function handlePulseBandPacket(packet) {
  if (!packet || !packet.type) return;

  switch (packet.type) {
    case "chunk-manifest":
      if (Array.isArray(packet.urls) && !chunksDegraded) {
        prewarm(packet.urls);
      }
      break;

    case "chunk-prewarm":
      if (Array.isArray(packet.urls) && !chunksDegraded) {
        prewarm(packet.urls);
      }
      break;

    case "chunk-bundle":
      if (packet.url && packet.data && !chunksDegraded) {
        chunkCache.set(packet.url, packet.data);
      }
      break;

    case "chunk-packet":
      if (packet.url && packet.chunk && !chunksDegraded) {
        chunkCache.set(packet.url, packet.chunk);
      }
      break;

    case "chunk-invalidate":
      if (packet.url) {
        chunkCache.delete(packet.url);
      }
      break;

    default:
      console.warn("[PulseChunks] Unknown PulseBand packet:", packet);
  }
}

// After chunkCache / failures / state declarations
function dechunk(urls = []) {
  urls.forEach((url) => {
    if (!url) return;
    chunkCache.delete(url);
    chunkFailures.delete(url);
  });
}

function dechunkAll() {
  chunkCache.clear();
  chunkFailures.clear();
  globalFailures = 0;
  chunksDegraded = false;
  console.log("[PulseChunks] All chunks cleared, state reset.");
}

// ============================================================================
//  OFFLINE IMAGE AUTO-DETECTOR — <img class="offline-img" data-offline="...">
//  Loads images THROUGH the chunker, then normalizes via PulseChunkNormalizer.
// ============================================================================
async function autoLoadOfflineImages() {
  if (typeof document === "undefined") return;

  const imgs = document.querySelectorAll("img.offline-img[data-offline]");

  for (const img of imgs) {
    const url = img.getAttribute("data-offline");
    if (!url) continue;

    try {
      const value = await getImage(url);
      const src = normalizeImage(value) || normalizeChunkValue(value, "image");

      if (src) {
        img.src = src;
      } else {
        console.warn("[PulseChunks] Could not normalize image:", url, value);
      }
    } catch (err) {
      console.warn("[PulseChunks] Offline image load failed:", url, err);
    }
  }
}

if (typeof window !== "undefined" && typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    autoLoadOfflineImages();
  });
}

// Attach listener if PulseBand exists
if (typeof window !== "undefined") {
  if (window.PulseBand && typeof window.PulseBand.on === "function") {
    window.PulseBand.on("chunk", handlePulseBandPacket);
  }
}

// ============================================================================
//  EXPOSE TO WINDOW — WITH STATE + CONTROLS
// ============================================================================
window.PulseChunks = {
  getImage,
  fetchChunk,
  prewarm,
  PulseChunker,
  isDegraded: isChunksDegraded,
  resetState: resetChunksState,
  dechunk,
  dechunkAll,
  normalizeChunkValue,   // expose normalizer
};

export default window.PulseChunks;

console.log("[PulseChunks-v1.8-EVO-FALLBACK] Ready — membrane chunker active with sectional fallback + universal de-chunking + offline image auto-loader.");
