// ============================================================================
//  PulseSendImpulse-v14.4-IMMORTAL.js
//  Nerve‑Spark • Pulse‑Agnostic Trigger Organ • Fires the Movement
//  v14.4: Binary + CacheChunk + Prewarm + Presence + Degradation + Advantage
//         + DualBand + Immortal Meta Surfaces
// ============================================================================
//
//  ROLE:
//    • Pulse‑agnostic spark organ (v1/v2/v3).
//    • Fires the movement via the mover organ.
//    • Emits diagnostics + signatures for the impulse arc.
//    • Binary‑aware + cacheChunk‑aware + prewarm‑aware + multi‑presence‑aware.
//    • Degradation‑aware + advantage‑aware + dual‑band‑aware + immortal‑meta‑aware.
//
//  SAFETY CONTRACT (v14.4-IMMORTAL):
//  --------------------------------
//  • No imports.
//  • No network.
//  • No compute beyond local helpers.
//  • Zero randomness.
//  • Zero timestamps.
//  • Zero mutation outside instance.
// ============================================================================
/*
AI_EXPERIENCE_META = {
  identity: "PulseSendImpulse",
  version: "v14.4-IMMORTAL",
  layer: "frontend",
  role: "send_impulse",
  lineage: "PulseOS-v12",

  evo: {
    spark: true,
    zeroCompute: true,
    deterministic: true,
    presenceAware: true,
    dualBand: true,
    safeRouteFree: true
  },

  contract: {
    always: [
      "PulseSendSystem",
      "PulseSendReturn"
    ],
    never: [
      "legacyImpulse",
      "safeRoute",
      "fetchViaCNS",
      "legacySend"
    ]
  }
}
*/


// ============================================================================
// ⭐ PulseRole — identifies this as the PulseSend Impulse Organ (v14.4-IMMORTAL)
// ============================================================================
export const PulseRole = {
  type: "Messenger",
  subsystem: "PulseSend",
  layer: "Impulse",
  version: "14.4",
  identity: "PulseSendImpulse-v14.4-IMMORTAL",

  evo: {
    driftProof: true,
    reflexReady: true,
    sparkReady: true,
    patternAware: true,
    lineageAware: true,
    modeAware: true,
    identityAware: true,
    multiOrganReady: true,
    deterministicImpulseFlow: true,
    futureEvolutionReady: true,

    unifiedAdvantageField: true,
    pulseSend11Ready: true,

    diagnosticsReady: true,
    signatureReady: true,
    impulseSurfaceReady: true,

    // Binary-aware impulse surface
    binaryAwareImpulseReady: true,

    // 12.3+: cacheChunk / prewarm / presence
    cacheChunkAware: true,
    prewarmAware: true,
    multiPresenceAware: true,

    // 14.4+: degradation / dual-band / immortal meta
    degradationAware: true,
    dualBandAware: true,
    immortalMetaAware: true
  }
};


// ============================================================================
//  INTERNAL HELPERS — deterministic, tiny, pure
// ============================================================================
function computeHash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h + str.charCodeAt(i) * (i + 5)) % 131072;
  }
  return `h12_${h}`;
}

function stableStringify(v) {
  if (v === null || typeof v !== "object") return JSON.stringify(v);
  if (Array.isArray(v)) return "[" + v.map(stableStringify).join(",") + "]";
  const keys = Object.keys(v).sort();
  return "{" + keys.map(k => JSON.stringify(k) + ":" + stableStringify(v[k])).join(",") + "}";
}

function extractBinarySurfaceFromPulse(pulse) {
  const payload = pulse?.payload || {};

  const binaryPattern  = payload.binaryPattern || null;
  const binaryMode     = payload.binaryMode || null;
  const binaryPayload  = payload.binaryPayload || null;
  const binaryHints    = payload.binaryHints || null;
  const binaryStrength = typeof payload.binaryStrength === "number"
    ? payload.binaryStrength
    : null;

  const hasBinary =
    !!binaryPattern ||
    !!binaryMode ||
    !!binaryPayload ||
    !!binaryHints ||
    binaryStrength !== null;

  return {
    hasBinary,
    binaryPattern,
    binaryMode,
    binaryPayload,
    binaryHints,
    binaryStrength
  };
}

function classifyDegradationTier(healthScore) {
  const h = typeof healthScore === "number" ? healthScore : 1.0;
  if (h >= 0.95) return "microDegrade";
  if (h >= 0.85) return "softDegrade";
  if (h >= 0.50) return "midDegrade";
  if (h >= 0.15) return "hardDegrade";
  return "criticalDegrade";
}

function extractImmortalMetaFromPulse(pulse) {
  const meta = pulse?.immortalMeta || {};
  return {
    presenceBandState: meta.presenceBandState ?? null,
    harmonicDrift: meta.harmonicDrift ?? null,
    coherenceScore: meta.coherenceScore ?? null,
    dualBandMode: meta.dualBandMode ?? null,
    shifterBand: meta.shifterBand ?? null
  };
}


// ============================================================================
//  14.4+ Surfaces — cacheChunk / prewarm / presence / degradation / immortal
// ============================================================================
function buildCacheChunkSurface({ pulse, targetOrgan, pathway, mode }) {
  const shape = {
    pattern: pulse.pattern || "",
    lineageDepth: Array.isArray(pulse.lineage) ? pulse.lineage.length : 0,
    targetOrgan,
    pathway,
    mode
  };
  const raw = stableStringify(shape);
  const cacheChunkKey = "impulse-cache::" + computeHash(raw);

  return {
    cacheChunkKey,
    cacheChunkSignature: computeHash(cacheChunkKey)
  };
}

function buildPrewarmSurface({ pulse, targetOrgan }) {
  const priority = pulse.priority || "normal";
  let level = "none";

  if (priority === "critical" || priority === "high") level = "aggressive";
  else if (priority === "normal") level = "medium";
  else if (priority === "low") level = "light";

  const raw = stableStringify({ priority, targetOrgan });
  const prewarmKey = "impulse-prewarm::" + computeHash(raw);

  return {
    level,
    prewarmKey
  };
}

function buildPresenceSurface({ pulse, targetOrgan }) {
  const pattern = pulse.pattern || "";
  let scope = "local";

  if (pattern.includes("/global")) scope = "global";
  else if (pattern.includes("/page")) scope = "page";

  const raw = stableStringify({ pattern, targetOrgan, scope });
  const presenceKey = "impulse-presence::" + computeHash(raw);

  return {
    scope,
    presenceKey
  };
}

function buildDegradationSurface({ pulse }) {
  const healthScore = typeof pulse?.healthScore === "number"
    ? pulse.healthScore
    : 1.0;

  const degradationTier = classifyDegradationTier(healthScore);

  return {
    healthScore,
    degradationTier,
    degradationHash: computeHash(degradationTier)
  };
}

function buildImmortalSurface({ pulse }) {
  const immortalMeta = extractImmortalMetaFromPulse(pulse);

  const raw = stableStringify(immortalMeta);
  const immortalSignature = computeHash("immortal::" + raw);

  return {
    immortalMeta,
    immortalSignature
  };
}


// ============================================================================
//  IMPULSE DIAGNOSTICS (symbolic + binary + 14.4 surfaces)
// ============================================================================
function buildImpulseDiagnostics({ pulse, targetOrgan, pathway, mode }) {
  const pattern = pulse?.pattern || "NO_PATTERN";
  const lineageDepth = Array.isArray(pulse?.lineage) ? pulse.lineage.length : 0;
  const pulseType = pulse?.pulseType || pulse?.PulseRole?.identity || "UNKNOWN_PULSE_TYPE";

  const binarySurface = extractBinarySurfaceFromPulse(pulse);
  const immortalSurface = buildImmortalSurface({ pulse });
  const degradationSurface = buildDegradationSurface({ pulse });

  return {
    pattern,
    lineageDepth,
    pulseType,
    targetOrgan: targetOrgan || "NO_ORGAN",
    pathway: pathway || "NO_PATHWAY",
    mode,

    binary: binarySurface,
    immortal: immortalSurface,
    degradation: degradationSurface,

    patternHash: computeHash(pattern),
    lineageHash: computeHash(String(lineageDepth)),
    pulseTypeHash: computeHash(pulseType),
    organHash: computeHash(String(targetOrgan)),
    pathwayHash: computeHash(stableStringify(pathway || {})),

    binaryPatternHash: binarySurface.binaryPattern
      ? computeHash(binarySurface.binaryPattern)
      : null,
    binaryModeHash: binarySurface.binaryMode
      ? computeHash(binarySurface.binaryMode)
      : null
  };
}


// ============================================================================
//  FACTORY — Create the Impulse Organ (v14.4-IMMORTAL)
// ============================================================================
export function createPulseSendImpulse({ mover, log }) {
  return {
    PulseRole,

    fire({ pulse, targetOrgan, pathway, mode = "normal" }) {

      const diagnostics = buildImpulseDiagnostics({
        pulse,
        targetOrgan,
        pathway,
        mode
      });

      const cacheChunkSurface = buildCacheChunkSurface({
        pulse,
        targetOrgan,
        pathway,
        mode
      });

      const prewarmSurface = buildPrewarmSurface({
        pulse,
        targetOrgan
      });

      const presenceSurface = buildPresenceSurface({
        pulse,
        targetOrgan
      });

      const degradationSurface = diagnostics.degradation;
      const immortalSurface = diagnostics.immortal;

      const advantageField = pulse?.advantageField || null;

      log && log("[PulseSendImpulse-v14.4-IMMORTAL] Spark fired", {
        jobId: pulse.jobId,
        diagnostics,
        cacheChunkSurface,
        prewarmSurface,
        presenceSurface,
        degradationSurface,
        immortalSurface,
        advantageField
      });

      const impulseSignature = computeHash(
        diagnostics.pattern +
        "::" +
        diagnostics.lineageDepth +
        "::" +
        diagnostics.targetOrgan +
        "::" +
        diagnostics.mode +
        "::" +
        (diagnostics.binary.binaryPattern || "NO_BINARY") +
        "::" +
        cacheChunkSurface.cacheChunkKey +
        "::" +
        (degradationSurface.degradationTier || "NO_DEGRADE") +
        "::" +
        (immortalSurface.immortalSignature || "NO_IMMORTAL")
      );

      const movement = mover.move({
        pulse,
        targetOrgan,
        pathway,
        mode
      });

      return {
        impulseSignature,
        diagnostics,
        cacheChunkSurface,
        prewarmSurface,
        presenceSurface,
        degradationSurface,
        immortalSurface,
        movement
      };
    }
  };
}
