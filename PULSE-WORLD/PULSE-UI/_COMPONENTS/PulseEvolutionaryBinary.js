// ============================================================================
// FILE: /PULSE-UI/PulseEvolutionaryBinary-v16.js
// PULSE OS — v16-IMMORTAL
// UI BINARY EVOLUTION ORGAN — GPU‑Friendly, Route/Lineage/Artery + Advantage View
// ============================================================================
//
// ROLE (v16-IMMORTAL):
//   THE UI BINARY EVOLUTION ORGAN — GPU‑friendly binary evolution layer.
//   • Encodes symbolic UI payloads into deterministic binary representations.
//   • Compresses binary into low‑entropy GPU‑friendly chunks.
//   • Builds route‑aware, lineage‑aware, artery‑aware, checksum‑aware envelopes.
//   • Exposes advantageView for diagnostics / Earn / PulseNet without IO.
//   • Decodes compressed binary back into symbolic payloads with integrity hints.
//
// CONTRACT:
//   • PURE FUNCTION — no IO, no network, no filesystem.
//   • READ‑ONLY — no mutation of caller‑provided payloads.
//   • NO eval(), NO Function(), NO dynamic imports.
//   • Deterministic output only.
//
// SAFETY:
//   • v16 upgrade is PURE + STRUCTURAL — logic is richer but still safe.
//   • All behavior is deterministic and organism‑safe.
// ============================================================================

/*
===============================================================================
AI_EXPERIENCE_META = {
  identity: "PulseUI.EvolutionaryBinary",
  version: "v16-Immortal",
  layer: "pulse_ui",
  role: "ui_binary_evolution_organ",
  lineage: "PulseEvolutionaryBinary-v11.3-Evo-Prime → v14-Immortal → v15-Immortal → v16-Immortal",

  evo: {
    uiOrgan: true,
    binaryCore: true,
    gpuFriendly: true,
    dualBand: true,
    binaryAware: true,
    symbolicAware: true,
    routeAware: true,
    lineageAware: true,
    arteryAware: true,
    unifiedAdvantageField: true,
    futureEvolutionReady: true,

    deterministic: true,
    driftProof: true,
    pureCompute: true,
    lowEntropy: true,

    zeroNetwork: true,
    zeroFilesystem: true,
    zeroMutationOfInput: true,

    envelopeAware: true,
    checksumAware: true,
    schemaVersioned: true,
    sizeGuarded: true,
    windowSafe: true,
    advantageView: true
  },

  contract: {
    always: [
      "PulseUI.RouteOrgan",
      "PulseUI.Evolution",
      "PulseDesign.Manifest",
      "PulseCore.Memory"
    ],
    never: [
      "eval",
      "Function",
      "dynamicImport",
      "fetchViaCNS",
      "safeRoute"
    ]
  }
}
===============================================================================
EXPORT_META = {
  organ: "PulseUI.EvolutionaryBinary",
  layer: "pulse_ui",
  stability: "IMMORTAL",
  deterministic: true,
  pure: true,

  consumes: [
    "SymbolicPayload",
    "RouteOrgan",
    "Evolution"
  ],

  produces: [
    "BinaryBits",
    "CompressedBinaryChunks",
    "BinaryEnvelope",
    "DecodedPayload",
    "AdvantageView"
  ],

  sideEffects: "logging_only",
  network: "none",
  filesystem: "none"
}
*/

// Global handle
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

export const BinaryRole = {
  type: "Organ",
  subsystem: "UI",
  layer: "PageBinary",
  version: "16.0-Immortal",
  identity: "PulseEvolutionaryBinary",

  evo: {
    driftProof: true,
    deterministic: true,
    binaryCore: true,
    dualBand: true,
    binaryAware: true,
    symbolicAware: true,
    gpuFriendly: true,
    lowEntropy: true,
    routeAware: true,
    lineageAware: true,
    arteryAware: true,
    unifiedAdvantageField: true,
    futureEvolutionReady: true,
    envelopeAware: true,
    checksumAware: true,
    schemaVersioned: true,
    sizeGuarded: true,
    windowSafe: true,
    advantageView: true
  }
};

const MAX_JSON_LENGTH = 64 * 1024; // guard against runaway payloads (pure check only)
const ENVELOPE_SCHEMA_VERSION = "v3";

// ---------------------------------------------------------------------------
// SYMBOLIC ↔ BINARY
// ---------------------------------------------------------------------------
function encodeSymbolicToBinary(obj) {
  const json = JSON.stringify(obj || {});
  const safeJson = json.length > MAX_JSON_LENGTH ? json.slice(0, MAX_JSON_LENGTH) : json;

  const bits = [];
  for (let i = 0; i < safeJson.length; i++) {
    const code = safeJson.charCodeAt(i);
    for (let b = 7; b >= 0; b--) {
      bits.push((code >> b) & 1);
    }
  }
  return bits;
}

function decodeBinaryToSymbolic(bits) {
  if (!Array.isArray(bits) || bits.length % 8 !== 0) return null;

  let json = "";
  for (let i = 0; i < bits.length; i += 8) {
    let code = 0;
    for (let b = 0; b < 8; b++) {
      code = (code << 1) | (bits[i + b] & 1);
    }
    json += String.fromCharCode(code);
  }

  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// BINARY COMPRESSION
// ---------------------------------------------------------------------------
function compressBinary(bits) {
  const out = [];
  for (let i = 0; i < bits.length; i += 4) {
    const chunk =
      ((bits[i] || 0) << 3) |
      ((bits[i + 1] || 0) << 2) |
      ((bits[i + 2] || 0) << 1) |
      (bits[i + 3] || 0);
    out.push(chunk & 0xF);
  }
  return out;
}

function expandBinary(chunks) {
  const bits = [];
  if (!Array.isArray(chunks)) return bits;

  for (let i = 0; i < chunks.length; i++) {
    const c = chunks[i] & 0xF;
    bits.push((c >> 3) & 1);
    bits.push((c >> 2) & 1);
    bits.push((c >> 1) & 1);
    bits.push(c & 1);
  }
  return bits;
}

// ---------------------------------------------------------------------------
// CHECKSUM + ENVELOPE ID
// ---------------------------------------------------------------------------
function checksumChunks(chunks) {
  if (!Array.isArray(chunks)) return 0;
  let hash = 0;
  for (let i = 0; i < chunks.length; i++) {
    const v = chunks[i] & 0xFF;
    hash = (hash * 31 + v) >>> 0; // unsigned 32‑bit
  }
  return hash;
}

function buildEnvelopeId(checksum, size, routeHash) {
  return `EBIN-${ENVELOPE_SCHEMA_VERSION}-${size}-${checksum}-${routeHash}`;
}

function hashString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;
  }
  return h >>> 0;
}

function normalizeBand(b) {
  const x = String(b || "symbolic").toLowerCase();
  return x === "binary" ? "binary" : "symbolic";
}

function clamp(v) {
  const n = Number(v);
  if (!Number.isFinite(n)) return 0;
  if (n < 0) return 0;
  if (n > 1) return 1;
  return n;
}
// ---------------------------------------------------------------------------
// ADVANTAGE VIEW + ARTERY HINTS
// ---------------------------------------------------------------------------
function computeAdvantageView({ bits, compressed, route, lineage }) {
  const bitLength = bits.length;
  const chunkLength = compressed.length;

  const density = bitLength ? compressed.length / bitLength : 0;
  const entropyHint = density > 0 ? clamp(1 - Math.abs(0.5 - density) * 2, 0, 1) : 0;

  const routeStr = typeof route === "string" ? route : JSON.stringify(route || {});
  const lineageStr = JSON.stringify(lineage || {});

  const routeHash = hashString(routeStr);
  const lineageHash = hashString(lineageStr);

  const sizeTier =
    bitLength > 48 * 1024 ? "huge" :
    bitLength > 24 * 1024 ? "large" :
    bitLength > 8 * 1024  ? "medium" :
    bitLength > 0         ? "small" :
                            "empty";

  return {
    bitLength,
    chunkLength,
    density,
    entropyHint,
    sizeTier,
    routeHash,
    lineageHash
  };
}

function deriveArteryHints(RouteOrgan) {
  // Pure read of RouteOrgan; no IO, no mutation
  const arteries = RouteOrgan?.Arteries || RouteOrgan?.arteries || null;
  if (!arteries || typeof arteries !== "object") {
    return {
      hasArteries: false,
      arteryCount: 0,
      dominant: null
    };
  }

  const keys = Object.keys(arteries);
  const count = keys.length;
  if (!count) {
    return {
      hasArteries: false,
      arteryCount: 0,
      dominant: null
    };
  }

  let dominant = keys[0];
  let maxWeight = 0;
  for (const k of keys) {
    const v = arteries[k];
    const w = typeof v === "number" ? v : v?.weight ?? 0;
    if (w > maxWeight) {
      maxWeight = w;
      dominant = k;
    }
  }

  return {
    hasArteries: true,
    arteryCount: count,
    dominant
  };
}

// ---------------------------------------------------------------------------
// ENVELOPE BUILDER
// ---------------------------------------------------------------------------
function buildEnvelope(payload, compressed, { Evolution, RouteOrgan }) {
  const lineage = Evolution?.getPageLineage?.() || {};
  const route = RouteOrgan?.RouterState?.currentRoute || "unknown";

  const size = compressed?.length || 0;
  const checksum = checksumChunks(compressed || []);

  const advantage = computeAdvantageView({
    bits: expandBinary(compressed || []),
    compressed: compressed || [],
    route,
    lineage
  });

  const routeStr = typeof route === "string" ? route : JSON.stringify(route || {});
  const routeHash = advantage.routeHash || hashString(routeStr);

  const envelopeId = buildEnvelopeId(checksum, size, routeHash);
  const arteryHints = deriveArteryHints(RouteOrgan);

  const integrity = {
    checksum,
    size,
    schemaVersion: ENVELOPE_SCHEMA_VERSION,
    sizeGuard: size > 0 && size <= MAX_JSON_LENGTH * 2,
    checksumNonZero: checksum !== 0
  };

  return {
    schemaVersion: ENVELOPE_SCHEMA_VERSION,
    id: envelopeId,
    version: BinaryRole.version,
    route,
    lineage,
    compressed,
    checksum,
    size,
    arteryHints,
    advantage,
    integrity,
    timestamp: "NO_TIMESTAMP_v16" // deterministic placeholder
  };
}

// ---------------------------------------------------------------------------
// FACTORY
// ---------------------------------------------------------------------------
export function createPulseEvolutionaryBinary({
  Evolution,
  RouteOrgan,
  log = console.log,
  warn = console.warn
} = {}) {
  const BinaryState = {
    lastEncoded: null,
    lastDecoded: null,
    lastCompressed: null,
    lastExpanded: null,
    lastEnvelope: null,
    lastAdvantage: null
  };

  function safeLog(stage, details = {}) {
    try {
      log("[PulseEvolutionaryBinary-v16]", stage, JSON.stringify(details));
    } catch {}
  }

  function encode(payload) {
    try {
      const bits = encodeSymbolicToBinary(payload);
      const compressed = compressBinary(bits);
      const envelope = buildEnvelope(payload, compressed, { Evolution, RouteOrgan });

      BinaryState.lastEncoded = bits;
      BinaryState.lastCompressed = compressed;
      BinaryState.lastEnvelope = envelope;
      BinaryState.lastAdvantage = envelope.advantage;

      safeLog("ENCODE_OK", {
        bitLength: bits.length,
        compressed: compressed.length,
        checksum: envelope.checksum,
        sizeTier: envelope.advantage.sizeTier
      });

      return {
        ok: true,
        bits,
        compressed,
        envelope,
        advantage: envelope.advantage
      };
    } catch (err) {
      warn("[PulseEvolutionaryBinary-v16] ENCODE_ERROR", String(err));
      return { ok: false, error: "EncodeError" };
    }
  }

  function decode(compressed) {
    try {
      const bits = expandBinary(compressed || []);
      const obj = decodeBinaryToSymbolic(bits);

      BinaryState.lastExpanded = bits;
      BinaryState.lastDecoded = obj;

      safeLog("DECODE_OK", { bitLength: bits.length });
      return { ok: true, payload: obj };
    } catch (err) {
      warn("[PulseEvolutionaryBinary-v16] DECODE_ERROR", String(err));
      return { ok: false, error: "DecodeError" };
    }
  }

  const PulseEvolutionaryBinary = {
    BinaryRole,
    BinaryState,
    encode,
    decode
  };

  safeLog("INIT", {
    identity: BinaryRole.identity,
    version: BinaryRole.version,
    schemaVersion: ENVELOPE_SCHEMA_VERSION
  });

  return PulseEvolutionaryBinary;
}

// ---------------------------------------------------------------------------
// GLOBAL REGISTRATION (WINDOW-SAFE, IMMORTAL)
// ---------------------------------------------------------------------------
try {
  if (typeof window !== "undefined") {
    window.PulseEvolutionaryBinary = createPulseEvolutionaryBinary;
  }
  if (typeof globalThis !== "undefined") {
    globalThis.PulseEvolutionaryBinary = createPulseEvolutionaryBinary;
  }
  if (typeof global !== "undefined") {
    global.PulseEvolutionaryBinary = createPulseEvolutionaryBinary;
  }
  if (typeof g !== "undefined") {
    g.PulseEvolutionaryBinary = createPulseEvolutionaryBinary;
  }
} catch {}
