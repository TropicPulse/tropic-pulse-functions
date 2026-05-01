
export function createBinaryPulse({
  fallbackProxy,
  fallbackMesh,
  fallbackNode,
  spins = 3,
  trace = false,
  maxBitsLength = 64 // soft guardrail for anomaly detection
} = {}) {
  // -------------------------------------------------------------------------
  // INTERNAL STATE
  // -------------------------------------------------------------------------
  // Logical counter: this is the "heartbeat index".
  // It is intentionally simple and deterministic.
  let counter = 0;

  // Precompute spin offsets (phase indices, not angles).
  // These represent logical "phase shifts" for multi-spin pulses.
  const spinOffsets = Array.from({ length: spins }, (_, i) => i);

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
  // CORE PULSE GENERATOR — PURE BINARY COUNTER
  // -------------------------------------------------------------------------
  // This is the "raw carrier": a simple binary representation of the counter.
  // Higher layers (Pulse v3, Router, Earn, etc.) interpret these sequences
  // as logical waveforms, not as semantic messages.
  function generateBits(n) {
    const bits = n.toString(2).split("").map(Number);
    return bits;
  }

  // -------------------------------------------------------------------------
  // BITWISE HELPERS
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
      const b = bits[i];
      out[i] = b === 0 ? 1 : 0;
    }
    return out;
  }

  // -------------------------------------------------------------------------
  // FALLBACK SYSTEM — TIERED
  // -------------------------------------------------------------------------
  // If anything violates the binary contract, we escalate to:
  //   1) Proxy (local guardian)
  //   2) Mesh (cluster-level guardian)
  //   3) NodeAdmin (ultimate authority)
  //
  // This mirrors how real networks escalate from local retry → mesh routing
  // → control-plane intervention, but kept purely logical here.
  function fallback(reason, bits) {
    if (trace && typeof console !== "undefined") {
      console.warn(`[PulseBinaryTech] FALLBACK (${reason})`, bits);
    }

    if (fallbackProxy?.exchange) return fallbackProxy.exchange(bits, reason);
    if (fallbackMesh?.exchange)  return fallbackMesh.exchange(bits, reason);
    if (fallbackNode?.exchange)  return fallbackNode.exchange(bits, reason);

    throw new Error(
      `PulseBinaryTech fallback triggered (${reason}) but no fallback handlers provided`
    );
  }

  // -------------------------------------------------------------------------
  // MULTI-SPIN PULSE GENERATOR
  // -------------------------------------------------------------------------
  // Multi-spin simulates multiple "phase lanes" of the same logical carrier.
  // Conceptually similar to:
  //   - multiple RF subcarriers,
  //   - MIMO streams,
  //   - or phased-array beams,
  // but kept purely in the binary domain.
  function generateMultiSpin(bits) {
    if (!bits.length) return [];

    const out = [];

    for (let i = 0; i < spinOffsets.length; i++) {
      const offset = spinOffsets[i];

      // XOR + rotate + phase-like index shift
      const rotated = rotateBits(bits, offset);
      const xorred = xorBits(bits, rotated);

      // Phase shift = invert every other bit based on index + offset
      const shifted = xorred.map((b, idx) =>
        ((idx + offset) % 2 === 0) ? b : (b ^ 1)
      );

      out.push(shifted);
    }

    return out;
  }

  // -------------------------------------------------------------------------
  // INTERNAL HELPERS — MODE WRAPPER
  // -------------------------------------------------------------------------
  // All public modes return a structured object so higher layers can:
  //   - tag mode,
  //   - track sequenceId,
  //   - inspect raw bits,
  //   - map to RF / transport as needed.
  function wrap(mode, bitsOrMulti) {
    return {
      mode,              // "base" | "fast" | "slow" | "deep" | "multi" | "echo" | "reflect" | "burst"
      sequenceId: counter,
      payload: bitsOrMulti
    };
  }

  // -------------------------------------------------------------------------
  // PULSE MODES
  // -------------------------------------------------------------------------
  // These are logical "frequency profiles" and transformations, not real RF.
  // They define how quickly the counter advances and how the bits are shaped.

  // BASE — standard step
  function nextPulse() {
    counter++;
    const bits = ensurePureBinaryOrFallback(
      "invalid-base-pulse",
      generateBits(counter)
    );
    if (trace && typeof console !== "undefined") {
      console.log("[PulseBinaryTech] BASE:", bits);
    }
    return wrap("base", bits);
  }

  // FAST — high frequency, shallow scan
  function nextPulseFast() {
    counter++;
    const bits = ensurePureBinaryOrFallback(
      "invalid-fast-pulse",
      generateBits(counter)
    );
    if (trace && typeof console !== "undefined") {
      console.log("[PulseBinaryTech] FAST:", bits);
    }
    return wrap("fast", bits);
  }

  // SLOW — low frequency, deep scan
  function nextPulseSlow() {
    counter += 0.25;
    const bits = ensurePureBinaryOrFallback(
      "invalid-slow-pulse",
      generateBits(Math.floor(counter))
    );
    if (trace && typeof console !== "undefined") {
      console.log("[PulseBinaryTech] SLOW:", bits);
    }
    return wrap("slow", bits);
  }

  // DEEP — ultra slow, maximum detail
  function nextPulseDeep() {
    counter += 0.05;
    const bits = ensurePureBinaryOrFallback(
      "invalid-deep-pulse",
      generateBits(Math.floor(counter))
    );
    if (trace && typeof console !== "undefined") {
      console.log("[PulseBinaryTech] DEEP:", bits);
    }
    return wrap("deep", bits);
  }

  // MULTI-SPIN — multiple phase-offset pulses
  function nextPulseMulti() {
    counter++;
    const bits = ensurePureBinaryOrFallback(
      "invalid-multi-pulse",
      generateBits(counter)
    );

    const multi = generateMultiSpin(bits);
    if (trace && typeof console !== "undefined") {
      console.log("[PulseBinaryTech] MULTI:", multi);
    }
    return wrap("multi", multi);
  }

  // ECHO — reflect bits back unchanged
  function nextPulseEcho() {
    counter++;
    const bits = ensurePureBinaryOrFallback(
      "invalid-echo-pulse",
      generateBits(counter)
    );
    if (trace && typeof console !== "undefined") {
      console.log("[PulseBinaryTech] ECHO:", bits);
    }
    return wrap("echo", bits);
  }

  // REFLECT — invert bits
  function nextPulseReflect() {
    counter++;
    const bits = ensurePureBinaryOrFallback(
      "invalid-reflect-pulse",
      generateBits(counter)
    );

    const inverted = invertBits(bits);
    if (trace && typeof console !== "undefined") {
      console.log("[PulseBinaryTech] REFLECT:", inverted);
    }
    return wrap("reflect", inverted);
  }

  // BURST — pulse train (3 pulses)
  function nextPulseBurst() {
    counter++;
    const base = ensurePureBinaryOrFallback(
      "invalid-burst-pulse",
      generateBits(counter)
    );

    const burst = [
      base,
      invertBits(base),
      rotateBits(base, 1)
    ];

    if (trace && typeof console !== "undefined") {
      console.log("[PulseBinaryTech] BURST:", burst);
    }
    return wrap("burst", burst);
  }

  // -------------------------------------------------------------------------
  // PUBLIC API
  // -------------------------------------------------------------------------
  // Higher layers (Pulse v3, Router, Earn, OS network stack) treat this as:
  //   - a deterministic binary carrier engine,
  //   - a source of shaped bit patterns,
  //   - a logical "waveform" generator that can be mapped onto:
  //       * Wi-Fi frames,
  //       * cellular packets,
  //       * mesh messages,
  //       * or purely internal OS signals.
  return {
    nextPulse,
    nextPulseFast,
    nextPulseSlow,
    nextPulseDeep,
    nextPulseMulti,
    nextPulseEcho,
    nextPulseReflect,
    nextPulseBurst,
    fallback
  };
}
