// ============================================================================
//  BinarySend-v12.3-PURE-EVO-Binary.js
//  PURE BINARY SEND ORGAN — v12.3 EVO BINARY EDITION
// ============================================================================
//  ROLE:
//    - Accept ONLY pure binary arrays (0/1).
//    - Deterministic outbound binary channel.
//    - No JSON, no objects, no strings (except internal ops).
//    - No lineage, no pattern, no routing hints.
//    - No drift, no randomness, no mutation.
//    - Binary-aware: emits binary diagnostics + signatures.
//    - 12.3+: cacheChunk-aware, prewarm-aware, presence-aware.
//    - Fallback-safe: deterministic fallback to proxy.
// ============================================================================
// --- Evolution Engines ------------------------------------------------------
import * as PulseV2EvolutionEngine   from "./PulseV2EvolutionEngine-v11-Evo.js";
import * as PulseV3UnifiedOrganism   from "./PulseV3UnifiedOrganism-v11-Evo.js";

// --- Impulse Layer ----------------------------------------------------------
import * as PulseSendImpulse         from "./PulseSendImpulse-v11-Evo.js";

// --- Legacy Pulse Layer -----------------------------------------------------
import * as PulseSendLegacyPulse     from "./PulseSendLegacyPulse-v11-Evo.js";

// --- Adapter Layer ----------------------------------------------------------
import * as PulseSendAdapter         from "./PulseSendAdapter.js";

// --- Engine Layer -----------------------------------------------------------
import * as PulseSendEngine          from "./PulseSendEngine.js";

// --- Return Layer -----------------------------------------------------------
import * as PulseSendReturn          from "./PulseSendReturn.js";

// --- System Layer (Final Conductor) ----------------------------------------
import * as PulseSendSystem          from "./PulseSendSystem.js";

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

  // ---------------------------------------------------------------------------
  //  12.3+: deterministic binary signature (dual-band safe)
  // ---------------------------------------------------------------------------
  function computeSignature(bits) {
    let h = 0;
    for (let i = 0; i < bits.length; i++) {
      h = (h + bits[i] * (i + 13)) % 131072; // 17-bit deterministic
    }
    return `b12_${h}`;
  }

  // ---------------------------------------------------------------------------
  //  12.3+: cacheChunk fingerprint (binary-only)
  // ---------------------------------------------------------------------------
  function computeCacheChunk(bits) {
    let acc = 1;
    for (let i = 0; i < bits.length; i++) {
      acc = (acc * 31 + bits[i]) % 8191;
    }
    return `cc_${acc}`;
  }

  // ---------------------------------------------------------------------------
  //  12.3+: prewarm hint (binary-only)
  // ---------------------------------------------------------------------------
  function computePrewarm(bits) {
    if (bits.length >= 512) return "prewarm-aggressive";
    if (bits.length >= 128) return "prewarm-medium";
    if (bits.length >= 32)  return "prewarm-light";
    return "prewarm-none";
  }

  // ---------------------------------------------------------------------------
  //  12.3+: presence scope (binary-only)
  // ---------------------------------------------------------------------------
  function computePresence(bits) {
    const len = bits.length;
    if (len >= 1024) return "presence-global";
    if (len >= 256)  return "presence-page";
    return "presence-local";
  }

  // ---------------------------------------------------------------------------
  //  INTERNAL: ensure pure binary or fallback
  // ---------------------------------------------------------------------------
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

    const signature   = computeSignature(pure);
    const cacheChunk  = computeCacheChunk(pure);
    const prewarm     = computePrewarm(pure);
    const presence    = computePresence(pure);

    if (trace) {
      console.log("[BinarySend-v12.3] OUT:", pure, {
        signature,
        cacheChunk,
        prewarm,
        presence
      });
    }

    return {
      ok: true,
      bits: pure,
      signature,
      cacheChunk,
      prewarm,
      presence,
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
      console.warn(`[BinarySend-v12.3] FALLBACK (${op}):`, reason, bits);
    }

    const result = fallbackProxy.exchange
      ? fallbackProxy.exchange(bits)
      : fallbackProxy(bits);

    const safe = Array.isArray(result) ? result : [];

    return {
      ok: false,
      fallback: true,
      reason,
      bits: safe,
      signature: computeSignature(safe),
      cacheChunk: computeCacheChunk(safe),
      prewarm: computePrewarm(safe),
      presence: computePresence(safe),
      length: safe.length
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
