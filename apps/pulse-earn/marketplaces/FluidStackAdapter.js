// ============================================================================
// FILE: tropic-pulse-functions/apps/pulse-earn/marketplaces/FluidStackAdapter.js
// LAYER: THE BROKER (Opportunistic Job Trader + Elastic Flow Agent)
// ============================================================================
//
// ROLE:
//   THE BROKER — Pulse‑Earn’s fast‑flow, opportunistic marketplace agent.
//   • Interfaces with the FluidStack compute marketplace
//   • Fetches high‑volume, fluid jobs
//   • Normalizes raw offers into Pulse‑Earn job schema
//   • Submits completed results
//   • Maintains healing metadata for Earn healers
//
// WHY “BROKER”?:
//   • FluidStack is not diplomatic like Akash (Ambassador)
//   • It is transactional, elastic, burst‑driven, and fluid
//   • Jobs appear/disappear rapidly — like market liquidity
//   • The Broker thrives in fast‑moving markets
//   • Executes trades, not treaties
//
// PURPOSE:
//   • Provide a deterministic, drift‑proof adapter for FluidStack
//   • Maintain strict protocol boundaries
//   • Ensure safe, predictable marketplace communication
//
// CONTRACT:
//   • PURE NETWORK ADAPTER — no AI layers, no translation, no memory model
//   • READ‑ONLY except for healing metadata
//   • NO eval(), NO Function(), NO dynamic imports
//   • NO executing user code
//   • NO network calls beyond marketplace endpoints
//   • Deterministic normalization only
//
// SAFETY:
//   • v6.3 upgrade is COMMENTAL ONLY — NO LOGIC CHANGES
//   • All behavior remains identical to pre‑v6.3 FluidStackAdapter
// ============================================================================

// ---------------------------------------------------------------------------
// Healing Metadata — Broker Interaction Log
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
  cycleCount: 0,
};

// ---------------------------------------------------------------------------
// BROKER CLIENT — FluidStack Marketplace Interface
// ---------------------------------------------------------------------------
export const FluidStackAdapter = {
  id: "fluidstack",
  name: "FluidStack",

  // -------------------------------------------------------------------------
  // Ping — Measure market channel latency
  // -------------------------------------------------------------------------
  async ping() {
    const url = "https://api.fluidstack.io/ping";
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
  // Fetch Jobs — Retrieve fluid job offers from the marketplace
  // -------------------------------------------------------------------------
  async fetchJobs(deviceId) {
    const url = "https://api.fluidstack.io/jobs";

    try {
      const res = await fetch(url);
      if (!res.ok) {
        healingState.lastFetchError = `non_ok_status_${res.status}`;
        healingState.lastFetchCount = 0;
        return [];
      }

      const data = await res.json();
      if (!data || !Array.isArray(data.jobs)) {
        healingState.lastFetchError = "invalid_jobs_payload";
        healingState.lastFetchCount = 0;
        return [];
      }

      const jobs = data.jobs
        .map(raw => this.normalizeJob(raw))
        .filter(j => j !== null);

      healingState.lastFetchError = null;
      healingState.lastFetchCount = jobs.length;
      healingState.cycleCount++;
      return jobs;
    } catch (err) {
      console.error("FluidStackAdapter.fetchJobs() error:", err);
      healingState.lastFetchError = err.message;
      healingState.lastFetchCount = 0;
      return [];
    }
  },

  // -------------------------------------------------------------------------
  // Submit Result — Return completed work to the marketplace
  // -------------------------------------------------------------------------
  async submitResult(job, result) {
    const url = `https://api.fluidstack.io/jobs/${job.id}/submit`;
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
      console.error("FluidStackAdapter.submitResult() error:", err);
      healingState.lastSubmitError = err.message;
      throw err;
    }
  },

  // -------------------------------------------------------------------------
  // Normalize Job — Convert FluidStack job → Pulse‑Earn job schema
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

      const payout = Number(raw.payout ?? raw.price ?? 0);
      if (!Number.isFinite(payout) || payout <= 0) {
        healingState.lastNormalizationError = "non_positive_payout";
        return null;
      }

      const cpuRequired = Number(raw.cpu ?? 2);
      const memoryRequired = Number(raw.memory ?? 2048);
      const estimatedSeconds = Number(raw.estimatedSeconds ?? 1200);

      if (!Number.isFinite(estimatedSeconds) || estimatedSeconds <= 0) {
        healingState.lastNormalizationError = "non_positive_duration";
        return null;
      }

      const minGpuScore = raw.gpuRequired ? 500 : 150;
      const bandwidthNeededMbps = Number(
        raw.dataSizeMB ? raw.dataSizeMB / 20 : 5
      );

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
// Healing State Export — Broker Interaction Log
// ---------------------------------------------------------------------------
export function getFluidStackAdapterHealingState() {
  return { ...healingState };
}
