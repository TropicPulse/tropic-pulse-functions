// ============================================================================
// ForwardEngine.js — v13.1-EVO-PRIME + SHIFTER-PULSE
//  • Dual-band aware (symbolic/binary)
//  • Drift-proof via normalized job/intents (multi-instance safe)
//  • ShifterPulse-first (binary/regular), chunk/memory aware
//  • Deterministic tick sequencing
//  • Forward lane: expand, predict, factor, pattern-find
// ============================================================================

import { createShifterPulse } from "./PulseSBinaryhifterEvolutionaryPulse-v11-Evo.js";

export const ForwardEngineMeta = Object.freeze({
  lane: "forward",
  version: "13.1-EVO-PRIME-SHIFTER",
  identity: "ForwardEngine-v13.1-EVO-PRIME-SHIFTER",
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
    shifterPulseAware: true
  })
});

const FORWARD_JOB_QUEUE_KEY = "evo:forward:jobs";
const FORWARD_RESULT_KEY    = "evo:forward:results";
const FORWARD_METRICS_KEY   = "evo:forward:metrics";

function safe(fn, ...args) {
  try {
    if (typeof fn === "function") return fn(...args);
  } catch (err) {
    console.warn("[ForwardEngine] safe call failed:", err);
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
      type: "evo:forward:unknown",
      payload: {},
      lane: "forward",
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
    type: job.type || "evo:forward:generic",
    payload,
    lane: "forward",
    __band: band === "binary" ? "binary" : "symbolic",
    __dnaTag: typeof payload.__dnaTag === "string" ? payload.__dnaTag : null
  };
}

function normalizeMetrics(base, extra = {}) {
  return {
    lane: "forward",
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
// Factory — Forward Engine v13.1-EVO-PRIME-SHIFTER
// ============================================================================
export function createForwardEngine({
  ShifterPulse,      // new: band-aware binary/regular shifter
  MemoryOrgan,
  BrainOrgan,
  instanceId = "forward-0",
  trace = false
} = {}) {
  if (!ShifterPulse || !MemoryOrgan) {
    throw new Error("[ForwardEngine] ShifterPulse and MemoryOrgan are required.");
  }

  // If caller passes a factory, instantiate it
  const shifter =
    typeof ShifterPulse.create === "function"
      ? ShifterPulse.create({ lane: "forward", instanceId })
      : (ShifterPulse || createShifterPulse({ lane: "forward", instanceId }));

  // --------------------------------------------------------------------------
  // Job intake (drift-proof, normalized)
  // --------------------------------------------------------------------------
  function readJobQueue() {
    const raw = safe(MemoryOrgan.read, FORWARD_JOB_QUEUE_KEY);
    if (!raw || !Array.isArray(raw)) return [];
    return raw;
  }

  function writeJobQueue(queue) {
    safe(MemoryOrgan.write, FORWARD_JOB_QUEUE_KEY, queue);
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
      submittedTick: globalTickId
    });

    writeJobQueue(queue);

    if (trace) console.log("[ForwardEngine] job submitted:", normalized);
  }

  // --------------------------------------------------------------------------
  // Self-generated job when idle (deterministic shape)
  // --------------------------------------------------------------------------
  function createSelfJob() {
    return normalizeJob(
      {
        id: `self-${instanceId}-${globalTickId}`,
        type: "self:evo-forward",
        payload: {
          hint: "self-generated-forward",
          origin: "ForwardEngine"
        }
      },
      { instanceId }
    );
  }

  // --------------------------------------------------------------------------
  // Core forward compute (expand, predict, factor, pattern-find)
// --------------------------------------------------------------------------
  function computeForward(job) {
    const tickId = globalTickId;

    const baseMeta = {
      lane: "forward",
      instanceId,
      tickId,
      jobId: job.id,
      band: job.__band || "symbolic",
      dnaTag: job.__dnaTag || null
    };

    const payload = job.payload || {};

    // Deterministic score: prefer explicit values, fall back to 0.5
    const score =
      typeof payload.score === "number"
        ? payload.score
        : typeof payload.baseScore === "number"
          ? payload.baseScore
          : 0.5;

    const clampedScore = Math.max(0, Math.min(1, score));
    const boostedScore = Math.max(0, Math.min(1, clampedScore + 0.1));

    let patterns = Array.isArray(payload.patterns) ? payload.patterns.slice() : [];

    // Forward lane: expand patterns deterministically if under a threshold
    if (patterns.length < 8) {
      const nextId = `p-${patterns.length + 1}`;
      patterns.push({
        id: nextId,
        weight: boostedScore,
        source: payload.source || "forward-engine",
        lane: "forward"
      });
    }

    const prefillChunks = patterns.map((p) => ({
      id: p.id,
      weight: typeof p.weight === "number" ? p.weight : boostedScore,
      hint: "forward-prefill",
      lane: "forward"
    }));

    const resultPayload = {
      ...payload,
      lane: "forward",
      boostedScore,
      patterns,
      prefillChunks,
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
  // Binary/regular encode + chunk + write results via ShifterPulse
  // --------------------------------------------------------------------------
  function writeResult(result) {
    const band = result.metrics.band || "symbolic";

    const encoded =
      safe(shifter.encode, result, { band }) ||
      safe(shifter.encode, result); // fallback

    const chunks =
      safe(shifter.chunk, encoded, { band }) ||
      safe(shifter.chunk, encoded) ||
      [];

    const packet = {
      bits: chunks,
      meta: {
        lane: "forward",
        instanceId,
        tickId: result.metrics.tickId,
        jobId: result.metrics.jobId,
        band: result.metrics.band,
        dnaTag: result.metrics.dnaTag
      }
    };

    safe(MemoryOrgan.write, FORWARD_RESULT_KEY, packet);
    safe(MemoryOrgan.write, FORWARD_METRICS_KEY, result.metrics);

    if (trace) {
      console.log("[ForwardEngine] result written:", {
        key: FORWARD_RESULT_KEY,
        metrics: result.metrics
      });
    }
  }

  // --------------------------------------------------------------------------
  // Optional: feed Brain with forward hints
  // --------------------------------------------------------------------------
  function feedBrain(result) {
    if (!BrainOrgan || typeof BrainOrgan.evolve !== "function") return;

    BrainOrgan.evolve({
      type: "evo:forward:hint",
      payload: {
        lane: "forward",
        instanceId,
        tickId: result.metrics.tickId,
        jobId: result.metrics.jobId,
        boostedScore: result.payload.boostedScore,
        patternsCount: result.metrics.patternsCount,
        band: result.metrics.band,
        dnaTag: result.metrics.dnaTag
      }
    });
  }

  // --------------------------------------------------------------------------
  // tick() — one forward evolution step (deterministic lane step)
// --------------------------------------------------------------------------
  function tick() {
    globalTickId += 1;

    let job = takeNextJob();
    if (!job) {
      job = createSelfJob();
      if (trace) console.log("[ForwardEngine] no job in queue, using self job.");
    }

    const result = computeForward(job);
    writeResult(result);
    feedBrain(result);

    if (trace) {
      console.log("[ForwardEngine] tick complete:", {
        tickId: result.metrics.tickId,
        patternsCount: result.metrics.patternsCount
      });
    }

    return { ok: true, metrics: result.metrics };
  }

  // --------------------------------------------------------------------------
  // prewarm() — touch shifter paths (binary + symbolic, deterministic sample)
// --------------------------------------------------------------------------
  function prewarm() {
    const sample = {
      lane: "forward",
      instanceId,
      intent: "prewarm",
      band: "symbolic"
    };

    const encodedSym = safe(shifter.encode, sample, { band: "symbolic" }) ||
                       safe(shifter.encode, sample);
    const chunksSym  = safe(shifter.chunk, encodedSym, { band: "symbolic" }) ||
                       safe(shifter.chunk, encodedSym) ||
                       [];
    const flatSym    = safe(shifter.dechunk, chunksSym, { band: "symbolic" }) ||
                       safe(shifter.dechunk, chunksSym) ||
                       "";
    safe(shifter.decode, flatSym, { band: "symbolic" });

    const encodedBin = safe(shifter.encode, sample, { band: "binary" });
    if (encodedBin) {
      const chunksBin = safe(shifter.chunk, encodedBin, { band: "binary" }) || [];
      const flatBin   = safe(shifter.dechunk, chunksBin, { band: "binary" }) || "";
      safe(shifter.decode, flatBin, { band: "binary" });
    }

    if (trace) console.log("[ForwardEngine] prewarm complete (symbolic + binary).");
    return true;
  }

  return Object.freeze({
    meta: ForwardEngineMeta,
    tick,
    submitJob,
    prewarm
  });
}
