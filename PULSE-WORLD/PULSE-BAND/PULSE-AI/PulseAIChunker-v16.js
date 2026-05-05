// ============================================================================
//  PulseAIChunker v16.2-IMMORTAL
//  32-LANE DUALBAND CHUNKER — BINARY + SYMBOLIC, ORGANISM-GRADE
// ============================================================================

/*
AI_EXPERIENCE_META:
  organ: PulseAIChunker
  version: 16.2.0
  tier: IMMORTAL
  layer: ai_core
  role: ai_chunker

  description:
    "PulseAIChunker is a dualband, 32-lane chunking engine for binary and
     symbolic payloads. It is non-mind, deterministic, and drift-proof.

     It:
       - splits large payloads into fixed or adaptive chunks
       - supports 32 parallel logical lanes
       - tags chunks with lane, band, and lineage metadata
       - supports binary (Uint8Array/ArrayBuffer) and JSON-serializable objects
       - can prewarm chunk maps for hot paths (organism boot, arteries, trust)
       - never performs cognition, inference, or semantic reasoning

     It is designed to be used by:
       - OrganismKernel (prewarm + boot)
       - PulseAIWorldCore / PulseWorldCore (world snapshots)
       - PulseTrustEvidence (evidence chunking)
       - OvermindPrime (prewarmed views)
       - Any organ that needs deterministic chunking without interpretation."

  evo:
    chunker: true
    dualBand: true
    binaryAware: true
    symbolicAware: true
    lane32: true
    prewarmAware: true
    cacheAware: true

    deterministic: true
    driftProof: true
    pureCompute: true
    zeroNetwork: true
    zeroFilesystem: true
    zeroMutationOfInput: true

  boundaries:
    - "No semantic understanding."
    - "No AI reasoning or inference."
    - "No mutation of upstream data."
    - "No compression beyond structural chunking."
    - "No encryption or obfuscation."

  contract:
    input:
      - chunkBinary(buffer, options)
      - chunkJSON(value, options)
      - reassembleBinary(chunks)
      - reassembleJSON(chunks)
      - prewarmPattern(label, pattern)
    output:
      - getLaneStats()
      - getPatterns()
      - getMeta()

  identity:
    band: "ai_core"
    type: "organ"
    mind: false
    immutable: true
*/

// ============================================================================
//  META
// ============================================================================
export const PulseAIChunkerMeta = Object.freeze({
  id: "PulseAIChunker-v16.2-IMMORTAL",
  version: "16.2.0",
  role: "AI_CHUNKER",
  layer: "ai_core",
  mind: false,
  description:
    "IMMORTAL 32-lane dualband chunker for binary + symbolic payloads.",
  identity: {
    type: "organ",
    name: "PulseAIChunker",
    band: "ai_core",
    mind: false,
    immutable: true
  },
  lanes: 32
});

// ============================================================================
//  INTERNAL HELPERS
// ============================================================================
function _now() {
  return Date.now();
}

function _toUint8Array(input) {
  if (input instanceof Uint8Array) return input;
  if (input instanceof ArrayBuffer) return new Uint8Array(input);
  if (Array.isArray(input)) return new Uint8Array(input);
  throw new TypeError("Unsupported binary input type for PulseAIChunker.");
}

function _safeJSONStringify(value) {
  try {
    return JSON.stringify(value);
  } catch {
    return JSON.stringify({ error: "unserializable", type: typeof value });
  }
}

function _safeJSONParse(str) {
  try {
    return JSON.parse(str);
  } catch {
    return null;
  }
}

// ============================================================================
//  CLASS — 32-LANE DUALBAND CHUNKER
// ============================================================================
export class PulseAIChunker {
  constructor(config = {}) {
    this.config = Object.freeze({
      id: config.id || PulseAIChunkerMeta.id,
      defaultChunkSize: config.defaultChunkSize || 4096,
      maxChunkSize: config.maxChunkSize || 65536,
      lanes: PulseAIChunkerMeta.lanes,
      trace: !!config.trace
    });

    // Lane stats: purely structural metrics, no content
    this.laneStats = new Array(this.config.lanes).fill(null).map((_, lane) =>
      Object.seal({
        lane,
        chunks: 0,
        bytes: 0,
        lastTs: null
      })
    );

    // Prewarmed patterns (label -> pattern)
    this.patterns = new Map();
  }

  // --------------------------------------------------------------------------
  //  META
  // --------------------------------------------------------------------------
  getMeta() {
    return PulseAIChunkerMeta;
  }

  getLaneStats() {
    return this.laneStats.map((s) => ({ ...s }));
  }

  getPatterns() {
    const out = {};
    for (const [k, v] of this.patterns.entries()) {
      out[k] = v;
    }
    return out;
  }

  // --------------------------------------------------------------------------
  //  PREWARM PATTERN
  //  - purely structural: stores pattern metadata for future chunking
  // --------------------------------------------------------------------------
  prewarmPattern(label, pattern = {}) {
    if (!label) return;
    const stored = Object.freeze({
      label,
      ts: _now(),
      pattern: {
        defaultChunkSize:
          pattern.defaultChunkSize || this.config.defaultChunkSize,
        maxChunkSize: pattern.maxChunkSize || this.config.maxChunkSize,
        lanes: pattern.lanes || this.config.lanes,
        band: pattern.band || "dual"
      }
    });
    this.patterns.set(label, stored);
    return stored;
  }

  // --------------------------------------------------------------------------
  //  LANE ASSIGNMENT (ROUND-ROBIN, DETERMINISTIC PER INSTANCE)
// --------------------------------------------------------------------------
  _assignLane(counterRef) {
    const lane = counterRef.value % this.config.lanes;
    counterRef.value += 1;
    return lane;
  }

  // --------------------------------------------------------------------------
  //  BINARY CHUNKING
  // --------------------------------------------------------------------------
  chunkBinary(buffer, options = {}) {
    const ts = _now();
    const band = options.band || "binary";
    const label = options.label || null;

    const bytes = _toUint8Array(buffer);
    const totalLength = bytes.length;

    const pattern =
      (label && this.patterns.get(label)?.pattern) || this.config;

    const chunkSize = Math.min(
      Math.max(pattern.defaultChunkSize, 1),
      pattern.maxChunkSize
    );

    const chunks = [];
    const laneCounter = { value: 0 };

    for (let offset = 0; offset < totalLength; offset += chunkSize) {
      const lane = this._assignLane(laneCounter);
      const end = Math.min(offset + chunkSize, totalLength);
      const slice = bytes.subarray(offset, end);

      const chunk = Object.freeze({
        meta: {
          chunkerId: this.config.id,
          ts,
          band,
          type: "binary",
          lane,
          index: chunks.length,
          total: null, // filled after loop
          label,
          size: slice.length
        },
        payload: slice
      });

      chunks.push(chunk);

      const stat = this.laneStats[lane];
      stat.chunks += 1;
      stat.bytes += slice.length;
      stat.lastTs = ts;
    }

    // Fill total count
    for (const c of chunks) {
      c.meta.total = chunks.length;
    }

    if (this.config.trace) {
      console.log("[PulseAIChunker] chunkBinary", {
        label,
        band,
        totalLength,
        chunkSize,
        chunks: chunks.length
      });
    }

    return Object.freeze(chunks);
  }

  // --------------------------------------------------------------------------
  //  BINARY REASSEMBLY
  // --------------------------------------------------------------------------
  reassembleBinary(chunks = []) {
    if (!Array.isArray(chunks) || chunks.length === 0) return new Uint8Array(0);

    const sorted = [...chunks].sort(
      (a, b) => (a.meta?.index ?? 0) - (b.meta?.index ?? 0)
    );

    const totalBytes = sorted.reduce(
      (sum, c) => sum + (c.payload?.length ?? 0),
      0
    );

    const out = new Uint8Array(totalBytes);
    let offset = 0;

    for (const c of sorted) {
      const slice = c.payload || new Uint8Array(0);
      out.set(slice, offset);
      offset += slice.length;
    }

    return out;
  }

  // --------------------------------------------------------------------------
  //  JSON / SYMBOLIC CHUNKING (STRINGIFIED)
// --------------------------------------------------------------------------
  chunkJSON(value, options = {}) {
    const ts = _now();
    const band = options.band || "symbolic";
    const label = options.label || null;

    const json = _safeJSONStringify(value);
    const encoder = new TextEncoder();
    const bytes = encoder.encode(json);

    const binaryChunks = this.chunkBinary(bytes, {
      band,
      label
    });

    // Wrap binary chunks as JSON chunks (type annotation only)
    const jsonChunks = binaryChunks.map((c) =>
      Object.freeze({
        meta: {
          ...c.meta,
          type: "json"
        },
        payload: c.payload
      })
    );

    if (this.config.trace) {
      console.log("[PulseAIChunker] chunkJSON", {
        label,
        band,
        length: json.length,
        chunks: jsonChunks.length
      });
    }

    return Object.freeze(jsonChunks);
  }

  // --------------------------------------------------------------------------
  //  JSON / SYMBOLIC REASSEMBLY
  // --------------------------------------------------------------------------
  reassembleJSON(chunks = []) {
    const binary = this.reassembleBinary(chunks);
    const decoder = new TextDecoder();
    const json = decoder.decode(binary);
    return _safeJSONParse(json);
  }
}

// ============================================================================
//  FACTORY
// ============================================================================
export function createPulseAIChunker(config = {}) {
  const core = new PulseAIChunker(config);

  return Object.freeze({
    meta: PulseAIChunkerMeta,
    getMeta: () => core.getMeta(),
    getLaneStats: () => core.getLaneStats(),
    getPatterns: () => core.getPatterns(),
    prewarmPattern: (label, pattern) => core.prewarmPattern(label, pattern),
    chunkBinary: (buffer, options) => core.chunkBinary(buffer, options),
    reassembleBinary: (chunks) => core.reassembleBinary(chunks),
    chunkJSON: (value, options) => core.chunkJSON(value, options),
    reassembleJSON: (chunks) => core.reassembleJSON(chunks)
  });
}

// ============================================================================
//  DEFAULT SINGLETON (OPTIONAL)
// ============================================================================
export const pulseAIChunker = createPulseAIChunker({
  id: "PulseAIChunker-Default",
  defaultChunkSize: 4096,
  maxChunkSize: 65536,
  trace: false
});
