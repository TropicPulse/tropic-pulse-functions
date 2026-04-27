// ============================================================================
// FILE: tropic-pulse-functions/apps/PULSE-AI/aiEarn.js
// LAYER: EARN ORGAN (Economics + Rewards + Flow Awareness)
// ============================================================================
//
// ROLE:
//   • Provide AI with a SAFE, READ‑ONLY view into PulseEarn economic data.
//   • User: orders, referrals, referralClicks, vaultHistory, pulseHistory.
//   • Owner: system‑level earning patterns, anomalies, lineage, evolution logs.
//   • Integrates with aiEvolution + dual‑band organism.
//   • Never exposes UID, resendToken, or identity anchors.
//   • Never mutates anything.
//
// CONTRACT:
//   • READ‑ONLY.
//   • ZERO MUTATION.
//   • ZERO RANDOMNESS.
//   • DETERMINISTIC ANALYSIS ONLY.
// ============================================================================

export const EarnMeta = Object.freeze({
  layer: "PulseAIEarnFrame",
  role: "EARN_ORGAN",
  version: "11.0-EVO",
  identity: "aiEarn-v11-EVO",

  evo: Object.freeze({
    driftProof: true,
    deterministic: true,
    readOnly: true,
    binaryAware: true,
    symbolicAware: true,
    dualband: true,
    lineageAware: true,
    evolutionAware: true,
    packetAware: true,          // NEW
    multiInstanceReady: true,
    epoch: "v11-EVO"
  }),

  contract: Object.freeze({
    purpose: "Provide SAFE, READ-ONLY economic insight for users and owners.",

    never: Object.freeze([
      "mutate data",
      "expose identity anchors",
      "expose UID or tokens",
      "modify economic state",
      "perform writes",
      "introduce randomness"
    ]),

    always: Object.freeze([
      "strip identity fields",
      "respect user vs owner scope",
      "use deterministic analysis",
      "integrate organism snapshot",
      "integrate evolution metadata",
      "emit deterministic earn packets"   // NEW
    ])
  })
});

import { getOrganismSnapshot } from "./aiDeps.js";

// ============================================================================
//  EARN ORGAN IMPLEMENTATION — v11‑EVO COMPLETE
// ============================================================================

export function createEarnAPI(db, evolutionAPI, dualBand = null) {

  // --------------------------------------------------------------------------
  // IDENTITY‑SAFE CLONING
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

  async function fetchUserScoped(context, collection, options = {}) {
    const { userId } = context;

    if (!userId) {
      context.logStep?.(`aiEarn: user‑scoped "${collection}" requested without userId.`);
      return [];
    }

    const rows = await db.getCollection(collection, {
      ...options,
      where: { userId }
    });

    return rows.map(stripIdentity);
  }

  async function fetchOwnerScoped(context, collection, options = {}) {
    if (!context.userIsOwner) {
      context.logStep?.(`aiEarn: owner‑only "${collection}" blocked for non‑owner.`);
      return [];
    }

    const rows = await db.getCollection(collection, options);
    return rows.map(stripIdentity);
  }

  // --------------------------------------------------------------------------
  // DUAL‑BAND ECONOMIC PRESSURE (Binary Metabolic → Economic Insight)
  // --------------------------------------------------------------------------
  function computeBinaryEconomicPressure(snapshot) {
    if (!snapshot?.binary?.metabolic) {
      return Object.freeze({ pressure: 0, load: 0, bucket: "none" });
    }

    const pressure = snapshot.binary.metabolic.pressure ?? 0;
    const load = snapshot.binary.metabolic.load ?? 0;

    let bucket = "none";
    if (pressure >= 0.9) bucket = "critical";
    else if (pressure >= 0.7) bucket = "high";
    else if (pressure >= 0.4) bucket = "medium";
    else if (pressure > 0) bucket = "low";

    return Object.freeze({ pressure, load, bucket });
  }

  // --------------------------------------------------------------------------
  // EARN PACKET (NEW — v11‑EVO)
  // --------------------------------------------------------------------------
  function emitEarnPacket(type, payload) {
    const packet = Object.freeze({
      type: `earn-${type}`,
      timestamp: Date.now(),
      ...payload
    });

    return packet;
  }

  // --------------------------------------------------------------------------
  // PUBLIC API — Earn Insight (Dual‑Band + Evolution‑Aware)
  // --------------------------------------------------------------------------
  const api = {

    // ----------------------------------------------------------------------
    // USER — “How am I earning?”
    // ----------------------------------------------------------------------
    async getUserEarnOverview(context) {
      const [
        orders,
        referrals,
        referralClicks,
        vaultHistory,
        pulseHistory
      ] = await Promise.all([
        fetchUserScoped(context, "orders"),
        fetchUserScoped(context, "referrals"),
        fetchUserScoped(context, "referralClicks"),
        fetchUserScoped(context, "vaultHistory"),
        fetchUserScoped(context, "pulseHistory")
      ]);

      const snapshot = getOrganismSnapshot(dualBand);
      const binaryEconomics = computeBinaryEconomicPressure(snapshot);

      return emitEarnPacket("user-overview", Object.freeze({
        orders,
        referrals,
        referralClicks,
        vaultHistory,
        pulseHistory,
        binaryEconomics,
        organismSnapshot: snapshot
      }));
    },

    async getUserReferrals(context) {
      const [referrals, referralClicks] = await Promise.all([
        fetchUserScoped(context, "referrals"),
        fetchUserScoped(context, "referralClicks")
      ]);

      const snapshot = getOrganismSnapshot(dualBand);

      return emitEarnPacket("user-referrals", Object.freeze({
        referrals,
        referralClicks,
        organismSnapshot: snapshot
      }));
    },

    async getUserOrders(context) {
      const orders = await fetchUserScoped(context, "orders");
      const snapshot = getOrganismSnapshot(dualBand);

      return emitEarnPacket("user-orders", Object.freeze({
        orders,
        organismSnapshot: snapshot
      }));
    },

    async getUserVaultHistory(context) {
      const vaultHistory = await fetchUserScoped(context, "vaultHistory");
      const snapshot = getOrganismSnapshot(dualBand);

      return emitEarnPacket("user-vault", Object.freeze({
        vaultHistory,
        organismSnapshot: snapshot
      }));
    },

    async getUserPulseHistory(context) {
      const pulseHistory = await fetchUserScoped(context, "pulseHistory");
      const snapshot = getOrganismSnapshot(dualBand);

      return emitEarnPacket("user-pulse", Object.freeze({
        pulseHistory,
        organismSnapshot: snapshot
      }));
    },

    // ----------------------------------------------------------------------
    // OWNER — System‑Level Earn Insight
    // ----------------------------------------------------------------------
    async getSystemEarnOverview(context) {
      const [
        orders,
        referrals,
        referralClicks,
        pulseHistory
      ] = await Promise.all([
        fetchOwnerScoped(context, "orders"),
        fetchOwnerScoped(context, "referrals"),
        fetchOwnerScoped(context, "referralClicks"),
        fetchOwnerScoped(context, "pulseHistory")
      ]);

      const snapshot = getOrganismSnapshot(dualBand);
      const binaryEconomics = computeBinaryEconomicPressure(snapshot);

      return emitEarnPacket("system-overview", Object.freeze({
        orders,
        referrals,
        referralClicks,
        pulseHistory,
        binaryEconomics,
        organismSnapshot: snapshot
      }));
    },

    async getSystemEarnAnomalies(context) {
      const [
        orders,
        referrals,
        referralClicks,
        pulseHistory
      ] = await Promise.all([
        fetchOwnerScoped(context, "orders"),
        fetchOwnerScoped(context, "referrals"),
        fetchOwnerScoped(context, "referralClicks"),
        fetchOwnerScoped(context, "pulseHistory")
      ]);

      const snapshot = getOrganismSnapshot(dualBand);

      return emitEarnPacket("system-anomalies", Object.freeze({
        ordersSample: orders.slice(0, 100),
        referralsSample: referrals.slice(0, 100),
        referralClicksSample: referralClicks.slice(0, 100),
        pulseHistorySample: pulseHistory.slice(0, 100),
        organismSnapshot: snapshot
      }));
    },

    // ----------------------------------------------------------------------
    // OWNER — Evolutionary + Lineage + Schema Analysis
    // ----------------------------------------------------------------------
    async getEarnEvolutionOverview(context) {
      if (!context.userIsOwner || !evolutionAPI?.getOrganismOverview) return null;
      return evolutionAPI.getOrganismOverview(context);
    },

    async analyzeEarnSchema(context) {
      if (!context.userIsOwner || !evolutionAPI?.analyzeSchema) return null;
      return evolutionAPI.analyzeSchema(context, "pulseEarn");
    },

    async analyzeEarnFiles(context) {
      if (!context.userIsOwner || !evolutionAPI?.analyzeFile) return null;
      return evolutionAPI.analyzeFile(context, "PulseEarn-v11-Evo.js");
    },

    async analyzeEarnRoutes(context) {
      if (!context.userIsOwner || !evolutionAPI?.analyzeRoute) return null;
      return evolutionAPI.analyzeRoute(context, "earn");
    }
  };

  return Object.freeze(api);
}

// ============================================================================
//  DUAL‑MODE EXPORTS (ESM + CommonJS)
// ============================================================================

// ESM
export {
  EarnMeta,
  createEarnAPI
};

// Default (ESM)
export default createEarnAPI;

// CommonJS
if (typeof module !== "undefined") {
  module.exports = {
    EarnMeta,
    createEarnAPI,
    default: createEarnAPI
  };
}
