// ============================================================================
//  BinaryProxy-v11-EVO-MAX-ABA.js
//  PURE BINARY NERVE ROOT — FINAL v11‑EVO‑A‑B‑A MAX EDITION
// ============================================================================
//  ROLE:
//    - Accept ONLY pure binary arrays (0/1).
//    - Encode using BinaryAgent (encoder).
//    - Exchange using BinaryAgent.process().
//    - Emit A‑B‑A bandSignature + binaryField + waveField + cycleSignature.
//    - Deterministic fallback to PulseProxy-v11-Evo (or any symbolic proxy).
//
//  ARCHITECTURE LAW (v11‑EVO‑A‑B‑A):
//    - Binary adds ONLY binary representation.
//    - No symbolic logic.
//    - No routing, no lineage, no patterns, no evolution.
//    - No JSON except internal ops.
//    - No objects except internal ops.
//    - No randomness, no drift, no mutation.
// ============================================================================

export const BinaryProxyRole = {
  layer: "BinaryProxy",
  role: "PURE_BINARY_NERVE_ROOT",
  version: "11.0-EVO-MAX-ABA",
  lineage: "binary-proxy-v11-aba",
  evo: {
    binaryOnly: true,
    symbolicFallback: true,
    driftProof: true,
    deterministic: true,
    noRouting: true,
    noOrgans: true,
    noEvolution: true,
    noRandomness: true,
    abaBandAware: true
  }
};

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
  //  A‑B‑A SURFACES (binary-only phenotype, deterministic)
// ---------------------------------------------------------------------------
  function buildBandSignature() {
    return encoder.hash("binary-band-v11-aba");
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

  function buildBinaryEnvelope(dir, bits, encoded, extra = null) {
    const bandSignature = buildBandSignature();
    const binaryField = buildBinaryField();
    const waveField = buildWaveField();
    const cycleSignature = buildCycleSignature();

    const record = {
      dir,
      bits,
      encoded,
      bandSignature,
      binaryField,
      waveField,
      cycleSignature
    };

    if (extra) {
      record.extra = extra;
    }

    history.push(record);

    return {
      encoded,
      bandSignature,
      binaryField,
      waveField,
      cycleSignature
    };
  }

  // ---------------------------------------------------------------------------
  //  RECEIVE (binary → encoded)
// ---------------------------------------------------------------------------
  function receive(bits) {
    cycle++;

    const pure = ensurePureBinaryOrFallback("receive", bits, "non-binary-input");
    const encoded = encoder.encode(pure);

    if (trace) {
      console.log("[BinaryProxy] IN:", pure);
    }

    const envelope = buildBinaryEnvelope("in", pure, encoded);
    return envelope.encoded;
  }

  // ---------------------------------------------------------------------------
  //  SEND (binary → encoded)
// ---------------------------------------------------------------------------
  function send(bits) {
    cycle++;

    const pure = ensurePureBinaryOrFallback("send", bits, "non-binary-output");
    const encoded = encoder.encode(pure);

    if (trace) {
      console.log("[BinaryProxy] OUT:", pure);
    }

    const envelope = buildBinaryEnvelope("out", pure, encoded);
    return envelope.encoded;
  }

  // ---------------------------------------------------------------------------
  //  EXCHANGE (binary → cortex → binary)
// ---------------------------------------------------------------------------
  function exchange(bits) {
    cycle++;

    const pure = ensurePureBinaryOrFallback(
      "exchange",
      bits,
      "non-binary-exchange"
    );

    const encodedIn = encoder.encode(pure);
    const response = encoder.process(encodedIn);

    const pureResponse = ensurePureBinaryOrFallback(
      "exchange",
      response,
      "cortex-non-binary-response"
    );

    const encodedOut = encoder.encode(pureResponse);

    if (trace) {
      console.log("[BinaryProxy] EXCHANGE IN:", pure);
      console.log("[BinaryProxy] EXCHANGE OUT:", pureResponse);
    }

    const envelope = buildBinaryEnvelope("exchange", pure, encodedOut, {
      responseBits: pureResponse
    });

    return envelope.encoded;
  }

  // ---------------------------------------------------------------------------
  //  FALLBACK — deterministic, drift-proof, symbolic proxy bridge
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

    // This is the ONLY symbolic bridge: we hand off to a v11 Proxy.
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
    role: BinaryProxyRole,
    receive,
    send,
    exchange,
    fallback,
    history
  };
}
