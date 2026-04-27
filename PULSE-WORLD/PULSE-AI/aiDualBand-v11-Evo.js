// ============================================================================
//  aiDualBand-v11-Evo.js
//  PULSE OS v11-EVO — Dual-Band Bridge (Symbolic ↔ Binary)
//  Organism Bridge • Context Engine • Clinical + Structural + ScanFile Aware
//  PURE BRIDGE. ZERO MUTATION. ZERO RANDOMNESS.
// ============================================================================

export const DualBandMeta = Object.freeze({
  layer: "PulseAIDualBandKernel",
  role: "DUAL_BAND_BRIDGE_ORGAN",
  version: "11.1-EVO",
  identity: "aiDualBandBridge-v11-EVO",

  evo: Object.freeze({
    driftProof: true,
    deterministic: true,
    dualband: true,
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
    epoch: "v11-EVO"
  }),

  contract: Object.freeze({
    purpose:
      "Bind the symbolic Pulse OS to the dualband organism, providing a unified dual-band surface for all AI services.",

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
      "preserve organism identity",
      "preserve drift-proof architecture"
    ])
  })
});

// ============================================================================
//  IMPORTS (ESM syntax preserved)
// ============================================================================
import { createAIOrganism } from "./aiOrganism.js";
import { createPersonaEngine } from "./persona.js";
import { createBoundariesEngine } from "./boundaries.js";
import { createPermissionsEngine } from "./permissions.js";
import { createRouterEngine } from "./aiRouter-v11-Evo.js";
import { createCortex } from "./aiCortex-v11-Evo.js";
import { createTouristAPI } from "./aiTourist.js";
import { createArchitectAPI } from "./aiArchitect.js";

import { createContextEngine } from "./aiContextEngine.js";
import createCognitiveFrame, { COGNITIVE_FRAME_META } from "./aiCognitiveFrame.js";

import { createDoctorOrgan } from "./aiDoctor.js";
import { createDoctorArchitectOrgan } from "./aiDoctorArchitect.js";

import { SCRIBE_META, formatDebugReport, formatDebugString } from "./aiScribe.js";
import {
  DiagnosticsMeta,
  createDiagnosticsState,
  attachDiagnosticsOrgan,
  createDiagnosticsAPI
} from "./aiDiagnostics.js";
import { DiagnosticsWriteMeta, createDiagnosticsWriteOrgan } from "./aiDiagnosticsWrite.js";

import aiDeliveryEngine from "./aiDeliveryEngine.js";
import depsSurface, {
  DepsMeta,
  getDb,
  getFsAPI,
  getRouteAPI,
  getSchemaAPI,
  getOrganismSnapshot,
  emitDepsPacket
} from "./aiDeps.js";

// ============================================================================
//  DUAL-BAND CONTEXT
// ============================================================================
const DUAL_BAND_CONTEXT = Object.freeze({
  layer: "DualBandOrganism",
  role: "DUAL_BAND_BRIDGE",
  version: "11.1-EVO",
  lineage: "pulse-dual-band-v11-evo",
  evo: Object.freeze({
    dualBand: true,
    binaryFirst: true,
    deterministic: true,
    organism: true
  })
});

// ============================================================================
//  createDualBandOrganism()
// ============================================================================
export function createDualBandOrganism({
  trace = false,
  db,
  fsAPI,
  routeAPI,
  schemaAPI
} = {}) {
  const organism = createAIOrganism({ trace });

  const context = {
    ...DUAL_BAND_CONTEXT,
    trace
  };

  // --------------------------------------------------------------------------
  // DEPS LAYER (DB / FS / ROUTES / SCHEMAS / ORGANISM SNAPSHOT)
  // --------------------------------------------------------------------------
  const deps = Object.freeze({
    meta: DepsMeta,
    db: db || getDb({ trace }),
    fsAPI: fsAPI || getFsAPI({ trace }),
    routeAPI: routeAPI || getRouteAPI({ trace }),
    schemaAPI: schemaAPI || getSchemaAPI({ trace }),
    organismSnapshot: () => getOrganismSnapshot({ binary: { vitals: organism.vitals }, symbolic: null }),
    emitDepsPacket
  });

  // --------------------------------------------------------------------------
  // PERSONA / BOUNDARIES / PERMISSIONS
  // --------------------------------------------------------------------------
  const personaEngine = createPersonaEngine({ context, db: deps.db });
  const boundariesEngine = createBoundariesEngine({ context, db: deps.db });
  const permissionsEngine = createPermissionsEngine({ context, db: deps.db });

  // --------------------------------------------------------------------------
  // ROUTER + CORTEX
  // --------------------------------------------------------------------------
  const router = createRouterEngine({
    context,
    personaEngine,
    boundariesEngine,
    permissionsEngine
  });

  const cortex = createCortex({
    context,
    router,
    personaEngine,
    boundariesEngine,
    permissionsEngine
  });

  // --------------------------------------------------------------------------
  // CONTEXT ENGINE + COGNITIVE FRAME
  // --------------------------------------------------------------------------
  const contextEngine = createContextEngine({
    safetyFrame: null,
    experienceFrame: null
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
        dualBand: {
          primary: "binary",
          secondary: "symbolic"
        },
        reasoning: routerPacket.reasoning || []
      },
      organismSnapshot: {
        binary: brainstemSnapshot.binary || null,
        symbolic: brainstemSnapshot.symbolic || null
      }
    });

    return frame;
  }

  // --------------------------------------------------------------------------
  // CLINICAL + STRUCTURAL ORGANS
  // --------------------------------------------------------------------------
  const doctor = createDoctorOrgan({
    logStep: (msg) => trace && console.log("[Doctor]", msg)
  });

  const doctorArchitect = createDoctorArchitectOrgan({
    logStep: (msg) => trace && console.log("[DoctorArchitect]", msg)
  });

  // --------------------------------------------------------------------------
  // DIAGNOSTICS + SCRIBE + DIAGNOSTICS WRITE
  // --------------------------------------------------------------------------
  const diagnosticsAPI = createDiagnosticsAPI();

  const scribe = {
    meta: SCRIBE_META,
    formatDebugReport,
    formatDebugString
  };

  const diagnosticsWrite = (ctx, backend) =>
    createDiagnosticsWriteOrgan({ context: ctx, backend });

  // --------------------------------------------------------------------------
  // DELIVERY ENGINE
  // --------------------------------------------------------------------------
  const delivery = aiDeliveryEngine;

  // --------------------------------------------------------------------------
  // ARCHITECT + TOURIST (EXISTING)
  // --------------------------------------------------------------------------
  const architect = createArchitectAPI({ context, db: deps.db });
  const tourist = createTouristAPI({ context, db: deps.db });

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
    const snapshot = organism.organismSnapshot();
    return { symbolicVitals, organismSnapshot: snapshot };
  }

  function syncBinaryVitalsToSymbolic() {
    return organism.organismSnapshot();
  }

  // --------------------------------------------------------------------------
  // DUAL-BAND SURFACE
  // --------------------------------------------------------------------------
  const dualBand = Object.freeze({
    meta: DualBandMeta,
    context,

    deps,

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
      diagnosticsAPI,
      scribe,
      diagnosticsWrite,
      delivery
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
//  bootDualBandOrganism()
// ============================================================================
export async function bootDualBandOrganism(options = {}) {
  const dualBand = createDualBandOrganism({
    ...options,
    trace: options.trace
  });

  return dualBand;
}

// ============================================================================
//  DEFAULT EXPORT — DUAL-BAND KERNEL SURFACE
// ============================================================================
export const PulseDualBandKernel = Object.freeze({
  ...DUAL_BAND_CONTEXT,
  meta: DualBandMeta,
  create: createDualBandOrganism,
  boot: bootDualBandOrganism
});

// ============================================================================
//  DUAL‑MODE EXPORTS (ESM + CommonJS)
// ============================================================================
export {
  DualBandMeta,
  createDualBandOrganism,
  bootDualBandOrganism,
  PulseDualBandKernel
};

if (typeof module !== "undefined") {
  module.exports = {
    DualBandMeta,
    createDualBandOrganism,
    bootDualBandOrganism,
    PulseDualBandKernel
  };
}
