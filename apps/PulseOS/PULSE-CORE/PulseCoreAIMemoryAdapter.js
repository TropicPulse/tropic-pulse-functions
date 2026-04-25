// ============================================================================
//  PulseAIMemoryAdapter.js — v11‑EVO‑SPINE
//  “AI NEVER RE-EMBEDS. NEVER RE-TOKENIZES. NEVER RE-THINKS TWICE.”
// ============================================================================

import { createPulseBinaryOverlay } from "../PulseBinaryOverlay.js";

export function createPulseAIMemoryAdapter({
  overlay = createPulseBinaryOverlay(),
  log = console.log
} = {}) {

  function registerPrompt(routeId, prompt) {
    return overlay.canonicalize(routeId, prompt, { dataType: "ai-prompt" });
  }

  function registerEmbedding(routeId, embedding) {
    return overlay.canonicalize(routeId, embedding, { dataType: "ai-embedding" });
  }

  function registerResponse(routeId, response) {
    return overlay.canonicalize(routeId, response, { dataType: "ai-response" });
  }

  function registerContext(routeId, contextObj) {
    return overlay.canonicalize(routeId, contextObj, { dataType: "ai-context" });
  }

  return {
    role: "PulseAIMemoryAdapter",
    registerPrompt,
    registerEmbedding,
    registerResponse,
    registerContext
  };
}
