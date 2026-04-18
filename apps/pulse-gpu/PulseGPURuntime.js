// ============================================================================
// FILE: tropic-pulse-functions/apps/pulse-gpu/PulseGPURuntime.js
// PULSE GPU RUNTIME v6.3 — THE MOMENTUM NETWORK
// Forward Motion Layer • Signal Conduction Pathway • GPU Kinetic System
// ============================================================================
//
// IDENTITY — THE MOMENTUM NETWORK:
//  --------------------------------
//  • The GPU organism’s forward-motion layer.
//  • The kinetic system that moves data, buffers, and packages downstream.
//  • The conduction pathway between Analyst (Brain) and Motor Hall (Engine).
//  • The self-moving cart: once initialized, it carries the whole subsystem forward.
//  • The nervous conduction layer that keeps the GPU body alive.
//
// ROLE IN THE GPU NATION:
//  ------------------------
//  • Analyst → Intelligence Division (precompute brain)
//  • Momentum Network → Forward Motion + Signal Conduction
//  • Motor Hall → Execution Cortex (rendering + motion)
//  • Guardian → Permission Gate
//  • Lymph Node Network → Immune Filter
//  • Wisdom Cortex → Insight + Interpretation
//  • Brainstem → Command + Coordination
//
// WHAT THIS FILE IS:
//  -------------------
//  • A GPU memory initializer
//  • A loader for Brain-generated packages
//  • A WebGPU context manager
//  • The bridge between CPU-side precompute and GPU-side execution
//  • The forward-motion / conduction layer of the GPU subsystem
//
// WHAT THIS FILE IS NOT:
//  -----------------------
//  • NOT a renderer (Motor Hall handles that)
//  • NOT a CPU optimizer (Analyst handles that)
//  • NOT a shader compiler (Analyst handles that)
//  • NOT a backend module
//  • NOT a business logic module
//
// SAFETY RULES:
//  -------------
//  • NO backend APIs
//  • NO DOM manipulation outside WebGPU canvas/context
//  • NO Node.js APIs
//  • NO randomness or timestamps in GPU initialization
//  • NO mutation of Brain packages
//  • ALWAYS check navigator.gpu before initializing
//  • FAIL‑OPEN: if GPU or packages are unavailable, expose empty buffers/context
// ============================================================================

import { PulseGPUBrainExport } from "./PulseGPUBrain.js";

// ============================================================================
// GPU CONTEXT WRAPPER — Momentum Network: Conduction Node
// ============================================================================
class PulseGPUContext {
  constructor() {
    this.adapter = null;
    this.device = null;
    this.context = null;
    this.format = "bgra8unorm";
    this.ready = false;
  }

  async init(canvas) {
    if (!canvas) {
      console.warn(
        "PulseGPUContext: canvas not provided; momentum cannot begin (fail-open)."
      );
      this.ready = false;
      return;
    }

    if (!navigator.gpu) {
      console.warn(
        "PulseGPUContext: WebGPU unavailable — conduction halted (fail-open)."
      );
      this.ready = false;
      return;
    }

    this.adapter = await navigator.gpu.requestAdapter();
    if (!this.adapter) {
      console.warn("PulseGPUContext: adapter unavailable (fail-open).");
      this.ready = false;
      return;
    }

    this.device = await this.adapter.requestDevice();
    if (!this.device) {
      console.warn("PulseGPUContext: device unavailable (fail-open).");
      this.ready = false;
      return;
    }

    const context = canvas.getContext("webgpu");
    if (!context) {
      console.warn("PulseGPUContext: cannot acquire WebGPU context (fail-open).");
      this.ready = false;
      return;
    }

    this.context = context;
    this.format = navigator.gpu.getPreferredCanvasFormat();

    this.context.configure({
      device: this.device,
      format: this.format,
      alphaMode: "opaque"
    });

    this.ready = true;
  }
}

// ============================================================================
// GPU BUFFER CREATION — Momentum Network: Payload Conduction
// ============================================================================
function createGPUBuffer(device, data, usage) {
  if (!device || !data) return null;

  const buffer = device.createBuffer({
    size: data.byteLength,
    usage,
    mappedAtCreation: true
  });

  new Uint8Array(buffer.getMappedRange()).set(new Uint8Array(data));
  buffer.unmap();

  return buffer;
}

// ============================================================================
// RUNTIME LOADER — Momentum Network: Flow Initialization
// ============================================================================
class PulseGPURuntimeLoader {
  constructor(gpuContext) {
    this.gpu = gpuContext;

    this.packages = null;

    this.textureBuffers = [];
    this.meshBuffers = [];
    this.shaderModules = [];
  }

  loadPackages() {
    const pkg = PulseGPUBrainExport.exportToRuntime();
    if (!pkg) {
      console.warn(
        "PulseGPURuntimeLoader: no packageSet available — momentum stalls (fail-open)."
      );
      this.packages = null;
      return null;
    }
    this.packages = pkg;
    return this.packages;
  }

  // ----------------------------------------------------
  // TEXTURES → GPU BUFFERS
  // ----------------------------------------------------
  initTextures() {
    if (!this.gpu.device) return;
    const pkg = this.packages?.textures;
    if (!pkg || !Array.isArray(pkg.optimizedTextures)) return;

    pkg.optimizedTextures.forEach((tex) => {
      if (!tex || !tex.data) return;
      const buffer = createGPUBuffer(
        this.gpu.device,
        tex.data,
        GPUBufferUsage.COPY_DST | GPUBufferUsage.TEXTURE_BINDING
      );
      if (buffer) {
        this.textureBuffers.push(buffer);
      }
    });
  }

  // ----------------------------------------------------
  // MESHES → GPU BUFFERS
  // ----------------------------------------------------
  initMeshes() {
    if (!this.gpu.device) return;
    const pkg = this.packages?.meshes;
    if (!pkg || !Array.isArray(pkg.simplifiedMeshes)) return;

    pkg.simplifiedMeshes.forEach((mesh) => {
      if (!mesh || !mesh.vertices || !mesh.indices) return;

      const vertexBuffer = createGPUBuffer(
        this.gpu.device,
        mesh.vertices,
        GPUBufferUsage.VERTEX
      );

      const indexBuffer = createGPUBuffer(
        this.gpu.device,
        mesh.indices,
        GPUBufferUsage.INDEX
      );

      if (vertexBuffer && indexBuffer) {
        this.meshBuffers.push({
          vertexBuffer,
          indexBuffer,
          indexCount: mesh.indices.byteLength / 4
        });
      }
    });
  }

  // ----------------------------------------------------
  // SHADERS → GPU MODULES
  // ----------------------------------------------------
  initShaders() {
    if (!this.gpu.device) return;
    const pkg = this.packages?.shaders;
    if (!pkg || !Array.isArray(pkg.compiledVariants)) return;

    pkg.compiledVariants.forEach((shader) => {
      if (!shader || !shader.code) return;
      const module = this.gpu.device.createShaderModule({
        code: shader.code
      });
      this.shaderModules.push(module);
    });
  }

  // ----------------------------------------------------
  // FULL INITIALIZATION PIPELINE — Momentum Ignition
  // ----------------------------------------------------
  async initialize(canvas) {
    if (!this.gpu.ready) {
      await this.gpu.init(canvas);
    }

    if (!this.gpu.ready) {
      return false;
    }

    this.loadPackages();
    if (!this.packages) {
      return true;
    }

    this.initTextures();
    this.initMeshes();
    this.initShaders();

    return true;
  }
}

// ============================================================================
// RUNTIME API — Momentum Network: Flow Surface
// ============================================================================
class PulseGPURuntime {
  constructor() {
    this.context = new PulseGPUContext();
    this.loader = new PulseGPURuntimeLoader(this.context);
  }

  async init(canvas) {
    await this.loader.initialize(canvas);
  }

  getGPUContext() {
    return {
      adapter: this.context.adapter,
      device: this.context.device,
      context: this.context.context,
      format: this.context.format,
      ready: this.context.ready
    };
  }

  getTextures() {
    return this.loader.textureBuffers;
  }

  getMeshes() {
    return this.loader.meshBuffers;
  }

  getShaders() {
    return this.loader.shaderModules;
  }

  getPackages() {
    return this.loader.packages;
  }

  getMeshesFromPackages() {
    return this.loader.meshBuffers;
  }

  getShadersFromPackages() {
    return this.loader.shaderModules;
  }
}

// ============================================================================
// EXPORTS
// ============================================================================
export {
  PulseGPUContext,
  PulseGPURuntimeLoader,
  PulseGPURuntime,
  createGPUBuffer
};
