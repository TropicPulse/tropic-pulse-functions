// ============================================================================
//  PulseGPUOrchestrator.js — v15‑IMMORTAL‑GPU‑SPINE
//  GPU SPINE / BRAINSTEM • AUTONOMIC NERVOUS SYSTEM
//  “ROUTE SIGNALS. REGULATE PRESSURE. NEVER TOUCH THE HARDWARE.”
//  • v15 IMMORTAL MetaBlock
//  • dnaTag + version aware
//  • presence‑touch propagation (overlay.touch + deterministic epoch)
//  • hot‑loop integration
//  • pressure metadata
//  • mode metadata
//  • session metadata
//  • dual‑band metadata
//  • deterministic routing (no GPU calls)
// ============================================================================

/*
AI_EXPERIENCE_META = {
  identity: "PulseCoreGPUMemoryAdapter",
  version: "v15-IMMORTAL-GPU-ORCHESTRATOR",
  layer: "corememory_adapter",
  role: "gpu_memory_adapter",
  lineage: "PulseCoreMemory-v15-IMMORTAL",

  evo: {
    adapter: true,
    gpuMemoryBridge: true,
    symbolicPrimary: true,
    binaryAware: true,
    dualBand: true,

    deterministic: true,
    driftProof: true,
    pureCompute: true,

    zeroMutationOfInput: true,
    zeroNetwork: true,
    zeroFilesystem: true
  },

  contract: {
    always: [
      "PulseCoreBrain",
      "PulseCoreGovernor",
      "PulseBinaryCoreOverlay"
    ],
    never: [
      "safeRoute",
      "fetchViaCNS"
    ]
  }
};
*/

import { createPulseBinaryOverlay } from "./PulseBinaryCoreOverlay.js";

// deterministic epoch for GPU orchestrator events
let GPU_EPOCH = 0;
function nextGPUEpoch() {
  GPU_EPOCH += 1;
  return GPU_EPOCH;
}

export const GPUOrchestratorRole = {
  type: "Organ",
  subsystem: "GPU",
  layer: "Spine",
  identity: "PulseGPUOrchestrator",
  version: "15.0-IMMORTAL-GPU-ORCHESTRATOR",

  evo: {
    dualMode: true,
    dispatchAware: true,
    memoryAware: true,
    deterministic: true,
    failOpen: true,
    zeroSideEffects: true,
    dnaAware: true,
    presenceAware: true,
    versionAware: true,
    pressureAware: true,
    bandAware: true,
    overlayAware: true
  }
};

// ---------------------------------------------------------------------------
//  v15 IDENTITY BLOCK (MetaBlock)
// ---------------------------------------------------------------------------
export const GPUOrchestratorMetaBlock = {
  identity: "PulseGPUOrchestrator",
  subsystem: "GPU",
  layer: "Spine",
  role: "GPU-Orchestrator",
  version: "15.0-IMMORTAL-GPU-ORCHESTRATOR",
  evo: GPUOrchestratorRole.evo
};

// ---------------------------------------------------------------------------
//  SIGNAL DEFINITIONS (unchanged, but now v15 metadata-aware)
// ---------------------------------------------------------------------------
export const GPUOrchestratorSignals = {
  SESSION_START: "gpu.session.start",
  SESSION_END: "gpu.session.end",

  LOAD_MODEL: "gpu.model.load",
  UNLOAD_MODEL: "gpu.model.unload",

  LOAD_KERNEL: "gpu.kernel.load",
  UNLOAD_KERNEL: "gpu.kernel.unload",

  EXECUTE_GRAPH: "gpu.graph.execute",
  WARM_GRAPH: "gpu.graph.warm",

  PRESSURE_TICK: "gpu.pressure.tick",
  MODE_SWITCH: "gpu.mode.switch"
};

// ---------------------------------------------------------------------------
//  ROUTING MAP (v15: includes IMMORTAL metadata + notes)
// ---------------------------------------------------------------------------
export const GPUOrchestratorRoutes = {
  [GPUOrchestratorSignals.SESSION_START]: {
    to: ["GPU-Brain", "GPU-Engine"],
    notes: "Initialize GPU session context, allocate logical lanes."
  },
  [GPUOrchestratorSignals.SESSION_END]: {
    to: ["GPU-Brain", "GPU-Engine", "GPU-Healer"],
    notes: "Tear down logical session, emit summaries."
  },
  [GPUOrchestratorSignals.LOAD_MODEL]: {
    to: ["GPU-Engine", "GPU-Memory"],
    notes: "Load model into VRAM via GPU memory adapter."
  },
  [GPUOrchestratorSignals.UNLOAD_MODEL]: {
    to: ["GPU-Engine", "GPU-Memory"],
    notes: "Release VRAM allocations for model."
  },
  [GPUOrchestratorSignals.LOAD_KERNEL]: {
    to: ["GPU-Engine", "GPU-Memory"],
    notes: "Load/compile kernel into VRAM."
  },
  [GPUOrchestratorSignals.UNLOAD_KERNEL]: {
    to: ["GPU-Engine", "GPU-Memory"],
    notes: "Release kernel resources."
  },
  [GPUOrchestratorSignals.EXECUTE_GRAPH]: {
    to: ["GPU-Engine", "GPU-Brain", "GPU-Healer"],
    notes: "Execute compiled graph, feed results to Brain/Healer."
  },
  [GPUOrchestratorSignals.WARM_GRAPH]: {
    to: ["GPU-Engine", "GPU-Memory"],
    notes: "Pre‑warm graph paths for low‑latency execution."
  },
  [GPUOrchestratorSignals.PRESSURE_TICK]: {
    to: ["GPU-Advisor", "GPU-Healer"],
    notes: "Report load/pressure, trigger balancing or throttling."
  },
  [GPUOrchestratorSignals.MODE_SWITCH]: {
    to: ["GPU-Brain", "GPU-Engine"],
    notes: "Coordinate binary/symbolic mode transitions."
  }
};

// ---------------------------------------------------------------------------
//  PURE, DETERMINISTIC DISPATCHER (v15 IMMORTAL)
// ---------------------------------------------------------------------------
export function createPulseGPUOrchestrator({
  overlay = createPulseBinaryOverlay(),
  dnaTag = "default-dna",
  version = "15.0-IMMORTAL-GPU-ORCHESTRATOR",
  log = console.log
} = {}) {

  function safeLog(stage, details = {}) {
    try { log("[PulseGPUOrchestrator-v15]", stage, JSON.stringify(details)); }
    catch {}
  }

  function routeSignal(signal, payload = {}) {
    const route = GPUOrchestratorRoutes[signal];
    const epoch = nextGPUEpoch();

    if (!route) {
      safeLog("UNKNOWN_SIGNAL", { signal });
      return {
        signal,
        payload,
        targets: [],
        notes: "",
        metaBlock: GPUOrchestratorMetaBlock,
        dnaTag,
        version,
        epoch,
        band: "symbolic"
      };
    }

    // Determine band (binary for kernels/graphs, symbolic for session/meta)
    const band =
      signal === GPUOrchestratorSignals.LOAD_KERNEL ||
      signal === GPUOrchestratorSignals.UNLOAD_KERNEL ||
      signal === GPUOrchestratorSignals.EXECUTE_GRAPH ||
      signal === GPUOrchestratorSignals.WARM_GRAPH
        ? "binary"
        : "symbolic";

    const meta = {
      metaBlock: GPUOrchestratorMetaBlock,
      dnaTag,
      version,
      epoch,
      band,
      pressure: payload.pressure || null,
      mode: payload.mode || null,
      session: payload.session || null,
      routeId: payload.routeId || "gpu"
    };

    // Presence‑touch propagation
    if (overlay && overlay.touch) {
      try { overlay.touch(meta.routeId, epoch, meta); }
      catch {}
    }

    safeLog("ROUTE", { signal, targets: route.to, band });

    return {
      signal,
      payload,
      targets: route.to,
      notes: route.notes || "",
      ...meta
    };
  }

  safeLog("INIT", {
    identity: GPUOrchestratorRole.identity,
    version: GPUOrchestratorRole.version,
    dnaTag
  });

  return {
    GPUOrchestratorRole,
    GPUOrchestratorMetaBlock,
    GPUOrchestratorSignals,
    GPUOrchestratorRoutes,
    routeSignal
  };
}
