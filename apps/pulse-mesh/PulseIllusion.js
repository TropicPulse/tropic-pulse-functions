// ============================================================================
// [pulse:mesh] PULSE_MESH_THALAMUS v7.4  // white-violet
// Sensory Relay Gate • Perception Filter • Neural Signal Interpreter
// ============================================================================
//
// NEW IN v7.4:
//  • Thalamus now reads system pressure signals from Field + Aura + Flow.
//  • Filters shell signals more aggressively when organism is under tension.
//  • Adds stabilization tags when drift/pressure is high.
//  • Prevents unsafe shell signals from reaching PulseBand.
// ============================================================================

// ------------------------------------------------------------
// THALAMUS META (v7.4)
// ------------------------------------------------------------

const ThalamusMeta = {
  layer: "PulseIllusion",
  role: "THALAMUS_RELAY",
  version: 7.4,
  target: "full-mesh",
  selfRepairable: true,
  evo: {
    dualMode: true,
    localAware: true,
    internetAware: true,
    advantageCascadeAware: true,
    pulseEfficiencyAware: true,
    driftProof: true,
    multiInstanceReady: true,
    unifiedAdvantageField: true,
    futureEvolutionReady: true
  }
};

// ------------------------------------------------------------
// IMPORT FIELD + AURA PRESSURE
// ------------------------------------------------------------

import { PulseField } from "./PulseField.js";
import { PulseAura } from "./PulseAura.js";

// ======================================================
//  SIGNAL RELAY ENGINE — Thalamic Interpretation Layer
// ======================================================

export function interpretShellSignal(input) {
  groupCollapsed(
    "%c[PulseIllusion v7.4] Thalamic Relay",
    "color:#BA68C8; font-weight:bold;"
  );

  try {
    log("thalamus", "ShadowGuard → Thalamus relay initiated.");

    // ------------------------------------------------------------
    // VALIDATION — Ensure input is well-formed
    // ------------------------------------------------------------
    if (!input || typeof input !== "object") {
      warn("thalamus", "Malformed shell signal received.");
      groupEnd();
      return null;
    }

    const { shellState, allowPulseBand, allowIdentity } = input;

    if (!shellState) {
      error("thalamus", "Missing shellState in thalamic relay.");
      groupEnd();
      return null;
    }

    // ------------------------------------------------------------
    // READ SYSTEM PRESSURE (Field + Aura)
    // ------------------------------------------------------------
    const field = PulseField.snapshot();
    const auraPressure =
      shellState?.aura_tension ??
      field.auraTension ??
      0;

    const flowPressure = field.flowPressure || 0;
    const driftPressure = field.driftPressure || 0;
    const throttleRate = field.throttleRate || 0;

    // ------------------------------------------------------------
    // PERCEPTION FILTER — Adaptive based on system pressure
    // ------------------------------------------------------------
    let perceptionSafe = true;

    // High flow pressure → block unsafe shell signals
    if (flowPressure > 0.6) perceptionSafe = false;

    // High drift → block malformed or noisy shell signals
    if (driftPressure > 0.5) perceptionSafe = false;

    // High throttle rate → reduce incoming sensory load
    if (throttleRate > 0.3) perceptionSafe = false;

    // Aura tension → stabilize perception
    if (auraPressure > 0.4) perceptionSafe = false;

    // ------------------------------------------------------------
    // BUILD OUTPUT
    // ------------------------------------------------------------
    const output = {
      thalamus_meta: ThalamusMeta,
      neuralState: shellState,
      enablePulse: allowPulseBand === true && perceptionSafe,
      enableIdentity: allowIdentity === true && perceptionSafe,
      perceptionSafe,
      perceptionFlags: {
        flowPressure,
        driftPressure,
        throttleRate,
        auraPressure
      }
    };

    if (!perceptionSafe) {
      output.perceptionFlags.stabilized = true;
      log("thalamus", "Perception stabilized due to system pressure.");
    }

    log("thalamus", "Thalamic signal prepared for PulseBand.");
    log("thalamus", "Output payload", output);

    groupEnd();
    return output;

  } catch (err) {
    error("thalamus", "Critical thalamic relay failure", err);
    groupEnd();
    return null;
  }
}
