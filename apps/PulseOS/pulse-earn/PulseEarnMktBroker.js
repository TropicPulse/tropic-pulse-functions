// ============================================================================
// FILE: tropic-pulse-functions/apps/pulse-earn/PulseEarnMktBroker.js
// LAYER: THE BROKER
// (Opportunistic Job Trader + Elastic Flow Agent)
// PULSE EARN — v9.2
// ============================================================================
//
// ROLE (v9.2):
//   THE BROKER — Pulse‑Earn’s fast‑flow, opportunistic marketplace agent.
//   • Interfaces with the FluidStack compute marketplace
//   • Fetches high‑volume, fluid jobs
//   • Normalizes raw offers into Pulse‑Earn job schema
//   • Submits completed results
//   • Maintains healing metadata for Earn healers
//
// PURPOSE (v9.2):
//   • Provide a deterministic, drift‑proof adapter for FluidStack
//   • Maintain strict protocol boundaries
//   • Ensure safe, predictable marketplace communication
//
// CONTRACT (unchanged):
//   • PURE NETWORK ADAPTER — no AI layers, no translation, no memory model
//   • READ‑ONLY except for healing metadata
//   • NO eval(), NO Function(), NO dynamic imports
//   • NO executing user code
//   • Deterministic normalization only
//
// SAFETY (unchanged):
//   • v9.2 upgrade is COMMENTAL / IDENTITY ONLY — NO LOGIC CHANGES
// ============================================================================


// ---------------------------------------------------------------------------
// Healing Metadata — Broker Interaction Log
// ---------------------------------------------------------------------------
const brokerHealing = {
  lastPingMs: null,
  lastPingError: null,
  lastFetchCount: 0,
  lastFetchError: null,
  lastSubmitJobId: null,
  lastSubmitError: null,
  lastNormalizedJobId: null,
  lastNormalizationError: null,

  // FluidStack-specific metadata (allowed)
  lastPayloadVersion: null,
  lastJobType: null,
  lastResourceShape: null,
  lastGpuRequirement: null,
  lastBandwidthInference: null,
  liquidityScore: 0,
  payoutVolatility: 0,
  cycleCount: 0,
};


// ---------------------------------------------------------------------------
// INTERNAL — FluidStack-Specific Helpers
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

  brokerHealing.liquidityScore = Math.abs(count - (brokerHealing.lastFetchCount || 0));

  if (payouts.length > 1) {
    const avg = payouts.reduce((a, b) => a + b, 0) / payouts.length;
    const variance =
      payouts.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / payouts.length;
    brokerHealing.payoutVolatility = variance;
  }
}


// ---------------------------------------------------------------------------
// BROKER CLIENT — FluidStack Marketplace Interface
// ---------------------------------------------------------------------------
export const PulseEarnMktBroker = {
  id: "fluidstack",
  name: "FluidStack",

  // -------------------------------------------------------------------------
  // Ping — Market Channel Latency
  // -------------------------------------------------------------------------
  async ping() {
    const url = "https://api.fluidstack.io/ping";
    const start = Date.now();

    try {
      const res = await fetch(url);
      if (!res.ok) {
        brokerHealing.lastPingError = `non_ok_status_${res.status}`;
        return null;
      }

      const latency = Date.now() - start;
      brokerHealing.lastPingMs = latency;
      brokerHealing.lastPingError = null;
      brokerHealing.cycleCount++;
      return latency;

    } catch (err) {
      brokerHealing.lastPingError = err.message;
      return null;
    }
  },

  // -------------------------------------------------------------------------
  // Fetch Jobs — Retrieve fluid job offers
  // -------------------------------------------------------------------------
  async fetchJobs(deviceId) {
    const url = "https://api.fluidstack.io/jobs";

    try {
      const res = await fetch(url);
      if (!res.ok) {
        brokerHealing.lastFetchError = `non_ok_status_${res.status}`;
        brokerHealing.lastFetchCount = 0;
        return [];
      }

      const data = await res.json();

      brokerHealing.lastPayloadVersion =
        typeof data === "object" ? Object.keys(data).join(",") : "unknown";

      if (!data || !Array.isArray(data.jobs)) {
        brokerHealing.lastFetchError = "invalid_jobs_payload";
        brokerHealing.lastFetchCount = 0;
        return [];
      }

      const jobs = data.jobs
        .map(raw => this.normalizeJob(raw))
        .filter(j => j !== null);

      updateVolatility(jobs);

      brokerHealing.lastFetchError = null;
      brokerHealing.lastFetchCount = jobs.length;
      brokerHealing.cycleCount++;
      return jobs;

    } catch (err) {
      brokerHealing.lastFetchError = err.message;
      brokerHealing.lastFetchCount = 0;
      return [];
    }
  },

  // -------------------------------------------------------------------------
  // Submit Result — Certified Marketplace Dispatch
  // -------------------------------------------------------------------------
  async submitResult(job, result) {
    const url = `https://api.fluidstack.io/jobs/${job.id}/submit`;
    brokerHealing.lastSubmitJobId = job?.id ?? null;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ result }),
      });

      const json = await res.json();
      brokerHealing.lastSubmitError = null;
      brokerHealing.cycleCount++;
      return json;

    } catch (err) {
      brokerHealing.lastSubmitError = err.message;
      throw err;
    }
  },

  // -------------------------------------------------------------------------
  // Normalize Job — Convert FluidStack job → Pulse‑Earn job schema
  // -------------------------------------------------------------------------
  normalizeJob(raw) {
    try {
      if (!raw || typeof raw !== "object") {
        brokerHealing.lastNormalizationError = "invalid_raw_job";
        return null;
      }
      if (!raw.id) {
        brokerHealing.lastNormalizationError = "missing_id";
        return null;
      }

      brokerHealing.lastJobType = safeGet(raw, "type", "unknown");

      const payout = Number(raw.payout ?? raw.price ?? 0);
      if (!Number.isFinite(payout) || payout <= 0) {
        brokerHealing.lastNormalizationError = "non_positive_payout";
        return null;
      }

      const cpuRequired = Number(raw.cpu ?? raw.vcpu ?? 2);
      const memoryRequired = Number(raw.memory ?? raw.ram ?? 2048);
      const estimatedSeconds = Number(raw.estimatedSeconds ?? raw.duration ?? 1200);

      brokerHealing.lastResourceShape = {
        cpu: cpuRequired,
        mem: memoryRequired,
        duration: estimatedSeconds
      };

      if (!Number.isFinite(estimatedSeconds) || estimatedSeconds <= 0) {
        brokerHealing.lastNormalizationError = "non_positive_duration";
        return null;
      }

      const gpuRequired = !!raw.gpuRequired || !!raw.gpu;
      brokerHealing.lastGpuRequirement = gpuRequired ? "gpu" : "cpu";

      const minGpuScore = gpuRequired ? 500 : 150;

      const dataSizeMB = Number(raw.dataSizeMB ?? 0);
      const bandwidthNeededMbps =
        dataSizeMB > 0 ? Math.max(5, dataSizeMB / 20) : 5;

      brokerHealing.lastBandwidthInference = bandwidthNeededMbps;

      const normalized = {
        id: String(raw.id),
        marketplaceId: "fluidstack",

        payout,
        cpuRequired,
        memoryRequired,
        estimatedSeconds,

        minGpuScore,
        bandwidthNeededMbps,
      };

      brokerHealing.lastNormalizedJobId = normalized.id;
      brokerHealing.lastNormalizationError = null;
      return normalized;

    } catch (err) {
      brokerHealing.lastNormalizationError = err.message;
      return null;
    }
  },
};


// ---------------------------------------------------------------------------
// Healing State Export — Broker Interaction Log
// ---------------------------------------------------------------------------
export function getPulseEarnMktBrokerHealingState() {
  return { ...brokerHealing };
}
