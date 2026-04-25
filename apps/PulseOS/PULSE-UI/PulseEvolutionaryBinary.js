// ============================================================================
//  FILE: /ui/PulseEvolutionaryBinary.js
//  PULSE OS v11‑EVO‑PRIME — UI BINARY EVOLUTION ORGAN
//  “THE GPU‑FRIENDLY BINARY EVOLUTION LAYER”
//  Deterministic • Drift‑Proof • Dual‑Band • No Randomness
//
//  ROLE:
//  -----
//  • Converts symbolic → binary and binary → symbolic for UI evolution.
//  • Provides low‑entropy binary surfaces for GPU‑friendly operations.
//  • Works with EvolutionaryCode + EvolutionaryBrain + Router + Impulse.
//  • Pure binary math — no DOM, no IO, no side‑effects.
//
//  UPGRADE NOTE:
//  -------------
//  • Replaces all legacy BinaryPage.js / PageBinaryEngine.js.
//  • This is the OFFICIAL v11‑Evo UI binary organ.
//  • If wiped, the UI loses binary evolution capability.
// ============================================================================

export const BinaryRole = {
  type: "Organ",
  subsystem: "UI",
  layer: "PageBinary",
  version: "11.2-Evo-Prime",
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
  log = console.log,
  warn = console.warn
} = {}) {

  const BinaryState = {
    lastEncoded: null,
    lastDecoded: null,
    lastCompressed: null,
    lastExpanded: null
  };

  function safeLog(stage, details = {}) {
    try {
      log("[PulseEvolutionaryBinary]", stage, JSON.stringify(details));
    } catch {}
  }

  // --------------------------------------------------------------------------
  //  ENCODE SYMBOLIC → BINARY
  // --------------------------------------------------------------------------
  function encode(payload) {
    try {
      const bits = encodeSymbolicToBinary(payload);
      const compressed = compressBinary(bits);

      BinaryState.lastEncoded = bits;
      BinaryState.lastCompressed = compressed;

      safeLog("ENCODE_OK", { bitLength: bits.length });
      return { ok: true, bits, compressed };
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
