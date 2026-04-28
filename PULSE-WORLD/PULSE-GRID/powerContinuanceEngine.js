// ============================================================================
//  PULSE OS v12.3‑EVO+ — POWER‑PRIME CONTINUANCE ENGINE
//  Continuance v3 • Fluctuations v3 • Outages v3 • Deterministic
//  PURE COMPUTE. ZERO MUTATION. ZERO RANDOMNESS.
// ============================================================================

export const PowerContinuanceEngineMeta = Object.freeze({
  layer: "PulseAIPowerPrime",
  role: "POWER_CONTINUANCE_ENGINE",
  version: "12.3-EVO+",
  identity: "powerContinuanceEngine-v12.3-EVO+",

  evo: Object.freeze({
    deterministic: true,
    driftProof: true,
    continuanceAware: true,
    fluctuationAware: true,
    outageAware: true,
    metabolicAware: true,
    pipelineAware: true,
    nervousAware: true,
    readOnly: true,
    epoch: "12.3-EVO+"
  })
});

// ============================================================================
//  INTERNAL HELPERS
// ============================================================================

function norm(v) {
  if (typeof v !== "number" || isNaN(v)) return 0;
  return Math.max(0, Math.min(1, v));
}

function safeHistory(history) {
  return Array.isArray(history) ? history : [];
}

// ============================================================================
//  CONTINUANCE METRICS v3
//  “How hard can we push before they drop?”
// ============================================================================

export function computeContinuanceMetricsV3({
  power,
  history,
  fusedArteries,
  organismSnapshot
}) {
  const h = safeHistory(history);
  const latest = power?.[0] || null;

  const metabolicPressure = norm(
    fusedArteries?.metabolic?.pressure ?? organismSnapshot?.binary?.metabolic?.pressure ?? 0
  );
  const metabolicLoad = norm(
    fusedArteries?.metabolic?.load ?? organismSnapshot?.binary?.metabolic?.load ?? 0
  );
  const pipelinePressure = norm(
    fusedArteries?.pipeline?.pressure ?? organismSnapshot?.binary?.pipeline?.pressure ?? 0
  );
  const routingPressure = norm(
    fusedArteries?.nervous?.routingPressure ?? organismSnapshot?.binary?.nervous?.routingPressure ?? 0
  );

  // Basic stability score from history (0–1)
  let stability = 1;
  if (h.length > 3) {
    let jumps = 0;
    for (let i = 1; i < h.length; i++) {
      const prev = h[i - 1];
      const curr = h[i];
      if (!prev || !curr || prev.value === 0) continue;
      const diff = Math.abs(curr.value - prev.value);
      const pct = (diff / prev.value) * 100;
      if (pct >= 20) jumps++;
    }
    const jumpRatio = Math.min(1, jumps / h.length);
    stability = 1 - jumpRatio; // more jumps → less stability
  }

  // Load factor from metabolic + pipeline + routing
  const loadFactor = norm(
    0.4 * metabolicLoad + 0.3 * pipelinePressure + 0.3 * routingPressure
  );

  // Continuance score: lower stability or higher pressure → higher urgency
  const rawContinuance = norm(
    0.5 * (1 - stability) + 0.5 * metabolicPressure
  );

  // Continuance window (minutes of content to prepare)
  const minWindow = 3;
  const maxWindow = 20;
  const continuanceWindowMinutes =
    minWindow + Math.round(rawContinuance * (maxWindow - minWindow));

  return Object.freeze({
    stability,
    metabolicPressure,
    metabolicLoad,
    pipelinePressure,
    routingPressure,
    loadFactor,
    continuanceScore: rawContinuance,
    continuanceWindowMinutes,
    latestPower: latest
  });
}

// ============================================================================
//  FLUCTUATION DETECTION v3
// ============================================================================

export function detectFluctuationsV3(history, config = {}, context = {}) {
  const h = safeHistory(history);
  const minDeviation = config.minDeviationPercent || 15;
  const minSamples = config.minFluctuationSamples || 1;
  const fluctuations = [];

  for (let i = 1; i < h.length; i++) {
    const prev = h[i - 1];
    const curr = h[i];

    if (!prev || !curr || prev.value === 0) continue;

    const diff = Math.abs(curr.value - prev.value);
    const pct = (diff / prev.value) * 100;

    if (pct >= minDeviation) {
      fluctuations.push({
        timestamp: curr.timestamp,
        deviation: pct,
        from: prev.value,
        to: curr.value
      });

      context.logStep?.(
        `aiPowerPrime: fluctuation ${pct.toFixed(1)}% at ${curr.timestamp}`
      );
    }
  }

  if (fluctuations.length < minSamples) {
    return Object.freeze([]);
  }

  return Object.freeze(fluctuations);
}

// ============================================================================
//  OUTAGE DETECTION v3
// ============================================================================

export function detectOutagesV3(history, config = {}, context = {}) {
  const h = safeHistory(history);
  const outageWindow = config.minOutageWindow || 3;
  const outages = [];

  for (let i = 0; i <= h.length - outageWindow; i++) {
    const window = h.slice(i, i + outageWindow);
    const allZero = window.length > 0 && window.every((entry) => entry.value === 0);

    if (allZero) {
      outages.push({
        start: window[0].timestamp,
        end: window[window.length - 1].timestamp
      });

      context.logStep?.(
        `aiPowerPrime: outage window detected (${outageWindow} samples)`
      );
    }
  }

  return Object.freeze(outages);
}
