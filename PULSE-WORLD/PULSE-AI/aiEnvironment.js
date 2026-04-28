// ============================================================================
//  PULSE OS v11‑EVO — ENVIRONMENT ORGAN (CACHED + CHUNKED + PREWARMED)
//  World State • Internal Flags • Drift Awareness • Dual‑Band Logging
//  PURE READ‑ONLY. ZERO MUTATION. ZERO RANDOMNESS.
// ============================================================================

export const EnvironmentMeta = Object.freeze({
  layer: "PulseAIEnvironmentFrame",
  role: "ENVIRONMENT_ORGAN",
  version: "11.2-EVO",
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
    packetAware: true,
    identitySafe: true,
    readOnly: true,
    multiInstanceReady: true,
    epoch: "v11-EVO"
  }),

  contract: Object.freeze({
    purpose: "Provide SAFE, READ-ONLY environment data with caching + dual-band logging.",

    never: Object.freeze([
      "mutate external systems",
      "write to DB",
      "expose UID or identity anchors",
      "introduce randomness"
    ]),

    always: Object.freeze([
      "strip identity fields",
      "respect tourist vs owner scope",
      "detect anomalies deterministically",
      "cache environment data",
      "integrate organism snapshot",
      "return frozen results"
    ])
  })
});

import { getOrganismSnapshot } from "./aiDeps.js";

// ============================================================================
//  CACHES — Hourly + Daily
// ============================================================================
const hourlyCache = {
  data: null,
  timestamp: 0
};

const dailyCache = {
  data: null,
  timestamp: 0
};

const ONE_HOUR = 60 * 60 * 1000;
const ONE_DAY = 24 * ONE_HOUR;

// ============================================================================
//  ENVIRONMENT ORGAN
// ============================================================================
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

  async function fetch(collection, options = {}) {
    const rows = await db.getCollection(collection, options);
    return rows.map(stripIdentity);
  }

  // --------------------------------------------------------------------------
  // HOURLY CACHE BUILDER
  // --------------------------------------------------------------------------
  async function buildHourly(context) {
    const now = Date.now();
    if (hourlyCache.data && now - hourlyCache.timestamp < ONE_HOUR) {
      context.logStep?.("env: hourly cache hit");
      return hourlyCache.data;
    }

    context.logStep?.("env: hourly cache miss → fetching");

    const [
      weather,
      heatIndex,
      waves,
      storms
    ] = await Promise.all([
      fetch("weather", { limit: 1 }),
      fetch("heatIndex", { limit: 1 }),
      fetch("waves", { limit: 1 }),
      fetch("storms", { limit: 1 })
    ]);

    hourlyCache.data = Object.freeze({
      weather: weather[0] || null,
      heatIndex: heatIndex[0] || null,
      waves: waves[0] || null,
      storms: storms[0] || null
    });

    hourlyCache.timestamp = now;
    return hourlyCache.data;
  }

  // --------------------------------------------------------------------------
  // DAILY CACHE BUILDER
  // --------------------------------------------------------------------------
  async function buildDaily(context) {
    const now = Date.now();
    if (dailyCache.data && now - dailyCache.timestamp < ONE_DAY) {
      context.logStep?.("env: daily cache hit");
      return dailyCache.data;
    }

    context.logStep?.("env: daily cache miss → fetching");

    const [
      sargassum,
      moon,
      wildlife,
      seasons,
      holidays
    ] = await Promise.all([
      fetch("sargassum", { limit: 1 }),
      fetch("moon", { limit: 1 }),
      fetch("wildlife", { limit: 1 }),
      fetch("seasons", { limit: 1 }),
      fetch("holidays", { limit: 1 })
    ]);

    dailyCache.data = Object.freeze({
      sargassum: sargassum[0] || null,
      moon: moon[0] || null,
      wildlife: wildlife[0] || null,
      seasons: seasons[0] || null,
      holidays: holidays[0] || null
    });

    dailyCache.timestamp = now;
    return dailyCache.data;
  }

  // --------------------------------------------------------------------------
  // ANOMALY DETECTION (cached)
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

        context.logStep?.(`env: anomaly in ${label}: ${pct.toFixed(1)}%`);
      }
    }

    return anomalies;
  }

  // --------------------------------------------------------------------------
  // PUBLIC API — Cached + Dual‑Band Logged
  // --------------------------------------------------------------------------
  return Object.freeze({

    // ----------------------------------------------------------------------
    // TOURIST‑SAFE SNAPSHOT
    // ----------------------------------------------------------------------
    async getPublicEnvironment(context) {
      context.logStep?.("env: building public environment snapshot");

      const snapshot = getOrganismSnapshot(dualBand);

      const hourly = await buildHourly(context);
      const daily = await buildDaily(context);

      return Object.freeze({
        ...hourly,
        ...daily,
        organismSnapshot: snapshot
      });
    },

    // ----------------------------------------------------------------------
    // OWNER‑ONLY INTERNAL ENVIRONMENT
    // ----------------------------------------------------------------------
    async getInternalEnvironment(context) {
      if (!context.userIsOwner) return null;

      const [internal, settings, history] = await Promise.all([
        fetch("environment", { where: { scope: "internal" } }),
        fetch("environmentSettings"),
        fetch("environmentHistory")
      ]);

      const snapshot = getOrganismSnapshot(dualBand);

      return Object.freeze({
        internal: internal[0] || null,
        settings,
        history,
        organismSnapshot: snapshot
      });
    },

    // ----------------------------------------------------------------------
    // OWNER‑ONLY ANOMALIES
    // ----------------------------------------------------------------------
    async getEnvironmentAnomalies(context) {
      if (!context.userIsOwner) return null;

      const [weatherHistory, heatHistory, waveHistory] = await Promise.all([
        fetch("weatherHistory"),
        fetch("heatIndexHistory"),
        fetch("waveHistory")
      ]);

      return Object.freeze({
        anomalies: [
          ...detectJumps(weatherHistory, "weather", context),
          ...detectJumps(heatHistory, "heatIndex", context),
          ...detectJumps(waveHistory, "waves", context)
        ]
      });
    },

    // ----------------------------------------------------------------------
    // OWNER‑ONLY EVOLUTION
    // ----------------------------------------------------------------------
    async getEnvironmentEvolutionOverview(context) {
      if (!context.userIsOwner || !evolutionAPI?.analyzeSchema) return null;
      return evolutionAPI.analyzeSchema(context, "environment");
    },

    async analyzeEnvironmentFiles(context) {
      if (!context.userIsOwner || !evolutionAPI?.analyzeFile) return null;
      return evolutionAPI.analyzeFile(context, "environment.js");
    },

    async analyzeEnvironmentRoutes(context) {
      if (!context.userIsOwner || !evolutionAPI?.analyzeRoute) return null;
      return evolutionAPI.analyzeRoute(context, "environment");
    }
  });
}
