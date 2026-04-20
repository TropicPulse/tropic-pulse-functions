// ============================================================================
//  PULSE OS v7.4 — LOGGING CORTEX
//  Unified Logging • Subsystem Identity • Zero Drift
//  Backward + Forward Compatible (OLD + NEW log calls)
// ============================================================================

// ============================================================================
//  VERSION MAP — The Genome of PulseOS
// ============================================================================
export const PulseVersion = {
  identity: "7.4",
  brain: "7.4",
  gpu: "7.4",
  orchestrator: "7.4",
  engine: "7.4",
  optimizer: "7.4",
  synapse: "7.4",
  band: "7.4",
  router: "7.4",
  marketplaces: "7.4"
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
//  COLOR MAP — Console Identity Palette
// ============================================================================
export const PulseColors = {
  identity: "#4FC3F7",
  brain: "#8B5CF6",
  gpu: "#03A9F4",
  orchestrator: "#4ADE80",
  engine: "#F59E0B",
  optimizer: "#03A9F4",
  synapse: "#38BDF8",
  band: "#E11D48",
  router: "#0EA5E9",
  marketplaces: "#14B8A6"
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
//  ARGUMENT NORMALIZER (OLD + NEW)
// ============================================================================
function normalizeArgs(args) {
  let subsystem = "legacy";
  let message = "";
  let rest = [];

  if (args.length === 1) {
    message = args[0];
  } else if (args.length >= 2) {
    if (typeof args[0] === "string" && typeof args[1] === "string") {
      subsystem = args[0];
      message = args[1];
      rest = args.slice(2);
    } else {
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
    "color:#FACC15; font-weight:bold;",
    ...rest
  );
}

export function error(...args) {
  const { subsystem, message, rest } = normalizeArgs(args);
  const prefix = formatPrefix(subsystem);

  _consoleError(
    `%c${prefix} [ERROR] — ${message}`,
    "color:#F87171; font-weight:bold;",
    ...rest
  );
}

export function critical(...args) {
  const { subsystem, message, rest } = normalizeArgs(args);
  const prefix = formatPrefix(subsystem);

  _consoleGroupCollapsed(
    `%c${prefix} [CRITICAL] — ${message}`,
    "color:#DC2626; font-weight:bold; font-size:14px;"
  );
  _consoleError(
    `%c${message}`,
    "color:#DC2626; font-weight:bold;",
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
