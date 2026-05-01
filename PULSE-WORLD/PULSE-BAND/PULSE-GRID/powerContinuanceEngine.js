// ============================================================================
//  PULSE OS v12.3‑PRESENCE‑EVO+ — POWER‑PRIME CONTINUANCE ENGINE
//  Continuance v3 • Fluctuations v3 • Outages v3 • Presence • Advantage
//  PURE COMPUTE. ZERO MUTATION. ZERO RANDOMNESS. ZERO I/O.
// ============================================================================

export const PowerContinuanceEngineMeta = Object.freeze({
  layer: "PulseAIPowerPrime",
  role: "POWER_CONTINUANCE_ENGINE",
  version: "12.3-PRESENCE-EVO+",
  identity: "powerContinuanceEngine-v12.3-PRESENCE-EVO+",

  evo: Object.freeze({
    deterministic: true,
    driftProof: true,
    continuanceAware: true,
    fluctuationAware: true,
    outageAware: true,
    metabolicAware: true,
    pipelineAware: true,
    nervousAware: true,
    presenceAware: true,
    bandPresenceAware: true,
    routerPresenceAware: true,
    advantageAware: true,
    fallbackBandAware: true,
    chunkAware: true,
    cacheAware: true,
    prewarmAware: true,
    coldStartAware: true,
    readOnly: true,
    epoch: "12.3-PRESENCE-EVO+"
  }),

  guarantees: Object.freeze({
    pureCompute: true,
    zeroMutation: true,
    zeroRandomness: true,
    zeroTimers: true,
    zeroDateNow: true,
    zeroIO: true,
    zeroNetwork: true,
    zeroSideEffects: true
  }),

  contract: Object.freeze({
    input: [
      "PowerHistorySnapshot",
      "FusedArteriesSnapshot",
      "OrganismSnapshot",
      "PresenceContext",
      "AdvantageContext"
    ],
    output: [
      "ContinuanceMetricsV3",
      "FluctuationWindowsV3",
      "OutageWindowsV3",
      "ContinuancePresencePlanV3"
    ]
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

function safeNum(v, d = 0) {
  return typeof v === "number" && !isNaN(v) ? v : d;
}

function safeObj(v, d = {}) {
  return v && typeof v === "object" ? v : d;
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
    fusedArteries?.metabolic?.pressure ??
      organismSnapshot?.binary?.metabolic?.pressure ??
      0
  );
  const metabolicLoad = norm(
    fusedArteries?.metabolic?.load ??
      organismSnapshot?.binary?.metabolic?.load ??
      0
  );
  const pipelinePressure = norm(
    fusedArteries?.pipeline?.pressure ??
      organismSnapshot?.binary?.pipeline?.pressure ??
      0
  );
  const routingPressure = norm(
    fusedArteries?.nervous?.routingPressure ??
      organismSnapshot?.binary?.nervous?.routingPressure ??
      0
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
    const allZero =
      window.length > 0 && window.every((entry) => entry.value === 0);

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

// ============================================================================
/*  CONTINUANCE PRESENCE PLAN v3
    “Backbone of identity + PulseBand fallback / chunk / cache / prewarm hints”
    Pure compute: takes metrics + fluctuations + outages + presence/advantage
    and returns a deterministic plan for:
      • fallbackBandLevel (0–3)
      • pulseBandAggression (0–1)
      • prewarmHints (routes/chunks to prewarm)
      • cacheHints (what to keep hot)
      • presenceField (band + router presence snapshot)
*/
// ============================================================================

export function computeContinuancePresencePlanV3({
  powerHistory,
  fusedArteries,
  organismSnapshot,
  presenceContext = {},
  advantageContext = {},
  config = {}
}) {
  const metrics = computeContinuanceMetricsV3({
    power: powerHistory,
    history: powerHistory,
    fusedArteries,
    organismSnapshot
  });

  const fluctuations = detectFluctuationsV3(
    powerHistory,
    safeObj(config.fluctuationsConfig),
    {}
  );
  const outages = detectOutagesV3(
    powerHistory,
    safeObj(config.outagesConfig),
    {}
  );

  const fluctuationSeverity = norm(fluctuations.length / (powerHistory?.length || 1));
  const outageSeverity = norm(outages.length / (powerHistory?.length || 1));

  // Fallback band level: 0 = full, 3 = deepest fallback
  let fallbackBandLevel = 0;
  const c = metrics.continuanceScore;
  const l = metrics.loadFactor;

  if (c >= 0.8 || outageSeverity > 0.3) {
    fallbackBandLevel = 3;
  } else if (c >= 0.6 || outageSeverity > 0.15 || fluctuationSeverity > 0.3) {
    fallbackBandLevel = 2;
  } else if (c >= 0.4 || fluctuationSeverity > 0.15) {
    fallbackBandLevel = 1;
  }

  // PulseBand aggression: how “hard” we’re allowed to push (0–1)
  const pulseBandAggression = norm(1 - c);

  // Presence field (band + router)
  const bandPresence = {
    band: presenceContext.band || "pulseband",
    deviceId: presenceContext.deviceId || null,
    hydraNodeId: presenceContext.hydraNodeId || null
  };

  const routerPresence = {
    routerHealthy: safeBool(organismSnapshot?.binary?.router?.healthy, true),
    proxyHealthy: safeBool(organismSnapshot?.binary?.proxy?.healthy, true)
  };

  // Chunk / cache / prewarm hints
  const advantageScore = safeNum(advantageContext.advantageScore, 1.0);
  const route = presenceContext.route || "/";

  const prewarmHints = {
    shouldPrewarm: c >= 0.4 || outageSeverity > 0,
    targetRoutes: [route],
    targetBands: ["pulseband"],
    reason:
      c >= 0.4
        ? "high_continuance_urgency"
        : outageSeverity > 0
        ? "recent_outages"
        : "steady_state"
  };

  const cacheHints = {
    keepHot: c >= 0.4 || l >= 0.5,
    priority: c >= 0.7 ? "critical" : c >= 0.4 ? "high" : "normal",
    advantageScore
  };

  const chunkHints = {
    chunkAggression: pulseBandAggression,
    preferBinaryChunks: true,
    preferPresenceChunks: c >= 0.4
  };

  return Object.freeze({
    meta: {
      ...PowerContinuanceEngineMeta,
      mode: "presence-plan-v3"
    },
    metrics,
    fluctuations,
    outages,
    fallbackBandLevel,
    pulseBandAggression,
    presenceField: {
      bandPresence,
      routerPresence
    },
    prewarmHints,
    cacheHints,
    chunkHints
  });
}

// small helper used above
function safeBool(v, d = false) {
  return typeof v === "boolean" ? v : d;
}
