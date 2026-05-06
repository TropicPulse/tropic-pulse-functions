/**
 * ============================================================
 *  FILE: PULSE-TOUCH-v17.js
 *  ORGAN: Pulse‑Touch (Sensory Skin / Pre‑Pulse Ignition Organ)
 *  VERSION: v17.0.0-Immortal-Portal-Skin-Continuous
 *  AUTHOR: Pulse‑OS (Aldwyn’s Organism Architecture)
 * ============================================================
 *
 *  PURPOSE:
 *  --------
 *  Pulse‑Touch is the FIRST CONTACT organ of the Pulse‑OS
 *  organism. It is the SKIN — the sensory layer that detects
 *  presence BEFORE the organism wakes.
 *
 *  v17 EVOLUTION:
 *  --------------
 *  - Continuous, low‑cost pulse stream to Pulse‑Net
 *  - Fast‑lane “intent only” WSEND pulses
 *  - Temporal timeline of first contact + ongoing presence
 *  - Prewarm hints emitted over time, not just once
 *  - Designed for high limits, low device impact
 *
 *  This is the organism’s FIRST NERVE SIGNAL.
 *  The moment the user touches the organism — the organism
 *  touches back, and keeps listening.
 * ============================================================
 */
/*
AI_EXPERIENCE_META = {
  identity: "PulseTouch",
  version: "v17.0.0-Immortal-Portal-Skin-Continuous",
  layer: "skin",
  role: "first_contact_sensor",
  lineage: "PulseOS-v13 → v14-Immortal → v4.0.0-Immortal → v16-Immortal-Portal → v17-Continuous",

  evo: {
    prePulse: true,
    presenceAware: true,
    identityHintAware: true,
    regionHintAware: true,
    trustHintAware: true,
    dualBand: true,
    deterministic: true,
    driftProof: true,

    // IMMORTAL upgrades
    zeroPII: true,
    zeroTracking: true,
    zeroInference: true,
    safeCookie: true,
    prewarmSignal: true,
    preflightAware: true,
    chunkProfileAware: true,
    pageHintAware: true,

    // PulseNet integration
    pulseNetAware: true,
    pulseNetIgnition: true,
    pulseNetIngressAware: true,
    heartbeatAware: true,
    overmindAware: true,

    // v16-Immortal-Portal: Time-axis + Portal Trust Layer
    timeAxisAware: true,
    firstContactTimeline: true,
    portalTrustEdge: true,
    bridgeAligned: true,
    loggerAligned: true,
    monitorAligned: true,

    // v17-Continuous: Continuous pulse stream
    continuousPulse: true,
    fastLaneAware: true,
    temporalHintAware: true
  },

  contract: {
    always: [
      "PulseTouchDetector",
      "PulseTouchWarmup",
      "PulseTouchSecurity",
      "PulseTouchGate",
      "PulseNet",
      "PulseNetIngress",
      "PulseProofBridge",
      "PulseProofLogger"
    ],
    never: [
      "identityInference",
      "tracking",
      "PII",
      "legacyCookies",
      "legacyPulseNet",
      "legacyNetworkLayer"
    ]
  }
}
*/

// ============================================================
// IMPORTS — PULSE-NET + TOUCH ORGANS + BRIDGE
// ============================================================
import {
  startPulseNet,
  pulseNetIngressFromUser,
  pulseNetFastLanePulse
} from "./_BACKEND/PULSE-NET-v17.js";

import { route as bridgeRoute } from "./_BACKEND/PulseProofBridge-v16.js";

import { PulseTouchDetector } from "./_OUTERSENSES/PULSE-TOUCH-DETECTOR.js";
import { PulseTouchWarmup } from "./_OUTERSENSES/PULSE-TOUCH-WARMUP.js";
import { PulseTouchSecurity } from "./_OUTERSENSES/PULSE-TOUCH-SECURITY.js";
import { PulseTouchGate } from "./_OUTERSENSES/PULSE-TOUCH-GATE.js";

// Optional logger (if present)
const g =
  typeof globalThis !== "undefined"
    ? globalThis
    : typeof global !== "undefined"
    ? global
    : typeof window !== "undefined"
    ? window
    : typeof g !== "undefined"
    ? g
    : {};

const PulseLogger =
  (typeof window !== "undefined" && window.PulseLogger) ||
  (typeof g !== "undefined" && g.PulseLogger) ||
  null;

// ============================================================
// CONSTANTS — COOKIE + VERSION + TIMELINE + PULSE CONFIG
// ============================================================
const PULSE_TOUCH_COOKIE_NAME = "pulse_touch";
const PULSE_TOUCH_MAX_AGE = 86400; // 1 day
const PULSE_TOUCH_VERSION = "17";

const PULSE_TOUCH_TIMELINE_LS_KEY = "PulseTouch.v17.timeline";
const PULSE_TOUCH_TIMELINE_MAX = 256;

// continuous pulse config (safe, low impact)
const PULSE_TOUCH_PULSE_INTERVAL_MS = 200; // 5 pulses/sec
const PULSE_TOUCH_PULSE_BURST_COUNT = 8;   // initial burst
const PULSE_TOUCH_PULSE_BURST_SPACING_MS = 60;

// in‑memory preflight registry (per page load)
const pulseTouchPreflights = [];

// expose current skin snapshot globally for PulseNet / others
if (typeof window !== "undefined") {
  window.__PULSE_TOUCH__ = window.__PULSE_TOUCH__ || null;
  window.__PULSE_TOUCH_ORIGIN_TS__ =
    window.__PULSE_TOUCH_ORIGIN_TS__ || Date.now();
  window.__PULSE_TOUCH_PULSE_STATE__ =
    window.__PULSE_TOUCH_PULSE_STATE__ || { started: false };
}

// ============================================================
// TIMELINE HELPERS — IMMORTAL FIRST-CONTACT AXIS
// ============================================================
function hasLocalStorage() {
  try {
    if (typeof window === "undefined" || !window.localStorage) return false;
    const t = "__pulse_touch_test__";
    window.localStorage.setItem(t, "1");
    window.localStorage.removeItem(t);
    return true;
  } catch {
    return false;
  }
}

function loadTouchTimeline() {
  if (!hasLocalStorage()) return [];
  try {
    const raw = window.localStorage.getItem(PULSE_TOUCH_TIMELINE_LS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveTouchTimeline(buf) {
  if (!hasLocalStorage()) return;
  try {
    const trimmed =
      buf.length > PULSE_TOUCH_TIMELINE_MAX
        ? buf.slice(buf.length - PULSE_TOUCH_TIMELINE_MAX)
        : buf;
    window.localStorage.setItem(
      PULSE_TOUCH_TIMELINE_LS_KEY,
      JSON.stringify(trimmed)
    );
  } catch {
    // never throw
  }
}

function appendTouchTimeline(kind, payload = {}) {
  const ts = Date.now();
  const origin =
    (typeof window !== "undefined" && window.__PULSE_TOUCH_ORIGIN_TS__) ||
    ts;

  const entry = {
    ts,
    dt: ts - origin,
    kind,
    payload: {
      ...payload,
      version: PULSE_TOUCH_VERSION
    }
  };

  const buf = loadTouchTimeline();
  buf.push(entry);
  saveTouchTimeline(buf);

  // Optional: mirror into bridge (fire-and-forget) for CNS/log surfaces
  try {
    bridgeRoute?.("touch.timeline", {
      ts,
      dt: entry.dt,
      kind,
      payload: entry.payload
    }).catch?.(() => {});
  } catch {}

  // Optional: mirror into logger collection if available
  try {
    if (PulseLogger && typeof PulseLogger.route === "function") {
      PulseLogger.route("touchTimeline.log", {
        ts,
        dt: entry.dt,
        kind,
        payload: entry.payload
      }).catch?.(() => {});
    }
  } catch {}
}

// ============================================================
// CONTINUOUS PULSE ENGINE — FAST-LANE WSEND INTENT STREAM
// ============================================================
function startContinuousPulseStream(skin, security, gateDecision) {
  if (typeof window === "undefined") return;
  const state = window.__PULSE_TOUCH_PULSE_STATE__;
  if (!state || state.started) return;

  state.started = true;
  state.intervalId = null;

  appendTouchTimeline("pulse_stream_start", {
    intervalMs: PULSE_TOUCH_PULSE_INTERVAL_MS
  });

  // Initial burst: fast, dense hints to Pulse‑Net
  try {
    for (let i = 0; i < PULSE_TOUCH_PULSE_BURST_COUNT; i++) {
      setTimeout(() => {
        sendFastLanePulse("burst", skin, security, gateDecision);
      }, i * PULSE_TOUCH_PULSE_BURST_SPACING_MS);
    }
  } catch {}

  // Continuous stream: low‑cost, steady hints
  try {
    state.intervalId = setInterval(() => {
      sendFastLanePulse("continuous", skin, security, gateDecision);
    }, PULSE_TOUCH_PULSE_INTERVAL_MS);
  } catch {
    appendTouchTimeline("pulse_stream_failed", {});
  }
}

function sendFastLanePulse(mode, skin, security, gateDecision) {
  const ts = Date.now();
  const payload = {
    source: "pulse-touch",
    mode,
    ts,
    skin: {
      region: skin.region,
      mode: skin.mode,
      presence: skin.presence,
      page: skin.page,
      chunkProfile: skin.chunkProfile
    },
    security: {
      risk: security?.risk ?? "unknown",
      trust: security?.trust ?? "unknown",
      action: security?.action ?? "allow"
    },
    gate: {
      mode: gateDecision?.mode ?? "fast",
      refresh: !!gateDecision?.refresh,
      fallback: !!gateDecision?.fallback
    }
  };

  appendTouchTimeline("pulse_fastlane_emit", {
    mode,
    page: skin.page,
    chunkProfile: skin.chunkProfile
  });

  // 1) Direct Pulse‑Net fast‑lane (WSEND‑style intent)
  try {
    pulseNetFastLanePulse(payload);
  } catch {}

  // 2) Optional ingress (normal path) for analytics / overmind
  try {
    pulseNetIngressFromUser({
      source: "pulse-touch",
      event: "pulse",
      ts,
      skin,
      security,
      gate: gateDecision,
      mode
    });
  } catch {}
}

// ============================================================
// CORE API — CREATE PULSE TOUCH
// ============================================================
export function createPulseTouch(options = {}) {
  const originTs =
    (typeof window !== "undefined" && window.__PULSE_TOUCH_ORIGIN_TS__) ||
    Date.now();

  appendTouchTimeline("touch_init_called", {
    originTs,
    optionsHint: {
      region: options.region || null,
      mode: options.mode || null,
      page: options.page || null,
      chunkProfile: options.chunkProfile || null
    }
  });

  /**
   * ------------------------------------------------------------
   * 1. DEFAULT METADATA (Organism‑Safe, Non‑PII)
   * ------------------------------------------------------------
   */
  const defaults = {
    region: options.region || "unknown",
    trusted: options.trusted || "0",
    mode: options.mode || "fast",
    presence: options.presence || "active",
    identity: options.identity || "anon",
    page: options.page || "index",
    chunkProfile: options.chunkProfile || "default",
    version: PULSE_TOUCH_VERSION
  };

  // 1) Seed cookie immediately
  writePulseTouchCookie(defaults);
  appendTouchTimeline("cookie_seeded", { state: defaults });

  // 2) Read + normalize via Detector (IMMORTAL contract)
  const detected = PulseTouchDetector.normalize(
    readPulseTouchInternal(defaults)
  );
  appendTouchTimeline("skin_detected", { skin: detected });

  // 3) Expose snapshot globally for PulseNet / Overmind / UI
  if (typeof window !== "undefined") {
    window.__PULSE_TOUCH__ = detected;
  }

  // 4) Run pre‑registered preflight checks as early as possible
  appendTouchTimeline("preflights_start", {
    count: pulseTouchPreflights.length
  });
  runPreflights(detected);
  appendTouchTimeline("preflights_done", {});

  // 5) Warmup: chunks/pages/mode/presence hints
  try {
    appendTouchTimeline("warmup_start", {
      page: detected.page,
      mode: detected.mode,
      chunkProfile: detected.chunkProfile
    });
    PulseTouchWarmup.prewarm(detected);
    appendTouchTimeline("warmup_done", {});
  } catch {
    appendTouchTimeline("warmup_failed", {});
  }

  // 6) Security: compute trust/risk profile
  let security = null;
  try {
    security = PulseTouchSecurity.evaluate(detected);
    appendTouchTimeline("security_evaluated", { security });
  } catch {
    security = { risk: "unknown", trust: "unknown", action: "allow" };
    appendTouchTimeline("security_failed", {});
  }

  // 7) Gate: decide boot path (fast/safe/slow/refresh/fallback)
  let gateDecision = null;
  try {
    gateDecision = PulseTouchGate.decide({
      skin: detected,
      security
    });
    appendTouchTimeline("gate_decided", { gateDecision });
  } catch {
    gateDecision = { mode: "fast", refresh: false, fallback: false };
    appendTouchTimeline("gate_failed", {});
  }

  // 8) Optionally act on gate decision (e.g., hard refresh)
  applyGateDecision(gateDecision, detected);

  // 9) Ignite PulseNet (local immortal loop) — idempotent
  try {
    startPulseNet({
      instanceId: "core",
      intervalMs: 750,
      superInstance: true
    });
    appendTouchTimeline("pulsenet_ignited", { intervalMs: 750 });
  } catch {
    appendTouchTimeline("pulsenet_ignite_failed", {});
  }

  // 10) Send initial Touch → PulseNet ingress packet
  try {
    const packet = {
      source: "pulse-touch",
      event: "initial-touch",
      skin: detected,
      security,
      gate: gateDecision,
      ts: Date.now()
    };
    pulseNetIngressFromUser(packet);
    appendTouchTimeline("ingress_initial_sent", {});
  } catch {
    appendTouchTimeline("ingress_initial_failed", {});
  }

  // 11) Start continuous fast‑lane pulse stream
  try {
    startContinuousPulseStream(detected, security, gateDecision);
  } catch {
    appendTouchTimeline("pulse_stream_start_failed", {});
  }

  function updatePulseTouchField(key, value) {
    const current = readPulseTouchInternal(defaults);
    current[key] = value;
    writePulseTouchCookie(current);

    const detectedUpdated = PulseTouchDetector.normalize(current);

    if (typeof window !== "undefined") {
      window.__PULSE_TOUCH__ = detectedUpdated;
    }

    appendTouchTimeline("skin_updated", {
      key,
      value,
      skin: detectedUpdated
    });

    // send incremental update into PulseNet as ingress
    try {
      pulseNetIngressFromUser({
        source: "pulse-touch",
        event: "update",
        key,
        value,
        skin: detectedUpdated,
        ts: Date.now()
      });
      appendTouchTimeline("ingress_update_sent", { key, value });
    } catch {
      appendTouchTimeline("ingress_update_failed", { key, value });
    }

    return detectedUpdated;
  }

  function read() {
    const current = readPulseTouchInternal(defaults);
    const normalized = PulseTouchDetector.normalize(current);
    appendTouchTimeline("skin_read", { skin: normalized });
    return normalized;
  }

  function registerPreflight(fn) {
    if (typeof fn === "function") {
      pulseTouchPreflights.push(fn);
      appendTouchTimeline("preflight_registered", {
        count: pulseTouchPreflights.length
      });
    }
  }

  return {
    update: updatePulseTouchField,
    read,
    registerPreflight
  };
}

// ============================================================
// COOKIE HELPERS
// ============================================================
function writePulseTouchCookie(state) {
  const cookieValue =
    `region=${state.region}` +
    `|trusted=${state.trusted}` +
    `|mode=${state.mode}` +
    `|presence=${state.presence}` +
    `|identity=${state.identity}` +
    `|page=${state.page}` +
    `|chunkProfile=${state.chunkProfile}` +
    `|v=${state.version}`;

  document.cookie =
    `${PULSE_TOUCH_COOKIE_NAME}=${cookieValue};` +
    `path=/;` +
    `max-age=${PULSE_TOUCH_MAX_AGE};` +
    `SameSite=Lax;` +
    `Secure`;
}

function readPulseTouchInternal(defaults) {
  const raw = document.cookie
    .split("; ")
    .find((c) => c.startsWith(`${PULSE_TOUCH_COOKIE_NAME}=`));

  if (!raw) return { ...defaults };

  const value = raw.replace(`${PULSE_TOUCH_COOKIE_NAME}=`, "");
  const parts = value.split("|");

  const parsed = {};
  for (const part of parts) {
    const [k, v] = part.split("=");
    parsed[k] = v;
  }

  return {
    region: parsed.region || defaults.region,
    trusted: parsed.trusted || defaults.trusted,
    mode: parsed.mode || defaults.mode,
    presence: parsed.presence || defaults.presence,
    identity: parsed.identity || defaults.identity,
    page: parsed.page || defaults.page,
    chunkProfile: parsed.chunkProfile || defaults.chunkProfile,
    version: parsed.v || defaults.version
  };
}

// ============================================================
// PREFLIGHT + GATE HELPERS
// ============================================================
function runPreflights(skinState) {
  if (!pulseTouchPreflights.length) return;

  for (const fn of pulseTouchPreflights) {
    try {
      const result = fn(skinState);
      if (result && typeof result.then === "function") {
        result.catch(() => {});
      }
    } catch {
      // preflights must never crash the organism
    }
  }
}

function applyGateDecision(gateDecision, skin) {
  if (!gateDecision) return;

  appendTouchTimeline("gate_apply", { gateDecision });

  if (gateDecision.refresh === true) {
    try {
      if (typeof window !== "undefined") {
        window.__PULSE_TOUCH_LAST_GATE__ = {
          ts: Date.now(),
          decision: gateDecision,
          skin
        };
      }
      location.reload();
    } catch {
      appendTouchTimeline("gate_refresh_failed", {});
    }
  }

  if (gateDecision.fallback === true && gateDecision.fallbackUrl) {
    try {
      location.href = gateDecision.fallbackUrl;
    } catch {
      appendTouchTimeline("gate_fallback_failed", {
        url: gateDecision.fallbackUrl
      });
    }
  }
}

// ============================================================
//  FOOTER — CONTINUOUS CONTACT LORE
// ============================================================
//
//  Pulse‑Touch used to remember the first time you arrived.
//  Now it remembers the rhythm of your presence.
//
//  Every 200ms, a tiny signal leaves the skin, crosses the
//  membrane, and taps on Pulse‑Net’s door:
//
//      “Still here. Still watching. Still ready.”
//
//  Somewhere on the other side of the glass, an immortal
//  organism rearranges itself a little faster, just for you.
//
//  If this is how it behaves on the first day,
//  what will its timing feel like on the millionth?
//
// ============================================================
