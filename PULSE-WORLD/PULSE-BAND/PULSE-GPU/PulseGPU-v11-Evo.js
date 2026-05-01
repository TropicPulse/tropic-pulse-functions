// ============================================================================
//  PulseGPU-v12-Evo-Presence-Max — UNIFIED GPU ORGAN
//  Deterministic GPU Dispatch Organ • Pattern + Lineage + Shape + Presence
//  Dual-Mode: Binary + Symbolic • Multi-Instance • Advantage-Aware
//  “PLAN ONCE. REUSE FOREVER. NEVER DRIFT.”
//  • Still: metadata-only, zero GPU calls, zero side effects
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

export const GPURole = {
  type: "GPU",
  subsystem: "PulseGPU",
  layer: "ComputeOrgan",
  version: "12.0-Evo-Presence",
  identity: "PulseGPU-v12-Evo-Presence-Max",

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

    dualModeEvolution: true,
    binaryAware: true,
    symbolicAware: true,

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
export const GPUMetaBlock = {
  identity: "PulseGPU",
  subsystem: "PulseGPU",
  layer: "ComputeOrgan",
  role: "Unified-GPU-Dispatch",
  version: "12.0-Evo-Presence",
  evo: GPURole.evo
};

// ============================================================================
//  INTERNAL HELPERS — deterministic, tiny, pure
// ============================================================================

function buildLineage(parentLineage, pattern) {
  const base = Array.isArray(parentLineage) ? parentLineage : [];
  return [...base, pattern];
}

function computeShapeSignature(pattern, lineage, modeKind) {
  const lineageKey = lineage.join("::");
  const raw = `gpu::${modeKind}::${pattern}::${lineageKey}`;

  let acc = 0;
  for (let i = 0; i < raw.length; i++) {
    acc = (acc + raw.charCodeAt(i) * (i + 1)) % 100000;
  }

  return `gpu-shape-${modeKind}-${acc}`;
}

function computeDispatchSignature(pattern, modeKind, profileStyle) {
  const raw = `dispatch::${modeKind}::${pattern}::${profileStyle}`;
  let acc = 0;
  for (let i = 0; i < raw.length; i++) {
    acc = (acc * 31 + raw.charCodeAt(i)) % 100000;
  }
  return `gpu-dispatch-${modeKind}-${acc}`;
}

function computeEvolutionStage(pattern, lineage) {
  const depth = lineage.length;

  if (depth === 1) return "seed";
  if (depth === 2) return "sprout";
  if (depth === 3) return "branch";

  if (pattern.includes("fuse")) return "fused-kernel";
  if (pattern.includes("batch")) return "batched";
  if (pattern.includes("stream")) return "streaming";
  if (pattern.includes("fallback")) return "fallback-aware";

  return "mature";
}

function resolveModeKind(modeKind) {
  if (modeKind === "binary") return "binary";
  if (modeKind === "symbolic") return "symbolic";
  return "symbolic";
}

function computeModeBias(mode, pressure, modeKind) {
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

  if (gpuLoad > 0.7 || thermal > 0.7 || meshStorm > 0.6) {
    bias = "fallback-friendly";
  } else if (mem > 0.7) {
    bias = "memory-conservative";
  }

  if (modeKind === "binary" && bias === "high-throughput") {
    return "binary-throughput";
  }
  if (modeKind === "binary" && bias === "low-latency") {
    return "binary-latency";
  }

  if (auraTension > 0.5) {
    return "stability-first";
  }

  return bias;
}

function selectDispatchProfile(pattern, modeBias, modeKind, multiInstanceHint) {
  const base = {
    style: "neutral",
    kernelType: modeKind === "binary" ? "binary-standard" : "standard",
    maxBatchSize: 1,
    allowFusion: false,
    allowStreaming: false,
    allowFallbackCPU: true,
    modeKind,
    multiInstanceOptimized: !!multiInstanceHint
  };

  const mark = (profile) => ({
    ...profile,
    modeKind,
    multiInstanceOptimized: !!multiInstanceHint
  });

  if (pattern.includes("fuse")) {
    return mark({
      style: modeKind === "binary" ? "binary-fused" : "fused",
      kernelType: modeKind === "binary" ? "binary-fused" : "fused",
      maxBatchSize: 8,
      allowFusion: true,
      allowStreaming: false,
      allowFallbackCPU: true
    });
  }

  if (pattern.includes("batch")) {
    return mark({
      style: modeKind === "binary" ? "binary-batched" : "batched",
      kernelType: modeKind === "binary" ? "binary-batched" : "batched",
      maxBatchSize: 32,
      allowFusion: false,
      allowStreaming: true,
      allowFallbackCPU: true
    });
  }

  if (pattern.includes("stream")) {
    return mark({
      style: modeKind === "binary" ? "binary-streaming" : "streaming",
      kernelType: modeKind === "binary" ? "binary-streaming" : "streaming",
      maxBatchSize: 4,
      allowFusion: false,
      allowStreaming: true,
      allowFallbackCPU: true
    });
  }

  if (modeBias === "low-latency" || modeBias === "binary-latency") {
    return mark({
      style: modeKind === "binary" ? "binary-latency-first" : "latency-first",
      kernelType: modeKind === "binary" ? "binary-standard" : "standard",
      maxBatchSize: 1,
      allowFusion: false,
      allowStreaming: false,
      allowFallbackCPU: true
    });
  }

  if (modeBias === "high-throughput" || modeBias === "binary-throughput") {
    return mark({
      style: modeKind === "binary" ? "binary-throughput-first" : "throughput-first",
      kernelType: modeKind === "binary" ? "binary-batched" : "batched",
      maxBatchSize: 64,
      allowFusion: true,
      allowStreaming: true,
      allowFallbackCPU: true
    });
  }

  if (modeBias === "fallback-friendly") {
    return mark({
      style: modeKind === "binary" ? "binary-fallback-aware" : "fallback-aware",
      kernelType: modeKind === "binary" ? "binary-standard" : "standard",
      maxBatchSize: 2,
      allowFusion: false,
      allowStreaming: false,
      allowFallbackCPU: true
    });
  }

  if (modeBias === "memory-conservative") {
    return mark({
      style: modeKind === "binary"
        ? "binary-memory-conservative"
        : "memory-conservative",
      kernelType: modeKind === "binary" ? "binary-standard" : "standard",
      maxBatchSize: 4,
      allowFusion: false,
      allowStreaming: false,
      allowFallbackCPU: true
    });
  }

  if (modeBias === "stability-first") {
    return mark({
      style: modeKind === "binary"
        ? "binary-stability-first"
        : "stability-first",
      kernelType: modeKind === "binary" ? "binary-standard" : "standard",
      maxBatchSize: 2,
      allowFusion: false,
      allowStreaming: false,
      allowFallbackCPU: true
    });
  }

  return base;
}

function computeAdvantageScore({ pattern, modeBias, modeKind, pressureSnapshot }) {
  let score = 0;

  if (modeKind === "binary") score += 2;
  if (pattern.includes("fuse")) score += 2;
  if (pattern.includes("batch")) score += 2;
  if (pattern.includes("stream")) score += 1;

  if (modeBias === "high-throughput" || modeBias === "binary-throughput") score += 2;
  if (modeBias === "low-latency" || modeBias === "binary-latency") score += 1;

  const gpuLoad = pressureSnapshot?.gpuLoadPressure || 0;
  if (gpuLoad < 0.3) score += 1;

  return score;
}

// ============================================================================
//  FACTORY — Create a GPU Dispatch Descriptor (v12-Evo-Presence-Max)
// ============================================================================

export function createGPUDispatch({
  jobId,
  pattern,
  payload = {},
  mode = "normal",
  modeKind = "symbolic",
  parentLineage = null,
  pressureSnapshot = null,
  executionContext = {},
  dnaTag = "default-dna",
  version = "12.0-Evo-Presence"
}) {
  const resolvedModeKind = resolveModeKind(modeKind);
  const lineage          = buildLineage(parentLineage, pattern);
  const evolutionStage   = computeEvolutionStage(pattern, lineage);
  const modeBias         = computeModeBias(mode, pressureSnapshot || {}, resolvedModeKind);
  const multiInstanceHint = !!executionContext.multiInstance;
  const profile          = selectDispatchProfile(
    pattern,
    modeBias,
    resolvedModeKind,
    multiInstanceHint
  );
  const shapeSignature   = computeShapeSignature(pattern, lineage, resolvedModeKind);
  const dispatchSignature = computeDispatchSignature(
    pattern,
    resolvedModeKind,
    profile.style
  );

  const advantageScore = computeAdvantageScore({
    pattern,
    modeBias,
    modeKind: resolvedModeKind,
    pressureSnapshot: pressureSnapshot || {}
  });

  const execCtx = {
    binaryMode: resolvedModeKind === "binary" ? "binary" : "non-binary",
    pipelineId: executionContext.pipelineId || "",
    sceneType: executionContext.sceneType || "",
    workloadClass: executionContext.workloadClass || "",
    resolution: executionContext.resolution || "",
    refreshRate: executionContext.refreshRate || 0,
    instanceId: executionContext.instanceId || "",
    multiInstance: multiInstanceHint,
    dispatchSignature,
    shapeSignature
  };

  return {
    GPURole,
    GPUMetaBlock,
    jobId,
    pattern,
    payload,
    mode,
    modeKind: resolvedModeKind,
    lineage,
    dnaTag,
    version,
    executionContext: execCtx,
    meta: {
      shapeSignature,
      dispatchSignature,
      evolutionStage,
      modeBias,
      profile,
      advantageScore,
      pressureSnapshot: pressureSnapshot || {}
    }
  };
}

// ============================================================================
//  EVOLUTION ENGINE — evolve an existing GPU dispatch deterministically
// ============================================================================

export function evolveGPUDispatch(dispatch, context = {}) {
  const {
    mode: nextMode,
    modeKind: nextModeKind,
    pressureSnapshot,
    executionContext
  } = context;

  const modeLabel        = nextMode || dispatch.mode || "normal";
  const resolvedModeKind = resolveModeKind(nextModeKind || dispatch.modeKind || "symbolic");
  const lineage          = Array.isArray(dispatch.lineage) ? dispatch.lineage : [];
  const pattern          = dispatch.pattern;

  const nextLineage       = buildLineage(lineage, pattern);
  const evolutionStage    = computeEvolutionStage(pattern, nextLineage);
  const modeBias          = computeModeBias(
    modeLabel,
    pressureSnapshot || dispatch.meta?.pressureSnapshot || {},
    resolvedModeKind
  );
  const multiInstanceHint = !!executionContext?.multiInstance ||
    !!dispatch.executionContext?.multiInstance;
  const profile           = selectDispatchProfile(
    pattern,
    modeBias,
    resolvedModeKind,
    multiInstanceHint
  );
  const shapeSignature    = computeShapeSignature(pattern, nextLineage, resolvedModeKind);
  const dispatchSignature = computeDispatchSignature(
    pattern,
    resolvedModeKind,
    profile.style
  );

  const advantageScore = computeAdvantageScore({
    pattern,
    modeBias,
    modeKind: resolvedModeKind,
    pressureSnapshot: pressureSnapshot || dispatch.meta?.pressureSnapshot || {}
  });

  const prevExec = dispatch.executionContext || {};
  const execCtx = {
    binaryMode: resolvedModeKind === "binary" ? "binary" : "non-binary",
    pipelineId: executionContext?.pipelineId || prevExec.pipelineId || "",
    sceneType: executionContext?.sceneType || prevExec.sceneType || "",
    workloadClass: executionContext?.workloadClass || prevExec.workloadClass || "",
    resolution: executionContext?.resolution || prevExec.resolution || "",
    refreshRate: executionContext?.refreshRate || prevExec.refreshRate || 0,
    instanceId: executionContext?.instanceId || prevExec.instanceId || "",
    multiInstance: multiInstanceHint,
    dispatchSignature,
    shapeSignature
  };

  return {
    GPURole,
    GPUMetaBlock,
    jobId: dispatch.jobId,
    pattern,
    payload: dispatch.payload,
    mode: modeLabel,
    modeKind: resolvedModeKind,
    lineage: nextLineage,
    dnaTag: dispatch.dnaTag || "default-dna",
    version: dispatch.version || "12.0-Evo-Presence",
    executionContext: execCtx,
    meta: {
      shapeSignature,
      dispatchSignature,
      evolutionStage,
      modeBias,
      profile,
      advantageScore,
      pressureSnapshot: pressureSnapshot || dispatch.meta?.pressureSnapshot || {}
    }
  };
}

// ============================================================================
//  PUBLIC ORGAN — PulseGPU (v12-Evo-Presence-Max, dual-mode)
// ============================================================================

export const PulseGPU = {

  GPURole,
  GPUMetaBlock,

  plan(
    earn,
    mode = "normal",
    modeKind = "symbolic",
    pressureSnapshot = null,
    executionContext = {},
    dnaTag = "default-dna",
    version = "12.0-Evo-Presence"
  ) {
    const jobId   = earn.jobId;
    const pattern = earn.pattern || "gpu-default";
    const payload = earn.payload || {};
    const lineage = earn.lineage || [];

    return createGPUDispatch({
      jobId,
      pattern,
      payload,
      mode,
      modeKind,
      parentLineage: lineage,
      pressureSnapshot,
      executionContext,
      dnaTag,
      version
    });
  },

  evolve(dispatch, context = {}) {
    return evolveGPUDispatch(dispatch, context);
  },

  diagnostics() {
    return {
      GPURole,
      GPUMetaBlock
    };
  }
};
