// ============================================================================
//  PulseChunks-v2.0-MULTILANE-HYBRID
//  FRONTEND CHUNK MEMBRANE — 2026 Transport Layer
//  Chunking • Caching • Prewarm • Zero-Latency Surface
//  Lore injection • PulseBand integration • Sectional fallback
//  + Universal de-chunking via PulseChunkNormalizer
//  + 32-LANE HYBRID CNS ROUTER (binary-aligned, hash-routed)
// ============================================================================
console.log("Presence");
console.log("[PulseChunks-v2.0-MULTILANE-HYBRID] Membrane chunker loading...");

import { safeRoute as route, fireAndForgetRoute } from "./PulseBridge.js";
import { normalizeChunkValue, normalizeImage } from "./PulsePresenceNormalizer.js";

// ============================================================================
//  LORE TRANSLATOR — Evolvable, deterministic, metadata-driven
// ============================================================================
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

  if (filePath.includes("firebase-admin")) return true;
  if (filePath.includes("env")) return true;
  if (filePath.includes("package")) return true;
  if (filePath.includes("PulseCORS")) return true;
  if (filePath.includes("PulseOSLongTermMemory")) return true;
  if (filePath.includes("index.html")) return true;

  if (filePath.includes("PulseChunker") ||
      filePath.includes("Brainstem") ||
      filePath.includes("Organs") ||
      filePath.includes("PulsePresence")) {
    return true;
  }

  if (fileSize > 1024 * 1024 * 5) return true; // 5MB safety cap

  return false;
}

// ============================================================================
//  CHUNKS STATE — SECTIONAL FALLBACK (GLOBAL)
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

  const band = "symbolic";
  const dualBand = false;

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
//  32-LANE CNS ROUTER — HYBRID: GLOBAL CACHE + PER-LANE CNS/STATS
// ============================================================================
const LANE_COUNT = 32;
const LANE_MASK  = LANE_COUNT - 1;

function hashKey(key = "") {
  let h = 0;
  for (let i = 0; i < key.length; i++) {
    h = ((h << 5) - h + key.charCodeAt(i)) | 0;
  }
  return h >>> 0;
}

function pickLaneIndex(key) {
  return hashKey(key) & LANE_MASK;
}

function nowMs() {
  if (typeof performance !== "undefined" && typeof performance.now === "function") {
    return performance.now();
  }
  return Date.now();
}

function createLane(id) {
  return {
    id,
    envelopeCounter: 0,
    stats: {
      requests: 0,
      successes: 0,
      failures: 0,
      totalLatencyMs: 0,
      lastError: null,
    },
    async fetchViaCNS(url) {
      const start = nowMs();
      this.stats.requests++;

      const envelopeId = `lane-${id}-${++this.envelopeCounter}`;

      const routed = await route("fetchExternalResource", {
        url,
        layer: "A1",
        reflexOrigin: "PulseChunks",
        binaryAware: true,
        dualBand: true,
        presenceAware: true,
        kind: "chunk",
        laneId: id,
        envelopeId,
      });

      const latency = nowMs() - start;
      this.stats.totalLatencyMs += latency;

      const ok = routed && routed.ok !== false;
      if (ok) {
        this.stats.successes++;
      } else {
        this.stats.failures++;
        this.stats.lastError = routed?.error || `Chunk route failed for ${url}`;
      }

      return routed;
    }
  };
}

const lanes = Array.from({ length: LANE_COUNT }, (_, i) => createLane(i));

function getLaneStatsSnapshot() {
  return lanes.map(lane => ({
    id: lane.id,
    envelopeCounter: lane.envelopeCounter,
    stats: { ...lane.stats },
  }));
}

// ============================================================================
//  UNIVERSAL CHUNK FETCHER — v2.0 MULTILANE HYBRID
// ============================================================================
async function fetchChunk(url) {
  // Frontend DNA visibility logging — non-blocking via bridge rules
  try {
    fireAndForgetRoute("proxy.dnaVisibility", {
      url,
      timestamp: Date.now(),
      degraded: chunksDegraded,
      presence: "frontend-dna-request",
      membrane: "PulseChunks-v2.0-MULTILANE-HYBRID",
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

  // Global cache — shared across lanes
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

  // Deterministic lane selection
  const laneIndex = pickLaneIndex(url);
  const lane = lanes[laneIndex];

  try {
    const routed = await lane.fetchViaCNS(url);

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
//  IMAGE-SPECIFIC CHUNKER — NORMALIZER-ALIGNED
// ============================================================================
export async function getImage(url) {
  const { value, ok, error, envelope } = await fetchChunk(url);

  if (!ok) {
    console.warn("[PulseChunks] getImage fallback — using raw URL due to chunk failure:", {
      url,
      error,
      envelope
    });
    return url;
  }

  const src =
    normalizeImage(value) ||
    normalizeChunkValue(value, "image") ||
    null;

  if (!src) {
    console.warn("[PulseChunks] getImage unknown image format, falling back to URL:", {
      url,
      value
    });
    return url;
  }

  return src;
}

// ============================================================================
//  LORE ATTACHMENT — USED BY DNA MODE
// ============================================================================
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
//  GENERIC CHUNKER ENTRY — WITH UNIVERSAL LORE INJECTION (DNA MODE)
// ============================================================================
export async function PulseChunker(filePath, fileSize = 0, metaPack = null) {
  if (shouldSkipChunk(filePath, fileSize)) {
    return null;
  }

  console.log("[PulseChunks] DNA allowed:", filePath);

  const { value: chunk, envelope } = await fetchChunk(filePath);

  if (!metaPack || chunksDegraded) {
    return {
      dna: chunk,
      dnaEncoded: !chunksDegraded,
      safe: true,
      presence: envelope
    };
  }

  const dnaWithLore = attachLore(chunk, metaPack);

  return {
    dna: dnaWithLore,
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
      fetchChunk(url); // fire-and-forget, lane-routed
    }
  });
}

// ============================================================================
//  PULSEBAND INTEGRATION — v12-EVO
// ============================================================================
function handlePulseBandPacket(packet) {
  if (!packet || !packet.type) return;

  switch (packet.type) {
    case "chunk-manifest":
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
//  OFFLINE IMAGE AUTO-DETECTOR — sequential (no burst collapse)
// ============================================================================
async function autoLoadOfflineImages() {
  if (typeof document === "undefined") return;

  const imgs = Array.from(document.querySelectorAll("img.offline-img[data-offline]"));

  for (const img of imgs) {
    const url = img.getAttribute("data-offline");
    if (!url) continue;

    try {
      const { value, ok, error, envelope } = await fetchChunk(url);

      if (!ok) {
        console.warn("[PulseChunks] Offline image chunk failed, falling back to URL:", {
          url,
          error,
          envelope
        });
        img.src = url;
        continue;
      }

      const src =
        normalizeImage(value) ||
        normalizeChunkValue(value, "image") ||
        null;

      if (!src) {
        console.warn("[PulseChunks] Could not normalize image, falling back to URL:", {
          url,
          value
        });
        img.src = url;
        continue;
      }

      img.src = src;

    } catch (err) {
      console.warn("[PulseChunks] Offline image load threw, falling back to URL:", url, err);
      img.src = url;
    }
  }
}

if (typeof window !== "undefined" && typeof document !== "undefined") {
  document.addEventListener("DOMContentLoaded", () => {
    autoLoadOfflineImages();
  });
}

if (typeof window !== "undefined") {
  if (window.PulseBand && typeof window.PulseBand.on === "function") {
    window.PulseBand.on("chunk", handlePulseBandPacket);
  }
}

// ============================================================================
//  EXPOSE TO WINDOW — WITH STATE + CONTROLS + LANE STATS
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
  normalizeChunkValue,
  lanes,
  getLaneStats: getLaneStatsSnapshot,
};

export default window.PulseChunks;

console.log("[PulseChunks-v2.0-MULTILANE-HYBRID] Ready — 32-lane membrane active with sectional fallback + universal de-chunking + offline image auto-loader + lane stats.");
