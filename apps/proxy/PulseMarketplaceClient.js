// ============================================================================
// FILE: /tropic-pulse/proxy/PulseMarketplaceClient.js
// LAYER: THE AGENT (External Negotiator + Job Courier)
// ============================================================================
//
// ROLE:
//   THE AGENT — The external negotiator of Pulse OS
//   • Registers the device with backend
//   • Requests compute jobs
//   • Submits job results
//   • Syncs credits/tokens
//   • Acts as the OS’s ambassador to the compute marketplace
//
// CONTRACT:
//   • No PulseBand imports
//   • No PulseNet imports
//   • No PulseUpdate imports
//   • No global state
//   • Pure subsystem module
//
// SAFETY:
//   • v6.3 upgrade is COMMENTAL + DIAGNOSTIC ONLY — NO LOGIC CHANGES
//   • All behavior remains identical to pre‑v6.3 PulseMarketplaceClient
// ============================================================================

// ============================================================================
// LAYER CONSTANTS + DIAGNOSTICS
// ============================================================================
const AGENT_LAYER_ID = "AGENT-LAYER";
const AGENT_LAYER_NAME = "THE AGENT";
const AGENT_LAYER_ROLE = "External Negotiator + Job Courier";

const AGENT_DIAGNOSTICS_ENABLED =
  window?.PULSE_AGENT_DIAGNOSTICS === true ||
  window?.PULSE_DIAGNOSTICS === true;

const agentLog = (stage, details = {}) => {
  if (!AGENT_DIAGNOSTICS_ENABLED) return;

  console.log(
    JSON.stringify({
      pulseLayer: AGENT_LAYER_ID,
      pulseName: AGENT_LAYER_NAME,
      pulseRole: AGENT_LAYER_ROLE,
      stage,
      ...details
    })
  );
};

agentLog("AGENT_INIT", {});

// ============================================================================
// AGENT CLASS — External Negotiator
// ============================================================================
export class PulseMarketplaceClient {
  constructor({ deviceId, gpuInfo, baseUrl }) {
    this.deviceId = deviceId;
    this.gpuInfo = gpuInfo;

    // Your REAL backend endpoint
    this.baseUrl = baseUrl || "https://www.tropicpulse.bz/proxy";

    agentLog("AGENT_CONSTRUCTED", {
      deviceId,
      gpuInfo,
      baseUrl: this.baseUrl
    });
  }

  // --------------------------------------------------------------------------
  // REGISTER DEVICE — Agent Identity Introduction
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
      console.error("PulseMarketplaceClient.register() failed:", err);
      agentLog("REGISTER_FAIL", { error: String(err) });
      return { error: true, message: err.message };
    }
  }

  // --------------------------------------------------------------------------
  // REQUEST JOB — Agent Requests Work
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
      console.error("PulseMarketplaceClient.requestJob() failed:", err);
      agentLog("REQUEST_JOB_FAIL", { error: String(err) });
      return { error: true, message: err.message };
    }
  }

  // --------------------------------------------------------------------------
  // SUBMIT RESULT — Agent Returns Completed Work
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
      console.error("PulseMarketplaceClient.submitResult() failed:", err);
      agentLog("SUBMIT_RESULT_FAIL", { error: String(err) });
      return { error: true, message: err.message };
    }
  }

  // --------------------------------------------------------------------------
  // SYNC CREDITS — Agent Syncs Rewards
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
      console.error("PulseMarketplaceClient.syncCredits() failed:", err);
      agentLog("SYNC_CREDITS_FAIL", { error: String(err) });
      return { error: true, message: err.message };
    }
  }
}
