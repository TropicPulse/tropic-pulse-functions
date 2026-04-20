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

import { log, warn, error } from "./PulseLogger.js";

// ============================================================================
//  VERSION MAP — The Genome of PulseOS
// ============================================================================
export const PulseVersion = {
  identity: "7.4",
  brain: "7.4",
  gpu: "7.4",
  orchestrator: "7.4",
  engine: "7.4",
  optimizer: "7.4",
  synapse: "7.4",
  band: "7.4",
  router: "7.4",
  marketplaces: "7.4"
};

// ============================================================================
//  ROLE MAP — The Organ Metaphors (Subsystem Identity)
// ============================================================================
export const PulseRoles = {
  identity: "BLOOD–BRAIN BARRIER (BBB)",
  brain: "ANALYST CORTEX",
  gpu: "ASTRAL NERVOUS SYSTEM",
  orchestrator: "BRAINSTEM",
  engine: "MOTOR CORTEX",
  optimizer: "GUARDIAN",
  synapse: "ELECTRICAL JUNCTION",
  band: "BODY INTERFACE",
  router: "CONSULATE",
  marketplaces: "EMBASSY LEDGER"
};

// ============================================================================
//  COLOR MAP — Console Identity Palette
// ============================================================================
export const PulseColors = {
  identity: "#4FC3F7",
  brain: "#8B5CF6",
  gpu: "#03A9F4",
  orchestrator: "#4ADE80",
  engine: "#F59E0B",
  optimizer: "#03A9F4",
  synapse: "#38BDF8",
  band: "#E11D48",
  router: "#0EA5E9",
  marketplaces: "#14B8A6"
};

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
        return localIdentity;
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
      reason: "No valid local identity and remote verification disabled."
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
      reason: "Identity loader crashed; safe offline fallback."
    };
  }
}
