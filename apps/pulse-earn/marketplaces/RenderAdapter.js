// ============================================================================
// FILE: tropic-pulse-functions/apps/pulse-earn/marketplaces/RenderAdapter.js
// LAYER: THE ARTISAN (GPU Rendering Specialist + Creative Compute Interpreter)
// ============================================================================
//
// ROLE:
//   THE ARTISAN — Pulse‑Earn’s rendering‑focused marketplace agent.
//   • Interfaces with the Render Network GPU marketplace
//   • Fetches creative compute jobs (frames, scenes, assets)
//   • Normalizes raw render tasks into Pulse‑Earn job schema
//   • Submits completed render outputs
//   • Maintains healing metadata for Earn healers
//
// WHY “ARTISAN”?:
//   • Render Network is a creative compute marketplace
//   • Jobs involve GPU craftsmanship (frames, scenes, assets)
//   • Workloads are structured, artistic, and visually oriented
//   • The Artisan specializes in creative job normalization
//
// PURPOSE:
//   • Provide a deterministic, drift‑proof adapter for Render Network
//   • Maintain strict protocol boundaries
//   • Ensure safe, predictable rendering job communication
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
//   • All behavior remains identical to pre‑v6.3 RenderAdapter
// ============================================================================

// ---------------------------------------------------------------------------
// Healing Metadata — Artisan Interaction Log
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
// ARTISAN CLIENT — Render Network Interface
// ---------------------------------------------------------------------------
export const RenderAdapter = {
  id: "render",
  name: "Render Network",

  // -------------------------------------------------------------------------
  // Ping — Measure creative marketplace latency
  // -------------------------------------------------------------------------
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

  // -------------------------------------------------------------------------
  // Fetch Jobs — Retrieve creative GPU tasks
  // -------------------------------------------------------------------------
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

  // -------------------------------------------------------------------------
  // Submit Result — Return completed render outputs
  // -------------------------------------------------------------------------
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

  // -------------------------------------------------------------------------
  // Normalize Job — Convert Render job → Pulse‑Earn job schema
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

// ---------------------------------------------------------------------------
// Healing State Export — Artisan Interaction Log
// ---------------------------------------------------------------------------
export function getRenderAdapterHealingState() {
  return { ...healingState };
}
