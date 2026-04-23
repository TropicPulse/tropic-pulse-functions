// ============================================================================
//  PULSE OS — PROOF LOGGER (v11)
//  “Record Layer / Proof Printer / Evolution Ledger / External Witness”
//
//  METAPHOR:
//  - This organ is the organism’s EVIDENCE PRINTER.
//  - It records every pulse, every signal, every heartbeat of the system.
//  - It does NOT influence the organism — it only documents it.
//  - It is the black box recorder of Pulse OS.
//
//  - ProofLogger = the ledger that prints:
//        • stability snapshots
//        • performance signatures
//        • relay counts
//        • latency pulses
//        • subsystem events
//
//  - It sits beside Understanding and ProofMonitor in the TOP LAYER,
//    forming the “Visibility → Contact → Verification → Evidence” chain.
//
//  - Outsiders can SEE our evolution through the Window,
//    they can MEET us through Understanding,
//    they can VERIFY us through ProofMonitor,
//    and they can TRUST us because ProofLogger records the proof.
//
//  - Pure logging. Pure record. Pure truth.
//  - Zero routing. Zero healing. Zero compute. Zero mutation.
// ============================================================================

// ============================================================================
//  CAPTURE ORIGINAL CONSOLE (prevents recursion)
// ============================================================================
const _c = { ...console };

// ============================================================================
//  VERSION MAP — The Genome of PulseOS (v10.3)
// ============================================================================
// ============================================================================
//  VERSION MAP — Proof Layer Genome (v11)
// ============================================================================
export const PulseVersion = {
  proof: "11.0",
  logger: "11.0",
  renderer: "11.0",
  legacy: "10.x"
};

// ============================================================================
//  ROLE MAP — Proof Layer Identity (v11)
// ============================================================================
export const PulseRoles = {
  proof: "PROOF MONITOR",
  logger: "PROOF LOGGER",
  renderer: "RENDERER",
  legacy: "LEGACY SUBSYSTEM"
};

// ============================================================================
//  COLOR MAP — Proof Layer Palette (v11)
// ============================================================================
export const PulseColors = {
  proof: "#4DD0E1",
  logger: "#FF7043",
  renderer: "#29B6F6",
  legacy: "#BDBDBD"
};

// ============================================================================
//  ICON MAP — Proof Layer Glyphs (v11)
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
//  ARGUMENT NORMALIZER — HYBRID MODE (v10.3)
// ============================================================================
function normalizeArgs(args) {
  let subsystem = "legacy";
  let message = "";
  let rest = [];

  // Raw %c logs
  if (typeof args[0] === "string" && args[0].startsWith("%c")) {
    return { subsystem, message: args[0], rest: args.slice(1), raw: true };
  }

  // subsystem + message
  if (args.length >= 2 && typeof args[0] === "string" && typeof args[1] === "string") {
    return { subsystem: args[0], message: args[1], rest: args.slice(2), raw: false };
  }

  // object logs — GPU / Band / generic payloads
  if (typeof args[0] === "object") {
    const obj = args[0];

    if (obj.pulseLayer === "NERVOUS-SYSTEM") subsystem = "band";
    if (obj.schemaVersion && obj.textures !== undefined) subsystem = "gpu";

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
//  CORE LOGGING FUNCTIONS — RENDERER ONLY (v10.3)
// ============================================================================
export function log(...args) {
  const { subsystem, message, rest, raw } = normalizeArgs(args);

  if (raw) {
    _c.log(message, ...rest);
    return;
  }

  const color = PulseColors[subsystem] || "#fff";
  const prefix = formatPrefix(subsystem);

  _c.log(
    `%c${prefix} — ${message}`,
    `color:${color}; font-weight:bold;`,
    ...rest
  );
}

export function warn(...args) {
  const { subsystem, message, rest } = normalizeArgs(args);
  const prefix = formatPrefix(subsystem);

  _c.warn(
    `%c${prefix} ⚠️ [WARN] — ${message}`,
    "color:#FFEE58; font-weight:bold;",
    ...rest
  );
}

export function error(...args) {
  const { subsystem, message, rest } = normalizeArgs(args);
  const prefix = formatPrefix(subsystem);

  _c.error(
    `%c${prefix} 🟥 [ERROR] — ${message}`,
    "color:#EF5350; font-weight:bold;",
    ...rest
  );
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
}

// ============================================================================
//  GROUPING HELPERS — v10.3
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
//  TELEMETRY PACKET FORMATTER (v10.3)
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
      layer: "PulseLogger",
      version: "10.3",
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
//  LOGGER EXPORT — ⭐ THIS IS WHAT VITALS MONITOR NEEDS
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
    layer: "PulseLogger",
    version: "10.3"
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
    layer: "PulseLogger",
    version: "10.3"
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
