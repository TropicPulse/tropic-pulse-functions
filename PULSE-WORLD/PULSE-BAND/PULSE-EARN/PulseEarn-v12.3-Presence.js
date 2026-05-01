// ============================================================================
//  PulseEarn-v13.0-PRESENCE-IMMORTAL.js — Earn Organism v13 Presence-IMMORTAL
//  IMMORTAL UPGRADE of v12.3-EVO+: dual-band, evolution surfaces, presence/
//  mesh/castle/expansion/server/globalHints-aware, chunk/cache/prewarm/
//  factoring-aware — with descriptive-only health + IMMORTAL advantage fields.
// ============================================================================
//
//  SAFETY CONTRACT (v13.0-PRESENCE-IMMORTAL):
//  -----------------------------------------
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

// --- CORE EARN ORGAN --------------------------------------------------------
// --- BIOLOGICAL EARN ORGANS -----------------------------------------------
import * as PulseEarnCirculatorySystem from "./PulseEarnCirculatorySystem.js";
import * as PulseEarnEndocrineSystem   from "./PulseEarnEndocrineSystem.js";
import * as PulseEarnImmuneSystem      from "./PulseEarnImmuneSystem.js";
import * as PulseEarnMetabolism        from "./PulseEarnMetabolism.js";
import * as PulseEarnNervousSystem     from "./PulseEarnNervousSystem.js";
import * as PulseEarnSkeletalSystem    from "./PulseEarnSkeletalSystem.js";

// --- MARKET EARN ORGANS ----------------------------------------------------
import PulseEarnMktAuctioneer     from "./PulseEarnMktAuctioneer.js";
import PulseEarnMktAmbassador     from "./PulseEarnMktAmbassador.js";
import PulseEarnMktBroker         from "./PulseEarnMktBroker.js";
import PulseEarnMktCourier        from "./PulseEarnMktCourier.js";
import PulseEarnMktForager        from "./PulseEarnMktForager.js";

// --- PULSE-NET ORGANISM BRIDGE (v15-FAMILY-IMMORTAL) -----------------------
import {
  startPulseNet,
  PulseNetForward,
  PulseNetBackward,
  PulseNetOrganism
} from "../PULSE-ENGINE/PULSE-NET.js";

// --- PULSE-CORE MEMORY SPINE (FULL SPINE) ----------------------------------
import PulseCoreMemory                from "../PULSE-CORE/PulseCoreMemory.js";
import PulseCoreAIMemoryAdapter      from "../PULSE-CORE/PulseCoreAIMemoryAdapter.js";
import PulseCoreEarnMemoryAdapter     from "../PULSE-CORE/PulseCoreEarnMemoryAdapter.js";
import PulseBinaryCoreOverlay         from "../PULSE-CORE/PulseBinaryCoreOverlay.js";

// IMMORTAL: no top-level ticking, no time-based math here.
// We only expose structural accessors to the running PULSE-NET organism.
// Host code (not this file) may call startPulseNet(intervalMs) if desired.
const PulseNet = Object.freeze({
  forwardEngine: () => PulseNetForward(),
  backwardEngine: () => PulseNetBackward(),
  organism: () => PulseNetOrganism()
});

// CoreMemory bridge: structural, deterministic, keyed by memory surfaces.
const CoreMemory = Object.freeze({
  raw: () => PulseCoreMemory,
  all: () => PulseCoreAIMemoryAdapter,
  earn: () => PulseCoreEarnMemoryAdapter,
  binaryOverlay: () => PulseBinaryCoreOverlay
});

// ============================================================================
//  EarnMeta — static contract + guarantees
// ============================================================================
export const EarnMeta = Object.freeze({
  layer: "PulseEarn",
  role: "EARN_ORGAN",
  version: "v13.0-PRESENCE-IMMORTAL",
  identity: "PulseEarn-v13.0-PRESENCE-IMMORTAL",

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
    root: "PulseOS-v13.0-PRESENCE-IMMORTAL",
    parent: "PulseProxy-v13.0-PRESENCE-IMMORTAL",
    ancestry: [
      "PulseOS-v10",
      "PulseEarn-v10.4",
      "PulseEarn-v11",
      "PulseEarn-v11.2-EVO",
      "PulseEarn-v12.3-PRESENCE-EVO+"
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
//  EarnRole — identifies this as the Earn v13 IMMORTAL Organism
// ============================================================================
export const EarnRole = {
  type: "Earn",
  subsystem: "Earn",
  layer: "Organ",
  version: "13.0-PRESENCE-IMMORTAL",
  identity: "Earn-v13.0-PRESENCE-IMMORTAL",

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

    // Presence-IMMORTAL
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

  routingContract: "PulseRouter-v13.0-PRESENCE-IMMORTAL",
  meshContract: "PulseMesh-v13.0-PRESENCE-IMMORTAL",
  sendContract: "PulseSend-v13.0-PRESENCE-IMMORTAL",
  gpuOrganContract: "PulseGPU-v13.0-PRESENCE-IMMORTAL",
  minerContract: "PulseMiner-v13.0-PRESENCE-IMMORTAL",
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

// v13 IMMORTAL: health is descriptive-only, not performance-weighted.
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

// v13 IMMORTAL: advantage core is structural, not perf-weighted by pattern length.
function buildAdvantageFieldCore(pattern, lineage, band) {
  const depth = lineage.length;
  const b = normalizeBand(band);

  return {
    advantageVersion: "E-13.0",
    lineageDepth: depth,
    patternTag: pattern,
    band: b,
    binaryCompressionBias: b === ROUTE_BANDS.BINARY ? 1 : 0,
    symbolicPlanningBias: b === ROUTE_BANDS.SYMBOLIC ? 1 : 0
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
    coreMemoryVersion: "v13.0-PRESENCE-IMMORTAL",
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
//  PRESENCE / ADVANTAGE FIELDS (v13 IMMORTAL)
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

  const presenceSignature = computeHash(
    `EARN_PRESENCE_V13::${presenceTier}::${meshPressureIndex}::${castleLoadLevel}`
  );

  return Object.freeze({
    presenceVersion: "v13.0-PRESENCE-IMMORTAL",
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
    advantageVersion: "E-13.0",
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
//  FACTORY — Create an Earn v13 Presence-IMMORTAL Organism (dual-band)
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

      // v11/v12/v13 signatures
      earnSignature: computeHash(
        pattern + "::" + lineageSignature + "::" + normalizedBand
      ),
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

      earnSignature: computeHash(
        nextPattern + "::" + lineageSignature + "::" + normalizedBand
      ),
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

  // Structural write of evolved Earn state into CoreMemory via Earn adapter.
  writeCoreMemoryEarn(coreMemoryField.memoryKey, evolved.coreMemoryField);

  return evolved;
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
