/**
 * aiBinaryConductor.js — Pulse OS v11‑EVO Organ
 * ---------------------------------------------------------
 * CANONICAL ROLE:
 *   This organ is the **Binary Conductor** of Pulse OS.
 *
 *   It orchestrates:
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
 *
 *   It does NOT:
 *     - compute
 *     - mutate
 *     - interpret
 *     - decide
 *
 *   It ONLY:
 *     - wires organs together
 *     - initializes the organism
 *     - ensures deterministic connections
 *     - prevents drift in orchestration
 *
 * WHY THIS ORGAN EXISTS:
 *   Without a conductor:
 *     - organs connect ad‑hoc
 *     - drift appears
 *     - recursion risks emerge
 *     - ordering becomes unstable
 *     - debugging becomes impossible
 *
 *   Pulse OS v11‑EVO breaks this pattern.
 *
 *   This organ enforces:
 *       “THE ORGANISM MUST BE ORCHESTRATED, NOT ENTANGLED.”
 *
 * ARCHITECTURAL INTENT:
 *   This organ is NOT:
 *     - a router
 *     - a governor
 *     - a scheduler
 *     - a pipeline
 *     - a reflex engine
 *
 *   This organ IS:
 *     - a deterministic wiring layer
 *     - a structural orchestrator
 *     - a binary-first initialization engine
 *     - a drift-proof connection map
 *
 * FUTURE EVOLUTION NOTES:
 *   This organ will eventually support:
 *     - multi-organism orchestration
 *     - organ dependency graphs
 *     - organ lifecycle management
 *     - binary health checks
 *
 *   But NOT in this file.
 *   This file must remain pure.
 */

class AIBinaryConductor {
  constructor(config = {}) {
    /**
     * CONFIG INTENT:
     *   id        → for ProofLogger / CNS attendance
     *   trace     → deterministic visibility hook
     */
    this.id = config.id || 'ai-binary-conductor';
    this.trace = !!config.trace;

    /**
     * INTERNAL STRUCTURE:
     *   organs: Map<string, organInstance>
     */
    this.organs = new Map();
  }

  // ---------------------------------------------------------
  //  ORGAN REGISTRATION
  // ---------------------------------------------------------

  /**
   * register(organ)
   * ---------------
   * Registers an organ with the conductor.
   */
  register(organ) {
    if (!organ || !organ.id) {
      throw new Error('register requires an organ with an id');
    }

    this.organs.set(organ.id, organ);

    this._trace('register', { organ: organ.id });
  }

  /**
   * get(id)
   * -------
   * Retrieves an organ by ID.
   */
  get(id) {
    return this.organs.get(id) || null;
  }

  // ---------------------------------------------------------
  //  ORCHESTRATION
  // ---------------------------------------------------------

  /**
   * wireBinaryPipeline(pipeline, reflex, logger, governorAdapter)
   * ------------------------------------------------------------
   * Wires pipeline → reflex → governor → logger.
   */
  wireBinaryPipeline({ pipeline, reflex, logger, governorAdapter }) {
    if (logger) {
      logger.attachToPipeline(pipeline);
    }

    if (governorAdapter) {
      governorAdapter.attachToPipeline(pipeline);
    }

    if (reflex) {
      if (logger) logger.attachToReflex(reflex);
      if (governorAdapter) governorAdapter.attachToReflex(reflex);
    }

    this._trace('wireBinaryPipeline', {
      pipeline: pipeline?.id,
      reflex: reflex?.id,
      logger: logger?.id,
      governorAdapter: governorAdapter?.id,
    });
  }

  /**
   * wirePageScanner(scannerAdapter, pipeline, reflex, logger)
   * ---------------------------------------------------------
   * Wires PageScanner → binary pipeline/reflex/logger.
   */
  wirePageScanner({ scannerAdapter, pipeline, reflex, logger }) {
    if (pipeline) scannerAdapter.pipeline = pipeline;
    if (reflex) scannerAdapter.reflex = reflex;
    if (logger) scannerAdapter.logger = logger;

    this._trace('wirePageScanner', {
      scannerAdapter: scannerAdapter?.id,
      pipeline: pipeline?.id,
      reflex: reflex?.id,
      logger: logger?.id,
    });
  }

  /**
   * wireEvolution(evolution, registry)
   * ----------------------------------
   * Wires evolution engine → organ registry.
   */
  wireEvolution({ evolution, registry }) {
    registry.evolution = evolution;

    this._trace('wireEvolution', {
      evolution: evolution?.id,
      registry: registry?.id,
    });
  }

  // ---------------------------------------------------------
  //  ORGANISM INITIALIZATION
  // ---------------------------------------------------------

  /**
   * initialize()
   * ------------
   * Runs initial registration + evolution for all organs.
   */
  initialize(registry, evolution) {
    for (const organ of this.organs.values()) {
      registry.registerOrgan(organ);

      if (evolution) {
        evolution.storeSignature(organ);
      }
    }

    this._trace('initialize', {
      organCount: this.organs.size,
    });
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

function createAIBinaryConductor(config) {
  return new AIBinaryConductor(config);
}

module.exports = {
  AIBinaryConductor,
  createAIBinaryConductor,
};
