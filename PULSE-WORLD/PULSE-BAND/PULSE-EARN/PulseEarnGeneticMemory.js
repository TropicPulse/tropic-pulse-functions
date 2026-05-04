// ============================================================================
// FILE: tropic-pulse-functions/PULSE-WORLD/PULSE-EARN/PulseEarnGeneticMemory-v13.0-PRESENCE-IMMORTAL.js
// LAYER: THE GENETIC MEMORY (v13.0-PRESENCE-IMMORTAL)
// (Keeper of Packets + Guardian of Determinism + DNA Repair Substrate)
// ============================================================================
//
// ROLE (v13.0-PRESENCE-IMMORTAL):
//   THE GENETIC MEMORY — Pulse‑Earn’s deterministic packet genome.
//   • Stores packet data in a safe, in‑memory gene archive.
//   • Generates deterministic packet values (genetic identity).
//   • Maintains packet‑level healing metadata (genetic health).
//   • Emits v13‑Presence‑IMMORTAL genetic signatures.
//   • Dual-band, binary-aware, wave-aware, presence/advantage/chunk-aware.
//
// CONTRACT (v13.0-PRESENCE-IMMORTAL):
//   • PURE PACKET ENGINE — no AI layers, no translation, no memory model.
//   • NO eval(), NO Function(), NO dynamic imports.
//   • NO network calls, NO filesystem, NO timestamps.
//   • Deterministic hashing + safe in‑memory storage only.
//   • Presence/advantage/chunk surfaces DO NOT affect behavior.
// ============================================================================
/*
AI_EXPERIENCE_META = {
  identity: "PulseEarnGeneticMemory",
  version: "v14-IMMORTAL",
  layer: "earn_genetic",
  role: "earn_genetic_memory",
  lineage: "PulseEarnGeneticMemory-v11 → v12.3 → v14-IMMORTAL",

  evo: {
    geneticMemory: true,
    jobLineage: true,
    jobEvolution: true,
    dualBand: true,
    symbolicPrimary: true,
    binaryAware: true,

    deterministic: true,
    driftProof: true,
    pureCompute: true,
    zeroMutationOfInput: true,
    zeroNetwork: true,
    zeroFilesystem: true
  },

  contract: {
    always: [
      "PulseEarn",
      "PulseEarnEndocrineSystem",
      "PulseEarnContinuancePulse"
    ],
    never: [
      "safeRoute",
      "fetchViaCNS"
    ]
  }
}
*/

import { PulseProofBridge } from "../../PULSE-UI/_BACKEND/PulseProofBridge.js";

export const PulseEarnGeneticMemoryMeta = Object.freeze({
  layer: "PulseEarnGeneticMemory",
  role: "EARN_GENETIC_MEMORY_ORGAN",
  version: "v13.0-PRESENCE-IMMORTAL",
  identity: "PulseEarnGeneticMemory-v13.0-PRESENCE-IMMORTAL",

  guarantees: Object.freeze({
    deterministic: true,
    noRandomness: true,
    noRealTime: true,
    noExternalIO: true,
    purePacketEngine: true,

    dualBandAware: true,
    binaryAware: true,
    waveFieldAware: true,

    presenceAware: true,
    advantageAware: true,
    chunkPrewarmAware: true,
    healingMetadataAware: true,

    genomeSafe: true,
    worldLensAware: false
  }),

  contract: Object.freeze({
    input: [
      "fileId",
      "packetIndex",
      "PacketData",
      "DualBandContext",
      "GlobalHintsPresenceField"
    ],
    output: [
      "GeneExistsFlag",
      "GeneWriteResult",
      "GeneSynthesisResult",
      "GeneticSignatures",
      "GeneticHealingState"
    ]
  })
});

// ============================================================================
// Healing Metadata — Genetic Health Log (v13 IMMORTAL)
// ============================================================================
const geneticHealing = {
  lastKey: null,
  lastWrite: null,
  lastGenerated: null,
  lastError: null,

  cycleCount: 0,
  lastCycleIndex: null,

  lastGeneSignature: null,
  lastWriteSignature: null,
  lastSynthesisSignature: null,

  // Dual-Band + Binary + Wave
  lastBand: "symbolic",
  lastBandSignature: null,
  lastBinaryField: null,
  lastWaveField: null,

  // v13 Presence / Advantage / Chunk
  lastPresenceField: null,
  lastAdvantageField: null,
  lastChunkPlan: null
};

// ============================================================================
// In‑Memory Genome — Packet Store (Chromosome Map)
// ============================================================================
const genome = new Map();

// Deterministic cycle counter
let geneCycle = 0;
// ============================================================================
// PulseProofBridge — deterministic proof surfaces for genetic memory
// ============================================================================
const proof = new PulseProofBridge({
  namespace: "PulseEarnGeneticMemory-v15-IMMORTAL",
  layer: "GeneticMemory",
  role: "GeneProofSurface",
  version: "v15-IMMORTAL-CHUNK",
  deterministic: true,
  driftProof: true
});

// ============================================================================
// Deterministic Hash Helper
// ============================================================================
function computeHash(str) {
  let h = 0;
  const s = String(str || "");
  for (let i = 0; i < s.length; i++)
    h = (h + s.charCodeAt(i) * (i + 1)) % 100000;
  return `h${h}`;
}

function normalizeBand(band) {
  const b = String(band || "symbolic").toLowerCase();
  return b === "binary" ? "binary" : "symbolic";
}

function classifyPresenceTier(pressure) {
  if (pressure >= 150) return "critical";
  if (pressure >= 100) return "high";
  if (pressure >= 50) return "elevated";
  if (pressure > 0) return "soft";
  return "idle";
}

function buildPresenceField(globalHints = {}, cycle) {
  const ghP = globalHints.presenceContext || {};
  const mesh = globalHints.meshSignals || {};
  const castle = globalHints.castleSignals || {};
  const region = globalHints.regionContext || {};

  const meshStrength = Number(mesh.meshStrength || 0);
  const meshPressureExternal = Number(mesh.meshPressureIndex || 0);
  const castleLoadExternal = Number(castle.loadLevel || 0);

  const internalComposite = cycle * 0.0001;
  const internalPressure = Math.floor(internalComposite * 1000);

  const meshPressureIndex = meshPressureExternal + internalPressure;
  const castleLoadLevel = castleLoadExternal;

  const pressure = meshPressureIndex + castleLoadLevel;
  const presenceTier = classifyPresenceTier(pressure);

  return {
    presenceVersion: "v13.0-PRESENCE-IMMORTAL",
    presenceTier,

    bandPresence: ghP.bandPresence || "symbolic",
    routerPresence: ghP.routerPresence || "stable",
    devicePresence: ghP.devicePresence || "genetic-memory",

    meshPresence: ghP.meshPresence || (meshStrength > 0 ? "mesh-active" : "mesh-idle"),
    castlePresence: ghP.castlePresence || castle.castlePresence || "genetic-region",
    regionPresence: ghP.regionPresence || region.regionTag || "unknown-region",

    regionId: region.regionId || "genetic-region",
    castleId: castle.castleId || "genetic-castle",

    meshStrength,
    meshPressureIndex,
    castleLoadLevel,

    cycle,

    presenceSignature: computeHash(
      `GENETIC_PRESENCE::${presenceTier}::${meshPressureIndex}::${castleLoadLevel}`
    )
  };
}

function buildAdvantageField(binaryField, waveField, presenceField, globalHints = {}) {
  const density = binaryField.binarySurface.density;
  const amplitude = waveField.amplitude;

  const baseScore =
    density * 0.00001 +
    amplitude * 0.00001;

  const presenceBoost =
    presenceField.presenceTier === "critical" ? 0.02 :
    presenceField.presenceTier === "high" ? 0.015 :
    presenceField.presenceTier === "elevated" ? 0.01 :
    presenceField.presenceTier === "soft" ? 0.005 :
    0;

  const advantageScore = baseScore + presenceBoost;

  let advantageTier = 0;
  if (advantageScore >= 0.05) advantageTier = 3;
  else if (advantageScore >= 0.02) advantageTier = 2;
  else if (advantageScore > 0) advantageTier = 1;

  return {
    advantageVersion: "C-13.0",
    advantageScore,
    advantageTier,
    fallbackBandLevel: globalHints.fallbackBandLevel ?? 0
  };
}

function buildChunkPrewarmPlan(presenceField, advantageField) {
  const basePriority =
    presenceField.presenceTier === "critical"
      ? 4
      : presenceField.presenceTier === "high"
      ? 3
      : presenceField.presenceTier === "elevated"
      ? 2
      : presenceField.presenceTier === "soft"
      ? 1
      : 0;

  const advantageBoost =
    advantageField.advantageTier >= 3 ? 2 :
    advantageField.advantageTier === 2 ? 1 :
    0;

  return {
    planVersion: "v13.0-GeneticMemory-AdvantageC",
    priority: basePriority + advantageBoost,
    band: presenceField.presenceTier,
    chunks: {
      geneEnvelope: true,
      geneRepairMatrix: true
    },
    cache: {
      geneticDiagnostics: true
    },
    prewarm: {
      nervousSystem: true,
      muscleSystem: true,
      lymphNodes: true
    }
  };
}

function buildBinaryField(size, cycle) {
  const density = size + cycle;
  const surface = density + size;

  return {
    binaryGeneSignature: computeHash(`BGENE::${surface}`),
    binarySurfaceSignature: computeHash(`BGENE_SURF::${surface}`),
    binarySurface: {
      size,
      density,
      surface
    },
    parity: surface % 2 === 0 ? 0 : 1,
    shiftDepth: Math.max(0, Math.floor(Math.log2(surface || 1)))
  };
}

function buildWaveField(size, cycle, band) {
  const amplitude = size + cycle;
  const wavelength = cycle + 1;
  const phase = (size + cycle) % 16;

  return {
    amplitude,
    wavelength,
    phase,
    band,
    mode: band === "binary" ? "compression-wave" : "symbolic-wave"
  };
}

export function readPulseEarnGeneExists(fileId, packetIndex, band = "symbolic", globalHints = {}) {
  geneCycle++;
  geneticHealing.cycleCount++;
  geneticHealing.lastCycleIndex = geneCycle;

  const normalizedBand = normalizeBand(band);
  geneticHealing.lastBand = normalizedBand;
  geneticHealing.lastBandSignature = computeHash(`BAND::${normalizedBand}`);

  const presenceField = buildPresenceField(globalHints, geneCycle);
  const binaryField = buildBinaryField(0, geneCycle);
  const waveField = buildWaveField(0, geneCycle, normalizedBand);
  const advantageField = buildAdvantageField(binaryField, waveField, presenceField, globalHints);
  const chunkPlan = buildChunkPrewarmPlan(presenceField, advantageField);

  geneticHealing.lastPresenceField = presenceField;
  geneticHealing.lastAdvantageField = advantageField;
  geneticHealing.lastChunkPlan = chunkPlan;

  try {
    const key = `${fileId}:${packetIndex}:${normalizedBand}`;
    geneticHealing.lastKey = key;

    geneticHealing.lastGeneSignature = computeHash(`GENE::${key}::${geneCycle}`);

    // 🔥 NEW: Proof surface
    proof.write("read", {
      key,
      fileId,
      packetIndex,
      band: normalizedBand,
      cycle: geneCycle,
      presenceField,
      binaryField,
      waveField,
      advantageField,
      chunkPlan
    });

    return genome.has(key);

  } catch (err) {
    geneticHealing.lastError = err.message;
    return false;
  }
}


export function writePulseEarnGene(fileId, packetIndex, data, band = "symbolic", globalHints = {}) {
  geneCycle++;
  geneticHealing.cycleCount++;
  geneticHealing.lastCycleIndex = geneCycle;

  const normalizedBand = normalizeBand(band);
  geneticHealing.lastBand = normalizedBand;
  geneticHealing.lastBandSignature = computeHash(`BAND::${normalizedBand}`);

  const presenceField = buildPresenceField(globalHints, geneCycle);

  try {
    const key = `${fileId}:${packetIndex}:${normalizedBand}`;
    geneticHealing.lastKey = key;

    genome.set(key, structuredClone(data));

    const size = JSON.stringify(data).length;

    const binaryField = buildBinaryField(size, geneCycle);
    const waveField = buildWaveField(size, geneCycle, normalizedBand);
    const advantageField = buildAdvantageField(binaryField, waveField, presenceField, globalHints);
    const chunkPlan = buildChunkPrewarmPlan(presenceField, advantageField);

    geneticHealing.lastBinaryField = binaryField;
    geneticHealing.lastWaveField = waveField;
    geneticHealing.lastPresenceField = presenceField;
    geneticHealing.lastAdvantageField = advantageField;
    geneticHealing.lastChunkPlan = chunkPlan;

    geneticHealing.lastWrite = {
      key,
      size,
      cycleIndex: geneCycle
    };

    geneticHealing.lastWriteSignature = computeHash(`WRITE::${key}::${size}`);
    geneticHealing.lastError = null;

    // 🔥 NEW: Proof surface
    proof.write("write", {
      key,
      fileId,
      packetIndex,
      band: normalizedBand,
      size,
      cycle: geneCycle,
      presenceField,
      binaryField,
      waveField,
      advantageField,
      chunkPlan
    });

    return true;

  } catch (err) {
    geneticHealing.lastError = err.message;
    return false;
  }
}


export function synthesizePulseEarnGene(fileId, packetIndex, band = "symbolic", globalHints = {}) {
  geneCycle++;
  geneticHealing.cycleCount++;
  geneticHealing.lastCycleIndex = geneCycle;

  const normalizedBand = normalizeBand(band);
  geneticHealing.lastBand = normalizedBand;
  geneticHealing.lastBandSignature = computeHash(`BAND::${normalizedBand}`);

  const presenceField = buildPresenceField(globalHints, geneCycle);

  try {
    const key = `${fileId}:${packetIndex}:${normalizedBand}`;
    geneticHealing.lastKey = key;

    // Deterministic FNV‑1a hash → genetic identity
    let hash = 2166136261;
    for (let i = 0; i < key.length; i++) {
      hash ^= key.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }

    const value = (hash >>> 0) / 0xffffffff;

    const gene = {
      fileId,
      packetIndex,
      key,
      value,
      band: normalizedBand,
      cycleIndex: geneCycle
    };

    const size = Math.floor(value * 1000);

    const binaryField = buildBinaryField(size, geneCycle);
    const waveField = buildWaveField(size, geneCycle, normalizedBand);
    const advantageField = buildAdvantageField(binaryField, waveField, presenceField, globalHints);
    const chunkPlan = buildChunkPrewarmPlan(presenceField, advantageField);

    geneticHealing.lastGenerated = gene;
    geneticHealing.lastSynthesisSignature = computeHash(`SYNTH::${key}::${value}`);

    geneticHealing.lastBinaryField = binaryField;
    geneticHealing.lastWaveField = waveField;
    geneticHealing.lastPresenceField = presenceField;
    geneticHealing.lastAdvantageField = advantageField;
    geneticHealing.lastChunkPlan = chunkPlan;

    geneticHealing.lastError = null;

    // 🔥 NEW: Proof surface
    proof.write("synthesize", {
      key,
      fileId,
      packetIndex,
      band: normalizedBand,
      value,
      size,
      cycle: geneCycle,
      presenceField,
      binaryField,
      waveField,
      advantageField,
      chunkPlan
    });

    return gene;

  } catch (err) {
    geneticHealing.lastError = err.message;
    return null;
  }
}


export function getPulseEarnGeneticMemoryHealingState() {
  return { ...geneticHealing };
}
