// ============================================================================
// FILE: /apps/PulseOS/Surface/PulseEvolutionaryWindow.js
// PULSE EVOLUTIONARY WINDOW — v12‑EVO‑BINARY‑MAX
// PORTAL‑MEMBRANE • ONE‑WAY GLASS • ZERO‑TRUST SURFACE • NO ORGANS BEYOND GLASS
// BINARY‑FIRST BOOT • SHADOW‑ONLY PROJECTION • PREWARMED • PRECHUNKED • ZERO‑LATENCY SURFACE
// ============================================================================
//
// METAPHOR (PORTAL, NOT UI):
// --------------------------
//  - This is the WINDOW of the organism — the reinforced glass of the body.
//  - Outsiders can SEE the glow of the organism (vitals, logs, understanding,
//    binary shadow), but can NEVER TOUCH the real organs.
//  - The organism lives BEHIND the glass; the window is a pure membrane.
//  - This is a PORTAL‑MEMBRANE: one‑way glass into a living system, not a UI layer.
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
// NO MIDDLEMEN / PORTAL CONTRACT:
// -------------------------------
//  - No frontend “organs” here.
//  - No frontend routing.
//  - No frontend identity.
//  - No frontend evolution.
//  - No timers, no intervals, no async nervous system (only one boot IIFE).
//  - Only: ProofMonitor, ProofLogger, Understanding, BinaryBoot, SurfaceEnv.
//  - Plus membrane‑safe transport nerves like PulseBand and PulseChunks.
//  - This is a ZERO‑TRUST SURFACE over a FULL‑TRUST ORGANISM behind glass.
// ============================================================================


// ============================================================================
//  SURFACE REFLEXES (ALWAYS SAFE, ALWAYS PRESENT)
//  - These are NOT organs; they are membrane‑level sensors.
// ============================================================================
import * as PulseVitals from "./PULSEProofMonitor.js";
import * as PulseLogger from "./PULSEProofLogger.js";

// FRONTEND CHUNK MEMBRANE — 2026 transport layer
import * as PulseChunks from "./PulseChunks-v1.js";

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
import PulseBinaryOrganismBoot from "./PULSE-AI/ai-v11-Evo.js";

// ============================================================================
//  UNIVERSAL ERROR SPINE (PulseUIErrors-v12-EVO)
//  - Safe, membrane-level, never throws, never breaks.
// ============================================================================
import * as PulseUIErrors from "./PULSE-UI/PulseUIErrors-v12-EVO.js";

// ============================================================================
//  UI FLOW ENGINE (PulseUIFlow-v12-EVO)
//  - UI flow coordinator, UI-only, safe to expose at membrane.
// ============================================================================
import * as PulseUIFlow from "./PULSE-UI/PulseUIFlow-v12-EVO.js";


// ============================================================================
//  SURFACE ENVIRONMENT SNAPSHOT (USER + DEVICE CONTEXT, READ‑ONLY)
//  - Outside‑world snapshot: the organism SEES the world through this window.
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
  // -------------------------------------------------------------------------
  // 2026-LEVEL MEMBRANE: CHUNKED, CACHED, PREWARMED VISIBLE LAYER
  //  - This is the PORTAL SURFACE: everything visible is prechunked + cached.
  //  - Attach frontend chunker to window.
  //  - Provide fetchImage() for chunked image retrieval.
  //  - Provide fetchChunk() + prewarm() for generic assets.
  //  - Override <img>.src to route through chunker.
  //  - Optionally intercept image fetches.
  // -------------------------------------------------------------------------
  try {
    // Expose PulseChunks module at membrane (if not already)
    window.PulseChunks = window.PulseChunks || PulseChunks;

    // Universal chunked image fetcher
    window.fetchImage = window.fetchImage || (async function (url) {
      if (!url) return url;
      try {
        if (window.PulseChunks?.getImage) {
          return await window.PulseChunks.getImage(url);
        }
      } catch (err) {
        console.error("[PulseEvolutionaryWindow] fetchImage chunk error:", err);
      }
      return url;
    });

    // Generic chunk fetcher (CSS, JS, JSON, etc.)
    window.fetchChunk = window.fetchChunk || (async function (url) {
      if (!url) return null;
      try {
        if (window.PulseChunks?.fetchChunk) {
          return await window.PulseChunks.fetchChunk(url);
        }
      } catch (err) {
        console.error("[PulseEvolutionaryWindow] fetchChunk error:", err);
      }
      return null;
    });

    // Prewarm helper — can be used by any surface script
    window.prewarmAssets = window.prewarmAssets || function (urls = []) {
      try {
        if (window.PulseChunks?.prewarm) {
          window.PulseChunks.prewarm(urls);
        }
      } catch (err) {
        console.error("[PulseEvolutionaryWindow] prewarmAssets error:", err);
      }
    };

    // Global <img> src override — membrane-level, no organs
    const desc = Object.getOwnPropertyDescriptor(Image.prototype, "src");
    if (desc && typeof desc.set === "function") {
      const originalSet = desc.set;
      Object.defineProperty(Image.prototype, "src", {
        configurable: true,
        enumerable: desc.enumerable,
        get: desc.get,
        set(url) {
          if (!url || !window.fetchImage) {
            return originalSet.call(this, url);
          }
          window.fetchImage(url)
            .then((blobUrl) => originalSet.call(this, blobUrl || url))
            .catch(() => originalSet.call(this, url));
        }
      });
    }

    // Optional: intercept fetch() for direct image requests (CSS, etc.)
    const originalFetch = window.fetch?.bind(window);
    if (originalFetch && !window.__PulseFetchPatched) {
      window.__PulseFetchPatched = true;
      window.fetch = async function (resource, options) {
        try {
          const url =
            typeof resource === "string" ? resource : resource?.url || null;

          const isImage =
            typeof url === "string" &&
            url.match(/\.(png|jpe?g|webp|gif|avif|svg)$/i);

          if (isImage && window.fetchImage) {
            const blobUrl = await window.fetchImage(url);
            return originalFetch(blobUrl, options);
          }
        } catch (err) {
          console.error("[PulseEvolutionaryWindow] fetch image patch error:", err);
        }
        return originalFetch(resource, options);
      };
    }

    // Prewarm visible images on first paint (zero-latency repeat)
    window.addEventListener("load", () => {
      try {
        const urls = Array.from(document.querySelectorAll("img"))
          .map((img) => img.getAttribute("src"))
          .filter(Boolean);
        if (urls.length && window.prewarmAssets) {
          window.prewarmAssets(urls);
        }
      } catch (err) {
        console.error("[PulseEvolutionaryWindow] image prewarm failed:", err);
      }
    });
  } catch (err) {
    console.error("[PulseEvolutionaryWindow] Membrane chunk layer failed:", err);
  }

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
//  - Proof that the membrane is alive and sensing, not “rendering a page.”
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
//  - The organism boots BEHIND the glass; this file only exposes a SHADOW.
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
        if (window.pulseband && !window.PulseBand) {
          window.PulseBand = window.pulseband;

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

            window.PulseBand.emit("response:" + packet.sessionId, data);
          });

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
//  - This is the PORTAL API: vitals, logs, understanding, environment, UI flow.
//  - No organs, no routes, no identity — only the glow of the organism.
// ============================================================================
export default Object.freeze({
  Vitals: PulseVitals,
  Logger: PulseLogger,
  Understanding: PulseUnderstanding,
  SurfaceEnvironment: PulseSurfaceEnvironment,
  UIFlow: PulseUIFlow,
  Errors: PulseUIErrors
});
