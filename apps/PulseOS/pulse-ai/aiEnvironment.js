// ============================================================================
//  PULSE OS v11‑EVO — ENVIRONMENT ORGAN
//  World State • Internal Flags • Drift Awareness • Dual‑Band Logging
//  PURE READ‑ONLY. ZERO MUTATION. ZERO RANDOMNESS.
// ============================================================================
export const EnvironmentMeta = Object.freeze({
  layer: "PulseAIEnvironmentFrame",
  role: "ENVIRONMENT_ORGAN",
  version: "11.0-EVO",
  identity: "aiEnvironment-v11-EVO",

  evo: Object.freeze({
    driftProof: true,
    deterministic: true,
    dualband: true,
    binaryAware: true,
    symbolicAware: true,
    anomalyAware: true,
    environmentAware: true,
    evolutionAware: true,
    identitySafe: true,
    readOnly: true,
    multiInstanceReady: true,
    epoch: "v11-EVO"
  }),

  contract: Object.freeze({
    purpose:
      "Provide SAFE, READ-ONLY access to environment data, world state, anomaly detection, and dual-band organism logging.",

    never: Object.freeze([
      "mutate external systems",
      "write to DB",
      "modify environment settings",
      "expose UID or identity anchors",
      "introduce randomness",
      "override evolution logic",
      "override router or cortex decisions"
    ]),

    always: Object.freeze([
      "strip identity fields",
      "respect tourist vs owner scope",
      "detect anomalies deterministically",
      "integrate organism snapshot",
      "log dual-band state",
      "return frozen results"
    ])
  })
});

import { getOrganismSnapshot } from "./aiDeps.js";

export function createEnvironmentAPI(db, evolutionAPI, dualBand = null) {

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

  async function fetchPublic(context, collection, options = {}) {
    context.logStep?.(`env: fetching public "${collection}"`);
    const rows = await db.getCollection(collection, options);
    return rows.map(stripIdentity);
  }

  async function fetchOwner(context, collection, options = {}) {
    if (!context.userIsOwner) {
      context.logStep?.(`env: owner‑only "${collection}" blocked`);
      return [];
    }
    context.logStep?.(`env: fetching owner "${collection}"`);
    const rows = await db.getCollection(collection, options);
    return rows.map(stripIdentity);
  }

  // --------------------------------------------------------------------------
  // BINARY‑AWARE ANOMALY DETECTION (v11‑EVO)
  // --------------------------------------------------------------------------
  function detectJumps(arr, label, context) {
    const anomalies = [];
    if (!Array.isArray(arr)) return anomalies;

    for (let i = 1; i < arr.length; i++) {
      const prev = arr[i - 1];
      const curr = arr[i];
      if (!prev || !curr) continue;

      const base = prev.value === 0 ? 1 : prev.value;
      const diff = Math.abs(curr.value - prev.value);
      const pct = (diff / base) * 100;

      if (pct >= 25) {
        anomalies.push({
          type: `${label}_jump`,
          timestamp: curr.timestamp,
          deviation: pct,
          from: prev.value,
          to: curr.value
        });

        context.logStep?.(
          `env: anomaly detected in ${label}: ${pct.toFixed(1)}% jump`
        );
      }
    }

    return anomalies;
  }

  // --------------------------------------------------------------------------
  // PUBLIC API — Environment Insight (Dual‑Band + Logging)
// --------------------------------------------------------------------------
  return Object.freeze({

    // ----------------------------------------------------------------------
    // TOURIST‑SAFE SNAPSHOT (dual‑band logged)
    // ----------------------------------------------------------------------
    async getPublicEnvironment(context) {
      context.logStep?.("env: building public environment snapshot");

      const snapshot = getOrganismSnapshot(dualBand);
      context.logStep?.(
        `env: organism snapshot loaded (binaryPressure=${snapshot?.binary?.metabolic?.pressure ?? 0})`
      );

      const [
        weather,
        heatIndex,
        waves,
        storms,
        sargassum,
        moon,
        wildlife,
        seasons,
        holidays
      ] = await Promise.all([
        fetchPublic(context, "weather", { limit: 1 }),
        fetchPublic(context, "heatIndex", { limit: 1 }),
        fetchPublic(context, "waves", { limit: 1 }),
        fetchPublic(context, "storms", { limit: 1 }),
        fetchPublic(context, "sargassum", { limit: 1 }),
        fetchPublic(context, "moon", { limit: 1 }),
        fetchPublic(context, "wildlife", { limit: 1 }),
        fetchPublic(context, "seasons", { limit: 1 }),
        fetchPublic(context, "holidays", { limit: 1 })
      ]);

      context.logStep?.("env: public environment snapshot complete");

      return Object.freeze({
        weather: weather[0] || null,
        heatIndex: heatIndex[0] || null,
        waves: waves[0] || null,
        storms: storms[0] || null,
        sargassum: sargassum[0] || null,
        moon: moon[0] || null,
        wildlife: wildlife[0] || null,
        seasons: seasons[0] || null,
        holidays: holidays[0] || null,
        organismSnapshot: snapshot
      });
    },

    // ----------------------------------------------------------------------
    // OWNER‑ONLY — INTERNAL ENVIRONMENT (dual‑band logged)
    // ----------------------------------------------------------------------
    async getInternalEnvironment(context) {
      if (!context.userIsOwner) {
        context.logStep?.("env: internal environment blocked for non‑owner");
        return null;
      }

      context.logStep?.("env: fetching internal environment");

      const [internal, settings, history] = await Promise.all([
        fetchOwner(context, "environment", { where: { scope: "internal" } }),
        fetchOwner(context, "environmentSettings"),
        fetchOwner(context, "environmentHistory")
      ]);

      const snapshot = getOrganismSnapshot(dualBand);

      context.logStep?.("env: internal environment snapshot complete");

      return Object.freeze({
        internal: internal[0] || null,
        settings,
        history,
        organismSnapshot: snapshot
      });
    },

    // ----------------------------------------------------------------------
    // OWNER‑ONLY — ANOMALY DETECTION (dual‑band aware)
    // ----------------------------------------------------------------------
    async getEnvironmentAnomalies(context) {
      if (!context.userIsOwner) return null;

      context.logStep?.("env: anomaly detection started");

      const [weatherHistory, heatHistory, waveHistory] = await Promise.all([
        fetchOwner(context, "weatherHistory"),
        fetchOwner(context, "heatIndexHistory"),
        fetchOwner(context, "waveHistory")
      ]);

      const anomalies = [
        ...detectJumps(weatherHistory, "weather", context),
        ...detectJumps(heatHistory, "heatIndex", context),
        ...detectJumps(waveHistory, "waves", context)
      ];

      context.logStep?.(`env: anomaly detection complete (${anomalies.length} anomalies)`);

      return Object.freeze({ anomalies });
    },

    // ----------------------------------------------------------------------
    // OWNER‑ONLY — EVOLUTIONARY DRIFT (via aiEvolution)
    // ----------------------------------------------------------------------
    async getEnvironmentEvolutionOverview(context) {
      if (!context.userIsOwner || !evolutionAPI?.analyzeSchema) return null;
      context.logStep?.("env: running environment evolution overview");
      return evolutionAPI.analyzeSchema(context, "environment");
    },

    async analyzeEnvironmentFiles(context) {
      if (!context.userIsOwner || !evolutionAPI?.analyzeFile) return null;
      context.logStep?.("env: analyzing environment files");
      return evolutionAPI.analyzeFile(context, "environment.js");
    },

    async analyzeEnvironmentRoutes(context) {
      if (!context.userIsOwner || !evolutionAPI?.analyzeRoute) return null;
      context.logStep?.("env: analyzing environment routes");
      return evolutionAPI.analyzeRoute(context, "environment");
    }
  });
}
