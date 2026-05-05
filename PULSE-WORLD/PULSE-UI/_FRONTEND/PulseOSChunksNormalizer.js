// ============================================================================
//  PulsePresenceNormalizer-SMART v2.0 (v14 IMMORTAL UPGRADE)
//  Contract-driven bridge: A → Z
//  No guessing. No heuristics. No fallback decoding.
//  Fully aligned with PulseChunks-v2.0-MULTILANE-HYBRID
//  v14 IMMORTAL: LocalStorage mirroring of ALL normalization events
// ============================================================================
/*
AI_EXPERIENCE_META = {
  identity: "PulsePresenceNormalizer",
  version: "v12.5-Evo-SMART-HYBRID",
  layer: "frontend",
  role: "chunk_normalizer",
  lineage: "PulseOS-v12",

  evo: {
    binaryAware: true,
    chunkAligned: true,
    dualBand: true,
    presenceAware: true,
    safeRouteFree: true,
    smartNormalizer: true,
    unwrapOneLayer: true,

    // v14 IMMORTAL
    offlineFirst: true,
    localStoreMirrored: true,
    replayAware: true,
    modeAgnostic: true
  },

  contract: {
    always: [
      "PulseChunks",
      "PulsePresence",
      "PulseWindow",
      "PulseUIFlow",
      "PulseUIErrors"
    ],
    never: [
      "legacyNormalizer",
      "legacyDecode",
      "legacyPresence",
      "safeRoute",
      "fetchViaCNS"
    ]
  }
}
*/

const g =
  typeof globalThis !== "undefined"
    ? globalThis
    : typeof global !== "undefined"
    ? global
    : typeof window !== "undefined"
    ? window
    : typeof g !== "undefined"
    ? g
    : {};

// Prefer global db if present (logger page / server)
const db =
  (g && g.db) ||
  (typeof global !== "undefined" && global.db) ||
  (typeof globalThis !== "undefined" && globalThis.db) ||
  (typeof window !== "undefined" && window.db) ||
  null;

// ============================================================================
// IMMORTAL LOCALSTORAGE MIRROR — PulsePresenceNormalizerStore
// ============================================================================

const PN_LS_KEY = "PulsePresenceNormalizer.v14.buffer";
const PN_LS_MAX = 2000;

function hasLocalStorage() {
  try {
    if (typeof window === "undefined" || !window.localStorage) return false;
    const t = "__presence_normalizer_test__";
    window.localStorage.setItem(t, "1");
    window.localStorage.removeItem(t);
    return true;
  } catch {
    return false;
  }
}

function loadPNBuffer() {
  if (!hasLocalStorage()) return [];
  try {
    const raw = window.localStorage.getItem(PN_LS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function savePNBuffer(buf) {
  if (!hasLocalStorage()) return;
  try {
    const trimmed =
      buf.length > PN_LS_MAX ? buf.slice(buf.length - PN_LS_MAX) : buf;
    window.localStorage.setItem(PN_LS_KEY, JSON.stringify(trimmed));
  } catch {}
}

function appendPresenceRecord(kind, payload) {
  const entry = {
    ts: Date.now(),
    kind,
    payload
  };
  const buf = loadPNBuffer();
  buf.push(entry);
  savePNBuffer(buf);
}

export const PulsePresenceNormalizerStore = {
  getAll() {
    return loadPNBuffer();
  },
  tail(n = 200) {
    const buf = loadPNBuffer();
    return buf.slice(Math.max(0, buf.length - n));
  },
  clear() {
    savePNBuffer([]);
  }
};

// ============================================================================
// SMART: unwrap ONLY ONE LAYER.
// Backend must declare the shape. No recursive peeling.
// ============================================================================
function unwrap(value) {
  appendPresenceRecord("unwrap", { value });

  if (!value || typeof value !== "object") return value;

  if (value.__dna !== undefined) return value.__dna;
  if (value.__chunk !== undefined) return value.__chunk;

  if (value.data !== undefined) return value.data;
  if (value.chunk !== undefined) return value.chunk;
  if (value.value !== undefined) return value.value;

  return value;
}

// ============================================================================
// SMART IMAGE CONSTRUCTOR — A → Z (image)
// ============================================================================
export function normalizeImage(value, mime = "image/png") {
  appendPresenceRecord("normalizeImage_in", { value, mime });

  value = unwrap(value);

  let out = null;

  if (typeof value === "string") out = value;
  else if (value && typeof value.base64 === "string")
    out = `data:${mime};base64,${value.base64}`;
  else if (value instanceof Uint8Array)
    out = URL.createObjectURL(new Blob([value], { type: mime }));
  else if (value instanceof ArrayBuffer)
    out = URL.createObjectURL(new Blob([new Uint8Array(value)], { type: mime }));
  else if (value instanceof Blob)
    out = URL.createObjectURL(value);
  else if (value && typeof value.url === "string")
    out = value.url;

  appendPresenceRecord("normalizeImage_out", { out });
  return out;
}

// ============================================================================
// SMART TEXT / HTML / CSS / JS
// ============================================================================
function normalizeText(value) {
  appendPresenceRecord("normalizeText_in", { value });

  value = unwrap(value);
  const out = typeof value === "string" ? value : null;

  appendPresenceRecord("normalizeText_out", { out });
  return out;
}

// ============================================================================
// SMART JSON
// ============================================================================
function normalizeJSON(value) {
  appendPresenceRecord("normalizeJSON_in", { value });

  value = unwrap(value);
  const out = typeof value === "object" ? value : null;

  appendPresenceRecord("normalizeJSON_out", { out });
  return out;
}

// ============================================================================
// SMART BINARY
// ============================================================================
function normalizeBinary(value, mime = "application/octet-stream") {
  appendPresenceRecord("normalizeBinary_in", { value, mime });

  value = unwrap(value);

  let out = null;

  if (value instanceof Uint8Array)
    out = new Blob([value], { type: mime });
  else if (value instanceof ArrayBuffer)
    out = new Blob([new Uint8Array(value)], { type: mime });
  else if (value instanceof Blob)
    out = value;

  appendPresenceRecord("normalizeBinary_out", { out });
  return out;
}

// ============================================================================
// SMART UNIVERSAL NORMALIZER
// ============================================================================
export function normalizeChunkValue(value, typeHint = null, options = {}) {
  appendPresenceRecord("normalizeChunkValue_in", { value, typeHint, options });

  const mime = options.mime || "application/octet-stream";
  let out = null;

  switch (typeHint) {
    case "image":
      out = normalizeImage(value, mime);
      break;

    case "html":
    case "css":
    case "js":
      out = normalizeText(value);
      break;

    case "json":
      out = normalizeJSON(value);
      break;

    case "binary":
      out = normalizeBinary(value, mime);
      break;

    default:
      out = unwrap(value);
      break;
  }

  appendPresenceRecord("normalizeChunkValue_out", { out });
  return out;
}

// ============================================================================
// EXPORTS
// ============================================================================
export const PulseChunkNormalizer = {
  normalizeChunkValue,
  normalizeImage,
  normalizeHTML: normalizeText,
  normalizeCSS: normalizeText,
  normalizeJS: normalizeText,
  normalizeJSON,
  normalizeBinary,
  unwrap
};

export default PulseChunkNormalizer;

// ============================================================================
// GLOBAL EXPOSURE OF IMMORTAL STORE
// ============================================================================
try {
  if (typeof window !== "undefined") {
    window.PulseChunkNormalizer = PulseChunkNormalizer;
    window.PulsePresenceNormalizerStore = PulsePresenceNormalizerStore;
  }
  if (typeof globalThis !== "undefined") {
    globalThis.PulseChunkNormalizer = PulseChunkNormalizer;
    globalThis.PulsePresenceNormalizerStore = PulsePresenceNormalizerStore;
  }
  if (typeof global !== "undefined") {
    global.PulseChunkNormalizer = PulseChunkNormalizer;
    global.PulsePresenceNormalizerStore = PulsePresenceNormalizerStore;
  }
  if (typeof g !== "undefined") {
    g.PulseChunkNormalizer = PulseChunkNormalizer;
    g.PulsePresenceNormalizerStore = PulsePresenceNormalizerStore;
  }
} catch {}
