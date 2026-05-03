// ============================================================================
//  PULSE OS v14‑IMMORTAL — PULSE CASTLE (PRESENCE / HOST ORGAN)
//  PulseCastle-v14-IMMORTAL.js
//
//  ROLE:
//    - Presence + host organ for PulseServer instances.
//    - Manages castles (region/host nodes) and their attached servers.
//    - Manages user bindings + world cores per castle (user‑aware).
//    - Maintains awareness of other castles (mesh awareness).
//    - Maintains basic treasury + soldier awareness for economic layer.
//    - Maintains symbolic expansion routes + NodeAdmin loops to servers.
//    - Pure symbolic registry + mapping. No compute math, no routing, no AI.
// ============================================================================

/*
AI_EXPERIENCE_META = {
  identity: "PulseCastle",
  version: "v14-IMMORTAL",
  layer: "presence_castle",
  role: "region_identity_and_security",
  lineage: "PulsePresence-v14",

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
    zeroFilesystem: true
  },

  contract: {
    always: [
      "PulseExpansion",
      "PulseRouter",
      "PulseServer"
    ],
    never: [
      "safeRoute",
      "fetchViaCNS"
    ]
  }
}
*/

// ============================================================================
//  IMPORTS (backend-safe)
// ============================================================================
import { logger } from "../../PULSE-UI/_CONNECTORS/PulseProofLogger.js";

import {
  createPulseServer,
  PulseServerMeta
} from "./PulseServer-v12.3-Presence.js";

import {
  pulseUser,
  PulseUserMeta,
  createPulseWorldCore
} from "./PulseUser-v12.3-Presence.js";

// ============================================================================
//  META — Castle Identity
// ============================================================================
export const PulseCastleMeta = Object.freeze({
  layer: "PulseCastle",
  role: "PRESENCE_HOST_ORGAN",
  version: "v14-IMMORTAL",
  identity: "PulseCastle-v14-IMMORTAL",

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

    // v13+ awareness
    userAware: true,
    worldCoreAware: true,
    serverUserBindingAware: true,
    meshPressureAware: true,
    advantageAware: true,
    chunkPrewarmAware: true,
    osBrainAware: true,

    // v14+ expansion / routing awareness (symbolic only)
    routerAware: true,
    expansionRouteAware: true,
    nodeAdminLoopAware: true,
    serverLoopAware: true,

    zeroRandomness: true,
    zeroDynamicImports: true,
    zeroEval: true,
    zeroNetworkFetch: true,
    zeroAI: true,
    zeroRouting: true,
    zeroComputeMath: true // delegates to PulseServer / Runtime
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
    root: "PulseOS-v14-IMMORTAL",
    parent: "PulseExpansion-v14-IMMORTAL",
    ancestry: [
      "PulseCastle-v9",
      "PulseCastle-v10",
      "PulseCastle-v11",
      "PulseCastle-v12",
      "PulseCastle-v12.3-PRESENCE-EVO++",
      "PulseCastle-v13-PRESENCE-EVO+"
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
  constructor({
    castlesById,
    meshLinksByCastleId,
    meta = {}
  }) {
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
  constructor({
    castleId,
    usersById,
    bindingsByServerId,
    meta = {}
  }) {
    this.castleId = castleId;
    this.usersById = usersById;
    this.bindingsByServerId = bindingsByServerId;
    this.meta = meta;
  }
}

export class CastleExpansionRouteState {
  constructor({
    routesById,
    meta = {}
  }) {
    this.routesById = routesById;
    this.meta = meta;
  }
}

export class CastleNodeAdminLoopState {
  constructor({
    loopsById,
    meta = {}
  }) {
    this.loopsById = loopsById;
    this.meta = meta;
  }
}

// ============================================================================
//  INTERNAL STATE (symbolic, deterministic)
// ============================================================================
//
// castlesById, usersById, userBindingsByServerId, meshLinksByCastleId
//   — same as v13.
//
// expansionRoutesById: {
//   [routeId]: {
//     routeId,
//     fromCastleId,
//     toServerId,
//     toServerUrl,
//     hops: [castleId],
//     loopHint: { intervalHint, pressureHint },
//     tags: []
//   }
// }
//
// nodeAdminLoopsById: {
//   [loopId]: {
//     loopId,
//     routeId,
//     originCastleId,
//     targetServerId,
//     intervalHint,
//     pressureHint,
//     active: boolean
//   }
// }
// ============================================================================
const castlesById = Object.create(null);
const meshLinksByCastleId = Object.create(null);

const usersById = Object.create(null);
const userBindingsByServerId = Object.create(null);

const expansionRoutesById = Object.create(null);
const nodeAdminLoopsById = Object.create(null);

// ============================================================================
//  HELPERS
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

export function computeCastlePresence(castle) {
  const serverCount = Object.keys(castle.serversById || {}).length;
  const soldierCount = Object.keys(castle.soldiersById || {}).length;
  const capacityHint = castle.presenceField?.capacityHint ?? 1;

  const rawLoad =
    (serverCount + soldierCount * 0.5) / Math.max(1, capacityHint * 4);
  const loadIndex = clamp01(rawLoad);

  const stressIndex = clamp01(
    loadIndex >= 0.8 ? 0.9 :
    loadIndex >= 0.6 ? 0.7 :
    loadIndex >= 0.3 ? 0.4 :
    0.1
  );

  const presenceScore = clamp01(
    loadIndex * 0.6 +
    (1 - Math.abs(0.5 - loadIndex) * 2) * 0.4
  );

  let tier = castle.presenceField?.tier || "normal";
  if (presenceScore >= 0.7) tier = "high";
  else if (presenceScore >= 0.4) tier = "normal";
  else tier = "low";

  return {
    loadIndex,
    stressIndex,
    presenceScore,
    tier
  };
}

// v13: richer summary for Expansion / Mesh / Advantage
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
        lastDelta: 0
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
      userMeta: PulseUserMeta || { identity: "PulseUser" },
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
        lastDelta: c.treasury.lastDelta
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
    tags: loopHint.tags || []
  };

  logger?.log?.("castle", "register_expansion_route", {
    routeId,
    fromCastleId,
    toServerId,
    toServerUrl,
    hops: expansionRoutesById[routeId].hops,
    loopHint: expansionRoutesById[routeId].loopHint
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

  const loopId = buildLoopId({ routeId, originCastleId: originCastleId || route.fromCastleId });

  nodeAdminLoopsById[loopId] = {
    loopId,
    routeId,
    originCastleId: originCastleId || route.fromCastleId,
    targetServerId: route.toServerId || null,
    intervalHint,
    pressureHint,
    active: true
  };

  logger?.log?.("castle", "spawn_nodeadmin_loop", {
    loopId,
    routeId,
    originCastleId: nodeAdminLoopsById[loopId].originCastleId,
    targetServerId: nodeAdminLoopsById[loopId].targetServerId,
    intervalHint,
    pressureHint
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

// ============================================================================
//  CORE ORGAN
// ============================================================================
export class PulseCastle {
  constructor(config = {}) {
    this.config = {
      autoMeshByRegion: true,
      autoMeshAll: false,
      autoBindServerToUser: true,
      ...config
    };
  }

  // ------------------------------------------------------------------------
  // Register or update a castle presence
  // ------------------------------------------------------------------------
  registerCastle({
    regionId,
    hostName,
    presenceField = null
  }) {
    const rId = regionId || "unknown-region";
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
        castleMeta: PulseCastleMeta
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
    const rId = regionId || "unknown-region";
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
        userMeta: PulseUserMeta
      }
    });
  }

  // ------------------------------------------------------------------------
  // Bind an existing server to an existing user
  // ------------------------------------------------------------------------
  bindServerToUser({
    castleId,
    serverId,
    userId
  }) {
    const result = bindServerToUserInternal({ castleId, serverId, userId });

    const { users, bindings } = snapshotUsersForCastle(castleId);

    return new CastleUserBindingState({
      castleId,
      usersById: users,
      bindingsByServerId: bindings,
      meta: {
        castleMeta: PulseCastleMeta,
        ok: result.ok,
        reason: result.reason || null
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
    const rId = regionId || "unknown-region";
    const hName = hostName || "unknown-host";

    const castleId = buildCastleId({ regionId: rId, hostName: hName });
    const castle = ensureCastle(castleId, rId, hName, presenceField);

    const effectiveServerId =
      serverId || stableHash(`SERVER::${castleId}::${JSON.stringify(serverConfig)}`);

    if (!castle.serversById[effectiveServerId]) {
      const serverInstance = createPulseServer(serverConfig);
      castle.serversById[effectiveServerId] = {
        serverId: effectiveServerId,
        serverMeta: PulseServerMeta,
        serverInstance
      };

      const metrics = computeCastlePresence(castle);
      castle.presenceField = { ...castle.presenceField, ...metrics };

      logger?.log?.("castle", "attach_server", {
        castleId,
        serverId: effectiveServerId,
        regionId: rId,
        hostName: hName
      });
    }

    if (this.config.autoBindServerToUser || userId || userKey) {
      const user = ensureUser({
        castleId,
        regionId: rId,
        hostName: hName,
        userId,
        userKey,
        worldCoreConfig
      });
      bindServerToUserInternal({
        castleId,
        serverId: effectiveServerId,
        userId: user.userId
      });
    }

    return new ServerAttachResult({
      castleId,
      serverId: effectiveServerId,
      serverMeta: PulseServerMeta,
      attached: true,
      meta: {
        castleMeta: PulseCastleMeta
      }
    });
  }

  // ------------------------------------------------------------------------
  // Detach a PulseServer instance from a castle
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
          reason: "not_found"
        }
      });
    }

    delete castle.serversById[serverId];

    const metrics = computeCastlePresence(castle);
    castle.presenceField = { ...castle.presenceField, ...metrics };

    const boundUserId = userBindingsByServerId[serverId];
    if (boundUserId && usersById[boundUserId]) {
      usersById[boundUserId].servers.delete(serverId);
      delete userBindingsByServerId[serverId];
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
        castleMeta: PulseCastleMeta
      }
    });
  }

  // ------------------------------------------------------------------------
  // Treasury adjustments (symbolic, for future Earn integration)
  // ------------------------------------------------------------------------
  applyTreasuryDelta({ castleId, delta = 0 }) {
    const castle = castlesById[castleId];
    if (!castle) return { ok: false, reason: "castle_not_found" };

    const prev = castle.treasury.balance;
    const next = prev + delta;
    castle.treasury.balance = next;
    castle.treasury.lastDelta = delta;

    logger?.log?.("castle", "treasury_delta", {
      castleId,
      delta,
      balance: next
    });

    return { ok: true, balance: next };
  }

  // ------------------------------------------------------------------------
  // Soldier registry (symbolic, for NodeAdmin / Expansion)
  // ------------------------------------------------------------------------
  registerSoldier({ castleId, soldierId, meta = {} }) {
    const castle = castlesById[castleId];
    if (!castle) return { ok: false, reason: "castle_not_found" };

    const id =
      soldierId || stableHash(`SOLDIER::${castleId}::${JSON.stringify(meta)}`);
    if (!castle.soldiersById[id]) {
      castle.soldiersById[id] = { soldierId: id, meta };
      const metrics = computeCastlePresence(castle);
      castle.presenceField = { ...castle.presenceField, ...metrics };

      logger?.log?.("castle", "register_soldier", {
        castleId,
        soldierId: id
      });
    }

    return { ok: true, soldierId: id };
  }

  unregisterSoldier({ castleId, soldierId }) {
    const castle = castlesById[castleId];
    if (!castle || !castle.soldiersById[soldierId]) {
      return { ok: false, reason: "not_found" };
    }

    delete castle.soldiersById[soldierId];
    const metrics = computeCastlePresence(castle);
    castle.presenceField = { ...castle.presenceField, ...metrics };

    logger?.log?.("castle", "unregister_soldier", {
      castleId,
      soldierId
    });

    return { ok: true };
  }

  // ------------------------------------------------------------------------
  // Get presence / mesh state
  // ------------------------------------------------------------------------
  getPresenceState() {
    const { castlesSnapshot, meshSnapshot } = snapshotMesh();

    return new CastlePresenceState({
      castlesById: castlesSnapshot,
      meshLinksByCastleId: meshSnapshot,
      meta: {
        castleMeta: PulseCastleMeta
      }
    });
  }

  getMeshState() {
    const { castlesSnapshot, meshSnapshot } = snapshotMesh();

    return new CastleMeshState({
      castlesById: castlesSnapshot,
      meshLinksByCastleId: meshSnapshot,
      meta: {
        castleMeta: PulseCastleMeta
      }
    });
  }

  // ------------------------------------------------------------------------
  // Get servers attached to a specific castle
  // ------------------------------------------------------------------------
  getServersForCastle(castleId) {
    const castle = castlesById[castleId];
    if (!castle) return [];

    return Object.values(castle.serversById).map((s) => ({
      castleId,
      serverId: s.serverId,
      serverMeta: s.serverMeta
    }));
  }

  // ------------------------------------------------------------------------
  // Get user bindings for a specific castle
  // ------------------------------------------------------------------------
  getUserBindingsForCastle(castleId) {
    const { users, bindings } = snapshotUsersForCastle(castleId);

    return new CastleUserBindingState({
      castleId,
      usersById: users,
      bindingsByServerId: bindings,
      meta: {
        castleMeta: PulseCastleMeta
      }
    });
  }

  // ------------------------------------------------------------------------
  // Expansion routes: define symbolic path from castle → server
  // ------------------------------------------------------------------------
  registerExpansionRoute({
    fromCastleId,
    toServerId = null,
    toServerUrl = null,
    hops = [],
    loopHint = {}
  }) {
    const res = registerExpansionRouteInternal({
      fromCastleId,
      toServerId,
      toServerUrl,
      hops,
      loopHint
    });

    return new CastleExpansionRouteState({
      routesById: snapshotExpansionRoutes(),
      meta: {
        castleMeta: PulseCastleMeta,
        ok: res.ok,
        reason: res.reason || null
      }
    });
  }

  getExpansionRoutes() {
    return new CastleExpansionRouteState({
      routesById: snapshotExpansionRoutes(),
      meta: {
        castleMeta: PulseCastleMeta
      }
    });
  }

  // ------------------------------------------------------------------------
  // NodeAdmin loops: symbolic “loop” between castle and server along route
  // ------------------------------------------------------------------------
  spawnNodeAdminLoop({
    routeId,
    originCastleId = null,
    intervalHint = "steady",
    pressureHint = "normal"
  }) {
    const res = spawnNodeAdminLoopInternal({
      routeId,
      originCastleId,
      intervalHint,
      pressureHint
    });

    return new CastleNodeAdminLoopState({
      loopsById: snapshotNodeAdminLoops(),
      meta: {
        castleMeta: PulseCastleMeta,
        ok: res.ok,
        reason: res.reason || null
      }
    });
  }

  getNodeAdminLoops() {
    return new CastleNodeAdminLoopState({
      loopsById: snapshotNodeAdminLoops(),
      meta: {
        castleMeta: PulseCastleMeta
      }
    });
  }
}

// ============================================================================
//  PUBLIC API — Create / Singleton
// ============================================================================
export function createPulseCastle(config = {}) {
  const core = new PulseCastle(config);

  return Object.freeze({
    meta: PulseCastleMeta,

    registerCastle(payload) {
      return core.registerCastle(payload);
    },

    registerUserAtCastle(payload) {
      return core.registerUserAtCastle(payload);
    },

    bindServerToUser(payload) {
      return core.bindServerToUser(payload);
    },

    attachServerToCastle(payload) {
      return core.attachServerToCastle(payload);
    },

    detachServerFromCastle(payload) {
      return core.detachServerFromCastle(payload);
    },

    getPresenceState() {
      return core.getPresenceState();
    },

    getMeshState() {
      return core.getMeshState();
    },

    getServersForCastle(castleId) {
      return core.getServersForCastle(castleId);
    },

    getUserBindingsForCastle(castleId) {
      return core.getUserBindingsForCastle(castleId);
    },

    // v13+ hooks
    applyTreasuryDelta(payload) {
      return core.applyTreasuryDelta(payload);
    },

    registerSoldier(payload) {
      return core.registerSoldier(payload);
    },

    unregisterSoldier(payload) {
      return core.unregisterSoldier(payload);
    },

    // v14-IMMORTAL expansion / NodeAdmin surface
    registerExpansionRoute(payload) {
      return core.registerExpansionRoute(payload);
    },

    getExpansionRoutes() {
      return core.getExpansionRoutes();
    },

    spawnNodeAdminLoop(payload) {
      return core.spawnNodeAdminLoop(payload);
    },

    getNodeAdminLoops() {
      return core.getNodeAdminLoops();
    }
  });
}

export const pulseCastle = createPulseCastle();
