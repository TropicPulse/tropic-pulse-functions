// ============================================================================
// FILE: tropic-pulse-functions/apps/PULSE-AI/aiEvolution.js
// LAYER: EVOLUTION ORGAN (Organism Awareness + Drift + Growth Detection)
// ============================================================================
//
// ROLE:
//   • Detect unused imports, dead code, orphaned routes, unused components.
//   • Detect schema drift, organ drift, page drift, PulseEarn drift.
//   • Detect evolutionary patterns (“new limb”, “overgrowth”, “starvation”).
//   • Provide owner‑only deep organism insight.
//   • Integrates with Architect + Earn + Power + Environment + DualBand.
//   • Emits evolution packets + recommendations (owner‑only).
//   • Never mutates anything.
//
// CONTRACT:
//   • READ‑ONLY.
//   • ZERO MUTATION.
//   • ZERO RANDOMNESS.
//   • DETERMINISTIC ANALYSIS ONLY.
// ============================================================================

export const AI_EVOLUTION_META = Object.freeze({
  layer: "PulseAIEvolution",
  role: "EVOLUTION_ORGAN",
  version: "11.2-EVO",
  identity: "aiEvolution-v11-EVO",

  evo: Object.freeze({
    driftProof: true,
    deterministic: true,
    dualband: true,

    binaryAware: true,
    symbolicAware: true,
    organismAware: true,
    lineageAware: true,
    patternAware: true,
    schemaAware: true,
    routeAware: true,
    fileAware: true,
    pageAware: true,
    earnAware: true,
    powerAware: true,
    environmentAware: true,

    diagnosticsAware: true,
    driftAware: true,
    repairAware: true,
    packetAware: true,
    recommendationAware: true,

    readOnly: true,
    architectOnly: true,
    multiInstanceReady: true,
    epoch: "11.2-EVO"
  }),

  contract: Object.freeze({
    purpose:
      "Detect unused imports, dead code, orphaned routes, schema drift, organ drift, page drift, PulseEarn drift, and evolutionary patterns across the organism.",
    never: Object.freeze([
      "mutate data",
      "modify external systems",
      "override safety",
      "self-modify",
      "introduce randomness"
    ]),
    always: Object.freeze([
      "analyze deterministically",
      "strip identity anchors",
      "report drift",
      "classify evolutionary patterns",
      "propose diffs conceptually",
      "provide owner-only insight",
      "integrate dual-band organism snapshot",
      "emit evolution packets",
      "return frozen, identity-safe reports"
    ])
  })
});

import { Personas } from "./persona.js";
import { getOrganismSnapshot } from "./aiDeps.js";

// ============================================================================
//  FACTORY — Evolution Organ (v11.2‑EVO, dual‑band + recommendations)
// ============================================================================

export function createEvolutionAPI(fsAPI, routeAPI, schemaAPI, dualBand = null) {
  // --------------------------------------------------------------------------
  // ACCESS CONTROL — Owner + Architect Only
  // --------------------------------------------------------------------------
  function assertOwnerArchitect(context) {
    const allowed =
      context.userIsOwner &&
      context.personaId === Personas.ARCHITECT;

    if (!allowed) {
      context.logStep?.("aiEvolution: access denied (requires owner + architect).");
    }
    return allowed;
  }

  // --------------------------------------------------------------------------
  // HELPERS — Identity‑Safe Cloning
  // --------------------------------------------------------------------------
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

  function summarizeSnapshot(snapshot) {
    if (!snapshot) {
      return Object.freeze({
        present: false,
        binaryBits: 0,
        symbolicKeys: 0
      });
    }

    const binaryStr =
      typeof snapshot === "string"
        ? snapshot
        : typeof snapshot.binary === "string"
        ? snapshot.binary
        : "";

    const symbolic =
      snapshot && typeof snapshot.symbolic === "object"
        ? snapshot.symbolic
        : null;

    const symbolicKeys = symbolic ? Object.keys(symbolic).length : 0;

    return Object.freeze({
      present: true,
      binaryBits: binaryStr.length,
      symbolicKeys
    });
  }

  // --------------------------------------------------------------------------
  // PACKET EMITTER — Evolution Packets
  // --------------------------------------------------------------------------
  function emitEvolutionPacket(type, payload) {
    return Object.freeze({
      meta: AI_EVOLUTION_META,
      packetType: `evo-${type}`,
      timestamp: Date.now(),
      ...payload
    });
  }

  // --------------------------------------------------------------------------
  // DETECTORS — Pure, Deterministic Analysis
  // --------------------------------------------------------------------------
  function detectUnusedImports(file) {
    if (!file?.imports || !file?.references) return [];
    return file.imports.filter(imp => !file.references.includes(imp.name));
  }

  function detectOrphanedRoutes(routeMap) {
    if (!Array.isArray(routeMap)) return [];
    return routeMap.filter(r => !r.inbound && !r.outbound);
  }

  function detectDeadComponents(files) {
    if (!Array.isArray(files)) return [];
    return files.filter(
      f =>
        f.type === "component" &&
        Array.isArray(f.references) &&
        f.references.length === 0
    );
  }

  function detectSchemaDrift(schemas) {
    const drift = [];

    if (!Array.isArray(schemas)) return drift;

    for (const s of schemas) {
      if (!s?.expectedFields || !s?.actualFields) continue;

      for (const key of Object.keys(s.expectedFields)) {
        if (!s.actualFields[key]) {
          drift.push({
            schema: s.name,
            field: key,
            issue: "missing"
          });
        }
      }

      for (const key of Object.keys(s.actualFields)) {
        if (!s.expectedFields[key]) {
          drift.push({
            schema: s.name,
            field: key,
            issue: "unexpected"
          });
        }
      }
    }

    return drift;
  }

  function detectOrganDrift(files) {
    if (!Array.isArray(files)) return [];

    return files
      .filter(f => f.type === "organ")
      .map(f => {
        const missingExports =
          f.expectedExports?.filter(e => !f.exports?.includes(e)) || [];
        const unusedExports =
          f.exports?.filter(e => !f.references?.includes(e)) || [];

        return {
          organ: f.name,
          missingExports,
          unusedExports
        };
      })
      .filter(o => o.missingExports.length > 0 || o.unusedExports.length > 0);
  }

  function detectPageDrift(files) {
    if (!Array.isArray(files)) return [];

    return files
      .filter(f => f.type === "page")
      .map(f => {
        const missingRoutes =
          f.expectedRoutes?.filter(r => !f.routes?.includes(r)) || [];
        const unusedRoutes =
          f.routes?.filter(r => !f.references?.includes(r)) || [];

        return {
          page: f.name,
          missingRoutes,
          unusedRoutes
        };
      })
      .filter(p => p.missingRoutes.length > 0 || p.unusedRoutes.length > 0);
  }

  function detectPulseEarnDrift(files) {
    if (!Array.isArray(files)) return null;

    const earn = files.find(f => f.name === "PulseEarn-v11-Evo.js");
    if (!earn) return null;

    return {
      missingExports:
        earn.expectedExports?.filter(e => !earn.exports?.includes(e)) || [],
      unusedImports: detectUnusedImports(earn),
      unusedExports:
        earn.exports?.filter(e => !earn.references?.includes(e)) || [],
      deadPaths: earn.deadPaths || []
    };
  }

  function detectEvolutionaryPatterns({
    files = [],
    routes = [],
    schemaDrift = [],
    organDrift = [],
    pageDrift = []
  }) {
    const fileCount = Array.isArray(files) ? files.length : 0;
    const routeCount = Array.isArray(routes) ? routes.length : 0;

    const deadComponents = detectDeadComponents(files);
    const orphanedRoutes = detectOrphanedRoutes(routes);

    const newLimb =
      fileCount > 0 &&
      (schemaDrift.length > 0 || organDrift.length > 0 || pageDrift.length > 0);

    const overgrowth =
      deadComponents.length > 10 || orphanedRoutes.length > 10;

    const starvation =
      fileCount > 0 &&
      schemaDrift.length === 0 &&
      organDrift.length === 0 &&
      pageDrift.length === 0 &&
      deadComponents.length === 0 &&
      orphanedRoutes.length === 0;

    return Object.freeze({
      newLimb,
      overgrowth,
      starvation,
      counts: {
        files: fileCount,
        routes: routeCount,
        schemaDrift: schemaDrift.length,
        organDrift: organDrift.length,
        pageDrift: pageDrift.length,
        deadComponents: deadComponents.length,
        orphanedRoutes: orphanedRoutes.length
      }
    });
  }

  // --------------------------------------------------------------------------
  // RECOMMENDATION ENGINE — Conceptual, Non‑Binding
  // --------------------------------------------------------------------------
  function buildRecommendations({
    schemaDrift,
    organDrift,
    pageDrift,
    deadComponents,
    orphanedRoutes,
    pulseEarnDrift,
    patterns
  }) {
    const recs = [];

    if (schemaDrift.length > 0) {
      recs.push({
        type: "schema-drift",
        message:
          "Schema drift detected. Consider adding migrations or aligning expected vs actual fields.",
        count: schemaDrift.length
      });
    }

    if (organDrift.length > 0) {
      recs.push({
        type: "organ-drift",
        message:
          "Organ drift detected. Consider reviewing missing/unused exports for key organs.",
        count: organDrift.length
      });
    }

    if (pageDrift.length > 0) {
      recs.push({
        type: "page-drift",
        message:
          "Page drift detected. Consider aligning routes with page references.",
        count: pageDrift.length
      });
    }

    if (deadComponents.length > 0) {
      recs.push({
        type: "dead-components",
        message:
          "Dead components detected. Consider removing or wiring them to reduce overgrowth.",
        count: deadComponents.length
      });
    }

    if (orphanedRoutes.length > 0) {
      recs.push({
        type: "orphaned-routes",
        message:
          "Orphaned routes detected. Consider removing or connecting them to valid pages.",
        count: orphanedRoutes.length
      });
    }

    if (pulseEarnDrift && (
      pulseEarnDrift.missingExports.length > 0 ||
      pulseEarnDrift.unusedExports.length > 0 ||
      pulseEarnDrift.unusedImports.length > 0 ||
      (pulseEarnDrift.deadPaths || []).length > 0
    )) {
      recs.push({
        type: "earn-drift",
        message:
          "PulseEarn drift detected. Consider reviewing exports, imports, and dead paths in PulseEarn-v11-Evo.js.",
        details: {
          missingExports: pulseEarnDrift.missingExports.length,
          unusedExports: pulseEarnDrift.unusedExports.length,
          unusedImports: pulseEarnDrift.unusedImports.length,
          deadPaths: (pulseEarnDrift.deadPaths || []).length
        }
      });
    }

    if (patterns.newLimb) {
      recs.push({
        type: "pattern-new-limb",
        message:
          "New limb pattern detected. Consider documenting and stabilizing this new structural growth."
      });
    }

    if (patterns.overgrowth) {
      recs.push({
        type: "pattern-overgrowth",
        message:
          "Overgrowth pattern detected. Consider pruning dead components and orphaned routes."
      });
    }

    if (patterns.starvation) {
      recs.push({
        type: "pattern-starvation",
        message:
          "Starvation pattern detected. Consider adding tests or evolution tasks to keep this area healthy."
      });
    }

    return Object.freeze(recs);
  }

  // --------------------------------------------------------------------------
  // PUBLIC API — Evolutionary Insight (v11.2‑EVO)
// --------------------------------------------------------------------------
  return Object.freeze({
    // ----------------------------------------------------------------------
    // FULL ORGANISM OVERVIEW (code + routes + schemas + snapshot + recs)
    // ----------------------------------------------------------------------
    async getOrganismOverview(context) {
      if (!assertOwnerArchitect(context)) return null;

      const [files, routes, schemas] = await Promise.all([
        fsAPI.getAllFiles(),
        routeAPI.getRouteMap(),
        schemaAPI.getAllSchemas()
      ]);

      const unusedImports = files.flatMap(f => detectUnusedImports(f));
      const orphanedRoutes = detectOrphanedRoutes(routes);
      const deadComponents = detectDeadComponents(files);
      const schemaDrift = detectSchemaDrift(schemas);
      const organDrift = detectOrganDrift(files);
      const pageDrift = detectPageDrift(files);
      const pulseEarnDrift = detectPulseEarnDrift(files);

      const snapshot = getOrganismSnapshot(dualBand);
      const snapshotSummary = summarizeSnapshot(snapshot);

      const patterns = detectEvolutionaryPatterns({
        files,
        routes,
        schemaDrift,
        organDrift,
        pageDrift
      });

      const recommendations = buildRecommendations({
        schemaDrift,
        organDrift,
        pageDrift,
        deadComponents,
        orphanedRoutes,
        pulseEarnDrift,
        patterns
      });

      return emitEvolutionPacket("organism-overview", Object.freeze({
        unusedImports: unusedImports.map(stripIdentityAnchors),
        orphanedRoutes: orphanedRoutes.map(stripIdentityAnchors),
        deadComponents: deadComponents.map(stripIdentityAnchors),
        schemaDrift: schemaDrift.map(stripIdentityAnchors),
        organDrift: organDrift.map(stripIdentityAnchors),
        pageDrift: pageDrift.map(stripIdentityAnchors),
        pulseEarnDrift,
        snapshotSummary,
        patterns,
        recommendations
      }));
    },

    // ----------------------------------------------------------------------
    // FILE‑LEVEL ANALYSIS
    // ----------------------------------------------------------------------
    async analyzeFile(context, filePath) {
      if (!assertOwnerArchitect(context)) return null;

      const file = await fsAPI.getFile(filePath);
      if (!file) return null;

      const unusedImports = detectUnusedImports(file);

      return emitEvolutionPacket("file-analysis", Object.freeze({
        unusedImports,
        references: file.references || [],
        exports: file.exports || [],
        deadPaths: file.deadPaths || [],
        type: file.type || null,
        name: file.name || filePath
      }));
    },

    // ----------------------------------------------------------------------
    // ROUTE‑LEVEL ANALYSIS
    // ----------------------------------------------------------------------
    async analyzeRoute(context, routeId) {
      if (!assertOwnerArchitect(context)) return null;

      const route = await routeAPI.getRoute(routeId);
      if (!route) return null;

      const orphaned = !route.inbound && !route.outbound;

      return emitEvolutionPacket("route-analysis", Object.freeze({
        inbound: route.inbound,
        outbound: route.outbound,
        orphaned
      }));
    },

    // ----------------------------------------------------------------------
    // SCHEMA‑LEVEL ANALYSIS
    // ----------------------------------------------------------------------
    async analyzeSchema(context, schemaName) {
      if (!assertOwnerArchitect(context)) return null;

      const schema = await schemaAPI.getSchema(schemaName);
      if (!schema) return null;

      const drift = detectSchemaDrift([schema]);

      return emitEvolutionPacket("schema-analysis", Object.freeze({
        schema: stripIdentityAnchors(schema),
        drift
      }));
    },

    // ----------------------------------------------------------------------
    // ORGANISM STATE (dual‑band snapshot)
// ----------------------------------------------------------------------
    async getOrganismState(context) {
      if (!assertOwnerArchitect(context)) return null;

      const snapshot = getOrganismSnapshot(dualBand);
      const summary = summarizeSnapshot(snapshot);

      return emitEvolutionPacket("organism-state", Object.freeze({
        snapshot,
        summary
      }));
    }
  });
}

// ============================================================================
//  DUAL‑MODE EXPORTS (ESM + CommonJS)
// ============================================================================
export {
  AI_EVOLUTION_META,
  createEvolutionAPI
};

if (typeof module !== "undefined") {
  module.exports = {
    AI_EVOLUTION_META,
    createEvolutionAPI
  };
}
