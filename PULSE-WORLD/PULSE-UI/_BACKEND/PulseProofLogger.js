// ============================================================================
//  PulseProofLogger.js — v15-IMMORTAL-LOGGER • US/THEM • META-IMMORTAL
//  PROOF LOGGER • AI CONSOLE EXTENSION • OFFLINE-FIRST TELEMETRY + LOCALSTORE
// ============================================================================
//  THIS LOGGER IS NOW THE SUPREME MEMBRANE ABOVE ALL LAYERS.
//  IT SEES EVERYTHING. IT TAGS EVERYTHING. IT STORES EVERYTHING.
//
//  🔥 ROUTING PRINCIPLE
//  ---------------------------------------------------------------------------
//  • Routing is conceptually for PULSES.
//  • This logger does NOT depend on routing for access to Firebase.
//  • It writes directly to Firebase when `db` is available on this page.
//  • It can STILL mirror via route("firebaseLog"/"telemetryIngest") for
//    remote ingestion — but that is additive, not required.
//
//  🔥 US vs THEM PRINCIPLE
//  ---------------------------------------------------------------------------
//  • NO FLAGS. NO ENV VARS. PURELY DERIVED FROM LAYER NAME.
//  • If layer string (case-insensitive) contains "PULSENET" → US.
//  • Otherwise → THEM.
//  • This works across all layers, all subsystems, all organs.
//
//  🔥 META PRINCIPLE
//  ---------------------------------------------------------------------------
//  Every log/warn/error/critical now carries:
//    • layer (string, e.g. "PULSENET", "WINDOW", "PULSECORE", etc.)
//    • us_vs_them ("US" | "THEM")
//    • system (optional)
//    • subsystem (auto-detected or provided)
//    • organ (optional)
//    • page (auto-detected in browser)
//    • func (optional / auto from function reference)
//    • extra (arbitrary metadata)
//    • ts, level, message, rest
//
//  All of this is:
//    • stored offline (localStorage ring buffer)
//    • mirrored to console with rich prefixes
//    • written directly to Firebase when `db` is present
//    • optionally mirrored via route("firebaseLog") when online
// ============================================================================

console.log("Logger");
import { safeRoute as route } from "./PulseProofBridge.js";

// Capture original console to avoid recursion
const _c = { ...console };

// Global handle
const g =
  typeof globalThis !== "undefined"
    ? globalThis
    : typeof global !== "undefined"
    ? global
    : typeof window !== "undefined"
    ? window
    : typeof g !== "undefined"
    ? g
    : {};

// Prefer global db if present (logger page / server)
const db =
  (g && g.db) ||
  (typeof global !== "undefined" && global.db) ||
  (typeof globalThis !== "undefined" && globalThis.db) ||
  (typeof window !== "undefined" && window.db) ||
  null;

// -----------------------------------------------------------------------------
// Environment + online flag (offline-first)
// -----------------------------------------------------------------------------
function isOnline() {
  if (typeof window !== "undefined" && typeof window.PULSE_ONLINE === "boolean") {
    return window.PULSE_ONLINE === true;
  }
  if (typeof global !== "undefined" && typeof global.PULSE_ONLINE === "boolean") {
    return global.PULSE_ONLINE === true;
  }
  if (typeof globalThis !== "undefined" && typeof globalThis.PULSE_ONLINE === "boolean") {
    return globalThis.PULSE_ONLINE === true;
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
// Layer + US/THEM detection (NO FLAGS, PURELY BY NAME)
// -----------------------------------------------------------------------------
function normalizeLayerName(layer) {
  if (!layer) return null;
  return String(layer).trim();
}

function detectLayer(metaLayer = null) {
  const explicit = normalizeLayerName(metaLayer);
  if (explicit) return explicit;

  if (typeof window !== "undefined") return "WINDOW";
  return "UNKNOWN";
}

function detectUsVsThem(layer) {
  const upper = String(layer || "").toUpperCase();
  return upper.includes("PULSENET") ? "US" : "THEM";
}

function detectPage() {
  if (typeof window !== "undefined" && window.location) {
    return window.location.pathname || null;
  }
  return null;
}

// -----------------------------------------------------------------------------
// LocalStorage OFFLINE LOG STORE — v15 IMMORTAL
// -----------------------------------------------------------------------------
const LS_KEY_LOGS = "PulseProofLogger.v15.logs";
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
        layer: entry.layer,
        us_vs_them: entry.us_vs_them,
        system: entry.system,
        organ: entry.organ,
        page: entry.page,
        func: entry.func,
        extra: entry.extra,
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
  flushLocalLogsToFirebase().catch(() => {});
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
      version: "15.0-EVO-ALWAYS-ON-OFFLINE-FIRST",
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
// Firebase / telemetry bridge — OFFLINE-FIRST, META-IMMORTAL
// -----------------------------------------------------------------------------
let logIdCounter = Date.now();

function makeLocalLogEntry(level, subsystem, message, rest, meta = {}) {
  const layer = detectLayer(meta.layer);
  const us_vs_them = detectUsVsThem(layer);
  const page = meta.page || detectPage();
  const func = meta.func || null;
  const system = meta.system || null;
  const subsystemName = meta.subsystem || subsystem || null;
  const organ = meta.organ || null;
  const extra = meta.extra || {};

  return {
    id: `L${++logIdCounter}`,
    ts: Date.now(),
    level,
    subsystem: subsystemName,
    message,
    rest,
    layer,
    us_vs_them,
    system,
    organ,
    page,
    func,
    extra
  };
}

async function sendToFirebase(level, message, rest, subsystem = "legacy", meta = {}) {
  // Build enriched entry (offline-first)
  const entry = makeLocalLogEntry(level, subsystem, message, rest, meta);
  appendLocalLog(entry);

  // Direct Firebase write when db is present (instant, no routing needed)
  if (db && typeof db.collection === "function") {
    try {
      await db.collection("GLOBAL_LOGS").add(entry);
      markLocalLogsSynced([entry.id]);
    } catch (e) {
      _c.warn("PulseProofLogger: direct Firebase write failed:", e);
    }
  }

  // Optional remote ingestion via route (kept, not required)
  if (!hasRoute() || !isOnline()) {
    return;
  }

  try {
    await route("firebaseLog", {
      level,
      message,
      rest,
      ts: entry.ts,
      subsystem: entry.subsystem,
      layer: entry.layer,
      us_vs_them: entry.us_vs_them,
      system: entry.system,
      organ: entry.organ,
      page: entry.page,
      func: entry.func,
      extra: entry.extra,
      offline: false
    });
    markLocalLogsSynced([entry.id]);
  } catch (e) {
    _c.warn("PulseProofLogger: Firebase logging via route failed:", e);
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
// GLOBAL PULSE LOGGER → Firebase + Console + Meta
// -----------------------------------------------------------------------------
export function pulseLog({
  layer = null,
  system = null,
  subsystem = null,
  organ = null,
  page = null,
  func = null,
  message = "",
  extra = {},
  level = "log",
  rest = []
} = {}) {
  const detectedLayer = detectLayer(layer);
  const us_vs_them = detectUsVsThem(detectedLayer);
  const detectedPage = page || detectPage();

  if (typeof func === "function") func = func.name || "anonymous";

  const meta = {
    layer: detectedLayer,
    system,
    subsystem,
    organ,
    page: detectedPage,
    func,
    extra
  };

  // Send to Firebase / offline store
  sendToFirebase(level, message, rest, subsystem || "legacy", meta);

  // Mirror to console with rich prefix
  const prefix =
    `[${us_vs_them}][${String(detectedLayer).toUpperCase()}]` +
    (system ? `[${system}]` : "") +
    (subsystem ? `[${subsystem}]` : "") +
    (organ ? `[${organ}]` : "") +
    (detectedPage ? `[${detectedPage}]` : "") +
    (func ? `[${func}]` : "");

  _c.log(`${prefix} ${message}`, ...rest);
}

// -----------------------------------------------------------------------------
// Core logging functions — offline-first, META-IMMORTAL
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

  // Enriched global pulse log
  pulseLog({
    level: "log",
    subsystem,
    message: safeMessage,
    rest
  });
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

  pulseLog({
    level: "warn",
    subsystem,
    message: safeMessage,
    rest
  });
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

  pulseLog({
    level: "error",
    subsystem,
    message: safeMessage,
    rest
  });
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

  pulseLog({
    level: "critical",
    subsystem,
    message: safeMessage,
    rest
  });
}
export const PulseLoggerStore = {
  getAll() {
    return getLocalLogs(); // returns full enriched log buffer
  },

  clear() {
    // wipe local log buffer
    localLogBuffer = [];
    saveLocalLogs(localLogBuffer);
  },

  tail(n = 200) {
    const buf = getLocalLogs();
    if (n <= 0) return [];
    return buf.slice(Math.max(0, buf.length - n));
  }
};
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
  pulseLog,
  meta: { layer: "PulseProofLogger", version: "15.0-IMMORTAL-META-US-THEM" }
};

export const logger = { ...VitalsLogger };

// ============================================================================
// GLOBAL LOGGER BINDINGS — v15 IMMORTAL + OFFLINE LOG SURFACE
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
try {
  if (typeof global !== "undefined") {
    global.VitalsLogger = VitalsLogger;
    global.PulseLoggerStore = PulseLoggerStore;
    global.PulseOfflineLogs = window.PulseOfflineLogs || globalThis.PulseOfflineLogs;
  }
  if (typeof globalThis !== "undefined") {
    globalThis.VitalsLogger = VitalsLogger;
    globalThis.PulseLoggerStore = PulseLoggerStore;
    globalThis.PulseOfflineLogs = window.PulseOfflineLogs || global.PulseOfflineLogs;
  }
  if (typeof window !== "undefined") {
    window.VitalsLogger = VitalsLogger;
    window.PulseLoggerStore = PulseLoggerStore;
    window.PulseOfflineLogs = globalThis.PulseOfflineLogs || global.PulseOfflineLogs;
  }
  if (typeof g !== "undefined") {
    g.VitalsLogger = VitalsLogger;
    g.PulseLoggerStore = PulseLoggerStore;
    g.PulseOfflineLogs = window.PulseOfflineLogs || globalThis.PulseOfflineLogs;
  }
} catch {
  // never throw
}