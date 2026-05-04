/**
 * ============================================================
 *  FILE: PULSE-TOUCH.js
 *  ORGAN: Pulse‑Touch (Sensory Skin / Pre‑Pulse Ignition Organ)
 *  VERSION: v4.0.0-IMMORTAL
 *  AUTHOR: Pulse‑OS (Aldwyn’s Organism Architecture)
 * ============================================================
 *
 *  PURPOSE:
 *  --------
 *  Pulse‑Touch is the FIRST CONTACT organ of the Pulse‑OS
 *  organism. It is the SKIN — the sensory layer that detects
 *  presence BEFORE the organism wakes.
 *
 *  This organ:
 *    ✔ Fires as early as the browser allows (script in <head>)
 *    ✔ Seeds a tiny, safe, non‑tracking cookie
 *    ✔ Exposes a small API for:
 *        - reading skin state
 *        - updating skin state
 *        - registering preflight checks
 *    ✔ Integrates with:
 *        - PulseTouchDetector   (normalize skin state)
 *        - PulseTouchWarmup     (prewarm chunks/pages/mode)
 *        - PulseTouchSecurity   (risk/trust evaluation)
 *        - PulseTouchGate       (boot path decision)
 *        - PulseNet             (local immortal heartbeat)
 *        - PulseNet ingress     (Touch → Net signals)
 *    ✔ Lets the organism:
 *        - prewarm pages
 *        - prewarm chunks
 *        - prewarm subsystems
 *        - sanity‑check chunks before UI boot
 *        - start the local Pulse‑Net family loop
 *
 *  This is the organism’s FIRST NERVE SIGNAL.
 *  The moment the user touches the organism — the organism
 *  touches back.
 * ============================================================
 */
/*
AI_EXPERIENCE_META = {
  identity: "PulseTouch",
  version: "v4.0.0-IMMORTAL",
  layer: "skin",
  role: "first_contact_sensor",
  lineage: "PulseOS-v13 → v14-IMMORTAL → v4.0.0-IMMORTAL",

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

    // v4.0.0-IMMORTAL: PulseNet integration
    pulseNetAware: true,
    pulseNetIgnition: true,
    pulseNetIngressAware: true,
    heartbeatAware: true,
    overmindAware: true
  },

  contract: {
    always: [
      "PulseTouchDetector",
      "PulseTouchWarmup",
      "PulseTouchSecurity",
      "PulseTouchGate",
      "PulseNet",
      "PulseNetIngress"
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
// IMPORTS — PULSE-NET + TOUCH ORGANS
// ============================================================
import { startPulseNet, pulseNetIngressFromUser } from "./_BACKEND/PULSE-NET.js";
import { route } from "./_BACKEND/PulseProofBridge.js";

import { PulseTouchDetector } from "./_FRONTEND/PULSE-TOUCH-DETECTOR.js";
import { PulseTouchWarmup } from "./_FRONTEND/PULSE-TOUCH-WARMUP.js";
import { PulseTouchSecurity } from "./_FRONTEND/PULSE-TOUCH-SECURITY.js";
import { PulseTouchGate } from "./_FRONTEND/PULSE-TOUCH-GATE.js";

// ============================================================
// CONSTANTS — COOKIE + VERSION
// ============================================================
const PULSE_TOUCH_COOKIE_NAME = "pulse_touch";
const PULSE_TOUCH_MAX_AGE = 86400; // 1 day
const PULSE_TOUCH_VERSION = "4";

// in‑memory preflight registry (per page load)
const pulseTouchPreflights = [];

// expose current skin snapshot globally for PulseNet / others
if (typeof window !== "undefined") {
  window.__PULSE_TOUCH__ = window.__PULSE_TOUCH__ || null;
}

/**
 * Create or update the Pulse‑Touch skin cookie and expose
 * a small API for the organism to interact with it.
 *
 * This is the FIRST organ to fire in the browser.
 */
export function createPulseTouch(options = {}) {
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

  // 2) Read + normalize via Detector (IMMORTAL contract)
  const detected = PulseTouchDetector.normalize(
    readPulseTouchInternal(defaults)
  );

  // 3) Expose snapshot globally for PulseNet / Overmind / UI
  if (typeof window !== "undefined") {
    window.__PULSE_TOUCH__ = detected;
  }

  // 4) Run pre‑registered preflight checks as early as possible
  runPreflights(detected);

  // 5) Warmup: chunks/pages/mode/presence hints
  try {
    PulseTouchWarmup.prewarm(detected);
  } catch {
    // warmup is non‑fatal
  }

  // 6) Security: compute trust/risk profile
  let security = null;
  try {
    security = PulseTouchSecurity.evaluate(detected);
  } catch {
    security = { risk: "unknown", trust: "unknown", action: "allow" };
  }

  // 7) Gate: decide boot path (fast/safe/slow/refresh/fallback)
  let gateDecision = null;
  try {
    gateDecision = PulseTouchGate.decide({
      skin: detected,
      security
    });
  } catch {
    gateDecision = { mode: "fast", refresh: false, fallback: false };
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
  } catch {
    // PulseNet ignition is best-effort; organism must still boot
  }

  // 10) Send initial Touch → PulseNet ingress packet
  try {
    pulseNetIngressFromUser({
      source: "pulse-touch",
      event: "initial-touch",
      skin: detected,
      security,
      gate: gateDecision,
      ts: Date.now()
    });
  } catch {
    // ingress is non-fatal
  }

  /**
   * ------------------------------------------------------------
   *  API: update one field and rewrite cookie
   * ------------------------------------------------------------
   */
  function updatePulseTouchField(key, value) {
    const current = readPulseTouchInternal(defaults);
    current[key] = value;
    writePulseTouchCookie(current);

    const detectedUpdated = PulseTouchDetector.normalize(current);

    if (typeof window !== "undefined") {
      window.__PULSE_TOUCH__ = detectedUpdated;
    }

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
    } catch {}

    return detectedUpdated;
  }

  /**
   * ------------------------------------------------------------
   *  API: read current skin state (normalized)
   * ------------------------------------------------------------
   */
  function read() {
    const current = readPulseTouchInternal(defaults);
    return PulseTouchDetector.normalize(current);
  }

  /**
   * ------------------------------------------------------------
   *  API: register a preflight function
   * ------------------------------------------------------------
   *
   *  fn(skinState) → void | boolean | Promise<void|boolean>
   */
  function registerPreflight(fn) {
    if (typeof fn === "function") {
      pulseTouchPreflights.push(fn);
    }
  }

  return {
    update: updatePulseTouchField,
    read,
    registerPreflight
  };
}

/**
 * ------------------------------------------------------------
 * INTERNAL: write cookie
 * ------------------------------------------------------------
 */
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

/**
 * ------------------------------------------------------------
 * INTERNAL: read + normalize cookie (raw → base state)
 * ------------------------------------------------------------
 */
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

/**
 * ------------------------------------------------------------
 * INTERNAL: run preflight checks
 * ------------------------------------------------------------
 */
function runPreflights(skinState) {
  if (!pulseTouchPreflights.length) return;

  for (const fn of pulseTouchPreflights) {
    try {
      const result = fn(skinState);
      // allow async but don’t await (keep it lightweight)
      if (result && typeof result.then === "function") {
        result.catch(() => {});
      }
    } catch {
      // preflights must never crash the organism
    }
  }
}

/**
 * ------------------------------------------------------------
 * INTERNAL: apply gate decision (refresh / fallback / mode)
 * ------------------------------------------------------------
 */
function applyGateDecision(gateDecision, skin) {
  if (!gateDecision) return;

  // Example behaviors; you can tune these:
  if (gateDecision.refresh === true) {
    try {
      // mark intent before reload
      if (typeof window !== "undefined") {
        window.__PULSE_TOUCH_LAST_GATE__ = {
          ts: Date.now(),
          decision: gateDecision,
          skin
        };
      }
      location.reload();
    } catch {}
  }

  // Fallback could route to a static page, safe mode, etc.
  if (gateDecision.fallback === true && gateDecision.fallbackUrl) {
    try {
      location.href = gateDecision.fallbackUrl;
    } catch {}
  }
}

/**
 * ============================================================
 *  END OF FILE: PULSE-TOUCH.js (v4.0.0-IMMORTAL)
 * ============================================================
 */
