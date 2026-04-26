// ============================================================================
// FILE: tropic-pulse-functions/apps/PULSE-AI/aiPower.js
// LAYER: POWER ORGAN (Grid + Continuance + Drift Awareness)
// ============================================================================
//
// ROLE:
//   • Provide SAFE, READ‑ONLY access to power + connectivity risk.
//   • Tourist: high‑level snapshot (safe).
//   • Owner: deep diagnostics, fluctuation patterns, outage windows, continuance score.
//   • Integrates with aiEvolution for drift + schema mismatch.
//   • Never exposes UID, resendToken, or identity anchors.
//   • Never mutates anything outside its own return values.
//
// CONTRACT:
//   • READ‑ONLY.
//   • ZERO MUTATION (of external systems).
//   • ZERO RANDOMNESS.
//   • DETERMINISTIC ANALYSIS ONLY.
// ============================================================================
export const PowerMeta = Object.freeze({
  layer: "PulseAIPowerFrame",
  role: "POWER_ORGAN",
  version: "11.0-EVO",
  identity: "aiPower-v11-EVO",

  evo: Object.freeze({
    driftProof: true,
    deterministic: true,
    dualband: true,
    binaryAware: true,
    symbolicAware: true,
    continuanceAware: true,
    fluctuationAware: true,
    outageAware: true,
    evolutionAware: true,
    identitySafe: true,
    readOnly: true,
    multiInstanceReady: true,
    epoch: "v11-EVO"
  }),

  contract: Object.freeze({
    purpose:
      "Provide SAFE, READ-ONLY access to power grid data, fluctuation patterns, outage windows, and continuance metrics for tourist and owner scopes.",

    never: Object.freeze([
      "mutate external systems",
      "write to DB",
      "modify power settings",
      "expose UID or identity anchors",
      "introduce randomness",
      "override evolution logic",
      "override router or cortex decisions"
    ]),

    always: Object.freeze([
      "strip identity fields",
      "respect tourist vs owner scope",
      "compute continuance metrics deterministically",
      "detect fluctuations and outages safely",
      "integrate organism snapshot",
      "log deterministic steps",
      "return frozen results"
    ])
  })
});

import { getOrganismSnapshot } from "./aiDeps.js";

export function createPowerAPI(db, evolutionAPI, dualBand = null) {
  // --------------------------------------------------------------------------
  // HELPERS — Identity‑Safe Cloning
  // --------------------------------------------------------------------------
  function stripIdentity(record) {
    if (!record || typeof record !== "object") return record;
    const clone = { ...record };
    delete clone.uid;
    delete clone.userId;
    delete clone.resendToken;
    delete clone.identityRoot;
    delete clone.sessionRoot;
    delete clone.deviceFingerprint;
    return clone;
  }

  async function fetchOwner(context, collection, options = {}) {
    if (!context.userIsOwner) {
      context.logStep?.(`aiPower: owner‑only "${collection}" blocked.`);
      return [];
    }
    context.logStep?.(`aiPower: fetching owner "${collection}"`);
    const rows = await db.getCollection(collection, options);
    return rows.map(stripIdentity);
  }

  async function fetchTourist(context, collection, options = {}) {
    context.logStep?.(`aiPower: fetching public "${collection}"`);
    const rows = await db.getCollection(collection, options);
    return rows.map(stripIdentity);
  }

  // --------------------------------------------------------------------------
  // CONTINUANCE METRICS — “How hard should we push before they drop?”
  // --------------------------------------------------------------------------
  function computeContinuanceMetrics({ power, history, organismSnapshot }) {
    const latest = power?.[0] || null;
    const binaryPressure = organismSnapshot?.binary?.metabolic?.pressure ?? 0;
    const binaryLoad = organismSnapshot?.binary?.metabolic?.load ?? 0;

    // Basic stability score from history (0–1)
    let stability = 1;
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
      const jumpRatio = Math.min(1, jumps / history.length);
      stability = 1 - jumpRatio; // more jumps → less stability
    }

    // Continuance score: lower stability or higher binary pressure → higher urgency
    const rawContinuance = Math.min(
      1,
      Math.max(0, 0.5 * (1 - stability) + 0.5 * binaryPressure)
    );

    // Continuance window (minutes of content to prepare)
    // High continuance → prepare more content up front
    const minWindow = 3;
    const maxWindow = 20;
    const continuanceWindowMinutes =
      minWindow + Math.round(rawContinuance * (maxWindow - minWindow));

    return {
      stability,
      binaryPressure,
      binaryLoad,
      continuanceScore: rawContinuance,
      continuanceWindowMinutes
    };
  }

  // --------------------------------------------------------------------------
  // FLUCTUATION + OUTAGE DETECTION
  // --------------------------------------------------------------------------
  function detectFluctuations(history, config, context) {
    const minDeviation = config.minDeviationPercent || 15;
    const fluctuations = [];

    for (let i = 1; i < history.length; i++) {
      const prev = history[i - 1];
      const curr = history[i];

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
          `aiPower: fluctuation ${pct.toFixed(1)}% at ${curr.timestamp}`
        );
      }
    }

    return fluctuations;
  }

  function detectOutages(history, config, context) {
    const outageWindow = config.minOutageWindow || 3;
    const outages = [];

    for (let i = 0; i <= history.length - outageWindow; i++) {
      const window = history.slice(i, i + outageWindow);
      const allZero = window.length > 0 && window.every(h => h.value === 0);

      if (allZero) {
        outages.push({
          start: window[0].timestamp,
          end: window[window.length - 1].timestamp
        });

        context.logStep?.(
          `aiPower: outage window detected (${outageWindow} samples)`
        );
      }
    }

    return outages;
  }

  // --------------------------------------------------------------------------
  // PUBLIC API — Power Insight + Continuance
  // --------------------------------------------------------------------------
  return Object.freeze({
    // ----------------------------------------------------------------------
    // TOURIST‑SAFE SNAPSHOT + CONTINUANCE HINTS
    // ----------------------------------------------------------------------
    async getPublicPowerSnapshot(context) {
      context.logStep?.("aiPower: building public power snapshot");

      const organismSnapshot = getOrganismSnapshot(dualBand);

      const [power, history] = await Promise.all([
        fetchTourist(context, "power", { limit: 1 }),
        fetchTourist(context, "powerHistory", { limit: 50 })
      ]);

      const continuance = computeContinuanceMetrics({
        power,
        history,
        organismSnapshot
      });

      context.logStep?.(
        `aiPower: continuanceScore=${continuance.continuanceScore.toFixed(
          2
        )}, window=${continuance.continuanceWindowMinutes}min`
      );

      return Object.freeze({
        power: power[0] || null,
        history,
        continuance,
        organismSnapshot
      });
    },

    // ----------------------------------------------------------------------
    // OWNER‑ONLY — FULL GRID DIAGNOSTICS + CONTINUANCE
    // ----------------------------------------------------------------------
    async getOwnerPowerDiagnostics(context) {
      if (!context.userIsOwner) return null;

      context.logStep?.("aiPower: fetching owner diagnostics");

      const [power, history, settings, rawData] = await Promise.all([
        fetchOwner(context, "power"),
        fetchOwner(context, "powerHistory"),
        fetchOwner(context, "powerSettings"),
        fetchOwner(context, "powerData")
      ]);

      const organismSnapshot = getOrganismSnapshot(dualBand);
      const continuance = computeContinuanceMetrics({
        power,
        history,
        organismSnapshot
      });

      return Object.freeze({
        power,
        history,
        settings,
        rawData,
        continuance,
        organismSnapshot
      });
    },

    // ----------------------------------------------------------------------
    // OWNER‑ONLY — FLUCTUATION + OUTAGE ANALYSIS + CONTINUANCE
    // ----------------------------------------------------------------------
    async getPowerFluctuationAnalysis(context) {
      if (!context.userIsOwner) return null;

      context.logStep?.("aiPower: running fluctuation + outage analysis");

      const [history, settingsArr] = await Promise.all([
        fetchOwner(context, "powerHistory"),
        fetchOwner(context, "powerSettings")
      ]);

      const config = settingsArr[0] || {};
      const fluctuations = detectFluctuations(history, config, context);
      const outages = detectOutages(history, config, context);

      const organismSnapshot = getOrganismSnapshot(dualBand);
      const continuance = computeContinuanceMetrics({
        power: [],
        history,
        organismSnapshot
      });

      return Object.freeze({
        fluctuations,
        outages,
        settings: config,
        continuance,
        organismSnapshot
      });
    },

    // ----------------------------------------------------------------------
    // OWNER‑ONLY — EVOLUTIONARY DRIFT (via aiEvolution)
// ----------------------------------------------------------------------
    async getPowerEvolutionOverview(context) {
      if (!context.userIsOwner || !evolutionAPI?.analyzeSchema) return null;
      context.logStep?.("aiPower: schema drift analysis");
      return evolutionAPI.analyzeSchema(context, "power");
    },

    async analyzePowerFiles(context) {
      if (!context.userIsOwner || !evolutionAPI?.analyzeFile) return null;
      context.logStep?.("aiPower: file drift analysis");
      return evolutionAPI.analyzeFile(context, "power.js");
    },

    async analyzePowerRoutes(context) {
      if (!context.userIsOwner || !evolutionAPI?.analyzeRoute) return null;
      context.logStep?.("aiPower: route drift analysis");
      return evolutionAPI.analyzeRoute(context, "power");
    }
  });
}
