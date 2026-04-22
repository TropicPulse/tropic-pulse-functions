// ============================================================================
// FILE: /apps/PulseOS/Organs/Barriers/PulseOSTissueMembrane.js
// PULSE OS — v10.1
// “THE TISSUE MEMBRANE / MID‑LAYER EPITHELIAL REFLEX”
// A2 REFLEX LAYER • MID‑LAYER SENTINEL • ZERO TIMING • ZERO STATE
// ============================================================================
//
// ORGAN IDENTITY (v10.1):
//   • Organ Type: Barrier / Reflex Membrane
//   • Layer: A2 (Mid‑Layer Reflex)
//   • Biological Analog: Tissue membrane between skin + organs
//   • System Role: Intercept mid‑layer structural failures before they reach Mesh
//
// PURPOSE (v10.1):
//   ✔ Catch mid‑layer JS errors (A1 → A2 → A3 chain)
//   ✔ Detect import drift, recursion, env mismatches
//   ✔ Build dynamic route traces (living map, not config)
//   ✔ Track route degradation (healthScore + tier + degraded flag)
//   ✔ Tag route DNA at A2 (A2_TISSUE / A2_TISSUE_DEGRADED)
//   ✔ Forward lineage + context + degradation to Router v10.1
//   ✔ Prevent mid‑layer failures from reaching Mesh (organ layer)
//   ✔ Trigger healing via Router without blocking forward progress
//
// WHAT THIS ORGAN IS:
//   ✔ A tissue‑level epithelial membrane
//   ✔ A mid‑layer reflex interceptor
//   ✔ A structural integrity sentinel
//   ✔ A healing trigger for A2‑level failures
//   ✔ A DNA annotator for Router v10.1
//
// WHAT THIS ORGAN IS NOT:
//   ✘ NOT a connector
//   ✘ NOT a helper
//   ✘ NOT a router
//   ✘ NOT a backend logic layer
//   ✘ NOT a state machine
//   ✘ NOT a timing system
//
// SAFETY CONTRACT (v10.1):
//   • Never run timers, loops, or scheduling
//   • Never store state (except ephemeral route memory)
//   • Never mutate payloads
//   • Never block Mesh or Cortex
//   • Always forward reflexes to Router (nervous system)
//   • Always classify errors before healing
//   • Never stop routing: mark degraded, route around, move forward
// ============================================================================


// ============================================================================
// LAYER CONSTANTS + DIAGNOSTICS
// ============================================================================
import { PulseOrganismMap } from "/apps/PulseOS/PulseBrainMap.js";
PulseOSBrain.PulseOrganismMap = PulseOrganismMap;

const LAYER_ID   = "LAYER-REFLEX";
const LAYER_NAME = "THE TISSUE MEMBRANE";
const LAYER_ROLE = "MID-LAYER ERROR GUARDIAN & HEALING TRIGGER";
const LAYER_VER  = "10.1";

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
// ROUTE MEMORY — NOW WITH DEGRADATION TIERS + DNA TAGGING
// ============================================================================
const LayerRouteMemory = {
  store: {},

  makeKey(message, frames) {
    const top = frames[0] || "NO_FRAME";
    return message + "::" + top;
  },

  classifyTier(healthScore) {
    const h = typeof healthScore === "number" ? healthScore : 1.0;

    if (h >= 0.95) return "microDegrade";
    if (h >= 0.85) return "softDegrade";
    if (h >= 0.50) return "midDegrade";
    if (h >= 0.15) return "hardDegrade";
    return "criticalDegrade";
  },

  remember(message, frames, routeTrace, overrides = {}) {
    const key = this.makeKey(message, frames);
    const baseHealth = overrides.healthScore ?? 1.0;
    const tier = this.classifyTier(baseHealth);

    this.store[key] = {
      ts: Date.now(),
      message,
      frames,
      routeTrace,
      degraded: !!overrides.degraded,
      healthScore: baseHealth,
      tier,
      dnaTag: "A2_TISSUE",
      ...overrides
    };

    logLayer("ROUTE_MEMORY_SAVED", {
      key,
      frames: frames.length,
      degraded: this.store[key].degraded,
      healthScore: this.store[key].healthScore,
      tier: this.store[key].tier,
      dnaTag: this.store[key].dnaTag
    });
  },

  markDegraded(message, frames, healthScore = 0.85) {
    const key = this.makeKey(message, frames);
    const entry = this.store[key];
    if (!entry) return;

    entry.degraded = true;
    entry.healthScore = healthScore;
    entry.tier = this.classifyTier(healthScore);
    entry.dnaTag = "A2_TISSUE_DEGRADED";

    logLayer("ROUTE_MEMORY_DEGRADED", {
      key,
      healthScore,
      tier: entry.tier,
      dnaTag: entry.dnaTag
    });
  },

  recall(message, frames) {
    const key = this.makeKey(message, frames);
    const entry = this.store[key];
    if (!entry) return null;

    logLayer("ROUTE_MEMORY_HIT", {
      key,
      frames: entry.frames.length,
      degraded: entry.degraded,
      healthScore: entry.healthScore,
      tier: entry.tier,
      dnaTag: entry.dnaTag
    });

    return entry.routeTrace;
  },

  getEntry(message, frames) {
    const key = this.makeKey(message, frames);
    return this.store[key] || null;
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
    if (!stack.includes("/Layer/") && !stack.toLowerCase().includes("layer")) {
      return;
    }

    logLayer("LAYER_ERROR_INTERCEPTED", { message: msg });

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
    // MID‑LAYER CLASSIFICATION → MARK DEGRADATION, NEVER BLOCK
    // ------------------------------------------------------------------------
    if (msg.includes("Cannot find module") || msg.includes("already been declared")) {
      logLayer("LAYER_IMPORT_CONFLICT", {
        error: "layerImportConflict",
        details: msg
      });

      LayerRouteMemory.markDegraded(msg, rawFrames, 0.85);
    }

    if (msg.includes("process is not defined")) {
      logLayer("LAYER_ENV_MISMATCH", {
        error: "layerEnvMismatch",
        hint: "Replace process.env.* with window.PULSE_*"
      });

      LayerRouteMemory.markDegraded(msg, rawFrames, 0.7);
    }

    if (msg.includes("Maximum call stack size exceeded")) {
      logLayer("LAYER_RECURSION_LOOP", {
        error: "layerRecursionLoop",
        details: msg
      });

      LayerRouteMemory.markDegraded(msg, rawFrames, 0.5);
    }

    const memoryEntry = LayerRouteMemory.getEntry(msg, rawFrames);
    const degraded = memoryEntry?.degraded || false;
    const healthScore = memoryEntry?.healthScore ?? 1.0;
    const tier = memoryEntry?.tier || "microDegrade";
    const dnaTag = memoryEntry?.dnaTag || "A2_TISSUE";

    // ------------------------------------------------------------------------
    // HEALING LOGIC (A2 reflex → Router)
// ------------------------------------------------------------------------
    const parsed = parseMissingField(msg);
    if (!parsed) {
      logLayer("NO_MISSING_FIELD", {
        degraded,
        healthScore,
        tier,
        dnaTag
      });
      event.preventDefault();
      return;
    }

    const { table, field } = parsed;

    logLayer("LAYER_HEALING_TRIGGERED", {
      table,
      field,
      degraded,
      healthScore,
      tier,
      dnaTag
    });

    layerHealing = true;

    try {
      Router.receiveReflex({
        reflexOrigin: "LayerScanner",
        layer: "A2",
        message: msg,
        routeTrace,
        table,
        field,
        degraded,
        healthScore,
        tier,
        dnaTag
      });

      await route("fetchField", {
        table,
        field,
        message: msg,
        reflexOrigin: "LayerScanner",
        layer: "A2",
        routeTrace,
        degraded,
        healthScore,
        tier,
        dnaTag
      });

      logLayer("LAYER_HEALING_SUCCESS", {
        table,
        field,
        degraded,
        healthScore,
        tier,
        dnaTag
      });
    } catch (err) {
      logLayer("LAYER_HEALING_FAILED", {
        error: String(err),
        degraded,
        healthScore,
        tier,
        dnaTag
      });
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
// END OF FILE — THE TISSUE MEMBRANE / MID‑LAYER EPITHELIAL REFLEX  [v10.1]
// ============================================================================
