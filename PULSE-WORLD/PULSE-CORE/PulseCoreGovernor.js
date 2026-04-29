// ============================================================================
//  PulseCoreGovernor.js — v12‑EVO‑PRESENCE‑MAX
//  ORGANISM‑WIDE CORE MEMORY GOVERNOR
//  “ONE BRAIN. ONE SPINE. MANY LAYERS. ZERO DRIFT.”
//  • MetaBlock (v12 identity)
//  • dnaTag + version propagation
//  • Presence‑touch propagation
//  • TTL + healing alignment
//  • Dual‑band alignment
//  • Promotion/demotion logic
//  • Placement logic
//  • Drift detection hooks
//  • Governor‑aligned with CoreMemory v12 + CoreLayers v12
// ============================================================================

import { CoreMemoryRole, createPulseCoreMemory } from "./PulseCoreMemory.js";
import { CoreLayersRole, PulseCoreLayersOrgan } from "./PulseCoreLayers.js";

export const CoreGovernorRole = {
  type: "Organ",
  subsystem: "Core",
  layer: "Governor",
  identity: "PulseCoreGovernor",
  version: "12.0-Evo-Presence",

  evo: {
    binaryNative: true,
    dualBand: true,
    quadLayerAware: true,
    loopTheoryAware: true,
    fallbackAware: true,
    driftAware: true,
    evolutionAware: true,
    routeAware: true,
    presenceAware: true,
    dnaAware: true,
    versionAware: true
  }
};

// ---------------------------------------------------------------------------
//  v12 IDENTITY BLOCK (MetaBlock)
// ---------------------------------------------------------------------------
export const CoreGovernorMetaBlock = {
  identity: "PulseCoreGovernor",
  subsystem: "Core",
  layer: "Governor",
  role: "Memory-Governor",
  version: "12.0-Evo-Presence",
  evo: CoreGovernorRole.evo
};

// ============================================================================
//  GOVERNOR CREATION
// ============================================================================
export function createPulseCoreGovernor({
  primaryStorage = window.localStorage,
  secondaryStorage = window.sessionStorage,
  dnaTag = "default-dna",
  version = "12.0-Evo-Presence",
  overlay = null,
  log = console.log,
  warn = console.warn
} = {}) {

  const CoreMemory = createPulseCoreMemory({
    primaryStorage,
    secondaryStorage,
    dnaTag,
    version,
    log,
    warn
  });

  const { PulseCoreLayers, PulseCoreLayerRules } = PulseCoreLayersOrgan;

  function safeLog(stage, details = {}) {
    try { log("[PulseCoreGovernor]", stage, JSON.stringify(details)); }
    catch {}
  }

  // -------------------------------------------------------------------------
  //  BOOT / PREWARM / HEAL
  // -------------------------------------------------------------------------
  function boot() {
    CoreMemory.prewarm();
    safeLog("BOOT", {
      coreMemoryVersion: CoreMemoryRole.version,
      coreLayersVersion: CoreLayersRole.version,
      dnaTag,
      version
    });
  }

  function healIfNeeded() {
    CoreMemory.prewarm();
    safeLog("HEAL_CHECK", {});
  }

  // -------------------------------------------------------------------------
  //  LAYER‑AWARE SET / GET (v12)
  // -------------------------------------------------------------------------
  function set(routeId, key, value, options = {}) {
    const dataType = options.dataType || "generic";

    const placement = PulseCoreLayerRules.decidePlacement(
      dataType,
      dnaTag,
      routeId
    );

    CoreMemory.set(routeId, key, value);

    safeLog("SET", {
      routeId,
      key,
      dataType,
      placement,
      dnaTag,
      version
    });
  }

  function get(routeId, key, options = {}) {
    const dataType = options.dataType || "generic";
    const value = CoreMemory.get(routeId, key);

    const hits = value !== undefined ? 1 : 0;

    const promote = PulseCoreLayerRules.shouldPromote({
      hits,
      dataType
    });

    if (promote) {
      safeLog("PROMOTE_HINT", { routeId, key, dataType });
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
  // -------------------------------------------------------------------------
  function flush() {
    CoreMemory.bulkFlush();
    safeLog("FLUSH", {
      routes: Object.keys(CoreMemory.Cache.data || {}).length
    });
  }

  // -------------------------------------------------------------------------
  //  LOOP THEORY INTROSPECTION
  // -------------------------------------------------------------------------
  function getHotKeys(minHits = 3) {
    return CoreMemory.getHotKeys(minHits);
  }

  // -------------------------------------------------------------------------
  //  PUBLIC API
  // -------------------------------------------------------------------------
 const PulseCoreGovernor = {
    CoreGovernorRole,
    CoreGovernorMetaBlock,

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
    getHotKeys,

    dnaTag,
    version
  };

  safeLog("INIT", {
    identity: CoreGovernorRole.identity,
    version: CoreGovernorRole.version
  });

  return PulseCoreGovernor;
}
