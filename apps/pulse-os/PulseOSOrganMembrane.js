// ============================================================================
// FILE: /apps/PulseOS/Organs/Barriers/PulseOSOrganMembrane.js
// PULSE OS — v9.2
// “THE ORGAN MEMBRANE / A3 EPITHELIAL REFLEX”
// GLOBAL SENTINEL • ORGAN-LEVEL PROTECTOR • ZERO TIMING • ZERO STATE
// ============================================================================
//
// ORGAN IDENTITY (v9.2):
//   • Organ Type: Barrier / Reflex Membrane
//   • Layer: A3 (Organ-Level Reflex)
//   • Biological Analog: Organ epithelial membrane (deep protective layer)
//   • System Role: Intercept mesh-level structural failures before they reach CNS
//
// PURPOSE:
//   ✔ Catch mesh-level JS errors (A3 reflex)
//   ✔ Detect import drift, recursion, env mismatches
//   ✔ Build dynamic route traces (same as A1/A2 membranes)
//   ✔ Forward lineage + context to Router (nervous system)
//   ✔ Prevent mesh-level failures from destabilizing the organism
//   ✔ Trigger healing via Router
//
// SAFETY CONTRACT (v9.2):
//   • Never run timers, loops, or scheduling
//   • Never store state (except ephemeral route memory)
//   • Never mutate payloads
//   • Never block CNS or Mesh
//   • Always forward reflexes to Router (nervous system)
//   • Always classify errors before healing
// ============================================================================

// ============================================================================
// LAYER CONSTANTS + DIAGNOSTICS
// ============================================================================
const LAYER_ID   = "MESH-REFLEX";
const LAYER_NAME = "THE ORGAN MEMBRANE";
const LAYER_ROLE = "MESH ERROR GUARDIAN & HEALING TRIGGER";
const LAYER_VER  = "9.2";

const MESH_DIAGNOSTICS_ENABLED =
  window.PULSE_MESH_DIAGNOSTICS === "true" ||
  window.PULSE_DIAGNOSTICS === "true";

const logMesh = (stage, details = {}) => {
  if (!MESH_DIAGNOSTICS_ENABLED) return;

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
// ROUTE MEMORY (living map — same pattern as A1/A2 membranes)
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
// PUBLIC API (C-LAYER passthrough — identical pattern)
// ============================================================================
import { route, Router } from "./PulseOSCNSNervousSystem.js";

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
// MESH-LEVEL ERROR INTERCEPTOR (A3 → Immune System / CNS)
// ============================================================================
let meshHealing = false;

window.addEventListener(
  "error",
  async (event) => {
    if (meshHealing) return;

    const msg   = event.message || "";
    const stack = event.error?.stack || "";

    // Only intercept errors that originate from the MESH
    if (
      !stack.includes("/Mesh/") &&
      !stack.includes("PulseMesh") &&
      !stack.includes("routeImpulse")
    ) {
      return;
    }

    logMesh("MESH_ERROR_INTERCEPTED", { message: msg });

    // ------------------------------------------------------------------------
    // MESH-LEVEL CLASSIFICATION
    // ------------------------------------------------------------------------
    if (msg.includes("Cannot find module") || msg.includes("already been declared")) {
      logMesh("MESH_IMPORT_CONFLICT", {
        error: "meshImportConflict",
        details: msg
      });
      return;
    }

    if (msg.includes("process is not defined")) {
      logMesh("MESH_ENV_MISMATCH", {
        error: "meshEnvMismatch",
        hint: "Replace process.env.* with window.PULSE_*"
      });
      return;
    }

    if (msg.includes("Maximum call stack size exceeded")) {
      logMesh("MESH_RECURSION_LOOP", {
        error: "meshRecursionLoop",
        details: msg
      });
      return;
    }

    if (msg.includes("neighbors") || msg.includes("routing stalled")) {
      logMesh("MESH_ROUTING_DRIFT", {
        error: "meshRoutingDrift",
        details: msg
      });
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
    // HEALING LOGIC (A3 reflex → Router)
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
      Router.receiveReflex({
        reflexOrigin: "MeshScanner",
        layer: "A3",
        message: msg,
        routeTrace,
        table,
        field
      });

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
// END OF FILE — THE ORGAN MEMBRANE / A3 EPITHELIAL REFLEX  [v9.2]
// ============================================================================
