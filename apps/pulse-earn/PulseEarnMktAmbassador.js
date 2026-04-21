// ============================================================================
// FILE: tropic-pulse-functions/apps/pulse-earn/PulseEarnMktAmbassador.js
// LAYER: THE AMBASSADOR
// (Marketplace Liaison + External Negotiator)
// PULSE EARN — v9.2
// ============================================================================
//
// ROLE (v9.2):
//   THE AMBASSADOR — Pulse‑Earn’s diplomatic interface to the Akash Network.
//   • Communicates with the external compute marketplace.
//   • Fetches leases → normalizes them into Pulse‑Earn jobs.
//   • Submits completed results.
//   • Tracks healing metadata for Earn healers.
//
// PURPOSE (v9.2):
//   • Provide a deterministic, drift‑proof adapter for Akash.
//   • Maintain strict protocol boundaries.
//   • Ensure safe, predictable marketplace communication.
//
// CONTRACT (unchanged):
//   • PURE NETWORK ADAPTER — no AI layers, no translation, no memory model.
//   • READ‑ONLY except for healing metadata.
//   • NO eval(), NO Function(), NO dynamic imports.
//   • NO executing user code.
//   • Deterministic normalization only.
//
// SAFETY (unchanged):
//   • v9.2 upgrade is COMMENTAL / IDENTITY ONLY — NO LOGIC CHANGES.
// ============================================================================


// ---------------------------------------------------------------------------
// Healing Metadata — Ambassador Interaction Log
// ---------------------------------------------------------------------------
const ambassadorHealing = {
  lastPingMs: null,
  lastPingError: null,
  lastFetchCount: 0,
  lastFetchError: null,
  lastSubmitJobId: null,
  lastSubmitError: null,
  lastNormalizedJobId: null,
  lastNormalizationError: null,
  lastLeaseState: null,
  lastPayloadVersion: null,
  lastResourceShape: null,
  cycleCount: 0,
};


// ---------------------------------------------------------------------------
// INTERNAL — Akash-Specific Helpers
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
export const PulseEarnMktAmbassador = {
  id: "akash",
  name: "Akash Network",

  // -------------------------------------------------------------------------
  // Ping — Diplomatic Channel Latency
  // -------------------------------------------------------------------------
  async ping() {
    const url = "https://akash-api.polkachu.com/blocks/latest";
    const start = Date.now();

    try {
      const res = await fetch(url);
      if (!res.ok) {
        ambassadorHealing.lastPingError = `non_ok_status_${res.status}`;
        return null;
      }

      const latency = Date.now() - start;
      ambassadorHealing.lastPingMs = latency;
      ambassadorHealing.lastPingError = null;
      ambassadorHealing.cycleCount++;
      return latency;

    } catch (err) {
      ambassadorHealing.lastPingError = err.message;
      return null;
    }
  },

  // -------------------------------------------------------------------------
  // Fetch Jobs — Retrieve leases from Akash
  // -------------------------------------------------------------------------
  async fetchJobs(deviceId) {
    const url = "https://akash-api.polkachu.com/akash/market/v1beta3/leases/list";

    try {
      const res = await fetch(url);
      if (!res.ok) {
        ambassadorHealing.lastFetchError = `non_ok_status_${res.status}`;
        ambassadorHealing.lastFetchCount = 0;
        return [];
      }

      const data = await res.json();

      ambassadorHealing.lastPayloadVersion =
        typeof data === "object" ? Object.keys(data).join(",") : "unknown";

      if (!data || !Array.isArray(data.leases)) {
        ambassadorHealing.lastFetchError = "invalid_leases_payload";
        ambassadorHealing.lastFetchCount = 0;
        return [];
      }

      const jobs = data.leases
        .map(raw => this.normalizeJob(raw))
        .filter(j => j !== null);

      ambassadorHealing.lastFetchError = null;
      ambassadorHealing.lastFetchCount = jobs.length;
      ambassadorHealing.cycleCount++;
      return jobs;

    } catch (err) {
      ambassadorHealing.lastFetchError = err.message;
      ambassadorHealing.lastFetchCount = 0;
      return [];
    }
  },

  // -------------------------------------------------------------------------
  // Submit Result — Certified Marketplace Dispatch
  // -------------------------------------------------------------------------
  async submitResult(job, result) {
    const url = `https://akash-api.polkachu.com/akash/market/v1beta3/leases/${job.id}/submit`;
    ambassadorHealing.lastSubmitJobId = job?.id ?? null;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ result }),
      });

      const json = await res.json();
      ambassadorHealing.lastSubmitError = null;
      ambassadorHealing.cycleCount++;
      return json;

    } catch (err) {
      ambassadorHealing.lastSubmitError = err.message;
      throw err;
    }
  },

  // -------------------------------------------------------------------------
  // Normalize Job — Convert Akash Lease → Pulse‑Earn Job
  // -------------------------------------------------------------------------
  normalizeJob(raw) {
    try {
      if (!raw || typeof raw !== "object") {
        ambassadorHealing.lastNormalizationError = "invalid_raw_lease";
        return null;
      }

      const leaseState = safeGet(raw, "state", "unknown");
      ambassadorHealing.lastLeaseState =
        VALID_LEASE_STATES.has(leaseState) ? leaseState : "unknown";

      if (!raw.id) {
        ambassadorHealing.lastNormalizationError = "missing_id";
        return null;
      }

      const payout = Number(safeGet(raw, "price.amount", 0));
      if (!Number.isFinite(payout) || payout <= 0) {
        ambassadorHealing.lastNormalizationError = "non_positive_payout";
        return null;
      }

      const cpuRequired = Number(safeGet(raw, "resources.cpu.units", 1));
      const memoryRequired = Number(safeGet(raw, "resources.memory.quantity", 1024));
      const estimatedSeconds = Number(safeGet(raw, "duration", 600));

      ambassadorHealing.lastResourceShape = {
        cpu: cpuRequired,
        mem: memoryRequired,
        duration: estimatedSeconds
      };

      if (!Number.isFinite(estimatedSeconds) || estimatedSeconds <= 0) {
        ambassadorHealing.lastNormalizationError = "non_positive_duration";
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

      ambassadorHealing.lastNormalizedJobId = normalized.id;
      ambassadorHealing.lastNormalizationError = null;
      return normalized;

    } catch (err) {
      ambassadorHealing.lastNormalizationError = err.message;
      return null;
    }
  },
};


// ---------------------------------------------------------------------------
// Healing State Export — Ambassador Interaction Log
// ---------------------------------------------------------------------------
export function getPulseEarnMktAmbassadorHealingState() {
  return { ...ambassadorHealing };
}
