// ============================================================================
//  FILE: /PULSE-PROXY/PulseProxyInnerAgent-v16-Immortal-Bridge.js
//  PULSE OS v16.3‑IMMORTAL‑BRIDGE — PROXY INNER AGENT (DUAL‑BAND + PRESENCE)
//  “INNER AGENT / ORGANISM BRIDGE”
//  CNS ↔ Router ↔ /PULSE-PROXY/endpoint ↔ InnerAgent ↔ Brain / LTM / Pages
//  PURE BACKEND ORGAN — NO INTERNET FETCH, NO MARKETPLACE, NO BUSINESS LOGIC.
//  INTERNET IS ALWAYS BEAMED VIA EXPANSION / OUTER AGENT, NEVER FROM HERE.
// ============================================================================

/*
AI_EXPERIENCE_META = {
  identity: "PulseProxyInnerAgent",
  version: "v16.3-Immortal-Bridge",
  layer: "inner_agent",
  role: "organism_bridge_dual_band",
  lineage: {
    root: "PulseProxy-v11",
    parent: "PulseProxyInnerAgent-v12.3-Evo-Presence",
    organismIntegration: "v16-Immortal"
  },

  evo: {
    // Core
    deterministic: true,
    driftProof: true,
    immortalReady: true,
    immortalBridge: true,
    backendOnly: true,
    innerBridge: true,
    multiInstanceReady: true,

    // Bands
    dualBand: true,
    binaryAware: true,
    symbolicAware: true,
    bandAware: true,
    waveFieldAware: true,
    binaryFieldAware: true,

    // Presence / Advantage / Speed / Experience
    presenceAware: true,
    presenceFieldAware: true,
    unifiedAdvantageField: true,
    pulseEfficiencyAware: true,
    advantageFieldAware: true,
    speedFieldAware: true,
    experienceFieldAware: true,
    healingStateAware: true,

    // Cascades
    presenceCascadeAware: true,
    advantageCascadeAware: true,
    speedCascadeAware: true,
    proxySpineAware: true,
    outerAgentAware: true,
    impulseReturnAware: true,
    chunkCachePrewarmAware: true,

    // Safety
    zeroRandomness: true,
    zeroNetwork: true,          // NO INTERNET HERE
    zeroFilesystem: true,
    zeroDynamicImports: true,
    zeroEval: true,
    zeroExternalMutation: true,
    zeroWindow: true,
    zeroDOM: true
  },

  contract: {
    input: [
      "ImpulseType",
      "SymbolicPayload",
      "BinaryPayload",
      "BackendContext",
      "OuterAgentContext",
      "ProxySpineContext"
    ],
    output: [
      "InnerAgentDispatchResult",
      "InnerAgentBandSignature",
      "InnerAgentBinaryField",
      "InnerAgentWaveField",
      "InnerAgentPresenceField",
      "InnerAgentSpeedField",
      "InnerAgentAdvantageField",
      "InnerAgentExperienceField",
      "InnerAgentPrewarmHints",
      "InnerAgentDiagnostics",
      "InnerAgentHealingState"
    ],
    consumers: [
      "Brain",
      "LongTermMemory",
      "Pages",
      "PulseProxySpine",
      "PulseProxyOuterAgent",
      "PNSRepair",
      "PNSPurifier",
      "PulseWorldCore"
    ]
  },

  experience: {
    description:
      "The v16.3 Immortal Inner Agent is the organism bridge between CNS, Router, " +
      "ProxySpine, OuterAgent, Brain, LongTermMemory, and Pages. It does not fetch " +
      "internet itself; instead it beams impulses upward to Expansion/OuterAgent and " +
      "receives negotiated results back, while maintaining dual-band, presence, " +
      "advantage, speed, and experience fields for every dispatch.",
    aiUsageHint:
      "Use InnerAgentSpeedField, InnerAgentAdvantageField, and InnerAgentExperienceField " +
      "to reason about how quickly impulses are being dispatched inward, how much " +
      "advantage is being propagated from ProxySpine/OuterAgent, and how loaded the " +
      "bridge is across Brain/LTM/Pages routes."
  }
};
*/

import { corsHandler, pulseCors } from "./PulseCORS.js";

// ============================================================================
//  ORGAN IDENTITY — v16.3‑IMMORTAL‑BRIDGE
// ============================================================================
export const PulseRole = {
  type: "Organ",
  subsystem: "PulseProxy",
  layer: "InnerAgent",
  version: "16.3-Immortal-Bridge",
  identity: "PulseProxyInnerAgent-v16.3-Immortal-Bridge",

  evo: {
    driftProof: true,
    deterministic: true,
    backendOnly: true,
    innerBridge: true,

    immortalReady: true,
    immortalBridge: true,
    multiInstanceReady: true,

    dualBand: true,
    binaryAware: true,
    symbolicAware: true,

    presenceAware: true,
    presenceFieldAware: true,

    unifiedAdvantageField: true,
    pulseEfficiencyAware: true,
    advantageFieldAware: true,
    speedFieldAware: true,
    experienceFieldAware: true,
    healingStateAware: true,

    bandAware: true,
    waveFieldAware: true,
    binaryFieldAware: true,

    presenceCascadeAware: true,
    advantageCascadeAware: true,
    speedCascadeAware: true,
    proxySpineAware: true,
    outerAgentAware: true,
    impulseReturnAware: true,
    chunkCachePrewarmAware: true,

    noIQ: true,
    noRouting: true,
    noCompute: true,
    futureEvolutionReady: true
  }
};

export const AI_EXPERIENCE_META = Object.freeze({
  identity: "PulseProxyInnerAgent",
  version: "v16.3-Immortal-Bridge",
  layer: "inner_agent",
  role: "organism_bridge_dual_band",
  lineage: Object.freeze({
    root: "PulseProxy-v16",
    parent: "PulseProxyInnerAgent-v16",
    organismIntegration: "v16-Immortal"
  }),
  evo: Object.freeze(PulseRole.evo),
  contract: Object.freeze({
    input: [
      "ImpulseType",
      "SymbolicPayload",
      "BinaryPayload",
      "BackendContext",
      "OuterAgentContext",
      "ProxySpineContext"
    ],
    output: [
      "InnerAgentDispatchResult",
      "InnerAgentBandSignature",
      "InnerAgentBinaryField",
      "InnerAgentWaveField",
      "InnerAgentPresenceField",
      "InnerAgentSpeedField",
      "InnerAgentAdvantageField",
      "InnerAgentExperienceField",
      "InnerAgentPrewarmHints",
      "InnerAgentDiagnostics",
      "InnerAgentHealingState"
    ],
    consumers: [
      "Brain",
      "LongTermMemory",
      "Pages",
      "PulseProxySpine",
      "PulseProxyOuterAgent",
      "PNSRepair",
      "PNSPurifier",
      "PulseWorldCore"
    ]
  }),
  experience: Object.freeze({
    description:
      "The v16.3 Immortal Inner Agent is the organism bridge between CNS, Router, " +
      "ProxySpine, OuterAgent, Brain, LongTermMemory, and Pages. It does not fetch " +
      "internet itself; instead it beams impulses upward to Expansion/OuterAgent and " +
      "receives negotiated results back, while maintaining dual-band, presence, " +
      "advantage, speed, and experience fields for every dispatch.",
    aiUsageHint:
      "Use InnerAgentSpeedField, InnerAgentAdvantageField, and InnerAgentExperienceField " +
      "to reason about how quickly impulses are being dispatched inward, how much " +
      "advantage is being propagated from ProxySpine/OuterAgent, and how loaded the " +
      "bridge is across Brain/LTM/Pages routes."
  })
});

export const PulseProxyInnerAgentMeta = Object.freeze({
  layer: "PulseProxyInnerAgent",
  role: "INNER_AGENT_ORGANISM_BRIDGE",
  version: "v16.3-Immortal-Bridge",
  identity: "PulseProxyInnerAgent-v16.3-Immortal-Bridge",

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
    advantageFieldAware: true,
    speedFieldAware: true,
    experienceFieldAware: true,
    healingStateAware: true,
    failOpenSafe: true,

    presenceCascadeAware: true,
    advantageCascadeAware: true,
    speedCascadeAware: true,
    proxySpineAware: true,
    outerAgentAware: true,
    impulseReturnAware: true,
    chunkCachePrewarmAware: true,

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
    zeroNetwork: true,          // NO INTERNET HERE
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

  contract: Object.freeze(AI_EXPERIENCE_META.contract),

  lineage: Object.freeze({
    root: "PulseProxy-v11",
    parent: "PulseProxy-v16-Immortal",
    ancestry: [
      "Endpoint-v7",
      "Endpoint-v8",
      "Endpoint-v9",
      "Endpoint-v9.3",
      "Endpoint-v10",
      "Endpoint-v11",
      "PulseProxyInnerAgent-v11-Evo",
      "PulseProxyInnerAgent-v11-Evo-Prime",
      "PulseProxyInnerAgent-v12.3-Evo-Presence",
      "PulseProxyInnerAgent-v16.3-Immortal-Bridge"
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
    adaptive:
      "dual-band + presence/advantage/speed cascades + proxySpine/outerAgent overlays " +
      "+ fail-open surfaces",
    return:
      "deterministic dispatch surfaces + signatures + speed/advantage/experience fields"
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

function buildPresenceField(type, target, outerPresence, proxyPresence) {
  const key = `${type || "?"}::${target || "?"}`;
  const baseSignature = computeHash(`INNER_PRESENCE::${key}`);
  const outerSig = outerPresence?.presenceSignature || null;
  const proxySig = proxyPresence?.presenceSignature || null;

  const focus =
    type?.includes("focus") || target === "Pages"
      ? "focused"
      : "neutral";

  return {
    focus,
    presenceSignature: baseSignature,
    outerPresenceSignature: outerSig,
    proxyPresenceSignature: proxySig
  };
}

// v16.3 — speed / advantage / experience / prewarm

function buildSpeedField({ outerSpeed, proxySpeed, route }) {
  const o = outerSpeed?.speedScore ?? 0;
  const p = proxySpeed?.speedScore ?? 0;
  const base = (o + p) / (o || p ? 2 : 1 || 1);
  let routeWeight = 0.5;
  if (route === "brain" || route === "brain-default") routeWeight = 0.7;
  if (route === "ltm") routeWeight = 0.6;
  if (route === "pages") routeWeight = 0.8;

  const speedScore = Math.min(1, base * routeWeight);
  let speedBand = "steady";
  if (speedScore < 0.25) speedBand = "slow";
  else if (speedScore < 0.6) speedBand = "steady";
  else speedBand = "quickened";

  return {
    outerSpeedScore: o,
    proxySpeedScore: p,
    route,
    speedScore,
    speedBand,
    speedSignature: computeHash(
      `INNER_SPEED::${route}::${o}::${p}::${speedScore}::${speedBand}`
    )
  };
}

function buildAdvantageField({ outerAdvantage, proxyAdvantage, route }) {
  const oa = outerAdvantage?.advantageScore ?? 0;
  const pa = proxyAdvantage?.advantageScore ?? 0;
  const combined = (oa + pa) / (oa || pa ? 2 : 1 || 1);

  let routeBias = 0.5;
  if (route === "brain" || route === "brain-default") routeBias = 0.7;
  if (route === "ltm") routeBias = 0.8;
  if (route === "pages") routeBias = 0.6;

  const advantageScore = Math.min(1, combined * routeBias);

  return {
    outerAdvantageScore: oa,
    proxyAdvantageScore: pa,
    route,
    advantageScore,
    advantageSignature: computeHash(
      `INNER_ADVANTAGE::${route}::${oa}::${pa}::${advantageScore}`
    )
  };
}

function buildExperienceField({ route, band, speedBand, loadHint }) {
  const r = route || "unknown";
  const b = band || "symbolic";
  const s = speedBand || "steady";
  const load = loadHint || "normal";

  return {
    route: r,
    band: b,
    speedBand: s,
    load,
    experienceSignature: computeHash(
      `INNER_EXPERIENCE::${r}::${b}::${s}::${load}`
    )
  };
}

function buildPrewarmHints({ route, band, speedBand }) {
  const hints = [];

  if (route === "pages") {
    hints.push("prewarm_page_cache");
    hints.push("prewarm_chunk_cache");
  }
  if (route === "brain" || route === "brain-default") {
    hints.push("prewarm_brain_routes");
  }
  if (route === "ltm") {
    hints.push("prewarm_ltm_index");
  }

  if (speedBand === "quickened") {
    hints.push("prioritize_low_latency_paths");
  }

  if (band === "binary") {
    hints.push("prewarm_binary_field");
  } else if (band === "dual") {
    hints.push("prewarm_dual_band_overlay");
  } else {
    hints.push("prewarm_symbolic_surface");
  }

  return {
    route,
    band,
    speedBand,
    hints,
    prewarmSignature: computeHash(
      `INNER_PREWARM::${route}::${band}::${speedBand}::${hints.join("|")}`
    )
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
    lastRoute: null,
    lastModeKind: null,
    lastBand: null,
    lastSpeedField: null,
    lastAdvantageField: null,
    lastExperienceField: null,
    lastHealingState: null,
    cycle: 0
  };

  function safeLog(stage, details = {}) {
    try { log("[InnerAgent-v16.3]", stage, JSON.stringify(details)); }
    catch {}
  }

  function resolveTarget(type) {
    if (!type || typeof type !== "string")
      return { target: null, route: "unknown" };

    if (type.startsWith("brain:") || type === "PING_BRAIN")
      return { target: "Brain", route: "brain" };

    if (type.startsWith("ltm:") || type === "LONG_TERM_MEMORY")
      return { target: "LongTermMemory", route: "ltm" };

    if (type.startsWith("page:") || type === "PAGE_REQUEST")
      return { target: "Pages", route: "pages" };

    if (
      type === "FETCH_EXTERNAL_RESOURCE" ||
      type === "fetchExternalResource" ||
      type === "EXTERNAL_RESOURCE" ||
      type === "externalResource"
    ) {
      // still routed via PulseProxy/OuterAgent above this layer, not here
      return { target: "Brain", route: "brain-external-proxy" };
    }

    return { target: "Brain", route: "brain-default" };
  }

  async function dispatchToTarget(target, type, payload, binaryPayload, context) {
    const args = [type, payload || {}, binaryPayload || null, context || {}];

    if (target === "Brain") {
      if (!Brain?.handle) return { error: "BrainUnavailable", type, target };
      return await Brain.handle(...args);
    }

    if (target === "LongTermMemory") {
      if (!LongTermMemory?.handle) return { error: "LongTermMemoryUnavailable", type, target };
      return await LongTermMemory.handle(...args);
    }

    if (target === "Pages") {
      if (!Pages?.handle) return { error: "PagesUnavailable", type, target };
      return await Pages.handle(...args);
    }

    return { error: "UnknownTarget", type, target };
  }


  // ========================================================================
  //  PUBLIC ENTRY — ORGANISM-CORRECT BACKEND ENDPOINT BRIDGE
  // ========================================================================
  async function handle({
    type,
    payload,
    binaryPayload,
    context,
    modeKind,
    outerAgentContext,
    proxySpineContext
  } = {}) {

    // CORS at the boundary (unchanged behavior)
    if (context?.req && context?.res) {
      pulseCors(context.req, context.res, () => {});
    }

    const { target, route } = resolveTarget(type);
    const mk = modeKind || (binaryPayload ? "dual" : "symbolic");

    InnerState.cycle += 1;
    InnerState.lastType = type;
    InnerState.lastTarget = target;
    InnerState.lastRoute = route;
    InnerState.lastModeKind = mk;

    const band = buildBand(mk);
    const bandSignature = buildBandSignature(band);
    const binaryField = buildBinaryField(mk);
    const waveField = buildWaveField(type);

    const outerPresence = outerAgentContext?.presenceField || null;
    const proxyPresence = proxySpineContext?.presenceField || null;

    const presenceField = buildPresenceField(
      type,
      target,
      outerPresence,
      proxyPresence
    );

    const outerSpeed = outerAgentContext?.speedField || null;
    const proxySpeed = proxySpineContext?.speedField || null;
    const speedField = buildSpeedField({ outerSpeed, proxySpeed, route });

    const outerAdvantage = outerAgentContext?.advantageField || null;
    const proxyAdvantage = proxySpineContext?.advantageField || null;
    const advantageField = buildAdvantageField({
      outerAdvantage,
      proxyAdvantage,
      route
    });

    const loadHint =
      context?.loadHint ||
      (route === "pages" ? "ui" : route === "ltm" ? "memory" : "normal");

    const experienceField = buildExperienceField({
      route,
      band,
      speedBand: speedField.speedBand,
      loadHint
    });

    const prewarmHints = buildPrewarmHints({
      route,
      band,
      speedBand: speedField.speedBand
    });

    const healingState = {
      cycle: InnerState.cycle,
      lastType: InnerState.lastType,
      lastTarget: InnerState.lastTarget,
      lastRoute: InnerState.lastRoute,
      lastBand: band,
      lastSpeedScore: speedField.speedScore,
      lastAdvantageScore: advantageField.advantageScore,
      lastLoad: experienceField.load
    };

    InnerState.lastBand = band;
    InnerState.lastSpeedField = speedField;
    InnerState.lastAdvantageField = advantageField;
    InnerState.lastExperienceField = experienceField;
    InnerState.lastHealingState = healingState;

    safeLog("DISPATCH_START", {
      type,
      target,
      route,
      modeKind: mk,
      band,
      speedScore: speedField.speedScore,
      advantageScore: advantageField.advantageScore,
      load: experienceField.load
    });

    try {
      const res = await dispatchToTarget(
        target,
        type,
        payload,
        binaryPayload,
        {
          ...context,
          innerAgentBand: band,
          innerAgentSpeedField: speedField,
          innerAgentAdvantageField: advantageField,
          innerAgentExperienceField: experienceField,
          innerAgentPrewarmHints: prewarmHints
        }
      );

      safeLog("DISPATCH_OK", {
        type,
        target,
        route,
        modeKind: mk
      });

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
        speedField,
        advantageField,
        experienceField,
        prewarmHints,
        healingState,
        result: res
      };

    } catch (err) {
      const message = String(err?.message || err);
      warn("[InnerAgent-v16.3] DISPATCH_ERROR", message);

      const errorHealingState = {
        ...healingState,
        lastError: message
      };
      InnerState.lastHealingState = errorHealingState;

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
        speedField,
        advantageField,
        experienceField,
        prewarmHints,
        healingState: errorHealingState,
        error: "InnerAgentDispatchError",
        message
      };
    }
  }

  safeLog("INIT", {
    identity: PulseRole.identity,
    version: PulseRole.version,
    upgradeFrom: "PulseProxyInnerAgent-v12.3-Evo-Presence"
  });

  return {
    PulseRole,
    InnerState,
    handle
  };
}
