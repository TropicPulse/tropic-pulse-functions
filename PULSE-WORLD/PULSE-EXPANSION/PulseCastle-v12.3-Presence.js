// ============================================================================
//  PULSE OS v12.3‑PRESENCE‑EVO++ — PULSE CASTLE (PRESENCE / HOST ORGAN)
//  PulseCastle-v12.3-Presence.js
//
//  ROLE:
//    - Presence + host organ for PulseServer instances.
//    - Manages castles (region/host nodes) and their attached servers.
//    - Maintains awareness of other castles (mesh awareness).
//    - Maintains basic treasury + soldier awareness for economic layer.
//    - Pure symbolic registry + mapping. No compute math, no routing, no AI.
//
//  GUARANTEES:
//    - Deterministic.
//    - No randomness.
//    - No network fetch.
//    - No dynamic imports.
//    - No reinterpretation of PulseServer compute.
// ============================================================================


// ============================================================================
//  IMPORTS (backend-safe)
// ============================================================================
import { logger } from "../PULSEProofLogger.js";

import {
  createPulseServer,
  PulseServerMeta
} from ".//PulseServer-v12.3-Presence";

import { pulseUser, PulseUserMeta, createPulseWorldCore } from "./PulseUser-v12.3-Presence";

// ============================================================================
//  META — Castle Identity
// ============================================================================
export const PulseCastleMeta = Object.freeze({
  layer: "PulseCastle",
  role: "PRESENCE_HOST_ORGAN",
  version: "v12.3-PRESENCE-EVO++",
  identity: "PulseCastle-v12.3-PRESENCE-EVO++",

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

    zeroRandomness: true,
    zeroDynamicImports: true,
    zeroEval: true,
    zeroNetworkFetch: true,
    zeroAI: true,
    zeroRouting: true,
    zeroComputeMath: true // delegates to PulseServer
  }),

  contract: Object.freeze({
    input: [
      "CastleRegistrationRequest",
      "CastlePresenceUpdate",
      "ServerAttachRequest",
      "ServerDetachRequest",
      "CastleMeshQuery"
    ],
    output: [
      "CastleRegistrationResult",
      "CastlePresenceState",
      "ServerAttachResult",
      "ServerDetachResult",
      "CastleMeshState"
    ]
  }),

  lineage: Object.freeze({
    root: "PulseOS-v12.3-PRESENCE-EVO+",
    parent: "PulseProxy-v12.3-PRESENCE-EVO+",
    ancestry: [
      "PulseCastle-v9",
      "PulseCastle-v10",
      "PulseCastle-v11",
      "PulseCastle-v12"
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


// ============================================================================
//  INTERNAL STATE (symbolic, deterministic)
// ============================================================================
//
// castlesById: {
//   [castleId]: {
//     castleId,
//     regionId,
//     hostName,
//     presenceField: {
//       regionId,
//       hostName,
//       tier,
//       capacityHint,
//       tags[],
//       loadIndex,
//       stressIndex,
//       presenceScore
//     },
//     serversById: { [serverId]: { serverId, serverMeta, serverInstance } },
//     soldiersById: { [soldierId]: { soldierId, meta } },
//     treasury: { balance, lastDelta }
//   }
// }
//
const castlesById = Object.create(null);

// meshLinksByCastleId: { [castleId]: Set<castleId> }
const meshLinksByCastleId = Object.create(null);


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

export function computeCastlePresence(castle) {
  const serverCount = Object.keys(castle.serversById || {}).length;
  const soldierCount = Object.keys(castle.soldiersById || {}).length;
  const capacityHint = castle.presenceField?.capacityHint ?? 1;

  const rawLoad = (serverCount + soldierCount * 0.5) / Math.max(1, capacityHint * 4);
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

export function summarizeCastlePresence(castles = {}) {
  const byRegion = {};
  const meshLinksByCastleId = {};

  for (const castleId in castles) {
    const castle = castles[castleId];
    const region = castle.region || "unknown";

    const presence = computeCastlePresence(castle);

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
      ...presence
    });

    byRegion[region].totalLoad += presence.loadIndex;
    byRegion[region].count++;
  }

  // compute averages
  for (const region in byRegion) {
    const r = byRegion[region];
    r.avgLoad = r.count > 0 ? r.totalLoad / r.count : 0;
  }

  return {
    byRegion,
    meshLinksByCastleId
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

  // recompute presence metrics
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


// ============================================================================
//  CORE ORGAN
// ============================================================================
export class PulseCastle {
  constructor(config = {}) {
    this.config = {
      autoMeshByRegion: true,
      autoMeshAll: false,
      ...config
    };
  }

  // --------------------------------------------------------------------------
  // Register or update a castle presence
  // --------------------------------------------------------------------------
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

  // --------------------------------------------------------------------------
  // Attach a PulseServer instance to a castle
  // --------------------------------------------------------------------------
  attachServerToCastle({
    regionId,
    hostName,
    presenceField = null,
    serverConfig = {},
    serverId = null
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

      // recompute presence after server attach
      const metrics = computeCastlePresence(castle);
      castle.presenceField = { ...castle.presenceField, ...metrics };

      logger?.log?.("castle", "attach_server", {
        castleId,
        serverId: effectiveServerId,
        regionId: rId,
        hostName: hName
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

  // --------------------------------------------------------------------------
  // Detach a PulseServer instance from a castle
  // --------------------------------------------------------------------------
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

  // --------------------------------------------------------------------------
  // Treasury adjustments (symbolic, for future Earn integration)
// --------------------------------------------------------------------------
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

  // --------------------------------------------------------------------------
  // Soldier registry (symbolic, for NodeAdmin / Expansion)
// --------------------------------------------------------------------------
  registerSoldier({ castleId, soldierId, meta = {} }) {
    const castle = castlesById[castleId];
    if (!castle) return { ok: false, reason: "castle_not_found" };

    const id = soldierId || stableHash(`SOLDIER::${castleId}::${JSON.stringify(meta)}`);
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

  // --------------------------------------------------------------------------
  // Get presence / mesh state
  // --------------------------------------------------------------------------
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

  // --------------------------------------------------------------------------
  // Get servers attached to a specific castle
  // --------------------------------------------------------------------------
  getServersForCastle(castleId) {
    const castle = castlesById[castleId];
    if (!castle) return [];

    return Object.values(castle.serversById).map((s) => ({
      castleId,
      serverId: s.serverId,
      serverMeta: s.serverMeta
    }));
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

    // new but non‑breaking hooks
    applyTreasuryDelta(payload) {
      return core.applyTreasuryDelta(payload);
    },

    registerSoldier(payload) {
      return core.registerSoldier(payload);
    },

    unregisterSoldier(payload) {
      return core.unregisterSoldier(payload);
    }
  });
}

export const pulseCastle = createPulseCastle();
