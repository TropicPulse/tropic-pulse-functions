// ============================================================================
//  PULSE GPU — BARREL (A) — YOUR EXACT ARCHITECTURE
//  Starts the GPU Brain. Nothing else.
// ============================================================================

import { PulseVersion, PulseRoles, makeTelemetryPacket, log, warn, error } from "../PulseLogger.js";
import { initPulseBand } from "./PulseBand.js";

// Start PulseBand (nervous system)
initPulseBand({
  logger: { log, warn, error }
});
// --- BRAIN LAYER (B) --------------------------------------------------------
import { BrainInput, PulseGPUBrainExport, PulseGPUBrainController} from "./PulseGPUBrain.js";
import { PulseGPUOrchestrator } from "./PulseGPUOrchestrator.js";
// --- HEALER -----------------------------------------------------------------
import { PulseGPUHealer } from "./PulseGPUHealer.js";

// ============================================================================
//  GPU STATE — Barrel Only Tracks Brain + Controller
// ============================================================================
const gpuState = {
  ready: false,
  brainReady: false,
  lastError: null,
  metrics: {
    framesRendered: 0
  }
};

// ============================================================================
//  START GPU BRAIN — THIS WAS THE MISSING PIECE
// ============================================================================
function startBrain(rawAssets) {
  try {
    log("%c[PulseGPU] Starting GPU Brain…", "color:#03A9F4;");

    // 1. Build brain input
    const brainInput = new BrainInput(rawAssets);

    // 2. Build packages using the brain controller
    const packageSet = PulseGPUBrainController.buildPackages(brainInput);

    // 3. Export the package set
    const brainExport = new PulseGPUBrainExport(packageSet);

    log("%c[PulseGPU] Brain packages built.", "color:#4CAF50;");

    gpuState.brainReady = true;
    return brainExport;

  } catch (err) {
    gpuState.lastError = String(err);
    error("[PulseGPU] Brain start failed:", err);
    return null;
  }
}

// ============================================================================
//  PUBLIC GPU CONTROLLER — BARREL LEVEL ONLY
// ============================================================================
async function init(rawAssets) {
  try {
    log("%c[PulseGPU] init() called.", "color:#03A9F4;");

    // 1. Start the brain (THIS IS THE CORE YOU WANTED)
    const brain = startBrain(rawAssets);

    if (!brain) {
      warn("[PulseGPU] Brain failed to start.");
      gpuState.ready = false;
      return false;
    }

    // Barrel only marks brain ready — runtime/engine start in BRAIN layer
    gpuState.ready = true;

    return true;

  } catch (err) {
    gpuState.lastError = String(err);
    error("[PulseGPU ERROR]", err);
    return false;
  }
}

function renderFrame() {
  if (!gpuState.ready) return;
  gpuState.metrics.framesRendered++;
}

function getStatus() {
  return { ...gpuState };
}

function attachToWindowDebug() {
  if (typeof window === "undefined") return;

  window.PulseGPU = {
    init,
    renderFrame,
    getStatus
  };
}

// ============================================================================
//  EXPORTS — EXACTLY WHAT BELONGS IN THE BARREL (A)
// ============================================================================
export const PulseGPU = {
  init,
  renderFrame,
  getStatus,
  attachToWindowDebug
};

export {
  BrainInput,
  PulseGPUBrainExport,
  PulseGPUBrainController,
  PulseGPUHealer
};
