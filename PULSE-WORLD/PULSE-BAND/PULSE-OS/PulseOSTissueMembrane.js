/* global log,error */
// ============================================================================
// FILE: /PulseOS/PULSE-OS/PulseOSTissueMembrane.js
// PULSE OS — v10.1 → v12.3-Presence
// “THE TISSUE MEMBRANE / MID‑LAYER EPITHELIAL REFLEX”
// A2 REFLEX LAYER • MID‑LAYER SENTINEL • ZERO TIMING • ZERO STATE
// ============================================================================
//
// v12.3+ PRESENCE / PREWARM / MULTI-PRESENCE UPGRADE:
//   ✔ Zero timing (no Date.now → deterministic seq counter)
//   ✔ Zero global mutation (no PulseOSBrain.* writes)
//   ✔ Guarded window access (environment‑agnostic)
//   ✔ Deterministic route memory (now presence‑band aware)
//   ✔ Prewarmable route cache (pure, deterministic)
//   ✔ Chunked route memory snapshot for diagnostics / presence overlays
//   ✔ Preserve ALL abilities (degradation, DNA, healing, trace)
//   ✔ No compute, no payload mutation, no scheduling
//   ✔ Dual‑band + presence awareness via __band tagging
// ============================================================================
/*
AI_EXPERIENCE_META = {
  identity: "PulseOSTissueMembrane",
  version: "v14-IMMORTAL",
  layer: "membrane",
  role: "os_tissue_membrane",
  lineage: "PulseOS-v14",

  evo: {
    membrane: true,
    tissueBarrier: true,
    reflexFilter: true,

    deterministic: true,
    driftProof: true,
    zeroNetwork: true,
    zeroFilesystem: true,
    zeroMutationOfInput: true,

    safeRouteFree: true,
    metadataOnly: true
  },

  contract: {
    always: [
      "PulseOSMucusMembrane",
      "PulseOSOrganMembrane"
    ],
    never: [
      "legacyTissueMembrane",
      "safeRoute",
      "fetchViaCNS"
    ]
  }
}
*/

// ============================================================================
// ORGAN IDENTITY — v12.3-PRESENCE (A2 Tissue Membrane)
// ============================================================================
export const PulseRole = {
  type: "Barrier",
  subsystem: "PulseOSTissueMembrane",
  layer: "A2-TissueReflex",
  version: "12.3-Evo-Presence",
  identity: "PulseOSTissueMembrane-v12.3-Evo-Presence",

  evo: {
    // Core invariants
    driftProof: true,
    deterministicField: true,
    unifiedAdvantageField: true,
    futureEvolutionReady: true,

    // Reflex + membrane laws
    zeroTiming: true,
    zeroState: true,
    zeroMutation: true,
    zeroCompute: true,
    zeroRoutingInfluence: true,
    zeroAsync: true,
    zeroRandomness: true,

    // Dualband + presence metadata
    dualBand: true,
    binaryAware: true,
    symbolicAware: true,
    bandNormalizationAware: true,
    presenceAware: true,
    multiPresenceReady: true,

    // Reflex lineage
    membraneLayer: "A2",
    epithelialReflex: true,
    healingTriggerOnly: true,
    degradationAnnotator: true,
    dnaTagger: true,

    // Environment + safety
    guardedWindowAccess: true,
    environmentAgnostic: true,
    multiInstanceReady: true,

    // Prewarm / cache / chunk
    prewarmCacheAware: true,
    chunkedRouteMemory: true
  }
};

export const PulseOSTissueMembraneMeta = Object.freeze({
  layer: "PulseOSTissueMembrane",
  role: "A2_TISSUE_REFLEX_MEMBRANE",
  version: "v12.3-EVO-PRESENCE",
  identity: "PulseOSTissueMembrane-v12.3-EVO-PRESENCE",

  guarantees: Object.freeze({
    deterministic: true,
    driftProof: true,
    multiInstanceReady: true,

    // Membrane laws
    epithelialReflex: true,
    tissueLevelBarrier: true,
    midLayerSentinel: true,
    healingTriggerOnly: true,
    degradationAnnotator: true,
    dnaTagger: true,
    oneWayReflex: true,

    // Safety prohibitions
    zeroTiming: true,
    zeroState: true,
    zeroMutation: true,
    zeroCompute: true,
    zeroRoutingInfluence: true,
    zeroAsync: true,
    zeroRandomness: true,
    zeroUserCode: true,
    zeroDynamicImports: true,
    zeroEval: true,

    // Awareness
    symbolicAware: true,
    binaryAware: true,
    dualBandAware: true,
    presenceBandAware: true,
    bandNormalizationAware: true,
    environmentAgnostic: true,
    guardedWindowAccess: true,

    // Prewarm / cache / chunk
    prewarmCacheAware: true,
    chunkedRouteMemory: true,

    // Environment
    worldLensAware: false
  }),

  contract: Object.freeze({
    input: [
      "MidLayerErrorEvent",
      "MidLayerContext",
      "DualBandContext"
    ],
    output: [
      "TissueReflexEvent",
      "TissueMembraneDiagnostics",
      "TissueMembraneSignatures",
      "TissueMembraneHealingState"
    ]
  }),

  lineage: Object.freeze({
    root: "PulseOS-v12-EVO",
    parent: "PulseOS-v12.3-EVO-PRESENCE",
    ancestry: [
      "PulseOSTissueMembrane-v9",
      "PulseOSTissueMembrane-v10",
      "PulseOSTissueMembrane-v11",
      "PulseOSTissueMembrane-v11-Evo",
      "PulseOSTissueMembrane-v11-Evo-Prime",
      "PulseOSTissueMembrane-v12.3-Evo-Presence"
    ]
  }),

  bands: Object.freeze({
    supported: ["symbolic", "binary", "presence"],
    default: "symbolic",
    behavior: "tissue-reflex"
  }),

  architecture: Object.freeze({
    pattern: "A-B-A",
    baseline: "mid-layer error → reflex classification → healing trigger",
    adaptive: "binary/presence-tagged reflex surfaces",
    return: "deterministic tissue reflex event + signatures"
  })
});

// ============================================================================
// LAYER CONSTANTS + DIAGNOSTICS (v12.3‑safe)
// ============================================================================
const hasWindow = typeof window !== "undefined";

const LAYER_ID   = "LAYER-REFLEX";
const LAYER_NAME = "THE TISSUE MEMBRANE";
const LAYER_ROLE = "MID-LAYER ERROR GUARDIAN & HEALING TRIGGER";
const LAYER_VER  = "12.3-Presence";

const LAYER_DIAGNOSTICS_ENABLED =
  hasWindow &&
  (window.PULSE_LAYER_DIAGNOSTICS === "true" ||
   window.PULSE_DIAGNOSTICS === "true");

const logLayer = (stage, details = {}) => {
  if (!LAYER_DIAGNOSTICS_ENABLED) return;
  if (typeof log !== "function") return;

  log(
    JSON.stringify({
      pulseLayer: LAYER_ID,
      pulseName:  LAYER_NAME,
      pulseRole:  LAYER_ROLE,
      pulseVer:   LAYER_VER,
      stage,
      ...details
    })
  );
};


// ============================================================================
// DUAL‑BAND + PRESENCE CONSTANTS
// ============================================================================
const ROUTE_BANDS = {
  SYMBOLIC: "symbolic",
  BINARY: "binary",
  PRESENCE: "presence"
};

function normalizeBand(band) {
  const b = (band || ROUTE_BANDS.SYMBOLIC).toLowerCase();
  if (b === ROUTE_BANDS.BINARY) return ROUTE_BANDS.BINARY;
  if (b === ROUTE_BANDS.PRESENCE) return ROUTE_BANDS.PRESENCE;
  return ROUTE_BANDS.SYMBOLIC;
}


// ============================================================================
// ROUTE MEMORY — deterministic, zero timing, DNA tagging + presence-aware
// ============================================================================

// deterministic sequence counter (replaces Date.now)
let tissueSeq = 0;

const LayerRouteMemory = {
  store: {},

  makeKey(message, frames, band = ROUTE_BANDS.SYMBOLIC) {
    const top = frames[0] || "NO_FRAME";
    return message + "::" + top + "::" + normalizeBand(band);
  },

  classifyTier(healthScore) {
    const h = typeof healthScore === "number" ? healthScore : 1.0;

    if (h >= 0.95) return "microDegrade";
    if (h >= 0.85) return "softDegrade";
    if (h >= 0.50) return "midDegrade";
    if (h >= 0.15) return "hardDegrade";
    return "criticalDegrade";
  },

  remember(message, frames, routeTrace, overrides = {}) {
    const band = normalizeBand(overrides.band);
    const key = this.makeKey(message, frames, band);
    const baseHealth = overrides.healthScore ?? 1.0;
    const tier = this.classifyTier(baseHealth);

    this.store[key] = {
      seq: ++tissueSeq,          // deterministic, zero timing
      message,
      frames,
      routeTrace,
      degraded: !!overrides.degraded,
      healthScore: baseHealth,
      tier,
      band,
      dnaTag: band === ROUTE_BANDS.PRESENCE ? "A2_TISSUE_PRESENCE" : "A2_TISSUE",
      ...overrides
    };

    logLayer("ROUTE_MEMORY_SAVED", {
      key,
      frames: frames.length,
      degraded: this.store[key].degraded,
      healthScore: this.store[key].healthScore,
      tier: this.store[key].tier,
      band: this.store[key].band,
      dnaTag: this.store[key].dnaTag
    });
  },

  markDegraded(message, frames, healthScore = 0.85, band = ROUTE_BANDS.SYMBOLIC) {
    const key = this.makeKey(message, frames, band);
    const entry = this.store[key];
    if (!entry) return;

    entry.degraded = true;
    entry.healthScore = healthScore;
    entry.tier = this.classifyTier(healthScore);
    entry.band = normalizeBand(band);
    entry.dnaTag =
      entry.band === ROUTE_BANDS.PRESENCE
        ? "A2_TISSUE_PRESENCE_DEGRADED"
        : "A2_TISSUE_DEGRADED";

    logLayer("ROUTE_MEMORY_DEGRADED", {
      key,
      healthScore,
      tier: entry.tier,
      band: entry.band,
      dnaTag: entry.dnaTag
    });
  },

  recall(message, frames, band = ROUTE_BANDS.SYMBOLIC) {
    const key = this.makeKey(message, frames, band);
    const entry = this.store[key];
    if (!entry) return null;

    logLayer("ROUTE_MEMORY_HIT", {
      key,
      frames: entry.frames.length,
      degraded: entry.degraded,
      healthScore: entry.healthScore,
      tier: entry.tier,
      band: entry.band,
      dnaTag: entry.dnaTag
    });

    return entry.routeTrace;
  },

  getEntry(message, frames, band = ROUTE_BANDS.SYMBOLIC) {
    const key = this.makeKey(message, frames, band);
    return this.store[key] || null;
  },

  snapshot() {
    // Pure structural snapshot for diagnostics / presence overlays
    const entries = Object.keys(this.store)
      .sort((a, b) => this.store[a].seq - this.store[b].seq)
      .map((key) => {
        const e = this.store[key];
        return {
          key,
          seq: e.seq,
          degraded: e.degraded,
          healthScore: e.healthScore,
          tier: e.tier,
          band: e.band,
          dnaTag: e.dnaTag,
          framesCount: e.frames.length
        };
      });

    return {
      version: "12.3-Presence",
      count: entries.length,
      entries
    };
  }
};


// ============================================================================
// PUBLIC API (C‑LAYER passthrough — dual‑band + presence aware)
// ============================================================================
import { route, Router } from "./PulseOSCNSNervousSystem.js";

function attachBand(payload = {}, band) {
  const normalized = normalizeBand(band || payload.__band);
  return { ...payload, __band: normalized };
}

export async function layerAuth(jwtToken, band = ROUTE_BANDS.SYMBOLIC) {
  const b = normalizeBand(band);
  logLayer("LAYER_AUTH", { band: b });
  return await route("auth", attachBand({ jwtToken, reflexOrigin: "LayerScanner" }, b));
}

export async function layerHook(name, payload = {}, band = payload.__band || ROUTE_BANDS.SYMBOLIC) {
  const b = normalizeBand(band);
  logLayer("LAYER_HOOK", { name, band: b });
  return await route("hook", attachBand({ name, payload, reflexOrigin: "LayerScanner" }, b));
}

export async function layerMap(mapName, band = ROUTE_BANDS.SYMBOLIC) {
  const b = normalizeBand(band);
  logLayer("LAYER_MAP", { mapName, band: b });
  return await route("map", attachBand({ mapName, reflexOrigin: "LayerScanner" }, b));
}

export async function layerHelper(helperName, payload = {}, band = payload.__band || ROUTE_BANDS.SYMBOLIC) {
  const b = normalizeBand(band);
  logLayer("LAYER_HELPER", { helperName, band: b });
  return await route("helper", attachBand({ helperName, payload, reflexOrigin: "LayerScanner" }, b));
}


// ============================================================================
// MID‑LAYER ERROR INTERCEPTOR (A2 → A3) — v12.3 dual‑band + presence
// ============================================================================
let layerHealing = false;

if (hasWindow && typeof window.addEventListener === "function") {
  window.addEventListener(
    "error",
    async (event) => {
      if (layerHealing) return;

      const msg = event.message || "";
      const stack = event.error?.stack || "";
      const band = normalizeBand(event.error?.__band);

      // Only intercept errors originating from the mid‑layer
      if (!stack.includes("/Layer/") && !stack.toLowerCase().includes("layer")) {
        return;
      }

      logLayer("LAYER_ERROR_INTERCEPTED", { message: msg, band });

      // ----------------------------------------------------------------------
      // STACK + ROUTE TRACE
      // ----------------------------------------------------------------------
      const frames = stack.split("\n").map((s) => s.trim());
      const rawFrames = frames
        .filter((f) => f.includes(".js"))
        .map((f) => f.replace(/^at\s+/, ""));

      let routeTrace = LayerRouteMemory.recall(msg, rawFrames, band);

      if (!routeTrace) {
        routeTrace = rawFrames.map((frame, index) => {
          const file = frame.split("/").pop().split(":")[0];

          return {
            frame,
            file,
            index,
            label: "LAYER_FRAME",
            layer: "A2",
            purpose: "Mid-layer observed frame",
            context: "LayerScanner dynamic trace",
            band
          };
        });

        LayerRouteMemory.remember(msg, rawFrames, routeTrace, { band });
      }

      // ----------------------------------------------------------------------
      // MID‑LAYER CLASSIFICATION → MARK DEGRADATION, NEVER BLOCK
      // ----------------------------------------------------------------------
      // v10.4+ — Import errors are non-fatal (same rule as SkinReflex)
      if (msg.includes("Cannot find module")) {
        logLayer("LAYER_IMPORT_IGNORED", {
          note: "Import errors are non-fatal in v10.4+",
          details: msg,
          band
        });

        // Do NOT classify
        // Do NOT degrade
        // Do NOT heal
        // Do NOT route
        event.preventDefault();
        return;
      }

      if (msg.includes("already been declared")) {
        logLayer("LAYER_IMPORT_CONFLICT", {
          error: "layerImportConflict",
          details: msg,
          band
        });

        LayerRouteMemory.markDegraded(msg, rawFrames, 0.85, band);
      }

      if (msg.includes("process is not defined")) {
        logLayer("LAYER_ENV_MISMATCH", {
          error: "layerEnvMismatch",
          hint: "Replace process.env.* with window.PULSE_*",
          band
        });

        LayerRouteMemory.markDegraded(msg, rawFrames, 0.7, band);
      }

      if (msg.includes("Maximum call stack size exceeded")) {
        logLayer("LAYER_RECURSION_LOOP", {
          error: "layerRecursionLoop",
          details: msg,
          band
        });

        LayerRouteMemory.markDegraded(msg, rawFrames, 0.5, band);
      }

      const memoryEntry = LayerRouteMemory.getEntry(msg, rawFrames, band);
      const degraded = memoryEntry?.degraded || false;
      const healthScore = memoryEntry?.healthScore ?? 1.0;
      const tier = memoryEntry?.tier || "microDegrade";
      const dnaTag = memoryEntry?.dnaTag || (band === ROUTE_BANDS.PRESENCE ? "A2_TISSUE_PRESENCE" : "A2_TISSUE");

      // ----------------------------------------------------------------------
      // ALWAYS PIPE ERROR TO BACKEND VIA ROUTER
      // ----------------------------------------------------------------------
      await route("logError", {
        type: degraded ? "classified" : "unclassified",
        message: msg,
        frames: rawFrames,
        routeTrace,
        page: hasWindow && window.location ? window.location.pathname : null,
        reflexOrigin: "LayerScanner",
        layer: "A2",
        degraded,
        healthScore,
        tier,
        dnaTag,
        __band: band
      });

      // ----------------------------------------------------------------------
      // HEALING LOGIC (A2 reflex → Router)
      // ----------------------------------------------------------------------
      const parsed = parseMissingField(msg);
      if (!parsed) {
        logLayer("NO_MISSING_FIELD", {
          degraded,
          healthScore,
          tier,
          dnaTag,
          band
        });
        event.preventDefault();
        return;
      }

      const { table, field } = parsed;

      logLayer("LAYER_HEALING_TRIGGERED", {
        table,
        field,
        degraded,
        healthScore,
        tier,
        dnaTag,
        band
      });

      layerHealing = true;

      try {
        Router.receiveReflex({
          reflexOrigin: "LayerScanner",
          layer: "A2",
          message: msg,
          routeTrace,
          table,
          field,
          degraded,
          healthScore,
          tier,
          dnaTag,
          band
        });

        await route("fetchField", {
          table,
          field,
          message: msg,
          reflexOrigin: "LayerScanner",
          layer: "A2",
          routeTrace,
          degraded,
          healthScore,
          tier,
          dnaTag,
          __band: band
        });

        logLayer("LAYER_HEALING_SUCCESS", {
          table,
          field,
          degraded,
          healthScore,
          tier,
          dnaTag,
          band
        });
      } catch (err) {
        logLayer("LAYER_HEALING_FAILED", {
          error: String(err),
          degraded,
          healthScore,
          tier,
          dnaTag,
          band
        });
        if (typeof error === "function") {
          error("[LayerScanner] Router fetch failed:", err);
        }
      }

      layerHealing = false;

      event.preventDefault();
    },
    true
  );
}


// ============================================================================
// PARSER (same as PageScanner)
// ============================================================================
function parseMissingField(message) {
  logLayer("PARSER_INVOKED", {});

  let match = message.match(/reading '([^']+)'/);
  if (match) return { table: "Users", field: match[1] };

  match = message.match(/([^ ]+) is not defined/);
  if (match) return { table: "Users", field: match[1] };

  match = message.match(/property '([^']+)'/);
  if (match) return { table: "Users", field: match[1] };

  return null;
}


// ============================================================================
// PREWARM + SNAPSHOT SURFACE — presence / cache / chunk (pure, deterministic)
// ============================================================================

/**
 * Prewarm the tissue membrane route memory with known mid-layer error patterns.
 * routes: Array<{
 *   message: string,
 *   frames: string[],
 *   routeTrace?: any[],
 *   band?: "symbolic" | "binary" | "presence",
 *   healthScore?: number,
 *   degraded?: boolean
 * }>
 */
export function prewarmTissueMembrane(routes = []) {
  for (const r of routes) {
    if (!r || !r.message || !Array.isArray(r.frames)) continue;
    const band = normalizeBand(r.band);
    const trace =
      Array.isArray(r.routeTrace) && r.routeTrace.length > 0
        ? r.routeTrace
        : r.frames.map((frame, index) => {
            const file = frame.split("/").pop().split(":")[0];
            return {
              frame,
              file,
              index,
              label: "LAYER_FRAME",
              layer: "A2",
              purpose: "Prewarmed mid-layer frame",
              context: "LayerScanner prewarm trace",
              band
            };
          });

    LayerRouteMemory.remember(r.message, r.frames, trace, {
      band,
      healthScore: r.healthScore,
      degraded: !!r.degraded
    });
  }

  logLayer("TISSUE_PREWARM_COMPLETE", {
    prewarmCount: Array.isArray(routes) ? routes.length : 0
  });
}

/**
 * Get a deterministic snapshot of tissue route memory for diagnostics /
 * presence overlays / multi-presence dashboards.
 */
export function getTissueRouteMemorySnapshot() {
  const snap = LayerRouteMemory.snapshot();
  logLayer("TISSUE_ROUTE_MEMORY_SNAPSHOT", { count: snap.count });
  return snap;
}

// ============================================================================
// END OF FILE — THE TISSUE MEMBRANE / MID‑LAYER EPITHELIAL REFLEX  [v12.3]
// ============================================================================
