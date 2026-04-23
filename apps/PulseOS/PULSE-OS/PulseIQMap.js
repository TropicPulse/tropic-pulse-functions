// ============================================================================
// FILE: /apps/PulseOS/Brain/PulseIQMap.js
// PULSE OS — v10.4 → v11 DESIGN UPGRADE
// “THE IQ WAREHOUSE / IMPORT CORTEX / KNOWLEDGE APPENDAGE STORE”
// ============================================================================
//
//  v11 DIRECTION:
//  - IQ is now TEXT + DESIGN ONLY (no page/organ imports).
//  - IQ does NOT import pages or organs; pages own their own imports.
//  - IQ ONLY imports:
//      • logger  → so the brain can always speak
//      • boot    → so the brain can always re‑ignite
//      • firebase→ external appendage (allowed)
//  - IQ’s job: say “go here / do this / route there” as TEXT,
//    and give router/sessionCheck a safe top‑level page to hit.
// ============================================================================


// ============================================================================
//  SAFE LOGGING (ACCESS IMPORT)
// ============================================================================
import { log, warn, error as logError } from "../pulse-proxy/PulseProxyVitalsLogger.js";


// ============================================================================
//  EVOLUTION + CORTEX BOOT (ACCESS IMPORT)
//  (We keep boot so the brain can always re‑ignite.)
// ============================================================================
import { boot } from "./PulseOSBrainCortex.js";


// ============================================================================
//  FIREBASE (ALLOWED — EXTERNAL SERVICE IQ, ACCESS IMPORT)
// ============================================================================
import * as firebase from "../netlify/functions/firebase.js";


// ============================================================================
//  TOP-LEVEL ROUTING DESIGN (NAME-BASED, NOT PATH-STRICT)
//  This is the “99% fix” layer: when something is off, route here.
//  IQ ONLY returns TEXT routes; router/sessionCheck decides which
//  pages.js module to import for that route.
// ============================================================================
const TOP_LEVEL_ROUTES = {
  root: "/",
  home: "/",
  dashboard: "/dashboard",
  send: "/send",
  earn: "/earn",
  settings: "/settings",
  fallback: "/"
};

function inferTopLevelFromPath(path = "") {
  if (!path || typeof path !== "string") return TOP_LEVEL_ROUTES.fallback;

  const lower = path.toLowerCase();

  if (lower.startsWith("/send")) return TOP_LEVEL_ROUTES.send;
  if (lower.startsWith("/earn")) return TOP_LEVEL_ROUTES.earn;
  if (lower.startsWith("/settings")) return TOP_LEVEL_ROUTES.settings;
  if (lower.startsWith("/dash") || lower.startsWith("/home")) return TOP_LEVEL_ROUTES.dashboard;

  // Anything unknown → safe home/dashboard style page
  return TOP_LEVEL_ROUTES.fallback;
}


// ============================================================================
//  IQ MAP — TEXT BLUEPRINT + ACCESS APPENDAGES
//  No page/organ imports. Only design + routing hints.
// ============================================================================
export const PulseIQMap = {
  // -------------------------------------------------------------------------
  // Logging (brain-level utilities; always safe to call)
// -------------------------------------------------------------------------
  log,
  warn,
  logError,

  // -------------------------------------------------------------------------
  // Brain boot (access only; lets higher layers re‑ignite cortex)
// -------------------------------------------------------------------------
  boot,
    meshDeterminism: {
      cycleCounter: true,
      timestampFree: true,
      asyncFree: true
    },

  // -------------------------------------------------------------------------
  // External Service IQ (appendage; not part of organism)
// -------------------------------------------------------------------------
  firebase,

  // -------------------------------------------------------------------------
  // TEXT BLUEPRINT: ORGAN EXPECTATIONS (NAMES ONLY, NO IMPORTS)
//  These are just strings describing what SHOULD exist somewhere.
//  Pages and router decide how/what to import; IQ does NOT.
// -------------------------------------------------------------------------
  organs: {
    kernel: ["PulseKernel"],
    identity: ["BBB"],
    memory: [
      "LongTermMemory",
      "PulseOSShortTermMemory",
      "saveSnapshot",
      "recordDriftSignature",
      "createRestorePoint"
    ],
    evolution: ["evolveRaw", "boot"],
    nervousSystem: ["PulseSDN"],
    gpu: ["PulseGPU"],
    router: ["PulseRouter"],
    send: ["PulseSendSystem"],
    earn: [
      "PulseEarn",
      "PulseEarnSendSystem",
      "PulseEarnContinuancePulse"
    ],
    mesh: [
      "createCommunityReflex",
      "applyPulseCortex",
      "applyPulseMeshTendons",
      "applyMeshSignalFactoring",
      "recordMeshDriftEvent",
      "MeshScanner"
    ]
  },

  // -------------------------------------------------------------------------
  // TEXT BLUEPRINT: PAGE → EXPECTED ORGANS (NAMES ONLY)
//  This is just “hey, if you load THIS top-level page, it SHOULD
//  generally use THESE organs”. Router/sessionCheck can use this
//  to decide which pages.js imports to pull.
// -------------------------------------------------------------------------
  pages: {
    "/": ["PulseRouter", "PulseKernel"],
    "/dashboard": ["PulseRouter", "PulseGPU", "LongTermMemory"],
    "/send": ["PulseSendSystem", "PulseRouter"],
    "/earn": ["PulseEarn", "PulseEarnSendSystem", "PulseEarnContinuancePulse"],
    "/settings": ["BBB", "LongTermMemory", "PulseOSShortTermMemory"]
    // Extend as routes evolve.
  },

  // -------------------------------------------------------------------------
  // DRIFT / REPAIR METADATA (TEXT-ONLY STATE HINTS)
//  SessionCheck/ImportMesh can update these when they detect/repair drift.
// -------------------------------------------------------------------------
  drift: {
    lastScan: null,
    lastRepair: null,
    signatures: [] // e.g. { page, organ, before, after, timestamp }
  },

  // -------------------------------------------------------------------------
  // ROUTING DESIGN: TOP-LEVEL ROUTE MAP
//  Router/sessionCheck calls these to decide which pages.js to import.
// -------------------------------------------------------------------------
  topLevelRoutes: TOP_LEVEL_ROUTES,

  /**
   * Given a current path (or page identifier), return the best
   * top-level route to land on. This is the main “self-healing”
   * routing helper the router/sessionCheck can call, then THEY
   * choose which pages.js module to import for that route.
   */
  getTopLevelRouteFor(path) {
    return inferTopLevelFromPath(path);
  },

  /**
   * Hard recovery: when the system is unsure, always return a
   * known-good fallback route. Router/sessionCheck can use this
   * as the last resort and then import the fallback pages.js.
   */
  getRecoveryRoute() {
    return TOP_LEVEL_ROUTES.fallback;
  }
};

// ============================================================================
// END OF FILE — PULSE IQ / TEXT DESIGN + ACCESS APPENDAGES / v10.4→v11
// ============================================================================
