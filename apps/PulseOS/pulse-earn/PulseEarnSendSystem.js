// ============================================================================
//  PulseEarnSendSystem-v11-Evo.js
//  Earn Nervous System Conductor (v11-Evo GOVERNED + Dual-Band A-B-A)
//  Deterministic Single‑Pass Earn → Pulse → Send (No async, No loops)
//  v11: Diagnostics + Signatures + Pattern Surface + Continuance Fallback
//  v11+ A-B-A: Dual-band + binary + wave metadata (structural-only)
// ============================================================================
//
//  SAFETY CONTRACT (v11-Evo):
//  --------------------------
//  • No async.
//  • No network.
//  • No GPU.
//  • No miner.
//  • No compute.
//  • Zero randomness.
//  • Zero timestamps.
//  • Zero mutation outside instance.
// ============================================================================

import { createEarn, evolveEarn } from "./PulseEarn-v11-Evo.js";
import { PulseEarnContinuancePulse } from "./PulseEarnContinuancePulse-v11-Evo.js";


// ============================================================================
//  INTERNAL HELPERS — deterministic, tiny, pure
// ============================================================================
function computeHash(str) {
  let h = 0;
  const s = String(str || "");
  for (let i = 0; i < s.length; i++) {
    h = (h + s.charCodeAt(i) * (i + 1)) % 100000;
  }
  return `h${h}`;
}

function normalizeBand(band) {
  const b = String(band || "symbolic").toLowerCase();
  return b === "binary" ? "binary" : "symbolic";
}


// ============================================================================
//  GOVERNOR — Earn Loop Guard (v11-Evo)
// ============================================================================
function isEarnReentryImpulse(impulse) {
  if (!impulse || !impulse.payload) return false;

  const earn = impulse.payload.earn;
  if (!earn) return false;

  if (earn.role?.identity === "PulseEarn-v11-Evo") return true;
  if (earn.__earnEnvelope === true) return true;

  return false;
}

function tagImpulseAsEarnSent(impulse, pulseCompatibleEarn) {
  const basePayload = impulse.payload || {};

  return {
    ...impulse,
    payload: {
      ...basePayload,
      earn: {
        ...(pulseCompatibleEarn || {}),
        __earnEnvelope: true
      },
      __earnSent: true
    }
  };
}


// ============================================================================
//  INTERNAL: Try Earn v11 (deterministic)
// ============================================================================
function tryEarnV11(impulse) {
  try {
    const baseEarn = createEarn({
      jobId: impulse.tickId,
      pattern:
        impulse.intent ||
        impulse.payload?.pattern ||
        "UNKNOWN_EARN_PATTERN",
      payload: impulse.payload || {},
      priority: impulse.payload?.priority || "normal",
      returnTo: impulse.payload?.returnTo || null,
      parentLineage: impulse.payload?.parentLineage || null,
      pageId: impulse.payload?.pageId || "NO_PAGE"
    });

    const evolved =
      typeof evolveEarn === "function"
        ? evolveEarn(baseEarn, {
            source: "PulseEarnSendSystem-v11",
            intent: impulse.intent,
            lineage: impulse.payload?.parentLineage || null
          })
        : baseEarn;

    return { ok: true, earn: evolved || baseEarn };
  } catch (err) {
    return { ok: false, error: err };
  }
}


// ============================================================================
//  INTERNAL: Build Earn v1 fallback via ContinuancePulse (v11-Evo)
// ============================================================================
function buildEarnV1Continuance(impulse) {
  const cont = PulseEarnContinuancePulse.build(impulse);
  return cont.earn;
}


// ============================================================================
//  INTERNAL: Wrap Earn organism into Pulse-compatible shape (v11-Evo)
// ============================================================================
function wrapEarnForPulse(earn) {
  return {
    PulseRole: earn.EarnRole,
    jobId: earn.jobId,
    pattern: earn.pattern,
    payload: earn.payload,
    priority: earn.priority,
    returnTo: earn.returnTo,
    lineage: earn.lineage,
    pageId: earn.pageId,
    meta: {
      ...(earn.meta || {}),
      origin: "Earn",
      earnVersion: earn.EarnRole?.version || "unknown",
      earnIdentity: earn.EarnRole?.identity || "Earn",
      earnEnvelope: true
    },

    earn: {
      role: earn.EarnRole,
      pattern: earn.pattern,
      lineage: earn.lineage,
      meta: earn.meta,
      __earnEnvelope: true
    }
  };
}


// ============================================================================
//  A-B-A Dual-Band + Binary + Wave Builder (v11+)
// ============================================================================
function buildEarnSendBandBinaryWave(earn, fallbackUsed, cycleIndex) {
  const band = normalizeBand(
    earn?.meta?.band ||
    earn?.band ||
    "symbolic"
  );

  const patternLen = String(earn.pattern || "").length;
  const lineageDepth = earn.lineage?.length || 0;
  const fallbackFlag = fallbackUsed ? 1 : 0;

  const surface = patternLen + lineageDepth + fallbackFlag + cycleIndex;

  const binaryField = {
    binaryEarnSendSignature: computeHash(`BESEND::${surface}`),
    binarySurfaceSignature: computeHash(`BSURF_ESEND::${surface}`),
    binarySurface: {
      patternLen,
      lineageDepth,
      fallbackFlag,
      cycle: cycleIndex,
      surface
    },
    parity: surface % 2 === 0 ? 0 : 1,
    density: patternLen + lineageDepth,
    shiftDepth: Math.max(0, Math.floor(Math.log2(surface || 1)))
  };

  const waveField = {
    amplitude: patternLen,
    wavelength: cycleIndex,
    phase: (patternLen + lineageDepth + cycleIndex) % 8,
    band,
    mode: band === "binary" ? "compression-wave" : "symbolic-wave"
  };

  const bandSignature = computeHash(`BAND::ESEND::${band}::${cycleIndex}`);

  return { band, bandSignature, binaryField, waveField };
}


// ============================================================================
//  FACTORY — SDN‑aware PulseEarnSendSystem (v11-Evo GOVERNED + A-B-A)
// ============================================================================
export function createPulseEarnSendSystem({
  sendSystem,
  sdn = null,
  log = console.log
}) {

  function emitSDN(event, payload) {
    if (!sdn || typeof sdn.emitImpulse !== "function") return;
    try {
      sdn.emitImpulse(event, payload);
    } catch (err) {
      log && log("[PulseEarnSendSystem-v11-Evo] SDN emit failed (non‑fatal)", { event, err });
    }
  }

  return {
    // Deterministic Single‑Pass Earn → Pulse → Send
    send(impulse) {
      const cycleIndex = impulse?.tickId || 0;

      emitSDN("earnSend:begin", {
        tickId: impulse.tickId,
        intent: impulse.intent
      });

      // ================================================================
      // 0. GOVERNOR — block Earn re-entry
      // ================================================================
      if (isEarnReentryImpulse(impulse)) {
        const blocked = {
          ok: false,
          blocked: true,
          reason: "earn_reentry_blocked",
          impulse,
          note: "Earn → Send → Earn loop prevented."
        };
        emitSDN("earnSend:blocked", blocked);
        return blocked;
      }

      // ================================================================
      // 1. Try Earn v11
      // ================================================================
      const v11 = tryEarnV11(impulse);

      let earn = null;
      let usedFallback = false;

      if (v11.ok) {
        earn = v11.earn;
        emitSDN("earnSend:earn-v11", {
          tickId: impulse.tickId,
          pattern: earn.pattern,
          lineageDepth: earn.lineage.length
        });
      } else {
        // ================================================================
        // 2. Fallback to Earn v1 via ContinuancePulse
        // ================================================================
        earn = buildEarnV1Continuance(impulse);
        usedFallback = true;
        emitSDN("earnSend:earn-v1-fallback", {
          tickId: impulse.tickId,
          error: String(v11.error),
          pattern: earn.pattern
        });
      }

      // ================================================================
      // 3. Wrap Earn organism for Pulse
      // ================================================================
      const pulseCompatibleEarn = wrapEarnForPulse(earn);

      emitSDN("earnSend:wrapped", {
        tickId: impulse.tickId,
        earnIdentity: earn.EarnRole.identity,
        pulseCompatibleEarn
      });

      // ================================================================
      // 4. Tag impulse as Earn → Pulse (single-pass)
      // ================================================================
      const governedImpulse = tagImpulseAsEarnSent(
        impulse,
        pulseCompatibleEarn
      );

      // ================================================================
      // 5. A-B-A Dual-Band + Binary + Wave metadata
      // ================================================================
      const bandPack = buildEarnSendBandBinaryWave(
        earn,
        usedFallback,
        cycleIndex
      );

      const earnSendSignature = computeHash(
        earn.pattern +
        "::" +
        earn.lineage.length +
        "::" +
        (usedFallback ? "fallback" : "primary") +
        "::" +
        bandPack.band
      );

      // ================================================================
      // 6. Delegate to PulseSendSystem (deterministic)
      // ================================================================
      const result = sendSystem.send(governedImpulse);

      const out = {
        ok: true,
        earn,
        pulseCompatibleEarn,
        result,
        fallback: usedFallback,
        earnSendSignature,
        band: bandPack.band,
        bandSignature: bandPack.bandSignature,
        binaryField: bandPack.binaryField,
        waveField: bandPack.waveField
      };

      emitSDN("earnSend:complete", out);
      return out;
    }
  };
}
