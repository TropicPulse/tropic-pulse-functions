// ============================================================================
// FILE: tropic-pulse-functions/apps/pulse-earn/marketplaces/VastAdapter.js
// LAYER: THE AUCTIONEER (Bid‑Floor Interpreter + Volatility Handler)
// ============================================================================
//
// ROLE:
//   THE AUCTIONEER — Pulse‑Earn’s agent for the chaotic Vast.ai marketplace.
//   • Interfaces with Vast.ai’s dynamic compute listings
//   • Fetches auction‑style job offers
//   • Normalizes inconsistent metadata into Pulse‑Earn job schema
//   • Submits completed results
//   • Maintains healing metadata for Earn healers
//
// PURPOSE:
//   • Provide a deterministic, drift‑proof adapter for Vast.ai
//   • Maintain strict protocol boundaries
//   • Ensure safe, predictable job normalization
//
// CONTRACT:
//   • PURE NETWORK ADAPTER — no AI layers, no translation, no memory model
//   • READ‑ONLY except for healing metadata
//   • NO eval(), NO Function(), NO dynamic imports
//   • NO executing user code
//   • Deterministic normalization only
//
// SAFETY:
//   • v6.3 upgrade is COMMENTAL ONLY — NO LOGIC CHANGES
// ============================================================================

// ---------------------------------------------------------------------------
// Healing Metadata — Auctioneer Interaction Log
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

  // NEW — Vast-specific metadata
  lastPayloadVersion: null,
  lastJobType: null,
  lastGpuScore: null,
  lastResourceShape: null,
  lastBandwidthInference: null,
  priceVolatility: 0,
  listingVolatility: 0,

  cycleCount: 0,
};

// ---------------------------------------------------------------------------
// INTERNAL — Vast-Specific Helpers
// ---------------------------------------------------------------------------
function safeGet(obj, path, fallback = null) {
  try {
    return path.split(".").reduce((o, k) => (o && o[k] !== undefined ? o[k] : null), obj) ?? fallback;
  } catch {
    return fallback;
  }
}

function updateVolatility(jobs) {
  const count = jobs.length;
  const payouts = jobs.map(j => Number(j.payout ?? 0)).filter(n => Number.isFinite(n));

  healingState.listingVolatility = Math.abs(count - (healingState.lastFetchCount || 0));

  if (payouts.length > 1) {
    const avg = payouts.reduce((a, b) => a + b, 0) / payouts.length;
    const variance = payouts.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / payouts.length;
    healingState.priceVolatility = variance;
  }
}

// ---------------------------------------------------------------------------
// AUCTIONEER CLIENT — Vast.ai Marketplace Interface
// ---------------------------------------------------------------------------
export const VastAdapter = {
  id: "vast",
  name: "Vast.ai",

  // -------------------------------------------------------------------------
  // Ping — Measure auction floor latency
  // -------------------------------------------------------------------------
  async ping() {
    const url = "https://api.vast.ai/v0/ping";
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
  // Fetch Jobs — Retrieve auction‑style listings
  // -------------------------------------------------------------------------
  async fetchJobs(deviceId) {
    const url = "https://api.vast.ai/v0/jobs/list";

    try {
      const res = await fetch(url);
      if (!res.ok) {
        healingState.lastFetchError = `non_ok_status_${res.status}`;
        healingState.lastFetchCount = 0;
        return [];
      }

      const data = await res.json();

      // Track schema drift
      healingState.lastPayloadVersion = typeof data === "object" ? Object.keys(data).join(",") : "unknown";

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
      console.error("VastAdapter.fetchJobs() error:", err);
      healingState.lastFetchError = err.message;
      healingState.lastFetchCount = 0;
      return [];
    }
  },

  // -------------------------------------------------------------------------
  // Submit Result — Return completed work to Vast.ai
  // -------------------------------------------------------------------------
  async submitResult(job, result) {
    const url = `https://api.vast.ai/v0/jobs/${job.id}/submit`;
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
      console.error("VastAdapter.submitResult() error:", err);
      healingState.lastSubmitError = err.message;
      throw err;
    }
  },

  // -------------------------------------------------------------------------
  // Normalize Job — Convert Vast listing → Pulse‑Earn job schema
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

      // Track job type (Vast sometimes includes this)
      healingState.lastJobType = safeGet(raw, "type", "unknown");

      const payout =
        raw.payout ??
        (raw.price_per_hour ? Number(raw.price_per_hour) : 0);

      if (!Number.isFinite(payout) || payout <= 0) {
        healingState.lastNormalizationError = "non_positive_payout";
        return null;
      }

      const cpuRequired = Number(raw.cpu_required ?? raw.cpu ?? 1);
      const memoryRequired = Number(raw.memory_required ?? raw.ram ?? 1024);
      const estimatedSeconds = Number(
        raw.estimated_seconds ?? raw.duration ?? 600
      );

      healingState.lastResourceShape = {
        cpu: cpuRequired,
        mem: memoryRequired,
        duration: estimatedSeconds
      };

      if (!Number.isFinite(estimatedSeconds) || estimatedSeconds <= 0) {
        healingState.lastNormalizationError = "non_positive_duration";
        return null;
      }

      // GPU score inference
      const gpuScore = Number(raw.gpu_score ?? raw.min_gpu_score ?? 100);
      healingState.lastGpuScore = gpuScore;

      // Bandwidth inference
      const bandwidth = Number(raw.bandwidth ?? raw.net_mbps ?? 5);
      healingState.lastBandwidthInference = bandwidth;

      const normalized = {
        id: String(raw.id),
        marketplaceId: "vast",

        payout,
        cpuRequired,
        memoryRequired,
        estimatedSeconds,

        minGpuScore: gpuScore,
        bandwidthNeededMbps: bandwidth,
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
// Healing State Export — Auctioneer Interaction Log
// ---------------------------------------------------------------------------
export function getVastAdapterHealingState() {
  return { ...healingState };
}
