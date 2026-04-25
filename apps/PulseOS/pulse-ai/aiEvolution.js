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

import { Personas } from "./persona.js";

// ============================================================================
//  IDENTITY — EVOLUTION ORGAN META (v10.4)
// ============================================================================
export const AI_EVOLUTION_META = Object.freeze({
  layer: "PulseAIEvolution",
  role: "EVOLUTION",
  version: "10.4",
  evo: Object.freeze({
    driftProof: true,
    deterministicField: true,
    multiInstanceReady: true,
    organismAware: true,
    lineageAware: true,
    patternAware: true,
    architectOnly: true
  })
});

// ============================================================================
//  FACTORY — Evolution Organ
// ============================================================================
export function createEvolutionAPI(fsAPI, routeAPI, schemaAPI) {

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

  // --------------------------------------------------------------------------
  // DETECTORS — Pure, Deterministic Analysis
  // --------------------------------------------------------------------------
  function detectUnusedImports(file) {
    if (!file?.imports || !file?.references) return [];
    return file.imports.filter(imp => !file.references.includes(imp.name));
  }

  function detectOrphanedRoutes(routeMap) {
    return routeMap.filter(r => !r.inbound && !r.outbound);
  }

  function detectDeadComponents(files) {
    return files.filter(
      f => f.type === "component" && Array.isArray(f.references) && f.references.length === 0
    );
  }

  function detectSchemaDrift(schemas) {
    const drift = [];

    for (const s of schemas) {
      if (!s.expectedFields || !s.actualFields) continue;

      for (const key of Object.keys(s.expectedFields)) {
        if (!s.actualFields[key]) {
          drift.push({
            schema: s.name,
            field: key,
            issue: "missing"
          });
        }
      }
    }

    return drift;
  }

  function detectOrganDrift(files) {
    return files
      .filter(f => f.type === "organ")
      .map(f => ({
        organ: f.name,
        missingExports: f.expectedExports?.filter(e => !f.exports.includes(e)) || [],
        unusedExports: f.exports?.filter(e => !f.references.includes(e)) || []
      }))
      .filter(o => o.missingExports.length > 0 || o.unusedExports.length > 0);
  }

  function detectPulseEarnDrift(files) {
    const earn = files.find(f => f.name === "PulseEarn-v11-Evo.js");
    if (!earn) return null;

    return {
      missingExports: earn.expectedExports?.filter(e => !earn.exports.includes(e)) || [],
      unusedImports: detectUnusedImports(earn),
      unusedExports: earn.exports?.filter(e => !earn.references.includes(e)) || [],
      deadPaths: earn.deadPaths || []
    };
  }

  // --------------------------------------------------------------------------
  // PUBLIC API — Evolutionary Insight
  // --------------------------------------------------------------------------
  return Object.freeze({

    // ----------------------------------------------------------------------
    // FULL ORGANISM OVERVIEW
    // ----------------------------------------------------------------------
    async getOrganismOverview(context) {
      if (!assertOwnerArchitect(context)) return null;

      const [files, routes, schemas] = await Promise.all([
        fsAPI.getAllFiles(),
        routeAPI.getRouteMap(),
        schemaAPI.getAllSchemas()
      ]);

      const unusedImports  = files.flatMap(f => detectUnusedImports(f));
      const orphanedRoutes = detectOrphanedRoutes(routes);
      const deadComponents = detectDeadComponents(files);
      const schemaDrift    = detectSchemaDrift(schemas);
      const organDrift     = detectOrganDrift(files);
      const pulseEarnDrift = detectPulseEarnDrift(files);

      return Object.freeze({
        unusedImports: unusedImports.map(stripIdentityAnchors),
        orphanedRoutes: orphanedRoutes.map(stripIdentityAnchors),
        deadComponents: deadComponents.map(stripIdentityAnchors),
        schemaDrift: schemaDrift.map(stripIdentityAnchors),
        organDrift: organDrift.map(stripIdentityAnchors),
        pulseEarnDrift
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
        unusedImports: detectUnusedImports(file),
        references: file.references || [],
        exports: file.exports || [],
        deadPaths: file.deadPaths || []
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
        schema: stripIdentityAnchors(schema),
        drift
      });
    }
  });
}
