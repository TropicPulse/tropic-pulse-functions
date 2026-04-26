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
  version: "11.0-EVO",
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
    readOnly: true,
    architectOnly: true,
    multiInstanceReady: true,
    epoch: "v11-EVO"
  }),

  contract: Object.freeze({
    purpose:
      "Detect unused imports, dead code, orphaned routes, schema drift, organ drift, and evolutionary patterns across the organism.",
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
      "propose diffs",
      "provide owner-only insight",
      "integrate dual-band organism snapshot"
    ])
  })
});

import { Personas } from "./persona.js";
import { getOrganismSnapshot } from "./aiDeps.js";

// ============================================================================
//  IDENTITY — EVOLUTION ORGAN META (v11‑EVO)
// ============================================================================


// ============================================================================
//  FACTORY — Evolution Organ (v11‑EVO, dual‑band aware)
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
  // PUBLIC API — Evolutionary Insight (v11‑EVO)
// --------------------------------------------------------------------------
  return Object.freeze({

    // ----------------------------------------------------------------------
    // FULL ORGANISM OVERVIEW (code + routes + schemas)
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
        meta: AI_EVOLUTION_META,
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
        meta: AI_EVOLUTION_META,
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
    // ORGANISM STATE (NEW v11‑EVO — dual‑band snapshot)
// ----------------------------------------------------------------------
    async getOrganismState(context) {
      if (!assertOwnerArchitect(context)) return null;

      const snapshot = getOrganismSnapshot(dualBand);

      return Object.freeze({
        meta: AI_EVOLUTION_META,
        snapshot
      });
    }
  });
}
