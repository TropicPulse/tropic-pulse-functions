// ============================================================================
// FILE: /apps/netlify/functions/endpoint.js
// PULSE BACKEND ENDPOINT — VERSION 7.8
// “THE EPITHELIAL GATE / IMMUNE BARRIER LAYER”
// ============================================================================
//
// ROLE:
//   • First line of backend defense
//   • Validates incoming signals
//   • Routes to modular backend organs
//   • Falls back to legacy organs
//   • NEW: Accepts logError packets from PageScanner
//   • NEW: Writes logs to Firestore via firebase.js
//
// ============================================================================

import * as LegacyLogic from "./index.js";
import { db } from "./firebase.js";   // ⭐ BACKEND FIREBASE ACCESS

// ------------------------------------------------------------
// ⭐ HUMAN‑READABLE CONTEXT MAP (v7.8)
// ------------------------------------------------------------
const ENDPOINT_CONTEXT = {
  label: "ENDPOINT",
  layer: "C‑Layer",
  role: "Epithelial Gate / Immune Barrier",
  purpose: "Backend Kernel Dispatcher",
  context: "Routes backend organs, logs errors, heals missing organs",
  version: "7.8"
};

// ------------------------------------------------------------
// ⭐ DYNAMIC MODULAR BACKEND ORGAN LOADER
// ------------------------------------------------------------
async function loadModularHandler(type) {
  try {
    const module = await import(`./${type}.js`);
    if (typeof module.handler === "function") {
      return module.handler;
    }
  } catch (err) {
    // Missing organ → fallback
  }
  return null;
}

// ------------------------------------------------------------
// ⭐ FIRESTORE LOG WRITER (v7.8)
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
// ⭐ MAIN HANDLER — THE EPITHELIAL GATE (v7.8)
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
  // ⭐ 0.5 — SPECIAL CASE: logError (PageScanner → Router → Backend)
  // ------------------------------------------------------------
  if (type === "logError") {
    console.log(
      "%c🟪 [ENDPOINT] logError packet received",
      "color:#9C27B0; font-weight:bold;"
    );

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
    console.log(
      `%c🩹 [ENDPOINT] Owner‑aware healing → ${payload.ownerModule}`,
      "color:#FF9800; font-weight:bold;"
    );

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

      console.warn(
        `%c⚠️ [ENDPOINT] Owner module has no heal() → ${payload.ownerModule}`,
        "color:#FFC107; font-weight:bold;"
      );

    } catch (err) {
      console.error(
        "%c🟥 [ENDPOINT] Owner‑aware healing failure",
        "color:#FF5252; font-weight:bold;",
        err
      );

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
  // 1. TRY MODULAR BACKEND ORGAN FIRST
  // ------------------------------------------------------------
  const modularFn = await loadModularHandler(type);

  if (modularFn) {
    console.log(
      `%c🟩 [ENDPOINT] Organ found → ${type}.js`,
      "color:#4CAF50; font-weight:bold;"
    );

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
      console.error(
        "%c🟥 [ENDPOINT] Organ execution failed",
        "color:#FF5252; font-weight:bold;",
        err
      );

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
  // 2. FALLBACK TO LEGACY ORGAN
  // ------------------------------------------------------------
  console.warn(
    `%c🟨 [ENDPOINT] No organ found → Falling back to legacy index.js`,
    "color:#FFC107; font-weight:bold;"
  );

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
      console.error(
        "%c🟥 [ENDPOINT] Legacy organ failure",
        "color:#FF5252; font-weight:bold;",
        err
      );

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
  // 3. NOTHING FOUND → IMMUNE HEALING PATH
  // ------------------------------------------------------------
  console.error(
    `%c🟥 [ENDPOINT] Unknown organ request → ${type}`,
    "color:#FF5252; font-weight:bold;"
  );

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
