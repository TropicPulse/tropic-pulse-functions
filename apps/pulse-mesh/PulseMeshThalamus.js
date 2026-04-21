// ============================================================================
// [pulse:mesh] PULSE_MESH_THALAMUS v9.2  // white‑violet
// Sensory Relay Gate • Perception Filter • Neural Signal Interpreter
// Local‑First • Internet‑Limited • Factoring‑Aware • Metadata‑Only
// ============================================================================
//
// IDENTITY — THALAMUS (v9.2):
// ---------------------------
// • First neural relay after ShadowGuard.
// • Interprets shellState → safe neuralState.
// • Applies adaptive perception filters based on:
//      - flowPressure
//      - driftPressure
//      - throttleRate
//      - auraTension
//      - factoringBias
//      - routeMode (local / cluster / internet)
// • Blocks unsafe signals from reaching PulseBand.
// • Pure metadata-only — zero payload mutation.
// • Deterministic, drift-proof, CNS-injected dependencies.
// • Local-first: internet-mode signals are restricted under pressure.
// ============================================================================


// ------------------------------------------------------------
// THALAMUS META (v9.2)
// ------------------------------------------------------------
const ThalamusMeta = {
  layer: "PulseMeshThalamus",
  role: "THALAMUS_RELAY",
  version: 9.2,
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
    futureEvolutionReady: true,
    signalFactoringAware: true
  }
};


// ============================================================================
// FACTORY — ALL DEPENDENCIES INJECTED BY THE CNS BRAIN
// Thalamus MUST HAVE ZERO IMPORTS
// ============================================================================
export function createPulseMeshThalamus({
  getPressureSnapshot,
  getAuraSnapshot,
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
      "%c[PulseThalamus v9.2] Relay",
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

      const { shellState, allowPulseBand, allowIdentity } = input;

      if (!shellState) {
        error("thalamus", "Missing shellState in thalamic relay.");
        groupEnd();
        return null;
      }

      // ------------------------------------------------------------
      // READ SYSTEM PRESSURE (Field + Aura)
      // ------------------------------------------------------------
      const field = getPressureSnapshot() || {};
      const aura = getAuraSnapshot() || {};

      const flowPressure = field.flowPressure || 0;
      const driftPressure = field.driftPressure || 0;
      const throttleRate = field.throttleRate || 0;
      const auraPressure =
        shellState?.aura_tension ??
        aura.auraTension ??
        field.auraTension ??
        0;

      // NEW v9.2: factoring pressure (metadata-only)
      const factoringBias =
        shellState?.aura_factoring_bias ??
        aura.factoringBias ??
        field.factoringBias ??
        0;

      // NEW v9.2: route mode (local-first, internet-limited)
      const routeMode =
        shellState?.route_mode ??
        aura.routeMode ??
        "local";

      // ------------------------------------------------------------
      // PERCEPTION FILTER — Adaptive based on system pressure
      // ------------------------------------------------------------
      let perceptionSafe = true;

      // Base pressure gates
      if (flowPressure > 0.6) perceptionSafe = false;
      if (driftPressure > 0.5) perceptionSafe = false;
      if (throttleRate > 0.3) perceptionSafe = false;
      if (auraPressure > 0.4) perceptionSafe = false;

      // Factoring pressure gate
      if (factoringBias > 0.55) perceptionSafe = false;

      // NEW v9.2: internet-mode signals are restricted under pressure
      if (routeMode === "internet") {
        const internetPressure =
          flowPressure * 0.4 +
          driftPressure * 0.3 +
          auraPressure * 0.3;

        if (internetPressure > 0.25) {
          perceptionSafe = false;
        }
      }

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
          auraPressure,
          factoringBias,
          routeMode
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

  return {
    interpretShellSignal,
    meta: ThalamusMeta
  };
}
