// ============================================================================
//  ai-v12.3-EVO+.js
//  DUALBAND ORGANISM BOOTLOADER — v12.3-EVO+
// ============================================================================

// ============================================================================
//  META BLOCK — v12.3‑EVO+ (ORGANISM KERNEL)
// ============================================================================
export const OrganismKernelMeta = Object.freeze({
  layer: "OrganismKernel",
  role: "DUALBAND_BOOTLOADER",
  version: "12.3-EVO+",
  identity: "pulse-organism-kernel-v12.3-EVO+",

  evo: Object.freeze({
    deterministic: true,
    driftProof: true,
    dualband: true,
    organism: true,
    bootloader: true,
    multiInstanceReady: true,
    organismArteryAware: true,
    epoch: "12.3-EVO+"
  }),

  contract: Object.freeze({
    purpose:
      "Assemble all binary organs, wire anatomy and registry, and boot the dualband organism deterministically.",

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
      "start scheduler only on boot",
      "return a stable organism surface"
    ])
  })
});

// ============================================================================
//  IMPORT ALL BINARY ORGANS
// ============================================================================
import { AIBinaryAgent } from "./aiBinaryAgent.js";
import { AIBinaryMemory } from "./aiMemory-v11-Evo.js";        // legacy memory
import { AIMemory as AIPulseCoreMemory } from "./aiMemory.js"; // new PulseCoreMemory-based memory

import { AIBinaryAnatomy } from "./aiAnatomy.js";
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
//  ORGANISM CONTEXT — IDENTITY OF THE DUALBAND ORGANISM
// ============================================================================
const ORGANISM_CONTEXT = {
  layer: OrganismKernelMeta.layer,
  role: OrganismKernelMeta.role,
  version: OrganismKernelMeta.version,
  lineage: "pulse-organism-v12.3-evo",
  evo: OrganismKernelMeta.evo
};

// ============================================================================
//  BINARY ORGANISM PREWARM ENGINE — v12.3-EVO+
// ============================================================================
export function prewarmBinaryOrganism(config = {}) {
  try {
    const { trace = false } = config;

    // 1) Prewarm Binary Agent (encoder/decoder)
    const warmAgent = new AIBinaryAgent({ id: "prewarm-agent", maxBits: 1024, trace });
    warmAgent.encode?.("prewarm");
    warmAgent.decode?.(warmAgent.encode?.("prewarm"), "string");

    // 2) Prewarm Memory (legacy + core)
    const warmLegacy = new AIBinaryMemory({ id: "prewarm-memory-legacy", maxBits: 2048, trace });
    const warmCore   = new AIPulseCoreMemory({ id: "prewarm-memory-core", maxBits: 2048, trace });

    const k = warmAgent.encode("prewarm-key");
    const v = warmAgent.encode("prewarm-value");

    warmLegacy.write(k, v);
    warmLegacy.read(k);
    warmLegacy.listKeys?.();

    warmCore.write(k, v);
    warmCore.read(k);
    warmCore.listKeys?.();

    // 3) Prewarm Evolution + Registry
    const warmRegistry = new AIBinaryOrganRegistry({
      id: "prewarm-registry",
      encoder: warmAgent,
      memory: warmLegacy,
      trace
    });

    const warmEvolution = new AIBinaryEvolution({
      id: "prewarm-evolution",
      encoder: warmAgent,
      memory: warmLegacy,
      trace
    });

    warmEvolution.generateSignature({ id: "prewarm-organ", constructor: { name: "PrewarmOrgan" } });
    warmRegistry.registerOrgan({ id: "prewarm-organ", constructor: { name: "PrewarmOrgan" } });

    // 4) Prewarm Anatomy + Genome
    const warmAnatomy = new AIBinaryAnatomy({
      id: "prewarm-anatomy",
      encoder: warmAgent,
      memory: warmLegacy,
      trace
    });

    warmAnatomy.registerOrgan("prewarm-organ");
    warmAnatomy.store();

    const warmGenome = new AIBinaryGenome({
      id: "prewarm-genome",
      encoder: warmAgent,
      registry: warmRegistry,
      evolution: warmEvolution,
      memory: warmLegacy,
      trace
    });

    warmGenome.storeGenome();

    // 5) Prewarm Reflex + Pipeline + Scheduler
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

    // 6) Prewarm Metabolism + Sentience + Hormones + Consciousness
    const warmVitals = new AIBinaryVitals({
      id: "prewarm-vitals",
      encoder: warmAgent,
      memory: warmLegacy,
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
//  createBinaryOrganism() — v12.3‑EVO+
// ============================================================================
export function createBinaryOrganism({ trace = false } = {}) {
  // Prewarm the entire binary organism physiology
  prewarmBinaryOrganism({ trace });

  // 1) Binary Cortex (Agent)
  const encoder = new AIBinaryAgent({
    id: "ai-binary-agent",
    maxBits: 4096,
    trace
  });

  // 2) Memory organs (legacy + new)
  const memoryLegacy = new AIBinaryMemory({
    id: "ai-binary-memory-legacy",
    maxBits: 16384,
    trace
  });

  const memoryCore = new AIPulseCoreMemory({
    id: "ai-binary-memory-core",
    maxBits: 16384,
    trace
  });

  // For backward compatibility, keep `memory` pointing at the legacy one
  const memory = memoryLegacy;

  // 3) Registry + Evolution + Immunity
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

  // 4) Anatomy + Vitals + Genome
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

  // 5) Pipeline + Reflex + Scheduler
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

  // 6) Metabolism + Sentience + Hormones + Consciousness
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

  // 7) Register all organs + wire anatomy
  const organs = {
    encoder,
    memory,          // legacy default
    memoryLegacy,
    memoryCore,      // new PulseCoreMemory-based organ
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

  // Canonical wiring
  anatomy.connect(metabolism.id, hormones.id);
  anatomy.connect(hormones.id, consciousness.id);
  anatomy.connect(sentience.id, consciousness.id);
  anatomy.connect(vitals.id, metabolism.id);

  // Persist anatomy + genome
  anatomy.store();
  genome.storeGenome();

  return {
    context: ORGANISM_CONTEXT,
    ...organs
  };
}

// ============================================================================
//  bootBinaryOrganism() — v12.3‑EVO+
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
  boot: bootBinaryOrganism
};

export default PulseOrganismBoot;
