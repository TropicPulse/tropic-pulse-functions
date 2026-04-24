// ============================================================================
//  PulseBinaryGPU-v11-Evo-binary-Prime — BINARY GPU ORGAN
//  Deterministic GPU Dispatch Organ • Pattern + Lineage + Shape
//  Binary/Dual-Mode • Pressure-Aware • Factoring-Aware • Mesh/Aura-Aware
// ============================================================================
//
//  WHAT THIS ORGAN IS:
//  --------------------
//  • The BINARY GPU compute organ for the Pulse organism (v11-Evo-binary-Prime).
//  • Builds deterministic GPU dispatch descriptors (no actual GPU calls here).
//  • Pattern-aware, lineage-aware, shape-aware, mode-aware, pressure-aware.
//  • Binary-mode + dual-mode surfaces for routing/earn/mesh to exploit.
//  • Compatible with PulseSend-v11, PulseRouter-v11, PulseMeshSpine-v11, Earn-v3.
//  • Pure metadata + dispatch planning — no side effects, no randomness.
//
//  WHAT THIS ORGAN IS NOT:
//  ------------------------
//  • Not a router, mesh engine, network client, miner, driver, or kernel launcher.
//  • Not a compute engine by itself.
//
//  SAFETY CONTRACT (v11-Evo-binary-Prime):
//  --------------------------------------
//  • No imports.
//  • No randomness.
//  • No timestamps.
//  • No external mutation.
//  • Pure deterministic string/shape/field operations.
//  • Metadata-only, zero payload access, zero routing influence.
// ============================================================================


// ============================================================================
// ⭐ BinaryGPURole — identifies this as the Binary PulseGPU Organ (v11-Evo-binary-Prime)
// ============================================================================
export const BinaryGPURole = {
  type: "GPU",
  subsystem: "PulseGPU",
  layer: "ComputeOrgan",
  version: "11.0-Evo-binary-Prime",
  identity: "PulseBinaryGPU-v11-Evo-binary-Prime",

  evo: {
    driftProof: true,
    patternAware: true,
    lineageAware: true,
    shapeAware: true,
    modeAware: true,
    pressureAware: true,
    deterministicDispatch: true,
    futureEvolutionReady: true,

    unifiedAdvantageField: true,
    pulseEfficiencyAware: true,
    advantageCascadeAware: true,
    multiInstanceReady: true,

    signalFactoringAware: true,
    meshPressureAware: true,
    auraPressureAware: true,

    binaryAware: true,
    dualModeAware: true,

    zeroCompute: true,
    zeroMutation: true,
    zeroRoutingInfluence: true
  },

  pulseContract: "Pulse-v1/v2/v3",
  meshContract: "PulseMeshSpine-v11",
  routerContract: "PulseRouter-v11",
  sendContract: "PulseSend-v11",
  earnContract: "Earn-v3"
};


// ============================================================================
//  INTERNAL HELPERS — deterministic, tiny, pure
// ============================================================================

function buildLineage(parentLineage, pattern) {
  const base = Array.isArray(parentLineage) ? parentLineage : [];
  return [...base, pattern];
}

function computeShapeSignature(pattern, lineage, binaryMode, dualMode) {
  const lineageKey = lineage.join("::");
  const modeKey = binaryMode ? "binary" : dualMode ? "dual" : "symbolic";
  const raw = `gpu::${modeKey}::${pattern}::${lineageKey}`;

  let acc = 0;
  for (let i = 0; i < raw.length; i++) {
    acc = (acc + raw.charCodeAt(i) * (i + 1)) % 100000;
  }

  return `gpu-shape-${modeKey}-${acc}`;
}

function computeDispatchSignature(pattern, binaryMode, dualMode, profileStyle) {
  const modeKey = binaryMode ? "binary" : dualMode ? "dual" : "symbolic";
  const raw = `dispatch::${modeKey}::${pattern}::${profileStyle}`;
  let acc = 0;
  for (let i = 0; i < raw.length; i++) {
    acc = (acc * 31 + raw.charCodeAt(i)) % 100000;
  }
  return `gpu-dispatch-${modeKey}-${acc}`;
}

function computeEvolutionStage(pattern, lineage, binaryMode, dualMode) {
  const depth = lineage.length;

  if (depth === 1) return binaryMode ? "seed-binary" : dualMode ? "seed-dual" : "seed";
  if (depth === 2) return binaryMode ? "sprout-binary" : dualMode ? "sprout-dual" : "sprout";
  if (depth === 3) return binaryMode ? "branch-binary" : dualMode ? "branch-dual" : "branch";

  if (pattern.includes("fuse")) return binaryMode ? "fused-kernel-binary" : "fused-kernel";
  if (pattern.includes("batch")) return binaryMode ? "batched-binary" : "batched";
  if (pattern.includes("stream")) return binaryMode ? "streaming-binary" : "streaming";
  if (pattern.includes("fallback")) return "fallback-aware";

  return binaryMode ? "mature-binary" : dualMode ? "mature-dual" : "mature";
}

function computeModeBias(mode, pressure, factoringSnapshot) {
  const modeLabel = mode || "normal";

  let bias = "neutral";

  if (modeLabel === "latency") bias = "low-latency";
  else if (modeLabel === "throughput") bias = "high-throughput";
  else if (modeLabel === "energy") bias = "low-energy";
  else if (modeLabel === "recovery") bias = "high-reliability";

  const gpuLoad = pressure?.gpuLoadPressure || 0;
  const thermal = pressure?.thermalPressure || 0;
  const mem = pressure?.memoryPressure || 0;
  const meshStorm = pressure?.meshStormPressure || 0;
  const auraTension = pressure?.auraTension || 0;
  const factoringPressure = factoringSnapshot?.factoringPressure || 0;

  if (gpuLoad > 0.7 || thermal > 0.7 || meshStorm > 0.6) {
    bias = "fallback-friendly";
  } else if (mem > 0.7) {
    bias = "memory-conservative";
  }

  if (factoringPressure > 0.5 || auraTension > 0.5) {
    bias = "stability-first";
  }

  return bias;
}

function selectDispatchProfile(pattern, modeBias, binaryMode, dualMode) {
  const base = {
    style: "neutral",
    kernelType: "standard",
    maxBatchSize: 1,
    allowFusion: false,
    allowStreaming: false,
    allowFallbackCPU: true,
    binaryOptimized: false,
    dualModeOptimized: false
  };

  const mark = (profile) => ({
    ...profile,
    binaryOptimized: !!binaryMode,
    dualModeOptimized: !!dualMode
  });

  if (pattern.includes("fuse")) {
    return mark({
      style: "fused",
      kernelType: "fused",
      maxBatchSize: binaryMode ? 16 : 8,
      allowFusion: true,
      allowStreaming: false,
      allowFallbackCPU: true
    });
  }

  if (pattern.includes("batch")) {
    return mark({
      style: "batched",
      kernelType: "batched",
      maxBatchSize: binaryMode ? 128 : 32,
      allowFusion: false,
      allowStreaming: true,
      allowFallbackCPU: true
    });
  }

  if (pattern.includes("stream")) {
    return mark({
      style: "streaming",
      kernelType: "streaming",
      maxBatchSize: binaryMode ? 8 : 4,
      allowFusion: false,
      allowStreaming: true,
      allowFallbackCPU: true
    });
  }

  if (modeBias === "low-latency") {
    return mark({
      style: "latency-first",
      kernelType: "standard",
      maxBatchSize: 1,
      allowFusion: false,
      allowStreaming: false,
      allowFallbackCPU: true
    });
  }

  if (modeBias === "high-throughput") {
    return mark({
      style: "throughput-first",
      kernelType: "batched",
      maxBatchSize: binaryMode ? 256 : 64,
      allowFusion: true,
      allowStreaming: true,
      allowFallbackCPU: true
    });
  }

  if (modeBias === "fallback-friendly") {
    return mark({
      style: "fallback-aware",
      kernelType: "standard",
      maxBatchSize: 2,
      allowFusion: false,
      allowStreaming: false,
      allowFallbackCPU: true
    });
  }

  if (modeBias === "memory-conservative") {
    return mark({
      style: "memory-conservative",
      kernelType: "standard",
      maxBatchSize: 4,
      allowFusion: false,
      allowStreaming: false,
      allowFallbackCPU: true
    });
  }

  if (modeBias === "stability-first") {
    return mark({
      style: "stability-first",
      kernelType: "standard",
      maxBatchSize: 2,
      allowFusion: false,
      allowStreaming: false,
      allowFallbackCPU: true
    });
  }

  return mark(base);
}

function resolveBinaryModeSurface(context = {}) {
  const flags = context.flags || {};
  const binaryMode = !!(flags.binary_mode || context.binaryMode);
  const dualMode = !!(flags.dual_mode || context.dualMode);

  return { binaryMode, dualMode };
}


// ============================================================================
//  FACTORY — Create a Binary GPU Dispatch Descriptor (v11-Evo-binary-Prime)
// ============================================================================

export function createBinaryGPUDispatch({
  jobId,
  pattern,
  payload = {},
  mode = "normal",
  parentLineage = null,
  pressureSnapshot = null,
  factoringSnapshot = null,
  context = {}
}) {
  const { binaryMode, dualMode } = resolveBinaryModeSurface(context);

  const lineage        = buildLineage(parentLineage, pattern);
  const shapeSignature = computeShapeSignature(pattern, lineage, binaryMode, dualMode);
  const evolutionStage = computeEvolutionStage(pattern, lineage, binaryMode, dualMode);
  const modeBias       = computeModeBias(mode, pressureSnapshot || {}, factoringSnapshot || {});
  const profile        = selectDispatchProfile(pattern, modeBias, binaryMode, dualMode);
  const dispatchSignature = computeDispatchSignature(
    pattern,
    binaryMode,
    dualMode,
    profile.style
  );

  const executionContext = {
    binaryMode: binaryMode ? "binary" : dualMode ? "dual" : "non-binary",
    pipelineId: context.pipelineId || "",
    sceneType: context.sceneType || "",
    workloadClass: context.workloadClass || "",
    resolution: context.resolution || "",
    refreshRate: context.refreshRate || 0,
    dispatchSignature,
    shapeSignature
  };

  return {
    GPURole: BinaryGPURole,
    jobId,
    pattern,
    payload,
    mode,
    lineage,
    binaryMode,
    dualMode,
    executionContext,
    meta: {
      shapeSignature,
      dispatchSignature,
      evolutionStage,
      modeBias,
      profile,
      pressureSnapshot: pressureSnapshot || {},
      factoringSnapshot: factoringSnapshot || {}
    }
  };
}


// ============================================================================
//  EVOLUTION ENGINE — evolve an existing Binary GPU dispatch deterministically
// ============================================================================

export function evolveBinaryGPUDispatch(dispatch, context = {}) {
  const { mode: nextMode, pressureSnapshot, factoringSnapshot, ...ctxRest } = context;

  const modeLabel = nextMode || dispatch.mode || "normal";
  const lineage   = Array.isArray(dispatch.lineage) ? dispatch.lineage : [];
  const pattern   = dispatch.pattern;

  const { binaryMode, dualMode } = resolveBinaryModeSurface({
    ...ctxRest,
    flags: {
      ...(ctxRest.flags || {}),
      binary_mode: dispatch.binaryMode,
      dual_mode: dispatch.dualMode
    },
    binaryMode: dispatch.binaryMode,
    dualMode: dispatch.dualMode
  });

  const nextLineage       = buildLineage(lineage, pattern);
  const shapeSignature    = computeShapeSignature(pattern, nextLineage, binaryMode, dualMode);
  const evolutionStage    = computeEvolutionStage(pattern, nextLineage, binaryMode, dualMode);
  const modeBias          = computeModeBias(
    modeLabel,
    pressureSnapshot || dispatch.meta?.pressureSnapshot || {},
    factoringSnapshot || dispatch.meta?.factoringSnapshot || {}
  );
  const profile           = selectDispatchProfile(pattern, modeBias, binaryMode, dualMode);
  const dispatchSignature = computeDispatchSignature(
    pattern,
    binaryMode,
    dualMode,
    profile.style
  );

  const prevExec = dispatch.executionContext || {};
  const executionContext = {
    binaryMode: binaryMode ? "binary" : dualMode ? "dual" : "non-binary",
    pipelineId: ctxRest.pipelineId || prevExec.pipelineId || "",
    sceneType: ctxRest.sceneType || prevExec.sceneType || "",
    workloadClass: ctxRest.workloadClass || prevExec.workloadClass || "",
    resolution: ctxRest.resolution || prevExec.resolution || "",
    refreshRate: ctxRest.refreshRate || prevExec.refreshRate || 0,
    dispatchSignature,
    shapeSignature
  };

  return {
    GPURole: BinaryGPURole,
    jobId: dispatch.jobId,
    pattern,
    payload: dispatch.payload,
    mode: modeLabel,
    lineage: nextLineage,
    binaryMode,
    dualMode,
    executionContext,
    meta: {
      shapeSignature,
      dispatchSignature,
      evolutionStage,
      modeBias,
      profile,
      pressureSnapshot: pressureSnapshot || dispatch.meta?.pressureSnapshot || {},
      factoringSnapshot: factoringSnapshot || dispatch.meta?.factoringSnapshot || {}
    }
  };
}


// ============================================================================
//  PUBLIC ORGAN — PulseBinaryGPU (v11-Evo-binary-Prime)
// ============================================================================

export const PulseBinaryGPU = {

  GPURole: BinaryGPURole,

  plan(
    earn,
    mode = "normal",
    pressureSnapshot = null,
    factoringSnapshot = null,
    context = {}
  ) {
    const jobId   = earn.jobId;
    const pattern = earn.pattern || "gpu-binary-default";
    const payload = earn.payload || {};
    const lineage = earn.lineage || [];

    const ctx = {
      ...context,
      flags: {
        ...(context.flags || {}),
        binary_mode: true
      }
    };

    return createBinaryGPUDispatch({
      jobId,
      pattern,
      payload,
      mode,
      parentLineage: lineage,
      pressureSnapshot,
      factoringSnapshot,
      context: ctx
    });
  },

  evolve(dispatch, context = {}) {
    return evolveBinaryGPUDispatch(dispatch, context);
  },

  diagnostics() {
    return {
      GPURole: BinaryGPURole
    };
  }
};
