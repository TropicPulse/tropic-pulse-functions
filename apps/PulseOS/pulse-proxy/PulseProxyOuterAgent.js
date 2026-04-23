// ============================================================================
//  PULSE OS v9.3 — PROXY OUTER AGENT
//  “THE OUTER AGENT / EXTERNAL NEGOTIATOR”
//  External Interface • Job Courier • Device Ambassador
//  PURE NEGOTIATION. NO COMPUTE. NO MARKETPLACE LOGIC. NO STATE MUTATION.
// ============================================================================

// ============================================================================
//  GLOBAL WIRING — v10.2 (Safe, backend‑first, no hard global dependency)
// ============================================================================
const G =
  typeof globalThis !== "undefined"
    ? globalThis
    : typeof global !== "undefined"
    ? global
    : typeof window !== "undefined"
    ? window
    : {};

// Safe fallbacks — boundary organ, but never break if wiring incomplete
const log   = G.log   || console.log;
const error = G.error || console.error;

const fetchFn =
  (typeof G.fetch === "function" && G.fetch) ||
  null;

// ============================================================================
//  ORGAN IDENTITY — v9.3
// ============================================================================
export const PulseRole = {
  type: "Organ",
  subsystem: "PulseProxy",
  layer: "OuterAgent",
  version: "9.3",
  identity: "PulseProxyOuterAgent",

  evo: {
    driftProof: true,
    deterministic: true,
    boundaryOrgan: true,
    externalNegotiator: true,
    marketplaceBoundary: true,
    backendPreferred: true,
    noIQ: true,
    noRouting: true,
    noCompute: true,
    multiInstanceReady: true,
    unifiedAdvantageField: true,
    pulseEfficiencyAware: true,
    futureEvolutionReady: true
  }
};

// ============================================================================
//  LAYER CONSTANTS + CONTEXT (v9.3)
// ============================================================================
const AGENT_LAYER_ID   = "PROXY-OUTER-AGENT";
const AGENT_LAYER_NAME = "THE OUTER AGENT";
const AGENT_LAYER_ROLE = "External Interface + Job Courier";

export const PROXY_OUTER_AGENT_CONTEXT = {
  layer: PulseRole.layer,
  role: PulseRole.identity,
  version: PulseRole.version,
  purpose: "External interface + job courier + credit sync",
  evo: PulseRole.evo
};

const AGENT_DIAGNOSTICS_ENABLED =
  (typeof G.PULSE_AGENT_DIAGNOSTICS === "boolean" && G.PULSE_AGENT_DIAGNOSTICS === true) ||
  (typeof G.PULSE_DIAGNOSTICS === "boolean" && G.PULSE_DIAGNOSTICS === true) ||
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
//  OUTER AGENT CLASS — External Negotiator (v9.3)
// ============================================================================
export class PulseProxyOuterAgent {
  constructor({ deviceId, gpuInfo, baseUrl }) {
    this.deviceId = deviceId;
    this.gpuInfo  = gpuInfo || null;

    this.baseUrl =
      baseUrl ||
      (typeof G.PULSE_PROXY_BASE_URL === "string" && G.PULSE_PROXY_BASE_URL) ||
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
