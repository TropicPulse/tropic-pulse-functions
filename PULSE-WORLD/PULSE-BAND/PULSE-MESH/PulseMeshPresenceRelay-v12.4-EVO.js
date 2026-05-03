// ============================================================================
// FILE: PulseMeshPresenceRelay-v12.4-EVO.js
// PULSE MESH PRESENCE RELAY — v12.4-EVO
// Mesh-Level Presence • Nearby Scan • Metadata-Only • Membrane-Safe
// Bridges Mesh → Presence → Window (no organs exposed)
// ============================================================================
/*
AI_EXPERIENCE_META = {
  identity: "PulseMeshPresenceRelay",
  version: "v14.9-MESH-PRESENCE-RELAY",
  layer: "mesh",
  role: "presence_to_mesh_bridge",
  lineage: "PulseMesh-v14",

  evo: {
    presenceAware: true,            // Reads presence field
    meshAware: true,                // Writes mesh presence signals
    binaryAware: true,              // Binary presence hints
    symbolicAware: true,            // Symbolic presence hints
    dualBand: true,
    deterministic: true,
    driftProof: true,
    metadataOnly: true,
    zeroMutationOfInput: true,
    zeroNetworkFetch: true,
    safeRouteFree: true,
    zeroExternalMutation: true
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
      "fetchViaCNS"
    ]
  }
}
*/
// ============================================================================
// FILE: PulseMeshPresenceRelay-v15-EVO-IMMORTAL.js
// PULSE MESH PRESENCE RELAY — v15-EVO-IMMORTAL
// Mesh-Level Presence • Nearby Scan • Metadata-Only • Membrane-Safe
// Bridges Mesh → Presence → Window (no organs exposed)
// ============================================================================

export function createPulseMeshPresenceRelay({
  MeshBus,            // safe metadata-only pub/sub
  SystemClock,        // uptime + age (safe)
  IdentityDirectory,  // safeName + safeId (no secrets)
  log, warn, error
}) {

  // --------------------------------------------------------------------------
  // IMMORTAL META
  // --------------------------------------------------------------------------
  const meta = Object.freeze({
    layer: "PulseMeshPresenceRelay",
    role: "MESH_PRESENCE_RELAY",
    version: "15-EVO-IMMORTAL",
    lineage: "PulseMesh-v15",
    target: "full-mesh",
    selfRepairable: true,

    evo: {
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

      // IMMORTAL upgrades
      presenceAware: true,
      bandAware: true,
      binaryAware: true,
      symbolicAware: true,
      dualBand: true,
      meshAware: true,
      advantageAware: true,
      unifiedAdvantageField: true,
      futureEvolutionReady: true,
      multiInstanceReady: true
    },

    contract: {
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
    }
  });

  // --------------------------------------------------------------------------
  // INTERNAL STATE — deterministic, drift-proof
  // --------------------------------------------------------------------------
  const nearbyMap = new Map(); // uid -> presence packet

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

  // --------------------------------------------------------------------------
  // IMMORTAL PRESENCE ENRICHMENT
  // --------------------------------------------------------------------------
  function enrichPresence(packet) {
    const now = safeNow();

    return {
      uid: packet.uid,
      displayName: safeDisplayName(packet.uid),

      // distance is metadata-only, never trusted
      distance: packet.distance ?? null,

      // presence band (binary / symbolic / dual / mesh)
      presenceBand: packet.presenceBand ?? "mesh",

      // system age (safe)
      systemAgeDays: packet.systemAgeDays ?? null,

      // IMMORTAL additions
      lastSeen: now,
      presenceAgeMs: 0,
      lineage: "presence-relay-v15",
      stability: 1, // updated on scan
      advantageHint: packet.advantageHint ?? null
    };
  }

  // --------------------------------------------------------------------------
  // MESH EVENT HANDLER
  // --------------------------------------------------------------------------
  function handleMeshPresence(packet) {
    try {
      if (!packet || !packet.uid) return;

      const enriched = enrichPresence(packet);
      nearbyMap.set(packet.uid, enriched);

      log?.("presence", "Mesh presence update", enriched);
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
      log?.("presence", "MeshPresenceRelay subscribed to MeshBus");
    } catch (err) {
      warn?.("presence", "MeshPresenceRelay subscribe failed", err);
    }
  }

  // --------------------------------------------------------------------------
  // IMMORTAL PRESENCE WINDOW SCAN
  // --------------------------------------------------------------------------
  function scanNearby() {
    try {
      const now = safeNow();
      const MAX_AGE_MS = 60_000; // 60s window

      const result = [];

      for (const [uid, p] of nearbyMap.entries()) {
        const age = now - (p.lastSeen || 0);

        if (age > MAX_AGE_MS) {
          nearbyMap.delete(uid);
          continue;
        }

        // IMMORTAL presence stability scoring
        const stability =
          age < 10_000 ? 1 :
          age < 20_000 ? 0.8 :
          age < 40_000 ? 0.6 :
          0.4;

        result.push({
          uid: p.uid,
          distance: p.distance,
          presenceBand: p.presenceBand,
          systemAgeDays: p.systemAgeDays,
          presenceAgeMs: age,
          stability,
          lineage: p.lineage,
          advantageHint: p.advantageHint ?? null
        });
      }

      return result;
    } catch (err) {
      warn?.("presence", "scanNearby failed", err);
      return [];
    }
  }

  // --------------------------------------------------------------------------
  // BROADCAST SELF PRESENCE (optional)
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
        advantageHint: selfPresencePacket.advantageHint ?? null
      });
    } catch (err) {
      warn?.("presence", "broadcastSelfPresence failed", err);
    }
  }

  // --------------------------------------------------------------------------
  // BOOT
  // --------------------------------------------------------------------------
  subscribe();

  return Object.freeze({
    meta,
    scanNearby,
    broadcastSelfPresence
  });
}

const DefaultPulseMeshPresenceRelay = {
  create: createPulseMeshPresenceRelay
};

export default DefaultPulseMeshPresenceRelay;
