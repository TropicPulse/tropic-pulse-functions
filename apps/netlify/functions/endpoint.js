// ============================================================================
// FILE: /apps/netlify/functions/endpoint.js
// PULSE BACKEND ENDPOINT — VERSION 8.0
// “THE EPITHELIAL GATE / IMMUNE BARRIER LAYER”
// ============================================================================
//
// ROLE:
//   • First line of backend defense
//   • Validates incoming signals
//   • Routes to modular backend organs
//   • Evolvable: scans pulse-* backend folders for organs
//   • Falls back to legacy organs
//   • Accepts logError packets from PageScanner
//   • Writes logs to Firestore via firebase.js
//
// ============================================================================

import * as LegacyLogic from "./index.js";
import { db } from "./firebase.js";   // ⭐ BACKEND FIREBASE ACCESS

// ------------------------------------------------------------
// ⭐ HUMAN‑READABLE CONTEXT MAP (v8.0)
// ------------------------------------------------------------
const ENDPOINT_CONTEXT = {
  label: "ENDPOINT",
  layer: "C‑Layer",
  role: "Epithelial Gate / Immune Barrier",
  purpose: "Backend Kernel Dispatcher",
  context: "Routes backend organs, logs errors, heals missing organs",
  version: "8.0"
};

// ------------------------------------------------------------
// ⭐ DYNAMIC MODULAR BACKEND ORGAN LOADER (LOCAL + EVOLVABLE SCAN)
// ------------------------------------------------------------
async function loadModularHandler(type) {

  // ------------------------------------------------------------
  // 1. LOCAL NETLIFY ORGAN
  // ------------------------------------------------------------
  try {
    const module = await import(`./${type}.js`);
    if (typeof module.handler === "function") {
      return module.handler;
    }
  } catch (err) {
    // Local organ missing → continue to evolvable scan
  }

  // ------------------------------------------------------------
  // 2. EVOLVABLE SCAN ACROSS pulse-* BACKEND FOLDERS
  // ------------------------------------------------------------
  const pulseFolders = [
    "../pulse-earn/functions/",
    "../pulse-mesh/functions/",
    "../pulse-os/functions/",
    "../pulse-proxy/functions/"
  ];

  for (const folder of pulseFolders) {
    try {
      const organ = await import(`${folder}${type}.js`);
      if (organ && typeof organ.handler === "function") {
        return organ.handler;
      }
    } catch (err) {
      // Missing organ in this folder → continue scanning
    }
  }

  // ------------------------------------------------------------
  // 3. NOTHING FOUND → RETURN NULL (handler will fallback to legacy)
  // ------------------------------------------------------------
  return null;
}

// ------------------------------------------------------------
// ⭐ FIRESTORE LOG WRITER (v8.0)
// ------------------------------------------------------------
async function writeErrorLog(payload) {
  try {
    await db.collection("GLOBAL_ERROR_LOGS").add({
      ts: Date.now(),
      ...payload,
      ...ENDPOINT_CONTEXT
    });

    console.log(
      "%c🟦 [ENDPOINT] Error logged to Firestore",
      "color:#2196F3; font-weight:bold;"
    );

  } catch (err) {
    console.error(
      "%c🟥 [ENDPOINT] Firestore log write FAILED",
      "color:#F44336; font-weight:bold;",
      err
    );
  }
}

// ------------------------------------------------------------
// ⭐ MAIN HANDLER — THE EPITHELIAL GATE (v8.0, Evolvable Routing)
// ------------------------------------------------------------
export const handler = async (event) => {
  let type;
  let payload = {};

  // ------------------------------------------------------------
  // 0. NORMALIZE INPUT
  // ------------------------------------------------------------
  if (event.httpMethod === "POST") {
    try {
      const body = JSON.parse(event.body || "{}");
      type = body.type;
      payload = body.payload || {};
    } catch (err) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: "Invalid JSON body",
          ...ENDPOINT_CONTEXT
        })
      };
    }
  } else if (event.httpMethod === "GET") {
    type = event.queryStringParameters?.type;
    payload = event.queryStringParameters || {};
  }

  console.log(
    `%c🧬 [ENDPOINT] Incoming → type: ${type}`,
    "color:#00BCD4; font-weight:bold;"
  );

  // ------------------------------------------------------------
  // ⭐ 0.5 — SPECIAL CASE: logError
  // ------------------------------------------------------------
  if (type === "logError") {
    await writeErrorLog(payload);
    return {
      statusCode: 200,
      body: JSON.stringify({
        logged: true,
        ...ENDPOINT_CONTEXT
      })
    };
  }

  // ------------------------------------------------------------
  // ⭐ OWNER‑AWARE HEALING PATH
  // ------------------------------------------------------------
  if (payload.ownerModule) {
    try {
      const organ = await import(`./${payload.ownerModule}.js`);
      if (organ && typeof organ.heal === "function") {
        const result = await organ.heal(payload);
        return {
          statusCode: 200,
          body: JSON.stringify({
            healed: true,
            ownerModule: payload.ownerModule,
            ...result,
            ...ENDPOINT_CONTEXT
          })
        };
      }
    } catch (err) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Owner‑aware healing failed",
          ownerModule: payload.ownerModule,
          details: String(err),
          ...ENDPOINT_CONTEXT
        })
      };
    }
  }

  // ------------------------------------------------------------
  // ⭐ 1. TRY MODULAR BACKEND ORGAN FIRST (LOCAL NETLIFY)
// ------------------------------------------------------------
  const modularFn = await loadModularHandler(type);

  if (modularFn) {
    try {
      const result = await modularFn(payload);
      return {
        statusCode: 200,
        body: JSON.stringify({
          ...result,
          ...ENDPOINT_CONTEXT
        })
      };
    } catch (err) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Backend organ execution failed",
          details: String(err),
          ...ENDPOINT_CONTEXT
        })
      };
    }
  }

  // ------------------------------------------------------------
  // ⭐ 1.5 — EVOLVABLE ROUTING (SECONDARY SCAN)
// ------------------------------------------------------------
  const pulseFolders = [
    "/apps/pulse-ai/",
    "/apps/pulse-design/",
    "/apps/pulse-earn/",
    "/apps/pulse-gpu/",
    "/apps/pulse-mesh/",
    "/apps/pulse-os/",
    "/apps/pulse-proxy/",
    "/apps/pulse-specs/",
    "/apps/pulse-translator/"
  ];

  for (const folder of pulseFolders) {
    try {
      const organ = await import(`${folder}${type}.js`);
      if (organ && typeof organ.handler === "function") {
        const result = await organ.handler(payload);
        return {
          statusCode: 200,
          body: JSON.stringify({
            ...result,
            ...ENDPOINT_CONTEXT
          })
        };
      }
    } catch (err) {
      // continue scanning
    }
  }

  // ------------------------------------------------------------
  // ⭐ 2. FALLBACK TO LEGACY ORGAN
  // ------------------------------------------------------------
  const legacyFn = LegacyLogic[type];

  if (typeof legacyFn === "function") {
    try {
      const result = await legacyFn(payload);
      return {
        statusCode: 200,
        body: JSON.stringify({
          ...result,
          ...ENDPOINT_CONTEXT
        })
      };
    } catch (err) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: "Legacy organ execution failed",
          details: String(err),
          ...ENDPOINT_CONTEXT
        })
      };
    }
  }

  // ------------------------------------------------------------
  // ⭐ 3. IMMUNE HEALING PATH
  // ------------------------------------------------------------
  return {
    statusCode: 200,
    body: JSON.stringify({
      error: "Backend organ not found",
      missingOrgan: type,
      allowPageFallback: true,
      ...ENDPOINT_CONTEXT
    })
  };
};
