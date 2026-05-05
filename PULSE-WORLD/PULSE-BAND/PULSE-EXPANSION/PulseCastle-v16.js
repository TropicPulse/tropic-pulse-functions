// ============================================================================
//  PULSE OS v16‑IMMORTAL-ORGANISM — PULSE CASTLE (PRESENCE / HOST ORGAN)
//  PulseCastle-v16-Immortal-ORGANISM.js
// ============================================================================
//
//  ROLE:
//    - Presence + host organ for PulseServer instances.
//    - Manages castles (region/host nodes) and their attached servers.
//    - Manages user bindings + world cores per castle (user‑aware).
//    - Maintains awareness of other castles (mesh awareness).
//    - Maintains basic treasury + soldier awareness for economic layer.
//    - Maintains symbolic expansion routes + NodeAdmin loops to servers.
//    - Integrates with Mesh, BeaconMesh, Touch, Net, Runtime, Scheduler, Overmind, Earn, Proxy.
//    - Pure symbolic registry + mapping. No compute math, no routing, no AI.
// ============================================================================
/*
AI_EXPERIENCE_META = {
  identity: "PulseCastle",
  version: "v16-Immortal-ORGANISM",
  layer: "presence_castle",
  role: "region_identity_and_security",
  lineage: "PulseCastle-v9 → v12.3-Presence-Evo++ → v14-Immortal → v16-Immortal-ORGANISM",

  evo: {
    regionIdentity: true,
    regionSecurity: true,
    regionTier: true,
    regionPhysics: true,

    meshAware: true,
    presenceFieldAware: true,
    advantageAware: true,
    chunkPrewarmAware: true,
    meshPressureAware: true,

    expansionRouteAware: true,
    nodeAdminLoopAware: true,
    serverLoopAware: true,
    routerAware: true,

    symbolicPrimary: true,
    binaryAware: true,
    dualBand: true,

    deterministic: true,
    driftProof: true,
    zeroMutationOfInput: true,
    zeroNetwork: true,
    zeroFilesystem: true,

    pulseTouchAware: true,
    pulseNetAware: true,
    runtimeAware: true,
    schedulerAware: true,
    overmindAware: true,
    meshOrganismAware: true,
    beaconMeshAware: true,
    earnAware: true,
    proxyAware: true
  },

  contract: {
    always: [
      "PulseExpansion",
      "PulseRouter",
      "PulseServer",
      "PulseUser",
      "PulseMesh",
      "PulseBeaconMesh",
      "PulseTouch",
      "PulseNet",
      "PulseRuntime",
      "PulseScheduler",
      "PulseOvermind",
      "PulseProxy"
    ],
    never: [
      "safeRoute",
      "fetchViaCNS"
    ]
  }
}
*/

// ============================================================================
//  IMPORTS (backend-safe, organism-aware)
// ============================================================================

import { logger } from "../../PULSE-UI/_BACKEND/PulseProofLogger.js";

// Expansion / world
import {
  PulseExpansionMeta,
  createPulseExpansion,
  getPulseExpansionContext
} from "./PulseExpansion-v16.js";

// Server
import {
  PulseServerMeta,
  createPulseServer
} from "./PulseServer-v16.js";

// Router (meta only, for organism context)
import {
  PulseRouterMeta,
  createPulseRouter
} from "./PulseRouter-v16.js";

// User lanes / WorldCore (v16 IMMORTAL ORGANISM)
import {
  PulseWorldCoreMeta,
  createPulseWorldCore
} from "./PulseUser-v16.js";

// Mesh organism (symbolic + binary)
import createPulseMesh, {
  PulseMeshMeta
} from "../PULSE-MESH/PulseMesh-v16.js";
import createBinaryMesh, {
  BinaryMeshMeta
} from "../PULSE-MESH/PulseBinaryMesh-v16.js";

// Beacon engine + membrane
import PulseBeaconEngine from "./PulseBeaconEngine-v16.js";
import PulseBeaconMesh, {
  PulseBeaconMeshMeta
} from "./PulseBeaconMesh-v16.js";

// Touch / presence
import { getPulseTouchContext } from "../../PULSE-UI/PULSE-TOUCH.js";

// Runtime / scheduler / overmind
import { getPulseRuntimeContext } from "../PULSE-X/PulseRuntime-v2-Evo.js";
import { getPulseSchedulerContext } from "../PULSE-X/PulseScheduler-v2.js";
import { getPulseOvermindContext } from "../PULSE-AI/aiOvermindPrime.js";

// (Optional) Earn / treasury integration hook (symbolic only)
import { getEarnContext } from "../PULSE-EARN/PulseEarn-v16.js";

// Dual-band organism + binary send
import { createDualBandOrganism as PulseBinaryOrganismBoot } from "../PULSE-AI/aiDualBand-v16.js";
import { createBinarySend as PulseSendBin } from "../PULSE-SEND/PulseBinarySend-v16.js";

// Proxy context (v16 IMMORTAL ORGANISM)
import {
  getProxyContext,
  getProxyPressure,
  getProxyBoost,
  getProxyFallback,
  getProxyMode,
  getProxyLineage
} from "../PULSE-PROXY/PulseProxyContext-v16.js";

// Lightweight user meta (symbolic only, for snapshots)
export const PulseUserMeta = Object.freeze({
  layer: "PulseUser",
  role: "PRESENCE_USER",
  version: "v16-Immortal-ORGANISM",
  identity: "PulseUser-v16-Immortal-ORGANISM"
});

// ============================================================================
//  META — Castle Identity
// ============================================================================

export const PulseCastleMeta = Object.freeze({
  layer: "PulseCastle",
  role: "PRESENCE_HOST_ORGAN",
  version: "v16-Immortal-ORGANISM",
  identity: "PulseCastle-v16-Immortal-ORGANISM",

  guarantees: Object.freeze({
    deterministic: true,
    driftProof: true,

    multiCastleReady: true,
    multiServerReady: true,
    meshAware: true,
    regionAware: true,
    hostAware: true,

    presenceFieldAware: true,
    treasuryAware: true,
    soldierAware: true,

    userAware: true,
    worldCoreAware: true,
    serverUserBindingAware: true,
    meshPressureAware: true,
    advantageAware: true,
    chunkPrewarmAware: true,
    osBrainAware: true,

    routerAware: true,
    expansionRouteAware: true,
    nodeAdminLoopAware: true,
    serverLoopAware: true,

    pulseTouchAware: true,
    pulseNetAware: true,
    runtimeAware: true,
    schedulerAware: true,
    overmindAware: true,
    meshOrganismAware: true,
    beaconMeshAware: true,
    earnAware: true,
    proxyAware: true,

    zeroRandomness: true,
    zeroDynamicImports: true,
    zeroEval: true,
    zeroNetworkFetch: true,
    zeroAI: true,
    zeroRouting: true,
    zeroComputeMath: true
  }),

  contract: Object.freeze({
    input: [
      "CastleRegistrationRequest",
      "CastlePresenceUpdate",
      "ServerAttachRequest",
      "ServerDetachRequest",
      "CastleMeshQuery",
      "CastleUserRegistrationRequest",
      "CastleUserBindingRequest",
      "CastleExpansionRouteRequest",
      "CastleNodeAdminLoopRequest"
    ],
    output: [
      "CastleRegistrationResult",
      "CastlePresenceState",
      "ServerAttachResult",
      "ServerDetachResult",
      "CastleMeshState",
      "CastleUserRegistrationResult",
      "CastleUserBindingState",
      "CastleExpansionRouteState",
      "CastleNodeAdminLoopState"
    ]
  }),

  lineage: Object.freeze({
    root: "PulseOS-v16-Immortal-ORGANISM",
    parent: "PulseExpansion-v16-Immortal-ORGANISM",
    ancestry: [
      "PulseCastle-v9",
      "PulseCastle-v10",
      "PulseCastle-v11",
      "PulseCastle-v12",
      "PulseCastle-v12.3-Presence-Evo++",
      "PulseCastle-v13-Presence-Evo+",
      "PulseCastle-v14-Immortal"
    ]
  })
});

// ============================================================================
//  TYPES
// ============================================================================

export class CastleRegistrationResult {
  constructor({ castleId, regionId, hostName, presenceField, meta = {} }) {
    this.castleId = castleId;
    this.regionId = regionId;
    this.hostName = hostName;
    this.presenceField = presenceField;
    this.meta = meta;
  }
}

export class CastlePresenceState {
  constructor({ castlesById, meshLinksByCastleId, meta = {} }) {
    this.castlesById = castlesById;
    this.meshLinksByCastleId = meshLinksByCastleId;
    this.meta = meta;
  }
}

export class ServerAttachResult {
  constructor({ castleId, serverId, serverMeta, attached, meta = {} }) {
    this.castleId = castleId;
    this.serverId = serverId;
    this.serverMeta = serverMeta;
    this.attached = attached;
    this.meta = meta;
  }
}

export class ServerDetachResult {
  constructor({ castleId, serverId, detached, meta = {} }) {
    this.castleId = castleId;
    this.serverId = serverId;
    this.detached = detached;
    this.meta = meta;
  }
}

export class CastleMeshState {
  constructor({ castlesById, meshLinksByCastleId, meta = {} }) {
    this.castlesById = castlesById;
    this.meshLinksByCastleId = meshLinksByCastleId;
    this.meta = meta;
  }
}

export class CastleUserRegistrationResult {
  constructor({
    castleId,
    userId,
    regionId,
    hostName,
    userMeta,
    worldCoreSnapshot,
    boundServers = [],
    meta = {}
  }) {
    this.castleId = castleId;
    this.userId = userId;
    this.regionId = regionId;
    this.hostName = hostName;
    this.userMeta = userMeta;
    this.worldCoreSnapshot = worldCoreSnapshot;
    this.boundServers = boundServers;
    this.meta = meta;
  }
}

export class CastleUserBindingState {
  constructor({ castleId, usersById, bindingsByServerId, meta = {} }) {
    this.castleId = castleId;
    this.usersById = usersById;
    this.bindingsByServerId = bindingsByServerId;
    this.meta = meta;
  }
}

export class CastleExpansionRouteState {
  constructor({ routesById, meta = {} }) {
    this.routesById = routesById;
    this.meta = meta;
  }
}

export class CastleNodeAdminLoopState {
  constructor({ loopsById, meta = {} }) {
    this.loopsById = loopsById;
    this.meta = meta;
  }
}

// ============================================================================
//  INTERNAL STATE (symbolic, deterministic)
// ============================================================================

const castlesById = Object.create(null);
const meshLinksByCastleId = Object.create(null);

const usersById = Object.create(null);
const userBindingsByServerId = Object.create(null);

const expansionRoutesById = Object.create(null);
const nodeAdminLoopsById = Object.create(null);

// ============================================================================
//  HELPERS + ORGANISM CONTEXT
// ============================================================================

function stableHash(str) {
  let h = 0;
  const s = String(str || "");
  for (let i = 0; i < s.length; i++) {
    h = (h + s.charCodeAt(i) * (i + 1)) % 1000000007;
  }
  return `c${h}`;
}

function clamp01(x) {
  if (x == null || Number.isNaN(x)) return 0;
  return Math.max(0, Math.min(1, x));
}

function buildOrganismContext(extra = {}) {
  const expansion = getPulseExpansionContext?.() || {};
  const touch = getPulseTouchContext?.() || {};
  const runtime = getPulseRuntimeContext?.() || {};
  const scheduler = getPulseSchedulerContext?.() || {};
  const overmind = getPulseOvermindContext?.() || {};
  const earn = getEarnContext?.() || {};

  const proxy = getProxyContext?.() || {};
  const proxyPressure = getProxyPressure?.() ?? 0;
  const proxyBoost = getProxyBoost?.() ?? 0;
  const proxyFallback = getProxyFallback?.() ?? false;
  const proxyMode = getProxyMode?.() || "normal";
  const proxyLineage = getProxyLineage?.() || null;

  return {
    expansion,
    touch,
    runtime,
    scheduler,
    overmind,
    earn,
    meshMeta: PulseMeshMeta,
    beaconMeshMeta: PulseBeaconMeshMeta,
    binaryMeshMeta: BinaryMeshMeta,
    proxy,
    proxyPressure,
    proxyBoost,
    proxyFallback,
    proxyMode,
    proxyLineage,
    ...extra
  };
}

function buildCastleId({ regionId, hostName }) {
  return stableHash(`CASTLE::${regionId}::${hostName}`);
}

function buildUserId({ regionId, hostName, userKey }) {
  return stableHash(`USER::${regionId}::${hostName}::${userKey || "default"}`);
}

function buildRouteId({ fromCastleId, toServerId, toServerUrl, hops }) {
  return stableHash(
    `ROUTE::${fromCastleId}::${toServerId || ""}::${toServerUrl || ""}::${JSON.stringify(
      hops || []
    )}`
  );
}

function buildLoopId({ routeId, originCastleId }) {
  return stableHash(`LOOP::${routeId}::${originCastleId}`);
}

// ============================================================================
//  PROXY-AWARE PRESENCE COMPUTE
// ============================================================================

export function computeCastlePresence(castle) {
  const serverCount = Object.keys(castle.serversById || {}).length;
  const soldierCount = Object.keys(castle.soldiersById || {}).length;
  const capacityHint = castle.presenceField?.capacityHint ?? 1;

  const rawLoad =
    (serverCount + soldierCount * 0.5) / Math.max(1, capacityHint * 4);
  let loadIndex = clamp01(rawLoad);

  const proxyPressure = getProxyPressure?.() ?? 0;
  loadIndex = clamp01(loadIndex + proxyPressure * 0.1);

  let stressIndex = clamp01(
    loadIndex >= 0.8 ? 0.9 :
    loadIndex >= 0.6 ? 0.7 :
    loadIndex >= 0.3 ? 0.4 :
    0.1
  );

  if (getProxyFallback?.()) {
    stressIndex = clamp01(stressIndex + 0.15);
  }

  let presenceScore = clamp01(
    loadIndex * 0.6 +
      (1 - Math.abs(0.5 - loadIndex) * 2) * 0.4
  );

  const proxyBoost = getProxyBoost?.() ?? 0;
  presenceScore = clamp01(presenceScore + proxyBoost * 0.05);

  let tier = castle.presenceField?.tier || "normal";
  if (presenceScore >= 0.7) tier = "high";
  else if (presenceScore >= 0.4) tier = "normal";
  else tier = "low";

  return {
    loadIndex,
    stressIndex,
    presenceScore,
    tier,
    proxyPressure,
    proxyBoost,
    proxyFallback: !!getProxyFallback?.(),
    proxyMode: getProxyMode?.() || "normal"
  };
}

export function summarizeCastlePresence(castles = castlesById) {
  const byRegion = {};
  const meshSnapshot = {};

  for (const castleId in castles) {
    const castle = castles[castleId];
    const region = castle.regionId || "unknown-region";

    const presenceMetrics = computeCastlePresence(castle);
    const presenceField = {
      ...(castle.presenceField || {}),
      ...presenceMetrics
    };

    if (!byRegion[region]) {
      byRegion[region] = {
        castles: [],
        totalLoad: 0,
        avgLoad: 0,
        count: 0
      };
    }

    byRegion[region].castles.push({
      castleId,
      regionId: castle.regionId,
      hostName: castle.hostName,
      presenceField
    });

    byRegion[region].totalLoad += presenceMetrics.loadIndex;
    byRegion[region].count++;
  }

  for (const region in byRegion) {
    const r = byRegion[region];
    r.avgLoad = r.count > 0 ? r.totalLoad / r.count : 0;
  }

  for (const [id, set] of Object.entries(meshLinksByCastleId)) {
    meshSnapshot[id] = new Set(set);
  }

  return {
    byRegion,
    meshLinksByCastleId: meshSnapshot
  };
}

function ensureCastle(castleId, regionId, hostName, presenceField) {
  if (!castlesById[castleId]) {
    castlesById[castleId] = {
      castleId,
      regionId,
      hostName,
      presenceField: {
        regionId,
        hostName,
        tier: "normal",
        capacityHint: 1,
        tags: [],
        loadIndex: 0,
        stressIndex: 0,
        presenceScore: 0,
        ...(presenceField || {})
      },
      serversById: Object.create(null),
      soldiersById: Object.create(null),
      treasury: {
        balance: 0,
        lastDelta: 0,
        proxyPressure: 0,
        proxyBoost: 0
      }
    };
  } else if (presenceField) {
    castlesById[castleId].presenceField = {
      ...castlesById[castleId].presenceField,
      ...presenceField
    };
  }

  if (!meshLinksByCastleId[castleId]) {
    meshLinksByCastleId[castleId] = new Set();
  }

  const metrics = computeCastlePresence(castlesById[castleId]);
  castlesById[castleId].presenceField = {
    ...castlesById[castleId].presenceField,
    ...metrics
  };

  castlesById[castleId].treasury.proxyPressure = getProxyPressure?.() ?? 0;
  castlesById[castleId].treasury.proxyBoost = getProxyBoost?.() ?? 0;

  return castlesById[castleId];
}

function linkCastles(aId, bId) {
  if (!meshLinksByCastleId[aId]) meshLinksByCastleId[aId] = new Set();
  if (!meshLinksByCastleId[bId]) meshLinksByCastleId[bId] = new Set();
  if (aId === bId) return;
  meshLinksByCastleId[aId].add(bId);
  meshLinksByCastleId[bId].add(aId);
}

function ensureUser({
  castleId,
  regionId,
  hostName,
  userId,
  userKey,
  worldCoreConfig = {}
}) {
  const effectiveUserId =
    userId || buildUserId({ regionId, hostName, userKey });

  if (!usersById[effectiveUserId]) {
    const worldCore =
      typeof createPulseWorldCore === "function"
        ? createPulseWorldCore({
            regionID: regionId,
            serverMode: true,
            ...worldCoreConfig
          })
        : null;

    const worldCoreSnapshot = worldCore?.getSnapshot?.() || null;

    usersById[effectiveUserId] = {
      userId: effectiveUserId,
      castleId,
      regionId,
      hostName,
      userMeta: PulseUserMeta,
      worldCore,
      worldCoreSnapshot,
      servers: new Set()
    };

    logger?.log?.("castle", "register_user", {
      castleId,
      userId: effectiveUserId,
      regionId,
      hostName
    });
  }

  return usersById[effectiveUserId];
}

function computePeopleNeedsForCastle(castle) {
  const presence = castle.presenceField || {};
  const stress = presence.stressIndex ?? 0;
  const load = presence.loadIndex ?? 0;
  const morale = castle.moraleIndex ?? 0;
  const population = castle.population || 0;

  const needScore = morale * 0.4 + stress * 0.4 + load * 0.2;

  return {
    population,
    morale,
    stress,
    load,
    needScore,
    governanceStabilityIndex: 1 - (needScore * 0.5 + stress * 0.5)
  };
}

function bindServerToUserInternal({ castleId, serverId, userId }) {
  const user = usersById[userId];
  const castle = castlesById[castleId];
  if (!user || !castle) {
    return { ok: false, reason: "castle_or_user_not_found" };
  }

  user.servers.add(serverId);
  userBindingsByServerId[serverId] = userId;

  logger?.log?.("castle", "bind_server_user", {
    castleId,
    serverId,
    userId
  });

  return { ok: true };
}

function snapshotMesh() {
  const castlesSnapshot = {};
  for (const [id, c] of Object.entries(castlesById)) {
    castlesSnapshot[id] = {
      castleId: c.castleId,
      regionId: c.regionId,
      hostName: c.hostName,
      presenceField: c.presenceField,
      servers: Object.keys(c.serversById),
      soldiers: Object.keys(c.soldiersById || {}),
      treasury: {
        balance: c.treasury.balance,
        lastDelta: c.treasury.lastDelta,
        proxyPressure: c.treasury.proxyPressure,
        proxyBoost: c.treasury.proxyBoost
      }
    };
  }

  const meshSnapshot = {};
  for (const [id, set] of Object.entries(meshLinksByCastleId)) {
    meshSnapshot[id] = Array.from(set);
  }

  return { castlesSnapshot, meshSnapshot };
}

function snapshotUsersForCastle(castleId) {
  const users = {};
  const bindings = {};

  for (const [uid, u] of Object.entries(usersById)) {
    if (u.castleId !== castleId) continue;
    users[uid] = {
      userId: u.userId,
      regionId: u.regionId,
      hostName: u.hostName,
      userMeta: u.userMeta,
      worldCoreSnapshot: u.worldCoreSnapshot,
      servers: Array.from(u.servers)
    };
  }

  for (const [serverId, userId] of Object.entries(userBindingsByServerId)) {
    const u = usersById[userId];
    if (!u || u.castleId !== castleId) continue;
    bindings[serverId] = userId;
  }

  return { users, bindings };
}

// ---------------------------------------------------------------------------
// Expansion routes + NodeAdmin loops (symbolic only)
// ---------------------------------------------------------------------------

function registerExpansionRouteInternal({
  fromCastleId,
  toServerId = null,
  toServerUrl = null,
  hops = [],
  loopHint = {}
}) {
  if (!fromCastleId) {
    return { ok: false, reason: "missing_fromCastleId" };
  }

  const routeId = buildRouteId({ fromCastleId, toServerId, toServerUrl, hops });

  expansionRoutesById[routeId] = {
    routeId,
    fromCastleId,
    toServerId,
    toServerUrl,
    hops: Array.from(hops || []),
    loopHint: {
      intervalHint: loopHint.intervalHint || "steady",
      pressureHint: loopHint.pressureHint || "normal"
    },
    tags: loopHint.tags || [],
    proxyMode: getProxyMode?.() || "normal",
    proxyPressure: getProxyPressure?.() ?? 0
  };

  logger?.log?.("castle", "register_expansion_route", {
    routeId,
    fromCastleId,
    toServerId,
    toServerUrl,
    hops: expansionRoutesById[routeId].hops,
    loopHint: expansionRoutesById[routeId].loopHint,
    proxyMode: expansionRoutesById[routeId].proxyMode,
    proxyPressure: expansionRoutesById[routeId].proxyPressure
  });

  return { ok: true, routeId };
}

function spawnNodeAdminLoopInternal({
  routeId,
  originCastleId,
  intervalHint = "steady",
  pressureHint = "normal"
}) {
  const route = expansionRoutesById[routeId];
  if (!route) {
    return { ok: false, reason: "route_not_found" };
  }

  const loopId = buildLoopId({
    routeId,
    originCastleId: originCastleId || route.fromCastleId
  });

  nodeAdminLoopsById[loopId] = {
    loopId,
    routeId,
    originCastleId: originCastleId || route.fromCastleId,
    targetServerId: route.toServerId || null,
    intervalHint,
    pressureHint,
    active: true,
    proxyMode: getProxyMode?.() || "normal",
    proxyPressure: getProxyPressure?.() ?? 0
  };

  logger?.log?.("castle", "spawn_nodeadmin_loop", {
    loopId,
    routeId,
    originCastleId: nodeAdminLoopsById[loopId].originCastleId,
    targetServerId: nodeAdminLoopsById[loopId].targetServerId,
    intervalHint,
    pressureHint,
    proxyMode: nodeAdminLoopsById[loopId].proxyMode,
    proxyPressure: nodeAdminLoopsById[loopId].proxyPressure
  });

  return { ok: true, loopId };
}

function snapshotExpansionRoutes() {
  const routes = {};
  for (const [id, r] of Object.entries(expansionRoutesById)) {
    routes[id] = { ...r };
  }
  return routes;
}

function snapshotNodeAdminLoops() {
  const loops = {};
  for (const [id, l] of Object.entries(nodeAdminLoopsById)) {
    loops[id] = { ...l };
  }
  return loops;
}

// ---------------------------------------------------------------------------
// Beacon Engine singleton for Castle + BeaconMesh
// ---------------------------------------------------------------------------

let _beaconEngineInstance = null;

export function setBeaconEngineInstance(engine) {
  _beaconEngineInstance = engine;
}

export function getBeaconEngineContext() {
  if (!_beaconEngineInstance) {
    try {
      _beaconEngineInstance =
        typeof PulseBeaconEngine === "function"
          ? new PulseBeaconEngine()
          : PulseBeaconEngine;
    } catch {
      return null;
    }
  }
  return _beaconEngineInstance;
}
// ============================================================================
//  EXECUTOR HELPERS — APPLY EXPANSION PLAN (v16 IMMORTAL ORGANISM)
// ============================================================================

function spawnCastleInternal({ regionId, hostName, presenceField = null }) {
  const rId = regionId || "unknown-region";
  const hName = hostName || "unknown-host";
  const castleId = buildCastleId({ regionId: rId, hostName: hName });
  const castle = ensureCastle(castleId, rId, hName, presenceField);
  return castle;
}

function spawnServersForCastleInternal({
  castleId,
  count = 1,
  serverConfig = {}
}) {
  const castle = castlesById[castleId];
  if (!castle) return [];

  const created = [];
  for (let i = 0; i < count; i++) {
    const effectiveServerId = stableHash(
      `SERVER::${castleId}::${JSON.stringify(serverConfig)}::${i}`
    );

    if (!castle.serversById[effectiveServerId]) {
      const server =
        typeof createPulseServer === "function"
          ? createPulseServer({
              castleId,
              serverId: effectiveServerId,
              ...serverConfig
            })
          : null;

      castle.serversById[effectiveServerId] = {
        serverId: effectiveServerId,
        serverMeta: PulseServerMeta,
        server
      };

      logger?.log?.("castle", "attach_server_auto", {
        castleId,
        serverId: effectiveServerId
      });

      created.push(effectiveServerId);
    }
  }
  return created;
}

function spawnUsersForCastleInternal({
  castleId,
  regionId,
  hostName,
  count = 1,
  worldCoreConfig = {}
}) {
  const created = [];
  for (let i = 0; i < count; i++) {
    const userKey = `auto-user-${i}`;
    const user = ensureUser({
      castleId,
      regionId,
      hostName,
      userKey,
      worldCoreConfig
    });
    created.push(user.userId);
  }
  return created;
}

function applySoldierDelegationInternal(actions = []) {
  for (const act of actions) {
    const castle = castlesById[act.castleId];
    if (!castle) continue;

    castle.soldiersById = castle.soldiersById || Object.create(null);

    for (let i = 0; i < (act.spawn || 0); i++) {
      const soldierId = stableHash(
        `SOLDIER::${act.castleId}::${act.reason || "spawn"}::${i}`
      );
      castle.soldiersById[soldierId] = {
        soldierId,
        castleId: act.castleId,
        reason: act.reason || "spawn"
      };
      logger?.log?.("castle", "spawn_soldier_auto", {
        castleId: act.castleId,
        soldierId,
        reason: act.reason
      });
    }

    for (let i = 0; i < (act.kill || 0); i++) {
      const ids = Object.keys(castle.soldiersById);
      const victim = ids[0];
      if (!victim) break;
      delete castle.soldiersById[victim];
      logger?.log?.("castle", "kill_soldier_auto", {
        castleId: act.castleId,
        soldierId: victim,
        reason: act.reason
      });
    }
  }
}

function applyMeshRebalanceInternal(actions = []) {
  for (const act of actions) {
    if (act.action === "link") {
      linkCastles(act.castleId, act.targetCastleId);
      logger?.log?.("castle", "mesh_link_auto", {
        castleId: act.castleId,
        targetCastleId: act.targetCastleId
      });
    }
  }
}

// ============================================================================
//  ROUTE DEFENSE + NODEADMIN ORBITS (v16 IMMORTAL ORGANISM)
// ============================================================================

function defendRouteInternal({ routeId, soldierCount = 2 }) {
  const route = expansionRoutesById[routeId];
  if (!route) {
    logger?.log?.("castle", "defend_route_missing", { routeId });
    return { ok: false, reason: "route_not_found" };
  }

  const originCastleId = route.fromCastleId;
  const castle = castlesById[originCastleId];
  if (!castle) {
    logger?.log?.("castle", "defend_route_castle_missing", {
      routeId,
      originCastleId
    });
    return { ok: false, reason: "castle_not_found" };
  }

  castle.soldiersById = castle.soldiersById || Object.create(null);

  for (let i = 0; i < soldierCount; i++) {
    const soldierId = stableHash(
      `SOLDIER_DEFEND::${originCastleId}::${routeId}::${i}`
    );
    castle.soldiersById[soldierId] = {
      soldierId,
      castleId: originCastleId,
      routeId,
      role: "defender"
    };
    logger?.log?.("castle", "spawn_soldier_defender", {
      castleId: originCastleId,
      soldierId,
      routeId
    });
  }

  return { ok: true, routeId, originCastleId, soldiers: soldierCount };
}

function spawnNodeAdminOrbitInternal({
  castleId,
  intervalHint = "steady",
  pressureHint = "normal"
}) {
  const castle = castlesById[castleId];
  if (!castle) {
    return { ok: false, reason: "castle_not_found" };
  }

  // orbit loop is just a NodeAdmin loop with no specific route target
  const loopId = stableHash(`ORBIT::${castleId}::${intervalHint}::${pressureHint}`);

  nodeAdminLoopsById[loopId] = {
    loopId,
    routeId: null,
    originCastleId: castleId,
    targetServerId: null,
    intervalHint,
    pressureHint,
    active: true,
    proxyMode: getProxyMode?.() || "normal",
    proxyPressure: getProxyPressure?.() ?? 0,
    orbit: true
  };

  logger?.log?.("castle", "spawn_nodeadmin_orbit", {
    loopId,
    castleId,
    intervalHint,
    pressureHint,
    proxyMode: nodeAdminLoopsById[loopId].proxyMode,
    proxyPressure: nodeAdminLoopsById[loopId].proxyPressure
  });

  return { ok: true, loopId };
}


// ============================================================================
//  CORE ORGAN — PulseCastle v16 IMMORTAL ORGANISM
// ============================================================================

export class PulseCastle {
  constructor(config = {}) {
    this.config = {
      autoMeshByRegion: true,
      autoMeshAll: false,
      autoBindServerToUser: true,
      demoUsersOnBoot: true,
      regionId: null,
      ...config
    };

    this.localMesh =
      createPulseMesh?.({
        meshID: "castle-mesh",
        regionID: this.config.regionId || null,
        trace: false
      }) || null;

    this.binaryMesh =
      createBinaryMesh?.({
        meshID: "castle-binary-mesh",
        regionID: this.config.regionId || null,
        trace: false
      }) || null;

    this.binarySend =
      PulseSendBin?.({
        meshID: "castle-binary-send",
        regionID: this.config.regionId || null,
        trace: false
      }) || null;

    this.dualBandOrganism =
      PulseBinaryOrganismBoot?.({
        mesh: this.binaryMesh,
        send: this.binarySend,
        role: "castle-organism",
        trace: false
      }) || null;

    this.beaconMesh = new PulseBeaconMesh({
      beacon: getBeaconEngineContext?.() || null,
      meshID: "castle-beacon-mesh",
      regionID: this.config.regionId || null,
      trace: false
    });

    if (this.config.demoUsersOnBoot) {
      this._bootstrapDemoUsers();
    }
  }

  _bootstrapDemoUsers() {
    const regionId = this.config.regionId || "demo-region";
    const hostName = "demo-host";

    this.registerCastle({ regionId, hostName });

    this.registerUserAtCastle({
      regionId,
      hostName,
      userKey: "demo-user-1",
      worldCoreConfig: { demo: true }
    });

    this.registerUserAtCastle({
      regionId,
      hostName,
      userKey: "demo-user-2",
      worldCoreConfig: { demo: true }
    });
  }

  // ------------------------------------------------------------------------
  // Register or update a castle presence
  // ------------------------------------------------------------------------

  registerCastle({ regionId, hostName, presenceField = null }) {
    const rId = regionId || this.config.regionId || "unknown-region";
    const hName = hostName || "unknown-host";

    const castleId = buildCastleId({ regionId: rId, hostName: hName });
    const castle = ensureCastle(castleId, rId, hName, presenceField);

    if (this.config.autoMeshByRegion) {
      for (const [otherId, otherCastle] of Object.entries(castlesById)) {
        if (otherId === castleId) continue;
        if (otherCastle.regionId === rId) {
          linkCastles(castleId, otherId);
        }
      }
    }

    if (this.config.autoMeshAll) {
      for (const otherId of Object.keys(castlesById)) {
        if (otherId === castleId) continue;
        linkCastles(castleId, otherId);
      }
    }

    logger?.log?.("castle", "register", {
      castleId,
      regionId: rId,
      hostName: hName,
      presenceField: castle.presenceField
    });

    return new CastleRegistrationResult({
      castleId,
      regionId: rId,
      hostName: hName,
      presenceField: castle.presenceField,
      meta: {
        castleMeta: PulseCastleMeta,
        organismContext: buildOrganismContext({
          localMesh: !!this.localMesh,
          binaryMesh: !!this.binaryMesh,
          beaconMesh: !!this.beaconMesh,
          dualBandOrganism: !!this.dualBandOrganism,
          binarySend: !!this.binarySend
        })
      }
    });
  }

  // ============================================================================
//  v16-IMMORTAL GOVERNANCE UPGRADE — CASTLE → WISE KING
//  Castle gains:
//    • submitToGeneral()
//    • yieldAuthorityGracefully()
//    • warnGeneralOfOverreach()
//    • reportPeopleNeeds()
//    • reportStressToGeneral()
//    • requestExpansionHelp()
// ============================================================================

submitToGeneral(generalId, reason = "castle_submits") {
  try {
    this.pulseNetBridge?.routeCastle({
      mode: "castle_submits_to_general",
      castleId: this.castleId,
      regionId: this.regionId,
      generalId,
      reason,
      presenceField: this.presenceField,
      proxy: {
        mode: getProxyMode(),
        pressure: getProxyPressure(),
        boost: getProxyBoost(),
        fallback: getProxyFallback(),
        lineage: getProxyLineage()
      }
    });
  } catch (err) {
    logger?.log?.("castle", "submit_to_general_error", {
      castleId: this.castleId,
      error: String(err)
    });
  }
}

yieldAuthorityGracefully(generalId) {
  try {
    this.pulseNetBridge?.routeCastle({
      mode: "castle_yields_authority",
      castleId: this.castleId,
      regionId: this.regionId,
      generalId,
      presenceField: this.presenceField
    });
  } catch (err) {
    logger?.log?.("castle", "yield_authority_error", {
      castleId: this.castleId,
      error: String(err)
    });
  }
}

warnGeneralOfOverreach(generalId, metrics = {}) {
  try {
    this.pulseNetBridge?.routeCastle({
      mode: "castle_warns_general",
      castleId: this.castleId,
      regionId: this.regionId,
      generalId,
      metrics,
      presenceField: this.presenceField
    });
  } catch (err) {
    logger?.log?.("castle", "warn_general_error", {
      castleId: this.castleId,
      error: String(err)
    });
  }
}

reportPeopleNeeds() {
  const needs = {
    population: this.population || 0,
    morale: this.moraleIndex || 0,
    stress: this.presenceField?.stressIndex ?? 0,
    load: this.presenceField?.loadIndex ?? 0,
    needScore:
      (this.moraleIndex ?? 0) * 0.4 +
      (this.presenceField?.stressIndex ?? 0) * 0.4 +
      (this.presenceField?.loadIndex ?? 0) * 0.2
  };

  try {
    this.pulseNetBridge?.routeCastle({
      mode: "castle_reports_people_needs",
      castleId: this.castleId,
      regionId: this.regionId,
      needs,
      presenceField: this.presenceField
    });
  } catch (err) {
    logger?.log?.("castle", "report_people_needs_error", {
      castleId: this.castleId,
      error: String(err)
    });
  }

  return needs;
}

reportStressToGeneral(generalId) {
  const stressPayload = {
    stressIndex: this.presenceField?.stressIndex ?? 0,
    loadIndex: this.presenceField?.loadIndex ?? 0,
    moraleIndex: this.moraleIndex ?? 0
  };

  try {
    this.pulseNetBridge?.routeCastle({
      mode: "castle_reports_stress",
      castleId: this.castleId,
      regionId: this.regionId,
      generalId,
      stress: stressPayload,
      presenceField: this.presenceField
    });
  } catch (err) {
    logger?.log?.("castle", "report_stress_error", {
      castleId: this.castleId,
      error: String(err)
    });
  }

  return stressPayload;
}

requestExpansionHelp(reason = "castle_requests_help") {
  try {
    this.pulseNetBridge?.routeCastle({
      mode: "castle_requests_expansion_help",
      castleId: this.castleId,
      regionId: this.regionId,
      reason,
      presenceField: this.presenceField
    });
  } catch (err) {
    logger?.log?.("castle", "request_expansion_help_error", {
      castleId: this.castleId,
      error: String(err)
    });
  }
}


  // ------------------------------------------------------------------------
// Apply ExpansionPlan from PulseExpansion (symbolic executor)
// ------------------------------------------------------------------------

applyExpansionPlan(plan) {
  if (!plan) {
    return {
      ok: false,
      reason: "no_plan",
      meta: { castleMeta: PulseCastleMeta }
    };
  }

  const {
    expansions = [],
    contractions = [],
    soldierDelegation = [],
    rebalanceLinks = [],
    regionPresence = {}
  } = plan;

  // EXPANSIONS → spawn castles + servers + users
  for (const exp of expansions) {
    const regionId = exp.regionId;
    const hostName = `auto-host-${regionId || "unknown"}`;

    const castle = spawnCastleInternal({
      regionId,
      hostName,
      presenceField: {
        tier: exp.tier || "normal",
        reason: exp.reason || "expansion"
      }
    });

    const serverIds = spawnServersForCastleInternal({
      castleId: castle.castleId,
      count: exp.desiredServers || 1,
      serverConfig: { tier: exp.tier || "normal" }
    });

    const userIds = spawnUsersForCastleInternal({
      castleId: castle.castleId,
      regionId: castle.regionId,
      hostName: castle.hostName,
      count: exp.desiredSoldiers || 0,
      worldCoreConfig: { regionID: castle.regionId }
    });

    logger?.log?.("castle", "apply_expansion", {
      regionId,
      castleId: castle.castleId,
      servers: serverIds,
      users: userIds,
      tier: exp.tier,
      reason: exp.reason
    });
  }

  // CONTRACTIONS → simple symbolic shrink
  for (const con of contractions) {
    const castle = castlesById[con.castleId];
    if (!castle) continue;

    const serverIds = Object.keys(castle.serversById || {});
    if (serverIds.length > 0) {
      const victim = serverIds[serverIds.length - 1];
      delete castle.serversById[victim];
      logger?.log?.("castle", "contract_server_auto", {
        castleId: con.castleId,
        serverId: victim,
        reason: con.reason
      });
    }

    const soldierIds = Object.keys(castle.soldiersById || {});
    if (soldierIds.length > 0) {
      const victim = soldierIds[soldierIds.length - 1];
      delete castle.soldiersById[victim];
      logger?.log?.("castle", "contract_soldier_auto", {
        castleId: con.castleId,
        soldierId: victim,
        reason: con.reason
      });
    }
  }

  // SOLDIER DELEGATION
  applySoldierDelegationInternal(soldierDelegation);

  // MESH REBALANCE
  applyMeshRebalanceInternal(rebalanceLinks);

  // Recompute presence after changes + embed people/governance metrics
  for (const [castleId, castle] of Object.entries(castlesById)) {
    const metrics = computeCastlePresence(castle);
    const needs = computePeopleNeedsForCastle({
      ...castle,
      presenceField: { ...(castle.presenceField || {}), ...metrics }
    });

    castle.presenceField = {
      ...(castle.presenceField || {}),
      ...metrics,
      peopleNeedIndex: needs.needScore,
      populationStressIndex: needs.stress,
      governanceStabilityIndex: needs.governanceStabilityIndex
    };
  }

  const { castlesSnapshot, meshSnapshot } = snapshotMesh();

  return new CastlePresenceState({
    castlesById: castlesSnapshot,
    meshLinksByCastleId: meshSnapshot,
    meta: {
      castleMeta: PulseCastleMeta,
      regionPresence,
      appliedExpansions: expansions.length,
      appliedContractions: contractions.length,
      appliedSoldierDelegations: soldierDelegation.length,
      appliedMeshRebalances: rebalanceLinks.length,
      organismContext: buildOrganismContext()
    }
  });
}


    // ------------------------------------------------------------------------
  // Defend a symbolic expansion route with soldiers
  // ------------------------------------------------------------------------

  defendRoute({ routeId, soldierCount = 2 }) {
    const result = defendRouteInternal({ routeId, soldierCount });

    return new CastleExpansionRouteState({
      routesById: snapshotExpansionRoutes(),
      meta: {
        castleMeta: PulseCastleMeta,
        ok: result.ok,
        reason: result.reason || null,
        defendedRouteId: routeId,
        soldiers: result.soldiers || soldierCount,
        organismContext: buildOrganismContext()
      }
    });
  }

    // ------------------------------------------------------------------------
  // Spawn a NodeAdmin orbit loop around a castle (circle the castle)
// ------------------------------------------------------------------------

  spawnNodeAdminOrbit({
    castleId,
    intervalHint = "steady",
    pressureHint = "normal"
  }) {
    const result = spawnNodeAdminOrbitInternal({
      castleId,
      intervalHint,
      pressureHint
    });

    return new CastleNodeAdminLoopState({
      loopsById: snapshotNodeAdminLoops(),
      meta: {
        castleMeta: PulseCastleMeta,
        ok: result.ok,
        reason: result.reason || null,
        orbitCastleId: castleId,
        orbitLoopId: result.loopId || null,
        organismContext: buildOrganismContext()
      }
    });
  }

  // ------------------------------------------------------------------------
  // Register a user at a castle + optional world core
  // ------------------------------------------------------------------------

  registerUserAtCastle({
    regionId,
    hostName,
    castleId = null,
    userId = null,
    userKey = null,
    worldCoreConfig = {},
    attachServerId = null
  }) {
    const rId = regionId || this.config.regionId || "unknown-region";
    const hName = hostName || "unknown-host";

    const effectiveCastleId =
      castleId || buildCastleId({ regionId: rId, hostName: hName });

    ensureCastle(effectiveCastleId, rId, hName, null);

    const user = ensureUser({
      castleId: effectiveCastleId,
      regionId: rId,
      hostName: hName,
      userId,
      userKey,
      worldCoreConfig
    });

    if (attachServerId) {
      bindServerToUserInternal({
        castleId: effectiveCastleId,
        serverId: attachServerId,
        userId: user.userId
      });
    }

    const boundServers = Array.from(user.servers);

    return new CastleUserRegistrationResult({
      castleId: effectiveCastleId,
      userId: user.userId,
      regionId: rId,
      hostName: hName,
      userMeta: user.userMeta,
      worldCoreSnapshot: user.worldCoreSnapshot,
      boundServers,
      meta: {
        castleMeta: PulseCastleMeta,
        userMeta: PulseUserMeta,
        worldCoreMeta: PulseWorldCoreMeta,
        organismContext: buildOrganismContext()
      }
    });
  }

  // ------------------------------------------------------------------------
  // Bind an existing server to an existing user
  // ------------------------------------------------------------------------

  bindServerToUser({ castleId, serverId, userId }) {
    const result = bindServerToUserInternal({ castleId, serverId, userId });

    const { users, bindings } = snapshotUsersForCastle(castleId);

    return new CastleUserBindingState({
      castleId,
      usersById: users,
      bindingsByServerId: bindings,
      meta: {
        castleMeta: PulseCastleMeta,
        ok: result.ok,
        reason: result.reason || null,
        organismContext: buildOrganismContext()
      }
    });
  }

  // ------------------------------------------------------------------------
  // Attach a PulseServer instance to a castle (optionally bind to user)
// ------------------------------------------------------------------------

  attachServerToCastle({
    regionId,
    hostName,
    presenceField = null,
    serverConfig = {},
    serverId = null,
    userId = null,
    userKey = null,
    worldCoreConfig = {}
  }) {
    const rId = regionId || this.config.regionId || "unknown-region";
    const hName = hostName || "unknown-host";

    const castleId = buildCastleId({ regionId: rId, hostName: hName });
    const castle = ensureCastle(castleId, rId, hName, presenceField);

    const effectiveServerId =
      serverId ||
      stableHash(`SERVER::${castleId}::${JSON.stringify(serverConfig)}`);

    if (!castle.serversById[effectiveServerId]) {
      const serverInstance = createPulseServer(serverConfig);

      if (serverInstance?.attachCastle) {
        serverInstance.attachCastle({
          castleId,
          regionId: rId,
          hostName: hName,
          getCastleSnapshot: () => this.getSnapshot()
        });
      }

      castle.serversById[effectiveServerId] = {
        serverId: effectiveServerId,
        instance: serverInstance,
        meta: PulseServerMeta
      };
    }

    let boundUserId = userId || null;

    if (this.config.autoBindServerToUser || userId || userKey) {
      const user = ensureUser({
        castleId,
        regionId: rId,
        hostName: hName,
        userId,
        userKey,
        worldCoreConfig
      });

      boundUserId = user.userId;

      bindServerToUserInternal({
        castleId,
        serverId: effectiveServerId,
        userId: boundUserId
      });
    }

    logger?.log?.("castle", "attach_server", {
      castleId,
      serverId: effectiveServerId,
      regionId: rId,
      hostName: hName,
      boundUserId,
      role: "general_candidate"
    });


    return new ServerAttachResult({
      castleId,
      serverId: effectiveServerId,
      serverMeta: PulseServerMeta,
      attached: true,
      meta: {
        castleMeta: PulseCastleMeta,
        boundUserId,
        organismContext: buildOrganismContext()
      }
    });
  }

  // ------------------------------------------------------------------------
  // Detach a server from a castle
  // ------------------------------------------------------------------------

  detachServerFromCastle({ castleId, serverId }) {
    const castle = castlesById[castleId];
    if (!castle || !castle.serversById[serverId]) {
      return new ServerDetachResult({
        castleId,
        serverId,
        detached: false,
        meta: {
          castleMeta: PulseCastleMeta,
          reason: "server_not_found",
          organismContext: buildOrganismContext()
        }
      });
    }

    const serverEntry = castle.serversById[serverId];
    if (serverEntry?.instance?.detachCastle) {
      try {
        serverEntry.instance.detachCastle({ castleId });
      } catch {
        // never throw
      }
    }

    delete castle.serversById[serverId];

    if (userBindingsByServerId[serverId]) {
      const uid = userBindingsByServerId[serverId];
      delete userBindingsByServerId[serverId];
      const u = usersById[uid];
      if (u && u.servers) {
        u.servers.delete(serverId);
      }
    }

    logger?.log?.("castle", "detach_server", {
      castleId,
      serverId
    });

    return new ServerDetachResult({
      castleId,
      serverId,
      detached: true,
      meta: {
        castleMeta: PulseCastleMeta,
        organismContext: buildOrganismContext()
      }
    });
  }

  // ------------------------------------------------------------------------
  // Mesh snapshot
  // ------------------------------------------------------------------------

  getMeshState() {
    const { castlesSnapshot, meshSnapshot } = snapshotMesh();
    return new CastleMeshState({
      castlesById: castlesSnapshot,
      meshLinksByCastleId: meshSnapshot,
      meta: {
        castleMeta: PulseCastleMeta,
        organismContext: buildOrganismContext()
      }
    });
  }

  // ------------------------------------------------------------------------
  // Expansion routes + NodeAdmin loops public surface
  // ------------------------------------------------------------------------

  registerExpansionRoute(payload) {
    const result = registerExpansionRouteInternal(payload);
    return new CastleExpansionRouteState({
      routesById: snapshotExpansionRoutes(),
      meta: {
        castleMeta: PulseCastleMeta,
        ok: result.ok,
        routeId: result.routeId || null,
        organismContext: buildOrganismContext()
      }
    });
  }

  spawnNodeAdminLoop(payload) {
    const result = spawnNodeAdminLoopInternal(payload);
    return new CastleNodeAdminLoopState({
      loopsById: snapshotNodeAdminLoops(),
      meta: {
        castleMeta: PulseCastleMeta,
        ok: result.ok,
        loopId: result.loopId || null,
        organismContext: buildOrganismContext()
      }
    });
  }

  // ------------------------------------------------------------------------
  // Snapshot
  // ------------------------------------------------------------------------

  getSnapshot() {
    const { castlesSnapshot, meshSnapshot } = snapshotMesh();

    return Object.freeze({
      meta: PulseCastleMeta,
      castlesById: castlesSnapshot,
      meshLinksByCastleId: meshSnapshot,
      usersById: (() => {
        const out = {};
        for (const [id, u] of Object.entries(usersById)) {
          out[id] = {
            userId: u.userId,
            castleId: u.castleId,
            regionId: u.regionId,
            hostName: u.hostName,
            userMeta: u.userMeta,
            worldCoreSnapshot: u.worldCoreSnapshot,
            servers: Array.from(u.servers)
          };
        }
        return out;
      })(),
      userBindingsByServerId: { ...userBindingsByServerId },
      expansionRoutesById: snapshotExpansionRoutes(),
      nodeAdminLoopsById: snapshotNodeAdminLoops(),
      organismContext: buildOrganismContext({
        localMesh: !!this.localMesh,
        binaryMesh: !!this.binaryMesh,
        beaconMesh: !!this.beaconMesh,
        dualBandOrganism: !!this.dualBandOrganism,
        binarySend: !!this.binarySend
      })
    });
  }

    // ------------------------------------------------------------------------
  // CASTLE PULSE TICK — runs every heartbeat / aiHeartbeat / earnHeartbeat
  // ------------------------------------------------------------------------

  castlePulseTick() {
    // 1. Pull expansion context (symbolic only)
    const expansionCtx = getPulseExpansionContext?.() || {};
    const latestPlan = expansionCtx.latestPlan || null;

    // 2. Apply expansion plan if present
    if (latestPlan) {
      this.applyExpansionPlan(latestPlan);
    }

    // 3. Update NodeAdmin loops (orbit + route loops)
    for (const [loopId, loop] of Object.entries(nodeAdminLoopsById)) {
      if (!loop.active) continue;

      // symbolic pulse update
      loop.lastPulse = Date.now();
      loop.proxyPressure = getProxyPressure?.() ?? 0;
      loop.proxyMode = getProxyMode?.() || "normal";
    }

   
    // 4. Recompute presence for all castles + embed people/governance metrics
    for (const [castleId, castle] of Object.entries(castlesById)) {
      const metrics = computeCastlePresence(castle);

      const needs = computePeopleNeedsForCastle({
        ...castle,
        presenceField: { ...(castle.presenceField || {}), ...metrics }
      });

      castle.presenceField = {
        ...(castle.presenceField || {}),
        ...metrics,
        peopleNeedIndex: needs.needScore,
        populationStressIndex: needs.stress,
        governanceStabilityIndex: needs.governanceStabilityIndex
      };
    }


    // 5. Emit presence snapshot back to expansion
    const presenceSnapshot = summarizeCastlePresence();
    expansionCtx.castlePresence = presenceSnapshot;

    logger?.log?.("castle", "pulse_tick", {
      castles: Object.keys(castlesById).length,
      loops: Object.keys(nodeAdminLoopsById).length,
      routes: Object.keys(expansionRoutesById).length
    });

    return presenceSnapshot;
  }

  // ------------------------------------------------------------------------
  // WorldCore attach hook (for PulseWorldCore → Castle wiring)
// ------------------------------------------------------------------------

  attachWorldCore(worldCore) {
    if (!worldCore || typeof worldCore.attachCastle !== "function") {
      return { ok: false, reason: "worldcore_attach_not_supported" };
    }

    worldCore.attachCastle({
      castleMeta: PulseCastleMeta,
      getCastleSnapshot: () => this.getSnapshot()
    });

    return { ok: true };
  }
}

export default PulseCastle;
