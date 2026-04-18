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


export async function identity() {
  console.groupCollapsed("%c[PulseIdentity v6.3] Identity Request", "color:#4FC3F7; font-weight:bold;");

  try {
    console.log("%c[Layer] Frontend → Backend (CheckIdentity)", "color:#81D4FA");

    const res = await fetch("/.netlify/functions/CheckIdentity", {
      method: "GET",
      credentials: "include"
    });

    // ------------------------------------------------------------
    // NETWORK FAILURE / BACKEND UNREACHABLE
    // ------------------------------------------------------------
    if (!res.ok) {
      console.warn("%c[Warning] CheckIdentity responded with non-OK status:", "color:#FFB74D", res.status);
      console.groupEnd();
      return null;
    }

    const data = await res.json();

    // ------------------------------------------------------------
    // NULL / EMPTY IDENTITY
    // ------------------------------------------------------------
    if (!data) {
      console.warn("%c[Warning] Identity returned NULL from backend.", "color:#FFB74D");
      console.groupEnd();
      return null;
    }

    // ------------------------------------------------------------
    // LIGHT SHAPE VALIDATION (NO HEALING)
    // ------------------------------------------------------------
    const requiredFields = ["uid", "userEmail", "sessionToken"];

    const missing = requiredFields.filter(f => !data[f]);

    if (missing.length > 0) {
      console.error(
        "%c[Error] Identity missing required fields:",
        "color:#E57373; font-weight:bold;",
        missing
      );
      console.log("%c[Action] Returning null to force backend re-validation on next call.", "color:#EF9A9A");
      console.groupEnd();
      return null;
    }

    // ------------------------------------------------------------
    // IDENTITY LOOKS VALID
    // ------------------------------------------------------------
    console.log("%c[Success] Identity validated (frontend layer).", "color:#81C784");
    console.log("%c[Identity Snapshot]:", "color:#AED581", data);

    console.groupEnd();
    return data;

  } catch (err) {
    // ------------------------------------------------------------
    // HARD FAILURE (NETWORK, JSON, UNKNOWN)
    // ------------------------------------------------------------
    console.error("%c[Critical] Identity fetch failed:", "color:#E57373; font-weight:bold;", err);
    console.groupEnd();
    return null;
  }
}
