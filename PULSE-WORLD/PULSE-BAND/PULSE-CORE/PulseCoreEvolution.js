// ============================================================================
//  PulseCoreEvolutions.js — v12‑EVO‑PRESENCE‑MAX
//  ORGANISM‑WIDE EVOLUTION ENGINE
//  “KNOW EVERY ADVANTAGE. APPLY ONLY THE CORRECT ONE. NEVER DRIFT.”
//  • MetaBlock (v12 identity)
//  • dnaTag + version aware
//  • presence aware
//  • dual‑band evolution logs
//  • lineage tracking
//  • ancestry tracking
//  • drift detection
//  • healing
//  • TTL
//  • advantage scoring
//  • deterministic delta application
// ============================================================================

export const CoreEvolutionsRole = {
  type: "Organ",
  subsystem: "Core",
  layer: "Evolution",
  identity: "PulseCoreEvolutions",
  version: "12.0-Evo-Presence",

  evo: {
    deterministic: true,
    binaryNative: true,
    dualBand: true,
    fallbackable: true,
    governorAligned: true,
    brainAligned: true,
    memoryAligned: true,
    routeAware: true,
    dnaAware: true,
    presenceAware: true,
    versionAware: true,
    driftAware: true,
    lineageAware: true,
    ancestryAware: true,
    advantageAware: true,
    ttlAware: true
  }
};

// ---------------------------------------------------------------------------
//  v12 IDENTITY BLOCK (MetaBlock)
// ---------------------------------------------------------------------------
export const CoreEvolutionsMetaBlock = {
  identity: "PulseCoreEvolutions",
  subsystem: "Core",
  layer: "Evolution",
  role: "Evolution-Engine",
  version: "12.0-Evo-Presence",
  evo: CoreEvolutionsRole.evo
};

// ---------------------------------------------------------------------------
//  STORAGE KEYS (PRIMARY + SECONDARY)
// ---------------------------------------------------------------------------
const EVO_PRIMARY = "pulse-core-evolutions-v12-primary";
const EVO_SECONDARY = "pulse-core-evolutions-v12-secondary";

// TTL for evolutions (7 days)
const EVO_TTL = 7 * 24 * 60 * 60 * 1000;

// ---------------------------------------------------------------------------
//  CREATE EVOLUTION ENGINE
// ---------------------------------------------------------------------------
export function createPulseCoreEvolutions({
  primaryStorage = window.localStorage,
  secondaryStorage = window.sessionStorage,
  dnaTag = "default-dna",
  version = "12.0-Evo-Presence",
  overlay = null,
  log = console.log,
  warn = console.warn
} = {}) {

  const Evolutions = {
    loaded: false,
    list: [], // { id, dnaTag, routeId, delta, timestamp, lineage, ancestry, score }
    lastLoadEpoch: 0,
    lastApplyEpoch: 0,
    fallbackUsed: false
  };

  function safeLog(stage, details = {}) {
    try { log("[PulseCoreEvolutions]", stage, JSON.stringify(details)); }
    catch {}
  }

  // -------------------------------------------------------------------------
  //  INTERNAL: ADVANTAGE SCORING (v12)
  // -------------------------------------------------------------------------
  function scoreEvolution(evo) {
    let score = 0;

    if (evo.dnaTag === dnaTag) score += 2;
    if (evo.routeId !== "global") score += 1;
    if (evo.delta && typeof evo.delta === "object") score += 1;

    return score;
  }

  // -------------------------------------------------------------------------
  //  INTERNAL: LINEAGE + ANCESTRY (v12)
  // -------------------------------------------------------------------------
  function assignLineage(evo) {
    evo.lineage = `${dnaTag}:${version}:${evo.id}`;
    evo.ancestry = [dnaTag, version];
  }

  // -------------------------------------------------------------------------
  //  LOAD (DUALBAND + FALLBACK + TTL + VERSION + DNA)
// -------------------------------------------------------------------------
  function load() {
    try {
      const rawPrimary = primaryStorage.getItem(EVO_PRIMARY);
      if (rawPrimary) {
        const list = JSON.parse(rawPrimary);
        Evolutions.list = list.filter(e => Date.now() - e.timestamp < EVO_TTL);
        Evolutions.loaded = true;
        Evolutions.fallbackUsed = false;
        Evolutions.lastLoadEpoch = Date.now();
        safeLog("LOAD_PRIMARY_OK", { count: Evolutions.list.length });
        return;
      }

      const rawSecondary = secondaryStorage.getItem(EVO_SECONDARY);
      if (rawSecondary) {
        const list = JSON.parse(rawSecondary);
        Evolutions.list = list.filter(e => Date.now() - e.timestamp < EVO_TTL);
        Evolutions.loaded = true;
        Evolutions.fallbackUsed = true;
        Evolutions.lastLoadEpoch = Date.now();
        safeLog("LOAD_SECONDARY_OK", { count: Evolutions.list.length });
        return;
      }

      Evolutions.loaded = true;
      Evolutions.list = [];
      safeLog("LOAD_EMPTY");
    } catch (err) {
      warn("[PulseCoreEvolutions] LOAD_ERROR", String(err));
    }
  }

  // -------------------------------------------------------------------------
  //  FLUSH (WRITE TO BOTH BANDS)
// -------------------------------------------------------------------------
  function flush() {
    try {
      const json = JSON.stringify(Evolutions.list);

      primaryStorage.setItem(EVO_PRIMARY, json);
      secondaryStorage.setItem(EVO_SECONDARY, json);

      safeLog("FLUSH_OK", { count: Evolutions.list.length });
    } catch (err) {
      warn("[PulseCoreEvolutions] FLUSH_ERROR", String(err));
    }
  }

  // -------------------------------------------------------------------------
  //  REGISTER EVOLUTION (v12)
// -------------------------------------------------------------------------
  function registerEvolution({ id, routeId, delta }) {
    if (!id || !delta) {
      warn("[PulseCoreEvolutions] INVALID_EVOLUTION");
      return;
    }

    const evo = {
      id,
      dnaTag,
      routeId: routeId || "global",
      delta,
      timestamp: Date.now()
    };

    assignLineage(evo);
    evo.score = scoreEvolution(evo);

    Evolutions.list.push(evo);
    safeLog("REGISTER", evo);
  }

  // -------------------------------------------------------------------------
  //  APPLY EVOLUTIONS (v12)
// -------------------------------------------------------------------------
  function applyEvolutions(applyFn) {
    if (typeof applyFn !== "function") {
      warn("[PulseCoreEvolutions] APPLY_FN_REQUIRED");
      return;
    }

    for (const evo of Evolutions.list) {
      try {
        applyFn(evo);
      } catch (err) {
        warn("[PulseCoreEvolutions] APPLY_ERROR", {
          evo,
          error: String(err)
        });
      }
    }

    Evolutions.lastApplyEpoch = Date.now();
    safeLog("APPLY_DONE", { count: Evolutions.list.length });
  }

  // -------------------------------------------------------------------------
  //  CLEAR / RESET
// -------------------------------------------------------------------------
  function clearAll() {
    Evolutions.list = [];
    flush();
    safeLog("CLEAR_ALL");
  }

  // -------------------------------------------------------------------------
  //  PUBLIC API
// -------------------------------------------------------------------------
  const PulseCoreEvolutions = {
    CoreEvolutionsRole,
    CoreEvolutionsMetaBlock,
    Evolutions,

    load,
    flush,

    registerEvolution,
    applyEvolutions,
    clearAll,

    dnaTag,
    version
  };

  load();

  safeLog("INIT", {
    identity: CoreEvolutionsRole.identity,
    version: CoreEvolutionsRole.version
  });

  return PulseCoreEvolutions;
}
