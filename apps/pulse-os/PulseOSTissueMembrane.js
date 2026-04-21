// ============================================================================
// FILE: /apps/PulseOS/Organs/Barriers/PulseOSTissueMembrane.js
// PULSE OS — v9.2
// “THE TISSUE MEMBRANE / MID‑LAYER EPITHELIAL REFLEX”
// A2 REFLEX LAYER • MID‑LAYER SENTINEL • ZERO TIMING • ZERO STATE
// ============================================================================
//
// ORGAN IDENTITY (v9.2):
//   • Organ Type: Barrier / Reflex Membrane
//   • Layer: A2 (Mid‑Layer Reflex)
//   • Biological Analog: Tissue membrane between skin + organs
//   • System Role: Intercept mid‑layer structural failures before they reach Mesh
//
// PURPOSE:
//   ✔ Catch mid‑layer JS errors (A → A2 → A3 chain)
//   ✔ Detect import drift, recursion, env mismatches
//   ✔ Build dynamic route traces (same as PageScanner)
//   ✔ Forward lineage + context to Router (nervous system)
//   ✔ Prevent mid‑layer failures from reaching Mesh (organ layer)
//   ✔ Trigger healing via Router
//
// WHAT THIS ORGAN IS:
//   ✔ A tissue‑level epithelial membrane
//   ✔ A mid‑layer reflex interceptor
//   ✔ A structural integrity sentinel
//   ✔ A healing trigger for A2‑level failures
//
// WHAT THIS ORGAN IS NOT:
//   ✘ NOT a connector
//   ✘ NOT a helper
//   ✘ NOT a router
//   ✘ NOT a backend logic layer
//   ✘ NOT a state machine
//   ✘ NOT a timing system
//
// SAFETY CONTRACT (v9.2):
//   • Never run timers, loops, or scheduling
//   • Never store state (except ephemeral route memory)
//   • Never mutate payloads
//   • Never block Mesh or Cortex
//   • Always forward reflexes to Router (nervous system)
//   • Always classify errors before healing
// ============================================================================


// ============================================================================
// LAYER CONSTANTS + DIAGNOSTICS
// ============================================================================
const LAYER_ID   = "LAYER-REFLEX";
const LAYER_NAME = "THE TISSUE MEMBRANE";
const LAYER_ROLE = "MID-LAYER ERROR GUARDIAN & HEALING TRIGGER";
const LAYER_VER  = "9.2";

const LAYER_DIAGNOSTICS_ENABLED =
  window.PULSE_LAYER_DIAGNOSTICS === "true" ||
  window.PULSE_DIAGNOSTICS === "true";

const logLayer = (stage, details = {}) => {
  if (!LAYER_DIAGNOSTICS_ENABLED) return;

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
// ROUTE MEMORY (living map — same as PageScanner)
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
// PUBLIC API (C‑LAYER passthrough — identical pattern)
// ============================================================================
import { route, Router } from "./PulseOSCNSNervousSystem.js";

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
    if (layerHealing) return;

    const msg = event.message || "";
    const stack = event.error?.stack || "";

    // Only intercept errors originating from the mid‑layer
    if (!stack.includes("/Layer/") && !stack.includes("layer")) {
      return;
    }

    logLayer("LAYER_ERROR_INTERCEPTED", { message: msg });

    // ------------------------------------------------------------------------
    // MID‑LAYER CLASSIFICATION
    // ------------------------------------------------------------------------
    if (msg.includes("Cannot find module") || msg.includes("already been declared")) {
      logLayer("LAYER_IMPORT_CONFLICT", {
        error: "layerImportConflict",
        details: msg
      });
      return;
    }

    if (msg.includes("process is not defined")) {
      logLayer("LAYER_ENV_MISMATCH", {
        error: "layerEnvMismatch",
        hint: "Replace process.env.* with window.PULSE_*"
      });
      return;
    }

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
    // HEALING LOGIC (A2 reflex → Router)
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
      Router.receiveReflex({
        reflexOrigin: "LayerScanner",
        layer: "A2",
        message: msg,
        routeTrace,
        table,
        field
      });

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
// END OF FILE — THE TISSUE MEMBRANE / MID‑LAYER EPITHELIAL REFLEX  [v9.2]
// ============================================================================
