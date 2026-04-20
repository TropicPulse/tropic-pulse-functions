// ============================================================================
//  PULSE OS v7.6 — LOGGING CORTEX (HYBRID + FIREBASE DURABLE MODE)
//  Unified Logging • Subsystem Identity • %c Support • Zero Drift • Firebase Durable Logs
// ============================================================================

// ---------------------------------------------------------------------------
//  CAPTURE ORIGINAL CONSOLE (prevents recursion)
// ---------------------------------------------------------------------------
const _c = { ...console };

// ---------------------------------------------------------------------------
//  FIREBASE INITIALIZATION (FRONTEND DURABLE LOGGING)
// ---------------------------------------------------------------------------
const app = firebase.initializeApp(window.PULSE_FIREBASE_CONFIG);
const db = firebase.firestore(app);

async function writeToFirebaseLog(entry) {
  try {
    await db.collection("GLOBAL_LOGS").add({
      ts: Date.now(),
      ...entry
    });
  } catch (err) {
    _c.error("Firebase logging failed:", err);
  }
}

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

  // CASE 1 — %c Chrome-style logs
  if (typeof args[0] === "string" && args[0].startsWith("%c")) {
    subsystem = "legacy";
    message = args[0];
    rest = args.slice(1);
    return { subsystem, message, rest, raw: true };
  }

  // CASE 2 — log("gpu", "message")
  if (args.length >= 2 && typeof args[0] === "string" && typeof args[1] === "string") {
    subsystem = args[0];
    message = args[1];
    rest = args.slice(2);
    return { subsystem, message, rest, raw: false };
  }

  // CASE 3 — JSON logs (PulseBand, GPU, etc.)
  if (typeof args[0] === "object") {
    const obj = args[0];

    if (obj.pulseLayer === "NERVOUS-SYSTEM") subsystem = "band";
    if (obj.schemaVersion && obj.textures !== undefined) subsystem = "gpu";

    message = JSON.stringify(obj);
    return { subsystem, message, rest: [], raw: false };
  }

  // CASE 4 — log("message")
  if (args.length === 1) {
    message = args[0];
    return { subsystem, message, rest: [], raw: false };
  }

  // fallback
  message = args.join(" ");
  return { subsystem, message, rest, raw: false };
}

// ============================================================================
//  CORE LOGGING FUNCTIONS — HYBRID + FIREBASE DURABLE MODE
// ============================================================================

export function log(...args) {
  const { subsystem, message, rest, raw } = normalizeArgs(args);

  if (raw) {
    _c.log(message, ...rest);
    writeToFirebaseLog({ level: "log", subsystem, message, rest, raw });
    return;
  }

  const color = PulseColors[subsystem] || "#fff";
  const prefix = formatPrefix(subsystem);

  _c.log(`%c${prefix} — ${message}`, `color:${color}; font-weight:bold;`, ...rest);

  writeToFirebaseLog({
    level: "log",
    subsystem,
    message,
    rest,
    prefix,
    version: PulseVersion[subsystem],
    role: PulseRoles[subsystem]
  });
}

export function warn(...args) {
  const { subsystem, message, rest } = normalizeArgs(args);
  const prefix = formatPrefix(subsystem);

  _c.warn(`%c${prefix} [WARN] — ${message}`, "color:#FFEE58; font-weight:bold;", ...rest);

  writeToFirebaseLog({
    level: "warn",
    subsystem,
    message,
    rest,
    prefix,
    version: PulseVersion[subsystem],
    role: PulseRoles[subsystem]
  });
}

export function error(...args) {
  const { subsystem, message, rest } = normalizeArgs(args);
  const prefix = formatPrefix(subsystem);

  _c.error(`%c${prefix} [ERROR] — ${message}`, "color:#EF5350; font-weight:bold;", ...rest);

  writeToFirebaseLog({
    level: "error",
    subsystem,
    message,
    rest,
    prefix,
    version: PulseVersion[subsystem],
    role: PulseRoles[subsystem]
  });
}

export function critical(...args) {
  const { subsystem, message, rest } = normalizeArgs(args);
  const prefix = formatPrefix(subsystem);

  _c.groupCollapsed(`%c${prefix} [CRITICAL] — ${message}`, "color:#D32F2F; font-weight:bold; font-size:14px;");
  _c.error(`%c${message}`, "color:#D32F2F; font-weight:bold;", ...rest);
  _c.groupEnd();

  writeToFirebaseLog({
    level: "critical",
    subsystem,
    message,
    rest,
    prefix,
    version: PulseVersion[subsystem],
    role: PulseRoles[subsystem]
  });
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
