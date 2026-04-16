// FILE: tropic-pulse-functions/apps/pulse-earn/marketplaces/RenderAdapter.js
//
// RenderAdapter v5 — Deterministic, Drift‑Proof, Self‑Healing Render Adapter
// NO AI LAYERS. NO TRANSLATION. NO MEMORY MODEL. PURE HEALING.
//
// ------------------------------------------------------
// 📘 PAGE INDEX — Source of Truth for This File
// ------------------------------------------------------
//
// ROLE:
//   Render Network Marketplace Client Adapter — defines how Tropic Pulse
//   communicates with the Render GPU rendering marketplace.
//
// RESPONSIBILITIES:
//   • ping()        → measure latency
//   • fetchJobs()   → fetch + normalize jobs
//   • submitResult()→ submit completed results
//   • normalizeJob()→ Render job → Pulse Earn job schema
//   • Maintain adapter healing metadata
//
// THIS FILE IS:
//   • A network adapter for Render Network
//   • A pure ESM client module
//   • A fetch-based HTTP wrapper
//   • A job normalizer
//
// THIS FILE IS NOT:
//   • A ledger client
//   • A wallet/settlement handler
//   • A financial engine
//   • A compute engine
//   • A scheduler
//   • A backend service
//
// SAFETY NOTES:
//   • Never throw unhandled errors (except submitResult, which surfaces errors)
//   • Never mutate raw job objects
//   • Always validate fetch() responses
//   • Remain deterministic and side-effect-free
//
// ------------------------------------------------------
// Healing Metadata
// ------------------------------------------------------

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

// ------------------------------------------------------
// Render Network Marketplace Client
// ------------------------------------------------------

export const RenderAdapter = {
  id: "render",
  name: "Render Network",

  async ping() {
    const url = "https://api.rendernetwork.com/ping";
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

  async fetchJobs(deviceId) {
    const url = "https://api.rendernetwork.com/jobs";

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
      console.error("RenderAdapter.fetchJobs() error:", err);
      healingState.lastFetchError = err.message;
      healingState.lastFetchCount = 0;
      return [];
    }
  },

  async submitResult(job, result) {
    const url = `https://api.rendernetwork.com/jobs/${job.id}/submit`;
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
      console.error("RenderAdapter.submitResult() error:", err);
      healingState.lastSubmitError = err.message;
      throw err;
    }
  },

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

      const payout = Number(raw.reward ?? raw.payout ?? 0);
      if (!Number.isFinite(payout) || payout <= 0) {
        healingState.lastNormalizationError = "non_positive_payout";
        return null;
      }

      const cpuRequired = Number(raw.cpu ?? 2);
      const memoryRequired = Number(raw.memory ?? 2048);
      const estimatedSeconds = Number(raw.estimatedSeconds ?? 900);

      if (!Number.isFinite(estimatedSeconds) || estimatedSeconds <= 0) {
        healingState.lastNormalizationError = "non_positive_duration";
        return null;
      }

      const minGpuScore = raw.gpuRequired ? 400 : 150;
      const bandwidthNeededMbps = Number(
        raw.assetSizeMB ? raw.assetSizeMB / 10 : 10
      );

      const normalized = {
        id: String(raw.id),
        marketplaceId: "render",

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

// ------------------------------------------------------
// Export healing metadata for Earn/Miner healers
// ------------------------------------------------------

export function getRenderAdapterHealingState() {
  return { ...healingState };
}
