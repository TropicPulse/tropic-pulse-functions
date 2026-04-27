// ============================================================================
//  aiDualBand-v11-Evo.js
//  PULSE OS v11-EVO — Dual-Band Bridge (Symbolic ↔ Binary)
// ============================================================================

const DualBandMeta = Object.freeze({
  layer: "PulseAIDualBandKernel",
  role: "DUAL_BAND_BRIDGE_ORGAN",
  version: "11.0-EVO",
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

// ============================================================================
//  DUAL-BAND CONTEXT
// ============================================================================
const DUAL_BAND_CONTEXT = {
  layer: "DualBandOrganism",
  role: "DUAL_BAND_BRIDGE",
  version: "11.0-EVO",
  lineage: "pulse-dual-band-v11-evo",
  evo: {
    dualBand: true,
    binaryFirst: true,
    deterministic: true,
    organism: true
  }
};

// ============================================================================
//  createDualBandOrganism()
// ============================================================================
function createDualBandOrganism({ trace = false, db, fsAPI, routeAPI, schemaAPI } = {}) {
  const organism = createAIOrganism({ trace });

  const context = {
    ...DUAL_BAND_CONTEXT,
    trace
  };

  const personaEngine = createPersonaEngine({ context, db });
  const boundariesEngine = createBoundariesEngine({ context, db });
  const permissionsEngine = createPermissionsEngine({ context, db });

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

  const architect = createArchitectAPI({ context, db });
  const tourist = createTouristAPI({ context, db });

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

  const dualBand = Object.freeze({
    context,

    symbolic: {
      cortex,
      router,
      personaEngine,
      boundariesEngine,
      permissionsEngine,
      architect,
      tourist
    },

    organism,

    bridge: {
      encodeToBinary,
      decodeFromBinary,
      symbolicComputeToBinary,
      symbolicReflexToBinary,
      syncSymbolicVitalsToBinary,
      syncBinaryVitalsToSymbolic
    }
  });

  return dualBand;
}

// ============================================================================
//  bootDualBandOrganism()
// ============================================================================
async function bootDualBandOrganism(options = {}) {
  const dualBand = createDualBandOrganism({
    ...options,
    trace: options.trace
  });

  return dualBand;
}

// ============================================================================
//  DEFAULT EXPORT — DUAL-BAND KERNEL SURFACE
// ============================================================================
const PulseDualBandKernel = {
  ...DUAL_BAND_CONTEXT,
  create: createDualBandOrganism,
  boot: bootDualBandOrganism
};

// ============================================================================
//  DUAL‑MODE EXPORTS (ESM + CommonJS)
// ============================================================================

// ESM
export {
  DualBandMeta,
  createDualBandOrganism,
  bootDualBandOrganism,
  PulseDualBandKernel
};

// CommonJS
module.exports = {
  DualBandMeta,
  createDualBandOrganism,
  bootDualBandOrganism,
  PulseDualBandKernel
};
