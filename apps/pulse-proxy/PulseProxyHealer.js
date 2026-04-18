// ======================================================
//  PULSE PROXY HEALER v5.2
//  “THE WHITE BLOOD CELL LAYER / IMMUNE PATROL”
//  Deterministic, Drift‑Proof, Proxy‑Only Healing Layer
//  PURE HEALING. NO AI LAYERS. NO TRANSLATION. NO MEMORY MODEL.
// ======================================================
//
// BODY THEME — ORGANISM MAPPING:
//  ------------------------------
//  PulseProxyHealer is the **WHITE BLOOD CELL LAYER** of the Pulse organism.
//  It is the **IMMUNE PATROL** — constantly circulating, scanning for threats.
//
//  • Detects infections (misconfigurations in UserScores).
//  • Detects pressure (CPU, memory, event loop lag).
//  • Detects abnormal patterns (instance out-of-bounds).
//  • Emits FUNCTION_LOGS as “immune alerts”.
//  • Emits ProxyHealerLogs as “immune patrol reports”.
//  • Calls in higher immune layers (OSHealer, OS Memory).
//
//  It does NOT heal directly — it **patrols**, **detects**, **flags**, **alerts**.
//
// WHAT THIS FILE IS:
//  -------------------
//  • A proxy-side healer for the Pulse Proxy subsystem.
//  • A misconfiguration detector for UserScores + instance allocations.
//  • A pressure detector for CPU / memory / event loop lag.
//  • A logging source for OS-level healers + admin dashboards.
//  • A deterministic, drift-proof observer.
//
// WHAT THIS FILE IS NOT:
//  -----------------------
//  • NOT a compute engine.
//  • NOT a miner.
//  • NOT a scheduler.
//  • NOT a runtime.
//  • NOT a marketplace adapter.
//  • NOT a blockchain client.
//  • NOT a wallet.
//  • NOT a place for user-provided logic.
//  • NOT a place for dynamic imports or eval.
//
// SAFETY CONTRACT:
//  ----------------
//  • No eval().
//  • No dynamic imports.
//  • No arbitrary code execution.
//  • No compute.
//  • No GPU work.
//  • No marketplace calls.
//  • No mutation outside logs.
//  • Deterministic, drift-proof healing only.
//
// ======================================================
//  CONFIGURABLE HEALER VARIABLES (IMMUNE THRESHOLDS)
// ======================================================

export const PROXY_HEALTH_URL =
  process.env.PULSE_PROXY_HEALTH_URL || "http://localhost:8080/pulse-proxy/health";

export const PROXY_METRICS_URL =
  process.env.PULSE_PROXY_METRICS_URL || "http://localhost:8080/pulse-proxy/metrics";

// Immune patrol frequency
export const HEALTH_INTERVAL_MS = 30_000;
export const SCORES_SCAN_INTERVAL_MS = 60_000;

// Immune pressure thresholds
export const CPU_PRESSURE_WARN = 80;
export const MEM_PRESSURE_WARN = 80;
export const EVENT_LOOP_LAG_WARN = 100;

// Instance sanity thresholds
export const MIN_INSTANCES = 1;
export const MAX_INSTANCES = 32;

// Immune log collections
export const FUNCTION_LOGS_COLLECTION = "FUNCTION_LOGS";
export const PROXY_HEALER_LOGS_COLLECTION = "ProxyHealerLogs";

// ======================================================
//  Imports
// ======================================================
import fetch from "node-fetch";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
const db = getFirestore();

console.log("[WBC BOOT] PulseProxyHealer v5.2 online — immune patrol active.");
console.log("[WBC BOOT] Health URL:", PROXY_HEALTH_URL);
console.log("[WBC BOOT] Metrics URL:", PROXY_METRICS_URL);
console.log("[WBC BOOT] Patrol interval:", HEALTH_INTERVAL_MS, "ms");
console.log("[WBC BOOT] Score scan interval:", SCORES_SCAN_INTERVAL_MS, "ms");

// ======================================================
//  Helper: write FUNCTION_LOGS entry (immune alert)
// ======================================================
async function writeFunctionLog(entry) {
  try {
    await db.collection(FUNCTION_LOGS_COLLECTION).add({
      ...entry,
      createdAt: Timestamp.now(),
      processed: false
    });
  } catch (err) {
    console.error("[WBC] Failed to write FUNCTION_LOGS entry:", err);
  }
}

// ======================================================
//  Helper: write healer log (immune patrol report)
// ======================================================
async function writeHealerLog(entry) {
  try {
    await db.collection(PROXY_HEALER_LOGS_COLLECTION).add({
      ...entry,
      ts: Date.now()
    });
  } catch (err) {
    console.error("[WBC] Failed to write healer log:", err);
  }
}

// ======================================================
//  Health + metrics check (immune pressure scan)
// ======================================================
async function checkProxyHealthAndMetrics() {
  console.log("[WBC] Running health + metrics scan…");

  let health = null;
  let metrics = null;

  // HEALTH
  try {
    const res = await fetch(PROXY_HEALTH_URL, { method: "GET" });
    health = await res.json().catch(() => null);
  } catch (err) {
    console.warn("[WBC] Health fetch failed:", String(err));
    await writeHealerLog({
      type: "health_error",
      error: String(err),
      url: PROXY_HEALTH_URL
    });
  }

  // METRICS
  try {
    const res = await fetch(PROXY_METRICS_URL, { method: "GET" });
    metrics = await res.json().catch(() => null);
  } catch (err) {
    console.warn("[WBC] Metrics fetch failed:", String(err));
    await writeHealerLog({
      type: "metrics_error",
      error: String(err),
      url: PROXY_METRICS_URL
    });
  }

  if (!metrics) {
    console.warn("[WBC] Metrics unavailable — skipping pressure analysis.");
    return;
  }

  const cpuPercent = metrics.cpu?.percent ?? null;
  const memPressure = metrics.memory?.pressure ?? null;
  const eventLoopLagMs = metrics.eventLoopLagMs ?? null;

  const warnings = [];

  if (cpuPercent != null && cpuPercent > CPU_PRESSURE_WARN) warnings.push("cpu_high");
  if (memPressure != null && memPressure > MEM_PRESSURE_WARN) warnings.push("memory_high");
  if (eventLoopLagMs != null && eventLoopLagMs > EVENT_LOOP_LAG_WARN)
    warnings.push("event_loop_lag_high");

  if (warnings.length) {
    console.warn("[WBC] Pressure warning:", warnings);

    await writeHealerLog({
      type: "proxy_pressure_warning",
      cpuPercent,
      memPressure,
      eventLoopLagMs,
      warnings
    });
  } else {
    console.log("[WBC] Proxy pressure normal.");
  }
}

// ======================================================
//  UserScores scan — detect instance misconfigurations
//  (immune patrol checking “cells” for abnormalities)
// ======================================================
async function scanUserScoresForInstanceHints() {
  console.log("[WBC] Scanning UserScores for immune hints…");

  const snap = await db.collection("UserScores").get();

  for (const doc of snap.docs) {
    const s = doc.data();
    const userId = doc.id;

    const trustScore = s.trustScore ?? 0;
    const meshScore = s.meshScore ?? 0;
    const phase = s.phase ?? 1;
    const hub = !!s.hub;
    const instances = s.instances ?? 1;

    // OUT OF BOUNDS — abnormal cell count
    if (instances < MIN_INSTANCES || instances > MAX_INSTANCES) {
      console.warn(
        `[WBC] Instance out of bounds for user=${userId} | instances=${instances}`
      );

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

    // HIGH TRUST + LOW INSTANCES — underactive tissue
    if (trustScore > 80 && instances < 4) {
      console.log(
        `[WBC] Upgrade hint for user=${userId} | high trust, low instances`
      );

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

    // LOW TRUST + HIGH INSTANCES — overactive tissue
    if (trustScore < 20 && instances > 4) {
      console.log(
        `[WBC] Review hint for user=${userId} | low trust, high instances`
      );

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

  console.log("[WBC] UserScores scan complete.");
}

// ======================================================
//  PUBLIC: startPulseProxyHealer()
// ======================================================
export default function startPulseProxyHealer() {
  console.log("[WBC] Starting immune patrol loops…");

  // HEALTH + METRICS LOOP
  setInterval(() => {
    checkProxyHealthAndMetrics().catch((err) => {
      console.error("[WBC] Health/metrics loop error:", err);
    });
  }, HEALTH_INTERVAL_MS);

  // USER SCORES LOOP
  setInterval(() => {
    scanUserScoresForInstanceHints().catch((err) => {
      console.error("[WBC] Scores scan loop error:", err);
    });
  }, SCORES_SCAN_INTERVAL_MS);

  console.log("[WBC] v5.2 immune patrol active.");
}
