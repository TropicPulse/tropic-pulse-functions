// ============================================================================
// FILE: /apps/lib/Connectors/MeshScanner.js
// PULSE MESH‑LEVEL REFLEX — v1.1
// “THE ORGAN REFLEX / GLOBAL SENTINEL”
// ============================================================================
//
// ROLE — “THE ORGAN‑LEVEL PROTECTOR”
//   • Intercepts JS errors originating from the Mesh (A3 layer)
//   • Catches mesh-level import drift, recursion, env mismatches
//   • Builds dynamic route traces (same as Page/Layer scanners)
//   • Forwards lineage + context to Router for healing
//   • Prevents mesh-level failures from destabilizing the organism
//
// BIOLOGICAL ANALOGY:
//   • PageScanner  = skin reflex
//   • LayerScanner = tissue reflex
//   • MeshScanner  = organ reflex
//
// ============================================================================


// ============================================================================
// LAYER CONSTANTS + DIAGNOSTICS
// ============================================================================
const LAYER_ID = "MESH-REFLEX";
const LAYER_NAME = "THE ORGAN REFLEX";
const LAYER_ROLE = "MESH ERROR GUARDIAN & HEALING TRIGGER";

const MESH_DIAGNOSTICS_ENABLED =
  window.PULSE_MESH_DIAGNOSTICS === "true" ||
  window.PULSE_DIAGNOSTICS === "true";

const logMesh = (stage, details = {}) => {
  if (!MESH_DIAGNOSTICS_ENABLED) return;

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
// ROUTE MEMORY (same pattern as Page/Layer — living map)
// ============================================================================
const MeshRouteMemory = {
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

    logMesh("ROUTE_MEMORY_SAVED", {
      key,
      frames: frames.length
    });
  },

  recall(message, frames) {
    const key = this.makeKey(message, frames);
    const entry = this.store[key];

    if (!entry) return null;

    logMesh("ROUTE_MEMORY_HIT", {
      key,
      frames: entry.frames.length
    });

    return entry.routeTrace;
  }
};


// ============================================================================
// PUBLIC API (C‑LAYER passthrough — identical pattern)
// ============================================================================
import { route, Router } from "./router.js";

export async function meshAuth(jwtToken) {
  logMesh("MESH_AUTH", {});
  return await route("auth", { jwtToken, reflexOrigin: "MeshScanner" });
}

export async function meshHook(name, payload = {}) {
  logMesh("MESH_HOOK", { name });
  return await route("hook", { name, payload, reflexOrigin: "MeshScanner" });
}

export async function meshMap(mapName) {
  logMesh("MESH_MAP", { mapName });
  return await route("map", { mapName, reflexOrigin: "MeshScanner" });
}

export async function meshHelper(helperName, payload = {}) {
  logMesh("MESH_HELPER", { helperName });
  return await route("helper", { helperName, payload, reflexOrigin: "MeshScanner" });
}


// ============================================================================
// MESH‑LEVEL ERROR INTERCEPTOR (A3 → Immune System)
// ============================================================================
let meshHealing = false;

window.addEventListener(
  "error",
  async (event) => {
    if (meshHealing) return;

    const msg = event.message || "";
    const stack = event.error?.stack || "";

    // Only intercept errors that originate from the MESH
    // (PageScanner handles A1, LayerScanner handles A2)
    if (
      !stack.includes("/Mesh/") &&
      !stack.includes("PulseMesh") &&
      !stack.includes("routeImpulse")
    ) {
      return; // Not our layer — let other scanners handle it
    }

    logMesh("MESH_ERROR_INTERCEPTED", { message: msg });

    // ------------------------------------------------------------------------
    // MESH‑LEVEL CLASSIFICATION
    // ------------------------------------------------------------------------

    // 1) Import drift / module conflict
    if (msg.includes("Cannot find module") || msg.includes("already been declared")) {
      logMesh("MESH_IMPORT_CONFLICT", {
        error: "meshImportConflict",
        details: msg
      });
      return;
    }

    // 2) Env mismatch
    if (msg.includes("process is not defined")) {
      logMesh("MESH_ENV_MISMATCH", {
        error: "meshEnvMismatch",
        hint: "Replace process.env.* with window.PULSE_*"
      });
      return;
    }

    // 3) Recursion / thrash at mesh-level
    if (msg.includes("Maximum call stack size exceeded")) {
      logMesh("MESH_RECURSION_LOOP", {
        error: "meshRecursionLoop",
        details: msg
      });
      return;
    }

    // 4) Routing stall / mesh-level drift
    if (msg.includes("neighbors") || msg.includes("routing stalled")) {
      logMesh("MESH_ROUTING_DRIFT", {
        error: "meshRoutingDrift",
        details: msg
      });
      // Still continue to healing logic
    }

    // ------------------------------------------------------------------------
    // STACK + ROUTE TRACE
    // ------------------------------------------------------------------------
    const frames = stack.split("\n").map((s) => s.trim());
    const rawFrames = frames
      .filter((f) => f.includes(".js"))
      .map((f) => f.replace(/^at\s+/, ""));

    let routeTrace = MeshRouteMemory.recall(msg, rawFrames);

    if (!routeTrace) {
      routeTrace = rawFrames.map((frame, index) => {
        const file = frame.split("/").pop().split(":")[0];

        return {
          frame,
          file,
          index,
          label: "MESH_FRAME",
          layer: "A3",
          purpose: "Mesh-level observed frame",
          context: "MeshScanner dynamic trace"
        };
      });

      MeshRouteMemory.remember(msg, rawFrames, routeTrace);
    }

    // ------------------------------------------------------------------------
    // HEALING LOGIC (same as Page/Layer, but tagged A3)
// ------------------------------------------------------------------------
    const parsed = parseMissingField(msg);
    if (!parsed) {
      logMesh("NO_MISSING_FIELD", {});
      return;
    }

    const { table, field } = parsed;

    logMesh("MESH_HEALING_TRIGGERED", { table, field });

    meshHealing = true;

    try {
      // ⭐ SEND REFLEX TO ROUTER (nervous system) ⭐
      Router.receiveReflex({
        reflexOrigin: "MeshScanner",
        layer: "A3",
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
        reflexOrigin: "MeshScanner",
        layer: "A3",
        routeTrace
      });

      logMesh("MESH_HEALING_SUCCESS", { table, field });
    } catch (err) {
      logMesh("MESH_HEALING_FAILED", { error: String(err) });
      error("[MeshScanner] Router fetch failed:", err);
    }

    meshHealing = false;

    event.preventDefault();
  },
  true
);


// ============================================================================
// PARSER (same as Page/Layer)
// ============================================================================
function parseMissingField(message) {
  logMesh("PARSER_INVOKED", {});

  let match = message.match(/reading '([^']+)'/);
  if (match) return { table: "Users", field: match[1] };

  match = message.match(/([^ ]+) is not defined/);
  if (match) return { table: "Users", field: match[1] };

  match = message.match(/property '([^']+)'/);
  if (match) return { table: "Users", field: match[1] };

  return null;
}

// ============================================================================
// END OF FILE — THE ORGAN REFLEX / GLOBAL SENTINEL  [v1.1]
// ============================================================================
