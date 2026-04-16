// FILE: tropic-pulse-functions/apps/pulse-gpu/PulseGPURuntime.js
//
// INTENT-CHECK: If you paste this while confused or frustrated, gently re-read your INTENT.
//
// 📘 PAGE INDEX — Source of Truth for This File
//
// ROLE:
//   PulseGPURuntime — the GPU memory initializer + package loader for the
//   Pulse GPU subsystem. It loads CPU‑side packages from PulseGPUBrainExport,
//   initializes GPU buffers, creates shader modules, and exposes a clean,
//   deterministic runtime API for PulseGPUEngine.
//
//   Conceptually, PulseGPURuntime is API‑agnostic (full GPU layer).
//   This file is the WebGPU‑specific runtime backend.
//
//   This file IS:
//     • A GPU memory initializer
//     • A loader for Brain‑generated packages
//     • A WebGPU context manager (one backend of the full GPU runtime)
//     • The bridge between CPU‑side precompute (Brain) and GPU‑side execution (Engine)
//
//   This file IS NOT:
//     • A renderer (PulseGPUEngine handles that)
//     • A CPU optimizer (PulseGPUBrain handles that)
//     • A shader compiler (Brain handles compilation)
//     • A backend module
//     • A business logic module
//
// DEPLOYMENT:
//   Lives in /apps/pulse-gpu.
//   Must run ONLY in browser environments with WebGPU support.
//   Must remain ESM‑only and side‑effect‑free until init() is called.
//
// SAFETY RULES:
//   • NO backend APIs
//   • NO DOM manipulation outside WebGPU canvas/context
//   • NO Node.js APIs
//   • NO randomness or timestamps in GPU initialization
//   • NO mutation of Brain packages
//   • ALWAYS check navigator.gpu before initializing
//   • FAIL‑OPEN: if GPU or packages are unavailable, do not crash — just expose empty buffers/context
//
// ------------------------------------------------------
// IMPORTS
// ------------------------------------------------------

import { PulseGPUBrainExport } from "./PulseGPUBrain.js";

// ------------------------------------------------------
// GPU CONTEXT WRAPPER (WEBGPU BACKEND)
// ------------------------------------------------------

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
      console.warn("PulseGPUContext: canvas not provided; runtime will not initialize (fail-open).");
      this.ready = false;
      return;
    }

    if (!navigator.gpu) {
      console.warn("PulseGPUContext: WebGPU not available in this environment (fail-open).");
      this.ready = false;
      return;
    }

    this.adapter = await navigator.gpu.requestAdapter();
    if (!this.adapter) {
      console.warn("PulseGPUContext: WebGPU adapter unavailable (fail-open).");
      this.ready = false;
      return;
    }

    this.device = await this.adapter.requestDevice();
    if (!this.device) {
      console.warn("PulseGPUContext: WebGPU device unavailable (fail-open).");
      this.ready = false;
      return;
    }

    const context = canvas.getContext("webgpu");
    if (!context) {
      console.warn("PulseGPUContext: unable to acquire WebGPU context from canvas (fail-open).");
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

// ------------------------------------------------------
// GPU BUFFER CREATION (DETERMINISTIC)
// ------------------------------------------------------

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

// ------------------------------------------------------
// RUNTIME LOADER — loads Brain packages → GPU buffers
// ------------------------------------------------------

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
      console.warn("PulseGPURuntimeLoader: no packageSet available from PulseGPUBrainExport (fail-open).");
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
  // FULL INITIALIZATION PIPELINE (FAIL-OPEN)
// ----------------------------------------------------
  async initialize(canvas) {
    if (!this.gpu.ready) {
      await this.gpu.init(canvas);
    }

    if (!this.gpu.ready) {
      // GPU not available; fail-open: no buffers, no crash.
      return false;
    }

    this.loadPackages();
    if (!this.packages) {
      // No packages; still considered initialized, but with empty buffers.
      return true;
    }

    this.initTextures();
    this.initMeshes();
    this.initShaders();

    return true;
  }
}

// ------------------------------------------------------
// RUNTIME API — used by PulseGPUEngine (WebGPU backend)
// ------------------------------------------------------

class PulseGPURuntime {
  constructor() {
    this.context = new PulseGPUContext();
    this.loader = new PulseGPURuntimeLoader(this.context);
  }

  async init(canvas) {
    await this.loader.initialize(canvas);
  }

  // v4-friendly GPU context accessor
  getGPUContext() {
    return {
      adapter: this.context.adapter,
      device: this.context.device,
      context: this.context.context,
      format: this.context.format,
      ready: this.context.ready
    };
  }

  // Legacy-style accessors
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

  // v4-style explicit package-based accessors
  getMeshesFromPackages() {
    return this.loader.meshBuffers;
  }

  getShadersFromPackages() {
    return this.loader.shaderModules;
  }
}

// ------------------------------------------------------
// EXPORTS
// ------------------------------------------------------

export {
  PulseGPUContext,
  PulseGPURuntimeLoader,
  PulseGPURuntime,
  createGPUBuffer
};
