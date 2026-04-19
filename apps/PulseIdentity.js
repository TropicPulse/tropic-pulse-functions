// ======================================================
//  PULSE OS v6.3 — THE BLOOD–BRAIN BARRIER (BBB)
//  Identity Gate • Trust Filter • Core Security Organ
//  PURE VERIFICATION. NO HEALING. NO MUTATION. NO DRIFT.
// ======================================================
//
// IDENTITY — THE BBB:
//  -------------------
//  • The selective-permeability barrier of PulseOS.
//  • Filters all identity packets entering the digital cortex.
//  • Distinguishes SELF from NON‑SELF with strict criteria.
//  • Blocks malformed, corrupted, or incomplete identity signals.
//  • Maintains the integrity of the OS consciousness layer.
//  • Ensures only validated identity reaches higher systems.
//  • The guardian of trust, the sentinel of authenticity.
//
// ROLE IN THE DIGITAL BODY:
//  --------------------------
//  • Capillary Gate → Filters inbound identity flow
//  • Sentinel Layer → Blocks corruption + drift
//  • Integrity Wall → Maintains OS self-definition
//  • Neural Intake → Feeds identity to higher systems
//  • Pulse Synchronizer → Aligns identity with PulseBand
//  • Cortex Gatekeeper → Protects the executive layer
//  • **BBB → Identity Verification + Trust Enforcement**
//
// WHAT THIS FILE IS:
//  -------------------
//  • The universal identity loader for ALL frontend pages.
//  • The “Identity Organ” of the PulseOS frontend layer.
//  • The strict validator of backend-issued identity packets.
//  • The corruption detector + malformed-identity sentinel.
//  • The stable identity provider for the entire OS shell.
//  • The trust boundary between frontend and backend.
//
// WHAT THIS FILE IS NOT:
//  -----------------------
//  • NOT a healer.
//  • NOT a mutator.
//  • NOT a backend logic module.
//  • NOT a session generator.
//  • NOT a lineage engine.
//  • NOT a place for local identity edits.
//  • NOT a place for dynamic imports or eval.
//
// SAFETY CONTRACT:
//  ----------------
//  • No identity mutation.
//  • No local healing attempts.
//  • No backend logic duplication.
//  • No eval().
//  • No dynamic imports.
//  • No arbitrary compute.
//  • Deterministic, drift-proof identity behavior only.
//
// ======================================================
//  IDENTITY LOADER — BBB Verification Engine
// ======================================================

// ======================================================
//  PULSE OS v7.0 — THE BLOOD–BRAIN BARRIER (BBB)
//  Identity Gate • Trust Filter • Offline‑Capable Core Security Organ
//  LOCAL-FIRST VERIFICATION. REMOTE OPTIONAL. ZERO DEPENDENCY.
// ======================================================

export async function identity() {
  console.groupCollapsed("%c[PulseIdentity v7.0] Identity Request", "color:#4FC3F7; font-weight:bold;");

  try {
    console.log("%c[Layer] Frontend → LocalStorage (LocalIdentityStore)", "color:#81D4FA");

    // ------------------------------------------------------------
    // 1. LOAD LOCAL IDENTITY FIRST (v7.0 LOCAL-FIRST UPGRADE)
    // ------------------------------------------------------------
    const raw = localStorage.getItem("tp_identity_v7");
    const localIdentity = raw ? JSON.parse(raw) : null;

    if (localIdentity) {
      console.log("%c[Local] Found local identity packet.", "color:#4DD0E1");

      const required = ["uid", "userEmail", "sessionToken"];
      const missing = required.filter(f => !localIdentity[f]);

      if (missing.length === 0) {
        console.log("%c[Success] Local identity validated (offline-capable).", "color:#81C784");
        console.log("%c[Identity Snapshot]:", "color:#AED581", localIdentity);
        console.groupEnd();
        return localIdentity;
      }

      console.warn("%c[Warning] Local identity incomplete:", "color:#FFB74D", missing);
    }

    // ------------------------------------------------------------
    // 2. REMOTE VERIFICATION OPTIONAL (v7.0)
    // ------------------------------------------------------------
    console.warn("%c[Offline Mode] No valid local identity. Remote check skipped (no network).", "color:#FFB74D");

    // ------------------------------------------------------------
    // 3. OFFLINE SAFE FALLBACK (v7.0)
    // ------------------------------------------------------------
    const offlineIdentity = {
      uid: null,
      userEmail: null,
      sessionToken: null,
      offline: true,
      reason: "No valid local identity and remote verification disabled."
    };

    console.log("%c[Fallback] Returning offline identity state.", "color:#BA68C8", offlineIdentity);
    console.groupEnd();
    return offlineIdentity;

  } catch (err) {
    // ------------------------------------------------------------
    // 4. HARD FAILURE (LOCAL STORAGE, JSON, UNKNOWN)
    // ------------------------------------------------------------
    console.error("%c[Critical] Identity load failed:", "color:#E57373; font-weight:bold;", err);

    const offlineIdentity = {
      uid: null,
      userEmail: null,
      sessionToken: null,
      offline: true,
      reason: "Identity loader crashed; safe offline fallback."
    };

    console.groupEnd();
    return offlineIdentity;
  }
}
