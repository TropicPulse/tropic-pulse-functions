// ============================================================================
// FILE: PulseMeshPresenceRelay-v16.js
// PULSE MESH PRESENCE RELAY — v16-IMMORTAL
// Mesh-Level Presence • Nearby Scan • Advantage/Band/Region Aware
// Metadata-Only • Membrane-Safe • NodeAdmin-Ready
// ============================================================================

/*
AI_EXPERIENCE_META = {
  identity: "PulseMeshPresenceRelay",
  version: "v16-IMMORTAL",
  layer: "mesh",
  role: "presence_to_mesh_bridge",
  lineage: "PulseMesh-v15-Evo-Immortal",

  evo: {
    presenceAware: true,             // Reads presence field
    meshAware: true,                 // Writes mesh presence signals
    binaryAware: true,               // Binary presence hints
    symbolicAware: true,             // Symbolic presence hints
    dualBand: true,                  // Binary + symbolic bands
    bandAware: true,                 // Band stats + filters
    advantageAware: true,            // Advantage field hints
    regionAware: true,               // Region / shard tags
    beaconAware: true,               // Beacon-style presence packets
    deterministic: true,
    driftProof: true,
    metadataOnly: true,
    zeroMutationOfInput: true,
    zeroNetworkFetch: true,
    safeRouteFree: true,
    zeroExternalMutation: true,
    nodeAdminReady: true,            // Shapes data for PresenceJobView / NodeAdmin
    multiInstanceReady: true,
    futureEvolutionReady: true
  },

  contract: {
    always: [
      "PulsePresence",
      "PulseMeshAwareness",
      "PulseMeshAura"
    ],
    never: [
      "legacyMeshPresenceRelay",
      "safeRoute",
      "fetchViaCNS",
      "exposeInternalMeshTopology",
      "exposeRoutingTables",
      "exposeCNS",
      "exposePrivateIdentity",
      "exposePermissions",
      "exposeOSInternals"
    ]
  }
}
*/

// ============================================================================
// FACTORY — v16-IMMORTAL
// ============================================================================

export function createPulseMeshPresenceRelay({
  MeshBus,            // safe metadata-only pub/sub
  SystemClock,        // uptime + age (safe)
  IdentityDirectory,  // safeName + safeId (no secrets)
  log,
  warn,
  error
}) {
  // --------------------------------------------------------------------------
  // IMMORTAL META
  // --------------------------------------------------------------------------
  const meta = Object.freeze({
    layer: "PulseMeshPresenceRelay",
    role: "MESH_PRESENCE_RELAY",
    version: "v16-IMMORTAL",
    lineage: "PulseMesh-v16",
    target: "full-mesh",
    selfRepairable: true,

    evo: Object.freeze({
      presenceRelay: true,
      meshLevel: true,
      deterministic: true,
      driftProof: true,
      zeroTrustSurface: true,
      zeroSecrets: true,
      zeroRouting: true,
      zeroOrgans: true,
      zeroCompute: true,
      zeroMutation: true,
      zeroNetworkFetch: true,
      safeRouteFree: true,

      // IMMORTAL+ upgrades
      presenceAware: true,
      bandAware: true,
      binaryAware: true,
      symbolicAware: true,
      dualBand: true,
      meshAware: true,
      advantageAware: true,
      unifiedAdvantageField: true,
      regionAware: true,
      beaconAware: true,
      multiInstanceReady: true,
      nodeAdminReady: true,
      futureEvolutionReady: true
    }),

    contract: Object.freeze({
      never: [
        "expose internal mesh topology",
        "expose routing tables",
        "expose CNS",
        "expose private identity",
        "expose permissions",
        "expose OS internals"
      ],
      always: [
        "relay metadata-only presence",
        "stay deterministic",
        "stay membrane-safe",
        "stay read-only",
        "stay mesh-level only"
      ]
    })
  });

  // --------------------------------------------------------------------------
  // INTERNAL STATE — deterministic, drift-proof
  // --------------------------------------------------------------------------
  // nearbyMap: uid -> enriched presence packet
  const nearbyMap = new Map();

  // bandStats: band -> { count, lastSeen }
  const bandStats = new Map();

  let lastScanAt = 0;

  // --------------------------------------------------------------------------
  // SAFE HELPERS
  // --------------------------------------------------------------------------
  function safeNow() {
    try {
      return SystemClock?.now ? SystemClock.now() : Date.now();
    } catch {
      return Date.now();
    }
  }

  function safeDisplayName(uid) {
    try {
      return IdentityDirectory?.safeName
        ? IdentityDirectory.safeName(uid)
        : uid;
    } catch {
      return uid;
    }
  }

  function classifySystemAgeDays(days) {
    if (typeof days !== "number" || !Number.isFinite(days)) return "unknown";
    if (days < 7) return "new";
    if (days < 90) return "growing";
    if (days < 365) return "established";
    return "veteran";
  }

  function normalizePresenceBand(band) {
    if (!band) return "mesh";
    const v = String(band).toUpperCase();
    if (v.includes("BINARY")) return "binary";
    if (v.includes("SYMBOLIC")) return "symbolic";
    if (v.includes("DUAL")) return "dual";
    if (v.includes("MESH")) return "mesh";
    return "mesh";
  }

  function updateBandStats(band, now) {
    const key = normalizePresenceBand(band);
    const prev = bandStats.get(key) || { count: 0, lastSeen: 0 };
    bandStats.set(key, {
      count: prev.count + 1,
      lastSeen: now
    });
  }

  // --------------------------------------------------------------------------
  // IMMORTAL PRESENCE ENRICHMENT (v16+)
// --------------------------------------------------------------------------
// Accepts both legacy mesh presence packets and beacon-style packets:
//   • { uid, distance, presenceBand, systemAgeDays, advantageHint, regionTag, meshStatus }
//   • { presenceField, advantageField, bandSignature, regionTag, meshStatus, uid? }
// --------------------------------------------------------------------------
  function extractUid(packet) {
    if (!packet) return null;
    if (packet.uid) return packet.uid;
    if (packet.presenceField?.uid) return packet.presenceField.uid;
    return null;
  }

  function enrichPresence(packet) {
    const now = safeNow();
    const uid = extractUid(packet);
    if (!uid) return null;

    const presenceField = packet.presenceField || packet.presence || null;
    const advantageField = packet.advantageField || null;

    const distance =
      packet.distance ??
      presenceField?.distance ??
      null;

    const presenceBand =
      normalizePresenceBand(
        packet.presenceBand ??
        presenceField?.presenceBand ??
        packet.bandSignature ??
        "mesh"
      );

    const systemAgeDays =
      packet.systemAgeDays ??
      presenceField?.systemAgeDays ??
      null;

    const regionTag =
      packet.regionTag ??
      presenceField?.regionTag ??
      presenceField?.region ??
      null;

    const meshStatus =
      packet.meshStatus ??
      presenceField?.meshStatus ??
      null;

    const advantageHint =
      packet.advantageHint ??
      advantageField?.hint ??
      null;

    const advantageVector = advantageField?.vector ?? null;

    const systemAgeBand = classifySystemAgeDays(systemAgeDays);

    return {
      uid,
      displayName: safeDisplayName(uid),

      // spatial-ish metadata (never trusted, never used for auth)
      distance,
      regionTag,
      meshStatus,

      // band + age
      presenceBand,
      systemAgeDays,
      systemAgeBand,

      // IMMORTAL additions
      lastSeen: now,
      presenceAgeMs: 0,
      lineage: "presence-relay-v16",
      stability: 1, // updated on scan

      // advantage hints (symbolic only)
      advantageHint,
      advantageVector,

      // raw fields (metadata-only, frozen on snapshot)
      _rawPresenceField: presenceField || null,
      _rawAdvantageField: advantageField || null
    };
  }

  // --------------------------------------------------------------------------
  // MESH EVENT HANDLER
  // --------------------------------------------------------------------------
  function handleMeshPresence(packet) {
    try {
      if (!packet) return;

      const enriched = enrichPresence(packet);
      if (!enriched) return;

      nearbyMap.set(enriched.uid, enriched);
      updateBandStats(enriched.presenceBand, enriched.lastSeen);

      log?.("presence", "Mesh presence update (v16)", {
        uid: enriched.uid,
        band: enriched.presenceBand,
        region: enriched.regionTag
      });
    } catch (err) {
      warn?.("presence", "Mesh presence handler failed", err);
    }
  }

  // --------------------------------------------------------------------------
  // SUBSCRIBE TO MESH BUS
  // --------------------------------------------------------------------------
  function subscribe() {
    try {
      if (!MeshBus || typeof MeshBus.on !== "function") return;
      MeshBus.on("presence", handleMeshPresence);
      log?.("presence", "MeshPresenceRelay v16 subscribed to MeshBus");
    } catch (err) {
      warn?.("presence", "MeshPresenceRelay subscribe failed", err);
    }
  }

  // --------------------------------------------------------------------------
  // IMMORTAL PRESENCE WINDOW SCAN — v16+
// --------------------------------------------------------------------------
// OPTIONS:
//   • maxAgeMs?: number (default 60_000)
//   • band?: "binary" | "symbolic" | "dual" | "mesh" | "any"
//   • regionTag?: string
//   • limit?: number
// --------------------------------------------------------------------------
  function scanNearby({
    maxAgeMs = 60_000,
    band = "any",
    regionTag = null,
    limit = null
  } = {}) {
    try {
      const now = safeNow();
      lastScanAt = now;

      const result = [];
      const bandFilter = band === "any" ? null : normalizePresenceBand(band);

      for (const [uid, p] of nearbyMap.entries()) {
        const age = now - (p.lastSeen || 0);

        if (age > maxAgeMs) {
          nearbyMap.delete(uid);
          continue;
        }

        // IMMORTAL presence stability scoring
        const stability =
          age < 10_000 ? 1 :
          age < 20_000 ? 0.8 :
          age < 40_000 ? 0.6 :
          0.4;

        if (bandFilter && normalizePresenceBand(p.presenceBand) !== bandFilter) {
          continue;
        }

        if (regionTag && p.regionTag !== regionTag) {
          continue;
        }

        const entry = {
          uid: p.uid,
          displayName: p.displayName,
          distance: p.distance,
          presenceBand: p.presenceBand,
          systemAgeDays: p.systemAgeDays,
          systemAgeBand: p.systemAgeBand,
          presenceAgeMs: age,
          stability,
          regionTag: p.regionTag,
          meshStatus: p.meshStatus,
          lineage: p.lineage,
          advantageHint: p.advantageHint ?? null
        };

        result.push(entry);

        if (typeof limit === "number" && limit > 0 && result.length >= limit) {
          break;
        }
      }

      return Object.freeze(result);
    } catch (err) {
      warn?.("presence", "scanNearby failed", err);
      return Object.freeze([]);
    }
  }

  // --------------------------------------------------------------------------
  // NODEADMIN / PRESENCE-JOB VIEW WINDOW
  // --------------------------------------------------------------------------
  // Shape tuned for PresenceJobView.build(...).nearbyPresence-style usage.
  function getNearbyPresenceWindow(options = {}) {
    const nearby = scanNearby(options);
    return Object.freeze({
      nearbyPresence: nearby,
      bandStats: getBandStats(),
      lastScanAt
    });
  }

  // --------------------------------------------------------------------------
  // BAND STATS SNAPSHOT
  // --------------------------------------------------------------------------
  function getBandStats() {
    const out = {};
    for (const [band, s] of bandStats.entries()) {
      out[band] = {
        count: s.count,
        lastSeen: s.lastSeen
      };
    }
    return Object.freeze(out);
  }

  // --------------------------------------------------------------------------
  // FULL SNAPSHOT (META + NEARBY + BANDS)
// --------------------------------------------------------------------------
  function getPresenceSnapshot(options = {}) {
    const nearby = scanNearby(options);
    return Object.freeze({
      meta,
      count: nearby.length,
      bands: getBandStats(),
      lastScanAt,
      nearby
    });
  }

  // --------------------------------------------------------------------------
  // BROADCAST SELF PRESENCE (optional, metadata-only)
// --------------------------------------------------------------------------
  function broadcastSelfPresence(selfPresencePacket) {
    try {
      if (!MeshBus || typeof MeshBus.emit !== "function") return;
      if (!selfPresencePacket || !selfPresencePacket.uid) return;

      MeshBus.emit("presence", {
        uid: selfPresencePacket.uid,
        distance: 0,
        presenceBand: selfPresencePacket.presenceBand ?? "OS_CORE",
        systemAgeDays: selfPresencePacket.organismAgeDays ?? null,
        advantageHint: selfPresencePacket.advantageHint ?? null,
        regionTag: selfPresencePacket.regionTag ?? null,
        meshStatus: selfPresencePacket.meshStatus ?? null
      });
    } catch (err) {
      warn?.("presence", "broadcastSelfPresence failed", err);
    }
  }

  // --------------------------------------------------------------------------
  // BOOT
  // --------------------------------------------------------------------------
  subscribe();

  // --------------------------------------------------------------------------
  // PUBLIC API — v16-IMMORTAL
  // --------------------------------------------------------------------------
  return Object.freeze({
    meta,

    // core presence window
    scanNearby,
    getNearbyPresenceWindow,
    getPresenceSnapshot,
    getBandStats,

    // broadcast
    broadcastSelfPresence
  });
}

const DefaultPulseMeshPresenceRelay = {
  create: createPulseMeshPresenceRelay
};

export default DefaultPulseMeshPresenceRelay;
