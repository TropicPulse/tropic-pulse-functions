// ============================================================================
//  PulseEarnReflexRouter-v11-Evo.js
//  Reflex → Earn Synapse (v11-Evo + Dual-Band A-B-A)
//  - No imports
//  - No routing, no sending
//  - Pure deterministic EarnReflex → Earn handoff
//  - Fully aligned with PulseOSGovernor v3.3 (instance slicing safe)
//  - Designed to run ONLY when explicitly called
//  - v11: Diagnostics + Signatures + Pattern Surface
//  - v11+ A-B-A: Dual-band + binary + wave (metadata-only, deterministic)
// ============================================================================
// ============================================================================
// ORGAN IDENTITY — v11‑EVO‑PRIME (Reflex → Earn Synapse)
// ============================================================================
export const PulseRole = {
  type: "Synapse",
  subsystem: "PulseEarnReflexRouter",
  layer: "B1-ReflexToEarn",
  version: "11.0-Evo-Prime",
  identity: "PulseEarnReflexRouter-v11-Evo-Prime",

  evo: {
    // Core invariants
    driftProof: true,
    deterministicField: true,
    unifiedAdvantageField: true,
    futureEvolutionReady: true,

    // Synapse laws
    zeroTiming: true,
    zeroState: false,            // local reflex state allowed
    zeroMutation: true,
    zeroCompute: true,
    zeroRouting: true,
    zeroSending: true,
    zeroAsync: true,
    zeroRandomness: true,

    // Reflex lineage
    reflexSynapse: true,
    reflexHandoffOnly: true,
    reflexDeterministic: true,
    reflexBandAware: true,
    reflexABASurface: true,

    // Band + metadata
    dualBand: true,
    binaryAware: true,
    symbolicAware: true,
    bandNormalizationAware: true,

    // Safety + environment
    environmentAgnostic: true,
    multiInstanceReady: true
  }
};
export const PulseEarnReflexRouterMeta = Object.freeze({
  layer: "PulseEarnReflexRouter",
  role: "EARN_REFLEX_ROUTER_ORGAN",
  version: "v11.2-EVO",
  identity: "PulseEarnReflexRouter-v11.2-EVO",

  guarantees: Object.freeze({
    deterministic: true,
    driftProof: true,
    noRandomness: true,
    noRealTime: true,
    noExternalIO: true,
    pureReflexSynapse: true,
    dualBandAware: true,
    binaryAware: true,
    waveFieldAware: true,
    healingMetadataAware: true,
    worldLensAware: false,

    // Reflex‑synapse laws
    reflexSynapse: true,
    reflexHandoffOnly: true,
    reflexDeterministic: true,
    reflexInstanceLaw: true,

    // Execution laws
    zeroRouting: true,
    zeroSending: true,
    zeroCompute: true,
    zeroAsync: true,
    zeroUserCode: true,
    zeroMutation: true,
    zeroTiming: true,

    // Environment
    multiInstanceReady: true,
    environmentAgnostic: true
  }),

  contract: Object.freeze({
    input: [
      "EarnReflexOrganism",
      "ReflexSliceContext",
      "DualBandContext"
    ],
    output: [
      "ReflexRouterHandoff",
      "ReflexRouterDiagnostics",
      "ReflexRouterSignatures",
      "ReflexRouterHealingState"
    ]
  }),

  lineage: Object.freeze({
    root: "PulseOS-v11-EVO",
    parent: "PulseEarn-v11.2-EVO",
    ancestry: [
      "PulseEarnReflexRouter-v9",
      "PulseEarnReflexRouter-v10",
      "PulseEarnReflexRouter-v11",
      "PulseEarnReflexRouter-v11-Evo",
      "PulseEarnReflexRouter-v11-Evo-Prime"
    ]
  }),

  bands: Object.freeze({
    supported: ["symbolic", "binary"],
    default: "symbolic",
    behavior: "metadata-only",
    priority: "symbolic-first"
  }),

  architecture: Object.freeze({
    pattern: "A-B-A",
    baseline: "deterministic reflex → Earn handoff",
    adaptive: "binary/wave surfaces + dual-band signatures",
    return: "deterministic EarnReflex handoff + router signatures"
  })
});


// ============================================================================
//  INTERNAL STATE — deterministic, drift-proof
// ============================================================================
const routedReflexes = new Map(); // reflexId -> state
let reflexRouteCycle = 0;         // deterministic cycle counter


// ============================================================================
//  INTERNAL HELPERS — deterministic, tiny, pure
// ============================================================================
function computeHash(str) {
  let h = 0;
  const s = String(str || "");
  for (let i = 0; i < s.length; i++) {
    h = (h + s.charCodeAt(i) * (i + 1)) % 100000;
  }
  return `h${h}`;
}

function normalizeBand(band) {
  const b = String(band || "symbolic").toLowerCase();
  return b === "binary" ? "binary" : "symbolic";
}

function getOrCreateReflexRouteState(reflexId) {
  let state = routedReflexes.get(reflexId);

  if (!state) {
    state = {
      reflexId,
      count: 0,
      firstSeenCycle: reflexRouteCycle,
      lastSeenCycle: null
    };
    routedReflexes.set(reflexId, state);
  }

  return state;
}


// ============================================================================
//  Dual-Band + Binary + Wave Builder (v11+ A-B-A)
// ============================================================================
function buildRouteBandBinaryWave(earnReflex, reflexId, cycleIndex) {
  const pattern = earnReflex?.pattern || "NO_PATTERN";
  const sourcePulseId = earnReflex?.meta?.sourcePulseId || "NO_SOURCE_PULSE";
  const sourceOrgan   = earnReflex?.meta?.sourceOrgan   || "NO_SOURCE_ORGAN";
  const sourceReason  = earnReflex?.meta?.sourceReason  || "NO_SOURCE_REASON";

  const band = normalizeBand(
    earnReflex?.meta?.band ||
    earnReflex?.band ||
    "symbolic"
  );

  const patternLen = String(pattern).length;
  const organLen   = String(sourceOrgan).length;
  const reasonLen  = String(sourceReason).length;
  const pulseLen   = String(sourcePulseId).length;

  const surface = patternLen + organLen + reasonLen + pulseLen + cycleIndex;

  const binaryField = {
    binaryRouteSignature: computeHash(`BREFLEX_ROUTE::${reflexId}::${surface}`),
    binarySurfaceSignature: computeHash(`BSURF_ROUTE::${surface}`),
    binarySurface: {
      patternLen,
      organLen,
      reasonLen,
      pulseLen,
      cycle: cycleIndex,
      surface
    },
    parity: surface % 2 === 0 ? 0 : 1,
    density: organLen + reasonLen + patternLen,
    shiftDepth: Math.max(0, Math.floor(Math.log2(surface || 1)))
  };

  const waveField = {
    amplitude: patternLen,
    wavelength: cycleIndex,
    phase: (patternLen + organLen + reasonLen + cycleIndex) % 8,
    band,
    mode: band === "binary" ? "compression-wave" : "symbolic-wave"
  };

  const bandSignature = computeHash(`BAND::REFLEX_ROUTE::${band}::${cycleIndex}`);

  return {
    band,
    bandSignature,
    binaryField,
    waveField
  };
}


// ============================================================================
//  Diagnostics Builder (v11-Evo + A-B-A)
// ============================================================================
function buildReflexDiagnostics(earnReflex, reflexId, state) {
  const pattern = earnReflex?.pattern || "NO_PATTERN";
  const lineageDepth = Array.isArray(earnReflex?.lineage)
    ? earnReflex.lineage.length
    : 0;

  const sourcePulseId = earnReflex?.meta?.sourcePulseId || "NO_SOURCE_PULSE";
  const sourceOrgan   = earnReflex?.meta?.sourceOrgan   || "NO_SOURCE_ORGAN";
  const sourceReason  = earnReflex?.meta?.sourceReason  || "NO_SOURCE_REASON";

  const base = {
    reflexId,
    pattern,
    lineageDepth,
    sourcePulseId,
    sourceOrgan,
    sourceReason,
    cycleIndex: reflexRouteCycle,

    patternHash: computeHash(pattern),
    lineageHash: computeHash(String(lineageDepth)),
    sourceHash: computeHash(sourcePulseId + "::" + sourceOrgan),
    reflexHash: computeHash(reflexId),
    cycleHash: computeHash(String(reflexRouteCycle)),

    instanceCount: state.count,
    firstSeenCycle: state.firstSeenCycle,
    lastSeenCycle: state.lastSeenCycle
  };

  const bandPack = buildRouteBandBinaryWave(
    earnReflex,
    reflexId,
    base.cycleIndex
  );

  return {
    ...base,
    band: bandPack.band,
    bandSignature: bandPack.bandSignature,
    binaryField: bandPack.binaryField,
    waveField: bandPack.waveField
  };
}


// ============================================================================
//  PUBLIC API — PulseEarnReflexRouter v11-Evo + Dual-Band A-B-A
// ============================================================================
export const PulseEarnReflexRouter = {

  /**
   * route(earnReflex, EarnSystem)
   * - earnReflex: the organism built by PulseEarnReflex
   * - EarnSystem: the frontend Earn engine (PulseEarn)
   */
  route(earnReflex, EarnSystem) {
    reflexRouteCycle++;

    if (!earnReflex || !earnReflex.meta?.reflex) {
      return {
        ok: false,
        reason: "invalid_reflex",
        reflex: earnReflex
      };
    }

    const reflexId =
      earnReflex.meta.reflexId ||
      `${earnReflex.meta.sourcePulseId}::${earnReflex.meta.sourceOrgan}::${earnReflex.meta.sourceReason}`;

    const state = getOrCreateReflexRouteState(reflexId);
    state.count += 1;
    state.lastSeenCycle = reflexRouteCycle;

    const diagnostics = buildReflexDiagnostics(earnReflex, reflexId, state);

    // v11+ A-B-A reflexRouteSignature (band-aware, deterministic)
    const reflexRouteSignature = computeHash(
      diagnostics.pattern +
      "::" +
      diagnostics.reflexId +
      "::" +
      diagnostics.cycleIndex +
      "::" +
      diagnostics.band
    );

    // If EarnSystem is missing or not ready, fail-open (immune-safe)
    if (!EarnSystem || typeof EarnSystem.handle !== "function") {
      return {
        ok: false,
        reason: "earn_system_unavailable",
        reflexId,
        state,
        diagnostics,
        reflexRouteSignature
      };
    }

    // -----------------------------------------------------------------------
    //  SAFE HANDOFF (v11-Evo):
    //  - No routing
    //  - No sending
    //  - No returnTo
    //  - No lineage mutation
    //  - No async
    //  - Pure EarnSystem.handle() call
    // -----------------------------------------------------------------------
    try {
      const result = EarnSystem.handle(earnReflex, {
        reflex: true,
        reflexId,
        state,
        instanceContext: earnReflex.meta.instanceContext || null,
        cycleIndex: reflexRouteCycle,
        diagnostics,
        reflexRouteSignature
      });

      return {
        ok: true,
        routed: true,
        reflexId,
        state,
        diagnostics,
        reflexRouteSignature,
        result
      };
    } catch (error) {
      return {
        ok: false,
        routed: false,
        reflexId,
        state,
        diagnostics,
        reflexRouteSignature,
        error
      };
    }
  },

  // -------------------------------------------------------------------------
  //  Debug / Dashboard
  // -------------------------------------------------------------------------
  getRoutedState(reflexId) {
    if (reflexId) return routedReflexes.get(reflexId) || null;
    return Array.from(routedReflexes.values());
  }
};
