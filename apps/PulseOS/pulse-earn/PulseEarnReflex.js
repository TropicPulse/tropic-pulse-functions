// ============================================================================
//  PulseEarnReflex-v11-Evo.js
//  Side-Attached Earn Reflex (v11-Evo + Dual-Band A-B-A)
//  - No imports
//  - No sending, no routing
//  - Pure deterministic reflex builder
//  - Fully aligned with PulseOSGovernor v3.3 (dynamic slicing safe)
//  - v11: Diagnostics + Signatures + Pattern Surface
//  - v11+ A-B-A: Dual-band + binary + wave (metadata-only, deterministic)
// ============================================================================

// ============================================================================
// ORGAN IDENTITY — v11‑EVO‑PRIME (B1 Sub‑Healer Reflex Arc)
// ============================================================================
export const PulseRole = {
  type: "Reflex",
  subsystem: "PulseEarnReflex",
  layer: "B1-SubHealerReflexArc",
  version: "11.0-Evo-Prime",
  identity: "PulseEarnReflex-v11-Evo-Prime",

  evo: {
    // Core invariants
    driftProof: true,
    deterministicField: true,
    unifiedAdvantageField: true,
    futureEvolutionReady: true,

    // Reflex laws
    reflexArc: true,
    reflexDeterministic: true,
    reflexHandoffOnly: true,
    reflexInstanceLaw: true,
    reflexABASurface: true,
    reflexBandAware: true,

    // Execution laws
    zeroRouting: true,
    zeroSending: true,
    zeroCompute: true,
    zeroAsync: true,
    zeroRandomness: true,
    zeroMutation: true,
    zeroTiming: true,

    // Local state allowed (reflex instance tracking)
    zeroState: false,

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

// ============================================================================
// INTERNAL STATE — deterministic, drift-proof
// ============================================================================
const reflexInstances = new Map(); // reflexId -> state
let reflexCycle = 0;               // deterministic cycle counter


// ============================================================================
// HELPERS — deterministic, tiny, pure
// ============================================================================
function computeHash(str) {
  let h = 0;
  const s = String(str || "");
  for (let i = 0; i < s.length; i++) {
    h = (h + s.charCodeAt(i) * (i + 1)) % 100000;
  }
  return `h${h}`;
}

function getPulseId(pulseOrImpulse) {
  return (
    pulseOrImpulse?.pulseId ||
    pulseOrImpulse?.id ||
    pulseOrImpulse?.tickId ||
    pulseOrImpulse?.jobId ||
    "UNKNOWN_PULSE"
  );
}

function getOrgan(event) {
  return event.organ || event.module || "UNKNOWN_ORGAN";
}

function getReason(event) {
  return event.reason || "unknown_reason";
}

function normalizeBand(band) {
  const b = String(band || "symbolic").toLowerCase();
  return b === "binary" ? "binary" : "symbolic";
}


// ============================================================================
// REFLEX IDENTITY (v11-Evo)
// ============================================================================
function getReflexId(event, pulseOrImpulse) {
  const pulseId = getPulseId(pulseOrImpulse);
  const organ   = getOrgan(event);
  const reason  = getReason(event);
  return `${pulseId}::${organ}::${reason}`;
}


// ============================================================================
// Dual-Band + Binary + Wave Builder (v11+ A-B-A)
// ============================================================================
function buildReflexBandBinaryWave(event, pulseOrImpulse, reflexId, cycleIndex) {
  const pulseId = getPulseId(pulseOrImpulse);
  const organ   = getOrgan(event);
  const reason  = getReason(event);

  const band = normalizeBand(
    event.band ||
    pulseOrImpulse?.band ||
    pulseOrImpulse?.meta?.band ||
    "symbolic"
  );

  const pulseLen = String(pulseId).length;
  const organLen = String(organ).length;
  const reasonLen = String(reason).length;

  const surface = pulseLen + organLen + reasonLen + cycleIndex;

  const binaryField = {
    binaryReflexSignature: computeHash(`BREFLEX::${reflexId}::${surface}`),
    binarySurfaceSignature: computeHash(`BSURF_REFLEX::${surface}`),
    binarySurface: {
      pulseLen,
      organLen,
      reasonLen,
      cycle: cycleIndex,
      surface
    },
    parity: surface % 2 === 0 ? 0 : 1,
    density: organLen + reasonLen,
    shiftDepth: Math.max(0, Math.floor(Math.log2(surface || 1)))
  };

  const waveField = {
    amplitude: organLen,
    wavelength: cycleIndex,
    phase: (organLen + reasonLen + cycleIndex) % 8,
    band,
    mode: band === "binary" ? "compression-wave" : "symbolic-wave"
  };

  const bandSignature = computeHash(`BAND::REFLEX::${band}::${cycleIndex}`);

  return {
    band,
    bandSignature,
    binaryField,
    waveField
  };
}


// ============================================================================
// REFLEX DIAGNOSTICS (v11-Evo + A-B-A)
// ============================================================================
function buildReflexDiagnostics(event, pulseOrImpulse, reflexId, state) {
  const pulseId = getPulseId(pulseOrImpulse);
  const organ   = getOrgan(event);
  const reason  = getReason(event);

  const base = {
    reflexId,
    pulseId,
    organ,
    reason,
    lineageDepth: event.lineageDepth,
    returnToDepth: event.returnToDepth,
    fallbackDepth: event.fallbackDepth,
    instanceContext: event.instanceContext || null,
    cycleIndex: reflexCycle,

    reflexHash: computeHash(reflexId),
    pulseHash: computeHash(pulseId),
    organHash: computeHash(organ),
    reasonHash: computeHash(reason),
    cycleHash: computeHash(String(reflexCycle)),

    instanceCount: state.count,
    firstSeenCycle: state.firstSeenCycle,
    lastSeenCycle: state.lastSeenCycle
  };

  const bandPack = buildReflexBandBinaryWave(
    event,
    pulseOrImpulse,
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
// REFLEX ORGANISM BUILDER (v11-Evo)
// ============================================================================
function buildReflexEarnFromGovernorEvent(event, pulseOrImpulse, instanceContext) {
  const pulseId = getPulseId(pulseOrImpulse);
  const organ   = getOrgan(event);
  const reason  = getReason(event);

  const pattern = `EarnReflex:${organ}:${reason}`;
  const patternSignature = computeHash(pattern);

  return {
    EarnRole: {
      kind: "EarnReflex",
      version: "11.0",
      identity: "EarnReflex-v11-Evo"
    },

    jobId: pulseId,
    pattern,
    patternSignature,

    payload: {
      pulseId,
      organ,
      reason,
      blocked: !!event.blocked,
      lineageDepth: event.lineageDepth,
      returnToDepth: event.returnToDepth,
      fallbackDepth: event.fallbackDepth,
      instanceContext,
      cycleIndex: reflexCycle,
      rawEvent: event
    },

    priority: "low",
    returnTo: null,
    lineage: [],

    meta: {
      reflex: true,
      origin: "PulseEarnReflex-v11-Evo",
      sourceOrgan: organ,
      sourceReason: reason,
      sourcePulseId: pulseId,
      instanceContext,
      cycleIndex: reflexCycle,
      patternSignature
    }
  };
}


// ============================================================================
// PUBLIC API — PulseEarnReflex v11-Evo + Dual-Band A-B-A
// ============================================================================
export const PulseEarnReflex = {

  fromGovernorEvent(event, pulseOrImpulse, instanceContext) {
    reflexCycle++;

    const reflexId = getReflexId(event, pulseOrImpulse);

    // Multi-instance reflex law
    let state = reflexInstances.get(reflexId);
    if (!state) {
      state = {
        reflexId,
        count: 0,
        firstSeenCycle: reflexCycle,
        lastSeenCycle: null
      };
      reflexInstances.set(reflexId, state);
    }

    state.count += 1;
    state.lastSeenCycle = reflexCycle;

    // Build reflex organism
    const earnReflex = buildReflexEarnFromGovernorEvent(
      event,
      pulseOrImpulse,
      instanceContext
    );

    // v11-Evo + A-B-A diagnostics
    const diagnostics = buildReflexDiagnostics(
      event,
      pulseOrImpulse,
      reflexId,
      state
    );

    const reflexSignature = computeHash(
      `${reflexId}::${diagnostics.cycleIndex}`
    );

    // Optional local observer (no routing, no send)
    if (typeof window !== "undefined" && window.EarnBand?.receiveEarnReflex) {
      window.EarnBand.receiveEarnReflex({
        event,
        pulse: pulseOrImpulse,
        reflexId,
        state,
        instanceContext,
        diagnostics,
        reflexSignature,
        earnReflex
      });
    }

    return {
      ok: true,
      reflexId,
      state,
      instanceContext,
      diagnostics,
      reflexSignature,
      earnReflex
    };
  },

  // Dashboard / debugging
  getReflexState(reflexId) {
    if (reflexId) return reflexInstances.get(reflexId) || null;
    return Array.from(reflexInstances.values());
  }
};
