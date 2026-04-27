/**
 * aiOrganism.js — Pulse OS v11‑EVO Organ
 * ---------------------------------------------------------
 * CANONICAL ROLE:
 *   This file is the **Organism Bootloader** (dualband).
 *
 *   It assembles:
 *     - BinaryAgent  (true binary)
 *     - Memory       (dualband)
 *     - Pipeline     (dualband)
 *     - Reflex       (dualband)
 *     - LoggerAdapter
 *     - PageScannerAdapter
 *     - BinaryEvolution (true binary)
 *     - GovernorAdapter
 *     - OrganRegistry
 *     - BinaryDelta (true binary)
 *     - Conductor
 *
 *   It is the **root of the organism**.
 *   It is the **canonical assembly point**.
 *   It is the **v11‑EVO dualband bootloader**.
 *
 * WHY THIS ORGAN EXISTS:
 *   Without a root bootloader:
 *     - organs float independently
 *     - wiring becomes ad‑hoc
 *     - drift appears
 *     - recursion risks emerge
 *     - identity becomes unstable
 *
 *   Pulse OS v11‑EVO enforces:
 *       “THE ORGANISM MUST BE ASSEMBLED CANONICALLY.”
 *
 * ARCHITECTURAL INTENT:
 *   This file is NOT:
 *     - a router
 *     - a governor
 *     - a pipeline
 *     - a reflex engine
 *
 *   This file IS:
 *     - the organism constructor
 *     - the root assembly layer
 *     - the deterministic bootloader
 *     - the canonical organ map
 *
 * FUTURE EVOLUTION NOTES:
 *   This file will eventually support:
 *     - multi-organism bootloading
 *     - organism lineage
 *     - organism snapshots
 *     - organism deltas
 *
 *   But NOT in this file.
 *   This file must remain pure.
 */

// ---------------------------------------------------------
//  META BLOCK — v11‑EVO (DUALBAND)
// ---------------------------------------------------------

export const OrganismMeta = Object.freeze({
  layer: "OrganismRoot",
  role: "DUALBAND_ORGANISM_BOOTLOADER",
  version: "11.0-EVO",
  identity: "aiOrganism-v11-EVO",

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
    multiInstanceReady: true,
    epoch: "v11-EVO"
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

// ---------------------------------------------------------
//  ORGANISM IMPLEMENTATION (imports unchanged)
// ---------------------------------------------------------

const { createAIBinaryAgent } = require('./aiBinaryAgent');
const { createAIBinaryMemory } = require('./aiMemory');
const { createAIBinaryPipeline } = require('./aiBinaryPipeline');
const { createAIBinaryReflex } = require('./aiBinaryReflex');
const { createAIBinaryLoggerAdapter } = require('./aiLoggerAdapter');
const { createAIBinaryPageScannerAdapter } = require('./aiBinaryPageScannerAdapter');
const { createAIBinaryEvolution } = require('./aiBinaryEvolution');
const { createAIBinaryGovernorAdapter } = require('./aiGovernorAdapter');
const { createAIBinaryOrganRegistry } = require('./aiBinaryOrganRegistry');
const { createAIBinaryDelta } = require('./aiBinaryDelta');
const { createAIBinaryConductor } = require('./aiConductor');

class AIOrganism {
  constructor(config = {}) {
    this.id = config.id || 'ai-organism';
    this.trace = !!config.trace;

    // ---------------------------------------------------------
    //  CREATE ORGANS (names unchanged, IDs upgraded)
    // ---------------------------------------------------------

    this.agent = createAIBinaryAgent({ id: 'agent', trace: this.trace });
    this.memory = createAIBinaryMemory({ id: 'memory', trace: this.trace });
    this.pipeline = createAIBinaryPipeline({ id: 'pipeline', trace: this.trace });
    this.reflex = createAIBinaryReflex({ id: 'reflex', trace: this.trace });

    this.evolution = createAIBinaryEvolution({
      id: 'evolution',
      encoder: this.agent,
      memory: this.memory,
      trace: this.trace,
    });

    this.registry = createAIBinaryOrganRegistry({
      id: 'organ-registry',
      encoder: this.agent,
      memory: this.memory,
      evolution: this.evolution,
      trace: this.trace,
    });

    this.delta = createAIBinaryDelta({ id: 'delta', trace: this.trace });

    this.logger = createAIBinaryLoggerAdapter({
      id: 'logger-adapter',
      encoder: this.agent,
      logger: config.logger,
      trace: this.trace,
    });

    this.governorAdapter = createAIBinaryGovernorAdapter({
      id: 'governor-adapter',
      encoder: this.agent,
      governor: config.governor,
      trace: this.trace,
    });

    this.pageScannerAdapter = createAIBinaryPageScannerAdapter({
      id: 'pagescanner-adapter',
      encoder: this.agent,
      trace: this.trace,
    });

    this.conductor = createAIBinaryConductor({
      id: 'conductor',
      trace: this.trace,
    });

    // ---------------------------------------------------------
    //  REGISTER ORGANS WITH CONDUCTOR
    // ---------------------------------------------------------

    const organs = [
      this.agent,
      this.memory,
      this.pipeline,
      this.reflex,
      this.logger,
      this.pageScannerAdapter,
      this.evolution,
      this.registry,
      this.delta,
      this.governorAdapter,
      this.conductor,
    ];

    for (const organ of organs) {
      this.conductor.register(organ);
    }

    // ---------------------------------------------------------
    //  WIRE ORGANISM (unchanged)
    // ---------------------------------------------------------

    this.conductor.wireBinaryPipeline({
      pipeline: this.pipeline,
      reflex: this.reflex,
      logger: this.logger,
      governorAdapter: this.governorAdapter,
    });

    this.conductor.wirePageScanner({
      scannerAdapter: this.pageScannerAdapter,
      pipeline: this.pipeline,
      reflex: this.reflex,
      logger: this.logger,
    });

    this.conductor.wireEvolution({
      evolution: this.evolution,
      registry: this.registry,
    });

    // ---------------------------------------------------------
    //  INITIALIZE ORGANISM
    // ---------------------------------------------------------

    this.conductor.initialize(this.registry, this.evolution);

    this._trace('organism:initialized', {
      organCount: organs.length,
    });
  }

  // ---------------------------------------------------------
  //  PUBLIC API (unchanged)
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

// ---------------------------------------------------------
// FACTORY EXPORT
// ---------------------------------------------------------

function createAIOrganism(config) {
  return new AIOrganism(config);
}

module.exports = {
  AIOrganism,
  createAIOrganism,
  OrganismMeta
};
