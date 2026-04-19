// ============================================================================
// FILE: tropic-pulse-functions/apps/pulse-earn/marketplaces/RegisteredMarketplaces.js
// LAYER: THE EMBASSY LEDGER (Marketplace Registry + Identity Verifier)
// ============================================================================
//
// ROLE:
//   THE EMBASSY LEDGER — The official registry of all Pulse‑Earn marketplace
//   representatives. Maintains a deterministic roster of foreign marketplace
//   agents (Ambassador, Broker, Artisan, Courier, Auctioneer).
//
// PURPOSE:
//   • Provide Earn Engine with a clean, stable list of marketplace adapters
//   • Validate adapter identity + required capabilities
//   • Maintain healing metadata for adapter integrity
//   • Serve as the diplomatic ledger of all external compute markets
//
// CONTRACT:
//   • PURE REGISTRY — no AI layers, no translation, no memory model
//   • READ‑ONLY except for healing metadata
//   • NO eval(), NO Function(), NO dynamic imports
//   • Deterministic validation only
//
// SAFETY:
//   • v6.3 upgrade is COMMENTAL ONLY — NO LOGIC CHANGES
// ============================================================================

// ---------------------------------------------------------------------------
// Imports — Marketplace Representatives
// ---------------------------------------------------------------------------
import { VastAdapter } from "./VastAdapter.js";              // The Auctioneer
import { AkashAdapter } from "./AkashAdapter.js";            // The Ambassador
import { RenderAdapter } from "./RenderAdapter.js";          // The Artisan
import { SpheronAdapter } from "./SpheronAdapter.js";        // The Courier
import { FluidStackAdapter } from "./FluidStackAdapter.js";  // The Broker

// ---------------------------------------------------------------------------
// Healing Metadata — Embassy Ledger Integrity Log
// ---------------------------------------------------------------------------
const healingState = {
  adaptersLoaded: [],
  missingAdapters: [],
  invalidAdapters: [],
  cycleCount: 0,
};

// ---------------------------------------------------------------------------
// Adapter Validation — Diplomatic Credential Check
// ---------------------------------------------------------------------------
function validateAdapter(name, adapter) {
  healingState.cycleCount++;

  if (!adapter) {
    healingState.missingAdapters.push(name);
    return false;
  }

  const required = ["ping", "fetchJobs", "submitResult"];
  const missing = required.filter(fn => typeof adapter[fn] !== "function");

  if (missing.length > 0) {
    healingState.invalidAdapters.push({
      adapter: name,
      missingMethods: missing,
    });
    return false;
  }

  healingState.adaptersLoaded.push(name);
  return true;
}

// ---------------------------------------------------------------------------
// Validate All Marketplace Representatives
// ---------------------------------------------------------------------------
validateAdapter("VastAdapter", VastAdapter);
validateAdapter("AkashAdapter", AkashAdapter);
validateAdapter("RenderAdapter", RenderAdapter);
validateAdapter("SpheronAdapter", SpheronAdapter);
validateAdapter("FluidStackAdapter", FluidStackAdapter);

// ---------------------------------------------------------------------------
// Deterministic Marketplace Roster
// ---------------------------------------------------------------------------
const marketplaces = [
  VastAdapter,        // The Auctioneer
  AkashAdapter,       // The Ambassador
  RenderAdapter,      // The Artisan
  SpheronAdapter,     // The Courier
  FluidStackAdapter,  // The Broker
];

// ---------------------------------------------------------------------------
// Healing State Accessor
// ---------------------------------------------------------------------------
function getHealingState() {
  return { ...healingState };
}

// ============================================================================
// Exported API — EMBASSY LEDGER (Pattern‑Aligned, Blue Module)
// ============================================================================
export const RegisteredMarketplaces = {
  marketplaces,   // Deterministic roster
  getHealingState // Integrity report
};
