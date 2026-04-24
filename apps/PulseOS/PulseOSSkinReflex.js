// ============================================================================
// FILE: /apps/PulseOS/Organs/Skin/PulseOSSkinReflex.js
// PULSE OS — v11‑EVO‑BINARY‑MAX
// “THE SKIN REFLEX / UNIVERSAL SURFACE MEMBRANE / ERROR CATCHER”
// A1 BARRIER • PAGE-LEVEL REFLEX • ZERO TIMING • ZERO STATE • BINARY-AWARE
// ============================================================================
//
// ORGAN IDENTITY (v11‑EVO‑BINARY‑MAX):
//   • Organ Type: Skin / Surface Membrane / Reflex Layer
//   • Layer: A1 (Page-Level Reflex)
//   • Biological Analog: Skin + nociceptors + epithelial membrane
//   • System Role: Universal error intake + binary/text dualband classifier
//
// PURPOSE (v11‑EVO‑BINARY‑MAX):
//   ✔ Intercept ALL JS errors at the page/surface level
//   ✔ Extract stack frames + route context (dualband: text + binary)
//   ✔ Build dynamic route traces (living map, not config)
//   ✔ Mark route degradation (binary-aware tiers)
//   ✔ Tag route DNA (A1_SURFACE / A1_SURFACE_DEGRADED / A1_BINARY_SHADOW*)
//   ✔ Trigger healing deterministically for missing-field patterns
//   ✔ Always forward reflex packets to Router (binary-first nervous system)
//   ✔ Never block the organism; always route forward
//   ✔ ALWAYS EMIT LOCAL DIAGNOSTICS BEFORE ROUTING
//
// WHAT THIS ORGAN IS:
//   ✔ The universal error catcher of PulseOS
//   ✔ The outermost membrane (A1 barrier)
//   ✔ A dualband classifier (binary-aware + text-aware)
//   ✔ A degradation + DNA annotator for Router v11‑EVO
//   ✔ A local diagnostic surface for humans
//
// WHAT THIS ORGAN IS NOT:
//   ✘ NOT a router
//   ✘ NOT a backend logic layer
//   ✘ NOT a state machine
//   ✘ NOT a scheduler or timer
//   ✘ NOT a binary execution organ
//   ✘ NOT an IQ/import organ
//
// SAFETY CONTRACT (v11‑EVO‑BINARY‑MAX):
//   • Zero timers, zero scheduling (only event hooks)
//   • Zero long-lived state (only ephemeral route memory)
//   • Zero mutation of payloads
//   • Always classify before escalating
//   • Always forward healing triggers via Router
//   • Never block CNS, Mesh, or Binary Nervous System
//   • Import errors = degradation, NOT fatal
//   • Errors are signals, not stops — reflex must always continue forward
//   • Guarded access to globals for portability
//   • Binary-aware but NEVER executes binary logic directly
// ============================================================================


// ============================================================================
// ORGAN ROLE EXPORT — v11‑EVO‑BINARY‑MAX
// ============================================================================
export const PulseRole = {
  type: "Skin",
  subsystem: "PulseOSSkinReflex",
  layer: "A1-SurfaceReflex",
  version: "11.0",
  identity: "PulseOSSkinReflex-v11-EVO-BINARY",

  evo: {
    driftProof: true,
    deterministicReflex: true,
    zeroState: true,
    zeroTiming: true,
    surfaceOnly: true,
    classificationFirst: true,
    healingTriggerOnly: true,
    binaryAware: true,          // understands binary arteries
    dualBand: true,             // text + binary treated equally
    futureEvolutionReady: true
  },

  reflex: {
    pageLevel: true,
    errorIntake: true,
    routeSampler: true,
    degradationAnnotator: true,
    binaryShadowTagger: true    // tags binary DNA at surface
  },

  pulseContract: "Pulse-v1/v2/v3",
  meshContract: "PulseMesh-v11-ready",
  sendContract: "PulseSend-v11-ready"
};


// ============================================================================
// OWNER MODULE RESOLUTION — v11‑EVO (Brain-map aware, no mutation)
// ============================================================================
const hasWindow = typeof window !== "undefined";

function getOrganismMapSafe() {
  try {
    if (typeof PulseOSBrain === "object" && PulseOSBrain.PulseOrganismMap) {
      return PulseOSBrain.PulseOrganismMap;
    }
    if (typeof PulseOrganismMap === "object") {
      return PulseOrganismMap;
    }
  } catch {}
  return null;
}

function resolveOwnerModule(symbol) {
  try {
    if (typeof symbol !== "string") return null;

    const organism = getOrganismMapSafe();
    if (!organism || !organism.organs) return null;

    const organ = organism.organs[symbol];
    return organ ? organ.system : null;
  } catch {
    return null;
  }
}

if (typeof console !== "undefined" && typeof console.log === "function") {
  console.log(
    "%c[PulseOSSkinReflex v11‑EVO‑BINARY] Loaded — A1 Universal Membrane Active",
    "color:#4CAF50; font-weight:bold;"
  );
}


// ============================================================================
// LAYER CONSTANTS + DIAGNOSTICS
// ============================================================================
const LAYER_ID   = "SKIN-REFLEX";
const LAYER_NAME = "THE SKIN REFLEX";
const LAYER_ROLE = "UNIVERSAL ERROR GUARDIAN & HEALING TRIGGER";
const LAYER_VER  = "11.0";

const PROTECTOR_DIAGNOSTICS_ENABLED =
  hasWindow &&
  (window.PULSE_PROTECTOR_DIAGNOSTICS === "true" ||
   window.PULSE_DIAGNOSTICS === "true");

// NOTE: log() is provided by ProofLogger / global console redirect on frontend.
const logProtector = (stage, details = {}) => {
  if (!PROTECTOR_DIAGNOSTICS_ENABLED) return;
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
// SENSE REPORT — richer local diagnostics (binary-aware)
// ============================================================================
function emitReflexSenseReport(context = {}) {
  if (typeof console === "undefined" || !console.groupCollapsed) return;

  console.groupCollapsed(
    "%c[SkinReflex SENSE REPORT — v11‑EVO‑BINARY]",
    "color:#FF9800; font-weight:bold;"
  );

  console.log("• layer:", "A1 (Surface Reflex)");
  console.log("• role:", LAYER_ROLE);
  console.log("• version:", LAYER_VER);

  console.log("• message:", context.message || "none");
  console.log("• file:", context.file || "unknown");
  console.log("• line:", context.line || "unknown");
  console.log("• frames:", context.frames ?? 0);

  console.log("• degraded:", context.degraded);
  console.log("• healthScore:", context.healthScore);
  console.log("• tier:", context.tier);
  console.log("• dnaTag:", context.dnaTag);

  console.log("• binaryAware:", context.binaryAware || false);
  console.log("• dualBand:", true);

  console.log("• page:", context.page || "unknown");
  console.log("• reflexSeq:", context.seq || "n/a");

  console.groupEnd();
}


// ============================================================================
// PULSE OS v11 — SKIN REFLEX (A1 → A2 → Router → Backend/Binary Nervous System)
//  • route() is the dualband nervous entry: binary-first, text fallback
// ============================================================================
import { route } from "./PULSE-OS/PulseOSCNSNervousSystem.js";


// ============================================================================
// ROUTE MEMORY — v11‑EVO‑BINARY‑MAX
//  • Stores degradation, tiers, DNA tags
//  • Binary-aware: tags binary-shadow routes
//  • Deterministic sequence counter (no Date.now)
// ============================================================================
let skinSeq = 0;

const RouteMemory = {
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
      seq: ++skinSeq,
      message,
      frames,
      routeTrace,
      degraded: !!overrides.degraded,
      healthScore: baseHealth,
      tier,
      dnaTag: overrides.binaryAware
        ? "A1_BINARY_SHADOW"
        : "A1_SURFACE",
      ...overrides
    };

    logProtector("ROUTE_MEMORY_SAVED", {
      key,
      frames: frames.length,
      degraded: this.store[key].degraded,
      healthScore: this.store[key].healthScore,
      tier: this.store[key].tier,
      dnaTag: this.store[key].dnaTag
    });
  },

  markDegraded(message, frames, healthScore = 0.85, binaryAware = false) {
    const key = this.makeKey(message, frames);
    const entry = this.store[key];
    if (!entry) return;

    entry.degraded = true;
    entry.healthScore = healthScore;
    entry.tier = this.classifyTier(healthScore);
    entry.dnaTag = binaryAware
      ? "A1_BINARY_SHADOW_DEGRADED"
      : "A1_SURFACE_DEGRADED";

    logProtector("ROUTE_MEMORY_DEGRADED", {
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

    logProtector("ROUTE_MEMORY_HIT", {
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
// PUBLIC API (C‑LAYER passthrough — dualband, binary-first nervous entry)
// ============================================================================
export async function getAuth(jwtToken) {
  logProtector("GET_AUTH", {});
  return await route("auth", {
    jwtToken,
    reflexOrigin: "SkinReflex",
    layer: "A1",
    binaryAware: true,
    dualBand: true
  });
}

export async function getHook(name, payload = {}) {
  logProtector("GET_HOOK", { name });
  return await route("hook", {
    name,
    payload,
    reflexOrigin: "SkinReflex",
    layer: "A1",
    binaryAware: true,
    dualBand: true
  });
}

export async function getMap(mapName) {
  logProtector("GET_MAP", { mapName });
  return await route("map", {
    mapName,
    reflexOrigin: "SkinReflex",
    layer: "A1",
    binaryAware: true,
    dualBand: true
  });
}

export async function callHelper(helperName, payload = {}) {
  logProtector("CALL_HELPER", { helperName });
  return await route("helper", {
    helperName,
    payload,
    reflexOrigin: "SkinReflex",
    layer: "A1",
    binaryAware: true,
    dualBand: true
  });
}


// ============================================================================
// A1 ERROR INTERCEPTOR — Dualband error catcher (binary-first, text fallback)
//  • No timers, no intervals, no Date.now
//  • Always emits local diagnostics before routing
// ============================================================================
let healingInProgress = false;

if (hasWindow && typeof window.addEventListener === "function") {
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

      const top = rawFrames[0] || "unknown";
      const file = top.split("/").pop().split(":")[0] || "unknown";
      const line = top.split(":")[1] || "unknown";

      (function emitA1LocalDiagnostics() {
        if (typeof console !== "undefined" && console.groupCollapsed) {
          console.groupCollapsed(
            `%cA1 DIAGNOSTIC — ${msg}`,
            "color:#FF7043; font-weight:bold;"
          );

          console.log("• message:", msg);
          console.log("• file:", file);
          console.log("• line:", line);
          console.log("• top frame:", top);
          console.log("• raw frames:", rawFrames);
          console.log(
            "• page:",
            hasWindow && window.location ? window.location.pathname : "unknown"
          );
          console.log("• layer:", "A1 (SkinReflex)");
          console.log(
            "• note:",
            "LOCAL ONLY — does NOT depend on routing or backend."
          );

          console.groupEnd();
        }
      })();

      let routeTrace = RouteMemory.recall(msg, rawFrames);

      if (!routeTrace) {
        routeTrace = rawFrames.map((frame, index) => {
          const fFile = frame.split("/").pop().split(":")[0];

          return {
            frame,
            file: fFile,
            index,
            label: "A1_FRAME",
            layer: "A1",
            purpose: "Surface observed frame",
            context: "SkinReflex dynamic trace",
            binaryAware: true,
            dualBand: true
          };
        });

        logProtector("ROUTE_TRACE_BUILT_DYNAMIC", {
          frames: routeTrace.length
        });

        RouteMemory.remember(msg, rawFrames, routeTrace, {
          binaryAware: true
        });
      }

      let classified = false;

      // Import errors: degradation, not fatal (binary-first nervous system can heal)
      if (msg.includes("Cannot find module")) {
        logProtector("IMPORT_DEGRADED", {
          note: "Import errors are degradation signals in v11‑EVO‑BINARY",
          details: msg
        });

        RouteMemory.markDegraded(msg, rawFrames, 0.8, true);
        classified = true;
      }

      if (msg.includes("process is not defined")) {
        logProtector("PAGE_ENV_MISMATCH", {
          error: "frontendEnvMismatch",
          hint: "Replace process.env.* with window.PULSE_*"
        });

        RouteMemory.markDegraded(msg, rawFrames, 0.7, false);
        classified = true;
      }

      if (msg.includes("Maximum call stack size exceeded")) {
        logProtector("PAGE_RECURSION_LOOP", {
          error: "pageRecursionLoop",
          details: msg
        });

        RouteMemory.markDegraded(msg, rawFrames, 0.5, false);
        classified = true;
      }

      const memoryEntry = RouteMemory.getEntry(msg, rawFrames);
      const degraded = memoryEntry?.degraded || false;
      const healthScore = memoryEntry?.healthScore ?? 1.0;
      const tier = memoryEntry?.tier || "microDegrade";
      const dnaTag = memoryEntry?.dnaTag || "A1_SURFACE";

      const pagePath =
        hasWindow && window.location ? window.location.pathname : null;

      emitReflexSenseReport({
        message: msg,
        file,
        line,
        frames: rawFrames.length,
        degraded,
        healthScore,
        tier,
        dnaTag,
        page: pagePath,
        seq: skinSeq,
        binaryAware: true
      });

      // Dualband error packet: binary-first nervous system behind route()
      await route("logError", {
        type: classified ? "classified" : "unclassified",
        message: msg,
        frames: rawFrames,
        routeTrace,
        page: pagePath,
        reflexOrigin: "SkinReflex",
        layer: "A1",
        degraded,
        healthScore,
        tier,
        dnaTag,
        binaryAware: true,
        dualBand: true
      });

      const parsed = parseMissingField(msg);
      if (!parsed) {
        logProtector("NO_MISSING_FIELD", {
          degraded,
          healthScore,
          tier,
          dnaTag
        });
        event.preventDefault();
        return;
      }

      const { table, field } = parsed;
      const ownerModule = resolveOwnerModule(field);

      logProtector("HEALING_TRIGGERED", {
        table,
        field,
        ownerModule: ownerModule || "UNKNOWN",
        degraded,
        healthScore,
        tier,
        dnaTag
      });

      healingInProgress = true;
      try {
        await route("fetchField", {
          table,
          field,
          ownerModule,
          message: msg,
          page: pagePath,
          routeTrace,
          reflexOrigin: "SkinReflex",
          layer: "A1",
          degraded,
          healthScore,
          tier,
          dnaTag,
          binaryAware: true,
          dualBand: true
        });

        logProtector("HEALING_SUCCESS", {
          table,
          field,
          ownerModule,
          degraded,
          healthScore,
          tier,
          dnaTag
        });
      } catch (err) {
        logProtector("HEALING_FAILED", {
          error: String(err),
          degraded,
          healthScore,
          tier,
          dnaTag
        });
        if (typeof error === "function") {
          error("[PulseOSSkinReflex] Router fetch failed:", err);
        }
      }
      healingInProgress = false;
      event.preventDefault();
    },
    true
  );
}


// ============================================================================
// MISSING FIELD PARSER — deterministic, dualband-safe
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