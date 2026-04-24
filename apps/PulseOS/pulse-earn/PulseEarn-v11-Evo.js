// ============================================================================
//  PulseEarn-v11-Evo.js — Earn Organism v11.0 + Dual-Band + Evolution Engine
//  Evolutionary Earn Organ • Pattern + Lineage + Shape • Multi-Instance Waves
//  v11: Diagnostics + Signatures + Evolution Surface + Advantage Surface
//  v11+Binary: Symbolic + Binary bands, deterministic, compression-aware
// ============================================================================
//
//  SAFETY CONTRACT (v11-Evo):
//  --------------------------
//  • No imports.
//  • No randomness.
//  • No timestamps.
//  • Pure deterministic string/shape operations.
//  • Zero mutation outside instance.
//  • Band-aware, but band is metadata-only (no behavioral non-determinism).
//  • All “memory” is structural (derived from inputs), not temporal.
// ============================================================================


// ============================================================================
//  DUAL-BAND CONSTANTS (symbolic + binary)
// ============================================================================
const ROUTE_BANDS = {
  SYMBOLIC: "symbolic",
  BINARY: "binary"
};

function normalizeBand(band) {
  const b = (band || ROUTE_BANDS.SYMBOLIC).toLowerCase();
  return b === ROUTE_BANDS.BINARY ? ROUTE_BANDS.BINARY : ROUTE_BANDS.SYMBOLIC;
}


// ============================================================================
//  EarnRole — identifies this as the Earn v11 Organism
// ============================================================================
export const EarnRole = {
  type: "Earn",
  subsystem: "Earn",
  layer: "Organ",
  version: "11.0",
  identity: "Earn-v11-Evo",

  evo: {
    driftProof: true,
    patternAware: true,
    lineageAware: true,
    shapeAware: true,
    evolutionEngineReady: true,
    gpuAwareReady: true,
    minerAwareReady: true,
    airAwareReady: true,
    offlineAwareReady: true,
    futureEvolutionReady: true,

    unifiedAdvantageField: true,
    earnV3Ready: true,

    ancestryAware: true,
    loopTheoryAware: true,
    tierAware: true,
    advantageFieldAware: true,

    continuanceAware: true,
    legacyBridgeCapable: true,

    diagnosticsReady: true,
    signatureReady: true,
    evolutionSurfaceReady: true,

    // v11+Binary
    bandAware: true,
    dualBandReady: true,
    binaryCompressionReady: true,
    gpuBinaryFieldReady: true,

    // Multi-instance / wave / loop theory
    cohortAware: true,
    waveFieldAware: true,
    evolutionSurfaceCohortReady: true,
    memorySurfaceReady: true
  },

  routingContract: "PulseRouter-v11",
  meshContract: "PulseMesh-v11",
  sendContract: "PulseSend-v11",
  gpuOrganContract: "PulseGPU-v11",
  minerContract: "PulseMiner-v11",
  pulseCompatibility: "Pulse-v1/v2/v3"
};


// ============================================================================
//  INTERNAL HELPERS — deterministic, tiny, pure
// ============================================================================

function computeHash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h + str.charCodeAt(i) * (i + 1)) % 100000;
  }
  return `h${h}`;
}

function buildLineage(parentLineage, pattern) {
  const base = Array.isArray(parentLineage) ? parentLineage : [];
  return [...base, pattern];
}

function computeShapeSignature(pattern, lineage, band) {
  const raw = `${normalizeBand(band)}::${pattern}::${lineage.join("::")}`;
  return `earn-shape-${computeHash(raw)}`;
}

function computeBinaryShapeSignature(pattern, lineage) {
  const raw = `binary::${pattern}::${lineage.join("::")}`;
  return `earn-bshape-${computeHash(raw)}`;
}

function computeEvolutionStage(pattern, lineage, band) {
  const depth = lineage.length;
  const b = normalizeBand(band);

  if (depth === 1) return b === ROUTE_BANDS.BINARY ? "seed-binary" : "seed";
  if (depth === 2) return b === ROUTE_BANDS.BINARY ? "sprout-binary" : "sprout";
  if (depth === 3) return b === ROUTE_BANDS.BINARY ? "branch-binary" : "branch";

  if (pattern.includes("gpu")) return b === ROUTE_BANDS.BINARY ? "gpu-binary" : "gpu-aware";
  if (pattern.includes("miner")) return b === ROUTE_BANDS.BINARY ? "miner-binary" : "miner-aware";
  if (pattern.includes("air")) return b === ROUTE_BANDS.BINARY ? "air-binary" : "air-compute";

  return b === ROUTE_BANDS.BINARY ? "mature-binary" : "mature";
}

function evolvePattern(pattern, context = {}) {
  const { gpuHint, minerHint, airHint } = context;

  const parts = [pattern];

  if (gpuHint) parts.push(`g:${gpuHint}`);
  if (minerHint) parts.push(`m:${minerHint}`);
  if (airHint) parts.push(`a:${airHint}`);

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

function buildPageAncestrySignature({ pattern, lineage, pageId, band }) {
  const shape = {
    pattern,
    patternAncestry: buildPatternAncestry(pattern),
    lineageSignature: buildLineageSignature(lineage),
    pageId: pageId || "NO_PAGE",
    band: normalizeBand(band)
  };

  return computeHash(JSON.stringify(shape));
}

function computeHealthScore(pattern, lineage, band) {
  const baseCore = 0.7 + Math.min(0.3, lineage.length * 0.02 + pattern.length * 0.001);
  const bandBias = normalizeBand(band) === ROUTE_BANDS.BINARY ? 0.02 : 0.0;
  const base = baseCore + bandBias;
  return Math.max(0.15, Math.min(1.0, base));
}

function classifyDegradationTier(h) {
  if (h >= 0.95) return "microDegrade";
  if (h >= 0.85) return "softDegrade";
  if (h >= 0.50) return "midDegrade";
  if (h >= 0.15) return "hardDegrade";
  return "criticalDegrade";
}

function buildAdvantageField(pattern, lineage, band) {
  const depth = lineage.length;
  const plen = pattern.length;
  const b = normalizeBand(band);

  return {
    lineageDepth: depth,
    patternStrength: plen,
    shapeComplexity: depth * plen,
    band: b,
    binaryCompressionBias: b === ROUTE_BANDS.BINARY ? 1 : 0,
    symbolicPlanningBias: b === ROUTE_BANDS.SYMBOLIC ? 1 : 0
  };
}

function buildDiagnostics(pattern, lineage, healthScore, tier, band) {
  const b = normalizeBand(band);

  return {
    patternLength: pattern.length,
    lineageDepth: lineage.length,
    healthBucket:
      healthScore >= 0.9 ? "elite" :
      healthScore >= 0.75 ? "high" :
      healthScore >= 0.5 ? "medium" : "low",
    tier,
    lineageDensity: lineage.length === 0 ? 0 : pattern.length / lineage.length,
    band: b,
    bandMode:
      b === ROUTE_BANDS.BINARY ? "binary-compression" : "symbolic-planning"
  };
}


// ============================================================================
//  LOOP THEORY / WAVE THEORY / MEMORY SURFACES (pure, structural)
// ============================================================================

function buildLoopField(lineage, band) {
  const depth = lineage.length;
  const b = normalizeBand(band);

  return {
    depth,
    closedLoop: depth > 0,
    loopStrength: depth * (b === ROUTE_BANDS.BINARY ? 2 : 1),
    band: b
  };
}

function buildWaveField(pattern, lineage, band) {
  const plen = pattern.length;
  const depth = lineage.length;
  const b = normalizeBand(band);

  return {
    wavelength: plen,
    amplitude: depth,
    phase: (plen + depth) % 8,
    band: b,
    mode: b === ROUTE_BANDS.BINARY ? "compression-wave" : "symbolic-wave"
  };
}

function buildMemorySurface(pattern, lineage, pageId, band) {
  const ancestry = buildPatternAncestry(pattern);
  const lineageSig = buildLineageSignature(lineage);
  const pageSig = buildPageAncestrySignature({ pattern, lineage, pageId, band });

  return {
    ancestry,
    lineageSignature: lineageSig,
    pageSignature: pageSig,
    band: normalizeBand(band),
    memoryKey: computeHash(
      ancestry.join("/") + "::" + lineageSig + "::" + pageSig
    )
  };
}

function buildBinaryField(pattern, lineage) {
  const raw = {
    patternLength: pattern.length,
    lineageDepth: lineage.length,
    surface: pattern.length * (lineage.length || 1)
  };

  const parity = raw.surface % 2 === 0 ? 0 : 1;
  const bitDensity = pattern.length + lineage.length;
  const shiftDepth = Math.max(0, Math.floor(Math.log2(raw.surface || 1)));

  return {
    binaryShapeSignature: computeBinaryShapeSignature(pattern, lineage),
    binarySurfaceSignature: computeHash(JSON.stringify(raw)),
    binarySurface: raw,
    parity,
    bitDensity,
    shiftDepth
  };
}


// ============================================================================
//  FACTORY — Create an Earn v11 Organism (dual-band, evolution surfaces)
// ============================================================================
export function createEarn({
  jobId,
  pattern,
  payload = {},
  priority = "normal",
  returnTo = null,
  parentLineage = null,
  pageId = "NO_PAGE",
  band = ROUTE_BANDS.SYMBOLIC,
  factoringSignal = 1
}) {
  const normalizedBand = normalizeBand(band);
  const normalizedFactoringSignal =
    typeof factoringSignal === "number" ? (factoringSignal ? 1 : 0) : 1;

  const lineage = buildLineage(parentLineage, pattern);
  const shapeSignature = computeShapeSignature(pattern, lineage, normalizedBand);
  const evolutionStage = computeEvolutionStage(pattern, lineage, normalizedBand);

  const patternAncestry = buildPatternAncestry(pattern);
  const lineageSignature = buildLineageSignature(lineage);
  const pageAncestrySignature = buildPageAncestrySignature({
    pattern,
    lineage,
    pageId,
    band: normalizedBand
  });

  const healthScore = computeHealthScore(pattern, lineage, normalizedBand);
  const tier = classifyDegradationTier(healthScore);
  const advantageField = buildAdvantageField(pattern, lineage, normalizedBand);
  const diagnostics = buildDiagnostics(pattern, lineage, healthScore, tier, normalizedBand);

  const loopField = buildLoopField(lineage, normalizedBand);
  const waveField = buildWaveField(pattern, lineage, normalizedBand);
  const memorySurface = buildMemorySurface(pattern, lineage, pageId, normalizedBand);
  const binaryField =
    normalizedBand === ROUTE_BANDS.BINARY
      ? buildBinaryField(pattern, lineage)
      : {
          binaryShapeSignature: null,
          binarySurfaceSignature: null,
          binarySurface: null,
          parity: null,
          bitDensity: null,
          shiftDepth: null
        };

  return {
    EarnRole,
    jobId,
    pattern,
    payload,
    priority,
    returnTo,
    lineage,
    pageId,

    band: normalizedBand,
    factoringSignal: normalizedFactoringSignal,

    meta: {
      shapeSignature,
      evolutionStage,

      patternAncestry,
      lineageSignature,
      pageAncestrySignature,

      healthScore,
      tier,
      advantageField,
      diagnostics,

      loopField,
      waveField,
      memorySurface,
      binaryField,

      // v11 signatures
      earnSignature: computeHash(pattern + "::" + lineageSignature + "::" + normalizedBand),
      patternSignature: computeHash(pattern),
      lineageSurface: computeHash(String(lineage.length)),
      advantageSignature: computeHash(JSON.stringify(advantageField)),
      healthSignature: computeHash(String(healthScore)),
      tierSignature: computeHash(tier),
      bandSignature: computeHash(normalizedBand),

      dualMode: {
        symbolic: normalizedBand === ROUTE_BANDS.SYMBOLIC,
        binary: normalizedBand === ROUTE_BANDS.BINARY
      },

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
//  EVOLUTION ENGINE — evolve an existing Earn deterministically (dual-band)
// ============================================================================
export function evolveEarn(earn, context = {}) {
  const currentBand =
    earn.band ||
    earn.meta?.band ||
    ROUTE_BANDS.SYMBOLIC;

  const normalizedBand = normalizeBand(context.band || currentBand);

  const nextPattern = evolvePattern(earn.pattern, context);
  const nextLineage = buildLineage(earn.lineage, nextPattern);

  const shapeSignature = computeShapeSignature(nextPattern, nextLineage, normalizedBand);
  const evolutionStage = computeEvolutionStage(nextPattern, nextLineage, normalizedBand);

  const patternAncestry = buildPatternAncestry(nextPattern);
  const lineageSignature = buildLineageSignature(nextLineage);
  const pageId = earn.pageId || "NO_PAGE";
  const pageAncestrySignature = buildPageAncestrySignature({
    pattern: nextPattern,
    lineage: nextLineage,
    pageId,
    band: normalizedBand
  });

  const healthScore = computeHealthScore(nextPattern, nextLineage, normalizedBand);
  const tier = classifyDegradationTier(healthScore);
  const advantageField = buildAdvantageField(nextPattern, nextLineage, normalizedBand);
  const diagnostics = buildDiagnostics(nextPattern, nextLineage, healthScore, tier, normalizedBand);

  const loopField = buildLoopField(nextLineage, normalizedBand);
  const waveField = buildWaveField(nextPattern, nextLineage, normalizedBand);
  const memorySurface = buildMemorySurface(nextPattern, nextLineage, pageId, normalizedBand);
  const binaryField =
    normalizedBand === ROUTE_BANDS.BINARY
      ? buildBinaryField(nextPattern, nextLineage)
      : {
          binaryShapeSignature: null,
          binarySurfaceSignature: null,
          binarySurface: null,
          parity: null,
          bitDensity: null,
          shiftDepth: null
        };

  const nextFactoringSignal =
    typeof context.factoringSignal === "number"
      ? (context.factoringSignal ? 1 : 0)
      : (typeof earn.factoringSignal === "number"
          ? (earn.factoringSignal ? 1 : 0)
          : 1);

  return {
    EarnRole,
    jobId: earn.jobId,
    pattern: nextPattern,
    payload: earn.payload,
    priority: earn.priority,
    returnTo: earn.returnTo,
    lineage: nextLineage,
    pageId,

    band: normalizedBand,
    factoringSignal: nextFactoringSignal,

    meta: {
      shapeSignature,
      evolutionStage,

      patternAncestry,
      lineageSignature,
      pageAncestrySignature,

      healthScore,
      tier,
      advantageField,
      diagnostics,

      loopField,
      waveField,
      memorySurface,
      binaryField,

      earnSignature: computeHash(nextPattern + "::" + lineageSignature + "::" + normalizedBand),
      patternSignature: computeHash(nextPattern),
      lineageSurface: computeHash(String(nextLineage.length)),
      advantageSignature: computeHash(JSON.stringify(advantageField)),
      healthSignature: computeHash(String(healthScore)),
      tierSignature: computeHash(tier),
      bandSignature: computeHash(normalizedBand),

      dualMode: {
        symbolic: normalizedBand === ROUTE_BANDS.SYMBOLIC,
        binary: normalizedBand === ROUTE_BANDS.BINARY
      },

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
//  COHORT / WAVE EVOLUTION — multi-instance evolution surfaces
// ============================================================================

export function createEarnCohort(specs = []) {
  return specs.map((spec, index) =>
    createEarn({
      ...spec,
      jobId: spec.jobId ?? `earn-job-${index + 1}`
    })
  );
}

export function evolveEarnCohort(earns = [], context = {}) {
  return earns.map((earn) => evolveEarn(earn, context));
}

export function projectEvolutionSurface(earns = []) {
  const count = earns.length;

  const bands = earns.reduce(
    (acc, e) => {
      const b = normalizeBand(e.band || e.meta?.band);
      if (b === ROUTE_BANDS.BINARY) acc.binary++;
      else acc.symbolic++;
      return acc;
    },
    { symbolic: 0, binary: 0 }
  );

  const tiers = earns.reduce(
    (acc, e) => {
      const t = e.meta?.tier || "unknown";
      acc[t] = (acc[t] || 0) + 1;
      return acc;
    },
    {}
  );

  const avgHealth =
    count === 0
      ? 0
      : earns.reduce((sum, e) => sum + (e.meta?.healthScore || 0), 0) / count;

  return {
    count,
    bands,
    tiers,
    avgHealth,
    surfaceSignature: computeHash(
      JSON.stringify({ count, bands, tiers, avgHealth })
    )
  };
}
