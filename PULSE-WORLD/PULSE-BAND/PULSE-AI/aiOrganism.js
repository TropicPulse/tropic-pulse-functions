// ============================================================================
//  aiOrganism.js — Pulse OS v12.3-Presence Organ
//  Dualband Organism Bootloader • Canonical Assembly • Deterministic Root
// ============================================================================
/*
AI_EXPERIENCE_META = {
  identity: "aiOrganism",
  version: "v14-IMMORTAL",
  layer: "ai_core",
  role: "organism_definition",
  lineage: "aiOrganism-v11 → v14-IMMORTAL",

  evo: {
    organismDefinition: true,
    organMap: true,
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
    always: ["aiAnatomy", "aiBrainstem", "aiContext"],
    never: ["safeRoute", "fetchViaCNS"]
  }
}
*/

export const OrganismMeta = Object.freeze({
  layer: "OrganismRoot",
  role: "DUALBAND_ORGANISM_BOOTLOADER",
  version: "12.3-Presence",
  identity: "aiOrganism-v12.3-Presence",

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
    metabolismAware: true,
    hormonesAware: true,
    immunityAware: true,
    nervousSystemAware: true,
    conductorAware: true,
    windowAware: true,
    packetAware: true,
    prewarmAware: true,
    multiInstanceReady: true,
    epoch: "12.3-Presence"
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
import { createAIMemory } from "./aiMemory-v11-Evo.js";
import { createAIBinaryPipeline } from "./aiPipeline.js";
import { createAIBinaryReflex } from "./aiReflex.js";
import { createAIBinaryLoggerAdapter } from "./aiLoggerAdapter.js";
import { createAIBinaryPageScannerAdapter } from "./aiPageScannerAdapter.js";
import { createAIBinaryEvolution } from "./aiBinaryEvolution.js";
import { createAIBinaryGovernorAdapter } from "./aiGovernorAdapter.js";
import { createAIBinaryOrganRegistry } from "./aiBinaryOrganRegistry.js";
import { createAIBinaryDelta } from "./aiBinaryDelta.js";
import { createAIConductor as createAIBinaryConductor } from "./aiConductor.js";
import { createAIBinaryMetabolism } from "./aiMetabolism.js";
import { createAIBinaryHormones } from "./aiHormones.js";
import { createAIBinaryImmunity } from "./aiImmunity.js";
import { createAIBinaryNervousSystem } from "./aiNervousSystem.js";

// ============================================================================
//  COMMANDMENTS / SUPEREGO LAYER
// ============================================================================
import { createPersonaEngine } from "../PULSE-AI/persona.js";
import { createBoundariesEngine } from "../PULSE-AI/boundaries.js";
import { createPermissionsEngine } from "../PULSE-AI/permissions.js";

// ============================================================================
//  COGNITIVE FRAME / CONTEXT / CORTEX
// ============================================================================
import createCognitiveFrame, {
  COGNITIVE_FRAME_META,
  prewarmCognitiveFrame
} from "../PULSE-AI/aiContext.js";

import {
  createContextEngine,
  prewarmContextEngine
} from "../PULSE-AI/aiContextEngine.js";

import {
  createCortex,
  prewarmAICortex
} from "../PULSE-AI/aiCortex-v11-Evo.js";

// ============================================================================
//  EMOTION / EXPERIENCE / PERSONALITY
// ============================================================================
import aiEmotionEngine, {
  prewarmEmotionEngine
} from "../PULSE-AI/aiEmotionEngine.js";

import createExperienceEngine from "../PULSE-AI/aiExperience.js";

import { createPersonalityEngine } from "../PULSE-AI/aiPersonalityEngine.js";

import { createPersonalFrame } from "../PULSE-AI/aiPersonalFrame.js";

// ============================================================================
//  DELIVERY / EVOLUTION / DUALBAND
// ============================================================================
import aiDeliveryEngine, {
  prewarmDeliveryEngine
} from "../PULSE-AI/aiDeliveryEngine.js";

import { aiEvolutionEngine } from "../PULSE-AI/aiEvolutionEngine.js";

import { aiDualBand } from "../PULSE-AI/aiDualBand-v11-Evo.js";

// ============================================================================
//  SCRIBE / DIAGNOSTICS / DEPS
// ============================================================================
import {
  SCRIBE_META,
  formatDebugReport,
  formatDebugString,
  prewarmScribe
} from "../PULSE-AI/aiDebug.js";

import {
  DiagnosticsMeta,
  createDiagnosticsState,
  attachDiagnosticsOrgan,
  createDiagnosticsAPI,
  prewarmDiagnosticsOrgan
} from "../PULSE-AI/aiDiagnostics.js";

import {
  DiagnosticsWriteMeta,
  createDiagnosticsWriteOrgan,
  prewarmDiagnosticsWriteOrgan
} from "../PULSE-AI/aiDiagnosticsWrite.js";

import depsSurface, {
  DepsMeta,
  getDb,
  getFsAPI,
  getRouteAPI,
  getSchemaAPI,
  getOrganismSnapshot,
  emitDepsPacket,
  prewarmDepsLayer
} from "../PULSE-AI/aiDeps.js";

// ============================================================================
//  AI ENGINE / ORGANISM LOADER
// ============================================================================
import { runAI, ExecutionEngineMeta } from "../PULSE-AI/aiEngine.js";

// ============================================================================
//  ORGANISM IMPLEMENTATION — v14 IMMORTAL‑INTEL (A‑B‑A UPGRADE)
// ============================================================================
export class AIOrganism {
  constructor(config = {}) {
    this.id = config.id || OrganismMeta.identity;
    this.trace = !!config.trace;

    // ---------------------------------------------------------
    //  CREATE ORGANS — v11.3‑EVO canonical IDs (A: binary layer)
    // ---------------------------------------------------------
    this.agent = createAIBinaryAgent({ id: "agent", trace: this.trace });

    this.memory = createAIMemory({
      id: "memory",
      core: config.coreMemory,
      trace: this.trace
    });

    this.pipeline = createAIBinaryPipeline({
      id: "pipeline",
      trace: this.trace
    });

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
      registry: this.registry,
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
    //  SUPEREGO / COMMANDMENTS LAYER (B: symbolic layer)
    // ---------------------------------------------------------
    this.persona = createPersonaEngine({
      id: "persona",
      trace: this.trace
    });

    this.boundaries = createBoundariesEngine({
      id: "boundaries",
      trace: this.trace
    });

    this.permissions = createPermissionsEngine({
      id: "permissions",
      trace: this.trace
    });

    // ---------------------------------------------------------
    //  COGNITIVE FRAME / CONTEXT / CORTEX
    // ---------------------------------------------------------
    this.cognitiveFrame = createCognitiveFrame({
      id: "cognitive-frame",
      trace: this.trace
    });

    this.contextEngine = createContextEngine({
      id: "context-engine",
      trace: this.trace
    });

    this.cortex = createCortex({
      id: "cortex",
      trace: this.trace
    });

    // ---------------------------------------------------------
    //  EMOTION / EXPERIENCE / PERSONALITY
    // ---------------------------------------------------------
    this.emotion = aiEmotionEngine({
      id: "emotion",
      trace: this.trace
    });

    this.experience = createExperienceEngine({
      id: "experience",
      trace: this.trace
    });

    this.personality = createPersonalityEngine({
      id: "personality",
      trace: this.trace
    });

    this.personalFrame = createPersonalFrame({
      id: "personal-frame",
      trace: this.trace
    });

    // ---------------------------------------------------------
    //  SYMBOLIC EVOLUTION / DELIVERY / DUALBAND
    // ---------------------------------------------------------
    this.symbolicEvolution = aiEvolutionEngine({
      id: "symbolic-evolution",
      trace: this.trace
    });

    this.delivery = aiDeliveryEngine({
      id: "delivery",
      trace: this.trace
    });

    this.dualband = aiDualBand({
      id: "dualband",
      trace: this.trace
    });

    // ---------------------------------------------------------
    //  SCRIBE / DIAGNOSTICS / DEPS
    // ---------------------------------------------------------
    this.scribe = prewarmScribe({
      id: "scribe",
      trace: this.trace
    });

    const diagnosticsState = createDiagnosticsState();

    this.diagnostics = createDiagnosticsAPI({
      id: "diagnostics",
      state: diagnosticsState,
      trace: this.trace
    });

    attachDiagnosticsOrgan(this.diagnostics, diagnosticsState);

    this.diagnosticsWrite = createDiagnosticsWriteOrgan({
      id: "diagnostics-write",
      trace: this.trace
    });

    this.deps = depsSurface({
      id: "deps",
      trace: this.trace
    });

    // ---------------------------------------------------------
    //  META SURFACES / ENGINE HANDLE
    // ---------------------------------------------------------
    this.meta = {
      organism: OrganismMeta,
      contextFrame: COGNITIVE_FRAME_META,
      scribe: SCRIBE_META,
      diagnostics: DiagnosticsMeta,
      diagnosticsWrite: DiagnosticsWriteMeta,
      deps: DepsMeta,
      engine: ExecutionEngineMeta
    };

    this.engine = {
      run: (payload) =>
        runAI({
          ...payload,
          organism: this,
          meta: this.meta
        })
    };

    // ---------------------------------------------------------
    //  REGISTER ORGANS WITH CONDUCTOR
    // ---------------------------------------------------------
    const organs = [
      // binary
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
      this.conductor,

      // superego / commandments
      this.persona,
      this.boundaries,
      this.permissions,

      // cognitive
      this.cognitiveFrame,
      this.contextEngine,
      this.cortex,

      // emotional / identity
      this.emotion,
      this.experience,
      this.personality,
      this.personalFrame,

      // symbolic evolution / delivery / dualband
      this.symbolicEvolution,
      this.delivery,
      this.dualband,

      // diagnostics / deps / engine
      this.scribe,
      this.diagnostics,
      this.diagnosticsWrite,
      this.deps
    ];

    for (const organ of organs) {
      this.conductor.register(organ);
    }

    // ---------------------------------------------------------
    //  WIRING — v11.3‑EVO canonical wiring (A: binary)
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
    //  SYMBOLIC WIRING (B: symbolic)
    // ---------------------------------------------------------
    if (this.conductor.wireSymbolicCognition) {
      this.conductor.wireSymbolicCognition({
        persona: this.persona,
        boundaries: this.boundaries,
        permissions: this.permissions,
        cognitiveFrame: this.cognitiveFrame,
        contextEngine: this.contextEngine,
        cortex: this.cortex
      });
    }

    if (this.conductor.wireSymbolicIdentity) {
      this.conductor.wireSymbolicIdentity({
        emotion: this.emotion,
        experience: this.experience,
        personality: this.personality,
        personalFrame: this.personalFrame
      });
    }

    if (this.conductor.wireSymbolicEvolution) {
      this.conductor.wireSymbolicEvolution({
        symbolicEvolution: this.symbolicEvolution,
        delivery: this.delivery,
        dualband: this.dualband
      });
    }

    if (this.conductor.wireDiagnostics) {
      this.conductor.wireDiagnostics({
        scribe: this.scribe,
        diagnostics: this.diagnostics,
        diagnosticsWrite: this.diagnosticsWrite,
        deps: this.deps
      });
    }

    // ---------------------------------------------------------
    //  PREWARM — symbolic + cognitive + diagnostics (B)
    // ---------------------------------------------------------
    prewarmCognitiveFrame(this.cognitiveFrame);
    prewarmContextEngine(this.contextEngine);
    prewarmAICortex(this.cortex);

    prewarmEmotionEngine(this.emotion);
    prewarmDeliveryEngine(this.delivery);

    prewarmDiagnosticsOrgan(this.diagnostics);
    prewarmDiagnosticsWriteOrgan(this.diagnosticsWrite);
    prewarmDepsLayer(this.deps);

    // ---------------------------------------------------------
    //  OPTIONAL SELF-RUNNING ENGINE (Mode 3)
    // ---------------------------------------------------------
    if (config.autoRunEngine) {
      this.startEngine();
    }

    // ---------------------------------------------------------
    //  INITIALIZE ORGANISM (A: unified boot)
    // ---------------------------------------------------------
    this.conductor.initialize(this.registry, this.evolution);

    this._trace("organism:initialized", {
      organCount: organs.length,
      epoch: OrganismMeta.evo.epoch
    });
  }

  // ---------------------------------------------------------
  //  PUBLIC API (A: unchanged external surface)
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
    // use deps snapshot if available, fall back to memory
    try {
      return getOrganismSnapshot(this.deps) || this.memory.snapshot();
    } catch {
      return this.memory.snapshot();
    }
  }

  // ---------------------------------------------------------
  //  ENGINE CONTROL / SELF-RUNNING LOOP
  // ---------------------------------------------------------
  startEngine(task = { mode: "heartbeat" }) {
    this._trace("engine:start", { task });
    return this.engine.run(task);
  }

  // ---------------------------------------------------------
  //  DEBUG / META SURFACES
  // ---------------------------------------------------------
  debugReport(extra = {}) {
    const snapshot = this.organismSnapshot();
    const base = {
      id: this.id,
      epoch: OrganismMeta.evo.epoch,
      meta: this.meta
    };

    const report = formatDebugReport({
      base,
      snapshot,
      extra
    });

    return formatDebugString(report);
  }

  // ---------------------------------------------------------
  //  DEPS HELPERS
  // ---------------------------------------------------------
  getDb() {
    return getDb(this.deps);
  }

  getFs() {
    return getFsAPI(this.deps);
  }

  getRoutes() {
    return getRouteAPI(this.deps);
  }

  getSchemas() {
    return getSchemaAPI(this.deps);
  }

  emitDepsPacket(packet) {
    return emitDepsPacket(this.deps, packet);
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
