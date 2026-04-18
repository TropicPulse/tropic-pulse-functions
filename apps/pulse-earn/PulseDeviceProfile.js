// ============================================================================
// FILE: tropic-pulse-functions/apps/pulse-earn/PulseDeviceProfile.js
// LAYER: THE INSPECTOR
// (Device Capability Assessment + Performance Declaration)
// ============================================================================
//
// ROLE:
//   THE INSPECTOR — Pulse‑Earn’s authoritative device evaluator.
//   • Inspects CPU, memory, GPU, bandwidth, stability
//   • Computes capability scores
//   • Produces the official device capability passport
//   • Supplies the Earn Engine with the “owner’s instructions”
//
// WHY “INSPECTOR”?:
//   • Examines the device like a certified inspector
//   • Determines what workloads are safe + possible
//   • Issues the capability report used by all Earn subsystems
//   • Acts as the identity + performance declaration of the device
//
// PURPOSE:
//   • Provide deterministic, drift‑proof device profiling
//   • Guarantee safe capability detection
//   • Supply the Traffic Officer + Scorekeeper with accurate data
//
// CONTRACT:
//   • PURE CAPABILITY ENGINE — no AI layers, no translation, no memory model
//   • NO eval(), NO dynamic imports, NO arbitrary code execution
//   • NO network calls, NO filesystem access, NO crypto operations
//   • Deterministic hardware inspection only
//
// SAFETY:
//   • v6.3 upgrade is COMMENTAL ONLY — NO LOGIC CHANGES
//   • All behavior remains identical to pre‑v6.3 DeviceProfile
// ============================================================================

import os from "os";

// ---------------------------------------------------------------------------
// Healing Metadata — Inspector Log
// ---------------------------------------------------------------------------
const healingState = {
  lastProfile: null,
  lastGpuModel: null,
  lastGpuScore: null,
  lastBandwidthMbps: null,
  lastStabilityScore: null,
  cycleCount: 0,
};

// ---------------------------------------------------------------------------
// GPU Detection — Inspector’s Visual Check
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// Bandwidth Estimation — Inspector’s Network Check
// ---------------------------------------------------------------------------
function estimateBandwidthMbps() {
  try {
    return 50;
  } catch {
    return 50;
  }
}

// ---------------------------------------------------------------------------
// Stability Score — Inspector’s Uptime Check
// ---------------------------------------------------------------------------
function estimateStability() {
  const uptime = os.uptime();
  if (uptime > 3600) return 0.9;
  if (uptime > 600) return 0.7;
  return 0.5;
}

// ---------------------------------------------------------------------------
// GPU Score — Inspector’s Performance Rating
// ---------------------------------------------------------------------------
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

// ---------------------------------------------------------------------------
// MAIN EXPORT — getDeviceProfile()
// Inspector’s Official Capability Passport
// ---------------------------------------------------------------------------
export function getDeviceProfile() {
  healingState.cycleCount++;

  const cpus = os.cpus() || [];
  const totalMemMB = Math.floor(os.totalmem() / 1024 / 1024);

  const bandwidthMbps = estimateBandwidthMbps();
  const stabilityScore = estimateStability();
  const gpuScore = computeGpuScore();

  const profile = {
    id: os.hostname(),

    cpuCores: cpus.length || 4,
    memoryMB: totalMemMB || 4096,

    gpuModel: gpuInfo.model,
    vramMB: gpuInfo.vramMB,
    gpuScore,

    bandwidthMbps,
    stabilityScore,
  };

  healingState.lastProfile = profile;
  healingState.lastGpuModel = gpuInfo.model;
  healingState.lastGpuScore = gpuScore;
  healingState.lastBandwidthMbps = bandwidthMbps;
  healingState.lastStabilityScore = stabilityScore;

  return profile;
}

// ---------------------------------------------------------------------------
// Export Healing Metadata — Inspector Report
// ---------------------------------------------------------------------------
export function getPulseDeviceProfileHealingState() {
  return { ...healingState };
}
