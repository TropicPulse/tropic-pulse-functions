// FILE: tropic-pulse-functions/apps/pulse-earn/PulseDeviceProfile.js
//
// PulseDeviceProfile v5 — Deterministic, Drift‑Proof, Self‑Healing Device Profile
// NO AI LAYERS. NO TRANSLATION. NO MEMORY MODEL. PURE HEALING.
//
// ------------------------------------------------------
// 📘 PAGE INDEX — Source of Truth for This File
// ------------------------------------------------------
//
// ROLE:
//   PulseDeviceProfile — authoritative description of WHAT THIS DEVICE CAN DO.
//
// RESPONSIBILITIES:
//   • Detect local CPU / memory
//   • Derive GPU info (best‑effort)
//   • Estimate bandwidth
//   • Estimate stability
//   • Compute GPU score
//   • Provide unified device profile
//   • Maintain healing metadata
//
// THIS FILE IS:
//   • A capability detector
//   • A performance estimator
//   • A stability estimator
//   • A GPU score generator
//   • A unified device profile provider
//
// THIS FILE IS NOT:
//   • A scheduler
//   • A compute engine
//   • A job selector
//   • A marketplace adapter
//   • A reputation engine
//   • A blockchain client
//   • A wallet or token handler
//
// SAFETY RULES (CRITICAL):
//   • NO eval()
//   • NO dynamic imports
//   • NO arbitrary code execution
//   • NO network calls
//   • NO filesystem access
//   • NO crypto operations
//
// ------------------------------------------------------
// Imports
// ------------------------------------------------------

import os from "os";

// ------------------------------------------------------
// Healing Metadata
// ------------------------------------------------------

const healingState = {
  lastProfile: null,
  lastGpuModel: null,
  lastGpuScore: null,
  lastBandwidthMbps: null,
  lastStabilityScore: null,
  cycleCount: 0,
};

// ------------------------------------------------------
// GPU detection (best‑effort)
// ------------------------------------------------------

let gpuInfo = { model: "unknown", vramMB: 2048 };

try {
  const gpu = os.gpu?.()[0];
  if (gpu) {
    gpuInfo = {
      model: gpu.model || "unknown",
      vramMB: gpu.vram || 2048,
    };
  }
} catch {
  // keep defaults
}

// ------------------------------------------------------
// Network bandwidth estimation (placeholder)
// ------------------------------------------------------

function estimateBandwidthMbps() {
  try {
    return 50;
  } catch {
    return 50;
  }
}

// ------------------------------------------------------
// Stability score (0–1)
// ------------------------------------------------------

function estimateStability() {
  const uptime = os.uptime();
  if (uptime > 3600) return 0.9;
  if (uptime > 600) return 0.7;
  return 0.5;
}

// ------------------------------------------------------
// GPU capability score
// ------------------------------------------------------

function computeGpuScore() {
  const model = gpuInfo.model.toLowerCase();

  if (model.includes("4090")) return 1000;
  if (model.includes("3090")) return 800;
  if (model.includes("3080")) return 700;
  if (model.includes("3070")) return 600;
  if (model.includes("3060")) return 500;
  if (model.includes("2080")) return 450;
  if (model.includes("2070")) return 400;
  if (model.includes("2060")) return 350;
  if (model.includes("1660")) return 300;
  if (model.includes("1060")) return 200;

  return 150;
}

// ------------------------------------------------------
// MAIN EXPORT — getDeviceProfile()
// ------------------------------------------------------

export function getDeviceProfile() {
  healingState.cycleCount++;

  const cpus = os.cpus() || [];
  const totalMemMB = Math.floor(os.totalmem() / 1024 / 1024);

  const bandwidthMbps = estimateBandwidthMbps();
  const stabilityScore = estimateStability();
  const gpuScore = computeGpuScore();

  const profile = {
    id: os.hostname(),

    // CPU
    cpuCores: cpus.length || 4,

    // Memory
    memoryMB: totalMemMB || 4096,

    // GPU
    gpuModel: gpuInfo.model,
    vramMB: gpuInfo.vramMB,
    gpuScore,

    // Network
    bandwidthMbps,

    // Stability
    stabilityScore,
  };

  healingState.lastProfile = profile;
  healingState.lastGpuModel = gpuInfo.model;
  healingState.lastGpuScore = gpuScore;
  healingState.lastBandwidthMbps = bandwidthMbps;
  healingState.lastStabilityScore = stabilityScore;

  return profile;
}

// ------------------------------------------------------
// Export healing metadata for Earn/Earn healers
// ------------------------------------------------------

export function getPulseDeviceProfileHealingState() {
  return { ...healingState };
}
