// ============================================================================
//  PulseSendSystem-v12.4-EvoBinary.js
//  Nervous System Conductor (v12.4‑EvoBinary + SDN‑Aware + DualStack‑Aware)
//  Impulse → Pulse v3 → Pulse v2 → Pulse v1 → Router → Mesh → Send → Return
//  v12.4: Fully Binary-Aware + Ancestry + Degradation Tier + Advantage Surface
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
//    • Surface ancestry, degradation tier, advantage field, binary summary.
//    • Return result to PulseBand (if present).
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
import { createLegacyPulse } from "./PulseSendLegacyPulse-v11-Evo.js";

// Router + Mesh + Send
import { PulseRouter } from "../pulse-router/PulseRouter-v11-evo.js";
import { PulseMesh } from "../pulse-mesh/PulseMesh-v11-evo.js";
import { createPulseSendImpulse as createPulseSend } from "./PulseSendImpulse-v11-Evo.js";
import { createPulseSendReturn } from "./PulseSendReturn.js";


// ============================================================================
//  INTERNAL: GENERIC HELPERS
// ============================================================================
function computeHash(str) {
  let h = 0;
  const s = String(str);
  for (let i = 0; i < s.length; i++) {
    h = (h + s.charCodeAt(i) * (i + 1)) % 100000;
  }
  return `h${h}`;
}

function buildPatternAncestry(pattern) {
  if (!pattern || typeof pattern !== "string") return [];
  return pattern.split("/").filter(Boolean);
}

function buildLineageSignature(lineage) {
  if (!Array.isArray(lineage) || lineage.length === 0) return "NO_LINEAGE";
  return lineage.join(">");
}

function buildPageAncestrySignature({ pattern, lineage, pageId }) {
  const safePattern = typeof pattern === "string" ? pattern : "";
  const safeLineage = Array.isArray(lineage) ? lineage : [];
  const safePageId = pageId || "NO_PAGE";

  const shape = {
    pattern: safePattern,
    patternAncestry: buildPatternAncestry(safePattern),
    lineageSignature: buildLineageSignature(safeLineage),
    pageId: safePageId
  };

  const raw = JSON.stringify(shape);
  let hash = 0;
  for (let i = 0; i < raw.length; i++) {
    hash = (hash << 5) - hash + raw.charCodeAt(i);
    hash |= 0;
  }
  return (hash >>> 0).toString(16);
}

function classifyDegradationTier(healthScore) {
  const h = typeof healthScore === "number" ? healthScore : 1.0;
  if (h >= 0.95) return "microDegrade";
  if (h >= 0.85) return "softDegrade";
  if (h >= 0.50) return "midDegrade";
  if (h >= 0.15) return "hardDegrade";
  return "criticalDegrade";
}

function extractBinarySurfaceFromPulse(pulse) {
  const payload = pulse?.payload || {};

  const binaryPattern  = payload.binaryPattern || null;
  const binaryMode     = payload.binaryMode || null;
  const binaryPayload  = payload.binaryPayload || null;
  const binaryHints    = payload.binaryHints || null;
  const binaryStrength = typeof payload.binaryStrength === "number"
    ? payload.binaryStrength
    : null;

  const hasBinary =
    !!binaryPattern ||
    !!binaryMode ||
    !!binaryPayload ||
    !!binaryHints ||
    binaryStrength !== null;

  return {
    hasBinary,
    binaryPattern,
    binaryMode,
    binaryPayload,
    binaryHints,
    binaryStrength
  };
}


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
function normalizeImpulse(impulse) {
  const bits = Array.isArray(impulse.bits) ? impulse.bits : null;
  const hasBits = !!bits && bits.length > 0;
  const unbinary = !!impulse.unbinary;

  const binaryPattern  = hasBits ? bitsToPattern(bits, "bp") : null;
  const binaryMode     = hasBits ? bitsToMode(bits) : null;
  const binaryPayload  = hasBits ? bitsToPayload(bits) : {};
  const binaryHints    = hasBits ? bitsToHints(bits) : { routerHint: null, meshHint: null, organHint: null };
  const binaryStrength = hasBits ? computeBinaryStrength(bits) : 0;

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
    ...(unbinary ? {
      binaryPattern,
      binaryMode,
      binaryPayload,
      binaryHints,
      binaryStrength
    } : {}),
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
//  INTERNAL: SYSTEM DIAGNOSTICS (Ancestry + Degradation + Advantage)
// ============================================================================
function buildSystemDiagnostics({ pulse, fallbackTier }) {
  const pattern = pulse?.pattern || "NO_PATTERN";
  const lineage = Array.isArray(pulse?.lineage) ? pulse.lineage : [];
  const lineageDepth = lineage.length;
  const pageId = pulse?.pageId || "NO_PAGE";
  const pulseType = pulse?.pulseType || pulse?.PulseRole?.identity || "UNKNOWN_PULSE_TYPE";

  const healthScore = typeof pulse?.healthScore === "number"
    ? pulse.healthScore
    : 1.0;

  const degradationTier = classifyDegradationTier(healthScore);
  const advantageField = pulse?.advantageField || null;

  const patternAncestry = buildPatternAncestry(pattern);
  const lineageSignature = buildLineageSignature(lineage);
  const pageAncestrySignature = buildPageAncestrySignature({
    pattern,
    lineage,
    pageId
  });

  const binarySurface = extractBinarySurfaceFromPulse(pulse);

  return {
    pattern,
    lineageDepth,
    pageId,
    pulseType,
    fallbackTier,

    patternAncestry,
    lineageSignature,
    pageAncestrySignature,

    healthScore,
    degradationTier,
    advantageField,

    binary: binarySurface,

    patternHash: computeHash(pattern),
    lineageHash: computeHash(String(lineageDepth)),
    pageHash: computeHash(pageId),
    pulseTypeHash: computeHash(pulseType),
    fallbackTierHash: computeHash(String(fallbackTier)),
    degradationHash: computeHash(degradationTier),

    binaryPatternHash: binarySurface.binaryPattern
      ? computeHash(binarySurface.binaryPattern)
      : null,
    binaryModeHash: binarySurface.binaryMode
      ? computeHash(binarySurface.binaryMode)
      : null
  };
}


// ============================================================================
//  FACTORY — Build SDN‑Aware, Binary‑Aware PulseSendSystem (v12.4-EvoBinary)
// ============================================================================
export function createPulseSendSystem({
  sdn = null,
  log = console.log
}) {

  function emitSDN(event, payload) {
    if (!sdn || typeof sdn.emitImpulse !== "function") return;
    try {
      sdn.emitImpulse(event, payload);
    } catch (err) {
      log && log("[PulseSendSystem-v12.4-EvoBinary] SDN emit failed (non‑fatal)", { event, err });
    }
  }

  const PulseSend = createPulseSend({
  createPulseV3,
  createPulseV2,
  createPulseV1: createLegacyPulse,
  pulseRouter: PulseRouter,
  pulseMesh: PulseMesh,
  createPulseSendReturn,
  log,
  sdn
});


  // ------------------------------------------------------------------------
  //  INTERNAL: Try Pulse v3 (Unified Organism)
  // ------------------------------------------------------------------------
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

  // ------------------------------------------------------------------------
  //  INTERNAL: Try Pulse v2 (Evolution Engine)
  // ------------------------------------------------------------------------
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

  // ------------------------------------------------------------------------
  //  INTERNAL: Build Pulse v1 (EvoStable)
// ------------------------------------------------------------------------
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

  // ------------------------------------------------------------------------
  //  PUBLIC API — PulseSendSystem (v12.4‑EvoBinary + SDN‑Aware)
// ------------------------------------------------------------------------
  return {
    async send(impulse) {
      const normalized = normalizeImpulse(impulse);

      emitSDN("sendSystem:begin", {
        tickId: impulse.tickId,
        impulseIntent: impulse.intent,
        resolvedIntent: normalized.intent,
        mode: normalized.mode,
        pageId: normalized.pageId,
        binary: normalized.binarySummary
      });

      let pulse = null;
      let fallbackTier = null;

      // ⭐ Tier 1 — Try Pulse v3
      const v3 = tryPulseV3(impulse, normalized);
      if (v3.ok) {
        pulse = v3.pulse;
        fallbackTier = "v3";
        emitSDN("sendSystem:pulse-v3", {
          tickId: impulse.tickId,
          intent: normalized.intent,
          pulseType: pulse.pulseType,
          healthScore: pulse.healthScore,
          mode: pulse.mode,
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

      // ⭐ Tier 2 — Try Pulse v2
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
            mode: pulse.mode,
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

      // ⭐ Tier 3 — Fallback to Pulse v1
      if (!pulse) {
        pulse = buildPulseV1(impulse, normalized);
        fallbackTier = "v1";
        emitSDN("sendSystem:pulse-v1", {
          tickId: impulse.tickId,
          intent: normalized.intent,
          pulseType: pulse.pulseType,
          healthScore: pulse.healthScore,
          mode: pulse.mode,
          binary: normalized.binarySummary
        });
      }

      const systemDiagnostics = buildSystemDiagnostics({ pulse, fallbackTier });

      emitSDN("sendSystem:transport-begin", {
        tickId: impulse.tickId,
        intent: normalized.intent,
        fallbackTier,
        pulseType: pulse.pulseType,
        mode: pulse.mode,
        diagnostics: systemDiagnostics,
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

      const ok = !!result && result.result && result.result.ok !== false;

      emitSDN("sendSystem:transport-complete", {
        tickId: impulse.tickId,
        intent: normalized.intent,
        fallbackTier,
        pulseType: pulse.pulseType,
        mode: pulse.mode,
        ok,
        diagnostics: systemDiagnostics,
        binary: normalized.binarySummary
      });

      if (typeof window !== "undefined" && window.PulseBand?.receivePulseSendResult) {
        window.PulseBand.receivePulseSendResult({
          impulse,
          normalized,
          pulse,
          result,
          fallbackTier,
          diagnostics: systemDiagnostics
        });
      }

      emitSDN("sendSystem:complete", {
        tickId: impulse.tickId,
        intent: normalized.intent,
        fallbackTier,
        pulseType: pulse.pulseType,
        mode: pulse.mode,
        ok,
        diagnostics: systemDiagnostics,
        binary: normalized.binarySummary
      });

      return {
        ok,
        pulse,
        result,
        fallbackTier,
        binary: normalized.binarySummary,
        diagnostics: systemDiagnostics
      };
    }
  };
}
