/*
===============================================================================
FILE: /PULSE-UI/PulseUIErrors-v16.js
UNIVERSAL ERROR SPINE — v16-Immortal
Membrane-Safe • Drift-Safe • Organism-Wide Error Unifier
Offline-First • CoreMemory-Mirrored via PulseProofBridge • Replay-Aware
===============================================================================
AI_EXPERIENCE_META = {
  identity: "PulseUIErrors",
  version: "v16-Immortal",
  layer: "pulse_ui",
  role: "ui_error_spine",
  lineage: "PulseUIErrors-v12 → v14-Immortal → v16-Immortal",

  evo: {
    presenceAware: true,
    chunkAligned: true,
    dualBand: true,
    safeRouteFree: true,
    normalizerAligned: true,
    errorSpine: true,

    offlineFirst: true,
    localStoreMirrored: true,
    replayAware: true,
    modeAgnostic: true,

    // v16+ IMMORTAL
    deterministic: true,
    driftProof: true,
    schemaVersioned: true,
    envelopeAware: true,
    integrityAware: true,
    degradationAware: true,
    experienceBlocksAware: true,
    coreMemoryMirrored: true,
    unifiedAdvantageField: true,
    futureEvolutionReady: true
  },

  contract: {
    always: [
      "PulseWindow",
      "PulsePresence",
      "PulseChunks",
      "PulseUIFlow",
      "PulseCore.Memory",
      "PulseUI.EvolutionaryRouter",
      "PulseUI.EvolutionaryBrain",
      "PulseUI.EvolutionaryCode"
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
===============================================================================
*/

import { PulseProofBridge } from "../_BACKEND/PulseProofBridge.js";

// Global handle
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

// CoreMemory via PulseProofBridge (exact same CoreMemory, bridged)
const Core = PulseProofBridge.coreMemory;

// ============================================================================
// IMMORTAL LOCALSTORAGE MIRROR — PulseUIErrorStore
// ============================================================================
const UIE_SCHEMA_VERSION = "v3";
const UIE_LS_KEY = "PulseUIErrors.v16.buffer";
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

  // CoreMemory mirror via bridge (router-style snapshot)
  try {
    Core?.setRouteSnapshot?.("ui_errors", {
      schemaVersion: UIE_SCHEMA_VERSION,
      version: "16.0-Immortal",
      kind,
      entry,
      timestamp: Date.now()
    });
  } catch {}
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
    try {
      Core?.setRouteSnapshot?.("ui_errors", {
        schemaVersion: UIE_SCHEMA_VERSION,
        version: "16.0-Immortal",
        cleared: true,
        timestamp: Date.now()
      });
    } catch {}
  }
};

// ============================================================================
// INTERNAL: deterministic hash + advantage + integrity + experience blocks
// ============================================================================
function uieHashString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;
  }
  return h >>> 0;
}

function uieComputeAdvantage(packet) {
  const msg = packet?.message || "";
  const stack = packet?.stack || "";
  const origin = packet?.origin || "";

  const msgLen = msg.length;
  const stackLen = stack.length;
  const originLen = origin.length;

  const total = msgLen + stackLen + originLen || 1;
  const msgWeight = msgLen / total;
  const stackWeight = stackLen / total;
  const originWeight = originLen / total;

  const density = stackWeight;
  const entropyHint = 1 - Math.abs(0.5 - density) * 2;

  const advantage =
    0.5 * msgWeight +
    0.3 * stackWeight +
    0.2 * originWeight;

  return {
    msgLen,
    stackLen,
    originLen,
    totalSize: total,
    msgWeight,
    stackWeight,
    originWeight,
    density,
    entropyHint,
    advantage
  };
}

function uieComputeIntegrity(packet, advantage) {
  const base =
    0.25 * (packet?.origin ? 1 : 0) +
    0.25 * (packet?.name ? 1 : 0) +
    0.25 * (advantage.entropyHint ?? 0.5) +
    0.25 * (advantage.advantage ?? 0.5);

  const score = Math.max(0, Math.min(1, base));

  const status =
    score >= 0.95 ? "immortal" :
    score >= 0.85 ? "excellent" :
    score >= 0.70 ? "good" :
    score >= 0.55 ? "fair" :
    score >= 0.40 ? "degraded" :
                    "critical";

  const degraded = status === "degraded" || status === "critical";

  return { score, status, degraded };
}

function uieBuildExperienceBlocks(packet, advantage, integrity) {
  return {
    schemaVersion: UIE_SCHEMA_VERSION,
    blocks: [
      {
        id: "ui.error.core",
        kind: "error-core",
        origin: packet.origin,
        name: packet.name,
        messagePreview: (packet.message || "").slice(0, 160)
      },
      {
        id: "ui.error.advantage",
        kind: "advantage",
        msgLen: advantage.msgLen,
        stackLen: advantage.stackLen,
        originLen: advantage.originLen,
        totalSize: advantage.totalSize,
        msgWeight: advantage.msgWeight,
        stackWeight: advantage.stackWeight,
        originWeight: advantage.originWeight,
        density: advantage.density,
        entropyHint: advantage.entropyHint,
        advantage: advantage.advantage
      },
      {
        id: "ui.error.integrity",
        kind: "integrity",
        score: integrity.score,
        status: integrity.status,
        degraded: integrity.degraded
      }
    ]
  };
}

function uieBuildEnvelopeId(packet, signature) {
  const base = `${packet.origin || "unknown"}:${packet.name || "Error"}:${signature}`;
  const h = uieHashString(base);
  return `UIE-${UIE_SCHEMA_VERSION}-${h.toString(16).padStart(8, "0")}`;
}

// ============================================================================
// UNIVERSAL ERROR SPINE
// ============================================================================
export const PulseUIErrors = (() => {
  const spineMeta = Object.freeze({
    layer: "PulseUIErrors",
    role: "universal-error-spine",
    version: "16.0-Immortal",
    schemaVersion: UIE_SCHEMA_VERSION,
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
      routerAware: true,
      coreMemoryMirrored: true,
      experienceBlocksAware: true,
      unifiedAdvantageField: true
    }
  });

  // --------------------------------------------------------------------------
  // NORMALIZER — convert ANY error into a safe packet + envelope
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

    const advantage = uieComputeAdvantage(packet);
    const integrity = uieComputeIntegrity(packet, advantage);

    const baseEnvelope = {
      schemaVersion: UIE_SCHEMA_VERSION,
      version: spineMeta.version,
      packet,
      advantage,
      integrity,
      timestamp: packet.time
    };

    const sigSource = JSON.stringify(baseEnvelope);
    const signature = "UIE_SIG_" + uieHashString(sigSource).toString(16).padStart(8, "0");
    const id = uieBuildEnvelopeId(packet, signature);
    const experience = uieBuildExperienceBlocks(packet, advantage, integrity);

    const envelope = {
      ...baseEnvelope,
      id,
      signature,
      experience
    };

    appendUIErrorRecord("normalize", envelope);
    return envelope;
  }

  // --------------------------------------------------------------------------
  // BROADCAST — send normalized error envelope to all safe listeners
  // --------------------------------------------------------------------------
  function broadcast(envelope) {
    appendUIErrorRecord("broadcast", envelope);

    const packet = envelope.packet;

    // Window logger
    try { window?.PulseLogger?.logError?.(envelope); } catch {}

    // EvolutionaryPage
    try { window?.PulseEvolutionaryPage?.onError?.(envelope); } catch {}

    // UI Flow
    try { window?.PulseUIFlowV13?.onError?.(envelope); } catch {}

    // RouterOrgan
    try { window?.PulseRouterOrgan?.onError?.(envelope); } catch {}

    // Cortex
    try { window?.PulseCortex?.onError?.(envelope); } catch {}

    // MemoryOrgan
    try { window?.PulseMemoryOrgan?.onError?.(envelope); } catch {}

    // BinaryOrgan
    try { window?.PulseBinaryOrgan?.onError?.(envelope); } catch {}

    // Understanding (SDN)
    try {
      window?.Pulse?.SDN?.emitImpulse?.("ErrorSpine", {
        modeKind: "dual",
        executionContext: {
          sceneType: "error",
          workloadClass: "ui-error",
          dispatchSignature: "PulseUIErrors.v16",
          shapeSignature: "error-spine",
          extensionId: "PulseUIErrors"
        },
        errorEnvelope: envelope
      });
    } catch {}

    // Binary shadow
    try { window?.PulseBinary?.Vitals?.generate?.(); } catch {}

    // SkinReflex
    try { window?.PulseSkinReflex?.onError?.(envelope); } catch {}

    // CoreMemory mirror (full envelope)
    try {
      Core?.setRouteSnapshot?.("ui_errors_last", envelope);
    } catch {}
  }

  // --------------------------------------------------------------------------
  // CAPTURE — global listeners
  // --------------------------------------------------------------------------
  function installGlobalHandlers() {
    if (typeof window === "undefined" || !window.addEventListener) return;

    // JS runtime errors
    window.addEventListener("error", (e) => {
      const envelope = normalizeError(e.error || e, "window.error");
      appendUIErrorRecord("window.error", envelope);
      broadcast(envelope);
    });

    // Promise rejections
    window.addEventListener("unhandledrejection", (e) => {
      const envelope = normalizeError(e.reason || e, "window.unhandledrejection");
      appendUIErrorRecord("window.unhandledrejection", envelope);
      broadcast(envelope);
    });

    // SkinReflex internal errors (if it exposes a handler)
    try {
      window.PulseSkinReflex?.registerErrorHandler?.((err) => {
        const envelope = normalizeError(err, "skin.reflex");
        appendUIErrorRecord("skin.reflex", envelope);
        broadcast(envelope);
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
/* GLOBAL EXPOSURE OF IMMORTAL STORE + ERROR SPINE */
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
  if (typeof global !== "undefined") {
    global.PulseUIErrorStore = PulseUIErrorStore;
    global.PulseUIErrors = PulseUIErrors;
  }
  if (typeof g !== "undefined") {
    g.PulseUIErrorStore = PulseUIErrorStore;
    g.PulseUIErrors = PulseUIErrors;
  }
} catch {}
