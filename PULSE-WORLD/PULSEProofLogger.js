// ============================================================================
//  PulseProofLogger.js — v12.6‑EVO
//  PROOF LOGGER • RECORD LAYER • EVOLUTION LEDGER • EXTERNAL WITNESS
// ============================================================================

import { route } from "./PULSE-OS/PulseOSCNSNervousSystem.js";

// Capture original console (prevents recursion)
const _c = { ...console };

// ============================================================================
//  VERSION / ROLE / COLOR / ICON MAPS — v12.6‑EVO
// ============================================================================
export const PulseVersion = {
  proof: "12.6",
  logger: "12.6",
  renderer: "12.4",
  gpu: "12.4",
  band: "12.4",
  legacy: "11.x"
};

export const PulseRoles = {
  proof: "PROOF MONITOR",
  logger: "PROOF LOGGER",
  renderer: "RENDERER",
  gpu: "GPU SUBSYSTEM",
  band: "NERVOUS SYSTEM",
  legacy: "LEGACY SUBSYSTEM"
};

export const PulseColors = {
  proof: "#4DD0E1",
  logger: "#FF7043",
  renderer: "#29B6F6",
  gpu: "#7E57C2",
  band: "#66BB6A",
  legacy: "#BDBDBD"
};

export const PulseIcons = {
  proof: "📜",
  logger: "🖨️",
  renderer: "✨",
  gpu: "🎨",
  band: "🧠",
  legacy: "🖥️"
};

// ============================================================================
//  INTERNAL — Format prefix
// ============================================================================
function formatPrefix(subsystem) {
  const role = PulseRoles[subsystem] || "SUBSYSTEM";
  const version = PulseVersion[subsystem] || "12.x";
  const icon = PulseIcons[subsystem] || PulseIcons.legacy;
  return `${icon} ${role} v${version}`;
}

// ============================================================================
//  ARGUMENT NORMALIZER — v12.6‑EVO
//  • Handles primitives, objects, GPU payloads, binary arteries, band pulses
// ============================================================================
function normalizeArgs(args) {
  let subsystem = "legacy";
  let message = "";
  let rest = [];
  let raw = false;

  const first = args[0];

  // Raw %c logs
  if (typeof first === "string" && first.startsWith("%c")) {
    return { subsystem, message: first, rest: args.slice(1), raw: true };
  }

  // subsystem + message
  if (args.length >= 2 && typeof first === "string" && typeof args[1] === "string") {
    return { subsystem: first, message: args[1], rest: args.slice(2), raw: false };
  }

  // Object logs
  if (typeof first === "object" && first !== null) {
    const obj = first;

    // Nervous system pulses
    if (obj.pulseLayer === "NERVOUS-SYSTEM") subsystem = "band";

    // GPU payloads
    if (obj.schemaVersion && obj.textures !== undefined) subsystem = "gpu";

    // Binary arteries
    if (obj.binaryArtery === true) subsystem = "logger";

    return { subsystem, message: "", rest: [obj], raw: false };
  }

  // Single primitive
  if (args.length === 1) {
    return { subsystem, message: first, rest: [], raw: false };
  }

  // Fallback
  return { subsystem, message: args.join(" "), rest: [], raw: false };
}

// ============================================================================
//  FIREBASE LOGGING BRIDGE — v12.6‑EVO
// ============================================================================
async function sendToFirebase(level, message, rest) {
  try {
    await route("firebaseLog", { level, message, rest });
  } catch (e) {
    _c.warn("PulseProofLogger: Firebase logging failed:", e);
  }
}

// ============================================================================
//  TELEMETRY PACKET FORMATTER — v12.6‑EVO
// ============================================================================
export function makeTelemetryPacket(subsystem, event, data = {}) {
  const ts = Date.now();

  const version = PulseVersion[subsystem] || "12.x";
  const role = PulseRoles[subsystem] || "SUBSYSTEM";
  const icon = PulseIcons[subsystem] || PulseIcons.legacy;

  const band = data.band || "dual";

  const presence = {
    field: data.presenceField || null,
    mesh: data.meshPresence || null
  };

  const binary = {
    artery: data.binaryArtery || false,
    channel: data.binaryChannel || null
  };

  const lineage = {
    id: data.lineageId || null,
    parent: data.lineageParent || null
  };

  return {
    ts,
    subsystem,
    event,
    version,
    role,
    icon,
    data,
    meta: {
      layer: "PulseProofLogger",
      version: "12.6‑EVO",
      subsystem,
      event,
      band,
      presence,
      binary,
      lineage
    }
  };
}

// ============================================================================
//  CORE LOGGING FUNCTIONS — v12.6‑EVO
// ============================================================================
export function log(...args) {
  const { subsystem, message, rest, raw } = normalizeArgs(args);
  const color = PulseColors[subsystem] || "#fff";
  const prefix = formatPrefix(subsystem);

  if (raw) {
    _c.log(message, ...rest);
  } else {
    _c.log(`%c${prefix} — ${message}`, `color:${color}; font-weight:bold;`, ...rest);
  }

  sendToFirebase("log", message, rest);
}

export function warn(...args) {
  const { subsystem, message, rest } = normalizeArgs(args);
  const prefix = formatPrefix(subsystem);

  _c.warn(
    `%c${prefix} ⚠️ [WARN] — ${message}`,
    "color:#FFEE58; font-weight:bold;",
    ...rest
  );

  sendToFirebase("warn", message, rest);
}

export function error(...args) {
  const { subsystem, message, rest } = normalizeArgs(args);
  const prefix = formatPrefix(subsystem);

  _c.error(
    `%c${prefix} 🟥 [ERROR] — ${message}`,
    "color:#EF5350; font-weight:bold;",
    ...rest
  );

  sendToFirebase("error", message, rest);
}

export function critical(...args) {
  const { subsystem, message, rest } = normalizeArgs(args);
  const prefix = formatPrefix(subsystem);

  _c.groupCollapsed(
    `%c${prefix} 💀 [CRITICAL] — ${message}`,
    "color:#D32F2F; font-weight:bold; font-size:14px;"
  );
  _c.error(`%c${message}`, "color:#D32F2F; font-weight:bold;", ...rest);
  _c.groupEnd();

  sendToFirebase("critical", message, rest);
}

// ============================================================================
//  GROUPING HELPERS — v12.6‑EVO
// ============================================================================
export function group(subsystem, label) {
  const color = PulseColors[subsystem] || "#fff";
  const prefix = formatPrefix(subsystem);

  _c.groupCollapsed(`%c${prefix} — ${label}`, `color:${color}; font-weight:bold;`);
}

export function groupEnd() {
  _c.groupEnd();
}

// ============================================================================
//  LEGACY CONSOLE REDIRECTS (SAFE — no recursion)
// ============================================================================
console.log = (...args) => log(...args);
console.warn = (...args) => warn(...args);
console.error = (...args) => error(...args);

// ============================================================================
//  LOGGER EXPORT — v12.6‑EVO
// ============================================================================
export const VitalsLogger = {
  log,
  warn,
  error,
  critical,
  group,
  groupEnd,
  makeTelemetryPacket,
  meta: { layer: "PulseProofLogger", version: "12.6‑EVO" }
};

export const logger = { ...VitalsLogger };

// ============================================================================
//  GLOBAL BROADCAST — v12.6‑EVO
// ============================================================================
if (typeof window !== "undefined") {
  window.log = log;
  window.warn = warn;
  window.error = error;
  window.critical = critical;
  window.group = group;
  window.groupEnd = groupEnd;
}
