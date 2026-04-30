// ============================================================================
//  PulseEarn-v12.3-PRESENCE-EVO+.js — Earn Organism v12.3 Presence-EVO+
//  FULL UPGRADE of v11-EVO: dual-band, evolution surfaces, presence/mesh/castle/
//  expansion/server/globalHints-aware, chunk/cache/prewarm/factoring-aware.
// ============================================================================
//
//  SAFETY CONTRACT (v12.3-PRESENCE-EVO+):
//  -------------------------------------
//  • No imports.
//  • No randomness.
//  • No timestamps in math (only telemetry if desired).
//  • Pure deterministic string/shape operations.
//  • Zero mutation outside instance.
//  • Band-aware, but band is metadata-only (no behavioral non-determinism).
//  • All “memory” is structural (derived from inputs), not temporal.
//  • Presence/mesh/castle/expansion/globalHints are metadata surfaces only.
// ============================================================================
// --- CORE EARN ORGAN --------------------------------------------------------
// --- BIOLOGICAL EARN ORGANS -----------------------------------------------
import * as PulseEarnCirculatorySystem from "./PulseEarnCirculatorySystem.js";
import * as PulseEarnEndocrineSystem   from "./PulseEarnEndocrineSystem.js";
import * as PulseEarnImmuneSystem      from "./PulseEarnImmuneSystem.js";
import * as PulseEarnMetabolism        from "./PulseEarnMetabolism.js";
import * as PulseEarnNervousSystem     from "./PulseEarnNervousSystem.js";
import * as PulseEarnSkeletalSystem    from "./PulseEarnSkeletalSystem.js";

// --- MARKET EARN ORGANS ----------------------------------------------------
import * as PulseEarnMktAuctioneer     from "./PulseEarnMktAuctioneer.js";
import * as PulseEarnMktBroker         from "./PulseEarnMktBroker.js";
import * as PulseEarnMktCourier        from "./PulseEarnMktCourier.js";

export const EarnMeta = Object.freeze({
  layer: "PulseEarn",
  role: "EARN_ORGAN",
  version: "v12.3-PRESENCE-EVO+",
  identity: "PulseEarn-v12.3-PRESENCE-EVO+",

  guarantees: Object.freeze({
    deterministic: true,
    noRandomness: true,
    noRealTime: true,
    noExternalIO: true,

    bandAware: true,
    binaryAware: true,
    evolutionAware: true,
    lineageAware: true,
    patternAware: true,
    shapeAware: true,
    worldLensAware: true,
    multiInstanceAware: true,
    waveFieldAware: true,

    presenceAware: true,
    meshAware: true,
    castleAware: true,
    expansionAware: true,
    serverAware: true,
    routerAware: true,
    beaconAware: true,

    chunkAware: true,
    cacheAware: true,
    prewarmAware: true,
    hotStateAware: true,
    factoringAware: true
  }),

  contract: Object.freeze({
    input: [
      "EarnInputShape",
      "DualBandContext",
      "EvolutionSurface",
      "AdvantageField",
      "CohortWaveState",
      "PresenceField",
      "MeshSignals",
      "CastleSignals",
      "ExpansionSignals",
      "ServerAdvantageHints",
      "GlobalHints"
    ],
    output: [
      "EarnOutputShape",
      "EarnDiagnostics",
      "EarnSignatures",
      "EarnPresenceField",
      "EarnAdvantageField"
    ]
  }),

  lineage: Object.freeze({
    root: "PulseOS-v12.3-PRESENCE-EVO+",
    parent: "PulseProxy-v12.3-PRESENCE-EVO+",
    ancestry: ["PulseOS-v10", "PulseEarn-v10.4", "PulseEarn-v11", "PulseEarn-v11.2-EVO"]
  }),

  bands: Object.freeze({
    supported: ["symbolic", "binary"],
    default: "symbolic",
    behavior: "metadata-only"
  })
});


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
//  EarnRole — identifies this as the Earn v12.3 Organism
// ============================================================================
export const EarnRole = {
  type: "Earn",
  subsystem: "Earn",
  layer: "Organ",
  version: "12.3-PRESENCE-EVO+",
  identity: "Earn-v12.3-PRESENCE-EVO+",

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
    memorySurfaceReady: true,

    // Presence-EVO+
    presenceAware: true,
    meshAware: true,
    castleAware: true,
    expansionAware: true,
    serverAware: true,
    routerAware: true,
    beaconAware: true,

    chunkAware: true,
    cacheAware: true,
    prewarmAware: true,
    hotStateAware: true,
    factoringAware: true
  },

  routingContract: "PulseRouter-v12.3-PRESENCE-EVO+",
  meshContract: "PulseMesh-v12.3-PRESENCE-EVO+",
  sendContract: "PulseSend-v12.3-PRESENCE-EVO+",
  gpuOrganContract: "PulseGPU-v12.3-PRESENCE-EVO+",
  minerContract: "PulseMiner-v12.3-PRESENCE-EVO+",
  pulseCompatibility: "Pulse-v1/v2/v3"
};


// ============================================================================
//  INTERNAL HELPERS — deterministic, tiny, pure
// ============================================================================
function computeHash(str) {
  let h = 0;
  const s = String(str || "");
  for (let i = 0; i < s.length; i++) {
    h = (h + s.charCodeAt(i) * (i + 1)) % 100000;
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

function buildAdvantageFieldCore(pattern, lineage, band) {
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

function clamp01(x) {
  if (x == null || Number.isNaN(x)) return 0;
  return Math.max(0, Math.min(1, x));
}

function normalizeCachePriority(p) {
  if (!p) return "normal";
  const v = String(p).toLowerCase();
  if (v === "critical" || v === "high" || v === "low") return v;
  return "normal";
}

function deriveFactoringSignalFromContext({
  meshPressureIndex = 0,
  cachePriority = "normal",
  prewarmNeeded = false
}) {
  const pressure = clamp01(meshPressureIndex / 100);
  const highPressure = pressure >= 0.7;
  const criticalCache = cachePriority === "critical";

  if (criticalCache || prewarmNeeded) return 1;
  if (highPressure) return 1;
  return 0;
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
//  PRESENCE / ADVANTAGE FIELDS (v12.3)
// ============================================================================
function buildPresenceField({
  regionId = "unknown-region",
  castleId = "unknown-castle",
  meshStrength = "unknown",
  meshPressureIndex = 0,
  devicePresence = "unknown",
  bandPresence = "unknown",
  routerPresence = "unknown",
  castleLoadLevel = "unknown"
} = {}) {
  return Object.freeze({
    regionId,
    castleId,
    meshStrength,
    meshPressureIndex,
    devicePresence,
    bandPresence,
    routerPresence,
    castleLoadLevel
  });
}

function buildAdvantageField({
  band = "symbolic",
  chunkAggression = 0,
  cachePriority = "normal",
  prewarmNeeded = false,
  hotStateReuse = true,
  multiInstanceBatching = true,
  factoringSignal = 1,
  serverHotStateReuse = true,
  serverPlanCache = true,
  serverBinaryReuse = true
} = {}) {
  return Object.freeze({
    band: normalizeBand(band),
    chunkAggression,
    cachePriority: normalizeCachePriority(cachePriority),
    prewarmNeeded,
    hotStateReuse,
    multiInstanceBatching,
    factoringSignal,
    serverHotStateReuse,
    serverPlanCache,
    serverBinaryReuse
  });
}


// ============================================================================
//  FACTORY — Create an Earn v12.3 Presence-EVO Organism (dual-band)
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

  // presence / mesh / castle / expansion / server / global hints
  presenceField = null,
  meshSignals = null,
  castleSignals = null,
  expansionSignals = null, // reserved, symbolic only
  serverAdvantageHints = null,
  globalHints = null
}) {
  const normalizedBand = normalizeBand(band);

  const pf = presenceField || buildPresenceField({});
  const mesh = meshSignals || { meshStrength: "unknown", meshPressureIndex: 0 };
  const castle = castleSignals || { loadLevel: "unknown" };
  const gh = globalHints || {};
  const serverHints = serverAdvantageHints || {};

  const cachePriority = normalizeCachePriority(gh.cacheHints?.priority);
  const prewarmNeeded = !!(gh.prewarmHints?.shouldPrewarm);
  const meshPressureIndex = mesh.meshPressureIndex || 0;

  const factoringSignal =
    deriveFactoringSignalFromContext({
      meshPressureIndex,
      cachePriority,
      prewarmNeeded
    });

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
  const advantageFieldCore = buildAdvantageFieldCore(pattern, lineage, normalizedBand);
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

  const earnPresenceField = buildPresenceField({
    regionId: pf.regionId,
    castleId: pf.castleId,
    meshStrength: mesh.meshStrength || pf.meshStrength,
    meshPressureIndex: mesh.meshPressureIndex || pf.meshPressureIndex,
    devicePresence: pf.devicePresence,
    bandPresence: pf.bandPresence,
    routerPresence: pf.routerPresence,
    castleLoadLevel: castle.loadLevel || "unknown"
  });

  const earnAdvantageField = buildAdvantageField({
    band: normalizedBand,
    chunkAggression: gh.chunkHints?.chunkAggression ?? 0,
    cachePriority,
    prewarmNeeded,
    hotStateReuse: serverHints.hotStateReuse ?? true,
    multiInstanceBatching: serverHints.multiInstanceBatching ?? true,
    factoringSignal,
    serverHotStateReuse: serverHints.hotStateReuse ?? true,
    serverPlanCache: serverHints.planCache ?? true,
    serverBinaryReuse: serverHints.binaryReuse ?? true
  });

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
    factoringSignal,

    presenceField: earnPresenceField,
    advantageField: {
      ...advantageFieldCore,
      ...earnAdvantageField
    },

    meta: {
      shapeSignature,
      evolutionStage,

      patternAncestry,
      lineageSignature,
      pageAncestrySignature,

      healthScore,
      tier,
      advantageField: advantageFieldCore,
      diagnostics,

      loopField,
      waveField,
      memorySurface,
      binaryField,

      // v11/v12 signatures
      earnSignature: computeHash(pattern + "::" + lineageSignature + "::" + normalizedBand),
      patternSignature: computeHash(pattern),
      lineageSurface: computeHash(String(lineage.length)),
      advantageSignature: computeHash(JSON.stringify(advantageFieldCore)),
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
  const advantageFieldCore = buildAdvantageFieldCore(nextPattern, nextLineage, normalizedBand);
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

  const pf = earn.presenceField || buildPresenceField({});
  const adv = earn.advantageField || buildAdvantageField({ band: normalizedBand });

  const mesh = context.meshSignals || null;
  const castle = context.castleSignals || null;
  const gh = context.globalHints || null;
  const serverHints = context.serverAdvantageHints || null;

  const cachePriority = normalizeCachePriority(gh?.cacheHints?.priority ?? adv.cachePriority);
  const prewarmNeeded = gh?.prewarmHints?.shouldPrewarm ?? adv.prewarmNeeded;
  const meshPressureIndex = mesh?.meshPressureIndex ?? pf.meshPressureIndex ?? 0;

  const nextFactoringSignal =
    deriveFactoringSignalFromContext({
      meshPressureIndex,
      cachePriority,
      prewarmNeeded
    });

  const nextPresenceField = buildPresenceField({
    regionId: pf.regionId,
    castleId: pf.castleId,
    meshStrength: mesh?.meshStrength ?? pf.meshStrength,
    meshPressureIndex,
    devicePresence: pf.devicePresence,
    bandPresence: pf.bandPresence,
    routerPresence: pf.routerPresence,
    castleLoadLevel: castle?.loadLevel ?? pf.castleLoadLevel ?? "unknown"
  });

  const nextAdvantageField = buildAdvantageField({
    band: normalizedBand,
    chunkAggression: gh?.chunkHints?.chunkAggression ?? adv.chunkAggression,
    cachePriority,
    prewarmNeeded,
    hotStateReuse: serverHints?.hotStateReuse ?? adv.hotStateReuse,
    multiInstanceBatching: serverHints?.multiInstanceBatching ?? adv.multiInstanceBatching,
    factoringSignal: nextFactoringSignal,
    serverHotStateReuse: serverHints?.hotStateReuse ?? adv.serverHotStateReuse ?? true,
    serverPlanCache: serverHints?.planCache ?? adv.serverPlanCache ?? true,
    serverBinaryReuse: serverHints?.binaryReuse ?? adv.serverBinaryReuse ?? true
  });

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

    presenceField: nextPresenceField,
    advantageField: {
      ...advantageFieldCore,
      ...nextAdvantageField
    },

    meta: {
      shapeSignature,
      evolutionStage,

      patternAncestry,
      lineageSignature,
      pageAncestrySignature,

      healthScore,
      tier,
      advantageField: advantageFieldCore,
      diagnostics,

      loopField,
      waveField,
      memorySurface,
      binaryField,

      earnSignature: computeHash(nextPattern + "::" + lineageSignature + "::" + normalizedBand),
      patternSignature: computeHash(nextPattern),
      lineageSurface: computeHash(String(nextLineage.length)),
      advantageSignature: computeHash(JSON.stringify(advantageFieldCore)),
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
//  COHORT / WAVE EVOLUTION — multi-instance evolution surfaces (presence-aware)
// ============================================================================
export function createEarnCohort(specs = [], sharedContext = {}) {
  return specs.map((spec, index) =>
    createEarn({
      ...spec,
      jobId: spec.jobId ?? `earn-job-${index + 1}`,
      presenceField: sharedContext.presenceField,
      meshSignals: sharedContext.meshSignals,
      castleSignals: sharedContext.castleSignals,
      expansionSignals: sharedContext.expansionSignals,
      serverAdvantageHints: sharedContext.serverAdvantageHints,
      globalHints: sharedContext.globalHints
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
