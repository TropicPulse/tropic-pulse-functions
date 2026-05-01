// ============================================================================
// FILE: PulseMeshPresenceRelay-v12.4-EVO.js
// PULSE MESH PRESENCE RELAY — v12.4-EVO
// Mesh-Level Presence • Nearby Scan • Metadata-Only • Membrane-Safe
// Bridges Mesh → Presence → Window (no organs exposed)
// ============================================================================

export function createPulseMeshPresenceRelay({
  MeshBus,           // publish/subscribe bus (safe, metadata-only)
  SystemClock,       // uptime + age (safe)
  IdentityDirectory, // safeName + safeId (no secrets)
  log, warn, error
}) {
  const meta = Object.freeze({
    layer: "PulseMeshPresenceRelay",
    role: "MESH_PRESENCE_RELAY",
    version: "12.4-EVO",
    evo: {
      presenceRelay: true,
      meshLevel: true,
      deterministic: true,
      driftProof: true,
      zeroTrustSurface: true,
      zeroSecrets: true,
      zeroRouting: true,
      zeroOrgans: true
    },
    contract: {
      never: [
        "expose internal mesh topology",
        "expose routing tables",
        "expose CNS",
        "expose private identity",
        "expose permissions"
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

  const nearbyMap = new Map(); // uid -> presence packet

  function safeNow() {
    try {
      return SystemClock?.now
        ? SystemClock.now()
        : Date.now();
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
  // MESH EVENT HANDLERS
  // --------------------------------------------------------------------------
  function handleMeshPresence(packet) {
    try {
      if (!packet || !packet.uid) return;

      const enriched = {
        uid: packet.uid,
        displayName: safeDisplayName(packet.uid),
        distance: packet.distance ?? null,
        presenceBand: packet.presenceBand ?? "MESH",
        lastSeen: safeNow(),
        systemAgeDays: packet.systemAgeDays ?? null
      };

      nearbyMap.set(packet.uid, enriched);
      log?.("presence", "Mesh presence update", enriched);
    } catch (err) {
      warn?.("presence", "Mesh presence handler failed", err);
    }
  }

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
  // PUBLIC API: scanNearby() — for PresenceScanner / PresenceAwareness page
  // --------------------------------------------------------------------------
  function scanNearby() {
    try {
      const now = safeNow();
      const MAX_AGE_MS = 60_000; // 60s presence window

      const result = [];
      for (const [uid, p] of nearbyMap.entries()) {
        if (!p.lastSeen || now - p.lastSeen > MAX_AGE_MS) {
          nearbyMap.delete(uid);
          continue;
        }
        result.push({
          uid: p.uid,
          distance: p.distance,
          presenceBand: p.presenceBand,
          systemAgeDays: p.systemAgeDays ?? null
        });
      }

      return result;
    } catch (err) {
      warn?.("presence", "scanNearby failed", err);
      return [];
    }
  }

  // --------------------------------------------------------------------------
  // OPTIONAL: broadcastSelfPresence (if wired to OS presence)
// --------------------------------------------------------------------------
  function broadcastSelfPresence(selfPresencePacket) {
    try {
      if (!MeshBus || typeof MeshBus.emit !== "function") return;
      if (!selfPresencePacket || !selfPresencePacket.uid) return;

      MeshBus.emit("presence", {
        uid: selfPresencePacket.uid,
        distance: 0,
        presenceBand: selfPresencePacket.presenceBand ?? "OS_CORE",
        systemAgeDays: selfPresencePacket.organismAgeDays ?? null
      });
    } catch (err) {
      warn?.("presence", "broadcastSelfPresence failed", err);
    }
  }

  // Boot subscription immediately when created
  subscribe();

  return Object.freeze({
    meta,
    scanNearby,
    broadcastSelfPresence
  });
}

// Default export for simple wiring
const DefaultPulseMeshPresenceRelay = {
  create: createPulseMeshPresenceRelay
};

export default DefaultPulseMeshPresenceRelay;
