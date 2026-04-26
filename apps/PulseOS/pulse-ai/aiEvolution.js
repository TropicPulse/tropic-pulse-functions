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
//   • Integrates with Architect + Earn + Power + Environment organs.
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
  version: "11.1-EVO",
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

    readOnly: true,
    architectOnly: true,
    multiInstanceReady: true,
    epoch: "11.1-EVO"
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
      "return frozen, identity-safe reports"
    ])
  })
});

import { Personas } from "./persona.js";
import { getOrganismSnapshot } from "./aiDeps.js";

// ============================================================================
//  FACTORY — Evolution Organ (v11.1‑EVO, dual‑band aware)
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
  // PUBLIC API — Evolutionary Insight (v11.1‑EVO)
  // --------------------------------------------------------------------------
  return Object.freeze({
    // ----------------------------------------------------------------------
    // FULL ORGANISM OVERVIEW (code + routes + schemas + snapshot)
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

      return Object.freeze({
        meta: AI_EVOLUTION_META,
        unusedImports: unusedImports.map(stripIdentityAnchors),
        orphanedRoutes: orphanedRoutes.map(stripIdentityAnchors),
        deadComponents: deadComponents.map(stripIdentityAnchors),
        schemaDrift: schemaDrift.map(stripIdentityAnchors),
        organDrift: organDrift.map(stripIdentityAnchors),
        pageDrift: pageDrift.map(stripIdentityAnchors),
        pulseEarnDrift,
        snapshotSummary,
        patterns
      });
    },

    // ----------------------------------------------------------------------
    // FILE‑LEVEL ANALYSIS
    // ----------------------------------------------------------------------
    async analyzeFile(context, filePath) {
      if (!assertOwnerArchitect(context)) return null;

      const file = await fsAPI.getFile(filePath);
      if (!file) return null;

      return Object.freeze({
        meta: AI_EVOLUTION_META,
        unusedImports: detectUnusedImports(file),
        references: file.references || [],
        exports: file.exports || [],
        deadPaths: file.deadPaths || [],
        type: file.type || null,
        name: file.name || filePath
      });
    },

    // ----------------------------------------------------------------------
    // ROUTE‑LEVEL ANALYSIS
    // ----------------------------------------------------------------------
    async analyzeRoute(context, routeId) {
      if (!assertOwnerArchitect(context)) return null;

      const route = await routeAPI.getRoute(routeId);
      if (!route) return null;

      return Object.freeze({
        meta: AI_EVOLUTION_META,
        inbound: route.inbound,
        outbound: route.outbound,
        orphaned: !route.inbound && !route.outbound
      });
    },

    // ----------------------------------------------------------------------
    // SCHEMA‑LEVEL ANALYSIS
    // ----------------------------------------------------------------------
    async analyzeSchema(context, schemaName) {
      if (!assertOwnerArchitect(context)) return null;

      const schema = await schemaAPI.getSchema(schemaName);
      if (!schema) return null;

      const drift = detectSchemaDrift([schema]);

      return Object.freeze({
        meta: AI_EVOLUTION_META,
        schema: stripIdentityAnchors(schema),
        drift
      });
    },

    // ----------------------------------------------------------------------
    // ORGANISM STATE (dual‑band snapshot)
// ----------------------------------------------------------------------
    async getOrganismState(context) {
      if (!assertOwnerArchitect(context)) return null;

      const snapshot = getOrganismSnapshot(dualBand);
      const summary = summarizeSnapshot(snapshot);

      return Object.freeze({
        meta: AI_EVOLUTION_META,
        snapshot,
        summary
      });
    }
  });
}
