// FILE: tropic-pulse-functions/apps/pulse-earn/marketplaces/AkashAdapter.js
//
// AkashAdapter v5 — Deterministic, Drift‑Proof, Self‑Healing Akash Adapter
// NO AI LAYERS. NO TRANSLATION. NO MEMORY MODEL. PURE HEALING.
//
// ------------------------------------------------------
// 📘 PAGE INDEX — Source of Truth for This File
// ------------------------------------------------------
//
// ROLE:
//   Akash Marketplace Client Adapter — defines how Tropic Pulse communicates
//   with the Akash distributed compute marketplace.
//
// RESPONSIBILITIES:
//   • ping()        → measure latency
//   • fetchJobs()   → fetch + normalize leases as jobs
//   • submitResult()→ submit completed results
//   • normalizeJob()→ Akash lease → Pulse Earn job schema
//   • Maintain adapter healing metadata
//
// THIS FILE IS:
//   • A network adapter for Akash Network
//   • A pure ESM client module
//   • A fetch-based HTTP wrapper
//   • A job normalizer
//
// THIS FILE IS NOT:
//   • A ledger client
//   • A wallet/token handler
//   • A financial engine
//   • A compute engine
//   • A scheduler
//   • A backend service
//
// SAFETY NOTES:
//   • Never throw unhandled errors (except submitResult, which surfaces errors)
//   • Never mutate raw lease objects
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
// Akash Marketplace Client
// ------------------------------------------------------

export const AkashAdapter = {
  id: "akash",
  name: "Akash Network",

  async ping() {
    const url = "https://akash-api.polkachu.com/blocks/latest";
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
    const url =
      "https://akash-api.polkachu.com/akash/market/v1beta3/leases/list";

    try {
      const res = await fetch(url);
      if (!res.ok) {
        healingState.lastFetchError = `non_ok_status_${res.status}`;
        healingState.lastFetchCount = 0;
        return [];
      }

      const data = await res.json();
      if (!data || !Array.isArray(data.leases)) {
        healingState.lastFetchError = "invalid_leases_payload";
        healingState.lastFetchCount = 0;
        return [];
      }

      const jobs = data.leases
        .map(raw => this.normalizeJob(raw))
        .filter(j => j !== null);

      healingState.lastFetchError = null;
      healingState.lastFetchCount = jobs.length;
      healingState.cycleCount++;
      return jobs;
    } catch (err) {
      console.error("AkashAdapter.fetchJobs() error:", err);
      healingState.lastFetchError = err.message;
      healingState.lastFetchCount = 0;
      return [];
    }
  },

  async submitResult(job, result) {
    const url = `https://akash-api.polkachu.com/akash/market/v1beta3/leases/${job.id}/submit`;
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
      console.error("AkashAdapter.submitResult() error:", err);
      healingState.lastSubmitError = err.message;
      throw err;
    }
  },

  normalizeJob(raw) {
    try {
      if (!raw || typeof raw !== "object") {
        healingState.lastNormalizationError = "invalid_raw_lease";
        return null;
      }
      if (!raw.id) {
        healingState.lastNormalizationError = "missing_id";
        return null;
      }

      const payout = Number(raw.price?.amount ?? 0);
      if (!Number.isFinite(payout) || payout <= 0) {
        healingState.lastNormalizationError = "non_positive_payout";
        return null;
      }

      const cpuRequired = Number(raw.resources?.cpu?.units ?? 1);
      const memoryRequired = Number(raw.resources?.memory?.quantity ?? 1024);
      const estimatedSeconds = Number(raw.duration ?? 600);

      if (!Number.isFinite(estimatedSeconds) || estimatedSeconds <= 0) {
        healingState.lastNormalizationError = "non_positive_duration";
        return null;
      }

      const hasGpu = !!raw.resources?.gpu;
      const normalized = {
        id: String(raw.id),
        marketplaceId: "akash",

        payout,
        cpuRequired,
        memoryRequired,
        estimatedSeconds,

        minGpuScore: hasGpu ? 300 : 100,
        bandwidthNeededMbps: 5,
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
// Export healing metadata for Earn/Earn healers
// ------------------------------------------------------

export function getAkashAdapterHealingState() {
  return { ...healingState };
}
