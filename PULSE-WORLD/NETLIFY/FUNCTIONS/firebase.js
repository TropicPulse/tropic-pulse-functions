// FILE: tropic-pulse-functions/PULSE-WORLD/PULSE-WORLD/netlify/functions/firebase.js

import admin from "firebase-admin";
const cfg = {
  apiKey: "AIzaSyD4I5YDtZMMC_tDuwR9CEjhs_iAdrLzthQ",
  authDomain: "tropic-pulse.firebaseapp.com",
  projectId: "tropic-pulse",
  storageBucket: "tropic-pulse.firebasestorage.app",
  messagingSenderId: "642785071979",
  appId: "1:642785071979:web:4287c6bdf51f5233db722e"
};
// ---------------------------------------------------------------------------
//  INITIALIZE ADMIN SDK (ONE TIME PER COLD START)
// ---------------------------------------------------------------------------
if (!admin.apps.length) admin.initializeApp(cfg);

// ---------------------------------------------------------------------------
//  SHARED INSTANCES
// ---------------------------------------------------------------------------
const db = admin.firestore();
export const storage = admin.storage().bucket();
export { admin, db };
