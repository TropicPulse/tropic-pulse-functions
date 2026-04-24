// ============================================================================
// [pulse:mesh] PULSE_MESH_THALAMUS v11-Evo  // white‑violet
// Sensory Relay Gate • Perception Filter • Neural Signal Interpreter
// Deterministic • Metadata‑Only • Zero Pressure Logic
// ============================================================================
//
// IDENTITY — THALAMUS (v11-Evo):
// ------------------------------
// • First neural relay after ShadowGuard.
// • Interprets shellState → safe neuralState.
// • Performs structural validation only (no pressure logic).
// • Blocks malformed or unsafe signals.
// • Pure metadata-only — zero payload mutation.
// • Deterministic, drift-proof, CNS-injected dependencies.
// • Binary-aware, dual-mode-ready.
// • No pressure gating, no route-mode logic, no factoring logic.
// ============================================================================

const ThalamusMeta = {
  layer: "PulseMeshThalamus",
  role: "THALAMUS_RELAY",
  version: "11.0-Evo",
  target: "full-mesh",
  selfRepairable: true,
  evo: {
    dualMode: true,
    binaryAware: true,
    symbolicAware: true,
    localAware: true,
    internetAware: true,

    advantageCascadeAware: true,
    pulseEfficiencyAware: true,
    driftProof: true,
    multiInstanceReady: true,

    unifiedAdvantageField: true,
    deterministicField: true,
    futureEvolutionReady: true,

    signalFactoringAware: true,
    meshPressureAware: true,
    auraPressureAware: true,

    zeroCompute: true,
    zeroMutation: true,
    zeroRoutingInfluence: true
  }
};


// ============================================================================
// FACTORY — ALL DEPENDENCIES INJECTED BY THE CNS BRAIN
// Thalamus MUST HAVE ZERO IMPORTS
// ============================================================================
export function createPulseMeshThalamus({
  log,
  warn,
  error,
  groupCollapsed,
  groupEnd
}) {

  // ======================================================
  //  SIGNAL RELAY ENGINE — Thalamic Interpretation Layer
  // ======================================================
  function interpretShellSignal(input) {
    groupCollapsed(
      "%c[PulseThalamus v11-Evo] Relay",
      "color:#CE93D8; font-weight:bold;"
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

      const { shellState, allowPulseBand, allowIdentity, binaryMode, dualMode } = input;

      if (!shellState) {
        error("thalamus", "Missing shellState in thalamic relay.");
        groupEnd();
        return null;
      }

      // ------------------------------------------------------------
      // PERCEPTION SAFETY — v11-Evo: structural only
      // ------------------------------------------------------------
      let perceptionSafe = true;

      if (typeof shellState !== "object") perceptionSafe = false;
      if (shellState === null) perceptionSafe = false;

      // ------------------------------------------------------------
      // MODE TAGGING — v11-Evo
      // ------------------------------------------------------------
      const mode = binaryMode ? "binary" : dualMode ? "dual" : "symbolic";

      // ------------------------------------------------------------
      // BUILD OUTPUT
      // ------------------------------------------------------------
      const output = {
        thalamus_meta: ThalamusMeta,
        neuralState: shellState,
        enablePulse: allowPulseBand === true && perceptionSafe,
        enableIdentity: allowIdentity === true && perceptionSafe,
        perceptionSafe,
        mode,
        perceptionFlags: {
          structural_valid: perceptionSafe,
          binary_mode: !!binaryMode,
          dual_mode: !!dualMode
        }
      };

      if (!perceptionSafe) {
        output.perceptionFlags.stabilized = true;
        warn("thalamus", "Perception stabilized due to malformed signal.");
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

  return {
    interpretShellSignal,
    meta: ThalamusMeta
  };
}
