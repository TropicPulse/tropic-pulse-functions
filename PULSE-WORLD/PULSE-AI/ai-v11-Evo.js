// ============================================================================
//  ai-v11-Evo.js
//  THE FIRST DUALBAND ORGANISM BOOTLOADER — v11-EVO
// ============================================================================

// ============================================================================
//  META BLOCK — v11‑EVO (ORGANISM KERNEL)
// ============================================================================
export const OrganismKernelMeta = Object.freeze({
  layer: "OrganismKernel",
  role: "DUALBAND_BOOTLOADER",
  version: "11.1-EVO",
  identity: "pulse-organism-kernel-v11-EVO",

  evo: Object.freeze({
    deterministic: true,
    driftProof: true,
    dualband: true,
    organism: true,
    bootloader: true,
    multiInstanceReady: true,
    epoch: "v11-EVO"
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
  lineage: "pulse-organism-v11-evo",
  evo: OrganismKernelMeta.evo
};

// ============================================================================
//  createBinaryOrganism()
// ============================================================================
export function createBinaryOrganism({ trace = false } = {}) {
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
//  bootBinaryOrganism()
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
