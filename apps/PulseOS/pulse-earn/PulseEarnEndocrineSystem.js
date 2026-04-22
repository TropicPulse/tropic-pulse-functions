// ============================================================================
// FILE: tropic-pulse-functions/apps/pulse-earn/PulseEarnEndocrineSystem.js
// LAYER: THE ENDOCRINE SYSTEM
// (Performance Intelligence + Reputation Hormones + Trust Regulation)
// PULSE EARN — v9.2
// ============================================================================
//
// ROLE (v9.2):
//   THE ENDOCRINE SYSTEM — Pulse‑Earn’s long-term performance regulator.
//   • Tracks marketplace reliability and profitability (hormone sensing).
//   • Computes normalized performance signals (signal transduction).
//   • Applies weighted scoring to determine trust (hormonal modulation).
//   • Blends historical + recent performance (half-life / EMA).
//   • Persists reputation for long-term intelligence (endocrine memory).
//
// PURPOSE (v9.2):
//   • Provide deterministic, drift-proof trust scoring.
//   • Maintain persistent marketplace reputation (hormonal memory).
//   • Supply the Circulatory System with trust hormones.
//   • Preserve endocrine lineage + signal weighting.
//
// CONTRACT (unchanged):
//   • PURE INTELLIGENCE ENGINE — no AI layers, no translation, no memory model.
//   • READ-ONLY except for deterministic reputation updates.
//   • NO eval(), NO Function(), NO dynamic imports.
//   • NO executing user code.
//   • Deterministic scoring only.
//
// SAFETY (unchanged):
//   • v9.2 upgrade is COMMENTAL / IDENTITY ONLY — NO LOGIC CHANGES.
// ============================================================================

import fs from "fs";
import path from "path";

// ---------------------------------------------------------------------------
// Constants — Endocrine Baselines
// ---------------------------------------------------------------------------
const DEFAULT_REPUTATION = 0.5;
const REPUTATION_FILE = path.resolve(
  "pulse-earn/data/marketplace-reputation.json"
);

// In-memory endocrine hormone store
let reputation = new Map();

// ---------------------------------------------------------------------------
// Healing Metadata — Endocrine Activity Log
// ---------------------------------------------------------------------------
const endocrineHealing = {
  lastMarketplaceId: null,
  lastReputationBefore: null,
  lastReputationAfter: null,
  lastSignals: null,
  lastLoadError: null,
  lastSaveError: null,
  cycleCount: 0, // hormonal cycles completed
};

// ---------------------------------------------------------------------------
// Load reputation from disk — Endocrine Memory Recall
// ---------------------------------------------------------------------------
export function loadPulseEarnReputation() {
  try {
    if (!fs.existsSync(REPUTATION_FILE)) {
      reputation = new Map();
      return;
    }

    const raw = fs.readFileSync(REPUTATION_FILE, "utf8");
    const json = JSON.parse(raw);

    reputation = new Map(Object.entries(json));
    endocrineHealing.lastLoadError = null;
  } catch (err) {
    error("Failed to load marketplace reputation:", err);
    endocrineHealing.lastLoadError = err.message;
    reputation = new Map();
  }
}

// ---------------------------------------------------------------------------
// Save reputation to disk — Endocrine Persistence
// ---------------------------------------------------------------------------
function savePulseEarnReputation() {
  try {
    const obj = Object.fromEntries(reputation);
    fs.mkdirSync(path.dirname(REPUTATION_FILE), { recursive: true });
    fs.writeFileSync(REPUTATION_FILE, JSON.stringify(obj, null, 2));
    endocrineHealing.lastSaveError = null;
  } catch (err) {
    error("Failed to save marketplace reputation:", err);
    endocrineHealing.lastSaveError = err.message;
  }
}

// ---------------------------------------------------------------------------
// Get current reputation — Hormone Level Lookup
// ---------------------------------------------------------------------------
export function getPulseEarnReputation(id) {
  return Number(reputation.get(id)) || DEFAULT_REPUTATION;
}

// ---------------------------------------------------------------------------
// Update reputation — Endocrine Regulation Cycle
// ---------------------------------------------------------------------------
export function updatePulseEarnReputation(id, signals) {
  endocrineHealing.cycleCount++;
  endocrineHealing.lastMarketplaceId = id;
  endocrineHealing.lastSignals = { ...signals };

  const current = getPulseEarnReputation(id);
  endocrineHealing.lastReputationBefore = current;

  // Hormonal weighting coefficients
  const weights = {
    latency: 0.15,
    apiSuccess: 0.2,
    jobQuality: 0.25,
    profitability: 0.25,
    jobSuccess: 0.15,
  };

  // Hormonal signal transduction
  const score =
    (signals.latency ?? 0) * weights.latency +
    (signals.apiSuccess ?? 0) * weights.apiSuccess +
    (signals.jobQuality ?? 0) * weights.jobQuality +
    (signals.profitability ?? 0) * weights.profitability +
    (signals.jobSuccess ?? 0) * weights.jobSuccess;

  // EMA = hormonal half-life blending
  const updated = current * 0.7 + score * 0.3;
  const clamped = clamp(updated, 0, 1);

  reputation.set(id, clamped);
  endocrineHealing.lastReputationAfter = clamped;

  savePulseEarnReputation();

  return clamped;
}

// ---------------------------------------------------------------------------
// Normalization Helpers — Hormonal Calibration
// ---------------------------------------------------------------------------
function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

export function computePulseEarnReputationSignals({
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

// ---------------------------------------------------------------------------
// Normalizers — Endocrine Signal Processing
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Export Healing Metadata — Endocrine Report
// ---------------------------------------------------------------------------
export function getPulseEarnReputationHealingState() {
  return { ...endocrineHealing };
}
