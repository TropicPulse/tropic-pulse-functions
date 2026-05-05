// ============================================================================
//  aiOrganism-v16-Immortal++.js — Pulse OS v16-Immortal++ Organism
//  Dualband Organism Bootloader • Canonical Assembly • Trust/Artery Aware
// ============================================================================
//
// ROLE (v16-Immortal-Organism++):
//   • Canonically assemble the binary + symbolic organism (organs, registry, conductor).
//   • Provide a deterministic, dualband-ready organism surface.
//   • Expose a stable organismSnapshot + organismArtery for higher layers.
//   • Integrate with diagnostics, deps, trust fabric, dualband, and Pulse-Net.
//   • Never perform user routing, UI, or external network access directly.
//   • Never mutate external config or DB; pure assembly + internal wiring.
//
// CONTRACT:
//   • Deterministic, drift-proof, read-only outward surface.
//   • No random, no timestamps, no external mutation.
//   • No direct internet / HTTP / DNS / WebSocket.
// ============================================================================

/*
AI_EXPERIENCE_META = {
  identity: "aiOrganism",
  version: "v16-Immortal-Organism++",
  layer: "ai_core",
  role: "organism_definition",
  lineage: "aiOrganism-v11 → v12.3-Presence → v14-Immortal → v16-Immortal-Organism++",

  evo: {
    organismDefinition: true,
    organMap: true,
    symbolicPrimary: true,
    binaryAware: true,
    dualBand: true,
    arteryAware: true,
    trustFabricAware: true,
    diagnosticsAware: true,
    depsAware: true,
    chunkerAware: true,
    pulseNetAware: true,

    deterministic: true,
    driftProof: true,
    pureCompute: true,
    zeroNetwork: true,
    zeroFilesystem: true,
    zeroMutationOfInput: true
  },

  contract: {
    always: [
      "aiAnatomy",
      "aiBrainstem",
      "aiContext",
      "DualBandKernel",
      "PulseAIChunker",
      "PulseNetProxySpine"
    ],
    never: [
      "safeRoute",
      "fetchViaCNS",
      "directInternetAccess",
      "externalHTTP",
      "externalDNS",
      "externalWebsocket"
    ]
  }
}
*/

export const OrganismMeta = Object.freeze({
  layer: "OrganismRoot",
  role: "DUALBAND_ORGANISM_BOOTLOADER",
  version: "v16-Immortal-Organism++",
  identity: "aiOrganism-v16-Immortal-Organism++",

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
    deltaAware: true,
    loggerAware: true,
    governorAware: true,
    pageScannerAware: true,

    diagnosticsAware: true,
    depsAware: true,
    arteryAware: true,
    organismSnapshotAware: true,
    trustFabricAware: true,
    chunkerAware: true,
    dualBandBridgeAware: true,
    pulseNetAware: true,

    windowAware: true,
    packetAware: true,
    prewarmAware: true,
    multiInstanceReady: true,
    epoch: "v16-Immortal-Organism++"
  }),

  contract: Object.freeze({
    purpose:
      "Assemble all organism organs into a single deterministic dualband organism and expose a stable organismSnapshot + artery.",

    never: Object.freeze([
      "auto-discover organs",
      "mutate external config",
      "perform routing",
      "perform UI logic",
      "introduce randomness",
      "touch internet directly"
    ]),

    always: Object.freeze([
      "assemble organs deterministically",
      "wire organs explicitly",
      "register organs with conductor and registry",
      "initialize organism in a pure sequence",
      "expose organismSnapshot deterministically",
      "expose organismArtery deterministically",
      "remain minimal and canonical"
    ])
  })
});

// ============================================================================
//  IMPORTS — binary organs (v11.3‑EVO lineage)
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
import { createPersonaEngine } from "./persona.js";
import { createBoundariesEngine } from "./boundaries.js";
import { createPermissionsEngine } from "./permissions.js";

// ============================================================================
//  COGNITIVE FRAME / CONTEXT / CORTEX
// ============================================================================
import createCognitiveFrame, {
  COGNITIVE_FRAME_META,
  prewarmCognitiveFrame
} from "./aiContext.js";

import {
  createContextEngine,
  prewarmContextEngine
} from "./aiContextEngine.js";

import {
  createCortex,
  prewarmAICortex
} from "./aiCortex-v11-Evo.js";

// ============================================================================
//  EMOTION / EXPERIENCE / PERSONALITY
// ============================================================================
import aiEmotionEngine, {
  prewarmEmotionEngine
} from "./aiEmotionEngine.js";

import createExperienceEngine from "./aiExperience.js";
import { createPersonalityEngine } from "./aiPersonalityEngine.js";
import { createPersonalFrame } from "./aiPersonalFrame.js";

// ============================================================================
//  DELIVERY / EVOLUTION / DUALBAND
// ============================================================================
import aiDeliveryEngine, {
  prewarmDeliveryEngine
} from "./aiDeliveryEngine.js";

import { aiEvolutionEngine } from "./aiEvolutionEngine-v16.js";
import { aiDualBand } from "./aiDualBand-v16.js";

// ============================================================================
//  SCRIBE / DIAGNOSTICS / DEPS
// ============================================================================
import {
  SCRIBE_META,
  formatDebugReport,
  formatDebugString,
  prewarmScribe
} from "./aiDebug.js";

import {
  DiagnosticsMeta,
  createDiagnosticsState,
  attachDiagnosticsOrgan,
  createDiagnosticsAPI,
  prewarmDiagnosticsOrgan
} from "./aiDiagnostics.js";

import {
  DiagnosticsWriteMeta,
  createDiagnosticsWriteOrgan,
  prewarmDiagnosticsWriteOrgan
} from "./aiDiagnosticsWrite.js";

import depsSurface, {
  DepsMeta,
  getDb,
  getFsAPI,
  getRouteAPI,
  getSchemaAPI,
  getOrganismSnapshot,
  emitDepsPacket,
  prewarmDepsLayer
} from "./aiDeps.js";

// ============================================================================
//  AI ENGINE
// ============================================================================
import { runAI, ExecutionEngineMeta } from "./aiEngine-v16.js";

// ============================================================================
//  ORGANISM ARTERY — v16 IMMORTAL++
// ============================================================================
function computeOrganismArtery(self) {
  const registryCount = self.registry?.count?.() ?? 0;
  const metabolicPressure = self.metabolism?.getPressure?.() ?? null;
  const metabolicLoad = self.metabolism?.getLoad?.() ?? null;
  const immunityState = self.immunity?.getState?.() ?? null;

  const buckets = {
    registry: registryCount > 64 ? "high" : registryCount > 0 ? "medium" : "none",
    metabolic:
      metabolicPressure != null
        ? metabolicPressure >= 0.9
          ? "critical"
          : metabolicPressure >= 0.7
          ? "high"
          : metabolicPressure >= 0.4
          ? "medium"
          : metabolicPressure > 0
          ? "low"
          : "none"
        : "none"
  };

  return Object.freeze({
    meta: {
      layer: OrganismMeta.layer,
      role: OrganismMeta.role,
      version: OrganismMeta.version,
      identity: OrganismMeta.identity
    },
    registryCount,
    metabolicPressure,
    metabolicLoad,
    immunityState,
    buckets
  });
}

// ============================================================================
//  ORGANISM IMPLEMENTATION — v16 IMMORTAL++
// ============================================================================
export class AIOrganism {
  constructor(config = {}) {
    this.id = config.id || OrganismMeta.identity;
    this.trace = !!config.trace;

    // ---------------------------------------------------------
    //  BINARY LAYER
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

    this.immunity = createAIBinaryImmunity({
      id: "immunity",
      encoder: this.agent,
      anatomy: config.anatomy,
      evolution: this.evolution,
      registry: this.registry,
      pipeline: this.pipeline,
      reflex: this.reflex,
      logger: this.logger,
      trace: this.trace
    });

    this.nervous = createAIBinaryNervousSystem({
      id: "nervous-system",
      encoder: this.agent,
      anatomy: config.anatomy,
      immunity: this.immunity,
      registry: this.registry,
      logger: this.logger,
      trace: this.trace
    });

    this.conductor = createAIBinaryConductor({
      id: "conductor",
      trace: this.trace
    });

    // ---------------------------------------------------------
    //  SUPEREGO / COMMANDMENTS LAYER
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
    //  WIRING — binary
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
    //  SYMBOLIC WIRING
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
    //  PREWARM — symbolic + cognitive + diagnostics
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
    //  OPTIONAL SELF-RUNNING ENGINE
    // ---------------------------------------------------------
    if (config.autoRunEngine) {
      this.startEngine();
    }

    // ---------------------------------------------------------
    //  INITIALIZE ORGANISM
    // ---------------------------------------------------------
    this.conductor.initialize(this.registry, this.evolution);

    this._trace("organism:initialized", {
      organCount: organs.length,
      epoch: OrganismMeta.evo.epoch
    });

    this._lastArtery = null;
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
    try {
      return getOrganismSnapshot(this.deps) || this.memory.snapshot();
    } catch {
      return this.memory.snapshot();
    }
  }

  organismArtery() {
    const artery = computeOrganismArtery(this);
    this._lastArtery = artery;
    return artery;
  }

  startEngine(task = { mode: "heartbeat" }) {
    this._trace("engine:start", { task });
    return this.engine.run(task);
  }

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
//  PREWARM WRAPPER — v16 IMMORTAL++
// ============================================================================
export function prewarmAIOrganism({ trace = false } = {}) {
  try {
    prewarmDepsLayer();
    prewarmDiagnosticsOrgan();
    prewarmDiagnosticsWriteOrgan();
    prewarmScribe();

    prewarmEmotionEngine();
    prewarmDeliveryEngine();

    prewarmContextEngine();
    prewarmCognitiveFrame();
    prewarmAICortex();

    emitDepsPacket();
    formatDebugReport({ trace: ["organism-prewarm"] }, null);
    formatDebugString({ trace: ["organism-prewarm"] }, null);

    return true;
  } catch (err) {
    console.error("[AIOrganism Prewarm v16++] Failed:", err);
    return false;
  }
}

// ============================================================================
//  FACTORY
// ============================================================================
export function createAIOrganism(config = {}) {
  prewarmAIOrganism({ trace: !!config.trace });
  return new AIOrganism(config);
}

// ============================================================================
//  DUAL‑MODE EXPORTS
// ============================================================================
export default createAIOrganism;

if (typeof module !== "undefined") {
  module.exports = {
    AIOrganism,
    createAIOrganism,
    OrganismMeta
  };
}
