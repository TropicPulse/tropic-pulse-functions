// ============================================================================
// TEST SCRIPT — Vast.ai Adapter Test
// Pulse‑Earn v9.x
// ============================================================================

import { PulseEarnMktAuctioneer, getPulseEarnMktAuctioneerHealingState } from "./PulseEarnMktAuctioneer.js";


async function run() {
  console.log("==============================================");
  console.log(" PULSE‑EARN VAST.AI ADAPTER — TEST RUN");
  console.log("==============================================\n");

  // ---------------------------------------------------------
  // 1. PING TEST
  // ---------------------------------------------------------
  console.log("🔹 Testing ping()...");
  const ping = await PulseEarnMktAuctioneer.ping();
  console.log("Ping result:", ping, "\n");

  // ---------------------------------------------------------
  // 2. FETCH JOBS TEST
  // ---------------------------------------------------------
  console.log("🔹 Testing fetchJobs()...");
  const jobs = await PulseEarnMktAuctioneer.fetchJobs();
  console.log(`Fetched ${jobs.length} jobs\n`);

  if (jobs.length > 0) {
    console.log("Sample job:", jobs[0], "\n");
  }

  // ---------------------------------------------------------
  // 3. NORMALIZATION CHECK
  // ---------------------------------------------------------
  if (jobs.length > 0) {
    console.log("🔹 Testing normalizeJob()...");
    const normalized = PulseEarnMktAuctioneer.normalizeJob(jobs[0]);
    console.log("Normalized job:", normalized, "\n");
  }

  // ---------------------------------------------------------
  // 4. HEALING STATE
  // ---------------------------------------------------------
  console.log("🔹 Healing State:");
  console.log(getPulseEarnMktAuctioneerHealingState());

  console.log("\n==============================================");
  console.log(" TEST COMPLETE");
  console.log("==============================================");
}

run();
