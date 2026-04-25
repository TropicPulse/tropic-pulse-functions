// ============================================================================
// FILE: tropic-pulse-functions/apps/PULSE-AI/aiArchitect.js
// LAYER: ARCHITECT ORGAN (System + Identity + Architecture Insight)
// ============================================================================
//
// ROLE:
//   • Provide YOU (owner) deep visibility into system logs, identity evolution,
//     security violations, drift, schema issues, unused imports, orphaned routes,
//     dead components, and all design‑time diagnostics.
//   • Integrates with aiEvolution for organism‑wide analysis.
//   • Never exposes UID, resendToken, or identity anchors.
//   • Pure read‑only introspection.
//
// CONTRACT:
//   • READ‑ONLY — no writes, no deletes, no updates.
//   • NO eval(), NO Function(), NO dynamic imports.
//   • Deterministic analysis only.
//   • ZERO IDENTITY LEAKAGE.
// ============================================================================

import { Personas } from "./persona.js";

export function createArchitectAPI(db, evolutionAPI) {

  // --------------------------------------------------------------------------
  // HELPERS
  // --------------------------------------------------------------------------
  function assertOwnerArchitect(context) {
    const isOwner = context.userIsOwner === true;
    const isArchitect = context.personaId === Personas.ARCHITECT;

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
  // PUBLIC API — Owner‑Only System / Identity / Evolution Insight
  // --------------------------------------------------------------------------
  return Object.freeze({

    // ----------------------------------------------------------------------
    // IDENTITY + SECURITY
    // ----------------------------------------------------------------------
    async getIdentityHistory(context, options = {}) {
      const rows = await fetchOwnerCollection(context, "identityHistory", options);
      return Object.freeze(rows);
    },

    async getSecurityViolations(context, options = {}) {
      const rows = await fetchOwnerCollection(context, "securityViolations", options);
      return Object.freeze(rows);
    },

    // ----------------------------------------------------------------------
    // SYSTEM LOGS (DESIGN‑TIME)
    // ----------------------------------------------------------------------
    async getFunctionErrors(context, options = {}) {
      const rows = await fetchOwnerCollection(context, "functionErrors", options);
      return Object.freeze(rows);
    },

    async getEmailLogs(context, options = {}) {
      const rows = await fetchOwnerCollection(context, "emailLogs", options);
      return Object.freeze(rows);
    },

    async getChangeLogs(context, options = {}) {
      const rows = await fetchOwnerCollection(context, "CHANGES", options);
      return Object.freeze(rows);
    },

    async getCacheControl(context, options = {}) {
      const rows = await fetchOwnerCollection(context, "CACHE_CONTROL", options);
      return Object.freeze(rows);
    },

    // ----------------------------------------------------------------------
    // SYSTEM SETTINGS
    // ----------------------------------------------------------------------
    async getSystemSettings(context, options = {}) {
      const rows = await fetchOwnerCollection(context, "settings", options);
      return Object.freeze(rows);
    },

    // ----------------------------------------------------------------------
    // ENVIRONMENT + POWER (OWNER VIEW)
    // ----------------------------------------------------------------------
    async getEnvironmentInternal(context, options = {}) {
      const rows = await fetchOwnerCollection(context, "environment", options);
      return Object.freeze(rows);
    },

    async getPowerInternal(context, options = {}) {
      const rows = await fetchOwnerCollection(context, "power", options);
      return Object.freeze(rows);
    },

    async getPowerHistoryInternal(context, options = {}) {
      const rows = await fetchOwnerCollection(context, "powerHistory", options);
      return Object.freeze(rows);
    },

    async getPulseHistoryInternal(context, options = {}) {
      const rows = await fetchOwnerCollection(context, "pulseHistory", options);
      return Object.freeze(rows);
    },

    // ----------------------------------------------------------------------
    // EVOLUTIONARY ANALYSIS (via aiEvolution)
    // ----------------------------------------------------------------------
    async getOrganismOverview(context) {
      if (!assertOwnerArchitect(context) || !evolutionAPI?.getOrganismOverview) return null;
      return evolutionAPI.getOrganismOverview(context);
    },

    async analyzeFile(context, filePath) {
      if (!assertOwnerArchitect(context) || !evolutionAPI?.analyzeFile) return null;
      return evolutionAPI.analyzeFile(context, filePath);
    },

    async analyzeRoute(context, routeId) {
      if (!assertOwnerArchitect(context) || !evolutionAPI?.analyzeRoute) return null;
      return evolutionAPI.analyzeRoute(context, routeId);
    },

    async analyzeSchema(context, schemaName) {
      if (!assertOwnerArchitect(context) || !evolutionAPI?.analyzeSchema) return null;
      return evolutionAPI.analyzeSchema(context, schemaName);
    }
  });
}
