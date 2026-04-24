/**
 * aiBinaryEvolution.js — Pulse OS v11‑EVO Organ
 * ---------------------------------------------------------
 * CANONICAL ROLE:
 *   This organ is the **Binary Evolution Engine** of Pulse OS.
 *
 *   It is the first organ that:
 *     • observes other organs
 *     • generates binary signatures
 *     • detects drift
 *     • detects mutation
 *     • detects structural changes
 *     • enforces organism identity
 *
 *   This is the “genetic layer” of Pulse OS.
 *
 * WHY THIS ORGAN EXISTS:
 *   Every OS today has:
 *     - no identity
 *     - no structural awareness
 *     - no drift detection
 *     - no organ signatures
 *     - no evolution model
 *
 *   Pulse OS v11‑EVO breaks this pattern.
 *
 *   This organ enforces:
 *       “THE ORGANISM MUST KNOW ITSELF.”
 *
 * ARCHITECTURAL INTENT:
 *   This organ is NOT:
 *     - a linter
 *     - a validator
 *     - a compiler
 *     - a router
 *     - a scanner
 *
 *   This organ IS:
 *     - a binary signature generator
 *     - a drift detector
 *     - an organ auditor
 *     - a structural evolution engine
 *
 *   It ensures:
 *     • organs remain canonical
 *     • no mutation occurs
 *     • no recursion appears
 *     • no hydra roots form
 *     • no drift between versions
 *
 * SIGNATURE MODEL:
 *   A signature is a binary hash of:
 *     - organ code
 *     - organ config
 *     - organ metadata
 *
 *   Signatures are stored in binary memory.
 *   Drift is detected by comparing signatures.
 *
 * FUTURE EVOLUTION NOTES:
 *   This organ will eventually support:
 *     - organ lineage
 *     - organ ancestry
 *     - organ deltas
 *     - organ evolution rules
 *     - organism-wide versioning
 *
 *   But NOT in this file.
 *   This file must remain pure.
 */

class AIBinaryEvolution {
  constructor(config = {}) {
    /**
     * CONFIG INTENT:
     *   id        → for ProofLogger / CNS attendance
     *   encoder   → aiBinaryAgent instance (required)
     *   memory    → aiBinaryMemory instance (required)
     *   trace     → deterministic visibility hook
     */
    this.id = config.id || 'ai-binary-evolution';
    this.encoder = config.encoder;
    this.memory = config.memory;
    this.trace = !!config.trace;

    if (!this.encoder || typeof this.encoder.encode !== 'function') {
      throw new Error('AIBinaryEvolution requires aiBinaryAgent encoder');
    }
    if (!this.memory || typeof this.memory.write !== 'function') {
      throw new Error('AIBinaryEvolution requires aiBinaryMemory');
    }
  }

  // ---------------------------------------------------------
  //  ORGAN SIGNATURE GENERATION
  // ---------------------------------------------------------

  /**
   * generateSignature(organ)
   * ------------------------
   * Produces a binary signature for an organ.
   *
   * DESIGN NOTES:
   *   - Organ is stringified (code + metadata)
   *   - Encoded into binary
   *   - Returned as binary string
   */
  generateSignature(organ) {
    const json = JSON.stringify({
      id: organ.id || null,
      keys: Object.keys(organ),
      type: organ.constructor.name,
    });

    const binary = this.encoder.encode(json);
    this._trace('generateSignature', { organ: organ.id, bits: binary.length });

    return binary;
  }

  // ---------------------------------------------------------
  //  SIGNATURE STORAGE
  // ---------------------------------------------------------

  /**
   * storeSignature(organ)
   * ---------------------
   * Stores the organ's signature in binary memory.
   */
  storeSignature(organ) {
    const signature = this.generateSignature(organ);
    const key = this.encoder.encode(`signature:${organ.id}`);

    this.memory.write(key, signature);

    this._trace('storeSignature', {
      organ: organ.id,
      bits: signature.length,
    });

    return signature;
  }

  /**
   * loadSignature(organ)
   * --------------------
   * Loads the stored signature for an organ.
   */
  loadSignature(organ) {
    const key = this.encoder.encode(`signature:${organ.id}`);
    const stored = this.memory.read(key);

    this._trace('loadSignature', { organ: organ.id, storedBits: stored?.length });

    return stored || null;
  }

  // ---------------------------------------------------------
  //  DRIFT DETECTION
  // ---------------------------------------------------------

  /**
   * detectDrift(organ)
   * ------------------
   * Compares current signature to stored signature.
   *
   * RETURNS:
   *   - null → no drift
   *   - { oldSig, newSig } → drift detected
   */
  detectDrift(organ) {
    const oldSig = this.loadSignature(organ);
    const newSig = this.generateSignature(organ);

    if (!oldSig) {
      this._trace('detectDrift:firstSignature', { organ: organ.id });
      return { oldSig: null, newSig };
    }

    if (oldSig === newSig) {
      this._trace('detectDrift:noDrift', { organ: organ.id });
      return null;
    }

    this._trace('detectDrift:driftDetected', {
      organ: organ.id,
      oldBits: oldSig.length,
      newBits: newSig.length,
    });

    return { oldSig, newSig };
  }

  // ---------------------------------------------------------
  //  EVOLUTION UPDATE
  // ---------------------------------------------------------

  /**
   * evolve(organ)
   * -------------
   * Detects drift → stores new signature → returns evolution result.
   */
  evolve(organ) {
    const drift = this.detectDrift(organ);

    if (!drift) {
      return {
        evolved: false,
        message: 'No drift detected',
      };
    }

    this.storeSignature(organ);

    return {
      evolved: true,
      oldSignature: drift.oldSig,
      newSignature: drift.newSig,
    };
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

function createAIBinaryEvolution(config) {
  return new AIBinaryEvolution(config);
}

module.exports = {
  AIBinaryEvolution,
  createAIBinaryEvolution,
};
