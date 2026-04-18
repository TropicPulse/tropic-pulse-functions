// PulseIdentity.js (FRONTEND v6.3)
// ------------------------------------------------------------
// ROLE:
// The universal identity loader for ALL frontend pages.
// This is the "Identity Organ" of the PulseOS frontend layer.
//
// RESPONSIBILITIES:
// - Call backend CheckIdentity (the authority).
// - Validate response shape (light validation only).
// - Detect corruption, emptiness, or malformed identity.
// - Log OS-layer metaphors for debugging.
// - Return a stable identity object or null.
// - NEVER mutate identity locally.
// - NEVER attempt to heal identity locally.
// - NEVER import backend logic.
//
// NOTES:
// Identity is the single highest-value security surface.
// This file must be explicit, loud, and self-diagnosing.
// ------------------------------------------------------------

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
