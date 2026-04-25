// ============================================================================
// FILE: tropic-pulse-functions/apps/PULSE-AI/aiEnvironment.js
// LAYER: ENVIRONMENT ORGAN (World State + Internal Flags + Drift Awareness)
// ============================================================================
//
// ROLE:
//   • Provide SAFE, READ‑ONLY access to environmental intelligence.
//   • Tourist: weather, waves, storms, sargassum, moon, wildlife, seasons.
//   • Owner: internal flags, settings, history, anomalies, drift.
//   • Integrates with aiEvolution for schema + file + route drift.
//   • Never exposes UID, resendToken, or identity anchors.
//   • Never mutates anything outside its own return values.
//
// CONTRACT:
//   • READ‑ONLY.
//   • ZERO MUTATION (of external systems).
//   • ZERO RANDOMNESS.
//   • DETERMINISTIC ANALYSIS ONLY.
// ============================================================================

export function createEnvironmentAPI(db, evolutionAPI) {

  // --------------------------------------------------------------------------
  // HELPERS
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

  async function fetchPublic(_context, collection, options = {}) {
    const rows = await db.getCollection(collection, options);
    return rows.map(stripIdentity);
  }

  async function fetchOwner(context, collection, options = {}) {
    if (!context.userIsOwner) {
      context.logStep?.(`aiEnvironment: owner‑only "${collection}" blocked.`);
      return [];
    }
    const rows = await db.getCollection(collection, options);
    return rows.map(stripIdentity);
  }

  // --------------------------------------------------------------------------
  // PUBLIC API — Environment Insight
  // --------------------------------------------------------------------------
  return Object.freeze({

    // ----------------------------------------------------------------------
    // TOURIST‑SAFE SNAPSHOT
    // ----------------------------------------------------------------------
    async getPublicEnvironment(context) {
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

      return Object.freeze({
        weather: weather[0] || null,
        heatIndex: heatIndex[0] || null,
        waves: waves[0] || null,
        storms: storms[0] || null,
        sargassum: sargassum[0] || null,
        moon: moon[0] || null,
        wildlife: wildlife[0] || null,
        seasons: seasons[0] || null,
        holidays: holidays[0] || null
      });
    },

    // ----------------------------------------------------------------------
    // OWNER‑ONLY — INTERNAL ENVIRONMENT
    // ----------------------------------------------------------------------
    async getInternalEnvironment(context) {
      if (!context.userIsOwner) {
        context.logStep?.("aiEnvironment: internal environment blocked for non‑owner.");
        return null;
      }

      const [internal, settings, history] = await Promise.all([
        fetchOwner(context, "environment", { where: { scope: "internal" } }),
        fetchOwner(context, "environmentSettings"),
        fetchOwner(context, "environmentHistory")
      ]);

      return Object.freeze({
        internal: internal[0] || null,
        settings,
        history
      });
    },

    // ----------------------------------------------------------------------
    // OWNER‑ONLY — ANOMALY DETECTION
    // ----------------------------------------------------------------------
    async getEnvironmentAnomalies(context) {
      if (!context.userIsOwner) return null;

      const [weatherHistory, heatHistory, waveHistory] = await Promise.all([
        fetchOwner(context, "weatherHistory"),
        fetchOwner(context, "heatIndexHistory"),
        fetchOwner(context, "waveHistory")
      ]);

      const anomalies = [];

      // Simple anomaly detection: sudden jumps
      function detectJumps(arr, label) {
        if (!Array.isArray(arr)) return;
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
          }
        }
      }

      detectJumps(weatherHistory, "weather");
      detectJumps(heatHistory, "heatIndex");
      detectJumps(waveHistory, "waves");

      return Object.freeze({ anomalies });
    },

    // ----------------------------------------------------------------------
    // OWNER‑ONLY — EVOLUTIONARY DRIFT (via aiEvolution)
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
