// ============================================================================
//  PulseAIMemoryAdapter.js — v12‑EVO‑PRESENCE‑MAX
//  “AI NEVER RE-EMBEDS. NEVER RE-TOKENIZES. NEVER RE-THINKS TWICE.”
//  • MetaBlock (v12 identity)
//  • dnaTag + version aware
//  • presence aware
//  • hot‑loop promotion
//  • dual‑band metadata
//  • lineage + context metadata
//  • governor + evolution aligned
// ============================================================================

import { createPulseBinaryOverlay } from "./PulseBinaryCoreOverlay.js";

export function createPulseAIMemoryAdapter({
  overlay = createPulseBinaryOverlay(),
  dnaTag = "default-dna",
  version = "12.0-Evo-Presence",
  log = console.log
} = {}) {

  // ---------------------------------------------------------
  //  v12 IDENTITY BLOCK (MetaBlock)
  // ---------------------------------------------------------
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
      contextAware: true
    }
  };

  // ---------------------------------------------------------
  //  INTERNAL: WRAP WITH v12 METADATA
  // ---------------------------------------------------------
  function wrap(routeId, payload, dataType) {
    const meta = {
      dataType,
      dnaTag,
      version,
      lastTouched: Date.now(),
      metaBlock
    };

    // Presence‑touch propagation
    try {
      overlay.touch(routeId, meta.lastTouched);
    } catch {}

    return overlay.canonicalize(routeId, payload, meta);
  }

  // ---------------------------------------------------------
  //  AI PROMPTS (USER → AI)
  // ---------------------------------------------------------
  function registerPrompt(routeId, prompt) {
    return wrap(routeId, prompt, "ai-prompt");
  }

  // ---------------------------------------------------------
  //  AI EMBEDDINGS (VECTOR MEMORY)
  // ---------------------------------------------------------
  function registerEmbedding(routeId, embedding) {
    return wrap(routeId, embedding, "ai-embedding");
  }

  // ---------------------------------------------------------
  //  AI RESPONSES (AI → USER)
  // ---------------------------------------------------------
  function registerResponse(routeId, response) {
    return wrap(routeId, response, "ai-response");
  }

  // ---------------------------------------------------------
  //  AI CONTEXT (CONVERSATION STATE)
  // ---------------------------------------------------------
  function registerContext(routeId, contextObj) {
    return wrap(routeId, contextObj, "ai-context");
  }

  // ---------------------------------------------------------
  //  HOT‑LOOP PROMOTION HOOK
  // ---------------------------------------------------------
  function promoteHot(routeId, key) {
    try {
      overlay.markHot(routeId, key);
      log("[PulseAIMemoryAdapter] HOT_PROMOTE", { routeId, key });
    } catch {}
  }

  // ---------------------------------------------------------
  //  PUBLIC API
  // ---------------------------------------------------------
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
