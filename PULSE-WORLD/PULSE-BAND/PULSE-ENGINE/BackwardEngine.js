// ============================================================================
// BackwardEngine.js — v13.1-EVO-PRIME Backward Lane Engine
//  • Dual-band aware (symbolic/binary)
//  • Drift-proof via normalized job/intents (multi-instance safe)
//  • Binary-first, chunk/memory aware
//  • Deterministic tick sequencing
// ============================================================================

export const BackwardEngineMeta = Object.freeze({
  lane: "backward",
  version: "13.1-EVO-PRIME",
  identity: "BackwardEngine-v13.1-EVO-PRIME",
  evo: Object.freeze({
    deterministic: true,
    driftProof: true,
    binaryFirst: true,
    chunkAware: true,
    memoryAware: true,
    multiInstanceReady: true,
    dualBandAware: true,
    symbolicPrimary: true,
    binaryNonExecutable: true
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
// Factory — Backward Engine v13.1-EVO-PRIME
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
  // Binary encode + chunk + write results
  // --------------------------------------------------------------------------
  function writeResult(result) {
    const encoded = safe(BinaryOrgan.encode, result) || "";
    const chunks  = safe(BinaryOrgan.chunk, encoded) || [];

    const packet = {
      bits: chunks,
      meta: {
        lane: "backward",
        instanceId,
        tickId: result.metrics.tickId,
        jobId: result.metrics.jobId,
        band: result.metrics.band,
        dnaTag: result.metrics.dnaTag
      }
    };

    safe(MemoryOrgan.write, BACKWARD_RESULT_KEY, packet);
    safe(MemoryOrgan.write, BACKWARD_METRICS_KEY, result.metrics);

    if (trace) {
      console.log("[BackwardEngine] result written:", {
        key: BACKWARD_RESULT_KEY,
        metrics: result.metrics
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
  // prewarm() — touch binary paths (binary-first, deterministic sample)
// --------------------------------------------------------------------------
  function prewarm() {
    const sample = {
      lane: "backward",
      instanceId,
      intent: "prewarm",
      band: "symbolic"
    };
    const bits   = safe(BinaryOrgan.encode, sample) || "";
    const chunks = safe(BinaryOrgan.chunk, bits) || [];
    const flat   = safe(BinaryOrgan.dechunk, chunks) || "";
    safe(BinaryOrgan.decode, flat);
    if (trace) console.log("[BackwardEngine] prewarm complete.");
    return true;
  }

  return Object.freeze({
    meta: BackwardEngineMeta,
    tick,
    submitJob,
    prewarm
  });
}
