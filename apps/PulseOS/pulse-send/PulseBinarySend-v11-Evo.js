// ============================================================================
//  BinarySend-v11-PURE-EVO-Binary.js
//  PURE BINARY SEND ORGAN — v11-EVO-BINARY EDITION
// ============================================================================
//  ROLE:
//    - Accept ONLY pure binary arrays (0/1).
//    - Deterministic outbound binary channel.
//    - No JSON, no objects, no strings (except internal ops).
//    - No lineage, no pattern, no routing hints.
//    - No drift, no randomness, no mutation.
//    - Binary-aware: emits binary diagnostics + signatures.
//    - Fallback-safe: deterministic fallback to proxy.
// ============================================================================

export function createBinarySend({
  fallbackProxy,
  trace = false
} = {}) {

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

  function computeHash(bits) {
    let h = 0;
    for (let i = 0; i < bits.length; i++) {
      h = (h + bits[i] * (i + 7)) % 65536;
    }
    return `b${h}`;
  }

  function ensurePureBinaryOrFallback(op, bits, reason) {
    if (!isPureBinary(bits)) {
      return fallback(op, bits, reason);
    }
    return bits;
  }

  // ---------------------------------------------------------------------------
  //  SEND (binary → outbound)
  // ---------------------------------------------------------------------------
  function send(bits) {
    const pure = ensurePureBinaryOrFallback("send", bits, "non-binary-output");

    const signature = computeHash(pure);

    if (trace) {
      console.log("[BinarySend-v11] OUT:", pure, "signature:", signature);
    }

    return {
      ok: true,
      bits: pure,
      signature,
      length: pure.length
    };
  }

  // ---------------------------------------------------------------------------
  //  FALLBACK — deterministic, drift-proof
  // ---------------------------------------------------------------------------
  function fallback(op, bits, reason) {
    if (!fallbackProxy) {
      throw new Error(
        `BinarySend fallback triggered (${reason}) but no fallbackProxy provided`
      );
    }

    if (trace) {
      console.warn(`[BinarySend-v11] FALLBACK (${op}):`, reason, bits);
    }

    const result = fallbackProxy.exchange
      ? fallbackProxy.exchange(bits)
      : fallbackProxy(bits);

    return {
      ok: false,
      fallback: true,
      reason,
      bits: result,
      signature: computeHash(Array.isArray(result) ? result : []),
      length: Array.isArray(result) ? result.length : 0
    };
  }

  // ---------------------------------------------------------------------------
  //  PUBLIC API
  // ---------------------------------------------------------------------------
  return {
    send,
    fallback
  };
}
