// ============================================================================
//  PulseProxy-v11-Evo.js — Proxy Organism v11.0 (NON-BINARY EDITION)
//  Evolutionary Proxy Organ • Pattern + Lineage + Shape • Route-Assist
//  11.0: Ancestry + Loop-Theory + Tier + Advantage Field + Continuance Hint
// ============================================================================
//
//  SAFETY CONTRACT (v11-Evo):
//  --------------------------
//  • No imports.
//  • No randomness.
//  • No timestamps.
//  • Pure deterministic string/shape operations.
//  • Zero mutation outside instance.
// ============================================================================
// ============================================================================
//  ProxyRole — identifies this as the Proxy v11-Evo A‑B‑A Organism (symbolic)
// ============================================================================
export const ProxyRole = {
  type: "Proxy",
  subsystem: "Proxy",
  layer: "NervousSystem",
  version: "11.0",
  identity: "PulseProxy-v11-Evo",

  evo: {
    driftProof: true,
    patternAware: true,
    lineageAware: true,
    shapeAware: true,
    evolutionEngineReady: true,
    routerAwareReady: true,
    meshAwareReady: true,
    sendAwareReady: true,
    futureEvolutionReady: true,

    unifiedAdvantageField: true,
    proxyV2Ready: true,

    ancestryAware: true,
    loopTheoryAware: true,
    tierAware: true,
    advantageFieldAware: true,

    continuanceAware: true,
    legacyBridgeCapable: true,

    // A‑B‑A awareness
    bandAware: true,
    waveFieldAware: true,
    binaryFieldAware: true
  },

  routingContract: "PulseRouter-v11-Evo-A2",
  meshContract: "PulseMesh-v11",
  sendContract: "PulseSend-v11",
  gpuOrganContract: "PulseGPU-v11",
  minerContract: "PulseMiner-v11",
  pulseCompatibility: "Pulse-v1/v2/v3"
};
export const PulseProxyOrganismMeta = Object.freeze({
  layer: "PulseProxyOrganism",
  role: "SYMBOLIC_PROXY_ORGANISM",
  version: "v11.2-EVO-MAX",
  identity: "PulseProxy-v11.2-EVO-MAX",

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
    parent: "PulseProxy-v11.2-EVO",
    ancestry: [
      "PulseProxy-v7",
      "PulseProxy-v8",
      "PulseProxy-v9",
      "PulseProxy-v10",
      "PulseProxy-v11",
      "PulseProxy-v11-Evo"
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
    adaptive: "binary-field + wave-field overlays",
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

// Proxy-specific diagnostics + mode

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


// ============================================================================
//  A‑B‑A SURFACES (symbolic proxy band)
// ============================================================================

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


// ============================================================================
//  FACTORY — Create a Proxy v11-Evo A‑B‑A Organism (symbolic)
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
  const binaryField = buildBinaryField(pattern, lineage);
  const waveField   = buildWaveField(pattern, lineage);

  return {
    ProxyRole,
    jobId,
    pattern,
    payload,
    priority,
    returnTo,
    lineage,
    pageId,
    meta: {
      shapeSignature,
      evolutionStage,

      patternAncestry,
      lineageSignature,
      pageAncestrySignature,

      healthScore,
      tier,
      advantageField,

      proxyMode,
      returnArcAssist: true,
      preferProxyBeforeMesh: true,
      diagnostics,

      // A‑B‑A surfaces
      band,
      bandSignature,
      binaryField,
      waveField,

      // A‑B‑A hints for downstream organs
      _abaBand: band,
      _abaBinaryDensity: binaryField.binarySurface.density,
      _abaWaveAmplitude: waveField.amplitude,

      loopTheory: {
        routingCompletion: true,
        allowLoopfieldPropulsion: true,
        pulseComputeContinuity: true,
        errorRouteAround: true,

        continuanceCapable: true,
        preferContinuanceOnOrganFailure: true
      }
    }
  };
}


// ============================================================================
//  EVOLUTION ENGINE — evolve an existing Proxy deterministically (symbolic)
// ============================================================================
export function evolveProxy(proxy, context = {}) {
  const nextPattern     = evolvePattern(proxy.pattern, context);
  const nextLineage     = buildLineage(proxy.lineage, nextPattern);
  const shapeSignature  = computeShapeSignature(nextPattern, nextLineage);
  const evolutionStage  = computeEvolutionStage(nextPattern, nextLineage);

  const patternAncestry       = buildPatternAncestry(nextPattern);
  const lineageSignature      = buildLineageSignature(nextLineage);
  const pageId                = proxy.pageId || "NO_PAGE";
  const pageAncestrySignature = buildPageAncestrySignature({
    pattern: nextPattern,
    lineage: nextLineage,
    pageId
  });

  const healthScore    = computeHealthScore(nextPattern, nextLineage);
  const tier           = classifyDegradationTier(healthScore);
  const advantageField = buildAdvantageField(nextPattern, nextLineage);
  const proxyMode      = computeProxyMode(tier, nextPattern);
  const diagnostics    = buildProxyDiagnostics(
    nextPattern,
    nextLineage,
    healthScore,
    tier
  );

  const { band, bandSignature } = buildBandSignature(nextPattern);
  const binaryField = buildBinaryField(nextPattern, nextLineage);
  const waveField   = buildWaveField(nextPattern, nextLineage);

  const { routerHint, meshHint, sendHint, healthHint, tierHint } = context || {};

  return {
    ProxyRole,
    jobId: proxy.jobId,
    pattern: nextPattern,
    payload: proxy.payload,
    priority: proxy.priority,
    returnTo: proxy.returnTo,
    lineage: nextLineage,
    pageId,
    meta: {
      shapeSignature,
      evolutionStage,

      patternAncestry,
      lineageSignature,
      pageAncestrySignature,

      healthScore,
      tier,
      advantageField,

      proxyMode,
      returnArcAssist: true,
      preferProxyBeforeMesh: true,
      diagnostics,

      proxyHints: {
        routerHint: routerHint || null,
        meshHint: meshHint || null,
        sendHint: sendHint || null,
        healthHint: typeof healthHint === "number" ? healthHint : null,
        tierHint: tierHint || null
      },

      // A‑B‑A surfaces
      band,
      bandSignature,
      binaryField,
      waveField,

      _abaBand: band,
      _abaBinaryDensity: binaryField.binarySurface.density,
      _abaWaveAmplitude: waveField.amplitude,

      loopTheory: {
        routingCompletion: true,
        allowLoopfieldPropulsion: true,
        pulseComputeContinuity: true,
        errorRouteAround: true,

        continuanceCapable: true,
        preferContinuanceOnOrganFailure: true
      }
    }
  };
}
