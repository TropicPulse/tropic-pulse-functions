// ============================================================================
//  PulseSendMover-v12.3-Evo.js
//  Movement Organ • Pulse‑Agnostic • Deterministic Transport Muscle
//  v12.3: Binary + CacheChunk + Prewarm + Presence Surfaces
// ============================================================================
//
//  SAFETY CONTRACT (v12.3-Evo):
//  ----------------------------
//  • No randomness.
//  • No timestamps.
//  • No external IO.
//  • Pure deterministic movement.
//  • Zero mutation outside instance.
// ============================================================================


// ============================================================================
// ⭐ PulseRole — identifies this as the PulseSend Mover Organ (v12.3-Evo)
// ============================================================================
export const PulseRole = {
  type: "Messenger",
  subsystem: "PulseSend",
  layer: "Mover",
  version: "12.3",
  identity: "PulseSendMover-v12.3-Evo",

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
    multiPresenceAware: true
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
//  MOVEMENT DIAGNOSTICS (symbolic + binary + 12.3 surfaces)
// ============================================================================
function buildMovementDiagnostics({ pulse, targetOrgan, pathway, mode }) {
  const pattern = pulse.pattern || "NO_PATTERN";
  const lineageDepth = Array.isArray(pulse.lineage) ? pulse.lineage.length : 0;
  const pulseType = pulse.pulseType || pulse?.PulseRole?.identity || "UNKNOWN_PULSE_TYPE";

  const binary = extractBinarySurface(pulse);

  return {
    pattern,
    lineageDepth,
    pulseType,
    targetOrgan,
    pathway,
    mode,

    binary,

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
//  FACTORY — Create the Mover Organ (v12.3-Evo)
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
        (diagnostics.binary.binaryPattern || "NO_BINARY")
      );

      log && log("[PulseSendMover-v12.3] Movement fired", {
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
//  ORGAN EXPORT — ⭐ PulseSendMover (v12.3-Evo)
// ============================================================================
export const PulseSendMover = {
  PulseRole,

  move({ pulse, targetOrgan, pathway, mode }) {
    const pulseType = pulse?.pulseType || pulse?.PulseRole?.identity || "UNKNOWN_PULSE_TYPE";
    const pattern = pulse?.pattern || "NO_PATTERN";
    const lineageDepth = Array.isArray(pulse?.lineage) ? pulse.lineage.length : 0;

    throw new Error(
      `[PulseSendMover-v12.3-Evo] move() called before initialization.\n` +
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
