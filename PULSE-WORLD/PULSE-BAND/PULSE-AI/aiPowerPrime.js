
// ============================================================================
//  PULSE OS v12.3‑EVO+ — POWER‑PRIME ORGAN
//  Crown-Layer Power Intelligence • Artery-Fused • Predictive • Drift-Aware
//  READ-ONLY • DUALBAND • DETERMINISTIC • IDENTITY-SAFE
// ============================================================================

export const PowerMeta = Object.freeze({
  layer: "PulseAIPowerPrime",
  role: "POWER_PRIME_ORGAN",
  version: "12.3-EVO+",
  identity: "aiPowerPrime-v12.3-EVO+",

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
    arteryFusionAware: true,
    riskAware: true,
    beaconAware: true,
    identitySafe: true,
    readOnly: true,
    multiInstanceReady: true,
    epoch: "12.3-EVO+"
  }),

  contract: Object.freeze({
    purpose:
      "Provide SAFE, READ-ONLY, artery-fused power intelligence: risk, continuance, fluctuations, outages, and drift for tourist and owner scopes.",

    never: Object.freeze([
      "mutate external systems",
      "write to DB",
      "modify power settings",
      "expose UID or identity anchors",
      "introduce randomness",
      "override evolution logic",
      "override router or cortex decisions",
      "generate non-diagnostic symbolic state",
      "block the organism"
    ]),

    always: Object.freeze([
      "strip identity fields",
      "respect tourist vs owner scope",
      "compute metrics deterministically",
      "detect fluctuations and outages safely",
      "fuse organism arteries read-only",
      "log deterministic steps",
      "return frozen results",
      "remain drift-proof",
      "remain non-blocking"
    ])
  }),

  boundaryReflex() {
    return "PowerPrime is a read-only crown organ — it fuses arteries and predicts risk without mutating external systems.";
  }
});

// ---------------------------------------------------------------------------
//  DEPENDENCIES
// ---------------------------------------------------------------------------

import { getOrganismSnapshot } from "./aiDeps.js";
import {
  computePowerRiskVector,
  buildPowerRiskSummary,
  buildPowerBeaconSignals
} from "../PULSE-GRID/powerRiskEngine.js";
import {
  computeContinuanceMetricsV3,
  detectFluctuationsV3,
  detectOutagesV3
} from "../PULSE-GRID/powerContinuanceEngine.js";

// ---------------------------------------------------------------------------
//  FACTORY — Power‑Prime API
// ---------------------------------------------------------------------------

export function createPowerAPI(db, evolutionAPI, dualBand = null) {
  // ------------------------------------------------------------------------
  // IDENTITY‑SAFE CLONING
  // ------------------------------------------------------------------------
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
      context.logStep?.(`aiPowerPrime: owner-only "${collection}" blocked.`);
      return [];
    }
    context.logStep?.(`aiPowerPrime: fetching owner "${collection}"`);
    const rows = await db.getCollection(collection, options);
    return rows.map(stripIdentity);
  }

  async function fetchTourist(context, collection, options = {}) {
    context.logStep?.(`aiPowerPrime: fetching public "${collection}"`);
    const rows = await db.getCollection(collection, options);
    return rows.map(stripIdentity);
  }

  // ------------------------------------------------------------------------
  // ARTERY FUSION — READ‑ONLY ORGANISM SNAPSHOT
  // ------------------------------------------------------------------------
  function buildFusedArteries(organismSnapshot) {
    const o = organismSnapshot || {};

    const metabolic = o.binary?.metabolic || {};
    const nervous = o.binary?.nervous || {};
    const immune = o.binary?.immune || {};
    const hormones = o.binary?.hormones || {};
    const pipeline = o.binary?.pipeline || {};
    const scanner = o.binary?.scanner || {};
    const personalFrame = o.symbolic?.personalFrame || {};
    const personality = o.symbolic?.personality || {};
    const memory = o.symbolic?.memory || {};
    const evolution = o.symbolic?.evolution || {};

    return Object.freeze({
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
    });
  }

  // ------------------------------------------------------------------------
  // PUBLIC API — Power Insight + Continuance + Risk + Drift
  // ------------------------------------------------------------------------
  return Object.freeze({
    meta: PowerMeta,

    // ----------------------------------------------------------------------
    // TOURIST‑SAFE SNAPSHOT + CONTINUANCE + RISK SUMMARY
    // ----------------------------------------------------------------------
    async getPublicPowerSnapshot(context) {
      context.logStep?.("aiPowerPrime: building public power snapshot");

      const organismSnapshot = getOrganismSnapshot(dualBand);
      const fusedArteries = buildFusedArteries(organismSnapshot);

      const [power, history] = await Promise.all([
        fetchTourist(context, "power", { limit: 1 }),
        fetchTourist(context, "powerHistory", { limit: 50 })
      ]);

      const continuance = computeContinuanceMetricsV3({
        power,
        history,
        fusedArteries,
        organismSnapshot
      });

      const riskVector = computePowerRiskVector({
        power,
        history,
        fusedArteries,
        continuance
      });

      const riskSummary = buildPowerRiskSummary({
        riskVector,
        continuance
      });

      context.logStep?.(
        `aiPowerPrime: continuanceScore=${continuance.continuanceScore.toFixed(
          2
        )}, window=${continuance.continuanceWindowMinutes}min, risk=${riskSummary.level}`
      );

      return Object.freeze({
        power: power[0] || null,
        history,
        continuance,
        risk: riskSummary,
        organismSnapshot
      });
    },

    // ----------------------------------------------------------------------
    // OWNER‑ONLY — FULL GRID DIAGNOSTICS + CONTINUANCE + RISK
    // ----------------------------------------------------------------------
    async getOwnerPowerDiagnostics(context) {
      if (!context.userIsOwner) return null;

      context.logStep?.("aiPowerPrime: fetching owner diagnostics");

      const [power, history, settings, rawData] = await Promise.all([
        fetchOwner(context, "power"),
        fetchOwner(context, "powerHistory"),
        fetchOwner(context, "powerSettings"),
        fetchOwner(context, "powerData")
      ]);

      const organismSnapshot = getOrganismSnapshot(dualBand);
      const fusedArteries = buildFusedArteries(organismSnapshot);

      const continuance = computeContinuanceMetricsV3({
        power,
        history,
        fusedArteries,
        organismSnapshot
      });

      const riskVector = computePowerRiskVector({
        power,
        history,
        fusedArteries,
        continuance,
        settings
      });

      const riskSummary = buildPowerRiskSummary({
        riskVector,
        continuance,
        settings
      });

      const beacons = buildPowerBeaconSignals({
        riskVector,
        continuance,
        fusedArteries
      });

      return Object.freeze({
        power,
        history,
        settings,
        rawData,
        continuance,
        risk: riskSummary,
        beacons,
        organismSnapshot
      });
    },

    // ----------------------------------------------------------------------
    // OWNER‑ONLY — FLUCTUATION + OUTAGE ANALYSIS + CONTINUANCE + RISK
    // ----------------------------------------------------------------------
    async getPowerFluctuationAnalysis(context) {
      if (!context.userIsOwner) return null;

      context.logStep?.("aiPowerPrime: running fluctuation + outage analysis");

      const [history, settingsArr] = await Promise.all([
        fetchOwner(context, "powerHistory"),
        fetchOwner(context, "powerSettings")
      ]);

      const config = settingsArr[0] || {};

      const organismSnapshot = getOrganismSnapshot(dualBand);
      const fusedArteries = buildFusedArteries(organismSnapshot);

      const fluctuations = detectFluctuationsV3(history, config, context);
      const outages = detectOutagesV3(history, config, context);

      const continuance = computeContinuanceMetricsV3({
        power: [],
        history,
        fusedArteries,
        organismSnapshot
      });

      const riskVector = computePowerRiskVector({
        power: [],
        history,
        fusedArteries,
        continuance,
        settings: config
      });

      const riskSummary = buildPowerRiskSummary({
        riskVector,
        continuance,
        settings: config
      });

      const beacons = buildPowerBeaconSignals({
        riskVector,
        continuance,
        fusedArteries
      });

      return Object.freeze({
        fluctuations,
        outages,
        settings: config,
        continuance,
        risk: riskSummary,
        beacons,
        organismSnapshot
      });
    },

    // ----------------------------------------------------------------------
    // OWNER‑ONLY — RISK‑ONLY VIEW (NO RAW DATA)
    // ----------------------------------------------------------------------
    async getPowerRiskOverview(context) {
      if (!context.userIsOwner) return null;

      context.logStep?.("aiPowerPrime: building risk overview");

      const [power, history, settingsArr] = await Promise.all([
        fetchOwner(context, "power", { limit: 1 }),
        fetchOwner(context, "powerHistory", { limit: 100 }),
        fetchOwner(context, "powerSettings", { limit: 1 })
      ]);

      const settings = settingsArr[0] || {};
      const organismSnapshot = getOrganismSnapshot(dualBand);
      const fusedArteries = buildFusedArteries(organismSnapshot);

      const continuance = computeContinuanceMetricsV3({
        power,
        history,
        fusedArteries,
        organismSnapshot
      });

      const riskVector = computePowerRiskVector({
        power,
        history,
        fusedArteries,
        continuance,
        settings
      });

      const riskSummary = buildPowerRiskSummary({
        riskVector,
        continuance,
        settings
      });

      const beacons = buildPowerBeaconSignals({
        riskVector,
        continuance,
        fusedArteries
      });

      return Object.freeze({
        risk: riskSummary,
        beacons,
        continuance,
        organismSnapshot
      });
    },

    // ----------------------------------------------------------------------
    // OWNER‑ONLY — EVOLUTIONARY DRIFT (via aiEvolution)
    // ----------------------------------------------------------------------
    async getPowerEvolutionOverview(context) {
      if (!context.userIsOwner || !evolutionAPI?.analyzeSchema) return null;
      context.logStep?.("aiPowerPrime: schema drift analysis");
      return evolutionAPI.analyzeSchema(context, "power");
    },

    async analyzePowerFiles(context) {
      if (!context.userIsOwner || !evolutionAPI?.analyzeFile) return null;
      context.logStep?.("aiPowerPrime: file drift analysis");
      return evolutionAPI.analyzeFile(context, "power.js");
    },

    async analyzePowerRoutes(context) {
      if (!context.userIsOwner || !evolutionAPI?.analyzeRoute) return null;
      context.logStep?.("aiPowerPrime: route drift analysis");
      return evolutionAPI.analyzeRoute(context, "power");
    },

    // ----------------------------------------------------------------------
    // WINDOW‑SAFE POWER ARTERY SNAPSHOT
    // ----------------------------------------------------------------------
    getPowerArterySnapshot() {
      const organismSnapshot = getOrganismSnapshot(dualBand);
      const fusedArteries = buildFusedArteries(organismSnapshot);

      const riskVector = computePowerRiskVector({
        power: [],
        history: [],
        fusedArteries,
        continuance: null
      });

      const riskSummary = buildPowerRiskSummary({
        riskVector,
        continuance: null
      });

      return Object.freeze({
        risk: riskSummary,
        fusedArteries
      });
    }
  });
}

// ============================================================================
//  DUAL‑MODE EXPORTS (ESM + CommonJS)
// ============================================================================
if (typeof module !== "undefined") {
  module.exports = {
    PowerMeta,
    createPowerAPI
  };
}