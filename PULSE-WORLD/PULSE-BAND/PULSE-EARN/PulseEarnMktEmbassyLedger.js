// ============================================================================
// FILE: tropic-pulse-functions/PULSE-WORLD/PULSE-EARN/PulseEarnMktEmbassyLedger-v13.0-PRESENCE-IMMORTAL.js
// LAYER: THE EMBASSY LEDGER (v13.0-PRESENCE-IMMORTAL)
// Marketplace Registry + Identity Verifier + Diplomatic Roster + Presence/Advantage/Prewarm
// ============================================================================
//
// ROLE (v13.0-PRESENCE-IMMORTAL):
//   The Embassy Ledger is the authoritative registry of all Pulse‑Earn marketplace
//   representatives. It validates identity, ensures deterministic readiness,
//   and emits unified v13 presence/advantage/chunk-prewarm surfaces for each adapter.
//
// CONTRACT (v13.0-PRESENCE-IMMORTAL):
//   • PURE REGISTRY — no async, no randomness, no timestamps.
//   • Deterministic validation + readiness surfaces only.
//   • Unified Earn v13 presence model (mesh/castle/region).
//   • Public API unchanged: marketplaces[], getHealingState().
// ============================================================================
/*
AI_EXPERIENCE_META = {
  identity: "PulseEarnMktEmbassyLedger",
  version: "v14-IMMORTAL",
  layer: "earn_market",
  role: "market_embassy_ledger",
  lineage: "PulseEarnMktEmbassyLedger-v11 → v12.3 → v14-IMMORTAL",

  evo: {
    embassyLedger: true,
    adapterRegistry: true,
    adapterValidation: true,
    deterministicSignatures: true,
    dualBand: true,
    symbolicPrimary: true,
    binaryAware: true,

    deterministic: true,
    driftProof: true,
    pureCompute: true,
    zeroNetwork: true,
    zeroFilesystem: true,
    zeroMutationOfInput: true
  },

  contract: {
    always: [
      "PulseEarnMktConsulate",
      "PulseEarnMktBroker",
      "PulseEarnMktCourier",
      "PulseEarnMktForager"
    ],
    never: [
      "safeRoute",
      "fetchViaCNS"
    ]
  }
}
*/

export const PulseEarnMktEmbassyLedgerMeta = Object.freeze({
  layer: "PulseEarnMktEmbassyLedger",
  role: "EARN_MARKETPLACE_REGISTRY",
  version: "v13.0-PRESENCE-IMMORTAL",
  identity: "PulseEarnMktEmbassyLedger-v13.0-PRESENCE-IMMORTAL",

  guarantees: Object.freeze({
    deterministic: true,
    driftProof: true,
    noRandomness: true,
    noRealTime: true,
    noExternalIO: true,
    pureRegistry: true,

    dualBandAware: true,
    binaryAware: true,
    waveFieldAware: true,
    presenceAware: true,
    advantageAware: true,
    chunkPrewarmAware: true,
    healingMetadataAware: true,

    worldLensAware: false,
    zeroNetwork: true,
    zeroAsync: true,
    zeroAI: true,
    zeroUserCode: true,
    identityVerificationStrict: true
  })
});

// ---------------------------------------------------------------------------
// Imports — Deterministic Marketplace Representatives (v13)
// ---------------------------------------------------------------------------
import { PulseEarnMktAmbassador } from "./PulseEarnMktAmbassador.js";   // Akash
import { PulseEarnMktBroker } from "./PulseEarnMktBroker.js";           // RunPod
import { PulseEarnMktForager } from "./PulseEarnMktForager.js";         // Salad
import { PulseEarnMktCourier } from "./PulseEarnMktCourier.js";         // Spheron
import { PulseEarnMktAuctioneer } from "./PulseEarnMktAuctioneer.js";   // Vast

// ---------------------------------------------------------------------------
// Deterministic Hash Helper
// ---------------------------------------------------------------------------
function computeHash(str) {
  let h = 0;
  const s = String(str || "");
  for (let i = 0; i < s.length; i++)
    h = (h + s.charCodeAt(i) * (i + 1)) % 100000;
  return `h${h}`;
}

function buildAdapterSignature(name) {
  return computeHash(`ADAPTER::${name}`);
}

function buildRosterSignature(list) {
  return computeHash(`ROSTER::${list.join("|")}`);
}

function buildCycleSignature(cycle) {
  return computeHash(`EMBASSY_CYCLE::${cycle}`);
}

function normalizeBand(band) {
  const b = String(band || "symbolic").toLowerCase();
  return b === "binary" ? "binary" : "symbolic";
}

// ---------------------------------------------------------------------------
// Unified Earn v13 Presence Tier
// ---------------------------------------------------------------------------
function classifyPresenceTier(pressure) {
  if (pressure >= 150) return "critical";
  if (pressure >= 100) return "high";
  if (pressure >= 50) return "elevated";
  if (pressure > 0) return "soft";
  return "idle";
}

// ---------------------------------------------------------------------------
// Unified v13 Presence Field for Adapters
// ---------------------------------------------------------------------------
function buildAdapterPresenceField(name, adapter, cycleIndex, globalHints = {}) {
  const ghP = globalHints.presenceContext || {};
  const mesh = globalHints.meshSignals || {};
  const castle = globalHints.castleSignals || {};
  const region = globalHints.regionContext || {};

  const meshStrength = Number(mesh.meshStrength || 0);
  const meshPressureExternal = Number(mesh.meshPressureIndex || 0);
  const castleLoadExternal = Number(castle.loadLevel || 0);

  // Internal adapter identity signal
  const idLen = (adapter?.id || "").length;
  const roleLen = (adapter?.name || "").length;
  const internalComposite = idLen * 0.001 + roleLen * 0.001 + cycleIndex * 0.0001;
  const internalPressure = Math.floor(internalComposite * 1000);

  const meshPressureIndex = meshPressureExternal + internalPressure;
  const castleLoadLevel = castleLoadExternal;

  const pressure = meshPressureIndex + castleLoadLevel;
  const presenceTier = classifyPresenceTier(pressure);

  return {
    presenceVersion: "v13.0-PRESENCE-IMMORTAL",
    presenceTier,

    adapterName: name,
    adapterId: adapter?.id || null,

    bandPresence: ghP.bandPresence || "symbolic",
    routerPresence: ghP.routerPresence || "stable",
    devicePresence: ghP.devicePresence || "embassy",

    meshPresence: ghP.meshPresence || (meshStrength > 0 ? "mesh-active" : "mesh-idle"),
    castlePresence: ghP.castlePresence || castle.castlePresence || "embassy-region",
    regionPresence: ghP.regionPresence || region.regionTag || "unknown-region",

    regionId: region.regionId || "embassy-region",
    castleId: castle.castleId || "embassy-castle",

    meshStrength,
    meshPressureIndex,
    castleLoadLevel,

    idLen,
    roleLen,
    cycleIndex,

    presenceSignature: computeHash(
      `EMBASSY_PRESENCE::${name}::${presenceTier}::${meshPressureIndex}::${castleLoadLevel}`
    )
  };
}

// ---------------------------------------------------------------------------
// Unified v13 Advantage‑C
// ---------------------------------------------------------------------------
function buildAdapterAdvantageField(name, adapter, band, cycleIndex, presenceField, globalHints = {}) {
  const hasPing = typeof adapter?.ping === "function";
  const hasFetch = typeof adapter?.fetchJobs === "function";
  const hasSubmit = typeof adapter?.submitResult === "function";

  const methodScore = (hasPing ? 1 : 0) + (hasFetch ? 1 : 0) + (hasSubmit ? 1 : 0);
  const bandScore = band === "binary" ? 2 : 1;

  const baseScore =
    methodScore * 0.01 +
    bandScore * 0.005 +
    cycleIndex * 0.0001;

  const presenceBoost =
    presenceField.presenceTier === "critical" ? 0.02 :
    presenceField.presenceTier === "high" ? 0.015 :
    presenceField.presenceTier === "elevated" ? 0.01 :
    presenceField.presenceTier === "soft" ? 0.005 :
    0;

  const advantageScore = baseScore + presenceBoost;

  let advantageTier = 0;
  if (advantageScore >= 0.05) advantageTier = 3;
  else if (advantageScore >= 0.02) advantageTier = 2;
  else if (advantageScore > 0) advantageTier = 1;

  const fallbackBandLevel = globalHints.fallbackBandLevel ?? 0;

  return {
    advantageVersion: "C-13.0",
    adapterName: name,
    adapterId: adapter?.id || null,
    band,
    methodScore,
    bandScore,
    advantageScore,
    advantageTier,
    fallbackBandLevel
  };
}

// ---------------------------------------------------------------------------
// Unified v13 Chunk/Prewarm Plan
// ---------------------------------------------------------------------------
function buildAdapterChunkPrewarmPlan(name, adapter, presenceField, advantageField) {
  const basePriority =
    presenceField.presenceTier === "critical"
      ? 4
      : presenceField.presenceTier === "high"
      ? 3
      : presenceField.presenceTier === "elevated"
      ? 2
      : presenceField.presenceTier === "soft"
      ? 1
      : 0;

  const advantageBoost =
    advantageField.advantageTier >= 3 ? 2 :
    advantageField.advantageTier === 2 ? 1 :
    0;

  const priority = basePriority + advantageBoost;

  return {
    planVersion: "v13.0-Embassy-AdvantageC",
    adapterName: name,
    adapterId: adapter?.id || null,
    priority,
    band: presenceField.presenceTier,
    chunks: {
      adapterEnvelope: true,
      adapterCapabilities: true,
      adapterBandMetadata: true
    },
    cache: {
      rosterEntry: true,
      adapterPresence: true,
      adapterAdvantage: true
    },
    prewarm: {
      nervousSystem: true,
      muscleSystem: true,
      foragerLayer: true,
      lymphNodes: true
    }
  };
}

// ---------------------------------------------------------------------------
// Healing Metadata
// ---------------------------------------------------------------------------
const embassyHealing = {
  adaptersLoaded: [],
  missingAdapters: [],
  invalidAdapters: [],
  cycleCount: 0,
  lastCycleIndex: null,

  lastAdapterSignature: null,
  lastRosterSignature: null,
  lastCycleSignature: null,

  adapterPresence: {},
  adapterAdvantage: {},
  adapterChunkPlan: {}
};

let embassyCycle = 0;

// ---------------------------------------------------------------------------
// Adapter Validation (Unified v13 Presence)
// ---------------------------------------------------------------------------
function validateAdapter(name, adapter, globalHints = {}) {
  embassyCycle++;
  embassyHealing.cycleCount++;
  embassyHealing.lastCycleIndex = embassyCycle;

  if (!adapter) {
    embassyHealing.missingAdapters.push(name);
    return false;
  }

  const required = ["ping", "fetchJobs", "submitResult"];
  const missing = required.filter(fn => typeof adapter[fn] !== "function");

  if (missing.length > 0) {
    embassyHealing.invalidAdapters.push({ adapter: name, missingMethods: missing });
    return false;
  }

  embassyHealing.adaptersLoaded.push(name);
  embassyHealing.lastAdapterSignature = buildAdapterSignature(name);
  embassyHealing.lastCycleSignature = buildCycleSignature(embassyCycle);

  const band = normalizeBand(adapter.bandSignature || "symbolic");

  const presenceField = buildAdapterPresenceField(name, adapter, embassyCycle, globalHints);
  const advantageField = buildAdapterAdvantageField(
    name,
    adapter,
    band,
    embassyCycle,
    presenceField,
    globalHints
  );
  const chunkPlan = buildAdapterChunkPrewarmPlan(name, adapter, presenceField, advantageField);

  embassyHealing.adapterPresence[name] = presenceField;
  embassyHealing.adapterAdvantage[name] = advantageField;
  embassyHealing.adapterChunkPlan[name] = chunkPlan;

  return true;
}

// ---------------------------------------------------------------------------
// Validate All Marketplace Representatives
// ---------------------------------------------------------------------------
validateAdapter("PulseEarnMktAmbassador",  PulseEarnMktAmbassador);
validateAdapter("PulseEarnMktBroker",      PulseEarnMktBroker);
validateAdapter("PulseEarnMktForager",     PulseEarnMktForager);
validateAdapter("PulseEarnMktCourier",     PulseEarnMktCourier);
validateAdapter("PulseEarnMktAuctioneer",  PulseEarnMktAuctioneer);

// ---------------------------------------------------------------------------
// Deterministic Marketplace Roster
// ---------------------------------------------------------------------------
const marketplaces = [
  PulseEarnMktAmbassador,
  PulseEarnMktBroker,
  PulseEarnMktForager,
  PulseEarnMktCourier,
  PulseEarnMktAuctioneer
];

embassyHealing.lastRosterSignature = buildRosterSignature(
  marketplaces.map(m => m.id || "unknown")
);

// ---------------------------------------------------------------------------
// Healing State Accessor
// ---------------------------------------------------------------------------
function getPulseEarnMktEmbassyHealingState() {
  return { ...embassyHealing };
}

// ---------------------------------------------------------------------------
// Exported API
// ---------------------------------------------------------------------------
export const PulseEarnMktEmbassyLedger = {
  marketplaces,
  getHealingState: getPulseEarnMktEmbassyHealingState
};
