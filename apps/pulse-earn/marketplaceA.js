// ============================================================================
// FILE: tropic-pulse-functions/apps/pulse-earn/marketplaceA.js
// LAYER: THE STANDARD BEARER (Marketplace Protocol + Universal Adapter)
// ============================================================================
//
// ROLE:
//   THE STANDARD BEARER — Pulse‑Earn’s canonical marketplace template.
//   • Defines the universal interface for all marketplaces
//   • Provides a config‑driven, reusable adapter
//   • Establishes the minimum contract (ping, fetchJobs, submitResult)
//
// WHY “STANDARD BEARER”?:
//   • It carries the protocol that all marketplaces must follow
//   • It is the blueprint for custom + dynamic marketplaces
//   • It sets the rules, expectations, and safe defaults
//   • It is the constitution of the Earn marketplace layer
//
// PURPOSE:
//   • Provide a deterministic, drift‑proof marketplace template
//   • Allow runtime configuration for custom integrations
//   • Guarantee safe HTTP behavior + fallback values
//
// CONTRACT:
//   • PURE NETWORK ADAPTER — no AI layers, no translation, no memory model
//   • READ‑ONLY except for config overrides
//   • NO eval(), NO Function(), NO dynamic imports
//   • NO executing user code
//   • Deterministic fetch‑based wrapper only
//
// SAFETY:
//   • v6.3 upgrade is COMMENTAL ONLY — NO LOGIC CHANGES
//   • All behavior remains identical to pre‑v6.3 marketplaceA
// ============================================================================

// ---------------------------------------------------------------------------
// Config — Standard Bearer Identity (runtime‑overrideable)
// ---------------------------------------------------------------------------
let marketplaceConfig = {
  id: "A",
  name: "Marketplace A",
  baseUrl: "https://example-marketplace-A.com",
  endpoints: {
    ping: "/ping",
    jobs: "/jobs",
    submit: "/submit",
  },
};

// ---------------------------------------------------------------------------
// configureMarketplaceA — Safe, shallow config override
// ---------------------------------------------------------------------------
export function configureMarketplaceA(config) {
  marketplaceConfig = {
    ...marketplaceConfig,
    ...config,
    endpoints: {
      ...marketplaceConfig.endpoints,
      ...(config?.endpoints || {}),
    },
  };
}

// ---------------------------------------------------------------------------
// Helpers — URL Builder
// ---------------------------------------------------------------------------
function buildUrl(pathKey) {
  const base = marketplaceConfig.baseUrl || "";
  const path = marketplaceConfig.endpoints[pathKey] || "";
  return `${base}${path}`;
}

// ---------------------------------------------------------------------------
// Standard Bearer Client — ping(), fetchJobs(), submitResult()
// ---------------------------------------------------------------------------
async function ping() {
  try {
    const start = Date.now();
    const res = await fetch(buildUrl("ping"));
    if (!res.ok) return null;
    return Date.now() - start;
  } catch {
    return null;
  }
}

async function fetchJobs() {
  try {
    const res = await fetch(buildUrl("jobs"));
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

async function submitResult(job, result) {
  try {
    const res = await fetch(buildUrl("submit"), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ jobId: job.id, result }),
    });

    if (!res.ok) {
      return {
        success: false,
        error: `Marketplace submission failed: ${res.status}`,
      };
    }

    return await res.json();
  } catch (err) {
    return {
      success: false,
      error: err.message,
    };
  }
}

// ---------------------------------------------------------------------------
// Export Standard Bearer Adapter
// ---------------------------------------------------------------------------
export const marketplaceA = {
  id: () => marketplaceConfig.id,
  name: () => marketplaceConfig.name,
  ping,
  fetchJobs,
  submitResult,
};
