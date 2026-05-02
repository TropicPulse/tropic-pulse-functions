// ============================================================================
// FILE: PulseBinaryTech-v14.4-PRESENCE-IMMORTAL.js
// Pulse OS v14.4-PRESENCE-IMMORTAL — Unified Binary Carrier Organ
// PURE BINARY WAVEFORM • MULTI-PULSE SURFACE • SHIFTER/V2/V3/LEGACY/SEND/EARN/IMMORTAL
// ============================================================================
// ROLE:
//   • Root binary heartbeat for the organism.
//   • Generates deterministic bit patterns (base/fast/slow/deep/multi/echo/reflect/burst).
//   • For each waveform, invokes ALL pulse families:
//       - v1 Legacy
//       - v2 Evolution Engine (shifter-tech + earn-regular)
//       - v3 Continuance / Unified
//       - Binary Shifter
//       - Shifter Evolution (via v2 core)
//       - Presence
//       - Harmonics
//       - Coherence
//       - Band (dual-band)
//       - Continuance (long-form)
//       - SendLegacy (send surface only, no IO)
//       - SendEarn (earn/send surface only, no IO)
//       - NormalPulse (baseline symbolic surface)
//   • Returns a unified carrier packet with all surfaces attached.
//   • Binary math stays pure; all pulse engines are consumers only.
//   • No randomness, no time, no IO, no network.
// ============================================================================
/*
AI_EXPERIENCE_META = {
  identity: "PulseBinaryTech",
  version: "v14.4-PRESENCE-IMMORTAL",
  layer: "frontend",
  role: "binary_tech_engine",
  lineage: "PulseOS-v12",

  evo: {
    binaryCore: true,
    immortalBand: true,
    dualBand: true,
    presenceAware: true,
    chunkAligned: true,
    safeRouteFree: true,
    cnsAligned: true,
    advantageV2: true,
    multiPulseFamily: true,
    noInlineBuilders: true
  },

  contract: {
    always: [
      "PulseBinaryPulse",
      "PulseBinaryShifter",
      "PulseBinaryEarn",
      "PulsePresence",
      "PulseChunks",
      "PulseSend",
      "PulseWindow"
    ],
    never: [
      "legacyBinaryTech",
      "legacyBinaryPulse",
      "legacyPresence",
      "safeRoute",
      "fetchViaCNS",
      "legacyChunker",
      "legacyFallback"
    ]
  }
}
*/

// ---------------------------------------------------------------------------
// IMPORTS — adjust paths to match your repo layout
// ---------------------------------------------------------------------------

// v2 Evolution Engine core (shifter-side v2)
import { createPulseV2 as createPulseV2Shifter } from "../PULSE-SHIFTER/PulseShifterEvolutionaryPulse-v11-Evo.js";

// Binary Shifter Evolutionary Pulse front-end
import { createPulseBinaryShifterEvolutionaryPulse } from "../PULSE-SHIFTER/PulseBinaryShifterEvolutionaryPulse-v11-Evo.js";

// v1 Legacy Pulse surface (Pulse-SEND)
import { createLegacyPulse as createPulseV1Legacy } from "../PULSE-SEND/PulseSendLegacyPulse-v11-Evo.js";

// v3 Continuance Pulse surface
import { PulseEarnContinuancePulse as createPulseV3Continuance } from "../PULSE-EARN/PulseEarnContinuancePulse-v12.3-Presence.js";

// v2 Evolution Engine (earn-side v2)
import { createPulseV2 as createPulseV2Earn } from "../PULSE-SEND/PulseV2EvolutionEngine-v11-Evo.js";

// v3 Unified organism pulse
import { createPulseV3 } from "../PULSE-SEND/PulseV3UnifiedOrganism-v11-Evo.js";


// ---------------------------------------------------------------------------
// INLINE PULSE SURFACES
// ---------------------------------------------------------------------------

// Presence / Harmonics / Coherence / Band / Continuance pulses
function createPresencePulse() {
  return function surfacePresence({ bits, mode, sequenceId, immortalMeta }) {
    const len = Array.isArray(bits) ? bits.length : 0;
    return {
      type: "PulsePresence-v14",
      mode,
      sequenceId,
      bitsLength: len,
      presenceBandState: immortalMeta?.presenceBandState ?? null
    };
  };
}

function createHarmonicsPulse() {
  return function surfaceHarmonics({ bits, mode, sequenceId, immortalMeta }) {
    const len = Array.isArray(bits) ? bits.length : 0;
    return {
      type: "PulseHarmonics-v14",
      mode,
      sequenceId,
      bitsLength: len,
      harmonicDrift: immortalMeta?.harmonicDrift ?? null
    };
  };
}

function createCoherencePulse() {
  return function surfaceCoherence({ bits, mode, sequenceId, immortalMeta }) {
    const len = Array.isArray(bits) ? bits.length : 0;
    return {
      type: "PulseCoherence-v14",
      mode,
      sequenceId,
      bitsLength: len,
      coherenceScore: immortalMeta?.coherenceScore ?? null
    };
  };
}

function createBandPulse() {
  return function surfaceBand({ bits, mode, sequenceId, immortalMeta }) {
    const len = Array.isArray(bits) ? bits.length : 0;
    return {
      type: "PulseBand-v14",
      mode,
      sequenceId,
      bitsLength: len,
      dualBandMode: immortalMeta?.dualBandMode ?? "binary",
      shifterBand: immortalMeta?.shifterBand ?? "regular"
    };
  };
}

function createContinuancePulse() {
  return function surfaceContinuance({ bits, mode, sequenceId, immortalMeta }) {
    const len = Array.isArray(bits) ? bits.length : 0;
    return {
      type: "PulseContinuance-v14",
      mode,
      sequenceId,
      bitsLength: len,
      continuitySignature: `cont-${sequenceId}-${len}`,
      presenceBandState: immortalMeta?.presenceBandState ?? null
    };
  };
}

// SendLegacy / SendEarn / NormalPulse surfaces (NO IO)
function createSendLegacyPulse() {
  return function surfaceSendLegacy({ bits, mode, sequenceId, v2Pulse, immortalMeta }) {
    const len = Array.isArray(bits) ? bits.length : 0;
    return {
      type: "PulseSendLegacy-v14",
      mode,
      sequenceId,
      bitsLength: len,
      sendIntent: "legacy",
      healthScore: v2Pulse?.healthScore ?? null,
      tier: v2Pulse?.tier ?? null,
      presenceBandState: immortalMeta?.presenceBandState ?? null
    };
  };
}

function createSendEarnPulse() {
  return function surfaceSendEarn({ bits, mode, sequenceId, v2Pulse, immortalMeta }) {
    const len = Array.isArray(bits) ? bits.length : 0;
    return {
      type: "PulseSendEarn-v14",
      mode,
      sequenceId,
      bitsLength: len,
      sendIntent: "earn",
      advantageField: v2Pulse?.advantageField ?? null,
      healthScore: v2Pulse?.healthScore ?? null,
      coherenceScore: immortalMeta?.coherenceScore ?? null
    };
  };
}

function createNormalPulseSurface() {
  return function surfaceNormal({ bits, mode, sequenceId }) {
    const len = Array.isArray(bits) ? bits.length : 0;
    return {
      type: "PulseNormal-v14",
      mode,
      sequenceId,
      bitsLength: len,
      baselineScore: Math.min(len / 32, 1)
    };
  };
}


// ============================================================================
// MAIN ORGAN: createBinaryPulse — v14.4-PRESENCE-IMMORTAL
// ============================================================================
export function createBinaryPulse({
  fallbackProxy,
  fallbackMesh,
  fallbackNode,
  spins = 3,
  trace = false,
  maxBitsLength = 64,

  presenceBandState = null,
  harmonicDrift = null,
  coherenceScore = null,
  dualBandMode = "binary",
  shifterBand = "regular"
} = {}) {
  // -------------------------------------------------------------------------
  // INTERNAL STATE
  // -------------------------------------------------------------------------
  let counter = 0;
  const spinOffsets = Array.from({ length: spins }, (_, i) => i);

  const immortalMeta = {
    presenceBandState,
    harmonicDrift,
    coherenceScore,
    dualBandMode,
    shifterBand
  };

  // -------------------------------------------------------------------------
  // ORGAN INSTANTIATION — ALL PULSE FAMILIES (PURE SURFACES ONLY)
  // -------------------------------------------------------------------------
  const shifterBinary     = createPulseBinaryShifterEvolutionaryPulse();
  const v1LegacySurface   = createPulseV1Legacy();
  const v3ContinuanceSurf = createPulseV3Continuance();
  const presenceSurf      = createPresencePulse();
  const harmonicsSurf     = createHarmonicsPulse();
  const coherenceSurf     = createCoherencePulse();
  const bandSurf          = createBandPulse();
  const continuanceSurf   = createContinuancePulse();
  const sendLegacySurf    = createSendLegacyPulse();
  const sendEarnSurf      = createSendEarnPulse();
  const normalSurf        = createNormalPulseSurface();

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

  function fallback(reason, bits) {
    const report = {
      reason,
      bits,
      sequenceId: counter,
      immortalMeta
    };

    if (trace && typeof console !== "undefined") {
      console.warn("[PulseBinaryTech IMMORTAL] FALLBACK:", report);
    }

    if (fallbackProxy?.exchange) return fallbackProxy.exchange(bits, reason, report);
    if (fallbackMesh?.exchange)  return fallbackMesh.exchange(bits, reason, report);
    if (fallbackNode?.exchange)  return fallbackNode.exchange(bits, reason, report);

    throw new Error(`PulseBinaryTech fallback (${reason}) with no handlers`);
  }

  function ensurePureBinaryOrFallback(reason, bits) {
    if (!isPureBinary(bits) || isAnomalous(bits)) {
      return fallback(reason, bits);
    }
    return bits;
  }

  // -------------------------------------------------------------------------
  // CORE BINARY GENERATOR
  // -------------------------------------------------------------------------
  function generateBits(n) {
    return n.toString(2).split("").map(Number);
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
    for (let i = 0; i < n; i++) out[(i + s) % n] = bits[i];
    return out;
  }

  function invertBits(bits) {
    const out = new Array(bits.length);
    for (let i = 0; i < bits.length; i++) out[i] = bits[i] === 0 ? 1 : 0;
    return out;
  }

  // -------------------------------------------------------------------------
  // MULTI-SPIN
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
  // PULSE SURFACES (ALL FAMILIES)
// -------------------------------------------------------------------------
  function surfaceV2Shifter(bits, mode) {
    try {
      return createPulseV2Shifter({
        jobId: `v2shifter-${mode}-${counter}`,
        pattern: `binary/${mode}/${bits.length}`,
        payload: { bitsLength: bits.length, mode, sequenceId: counter },
        priority: "normal",
        returnTo: null,
        parentLineage: null,
        mode: "normal",
        pageId: "BINARY_V2_SHIFTER"
      });
    } catch {
      return null;
    }
  }

  function surfaceV2Earn(bits, mode) {
    try {
      return createPulseV2Earn({
        jobId: `v2earn-${mode}-${counter}`,
        pattern: `binary/${mode}/${bits.length}`,
        payload: { bitsLength: bits.length, mode, sequenceId: counter },
        priority: "normal",
        returnTo: null,
        parentLineage: null,
        mode: "normal",
        pageId: "BINARY_V2_EARN"
      });
    } catch {
      return null;
    }
  }

  function surfaceShifter(bits, mode) {
    try {
      return shifterBinary.createFromBits({
        bits,
        jobId: `shifter-${mode}-${counter}`,
        priority: "normal",
        pageId: "BINARY_SHIFTER",
        patternPrefix: "bp",
        trace
      });
    } catch {
      return null;
    }
  }

  function surfaceV1(bits, mode) {
    try {
      return v1LegacySurface({ bits, mode, sequenceId: counter, immortalMeta });
    } catch {
      return null;
    }
  }

  function surfaceV3Continuance(bits, mode) {
    try {
      return v3ContinuanceSurf({ bits, mode, sequenceId: counter, immortalMeta });
    } catch {
      return null;
    }
  }

  function surfaceV3Unified(bits, mode) {
    try {
      return createPulseV3({
        bits,
        mode,
        sequenceId: counter,
        immortalMeta
      });
    } catch {
      return null;
    }
  }

  function surfacePresence(bits, mode) {
    try {
      return presenceSurf({ bits, mode, sequenceId: counter, immortalMeta });
    } catch {
      return null;
    }
  }

  function surfaceHarmonics(bits, mode) {
    try {
      return harmonicsSurf({ bits, mode, sequenceId: counter, immortalMeta });
    } catch {
      return null;
    }
  }

  function surfaceCoherence(bits, mode) {
    try {
      return coherenceSurf({ bits, mode, sequenceId: counter, immortalMeta });
    } catch {
      return null;
    }
  }

  function surfaceBand(bits, mode) {
    try {
      return bandSurf({ bits, mode, sequenceId: counter, immortalMeta });
    } catch {
      return null;
    }
  }

  function surfaceContinuance(bits, mode) {
    try {
      return continuanceSurf({ bits, mode, sequenceId: counter, immortalMeta });
    } catch {
      return null;
    }
  }

  function surfaceSendLegacy(bits, mode, v2PulsePrimary) {
    try {
      return sendLegacySurf({
        bits,
        mode,
        sequenceId: counter,
        v2Pulse: v2PulsePrimary,
        immortalMeta
      });
    } catch {
      return null;
    }
  }

  function surfaceSendEarn(bits, mode, v2PulsePrimary) {
    try {
      return sendEarnSurf({
        bits,
        mode,
        sequenceId: counter,
        v2Pulse: v2PulsePrimary,
        immortalMeta
      });
    } catch {
      return null;
    }
  }

  function surfaceNormal(bits, mode) {
    try {
      return normalSurf({
        bits,
        mode,
        sequenceId: counter
      });
    } catch {
      return null;
    }
  }

  // -------------------------------------------------------------------------
  // WRAPPER — UNIFIED CARRIER PACKET
  // -------------------------------------------------------------------------
  function wrap(mode, bitsOrMulti) {
    const primaryBits =
      Array.isArray(bitsOrMulti) && typeof bitsOrMulti[0] === "number"
        ? bitsOrMulti
        : Array.isArray(bitsOrMulti) && Array.isArray(bitsOrMulti[0])
          ? bitsOrMulti[0]
          : [];

    // TECH FIRST: shifter v2 primary, earn v2 backup
    const v2PulseShifter = surfaceV2Shifter(primaryBits, mode);
    const v2PulseEarn    = surfaceV2Earn(primaryBits, mode);

    const normalPulse      = surfaceNormal(primaryBits, mode);
    const v3UnifiedPulse   = surfaceV3Unified(primaryBits, mode);
    const v3Continuance    = surfaceV3Continuance(primaryBits, mode);
    const continuance      = surfaceContinuance(primaryBits, mode);
    const v1Legacy         = surfaceV1(primaryBits, mode);
    const shifterPulse     = surfaceShifter(primaryBits, mode);
    const presencePulse    = surfacePresence(primaryBits, mode);
    const harmonicsPulse   = surfaceHarmonics(primaryBits, mode);
    const coherencePulse   = surfaceCoherence(primaryBits, mode);
    const bandPulse        = surfaceBand(primaryBits, mode);

    // send surfaces use primary v2 = shifter-tech
    const sendLegacy       = surfaceSendLegacy(primaryBits, mode, v2PulseShifter);
    const sendEarn         = surfaceSendEarn(primaryBits, mode, v2PulseShifter);

    // IMPORTANT: this organ NEVER sends. All send* surfaces are descriptors only.

    return {
      mode,
      sequenceId: counter,
      binaryWaveform: bitsOrMulti,
      immortalMeta: { ...immortalMeta },

      // Baseline + v3
      normalPulse,
      v3UnifiedPulse,
      v3ContinuancePulse: v3Continuance,

      // v2 engines
      v2PulseShifter,
      v2PulseEarn,

      // Continuance + legacy + shifter
      continuancePulse: continuance,
      v1Legacy,
      shifterPulse,

      // Presence family
      presencePulse,
      harmonicsPulse,
      coherencePulse,
      bandPulse,

      // Send descriptors
      sendLegacyPulse: sendLegacy,
      sendEarnPulse: sendEarn
    };
  }

  // -------------------------------------------------------------------------
  // PULSE MODES
  // -------------------------------------------------------------------------
  function nextPulse() {
    counter++;
    const bits = ensurePureBinaryOrFallback("invalid-base", generateBits(counter));
    if (trace) console.log("[PulseBinaryTech IMMORTAL] BASE:", bits);
    return wrap("base", bits);
  }

  function nextPulseFast() {
    counter++;
    const bits = ensurePureBinaryOrFallback("invalid-fast", generateBits(counter));
    if (trace) console.log("[PulseBinaryTech IMMORTAL] FAST:", bits);
    return wrap("fast", bits);
  }

  function nextPulseSlow() {
    counter += 0.25;
    const bits = ensurePureBinaryOrFallback("invalid-slow", generateBits(Math.floor(counter)));
    if (trace) console.log("[PulseBinaryTech IMMORTAL] SLOW:", bits);
    return wrap("slow", bits);
  }

  function nextPulseDeep() {
    counter += 0.05;
    const bits = ensurePureBinaryOrFallback("invalid-deep", generateBits(Math.floor(counter)));
    if (trace) console.log("[PulseBinaryTech IMMORTAL] DEEP:", bits);
    return wrap("deep", bits);
  }

  function nextPulseMulti() {
    counter++;
    const bits = ensurePureBinaryOrFallback("invalid-multi", generateBits(counter));
    const multi = generateMultiSpin(bits);
    if (trace) console.log("[PulseBinaryTech IMMORTAL] MULTI:", multi);
    return wrap("multi", multi);
  }

  function nextPulseEcho() {
    counter++;
    const bits = ensurePureBinaryOrFallback("invalid-echo", generateBits(counter));
    if (trace) console.log("[PulseBinaryTech IMMORTAL] ECHO:", bits);
    return wrap("echo", bits);
  }

  function nextPulseReflect() {
    counter++;
    const bits = ensurePureBinaryOrFallback("invalid-reflect", generateBits(counter));
    const inverted = invertBits(bits);
    if (trace) console.log("[PulseBinaryTech IMMORTAL] REFLECT:", inverted);
    return wrap("reflect", inverted);
  }

  function nextPulseBurst() {
    counter++;
    const base = ensurePureBinaryOrFallback("invalid-burst", generateBits(counter));
    const burst = [base, invertBits(base), rotateBits(base, 1)];
    if (trace) console.log("[PulseBinaryTech IMMORTAL] BURST:", burst);
    return wrap("burst", burst);
  }

  // -------------------------------------------------------------------------
  // PUBLIC API
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
    immortalMeta
  };
}
