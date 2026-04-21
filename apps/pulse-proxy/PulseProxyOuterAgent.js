// ============================================================================
//  PULSE OS v9.1 — PROXY OUTER AGENT
//  “THE OUTER AGENT / EXTERNAL NEGOTIATOR”
//  External Interface • Job Courier • Device Ambassador
//  PURE NEGOTIATION. NO COMPUTE. NO MARKETPLACE LOGIC. NO STATE MUTATION.
// ============================================================================
//
//  WHAT THIS ORGAN IS (v9.1):
//  --------------------------
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
//  ROLE IN THE DIGITAL BODY (v9.1):
//  --------------------------------
//    • Ambassador → introduces device to the outside world
//    • Courier → carries jobs in and results out
//    • Exchange Organ → syncs credits/tokens
//    • Boundary Organ → sits between proxy and external world
//
//  SAFETY CONTRACT (v9.1):
//  ------------------------
//    • No imports (wiring comes from OSKernel / Brain)
//    • No PulseBand / PulseNet / PulseBrain access
//    • No global state mutation outside this instance
//    • No compute logic, no marketplace logic
//    • Deterministic, pure courier behavior
//
//  LAYER:
//    • Lives under /tropic-pulse/proxy
//    • Called by Proxy → NOT by frontend
// ============================================================================


// ============================================================================
//  GLOBAL WIRING — provided by OSKernel / Brain
// ============================================================================
const log   = (global && global.log)   || console.log;
const error = (global && global.error) || console.error;

// Prefer global fetch (Node 18+ / runtime), fallback to globalThis.fetch
const fetchFn =
  (typeof global !== "undefined" && global.fetch) ||
  (typeof globalThis !== "undefined" && globalThis.fetch) ||
  null;


// ============================================================================
//  LAYER CONSTANTS + DIAGNOSTICS (v9.1)
// ============================================================================
const AGENT_LAYER_ID   = "PROXY-OUTER-AGENT";
const AGENT_LAYER_NAME = "THE OUTER AGENT";
const AGENT_LAYER_ROLE = "External Interface + Job Courier";

export const PROXY_OUTER_AGENT_CONTEXT = {
  layer: "PulseProxyOuterAgent",
  role: "OUTER_AGENT",
  version: "9.1",
  purpose: "External interface + job courier + credit sync",
  evo: {
    driftProof: true,
    deterministic: true,
    boundaryOrgan: true,
    marketplaceBoundary: true,
    multiInstanceReady: true,
    futureEvolutionReady: true
  }
};

const AGENT_DIAGNOSTICS_ENABLED =
  (typeof global !== "undefined" && global.PULSE_AGENT_DIAGNOSTICS === true) ||
  (typeof global !== "undefined" && global.PULSE_DIAGNOSTICS === true) ||
  false;

function agentLog(stage, details = {}) {
  if (!AGENT_DIAGNOSTICS_ENABLED) return;

  try {
    log(
      "outer-agent",
      JSON.stringify({
        pulseLayer: AGENT_LAYER_ID,
        pulseName: AGENT_LAYER_NAME,
        pulseRole: AGENT_LAYER_ROLE,
        stage,
        ...details,
        meta: { ...PROXY_OUTER_AGENT_CONTEXT }
      })
    );
  } catch {}
}

agentLog("AGENT_INIT");


// ============================================================================
//  OUTER AGENT CLASS — External Negotiator (v9.1)
// ============================================================================
export class PulseProxyOuterAgent {
  constructor({ deviceId, gpuInfo, baseUrl }) {
    this.deviceId = deviceId;
    this.gpuInfo  = gpuInfo || null;

    // External endpoint (proxy boundary)
    this.baseUrl =
      baseUrl ||
      (typeof global !== "undefined" && global.PULSE_PROXY_BASE_URL) ||
      "https://www.tropicpulse.bz/proxy";

    agentLog("AGENT_CONSTRUCTED", {
      deviceId: this.deviceId,
      gpuInfo: this.gpuInfo,
      baseUrl: this.baseUrl
    });

    if (!fetchFn) {
      agentLog("FETCH_MISSING", {
        warning: "No fetch available in runtime — outer agent is inert."
      });
    }
  }

  // --------------------------------------------------------------------------
  // INTERNAL FETCH WRAPPER — boundary‑safe
  // --------------------------------------------------------------------------
  async #doFetch(url, options = {}, stage) {
    if (!fetchFn) {
      const msg = "fetch not available in this runtime";
      agentLog(stage + "_NO_FETCH", { url, error: msg });
      return { error: true, message: msg };
    }

    try {
      const res = await fetchFn(url, options);
      let json = null;

      try {
        json = await res.json();
      } catch {
        json = { ok: res.ok, status: res.status };
      }

      return json;
    } catch (err) {
      const msg = String(err?.message || err);
      error("PulseProxyOuterAgent.fetch failed:", msg);
      agentLog(stage + "_FETCH_ERROR", { url, error: msg });
      return { error: true, message: msg };
    }
  }

  // --------------------------------------------------------------------------
  // REGISTER DEVICE — Introduce identity outward
  // --------------------------------------------------------------------------
  async register() {
    const stage = "REGISTER";
    agentLog(stage + "_START", { deviceId: this.deviceId });

    const url = `${this.baseUrl}/registerDevice`;
    const body = {
      deviceId: this.deviceId,
      gpuInfo: this.gpuInfo
    };

    const json = await this.#doFetch(
      url,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      },
      stage
    );

    agentLog(
      json?.error ? stage + "_FAIL" : stage + "_SUCCESS",
      { deviceId: this.deviceId, response: json }
    );

    return json;
  }

  // --------------------------------------------------------------------------
  // REQUEST JOB — Ask the outside world for work
  // --------------------------------------------------------------------------
  async requestJob() {
    const stage = "REQUEST_JOB";
    agentLog(stage + "_START", { deviceId: this.deviceId });

    const url = `${this.baseUrl}/getJob?deviceId=${encodeURIComponent(
      this.deviceId
    )}`;

    const json = await this.#doFetch(url, {}, stage);

    agentLog(
      json?.error ? stage + "_FAIL" : stage + "_SUCCESS",
      { deviceId: this.deviceId, response: json }
    );

    return json;
  }

  // --------------------------------------------------------------------------
  // SUBMIT RESULT — Hand completed work back outward
  // --------------------------------------------------------------------------
  async submitResult(jobId, result) {
    const stage = "SUBMIT_RESULT";
    agentLog(stage + "_START", { deviceId: this.deviceId, jobId });

    const url = `${this.baseUrl}/submitJob`;
    const body = {
      deviceId: this.deviceId,
      jobId,
      result
    };

    const json = await this.#doFetch(
      url,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body)
      },
      stage
    );

    agentLog(
      json?.error ? stage + "_FAIL" : stage + "_SUCCESS",
      { deviceId: this.deviceId, jobId, response: json }
    );

    return json;
  }

  // --------------------------------------------------------------------------
  // SYNC CREDITS — Exchange tokens with the outside world
  // --------------------------------------------------------------------------
  async syncCredits() {
    const stage = "SYNC_CREDITS";
    agentLog(stage + "_START", { deviceId: this.deviceId });

    const url = `${this.baseUrl}/syncCredits?deviceId=${encodeURIComponent(
      this.deviceId
    )}`;

    const json = await this.#doFetch(url, {}, stage);

    agentLog(
      json?.error ? stage + "_FAIL" : stage + "_SUCCESS",
      { deviceId: this.deviceId, response: json }
    );

    return json;
  }
}
