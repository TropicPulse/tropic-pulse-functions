// ============================================================================
//  PULSE OS v7.7 — VITALS LOGGER (RENDERER ONLY)
//  Subsystem Identity • Connection Vitals • Zero Drift • No Firebase
//  PURE RENDERING. NO BACKEND. NO MUTATION. NO COMPUTE.
// ============================================================================
//
//  ORGAN DESCRIPTION — WHAT THIS IS (v7.7):
//  ----------------------------------------
//  PulseLogger is the **vitals renderer** of PulseOS. It is NOT a backend
//  logger, NOT a telemetry sender, NOT a storage layer. It is a **pure
//  renderer-only organ** that:
//
//    • formats subsystem identity (role + version + color)
//    • renders logs in a deterministic, drift-proof format
//    • normalizes arguments from all subsystems
//    • provides safe console overrides (no recursion)
//    • generates telemetry packets (but does NOT send them)
//
//  ROLE IN THE DIGITAL BODY (v7.7):
//  --------------------------------
//    • Renderer → formats logs for human visibility
//    • Identity Surface → shows subsystem role + version
//    • Telemetry Formatter → creates packets for other organs to send
//    • Zero Drift Layer → ensures consistent console identity
//
//  SAFETY CONTRACT (v7.7):
//  ------------------------
//    • No backend calls
//    • No Firebase
//    • No network
//    • No compute
//    • No mutation of global state (except safe console override)
//    • Deterministic rendering only
//
// ============================================================================


// ============================================================================
//  CAPTURE ORIGINAL CONSOLE (prevents recursion)
// ============================================================================
const _c = { ...console };


// ============================================================================
//  VERSION MAP — The Genome of PulseOS (v7.7)
// ============================================================================
export const PulseVersion = {
  identity: "7.7",
  brain: "7.7",
  gpu: "7.7",
  orchestrator: "7.7",
  engine: "7.7",
  optimizer: "7.7",
  synapse: "7.7",
  band: "7.7",
  router: "7.7",
  marketplaces: "7.7",
  telemetry: "7.7",
  limbic: "7.7"
};


// ============================================================================
//  ROLE MAP — Organ Metaphors (Subsystem Identity)
// ============================================================================
export const PulseRoles = {
  identity: "BLOOD–BRAIN BARRIER (BBB)",
  brain: "ANALYST CORTEX",
  gpu: "ASTRAL NERVOUS SYSTEM",
  orchestrator: "BRAINSTEM",
  engine: "MOTOR CORTEX",
  optimizer: "GUARDIAN",
  synapse: "ELECTRICAL JUNCTION",
  band: "BODY INTERFACE",
  router: "CONSULATE",
  marketplaces: "EMBASSY LEDGER",
  telemetry: "BLOODSTREAM",
  limbic: "LIMBIC SHADOW"
};


// ============================================================================
//  COLOR MAP — Console Identity Palette (v7.7)
// ============================================================================
export const PulseColors = {
  identity: "#4DD0E1",
  brain: "#7C4DFF",
  gpu: "#29B6F6",
  orchestrator: "#66BB6A",
  engine: "#FFA726",
  optimizer: "#26C6DA",
  synapse: "#42A5F5",
  band: "#EC407A",
  router: "#26A69A",
  marketplaces: "#26C281",
  telemetry: "#FF7043",
  limbic: "#AB47BC",
  legacy: "#BDBDBD"
};


// ============================================================================
//  INTERNAL — Format a subsystem log prefix
// ============================================================================
function formatPrefix(subsystem) {
  const role = PulseRoles[subsystem] || "SUBSYSTEM";
  const version = PulseVersion[subsystem] || "7.x";
  return `${role} v${version}`;
}


// ============================================================================
//  ARGUMENT NORMALIZER — HYBRID MODE (v7.7)
//  Accepts: %c logs, subsystem-first logs, object logs, single args.
// ============================================================================
function normalizeArgs(args) {
  let subsystem = "legacy";
  let message = "";
  let rest = [];

  // Raw %c logs (Chrome-style)
  if (typeof args[0] === "string" && args[0].startsWith("%c")) {
    return { subsystem, message: args[0], rest: args.slice(1), raw: true };
  }

  // Standard: log("gpu", "message", ...)
  if (args.length >= 2 && typeof args[0] === "string" && typeof args[1] === "string") {
    return { subsystem: args[0], message: args[1], rest: args.slice(2), raw: false };
  }

  // Object logs (PulseBand, GPU packages, etc.)
  if (typeof args[0] === "object") {
    const obj = args[0];

    // Nervous system packets
    if (obj.pulseLayer === "NERVOUS-SYSTEM") subsystem = "band";

    // GPU schema packets
    if (obj.schemaVersion && obj.textures !== undefined) subsystem = "gpu";

    return { subsystem, message: JSON.stringify(obj), rest: [], raw: false };
  }

  // Single argument
  if (args.length === 1) {
    return { subsystem, message: args[0], rest: [], raw: false };
  }

  // Fallback
  return { subsystem, message: args.join(" "), rest, raw: false };
}


// ============================================================================
//  CORE LOGGING FUNCTIONS — RENDERER ONLY (v7.7)
// ============================================================================
export function log(...args) {
  const { subsystem, message, rest, raw } = normalizeArgs(args);

  if (raw) {
    _c.log(message, ...rest);
    return;
  }

  const color = PulseColors[subsystem] || "#fff";
  const prefix = formatPrefix(subsystem);

  _c.log(`%c${prefix} — ${message}`, `color:${color}; font-weight:bold;`, ...rest);
}

export function warn(...args) {
  const { subsystem, message, rest } = normalizeArgs(args);
  const prefix = formatPrefix(subsystem);

  _c.warn(`%c${prefix} [WARN] — ${message}`, "color:#FFEE58; font-weight:bold;", ...rest);
}

export function error(...args) {
  const { subsystem, message, rest } = normalizeArgs(args);
  const prefix = formatPrefix(subsystem);

  _c.error(`%c${prefix} [ERROR] — ${message}`, "color:#EF5350; font-weight:bold;", ...rest);
}

export function critical(...args) {
  const { subsystem, message, rest } = normalizeArgs(args);
  const prefix = formatPrefix(subsystem);

  _c.groupCollapsed(
    `%c${prefix} [CRITICAL] — ${message}`,
    "color:#D32F2F; font-weight:bold; font-size:14px;"
  );
  _c.error(`%c${message}`, "color:#D32F2F; font-weight:bold;", ...rest);
  _c.groupEnd();
}


// ============================================================================
//  GROUPING HELPERS — v7.7
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
//  TELEMETRY PACKET FORMATTER (v7.7)
//  Renderer-only: creates packets but does NOT send them.
// ============================================================================
export function makeTelemetryPacket(subsystem, event, data = {}) {
  return {
    ts: Date.now(),
    subsystem,
    version: PulseVersion[subsystem] || "7.x",
    role: PulseRoles[subsystem] || "SUBSYSTEM",
    event,
    data,
    meta: {
      layer: "PulseLogger",
      version: "7.7",
      subsystem,
      event
    }
  };
}


// ============================================================================
//  LEGACY CONSOLE REDIRECTS (SAFE — no recursion)
// ============================================================================
console.log = (...args) => log(...args);
console.warn = (...args) => warn(...args);
console.error = (...args) => error(...args);


// ============================================================================
//  LOGGER EXPORT
// ============================================================================
export const logger = {
  log,
  warn,
  error,
  critical,
  group,
  groupEnd,
  makeTelemetryPacket,
  meta: {
    layer: "PulseLogger",
    version: "7.7"
  }
};


// ============================================================================
//  GLOBAL BROADCAST — Makes primitives available to all subsystems
// ============================================================================
if (typeof window !== "undefined") {
  window.log = log;
  window.warn = warn;
  window.error = error;
  window.critical = critical;
  window.group = group;
  window.groupEnd = groupEnd;
}
