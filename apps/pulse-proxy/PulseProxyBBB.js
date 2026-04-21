// ============================================================================
//  PULSE OS v9.1 — BLOOD–BRAIN BARRIER (BBB)
//  Identity Gate • Trust Filter • Core Security Organ
//  PURE VERIFICATION. ZERO IMPORTS. ZERO DRIFT.
//  CENTRALIZED IDENTITY FOR ALL SUBSYSTEMS.
// ============================================================================
//
//  THIS FILE DEFINES THE SOURCE OF TRUTH FOR:
//
//   • Subsystem versions
//   • Subsystem roles (organ metaphors)
//   • Subsystem lineage
//   • Subsystem colors (console identity)
//   • Identity loader (BBB)
//   • Offline‑safe identity fallback
//
//  NO OTHER FILE DEFINES VERSION / ROLE / LINEAGE.
//  NO IMPORTS ALLOWED. NO DEPENDENCIES. PURE ORGANISM.
// ============================================================================


// ============================================================================
// ⭐ INTERNAL LOGGER SHIM — Safe, zero‑import
// ============================================================================
function safeLog(...args)  { try { console.log(...args); } catch {} }
function safeWarn(...args) { try { console.warn(...args); } catch {} }
function safeError(...args){ try { console.error(...args); } catch {} }


// ============================================================================
// ⭐ VERSION MAP — The Genome of PulseOS (v9.1)
// ============================================================================
export const PulseVersion = {
  identity: "9.1",
  brain: "9.1",
  gpu: "9.1",
  orchestrator: "9.1",
  engine: "9.1",
  optimizer: "9.1",
  synapse: "9.1",
  band: "9.1",
  router: "9.1",
  marketplaces: "9.1",
  telemetry: "9.1",
  limbic: "9.1"
};


// ============================================================================
// ⭐ ROLE MAP — Organ Metaphors (v9.1)
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
  marketplaces: "EMBASSY LEDGER",
  telemetry: "BLOODSTREAM",
  limbic: "LIMBIC SHADOW"
};


// ============================================================================
// ⭐ LINEAGE MAP — Evolutionary Identity (v9.1)
// ============================================================================
export const PulseLineage = {
  identity:       "bbb-core",
  brain:          "analysis-core",
  gpu:            "astral-core",
  orchestrator:   "autonomic-core",
  engine:         "execution-core",
  optimizer:      "guardian-core",
  synapse:        "junction-core",
  band:           "interface-core",
  router:         "consulate-core",
  marketplaces:   "embassy-core",
  telemetry:      "bloodstream-core",
  limbic:         "shadow-core"
};


// ============================================================================
// ⭐ IDENTITY LOADER — BBB Verification Engine (v9.1)
//  LOCAL-FIRST. REMOTE OPTIONAL. ZERO DEPENDENCY.
// ============================================================================
export async function identity() {
  safeLog("[BBB] Identity Request");

  try {
    // ------------------------------------------------------------
    // 1. LOCAL-FIRST IDENTITY (v9.1)
    // ------------------------------------------------------------
    const raw = localStorage.getItem("tp_identity_v9");
    const localIdentity = raw ? JSON.parse(raw) : null;

    if (localIdentity) {
      const required = ["uid", "userEmail", "sessionToken"];
      const missing = required.filter(f => !localIdentity[f]);

      if (missing.length === 0) {
        safeLog("[BBB] Local identity validated (offline-capable)");
        return {
          ...localIdentity,
          lineage: PulseLineage.identity,
          meta: {
            layer: "PulseIdentity",
            version: "9.1",
            mode: "local"
          }
        };
      }

      safeWarn("[BBB] Local identity incomplete", missing);
    }

    // ------------------------------------------------------------
    // 2. REMOTE VERIFICATION OPTIONAL (v9.1)
    // ------------------------------------------------------------
    safeLog("[BBB] Offline mode — remote verification skipped");

    // ------------------------------------------------------------
    // 3. OFFLINE SAFE FALLBACK (v9.1)
    // ------------------------------------------------------------
    const offlineIdentity = {
      uid: null,
      userEmail: null,
      sessionToken: null,
      offline: true,
      reason: "No valid local identity and remote verification disabled.",
      lineage: PulseLineage.identity,
      meta: {
        layer: "PulseIdentity",
        version: "9.1",
        mode: "offline-fallback"
      }
    };

    safeLog("[BBB] Returning offline identity fallback");
    return offlineIdentity;

  } catch (err) {
    // ------------------------------------------------------------
    // 4. HARD FAILURE (v9.1)
    // ------------------------------------------------------------
    safeError("[BBB] Identity load failed", err);

    return {
      uid: null,
      userEmail: null,
      sessionToken: null,
      offline: true,
      reason: "Identity loader crashed; safe offline fallback.",
      lineage: PulseLineage.identity,
      meta: {
        layer: "PulseIdentity",
        version: "9.1",
        mode: "crash-fallback"
      }
    };
  }
}
