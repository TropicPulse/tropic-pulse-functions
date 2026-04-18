// ============================================================================
//  PULSE GPU ENGINE v6.3
//  WebGPU Execution Layer (Frontend-Only, Deterministic, Fail-Open)
//  PURE RENDERING. ZERO BUSINESS LOGIC. ZERO SIDE EFFECTS OUTSIDE init()/render.
// ============================================================================
//
// PERSONALITY + ROLE:
//  -------------------
//  PulseGPUEngine is the “hands” of the GPU subsystem.
//  • Runtime = “nervous system”
//  • Brain = “thinking / preparation”
//  • Engine = “muscle + motion”
//
//  This file gives the GPU subsystem its *execution personality*:
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
// SAFETY CONTRACT:
//  ----------------
//  • Browser-only (WebGPU required)
//  • No DOM manipulation outside canvas/context
//  • No Node APIs
//  • No randomness
//  • No timestamps
//  • No async except init()
//  • Fail-open: missing GPU → no render, no crash
//  • Deterministic: same inputs → same frame behavior
//
// ============================================================================

import { PulseGPURuntime } from "./PulseGPURuntime.js";

// ============================================================================
//  RENDER PASS BUILDER
// ============================================================================
class PulseRenderPassBuilder {
  constructor(device, context, format = "bgra8unorm") {
    this.device = device;
    this.context = context;
    this.format = format;
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
//  MAIN ENGINE (WebGPU Backend)
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

    console.log(
      "%c[PulseGPUEngine] Constructed — awaiting init().",
      "color:#03A9F4; font-weight:bold;"
    );
  }

  // ----------------------------------------------------
  // INITIALIZE ENGINE (FAIL-OPEN)
  // ----------------------------------------------------
  async init(canvas) {
    if (!canvas) {
      console.warn(
        "[PulseGPUEngine] No canvas provided — engine will remain inactive (fail-open)."
      );
      this.ready = false;
      return;
    }

    try {
      await this.runtime.init(canvas);
    } catch (err) {
      console.warn("[PulseGPUEngine] Runtime init failed (fail-open).", err);
      this.ready = false;
      return;
    }

    const gpuContext =
      this.runtime.getGPUContext?.() || this.runtime.context;

    if (!gpuContext || !gpuContext.device || !gpuContext.context) {
      console.warn(
        "[PulseGPUEngine] GPU context unavailable — engine inactive (fail-open)."
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

    console.log(
      "%c[PulseGPUEngine] Ready — WebGPU backend active.",
      "color:#4CAF50; font-weight:bold;"
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
  PulseDrawExecutor
};
