// -----------------------------------------------------------------------------
// PulseBridge.js — The legal FRONT → MIDDLE → CNS routing layer
// -----------------------------------------------------------------------------
//
// PURPOSE:
//   - Prevents FRONT layer from calling CNS directly
//   - Adds safety, tracing, and membrane-friendly behavior
//   - Allows future upgrades without touching CNS
//   - Marks synthetic 404s with "*" so YOU know it's internal
//
// CONTRACT:
//   FRONT → PulseBridge.safeRoute() → CNS.route()
//   NEVER: FRONT → CNS.route() directly
//
// -----------------------------------------------------------------------------

import { route as CNSRoute } from "../PULSE-BAND/PULSE-OS/PulseOSCNSNervousSystem.js";

// Optional: detect dev mode (you can replace this with your own flag)
const DEV = true;

// -----------------------------------------------------------------------------
// Internal helper — marks synthetic 404s so YOU know it's internal
// -----------------------------------------------------------------------------
function mark404(result) {
  if (!result) return result;

  // CNS may return: { status: 404 } or throw "404"
  if (result === 404) return 404 + "*";
  if (result?.status === 404) return { ...result, status: "404*" };
  if (typeof result === "string" && result.trim() === "404") return "404*";

  return result;
}

// -----------------------------------------------------------------------------
// Internal helper — optional dev-mode tracing
// -----------------------------------------------------------------------------
function trace(path, payload) {
  if (!DEV) return;

  console.log(
    "%c[PulseBridge] → CNS",
    "color:#7FDBFF; font-weight:bold;",
    { path, payload }
  );
}

// -----------------------------------------------------------------------------
// SAFE ROUTE — the only legal way for FRONT to talk to CNS
// -----------------------------------------------------------------------------
export function safeRoute(path, payload = {}) {
  try {
    trace(path, payload);

    // Forward to CNS
    const result = CNSRoute(path, payload);

    // Mark internal 404s so YOU know it's not a filesystem error
    return mark404(result);

  } catch (err) {
    // If CNS throws "404", convert to "404*"
    if (err?.message === "404" || err === "404") {
      return "404*";
    }

    // Forward other errors untouched
    throw err;
  }
}

// -----------------------------------------------------------------------------
// FUTURE EXTENSION POINTS
// -----------------------------------------------------------------------------
//
// 1. Permission checks
//    if (!userHasAccess(path)) return "404*";
//
// 2. Layer validation
//    if (path.startsWith("nervousSystem/") && FRONT_CALLING) return "404*";
//
// 3. Payload sanitation
//    sanitize(payload);
//
// 4. Offline routing
//    if (!navigator.onLine) return offlineRoute(path, payload);
//
// 5. Logging hooks
//    PulseLogger.log("bridge", `Routing ${path}`);
//
// -----------------------------------------------------------------------------
