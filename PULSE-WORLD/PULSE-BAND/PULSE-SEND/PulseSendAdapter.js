// ============================================================================
//  PulseSendAdapter-v12.3-Evo.js
//  Pattern‑Shape Adapter • Pulse‑Agnostic Translator • Pre‑Delivery Adapter
//  v12.3: Diagnostics + Signatures + Pattern Surface + Lineage Surface
//         + cacheChunkSurface + prewarmSurface + presenceSurface
//  v12.3-Binary: Binary-Aware Adapter Surface (Optional, Non-Breaking)
// ============================================================================
//
//  SAFETY CONTRACT (v12.3-Evo):
//  ----------------------------
//  • No imports.
//  • No network.
//  • No compute beyond local helpers.
//  • Zero randomness.
//  • Zero timestamps.
//  • Zero mutation outside instance.
// ============================================================================


// ============================================================================
// ⭐ PulseRole — identifies this as the PulseSend Adapter Organ (v12.3-Evo)
// ============================================================================
export const PulseRole = {
  type: "Messenger",
  subsystem: "PulseSend",
  layer: "Adapter",
  version: "12.3",
  identity: "PulseSendAdapter-v12.3-Evo",

  evo: {
    driftProof: true,
    shapeShiftReady: true,
    multiOrganReady: true,
    patternAware: true,
    lineageAware: true,
    modeAware: true,
    identityAware: true,
    selfTranslationReady: true,
    deterministicImpulseFlow: true,
    futureEvolutionReady: true,

    unifiedAdvantageField: true,
    pulseSend11Ready: true,

    diagnosticsReady: true,
    signatureReady: true,
    adapterSurfaceReady: true,

    // Binary-aware adapter surface
    binaryAwareAdapterReady: true,

    // 12.3+: cache / prewarm / presence
    cacheChunkAware: true,
    prewarmAware: true,
    multiPresenceAware: true
  },

  routingContract: "PulseRouter-v11",
  meshContract: "PulseMesh-v11",
  pulseContract: "Pulse-v1/v2/v3",
  gpuOrganContract: "PulseGPU-v11",
  earnCompatibility: "PulseEarn-v11"
};


// ============================================================================
//  INTERNAL HELPERS — deterministic, tiny, pure
// ============================================================================

function computeHash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h + str.charCodeAt(i) * (i + 1)) % 100000;
  }
  return `h${h}`;
}

function stableStringify(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) {
    return "[" + value.map(stableStringify).join(",") + "]";
  }
  const keys = Object.keys(value).sort();
  return (
    "{" +
    keys.map((k) => JSON.stringify(k) + ":" + stableStringify(value[k])).join(",") +
    "}"
  );
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

function buildAdapterDiagnostics({ pulse, targetOrgan, mode }) {
  const pattern = pulse?.pattern || "NO_PATTERN";
  const lineageDepth = Array.isArray(pulse?.lineage) ? pulse.lineage.length : 0;
  const pulseType = pulse?.pulseType || pulse?.PulseRole?.identity || "UNKNOWN_PULSE_TYPE";

  const binarySurface = extractBinarySurfaceFromPulse(pulse);

  return {
    // Symbolic surface
    pattern,
    lineageDepth,
    pulseType,
    targetOrgan: targetOrgan || "NO_ORGAN",
    mode,

    // Binary surface (optional)
    binary: binarySurface,

    // Hashes
    patternHash: computeHash(pattern),
    lineageHash: computeHash(String(lineageDepth)),
    pulseTypeHash: computeHash(pulseType),
    organHash: computeHash(String(targetOrgan)),
    modeHash: computeHash(mode),

    // Binary hashes
    binaryPatternHash: binarySurface.binaryPattern
      ? computeHash(binarySurface.binaryPattern)
      : null,
    binaryModeHash: binarySurface.binaryMode
      ? computeHash(binarySurface.binaryMode)
      : null
  };
}


// ============================================================================
//  12.3+ surfaces — cacheChunk / prewarm / presence
// ============================================================================

function buildCacheChunkSurface({ pulse, targetOrgan, mode }) {
  const pattern = pulse?.pattern || "NO_PATTERN";
  const jobId = pulse?.jobId || "NO_JOB";
  const pulseType = pulse?.pulseType || pulse?.PulseRole?.identity || "UNKNOWN_PULSE_TYPE";

  const shape = {
    jobId,
    pattern,
    targetOrgan: targetOrgan || "NO_ORGAN",
    mode: mode || "normal",
    pulseType
  };

  const serialized = stableStringify(shape);
  const cacheChunkKey = "psend-adapter-cache::" + computeHash(serialized);

  return {
    cacheChunkKey,
    cacheChunkSignature: computeHash(cacheChunkKey)
  };
}

function buildPrewarmSurface({ pulse, targetOrgan, mode }) {
  const priority = pulse?.priority || "normal";
  const safeMode = mode || "normal";
  const hasTarget = !!targetOrgan;

  let level = "none";
  if (priority === "high" || priority === "critical") {
    level = "aggressive";
  } else if (priority === "normal" && hasTarget) {
    level = "medium";
  } else if (priority === "low" && hasTarget) {
    level = "light";
  }

  const raw = stableStringify({
    priority,
    mode: safeMode,
    hasTarget
  });

  const prewarmKey = "psend-adapter-prewarm::" + computeHash(raw);

  return {
    level,
    prewarmKey
  };
}

function buildPresenceSurface({ pulse, targetOrgan }) {
  const pattern = pulse?.pattern || "NO_PATTERN";
  const hasTarget = !!targetOrgan;

  let scope = "local";
  if (hasTarget && pattern.includes("/global")) {
    scope = "global";
  } else if (hasTarget && pattern.includes("/page")) {
    scope = "page";
  }

  const raw = stableStringify({
    pattern,
    hasTarget,
    scope
  });

  const presenceKey = "psend-adapter-presence::" + computeHash(raw);

  return {
    scope,
    presenceKey
  };
}


// ============================================================================
//  ADAPTER RULES — how each organ wants to receive a Pulse organism
// ============================================================================
const ORGAN_ADAPTERS = {
  GPU: (pulse, targetOrgan, mode) => ({
    target: targetOrgan,
    jobId: pulse.jobId,
    pattern: pulse.pattern,
    payload: pulse.payload,
    priority: pulse.priority,
    lineage: pulse.lineage,
    mode,
    pulseType: pulse.pulseType,
    advantageField: pulse.advantageField,
    gpuReady: true
  }),

  Earn: (pulse, targetOrgan, mode) => ({
    target: targetOrgan,
    jobId: pulse.jobId,
    pattern: pulse.pattern,
    payload: pulse.payload,
    priority: pulse.priority,
    lineage: pulse.lineage,
    mode,
    pulseType: pulse.pulseType,
    advantageField: pulse.advantageField,
    earnReady: true
  }),

  OS: (pulse, targetOrgan, mode) => ({
    target: targetOrgan,
    jobId: pulse.jobId,
    pattern: pulse.pattern,
    payload: pulse.payload,
    priority: pulse.priority,
    lineage: pulse.lineage,
    mode,
    pulseType: pulse.pulseType,
    advantageField: pulse.advantageField,
    osReady: true
  }),

  Mesh: (pulse, targetOrgan, mode) => ({
    target: targetOrgan,
    jobId: pulse.jobId,
    pattern: pulse.pattern,
    payload: pulse.payload,
    priority: pulse.priority,
    lineage: pulse.lineage,
    mode,
    pulseType: pulse.pulseType,
    advantageField: pulse.advantageField,
    meshReady: true
  })
};


// ============================================================================
//  FACTORY — Create an Adapter for ANY Pulse organism (v1/v2/v3)
// ============================================================================
export function adaptPulseSendPacket(pulse, targetOrgan, mode = "normal") {
  const pulseType = pulse?.pulseType || pulse?.PulseRole?.identity || "UNKNOWN_PULSE_TYPE";
  const advantageField = pulse?.advantageField || null;

  const diagnostics = buildAdapterDiagnostics({
    pulse,
    targetOrgan,
    mode
  });

  // ⭐ v12.3 adapter signature (binary + cacheChunk aware)
  const adapterSignature = computeHash(
    diagnostics.pattern +
    "::" +
    diagnostics.targetOrgan +
    "::" +
    diagnostics.mode +
    "::" +
    (diagnostics.binary.binaryPattern || "NO_BINARY_PATTERN")
  );

  const cacheChunkSurface = buildCacheChunkSurface({
    pulse,
    targetOrgan,
    mode
  });

  const prewarmSurface = buildPrewarmSurface({
    pulse,
    targetOrgan,
    mode
  });

  const presenceSurface = buildPresenceSurface({
    pulse,
    targetOrgan
  });

  const adapter = ORGAN_ADAPTERS[targetOrgan];

  if (typeof adapter === "function") {
    return {
      ...adapter(
        { ...pulse, pulseType, advantageField },
        targetOrgan,
        mode
      ),
      adapterSignature,
      diagnostics,
      cacheChunkSurface,
      prewarmSurface,
      presenceSurface
    };
  }

  // ⭐ fallback: neutral shape
  return {
    target: targetOrgan,
    jobId: pulse.jobId,
    pattern: pulse.pattern,
    payload: pulse.payload,
    priority: pulse.priority,
    lineage: pulse.lineage,
    mode,
    pulseType,
    advantageField,
    neutral: true,
    adapterSignature,
    diagnostics,
    cacheChunkSurface,
    prewarmSurface,
    presenceSurface
  };
}
