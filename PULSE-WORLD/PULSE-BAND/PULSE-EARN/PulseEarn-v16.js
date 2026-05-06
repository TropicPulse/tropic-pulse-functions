// ============================================================================
//  PulseEarn-v16.0-Presence-Immortal-GPU-INTEL.js — Earn Organism v16
//  IMMORTAL UPGRADE of v12.3-Presence-Evo+:
//  - dual-band (symbolic + binary)
//  - evolution surfaces
//  - presence / mesh / castle / expansion / server / globalHints-aware
//  - chunk / cache / prewarm / factoring-aware
//  - GPU advantage baked in (lanes, tiers, reuse, prewarm plans)
//  - per-page compute intelligence + memory surfaces
// ============================================================================
//
//  SAFETY CONTRACT (v16.0-Presence-Immortal-GPU-INTEL):
//  ----------------------------------------------------
//  • No randomness.
//  • No timestamps in math (only telemetry if desired).
//  • Pure deterministic string/shape operations.
//  • Zero mutation outside instance (CoreMemory writes are structural, keyed, deterministic).
//  • Band-aware, but band is metadata-only (no behavioral non-determinism).
//  • All “memory” is structural (derived from inputs), not temporal.
//  • Presence/mesh/castle/expansion/globalHints are metadata surfaces only.
//  • Health is descriptive-only (no performance/baseline math).
//  • Advantage fields are IMMORTAL, versioned, non-perf-weighted.
// ============================================================================

/*
AI_EXPERIENCE_META = {
  identity: "PulseEarn",
  version: "v16-Immortal-GPU-INTEL",
  layer: "earn_core",
  role: "earn_root_engine",
  lineage: "PulseEarn-v9 → v10.4 → v11-Evo → v12.3 → v16-Immortal-GPU-INTEL",

  evo: {
    earnRoot: true,
    jobPlanner: true,
    jobFusion: true,
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
      "PulseEarnCell",
      "PulseEarnCirculatorySystem",
      "PulseEarnEndocrineSystem",
      "PulseEarnGeneticMemory",
      "PulseEarnContinuancePulse"
    ],
    never: [
      "safeRoute",
      "fetchViaCNS",
      "presenceEngine",
      "meshKernel"
    ]
  }
}
*/

// --- CORE EARN ORGAN --------------------------------------------------------
// --- BIOLOGICAL EARN ORGANS -----------------------------------------------
import * as PulseEarnHeart from "./PulseEarnHeart.js";
import * as PulseEarnCirculatorySystem from "./PulseEarnCirculatorySystem.js";
import * as PulseEarnEndocrineSystem   from "./PulseEarnEndocrineSystem.js";
import * as PulseEarnImmuneSystem      from "./PulseEarnImmuneSystem.js";
import * as PulseEarnMetabolism        from "./PulseEarnMetabolism.js";
import * as PulseEarnNervousSystem     from "./PulseEarnNervousSystem.js";
import * as PulseEarnSkeletalSystem    from "./PulseEarnSkeletalSystem.js";
import { PulseEarnSignalFactoring } from "./PulseEarnSignalFactoring.js";

// --- MARKET EARN ORGANS ----------------------------------------------------
import PulseEarnMktAuctioneer     from "./PulseEarnMktAuctioneer.js";
import PulseEarnMktAmbassador     from "./PulseEarnMktAmbassador.js";
import PulseEarnMktBroker         from "./PulseEarnMktBroker.js";
import PulseEarnMktCourier        from "./PulseEarnMktCourier.js";
import PulseEarnMktForager        from "./PulseEarnMktForager.js";

import {
  PulseNetBoot,
  PulseNet,
  PulseProofBridge
} from "../../PULSE-UI/_BACKEND/PulseProofBridge.js";

// --- PULSE-CORE MEMORY SPINE (FULL SPINE) ----------------------------------
import PulseCoreMemory                from "../PULSE-CORE/PulseCoreMemory.js";
import PulseCoreAIMemoryAdapter       from "../PULSE-CORE/PulseCoreAIMemoryAdapter.js";
import PulseCoreGPUMemoryAdapter      from "../PULSE-CORE/PulseCoreGPUMemoryAdapter.js";
import PulseCoreEarnMemoryAdapter     from "../PULSE-CORE/PulseCoreEarnMemoryAdapter.js";
import PulseBinaryCoreOverlay         from "../PULSE-CORE/PulseBinaryCoreOverlay.js";

// CoreMemory bridge: structural, deterministic, keyed by memory surfaces.
export const CoreMemory = Object.freeze({
  raw: () => PulseCoreMemory,
  all: () => PulseCoreAIMemoryAdapter,
  gpu: () => PulseCoreGPUMemoryAdapter,
  earn: () => PulseCoreEarnMemoryAdapter,
  binaryOverlay: () => PulseBinaryCoreOverlay
});

// ============================================================================
//  EarnMeta — static contract + guarantees
// ============================================================================
export const EarnMeta = Object.freeze({
  layer: "PulseEarn",
  role: "EARN_ORGAN",
  version: "v16.0-Presence-Immortal-GPU-INTEL",
  identity: "PulseEarn-v16.0-Presence-Immortal-GPU-INTEL",

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
    factoringAware: true,

    gpuAware: true,
    gpuAdvantageAware: true,
    gpuBinaryFieldAware: true,
    gpuTierAware: true,
    gpuLaneAware: true,
    gpuPrewarmPlanAware: true
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
      "GlobalHints",
      "GPUHints",
      "PageHints"
    ],
    output: [
      "EarnOutputShape",
      "EarnDiagnostics",
      "EarnSignatures",
      "EarnPresenceField",
      "EarnAdvantageField",
      "EarnPulseIntelligence",
      "EarnPageIntelligence"
    ]
  }),

  lineage: Object.freeze({
    root: "PulseOS-v16.0-Presence-Immortal",
    parent: "PulseProxy-v16.0-Presence-Immortal",
    ancestry: [
      "PulseOS-v10",
      "PulseEarn-v10.4",
      "PulseEarn-v11",
      "PulseEarn-v11.2-Evo",
      "PulseEarn-v12.3-Presence-Evo+"
    ]
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
//  EarnRole — identifies this as the Earn v16 IMMORTAL-GPU-INTEL Organism
// ============================================================================
export const EarnRole = {
  type: "Earn",
  subsystem: "Earn",
  layer: "Organ",
  version: "16.0-Immortal-GPU-INTEL",
  identity: "Earn-v16.0-Immortal-GPU-INTEL",

  evo: {
    // Core evolution awareness
    driftProof: true,
    deterministic: true,
    patternAware: true,
    lineageAware: true,
    shapeAware: true,
    evolutionEngineReady: true,

    // Compute surfaces
    gpuAwareReady: true,
    minerAwareReady: true,
    airAwareReady: true,
    offlineAwareReady: true,
    futureEvolutionReady: true,

    // Unified advantage + tier + diagnostics
    unifiedAdvantageField: true,
    advantageFieldAware: true,
    tierAware: true,
    diagnosticsReady: true,
    signatureReady: true,
    evolutionSurfaceReady: true,

    // Intelligence
    pulseIntelligenceReady: true,
    solvednessAware: true,
    factoringAware: true,
    computeTierAware: true,
    readinessAware: true,

    // Binary / dual-band / wave / cohort
    bandAware: true,
    dualBandReady: true,
    binaryCompressionReady: true,
    gpuBinaryFieldReady: true,
    waveFieldAware: true,
    cohortAware: true,
    evolutionSurfaceCohortReady: true,

    // Memory + ancestry
    ancestryAware: true,
    memorySurfaceReady: true,
    loopTheoryAware: true,

    // Presence‑IMMORTAL surfaces
    presenceAware: true,
    meshAware: true,
    castleAware: true,
    expansionAware: true,
    serverAware: true,
    routerAware: true,
    beaconAware: true,

    // Chunking / caching / prewarm / hot state
    chunkAware: true,
    cacheAware: true,
    prewarmAware: true,
    hotStateAware: true,

    // Continuance + legacy bridge
    continuanceAware: true,
    legacyBridgeCapable: true
  },

  routingContract: "PulseRouter-v16.0-Immortal-GPU-INTEL",
  meshContract: "PulseMesh-v16.0-Immortal-GPU-INTEL",
  sendContract: "PulseSend-v16.0-Immortal-GPU-INTEL",
  gpuOrganContract: "PulseGPU-v16.0-Immortal-GPU-INTEL",
  minerContract: "PulseMiner-v16.0-Immortal-GPU-INTEL",
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

// Primary INTEL hash — deterministic, structure-aware, no IO, no time.
function computeHashIntelligence(payload) {
  const base = JSON.stringify(payload || "");
  let h = 0;
  for (let i = 0; i < base.length; i++) {
    const c = base.charCodeAt(i);
    h = (h * 131 + c * (i + 7)) % 1000000007;
  }
  return `HINTEL_${h}`;
}

function buildDualHashSignature(label, intelPayload, classicString) {
  const intelBase = {
    label,
    intel: intelPayload || {},
    classic: classicString || ""
  };
  const intelHash = computeHashIntelligence(intelBase);
  const classicHash = computeHash(
    `${label}::${classicString || ""}`
  );
  return {
    intel: intelHash,
    classic: classicHash
  };
}

function buildLineage(parentLineage, pattern) {
  const base = Array.isArray(parentLineage) ? parentLineage : [];
  return [...base, pattern];
}

function computeShapeSignature(pattern, lineage, band) {
  const raw = `${normalizeBand(band)}::${pattern}::${lineage.join("::")}`;
  return `earn-shape-${buildDualHashSignature(raw)}`;
}

function computeBinaryShapeSignature(pattern, lineage) {
  const raw = `binary::${pattern}::${lineage.join("::")}`;
  return `earn-bshape-${buildDualHashSignature(raw)}`;
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
  const { gpuHint, minerHint, airHint, pageHint } = context;

  const parts = [pattern];

  if (gpuHint) parts.push(`g:${gpuHint}`);
  if (minerHint) parts.push(`m:${minerHint}`);
  if (airHint) parts.push(`a:${airHint}`);
  if (pageHint) parts.push(`p:${pageHint}`);

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

  return buildDualHashSignature(JSON.stringify(shape));
}

// v16 IMMORTAL: health is descriptive-only, not performance-weighted.
function computeHealthScore() {
  return 1.0;
}

function classifyDegradationTier(h) {
  if (h >= 0.95) return "microDegrade";
  if (h >= 0.85) return "softDegrade";
  if (h >= 0.50) return "midDegrade";
  if (h >= 0.15) return "hardDegrade";
  return "criticalDegrade";
}

// ============================================================================
//  ADVANTAGE CORE + SUBFIELDS (v16, multi-surface, GPU-aware)
// ============================================================================

function buildAdvantageFieldCore(pattern, lineage, band) {
  const depth = lineage.length;
  const b = normalizeBand(band);

  return {
    advantageVersion: "E-16.0",
    lineageDepth: depth,
    patternTag: pattern,
    band: b,
    binaryCompressionBias: b === ROUTE_BANDS.BINARY ? 1 : 0,
    symbolicPlanningBias: b === ROUTE_BANDS.SYMBOLIC ? 1 : 0,

    // structural tags only
    lineageSignature: buildLineageSignature(lineage),
    patternLength: pattern.length
  };
}

function buildCacheAdvantage({
  cachePriority = "normal",
  cacheScope = "page",
  cacheCohort = "global",
  cacheWarmth = "cold",
  cacheReuseAllowed = true
} = {}) {
  return {
    cachePriority: normalizeCachePriority(cachePriority),
    cacheScope,
    cacheCohort,
    cacheWarmth,
    cacheReuseAllowed
  };
}

function buildPrewarmAdvantage({
  prewarmNeeded = false,
  prewarmScope = "page",
  prewarmBand = "symbolic",
  prewarmBudget = 0,
  prewarmHint = "none"
} = {}) {
  return {
    prewarmNeeded: !!prewarmNeeded,
    prewarmScope,
    prewarmBand: normalizeBand(prewarmBand),
    prewarmBudget,
    prewarmHint
  };
}

function buildServerAdvantage({
  hotStateReuse = true,
  multiInstanceBatching = true,
  serverHotStateReuse = true,
  serverPlanCache = true,
  serverBinaryReuse = true,
  serverTier = "normal"
} = {}) {
  return {
    hotStateReuse,
    multiInstanceBatching,
    serverHotStateReuse,
    serverPlanCache,
    serverBinaryReuse,
    serverTier
  };
}

function buildGPUAdvantage({
  gpuPreferred = true,
  gpuTier = "normal",
  gpuBinaryReuse = true,
  gpuPrewarm = true,
  gpuChunkAggression = 0,
  gpuCachePriority = "normal",
  gpuLaneCount = 0,
  gpuLaneUtilization = 0,
  gpuBinaryFieldEnabled = true
} = {}) {
  return {
    gpuPreferred,
    gpuTier,
    gpuBinaryReuse,
    gpuPrewarm,
    gpuChunkAggression,
    gpuCachePriority: normalizeCachePriority(gpuCachePriority),
    gpuLaneCount,
    gpuLaneUtilization,
    gpuBinaryFieldEnabled
  };
}

function buildCohortAdvantage({
  cohortId = "global",
  cohortTier = "normal",
  cohortWaveMode = "steady",
  cohortPriority = "normal"
} = {}) {
  return {
    cohortId,
    cohortTier,
    cohortWaveMode,
    cohortPriority
  };
}

function buildPageAdvantage({
  pageId = "NO_PAGE",
  pagePriority = "normal",
  pageHotState = "cold",
  pagePatternClass = "generic"
} = {}) {
  return {
    pageId,
    pagePriority,
    pageHotState,
    pagePatternClass
  };
}

function buildDiagnostics(pattern, lineage, healthScore, tier, band) {
  const b = normalizeBand(band);

  return {
    pattern,
    patternLength: pattern.length,
    lineageDepth: lineage.length,
    healthScore,
    tier,
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

// ============================================================================
// ⭐ Pulse Intelligence (logic-only, IMMORTAL-safe, GPU-aware)
// ============================================================================
function computePulseIntelligence({ advantageField, presenceField, factoringSignal, band }) {
  const advantageScore = advantageField.advantageScore || 0;
  const advantageTier  = advantageField.advantageTier  || 0;

  const presenceTier = presenceField.presenceTier || "idle";
  const presenceWeight =
    presenceTier === "critical" ? 1.0 :
    presenceTier === "high"     ? 0.8 :
    presenceTier === "elevated" ? 0.6 :
    presenceTier === "soft"     ? 0.4 :
    0.2;

  const factoring = factoringSignal ? 1 : 0;
  const bandIsBinary = band === "binary" ? 1 : 0;

  const gpuTier = advantageField.gpuTier || "unknown";
  const gpuAffinity =
    gpuTier === "critical" ? 1.0 :
    gpuTier === "high"     ? 0.8 :
    gpuTier === "normal"   ? 0.5 :
    gpuTier === "low"      ? 0.2 :
    0.0;

  const solvednessScore = Math.max(
    0,
    Math.min(
      advantageScore * 10 * 0.4 +
      presenceWeight * 0.25 +
      factoring * 0.15 +
      gpuAffinity * 0.2,
      1
    )
  );

  const computeTier =
    solvednessScore >= 0.9 ? "nearSolution" :
    solvednessScore >= 0.7 ? "highValue"    :
    solvednessScore >= 0.4 ? "normal"       :
    solvednessScore >= 0.2 ? "lowPriority"  :
    "avoidCompute";

  const readinessScore = Math.max(
    0,
    Math.min(
      solvednessScore * 0.6 +
      (bandIsBinary ? 0.15 : 0) +
      (advantageTier >= 2 ? 0.15 : advantageTier === 1 ? 0.05 : 0) +
      gpuAffinity * 0.1,
      1
    )
  );

  return {
    solvednessScore,
    factoringSignal: factoring ? "high" : "low",
    computeTier,
    readinessScore,
    band,
    advantageTier,
    gpuTier,
    gpuAffinity
  };
}

// Per-page intelligence: how “worth it” is GPU + prewarm for this page.
function computePageIntelligence({
  pageAdvantage,
  cacheAdvantage,
  prewarmAdvantage,
  gpuAdvantage
}) {
  const pagePriority = pageAdvantage.pagePriority || "normal";
  const pageHotState = pageAdvantage.pageHotState || "cold";

  const cachePriority = cacheAdvantage.cachePriority || "normal";
  const cacheWarmth = cacheAdvantage.cacheWarmth || "cold";

  const prewarmNeeded = !!prewarmAdvantage.prewarmNeeded;
  const gpuPreferred = !!gpuAdvantage.gpuPreferred;

  const priorityWeight =
    pagePriority === "critical" ? 1.0 :
    pagePriority === "high"     ? 0.8 :
    pagePriority === "normal"   ? 0.5 :
    pagePriority === "low"      ? 0.2 :
    0.1;

  const hotStateWeight =
    pageHotState === "hot"   ? 1.0 :
    pageHotState === "warm"  ? 0.7 :
    pageHotState === "cool"  ? 0.4 :
    0.2;

  const cacheWeight =
    cachePriority === "critical" ? 1.0 :
    cachePriority === "high"     ? 0.8 :
    cachePriority === "normal"   ? 0.5 :
    cachePriority === "low"      ? 0.2 :
    0.1;

  const cacheWarmthWeight =
    cacheWarmth === "hot"   ? 1.0 :
    cacheWarmth === "warm"  ? 0.7 :
    cacheWarmth === "cool"  ? 0.4 :
    0.2;

  const prewarmWeight = prewarmNeeded ? 1.0 : 0.2;
  const gpuWeight = gpuPreferred ? 1.0 : 0.3;

  const pageComputeScore = Math.max(
    0,
    Math.min(
      priorityWeight * 0.3 +
      hotStateWeight * 0.2 +
      cacheWeight * 0.15 +
      cacheWarmthWeight * 0.15 +
      prewarmWeight * 0.1 +
      gpuWeight * 0.1,
      1
    )
  );

  const pageComputeTier =
    pageComputeScore >= 0.9 ? "pageCritical" :
    pageComputeScore >= 0.7 ? "pageHigh"     :
    pageComputeScore >= 0.4 ? "pageNormal"   :
    pageComputeScore >= 0.2 ? "pageLow"      :
    "pageAvoid";

  return {
    pageComputeScore,
    pageComputeTier,
    gpuPreferred,
    prewarmNeeded,
    cachePriority,
    pagePriority
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
    memoryKey: buildDualHashSignature(
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
    binarySurfaceSignature: buildDualHashSignature(JSON.stringify(raw)),
    binarySurface: raw,
    parity,
    bitDensity,
    shiftDepth
  };
}

// ============================================================================
//  CORE MEMORY FIELD (FULL SPINE) — structural, keyed, deterministic
// ============================================================================
function buildCoreMemoryField({
  pattern,
  lineage,
  pageId,
  band,
  memorySurface,
  binaryField
}) {
  const normalizedBand = normalizeBand(band);

  return {
    coreMemoryVersion: "v16.0-Presence-Immortal-GPU-INTEL",
    band: normalizedBand,
    pattern,
    lineage,
    pageId,
    memoryKey: memorySurface.memoryKey,
    ancestry: memorySurface.ancestry,
    lineageSignature: memorySurface.lineageSignature,
    pageSignature: memorySurface.pageSignature,
    binaryShapeSignature: binaryField.binaryShapeSignature,
    binarySurfaceSignature: binaryField.binarySurfaceSignature,
    binarySurface: binaryField.binarySurface,
    parity: binaryField.parity,
    bitDensity: binaryField.bitDensity,
    shiftDepth: binaryField.shiftDepth
  };
}

// Structural read from CoreMemory via Earn adapter (if present).
function readCoreMemoryEarn(memoryKey) {
  try {
    const earnAdapter = CoreMemory.earn?.();
    if (!earnAdapter || typeof earnAdapter.readEarnMemory !== "function") {
      return null;
    }
    return earnAdapter.readEarnMemory(memoryKey);
  } catch {
    return null;
  }
}

// Structural write to CoreMemory via Earn adapter (if present).
function writeCoreMemoryEarn(memoryKey, coreMemoryField) {
  try {
    const earnAdapter = CoreMemory.earn?.();
    if (!earnAdapter || typeof earnAdapter.writeEarnMemory !== "function") {
      return;
    }
    earnAdapter.writeEarnMemory(memoryKey, coreMemoryField);
  } catch {
    // IMMORTAL: swallow, no side-effects on failure path.
  }
}

// ============================================================================
//  PRESENCE / ADVANTAGE FIELDS (v16 IMMORTAL, GPU-aware)
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
  const pressure =
    (Number(meshPressureIndex) || 0) +
    (castleLoadLevel === "unknown" ? 0 : Number(castleLoadLevel) || 0);

  let presenceTier = "idle";
  if (pressure >= 150) presenceTier = "critical";
  else if (pressure >= 100) presenceTier = "high";
  else if (pressure >= 50) presenceTier = "elevated";
  else if (pressure > 0) presenceTier = "soft";

  const presenceSignature = buildDualHashSignature(
    `EARN_PRESENCE_V16::${presenceTier}::${meshPressureIndex}::${castleLoadLevel}`
  );

  return Object.freeze({
    presenceVersion: "v16.0-Presence-Immortal-GPU-INTEL",
    presenceTier,
    presenceSignature,
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
  // cache
  cachePriority = "normal",
  cacheScope = "page",
  cacheCohort = "global",
  cacheWarmth = "cold",
  cacheReuseAllowed = true,

  // prewarm
  prewarmNeeded = false,
  prewarmScope = "page",
  prewarmBand = "symbolic",
  prewarmBudget = 0,
  prewarmHint = "none",

  // server
  hotStateReuse = true,
  multiInstanceBatching = true,
  serverHotStateReuse = true,
  serverPlanCache = true,
  serverBinaryReuse = true,
  serverTier = "normal",

  // factoring
  factoringSignal = 1,

  // GPU
  gpuPreferred = true,
  gpuTier = "normal",
  gpuBinaryReuse = true,
  gpuPrewarm = true,
  gpuChunkAggression = 0,
  gpuCachePriority = "normal",
  gpuLaneCount = 0,
  gpuLaneUtilization = 0,
  gpuBinaryFieldEnabled = true,

  // cohort
  cohortId = "global",
  cohortTier = "normal",
  cohortWaveMode = "steady",
  cohortPriority = "normal",

  // page
  pageId = "NO_PAGE",
  pagePriority = "normal",
  pageHotState = "cold",
  pagePatternClass = "generic"
} = {}) {
  const cacheAdv = buildCacheAdvantage({
    cachePriority,
    cacheScope,
    cacheCohort,
    cacheWarmth,
    cacheReuseAllowed
  });

  const prewarmAdv = buildPrewarmAdvantage({
    prewarmNeeded,
    prewarmScope,
    prewarmBand,
    prewarmBudget,
    prewarmHint
  });

  const serverAdv = buildServerAdvantage({
    hotStateReuse,
    multiInstanceBatching,
    serverHotStateReuse,
    serverPlanCache,
    serverBinaryReuse,
    serverTier
  });

  const gpuAdv = buildGPUAdvantage({
    gpuPreferred,
    gpuTier,
    gpuBinaryReuse,
    gpuPrewarm,
    gpuChunkAggression,
    gpuCachePriority,
    gpuLaneCount,
    gpuLaneUtilization,
    gpuBinaryFieldEnabled
  });

  const cohortAdv = buildCohortAdvantage({
    cohortId,
    cohortTier,
    cohortWaveMode,
    cohortPriority
  });

  const pageAdv = buildPageAdvantage({
    pageId,
    pagePriority,
    pageHotState,
    pagePatternClass
  });

  return Object.freeze({
    advantageVersion: "E-16.0",
    band: normalizeBand(band),
    factoringSignal,

    cache: cacheAdv,
    prewarm: prewarmAdv,
    server: serverAdv,
    gpu: gpuAdv,
    cohort: cohortAdv,
    page: pageAdv,

    // flattened convenience fields for older callers
    cachePriority: cacheAdv.cachePriority,
    prewarmNeeded: prewarmAdv.prewarmNeeded,
    hotStateReuse: serverAdv.hotStateReuse,
    multiInstanceBatching: serverAdv.multiInstanceBatching,
    serverHotStateReuse: serverAdv.serverHotStateReuse,
    serverPlanCache: serverAdv.serverPlanCache,
    serverBinaryReuse: serverAdv.serverBinaryReuse,

    gpuPreferred: gpuAdv.gpuPreferred,
    gpuTier: gpuAdv.gpuTier,
    gpuBinaryReuse: gpuAdv.gpuBinaryReuse,
    gpuPrewarm: gpuAdv.gpuPrewarm,
    gpuChunkAggression: gpuAdv.gpuChunkAggression,
    gpuCachePriority: gpuAdv.gpuCachePriority
  });
}

// ============================================================================
//  FACTORY — Create an Earn v16 IMMORTAL-GPU-INTEL Organism (dual-band)
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

  // presence / mesh / castle / expansion / server / global hints / gpu hints / page hints
  presenceField = null,
  meshSignals = null,
  castleSignals = null,
  expansionSignals = null, // reserved, symbolic only
  serverAdvantageHints = null,
  globalHints = null,
  gpuHints = null,
  pageHints = null
}) {
  const normalizedBand = normalizeBand(band);

  const pf = presenceField || buildPresenceField({});
  const mesh = meshSignals || { meshStrength: "unknown", meshPressureIndex: 0 };
  const castle = castleSignals || { loadLevel: "unknown" };
  const gh = globalHints || {};
  const serverHints = serverAdvantageHints || {};
  const gpu = gpuHints || {};
  const page = pageHints || {};

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

  const healthScore = computeHealthScore();
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

  // CoreMemory full spine field
  const coreMemoryField = buildCoreMemoryField({
    pattern,
    lineage,
    pageId,
    band: normalizedBand,
    memorySurface,
    binaryField
  });

  // Structural read from CoreMemory (if any prior Earn state exists)
  const priorCoreMemory = readCoreMemoryEarn(coreMemoryField.memoryKey);

  // PULSE-NET organism snapshot — structural, descriptive-only
  const netOrganism = PulseNet.organism?.() ?? null;
  const netField = netOrganism
    ? {
        lastHeartbeat: netOrganism.lastHeartbeat ?? 0,
        lastAIHeartbeat: netOrganism.lastAIHeartbeat ?? 0,
        forwardTicks: netOrganism.forwardTicks ?? 0,
        backwardTicks: netOrganism.backwardTicks ?? 0,
        lastBeatSource: netOrganism.lastBeatSource ?? "none"
      }
    : {
        lastHeartbeat: 0,
        lastAIHeartbeat: 0,
        forwardTicks: 0,
        backwardTicks: 0,
        lastBeatSource: "none"
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

    cachePriority,
    cacheScope: gh.cacheHints?.scope ?? "page",
    cacheCohort: gh.cacheHints?.cohort ?? "global",
    cacheWarmth: gh.cacheHints?.warmth ?? "cold",
    cacheReuseAllowed: gh.cacheHints?.reuseAllowed ?? true,

    prewarmNeeded,
    prewarmScope: gh.prewarmHints?.scope ?? "page",
    prewarmBand: gh.prewarmHints?.band ?? normalizedBand,
    prewarmBudget: gh.prewarmHints?.budget ?? 0,
    prewarmHint: gh.prewarmHints?.hint ?? "none",

    hotStateReuse: serverHints.hotStateReuse ?? true,
    multiInstanceBatching: serverHints.multiInstanceBatching ?? true,
    serverHotStateReuse: serverHints.hotStateReuse ?? true,
    serverPlanCache: serverHints.planCache ?? true,
    serverBinaryReuse: serverHints.binaryReuse ?? true,
    serverTier: serverHints.serverTier ?? "normal",

    factoringSignal,

    gpuPreferred: gpu.gpuPreferred ?? true,
    gpuTier: gpu.gpuTier ?? "normal",
    gpuBinaryReuse: gpu.gpuBinaryReuse ?? true,
    gpuPrewarm: gpu.gpuPrewarm ?? true,
    gpuChunkAggression: gpu.gpuChunkAggression ?? (gh.chunkHints?.chunkAggression ?? 0),
    gpuCachePriority: gpu.gpuCachePriority ?? cachePriority,
    gpuLaneCount: gpu.gpuLaneCount ?? 0,
    gpuLaneUtilization: gpu.gpuLaneUtilization ?? 0,
    gpuBinaryFieldEnabled: gpu.gpuBinaryFieldEnabled ?? true,

    cohortId: gh.cohortHints?.cohortId ?? "global",
    cohortTier: gh.cohortHints?.cohortTier ?? "normal",
    cohortWaveMode: gh.cohortHints?.waveMode ?? "steady",
    cohortPriority: gh.cohortHints?.priority ?? "normal",

    pageId,
    pagePriority: page.pagePriority ?? "normal",
    pageHotState: page.pageHotState ?? "cold",
    pagePatternClass: page.pagePatternClass ?? "generic"
  });

  // ⭐ Intelligence surface (v16 IMMORTAL-GPU-INTEL)
  const pulseIntelligence = computePulseIntelligence({
    advantageField: {
      ...earnAdvantageField,
      gpuTier: earnAdvantageField.gpu?.gpuTier || earnAdvantageField.gpuTier
    },
    presenceField: earnPresenceField,
    factoringSignal,
    band: normalizedBand
  });

  // ⭐ Per-page intelligence surface
  const pageIntelligence = computePageIntelligence({
    pageAdvantage: earnAdvantageField.page,
    cacheAdvantage: earnAdvantageField.cache,
    prewarmAdvantage: earnAdvantageField.prewarm,
    gpuAdvantage: earnAdvantageField.gpu
  });

  const earnObject = {
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

    // ⭐ top-level intelligence
    pulseIntelligence,
    pageIntelligence,

    netField,          // PULSE-NET organism snapshot
    coreMemoryField,   // CoreMemory full spine field
    priorCoreMemory,   // Any prior stored Earn memory for this key

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

      netField,
      coreMemoryField,
      priorCoreMemory,

      // ⭐ mirrored intelligence + signature
      pulseIntelligence,
      pageIntelligence,
      pulseIntelligenceSignature: buildDualHashSignature(JSON.stringify(pulseIntelligence)),
      pageIntelligenceSignature: buildDualHashSignature(JSON.stringify(pageIntelligence)),

      // v11/v12/v13 signatures
      earnSignature: buildDualHashSignature(
        pattern + "::" + lineageSignature + "::" + normalizedBand
      ),
      patternSignature: buildDualHashSignature(pattern),
      lineageSurface: buildDualHashSignature(String(lineage.length)),
      advantageSignature: buildDualHashSignature(JSON.stringify(advantageFieldCore)),
      healthSignature: buildDualHashSignature(String(healthScore)),
      tierSignature: buildDualHashSignature(tier),
      bandSignature: buildDualHashSignature(normalizedBand),

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

  // Structural write of Earn state into CoreMemory via Earn adapter.
  writeCoreMemoryEarn(coreMemoryField.memoryKey, earnObject.coreMemoryField);

  return earnObject;
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

  const healthScore = computeHealthScore();
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
  const gpu = context.gpuHints || null;
  const page = context.pageHints || null;

  const cachePriority = normalizeCachePriority(
    gh?.cacheHints?.priority ?? adv.cachePriority
  );
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

    cachePriority,
    cacheScope: gh?.cacheHints?.scope ?? adv.cache?.cacheScope ?? "page",
    cacheCohort: gh?.cacheHints?.cohort ?? adv.cache?.cacheCohort ?? "global",
    cacheWarmth: gh?.cacheHints?.warmth ?? adv.cache?.cacheWarmth ?? "cold",
    cacheReuseAllowed: gh?.cacheHints?.reuseAllowed ?? adv.cache?.cacheReuseAllowed ?? true,

    prewarmNeeded,
    prewarmScope: gh?.prewarmHints?.scope ?? adv.prewarm?.prewarmScope ?? "page",
    prewarmBand: gh?.prewarmHints?.band ?? adv.prewarm?.prewarmBand ?? normalizedBand,
    prewarmBudget: gh?.prewarmHints?.budget ?? adv.prewarm?.prewarmBudget ?? 0,
    prewarmHint: gh?.prewarmHints?.hint ?? adv.prewarm?.prewarmHint ?? "none",

    hotStateReuse: serverHints?.hotStateReuse ?? adv.server?.hotStateReuse ?? adv.hotStateReuse,
    multiInstanceBatching: serverHints?.multiInstanceBatching ?? adv.server?.multiInstanceBatching ?? adv.multiInstanceBatching,
    serverHotStateReuse: serverHints?.hotStateReuse ?? adv.server?.serverHotStateReuse ?? adv.serverHotStateReuse ?? true,
    serverPlanCache: serverHints?.planCache ?? adv.server?.serverPlanCache ?? adv.serverPlanCache ?? true,
    serverBinaryReuse: serverHints?.binaryReuse ?? adv.server?.serverBinaryReuse ?? adv.serverBinaryReuse ?? true,
    serverTier: serverHints?.serverTier ?? adv.server?.serverTier ?? "normal",

    factoringSignal: nextFactoringSignal,

    gpuPreferred: gpu?.gpuPreferred ?? adv.gpu?.gpuPreferred ?? adv.gpuPreferred ?? true,
    gpuTier: gpu?.gpuTier ?? adv.gpu?.gpuTier ?? adv.gpuTier ?? "normal",
    gpuBinaryReuse: gpu?.gpuBinaryReuse ?? adv.gpu?.gpuBinaryReuse ?? adv.gpuBinaryReuse ?? true,
    gpuPrewarm: gpu?.gpuPrewarm ?? adv.gpu?.gpuPrewarm ?? adv.gpuPrewarm ?? true,
    gpuChunkAggression: gpu?.gpuChunkAggression ?? adv.gpu?.gpuChunkAggression ?? adv.gpuChunkAggression ?? 0,
    gpuCachePriority: gpu?.gpuCachePriority ?? adv.gpu?.gpuCachePriority ?? cachePriority,
    gpuLaneCount: gpu?.gpuLaneCount ?? adv.gpu?.gpuLaneCount ?? 0,
    gpuLaneUtilization: gpu?.gpuLaneUtilization ?? adv.gpu?.gpuLaneUtilization ?? 0,
    gpuBinaryFieldEnabled: gpu?.gpuBinaryFieldEnabled ?? adv.gpu?.gpuBinaryFieldEnabled ?? true,

    cohortId: gh?.cohortHints?.cohortId ?? adv.cohort?.cohortId ?? "global",
    cohortTier: gh?.cohortHints?.cohortTier ?? adv.cohort?.cohortTier ?? "normal",
    cohortWaveMode: gh?.cohortHints?.waveMode ?? adv.cohort?.cohortWaveMode ?? "steady",
    cohortPriority: gh?.cohortHints?.priority ?? adv.cohort?.cohortPriority ?? "normal",

    pageId,
    pagePriority: page?.pagePriority ?? adv.page?.pagePriority ?? "normal",
    pageHotState: page?.pageHotState ?? adv.page?.pageHotState ?? "cold",
    pagePatternClass: page?.pagePatternClass ?? adv.page?.pagePatternClass ?? "generic"
  });

  // ⭐ Intelligence surface (v16 IMMORTAL-GPU-INTEL)
  const pulseIntelligence = computePulseIntelligence({
    advantageField: {
      ...nextAdvantageField,
      gpuTier: nextAdvantageField.gpu?.gpuTier || nextAdvantageField.gpuTier
    },
    presenceField: nextPresenceField,
    factoringSignal: nextFactoringSignal,
    band: normalizedBand
  });

  // CoreMemory full spine field for evolved Earn
  const coreMemoryField = buildCoreMemoryField({
    pattern: nextPattern,
    lineage: nextLineage,
    pageId,
    band: normalizedBand,
    memorySurface,
    binaryField
  });

  // Structural read from CoreMemory for evolved key
  const priorCoreMemory = readCoreMemoryEarn(coreMemoryField.memoryKey);

  // PULSE-NET organism snapshot — structural, descriptive-only
  const netOrganism = PulseNet.organism?.() ?? null;
  const netField = netOrganism
    ? {
        lastHeartbeat: netOrganism.lastHeartbeat ?? 0,
        lastAIHeartbeat: netOrganism.lastAIHeartbeat ?? 0,
        forwardTicks: netOrganism.forwardTicks ?? 0,
        backwardTicks: netOrganism.backwardTicks ?? 0,
        lastBeatSource: netOrganism.lastBeatSource ?? "none"
      }
    : {
        lastHeartbeat: 0,
        lastAIHeartbeat: 0,
        forwardTicks: 0,
        backwardTicks: 0,
        lastBeatSource: "none"
      };

  const pageIntelligence = computePageIntelligence({
    pageAdvantage: nextAdvantageField.page,
    cacheAdvantage: nextAdvantageField.cache,
    prewarmAdvantage: nextAdvantageField.prewarm,
    gpuAdvantage: nextAdvantageField.gpu
  });

  const evolved = {
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

    // ⭐ top-level intelligence
    pulseIntelligence,
    pageIntelligence,

    netField,
    coreMemoryField,
    priorCoreMemory,

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

      netField,
      coreMemoryField,
      priorCoreMemory,

      // ⭐ mirrored intelligence + signature
      pulseIntelligence,
      pageIntelligence,
      pulseIntelligenceSignature: buildDualHashSignature(JSON.stringify(pulseIntelligence)),
      pageIntelligenceSignature: buildDualHashSignature(JSON.stringify(pageIntelligence)),

      earnSignature: buildDualHashSignature(
        nextPattern + "::" + lineageSignature + "::" + normalizedBand
      ),
      patternSignature: buildDualHashSignature(nextPattern),
      lineageSurface: buildDualHashSignature(String(nextLineage.length)),
      advantageSignature: buildDualHashSignature(JSON.stringify(advantageFieldCore)),
      healthSignature: buildDualHashSignature(String(healthScore)),
      tierSignature: buildDualHashSignature(tier),
      bandSignature: buildDualHashSignature(normalizedBand),

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

  // Structural write of evolved Earn state into CoreMemory via Earn adapter.
  writeCoreMemoryEarn(coreMemoryField.memoryKey, evolved.coreMemoryField);

  return evolved;
}

// ============================================================================
//  BRIDGE — Earn namespace alias to PulseProofBridge
// ============================================================================
const PulseEarnBridge = PulseProofBridge;
export default PulseEarnBridge;
