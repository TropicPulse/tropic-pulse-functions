// ============================================================================
//  PULSE OS v12.3‑EVO+ — ARCHITECT ORGAN
//  System + Identity + Architecture Insight
//  PURE READ-ONLY. ZERO IDENTITY LEAKAGE. ZERO MUTATION.
// ============================================================================

export const ArchitectMeta = Object.freeze({
  layer: "PulseAIArchitectFrame",
  role: "ARCHITECT_ORGAN",
  version: "12.3-EVO+",
  identity: "aiArchitect-v12.3-EVO+",

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
    architectArteryAware: true,
    epoch: "v12.3-EVO+"
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
// HELPERS — PRESSURE + BUCKETS
// ============================================================================
function extractBinaryPressure(binaryVitals = {}) {
  if (binaryVitals?.layered?.organism?.pressure != null)
    return binaryVitals.layered.organism.pressure;
  if (binaryVitals?.binary?.pressure != null)
    return binaryVitals.binary.pressure;
  return 0;
}

function bucketPressure(v) {
  if (v >= 0.9) return "overload";
  if (v >= 0.7) return "high";
  if (v >= 0.4) return "medium";
  if (v > 0) return "low";
  return "none";
}

// ============================================================================
// PUBLIC API — Create Architect Organ (v12.3‑EVO+)
// ============================================================================
export function createArchitectOrgan({ db, evolutionAPI, personas } = {}) {
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

  function prewarm() {
    return true;
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
  async function scanFile(context, { filePath, contents, binaryVitals = {} }) {
    if (!assertOwnerArchitect(context)) return null;

    const stackInfo = mapWebStack(filePath);
    const size = typeof contents === "string" ? contents.length : 0;
    const binaryPressure = extractBinaryPressure(binaryVitals);

    const basic = {
      filePath,
      size,
      empty: size === 0,
      stackInfo
    };

    let evo = null;
    if (evolutionAPI?.scanFile) {
      evo = await evolutionAPI.scanFile(context, { filePath, contents });
    } else if (evolutionAPI?.analyzeFile) {
      evo = await evolutionAPI.analyzeFile(context, filePath);
    }

    context.logStep?.("aiArchitect: scanFile completed.");

    return Object.freeze({
      ...basic,
      evo,
      note:
        binaryPressure >= 0.7
          ? "High system load — architect view simplified."
          : "Architect view generated — read-only structural insight."
    });
  }

  // --------------------------------------------------------------------------
  // DEAD COMPONENTS / ORPHANED ROUTES / DRIFT (via evolutionAPI)
//  - All optional, read-only, owner+architect gated
  // --------------------------------------------------------------------------
  async function getDeadComponents(context, { binaryVitals = {} } = {}) {
    if (!assertOwnerArchitect(context) || !evolutionAPI?.getDeadComponents) {
      return Object.freeze([]);
    }
    const rows = await evolutionAPI.getDeadComponents(context);
    context.logStep?.("aiArchitect: fetched dead components.");
    const binaryPressure = extractBinaryPressure(binaryVitals);

    return Object.freeze(
      binaryPressure >= 0.7 ? rows.slice(0, 20) : rows
    );
  }

  async function getOrphanedRoutes(context, { binaryVitals = {} } = {}) {
    if (!assertOwnerArchitect(context) || !evolutionAPI?.getOrphanedRoutes) {
      return Object.freeze([]);
    }
    const rows = await evolutionAPI.getOrphanedRoutes(context);
    context.logStep?.("aiArchitect: fetched orphaned routes.");
    const binaryPressure = extractBinaryPressure(binaryVitals);

    return Object.freeze(
      binaryPressure >= 0.7 ? rows.slice(0, 20) : rows
    );
  }

  async function getSchemaDriftReport(context, { binaryVitals = {} } = {}) {
    if (!assertOwnerArchitect(context) || !evolutionAPI?.getSchemaDriftReport) {
      return null;
    }
    const report = await evolutionAPI.getSchemaDriftReport(context);
    context.logStep?.("aiArchitect: fetched schema drift report.");
    const binaryPressure = extractBinaryPressure(binaryVitals);

    if (binaryPressure >= 0.7 && report && Array.isArray(report.issues)) {
      return {
        ...report,
        issues: report.issues.slice(0, 20)
      };
    }

    return report;
  }

  // --------------------------------------------------------------------------
  // ARCHITECT ARTERY v3 — symbolic-only, deterministic
  // --------------------------------------------------------------------------
  function architectArtery({ diagnostics = {}, binaryVitals = {} } = {}) {
    const binaryPressure = extractBinaryPressure(binaryVitals);

    const deadCount = diagnostics.deadComponents || 0;
    const orphanCount = diagnostics.orphanRoutes || 0;
    const schemaIssues = diagnostics.schemaIssues || 0;
    const drift = diagnostics.driftDetected === true;

    const localPressure =
      (deadCount ? 0.3 : 0) +
      (orphanCount ? 0.2 : 0) +
      (schemaIssues ? 0.3 : 0) +
      (drift ? 0.4 : 0);

    const pressure = Math.max(
      0,
      Math.min(1, 0.6 * localPressure + 0.4 * binaryPressure)
    );

    return {
      organism: {
        pressure,
        pressureBucket: bucketPressure(pressure)
      },
      architecture: {
        deadComponents: deadCount,
        orphanRoutes: orphanCount,
        schemaIssues,
        drift
      }
    };
  }

  // --------------------------------------------------------------------------
  // PUBLIC ARCHITECT API
  // --------------------------------------------------------------------------
  return Object.freeze({
    meta: ArchitectMeta,
    prewarm,

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
    async getOrganismOverview(context, { binaryVitals = {} } = {}) {
      if (!assertOwnerArchitect(context) || !evolutionAPI?.getOrganismOverview) return null;
      const overview = await evolutionAPI.getOrganismOverview(context);
      const binaryPressure = extractBinaryPressure(binaryVitals);

      if (binaryPressure >= 0.7 && overview && Array.isArray(overview.organs)) {
        return {
          ...overview,
          organs: overview.organs.slice(0, 50)
        };
      }

      return overview;
    },

    async analyzeFile(context, filePath, { binaryVitals = {} } = {}) {
      if (!assertOwnerArchitect(context) || !evolutionAPI?.analyzeFile) return null;
      const stackInfo = mapWebStack(filePath);
      const evo = await evolutionAPI.analyzeFile(context, filePath);
      const binaryPressure = extractBinaryPressure(binaryVitals);

      return {
        stackInfo,
        evo:
          binaryPressure >= 0.7 && evo && Array.isArray(evo.issues)
            ? { ...evo, issues: evo.issues.slice(0, 20) }
            : evo
      };
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
    mapWebStack,

    // ARCHITECT ARTERY
    architectArtery
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
