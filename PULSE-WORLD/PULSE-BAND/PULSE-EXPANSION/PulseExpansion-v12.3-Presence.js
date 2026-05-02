// ============================================================================
//  PULSE EXPANSION — v13-PRESENCE-EVO+
//  B‑Tier Presence Strategist (Region Governor)
//  Every‑Advantage / Regioning‑Physics‑Aware / Beacon‑Aware / OS‑Aware
// ============================================================================
/*
AI_EXPERIENCE_META = {
  identity: "PulseExpansion",
  version: "v14-IMMORTAL",
  layer: "presence_expansion",
  role: "presence_region_governor",
  lineage: "PulsePresence-v14",

  evo: {
    expansionGovernor: true,
    regionPlanner: true,
    meshAware: true,
    beaconAware: true,
    castleAware: true,
    serverAware: true,
    userAware: true,

    symbolicPrimary: true,
    binaryAware: true,
    dualBand: true,

    deterministic: true,
    driftProof: true,
    zeroMutationOfInput: true,
    zeroNetwork: true,
    zeroFilesystem: true
  },

  contract: {
    always: [
      "PulseBeaconEngine",
      "PulseBeaconMesh",
      "PulseCastle",
      "PulseRouter",
      "PulseServer",
      "PulseUser"
    ],
    never: [
      "safeRoute",
      "fetchViaCNS"
    ]
  }
}
*/

import { logger } from "../../PULSE-UI/PULSEProofLogger.js";
import {
  pulseCastle,
  PulseCastleMeta,
  summarizeCastlePresence,
  createCastleServer
} from "./PulseCastle-v12.3-Presence.js";

// ============================================================================
//  BEACONS (ENGINE + MESH) — v13-PRESENCE-EVO+
// ============================================================================
import {
  PulseBeaconMeta as PulseBeaconEngineMeta,
  createPulseBeaconEngine
} from "./PulseBeaconEngine-v12.3-Presence.js";
import {
  PulseBeaconMeshMeta,
  PulseBeaconMesh
} from "./PulseBeaconMesh-v12.3-Presence.js";

// ============================================================================
//  OS / ROUTER / SERVER / MESH META (READ-ONLY VISIBILITY)
//  - Expansion never calls into these; it only carries their meta forward.
// ============================================================================
import { PulseWorldCoreMeta } from "./PulseUser-v12.3-Presence.js";
import { PulseRouterMeta } from "./PulseRouter-v12.3-Presence.js";
import { PulseServerMeta } from "./PulseServer-v12.3-Presence.js";
import { PulseMeshMeta } from "./PulseMesh-v12.3-PRESENCE.js";
import { PulseMeshMeta as BinaryMeshMeta } from "./PulseMesh-v12.3-PRESENCE.js";

// ============================================================================
//  REGIONING PHYSICS BARREL — v13-EVO-PRESENCE-MAX
//  (NOW ACTUALLY USED)
// ============================================================================

// --- DELTA ENGINE -----------------------------------------------------------
import * as DeltaEngineCosmosMultiverse from "../PULSE-REGIONING/DeltaEngine-CoreMemoryIntegration-v1.js";
import * as DeltaEngineEvo from "../PULSE-REGIONING/DeltaEngine-v11-Evo.js";

// --- DEPLOYMENT PHYSICS -----------------------------------------------------
import * as DeploymentPhysicsCoreMemory from "../PULSE-REGIONING/DeploymentPhysics-CoreMemoryIntegration-v1.js";
import * as DeploymentPhysicsEvo from "../PULSE-REGIONING/DeploymentPhysics-v11-Evo.js";

// --- EXECUTION PHYSICS ------------------------------------------------------
import * as ExecutionPhysicsCoreMemory from "../PULSE-REGIONING/ExecutionPhysics-CoreMemoryIntegration-v1.js";
import * as ExecutionPhysicsEvo from "../PULSE-REGIONING/ExecutionPhysics-v11-Evo.js";

// --- LINEAGE ENGINE ---------------------------------------------------------
import * as LineageEngineCoreMemory from "../PULSE-REGIONING/LineageEngine-CoreMemoryIntegration-v1.js";
import * as LineageEngineEvo from "../PULSE-REGIONING/LineageEngine-v11-Evo.js";

// --- MULTI-ORGANISM SUPPORT -------------------------------------------------
import * as MultiOrganismSupportCoreMemory from "../PULSE-REGIONING/MultiOrganismSupport-CoreMemoryIntegration-v1.js";
import * as MultiOrganismSupportEvo from "../PULSE-REGIONING/MultiOrganismSupport-v11-Evo.js";

// --- REGIONING PHYSICS ------------------------------------------------------
import * as RegioningPhysicsCoreMemory from "../PULSE-REGIONING/RegioningPhysics-CoreMemoryIntegration-v1.js";
import * as RegioningPhysicsEvo from "../PULSE-REGIONING/RegioningPhysics-v11-Evo.js";

// --- REGION MESH ROUTING ----------------------------------------------------
import * as RegionMeshRoutingCoreMemory from "../PULSE-REGIONING/RegionMeshRouting-CoreMemoryIntegration-v1.js";
import * as RegionMeshRoutingEvo from "../PULSE-REGIONING/RegionMeshRouting-v11-Evo.js";

// --- SNAPSHOT PHYSICS -------------------------------------------------------
import * as SnapshotPhysicsCoreMemory from "../PULSE-REGIONING/SnapshotPhysics-CoreMemoryIntegration-v1.js";
import * as SnapshotPhysicsEvo from "../PULSE-REGIONING/SnapshotPhysics-v11-Evo.js";

// ============================================================================
//  REGIONING PHYSICS INTEGRATION BLOCK (v13)
// ============================================================================
function buildRegioningPhysicsSignature() {
  const keys = [
    ...Object.keys(DeltaEngineCosmosMultiverse),
    ...Object.keys(DeltaEngineEvo),
    ...Object.keys(DeploymentPhysicsCoreMemory),
    ...Object.keys(DeploymentPhysicsEvo),
    ...Object.keys(ExecutionPhysicsCoreMemory),
    ...Object.keys(ExecutionPhysicsEvo),
    ...Object.keys(LineageEngineCoreMemory),
    ...Object.keys(LineageEngineEvo),
    ...Object.keys(MultiOrganismSupportCoreMemory),
    ...Object.keys(MultiOrganismSupportEvo),
    ...Object.keys(RegioningPhysicsCoreMemory),
    ...Object.keys(RegioningPhysicsEvo),
    ...Object.keys(RegionMeshRoutingCoreMemory),
    ...Object.keys(RegionMeshRoutingEvo),
    ...Object.keys(SnapshotPhysicsCoreMemory),
    ...Object.keys(SnapshotPhysicsEvo)
  ]
    .sort()
    .join("|");

  let h = 0;
  for (let i = 0; i < keys.length; i++) {
    h = (h + keys.charCodeAt(i) * (i + 1)) % 100000;
  }
  return `REGIONING_PHYSICS_SIG::${h}`;
}

// ============================================================================
//  WORLD BOOT / PREWARM — CASTLE + BEACON ENGINE + MESH
//  (SERVER/USER ARE INSIDE CASTLE; EXPANSION ONLY OBSERVES)
// ============================================================================
const Castle = createCastleServer ? createCastleServer() : pulseCastle;

const BeaconEngine = createPulseBeaconEngine
  ? createPulseBeaconEngine({ castle: Castle })
  : null;

const BeaconMesh = BeaconEngine ? PulseBeaconMesh({ beacon: BeaconEngine }) : null;

// ============================================================================
//  META — FULL-ADVANTAGE STRATEGIST VIEW
// ============================================================================
export const PulseExpansionMeta = Object.freeze({
  layer: "PulseExpansion",
  role: "PRESENCE_STRATEGIST_ORGAN",
  version: "v13-PRESENCE-EVO+",
  identity: "PulseExpansion-v13-PRESENCE-EVO+",

  world: Object.freeze({
    castle: Castle,
    castleMeta: PulseCastleMeta,
    osMeta: PulseWorldCoreMeta
  }),

  beacons: Object.freeze({
    engineMeta: BeaconEngine?.meta ?? PulseBeaconEngineMeta ?? null,
    meshMeta: PulseBeaconMeshMeta
  }),

  connectivity: Object.freeze({
    meshMeta: PulseMeshMeta,
    binaryMeshMeta: BinaryMeshMeta,
    routerMeta: PulseRouterMeta
  }),

  server: Object.freeze({
    pulseServerMeta: PulseServerMeta
  }),

  physics: Object.freeze({
    DeltaEngineCosmosMultiverse,
    DeltaEngineEvo,
    DeploymentPhysicsCoreMemory,
    DeploymentPhysicsEvo,
    ExecutionPhysicsCoreMemory,
    ExecutionPhysicsEvo,
    LineageEngineCoreMemory,
    LineageEngineEvo,
    MultiOrganismSupportCoreMemory,
    MultiOrganismSupportEvo,
    RegioningPhysicsCoreMemory,
    RegioningPhysicsEvo,
    RegionMeshRoutingCoreMemory,
    RegionMeshRoutingEvo,
    SnapshotPhysicsCoreMemory,
    SnapshotPhysicsEvo
  }),

  guarantees: Object.freeze({
    deterministic: true,
    driftProof: true,
    multiRegionReady: true,
    multiCastleReady: true,
    meshAware: true,
    presenceFieldAware: true,
    advantageAware: true,
    chunkPrewarmAware: true,
    soldierAware: true,
    treasuryAware: true,
    capacitySignalAware: true,
    stressSignalAware: true,
    regioningPhysicsAware: true,
    beaconAware: true,
    osBrainAware: true,
    routerAware: true,
    serverExecAware: true,
    binaryMeshAware: true,

    zeroRandomness: true,
    zeroDynamicImports: true,
    zeroEval: true,
    zeroNetworkFetch: true,
    zeroAI: true,
    zeroRouting: true,
    zeroComputeMath: true
  })
});

// ============================================================================
//  TYPES
// ============================================================================
export class ExpansionAction {
  constructor({
    regionId,
    hostHint = null,
    tier = "normal",
    reason = "capacity",
    desiredServers = 1,
    desiredSoldiers = 0
  }) {
    this.type = "expand";
    this.regionId = regionId;
    this.hostHint = hostHint;
    this.tier = tier;
    this.reason = reason;
    this.desiredServers = desiredServers;
    this.desiredSoldiers = desiredSoldiers;
  }
}

export class ContractionAction {
  constructor({
    castleId,
    reason = "low_load",
    removeServers = 1,
    removeSoldiers = 0
  }) {
    this.type = "contract";
    this.castleId = castleId;
    this.reason = reason;
    this.removeServers = removeServers;
    this.removeSoldiers = removeSoldiers;
  }
}

export class SoldierDelegationAction {
  constructor({
    castleId,
    spawn = 0,
    kill = 0,
    reason = "presence_adjustment"
  }) {
    this.type = "soldier_delegation";
    this.castleId = castleId;
    this.spawn = spawn;
    this.kill = kill;
    this.reason = reason;
  }
}

export class MeshRebalanceAction {
  constructor({ castleId, targetCastleId, action = "link" }) {
    this.type = "mesh_rebalance";
    this.castleId = castleId;
    this.targetCastleId = targetCastleId;
    this.action = action;
  }
}

export class ExpansionPlan {
  constructor({
    expansions = [],
    contractions = [],
    rebalanceLinks = [],
    soldierDelegation = [],
    regionPresence = {},
    regionAdvantage = {},
    regionChunkPlan = {},
    bandSignature = null,
    binaryField = null,
    waveField = null,
    meta = {}
  }) {
    this.expansions = expansions;
    this.contractions = contractions;
    this.rebalanceLinks = rebalanceLinks;
    this.soldierDelegation = soldierDelegation;
    this.regionPresence = regionPresence;
    this.regionAdvantage = regionAdvantage;
    this.regionChunkPlan = regionChunkPlan;
    this.bandSignature = bandSignature;
    this.binaryField = binaryField;
    this.waveField = waveField;
    this.meta = meta;
  }
}

// ============================================================================
//  INTERNAL HELPERS
// ============================================================================
function clamp01(x) {
  if (x == null || Number.isNaN(x)) return 0;
  return Math.max(0, Math.min(1, x));
}

function computeHash(str) {
  let h = 0;
  const s = String(str || "");
  for (let i = 0; i < s.length; i++) {
    h = (h + s.charCodeAt(i) * (i + 1)) % 100000;
  }
  return `h${h}`;
}

function buildBinaryField(cycle) {
  const density = 10 + cycle * 3;
  const surface = density + 12;
  return {
    binaryPhenotypeSignature: computeHash(`BEXP::${surface}`),
    binarySurfaceSignature: computeHash(`BEXP_SURF::${surface}`),
    binarySurface: { density, surface, patternLen: 12 },
    parity: surface % 2,
    shiftDepth: Math.floor(Math.log2(surface || 1))
  };
}

function buildWaveField(cycle, band) {
  const amplitude = (cycle + 1) * (band === "binary" ? 9 : 5);
  return {
    amplitude,
    wavelength: amplitude + 3,
    phase: amplitude % 16,
    band,
    mode: band === "binary" ? "compression-wave" : "symbolic-wave"
  };
}

function buildBandSignature(band) {
  return computeHash(`EXP_BAND::${band}`);
}

// ============================================================================
//  REGION PRESENCE / ADVANTAGE / CHUNK PLAN
// ============================================================================
function buildRegionPresenceField(regionInfo, cycle, physicsSig) {
  const castleCount = regionInfo.castles.length;
  const totalServers = regionInfo.totalServers;
  const avgPresence =
    regionInfo.castles.reduce(
      (a, c) => a + (c.presenceField?.presenceScore || 0),
      0
    ) / Math.max(1, castleCount);

  const composite =
    castleCount * 0.01 + totalServers * 0.005 + avgPresence * 0.02;

  const presenceTier =
    composite >= 0.5
      ? "presence_high"
      : composite >= 0.2
      ? "presence_mid"
      : "presence_low";

  return {
    presenceVersion: "v13",
    presenceTier,
    castleCount,
    totalServers,
    avgPresence,
    composite,
    cycle,
    physicsSig,
    presenceSignature: computeHash(
      `REGION_PRESENCE::${presenceTier}::${castleCount}::${totalServers}::${avgPresence}::${physicsSig}`
    )
  };
}

function buildRegionAdvantageField(regionInfo, presenceField, cycle, physicsSig) {
  const density = regionInfo.castles.length;
  const stress = regionInfo.castles.reduce(
    (a, c) => a + (c.presenceField?.stressIndex || 0),
    0
  );

  const advantageScore =
    density * 0.01 +
    stress * 0.005 +
    (presenceField.presenceTier === "presence_high" ? 0.1 : 0);

  return {
    advantageVersion: "v13-C",
    density,
    stress,
    presenceTier: presenceField.presenceTier,
    advantageScore,
    cycle,
    physicsSig
  };
}

function buildRegionChunkPrewarmPlan(
  regionInfo,
  presenceField,
  advantageField,
  physicsSig
) {
  const basePriority =
    presenceField.presenceTier === "presence_high"
      ? 3
      : presenceField.presenceTier === "presence_mid"
      ? 2
      : 1;

  const advantageBoost = advantageField.advantageScore > 0.1 ? 1 : 0;

  return {
    planVersion: "v13-Region-AdvantageC",
    priority: basePriority + advantageBoost,
    physicsSig,
    chunks: {
      castleEnvelope: true,
      serverEnvelope: true,
      soldierEnvelope: true
    },
    cache: {
      regionPresence: true,
      regionAdvantage: true
    },
    prewarm: {
      castleSpawn: true,
      serverSpawn: true,
      soldierSpawn: true
    }
  };
}

// ============================================================================
//  CORE ORGAN — PulseExpansion
// ============================================================================
export class PulseExpansion {
  constructor(config = {}) {
    this.config = {
      defaultMaxCastlesPerRegion: 8,
      defaultMinCastlesPerRegion: 1,
      defaultDesiredServersPerCastle: 1,
      defaultDesiredSoldiersPerCastle: 3,
      ...config
    };
    this.cycle = 0;
  }

  buildExpansionPlan({
    globalLoadIndex = 0,
    regionSignals = {},
    maxCastlesPerRegion = null,
    minCastlesPerRegion = null
  } = {}) {
    this.cycle++;

    const physicsSig = buildRegioningPhysicsSignature();

    const expansions = [];
    const contractions = [];
    const rebalanceLinks = [];
    const soldierDelegation = [];

    const { byRegion, meshLinksByCastleId } = summarizeCastlePresence();

    const effectiveMaxCastles =
      typeof maxCastlesPerRegion === "number" && maxCastlesPerRegion > 0
        ? maxCastlesPerRegion
        : this.config.defaultMaxCastlesPerRegion;

    const effectiveMinCastles =
      typeof minCastlesPerRegion === "number" && minCastlesPerRegion >= 0
        ? minCastlesPerRegion
        : this.config.defaultMinCastlesPerRegion;

    const globalLoad = clamp01(globalLoadIndex);

    const regionPresence = {};
    const regionAdvantage = {};
    const regionChunkPlan = {};

    // Optional: beacon snapshot (presence/advantage/mesh view)
    const beaconSnapshot = BeaconMesh?.getSnapshot?.() ?? null;
    const beaconPresenceField = beaconSnapshot?.presenceField ?? null;
    const beaconAdvantageField = beaconSnapshot?.advantageField ?? null;

    // REGION LOOP
    for (const [regionId, regionInfo] of Object.entries(byRegion)) {
      const signal = regionSignals[regionId] || {};
      const avgLoadIndex = clamp01(signal.avgLoadIndex ?? globalLoad);
      const userDensityHint = signal.userDensityHint ?? 0;
      const stressHint = clamp01(signal.stressHint ?? globalLoad);

      const presenceField = buildRegionPresenceField(
        regionInfo,
        this.cycle,
        physicsSig
      );
      const advantageField = buildRegionAdvantageField(
        regionInfo,
        presenceField,
        this.cycle,
        physicsSig
      );
      const chunkPlan = buildRegionChunkPrewarmPlan(
        regionInfo,
        presenceField,
        advantageField,
        physicsSig
      );

      regionPresence[regionId] = presenceField;
      regionAdvantage[regionId] = advantageField;
      regionChunkPlan[regionId] = chunkPlan;

      const castleCount = regionInfo.castles.length;

      // EXPANSION
      if (
        (avgLoadIndex >= 0.6 ||
          userDensityHint >= 2000 ||
          stressHint >= 0.6) &&
        castleCount < effectiveMaxCastles
      ) {
        expansions.push(
          new ExpansionAction({
            regionId,
            tier: presenceField.presenceTier,
            reason: "high_load_or_density",
            desiredServers: this.config.defaultDesiredServersPerCastle,
            desiredSoldiers: this.config.defaultDesiredSoldiersPerCastle
          })
        );
      }

      // CONTRACTION
      if (avgLoadIndex <= 0.2 && castleCount > effectiveMinCastles) {
        const candidate = regionInfo.castles[regionInfo.castles.length - 1];
        if (candidate) {
          contractions.push(
            new ContractionAction({
              castleId: candidate.castleId,
              reason: "low_load",
              removeServers: 1,
              removeSoldiers: 1
            })
          );
        }
      }

      // SOLDIER DELEGATION
      for (const c of regionInfo.castles) {
        const load = c.presenceField?.loadIndex ?? 0;
        const stress = c.presenceField?.stressIndex ?? 0;

        if (load >= 0.7 || stress >= 0.7) {
          soldierDelegation.push(
            new SoldierDelegationAction({
              castleId: c.castleId,
              spawn: 2,
              kill: 0,
              reason: "high_pressure"
            })
          );
        } else if (load <= 0.2 && stress <= 0.2) {
          soldierDelegation.push(
            new SoldierDelegationAction({
              castleId: c.castleId,
              spawn: 0,
              kill: 1,
              reason: "low_pressure"
            })
          );
        }
      }
    }

    // MESH REBALANCE
    for (const [, regionInfo] of Object.entries(byRegion)) {
      const castles = regionInfo.castles;
      if (castles.length <= 1) continue;

      for (let i = 0; i < castles.length; i++) {
        const a = castles[i];
        const links = meshLinksByCastleId[a.castleId] || new Set();
        if (links.size === 0) {
          const b = castles[(i + 1) % castles.length];
          rebalanceLinks.push(
            new MeshRebalanceAction({
              castleId: a.castleId,
              targetCastleId: b.castleId,
              action: "link"
            })
          );
        }
      }
    }

    // A‑B‑A surfaces
    const band = "symbolic";
    const binaryField = buildBinaryField(this.cycle);
    const waveField = buildWaveField(this.cycle, band);
    const bandSignature = buildBandSignature(band);

    logger?.log?.("expansion", "plan_built", {
      cycle: this.cycle,
      expansions: expansions.length,
      contractions: contractions.length,
      soldierDelegation: soldierDelegation.length,
      rebalanceLinks: rebalanceLinks.length,
      physicsSig,
      beaconSnapshotPresent: !!beaconSnapshot
    });

    return new ExpansionPlan({
      expansions,
      contractions,
      rebalanceLinks,
      soldierDelegation,
      regionPresence,
      regionAdvantage,
      regionChunkPlan,
      bandSignature,
      binaryField,
      waveField,
      meta: {
        expansionMeta: PulseExpansionMeta,
        castleMeta: PulseCastleMeta,
        beaconEngineMeta: BeaconEngine?.meta ?? PulseBeaconEngineMeta ?? null,
        beaconMeshMeta: PulseBeaconMeshMeta,
        routerMeta: PulseRouterMeta,
        serverMeta: PulseServerMeta,
        meshMeta: PulseMeshMeta,
        binaryMeshMeta: BinaryMeshMeta,
        osMeta: PulseWorldCoreMeta,
        physicsSig,
        beaconSnapshot,
        beaconPresenceField,
        beaconAdvantageField,
        regioningPhysics: {
          DeltaEngineCosmosMultiverse,
          DeltaEngineEvo,
          DeploymentPhysicsCoreMemory,
          DeploymentPhysicsEvo,
          ExecutionPhysicsCoreMemory,
          ExecutionPhysicsEvo,
          LineageEngineCoreMemory,
          LineageEngineEvo,
          MultiOrganismSupportCoreMemory,
          MultiOrganismSupportEvo,
          RegioningPhysicsCoreMemory,
          RegioningPhysicsEvo,
          RegionMeshRoutingCoreMemory,
          RegionMeshRoutingEvo,
          SnapshotPhysicsCoreMemory,
          SnapshotPhysicsEvo
        }
      }
    });
  }
}

// ============================================================================
//  PUBLIC API
// ============================================================================
export function createPulseExpansion(config = {}) {
  const core = new PulseExpansion(config);
  return Object.freeze({
    meta: PulseExpansionMeta,
    buildExpansionPlan(payload) {
      return core.buildExpansionPlan(payload);
    }
  });
}

export const pulseExpansion = createPulseExpansion();
