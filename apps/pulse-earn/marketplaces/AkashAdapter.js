// ============================================================================
// FILE: tropic-pulse-functions/apps/pulse-earn/marketplaces/AkashAdapter.js
// LAYER: THE AMBASSADOR (Marketplace Liaison + External Negotiator)
// ============================================================================
//
// ROLE:
//   THE AMBASSADOR — Pulse‑Earn’s diplomatic interface to the Akash Network.
//   • Communicates with the external compute marketplace
//   • Fetches leases → normalizes them into Pulse‑Earn jobs
//   • Submits completed results
//   • Tracks healing metadata for Earn healers
//
// PURPOSE:
//   • Provide a deterministic, drift‑proof adapter for Akash
//   • Maintain strict protocol boundaries
//   • Ensure safe, predictable marketplace communication
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
//   • All behavior remains identical to pre‑v6.3 AkashAdapter
// ============================================================================

// ---------------------------------------------------------------------------
// Healing Metadata — Ambassador Interaction Log
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
  lastLeaseState: null,          // NEW: track Akash lease state
  lastPayloadVersion: null,      // NEW: track schema drift
  lastResourceShape: null,       // NEW: track resource structure
  cycleCount: 0,
};

// ---------------------------------------------------------------------------
// INTERNAL — Akash-Specific Helpers
// ---------------------------------------------------------------------------

// Akash sometimes returns leases in different shapes depending on provider.
// We harden against that without changing logic.
function safeGet(obj, path, fallback = null) {
  try {
    return path.split(".").reduce((o, k) => (o && o[k] !== undefined ? o[k] : null), obj) ?? fallback;
  } catch {
    return fallback;
  }
}

// Akash lease states we may encounter
const VALID_LEASE_STATES = new Set([
  "active",
  "open",
  "insufficient_funds",
  "closed",
  "unknown"
]);

// ---------------------------------------------------------------------------
// AMBASSADOR CLIENT — Akash Marketplace Interface
// ---------------------------------------------------------------------------
export const AkashAdapter = {
  id: "akash",
  name: "Akash Network",

  // -------------------------------------------------------------------------
  // Ping — Measure diplomatic channel latency
  // -------------------------------------------------------------------------
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

  // -------------------------------------------------------------------------
  // Fetch Jobs — Retrieve leases from the Akash marketplace
  // -------------------------------------------------------------------------
  async fetchJobs(deviceId) {
    const url = "https://akash-api.polkachu.com/akash/market/v1beta3/leases/list";

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

  // -------------------------------------------------------------------------
  // Submit Result — Return completed work to the marketplace
  // -------------------------------------------------------------------------
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

  // -------------------------------------------------------------------------
  // Normalize Job — Convert Akash lease → Pulse‑Earn job schema
  // -------------------------------------------------------------------------
  normalizeJob(raw) {
    try {
      if (!raw || typeof raw !== "object") {
        healingState.lastNormalizationError = "invalid_raw_lease";
        return null;
      }

      // Track lease state
      const leaseState = safeGet(raw, "state", "unknown");
      healingState.lastLeaseState = VALID_LEASE_STATES.has(leaseState) ? leaseState : "unknown";

      if (!raw.id) {
        healingState.lastNormalizationError = "missing_id";
        return null;
      }

      const payout = Number(safeGet(raw, "price.amount", 0));
      if (!Number.isFinite(payout) || payout <= 0) {
        healingState.lastNormalizationError = "non_positive_payout";
        return null;
      }

      const cpuRequired = Number(safeGet(raw, "resources.cpu.units", 1));
      const memoryRequired = Number(safeGet(raw, "resources.memory.quantity", 1024));
      const estimatedSeconds = Number(safeGet(raw, "duration", 600));

      // Track resource shape
      healingState.lastResourceShape = {
        cpu: cpuRequired,
        mem: memoryRequired,
        duration: estimatedSeconds
      };

      if (!Number.isFinite(estimatedSeconds) || estimatedSeconds <= 0) {
        healingState.lastNormalizationError = "non_positive_duration";
        return null;
      }

      const hasGpu = !!safeGet(raw, "resources.gpu", null);

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

// ---------------------------------------------------------------------------
// Healing State Export — Ambassador Interaction Log
// ---------------------------------------------------------------------------
export function getAkashAdapterHealingState() {
  return { ...healingState };
}
