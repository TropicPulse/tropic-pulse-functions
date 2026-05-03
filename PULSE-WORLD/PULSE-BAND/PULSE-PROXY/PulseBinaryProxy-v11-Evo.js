// ============================================================================
//  BinaryProxy-v12.3-EVO-MAX-ABA.js
//  PURE BINARY NERVE ROOT — v12.3‑EVO‑A‑B‑A MAX EDITION
//  + CACHE/CHUNK/PRESENCE ENVELOPES (DETERMINISTIC, BINARY-ONLY META)
// ============================================================================
//  ROLE:
//    - Accept ONLY pure binary arrays (0/1).
//    - Encode using BinaryAgent (encoder).
//    - Exchange using BinaryAgent.process().
//    - Emit A‑B‑A bandSignature + binaryField + waveField + cycleSignature.
//    - Emit cacheChunk + presence envelopes (deterministic, meta-only).
//    - Deterministic fallback to PulseProxy (or any symbolic proxy).
//
//  ARCHITECTURE LAW (v12.3‑EVO‑A‑B‑A):
//    - Binary adds ONLY binary representation + binary meta envelopes.
//    - No symbolic logic.
//    - No routing, no lineage, no patterns, no evolution logic here.
//    - No JSON except internal ops.
//    - No objects except internal ops.
//    - No randomness, no drift, no mutation.
// ============================================================================

import PulseProxyHeart from "./PulseProxyHeart.js";
import PulseProxyBloodPressure from "./PulseProxyBloodPressure.js";
import PulseProxyCirculatorySystem from "./PulseProxyCirculatorySystem.js";

import PulseProxyHypothalamus from "./PulseProxyHypothalamus.js";
import PulseProxySpine from "./PulseProxySpine-v11-Evo.js";

import pulseband from "./PulseProxyPNSNervousSystem-v11-Evo.js";   // PNS
import PulseProxySynapse from "./PulseProxySynapse.js";            // Synapse junctions

import { PulseClient, PulseNet, PULSE_LIMBIC_SHADOW_META } from "./PulseProxyLimbic.js";

import {
  scanUserScoresForInstanceHints,
  checkProxyHealthAndMetrics
} from "./PulseProxyWBCells.js";

import {
  cleanupSessionsBefore,
  cleanupErrorsBefore,
  cleanupRedownloadsBefore
} from "./PulseProxyPNSPurifier.js";

import PulseProxyOuterAgent from "./PulseProxyOuterAgent.js";
import createPulseProxyInnerAgent from "./PulseProxyInnerAgent.js";

import PulseProxyImpulse from "./PulseProxyImpulse.js";

import PulseProxyBloodstream from "./PulseProxyBloodstream.js";

import PulseProxyAdrenalSystem from "./PulseProxyAdrenalSystem.js";

import PulseProxyBBB from "./PulseProxyBBB.js";

import pulseHistoryRepair from "./PulseProxyPNSRepair.js";


// ---------------------------------------------------------------------------
// BINARY PROXY ROLE / META — tie all imported organs into a single identity
// ---------------------------------------------------------------------------
const BinaryProxyRole = Object.freeze({
  layer: "BinaryProxy",
  version: "v11-Evo",
  role: "BINARY_PROXY_BRIDGE",
  lineage: {
    spine: "PulseProxySpine-v11-Evo",
    pns: "PulseProxyPNSNervousSystem-v11-Evo",
    synapse: "PulseProxySynapse",
    limbic: PULSE_LIMBIC_SHADOW_META?.identity || "LimbicShadow",
    client: "PulseClient",
    net: "PulseNet"
  },
  organs: Object.freeze({
    heart: PulseProxyHeart,
    bloodPressure: PulseProxyBloodPressure,
    circulatorySystem: PulseProxyCirculatorySystem,
    hypothalamus: PulseProxyHypothalamus,
    spine: PulseProxySpine,
    pns: pulseband,
    synapse: PulseProxySynapse,
    client: PulseClient,
    net: PulseNet,
    outerAgent: PulseProxyOuterAgent,
    innerAgentFactory: createPulseProxyInnerAgent,
    impulse: PulseProxyImpulse,
    bloodstream: PulseProxyBloodstream,
    adrenalSystem: PulseProxyAdrenalSystem,
    bbb: PulseProxyBBB,
    historyRepair: pulseHistoryRepair
  }),
  safety: Object.freeze({
    limbicShadowMeta: PULSE_LIMBIC_SHADOW_META || null
  })
});


export const PulseOSBinaryProxyMeta = Object.freeze({
  layer: "BinaryProxy",
  role: "PURE_BINARY_NERVE_ROOT",
  version: "v12.3-EVO-BINARY-MAX-ABA",
  identity: "BinaryProxy-v12.3-EVO-BINARY-MAX-ABA",

  guarantees: Object.freeze({
    // Absolute binary laws
    binaryOnly: true,
    binaryFirst: true,
    binaryNerveRoot: true,
    abaBandAware: true,
    deterministic: true,
    driftProof: true,
    multiInstanceReady: true,

    // Absolute prohibitions
    noSymbolicLogic: true,
    noRouting: true,
    noOrgans: true,
    noEvolution: true,
    noLineage: true,
    noPatterns: true,
    noCompute: true,
    noRandomness: true,
    noMutation: true,
    noExternalMutation: true,
    noDynamicImports: true,
    noEval: true,
    noJSONExternal: true,
    noObjectsExternal: true,

    // Fallback behavior
    symbolicFallback: true,
    deterministicFallback: true,

    // 12.3+ cache/chunk/presence guarantees (meta-only)
    cacheChunkAware: true,
    cacheChunkSafe: true,
    cacheChunkDeterministic: true,
    presenceAware: true,
    presenceDeterministic: true,
    prewarmAware: true,
    unifiedAdvantageField: true,
    pulseEfficiencyAware: true,
    chunkEnvelopeEmitter: true,

    // Environment
    worldLensAware: false
  }),

  contract: Object.freeze({
    input: [
      "BinaryArray",
      "BinaryBandContext"
    ],
    output: [
      "BinaryExchange",
      "BinarySignature",
      "BinaryCycleSignature",
      "BinaryWaveField",
      "BinaryField",
      "BinaryCacheChunkEnvelope",
      "BinaryPresenceEnvelope"
    ]
  }),

  lineage: Object.freeze({
    root: "BinaryOrganism-v11",
    parent: "BinaryOrganism-v12.3-EVO",
    ancestry: [
      "BinaryProxy-v9",
      "BinaryProxy-v10",
      "BinaryProxy-v11",
      "BinaryProxy-v11-Evo",
      "BinaryProxy-v11-Evo-Max",
      "BinaryProxy-v11-Evo-Max-ABA",
      "BinaryProxy-v11.2-EVO-BINARY-MAX-ABA"
    ]
  }),

  bands: Object.freeze({
    supported: ["binary"],
    default: "binary",
    behavior: "binary-nerve-root"
  }),

  architecture: Object.freeze({
    pattern: "A-B-A",
    baseline: "binary input → binary exchange → binary output",
    adaptive: "ABA band signatures + cacheChunk/presence envelopes",
    return: "pure binary nerve output + signatures + deterministic chunk envelopes"
  })
});
// ---------------------------------------------------------------------------
// BINARY PROXY FACTORY
// ---------------------------------------------------------------------------
export function createBinaryProxy({
  encoder,
  fallbackProxyFactory,
  trace = false
} = {}) {
  if (!encoder) {
    throw new Error("BinaryProxy requires a BinaryAgent encoder");
  }

  let cycle = 0;
  const history = [];

  // -------------------------------------------------------------------------
  //  SAFETY: PURE BINARY ONLY
  // -------------------------------------------------------------------------
  function isPureBinary(bits) {
    if (!Array.isArray(bits)) return false;
    for (let i = 0; i < bits.length; i++) {
      if (bits[i] !== 0 && bits[i] !== 1) return false;
    }
    return true;
  }

  function ensurePureBinaryOrFallback(op, bits, reason) {
    if (!isPureBinary(bits)) {
      return fallback(op, bits, reason);
    }
    return bits;
  }

  // -------------------------------------------------------------------------
  //  A‑B‑A SURFACES (binary-only phenotype, deterministic)
// -------------------------------------------------------------------------
  function buildBandSignature() {
    return encoder.hash("binary-band-v11-aba");
  }

  function buildBinaryField() {
    const patternLen = 16;
    const density = patternLen + cycle + 32;
    const surface = density + patternLen;

    return {
      binaryPhenotypeSignature: encoder.hash(`BINARY_PHENO::${surface}`),
      binarySurfaceSignature: encoder.hash(`BINARY_SURF::${surface}`),
      binarySurface: { patternLen, density, surface },
      parity: surface % 2 === 0 ? 0 : 1,
      shiftDepth: Math.max(0, Math.floor(Math.log2(surface || 1)))
    };
  }

  function buildWaveField() {
    const amplitude = (cycle + 1) * 12;
    const wavelength = amplitude + 4;
    const phase = amplitude % 16;

    return {
      amplitude,
      wavelength,
      phase,
      band: "binary",
      mode: "compression-wave"
    };
  }

  function buildCycleSignature() {
    return encoder.hash(`BINARY_PROXY_CYCLE::${cycle}`);
  }

  // -------------------------------------------------------------------------
  //  12.3+ CACHE/CHUNK/PRESENCE ENVELOPES (META-ONLY, DETERMINISTIC)
// -------------------------------------------------------------------------
  function buildCacheChunkEnvelope(dir) {
    const chunkId = encoder.hash(`BINARY_CHUNK_ID::${dir}::${cycle}`);
    const chunkBandSignature = encoder.hash(`BINARY_CHUNK_BAND::${cycle}`);
    const chunkSurface = encoder.hash(`BINARY_CHUNK_SURF::${cycle}`);

    return {
      cacheChunkId: chunkId,
      cacheChunkBandSignature: chunkBandSignature,
      cacheChunkSurfaceSignature: chunkSurface
    };
  }

  function buildPresenceEnvelope(dir) {
    const presenceId = encoder.hash(`BINARY_PRESENCE_ID::${dir}::${cycle}`);
    const presenceSignature = encoder.hash(`BINARY_PRESENCE_SIG::${cycle}`);
    const prewarmSignature = encoder.hash(`BINARY_PREWARM_SIG::${cycle}`);

    return {
      presenceId,
      presenceSignature,
      prewarmSignature
    };
  }

  function buildPhysiologyEnvelope() {
    // Pure metadata wiring of circulatory / endocrine / barrier systems
    return {
      heart: !!PulseProxyHeart,
      bloodPressure: !!PulseProxyBloodPressure,
      circulatorySystem: !!PulseProxyCirculatorySystem,
      hypothalamus: !!PulseProxyHypothalamus,
      spine: !!PulseProxySpine,
      pns: !!pulseband,
      synapse: !!PulseProxySynapse,
      bloodstream: !!PulseProxyBloodstream,
      adrenalSystem: !!PulseProxyAdrenalSystem,
      bbb: !!PulseProxyBBB
    };
  }

  function buildLimbicEnvelope() {
    return {
      limbicMeta: PULSE_LIMBIC_SHADOW_META || null,
      clientAvailable: !!PulseClient,
      netAvailable: !!PulseNet
    };
  }

  function buildAgentsEnvelope() {
    return {
      outerAgentAvailable: !!PulseProxyOuterAgent,
      innerAgentFactoryAvailable: !!createPulseProxyInnerAgent,
      impulseAvailable: !!PulseProxyImpulse,
      historyRepairAvailable: !!pulseHistoryRepair
    };
  }

  function buildBinaryEnvelope(dir, bits, encoded, extra = null) {
    const bandSignature = buildBandSignature();
    const binaryField = buildBinaryField();
    const waveField = buildWaveField();
    const cycleSignature = buildCycleSignature();
    const cacheChunkEnvelope = buildCacheChunkEnvelope(dir);
    const presenceEnvelope = buildPresenceEnvelope(dir);
    const physiologyEnvelope = buildPhysiologyEnvelope();
    const limbicEnvelope = buildLimbicEnvelope();
    const agentsEnvelope = buildAgentsEnvelope();

    const record = {
      dir,
      bits,
      encoded,
      bandSignature,
      binaryField,
      waveField,
      cycleSignature,
      cacheChunkEnvelope,
      presenceEnvelope,
      physiologyEnvelope,
      limbicEnvelope,
      agentsEnvelope
    };

    if (extra) {
      record.extra = extra;
    }

    history.push(record);

    return {
      encoded,
      bandSignature,
      binaryField,
      waveField,
      cycleSignature,
      cacheChunkEnvelope,
      presenceEnvelope,
      physiologyEnvelope,
      limbicEnvelope,
      agentsEnvelope
    };
  }

  // -------------------------------------------------------------------------
  //  RECEIVE (binary → encoded)
// -------------------------------------------------------------------------
  function receive(bits) {
    cycle++;

    const pure = ensurePureBinaryOrFallback("receive", bits, "non-binary-input");
    const encoded = encoder.encode(pure);

    if (trace) {
      console.log("[BinaryProxy] IN:", pure);
    }

    const envelope = buildBinaryEnvelope("in", pure, encoded);
    return envelope.encoded;
  }

  // -------------------------------------------------------------------------
  //  SEND (binary → encoded)
// -------------------------------------------------------------------------
  function send(bits) {
    cycle++;

    const pure = ensurePureBinaryOrFallback("send", bits, "non-binary-output");
    const encoded = encoder.encode(pure);

    if (trace) {
      console.log("[BinaryProxy] OUT:", pure);
    }

    const envelope = buildBinaryEnvelope("out", pure, encoded);
    return envelope.encoded;
  }

  // -------------------------------------------------------------------------
  //  EXCHANGE (binary → cortex → binary)
// -------------------------------------------------------------------------
  function exchange(bits) {
    cycle++;

    const pure = ensurePureBinaryOrFallback(
      "exchange",
      bits,
      "non-binary-exchange"
    );

    const encodedIn = encoder.encode(pure);
    const response = encoder.process(encodedIn);

    const pureResponse = ensurePureBinaryOrFallback(
      "exchange",
      response,
      "cortex-non-binary-response"
    );

    const encodedOut = encoder.encode(pureResponse);

    if (trace) {
      console.log("[BinaryProxy] EXCHANGE IN:", pure);
      console.log("[BinaryProxy] EXCHANGE OUT:", pureResponse);
    }

    const envelope = buildBinaryEnvelope("exchange", pure, encodedOut, {
      responseBits: pureResponse
    });

    return envelope.encoded;
  }

  // -------------------------------------------------------------------------
  //  FALLBACK — deterministic, drift-proof, symbolic proxy bridge
  // -------------------------------------------------------------------------
  function fallback(op, bits, reason) {
    if (!fallbackProxyFactory) {
      throw new Error(
        `BinaryProxy fallback triggered (${reason}) but no fallbackProxyFactory provided`
      );
    }

    if (trace) {
      console.warn(`[BinaryProxy] FALLBACK (${op}):`, reason, bits);
    }

    // Attach limbic + agents metadata into the fallback payload
    const limbicEnvelope = buildLimbicEnvelope();
    const agentsEnvelope = buildAgentsEnvelope();

    return fallbackProxyFactory({
      jobId: `fallback-${op}`,
      pattern: "binary-fallback",
      payload: { bits, reason, limbicEnvelope, agentsEnvelope },
      priority: "normal",
      returnTo: null,
      parentLineage: null,
      pageId: "BINARY_PROXY_FALLBACK"
    });
  }

  // -------------------------------------------------------------------------
  //  DIAGNOSTICS — uses WB cells (scores + health metrics)
// -------------------------------------------------------------------------
  async function diagnostics({ instanceId, beforeTimestamp } = {}) {
    const scores = await scanUserScoresForInstanceHints(instanceId || null);
    const health = await checkProxyHealthAndMetrics();

    return {
      role: BinaryProxyRole,
      cycle,
      scores,
      health,
      beforeTimestamp: beforeTimestamp || null
    };
  }

  // -------------------------------------------------------------------------
  //  MAINTENANCE — uses PNS purifier + history repair
  // -------------------------------------------------------------------------
  async function maintenance({ beforeTimestamp } = {}) {
    const ts = beforeTimestamp || Date.now();

    const sessions = await cleanupSessionsBefore(ts);
    const errors = await cleanupErrorsBefore(ts);
    const redownloads = await cleanupRedownloadsBefore(ts);
    const historyFix = await pulseHistoryRepair({ before: ts });

    return {
      role: BinaryProxyRole,
      cycle,
      sessions,
      errors,
      redownloads,
      historyFix
    };
  }

  // -------------------------------------------------------------------------
  //  PUBLIC API
  // -------------------------------------------------------------------------
  return {
    role: BinaryProxyRole,
    receive,
    send,
    exchange,
    fallback,
    history,
    diagnostics,
    maintenance
  };
}
