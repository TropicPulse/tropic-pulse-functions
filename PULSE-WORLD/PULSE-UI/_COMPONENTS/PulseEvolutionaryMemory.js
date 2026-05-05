/*
===============================================================================
FILE: /PULSE-UI/PulseEvolutionaryMemory-v16-Immortal.js
LAYER: UI LONG‑TERM MEMORY ORGAN — IMMORTAL v16+
===============================================================================
AI_EXPERIENCE_META = {
  identity: "PulseUI.EvolutionaryMemory",
  version: "v16-Immortal",
  layer: "pulse_ui",
  role: "ui_long_term_memory",
  lineage: "PulseEvolutionaryMemory-v11.3-Evo-Prime → v14-Immortal → v15-Immortal → v16-Immortal",

  evo: {
    memoryOrgan: true,
    longTermMemory: true,
    routeAware: true,
    lineageAware: true,
    binaryAware: true,
    symbolicAware: true,
    dualBand: true,
    unifiedAdvantageField: true,
    futureEvolutionReady: true,

    deterministic: true,
    driftProof: true,
    pureCompute: true,

    zeroNetwork: true,
    zeroFilesystem: true,
    zeroMutationOfInput: true,

    // v16+ upgrades
    schemaVersioned: true,
    envelopeAware: true,
    integrityAware: true,
    bulkFlushAware: true,
    degradationAware: true,
    experienceBlocksAware: true
  },

  contract: {
    always: [
      "PulseCore.Memory",
      "PulseUI.EvolutionaryCode",
      "PulseUI.EvolutionaryBrain",
      "PulseUI.EvolutionaryBinary",
      "PulseProofBridge"
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
  organ: "PulseUI.EvolutionaryMemory",
  layer: "pulse_ui",
  stability: "IMMORTAL",
  deterministic: true,
  pure: true,

  consumes: [
    "PageModel",
    "RouteId",
    "PulseCoreMemory"
  ],

  produces: [
    "SavedSnapshot",
    "LoadedSnapshot",
    "BulkFlushResult",
    "ExperienceEnvelope"
  ],

  sideEffects: "core_memory_write_only",
  network: "none",
  filesystem: "none"
}
===============================================================================
*/

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

import { PulseProofBridge } from "../_BACKEND/PulseProofBridge.js";

// ---------------------------------------------------------------------------
// ROLE BLOCK
// ---------------------------------------------------------------------------
export const MemoryRole = {
  type: "Organ",
  subsystem: "UI",
  layer: "PageMemory",
  version: "16.1-Immortal",
  identity: "PulseEvolutionaryMemory",

  evo: {
    driftProof: true,
    deterministic: true,
    dualBand: true,
    binaryAware: true,
    symbolicAware: true,
    memoryPersistence: true,
    lineageAware: true,
    routeAware: true,
    unifiedAdvantageField: true,
    futureEvolutionReady: true,
    envelopeAware: true,
    integrityAware: true,
    bulkFlushAware: true,
    degradationAware: true,
    experienceBlocksAware: true
  }
};

const MEMORY_SCHEMA_VERSION = "v3";

// ---------------------------------------------------------------------------
// INTERNAL HELPERS — deterministic hashing + metrics
// ---------------------------------------------------------------------------
function hashString(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) >>> 0;
  }
  return h >>> 0;
}

function computeChecksum(model) {
  const json = JSON.stringify(model || {});
  return hashString(json);
}

function computeLineageHash(lineage) {
  return hashString(JSON.stringify(lineage || {}));
}

function computeBandMetrics(model) {
  const payloadJson = JSON.stringify(model?.payload || {});
  const payloadSize = payloadJson.length;

  const binary = model?.binary;
  const binarySize = Array.isArray(binary) ? binary.length : 0;

  const total = payloadSize + binarySize || 1;
  const symbolicWeight = payloadSize / total;
  const binaryWeight = binarySize / total;

  const density = binaryWeight;
  const entropyHint = 1 - Math.abs(0.5 - density) * 2;

  const advantage =
    0.4 * symbolicWeight +
    0.6 * binaryWeight;

  return {
    payloadSize,
    binarySize,
    totalSize: total,
    symbolicWeight,
    binaryWeight,
    density,
    entropyHint,
    advantage
  };
}

function computeIntegrity({ checksum, lineageHash, band }) {
  const base =
    (checksum ? 0.4 : 0) +
    (lineageHash ? 0.3 : 0) +
    0.3 * (band.entropyHint ?? 0.5);

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

function buildExperienceBlocks({ model, band, integrity }) {
  const lineage = model?.lineage || {};
  const route = lineage.route || model?.route || "unknown";

  return {
    schemaVersion: MEMORY_SCHEMA_VERSION,
    blocks: [
      {
        id: "memory.band",
        kind: "bandMetrics",
        route,
        payloadSize: band.payloadSize,
        binarySize: band.binarySize,
        totalSize: band.totalSize,
        symbolicWeight: band.symbolicWeight,
        binaryWeight: band.binaryWeight,
        density: band.density,
        entropyHint: band.entropyHint,
        advantage: band.advantage
      },
      {
        id: "memory.integrity",
        kind: "integrity",
        route,
        score: integrity.score,
        status: integrity.status,
        degraded: integrity.degraded
      },
      {
        id: "memory.lineage",
        kind: "lineage",
        route,
        lineage
      }
    ]
  };
}

function buildEnvelopeId({ routeId, checksum, lineageHash }) {
  const base = `${routeId}:${checksum}:${lineageHash}`;
  const h = hashString(base);
  return `MEM-${MEMORY_SCHEMA_VERSION}-${h.toString(16).padStart(8, "0")}`;
}

// ---------------------------------------------------------------------------
// FACTORY — CoreMemory via PulseProofBridge.coreMemory
// ---------------------------------------------------------------------------
export function createPulseEvolutionaryMemory({
  routeId = "page",
  log = console.log,
  warn = console.warn
} = {}) {
  const Core = PulseProofBridge.coreMemory;

  const MemoryState = {
    lastSaved: null,
    lastLoaded: null,
    lastExperience: null,
    lastError: null,
    routeId,
    eventSeq: 0
  };

  function nextSeq() {
    MemoryState.eventSeq += 1;
    return MemoryState.eventSeq;
  }

  function safeLog(stage, details = {}) {
    try {
      log(
        "[PulseEvolutionaryMemory-v16]",
        stage,
        JSON.stringify({
          schemaVersion: MEMORY_SCHEMA_VERSION,
          seq: MemoryState.eventSeq,
          routeId,
          ...details
        })
      );
    } catch {}
  }

  // ------------------------------------------------------------------------
  // SAVE PAGE MODEL — IMMORTAL envelope + experience blocks
  // ------------------------------------------------------------------------
  async function savePage(model) {
    nextSeq();

    if (!model || typeof model !== "object") {
      const errorInfo = "InvalidModel";
      MemoryState.lastError = errorInfo;
      warn("[PulseEvolutionaryMemory-v16] INVALID_MODEL");
      safeLog("SAVE_INVALID_MODEL", { error: errorInfo });
      return { ok: false, error: errorInfo };
    }

    try {
      const lineage = model.lineage || {};
      const checksum = computeChecksum(model);
      const lineageHash = computeLineageHash(lineage);
      const band = computeBandMetrics(model);
      const integrity = computeIntegrity({ checksum, lineageHash, band });
      const experience = buildExperienceBlocks({ model, band, integrity });
      const envelopeId = buildEnvelopeId({ routeId, checksum, lineageHash });

      const envelope = {
        schemaVersion: MEMORY_SCHEMA_VERSION,
        version: MemoryRole.version,
        id: envelopeId,
        routeId,
        model,
        checksum,
        lineageHash,
        band,
        integrity,
        experience,
        timestamp: "NO_TIMESTAMP_v16"
      };

      Core.setRouteSnapshot(routeId, envelope);

      MemoryState.lastSaved = envelope;
      MemoryState.lastExperience = experience;

      safeLog("SAVE_OK", {
        id: envelopeId,
        checksum,
        lineageHash,
        integrityStatus: integrity.status,
        degraded: integrity.degraded
      });

      return {
        ok: true,
        envelope,
        experience
      };
    } catch (err) {
      const msg = String(err);
      MemoryState.lastError = msg;
      warn("[PulseEvolutionaryMemory-v16] SAVE_ERROR", msg);
      safeLog("SAVE_ERROR", { error: msg });
      return { ok: false, error: "SaveError" };
    }
  }

  // ------------------------------------------------------------------------
  // LOAD PAGE MODEL — integrity + experience surfaced
  // ------------------------------------------------------------------------
  async function loadPage() {
    nextSeq();

    try {
      const envelope = Core.getRouteSnapshot(routeId);

      if (!envelope || typeof envelope !== "object") {
        safeLog("LOAD_EMPTY", {});
        return null;
      }

      MemoryState.lastLoaded = envelope;
      MemoryState.lastExperience = envelope.experience || null;

      safeLog("LOAD_OK", {
        id: envelope.id,
        checksum: envelope.checksum,
        lineageHash: envelope.lineageHash,
        integrityStatus: envelope.integrity?.status,
        degraded: envelope.integrity?.degraded
      });

      return envelope.model || null;
    } catch (err) {
      const msg = String(err);
      MemoryState.lastError = msg;
      warn("[PulseEvolutionaryMemory-v16] LOAD_ERROR", msg);
      safeLog("LOAD_ERROR", { error: msg });
      return null;
    }
  }

  // ------------------------------------------------------------------------
  // BULK FLUSH — degradation‑aware wrapper
  // ------------------------------------------------------------------------
  function flush() {
    nextSeq();
    try {
      Core.bulkFlush();
      safeLog("FLUSH_OK", {});
      return { ok: true };
    } catch (err) {
      const msg = String(err);
      MemoryState.lastError = msg;
      warn("[PulseEvolutionaryMemory-v16] FLUSH_ERROR", msg);
      safeLog("FLUSH_ERROR", { error: msg });
      return { ok: false, error: "FlushError" };
    }
  }

  const PulseEvolutionaryMemory = {
    MemoryRole,
    MemoryState,
    savePage,
    loadPage,
    flush,
    core: Core
  };

  safeLog("INIT", {
    identity: MemoryRole.identity,
    version: MemoryRole.version,
    schemaVersion: MEMORY_SCHEMA_VERSION
  });

  return PulseEvolutionaryMemory;
}

try {
  if (typeof window !== "undefined") {
    window.PulseEvolutionaryMemory = createPulseEvolutionaryMemory;
  }
  if (typeof globalThis !== "undefined") {
    globalThis.PulseEvolutionaryMemory = createPulseEvolutionaryMemory;
  }
  if (typeof global !== "undefined") {
    global.PulseEvolutionaryMemory = createPulseEvolutionaryMemory;
  }
  if (typeof g !== "undefined") {
    g.PulseEvolutionaryMemory = createPulseEvolutionaryMemory;
  }
} catch {}
