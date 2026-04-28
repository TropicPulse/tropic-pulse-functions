// ============================================================================
//  PULSE OS v12.3‑EVO+ — POWER‑PRIME RISK ENGINE
//  Predictive Risk Vector • Artery Fusion • Drift‑Aware • Deterministic
//  PURE COMPUTE. ZERO MUTATION. ZERO RANDOMNESS.
// ============================================================================

export const PowerRiskEngineMeta = Object.freeze({
  layer: "PulseAIPowerPrime",
  role: "POWER_RISK_ENGINE",
  version: "12.3-EVO+",
  identity: "powerRiskEngine-v12.3-EVO+",

  evo: Object.freeze({
    deterministic: true,
    driftProof: true,
    arteryFusionAware: true,
    continuanceAware: true,
    outageAware: true,
    fluctuationAware: true,
    hormoneAware: true,
    personaAware: true,
    memoryAware: true,
    evolutionAware: true,
    readOnly: true,
    epoch: "12.3-EVO+"
  })
});

// ============================================================================
//  INTERNAL HELPERS — SAFE NORMALIZATION
// ============================================================================

function norm(v) {
  if (typeof v !== "number" || isNaN(v)) return 0;
  return Math.max(0, Math.min(1, v));
}

function safeLen(arr) {
  return Array.isArray(arr) ? arr.length : 0;
}

// ============================================================================
//  ARTERY FUSION — BUILD RISK VECTOR INPUTS
// ============================================================================

function fuseArteryWeights(fusedArteries) {
  const {
    metabolic,
    nervous,
    immune,
    hormones,
    pipeline,
    scanner,
    personalFrame,
    personality,
    memory,
    evolution
  } = fusedArteries;

  return Object.freeze({
    metabolicPressure: norm(metabolic.pressure),
    metabolicLoad: norm(metabolic.load),

    routingPressure: norm(nervous.routingPressure),
    routingCost: norm(nervous.cost),

    immuneRisk: norm(immune.risk),
    immuneDrift: norm(immune.drift),

    hormoneStress: norm(hormones.stress),
    hormoneStability: norm(hormones.stability),

    pipelinePressure: norm(pipeline.pressure),
    pipelineCost: norm(pipeline.cost),

    scannerDrift: norm(scanner.driftScore),

    toneWarmth: norm(personality.warmth),
    toneClarity: norm(personality.clarity),
    toneHumility: norm(personality.humility),

    abstractionLevel:
      personalFrame.abstraction === "high"
        ? 0.2
        : personalFrame.abstraction === "low"
        ? 0.8
        : 0.5,

    memoryStability: norm(memory.stability),
    memoryDrift: norm(memory.drift),

    evolutionSchemaDrift: norm(evolution.schemaDrift),
    evolutionFileDrift: norm(evolution.fileDrift),
    evolutionRouteDrift: norm(evolution.routeDrift)
  });
}

// ============================================================================
//  POWER‑RISK VECTOR — CORE COMPUTATION
// ============================================================================

export function computePowerRiskVector({
  power,
  history,
  fusedArteries,
  continuance,
  settings = {}
}) {
  const latest = power?.[0] || null;
  const fused = fuseArteryWeights(fusedArteries);

  // --------------------------------------------------------------------------
  // 1. GRID INSTABILITY SCORE (history-based)
  // --------------------------------------------------------------------------
  let instability = 0;
  if (Array.isArray(history) && history.length > 3) {
    let jumps = 0;
    for (let i = 1; i < history.length; i++) {
      const prev = history[i - 1];
      const curr = history[i];
      if (!prev || !curr || prev.value === 0) continue;
      const diff = Math.abs(curr.value - prev.value);
      const pct = (diff / prev.value) * 100;
      if (pct >= 20) jumps++;
    }
    instability = norm(jumps / history.length);
  }

  // --------------------------------------------------------------------------
  // 2. OUTAGE‑LIKELIHOOD SCORE (predictive)
  // --------------------------------------------------------------------------
  const outageLikelihood = norm(
    0.4 * instability +
      0.2 * fused.metabolicPressure +
      0.2 * fused.routingPressure +
      0.2 * fused.pipelinePressure
  );

  // --------------------------------------------------------------------------
  // 3. DRIFT‑RISK SCORE (schema + file + route + scanner)
  // --------------------------------------------------------------------------
  const driftRisk = norm(
    0.25 * fused.scannerDrift +
      0.25 * fused.evolutionSchemaDrift +
      0.25 * fused.evolutionFileDrift +
      0.25 * fused.evolutionRouteDrift
  );

  // --------------------------------------------------------------------------
  // 4. ORGANISM PRESSURE SCORE (metabolic + nervous + pipeline + immune)
  // --------------------------------------------------------------------------
  const organismPressure = norm(
    0.3 * fused.metabolicPressure +
      0.25 * fused.routingPressure +
      0.25 * fused.pipelinePressure +
      0.2 * fused.immuneRisk
  );

  // --------------------------------------------------------------------------
  // 5. HORMONE‑MODULATED RISK (stress ↑, stability ↓)
  // --------------------------------------------------------------------------
  const hormoneMod = norm(
    0.6 * fused.hormoneStress + 0.4 * (1 - fused.hormoneStability)
  );

  // --------------------------------------------------------------------------
  // 6. MEMORY‑STABILITY MODULATION (unstable memory increases risk)
  // --------------------------------------------------------------------------
  const memoryMod = norm(
    0.5 * (1 - fused.memoryStability) + 0.5 * fused.memoryDrift
  );

  // --------------------------------------------------------------------------
  // 7. CONTINUANCE‑AWARE RISK (low continuance → higher risk)
  // --------------------------------------------------------------------------
  const cont = continuance?.continuanceScore ?? 0;
  const continuanceMod = norm(1 - cont);

  // --------------------------------------------------------------------------
  // 8. FINAL POWER‑RISK SCORE (weighted fusion)
  // --------------------------------------------------------------------------
  const riskScore = norm(
    0.25 * organismPressure +
      0.2 * outageLikelihood +
      0.2 * instability +
      0.15 * driftRisk +
      0.1 * hormoneMod +
      0.05 * memoryMod +
      0.05 * continuanceMod
  );

  return Object.freeze({
    riskScore,
    instability,
    outageLikelihood,
    driftRisk,
    organismPressure,
    hormoneMod,
    memoryMod,
    continuanceMod,
    fusedArteries: fused
  });
}

// ============================================================================
//  RISK SUMMARY — HUMAN‑READABLE LEVELS
// ============================================================================

export function buildPowerRiskSummary({ riskVector, continuance }) {
  const r = riskVector.riskScore;

  const level =
    r >= 0.85
      ? "critical"
      : r >= 0.65
      ? "high"
      : r >= 0.4
      ? "medium"
      : r >= 0.2
      ? "low"
      : "minimal";

  return Object.freeze({
    level,
    score: r,
    instability: riskVector.instability,
    outageLikelihood: riskVector.outageLikelihood,
    driftRisk: riskVector.driftRisk,
    organismPressure: riskVector.organismPressure,
    continuance: continuance || null
  });
}

// ============================================================================
//  BEACON SIGNALS — OVERMIND‑PRIME EARLY WARNINGS
// ============================================================================

export function buildPowerBeaconSignals({ riskVector, continuance, fusedArteries }) {
  const beacons = [];

  // High risk → immediate beacon
  if (riskVector.riskScore >= 0.85) {
    beacons.push({
      type: "power-critical",
      severity: "critical",
      message: "Critical power risk detected — prepare fallback pathways."
    });
  }

  // Outage likelihood
  if (riskVector.outageLikelihood >= 0.7) {
    beacons.push({
      type: "power-outage-likely",
      severity: "high",
      message: "Outage likelihood elevated — pre-buffer content."
    });
  }

  // Drift risk
  if (riskVector.driftRisk >= 0.6) {
    beacons.push({
      type: "power-drift",
      severity: "medium",
      message: "Power schema or file drift detected — review grid ingestion."
    });
  }

  // Continuance low
  if (continuance?.continuanceScore <= 0.25) {
    beacons.push({
      type: "power-continuance-low",
      severity: "medium",
      message: "Continuance window shrinking — reduce load."
    });
  }

  return Object.freeze(beacons);
}
