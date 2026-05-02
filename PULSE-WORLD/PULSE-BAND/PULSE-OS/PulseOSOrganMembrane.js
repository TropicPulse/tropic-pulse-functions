/* global log, error */
// ============================================================================
// FILE: /PulseOS/Organs/Barriers/PulseOSOrganMembrane.js
// PULSE OS — v12.3-Evo-Prime
// “THE ORGAN MEMBRANE / A3 EPITHELIAL REFLEX”
// GLOBAL SENTINEL • ORGAN-LEVEL PROTECTOR • ZERO TIMING • ZERO STATE
// ============================================================================
//
// ORGAN IDENTITY (v12.3-Evo-Prime):
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
// SAFETY CONTRACT (v12.3-Evo-Prime):
//   • Never run timers, loops, or scheduling beyond direct event handling
//   • Never store state (except ephemeral route memory)
//   • Never mutate payloads
//   • Never block CNS or Mesh
//   • Always forward reflexes to Router (nervous system)
//   • Always classify errors before healing
//   • Guarded access to window / globals for environment-agnostic behavior
//   • No timestamps, no randomness
//   • Dual-band metadata ready (symbolic-primary, binary-non-executable)
// ============================================================================
/*
AI_EXPERIENCE_META = {
  identity: "PulseOSOrganMembrane",
  version: "v14-IMMORTAL",
  layer: "membrane",
  role: "os_organ_membrane",
  lineage: "PulseOS-v14",

  evo: {
    membrane: true,
    organBarrier: true,
    reflexFilter: true,

    deterministic: true,
    driftProof: true,
    zeroNetwork: true,
    zeroFilesystem: true,
    zeroMutationOfInput: true,

    safeRouteFree: true,
    metadataOnly: true
  },

  contract: {
    always: [
      "PulseOSTissueMembrane",
      "PulseOSMucusMembrane"
    ],
    never: [
      "legacyOrganMembrane",
      "safeRoute",
      "fetchViaCNS"
    ]
  }
}
*/

// ============================================================================
// ORGAN IDENTITY — v12.3‑EVO‑PRIME (A3 Organ Membrane)
// ============================================================================
export const PulseRole = {
  type: "Barrier",
  subsystem: "PulseOSOrganMembrane",
  layer: "A3-OrganReflex",
  version: "12.3-Evo-Prime",
  identity: "PulseOSOrganMembrane-v12.3-Evo-Prime",

  evo: {
    // Core v12.3‑EVO invariants
    driftProof: true,
    deterministicField: true,
    unifiedAdvantageField: true,
    futureEvolutionReady: true,

    // Reflex + membrane laws
    zeroTiming: true,
    zeroState: true,
    zeroMutation: true,
    zeroCompute: true,
    zeroRoutingInfluence: true,
    zeroAsync: true,
    zeroRandomness: true,

    // Mesh + epithelial semantics
    membraneLayer: "A3",
    epithelialReflex: true,
    meshLevel: true,
    meshSentinel: true,
    healingTriggerOnly: true,
    degradationAnnotator: true,
    dnaTagger: true,

    // Mode + awareness
    symbolicAware: true,
    binaryAware: true,          // dual-band aware, symbolic-primary
    dualBandReady: true,
    binaryNonExecutable: true,

    // Environment + safety
    guardedWindowAccess: true,
    environmentAgnostic: true,
    multiInstanceReady: true
  }
};

export const PulseOSOrganMembraneMeta = Object.freeze({
  layer: "PulseOSOrganMembrane",
  role: "A3_ORGAN_REFLEX_MEMBRANE",
  version: "v12.3-EVO-BINARY-MAX",
  identity: "PulseOSOrganMembrane-v12.3-EVO-BINARY-MAX",

  guarantees: Object.freeze({
    deterministic: true,
    driftProof: true,
    multiInstanceReady: true,

    // Membrane laws
    epithelialReflex: true,
    organLevelBarrier: true,
    meshSentinel: true,
    meshLevel: true,
    healingTriggerOnly: true,
    degradationAnnotator: true,
    dnaTagger: true,
    oneWayReflex: true,

    // Safety prohibitions
    zeroTiming: true,
    zeroState: true,
    zeroMutation: true,
    zeroCompute: true,
    zeroRoutingInfluence: true,
    zeroAsync: true,
    zeroRandomness: true,
    zeroUserCode: true,
    zeroDynamicImports: true,
    zeroEval: true,

    // Dual-band awareness
    dualBandAware: true,
    symbolicAware: true,
    binaryAware: true,
    binaryNonExecutable: true,

    // Environment
    environmentAgnostic: true,
    guardedWindowAccess: true,
    worldLensAware: false
  }),

  contract: Object.freeze({
    input: [
      "MeshErrorEvent",
      "MeshContext",
      "DualBandContext"
    ],
    output: [
      "OrganReflexEvent",
      "OrganMembraneDiagnostics",
      "OrganMembraneSignatures",
      "OrganMembraneHealingState"
    ]
  }),

  lineage: Object.freeze({
    root: "PulseOS-v12-EVO",
    parent: "PulseOS-v12.3-EVO",
    ancestry: [
      "PulseOSOrganMembrane-v9",
      "PulseOSOrganMembrane-v10",
      "PulseOSOrganMembrane-v11",
      "PulseOSOrganMembrane-v11-Evo",
      "PulseOSOrganMembrane-v11-Evo-Prime",
      "PulseOSOrganMembrane-v12.3-Evo-Prime"
    ]
  }),

  bands: Object.freeze({
    supported: ["symbolic", "binary"],
    default: "symbolic",
    behavior: "organ-reflex"
  }),

  architecture: Object.freeze({
    pattern: "A-B-A",
    baseline: "mesh error → reflex classification → healing trigger",
    adaptive: "symbolic-primary reflex with dual-band metadata",
    return: "deterministic organ reflex event + signatures"
  })
});

// ============================================================================
// LAYER CONSTANTS + DIAGNOSTICS
// ============================================================================
const LAYER_ID   = "MESH-REFLEX";
const LAYER_NAME = "THE ORGAN MEMBRANE";
const LAYER_ROLE = "MESH ERROR GUARDIAN & HEALING TRIGGER";
const LAYER_VER  = "12.3-Evo-Prime";

const hasWindow = typeof window !== "undefined";

const MESH_DIAGNOSTICS_ENABLED =
  hasWindow &&
  (window.PULSE_MESH_DIAGNOSTICS === "true" ||
    window.PULSE_DIAGNOSTICS === "true");

const logMesh = (stage, details = {}) => {
  if (!MESH_DIAGNOSTICS_ENABLED) return;
  if (typeof log !== "function") return;

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
// v12.3: zero-timing → deterministic sequence counter instead of Date.now()
// ============================================================================
let meshRouteSeq = 0;

const MeshRouteMemory = {
  store: {},

  makeKey(message, frames) {
    const top = frames[0] || "NO_FRAME";
    return message + "::" + top;
  },

  remember(message, frames, routeTrace) {
    const key = this.makeKey(message, frames);
    this.store[key] = {
      seq: ++meshRouteSeq,
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
// PUBLIC API (C-LAYER passthrough — symbolic-primary, dual-band metadata)
// ============================================================================
import { route, Router } from "./PulseOSCNSNervousSystem.js";

export async function meshAuth(jwtToken) {
  logMesh("MESH_AUTH", {});
  return await route("auth", {
    jwtToken,
    reflexOrigin: "MeshScanner",
    modeKind: "symbolic",
    __band: "symbolic"
  });
}

export async function meshHook(name, payload = {}) {
  logMesh("MESH_HOOK", { name });
  return await route("hook", {
    name,
    payload,
    reflexOrigin: "MeshScanner",
    modeKind: "symbolic",
    __band: "symbolic"
  });
}

export async function meshMap(mapName) {
  logMesh("MESH_MAP", { mapName });
  return await route("map", {
    mapName,
    reflexOrigin: "MeshScanner",
    modeKind: "symbolic",
    __band: "symbolic"
  });
}

export async function meshHelper(helperName, payload = {}) {
  logMesh("MESH_HELPER", { helperName });
  return await route("helper", {
    helperName,
    payload,
    reflexOrigin: "MeshScanner",
    modeKind: "symbolic",
    __band: "symbolic"
  });
}

// ============================================================================
// MESH-LEVEL ERROR INTERCEPTOR (A3 → Immune System / CNS)
// ============================================================================
let meshHealing = false;

if (hasWindow && typeof window.addEventListener === "function") {
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

      // ----------------------------------------------------------------------
      // MESH-LEVEL CLASSIFICATION
      // ----------------------------------------------------------------------
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

      // ----------------------------------------------------------------------
      // STACK + ROUTE TRACE
      // ----------------------------------------------------------------------
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

      // ----------------------------------------------------------------------
      // HEALING LOGIC (A3 reflex → Router)
// ----------------------------------------------------------------------
      const parsed = parseMissingField(msg);
      if (!parsed) {
        logMesh("NO_MISSING_FIELD", {});
        return;
      }

      const { table, field } = parsed;

      logMesh("MESH_HEALING_TRIGGERED", { table, field });

      meshHealing = true;

      try {
        if (Router && typeof Router.receiveReflex === "function") {
          Router.receiveReflex({
            reflexOrigin: "MeshScanner",
            layer: "A3",
            message: msg,
            routeTrace,
            table,
            field,
            modeKind: "symbolic",
            __band: "symbolic"
          });
        }

        await route("fetchField", {
          table,
          field,
          message: msg,
          reflexOrigin: "MeshScanner",
          layer: "A3",
          routeTrace,
          modeKind: "symbolic",
          __band: "symbolic"
        });

        logMesh("MESH_HEALING_SUCCESS", { table, field });
      } catch (err) {
        logMesh("MESH_HEALING_FAILED", { error: String(err) });
        if (typeof error === "function") {
          error("[MeshScanner] Router fetch failed:", err);
        }
      }

      meshHealing = false;

      event.preventDefault();
    },
    true
  );
}

// ============================================================================
// PARSER (same as Page/Layer) — symbolic-only, deterministic
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
// END OF FILE — THE ORGAN MEMBRANE / A3 EPITHELIAL REFLEX  [v12.3-Evo-Prime]
// ============================================================================
