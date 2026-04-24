// ============================================================================
//  BinaryMesh-v11-PURE-EVO.js (BINARY FULLY UPGRADED BEAST)
//  FIRST-EVER PURE BINARY MESH WITH SMART FALLBACKS
// ============================================================================
//  ROLE:
//    - Pure binary connective tissue between binary organs.
//    - Zero symbolic logic. Zero JSON. Zero objects in the data path.
//    - No patterns. No lineage. No mesh hints.
//    - Deterministic, drift-proof, mutation-free.
//
//  BINARY CONTRACT:
//    - Only accepts pure binary arrays (0/1).
//    - No strings in the data path.
//    - No timestamps, no randomness.
//    - No console unless trace=true (shell-only).
//
//  NEW (v11-EVO):
//    - Tier-aware fallback (BinaryProxy → PulseProxy-v11-Evo).
//    - Binary anomaly detection (empty, non-binary, oversized).
//    - Deterministic link routing.
//    - First-ever binary safety contract.
// ============================================================================

export function createBinaryMesh({
  fallbackProxy,   // BinaryProxy or PulseProxy-v11-Evo
  trace = false,
  maxBitsLength = 64 // anomaly guardrail
} = {}) {

  // Internal link table (symbolic, but NOT in data path)
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
  // LINK REGISTRATION (symbolic, safe)
  // ---------------------------------------------------------------------------
  function link(from, to) {
    // symbolic only — not part of binary data path
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
      console.log(`[BinaryMesh] ${from} → ${to}`, bits);
    }

    // Mesh NEVER transforms bits — pure connective tissue
    return bits;
  }

  // ---------------------------------------------------------------------------
  // SMART BINARY FALLBACK
  // ---------------------------------------------------------------------------
  function fallback(reason, from, bits) {
    if (!fallbackProxy) {
      throw new Error(
        `BinaryMesh fallback triggered (${reason}) but no fallbackProxy provided`
      );
    }

    if (trace && typeof console !== "undefined") {
      console.warn(`[BinaryMesh] FALLBACK (${reason}) from:${from}`, bits);
    }

    // BinaryProxy.exchange(bits) OR fallbackProxy(bits)
    return fallbackProxy.exchange
      ? fallbackProxy.exchange(bits)
      : fallbackProxy(bits);
  }

  // ---------------------------------------------------------------------------
  // PUBLIC API (binary-safe)
  // ---------------------------------------------------------------------------
  return {
    link,       // symbolic-only
    transmit,   // pure binary
    fallback    // pure binary
  };
}
