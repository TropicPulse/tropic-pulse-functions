// ============================================================================
// FILE: PulseUIErrors-v14-IMMORTAL.js
// UNIVERSAL ERROR SPINE — v14-IMMORTAL
// Membrane-Safe • Drift-Safe • Organism-Wide Error Unifier
// Offline-First • LocalStorage-Mirrored • Replay-Aware
// ============================================================================
/*
AI_EXPERIENCE_META = {
  identity: "PulseUIErrors",
  version: "v13-EVO-PRIME",
  layer: "frontend",
  role: "ui_error_spine",
  lineage: "PulseOS-v12",

  evo: {
    presenceAware: true,
    chunkAligned: true,
    dualBand: true,
    safeRouteFree: true,
    normalizerAligned: true,
    errorSpine: true,

    // v14 IMMORTAL
    offlineFirst: true,
    localStoreMirrored: true,
    replayAware: true,
    modeAgnostic: true
  },

  contract: {
    always: [
      "PulseWindow",
      "PulsePresence",
      "PulseChunks",
      "PulseUIFlow"
    ],
    never: [
      "legacyUIErrors",
      "safeRoute",
      "fetchViaCNS",
      "legacyPresence",
      "legacyFlow"
    ]
  }
}
*/

// ============================================================================
// IMMORTAL LOCALSTORAGE MIRROR — PulseUIErrorStore
// ============================================================================

const UIE_LS_KEY = "PulseUIErrors.v14.buffer";
const UIE_LS_MAX = 2000;

function uieHasLocalStorage() {
  try {
    if (typeof window === "undefined" || !window.localStorage) return false;
    const t = "__uie_test__";
    window.localStorage.setItem(t, "1");
    window.localStorage.removeItem(t);
    return true;
  } catch {
    return false;
  }
}

function uieLoadBuffer() {
  if (!uieHasLocalStorage()) return [];
  try {
    const raw = window.localStorage.getItem(UIE_LS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function uieSaveBuffer(buf) {
  if (!uieHasLocalStorage()) return;
  try {
    const trimmed =
      buf.length > UIE_LS_MAX ? buf.slice(buf.length - UIE_LS_MAX) : buf;
    window.localStorage.setItem(UIE_LS_KEY, JSON.stringify(trimmed));
  } catch {}
}

function appendUIErrorRecord(kind, payload) {
  const entry = {
    ts: Date.now(),
    kind,
    payload
  };
  const buf = uieLoadBuffer();
  buf.push(entry);
  uieSaveBuffer(buf);
}

export const PulseUIErrorStore = {
  getAll() {
    return uieLoadBuffer();
  },
  tail(n = 200) {
    const buf = uieLoadBuffer();
    return buf.slice(Math.max(0, buf.length - n));
  },
  clear() {
    uieSaveBuffer([]);
  }
};

// ============================================================================
// UNIVERSAL ERROR SPINE
// ============================================================================

export const PulseUIErrors = (() => {
  const spineMeta = Object.freeze({
    layer: "PulseUIErrors",
    role: "universal-error-spine",
    version: "13.0-EVO-PRIME",
    evo: {
      driftSafe: true,
      membraneSafe: true,
      organismWide: true,
      dualBandAware: true,
      binaryAware: true,
      symbolicAware: true,
      uiFlowAware: true,
      skinReflexAware: true,
      evolutionaryPageAware: true,
      cortexAware: true,
      routerAware: true
    }
  });

  // --------------------------------------------------------------------------
  // NORMALIZER — convert ANY error into a safe packet
  // --------------------------------------------------------------------------
  function normalizeError(err, origin = "unknown") {
    let packet;
    try {
      packet = {
        origin,
        message: err?.message ?? String(err),
        name: err?.name ?? "Error",
        stack: err?.stack ?? null,
        time: Date.now(),
        meta: spineMeta
      };
    } catch {
      packet = {
        origin,
        message: "Unknown error",
        name: "Unknown",
        stack: null,
        time: Date.now(),
        meta: spineMeta
      };
    }

    // IMMORTAL: mirror normalized packet
    appendUIErrorRecord("normalize", packet);
    return packet;
  }

  // --------------------------------------------------------------------------
  // BROADCAST — send normalized error to all safe listeners
  // --------------------------------------------------------------------------
  function broadcast(packet) {
    // IMMORTAL: mirror broadcast
    appendUIErrorRecord("broadcast", packet);

    // Window logger
    try { window?.PulseLogger?.logError?.(packet); } catch {}

    // EvolutionaryPage (v13)
    try { window?.PulseEvolutionaryPage?.onError?.(packet); } catch {}

    // UI Flow v13
    try { window?.PulseUIFlowV13?.onError?.(packet); } catch {}

    // RouterOrgan
    try { window?.PulseRouterOrgan?.onError?.(packet); } catch {}

    // Cortex
    try { window?.PulseCortex?.onError?.(packet); } catch {}

    // MemoryOrgan
    try { window?.PulseMemoryOrgan?.onError?.(packet); } catch {}

    // BinaryOrgan
    try { window?.PulseBinaryOrgan?.onError?.(packet); } catch {}

    // Understanding (SDN)
    try {
      window?.Pulse?.SDN?.emitImpulse?.("ErrorSpine", {
        modeKind: "dual",
        executionContext: {
          sceneType: "error",
          workloadClass: "ui-error",
          dispatchSignature: "PulseUIErrors.v13",
          shapeSignature: "error-spine",
          extensionId: "PulseUIErrors"
        },
        errorPacket: packet
      });
    } catch {}

    // Binary shadow
    try { window?.PulseBinary?.Vitals?.generate?.(); } catch {}

    // SkinReflex
    try { window?.PulseSkinReflex?.onError?.(packet); } catch {}
  }

  // --------------------------------------------------------------------------
  // CAPTURE — global listeners
  // --------------------------------------------------------------------------
  function installGlobalHandlers() {
    if (typeof window === "undefined" || !window.addEventListener) return;

    // JS runtime errors
    window.addEventListener("error", (e) => {
      const packet = normalizeError(e.error || e, "window.error");
      appendUIErrorRecord("window.error", packet);
      broadcast(packet);
    });

    // Promise rejections
    window.addEventListener("unhandledrejection", (e) => {
      const packet = normalizeError(e.reason || e, "window.unhandledrejection");
      appendUIErrorRecord("window.unhandledrejection", packet);
      broadcast(packet);
    });

    // SkinReflex internal errors (if it exposes a handler)
    try {
      window.PulseSkinReflex?.registerErrorHandler?.((err) => {
        const packet = normalizeError(err, "skin.reflex");
        appendUIErrorRecord("skin.reflex", packet);
        broadcast(packet);
      });
    } catch {}
  }

  // --------------------------------------------------------------------------
  // INIT
  // --------------------------------------------------------------------------
  function init() {
    try { installGlobalHandlers(); } catch {}
  }

  // Auto-init
  if (typeof window !== "undefined") init();

  return {
    meta: spineMeta,
    normalizeError,
    broadcast,
    init
  };
})();

export default PulseUIErrors;

// ============================================================================
// GLOBAL EXPOSURE OF IMMORTAL STORE
// ============================================================================
try {
  if (typeof window !== "undefined") {
    window.PulseUIErrorStore = PulseUIErrorStore;
    window.PulseUIErrors = PulseUIErrors;
  }
  if (typeof globalThis !== "undefined") {
    globalThis.PulseUIErrorStore = PulseUIErrorStore;
    globalThis.PulseUIErrors = PulseUIErrors;
  }
} catch {}
