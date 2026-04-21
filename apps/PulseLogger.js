// ============================================================================
//  PULSE OS v7.7 — VITALS LOGGER (RENDERER ONLY)
//  Subsystem Identity • Connection Vitals • Zero Drift • No Firebase
// ============================================================================

// ---------------------------------------------------------------------------
//  CAPTURE ORIGINAL CONSOLE (prevents recursion)
// ---------------------------------------------------------------------------
const _c = { ...console };

// ============================================================================
//  VERSION MAP — The Genome of PulseOS
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
  marketplaces: "7.7"
};

// ============================================================================
//  ROLE MAP — The Organ Metaphors (Subsystem Identity)
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
  marketplaces: "EMBASSY LEDGER"
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
//  ARGUMENT NORMALIZER — HYBRID MODE
// ============================================================================
function normalizeArgs(args) {
  let subsystem = "legacy";
  let message = "";
  let rest = [];

  if (typeof args[0] === "string" && args[0].startsWith("%c")) {
    return { subsystem, message: args[0], rest: args.slice(1), raw: true };
  }

  if (args.length >= 2 && typeof args[0] === "string" && typeof args[1] === "string") {
    return { subsystem: args[0], message: args[1], rest: args.slice(2), raw: false };
  }

  if (typeof args[0] === "object") {
    const obj = args[0];
    if (obj.pulseLayer === "NERVOUS-SYSTEM") subsystem = "band";
    if (obj.schemaVersion && obj.textures !== undefined) subsystem = "gpu";
    return { subsystem, message: JSON.stringify(obj), rest: [], raw: false };
  }

  if (args.length === 1) {
    return { subsystem, message: args[0], rest: [], raw: false };
  }

  return { subsystem, message: args.join(" "), rest, raw: false };
}

// ============================================================================
//  CORE LOGGING FUNCTIONS — RENDERER ONLY
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
//  GROUPING
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
//  LEGACY CONSOLE REDIRECTS (SAFE — no recursion)
// ============================================================================
console.log = (...args) => log(...args);
console.warn = (...args) => warn(...args);
console.error = (...args) => error(...args);

export const logger = {
  log,
  warn,
  error,
  critical,
  group,
  groupEnd,
  makeTelemetryPacket
};
