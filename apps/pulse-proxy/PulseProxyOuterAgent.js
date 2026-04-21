// ============================================================================
//  PULSE OS v7.7 — PROXY OUTER AGENT
//  “THE OUTER AGENT / EXTERNAL NEGOTIATOR”
//  External Interface • Job Courier • Device Ambassador
//  PURE NEGOTIATION. NO COMPUTE. NO MARKETPLACE LOGIC. NO STATE.
// ============================================================================
//
//  ORGAN DESCRIPTION — WHAT THIS IS (v7.7):
//  ----------------------------------------
//  PulseProxyOuterAgent is the **ambassador organ** of PulseOS. It is the
//  outermost interface between the OS and the external compute marketplace.
//
//  It does NOT:
//    • compute jobs
//    • select jobs
//    • score jobs
//    • mutate OS state
//    • access PulseBand / PulseNet / PulseBrain
//    • perform orchestration
//
//  It ONLY:
//    • registers the device outward
//    • requests compute jobs
//    • submits completed results
//    • syncs credits/tokens
//    • emits diagnostics (optional)
//
//  ROLE IN THE DIGITAL BODY (v7.7):
//  --------------------------------
//    • Ambassador → introduces device to the outside world
//    • Courier → carries jobs in and results out
//    • Exchange Organ → syncs credits/tokens
//    • Boundary Organ → sits between proxy and external world
//
//  SAFETY CONTRACT (v7.7):
//  ------------------------
//    • No PulseBand imports
//    • No PulseNet imports
//    • No PulseBrain imports
//    • No global state
//    • No compute logic
//    • No marketplace logic
//    • No mutation outside this instance
//    • Deterministic, pure courier behavior
//
//  LAYER:
//    • Lives under /tropic-pulse/proxy
//    • Called by Proxy → NOT by frontend
// ============================================================================


// ============================================================================
//  LAYER CONSTANTS + DIAGNOSTICS (v7.7)
// ============================================================================
const AGENT_LAYER_ID   = "PROXY-OUTER-AGENT";
const AGENT_LAYER_NAME = "THE OUTER AGENT";
const AGENT_LAYER_ROLE = "External Interface + Job Courier";

const AGENT_DIAGNOSTICS_ENABLED =
  typeof window !== "undefined" &&
  (window.PULSE_AGENT_DIAGNOSTICS === true ||
   window.PULSE_DIAGNOSTICS === true);

const agentLog = (stage, details = {}) => {
  if (!AGENT_DIAGNOSTICS_ENABLED) return;

  log(
    JSON.stringify({
      pulseLayer: AGENT_LAYER_ID,
      pulseName: AGENT_LAYER_NAME,
      pulseRole: AGENT_LAYER_ROLE,
      stage,
      ...details
    })
  );
};

agentLog("AGENT_INIT");


// ============================================================================
//  OUTER AGENT CLASS — External Negotiator (v7.7)
// ============================================================================
export class PulseProxyOuterAgent {
  constructor({ deviceId, gpuInfo, baseUrl }) {
    this.deviceId = deviceId;
    this.gpuInfo  = gpuInfo;

    // External endpoint (proxy boundary)
    this.baseUrl = baseUrl || "https://www.tropicpulse.bz/proxy";

    agentLog("AGENT_CONSTRUCTED", {
      deviceId,
      gpuInfo,
      baseUrl: this.baseUrl
    });
  }

  // --------------------------------------------------------------------------
  // REGISTER DEVICE — Introduce identity outward
  // --------------------------------------------------------------------------
  async register() {
    agentLog("REGISTER_START", { deviceId: this.deviceId });

    try {
      const res = await fetch(`${this.baseUrl}/registerDevice`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deviceId: this.deviceId,
          gpuInfo: this.gpuInfo
        })
      });

      const json = await res.json();
      agentLog("REGISTER_SUCCESS", json);
      return json;

    } catch (err) {
      error("PulseProxyOuterAgent.register() failed:", err);
      agentLog("REGISTER_FAIL", { error: String(err) });
      return { error: true, message: err.message };
    }
  }

  // --------------------------------------------------------------------------
  // REQUEST JOB — Ask the outside world for work
  // --------------------------------------------------------------------------
  async requestJob() {
    agentLog("REQUEST_JOB_START", { deviceId: this.deviceId });

    try {
      const res = await fetch(
        `${this.baseUrl}/getJob?deviceId=${this.deviceId}`
      );

      const json = await res.json();
      agentLog("REQUEST_JOB_SUCCESS", json);
      return json;

    } catch (err) {
      error("PulseProxyOuterAgent.requestJob() failed:", err);
      agentLog("REQUEST_JOB_FAIL", { error: String(err) });
      return { error: true, message: err.message };
    }
  }

  // --------------------------------------------------------------------------
  // SUBMIT RESULT — Hand completed work back outward
  // --------------------------------------------------------------------------
  async submitResult(jobId, result) {
    agentLog("SUBMIT_RESULT_START", { jobId });

    try {
      const res = await fetch(`${this.baseUrl}/submitJob`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deviceId: this.deviceId,
          jobId,
          result
        })
      });

      const json = await res.json();
      agentLog("SUBMIT_RESULT_SUCCESS", json);
      return json;

    } catch (err) {
      error("PulseProxyOuterAgent.submitResult() failed:", err);
      agentLog("SUBMIT_RESULT_FAIL", { error: String(err) });
      return { error: true, message: err.message };
    }
  }

  // --------------------------------------------------------------------------
  // SYNC CREDITS — Exchange tokens with the outside world
  // --------------------------------------------------------------------------
  async syncCredits() {
    agentLog("SYNC_CREDITS_START", { deviceId: this.deviceId });

    try {
      const res = await fetch(
        `${this.baseUrl}/syncCredits?deviceId=${this.deviceId}`
      );

      const json = await res.json();
      agentLog("SYNC_CREDITS_SUCCESS", json);
      return json;

    } catch (err) {
      error("PulseProxyOuterAgent.syncCredits() failed:", err);
      agentLog("SYNC_CREDITS_FAIL", { error: String(err) });
      return { error: true, message: err.message };
    }
  }
}
