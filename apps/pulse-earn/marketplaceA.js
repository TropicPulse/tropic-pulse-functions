// FILE: tropic-pulse-functions/apps/pulse-earn/marketplaceA.js
//
// Marketplace A Client Adapter v5 — Deterministic, Drift‑Proof, Config‑Driven HTTP Wrapper
// NO AI LAYERS. NO TRANSLATION. NO MEMORY MODEL. PURE HEALING.
//
// ------------------------------------------------------
// 📘 PAGE INDEX — Source of Truth for This File
// ------------------------------------------------------
//
// ROLE:
//   Marketplace A Client Adapter — defines how Tropic Pulse communicates
//   with a marketplace using the standardized interface:
//     • ping()
//     • fetchJobs()
//     • submitResult()
//
//   This adapter is CONFIG‑DRIVEN and can be reused for multiple
//   connection types by updating its config at runtime.
//
// RESPONSIBILITIES:
//   • Perform safe HTTP requests
//   • Validate responses
//   • Never throw unhandled errors
//   • Return deterministic fallback values
//
// THIS FILE IS:
//   • A network adapter
//   • A pure ESM client module
//   • A fetch-based HTTP wrapper
//
// THIS FILE IS NOT:
//   • A job processor
//   • A scheduler
//   • A compute engine
//   • A marketplace router
//   • A backend service
//
// DEPLOYMENT:
//   Lives in /apps/pulse-earn as part of the Pulse Earn subsystem.
//   Must run in any JS environment with fetch() available.
//   Must remain ESM-only and side-effect-free.
//
// SAFETY RULES:
//   • Never mutate job objects
//   • Never execute arbitrary code
//   • Never use Node APIs
//   • Always validate fetch() responses
//   • Always return safe fallbacks
//
// ------------------------------------------------------
// Config — can be overridden at startup
// ------------------------------------------------------

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

// Optional: allow runtime configuration from Firebase or env
export function configureMarketplaceA(config) {
  // Shallow, safe merge — only known keys
  marketplaceConfig = {
    ...marketplaceConfig,
    ...config,
    endpoints: {
      ...marketplaceConfig.endpoints,
      ...(config?.endpoints || {}),
    },
  };
}

// ------------------------------------------------------
// Helpers
// ------------------------------------------------------

function buildUrl(pathKey) {
  const base = marketplaceConfig.baseUrl || "";
  const path = marketplaceConfig.endpoints[pathKey] || "";
  return `${base}${path}`;
}

// ------------------------------------------------------
// Marketplace A Client — ping(), fetchJobs(), submitResult()
// ------------------------------------------------------

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
      body: JSON.stringify({
        jobId: job.id,
        result,
      }),
    });

    if (!res.ok) {
      return {
        success: false,
        error: `Marketplace submission failed: ${res.status}`,
      };
    }

    const data = await res.json();
    return data;

  } catch (err) {
    return {
      success: false,
      error: err.message,
    };
  }
}

export const marketplaceA = {
  id: () => marketplaceConfig.id,
  name: () => marketplaceConfig.name,
  ping,
  fetchJobs,
  submitResult,
};
