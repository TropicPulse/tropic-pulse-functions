// ============================================================================
// FILE: PulseOSPresence-v12.4-EVO.js
// PULSE OS PRESENCE ORGAN — v12.4-EVO
// OS-Level Presence • Deterministic • Metadata-Only • Membrane-Safe
// No Organs Exposed • No Identity Leaks • No Routing
// ============================================================================

export function createPulseOSPresence({
  SystemClock,       // uptime + organism age (safe)
  IdentityDirectory, // safeName + safeId (no secrets)
  DeviceFingerprint, // safe, non-PII fingerprint (optional)
  log, warn, error
}) {
  const meta = Object.freeze({
    layer: "PulseOSPresence",
    role: "OS_PRESENCE_ORGAN",
    version: "12.4-EVO",
    evo: {
      presenceOrgan: true,
      osLevel: true,
      deterministic: true,
      driftProof: true,
      zeroTrustSurface: true,
      zeroSecrets: true,
      zeroRouting: true,
      zeroOrgans: true
    },
    contract: {
      never: [
        "expose internal organs",
        "expose routing tables",
        "expose CNS",
        "expose private identity",
        "expose permissions"
      ],
      always: [
        "emit metadata-only presence",
        "stay deterministic",
        "stay membrane-safe",
        "stay binary-first",
        "stay read-only"
      ]
    }
  });

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
      health: {
        // These can be wired to real vitals later
        status: "alive",
        stability: "stable",
        drift: "none"
      }
    };
  }

  // --------------------------------------------------------------------------
  // SELF PRESENCE PACKET (for PresenceScanner / Mesh / HUD)
// --------------------------------------------------------------------------
  function getSelfPresencePacket() {
    const sig = getPresenceSignature();
    return {
      uid: sig.os.publicId,
      displayName: sig.os.displayName,
      presenceBand: sig.presenceBand,
      uptimeSeconds: sig.time.uptimeSeconds,
      organismAgeDays: sig.time.organismAgeDays,
      fingerprint: sig.os.fingerprint
    };
  }

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
