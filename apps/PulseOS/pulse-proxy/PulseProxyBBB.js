// ============================================================================
//  PULSE OS v10.4 — BLOOD–BRAIN BARRIER (BBB)
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
// ⭐ VERSION MAP — The Genome of PulseOS (v10.4)
// ============================================================================
export const PulseVersion = {
  identity:      "10.4",
  brain:         "10.4",
  gpu:           "10.4",
  orchestrator:  "10.4",
  engine:        "10.4",
  optimizer:     "10.4",
  synapse:       "10.4",
  band:          "10.4",
  router:        "10.4",
  marketplaces:  "10.4",
  telemetry:     "10.4",
  limbic:        "10.4",
  governor:      "10.4",
  understanding: "10.4",
  proxy:         "10.4",
  earn:          "10.4",
  send:          "10.4"
};


// ============================================================================
// ⭐ ROLE MAP — Organ Metaphors (v10.4)
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
// ⭐ LINEAGE MAP — Evolutionary Identity (v10.4)
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
// ⭐ MODE MAP — A/B/A Routing Modes (v10.4)
//  A = Local, B = Remote, A = Offline‑safe fallback
// ============================================================================
const IdentityModes = {
  LOCAL_ONLY:   "local-only",    // A
  HYBRID:       "hybrid",        // A → B → A
  OFFLINE_ONLY: "offline-only"   // A (no remote, immediate offline)
};

const IDENTITY_STORAGE_KEYS = ["tp_identity_v10", "tp_identity_v9"];


// ============================================================================
// ⭐ HELPERS — Local + Remote
// ============================================================================

function loadLocalIdentity() {
  if (typeof localStorage === "undefined") return null;

  for (const key of IDENTITY_STORAGE_KEYS) {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) continue;

      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object") continue;

      const required = ["uid", "userEmail", "sessionToken"];
      const missing = required.filter((f) => !parsed[f]);

      if (missing.length === 0) {
        return {
          ...parsed,
          trustedDevice: parsed.trustedDevice === true,
          storageKey: key
        };
      }

      safeWarn("[BBB] Local identity incomplete", { key, missing });
    } catch (err) {
      safeWarn("[BBB] Local identity parse failed", { key, err: String(err) });
    }
  }

  return null;
}

async function verifyRemoteIdentity(localIdentity) {
  if (typeof fetch !== "function") {
    safeWarn("[BBB] Remote verification unavailable (no fetch)");
    return null;
  }

  try {
    const res = await fetch("/api/pulse/identity/verify", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        uid: localIdentity?.uid ?? null,
        sessionToken: localIdentity?.sessionToken ?? null
      })
    });

    if (!res.ok) {
      safeWarn("[BBB] Remote verification failed", { status: res.status });
      return null;
    }

    const data = await res.json().catch(() => ({}));

    const required = ["uid", "userEmail", "sessionToken"];
    const missing = required.filter((f) => !data[f]);

    if (missing.length > 0) {
      safeWarn("[BBB] Remote identity incomplete", { missing });
      return null;
    }

    // Optionally refresh local cache (best‑effort, no throw)
    try {
      if (typeof localStorage !== "undefined") {
        localStorage.setItem(
          "tp_identity_v10",
          JSON.stringify({
            uid: data.uid,
            userEmail: data.userEmail,
            sessionToken: data.sessionToken,
            trustedDevice: data.trustedDevice === true
          })
        );
      }
    } catch (_) {}

    return {
      ...data,
      trustedDevice: data.trustedDevice === true
    };

  } catch (err) {
    safeWarn("[BBB] Remote verification error", String(err));
    return null;
  }
}

function buildOfflineIdentity(reason, mode) {
  return {
    uid: null,
    userEmail: null,
    sessionToken: null,
    trustedDevice: false,
    offline: true,
    reason,
    lineage: PulseLineage.identity,
    meta: {
      layer: "PulseIdentity",
      version: PulseVersion.identity,
      mode
    }
  };
}


// ============================================================================
// ⭐ IDENTITY LOADER — BBB Verification Engine (v10.4)
//  A/B/A ROUTING:
//    A: Local‑first
//    B: Remote verify (HYBRID only)
//    A: Offline‑safe fallback
//  ZERO IMPORTS. TRUSTED DEVICE PERSISTENCE.
// ============================================================================
//
//  identity() usage:
//    • identity()                      → default HYBRID
//    • identity("local-only")         → A only
//    • identity("offline-only")       → offline fallback only
//    • identity({ mode: "hybrid" })   → explicit
//
export async function identity(modeOrOptions) {
  safeLog("[BBB] Identity Request (v10.4)");

  let mode = IdentityModes.HYBRID;

  if (typeof modeOrOptions === "string") {
    mode = modeOrOptions;
  } else if (modeOrOptions && typeof modeOrOptions === "object") {
    if (modeOrOptions.mode && typeof modeOrOptions.mode === "string") {
      mode = modeOrOptions.mode;
    }
  }

  if (!Object.values(IdentityModes).includes(mode)) {
    safeWarn("[BBB] Invalid mode, defaulting to HYBRID", { mode });
    mode = IdentityModes.HYBRID;
  }

  try {
    // ------------------------------------------------------------
    // A. LOCAL‑FIRST IDENTITY (v10.4)
    // ------------------------------------------------------------
    const localIdentity = loadLocalIdentity();

    if (localIdentity) {
      safeLog("[BBB] Local identity validated (A‑path)", {
        storageKey: localIdentity.storageKey
      });

      const base = {
        uid: localIdentity.uid,
        userEmail: localIdentity.userEmail,
        sessionToken: localIdentity.sessionToken,
        trustedDevice: localIdentity.trustedDevice,
        lineage: PulseLineage.identity
      };

      // LOCAL_ONLY / OFFLINE_ONLY → return immediately
      if (mode === IdentityModes.LOCAL_ONLY || mode === IdentityModes.OFFLINE_ONLY) {
        return {
          ...base,
          offline: false,
          meta: {
            layer: "PulseIdentity",
            version: PulseVersion.identity,
            mode: "local"
          }
        };
      }

      // HYBRID → attempt remote verify (B‑path)
      const remote = await verifyRemoteIdentity(localIdentity);

      if (remote) {
        safeLog("[BBB] Remote identity verified (B‑path)");

        return {
          ...remote,
          offline: false,
          lineage: PulseLineage.identity,
          meta: {
            layer: "PulseIdentity",
            version: PulseVersion.identity,
            mode: "remote-verified"
          }
        };
      }

      safeWarn("[BBB] Remote verification failed, staying on local (A‑path)");

      return {
        ...base,
        offline: false,
        meta: {
          layer: "PulseIdentity",
          version: PulseVersion.identity,
          mode: "local-fallback"
        }
      };
    }

    safeWarn("[BBB] No valid local identity found");

    // ------------------------------------------------------------
    // B. REMOTE OPTIONAL (HYBRID ONLY) (v10.4)
    // ------------------------------------------------------------
    if (mode === IdentityModes.HYBRID) {
      const remote = await verifyRemoteIdentity(null);

      if (remote) {
        safeLog("[BBB] Remote identity obtained without local cache");

        return {
          ...remote,
          offline: false,
          lineage: PulseLineage.identity,
          meta: {
            layer: "PulseIdentity",
            version: PulseVersion.identity,
            mode: "remote-only"
          }
        };
      }

      safeWarn("[BBB] Remote identity unavailable in HYBRID mode");
    } else {
      safeLog("[BBB] Remote verification skipped due to mode", { mode });
    }

    // ------------------------------------------------------------
    // A. OFFLINE SAFE FALLBACK (final A) (v10.4)
    // ------------------------------------------------------------
    const offlineIdentity = buildOfflineIdentity(
      "No valid local identity and remote verification unavailable.",
      "offline-fallback"
    );

    safeLog("[BBB] Returning offline identity fallback");
    return offlineIdentity;

  } catch (err) {
    // ------------------------------------------------------------
    // HARD FAILURE (v10.4)
    // ------------------------------------------------------------
    safeError("[BBB] Identity load failed", err);

    return buildOfflineIdentity(
      "Identity loader crashed; safe offline fallback.",
      "crash-fallback"
    );
  }
}
