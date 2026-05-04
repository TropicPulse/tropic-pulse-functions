/**
 * ============================================================
 *  FILE: PULSE-TOUCH.js
 *  ORGAN: Pulse‑Touch (Sensory Skin / Pre‑Pulse Ignition Organ)
 *  VERSION: v3.0.0-IMMORTAL
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
 *    ✔ Lets the organism:
 *        - prewarm pages
 *        - prewarm chunks
 *        - prewarm subsystems
 *        - sanity‑check chunks before UI boot
 *
 *  This is the organism’s FIRST NERVE SIGNAL.
 *  The moment the user touches the organism — the organism
 *  touches back.
 *
 * ============================================================
 *  COOKIE FORMAT (safe, tiny, non‑PII)
 *  -----------------------------------
 *  pulse_touch =
 *    region=BZ-01|
 *    trusted=1|
 *    mode=fast|
 *    presence=active|
 *    identity=has|
 *    page=index|
 *    chunkProfile=default|
 *    v=3
 *
 *  All values are:
 *    - Hints only
 *    - Non‑PII
 *    - Non‑tracking
 *    - Local to your domain
 *
 *  ADVANTAGE HINTS:
 *    - region        → route to nearest cluster / CDN
 *    - mode          → choose fast / secure / low_power UI paths
 *    - presence      → pre‑decide animation / polling intensity
 *    - identity      → decide whether to pre‑mount auth UI
 *    - page          → hint which page is “intended” next
 *    - chunkProfile  → hint which chunk set to pre‑verify/pre‑warm
 *
 * ============================================================
 *  EXPORT:
 *  -------
 *  createPulseTouch()
 *    → initializes + updates the Pulse‑Touch cookie
 *
 *  PulseTouch API:
 *    - api.read()          → read current skin state
 *    - api.update(key,val) → update one field + rewrite cookie
 *    - api.registerPreflight(fn) → register a pre‑UI check
 *
 *  Preflight functions:
 *    - run as soon as this file executes
 *    - receive the current skin state
 *    - can be used to:
 *        • sanity‑check chunks
 *        • pre‑validate local caches
 *        • decide to hard‑refresh if something is corrupt
 *
 * ============================================================
 */
/*
AI_EXPERIENCE_META = {
  identity: "PulseTouch",
  version: "v14-IMMORTAL",
  layer: "skin",
  role: "first_contact_sensor",
  lineage: "PulseOS-v13",

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
    pageHintAware: true
  },

  contract: {
    always: [
      "PulseTouchDetector",
      "PulseTouchWarmup",
      "PulseTouchGate"
    ],
    never: [
      "identityInference",
      "tracking",
      "PII",
      "legacyCookies"
    ]
  }
}
*/

const PULSE_TOUCH_COOKIE_NAME = "pulse_touch";
const PULSE_TOUCH_MAX_AGE = 86400; // 1 day
const PULSE_TOUCH_VERSION = "3";

// in‑memory preflight registry (per page load)
const pulseTouchPreflights = [];

/**
 * Create or update the Pulse‑Touch skin cookie and expose
 * a small API for the organism to interact with it.
 */
export function createPulseTouch(options = {}) {
  /**
   * ------------------------------------------------------------
   * 1. DEFAULT METADATA (Organism‑Safe, Non‑PII)
   * ------------------------------------------------------------
   *
   *  These values represent the organism’s FIRST GUESS about
   *  the device and intent. They are NOT sensitive. They are
   *  NOT identity. They are NOT tracking. They are simply HINTS.
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

  // write cookie immediately on first call
  writePulseTouchCookie(defaults);

  // run any pre‑registered preflight checks as early as possible
  runPreflights(defaults);

  /**
   * ------------------------------------------------------------
   *  API: update one field and rewrite cookie
   * ------------------------------------------------------------
   */
  function updatePulseTouchField(key, value) {
    const current = readPulseTouchInternal(defaults);
    current[key] = value;
    writePulseTouchCookie(current);
    return current;
  }

  /**
   * ------------------------------------------------------------
   *  API: read current skin state
   * ------------------------------------------------------------
   */
  function read() {
    return readPulseTouchInternal(defaults);
  }

  /**
   * ------------------------------------------------------------
   *  API: register a preflight function
   * ------------------------------------------------------------
   *
   *  fn(skinState) → void | boolean | Promise<void|boolean>
   *
   *  Example uses:
   *    - verify required chunks exist in localStorage
   *    - verify a known “chunkProfile” is compatible
   *    - decide to hard‑reload if something is corrupt
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
 * INTERNAL: read + normalize cookie
 * ------------------------------------------------------------
 */
function readPulseTouchInternal(defaults) {
  const raw = document.cookie
    .split("; ")
    .find(c => c.startsWith(`${PULSE_TOUCH_COOKIE_NAME}=`));

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
 *
 *  Each preflight gets the current skin state.
 *  If a preflight decides something is fatally wrong
 *  (e.g., corrupted chunks), it can:
 *
 *    - call location.reload()
 *    - clear localStorage
 *    - adjust mode/page/chunkProfile via createPulseTouch().update()
 *
 *  This is where you get your “we can parse the chunks and
 *  refresh the pages before we get there” advantage.
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
 * ============================================================
 *  END OF FILE: PULSE-TOUCH.js (IMMORTAL)
 * ============================================================
 */
