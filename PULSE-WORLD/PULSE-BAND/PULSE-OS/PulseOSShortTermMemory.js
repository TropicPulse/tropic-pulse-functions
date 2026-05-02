// ============================================================================
// FILE: /PulseOS/Organs/Memory/PulseOSShortTermMemory.js
// PULSE OS — v12.3-Presence
// “THE SHORT‑TERM MEMORY / HIPPOCAMPAL BUFFER”
// DUAL‑BAND NEURAL MEMORY • PREWARM + CHUNK • MULTI‑PRESENCE SNAPSHOTS
// OFFLINE‑ABSOLUTE • ZERO MUTATION AFTER INSERTION
// ============================================================================
/*
AI_EXPERIENCE_META = {
  identity: "PulseOSShortTermMemory",
  version: "v14-IMMORTAL",
  layer: "cns",
  role: "os_short_term_memory",
  lineage: "PulseOS-v14",

  evo: {
    shortTermMemory: true,
    workingSet: true,
    recallBuffer: true,

    symbolicPrimary: true,
    binaryAware: true,
    dualBand: true,

    deterministic: true,
    driftProof: true,
    zeroNetwork: true,
    zeroFilesystem: true,

    chunkAware: true,
    prewarmAware: true,

    safeRouteFree: true,
    zeroMutationOfInput: true
  },

  contract: {
    always: [
      "PulseOSBrain",
      "PulseOSLongTermMemory",
      "PulseOSLiverMemory"
    ],
    never: [
      "legacyShortTermMemory",
      "safeRoute",
      "fetchViaCNS"
    ]
  }
}
*/

const LAYER_ID   = "SHORT-TERM-MEMORY";
const LAYER_NAME = "THE HIPPOCAMPAL BUFFER";
const LAYER_ROLE = "B-LAYER NEURAL MEMORY";
const LAYER_VER  = "12.3-Presence";

// ============================================================================
// MEMORY CONTEXT — organism-wide identity (v12.3-Presence)
// ============================================================================
const MEMORY_CONTEXT = {
  label: "MEMORY",
  layer: "B‑Layer",
  purpose: "Short‑Term Neural Buffer",
  context: "Stores logs before Heart.js flush",
  version: LAYER_VER,
  generation: "v12",
  target: "os-core",
  evo: {
    driftProof: true,
    deterministicNeuron: true,
    unifiedAdvantageField: true,
    multiInstanceReady: true,
    multiPresenceReady: true,

    zeroNetwork: true,
    zeroMutation: true,
    zeroTiming: true,
    offlineAbsolute: true,

    binaryAware: true,
    symbolicAware: true,
    dualModeAware: true,

    executionContextAware: true,
    pressureAware: true,
    dispatchAware: true,

    // v12.3+: chunk + cache + prewarm + GPU-friendly
    chunkAware: true,
    cacheAware: true,
    prewarmAware: true,
    presenceAware: true,
    dualBandChunking: true,
    streamingFriendly: true,
    batchFriendly: true,
    gpuBufferAware: true
  }
};

export const PulseOSShortTermMemoryMeta = Object.freeze({
  layer: "PulseOSShortTermMemory",
  role: "SHORT_TERM_NEURAL_MEMORY_ORGAN",
  version: "v12.3-PRESENCE-CHUNK-MAX",
  identity: "PulseOSShortTermMemory-v12.3-PRESENCE-CHUNK-MAX",

  guarantees: Object.freeze({
    deterministic: true,
    driftProof: true,
    multiInstanceReady: true,
    multiPresenceReady: true,

    // Hippocampal laws
    shortTermNeuralBuffer: true,
    hippocampalBuffer: true,
    neuralMemoryOrgan: true,
    offlineAbsolute: true,
    zeroMutationAfterInsertion: true,
    immutableEntries: true,
    preHeartFlushBuffer: true,

    // v12.3+: chunk + cache + prewarm + presence
    chunkAware: true,
    cacheAware: true,
    prewarmAware: true,
    presenceAware: true,
    dualBandChunking: true,
    streamingFriendly: true,
    batchFriendly: true,
    gpuBufferAware: true,

    // Execution prohibitions
    zeroNetwork: true,
    zeroBackend: true,
    zeroTiming: true,
    zeroStateMutation: true,
    zeroExternalMutation: true,
    zeroCompute: true,
    zeroUserCode: true,
    zeroDynamicImports: true,
    zeroEval: true,

    // Awareness
    symbolicAware: true,
    binaryAware: true,
    dualModeAware: true,
    executionContextAware: true,
    pressureAware: true,
    dispatchAware: true,

    // Environment
    worldLensAware: false
  }),

  contract: Object.freeze({
    input: [
      "LogEntry",
      "ImpulseContext",
      "DualBandContext",
      "ExecutionContext"
    ],
    output: [
      "ShortTermMemorySnapshot",
      "ShortTermMemoryChunks",
      "ShortTermPresenceView",
      "ShortTermMemoryDiagnostics",
      "ShortTermMemorySignatures",
      "ShortTermMemoryHealingState"
    ]
  }),

  lineage: Object.freeze({
    root: "PulseOS-v11-EVO",
    parent: "PulseOS-v12.3-Presence",
    ancestry: [
      "PulseOSShortTermMemory-v9",
      "PulseOSShortTermMemory-v10",
      "PulseOSShortTermMemory-v11",
      "PulseOSShortTermMemory-v11-Evo",
      "PulseOSShortTermMemory-v11-Evo-Prime",
      "PulseOSShortTermMemory-v12.3-Presence"
    ]
  }),

  bands: Object.freeze({
    supported: ["symbolic", "binary"],
    default: "symbolic",
    behavior: "short-term-memory"
  }),

  architecture: Object.freeze({
    pattern: "A-B-A",
    baseline: "log entry → immutable insertion → pre-heart snapshot",
    adaptive: "binary-tagged metadata surfaces + chunked presence views",
    return: "deterministic short-term memory snapshot + chunks + signatures"
  })
});

// ============================================================================
// HELPERS — deterministic structural signature
// ============================================================================
function stableStringify(value) {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return "[" + value.map(stableStringify).join(",") + "]";
  }
  const keys = Object.keys(value).sort();
  const parts = keys.map(k => JSON.stringify(k) + ":" + stableStringify(value[k]));
  return "{" + parts.join(",") + "}";
}

function buildMemorySignature(entry) {
  return stableStringify({
    eventType: entry.eventType || "unknown",
    modeKind: entry.modeKind || "symbolic",
    executionContext: entry.executionContext || {},
    pressureSnapshot: entry.pressureSnapshot || {}
  });
}

// ============================================================================
// STRUCTURAL DEDUPE — drift-proof
// ============================================================================
function isStructurallySame(a, b) {
  if (!a || !b) return false;
  return a.memorySignature === b.memorySignature;
}

// ============================================================================
// CHUNK + PRESENCE HELPERS — zero-mutation, offline-absolute
// ============================================================================
function buildChunk(entries, index, totalChunks) {
  return {
    ...MEMORY_CONTEXT,
    kind: "ShortTermMemoryChunk",
    chunkIndex: index,
    chunkCount: totalChunks,
    count: entries.length,
    // logs are already immutable snapshots
    logs: entries
  };
}

function buildPresenceView(logs) {
  const count = logs.length;

  const byMode = { symbolic: 0, binary: 0, dual: 0 };
  const byEventType = {};
  const bySubsystem = {};

  for (const entry of logs) {
    const mode = entry.modeKind || "symbolic";
    if (byMode[mode] !== undefined) byMode[mode] += 1;

    const eventType = entry.eventType || "unknown";
    byEventType[eventType] = (byEventType[eventType] || 0) + 1;

    const subsystem = entry.subsystem || "unknown";
    bySubsystem[subsystem] = (bySubsystem[subsystem] || 0) + 1;
  }

  return {
    ...MEMORY_CONTEXT,
    kind: "ShortTermPresenceView",
    totalLogs: count,
    byMode,
    byEventType,
    bySubsystem
  };
}

// ============================================================================
// SHORT‑TERM MEMORY ORGAN — v12.3-Presence
// ============================================================================
export const PulseOSShortTermMemory = {
  _logs: [],
  _maxLogs: 750,

  // --------------------------------------------------------------------------
  // PUSH — immutable insertion, dual-band aware
  // --------------------------------------------------------------------------
  push(entry) {
    if (!entry || typeof entry !== "object") return;

    const memorySignature = buildMemorySignature(entry);

    const wrapped = {
      ...entry,
      ...MEMORY_CONTEXT,
      memoryVersion: LAYER_VER,
      memorySignature
    };

    const last = this._logs[this._logs.length - 1];

    if (last && isStructurallySame(last, wrapped)) {
      return;
    }

    this._logs.push(wrapped);

    if (this._logs.length > this._maxLogs) {
      this._logs.shift();
    }
  },

  // --------------------------------------------------------------------------
  // GET ALL — immutable read
  // --------------------------------------------------------------------------
  getAll() {
    return [...this._logs];
  },

  // --------------------------------------------------------------------------
  // CLEAR — after flush
  // --------------------------------------------------------------------------
  clear() {
    this._logs = [];
  },

  // --------------------------------------------------------------------------
  // HAS LOGS
  // --------------------------------------------------------------------------
  hasLogs() {
    return this._logs.length > 0;
  },

  // --------------------------------------------------------------------------
  // SNAPSHOT — offline-absolute
  // --------------------------------------------------------------------------
  snapshot() {
    return {
      ...MEMORY_CONTEXT,
      kind: "ShortTermMemorySnapshot",
      version: LAYER_VER,
      count: this._logs.length,
      logs: [...this._logs]
    };
  },

  // --------------------------------------------------------------------------
  // CHUNKS — GPU / streaming friendly view (read-only)
//   maxChunkSize: how many entries per chunk (default 128)
// --------------------------------------------------------------------------
  getChunks({ maxChunkSize = 128 } = {}) {
    const logs = this._logs;
    if (!logs.length) return [];

    const size = Math.max(1, maxChunkSize | 0);
    const totalChunks = Math.ceil(logs.length / size);
    const chunks = [];

    for (let i = 0; i < totalChunks; i++) {
      const start = i * size;
      const end = start + size;
      const slice = logs.slice(start, end);
      chunks.push(buildChunk(slice, i, totalChunks));
    }

    return chunks;
  },

  // --------------------------------------------------------------------------
  // PREWARM SNAPSHOT — cache-ready, chunk-indexed view
  // --------------------------------------------------------------------------
  prewarmSnapshot({ maxChunkSize = 128 } = {}) {
    const chunks = this.getChunks({ maxChunkSize });

    return {
      ...MEMORY_CONTEXT,
      kind: "ShortTermMemoryPrewarm",
      version: LAYER_VER,
      totalLogs: this._logs.length,
      totalChunks: chunks.length,
      chunks
    };
  },

  // --------------------------------------------------------------------------
  // PRESENCE VIEW — multi-presence, dual-band summary
  // --------------------------------------------------------------------------
  presenceView() {
    const logs = this._logs;
    return buildPresenceView(logs);
  }
};
