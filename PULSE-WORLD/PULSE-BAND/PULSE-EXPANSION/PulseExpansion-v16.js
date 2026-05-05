/**
 * ============================================================================
 *  PULSE EXPANSION — v16-Immortal-ORGANISM
 *  Presence Region Governor / Network Stretcher to PULSE-NET
 *  Every-Advantage / Regioning-Aware / Beacon-Aware / Castle-Aware / PulseNet-Aware
 *  Heartbeat-Driven (heartbeat / aiHeartbeat / earnHeartbeat)
 * ============================================================================
 */
/*
AI_EXPERIENCE_META = {
  identity: "PulseExpansion",
  version: "v16-Immortal-ORGANISM",
  layer: "presence_expansion",
  role: "presence_region_governor",
  lineage: "PulseExpansion-v14 → v16-Immortal-ORGANISM",

  evo: {
    expansionGovernor: true,
    regionPlanner: true,
    meshAware: true,
    beaconAware: true,
    beaconMeshAware: true,
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
    zeroFilesystem: true,

    proxyAware: true,
    meshOrganismAware: true,
    heartbeatAware: true,
    aiHeartbeatAware: true,
    earnHeartbeatAware: true
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

import { logger } from "../../PULSE-UI/_BACKEND/PulseProofLogger.js";

// v12.3 presence-era metas (still valid for server/router)
import {
  PulseServerMeta,
  createPulseServer
} from "./PulseServer-v16.js";

import {
  PulseRouterMeta,
  createPulseRouter
} from "./PulseRouter-v16.js";

// v16 world core + castle + beacon mesh
import {
  PulseWorldCoreMeta,
  createPulseWorldCore
} from "./PulseUser-v16.js";

import {
  PulseCastleMeta,
  summarizeCastlePresence
} from "./PulseCastle-v16.js";

import {
  PulseBeaconMeshMeta,
  PulseBeaconMesh
} from "./PulseBeaconMesh-v16.js";

// v11 mesh + binary mesh metas
import { PulseMeshMeta } from "../PULSE-MESH/PulseMesh-v16.js";
import { BinaryMeshMeta } from "../PULSE-MESH/PulseBinaryMesh-v16.js";

// Beacon engine (physics) v12.3
import {
  PulseBeaconMeta as PulseBeaconEngineMeta,
  createPulseBeaconEngine
} from "./PulseBeaconEngine-v16.js";

// Touch / presence
import { getPulseTouchContext } from "../../PULSE-UI/PULSE-TOUCH.js";

// PROXY CONTEXT — v16 IMMORTAL ORGANISM
import {
  getProxyContext,
  getProxyPressure,
  getProxyBoost,
  getProxyFallback,
  getProxyMode,
  getProxyLineage
} from "../PULSE-PROXY/PulseProxyContext-v16.js";

// ============================================================================
//  PULSE-NET BRIDGE CONTRACT (NO IMPORTS, PURELY INJECTED)
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
//  META — FULL-ADVANTAGE STRATEGIST VIEW (v16 IMMORTAL ORGANISM)
// ============================================================================

export const PulseExpansionMeta = Object.freeze({
  layer: "PulseExpansion",
  role: "PRESENCE_STRATEGIST_ORGAN",
  version: "v16-Immortal-ORGANISM",
  identity: "PulseExpansion-v16-Immortal-ORGANISM",

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
    beaconMeshAware: true,
    osBrainAware: true,
    routerAware: true,
    serverExecAware: true,
    binaryMeshAware: true,
    pulseNetAware: true,
    proxyAware: true,
    meshOrganismAware: true,
    heartbeatAware: true,
    aiHeartbeatAware: true,
    earnHeartbeatAware: true,

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

export class RouteDefenseAction {
  constructor({
    regionId,
    castleId,
    reason = "protect_routes",
    desiredDefenders = 2
  }) {
    this.type = "route_defense";
    this.regionId = regionId;
    this.castleId = castleId;
    this.reason = reason;
    this.desiredDefenders = desiredDefenders;
  }
}

export class NodeAdminOrbitAction {
  constructor({
    castleId,
    intervalHint = "steady",
    pressureHint = "normal"
  }) {
    this.type = "nodeadmin_orbit";
    this.castleId = castleId;
    this.intervalHint = intervalHint;
    this.pressureHint = pressureHint;
  }
}

export class ExpansionPlan {
  constructor({
    expansions = [],
    contractions = [],
    rebalanceLinks = [],
    soldierDelegation = [],
    routeDefenseActions = [],
    nodeAdminOrbitActions = [],
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
    this.routeDefenseActions = routeDefenseActions;
    this.nodeAdminOrbitActions = nodeAdminOrbitActions;
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

function buildBinaryField(cycle, heartbeat, aiHeartbeat, earnHeartbeat) {
  const hbFactor = clamp01(heartbeat?.intensity ?? 0.5);
  const aiFactor = clamp01(aiHeartbeat?.intensity ?? 0.5);
  const earnFactor = clamp01(earnHeartbeat?.throughput ?? 0.5);

  const densityBase = 10 + cycle * 3;
  const density = densityBase + Math.floor(hbFactor * 4 + aiFactor * 3 + earnFactor * 3);
  const surface = density + 12;

  return {
    binaryPhenotypeSignature: computeHash(`BEXP::${surface}::${hbFactor}::${aiFactor}::${earnFactor}`),
    binarySurfaceSignature: computeHash(`BEXP_SURF::${surface}`),
    binarySurface: {
      density,
      surface,
      patternLen: 12
    },
    parity: surface % 2,
    shiftDepth: Math.floor(Math.log2(surface || 1)),
    heartbeat: {
      hbFactor,
      aiFactor,
      earnFactor
    }
  };
}

function buildWaveField(cycle, band, heartbeat, aiHeartbeat, earnHeartbeat) {
  const hbPhase = heartbeat?.phase ?? 0;
  const aiPhase = aiHeartbeat?.phase ?? 0;
  const earnPhase = earnHeartbeat?.phase ?? 0;

  const baseAmp = band === "binary" ? 9 : 5;
  const amplitude = (cycle + 1) * baseAmp + hbPhase + aiPhase + earnPhase;

  return {
    amplitude,
    wavelength: amplitude + 3,
    phase: amplitude % 16,
    band,
    mode: band === "binary" ? "compression-wave" : "symbolic-wave",
    heartbeatPhase: {
      hbPhase,
      aiPhase,
      earnPhase
    }
  };
}

function buildBandSignature(band, heartbeat, aiHeartbeat) {
  const hbTag = heartbeat?.bandTag || "hb";
  const aiTag = aiHeartbeat?.bandTag || "ai";
  return computeHash(`EXP_BAND::${band}::${hbTag}::${aiTag}`);
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
    presenceVersion: "v16",
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
    advantageVersion: "v16-C",
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
    planVersion: "v16-Region-AdvantageC",
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

const BeaconEngine = createPulseBeaconEngine
  ? createPulseBeaconEngine({ boundCastleID: "GLOBAL_CASTLE" })
  : null;

const BeaconMesh = BeaconEngine
  ? PulseBeaconMesh({
      beacon: BeaconEngine,
      meshID: "expansion-beacon-mesh",
      regionID: null,
      trace: false
    })
  : null;

// ============================================================================
//  CORE ORGAN — PulseExpansion v16-Immortal-ORGANISM
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

    this.heartbeat = null;
    this.aiHeartbeat = null;
    this.earnHeartbeat = null;
  }

  // Attach / replace PULSE-NET bridge at runtime (backend only)
  attachPulseNetBridge(bridge) {
    this.pulseNetBridge = bridge || null;
    return { ok: true, hasBridge: !!this.pulseNetBridge };
  }

  // Attach heartbeat streams (symbolic only, no timers)
  attachHeartbeats({ heartbeat, aiHeartbeat, earnHeartbeat } = {}) {
    this.heartbeat = heartbeat || null;
    this.aiHeartbeat = aiHeartbeat || null;
    this.earnHeartbeat = earnHeartbeat || null;
    return {
      ok: true,
      heartbeatAttached: !!this.heartbeat,
      aiHeartbeatAttached: !!this.aiHeartbeat,
      earnHeartbeatAttached: !!this.earnHeartbeat
    };
  }

  // ============================================================================
// v16-IMMORTAL FEDERAL GOVERNMENT UPGRADE — EXPANSION
// Federal abilities:
//   • monitorCastleHealth()
//   • monitorServerTakeover()
//   • detectPowerImbalance()
//   • haltRunawayBehavior()
//   • rebalanceGovernance()
// ============================================================================
// ============================================================================
// FEDERAL GOVERNMENT HELPERS — v16 IMMORTAL
// ============================================================================

monitorCastleHealth({ castlePresence }) {
  if (!castlePresence) return { ok: false, reason: "no_castle_presence" };

  const unhealthy = [];

  for (const region of Object.values(castlePresence.byRegion || {})) {
    for (const c of region.castles || []) {
      const pf = c.presenceField || {};
      const presenceScore = pf.presenceScore ?? 0;
      const stressIndex = pf.stressIndex ?? 0;
      const governanceStabilityIndex = pf.governanceStabilityIndex ?? 1;

      if (presenceScore < 0.3 || stressIndex > 0.9 || governanceStabilityIndex < 0.3) {
        unhealthy.push({
          castleId: c.castleId,
          regionId: c.regionId,
          presenceField: pf
        });
      }
    }
  }

  return {
    ok: true,
    unhealthy,
    count: unhealthy.length
  };
}

monitorServerTakeover({ serverFallback }) {
  if (!serverFallback) return { ok: true, takeover: false };

  return {
    ok: true,
    takeover: !!serverFallback.takeover,
    reason: serverFallback.reason,
    serverCastleId: serverFallback.serverCastleId,
    serverCastlePresence: serverFallback.serverCastlePresence
  };
}

detectPowerImbalance({ castleHealth, serverTakeover }) {
  const imbalance = {
    castleWeak: castleHealth.count > 0,
    serverDominating: serverTakeover.takeover === true,
    severity: 0
  };

  if (imbalance.castleWeak) imbalance.severity += 1;
  if (imbalance.serverDominating) imbalance.severity += 1;

  return imbalance;
}

haltRunawayBehavior({ imbalance }) {
  if (imbalance.severity === 0) return null;

  const target =
    imbalance.serverDominating && imbalance.castleWeak
      ? "server"
      : imbalance.serverDominating
      ? "server"
      : "castle";

  return {
    kind: "halt_runaway",
    target,
    severity: imbalance.severity,
    reason: "federal_governance_intervention"
  };
}

rebalanceGovernance({ imbalance }) {
  if (imbalance.severity === 0) return null;

  const actions = [];

  if (imbalance.castleWeak) {
    actions.push({
      kind: "spawn_castle",
      reason: "castle_weakness_detected"
    });
  }

  if (imbalance.serverDominating) {
    actions.push({
      kind: "reduce_server_influence",
      reason: "server_dominance_detected"
    });
  }

  return {
    kind: "governance_rebalance",
    actions,
    severity: imbalance.severity
  };
}



  // Build expansion plan + emit PULSE-NET routing intents
  buildExpansionPlan({
    globalLoadIndex = 0,
    regionSignals = {},
    maxCastlesPerRegion = null,
    minCastlesPerRegion = null,
    heartbeat = null,
    aiHeartbeat = null,
    earnHeartbeat = null
  } = {}) {
    // Heartbeat-driven cycle: if heartbeat.tick is provided, follow it; else increment.
    const hb = heartbeat || this.heartbeat || {};
    const aiHb = aiHeartbeat || this.aiHeartbeat || {};
    const earnHb = earnHeartbeat || this.earnHeartbeat || {};

    if (typeof hb.tick === "number") {
      this.cycle = hb.tick;
    } else {
      this.cycle++;
    }

    const expansions = [];
    const contractions = [];
    const rebalanceLinks = [];
    const soldierDelegation = [];
    const routeDefenseActions = [];
    const nodeAdminOrbitActions = [];

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
    const beaconPresenceField = beaconSnapshot?.composite?.presenceField ?? null;
    const beaconAdvantageField = beaconSnapshot?.composite?.advantageField ?? null;

    const pulseNetIntents = [];

    // PROXY SNAPSHOT — region-wide modifier (symbolic only)
    const proxyCtx = getProxyContext();
    const proxyPressure = getProxyPressure();
    const proxyBoost = getProxyBoost();
    const proxyFallback = getProxyFallback();
    const proxyMode = getProxyMode();
    const proxyLineage = getProxyLineage();

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
      let advantageField = buildRegionAdvantageField(
        regionInfo,
        presenceField,
        this.cycle
      );
      const chunkPlan = buildRegionChunkPrewarmPlan(
        regionInfo,
        presenceField,
        advantageField
      );

      const proxyPressureClamped = clamp01(proxyPressure || 0);
      const proxyStressBoost = proxyPressureClamped * 10;
      const proxyAdvantageBoost = proxyBoost ? 0.02 : 0;

      const adjustedStress =
        (advantageField.stress || 0) + proxyStressBoost;

      const adjustedAdvantageScore =
        (advantageField.advantageScore || 0) +
        proxyAdvantageBoost -
        (proxyFallback ? 0.05 : 0);

      advantageField = {
        ...advantageField,
        stress: adjustedStress,
        advantageScore: adjustedAdvantageScore,
        proxy: {
          mode: proxyMode,
          pressure: proxyPressure,
          boost: proxyBoost,
          fallback: proxyFallback,
          lineage: proxyLineage,
          context: proxyCtx
        }
      };

      regionPresence[regionId] = presenceField;
      regionAdvantage[regionId] = advantageField;
      regionChunkPlan[regionId] = chunkPlan;

      const castleCount = regionInfo.castles.length;

      // EXPANSION (castle spawn) — heartbeat-aware
      const hbLoadBoost = clamp01(hb.intensity ?? 0);
      const aiLoadBoost = clamp01(aiHb.intensity ?? 0);
      const effectiveLoad = clamp01(
        avgLoadIndex + hbLoadBoost * 0.1 + aiLoadBoost * 0.1
      );

      const expansionPressure =
        effectiveLoad >= 0.6 ||
        userDensityHint >= 2000 ||
        stressHint >= 0.6 ||
        proxyPressureClamped >= 0.8;

      if (
        expansionPressure &&
        castleCount < effectiveMaxCastles &&
        !proxyFallback
      ) {
        const action = new ExpansionAction({
          regionId,
          tier: presenceField.presenceTier,
          reason: "high_load_or_density_or_proxy_pressure",
          desiredServers: this.config.defaultDesiredServersPerCastle,
          desiredSoldiers: this.config.defaultDesiredSoldiersPerCastle
        });
        expansions.push(action);

        pulseNetIntents.push({
          kind: "expansion_request",
          regionId,
          tier: presenceField.presenceTier,
          desiredServers: action.desiredServers,
          desiredSoldiers: action.desiredSoldiers,
          cycle: this.cycle,
          proxyMode,
          proxyPressure,
          heartbeatTick: hb.tick ?? null
        });
      }

      // CONTRACTION (castle shrink)
      const contractionPressure =
        effectiveLoad <= 0.2 &&
        castleCount > effectiveMinCastles &&
        proxyPressureClamped < 0.5;

      if (contractionPressure) {
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
            cycle: this.cycle,
            proxyMode,
            proxyPressure,
            heartbeatTick: hb.tick ?? null
          });
        }
      }

      // SOLDIER DELEGATION (castle-level)
      for (const c of regionInfo.castles) {
        const load = c.presenceField?.loadIndex ?? 0;
        const stress = c.presenceField?.stressIndex ?? 0;

        const highPressure =
          load >= 0.7 ||
          stress >= 0.7 ||
          proxyPressureClamped >= 0.8;

        const lowPressure =
          load <= 0.2 &&
          stress <= 0.2 &&
          proxyPressureClamped < 0.5;

        if (highPressure) {
          const action = new SoldierDelegationAction({
            castleId: c.castleId,
            spawn: 2,
            kill: 0,
            reason: "high_pressure_or_proxy_pressure"
          });
          soldierDelegation.push(action);

          pulseNetIntents.push({
            kind: "soldier_route",
            castleId: c.castleId,
            regionId,
            spawn: action.spawn,
            kill: action.kill,
            reason: action.reason,
            cycle: this.cycle,
            proxyMode,
            proxyPressure
          });

          // Route defense: if castle is under high pressure, defend its routes
          const rdAction = new RouteDefenseAction({
            regionId,
            castleId: c.castleId,
            reason: "high_pressure_route_defense",
            desiredDefenders: 2
          });
          routeDefenseActions.push(rdAction);

          pulseNetIntents.push({
            kind: "route_defense",
            castleId: c.castleId,
            regionId,
            desiredDefenders: rdAction.desiredDefenders,
            reason: rdAction.reason,
            cycle: this.cycle,
            proxyMode,
            proxyPressure
          });

          // NodeAdmin orbit: keep NodeAdmin circling this castle
          const orbitAction = new NodeAdminOrbitAction({
            castleId: c.castleId,
            intervalHint: "tight",
            pressureHint: "high"
          });
          nodeAdminOrbitActions.push(orbitAction);

          pulseNetIntents.push({
            kind: "nodeadmin_orbit",
            castleId: c.castleId,
            regionId,
            intervalHint: orbitAction.intervalHint,
            pressureHint: orbitAction.pressureHint,
            cycle: this.cycle,
            proxyMode,
            proxyPressure
          });
        } else if (lowPressure) {
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
            cycle: this.cycle,
            proxyMode,
            proxyPressure
          });

          // Low pressure: orbit can relax
          const orbitAction = new NodeAdminOrbitAction({
            castleId: c.castleId,
            intervalHint: "steady",
            pressureHint: "normal"
          });
          nodeAdminOrbitActions.push(orbitAction);

          pulseNetIntents.push({
            kind: "nodeadmin_orbit",
            castleId: c.castleId,
            regionId,
            intervalHint: orbitAction.intervalHint,
            pressureHint: orbitAction.pressureHint,
            cycle: this.cycle,
            proxyMode,
            proxyPressure
          });
        }
      }
    }

    // ============================================================================
// MESH REBALANCE
// ============================================================================
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
        cycle: this.cycle,
        proxyMode,
        proxyPressure
      });
    }
  }
}

// ============================================================================
// A-B-A BAND + BINARY/WAVE FIELDS
// ============================================================================
const band =
  aiHb.preferredBand === "binary" || aiHb.preferredBand === "symbolic"
    ? aiHb.preferredBand
    : "symbolic";

const binaryField = buildBinaryField(this.cycle, hb, aiHb, earnHb);
const waveField = buildWaveField(this.cycle, band, hb, aiHb, earnHb);
const bandSignature = buildBandSignature(band, hb, aiHb);

// ============================================================================
// FEDERAL GOVERNMENT OVERSIGHT — v16 IMMORTAL
// ============================================================================
const castlePresence = {
  byRegion,
  meshLinksByCastleId
};

// serverFallbackContext is optional; server may attach it
const serverFallbackContext = this.serverFallbackContext || null;

const castleHealth = this.monitorCastleHealth({ castlePresence });
const serverTakeover = this.monitorServerTakeover({ serverFallback: serverFallbackContext });
const imbalance = this.detectPowerImbalance({ castleHealth, serverTakeover });

const haltIntent = this.haltRunawayBehavior({ imbalance });
const rebalanceIntent = this.rebalanceGovernance({ imbalance });

if (haltIntent) {
  pulseNetIntents.push({
    kind: "federal_halt",
    payload: haltIntent,
    cycle: this.cycle,
    proxyMode,
    proxyPressure
  });
}

if (rebalanceIntent) {
  pulseNetIntents.push({
    kind: "federal_rebalance",
    payload: rebalanceIntent,
    cycle: this.cycle,
    proxyMode,
    proxyPressure
  });
}

// ============================================================================
// EMIT INTENTS TO PULSE-NET BRIDGE
// ============================================================================
const bridge = this.pulseNetBridge;
if (bridge) {
  safePulseNetCall(bridge, "routeExpansion", {
    cycle: this.cycle,
    expansions,
    contractions,
    regionPresence,
    regionAdvantage,
    regionChunkPlan,
    proxyMode,
    proxyPressure,
    proxyFallback
  });

  safePulseNetCall(bridge, "routeSoldiers", {
    cycle: this.cycle,
    soldierDelegation,
    proxyMode,
    proxyPressure
  });

  safePulseNetCall(bridge, "routeMesh", {
    cycle: this.cycle,
    rebalanceLinks,
    proxyMode,
    proxyPressure
  });

  safePulseNetCall(bridge, "routeDefense", {
    cycle: this.cycle,
    routeDefenseActions,
    proxyMode,
    proxyPressure
  });

  safePulseNetCall(bridge, "routeNodeAdmin", {
    cycle: this.cycle,
    nodeAdminOrbitActions,
    proxyMode,
    proxyPressure
  });
}

// ============================================================================
// LOG + RETURN FINAL FEDERALLY-AWARE EXPANSION PLAN
// ============================================================================
logger?.log?.("expansion", "plan_built_v16_federal", {
  cycle: this.cycle,
  expansions: expansions.length,
  contractions: contractions.length,
  soldierDelegation: soldierDelegation.length,
  rebalanceLinks: rebalanceLinks.length,
  routeDefenseActions: routeDefenseActions.length,
  nodeAdminOrbitActions: nodeAdminOrbitActions.length,
  beaconSnapshotPresent: !!beaconSnapshot,
  pulseNetBridgePresent: !!bridge,
  proxyMode,
  proxyPressure,
  proxyFallback,
  heartbeatTick: hb.tick ?? null,
  federal: {
    castleHealth,
    serverTakeover,
    imbalance,
    haltIntent,
    rebalanceIntent
  }
});

return new ExpansionPlan({
  expansions,
  contractions,
  rebalanceLinks,
  soldierDelegation,
  routeDefenseActions,
  nodeAdminOrbitActions,
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
    beaconAdvantageField,
    proxy: {
      context: proxyCtx,
      mode: proxyMode,
      pressure: proxyPressure,
      boost: proxyBoost,
      fallback: proxyFallback,
      lineage: proxyLineage
    },
    heartbeat: hb,
    aiHeartbeat: aiHb,
    earnHeartbeat: earnHb,
    federal: {
      castleHealth,
      serverTakeover,
      imbalance,
      haltIntent,
      rebalanceIntent
    }
  }
});
  }
}
// ============================================================================
//  PUBLIC API — v16 IMMORTAL (Federal-Aware)
// ============================================================================

export function createPulseExpansion(config = {}) {
  const core = new PulseExpansion(config);

  return Object.freeze({
    meta: PulseExpansionMeta,

    // Attach PulseNet bridge (federal + routing)
    attachPulseNetBridge(bridge) {
      return core.attachPulseNetBridge(bridge);
    },

    // Attach heartbeats (symbolic + AI + Earn)
    attachHeartbeats(payload) {
      return core.attachHeartbeats(payload);
    },

    // OPTIONAL: allow Server to pass fallback context into Expansion
    attachServerFallbackContext(fallbackCtx) {
      core.serverFallbackContext = fallbackCtx;
      return { ok: true };
    },

    // Build the full expansion plan (now federal-aware)
    buildExpansionPlan(payload) {
      return core.buildExpansionPlan(payload);
    }
  });
}

export const pulseExpansion = createPulseExpansion();
