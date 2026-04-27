// ============================================================================
//  PulseBinaryMesh-v11-Evo (BINARY FULLY UPGRADED BEAST)
//  Pure Binary Pathway Engine • Zero Drift • Zero Semantics
// ============================================================================
//  ROLE:
//    - Binary-native counterpart to PulseMesh-v11-Evo.
//    - Pure connective tissue between binary organs.
//    - No patterns, no lineage, no JSON, no objects in the data path.
//    - Deterministic, drift-proof, mutation-free.
//
//  DIFFERENCE FROM SYMBOLIC PulseMesh:
//    - Symbolic PulseMesh builds pathway surfaces, diagnostics, signatures.
//    - Binary PulseMesh does NONE of that.
//    - It only validates, routes, and falls back.
//    - It is the reflex-level mesh, not the cortex-level mesh.
//
//  BINARY CONTRACT:
//    - Only accepts pure binary arrays (0/1).
//    - No timestamps, no randomness.
//    - No console unless trace=true.
//    - No symbolic metadata.
// ============================================================================

export function createPulseBinaryMesh({
  fallbackProxy,
  trace = false,
  maxBitsLength = 64
} = {}) {

  // Internal link table (symbolic-only, safe)
  const links = Object.create(null);

  // ---------------------------------------------------------------------------
  // PURE BINARY VALIDATION
  // ---------------------------------------------------------------------------
  function isPureBinary(bits) {
    if (!Array.isArray(bits)) return false;
    const len = bits.length;
    if (len === 0 || len > maxBitsLength) return false;
    for (let i = 0; i < len; i++) {
      const b = bits[i];
      if (b !== 0 && b !== 1) return false;
    }
    return true;
  }

  // ---------------------------------------------------------------------------
  // LINK REGISTRATION (symbolic-only)
  // ---------------------------------------------------------------------------
  function link(from, to) {
    links[from] = to;
  }

  // ---------------------------------------------------------------------------
  // PURE BINARY TRANSMISSION
  // ---------------------------------------------------------------------------
  function transmit(from, bits) {
    const to = links[from];

    if (!to) {
      return fallback("missing-link", from, bits);
    }

    if (!isPureBinary(bits)) {
      return fallback("non-binary-input", from, bits);
    }

    if (trace && typeof console !== "undefined") {
      console.log(`[PulseBinaryMesh] ${from} → ${to}`, bits);
    }

    // Binary mesh NEVER transforms bits
    return bits;
  }

  // ---------------------------------------------------------------------------
  // SMART BINARY FALLBACK
  // ---------------------------------------------------------------------------
  function fallback(reason, from, bits) {
    if (!fallbackProxy) {
      throw new Error(
        `PulseBinaryMesh fallback triggered (${reason}) but no fallbackProxy provided`
      );
    }

    if (trace && typeof console !== "undefined") {
      console.warn(`[PulseBinaryMesh] FALLBACK (${reason}) from:${from}`, bits);
    }

    return fallbackProxy.exchange
      ? fallbackProxy.exchange(bits)
      : fallbackProxy(bits);
  }

  // ---------------------------------------------------------------------------
  // PUBLIC API
  // ---------------------------------------------------------------------------
  return {
    link,       // symbolic-only
    transmit,   // pure binary
    fallback    // pure binary
  };
}
