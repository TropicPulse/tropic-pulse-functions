// ============================================================================
//  PULSE OS v7.7 — TELEMETRY ORGAN
//  Unified Metrics • Subsystem Heartbeats • Drift Detection
//  Mesh‑Aware Telemetry Propagation (Mini‑Pulse Distance Engine)
//  PURE NERVOUS‑SYSTEM ORGAN — NO BACKEND, NO DOM, NO GPU
// ============================================================================
//
//  ORGAN DESCRIPTION — WHAT THIS IS (v7.7):
//  ----------------------------------------
//  PulseTelemetry is the **bloodstream** of PulseOS. It carries:
//    • subsystem heartbeats
//    • metrics
//    • anomalies
//    • drift signals
//    • mesh mini‑pulses
//
//  It does NOT:
//    • call backend
//    • use DOM
//    • use GPU
//    • mutate global state outside its bloodstream
//    • perform compute or reasoning
//
//  ROLE IN THE DIGITAL BODY (v7.7):
//  --------------------------------
//    • Bloodstream → circulates telemetry packets
//    • Heartbeat Layer → periodic subsystem pulses
//    • Drift Sentinel → detects version mismatches
//    • Mesh Mini‑Pulse Engine → bounded propagation (MAX_HOPS)
//    • Nervous‑System Organ → renderer‑only, no backend
//
//  SAFETY CONTRACT (v7.7):
//  ------------------------
//    • No console.* (uses logger only)
//    • No external dependencies
//    • No unbounded propagation
//    • Deterministic packet structure
//    • Pure telemetry — no healing, no mutation
//
// ============================================================================

// Correct CNS imports
import { logger } from "../OSKernel/PulseLogger.js";
import { PulseVersion, PulseRoles, PulseLineage } from "../OSKernel/PulseIdentity.js";

// ============================================================================
// INTERNAL STATE — Telemetry Bloodstream
// ============================================================================
const telemetryStream = [];
const MAX_STREAM_SIZE = 5000;

// Mini‑Pulse mesh settings
const MAX_HOPS = 5;          // bounded propagation
const DEFAULT_DISTANCE = 1;  // local pulse distance

// ============================================================================
// EMIT TELEMETRY — Universal signal emitter (v7.7)
// ============================================================================
export function emitTelemetry(subsystem, event, data = {}) {
  try {
    const packet = logger.makeTelemetryPacket(subsystem, event, {
      ...data,
      lineage: PulseLineage[subsystem],
      hops: 0,
      distance: DEFAULT_DISTANCE,
      meta: {
        layer: "PulseTelemetry",
        version: "7.7",
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
// MINI‑PULSE BROADCAST — Mesh‑safe propagation (v7.7)
// ============================================================================
export function broadcastTelemetry(packet) {
  try {
    if (!packet || typeof packet !== "object") return;
    if (packet.hops >= MAX_HOPS) return;

    const amplified = amplifyPulse(packet);

    // Real mesh sender would go here
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
// MINI‑PULSE AMPLIFIER — Increase distance + hop count (v7.7)
// ============================================================================
export function amplifyPulse(packet) {
  return {
    ...packet,
    hops: packet.hops + 1,
    distance: packet.distance + 1
  };
}

// ============================================================================
// RECEIVE MESH PULSE — Accept telemetry from other nodes (v7.7)
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
// HEARTBEAT — Subsystem periodic pulse (v7.7)
// ============================================================================
export function heartbeat(subsystem, extra = {}) {
  return emitTelemetry(subsystem, "heartbeat", {
    version: PulseVersion[subsystem],
    role: PulseRoles[subsystem],
    ...extra
  });
}

// ============================================================================
// DRIFT DETECTION (v7.7)
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
// ANOMALY (v7.7)
// ============================================================================
export function anomaly(subsystem, description, details = {}) {
  return emitTelemetry(subsystem, "anomaly", {
    description,
    ...details
  });
}

// ============================================================================
// PERFORMANCE METRICS (v7.7)
// ============================================================================
export function metric(subsystem, name, value, extra = {}) {
  return emitTelemetry(subsystem, "metric", {
    name,
    value,
    ...extra
  });
}

// ============================================================================
// STREAM ACCESS (v7.7)
// ============================================================================
export function getStream(limit = 500) {
  if (limit <= 0) return [...telemetryStream];
  return telemetryStream.slice(-limit);
}

// ============================================================================
// SNAPSHOT (v7.7)
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
      layer: "PulseTelemetry",
      version: "7.7"
    }
  };
}

// ============================================================================
// EXPORTS — Telemetry Organ API (v7.7)
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
    layer: "PulseTelemetry",
    version: "7.7"
  }
};
