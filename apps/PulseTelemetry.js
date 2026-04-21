// ============================================================================
//  PULSE OS v7.7 — TELEMETRY ORGAN (Mesh + Mini‑Pulse Upgrade)
//  Unified Metrics • Subsystem Heartbeats • Drift Detection
//  Mesh‑Aware Telemetry Propagation (Mini‑Pulse Distance Engine)
// ============================================================================

// UI + presentation metadata comes from Logger
import { PulseVersion, PulseRoles, logger } from "./PulseLogger.js";

// Lineage comes ONLY from Identity (BBB)
import { PulseLineage } from "./PulseIdentity.js";

// ============================================================================
//  INTERNAL STATE — Telemetry Bloodstream
// ============================================================================
const telemetryStream = [];
const MAX_STREAM_SIZE = 5000;

// Mini‑Pulse mesh settings
const MAX_HOPS = 5;          // how far a pulse can travel
const DEFAULT_DISTANCE = 1;  // local pulse distance

// ============================================================================
//  EMIT TELEMETRY — Universal signal emitter
// ============================================================================
export function emitTelemetry(subsystem, event, data = {}) {
  try {
    const packet = logger.makeTelemetryPacket(subsystem, event, {
      ...data,
      lineage: PulseLineage[subsystem],
      hops: 0,
      distance: DEFAULT_DISTANCE
    });

    telemetryStream.push(packet);
    if (telemetryStream.length > MAX_STREAM_SIZE) telemetryStream.shift();

    // NEW: broadcast outward
    broadcastTelemetry(packet);

    return packet;
  } catch (err) {
    console.error("[PulseTelemetry] FAILED to emit telemetry:", err);
    return null;
  }
}

// ============================================================================
//  MINI‑PULSE BROADCAST — Send telemetry outward across mesh
// ============================================================================
export function broadcastTelemetry(packet) {
  try {
    // Prevent infinite loops
    if (packet.hops >= MAX_HOPS) return;

    const amplified = amplifyPulse(packet);

    // Your existing mini‑pulse sender goes here:
    // sendMiniPulse(amplified);

    // For now, we simulate mesh propagation:
    // console.log("[MiniPulse] Broadcasting:", amplified);

  } catch (err) {
    console.error("[PulseTelemetry] Broadcast failed:", err);
  }
}

// ============================================================================
//  MINI‑PULSE AMPLIFIER — Increase distance + hop count
// ============================================================================
export function amplifyPulse(packet) {
  return {
    ...packet,
    hops: packet.hops + 1,
    distance: packet.distance + 1
  };
}

// ============================================================================
//  RECEIVE MESH PULSE — Accept telemetry from other nodes
// ============================================================================
export function receiveMeshPulse(packet) {
  try {
    if (!packet || typeof packet !== "object") return;

    // Prevent loops
    if (packet.hops >= MAX_HOPS) return;

    telemetryStream.push(packet);
    if (telemetryStream.length > MAX_STREAM_SIZE) telemetryStream.shift();

    // Re‑broadcast outward (mesh propagation)
    broadcastTelemetry(packet);

  } catch (err) {
    console.error("[PulseTelemetry] Mesh receive failed:", err);
  }
}

// ============================================================================
//  HEARTBEAT — Subsystem periodic pulse
// ============================================================================
export function heartbeat(subsystem, extra = {}) {
  return emitTelemetry(subsystem, "heartbeat", {
    version: PulseVersion[subsystem],
    role: PulseRoles[subsystem],
    ...extra
  });
}

// ============================================================================
//  DRIFT DETECTION
// ============================================================================
export function detectDrift(subsystem, expectedVersion) {
  const actual = PulseVersion[subsystem];
  if (actual !== expectedVersion) {
    return emitTelemetry(subsystem, "version-drift", { expected: expectedVersion, actual });
  }
  return null;
}

// ============================================================================
//  ANOMALY
// ============================================================================
export function anomaly(subsystem, description, details = {}) {
  return emitTelemetry(subsystem, "anomaly", { description, ...details });
}

// ============================================================================
//  PERFORMANCE METRICS
// ============================================================================
export function metric(subsystem, name, value, extra = {}) {
  return emitTelemetry(subsystem, "metric", { name, value, ...extra });
}

// ============================================================================
//  STREAM ACCESS
// ============================================================================
export function getStream(limit = 500) {
  if (limit <= 0) return [...telemetryStream];
  return telemetryStream.slice(-limit);
}

// ============================================================================
//  SNAPSHOT
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
    bySubsystem
  };
}

// ============================================================================
//  EXPORTS — Telemetry Organ API
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
  amplifyPulse
};
