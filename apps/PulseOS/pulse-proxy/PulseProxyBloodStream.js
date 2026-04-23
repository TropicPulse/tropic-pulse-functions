// ============================================================================
//  PULSE OS v10.4 — TELEMETRY ORGAN
//  Unified Metrics • Subsystem Heartbeats • Drift Detection
//  Mesh‑Aware Telemetry Propagation (Mini‑Pulse Distance Engine)
//  PURE NERVOUS‑SYSTEM ORGAN — NO BACKEND, NO DOM, NO GPU, NO STATE MUTATION
// ============================================================================


// ============================================================================
//  ORGAN IDENTITY — v10.4
// ============================================================================
export const PulseRole = {
  type: "Organ",
  subsystem: "PulseTelemetry",
  layer: "Bloodstream",
  version: "10.4",
  identity: "PulseTelemetryOrgan",

  evo: {
    driftProof: true,
    pulseEfficiencyAware: true,
    unifiedAdvantageField: true,
    multiInstanceReady: true,
    meshPulseReady: true,
    sensorOnly: true,
    noDecisionMaking: true,
    futureEvolutionReady: true
  }
};


// ============================================================================
// INTERNAL STATE — Telemetry Bloodstream (bounded)
// ============================================================================
const telemetryStream = [];
const MAX_STREAM_SIZE = 5000;

// Mini‑Pulse mesh settings
const MAX_HOPS = 5;
const DEFAULT_DISTANCE = 1;


// ============================================================================
// EMIT TELEMETRY — Universal signal emitter (v10.4)
// ============================================================================
export function emitTelemetry(subsystem, event, data = {}) {
  try {
    const packet = logger.makeTelemetryPacket(subsystem, event, {
      ...data,
      lineage: PulseLineage[subsystem],
      hops: 0,
      distance: DEFAULT_DISTANCE,
      meta: {
        layer: PulseRole.layer,
        version: PulseRole.version,
        subsystem,
        event
      }
    });

    telemetryStream.push(packet);
    if (telemetryStream.length > MAX_STREAM_SIZE) telemetryStream.shift();

    broadcastTelemetry(packet);

    return packet;

  } catch (err) {
    logger.error("telemetry", "emit_failed", { error: String(err) });
    return null;
  }
}


// ============================================================================
// MINI‑PULSE BROADCAST — Mesh‑safe propagation (v10.4)
// ============================================================================
export function broadcastTelemetry(packet) {
  try {
    if (!packet || typeof packet !== "object") return;
    if (packet.hops >= MAX_HOPS) return;

    const amplified = amplifyPulse(packet);

    logger.log("telemetry", "broadcast", {
      subsystem: amplified.subsystem,
      hops: amplified.hops,
      distance: amplified.distance
    });

  } catch (err) {
    logger.error("telemetry", "broadcast_failed", { error: String(err) });
  }
}


// ============================================================================
// MINI‑PULSE AMPLIFIER — Increase distance + hop count (v10.4)
// ============================================================================
export function amplifyPulse(packet) {
  return {
    ...packet,
    hops: packet.hops + 1,
    distance: packet.distance + 1
  };
}


// ============================================================================
// RECEIVE MESH PULSE — Accept telemetry from other nodes (v10.4)
// ============================================================================
export function receiveMeshPulse(packet) {
  try {
    if (!packet || typeof packet !== "object") return;
    if (packet.hops >= MAX_HOPS) return;

    telemetryStream.push(packet);
    if (telemetryStream.length > MAX_STREAM_SIZE) telemetryStream.shift();

    broadcastTelemetry(packet);

  } catch (err) {
    logger.error("telemetry", "mesh_receive_failed", { error: String(err) });
  }
}


// ============================================================================
// HEARTBEAT — Subsystem periodic pulse (v10.4)
// ============================================================================
export function heartbeat(subsystem, extra = {}) {
  return emitTelemetry(subsystem, "heartbeat", {
    version: PulseVersion[subsystem],
    role: PulseRoles[subsystem],
    ...extra
  });
}


// ============================================================================
// DRIFT DETECTION (v10.4)
// ============================================================================
export function detectDrift(subsystem, expectedVersion) {
  const actual = PulseVersion[subsystem];
  if (actual !== expectedVersion) {
    return emitTelemetry(subsystem, "version-drift", {
      expected: expectedVersion,
      actual
    });
  }
  return null;
}


// ============================================================================
// ANOMALY (v10.4)
// ============================================================================
export function anomaly(subsystem, description, details = {}) {
  return emitTelemetry(subsystem, "anomaly", {
    description,
    ...details
  });
}


// ============================================================================
// PERFORMANCE METRICS (v10.4)
// ============================================================================
export function metric(subsystem, name, value, extra = {}) {
  return emitTelemetry(subsystem, "metric", {
    name,
    value,
    ...extra
  });
}


// ============================================================================
// STREAM ACCESS (v10.4)
// ============================================================================
export function getStream(limit = 500) {
  if (limit <= 0) return [...telemetryStream];
  return telemetryStream.slice(-limit);
}


// ============================================================================
// SNAPSHOT (v10.4)
// ============================================================================
export function getTelemetrySnapshot() {
  const latest = telemetryStream.slice(-200);
  const bySubsystem = {};

  latest.forEach((p) => {
    if (!bySubsystem[p.subsystem]) bySubsystem[p.subsystem] = [];
    bySubsystem[p.subsystem].push(p);
  });

  return {
    ts: Date.now(),
    totalPackets: telemetryStream.length,
    recentPackets: latest.length,
    bySubsystem,
    meta: {
      layer: PulseRole.layer,
      version: PulseRole.version
    }
  };
}


// ============================================================================
// EXPORTS — Telemetry Organ API (v10.4)
// ============================================================================
export const PulseTelemetry = {
  emit: emitTelemetry,
  heartbeat,
  detectDrift,
  anomaly,
  metric,
  getStream,
  getTelemetrySnapshot,
  broadcastTelemetry,
  receiveMeshPulse,
  amplifyPulse,
  meta: {
    layer: PulseRole.layer,
    version: PulseRole.version
  },
  PulseRole
};
