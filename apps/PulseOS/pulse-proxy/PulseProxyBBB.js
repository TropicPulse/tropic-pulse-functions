// ============================================================================
//  PULSE OS v9.3 — BLOOD–BRAIN BARRIER (BBB)
//  Identity Gate • Trust Filter • Core Security Organ
//  PURE VERIFICATION. ZERO IMPORTS. ZERO DRIFT.
//  CENTRALIZED IDENTITY FOR ALL SUBSYSTEMS.
// ============================================================================


// ============================================================================
// ⭐ INTERNAL LOGGER SHIM — Safe, zero‑import
// ============================================================================
function safeLog(...args)  { try { console.log(...args); } catch {} }
function safeWarn(...args) { try { console.warn(...args); } catch {} }
function safeError(...args){ try { console.error(...args); } catch {} }


// ============================================================================
// ⭐ VERSION MAP — The Genome of PulseOS (v9.3)
// ============================================================================
export const PulseVersion = {
  identity:      "9.3",
  brain:         "9.3",
  gpu:           "9.3",
  orchestrator:  "9.3",
  engine:        "9.3",
  optimizer:     "9.3",
  synapse:       "9.3",
  band:          "9.3",
  router:        "9.3",
  marketplaces:  "9.3",
  telemetry:     "9.3",
  limbic:        "9.3",
  governor:      "9.3",
  understanding: "9.3",
  proxy:         "9.3",
  earn:          "9.3",
  send:          "9.3"
};


// ============================================================================
// ⭐ ROLE MAP — Organ Metaphors (v9.3)
// ============================================================================
export const PulseRoles = {
  identity:      "BLOOD–BRAIN BARRIER (BBB)",
  brain:         "ANALYST CORTEX",
  gpu:           "ASTRAL NERVOUS SYSTEM",
  orchestrator:  "BRAINSTEM",
  engine:        "MOTOR CORTEX",
  optimizer:     "GUARDIAN",
  synapse:       "ELECTRICAL JUNCTION",
  band:          "BODY INTERFACE",
  router:        "CONSULATE",
  marketplaces:  "EMBASSY LEDGER",
  telemetry:     "BLOODSTREAM",
  limbic:        "LIMBIC SHADOW",
  governor:      "GLOBAL LOOP GOVERNOR",
  understanding: "CORTICAL OPENER / ORGANISM LOADER",
  proxy:         "ADRENAL SYSTEM",
  earn:          "ECONOMIC ORGAN",
  send:          "TRANSPORT SYSTEM"
};


// ============================================================================
// ⭐ LINEAGE MAP — Evolutionary Identity (v9.3)
// ============================================================================
export const PulseLineage = {
  identity:      "bbb-core",
  brain:         "analysis-core",
  gpu:           "astral-core",
  orchestrator:  "autonomic-core",
  engine:        "execution-core",
  optimizer:     "guardian-core",
  synapse:       "junction-core",
  band:          "interface-core",
  router:        "consulate-core",
  marketplaces:  "embassy-core",
  telemetry:     "bloodstream-core",
  limbic:        "shadow-core",
  governor:      "governor-core",
  understanding: "cortical-opener-core",
  proxy:         "adrenal-core",
  earn:          "economic-core",
  send:          "transport-core"
};


// ============================================================================
// ⭐ IDENTITY LOADER — BBB Verification Engine (v9.3)
//  LOCAL-FIRST. REMOTE OPTIONAL. ZERO DEPENDENCY.
//  TRUSTED DEVICE PERSISTENCE INCLUDED.
// ============================================================================
export async function identity() {
  safeLog("[BBB] Identity Request (v9.3)");

  try {
    // ------------------------------------------------------------
    // 1. LOCAL-FIRST IDENTITY (v9.3)
    // ------------------------------------------------------------
    const raw = typeof localStorage !== "undefined"
      ? localStorage.getItem("tp_identity_v9")
      : null;

    const localIdentity = raw ? JSON.parse(raw) : null;

    if (localIdentity) {
      const required = ["uid", "userEmail", "sessionToken"];
      const missing = required.filter(f => !localIdentity[f]);

      if (missing.length === 0) {
        safeLog("[BBB] Local identity validated (offline-capable)");

        return {
          ...localIdentity,

          // ⭐ TRUST RESTORED IF SAVED
          trustedDevice: localIdentity.trustedDevice === true,

          lineage: PulseLineage.identity,
          meta: {
            layer: "PulseIdentity",
            version: PulseVersion.identity,
            mode: "local"
          }
        };
      }

      safeWarn("[BBB] Local identity incomplete", missing);
    }

    // ------------------------------------------------------------
    // 2. REMOTE VERIFICATION OPTIONAL (v9.3)
    // ------------------------------------------------------------
    safeLog("[BBB] Offline mode — remote verification skipped");

    // ------------------------------------------------------------
    // 3. OFFLINE SAFE FALLBACK (v9.3)
    // ------------------------------------------------------------
    const offlineIdentity = {
      uid: null,
      userEmail: null,
      sessionToken: null,

      // ⭐ DEFAULT: NOT TRUSTED
      trustedDevice: false,

      offline: true,
      reason: "No valid local identity and remote verification disabled.",
      lineage: PulseLineage.identity,
      meta: {
        layer: "PulseIdentity",
        version: PulseVersion.identity,
        mode: "offline-fallback"
      }
    };

    safeLog("[BBB] Returning offline identity fallback");
    return offlineIdentity;

  } catch (err) {
    // ------------------------------------------------------------
    // 4. HARD FAILURE (v9.3)
    // ------------------------------------------------------------
    safeError("[BBB] Identity load failed", err);

    return {
      uid: null,
      userEmail: null,
      sessionToken: null,

      // ⭐ DEFAULT: NOT TRUSTED
      trustedDevice: false,

      offline: true,
      reason: "Identity loader crashed; safe offline fallback.",
      lineage: PulseLineage.identity,
      meta: {
        layer: "PulseIdentity",
        version: PulseVersion.identity,
        mode: "crash-fallback"
      }
    };
  }
}
