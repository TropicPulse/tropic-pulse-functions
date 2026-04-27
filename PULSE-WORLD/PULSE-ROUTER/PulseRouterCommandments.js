// ============================================================================
//  PULSE ROUTER COMMANDMENTS v11‑Evo‑DualStack — ROUTER SETTINGS COVENANT
//  Long‑Term Route Settings Memory • Deterministic • Drift‑Proof
//  Pattern/Lineage/Page‑Aware + BinaryPattern/BinaryHints Aware
// ============================================================================
//
//  ROLE:
//    • Canonical route settings + constraints.
//    • Symbolic + Binary dual‑stack.
//    • Deterministic fallback + safe defaults.
//    • Multi‑instance safe, drift‑proof, self‑repair‑ready.
//    • Compatible with EvolutionaryThought, Instincts, Design.
//    • Loop‑Theory‑Aware.
//    • Pure memory organ — NO routing, NO compute, NO mutation outside instance.
//
// ============================================================================


// ------------------------------------------------------------
// v11‑Evo CONTEXT METADATA — Router Commandments Identity
// ------------------------------------------------------------
const ROUTER_COMMANDMENTS_CONTEXT = {
  layer: "PulseRouterCommandments",
  role: "ROUTER_SETTINGS_COVENANT",
  purpose: "Long‑term canonical settings + constraints for symbolic + binary routes",
  context:
    "Stores per‑route commandments: allowed behaviors, fallbacks, stability rules, binary hints",
  target: "dual-stack-router",
  version: 11.0,
  selfRepairable: true,

  evo: {
    advantageCascadeAware: true,
    pulseEfficiencyAware: true,
    driftProof: true,
    multiInstanceReady: true,
    unifiedAdvantageField: true,
    pulseSend11Ready: true,

    routingContract: "PulseSend-v11",
    routerOrganContract: "PulseRouter-v11",
    earnCompatibility: "Earn-v3",

    // ⭐ NEW: Binary-aware commandments
    binaryAware: true
  },

  loopTheory: {
    routingCompletion: true,
    allowLoopfieldPropulsion: true,
    pulseComputeContinuity: true,
    errorRouteAround: true
  }
};


// ------------------------------------------------------------
// Utility: stable JSON stringify
// ------------------------------------------------------------
function stableStringify(value) {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return "[" + value.map(stableStringify).join(",") + "]";
  }
  const keys = Object.keys(value).sort();
  const parts = keys.map(
    (k) => JSON.stringify(k) + ":" + stableStringify(value[k])
  );
  return "{" + parts.join(",") + "}";
}


// ------------------------------------------------------------
// Utility: deterministic hash
// ------------------------------------------------------------
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const chr = str.charCodeAt(i);
    hash = (hash << 5) - hash + chr;
    hash |= 0;
  }
  return (hash >>> 0).toString(16);
}


// ------------------------------------------------------------
// Helpers: symbolic ancestry
// ------------------------------------------------------------
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


// ------------------------------------------------------------
// Helpers: binary ancestry (optional)
// ------------------------------------------------------------
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


// ------------------------------------------------------------
// Commandment key — Route + Tier + Context + Pattern + Page + Binary
// ------------------------------------------------------------
function buildRouteKey({
  routeId = "unknown-route",
  tierId = "default",
  context = {},
  pattern = "",
  pageId = "NO_PAGE",
  lineage = [],
  payload = {}
} = {}) {

  const binary = extractBinarySurface(payload);

  const base = {
    routeId,
    tierId,
    context,
    pattern,
    pageId,
    lineage,
    binaryPattern: binary.binaryPattern,
    binaryMode: binary.binaryMode,
    binaryStrength: binary.binaryStrength
  };

  return simpleHash(stableStringify(base));
}


// ------------------------------------------------------------
// Commandment normalization — Safe Settings Envelope
// ------------------------------------------------------------
function normalizeCommandments(commandments = {}) {
  const {
    allowDegrade = true,
    allowFallback = true,
    hardFailOnBreach = false,
    maxDegradeDepth = 3,
    preferredPath = "primary",
    forbiddenPaths = [],
    notes = "",

    routingCompletion = true,
    allowLoopfieldPropulsion = true,
    pulseComputeContinuity = true,
    errorRouteAround = true
  } = commandments;

  return {
    allowDegrade: Boolean(allowDegrade),
    allowFallback: Boolean(allowFallback),
    hardFailOnBreach: Boolean(hardFailOnBreach),
    maxDegradeDepth:
      typeof maxDegradeDepth === "number" && maxDegradeDepth >= 0
        ? maxDegradeDepth
        : 0,
    preferredPath: String(preferredPath || "primary"),
    forbiddenPaths: Array.isArray(forbiddenPaths)
      ? forbiddenPaths.map((p) => String(p))
      : [],
    notes: String(notes || ""),

    routingCompletion: Boolean(routingCompletion),
    allowLoopfieldPropulsion: Boolean(allowLoopfieldPropulsion),
    pulseComputeContinuity: Boolean(pulseComputeContinuity),
    errorRouteAround: Boolean(errorRouteAround)
  };
}


// ------------------------------------------------------------
// Memory entry model — Route Commandment Record (Dual‑Stack)
// ------------------------------------------------------------
class PulseRouterCommandmentsStore {
  constructor() {
    this.entries = new Map();
    this.meta = { ...ROUTER_COMMANDMENTS_CONTEXT };
  }

  clear() {
    this.entries.clear();
  }

  setCommandments({
    routeId,
    tierId,
    context,
    commandments,
    pattern,
    lineage,
    pageId,
    payload
  }) {
    const safePattern = typeof pattern === "string" ? pattern : "";
    const safeLineage = Array.isArray(lineage) ? lineage.slice() : [];
    const safePageId = pageId || "NO_PAGE";

    const binary = extractBinarySurface(payload);

    const patternAncestry = buildPatternAncestry(safePattern);
    const lineageSignature = buildLineageSignature(safeLineage);
    const pageAncestrySignature = buildPageAncestrySignature({
      pattern: safePattern,
      lineage: safeLineage,
      pageId: safePageId
    });

    const key = buildRouteKey({
      routeId,
      tierId,
      context,
      pattern: safePattern,
      lineage: safeLineage,
      pageId: safePageId,
      payload
    });

    const normalized = normalizeCommandments(commandments);

    const entry = {
      key,
      routeId: String(routeId || "unknown-route"),
      tierId: String(tierId || "default"),
      context: context || {},
      pattern: safePattern,
      patternAncestry,
      lineage: safeLineage,
      lineageSignature,
      pageId: safePageId,
      pageAncestrySignature,

      // ⭐ NEW: binary surface
      binary,

      commandments: normalized,
      meta: { ...ROUTER_COMMANDMENTS_CONTEXT }
    };

    this.entries.set(key, entry);
    return this.entries.get(key);
  }

  getCommandments({ routeId, tierId, context, pattern, lineage, pageId, payload }) {
    const safePattern = typeof pattern === "string" ? pattern : "";
    const safeLineage = Array.isArray(lineage) ? lineage.slice() : [];
    const safePageId = pageId || "NO_PAGE";

    const key = buildRouteKey({
      routeId,
      tierId,
      context,
      pattern: safePattern,
      lineage: safeLineage,
      pageId: safePageId,
      payload
    });

    const entry = this.entries.get(key);

    if (!entry) {
      const patternAncestry = buildPatternAncestry(safePattern);
      const lineageSignature = buildLineageSignature(safeLineage);
      const pageAncestrySignature = buildPageAncestrySignature({
        pattern: safePattern,
        lineage: safeLineage,
        pageId: safePageId
      });

      return {
        key,
        routeId: String(routeId || "unknown-route"),
        tierId: String(tierId || "default"),
        context: context || {},
        pattern: safePattern,
        patternAncestry,
        lineage: safeLineage,
        lineageSignature,
        pageId: safePageId,
        pageAncestrySignature,

        // ⭐ NEW: binary surface
        binary: extractBinarySurface(payload),

        commandments: normalizeCommandments({}),
        meta: { ...ROUTER_COMMANDMENTS_CONTEXT }
      };
    }

    return entry;
  }

  getSnapshot() {
    const out = {};
    for (const [key, entry] of this.entries.entries()) {
      out[key] = {
        routeId: entry.routeId,
        tierId: entry.tierId,
        pattern: entry.pattern,
        patternAncestry: entry.patternAncestry.slice(),
        lineage: entry.lineage.slice(),
        lineageSignature: entry.lineageSignature,
        pageId: entry.pageId,
        pageAncestrySignature: entry.pageAncestrySignature,

        // ⭐ NEW: binary surface snapshot
        binary: { ...entry.binary },

        commandments: { ...entry.commandments }
      };
    }
    return out;
  }

  serialize() {
    return JSON.stringify([...this.entries.values()]);
  }

  deserialize(jsonString) {
    this.entries.clear();
    if (!jsonString) return;

    let arr;
    try {
      arr = JSON.parse(jsonString);
    } catch {
      return;
    }

    if (!Array.isArray(arr)) return;

    arr.forEach((entry) => {
      if (!entry || typeof entry !== "object" || !entry.key) return;

      const safePattern = typeof entry.pattern === "string" ? entry.pattern : "";
      const safeLineage = Array.isArray(entry.lineage)
        ? entry.lineage.slice()
        : [];
      const safePageId = entry.pageId || "NO_PAGE";

      const patternAncestry = Array.isArray(entry.patternAncestry)
        ? entry.patternAncestry.slice()
        : buildPatternAncestry(safePattern);

      const lineageSignature =
        typeof entry.lineageSignature === "string"
          ? entry.lineageSignature
          : buildLineageSignature(safeLineage);

      const pageAncestrySignature =
        typeof entry.pageAncestrySignature === "string"
          ? entry.pageAncestrySignature
          : buildPageAncestrySignature({
              pattern: safePattern,
              lineage: safeLineage,
              pageId: safePageId
            });

      const safeEntry = {
        key: entry.key,
        routeId: entry.routeId || "unknown-route",
        tierId: entry.tierId || "default",
        context: entry.context || {},
        pattern: safePattern,
        patternAncestry,
        lineage: safeLineage,
        lineageSignature,
        pageId: safePageId,
        pageAncestrySignature,

        // ⭐ NEW: binary surface
        binary: entry.binary || extractBinarySurface({}),

        commandments: normalizeCommandments(entry.commandments || {}),
        meta: { ...ROUTER_COMMANDMENTS_CONTEXT }
      };

      this.entries.set(safeEntry.key, safeEntry);
    });
  }
}


// ------------------------------------------------------------
// Public API wrapper — Commandment Surface
// ------------------------------------------------------------
class PulseRouterCommandments {
  constructor() {
    this.store = new PulseRouterCommandmentsStore();
    this.meta = { ...ROUTER_COMMANDMENTS_CONTEXT };
  }

  setCommandments(payload) {
    return this.store.setCommandments(payload);
  }

  getCommandments(payload) {
    return this.store.getCommandments(payload);
  }

  getSnapshot() {
    return this.store.getSnapshot();
  }

  serialize() {
    return this.store.serialize();
  }

  deserialize(jsonString) {
    this.store.deserialize(jsonString);
  }

  clear() {
    this.store.clear();
  }
}


// ------------------------------------------------------------
// EXPORTS
// ------------------------------------------------------------
export {
  PulseRouterCommandments,
  buildRouteKey,
  normalizeCommandments
};
