// ============================================================================
// FILE: /apps/lib/Connectors/PageScanner.js
// PULSE ERROR GUARDIAN — v7.2
// “THE SENTINEL / THE IMMUNE SCOUT LAYER”
// ============================================================================
//
// THEME v7.2:
//   • Same organ, smarter nervous system
//   • Adds router-style guards at page level
//   • Classifies page errors before they ever hit the router
//   • Keeps healing behavior unchanged for missing-field patterns
//   • NEW: symbol → ownerModule resolution for smarter healing
//
// ROLE — “THE PROTECTOR”
//   • Intercepts JS errors
//   • Extracts stack frames + route context
//   • Builds a dynamic route trace (no file-name hardcoding)
//   • Triggers backend healing deterministically (for missing fields)
//   • Classifies page-level failures (import/env/recursion) early
// ============================================================================

// ============================================================================
// SYMBOL → OWNER MODULE RESOLUTION (v7.2)
// ============================================================================
function resolveOwnerModule(symbol) {
  try {
    const subsystems = window?.PULSE_SUBSYSTEMS;
    if (!subsystems) return null;

    for (const [moduleName, moduleExports] of Object.entries(subsystems)) {
      if (moduleExports && typeof moduleExports === "object") {
        if (symbol in moduleExports) {
          return moduleName;
        }
      }
    }
  } catch (err) {
    logProtector("OWNER_RESOLUTION_FAILED", { error: String(err) });
  }

  return null;
}

// ============================================================================
// LAYER CONSTANTS + DIAGNOSTICS
// ============================================================================
const LAYER_ID = "PROTECTOR-LAYER";
const LAYER_NAME = "THE PROTECTOR";
const LAYER_ROLE = "ERROR GUARDIAN & HEALING TRIGGER";

const PROTECTOR_DIAGNOSTICS_ENABLED =
  window.PULSE_PROTECTOR_DIAGNOSTICS === "true" ||
  window.PULSE_DIAGNOSTICS === "true";

const logProtector = (stage, details = {}) => {
  if (!PROTECTOR_DIAGNOSTICS_ENABLED) return;

  log(
    JSON.stringify({
      pulseLayer: LAYER_ID,
      pulseName: LAYER_NAME,
      pulseRole: LAYER_ROLE,
      stage,
      ...details
    })
  );
};


// ============================================================================
//  PULSE OS v7.8 — PAGE SCANNER (A → A2 → Router → Backend)
//  Universal Error Intake • Route Trace • Healing Triggers • Backend Pipe
// ============================================================================

import { route } from "./router.js";

// ============================================================================
// ROUTE MEMORY (v7.0) — LIVING MAP, NOT CONFIG
// ============================================================================
const RouteMemory = {
  store: {},

  makeKey(message, frames) {
    const top = frames[0] || "NO_FRAME";
    return message + "::" + top;
  },

  remember(message, frames, routeTrace) {
    const key = this.makeKey(message, frames);
    this.store[key] = {
      ts: Date.now(),
      message,
      frames,
      routeTrace
    };

    logProtector("ROUTE_MEMORY_SAVED", {
      key,
      frames: frames.length
    });
  },

  recall(message, frames) {
    const key = this.makeKey(message, frames);
    const entry = this.store[key];

    if (!entry) return null;

    logProtector("ROUTE_MEMORY_HIT", {
      key,
      frames: entry.frames.length
    });

    return entry.routeTrace;
  }
};

// ============================================================================
// PUBLIC API (C‑LAYER)
// ============================================================================
export async function getAuth(jwtToken) {
  logProtector("GET_AUTH", {});
  return await route("auth", { jwtToken });
}

export async function getHook(name, payload = {}) {
  logProtector("GET_HOOK", { name });
  return await route("hook", { name, payload });
}

export async function getMap(mapName) {
  logProtector("GET_MAP", { mapName });
  return await route("map", { mapName });
}

export async function callHelper(helperName, payload = {}) {
  logProtector("CALL_HELPER", { helperName });
  return await route("helper", { helperName, payload });
}

// ============================================================================
// ATTACH SCANNER
// ============================================================================
export function attachScanner(id) {
  if (!id) {
    logProtector("ATTACH_NO_ID", {});
    return;
  }

  window.tp_identity = id;

  logProtector("ATTACH_OK", { uid: id.uid });

  log(
    "%c[PageScanner] Attached with identity: " + id.uid,
    "color: #4CAF50; font-weight: bold;"
  );
}

// ============================================================================
// GLOBAL ERROR INTERCEPTOR (A → A2 → Router → Backend)
// ============================================================================
let healingInProgress = false;

window.addEventListener(
  "error",
  async (event) => {
    if (healingInProgress) return;

    const msg = event.message || "";
    const stack = event.error?.stack || "";
    const frames = stack.split("\n").map((s) => s.trim());

    const rawFrames = frames
      .filter((f) => f.includes(".js"))
      .map((f) => f.replace(/^at\s+/, ""));

    logProtector("ERROR_INTERCEPTED", { message: msg });

    // ------------------------------------------------------------------------
    // PAGE-LEVEL CLASSIFICATION (router-style guards)
    // ------------------------------------------------------------------------
    if (msg.includes("Cannot find module") || msg.includes("already been declared")) {
      logProtector("PAGE_IMPORT_CONFLICT", { error: "importConflict", details: msg });
      await route("logError", { type: "importConflict", message: msg, frames: rawFrames });
      return;
    }

    if (msg.includes("process is not defined")) {
      logProtector("PAGE_ENV_MISMATCH", {
        error: "frontendEnvMismatch",
        hint: "Replace process.env.* with window.PULSE_*"
      });
      await route("logError", { type: "envMismatch", message: msg, frames: rawFrames });
      return;
    }

    if (msg.includes("Maximum call stack size exceeded")) {
      logProtector("PAGE_RECURSION_LOOP", {
        error: "pageRecursionLoop",
        details: msg
      });
      await route("logError", { type: "recursionLoop", message: msg, frames: rawFrames });
      return;
    }

    // ------------------------------------------------------------------------
    // ROUTE TRACE v7.0 — LIVING, NOT HARD-CODED
    // ------------------------------------------------------------------------
    let routeTrace = RouteMemory.recall(msg, rawFrames);

    if (!routeTrace) {
      routeTrace = rawFrames.map((frame, index) => {
        const file = frame.split("/").pop().split(":")[0];

        return {
          frame,
          file,
          index,
          label: "UNKNOWN",
          layer: "UNKNOWN",
          purpose: "Observed frame — classification deferred",
          context: "Dynamic route sample — evolutionary layer may annotate"
        };
      });

      logProtector("ROUTE_TRACE_BUILT_DYNAMIC", {
        frames: routeTrace.length
      });

      RouteMemory.remember(msg, rawFrames, routeTrace);
    }

    // ------------------------------------------------------------------------
    // ALWAYS PIPE ERROR TO BACKEND (v7.8)
    // ------------------------------------------------------------------------
    await route("logError", {
      type: "unclassified",
      message: msg,
      frames: rawFrames,
      routeTrace,
      page: window.location.pathname
    });

    // ------------------------------------------------------------------------
    // HEALING LOGIC (v7.2)
    // ------------------------------------------------------------------------
    const parsed = parseMissingField(msg);
    if (!parsed) {
      logProtector("NO_MISSING_FIELD", {});
      return;
    }

    const { table, field } = parsed;
    const ownerModule = resolveOwnerModule(field);

    logProtector("HEALING_TRIGGERED", {
      table,
      field,
      ownerModule: ownerModule || "UNKNOWN"
    });

    healingInProgress = true;

    try {
      await route("fetchField", {
        table,
        field,
        ownerModule,
        message: msg,
        page: window.location.pathname,
        routeTrace
      });

      logProtector("HEALING_SUCCESS", { table, field, ownerModule });
    } catch (err) {
      logProtector("HEALING_FAILED", { error: String(err) });
      error("[PageScanner] Router fetch failed:", err);
    }

    healingInProgress = false;

    event.preventDefault();
  },
  true
);



// ============================================================================
// PARSER (v7.0 — same behavior, clearer intent)
// ============================================================================
function parseMissingField(message) {
  logProtector("PARSER_INVOKED", {});

  let match = message.match(/reading '([^']+)'/);
  if (match) return { table: "Users", field: match[1] };

  match = message.match(/([^ ]+) is not defined/);
  if (match) return { table: "Users", field: match[1] };

  match = message.match(/property '([^']+)'/);
  if (match) return { table: "Users", field: match[1] };

  return null;
}

// ============================================================================
// END OF FILE — THE SENTINEL / LIVING ROUTE MEMORY  [v7.2]
// ============================================================================
