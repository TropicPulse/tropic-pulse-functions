// FILE: tropic-pulse-functions/apps/pulse-earn/MarketplaceReputation.js
//
// MarketplaceReputation v5 — Deterministic, Drift‑Proof, Self‑Healing Reputation Engine
// NO AI LAYERS. NO TRANSLATION. NO MEMORY MODEL. PURE HEALING.
//
// ------------------------------------------------------
// 📘 PAGE INDEX — Source of Truth for This File
// ------------------------------------------------------
//
// ROLE:
//   MarketplaceReputation — persistent reliability scoring for all marketplaces.
//
// RESPONSIBILITIES:
//   • Load/save reputation from/to disk
//   • Track operational signals (latency, errors, quality, profit, success)
//   • Compute normalized 0–1 signals
//   • Apply weighted scoring model
//   • Blend old + new via EMA
//   • Clamp scores to 0–1
//   • Maintain healing metadata
//
// THIS FILE IS:
//   • A persistent reputation engine
//   • A weighted scoring model
//   • A disk-backed memory store
//   • A reliability tracker
//
// THIS FILE IS NOT:
//   • A scheduler
//   • A job selector
//   • A compute engine
//   • A marketplace adapter
//   • A ledger/wallet/settlement handler
//
// SAFETY NOTES:
//   • Never throw unhandled errors
//   • Always clamp values to 0–1
//   • Always persist after updates
//   • Remain deterministic
//
// ------------------------------------------------------
// Imports
// ------------------------------------------------------

import fs from "fs";
import path from "path";

// ------------------------------------------------------
// Constants
// ------------------------------------------------------

const DEFAULT_REPUTATION = 0.5; // neutral baseline
const REPUTATION_FILE = path.resolve(
  "pulse-earn/data/marketplace-reputation.json"
);

// In-memory reputation store
let reputation = new Map();

// Healing metadata
const healingState = {
  lastMarketplaceId: null,
  lastReputationBefore: null,
  lastReputationAfter: null,
  lastSignals: null,
  lastLoadError: null,
  lastSaveError: null,
  cycleCount: 0,
};

// ------------------------------------------------------
// Load reputation from disk
// ------------------------------------------------------
export function loadMarketplaceReputation() {
  try {
    if (!fs.existsSync(REPUTATION_FILE)) {
      reputation = new Map();
      return;
    }

    const raw = fs.readFileSync(REPUTATION_FILE, "utf8");
    const json = JSON.parse(raw);

    reputation = new Map(Object.entries(json));
    healingState.lastLoadError = null;
  } catch (err) {
    console.error("Failed to load marketplace reputation:", err);
    healingState.lastLoadError = err.message;
    reputation = new Map();
  }
}

// ------------------------------------------------------
// Save reputation to disk
// ------------------------------------------------------
function saveMarketplaceReputation() {
  try {
    const obj = Object.fromEntries(reputation);
    fs.mkdirSync(path.dirname(REPUTATION_FILE), { recursive: true });
    fs.writeFileSync(REPUTATION_FILE, JSON.stringify(obj, null, 2));
    healingState.lastSaveError = null;
  } catch (err) {
    console.error("Failed to save marketplace reputation:", err);
    healingState.lastSaveError = err.message;
  }
}

// ------------------------------------------------------
// Get current reputation for a marketplace
// ------------------------------------------------------
export function getMarketplaceReputation(id) {
  return Number(reputation.get(id)) || DEFAULT_REPUTATION;
}

// ------------------------------------------------------
// Update reputation based on signals
// ------------------------------------------------------
export function updateMarketplaceReputation(id, signals) {
  healingState.cycleCount++;
  healingState.lastMarketplaceId = id;
  healingState.lastSignals = { ...signals };

  const current = getMarketplaceReputation(id);
  healingState.lastReputationBefore = current;

  const weights = {
    latency: 0.15,
    apiSuccess: 0.2,
    jobQuality: 0.25,
    profitability: 0.25,
    jobSuccess: 0.15,
  };

  const score =
    (signals.latency ?? 0) * weights.latency +
    (signals.apiSuccess ?? 0) * weights.apiSuccess +
    (signals.jobQuality ?? 0) * weights.jobQuality +
    (signals.profitability ?? 0) * weights.profitability +
    (signals.jobSuccess ?? 0) * weights.jobSuccess;

  const updated = current * 0.7 + score * 0.3;
  const clamped = clamp(updated, 0, 1);

  reputation.set(id, clamped);
  healingState.lastReputationAfter = clamped;

  saveMarketplaceReputation();

  return clamped;
}

// ------------------------------------------------------
// Normalize values into 0–1 range
// ------------------------------------------------------
function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

// ------------------------------------------------------
// Convert raw metrics into normalized signals
// ------------------------------------------------------
export function computeReputationSignals({
  latencyMs,
  apiErrors,
  jobsReturned,
  profitableJobs,
  jobSuccessRate,
  avgProfitPerJob,
}) {
  return {
    latency: latencyMs != null ? normalizeLatency(latencyMs) : 0.5,
    apiSuccess: apiErrors != null ? normalizeApiErrors(apiErrors) : 0.5,
    jobQuality: jobsReturned != null ? normalizeJobQuality(jobsReturned) : 0.5,
    profitability:
      avgProfitPerJob != null ? normalizeProfit(avgProfitPerJob) : 0.5,
    jobSuccess: jobSuccessRate != null ? clamp(jobSuccessRate, 0, 1) : 0.5,
  };
}

// ------------------------------------------------------
// Normalizers
// ------------------------------------------------------
function normalizeLatency(ms) {
  if (ms < 200) return 1;
  if (ms < 500) return 0.8;
  if (ms < 1000) return 0.6;
  if (ms < 1500) return 0.4;
  return 0.2;
}

function normalizeApiErrors(errors) {
  if (errors === 0) return 1;
  if (errors <= 2) return 0.8;
  if (errors <= 5) return 0.5;
  return 0.2;
}

function normalizeJobQuality(count) {
  if (count > 20) return 1;
  if (count > 10) return 0.8;
  if (count > 5) return 0.6;
  return 0.3;
}

function normalizeProfit(p) {
  if (p > 5) return 1;
  if (p > 2) return 0.8;
  if (p > 1) return 0.6;
  return 0.3;
}

// ------------------------------------------------------
// Export healing metadata for Earn/Earn healers
// ------------------------------------------------------
export function getMarketplaceReputationHealingState() {
  return { ...healingState };
}
