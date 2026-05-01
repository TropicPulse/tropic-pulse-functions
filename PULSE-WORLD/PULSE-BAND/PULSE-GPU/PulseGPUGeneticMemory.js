// ============================================================================
// FILE: tropic-pulse-functions/PULSE-WORLD/PULSE-GPU/PulseGPUGeneticMemory.js
// PULSE GPU GENETIC MEMORY v12.3-Presence-binary-Prime — THE DNA ARCHIVE
// Long-Horizon Pattern Memory • Lineage Store • Deterministic Pattern Engine
// ============================================================================
//
// IDENTITY — THE DNA ARCHIVE (v12.3-Presence-binary-Prime):
//  --------------------------------------------------------
//  • Long-term genetic memory of the GPU organism.
//  • Stores lineage, execution signatures, binary-mode outcomes, and patterns.
//  • Stores dispatch signatures, shape signatures, pressure correlations.
//  • Reads traces, metrics, and survival entries to extract stable patterns.
//  • No prediction — only pattern recognition over what actually happened.
//  • Designed for Advisor, Healer, Orchestrator, Insights, UI, Engine.
//  • Advantage-cascade aware: systemic gains improve pattern density.
//  • PulseSend-v12.3-ready • Earn-v3-ready • Binary/NonBinary dual-mode aware.
//
// SAFETY CONTRACT (v12.3-Presence-binary-Prime):
//  ---------------------------------------------
//  • No randomness
//  • No timestamps
//  • No GPU calls
//  • No DOM
//  • No Node APIs
//  • No network or filesystem access
//  • Fail-open: malformed inputs → ignored, never crash
//  • Self-repair-ready: entries include OS metadata
//  • Deterministic: same inputs → same genetic memory
// ============================================================================


// ============================================================================
// CONTEXT METADATA — Genetic Memory Identity
// ============================================================================
const GENETIC_MEMORY_CONTEXT = {
  layer: "PulseGPUGeneticMemory",
  role: "DNA_ARCHIVE",
  purpose:
    "Long-horizon genetic memory for configs, execution signatures, patterns, lineage, and correlations",
  context:
    "Stores lineage, binary-mode outcomes, dispatch signatures, shape signatures, and pattern stats",
  target: "full-gpu+binary",
  version: "12.3-Presence-binary-Prime",
  selfRepairable: true,

  evo: {
    advantageCascadeAware: true,
    pulseEfficiencyAware: true,
    driftProof: true,
    multiInstanceReady: true,
    unifiedAdvantageField: true,
    pulseSend11Ready: true,

    dualModeEvolution: true,
    binaryAware: true,
    symbolicAware: true,
    gpuDispatchAware: true,
    gpuMemoryAware: true,
    gpuAdvantageAware: true,

    // v12.3-Presence contracts
    routingContract: "PulseSend-v12.3",
    gpuOrganContract: "PulseGPU-v12.3-Presence",
    earnCompatibility: "Earn-v3",

    // Legacy compatibility
    legacyRoutingContract: "PulseSend-v10.4",
    legacyGPUOrganContract: "PulseGPU-v10.4",
    legacyEarnCompatibility: "Earn-v2"
  }
};

// ============================================================================
// Utility: stable JSON stringify for hashing
// ============================================================================
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


// ============================================================================
// Utility: simple deterministic hash
// ============================================================================
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return (hash >>> 0).toString(16);
}


// ============================================================================
// Utility: clamp
// ============================================================================
function clamp(value, min, max) {
  if (typeof value !== "number" || Number.isNaN(value)) return min;
  if (value < min) return min;
  if (value > max) return max;
  return value;
}


// ============================================================================
// Signature builders — Genetic Keys (v12.3-Presence-binary-Prime)
// ============================================================================
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


// ============================================================================
// Execution Context Key — FULL v12.3-Presence-binary-Prime
// ============================================================================
function buildExecutionContextKey(executionContext = {}) {
  const {
    binaryMode = "auto",          // "auto" | "binary" | "non-binary" | "dual"
    pipelineId = "",
    sceneType = "",
    workloadClass = "",
    resolution = "",
    refreshRate = 0,

    // v12.3-Presence GPU organ fields
    dispatchSignature = "",
    shapeSignature = ""
  } = executionContext;

  return stableStringify({
    binaryMode,
    pipelineId,
    sceneType,
    workloadClass,
    resolution,
    refreshRate,
    dispatchSignature,
    shapeSignature
  });
}


// ============================================================================
// Genetic Key — full organism fingerprint
// ============================================================================
function buildGeneticKey({
  gameProfile,
  hardwareProfile,
  tierProfile,
  executionContext
}) {
  const gameKey = buildGameKey(gameProfile);
  const hwKey = buildHardwareKey(hardwareProfile);
  const tierKey = buildTierKey(tierProfile || {});
  const ctxKey = buildExecutionContextKey(executionContext || {});

  const base = stableStringify({
    gameKey,
    hwKey,
    tierKey,
    ctxKey
  });

  return simpleHash(base);
}


// ============================================================================
// Pattern aggregation helpers — v12.3-Presence-binary-Prime
// ============================================================================
function safeNumber(n, fallback = 0) {
  return typeof n === "number" && !Number.isNaN(n) ? n : fallback;
}

function aggregatePatternStats(existing, sample) {
  const next = existing
    ? { ...existing }
    : {
        sampleCount: 0,
        avgFPS: 0,
        minFPS: 0,
        stutterRate: 0,
        crashRate: 0,
        avgDurationMs: 0,

        // v12.3-Presence-binary-Prime pattern vectors
        pressureVector: { gpu: 0, thermal: 0, memory: 0, mesh: 0, aura: 0 },
        binaryModeRatio: 0,
        symbolicModeRatio: 0
      };

  const count = next.sampleCount;
  const newCount = count + 1;

  const sAvgFPS = safeNumber(sample.avgFPS);
  const sMinFPS = safeNumber(sample.minFPS);
  const sStutters = clamp(safeNumber(sample.stutters), 0, 100000);
  const sCrash = sample.crashFlag ? 1 : 0;
  const sDuration = clamp(safeNumber(sample.totalDurationMs), 0, 60 * 60 * 1000);

  next.avgFPS = (next.avgFPS * count + sAvgFPS) / newCount;
  next.minFPS = (next.minFPS * count + sMinFPS) / newCount;

  const stutterRateSample = sDuration > 0 ? sStutters / sDuration : 0;
  next.stutterRate =
    (next.stutterRate * count + stutterRateSample) / newCount;

  next.crashRate = (next.crashRate * count + sCrash) / newCount;
  next.avgDurationMs =
    (next.avgDurationMs * count + sDuration) / newCount;

  // v12.3-Presence-binary-Prime: pressure vector
  if (sample.pressureSnapshot) {
    const p = sample.pressureSnapshot;
    next.pressureVector = {
      gpu:
        (next.pressureVector.gpu * count +
          safeNumber(p.gpuLoadPressure)) /
        newCount,
      thermal:
        (next.pressureVector.thermal * count +
          safeNumber(p.thermalPressure)) /
        newCount,
      memory:
        (next.pressureVector.memory * count +
          safeNumber(p.memoryPressure)) /
        newCount,
      mesh:
        (next.pressureVector.mesh * count +
          safeNumber(p.meshStormPressure)) /
        newCount,
      aura:
        (next.pressureVector.aura * count +
          safeNumber(p.auraTension)) /
        newCount
    };
  }

  // v12.3-Presence-binary-Prime: mode ratios
  if (sample.binaryStepCount || sample.symbolicStepCount) {
    const total = sample.binaryStepCount + sample.symbolicStepCount;
    if (total > 0) {
      next.binaryModeRatio =
        (next.binaryModeRatio * count + sample.binaryStepCount / total) /
        newCount;
      next.symbolicModeRatio =
        (next.symbolicModeRatio * count + sample.symbolicStepCount / total) /
        newCount;
    }
  }

  next.sampleCount = newCount;
  return next;
}


// ============================================================================
// Genetic Memory Store — DNA Archive Map (v12.3-Presence-binary-Prime)
// ============================================================================
class PulseGPUGeneticMemoryStore {
  constructor() {
    this.entries = new Map();
    this.meta = { ...GENETIC_MEMORY_CONTEXT };
  }

  clear() {
    this.entries.clear();
  }

  recordObservation({
    gameProfile,
    hardwareProfile,
    tierProfile,
    executionContext,
    metrics,
    traceSummary
  }) {
    const key = buildGeneticKey({
      gameProfile,
      hardwareProfile,
      tierProfile,
      executionContext
    });

    const existing = this.entries.get(key);

    const sample = {
      avgFPS:
        typeof metrics?.avgFps === "number"
          ? metrics.avgFps
          : metrics?.avgFPS || 0,
      minFPS:
        typeof metrics?.minFps === "number"
          ? metrics.minFps
          : metrics?.minFPS || 0,
      stutters:
        typeof metrics?.stutters === "number"
          ? metrics.stutters
          : metrics?.stutterCount || 0,
      crashFlag: !!metrics?.crashFlag,
      totalDurationMs: traceSummary?.totalDurationMs || 0,

      // v12.3-Presence-binary-Prime fields
      pressureSnapshot: traceSummary?.pressureSnapshot || null,
      binaryStepCount: traceSummary?.binaryStepCount || 0,
      symbolicStepCount: traceSummary?.symbolicStepCount || 0
    };

    const updatedStats = aggregatePatternStats(
      existing?.patternStats,
      sample
    );

    const entry = {
      key,
      gameProfile: gameProfile || {},
      hardwareProfile: hardwareProfile || {},
      tierProfile: tierProfile || {},
      executionContext: executionContext || {},
      patternStats: updatedStats,
      meta: { ...GENETIC_MEMORY_CONTEXT }
    };

    this.entries.set(key, entry);
    return entry;
  }

  getPatternForContext({
    gameProfile,
    hardwareProfile,
    tierProfile,
    executionContext
  }) {
    const key = buildGeneticKey({
      gameProfile,
      hardwareProfile,
      tierProfile,
      executionContext
    });

    return this.entries.get(key) || null;
  }

  queryPatterns({
    gameId,
    gpuModel,
    binaryMode
  } = {}) {
    const results = [];

    for (const entry of this.entries.values()) {
      const gp = entry.gameProfile || {};
      const hp = entry.hardwareProfile || {};
      const ctx = entry.executionContext || {};

      if (gameId && gp.gameId !== gameId) continue;
      if (gpuModel && hp.gpuModel !== gpuModel) continue;
      if (binaryMode && ctx.binaryMode !== binaryMode) continue;

      results.push(entry);
    }

    return results;
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

      const ps = entry.patternStats || {};

      const safeEntry = {
        key: entry.key,
        gameProfile: entry.gameProfile || {},
        hardwareProfile: entry.hardwareProfile || {},
        tierProfile: entry.tierProfile || {},
        executionContext: entry.executionContext || {},
        patternStats: {
          sampleCount: ps.sampleCount || 0,
          avgFPS: ps.avgFPS || 0,
          minFPS: ps.minFPS || 0,
          stutterRate: ps.stutterRate || 0,
          crashRate: ps.crashRate || 0,
          avgDurationMs: ps.avgDurationMs || 0,
          pressureVector: ps.pressureVector || {
            gpu: 0,
            thermal: 0,
            memory: 0,
            mesh: 0,
            aura: 0
          },
          binaryModeRatio: ps.binaryModeRatio || 0,
          symbolicModeRatio: ps.symbolicModeRatio || 0
        },
        meta: { ...GENETIC_MEMORY_CONTEXT }
      };

      this.entries.set(safeEntry.key, safeEntry);
    });
  }
}



// ============================================================================
// Public API — Genetic Memory Surface
// ============================================================================
class PulseGPUGeneticMemory {
  constructor() {
    this.store = new PulseGPUGeneticMemoryStore();
    this.meta = { ...GENETIC_MEMORY_CONTEXT };
  }

  recordObservation(observation) {
    return this.store.recordObservation(observation || {});
  }

  getPatternForContext(context) {
    return this.store.getPatternForContext(context || {});
  }

  queryPatterns(query) {
    return this.store.queryPatterns(query || {});
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


// ============================================================================
// EXPORTS
// ============================================================================
export {
  PulseGPUGeneticMemory,
  PulseGPUGeneticMemoryStore,
  buildGeneticKey
};
