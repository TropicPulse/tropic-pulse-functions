// ============================================================================
//  PulseEarnContinuancePulse-v12.3-PRESENCE-EVO+-SAFE.js
//  Earn v1 Continuance Wrapper (v12.3-PRESENCE-EVO+ SAFE)
//  NO PulseSendSystem, NO network, NO routing, NO loops.
//  Only: build LegacyEarn v1 + Pulse-compatible envelope and return it.
//  Presence/Advantage/Band/Factoring/Binary/Wave aware as METADATA ONLY.
// ============================================================================

export const PulseEarnContinuancePulseMeta = Object.freeze({
  layer: "PulseEarnContinuancePulse",
  role: "EARN_CONTINUANCE_ORGAN",
  version: "v12.3-PRESENCE-EVO+",
  identity: "PulseEarnContinuancePulse-v12.3-PRESENCE-EVO+",

  guarantees: Object.freeze({
    deterministic: true,
    noRandomness: true,
    noRealTime: true,
    noExternalIO: true,
    pureBuilder: true,
    safeFallback: true,
    dualBandAware: true,
    binaryAware: true,
    waveFieldAware: true,
    factoringAware: true,
    presenceAware: true,
    advantageAware: true,
    hintsAware: true,
    loopTheorySafe: true,
    worldLensAware: false
  }),

  contract: Object.freeze({
    input: [
      "EarnImpulse",
      "DualBandContext",
      "LegacyLineage",
      "PatternShape",
      "GlobalHintsPresenceField"
    ],
    output: [
      "LegacyEarnV1",
      "PulseCompatibleEarnEnvelope",
      "ContinuanceDiagnostics"
    ]
  }),

  lineage: Object.freeze({
    root: "PulseOS-v11-EVO",
    parent: "PulseEarn-v12.3-PRESENCE-EVO+",
    ancestry: [
      "PulseEarnContinuancePulse-v10",
      "PulseEarnContinuancePulse-v11",
      "PulseEarnContinuancePulse-v11-Evo"
    ]
  }),

  bands: Object.freeze({
    supported: ["symbolic", "binary"],
    default: "symbolic",
    behavior: "metadata-only"
  }),

  architecture: Object.freeze({
    pattern: "A-B-A",
    baseline: "deterministic legacy Earn v1 builder",
    adaptive: "band/binary/wave/factoring/presence/advantage surfaces",
    return: "deterministic Pulse-compatible envelope"
  })
});

// Deterministic cycle counter (replaces timestamps)
let continuanceCycle = 0;

// ============================================================================
//  INTERNAL: Deterministic Hash Helper
// ============================================================================
function computeHash(str) {
  let h = 0;
  const s = String(str || "");
  for (let i = 0; i < s.length; i++) {
    h = (h + s.charCodeAt(i) * (i + 1)) % 100000;
  }
  return `h${h}`;
}

// ============================================================================
//  INTERNAL: Presence / Advantage / Hints Surfaces (METADATA ONLY)
//  NOTE: These are carried through, NOT acted upon.
// ============================================================================
function buildPresenceFieldFromImpulse(impulse = {}, globalHints = {}) {
  const pf = impulse.presenceField || {};
  const gh = globalHints.presenceContext || {};
  const mesh = globalHints.meshSignals || {};
  const castle = globalHints.castleSignals || {};
  const region = globalHints.regionContext || {};

  return Object.freeze({
    bandPresence: pf.bandPresence || gh.bandPresence || "unknown",
    routerPresence: pf.routerPresence || gh.routerPresence || "unknown",
    devicePresence: pf.devicePresence || gh.devicePresence || "unknown",
    meshPresence: pf.meshPresence || mesh.meshStrength || "unknown",
    castlePresence: pf.castlePresence || castle.castlePresence || "unknown",
    regionPresence: pf.regionPresence || region.regionTag || "unknown",
    regionId: region.regionId || "unknown-region",
    castleId: castle.castleId || "unknown-castle",
    castleLoadLevel: castle.loadLevel || "unknown",
    meshStrength: mesh.meshStrength || "unknown",
    meshPressureIndex: mesh.meshPressureIndex || 0
  });
}

function buildAdvantagePresenceFieldFromImpulse(globalHints = {}) {
  const adv = globalHints.advantageContext || {};
  return Object.freeze({
    advantageScore: adv.score ?? null,
    advantageBand: adv.band ?? "neutral",
    advantageTier: adv.tier ?? "unknown"
  });
}

function buildHintsFieldFromImpulse(globalHints = {}) {
  // SAFE MODE: we only carry hints, we do NOT act on them.
  return Object.freeze({
    fallbackBandLevel: globalHints.fallbackBandLevel ?? 0,
    chunkHints: globalHints.chunkHints || {},
    cacheHints: globalHints.cacheHints || {},
    prewarmHints: globalHints.prewarmHints || {},
    coldStartHints: globalHints.coldStartHints || {}
  });
}

function buildContinuanceProfile({ band, globalHints = {} }) {
  const b = (band === "binary" ? "binary" : "symbolic");
  const hintsField = buildHintsFieldFromImpulse(globalHints);

  // SAFE MODE: factoringSignal is allowed, but we do NOT use it to branch.
  const fallbackBandLevel = hintsField.fallbackBandLevel;
  const factoringSignal = 1; // always "on" for continuance: always build Earn v1

  return Object.freeze({
    continuanceBand: b,
    fallbackBandLevel,
    factoringSignal,
    // carried-only hints; no behavior:
    chunkHints: hintsField.chunkHints,
    cacheHints: hintsField.cacheHints,
    prewarmHints: hintsField.prewarmHints,
    coldStartHints: hintsField.coldStartHints
  });
}

// ============================================================================
//  INTERNAL: Build LegacyEarn v1 directly from impulse (NO IMPORTS)
//  Now dual-band + binary/wave/factoring + presence/advantage aware (structural only).
// ============================================================================
function buildLegacyEarnFromImpulse(impulse, globalHints = {}) {
  continuanceCycle++;

  const payload = impulse?.payload || {};

  const jobId   = impulse.tickId || payload.jobId || "UNKNOWN_JOB";
  const pattern = impulse.intent || payload.pattern || "UNKNOWN_PATTERN";
  const lineage = payload.parentLineage || [];

  // Dual-band (metadata-only)
  const band =
    (payload.band && String(payload.band).toLowerCase() === "binary")
      ? "binary"
      : "symbolic";

  // FactoringSignal (metadata-only, always normalized to 0/1)
  const factoringSignal =
    typeof payload.factoringSignal === "number"
      ? (payload.factoringSignal ? 1 : 0)
      : 1;

  const patternSignature = computeHash(pattern);
  const lineageSignature = computeHash(lineage.join("::"));

  // Binary surface (structural, no real bits)
  const surface = pattern.length * (lineage.length || 1);
  const binaryField = {
    binaryShapeSignature: computeHash(`bshape::${pattern}::${lineage.join("::")}`),
    binarySurfaceSignature: computeHash(`bsurf::${surface}`),
    binarySurface: {
      patternLength: pattern.length,
      lineageDepth: lineage.length,
      surface
    },
    parity: surface % 2 === 0 ? 0 : 1,
    bitDensity: pattern.length + lineage.length,
    shiftDepth: Math.max(0, Math.floor(Math.log2(surface || 1)))
  };

  // Wave field (structural wave-theory metadata)
  const waveField = {
    wavelength: pattern.length,
    amplitude: lineage.length,
    phase: (pattern.length + lineage.length) % 8,
    band,
    mode: band === "binary" ? "compression-wave" : "symbolic-wave"
  };

  // Presence / Advantage / Hints / ContinuanceProfile (metadata-only)
  const presenceField = buildPresenceFieldFromImpulse(impulse, globalHints);
  const advantagePresenceField = buildAdvantagePresenceFieldFromImpulse(globalHints);
  const hintsField = buildHintsFieldFromImpulse(globalHints);
  const continuanceProfile = buildContinuanceProfile({ band, globalHints });

  return {
    EarnRole: {
      kind: "Earn",
      version: "1.0",
      identity: "Earn-v1-Continuance-v12.3-PRESENCE-EVO+"
    },

    jobId,
    pattern,
    patternSignature,

    payload,
    priority: payload.priority || "normal",
    returnTo: payload.returnTo || null,
    lineage,
    lineageSignature,

    band,
    factoringSignal,
    binaryField,
    waveField,

    presenceField,
    advantagePresenceField,
    hintsField,
    continuanceProfile,

    meta: {
      ...(payload.meta || {}),
      legacy: true,
      origin: "ContinuancePulse-v12.3-PRESENCE-EVO+",
      cycleIndex: continuanceCycle,
      patternSignature,
      lineageSignature
    }
  };
}

// ============================================================================
//  INTERNAL: Build Pulse-Compatible Earn Wrapper (v12.3-PRESENCE-EVO+ SAFE)
//  Carries band + factoring + binary/wave + presence/advantage/hints surfaces.
// ============================================================================
function buildPulseCompatibleEarn(earn) {
  if (!earn) return null;

  const continuanceSignature = computeHash(
    `${earn.jobId}::${earn.patternSignature}::${earn.meta.cycleIndex}`
  );

  const band = earn.band || "symbolic";
  const factoringSignal =
    typeof earn.factoringSignal === "number"
      ? (earn.factoringSignal ? 1 : 0)
      : 1;

  const binaryField = earn.binaryField || {
    binaryShapeSignature: null,
    binarySurfaceSignature: null,
    binarySurface: null,
    parity: null,
    bitDensity: null,
    shiftDepth: null
  };

  const waveField = earn.waveField || {
    wavelength: earn.pattern ? earn.pattern.length : 0,
    amplitude: Array.isArray(earn.lineage) ? earn.lineage.length : 0,
    phase: 0,
    band,
    mode: band === "binary" ? "compression-wave" : "symbolic-wave"
  };

  const presenceField = earn.presenceField || null;
  const advantagePresenceField = earn.advantagePresenceField || null;
  const hintsField = earn.hintsField || null;
  const continuanceProfile = earn.continuanceProfile || null;

  return {
    PulseRole: earn.EarnRole,

    jobId: earn.jobId,
    pattern: earn.pattern,
    patternSignature: earn.patternSignature,

    payload: earn.payload,
    priority: earn.priority,
    returnTo: earn.returnTo,
    lineage: earn.lineage,
    lineageSignature: earn.lineageSignature,

    band,
    factoringSignal,
    binaryField,
    waveField,

    presenceField,
    advantagePresenceField,
    hintsField,
    continuanceProfile,

    meta: {
      ...(earn.meta || {}),
      origin: "ContinuancePulse-v12.3-PRESENCE-EVO+",
      earnVersion: "1.0",
      earnIdentity: "Earn-v1-Continuance-v12.3-PRESENCE-EVO+",
      earnEnvelope: true,
      cycleIndex: earn.meta.cycleIndex,
      continuanceSignature,
      bandSignature: computeHash(band),
      factoringSignature: computeHash(String(factoringSignal)),
      binarySignature: binaryField.binaryShapeSignature,
      waveSignature: computeHash(JSON.stringify(waveField))
    },

    earn: {
      role: earn.EarnRole,
      pattern: earn.pattern,
      patternSignature: earn.patternSignature,
      lineage: earn.lineage,
      lineageSignature: earn.lineageSignature,
      band,
      factoringSignal,
      binaryField,
      waveField,
      presenceField,
      advantagePresenceField,
      hintsField,
      continuanceProfile,
      meta: earn.meta,
      __earnEnvelope: true
    }
  };
}

// ============================================================================
//  PUBLIC API — PulseEarnContinuancePulse (v12.3-PRESENCE-EVO+ SAFE)
//  NOTE: This module DOES NOT SEND ANYTHING.
//        It only returns the legacy Earn + envelope.
//        Caller decides if/where to send, under a governor.
// ============================================================================
export const PulseEarnContinuancePulse = {

  build(impulse, globalHints = {}) {
    // 1. Build Earn v1 from Impulse (band/binary/wave/factoring/presence/advantage aware)
    const earnV1 = buildLegacyEarnFromImpulse(impulse, globalHints);

    // 2. Wrap Earn v1 in Pulse-compatible shape
    const pulseCompatibleEarn = buildPulseCompatibleEarn(earnV1);

    // 3. Optional local-only observer hook (unchanged, safe)
    if (typeof window !== "undefined" && window.EarnBand?.receiveEarnResult) {
      window.EarnBand.receiveEarnResult({
        impulse,
        earn: earnV1,
        pulseCompatibleEarn,
        result: null,
        fallback: true
      });
    }

    // 4. Return ONLY the structures; no sending, no routing.
    return {
      ok: true,
      earn: earnV1,
      pulseCompatibleEarn,
      fallback: true
    };
  }
};
