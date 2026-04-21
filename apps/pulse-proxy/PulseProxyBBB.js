// ============================================================================
//  PULSE OS v7.7 — THE BLOOD–BRAIN BARRIER (BBB)
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

// ============================================================================
// ⭐ INTERNAL LOGGER SHIM — OSKernel‑local, no external imports
// ============================================================================
function safeLog(...args) {
  try { console.log(...args); } catch {}
}
function safeWarn(...args) {
  try { console.warn(...args); } catch {}
}
function safeError(...args) {
  try { console.error(...args); } catch {}
}

// ============================================================================
// ⭐ VERSION MAP — The Genome of PulseOS (v7.7)
// ============================================================================
export const PulseVersion = {
  identity: "7.7",
  brain: "7.7",
  gpu: "7.7",
  orchestrator: "7.7",
  engine: "7.7",
  optimizer: "7.7",
  synapse: "7.7",
  band: "7.7",
  router: "7.7",
  marketplaces: "7.7",
  telemetry: "7.7",
  limbic: "7.7"
};

// ============================================================================
// ⭐ ROLE MAP — Organ Metaphors (v7.7)
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
// ⭐ LINEAGE MAP — Evolutionary Identity (v7.7)
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
// ⭐ IDENTITY LOADER — BBB Verification Engine (v7.7)
//  LOCAL-FIRST. REMOTE OPTIONAL. ZERO DEPENDENCY.
// ============================================================================
export async function identity() {
  safeLog("[BBB] Identity Request");

  try {
    // ------------------------------------------------------------
    // 1. LOCAL-FIRST IDENTITY (v7.7)
    // ------------------------------------------------------------
    const raw = localStorage.getItem("tp_identity_v7");
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
            version: "7.7",
            mode: "local"
          }
        };
      }

      safeWarn("[BBB] Local identity incomplete", missing);
    }

    // ------------------------------------------------------------
    // 2. REMOTE VERIFICATION OPTIONAL (v7.7)
    // ------------------------------------------------------------
    safeLog("[BBB] Offline mode — remote verification skipped");

    // ------------------------------------------------------------
    // 3. OFFLINE SAFE FALLBACK (v7.7)
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
        version: "7.7",
        mode: "offline-fallback"
      }
    };

    safeLog("[BBB] Returning offline identity fallback");
    return offlineIdentity;

  } catch (err) {
    // ------------------------------------------------------------
    // 4. HARD FAILURE (v7.7)
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
        version: "7.7",
        mode: "crash-fallback"
      }
    };
  }
}
