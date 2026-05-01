// ============================================================================
//  FILE: PulseBinaryShifterEvolutionaryPulse-v12-Evo.js
//  Pulse v2 • Binary Shifter Evolutionary Pulse Front-End (v12-Evo)
//  v12.4: BinaryStrength + BitsSummary + Hints Surface + Drift-Proof Contract
// ============================================================================
//  ROLE:
//  -----
//  This organ is the BINARY FRONT-END for the PulseShifterEvolutionaryPulse
//  evolution engine.
//
//  • It speaks in bits.
//  • It derives pattern/mode/payload/hints from binary input.
//  • It calls the symbolic evolution core:
//        - createPulseV2
//        - evolvePulseV2
//  • It emits compact, binary-friendly summaries that routers/meshes/GPUs
//    can use without understanding the full symbolic structure.
//
//  DESIGN:
//  -------
//  - Back-end: PulseShifterEvolutionaryPulse-v11-Evo (symbolic evolution).
//  - Front-end: this file (binary shifter, v12-Evo surface).
//  - Safety: deterministic, no randomness, no network, no external mutation.
//  - Purpose: give the binary layer a way to "evolve" work using the v2 engine,
//    with an explicit binarySummary + hints surface.
//
//  This is a *bootloader-class* organ: it is the bridge between
//  BinaryPulse world and EvolutionEngine world.
// ============================================================================

import {
  PulseRole as EvolutionPulseRole,
  createPulseV2,
  evolvePulseV2
} from "./PulseShifterEvolutionaryPulse-v11-Evo.js";


// ============================================================================
//  PulseBinaryRole — identifies this as the binary front-end for evolution
// ============================================================================
export const PulseBinaryRole = {
  type: "Pulse",
  subsystem: "Pulse",
  layer: "BinaryFrontEnd",
  version: "12.4",
  identity: "PulseBinaryShifterEvolutionaryPulse-v12-Evo",

  evo: {
    binaryFrontEnd: true,
    evolutionBackEnd: "PulseShifterEvolutionaryPulse-v11-Evo",

    // Mirror back-end guarantees, but expose v12 surface.
    driftProof: EvolutionPulseRole.evo.driftProof,
    unifiedAdvantageField: EvolutionPulseRole.evo.unifiedAdvantageField,
    pulseV2Ready: EvolutionPulseRole.evo.pulseV2Ready,
    futureEvolutionReady: EvolutionPulseRole.evo.futureEvolutionReady,

    // Explicit binary surface flags
    binaryStrengthAware: true,
    binaryHintsSurfaceReady: true,
    bitsSummaryReady: true
  },

  routingContract: EvolutionPulseRole.routingContract,
  meshContract: EvolutionPulseRole.meshContract,
  sendContract: EvolutionPulseRole.sendContract,
  gpuOrganContract: EvolutionPulseRole.gpuOrganContract,
  earnCompatibility: EvolutionPulseRole.earnCompatibility
};


// ============================================================================
//  INTERNAL HELPERS — BITS → NUMBERS / STRINGS / MODES / HINTS
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
  // Binary-derived pattern: stable, deterministic, compact.
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
  // Very small, deterministic payload derived from bit windows.
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
  // Derive simple router/mesh/organ hints from bit windows.
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

function buildBitsSummary(bits) {
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
      organHint: null
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
    organHint
  };
}


// ============================================================================
//  BINARY → EVOLUTION CREATION
// ============================================================================
//  createBinaryEvolutionPulse (v12 surface):
//    - Accepts bits + optional hints.
//    - Derives pattern/mode/payload from bits.
//    - Calls createPulseV2 (symbolic engine).
//    - Returns a compact object with:
//        • symbolic evolutionPulse
//        • binarySummary (bitsSummary + hints)
//        • binary-facing summary surface
// ============================================================================

export function createBinaryEvolutionPulse({
  bits,
  jobId = null,
  priority = "normal",
  returnTo = null,
  parentLineage = null,
  pageId = "NO_PAGE",
  patternPrefix = "bp",
  trace = false
} = {}) {
  const safeBits = Array.isArray(bits) ? bits : [];
  const pattern  = bitsToPattern(safeBits, patternPrefix);
  const mode     = bitsToMode(safeBits);
  const payload  = bitsToPayload(safeBits);
  const hints    = bitsToHints(safeBits);
  const bitsSummary = buildBitsSummary(safeBits);

  const enrichedPayload = {
    ...payload,
    routerHint: hints.routerHint,
    meshHint: hints.meshHint,
    organHint: hints.organHint,
    binaryStrength: bitsSummary.binaryStrength
  };

  if (trace) {
    console.log("[BinaryEvolution] create", {
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

    // Binary-facing summary (v12 surface)
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
//  BINARY → EVOLUTION STEP
// ============================================================================
//  evolveBinaryEvolutionPulse (v12 surface):
//    - Accepts an existing evolution pulse + bits + optional hints.
//    - Uses bits to derive router/mesh/organ hints.
//    - Calls evolvePulseV2 (symbolic engine).
//    - Returns updated pulse + binary-friendly summary + bitsSummary.
// ============================================================================

export function evolveBinaryEvolutionPulse({
  evolutionPulse,
  bits,
  trace = false
} = {}) {
  if (!evolutionPulse) {
    throw new Error("evolveBinaryEvolutionPulse: evolutionPulse is required");
  }

  const safeBits = Array.isArray(bits) ? bits : [];
  const hints    = bitsToHints(safeBits);
  const bitsSummary = buildBitsSummary(safeBits);

  if (trace) {
    console.log("[BinaryEvolution] evolve", {
      bitsLength: safeBits.length,
      hints,
      bitsSummary
    });
  }

  const nextPulse = evolvePulseV2(evolutionPulse, hints);

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
//  PUBLIC API — BINARY EVOLUTION FRONT-END (v12-Evo)
// ============================================================================
//  This is what the rest of PulseOS should use when dealing with bits.
//  The symbolic engine stays behind this boundary.
// ============================================================================

export function createPulseBinaryShifterEvolutionaryPulse({ trace = false } = {}) {
  return {
    role: PulseBinaryRole,

    // Create a new evolution pulse from bits.
    createFromBits(args) {
      return createBinaryEvolutionPulse({ ...args, trace });
    },

    // Evolve an existing evolution pulse using bits.
    evolveWithBits(args) {
      return evolveBinaryEvolutionPulse({ ...args, trace });
    }
  };
}
