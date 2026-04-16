// FILE: tropic-pulse-functions/apps/pulse-earn/marketplaceCustom.js
//
// Universal Marketplace Adapter v5 — Firebase‑Driven, Deterministic, Drift‑Proof
// NO AI LAYERS. NO TRANSLATION. NO MEMORY MODEL. PURE HEALING.
//
// ------------------------------------------------------
// 📘 PAGE INDEX — Source of Truth for This File
// ------------------------------------------------------
//
// ROLE:
//   Universal Marketplace Adapter — loads marketplace configuration from Firebase
//   and exposes the standardized interface:
//     • ping()
//     • fetchJobs()
//     • submitResult()
//
//   This adapter works for ALL marketplace types because the configuration
//   (baseUrl, endpoints, headers, auth, etc.) is stored in Firebase.
//
// RESPONSIBILITIES:
//   • Load marketplace config from Firebase
//   • Perform safe HTTP requests
//   • Validate responses
//   • Never throw unhandled errors
//   • Return deterministic fallback values
//
// SAFETY RULES:
//   • Never mutate job objects
//   • Never execute arbitrary code
//   • Never use Node APIs
//   • Always validate fetch() responses
//   • Always return safe fallbacks
//
// ------------------------------------------------------
// Firebase Loader (config comes from your Firestore design)
// ------------------------------------------------------

import { getFirestore, doc, getDoc } from "firebase/firestore";

let cachedConfig = null;

async function loadMarketplaceConfig() {
  if (cachedConfig) return cachedConfig;

  try {
    const db = getFirestore();
    const ref = doc(db, "marketplaces", "custom"); // your custom marketplace doc
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      throw new Error("Marketplace config missing in Firebase");
    }

    cachedConfig = snap.data();
    return cachedConfig;

  } catch (err) {
    return {
      baseUrl: "",
      endpoints: { ping: "", jobs: "", submit: "" },
      headers: {},
    };
  }
}

function buildUrl(config, key) {
  const base = config.baseUrl || "";
  const path = config.endpoints?.[key] || "";
  return `${base}${path}`;
}

// ------------------------------------------------------
// Universal Marketplace Client — ping(), fetchJobs(), submitResult()
// ------------------------------------------------------

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

// ------------------------------------------------------
// Export — this is the universal adapter
// ------------------------------------------------------

export const marketplaceA = {
  id: "CUSTOM",
  name: "Custom Marketplace",
  ping,
  fetchJobs,
  submitResult,
};
