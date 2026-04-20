// ============================================================================
//  PULSE OS v7.4 — THE BLOOD–BRAIN BARRIER (BBB)
//  Identity Gate • Trust Filter • Core Security Organ
//  PURE VERIFICATION. NO HEALING. NO MUTATION. NO DRIFT.
//  CENTRALIZED IDENTITY FOR ALL SUBSYSTEMS.
// ============================================================================
//
//  THIS FILE IS THE SOURCE OF TRUTH FOR:
//
//   • Subsystem versions
//   • Subsystem roles (metaphors)
//   • Subsystem colors (console identity)
//   • Subsystem lineage
//   • Identity loader (BBB)
//   • Offline-safe identity fallback
//
//  ALL OTHER FILES MUST IMPORT FROM HERE.
//  NO OTHER FILE DEFINES VERSION / ROLE / COLOR / METAPHOR.
// ============================================================================

import {PulseVersion, PulseRoles, log, warn, error } from "./PulseLogger.js";
// ============================================================================
//  LINEAGE MAP — Evolutionary Identity
// ============================================================================
export const PulseLineage = {
  identity: "bbb-core",
  brain: "analysis-core",
  gpu: "astral-core",
  orchestrator: "autonomic-core",
  engine: "execution-core",
  optimizer: "guardian-core",
  synapse: "junction-core",
  band: "interface-core",
  router: "consulate-core",
  marketplaces: "embassy-core"
};
// ============================================================================
//  IDENTITY LOADER — BBB Verification Engine (v7.4)
//  LOCAL-FIRST. REMOTE OPTIONAL. ZERO DEPENDENCY.
// ============================================================================
export async function identity() {
  log("identity", "Identity Request");

  try {
    // ------------------------------------------------------------
    // 1. LOCAL-FIRST IDENTITY (v7.4)
    // ------------------------------------------------------------
    const raw = localStorage.getItem("tp_identity_v7");
    const localIdentity = raw ? JSON.parse(raw) : null;

    if (localIdentity) {
      const required = ["uid", "userEmail", "sessionToken"];
      const missing = required.filter(f => !localIdentity[f]);

      if (missing.length === 0) {
        log("identity", "Local identity validated (offline-capable)");
        return {
          ...localIdentity,
          lineage: PulseLineage.identity
        };

      }

      warn("identity", "Local identity incomplete", missing);
    }

    // ------------------------------------------------------------
    // 2. REMOTE VERIFICATION OPTIONAL (v7.4)
    // ------------------------------------------------------------
    log("identity", "Offline mode — remote verification skipped");

    // ------------------------------------------------------------
    // 3. OFFLINE SAFE FALLBACK
    // ------------------------------------------------------------
    const offlineIdentity = {
      uid: null,
      userEmail: null,
      sessionToken: null,
      offline: true,
      reason: "No valid local identity and remote verification disabled.",
      lineage: PulseLineage.identity
    };


    log("identity", "Returning offline identity fallback");
    return offlineIdentity;

  } catch (err) {
    // ------------------------------------------------------------
    // 4. HARD FAILURE
    // ------------------------------------------------------------
    error("identity", "Identity load failed", err);

    return {
      uid: null,
      userEmail: null,
      sessionToken: null,
      offline: true,
      reason: "Identity loader crashed; safe offline fallback.",
      lineage: PulseLineage.identity
    };

  }
}
