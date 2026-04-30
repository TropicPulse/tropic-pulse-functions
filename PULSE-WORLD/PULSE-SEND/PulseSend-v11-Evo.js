// ============================================================================
//  PulseSend-v12.3-Evo.js — PulseSend Organism v12.3 (Symbolic Edition)
//  Evolutionary Transport Organ • Pattern + Lineage + Shape • SDN-Aware
//  12.3: Fallback Surface + Movement Surface + Route Surface + Diagnostics
//        + cacheChunkSurface + prewarmSurface + presenceSurface
//  NOTE: This is the SYMBOLIC (pre-binary) top-level PulseSend.
// ============================================================================
//
//  SAFETY CONTRACT (v12.3-Evo):
//  ----------------------------
//  • No randomness.
//  • No timestamps.
//  • No external IO.
//  • Pure deterministic transport chain.
//  • Zero mutation outside instance.
// ============================================================================
import * as PulseV2EvolutionEngine   from "./PulseV2EvolutionEngine-v11-Evo.js";
import * as PulseV3UnifiedOrganism   from "./PulseV3UnifiedOrganism-v11-Evo.js";

// --- Impulse Layer ----------------------------------------------------------
import * as PulseSendImpulse         from "./PulseSendImpulse-v11-Evo.js";

// --- Legacy Pulse Layer -----------------------------------------------------
import * as PulseSendLegacyPulse     from "./PulseSendLegacyPulse-v11-Evo.js";

// --- Adapter Layer ----------------------------------------------------------
import * as PulseSendAdapter         from "./PulseSendAdapter.js";

// --- Engine Layer -----------------------------------------------------------
import * as PulseSendEngine          from "./PulseSendEngine.js";

// --- Return Layer -----------------------------------------------------------
import * as PulseSendReturn          from "./PulseSendReturn.js";

// --- System Layer (Final Conductor) ----------------------------------------
import * as PulseSendSystem          from "./PulseSendSystem.js";

// ============================================================================
// ⭐ PulseRole — identifies this as the PulseSend Organ Wrapper (v12.3)
// ============================================================================
export const PulseRole = {
  type: "Messenger",
  subsystem: "PulseSend",
  layer: "TransportSystem",
  version: "12.3",
  identity: "PulseSend-v12.3-Evo",

  evo: {
    driftProof: true,
    unifiedOrganReady: true,
    multiOrganReady: true,
    shapeShiftAware: true,
    reflexChainReady: true,
    patternAware: true,
    lineageAware: true,
    memoryAware: true,
    modeAware: true,
    deterministicImpulseFlow: true,
    futureEvolutionReady: true,

    unifiedAdvantageField: true,
    pulseSend11Ready: true,

    fallbackAware: true,
    movementAware: true,
    returnArcAware: true,
    pathwayAware: true,
    routerAware: true,
    meshAware: true,

    // 12.3+: cache / prewarm / presence
    cacheChunkAware: true,
    prewarmAware: true,
    multiPresenceAware: true
  },

  routingContract: "PulseRouter-v11",
  meshContract: "PulseMesh-v11",
  pulseContract: "Pulse-v1/v2/v3",
  gpuOrganContract: "PulseGPU-v11",
  earnCompatibility: "PulseEarn-v11"
};


// ============================================================================
//  INTERNAL HELPERS — deterministic, pure
// ============================================================================
function computeHash(str) {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (h + str.charCodeAt(i) * (i + 1)) % 100000;
  }
  return `h${h}`;
}

function stableStringify(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) {
    return "[" + value.map(stableStringify).join(",") + "]";
  }
  const keys = Object.keys(value).sort();
  return (
    "{" +
    keys.map((k) => JSON.stringify(k) + ":" + stableStringify(value[k])).join(",") +
    "}"
  );
}

function buildFallbackSurface(type, error) {
  return {
    fallbackType: type,
    errorMessage: error ? String(error) : null
  };
}

function buildSendDiagnostics({ jobId, pattern, mode, pulseType }) {
  return {
    jobId,
    patternLength: pattern.length,
    mode,
    pulseType,
    patternHash: computeHash(pattern),
    modeHash: computeHash(mode)
  };
}

function buildMovementSurface(movement) {
  if (!movement || !movement.packet) {
    return {
      hasPacket: false,
      movementSignature: "NO_PACKET"
    };
  }

  const raw = JSON.stringify(movement.packet);
  return {
    hasPacket: true,
    movementSignature: computeHash(raw)
  };
}

function buildRouteSurface(targetOrgan) {
  const raw = JSON.stringify(targetOrgan || {});
  return {
    targetOrgan,
    routeSignature: computeHash(raw)
  };
}

function buildPathwaySurface(pathway) {
  const raw = JSON.stringify(pathway || {});
  return {
    pathway,
    pathwaySignature: computeHash(raw)
  };
}

function buildReturnSurface(result) {
  const ok = result && result.ok !== false;
  const raw = JSON.stringify(result || {});
  return {
    ok,
    returnSignature: computeHash(raw)
  };
}


// ============================================================================
//  12.3+ surfaces — cacheChunk / prewarm / presence
// ============================================================================
function buildCacheChunkSurface({ jobId, pattern, targetOrgan, pathway, mode, pulseType }) {
  const shape = {
    jobId: jobId || "NO_JOB",
    pattern: pattern || "",
    targetOrgan: targetOrgan || null,
    pathway: pathway || null,
    mode: mode || "normal",
    pulseType: pulseType || "UNKNOWN"
  };

  const serialized = stableStringify(shape);
  const cacheChunkKey = "psend-cache::" + computeHash(serialized);

  return {
    cacheChunkKey,
    cacheChunkSignature: computeHash(cacheChunkKey)
  };
}

function buildPrewarmSurface({ priority, mode, pathway }) {
  const safePriority = priority || "normal";
  const safeMode = mode || "normal";
  const hasPathway = !!pathway;

  let level = "none";
  if (safePriority === "high" || safePriority === "critical") {
    level = "aggressive";
  } else if (safePriority === "normal" && hasPathway) {
    level = "medium";
  } else if (safePriority === "low" && hasPathway) {
    level = "light";
  }

  const raw = stableStringify({ priority: safePriority, mode: safeMode, hasPathway });
  const prewarmKey = "psend-prewarm::" + computeHash(raw);

  return {
    level,
    prewarmKey
  };
}

function buildPresenceSurface({ pattern, pathway }) {
  const safePattern = pattern || "";
  const hasPathway = !!pathway;

  let scope = "local";
  if (hasPathway && safePattern.includes("/global")) {
    scope = "global";
  } else if (hasPathway && safePattern.includes("/page")) {
    scope = "page";
  }

  const raw = stableStringify({ pattern: safePattern, hasPathway, scope });
  const presenceKey = "psend-presence::" + computeHash(raw);

  return {
    scope,
    presenceKey
  };
}


// ============================================================================
//  FACTORY — Build the Full PulseSend v12.3 Organism (Symbolic Edition)
// ============================================================================
export function createPulseSend({
  createPulseV3,
  createPulseV2,
  createPulseV1,
  pulseRouter,
  pulseMesh,
  createPulseSendMover,
  createPulseSendImpulse,
  createPulseSendReturn,
  log,
  sdn
}) {
  const mover = createPulseSendMover({ pulseMesh, log });
  const impulse = createPulseSendImpulse({ mover, log });
  const returnArc = createPulseSendReturn({ impulse, pulseRouter, pulseMesh, log });

  function emitSDN(source, payload) {
    if (!sdn || typeof sdn.emitImpulse !== "function") return;
    try {
      sdn.emitImpulse(source, payload);
    } catch (e) {
      log && log("[PulseSend-v12.3] SDN emit failed (non-fatal)", { source, error: e });
    }
  }

  // ========================================================================
  //  PUBLIC API — send()
  // ========================================================================
  function send({
    jobId,
    pattern,
    payload = {},
    priority = "normal",
    returnTo = null,
    mode = "normal"
  }) {

    let pulse = null;
    let pulseType = null;
    let fallbackSurface = null;

    emitSDN("send:begin", { jobId, pattern, priority, returnTo, mode });

    // ⭐ Tier 1 — Pulse v3
    try {
      pulse = createPulseV3({ jobId, pattern, payload, priority, returnTo, mode });
      pulseType = "Pulse-v3";
    } catch (errV3) {
      fallbackSurface = buildFallbackSurface("v3→v2", errV3);
      emitSDN("send:pulse-fallback", {
        jobId,
        pattern,
        from: "v3",
        to: "v2",
        error: String(errV3)
      });
    }

    // ⭐ Tier 2 — Pulse v2
    if (!pulse) {
      try {
        pulse = createPulseV2({ jobId, pattern, payload, priority, returnTo, mode });
        pulseType = "Pulse-v2";
      } catch (errV2) {
        fallbackSurface = buildFallbackSurface("v2→v1", errV2);
        emitSDN("send:pulse-fallback", {
          jobId,
          pattern,
          from: "v2",
          to: "v1",
          error: String(errV2)
        });
      }
    }

    // ⭐ Tier 3 — Pulse v1
    if (!pulse) {
      pulse = createPulseV1({ jobId, pattern, payload, priority, returnTo, mode });
      pulseType = "Pulse-v1";
      fallbackSurface = buildFallbackSurface("none→v1", "v3/v2 creation failed");
      emitSDN("send:pulse-fallback", { jobId, pattern, from: "none", to: "v1" });
    }

    emitSDN("send:pulse-created", { jobId, pattern, mode, pulseType });

    // ⭐ Route
    const targetOrgan = pulseRouter.route(pulse);
    const routeSurface = buildRouteSurface(targetOrgan);

    // ⭐ Pathway
    const pathway = pulseMesh.pathwayFor(targetOrgan, mode);
    const pathwaySurface = buildPathwaySurface(pathway);

    emitSDN("send:routed", { jobId, pattern, targetOrgan, pathway, mode, pulseType });

    // ⭐ Movement
    const movement = impulse.fire({ pulse, targetOrgan, pathway, mode });
    const movementSurface = buildMovementSurface(movement);

    emitSDN("send:movement", {
      jobId,
      pattern,
      targetOrgan,
      pathway,
      mode,
      pulseType,
      movementMeta: movementSurface
    });

    // ⭐ Return Arc
    const result = returnArc.handle(movement.packet, mode);
    const returnSurface = buildReturnSurface(result);

    emitSDN("send:return", {
      jobId,
      pattern,
      mode,
      pulseType,
      resultMeta: returnSurface
    });

    // ⭐ Memory
    pulseRouter.remember(pulse, targetOrgan, "success", pulse.healthScore || 1);

    emitSDN("send:complete", { jobId, pattern, targetOrgan, mode, pulseType });

    // ⭐ 12.3 surfaces — cacheChunk / prewarm / presence
    const cacheChunkSurface = buildCacheChunkSurface({
      jobId,
      pattern,
      targetOrgan,
      pathway,
      mode,
      pulseType
    });

    const prewarmSurface = buildPrewarmSurface({
      priority,
      mode,
      pathway
    });

    const presenceSurface = buildPresenceSurface({
      pattern,
      pathway
    });

    // ⭐ Return full telemetry
    return {
      PulseRole,
      movement,
      result,
      mode,
      pulseType,

      fallbackSurface,
      routeSurface,
      pathwaySurface,
      movementSurface,
      returnSurface,

      cacheChunkSurface,
      prewarmSurface,
      presenceSurface,

      diagnostics: buildSendDiagnostics({
        jobId,
        pattern,
        mode,
        pulseType
      })
    };
  }

  return {
    PulseRole,
    send
  };
}


// ============================================================================
//  ORGAN EXPORT — ⭐ PulseSend (v12.3)
// ============================================================================
export const PulseSend = {
  PulseRole,

  send(...args) {
    throw new Error(
      "[PulseSend-v12.3] PulseSend.send() was called before initialization. " +
      "Use createPulseSend(...) to wire dependencies."
    );
  }
};
