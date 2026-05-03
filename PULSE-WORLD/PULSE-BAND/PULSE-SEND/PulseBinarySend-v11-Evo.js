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
/*
AI_EXPERIENCE_META = {
  identity: "PulseBinarySend",
  version: "v14-EVO-IMMORTAL",
  layer: "frontend",
  role: "binary_send_engine",
  lineage: "PulseOS-v12",

  evo: {
    binaryCore: true,
    immortalBand: true,
    dualBand: true,
    chunkAligned: true,
    presenceAware: true,
    safeRouteFree: true,
    deterministic: true
  },

  contract: {
    always: [
      "PulseBinaryPulse",
      "PulseBinaryTech",
      "PulseSendAdapter",
      "PulsePresence",
      "PulseChunks"
    ],
    never: [
      "legacyBinarySend",
      "legacySend",
      "safeRoute",
      "fetchViaCNS",
      "legacyChunker"
    ]
  }
}
*/

// --- Evolution Engines ------------------------------------------------------
import {createPulseV2 as PulseV2EvolutionEngine }  from "./PulseV2EvolutionEngine-v11-Evo.js";
import {createPulseV3 as PulseV3UnifiedOrganism }  from "./PulseV3UnifiedOrganism-v11-Evo.js";

// --- Impulse Layer ----------------------------------------------------------
import {createPulseSendImpulse as PulseSendImpulse }        from "./PulseSendImpulse-v11-Evo.js";

// --- Legacy Pulse Layer -----------------------------------------------------
import {createLegacyPulse as PulseSendLegacyPulse }    from "./PulseSendLegacyPulse-v11-Evo.js";

// --- Adapter Layer ----------------------------------------------------------
import {adaptPulseSendPacket as PulseSendAdapter }        from "./PulseSendAdapter.js";

// --- Engine Layer -----------------------------------------------------------
import {PulseSendMover as PulseSendEngine }         from "./PulseSendEngine.js";

// --- Return Layer -----------------------------------------------------------
import {createPulseSendReturn as PulseSendReturn }         from "./PulseSendReturn.js";

// --- System Layer (Final Conductor) ----------------------------------------
import {createPulseSendSystem as PulseSendSystem }         from "./PulseSendSystem.js";

// ============================================================================
// ⭐ Pulse Intelligence (logic-only, IMMORTAL-safe)
// ============================================================================
function computePulseIntelligence({ advantageField, presenceField, factoringSignal, band }) {
  const advantageScore = advantageField.advantageScore || 0;
  const advantageTier  = advantageField.advantageTier  || 0;

  const presenceTier = presenceField.presenceTier || "idle";
  const presenceWeight =
    presenceTier === "critical" ? 1.0 :
    presenceTier === "high"     ? 0.8 :
    presenceTier === "elevated" ? 0.6 :
    presenceTier === "soft"     ? 0.4 :
    0.2;

  const factoring = factoringSignal ? 1 : 0;
  const bandIsBinary = band === "binary" ? 1 : 0;

  const solvednessScore = Math.max(
    0,
    Math.min(
      advantageScore * 10 * 0.5 +
      presenceWeight * 0.3 +
      factoring * 0.2,
      1
    )
  );

  const computeTier =
    solvednessScore >= 0.9 ? "nearSolution" :
    solvednessScore >= 0.7 ? "highValue"    :
    solvednessScore >= 0.4 ? "normal"       :
    solvednessScore >= 0.2 ? "lowPriority"  :
    "avoidCompute";

  const readinessScore = Math.max(
    0,
    Math.min(
      solvednessScore * 0.6 +
      (bandIsBinary ? 0.2 : 0) +
      (advantageTier >= 2 ? 0.2 : advantageTier === 1 ? 0.1 : 0),
      1
    )
  );

  return {
    solvednessScore,
    factoringSignal: factoring ? "high" : "low",
    computeTier,
    readinessScore,
    band,
    advantageTier
  };
}

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
  // ⭐ v14.4 IMMORTAL-INTEL — binary-safe intelligence
  // ---------------------------------------------------------------------------
  function computeBinaryIntelligence(bits) {
    const len = bits.length;

    const ones = bits.reduce((a, b) => a + b, 0);
    const density = len > 0 ? ones / len : 0;

    const parity = ones % 2 === 0 ? "even" : "odd";

    const shiftDepth = len > 0 ? (bits[0] === 1 ? 1 : 0) : 0;

    const cacheChunk = computeCacheChunk(bits);
    const prewarm = computePrewarm(bits);
    const presence = computePresence(bits);
    const signature = computeSignature(bits);

    const solvednessScore = Math.min(1, density * 0.6 + (shiftDepth ? 0.2 : 0) + (len > 256 ? 0.2 : 0));

    const computeTier =
      solvednessScore >= 0.9 ? "nearSolution" :
      solvednessScore >= 0.7 ? "highValue"    :
      solvednessScore >= 0.4 ? "normal"       :
      solvednessScore >= 0.2 ? "lowPriority"  :
      "avoidCompute";

    const readinessScore = Math.min(1, solvednessScore * 0.7 + (parity === "even" ? 0.1 : 0));

    return {
      solvednessScore,
      computeTier,
      readinessScore,
      parity,
      density,
      shiftDepth,
      cacheChunk,
      prewarm,
      presence,
      signature,
      length: len
    };
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
  //  INTERNAL: USE ALL IMPORTS (12.3+ integration surfaces)
  // ---------------------------------------------------------------------------
  function runTechSurfaces(bits) {

    const v2 = PulseV2EvolutionEngine?.createPulseV2
      ? PulseV2EvolutionEngine.createPulseV2({ bits })
      : null;

    const v3 = PulseV3UnifiedOrganism?.createPulseV3
      ? PulseV3UnifiedOrganism.createPulseV3({ bits })
      : null;

    const impulse = PulseSendImpulse?.createImpulse
      ? PulseSendImpulse.createImpulse(bits)
      : null;

    const legacy = PulseSendLegacyPulse?.createLegacyPulse
      ? PulseSendLegacyPulse.createLegacyPulse(bits)
      : null;

    const adapter = PulseSendAdapter?.adapt
      ? PulseSendAdapter.adapt(bits)
      : null;

    const engine = PulseSendEngine?.engine
      ? PulseSendEngine.engine(bits)
      : null;

    const ret = PulseSendReturn?.ret
      ? PulseSendReturn.ret(bits)
      : null;

    const system = PulseSendSystem?.conduct
      ? PulseSendSystem.conduct(bits)
      : null;

    return {
      v2,
      v3,
      impulse,
      legacy,
      adapter,
      engine,
      ret,
      system
    };
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

    const tech = runTechSurfaces(pure);

    // ⭐ v14.4 intelligence
    const pulseIntelligence = computeBinaryIntelligence(pure);

    if (trace) {
      console.log("[BinarySend-v14.4] OUT:", pure, {
        signature,
        cacheChunk,
        prewarm,
        presence,
        tech,
        pulseIntelligence
      });
    }

    return {
      ok: true,
      bits: pure,
      signature,
      cacheChunk,
      prewarm,
      presence,
      tech,
      pulseIntelligence,
      pulseIntelligenceSignature: computeSignature(pure),
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
      console.warn(`[BinarySend-v14.4] FALLBACK (${op}):`, reason, bits);
    }

    const result = fallbackProxy.exchange
      ? fallbackProxy.exchange(bits)
      : fallbackProxy(bits);

    const safe = Array.isArray(result) ? result : [];

    const tech = runTechSurfaces(safe);

    const pulseIntelligence = computeBinaryIntelligence(safe);

    return {
      ok: false,
      fallback: true,
      reason,
      bits: safe,
      signature: computeSignature(safe),
      cacheChunk: computeCacheChunk(safe),
      prewarm: computePrewarm(safe),
      presence: computePresence(safe),
      tech,
      pulseIntelligence,
      pulseIntelligenceSignature: computeSignature(safe),
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
