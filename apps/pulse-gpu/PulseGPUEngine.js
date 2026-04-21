// ============================================================================
//  PULSE GPU ENGINE v7.7 — THE ASTRAL MUSCLE SYSTEM
//  WebGPU Execution Layer (Frontend-Only, Deterministic, Fail-Open)
//  PURE RENDERING. ZERO BUSINESS LOGIC. ZERO SIDE EFFECTS OUTSIDE init()/render.
// ============================================================================
//
// PERSONALITY + ROLE:
//  -------------------
//  PulseGPUEngine is the “muscle + motion” of the GPU subsystem.
//  • Runtime = “nervous system” (Momentum Network)
//  • Brain   = “thinking / preparation” (Analyst Cortex)
//  • Engine  = “muscle + motion / contraction layer” (THIS FILE)
//
//  Execution personality:
//    - Calm under failure (fail-open)
//    - Predictable under load (deterministic)
//    - Honest about readiness (visible flags)
//    - Never surprises the caller (no hidden work)
//    - Never mutates runtime internals
//
// WHAT THIS FILE IS:
//  -------------------
//  • A WebGPU backend implementation of the Pulse GPU engine
//  • A renderer that consumes GPU-ready packages from PulseGPURuntime
//  • A pipeline + pass + draw-call executor
//
// WHAT THIS FILE IS NOT:
//  -----------------------
//  • NOT a CPU optimizer (PulseGPUBrain does that)
//  • NOT a GPU memory orchestrator (PulseGPURuntime does that)
//  • NOT a shader compiler (Brain again)
//  • NOT a backend module
//  • NOT a business logic layer
//
// SAFETY CONTRACT (v7.7):
//  -----------------------
//  • Browser-only (WebGPU required)
//  • No DOM manipulation outside canvas/context
//  • No Node APIs
//  • No randomness
//  • No timestamps
//  • No async except init()
//  • Fail-open: missing GPU → no render, no crash
//  • Deterministic: same inputs → same frame behavior
//
// DUAL-MODE ADVANTAGE (conceptual only):
//  --------------------------------------
//  • Biological / mental:
//      - metabolicBoost: conceptual execution efficiency
//      - neuralReflexBoost: conceptual frame reflex speed
//      - stabilityBoost: conceptual stability under load
//  • System / physical:
//      - multiInstanceReady: safe to run many engines in parallel
//      - deterministicNeuron: same inputs → same outputs
//      - parallelSafe: conceptual multi-engine scaling
//      - fanOutScaling: conceptual throughput scaling
//      - clusterCoherence: conceptual sync across engines
//      - zeroDriftCloning: conceptual no-drift replication
//  • Fusion (AND-architecture):
//      - dualModeEvolution: mental + physical evolution together
//      - organismClusterBoost: conceptual boost when many engines run
//      - cognitiveComputeLink: conceptual link to Brain + Runtime
//      - unifiedAdvantageField: no OR, both layers always on
// ============================================================================

import { PulseGPURuntime } from "./PulseGPURuntime.js";

// ============================================================================
//  ENGINE META — Astral Muscle Identity
// ============================================================================
const PULSE_GPU_ENGINE_META = {
  layer: "PulseGPUEngine",
  version: 7.7,
  target: "full-gpu",
  description: "WebGPU execution layer — Astral Muscle System.",
  evo: {
    metabolicBoost: 1.0,
    neuralReflexBoost: 1.0,
    stabilityBoost: 1.0,

    multiInstanceReady: true,
    deterministicNeuron: true,
    parallelSafe: true,
    fanOutScaling: 1.0,
    clusterCoherence: true,
    zeroDriftCloning: true,
    reflexPropagation: 1.0,

    dualModeEvolution: true,
    organismClusterBoost: 1.0,
    cognitiveComputeLink: true,
    unifiedAdvantageField: true
  }
};

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
//  PIPELINE BUILDER
// ============================================================================
class PulsePipelineBuilder {
  constructor(device, colorFormat = "bgra8unorm") {
    this.device = device;
    this.colorFormat = colorFormat;
    this.meta = { ...PULSE_GPU_ENGINE_META, block: "PipelineBuilder" };
  }

  createPipeline(shaderModule, vertexLayout) {
    return this.device.createRenderPipeline({
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
//  MAIN ENGINE (WebGPU Backend) — Astral Muscle
// ============================================================================
class PulseGPUEngine {
  constructor() {
    this.runtime = new PulseGPURuntime();

    this.device = null;
    this.context = null;
    this.colorFormat = "bgra8unorm";

    this.pipelineBuilder = null;
    this.passBuilder = null;
    this.drawExecutor = null;

    this.ready = false;

    // Conceptual evolutionary state (no logic impact)
    this.evo = { ...PULSE_GPU_ENGINE_META.evo };

    log(
      "gpu",
      "[PulseGPUEngine] Constructed — awaiting init().",
      "color:#03A9F4; font-weight:bold;"
    );
  }

  // ----------------------------------------------------
  // INITIALIZE ENGINE (FAIL-OPEN)
  // ----------------------------------------------------
  async init(canvas) {
    if (!canvas) {
      warn(
        "gpu",
        "No canvas provided — engine will remain inactive (fail-open)."
      );
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
      warn(
        "gpu",
        "GPU context unavailable — engine inactive (fail-open)."
      );
      this.ready = false;
      return;
    }

    this.device = gpuContext.device;
    this.context = gpuContext.context;
    this.colorFormat = gpuContext.format || "bgra8unorm";

    this.pipelineBuilder = new PulsePipelineBuilder(
      this.device,
      this.colorFormat
    );
    this.passBuilder = new PulseRenderPassBuilder(
      this.device,
      this.context,
      this.colorFormat
    );
    this.drawExecutor = new PulseDrawExecutor(this.device, this.passBuilder);

    this.ready = true;

    log(
      "gpu",
      "PulseGPUEngine ready — WebGPU backend active (Astral Muscle)."
    );
  }

  // ----------------------------------------------------
  // BUILD PIPELINES
  // ----------------------------------------------------
  buildPipelines() {
    const shaders =
      this.runtime.getShadersFromPackages?.() ||
      this.runtime.getShaders?.() ||
      [];

    if (!Array.isArray(shaders) || shaders.length === 0) return [];

    const pipelines = shaders.map((shaderModule) =>
      this.pipelineBuilder.createPipeline(shaderModule, [
        {
          arrayStride: 12,
          attributes: [{ shaderLocation: 0, offset: 0, format: "float32x3" }]
        }
      ])
    );

    return pipelines;
  }

  // ----------------------------------------------------
  // RENDER FRAME (FAIL-OPEN)
  // ----------------------------------------------------
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

    meshes.forEach((meshBuffers, i) => {
      const pipeline = pipelines[i % pipelines.length];
      this.drawExecutor.drawMesh(encoder, pipeline, meshBuffers);
    });

    const commandBuffer = encoder.finish();
    this.device.queue.submit([commandBuffer]);
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
  PULSE_GPU_ENGINE_META
};
