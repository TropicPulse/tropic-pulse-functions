// ============================================================================
//  PULSE OS v11 — PROXY OUTER AGENT
//  “THE OUTER AGENT / EXTERNAL NEGOTIATOR”
//  External Interface • Job Courier • Device Ambassador
//  PURE NEGOTIATION. NO MARKETPLACE LOGIC. NO OS STATE MUTATION.
//  DUAL‑MODE: Binary Core (pure descriptors) + Symbolic Wrapper (fetch + logs)
// ============================================================================


// ============================================================================
//  GLOBAL WIRING — v11 (Safe, boundary‑first, no hard global dependency)
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
//  ORGAN IDENTITY — v11
// ============================================================================
export const PulseRole = {
  type: "Organ",
  subsystem: "PulseProxy",
  layer: "OuterAgent",
  version: "11.0",
  identity: "PulseProxyOuterAgent",

  evo: {
    driftProof: true,
    deterministic: true,
    boundaryOrgan: true,
    externalNegotiator: true,
    marketplaceBoundary: true,
    backendPreferred: true,

    dualModeEvolution: true,       // binary + symbolic
    binaryFirst: true,             // descriptors first, IO second

    noIQ: true,
    noRouting: true,
    noCompute: true,               // no business logic
    multiInstanceReady: true,
    unifiedAdvantageField: true,
    pulseEfficiencyAware: true,
    futureEvolutionReady: true
  }
};


// ============================================================================
//  LAYER CONSTANTS + CONTEXT (v11)
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

agentLog("AGENT_INIT_V11");


// ============================================================================
//  BINARY CORE — v11
//  Pure, deterministic, no fetch, no JSON, no timestamps.
//  Only builds request descriptors for the symbolic layer.
// ============================================================================

function buildBaseUrlBinary(envBaseUrl) {
  if (typeof envBaseUrl === "string" && envBaseUrl) return envBaseUrl;
  if (typeof G.PULSE_PROXY_BASE_URL === "string" && G.PULSE_PROXY_BASE_URL) {
    return G.PULSE_PROXY_BASE_URL;
  }
  return "https://www.tropicpulse.bz/proxy";
}

function buildRegisterDescriptorBinary(deviceId, gpuInfo, baseUrl) {
  const url = String(baseUrl) + "/registerDevice";
  const body = {
    deviceId: deviceId ?? null,
    gpuInfo: gpuInfo ?? null
  };

  return {
    stage: "REGISTER",
    url,
    options: {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    }
  };
}

function buildRequestJobDescriptorBinary(deviceId, baseUrl) {
  const encodedId = encodeURIComponent(String(deviceId ?? ""));
  const url = String(baseUrl) + "/getJob?deviceId=" + encodedId;

  return {
    stage: "REQUEST_JOB",
    url,
    options: {}
  };
}

function buildSubmitResultDescriptorBinary(deviceId, jobId, result, baseUrl) {
  const url = String(baseUrl) + "/submitJob";
  const body = {
    deviceId: deviceId ?? null,
    jobId: jobId ?? null,
    result
  };

  return {
    stage: "SUBMIT_RESULT",
    url,
    options: {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    }
  };
}

function buildSyncCreditsDescriptorBinary(deviceId, baseUrl) {
  const encodedId = encodeURIComponent(String(deviceId ?? ""));
  const url = String(baseUrl) + "/syncCredits?deviceId=" + encodedId;

  return {
    stage: "SYNC_CREDITS",
    url,
    options: {}
  };
}

export const PulseProxyOuterAgentBinary = {
  buildBaseUrl: buildBaseUrlBinary,
  buildRegisterDescriptor: buildRegisterDescriptorBinary,
  buildRequestJobDescriptor: buildRequestJobDescriptorBinary,
  buildSubmitResultDescriptor: buildSubmitResultDescriptorBinary,
  buildSyncCreditsDescriptor: buildSyncCreditsDescriptorBinary,
  meta: { ...PROXY_OUTER_AGENT_CONTEXT, mode: "binary-core" }
};


// ============================================================================
//  SYMBOLIC WRAPPER — v11
//  Uses binary descriptors + fetchFn + diagnostics.
//  No OS state mutation, no marketplace logic.
// ============================================================================

async function doFetchSymbolic(descriptor) {
  const { url, options, stage } = descriptor;

  if (!fetchFn) {
    const msg = "fetch not available in this runtime";
    agentLog(stage + "_NO_FETCH", { url, error: msg });
    return { error: true, message: msg };
  }

  try {
    const res = await fetchFn(url, options || {});
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


// ============================================================================
//  OUTER AGENT CLASS — External Negotiator (v11)
//  Instance fields are boundary‑local, no global mutation.
// ============================================================================
export class PulseProxyOuterAgent {
  constructor({ deviceId, gpuInfo, baseUrl } = {}) {
    this.deviceId = deviceId ?? null;
    this.gpuInfo  = gpuInfo || null;
    this.baseUrl  = buildBaseUrlBinary(baseUrl);

    agentLog("AGENT_CONSTRUCTED_V11", {
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

  // REGISTER DEVICE — Introduce identity outward
  async register() {
    const descriptor = buildRegisterDescriptorBinary(
      this.deviceId,
      this.gpuInfo,
      this.baseUrl
    );

    agentLog(descriptor.stage + "_START", {
      deviceId: this.deviceId
    });

    const json = await doFetchSymbolic(descriptor);

    agentLog(
      json?.error ? descriptor.stage + "_FAIL" : descriptor.stage + "_SUCCESS",
      { deviceId: this.deviceId, response: json }
    );

    return json;
  }

  // REQUEST JOB — Ask the outside world for work
  async requestJob() {
    const descriptor = buildRequestJobDescriptorBinary(
      this.deviceId,
      this.baseUrl
    );

    agentLog(descriptor.stage + "_START", {
      deviceId: this.deviceId
    });

    const json = await doFetchSymbolic(descriptor);

    agentLog(
      json?.error ? descriptor.stage + "_FAIL" : descriptor.stage + "_SUCCESS",
      { deviceId: this.deviceId, response: json }
    );

    return json;
  }

  // SUBMIT RESULT — Hand completed work back outward
  async submitResult(jobId, result) {
    const descriptor = buildSubmitResultDescriptorBinary(
      this.deviceId,
      jobId,
      result,
      this.baseUrl
    );

    agentLog(descriptor.stage + "_START", {
      deviceId: this.deviceId,
      jobId
    });

    const json = await doFetchSymbolic(descriptor);

    agentLog(
      json?.error ? descriptor.stage + "_FAIL" : descriptor.stage + "_SUCCESS",
      { deviceId: this.deviceId, jobId, response: json }
    );

    return json;
  }

  // SYNC CREDITS — Exchange tokens with the outside world
  async syncCredits() {
    const descriptor = buildSyncCreditsDescriptorBinary(
      this.deviceId,
      this.baseUrl
    );

    agentLog(descriptor.stage + "_START", {
      deviceId: this.deviceId
    });

    const json = await doFetchSymbolic(descriptor);

    agentLog(
      json?.error ? descriptor.stage + "_FAIL" : descriptor.stage + "_SUCCESS",
      { deviceId: this.deviceId, response: json }
    );

    return json;
  }
}


// ============================================================================
//  EXPORTED META — SAFE FOR INTROSPECTION
// ============================================================================
export const PULSE_PROXY_OUTER_AGENT_META = { ...PROXY_OUTER_AGENT_CONTEXT };
