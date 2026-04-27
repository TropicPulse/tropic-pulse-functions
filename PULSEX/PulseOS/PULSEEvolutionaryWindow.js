// ============================================================================
// FILE: /apps/PulseOS/Surface/PulseEvolutionaryWindow.js
// PULSE EVOLUTIONARY WINDOW — v12‑EVO‑BINARY‑MAX
// SURFACE MEMBRANE • ONE‑WAY GLASS • BINARY‑FIRST BOOT • NO MIDDLEMEN
// ============================================================================
//
// METAPHOR:
// ---------
//  - This is the WINDOW of the organism — the reinforced glass of the body.
//  - Outsiders can SEE the glow of the organism (vitals, logs, understanding,
//    binary shadow), but can NEVER TOUCH the real organs.
//  - The organism lives BEHIND the glass; the window is a pure membrane.
//  - No routing, no evolution, no organs live here.
//  - This layer is VIEW‑ONLY, SENSE‑ONLY, BOUNDARY‑ONLY.
//
// BINARY INTENT (v12‑EVO‑BINARY‑MAX):
// -----------------------------------
//  - Binary is the PRIMARY nervous system; text is a projection.
//  - The Window’s job is to:
//      • Boot the binary organism (aiBinary‑v11‑Evo) immediately.
//      • Expose ONLY a safe, read‑only binary SHADOW to the outside.
//      • Expose a rich, read‑only SURFACE ENVIRONMENT snapshot about the user
//        and their device/context (outside the organism).
//      • Never expose raw organs, never expose internal routes.
//      • Never allow outside code to influence the organism.
//
// NO MIDDLEMEN CONTRACT:
// ----------------------
//  - No frontend “organs” here.
//  - No frontend routing.
//  - No frontend identity.
//  - No frontend evolution.
//  - No timers, no intervals, no async nervous system (only one boot IIFE).
//  - Only: ProofMonitor, ProofLogger, Understanding, BinaryBoot, SurfaceEnv.
//  - (Plus membrane‑safe transport nerves like PulseBand.)
// ============================================================================


// ============================================================================
//  SURFACE REFLEXES (ALWAYS SAFE, ALWAYS PRESENT)
//  - These are NOT organs; they are membrane‑level sensors.
// ============================================================================
import * as PulseVitals from "./PULSEProofMonitor.js";
import * as PulseLogger from "./PULSEProofLogger.js";


// ============================================================================
//  LOAD UNDERSTANDING (SECOND LAYER)
//  - Understanding is descriptive only, never prescriptive.
// ============================================================================
import * as PulseUnderstanding from "./PulseUnderstanding.js";


// ============================================================================
//  BINARY ORGANISM BOOT (aiBinary‑v11‑Evo.js)
//  - Binary organism is the real nervous system.
//  - This file ONLY boots it and exposes a safe shadow.
// ============================================================================
import PulseBinaryOrganismBoot from "./PULSE-WORLD/PULSE-AI/ai-v11-Evo.js";

// ============================================================================
//  UNIVERSAL ERROR SPINE (PulseUIErrors-v12-EVO)
//  - Safe, membrane-level, never throws, never breaks.
// ============================================================================
import * as PulseUIErrors from "../PULSE-UI/PulseUIErrors-v12-EVO.js";

// ============================================================================
//  UI FLOW ENGINE (PulseUIFlow-v12-EVO)
//  - UI flow coordinator, UI-only, safe to expose at membrane.
// ============================================================================
import * as PulseUIFlow from "../PULSE-UI/PulseUIFlow-v12-EVO.js";



// ============================================================================
//  SURFACE ENVIRONMENT SNAPSHOT (USER + DEVICE CONTEXT, READ‑ONLY)
// ============================================================================
function buildSurfaceEnvironment() {
  if (typeof window === "undefined") {
    return Object.freeze({
      runtime: "node-like",
      userAgent: null,
      language: null,
      platform: null,
      online: null,
      screen: null,
      device: null,
      input: null,
      preferences: null,
      location: null,
      network: null,
      referrer: null,
      origin: null
    });
  }

  const nav = window.navigator || {};
  const scr = window.screen || {};

  const device = {
    hardwareConcurrency:
      typeof nav.hardwareConcurrency === "number"
        ? nav.hardwareConcurrency
        : null,
    maxTouchPoints:
      typeof nav.maxTouchPoints === "number" ? nav.maxTouchPoints : null
  };

  const screen = {
    width: typeof scr.width === "number" ? scr.width : null,
    height: typeof scr.height === "number" ? scr.height : null,
    availWidth: typeof scr.availWidth === "number" ? scr.availWidth : null,
    availHeight: typeof scr.availHeight === "number" ? scr.availHeight : null,
    colorDepth: typeof scr.colorDepth === "number" ? scr.colorDepth : null,
    pixelRatio:
      typeof window.devicePixelRatio === "number"
        ? window.devicePixelRatio
        : null
  };

  const input = {
    touchCapable:
      typeof nav.maxTouchPoints === "number" && nav.maxTouchPoints > 0
        ? true
        : false
  };

  let prefersReducedMotion = null;
  let prefersDarkMode = null;
  if (typeof window.matchMedia === "function") {
    try {
      prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
    } catch {
      prefersReducedMotion = null;
    }
    try {
      prefersDarkMode = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
    } catch {
      prefersDarkMode = null;
    }
  }

  const preferences = {
    prefersReducedMotion,
    prefersDarkMode
  };

  const location = {
    href: window.location?.href || null,
    pathname: window.location?.pathname || null,
    search: window.location?.search || null
  };

  const referrer = document?.referrer || null;
  const origin = window.location?.origin || null;

  const network = {
    online: typeof nav.onLine === "boolean" ? nav.onLine : null
  };

  return Object.freeze({
    runtime: "browser",
    userAgent: nav.userAgent || null,
    language: nav.language || null,
    platform: nav.platform || null,
    online: nav.onLine ?? null,
    screen,
    device,
    input,
    preferences,
    location,
    network,
    referrer,
    origin
  });
}

const PulseSurfaceEnvironment = buildSurfaceEnvironment();

if (typeof window !== "undefined") {
  const surfaceMeta = Object.freeze({
    layer: "PulseEvolutionaryWindow",
    role: "surface-membrane",
    version: "12.0-EVO-BINARY-MAX",
    evo: {
      browserOnly: true,
      membraneOnly: true,
      binaryFirst: true,
      viewOnly: true,
      noOrgans: true,
      noRouting: true,
      noIdentity: true
    },
    environment: PulseSurfaceEnvironment
  });

  window.PulseSurface = window.PulseSurface
    ? Object.freeze({ ...window.PulseSurface, ...surfaceMeta })
    : surfaceMeta;
}


// ============================================================================
//  SURFACE MEMBRANE INITIALIZATION
// ============================================================================
PulseVitals.start();
PulseLogger.init();

// ============================================================================
//  ERROR SPINE INITIALIZATION (membrane-level, safe)
// ============================================================================
try {
  PulseUIErrors.init?.();
} catch (err) {
  console.error("[PulseEvolutionaryWindow] Error spine failed to initialize:", err);
}

if (typeof window !== "undefined" && window.PulseSkinReflex?.membraneAlive) {
  window.PulseSkinReflex.membraneAlive("Window");
}


// ============================================================================
//  BINARY ORGANISM + UI FLOW + PULSEBAND BOOTSTRAP (BEHIND THE GLASS)
//  - Single boot IIFE: binary kernel + UI flow context + transport nerve.
// ============================================================================
if (typeof window !== "undefined") {
  (async () => {
    try {
      let binaryKernel = null;

      // -------------------------------------------------------------------
      // BINARY ORGANISM BOOT
      // -------------------------------------------------------------------
      if (!window.__PulseBinaryBooted) {
        binaryKernel =
          typeof PulseBinaryOrganismBoot?.boot === "function"
            ? await PulseBinaryOrganismBoot.boot({ trace: false })
            : null;

        if (binaryKernel) {
          window.__PulseBinaryBooted = true;

          const safeBinaryView = {
            meta: PulseBinaryOrganismBoot?.layer
              ? {
                  layer: PulseBinaryOrganismBoot.layer,
                  role: PulseBinaryOrganismBoot.role,
                  version: PulseBinaryOrganismBoot.version,
                  lineage: PulseBinaryOrganismBoot.lineage,
                  evo: PulseBinaryOrganismBoot.evo,
                  projection: "read-only-binary-shadow"
                }
              : null,

            Vitals: {
              generate: () =>
                binaryKernel?.vitals?.generateVitals
                  ? binaryKernel.vitals.generateVitals()
                  : null
            },

            Consciousness: {
              latest: () =>
                binaryKernel?.consciousness?.generateConsciousnessPacket
                  ? binaryKernel.consciousness.generateConsciousnessPacket()
                  : null
            },

            Sentience: {
              snapshot:
                typeof binaryKernel?.sentience?.snapshot === "function"
                  ? () => binaryKernel.sentience.snapshot()
                  : () => null
            }
          };

          const frozenBinaryView = Object.freeze(safeBinaryView);

          window.PulseBinary = window.PulseBinary
            ? Object.freeze({ ...window.PulseBinary, ...frozenBinaryView })
            : frozenBinaryView;
        }
      }

      // -------------------------------------------------------------------
      // UI FLOW BOOT — UI-only, safe at membrane
      // -------------------------------------------------------------------
      try {
        const flowContext = await PulseUIFlow.initUIFlow();
        window.PulseUI = window.PulseUI
          ? Object.freeze({ ...window.PulseUI, Flow: PulseUIFlow, context: flowContext })
          : Object.freeze({ Flow: PulseUIFlow, context: flowContext });
      } catch (flowErr) {
        console.error("[PulseEvolutionaryWindow] UIFlow boot failed:", flowErr);
      }

      // -------------------------------------------------------------------
      // PULSEBAND BOOT — v12-EVO transport nerve (membrane-level, global)
      // -------------------------------------------------------------------
      try {
        // Your PNS file already created this:
        // window.pulseband   ← THIS IS THE REAL PULSEBAND
        if (window.pulseband && !window.PulseBand) {

          // Expose globally under the correct name
          window.PulseBand = window.pulseband;

          // Bridge PulseBand → Proxy Spine
          window.PulseBand.on("request", async (packet) => {
            let url, method, bodyOrQuery;

            switch (packet.type) {
              case "start":
                url = "/PULSE-PROXY/pulseband/session";
                method = "POST";
                bodyOrQuery = packet;
                break;

              case "next":
                url = "/PULSE-PROXY/pulseband/next";
                method = "GET";
                bodyOrQuery = {
                  sessionId: packet.sessionId,
                  userId: packet.userId
                };
                break;

              case "ack":
                url = "/PULSE-PROXY/pulseband/ack";
                method = "POST";
                bodyOrQuery = packet;
                break;

              case "redownload":
                url = "/PULSE-PROXY/pulseband/redownload";
                method = "POST";
                bodyOrQuery = packet;
                break;

              default:
                return;
            }

            const isGet = method === "GET";

            const query = isGet
              ? "?" + new URLSearchParams(bodyOrQuery).toString()
              : "";

            const opts = isGet
              ? { method: "GET" }
              : {
                  method: "POST",
                  headers: { "content-type": "application/json" },
                  body: JSON.stringify(bodyOrQuery)
                };

            const res = await fetch(url + query, opts);
            const data = await res.json();

            // Send response back into PulseBand
            window.PulseBand.emit("response:" + packet.sessionId, data);
          });

          // Optional helper
          window.PulseBandStart = (opts) => window.PulseBand.start(opts);
        }
      } catch (err) {
        console.error("[PulseEvolutionaryWindow] PulseBand boot failed:", err);
      }

    } catch (err) {
      console.error(
        "[PulseEvolutionaryWindow] Binary organism boot failed:",
        err
      );
    }
  })();
}


// ============================================================================
//  EXPORT — WINDOW ONLY EXPOSES MEMBRANE + UNDERSTANDING + SURFACE ENV + FLOW
// ============================================================================
export default Object.freeze({
  Vitals: PulseVitals,
  Logger: PulseLogger,
  Understanding: PulseUnderstanding,
  SurfaceEnvironment: PulseSurfaceEnvironment,
  UIFlow: PulseUIFlow,
  Errors: PulseUIErrors
});
