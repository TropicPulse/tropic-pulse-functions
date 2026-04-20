// ============================================================================
//  PULSE OS v7.4 — LOGGING CORTEX
//  Unified Logging • Subsystem Identity • Zero Drift
//  Backward + Forward Compatible (OLD + NEW log calls)
// ============================================================================

import { PulseColors, PulseRoles, PulseVersion } from "./PulseIdentity.js";

// ============================================================================
//  INTERNAL — Format a subsystem log prefix
// ============================================================================
function formatPrefix(subsystem) {
  const role = PulseRoles[subsystem] || "SUBSYSTEM";
  const version = PulseVersion[subsystem] || "7.x";
  return `${role} v${version}`;
}

// ============================================================================
//  ARGUMENT NORMALIZER (OLD + NEW)
//  Accepts:
//    log("gpu", "msg")
//    log("msg")
//    log("msg", data)
//    log("gpu", "msg", data)
// ============================================================================
function normalizeArgs(args) {
  let subsystem = "legacy";
  let message = "";
  let rest = [];

  if (args.length === 1) {
    // log("message")
    message = args[0];
  } else if (args.length >= 2) {
    if (typeof args[0] === "string" && typeof args[1] === "string") {
      // log("gpu", "message", ...)
      subsystem = args[0];
      message = args[1];
      rest = args.slice(2);
    } else {
      // log("message", ...)
      message = args[0];
      rest = args.slice(1);
    }
  }

  return { subsystem, message, rest };
}

// ============================================================================
//  CORE LOGGING FUNCTIONS (NEW + OLD COMPATIBLE)
// ============================================================================

export function log(...args) {
  const { subsystem, message, rest } = normalizeArgs(args);
  const color = PulseColors[subsystem] || "#fff";
  const prefix = formatPrefix(subsystem);

  console.log(
    `%c${prefix} — ${message}`,
    `color:${color}; font-weight:bold;`,
    ...rest
  );
}

export function warn(...args) {
  const { subsystem, message, rest } = normalizeArgs(args);
  const prefix = formatPrefix(subsystem);

  console.warn(
    `%c${prefix} [WARN] — ${message}`,
    "color:#FACC15; font-weight:bold;",
    ...rest
  );
}

export function error(...args) {
  const { subsystem, message, rest } = normalizeArgs(args);
  const prefix = formatPrefix(subsystem);

  console.error(
    `%c${prefix} [ERROR] — ${message}`,
    "color:#F87171; font-weight:bold;",
    ...rest
  );
}

export function critical(...args) {
  const { subsystem, message, rest } = normalizeArgs(args);
  const prefix = formatPrefix(subsystem);

  console.groupCollapsed(
    `%c${prefix} [CRITICAL] — ${message}`,
    "color:#DC2626; font-weight:bold; font-size:14px;"
  );
  console.error(
    `%c${message}`,
    "color:#DC2626; font-weight:bold;",
    ...rest
  );
  console.groupEnd();
}

// ============================================================================
//  GROUPING
// ============================================================================
export function group(subsystem, label) {
  const color = PulseColors[subsystem] || "#fff";
  const prefix = formatPrefix(subsystem);

  console.groupCollapsed(
    `%c${prefix} — ${label}`,
    `color:${color}; font-weight:bold;`
  );
}

export function groupEnd() {
  console.groupEnd();
}

// ============================================================================
//  TELEMETRY PACKET FORMATTER
// ============================================================================
export function makeTelemetryPacket(subsystem, event, data = {}) {
  return {
    ts: Date.now(),
    subsystem,
    version: PulseVersion[subsystem] || "7.x",
    role: PulseRoles[subsystem] || "SUBSYSTEM",
    event,
    data
  };
}

// ============================================================================
//  LEGACY CONSOLE REDIRECTS (OPTIONAL)
//  Makes ALL old console.log calls route into Trinity Logger
// ============================================================================
console.log = (...args) => log(...args);
console.warn = (...args) => warn(...args);
console.error = (...args) => error(...args);
