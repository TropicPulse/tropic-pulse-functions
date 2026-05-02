// ============================================================================
//  PulseProofLogger.js — v13.1-EVO-ALWAYS-ON-OFFLINE-FIRST
//  PROOF LOGGER • AI CONSOLE EXTENSION • OFFLINE-FIRST TELEMETRY
// ============================================================================


import { safeRoute as route } from "./PulseProofBridge.js";
// Capture original console to avoid recursion
const _c = { ...console };

// -----------------------------------------------------------------------------
// Environment + online flag (offline-first)
// -----------------------------------------------------------------------------
const g =
  typeof global !== "undefined"
    ? global
    : typeof globalThis !== "undefined"
    ? globalThis
    : typeof window !== "undefined"
    ? window
    : {};

function isOnline() {
  if (typeof window !== "undefined") {
    return window.PULSE_ONLINE === true;
  }
  if (typeof g.PULSE_ONLINE === "boolean") {
    return g.PULSE_ONLINE === true;
  }
  return false;
}

function hasRoute() {
  return typeof route === "function";
}

// -----------------------------------------------------------------------------
// Existing maps and helpers (version bumped)
// -----------------------------------------------------------------------------
export const PulseVersion = {
  proof: "13.1",
  logger: "13.1",
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

function formatPrefix(subsystem) {
  const role = PulseRoles[subsystem] || "SUBSYSTEM";
  const version = PulseVersion[subsystem] || "12.x";
  const icon = PulseIcons[subsystem] || PulseIcons.legacy;
  return `${icon} ${role} v${version}`;
}

function normalizeArgs(args) {
  let subsystem = "legacy";
  let message = "";
  let rest = [];
  let raw = false;

  const first = args[0];

  if (typeof first === "string" && first.startsWith("%c")) {
    return { subsystem, message: first, rest: args.slice(1), raw: true };
  }

  if (args.length >= 2 && typeof first === "string" && typeof args[1] === "string") {
    return { subsystem: first, message: args[1], rest: args.slice(2), raw: false };
  }

  if (typeof first === "object" && first !== null) {
    const obj = first;
    if (obj.pulseLayer === "NERVOUS-SYSTEM") subsystem = "band";
    if (obj.schemaVersion && obj.textures !== undefined) subsystem = "gpu";
    if (obj.binaryArtery === true) subsystem = "logger";
    return { subsystem, message: "", rest: [obj], raw: false };
  }

  if (args.length === 1) {
    return { subsystem, message: first, rest: [], raw: false };
  }

  return { subsystem, message: args.join(" "), rest: [], raw: false };
}

// -----------------------------------------------------------------------------
// Telemetry packet formatter
// -----------------------------------------------------------------------------
export function makeTelemetryPacket(subsystem, event, data = {}) {
  const ts = Date.now();
  const version = PulseVersion[subsystem] || "12.x";
  const role = PulseRoles[subsystem] || "SUBSYSTEM";
  const icon = PulseIcons[subsystem] || PulseIcons.legacy;
  const band = data.band || "dual";
  const presence = { field: data.presenceField || null, mesh: data.meshPresence || null };
  const binary = { artery: data.binaryArtery || false, channel: data.binaryChannel || null };
  const lineage = { id: data.lineageId || null, parent: data.lineageParent || null };

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
      version: "13.1-EVO-ALWAYS-ON-OFFLINE-FIRST",
      subsystem,
      event,
      band,
      presence,
      binary,
      lineage
    }
  };
}

// -----------------------------------------------------------------------------
// Firebase / telemetry bridge — OFFLINE-FIRST, FAILURE-PROOF
// -----------------------------------------------------------------------------
async function sendToFirebase(level, message, rest) {
  // Offline-first: never block logging if CNS/route is missing or offline.
  if (!hasRoute()) return;
  if (!isOnline()) return;

  try {
    await route("firebaseLog", { level, message, rest });
  } catch (e) {
    _c.warn("PulseProofLogger: Firebase logging failed:", e);
  }
}

// -----------------------------------------------------------------------------
// Pulse command handler (AI console extension)
// -----------------------------------------------------------------------------
function handlePulseCommand(cmd) {
  const raw = cmd.slice(6).trim(); // remove "Pulse:"
  const parts = raw.split(/\s+/);
  const verb = parts[0] ? parts[0].toLowerCase() : "";

  switch (verb) {
    case "help":
      aiHelpBanner();
      break;

    case "ai":
      aiHelpBanner();
      break;

    case "list":
      _c.log("AI Prompts:", listAIPrompts());
      break;

    case "open": {
      const id = parts[1];
      if (!id) return _c.warn("Pulse: Open requires an id. Usage: Pulse: Open <id>");
      openAIPrompt(id);
      break;
    }

    case "close": {
      const id = parts[1];
      if (!id) return _c.warn("Pulse: Close requires an id. Usage: Pulse: Close <id>");
      closeAIPrompt(id);
      break;
    }

    case "recent": {
      const recent = getRecentAIPrompt();
      if (!recent) return _c.log("No recent AI prompt.");
      openAIPrompt(recent.id);
      break;
    }

    default:
      _c.warn(`Unknown Pulse command: ${verb}. Type "Pulse: Help" for options.`);
      break;
  }
}

// -----------------------------------------------------------------------------
// Core logging functions — now offline-first, CNS-optional
// -----------------------------------------------------------------------------
export function log(...args) {
  const { subsystem, message, rest, raw } = normalizeArgs(args);
  const color = PulseColors[subsystem] || "#fff";
  const prefix = formatPrefix(subsystem);

  // Pulse: commands on logger channel
  if (subsystem === "logger" && typeof message === "string" && message.startsWith("Pulse:")) {
    handlePulseCommand(message);
    return;
  }

  const safeMessage = mark404(message);

if (raw) {
  _c.log(safeMessage, ...rest);
} else {
  _c.log(`%c${prefix} — ${safeMessage}`, `color:${color}; font-weight:bold;`, ...rest);
}

sendToFirebase("log", safeMessage, rest);

}

export function warn(...args) {
  const { subsystem, message, rest } = normalizeArgs(args);
  const prefix = formatPrefix(subsystem);

 const safeMessage = mark404(message);

_c.warn(
  `%c${prefix} ⚠️ [WARN] — ${safeMessage}`,
  "color:#FFEE58; font-weight:bold;",
  ...rest
);

sendToFirebase("warn", safeMessage, rest);

}

export function error(...args) {
  const { subsystem, message, rest } = normalizeArgs(args);
  const prefix = formatPrefix(subsystem);

 const safeMessage = mark404(message);

_c.error(
  `%c${prefix} 🟥 [ERROR] — ${safeMessage}`,
  "color:#EF5350; font-weight:bold;",
  ...rest
);

sendToFirebase("error", safeMessage, rest);

}

export function critical(...args) {
  const { subsystem, message, rest } = normalizeArgs(args);
  const prefix = formatPrefix(subsystem);

  const safeMessage = mark404(message);

_c.groupCollapsed(
  `%c${prefix} 💀 [CRITICAL] — ${safeMessage}`,
  "color:#D32F2F; font-weight:bold; font-size:14px;"
);
_c.error(`%c${safeMessage}`, "color:#D32F2F; font-weight:bold;", ...rest);
_c.groupEnd();

sendToFirebase("critical", safeMessage, rest);

}

// -----------------------------------------------------------------------------
// Grouping helpers
// -----------------------------------------------------------------------------
export function group(subsystem, label) {
  const color = PulseColors[subsystem] || "#fff";
  const prefix = formatPrefix(subsystem);
  _c.groupCollapsed(`%c${prefix} — ${label}`, `color:${color}; font-weight:bold;`);
}

export function groupEnd() {
  _c.groupEnd();
}

function mark404(message) {
  if (typeof message === "string" && message.trim() === "404") {
    return "404*";
  }
  return message;
}

// -----------------------------------------------------------------------------
// AI Console Extension
// -----------------------------------------------------------------------------
const AIPromptStore = Object.create(null);
let recentAIPromptId = null;

export function createAIPrompt({ id, role = "assistant", text = "", meta = {} } = {}) {
  if (!id) throw new Error("createAIPrompt requires id");
  const created = Date.now();
  AIPromptStore[id] = {
    id,
    role,
    text,
    meta,
    created,
    opened: false,
    archived: false
  };
  recentAIPromptId = id;
  return AIPromptStore[id];
}

export function openAIPrompt(id, { trace = false } = {}) {
  const p = AIPromptStore[id];
  if (!p) return null;

  p.opened = true;
  p.archived = false;

  const subsystem = p.meta.subsystem || "proof";
  const label = `${p.role} ${id} — ${p.meta.title || "AI Prompt"}`;

  group(subsystem, label);
  try {
    _c.log(`%c${p.role.toUpperCase()} ${id}`, "font-weight:bold; color:#9b59b6;");
    if (p.meta) _c.log("meta:", p.meta);
    _c.log("prompt:", p.text);
    if (Array.isArray(p.meta.context) && p.meta.context.length) {
      _c.log("context:", p.meta.context);
    }
    if (p.meta.previous) _c.log("previous:", p.meta.previous);
  } finally {
    groupEnd();
  }

  // Telemetry bloodstream hook — best-effort, offline-first
  try {
    const packet = makeTelemetryPacket(subsystem, "ai_prompt_open", {
      promptId: id,
      role: p.role,
      title: p.meta.title || null,
      band: p.meta.band || "dual"
    });
    if (hasRoute() && isOnline()) {
      route("telemetryIngest", packet).catch(() => {});
    }
  } catch (e) {}

  if (trace) _c.log(`[AIPrompt] opened ${id}`);
  return p;
}

export function closeAIPrompt(id, { archive = true, trace = false } = {}) {
  const p = AIPromptStore[id];
  if (!p) return null;
  p.opened = false;
  if (archive) p.archived = true;

  // Telemetry bloodstream hook — best-effort
  try {
    const packet = makeTelemetryPacket(p.meta?.subsystem || "proof", "ai_prompt_close", {
      promptId: id,
      role: p.role,
      archived: !!p.archived,
      band: p.meta?.band || "dual"
    });
    if (hasRoute() && isOnline()) {
      route("telemetryIngest", packet).catch(() => {});
    }
  } catch (e) {}

  const keys = Object.keys(AIPromptStore).reverse();
  for (const k of keys) {
    if (!AIPromptStore[k].archived) {
      recentAIPromptId = k;
      break;
    }
  }

  if (trace) _c.log(`[AIPrompt] closed ${id}, recent now ${recentAIPromptId}`);
  return p;
}

export function getRecentAIPrompt() {
  return recentAIPromptId ? AIPromptStore[recentAIPromptId] : null;
}

export function listAIPrompts({ includeArchived = false } = {}) {
  return Object.values(AIPromptStore).filter(p => includeArchived || !p.archived);
}

export function aiHelpBanner() {
  _c.groupCollapsed(
    "%c🤖 AI Console Help (Pulse: commands)",
    "color:#9b59b6; font-weight:bold; font-size:13px;"
  );

  _c.log("• Pulse: Help                 → show this help banner");
  _c.log("• Pulse: List                 → list active AI prompts");
  _c.log("• Pulse: Open <id>            → open prompt <id> in console");
  _c.log("• Pulse: Close <id>           → close/archive prompt <id>");
  _c.log("• createAIPrompt({ id, text })→ register a new AI prompt (API)");
  _c.groupEnd();
}

// Optional persistence helpers using route bridge
export async function persistAIPrompts(storageKey = "PulseAIPrompts") {
  try {
    if (hasRoute() && isOnline()) {
      await route("memorySave", { key: storageKey, value: JSON.stringify(AIPromptStore) });
    }
  } catch (e) {
    _c.warn("persistAIPrompts failed", e);
  }
}

export async function restoreAIPrompts(storageKey = "PulseAIPrompts") {
  try {
    if (hasRoute() && isOnline()) {
      const res = await route("memoryLoad", { key: storageKey });
      if (res && res.value) {
        const parsed = JSON.parse(res.value);
        Object.assign(AIPromptStore, parsed);
        const keys = Object.keys(AIPromptStore);
        recentAIPromptId = keys.length ? keys[keys.length - 1] : null;
      }
    }
  } catch (e) {
    _c.warn("restoreAIPrompts failed", e);
  }
}

// -----------------------------------------------------------------------------
// Legacy console redirects preserved — logger is the membrane
// -----------------------------------------------------------------------------
console.log = (...args) => log(...args);
console.warn = (...args) => warn(...args);
console.error = (...args) => error(...args);

// -----------------------------------------------------------------------------
// Exports
// -----------------------------------------------------------------------------
export const VitalsLogger = {
  log,
  warn,
  error,
  critical,
  group,
  groupEnd,
  makeTelemetryPacket,
  createAIPrompt,
  openAIPrompt,
  closeAIPrompt,
  getRecentAIPrompt,
  listAIPrompts,
  persistAIPrompts,
  restoreAIPrompts,
  meta: { layer: "PulseProofLogger", version: "13.1-EVO-ALWAYS-ON-OFFLINE-FIRST" }
};

export const logger = { ...VitalsLogger };

// Optional dev helpers (can be removed for production)
if (typeof window !== "undefined") {
  window.aiHelp = aiHelpBanner;
  setTimeout(() => {
    aiHelpBanner();
  }, 300);

  window.log = log;
  window.warn = warn;
  window.error = error;
  window.critical = critical;
  window.group = group;
  window.groupEnd = groupEnd;
  window.createAIPrompt = createAIPrompt;
  window.openAIPrompt = openAIPrompt;
  window.closeAIPrompt = closeAIPrompt;
  window.listAIPrompts = listAIPrompts;
}
