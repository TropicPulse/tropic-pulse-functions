// ============================================================================
//  aiDualBand-v16-Immortal-ORGANISM.js
//  PULSE OS v16-Immortal — Dual-Band Organism (Symbolic ↔ Binary)
//  Organism Bridge • Context Engine • Clinical + Structural + ScanFile Aware
//  PURE BRIDGE. ZERO MUTATION. ZERO RANDOMNESS.
// ============================================================================

/*
AI_EXPERIENCE_META = {
  identity: "aiDualband",
  version: "v16-Immortal-ORGANISM",
  layer: "ai_core",
  role: "dualband_bridge_organism",
  lineage: "aiDualband-v11 → v13.0-Evo+++ → v14-Immortal → v16-Immortal-ORGANISM",

  evo: {
    dualBand: true,
    symbolicPrimary: true,
    binaryPrimary: true,
    bandSwitching: true,
    hydrationAware: true,
    dehydrationAware: true,

    chunkAware: true,
    cacheAware: true,
    arteryAware: true,
    prewarmAware: true,

    deterministic: true,
    driftProof: true,
    pureCompute: true,
    zeroNetwork: true,
    zeroFilesystem: true,
    zeroMutationOfInput: true,

    proxyAware: true,
    proxyPressureAware: true,
    proxyFallbackAware: true
  },

  contract: {
    always: ["aiEngine", "aiCortex", "aiContextEngine", "PulseProxyContext"],
    never: ["safeRoute", "fetchViaCNS"]
  }
}
*/

export const DualBandMeta = Object.freeze({
  layer: "PulseAIDualBandKernel",
  role: "DUAL_BAND_BRIDGE_ORGAN",
  version: "v16-Immortal-ORGANISM",
  identity: "aiDualBandBridge-v16-Immortal-ORGANISM",

  evo: Object.freeze({
    driftProof: true,
    deterministic: true,
    dualBand: true,
    binaryAware: true,
    symbolicAware: true,
    bridgeAware: true,
    organismAware: true,
    metabolicAware: true,
    reflexAware: true,
    pipelineAware: true,
    contextAware: true,
    clinicalAware: true,
    structuralAware: true,
    scanfileAware: true,
    diagnosticsAware: true,
    scribeAware: true,
    deliveryAware: true,
    depsAware: true,
    identitySafe: true,
    readOnly: true,
    multiInstanceReady: true,
    dualBandArteryAware: true,
    proxyAware: true,
    proxyPressureAware: true,
    proxyFallbackAware: true,
    chunkAware: true,
    cacheAware: true,
    arteryAware: true,
    prewarmAware: true,
    epoch: "v16-Immortal-ORGANISM"
  }),

  contract: Object.freeze({
    purpose:
      "Bind the symbolic Pulse OS to the dualband organism, providing a unified dual-band surface for all AI services and exposing dual-band artery metrics for NodeAdmin/Overmind.",

    never: Object.freeze([
      "mutate external inputs",
      "introduce randomness",
      "bypass binary safety",
      "bypass symbolic safety",
      "modify persona logic",
      "modify router logic",
      "modify cortex logic",
      "treat the organism as a tool instead of an organism"
    ]),

    always: Object.freeze([
      "encode symbolic → binary deterministically",
      "decode binary → symbolic deterministically",
      "sync symbolic vitals to organism state (logically)",
      "sync organism state to symbolic cortex (logically)",
      "expose unified dual-band surface",
      "expose dual-band artery metrics deterministically",
      "preserve organism identity",
      "preserve drift-proof architecture"
    ])
  })
});

// ============================================================================
// IMPORTS (dependency-ordered, ESM)
// ============================================================================
import depsSurface, {
  DepsMeta,
  getDb,
  getFsAPI,
  getRouteAPI,
  getSchemaAPI,
  getOrganismSnapshot,
  emitDepsPacket,
  prewarmDepsLayer
} from "./aiDeps.js";

import {
  DiagnosticsMeta,
  createDiagnosticsState,
  attachDiagnosticsOrgan,
  createDiagnosticsAPI,
  prewarmDiagnosticsOrgan
} from "./aiDiagnostics.js";

import {
  DiagnosticsWriteMeta,
  createDiagnosticsWriteOrgan,
  prewarmDiagnosticsWriteOrgan
} from "./aiDiagnosticsWrite.js";

import {
  SCRIBE_META,
  formatDebugReport,
  formatDebugString,
  prewarmScribe
} from "./aiDebug.js";

import { createPermissionsEngine } from "./aiPermissionsEngine-v16.js";
import { createBoundariesEngine } from "./aiBoundariesEngine-v16.js";
import { createPersonaEngine } from "./persona.js";

import {
  createContextEngine,
  prewarmContextEngine
} from "./aiContextEngine.js";

import createCognitiveFrame, {
  COGNITIVE_FRAME_META,
  prewarmCognitiveFrame
} from "./aiContext.js";

import { createCortex, prewarmAICortex } from "./aiCortex-v11-Evo.js";
import { createRouterEngine } from "./aiRouter-v16.js";
import { runAI, ExecutionEngineMeta } from "./aiEngine-v16.js";

import aiDeliveryEngine, { prewarmDeliveryEngine } from "./aiDeliveryEngine.js";
import aiEmotionEngine, { prewarmEmotionEngine } from "./aiEmotionEngine.js";
import createEarnAPI, { EarnMeta, prewarmEarnOrgan } from "./aiEarn-v16.js";

import { createTouristAPI } from "./aiTourist.js";
import { createArchitectAPI } from "./aiArchitect.js";
import { createDoctorOrgan } from "./aiDoctorAssistant.js";
import { createDoctorArchitectOrgan } from "./aiDoctorArchitect.js";

import { createAIOrganism } from "./aiOrganism-v16.js";

import {
  getProxyContext,
  getProxyPressure,
  getProxyBoost,
  getProxyFallback,
  getProxyMode,
  getProxyLineage
} from "../PULSE-PROXY/PulseProxyContext-v16.js";

import { createPulseAIChunker } from "./PulseAIChunker.js";

// ============================================================================
//  DUAL-BAND CONTEXT
// ============================================================================
const DUAL_BAND_CONTEXT = Object.freeze({
  layer: "DualBandOrganism",
  role: "DUAL_BAND_BRIDGE",
  version: "v16-Immortal-ORGANISM",
  lineage: "pulse-dual-band-v16-Immortal-ORGANISM",
  evo: Object.freeze({
    dualBand: true,
    binaryFirst: true,
    deterministic: true,
    organism: true,
    proxyAware: true,
    chunkAware: true,
    cacheAware: true,
    arteryAware: true
  })
});

// ============================================================================
//  DUALBAND CHUNKER (32-LANE, NON-MIND)
// ============================================================================
const dualBandChunker = createPulseAIChunker({
  id: "PulseAIChunker-DualBandOrganism",
  defaultChunkSize: 4096,
  maxChunkSize: 65536,
  trace: false
});

dualBandChunker.prewarmPattern("dualband_artery", {
  defaultChunkSize: 2048,
  maxChunkSize: 16384,
  band: "symbolic"
});

dualBandChunker.prewarmPattern("cognitive_frame", {
  defaultChunkSize: 4096,
  maxChunkSize: 32768,
  band: "symbolic"
});

dualBandChunker.prewarmPattern("diagnostics", {
  defaultChunkSize: 2048,
  maxChunkSize: 16384,
  band: "symbolic"
});

// ============================================================================
//  HELPERS — PRESSURE + ARTERY + PROXY OVERLAY
// ============================================================================
function extractBinaryPressure(binaryVitals = {}) {
  if (binaryVitals?.layered?.organism?.pressure != null)
    return binaryVitals.layered.organism.pressure;
  if (binaryVitals?.binary?.pressure != null)
    return binaryVitals.binary.pressure;
  return 0;
}

function bucketPressure(v) {
  if (v >= 0.9) return "overload";
  if (v >= 0.7) return "high";
  if (v >= 0.4) return "medium";
  if (v > 0)   return "low";
  return "none";
}

function buildProxyOverlay() {
  const proxyCtx = getProxyContext?.() || {};
  const proxyPressure = getProxyPressure?.() ?? 0;
  const proxyBoost = getProxyBoost?.() ?? 0;
  const proxyFallback = !!getProxyFallback?.();
  const proxyMode = getProxyMode?.() || "standard";
  const proxyLineage = getProxyLineage?.() || null;

  const pressureDelta = proxyPressure * 0.3;
  const fallbackPenalty = proxyFallback ? 0.15 : 0;

  return Object.freeze({
    proxyContext: proxyCtx,
    proxyPressure,
    proxyBoost,
    proxyFallback,
    proxyMode,
    proxyLineage,
    pressureDelta,
    fallbackPenalty
  });
}

function dualBandArtery({ diagnostics = {}, binaryVitals = {} } = {}) {
  const baseBinaryPressure = extractBinaryPressure(binaryVitals);
  const proxyOverlay = buildProxyOverlay();

  const mismatchCount = diagnostics.mismatches?.length || 0;
  const missingCount = diagnostics.missingFields?.length || 0;
  const slowdownCount = diagnostics.slowdownCauses?.length || 0;
  const drift = diagnostics.driftDetected === true;

  const localPressure =
    (mismatchCount ? 0.2 : 0) +
    (missingCount ? 0.1 : 0) +
    (slowdownCount ? 0.2 : 0) +
    (drift ? 0.3 : 0);

  let pressure = 0.6 * localPressure + 0.4 * baseBinaryPressure;

  pressure += proxyOverlay.pressureDelta;
  pressure += proxyOverlay.fallbackPenalty;

  pressure = Math.max(0, Math.min(1, pressure));

  const artery = Object.freeze({
    organism: {
      pressure,
      pressureBucket: bucketPressure(pressure)
    },
    diagnostics: {
      mismatches: mismatchCount,
      missingFields: missingCount,
      slowdown: slowdownCount,
      drift
    },
    proxy: {
      pressure: proxyOverlay.proxyPressure,
      boost: proxyOverlay.proxyBoost,
      fallback: proxyOverlay.proxyFallback,
      mode: proxyOverlay.proxyMode,
      lineage: proxyOverlay.proxyLineage
    }
  });

  const arteryChunks = dualBandChunker.chunkJSON(artery, {
    label: "dualband_artery",
    band: "symbolic"
  });

  return { artery, arteryChunks };
}

// ============================================================================
//  DUAL‑BAND BRIDGE PREWARM ENGINE — v16‑IMMORTAL-ORGANISM
// ============================================================================
export function prewarmDualBandBridge({ trace = false } = {}) {
  try {
    JSON.stringify({
      intent: "prewarm",
      personaId: "ARCHITECT",
      safetyMode: "standard",
      flags: { stable: true }
    });

    prewarmDepsLayer();
    prewarmDiagnosticsOrgan();
    prewarmDiagnosticsWriteOrgan();
    prewarmScribe();

    prewarmEmotionEngine();
    prewarmDeliveryEngine();

    prewarmContextEngine();
    prewarmCognitiveFrame();
    prewarmEarnOrgan(null, null, null);
    prewarmAICortex();

    emitDepsPacket();
    formatDebugReport({ trace: ["prewarm"] }, null);
    formatDebugString({ trace: ["prewarm"] }, null);

    const warmContextEngine = createContextEngine({});
    const warmFrame = warmContextEngine.buildContextFrame({
      brainstem: { context: { userId: "prewarm" } },
      request: { intent: "prewarm" },
      routerPacket: { personaId: "ARCHITECT", reasoning: ["prewarm"] },
      persona: { id: "ARCHITECT" },
      binaryVitals: { throughput: 1 },
      dualBand: { organism: { organismSnapshot: () => ({}) } }
    });

    createCognitiveFrame({
      request: { intent: "prewarm" },
      routing: { personaId: "ARCHITECT", reasoning: ["prewarm"] },
      organismSnapshot: { binary: {}, symbolic: {} }
    });

    dualBandChunker.chunkJSON(warmFrame || {}, {
      label: "cognitive_frame",
      band: "symbolic"
    });

    dualBandChunker.chunkJSON(
      {
        diagnostics: { mismatches: [], missingFields: [], slowdownCauses: [] },
        binaryVitals: { throughput: 1 }
      },
      { label: "diagnostics", band: "symbolic" }
    );

    if (trace) {
      console.log("[DualBandBridge v16] prewarm complete");
    }

    return true;
  } catch (err) {
    console.error("[DualBandBridge Prewarm v16] Failed:", err);
    return false;
  }
}

// ============================================================================
//  createDualBandOrganism() — v16‑IMMORTAL-ORGANISM
// ============================================================================
export function createDualBandOrganism({
  trace = false,
  db,
  fsAPI,
  routeAPI,
  schemaAPI,
  binaryVitals = {},
  diagnostics = {}
} = {}) {
  prewarmDualBandBridge({ trace });

  const organism = createAIOrganism({ trace });

  const context = {
    ...DUAL_BAND_CONTEXT,
    trace
  };

  const deps = Object.freeze({
    meta: DepsMeta,
    db: db || getDb({ trace }),
    fsAPI: fsAPI || getFsAPI({ trace }),
    routeAPI: routeAPI || getRouteAPI({ trace }),
    schemaAPI: schemaAPI || getSchemaAPI({ trace }),
    organismSnapshot: () =>
      getOrganismSnapshot({
        binary: { vitals: organism.vitals },
        symbolic: null
      }),
    emitDepsPacket
  });

  const diagnosticsState = createDiagnosticsState(diagnostics || {});
  const diagnosticsAPI = createDiagnosticsAPI(diagnosticsState);

  const diagnosticsWriteOrgan = createDiagnosticsWriteOrgan({
    context,
    backend: deps.db
  });

  const diagnosticsOrgan = attachDiagnosticsOrgan(diagnosticsState, {
    diagnosticsAPI,
    diagnosticsWriteOrgan
  });

  const scribe = {
    meta: SCRIBE_META,
    formatDebugReport,
    formatDebugString
  };

  const personaEngine = createPersonaEngine({ context, db: deps.db });
  const boundariesEngine = createBoundariesEngine({ context, db: deps.db });
  const permissionsEngine = createPermissionsEngine({ context, db: deps.db });

  const emotionEngine = aiEmotionEngine({ context, personaEngine });

  const router = createRouterEngine({
    context,
    personaEngine,
    boundariesEngine,
    permissionsEngine,
    emotionEngine
  });

  const cortex = createCortex({
    context,
    router,
    personaEngine,
    boundariesEngine,
    permissionsEngine,
    emotionEngine,
    encoder: organism.agent,
    diagnosticsOrgan,
    trace
  });

  const contextEngine = createContextEngine({
    safetyFrame: boundariesEngine,
    experienceFrame: null,
    emotionEngine
  });

  function buildCognitiveFrame(request = {}) {
    const brainstemSnapshot = organism.organismSnapshot();
    const routerPacket = router?.getLastPacket?.() || {};
    const persona = personaEngine?.getActivePersona?.() || {};

    const frame = createCognitiveFrame({
      request,
      routing: {
        personaId: routerPacket.personaId || persona.id || null,
        persona,
        permissions: persona.permissions || {},
        boundaries: persona.boundaries || {},
        dualBand: { primary: "binary", secondary: "symbolic" },
        reasoning: routerPacket.reasoning || []
      },
      organismSnapshot: {
        binary: brainstemSnapshot.binary || null,
        symbolic: brainstemSnapshot.symbolic || null
      },
      emotionEngine
    });

    const frameChunks = dualBandChunker.chunkJSON(frame || {}, {
      label: "cognitive_frame",
      band: "symbolic"
    });

    return { frame, frameChunks };
  }

  const doctor = createDoctorOrgan({
    logStep: msg => trace && console.log("[Doctor]", msg)
  });

  const doctorArchitect = createDoctorArchitectOrgan({
    logStep: msg => trace && console.log("[DoctorArchitect]", msg)
  });

  const delivery = aiDeliveryEngine;

  const architect = createArchitectAPI({
    context,
    db: deps.db,
    router,
    cortex,
    delivery
  });

  const tourist = createTouristAPI({
    context,
    db: deps.db,
    router,
    cortex,
    delivery
  });

  const earn = createEarnAPI(deps.db, null, null);

  function encodeToBinary(value) {
    return organism.agent.encode(value);
  }

  function decodeFromBinary(bits) {
    return organism.agent.decode(bits);
  }

  function symbolicComputeToBinary(value) {
    const bits = encodeToBinary(value);
    const resultBits = organism.pipeline.run(bits);
    return decodeFromBinary(resultBits);
  }

  function symbolicReflexToBinary(event) {
    const bits = encodeToBinary(event);
    const reflexBits = organism.reflex.run(bits);
    return reflexBits ? decodeFromBinary(reflexBits) : null;
  }

  function syncSymbolicVitalsToBinary(symbolicVitals) {
    return {
      symbolicVitals,
      organismSnapshot: organism.organismSnapshot()
    };
  }

  function syncBinaryVitalsToSymbolic() {
    return organism.organismSnapshot();
  }

  const diagnosticsSnapshot = diagnosticsState.snapshot
    ? diagnosticsState.snapshot()
    : diagnostics;

  const { artery, arteryChunks } = dualBandArtery({
    diagnostics: diagnosticsSnapshot,
    binaryVitals
  });

  // SIDE DESIGN: dualband scan surface for this organism instance
  function dualBandScanSurface() {
    const { frame } = buildCognitiveFrame({});
    const diagChunks = dualBandChunker.chunkJSON(
      diagnosticsSnapshot || {},
      { label: "diagnostics", band: "symbolic" }
    );

    const contextChunks = dualBandChunker.chunkJSON(
      frame || {},
      { label: "cognitive_frame", band: "symbolic" }
    );

    return Object.freeze({
      meta: {
        layer: "DualBandScanSurface",
        role: "SCAN_SURFACE",
        version: "v16-Immortal-ORGANISM",
        evo: {
          deterministic: true,
          driftProof: true,
          readOnly: true,
          chunkAware: true,
          arteryAware: true
        }
      },
      artery,
      arteryChunks,
      contextChunks,
      diagnosticsChunks: diagChunks
    });
  }

  const dualBand = Object.freeze({
    meta: DualBandMeta,
    context,
    deps,
    artery,
    arteryChunks,

    symbolic: Object.freeze({
      cortex,
      router,
      personaEngine,
      boundariesEngine,
      permissionsEngine,
      architect,
      tourist,
      contextEngine,
      buildCognitiveFrame,
      doctor,
      doctorArchitect,
      diagnosticsMeta: DiagnosticsMeta,
      diagnosticsAPI,
      diagnosticsWriteOrgan,
      diagnosticsOrgan,
      diagnosticsWriteMeta: DiagnosticsWriteMeta,
      scribe,
      delivery,
      emotionEngine,
      earn,
      earnMeta: EarnMeta,

      execution: {
        meta: ExecutionEngineMeta,
        run: (request, operation) =>
          runAI(
            request,
            operation,
            {
              db: deps.db,
              fsAPI: deps.fsAPI,
              routeAPI: deps.routeAPI,
              schemaAPI: deps.schemaAPI
            },
            dualBand
          )
      }
    }),

    organism,
    bridge: Object.freeze({
      encodeToBinary,
      decodeFromBinary,
      symbolicComputeToBinary,
      symbolicReflexToBinary,
      syncSymbolicVitalsToBinary,
      syncBinaryVitalsToSymbolic
    }),

    chunker: dualBandChunker,
    scanSurface: dualBandScanSurface
  });

  return dualBand;
}

// ============================================================================
//  PUBLIC API — v16‑IMMORTAL-ORGANISM
// ============================================================================
export const DualBandAPI = {
  DualBandMeta,
  create: createDualBandOrganism,
  prewarm: prewarmDualBandBridge,
  chunker: dualBandChunker
};

export default DualBandAPI;
