// -----------------------------------------------------------------------------
// PulseSignalInterceptor.js — OFFLINE CNS + DUALBAND AI EXECUTION LISTENER
// -----------------------------------------------------------------------------

import { route as CNSRoute } from "../PULSE-BAND/PULSE-OS/PulseOSCNSNervousSystem.js";
import { startDualBandAIEngine } from "../PULSE-BAND/PULSE-AI/DualBandAIEngine.js";

const channel = new BroadcastChannel("PulseCNS");

// -----------------------------------------------------------------------------
// MAIN SIGNAL HANDLER
// -----------------------------------------------------------------------------
channel.onmessage = async (event) => {
  const msg = event.data;
  if (!msg) return;

  // ---------------------------------------------------------------------------
  // CNS REQUEST
  // ---------------------------------------------------------------------------
  if (msg.type === "CNS_REQUEST") {
    const { requestId, path, payload } = msg;

    console.log(
      "%c[PulseSignalInterceptor] ← CNS_REQUEST",
      "color:#2ECC40; font-weight:bold;",
      { requestId, path, payload }
    );

    let result;

    try {
      result = await CNSRoute(path, payload);
    } catch (err) {
      result = {
        error: true,
        message: err?.message || "CNS execution error",
        stack: err?.stack || null
      };
    }

    channel.postMessage({
      type: "CNS_RESPONSE",
      requestId,
      result
    });

    return;
  }

  // ---------------------------------------------------------------------------
  // DUALBAND AI START
  // ---------------------------------------------------------------------------
  if (msg.type === "DUALBAND_AI_START") {
    console.log(
      "%c[PulseSignalInterceptor] ← DUALBAND_AI_START",
      "color:#FF851B; font-weight:bold;",
      msg.options
    );

    try {
      const ai = await startDualBandAIEngine(msg.options || {});

      // AI ENGINE CAN EMIT EVENTS BACK TO UI
      ai.on("event", (data) => {
        channel.postMessage({
          type: "DUALBAND_AI_EVENT",
          data
        });
      });

      // AI ENGINE CAN REQUEST ORGANISM BOOT
      ai.on("boot-organism", (bootOptions) => {
        channel.postMessage({
          type: "DUALBAND_BOOT",
          bootOptions
        });
      });

      console.log(
        "%c[PulseSignalInterceptor] → DUALBAND_AI_STARTED",
        "color:#B10DC9; font-weight:bold;",
        msg.options
      );

    } catch (err) {
      console.error(
        "%c[PulseSignalInterceptor] ✖ DUALBAND_AI_START FAILED",
        "color:#FF4136; font-weight:bold;",
        err
      );
    }

    return;
  }
};
