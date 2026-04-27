// ============================================================================
// FILE: tropic-pulse-functions/apps/PULSE-EARN/PulseEarnCell-v11-Evo.js
// LAYER: THE CELL (Deterministic Worker + Safe Compute Participant)
// ============================================================================
//
// ROLE (v11-Evo):
//   THE CELL — Pulse‑Earn’s sandboxed metabolic labor unit.
//   • Executes deterministic, rule‑bound compute tasks (cellular metabolism).
//   • Returns safe, structured results (ATP output).
//   • Maintains personal healing metadata (cell health).
//   • Emits v11‑Evo metabolic signatures.
//   • Dual-band aware (symbolic + binary) as metadata-only.
//
// PURPOSE (v11-Evo):
//   • Provide a deterministic, drift‑proof compute engine.
//   • Guarantee safe execution of text/math/data/json operations.
//   • Maintain healing metadata for Earn healers.
//   • Track metabolic cycles + cell health (conceptual only).
//   • Expose loop/wave/advantage surfaces for Earn evolution engines.
//
// CONTRACT (v11-Evo):
//   • PURE COMPUTE — no AI layers, no translation, no memory model.
//   • READ‑ONLY except for healing metadata.
//   • NO eval(), NO Function(), NO dynamic imports.
//   • NO network access.
//   • NO executing user code.
//   • Deterministic output only.
//   • No timestamps, no randomness, no async.
//   • Band is metadata-only (no non-deterministic branching).
// ============================================================================

export const PulseEarnCellMeta = Object.freeze({
  layer: "PulseEarnCell",
  role: "CELL_WORKER",
  version: "v11.2-EVO",
  identity: "PulseEarnCell-v11.2-EVO",

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
    worldLensAware: false
  }),

  contract: Object.freeze({
    input: [
      "EarnCellJob",
      "DualBandContext"
    ],
    output: [
      "EarnCellResult",
      "EarnCellDiagnostics",
      "EarnCellSignatures"
    ]
  }),

  lineage: Object.freeze({
    root: "PulseOS-v11-EVO",
    parent: "PulseEarn-v11.2-EVO",
    ancestry: [
      "PulseEarnCell-v10",
      "PulseEarnCell-v11",
      "PulseEarnCell-v11-Evo"
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
    adaptive: "healing metadata + advantage surfaces",
    return: "deterministic structured output"
  })
});

// ============================================================================
// CELL CONTEXT METADATA (v11-Evo)
// ============================================================================
const EARN_CELL_CONTEXT = {
  layer: "PulseEarnCell-v11-Evo",
  role: "CELL_WORKER",
  purpose: "Execute deterministic, sandboxed compute operations for Earn jobs",
  context: "Safe compute participant + healing metadata (cell health)",
  version: "11-Evo"
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
// Healing Metadata — Cell Health Log (v11-Evo)
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
// Deterministic Hash Helper — v11-Evo
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
// Signature Builders — v11-Evo
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
// Health / Tier / Advantage / Loop / Wave — v11-Evo
// ============================================================================
function computeHealthScore(jobType, band) {
  const base = 0.8;
  const typeBias =
    jobType === "math.compute" ? 0.05 :
    jobType === "data.aggregate" ? 0.03 :
    jobType === "json.transform" ? 0.02 :
    0.0;

  const bandBias = normalizeBand(band) === CELL_BANDS.BINARY ? 0.02 : 0.0;
  const score = base + typeBias + bandBias;

  if (score > 1.0) return 1.0;
  if (score < 0.15) return 0.15;
  return score;
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
// computeWork(job) — Deterministic Metabolic Labor
// ============================================================================
export function computeWork(job) {
  healingState.cycleCount++;
  healingState.lastCycleIndex = healingState.cycleCount;
  healingState.executionState = "dispatching";

  const band = normalizeBand(job && job.band);
  healingState.lastBand = band;

  try {
    if (!job || !job.type || !job.payload) {
      healingState.lastError = "invalid_job_structure";
      healingState.executionState = "error";
      healingState.continuanceFallback = true;

      const healthScore = computeHealthScore("invalid", band);
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

        const uHealthScore = computeHealthScore(type, band);
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
          ...EARN_CELL_CONTEXT
        };
    }

    healingState.lastOutput = output;
    healingState.lastOutputSignature = buildOutputSignature(output, band);
    healingState.lastError = null;
    healingState.executionState = "returning";

    const healthScore = computeHealthScore(type, band);
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
      ...EARN_CELL_CONTEXT
    };

  } catch (err) {
    const msg = String(err && err.message ? err.message : err);

    healingState.lastError = msg;
    healingState.executionState = "error";
    healingState.continuanceFallback = true;

    const healthScore = computeHealthScore(healingState.lastJobType || "error", band);
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
      ...EARN_CELL_CONTEXT
    };
  }
}


// ============================================================================
// SAFE COMPUTE MODULES — Deterministic Cell Skillset
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
  switch (operation) {
    case "sum": return values.reduce((a, b) => a + b, 0);
    case "avg": return values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
    case "max": return values.length ? Math.max(...values) : -Infinity;
    case "min": return values.length ? Math.min(...values) : Infinity;
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
// Export healing metadata — Cell Health Snapshot (v11-Evo)
// ============================================================================
export function getPulseEarnCellHealingState() {
  return { ...healingState };
}
