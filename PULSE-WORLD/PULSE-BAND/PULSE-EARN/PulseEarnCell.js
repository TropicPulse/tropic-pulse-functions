// ============================================================================
// FILE: tropic-pulse-functions/PULSE-WORLD/PULSE-EARN/PulseEarnCell-v13.0-PRESENCE-IMMORTAL.js
// LAYER: THE CELL WORKER (v13.0-PRESENCE-IMMORTAL)
// (Deterministic Cell Compute + Presence/Advantage/Hints + Compute Profile)
// ============================================================================
//
// ROLE (v13.0-PRESENCE-IMMORTAL):
//   THE CELL WORKER — Pulse‑Earn’s deterministic micro‑compute organ.
//   • Executes small, sandboxed, deterministic operations.
//   • Emits v13‑Presence‑IMMORTAL presence/advantage/hints surfaces.
//   • Emits cell compute profile (metadata-only).
//   • Emits loop + wave fields as structural metadata.
//   • No speed, no baselines, no governors, no performance math.
//
// CONTRACT (v13.0-PRESENCE-IMMORTAL):
//   • PURE COMPUTE — no AI layers, no translation, no memory model.
//   • NO eval(), NO Function(), NO dynamic imports.
//   • NO user scripts, NO network calls, NO filesystem access.
//   • NEVER mutate job objects.
//   • Deterministic output only.
//   • Dual-band + binary + wave + presence metadata are structural-only.
// ============================================================================
/*
AI_EXPERIENCE_META = {
  identity: "PulseEarnCell",
  version: "v14-IMMORTAL",
  layer: "earn_cell",
  role: "earn_metabolic_cell",
  lineage: "PulseEarnCell-v9 → v11-Evo → v14-IMMORTAL",

  evo: {
    earnCell: true,
    metabolicUnit: true,
    jobExecutor: true,
    dualBand: true,
    symbolicPrimary: true,
    binaryAware: true,

    deterministic: true,
    driftProof: true,
    pureCompute: true,
    zeroMutationOfInput: true,
    zeroNetwork: true,
    zeroFilesystem: true
  },

  contract: {
    always: [
      "PulseEarn",
      "PulseEarnCirculatorySystem",
      "PulseEarnEndocrineSystem"
    ],
    never: [
      "safeRoute",
      "fetchViaCNS"
    ]
  }
}
*/

export const PulseEarnCellMeta = Object.freeze({
  layer: "PulseEarnCell",
  role: "CELL_WORKER",
  version: "v13.0-PRESENCE-IMMORTAL",
  identity: "PulseEarnCell-v13.0-PRESENCE-IMMORTAL",

  guarantees: Object.freeze({
    deterministic: true,
    noRandomness: true,
    noRealTime: true,
    noExternalIO: true,
    pureCompute: true,
    safeSandbox: true,
    dualBandAware: true,
    binaryAware: true,
    evolutionAware: true,
    healingMetadataAware: true,
    waveFieldAware: true,
    loopFieldAware: true,
    worldLensAware: false,

    presenceAware: true,
    advantageAware: true,
    fallbackBandAware: true,
    chunkAware: true,
    cacheAware: true,
    prewarmAware: true,
    coldStartAware: true,
    expansionAware: true,
    meshAware: true,
    castleAware: true,
    regionAware: true,
    dualbandSafe: true
  }),

  contract: Object.freeze({
    input: [
      "EarnCellJob",
      "DualBandContext",
      "GlobalHintsPresenceField"
    ],
    output: [
      "EarnCellResult",
      "EarnCellDiagnostics",
      "EarnCellSignatures",
      "EarnCellPresenceField",
      "EarnCellAdvantageField",
      "EarnCellComputeProfile"
    ]
  }),

  lineage: Object.freeze({
    root: "PulseOS-v11-EVO",
    parent: "PulseEarn-v13.0-PRESENCE-IMMORTAL",
    ancestry: [
      "PulseEarnCell-v10",
      "PulseEarnCell-v11",
      "PulseEarnCell-v11-Evo",
      "PulseEarnCell-v12.3-PRESENCE-EVO+"
    ]
  }),

  bands: Object.freeze({
    supported: ["symbolic", "binary"],
    default: "symbolic",
    behavior: "metadata-only"
  }),

  architecture: Object.freeze({
    pattern: "A-B-A",
    baseline: "deterministic compute",
    adaptive: "healing metadata + advantage surfaces + presence/hints surfaces",
    return: "deterministic structured output"
  })
});

// ============================================================================
// CELL CONTEXT METADATA
// ============================================================================
const EARN_CELL_CONTEXT = {
  layer: "PulseEarnCell-v13.0-PRESENCE-IMMORTAL",
  role: "CELL_WORKER",
  purpose: "Execute deterministic, sandboxed compute operations for Earn jobs",
  context: "Safe compute participant + healing metadata (cell health)",
  version: "13.0-PRESENCE-IMMORTAL"
};

// ============================================================================
// Dual-band constants (symbolic + binary) — metadata-only
// ============================================================================
const CELL_BANDS = {
  SYMBOLIC: "symbolic",
  BINARY: "binary"
};

function normalizeBand(band) {
  const b = String(band || CELL_BANDS.SYMBOLIC).toLowerCase();
  return b === CELL_BANDS.BINARY ? CELL_BANDS.BINARY : CELL_BANDS.SYMBOLIC;
}

// ============================================================================
// Healing Metadata — Cell Health Log
// ============================================================================
const healingState = {
  lastJobType: null,
  lastError: null,
  lastOutput: null,
  continuanceFallback: false,

  cycleCount: 0,
  lastCycleIndex: 0,
  executionState: "idle", // idle | dispatching | executing | returning | error

  lastCellSignature: null,
  lastJobSignature: null,
  lastOutputSignature: null,

  lastHealthScore: 1.0,
  lastTier: "microDegrade",
  lastBand: CELL_BANDS.SYMBOLIC,
  lastAdvantageField: null,
  lastDiagnostics: null,
  lastLoopField: null,
  lastWaveField: null,

  ...EARN_CELL_CONTEXT
};

// ============================================================================
// Deterministic Hash Helper
// ============================================================================
function computeHash(str) {
  let h = 0;
  const s = String(str || "");
  for (let i = 0; i < s.length; i++) {
    h = (h + s.charCodeAt(i) * (i + 1)) % 100000;
  }
  return `h${h}`;
}

// ============================================================================
// Signature Builders
// ============================================================================
function buildCellSignature(cycle, band) {
  return computeHash(`CELL::${cycle}::${normalizeBand(band)}`);
}

function buildJobSignature(type, band) {
  return computeHash(`JOBTYPE::${normalizeBand(band)}::${type}`);
}

function buildOutputSignature(output, band) {
  return computeHash(
    `OUTPUT::${normalizeBand(band)}::${JSON.stringify(output).length}`
  );
}

// ============================================================================
// Health / Tier / Advantage / Loop / Wave
// ============================================================================
// v13 IMMORTAL: no performance math, no type/band bias.
// Health is neutral, descriptive-only.
function computeHealthScore() {
  return 1.0;
}

function classifyDegradationTier(h) {
  if (h >= 0.95) return "microDegrade";
  if (h >= 0.85) return "softDegrade";
  if (h >= 0.50) return "midDegrade";
  if (h >= 0.15) return "hardDegrade";
  return "criticalDegrade";
}

function buildAdvantageField(jobType, band) {
  const b = normalizeBand(band);

  return {
    advantageVersion: "C-13.0",
    jobType,
    band: b,
    symbolicPlanningBias: b === CELL_BANDS.SYMBOLIC ? 1 : 0,
    binaryCompressionBias: b === CELL_BANDS.BINARY ? 1 : 0
  };
}

function buildDiagnostics(jobType, band, healthScore, tier) {
  const b = normalizeBand(band);

  return {
    jobType,
    band: b,
    healthScore,
    tier,
    bandMode:
      b === CELL_BANDS.BINARY ? "binary-compression" : "symbolic-planning"
  };
}

function buildLoopField(cycle, band) {
  const b = normalizeBand(band);
  return {
    cycle,
    closedLoop: cycle > 0,
    loopStrength: cycle * (b === CELL_BANDS.BINARY ? 2 : 1),
    band: b
  };
}

function buildWaveField(jobType, band) {
  const len = String(jobType || "").length;
  const b = normalizeBand(band);

  return {
    wavelength: len,
    amplitude: len % 7,
    phase: (len * 3) % 8,
    band: b,
    mode: b === CELL_BANDS.BINARY ? "compression-wave" : "symbolic-wave"
  };
}

// ============================================================================
// Presence / Advantage / Hints / Compute Profile from globalHints/context
// ============================================================================
function cwClamp01(x) {
  if (x == null || Number.isNaN(x)) return 0;
  return Math.max(0, Math.min(1, x));
}

function cwNormalizeCachePriority(p) {
  if (!p) return "normal";
  const v = String(p).toLowerCase();
  if (v === "critical" || v === "high" || v === "low") return v;
  return "normal";
}

function buildPresenceFieldFromContext(context = {}) {
  const gh = context.globalHints || {};
  const pf = context.presenceField || {};
  const mesh = context.meshSignals || {};
  const castle = context.castleSignals || {};
  const region = gh.regionContext || {};

  const meshPressureIndex = mesh.meshPressureIndex || 0;
  const castleLoadLevel = castle.loadLevel || 0;
  const meshStrength = mesh.meshStrength || 0;

  const pressure = meshPressureIndex + castleLoadLevel;
  let presenceTier = "idle";
  if (pressure >= 150) presenceTier = "critical";
  else if (pressure >= 100) presenceTier = "high";
  else if (pressure >= 50) presenceTier = "elevated";
  else if (pressure > 0) presenceTier = "soft";

  const presenceSignature = computeHash(
    `CELL_PRESENCE_V13::${presenceTier}::${meshPressureIndex}::${castleLoadLevel}`
  );

  return Object.freeze({
    presenceVersion: "v13.0-PRESENCE-IMMORTAL",
    presenceTier,
    presenceSignature,

    bandPresence: pf.bandPresence || gh.presenceContext?.bandPresence || "unknown",
    routerPresence: pf.routerPresence || gh.presenceContext?.routerPresence || "unknown",
    devicePresence: pf.devicePresence || gh.presenceContext?.devicePresence || "unknown",
    meshPresence: pf.meshPresence || mesh.meshStrength || "unknown",
    castlePresence: pf.castlePresence || castle.castlePresence || "unknown",
    regionPresence: pf.regionPresence || region.regionTag || "unknown",
    regionId: region.regionId || "unknown-region",
    castleId: castle.castleId || "unknown-castle",
    castleLoadLevel,
    meshStrength,
    meshPressureIndex
  });
}

function buildAdvantageFieldFromHints(context = {}) {
  const gh = context.globalHints || {};
  const adv = gh.advantageContext || {};

  return Object.freeze({
    advantageVersion: "C-13.0",
    advantageScore: adv.score ?? null,
    advantageBand: adv.band ?? "neutral",
    advantageTier: adv.tier ?? 0
  });
}

function buildHintsFieldFromHints(context = {}) {
  const gh = context.globalHints || {};
  return Object.freeze({
    fallbackBandLevel: gh.fallbackBandLevel ?? 0,
    chunkHints: gh.chunkHints || {},
    cacheHints: gh.cacheHints || {},
    prewarmHints: gh.prewarmHints || {},
    coldStartHints: gh.coldStartHints || {}
  });
}

function deriveFactoringSignal({ meshPressureIndex = 0, cachePriority = "normal", prewarmNeeded = false }) {
  const pressure = cwClamp01(meshPressureIndex / 100);
  const highPressure = pressure >= 0.7;
  const criticalCache = cachePriority === "critical";
  if (criticalCache || prewarmNeeded) return 1;
  if (highPressure) return 1;
  return 0;
}

function buildComputeProfile({ band, context = {} }) {
  const b = normalizeBand(band);
  const hintsField = buildHintsFieldFromHints(context);
  const cachePriority = cwNormalizeCachePriority(hintsField.cacheHints.priority);
  const prewarmNeeded = !!hintsField.prewarmHints.shouldPrewarm;
  const meshPressureIndex = (context.meshSignals && context.meshSignals.meshPressureIndex) || 0;

  const factoringSignal = deriveFactoringSignal({
    meshPressureIndex,
    cachePriority,
    prewarmNeeded
  });

  const serverHints = context.serverAdvantageHints || {};

  return Object.freeze({
    routeBand: b,
    fallbackBandLevel: hintsField.fallbackBandLevel,
    chunkAggression: hintsField.chunkHints.chunkAggression ?? 0,
    cachePriority,
    prewarmNeeded,
    binaryPreferred: b === CELL_BANDS.BINARY,
    symbolicPreferred: b === CELL_BANDS.SYMBOLIC,
    factoringSignal,
    hotStateReuse: serverHints.hotStateReuse ?? true,
    multiInstanceBatching: serverHints.multiInstanceBatching ?? true,
    serverPlanCache: serverHints.planCache ?? true,
    serverBinaryReuse: serverHints.binaryReuse ?? true
  });
}

// ============================================================================
// Deterministic Cell Workloads
// ============================================================================
function textTransform({ text = "", mode = "upper" }) {
  switch (mode) {
    case "upper": return text.toUpperCase();
    case "lower": return text.toLowerCase();
    case "reverse": return text.split("").reverse().join("");
    default: throw new Error(`Unknown text mode: ${mode}`);
  }
}

function mathCompute({ operation, values = [] }) {
  const nums = Array.isArray(values)
    ? values.map((v) => Number(v)).filter((v) => Number.isFinite(v))
    : [];
  switch (operation) {
    case "sum": return nums.reduce((a, b) => a + b, 0);
    case "avg": return nums.length ? nums.reduce((a, b) => a + b, 0) / nums.length : 0;
    case "max": return nums.length ? Math.max(...nums) : -Infinity;
    case "min": return nums.length ? Math.min(...nums) : Infinity;
    default: throw new Error(`Unknown math operation: ${operation}`);
  }
}

function dataAggregate({ items = [], field }) {
  if (!field) throw new Error("Missing field for data.aggregate");
  return items.map(item => item[field]);
}

function jsonTransform({ json, pick }) {
  if (!json || typeof json !== "object") {
    throw new Error("Invalid JSON payload");
  }

  if (!pick) return json;

  const out = {};
  for (const key of pick) {
    if (Object.prototype.hasOwnProperty.call(json, key)) {
      out[key] = json[key];
    }
  }
  return out;
}

// ============================================================================
// computeWork — v13 IMMORTAL Cell Execution
// ============================================================================
export function computeWork(job, context = {}) {
  healingState.cycleCount++;
  healingState.lastCycleIndex = healingState.cycleCount;
  healingState.executionState = "dispatching";

  const band = normalizeBand(job && job.band);
  healingState.lastBand = band;

  const presenceField = buildPresenceFieldFromContext(context);
  const presenceAdvantageField = buildAdvantageFieldFromHints(context);
  const hintsField = buildHintsFieldFromHints(context);
  const computeProfile = buildComputeProfile({ band, context });

  try {
    if (!job || !job.type || !job.payload) {
      healingState.lastError = "invalid_job_structure";
      healingState.executionState = "error";
      healingState.continuanceFallback = true;

      const healthScore = computeHealthScore();
      const tier = classifyDegradationTier(healthScore);
      const advantageField = buildAdvantageField("invalid", band);
      const diagnostics = buildDiagnostics("invalid", band, healthScore, tier);
      const loopField = buildLoopField(healingState.cycleCount, band);
      const waveField = buildWaveField("invalid", band);

      healingState.lastHealthScore = healthScore;
      healingState.lastTier = tier;
      healingState.lastAdvantageField = advantageField;
      healingState.lastDiagnostics = diagnostics;
      healingState.lastLoopField = loopField;
      healingState.lastWaveField = waveField;

      healingState.lastCellSignature = buildCellSignature(
        healingState.cycleCount,
        band
      );

      return {
        success: false,
        error: "Invalid job structure",
        durationCycles: healingState.cycleCount,
        band,
        healthScore,
        tier,
        advantageField,
        diagnostics,
        loopField,
        waveField,
        cellSignature: healingState.lastCellSignature,
        continuanceFallback: true,
        presenceField,
        presenceAdvantageField,
        hintsField,
        computeProfile,
        ...EARN_CELL_CONTEXT
      };
    }

    const { type, payload } = job;
    healingState.lastJobType = type;
    healingState.lastJobSignature = buildJobSignature(type, band);

    healingState.executionState = "executing";
    healingState.continuanceFallback = false;

    let output;

    switch (type) {
      case "text.transform":
        output = textTransform(payload);
        break;

      case "math.compute":
        output = mathCompute(payload);
        break;

      case "data.aggregate":
        output = dataAggregate(payload);
        break;

      case "json.transform":
        output = jsonTransform(payload);
        break;

      default:
        healingState.lastError = "unknown_job_type";
        healingState.executionState = "error";
        healingState.continuanceFallback = true;

        const uHealthScore = computeHealthScore();
        const uTier = classifyDegradationTier(uHealthScore);
        const uAdvantageField = buildAdvantageField(type, band);
        const uDiagnostics = buildDiagnostics(type, band, uHealthScore, uTier);
        const uLoopField = buildLoopField(healingState.cycleCount, band);
        const uWaveField = buildWaveField(type, band);

        healingState.lastHealthScore = uHealthScore;
        healingState.lastTier = uTier;
        healingState.lastAdvantageField = uAdvantageField;
        healingState.lastDiagnostics = uDiagnostics;
        healingState.lastLoopField = uLoopField;
        healingState.lastWaveField = uWaveField;

        healingState.lastCellSignature = buildCellSignature(
          healingState.cycleCount,
          band
        );

        return {
          success: false,
          error: `Unknown job type: ${type}`,
          durationCycles: healingState.cycleCount,
          band,
          healthScore: uHealthScore,
          tier: uTier,
          advantageField: uAdvantageField,
          diagnostics: uDiagnostics,
          loopField: uLoopField,
          waveField: uWaveField,
          cellSignature: healingState.lastCellSignature,
          continuanceFallback: true,
          presenceField,
          presenceAdvantageField,
          hintsField,
          computeProfile,
          ...EARN_CELL_CONTEXT
        };
    }

    healingState.lastOutput = output;
    healingState.lastOutputSignature = buildOutputSignature(output, band);
    healingState.lastError = null;
    healingState.executionState = "returning";

    const healthScore = computeHealthScore();
    const tier = classifyDegradationTier(healthScore);
    const advantageField = buildAdvantageField(type, band);
    const diagnostics = buildDiagnostics(type, band, healthScore, tier);
    const loopField = buildLoopField(healingState.cycleCount, band);
    const waveField = buildWaveField(type, band);

    healingState.lastHealthScore = healthScore;
    healingState.lastTier = tier;
    healingState.lastAdvantageField = advantageField;
    healingState.lastDiagnostics = diagnostics;
    healingState.lastLoopField = loopField;
    healingState.lastWaveField = waveField;

    healingState.lastCellSignature = buildCellSignature(
      healingState.cycleCount,
      band
    );

    return {
      success: true,
      output,
      durationCycles: healingState.cycleCount,
      band,
      healthScore,
      tier,
      advantageField,
      diagnostics,
      loopField,
      waveField,
      cellSignature: healingState.lastCellSignature,
      continuanceFallback: false,
      presenceField,
      presenceAdvantageField,
      hintsField,
      computeProfile,
      ...EARN_CELL_CONTEXT
    };

  } catch (err) {
    const msg = String(err && err.message ? err.message : err);

    healingState.lastError = msg;
    healingState.executionState = "error";
    healingState.continuanceFallback = true;

    const healthScore = computeHealthScore();
    const tier = classifyDegradationTier(healthScore);
    const advantageField = buildAdvantageField(
      healingState.lastJobType || "error",
      band
    );
    const diagnostics = buildDiagnostics(
      healingState.lastJobType || "error",
      band,
      healthScore,
      tier
    );
    const loopField = buildLoopField(healingState.cycleCount, band);
    const waveField = buildWaveField(healingState.lastJobType || "error", band);

    healingState.lastHealthScore = healthScore;
    healingState.lastTier = tier;
    healingState.lastAdvantageField = advantageField;
    healingState.lastDiagnostics = diagnostics;
    healingState.lastLoopField = loopField;
    healingState.lastWaveField = waveField;

    healingState.lastCellSignature = buildCellSignature(
      healingState.cycleCount,
      band
    );

    return {
      success: false,
      error: msg,
      durationCycles: healingState.cycleCount,
      band,
      healthScore,
      tier,
      advantageField,
      diagnostics,
      loopField,
      waveField,
      cellSignature: healingState.lastCellSignature,
      continuanceFallback: true,
      presenceField,
      presenceAdvantageField,
      hintsField,
      computeProfile,
      ...EARN_CELL_CONTEXT
    };
  }
}

// ============================================================================
// Export healing metadata — Cell Health Snapshot
// ============================================================================
export function getPulseEarnCellHealingState() {
  return { ...healingState };
}
