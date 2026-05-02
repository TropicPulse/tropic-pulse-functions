// ============================================================================
// PulseSignalInterceptor.js — v14 IMMORTAL
// OFFLINE CNS + DUALBAND AI EXECUTION LISTENER + IMAGE LOADER ORGAN
// ============================================================================
/*
AI_EXPERIENCE_META = {
  identity: "PulseSignalInterceptor",
  version: "v14-IMMORTAL",
  layer: "cns",
  role: "os_signal_interceptor",
  lineage: "PulseOS-v14",

  evo: {
    interceptor: true,
    reflexFilter: true,
    anomalyDetection: true,

    symbolicPrimary: true,
    binaryAware: true,
    dualBand: true,

    deterministic: true,
    driftProof: true,
    zeroNetwork: true,
    zeroFilesystem: true,

    safeRouteFree: true,
    zeroMutationOfInput: true
  },

  contract: {
    always: [
      "PulseOSNervousSystem",
      "PulseOSSpinalCord",
      "PulseOSFightFlightResponse"
    ],
    never: [
      "legacySignalInterceptor",
      "safeRoute",
      "fetchViaCNS"
    ]
  }
}
*/


// ============================================================================
// IMPORTS — CNS ROUTER + DUALBAND AI ENGINE
// ============================================================================
import { route as CNSRoute } from "../PULSE-BAND/PULSE-OS/PulseOSCNSNervousSystem.js";
import { startDualBandAIEngine } from "../PULSE-BAND/PULSE-AI/DualBandAIEngine.js";

// ============================================================================
// BROADCAST CHANNEL — PulseCNS
// This is the nervous system "axon" that carries CNS messages between:
//   • UI → CNS
//   • CNS → UI
//   • AI Engine → UI
// ============================================================================
const channel = new BroadcastChannel("PulseCNS");

// ============================================================================
// OFFLINE IMAGE LOADER — v14 IMMORTAL
// Uses CNS virtual filesystem + path resolver
// NEVER uses network fetch
// NEVER leaks filesystem paths
// ALWAYS returns deterministic envelopes
// ============================================================================
async function fetchImageOffline(url) {
  try {
    // Extract filename from URL
    const filename = url.split("/").pop();

    // Resolve virtual path: _PICTURES/<filename>
    const picturePath = await CNSRoute("path.join", {
      parts: ["_PICTURES", filename]
    });

    // Check if file exists in CNS FS
    const exists = await CNSRoute("fs.exists", { path: picturePath });

    if (!exists) {
      return {
        ok: false,
        error: `File not found in _PICTURES: ${filename}`,
        filename,
        from: "_PICTURES"
      };
    }

    // Read binary file (base64)
    const binary = await CNSRoute("fs.readBinary", { path: picturePath });

    return {
      ok: true,
      base64: binary.base64,
      filename,
      from: "_PICTURES"
    };

  } catch (err) {
    return {
      ok: false,
      error: String(err)
    };
  }
}

// ============================================================================
// MAIN SIGNAL HANDLER — v14 IMMORTAL
// Handles:
//   • CNS_REQUEST
//   • IMAGE_REQUEST
//   • DUALBAND_AI_START
//
// This organ is the "interceptor" between UI and CNS/AI subsystems.
// It MUST be deterministic, safe, and never mutate incoming messages.
// ============================================================================
channel.onmessage = async (event) => {
  const msg = event.data;
  if (!msg) return;

  // ---------------------------------------------------------------------------
  // CNS REQUEST — symbolic or binary CNS execution
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
      // Execute CNS route (symbolic or binary)
      result = await CNSRoute(path, payload);
    } catch (err) {
      // Deterministic error envelope
      result = {
        error: true,
        message: err?.message || "CNS execution error",
        stack: err?.stack || null
      };
    }

    // Respond back to UI
    channel.postMessage({
      type: "CNS_RESPONSE",
      requestId,
      result
    });

    return;
  }

  // ---------------------------------------------------------------------------
  // IMAGE REQUEST — offline CNS FS loader
  // ---------------------------------------------------------------------------
  if (msg.type === "IMAGE_REQUEST") {
    const { requestId, url } = msg;

    console.log(
      "%c[PulseSignalInterceptor] ← IMAGE_REQUEST",
      "color:#3498DB; font-weight:bold;",
      url
    );

    const data = await fetchImageOffline(url);

    channel.postMessage({
      type: "IMAGE_RESPONSE",
      requestId,
      data
    });

    return;
  }

  // ---------------------------------------------------------------------------
  // DUALBAND AI START — boots the AI engine
  // AI engine can emit:
  //   • DUALBAND_AI_EVENT
  //   • DUALBAND_BOOT
  // ---------------------------------------------------------------------------
  if (msg.type === "DUALBAND_AI_START") {
    console.log(
      "%c[PulseSignalInterceptor] ← DUALBAND_AI_START",
      "color:#FF851B; font-weight:bold;",
      msg.options
    );

    try {
      // Boot AI engine with provided options
      const ai = await startDualBandAIEngine(msg.options || {});

      // AI → UI event channel
      ai.on("event", (data) => {
        channel.postMessage({
          type: "DUALBAND_AI_EVENT",
          data
        });
      });

      // AI → UI organism boot request
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
