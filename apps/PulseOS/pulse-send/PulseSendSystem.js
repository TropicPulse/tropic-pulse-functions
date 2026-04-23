// ============================================================================
//  PulseSendSystem.js — Nervous System Conductor (v11‑Evo + SDN‑Aware)
//  Impulse → Pulse v3 → Pulse v2 → Pulse v1 → Router → Mesh → Send
// ============================================================================
//
//  ROLE:
//    • Accept an Impulse
//    • Try Pulse v3 (unified organism)
//    • If v3 fails → try Pulse v2 (evolution engine)
//    • If v2 fails → fallback to Pulse v1 (EvoStable)
//    • Route → Mesh → Send → ReturnArc
//    • Emit SDN impulses at every stage (non‑blocking)
//    • Return result to PulseBand
//
//  SAFETY:
//    • No network
//    • No GPU
//    • No Earn
//    • Pure internal routing + transport
// ============================================================================


// ============================================================================
//  IMPORTS — Pulse v1 / v2 / v3 creators
// ============================================================================
import { createPulseV3 } from "../pulse-send/PulseV3UnifiedOrganism.js";
import { createPulseV2 } from "../pulse-send/PulseV2EvolutionEngine.js";
import { createLegacyPulse } from "../pulse-send/PulseSendLegacyPulse.js";

// Router + Mesh + Send
import { PulseRouter } from "../pulse-router/PulseRouter-v11.js";
import { PulseMesh } from "../pulse-mesh/PulseMesh-v11.js";
import { createPulseSend } from "./pulse-send/PulseSend.js";


// ============================================================================
//  FACTORY — Build SDN‑Aware PulseSendSystem
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
      log && log("[PulseSendSystem] SDN emit failed (non‑fatal)", { event, err });
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
  function tryPulseV3(impulse) {
    try {
      const pulse = createPulseV3({
        jobId: impulse.tickId,
        pattern: impulse.intent,
        payload: impulse.payload,
        priority: impulse.payload?.priority || "normal",
        returnTo: impulse.payload?.returnTo || null,
        parentLineage: impulse.payload?.parentLineage || null,
        mode: impulse.payload?.mode || "normal"
      });

      return { ok: true, pulse };
    } catch (err) {
      return { ok: false, error: err };
    }
  }

  // ========================================================================
  //  INTERNAL: Try Pulse v2 (Evolution Engine)
  // ========================================================================
  function tryPulseV2(impulse) {
    try {
      const pulse = createPulseV2({
        jobId: impulse.tickId,
        pattern: impulse.intent,
        payload: impulse.payload,
        priority: impulse.payload?.priority || "normal",
        returnTo: impulse.payload?.returnTo || null,
        parentLineage: impulse.payload?.parentLineage || null,
        mode: impulse.payload?.mode || "normal"
      });

      return { ok: true, pulse };
    } catch (err) {
      return { ok: false, error: err };
    }
  }

  // ========================================================================
  //  INTERNAL: Build Pulse v1 (EvoStable)
  // ========================================================================
  function buildPulseV1(impulse) {
    return createLegacyPulse({
      jobId: impulse.tickId,
      pattern: impulse.intent,
      payload: impulse.payload || {},
      priority: impulse.payload?.priority || "normal",
      returnTo: impulse.payload?.returnTo || null,
      parentLineage: impulse.payload?.parentLineage || null,
      mode: impulse.payload?.mode || "normal"
    });
  }

  // ========================================================================
  //  PUBLIC API — PulseSendSystem (v11‑Evo + SDN‑Aware)
// ========================================================================
  return {
    async send(impulse) {
      emitSDN("sendSystem:begin", { impulse });

      let pulse = null;
      let fallbackTier = null;

      // ================================================================
      // ⭐ Tier 1 — Try Pulse v3 (Unified Organism)
      // ================================================================
      const v3 = tryPulseV3(impulse);
      if (v3.ok) {
        pulse = v3.pulse;
        fallbackTier = "v3";
        emitSDN("sendSystem:pulse-v3", { impulse, pulse });
      } else {
        emitSDN("sendSystem:v3-failed", { impulse, error: String(v3.error) });
      }

      // ================================================================
      // ⭐ Tier 2 — Try Pulse v2 (Evolution Engine)
      // ================================================================
      if (!pulse) {
        const v2 = tryPulseV2(impulse);
        if (v2.ok) {
          pulse = v2.pulse;
          fallbackTier = "v2";
          emitSDN("sendSystem:pulse-v2", { impulse, pulse });
        } else {
          emitSDN("sendSystem:v2-failed", { impulse, error: String(v2.error) });
        }
      }

      // ================================================================
      // ⭐ Tier 3 — Fallback to Pulse v1 (EvoStable)
      // ================================================================
      if (!pulse) {
        pulse = buildPulseV1(impulse);
        fallbackTier = "v1";
        emitSDN("sendSystem:pulse-v1", { impulse, pulse });
      }

      // ================================================================
      // ⭐ Transport Chain — Router → Mesh → Send → ReturnArc
      // ================================================================
      emitSDN("sendSystem:transport-begin", { impulse, pulse });

      const result = PulseSend.send({
        jobId: pulse.jobId,
        pattern: pulse.pattern,
        payload: pulse.payload,
        priority: pulse.priority,
        returnTo: pulse.returnTo,
        mode: pulse.mode
      });

      emitSDN("sendSystem:transport-complete", {
        impulse,
        pulse,
        result,
        fallbackTier
      });

      // ================================================================
      // ⭐ Return to PulseBand (if present)
      // ================================================================
      if (typeof window !== "undefined" && window.PulseBand?.receivePulseSendResult) {
        window.PulseBand.receivePulseSendResult({
          impulse,
          pulse,
          result,
          fallbackTier
        });
      }

      emitSDN("sendSystem:complete", {
        impulse,
        pulse,
        result,
        fallbackTier
      });

      return {
        ok: true,
        pulse,
        result,
        fallbackTier
      };
    }
  };
}
