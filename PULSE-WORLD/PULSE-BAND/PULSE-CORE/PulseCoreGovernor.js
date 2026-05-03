// ============================================================================
//  PulseCoreGovernor.js — v15-IMMORTAL-GOVERNOR
//  ORGANISM‑WIDE CORE MEMORY GOVERNOR
//  “ONE BRAIN. ONE SPINE. MANY LAYERS. ZERO DRIFT.”
//  • v15 AI_EXPERIENCE_META (IMMORTAL identity)
//  • dnaTag + version propagation
//  • Presence / band / route propagation (via CoreLayers + overlay)
//  • TTL + healing alignment (delegated to CoreMemory)
//  • Dual‑band alignment (binary + symbolic via CoreLayers rules)
//  • Promotion/demotion hints
//  • Placement logic (route + dataType + dnaTag)
//  • Drift detection hooks (via overlay + CoreMemory)
//  • Governor‑aligned with CoreMemory v15 + CoreLayers v15
// ============================================================================

/*
AI_EXPERIENCE_META = {
  identity: "PulseCoreGovernor",
  version: "v15-IMMORTAL-GOVERNOR",
  layer: "corememory_governor",
  role: "corememory_governor",
  lineage: "PulseCoreMemory-v15-IMMORTAL",

  evo: {
    governor: true,
    memoryPolicy: true,
    memoryPhysicsRules: true,
    adapterOrchestration: true,

    symbolicPrimary: true,
    binaryAware: true,
    dualBand: true,

    deterministic: true,
    driftProof: true,
    pureCompute: true,

    zeroMutationOfInput: true,
    zeroNetwork: true,
    zeroFilesystem: false // uses browser storage via CoreMemory
  },

  contract: {
    always: [
      "PulseCoreBrain",
      "PulseCoreEvolution",
      "PulseBinaryCoreOverlay"
    ],
    never: [
      "safeRoute",
      "fetchViaCNS"
    ]
  }
};
*/

import { CoreMemoryRole, createPulseCoreMemory } from "../PULSE-CORE/PulseCoreMemory.js";
import { CoreLayersRole, PulseCoreLayersOrgan } from "./PulseCoreLayers.js";

export const CoreGovernorRole = {
  type: "Organ",
  subsystem: "Core",
  layer: "Governor",
  identity: "PulseCoreGovernor",
  version: "15.0-IMMORTAL-GOVERNOR",

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
    versionAware: true,
    overlayAware: true,
    bandAware: true
  }
};

// ---------------------------------------------------------------------------
//  v15 IDENTITY BLOCK (MetaBlock)
// ---------------------------------------------------------------------------
export const CoreGovernorMetaBlock = {
  identity: "PulseCoreGovernor",
  subsystem: "Core",
  layer: "Governor",
  role: "Memory-Governor",
  version: "15.0-IMMORTAL-GOVERNOR",
  evo: CoreGovernorRole.evo
};

// deterministic governor epoch (no Date.now for identity)
let GOVERNOR_EPOCH = 0;
function nextGovernorEpoch() {
  GOVERNOR_EPOCH += 1;
  return GOVERNOR_EPOCH;
}

// ============================================================================
//  GOVERNOR CREATION — v15-IMMORTAL-GOVERNOR
// ============================================================================
export function createPulseCoreGovernor({
  primaryStorage = typeof window !== "undefined" ? window.localStorage : null,
  secondaryStorage = typeof window !== "undefined" ? window.sessionStorage : null,
  dnaTag = "default-dna",
  version = "15.0-IMMORTAL-GOVERNOR",
  overlay = null, // optional governor overlay (placement / promotion / drift lens)
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
    try {
      log("[PulseCoreGovernor-v15]", stage, JSON.stringify(details));
    } catch {
      // fail-open
    }
  }

  // -------------------------------------------------------------------------
  //  INTERNAL: GOVERNOR CONTEXT + OVERLAY HOOKS
  // -------------------------------------------------------------------------
  function buildGovernorContext() {
    return {
      dnaTag,
      version,
      epoch: nextGovernorEpoch(),
      coreMemoryVersion: CoreMemoryRole.version,
      coreLayersVersion: CoreLayersRole.version,
      overlayIdentity: overlay?.identity || null
    };
  }

  function applyOverlayPlacementHint({ routeId, key, dataType, placement }) {
    if (!overlay || typeof overlay.placementHint !== "function") return placement;
    try {
      const hint = overlay.placementHint({
        routeId,
        key,
        dataType,
        placement,
        dnaTag,
        version
      });
      return hint || placement;
    } catch (err) {
      warn("[PulseCoreGovernor-v15] OVERLAY_PLACEMENT_HINT_ERROR", String(err));
      return placement;
    }
  }

  function applyOverlayPromotionHint({ routeId, key, dataType, hits, promote }) {
    if (!overlay || typeof overlay.promotionHint !== "function") return promote;
    try {
      const hint = overlay.promotionHint({
        routeId,
        key,
        dataType,
        hits,
        promote,
        dnaTag,
        version
      });
      return typeof hint === "boolean" ? hint : promote;
    } catch (err) {
      warn("[PulseCoreGovernor-v15] OVERLAY_PROMOTION_HINT_ERROR", String(err));
      return promote;
    }
  }

  // -------------------------------------------------------------------------
  //  BOOT / PREWARM / HEAL
  // -------------------------------------------------------------------------
  function boot() {
    const ctx = buildGovernorContext();
    CoreMemory.prewarm();
    safeLog("BOOT", {
      ...ctx,
      primaryStorageAvailable: !!primaryStorage,
      secondaryStorageAvailable: !!secondaryStorage
    });
  }

  function healIfNeeded() {
    const ctx = buildGovernorContext();
    CoreMemory.prewarm();
    safeLog("HEAL_CHECK", ctx);
  }

  // -------------------------------------------------------------------------
  //  LAYER‑AWARE SET / GET (v15-IMMORTAL-GOVERNOR)
  // -------------------------------------------------------------------------
  function set(routeId, key, value, options = {}) {
    const dataType = options.dataType || "generic";
    const band = options.band || "symbolic";

    // Decide placement via CoreLayers rules
    let placement = PulseCoreLayerRules.decidePlacement(
      dataType,
      dnaTag,
      routeId
    );

    // Allow overlay to adjust placement (e.g., pin to band/layer)
    placement = applyOverlayPlacementHint({
      routeId,
      key,
      dataType,
      placement
    });

    // Delegate to CoreMemory
    CoreMemory.set(routeId, key, value, { band, dataType });

    safeLog("SET", {
      routeId,
      key,
      dataType,
      band,
      placement,
      dnaTag,
      version
    });
  }

  function get(routeId, key, options = {}) {
    const dataType = options.dataType || "generic";
    const band = options.band || "symbolic";

    const value = CoreMemory.get(routeId, key, { band, dataType });
    const hits = value !== undefined ? 1 : 0;

    let promote = PulseCoreLayerRules.shouldPromote({
      hits,
      dataType
    });

    // Allow overlay to influence promotion decision
    promote = applyOverlayPromotionHint({
      routeId,
      key,
      dataType,
      hits,
      promote
    });

    if (promote) {
      safeLog("PROMOTE_HINT", { routeId, key, dataType, band });
    }

    return value;
  }

  // -------------------------------------------------------------------------
  //  SNAPSHOTS / ROUTE‑LEVEL CONTROL
  // -------------------------------------------------------------------------
  function getRouteSnapshot(routeId) {
    const snapshot = CoreMemory.getRouteSnapshot(routeId);
    safeLog("GET_ROUTE_SNAPSHOT", { routeId });
    return snapshot;
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
    const cacheData = CoreMemory.Cache?.data || {};
    safeLog("FLUSH", {
      routes: Object.keys(cacheData).length
    });
  }

  // -------------------------------------------------------------------------
  //  LOOP THEORY INTROSPECTION
  // -------------------------------------------------------------------------
  function getHotKeys(minHits = 3) {
    const keys = CoreMemory.getHotKeys(minHits);
    safeLog("HOT_KEYS", { minHits, count: keys.length });
    return keys;
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
    version,
    overlay
  };

  safeLog("INIT", {
    identity: CoreGovernorRole.identity,
    version: CoreGovernorRole.version,
    dnaTag,
    overlayAware: !!overlay
  });

  return PulseCoreGovernor;
}
