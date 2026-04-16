// FILE: apps/pulse-proxy/PulseProxyHealer.js
//
// PulseProxyHealer v5 — Deterministic, Drift‑Proof, Proxy‑Only Healing Layer
// NO AI LAYERS. NO TRANSLATION. NO MEMORY MODEL. PURE HEALING.
//
// ------------------------------------------------------
// 📘 PAGE INDEX — Source of Truth for This File
// ------------------------------------------------------
//
// ROLE:
//   PulseProxyHealer — subsystem‑level healer for the Pulse Proxy.
//
//   This module is responsible for:
//     • Watching proxy health + metrics
//     • Watching UserScores + instance allocations
//     • Detecting obvious misconfigurations (too low / too high instances)
//     • Emitting FUNCTION_LOGS for OS‑level midnight compiler
//     • Emitting HealerLogs for admin dashboards
//
//   REAL‑WORLD CONTEXT (for future Aldwyn):
//     • This file does NOT run compute.
//     • This file does NOT run MinerRuntime.
//     • This file does NOT run MinerEngine.
//     • This file does NOT execute jobs.
//     • This file does NOT talk to marketplaces.
//     • This file ONLY observes + logs healing hints.
//
//   This file IS:
//     • A proxy‑side healer
//     • A misconfiguration detector
//     • A logging source for OS healers
//
//   This file IS NOT:
//     • A scheduler
//     • A compute engine
//     • A runtime
//     • A marketplace adapter
//     • A blockchain client
//     • A wallet or token handler
//
// DEPLOYMENT:
//   Lives in apps/pulse-proxy as part of the Tropic Pulse proxy subsystem.
//   Must run in Node.js (uses Firestore + fetch).
//   Must remain ESM-only and side-effect-free except for timers + logging.
//
// SAFETY RULES (CRITICAL):
//   • NO eval()
//   • NO dynamic imports
//   • NO arbitrary code execution
//   • NO user-provided logic
//   • NO compute execution
//   • NO GPU work
//   • NO marketplace calls
//
// INTERNAL LOGIC SUMMARY:
//   • startPulseProxyHealer():
//       - Starts periodic health + metrics checks
//       - Starts periodic UserScores scans
//       - Emits FUNCTION_LOGS hints for OS healers
//       - Emits HealerLogs for admin dashboards
//
// ------------------------------------------------------
// 🔧 CONFIGURABLE HEALER VARIABLES (EDIT FREELY)
// ------------------------------------------------------

export const PROXY_HEALTH_URL =
  process.env.PULSE_PROXY_HEALTH_URL || "http://localhost:8080/pulse-proxy/health";

export const PROXY_METRICS_URL =
  process.env.PULSE_PROXY_METRICS_URL || "http://localhost:8080/pulse-proxy/metrics";

// How often to check proxy health/metrics (ms)
export const HEALTH_INTERVAL_MS = 30_000;

// How often to scan UserScores for instance misconfig (ms)
export const SCORES_SCAN_INTERVAL_MS = 60_000;

// Thresholds for “too hot” / “too cold” signals
export const CPU_PRESSURE_WARN = 80;      // percent
export const MEM_PRESSURE_WARN = 80;      // percent
export const EVENT_LOOP_LAG_WARN = 100;   // ms

// Instance sanity thresholds (proxy‑side heuristics)
export const MIN_INSTANCES = 1;
export const MAX_INSTANCES = 32;

// Collections
export const FUNCTION_LOGS_COLLECTION = "FUNCTION_LOGS";
export const PROXY_HEALER_LOGS_COLLECTION = "ProxyHealerLogs";

// ------------------------------------------------------
// Imports
// ------------------------------------------------------
import fetch from "node-fetch";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
const db = getFirestore();

// ------------------------------------------------------
// Helper: write FUNCTION_LOGS entry (for OS midnight compiler)
// ------------------------------------------------------
async function writeFunctionLog(entry) {
  try {
    await db.collection(FUNCTION_LOGS_COLLECTION).add({
      ...entry,
      createdAt: Timestamp.now(),
      processed: false
    });
  } catch (err) {
    console.error("[PulseProxyHealer] Failed to write FUNCTION_LOGS entry:", err);
  }
}

// ------------------------------------------------------
// Helper: write healer log (for admin dashboards)
// ------------------------------------------------------
async function writeHealerLog(entry) {
  try {
    await db.collection(PROXY_HEALER_LOGS_COLLECTION).add({
      ...entry,
      ts: Date.now()
    });
  } catch (err) {
    console.error("[PulseProxyHealer] Failed to write healer log:", err);
  }
}

// ------------------------------------------------------
// Health + metrics check
// ------------------------------------------------------
async function checkProxyHealthAndMetrics() {
  let health = null;
  let metrics = null;

  try {
    const res = await fetch(PROXY_HEALTH_URL, { method: "GET" });
    health = await res.json().catch(() => null);
  } catch (err) {
    await writeHealerLog({
      type: "health_error",
      error: String(err),
      url: PROXY_HEALTH_URL
    });
  }

  try {
    const res = await fetch(PROXY_METRICS_URL, { method: "GET" });
    metrics = await res.json().catch(() => null);
  } catch (err) {
    await writeHealerLog({
      type: "metrics_error",
      error: String(err),
      url: PROXY_METRICS_URL
    });
  }

  if (!metrics) return;

  const cpuPercent = metrics.cpu?.percent ?? null;
  const memPressure = metrics.memory?.pressure ?? null;
  const eventLoopLagMs = metrics.eventLoopLagMs ?? null;

  const warnings = [];

  if (cpuPercent != null && cpuPercent > CPU_PRESSURE_WARN) {
    warnings.push("cpu_high");
  }
  if (memPressure != null && memPressure > MEM_PRESSURE_WARN) {
    warnings.push("memory_high");
  }
  if (eventLoopLagMs != null && eventLoopLagMs > EVENT_LOOP_LAG_WARN) {
    warnings.push("event_loop_lag_high");
  }

  if (warnings.length) {
    await writeHealerLog({
      type: "proxy_pressure_warning",
      cpuPercent,
      memPressure,
      eventLoopLagMs,
      warnings
    });
  }
}

// ------------------------------------------------------
// UserScores scan — detect instance misconfigurations
// ------------------------------------------------------
async function scanUserScoresForInstanceHints() {
  const snap = await db.collection("UserScores").get();

  for (const doc of snap.docs) {
    const s = doc.data();
    const userId = doc.id;

    const trustScore = s.trustScore ?? 0;
    const meshScore = s.meshScore ?? 0;
    const phase = s.phase ?? 1;
    const hub = !!s.hub;
    const instances = s.instances ?? 1;

    // Simple sanity checks
    if (instances < MIN_INSTANCES || instances > MAX_INSTANCES) {
      await writeHealerLog({
        type: "instance_out_of_bounds",
        userId,
        instances,
        trustScore,
        meshScore,
        phase,
        hub
      });

      await writeFunctionLog({
        type: "missing_field",
        pagePath: "/apps/pulse-proxy",
        fileName: "PulseUserScoring.js",
        functionName: "allocateInstances",
        fieldName: "instances",
        note: "Instance count outside sane bounds; review allocation formula."
      });

      continue;
    }

    // Example heuristic: very high trust + low instances → suggest more
    if (trustScore > 80 && instances < 4) {
      await writeHealerLog({
        type: "instance_upgrade_hint",
        userId,
        reason: "high_trust_low_instances",
        trustScore,
        meshScore,
        phase,
        hub,
        instances
      });
    }

    // Example heuristic: low trust + high instances → suggest review
    if (trustScore < 20 && instances > 4) {
      await writeHealerLog({
        type: "instance_review_hint",
        userId,
        reason: "low_trust_high_instances",
        trustScore,
        meshScore,
        phase,
        hub,
        instances
      });
    }
  }
}

// ------------------------------------------------------
// PUBLIC: startPulseProxyHealer()
// ------------------------------------------------------
export default function startPulseProxyHealer() {
  // Health + metrics loop
  setInterval(() => {
    checkProxyHealthAndMetrics().catch((err) => {
      console.error("[PulseProxyHealer] Health/metrics loop error:", err);
    });
  }, HEALTH_INTERVAL_MS);

  // UserScores scan loop
  setInterval(() => {
    scanUserScoresForInstanceHints().catch((err) => {
      console.error("[PulseProxyHealer] Scores scan loop error:", err);
    });
  }, SCORES_SCAN_INTERVAL_MS);

  console.log("[PulseProxyHealer] v5 healer started.");
}
