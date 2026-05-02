// ============================================================================
//  FILE: PulseBinaryShifterEvolutionaryPulse-v14.0-PRESENCE-IMMORTAL.js
//  Pulse v2 • Binary Shifter Evolutionary Pulse Front-End (v14.0-PRESENCE-IMMORTAL)
//  IMMORTAL: BinaryStrength + BitsSummary + Hints Surface + Band/DNA + Presence
//  • Dual-band aware (symbolic/binary, non-executable binary)
//  • Drift-proof contract, no randomness, no external mutation
//  • Presence/harmonics/immortal-band surfaced as metadata only
// ============================================================================

import {
  PulseRole as EvolutionPulseRole,
  createPulseV2,
  evolvePulseV2
} from "./PulseShifterEvolutionaryPulse-v11-Evo.js";

// ============================================================================
//  PulseBinaryRole — IMMORTAL binary front-end for evolution
// ============================================================================

export const PulseBinaryRole = {
  type: "Pulse",
  subsystem: "Pulse",
  layer: "BinaryFrontEnd",
  version: "14.0-PRESENCE-IMMORTAL",
  identity: "PulseBinaryShifterEvolutionaryPulse-v14.0-PRESENCE-IMMORTAL",

  evo: {
    binaryFrontEnd: true,
    evolutionBackEnd: "PulseShifterEvolutionaryPulse-v11-Evo",

    // Mirror back-end guarantees, IMMORTAL surface.
    driftProof: EvolutionPulseRole.evo.driftProof,
    unifiedAdvantageField: EvolutionPulseRole.evo.unifiedAdvantageField,
    pulseV2Ready: EvolutionPulseRole.evo.pulseV2Ready,
    futureEvolutionReady: EvolutionPulseRole.evo.futureEvolutionReady,

    // Explicit binary surface flags
    binaryStrengthAware: true,
    binaryHintsSurfaceReady: true,
    bitsSummaryReady: true,

    // IMMORTAL band / presence surfaces (descriptive-only)
    dualBandAware: true,
    symbolicPrimary: true,
    binaryNonExecutable: true,
    presenceAware: true,
    harmonicsAware: true,
    epochStable: true,
    passivePrewarm: true,
    passiveCache: true,
    passiveChunk: true,
    passiveRemember: true
  },

  routingContract: EvolutionPulseRole.routingContract,
  meshContract: EvolutionPulseRole.meshContract,
  sendContract: EvolutionPulseRole.sendContract,
  gpuOrganContract: EvolutionPulseRole.gpuOrganContract,
  earnCompatibility: EvolutionPulseRole.earnCompatibility
};

// ============================================================================
//  INTERNAL HELPERS — BITS → NUMBERS / STRINGS / MODES / HINTS
//  (deterministic, no randomness, no external mutation)
// ============================================================================

function bitsToNumber(bits) {
  const safe = Array.isArray(bits) ? bits : [];
  let n = 0;
  for (let i = 0; i < safe.length; i++) {
    n = (n << 1) | (safe[i] & 1);
  }
  return n >>> 0;
}

function bitsToHex(bits, maxNibbles = 8) {
  const n = bitsToNumber(bits);
  const hex = n.toString(16).padStart(2, "0");
  return hex.slice(-maxNibbles);
}

function bitsToPattern(bits, prefix = "bp") {
  const hex = bitsToHex(bits, 8);
  return `${prefix}/${hex}`;
}

function bitsToMode(bits) {
  const safe = Array.isArray(bits) ? bits : [];
  if (safe.length === 0) return "normal";
  const n = bitsToNumber(safe) % 4;
  if (n === 0) return "normal";
  if (n === 1) return "stress";
  if (n === 2) return "drain";
  return "recovery";
}

function bitsToPayload(bits, maxKeys = 4) {
  const safe = Array.isArray(bits) ? bits : [];
  const payload = {};
  const chunkSize = 8;
  const count = Math.min(maxKeys, Math.floor(safe.length / chunkSize));

  for (let i = 0; i < count; i++) {
    const start = i * chunkSize;
    const slice = safe.slice(start, start + chunkSize);
    const val = bitsToNumber(slice);
    payload[`k${i}`] = val;
  }

  return payload;
}

function bitsToHints(bits) {
  const safe = Array.isArray(bits) ? bits : [];
  const n = bitsToNumber(safe);

  const routerHint = `r${n % 7}`;
  const meshHint   = `m${(n >> 3) % 5}`;
  const organHint  = `o${(n >> 6) % 9}`;

  return { routerHint, meshHint, organHint };
}

function computeBinaryStrength(bits) {
  const safe = Array.isArray(bits) ? bits : [];
  if (safe.length === 0) return 0;
  let ones = 0;
  for (let i = 0; i < safe.length; i++) {
    if (safe[i]) ones++;
  }
  return ones / safe.length; // 0..1
}

// IMMORTAL band metadata: band + dnaTag are descriptive-only
function deriveBandMetadata({ bits, defaultBand = "symbolic", dnaSeed = null } = {}) {
  const safe = Array.isArray(bits) ? bits : [];
  const hasBits = safe.length > 0;

  const band = hasBits && safe.length % 2 === 0 ? "binary" : defaultBand;

  let dnaTag = null;
  if (typeof dnaSeed === "string" && dnaSeed.length > 0) {
    dnaTag = dnaSeed;
  } else if (hasBits) {
    dnaTag = `dna-${bitsToHex(safe, 6)}`;
  }

  return { band, dnaTag };
}

function buildBitsSummary(bits, { band, dnaTag } = {}) {
  const safe = Array.isArray(bits) ? bits : [];
  const hasBits = safe.length > 0;
  if (!hasBits) {
    return {
      hasBits: false,
      bitsLength: 0,
      binaryPattern: null,
      binaryMode: "normal",
      binaryStrength: 0,
      routerHint: null,
      meshHint: null,
      organHint: null,
      band: band || "symbolic",
      dnaTag: dnaTag || null
    };
  }

  const binaryPattern  = bitsToPattern(safe, "bp");
  const binaryMode     = bitsToMode(safe);
  const binaryStrength = computeBinaryStrength(safe);
  const { routerHint, meshHint, organHint } = bitsToHints(safe);

  return {
    hasBits: true,
    bitsLength: safe.length,
    binaryPattern,
    binaryMode,
    binaryStrength,
    routerHint,
    meshHint,
    organHint,
    band: band || "symbolic",
    dnaTag: dnaTag || null
  };
}

// ============================================================================
//  BINARY → EVOLUTION CREATION (IMMORTAL SURFACE)
// ============================================================================

export function createBinaryEvolutionPulse({
  bits,
  jobId = null,
  priority = "normal",
  returnTo = null,
  parentLineage = null,
  pageId = "NO_PAGE",
  patternPrefix = "bp",
  // IMMORTAL band metadata (optional, descriptive-only)
  defaultBand = "symbolic",
  dnaSeed = null,
  presenceBandState = null,
  harmonicDrift = null,
  coherenceScore = null,
  trace = false
} = {}) {
  const safeBits = Array.isArray(bits) ? bits : [];
  const { band, dnaTag } = deriveBandMetadata({
    bits: safeBits,
    defaultBand,
    dnaSeed
  });

  const pattern  = bitsToPattern(safeBits, patternPrefix);
  const mode     = bitsToMode(safeBits);
  const payload  = bitsToPayload(safeBits);
  const hints    = bitsToHints(safeBits);
  const bitsSummary = buildBitsSummary(safeBits, { band, dnaTag });

  const enrichedPayload = {
    ...payload,
    routerHint: hints.routerHint,
    meshHint: hints.meshHint,
    organHint: hints.organHint,
    binaryStrength: bitsSummary.binaryStrength,
    __band: band,
    __dnaTag: dnaTag,
    presenceBandState,
    harmonicDrift,
    coherenceScore
  };

  if (trace) {
    console.log("[BinaryEvolution IMMORTAL] create", {
      bitsLength: safeBits.length,
      pattern,
      mode,
      payload: enrichedPayload,
      bitsSummary
    });
  }

  const pulse = createPulseV2({
    jobId,
    pattern,
    payload: enrichedPayload,
    priority,
    returnTo,
    parentLineage,
    mode,
    pageId
  });

  return {
    PulseBinaryRole,
    evolutionPulse: pulse,

    summary: {
      pattern: pulse.pattern,
      mode: pulse.mode,
      healthScore: pulse.healthScore,
      tier: pulse.tier,
      advantageField: pulse.advantageField,
      evolutionStage: pulse.meta.evolutionStage,
      shapeSignature: pulse.meta.shapeSignature,
      bitsSummary
    }
  };
}

// ============================================================================
//  BINARY → EVOLUTION STEP (IMMORTAL SURFACE)
// ============================================================================

export function evolveBinaryEvolutionPulse({
  evolutionPulse,
  bits,
  // IMMORTAL band metadata (optional, descriptive-only)
  defaultBand = "symbolic",
  dnaSeed = null,
  presenceBandState = null,
  harmonicDrift = null,
  coherenceScore = null,
  trace = false
} = {}) {
  if (!evolutionPulse) {
    throw new Error("evolveBinaryEvolutionPulse: evolutionPulse is required");
  }

  const safeBits = Array.isArray(bits) ? bits : [];
  const { band, dnaTag } = deriveBandMetadata({
    bits: safeBits,
    defaultBand,
    dnaSeed
  });

  const hints    = bitsToHints(safeBits);
  const bitsSummary = buildBitsSummary(safeBits, { band, dnaTag });

  if (trace) {
    console.log("[BinaryEvolution IMMORTAL] evolve", {
      bitsLength: safeBits.length,
      hints,
      bitsSummary
    });
  }

  const nextPulse = evolvePulseV2(evolutionPulse, {
    ...hints,
    __band: band,
    __dnaTag: dnaTag,
    presenceBandState,
    harmonicDrift,
    coherenceScore
  });

  return {
    PulseBinaryRole,
    evolutionPulse: nextPulse,

    summary: {
      pattern: nextPulse.pattern,
      mode: nextPulse.mode,
      healthScore: nextPulse.healthScore,
      tier: nextPulse.tier,
      advantageField: nextPulse.advantageField,
      evolutionStage: nextPulse.meta.evolutionStage,
      shapeSignature: nextPulse.meta.shapeSignature,
      bitsSummary
    }
  };
}

// ============================================================================
//  PUBLIC API — BINARY EVOLUTION FRONT-END (v14.0-PRESENCE-IMMORTAL)
// ============================================================================

export function createPulseBinaryShifterEvolutionaryPulse({ trace = false } = {}) {
  return {
    role: PulseBinaryRole,

    createFromBits(args) {
      return createBinaryEvolutionPulse({ ...args, trace });
    },

    evolveWithBits(args) {
      return evolveBinaryEvolutionPulse({ ...args, trace });
    }
  };
}
