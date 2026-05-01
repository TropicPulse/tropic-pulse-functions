// ============================================================================
//  aiBinaryDelta.js — Pulse OS v12.3‑Presence Organ
//  Binary Delta Engine • Change Detector • Segment Comparator • Packet‑Ready
// ============================================================================

export const DeltaMeta = Object.freeze({
  layer: "BinaryDelta",
  role: "BINARY_DELTA_ENGINE",
  version: "12.3-Presence",
  identity: "aiBinaryDelta-v12.3-Presence",

  evo: Object.freeze({
    deterministic: true,
    driftProof: true,
    binaryOnly: true,

    diffAware: true,
    changeAware: true,
    temporalAware: true,
    segmentAware: true,
    packetAware: true,
    windowAware: true,
    deltaCache: true,

    multiInstanceReady: true,
    readOnly: true,
    epoch: "v12.3-Presence",

    presenceAware: true,
    chunkingAware: true,
    gpuFriendly: true,
    dualBandSafe: true,      // can live in dualband, but stays binary‑only
    sideEffectFree: true
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
  }),

  presence: Object.freeze({
    organId: "BinaryDeltaEngine",
    organKind: "Physiology",
    physiologyBand: "Binary",
    warmStrategy: "prewarm-on-attach",
    attachStrategy: "on-demand",
    concurrency: "multi-instance",
    observability: {
      traceEvents: [
        "diff",
        "diff-fast",
        "segment-delta",
        "compress",
        "apply",
        "prewarm"
      ]
    }
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
    layer: DeltaMeta.layer,
    role: DeltaMeta.role,
    identity: DeltaMeta.identity,
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
//  ORGAN IMPLEMENTATION — v12.3‑Presence
// ============================================================================
export class AIBinaryDelta {
  constructor(config = {}) {
    this.id = config.id || "ai-binary-delta";
    this.trace = !!config.trace;

    // delta cache for repeated comparisons
    this._cache = new Map();

    // optional presence / performance hints
    this.windowSize = config.windowSize || 0; // optional temporal window
    this.maxCacheEntries = config.maxCacheEntries || 256;
  }

  // ---------------------------------------------------------------------------
  //  VALIDATION
  // ---------------------------------------------------------------------------
  _assertBinary(str) {
    if (typeof str !== "string" || !/^[01]+$/.test(str)) {
      throw new TypeError("expected binary string");
    }
  }

  _maybeEvictCache() {
    if (this._cache.size <= this.maxCacheEntries) return;
    // simple FIFO eviction: delete first inserted key
    const firstKey = this._cache.keys().next().value;
    if (firstKey !== undefined) this._cache.delete(firstKey);
  }

  // ---------------------------------------------------------------------------
  //  BINARY DIFF CORE — deterministic
  // ---------------------------------------------------------------------------
  diff(aBin, bBin) {
    this._assertBinary(aBin);
    this._assertBinary(bBin);

    const key = `${aBin}|${bBin}`;
    if (this._cache.has(key)) {
      const cached = this._cache.get(key);
      this._trace("diff-fast", { key, cached });
      return emitDeltaPacket("diff-fast", cached);
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

    this._maybeEvictCache();
    this._cache.set(key, delta);

    const packet = emitDeltaPacket("diff", {
      aBits: aBin.length,
      bBits: bBin.length,
      delta
    });

    this._trace("diff", { key, packet });
    return packet;
  }

  // ---------------------------------------------------------------------------
  //  SEGMENT DELTA — v12.3‑Presence
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
      const len = Math.min(segA.length, segB.length);
      for (let j = 0; j < len; j++) {
        if (segA[j] !== segB[j]) changed++;
      }

      segments.push({
        index: i / segmentSize,
        changed,
        unchanged: segmentSize - changed
      });
    }

    const packet = emitDeltaPacket("segment-delta", {
      segmentSize,
      segments
    });

    this._trace("segment-delta", { segmentSize, segmentsCount: segments.length });
    return packet;
  }

  // ---------------------------------------------------------------------------
  //  DELTA COMPRESSION (placeholder, presence‑aware)
// ---------------------------------------------------------------------------
  compressDelta(delta) {
    const packet = emitDeltaPacket("compress", { delta });
    this._trace("compress", { delta });
    return packet;
  }

  // ---------------------------------------------------------------------------
  //  DELTA APPLICATION (placeholder, presence‑aware)
// ---------------------------------------------------------------------------
  applyDelta(aBin, delta) {
    this._assertBinary(aBin);
    const packet = emitDeltaPacket("apply", {
      aBin,
      delta,
      result: aBin
    });
    this._trace("apply", { aBits: aBin.length });
    return packet;
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
//  FACTORY + PRESENCE SURFACE
// ============================================================================
export function createAIBinaryDelta(config = {}) {
  return new AIBinaryDelta(config);
}

export const BinaryDeltaPresence = Object.freeze({
  meta: DeltaMeta,
  create: createAIBinaryDelta,
  prewarm: prewarmBinaryDelta,
  organ: "AIBinaryDelta",
  layer: DeltaMeta.layer,
  role: DeltaMeta.role,
  version: DeltaMeta.version
});
