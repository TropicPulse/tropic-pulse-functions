// FILE: tropic-pulse-functions/netlify/lib/firebase.js
//
// ROLE:
//   Centralized Firebase Admin initializer for Tropic Pulse.
//   Provides shared Firestore (`db`) and Storage (`storage`) instances.
//   Ensures Firebase Admin initializes exactly once per Netlify cold start.
//   Pure logic module — no routing, no handlers, no side effects.
//
// DEPLOYMENT:
//   Runs ONLY in backend (Netlify Functions).
//   Frontend must NEVER import this file.
//   Firebase Web SDK must NEVER be used in backend.
//
// RULES:
//   • ESM ONLY
//   • No default exports
//   • No reinitialization
//   • No Web SDK config (apiKey, authDomain, etc.)
//   • Admin SDK auto‑discovers credentials in Netlify
//
// SAFETY:
//   • Never log credentials
//   • Never mutate admin.app()
//   • Never mutate db or storage

import admin from "firebase-admin";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
// ---------------------------------------------------------------------------
//  INITIALIZE ADMIN SDK (ONE TIME PER COLD START)
// ---------------------------------------------------------------------------
if (!admin.apps.length) {
  admin.initializeApp({
    storageBucket: "tropic-pulse.firebasestorage.app"
  });
}

// ---------------------------------------------------------------------------
//  SHARED INSTANCES
// ---------------------------------------------------------------------------
export const db = admin.firestore();
export const storage = admin.storage().bucket();
export { admin };
