// ============================================================================
// FILE: PulseBinaryTech-v16-Immortal-DualHash-INTEL.js
// Pulse OS v16-Immortal — Unified Binary Carrier Organ
// PURE BINARY WAVEFORM • MULTI-PULSE SURFACE • SHIFTER/V2/V3/LEGACY/SEND/EARN
// v16: DualHash signatures + ImmortalMeta + Advantage/Intelligence surfacing
//      Snapshot/Chunk/Prewarm-friendly, no randomness, no IO, no time.
// ============================================================================

/*
AI_EXPERIENCE_META = {
  identity: "PulseBinaryTech",
  version: "v16-Immortal-DualHash-INTEL",
  layer: "frontend",
  role: "binary_tech_engine",
  lineage: "PulseOS-v16",

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
    noInlineBuilders: true,
    snapshotReady: true,
    dualHashReady: true,
    pulseIntelligenceAware: true
  },

  contract: {
    always: [
      "PulseBinaryPulse",
      "PulseBinaryShifterEvolutionaryPulse-v16-Immortal-INTEL",
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
// IMPORTS — v16 IMMORTAL / INTEL surfaces
// ---------------------------------------------------------------------------

// v2 Evolution Engine core (shifter-side v2, symbolic)
import { createPulseV2 as createPulseV2Shifter } from "../PULSE-SHIFTER/PulseShifterEvolutionaryPulse-v16-Immortal-INTEL.js";

// Binary Shifter Evolutionary Pulse front-end
import { createPulseBinaryShifterEvolutionaryPulse } from "../PULSE-SHIFTER/PulseBinaryShifterEvolutionaryPulse-v16-Immortal-INTEL.js";

// v1 Legacy Pulse surface (PULSE-SEND)
import { createLegacyPulse as createPulseV1Legacy } from "../PULSE-SEND/PulseSendLegacyPulse-v16.js";

// v3 Continuance Pulse surface (earn/continuance)
import { PulseEarnContinuancePulse as createPulseV3Continuance } from "../PULSE-EARN/PulseEarnContinuancePulse-v16.js";

// v2 Evolution Engine (earn-side v2)
import { createPulseV2 as createPulseV2Earn } from "../PULSE-SEND/PulseV2EvolutionEngine-v16-Immortal-INTEL.js";

// v3 Unified organism pulse
import { createPulseV3 } from "../PULSE-SEND/PulseV3UnifiedOrganism-v16-Immortal-INTEL.js";


// ---------------------------------------------------------------------------
// INTERNAL HASH / DUALHASH HELPERS (deterministic, bounded)
// ---------------------------------------------------------------------------
function computeHash(str) {
  let h = 0;
  const s = String(str);
  for (let i = 0; i < s.length; i++) {
    h = (h + s.charCodeAt(i) * (i + 1)) % 100000;
  }
  return `h${h}`;
}

function computeAltHash(str) {
  let h = 1;
  const s = String(str);
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i) * (i + 7)) % 1000003;
  }
  return `a${h}`;
}

function computeDualHash(str) {
  const primary = computeHash(str);
  const secondary = computeAltHash(str);
  const combined = computeHash(primary + "::" + secondary);
  return { primary, secondary, combined };
}


// ---------------------------------------------------------------------------
// INLINE PULSE SURFACES (Presence / Harmonics / Coherence / Band / Continuance)
// ---------------------------------------------------------------------------
function createPresencePulse() {
  return function surfacePresence({ bits, mode, sequenceId, immortalMeta }) {
    const len = Array.isArray(bits) ? bits.length : 0;
    return {
      type: "PulsePresence-v16",
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
      type: "PulseHarmonics-v16",
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
      type: "PulseCoherence-v16",
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
      type: "PulseBand-v16",
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
      type: "PulseContinuance-v16",
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
    const healthScore = v2Pulse?.healthScore ?? null;
    const tier = v2Pulse?.tier ?? null;

    return {
      type: "PulseSendLegacy-v16",
      mode,
      sequenceId,
      bitsLength: len,
      sendIntent: "legacy",
      healthScore,
      tier,
      presenceBandState: immortalMeta?.presenceBandState ?? null,
      healthDualHash: healthScore != null ? computeDualHash(String(healthScore)) : null,
      tierDualHash: tier != null ? computeDualHash(String(tier)) : null
    };
  };
}

function createSendEarnPulse() {
  return function surfaceSendEarn({ bits, mode, sequenceId, v2Pulse, immortalMeta }) {
    const len = Array.isArray(bits) ? bits.length : 0;
    const advantageField = v2Pulse?.advantageField ?? null;
    const healthScore = v2Pulse?.healthScore ?? null;

    return {
      type: "PulseSendEarn-v16",
      mode,
      sequenceId,
      bitsLength: len,
      sendIntent: "earn",
      advantageField,
      healthScore,
      coherenceScore: immortalMeta?.coherenceScore ?? null,
      advantageDualHash: advantageField ? computeDualHash(JSON.stringify(advantageField)) : null,
      healthDualHash: healthScore != null ? computeDualHash(String(healthScore)) : null
    };
  };
}

function createNormalPulseSurface() {
  return function surfaceNormal({ bits, mode, sequenceId }) {
    const len = Array.isArray(bits) ? bits.length : 0;
    const baselineScore = Math.min(len / 32, 1);
    return {
      type: "PulseNormal-v16",
      mode,
      sequenceId,
      bitsLength: len,
      baselineScore,
      baselineDualHash: computeDualHash(String(baselineScore))
    };
  };
}


// ============================================================================
// MAIN ORGAN: createBinaryPulse — v16-Immortal-DualHash-INTEL
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
      console.warn("[PulseBinaryTech v16-IMMORTAL] FALLBACK:", report);
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
        payload: {
          bitsLength: bits.length,
          mode,
          sequenceId: counter,
          immortalMeta
        },
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
        payload: {
          bitsLength: bits.length,
          mode,
          sequenceId: counter,
          immortalMeta
        },
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
      // v3 unified is symbolic; we just pass a synthetic pattern/payload
      const pattern = `binary/${mode}/${bits.length}`;
      const payload = {
        bitsLength: bits.length,
        mode,
        sequenceId: counter,
        immortalMeta
      };
      return createPulseV3({
        jobId: `v3unified-${mode}-${counter}`,
        pattern,
        payload,
        priority: "normal",
        returnTo: null,
        parentLineage: null,
        mode: "normal",
        pageId: "BINARY_V3_UNIFIED"
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
  // WRAPPER — UNIFIED CARRIER PACKET (v16 DualHash + Intelligence Surface)
// -------------------------------------------------------------------------
  function wrap(mode, bitsOrMulti) {
    const primaryBits =
      Array.isArray(bitsOrMulti) && typeof bitsOrMulti[0] === "number"
        ? bitsOrMulti
        : Array.isArray(bitsOrMulti) && Array.isArray(bitsOrMulti[0])
          ? bitsOrMulti[0]
          : [];

    const bitsSignature = computeDualHash(JSON.stringify(primaryBits));
    const modeSignature = computeDualHash(mode);
    const sequenceSignature = computeDualHash(String(counter));
    const immortalSignature = computeDualHash(JSON.stringify(immortalMeta));

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

    const sendLegacy       = surfaceSendLegacy(primaryBits, mode, v2PulseShifter);
    const sendEarn         = surfaceSendEarn(primaryBits, mode, v2PulseShifter);

    // Intelligence / advantage surfaces (if present)
    const v2PrimaryAdvantage = v2PulseShifter?.advantageField ?? null;
    const v2PrimaryHealth    = v2PulseShifter?.healthScore ?? null;
    const v2PrimaryTier      = v2PulseShifter?.tier ?? null;
    const v2PrimaryIntel     = v2PulseShifter?.pulseIntelligence ?? v2PulseShifter?.pulseCompute ?? null;

    const v3UnifiedIntel     = v3UnifiedPulse?.pulseIntelligence ?? null;
    const v3UnifiedHealth    = v3UnifiedPulse?.healthScore ?? null;
    const v3UnifiedTier      = v3UnifiedPulse?.tier ?? null;

    const carrierIntel = {
      v2Primary: v2PrimaryIntel,
      v3Unified: v3UnifiedIntel
    };

    const carrierAdvantage = {
      v2PrimaryAdvantage,
      v2PrimaryHealth,
      v2PrimaryTier,
      v3UnifiedHealth,
      v3UnifiedTier
    };

    const carrierSignature = computeDualHash(
      JSON.stringify({
        mode,
        sequenceId: counter,
        bitsSignature,
        carrierAdvantage,
        carrierIntel
      })
    );

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
      sendEarnPulse: sendEarn,

      // Intelligence / advantage surfaces
      carrierAdvantage,
      carrierIntel,

      // DualHash surfaces
      signatures: {
        bitsSignature,
        modeSignature,
        sequenceSignature,
        immortalSignature,
        carrierSignature
      }
    };
  }

  // -------------------------------------------------------------------------
  // PULSE MODES
  // -------------------------------------------------------------------------
  function nextPulse() {
    counter++;
    const bits = ensurePureBinaryOrFallback("invalid-base", generateBits(counter));
    if (trace) console.log("[PulseBinaryTech v16-IMMORTAL] BASE:", bits);
    return wrap("base", bits);
  }

  function nextPulseFast() {
    counter++;
    const bits = ensurePureBinaryOrFallback("invalid-fast", generateBits(counter));
    if (trace) console.log("[PulseBinaryTech v16-IMMORTAL] FAST:", bits);
    return wrap("fast", bits);
  }

  function nextPulseSlow() {
    counter += 0.25;
    const bits = ensurePureBinaryOrFallback("invalid-slow", generateBits(Math.floor(counter)));
    if (trace) console.log("[PulseBinaryTech v16-IMMORTAL] SLOW:", bits);
    return wrap("slow", bits);
  }

  function nextPulseDeep() {
    counter += 0.05;
    const bits = ensurePureBinaryOrFallback("invalid-deep", generateBits(Math.floor(counter)));
    if (trace) console.log("[PulseBinaryTech v16-IMMORTAL] DEEP:", bits);
    return wrap("deep", bits);
  }

  function nextPulseMulti() {
    counter++;
    const bits = ensurePureBinaryOrFallback("invalid-multi", generateBits(counter));
    const multi = generateMultiSpin(bits);
    if (trace) console.log("[PulseBinaryTech v16-IMMORTAL] MULTI:", multi);
    return wrap("multi", multi);
  }

  function nextPulseEcho() {
    counter++;
    const bits = ensurePureBinaryOrFallback("invalid-echo", generateBits(counter));
    if (trace) console.log("[PulseBinaryTech v16-IMMORTAL] ECHO:", bits);
    return wrap("echo", bits);
  }

  function nextPulseReflect() {
    counter++;
    const bits = ensurePureBinaryOrFallback("invalid-reflect", generateBits(counter));
    const inverted = invertBits(bits);
    if (trace) console.log("[PulseBinaryTech v16-IMMORTAL] REFLECT:", inverted);
    return wrap("reflect", inverted);
  }

  function nextPulseBurst() {
    counter++;
    const base = ensurePureBinaryOrFallback("invalid-burst", generateBits(counter));
    const burst = [base, invertBits(base), rotateBits(base, 1)];
    if (trace) console.log("[PulseBinaryTech v16-IMMORTAL] BURST:", burst);
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
