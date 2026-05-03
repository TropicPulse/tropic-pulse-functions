// ============================================================================
// BackwardEngine.js — v14.0-PRESENCE-IMMORTAL Backward Lane Engine
//  • Dual-band aware (symbolic/binary)
//  • Drift-proof via normalized job/intents (multi-instance safe)
//  • Binary-first, chunk/memory aware
//  • Deterministic tick sequencing
//  • ShifterPulse-aware (binary/regular band shifter, non-executable)
// ============================================================================
/*
AI_EXPERIENCE_META = {
  identity: "BackwardEngine",
  version: "v14-IMMORTAL",
  layer: "pulsenet_engine",
  role: "backward_compression_engine",
  lineage: "PulseNet-v14",

  evo: {
    backwardLane: true,            // compression lane
    patternCompression: true,      // compresses symbolic + binary patterns
    jobAware: true,                // consumes Earn + self jobs
    chunkAware: true,              // chunk/dechunk safe
    prewarmAware: true,            // prewarm surfaces

    symbolicPrimary: true,
    binaryAware: true,
    dualBand: true,

    deterministic: true,
    driftProof: true,
    pureCompute: true,
    zeroMutationOfInput: true,

    zeroNetwork: true,
    zeroFilesystem: true
  },

  contract: {
    always: [
      "ForwardEngine",
      "PulseNet",
      "PulseChunker"
    ],
    never: [
      "safeRoute",
      "fetchViaCNS",
      "presenceEngine",
      "meshKernel",
      "routerCore"
    ]
  }
}
*/

import { createShifterPulse as ShifterPulse } from "../PULSE-SHIFTER/PulseBinaryShifterEvolutionaryPulse-v11-Evo.js";

export const BackwardEngineMeta = Object.freeze({
  lane: "backward",
  version: "14.0-PRESENCE-IMMORTAL",
  identity: "BackwardEngine-v14.0-PRESENCE-IMMORTAL",
  evo: Object.freeze({
    deterministic: true,
    driftProof: true,
    binaryFirst: true,
    chunkAware: true,
    memoryAware: true,
    multiInstanceReady: true,
    dualBandAware: true,
    symbolicPrimary: true,
    binaryNonExecutable: true,
    shifterPulseAware: true,     // new: can use ShifterPulse for band-aware encode/chunk
    shifterBinaryRegular: true   // new: binary/regular shifting is descriptive-only
  })
});

const BACKWARD_JOB_QUEUE_KEY = "evo:backward:jobs";
const BACKWARD_RESULT_KEY    = "evo:backward:results";
const BACKWARD_METRICS_KEY   = "evo:backward:metrics";

function safe(fn, ...args) {
  try {
    if (typeof fn === "function") return fn(...args);
  } catch (err) {
    console.warn("[BackwardEngine] safe call failed:", err);
  }
  return undefined;
}

// Monotonic tick sequence (engine-local)
let globalTickId = 0;

// ---------------------------------------------------------------------------
// ShifterPulse adapter — band-aware wrapper around BinaryOrgan
// ---------------------------------------------------------------------------
function createShifterAdapter(BinaryOrgan) {
  const hasShifter =
    ShifterPulse &&
    (typeof ShifterPulse.encode === "function" ||
      typeof ShifterPulse.shiftEncode === "function");

  // We never *require* ShifterPulse; we just prefer it when present.
  function encode(value, { band }) {
    if (hasShifter && typeof ShifterPulse.encode === "function") {
      // band is descriptive-only; no routing, no randomness
      return ShifterPulse.encode(value, { band: band || "symbolic" });
    }
    if (hasShifter && typeof ShifterPulse.shiftEncode === "function") {
      return ShifterPulse.shiftEncode("regular", "binary", value, {
        band: band || "symbolic"
      });
    }
    return safe(BinaryOrgan.encode, value) || "";
  }

  function decode(bits, { band }) {
    if (hasShifter && typeof ShifterPulse.decode === "function") {
      return ShifterPulse.decode(bits, { band: band || "symbolic" });
    }
    if (hasShifter && typeof ShifterPulse.shiftDecode === "function") {
      return ShifterPulse.shiftDecode("binary", "regular", bits, {
        band: band || "symbolic"
      });
    }
    return safe(BinaryOrgan.decode, bits);
  }

  function chunk(bits, { band }) {
    if (hasShifter && typeof ShifterPulse.chunk === "function") {
      return ShifterPulse.chunk(bits, { band: band || "symbolic" }) || [];
    }
    if (hasShifter && typeof ShifterPulse.shiftChunk === "function") {
      return ShifterPulse.shiftChunk("binary", bits, {
        band: band || "symbolic"
      }) || [];
    }
    return safe(BinaryOrgan.chunk, bits) || [];
  }

  function dechunk(chunks, { band }) {
    if (hasShifter && typeof ShifterPulse.dechunk === "function") {
      return ShifterPulse.dechunk(chunks, { band: band || "symbolic" }) || "";
    }
    if (hasShifter && typeof ShifterPulse.shiftDechunk === "function") {
      return ShifterPulse.shiftDechunk("binary", chunks, {
        band: band || "symbolic"
      }) || "";
    }
    return safe(BinaryOrgan.dechunk, chunks) || "";
  }

  return { encode, decode, chunk, dechunk, hasShifter };
}

// ---------------------------------------------------------------------------
// Normalization / multi-instance drift-proofing
// ---------------------------------------------------------------------------
function normalizeJob(job, { instanceId }) {
  if (!job || typeof job !== "object") {
    return {
      id: `job-${instanceId}-${globalTickId}`,
      type: "evo:backward:unknown",
      payload: {},
      lane: "backward",
      __band: "symbolic",
      __dnaTag: null
    };
  }

  const payload = job.payload && typeof job.payload === "object"
    ? job.payload
    : {};

  const band =
    typeof payload.__band === "string"
      ? payload.__band.toLowerCase()
      : "symbolic";

  return {
    id: job.id || `job-${instanceId}-${globalTickId}`,
    type: job.type || "evo:backward:generic",
    payload,
    lane: "backward",
    __band: band === "binary" ? "binary" : "symbolic",
    __dnaTag: typeof payload.__dnaTag === "string" ? payload.__dnaTag : null
  };
}

function normalizeMetrics(base, extra = {}) {
  return {
    lane: "backward",
    instanceId: base.instanceId,
    tickId: base.tickId,
    jobId: base.jobId,
    durationMs: extra.durationMs ?? 0,
    patternsCount: extra.patternsCount ?? 0,
    band: base.band || "symbolic",
    dnaTag: base.dnaTag || null
  };
}

// ============================================================================
// Factory — Backward Engine v14.0-PRESENCE-IMMORTAL
// ============================================================================
export function createBackwardEngine({
  BinaryOrgan,
  MemoryOrgan,
  BrainOrgan,
  instanceId = "backward-0",
  trace = false
} = {}) {
  if (!BinaryOrgan || !MemoryOrgan) {
    throw new Error("[BackwardEngine] BinaryOrgan and MemoryOrgan are required.");
  }

  const Shifter = createShifterAdapter(BinaryOrgan);

  // --------------------------------------------------------------------------
  // Job intake (drift-proof, normalized)
  // --------------------------------------------------------------------------
  function readJobQueue() {
    const raw = safe(MemoryOrgan.read, BACKWARD_JOB_QUEUE_KEY);
    if (!raw || !Array.isArray(raw)) return [];
    return raw;
  }

  function writeJobQueue(queue) {
    safe(MemoryOrgan.write, BACKWARD_JOB_QUEUE_KEY, queue);
  }

  function takeNextJob() {
    const queue = readJobQueue();
    if (!queue.length) return null;
    const job = queue.shift();
    writeJobQueue(queue);
    return normalizeJob(job, { instanceId });
  }

  function submitJob(job) {
    const queue = readJobQueue();
    const normalized = normalizeJob(job, { instanceId });

    queue.push({
      ...normalized,
      // metadata only; not used for randomness
      submittedTick: globalTickId
    });

    writeJobQueue(queue);

    if (trace) console.log("[BackwardEngine] job submitted:", normalized);
  }

  // --------------------------------------------------------------------------
  // Self-generated job when idle (deterministic shape)
  // --------------------------------------------------------------------------
  function createSelfJob() {
    return normalizeJob(
      {
        id: `self-${instanceId}-${globalTickId}`,
        type: "self:evo-backward",
        payload: {
          hint: "self-generated-backward",
          // metadata only
          origin: "BackwardEngine"
        }
      },
      { instanceId }
    );
  }

  // --------------------------------------------------------------------------
  // Core backward compute (stabilize, normalize, compress, pattern-reduce)
// --------------------------------------------------------------------------
  function computeBackward(job) {
    const tickId = globalTickId;

    const baseMeta = {
      lane: "backward",
      instanceId,
      tickId,
      jobId: job.id,
      band: job.__band || "symbolic",
      dnaTag: job.__dnaTag || null
    };

    const payload = job.payload || {};

    // Deterministic score: prefer explicit values, fall back to 0.5
    const score =
      typeof payload.boostedScore === "number"
        ? payload.boostedScore
        : typeof payload.score === "number"
          ? payload.score
          : 0.5;

    const clampedScore = Math.max(0, Math.min(1, score));
    const stabilizedScore = Math.max(0, Math.min(1, clampedScore - 0.05));

    let patterns = Array.isArray(payload.patterns) ? payload.patterns.slice() : [];
    const seen = new Set();
    patterns = patterns.filter((p) => {
      if (!p || typeof p !== "object") return false;
      const key = `${p.id ?? "?"}:${p.weight ?? 0}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    const compressedHints = patterns.slice(0, 4).map((p) => ({
      id: p.id,
      bucket: (typeof p.weight === "number" && p.weight > 0.5) ? "high" : "low"
    }));

    const resultPayload = {
      ...payload,
      lane: "backward",
      stabilizedScore,
      patterns,
      compressedHints,
      __band: baseMeta.band,
      __dnaTag: baseMeta.dnaTag
    };

    const metrics = normalizeMetrics(baseMeta, {
      durationMs: 0, // no wall-clock dependency
      patternsCount: patterns.length
    });

    return {
      meta: baseMeta,
      payload: resultPayload,
      metrics
    };
  }

  // --------------------------------------------------------------------------
  // Binary encode + chunk + write results (ShifterPulse-aware)
// --------------------------------------------------------------------------
  function writeResult(result) {
    const band = result.metrics.band || "symbolic";

    const encoded = Shifter.encode(result, { band }) || "";
    const chunks  = Shifter.chunk(encoded, { band }) || [];

    const packet = {
      bits: chunks,
      meta: {
        lane: "backward",
        instanceId,
        tickId: result.metrics.tickId,
        jobId: result.metrics.jobId,
        band: result.metrics.band,
        dnaTag: result.metrics.dnaTag,
        shifterPulse: Shifter.hasShifter === true ? "enabled" : "fallback-binary"
      }
    };

    safe(MemoryOrgan.write, BACKWARD_RESULT_KEY, packet);
    safe(MemoryOrgan.write, BACKWARD_METRICS_KEY, result.metrics);

    if (trace) {
      console.log("[BackwardEngine] result written:", {
        key: BACKWARD_RESULT_KEY,
        metrics: result.metrics,
        shifterPulse: packet.meta.shifterPulse
      });
    }
  }

  // --------------------------------------------------------------------------
  // Optional: feed Brain with backward hints
  // --------------------------------------------------------------------------
  function feedBrain(result) {
    if (!BrainOrgan || typeof BrainOrgan.evolve !== "function") return;

    BrainOrgan.evolve({
      type: "evo:backward:hint",
      payload: {
        lane: "backward",
        instanceId,
        tickId: result.metrics.tickId,
        jobId: result.metrics.jobId,
        stabilizedScore: result.payload.stabilizedScore,
        patternsCount: result.metrics.patternsCount,
        band: result.metrics.band,
        dnaTag: result.metrics.dnaTag
      }
    });
  }

  // --------------------------------------------------------------------------
  // tick() — one backward evolution step (deterministic lane step)
// --------------------------------------------------------------------------
  function tick() {
    globalTickId += 1;

    let job = takeNextJob();
    if (!job) {
      job = createSelfJob();
      if (trace) console.log("[BackwardEngine] no job in queue, using self job.");
    }

    const result = computeBackward(job);
    writeResult(result);
    feedBrain(result);

    if (trace) {
      console.log("[BackwardEngine] tick complete:", {
        tickId: result.metrics.tickId,
        patternsCount: result.metrics.patternsCount
      });
    }

    return { ok: true, metrics: result.metrics };
  }

  // --------------------------------------------------------------------------
  // prewarm() — touch binary paths via ShifterPulse (binary/regular, deterministic)
// --------------------------------------------------------------------------
  function prewarm() {
    const band = "symbolic";
    const sample = {
      lane: "backward",
      instanceId,
      intent: "prewarm",
      band
    };

    const bits   = Shifter.encode(sample, { band }) || "";
    const chunks = Shifter.chunk(bits, { band }) || [];
    const flat   = Shifter.dechunk(chunks, { band }) || "";
    Shifter.decode(flat, { band });

    if (trace) {
      console.log("[BackwardEngine] prewarm complete.", {
        band,
        shifterPulse: Shifter.hasShifter === true ? "enabled" : "fallback-binary"
      });
    }
    return true;
  }

  return Object.freeze({
    meta: BackwardEngineMeta,
    tick,
    submitJob,
    prewarm
  });
}
