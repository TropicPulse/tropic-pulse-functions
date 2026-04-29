/* global log */
// PULSE OS v12‑EVO — PAGE SCANNER INTELLIGENCE LAYER (A1/A2 HYBRID)
// “DRIFT ENGINE • LINEAGE ENGINE • STRUCTURAL ENGINE • MODULE ENGINE”
// This layer adds:
//   • Naming Drift Detection
//   • Lineage Drift Detection
//   • Module‑Mode Drift Detection (ESM/CJS)
//   • Export/Import Drift Detection
//   • Structural Drift Detection (shape mismatches)
//   • Contract Drift Detection (param/return mismatches)
//   • Path Drift Detection (file moves)
//   • Drift Intelligence Packets (for PageScannerAdapter)
//   • ZERO mutation of A1 reflex payloads
//   • ZERO interference with A1 timing/state rules
// ============================================================================
import * as PulseUIErrors from "./PULSE-UI/PulseUIErrors-v12-EVO.js";
import { PulseOrganismMap } from "./PULSE-OS/PulseOrganismMap.js";

const PageScannerV12 = Object.freeze({

  // ---------------------------------------------------------
  // Extract variable names from JS source
  // ---------------------------------------------------------
  extractVars(source = "") {
    try {
      return [...source.matchAll(/(?:const|let|var)\s+([A-Za-z0-9_]+)/g)]
        .map((m) => m[1]);
    } catch (err) {
      try {
        PulseUIErrors.broadcast(
          PulseUIErrors.normalize(err, "pagescanner.extractVars")
        );
      } catch {}
      return [];
    }
  },

  // ---------------------------------------------------------
  // Normalize names (strip suffixes, digits, casing)
  // ---------------------------------------------------------
  normalize(name = "") {
    try {
      return name
        .replace(/[\d_]+$/, "")              // remove trailing digits/underscores
        .replace(/(Field|State|Mode)$/i, "") // remove common suffixes
        .toLowerCase();
    } catch (err) {
      try {
        PulseUIErrors.broadcast(
          PulseUIErrors.normalize(err, "pagescanner.normalize")
        );
      } catch {}
      return "";
    }
  },

  // ---------------------------------------------------------
  // Detect lineage drift between two sets of variables
  // ---------------------------------------------------------
  detectLineage(varsA = [], varsB = []) {
    try {
      const splits = [];

      for (const a of varsA) {
        const normA = this.normalize(a);

        for (const b of varsB) {
          const normB = this.normalize(b);

          if (normA === normB && a !== b) {
            splits.push({ canonical: a, drifted: b });
          }
        }
      }

      return splits;
    } catch (err) {
      try {
        PulseUIErrors.broadcast(
          PulseUIErrors.normalize(err, "pagescanner.detectLineage")
        );
      } catch {}
      return [];
    }
  },

  // ---------------------------------------------------------
  // Detect module mode drift (ESM vs CJS)
  // ---------------------------------------------------------
  detectModuleMode(source = "") {
    try {
      const esm = /import\s+.*from\s+['"]/.test(source);
      const cjs = /require\s*\(/.test(source);

      return Object.freeze({
        esm,
        cjs,
        mixed: esm && cjs
      });
    } catch (err) {
      try {
        PulseUIErrors.broadcast(
          PulseUIErrors.normalize(err, "pagescanner.detectModuleMode")
        );
      } catch {}
      return Object.freeze({ esm: false, cjs: false, mixed: false });
    }
  },

  // ---------------------------------------------------------
  // Detect missing exports (ESM/CJS)
  // ---------------------------------------------------------
  detectExportDrift(source = "", vars = []) {
    try {
      const hasESM = /export\s+/.test(source);
      const hasCJS = /module\.exports/.test(source);

      return Object.freeze({
        missingESM: !hasESM,
        missingCJS: !hasCJS,
        vars
      });
    } catch (err) {
      try {
        PulseUIErrors.broadcast(
          PulseUIErrors.normalize(err, "pagescanner.detectExportDrift")
        );
      } catch {}
      return Object.freeze({
        missingESM: false,
        missingCJS: false,
        vars
      });
    }
  },

  // ---------------------------------------------------------
  // Detect structural drift (shape + field mismatches) — UPGRADE 1/4
  // ---------------------------------------------------------
  detectStructural(sourceA = "", sourceB = "") {
    try {
      const extractShape = (src) => {
        const matches = [...src.matchAll(/return\s+{([^}]+)}/gs)];
        return matches.map((m) => {
          return m[1]
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
            .map((field) => {
              const [key] = field.split(":").map((x) => x.trim());
              return key;
            });
        });
      };

      const shapeA = extractShape(sourceA);
      const shapeB = extractShape(sourceB);

      const flatA = shapeA.flat();
      const flatB = shapeB.flat();

      const missingInB = flatA.filter((f) => !flatB.includes(f));
      const missingInA = flatB.filter((f) => !flatA.includes(f));

      const substructureMismatch =
        JSON.stringify(shapeA) !== JSON.stringify(shapeB);

      const severity =
        missingInA.length +
        missingInB.length +
        Math.abs(flatA.length - flatB.length) +
        (substructureMismatch ? 1 : 0);

      return Object.freeze({
        shapeA,
        shapeB,
        missingInA,
        missingInB,
        substructureMismatch,
        severity,
        mismatch: severity > 0
      });
    } catch (err) {
      try {
        PulseUIErrors.broadcast(
          PulseUIErrors.normalize(err, "pagescanner.detectStructural")
        );
      } catch {}
      return Object.freeze({
        shapeA: [],
        shapeB: [],
        missingInA: [],
        missingInB: [],
        substructureMismatch: false,
        severity: 0,
        mismatch: false
      });
    }
  },

  // ---------------------------------------------------------
  // Detect contract drift (function signature mismatches)
  // ---------------------------------------------------------
  detectContract(sourceA = "", sourceB = "") {
    try {
      const sigA = [...sourceA.matchAll(/function\s+([A-Za-z0-9_]+)\(([^)]*)\)/g)]
        .map((m) => ({
          name: m[1],
          params: m[2].split(",").map((s) => s.trim()).filter(Boolean)
        }));

      const sigB = [...sourceB.matchAll(/function\s+([A-Za-z0-9_]+)\(([^)]*)\)/g)]
        .map((m) => ({
          name: m[1],
          params: m[2].split(",").map((s) => s.trim()).filter(Boolean)
        }));

      return Object.freeze({
        sigA,
        sigB,
        mismatch: JSON.stringify(sigA) !== JSON.stringify(sigB)
      });
    } catch (err) {
      try {
        PulseUIErrors.broadcast(
          PulseUIErrors.normalize(err, "pagescanner.detectContract")
        );
      } catch {}
      return Object.freeze({
        sigA: [],
        sigB: [],
        mismatch: false
      });
    }
  },

  // ---------------------------------------------------------
  // Detect path drift (file moved or renamed)
  // ---------------------------------------------------------
  detectPathDrift(importLine = "") {
    try {
      const match = importLine.match(/from\s+['"](.+?)['"]/);
      if (!match) return null;

      const path = match[1];
      const exists = false; // cannot check filesystem in browser

      return Object.freeze({
        path,
        exists,
        drift: !exists
      });
    } catch (err) {
      try {
        PulseUIErrors.broadcast(
          PulseUIErrors.normalize(err, "pagescanner.detectPathDrift")
        );
      } catch {}
      return null;
    }
  },

  // ---------------------------------------------------------
  // Build drift intelligence packet (adapter-ready) — UPGRADE 2/4
  // ---------------------------------------------------------
  buildDriftPacket(context = {}) {
    try {
      const structural = context.structural || {};
      const severity = typeof structural.severity === "number"
        ? structural.severity
        : 0;

      const tooFar = severity >= 3; // threshold: "off by too much"

      return Object.freeze({
        type: "pagescanner-drift-intel",
        timestamp: Date.now(),
        severity,
        tooFar,
        structural: {
          shapeA: structural.shapeA || [],
          shapeB: structural.shapeB || [],
          missingInA: structural.missingInA || [],
          missingInB: structural.missingInB || [],
          substructureMismatch: !!structural.substructureMismatch
        },
        ...context
      });
    } catch (err) {
      try {
        PulseUIErrors.broadcast(
          PulseUIErrors.normalize(err, "pagescanner.buildDriftPacket")
        );
      } catch {}
      return Object.freeze({
        type: "pagescanner-drift-intel",
        timestamp: Date.now(),
        error: true
      });
    }
  }

});


// ============================================================================
// ORGAN ROLE EXPORT — v12‑EVO‑BINARY‑MAX
// ============================================================================
export const PulseRole = {
  type: "Skin",
  subsystem: "PulseOSSkinReflex",
  layer: "A1-SurfaceReflex",
  version: "12.0",
  identity: "PulseOSSkinReflex-v12-EVO-BINARY-MAX",

  evo: {
    driftProof: true,
    deterministicReflex: true,
    zeroState: true,
    zeroTiming: true,
    surfaceOnly: true,
    classificationFirst: true,
    healingTriggerOnly: true,
    binaryAware: true,
    dualBand: true,
    futureEvolutionReady: true
  },

  reflex: {
    pageLevel: true,
    errorIntake: true,
    routeSampler: true,
    degradationAnnotator: true,
    binaryShadowTagger: true
  },

  pulseContract: "Pulse-v1/v2/v3",
  meshContract: "PulseMesh-v11-ready",
  sendContract: "PulseSend-v11-ready"
};


// ============================================================================
// OWNER MODULE RESOLUTION — v12‑EVO (Brain-map aware, no mutation)
// ============================================================================
const hasWindow = typeof window !== "undefined";

function getOrganismMapSafe() {
  return PulseOrganismMap ?? null;
}


function resolveOwnerModule(symbol) {
  try {
    if (typeof symbol !== "string") return null;

    const organism = getOrganismMapSafe();
    if (!organism || !organism.organs) return null;

    const organ = organism.organs[symbol];
    return organ ? organ.system : null;
  } catch {
    return null;
  }
}

if (typeof console !== "undefined" && typeof console.log === "function") {
  console.log(
    "%c[PulseOSSkinReflex v12‑EVO‑BINARY‑MAX] Loaded — A1/A2 Universal Membrane Active",
    "color:#4CAF50; font-weight:bold;"
  );
}


// ============================================================================
// LAYER CONSTANTS + DIAGNOSTICS
// ============================================================================
const LAYER_ID   = "SKIN-REFLEX";
const LAYER_NAME = "THE SKIN REFLEX";
const LAYER_ROLE = "UNIVERSAL ERROR GUARDIAN & HEALING TRIGGER";
const LAYER_VER  = "12.0";

const PROTECTOR_DIAGNOSTICS_ENABLED =
  hasWindow &&
  (window.PULSE_PROTECTOR_DIAGNOSTICS === "true" ||
   window.PULSE_DIAGNOSTICS === "true");

// NOTE: log() is provided by ProofLogger / global console redirect on frontend.
const logProtector = (stage, details = {}) => {
  if (!PROTECTOR_DIAGNOSTICS_ENABLED) return;
  if (typeof log !== "function") return;

  log(
    JSON.stringify({
      pulseLayer: LAYER_ID,
      pulseName:  LAYER_NAME,
      pulseRole:  LAYER_ROLE,
      pulseVer:   LAYER_VER,
      stage,
      ...details
    })
  );
};


// ============================================================================
// SENSE REPORT — richer local diagnostics (binary-aware)
// ============================================================================
function emitReflexSenseReport(context = {}) {
  if (typeof console === "undefined" || !console.groupCollapsed) return;

  console.groupCollapsed(
    "%c[SkinReflex SENSE REPORT — v12‑EVO‑BINARY‑MAX]",
    "color:#FF9800; font-weight:bold;"
  );

  console.log("• layer:", "A1 (Surface Reflex)");
  console.log("• role:", LAYER_ROLE);
  console.log("• version:", LAYER_VER);

  console.log("• message:", context.message || "none");
  console.log("• file:", context.file || "unknown");
  console.log("• line:", context.line || "unknown");
  console.log("• frames:", context.frames ?? 0);

  console.log("• degraded:", context.degraded);
  console.log("• healthScore:", context.healthScore);
  console.log("• tier:", context.tier);
  console.log("• dnaTag:", context.dnaTag);

  console.log("• binaryAware:", context.binaryAware || false);
  console.log("• dualBand:", true);

  console.log("• page:", context.page || "unknown");
  console.log("• reflexSeq:", context.seq || "n/a");

  console.groupEnd();
}


// ============================================================================
// PULSE OS v12 — SKIN REFLEX (A1 → A2 → Router → Backend/Binary Nervous System)
//  • route() is the dualband nervous entry: binary-first, text fallback
// ============================================================================
import { route } from "./PULSE-OS/PulseOSCNSNervousSystem.js";
// ============================================================================
// ROUTE MEMORY — v12‑EVO‑BINARY‑MAX
//  • Stores degradation, tiers, DNA tags
//  • Binary-aware: tags binary-shadow routes
//  • Deterministic sequence counter (no Date.now)
//  • Error-spine aware (never throws)
// ============================================================================
let skinSeq = 0;

const RouteMemory = {
  store: {},

  makeKey(message, frames) {
    try {
      const top = frames[0] || "NO_FRAME";
      return message + "::" + top;
    } catch (err) {
      PulseUIErrors.broadcast(
        PulseUIErrors.normalize(err, "skinreflex.routememory.makeKey")
      );
      return message + "::NO_FRAME";
    }
  },

  classifyTier(healthScore) {
    try {
      const h = typeof healthScore === "number" ? healthScore : 1.0;

      if (h >= 0.95) return "microDegrade";
      if (h >= 0.85) return "softDegrade";
      if (h >= 0.50) return "midDegrade";
      if (h >= 0.15) return "hardDegrade";
      return "criticalDegrade";
    } catch (err) {
      PulseUIErrors.broadcast(
        PulseUIErrors.normalize(err, "skinreflex.routememory.classifyTier")
      );
      return "microDegrade";
    }
  },

  remember(message, frames, routeTrace, overrides = {}) {
    try {
      const key = this.makeKey(message, frames);
      const baseHealth = overrides.healthScore ?? 1.0;
      const tier = this.classifyTier(baseHealth);

      this.store[key] = {
        seq: ++skinSeq,
        message,
        frames,
        routeTrace,
        degraded: !!overrides.degraded,
        healthScore: baseHealth,
        tier,
        dnaTag: overrides.binaryAware
          ? "A1_BINARY_SHADOW"
          : "A1_SURFACE",
        ...overrides
      };

      logProtector("ROUTE_MEMORY_SAVED", {
        key,
        frames: frames.length,
        degraded: this.store[key].degraded,
        healthScore: this.store[key].healthScore,
        tier: this.store[key].tier,
        dnaTag: this.store[key].dnaTag
      });
    } catch (err) {
      PulseUIErrors.broadcast(
        PulseUIErrors.normalize(err, "skinreflex.routememory.remember")
      );
    }
  },

  markDegraded(message, frames, healthScore = 0.85, binaryAware = false) {
    try {
      const key = this.makeKey(message, frames);
      const entry = this.store[key];
      if (!entry) return;

      entry.degraded = true;
      entry.healthScore = healthScore;
      entry.tier = this.classifyTier(healthScore);
      entry.dnaTag = binaryAware
        ? "A1_BINARY_SHADOW_DEGRADED"
        : "A1_SURFACE_DEGRADED";

      logProtector("ROUTE_MEMORY_DEGRADED", {
        key,
        healthScore,
        tier: entry.tier,
        dnaTag: entry.dnaTag
      });
    } catch (err) {
      PulseUIErrors.broadcast(
        PulseUIErrors.normalize(err, "skinreflex.routememory.markDegraded")
      );
    }
  },

  recall(message, frames) {
    try {
      const key = this.makeKey(message, frames);
      const entry = this.store[key];
      if (!entry) return null;

      logProtector("ROUTE_MEMORY_HIT", {
        key,
        frames: entry.frames.length,
        degraded: entry.degraded,
        healthScore: entry.healthScore,
        tier: entry.tier,
        dnaTag: entry.dnaTag
      });

      return entry.routeTrace;
    } catch (err) {
      PulseUIErrors.broadcast(
        PulseUIErrors.normalize(err, "skinreflex.routememory.recall")
      );
      return null;
    }
  },

  getEntry(message, frames) {
    try {
      const key = this.makeKey(message, frames);
      return this.store[key] || null;
    } catch (err) {
      PulseUIErrors.broadcast(
        PulseUIErrors.normalize(err, "skinreflex.routememory.getEntry")
      );
      return null;
    }
  }
};

// ============================================================================
// v12 — SESSION CHECK (trustedDevice barrier + identity exposure)
// ============================================================================
async function sessionCheck() {
  try {
    if (!hasWindow || !window.localStorage) {
      logProtector("SESSIONCHECK_SKIPPED_NO_WINDOW", {});
      return null;
    }

    let id = null;

    try {
      const raw = window.localStorage.getItem("tp_identity_v9");
      if (raw) id = JSON.parse(raw);
    } catch {
      id = null;
    }

    if (hasWindow) {
      if (!window.Pulse) window.Pulse = {};
      window.PulseIdentity = id || null;
    }

    if (!id || !id.trustedDevice) {
      const here =
        encodeURIComponent(window.location.pathname + window.location.search);
      logProtector("SESSIONCHECK_REDIRECT_UNTRUSTED", {
        path: window.location.pathname,
        trustedDevice: id?.trustedDevice || false
      });
      window.location.href = `/CheckEmail.html?returnTo=${here}`;
      return null;
    }

    logProtector("SESSIONCHECK_OK", { trustedDevice: true });
    return id;
  } catch (err) {
    PulseUIErrors.broadcast(
      PulseUIErrors.normalize(err, "skinreflex.sessionCheck")
    );
    return null;
  }
}


// ============================================================================
// v12 — ROUTE CHECK (page continuity) — ONLY HEAL WHEN NEEDED
// ============================================================================
function routeCheck() {
  try {
    if (!hasWindow) {
      logProtector("ROUTECHECK_SKIPPED_NO_WINDOW", {});
      return { needsHealing: false };
    }

    if (!window.Pulse) window.Pulse = {};

    const lastPage = window.Pulse.pageName || null;
    const pageName =
      (window.location && window.location.pathname) || null;

    // Update identity
    window.Pulse.lastPage = lastPage;
    window.Pulse.pageName = pageName;

    // ------------------------------------------------------------------
    // ⭐ ONLY FLAG HEALING WHEN PAGE STATE IS ACTUALLY BROKEN
    // ------------------------------------------------------------------
    const needsHealing =
      !pageName ||                     // null, undefined, empty
      pageName === "unknown" ||        // invalid
      pageName.trim() === "" ||        // empty string
      pageName.includes("undefined") ||// malformed
      pageName.includes("//") ||       // malformed
      lastPage === "unknown" ||        // invalid previous state
      lastPage === null && hasBootedOnce; // null AFTER first boot = broken

    logProtector("ROUTECHECK_UPDATED", {
      pageName,
      lastPage,
      needsHealing
    });

    return { pageName, lastPage, needsHealing };

  } catch (err) {
    PulseUIErrors.broadcast(
      PulseUIErrors.normalize(err, "skinreflex.routeCheck")
    );
    return { needsHealing: false };
  }
}



// ============================================================================
// PUBLIC API — dualband nervous entry (binary-first)
// ============================================================================
export async function getAuth(jwtToken) {
  try {
    logProtector("GET_AUTH", {});
    return await route("auth", {
      jwtToken,
      reflexOrigin: "SkinReflex",
      layer: "A1",
      binaryAware: true,
      dualBand: true
    });
  } catch (err) {
    PulseUIErrors.broadcast(
      PulseUIErrors.normalize(err, "skinreflex.getAuth")
    );
    return null;
  }
}

export async function getHook(name, payload = {}) {
  try {
    logProtector("GET_HOOK", { name });
    return await route("hook", {
      name,
      payload,
      reflexOrigin: "SkinReflex",
      layer: "A1",
      binaryAware: true,
      dualBand: true
    });
  } catch (err) {
    PulseUIErrors.broadcast(
      PulseUIErrors.normalize(err, "skinreflex.getHook")
    );
    return null;
  }
}

export async function getMap(mapName) {
  try {
    logProtector("GET_MAP", { mapName });
    return await route("map", {
      mapName,
      reflexOrigin: "SkinReflex",
      layer: "A1",
      binaryAware: true,
      dualBand: true
    });
  } catch (err) {
    PulseUIErrors.broadcast(
      PulseUIErrors.normalize(err, "skinreflex.getMap")
    );
    return null;
  }
}

export async function callHelper(helperName, payload = {}) {
  try {
    logProtector("CALL_HELPER", { helperName });
    return await route("helper", {
      helperName,
      payload,
      reflexOrigin: "SkinReflex",
      layer: "A1",
      binaryAware: true,
      dualBand: true
    });
  } catch (err) {
    PulseUIErrors.broadcast(
      PulseUIErrors.normalize(err, "skinreflex.callHelper")
    );
    return null;
  }
}


// ============================================================================
// v12 — PAGE SCANNER ENTRYPOINT (sessionCheck → routeCheck → reflex ready)
// ============================================================================
let hasBootedOnce = false;
export async function attachScanner() {
  try {
    logProtector("SCANNER_ATTACH_START", {});

    const identity = await sessionCheck();
    if (!identity) {
      logProtector("SCANNER_ABORTED_UNTRUSTED", {});
      return null;
    }

    if (!hasBootedOnce) {
      hasBootedOnce = true;

      logProtector("SCANNER_FIRST_BOOT_ATTACH_ONLY", {
        pageName: window.Pulse?.pageName || null
      });

      return {
        identity,
        route: null,
        needsHealing: false
      };
    }

    const routeInfo = routeCheck();
    const needsHealing = routeInfo?.needsHealing === true;

    logProtector(
      needsHealing
        ? "SCANNER_CONTINUITY_BROKEN"
        : "SCANNER_CONTINUITY_OK",
      routeInfo
    );

    // SkinReflex NEVER heals — it only reports
    return {
      identity,
      route: routeInfo,
      needsHealing
    };

  } catch (err) {
    PulseUIErrors.broadcast(
      PulseUIErrors.normalize(err, "skinreflex.attachScanner")
    );
    return null;
  }
}



// ============================================================================
// v12 — MEMBRANE ALIVE (Window → SkinReflex)
// ============================================================================
export function membraneAlive(origin = "unknown") {
  try {
    if (typeof console !== "undefined") {
      console.debug(`[SkinReflex] membraneAlive from ${origin}`);
    }
  } catch (err) {
    PulseUIErrors.broadcast(
      PulseUIErrors.normalize(err, "skinreflex.membraneAlive")
    );
  }
}


// ============================================================================
// v12 — PAGE SCANNER INTELLIGENCE HOOKS (A1/A2 Hybrid) — UPGRADE 3/4
// ============================================================================
function emitPageScannerIntel(context = {}) {
  try {
    if (typeof window === "undefined" || !window.PageScannerAdapter) return;

    const packet = PageScannerV12.buildDriftPacket(context);

    // Log structural severity when present
    if (packet && typeof packet.severity === "number") {
      logProtector("PAGESCANNER_DRIFT_INTEL", {
        severity: packet.severity,
        tooFar: !!packet.tooFar,
        hasStructural: !!packet.structural
      });
    }

    if (typeof window.PageScannerAdapter.onEvent === "function") {
      window.PageScannerAdapter.onEvent(packet);
    }
  } catch (err) {
    PulseUIErrors.broadcast(
      PulseUIErrors.normalize(err, "pagescanner.emitIntel")
    );
  }
}
// ============================================================================
// v12‑EVO — PAGE SCANNER (A2) HOOK INSIDE attachScanner()
//  • Runs AFTER sessionCheck + routeCheck
//  • Emits page‑level drift‑intel (pageName, lastPage, identity)
//  • Does NOT rewrite anything
// ============================================================================
(function attachPageScannerIntel() {
  if (!hasWindow) return;

  try {
    const pageName =
      (window.location && window.location.pathname) || "unknown";

    const identity = window.PulseIdentity || null;
    const lastPage = window.Pulse?.lastPage || null;

    emitPageScannerIntel({
      event: "page-scanner-attach",
      pageName,
      lastPage,
      identityTrusted: !!identity?.trustedDevice,
      layer: "A1/A2",
      subsystem: "PageScannerV12",
      note: "attachScanner completed"
    });
  } catch (err) {
    // v12‑EVO: forward to error spine
    try {
      PulseUIErrors.broadcast(
        PulseUIErrors.normalize(err, "pagescanner.attachIntel")
      );
    } catch {}
  }
})();


// ============================================================================
// A1 ERROR INTERCEPTOR — Dualband error catcher (binary-first, text fallback)
//  • No timers, no intervals, no Date.now
//  • Always emits local diagnostics before routing
//  • v12‑EVO: error spine integrated BEFORE classification/healing
// ============================================================================
let healingInProgress = false;

if (hasWindow && typeof window.addEventListener === "function") {
  window.addEventListener(
    "error",
    async (event) => {
      if (healingInProgress) return;

      const msg   = event.message || "";
      const stack = event.error?.stack || "";
      const frames = stack.split("\n").map((s) => s.trim());

      const rawFrames = frames
        .filter((f) => f.includes(".js"))
        .map((f) => f.replace(/^at\s+/, ""));

      logProtector("ERROR_INTERCEPTED", { message: msg });

      // ========================================================================
      //  v12‑EVO — UNIVERSAL ERROR SPINE INTEGRATION (A1 → A3)
      // ========================================================================
      try {
        PulseUIErrors.broadcast(
          PulseUIErrors.normalize(
            event.error || msg,
            "skinreflex.window.error"
          )
        );
      } catch (spineErr) {
        console.warn("[PulseUIErrors] failed to broadcast A1 error:", spineErr);
      }

      const top = rawFrames[0] || "unknown";
      const file = top.split("/").pop().split(":")[0] || "unknown";
      const line = top.split(":")[1] || "unknown";

      const pagePath =
        hasWindow && window.location ? window.location.pathname : null;

      // ========================================================================
      // LOCAL A1 DIAGNOSTICS (never throws)
      // ========================================================================
      (function emitA1LocalDiagnostics() {
        try {
          if (typeof console !== "undefined" && console.groupCollapsed) {
            console.groupCollapsed(
              `%cA1 DIAGNOSTIC — ${msg}`,
              "color:#FF7043; font-weight:bold;"
            );

            console.log("• message:", msg);
            console.log("• file:", file);
            console.log("• line:", line);
            console.log("• top frame:", top);
            console.log("• raw frames:", rawFrames);
            console.log("• page:", pagePath);
            console.log("• layer:", "A1 (SkinReflex)");
            console.log("• note:", "LOCAL ONLY — does NOT depend on routing or backend.");

            console.groupEnd();
          }
        } catch (err) {
          PulseUIErrors.broadcast(
            PulseUIErrors.normalize(err, "skinreflex.localDiagnostics")
          );
        }
      })();

      // ========================================================================
      // ROUTE TRACE (A1 dynamic trace)
      // ========================================================================
      let routeTrace = RouteMemory.recall(msg, rawFrames);

      if (!routeTrace) {
        routeTrace = rawFrames.map((frame, index) => {
          const fFile = frame.split("/").pop().split(":")[0];

          return {
            frame,
            file: fFile,
            index,
            label: "A1_FRAME",
            layer: "A1",
            purpose: "Surface observed frame",
            context: "SkinReflex dynamic trace",
            binaryAware: true,
            dualBand: true
          };
        });

        logProtector("ROUTE_TRACE_BUILT_DYNAMIC", {
          frames: routeTrace.length
        });

        RouteMemory.remember(msg, rawFrames, routeTrace, {
          binaryAware: true
        });
      }

      // ========================================================================
      // CLASSIFICATION (v12‑EVO)
      // ========================================================================
      let classified = false;
      // ========================================================================
      // UNIVERSAL EXTERNAL RESOURCE INTERCEPTOR (v12‑EVO)
      // Detects ANY internet-bound request using origin resolution,
      // not text or protocol matching.
      // ========================================================================
      function isExternal(url) {
        try {
          const u = new URL(url, window.location.href);

          // Local origins (allowed)
          const localOrigins = new Set([
            window.location.origin,
            "null",                     // sandboxed iframes
            "file://",
            "data:",
            "blob:",
            "pulse://",
            "chrome://",
            "about:",
            "http://localhost",
            "http://127.0.0.1",
            "https://localhost",
            "https://127.0.0.1"
          ]);

          // If origin is NOT in local set → it's external
          return !localOrigins.has(u.origin);
        } catch {
          // If URL cannot be parsed → treat as external for safety
          return true;
        }
      }

      if (isExternal(msg)) {
        logProtector("EXTERNAL_RESOURCE_REQUEST", {
          note: "External resource detected — routing through CNS",
          url: msg
        });

        emitReflexSenseReport({
          message: msg,
          file,
          line,
          frames: rawFrames.length,
          degraded: false,
          healthScore: 1.0,
          tier: "externalResource",
          dnaTag: "A1_SURFACE",
          page: pagePath,
          seq: skinSeq,
          binaryAware: true,
          dualBand: true
        });

        await route("fetchExternalResource", {
          url: msg,
          page: pagePath,
          routeTrace,
          reflexOrigin: "SkinReflex",
          layer: "A1",
          binaryAware: true,
          dualBand: true
        });

        event.preventDefault();
        return;
      }

      // ========================================================================
      // REMAINING CLASSIFIERS
      // ========================================================================
      if (msg.includes("Cannot find module")) {
        logProtector("IMPORT_DEGRADED", {
          note: "Import errors are degradation signals in v12‑EVO‑BINARY",
          details: msg
        });

        RouteMemory.markDegraded(msg, rawFrames, 0.8, true);
        classified = true;
      }

      if (msg.includes("process is not defined")) {
        logProtector("PAGE_ENV_MISMATCH", {
          error: "frontendEnvMismatch",
          hint: "Replace process.env.* with window.PULSE_*"
        });

        RouteMemory.markDegraded(msg, rawFrames, 0.7, false);
        classified = true;
      }

      if (msg.includes("Maximum call stack size exceeded")) {
        logProtector("PAGE_RECURSION_LOOP", {
          error: "pageRecursionLoop",
          details: msg
        });

        RouteMemory.markDegraded(msg, rawFrames, 0.5, false);
        classified = true;
      }

      const memoryEntry = RouteMemory.getEntry(msg, rawFrames);
      const degraded = memoryEntry?.degraded || false;
      const healthScore = memoryEntry?.healthScore ?? 1.0;
      const tier = memoryEntry?.tier || "microDegrade";
      const dnaTag = memoryEntry?.dnaTag || "A1_SURFACE";

      // ========================================================================
      // LOCAL SENSE REPORT (binary-aware)
      // ========================================================================
      emitReflexSenseReport({
        message: msg,
        file,
        line,
        frames: rawFrames.length,
        degraded,
        healthScore,
        tier,
        dnaTag,
        page: pagePath,
        seq: skinSeq,
        binaryAware: true
      });

      // ========================================================================
      // ROUTE LOGGING (dualband → CNS nervous system)
      // ========================================================================
      await route("logError", {
        type: classified ? "classified" : "unclassified",
        message: msg,
        frames: rawFrames,
        routeTrace,
        page: pagePath,
        reflexOrigin: "SkinReflex",
        layer: "A1",
        degraded,
        healthScore,
        tier,
        dnaTag,
        binaryAware: true,
        dualBand: true
      });


      // ========================================================================
      // v12‑EVO — DRIFT INTELLIGENCE ENGINE (A1/A2 Hybrid) — UPGRADE 4/4
      // ========================================================================
      // Predeclare drift intel so they exist outside the try
      let structural = null;
      let severity = 0;
      let tooFar = false;

      try {
        const sourceA = event?.error?.sourceA || "";
        const sourceB = event?.error?.sourceB || "";

        const varsA = PageScannerV12.extractVars(sourceA);
        const varsB = PageScannerV12.extractVars(sourceB);

        const lineage = PageScannerV12.detectLineage(varsA, varsB);
        const moduleModeA = PageScannerV12.detectModuleMode(sourceA);
        const moduleModeB = PageScannerV12.detectModuleMode(sourceB);
        const exportDrift = PageScannerV12.detectExportDrift(sourceB, varsB);

        // assign to the predeclared variable
        structural = PageScannerV12.detectStructural(sourceA, sourceB);
        const contract = PageScannerV12.detectContract(sourceA, sourceB);

        severity =
          typeof structural?.severity === "number" ? structural.severity : 0;
        tooFar = severity >= 3;

        emitPageScannerIntel({
          event: "page-error-drift-detected",
          message: msg,
          file,
          line,
          frames: rawFrames,
          degraded,
          healthScore,
          tier,
          dnaTag,
          lineage,
          moduleMode: {
            pageA: moduleModeA,
            pageB: moduleModeB
          },
          exportDrift,
          structural,
          contract,
          severity,
          tooFar,
          page: pagePath,
          seq: skinSeq,
          layer: "A1/A2",
          subsystem: "PageScannerV12",
          binaryAware: true,
          dualBand: true
        });

        logProtector("DRIFT_INTEL_EMITTED", {
          lineageCount: lineage.length,
          moduleMixedA: moduleModeA.mixed,
          moduleMixedB: moduleModeB.mixed,
          exportMissingESM: exportDrift.missingESM,
          exportMissingCJS: exportDrift.missingCJS,
          structuralMismatch: structural.mismatch,
          structuralSeverity: severity,
          structuralTooFar: tooFar,
          contractMismatch: contract.mismatch
        });

      } catch (intelErr) {
        PulseUIErrors.broadcast(
          PulseUIErrors.normalize(intelErr, "pagescanner.driftIntel")
        );
      }


      // ========================================================================
      // HEALING TRIGGER (v12‑EVO) — now respects "too far" structural drift
      // ========================================================================
      const parsed = parseMissingField(msg);
      if (!parsed) {
        logProtector("NO_MISSING_FIELD", {
          degraded,
          healthScore,
          tier,
          dnaTag
        });
        event.preventDefault();
        return;
      }

      // If structural drift is too far, skip healing attempt
      if (typeof structural !== "undefined") {
        severity =
          typeof structural.severity === "number" ? structural.severity : 0;
        tooFar = severity >= 3;

        if (tooFar) {
          logProtector("HEALING_SKIPPED_TOO_FAR_STRUCTURAL_DRIFT", {
            severity,
            degraded,
            healthScore,
            tier,
            dnaTag
          });
          event.preventDefault();
          return;
        }
      }

      const { table, field } = parsed;
      const ownerModule = resolveOwnerModule(field);

      logProtector("HEALING_TRIGGERED", {
        table,
        field,
        ownerModule: ownerModule || "UNKNOWN",
        degraded,
        healthScore,
        tier,
        dnaTag
      });

      healingInProgress = true;
      try {
        await route("fetchField", {
          table,
          field,
          ownerModule,
          message: msg,
          page: pagePath,
          routeTrace,
          reflexOrigin: "SkinReflex",
          layer: "A1",
          degraded,
          healthScore,
          tier,
          dnaTag,
          binaryAware: true,
          dualBand: true
        });

        logProtector("HEALING_SUCCESS", {
          table,
          field,
          ownerModule,
          degraded,
          healthScore,
          tier,
          dnaTag
        });
      } catch (err) {
        PulseUIErrors.broadcast(
          PulseUIErrors.normalize(err, "skinreflex.healingFailed")
        );

        logProtector("HEALING_FAILED", {
          error: String(err),
          degraded,
          healthScore,
          tier,
          dnaTag
        });
      }
      healingInProgress = false;
      event.preventDefault();
    },
    true
  );
}


// ============================================================================
// MISSING FIELD PARSER — deterministic, dualband-safe, v12‑EVO
// ============================================================================
function parseMissingField(message) {
  try {
    logProtector("PARSER_INVOKED", {});

    let match = message.match(/reading '([^']+)'/);
    if (match) return { table: "Users", field: match[1] };

    match = message.match(/([^ ]+) is not defined/);
    if (match) return { table: "Users", field: match[1] };

    match = message.match(/property '([^']+)'/);
    if (match) return { table: "Users", field: match[1] };

    return null;
  } catch (err) {
    PulseUIErrors.broadcast(
      PulseUIErrors.normalize(err, "skinreflex.parseMissingField")
    );
    return null;
  }
}
