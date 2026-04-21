// ============================================================================
// FILE: tropic-pulse-functions/apps/pulse-earn/PulseEarnMktCourier.js
// LAYER: THE COURIER (Fast‑Turnaround Compute Runner + Job Delivery Agent)
// PULSE‑EARN v9.x — COMMENTAL / IDENTITY UPGRADE ONLY (NO LOGIC CHANGES)
// ============================================================================
//
// ROLE:
//   THE COURIER — Pulse‑Earn’s lightweight, fast‑turnaround marketplace agent.
//   • Interfaces with the Spheron Compute marketplace
//   • Fetches simple compute jobs
//   • Normalizes them into Pulse‑Earn job schema
//   • Submits completed results
//   • Maintains healing metadata for Earn healers
//
// PURPOSE:
//   • Provide a deterministic, drift‑proof adapter for Spheron Compute
//   • Maintain strict protocol boundaries
//   • Ensure safe, predictable job delivery communication
//
// CONTRACT:
//   • PURE NETWORK ADAPTER — no AI layers, no translation, no memory model
//   • READ‑ONLY except for healing metadata
//   • NO eval(), NO Function(), NO dynamic imports
//   • NO executing user code
//   • Deterministic normalization only
//
// SAFETY:
//   • v9.x upgrade is COMMENTAL / IDENTITY ONLY — NO LOGIC CHANGES
//   • All behavior remains identical to pre‑v9.x SpheronAdapter
// ============================================================================

// ---------------------------------------------------------------------------
// Healing Metadata — Courier Interaction Log
// ---------------------------------------------------------------------------
const healingState = {
  lastPingMs: null,
  lastPingError: null,
  lastFetchCount: 0,
  lastFetchError: null,
  lastSubmitJobId: null,
  lastSubmitError: null,
  lastNormalizedJobId: null,
  lastNormalizationError: null,

  // Spheron-specific metadata
  lastPayloadVersion: null,
  lastJobType: null,
  lastResourceShape: null,
  lastGpuFlag: null,
  liquidityScore: 0,
  payoutVolatility: 0,

  cycleCount: 0,
};

// ---------------------------------------------------------------------------
// INTERNAL — Spheron-Specific Helpers
// ---------------------------------------------------------------------------
function safeGet(obj, path, fallback = null) {
  try {
    return path
      .split(".")
      .reduce((o, k) => (o && o[k] !== undefined ? o[k] : null), obj) ?? fallback;
  } catch {
    return fallback;
  }
}

function updateVolatility(jobs) {
  const count = jobs.length;
  const payouts = jobs
    .map(j => Number(j.payout ?? 0))
    .filter(n => Number.isFinite(n));

  healingState.liquidityScore = Math.abs(
    count - (healingState.lastFetchCount || 0)
  );

  if (payouts.length > 1) {
    const avg = payouts.reduce((a, b) => a + b, 0) / payouts.length;
    const variance =
      payouts.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / payouts.length;
    healingState.payoutVolatility = variance;
  }
}

// ---------------------------------------------------------------------------
// COURIER CLIENT — Spheron Compute Interface
// ---------------------------------------------------------------------------
export const PulseEarnMktCourier = {
  id: "spheron",
  name: "Spheron Compute",

  // -------------------------------------------------------------------------
  // Ping — Measure courier route latency
  // -------------------------------------------------------------------------
  async ping() {
    const url = "https://api-v2.spheron.network/health";
    const start = Date.now();

    try {
      const res = await fetch(url);
      if (!res.ok) {
        healingState.lastPingError = `non_ok_status_${res.status}`;
        return null;
      }

      const latency = Date.now() - start;
      healingState.lastPingMs = latency;
      healingState.lastPingError = null;
      healingState.cycleCount++;
      return latency;
    } catch (err) {
      healingState.lastPingError = err.message;
      return null;
    }
  },

  // -------------------------------------------------------------------------
  // Fetch Jobs — Pick up compute tasks from Spheron
  // -------------------------------------------------------------------------
  async fetchJobs(deviceId) {
    const url = "https://api-v2.spheron.network/compute/jobs";

    try {
      const res = await fetch(url);
      if (!res.ok) {
        healingState.lastFetchError = `non_ok_status_${res.status}`;
        healingState.lastFetchCount = 0;
        return [];
      }

      const data = await res.json();

      // Track schema drift
      healingState.lastPayloadVersion =
        typeof data === "object" ? Object.keys(data).join(",") : "unknown";

      if (!data || !Array.isArray(data.jobs)) {
        healingState.lastFetchError = "invalid_jobs_payload";
        healingState.lastFetchCount = 0;
        return [];
      }

      const jobs = data.jobs
        .map(raw => this.normalizeJob(raw))
        .filter(j => j !== null);

      updateVolatility(jobs);

      healingState.lastFetchError = null;
      healingState.lastFetchCount = jobs.length;
      healingState.cycleCount++;
      return jobs;
    } catch (err) {
      // eslint-disable-next-line no-console
      error("PulseEarnMktCourier.fetchJobs() error:", err);
      healingState.lastFetchError = err.message;
      healingState.lastFetchCount = 0;
      return [];
    }
  },

  // -------------------------------------------------------------------------
  // Submit Result — Deliver completed work back to Spheron
  // -------------------------------------------------------------------------
  async submitResult(job, result) {
    const url = `https://api-v2.spheron.network/compute/jobs/${job.id}/submit`;
    healingState.lastSubmitJobId = job?.id ?? null;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ result }),
      });

      const json = await res.json();
      healingState.lastSubmitError = null;
      healingState.cycleCount++;
      return json;
    } catch (err) {
      // eslint-disable-next-line no-console
      error("PulseEarnMktCourier.submitResult() error:", err);
      healingState.lastSubmitError = err.message;
      throw err;
    }
  },

  // -------------------------------------------------------------------------
  // Normalize Job — Convert Spheron job → Pulse‑Earn job schema
  // -------------------------------------------------------------------------
  normalizeJob(raw) {
    try {
      if (!raw || typeof raw !== "object") {
        healingState.lastNormalizationError = "invalid_raw_job";
        return null;
      }
      if (!raw.id) {
        healingState.lastNormalizationError = "missing_id";
        return null;
      }

      // Track job type (Spheron sometimes includes this)
      healingState.lastJobType = safeGet(raw, "type", "unknown");

      const payout = Number(raw.payout ?? raw.price ?? 0);
      if (!Number.isFinite(payout) || payout <= 0) {
        healingState.lastNormalizationError = "non_positive_payout";
        return null;
      }

      const cpuRequired = Number(raw.cpu ?? 1);
      const memoryRequired = Number(raw.memory ?? 1024);
      const estimatedSeconds = Number(raw.estimatedSeconds ?? 600);

      healingState.lastResourceShape = {
        cpu: cpuRequired,
        mem: memoryRequired,
        duration: estimatedSeconds,
      };

      if (!Number.isFinite(estimatedSeconds) || estimatedSeconds <= 0) {
        healingState.lastNormalizationError = "non_positive_duration";
        return null;
      }

      // GPU flag inference
      const gpuFlag = !!raw.gpu;
      healingState.lastGpuFlag = gpuFlag ? "gpu" : "cpu";

      const minGpuScore = gpuFlag ? 300 : 100;

      // Spheron jobs are tiny → fixed bandwidth
      const bandwidthNeededMbps = 5;

      const normalized = {
        id: String(raw.id),
        marketplaceId: "spheron",

        payout,
        cpuRequired,
        memoryRequired,
        estimatedSeconds,

        minGpuScore,
        bandwidthNeededMbps,
      };

      healingState.lastNormalizedJobId = normalized.id;
      healingState.lastNormalizationError = null;
      return normalized;
    } catch (err) {
      healingState.lastNormalizationError = err.message;
      return null;
    }
  },
};

// ---------------------------------------------------------------------------
// Healing State Export — Courier Interaction Log
// ---------------------------------------------------------------------------
export function getPulseEarnMktCourierHealingState() {
  return { ...healingState };
}
