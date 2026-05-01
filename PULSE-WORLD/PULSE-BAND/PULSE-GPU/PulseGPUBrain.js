/* global log,warn */
// ============================================================================
//  PULSE GPU BRAIN v12-Evo-Presence-Max — THE ANALYST CORTEX / BRAINSTEM
//  CPU-SIDE INTELLIGENCE DIVISION (FULL-GPU, API-AGNOSTIC)
//  PURE LOGIC. PURE DETERMINISM. ZERO SIDE EFFECTS.
//  SYMBOLIC + BINARY AWARE • DISPATCH-AWARE • MEMORY-AWARE • PRESENCE-AWARE
// ============================================================================

log(
  "gpu",
  "PulseGPUBrain v12-Evo-Presence-Max — Analyst Cortex / Brainstem active " +
    "(dual-mode + binary + presence, PulseSend‑v12‑ready)."
);

// ------------------------------------------------------
// GLOBAL VERSIONS
// ------------------------------------------------------

const PULSE_GPU_BRAIN_VERSION = "12.0-Evo-Presence-Max";
const PULSE_GPU_BRAIN_SCHEMA_VERSION = 8;

// ------------------------------------------------------
// DUAL-MODE + BINARY + PRESENCE ADVANTAGE BLOCK (v12-Evo-Presence-Max)
// ------------------------------------------------------

const DUAL_MODE_EVO = {
  // Biological / mental
  metabolicBoost: 1.2,
  neuralReflexBoost: 1.2,
  stabilityBoost: 1.3,
  cognitiveStabilityField: true,

  // System / physical
  multiInstanceReady: true,
  deterministicNeuron: true,
  parallelSafe: true,
  fanOutScaling: 1.0,
  clusterCoherence: true,
  zeroDriftCloning: true,
  reflexPropagation: 1.0,
  shaderPipelinePurity: true,

  // Fusion — BOTH layers active
  dualModeEvolution: true,
  organismClusterBoost: 1.1,
  cognitiveComputeLink: true,
  unifiedAdvantageField: true,
  pulseSend12Ready: true,

  // Binary / symbolic awareness
  binaryAware: true,
  symbolicAware: true,
  gpuDispatchAware: true,
  gpuMemoryAware: true,
  gpuAdvantageAware: true,

  // Presence / identity
  presenceAware: true,
  dnaAware: true,
  versionAware: true,

  // PulseSend / organism contracts (conceptual only)
  routingContract: "PulseSend-v12",
  gpuOrganContract: "PulseGPU-v12-Evo-Presence-Max",
  binaryGpuOrganContract: "PulseBinaryGPU-v12-Evo-Presence-Max",
  earnCompatibility: "Earn-v4-Presence",
  workgroupLawVersion: 12,
  zeroImportShaderPipeline: true
};

// ------------------------------------------------------
// PACKAGE DEFINITIONS (STRUCTURAL ONLY) — v12 presence-aware
// ------------------------------------------------------

class PulseTexturePackage {
  constructor({
    id = "textures",
    version = PULSE_GPU_BRAIN_SCHEMA_VERSION,
    optimizedTextures = [],
    mipmaps = [],
    atlasMaps = [],
    metadata = {},
    dnaTag = "default-dna"
  } = {}) {
    this.id = id;
    this.version = version;
    this.optimizedTextures = optimizedTextures;
    this.mipmaps = mipmaps;
    this.atlasMaps = atlasMaps;
    this.metadata = {
      layer: "PulseGPUBrain",
      kind: "texture-package",
      target: "full-gpu",
      evo: DUAL_MODE_EVO,
      brainVersion: PULSE_GPU_BRAIN_VERSION,
      schemaVersion: PULSE_GPU_BRAIN_SCHEMA_VERSION,
      dnaTag,
      ...metadata
    };
  }
}

class PulseMeshPackage {
  constructor({
    id = "meshes",
    version = PULSE_GPU_BRAIN_SCHEMA_VERSION,
    lods = [],
    simplifiedMeshes = [],
    clusters = [],
    indices = [],
    metadata = {},
    dnaTag = "default-dna"
  } = {}) {
    this.id = id;
    this.version = version;
    this.lods = lods;
    this.simplifiedMeshes = simplifiedMeshes;
    this.clusters = clusters;
    this.indices = indices;
    this.metadata = {
      layer: "PulseGPUBrain",
      kind: "mesh-package",
      target: "full-gpu",
      evo: DUAL_MODE_EVO,
      brainVersion: PULSE_GPU_BRAIN_VERSION,
      schemaVersion: PULSE_GPU_BRAIN_SCHEMA_VERSION,
      dnaTag,
      ...metadata
    };
  }
}

class PulseLightingPackage {
  constructor({
    id = "lighting",
    version = PULSE_GPU_BRAIN_SCHEMA_VERSION,
    bakedGI = null,
    bakedAO = null,
    shadowData = null,
    reflectionProbes = [],
    metadata = {},
    dnaTag = "default-dna"
  } = {}) {
    this.id = id;
    this.version = version;
    this.bakedGI = bakedGI;
    this.bakedAO = bakedAO;
    this.shadowData = shadowData;
    this.reflectionProbes = reflectionProbes;
    this.metadata = {
      layer: "PulseGPUBrain",
      kind: "lighting-package",
      target: "full-gpu",
      evo: DUAL_MODE_EVO,
      brainVersion: PULSE_GPU_BRAIN_VERSION,
      schemaVersion: PULSE_GPU_BRAIN_SCHEMA_VERSION,
      dnaTag,
      ...metadata
    };
  }
}

class PulseAnimationPackage {
  constructor({
    id = "animation",
    version = PULSE_GPU_BRAIN_SCHEMA_VERSION,
    bakedFrames = [],
    transitions = [],
    skeletonData = null,
    metadata = {},
    dnaTag = "default-dna"
  } = {}) {
    this.id = id;
    this.version = version;
    this.bakedFrames = bakedFrames;
    this.transitions = transitions;
    this.skeletonData = skeletonData;
    this.metadata = {
      layer: "PulseGPUBrain",
      kind: "animation-package",
      target: "full-gpu",
      evo: DUAL_MODE_EVO,
      brainVersion: PULSE_GPU_BRAIN_VERSION,
      schemaVersion: PULSE_GPU_BRAIN_SCHEMA_VERSION,
      dnaTag,
      ...metadata
    };
  }
}

class PulseShaderPackage {
  constructor({
    id = "shaders",
    version = PULSE_GPU_BRAIN_SCHEMA_VERSION,
    compiledVariants = [],
    pipelineStates = [],
    metadata = {},
    dnaTag = "default-dna"
  } = {}) {
    this.id = id;
    this.version = version;
    this.compiledVariants = compiledVariants;
    this.pipelineStates = pipelineStates;
    this.metadata = {
      layer: "PulseGPUBrain",
      kind: "shader-package",
      target: "full-gpu",
      evo: DUAL_MODE_EVO,
      brainVersion: PULSE_GPU_BRAIN_VERSION,
      schemaVersion: PULSE_GPU_BRAIN_SCHEMA_VERSION,
      shaderContract: "WGSL-v12-Evo-Presence",
      dnaTag,
      ...metadata
    };
  }
}

class PulseRenderPlanPackage {
  constructor({
    id = "render-plan",
    version = PULSE_GPU_BRAIN_SCHEMA_VERSION,
    renderPasses = [],
    drawLists = [],
    materialBatches = [],
    frameGraph = null,
    metadata = {},
    dnaTag = "default-dna"
  } = {}) {
    this.id = id;
    this.version = version;
    this.renderPasses = renderPasses;
    this.drawLists = drawLists;
    this.materialBatches = materialBatches;
    this.frameGraph = frameGraph;
    this.metadata = {
      layer: "PulseGPUBrain",
      kind: "render-plan-package",
      target: "full-gpu",
      evo: DUAL_MODE_EVO,
      brainVersion: PULSE_GPU_BRAIN_VERSION,
      schemaVersion: PULSE_GPU_BRAIN_SCHEMA_VERSION,
      routingContract: "PulseSend-v12",
      renderPlanContract: "PulseGPU-RenderPlan-v12-Evo-Presence",
      frameGraphContract: "FrameGraph-v6",
      dnaTag,
      ...metadata
    };
  }
}

class PulseGPUDispatchHintPackage {
  constructor({
    id = "gpu-dispatch-hints",
    version = PULSE_GPU_BRAIN_SCHEMA_VERSION,
    patternHints = [],
    metadata = {},
    dnaTag = "default-dna"
  } = {}) {
    this.id = id;
    this.version = version;
    this.patternHints = patternHints;
    this.metadata = {
      layer: "PulseGPUBrain",
      kind: "gpu-dispatch-hint-package",
      target: "full-gpu",
      evo: DUAL_MODE_EVO,
      brainVersion: PULSE_GPU_BRAIN_VERSION,
      schemaVersion: PULSE_GPU_BRAIN_SCHEMA_VERSION,
      dispatchHintContract: "PulseGPU-DispatchHints-v12-Evo-Presence",
      dnaTag,
      ...metadata
    };
  }
}

// ------------------------------------------------------
// BRAIN INPUT (RAW ASSET + GPU MEMORY / DISPATCH CONTEXT) — v12
// ------------------------------------------------------

class BrainInput {
  constructor({
    schemaVersion = PULSE_GPU_BRAIN_SCHEMA_VERSION,
    rawTextures = [],
    rawMeshes = [],
    rawAnimations = [],
    rawShaders = [],
    rawScenes = [],
    usagePatterns = {},
    predictionHints = {},

    gpuMemorySnapshot = null,
    gpuDispatchHistory = [],
    gpuAdvantageMap = null,

    dnaTag = "default-dna",
    instanceId = "",
    version = PULSE_GPU_BRAIN_VERSION,
    presenceContext = null
  } = {}) {
    this.schemaVersion = schemaVersion;
    this.rawTextures = rawTextures;
    this.rawMeshes = rawMeshes;
    this.rawAnimations = rawAnimations;
    this.rawShaders = rawShaders;
    this.rawScenes = rawScenes;
    this.usagePatterns = usagePatterns;
    this.predictionHints = predictionHints;

    this.gpuMemorySnapshot = gpuMemorySnapshot;
    this.gpuDispatchHistory = gpuDispatchHistory;
    this.gpuAdvantageMap = gpuAdvantageMap;

    this.dnaTag = dnaTag;
    this.instanceId = instanceId;
    this.version = version;
    this.presenceContext = presenceContext;

    this.evo = DUAL_MODE_EVO;
    this.brainVersion = PULSE_GPU_BRAIN_VERSION;
    this.routingContract = "PulseSend-v12";
    this.gpuOrganContract = "PulseGPU-v12-Evo-Presence-Max";
    this.binaryGpuOrganContract = "PulseBinaryGPU-v12-Evo-Presence-Max";
    this.earnCompatibility = "Earn-v4-Presence";
  }
}

// ------------------------------------------------------
// OPTIMIZATION PIPELINES (PURE, DETERMINISTIC) — v12
// ------------------------------------------------------

class TextureOptimizer {
  static process(rawTextures, brainInput) {
    log(
      "gpu",
      "[Analyst] TextureOptimizer v12-Evo-Presence-Max → pass-through (memory + presence aware)",
      "color:#8BC34A;",
      {
        count: rawTextures.length,
        hasGpuMemory: !!brainInput.gpuMemorySnapshot,
        dnaTag: brainInput.dnaTag,
        instanceId: brainInput.instanceId
      }
    );

    return new PulseTexturePackage({
      optimizedTextures: rawTextures,
      dnaTag: brainInput.dnaTag,
      metadata: {
        sourceCount: rawTextures.length,
        optimizerContract: "TextureOptimizer-v12-Evo-Presence-Max",
        hasGpuMemorySnapshot: !!brainInput.gpuMemorySnapshot,
        instanceId: brainInput.instanceId
      }
    });
  }
}

class MeshOptimizer {
  static process(rawMeshes, brainInput) {
    const dispatchHistoryCount = Array.isArray(brainInput.gpuDispatchHistory)
      ? brainInput.gpuDispatchHistory.length
      : 0;

    log(
      "gpu",
      "[Analyst] MeshOptimizer v12-Evo-Presence-Max → pass-through (dispatch + presence aware)",
      "color:#8BC34A;",
      {
        count: rawMeshes.length,
        dispatchHistoryCount,
        dnaTag: brainInput.dnaTag,
        instanceId: brainInput.instanceId
      }
    );

    return new PulseMeshPackage({
      simplifiedMeshes: rawMeshes,
      dnaTag: brainInput.dnaTag,
      metadata: {
        sourceCount: rawMeshes.length,
        optimizerContract: "MeshOptimizer-v12-Evo-Presence-Max",
        dispatchHistoryCount,
        instanceId: brainInput.instanceId
      }
    });
  }
}

class LightingBaker {
  static process(rawScenes, brainInput) {
    log(
      "gpu",
      "[Analyst] LightingBaker v12-Evo-Presence-Max → placeholder (advantage + presence aware)",
      "color:#8BC34A;",
      {
        sceneCount: rawScenes.length,
        hasAdvantageMap: !!brainInput.gpuAdvantageMap,
        dnaTag: brainInput.dnaTag,
        instanceId: brainInput.instanceId
      }
    );

    return new PulseLightingPackage({
      dnaTag: brainInput.dnaTag,
      metadata: {
        sceneCount: rawScenes.length,
        bakerContract: "LightingBaker-v12-Evo-Presence-Max",
        hasAdvantageMap: !!brainInput.gpuAdvantageMap,
        instanceId: brainInput.instanceId
      }
    });
  }
}

class AnimationBaker {
  static process(rawAnimations, brainInput) {
    const hasUsagePatterns =
      !!brainInput.usagePatterns &&
      Object.keys(brainInput.usagePatterns).length > 0;

    log(
      "gpu",
      "[Analyst] AnimationBaker v12-Evo-Presence-Max → pass-through (usage + presence aware)",
      "color:#8BC34A;",
      {
        clipCount: rawAnimations.length,
        hasUsagePatterns,
        dnaTag: brainInput.dnaTag,
        instanceId: brainInput.instanceId
      }
    );

    return new PulseAnimationPackage({
      bakedFrames: rawAnimations,
      dnaTag: brainInput.dnaTag,
      metadata: {
        clipCount: rawAnimations.length,
        bakerContract: "AnimationBaker-v12-Evo-Presence-Max",
        hasUsagePatterns,
        instanceId: brainInput.instanceId
      }
    });
  }
}

class ShaderCompiler {
  static process(rawShaders, brainInput) {
    const hasDispatchHistory = Array.isArray(brainInput.gpuDispatchHistory)
      ? brainInput.gpuDispatchHistory.length > 0
      : false;

    log(
      "gpu",
      "[Analyst] ShaderCompiler v12-Evo-Presence-Max → pass-through (binary/symbolic + presence aware)",
      "color:#8BC34A;",
      {
        shaderCount: rawShaders.length,
        hasDispatchHistory,
        dnaTag: brainInput.dnaTag,
        instanceId: brainInput.instanceId
      }
    );

    return new PulseShaderPackage({
      compiledVariants: rawShaders,
      dnaTag: brainInput.dnaTag,
      metadata: {
        shaderCount: rawShaders.length,
        compilerContract: "ShaderCompiler-v12-Evo-Presence-Max",
        hasDispatchHistory,
        instanceId: brainInput.instanceId
      }
    });
  }
}

// NEW: GPU Dispatch Hint Builder (symbolic + binary + presence + advantage aware)
class GPUDispatchHintBuilder {
  static process(brainInput) {
    const history = Array.isArray(brainInput.gpuDispatchHistory)
      ? brainInput.gpuDispatchHistory
      : [];

    log(
      "gpu",
      "[Analyst] GPUDispatchHintBuilder v12-Evo-Presence-Max → placeholder",
      "color:#8BC34A;",
      {
        dispatchHistoryCount: history.length,
        hasAdvantageMap: !!brainInput.gpuAdvantageMap,
        dnaTag: brainInput.dnaTag,
        instanceId: brainInput.instanceId
      }
    );

    const patternMap = Object.create(null);

    history.forEach((d) => {
      const pattern = d?.pattern || "gpu-default";
      const key = pattern;
      const bucket = patternMap[key] || {
        pattern,
        count: 0,
        lastMode: d?.mode || "normal",
        lastModeKind: d?.modeKind || "symbolic",
        lastBinaryMode: !!d?.binaryMode,
        lastDualMode: !!d?.dualMode,
        lastAdvantageScore: d?.meta?.advantageScore || 0
      };
      bucket.count += 1;
      bucket.lastMode = d?.mode || bucket.lastMode;
      bucket.lastModeKind = d?.modeKind || bucket.lastModeKind;
      bucket.lastBinaryMode = !!d?.binaryMode;
      bucket.lastDualMode = !!d?.dualMode;
      bucket.lastAdvantageScore =
        typeof d?.meta?.advantageScore === "number"
          ? d.meta.advantageScore
          : bucket.lastAdvantageScore;
      patternMap[key] = bucket;
    });

    const patternHints = Object.values(patternMap).map((bucket) => ({
      pattern: bucket.pattern,
      preferredMode: bucket.lastMode,
      preferredModeKind: bucket.lastModeKind,
      preferBinary: bucket.lastBinaryMode,
      preferDualMode: bucket.lastDualMode,
      observedCount: bucket.count,
      lastAdvantageScore: bucket.lastAdvantageScore
    }));

    return new PulseGPUDispatchHintPackage({
      patternHints,
      dnaTag: brainInput.dnaTag,
      metadata: {
        dispatchHistoryCount: history.length,
        hasAdvantageMap: !!brainInput.gpuAdvantageMap,
        instanceId: brainInput.instanceId
      }
    });
  }
}

// ------------------------------------------------------
// RENDER PLANNER — v12-Evo-Presence-Max
// ------------------------------------------------------

class RenderPlanner {
  static process(rawScenes, usagePatterns, brainInput) {
    const hasUsagePatterns =
      !!usagePatterns && Object.keys(usagePatterns).length > 0;

    log(
      "gpu",
      "RenderPlanner v12-Evo-Presence-Max → placeholder (dispatch + memory + presence aware)",
      {
        sceneCount: rawScenes.length,
        hasUsagePatterns,
        hasGpuMemorySnapshot: !!brainInput.gpuMemorySnapshot,
        dnaTag: brainInput.dnaTag,
        instanceId: brainInput.instanceId
      }
    );

    return new PulseRenderPlanPackage({
      dnaTag: brainInput.dnaTag,
      metadata: {
        sceneCount: rawScenes.length,
        hasUsagePatterns,
        hasGpuMemorySnapshot: !!brainInput.gpuMemorySnapshot,
        plannerContract: "RenderPlanner-v12-Evo-Presence-Max",
        instanceId: brainInput.instanceId
      }
    });
  }
}

// ------------------------------------------------------
// BRAIN ORCHESTRATOR (PURE, SYNCHRONOUS, v12-Evo-Presence-Max)
// ------------------------------------------------------

class PulseGPUBrainController {
  static buildPackages(brainInput) {
    log(
      "gpu",
      "[Analyst] buildPackages() v12-Evo-Presence-Max — starting",
      "color:#03A9F4;",
      {
        schemaVersion: brainInput.schemaVersion,
        brainVersion: PULSE_GPU_BRAIN_VERSION,
        textures: brainInput.rawTextures.length,
        meshes: brainInput.rawMeshes.length,
        animations: brainInput.rawAnimations.length,
        shaders: brainInput.rawShaders.length,
        scenes: brainInput.rawScenes.length,
        hasGpuMemorySnapshot: !!brainInput.gpuMemorySnapshot,
        dispatchHistoryCount: Array.isArray(brainInput.gpuDispatchHistory)
          ? brainInput.gpuDispatchHistory.length
          : 0,
        dnaTag: brainInput.dnaTag,
        instanceId: brainInput.instanceId
      }
    );

    const textures   = TextureOptimizer.process(brainInput.rawTextures, brainInput);
    const meshes     = MeshOptimizer.process(brainInput.rawMeshes, brainInput);
    const lighting   = LightingBaker.process(brainInput.rawScenes, brainInput);
    const animation  = AnimationBaker.process(brainInput.rawAnimations, brainInput);
    const shaders    = ShaderCompiler.process(brainInput.rawShaders, brainInput);
    const renderPlan = RenderPlanner.process(
      brainInput.rawScenes,
      brainInput.usagePatterns,
      brainInput
    );
    const dispatchHints = GPUDispatchHintBuilder.process(brainInput);

    const packageSet = {
      schemaVersion: PULSE_GPU_BRAIN_SCHEMA_VERSION,
      brainVersion: PULSE_GPU_BRAIN_VERSION,
      target: "full-gpu",

      textures,
      meshes,
      lighting,
      animation,
      shaders,
      renderPlan,
      dispatchHints,

      evo: DUAL_MODE_EVO,
      routingContract: "PulseSend-v12",
      gpuOrganContract: "PulseGPU-v12-Evo-Presence-Max",
      binaryGpuOrganContract: "PulseBinaryGPU-v12-Evo-Presence-Max",
      dnaTag: brainInput.dnaTag,
      instanceId: brainInput.instanceId
    };

    log(
      "gpu",
      "[Analyst] buildPackages() v12-Evo-Presence-Max — complete",
      "color:#4CAF50;",
      {
        schemaVersion: packageSet.schemaVersion,
        brainVersion: packageSet.brainVersion
      }
    );

    return packageSet;
  }
}

// ------------------------------------------------------
// EXPORT CONTRACT (SINGLE PACKAGE SET HOLDER)
// ------------------------------------------------------

class PulseGPUBrainExport {
  static packageSet = null;

  static buildAndStore(brainInput) {
    log(
      "gpu",
      "[Analyst] buildAndStore() v12-Evo-Presence-Max",
      "color:#03A9F4;"
    );

    this.packageSet = PulseGPUBrainController.buildPackages(brainInput);

    log(
      "gpu",
      "[Analyst] packageSet stored v12-Evo-Presence-Max",
      "color:#4CAF50;"
    );

    return this.packageSet;
  }

  static exportToRuntime() {
    log(
      "gpu",
      "[Analyst] exportToRuntime() v12-Evo-Presence-Max",
      "color:#03A9F4;",
      { hasPackageSet: !!this.packageSet }
    );

    return this.packageSet;
  }
}

// ------------------------------------------------------
// EXPORTS
// ------------------------------------------------------

export {
  PULSE_GPU_BRAIN_SCHEMA_VERSION,
  BrainInput,
  PulseTexturePackage,
  PulseMeshPackage,
  PulseLightingPackage,
  PulseAnimationPackage,
  PulseShaderPackage,
  PulseRenderPlanPackage,
  PulseGPUDispatchHintPackage,
  TextureOptimizer,
  MeshOptimizer,
  LightingBaker,
  AnimationBaker,
  ShaderCompiler,
  RenderPlanner,
  GPUDispatchHintBuilder,
  PulseGPUBrainController,
  PulseGPUBrainExport
};
