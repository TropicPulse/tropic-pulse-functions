// ============================================================================
//  PULSE GPU RUNTIME v11-Evo — THE MOMENTUM NETWORK
//  Forward Motion Layer • Signal Conduction Pathway • GPU Kinetic System
// ============================================================================
//
// IDENTITY — THE MOMENTUM NETWORK (v11-Evo):
//  -----------------------------------------
//  • The GPU organism’s forward-motion layer.
//  • The kinetic system that moves data, buffers, and packages downstream.
//  • The conduction pathway between Analyst (Brain) and Motor Hall (Engine).
//  • The self-moving cart: once initialized, it carries the whole subsystem forward.
//  • Advantage‑cascade aware: inherits all systemic advantages automatically.
//  • Binary-aware, symbolic-aware, dispatch-aware, memory-aware.
//  • PulseSend‑v11‑ready: exposes a clean, deterministic surface for the compute router.
//
// SAFETY RULES (v11-Evo):
//  -----------------------
//  • NO backend APIs
//  • NO DOM manipulation outside WebGPU canvas/context
//  • NO Node.js APIs
//  • NO randomness or timestamps in GPU initialization logic
//  • NO mutation of Brain packages
//  • ALWAYS check navigator.gpu before initializing
//  • FAIL‑OPEN: if GPU or packages are unavailable, expose empty buffers/context
//
// CONTRACTS (conceptual only):
//  ----------------------------
//  • routingContract: "PulseSend-v11"
//  • gpuOrganContract: "PulseGPU-v11-Evo"
//  • binaryGpuOrganContract: "PulseBinaryGPU-v11-Evo"
//  • earnCompatibility: "Earn-v3"
// ============================================================================

const PULSE_GPU_RUNTIME_VERSION = "11.0-Evo";

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

    this.meta = {
      layer: "PulseGPUContext",
      role: "MOMENTUM_NODE",
      version: PULSE_GPU_RUNTIME_VERSION,
      target: "full-gpu",
      evo: {
        advantageCascadeAware: true,
        pulseEfficiencyAware: true,
        driftProof: true,
        multiInstanceReady: true,
        unifiedAdvantageField: true,
        pulseSend11Ready: true,

        // NEW v11-Evo awareness
        binaryAware: true,
        symbolicAware: true,
        gpuDispatchAware: true,
        gpuMemoryAware: true,
        gpuAdvantageAware: true,

        routingContract: "PulseSend-v11",
        gpuOrganContract: "PulseGPU-v11-Evo",
        binaryGpuOrganContract: "PulseBinaryGPU-v11-Evo",
        earnCompatibility: "Earn-v3"
      }
    };
  }

  async init(canvas) {
    if (!canvas) {
      warn("PulseGPUContext: canvas not provided (fail-open).");
      this.ready = false;
      return;
    }

    if (!navigator.gpu) {
      warn("PulseGPUContext: WebGPU unavailable (fail-open).");
      this.ready = false;
      return;
    }

    this.adapter = await navigator.gpu.requestAdapter();
    if (!this.adapter) {
      warn("PulseGPUContext: adapter unavailable (fail-open).");
      this.ready = false;
      return;
    }

    this.device = await this.adapter.requestDevice();
    if (!this.device) {
      warn("PulseGPUContext: device unavailable (fail-open).");
      this.ready = false;
      return;
    }

    const context = canvas.getContext("webgpu");
    if (!context) {
      warn("PulseGPUContext: cannot acquire WebGPU context (fail-open).");
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

    this.dispatchHints = null; // NEW v11-Evo
    this.gpuMemorySnapshot = null; // NEW v11-Evo

    this.meta = {
      layer: "PulseGPURuntimeLoader",
      role: "MOMENTUM_FLOW",
      version: PULSE_GPU_RUNTIME_VERSION,
      target: "full-gpu",
      evo: {
        advantageCascadeAware: true,
        pulseEfficiencyAware: true,
        driftProof: true,
        multiInstanceReady: true,
        unifiedAdvantageField: true,
        pulseSend11Ready: true,

        // NEW v11-Evo awareness
        binaryAware: true,
        symbolicAware: true,
        gpuDispatchAware: true,
        gpuMemoryAware: true,
        gpuAdvantageAware: true,

        routingContract: "PulseSend-v11",
        gpuOrganContract: "PulseGPU-v11-Evo",
        binaryGpuOrganContract: "PulseBinaryGPU-v11-Evo",
        earnCompatibility: "Earn-v3"
      }
    };
  }

  loadPackages() {
    const pkg = PulseGPUBrainExport.exportToRuntime();
    if (!pkg) {
      warn("PulseGPURuntimeLoader: no packageSet available (fail-open).");
      this.packages = null;
      return null;
    }

    this.packages = pkg;

    // NEW v11-Evo: load dispatch hints + memory snapshot if present
    this.dispatchHints = pkg.dispatchHints || null;
    this.gpuMemorySnapshot = pkg.gpuMemorySnapshot || null;

    return this.packages;
  }

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
      if (buffer) this.textureBuffers.push(buffer);
    });
  }

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

  initShaders() {
    if (!this.gpu.device) return;
    const pkg = this.packages?.shaders;
    if (!pkg || !Array.isArray(pkg.compiledVariants)) return;

    pkg.compiledVariants.forEach((shader) => {
      if (!shader || !shader.code) return;
      const module = this.gpu.device.createShaderModule({ code: shader.code });
      this.shaderModules.push(module);
    });
  }

  async initialize(canvas) {
    if (!this.gpu.ready) {
      await this.gpu.init(canvas);
    }

    if (!this.gpu.ready) return false;

    this.loadPackages();
    if (!this.packages) return true;

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

    this.meta = {
      layer: "PulseGPURuntime",
      role: "MOMENTUM_NETWORK",
      version: PULSE_GPU_RUNTIME_VERSION,
      target: "full-gpu",
      evo: {
        advantageCascadeAware: true,
        pulseEfficiencyAware: true,
        driftProof: true,
        multiInstanceReady: true,
        unifiedAdvantageField: true,
        pulseSend11Ready: true,

        // NEW v11-Evo awareness
        binaryAware: true,
        symbolicAware: true,
        gpuDispatchAware: true,
        gpuMemoryAware: true,
        gpuAdvantageAware: true,

        routingContract: "PulseSend-v11",
        gpuOrganContract: "PulseGPU-v11-Evo",
        binaryGpuOrganContract: "PulseBinaryGPU-v11-Evo",
        earnCompatibility: "Earn-v3"
      }
    };
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

  // NEW v11-Evo: expose dispatch hints + memory snapshot
  getDispatchHints() {
    return this.loader.dispatchHints;
  }

  getGpuMemorySnapshot() {
    return this.loader.gpuMemorySnapshot;
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
