// ============================================================================
//  BinaryRouter-v11-PURE-EVO-Binary.js
//  PURE BINARY ROUTER — v11-EVO-BINARY EDITION
// ============================================================================
//  ROLE:
//    - Route ONLY pure binary arrays (0/1).
//    - Deterministic binary → binary routing.
//    - No symbolic routing, no names, no patterns.
//    - No JSON, no objects, no strings (except internal ops).
//    - No lineage, no ancestry, no evolution logic.
//    - No drift, no randomness, no mutation.
//    - Binary-aware: emits binary diagnostics + signatures.
//    - Fallback-safe: deterministic fallback to proxy.
// ============================================================================

export function createBinaryRouter({
  handlers = [],      // array of pure binary handlers
  fallbackProxy,      // BinaryProxy or PulseProxy-v11-Evo
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
      h = (h + bits[i] * (i + 11)) % 65536;
    }
    return `br${h}`;
  }

  function ensurePureBinaryOrFallback(op, bits, reason) {
    if (!isPureBinary(bits)) {
      return fallback(op, bits, reason);
    }
    return bits;
  }

  // ---------------------------------------------------------------------------
  //  REGISTER HANDLER (binary → binary)
  // ---------------------------------------------------------------------------
  function register(handler) {
    handlers.push(handler);
  }

  // ---------------------------------------------------------------------------
  //  ROUTE (binary → binary)
  // ---------------------------------------------------------------------------
  function route(bits) {
    const pure = ensurePureBinaryOrFallback("route", bits, "non-binary-input");

    if (handlers.length === 0) {
      return fallback("no-handlers", pure, "empty-handler-list");
    }

    try {
      // Deterministic handler selection:
      // Use binary sum mod handler count.
      const sum = pure.reduce((a, b) => a + b, 0);
      const index = sum % handlers.length;

      const handler = handlers[index];
      const out = handler(pure);

      const pureOut = ensurePureBinaryOrFallback(
        "route",
        out,
        "non-binary-output"
      );

      const signature = computeHash(pureOut);

      if (trace) {
        console.log("[BinaryRouter-v11] ROUTE:", pure, "→", pureOut, "sig:", signature);
      }

      return {
        ok: true,
        bits: pureOut,
        signature,
        handlerIndex: index,
        length: pureOut.length
      };

    } catch (err) {
      return fallback("handler-error", pure, "exception");
    }
  }

  // ---------------------------------------------------------------------------
  //  FALLBACK — deterministic, drift-proof
  // ---------------------------------------------------------------------------
  function fallback(op, bits, reason) {
    if (!fallbackProxy) {
      throw new Error(
        `BinaryRouter fallback triggered (${reason}) but no fallbackProxy provided`
      );
    }

    if (trace) {
      console.warn(`[BinaryRouter-v11] FALLBACK (${op}):`, reason, bits);
    }

    const result = fallbackProxy.exchange
      ? fallbackProxy.exchange(bits)
      : fallbackProxy(bits);

    const signature = computeHash(Array.isArray(result) ? result : []);

    return {
      ok: false,
      fallback: true,
      reason,
      bits: result,
      signature,
      length: Array.isArray(result) ? result.length : 0
    };
  }

  // ---------------------------------------------------------------------------
  //  PUBLIC API
  // ---------------------------------------------------------------------------
  return {
    register,
    route,
    fallback
  };
}
