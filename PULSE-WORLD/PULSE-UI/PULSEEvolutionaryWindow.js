// ============================================================================
// FILE: /PulseOS/Surface/PulseEvolutionaryWindow-v13.js
// PULSE EVOLUTIONARY WINDOW — v13-EVO-ALWAYS-ON-OFFLINE-FIRST
// PORTAL-MEMBRANE • ONE-WAY GLASS • ZERO-TRUST SURFACE • NO ORGANS BEYOND GLASS
// ============================================================================
console.log("Window");
import PulseUIErrors from "./PulseUIErrors-v12-EVO.js";
import { VitalsMonitor as PulseVitalsMonitor } from "./PulseProofMonitor.js";
import { VitalsLogger as PulseLogger }        from "./PulseProofLogger.js";
import { PageScannerV12 as PULSEOSSkinReflex } from "./PULSEOSSkinReflex.js";
import PulseChunks from "./PulsePresence-v1.7-Evo.js";
import PulseUnderstanding from "./PulseUnderstanding.js";
import { createDualBandOrganism as PulseBinaryOrganismBoot } from "../PULSE-BAND/PULSE-AI/aiDualBand-v11-Evo.js";

import { initUIFlow as PulseUIFlow } from "./PulseUIFlow-v12-EVO.js";

const g =
  typeof global !== "undefined"
    ? global
    : typeof globalThis !== "undefined"
    ? globalThis
    : typeof window !== "undefined"
    ? window
    : {};

function isBrowser() {
  return (
    typeof window !== "undefined" &&
    typeof document !== "undefined" &&
    typeof navigator !== "undefined" &&
    window === window.window &&            // must be a real Window
    document.nodeType === 9 &&             // must be a real DOM Document
    typeof window.requestAnimationFrame === "function" && // browser-only API
    !window.process &&                     // blocks Node-injected globals
    !navigator.userAgent.includes("Node")  // blocks Node UA spoofing
  );
}


// ============================================================================
// SURFACE ENVIRONMENT SNAPSHOT
// ============================================================================
function buildSurfaceEnvironment() {
  if (!isBrowser()) {
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
      prefersReducedMotion = window
        .matchMedia("(prefers-reduced-motion: reduce)")
        .matches;
    } catch {
      prefersReducedMotion = null;
    }
    try {
      prefersDarkMode = window
        .matchMedia("(prefers-color-scheme: dark)")
        .matches;
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

// ============================================================================
// MEMBRANE META
// ============================================================================
function buildRouteId() {
  if (!isBrowser()) return "unknown-route";
  try {
    return window.location?.pathname || "unknown-route";
  } catch {
    return "unknown-route";
  }
}

const surfaceMeta = Object.freeze({
  layer: "PulseEvolutionaryWindow",
  role: "surface-membrane",
  version: "13.0-EVO-ALWAYS-ON-OFFLINE-FIRST",
  evo: {
    browserOnly: true,
    membraneOnly: true,
    binaryFirst: true,
    viewOnly: true,
    noOrgans: true,
    noRouting: true,
    noIdentity: true
  },
  environment: PulseSurfaceEnvironment,
  contract: {
    never: [
      "expose organs",
      "expose identity",
      "expose CNS",
      "expose routing",
      "expose permissions"
    ],
    always: [
      "project only shadows",
      "stay deterministic",
      "stay membrane-only",
      "stay binary-first"
    ]
  }
});

const pulseLoreContext = Object.freeze({
  lineage: "PulseOS.Surface.Portal.Window.v13"
});

const pulseRole = Object.freeze({
  identity: "PulseEvolutionaryWindow-Portal",
  type: "membrane",
  subsystem: "surface",
  layer: "window",
  version: "13.0-EVO-ALWAYS-ON-OFFLINE-FIRST",
  contract: {
    purpose:
      "Provide a one-way glass into the organism: vitals, logs, understanding, binary shadow, and route-level lore."
  },
  voice: {
    tone: "calm, precise, descriptive",
    style: "mythic-technical hybrid"
  }
});

const baseMetaPack = {
  meta: surfaceMeta,
  context: pulseLoreContext,
  pulseRole,
  route: buildRouteId()
};

// ============================================================================
// MEMBRANE BOOT (BROWSER ONLY)
// ============================================================================
if (isBrowser()) {
  try {
    // Expose PulseChunks
    window.PulseChunks = window.PulseChunks || PulseChunks;

    // fetchImage
    window.fetchImage =
      window.fetchImage ||
      (async function (url) {
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

    // fetchChunk
    window.fetchChunk =
      window.fetchChunk ||
      (async function (url) {
        if (!url) return null;

        try {
          if (window.PulseChunks?.PulseChunker) {
            const metaPack = {
              ...baseMetaPack,
              route: buildRouteId()
            };
            const result = await window.PulseChunks.PulseChunker(url, 0, metaPack);
            if (result && typeof result.chunk !== "undefined") {
              return result.chunk;
            }
          }

          if (window.PulseChunks?.fetchChunk) {
            return await window.PulseChunks.fetchChunk(url);
          }
        } catch (err) {
          console.error("[PulseEvolutionaryWindow] fetchChunk error:", err);
        }
        return null;
      });

    // prewarmAssets
    window.prewarmAssets =
      window.prewarmAssets ||
      function (urls = []) {
        try {
          if (window.PulseChunks?.prewarm) {
            window.PulseChunks.prewarm(urls);
          }
        } catch (err) {
          console.error("[PulseEvolutionaryWindow] prewarmAssets error:", err);
        }
      };

    // PulseRouteCarpet
    window.PulseRouteCarpet =
      window.PulseRouteCarpet ||
      {
        unfold(routeDescriptor) {
          try {
            const routeId = routeDescriptor?.route || buildRouteId();
            const urls = [
              ...(routeDescriptor?.imports || []),
              ...(routeDescriptor?.assets || [])
            ];
            if (urls.length && window.prewarmAssets) {
              window.prewarmAssets(urls);
            }
            return { route: routeId, prewarmed: urls.length };
          } catch (err) {
            console.error(
              "[PulseEvolutionaryWindow] PulseRouteCarpet.unfold error:",
              err
            );
            return { route: buildRouteId(), prewarmed: 0 };
          }
        }
      };

    // <img>.src override
    try {
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
            window
              .fetchImage(url)
              .then((blobUrl) => originalSet.call(this, blobUrl || url))
              .catch(() => originalSet.call(this, url));
          }
        });
      }
    } catch (err) {
      console.error("[PulseEvolutionaryWindow] Image src patch failed:", err);
    }

    // FETCH PATCH — guarded, never blocks
    try {
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

            // Route through logger's route if available
            const hasLoggerRoute =
              PulseLogger && typeof PulseLogger.route === "function";

            if (hasLoggerRoute && typeof url === "string") {
              const result = await PulseLogger.route("fetchProxy", {
                url,
                options
              });

              if (result && result.__fetched) {
                const blob = new Blob([result.body], {
                  type: result.contentType
                });
                const response = new Response(blob, {
                  status: result.status,
                  headers: result.headers
                });
                return response;
              }
            }
          } catch (err) {
            console.error("[PulseFetchPatch] error:", err);
          }

          return originalFetch(resource, options);
        };
      }
    } catch (err) {
      console.error("[PulseEvolutionaryWindow] fetch patch failed:", err);
    }

    // Prewarm visible assets
    window.addEventListener("load", () => {
      try {
        const imgUrls = Array.from(document.querySelectorAll("img"))
          .map((img) => img.getAttribute("src"))
          .filter(Boolean);

        const cssUrls = Array.from(
          document.querySelectorAll('link[rel="stylesheet"][href]')
        )
          .map((link) => link.getAttribute("href"))
          .filter(Boolean);

        const jsUrls = Array.from(
          document.querySelectorAll("script[src]")
        )
          .map((script) => script.getAttribute("src"))
          .filter(Boolean);

        const allUrls = [...imgUrls, ...cssUrls, ...jsUrls];

        if (allUrls.length && window.prewarmAssets) {
          window.prewarmAssets(allUrls);
        }
      } catch (err) {
        console.error("[PulseEvolutionaryWindow] asset prewarm failed:", err);
      }
    });

    // Surface meta
    window.PulseSurface = window.PulseSurface
      ? Object.freeze({ ...window.PulseSurface, ...surfaceMeta })
      : surfaceMeta;
  } catch (err) {
    console.error("[PulseEvolutionaryWindow] Membrane chunk layer failed:", err);
  }
}

// ============================================================================
// SURFACE MEMBRANE INITIALIZATION — LOGGER + MONITOR + ERRORS
// ============================================================================
try {
  // Always-on vitals monitor (backend optional)
  if (PulseVitalsMonitor && typeof PulseVitalsMonitor.PulseRole === "object") {
    // no explicit start needed; updateUserMetrics is called by organs
  }

  // Logger init (AI console, telemetry, console hijack already done in logger file)
  if (PulseLogger && typeof PulseLogger.meta === "object") {
    // no explicit init required; logger file already hijacks console
  }
} catch (err) {
  console.error("[PulseEvolutionaryWindow] Vitals/Logger init failed:", err);
}

try {
  PulseUIErrors.init?.();
} catch (err) {
  console.error(
    "[PulseEvolutionaryWindow] Error spine failed to initialize:",
    err
  );
}

if (isBrowser() && window.PulseSkinReflex?.membraneAlive) {
  try {
    window.PulseSkinReflex.membraneAlive("Window");
  } catch (err) {
    console.error(
      "[PulseEvolutionaryWindow] SkinReflex membraneAlive failed:",
      err
    );
  }
}

// ============================================================================
// BINARY ORGANISM + UI FLOW + PULSEBAND BOOTSTRAP
// ============================================================================
if (isBrowser()) {
  (async () => {
    try {
      let binaryKernel = null;

      // BINARY ORGANISM BOOT
      try {
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
      } catch (err) {
        console.error(
          "[PulseEvolutionaryWindow] Binary organism boot failed:",
          err
        );
      }

      // UI FLOW BOOT
      try {
        const flowContext = await PulseUIFlow.initUIFlow();
        window.PulseUI = window.PulseUI
          ? Object.freeze({
              ...window.PulseUI,
              Flow: PulseUIFlow,
              context: flowContext
            })
          : Object.freeze({ Flow: PulseUIFlow, context: flowContext });
      } catch (flowErr) {
        console.error("[PulseEvolutionaryWindow] UIFlow boot failed:", flowErr);
      }

      // PULSEBAND BOOT
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

            let data = null;

            try {
              const hasLoggerRoute =
                PulseLogger && typeof PulseLogger.route === "function";

              if (hasLoggerRoute) {
                data = await PulseLogger.route("fetchProxy", {
                  url: url + query,
                  method,
                  body: bodyOrQuery,
                  layer: "A1",
                  reflexOrigin: "PulseBand",
                  binaryAware: true,
                  dualBand: true,
                  presenceAware: true
                });
              } else {
                const res = await fetch(url + query, opts);
                data = await res.json().catch(() => null);
              }
            } catch (err) {
              console.error("[PulseEvolutionaryWindow] PulseBand request failed:", err);
            }

            try {
              if (window.PulseBand && data) {
                window.PulseBand.emit("response:" + packet.sessionId, data);
              }
            } catch (err) {
              console.error(
                "[PulseEvolutionaryWindow] PulseBand emit failed:",
                err
              );
            }
          });

          window.PulseBandStart = (opts) => window.PulseBand.start(opts);
        }
      } catch (err) {
        console.error("[PulseEvolutionaryWindow] PulseBand boot failed:", err);
      }

      // CHUNK SESSION START
      try {
        if (window.PulseBandStart) {
          window.PulseBandStart({
            type: "chunk-session",
            surface: "PulseEvolutionaryWindow",
            environment: PulseSurfaceEnvironment,
            version: "13.0-EVO-ALWAYS-ON-OFFLINE-FIRST"
          });
        }
      } catch (err) {
        console.error(
          "[PulseEvolutionaryWindow] Chunk session start failed:",
          err
        );
      }
    } catch (err) {
      console.error(
        "[PulseEvolutionaryWindow] Binary organism + UI boot failed:",
        err
      );
    }
  })();
}

// ============================================================================
// EXPORT — PORTAL API
// ============================================================================
export default Object.freeze({
  VitalsMonitor: PulseVitalsMonitor,
  Logger: PulseLogger,
  Understanding: PulseUnderstanding,
  SurfaceEnvironment: PulseSurfaceEnvironment,
  UIFlow: PulseUIFlow,
  Errors: PulseUIErrors,
  meta: {
    pulseRole,
    surfaceMeta,
    context: pulseLoreContext
  }
});
