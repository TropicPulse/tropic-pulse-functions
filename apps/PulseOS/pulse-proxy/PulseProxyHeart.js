// ============================================================================
//  PULSE OS v10.2 — THE HEART
//  PulseProxyHeart — Cardiac Pacemaker Engine
//  ONE IMPORT ONLY (Pacemaker / SA Node)
//  Backend‑Only • Deterministic • Drift‑Proof • No IQ
// ============================================================================

import * as heartbeat from "./PulseProxyHeartBeat.js";

// ============================================================================
// HEART IDENTITY — v10.2
// ============================================================================
export const PulseRole = {
  type: "Organ",
  subsystem: "PulseProxy",
  layer: "Heart",
  version: "10.2",
  identity: "PulseProxyHeart",

  evo: {
    driftProof: true,
    deterministic: true,
    pacemakerOnly: true,
    noIQ: true,
    noRouting: true,
    noCompute: true,
    backendOnly: true,
    multiInstanceReady: true,
    futureEvolutionReady: true
  }
};

const HEART_CONTEXT = {
  layer: PulseRole.layer,
  role: "CARDIAC_PACEMAKER_ENGINE",
  version: PulseRole.version,
  pacemaker: {
    source: "heartbeat.js",
    version: heartbeat?.VERSION || "10.2",
    label: heartbeat?.LABEL || "HEARTBEAT_PACEMAKER"
  },
  evo: PulseRole.evo
};

// ============================================================================
// HEART LOGGER — logs only, no control
// ============================================================================
let HEART_EVENT_SEQ = 0;

async function logHeart(stage, details = {}) {
  HEART_EVENT_SEQ++;

  const payload = {
    seq: HEART_EVENT_SEQ,
    pulseLayer: "HEART-LAYER",
    pulseName: "THE HEART",
    pulseRole: "CARDIAC PACEMAKER ENGINE",
    stage,
    ts: Date.now(),
    ...details,
    ...HEART_CONTEXT
  };

  try {
    console.log("heart", "HEART_EVENT", payload);
  } catch (_) {}
}

// ============================================================================
// MAIN HANDLER — “THE HEARTBEAT”
//  Pure wrapper around the pacemaker. Nothing else.
// ============================================================================
export const handler = async () => {
  const runId = `HB_${Date.now()}`;

  await logHeart("BEAT_START", { runId });

  try {
    // ⭐ The ONLY thing the Heart does:
    const beatResult = await heartbeat.beat();

    await logHeart("BEAT_COMPLETE", { runId });

    return {
      statusCode: 200,
      body: JSON.stringify({
        ok: true,
        runId,
        beat: beatResult,
        ...HEART_CONTEXT
      })
    };

  } catch (err) {
    const msg = String(err);

    await logHeart("FATAL_ERROR", { runId, message: msg });

    return {
      statusCode: 500,
      body: JSON.stringify({
        ok: false,
        runId,
        error: msg,
        ...HEART_CONTEXT
      })
    };
  }
};
