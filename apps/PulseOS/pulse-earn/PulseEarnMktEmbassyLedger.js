// ============================================================================
// FILE: tropic-pulse-functions/apps/PULSE-EARN/PulseEarnMktEmbassyLedger.js
// LAYER: THE EMBASSY LEDGER (v11‑Evo A‑B‑A)
// (Marketplace Registry + Identity Verifier + Diplomatic Roster)
// ============================================================================
//
// ROLE (v11‑Evo A‑B‑A):
//   THE EMBASSY LEDGER — The official registry of all Pulse‑Earn marketplace
//   representatives. Maintains a deterministic roster of foreign marketplace
//   agents (Ambassador, Broker, Forager, Courier, Auctioneer).
//   • Validates adapter identity + required methods.
//   • Validates optional A‑B‑A surfaces (bandSignature, binaryField, waveField).
//   • Emits deterministic v11‑Evo signatures for roster integrity.
//   • Remains a PURE registry (no async, no network, no timestamps).
//
// CONTRACT (v11‑Evo):
//   • PURE REGISTRY — no AI layers, no translation, no memory model.
//   • NO async, NO timestamps, NO nondeterminism.
//   • Deterministic validation only.
//   • Public API must remain unchanged.
// ============================================================================


// ---------------------------------------------------------------------------
// Imports — Deterministic Marketplace Representatives
// ---------------------------------------------------------------------------
import { PulseEarnMktAmbassador } from "./PulseEarnMktAmbassador.js";   // Akash
import { PulseEarnMktBroker } from "./PulseEarnMktBroker.js";           // RunPod
import { PulseEarnMktForager } from "./PulseEarnMktForager.js";         // Salad
import { PulseEarnMktCourier } from "./PulseEarnMktCourier.js";         // Spheron
import { PulseEarnMktAuctioneer } from "./PulseEarnMktAuctioneer.js";   // Vast


// ---------------------------------------------------------------------------
// Deterministic Hash Helper — v11‑Evo
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


// ---------------------------------------------------------------------------
// Healing Metadata — Embassy Ledger Integrity Log (v11‑Evo A‑B‑A)
// ---------------------------------------------------------------------------
const embassyHealing = {
  adaptersLoaded: [],
  missingAdapters: [],
  invalidAdapters: [],
  cycleCount: 0,
  lastCycleIndex: null,

  // v11‑Evo signatures
  lastAdapterSignature: null,
  lastRosterSignature: null,
  lastCycleSignature: null,

  // A‑B‑A surfaces
  lastAbaSignature: null
};

let embassyCycle = 0;


// ---------------------------------------------------------------------------
// Adapter Validation — Diplomatic Credential Check (A‑B‑A aware)
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
  const abaBand = adapter.bandSignature || null;
  embassyHealing.lastAbaSignature = buildAbaSignature(adapter);

  embassyHealing.adaptersLoaded.push(name);
  embassyHealing.lastAdapterSignature = buildAdapterSignature(name);
  embassyHealing.lastCycleSignature = buildCycleSignature(embassyCycle);

  return true;
}


// ---------------------------------------------------------------------------
// Validate All Marketplace Representatives (v11‑Evo safe)
// ---------------------------------------------------------------------------
validateAdapter("PulseEarnMktAmbassador",  PulseEarnMktAmbassador);  // Akash
validateAdapter("PulseEarnMktBroker",      PulseEarnMktBroker);      // RunPod
validateAdapter("PulseEarnMktForager",     PulseEarnMktForager);     // Salad
validateAdapter("PulseEarnMktCourier",     PulseEarnMktCourier);     // Spheron
validateAdapter("PulseEarnMktAuctioneer",  PulseEarnMktAuctioneer);  // Vast


// ---------------------------------------------------------------------------
// Deterministic Marketplace Roster (v11‑Evo safe)
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
// Healing State Accessor
// ---------------------------------------------------------------------------
function getPulseEarnMktEmbassyHealingState() {
  return { ...embassyHealing };
}


// ============================================================================
// Exported API — EMBASSY LEDGER (Diplomatic Roster, v11‑Evo A‑B‑A)
// ============================================================================
export const PulseEarnMktEmbassyLedger = {
  marketplaces,
  getHealingState: getPulseEarnMktEmbassyHealingState
};
