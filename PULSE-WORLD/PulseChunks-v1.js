// ============================================================================
//  PulseChunks-v1.6-EVO+
//  FRONTEND CHUNK MEMBRANE — 2026 Transport Layer
//  Chunking • Caching • Prewarm • Zero-Latency Surface
//  Now with: LORE HEADER INJECTION (text chunks only)
// ============================================================================

console.log("[PulseChunks-v1.6-EVO+] Membrane chunker loading...");
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

  // Variation pools — deterministic evolution
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

  // Deterministic selection based on metadata identity
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
function shouldSkipChunk(filePath, fileSize = 0) {
  if (!filePath) return true;

  if (filePath.includes("PulseOSLongTermMemory.js")) return true;
  if (filePath.includes("index.js")) return true;
  if (filePath.includes("firebase-admin")) return true;

  if (
    !filePath.startsWith("/public") &&
    !filePath.startsWith("/frontend") &&
    !filePath.startsWith("/assets")
  ) return true;

  if (fileSize > 1024 * 1024) return true;

  return false;
}

// ============================================================================
//  UNIVERSAL FRONTEND CACHE
// ============================================================================
const chunkCache = new Map();

// ============================================================================
//  UNIVERSAL CHUNK FETCHER
// ============================================================================
async function fetchChunk(url) {
  if (!url) return url;

  if (chunkCache.has(url)) return chunkCache.get(url);

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
    return url;
  }
}

// ============================================================================
//  IMAGE-SPECIFIC CHUNKER
// ============================================================================
export async function getImage(url) {
  return await fetchChunk(url);
}

// ============================================================================
//  GENERIC CHUNKER ENTRY — NOW WITH LORE INJECTION
// ============================================================================
export async function PulseChunker(filePath, fileSize = 0, metaPack = null) {
  if (shouldSkipChunk(filePath, fileSize)) return null;

  console.log("[PulseChunks] Chunking allowed:", filePath);

  const chunk = await fetchChunk(filePath);

  // Only inject lore into TEXT chunks
  if (typeof chunk === "string" && metaPack) {
    const lore = generateLoreHeader(metaPack);
    return {
      chunk: lore + "\n" + chunk,
      chunked: true,
      safe: true
    };
  }

  return {
    chunk,
    chunked: true,
    safe: true
  };
}

// ============================================================================
//  PREWARM ENGINE
// ============================================================================
export function prewarm(urls = []) {
  urls.forEach((url) => {
    if (!chunkCache.has(url)) fetchChunk(url);
  });
}

// ============================================================================
//  EXPOSE TO WINDOW
// ============================================================================
window.PulseChunks = {
  getImage,
  fetchChunk,
  prewarm,
  PulseChunker
};

console.log("[PulseChunks-v1.6-EVO+] Ready — membrane chunker active.");
