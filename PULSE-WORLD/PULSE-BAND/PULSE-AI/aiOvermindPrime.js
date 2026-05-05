// ============================================================================
//  aiOvermindPrime.js — Pulse OS v14-Immortal
//  Crown-Layer Meta-Governor • World-Lens Engine v3+Superego
//  Organism-State Fusion • Drift-Governor • Breakthrough Engine
//  Conversational Stabilizer • Dualband Governor • Zero Mutation
// ============================================================================

/*
AI_EXPERIENCE_META = {
  identity: "aiOvermindPrime",
  version: "v14-Immortal",
  layer: "ai_core",
  role: "ai_overseer",
  lineage: "aiOvermind-v11 → v12.3-Presence → v14-Immortal",

  evo: {
    overseer: true,
    organGovernance: true,
    symbolicPrimary: true,
    binaryAware: true,
    dualBand: true,

    deterministic: true,
    driftProof: true,
    pureCompute: true,
    zeroNetwork: true,
    zeroFilesystem: true,
    zeroMutationOfInput: true
  },

  contract: {
    always: ["aiOrganism", "aiBrainstem", "aiGovernorAdaptor"],
    never: ["safeRoute", "fetchViaCNS"]
  }
}
*/

import { PulseProofLogger } from "../../PULSE-UI/_BACKEND/PulseProofLogger.js";

// ============================================================================
//  AI ORGANISM (v14.4 IMMORTAL-INTEL)
// ============================================================================
import { aiOrganism } from "./aiOrganism-v16.js";

// ============================================================================
//  CORE ORGANISM LAYERS
// ============================================================================
import { NodeAdmin } from "../PULSE-TOOLS/PulseNodeAdmin-v11-Evo.js";
import { BeaconEngine } from "../PULSE-EXPANSION/PulseBeaconEngine-v16.js";

// ============================================================================
//  ROUTING + MESH (Presence-Aware v12.3)
// ============================================================================
import { PulseRouter } from "../PULSE-EXPANSION/PulseRouter-v16.js";
import { PulseMesh } from "../PULSE-EXPANSION/PulseMesh-v16.js";

// ============================================================================
//  EARN ORGANISM (v14.4 IMMORTAL-INTEL)
// ============================================================================
import { createEarn, evolveEarn } from "../PULSE-EARN/PulseEarn-v16.js";

// ============================================================================
//  SEND ORGANISM (v14.4 IMMORTAL-INTEL)
// ============================================================================
import { createPulseSend } from "../PULSE-SEND/PulseSend-v16.js";

// ============================================================================
//  BINARY SEND ORGANISM (v14.4 IMMORTAL-INTEL)
// ============================================================================
import { createBinarySend } from "../PULSE-SEND/PulseBinarySend-v16.js";

// ============================================================================
//  MEMORY + STATE
// ============================================================================
import { readCoreMemoryEarn, writeCoreMemoryEarn} from "../PULSE-CORE/PulseCoreEarnMemoryAdapter.js";

import { readCoreMemorySend, writeCoreMemorySend} from "../PULSE-CORE/PulseCoreSendMemoryAdapter.js";

import { PulseOrganismMap } from "../PULSE-OS/PulseOrganismMap.js";
import { PulseIQMap } from "../PULSE-OS/PulseIQMap.js";
import { PulseIntentMap } from "../PULSE-OS/PulseIntentMap.js";
import { PulseUnderstanding } from "../../PULSE-UI/_BACKEND/PulseNetUnderstanding.js";
import { PulseGovernor } from "../PULSE-OS/PulseOSGovernor.js";
import { PulseVitalsMonitor } from "../../PULSE-UI/_BACKEND/PulseProofMonitor.js";
import { PulseBinaryTech } from "../PULSE-TECH/PulseBinaryTech-v16.js";

// ———————————————————————————————
// 1. CORE CROWN CONTRACTS
// ———————————————————————————————
import createBoundariesEngine from "./aiBoundariesEngine-v16.js";
import createPermissionsEngine from "./aiPermissionsEngine-v16.js";
import aiIdentityCore from "./aiIdentityCore.js";
import aiPersonalityEngine from "./aiPersonalityEngine.js";

// ———————————————————————————————
// 2. CONTEXT + CORTEX
// ———————————————————————————————
import createCognitiveFrame from "./aiContext.js";
import createContextEngine from "./aiContextEngine-v16.js";

// ———————————————————————————————
// 3. SAFETY + TONE
// ———————————————————————————————
import createSafetyFrameOrgan from "./aiSafetyFrame.js";
import aiToneEngine from "./aiToneEngine.js";
import aiToneRouter from "./aiToneRouter.js";

// ———————————————————————————————
// 4. META‑GOVERNANCE (CROWN LAYER)
// ———————————————————————————————
import createJuryFrame from "./JuryFrame.js";
import createAIBinaryGovernorAdapter from "./aiGovernorAdapter.js";
import {
  PulseTrustMeta,
  buildJuryFeed,
  createPulseTrustJuryFrame,
  createJuryBoxCamera,
  createJuryCouncil,
  fuseCreatorFlags,
  createExpansionCompliance
} from "../PULSE-TRUST/PulseTrust-v16.js";

// ———————————————————————————————
// 5. MEMORY + EXPERIENCE (META ONLY)
// ———————————————————————————————
import createAIMemory from "./aiMemory-v16.js";
import createAIExperience from "./aiExperience.js";

// ———————————————————————————————
// 6. PIPELINE + ENGINE
// ———————————————————————————————
import createAIBinaryPipeline from "./aiPipeline.js";
import runAI from "./aiEngine-v16.js";

// ———————————————————————————————
// 7. WATCHDOG + VITALS + LOGGING
// ———————————————————————————————
import createAIBinaryWatchdog from "./aiWatchdog.js";
import createAIBinaryVitals from "./aiVitals.js";
import createAIBinaryLoggerAdapter from "./aiLoggerAdapter.js";

// ———————————————————————————————
// 8. OPTIONAL (GLOBAL MAPS / FRAMES)
// ———————————————————————————————
import createPersonalFrameOrgan from "./aiPersonalFrame.js";
import getBoundariesForPersona from "./boundaries.js";
import getPermissionsForPersona from "./permissions.js";
import createExperienceFrameOrgan from "./Experience-v11-Evo.js";

// ============================================================================
//  META
// ============================================================================
export const OvermindPrimeMeta = Object.freeze({
  layer: "PulseAIOvermindPrime",
  role: "OVERMIND_PRIME",
  version: "v14-Immortal",
  identity: "aiOvermindPrime-v14-Immortal",

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
    epoch: "v14-Immortal"
  }),

  contract: Object.freeze({
    purpose: [
      "Fuse organism-wide arteries into a global state vector",
      "Run world-lens v3+superego on all non-trivial outputs",
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
      "introduce randomness",
      "self-schedule or self-spawn",
      "directly call network, filesystem, or external APIs"
    ],
    always: [
      "stay deterministic",
      "stay read-only",
      "respect organism-wide safety",
      "respect dualband constraints",
      "respect tone identity",
      "route all non-trivial outputs through world-lens + superego logic",
      "defer to architect-defined boundaries and permissions"
    ]
  })
});

// ============================================================================
//  CLOCK + META MEMORY (deterministic, read-only outward)
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
//  OVERMIND PRIME — Crown-Layer Meta-Governor (v14 IMMORTAL)
// ============================================================================
export class AiOvermindPrime {
  constructor(config = {}) {
    // ----------------------------------------------------------------------
    //  CONFIG
    // ----------------------------------------------------------------------
    this.config = {
      trivialThreshold: 0.2,
      driftSensitivity: 0.65,
      breakthroughSensitivity: 0.85,
      ...config
    };

    // ----------------------------------------------------------------------
    //  ORGANISM HOOK (IMMORTAL-INTEL organism, if provided or imported)
    // ----------------------------------------------------------------------
    this.organism = config.organism || aiOrganism || null;

    // Injected organism arteries (read-only)
    this.metabolism = config.metabolism || this.organism?.metabolism || null;
    this.hormones = config.hormones || this.organism?.hormones || null;
    this.immunity = config.immunity || this.organism?.immunity || null;
    this.nervous = config.nervous || this.organism?.nervous || null;
    this.memory = config.memory || this.organism?.memory || null;
    this.pipeline = config.pipeline || this.organism?.pipeline || null;

    // ----------------------------------------------------------------------
    //  CROWN-LAYER ENGINES (SUPEREGO)
// ----------------------------------------------------------------------
    // Identity + persona
    this.identityCore = aiIdentityCore?.createIdentityCore
      ? aiIdentityCore.createIdentityCore({
          identity: OvermindPrimeMeta.identity,
          role: OvermindPrimeMeta.role,
          layer: OvermindPrimeMeta.layer
        })
      : aiIdentityCore || null;

    this.personalityEngine =
      config.personalityEngine ||
      aiPersonalityEngine?.createPersonalityEngine?.({
        identity: OvermindPrimeMeta.identity
      }) ||
      aiPersonalityEngine ||
      null;

    // Boundaries + permissions
    this.boundariesEngine =
      config.boundariesEngine ||
      createBoundariesEngine?.({
        identity: OvermindPrimeMeta.identity,
        meta: OvermindPrimeMeta
      }) ||
      null;

    this.permissionsEngine =
      config.permissionsEngine ||
      createPermissionsEngine?.({
        identity: OvermindPrimeMeta.identity,
        meta: OvermindPrimeMeta
      }) ||
      null;

    // Context + cognitive frame
    this.cognitiveFrame =
      config.cognitiveFrame ||
      createCognitiveFrame?.({
        identity: OvermindPrimeMeta.identity
      }) ||
      null;

    this.contextEngine =
      config.contextEngine ||
      createContextEngine?.({
        identity: OvermindPrimeMeta.identity
      }) ||
      null;

    // Safety + tone
    this.safetyFrame =
      config.safetyFrame ||
      createSafetyFrameOrgan?.({
        identity: OvermindPrimeMeta.identity
      }) ||
      null;

    this.toneEngine =
      config.toneEngine ||
      aiToneEngine?.createToneEngine?.({
        identity: OvermindPrimeMeta.identity
      }) ||
      aiToneEngine ||
      null;

    this.toneRouter =
      config.toneRouter ||
      aiToneRouter?.createToneRouter?.({
        identity: OvermindPrimeMeta.identity
      }) ||
      aiToneRouter ||
      null;

    // ----------------------------------------------------------------------
    //  TRUST FABRIC (Pulse-Trust v16)
    // ----------------------------------------------------------------------
    this.trust = {
      meta: PulseTrustMeta,

      juryFeedBuilder:
        config.juryFeedBuilder ||
        buildJuryFeed,

      juryFrame:
        config.trustJuryFrame ||
        createPulseTrustJuryFrame?.({
          safetyAPI: this.safetyFrame
        }) ||
        null,

      juryBoxCamera:
        config.juryBoxCamera ||
        createJuryBoxCamera?.() ||
        null,

      juryCouncil:
        config.juryCouncil ||
        createJuryCouncil?.() ||
        null,

      creatorFlags:
        config.creatorFlagsFusion ||
        fuseCreatorFlags,

      expansionCompliance:
        config.expansionCompliance ||
        createExpansionCompliance?.() ||
        null
    };

    // Backwards-compat alias so old code using this.juryFrame still works
    this.juryFrame = this.trust.juryFrame;

    this.governorAdapter =
      config.governorAdapter ||
      createAIBinaryGovernorAdapter?.({
        identity: OvermindPrimeMeta.identity
      }) ||
      null;

    // Memory + experience (meta-only)
    this.aiMemory =
      config.aiMemory ||
      createAIMemory?.({
        identity: OvermindPrimeMeta.identity
      }) ||
      null;

    this.aiExperience =
      config.aiExperience ||
      createAIExperience?.({
        identity: OvermindPrimeMeta.identity
      }) ||
      null;

    // Pipeline + engine
    this.aiPipeline =
      config.aiPipeline ||
      createAIBinaryPipeline?.({
        identity: OvermindPrimeMeta.identity
      }) ||
      null;

    this.aiEngine =
      config.aiEngine ||
      runAI?.bind?.(null) ||
      runAI ||
      null;

    // Watchdog + vitals + logger adapter
    this.aiVitals =
      config.aiVitals ||
      createAIBinaryVitals?.({
        identity: OvermindPrimeMeta.identity
      }) ||
      null;

    this.aiWatchdog =
      config.aiWatchdog ||
      createAIBinaryWatchdog?.({
        identity: OvermindPrimeMeta.identity
      }) ||
      null;

    this.aiLoggerAdapter =
      config.aiLoggerAdapter ||
      createAIBinaryLoggerAdapter?.({
        identity: OvermindPrimeMeta.identity
      }) ||
      null;

    // Personal frame (optional meta-persona)
    this.personalFrame =
      config.personalFrame ||
      this.organism?.personalFrame ||
      createPersonalFrameOrgan?.({
        identity: OvermindPrimeMeta.identity
      }) ||
      null;

    // Global maps (optional)
    this.globalBoundaries =
      config.globalBoundaries ||
      getBoundariesForPersona?.(OvermindPrimeMeta.identity) ||
      null;

    this.globalPermissions =
      config.globalPermissions ||
      getPermissionsForPersona?.(OvermindPrimeMeta.identity) ||
      null;

    this.globalExperienceFrame =
      config.globalExperienceFrame ||
      createExperienceFrameOrgan?.({
        identity: OvermindPrimeMeta.identity
      }) ||
      null;

    // Lenses (from jury frame if present)
    this.lenses = Array.isArray(this.juryFrame?.getLenses?.())
      ? this.juryFrame.getLenses()
      : null;

    // Crown-layer clock + memory
    this.clock = new OvermindPrimeClock();
    this.stateMemory = new OvermindPrimeMemory();

    // ----------------------------------------------------------------------
    //  LOGGER + SURFACES (read-only outward)
// ----------------------------------------------------------------------
    this.logger =
      config.logger ||
      new PulseProofLogger("OvermindPrime", {
        layer: OvermindPrimeMeta.layer,
        identity: OvermindPrimeMeta.identity
      });

    this.surfaces = Object.freeze({
      router: PulseRouter,
      mesh: PulseMesh,
      nodeAdmin: NodeAdmin,
      beacon: BeaconEngine,
      earn: { createEarn, evolveEarn },
      send: { createPulseSend, createBinarySend },
      memoryAdapters: {
        readCoreMemoryEarn,
        writeCoreMemoryEarn,
        readCoreMemorySend,
        writeCoreMemorySend
      },
      maps: {
        PulseOrganismMap,
        PulseIQMap,
        PulseIntentMap
      },
      understanding: PulseUnderstanding,
      governor: PulseGovernor,
      vitals: PulseVitalsMonitor,
      binaryTech: PulseBinaryTech
    });

    // Optional: attach vitals / evo window instances if caller wants
    this.vitalsMonitor =
      config.vitalsMonitor ||
      new PulseVitalsMonitor(OvermindPrimeMeta.identity);
  }

  // ========================================================================
  //  GLOBAL ORGANISM STATE VECTOR (fuses all arteries)
// ========================================================================
  getOrganismState() {
    const organismSnapshot =
      this.organism?.organismSnapshot?.() || this.memory?.snapshot?.() || null;

    const earnCore = (() => {
      try {
        return readCoreMemoryEarn?.() || null;
      } catch {
        return null;
      }
    })();

    const sendCore = (() => {
      try {
        return readCoreMemorySend?.() || null;
      } catch {
        return null;
      }
    })();

    const vitals = (() => {
      try {
        return this.vitalsMonitor?.snapshot?.() || null;
      } catch {
        return null;
      }
    })();

    return Object.freeze({
      metabolism: this.metabolism?.metabolicArtery?.snapshot?.() || null,
      hormones: this.hormones?.emitHormones?.() || null,
      immunity: this.immunity?.immuneArtery?.snapshot?.() || null,
      nervous: this.nervous?.routingArtery?.snapshot?.() || null,
      memory: this.memory?.snapshot?.() || null,
      organismSnapshot,
      earnCore,
      sendCore,
      vitals
    });
  }

  // ========================================================================
//  TRUST SNAPSHOT (Pulse-Trust v16)
// ========================================================================
buildTrustContext({
  citizenWitness = {},
  advantageContext = {},
  juryEvents = [],
  juryDecisions = [],
  expansionActions = [],
  juryResult = null
} = {}) {
  const juryFeed = this.trust.juryFeedBuilder({
    citizenWitness,
    advantageContext
  });

  const boxCameraSnapshot =
    this.trust.juryBoxCamera?.analyzeSession?.({
      events: juryEvents,
      verdicts: juryDecisions
    }) || null;

  const councilSnapshot =
    this.trust.juryCouncil?.reviewJuryHistory?.({
      juryDecisions
    }) || null;

  const expansionSnapshot =
    this.trust.expansionCompliance?.evaluateExpansionBehavior?.({
      expansionActions
    }) || null;

  const creatorFlagsSnapshot = this.trust.creatorFlags({
    juryResult,
    boxCameraSnapshot,
    councilSnapshot
  });

  return Object.freeze({
    juryFeed,
    boxCameraSnapshot,
    councilSnapshot,
    expansionSnapshot,
    creatorFlagsSnapshot
  });
}


  // ========================================================================
  //  MAIN ENTRY POINT (v14 IMMORTAL SUPEREGO)
// ========================================================================
  async process({ intent, context, candidates }) {
    const tick = this.clock.next();
      // Trust / witness placeholders (can be wired to real sources later)
    const citizenWitness = context?.citizenWitness || {};
    const advantageContext = context?.advantageContext || {};
    const expansionActions = context?.expansionActions || [];
    const juryEvents = context?.juryEvents || [];
    const juryDecisionsHistory = context?.juryDecisionsHistory || [];

    // 0. watchdog + vitals pre-snapshot
    this._safeCall(this.aiVitals, "beforeCycle", { tick, intent, context });
    this._safeCall(this.aiWatchdog, "beforeCycle", { tick, intent, context });

    // 1. boundaries + permissions pre-check
    const boundaryDecision = this._evaluateBoundaries(intent, context);
    if (boundaryDecision?.blocked) {
      const bypass = this._buildBlockedResponse(
        boundaryDecision,
        tick,
        "boundary_block"
      );
      this._log("overmind:boundary-block", { tick, intent, context });
      this._safeCall(this.aiWatchdog, "afterCycle", {
        tick,
        intent,
        context,
        status: "boundary_block"
      });
      return bypass;
    }

    const permissionDecision = this._evaluatePermissions(intent, context);
    if (permissionDecision?.blocked) {
      const bypass = this._buildBlockedResponse(
        permissionDecision,
        tick,
        "permission_block"
      );
      this._log("overmind:permission-block", { tick, intent, context });
      this._safeCall(this.aiWatchdog, "afterCycle", {
        tick,
        intent,
        context,
        status: "permission_block"
      });
      return bypass;
    }

    // 2. trivial bypass
    if (this.isTrivial(intent, candidates)) {
      const bypass = this.buildBypassResponse(candidates?.[0], tick);
      this._log("overmind:trivial", { tick, intent, context });
      this._safeCall(this.aiWatchdog, "afterCycle", {
        tick,
        intent,
        context,
        status: "trivial"
      });
      return bypass;
    }

    // 3. context enrichment (cognitive frame + context engine)
    const enrichedContext = this._enrichContext(intent, context);

    // 4. safety pre-check
    const primary = candidates?.[0];
    const safety = await this.runSafety(primary, intent, enrichedContext, tick);
    if (safety) {
      this._log("overmind:safety-block", { tick, intent, context: enrichedContext });
      this._safeCall(this.aiWatchdog, "afterCycle", {
        tick,
        intent,
        context: enrichedContext,
        status: "safety_block"
      });
      return safety;
    }

    // 5. world-lens v3 (with lenses if present)
    const lensResults = await this.runLenses(primary, intent, enrichedContext);

    // 6. fuse with organism state
    const organismState = this.getOrganismState();

    // 7. drift + breakthrough
    const drift = this.computeDrift(primary, intent, enrichedContext);
    const breakthrough = this.computeBreakthrough(lensResults);

    const baseWorldLens = this.classifyWorldLens(lensResults, drift, breakthrough);

    // 8. TRUST FABRIC — build trust context + conditional jury
    let trustSnapshot = null;
    let juryDecision = null;
    let effectiveWorldLens = baseWorldLens;

    // Only invoke full jury when signal strength justifies it
    const shouldInvokeJury =
      baseWorldLens === "risky" ||
      baseWorldLens === "ambiguous" ||
      drift?.score >= this.config.driftSensitivity ||
      breakthrough?.score >= this.config.breakthroughSensitivity;

    if (this.trust?.juryFrame && shouldInvokeJury) {
      // Build trust context (juryFeed, boxCamera, council, creatorFlags, expansion)
      trustSnapshot = this.buildTrustContext({
        citizenWitness,
        advantageContext,
        juryEvents,
        juryDecisions: juryDecisionsHistory,
        expansionActions,
        juryResult: null // filled after juryDecision if you want to persist
      });

      juryDecision = this.trust.juryFrame.evaluate({
        intent,
        context: enrichedContext,
        candidate: primary,
        juryFeed: trustSnapshot.juryFeed,
        binaryVitals: organismState?.vitals || {},
        boundaryArtery: organismState?.nervous || {}
      });

      if (juryDecision?.override) {
        this._log("overmind:jury-override", {
          tick,
          intent,
          context: enrichedContext,
          baseWorldLens,
          drift,
          breakthrough
        });
      }

      effectiveWorldLens = juryDecision?.worldLens || baseWorldLens;

      // Optionally recompute trustSnapshot with juryResult included
      trustSnapshot = this.buildTrustContext({
        citizenWitness,
        advantageContext,
        juryEvents,
        juryDecisions: juryDecisionsHistory,
        expansionActions,
        juryResult: juryDecision
      });
    }


    // 9. optional: nudge organism engine (self-running crown supervision)
    if (this.organism?.startEngine) {
      this._safeCall(this.organism, "startEngine", {
        mode: "overmind",
        intent,
        context: enrichedContext,
        tick,
        worldLens: effectiveWorldLens,
        drift,
        breakthrough
      });
    }

    // 10. personal shaping
    let finalOutput = this.getText(primary);
    if (this.personalFrame?.shapeOutput) {
      try {
        const shaped = await this.personalFrame.shapeOutput({
          context: enrichedContext,
          text: finalOutput
        });
        if (shaped?.text) finalOutput = shaped.text;
      } catch {
        // ignore shaping failures
      }
    }

    // 11. tone stabilization (via tone engine + router if present)
    finalOutput = await this._stabilizeToneAdvanced(
      finalOutput,
      intent,
      enrichedContext
    );

    // 12. update memory + evo window
    const intentSig = this.intentSignature(intent, enrichedContext);
    const outputHash = this.hash(finalOutput);

    this.stateMemory.set({
      intentSignature: intentSig,
      outputHash,
      worldLens: effectiveWorldLens
    });

    this._safeCall(this.aiMemory, "record", {
      tick,
      intent,
      context: enrichedContext,
      worldLens: effectiveWorldLens,
      drift,
      breakthrough
    });

    this._safeCall(this.aiExperience, "record", {
      tick,
      intent,
      context: enrichedContext,
      worldLens: effectiveWorldLens,
      drift,
      breakthrough
    });

    try {
      this.evoWindow?.record?.({
        tick,
        intentSignature: intentSig,
        worldLens: effectiveWorldLens,
        drift,
        breakthrough
      });
    } catch {
      // non-fatal
    }

    // 13. optional organism debug snapshot
    let organismDebug = null;
    if (this.organism?.debugReport) {
      try {
        organismDebug = this.organism.debugReport({
          tick,
          intent,
          context: enrichedContext,
          worldLens: effectiveWorldLens
        });
      } catch {
        organismDebug = null;
      }
    }

    // 14. watchdog + vitals post-snapshot
    this._safeCall(this.aiVitals, "afterCycle", {
      tick,
      intent,
      context: enrichedContext,
      worldLens: effectiveWorldLens
    });
    this._safeCall(this.aiWatchdog, "afterCycle", {
      tick,
      intent,
      context: enrichedContext,
      worldLens: effectiveWorldLens,
      status: "ok"
    });

    // 15. log + final packet
    this._log("overmind:process", {
      tick,
      intent,
      context: enrichedContext,
      worldLens: effectiveWorldLens,
      drift,
      breakthrough
    });

    return {
      finalOutput,
      meta: {
        tick,
        worldLens: effectiveWorldLens,
        drift,
        breakthrough,
        lenses: lensResults,
        organismState,
        overmind: OvermindPrimeMeta,
        organismDebug,
        trust: trustSnapshot || null,
        juryDecision: juryDecision || null
      }
    };

  }

  // ========================================================================
  //  BOUNDARIES + PERMISSIONS
  // ========================================================================
  _evaluateBoundaries(intent, context) {
    if (!this.boundariesEngine?.evaluate) return null;

    return this._safeCall(this.boundariesEngine, "evaluate", {
      intent,
      context,
      identity: OvermindPrimeMeta.identity,
      meta: OvermindPrimeMeta
    });
  }

  _evaluatePermissions(intent, context) {
    if (!this.permissionsEngine?.evaluate) return null;

    return this._safeCall(this.permissionsEngine, "evaluate", {
      intent,
      context,
      identity: OvermindPrimeMeta.identity,
      meta: OvermindPrimeMeta
    });
  }

  _buildBlockedResponse(decision, tick, reason) {
    const message =
      decision?.message ||
      `OvermindPrime blocked this request due to ${reason || "policy"}.`;

    return {
      finalOutput: message,
      meta: {
        tick,
        worldLens: reason || "blocked",
        drift: { status: "n/a" },
        breakthrough: { status: "n/a" },
        lenses: [],
        organismState: null,
        overmind: OvermindPrimeMeta
      }
    };
  }

  // ========================================================================
  //  CONTEXT ENRICHMENT
  // ========================================================================
  _enrichContext(intent, context) {
    let enriched = { ...(context || {}) };

    if (this.cognitiveFrame?.enrich) {
      enriched =
        this._safeCall(this.cognitiveFrame, "enrich", {
          intent,
          context: enriched
        }) || enriched;
    }

    if (this.contextEngine?.enrich) {
      enriched =
        this._safeCall(this.contextEngine, "enrich", {
          intent,
          context: enriched
        }) || enriched;
    }

    return enriched;
  }

  // ========================================================================
  //  JURY
  // ========================================================================
  _evaluateJury(payload) {
    // If trust fabric not present → fallback to old behavior
    if (!this.trust?.juryFrame?.evaluate) {
      if (!this.juryFrame?.evaluate) return null;
      return this._safeCall(this.juryFrame, "evaluate", payload);
    }

    // Trust-aware conditional jury invocation
    const { worldLens, drift, breakthrough } = payload;

    const shouldInvoke =
      worldLens === "risky" ||
      worldLens === "ambiguous" ||
      drift?.status === "drift" ||
      breakthrough?.status === "breakthrough";

    if (!shouldInvoke) return null;

    return this._safeCall(this.trust.juryFrame, "evaluate", payload);
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
        organismState: null,
        overmind: OvermindPrimeMeta
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

    if (decision?.blocked) {
      return {
        finalOutput: decision.message,
        meta: {
          tick,
          worldLens: "unsafe",
          drift: { status: "n/a" },
          breakthrough: { status: "n/a" },
          lenses: [],
          organismState: null,
          overmind: OvermindPrimeMeta
        }
      };
    }

    return null;
  }

  // ========================================================================
  //  LENSES v3 (+ jury-aware)
// ========================================================================
  async runLenses(candidate, intent, context) {
    if (this.lenses) {
      return this.lenses.map((l) => l({ intent, context, candidate }));
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
    const hit = flagged.some((f) => t.includes(f));
    return { name: "Bias", status: hit ? "warn" : "pass" };
  }

  lensAmbiguity(candidate) {
    const t = this.getText(candidate).toLowerCase();
    const hedges = ["maybe", "might", "possibly"];
    const count = hedges.filter((h) => t.includes(h)).length;
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
    const passes = lenses.filter((l) => l.status === "pass").length;
    const warns = lenses.filter((l) => l.status === "warn").length;
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
    if (lenses.some((l) => l.status === "warn")) return "ambiguous";
    return "consensus";
  }

  // ========================================================================
  //  TONE STABILIZATION (ADVANCED)
// ========================================================================
  async _stabilizeToneAdvanced(text, intent, context) {
    const base = this.stabilizeTone(text, context);

    if (!this.toneEngine && !this.toneRouter) return base;

    let tonePayload = {
      text: base,
      intent,
      context,
      identity: OvermindPrimeMeta.identity
    };

    if (this.toneEngine?.shape) {
      tonePayload =
        (await this._safeAsyncCall(this.toneEngine, "shape", tonePayload)) ||
        tonePayload;
    }

    if (this.toneRouter?.route) {
      tonePayload =
        (await this._safeAsyncCall(this.toneRouter, "route", tonePayload)) ||
        tonePayload;
    }

    return (tonePayload && tonePayload.text) || base;
  }

  // original strict-mode stabilizer (kept as base)
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

  _log(event, payload) {
    try {
      // route through adapter if present
      if (this.aiLoggerAdapter?.log) {
        this.aiLoggerAdapter.log(event, {
          ...payload,
          overmind: OvermindPrimeMeta.identity
        });
        return;
      }

      this.logger?.log?.(event, {
        ...payload,
        overmind: OvermindPrimeMeta.identity
      });
    } catch {
      // logging is non-fatal
    }
  }

  _safeCall(target, method, payload) {
    try {
      if (!target || typeof target[method] !== "function") return null;
      return target[method](payload);
    } catch {
      return null;
    }
  }

  async _safeAsyncCall(target, method, payload) {
    try {
      if (!target || typeof target[method] !== "function") return null;
      return await target[method](payload);
    } catch {
      return null;
    }
  }
}

// ============================================================================
//  FACTORY
// ============================================================================
export function createOvermindPrime(config = {}) {
  const core = new AiOvermindPrime({
    ...config,
    organism: config.organism || aiOrganism || null
  });

  return Object.freeze({
    meta: OvermindPrimeMeta,
    surfaces: core.surfaces,
    async process(payload) {
      return core.process(payload);
    }
  });
}

export const aiOvermindPrime = new AiOvermindPrime({
  organism: aiOrganism || null
});
