// ============================================================================
// FILE: /apps/lib/Connectors/LayerScanner.js
// PULSE MID‑LAYER REFLEX — v1.1
// “THE TISSUE REFLEX / MID‑LAYER SENTINEL”
// ============================================================================
//
// ROLE — “THE MID‑LAYER PROTECTOR”
//   • Intercepts JS errors originating from the Layer (A → A2 → A3 chain)
//   • Catches mid‑layer import drift, recursion, env mismatches
//   • Builds dynamic route traces (same as PageScanner)
//   • Forwards lineage + context to Router for healing
//   • Prevents mid‑layer failures from reaching Mesh
//
// BIOLOGICAL ANALOGY:
//   • PageScanner = skin reflex
//   • LayerScanner = tissue reflex
//   • MeshScanner = organ reflex
//
// ============================================================================


// ============================================================================
// LAYER CONSTANTS + DIAGNOSTICS
// ============================================================================
const LAYER_ID = "LAYER-REFLEX";
const LAYER_NAME = "THE TISSUE REFLEX";
const LAYER_ROLE = "MID-LAYER ERROR GUARDIAN & HEALING TRIGGER";

const LAYER_DIAGNOSTICS_ENABLED =
  window.PULSE_LAYER_DIAGNOSTICS === "true" ||
  window.PULSE_DIAGNOSTICS === "true";

const logLayer = (stage, details = {}) => {
  if (!LAYER_DIAGNOSTICS_ENABLED) return;

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
// ROUTE MEMORY (same as PageScanner — living map, not config)
// ============================================================================
const LayerRouteMemory = {
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

    logLayer("ROUTE_MEMORY_SAVED", {
      key,
      frames: frames.length
    });
  },

  recall(message, frames) {
    const key = this.makeKey(message, frames);
    const entry = this.store[key];

    if (!entry) return null;

    logLayer("ROUTE_MEMORY_HIT", {
      key,
      frames: entry.frames.length
    });

    return entry.routeTrace;
  }
};


// ============================================================================
// PUBLIC API (C‑LAYER passthrough — identical to PageScanner)
// ============================================================================
import { route, Router } from "./router.js";

export async function layerAuth(jwtToken) {
  logLayer("LAYER_AUTH", {});
  return await route("auth", { jwtToken, reflexOrigin: "LayerScanner" });
}

export async function layerHook(name, payload = {}) {
  logLayer("LAYER_HOOK", { name });
  return await route("hook", { name, payload, reflexOrigin: "LayerScanner" });
}

export async function layerMap(mapName) {
  logLayer("LAYER_MAP", { mapName });
  return await route("map", { mapName, reflexOrigin: "LayerScanner" });
}

export async function layerHelper(helperName, payload = {}) {
  logLayer("LAYER_HELPER", { helperName });
  return await route("helper", { helperName, payload, reflexOrigin: "LayerScanner" });
}


// ============================================================================
// MID‑LAYER ERROR INTERCEPTOR (A2 → A3)
// ============================================================================
let layerHealing = false;

window.addEventListener(
  "error",
  async (event) => {
    // Prevent double‑healing
    if (layerHealing) return;

    const msg = event.message || "";
    const stack = event.error?.stack || "";

    // Only intercept errors that originate from the LAYER
    // (PageScanner already handles page-level errors)
    if (!stack.includes("/Layer/") && !stack.includes("layer")) {
      return; // Not our layer — let PageScanner or MeshScanner handle it
    }

    logLayer("LAYER_ERROR_INTERCEPTED", { message: msg });

    // ------------------------------------------------------------------------
    // MID‑LAYER CLASSIFICATION (router-style guards)
// ------------------------------------------------------------------------

    // 1) Import drift / module conflict
    if (msg.includes("Cannot find module") || msg.includes("already been declared")) {
      logLayer("LAYER_IMPORT_CONFLICT", {
        error: "layerImportConflict",
        details: msg
      });
      return;
    }

    // 2) Env mismatch
    if (msg.includes("process is not defined")) {
      logLayer("LAYER_ENV_MISMATCH", {
        error: "layerEnvMismatch",
        hint: "Replace process.env.* with window.PULSE_*"
      });
      return;
    }

    // 3) Recursion / thrash at mid-layer
    if (msg.includes("Maximum call stack size exceeded")) {
      logLayer("LAYER_RECURSION_LOOP", {
        error: "layerRecursionLoop",
        details: msg
      });
      return;
    }

    // ------------------------------------------------------------------------
    // STACK + ROUTE TRACE
    // ------------------------------------------------------------------------
    const frames = stack.split("\n").map((s) => s.trim());
    const rawFrames = frames
      .filter((f) => f.includes(".js"))
      .map((f) => f.replace(/^at\s+/, ""));

    let routeTrace = LayerRouteMemory.recall(msg, rawFrames);

    if (!routeTrace) {
      routeTrace = rawFrames.map((frame, index) => {
        const file = frame.split("/").pop().split(":")[0];

        return {
          frame,
          file,
          index,
          label: "LAYER_FRAME",
          layer: "A2",
          purpose: "Mid-layer observed frame",
          context: "LayerScanner dynamic trace"
        };
      });

      LayerRouteMemory.remember(msg, rawFrames, routeTrace);
    }

    // ------------------------------------------------------------------------
    // HEALING LOGIC (same as PageScanner, but tagged A2)
// ------------------------------------------------------------------------
    const parsed = parseMissingField(msg);
    if (!parsed) {
      logLayer("NO_MISSING_FIELD", {});
      return;
    }

    const { table, field } = parsed;

    logLayer("LAYER_HEALING_TRIGGERED", { table, field });

    layerHealing = true;

    try {
      // ⭐ SEND REFLEX TO ROUTER (nervous system) ⭐
      Router.receiveReflex({
        reflexOrigin: "LayerScanner",
        layer: "A2",
        message: msg,
        routeTrace,
        table,
        field
      });

      // ⭐ THEN INVOKE HEALING VIA ROUTER ⭐
      await route("fetchField", {
        table,
        field,
        message: msg,
        reflexOrigin: "LayerScanner",
        layer: "A2",
        routeTrace
      });

      logLayer("LAYER_HEALING_SUCCESS", { table, field });
    } catch (err) {
      logLayer("LAYER_HEALING_FAILED", { error: String(err) });
      error("[LayerScanner] Router fetch failed:", err);
    }

    layerHealing = false;

    event.preventDefault();
  },
  true
);


// ============================================================================
// PARSER (same as PageScanner)
// ============================================================================
function parseMissingField(message) {
  logLayer("PARSER_INVOKED", {});

  let match = message.match(/reading '([^']+)'/);
  if (match) return { table: "Users", field: match[1] };

  match = message.match(/([^ ]+) is not defined/);
  if (match) return { table: "Users", field: match[1] };

  match = message.match(/property '([^']+)'/);
  if (match) return { table: "Users", field: match[1] };

  return null;
}

// ============================================================================
// END OF FILE — THE TISSUE REFLEX / MID‑LAYER SENTINEL  [v1.1]
// ============================================================================
