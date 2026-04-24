// ============================================================================
//  FILE: PulseBinaryShifterEvolutionaryPulse-v11-Evo.js
//  Pulse v2 • Binary Shifter Evolutionary Pulse Front-End (v11-Evo)
// ============================================================================
//  ROLE:
//  -----
//  This organ is the BINARY FRONT-END for the PulseShifterEvolutionaryPulse
//  evolution engine.
//
//  • It speaks in bits.
//  • It derives pattern/mode/payload hints from binary input.
//  • It calls the symbolic evolution core:
//        - createPulseV2
//        - evolvePulseV2
//  • It emits compact, binary-friendly summaries that routers/meshes/GPUs
//    can use without understanding the full symbolic structure.
//
//  DESIGN:
//  -------
//  - Back-end: PulseShifterEvolutionaryPulse-v11-Evo (symbolic evolution).
//  - Front-end: this file (binary shifter).
//  - Safety: deterministic, no randomness, no network, no external mutation.
//  - Purpose: give the binary layer a way to "evolve" work using the v2 engine.
//
//  This is a *bootloader-class* organ: it is the bridge between
//  BinaryPulse world and EvolutionEngine world.
// ============================================================================


// NOTE: We assume this file lives next to PulseShifterEvolutionaryPulse-v11-Evo.js
// and that the build system wires imports correctly in your environment.
// If you keep them in the same folder, this relative path is fine.
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
  version: "11.0",
  identity: "PulseBinaryShifterEvolutionaryPulse-v11-Evo",

  evo: {
    binaryFrontEnd: true,
    evolutionBackEnd: "PulseShifterEvolutionaryPulse-v11-Evo",
    driftProof: EvolutionPulseRole.evo.driftProof,
    unifiedAdvantageField: EvolutionPulseRole.evo.unifiedAdvantageField,
    pulseV2Ready: EvolutionPulseRole.evo.pulseV2Ready,
    futureEvolutionReady: EvolutionPulseRole.evo.futureEvolutionReady
  },

  routingContract: EvolutionPulseRole.routingContract,
  meshContract: EvolutionPulseRole.meshContract,
  sendContract: EvolutionPulseRole.sendContract,
  gpuOrganContract: EvolutionPulseRole.gpuOrganContract,
  earnCompatibility: EvolutionPulseRole.earnCompatibility
};


// ============================================================================
//  INTERNAL HELPERS — BITS → NUMBERS / STRINGS / MODES
// ============================================================================

function bitsToNumber(bits) {
  let n = 0;
  for (let i = 0; i < bits.length; i++) {
    n = (n << 1) | (bits[i] & 1);
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
  // Simple mode selection based on low bits.
  if (!bits || bits.length === 0) return "normal";
  const n = bitsToNumber(bits) % 4;
  if (n === 0) return "normal";
  if (n === 1) return "stress";
  if (n === 2) return "drain";
  return "recovery";
}

function bitsToPayload(bits, maxKeys = 4) {
  // Very small, deterministic payload derived from bit windows.
  const payload = {};
  const chunkSize = 8;
  const count = Math.min(maxKeys, Math.floor(bits.length / chunkSize));

  for (let i = 0; i < count; i++) {
    const start = i * chunkSize;
    const slice = bits.slice(start, start + chunkSize);
    const val = bitsToNumber(slice);
    payload[`k${i}`] = val;
  }

  return payload;
}


// ============================================================================
//  BINARY → EVOLUTION CREATION
// ============================================================================
//  createBinaryEvolutionPulse:
//    - Accepts bits + optional hints.
//    - Derives pattern/mode/payload from bits.
//    - Calls createPulseV2 (symbolic engine).
//    - Returns a compact object with both symbolic + binary-friendly fields.
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

  if (trace) {
    console.log("[BinaryEvolution] create", {
      bitsLength: safeBits.length,
      pattern,
      mode,
      payload
    });
  }

  const pulse = createPulseV2({
    jobId,
    pattern,
    payload,
    priority,
    returnTo,
    parentLineage,
    mode,
    pageId
  });

  return {
    PulseBinaryRole,
    evolutionPulse: pulse,

    // Binary-facing summary
    summary: {
      pattern: pulse.pattern,
      mode: pulse.mode,
      healthScore: pulse.healthScore,
      tier: pulse.tier,
      advantageField: pulse.advantageField,
      evolutionStage: pulse.meta.evolutionStage,
      shapeSignature: pulse.meta.shapeSignature
    }
  };
}


// ============================================================================
//  BINARY → EVOLUTION STEP
// ============================================================================
//  evolveBinaryEvolutionPulse:
//    - Accepts an existing evolution pulse + bits + optional hints.
//    - Uses bits to derive router/mesh/organ hints.
//    - Calls evolvePulseV2 (symbolic engine).
//    - Returns updated pulse + binary-friendly summary.
// ============================================================================

function bitsToHints(bits) {
  // Derive simple router/mesh/organ hints from bit windows.
  const safeBits = Array.isArray(bits) ? bits : [];
  const n = bitsToNumber(safeBits);

  const routerHint = `r${n % 7}`;
  const meshHint   = `m${(n >> 3) % 5}`;
  const organHint  = `o${(n >> 6) % 9}`;

  return { routerHint, meshHint, organHint };
}

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

  if (trace) {
    console.log("[BinaryEvolution] evolve", {
      bitsLength: safeBits.length,
      hints
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
      shapeSignature: nextPulse.meta.shapeSignature
    }
  };
}


// ============================================================================
//  PUBLIC API — BINARY EVOLUTION FRONT-END
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
