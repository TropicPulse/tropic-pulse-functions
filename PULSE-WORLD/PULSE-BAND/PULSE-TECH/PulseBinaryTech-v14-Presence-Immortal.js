// ============================================================================
// FILE: PulseBinaryTech-v14.0-PRESENCE-IMMORTAL.js
// Pulse OS v14.0-PRESENCE-IMMORTAL — Binary Pulse Engine (Carrier Organ)
// PURE BINARY CARRIER • MULTI-SPIN • IMMORTAL BAND SURFACE • ZERO DRIFT
// ----------------------------------------------------------------------------
// ROLE:
//   • The *raw binary heartbeat* of the organism.
//   • Generates deterministic bit-pattern waveforms.
//   • Provides multi-spin, echo, reflect, burst, deep/slow/fast modes.
//   • Surfaces IMMORTAL metadata (presence/harmonics/band) as passive fields.
//   • NEVER performs routing, scoring, evolution, or compute.
//   • NEVER mutates external state.
//   • ALWAYS deterministic, drift-proof, and safe.
// ----------------------------------------------------------------------------
// SAFETY CONTRACT (v14 IMMORTAL):
//   • Pure binary only — no symbolic logic.
//   • No randomness, no timestamps, no async, no network.
//   • No mutation outside local state.
//   • Fallback escalation: Proxy → Mesh → NodeAdmin.
//   • IMMORTAL metadata is descriptive-only (never affects waveform math).
// ============================================================================

export function createBinaryPulse({
  fallbackProxy,
  fallbackMesh,
  fallbackNode,
  spins = 3,
  trace = false,
  maxBitsLength = 64,

  // IMMORTAL passive metadata (optional)
  presenceBandState = null,
  harmonicDrift = null,
  coherenceScore = null,
  dualBandMode = "binary",     // binary carrier always reports "binary"
  shifterBand = "regular"      // "regular" | "binary" (metadata only)
} = {}) {

  // -------------------------------------------------------------------------
  // INTERNAL STATE — IMMORTAL heartbeat counter
  // -------------------------------------------------------------------------
  let counter = 0;

  // Precomputed phase offsets for multi-spin
  const spinOffsets = Array.from({ length: spins }, (_, i) => i);

  // IMMORTAL metadata snapshot (passive-only)
  const immortalMeta = {
    presenceBandState,
    harmonicDrift,
    coherenceScore,
    dualBandMode,
    shifterBand
  };

  // -------------------------------------------------------------------------
  // SAFETY CONTRACT — PURE BINARY ONLY
  // -------------------------------------------------------------------------
  function isPureBinary(bits) {
    if (!Array.isArray(bits)) return false;
    for (let i = 0; i < bits.length; i++) {
      if (bits[i] !== 0 && bits[i] !== 1) return false;
    }
    return true;
  }

  function isAnomalous(bits) {
    if (!Array.isArray(bits)) return true;
    if (bits.length === 0) return true;
    if (bits.length > maxBitsLength) return true;
    return false;
  }

  function ensurePureBinaryOrFallback(reason, bits) {
    if (!isPureBinary(bits) || isAnomalous(bits)) {
      return fallback(reason, bits);
    }
    return bits;
  }

  // -------------------------------------------------------------------------
  // FALLBACK SYSTEM — IMMORTAL TIERED ESCALATION
  // -------------------------------------------------------------------------
  function fallback(reason, bits) {
    const report = {
      reason,
      bits,
      sequenceId: counter,
      immortalMeta
    };

    if (trace && typeof console !== "undefined") {
      console.warn(`[PulseBinaryPulse IMMORTAL] FALLBACK (${reason})`, report);
    }

    // Tier 1 — Local proxy guardian
    if (fallbackProxy?.exchange) return fallbackProxy.exchange(bits, reason, report);

    // Tier 2 — Mesh guardian
    if (fallbackMesh?.exchange) return fallbackMesh.exchange(bits, reason, report);

    // Tier 3 — NodeAdmin (ultimate authority)
    if (fallbackNode?.exchange) return fallbackNode.exchange(bits, reason, report);

    throw new Error(
      `PulseBinaryPulse fallback triggered (${reason}) with no handlers`
    );
  }

  // -------------------------------------------------------------------------
  // CORE BINARY GENERATOR — PURE COUNTER → BITS
  // -------------------------------------------------------------------------
  function generateBits(n) {
    return n.toString(2).split("").map(Number);
  }

  // -------------------------------------------------------------------------
  // BITWISE HELPERS — PURE, DETERMINISTIC
  // -------------------------------------------------------------------------
  function xorBits(a, b) {
    const len = Math.min(a.length, b.length);
    const out = new Array(len);
    for (let i = 0; i < len; i++) out[i] = a[i] ^ b[i];
    return out;
  }

  function rotateBits(bits, shift) {
    const n = bits.length;
    if (n === 0) return [];
    const out = new Array(n);
    const s = ((shift % n) + n) % n;
    for (let i = 0; i < n; i++) {
      out[(i + s) % n] = bits[i];
    }
    return out;
  }

  function invertBits(bits) {
    const out = new Array(bits.length);
    for (let i = 0; i < bits.length; i++) {
      out[i] = bits[i] === 0 ? 1 : 0;
    }
    return out;
  }

  // -------------------------------------------------------------------------
  // MULTI-SPIN — IMMORTAL PHASE LANE GENERATOR
  // -------------------------------------------------------------------------
  function generateMultiSpin(bits) {
    if (!bits.length) return [];

    const out = [];

    for (let i = 0; i < spinOffsets.length; i++) {
      const offset = spinOffsets[i];

      const rotated = rotateBits(bits, offset);
      const xorred  = xorBits(bits, rotated);

      const shifted = xorred.map((b, idx) =>
        ((idx + offset) % 2 === 0) ? b : (b ^ 1)
      );

      out.push(shifted);
    }

    return out;
  }

  // -------------------------------------------------------------------------
  // WRAPPER — IMMORTAL METADATA + MODE TAG
  // -------------------------------------------------------------------------
  function wrap(mode, bitsOrMulti) {
    return {
      mode,
      sequenceId: counter,
      payload: bitsOrMulti,

      // IMMORTAL metadata surfaced to higher layers
      presenceBandState: immortalMeta.presenceBandState,
      harmonicDrift: immortalMeta.harmonicDrift,
      coherenceScore: immortalMeta.coherenceScore,
      dualBandMode: immortalMeta.dualBandMode,
      shifterBand: immortalMeta.shifterBand
    };
  }

  // -------------------------------------------------------------------------
  // PULSE MODES — PURE BINARY WAVEFORMS
  // -------------------------------------------------------------------------
  function nextPulse() {
    counter++;
    const bits = ensurePureBinaryOrFallback("invalid-base", generateBits(counter));
    if (trace) console.log("[PulseBinaryPulse IMMORTAL] BASE:", bits);
    return wrap("base", bits);
  }

  function nextPulseFast() {
    counter++;
    const bits = ensurePureBinaryOrFallback("invalid-fast", generateBits(counter));
    if (trace) console.log("[PulseBinaryPulse IMMORTAL] FAST:", bits);
    return wrap("fast", bits);
  }

  function nextPulseSlow() {
    counter += 0.25;
    const bits = ensurePureBinaryOrFallback("invalid-slow", generateBits(Math.floor(counter)));
    if (trace) console.log("[PulseBinaryPulse IMMORTAL] SLOW:", bits);
    return wrap("slow", bits);
  }

  function nextPulseDeep() {
    counter += 0.05;
    const bits = ensurePureBinaryOrFallback("invalid-deep", generateBits(Math.floor(counter)));
    if (trace) console.log("[PulseBinaryPulse IMMORTAL] DEEP:", bits);
    return wrap("deep", bits);
  }

  function nextPulseMulti() {
    counter++;
    const bits = ensurePureBinaryOrFallback("invalid-multi", generateBits(counter));
    const multi = generateMultiSpin(bits);
    if (trace) console.log("[PulseBinaryPulse IMMORTAL] MULTI:", multi);
    return wrap("multi", multi);
  }

  function nextPulseEcho() {
    counter++;
    const bits = ensurePureBinaryOrFallback("invalid-echo", generateBits(counter));
    if (trace) console.log("[PulseBinaryPulse IMMORTAL] ECHO:", bits);
    return wrap("echo", bits);
  }

  function nextPulseReflect() {
    counter++;
    const bits = ensurePureBinaryOrFallback("invalid-reflect", generateBits(counter));
    const inverted = invertBits(bits);
    if (trace) console.log("[PulseBinaryPulse IMMORTAL] REFLECT:", inverted);
    return wrap("reflect", inverted);
  }

  function nextPulseBurst() {
    counter++;
    const base = ensurePureBinaryOrFallback("invalid-burst", generateBits(counter));
    const burst = [base, invertBits(base), rotateBits(base, 1)];
    if (trace) console.log("[PulseBinaryPulse IMMORTAL] BURST:", burst);
    return wrap("burst", burst);
  }

  // -------------------------------------------------------------------------
  // PUBLIC API — IMMORTAL BINARY CARRIER ORGAN
  // -------------------------------------------------------------------------
  return {
    nextPulse,
    nextPulseFast,
    nextPulseSlow,
    nextPulseDeep,
    nextPulseMulti,
    nextPulseEcho,
    nextPulseReflect,
    nextPulseBurst,
    fallback,

    // IMMORTAL metadata surface
    immortalMeta
  };
}
