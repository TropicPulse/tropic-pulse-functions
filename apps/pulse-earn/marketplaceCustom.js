// ============================================================================
// FILE: tropic-pulse-functions/apps/pulse-earn/marketplaceCustom.js
// LAYER: THE STANDARDS BUREAU
// (Dynamic Marketplace Interpreter + Database‑Driven Adapter Loader)
// ============================================================================
//
// ROLE:
//   THE STANDARDS BUREAU — Pulse‑Earn’s dynamic marketplace interpreter.
//   • Loads marketplace definitions from Firebase
//   • Interprets config into a working marketplace adapter
//   • Enforces the universal interface (ping, fetchJobs, submitResult)
//
// WHY “STANDARDS BUREAU”?:
//   • It reads marketplace standards from the database
//   • It interprets them into a functional adapter
//   • It enforces the universal protocol defined by the Standard Bearer
//   • It allows infinite marketplaces without code changes
//
// PURPOSE:
//   • Provide a deterministic, drift‑proof dynamic marketplace adapter
//   • Allow runtime marketplace creation from Firestore
//   • Guarantee safe HTTP behavior + fallback values
//
// CONTRACT:
//   • PURE NETWORK ADAPTER — no AI layers, no translation, no memory model
//   • READ‑ONLY except for config caching
//   • NO eval(), NO Function(), NO dynamic imports
//   • NO executing user code
//   • Deterministic fetch‑based wrapper only
//
// SAFETY:
//   • v6.3 upgrade is COMMENTAL ONLY — NO LOGIC CHANGES
//   • All behavior remains identical to pre‑v6.3 marketplaceCustom
// ============================================================================

import { getFirestore, doc, getDoc } from "firebase/firestore";

// ---------------------------------------------------------------------------
// Standards Bureau Cache — prevents repeated DB reads
// ---------------------------------------------------------------------------
let cachedConfig = null;

// ---------------------------------------------------------------------------
// loadMarketplaceConfig — Reads marketplace standards from Firestore
// ---------------------------------------------------------------------------
async function loadMarketplaceConfig() {
  if (cachedConfig) return cachedConfig;

  try {
    const db = getFirestore();
    const ref = doc(db, "marketplaces", "custom"); // dynamic marketplace doc
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      throw new Error("Marketplace config missing in Firebase");
    }

    cachedConfig = snap.data();
    return cachedConfig;

  } catch (err) {
    // Deterministic fallback — empty marketplace
    return {
      baseUrl: "",
      endpoints: { ping: "", jobs: "", submit: "" },
      headers: {},
    };
  }
}

// ---------------------------------------------------------------------------
// URL Builder — interprets standards into usable endpoints
// ---------------------------------------------------------------------------
function buildUrl(config, key) {
  const base = config.baseUrl || "";
  const path = config.endpoints?.[key] || "";
  return `${base}${path}`;
}

// ---------------------------------------------------------------------------
// Standards Bureau Client — ping(), fetchJobs(), submitResult()
// ---------------------------------------------------------------------------
async function ping() {
  try {
    const config = await loadMarketplaceConfig();
    const url = buildUrl(config, "ping");

    const start = Date.now();
    const res = await fetch(url, { headers: config.headers || {} });

    if (!res.ok) return null;
    return Date.now() - start;

  } catch {
    return null;
  }
}

async function fetchJobs() {
  try {
    const config = await loadMarketplaceConfig();
    const url = buildUrl(config, "jobs");

    const res = await fetch(url, { headers: config.headers || {} });

    if (!res.ok) return [];
    const data = await res.json();

    return Array.isArray(data) ? data : [];

  } catch {
    return [];
  }
}

async function submitResult(job, result) {
  try {
    const config = await loadMarketplaceConfig();
    const url = buildUrl(config, "submit");

    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(config.headers || {}),
      },
      body: JSON.stringify({
        jobId: job.id,
        result,
      }),
    });

    if (!res.ok) {
      return {
        success: false,
        error: `Submission failed: ${res.status}`,
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
// Export — The Standards Bureau Adapter
// ---------------------------------------------------------------------------
export const marketplaceA = {
  id: "CUSTOM",
  name: "Custom Marketplace",
  ping,
  fetchJobs,
  submitResult,
};
