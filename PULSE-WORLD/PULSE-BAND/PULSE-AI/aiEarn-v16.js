// ============================================================================
// FILE: tropic-pulse-functions/PULSE-WORLD/PULSE-AI/aiEarn-v16-Immortal++.js
// LAYER: EARN ORGAN (Economics + Rewards + Flow Awareness + Trust Fabric)
// ============================================================================
//
// ROLE (v16-Immortal-Organism-TRUST-ADV):
//   • Provide AI with a SAFE, READ‑ONLY view into PulseEarn economic data.
//   • User: orders, referrals, referralClicks, vaultHistory, pulseHistory.
//   • Owner: system‑level earning patterns, anomalies, lineage, evolution logs.
//   • Integrates with dual‑band organism, artery, presence/advantage‑M,
//     trust fabric, jury, evidence, and Pulse‑Net.
//   • Never exposes UID, resendToken, or identity anchors.
//   • Never mutates anything returned from DB/evolution APIs.
//   • Never touches internet directly — all external IO is via Pulse‑Net only.
//   • Emits deterministic, lane‑tagged packets for chunkers and higher AI.
//
// CONTRACT (v16-Immortal-Organism-TRUST-ADV):
//   • READ‑ONLY.
//   • ZERO MUTATION (of external data).
//   • ZERO RANDOMNESS.
//   • ZERO TIMESTAMPS.
//   • ZERO DIRECT NETWORK / INTERNET ACCESS.
//   • DETERMINISTIC ANALYSIS ONLY.
// ============================================================================

/*
AI_EXPERIENCE_META = {
  identity: "aiEarn",
  version: "v16-Immortal-Organism-TRUST-ADV",
  layer: "ai_tools",
  role: "earn_surface",
  lineage: "aiEarn-v10 → v12 → v13 → v14-Immortal → v16-Immortal-Organism-TRUST-ADV",

  evo: {
    earnSurface: true,
    jobAwareness: true,
    symbolicPrimary: true,
    binaryAware: true,
    dualBand: true,
    arteryAware: true,
    presenceAware: true,
    advantageAware: true,
    trustFabricAware: true,
    juryAware: true,
    evidenceAware: true,
    pulseNetAware: true,
    chunkerAware: true,
    anomalyAware: true,
    laneAware: true,
    bucketAware: true,

    deterministic: true,
    driftProof: true,
    pureCompute: true,
    zeroNetwork: true,
    zeroFilesystem: true,
    zeroMutationOfInput: true
  },

  contract: {
    always: [
      "aiEngine",
      "aiContext",
      "aiCortex",
      "DualBandKernel",
      "PulseNetProxySpine",
      "PulseTrustEvidence",
      "PulseTrustJuryFrame"
    ],
    never: [
      "safeRoute",
      "fetchViaCNS",
      "directInternetAccess",
      "externalHTTP",
      "externalDNS",
      "externalWebsocket"
    ]
  }
}
*/

export const EarnMeta = Object.freeze({
  layer: "PulseAIEarnFrame",
  role: "EARN_ORGAN",
  version: "v16-Immortal-Organism-TRUST-ADV",
  identity: "aiEarn-v16-Immortal-Organism-TRUST-ADV",

  evo: Object.freeze({
    driftProof: true,
    deterministic: true,
    readOnly: true,
    binaryAware: true,
    symbolicAware: true,
    dualband: true,
    arteryAware: true,
    presenceAware: true,
    advantageAware: true,
    chunkPrewarmAware: true,
    lineageAware: true,
    evolutionAware: true,
    packetAware: true,
    trustFabricAware: true,
    juryAware: true,
    evidenceAware: true,
    pulseNetAware: true,
    anomalyAware: true,
    laneAware: true,
    bucketAware: true,
    multiInstanceReady: true,
    epoch: "v16-Immortal-Organism-TRUST-ADV"
  }),

  contract: Object.freeze({
    purpose: "Provide SAFE, READ-ONLY economic insight for users and owners.",

    never: Object.freeze([
      "mutate data",
      "expose identity anchors",
      "expose UID or tokens",
      "modify economic state",
      "perform writes",
      "introduce randomness",
      "introduce timestamps",
      "directInternetAccess",
      "externalHTTP",
      "externalDNS",
      "externalWebsocket"
    ]),

    always: Object.freeze([
      "strip identity fields",
      "respect user vs owner scope",
      "use deterministic analysis",
      "integrate organism snapshot",
      "integrate dualband artery when available",
      "integrate evolution metadata",
      "emit deterministic earn packets",
      "respect dual-band + presence/advantage surfaces",
      "respect trust fabric + jury + evidence constraints",
      "emit lane/bucket metadata for chunkers"
    ])
  })
});

import { getOrganismSnapshot } from "./aiDeps.js";

// ---------------------------------------------------------------------------
// INTERNAL: deterministic helpers
// ---------------------------------------------------------------------------
function computeHash(str) {
  let h = 0;
  const s = String(str || "");
  for (let i = 0; i < s.length; i++) {
    h = (h + s.charCodeAt(i) * (i + 1)) % 100000;
  }
  return `h${h}`;
}

function toNumber(v, fallback) {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? n : fallback;
}

function normalizeBand(b) {
  const x = String(b || "symbolic").toLowerCase();
  return x === "binary" ? "binary" : "symbolic";
}

function clamp01(v) {
  const n = Number(v);
  if (!Number.isFinite(n)) return 0;
  if (n < 0) return 0;
  if (n > 1) return 1;
  return n;
}

// ---------------------------------------------------------------------------
// PRESENCE / ADVANTAGE‑M / PRESSURE SURFACES (READ‑ONLY ECONOMIC VIEW)
// ---------------------------------------------------------------------------
function buildPresenceField(snapshot, dualBand) {
  const band =
    dualBand?.band ||
    snapshot?.band ||
    "symbolic";

  const presenceBand =
    dualBand?.presenceContext?.bandPresence ||
    snapshot?.presenceBand ||
    band;

  const devicePresence =
    dualBand?.presenceContext?.devicePresence ||
    "local";

  const routerPresence =
    dualBand?.presenceContext?.routerPresence ||
    "stable";

  const regionTag =
    dualBand?.regionContext?.regionTag ||
    "unknown-region";

  const presenceVersion = "v16-Immortal-Organism-TRUST-ADV";

  const field = Object.freeze({
    presenceVersion,
    band,
    presenceBand,
    devicePresence,
    routerPresence,
    regionTag
  });

  const raw = [
    presenceVersion,
    band,
    presenceBand,
    devicePresence,
    routerPresence,
    regionTag
  ].join("::");

  return {
    field,
    presenceSignature: computeHash(`AI_EARN_PRESENCE::${raw}`)
  };
}

function buildAdvantageField(snapshot, dualBand) {
  const advCtx = dualBand?.advantageContext || {};
  const snapAdv = snapshot?.advantageField || {};

  const ctxScore = toNumber(advCtx.score, 0);
  const ctxTier = advCtx.tier ?? null;
  const ctxBand = advCtx.band || null;

  const snapScore = toNumber(snapAdv.advantageScore, 0);
  const snapTier = snapAdv.presenceTier ?? null;
  const snapBand = snapAdv.band || null;

  const score = Math.max(ctxScore, snapScore);
  const band =
    ctxBand ||
    snapBand ||
    snapshot?.band ||
    "symbolic";

  const tier =
    ctxTier != null
      ? ctxTier
      : snapTier != null
      ? snapTier
      : 0;

  const advantageVersion = "M-AI-EARN-16.0-TRUST";

  const field = Object.freeze({
    advantageVersion,
    score,
    band,
    tier,
    skeletalScore: snapScore,
    skeletalBand: snapBand,
    skeletalTier: snapTier
  });

  const raw = `AI_EARN_ADV_M::v:${advantageVersion}::score:${score}::band:${band}::tier:${tier}::skScore:${snapScore}::skBand:${snapBand}::skTier:${snapTier}`;

  return {
    field,
    advantageSignature: computeHash(raw)
  };
}

function computeBinaryEconomicPressure(snapshot) {
  if (!snapshot?.binary?.metabolic) {
    return Object.freeze({
      pressure: 0,
      load: 0,
      bucket: "none",
      laneHint: "earn-none"
    });
  }

  const pressure = clamp01(snapshot.binary.metabolic.pressure ?? 0);
  const load = clamp01(snapshot.binary.metabolic.load ?? 0);

  let bucket = "none";
  if (pressure >= 0.9) bucket = "critical";
  else if (pressure >= 0.7) bucket = "high";
  else if (pressure >= 0.4) bucket = "medium";
  else if (pressure > 0) bucket = "low";

  const laneHint = `earn-${bucket}`;

  return Object.freeze({ pressure, load, bucket, laneHint });
}

function extractDualBandArtery(dualBand) {
  const artery = dualBand?.artery || null;
  if (!artery) return null;

  return Object.freeze({
    organismPressure: artery.organism?.pressure ?? null,
    organismPressureBucket: artery.organism?.pressureBucket ?? null,
    diagnostics: artery.diagnostics || null,
    proxy: artery.proxy || null
  });
}

// ---------------------------------------------------------------------------
// ECONOMIC INTELLIGENCE — SIMPLE, DETERMINISTIC SUMMARIES
// ---------------------------------------------------------------------------
function computeEconomicSummary(payload) {
  const orders = payload.orders || [];
  const referrals = payload.referrals || [];
  const referralClicks = payload.referralClicks || [];
  const vaultHistory = payload.vaultHistory || [];
  const pulseHistory = payload.pulseHistory || [];

  const orderCount = orders.length;
  const referralCount = referrals.length;
  const referralClickCount = referralClicks.length;
  const vaultEvents = vaultHistory.length;
  const pulseEvents = pulseHistory.length;

  const totalOrdersValue = orders.reduce(
    (acc, o) => acc + toNumber(o.total, 0),
    0
  );

  const totalVaultDelta = vaultHistory.reduce(
    (acc, v) => acc + toNumber(v.delta, 0),
    0
  );

  const totalPulseDelta = pulseHistory.reduce(
    (acc, p) => acc + toNumber(p.delta, 0),
    0
  );

  const engagementScore =
    orderCount * 3 +
    referralCount * 2 +
    referralClickCount * 1 +
    vaultEvents * 1 +
    pulseEvents * 1;

  const anomalyHint =
    engagementScore === 0 && (orderCount > 0 || referralCount > 0)
      ? "stalled-engagement"
      : engagementScore > 0 && totalOrdersValue === 0
      ? "zero-value-flow"
      : "none";

  return Object.freeze({
    orderCount,
    referralCount,
    referralClickCount,
    vaultEvents,
    pulseEvents,
    totalOrdersValue,
    totalVaultDelta,
    totalPulseDelta,
    engagementScore,
    anomalyHint
  });
}

// ---------------------------------------------------------------------------
// DETERMINISTIC EARN PACKETS (v16++ — NO TIMESTAMPS, NO RANDOMNESS)
// ---------------------------------------------------------------------------
function buildDeterministicEarnPacket(type, payload, snapshot, dualBand) {
  const pressure = computeBinaryEconomicPressure(snapshot);
  const { field: presenceField, presenceSignature } = buildPresenceField(
    snapshot,
    dualBand
  );
  const { field: advantageField, advantageSignature } = buildAdvantageField(
    snapshot,
    dualBand
  );
  const dualBandArtery = extractDualBandArtery(dualBand);
  const econSummary = computeEconomicSummary(payload);

  const lane = pressure.laneHint || "earn-none";
  const bucket = pressure.bucket || "none";

  const core = Object.freeze({
    type: `earn-${type}`,
    lane,
    bucket,
    payload: Object.freeze({
      ...payload,
      pressure,
      presenceField,
      advantageField,
      dualBandArtery,
      econSummary
    })
  });

  const packetSignature = computeHash(
    [
      "AI_EARN_PACKET",
      type,
      lane,
      bucket,
      presenceField.presenceBand,
      advantageField.band,
      `tier:${advantageField.tier}`,
      dualBandArtery?.organismPressureBucket || "none",
      econSummary.anomalyHint
    ].join("::")
  );

  return Object.freeze({
    ...core,
    presenceSignature,
    advantageSignature,
    packetSignature
  });
}

// ---------------------------------------------------------------------------
//  EARN PREWARM ENGINE — v16‑IMMORTAL++ (deterministic)
// ---------------------------------------------------------------------------
export function prewarmEarnOrgan(db, evolutionAPI, dualBand) {
  try {
    const warmRecord = {
      uid: "x",
      userId: "y",
      resendToken: "z",
      identityRoot: "root",
      sessionRoot: "session",
      deviceFingerprint: "fp",
      value: 123
    };

    const _ = {
      ...warmRecord,
      ...Object.fromEntries(
        Object.entries(warmRecord).filter(([k]) =>
          ![
            "uid",
            "userId",
            "resendToken",
            "identityRoot",
            "sessionRoot",
            "deviceFingerprint"
          ].includes(k)
        )
      )
    };

    db.getCollection?.("orders", { where: { userId: "prewarm" } });
    db.getDocument?.("orders", "prewarm");

    const snapshot = getOrganismSnapshot(dualBand);

    const _pressure = computeBinaryEconomicPressure(snapshot);
    const _packet = buildDeterministicEarnPacket(
      "prewarm",
      { warm: true },
      snapshot,
      dualBand
    );

    evolutionAPI?.getOrganismOverview?.({ userIsOwner: true });
    evolutionAPI?.analyzeSchema?.({ userIsOwner: true }, "pulseEarn");
    evolutionAPI?.analyzeFile?.({ userIsOwner: true }, "PulseEarn-v16-Immortal++.js");
    evolutionAPI?.analyzeRoute?.({ userIsOwner: true }, "earn");

    return true;
  } catch (err) {
    console.error("[Earn Prewarm v16++] Failed:", err);
    return false;
  }
}

// ============================================================================
//  EARN ORGAN IMPLEMENTATION — v16‑IMMORTAL++
// ============================================================================

export function createEarnAPI(db, evolutionAPI, dualBand = null) {
  prewarmEarnOrgan(db, evolutionAPI, dualBand);

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

  const api = {
    // USER — “How am I earning?”
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

      return buildDeterministicEarnPacket(
        "user-overview",
        Object.freeze({
          orders,
          referrals,
          referralClicks,
          vaultHistory,
          pulseHistory,
          organismSnapshot: snapshot
        }),
        snapshot,
        dualBand
      );
    },

    async getUserReferrals(context) {
      const [referrals, referralClicks] = await Promise.all([
        fetchUserScoped(context, "referrals"),
        fetchUserScoped(context, "referralClicks")
      ]);

      const snapshot = getOrganismSnapshot(dualBand);

      return buildDeterministicEarnPacket(
        "user-referrals",
        Object.freeze({
          referrals,
          referralClicks,
          organismSnapshot: snapshot
        }),
        snapshot,
        dualBand
      );
    },

    async getUserOrders(context) {
      const orders = await fetchUserScoped(context, "orders");
      const snapshot = getOrganismSnapshot(dualBand);

      return buildDeterministicEarnPacket(
        "user-orders",
        Object.freeze({
          orders,
          organismSnapshot: snapshot
        }),
        snapshot,
        dualBand
      );
    },

    async getUserVaultHistory(context) {
      const vaultHistory = await fetchUserScoped(context, "vaultHistory");
      const snapshot = getOrganismSnapshot(dualBand);

      return buildDeterministicEarnPacket(
        "user-vault",
        Object.freeze({
          vaultHistory,
          organismSnapshot: snapshot
        }),
        snapshot,
        dualBand
      );
    },

    async getUserPulseHistory(context) {
      const pulseHistory = await fetchUserScoped(context, "pulseHistory");
      const snapshot = getOrganismSnapshot(dualBand);

      return buildDeterministicEarnPacket(
        "user-pulse",
        Object.freeze({
          pulseHistory,
          organismSnapshot: snapshot
        }),
        snapshot,
        dualBand
      );
    },

    // OWNER — System‑Level Earn Insight
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

      return buildDeterministicEarnPacket(
        "system-overview",
        Object.freeze({
          orders,
          referrals,
          referralClicks,
          pulseHistory,
          organismSnapshot: snapshot
        }),
        snapshot,
        dualBand
      );
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

      return buildDeterministicEarnPacket(
        "system-anomalies",
        Object.freeze({
          ordersSample: orders.slice(0, 100),
          referralsSample: referrals.slice(0, 100),
          referralClicksSample: referralClicks.slice(0, 100),
          pulseHistorySample: pulseHistory.slice(0, 100),
          organismSnapshot: snapshot
        }),
        snapshot,
        dualBand
      );
    },

    // OWNER — Evolutionary + Lineage + Schema Analysis
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
      return evolutionAPI.analyzeFile(context, "PulseEarn-v16-Immortal++.js");
    },

    async analyzeEarnRoutes(context) {
      if (!context.userIsOwner || !evolutionAPI?.analyzeRoute) return null;
      return evolutionAPI.analyzeRoute(context, "earn");
    },

    // expose pressure + econ summary helpers for higher‑level AI
    computeBinaryEconomicPressure,
    computeEconomicSummary
  };

  return Object.freeze(api);
}

// ============================================================================
//  DUAL‑MODE EXPORTS (ESM + CommonJS)
// ============================================================================

export default createEarnAPI;

if (typeof module !== "undefined") {
  module.exports = {
    EarnMeta,
    createEarnAPI,
    default: createEarnAPI
  };
}
