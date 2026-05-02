// ============================================================================
//  PulseSendMover-v14.4-IMMORTAL.js
//  Movement Organ • Pulse‑Agnostic • Deterministic Transport Muscle
//  v14.4: Binary + CacheChunk + Prewarm + Presence + Degradation + ImmortalMeta
// ============================================================================
//
//  SAFETY CONTRACT (v14.4-IMMORTAL):
//  --------------------------------
//  • No randomness.
//  • No timestamps.
//  • No external IO.
//  • Pure deterministic movement.
//  • Zero mutation outside instance.
// ============================================================================
/*
AI_EXPERIENCE_META = {
  identity: "PulseSendEngine",
  version: "v12.4-EVO-CORE",
  layer: "frontend",
  role: "send_engine",
  lineage: "PulseOS-v12",

  evo: {
    dualBand: true,
    presenceAware: true,
    chunkAligned: true,
    safeRouteFree: true,
    deterministic: true,
    fallbackLadder: true
  },

  contract: {
    always: [
      "PulseSend",
      "PulseSendAdapter",
      "PulseBinarySend",
      "PulsePresence"
    ],
    never: [
      "legacySendEngine",
      "legacyEngine",
      "safeRoute",
      "fetchViaCNS"
    ]
  }
}
*/


// ============================================================================
// ⭐ PulseRole — identifies this as the PulseSend Mover Organ (v14.4-IMMORTAL)
// ============================================================================
export const PulseRole = {
  type: "Messenger",
  subsystem: "PulseSend",
  layer: "Mover",
  version: "14.4",
  identity: "PulseSendMover-v14.4-IMMORTAL",

  evo: {
    driftProof: true,
    moverReady: true,
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
    movementSurfaceReady: true,

    // Binary-aware movement surface
    binaryAwareMovementReady: true,

    // 12.3+: cacheChunk / prewarm / presence
    cacheChunkAware: true,
    prewarmAware: true,
    multiPresenceAware: true,

    // 14.4+: degradation + immortal meta
    degradationAware: true,
    immortalMetaAware: true
  }
};


// ============================================================================
//  INTERNAL HELPERS — deterministic, pure
// ============================================================================
function computeHash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h + str.charCodeAt(i) * (i + 3)) % 131072;
  }
  return `h12_${h}`;
}

function stableStringify(v) {
  if (v === null || typeof v !== "object") return JSON.stringify(v);
  if (Array.isArray(v)) return "[" + v.map(stableStringify).join(",") + "]";
  const keys = Object.keys(v).sort();
  return "{" + keys.map(k => JSON.stringify(k) + ":" + stableStringify(v[k])).join(",") + "}";
}

function extractBinarySurface(pulse) {
  const p = pulse?.payload || {};
  const binaryPattern  = p.binaryPattern || null;
  const binaryMode     = p.binaryMode || null;
  const binaryPayload  = p.binaryPayload || null;
  const binaryHints    = p.binaryHints || null;
  const binaryStrength = typeof p.binaryStrength === "number" ? p.binaryStrength : null;

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

function extractImmortalMeta(pulse) {
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
//  12.3+ Surfaces — cacheChunk / prewarm / presence
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
  const cacheChunkKey = "mover-cache::" + computeHash(raw);

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
  const prewarmKey = "mover-prewarm::" + computeHash(raw);

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
  const presenceKey = "mover-presence::" + computeHash(raw);

  return {
    scope,
    presenceKey
  };
}


// ============================================================================
//  14.4+ Surfaces — degradation + immortalMeta
// ============================================================================
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
  const immortalMeta = extractImmortalMeta(pulse);
  const raw = stableStringify(immortalMeta);
  const immortalSignature = computeHash("mover-immortal::" + raw);

  return {
    immortalMeta,
    immortalSignature
  };
}


// ============================================================================
//  MOVEMENT DIAGNOSTICS (symbolic + binary + 14.4 surfaces)
// ============================================================================
function buildMovementDiagnostics({ pulse, targetOrgan, pathway, mode }) {
  const pattern = pulse.pattern || "NO_PATTERN";
  const lineageDepth = Array.isArray(pulse.lineage) ? pulse.lineage.length : 0;
  const pulseType = pulse.pulseType || pulse?.PulseRole?.identity || "UNKNOWN_PULSE_TYPE";

  const binary = extractBinarySurface(pulse);
  const degradation = buildDegradationSurface({ pulse });
  const immortal = buildImmortalSurface({ pulse });

  return {
    pattern,
    lineageDepth,
    pulseType,
    targetOrgan,
    pathway,
    mode,

    binary,
    degradation,
    immortal,

    patternHash: computeHash(pattern),
    lineageHash: computeHash(String(lineageDepth)),
    pulseTypeHash: computeHash(pulseType),
    organHash: computeHash(String(targetOrgan)),
    pathwayHash: computeHash(stableStringify(pathway || {})),

    binaryPatternHash: binary.binaryPattern ? computeHash(binary.binaryPattern) : null,
    binaryModeHash: binary.binaryMode ? computeHash(binary.binaryMode) : null
  };
}


// ============================================================================
//  FACTORY — Create the Mover Organ (v14.4-IMMORTAL)
// ============================================================================
export function createPulseSendMover({ pulseMesh, log }) {
  return {
    PulseRole,

    move({ pulse, targetOrgan, pathway, mode = "normal" }) {

      const diagnostics = buildMovementDiagnostics({
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

      const movementSignature = computeHash(
        diagnostics.pattern +
        "::" +
        diagnostics.targetOrgan +
        "::" +
        diagnostics.mode +
        "::" +
        (diagnostics.binary.binaryPattern || "NO_BINARY") +
        "::" +
        diagnostics.degradation.degradationTier +
        "::" +
        diagnostics.immortal.immortalSignature
      );

      log && log("[PulseSendMover-v14.4-IMMORTAL] Movement fired", {
        jobId: pulse.jobId,
        diagnostics,
        cacheChunkSurface,
        prewarmSurface,
        presenceSurface
      });

      return {
        packet: {
          pulse,
          targetOrgan,
          pathway,
          mode,
          movementSignature,
          diagnostics,
          cacheChunkSurface,
          prewarmSurface,
          presenceSurface
        }
      };
    }
  };
}


// ============================================================================
//  ORGAN EXPORT — ⭐ PulseSendMover (v14.4-IMMORTAL)
// ============================================================================
export const PulseSendMover = {
  PulseRole,

  move({ pulse, targetOrgan, pathway, mode }) {
    const pulseType = pulse?.pulseType || pulse?.PulseRole?.identity || "UNKNOWN_PULSE_TYPE";
    const pattern = pulse?.pattern || "NO_PATTERN";
    const lineageDepth = Array.isArray(pulse?.lineage) ? pulse.lineage.length : 0;

    throw new Error(
      `[PulseSendMover-v14.4-IMMORTAL] move() called before initialization.\n` +
      `• pulseType: ${pulseType}\n` +
      `• pattern: ${pattern}\n` +
      `• lineageDepth: ${lineageDepth}\n` +
      `• targetOrgan: ${targetOrgan || "NO_ORGAN"}\n` +
      `• pathway: ${pathway || "NO_PATHWAY"}\n` +
      `• mode: ${mode || "NO_MODE"}\n` +
      `Use createPulseSendMover(...) to wire dependencies.`
    );
  }
};
