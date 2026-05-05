// ============================================================================
// FILE: /PULSE-UI/PulseEvolutionaryBrain-v16.js
// PULSE OS — v16-IMMORTAL
// UI PAGE BRAIN / PAGE CORTEX — ADVANTAGE-AWARE, ROUTE-AWARE, BINARY-AWARE
// ============================================================================
//
// ROLE (v16-IMMORTAL):
//   THE PAGE BRAIN — The UI cortex + coordination layer.
//   • Wires Code + Memory + CNS + Binary into a deterministic evolution pipeline.
//   • Chooses restore vs fresh evolve with explicit boot path + advantage view.
//   • Emits CNS impulses for restore/evolve/boot with route + lineage hints.
//   • Maintains deterministic state + health for the page brain.
//
// CONTRACT:
//   • PURE ORCHESTRATION — no IO, no network, no filesystem.
//   • Delegates all persistence to MemoryOrgan.
//   • Delegates all evolution to CodeOrgan.
//   • Delegates all binary work to BinaryOrgan (if present).
//   • Deterministic output only.
//
// SAFETY:
//   • v16 upgrade is PURE + STRUCTURAL — richer logic, still safe.
//   • All behavior is deterministic and organism‑safe.
// ============================================================================

/*
===============================================================================
AI_EXPERIENCE_META = {
  identity: "PulseUI.EvolutionaryBrain",
  version: "v16-Immortal",
  layer: "pulse_ui",
  role: "page_brain_and_cortex",
  lineage: "PulseEvolutionaryBrain-v11.3-Evo-Prime → v14-Immortal → v15-Immortal → v16-Immortal",

  evo: {
    pageBrain: true,
    cortex: true,
    cnsAware: true,
    memoryAware: true,
    routeAware: true,
    dualBandAware: true,
    symbolicPrimary: true,
    binaryAware: true,
    lineageAware: true,
    unifiedAdvantageField: true,
    futureEvolutionReady: true,

    deterministic: true,
    driftProof: true,
    pureCompute: true,

    zeroNetwork: true,
    zeroFilesystem: true,
    zeroMutationOfInput: true,

    bootPathAware: true,
    errorAware: true,
    schemaVersioned: true,
    advantageView: true,
    healthAware: true
  },

  contract: {
    always: [
      "PulseUI.Evolution",
      "PulseUI.RouteOrgan",
      "PulseUI.EvolutionaryCode",
      "PulseUI.EvolutionaryMemory",
      "PulseUI.EvolutionaryBinary",
      "PulseCore.CNS"
    ],
    never: [
      "eval",
      "Function",
      "dynamicImport",
      "fetchViaCNS",
      "safeRoute"
    ]
  }
}
===============================================================================
EXPORT_META = {
  organ: "PulseUI.EvolutionaryBrain",
  layer: "pulse_ui",
  stability: "IMMORTAL",
  deterministic: true,
  pure: true,

  consumes: [
    "Evolution",
    "LongTermMemory",
    "CNS",
    "createCode",
    "createMemory",
    "createBinary"
  ],

  produces: [
    "bootResult",
    "restoreResult",
    "freshEvolveResult",
    "BrainHealth",
    "BootPathMeta"
  ],

  sideEffects: "logging_only",
  network: "none",
  filesystem: "none"
}
*/

// ---------------------------------------------------------------------------
// GLOBAL HANDLE
// ---------------------------------------------------------------------------
const g =
  typeof globalThis !== "undefined"
    ? globalThis
    : typeof global !== "undefined"
    ? global
    : typeof window !== "undefined"
    ? window
    : typeof g !== "undefined"
    ? g
    : {};

// Prefer global db if present (logger page / server)
const db =
  (g && g.db) ||
  (typeof global !== "undefined" && global.db) ||
  (typeof globalThis !== "undefined" && globalThis.db) ||
  (typeof window !== "undefined" && window.db) ||
  null;

// ---------------------------------------------------------------------------
// ROLE
// ---------------------------------------------------------------------------
export const BrainRole = {
  type: "Organ",
  subsystem: "UI",
  layer: "PageBrain",
  version: "16.0-Immortal",
  identity: "PulseEvolutionaryBrain",

  evo: {
    driftProof: true,
    deterministic: true,
    pageBrain: true,
    dualBandAware: true,
    memoryAware: true,
    cnsAware: true,
    routeAware: true,
    unifiedAdvantageField: true,
    futureEvolutionReady: true,
    binaryAware: true,
    lineageAware: true,
    bootPathAware: true,
    errorAware: true,
    schemaVersioned: true,
    advantageView: true,
    healthAware: true
  }
};

const BRAIN_SCHEMA_VERSION = "v3";

// ---------------------------------------------------------------------------
// HEALTH + ADVANTAGE HELPERS
// ---------------------------------------------------------------------------
function computeBrainHealth({ lastMode, lastError, lastAdvantage }) {
  const hasError = !!lastError;
  const modeScore = lastMode === "restore" ? 1.0 : lastMode === "fresh" ? 0.9 : 0.7;

  const sizeTier = lastAdvantage?.sizeTier || "unknown";
  const entropyHint = lastAdvantage?.entropyHint ?? 0.5;

  let sizeScore = 0.9;
  if (sizeTier === "huge") sizeScore = 0.6;
  else if (sizeTier === "large") sizeScore = 0.75;
  else if (sizeTier === "medium") sizeScore = 0.85;
  else if (sizeTier === "small") sizeScore = 0.95;
  else if (sizeTier === "empty") sizeScore = 0.8;

  const entropyScore = 0.7 + entropyHint * 0.3;

  let health = modeScore * 0.4 + sizeScore * 0.3 + entropyScore * 0.3;
  if (hasError) health *= 0.5;

  const status =
    health > 0.9 ? "excellent" :
    health > 0.75 ? "good" :
    health > 0.6 ? "fair" :
    health > 0.4 ? "degraded" :
                   "critical";

  return {
    health,
    status,
    hasError,
    sizeTier,
    entropyHint
  };
}

function buildBootPathMeta({ bootPath, eventSeq, lastMode, lastError }) {
  return {
    schemaVersion: BRAIN_SCHEMA_VERSION,
    bootPath,
    lastMode,
    lastError: lastError || null,
    seq: eventSeq
  };
}

// ---------------------------------------------------------------------------
// FACTORY
// ---------------------------------------------------------------------------
export function createPulseEvolutionaryBrain({
  Evolution,
  LongTermMemory,   // route-aware client of PulseCoreMemory
  CNS,
  createCode,       // factory: () => PulseEvolutionaryCode organ
  createMemory,     // factory: () => PulseEvolutionaryMemory organ
  createBinary,     // factory: () => PulseEvolutionaryBinary organ (optional)
  log = console.log,
  warn = console.warn
} = {}) {

  const BrainState = {
    initialized: false,
    lastMode: null,        // "restore" | "fresh"
    lastResult: null,
    lastBootPath: null,    // "restore" | "fresh"
    lastError: null,
    eventSeq: 0,
    lastAdvantage: null,   // from BinaryOrgan if available
    lastHealth: null
  };

  function nextSeq() {
    BrainState.eventSeq += 1;
    return BrainState.eventSeq;
  }

  function safeLog(stage, details = {}) {
    try {
      log(
        "[PulseEvolutionaryBrain-v16]",
        stage,
        JSON.stringify({
          schemaVersion: BRAIN_SCHEMA_VERSION,
          seq: BrainState.eventSeq,
          ...details
        })
      );
    } catch {}
  }

  // -------------------------------------------------------------------------
  // ORGANS
  // -------------------------------------------------------------------------
  const MemoryOrgan =
    typeof createMemory === "function"
      ? createMemory({ log, warn })
      : LongTermMemory || null;

  const CodeOrgan =
    typeof createCode === "function"
      ? createCode({ Evolution, LongTermMemory: MemoryOrgan, CNS, log, warn })
      : null;

  const BinaryOrgan =
    typeof createBinary === "function"
      ? createBinary({ Evolution, RouteOrgan: Evolution?.RouteOrgan, log, warn })
      : null;

  if (!MemoryOrgan) warn("[PulseEvolutionaryBrain-v16] NO_MEMORY_ORGAN");
  if (!CodeOrgan) warn("[PulseEvolutionaryBrain-v16] NO_CODE_ORGAN");

  // -------------------------------------------------------------------------
  // INTERNAL: ADVANTAGE TAP
  // -------------------------------------------------------------------------
  function tapAdvantageFromBinary(binaryPayload) {
    if (!BinaryOrgan || !binaryPayload) return null;
    try {
      const enc = BinaryOrgan.encode(binaryPayload);
      if (enc?.ok && enc.advantage) {
        BrainState.lastAdvantage = enc.advantage;
        return enc.advantage;
      }
    } catch (err) {
      warn("[PulseEvolutionaryBrain-v16] ADVANTAGE_TAP_ERROR", String(err));
    }
    return null;
  }

  // -------------------------------------------------------------------------
  // RESTORE PATH
  // -------------------------------------------------------------------------
  async function restore() {
    nextSeq();

    if (!MemoryOrgan || !CodeOrgan) {
      const errorInfo = "MissingOrgans";
      BrainState.lastMode = "restore";
      BrainState.lastError = errorInfo;
      safeLog("RESTORE_MISSING_ORGANS", { error: errorInfo });
      return { ok: false, error: errorInfo };
    }

    try {
      const model = await MemoryOrgan.loadPage();
      if (!model) {
        BrainState.lastMode = "restore";
        BrainState.lastError = "NoSavedPage";
        safeLog("RESTORE_EMPTY", {});
        return { ok: false, error: "NoSavedPage" };
      }

      const res = await (CodeOrgan.restore?.() ?? Promise.resolve({ ok: true, model }));
      BrainState.lastMode = "restore";
      BrainState.lastResult = res || null;
      BrainState.lastError = res?.ok ? null : (res?.error || null);

      const advantage = tapAdvantageFromBinary(res?.binaryPayload || null);
      const health = computeBrainHealth({
        lastMode: BrainState.lastMode,
        lastError: BrainState.lastError,
        lastAdvantage: advantage || BrainState.lastAdvantage
      });
      BrainState.lastHealth = health;

      CNS?.emitImpulse?.("PulseEvolutionaryBrain", {
        event: "restore",
        ok: !!res?.ok,
        health,
        bootPath: "restore"
      });

      safeLog("RESTORE_DONE", {
        ok: !!res?.ok,
        healthStatus: health.status
      });

      return {
        ...res,
        brainHealth: health,
        bootPathMeta: buildBootPathMeta({
          bootPath: "restore",
          eventSeq: BrainState.eventSeq,
          lastMode: BrainState.lastMode,
          lastError: BrainState.lastError
        })
      };
    } catch (err) {
      const msg = String(err);
      BrainState.lastMode = "restore";
      BrainState.lastError = msg;

      const health = computeBrainHealth({
        lastMode: BrainState.lastMode,
        lastError: BrainState.lastError,
        lastAdvantage: BrainState.lastAdvantage
      });
      BrainState.lastHealth = health;

      CNS?.emitImpulse?.("PulseEvolutionaryBrain", {
        event: "restore",
        ok: false,
        health,
        bootPath: "restore"
      });

      safeLog("RESTORE_ERROR", { error: msg, healthStatus: health.status });
      return {
        ok: false,
        error: "RestoreError",
        brainHealth: health,
        bootPathMeta: buildBootPathMeta({
          bootPath: "restore",
          eventSeq: BrainState.eventSeq,
          lastMode: BrainState.lastMode,
          lastError: BrainState.lastError
        })
      };
    }
  }

  // -------------------------------------------------------------------------
  // FRESH EVOLVE PATH
  // -------------------------------------------------------------------------
  async function freshEvolve({
    type = "page:init",
    payload,
    binaryPayload,
    context
  } = {}) {
    nextSeq();

    if (!CodeOrgan) {
      const errorInfo = "MissingCodeOrgan";
      BrainState.lastMode = "fresh";
      BrainState.lastError = errorInfo;
      safeLog("FRESH_EVOLVE_MISSING_CODE", { error: errorInfo });
      const health = computeBrainHealth({
        lastMode: BrainState.lastMode,
        lastError: BrainState.lastError,
        lastAdvantage: BrainState.lastAdvantage
      });
      BrainState.lastHealth = health;
      return {
        ok: false,
        error: errorInfo,
        brainHealth: health
      };
    }

    try {
      const res = await CodeOrgan.evolve({ type, payload, binaryPayload, context });
      BrainState.lastMode = "fresh";
      BrainState.lastResult = res || null;
      BrainState.lastError = res?.ok ? null : (res?.error || null);

      const advantage = tapAdvantageFromBinary(binaryPayload || res?.binaryPayload || null);
      const health = computeBrainHealth({
        lastMode: BrainState.lastMode,
        lastError: BrainState.lastError,
        lastAdvantage: advantage || BrainState.lastAdvantage
      });
      BrainState.lastHealth = health;

      CNS?.emitImpulse?.("PulseEvolutionaryBrain", {
        event: "freshEvolve",
        ok: !!res?.ok,
        health,
        bootPath: "fresh"
      });

      safeLog("FRESH_EVOLVE_DONE", {
        ok: !!res?.ok,
        healthStatus: health.status
      });

      return {
        ...res,
        brainHealth: health
      };
    } catch (err) {
      const msg = String(err);
      BrainState.lastMode = "fresh";
      BrainState.lastError = msg;

      const health = computeBrainHealth({
        lastMode: BrainState.lastMode,
        lastError: BrainState.lastError,
        lastAdvantage: BrainState.lastAdvantage
      });
      BrainState.lastHealth = health;

      CNS?.emitImpulse?.("PulseEvolutionaryBrain", {
        event: "freshEvolve",
        ok: false,
        health,
        bootPath: "fresh"
      });

      safeLog("FRESH_EVOLVE_ERROR", { error: msg, healthStatus: health.status });
      return {
        ok: false,
        error: "FreshEvolveError",
        brainHealth: health
      };
    }
  }

  // -------------------------------------------------------------------------
  // BOOT PATH (RESTORE → FALLBACK FRESH)
// -------------------------------------------------------------------------
  async function boot({ payload, binaryPayload, context } = {}) {
    nextSeq();
    safeLog("BOOT_START", {});

    const restored = await restore();
    if (restored?.ok) {
      BrainState.initialized = true;
      BrainState.lastBootPath = "restore";

      const meta = buildBootPathMeta({
        bootPath: "restore",
        eventSeq: BrainState.eventSeq,
        lastMode: BrainState.lastMode,
        lastError: BrainState.lastError
      });

      safeLog("BOOT_RESTORE_PATH", { healthStatus: restored.brainHealth?.status });
      return {
        ...restored,
        bootPathMeta: meta
      };
    }

    const fresh = await freshEvolve({ type: "page:init", payload, binaryPayload, context });
    BrainState.initialized = true;
    BrainState.lastBootPath = "fresh";

    const meta = buildBootPathMeta({
      bootPath: "fresh",
      eventSeq: BrainState.eventSeq,
      lastMode: BrainState.lastMode,
      lastError: BrainState.lastError
    });

    safeLog("BOOT_FRESH_PATH", { healthStatus: fresh.brainHealth?.status });
    return {
      ...fresh,
      bootPathMeta: meta
    };
  }

  const PulseEvolutionaryBrain = {
    BrainRole,
    BrainState,
    boot,
    restore,
    freshEvolve
  };

  safeLog("INIT", {
    identity: BrainRole.identity,
    version: BrainRole.version,
    schemaVersion: BRAIN_SCHEMA_VERSION
  });

  return PulseEvolutionaryBrain;
}

// ---------------------------------------------------------------------------
// GLOBAL REGISTRATION (WINDOW-SAFE, IMMORTAL)
// ---------------------------------------------------------------------------
try {
  if (typeof window !== "undefined") {
    window.PulseEvolutionaryBrain = createPulseEvolutionaryBrain;
  }
  if (typeof globalThis !== "undefined") {
    globalThis.PulseEvolutionaryBrain = createPulseEvolutionaryBrain;
  }
  if (typeof global !== "undefined") {
    global.PulseEvolutionaryBrain = createPulseEvolutionaryBrain;
  }
  if (typeof g !== "undefined") {
    g.PulseEvolutionaryBrain = createPulseEvolutionaryBrain;
  }
} catch {}
