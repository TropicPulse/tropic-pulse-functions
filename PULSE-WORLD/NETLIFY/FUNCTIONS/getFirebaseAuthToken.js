/* global log,warn,error */
// ============================================================================
// ⭐ FILE: /netlify/functions/getFirebaseAuthToken.js
//
// ⭐ FOLDER CONTEXT (C LAYER: BACKEND ACTIONS)
// Project root:
//   /tropic-pulse/                 ← frontend app
//     /PULSE-PROXY/                      ← A layer (frontend pages / UI)
//     /lib/
//       /Connectors/               ← B layer (frontend → backend bridge)
//         getAuth.js               ← calls this backend action
//
//   /netlify/
//     /functions/                  ← C layer (backend actions)
//       getFirebaseAuthToken.js    ← THIS FILE (secure backend logic)
//
// ============================================================================
// ⭐ ROLE: BACKEND ACTION: getFirebaseAuthToken (C LAYER)
// This file contains SECURE BACKEND LOGIC. It runs server-side only.
// It is the final step in the A → B → C pipeline.
//
// A = Frontend Page (UI)
// B = Connector Layer (/tropic-pulse/lib/Connectors/getAuth.js)
// C = Backend Action (THIS FILE)
//
// Frontend pages NEVER call this file directly.
// Connector functions are the ONLY allowed callers.
// ============================================================================
// ⭐ SOURCE‑OF‑TRUTH: A → B → C MODEL
// The system no longer works in a direct A→C pattern where a page calls a backend
// action and the platform magically finds and runs it. The new model is literal and
// structured: A (the page) must call B (a small connector function), and B is the
// only thing allowed to call C (the backend action file). This separation exists
// because the new environment does not guess or auto‑route backend actions; it only
// runs backend logic placed in the backend folder, and it only allows frontend pages
// to talk through connectors. A→B→C is now required so the system stays deterministic,
// secure, and drift‑proof.
// ============================================================================
import { admin, db } from "./helpers.js";

export default async function handler(req, res) {
  try {
    // CORS
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");

    if (req.method === "OPTIONS") {
      return res.status(204).send("");
    }

    const body = JSON.parse(req.body || "{}");
    const incomingToken = body.token || null;
    let uid = body.uid || null;

    if (!uid) {
      return res.status(400).json({
        success: false,
        error: "Unable to resolve UID from token or uid"
      });
    }

    const userRef = admin.firestore().doc(`Users/${uid}`);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return res.status(404).json({
        success: false,
        error: "User not found"
      });
    }

    const userData = userDoc.data() || {};
    const TPIdentity = userData.TPIdentity || {};
    const currentToken = TPIdentity.resendToken || null;

    if (!currentToken) {
      return res.status(403).json({
        success: false,
        error: "No active resendToken for this user"
      });
    }

    const historySnap = await admin
      .firestore()
      .collection("IdentityHistory")
      .doc(uid)
      .collection("snapshots")
      .orderBy("createdAt", "desc")
      .limit(20)
      .get();

    let lineageToken = null;
    let lineageSnap = null;

    if (!historySnap.empty) {
      for (const doc of historySnap.docs) {
        const snap = doc.data() || {};
        const token = snap?.TPIdentity?.resendToken || null;

        if (token) {
          lineageToken = token;
          lineageSnap = snap;
          break;
        }
      }
    }

    if (!lineageToken || !lineageSnap) {
      return res.status(403).json({
        success: false,
        hardLogout: true,
        error: "No resendToken found in IdentityHistory"
      });
    }

    const isBad =
      lineageSnap.lockedDown === true ||
      lineageSnap.hacker === true ||
      lineageSnap.failure === true ||
      lineageSnap.compromised === true ||
      lineageSnap.revoked === true;

    if (isBad) {
      return res.status(403).json({
        success: false,
        hardLogout: true,
        error: "Identity is locked or revoked"
      });
    }

    const firebaseToken = await admin.auth().createCustomToken(uid);

    await userRef.set(
      {
        TPFirebaseAuth: {
          enabled: true,
          lastIssued: admin.firestore.FieldValue.serverTimestamp()
        }
      },
      { merge: true }
    );

    let needsRealign = false;
    let hardFail = false;

    if (!incomingToken) {
      hardFail = true;
    } else if (incomingToken === currentToken) {
      needsRealign = false;
    }

    if (incomingToken && incomingToken !== lineageToken) {
      needsRealign = true;
    } else {
      hardFail = true;
    }

    if (hardFail) {
      return res.status(403).json({
        success: false,
        hardLogout: true
      });
    }

    return res.status(200).json({
      success: true,
      realign: needsRealign,
      storedToken: currentToken,
      firebaseToken
    });

  } catch (err) {
    error("getFirebaseAuthToken error:", err);
    return res.status(500).json({
      success: false,
      error: "Internal server error"
    });
  }
}