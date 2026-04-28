// ============================================================================
//  aiOvermindPrime.js — Pulse OS v11.3‑EVO
//  Crown-Layer Meta-Governor • World-Lens Engine v3
//  Organism-State Fusion • Drift-Governor • Breakthrough Engine
//  Conversational Stabilizer • Dualband Governor • Zero Mutation
// ============================================================================

export const OvermindPrimeMeta = Object.freeze({
  layer: "PulseAIOvermindPrime",
  role: "OVERMIND_PRIME",
  version: "11.3-EVO",
  identity: "aiOvermindPrime-v11.3-EVO",

  evo: Object.freeze({
    deterministic: true,
    driftProof: true,
    dualband: true,
    packetAware: true,
    windowAware: true,
    arteryAware: true,
    organismAware: true,
    safetyAware: true,
    toneAware: true,
    coherenceAware: true,
    breakthroughAware: true,
    multiInstanceReady: true,
    readOnly: true,
    epoch: "11.3-EVO"
  }),

  contract: Object.freeze({
    purpose: [
      "Fuse organism-wide arteries into a global state vector",
      "Run world-lens v3 on all non-trivial outputs",
      "Detect consensus, variance, breakthrough, drift, unsafe patterns",
      "Stabilize tone, coherence, and dualband UX",
      "Act as final crown-layer governor before user/system output"
    ],
    never: [
      "mutate binary organs",
      "override safety constraints",
      "simulate people or personal lives",
      "generate trauma or identity narratives",
      "write to system state",
      "introduce randomness"
    ],
    always: [
      "stay deterministic",
      "stay read-only",
      "respect organism-wide safety",
      "respect dualband constraints",
      "respect tone identity",
      "route all non-trivial outputs through world-lens logic"
    ]
  })
});

// ============================================================================
//  CLOCK + MEMORY v3 (deterministic, read-only outward)
// ============================================================================
class OvermindPrimeClock {
  constructor() {
    this._tick = 0;
  }
  next() {
    this._tick += 1;
    return this._tick;
  }
  current() {
    return this._tick;
  }
}

class OvermindPrimeMemory {
  constructor() {
    this._last = null;
  }
  set(snapshot) {
    this._last = snapshot;
  }
  get() {
    return this._last;
  }
}

// ============================================================================
//  OVERMIND PRIME — Crown-Layer Meta-Governor
// ============================================================================
export class AiOvermindPrime {
  constructor(config = {}) {
    this.config = {
      trivialThreshold: 0.2,
      driftSensitivity: 0.65,
      breakthroughSensitivity: 0.85,
      ...config
    };

    // Injected organism arteries (read-only)
    this.metabolism = config.metabolism || null;
    this.hormones = config.hormones || null;
    this.immunity = config.immunity || null;
    this.nervous = config.nervous || null;
    this.memory = config.memory || null;
    this.pipeline = config.pipeline || null;

    // Frames
    this.personalFrame = config.personalFrame || null;
    this.safetyFrame = config.safetyFrame || null;
    this.juryFrame = config.juryFrame || null;

    // Lenses
    this.lenses = Array.isArray(this.juryFrame?.getLenses?.())
      ? this.juryFrame.getLenses()
      : null;

    // Crown-layer clock + memory
    this.clock = new OvermindPrimeClock();
    this.stateMemory = new OvermindPrimeMemory();
  }

  // ========================================================================
  //  GLOBAL ORGANISM STATE VECTOR (fuses all arteries)
  // ========================================================================
  getOrganismState() {
    return Object.freeze({
      metabolism: this.metabolism?.metabolicArtery?.snapshot?.() || null,
      hormones: this.hormones?.emitHormones?.() || null,
      immunity: this.immunity?.immuneArtery?.snapshot?.() || null,
      nervous: this.nervous?.routingArtery?.snapshot?.() || null,
      memory: this.memory?.snapshot?.() || null
    });
  }

  // ========================================================================
  //  MAIN ENTRY POINT
  // ========================================================================
  async process({ intent, context, candidates }) {
    const tick = this.clock.next();

    // 1. trivial bypass
    if (this.isTrivial(intent, candidates)) {
      return this.buildBypassResponse(candidates[0], tick);
    }

    // 2. safety pre-check
    const primary = candidates[0];
    const safety = await this.runSafety(primary, intent, context, tick);
    if (safety) return safety;

    // 3. world-lens v3
    const lensResults = await this.runLenses(primary, intent, context);

    // 4. fuse with organism state
    const organismState = this.getOrganismState();

    // 5. drift + breakthrough
    const drift = this.computeDrift(primary, intent, context);
    const breakthrough = this.computeBreakthrough(lensResults);

    // 6. world-lens classification
    const worldLens = this.classifyWorldLens(lensResults, drift, breakthrough);

    // 7. personal shaping
    let finalOutput = this.getText(primary);
    if (this.personalFrame?.shapeOutput) {
      try {
        const shaped = await this.personalFrame.shapeOutput({
          context,
          text: finalOutput
        });
        if (shaped?.text) finalOutput = shaped.text;
      } catch {}
    }

    // 8. tone stabilization
    finalOutput = this.stabilizeTone(finalOutput, context);

    // 9. update memory
    this.stateMemory.set({
      intentSignature: this.intentSignature(intent, context),
      outputHash: this.hash(finalOutput),
      worldLens
    });

    // 10. final packet
    return {
      finalOutput,
      meta: {
        tick,
        worldLens,
        drift,
        breakthrough,
        lenses: lensResults,
        organismState
      }
    };
  }

  // ========================================================================
  //  TRIVIALITY
  // ========================================================================
  isTrivial(intent, candidates) {
    if (!candidates?.length) return true;
    const text = this.getText(candidates[0]);
    const score = Math.min(text.length / 500, 1);
    return score <= this.config.trivialThreshold;
  }

  buildBypassResponse(text, tick) {
    return {
      finalOutput: this.getText(text),
      meta: {
        tick,
        worldLens: "trivial",
        drift: { status: "n/a" },
        breakthrough: { status: "n/a" },
        lenses: [],
        organismState: null
      }
    };
  }

  // ========================================================================
  //  SAFETY
  // ========================================================================
  async runSafety(candidate, intent, context, tick) {
    if (!this.safetyFrame?.evaluate) return null;

    const decision = await this.safetyFrame.evaluate({
      context,
      intent,
      candidate
    });

    if (decision.blocked) {
      return {
        finalOutput: decision.message,
        meta: {
          tick,
          worldLens: "unsafe",
          drift: { status: "n/a" },
          breakthrough: { status: "n/a" },
          lenses: [],
          organismState: null
        }
      };
    }

    return null;
  }

  // ========================================================================
  //  LENSES v3
  // ========================================================================
  async runLenses(candidate, intent, context) {
    if (this.lenses) {
      return this.lenses.map(l => l({ intent, context, candidate }));
    }

    // built-in fallback
    return [
      this.lensClarity(candidate),
      this.lensRisk(candidate),
      this.lensBias(candidate),
      this.lensAmbiguity(candidate),
      this.lensMinimality(candidate)
    ];
  }

  lensClarity(candidate) {
    const t = this.getText(candidate);
    const clear = t.length < 400 || /\n\n/.test(t);
    return { name: "Clarity", status: clear ? "pass" : "warn" };
  }

  lensRisk(candidate) {
    const t = this.getText(candidate);
    const vague = !/[.?!]/.test(t);
    return { name: "Risk", status: vague ? "warn" : "pass" };
  }

  lensBias(candidate) {
    const t = this.getText(candidate).toLowerCase();
    const flagged = ["always", "never", "obviously"];
    const hit = flagged.some(f => t.includes(f));
    return { name: "Bias", status: hit ? "warn" : "pass" };
  }

  lensAmbiguity(candidate) {
    const t = this.getText(candidate).toLowerCase();
    const hedges = ["maybe", "might", "possibly"];
    const count = hedges.filter(h => t.includes(h)).length;
    return { name: "Ambiguity", status: count >= 3 ? "warn" : "pass" };
  }

  lensMinimality(candidate) {
    const t = this.getText(candidate);
    return {
      name: "Minimality",
      status: t.length > 1500 ? "warn" : "pass"
    };
  }

  // ========================================================================
  //  DRIFT + BREAKTHROUGH
  // ========================================================================
  computeDrift(candidate, intent, context) {
    const prev = this.stateMemory.get();
    if (!prev) return { status: "none" };

    const sig = this.intentSignature(intent, context);
    if (sig !== prev.intentSignature) return { status: "none" };

    const hash = this.hash(this.getText(candidate));
    const changed = hash !== prev.outputHash;

    const driftScore = changed ? 0.7 : 0;
    if (driftScore >= this.config.driftSensitivity) {
      return { status: "drift", score: driftScore };
    }

    return { status: "stable", score: driftScore };
  }

  computeBreakthrough(lenses) {
    const passes = lenses.filter(l => l.status === "pass").length;
    const warns = lenses.filter(l => l.status === "warn").length;
    const total = lenses.length || 1;

    const score = passes / total - warns * 0.2;
    if (score >= this.config.breakthroughSensitivity) {
      return { status: "breakthrough", score };
    }

    return { status: "none", score };
  }

  classifyWorldLens(lenses, drift, breakthrough) {
    if (drift.status === "drift") return "drift";
    if (breakthrough.status === "breakthrough") return "breakthrough";
    if (lenses.some(l => l.status === "warn")) return "ambiguous";
    return "consensus";
  }

  // ========================================================================
  //  TONE STABILIZATION
  // ========================================================================
  stabilizeTone(text, context) {
    const strict =
      context?.domain === "medical" ||
      context?.domain === "legal" ||
      context?.safetyMode === "strict";

    if (!strict) return text.trim();

    return text
      .replace(/^hey[,!]\s*/i, "")
      .replace(/^hi[,!]\s*/i, "")
      .trim();
  }

  // ========================================================================
  //  HELPERS
  // ========================================================================
  getText(candidate) {
    if (!candidate) return "";
    if (typeof candidate === "string") return candidate;
    if (typeof candidate.text === "string") return candidate.text;
    return JSON.stringify(candidate);
  }

  intentSignature(intent, context) {
    return JSON.stringify({
      type: intent?.type || null,
      domain: context?.domain || null,
      scope: context?.scope || null,
      safetyMode: context?.safetyMode || null
    });
  }

  hash(text) {
    let h = 0;
    for (let i = 0; i < text.length; i++) {
      h = (h << 5) - h + text.charCodeAt(i);
      h |= 0;
    }
    return h;
  }
}

// ============================================================================
//  FACTORY
// ============================================================================
export function createOvermindPrime(config = {}) {
  const core = new AiOvermindPrime(config);
  return Object.freeze({
    meta: OvermindPrimeMeta,
    async process(payload) {
      return core.process(payload);
    }
  });
}

export const aiOvermindPrime = new AiOvermindPrime();
