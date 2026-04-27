// ============================================================================
//  PulseCoreGovernor.js — v11‑EVO‑DUALBAND‑MAX
//  ORGANISM‑WIDE CORE MEMORY GOVERNOR
//  “ONE BRAIN, ONE SPINE, MANY LAYERS, NO WASTE.”
//  Orchestrates: CoreMemory + CoreLayers + CoreBrain + CoreEvolution.
//  Does NOT own data — it owns DECISIONS about data.
// ============================================================================

import { CoreMemoryRole, createPulseCoreMemory } from "./PulseCoreMemory.js";
import { CoreLayersRole, PulseCoreLayersOrgan } from "./PulseCoreLayers.js";
// (Optionally)
// import { PulseCoreBrainOrgan } from "./PulseCoreBrain.js";
// import { PulseCoreEvolutionOrgan } from "./PulseCoreEvolution.js";

export const CoreGovernorRole = {
  type: "Organ",
  subsystem: "Core",
  layer: "Governor",
  version: "11.4-Evo-DualBand-Max",
  identity: "PulseCoreGovernor",

  evo: {
    binaryNative: true,
    dualBand: true,
    quadLayerAware: true,
    loopTheoryAware: true,
    fallbackAware: true,
    driftAware: true,
    evolutionAware: true,
    routeAware: true
  }
};

// ============================================================================
//  GOVERNOR CREATION
//  • Wires CoreMemory + CoreLayers
//  • Provides a single control surface for the organism
// ============================================================================

export function createPulseCoreGovernor({
  primaryStorage = window.localStorage,
  secondaryStorage = window.sessionStorage,
  log = console.log,
  warn = console.warn
} = {}) {
  const CoreMemory = createPulseCoreMemory({
    primaryStorage,
    secondaryStorage,
    log,
    warn
  });

  const { PulseCoreLayers, PulseCoreLayerRules } = PulseCoreLayersOrgan;

  function safeLog(stage, details = {}) {
    try {
      log("[PulseCoreGovernor]", stage, JSON.stringify(details));
    } catch {}
  }

  // -------------------------------------------------------------------------
  //  BOOT / PREWARM / HEAL
  //  • Called early in organism boot
  //  • Ensures CoreMemory is loaded and ready
  // -------------------------------------------------------------------------
  function boot() {
    CoreMemory.prewarm();
    safeLog("BOOT", {
      coreMemoryVersion: CoreMemoryRole.version,
      coreLayersVersion: CoreLayersRole.version
    });
  }

  function healIfNeeded() {
    // Placeholder: future drift detection + repair hooks.
    // For now, we just ensure CoreMemory is loaded.
    CoreMemory.prewarm();
  }

  // -------------------------------------------------------------------------
  //  LAYER‑AWARE SET / GET
  //  • Spines call these instead of talking directly to CoreMemory
  //  • Governor decides placement, promotion, demotion
  // -------------------------------------------------------------------------
  function set(routeId, key, value, options = {}) {
    const { dataType, dnaTag } = options;

    // Decide placement (contract only for now)
    const placement = PulseCoreLayerRules.decidePlacement(
      dataType || "generic",
      dnaTag || null,
      routeId
    );

    // For v11: we always write into CoreMemory (disk primary/secondary).
    CoreMemory.set(routeId, key, value);

    safeLog("SET", {
      routeId,
      key,
      dataType: dataType || "generic",
      placement
    });
  }

  function get(routeId, key, options = {}) {
    const value = CoreMemory.get(routeId, key);
    const hits = value !== undefined ? 1 : 0; // simple placeholder

    // Promotion / demotion decisions can be wired later.
    const promote = PulseCoreLayerRules.shouldPromote({
      hits,
      dataType: options.dataType || "generic"
    });

    if (promote) {
      safeLog("PROMOTE_HINT", { routeId, key });
      // Future: promote to RAM/GPU based on CoreLayers.
    }

    return value;
  }

  // -------------------------------------------------------------------------
  //  SNAPSHOTS / ROUTE‑LEVEL CONTROL
  // -------------------------------------------------------------------------
  function getRouteSnapshot(routeId) {
    return CoreMemory.getRouteSnapshot(routeId);
  }

  function setRouteSnapshot(routeId, snapshot) {
    CoreMemory.setRouteSnapshot(routeId, snapshot);
    safeLog("SET_ROUTE_SNAPSHOT", { routeId });
  }

  function clearRoute(routeId) {
    CoreMemory.clearRoute(routeId);
    safeLog("CLEAR_ROUTE", { routeId });
  }

  function clearAll() {
    CoreMemory.clearAll();
    safeLog("CLEAR_ALL", {});
  }

  // -------------------------------------------------------------------------
  //  FLUSH / PERSIST
  //  • Called by organism on safe points (idle, shutdown, checkpoint)
// -------------------------------------------------------------------------
  function flush() {
    CoreMemory.bulkFlush();
    safeLog("FLUSH", {
      routes: Object.keys(CoreMemory.Cache.data || {}).length
    });
  }

  // -------------------------------------------------------------------------
  //  LOOP THEORY INTROSPECTION
  //  • Expose hot keys so spines (Proxy/Router/Send/Mesh) can optimize
  // -------------------------------------------------------------------------
  function getHotKeys(minHits = 3) {
    return CoreMemory.getHotKeys(minHits);
  }

  // -------------------------------------------------------------------------
  //  PUBLIC API
  // -------------------------------------------------------------------------
  const PulseCoreGovernor = {
    CoreGovernorRole,
    CoreMemoryRole,
    CoreLayersRole,

    CoreMemory,
    PulseCoreLayers,
    PulseCoreLayerRules,

    boot,
    healIfNeeded,

    set,
    get,
    getRouteSnapshot,
    setRouteSnapshot,
    clearRoute,
    clearAll,

    flush,
    getHotKeys
  };

  safeLog("INIT", {
    identity: CoreGovernorRole.identity,
    version: CoreGovernorRole.version
  });

  return PulseCoreGovernor;
}
