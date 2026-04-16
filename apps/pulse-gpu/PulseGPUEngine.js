// FILE: tropic-pulse-functions/apps/pulse-gpu/PulseGPUEngine.js
//
// INTENT-CHECK: If you paste this while confused or frustrated, gently re-read your INTENT;
// if I am unsure of intent, I will ask you for the full INTENT paragraph.
//
// 📘 PAGE INDEX — Source of Truth for This File
//
// ROLE:
//   PulseGPUEngine — final GPU execution layer for the Pulse GPU subsystem (v4).
//   This file is the **WebGPU backend implementation** of the full Pulse‑GPU
//   execution layer. It consumes PulseGPURuntime (full‑GPU, API‑agnostic),
//   uses GPU‑ready packages (from PulseGPUBrain), builds WebGPU pipelines,
//   constructs render passes, and issues draw calls.
//
//   Conceptually, PulseGPUEngine is API‑agnostic (DX/Vulkan/Metal/WebGPU/etc.).
//   This file is the WebGPU‑specific engine implementation.
//
//   This file IS:
//     • A frontend‑only WebGPU execution layer (one backend of the full GPU engine)
//     • A renderer that issues draw calls
//     • A consumer of GPU‑ready packages from PulseGPURuntime (full GPU)
//
//   This file IS NOT:
//     • A backend module
//     • A CPU‑side optimizer (that’s PulseGPUBrain)
//     • A GPU memory/logic orchestrator (that’s PulseGPURuntime)
//     • A shader compiler (that’s PulseGPUBrain)
//     • A business logic module
//
// DEPLOYMENT:
//   Lives in /apps/pulse-gpu as part of the GPU subsystem.
//   Must run ONLY in browser environments with WebGPU support.
//   Must remain ESM‑only and side‑effect‑free until init() is called.
//
// SYNTAX RULES:
//   ESM JavaScript ONLY — no TypeScript, no CommonJS, no require().
//   Named exports ONLY — no default exports.
//
// IMPORT RULES:
//   Allowed:
//     • PulseGPURuntime from ./PulseGPURuntime.js
//
//   Forbidden:
//     • Node.js APIs
//     • Firebase, Stripe, Twilio, or any backend modules
//     • DOM manipulation outside WebGPU canvas/context
//     • Any environment‑specific dependencies beyond WebGPU canvas/context
//
// INTERNAL LOGIC SUMMARY (v4, WebGPU backend):
//   • PulseRenderPassBuilder:
//       - Builds basic render pass descriptors using the current swapchain texture
//
//   • PulsePipelineBuilder:
//       - Creates WebGPU render pipelines from shader modules
//
//   • PulseDrawExecutor:
//       - Issues draw calls for meshes using provided pipelines
//
//   • PulseGPUEngine (WebGPU):
//       - Initializes PulseGPURuntime with a canvas
//       - Asks runtime for GPU context + GPU‑ready mesh/shader packages
//       - Builds pipelines from shader modules
//       - Iterates meshes and draws them
//       - Submits command buffers to GPU queue
//       - Fails open: if anything is missing, it simply does not render, but never bricks the app
//
// SAFETY NOTES:
//   • Must NEVER run on backend — WebGPU is browser‑only
//   • Must NEVER mutate runtime internals directly
//   • Must ALWAYS check readiness before rendering
//   • Must remain deterministic and side‑effect‑free outside init()/renderFrame()
//   • On failure (no GPU, no context, no shaders/meshes), must fail open: no rendering, but no crash
//
// ------------------------------------------------------
// Consumes PulseGPURuntime (full GPU) → builds WebGPU pipelines →
// executes render passes and draw calls (WebGPU backend).
// ------------------------------------------------------

import { PulseGPURuntime } from "./PulseGPURuntime.js";

// ------------------------------------------------------
// RENDER PASS BUILDER
// ------------------------------------------------------

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

// ------------------------------------------------------
// PIPELINE BUILDER
// ------------------------------------------------------

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

// ------------------------------------------------------
// DRAW CALL EXECUTOR
// ------------------------------------------------------

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

// ------------------------------------------------------
// MAIN ENGINE (v4, WebGPU backend)
// ------------------------------------------------------

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
  }

  // ----------------------------------------------------
  // INITIALIZE RUNTIME + ENGINE (FAIL-OPEN)
// ----------------------------------------------------
  async init(canvas) {
    // Canvas is required for WebGPU; if missing, fail open (no render, no crash).
    if (!canvas) {
      console.warn("PulseGPUEngine: canvas not provided; engine will not render (fail-open).");
      this.ready = false;
      return;
    }

    // Runtime is responsible for:
    //   - acquiring adapter/device
    //   - configuring the canvas/context
    //   - preparing GPU-ready packages from PulseGPUBrain
    try {
      await this.runtime.init(canvas);
    } catch (err) {
      console.warn("PulseGPUEngine: runtime init failed (fail-open).", err);
      this.ready = false;
      return;
    }

    const gpuContext = this.runtime.getGPUContext
      ? this.runtime.getGPUContext()
      : this.runtime.context; // fallback for older shape

    if (!gpuContext || !gpuContext.device || !gpuContext.context) {
      console.warn("PulseGPUEngine: GPU context is not available (fail-open).");
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
  }

  // ----------------------------------------------------
  // BUILD PIPELINES FROM SHADERS (GPU-ready packages)
// ----------------------------------------------------
  buildPipelines() {
    const shaders =
      this.runtime.getShadersFromPackages?.() || this.runtime.getShaders?.() || [];

    if (!Array.isArray(shaders) || shaders.length === 0) {
      return [];
    }

    const pipelines = [];

    shaders.forEach((shaderModule) => {
      const pipeline = this.pipelineBuilder.createPipeline(shaderModule, [
        {
          arrayStride: 12,
          attributes: [
            { shaderLocation: 0, offset: 0, format: "float32x3" }
          ]
        }
      ]);

      pipelines.push(pipeline);
    });

    return pipelines;
  }

  // ----------------------------------------------------
  // RENDER A FRAME (FAIL-OPEN)
// ----------------------------------------------------
  renderFrame() {
    if (!this.ready) return;

    const meshes =
      this.runtime.getMeshesFromPackages?.() || this.runtime.getMeshes?.() || [];
    const shaders =
      this.runtime.getShadersFromPackages?.() || this.runtime.getShaders?.() || [];

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

// ------------------------------------------------------
// EXPORTS
// ------------------------------------------------------

export {
  PulseGPUEngine,
  PulsePipelineBuilder,
  PulseRenderPassBuilder,
  PulseDrawExecutor
};
