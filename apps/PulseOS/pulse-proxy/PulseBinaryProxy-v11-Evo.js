// ============================================================================
//  BinaryProxy-v11-PURE-EVO-ABA.js
//  PURE BINARY NERVE ROOT — FINAL v11‑EVO‑A‑B‑A EDITION
// ============================================================================
//  ROLE:
//    - Accept ONLY pure binary arrays (0/1).
//    - Encode using BinaryAgent.
//    - Exchange using BinaryAgent.
//    - Emit A‑B‑A bandSignature + binaryField + waveField.
//    - Deterministic fallback to PulseProxy-v11-Evo.
//
//  ARCHITECTURE LAW (v11‑EVO‑A‑B‑A):
//    - Binary adds ONLY binary representation.
//    - No symbolic logic.
//    - No routing, no lineage, no patterns, no evolution.
//    - No JSON except internal ops.
//    - No objects except internal ops.
//    - No randomness, no drift, no mutation.
// ============================================================================

export function createBinaryProxy({
  encoder,
  fallbackProxyFactory,
  trace = false
} = {}) {

  if (!encoder) {
    throw new Error("BinaryProxy requires a BinaryAgent encoder");
  }

  let cycle = 0;
  const history = [];

  // ---------------------------------------------------------------------------
  //  SAFETY: PURE BINARY ONLY
  // ---------------------------------------------------------------------------
  function isPureBinary(bits) {
    if (!Array.isArray(bits)) return false;
    for (let i = 0; i < bits.length; i++) {
      if (bits[i] !== 0 && bits[i] !== 1) return false;
    }
    return true;
  }

  function ensurePureBinaryOrFallback(op, bits, reason) {
    if (!isPureBinary(bits)) {
      return fallback(op, bits, reason);
    }
    return bits;
  }

  // ---------------------------------------------------------------------------
  //  A‑B‑A SURFACES (binary-only phenotype)
  // ---------------------------------------------------------------------------
  function buildBandSignature() {
    return encoder.hash("binary-band");
  }

  function buildBinaryField() {
    const patternLen = 16;
    const density = patternLen + cycle + 32;
    const surface = density + patternLen;

    return {
      binaryPhenotypeSignature: encoder.hash(`BINARY_PHENO::${surface}`),
      binarySurfaceSignature: encoder.hash(`BINARY_SURF::${surface}`),
      binarySurface: { patternLen, density, surface },
      parity: surface % 2 === 0 ? 0 : 1,
      shiftDepth: Math.max(0, Math.floor(Math.log2(surface || 1)))
    };
  }

  function buildWaveField() {
    const amplitude = (cycle + 1) * 12;
    const wavelength = amplitude + 4;
    const phase = amplitude % 16;

    return {
      amplitude,
      wavelength,
      phase,
      band: "binary",
      mode: "compression-wave"
    };
  }

  function buildCycleSignature() {
    return encoder.hash(`BINARY_PROXY_CYCLE::${cycle}`);
  }

  // ---------------------------------------------------------------------------
  //  RECEIVE (binary → encoded)
  // ---------------------------------------------------------------------------
  function receive(bits) {
    cycle++;

    const pure = ensurePureBinaryOrFallback("receive", bits, "non-binary-input");
    const encoded = encoder.encode(pure);

    const bandSignature = buildBandSignature();
    const binaryField = buildBinaryField();
    const waveField = buildWaveField();
    const cycleSignature = buildCycleSignature();

    if (trace) {
      console.log("[BinaryProxy] IN:", pure);
    }

    history.push({
      dir: "in",
      bits: pure,
      encoded,
      bandSignature,
      binaryField,
      waveField,
      cycleSignature
    });

    return encoded;
  }

  // ---------------------------------------------------------------------------
  //  SEND (binary → encoded)
  // ---------------------------------------------------------------------------
  function send(bits) {
    cycle++;

    const pure = ensurePureBinaryOrFallback("send", bits, "non-binary-output");
    const encoded = encoder.encode(pure);

    const bandSignature = buildBandSignature();
    const binaryField = buildBinaryField();
    const waveField = buildWaveField();
    const cycleSignature = buildCycleSignature();

    if (trace) {
      console.log("[BinaryProxy] OUT:", pure);
    }

    history.push({
      dir: "out",
      bits: pure,
      encoded,
      bandSignature,
      binaryField,
      waveField,
      cycleSignature
    });

    return encoded;
  }

  // ---------------------------------------------------------------------------
  //  EXCHANGE (binary → cortex → binary)
  // ---------------------------------------------------------------------------
  function exchange(bits) {
    cycle++;

    const pure = ensurePureBinaryOrFallback("exchange", bits, "non-binary-exchange");

    const encodedIn = encoder.encode(pure);
    const response = encoder.process(encodedIn);

    const pureResponse = ensurePureBinaryOrFallback(
      "exchange",
      response,
      "cortex-non-binary-response"
    );

    const encodedOut = encoder.encode(pureResponse);

    const bandSignature = buildBandSignature();
    const binaryField = buildBinaryField();
    const waveField = buildWaveField();
    const cycleSignature = buildCycleSignature();

    if (trace) {
      console.log("[BinaryProxy] EXCHANGE IN:", pure);
      console.log("[BinaryProxy] EXCHANGE OUT:", pureResponse);
    }

    history.push({
      dir: "exchange",
      in: pure,
      out: pureResponse,
      bandSignature,
      binaryField,
      waveField,
      cycleSignature
    });

    return encodedOut;
  }

  // ---------------------------------------------------------------------------
  //  FALLBACK — deterministic, drift-proof
  // ---------------------------------------------------------------------------
  function fallback(op, bits, reason) {
    if (!fallbackProxyFactory) {
      throw new Error(
        `BinaryProxy fallback triggered (${reason}) but no fallbackProxyFactory provided`
      );
    }

    if (trace) {
      console.warn(`[BinaryProxy] FALLBACK (${op}):`, reason, bits);
    }

    return fallbackProxyFactory({
      jobId: `fallback-${op}`,
      pattern: "binary-fallback",
      payload: { bits, reason },
      priority: "normal",
      returnTo: null,
      parentLineage: null,
      pageId: "BINARY_PROXY_FALLBACK"
    });
  }

  // ---------------------------------------------------------------------------
  //  PUBLIC API
  // ---------------------------------------------------------------------------
  return {
    receive,
    send,
    exchange,
    fallback,
    history
  };
}
