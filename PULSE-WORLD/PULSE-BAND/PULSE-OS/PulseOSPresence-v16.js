// ============================================================================
// FILE: PulseOSPresence-v16.js
// PULSE OS PRESENCE ORGAN — v16-Immortal
// OS-Level Presence • Deterministic • Metadata-Only • Membrane-Safe
// No Organs Exposed • No Identity Leaks • No Routing • Dualband-Aware
// ============================================================================
//
// LAWS (v16+IMMORTAL+PRESENCE+MESH):
//   • Presence organ is OS-level only — NOT a router, NOT a mesh brain.
//   • Emits metadata-only presence; never exposes organs, routes, CNS, or secrets.
//   • Never performs network calls, never talks to server directly.
//   • Internet center is Expansion ⇄ Server; Presence is a local field emitter.
//   • Binary-aware and dualband-aware, but symbolic-primary in semantics.
//   • Safe to broadcast into MeshBus / PresenceRelay as a self-presence packet.
//   • May carry advantage hints, but never computes or fetches advantage itself.
//   • All advantage/world-lens/topology are snapshots from Brain/Expansion, not here.
// ============================================================================

/*
AI_EXPERIENCE_META = {
  identity: "PulseOSPresence",
  version: "v16-Immortal",
  layer: "presence",
  role: "os_presence_field",
  lineage: "PulseOS-v16-Immortal",

  evo: {
    presenceField: true,
    presenceAwareness: true,
    presenceRelay: true,

    symbolicPrimary: true,
    binaryAware: true,
    dualBand: true,

    deterministic: true,
    driftProof: true,
    zeroNetwork: true,
    zeroFilesystem: true,

    meshAware: true,
    bluetoothPresenceAware: true,

    safeRouteFree: true,
    zeroMutationOfInput: true,
    zeroExternalMutation: true,

    // v16 IMMORTAL upgrades
    internetCenterExternal: true,
    snapshotOnlyInputs: true,
    advantageHintAware: true,
    meshPresenceHintAware: true,
    multiInstanceReady: true,
    clusterCoherence: true
  },

  contract: {
    always: [
      "PulseMeshPresenceRelay",
      "PulsePresenceAwareness",
      "PulsePresenceAIView"
    ],
    never: [
      "legacyOSPresence",
      "safeRoute",
      "fetchViaCNS"
    ]
  }
}
*/

export function createPulseOSPresence({
  SystemClock,       // uptime + organism age (safe)
  IdentityDirectory, // safeName + safeId (no secrets)
  DeviceFingerprint, // safe, non-PII fingerprint (optional)
  log, warn, error
}) {
  const meta = Object.freeze({
    layer: "PulseOSPresence",
    role: "OS_PRESENCE_ORGAN",
    version: "16-Immortal",
    identity: "PulseOSPresence-v16-Immortal",
    evo: Object.freeze({
      presenceOrgan: true,
      osLevel: true,
      deterministic: true,
      driftProof: true,
      zeroTrustSurface: true,
      zeroSecrets: true,
      zeroRouting: true,
      zeroOrgans: true,

      symbolicPrimary: true,
      binaryAware: true,
      dualBand: true,

      meshAware: true,
      bluetoothPresenceAware: true,

      internetCenterExternal: true,
      snapshotOnlyInputs: true,
      advantageHintAware: true,
      meshPresenceHintAware: true,
      multiInstanceReady: true,
      clusterCoherence: true
    }),
    contract: Object.freeze({
      never: [
        "expose internal organs",
        "expose routing tables",
        "expose CNS",
        "expose private identity",
        "expose permissions",
        "expose OS internals"
      ],
      always: [
        "emit metadata-only presence",
        "stay deterministic",
        "stay membrane-safe",
        "stay binary-first",
        "stay read-only",
        "stay dualband-aware"
      ]
    })
  });

  // --------------------------------------------------------------------------
  // SAFE ACCESSORS
  // --------------------------------------------------------------------------
  function safeNow() {
    try {
      return SystemClock?.now
        ? SystemClock.now()
        : Date.now();
    } catch {
      return Date.now();
    }
  }

  function safeUptimeSeconds() {
    try {
      return SystemClock?.uptimeSeconds
        ? SystemClock.uptimeSeconds()
        : 0;
    } catch {
      return 0;
    }
  }

  function safeOrganismAgeDays() {
    try {
      return SystemClock?.organismAgeDays
        ? SystemClock.organismAgeDays()
        : 0;
    } catch {
      return 0;
    }
  }

  function safeDisplayName() {
    try {
      return IdentityDirectory?.safeName
        ? IdentityDirectory.safeName("self")
        : "PulseOS";
    } catch {
      return "PulseOS";
    }
  }

  function safePublicId() {
    try {
      return IdentityDirectory?.safeId
        ? IdentityDirectory.safeId("self")
        : "pulseos-self";
    } catch {
      return "pulseos-self";
    }
  }

  function safeFingerprint() {
    try {
      return DeviceFingerprint?.safeFingerprint
        ? DeviceFingerprint.safeFingerprint()
        : null;
    } catch {
      return null;
    }
  }

  // v16: optional local advantage hint (pure metadata, no network, no secrets)
function safeAdvantageHint() {
  try {
    // Future-ready: if Brain/Expansion injects a snapshot, Presence can surface it.
    const injected = typeof SystemClock?.advantageHint === "function"
      ? SystemClock.advantageHint()
      : null;

    if (injected && typeof injected === "object") {
      return {
        band: injected.band ?? "neutral",
        score: injected.score ?? null,
        stability: injected.stability ?? 1,
        ageMs: injected.ageMs ?? 0,
        source: "injected",
        confidence: injected.confidence ?? 1
      };
    }

    // Default neutral hint (deterministic, metadata-only)
    return {
      band: "neutral",
      score: null,
      stability: 1,
      ageMs: 0,
      source: "os-presence",
      confidence: 1
    };

  } catch {
    // Hard fallback — deterministic, safe, neutral
    return {
      band: "neutral",
      score: null,
      stability: 1,
      ageMs: 0,
      source: "fallback",
      confidence: 1
    };
  }
}


  // v16: mesh presence hint (topology-only, no routing)
  function safeMeshPresenceHint() {
    return {
      topology: "local-os-core",
      band: "mesh",
      relayPreferred: true
    };
  }

  // --------------------------------------------------------------------------
  // OS PRESENCE SIGNATURE (metadata-only, deterministic)
// --------------------------------------------------------------------------
  function getPresenceSignature() {
    const now = safeNow();
    const uptime = safeUptimeSeconds();
    const ageDays = safeOrganismAgeDays();
    const displayName = safeDisplayName();
    const publicId = safePublicId();
    const fingerprint = safeFingerprint();
    const advantageHint = safeAdvantageHint();
    const meshHint = safeMeshPresenceHint();

    return {
      meta,
      os: {
        displayName,
        publicId,
        fingerprint,
        version: meta.version
      },
      time: {
        now,
        uptimeSeconds: uptime,
        organismAgeDays: ageDays
      },
      presenceBand: "OS_CORE",
      bands: {
        symbolic: true,
        binary: true,
        default: "symbolic"
      },
      health: {
        status: "alive",
        stability: "stable",
        drift: "none"
      },
      mesh: {
        topologyHint: meshHint.topology,
        band: meshHint.band,
        relayPreferred: meshHint.relayPreferred
      },
      advantage: {
        band: advantageHint.band,
        score: advantageHint.score
      }
    };
  }

  // --------------------------------------------------------------------------
  // SELF PRESENCE PACKET (for PresenceRelay / Mesh / HUD)
// --------------------------------------------------------------------------
  function getSelfPresencePacket() {
    const sig = getPresenceSignature();
    return {
      uid: sig.os.publicId,
      displayName: sig.os.displayName,

      // presence band for MeshPresenceRelay
      presenceBand: sig.presenceBand,

      // organism age + uptime
      uptimeSeconds: sig.time.uptimeSeconds,
      organismAgeDays: sig.time.organismAgeDays,

      // optional fingerprint (non-PII)
      fingerprint: sig.os.fingerprint,

      // v16: advantage + mesh hints (metadata-only)
      advantageHint: sig.advantage,
      meshPresenceHint: sig.mesh
    };
  }

  // --------------------------------------------------------------------------
  // HEARTBEAT — emits local presence packet (no network)
// --------------------------------------------------------------------------
  function heartbeat() {
    try {
      const packet = getSelfPresencePacket();
      log?.("presence", "OS heartbeat", packet);
      return packet;
    } catch (err) {
      warn?.("presence", "OS heartbeat failed", err);
      return null;
    }
  }

  return Object.freeze({
    meta,
    getPresenceSignature,
    getSelfPresencePacket,
    heartbeat
  });
}

// Default export for simple wiring
const DefaultPulseOSPresence = {
  create: createPulseOSPresence
};

export default DefaultPulseOSPresence;
