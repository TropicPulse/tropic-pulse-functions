// ============================================================================
// TEST SCRIPT — Vast.ai Adapter Test (v11‑Evo A‑B‑A Deterministic)
// Pulse‑Earn v11‑Evo
// ============================================================================

import {
  PulseEarnMktAuctioneer,
  getPulseEarnMktAuctioneerHealingState
} from "./PulseEarnMktAuctioneer.js";

function run() {
  console.log("==============================================");
  console.log(" PULSE‑EARN VAST.AI ADAPTER — TEST RUN (v11‑Evo A‑B‑A)");
  console.log("==============================================\n");

  // ---------------------------------------------------------
  // 1. PING TEST (deterministic, signature‑rich, A‑B‑A)
  // ---------------------------------------------------------
  console.log("🔹 Testing ping()...");
  const ping = PulseEarnMktAuctioneer.ping();
  console.log("Ping result:", ping);
  console.log("Band Signature:", ping.bandSignature);
  console.log("Binary Field:", ping.binaryField);
  console.log("Wave Field:", ping.waveField, "\n");

  // ---------------------------------------------------------
  // 2. FETCH JOBS TEST (deterministic, signature‑rich, A‑B‑A)
  // ---------------------------------------------------------
  console.log("🔹 Testing fetchJobs()...");
  const fetch = PulseEarnMktAuctioneer.fetchJobs();
  const jobs = fetch.jobs || [];

  console.log(`Fetched ${jobs.length} jobs`);
  console.log("Fetch Signature:", fetch.signature);
  console.log("Band Signature:", fetch.bandSignature);
  console.log("Binary Field:", fetch.binaryField);
  console.log("Wave Field:", fetch.waveField, "\n");

  if (jobs.length > 0) {
    console.log("Sample job:", jobs[0], "\n");
  }

  // ---------------------------------------------------------
  // 3. NORMALIZATION CHECK (deterministic, signature‑rich)
  // ---------------------------------------------------------
  if (jobs.length > 0 && typeof PulseEarnMktAuctioneer.normalizeJob === "function") {
    console.log("🔹 Testing normalizeJob()...");
    const normalized = PulseEarnMktAuctioneer.normalizeJob(jobs[0]);
    console.log("Normalized job:", normalized, "\n");
  }

  // ---------------------------------------------------------
  // 4. SUBMIT RESULT TEST (deterministic, A‑B‑A)
  // ---------------------------------------------------------
  if (jobs.length > 0) {
    console.log("🔹 Testing submitResult()...");
    const submit = PulseEarnMktAuctioneer.submitResult(jobs[0], { ok: true });
    console.log("Submit result:", submit);
    console.log("Band Signature:", submit.bandSignature);
    console.log("Binary Field:", submit.binaryField);
    console.log("Wave Field:", submit.waveField, "\n");
  }

  // ---------------------------------------------------------
  // 5. HEALING STATE (v11‑Evo A‑B‑A signatures)
  // ---------------------------------------------------------
  console.log("🔹 Healing State:");
  console.log(getPulseEarnMktAuctioneerHealingState());

  console.log("\n==============================================");
  console.log(" TEST COMPLETE (v11‑Evo A‑B‑A)");
  console.log("==============================================");
}

run();
