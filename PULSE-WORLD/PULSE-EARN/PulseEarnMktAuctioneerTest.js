// ============================================================================
// TEST SCRIPT — Vast.ai Adapter Test (v12.3‑PRESENCE‑EVO+ A‑B‑A Deterministic)
// Pulse‑Earn v12.3‑Presence‑EVO+
// ============================================================================

import {
  PulseEarnMktAuctioneer,
  getPulseEarnMktAuctioneerHealingState
} from "./PulseEarnMktAuctioneer.js";

// Optional deterministic global presence hints
const globalHints = {
  presenceContext: {
    bandPresence: "symbolic",
    routerPresence: "stable",
    devicePresence: "local"
  },
  meshSignals: {
    meshStrength: 12,
    meshPressureIndex: 18
  },
  castleSignals: {
    castlePresence: "regional",
    castleId: "castle‑mesa‑01",
    loadLevel: 22
  },
  regionContext: {
    regionTag: "us‑west‑mesa",
    regionId: "mesa‑01"
  },
  advantageContext: {
    score: 4,
    band: "symbolic",
    tier: 2
  },
  fallbackBandLevel: 1,
  chunkHints: { prechunk: true },
  cacheHints: { level: 2 },
  prewarmHints: { enabled: true },
  coldStartHints: { avoid: true }
};

function run() {
  console.log("==============================================");
  console.log(" PULSE‑EARN VAST.AI ADAPTER — TEST RUN (v12.3‑PRESENCE‑EVO+)");
  console.log("==============================================\n");

  // ---------------------------------------------------------
  // 1. PING TEST (presence‑aware, signature‑rich, A‑B‑A)
  // ---------------------------------------------------------
  console.log("🔹 Testing ping()...");
  const ping = PulseEarnMktAuctioneer.ping(globalHints);
  console.log("Ping result:", ping);
  console.log("Presence Tier:", ping.auctioneerPresenceProfile.presenceTier);
  console.log("Binary Profile:", ping.binaryProfile);
  console.log("Wave Profile:", ping.waveProfile, "\n");

  // ---------------------------------------------------------
  // 2. FETCH JOBS TEST (presence‑aware, signature‑rich, A‑B‑A)
  // ---------------------------------------------------------
  console.log("🔹 Testing fetchJobs()...");
  const fetch = PulseEarnMktAuctioneer.fetchJobs(globalHints);
  const jobs = fetch.jobs || [];

  console.log(`Fetched ${jobs.length} jobs`);
  console.log("Presence Tier:", fetch.auctioneerPresenceProfile.presenceTier);
  console.log("Binary Profile:", fetch.binaryProfile);
  console.log("Wave Profile:", fetch.waveProfile, "\n");

  if (jobs.length > 0) {
    console.log("Sample job:", jobs[0], "\n");
  }

  // ---------------------------------------------------------
  // 3. NORMALIZATION CHECK (presence‑aware, signature‑rich)
  // ---------------------------------------------------------
  if (jobs.length > 0) {
    console.log("🔹 Testing normalizeJob()...");
    const normalized = PulseEarnMktAuctioneer.normalizeJob(jobs[0], globalHints);
    console.log("Normalized job:", normalized);
    console.log("Presence Tier:", normalized.presenceTier, "\n");
  }

  // ---------------------------------------------------------
  // 4. SUBMIT RESULT TEST (presence‑aware, deterministic)
  // ---------------------------------------------------------
  if (jobs.length > 0) {
    console.log("🔹 Testing submitResult()...");
    const submit = PulseEarnMktAuctioneer.submitResult(
      jobs[0],
      { ok: true },
      globalHints
    );
    console.log("Submit result:", submit);
    console.log("Presence Tier:", submit.auctioneerPresenceProfile.presenceTier);
    console.log("Binary Profile:", submit.binaryProfile);
    console.log("Wave Profile:", submit.waveProfile, "\n");
  }

  // ---------------------------------------------------------
  // 5. HEALING STATE (v12.3‑Presence‑EVO+ signatures)
  // ---------------------------------------------------------
  console.log("🔹 Healing State:");
  console.log(getPulseEarnMktAuctioneerHealingState());

  console.log("\n==============================================");
  console.log(" TEST COMPLETE (v12.3‑PRESENCE‑EVO+)");
  console.log("==============================================");
}

run();
