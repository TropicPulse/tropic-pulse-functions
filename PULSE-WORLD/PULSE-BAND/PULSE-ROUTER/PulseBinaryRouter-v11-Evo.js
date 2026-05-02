/**
 * BinaryRouter-CosmosMultiverse-v13.js
 * PULSE-WORLD / BINARY-ROUTER / MULTIVERSE COSMOS
 *
 * ROLE:
 *   Pure binary → binary router with multiverse placement.
 *   - Deterministic handler selection
 *   - Pure binary contract
 *   - Zero randomness, zero mutation
 *   - Reversible routing signatures
 *   - Tiered fallback (proxy → mesh → node)
 *   - Multiverse-aware routing metadata
 */
// ============================================================================
//  PulseRouter-Barrel.js — v13‑EVO‑PRESENCE‑MAX
//  Unified Router Organ Import Surface (Binary + Evolutionary + Mesh + Earn)
//  PURE IMPORT LAYER — NO LOGIC, NO STATE, NO EXECUTION
// ============================================================================
/*
AI_EXPERIENCE_META = {
  identity: "PulseBinaryRouter",
  version: "v14.4-IMMORTAL",
  layer: "frontend",
  role: "binary_router",
  lineage: "PulseOS-v12",

  evo: {
    binaryCore: true,
    immortalBand: true,
    dualBand: true,
    chunkAligned: true,
    presenceAware: true,
    safeRouteFree: true,
    deterministic: true,
    advantageV2: true
  },

  contract: {
    always: [
      "PulseBinaryPulse",
      "PulseBinaryTech",
      "PulsePresence",
      "PulseChunks",
      "PulseRouterCommandments"
    ],
    never: [
      "legacyBinaryRouter",
      "legacyRouter",
      "safeRoute",
      "fetchViaCNS",
      "legacyChunker"
    ]
  }
}
*/


// --- EVOLUTIONARY ROUTER ORGANS --------------------------------------------
import * as PulseRouterEvolutionaryDesign     from "./PulseRouterEvolutionaryDesign.js";
import * as PulseRouterEvolutionaryInstincts  from "./PulseRouterEvolutionaryInstincts.js";
import * as PulseRouterEvolutionaryThought    from "./PulseRouterEvolutionaryThought.js";

// --- MESH ROUTER ------------------------------------------------------------
import * as PulseRouterMesh           from "./PulseRouterMesh-v11-Evo.js";

// --- EARN-AWARE ROUTER ------------------------------------------------------
import * as PulseRouterEarn           from "./PulseRouterEarn-v11-Evo.js";

// --- ROUTER COMMANDMENTS ----------------------------------------------------
import * as PulseRouterCommandments   from "./PulseRouterCommandments.js";

export function createBinaryRouter({
  handlers = [],
  fallbackProxy,
  fallbackMesh,
  fallbackNode,
  trace = false,
  cosmosContext = {}
} = {}) {

  // ------------------------------------------------------------
  // COSMOS CONTEXT (universe / timeline / branch)
  // ------------------------------------------------------------
  const cosmos = {
    universeId: cosmosContext.universeId || "u:default",
    timelineId: cosmosContext.timelineId || "t:main",
    branchId: cosmosContext.branchId || "b:root"
  };

  // ------------------------------------------------------------
  // SAFETY: PURE BINARY ONLY
  // ------------------------------------------------------------
  function isPureBinary(bits) {
    if (!Array.isArray(bits)) return false;
    for (let i = 0; i < bits.length; i++) {
      if (bits[i] !== 0 && bits[i] !== 1) return false;
    }
    return true;
  }

  function ensurePureBinaryOrFallback(op, bits, reason) {
    if (!isPureBinary(bits)) {
      return fallback(op, bits, reason);
    }
    return bits;
  }

  // ------------------------------------------------------------
  // COSMIC SIGNATURE — deterministic, reversible
  // ------------------------------------------------------------
  function computeSignature(bits) {
    let h = 0;
    for (let i = 0; i < bits.length; i++) {
      h = (h + bits[i] * (i + 17)) % 131072;
    }
    return `br13-${h.toString(16)}`;
  }

  // ------------------------------------------------------------
  // REGISTER HANDLER (binary → binary)
  // ------------------------------------------------------------
  function register(handler) {
    handlers.push(handler);
  }

  // ------------------------------------------------------------
  // FALLBACK — deterministic, tiered, multiverse-aware
  // ------------------------------------------------------------
  function fallback(op, bits, reason) {
    if (trace && typeof console !== "undefined") {
      console.warn(`[BinaryRouter-v13] FALLBACK (${op}):`, reason, bits);
    }

    let result = null;

    if (fallbackProxy?.exchange) {
      result = fallbackProxy.exchange(bits, reason, cosmos);
    } else if (fallbackMesh?.exchange) {
      result = fallbackMesh.exchange(bits, reason, cosmos);
    } else if (fallbackNode?.exchange) {
      result = fallbackNode.exchange(bits, reason, cosmos);
    } else {
      throw new Error(
        `BinaryRouter-v13 fallback triggered (${reason}) with no handlers`
      );
    }

    const outBits = Array.isArray(result) ? result : [];
    const signature = computeSignature(outBits);

    return {
      ok: false,
      fallback: true,
      reason,
      cosmos,
      bits: outBits,
      signature,
      length: outBits.length
    };
  }

  // ------------------------------------------------------------
  // ROUTE — pure binary → pure binary
  // ------------------------------------------------------------
  function route(bits) {
    const pure = ensurePureBinaryOrFallback("route", bits, "non-binary-input");

    if (handlers.length === 0) {
      return fallback("route", pure, "no-handlers");
    }

    try {
      // Deterministic handler selection:
      // sum(bits) mod handlerCount
      const sum = pure.reduce((a, b) => a + b, 0);
      const index = sum % handlers.length;

      const handler = handlers[index];
      const out = handler(pure);

      const pureOut = ensurePureBinaryOrFallback(
        "route",
        out,
        "non-binary-output"
      );

      const signature = computeSignature(pureOut);

      if (trace && typeof console !== "undefined") {
        console.log(
          "[BinaryRouter-v13] ROUTE:",
          pure,
          "→",
          pureOut,
          "sig:",
          signature,
          "cosmos:",
          cosmos
        );
      }

      return {
        ok: true,
        cosmos,
        bits: pureOut,
        signature,
        handlerIndex: index,
        length: pureOut.length
      };

    } catch (err) {
      return fallback("route", pure, "handler-exception");
    }
  }

  // ------------------------------------------------------------
  // PUBLIC API
  // ------------------------------------------------------------
  return {
    register,
    route,
    fallback
  };
}
