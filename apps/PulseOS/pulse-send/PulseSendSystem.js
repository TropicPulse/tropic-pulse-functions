// ============================================================================
//  PulseSendSystem-v11-Evo.js — Nervous System Conductor (v11‑Evo + SDN‑Aware)
//  Impulse → Pulse v3 → Pulse v2 → Pulse v1 → Router → Mesh → Send
//  v11-Evo-Binary: Fully Binary-Aware + Symbolic-Aware + Unbinary Surface
// ============================================================================
//
//  ROLE:
//    • Accept an Impulse (symbolic, binary, or hybrid).
//    • If bits are present:
//        - Derive pattern / mode / payload / hints (router/mesh/organ).
//        - Optionally "unbinary" into symbolic fields.
//    • Try Pulse v3 (unified organism).
//    • If v3 fails → try Pulse v2 (evolution engine).
//    • If v2 fails → fallback to Pulse v1 (EvoStable).
//    • Route → Mesh → Send → ReturnArc.
//    • Emit SDN impulses at every stage (non‑blocking).
//    • Return result to PulseBand (if present).
//
//  BINARY / UNBINARY BEHAVIOR:
//    • Impulse may contain:
//        - bits: number[] (0/1)
//        - unbinary: boolean (if true, we also expose decoded symbolic fields)
//    • If intent/payload/mode are missing, they are derived from bits.
//    • If they exist, bits act as *hints* (extra context).
//
//  SAFETY:
//    • No network
//    • No GPU
//    • No Earn
//    • Pure internal routing + transport
//    • Deterministic bit → pattern/mode/payload mapping
// ============================================================================


// ============================================================================
//  IMPORTS — Pulse v1 / v2 / v3 creators
// ============================================================================
import { createPulseV3 } from "./PulseV3UnifiedOrganism-v11-Evo.js";
import { createPulseV2 } from "./PulseV2EvolutionEngine-v11-Evo.js";
import { createLegacyPulse } from "./PulseSendLegacyPulse-v11-EvoStable.js";

// Router + Mesh + Send
import { PulseRouter } from "../pulse-router/PulseRouter-v11.js";
import { PulseMesh } from "../pulse-mesh/PulseMesh-v11.js";
import { createPulseSend } from "./pulse-send/PulseSend-v11-Evo.js";
import { createPulseSendMover } from "./pulse-send/PulseSendMover-v11-Evo.js";
import { createPulseSendImpulse } from "./pulse-send/PulseSendImpulse-v11-Evo.js";
import { createPulseSendReturn } from "./pulse-send/PulseSendReturn-v11-Evo.js";


// ============================================================================
//  INTERNAL: BINARY HELPERS — bits → pattern/mode/payload/hints
// ============================================================================

function bitsToNumber(bits) {
  const safe = Array.isArray(bits) ? bits : [];
  let n = 0;
  for (let i = 0; i < safe.length; i++) {
    n = (n << 1) | (safe[i] & 1);
  }
  return n >>> 0;
}

function bitsToHex(bits, maxNibbles = 8) {
  const n = bitsToNumber(bits);
  const hex = n.toString(16).padStart(2, "0");
  return hex.slice(-maxNibbles);
}

function bitsToPattern(bits, prefix = "bp") {
  const hex = bitsToHex(bits, 8);
  return `${prefix}/${hex}`;
}

function bitsToMode(bits) {
  const safe = Array.isArray(bits) ? bits : [];
  if (safe.length === 0) return "normal";
  const n = bitsToNumber(safe) % 4;
  if (n === 0) return "normal";
  if (n === 1) return "stress";
  if (n === 2) return "drain";
  return "recovery";
}

function bitsToPayload(bits, maxKeys = 4) {
  const safe = Array.isArray(bits) ? bits : [];
  const payload = {};
  const chunkSize = 8;
  const count = Math.min(maxKeys, Math.floor(safe.length / chunkSize));

  for (let i = 0; i < count; i++) {
    const start = i * chunkSize;
    const slice = safe.slice(start, start + chunkSize);
    const val = bitsToNumber(slice);
    payload[`b${i}`] = val;
  }

  return payload;
}

function bitsToHints(bits) {
  const safe = Array.isArray(bits) ? bits : [];
  const n = bitsToNumber(safe);

  const routerHint = `r${n % 7}`;
  const meshHint   = `m${(n >> 3) % 5}`;
  const organHint  = `o${(n >> 6) % 9}`;

  return { routerHint, meshHint, organHint };
}

function computeBinaryStrength(bits) {
  const safe = Array.isArray(bits) ? bits : [];
  if (safe.length === 0) return 0;
  const ones = safe.reduce((acc, b) => acc + (b ? 1 : 0), 0);
  return ones / safe.length; // 0..1
}


// ============================================================================
//  INTERNAL: IMPULSE NORMALIZATION (Symbolic + Binary + Unbinary)
// ============================================================================
//
//  normalizeImpulse:
//    - Accepts raw impulse (may contain bits + symbolic fields).
//    - Produces a resolved view:
//        • intent
//        • payload
//        • mode
//        • pageId
//        • binarySummary (if bits present)
// ============================================================================

function normalizeImpulse(impulse) {
  const bits = Array.isArray(impulse.bits) ? impulse.bits : null;
  const hasBits = !!bits && bits.length > 0;
  const unbinary = !!impulse.unbinary;

  const binaryPattern  = hasBits ? bitsToPattern(bits, "bp") : null;
  const binaryMode     = hasBits ? bitsToMode(bits) : null;
  const binaryPayload  = hasBits ? bitsToPayload(bits) : {};
  const binaryHints    = hasBits ? bitsToHints(bits) : { routerHint: null, meshHint: null, organHint: null };
  const binaryStrength = hasBits ? computeBinaryStrength(bits) : 0;

  // Symbolic fields may already exist; bits fill gaps.
  const intent =
    impulse.intent ||
    (unbinary && binaryPattern) ||
    impulse.payload?.intent ||
    "pulse/unknown";

  const mode =
    impulse.payload?.mode ||
    impulse.mode ||
    (unbinary && binaryMode) ||
    "normal";

  const pageId =
    impulse.payload?.pageId ||
    impulse.pageId ||
    "NO_PAGE";

  const payloadBase = impulse.payload || {};
  const payloadMerged = {
    ...payloadBase,
    // If unbinary is requested, we expose binary-derived fields explicitly.
    ...(unbinary ? {
      binaryPattern,
      binaryMode,
      binaryPayload,
      binaryHints,
      binaryStrength
    } : {}),
    // Always keep binary hints available as soft hints (non-breaking).
    routerHint: payloadBase.routerHint || binaryHints.routerHint || null,
    meshHint:   payloadBase.meshHint   || binaryHints.meshHint   || null,
    organHint:  payloadBase.organHint  || binaryHints.organHint  || null
  };

  const binarySummary = hasBits ? {
    hasBits: true,
    bitsLength: bits.length,
    binaryPattern,
    binaryMode,
    binaryStrength
  } : {
    hasBits: false
  };

  return {
    bits,
    hasBits,
    unbinary,
    intent,
    mode,
    pageId,
    payload: payloadMerged,
    binarySummary
  };
}


// ============================================================================
//  FACTORY — Build SDN‑Aware, Binary‑Aware PulseSendSystem
// ============================================================================
export function createPulseSendSystem({
  sdn = null,          // ⭐ injected SDN (optional)
  log = console.log
}) {

  // helper: safe SDN emission
  function emitSDN(event, payload) {
    if (!sdn || typeof sdn.emitImpulse !== "function") return;
    try {
      sdn.emitImpulse(event, payload);
    } catch (err) {
      log && log("[PulseSendSystem-v11-Evo] SDN emit failed (non‑fatal)", { event, err });
    }
  }

  // build PulseSend with SDN injected
  const PulseSend = createPulseSend({
    createPulseV3,
    createPulseV2,
    createPulseV1: createLegacyPulse,
    pulseRouter: PulseRouter,
    pulseMesh: PulseMesh,
    createPulseSendMover,
    createPulseSendImpulse,
    createPulseSendReturn,
    log,
    sdn
  });

  // ========================================================================
  //  INTERNAL: Try Pulse v3 (Unified Organism)
  // ========================================================================
  function tryPulseV3(impulse, normalized) {
    try {
      const pulse = createPulseV3({
        jobId: impulse.tickId,
        pattern: normalized.intent,
        payload: normalized.payload,
        priority: normalized.payload?.priority || "normal",
        returnTo: normalized.payload?.returnTo || null,
        parentLineage: normalized.payload?.parentLineage || null,
        mode: normalized.mode,
        pageId: normalized.pageId
      });

      return { ok: true, pulse };
    } catch (err) {
      return { ok: false, error: err };
    }
  }

  // ========================================================================
  //  INTERNAL: Try Pulse v2 (Evolution Engine)
  // ========================================================================
  function tryPulseV2(impulse, normalized) {
    try {
      const pulse = createPulseV2({
        jobId: impulse.tickId,
        pattern: normalized.intent,
        payload: normalized.payload,
        priority: normalized.payload?.priority || "normal",
        returnTo: normalized.payload?.returnTo || null,
        parentLineage: normalized.payload?.parentLineage || null,
        mode: normalized.mode,
        pageId: normalized.pageId
      });

      return { ok: true, pulse };
    } catch (err) {
      return { ok: false, error: err };
    }
  }

  // ========================================================================
  //  INTERNAL: Build Pulse v1 (EvoStable)
  // ========================================================================
  function buildPulseV1(impulse, normalized) {
    return createLegacyPulse({
      jobId: impulse.tickId,
      pattern: normalized.intent,
      payload: normalized.payload || {},
      priority: normalized.payload?.priority || "normal",
      returnTo: normalized.payload?.returnTo || null,
      parentLineage: normalized.payload?.parentLineage || null,
      mode: normalized.mode,
      pageId: normalized.pageId
    });
  }

  // ========================================================================
  //  PUBLIC API — PulseSendSystem (v11‑Evo + SDN‑Aware + Binary‑Aware)
  // ========================================================================
  return {
    async send(impulse) {
      const normalized = normalizeImpulse(impulse);

      emitSDN("sendSystem:begin", {
        impulseIntent: impulse.intent,
        tickId: impulse.tickId,
        mode: normalized.mode,
        binary: normalized.binarySummary
      });

      let pulse = null;
      let fallbackTier = null;

      // ================================================================
      // ⭐ Tier 1 — Try Pulse v3 (Unified Organism)
      // ================================================================
      const v3 = tryPulseV3(impulse, normalized);
      if (v3.ok) {
        pulse = v3.pulse;
        fallbackTier = "v3";
        emitSDN("sendSystem:pulse-v3", {
          tickId: impulse.tickId,
          intent: normalized.intent,
          pulseType: pulse.pulseType,
          healthScore: pulse.healthScore,
          binary: normalized.binarySummary
        });
      } else {
        emitSDN("sendSystem:v3-failed", {
          tickId: impulse.tickId,
          intent: normalized.intent,
          error: String(v3.error),
          binary: normalized.binarySummary
        });
      }

      // ================================================================
      // ⭐ Tier 2 — Try Pulse v2 (Evolution Engine)
      // ================================================================
      if (!pulse) {
        const v2 = tryPulseV2(impulse, normalized);
        if (v2.ok) {
          pulse = v2.pulse;
          fallbackTier = "v2";
          emitSDN("sendSystem:pulse-v2", {
            tickId: impulse.tickId,
            intent: normalized.intent,
            pulseType: pulse.pulseType,
            healthScore: pulse.healthScore,
            binary: normalized.binarySummary
          });
        } else {
          emitSDN("sendSystem:v2-failed", {
            tickId: impulse.tickId,
            intent: normalized.intent,
            error: String(v2.error),
            binary: normalized.binarySummary
          });
        }
      }

      // ================================================================
      // ⭐ Tier 3 — Fallback to Pulse v1 (EvoStable)
      // ================================================================
      if (!pulse) {
        pulse = buildPulseV1(impulse, normalized);
        fallbackTier = "v1";
        emitSDN("sendSystem:pulse-v1", {
          tickId: impulse.tickId,
          intent: normalized.intent,
          pulseType: pulse.pulseType,
          healthScore: pulse.healthScore,
          binary: normalized.binarySummary
        });
      }

      // ================================================================
      // ⭐ Transport Chain — Router → Mesh → Send → ReturnArc
      // ================================================================
      emitSDN("sendSystem:transport-begin", {
        tickId: impulse.tickId,
        intent: normalized.intent,
        fallbackTier,
        pulseType: pulse.pulseType,
        mode: pulse.mode,
        binary: normalized.binarySummary
      });

      const result = PulseSend.send({
        jobId: pulse.jobId,
        pattern: pulse.pattern,
        payload: pulse.payload,
        priority: pulse.priority,
        returnTo: pulse.returnTo,
        mode: pulse.mode
      });

      emitSDN("sendSystem:transport-complete", {
        tickId: impulse.tickId,
        intent: normalized.intent,
        fallbackTier,
        pulseType: pulse.pulseType,
        mode: pulse.mode,
        ok: !!result && result.result && result.result.ok !== false,
        binary: normalized.binarySummary
      });

      // ================================================================
      // ⭐ Return to PulseBand (if present, browser‑only)
      // ================================================================
      if (typeof window !== "undefined" && window.PulseBand?.receivePulseSendResult) {
        window.PulseBand.receivePulseSendResult({
          impulse,
          normalized,
          pulse,
          result,
          fallbackTier
        });
      }

      emitSDN("sendSystem:complete", {
        tickId: impulse.tickId,
        intent: normalized.intent,
        fallbackTier,
        pulseType: pulse.pulseType,
        mode: pulse.mode,
        binary: normalized.binarySummary
      });

      return {
        ok: true,
        pulse,
        result,
        fallbackTier,
        binary: normalized.binarySummary
      };
    }
  };
}
