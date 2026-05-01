// ============================================================================
//  ai-v13.0-EVO+++.js
//  DUALBAND ORGANISM BOOTLOADER — v13.0-EVO+++
// ============================================================================

// ============================================================================
//  META BLOCK — v13.0‑EVO+++ (ORGANISM KERNEL)
// ============================================================================
export const OrganismKernelMeta = Object.freeze({
  layer: "OrganismKernel",
  role: "DUALBAND_BOOTLOADER",
  version: "13.0-EVO+++",
  identity: "pulse-organism-kernel-v13.0-EVO+++",

  evo: Object.freeze({
    deterministic: true,
    driftProof: true,
    dualband: true,
    organism: true,
    bootloader: true,
    multiInstanceReady: true,
    organismArteryAware: true,
    nodeAdminAware: true,
    overmindAware: true,
    registryAware: true,
    prewarmAware: true,
    epoch: "13.0-EVO+++"
  }),

  contract: Object.freeze({
    purpose:
      "Assemble all binary organs, wire anatomy and registry, compute organism artery, and boot the dualband organism deterministically.",

    never: Object.freeze([
      "perform cognition",
      "override organ contracts",
      "mutate organ internals",
      "introduce randomness",
      "bypass registry or anatomy",
      "spawn multiple organisms implicitly"
    ]),

    always: Object.freeze([
      "instantiate all binary organs explicitly",
      "register organs in the binary registry",
      "wire anatomy deterministically",
      "persist anatomy and genome",
      "compute organism artery snapshot",
      "expose artery to NodeAdmin/Overmind",
      "start scheduler only on boot",
      "return a stable organism surface"
    ])
  })
});

// ============================================================================
//  IMPORT ALL BINARY ORGANS
// ============================================================================
import { AIBinaryAgent } from "./aiBinaryAgent.js";
import { AIMemory } from "./aiMemory-v13.0-ADV.js";   // upgraded memory

import { AIAnatomy as AIBinaryAnatomy } from "./aiAnatomy.js";
import { AIBinaryGenome } from "./aiGenome.js";
import { AIBinaryVitals } from "./aiVitals.js";
import { AIBinaryMetabolism } from "./aiMetabolism.js";
import { AIBinaryHormones } from "./aiHormones.js";
import { AIBinarySentience } from "./aiSentience.js";
import { AIBinaryConsciousness } from "./aiConsciousness.js";
import { AIBinaryImmunity } from "./aiImmunity.js";
import { AIBinaryPipeline } from "./aiPipeline.js";
import { AIBinaryReflex } from "./aiReflex.js";
import { AIBinaryScheduler } from "./aiScheduler.js";
import { AIBinaryOrganRegistry } from "./aiBinaryOrganRegistry.js";
import { AIBinaryEvolution } from "./aiBinaryEvolution.js";

// ============================================================================
//  GLOBAL ORGANISM ARTERY REGISTRY (READ-ONLY, METRICS-ONLY)
// ============================================================================
const _globalOrganismArteryRegistry = new Map();

export function getGlobalOrganismArteries() {
  const out = {};
  for (const [k, v] of _globalOrganismArteryRegistry.entries()) {
    out[k] = v;
  }
  return out;
}

function _registryKey(id) {
  return `${id || "binary-organism"}#0`;
}

// ============================================================================
//  ORGANISM CONTEXT — IDENTITY OF THE DUALBAND ORGANISM
// ============================================================================
const ORGANISM_CONTEXT = {
  layer: OrganismKernelMeta.layer,
  role: OrganismKernelMeta.role,
  version: OrganismKernelMeta.version,
  lineage: "pulse-organism-v13.0-evo",
  evo: OrganismKernelMeta.evo
};

// ============================================================================
//  BINARY ORGANISM PREWARM ENGINE — v13.0-EVO+++
// ============================================================================
export function prewarmBinaryOrganism(config = {}) {
  try {
    const { trace = false } = config;

    const warmAgent = new AIBinaryAgent({
      id: "prewarm-agent",
      maxBits: 2048,
      trace
    });

    warmAgent.encode?.("prewarm");
    warmAgent.decode?.(warmAgent.encode?.("prewarm"), "string");

    const warmMemory = new AIMemory({
      id: "prewarm-memory",
      maxBits: 4096,
      trace
    });

    const k = warmAgent.encode("prewarm-key");
    const v = warmAgent.encode("prewarm-value");

    warmMemory.write(k, v);
    warmMemory.read(k);
    warmMemory.listKeys?.();

    const warmRegistry = new AIBinaryOrganRegistry({
      id: "prewarm-registry",
      encoder: warmAgent,
      memory: warmMemory,
      trace
    });

    const warmEvolution = new AIBinaryEvolution({
      id: "prewarm-evolution",
      encoder: warmAgent,
      memory: warmMemory,
      trace
    });

    warmEvolution.generateSignature({
      id: "prewarm-organ",
      constructor: { name: "PrewarmOrgan" }
    });

    warmRegistry.registerOrgan({
      id: "prewarm-organ",
      constructor: { name: "PrewarmOrgan" }
    });

    const warmAnatomy = new AIBinaryAnatomy({
      id: "prewarm-anatomy",
      encoder: warmAgent,
      memory: warmMemory,
      trace
    });

    warmAnatomy.registerOrgan("prewarm-organ");
    warmAnatomy.store();

    const warmGenome = new AIBinaryGenome({
      id: "prewarm-genome",
      encoder: warmAgent,
      registry: warmRegistry,
      evolution: warmEvolution,
      memory: warmMemory,
      trace
    });

    warmGenome.storeGenome();

    const warmReflex = new AIBinaryReflex({ id: "prewarm-reflex", trace });
    const warmPipeline = new AIBinaryPipeline({ id: "prewarm-pipeline", trace });

    const warmScheduler = new AIBinaryScheduler({
      id: "prewarm-scheduler",
      encoder: warmAgent,
      pipeline: warmPipeline,
      reflex: warmReflex,
      trace
    });

    warmScheduler.tick?.();

    const warmVitals = new AIBinaryVitals({
      id: "prewarm-vitals",
      encoder: warmAgent,
      memory: warmMemory,
      evolution: warmEvolution,
      trace
    });

    const warmMetabolism = new AIBinaryMetabolism({
      id: "prewarm-metabolism",
      encoder: warmAgent,
      pipeline: warmPipeline,
      scheduler: warmScheduler,
      vitals: warmVitals,
      trace
    });

    const warmSentience = new AIBinarySentience({
      id: "prewarm-sentience",
      encoder: warmAgent,
      anatomy: warmAnatomy,
      genome: warmGenome,
      immunity: null,
      vitals: warmVitals,
      registry: warmRegistry,
      trace
    });

    const warmHormones = new AIBinaryHormones({
      id: "prewarm-hormones",
      encoder: warmAgent,
      metabolism: warmMetabolism,
      sentience: warmSentience,
      trace
    });

    const warmConsciousness = new AIBinaryConsciousness({
      id: "prewarm-consciousness",
      encoder: warmAgent,
      sentience: warmSentience,
      metabolism: warmMetabolism,
      hormones: warmHormones,
      vitals: warmVitals,
      anatomy: warmAnatomy,
      immunity: null,
      trace
    });

    warmConsciousness.generateConsciousnessPacket?.();

    return true;
  } catch (err) {
    console.error("[BinaryOrganism Prewarm] Failed:", err);
    return false;
  }
}

// ============================================================================
//  ORGANISM ARTERY SNAPSHOT (v13.0)
// ============================================================================
function computeOrganismArtery({ registry, anatomy, genome, memory, scheduler }) {
  const artery = Object.freeze({
    timestamp: Date.now(),
    registryCount: registry?.count?.() ?? 0,
    anatomyCount: anatomy?.count?.() ?? 0,
    genomeHash: genome?.hash?.() ?? null,
    memoryFootprint: memory?.size?.() ?? null,
    schedulerState: scheduler?.state?.() ?? null,
    buckets: {
      registry: registry?.count?.() > 32 ? "high" : "medium",
      memory: memory?.size?.() > 8192 ? "high" : "medium"
    }
  });

  const key = _registryKey("binary-organism");
  _globalOrganismArteryRegistry.set(key, artery);

  return artery;
}

// ============================================================================
//  createBinaryOrganism() — v13.0‑EVO+++
// ============================================================================
export function createBinaryOrganism({ trace = false, nodeAdminReporter = null, overmindReporter = null } = {}) {
  prewarmBinaryOrganism({ trace });

  const encoder = new AIBinaryAgent({
    id: "ai-binary-agent",
    maxBits: 4096,
    trace
  });

  const memory = new AIMemory({
    id: "ai-binary-memory",
    maxBits: 16384,
    trace,
    nodeAdminReporter,
    overmindReporter
  });

  const registry = new AIBinaryOrganRegistry({
    id: "ai-binary-organ-registry",
    encoder,
    memory,
    trace
  });

  const evolution = new AIBinaryEvolution({
    id: "ai-binary-evolution",
    encoder,
    memory,
    trace
  });

  const immunity = new AIBinaryImmunity({
    id: "ai-binary-immunity",
    encoder,
    registry,
    evolution,
    memory,
    trace
  });

  const anatomy = new AIBinaryAnatomy({
    id: "ai-binary-anatomy",
    encoder,
    memory,
    trace
  });

  const vitals = new AIBinaryVitals({
    id: "ai-binary-vitals",
    encoder,
    memory,
    evolution,
    trace
  });

  const genome = new AIBinaryGenome({
    id: "ai-binary-genome",
    encoder,
    registry,
    evolution,
    memory,
    trace
  });

  const reflex = new AIBinaryReflex({
    id: "ai-binary-reflex",
    trace
  });

  const pipeline = new AIBinaryPipeline({
    id: "ai-binary-pipeline",
    trace
  });

  const scheduler = new AIBinaryScheduler({
    id: "ai-binary-scheduler",
    encoder,
    pipeline,
    reflex,
    trace
  });

  const metabolism = new AIBinaryMetabolism({
    id: "ai-binary-metabolism",
    encoder,
    pipeline,
    scheduler,
    vitals,
    trace
  });

  const sentience = new AIBinarySentience({
    id: "ai-binary-sentience",
    encoder,
    anatomy,
    genome,
    immunity,
    vitals,
    registry,
    trace
  });

  const hormones = new AIBinaryHormones({
    id: "ai-binary-hormones",
    encoder,
    metabolism,
    sentience,
    trace
  });

  const consciousness = new AIBinaryConsciousness({
    id: "ai-binary-consciousness",
    encoder,
    sentience,
    metabolism,
    hormones,
    vitals,
    anatomy,
    immunity,
    trace
  });

  const organs = {
    encoder,
    memory,
    registry,
    evolution,
    immunity,
    anatomy,
    vitals,
    genome,
    pipeline,
    reflex,
    scheduler,
    metabolism,
    sentience,
    hormones,
    consciousness
  };

  for (const [, organ] of Object.entries(organs)) {
    if (!organ || !organ.id) continue;
    registry.registerOrgan(organ);
    anatomy.registerOrgan(organ.id);
  }

  anatomy.connect(metabolism.id, hormones.id);
  anatomy.connect(hormones.id, consciousness.id);
  anatomy.connect(sentience.id, consciousness.id);
  anatomy.connect(vitals.id, metabolism.id);

  anatomy.store();
  genome.storeGenome();

  const artery = computeOrganismArtery({
    registry,
    anatomy,
    genome,
    memory,
    scheduler
  });

  if (nodeAdminReporter) {
    try {
      nodeAdminReporter(artery, OrganismKernelMeta);
    } catch {}
  }

  if (overmindReporter) {
    try {
      overmindReporter(artery, OrganismKernelMeta);
    } catch {}
  }

  const readiness = Object.freeze({
    meta: {
      layer: "BinaryOrganismReadiness",
      role: "READINESS_SURFACE",
      version: "13.0-EVO+++",
      evo: {
        deterministic: true,
        driftProof: true,
        zeroMutation: true,
        zeroSecrets: true
      }
    },

    registryCount: registry?.count?.() ?? null,
    anatomyCount: anatomy?.count?.() ?? null,
    genomeHash: genome?.hash?.() ?? null,
    consciousnessHash: consciousness?.hash?.() ?? null,
    memoryFootprint: memory?.size?.() ?? null,
    schedulerState: scheduler?.state?.() ?? null,

    artery,
    prewarmed: true
  });

  return {
    context: ORGANISM_CONTEXT,
    ...organs,
    artery,
    readiness
  };
}

// ============================================================================
//  bootBinaryOrganism() — v13.0‑EVO+++
// ============================================================================
export async function bootBinaryOrganism(options = {}) {
  const organism = createBinaryOrganism(options);

  organism.scheduler.start();

  const firstConsciousness =
    organism.consciousness.generateConsciousnessPacket();

  return {
    ...organism,
    firstConsciousness
  };
}

// ============================================================================
//  DEFAULT EXPORT — DUALBAND ORGANISM KERNEL SURFACE
// ============================================================================
const PulseOrganismBoot = {
  ...ORGANISM_CONTEXT,
  meta: OrganismKernelMeta,
  create: createBinaryOrganism,
  boot: bootBinaryOrganism,
  getGlobalOrganismArteries
};

export default PulseOrganismBoot;
