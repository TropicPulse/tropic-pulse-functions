// ============================================================================
//  PULSE GPU ENGINE v11-Evo — THE ASTRAL MUSCLE SYSTEM
//  WebGPU Execution Layer • Frame Conductor • GPU Motor Cortex Surface
//  Dual-Mode (Symbolic + Binary) • Dispatch-Aware • Memory-Aware
// ============================================================================
//
// IDENTITY — THE ASTRAL MUSCLE SYSTEM (v11-Evo):
//  ---------------------------------------------
//  • The GPU organism’s execution muscle.
//  • Takes packages / dispatches from the Momentum Network (Runtime) and turns them into frames.
//  • Executes render pipelines, draws indexed geometry, drives visible motion.
//  • Inherits full organism advantage cascade (dual-mode + binary evolution).
//  • PulseSend‑v11‑ready (routingContract v11).
//
// ROLE IN THE GPU NATION:
//  ------------------------
//  • Brain (Analyst Cortex)      → Precompute intelligence
//  • Momentum Network (Runtime)  → Forward motion + buffer setup
//  • GPU Organs (Symbolic/Binary)→ Dispatch planning (patterns, lineage, shape)
//  • Astral Muscle (THIS FILE)   → Execution muscle (rendering surface)
//  • Guardian Cortex             → Permission + safety
//  • Healer                      → Immune stabilization
//  • Orchestrator                → Brainstem routing
//
// WHAT THIS FILE IS:
//  -------------------
//  • A WebGPU execution surface
//  • A pipeline + render pass builder
//  • A draw executor for mesh buffers
//  • A thin muscle layer over the Runtime
//  • A dispatch-aware, memory-aware execution organ (symbolic + binary friendly)
//
// WHAT THIS FILE IS NOT:
//  -----------------------
//  • NOT a shader compiler
//  • NOT a Brain / precompute organ
//  • NOT a PulseSend router
//  • NOT a business logic module
//  • NOT a GPU dispatch planner (that’s PulseGPU / PulseBinaryGPU)
//
// SAFETY RULES (v11-Evo):
//  ----------------------
//  • NO backend APIs
//  • NO Node.js APIs
//  • NO randomness in execution logic
//  • NO mutation of Brain/Runtime packages
//  • FAIL‑OPEN: if GPU or packages are unavailable, do nothing safely
//
// PULSESEND / EARN / GPU CONTRACT (v11-Evo):
//  -----------------------------------------
//  • routingContract: "PulseSend-v11"
//  • gpuOrganContract: "PulseGPU-v11-Evo"
//  • binaryGpuOrganContract: "PulseBinaryGPU-v11-Evo"
//  • earnCompatibility: "Earn-v3"
// ============================================================================


// ============================================================================
//  ENGINE META — Astral Muscle Identity (v11-Evo)
// ============================================================================
const PULSE_GPU_ENGINE_META = {
  layer: "PulseGPUEngine",
  version: "11.0-Evo",
  target: "full-gpu",
  description: "WebGPU execution layer — Astral Muscle System (dual-mode, memory-aware).",
  evo: {
    // Biological / mental
    metabolicBoost: 1.1,
    neuralReflexBoost: 1.1,
    stabilityBoost: 1.2,

    // System / physical
    multiInstanceReady: true,
    deterministicNeuron: true,
    parallelSafe: true,
    fanOutScaling: 1.0,
    clusterCoherence: true,
    zeroDriftCloning: true,
    reflexPropagation: 1.0,
    shaderPipelinePurity: true,

    // Fusion / dual-mode / binary
    dualModeEvolution: true,
    binaryAware: true,
    symbolicAware: true,
    organismClusterBoost: 1.0,
    cognitiveComputeLink: true,
    unifiedAdvantageField: true,
    pulseSend11Ready: true,

    // Contracts
    routingContract: "PulseSend-v11",
    gpuOrganContract: "PulseGPU-v11-Evo",
    binaryGpuOrganContract: "PulseBinaryGPU-v11-Evo",
    earnCompatibility: "Earn-v3"
  }
};


// ============================================================================
//  GPU MEMORY / DISPATCH HISTORY (in-organ, deterministic)
// ============================================================================
class PulseGPUMemory {
  constructor(maxHistory = 256) {
    this.maxHistory = maxHistory;
    this.history = [];
    this.byPattern = Object.create(null);
    this.meta = { ...PULSE_GPU_ENGINE_META, block: "GPUMemory" };
  }

  recordDispatch(dispatch) {
    if (!dispatch || typeof dispatch !== "object") return;

    const entry = {
      pattern: dispatch.pattern || "gpu-default",
      shapeSignature: dispatch.meta?.shapeSignature || null,
      evolutionStage: dispatch.meta?.evolutionStage || null,
      mode: dispatch.mode || "normal",
      binaryMode: !!dispatch.binaryMode,
      dualMode: !!dispatch.dualMode,
      profile: dispatch.meta?.profile || null
    };

    this.history.push(entry);
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }

    const key = entry.pattern;
    const bucket = this.byPattern[key] || {
      count: 0,
      lastProfile: null,
      lastShapeSignature: null,
      lastEvolutionStage: null,
      lastMode: null,
      lastBinaryMode: null,
      lastDualMode: null
    };

    bucket.count += 1;
    bucket.lastProfile = entry.profile;
    bucket.lastShapeSignature = entry.shapeSignature;
    bucket.lastEvolutionStage = entry.evolutionStage;
    bucket.lastMode = entry.mode;
    bucket.lastBinaryMode = entry.binaryMode;
    bucket.lastDualMode = entry.dualMode;

    this.byPattern[key] = bucket;
  }

  bestProfileForPattern(pattern) {
    const key = pattern || "gpu-default";
    const bucket = this.byPattern[key];
    if (!bucket) return null;

    return {
      profile: bucket.lastProfile,
      shapeSignature: bucket.lastShapeSignature,
      evolutionStage: bucket.lastEvolutionStage,
      mode: bucket.lastMode,
      binaryMode: bucket.lastBinaryMode,
      dualMode: bucket.lastDualMode
    };
  }

  diagnostics() {
    return {
      meta: this.meta,
      totalHistory: this.history.length,
      patternsTracked: Object.keys(this.byPattern).length
    };
  }
}


// ============================================================================
//  RENDER PASS BUILDER
// ============================================================================
class PulseRenderPassBuilder {
  constructor(device, context, format = "bgra8unorm") {
    this.device = device;
    this.context = context;
    this.format = format;
    this.meta = { ...PULSE_GPU_ENGINE_META, block: "RenderPassBuilder" };
  }

  createBasicPassDescriptor() {
    const currentTexture = this.context.getCurrentTexture();
    const view = currentTexture.createView();

    return {
      colorAttachments: [
        {
          view,
          clearValue: { r: 0, g: 0, b: 0, a: 1 },
          loadOp: "clear",
          storeOp: "store"
        }
      ]
    };
  }
}


// ============================================================================
//  PIPELINE BUILDER (deterministic, cache-friendly)
// ============================================================================
class PulsePipelineBuilder {
  constructor(device, colorFormat = "bgra8unorm") {
    this.device = device;
    this.colorFormat = colorFormat;
    this.meta = { ...PULSE_GPU_ENGINE_META, block: "PipelineBuilder" };

    // Simple in-organ cache: shaderModule -> pipeline
    this.pipelineCache = new Map();
  }

  getCacheKey(shaderModule) {
    // Deterministic reference key (no randomness)
    return String(shaderModule);
  }

  createPipeline(shaderModule, vertexLayout) {
    const key = this.getCacheKey(shaderModule);
    if (this.pipelineCache.has(key)) {
      return this.pipelineCache.get(key);
    }

    const pipeline = this.device.createRenderPipeline({
      layout: "auto",
      vertex: {
        module: shaderModule,
        entryPoint: "vs_main",
        buffers: vertexLayout
      },
      fragment: {
        module: shaderModule,
        entryPoint: "fs_main",
        targets: [{ format: this.colorFormat }]
      },
      primitive: {
        topology: "triangle-list"
      }
    });

    this.pipelineCache.set(key, pipeline);
    return pipeline;
  }
}


// ============================================================================
//  DRAW EXECUTOR
// ============================================================================
class PulseDrawExecutor {
  constructor(device, passBuilder) {
    this.device = device;
    this.passBuilder = passBuilder;
    this.meta = { ...PULSE_GPU_ENGINE_META, block: "DrawExecutor" };
  }

  drawMesh(encoder, pipeline, meshBuffers) {
    if (!pipeline || !meshBuffers) return;

    const passDesc = this.passBuilder.createBasicPassDescriptor();
    const pass = encoder.beginRenderPass(passDesc);

    pass.setPipeline(pipeline);
    pass.setVertexBuffer(0, meshBuffers.vertexBuffer);
    pass.setIndexBuffer(meshBuffers.indexBuffer, "uint32");

    const indexCount =
      typeof meshBuffers.indexCount === "number"
        ? meshBuffers.indexCount
        : meshBuffers.indexBuffer.size / 4;

    pass.drawIndexed(indexCount);
    pass.end();
  }
}


// ============================================================================
//  MAIN ENGINE (WebGPU Backend) — Astral Muscle (v11-Evo)
//  Dual-Mode Aware • Dispatch-Aware • Memory-Aware
// ============================================================================
class PulseGPUEngine {
  constructor({ gpuSpine = null } = {}) {
    // gpuSpine is optional: a higher-level organ that plans symbolic/binary dispatches.
    this.runtime = new PulseGPURuntime();

    this.device = null;
    this.context = null;
    this.colorFormat = "bgra8unorm";

    this.pipelineBuilder = null;
    this.passBuilder = null;
    this.drawExecutor = null;

    this.ready = false;

    this.evo = { ...PULSE_GPU_ENGINE_META.evo };
    this.meta = { ...PULSE_GPU_ENGINE_META };

    // GPU memory / dispatch history
    this.gpuMemory = new PulseGPUMemory();

    // Optional spine (symbolic + binary planner)
    this.gpuSpine = gpuSpine;

    log(
      "gpu",
      "[PulseGPUEngine v11-Evo] Constructed — awaiting init().",
      "color:#03A9F4; font-weight:bold;"
    );
  }

  async init(canvas) {
    if (!canvas) {
      warn("gpu", "No canvas provided — engine inactive (fail-open).");
      this.ready = false;
      return;
    }

    try {
      await this.runtime.init(canvas);
    } catch (err) {
      warn("gpu", "Runtime init failed (fail-open).", err);
      this.ready = false;
      return;
    }

    const gpuContext =
      this.runtime.getGPUContext?.() || this.runtime.context;

    if (!gpuContext || !gpuContext.device || !gpuContext.context) {
      warn("gpu", "GPU context unavailable — engine inactive (fail-open).");
      this.ready = false;
      return;
    }

    this.device = gpuContext.device;
    this.context = gpuContext.context;
    this.colorFormat = gpuContext.format || "bgra8unorm";

    this.pipelineBuilder = new PulsePipelineBuilder(this.device, this.colorFormat);
    this.passBuilder = new PulseRenderPassBuilder(this.device, this.context, this.colorFormat);
    this.drawExecutor = new PulseDrawExecutor(this.device, this.passBuilder);

    this.ready = true;

    log("gpu", "PulseGPUEngine v11-Evo ready — WebGPU backend active (Astral Muscle).");
  }

  // Build pipelines from shaders (with cache)
  buildPipelines() {
    const shaders =
      this.runtime.getShadersFromPackages?.() ||
      this.runtime.getShaders?.() ||
      [];

    if (!Array.isArray(shaders) || shaders.length === 0) return [];

    return shaders.map((shaderModule) =>
      this.pipelineBuilder.createPipeline(shaderModule, [
        {
          arrayStride: 12,
          attributes: [{ shaderLocation: 0, offset: 0, format: "float32x3" }]
        }
      ])
    );
  }

  // Optional: use dispatch descriptors from GPU organs (symbolic + binary)
  getDispatches() {
    // Prefer runtime-provided dispatches (planned by PulseGPU / PulseBinaryGPU / Spine)
    const fromRuntime =
      this.runtime.getGPUDispatchesFromPackages?.() ||
      this.runtime.getGPUDispatches?.() ||
      [];

    if (Array.isArray(fromRuntime) && fromRuntime.length > 0) {
      return fromRuntime;
    }

    // If a gpuSpine is injected and runtime exposes Earn frames, we can plan here
    const earnFrame = this.runtime.getCurrentEarnFrame?.();
    if (this.gpuSpine && earnFrame) {
      const dispatch = this.gpuSpine.plan(
        earnFrame,
        "normal",
        earnFrame.pressureSnapshot || null,
        earnFrame.factoringSnapshot || null,
        earnFrame.context || {}
      );
      return dispatch ? [dispatch] : [];
    }

    return [];
  }

  // Core render loop — now dispatch-aware + memory-aware
  renderFrame() {
    if (!this.ready) return;

    const meshes =
      this.runtime.getMeshesFromPackages?.() ||
      this.runtime.getMeshes?.() ||
      [];
    const shaders =
      this.runtime.getShadersFromPackages?.() ||
      this.runtime.getShaders?.() ||
      [];

    if (!meshes.length || !shaders.length) return;

    const pipelines = this.buildPipelines();
    if (!pipelines.length) return;

    const encoder = this.device.createCommandEncoder();

    const dispatches = this.getDispatches();

    if (dispatches.length > 0) {
      // Dispatch-aware path: use planned GPU dispatches to drive draw order
      dispatches.forEach((dispatch, i) => {
        this.gpuMemory.recordDispatch(dispatch);

        const meshIndex = i % meshes.length;
        const pipelineIndex = i % pipelines.length;

        const meshBuffers = meshes[meshIndex];
        const pipeline = pipelines[pipelineIndex];

        this.drawExecutor.drawMesh(encoder, pipeline, meshBuffers);
      });
    } else {
      // Legacy path: simple mesh → pipeline mapping
      meshes.forEach((meshBuffers, i) => {
        const pipeline = pipelines[i % pipelines.length];
        this.drawExecutor.drawMesh(encoder, pipeline, meshBuffers);
      });
    }

    const commandBuffer = encoder.finish();
    this.device.queue.submit([commandBuffer]);
  }

  diagnostics() {
    return {
      meta: this.meta,
      evo: this.evo,
      gpuMemory: this.gpuMemory.diagnostics()
    };
  }
}


// ============================================================================
//  EXPORTS
// ============================================================================
export {
  PulseGPUEngine,
  PulsePipelineBuilder,
  PulseRenderPassBuilder,
  PulseDrawExecutor,
  PulseGPUMemory,
  PULSE_GPU_ENGINE_META
};
