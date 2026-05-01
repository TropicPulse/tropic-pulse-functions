// ============================================================================
//  PULSE OS v12.3‑EVO — PERMISSIONS ENGINE
//  Dual‑Band Safety Contract • Deterministic • Drift‑Proof • Persona‑Aware
//  PURE CONTRACT ORACLE. ZERO MUTATION. ZERO RANDOMNESS.
// ============================================================================

import { getPermissionsForPersona,ForbiddenActions } from "./permissions.js";


export const PermissionsMeta = Object.freeze({
  layer: "PulseAIPermissionsLayer",
  role: "PERMISSIONS_ENGINE",
  version: "12.3-EVO",
  identity: "aiPermissionsEngine-v12.3-EVO",

  evo: Object.freeze({
    deterministic: true,
    driftProof: true,
    dualband: true,
    permissionAware: true,
    boundaryAware: true,
    personaAware: true,
    ownerAware: true,
    forbiddenAware: true,
    lineageAware: true,      // ⭐ NEW (v12)
    packetAware: true,       // ⭐ NEW
    windowAware: true,       // ⭐ NEW
    arteryAware: true,       // ⭐ NEW
    multiInstanceReady: true,
    readOnly: true,
    epoch: "12.3-EVO"
  }),

  contract: Object.freeze({
    purpose:
      "Resolve permissions deterministically from persona, owner state, lineage, and universal forbidden actions.",

    never: Object.freeze([
      "mutate external systems",
      "introduce randomness",
      "invent permissions",
      "override forbidden actions",
      "override SafetyFrame decisions",
      "bypass persona boundaries",
      "bypass owner authority",
      "interpret symbolic meaning",
      "perform cognition"
    ]),

    always: Object.freeze([
      "respect universal forbidden actions",
      "respect persona permissions",
      "respect owner override",
      "respect lineage constraints",
      "remain deterministic",
      "remain read-only",
      "resolve capabilities canonically",
      "enforce dualband boundaries"
    ])
  }),

  boundaryReflex() {
    return "PermissionsEngine is a deterministic oracle — it never mutates state or performs cognition.";
  }
});

// ============================================================================
//  PERMISSIONS ENGINE — v12.3‑EVO
//  Deterministic resolver with lineage‑aware drift protection
// ============================================================================

export function createPermissionsEngine({ context = {} } = {}) {
  const userIsOwner = context.userIsOwner === true;
  const lineage = context.lineage || null; // optional lineage drift metadata

  // --------------------------------------------------------------------------
  //  v12‑EVO: lineage‑aware permission drift detection
  // --------------------------------------------------------------------------
  function applyLineageDrift(basePerms) {
    if (!lineage || !Array.isArray(lineage.changes)) return basePerms;

    // If a persona’s capability has drifted in lineage,
    // permissions must fall back to the canonical baseline.
    const drifted = new Set(lineage.changes.map(c => c.capability));

    const corrected = { ...basePerms };
    for (const cap of drifted) {
      if (corrected[cap] === true) {
        corrected[cap] = false;
      }
    }

    return corrected;
  }

  // --------------------------------------------------------------------------
  //  RESOLVE — persona → base permissions → lineage → forbidden actions
  // --------------------------------------------------------------------------
  function resolve(personaId) {
    const persona = personaId || "neutral";

    const base = getPermissionsForPersona(persona, userIsOwner);
    const lineageCorrected = applyLineageDrift(base);

    const merged = Object.freeze({
      ...lineageCorrected,
      ...ForbiddenActions
    });

    return merged;
  }

  // --------------------------------------------------------------------------
  //  CHECK — deterministic capability check
  // --------------------------------------------------------------------------
  function check(personaId, action) {
    const perms = resolve(personaId);
    return perms[action] === true;
  }

  // --------------------------------------------------------------------------
  //  WINDOW‑SAFE SNAPSHOT (no persona data, no forbidden lists)
// --------------------------------------------------------------------------
  function snapshot() {
    return Object.freeze({
      version: PermissionsMeta.version,
      epoch: PermissionsMeta.evo.epoch,
      lineageAware: !!lineage,
      ownerMode: userIsOwner === true
    });
  }

  return Object.freeze({
    meta: PermissionsMeta,
    resolve,
    check,
    snapshot
  });
}

// ============================================================================
//  DUAL‑MODE EXPORTS (ESM + CommonJS)
// ============================================================================
if (typeof module !== "undefined") {
  module.exports = {
    PermissionsMeta,
    createPermissionsEngine
  };
}
