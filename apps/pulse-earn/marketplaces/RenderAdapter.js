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

  // NEW — Render-specific metadata (allowed)
  lastPayloadVersion: null,
  lastJobType: null,
  lastAssetSizeMB: null,
  lastGpuTier: null,
  lastResourceShape: null,
  payoutVolatility: 0,
  liquidityScore: 0,
  cycleCount: 0,
};

// ---------------------------------------------------------------------------
// INTERNAL — Render-Specific Helpers
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

  healingState.liquidityScore = Math.abs(count - (healingState.lastFetchCount || 0));

  if (payouts.length > 1) {
    const avg = payouts.reduce((a, b) => a + b, 0) / payouts.length;
    const variance = payouts.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / payouts.length;
    healingState.payoutVolatility = variance;
  }
}

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

      // Track job type (Render often includes this)
      healingState.lastJobType = safeGet(raw, "type", "unknown");

      const payout = Number(raw.reward ?? raw.payout ?? 0);
      if (!Number.isFinite(payout) || payout <= 0) {
        healingState.lastNormalizationError = "non_positive_payout";
        return null;
      }

      const cpuRequired = Number(raw.cpu ?? 2);
      const memoryRequired = Number(raw.memory ?? 2048);
      const estimatedSeconds = Number(raw.estimatedSeconds ?? 900);

      healingState.lastResourceShape = {
        cpu: cpuRequired,
        mem: memoryRequired,
        duration: estimatedSeconds
      };

      if (!Number.isFinite(estimatedSeconds) || estimatedSeconds <= 0) {
        healingState.lastNormalizationError = "non_positive_duration";
        return null;
      }

      // GPU tier inference
      const gpuRequired = !!raw.gpuRequired || !!raw.gpuTier;
      const gpuTier = raw.gpuTier ?? (gpuRequired ? "mid" : "none");
      healingState.lastGpuTier = gpuTier;

      const minGpuScore =
        gpuTier === "high" ? 600 :
        gpuTier === "mid"  ? 400 :
        gpuTier === "low"  ? 250 : 150;

      // Asset size → bandwidth inference
      const assetSizeMB = Number(raw.assetSizeMB ?? raw.sceneSizeMB ?? 0);
      healingState.lastAssetSizeMB = assetSizeMB;

      const bandwidthNeededMbps = assetSizeMB > 0
        ? Math.max(10, assetSizeMB / 10)
        : 10;

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
