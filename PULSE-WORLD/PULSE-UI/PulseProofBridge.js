// -----------------------------------------------------------------------------
// PulseBridge.js — The LOCAL PORT BRIDGE for FRONT ↔ CNS (SIGNAL VERSION)
// -----------------------------------------------------------------------------
//
// PURPOSE:
//   - Lives INSIDE PULSE-UI.
//   - NO IMPORTS.
//   - Sends SIGNALS to offline CNS + DualBand AI.
//   - Receives SIGNALS from offline CNS + DualBand AI.
//   - UI registers callbacks for organism boot + AI events.
//   - Bridge calls those callbacks when signals arrive.
//
// -----------------------------------------------------------------------------
// -----------------------------------------------------------------------------
// PulseBridge.js — The LOCAL PORT BRIDGE for FRONT ↔ CNS (SIGNAL VERSION)
// -----------------------------------------------------------------------------

const DEV = true;
const channel = new BroadcastChannel("PulseCNS");

// -----------------------------------------------------------------------------
// CALLBACK REGISTRIES (UI registers handlers here)
// -----------------------------------------------------------------------------
let dualBandBootHandler = null;
let aiEventHandler = null;

export function onDualBandBoot(fn) {
  dualBandBootHandler = fn;
}

export function onAIEvent(fn) {
  aiEventHandler = fn;
}

// -----------------------------------------------------------------------------
// Marks synthetic 404s so YOU know it's internal
// -----------------------------------------------------------------------------
function mark404(result) {
  if (!result) return result;
  if (result === 404) return "404*";
  if (result?.status === 404) return { ...result, status: "404*" };
  if (typeof result === "string" && result.trim() === "404") return "404*";
  return result;
}

// -----------------------------------------------------------------------------
// Optional dev-mode tracing
// -----------------------------------------------------------------------------
function trace(label, data) {
  if (!DEV) return;
  console.log(`%c[LOCAL PORT BRIDGE] → ${label}`, "color:#7FDBFF; font-weight:bold;", data);
}

function traceInbound(label, data) {
  if (!DEV) return;
  console.log(`%c[LOCAL PORT BRIDGE] ← ${label}`, "color:#39CCCC; font-weight:bold;", data);
}

// -----------------------------------------------------------------------------
// SAFE ROUTE — sends a CNS_REQUEST signal and waits for CNS_RESPONSE
// -----------------------------------------------------------------------------
export function safeRoute(path, payload = {}) {
  trace("CNS (SIGNAL)", { path, payload });

  const requestId = `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  return new Promise((resolve) => {
    const handler = (event) => {
      const msg = event.data;
      if (!msg || msg.type !== "CNS_RESPONSE") return;
      if (msg.requestId !== requestId) return;

      channel.removeEventListener("message", handler);
      resolve(mark404(msg.result));
    };

    channel.addEventListener("message", handler);

    channel.postMessage({
      type: "CNS_REQUEST",
      requestId,
      path,
      payload
    });
  });
}

// -----------------------------------------------------------------------------
// START DUALBAND AI — fire-and-forget signal
// -----------------------------------------------------------------------------
export function startDualBandAI(options = {}) {
  trace("DUALBAND_AI_START (SIGNAL)", options);

  channel.postMessage({
    type: "DUALBAND_AI_START",
    timestamp: Date.now(),
    options
  });
}

// -----------------------------------------------------------------------------
// INBOUND SIGNAL HANDLER — AI → UI events
// -----------------------------------------------------------------------------
channel.onmessage = (event) => {
  const msg = event.data;
  if (!msg) return;

  if (msg.type === "DUALBAND_AI_EVENT") {
    traceInbound("DUALBAND_AI_EVENT", msg.data);
    if (aiEventHandler) aiEventHandler(msg.data);
    return;
  }

  if (msg.type === "DUALBAND_BOOT") {
    traceInbound("DUALBAND_BOOT", msg.bootOptions);
    if (dualBandBootHandler) dualBandBootHandler(msg.bootOptions);
    return;
  }
};

// -----------------------------------------------------------------------------
// ALIASES FOR WINDOW / OTHER MODULES
// -----------------------------------------------------------------------------
export const route = safeRoute;
export const PulseBinaryOrganismBoot = startDualBandAI;
