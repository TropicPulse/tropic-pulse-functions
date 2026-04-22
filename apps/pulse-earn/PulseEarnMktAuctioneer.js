// ============================================================================
// FILE: tropic-pulse-functions/apps/pulse-earn/PulseEarnMktAuctioneer.js
// LAYER: THE AUCTIONEER
// (Bid‑Floor Interpreter + Volatility Handler + Market Chaos Normalizer)
// PULSE‑EARN v9.x — COMMENTAL / IDENTITY UPGRADE ONLY (NO LOGIC CHANGES)
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
//   • v9.x upgrade is COMMENTAL / IDENTITY ONLY — NO LOGIC CHANGES
// ============================================================================
// ============================================================================
// FILE: tropic-pulse-functions/apps/pulse-earn/PulseEarnMktAuctioneer.js
// LAYER: THE AUCTIONEER
// (Bid‑Floor Interpreter + Volatility Handler + Market Chaos Normalizer)
// PULSE‑EARN v9.x — COMMENTAL / IDENTITY UPGRADE ONLY (NO LOGIC CHANGES)
// ============================================================================
// ============================================================================
// FILE: tropic-pulse-functions/apps/pulse-earn/PulseEarnMktAuctioneer.js
// LAYER: THE AUCTIONEER
// (Bid‑Floor Interpreter + Volatility Handler + Market Chaos Normalizer)
// PULSE‑EARN v9.x — COMMENTAL / IDENTITY UPGRADE ONLY (NO LOGIC CHANGES)
// ============================================================================

const healingState = {
  lastPingMs: null,
  lastPingError: null,
  lastFetchCount: 0,
  lastFetchError: null,
  lastSubmitJobId: null,
  lastSubmitError: null,
  lastNormalizedJobId: null,
  lastNormalizationError: null,

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
// INTERNAL — API KEY + SAFE GET
// ---------------------------------------------------------------------------
function getKey() {
  return (
    process.env.VAST_API_KEY ||
    "e2f301fe87d52f79a2fe40df698dfd16b7309d6e2ec86cf877d5b05ea0f69d81"
  );
}

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

  healingState.listingVolatility = Math.abs(
    count - (healingState.lastFetchCount || 0)
  );

  if (payouts.length > 1) {
    const avg = payouts.reduce((a, b) => a + b, 0) / payouts.length;
    const variance =
      payouts.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / payouts.length;
    healingState.priceVolatility = variance;
  }
}

// ============================================================================
// AUCTIONEER — Vast.ai Marketplace Adapter
// ============================================================================
export const PulseEarnMktAuctioneer = {
  id: "vast",
  name: "Vast.ai",

  // -------------------------------------------------------------------------
  // PING — Vast API health check
  // -------------------------------------------------------------------------
  async ping() {
    const key = getKey();
    const url = `https://api.vast.ai/v0/users/current`;

    const start = Date.now();
    try {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${key}` }
      });

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
  // FETCH JOBS — Vast.ai "jobs" = GPU offers
  // -------------------------------------------------------------------------
  async fetchJobs(deviceId) {
    const key = getKey();
    const url = `https://api.vast.ai/v0/bundles?q={}`;

    try {
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${key}` }
      });

      if (!res.ok) {
        healingState.lastFetchError = `non_ok_status_${res.status}`;
        healingState.lastFetchCount = 0;
        return [];
      }

      const data = await res.json();
      const offers = data.offers || [];

      healingState.lastPayloadVersion = Object.keys(data).join(",");

      const jobs = offers
        .map(raw => this.normalizeJob(raw))
        .filter(j => j !== null);

      updateVolatility(jobs);

      healingState.lastFetchError = null;
      healingState.lastFetchCount = jobs.length;
      healingState.cycleCount++;
      return jobs;
    } catch (err) {
      healingState.lastFetchError = err.message;
      healingState.lastFetchCount = 0;
      return [];
    }
  },

  // -------------------------------------------------------------------------
  // SUBMIT RESULT — Vast.ai does NOT accept compute results
  // -------------------------------------------------------------------------
  async submitResult(job, result) {
    healingState.lastSubmitJobId = job?.id ?? null;

    healingState.lastSubmitError = null;
    healingState.cycleCount++;

    return {
      ok: true,
      marketplace: "vast",
      jobId: job?.id ?? null,
      note: "Vast.ai does not accept compute results. Pulse‑Earn internal only."
    };
  },

  // -------------------------------------------------------------------------
  // NORMALIZE JOB — Vast → Pulse‑Earn schema
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

      healingState.lastJobType = safeGet(raw, "type", "offer");

      const payout = Number(raw.dph_total ?? raw.price_per_hour ?? 0);
      if (!Number.isFinite(payout) || payout <= 0) {
        healingState.lastNormalizationError = "non_positive_payout";
        return null;
      }

      const cpuRequired = Number(raw.cpu_cores ?? 1);
      const memoryRequired = Number(raw.ram_gb ?? 1) * 1024;
      const estimatedSeconds = 3600;

      healingState.lastResourceShape = {
        cpu: cpuRequired,
        mem: memoryRequired,
        duration: estimatedSeconds,
      };

      const gpuScore = Number(raw.gpu_ram ?? 8) * 10;
      healingState.lastGpuScore = gpuScore;

      const bandwidth = Number(raw.net_up ?? 5);
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
// HEALING STATE EXPORT
// ---------------------------------------------------------------------------
export function getPulseEarnMktAuctioneerHealingState() {
  return { ...healingState };
}
