// ============================================================================
// FILE: /apps/PulseOS/Organs/Skin/PulseOSSkinReflex.js
// PULSE OS — v9.1
// “THE SKIN REFLEX / SURFACE EPITHELIAL MEMBRANE”
// A1 BARRIER • PAGE-LEVEL REFLEX • ZERO TIMING • ZERO STATE
// ============================================================================
//
// ORGAN IDENTITY (v9.1):
//   • Organ Type: Skin / Surface Membrane / Reflex Layer
//   • Layer: A1 (Page-Level Reflex)
//   • Biological Analog: Skin + surface epithelial membrane
//   • System Role: First-line error intake + classification at the page surface
//
// PURPOSE:
//   ✔ Intercept JS errors at the page/surface level
//   ✔ Extract stack frames + route context
//   ✔ Build dynamic route traces (living map, not config)
//   ✔ Classify page-level failures (import/env/recursion) early
//   ✔ Trigger backend healing deterministically for missing-field patterns
//   ✔ Always pipe errors to backend for logging + lineage
//
// WHAT THIS ORGAN IS:
//   ✔ The skin reflex of PulseOS
//   ✔ The lowest / outermost membrane (A1 barrier)
//   ✔ A universal error intake at the surface
//   ✔ A living route sampler and classifier
//
// WHAT THIS ORGAN IS NOT:
//   ✘ NOT a router
//   ✘ NOT a backend logic layer
//   ✘ NOT a state machine
//   ✘ NOT a scheduler or timer
//
// SAFETY CONTRACT (v9.1):
//   • Never run timers, loops, or scheduling
//   • Never hold long-lived state (only ephemeral route memory)
//   • Never mutate payloads
//   • Always classify before escalating
//   • Always forward healing triggers via Router
// ============================================================================
// ============================================================================
// FILE: /apps/PulseOS/Organs/Barriers/PulseOSSkinReflex.js
// PULSE OS — v9.2
// “THE SKIN REFLEX / SURFACE EPITHELIAL MEMBRANE”
// UNIVERSAL ERROR INTAKE • ROUTE TRACE • HEALING TRIGGERS • BACKEND PIPE
// ============================================================================
//
// ORGAN IDENTITY (v9.2):
//   • Organ Type: Barrier / Reflex Membrane
//   • Layer: A / A2 (Surface Reflex)
//   • Biological Analog: Skin-level epithelial reflex
//   • System Role: Universal surface error intake + healing trigger
//
// SAFETY CONTRACT (v9.2):
//   • Never block CNS or Mesh
//   • Never mutate payloads
//   • Never run timers or schedulers
//   • Always classify errors before healing when possible
//   • Always remain frontend-only (no direct backend wiring outside Router)
// ============================================================================


// ============================================================================
// SYMBOL → OWNER MODULE RESOLUTION (v9.2 — unchanged behavior)
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
const LAYER_ID   = "SKIN-REFLEX";
const LAYER_NAME = "THE SKIN REFLEX";
const LAYER_ROLE = "SURFACE ERROR GUARDIAN & HEALING TRIGGER";
const LAYER_VER  = "9.2";

const PROTECTOR_DIAGNOSTICS_ENABLED =
  window.PULSE_PROTECTOR_DIAGNOSTICS === "true" ||
  window.PULSE_DIAGNOSTICS === "true";

const logProtector = (stage, details = {}) => {
  if (!PROTECTOR_DIAGNOSTICS_ENABLED) return;

  log(
    JSON.stringify({
      pulseLayer: LAYER_ID,
      pulseName:  LAYER_NAME,
      pulseRole:  LAYER_ROLE,
      pulseVer:   LAYER_VER,
      stage,
      ...details
    })
  );
};


// ============================================================================
// PULSE OS v9.2 — SKIN REFLEX (A → A2 → Router → Backend)
// ============================================================================
import { route } from "./PulseOSCNSNervousSystem.js";


// ============================================================================
// ROUTE MEMORY — LIVING MAP, NOT CONFIG
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
// PUBLIC API (C‑LAYER passthrough)
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
// ATTACH SKIN REFLEX
// ============================================================================
export function attachScanner(id) {
  if (!id) {
    logProtector("ATTACH_NO_ID", {});
    return;
  }

  window.tp_identity = id;

  logProtector("ATTACH_OK", { uid: id.uid });

  log(
    "%c[PulseOSSkinReflex] Attached with identity: " + id.uid,
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

    const msg   = event.message || "";
    const stack = event.error?.stack || "";
    const frames = stack.split("\n").map((s) => s.trim());

    const rawFrames = frames
      .filter((f) => f.includes(".js"))
      .map((f) => f.replace(/^at\s+/, ""));

    logProtector("ERROR_INTERCEPTED", { message: msg });

    // ------------------------------------------------------------------------
    // PAGE-LEVEL CLASSIFICATION (router-style guards)
    // ------------------------------------------------------------------------
    // v9.3 — Full Import Identity (no symbol-level conflicts)
    if (msg.includes("Cannot find module") || msg.includes("already been declared")) {
      logProtector("PAGE_IMPORT_CONFLICT_DETECTED", {
        error: "importConflict",
        details: msg
      });

      // escalate to CNS for full-import identity resolution
      await route("importConflict", {
        message: msg,
        frames: rawFrames,
        reflexOrigin: "SkinReflex",
        layer: "A1",
        mode: "full-import"
      });

      // DO NOT return — allow organism to continue
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
    // ROUTE TRACE — LIVING, NOT HARD-CODED
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
    // ALWAYS PIPE ERROR TO BACKEND
    // ------------------------------------------------------------------------
    await route("logError", {
      type: "unclassified",
      message: msg,
      frames: rawFrames,
      routeTrace,
      page: window.location.pathname
    });

    // ------------------------------------------------------------------------
    // HEALING LOGIC
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
      error("[PulseOSSkinReflex] Router fetch failed:", err);
    }

    healingInProgress = false;

    event.preventDefault();
  },
  true
);


// ============================================================================
// PARSER — same behavior, clearer intent
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
// END OF FILE — THE SKIN REFLEX / SURFACE EPITHELIAL MEMBRANE  [v9.2]
// ============================================================================
