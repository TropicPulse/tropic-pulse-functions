// ============================================================================
//  PulseBinaryGPU-v12-Evo-Presence-Max — BINARY GPU ORGAN
//  Deterministic GPU Dispatch Organ • Pattern + Lineage + Shape + Presence
//  Binary/Dual-Mode • Pressure-Aware • Factoring-Aware • Mesh/Aura/Earn-Aware
//  “PLAN ONCE. REUSE FOREVER. NEVER DRIFT.”
// ============================================================================
// --- CORE GPU ORGANS --------------------------------------------------------
import * as PulseGPUBrain              from "./PulseGPUBrain.js";
import * as PulseGPUDrive              from "./PulseGPUDrive.js";
import * as PulseGPUDriveCenter        from "./PulseGPUDriveCenter.js";
import * as PulseGPUDriveEngine        from "./PulseGPUDriveCenter.js";      // alias
import * as PulseGPUSpine              from "./PulseGPUSpine.js";
import * as PulseGPUGeneticMemory      from "./PulseGPUGeneticMemory.js";

// --- GPU COMPUTE / ENGINE ---------------------------------------------------
import * as PulseGPUAstralMuscleSystem from "./PulseGPUAstralMuscleSystem.js";


// --- GPU GUARDIAN / HEALER --------------------------------------------------
import * as PulseGPUGuardianCortex     from "./PulseGPUGuardianCortex.js";
import * as PulseGPULymphNodes         from "./PulseGPULymphNodes.js";

// --- GPU NERVOUS SYSTEMS ----------------------------------------------------
import * as PulseGPUAstralNervousSystem from "./PulseGPUAstralNervousSystem.js";
import * as PulseGPUNervousSystem       from "./PulseGPUNervousSystem.js";

// --- GPU COGNITIVE LAYERS ---------------------------------------------------
import * as PulseGPUCognitiveLayer      from "./PulseGPUCognitiveLayer.js";
import * as PulseGPUCognitiveIntelligence from "./PulseGPUCognitiveIntelligence.js";
import * as PulseGPUWisdomCortex        from "./PulseGPUWisdomCortex.js";

// --- GPU SURVIVAL / INSTINCTS -----------------------------------------------
import * as PulseGPUSurvivalInstincts   from "./PulseGPUSurvivalInstincts.js";

// --- GPU SYNAPSES -----------------------------------------------------------
import * as PulseGPUSynapses            from "./PulseGPUSynapses.js";

// --- GPU COMMANDMENTS -------------------------------------------------------
import * as PulseGPUCommandments        from "./PulseGPUCommandments.js";

export const BinaryGPURole = {
  type: "GPU",
  subsystem: "PulseGPU",
  layer: "ComputeOrgan",
  version: "12.0-Evo-Presence",
  identity: "PulseBinaryGPU-v12-Evo-Presence-Max",

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

    presenceAware: true,
    dnaAware: true,
    versionAware: true,

    zeroCompute: true,
    zeroMutation: true,
    zeroRoutingInfluence: true
  },

  pulseContract: "Pulse-v4-Presence",
  meshContract: "PulseMeshSpine-v12",
  routerContract: "PulseRouter-v12",
  sendContract: "PulseSend-v12",
  earnContract: "Earn-v4-Presence"
};

// ---------------------------------------------------------------------------
//  v12 MetaBlock
// ---------------------------------------------------------------------------
export const BinaryGPUMetaBlock = {
  identity: "PulseBinaryGPU",
  subsystem: "PulseGPU",
  layer: "ComputeOrgan",
  role: "Binary-GPU-Dispatch",
  version: "12.0-Evo-Presence",
  evo: BinaryGPURole.evo
};

// ---------------------------------------------------------------------------
//  INTERNAL HELPERS — deterministic, tiny, pure
// ---------------------------------------------------------------------------

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

function selectDispatchProfile(pattern, modeBias, binaryMode, dualMode, multiInstanceHint) {
  const base = {
    style: "neutral",
    kernelType: "standard",
    maxBatchSize: 1,
    allowFusion: false,
    allowStreaming: false,
    allowFallbackCPU: true,
    binaryOptimized: false,
    dualModeOptimized: false,
    multiInstanceOptimized: !!multiInstanceHint
  };

  const mark = (profile) => ({
    ...profile,
    binaryOptimized: !!binaryMode,
    dualModeOptimized: !!dualMode,
    multiInstanceOptimized: !!multiInstanceHint
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

// v12: advantage score for this dispatch
function computeAdvantageScore({ pattern, modeBias, binaryMode, dualMode, pressureSnapshot }) {
  let score = 0;

  if (binaryMode) score += 2;
  if (dualMode) score += 1;

  if (pattern.includes("fuse")) score += 2;
  if (pattern.includes("batch")) score += 2;
  if (pattern.includes("stream")) score += 1;

  if (modeBias === "high-throughput") score += 2;
  if (modeBias === "low-latency") score += 1;

  const gpuLoad = pressureSnapshot?.gpuLoadPressure || 0;
  if (gpuLoad < 0.3) score += 1; // room to push

  return score;
}

// ---------------------------------------------------------------------------
//  FACTORY — Create a Binary GPU Dispatch Descriptor (v12-Evo-Presence-Max)
// ---------------------------------------------------------------------------

export function createBinaryGPUDispatch({
  jobId,
  pattern,
  payload = {},
  mode = "normal",
  parentLineage = null,
  pressureSnapshot = null,
  factoringSnapshot = null,
  context = {},
  dnaTag = "default-dna",
  version = "12.0-Evo-Presence"
}) {
  const { binaryMode, dualMode } = resolveBinaryModeSurface(context);

  const lineage        = buildLineage(parentLineage, pattern);
  const shapeSignature = computeShapeSignature(pattern, lineage, binaryMode, dualMode);
  const evolutionStage = computeEvolutionStage(pattern, lineage, binaryMode, dualMode);
  const modeBias       = computeModeBias(mode, pressureSnapshot || {}, factoringSnapshot || {});
  const multiInstanceHint = !!context.multiInstance;
  const profile        = selectDispatchProfile(
    pattern,
    modeBias,
    binaryMode,
    dualMode,
    multiInstanceHint
  );
  const dispatchSignature = computeDispatchSignature(
    pattern,
    binaryMode,
    dualMode,
    profile.style
  );

  const advantageScore = computeAdvantageScore({
    pattern,
    modeBias,
    binaryMode,
    dualMode,
    pressureSnapshot: pressureSnapshot || {}
  });

  const executionContext = {
    binaryMode: binaryMode ? "binary" : dualMode ? "dual" : "non-binary",
    pipelineId: context.pipelineId || "",
    sceneType: context.sceneType || "",
    workloadClass: context.workloadClass || "",
    resolution: context.resolution || "",
    refreshRate: context.refreshRate || 0,
    instanceId: context.instanceId || "",
    multiInstance: multiInstanceHint,
    dispatchSignature,
    shapeSignature
  };

  return {
    GPURole: BinaryGPURole,
    metaBlock: BinaryGPUMetaBlock,
    jobId,
    pattern,
    payload,
    mode,
    lineage,
    binaryMode,
    dualMode,
    dnaTag,
    version,
    executionContext,
    meta: {
      shapeSignature,
      dispatchSignature,
      evolutionStage,
      modeBias,
      profile,
      advantageScore,
      pressureSnapshot: pressureSnapshot || {},
      factoringSnapshot: factoringSnapshot || {}
    }
  };
}

// ---------------------------------------------------------------------------
//  EVOLUTION ENGINE — evolve an existing Binary GPU dispatch deterministically
// ---------------------------------------------------------------------------

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
  const multiInstanceHint = !!ctxRest.multiInstance || !!dispatch.executionContext?.multiInstance;
  const profile           = selectDispatchProfile(
    pattern,
    modeBias,
    binaryMode,
    dualMode,
    multiInstanceHint
  );
  const dispatchSignature = computeDispatchSignature(
    pattern,
    binaryMode,
    dualMode,
    profile.style
  );

  const advantageScore = computeAdvantageScore({
    pattern,
    modeBias,
    binaryMode,
    dualMode,
    pressureSnapshot: pressureSnapshot || dispatch.meta?.pressureSnapshot || {}
  });

  const prevExec = dispatch.executionContext || {};
  const executionContext = {
    binaryMode: binaryMode ? "binary" : dualMode ? "dual" : "non-binary",
    pipelineId: ctxRest.pipelineId || prevExec.pipelineId || "",
    sceneType: ctxRest.sceneType || prevExec.sceneType || "",
    workloadClass: ctxRest.workloadClass || prevExec.workloadClass || "",
    resolution: ctxRest.resolution || prevExec.resolution || "",
    refreshRate: ctxRest.refreshRate || prevExec.refreshRate || 0,
    instanceId: ctxRest.instanceId || prevExec.instanceId || "",
    multiInstance: multiInstanceHint,
    dispatchSignature,
    shapeSignature
  };

  return {
    GPURole: BinaryGPURole,
    metaBlock: BinaryGPUMetaBlock,
    jobId: dispatch.jobId,
    pattern,
    payload: dispatch.payload,
    mode: modeLabel,
    lineage: nextLineage,
    binaryMode,
    dualMode,
    dnaTag: dispatch.dnaTag || "default-dna",
    version: dispatch.version || "12.0-Evo-Presence",
    executionContext,
    meta: {
      shapeSignature,
      dispatchSignature,
      evolutionStage,
      modeBias,
      profile,
      advantageScore,
      pressureSnapshot: pressureSnapshot || dispatch.meta?.pressureSnapshot || {},
      factoringSnapshot: factoringSnapshot || dispatch.meta?.factoringSnapshot || {}
    }
  };
}

// ---------------------------------------------------------------------------
//  PUBLIC ORGAN — PulseBinaryGPU (v12-Evo-Presence-Max)
// ---------------------------------------------------------------------------

export const PulseBinaryGPU = {

  GPURole: BinaryGPURole,
  BinaryGPUMetaBlock,

  plan(
    earn,
    mode = "normal",
    pressureSnapshot = null,
    factoringSnapshot = null,
    context = {},
    dnaTag = "default-dna",
    version = "12.0-Evo-Presence"
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
      context: ctx,
      dnaTag,
      version
    });
  },

  evolve(dispatch, context = {}) {
    return evolveBinaryGPUDispatch(dispatch, context);
  },

  diagnostics() {
    return {
      GPURole: BinaryGPURole,
      metaBlock: BinaryGPUMetaBlock
    };
  }
};
