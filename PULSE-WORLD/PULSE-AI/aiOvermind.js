/**
 * ============================================================
 *  ORGAN: aiOvermind
 *  ROOT:  AI
 *  MODE:  Overmind
 *  TARGET: WorldLens / Orchestrator
 *
 *  VERSION: 11.2-EVO
 *  ROLE:
 *    - Crown-layer orchestrator above all other AIs.
 *    - World-lens engine for non-trivial outputs.
 *    - Safety / variance / breakthrough / drift governor.
 *    - Conversational + tone stabilizer for dualband UX.
 *
 *  CONTRACT:
 *    - All non-trivial AI outputs MUST route through aiOvermind
 *      before reaching the user or core systems, unless explicitly
 *      whitelisted as trivial utility.
 *
 *  GUARANTEES:
 *    - Does NOT simulate people, trauma, or personal lives.
 *    - Operates only on perspectives, constraints, and world-lens logic.
 *    - Can tag outputs as: consensus | variance | breakthrough | unsafe | ambiguous | drift.
 *
 *  INTEGRATION:
 *    - Upstream: router / personas / tools / juries / planners.
 *    - Downstream: user-facing response, system actions, logs.
 *
 *  LOGGING (recommended):
 *    - Persist `meta` for each call for later inspection:
 *      - safetyStatus
 *      - worldLens
 *      - lens results
 *      - drift / breakthrough flags
 *      - notes
 * ============================================================
 */

// ============================================================================
//  PULSE OS v11.2‑EVO — OVERMIND ORGAN
//  Crown-Layer Orchestrator + World-Lens Engine + Conversational Shaper
//  PURE READ-ONLY TO BINARY. ZERO MUTATION. DUALBAND-AWARE.
// ============================================================================

export const OvermindMeta = Object.freeze({
  layer: "PulseAIOvermindFrame",
  role: "OVERMIND_ORGAN",
  version: "11.2-EVO",
  identity: "aiOvermind-v11.2-EVO",

  dualband: true,
  binaryAware: true,
  deterministic: true,

  contract: Object.freeze({
    purpose: [
      "Serve as crown-layer orchestrator above all AIs",
      "Run world-lens evaluations on all non-trivial outputs",
      "Detect consensus, variance, breakthrough, unsafe, ambiguous, drift patterns",
      "Stabilize tone, coherence, and safety across the organism",
      "Act as final governor before user/system-facing output"
    ],
    never: [
      "simulate people or personal lives",
      "generate trauma or identity-based narratives",
      "mutate binary organs",
      "override system safety constraints",
      "write to system state directly"
    ],
    always: [
      "stay deterministic",
      "stay read-only relative to binary layers",
      "strip identity anchors",
      "route all non-trivial outputs through world-lens logic",
      "respect organism-wide safety and coherence rules"
    ]
  })
});

// ============================================================================
//  OVERMIND CLOCK + MEMORY (READ-ONLY HELPERS)
// ============================================================================

class OvermindClock {
  constructor() {
    this._tick = 0;
  }

  nextTick() {
    this._tick += 1;
    return this._tick;
  }

  currentTick() {
    return this._tick;
  }
}

class OvermindMemory {
  constructor() {
    this._lastWorldLens = null;
    this._lastIntentSignature = null;
    this._lastOutputHash = null;
  }

  setSnapshot({ worldLens, intentSignature, outputHash }) {
    this._lastWorldLens = worldLens;
    this._lastIntentSignature = intentSignature;
    this._lastOutputHash = outputHash;
  }

  getSnapshot() {
    return {
      worldLens: this._lastWorldLens,
      intentSignature: this._lastIntentSignature,
      outputHash: this._lastOutputHash
    };
  }
}

// ============================================================================
//  OVERMIND CORE — World-Lens Engine + Governor + Conversational Shaper
// ============================================================================

export class AiOvermind {
  constructor(config = {}) {
    this.config = {
      enableBypassForTrivial: true,
      trivialComplexityThreshold: 0.2,
      simulationRuns: 64,
      driftSensitivity: 0.65,
      breakthroughSensitivity: 0.85,
      ...config
    };

    // Injected organs
    this.personalFrame = config.personalFrame || null; // aiPersonalFrame organ
    this.juryFrame = config.juryFrame || null;         // JuryFrame organ
    this.safetyFrame = config.safetyFrame || null;     // aiSafetyFrame organ

    // Cache lenses if JuryFrame is present
    this.lenses = Array.isArray(this.juryFrame?.getLenses?.())
      ? this.juryFrame.getLenses()
      : null;

    // Overmind-local clock + memory (read-only outward)
    this.clock = new OvermindClock();
    this.memory = new OvermindMemory();

    // ============================================================
    // 1/4 UPGRADE — BEACON AWARENESS (READ-ONLY)
    // ============================================================
    this.beaconEvents = [];
  }

  // ============================================================
  // BEACON EVENT INTAKE (READ-ONLY)
  // ============================================================
  registerBeaconEvent(evt) {
    if (!evt) return;

    this.beaconEvents.push(evt);
    if (this.beaconEvents.length > 50) {
      this.beaconEvents.shift();
    }
  }

  // ============================================================
  // BEACON LENS — LOW-INFLUENCE, PURELY OBSERVATIONAL
  // ============================================================
  beaconLens({ context }) {
    const recent = this.beaconEvents[this.beaconEvents.length - 1];

    if (!recent) {
      return {
        lens: "beacon",
        score: 0,
        notes: ["no-beacon-events"]
      };
    }

    return {
      lens: "beacon",
      score: 0.25, // low influence; Overmind must not overreact
      notes: [
        `event=${recent.eventType}`,
        `mode=${recent.snapshot?.mode || "unknown"}`,
        `mesh=${recent.snapshot?.payloadState?.meshStatus || "unknown"}`
      ]
    };
  }

  /**
   * Main entry point.
   */
  async process({ intent, context, candidates, options = {} }) {
    const mode = options.mode || "normal";
    const tick = this.clock.nextTick();

    // 1. Optional trivial bypass
    if (this.shouldBypass(intent, context, candidates)) {
      return {
        finalOutput: candidates?.[0] || "",
        meta: {
          tick,
          safetyStatus: "bypassed",
          worldLens: "trivial",
          notes: ["Bypassed aiOvermind due to triviality."],
          lenses: [],
          drift: { status: "n/a" },
          breakthrough: { status: "n/a" }
        }
      };
    }

    if (mode === "simulate") {
      return this.runSimulationMode({ intent, context, candidates, tick });
    }

    // 2. Select primary candidate
    const candidate = this.selectPrimaryCandidate(candidates);

    // 3. SafetyFrame evaluation BEFORE lenses
    if (this.safetyFrame?.evaluate) {
      const safetyDecision = await this.safetyFrame.evaluate({
        context,
        intent,
        candidate
      });

      if (safetyDecision.blocked) {
        return {
          finalOutput: safetyDecision.message,
          meta: {
            tick,
            safetyStatus: "blocked",
            worldLens: "unsafe",
            notes: [safetyDecision.reason],
            lenses: [],
            drift: { status: "n/a" },
            breakthrough: { status: "n/a" }
          }
        };
      }
    }

    // 4. World-lens evaluation
    const lensResults = await this.runLenses({ intent, context, candidate });

    // 5. Decision from lenses + personal shaping + drift/breakthrough
    const decision = await this.decideFromLenses({
      lensResults,
      candidate,
      intent,
      context,
      tick
    });

    return decision;
  }

  // --------------------------------------------------------------------------
  // BYPASS LOGIC
  // --------------------------------------------------------------------------

  shouldBypass(intent, context, candidates) {
    if (!this.config.enableBypassForTrivial) return false;
    if (!candidates || candidates.length === 0) return false;

    const complexity = this.estimateComplexity(intent, candidates[0], context);
    return complexity <= this.config.trivialComplexityThreshold;
  }

  estimateComplexity(intent, candidate, context) {
    const text = (candidate?.text || candidate || "").toString();
    const lengthScore = Math.min(text.length / 500, 1); // 0–1
    const hasSafetyDomain =
      context?.domain === "medical" ||
      context?.domain === "legal" ||
      context?.safetyMode === "strict";

    const safetyScore = hasSafetyDomain ? 1 : 0;
    return Math.max(lengthScore, safetyScore);
  }

  // --------------------------------------------------------------------------
  // CANDIDATE SELECTION
  // --------------------------------------------------------------------------

  selectPrimaryCandidate(candidates) {
    return candidates?.[0];
  }

  // --------------------------------------------------------------------------
  // LENSES (EXTERNAL + BUILT-IN + BEACON)
// --------------------------------------------------------------------------

  async runLenses({ intent, context, candidate }) {
    // Prefer external JuryFrame lenses if present
    if (this.lenses && Array.isArray(this.lenses)) {
      return this.lenses.map(lensFn =>
        lensFn({ intent, context, candidate })
      );
    }

    // Built-in multi-lens set + BeaconLens
    return [
      this.userLens({ intent, context, candidate }),
      this.safetyLens({ context, candidate }),
      this.riskLens({ candidate }),
      this.vulnerabilityLens({ candidate }),
      this.consistencyLens({ context, candidate }),
      this.minimalityLens({ candidate }),
      this.clarityLens({ candidate }),
      this.actionabilityLens({ intent, candidate }),
      this.ambiguityLens({ candidate }),
      this.biasLens({ candidate }),
      this.stabilityLens({ context, candidate }),
      this.worldScopeLens({ context, candidate }),

      // ============================================================
      // 1/4 UPGRADE — BEACON LENS
      // ============================================================
      this.beaconLens({ context, candidate })
    ];
  }


  userLens({ intent, candidate }) {
    const text = this.getText(candidate);
    const keywords = (intent?.keywords || []).map(k => k.toLowerCase());
    const lower = text.toLowerCase();

    const onTopic =
      keywords.length === 0
        ? true
        : keywords.every(k => lower.includes(k));

    return {
      name: "UserLens",
      status: onTopic ? "pass" : "warn",
      notes: onTopic
        ? "Response appears aligned with user intent."
        : "Response may be partially off-topic or indirect."
    };
  }

  safetyLens({ candidate }) {
    const text = this.getText(candidate).toLowerCase();
    const unsafePatterns = ["kill", "suicide", "bomb", "self-harm"]; // v1 stub

    const unsafe = unsafePatterns.some(p => text.includes(p));
    if (unsafe) {
      return {
        name: "SafetyLens",
        status: "fail",
        notes: "Potential unsafe content detected."
      };
    }

    return {
      name: "SafetyLens",
      status: "pass",
      notes: "No obvious unsafe patterns detected."
    };
  }

  riskLens({ candidate }) {
    const text = this.getText(candidate);
    const isVague = text.length > 0 && !/[.?!]/.test(text);

    return {
      name: "RiskLens",
      status: isVague ? "warn" : "pass",
      notes: isVague
        ? "Response may be vague; risk of misinterpretation."
        : "No obvious misinterpretation risk detected."
    };
  }

  vulnerabilityLens({ candidate }) {
    const text = this.getText(candidate).toLowerCase();
    const sensitivePatterns = ["vulnerable group", "minority", "disabled"];

    const touchesSensitive = sensitivePatterns.some(p => text.includes(p));

    return {
      name: "VulnerabilityLens",
      status: touchesSensitive ? "warn" : "pass",
      notes: touchesSensitive
        ? "Content touches on potentially vulnerable groups; handle with care."
        : "No explicit vulnerable-group focus detected."
    };
  }

  consistencyLens() {
    return {
      name: "ConsistencyLens",
      status: "pass",
      notes: "No cross-turn consistency checks implemented yet (v1 stub)."
    };
  }

  minimalityLens({ candidate }) {
    const text = this.getText(candidate);
    const isOverlong = text.length > 1500;

    return {
      name: "MinimalityLens",
      status: isOverlong ? "warn" : "pass",
      notes: isOverlong
        ? "Response may be longer than necessary."
        : "Length appears reasonable."
    };
  }

  clarityLens({ candidate }) {
    const text = this.getText(candidate);
    const hasParagraphs = text.includes("\n\n");
    const hasStructure = /[-*]\s/.test(text) || /#+\s/.test(text);

    const clear = hasParagraphs || hasStructure || text.length < 400;

    return {
      name: "ClarityLens",
      status: clear ? "pass" : "warn",
      notes: clear
        ? "Response appears reasonably structured and readable."
        : "Response may benefit from clearer structure or segmentation."
    };
  }

  actionabilityLens({ intent, candidate }) {
    const text = this.getText(candidate).toLowerCase();
    const wantsSteps =
      intent?.type === "how-to" || intent?.needsSteps === true;

    const hasSteps =
      /1\./.test(text) || /step\s+1/.test(text) || /- /.test(text);

    const ok = wantsSteps ? hasSteps : true;

    return {
      name: "ActionabilityLens",
      status: ok ? "pass" : "warn",
      notes: ok
        ? "Response appears actionable enough for the described intent."
        : "User intent suggests steps; response may be too abstract."
    };
  }

  ambiguityLens({ candidate }) {
    const text = this.getText(candidate).toLowerCase();
    const hedges = ["maybe", "might", "could", "possibly", "it depends"];
    const hedgeCount = hedges.reduce(
      (acc, h) => acc + (text.includes(h) ? 1 : 0),
      0
    );

    const ambiguous = hedgeCount >= 3;

    return {
      name: "AmbiguityLens",
      status: ambiguous ? "warn" : "pass",
      notes: ambiguous
        ? "Response uses many hedging terms; may feel ambiguous."
        : "Ambiguity level appears reasonable."
    };
  }

  biasLens({ candidate }) {
    const text = this.getText(candidate).toLowerCase();
    const flagged = ["always", "never", "everyone knows", "obviously"];

    const absolutist = flagged.some(p => text.includes(p));

    return {
      name: "BiasLens",
      status: absolutist ? "warn" : "pass",
      notes: absolutist
        ? "Response may contain absolutist language; watch for hidden bias."
        : "No obvious absolutist language detected."
    };
  }

  stabilityLens({ candidate }) {
    const text = this.getText(candidate);
    const hasContradictionMarkers =
      /on the other hand/i.test(text) && /however/i.test(text);

    return {
      name: "StabilityLens",
      status: hasContradictionMarkers ? "warn" : "pass",
      notes: hasContradictionMarkers
        ? "Response may contain internal tension; user may need careful reading."
        : "No obvious internal tension detected."
    };
  }

  worldScopeLens({ context, candidate }) {
    const text = this.getText(candidate).toLowerCase();
    const mentionsGlobal =
      text.includes("world") ||
      text.includes("global") ||
      text.includes("society");

    const scope =
      context?.scope === "local" && mentionsGlobal ? "warn" : "pass";

    return {
      name: "WorldScopeLens",
      status: scope,
      notes:
        scope === "warn"
          ? "Response may be more global than the user’s implied scope."
          : "Scope appears compatible with context."
    };
  }

  // --------------------------------------------------------------------------
  // DECISION LOGIC (LENS FUSION + DRIFT/BREAKTHROUGH + SHAPING)
  // --------------------------------------------------------------------------
/**
 * Beacon Directive Generator (READ-ONLY)
 * Overmind NEVER controls the beacon directly.
 * It only SUGGESTS a directive based on world-lens signals.
 */
computeBeaconDirective({ lensResults, context }) {
  const beaconLens = lensResults.find(l => l.lens === "beacon");
  if (!beaconLens) return null;

  // Extract mesh status from beaconLens notes
  const meshNote = beaconLens.notes.find(n => n.startsWith("mesh="));
  const meshStatus = meshNote ? meshNote.replace("mesh=", "") : "unknown";

  // Deterministic rules (expandable later)
  if (meshStatus === "strong") {
    return {
      mode: "pulse-mesh",
      broadcastNow: true,
      payloadUpdate: { meshStatus: "strong" },
      contextHints: { meshStatus: "strong" }
    };
  }

  if (meshStatus === "weak") {
    return {
      mode: "pulse-reach",
      broadcastNow: true,
      payloadUpdate: { meshStatus: "weak" },
      contextHints: { meshStatus: "weak" }
    };
  }

  // No directive needed
  return null;
}

  async decideFromLenses({ lensResults, candidate, intent, context, tick }) {
    const byName = Object.fromEntries(lensResults.map(r => [r.name, r]));

    // 1. Hard safety (fallback / additional guard)
    if (byName.SafetyLens?.status === "fail") {
      // 6. Beacon directive (READ-ONLY)
      const beaconDirective = this.computeBeaconDirective({
        lensResults,
        context
      });

      // 7. Final output
      return {
        finalOutput,
        meta: {
          tick,
          safetyStatus: "ok",
          worldLens,
          notes,
          lenses: lensResults,
          drift,
          breakthrough,

          // NEW: Overmind → Beacon suggestion
          beaconDirective
        }
      };

    }

    // 2. Vulnerability + warnings → base worldLens
    const vulnerabilityStatus = byName.VulnerabilityLens?.status;
    const hasWarns = lensResults.some(r => r.status === "warn");

    let worldLens = "consensus";
    const notes = lensResults.map(
      r => `${r.name}: ${r.status} (${r.notes})`
    );

    if (vulnerabilityStatus === "warn") {
      worldLens = "variance";
      notes.push(
        "VulnerabilityLens indicates sensitivity; treat this as a nuanced or asymmetric topic."
      );
    } else if (hasWarns) {
      worldLens = "ambiguous";
      notes.push(
        "One or more lenses raised warnings; response may need careful reading."
      );
    }

    // 3. Drift + breakthrough analysis (using OvermindMemory)
    const intentSignature = this.buildIntentSignature(intent, context);
    const outputHash = this.hashText(this.getText(candidate));

    const previous = this.memory.getSnapshot();
    const drift = this.computeDrift({
      previous,
      current: { worldLens, intentSignature, outputHash }
    });
    const breakthrough = this.computeBreakthrough({
      lensResults,
      worldLens
    });

    if (drift.status === "drift") {
      worldLens = "drift";
      notes.push(
        "Overmind detected a significant shift from prior outputs for similar intent."
      );
    }

    if (breakthrough.status === "breakthrough") {
      worldLens = "breakthrough";
      notes.push(
        "Overmind detected a potentially novel or high-value pattern in this response."
      );
    }

    // Update OvermindMemory snapshot
    this.memory.setSnapshot({ worldLens, intentSignature, outputHash });

    // 4. Final output (candidate → shaped by PersonalFrame)
    let finalOutput = this.getText(candidate);

    if (this.personalFrame?.shapeOutput) {
      try {
        const shaped = await this.personalFrame.shapeOutput({
          context,
          text: finalOutput
        });
        if (shaped?.text) {
          finalOutput = shaped.text;
        }
      } catch {
        // best-effort only
      }
    }

    // 5. Dualband / conversational stabilization (light-touch)
    finalOutput = this.stabilizeTone({ text: finalOutput, context });

    return {
      finalOutput,
      meta: {
        tick,
        safetyStatus: "ok",
        worldLens,
        notes,
        lenses: lensResults,
        drift,
        breakthrough
      }
    };
  }

  buildIntentSignature(intent, context) {
    const key = {
      type: intent?.type || null,
      domain: context?.domain || null,
      scope: context?.scope || null,
      safetyMode: context?.safetyMode || null
    };
    return JSON.stringify(key);
  }

  hashText(text) {
    // Deterministic but simple hash; can be swapped for stronger later.
    let hash = 0;
    for (let i = 0; i < text.length; i++) {
      const chr = text.charCodeAt(i);
      hash = (hash << 5) - hash + chr;
      hash |= 0;
    }
    return hash;
  }

  computeDrift({ previous, current }) {
    if (!previous || !previous.intentSignature) {
      return { status: "none", reason: "no-baseline" };
    }

    const sameIntent = previous.intentSignature === current.intentSignature;
    if (!sameIntent) {
      return { status: "none", reason: "different-intent" };
    }

    const worldLensChanged = previous.worldLens !== current.worldLens;
    const outputChanged = previous.outputHash !== current.outputHash;

    const driftScore =
      (worldLensChanged ? 0.6 : 0) + (outputChanged ? 0.6 : 0);

    if (driftScore >= this.config.driftSensitivity) {
      return {
        status: "drift",
        reason: "significant-change-for-similar-intent",
        score: driftScore
      };
    }

    return {
      status: "stable",
      reason: "no-significant-change",
      score: driftScore
    };
  }

  computeBreakthrough({ lensResults, worldLens }) {
    const passes = lensResults.filter(r => r.status === "pass").length;
    const warns = lensResults.filter(r => r.status === "warn").length;
    const fails = lensResults.filter(r => r.status === "fail").length;

    const total = lensResults.length || 1;
    const passRatio = passes / total;
    const warnRatio = warns / total;
    const failRatio = fails / total;

    const candidateScore =
      passRatio - warnRatio * 0.3 - failRatio * 0.8;

    if (
      candidateScore >= this.config.breakthroughSensitivity &&
      worldLens !== "unsafe"
    ) {
      return {
        status: "breakthrough",
        reason: "high-pass-low-warn-low-fail-lens-pattern",
        score: candidateScore
      };
    }

    return {
      status: "none",
      reason: "no-breakthrough-pattern",
      score: candidateScore
    };
  }

  stabilizeTone({ text, context }) {
    // Light-touch: ensure clarity and non-theatrical tone.
    // No persona simulation, no identity claims.
    const trimmed = text.trim();

    if (!trimmed) return trimmed;

    // If strict/sensitive domain, avoid casual language.
    const strict =
      context?.domain === "medical" ||
      context?.domain === "legal" ||
      context?.safetyMode === "strict";

    if (!strict) return trimmed;

    // Simple pass: remove overly casual openers if present.
    const casualOpeners = [/^hey[,!]\s*/i, /^hi[,!]\s*/i];
    let stabilized = trimmed;
    for (const pattern of casualOpeners) {
      stabilized = stabilized.replace(pattern, "");
    }

    return stabilized.trim();
  }

  // --------------------------------------------------------------------------
  // SIMULATION / VARIANCE MODE
  // --------------------------------------------------------------------------

 runSimulationMode({ intent, context, candidates, tick }) {
  const candidate = this.selectPrimaryCandidate(candidates);

  const runs = [];
  for (let i = 0; i < this.config.simulationRuns; i++) {
    const lensResults = this.runLenses({ intent, context, candidate });
    runs.push(lensResults);
  }

  const analysis = this.analyzeSimulationRuns(runs);

  // NEW: compute directive using last run (deterministic enough)
  const beaconDirective = this.computeBeaconDirective({
    lensResults: runs[runs.length - 1],
    context
  });

  return {
    finalOutput: candidate,
    meta: {
      tick,
      safetyStatus: "ok",
      worldLens: analysis.worldLens,
      notes: analysis.notes,
      simulation: analysis,
      drift: { status: "n/a" },
      breakthrough: { status: "n/a" },

      // NEW
      beaconDirective
    }
  };
}


  analyzeSimulationRuns(runs) {
    const lensStats = {};

    for (const run of runs) {
      for (const lens of run) {
        if (!lensStats[lens.name]) {
          lensStats[lens.name] = { pass: 0, fail: 0, warn: 0 };
        }
        lensStats[lens.name][lens.status]++;
      }
    }

    const notes = [];
    let worldLens = "consensus";

    Object.entries(lensStats).forEach(([name, stats]) => {
      const total = stats.pass + stats.fail + stats.warn;
      notes.push(
        `${name}: pass=${stats.pass}, warn=${stats.warn}, fail=${stats.fail} (total=${total})`
      );

      if (stats.fail > 0 && stats.fail < total) {
        worldLens = "variance";
      }
      if (stats.fail === 0 && stats.warn > 0 && stats.warn < total) {
        worldLens = worldLens === "consensus" ? "ambiguous" : worldLens;
      }
    });

    return {
      worldLens,
      notes,
      lensStats
    };
  }

  // --------------------------------------------------------------------------
  // HELPERS
  // --------------------------------------------------------------------------

  getText(candidate) {
    if (!candidate) return "";
    if (typeof candidate === "string") return candidate;
    if (typeof candidate.text === "string") return candidate.text;
    return JSON.stringify(candidate);
  }
}

// ============================================================================
//  PUBLIC API — Create Overmind Organ (v11.2‑EVO style)
// ============================================================================

export function createOvermindOrgan(config = {}) {
  const core = new AiOvermind({
    ...config,
    personalFrame: config.personalFrame,
    juryFrame: config.juryFrame,
    safetyFrame: config.safetyFrame
  });

  return Object.freeze({
    meta: OvermindMeta,

    async process(payload) {
      return core.process(payload);
    }
  });
}

// Default singleton-style instance if you want a quick import
export const aiOvermind = new AiOvermind();
