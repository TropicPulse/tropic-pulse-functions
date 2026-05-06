// ============================================================================
//  PulseMeshRouter-v16-IMMORTAL-INTEL-DualHash — MESH ROUTING ORGAN
//  Symbolic + Binary + Intel + DualHash + Prewarm + PresenceScope
//  Deterministic Mesh Path Selection • Pattern/Lineage/Page/Binary-Aware
// ============================================================================

/*
AI_EXPERIENCE_META = {
  identity: "PulseRouterMesh",
  version: "v16-IMMORTAL-INTEL-DualHash",
  layer: "frontend",
  role: "router_mesh_engine",
  lineage: "PulseOS-v16",

  evo: {
    meshCore: true,
    deterministic: true,
    dualBand: true,
    binaryAware: true,
    symbolicAware: true,
    presenceAware: true,
    chunkAligned: true,
    safeRouteFree: true,
    multiRoute: true,
    dualHashReady: true,
    intelReady: true
  },

  contract: {
    always: [
      "PulseRouter",
      "PulseBinaryRouter",
      "PulseRouterEvolutionaryDesign",
      "PulseRouterEvolutionaryInstincts",
      "PulseRouterEvolutionaryThought",
      "PulseRouterCommandments",
      "PulseRouterEarn"
    ],
    never: [
      "legacyRouterMesh",
      "legacyRouter",
      "safeRoute",
      "fetchViaCNS"
    ]
  }
}
*/


// ============================================================================
// IMPORT SURFACE — Router Mesh Unit (v16++)
// ============================================================================
import * as PulseRouterEvolutionaryDesign     from "./PulseRouterEvolutionaryDesign.js";
import * as PulseRouterEvolutionaryInstincts  from "./PulseRouterEvolutionaryInstincts.js";
import * as PulseRouterEvolutionaryThought    from "./PulseRouterEvolutionaryThought.js";

import { PulseRouter }                        from "./PulseRouter-v16.js";
import { createBinaryRouter }                 from "./PulseBinaryRouter-v16.js";
import { PulseRouterCommandments }            from "./PulseRouterCommandments.js";
import { PulseEarnRouter }                    from "./PulseRouterEarn-v16.js";

import { createPulseCoreMemory }              from "../PULSE-CORE/PulseCoreMemory.js";
import { createPulseMeshPresenceRelay as PulseMeshPresenceRelay }                  from "../PULSE-MESH/PulseMeshPresenceRelay-v16.js";


// ============================================================================
//  ROLE
// ============================================================================
export const PulseMeshRole = {
  type: "MeshRouter",
  subsystem: "PulseMesh",
  layer: "Routing",
  version: "16.0-IMMORTAL-INTEL-DualHash",
  identity: "PulseMeshRouter-v16-IMMORTAL-INTEL-DualHash",

  evo: {
    driftProof: true,
    patternAware: true,
    lineageAware: true,
    pageAware: true,
    deterministicRouting: true,
    unifiedAdvantageField: true,
    loopTheoryAware: true,

    binaryAware: true,
    cacheChunkAware: true,
    prewarmAware: true,
    multiPresenceAware: true,

    dualHashReady: true,
    intelReady: true
  },

  loopTheory: {
    routingCompletion: true,
    allowLoopfieldPropulsion: true,
    pulseComputeContinuity: true,
    errorRouteAround: true
  },

  meshContract: "PulseMesh-v16",
  sendContract: "PulseSend-v16"
};


// ============================================================================
//  CORE MEMORY (mesh-level intel / prewarm)
// ============================================================================
const MeshCoreMemory = createPulseCoreMemory();
const MESH_ROUTE = "mesh-router-global";

const KEY_LAST_DECISION   = "mesh-last-decision";
const KEY_LAST_SURFACE    = "mesh-last-surface";
const KEY_HOT_PATTERNS    = "mesh-hot-patterns";
const KEY_HOT_PAGES       = "mesh-hot-pages";
const KEY_HOT_BINARY      = "mesh-hot-binary";
const KEY_HOT_PATHS       = "mesh-hot-paths";

function trackMeshPattern(pattern) {
  if (!pattern) return;
  const hot = MeshCoreMemory.get(MESH_ROUTE, KEY_HOT_PATTERNS) || {};
  hot[pattern] = (hot[pattern] || 0) + 1;
  MeshCoreMemory.set(MESH_ROUTE, KEY_HOT_PATTERNS, hot);
}

function trackMeshPage(pageId) {
  if (!pageId) return;
  const hot = MeshCoreMemory.get(MESH_ROUTE, KEY_HOT_PAGES) || {};
  hot[pageId] = (hot[pageId] || 0) + 1;
  MeshCoreMemory.set(MESH_ROUTE, KEY_HOT_PAGES, hot);
}

function trackMeshBinary(binary) {
  if (!binary || !binary.hasBinary) return;
  const key = binary.binaryPattern || binary.binaryMode || "generic-binary";
  const hot = MeshCoreMemory.get(MESH_ROUTE, KEY_HOT_BINARY) || {};
  hot[key] = (hot[key] || 0) + 1;
  MeshCoreMemory.set(MESH_ROUTE, KEY_HOT_BINARY, hot);
}

function trackMeshPath(path) {
  if (!path) return;
  const hot = MeshCoreMemory.get(MESH_ROUTE, KEY_HOT_PATHS) || {};
  hot[path] = (hot[path] || 0) + 1;
  MeshCoreMemory.set(MESH_ROUTE, KEY_HOT_PATHS, hot);
}

function storeMeshDecision(decision, surface) {
  MeshCoreMemory.set(MESH_ROUTE, KEY_LAST_DECISION, decision);
  MeshCoreMemory.set(MESH_ROUTE, KEY_LAST_SURFACE, surface);
  trackMeshPattern(surface.pattern);
  trackMeshPage(surface.pageId);
  trackMeshBinary(surface.binary);
  trackMeshPath(decision.meshPath);
}


// ============================================================================
//  HELPERS — stable stringify + hash
// ============================================================================
function stableStringify(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return "[" + value.map(stableStringify).join(",") + "]";
  const keys = Object.keys(value).sort();
  return (
    "{" +
    keys.map((k) => JSON.stringify(k) + ":" + stableStringify(value[k])).join(",") +
    "}"
  );
}

function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return (hash >>> 0).toString(16);
}


// ============================================================================
//  DUALHASH HELPERS (Mesh Decision)
// ============================================================================
function hash131(raw) {
  let h = 0;
  const s = String(raw);
  for (let i = 0; i < s.length; i++) {
    h = (h * 131 + s.charCodeAt(i)) >>> 0;
  }
  return h >>> 0;
}

function hash257(raw) {
  let h = 1;
  const s = String(raw);
  for (let i = 0; i < s.length; i++) {
    h = (h * 257 + s.charCodeAt(i)) >>> 0;
  }
  return h >>> 0;
}

function computeDualHashMeshDecision(shape) {
  const raw = JSON.stringify(shape);
  const h1 = hash131(raw);
  const h2 = hash257(raw);
  const combined = hash131(`${h1.toString(16)}::${h2.toString(16)}`);
  return {
    primary: `md16-p${h1.toString(16)}`,
    secondary: `md16-s${h2.toString(16)}`,
    combined: `md16-c${combined.toString(16)}`
  };
}


// ============================================================================
//  HELPERS — symbolic ancestry
// ============================================================================
function buildPatternAncestry(pattern) {
  if (!pattern || typeof pattern !== "string") return [];
  return pattern.split("/").filter(Boolean);
}

function buildLineageSignature(lineage) {
  if (!Array.isArray(lineage) || lineage.length === 0) return "NO_LINEAGE";
  return lineage.join(">");
}

function buildPageAncestrySignature({ pattern, lineage, pageId }) {
  const safePattern = typeof pattern === "string" ? pattern : "";
  const safeLineage = Array.isArray(lineage) ? lineage : [];
  const safePageId = pageId || "NO_PAGE";

  const shape = {
    pattern: safePattern,
    patternAncestry: buildPatternAncestry(safePattern),
    lineageSignature: buildLineageSignature(safeLineage),
    pageId: safePageId
  };

  return simpleHash(stableStringify(shape));
}


// ============================================================================
//  HELPERS — binary ancestry (optional)
// ============================================================================
function extractBinarySurface(payload = {}) {
  const binaryPattern  = payload.binaryPattern || null;
  const binaryMode     = payload.binaryMode || null;
  const binaryPayload  = payload.binaryPayload || null;
  const binaryHints    = payload.binaryHints || null;
  const binaryStrength = typeof payload.binaryStrength === "number"
    ? payload.binaryStrength
    : null;

  const hasBinary =
    !!binaryPattern ||
    !!binaryMode ||
    !!binaryPayload ||
    !!binaryHints ||
    binaryStrength !== null;

  return {
    hasBinary,
    binaryPattern,
    binaryMode,
    binaryPayload,
    binaryHints,
    binaryStrength
  };
}


// ============================================================================
//  DEGRADATION TIER
// ============================================================================
function classifyDegradationTier(healthScore) {
  const h = typeof healthScore === "number" ? healthScore : 1.0;
  if (h >= 0.95) return "microDegrade";
  if (h >= 0.85) return "softDegrade";
  if (h >= 0.50) return "midDegrade";
  if (h >= 0.15) return "hardDegrade";
  return "criticalDegrade";
}


// ============================================================================
//  CACHE / PREWARM / PRESENCE SCOPE
// ============================================================================
function buildCacheChunkKey({ pattern, lineage, pageId, binary }) {
  const shape = {
    pattern,
    lineage,
    pageId,
    binaryPattern: binary.binaryPattern,
    binaryMode: binary.binaryMode
  };
  return "mesh-cache::" + simpleHash(stableStringify(shape));
}

function buildPrewarmHint({ pattern, pageId, binary }) {
  const base = {
    pattern,
    pageId,
    hasBinary: binary.hasBinary,
    binaryPattern: binary.binaryPattern
  };
  const hash = simpleHash(stableStringify(base));
  const bucket = parseInt(hash.slice(0, 2), 16) % 3;

  const level = bucket === 0 ? "light" : bucket === 1 ? "aggressive" : "none";
  return {
    level,
    hintKey: "mesh-prewarm::" + hash
  };
}

function buildPresenceScope({ pattern, pageId, binary }) {
  if (binary.hasBinary && binary.binaryPattern) {
    const key =
      "mesh-presence::page::" +
      simpleHash(`${pattern}::${pageId}::${binary.binaryPattern}`);
    return { scope: "page", presenceKey: key };
  }

  const key = "mesh-presence::local::" + simpleHash(`${pattern}::${pageId}`);
  return { scope: "local", presenceKey: key };
}


// ============================================================================
//  MESH INTEL SURFACE (IMMORTAL v16)
// ============================================================================
function buildMeshIntel(pulse, meshShape) {
  const healthScore = typeof pulse.healthScore === "number"
    ? pulse.healthScore
    : 1.0;

  const tier = classifyDegradationTier(healthScore);

  const advantageField = pulse.advantageField || null;
  const pulseCompute   = pulse.pulseCompute || null;

  const solvednessScore =
    pulseCompute && typeof pulseCompute.solvednessScore === "number"
      ? pulseCompute.solvednessScore
      : null;

  const computeTier =
    pulseCompute && typeof pulseCompute.computeTier === "string"
      ? pulseCompute.computeTier
      : null;

  const factoringSignal =
    pulseCompute && typeof pulseCompute.factoringSignal === "string"
      ? pulseCompute.factoringSignal
      : null;

  const dualHash = computeDualHashMeshDecision(meshShape);

  return {
    healthScore,
    tier,
    advantageField,
    pulseCompute,
    solvednessScore,
    computeTier,
    factoringSignal,
    dualHash
  };
}


// ============================================================================
//  DETERMINISTIC MESH PATH SELECTION (Symbolic + Binary)
// ============================================================================
function chooseMeshPath(pulse) {
  const binary = extractBinarySurface(pulse.payload || {});

  if (binary.hasBinary && binary.binaryHints?.meshHint) {
    return binary.binaryHints.meshHint;
  }

  const pattern = pulse.pattern || "UNKNOWN_PATTERN";
  const lineageDepth = Array.isArray(pulse.lineage) ? pulse.lineage.length : 0;

  const raw = `${pattern}::${lineageDepth}`;
  let acc = 0;
  for (let i = 0; i < raw.length; i++) {
    acc = (acc + raw.charCodeAt(i) * (i + 11)) % 6151;
  }

  const paths = ["mesh-local", "mesh-remote", "mesh-os-fallback"];
  return paths[acc % paths.length];
}


// ============================================================================
//  INTERNAL — pure mesh decision builder
// ============================================================================
function buildMeshDecision(pulse) {
  const pattern = pulse.pattern || "UNKNOWN_PATTERN";
  const lineage = Array.isArray(pulse.lineage) ? pulse.lineage.slice() : [];
  const pageId = pulse.pageId || "NO_PAGE";

  const patternAncestry =
    pulse.patternAncestry?.length
      ? pulse.patternAncestry.slice()
      : buildPatternAncestry(pattern);

  const lineageSignature =
    typeof pulse.lineageSignature === "string"
      ? pulse.lineageSignature
      : buildLineageSignature(lineage);

  const pageAncestrySignature =
    typeof pulse.pageAncestrySignature === "string"
      ? pulse.pageAncestrySignature
      : buildPageAncestrySignature({ pattern, lineage, pageId });

  const binary = extractBinarySurface(pulse.payload || {});
  const tier = classifyDegradationTier(pulse.healthScore ?? 1);

  const meshPath = chooseMeshPath(pulse);

  const cacheChunkKey = buildCacheChunkKey({
    pattern,
    lineage,
    pageId,
    binary
  });

  const prewarmHint = buildPrewarmHint({
    pattern,
    pageId,
    binary
  });

  const presenceScope = buildPresenceScope({
    pattern,
    pageId,
    binary
  });

  const meshShape = {
    meshPath,
    tier,
    pattern,
    patternAncestry,
    lineage,
    lineageSignature,
    pageId,
    pageAncestrySignature,
    binary,
    cacheChunkKey,
    prewarmHint,
    presenceScope
  };

  const meshIntel = buildMeshIntel(pulse, meshShape);

  return {
    decision: {
      ...meshShape,
      loopTheory: { ...PulseMeshRole.loopTheory },
      meshIntel
    },
    surface: {
      pattern,
      patternAncestry,
      lineage,
      lineageSignature,
      pageId,
      pageAncestrySignature,
      binary,
      cacheChunkKey,
      prewarmHint,
      presenceScope,
      meshIntel
    }
  };
}


// ============================================================================
//  PUBLIC API — PulseMeshRouter (v16 IMMORTAL INTEL DualHash)
// ============================================================================
export const PulseMeshRouter = {

  PulseMeshRole,
  MeshCoreMemory,
  PulseRouter,
  PulseRouterEvolutionaryDesign,
  PulseRouterEvolutionaryInstincts,
  PulseRouterEvolutionaryThought,
  PulseRouterCommandments,
  PulseEarnRouter,
  createBinaryRouter,
  PulseMeshPresenceRelay,

  routeMesh(pulse) {
    MeshCoreMemory.prewarm();

    const { decision, surface } = buildMeshDecision(pulse);
    storeMeshDecision(decision, surface);

    return decision;
  },

  getMeshRoutingState() {
    MeshCoreMemory.prewarm();

    return {
      lastDecision: MeshCoreMemory.get(MESH_ROUTE, KEY_LAST_DECISION),
      lastSurface: MeshCoreMemory.get(MESH_ROUTE, KEY_LAST_SURFACE),
      hotPatterns: MeshCoreMemory.get(MESH_ROUTE, KEY_HOT_PATTERNS),
      hotPages: MeshCoreMemory.get(MESH_ROUTE, KEY_HOT_PAGES),
      hotBinaryPatterns: MeshCoreMemory.get(MESH_ROUTE, KEY_HOT_BINARY),
      hotPaths: MeshCoreMemory.get(MESH_ROUTE, KEY_HOT_PATHS)
    };
  }
};
