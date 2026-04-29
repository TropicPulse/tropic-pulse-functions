// ============================================================================
//  PulseProofLogger.js — v12‑EVO
//  PROOF LOGGER • RECORD LAYER • EVOLUTION LEDGER • EXTERNAL WITNESS
//
//  METAPHOR:
//  - This organ is the organism’s EVIDENCE PRINTER.
//  - It records every pulse, every signal, every heartbeat of the system.
//  - It does NOT influence the organism — it only documents it.
//  - It is the black box recorder of Pulse OS.
//
//  v12‑EVO UPGRADE:
//  - Binary‑aware: can log binary arteries (BinaryProxy / BinaryRouter / Mesh / Send / Pulse).
//  - Dual‑band: understands legacy + v11‑EVO subsystems without changing behavior.
//  - Deterministic formatting: no randomness, no hidden branches.
//  - Telemetry packets are pure records, safe to persist or replay.
//  - Still ZERO routing, ZERO healing, ZERO compute, ZERO mutation.
//  - NEW: Backend‑safe Firebase logging for every log/warn/error/critical.
// ============================================================================

import { route } from "./PULSE-OS/PulseOSCNSNervousSystem.js";
// ============================================================================
//  CAPTURE ORIGINAL CONSOLE (prevents recursion)
// ============================================================================
const _c = { ...console };


// ============================================================================
//  VERSION MAP — Proof Layer Genome (v12‑EVO)
// ============================================================================
export const PulseVersion = {
  proof: "12.0",
  logger: "12.0",
  renderer: "11.0",
  legacy: "10.x"
};


// ============================================================================
//  ROLE MAP — Proof Layer Identity (v11‑EVO)
// ============================================================================
export const PulseRoles = {
  proof: "PROOF MONITOR",
  logger: "PROOF LOGGER",
  renderer: "RENDERER",
  legacy: "LEGACY SUBSYSTEM"
};


// ============================================================================
//  COLOR MAP — Proof Layer Palette (v11‑EVO)
// ============================================================================
export const PulseColors = {
  proof: "#4DD0E1",
  logger: "#FF7043",
  renderer: "#29B6F6",
  legacy: "#BDBDBD"
};


// ============================================================================
//  ICON MAP — Proof Layer Glyphs (v11‑EVO)
// ============================================================================
export const PulseIcons = {
  proof: "📜",
  logger: "🖨️",
  renderer: "✨",
  legacy: "⬡"
};


// ============================================================================
//  INTERNAL — Format a subsystem log prefix
// ============================================================================
function formatPrefix(subsystem) {
  const role = PulseRoles[subsystem] || "SUBSYSTEM";
  const version = PulseVersion[subsystem] || "10.x";
  const icon = PulseIcons[subsystem] || PulseIcons.legacy;
  return `${icon} ${role} v${version}`;
}


// ============================================================================
//  ARGUMENT NORMALIZER — v11‑EVO (binary‑aware, legacy‑safe)
// ============================================================================
function normalizeArgs(args) {
  let subsystem = "legacy";
  let message = "";
  let rest = [];

  // Raw %c logs (already formatted)
  if (typeof args[0] === "string" && args[0].startsWith("%c")) {
    return { subsystem, message: args[0], rest: args.slice(1), raw: true };
  }

  // subsystem + message
  if (args.length >= 2 && typeof args[0] === "string" && typeof args[1] === "string") {
    return { subsystem: args[0], message: args[1], rest: args.slice(2), raw: false };
  }

  // object logs — GPU / Band / generic payloads / binary arteries
  if (typeof args[0] === "object" && args[0] !== null) {
    const obj = args[0];

    // Nervous system / band
    if (obj.pulseLayer === "NERVOUS-SYSTEM") subsystem = "band";

    // GPU payloads
    if (obj.schemaVersion && obj.textures !== undefined) subsystem = "gpu";

    // Binary arteries (BinaryProxy / BinaryRouter / Mesh / Send / Pulse)
    if (obj.binaryArtery === true) subsystem = "logger";

    return {
      subsystem,
      message: "",
      rest: [obj],
      raw: false
    };
  }

  // single arg
  if (args.length === 1) {
    return { subsystem, message: args[0], rest: [], raw: false };
  }

  // fallback
  return { subsystem, message: args.join(" "), rest, raw: false };
}


// ============================================================================
//  FIREBASE LOGGING BRIDGE — FRONTEND → PULSE‑WORLD BACKEND
// ============================================================================
async function sendToFirebase(level, message, rest) {
  try {
    await route("firebaseLog", {
      level,
      message,
      rest
    });
  } catch (e) {
    _c.warn("PulseProofLogger: Firebase logging failed:", e);
  }
}



// ============================================================================
//  CORE LOGGING FUNCTIONS — RENDERER ONLY (v11‑EVO + Firebase bridge)
// ============================================================================
export function log(...args) {
  const { subsystem, message, rest, raw } = normalizeArgs(args);

  if (raw) {
    _c.log(message, ...rest);
    sendToFirebase("log", message, rest);
    return;
  }

  const color = PulseColors[subsystem] || "#fff";
  const prefix = formatPrefix(subsystem);

  _c.log(
    `%c${prefix} — ${message}`,
    `color:${color}; font-weight:bold;`,
    ...rest
  );

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
//  GROUPING HELPERS — v11‑EVO
// ============================================================================
export function group(subsystem, label) {
  const color = PulseColors[subsystem] || "#fff";
  const prefix = formatPrefix(subsystem);

  _c.groupCollapsed(
    `%c${prefix} — ${label}`,
    `color:${color}; font-weight:bold;`
  );
}

export function groupEnd() {
  _c.groupEnd();
}


// ============================================================================
//  TELEMETRY PACKET FORMATTER — v11‑EVO
//  • Date.now() is allowed here as a pure record timestamp.
//  • Packets are safe to persist, replay, or ship to proof storage.
// ============================================================================
export function makeTelemetryPacket(subsystem, event, data = {}) {
  return {
    ts: Date.now(),
    subsystem,
    version: PulseVersion[subsystem] || "10.x",
    role: PulseRoles[subsystem] || "SUBSYSTEM",
    icon: PulseIcons[subsystem] || PulseIcons.legacy,
    event,
    data,
    meta: {
      layer: "PulseProofLogger",
      version: "12.0",
      subsystem,
      event
    }
  };
}


// ============================================================================
// –  LEGACY CONSOLE REDIRECTS (SAFE — no recursion)
// ============================================================================
console.log = (...args) => log(...args);
console.warn = (...args) => warn(...args);
console.error = (...args) => error(...args);


// ============================================================================
//  LOGGER EXPORT — USED BY VITALS MONITOR + BACKEND ORGANS
// ============================================================================
export const VitalsLogger = {
  log,
  warn,
  error,
  critical,
  group,
  groupEnd,
  makeTelemetryPacket,
  meta: {
    layer: "PulseProofLogger",
    version: "12.0"
  }
};

export const logger = {
  log,
  warn,
  error,
  critical,
  group,
  groupEnd,
  makeTelemetryPacket,
  meta: {
    layer: "PulseProofLogger",
    version: "12.0"
  }
};


// ============================================================================
//  GLOBAL BROADCAST — Makes primitives available to all subsystems
//  • Frontend sees formatted logs only; no access to internals.
// ============================================================================
if (typeof window !== "undefined") {
  window.log = log;
  window.warn = warn;
  window.error = error;
  window.critical = critical;
  window.group = group;
  window.groupEnd = groupEnd;
}
