// FILE: tropic-pulse-functions/apps/pulse-earn/marketplaces/RegisteredMarketplaces.js
//
// RegisteredMarketplaces v5 — Deterministic, Drift‑Proof, Self‑Healing Registry
// NO AI LAYERS. NO TRANSLATION. NO MEMORY MODEL. PURE HEALING.
//
// ------------------------------------------------------
// 📘 PAGE INDEX — Source of Truth for This File
// ------------------------------------------------------
//
// ROLE:
//   Marketplace Registry for Pulse Earn — clean, deterministic export of all
//   marketplace adapters used by the Earn runtime.
//
// RESPONSIBILITIES:
//   • Import marketplace adapters
//   • Validate adapter structure
//   • Export adapters as a stable array
//   • Maintain healing metadata
//
// THIS FILE IS:
//   • A pure registry of marketplace adapters
//   • A dependency for Earn-side orchestration
//   • A deterministic, side-effect-free module
//
// THIS FILE IS NOT:
//   • A bootstrap file
//   • A reputation loader
//   • A scheduler
//   • A compute engine
//   • A backend service
//   • A financial/settlement handler
//
// SAFETY RULES:
//   • Never mutate adapter objects
//   • Never import backend/server modules
//   • Never perform side effects
//   • Always remain deterministic
//
// ------------------------------------------------------
// Imports
// ------------------------------------------------------

import { VastAdapter } from "./VastAdapter.js";
import { AkashAdapter } from "./AkashAdapter.js";
import { RenderAdapter } from "./RenderAdapter.js";
import { SpheronAdapter } from "./SpheronAdapter.js";
import { FluidStackAdapter } from "./FluidStackAdapter.js";

// ------------------------------------------------------
// Healing Metadata
// ------------------------------------------------------

const healingState = {
  adaptersLoaded: [],
  missingAdapters: [],
  invalidAdapters: [],
  cycleCount: 0,
};

// ------------------------------------------------------
// Adapter Validation (v5 deterministic integrity check)
// ------------------------------------------------------

function validateAdapter(name, adapter) {
  healingState.cycleCount++;

  if (!adapter) {
    healingState.missingAdapters.push(name);
    return false;
  }

  // Required adapter methods
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

// ------------------------------------------------------
// Validate all adapters
// ------------------------------------------------------

validateAdapter("VastAdapter", VastAdapter);
validateAdapter("AkashAdapter", AkashAdapter);
validateAdapter("RenderAdapter", RenderAdapter);
validateAdapter("SpheronAdapter", SpheronAdapter);
validateAdapter("FluidStackAdapter", FluidStackAdapter);

// ------------------------------------------------------
// Export registry (deterministic, side-effect-free)
// ------------------------------------------------------

export const marketplaces = [
  VastAdapter,
  AkashAdapter,
  RenderAdapter,
  SpheronAdapter,
  FluidStackAdapter,
];

// ------------------------------------------------------
// Export healing metadata for Earn/Miner healers
// ------------------------------------------------------

export function getRegisteredMarketplacesHealingState() {
  return { ...healingState };
}
