/**
 * aiBinaryOrganism.js — Pulse OS v11‑EVO Organ
 * ---------------------------------------------------------
 * CANONICAL ROLE:
 *   This file is the **Binary Organism Bootloader**.
 *
 *   It assembles:
 *     - BinaryAgent
 *     - BinaryMemory
 *     - BinaryPipeline
 *     - BinaryReflex
 *     - BinaryLoggerAdapter
 *     - BinaryPageScannerAdapter
 *     - BinaryEvolution
 *     - BinaryGovernorAdapter
 *     - BinaryOrganRegistry
 *     - BinaryDelta
 *     - BinaryConductor
 *
 *   It is the **root of the organism**.
 *   It is the **canonical assembly point**.
 *   It is the **v11‑EVO bootloader**.
 *
 * WHY THIS ORGAN EXISTS:
 *   Without a root bootloader:
 *     - organs float independently
 *     - wiring becomes ad‑hoc
 *     - drift appears
 *     - recursion risks emerge
 *     - identity becomes unstable
 *
 *   Pulse OS v11‑EVO breaks this pattern.
 *
 *   This file enforces:
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

const { createAIBinaryAgent } = require('./aiBinaryAgent');
const { createAIBinaryMemory } = require('./aiBinaryMemory');
const { createAIBinaryPipeline } = require('./aiBinaryPipeline');
const { createAIBinaryReflex } = require('./aiBinaryReflex');
const { createAIBinaryLoggerAdapter } = require('./aiBinaryLoggerAdapter');
const { createAIBinaryPageScannerAdapter } = require('./aiBinaryPageScannerAdapter');
const { createAIBinaryEvolution } = require('./aiBinaryEvolution');
const { createAIBinaryGovernorAdapter } = require('./aiBinaryGovernorAdapter');
const { createAIBinaryOrganRegistry } = require('./aiBinaryOrganRegistry');
const { createAIBinaryDelta } = require('./aiBinaryDelta');
const { createAIBinaryConductor } = require('./aiBinaryConductor');

class AIBinaryOrganism {
  constructor(config = {}) {
    this.id = config.id || 'ai-binary-organism';
    this.trace = !!config.trace;

    // ---------------------------------------------------------
    //  CREATE ORGANS
    // ---------------------------------------------------------

    this.agent = createAIBinaryAgent({ id: 'binary-agent', trace: this.trace });
    this.memory = createAIBinaryMemory({ id: 'binary-memory', trace: this.trace });
    this.pipeline = createAIBinaryPipeline({ id: 'binary-pipeline', trace: this.trace });
    this.reflex = createAIBinaryReflex({ id: 'binary-reflex', trace: this.trace });
    this.evolution = createAIBinaryEvolution({
      id: 'binary-evolution',
      encoder: this.agent,
      memory: this.memory,
      trace: this.trace,
    });
    this.registry = createAIBinaryOrganRegistry({
      id: 'binary-organ-registry',
      encoder: this.agent,
      memory: this.memory,
      evolution: this.evolution,
      trace: this.trace,
    });
    this.delta = createAIBinaryDelta({ id: 'binary-delta', trace: this.trace });

    this.logger = createAIBinaryLoggerAdapter({
      id: 'binary-logger-adapter',
      encoder: this.agent,
      logger: config.logger, // external ProofLogger
      trace: this.trace,
    });

    this.governorAdapter = createAIBinaryGovernorAdapter({
      id: 'binary-governor-adapter',
      encoder: this.agent,
      governor: config.governor, // external Governor organ
      trace: this.trace,
    });

    this.pageScannerAdapter = createAIBinaryPageScannerAdapter({
      id: 'binary-pagescanner-adapter',
      encoder: this.agent,
      trace: this.trace,
    });

    this.conductor = createAIBinaryConductor({
      id: 'binary-conductor',
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
    //  WIRE ORGANISM
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
  //  PUBLIC API
  // ---------------------------------------------------------

  /**
   * sense(event)
   * ------------
   * Feeds a PageScanner event into the organism.
   */
  sense(event) {
    this.pageScannerAdapter._handleScannerEvent(event);
  }

  /**
   * compute(value)
   * --------------
   * Runs a value through the binary pipeline.
   */
  compute(value) {
    const binary = this.agent.encode(value);
    return this.pipeline.run(binary);
  }

  /**
   * evolveOrgan(organId)
   * --------------------
   * Evolves a specific organ.
   */
  evolveOrgan(organId) {
    const organ = this.conductor.get(organId);
    if (!organ) return null;
    return this.registry.evolveOrgan(organ);
  }

  /**
   * organismSnapshot()
   * ------------------
   * Returns a binary snapshot of the entire organism.
   */
  organismSnapshot() {
    return this.memory.snapshot();
  }

  // ---------------------------------------------------------
  //  INTERNAL HELPERS
  // ---------------------------------------------------------

  _trace(event, payload) {
    if (!this.trace) return;
    console.log(`[${this.id}] ${event}`, payload);
  }
}

// ---------------------------------------------------------
// FACTORY EXPORT
// ---------------------------------------------------------

function createAIBinaryOrganism(config) {
  return new AIBinaryOrganism(config);
}

module.exports = {
  AIBinaryOrganism,
  createAIBinaryOrganism,
};
