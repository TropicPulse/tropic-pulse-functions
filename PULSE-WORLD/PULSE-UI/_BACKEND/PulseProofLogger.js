// ============================================================================
//  PulseProofLogger.js — v14-IMMORTAL-LOGGER
//  PROOF LOGGER • AI CONSOLE EXTENSION • OFFLINE-FIRST TELEMETRY + LOCALSTORE
// ============================================================================
/*
AI_EXPERIENCE_META = {
  identity: "PulseProofLogger",
  version: "v14-IMMORTAL-LOGGER",
  layer: "frontend",
  role: "observer_logger",
  lineage: "PulseOS-v14",

  evo: {
    passive: true,
    alwaysOn: true,
    safeRouteFree: true,
    dualBandAware: true,
    chunkAligned: true,
    presenceAware: true,
    cnsAligned: true,
    offlineFirst: true,
    localStoreMirrored: true,
    replayAware: true
  },

  contract: {
    always: [
      "PulseWindow",
      "PulsePresence",
      "PulseChunks",
      "PulseUIFlow",
      "PulseUIErrors",
      "PulseOfflineLogs"
    ],
    never: [
      "legacyLogger",
      "legacyObserver",
      "safeRoute",
      "fetchViaCNS",
      "legacyPresence",
      "legacyChunker",
      "legacyFlow"
    ]
  }
}
*/

import { safeRoute as route } from "./PulseProofBridge.js";

// Capture original console to avoid recursion
const _c = { ...console };

// -----------------------------------------------------------------------------
// Environment + online flag (offline-first)
// -----------------------------------------------------------------------------
const g =
  typeof globalThis !== "undefined"
    ? globalThis
    : typeof global !== "undefined"
    ? global
    : typeof window !== "undefined"
    ? window
    : {};

function isOnline() {
  if (typeof window !== "undefined" && typeof window.PULSE_ONLINE === "boolean") {
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
// LocalStorage OFFLINE LOG STORE — v14 IMMORTAL
//  - Every log/warn/error/critical is mirrored here
//  - Any page / any mode can read the same log history
// -----------------------------------------------------------------------------
const LS_KEY_LOGS = "PulseProofLogger.v14.logs";
const LS_MAX_ENTRIES = 5000; // ring-ish cap to avoid unbounded growth

function hasLocalStorage() {
  try {
    if (typeof window === "undefined" || !window.localStorage) return false;
    const testKey = "__pulse_logger_test__";
    window.localStorage.setItem(testKey, "1");
    window.localStorage.removeItem(testKey);
    return true;
  } catch (_) {
    return false;
  }
}

function loadLocalLogs() {
  if (!hasLocalStorage()) return [];
  try {
    const raw = window.localStorage.getItem(LS_KEY_LOGS);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch (_) {
    return [];
  }
}

function saveLocalLogs(entries) {
  if (!hasLocalStorage()) return;
  try {
    const trimmed =
      entries.length > LS_MAX_ENTRIES
        ? entries.slice(entries.length - LS_MAX_ENTRIES)
        : entries;
    window.localStorage.setItem(LS_KEY_LOGS, JSON.stringify(trimmed));
  } catch (_) {
    // ignore
  }
}

let localLogBuffer = loadLocalLogs();

function appendLocalLog(entry) {
  localLogBuffer.push(entry);
  saveLocalLogs(localLogBuffer);
}

function getLocalLogs({ level = null, subsystem = null } = {}) {
  return localLogBuffer.filter((e) => {
    if (level && e.level !== level) return false;
    if (subsystem && e.subsystem !== subsystem) return false;
    return true;
  });
}

// Optional: mark entries as synced when successfully sent upstream
function markLocalLogsSynced(ids = []) {
  if (!ids || !ids.length) return;
  let changed = false;
  localLogBuffer = localLogBuffer.map((e) => {
    if (ids.includes(e.id)) {
      if (!e.synced) {
        changed = true;
        return { ...e, synced: true };
      }
    }
    return e;
  });
  if (changed) saveLocalLogs(localLogBuffer);
}

// Replay unsynced logs when we come online
async function flushLocalLogsToFirebase() {
  if (!hasRoute() || !isOnline()) return;
  const unsynced = localLogBuffer.filter((e) => !e.synced);
  if (!unsynced.length) return;

  const sentIds = [];
  for (const entry of unsynced) {
    try {
      await route("firebaseLog", {
        level: entry.level,
        message: entry.message,
        rest: entry.rest || [],
        ts: entry.ts,
        subsystem: entry.subsystem,
        offline: true
      });
      sentIds.push(entry.id);
    } catch (_) {
      // stop on first failure to avoid hammering
      break;
    }
  }

  if (sentIds.length) {
    markLocalLogsSynced(sentIds);
  }
}

// Try to flush on load and whenever we detect online
if (typeof window !== "undefined") {
  // initial attempt
  flushLocalLogsToFirebase().catch(() => {});
  // listen to browser online event
  window.addEventListener("online", () => {
    flushLocalLogsToFirebase().catch(() => {});
  });
}

// -----------------------------------------------------------------------------
// Maps and helpers
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
// Firebase / telemetry bridge — OFFLINE-FIRST, FAILURE-PROOF + LOCALSTORE
// -----------------------------------------------------------------------------
let logIdCounter = Date.now();

function makeLocalLogEntry(level, subsystem, message, rest) {
  return {
    id: `L${++logIdCounter}`,
    ts: Date.now(),
    level,
    subsystem,
    message,
    rest
  };
}

async function sendToFirebase(level, message, rest, subsystem = "legacy") {
  // Always mirror to localStorage first — offline beast
  const entry = makeLocalLogEntry(level, subsystem, message, rest);
  appendLocalLog(entry);

  if (!hasRoute() || !isOnline()) {
    return;
  }

  try {
    await route("firebaseLog", {
      level,
      message,
      rest,
      ts: entry.ts,
      subsystem,
      offline: false
    });
    // mark this entry as synced
    markLocalLogsSynced([entry.id]);
  } catch (e) {
    _c.warn("PulseProofLogger: Firebase logging failed:", e);
  }
}

// -----------------------------------------------------------------------------
// Pulse command handler (AI console extension)
// -----------------------------------------------------------------------------
function handlePulseCommand(cmd) {
  const raw = cmd.slice(6).trim();
  const parts = raw.split(/\s+/);
  const verb = parts[0] ? parts[0].toLowerCase() : "";

  switch (verb) {
    case "help":
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

    case "logs": {
      const all = getLocalLogs();
      _c.groupCollapsed("%cPulse: Offline Logs", "color:#FF7043; font-weight:bold;");
      _c.log(all);
      _c.groupEnd();
      break;
    }

    default:
      _c.warn(`Unknown Pulse command: ${verb}. Type "Pulse: Help" for options.`);
      break;
  }
}

// -----------------------------------------------------------------------------
// Core logging functions — offline-first, CNS-optional, LOCALSTORE MIRRORED
// -----------------------------------------------------------------------------
function mark404(message) {
  if (typeof message === "string" && message.trim() === "404") {
    return "404*";
  }
  return message;
}

export function log(...args) {
  const { subsystem, message, rest, raw } = normalizeArgs(args);
  const color = PulseColors[subsystem] || "#fff";
  const prefix = formatPrefix(subsystem);

  if (subsystem === "logger" && typeof message === "string" && message.startsWith("Pulse:")) {
    handlePulseCommand(message);
    return;
  }

  const safeMessage = mark404(message);

  if (raw) {
    _c.log(safeMessage, ...rest);
  } else {
    _c.log(
      `%c${prefix} — ${safeMessage}`,
      `color:${color}; font-weight:bold;`,
      ...rest
    );
  }

  sendToFirebase("log", safeMessage, rest, subsystem);
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

  sendToFirebase("warn", safeMessage, rest, subsystem);
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

  sendToFirebase("error", safeMessage, rest, subsystem);
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

  sendToFirebase("critical", safeMessage, rest, subsystem);
}

// -----------------------------------------------------------------------------
// Grouping helpers
// -----------------------------------------------------------------------------
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
  } catch (_) {}

  if (trace) _c.log(`[AIPrompt] opened ${id}`);
  return p;
}

export function closeAIPrompt(id, { archive = true, trace = false } = {}) {
  const p = AIPromptStore[id];
  if (!p) return null;

  p.opened = false;
  if (archive) p.archived = true;

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
  } catch (_) {}

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
  _c.log("• Pulse: Logs                 → dump offline log buffer");
  _c.log("• createAIPrompt({ id, text })→ register a new AI prompt (API)");
  _c.groupEnd();
}

// -----------------------------------------------------------------------------
// Optional persistence helpers using route bridge (unchanged)
// -----------------------------------------------------------------------------
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
// Legacy console redirects — logger is the membrane
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
  getLocalLogs,
  flushLocalLogsToFirebase,
  meta: { layer: "PulseProofLogger", version: "14.0-IMMORTAL-OFFLINE-LOCALSTORE" }
};

export const logger = { ...VitalsLogger };

// ============================================================================
// GLOBAL LOGGER BINDINGS — v14 IMMORTAL + OFFLINE LOG SURFACE
// ============================================================================
(function bindLogger() {
  try {
    // Browser environment
    if (typeof window !== "undefined") {
      window.aiHelp = aiHelpBanner;
      setTimeout(() => aiHelpBanner(), 300);

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

      // Offline beast visibility: global log surface
      window.PulseOfflineLogs = {
        getAll: () => getLocalLogs(),
        getByLevel: (level) => getLocalLogs({ level }),
        getBySubsystem: (subsystem) => getLocalLogs({ subsystem }),
        flushToFirebase: () => flushLocalLogsToFirebase()
      };
    }

    // Universal binding (browser + node + workers)
    globalThis.log = log;
    globalThis.warn = warn;
    globalThis.error = error;
    globalThis.critical = critical;
    globalThis.group = group;
    globalThis.groupEnd = groupEnd;

    globalThis.createAIPrompt = createAIPrompt;
    globalThis.openAIPrompt = openAIPrompt;
    globalThis.closeAIPrompt = closeAIPrompt;
    globalThis.listAIPrompts = listAIPrompts;

    // Also expose offline logs on globalThis
    globalThis.PulseOfflineLogs = {
      getAll: () => getLocalLogs(),
      getByLevel: (level) => getLocalLogs({ level }),
      getBySubsystem: (subsystem) => getLocalLogs({ subsystem }),
      flushToFirebase: () => flushLocalLogsToFirebase()
    };

  } catch (err) {
    _c.error("Logger binding failed:", err);
  }
})();
