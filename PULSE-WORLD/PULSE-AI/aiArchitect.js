// ============================================================================
//  PULSE OS v11.3‑EVO — ARCHITECT ORGAN
//  System + Identity + Architecture Insight
//  PURE READ-ONLY. ZERO IDENTITY LEAKAGE. ZERO MUTATION.
// ============================================================================

export const ArchitectMeta = Object.freeze({
  layer: "PulseAIArchitectFrame",
  role: "ARCHITECT_ORGAN",
  version: "11.3-EVO",
  identity: "aiArchitect-v11.3-EVO",

  evo: Object.freeze({
    deterministic: true,
    driftProof: true,
    readOnly: true,
    identityStripping: true,
    ownerGated: true,
    architectPersonaAware: true,
    evolutionAware: true,
    dbAware: true,
    fileScanAware: true,
    routeAnalysisAware: true,
    schemaAnalysisAware: true,
    deadComponentAware: true,
    orphanRouteAware: true,
    multiInstanceReady: true,
    epoch: "v11.3-EVO"
  }),

  contract: Object.freeze({
    purpose: Object.freeze([
      "Provide owner-level visibility into system and architecture state",
      "Surface drift, schema issues, dead components, and orphaned routes",
      "Map layers, imports, and web stack structure",
      "Integrate with evolution organ for organism-wide analysis",
      "Support file, route, and schema scanning for diagnostics"
    ]),
    never: Object.freeze([
      "write to the system",
      "delete data",
      "update records",
      "expose identity anchors"
    ]),
    always: Object.freeze([
      "stay read-only",
      "stay deterministic",
      "strip identity",
      "respect owner+architect gating"
    ])
  })
});

// ============================================================================
// PUBLIC API — Create Architect Organ
// ============================================================================
export function createArchitectOrgan({ db, evolutionAPI, personas }) {
  // --------------------------------------------------------------------------
  // HELPERS
  // --------------------------------------------------------------------------
  function assertOwnerArchitect(context) {
    const isOwner = context.userIsOwner === true;
    const isArchitect =
      context.personaId &&
      personas &&
      personas.ARCHITECT &&
      context.personaId === personas.ARCHITECT;

    if (!isOwner || !isArchitect) {
      context.logStep?.("aiArchitect: access denied (not owner+architect).");
      return false;
    }
    return true;
  }

  function stripIdentityAnchors(record) {
    if (!record || typeof record !== "object") return record;
    const clone = { ...record };
    delete clone.uid;
    delete clone.userId;
    delete clone.resendToken;
    delete clone.identityRoot;
    delete clone.sessionRoot;
    delete clone.deviceFingerprint;
    return clone;
  }

  async function fetchOwnerCollection(context, collection, options = {}) {
    if (!assertOwnerArchitect(context)) return [];
    const rows = await db.getCollection(collection, options);
    return rows.map(stripIdentityAnchors);
  }

  // --------------------------------------------------------------------------
  // WEB STACK / LAYER MAPPING
  // --------------------------------------------------------------------------
  function mapWebStack(filePath) {
    const lower = String(filePath || "").toLowerCase();

    let layer = "unknown";
    let kind = "unknown";

    if (lower.endsWith(".html")) {
      layer = "presentation";
      kind = "html-document";
    } else if (lower.endsWith(".css")) {
      layer = "presentation";
      kind = "style-sheet";
    } else if (lower.endsWith(".js")) {
      layer = "logic";
      kind = "javascript-module";
    } else if (lower.endsWith(".json")) {
      layer = "config";
      kind = "schema-or-config";
    }

    return {
      filePath,
      layer,
      kind,
      message:
        `File mapped as ${kind} in the ${layer} layer. ` +
        "HTML/CSS/JS are treated as imports in a layered web stack."
    };
  }

  function describeLayering() {
    return {
      layers: [
        "binary / hardware",
        "OS / runtime",
        "backend services",
        "API / routing",
        "frontend logic (JS)",
        "presentation (HTML/CSS)"
      ],
      message:
        "Architecture is modeled as layers-of-layers; each layer can have its own organs and observers."
    };
  }

  // --------------------------------------------------------------------------
  // FILE SCAN (LOCAL ARCHITECT VIEW)
//  - Purely descriptive: size, extension, layer, quick heuristics
//  - Optionally enriched by evolutionAPI.scanFile / analyzeFile
  // --------------------------------------------------------------------------
  async function scanFile(context, { filePath, contents }) {
    if (!assertOwnerArchitect(context)) return null;

    const stackInfo = mapWebStack(filePath);
    const size = typeof contents === "string" ? contents.length : 0;

    const basic = {
      filePath,
      size,
      empty: size === 0,
      stackInfo
    };

    // Optional deeper analysis via evolution organ
    let evo = null;
    if (evolutionAPI?.scanFile) {
      evo = await evolutionAPI.scanFile(context, { filePath, contents });
    } else if (evolutionAPI?.analyzeFile) {
      evo = await evolutionAPI.analyzeFile(context, filePath);
    }

    context.logStep?.("aiArchitect: scanFile completed.");

    return Object.freeze({
      ...basic,
      evo
    });
  }

  // --------------------------------------------------------------------------
  // DEAD COMPONENTS / ORPHANED ROUTES / DRIFT (via evolutionAPI)
//  - All optional, read-only, owner+architect gated
  // --------------------------------------------------------------------------
  async function getDeadComponents(context) {
    if (!assertOwnerArchitect(context) || !evolutionAPI?.getDeadComponents) {
      return Object.freeze([]);
    }
    const rows = await evolutionAPI.getDeadComponents(context);
    context.logStep?.("aiArchitect: fetched dead components.");
    return Object.freeze(rows);
  }

  async function getOrphanedRoutes(context) {
    if (!assertOwnerArchitect(context) || !evolutionAPI?.getOrphanedRoutes) {
      return Object.freeze([]);
    }
    const rows = await evolutionAPI.getOrphanedRoutes(context);
    context.logStep?.("aiArchitect: fetched orphaned routes.");
    return Object.freeze(rows);
  }

  async function getSchemaDriftReport(context) {
    if (!assertOwnerArchitect(context) || !evolutionAPI?.getSchemaDriftReport) {
      return null;
    }
    const report = await evolutionAPI.getSchemaDriftReport(context);
    context.logStep?.("aiArchitect: fetched schema drift report.");
    return report;
  }

  // --------------------------------------------------------------------------
  // PUBLIC ARCHITECT API
  // --------------------------------------------------------------------------
  return Object.freeze({
    meta: ArchitectMeta,

    log(message) {
      console.debug?.("[aiArchitect]", message);
    },

    // IDENTITY + SECURITY (OWNER VIEW)
    async getIdentityHistory(context, options = {}) {
      const rows = await fetchOwnerCollection(context, "identityHistory", options);
      context.logStep?.("aiArchitect: fetched identityHistory.");
      return Object.freeze(rows);
    },

    async getSecurityViolations(context, options = {}) {
      const rows = await fetchOwnerCollection(context, "securityViolations", options);
      context.logStep?.("aiArchitect: fetched securityViolations.");
      return Object.freeze(rows);
    },

    // SYSTEM LOGS (DESIGN-TIME)
    async getFunctionErrors(context, options = {}) {
      const rows = await fetchOwnerCollection(context, "functionErrors", options);
      return Object.freeze(rows);
    },

    async getChangeLogs(context, options = {}) {
      const rows = await fetchOwnerCollection(context, "CHANGES", options);
      return Object.freeze(rows);
    },

    // ENVIRONMENT + POWER (OWNER VIEW)
    async getEnvironmentInternal(context, options = {}) {
      const rows = await fetchOwnerCollection(context, "environment", options);
      return Object.freeze(rows);
    },

    async getPowerHistoryInternal(context, options = {}) {
      const rows = await fetchOwnerCollection(context, "powerHistory", options);
      return Object.freeze(rows);
    },

    // EVOLUTIONARY ANALYSIS (via evolutionAPI)
    async getOrganismOverview(context) {
      if (!assertOwnerArchitect(context) || !evolutionAPI?.getOrganismOverview) return null;
      return evolutionAPI.getOrganismOverview(context);
    },

    async analyzeFile(context, filePath) {
      if (!assertOwnerArchitect(context) || !evolutionAPI?.analyzeFile) return null;
      const stackInfo = mapWebStack(filePath);
      const evo = await evolutionAPI.analyzeFile(context, filePath);
      return { stackInfo, evo };
    },

    async analyzeRoute(context, routeId) {
      if (!assertOwnerArchitect(context) || !evolutionAPI?.analyzeRoute) return null;
      return evolutionAPI.analyzeRoute(context, routeId);
    },

    async analyzeSchema(context, schemaName) {
      if (!assertOwnerArchitect(context) || !evolutionAPI?.analyzeSchema) return null;
      return evolutionAPI.analyzeSchema(context, schemaName);
    },

    // DEAD COMPONENTS / ORPHANED ROUTES / DRIFT
    getDeadComponents,
    getOrphanedRoutes,
    getSchemaDriftReport,

    // FILE SCAN (local + evolution-aware)
    scanFile,

    // ARCHITECTURE EXPLANATION
    describeLayering,
    mapWebStack
  });
}

// ---------------------------------------------------------------------------
// DUAL‑MODE EXPORTS
// ---------------------------------------------------------------------------
if (typeof module !== "undefined") {
  module.exports = {
    ArchitectMeta,
    createArchitectOrgan
  };
}
