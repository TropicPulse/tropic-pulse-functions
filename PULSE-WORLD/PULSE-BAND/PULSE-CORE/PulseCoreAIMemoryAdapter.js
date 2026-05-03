// ============================================================================
//  PulseAIMemoryAdapter.js — v15‑IMMORTAL‑AI‑MEMORY‑ADAPTER
//  “AI NEVER RE-EMBEDS. NEVER RE-TOKENIZES. NEVER RE-THINKS TWICE.”
//  • v15 IMMORTAL MetaBlock
//  • dnaTag + version aware
//  • presence aware (overlay.touch + epoch)
//  • hot‑loop promotion
//  • dual‑band metadata
//  • lineage + context metadata
//  • governor + evolution aligned
//  • deterministic canonicalization (via BinaryOverlay v15)
// ============================================================================

/*
AI_EXPERIENCE_META = {
  identity: "PulseCoreAIMemoryAdapter",
  version: "v15-IMMORTAL-AI-MEMORY",
  layer: "corememory_adapter",
  role: "ai_memory_adapter",
  lineage: "PulseCoreMemory-v15-IMMORTAL",

  evo: {
    adapter: true,
    aiMemoryBridge: true,
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

// deterministic epoch for adapter events
let AIMEM_EPOCH = 0;
function nextAIEpoch() {
  AIMEM_EPOCH += 1;
  return AIMEM_EPOCH;
}

export function createPulseAIMemoryAdapter({
  overlay = createPulseBinaryOverlay(),
  dnaTag = "default-dna",
  version = "15.0-IMMORTAL-AI-MEMORY",
  log = console.log
} = {}) {

  // -------------------------------------------------------------------------
  //  v15 IMMORTAL MetaBlock
  // -------------------------------------------------------------------------
  const metaBlock = {
    identity: "PulseAIMemoryAdapter",
    subsystem: "AI",
    layer: "MemoryAdapter",
    role: "AI-Memory-Bridge",
    version,
    dnaTag,
    evo: {
      dnaAware: true,
      versionAware: true,
      presenceAware: true,
      hotLoop: true,
      dualBandSafe: true,
      lineageAware: true,
      contextAware: true,
      deterministic: true,
      driftProof: true
    }
  };

  // -------------------------------------------------------------------------
  //  INTERNAL: WRAP WITH v15 METADATA + overlay touch
  // -------------------------------------------------------------------------
  function wrap(routeId, payload, dataType) {
    const epoch = nextAIEpoch();

    const meta = {
      dataType,
      dnaTag,
      version,
      epoch,
      metaBlock,
      band: dataType.includes("embedding") ? "binary" : "symbolic"
    };

    // Presence‑touch propagation
    try {
      if (overlay.touch) {
        overlay.touch(routeId, epoch, meta);
      }
    } catch {}

    // Canonicalize through v15 BinaryOverlay
    return overlay.canonicalize(routeId, payload, {
      dataType,
      band: meta.band
    });
  }

  // -------------------------------------------------------------------------
  //  AI PROMPTS (USER → AI)
  // -------------------------------------------------------------------------
  function registerPrompt(routeId, prompt) {
    return wrap(routeId, prompt, "ai-prompt");
  }

  // -------------------------------------------------------------------------
  //  AI EMBEDDINGS (VECTOR MEMORY)
  // -------------------------------------------------------------------------
  function registerEmbedding(routeId, embedding) {
    return wrap(routeId, embedding, "ai-embedding");
  }

  // -------------------------------------------------------------------------
  //  AI RESPONSES (AI → USER)
  // -------------------------------------------------------------------------
  function registerResponse(routeId, response) {
    return wrap(routeId, response, "ai-response");
  }

  // -------------------------------------------------------------------------
  //  AI CONTEXT (CONVERSATION STATE)
  // -------------------------------------------------------------------------
  function registerContext(routeId, contextObj) {
    return wrap(routeId, contextObj, "ai-context");
  }

  // -------------------------------------------------------------------------
  //  HOT‑LOOP PROMOTION HOOK
  // -------------------------------------------------------------------------
  function promoteHot(routeId, key) {
    try {
      if (overlay.markHot) {
        overlay.markHot(routeId, key);
      }
      log("[PulseAIMemoryAdapter-v15] HOT_PROMOTE", { routeId, key });
    } catch {}
  }

  // -------------------------------------------------------------------------
  //  PUBLIC API
  // -------------------------------------------------------------------------
  return {
    metaBlock,
    dnaTag,
    version,

    registerPrompt,
    registerEmbedding,
    registerResponse,
    registerContext,

    promoteHot
  };
}
