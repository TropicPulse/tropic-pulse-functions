// ============================================================================
//  PULSE GPU ENGINE v9.2 — THE ASTRAL MUSCLE SYSTEM
//  WebGPU Execution Layer • Frame Conductor • GPU Motor Cortex Surface
// ============================================================================
//
// IDENTITY — THE ASTRAL MUSCLE SYSTEM (v9.2):
//  -------------------------------------------
//  • The GPU organism’s execution muscle.
//  • Takes packages from the Momentum Network (Runtime) and turns them into frames.
//  • Executes render pipelines, draws indexed geometry, drives visible motion.
//  • Inherits full organism advantage cascade (dual‑mode evolution).
//  • PulseSend‑2.0‑ready (routingContract v2).
//
// ROLE IN THE GPU NATION:
//  ------------------------
//  • Brain (Analyst Cortex) → Precompute intelligence
//  • Momentum Network (Runtime) → Forward motion + buffer setup
//  • Astral Muscle (THIS FILE) → Execution muscle (rendering surface)
//  • Guardian Cortex → Permission + safety
//  • Healer → Immune stabilization
//  • Orchestrator → Brainstem routing
//
// WHAT THIS FILE IS:
//  -------------------
//  • A WebGPU execution surface
//  • A pipeline + render pass builder
//  • A draw executor for mesh buffers
//  • A thin muscle layer over the Runtime
//
// WHAT THIS FILE IS NOT:
//  -----------------------
//  • NOT a shader compiler
//  • NOT a Brain / precompute organ
//  • NOT a PulseSend router
//  • NOT a business logic module
//
// SAFETY RULES (v9.2):
//  --------------------
//  • NO backend APIs
//  • NO Node.js APIs
//  • NO randomness in execution logic
//  • NO mutation of Brain/Runtime packages
//  • FAIL‑OPEN: if GPU or packages are unavailable, do nothing safely
//
// PULSESEND / EARN CONTRACT (v9.2):
//  ---------------------------------
//  • routingContract: "PulseSend-v2"
//  • gpuOrganContract: "PulseGPU-v9.2"
//  • earnCompatibility: "PulseEarn-v9"
// ============================================================================

import { PulseGPURuntime } from "./PulseGPUDrive.js";

// ============================================================================
//  ENGINE META — Astral Muscle Identity (v9.2)
// ============================================================================
const PULSE_GPU_ENGINE_META = {
  layer: "PulseGPUEngine",
  version: 9.2,
  target: "full-gpu",
  description: "WebGPU execution layer — Astral Muscle System.",
  evo: {
    // Biological / mental
    metabolicBoost: 1.0,
    neuralReflexBoost: 1.0,
    stabilityBoost: 1.0,

    // System / physical
    multiInstanceReady: true,
    deterministicNeuron: true,
    parallelSafe: true,
    fanOutScaling: 1.0,
    clusterCoherence: true,
    zeroDriftCloning: true,
    reflexPropagation: 1.0,
    shaderPipelinePurity: true,

    // Fusion
    dualModeEvolution: true,
    organismClusterBoost: 1.0,
    cognitiveComputeLink: true,
    unifiedAdvantageField: true,
    pulseSend2Ready: true,

    // Contracts
    routingContract: "PulseSend-v2",
    gpuOrganContract: "PulseGPU-v9.2",
    earnCompatibility: "PulseEarn-v9"
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

    this.evo = { ...PULSE_GPU_ENGINE_META.evo };

    log(
      "gpu",
      "[PulseGPUEngine v9.2] Constructed — awaiting init().",
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

    log("gpu", "PulseGPUEngine v9.2 ready — WebGPU backend active (Astral Muscle).");
  }

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
