// ============================================================================
//  FILE: /PULSE-UI/PulseEvolutionaryBinary.js
//  PULSE OS v11‑EVO‑PRIME — UI BINARY EVOLUTION ORGAN (UPGRADED)
//  “GPU‑FRIENDLY BINARY EVOLUTION LAYER”
//  Deterministic • Drift‑Proof • Dual‑Band • Binary‑Native
// ============================================================================

export const BinaryRole = {
  type: "Organ",
  subsystem: "UI",
  layer: "PageBinary",
  version: "11.3-Evo-Prime",
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
    unifiedAdvantageField: true,
    futureEvolutionReady: true
  }
};

// ============================================================================
//  PURE BINARY HELPERS — deterministic, no randomness
// ============================================================================

// Convert symbolic object → binary array of 0/1
function encodeSymbolicToBinary(obj) {
  const json = JSON.stringify(obj || {});
  const bits = [];

  for (let i = 0; i < json.length; i++) {
    const code = json.charCodeAt(i);
    for (let b = 7; b >= 0; b--) {
      bits.push((code >> b) & 1);
    }
  }

  return bits;
}

// Convert binary array → symbolic object
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

// Reduce binary array to low‑entropy GPU‑friendly chunks
function compressBinary(bits) {
  const out = [];
  for (let i = 0; i < bits.length; i += 4) {
    const chunk =
      ((bits[i] || 0) << 3) |
      ((bits[i + 1] || 0) << 2) |
      ((bits[i + 2] || 0) << 1) |
      (bits[i + 3] || 0);
    out.push(chunk);
  }
  return out;
}

// Expand compressed chunks back to full binary
function expandBinary(chunks) {
  const bits = [];
  for (let i = 0; i < chunks.length; i++) {
    const c = chunks[i] & 0xF;
    bits.push((c >> 3) & 1);
    bits.push((c >> 2) & 1);
    bits.push((c >> 1) & 1);
    bits.push(c & 1);
  }
  return bits;
}

// ============================================================================
//  FACTORY — creates the binary organ
// ============================================================================
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
    lastEnvelope: null
  };

  function safeLog(stage, details = {}) {
    try {
      log("[PulseEvolutionaryBinary]", stage, JSON.stringify(details));
    } catch {}
  }

  // --------------------------------------------------------------------------
  //  BUILD BINARY ENVELOPE — deterministic, lineage-aware, route-aware
  // --------------------------------------------------------------------------
  function buildEnvelope(payload, compressed) {
    const lineage = Evolution?.getPageLineage?.() || {};
    const route = RouteOrgan?.RouterState?.currentRoute || "unknown";

    return {
      version: BinaryRole.version,
      route,
      lineage,
      compressed,
      timestamp: "NO_TIMESTAMP_v11", // deterministic placeholder
      size: compressed?.length || 0
    };
  }

  // --------------------------------------------------------------------------
  //  ENCODE SYMBOLIC → BINARY (GPU-friendly)
  // --------------------------------------------------------------------------
  function encode(payload) {
    try {
      const bits = encodeSymbolicToBinary(payload);
      const compressed = compressBinary(bits);
      const envelope = buildEnvelope(payload, compressed);

      BinaryState.lastEncoded = bits;
      BinaryState.lastCompressed = compressed;
      BinaryState.lastEnvelope = envelope;

      safeLog("ENCODE_OK", { bitLength: bits.length, compressed: compressed.length });
      return { ok: true, bits, compressed, envelope };
    } catch (err) {
      warn("[PulseEvolutionaryBinary] ENCODE_ERROR", String(err));
      return { ok: false, error: "EncodeError" };
    }
  }

  // --------------------------------------------------------------------------
  //  DECODE BINARY → SYMBOLIC
  // --------------------------------------------------------------------------
  function decode(compressed) {
    try {
      const bits = expandBinary(compressed || []);
      const obj = decodeBinaryToSymbolic(bits);

      BinaryState.lastExpanded = bits;
      BinaryState.lastDecoded = obj;

      safeLog("DECODE_OK", { bitLength: bits.length });
      return { ok: true, payload: obj };
    } catch (err) {
      warn("[PulseEvolutionaryBinary] DECODE_ERROR", String(err));
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
    version: BinaryRole.version
  });

  return PulseEvolutionaryBinary;
}
