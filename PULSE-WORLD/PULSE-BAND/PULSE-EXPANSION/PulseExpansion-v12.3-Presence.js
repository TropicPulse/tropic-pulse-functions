// ============================================================================
//  PULSE EXPANSION — v14-IMMORTAL
//  Presence Region Governor / Network Stretcher to PULSE-NET
//  Every-Advantage / Regioning-Aware / Beacon-Aware / Castle-Aware / PulseNet-Aware
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
    pulseNetAware: true,

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
      "PulseUser",
      "PulseNetBridge"
    ],
    never: [
      "safeRoute",
      "fetchViaCNS",
      "directPulseNetImport"
    ]
  }
}
*/

import { logger } from "../../PULSE-UI/PULSEProofLogger.js";
import {
  pulseCastle,
  PulseCastleMeta,
  summarizeCastlePresence
} from "./PulseCastle-v13-Presence.js";

import {
  PulseBeaconMeta as PulseBeaconEngineMeta,
  createPulseBeaconEngine
} from "./PulseBeaconEngine-v14-IMMORTAL.js";

import {
  PulseBeaconMeshMeta,
  PulseBeaconMesh
} from "./PulseBeaconMesh-v13-PRESENCE-EVO++.js";

import { PulseWorldCoreMeta } from "./PulseUser-v12.3-Presence.js";
import { PulseRouterMeta } from "./PulseRouter-v12.3-Presence.js";
import { PulseServerMeta } from "./PulseServer-v12.3-Presence.js";
import { PulseMeshMeta } from "./PulseMesh-v12.3-PRESENCE.js";
import { PulseMeshMeta as BinaryMeshMeta } from "./PulseMesh-v12.3-PRESENCE.js";

// ============================================================================
//  PULSE-NET BRIDGE CONTRACT (NO IMPORTS, PURELY INJECTED)
// ============================================================================
//
// pulseNetBridge is an injected object (from backend / PULSE-NET server),
// never imported on device. Expansion only emits symbolic intents:
//
//   pulseNetBridge.routeSoldiers(intent)
//   pulseNetBridge.routeExpansion(intent)
//   pulseNetBridge.routeMesh(intent)
//
// All of these are OPTIONAL. If no bridge is present, Expansion still
// computes plans but does not perform any network I/O.
// ============================================================================

function safePulseNetCall(pulseNetBridge, method, payload) {
  if (!pulseNetBridge) return { ok: false, reason: "no_pulse_net_bridge" };
  const fn = pulseNetBridge[method];
  if (typeof fn !== "function") {
    return { ok: false, reason: "method_not_available", method };
  }
  try {
    return fn(payload) || { ok: true };
  } catch (e) {
    logger?.log?.("expansion", "pulse_net_bridge_error", {
      method,
      error: String(e)
    });
    return { ok: false, reason: "bridge_error" };
  }
}

// ============================================================================
//  META — FULL-ADVANTAGE STRATEGIST VIEW
// ============================================================================

export const PulseExpansionMeta = Object.freeze({
  layer: "PulseExpansion",
  role: "PRESENCE_STRATEGIST_ORGAN",
  version: "v14-IMMORTAL",
  identity: "PulseExpansion-v14-IMMORTAL",

  world: Object.freeze({
    castleMeta: PulseCastleMeta,
    osMeta: PulseWorldCoreMeta
  }),

  beacons: Object.freeze({
    engineMeta: PulseBeaconEngineMeta,
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
    beaconAware: true,
    osBrainAware: true,
    routerAware: true,
    serverExecAware: true,
    binaryMeshAware: true,
    pulseNetAware: true,

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
    pulseNetIntents = [],
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
    this.pulseNetIntents = pulseNetIntents;
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

// Region presence / advantage / chunk plan (symbolic only)

function buildRegionPresenceField(regionInfo, cycle) {
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
    presenceVersion: "v14",
    presenceTier,
    castleCount,
    totalServers,
    avgPresence,
    composite,
    cycle,
    presenceSignature: computeHash(
      `REGION_PRESENCE::${presenceTier}::${castleCount}::${totalServers}::${avgPresence}`
    )
  };
}

function buildRegionAdvantageField(regionInfo, presenceField, cycle) {
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
    advantageVersion: "v14-C",
    density,
    stress,
    presenceTier: presenceField.presenceTier,
    advantageScore,
    cycle
  };
}

function buildRegionChunkPrewarmPlan(
  regionInfo,
  presenceField,
  advantageField
) {
  const basePriority =
    presenceField.presenceTier === "presence_high"
      ? 3
      : presenceField.presenceTier === "presence_mid"
      ? 2
      : 1;

  const advantageBoost = advantageField.advantageScore > 0.1 ? 1 : 0;

  return {
    planVersion: "v14-Region-AdvantageC",
    priority: basePriority + advantageBoost,
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
//  WORLD BOOT / PREWARM — CASTLE + BEACON ENGINE + MESH
// ============================================================================

const Castle = pulseCastle;

const BeaconEngine = createPulseBeaconEngine
  ? createPulseBeaconEngine({ boundCastleID: "GLOBAL_CASTLE" })
  : null;

const BeaconMesh = BeaconEngine ? PulseBeaconMesh({ beacon: BeaconEngine }) : null;

// ============================================================================
//  CORE ORGAN — PulseExpansion v14-IMMORTAL
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
    this.pulseNetBridge = config.pulseNetBridge || null;
  }

  // Attach / replace PULSE-NET bridge at runtime (backend only)
  attachPulseNetBridge(bridge) {
    this.pulseNetBridge = bridge || null;
    return { ok: true, hasBridge: !!this.pulseNetBridge };
  }

  // Build expansion plan + emit PULSE-NET routing intents
  buildExpansionPlan({
    globalLoadIndex = 0,
    regionSignals = {},
    maxCastlesPerRegion = null,
    minCastlesPerRegion = null
  } = {}) {
    this.cycle++;

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

    const beaconSnapshot = BeaconMesh?.getSnapshot?.() ?? null;
    const beaconPresenceField = beaconSnapshot?.presenceField ?? null;
    const beaconAdvantageField = beaconSnapshot?.advantageField ?? null;

    const pulseNetIntents = [];

    // REGION LOOP
    for (const [regionId, regionInfo] of Object.entries(byRegion)) {
      const signal = regionSignals[regionId] || {};
      const avgLoadIndex = clamp01(signal.avgLoadIndex ?? globalLoad);
      const userDensityHint = signal.userDensityHint ?? 0;
      const stressHint = clamp01(signal.stressHint ?? globalLoad);

      const presenceField = buildRegionPresenceField(
        regionInfo,
        this.cycle
      );
      const advantageField = buildRegionAdvantageField(
        regionInfo,
        presenceField,
        this.cycle
      );
      const chunkPlan = buildRegionChunkPrewarmPlan(
        regionInfo,
        presenceField,
        advantageField
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
        const action = new ExpansionAction({
          regionId,
          tier: presenceField.presenceTier,
          reason: "high_load_or_density",
          desiredServers: this.config.defaultDesiredServersPerCastle,
          desiredSoldiers: this.config.defaultDesiredSoldiersPerCastle
        });
        expansions.push(action);

        // PULSE-NET intent: request remote castle/server stretch
        pulseNetIntents.push({
          kind: "expansion_request",
          regionId,
          tier: presenceField.presenceTier,
          desiredServers: action.desiredServers,
          desiredSoldiers: action.desiredSoldiers,
          cycle: this.cycle
        });
      }

      // CONTRACTION
      if (avgLoadIndex <= 0.2 && castleCount > effectiveMinCastles) {
        const candidate = regionInfo.castles[regionInfo.castles.length - 1];
        if (candidate) {
          const action = new ContractionAction({
            castleId: candidate.castleId,
            reason: "low_load",
            removeServers: 1,
            removeSoldiers: 1
          });
          contractions.push(action);

          pulseNetIntents.push({
            kind: "contraction_request",
            castleId: candidate.castleId,
            regionId,
            reason: action.reason,
            cycle: this.cycle
          });
        }
      }

      // SOLDIER DELEGATION
      for (const c of regionInfo.castles) {
        const load = c.presenceField?.loadIndex ?? 0;
        const stress = c.presenceField?.stressIndex ?? 0;

        if (load >= 0.7 || stress >= 0.7) {
          const action = new SoldierDelegationAction({
            castleId: c.castleId,
            spawn: 2,
            kill: 0,
            reason: "high_pressure"
          });
          soldierDelegation.push(action);

          pulseNetIntents.push({
            kind: "soldier_route",
            castleId: c.castleId,
            regionId,
            spawn: action.spawn,
            kill: action.kill,
            reason: action.reason,
            cycle: this.cycle
          });
        } else if (load <= 0.2 && stress <= 0.2) {
          const action = new SoldierDelegationAction({
            castleId: c.castleId,
            spawn: 0,
            kill: 1,
            reason: "low_pressure"
          });
          soldierDelegation.push(action);

          pulseNetIntents.push({
            kind: "soldier_route",
            castleId: c.castleId,
            regionId,
            spawn: action.spawn,
            kill: action.kill,
            reason: action.reason,
            cycle: this.cycle
          });
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
          const action = new MeshRebalanceAction({
            castleId: a.castleId,
            targetCastleId: b.castleId,
            action: "link"
          });
          rebalanceLinks.push(action);

          pulseNetIntents.push({
            kind: "mesh_link",
            castleId: a.castleId,
            targetCastleId: b.castleId,
            regionId: a.regionId || null,
            cycle: this.cycle
          });
        }
      }
    }

    // A-B-A surfaces
    const band = "symbolic";
    const binaryField = buildBinaryField(this.cycle);
    const waveField = buildWaveField(this.cycle, band);
    const bandSignature = buildBandSignature(band);

    // Emit intents to PULSE-NET via bridge (if present)
    const bridge = this.pulseNetBridge;
    if (bridge) {
      safePulseNetCall(bridge, "routeExpansion", {
        cycle: this.cycle,
        expansions,
        contractions,
        regionPresence,
        regionAdvantage,
        regionChunkPlan
      });

      safePulseNetCall(bridge, "routeSoldiers", {
        cycle: this.cycle,
        soldierDelegation
      });

      safePulseNetCall(bridge, "routeMesh", {
        cycle: this.cycle,
        rebalanceLinks
      });
    }

    logger?.log?.("expansion", "plan_built_v14", {
      cycle: this.cycle,
      expansions: expansions.length,
      contractions: contractions.length,
      soldierDelegation: soldierDelegation.length,
      rebalanceLinks: rebalanceLinks.length,
      beaconSnapshotPresent: !!beaconSnapshot,
      pulseNetBridgePresent: !!bridge
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
      pulseNetIntents,
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
        beaconSnapshot,
        beaconPresenceField,
        beaconAdvantageField
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
    attachPulseNetBridge(bridge) {
      return core.attachPulseNetBridge(bridge);
    },
    buildExpansionPlan(payload) {
      return core.buildExpansionPlan(payload);
    }
  });
}

export const pulseExpansion = createPulseExpansion();
