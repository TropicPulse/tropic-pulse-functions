// FILE: tropic-pulse-functions/netlify/lib/firebase.js

import admin from "firebase-admin";

// ---------------------------------------------------------------------------
//  INITIALIZE ADMIN SDK (ONE TIME PER COLD START)
// ---------------------------------------------------------------------------
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    storageBucket: "tropic-pulse.firebasestorage.app"
  });
}

// ---------------------------------------------------------------------------
//  SHARED INSTANCES
// ---------------------------------------------------------------------------
export const db = admin.firestore();
export const storage = admin.storage().bucket();
export { admin };
