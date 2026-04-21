// ============================================================================
//  PULSE OS v9.2 — VITALS LOGGER (RENDERER ONLY)
//  Subsystem Identity • Connection Vitals • Zero Drift • No Backend
//  PURE RENDERING. NO NETWORK. NO STORAGE. NO COMPUTE.
// ============================================================================
//
//  ORGAN DESCRIPTION — WHAT THIS IS (v9.2):
//  ----------------------------------------
//  PulseLogger is the **vitals renderer** of PulseOS. It is NOT a backend
//  logger, NOT a telemetry sender, NOT a storage layer. It is a **pure,
//  deterministic renderer-only organ** that:
//
//    • formats subsystem identity (role + version + color)
//    • renders logs in a drift-proof, deterministic format
//    • normalizes arguments from all subsystems (hybrid mode)
//    • provides safe console overrides (no recursion)
//    • generates telemetry packets (but does NOT send them)
//
//  ROLE IN THE DIGITAL BODY (v9.2):
//  --------------------------------
//    • Renderer → human-readable vitals surface
//    • Identity Surface → subsystem role + version
//    • Telemetry Formatter → packet generator (not sender)
//    • Zero Drift Layer → stable console identity
//
//  SAFETY CONTRACT (v9.2):
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
//  VERSION MAP — The Genome of PulseOS (v9.2)
// ============================================================================
export const PulseVersion = {
  identity: "9.2",
  brain: "9.2",
  gpu: "9.2",
  orchestrator: "9.2",
  engine: "9.2",
  optimizer: "9.2",
  synapse: "9.2",
  band: "9.2",
  router: "9.2",
  marketplaces: "9.2",
  telemetry: "9.2",
  limbic: "9.2"
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
//  COLOR MAP — Console Identity Palette (v9.2)
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
  const version = PulseVersion[subsystem] || "9.x";
  return `${role} v${version}`;
}


// ============================================================================
//  ARGUMENT NORMALIZER — HYBRID MODE (v9.2)
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
//  CORE LOGGING FUNCTIONS — RENDERER ONLY (v9.2)
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
//  GROUPING HELPERS — v9.2
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
//  TELEMETRY PACKET FORMATTER (v9.2)
// ============================================================================
export function makeTelemetryPacket(subsystem, event, data = {}) {
  return {
    ts: Date.now(),
    subsystem,
    version: PulseVersion[subsystem] || "9.x",
    role: PulseRoles[subsystem] || "SUBSYSTEM",
    event,
    data,
    meta: {
      layer: "PulseLogger",
      version: "9.2",
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
    version: "9.2"
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
