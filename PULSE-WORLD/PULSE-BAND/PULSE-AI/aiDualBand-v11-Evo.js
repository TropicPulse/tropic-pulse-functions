// ============================================================================
//  aiDualBand-v14-IMMORTAL.js
//  PULSE OS v14-IMMORTAL — Dual-Band Bridge (Symbolic ↔ Binary)
//  Organism Bridge • Context Engine • Clinical + Structural + ScanFile Aware
//  PURE BRIDGE. ZERO MUTATION. ZERO RANDOMNESS.
// ============================================================================
/*
AI_EXPERIENCE_META = {
  identity: "aiDualband",
  version: "v14-IMMORTAL",
  layer: "ai_core",
  role: "dualband_bridge",
  lineage: "aiDualband-v11 → v13.0-EVO+++ → v14-IMMORTAL",

  evo: {
    dualBand: true,
    symbolicPrimary: true,
    binaryPrimary: true,
    bandSwitching: true,
    hydrationAware: true,
    dehydrationAware: true,

    deterministic: true,
    driftProof: true,
    pureCompute: true,
    zeroNetwork: true,
    zeroFilesystem: true,
    zeroMutationOfInput: true
  },

  contract: {
    always: ["aiEngine", "aiCortex", "aiContextEngine"],
    never: ["safeRoute", "fetchViaCNS"]
  }
}
*/

export const DualBandMeta = Object.freeze({
  layer: "PulseAIDualBandKernel",
  role: "DUAL_BAND_BRIDGE_ORGAN",
  version: "14-IMMORTAL",
  identity: "aiDualBandBridge-v14-IMMORTAL",

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
    epoch: "14-IMMORTAL"
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

import { createPermissionsEngine } from "./aiPermissionsEngine-v11-Evo.js";
import { createBoundariesEngine } from "./aiBoundariesEngine-v11-Evo.js";
import { createPersonaEngine } from "./persona.js";

import {
  createContextEngine,
  prewarmContextEngine
} from "./aiContextEngine.js";

import createCognitiveFrame, {
  COGNITIVE_FRAME_META,
  prewarmCognitiveFrame
} from "./aiContext.js"; // canonical name

import { createCortex, prewarmAICortex } from "./aiCortex-v11-Evo.js";
import { createRouterEngine } from "./aiRouter-v11-Evo.js";
import { runAI, ExecutionEngineMeta } from "./aiEngine.js";

import aiDeliveryEngine, { prewarmDeliveryEngine } from "./aiDeliveryEngine.js";
import aiEmotionEngine, { prewarmEmotionEngine } from "./aiEmotionEngine.js";
import createEarnAPI, { EarnMeta, prewarmEarnOrgan } from "./aiEarn.js";

import { createTouristAPI } from "./aiTourist.js";
import { createArchitectAPI } from "./aiArchitect.js";
import { createDoctorOrgan } from "./aiDoctor.js";
import { createDoctorArchitectOrgan } from "./aiDoctorArchitect.js";

import { createAIOrganism } from "./aiOrganism.js";

// ============================================================================
//  DUAL-BAND CONTEXT
// ============================================================================
const DUAL_BAND_CONTEXT = Object.freeze({
  layer: "DualBandOrganism",
  role: "DUAL_BAND_BRIDGE",
  version: "14-IMMORTAL",
  lineage: "pulse-dual-band-v14-IMMORTAL",
  evo: Object.freeze({
    dualBand: true,
    binaryFirst: true,
    deterministic: true,
    organism: true
  })
});

// ============================================================================
//  HELPERS — PRESSURE + ARTERY
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

function dualBandArtery({ diagnostics = {}, binaryVitals = {} } = {}) {
  const binaryPressure = extractBinaryPressure(binaryVitals);

  const mismatchCount = diagnostics.mismatches?.length || 0;
  const missingCount = diagnostics.missingFields?.length || 0;
  const slowdownCount = diagnostics.slowdownCauses?.length || 0;
  const drift = diagnostics.driftDetected === true;

  const localPressure =
    (mismatchCount ? 0.2 : 0) +
    (missingCount ? 0.1 : 0) +
    (slowdownCount ? 0.2 : 0) +
    (drift ? 0.3 : 0);

  const pressure = Math.max(
    0,
    Math.min(1, 0.6 * localPressure + 0.4 * binaryPressure)
  );

  return Object.freeze({
    organism: {
      pressure,
      pressureBucket: bucketPressure(pressure)
    },
    diagnostics: {
      mismatches: mismatchCount,
      missingFields: missingCount,
      slowdown: slowdownCount,
      drift
    }
  });
}

// ============================================================================
//  DUAL‑BAND BRIDGE PREWARM ENGINE — v14‑IMMORTAL
// ============================================================================
export function prewarmDualBandBridge({ trace = false } = {}) {
  try {
    // Warm symbolic → binary encoding
    JSON.stringify({
      intent: "prewarm",
      personaId: "ARCHITECT",
      safetyMode: "standard",
      flags: { stable: true }
    });

    // Deps + diagnostics + scribe
    prewarmDepsLayer();
    prewarmDiagnosticsOrgan();
    prewarmDiagnosticsWriteOrgan();
    prewarmScribe();

    // Emotion + delivery
    prewarmEmotionEngine();
    prewarmDeliveryEngine();

    // Context + cognitive + cortex + earn
    prewarmContextEngine();
    prewarmCognitiveFrame();
    prewarmEarnOrgan(null, null, null);
    prewarmAICortex();

    // Warm deps packet + scribe formatting explicitly
    emitDepsPacket();
    formatDebugReport({ trace: ["prewarm"] }, null);
    formatDebugString({ trace: ["prewarm"] }, null);

    // Warm context engine fusion
    const warmContextEngine = createContextEngine({});
    warmContextEngine.buildContextFrame({
      brainstem: { context: { userId: "prewarm" } },
      request: { intent: "prewarm" },
      routerPacket: { personaId: "ARCHITECT", reasoning: ["prewarm"] },
      persona: { id: "ARCHITECT" },
      binaryVitals: { throughput: 1 },
      dualBand: { organism: { organismSnapshot: () => ({}) } }
    });

    // Warm cognitive frame
    createCognitiveFrame({
      request: { intent: "prewarm" },
      routing: { personaId: "ARCHITECT", reasoning: ["prewarm"] },
      organismSnapshot: { binary: {}, symbolic: {} }
    });

    if (trace) {
      console.log("[DualBandBridge] prewarm complete");
    }

    return true;
  } catch (err) {
    console.error("[DualBandBridge Prewarm] Failed:", err);
    return false;
  }
}

// ============================================================================
//  createDualBandOrganism() — v14‑IMMORTAL
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
  // ⭐ PREWARM LAYERS (order matters)
  prewarmDualBandBridge({ trace });

  // --------------------------------------------------------------------------
  // ORGANISM CORE
  // --------------------------------------------------------------------------
  const organism = createAIOrganism({ trace });

  const context = {
    ...DUAL_BAND_CONTEXT,
    trace
  };

  // --------------------------------------------------------------------------
  // DEPS LAYER
  // --------------------------------------------------------------------------
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

  // --------------------------------------------------------------------------
  // DIAGNOSTICS + SCRIBE + DIAGNOSTICS WRITE
  // --------------------------------------------------------------------------
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

  // --------------------------------------------------------------------------
  // PERSONA / BOUNDARIES / PERMISSIONS
  // --------------------------------------------------------------------------
  const personaEngine = createPersonaEngine({ context, db: deps.db });
  const boundariesEngine = createBoundariesEngine({ context, db: deps.db });
  const permissionsEngine = createPermissionsEngine({ context, db: deps.db });

  // --------------------------------------------------------------------------
  // EMOTION ENGINE
  // --------------------------------------------------------------------------
  const emotionEngine = aiEmotionEngine({ context, personaEngine });

  // --------------------------------------------------------------------------
  // ROUTER + CORTEX
  // --------------------------------------------------------------------------
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

  // --------------------------------------------------------------------------
  // CONTEXT ENGINE + COGNITIVE FRAME
  // --------------------------------------------------------------------------
  const contextEngine = createContextEngine({
    safetyFrame: boundariesEngine,
    experienceFrame: null,
    emotionEngine
  });

  function buildCognitiveFrame(request = {}) {
    const brainstemSnapshot = organism.organismSnapshot();
    const routerPacket = router?.getLastPacket?.() || {};
    const persona = personaEngine?.getActivePersona?.() || {};

    return createCognitiveFrame({
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
  }

  // --------------------------------------------------------------------------
  // CLINICAL + STRUCTURAL ORGANS
  // --------------------------------------------------------------------------
  const doctor = createDoctorOrgan({
    logStep: msg => trace && console.log("[Doctor]", msg)
  });

  const doctorArchitect = createDoctorArchitectOrgan({
    logStep: msg => trace && console.log("[DoctorArchitect]", msg)
  });

  // --------------------------------------------------------------------------
  // DELIVERY ENGINE (v14-IMMORTAL, pure object)
// --------------------------------------------------------------------------
  const delivery = aiDeliveryEngine;

  // --------------------------------------------------------------------------
  // ARCHITECT + TOURIST
  // --------------------------------------------------------------------------
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

  // --------------------------------------------------------------------------
  // EARN ORGAN
  // --------------------------------------------------------------------------
  const earn = createEarnAPI(deps.db, null, null);

  // --------------------------------------------------------------------------
  // BINARY BRIDGE HELPERS
  // --------------------------------------------------------------------------
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

  // --------------------------------------------------------------------------
  // DUAL-BAND SURFACE
  // --------------------------------------------------------------------------
  const artery = dualBandArtery({
    diagnostics: diagnosticsState.snapshot
      ? diagnosticsState.snapshot()
      : diagnostics,
    binaryVitals
  });

  const dualBand = Object.freeze({
    meta: DualBandMeta,
    context,
    deps,
    artery,

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
    })
  });

  return dualBand;
}

// ============================================================================
//  PUBLIC API — v14‑IMMORTAL
// ============================================================================
export const DualBandAPI = {
  DualBandMeta,
  create: createDualBandOrganism,
  prewarm: prewarmDualBandBridge
};

export default DualBandAPI;
