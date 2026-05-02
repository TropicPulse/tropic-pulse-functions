// ============================================================================
//  PulseGPUOrchestrator.js — v12‑EVO‑PRESENCE‑MAX
//  GPU SPINE / BRAINSTEM • AUTONOMIC NERVOUS SYSTEM
//  “ROUTE SIGNALS. REGULATE PRESSURE. NEVER TOUCH THE HARDWARE.”
//  • MetaBlock (v12 identity)
//  • PulseRol / PresenceRol
//  • DNA‑aware
//  • Version‑aware
//  • Presence‑touch propagation
//  • Hot‑loop integration
//  • Pressure metadata
//  • Mode metadata
//  • Session metadata
//  • Deterministic routing (no GPU calls)
// ============================================================================
/*
AI_EXPERIENCE_META = {
  identity: "PulseCoreGPUMemoryAdapter",
  version: "v14-IMMORTAL",
  layer: "corememory_adapter",
  role: "gpu_memory_adapter",
  lineage: "PulseCoreMemory-v14",

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
      "PulseCoreGovernor"
    ],
    never: [
      "safeRoute",
      "fetchViaCNS"
    ]
  }
}
*/

import { createPulseBinaryOverlay } from "./PulseBinaryCoreOverlay.js";

export const GPUOrchestratorRole = {
  type: "Organ",
  subsystem: "GPU",
  layer: "Spine",
  identity: "PulseGPUOrchestrator",
  version: "12.0-Evo-Presence",

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
    pressureAware: true
  }
};

// ---------------------------------------------------------------------------
//  v12 IDENTITY BLOCK (MetaBlock)
// ---------------------------------------------------------------------------
export const GPUOrchestratorMetaBlock = {
  identity: "PulseGPUOrchestrator",
  subsystem: "GPU",
  layer: "Spine",
  role: "GPU-Orchestrator",
  version: "12.0-Evo-Presence",
  evo: GPUOrchestratorRole.evo
};

// ---------------------------------------------------------------------------
//  SIGNAL DEFINITIONS (unchanged, but now v12 metadata-aware)
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
//  ROUTING MAP (v12: now includes metaBlock + dnaTag + version)
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
//  PURE, DETERMINISTIC DISPATCHER (v12 metadata-aware)
// ---------------------------------------------------------------------------
export function createPulseGPUOrchestrator({
  overlay = createPulseBinaryOverlay(),
  dnaTag = "default-dna",
  version = "12.0-Evo-Presence",
  log = console.log
} = {}) {

  function safeLog(stage, details = {}) {
    try { log("[PulseGPUOrchestrator]", stage, JSON.stringify(details)); }
    catch {}
  }

  function routeSignal(signal, payload = {}) {
    const route = GPUOrchestratorRoutes[signal];

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
        lastTouched: Date.now()
      };
    }

    const meta = {
      metaBlock: GPUOrchestratorMetaBlock,
      dnaTag,
      version,
      lastTouched: Date.now(),
      pressure: payload.pressure || null,
      mode: payload.mode || null,
      session: payload.session || null
    };

    // Presence‑touch propagation (if overlay provided)
    if (overlay && overlay.touch) {
      try { overlay.touch(payload.routeId || "gpu", meta.lastTouched); }
      catch {}
    }

    safeLog("ROUTE", { signal, targets: route.to });

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
    version: GPUOrchestratorRole.version
  });

  return {
    GPUOrchestratorRole,
    GPUOrchestratorMetaBlock,
    GPUOrchestratorSignals,
    GPUOrchestratorRoutes,
    routeSignal
  };
}
