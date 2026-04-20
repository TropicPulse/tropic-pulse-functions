// ============================================================================
//  PULSE OS v7.5 — LOGGING CORTEX (HYBRID MODE)
//  Unified Logging • Subsystem Identity • %c Support • Zero Drift
// ============================================================================

// ============================================================================
//  VERSION MAP — The Genome of PulseOS
// ============================================================================
export const PulseVersion = {
  identity: "7.5",
  brain: "7.5",
  gpu: "7.5",
  orchestrator: "7.5",
  engine: "7.5",
  optimizer: "7.5",
  synapse: "7.5",
  band: "7.5",
  router: "7.5",
  marketplaces: "7.5"
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
//  COLOR MAP — Console Identity Palette (v7.5)
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
//  CAPTURE ORIGINAL CONSOLE FUNCTIONS (prevents recursion)
// ============================================================================
const _consoleLog = console.log;
const _consoleWarn = console.warn;
const _consoleError = console.error;
const _consoleGroupCollapsed = console.groupCollapsed;
const _consoleGroupEnd = console.groupEnd;

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
//  Supports:
//    • log("gpu", "msg")
//    • log("%c[GPU] msg", "color:...;")
//    • log({json})
//    • log("[PULSE]", "...")
//    • console.log("msg")
// ============================================================================
function normalizeArgs(args) {
  let subsystem = "legacy";
  let message = "";
  let rest = [];

  // ============================================================
  // CASE 1 — %c Chrome-style logs
  // ============================================================
  if (typeof args[0] === "string" && args[0].startsWith("%c")) {
    subsystem = "legacy"; // raw formatting, no prefix
    message = args[0];
    rest = args.slice(1);
    return { subsystem, message, rest, raw: true };
  }

  // ============================================================
  // CASE 2 — NEW FORMAT: log("gpu", "message")
  // ============================================================
  if (args.length >= 2 && typeof args[0] === "string" && typeof args[1] === "string") {
    subsystem = args[0];
    message = args[1];
    rest = args.slice(2);
    return { subsystem, message, rest, raw: false };
  }

  // ============================================================
  // CASE 3 — JSON logs (PulseBand packets, GPU packets, etc.)
  // ============================================================
  if (typeof args[0] === "object") {
    const obj = args[0];

    // PulseBand packet
    if (obj.pulseLayer === "NERVOUS-SYSTEM") {
      subsystem = "band";
    }

    // GPU packet
    if (obj.schemaVersion && obj.textures !== undefined) {
      subsystem = "gpu";
    }

    message = JSON.stringify(obj);
    return { subsystem, message, rest: [], raw: false };
  }

  // ============================================================
  // CASE 4 — OLD FORMAT: log("message")
  // ============================================================
  if (args.length === 1) {
    message = args[0];
    return { subsystem, message, rest: [], raw: false };
  }

  // fallback
  message = args.join(" ");
  return { subsystem, message, rest: [], raw: false };
}

// ============================================================================
//  CORE LOGGING FUNCTIONS — HYBRID MODE
// ============================================================================
export function log(...args) {
  const { subsystem, message, rest, raw } = normalizeArgs(args);

  // RAW MODE — %c logs bypass subsystem prefix
  if (raw) {
    _consoleLog(message, ...rest);
    return;
  }

  const color = PulseColors[subsystem] || "#fff";
  const prefix = formatPrefix(subsystem);

  _consoleLog(
    `%c${prefix} — ${message}`,
    `color:${color}; font-weight:bold;`,
    ...rest
  );
}

export function warn(...args) {
  const { subsystem, message, rest } = normalizeArgs(args);
  const prefix = formatPrefix(subsystem);

  _consoleWarn(
    `%c${prefix} [WARN] — ${message}`,
    "color:#FFEE58; font-weight:bold;",
    ...rest
  );
}

export function error(...args) {
  const { subsystem, message, rest } = normalizeArgs(args);
  const prefix = formatPrefix(subsystem);

  _consoleError(
    `%c${prefix} [ERROR] — ${message}`,
    "color:#EF5350; font-weight:bold;",
    ...rest
  );
}

export function critical(...args) {
  const { subsystem, message, rest } = normalizeArgs(args);
  const prefix = formatPrefix(subsystem);

  _consoleGroupCollapsed(
    `%c${prefix} [CRITICAL] — ${message}`,
    "color:#D32F2F; font-weight:bold; font-size:14px;"
  );
  _consoleError(
    `%c${message}`,
    "color:#D32F2F; font-weight:bold;",
    ...rest
  );
  _consoleGroupEnd();
}

// ============================================================================
//  GROUPING
// ============================================================================
export function group(subsystem, label) {
  const color = PulseColors[subsystem] || "#fff";
  const prefix = formatPrefix(subsystem);

  _consoleGroupCollapsed(
    `%c${prefix} — ${label}`,
    `color:${color}; font-weight:bold;`
  );
}

export function groupEnd() {
  _consoleGroupEnd();
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
//  LEGACY CONSOLE REDIRECTS (SAFE NOW — no recursion)
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
