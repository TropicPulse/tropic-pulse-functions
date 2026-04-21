// ============================================================================
// FILE: tropic-pulse-functions/apps/pulse-earn/PulseEarnCustomReceptor.js
// LAYER: THE GENETIC REGULATOR
// (Dynamic Marketplace Interpreter + Receptor Builder)
// PULSE EARN — v9.2
// ============================================================================
//
// ROLE (v9.2):
//   THE GENETIC REGULATOR — Pulse‑Earn’s dynamic marketplace interpreter.
//   • Loads marketplace definitions from Firestore (genetic code).
//   • Interprets config into a working marketplace receptor.
//   • Enforces the universal interface (ping, fetchJobs, submitResult).
//   • Acts as the “gene expression” layer for new marketplaces.
//
// WHY “GENETIC REGULATOR”?:
//   • It reads marketplace DNA from the database.
//   • It expresses that DNA into a functional receptor.
//   • It enforces the universal protocol defined by the Standard Receptor.
//   • It allows infinite marketplaces without code changes (evolution).
//
// PURPOSE (v9.2):
//   • Provide a deterministic, drift‑proof dynamic marketplace adapter.
//   • Allow runtime marketplace creation from Firestore.
//   • Guarantee safe HTTP behavior + fallback values.
//   • Preserve genetic lineage + receptor evolution (conceptual only).
//
// CONTRACT (unchanged):
//   • PURE NETWORK ADAPTER — no AI layers, no translation, no memory model.
//   • READ‑ONLY except for config caching.
//   • NO eval(), NO Function(), NO dynamic imports.
//   • NO executing user code.
//   • Deterministic fetch‑based wrapper only.
//
// SAFETY (unchanged):
//   • v9.2 upgrade is COMMENTAL / IDENTITY ONLY — NO LOGIC CHANGES.
//   • All behavior remains identical to pre‑v9.2 marketplaceCustom.
// ============================================================================

import { getFirestore, doc, getDoc } from "firebase/firestore";

// ---------------------------------------------------------------------------
// Genetic Cache — prevents repeated DNA reads
// ---------------------------------------------------------------------------
let cachedConfig = null;

// ---------------------------------------------------------------------------
// loadMarketplaceConfig — Reads receptor DNA from Firestore
// ---------------------------------------------------------------------------
async function loadMarketplaceConfig() {
  if (cachedConfig) return cachedConfig;

  try {
    const db = getFirestore();
    const ref = doc(db, "marketplaces", "custom"); // dynamic receptor DNA
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      throw new Error("Marketplace config missing in Firebase");
    }

    cachedConfig = snap.data();
    return cachedConfig;

  } catch (err) {
    // Deterministic fallback — receptor with no sensitivity
    return {
      baseUrl: "",
      endpoints: { ping: "", jobs: "", submit: "" },
      headers: {},
    };
  }
}

// ---------------------------------------------------------------------------
// URL Builder — interprets genetic code into receptor pathways
// ---------------------------------------------------------------------------
function buildUrl(config, key) {
  const base = config.baseUrl || "";
  const path = config.endpoints?.[key] || "";
  return `${base}${path}`;
}

// ---------------------------------------------------------------------------
// Genetic Regulator Client — ping(), fetchJobs(), submitResult()
// NOTE: These are the receptor functions expressed from DNA.
// ---------------------------------------------------------------------------

async function ping() {
  try {
    const config = await loadMarketplaceConfig();
    const url = buildUrl(config, "ping");

    const start = Date.now();
    const res = await fetch(url, { headers: config.headers || {} });

    if (!res.ok) return null;

    // NOTE: Lower latency = stronger receptor expression
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

    // NOTE: More jobs = stronger environmental stimulus
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

    // NOTE: Successful submission = completed metabolic exchange
    return await res.json();

  } catch (err) {
    return {
      success: false,
      error: err.message,
    };
  }
}

// ---------------------------------------------------------------------------
// Export — The Genetic Regulator Adapter
// ---------------------------------------------------------------------------
export const PulseEarnCustomReceptor = {
  id: "CUSTOM",
  name: "Custom Marketplace",
  ping,
  fetchJobs,
  submitResult,
};
