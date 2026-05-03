// ============================================================================
//  PulseCoreBrain.js — v15-IMMORTAL-BRAIN
//  ORGANISM‑WIDE PATTERN INTELLIGENCE ENGINE
//  “THINK ONCE. REUSE FOREVER. NEVER DRIFT.”
//  • v15 AI_EXPERIENCE_META (IMMORTAL identity)
//  • dnaTag + version aware
//  • presence / band / route aware (via meta + overlay)
//  • lineage + ancestry
//  • advantage scoring (band + route + dnaTag)
//  • dual‑band metadata alignment
//  • CoreMemory persistence (route‑scoped)
//  • deterministic canonicalization (structural)
// ============================================================================

/*
AI_EXPERIENCE_META = {
  identity: "PulseCoreBrain",
  version: "v15-IMMORTAL-BRAIN",
  layer: "corememory_brain",
  role: "corememory_symbolic_brain",
  lineage: "PulseCoreMemory-v15-IMMORTAL",

  evo: {
    symbolicPrimary: true,
    binaryAware: true,
    dualBand: true,

    memoryShaping: true,
    memoryPhysics: true,
    overlayManagement: true,
    hydrationPlanning: true,

    deterministic: true,
    driftProof: true,
    pureCompute: true,

    zeroMutationOfInput: true,
    zeroNetwork: true,
    zeroFilesystem: true
  },

  contract: {
    always: [
      "PulseBinaryCoreOverlay",
      "PulseCoreEvolution",
      "PulseCoreGovernor"
    ],
    never: [
      "safeRoute",
      "fetchViaCNS"
    ]
  }
};
*/

export const CoreBrainRole = {
  type: "Organ",
  subsystem: "Core",
  layer: "Brain",
  identity: "PulseCoreBrain",
  version: "15.0-IMMORTAL-BRAIN",

  evo: {
    deterministic: true,
    binaryNative: true,
    routeAware: true,
    dnaAware: true,
    governorAligned: true,
    memoryAligned: true,
    presenceAware: true,
    versionAware: true,
    lineageAware: true,
    advantageAware: true,
    bandAware: true,
    overlayAware: true
  }
};

// ---------------------------------------------------------------------------
//  v15 IDENTITY BLOCK (MetaBlock)
// ---------------------------------------------------------------------------
export const CoreBrainMetaBlock = {
  identity: "PulseCoreBrain",
  subsystem: "Core",
  layer: "Brain",
  role: "Pattern-Intelligence",
  version: "15.0-IMMORTAL-BRAIN",
  evo: CoreBrainRole.evo
};

// ---------------------------------------------------------------------------
//  SIMPLE HASH / ID HELPERS (STRUCTURAL, NOT CRYPTO)
// ---------------------------------------------------------------------------
function simpleHash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) | 0;
  }
  return "patt-" + (h >>> 0).toString(16);
}

function normalizeStructure(struct) {
  try {
    return JSON.stringify(struct, Object.keys(struct).sort());
  } catch {
    return JSON.stringify(struct || {});
  }
}

// deterministic epoch for pattern creation (no Date.now in identity)
let BRAIN_EPOCH = 0;
function nextBrainEpoch() {
  BRAIN_EPOCH += 1;
  return BRAIN_EPOCH;
}

// ---------------------------------------------------------------------------
//  CREATE BRAIN (v15-IMMORTAL-BRAIN)
// ---------------------------------------------------------------------------
export function createPulseCoreBrain({
  dnaTag = "default-dna",
  version = "15.0-IMMORTAL-BRAIN",
  overlay = null,
  coreMemory = null,
  coreMemoryRouteId = "brain-patterns",
  log = console.log,
  warn = console.warn
} = {}) {

  const Patterns = {
    byId: Object.create(null),
    index: Object.create(null)
  };

  function safeLog(stage, details = {}) {
    try { log("[PulseCoreBrain-v15]", stage, JSON.stringify(details)); }
    catch {}
  }

  // -------------------------------------------------------------------------
  //  INTERNAL: ADVANTAGE SCORING (v15)
  //  • dnaTag match
  //  • non-global route
  //  • type awareness
  //  • band awareness
  //  • overlay hint (optional)
  // -------------------------------------------------------------------------
  function scorePattern(meta) {
    let score = 0;

    if (meta.dnaTag === dnaTag) score += 2;
    if (meta.routeId && meta.routeId !== "global") score += 1;
    if (meta.type) score += 1;
    if (meta.band === "binary") score += 1;

    if (overlay && typeof overlay.scorePattern === "function") {
      try {
        const overlayScore = overlay.scorePattern(meta);
        if (typeof overlayScore === "number") {
          score += overlayScore;
        }
      } catch (err) {
        warn("[PulseCoreBrain-v15] OVERLAY_SCORE_ERROR", String(err));
      }
    }

    return score;
  }

  // -------------------------------------------------------------------------
  //  INTERNAL: LINEAGE + ANCESTRY (v15)
// -------------------------------------------------------------------------
  function assignLineage(meta) {
    meta.lineage = `${dnaTag}:${version}:${meta.patternId}`;
    meta.ancestry = [dnaTag, version];
  }

  // -------------------------------------------------------------------------
  //  LOAD FROM CORE MEMORY (v15)
// -------------------------------------------------------------------------
  function loadFromCoreMemory() {
    if (!coreMemory) return;
    try {
      const snapshot = coreMemory.getRouteSnapshot(coreMemoryRouteId) || {};
      Patterns.byId = snapshot.byId || Object.create(null);
      Patterns.index = snapshot.index || Object.create(null);

      safeLog("LOAD_FROM_CORE_MEMORY", {
        patterns: Object.keys(Patterns.byId).length,
        routeId: coreMemoryRouteId
      });
    } catch (err) {
      warn("[PulseCoreBrain-v15] LOAD_FROM_CORE_MEMORY_ERROR", String(err));
    }
  }

  // -------------------------------------------------------------------------
  //  FLUSH TO CORE MEMORY (v15)
// -------------------------------------------------------------------------
  function flushToCoreMemory() {
    if (!coreMemory) return;
    try {
      const snapshot = {
        byId: Patterns.byId,
        index: Patterns.index
      };
      coreMemory.setRouteSnapshot(coreMemoryRouteId, snapshot);

      safeLog("FLUSH_TO_CORE_MEMORY", {
        patterns: Object.keys(Patterns.byId).length,
        routeId: coreMemoryRouteId
      });
    } catch (err) {
      warn("[PulseCoreBrain-v15] FLUSH_TO_CORE_MEMORY_ERROR", String(err));
    }
  }

  // -------------------------------------------------------------------------
  //  REGISTER PATTERN (v15-IMMORTAL)
// -------------------------------------------------------------------------
  function registerPattern(struct, meta = {}) {
    const normalized = normalizeStructure(struct || {});
    const existingId = Patterns.index[normalized];

    if (existingId) {
      const existing = Patterns.byId[existingId];
      return {
        patternId: existingId,
        canonical: existing.canonical,
        reused: true,
        meta: existing.meta
      };
    }

    const patternId = simpleHash(normalized);

    const band = meta.band || "symbolic";
    const routeId = meta.routeId || "global";

    const enrichedMeta = {
      ...meta,
      dnaTag,
      version,
      band,
      routeId,
      patternId,
      createdEpoch: nextBrainEpoch()
    };

    assignLineage(enrichedMeta);
    enrichedMeta.score = scorePattern(enrichedMeta);

    Patterns.index[normalized] = patternId;
    Patterns.byId[patternId] = {
      canonical: struct,
      meta: enrichedMeta
    };

    // Presence / overlay touch
    if (overlay && typeof overlay.touch === "function") {
      try { overlay.touch("brain", enrichedMeta.createdEpoch, enrichedMeta); }
      catch {}
    }

    safeLog("REGISTER_PATTERN", {
      patternId,
      score: enrichedMeta.score,
      band,
      routeId
    });

    return {
      patternId,
      canonical: struct,
      reused: false,
      meta: enrichedMeta
    };
  }

  // -------------------------------------------------------------------------
  //  LOOKUP
// -------------------------------------------------------------------------
  function getPattern(patternId) {
    return Patterns.byId[patternId] || null;
  }

  // -------------------------------------------------------------------------
  //  FORMULA REGISTRATION (v15)
// -------------------------------------------------------------------------
  function registerFormula(formulaStr, meta = {}) {
    return registerPattern(
      { type: "formula", value: formulaStr },
      meta
    );
  }

  // -------------------------------------------------------------------------
  //  CLEAR / RESET
// -------------------------------------------------------------------------
  function clearAll() {
    Patterns.byId = Object.create(null);
    Patterns.index = Object.create(null);
    flushToCoreMemory();
    safeLog("CLEAR_ALL", { routeId: coreMemoryRouteId });
  }

  // -------------------------------------------------------------------------
  //  PUBLIC API
// -------------------------------------------------------------------------
  const PulseCoreBrain = {
    CoreBrainRole,
    CoreBrainMetaBlock,
    Patterns,

    loadFromCoreMemory,
    flushToCoreMemory,

    registerPattern,
    getPattern,
    registerFormula,

    clearAll,

    dnaTag,
    version,
    overlay,
    coreMemoryRouteId
  };

  loadFromCoreMemory();

  safeLog("INIT", {
    identity: CoreBrainRole.identity,
    version: CoreBrainRole.version,
    dnaTag
  });

  return PulseCoreBrain;
}
