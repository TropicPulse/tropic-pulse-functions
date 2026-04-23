// ============================================================================
// TEST SCRIPT — Vast.ai Adapter Test (v10.4 Deterministic)
// Pulse‑Earn v10.4
// ============================================================================

import { PulseEarnMktAuctioneer, getPulseEarnMktAuctioneerHealingState} from "./PulseEarnMktAuctioneer.js";

function run() {
  console.log("==============================================");
  console.log(" PULSE‑EARN VAST.AI ADAPTER — TEST RUN (v10.4)");
  console.log("==============================================\n");

  // ---------------------------------------------------------
  // 1. PING TEST (deterministic)
  // ---------------------------------------------------------
  console.log("🔹 Testing ping()...");
  const ping = PulseEarnMktAuctioneer.ping();
  console.log("Ping result:", ping, "\n");

  // ---------------------------------------------------------
  // 2. FETCH JOBS TEST (deterministic)
  // ---------------------------------------------------------
  console.log("🔹 Testing fetchJobs()...");
  const jobs = PulseEarnMktAuctioneer.fetchJobs();
  console.log(`Fetched ${jobs.length} jobs\n`);

  if (jobs.length > 0) {
    console.log("Sample job:", jobs[0], "\n");
  }

  // ---------------------------------------------------------
  // 3. NORMALIZATION CHECK (deterministic)
  // ---------------------------------------------------------
  if (jobs.length > 0 && typeof PulseEarnMktAuctioneer.normalizeJob === "function") {
    console.log("🔹 Testing normalizeJob()...");
    const normalized = PulseEarnMktAuctioneer.normalizeJob(jobs[0]);
    console.log("Normalized job:", normalized, "\n");
  }

  // ---------------------------------------------------------
  // 4. HEALING STATE (deterministic)
  // ---------------------------------------------------------
  console.log("🔹 Healing State:");
  console.log(getPulseEarnMktAuctioneerHealingState());

  console.log("\n==============================================");
  console.log(" TEST COMPLETE (v10.4)");
  console.log("==============================================");
}

run();
