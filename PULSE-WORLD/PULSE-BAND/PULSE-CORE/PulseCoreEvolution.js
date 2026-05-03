// ============================================================================
//  PulseCoreEvolutions.js — v15-IMMORTAL-ADVANTAGE
//  ORGANISM‑WIDE EVOLUTION ENGINE
//  “KNOW EVERY ADVANTAGE. APPLY ONLY THE CORRECT ONE. NEVER DRIFT.”
//  • v15 AI_EXPERIENCE_META (IMMORTAL identity)
//  • dnaTag + version aware
//  • presence / band / route aware (via routeId + ancestry)
//  • dual‑band evolution logs (primary + secondary storage)
//  • lineage tracking (per evolution)
//  • ancestry tracking (dnaTag + version)
//  • drift detection (dna/version mismatch + TTL)
//  • healing via clear/reset + fallback band
//  • TTL (time‑bounded evolutions)
//  • advantage scoring (route, dna, recency, overlay hints)
//  • deterministic delta application (applyEvolutions)
// ============================================================================

/*
AI_EXPERIENCE_META = {
  identity: "PulseCoreEvolutions",
  version: "v15-IMMORTAL-ADVANTAGE",
  layer: "corememory_evolution",
  role: "corememory_evolution_engine",
  lineage: "PulseCoreMemory-v15-IMMORTAL",

  evo: {
    evolutionEngine: true,
    versionMigration: true,
    dnaTagging: true,
    hotLoopPromotion: true,
    healingLogic: true,

    symbolicPrimary: true,
    binaryAware: true,
    dualBand: true,

    deterministic: true,
    driftProof: true,
    pureCompute: true,

    zeroMutationOfInput: true,
    zeroNetwork: true,
    zeroFilesystem: false, // uses browser storage bands explicitly
    zeroRandomnessInCore: true
  },

  contract: {
    always: [
      "PulseCoreBrain",
      "PulseBinaryCoreOverlay",
      "PulseCoreGovernor"
    ],
    never: [
      "safeRoute",
      "fetchViaCNS"
    ]
  }
};
*/

// ---------------------------------------------------------------------------
//  ROLE / META — v15-IMMORTAL-ADVANTAGE
// ---------------------------------------------------------------------------
export const CoreEvolutionsRole = {
  type: "Organ",
  subsystem: "Core",
  layer: "Evolution",
  identity: "PulseCoreEvolutions",
  version: "15.0-IMMORTAL-ADVANTAGE",

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
    ttlAware: true,
    overlayAware: true,
    bandAware: true
  }
};

// ---------------------------------------------------------------------------
//  v15 IDENTITY BLOCK (MetaBlock)
// ---------------------------------------------------------------------------
export const CoreEvolutionsMetaBlock = {
  identity: "PulseCoreEvolutions",
  subsystem: "Core",
  layer: "Evolution",
  role: "Evolution-Engine",
  version: "15.0-IMMORTAL-ADVANTAGE",
  evo: CoreEvolutionsRole.evo
};

// ---------------------------------------------------------------------------
//  STORAGE KEYS (PRIMARY + SECONDARY)
// ---------------------------------------------------------------------------
const EVO_PRIMARY = "pulse-core-evolutions-v15-primary";
const EVO_SECONDARY = "pulse-core-evolutions-v15-secondary";

// TTL for evolutions (7 days) — still time‑bounded, but explicit
const EVO_TTL_MS = 7 * 24 * 60 * 60 * 1000;

// deterministic epoch counter (no reliance on Date.now for identity)
let EVO_EPOCH_COUNTER = 0;
function nextEpoch() {
  EVO_EPOCH_COUNTER += 1;
  return EVO_EPOCH_COUNTER;
}

// ---------------------------------------------------------------------------
//  CREATE EVOLUTION ENGINE — v15-IMMORTAL-ADVANTAGE
// ---------------------------------------------------------------------------
export function createPulseCoreEvolutions({
  primaryStorage = typeof window !== "undefined" ? window.localStorage : null,
  secondaryStorage = typeof window !== "undefined" ? window.sessionStorage : null,
  dnaTag = "default-dna",
  version = "15.0-IMMORTAL-ADVANTAGE",
  overlay = null, // optional evolution overlay (lens / filter / transformer)
  log = console.log,
  warn = console.warn
} = {}) {

  const Evolutions = {
    loaded: false,
    list: [], // { id, dnaTag, routeId, delta, timestamp, lineage, ancestry, score, band, ttlMs }
    lastLoadEpoch: 0,
    lastApplyEpoch: 0,
    fallbackUsed: false,
    lastDriftFilteredCount: 0,
    lastExpiredFilteredCount: 0
  };

  function safeLog(stage, details = {}) {
    try {
      log("[PulseCoreEvolutions-v15]", stage, JSON.stringify(details));
    } catch {
      // fail-open
    }
  }

  // -------------------------------------------------------------------------
  //  INTERNAL: ADVANTAGE SCORING (v15-IMMORTAL-ADVANTAGE)
  //  Uses dnaTag, routeId, delta richness, recency, overlay hints, band
  // -------------------------------------------------------------------------
  function scoreEvolution(evo, nowMs) {
    let score = 0;

    // dna alignment
    if (evo.dnaTag === dnaTag) score += 3;

    // route specificity (non-global routes are more targeted)
    if (evo.routeId && evo.routeId !== "global") score += 2;

    // delta richness
    if (evo.delta && typeof evo.delta === "object") {
      const keys = Object.keys(evo.delta);
      if (keys.length > 0) score += 1;
      if (keys.length > 3) score += 1;
    }

    // recency (younger evolutions get a small boost)
    if (typeof evo.timestamp === "number" && typeof nowMs === "number") {
      const ageMs = nowMs - evo.timestamp;
      if (ageMs < EVO_TTL_MS / 4) score += 1;
    }

    // overlay hints (if overlay provides scoring hints)
    if (overlay && typeof overlay.scoreHint === "function") {
      try {
        const hint = overlay.scoreHint(evo) || 0;
        score += Number(hint) || 0;
      } catch {
        // ignore overlay scoring errors
      }
    }

    // band awareness (if present)
    if (evo.band === "binary") score += 1;
    if (evo.band === "symbolic") score += 0.5;

    return score;
  }

  // -------------------------------------------------------------------------
  //  INTERNAL: LINEAGE + ANCESTRY (v15)
  // -------------------------------------------------------------------------
  function assignLineage(evo) {
    const epoch = nextEpoch();
    evo.lineage = `${dnaTag}:${version}:${evo.id}:${epoch}`;
    evo.ancestry = [dnaTag, version];
    evo.band = evo.band || "symbolic"; // default band if not provided
  }

  // -------------------------------------------------------------------------
  //  INTERNAL: DRIFT + TTL FILTERING (v15)
// -------------------------------------------------------------------------
  function filterValidEvolutions(list, nowMs) {
    const valid = [];
    let driftFiltered = 0;
    let expiredFiltered = 0;

    for (const e of list) {
      // TTL
      if (typeof e.timestamp === "number" && nowMs - e.timestamp >= EVO_TTL_MS) {
        expiredFiltered++;
        continue;
      }

      // dna/version drift
      const dnaMatch = e.dnaTag === dnaTag;
      const versionMatch = Array.isArray(e.ancestry)
        ? e.ancestry.includes(version)
        : e.version === version;

      if (!dnaMatch || !versionMatch) {
        driftFiltered++;
        continue;
      }

      valid.push(e);
    }

    Evolutions.lastDriftFilteredCount = driftFiltered;
    Evolutions.lastExpiredFilteredCount = expiredFiltered;

    return valid;
  }

  // -------------------------------------------------------------------------
  //  LOAD (DUALBAND + FALLBACK + TTL + VERSION + DNA + DRIFT)
// -------------------------------------------------------------------------
  function load() {
    const nowMs = Date.now();
    let loadedList = [];
    let usedFallback = false;

    try {
      if (primaryStorage) {
        const rawPrimary = primaryStorage.getItem(EVO_PRIMARY);
        if (rawPrimary) {
          const list = JSON.parse(rawPrimary);
          loadedList = list;
          usedFallback = false;
          safeLog("LOAD_PRIMARY_OK", { count: list.length });
        }
      }

      if (!loadedList.length && secondaryStorage) {
        const rawSecondary = secondaryStorage.getItem(EVO_SECONDARY);
        if (rawSecondary) {
          const list = JSON.parse(rawSecondary);
          loadedList = list;
          usedFallback = true;
          safeLog("LOAD_SECONDARY_OK", { count: list.length });
        }
      }

      if (!loadedList.length) {
        Evolutions.loaded = true;
        Evolutions.list = [];
        Evolutions.fallbackUsed = false;
        Evolutions.lastLoadEpoch = nextEpoch();
        safeLog("LOAD_EMPTY");
        return;
      }

      const filtered = filterValidEvolutions(loadedList, nowMs);

      // recompute scores with v15 scoring
      for (const evo of filtered) {
        evo.score = scoreEvolution(evo, nowMs);
      }

      Evolutions.list = filtered;
      Evolutions.loaded = true;
      Evolutions.fallbackUsed = usedFallback;
      Evolutions.lastLoadEpoch = nextEpoch();

      safeLog("LOAD_DONE", {
        count: Evolutions.list.length,
        fallbackUsed: Evolutions.fallbackUsed,
        driftFiltered: Evolutions.lastDriftFilteredCount,
        expiredFiltered: Evolutions.lastExpiredFilteredCount
      });
    } catch (err) {
      warn("[PulseCoreEvolutions-v15] LOAD_ERROR", String(err));
    }
  }

  // -------------------------------------------------------------------------
  //  FLUSH (WRITE TO BOTH BANDS)
// -------------------------------------------------------------------------
  function flush() {
    try {
      const json = JSON.stringify(Evolutions.list);

      if (primaryStorage) {
        primaryStorage.setItem(EVO_PRIMARY, json);
      }
      if (secondaryStorage) {
        secondaryStorage.setItem(EVO_SECONDARY, json);
      }

      safeLog("FLUSH_OK", { count: Evolutions.list.length });
    } catch (err) {
      warn("[PulseCoreEvolutions-v15] FLUSH_ERROR", String(err));
    }
  }

  // -------------------------------------------------------------------------
  //  REGISTER EVOLUTION (v15-IMMORTAL-ADVANTAGE)
// -------------------------------------------------------------------------
  function registerEvolution({ id, routeId, delta, band = "symbolic" }) {
    if (!id || !delta || typeof delta !== "object") {
      warn("[PulseCoreEvolutions-v15] INVALID_EVOLUTION", { id, routeId });
      return;
    }

    const nowMs = Date.now();

    const evo = {
      id,
      dnaTag,
      routeId: routeId || "global",
      delta,
      timestamp: nowMs,
      band,
      ttlMs: EVO_TTL_MS
    };

    assignLineage(evo);
    evo.score = scoreEvolution(evo, nowMs);

    Evolutions.list.push(evo);
    safeLog("REGISTER", {
      id: evo.id,
      routeId: evo.routeId,
      band: evo.band,
      score: evo.score,
      lineage: evo.lineage
    });
  }

  // -------------------------------------------------------------------------
  //  APPLY EVOLUTIONS (v15-IMMORTAL-ADVANTAGE)
// -------------------------------------------------------------------------
  function applyEvolutions(applyFn) {
    if (typeof applyFn !== "function") {
      warn("[PulseCoreEvolutions-v15] APPLY_FN_REQUIRED");
      return;
    }

    // sort by score descending, then by timestamp ascending (stable preference)
    const sorted = [...Evolutions.list].sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return (a.timestamp || 0) - (b.timestamp || 0);
    });

    for (const evo of sorted) {
      try {
        let effectiveDelta = evo.delta;

        // overlay can transform or veto evolutions
        if (overlay && typeof overlay.transform === "function") {
          try {
            const transformed = overlay.transform(evo);
            if (transformed === null) {
              safeLog("APPLY_SKIPPED_BY_OVERLAY", { id: evo.id });
              continue;
            }
            if (typeof transformed === "object") {
              effectiveDelta = transformed;
            }
          } catch (err) {
            warn("[PulseCoreEvolutions-v15] OVERLAY_TRANSFORM_ERROR", String(err));
          }
        }

        applyFn({
          id: evo.id,
          routeId: evo.routeId,
          dnaTag: evo.dnaTag,
          band: evo.band,
          lineage: evo.lineage,
          ancestry: evo.ancestry,
          score: evo.score,
          delta: effectiveDelta
        });
      } catch (err) {
        warn("[PulseCoreEvolutions-v15] APPLY_ERROR", {
          evoId: evo.id,
          error: String(err)
        });
      }
    }

    Evolutions.lastApplyEpoch = nextEpoch();
    safeLog("APPLY_DONE", { count: sorted.length });
  }

  // -------------------------------------------------------------------------
  //  CLEAR / RESET
// -------------------------------------------------------------------------
  function clearAll() {
    Evolutions.list = [];
    Evolutions.fallbackUsed = false;
    Evolutions.lastDriftFilteredCount = 0;
    Evolutions.lastExpiredFilteredCount = 0;
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
    version,
    overlay
  };

  load();

  safeLog("INIT", {
    identity: CoreEvolutionsRole.identity,
    version: CoreEvolutionsRole.version,
    dnaTag,
    overlayAware: !!overlay
  });

  return PulseCoreEvolutions;
}
