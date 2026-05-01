// ============================================================================
// FILE: tropic-pulse-functions/PULSE-WORLD/PULSE-EARN/PulseEarnMktEmbassyLedger.js
// LAYER: THE EMBASSY LEDGER (v12.3-PRESENCE-EVO+)
// (Marketplace Registry + Identity Verifier + Diplomatic Roster + Prewarm Surfaces)
// ============================================================================
//
// ROLE (v12.3-PRESENCE-EVO+):
//   THE EMBASSY LEDGER — The official registry of all Pulse‑Earn marketplace
//   representatives. Maintains a deterministic roster of foreign marketplace
//   agents (Ambassador, Broker, Forager, Courier, Auctioneer).
//   • Validates adapter identity + required methods.
//   • Validates optional A‑B‑A surfaces (bandSignature, binaryField, waveField).
//   • Emits deterministic signatures for roster integrity.
//   • Computes Presence + Advantage‑C + Chunk/Prewarm plans per adapter.
//   • Keeps the entire marketplace layer "ready to go" every single moment.
//
// CONTRACT (v12.3-PRESENCE-EVO+):
//   • PURE REGISTRY — no AI layers, no translation, no memory model.
//   • NO async, NO timestamps, NO nondeterminism.
//   • Deterministic validation + readiness surfaces only.
//   • Public API remains unchanged (marketplaces, getHealingState).
// ============================================================================
export const PulseEarnMktEmbassyLedgerMeta = Object.freeze({
  layer: "PulseEarnMktEmbassyLedger",
  role: "EARN_MARKETPLACE_REGISTRY",
  version: "v12.3-PRESENCE-EVO+",
  identity: "PulseEarnMktEmbassyLedger-v12.3-PRESENCE-EVO+",

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
  }),

  contract: Object.freeze({
    input: [
      "MarketplaceAdapters",
      "AdapterIdentityMetadata",
      "DualBandContext",
      "DevicePhenotypePresence"
    ],
    output: [
      "ValidatedMarketplaceRoster",
      "EmbassyDiagnostics",
      "EmbassySignatures",
      "EmbassyHealingState",
      "EmbassyPresenceField",
      "EmbassyAdvantageField",
      "EmbassyChunkPrewarmPlan"
    ]
  }),

  lineage: Object.freeze({
    root: "PulseOS-v11-EVO",
    parent: "PulseEarn-v11.2-EVO",
    ancestry: [
      "PulseEarnMktEmbassyLedger-v9",
      "PulseEarnMktEmbassyLedger-v10",
      "PulseEarnMktEmbassyLedger-v11",
      "PulseEarnMktEmbassyLedger-v11-Evo"
    ]
  }),

  bands: Object.freeze({
    supported: ["symbolic", "binary"],
    default: "symbolic",
    behavior: "metadata-only"
  }),

  architecture: Object.freeze({
    pattern: "A-B-A",
    baseline: "deterministic adapter validation + roster construction",
    adaptive: "binary/wave surfaces + band signatures + presence/advantage/prewarm",
    return: "deterministic marketplace roster + signatures + readiness surfaces"
  })
});


// ---------------------------------------------------------------------------
// Imports — Deterministic Marketplace Representatives
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
  for (let i = 0; i < s.length; i++) {
    h = (h + s.charCodeAt(i) * (i + 1)) % 100000;
  }
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

function buildAbaSignature(adapter) {
  const band = adapter?.bandSignature || "NO_BAND";
  return computeHash(`ABA_ADAPTER::${band}`);
}

function normalizeBand(band) {
  const b = String(band || "symbolic").toLowerCase();
  return b === "binary" ? "binary" : "symbolic";
}


// ---------------------------------------------------------------------------
// Presence / Advantage / Chunk‑Prewarm Builders (v12.3)
// ---------------------------------------------------------------------------
function buildAdapterPresenceField(name, adapter, cycleIndex) {
  const idLen = (adapter?.id || "").length;
  const roleLen = (adapter?.name || "").length;

  const composite =
    idLen * 0.001 +
    roleLen * 0.001 +
    cycleIndex * 0.0001;

  const presenceTier =
    composite >= 0.02 ? "presence_high" :
    composite >= 0.005 ? "presence_mid" :
    "presence_low";

  return {
    presenceVersion: "v12.3",
    presenceTier,
    adapterName: name,
    adapterId: adapter?.id || null,
    idLen,
    roleLen,
    cycleIndex,
    presenceSignature: computeHash(
      `EMBASSY_PRESENCE::${name}::${presenceTier}::${cycleIndex}`
    )
  };
}

function buildAdapterAdvantageField(name, adapter, band, cycleIndex) {
  const hasPing = typeof adapter?.ping === "function";
  const hasFetch = typeof adapter?.fetchJobs === "function";
  const hasSubmit = typeof adapter?.submitResult === "function";

  const methodScore =
    (hasPing ? 1 : 0) +
    (hasFetch ? 1 : 0) +
    (hasSubmit ? 1 : 0);

  const bandScore = band === "binary" ? 2 : 1;

  const advantageScore =
    methodScore * 0.01 +
    bandScore * 0.005 +
    cycleIndex * 0.0001;

  return {
    advantageVersion: "C",
    adapterName: name,
    adapterId: adapter?.id || null,
    band,
    methodScore,
    bandScore,
    advantageScore
  };
}

function buildAdapterChunkPrewarmPlan(name, adapter, presenceField, advantageField) {
  const basePriority =
    presenceField.presenceTier === "presence_high"
      ? 3
      : presenceField.presenceTier === "presence_mid"
      ? 2
      : 1;

  const advantageBoost = advantageField.advantageScore > 0.03 ? 1 : 0;
  const priority = basePriority + advantageBoost;

  return {
    planVersion: "v12.3-Embassy-AdvantageC",
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
// Healing Metadata — Embassy Ledger Integrity + Readiness Log
// ---------------------------------------------------------------------------
const embassyHealing = {
  adaptersLoaded: [],
  missingAdapters: [],
  invalidAdapters: [],
  cycleCount: 0,
  lastCycleIndex: null,

  // v11/v12 signatures
  lastAdapterSignature: null,
  lastRosterSignature: null,
  lastCycleSignature: null,
  lastAbaSignature: null,

  // Presence / Advantage / Chunk‑Prewarm per adapter
  adapterPresence: {},   // name -> presenceField
  adapterAdvantage: {},  // name -> advantageField
  adapterChunkPlan: {}   // name -> chunkPrewarmPlan
};

let embassyCycle = 0;


// ---------------------------------------------------------------------------
// Adapter Validation — Diplomatic Credential Check + Readiness Surfaces
// ---------------------------------------------------------------------------
function validateAdapter(name, adapter) {
  embassyCycle++;
  embassyHealing.cycleCount++;
  embassyHealing.lastCycleIndex = embassyCycle;

  if (!adapter) {
    embassyHealing.missingAdapters.push(name);
    return false;
  }

  // Required receptor methods
  const required = ["ping", "fetchJobs", "submitResult"];
  const missing = required.filter(fn => typeof adapter[fn] !== "function");

  if (missing.length > 0) {
    embassyHealing.invalidAdapters.push({
      adapter: name,
      missingMethods: missing
    });
    return false;
  }

  // Optional A‑B‑A surfaces (non‑blocking)
  const abaBand = adapter.bandSignature || "symbolic";
  embassyHealing.lastAbaSignature = buildAbaSignature(adapter);

  embassyHealing.adaptersLoaded.push(name);
  embassyHealing.lastAdapterSignature = buildAdapterSignature(name);
  embassyHealing.lastCycleSignature = buildCycleSignature(embassyCycle);

  // Presence + Advantage‑C + Chunk/Prewarm (per adapter, per validation cycle)
  const band = normalizeBand(abaBand);
  const presenceField = buildAdapterPresenceField(name, adapter, embassyCycle);
  const advantageField = buildAdapterAdvantageField(name, adapter, band, embassyCycle);
  const chunkPlan = buildAdapterChunkPrewarmPlan(name, adapter, presenceField, advantageField);

  embassyHealing.adapterPresence[name] = presenceField;
  embassyHealing.adapterAdvantage[name] = advantageField;
  embassyHealing.adapterChunkPlan[name] = chunkPlan;

  return true;
}


// ---------------------------------------------------------------------------
// Validate All Marketplace Representatives (deterministic, eager prewarm)
// ---------------------------------------------------------------------------
validateAdapter("PulseEarnMktAmbassador",  PulseEarnMktAmbassador);  // Akash
validateAdapter("PulseEarnMktBroker",      PulseEarnMktBroker);      // RunPod
validateAdapter("PulseEarnMktForager",     PulseEarnMktForager);     // Salad
validateAdapter("PulseEarnMktCourier",     PulseEarnMktCourier);     // Spheron
validateAdapter("PulseEarnMktAuctioneer",  PulseEarnMktAuctioneer);  // Vast


// ---------------------------------------------------------------------------
// Deterministic Marketplace Roster
// ---------------------------------------------------------------------------
const marketplaces = [
  PulseEarnMktAmbassador,   // Akash — Ambassador
  PulseEarnMktBroker,       // RunPod — Broker
  PulseEarnMktForager,      // Salad — Forager
  PulseEarnMktCourier,      // Spheron — Courier
  PulseEarnMktAuctioneer    // Vast — Auctioneer
];

embassyHealing.lastRosterSignature = buildRosterSignature(
  marketplaces.map(m => m.id || "unknown")
);


// ---------------------------------------------------------------------------
// Healing State Accessor (public, unchanged)
// ---------------------------------------------------------------------------
function getPulseEarnMktEmbassyHealingState() {
  return { ...embassyHealing };
}


// ============================================================================
// Exported API — EMBASSY LEDGER (Diplomatic Roster, v12.3-PRESENCE-EVO+)
// ============================================================================
export const PulseEarnMktEmbassyLedger = {
  marketplaces,
  getHealingState: getPulseEarnMktEmbassyHealingState
};
