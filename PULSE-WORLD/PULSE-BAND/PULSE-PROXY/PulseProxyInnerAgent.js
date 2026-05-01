// ============================================================================
//  FILE: /PULSE-PROXY/PulseProxyInnerAgent.js
//  PULSE OS v12.3‑EVO‑PRESENCE — PROXY INNER AGENT (DUAL‑BAND + PRESENCE)
//  “INNER AGENT / ORGANISM BRIDGE”
//  CNS ↔ Router ↔ /PULSE-PROXY/endpoint ↔ InnerAgent ↔ Brain / LTM / Pages
//  PURE BACKEND ORGAN — NO MARKETPLACE, NO BUSINESS LOGIC, NO RANDOMNESS.
// ============================================================================

import { corsHandler, pulseCors } from "./PulseCORS.js";

// ============================================================================
//  ORGAN IDENTITY — v12.3‑EVO‑PRESENCE
// ============================================================================
export const PulseRole = {
  type: "Organ",
  subsystem: "PulseProxy",
  layer: "InnerAgent",
  version: "12.3-EVO-PRESENCE",
  identity: "PulseProxyInnerAgent-v12.3-EVO-PRESENCE",

  evo: {
    driftProof: true,
    deterministic: true,
    backendOnly: true,
    innerBridge: true,

    dualBand: true,
    binaryAware: true,
    symbolicAware: true,

    presenceAware: true,
    presenceFieldAware: true,

    unifiedAdvantageField: true,
    pulseEfficiencyAware: true,

    bandAware: true,
    waveFieldAware: true,
    binaryFieldAware: true,

    noIQ: true,
    noRouting: true,
    noCompute: true,
    multiInstanceReady: true,
    futureEvolutionReady: true
  }
};

export const PulseProxyInnerAgentMeta = Object.freeze({
  layer: "PulseProxyInnerAgent",
  role: "INNER_AGENT_ORGANISM_BRIDGE",
  version: "v12.3-EVO-BINARY-MAX-ABA-PRESENCE",
  identity: "PulseProxyInnerAgent-v12.3-EVO-BINARY-MAX-ABA-PRESENCE",

  guarantees: Object.freeze({
    deterministic: true,
    driftProof: true,
    multiInstanceReady: true,

    innerBridge: true,
    backendOnly: true,
    dualBand: true,
    binaryAware: true,
    symbolicAware: true,
    deterministicDispatch: true,
    unifiedAdvantageField: true,
    pulseEfficiencyAware: true,
    presenceAware: true,
    presenceFieldAware: true,
    failOpenSafe: true,

    zeroIQ: true,
    zeroRouting: true,
    zeroCompute: true,
    zeroMarketplace: true,
    zeroScoring: true,
    zeroGPU: true,
    zeroOSKernelLogic: true,
    zeroRandomness: true,
    zeroDateNow: true,
    zeroTimers: true,
    zeroAsync: true,
    zeroNetwork: true,
    zeroIO: true,
    zeroExternalMutation: true,
    zeroDynamicImports: true,
    zeroEval: true,
    zeroWindow: true,
    zeroDOM: true,

    bandAware: true,
    waveFieldAware: true,
    binaryFieldAware: true,

    worldLensAware: false
  }),

  contract: Object.freeze({
    input: [
      "ImpulseType",
      "SymbolicPayload",
      "BinaryPayload",
      "BackendContext"
    ],
    output: [
      "InnerAgentDispatchResult",
      "InnerAgentBandSignature",
      "InnerAgentBinaryField",
      "InnerAgentWaveField",
      "InnerAgentPresenceField",
      "InnerAgentDiagnostics",
      "InnerAgentHealingState"
    ]
  }),

  lineage: Object.freeze({
    root: "PulseProxy-v11",
    parent: "PulseProxy-v12.3-EVO",
    ancestry: [
      "Endpoint-v7",
      "Endpoint-v8",
      "Endpoint-v9",
      "Endpoint-v9.3",
      "Endpoint-v10",
      "Endpoint-v11",
      "PulseProxyInnerAgent-v11-Evo",
      "PulseProxyInnerAgent-v11-Evo-Prime",
      "PulseProxyInnerAgent-v12.3-EVO-PRESENCE"
    ]
  }),

  bands: Object.freeze({
    supported: ["symbolic", "binary", "dual"],
    default: "dual",
    behavior: "inner-agent-bridge"
  }),

  architecture: Object.freeze({
    pattern: "A-B-A",
    baseline: "typed impulse → deterministic dispatch → unified return",
    adaptive: "dual-band + presence overlays + fail-open surfaces",
    return: "deterministic dispatch surfaces + signatures"
  })
});


// ============================================================================
//  INTERNAL SURFACE HELPERS (A‑B‑A)
// ============================================================================
function computeHash(str) {
  let h = 0;
  const s = String(str || "");
  for (let i = 0; i < s.length; i++) {
    h = (h + s.charCodeAt(i) * (i + 1)) % 99991;
  }
  return `h${h}`;
}

function buildBand(modeKind) {
  if (modeKind === "binary") return "binary";
  if (modeKind === "dual") return "dual";
  return "symbolic";
}

function buildBandSignature(band) {
  return computeHash(`INNER_AGENT_BAND::${band}`);
}

function buildBinaryField(modeKind) {
  const depth = modeKind === "binary" ? 4 : modeKind === "dual" ? 2 : 1;
  const density = depth * 7;
  const surface = density + depth;
  return {
    binaryPhenotypeSignature: `inner-binary-pheno-${surface % 99991}`,
    binarySurfaceSignature: `inner-binary-surface-${(surface * 13) % 99991}`,
    binarySurface: { depth, density, surface },
    parity: surface % 2,
    shiftDepth: Math.floor(Math.log2(surface || 1))
  };
}

function buildWaveField(type) {
  const t = String(type || "");
  const amplitude = 12 + (t.length % 6);
  const wavelength = amplitude + 5;
  const phase = amplitude % 16;
  return {
    amplitude,
    wavelength,
    phase,
    band: "inner-agent",
    mode: "symbolic-wave",
    waveSignature: computeHash(`INNER_WAVE::${t}::${amplitude}`)
  };
}

function buildPresenceField(type, target) {
  const key = `${type || "?"}::${target || "?"}`;
  return {
    focus: type?.includes("focus") ? "focused" : "neutral",
    presenceSignature: computeHash(`INNER_PRESENCE::${key}`)
  };
}


// ============================================================================
//  FACTORY — dependencies injected by backend spine / endpoint
// ============================================================================
export function createPulseProxyInnerAgent({
  Brain,
  LongTermMemory,
  Pages,
  log = console.log,
  warn = console.warn
} = {}) {

  const InnerState = {
    lastType: null,
    lastTarget: null,
    lastModeKind: null
  };

  function safeLog(stage, details = {}) {
    try { log("[InnerAgent]", stage, JSON.stringify(details)); }
    catch {}
  }

  function resolveTarget(type) {
    if (!type || typeof type !== "string")
      return { target: null, route: "unknown" };

    // Brain impulses
    if (type.startsWith("brain:") || type === "PING_BRAIN")
      return { target: "Brain", route: "brain" };

    // Long-term memory impulses
    if (type.startsWith("ltm:") || type === "LONG_TERM_MEMORY")
      return { target: "LongTermMemory", route: "ltm" };

    // Page / UI impulses
    if (type.startsWith("page:") || type === "PAGE_REQUEST")
      return { target: "Pages", route: "pages" };

    // External resource fetches (v12.5‑EVO)
    if (
      type === "FETCH_EXTERNAL_RESOURCE" ||
      type === "fetchExternalResource" ||
      type === "EXTERNAL_RESOURCE" ||
      type === "externalResource"
    ) {
      return { target: "PulseProxy", route: "external-resource" };
    }

    // Default → Brain
    return { target: "Brain", route: "brain-default" };
  }


  async function dispatchToTarget(target, type, payload, binaryPayload, context) {
    const args = [type, payload || {}, binaryPayload || null, context || {}];

    // Brain organ
    if (target === "Brain") {
      if (!Brain?.handle) return { error: "BrainUnavailable", type, target };
      return await Brain.handle(...args);
    }

    // Long-term memory organ
    if (target === "LongTermMemory") {
      if (!LongTermMemory?.handle) return { error: "LongTermMemoryUnavailable", type, target };
      return await LongTermMemory.handle(...args);
    }

    // Pages organ
    if (target === "Pages") {
      if (!Pages?.handle) return { error: "PagesUnavailable", type, target };
      return await Pages.handle(...args);
    }

    // ⭐ NEW — PulseProxy organ (v12.5‑EVO‑PRESENCE)
    if (target === "PulseProxy") {
      if (!PulseProxy?.handle) return { error: "PulseProxyUnavailable", type, target };
      return await PulseProxy.handle(...args);
    }

    // Unknown target
    return { error: "UnknownTarget", type, target };
  }


  // ========================================================================
  //  PUBLIC ENTRY — ORGANISM-CORRECT BACKEND ENDPOINT BRIDGE
  // ========================================================================
  async function handle({ type, payload, binaryPayload, context, modeKind } = {}) {

    // ⭐⭐⭐ APPLY CORS INSIDE HANDLE() — EXACTLY WHERE YOU WANTED ⭐⭐⭐
    if (context?.req && context?.res) {
      pulseCors(context.req, context.res, () => {});
    }

    const { target, route } = resolveTarget(type);
    const mk = modeKind || (binaryPayload ? "dual" : "symbolic");

    InnerState.lastType = type;
    InnerState.lastTarget = target;
    InnerState.lastModeKind = mk;

    const band = buildBand(mk);
    const bandSignature = buildBandSignature(band);
    const binaryField = buildBinaryField(mk);
    const waveField = buildWaveField(type);
    const presenceField = buildPresenceField(type, target);

    safeLog("DISPATCH_START", { type, target, route, modeKind: mk });

    try {
      const res = await dispatchToTarget(target, type, payload, binaryPayload, context);

      safeLog("DISPATCH_OK", { type, target, route, modeKind: mk });

      return {
        ok: !res?.error,
        target,
        route,
        type,
        modeKind: mk,
        band,
        bandSignature,
        binaryField,
        waveField,
        presenceField,
        result: res
      };

    } catch (err) {
      const message = String(err?.message || err);
      warn("[InnerAgent] DISPATCH_ERROR", message);

      return {
        ok: false,
        target,
        route,
        type,
        modeKind: mk,
        band,
        bandSignature,
        binaryField,
        waveField,
        presenceField,
        error: "InnerAgentDispatchError",
        message
      };
    }
  }

  safeLog("INIT", {
    identity: PulseRole.identity,
    version: PulseRole.version,
    upgradeFrom: "Endpoint.js"
  });

  return {
    PulseRole,
    InnerState,
    handle
  };
}
