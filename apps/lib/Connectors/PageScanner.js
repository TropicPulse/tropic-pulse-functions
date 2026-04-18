// ============================================================================
// FILE: /apps/lib/Connectors/PageScanner.js
// PULSE ERROR GUARDIAN — v6.3
// “THE PROTECTOR / ERROR GUARDIAN & HEALING TRIGGER”
// ============================================================================
//
// ⭐ v6.3 COMMENT LOG
// - THEME: “THE PROTECTOR / ERROR GUARDIAN & HEALING TRIGGER”
// - ROLE: Error interception + healing trigger + route tracing
// - Added LAYER CONSTANTS + DIAGNOSTICS helper
// - Added structured JSON logs (DOM-visible inspector compatible)
// - Added explicit STAGE markers for attach/scan/heal
// - ZERO logic changes to healing or parsing behavior
//
// ============================================================================
// PERSONALITY + ROLE — “THE PROTECTOR”
// ----------------------------------------------------------------------------
// PageScanner is the **PROTECTOR** of the Pulse OS.
// It is the **ERROR GUARDIAN & HEALING TRIGGER** — the subsystem that stands
// between the UI and runtime chaos.
//
//   • Intercepts JS errors
//   • Extracts stack frames + file context
//   • Builds a route trace for backend healing
//   • Detects missing fields
//   • Triggers backend healing requests
//   • Prevents UI crashes
//
// This is the OS’s **shield** — the reflex that protects the system from
// breaking and initiates self-repair.
//
// ============================================================================
// WHAT THIS FILE IS
// ----------------------------------------------------------------------------
//   ✔ A2-layer error interceptor
//   ✔ A healing trigger
//   ✔ A route-trace generator
//
// WHAT THIS FILE IS NOT
// ----------------------------------------------------------------------------
//   ✘ NOT a router  
//   ✘ NOT a backend connector  
//   ✘ NOT a business logic layer  
//   ✘ NOT a security layer  
//
// ============================================================================
// SAFETY CONTRACT (v6.3)
// ----------------------------------------------------------------------------
//   • Never mutate identity
//   • Never modify backend logic
//   • Never swallow errors silently
//   • Always trigger healing deterministically
//
// ============================================================================
// LAYER CONSTANTS + DIAGNOSTICS
// ============================================================================
const LAYER_ID = "PROTECTOR-LAYER";
const LAYER_NAME = "THE PROTECTOR";
const LAYER_ROLE = "ERROR GUARDIAN & HEALING TRIGGER";

const PROTECTOR_DIAGNOSTICS_ENABLED =
  process.env.PULSE_PROTECTOR_DIAGNOSTICS === "true" ||
  process.env.PULSE_DIAGNOSTICS === "true";

const logProtector = (stage, details = {}) => {
  if (!PROTECTOR_DIAGNOSTICS_ENABLED) return;

  console.log(
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
// FILE MAP (unchanged, but now part of THE PROTECTOR)
// ============================================================================
const FILE_MAP = {
  "router.js": {
    label: "ROUTER",
    layer: "C‑Layer",
    purpose: "Frontend → Backend Connector",
    context: "Sends structured requests to backend router"
  },
  "PageScanner.js": {
    label: "PROTECTOR",
    layer: "A2‑Layer",
    purpose: "Error Capture + Healing",
    context: "Intercepts JS errors, extracts route, triggers healing"
  },
  "PulseIdentity.js": {
    label: "IDENTITY",
    layer: "B‑Layer",
    purpose: "Auth + UID + User Context",
    context: "Resolves identity, tokens, and user state"
  },
  "PulseClient.js": {
    label: "CLIENT",
    layer: "B‑Layer",
    purpose: "Data Fetch / Hooks / Maps",
    context: "Fetches user data, maps, hooks, and dynamic fields"
  },
  "PulseNet.js": {
    label: "NETWORK",
    layer: "B‑Layer",
    purpose: "Low‑Level Fetch Wrapper",
    context: "Handles raw network requests + retries"
  },
  "PulseUpdate.js": {
    label: "UPDATE",
    layer: "B‑Layer",
    purpose: "Writes",
    context: "Writes user data and system updates"
  },
  "PulseGPU.js": {
    label: "GPU",
    layer: "B‑Layer",
    purpose: "Heavy Compute Ops",
    context: "Runs expensive calculations"
  }
};

// ============================================================================
// PUBLIC API (C‑LAYER)
// ============================================================================
import { route } from "./router.js";

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

  console.log(
    "%c[PageScanner] Attached with identity: " + id.uid,
    "color: #4CAF50; font-weight: bold;"
  );
}

// ============================================================================
// GLOBAL ERROR INTERCEPTOR (A → A2)
// ============================================================================
let healingInProgress = false;

window.addEventListener("error", async (event) => {
  if (healingInProgress) return;

  logProtector("ERROR_INTERCEPTED", { message: event.message });

  const msg = event.message || "";
  const stack = event.error?.stack || "";
  const frames = stack.split("\n").map(s => s.trim());

  const rawFrames = frames
    .filter(f => f.includes(".js"))
    .map(f => f.replace(/^at\s+/, ""));

  // ------------------------------------------------------------
  // ⭐ ROUTE TRACE
  // ------------------------------------------------------------
  const routeTrace = rawFrames.map((frame) => {
    const file = frame.split("/").pop().split(":")[0];
    const info = FILE_MAP[file] || {
      label: "UNKNOWN",
      layer: "⚠️ Unknown Layer",
      purpose: "Unknown Purpose",
      context: "No mapping found — inspect manually"
    };
    return { frame, ...info };
  });

  logProtector("ROUTE_TRACE_BUILT", { frames: routeTrace.length });

  // ------------------------------------------------------------
  // ⭐ HEALING LOGIC
  // ------------------------------------------------------------
  const parsed = parseMissingField(msg);
  if (!parsed) {
    logProtector("NO_MISSING_FIELD", {});
    return;
  }

  const { table, field } = parsed;

  logProtector("HEALING_TRIGGERED", { table, field });

  healingInProgress = true;

  try {
    await route("fetchField", {
      table,
      field,
      message: msg,
      page: window.location.pathname,
      routeTrace
    });

    logProtector("HEALING_SUCCESS", { table, field });

  } catch (err) {
    logProtector("HEALING_FAILED", { error: String(err) });
    console.error("[PageScanner] Router fetch failed:", err);
  }

  healingInProgress = false;

  event.preventDefault();
}, true);

// ============================================================================
// PARSER
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
