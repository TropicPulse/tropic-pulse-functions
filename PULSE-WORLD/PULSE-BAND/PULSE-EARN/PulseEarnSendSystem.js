// ============================================================================
//  PulseEarnSendSystem-v12.3-Presence.js
//  Earn Nervous System Conductor (v12.3-Presence + Advantage-C + Prewarm)
//  Deterministic Single‑Pass Earn → Pulse → Send (No async, No loops)
//  v12.3: Presence field + Advantage‑C + Chunk/Prewarm hints + A-B-A dual-band
// ============================================================================
//
//  SAFETY CONTRACT (v12.3-Presence):
//  ---------------------------------
//  • No async.
//  • No network.
//  • No GPU.
//  • No miner.
//  • No compute.
//  • Zero randomness.
//  • Zero timestamps.
//  • Zero mutation outside instance.
// ============================================================================

export const PulseEarnSendSystemMeta = Object.freeze({
  layer: "PulseEarnSendSystem",
  role: "EARN_SEND_CONDUCTOR",
  version: "v12.3-PRESENCE",
  identity: "PulseEarnSendSystem-v12.3-PRESENCE",

  guarantees: Object.freeze({
    deterministic: true,
    driftProof: true,
    noRandomness: true,
    noRealTime: true,
    noExternalIO: true,

    // GOVERNED laws
    governedSinglePass: true,
    governedNoLoops: true,
    governedNoAsync: true,
    governedNoNetwork: true,
    governedNoCompute: true,
    governedNoGPU: true,
    governedNoMiner: true,
    governedNoTimestamps: true,
    governedNoMutationOutsideInstance: true,

    // Band + metadata
    dualBandAware: true,
    binaryAware: true,
    waveFieldAware: true,
    healingMetadataAware: true,

    // Presence + Advantage‑C + prewarm
    presenceAware: true,
    advantageFieldAware: true,
    chunkPrewarmAware: true,

    // Safety
    zeroUserCode: true,
    zeroDynamicImports: true,
    zeroEval: true,
    worldLensAware: false,

    // Environment
    multiInstanceReady: true
  }),

  contract: Object.freeze({
    input: [
      "EarnOrganism",
      "PulseSendSystem",
      "ContinuancePulse",
      "DualBandContext",
      "DevicePhenotypePresence"
    ],
    output: [
      "SendConductorResult",
      "SendConductorDiagnostics",
      "SendConductorSignatures",
      "SendConductorHealingState",
      "SendConductorPresenceField",
      "SendConductorAdvantageField",
      "SendConductorChunkPrewarmPlan"
    ]
  }),

  lineage: Object.freeze({
    root: "PulseOS-v12-Presence",
    parent: "PulseEarn-v12.3-Presence",
    ancestry: [
      "PulseEarnSendSystem-v9",
      "PulseEarnSendSystem-v10",
      "PulseEarnSendSystem-v11",
      "PulseEarnSendSystem-v11-Evo",
      "PulseEarnSendSystem-v11.2-EVO"
    ]
  }),

  bands: Object.freeze({
    supported: ["symbolic", "binary"],
    default: "symbolic",
    behavior: "metadata-only",
    priority: "binary-first"
  }),

  architecture: Object.freeze({
    pattern: "A-B-A",
    baseline: "deterministic Earn → Pulse → Send conductor",
    adaptive: "binary/wave surfaces + dual-band signatures + presence/advantage fields",
    return: "deterministic send result + healing metadata + prewarm hints"
  })
});

import { createEarn, evolveEarn } from "./PulseEarn-v12.3-Presence.js";
import { PulseEarnContinuancePulse } from "./PulseEarnContinuancePulse-v12.3-Presence.js";


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
//  GOVERNOR — Earn Loop Guard (v12.3-Presence)
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
            source: "PulseEarnSendSystem-v12.3-Presence",
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
//  A-B-A Dual-Band + Binary + Wave Builder (v12.3-Presence)
// ============================================================================

function buildEarnSendBandBinaryWave(earn, fallbackUsed, cycleIndex, deviceProfile) {
  const band = normalizeBand(
    earn?.meta?.band ||
    earn?.band ||
    deviceProfile?.band ||
    "symbolic"
  );

  const patternLen = String(earn.pattern || "").length;
  const lineageDepth = earn.lineage?.length || 0;
  const fallbackFlag = fallbackUsed ? 1 : 0;

  const surface =
    patternLen +
    lineageDepth +
    fallbackFlag +
    (deviceProfile?.gpuScore || 0) +
    cycleIndex;

  const binaryField = {
    binaryEarnSendSignature: computeHash(`BESEND::${surface}`),
    binarySurfaceSignature: computeHash(`BSURF_ESEND::${surface}`),
    binarySurface: {
      patternLen,
      lineageDepth,
      fallbackFlag,
      gpuScore: deviceProfile?.gpuScore || 0,
      cycle: cycleIndex,
      surface
    },
    parity: surface % 2 === 0 ? 0 : 1,
    density: patternLen + lineageDepth + (deviceProfile?.gpuScore || 0),
    shiftDepth: Math.max(0, Math.floor(Math.log2(surface || 1)))
  };

  const waveField = {
    amplitude: patternLen + (deviceProfile?.gpuScore || 0),
    wavelength: cycleIndex || 1,
    phase: (patternLen + lineageDepth + cycleIndex) % 8,
    band,
    mode: band === "binary" ? "compression-wave" : "symbolic-wave"
  };

  const bandSignature = computeHash(`BAND::ESEND::${band}::${cycleIndex}`);

  return { band, bandSignature, binaryField, waveField };
}


// ============================================================================
//  Presence + Advantage‑C + Chunk/Prewarm Fields (v12.3-Presence)
// ============================================================================

function buildPresenceField(earn, deviceProfile, fallbackUsed) {
  const patternLen = String(earn.pattern || "").length;
  const lineageDepth = earn.lineage?.length || 0;
  const band = normalizeBand(deviceProfile?.band || earn.band || "symbolic");

  const composite =
    patternLen * 0.001 +
    lineageDepth * 0.002 +
    (fallbackUsed ? -0.003 : 0.003) +
    (deviceProfile?.stabilityScore || 0.7) * 0.01;

  const presenceTier =
    composite >= 0.02 ? "presence_high" :
    composite >= 0.005 ? "presence_mid" :
    "presence_low";

  return {
    presenceVersion: "v12.3",
    presenceTier,
    band,
    patternLen,
    lineageDepth,
    fallbackUsed
  };
}

function buildAdvantageField(earn, deviceProfile, bandPack, presenceField) {
  const gpuScore = deviceProfile?.gpuScore || 0;
  const bandwidth = deviceProfile?.bandwidthMbps || 0;
  const density = bandPack.binaryField.density || 0;
  const amplitude = bandPack.waveField.amplitude || 0;

  const advantageScore =
    gpuScore * 0.0005 +
    bandwidth * 0.0002 +
    density * 0.00001 +
    amplitude * 0.00001 +
    (presenceField.presenceTier === "presence_high" ? 0.01 : 0);

  return {
    advantageVersion: "C",
    band: bandPack.band,
    gpuScore,
    bandwidth,
    binaryDensity: density,
    waveAmplitude: amplitude,
    presenceTier: presenceField.presenceTier,
    advantageScore
  };
}

function buildChunkPrewarmPlan(earn, deviceProfile, presenceField) {
  const basePriority =
    presenceField.presenceTier === "presence_high"
      ? 3
      : presenceField.presenceTier === "presence_mid"
      ? 2
      : 1;

  const gpuBoost = (deviceProfile?.gpuScore || 0) > 600 ? 1 : 0;
  const priority = basePriority + gpuBoost;

  return {
    planVersion: "v12.3-AdvantageC",
    priority,
    band: presenceField.band,
    chunks: {
      jobEnvelope: true,
      metabolismBlueprint: true,
      marketplaceHandshake: true
    },
    cache: {
      deviceProfile: true,
      survivalDiagnostics: true
    },
    prewarm: {
      metabolismOrgan: true,
      lymphaticHandshake: true,
      immuneSystemScan: presenceField.presenceTier !== "presence_low"
    }
  };
}


// ============================================================================
//  FACTORY — Presence‑aware PulseEarnSendSystem (v12.3-Presence + Advantage-C)
// ============================================================================
export function createPulseEarnSendSystem({
  sendSystem,
  sdn = null,
  log = console.log,
  deviceProfile = null // Presence‑aware skeletal phenotype
}) {

  // v13: hardened SDN emitter
  function emitSDN(event, payload) {
    if (!sdn || typeof sdn.emitImpulse !== "function") return;
    try {
      sdn.emitImpulse(event, payload);
    } catch (err) {
      log && log("[PulseEarnSendSystem-v13-Evo] SDN emit failed (non‑fatal)", {
        event,
        err
      });
    }
  }

  return {
    // v13: Deterministic Single‑Pass Earn → Pulse → Send
    send(impulse) {
      const cycleIndex = impulse?.tickId || 0;

      emitSDN("earnSend:begin", {
        tickId: impulse.tickId,
        intent: impulse.intent
      });

      // 0. GOVERNOR — block Earn re-entry
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

      // 1. Try Earn v11
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
        // 2. Fallback to Earn v1 via ContinuancePulse
        earn = buildEarnV1Continuance(impulse);
        usedFallback = true;
        emitSDN("earnSend:earn-v1-fallback", {
          tickId: impulse.tickId,
          error: String(v11.error),
          pattern: earn.pattern
        });
      }

      // 3. Wrap Earn organism for Pulse
      const pulseCompatibleEarn = wrapEarnForPulse(earn);

      emitSDN("earnSend:wrapped", {
        tickId: impulse.tickId,
        earnIdentity: earn.EarnRole.identity,
        pulseCompatibleEarn
      });

      // 4. Tag impulse as Earn → Pulse (single-pass)
      const governedImpulse = tagImpulseAsEarnSent(
        impulse,
        pulseCompatibleEarn
      );

      // 5. A‑B‑A Dual-Band + Binary + Wave metadata (v13 hardened)
      const bandPack = buildEarnSendBandBinaryWave(
        earn,
        usedFallback,
        cycleIndex,
        deviceProfile
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

      // 6. Presence + Advantage‑C + Chunk/Prewarm (v13 tuned)
      const presenceField = buildPresenceField(
        earn,
        deviceProfile || {},
        usedFallback
      );

      const advantageField = buildAdvantageField(
        earn,
        deviceProfile || {},
        bandPack,
        presenceField
      );

      const chunkPrewarmPlan = buildChunkPrewarmPlan(
        earn,
        deviceProfile || {},
        presenceField
      );

      // 7. Delegate to PulseSendSystem (deterministic)
      const result = sendSystem.send(governedImpulse);

      const out = {
        ok: true,
        earn,
        pulseCompatibleEarn,
        result,
        fallback: usedFallback,
        earnSendSignature,

        // v13 A‑B‑A surfaces
        band: bandPack.band,
        bandSignature: bandPack.bandSignature,
        binaryField: bandPack.binaryField,
        waveField: bandPack.waveField,

        // v13 presence + advantage + chunk/prewarm
        presenceField,
        advantageField,
        chunkPrewarmPlan
      };

      emitSDN("earnSend:complete", out);
      return out;
    }
  };
}
