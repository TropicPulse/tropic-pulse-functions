// ============================================================================
// FILE: tropic-pulse-functions/apps/pulse-gpu/PulseGPUSurvivalInstincts.js
// PULSE GPU SURVIVAL INSTINCTS v11-Evo-binary — THE EVOLUTION CORE
// Adaptive Identity Layer • Genetic Memory • Best‑Self Preservation Engine
// ============================================================================
//
// SAFETY CONTRACT (v11-Evo-binary):
//  ------------------------
//  • No randomness
//  • No timestamps
//  • No GPU calls
//  • No DOM
//  • No Node APIs
//  • No network or filesystem access
//  • Fail-open: malformed metrics/settings → safe defaults
//  • Self-repair-ready: entries include OS metadata
//  • Deterministic: same inputs → same evolutionary memory
//  • Legacy-safe: v10.4 callers still behave identically
// ============================================================================

import { SCORE_CONSTANTS } from "./PulseGPUConfig.js";

// ------------------------------------------------------------
// ⭐ OS‑v11-Evo-binary CONTEXT METADATA — Survival Instincts Identity
// ------------------------------------------------------------
const SURVIVAL_CONTEXT = {
  layer: "PulseGPUSurvivalInstincts",
  role: "EVOLUTION_CORE",
  purpose: "Adaptive identity + genetic memory for GPU configs + scoring",
  context:
    "Stores best-known configs, metrics, traces, and supports regression detection",
  target: "full-gpu",
  version: "11.0-Evo-binary",
  selfRepairable: true,

  evo: {
    // Advantage cascade
    advantageCascadeAware: true,
    pulseEfficiencyAware: true,
    driftProof: true,
    multiInstanceReady: true,
    unifiedAdvantageField: true,
    pulseSend10Ready: true,

    // Binary / dual-mode awareness
    binaryMemoryReady: true,
    dualModeEvolution: true,
    organismClusterBoost: 1.0,
    cognitiveComputeLink: true,

    // PulseSend / Earn contracts (current + legacy, conceptual only)
    routingContract: "PulseSend-v11",
    gpuOrganContract: "PulseGPU-v11-Evo",
    earnCompatibility: "Earn-v3",

    legacyRoutingContract: "PulseSend-v10.4",
    legacyGPUOrganContract: "PulseGPU-v10.4",
    legacyEarnCompatibility: "Earn-v2"
  }
};


// ------------------------------------------------------------
// Utility: stable JSON stringify for hashing
// ------------------------------------------------------------
function stableStringify(value) {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }

  if (Array.isArray(value)) {
    return "[" + value.map(stableStringify).join(",") + "]";
  }

  const keys = Object.keys(value).sort();
  const parts = keys.map(
    (k) => JSON.stringify(k) + ":" + stableStringify(value[k])
  );
  return "{" + parts.join(",") + "}";
}


// ------------------------------------------------------------
// Utility: simple deterministic hash
// ------------------------------------------------------------
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i += 1) {
    const chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return (hash >>> 0).toString(16);
}


// ------------------------------------------------------------
// Settings hash — Genetic Fingerprint
// ------------------------------------------------------------
function computeSettingsHash(settings) {
  const serialized = stableStringify(settings || {});
  return simpleHash(serialized);
}


// ------------------------------------------------------------
// Session scoring — Evolutionary Fitness Score (Commandments‑aligned)
// ------------------------------------------------------------
function clamp(value, min, max) {
  if (typeof value !== "number" || Number.isNaN(value)) return min;
  if (value < min) return min;
  if (value > max) return max;
  return value;
}

function scoreSession(metrics = {}) {
  if (!metrics || typeof metrics !== "object") return 0;

  // v10.4 compatibility: accept both camelCase and legacy keys
  const {
    avgFPS,
    minFPS,
    stutterCount,
    crashFlag = false
  } = metrics;

  const avg = typeof metrics.avgFps === "number" ? metrics.avgFps : avgFPS || 0;
  const min = typeof metrics.minFps === "number" ? metrics.minFps : minFPS || 0;
  const stutters =
    typeof metrics.stutters === "number" ? metrics.stutters : stutterCount || 0;

  const safeAvg = clamp(avg, 0, SCORE_CONSTANTS.MAX_FPS);
  const safeMin = clamp(min, 0, SCORE_CONSTANTS.MAX_FPS);
  const safeStutters = clamp(stutters, 0, SCORE_CONSTANTS.MAX_STUTTERS);

  const avgScore = safeAvg / SCORE_CONSTANTS.MAX_FPS;
  const minScore = safeMin / SCORE_CONSTANTS.MAX_FPS;
  const stutterPenalty = safeStutters / SCORE_CONSTANTS.MAX_STUTTERS;

  let score =
    SCORE_CONSTANTS.AVG_FPS_WEIGHT * avgScore +
    SCORE_CONSTANTS.MIN_FPS_WEIGHT * minScore -
    SCORE_CONSTANTS.STUTTER_WEIGHT * stutterPenalty;

  if (crashFlag) score -= SCORE_CONSTANTS.CRASH_PENALTY;

  return clamp(score, 0, 1);
}


// ------------------------------------------------------------
// Regression detection — Evolutionary Delta
// ------------------------------------------------------------
function detectRegression(currentMetrics, baselineMetrics) {
  const currentScore = scoreSession(currentMetrics);
  const baselineScore = scoreSession(baselineMetrics);

  if (baselineScore === 0) return 0;

  const delta = (currentScore - baselineScore) / baselineScore;
  return delta * 100;
}


// ------------------------------------------------------------
// Key building helpers — Genetic Indexing
// ------------------------------------------------------------
function buildGameKey(gameProfile = {}) {
  const { gameId = "unknown", buildVersion = "", contentHash = "" } =
    gameProfile;
  return stableStringify({ gameId, buildVersion, contentHash });
}

function buildHardwareKey(hardwareProfile = {}) {
  const {
    gpuModel = "unknown",
    driverVersion = "",
    vramMB = 0,
    cpuModel = "",
    ramMB = 0
  } = hardwareProfile;

  return stableStringify({
    gpuModel,
    driverVersion,
    vramMB,
    cpuModel,
    ramMB
  });
}

function buildTierKey(tierProfile = {}) {
  const { tierId = "default" } = tierProfile;
  return stableStringify({ tierId });
}

function buildCompositeKey(
  gameProfile,
  hardwareProfile,
  tierProfile,
  settingsHash,
  binaryMode
) {
  const gameKey = buildGameKey(gameProfile);
  const hwKey = buildHardwareKey(hardwareProfile);
  const tierKey = buildTierKey(tierProfile || {});
  const base = stableStringify({
    gameKey,
    hwKey,
    tierKey,
    settingsHash,
    binaryMode: binaryMode || "auto"
  });
  return simpleHash(base);
}


// ------------------------------------------------------------
// Memory entry model — Evolutionary Record
// ------------------------------------------------------------
class PulseGPUSurvivalInstinctsStore {
  constructor() {
    this.entries = new Map();
    this.meta = { ...SURVIVAL_CONTEXT };
  }

  clear() {
    this.entries.clear();
  }

  recordSession({
    gameProfile,
    hardwareProfile,
    tierProfile,
    settings,
    metrics,
    trace,
    binaryMode = "auto",          // "auto" | "binary" | "non-binary"
    executionContext = null       // optional, observational
  }) {
    const settingsHash = computeSettingsHash(settings);
    const key = buildCompositeKey(
      gameProfile,
      hardwareProfile,
      tierProfile,
      settingsHash,
      binaryMode
    );

    const score = scoreSession(metrics);
    const existing = this.entries.get(key);

    if (!existing || score > existing.bestScore) {
      const entry = {
        key,
        gameProfile: gameProfile || {},
        hardwareProfile: hardwareProfile || {},
        tierProfile: tierProfile || {},
        settingsHash,
        settings: settings || {},
        bestMetrics: metrics || {},
        bestScore: score,
        bestTrace: Array.isArray(trace) ? trace.slice() : null,
        binaryMode,
        executionContext: executionContext || null,
        meta: { ...SURVIVAL_CONTEXT }
      };
      this.entries.set(key, entry);
    }

    return this.entries.get(key);
  }

  getBestSettingsFor(gameProfile, hardwareProfile, tierProfile, opts = {}) {
    const gameKey = buildGameKey(gameProfile);
    const hwKey = buildHardwareKey(hardwareProfile);
    const tierKey = tierProfile ? buildTierKey(tierProfile) : null;
    const preferredBinaryMode = opts.binaryMode || null;

    let bestEntry = null;

    for (const entry of this.entries.values()) {
      if (buildGameKey(entry.gameProfile) !== gameKey) continue;
      if (buildHardwareKey(entry.hardwareProfile) !== hwKey) continue;
      if (tierKey && buildTierKey(entry.tierProfile) !== tierKey) continue;

      if (
        preferredBinaryMode &&
        entry.binaryMode &&
        entry.binaryMode !== preferredBinaryMode
      ) {
        continue;
      }

      if (!bestEntry || entry.bestScore > bestEntry.bestScore) {
        bestEntry = entry;
      }
    }

    return bestEntry;
  }

  serialize() {
    return JSON.stringify([...this.entries.values()]);
  }

  deserialize(jsonString) {
    this.entries.clear();
    if (!jsonString) return;

    let arr;
    try {
      arr = JSON.parse(jsonString);
    } catch {
      return;
    }

    if (!Array.isArray(arr)) return;

    arr.forEach((entry) => {
      if (!entry || typeof entry !== "object" || !entry.key) return;

      const safeEntry = {
        key: entry.key,
        gameProfile: entry.gameProfile || {},
        hardwareProfile: entry.hardwareProfile || {},
        tierProfile: entry.tierProfile || {},
        settingsHash: entry.settingsHash || "",
        settings: entry.settings || {},
        bestMetrics: entry.bestMetrics || {},
        bestScore:
          typeof entry.bestScore === "number" ? entry.bestScore : 0,
        bestTrace: Array.isArray(entry.bestTrace) ? entry.bestTrace : null,
        binaryMode: entry.binaryMode || "auto",
        executionContext: entry.executionContext || null,
        meta: { ...SURVIVAL_CONTEXT }
      };

      this.entries.set(safeEntry.key, safeEntry);
    });
  }
}


// ------------------------------------------------------------
// Public API wrapper — Evolution Core Surface
// ------------------------------------------------------------
class PulseGPUSurvivalInstincts {
  constructor() {
    this.store = new PulseGPUSurvivalInstinctsStore();
    this.meta = { ...SURVIVAL_CONTEXT };
  }

  recordSession(session) {
    return this.store.recordSession(session);
  }

  getBestSettingsFor(gameProfile, hardwareProfile, tierProfile, opts) {
    return this.store.getBestSettingsFor(
      gameProfile,
      hardwareProfile,
      tierProfile,
      opts
    );
  }

  detectRegression(currentMetrics, baselineMetrics) {
    return detectRegression(currentMetrics, baselineMetrics);
  }

  scoreSession(metrics) {
    return scoreSession(metrics);
  }

  serialize() {
    return this.store.serialize();
  }

  deserialize(jsonString) {
    this.store.deserialize(jsonString);
  }

  clear() {
    this.store.clear();
  }
}


// ------------------------------------------------------------
// EXPORTS
// ------------------------------------------------------------
export {
  PulseGPUSurvivalInstincts,
  computeSettingsHash,
  scoreSession,
  detectRegression
};
