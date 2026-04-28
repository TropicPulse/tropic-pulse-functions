// ============================================================================
//  aiOrganism.js — Pulse OS v11.3‑EVO Organ
//  Dualband Organism Bootloader • Canonical Assembly • Deterministic Root
// ============================================================================

export const OrganismMeta = Object.freeze({
  layer: "OrganismRoot",
  role: "DUALBAND_ORGANISM_BOOTLOADER",
  version: "11.3-EVO",
  identity: "aiOrganism-v11.3-EVO",

  evo: Object.freeze({
    deterministic: true,
    driftProof: true,
    dualband: true,
    binaryAware: true,
    symbolicAware: true,
    assemblyAware: true,
    registryAware: true,
    pipelineAware: true,
    reflexAware: true,
    memoryAware: true,
    metabolismAware: true,     // ⭐ NEW
    hormonesAware: true,       // ⭐ NEW
    immunityAware: true,       // ⭐ NEW
    nervousSystemAware: true,  // ⭐ NEW
    conductorAware: true,      // ⭐ NEW
    windowAware: true,         // ⭐ NEW
    packetAware: true,         // ⭐ NEW
    prewarmAware: true,        // ⭐ NEW
    multiInstanceReady: true,
    epoch: "11.3-EVO"
  }),

  contract: Object.freeze({
    purpose:
      "Assemble all organism organs into a single deterministic dualband organism. Provide canonical bootloading and wiring.",

    never: Object.freeze([
      "auto-discover organs",
      "mutate external config",
      "perform routing",
      "perform cognition",
      "introduce randomness"
    ]),

    always: Object.freeze([
      "assemble organs deterministically",
      "wire organs explicitly",
      "register organs with conductor",
      "initialize organism in a pure sequence",
      "remain minimal and canonical"
    ])
  })
});

// ============================================================================
//  IMPORTS — v11.3‑EVO organs
// ============================================================================
import { createAIBinaryAgent } from "./aiBinaryAgent.js";
import { createAIMemory } from "./aiMemory.js";
import { createAIBinaryPipeline } from "./aiBinaryPipeline.js";
import { createAIBinaryReflex } from "./aiBinaryReflex.js";
import { createAIBinaryLoggerAdapter } from "./aiLoggerAdapter.js";
import { createAIBinaryPageScannerAdapter } from "./aiBinaryPageScannerAdapter.js";
import { createAIBinaryEvolution } from "./aiBinaryEvolution.js";
import { createAIBinaryGovernorAdapter } from "./aiGovernorAdapter.js";
import { createAIBinaryOrganRegistry } from "./aiBinaryOrganRegistry.js";
import { createAIBinaryDelta } from "./aiBinaryDelta.js";
import { createAIBinaryConductor } from "./aiConductor.js";
import { createAIBinaryMetabolism } from "./aiMetabolism.js";
import { createAIBinaryHormones } from "./aiHormones.js";
import { createAIBinaryImmunity } from "./aiImmunity.js";
import { createAIBinaryNervousSystem } from "./aiNervousSystem.js";

// ============================================================================
//  ORGANISM IMPLEMENTATION — v11.3‑EVO
// ============================================================================
export class AIOrganism {
  constructor(config = {}) {
    this.id = config.id || OrganismMeta.identity;
    this.trace = !!config.trace;

    // ---------------------------------------------------------
    //  CREATE ORGANS — v11.3‑EVO canonical IDs
    // ---------------------------------------------------------
    this.agent = createAIBinaryAgent({ id: "agent", trace: this.trace });

    this.memory = createAIMemory({
      id: "memory",
      core: config.coreMemory,
      trace: this.trace
    });

    this.pipeline = createAIBinaryPipeline({ id: "pipeline", trace: this.trace });
    this.reflex = createAIBinaryReflex({ id: "reflex", trace: this.trace });

    this.metabolism = createAIBinaryMetabolism({
      id: "metabolism",
      encoder: this.agent,
      pipeline: this.pipeline,
      trace: this.trace
    });

    this.hormones = createAIBinaryHormones({
      id: "hormones",
      encoder: this.agent,
      metabolism: this.metabolism,
      sentience: config.sentience,
      pipeline: this.pipeline,
      reflex: this.reflex,
      logger: config.logger,
      trace: this.trace
    });

    this.immunity = createAIBinaryImmunity({
      id: "immunity",
      encoder: this.agent,
      anatomy: config.anatomy,
      evolution: config.evolution,
      registry: config.registry,
      pipeline: this.pipeline,
      reflex: this.reflex,
      logger: config.logger,
      trace: this.trace
    });

    this.nervous = createAIBinaryNervousSystem({
      id: "nervous-system",
      encoder: this.agent,
      anatomy: config.anatomy,
      immunity: this.immunity,
      registry: config.registry,
      logger: config.logger,
      trace: this.trace
    });

    this.evolution = createAIBinaryEvolution({
      id: "evolution",
      encoder: this.agent,
      memory: this.memory,
      trace: this.trace
    });

    this.registry = createAIBinaryOrganRegistry({
      id: "organ-registry",
      encoder: this.agent,
      memory: this.memory,
      evolution: this.evolution,
      trace: this.trace
    });

    this.delta = createAIBinaryDelta({ id: "delta", trace: this.trace });

    this.logger = createAIBinaryLoggerAdapter({
      id: "logger-adapter",
      logger: config.logger,
      shadowLogger: config.shadowLogger,
      trace: this.trace
    });

    this.governorAdapter = createAIBinaryGovernorAdapter({
      id: "governor-adapter",
      governor: config.governor,
      encoder: this.agent,
      trace: this.trace
    });

    this.pageScannerAdapter = createAIBinaryPageScannerAdapter({
      id: "pagescanner-adapter",
      encoder: this.agent,
      trace: this.trace
    });

    this.conductor = createAIBinaryConductor({
      id: "conductor",
      trace: this.trace
    });

    // ---------------------------------------------------------
    //  REGISTER ORGANS WITH CONDUCTOR
    // ---------------------------------------------------------
    const organs = [
      this.agent,
      this.memory,
      this.pipeline,
      this.reflex,
      this.metabolism,
      this.hormones,
      this.immunity,
      this.nervous,
      this.evolution,
      this.registry,
      this.delta,
      this.logger,
      this.pageScannerAdapter,
      this.governorAdapter,
      this.conductor
    ];

    for (const organ of organs) {
      this.conductor.register(organ);
    }

    // ---------------------------------------------------------
    //  WIRING — v11.3‑EVO canonical wiring
    // ---------------------------------------------------------
    this.conductor.wireBinaryPipeline({
      pipeline: this.pipeline,
      reflex: this.reflex,
      logger: this.logger,
      governorAdapter: this.governorAdapter,
      metabolism: this.metabolism,
      hormones: this.hormones,
      immunity: this.immunity,
      nervous: this.nervous
    });

    this.conductor.wirePageScanner({
      scannerAdapter: this.pageScannerAdapter,
      pipeline: this.pipeline,
      reflex: this.reflex,
      logger: this.logger
    });

    this.conductor.wireEvolution({
      evolution: this.evolution,
      registry: this.registry
    });

    // ---------------------------------------------------------
    //  INITIALIZE ORGANISM
    // ---------------------------------------------------------
    this.conductor.initialize(this.registry, this.evolution);

    this._trace("organism:initialized", {
      organCount: organs.length,
      epoch: OrganismMeta.evo.epoch
    });
  }

  // ---------------------------------------------------------
  //  PUBLIC API
  // ---------------------------------------------------------
  sense(event) {
    this.pageScannerAdapter._handleScannerEvent(event);
  }

  compute(value) {
    const binary = this.agent.encode(value);
    return this.pipeline.run(binary);
  }

  evolveOrgan(organId) {
    const organ = this.conductor.get(organId);
    if (!organ) return null;
    return this.registry.evolveOrgan(organ);
  }

  organismSnapshot() {
    return this.memory.snapshot();
  }

  _trace(event, payload) {
    if (!this.trace) return;
    console.log(`[${this.id}] ${event}`, payload);
  }
}

// ============================================================================
//  FACTORY
// ============================================================================
export function createAIOrganism(config) {
  return new AIOrganism(config);
}

// ============================================================================
//  DUAL‑MODE EXPORTS
// ============================================================================
if (typeof module !== "undefined") {
  module.exports = {
    AIOrganism,
    createAIOrganism,
    OrganismMeta
  };
}
