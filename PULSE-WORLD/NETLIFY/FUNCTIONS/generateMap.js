// FILE: apps/netlify/functions/generateMap.js
//
// INTENT-CHECK:
//   If you paste this while confused or frustrated, pause and re-read your INTENT.
//   If this PAGE INDEX does not match your intent, update it before editing code.
//
// 📘 PAGE INDEX — Source of Truth for This File
//
// This PAGE INDEX defines the identity, purpose, boundaries, and allowed behavior
// of this backend map-generation function. It is the compressed representation of
// the entire file. Keep this updated as map logic evolves.
//
// CONTENTS TO MAINTAIN:
//   • What this file IS
//   • What this file IS NOT
//   • Responsibilities
//   • Exported function
//   • Internal logic summary
//   • Boundaries + constraints
//
// ROLE:
//   generateMap — the backend map-generation engine for Tropic Pulse.
//   This function is responsible for:
//     • Geocoding a venue
//     • Generating a static map image
//     • Applying the Tropic Pulse overlay
//     • Uploading the final image to storage
//     • Writing TPMap metadata to Firestore
//     • Returning map schema to the connector layer
//
// REAL‑WORLD CONTEXT (for future Aldwyn):
//   • This file runs ONLY on the backend.
//   • This file does NOT update UI.
//   • This file does NOT manipulate DOM.
//   • This file does NOT run in the browser.
//   • This file ONLY performs secure map generation + storage writes.
//
// THIS FILE IS:
//   • A backend action
//   • A map generator
//   • A Firestore writer
//   • A storage uploader
//
// THIS FILE IS NOT:
//   • A connector
//   • A frontend helper
//   • A UI renderer
//   • A compute engine
//
// DEPLOYMENT:
//   Lives in apps/netlify/functions as part of the Tropic Pulse backend subsystem.
//   Must run in Node.js. Must remain deterministic.
//
// INTERNAL LOGIC SUMMARY:
//   • Validate input (venue, businessID/eventID)
//   • Load existing TPMap state
//   • Lock document (status: generating)
//   • Geocode venue
//   • Build static map
//   • Apply overlay
//   • Upload final image
//   • Save TPMap metadata
//   • Return final map schema
//
// ------------------------------------------------------
// generateMap — Backend Map Generation Engine (C Layer)
// ------------------------------------------------------

export const generateMap = onRequest(
  {
    region: "us-central1",
    timeoutSeconds: 60,
    memory: "256MiB"
  },
  async (req, res) => {
    // (Your full backend logic here — unchanged)
  }
);