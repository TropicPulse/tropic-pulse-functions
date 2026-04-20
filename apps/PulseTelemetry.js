// ============================================================================
//  PULSE OS v7.4 — TELEMETRY ORGAN
//  Unified Metrics • Subsystem Heartbeats • Drift Detection
//  This file centralizes ALL telemetry across PulseOS.
// ============================================================================

// UI + presentation metadata comes from Logger
import { PulseVersion, PulseRoles, makeTelemetryPacket  } from "./PulseLogger.js";

// Telemetry packet builder also comes from Logger
import { PulseLineage} from "./PulseIdentity.js";


// ============================================================================
//  INTERNAL STATE — Telemetry Bloodstream
// ============================================================================
const telemetryStream = [];
const MAX_STREAM_SIZE = 5000; // prevents runaway memory

// ============================================================================
//  EMIT TELEMETRY — The universal signal emitter
//  (Telemetry is allowed to use console.error ONLY for internal failures.)
// ============================================================================
export function emitTelemetry(subsystem, event, data = {}) {
  try {
    const packet = makeTelemetryPacket(subsystem, event, data);

    telemetryStream.push(packet);

    if (telemetryStream.length > MAX_STREAM_SIZE) {
      telemetryStream.shift();
    }

    return packet;
  } catch (err) {
    // v7.4: Telemetry is one of the ONLY organs allowed to use console.error
    console.error("[PulseTelemetry] FAILED to emit telemetry:", err);
    return null;
  }
}

// ============================================================================
//  HEARTBEAT — Subsystem periodic pulse
// ============================================================================
export function heartbeat(subsystem, extra = {}) {
  return emitTelemetry(subsystem, "heartbeat", {
    version: PulseVersion[subsystem],
    role: PulseRoles[subsystem],
    lineage: PulseLineage[subsystem],
    ...extra
  });
}

// ============================================================================
//  DRIFT DETECTION — Detect unexpected subsystem behavior
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
//  ANOMALY — Report unexpected or suspicious behavior
// ============================================================================
export function anomaly(subsystem, description, details = {}) {
  return emitTelemetry(subsystem, "anomaly", {
    description,
    ...details
  });
}

// ============================================================================
//  PERFORMANCE METRICS — GPU, CPU, Router, Marketplace
// ============================================================================
export function metric(subsystem, name, value, extra = {}) {
  return emitTelemetry(subsystem, "metric", {
    name,
    value,
    ...extra
  });
}

// ============================================================================
//  STREAM ACCESS — Dashboard / DevTools / Debug Panels
// ============================================================================
export function getStream(limit = 500) {
  if (limit <= 0) return [...telemetryStream];
  return telemetryStream.slice(-limit);
}

// ============================================================================
//  SNAPSHOT — Return a structured telemetry summary
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
  getTelemetrySnapshot
};
