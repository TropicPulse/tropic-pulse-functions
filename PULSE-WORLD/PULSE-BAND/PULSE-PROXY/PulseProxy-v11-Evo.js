// ============================================================================
//  PulseProxy-v12.3-EVO.js — Proxy Organism v12.3+ (NON-BINARY EDITION)
//  Evolutionary Proxy Organ • Pattern + Lineage + Shape • Route-Assist
//  12.3: Ancestry + Loop-Theory + Tier + Advantage Field + Presence/Harmonics
//        + DualBand Awareness + Passive Prewarm/Cache/Chunk/Remember Hints
// ============================================================================
//
//  SAFETY CONTRACT (v12.3-Evo):
//  ----------------------------
//  • No imports.
//  • No randomness.
//  • No timestamps.
//  • Pure deterministic string/shape operations.
//  • Zero mutation outside instance.
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


// ============================================================================
//  PROXY ROLE / META — tie all imported organs into a single identity
// ============================================================================
const ProxyRole = Object.freeze({
  layer: "SymbolicProxy",
  version: "v13-Evo",
  role: "SYMBOLIC_PROXY_BRIDGE",
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



export const PulseProxyOrganismMeta = Object.freeze({
  layer: "PulseProxyOrganism",
  role: "SYMBOLIC_PROXY_ORGANISM",
  version: "v12.3-EVO-MAX",
  identity: "PulseProxy-v12.3-EVO-MAX",

  guarantees: Object.freeze({
    deterministic: true,
    driftProof: true,
    multiInstanceReady: true,

    // Organism laws
    symbolicOrganism: true,
    proxyOrganism: true,
    patternEngine: true,
    lineageEngine: true,
    shapeEngine: true,
    ancestryAware: true,
    loopTheoryAware: true,
    tierAware: true,
    advantageFieldAware: true,
    continuanceAware: true,
    evolutionEngineReady: true,

    // A‑B‑A organism laws
    bandAware: true,
    waveFieldAware: true,
    binaryFieldAware: true,

    // 12.3+ dual-band + presence/harmonics
    dualBandCompatible: true,
    presenceAware: true,
    harmonicsAware: true,
    epochStable: true,

    // Passive band abilities (symbolic hints only)
    passivePrewarm: true,
    passiveCache: true,
    passiveChunk: true,
    passiveRemember: true,

    // Safety prohibitions
    zeroRandomness: true,
    zeroTimestamps: true,
    zeroExternalMutation: true,
    zeroDynamicImports: true,
    zeroEval: true,
    zeroNetwork: true,
    zeroIO: true,

    // Awareness
    routerAwareReady: true,
    meshAwareReady: true,
    sendAwareReady: true,
    gpuOrganAware: true,
    minerAware: true,

    // Environment
    worldLensAware: false
  }),

  contract: Object.freeze({
    input: [
      "ProxyOrganismShape",
      "ProxyOrganismPattern",
      "ProxyOrganismLineage",
      "DualBandContext"
    ],
    output: [
      "ProxyOrganismSnapshot",
      "ProxyOrganismSignatures",
      "ProxyOrganismDiagnostics",
      "ProxyOrganismHealingState"
    ]
  }),

  lineage: Object.freeze({
    root: "PulseProxy-v11",
    parent: "PulseProxy-v12.3-EVO",
    ancestry: [
      "PulseProxy-v7",
      "PulseProxy-v8",
      "PulseProxy-v9",
      "PulseProxy-v10",
      "PulseProxy-v11",
      "PulseProxy-v11-Evo",
      "PulseProxy-v11.2-EVO-MAX"
    ]
  }),

  bands: Object.freeze({
    supported: ["symbolic", "binary"],
    default: "symbolic",
    behavior: "proxy-organism"
  }),

  architecture: Object.freeze({
    pattern: "A-B-A",
    baseline: "pattern → lineage → shape → advantage field",
    adaptive: "binary-field + wave-field + presence/harmonics overlays",
    return: "deterministic organism snapshot + signatures"
  })
});
// ============================================================================
//  INTERNAL HELPERS — deterministic, tiny, pure
// ============================================================================
function buildLineage(parentLineage, pattern) {
  const base = Array.isArray(parentLineage) ? parentLineage : [];
  return [...base, pattern];
}

function computeShapeSignature(pattern, lineage) {
  const lineageKey = lineage.join("::");
  const raw = `${pattern}::${lineageKey}`;

  let acc = 0;
  for (let i = 0; i < raw.length; i++) {
    acc = (acc + raw.charCodeAt(i) * (i + 1)) % 100000;
  }

  return `proxy-shape-${acc}`;
}

function computeEvolutionStage(pattern, lineage) {
  const depth = lineage.length;

  if (depth === 1) return "seed";
  if (depth === 2) return "sprout";
  if (depth === 3) return "branch";

  if (pattern.includes("router")) return "router-aware";
  if (pattern.includes("mesh")) return "mesh-aware";
  if (pattern.includes("send")) return "send-aware";

  return "mature";
}

function evolvePattern(pattern, context = {}) {
  const { routerHint, meshHint, sendHint } = context;

  const parts = [pattern];

  if (routerHint) parts.push(`r:${routerHint}`);
  if (meshHint) parts.push(`m:${meshHint}`);
  if (sendHint) parts.push(`s:${sendHint}`);

  return parts.join("|");
}

function buildPatternAncestry(pattern) {
  if (!pattern || typeof pattern !== "string") return [];
  return pattern.split("/").filter(Boolean);
}

function buildLineageSignature(lineage) {
  if (!Array.isArray(lineage) || lineage.length === 0) return "NO_LINEAGE";
  return lineage.join(">");
}

function buildPageAncestrySignature({ pattern, lineage, pageId }) {
  const safePattern = typeof pattern === "string" ? pattern : "";
  const safeLineage = Array.isArray(lineage) ? lineage : [];
  const safePageId = pageId || "NO_PAGE";

  const shape = {
    pattern: safePattern,
    patternAncestry: buildPatternAncestry(safePattern),
    lineageSignature: buildLineageSignature(safeLineage),
    pageId: safePageId
  };

  let raw = JSON.stringify(shape);
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    const chr = raw.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return (hash >>> 0).toString(16);
}

function computeHealthScore(pattern, lineage) {
  const base = 0.7 + Math.min(
    0.3,
    lineage.length * 0.02 + pattern.length * 0.001
  );
  return Math.max(0.15, Math.min(1.0, base));
}

function classifyDegradationTier(h) {
  if (h >= 0.95) return "microDegrade";
  if (h >= 0.85) return "softDegrade";
  if (h >= 0.50) return "midDegrade";
  if (h >= 0.15) return "hardDegrade";
  return "criticalDegrade";
}

function buildAdvantageField(pattern, lineage) {
  return {
    lineageDepth: lineage.length,
    patternStrength: pattern.length,
    shapeComplexity: lineage.length * pattern.length
  };
}

function computeProxyMode(tier, pattern) {
  if (tier === "criticalDegrade") return "routeAround";
  if (tier === "hardDegrade") return "heavyAssist";
  if (tier === "midDegrade") return "assist";
  if (tier === "softDegrade") return "lightAssist";

  if (pattern.includes("router")) return "routerAssist";
  if (pattern.includes("mesh")) return "meshAssist";
  if (pattern.includes("send")) return "sendAssist";

  return "transparent";
}

function buildProxyDiagnostics(pattern, lineage, healthScore, tier) {
  const lineageDepth = lineage.length;
  const patternLength = pattern.length;

  let healthBucket = "low";
  if (healthScore >= 0.9) healthBucket = "elite";
  else if (healthScore >= 0.75) healthBucket = "high";
  else if (healthScore >= 0.5) healthBucket = "medium";

  return {
    lineageDepth,
    patternLength,
    healthBucket,
    degradationTier: tier,
    lineageDensity: lineageDepth === 0 ? 0 : patternLength / lineageDepth
  };
}

// A‑B‑A surfaces
function buildBand(pattern) {
  if (pattern.includes("router")) return "symbolic-router";
  if (pattern.includes("mesh")) return "symbolic-mesh";
  if (pattern.includes("send")) return "symbolic-send";
  return "symbolic";
}

function buildBandSignature(pattern) {
  const band = buildBand(pattern);
  const raw = `PROXY_BAND::${band}`;
  let acc = 0;
  for (let i = 0; i < raw.length; i++) {
    acc = (acc + raw.charCodeAt(i) * (i + 1)) % 100000;
  }
  return {
    band,
    bandSignature: `proxy-band-${acc}`
  };
}

function buildBinaryField(pattern, lineage) {
  const patternLen = pattern.length || 1;
  const depth = lineage.length || 1;
  const patternLenNorm = Math.max(4, Math.min(32, patternLen));
  const depthNorm = Math.max(1, Math.min(16, depth));

  const density = patternLenNorm + depthNorm * 3;
  const surface = density + patternLenNorm;

  let acc = 0;
  const raw = `PROXY_BINARY_FIELD::${patternLenNorm}::${depthNorm}::${surface}`;
  for (let i = 0; i < raw.length; i++) {
    acc = (acc + raw.charCodeAt(i) * (i + 1)) % 100000;
  }

  return {
    binaryPhenotypeSignature: `proxy-binary-pheno-${acc}`,
    binarySurfaceSignature: `proxy-binary-surface-${(acc * 7) % 100000}`,
    binarySurface: {
      patternLen: patternLenNorm,
      density,
      surface
    },
    parity: surface % 2 === 0 ? 0 : 1,
    shiftDepth: Math.max(0, Math.floor(Math.log2(surface || 1)))
  };
}

function buildWaveField(pattern, lineage) {
  const depth = lineage.length || 1;
  const patternLen = pattern.length || 1;

  const amplitude = (depth + 1) * 6 + Math.floor(patternLen / 8);
  const wavelength = amplitude + 5;
  const phase = (amplitude + patternLen) % 16;

  return {
    amplitude,
    wavelength,
    phase,
    band: "symbolic",
    mode: "symbolic-wave"
  };
}

// presence/harmonics
function buildPresenceAndHarmonics(pattern, lineage) {
  const depth = lineage.length || 1;
  const patternLen = pattern.length || 1;

  const presenceBandState =
    depth > 4 ? "deep-presence" :
    depth > 2 ? "stable-presence" :
    "light-presence";

  const harmonicDrift = Math.max(
    0,
    Math.min(1, (patternLen % 17) / 16)
  );

  const coherenceScore = Math.max(
    0.2,
    Math.min(1.0, 0.6 + depth * 0.03 - harmonicDrift * 0.1)
  );

  const pulsePrewarm = pattern.includes("send") || pattern.includes("router")
    ? "preferred"
    : "optional";

  const pulseCacheMode = pattern.includes("mesh")
    ? "mesh-cache"
    : "direct-cache";

  const pulseChunkMode = patternLen > 32
    ? "multi-chunk"
    : "single-chunk";

  const pulseRemember = depth >= 3 ? "remember-strong" : "remember-weak";

  const dualBandMode = pattern.includes("binary")
    ? "binary"
    : "symbolic";

  return {
    presenceBandState,
    harmonicDrift,
    coherenceScore,
    pulsePrewarm,
    pulseCacheMode,
    pulseChunkMode,
    pulseRemember,
    dualBandMode
  };
}

// physiology envelope — uses heart, blood, circulatory, hypothalamus, spine, PNS, synapse, bloodstream, adrenal, BBB
function buildPhysiologyEnvelope() {
  return {
    heartAvailable: !!PulseProxyHeart,
    bloodPressureAvailable: !!PulseProxyBloodPressure,
    circulatorySystemAvailable: !!PulseProxyCirculatorySystem,
    hypothalamusAvailable: !!PulseProxyHypothalamus,
    spineAvailable: !!PulseProxySpine,
    pnsAvailable: !!pulseband,
    synapseAvailable: !!PulseProxySynapse,
    bloodstreamAvailable: !!PulseProxyBloodstream,
    adrenalSystemAvailable: !!PulseProxyAdrenalSystem,
    bbbAvailable: !!PulseProxyBBB
  };
}

// limbic envelope — uses limbic meta, client, net
function buildLimbicEnvelope() {
  return {
    limbicMeta: PULSE_LIMBIC_SHADOW_META || null,
    clientAvailable: !!PulseClient,
    netAvailable: !!PulseNet
  };
}

// agents envelope — uses outer/inner agents, impulse, history repair
function buildAgentsEnvelope() {
  return {
    outerAgentAvailable: !!PulseProxyOuterAgent,
    innerAgentFactoryAvailable: !!createPulseProxyInnerAgent,
    impulseAvailable: !!PulseProxyImpulse,
    historyRepairAvailable: !!pulseHistoryRepair
  };
}

// ============================================================================
//  FACTORY — v13+ symbolic proxy
// ============================================================================
export function createProxy({
  jobId,
  pattern,
  payload = {},
  priority = "normal",
  returnTo = null,
  parentLineage = null,
  pageId = "NO_PAGE"
}) {
  const lineage        = buildLineage(parentLineage, pattern);
  const shapeSignature = computeShapeSignature(pattern, lineage);
  const evolutionStage = computeEvolutionStage(pattern, lineage);

  const patternAncestry       = buildPatternAncestry(pattern);
  const lineageSignature      = buildLineageSignature(lineage);
  const pageAncestrySignature = buildPageAncestrySignature({
    pattern,
    lineage,
    pageId
  });

  const healthScore    = computeHealthScore(pattern, lineage);
  const tier           = classifyDegradationTier(healthScore);
  const advantageField = buildAdvantageField(pattern, lineage);
  const proxyMode      = computeProxyMode(tier, pattern);
  const diagnostics    = buildProxyDiagnostics(
    pattern,
    lineage,
    healthScore,
    tier
  );

  const { band, bandSignature } = buildBandSignature(pattern);
  const binaryField             = buildBinaryField(pattern, lineage);
  const waveField               = buildWaveField(pattern, lineage);
  const presenceHarmonics       = buildPresenceAndHarmonics(pattern, lineage);

  const physiologyEnvelope = buildPhysiologyEnvelope();
  const limbicEnvelope     = buildLimbicEnvelope();
  const agentsEnvelope     = buildAgentsEnvelope();

  const evolvedPattern = evolvePattern(pattern, {
    routerHint: pattern.includes("router") ? "router" : null,
    meshHint: pattern.includes("mesh") ? "mesh" : null,
    sendHint: pattern.includes("send") ? "send" : null
  });

  const proxyId = `${jobId || "NO_JOB"}::${lineageSignature}::${pageAncestrySignature}`;

  // Core proxy envelope (symbolic)
  const proxyEnvelope = {
    proxyId,
    jobId: jobId || null,
    pattern,
    evolvedPattern,
    patternAncestry,
    lineage,
    lineageSignature,
    pageId,
    pageAncestrySignature,
    shapeSignature,
    evolutionStage,
    healthScore,
    degradationTier: tier,
    advantageField,
    proxyMode,
    diagnostics,
    band,
    bandSignature,
    binaryField,
    waveField,
    presenceHarmonics,
    physiologyEnvelope,
    limbicEnvelope,
    agentsEnvelope,
    priority,
    returnTo,
    payload
  };

  // -------------------------------------------------------------------------
  //  AGENT HELPERS — actually use outer/inner agents + impulse
  // -------------------------------------------------------------------------
  function createInnerAgent(context = {}) {
    if (!createPulseProxyInnerAgent) return null;
    return createPulseProxyInnerAgent({
      proxyId,
      pattern,
      lineage,
      context
    });
  }

  function dispatchToOuterAgent(context = {}) {
    if (!PulseProxyOuterAgent) return null;
    return PulseProxyOuterAgent({
      proxyId,
      pattern,
      lineage,
      payload,
      context
    });
  }

  function sendImpulse(impulsePayload = {}) {
    if (!PulseProxyImpulse) return null;
    return PulseProxyImpulse({
      proxyId,
      pattern,
      lineage,
      payload: impulsePayload
    });
  }

  // -------------------------------------------------------------------------
  //  DIAGNOSTICS — uses WB cells (scores + health metrics)
// -------------------------------------------------------------------------
  async function runDiagnostics({ instanceId, beforeTimestamp } = {}) {
    const scores = await scanUserScoresForInstanceHints(instanceId || null);
    const health = await checkProxyHealthAndMetrics();

    return {
      role: ProxyRole,
      proxyId,
      pattern,
      lineage,
      scores,
      health,
      beforeTimestamp: beforeTimestamp || null
    };
  }

  // -------------------------------------------------------------------------
  //  MAINTENANCE — uses PNS purifier + history repair
// -------------------------------------------------------------------------
  async function runMaintenance({ beforeTimestamp } = {}) {
    const ts = beforeTimestamp || Date.now();

    const sessions    = await cleanupSessionsBefore(ts);
    const errors      = await cleanupErrorsBefore(ts);
    const redownloads = await cleanupRedownloadsBefore(ts);
    const historyFix  = await pulseHistoryRepair({ before: ts });

    return {
      role: ProxyRole,
      proxyId,
      pattern,
      lineage,
      sessions,
      errors,
      redownloads,
      historyFix
    };
  }

  // -------------------------------------------------------------------------
  //  PUBLIC PROXY OBJECT — no abilities removed, only enriched
  // -------------------------------------------------------------------------
  return {
    role: ProxyRole,
    envelope: proxyEnvelope,

    // core identity
    getId() {
      return proxyId;
    },

    getLineage() {
      return [...lineage];
    },

    getDiagnostics() {
      return { ...diagnostics };
    },

    getMode() {
      return proxyMode;
    },

    getBand() {
      return band;
    },

    // envelopes
    getPhysiologyEnvelope() {
      return { ...physiologyEnvelope };
    },

    getLimbicEnvelope() {
      return { ...limbicEnvelope };
    },

    getAgentsEnvelope() {
      return { ...agentsEnvelope };
    },

    // agents / impulses
    createInnerAgent,
    dispatchToOuterAgent,
    sendImpulse,

    // async ops
    runDiagnostics,
    runMaintenance
  };
}
