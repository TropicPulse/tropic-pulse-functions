// ============================================================================
// FILE: /PulseOS/PULSE-TOOLS/PulseBinaryLoopScanner-v16.js
// PULSE OS — v16-IMMORTAL
// MAIN LOOP ORGAN — PURE BINARY, DUAL-BAND, ARTERY-AWARE, ZERO-DRIFT
// ============================================================================
// ROLE (v16-IMMORTAL):
//   - Convert binary pulses → deterministic loop indices (all layers).
//   - Drive sweep lines for ALL PulseOS layers (body/home/town/node/etc).
//   - Provide multiple loop “personalities” (standard/deep/multi/edge/flat).
//   - Multi-spin aware: phase offsets alter loop paths without randomness.
//   - Dual-band aware: optional presence/harmonics can bias paths, still deterministic.
//   - Artery-aware: exposes loop load/pressure + window-safe buckets.
//   - Advantage view: can emit multi-mode indices + symbolic hints in one shot.
//   - Zero randomness, zero timestamps, zero mutation of inputs.
//   - Pairs with BinaryPulse‑v16‑IMMORTAL + BinaryWaveScanner‑v16‑IMMORTAL.
// ---------------------------------------------------------------------------
// LOOP MODES (v16-IMMORTAL, API-COMPATIBLE):
//   • nextIndex       → standard loop index (fast, responsive, dual-band aware)
//   • nextIndexDeep   → slower, deeper, stable sweep (MRI-like)
//   • nextIndexMulti  → 3-phase multi-spin loop indices
//   • nextIndexEdge   → edge-biased sweep (outline emphasis)
//   • nextIndexFlat   → low-variance, stable sweep (calming mode)
// ---------------------------------------------------------------------------
// NOTE:
//   - Signature kept v11-compatible. Extra influence comes via optional params:
//       nextIndex(bits, max, spinPhase = 0, presence = 0, harmonicBias = 0)
//       nextIndexDeep(bits, max, spinPhase = 0, presence = 0, harmonicBias = 0)
//       nextIndexMulti(bits, max, presence = 0, harmonicBias = 0)
//       nextIndexEdge(bits, max, spinPhase = 0, presence = 0, harmonicBias = 0)
//       nextIndexFlat(bits, max, presence = 0, harmonicBias = 0)
//   - Callers that ignore presence/harmonicBias get pure v11 behavior.
//   - v16 adds: artery snapshots, window buckets, advantage view, dual-band prewarm.
// ============================================================================

/*
AI_EXPERIENCE_META = {
  identity: "PulseBinaryLoopScanner",
  version: "v16-Immortal",
  layer: "loop_scanner",
  role: "binary_loop_organ",
  lineage: "PulseBinaryLoopScanner-v12.3-Evo → v16-Immortal",

  evo: {
    loopOrgan: true,
    multiMode: true,
    dualBand: true,
    presenceAware: true,
    harmonicAware: true,
    arteryAware: true,
    advantageView: true,
    windowSafe: true,

    deterministic: true,
    driftProof: true,
    pureCompute: true,

    zeroNetwork: true,
    zeroFilesystem: true,
    zeroMutationOfInput: true,
    zeroRandomness: true
  },

  contract: {
    always: [
      "BinaryPulse",
      "BinaryWaveScanner",
      "PageEvo",
      "PulseAdminInspector"
    ],
    never: [
      "safeRoute",
      "fetchViaCNS",
      "legacyLoopScanner"
    ]
  }
}
*/

// ============================================================================
// META — v16-IMMORTAL
// ============================================================================

export const BinaryLoopScannerMeta = Object.freeze({
  layer: "PulseBinaryLoopScanner",
  role: "BINARY_LOOP_ORGAN",
  version: "16-Immortal",
  identity: "PulseBinaryLoopScanner-v16-Immortal",

  evo: Object.freeze({
    deterministic: true,
    driftProof: true,
    loopOrgan: true,
    multiMode: true,
    dualBand: true,
    presenceAware: true,
    harmonicAware: true,
    arteryAware: true,
    advantageView: true,
    windowSafe: true,

    pureCompute: true,
    zeroNetwork: true,
    zeroFilesystem: true,
    zeroMutationOfInput: true,
    zeroRandomness: true,

    epoch: "16-Immortal"
  }),

  contract: Object.freeze({
    purpose:
      "Convert pure binary pulses into deterministic loop indices and multi-mode sweep paths with dual-band overlays.",

    never: Object.freeze([
      "introduce randomness",
      "mutate input bits",
      "depend on timestamps",
      "perform IO or networking",
      "infer identity from bits",
      "apply policy logic"
    ]),

    always: Object.freeze([
      "validate binary input",
      "remain pure and deterministic",
      "emit loop indices only",
      "expose artery load/pressure metrics",
      "support dual-band presence/harmonics bias",
      "provide advantage view for multi-mode scans"
    ])
  }),

  boundaryReflex() {
    return "BinaryLoopScanner must remain pure: no randomness, no IO, no identity inference, ever.";
  }
});

// ============================================================================
// PACKET EMITTER — deterministic, loop-scoped
// ============================================================================

function emitLoopPacket(type, payload, { severity = "info" } = {}) {
  return Object.freeze({
    meta: BinaryLoopScannerMeta,
    packetType: `loop-${type}`,
    epoch: BinaryLoopScannerMeta.evo.epoch,
    severity,
    ...payload
  });
}

// ============================================================================
// PREWARM — v16-IMMORTAL dual-band warmup (no GPU load, pure symbolic)
// ============================================================================

export function prewarmBinaryLoopScanner(dualBand = null, { trace = false } = {}) {
  const presence =
    dualBand?.symbolic?.presence?.level ??
    dualBand?.symbolic?.presenceLevel ??
    0;

  const harmonicBias =
    dualBand?.symbolic?.harmonics?.bias ??
    dualBand?.symbolic?.harmonicBias ??
    0;

  const mode =
    dualBand?.symbolic?.loop?.mode ||
    "standard";

  const packet = emitLoopPacket("prewarm", {
    message: "Binary loop scanner prewarmed and dual-band overlays aligned.",
    presence,
    harmonicBias,
    mode
  });

  if (trace) {
    // eslint-disable-next-line no-console
    console.log("[BinaryLoopScanner-v16] prewarm", packet);
  }

  return packet;
}

// ============================================================================
// MAIN ORGAN IMPLEMENTATION — v16-IMMORTAL
// ============================================================================

export function createBinaryLoopScanner({ trace = false } = {}) {
  // -------------------------------------------------------------------------
  // ARTERY — loop load/pressure metrics (window-safe)
// -------------------------------------------------------------------------
  const artery = {
    loops: 0,
    lastMode: null,
    lastIndex: null,
    lastIndices: null,
    lastBits: 0,
    snapshot: () => Object.freeze(_snapshotArtery())
  };

  function _bucketLoad(v) {
    if (v >= 0.9) return "saturated";
    if (v >= 0.7) return "high";
    if (v >= 0.4) return "medium";
    if (v > 0)   return "low";
    return "idle";
  }

  function _bucketPressure(v) {
    if (v >= 0.9) return "overload";
    if (v >= 0.7) return "high";
    if (v >= 0.4) return "medium";
    if (v > 0)   return "low";
    return "none";
  }

  function _snapshotArtery() {
    const { loops, lastBits } = artery;
    const load = Math.min(1, loops / 4096);
    const pressure = Math.min(1, lastBits / 4096);

    return {
      loops,
      lastMode: artery.lastMode,
      lastIndex: artery.lastIndex,
      lastIndices: artery.lastIndices,
      lastBits,
      load,
      loadBucket: _bucketLoad(load),
      pressure,
      pressureBucket: _bucketPressure(pressure)
    };
  }

  function _updateArtery({ mode, bitsLength, index = null, indices = null }) {
    artery.loops++;
    artery.lastMode = mode;
    artery.lastBits = bitsLength;
    artery.lastIndex = index;
    artery.lastIndices = indices;
  }

  // -------------------------------------------------------------------------
  // SAFETY: PURE BINARY ONLY
  // -------------------------------------------------------------------------
  function isPureBinary(bits) {
    if (!Array.isArray(bits)) return false;
    for (let i = 0; i < bits.length; i++) {
      if (bits[i] !== 0 && bits[i] !== 1) return false;
    }
    return true;
  }

  // -------------------------------------------------------------------------
  // CORE: BINARY → NUMBER (DETERMINISTIC)
// -------------------------------------------------------------------------
  function bitsToNumber(bits) {
    let n = 0;
    for (let i = 0; i < bits.length; i++) {
      n = (n << 1) | bits[i];
    }
    return n >>> 0;
  }

  // -------------------------------------------------------------------------
  // DUAL-BAND BIAS (PRESENCE + HARMONICS) — PURE, DETERMINISTIC
  // -------------------------------------------------------------------------
  function dualBandOffset(max, presence = 0, harmonicBias = 0) {
    const p = clamp(presence, 0, 1);
    const h = clamp(harmonicBias, 0, 1);

    // small, bounded offset: at most ~10% of max
    const combined = (p * 0.6 + h * 0.4); // 0..1
    const offset = Math.floor(combined * max * 0.1);

    return offset;
  }

  // ========================================================================
  // MODE 1 — STANDARD LOOP INDEX (FAST, RESPONSIVE, DUAL-BAND AWARE)
  // ========================================================================
  function nextIndex(bits, max, spinPhase = 0, presence = 0, harmonicBias = 0) {
    if (!isPureBinary(bits)) {
      throw new Error("[BinaryLoopScanner‑16] non-binary bits passed to nextIndex");
    }

    const base = bitsToNumber(bits);
    const bandOffset = dualBandOffset(max, presence, harmonicBias);

    const idx = Math.abs(base + Math.floor(spinPhase) + bandOffset) % max;

    _updateArtery({
      mode: "standard",
      bitsLength: bits.length,
      index: idx
    });

    if (trace) {
      // eslint-disable-next-line no-console
      console.log("[LoopScanner‑16] STANDARD:", { idx, presence, harmonicBias });
    }
    return idx;
  }

  // ========================================================================
  // MODE 2 — DEEP LOOP INDEX (SLOW, STABLE, MRI-LIKE)
  // ========================================================================
  function nextIndexDeep(bits, max, spinPhase = 0, presence = 0, harmonicBias = 0) {
    if (!isPureBinary(bits)) {
      throw new Error("[BinaryLoopScanner‑16] non-binary bits passed to nextIndexDeep");
    }

    const base = Math.floor(bitsToNumber(bits) * 0.25); // slow down movement
    const bandOffset = dualBandOffset(max, presence, harmonicBias);

    const idx = Math.abs(base + Math.floor(spinPhase) + bandOffset) % max;

    _updateArtery({
      mode: "deep",
      bitsLength: bits.length,
      index: idx
    });

    if (trace) {
      // eslint-disable-next-line no-console
      console.log("[LoopScanner‑16] DEEP:", { idx, presence, harmonicBias });
    }
    return idx;
  }

  // ========================================================================
  // MODE 3 — MULTI LOOP INDEX (3-PHASE MULTI-SPIN, DUAL-BAND AWARE)
  // ========================================================================
  function nextIndexMulti(bits, max, presence = 0, harmonicBias = 0) {
    if (!isPureBinary(bits)) {
      throw new Error("[BinaryLoopScanner‑16] non-binary bits passed to nextIndexMulti");
    }

    const base = bitsToNumber(bits);
    const bandOffset = dualBandOffset(max, presence, harmonicBias);

    const indices = [0, 1, 2].map(i => {
      const phase = (Math.PI * 2 * i) / 3;
      const idx = Math.abs(base + Math.floor(phase * 10) + bandOffset) % max;
      return idx;
    });

    _updateArtery({
      mode: "multi",
      bitsLength: bits.length,
      indices
    });

    if (trace) {
      // eslint-disable-next-line no-console
      console.log("[LoopScanner‑16] MULTI:", { indices, presence, harmonicBias });
    }
    return indices;
  }

  // ========================================================================
  // MODE 4 — EDGE LOOP INDEX (OUTLINE EMPHASIS, DUAL-BAND AWARE)
  // ========================================================================
  function nextIndexEdge(bits, max, spinPhase = 0, presence = 0, harmonicBias = 0) {
    if (!isPureBinary(bits)) {
      throw new Error("[BinaryLoopScanner‑16] non-binary bits passed to nextIndexEdge");
    }

    const base = bitsToNumber(bits);
    const bandOffset = dualBandOffset(max, presence, harmonicBias);

    // Even → left/top edge, Odd → right/bottom edge
    const edgeBias = (base % 2 === 0) ? 0 : max - 1;

    const idx = Math.abs(edgeBias + Math.floor(spinPhase) + bandOffset) % max;

    _updateArtery({
      mode: "edge",
      bitsLength: bits.length,
      index: idx
    });

    if (trace) {
      // eslint-disable-next-line no-console
      console.log("[LoopScanner‑16] EDGE:", { idx, presence, harmonicBias });
    }
    return idx;
  }

  // ========================================================================
  // MODE 5 — FLAT LOOP INDEX (LOW-VARIANCE, CALMING, DUAL-BAND AWARE)
  // ========================================================================
  function nextIndexFlat(bits, max, presence = 0, harmonicBias = 0) {
    if (!isPureBinary(bits)) {
      throw new Error("[BinaryLoopScanner‑16] non-binary bits passed to nextIndexFlat");
    }

    const base = bitsToNumber(bits);
    const bandOffset = dualBandOffset(max, presence, harmonicBias);

    // Flatten movement: only 10% of normal range, then dual-band offset
    const flatBase = Math.floor((base % max) * 0.1);
    const idx = (flatBase + bandOffset) % max;

    _updateArtery({
      mode: "flat",
      bitsLength: bits.length,
      index: idx
    });

    if (trace) {
      // eslint-disable-next-line no-console
      console.log("[LoopScanner‑16] FLAT:", { idx, presence, harmonicBias });
    }
    return idx;
  }

  // ========================================================================
  // ADVANTAGE VIEW — MULTI-MODE SNAPSHOT + SYMBOLIC HINTS (v16-IMMORTAL)
  // ========================================================================
  // args:
  //   bits[]         → required
  //   max            → required
  //   spinPhase      → optional
  //   presence       → optional (0–1)
  //   harmonicBias   → optional (0–1)
  //
  // returns:
  //   {
  //     indices: { standard, deep, multi[3], edge, flat },
  //     hints: {
  //       scanAggression: 0–1,
  //       calmness: 0–1,
  //       edgeFocus: 0–1,
  //       dualBandInfluence: 0–1
  //     },
  //     artery: { ...snapshot }
  //   }
  function nextAdvantageView({
    bits,
    max,
    spinPhase = 0,
    presence = 0,
    harmonicBias = 0
  }) {
    if (!isPureBinary(bits)) {
      throw new Error("[BinaryLoopScanner‑16] non-binary bits passed to nextAdvantageView");
    }
    if (!Number.isFinite(max) || max <= 0) {
      throw new Error("[BinaryLoopScanner‑16] nextAdvantageView requires positive max");
    }

    const standard = nextIndex(bits, max, spinPhase, presence, harmonicBias);
    const deep = nextIndexDeep(bits, max, spinPhase, presence, harmonicBias);
    const multi = nextIndexMulti(bits, max, presence, harmonicBias);
    const edge = nextIndexEdge(bits, max, spinPhase, presence, harmonicBias);
    const flat = nextIndexFlat(bits, max, presence, harmonicBias);

    // symbolic hints only, no behavior change
    const dualBandInfluence = clamp(presence * 0.6 + harmonicBias * 0.4, 0, 1);
    const scanAggression = clamp(1 - dualBandInfluence * 0.3, 0, 1);
    const calmness = clamp(dualBandInfluence * 0.5 + 0.2, 0, 1);
    const edgeFocus = clamp((edge === 0 || edge === max - 1) ? 1 : 0.4, 0, 1);

    const snapshot = artery.snapshot();

    return emitLoopPacket("advantage-view", {
      indices: {
        standard,
        deep,
        multi,
        edge,
        flat
      },
      hints: {
        scanAggression,
        calmness,
        edgeFocus,
        dualBandInfluence
      },
      artery: snapshot
    });
  }

  // ========================================================================
  // SNAPSHOT MEMBRANE — ARTERY VIEW
  // ========================================================================
  function snapshotMembrane() {
    return emitLoopPacket("snapshot", {
      artery: artery.snapshot()
    });
  }

  // ========================================================================
  // ORGAN EXPORT
  // ========================================================================
  return {
    meta: BinaryLoopScannerMeta,

    nextIndex,
    nextIndexDeep,
    nextIndexMulti,
    nextIndexEdge,
    nextIndexFlat,

    nextAdvantageView,
    snapshotMembrane,

    getArterySnapshot: () => artery.snapshot()
  };
}

// ---------------------------------------------------------------------------
// UTIL
// ---------------------------------------------------------------------------
function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

if (typeof module !== "undefined") {
  module.exports = {
    BinaryLoopScannerMeta,
    prewarmBinaryLoopScanner,
    createBinaryLoopScanner
  };
}
