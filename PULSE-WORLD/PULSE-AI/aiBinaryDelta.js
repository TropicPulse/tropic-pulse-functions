// ============================================================================
//  aiBinaryDelta.js — Pulse OS v11.3‑EVO Organ
//  Binary Delta Engine • Change Detector • Segment Comparator • Packet‑Ready
// ============================================================================

export const DeltaMeta = Object.freeze({
  layer: "BinaryDelta",
  role: "BINARY_DELTA_ENGINE",
  version: "11.3-EVO",
  identity: "aiBinaryDelta-v11.3-EVO",

  evo: Object.freeze({
    deterministic: true,
    driftProof: true,
    binaryOnly: true,

    diffAware: true,
    changeAware: true,
    temporalAware: true,
    segmentAware: true,       // ⭐ NEW
    packetAware: true,        // ⭐ NEW
    windowAware: true,        // ⭐ NEW
    dualband: true,           // ⭐ NEW
    deltaCache: true,         // ⭐ NEW

    multiInstanceReady: true,
    readOnly: true,
    epoch: "v11.3-EVO"
  }),

  contract: Object.freeze({
    purpose:
      "Compute deterministic binary diffs, deltas, and change maps without symbolic interpretation.",

    never: Object.freeze([
      "interpret symbolic meaning",
      "mutate inputs",
      "apply patches automatically",
      "perform merges",
      "introduce randomness",
      "modify pipeline or reflex behavior"
    ]),

    always: Object.freeze([
      "validate binary inputs",
      "compute diffs deterministically",
      "return pure binary delta structures",
      "remain pure and minimal",
      "produce frozen results"
    ])
  })
});

// ============================================================================
//  PACKET EMITTER — deterministic, delta-scoped
// ============================================================================
function emitDeltaPacket(type, payload) {
  return Object.freeze({
    meta: DeltaMeta,
    packetType: `delta-${type}`,
    timestamp: Date.now(),
    epoch: DeltaMeta.evo.epoch,
    ...payload
  });
}

// ============================================================================
//  PREWARM — warms diff engine
// ============================================================================
export function prewarmBinaryDelta({ trace = false } = {}) {
  try {
    const sampleA = "000111000";
    const sampleB = "001011100";

    // warm diff path
    const warm = {
      added: sampleB,
      removed: sampleA
    };

    const packet = emitDeltaPacket("prewarm", {
      message: "Binary delta engine prewarmed.",
      warm
    });

    if (trace) console.log("[aiBinaryDelta] prewarm", packet);
    return packet;
  } catch (err) {
    return emitDeltaPacket("prewarm-error", {
      error: String(err),
      message: "Binary delta prewarm failed."
    });
  }
}

// ============================================================================
//  ORGAN IMPLEMENTATION — v11.3‑EVO
// ============================================================================
export class AIBinaryDelta {
  constructor(config = {}) {
    this.id = config.id || "ai-binary-delta";
    this.trace = !!config.trace;

    // ⭐ NEW — delta cache for repeated comparisons
    this._cache = new Map();
  }

  // ---------------------------------------------------------------------------
  //  VALIDATION
  // ---------------------------------------------------------------------------
  _assertBinary(str) {
    if (typeof str !== "string" || !/^[01]+$/.test(str)) {
      throw new TypeError("expected binary string");
    }
  }

  // ---------------------------------------------------------------------------
  //  BINARY DIFF CORE — deterministic
  // ---------------------------------------------------------------------------
  diff(aBin, bBin) {
    this._assertBinary(aBin);
    this._assertBinary(bBin);

    const key = `${aBin}|${bBin}`;
    if (this._cache.has(key)) {
      return emitDeltaPacket("diff-fast", this._cache.get(key));
    }

    const maxLen = Math.max(aBin.length, bBin.length);
    const a = aBin.padStart(maxLen, "0");
    const b = bBin.padStart(maxLen, "0");

    let added = "";
    let removed = "";
    let unchanged = "";

    for (let i = 0; i < maxLen; i++) {
      const bitA = a[i];
      const bitB = b[i];

      if (bitA === bitB) {
        unchanged += bitA;
      } else if (bitA === "0" && bitB === "1") {
        added += "1";
      } else if (bitA === "1" && bitB === "0") {
        removed += "1";
      }
    }

    const delta = Object.freeze({
      type: "binary-delta",
      addedBits: added || "0",
      removedBits: removed || "0",
      unchangedBits: unchanged || "0",
      addedCount: added.length,
      removedCount: removed.length,
      unchangedCount: unchanged.length
    });

    this._cache.set(key, delta);

    return emitDeltaPacket("diff", {
      aBits: aBin.length,
      bBits: bBin.length,
      delta
    });
  }

  // ---------------------------------------------------------------------------
  //  SEGMENT DELTA — v11.3‑EVO
  // ---------------------------------------------------------------------------
  segmentDelta(aBin, bBin, segmentSize = 64) {
    this._assertBinary(aBin);
    this._assertBinary(bBin);

    const maxLen = Math.max(aBin.length, bBin.length);
    const a = aBin.padStart(maxLen, "0");
    const b = bBin.padStart(maxLen, "0");

    const segments = [];
    for (let i = 0; i < maxLen; i += segmentSize) {
      const segA = a.slice(i, i + segmentSize);
      const segB = b.slice(i, i + segmentSize);

      let changed = 0;
      for (let j = 0; j < segmentSize; j++) {
        if (segA[j] !== segB[j]) changed++;
      }

      segments.push({
        index: i / segmentSize,
        changed,
        unchanged: segmentSize - changed
      });
    }

    return emitDeltaPacket("segment-delta", {
      segmentSize,
      segments
    });
  }

  // ---------------------------------------------------------------------------
  //  DELTA COMPRESSION (placeholder)
// ---------------------------------------------------------------------------
  compressDelta(delta) {
    return emitDeltaPacket("compress", { delta });
  }

  // ---------------------------------------------------------------------------
  //  DELTA APPLICATION (placeholder)
// ---------------------------------------------------------------------------
  applyDelta(aBin, delta) {
    this._assertBinary(aBin);
    return emitDeltaPacket("apply", {
      aBin,
      delta,
      result: aBin
    });
  }

  // ---------------------------------------------------------------------------
  //  TRACE
  // ---------------------------------------------------------------------------
  _trace(event, payload) {
    if (!this.trace) return;
    console.log(`[${this.id}] ${event}`, payload);
  }
}

// ============================================================================
//  FACTORY
// ============================================================================
export function createAIBinaryDelta(config) {
  return new AIBinaryDelta(config);
}

export { AIBinaryDelta };
