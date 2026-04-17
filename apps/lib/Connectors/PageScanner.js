// ============================================================================
// FILE: /apps/lib/Connectors/PageScanner.js
// LAYER: C‑LAYER (PUBLIC FRONTEND API)
// ============================================================================

import { route } from "./router.js";

// ------------------------------------------------------------
// ⭐ PUBLIC API (C‑LAYER)
// ------------------------------------------------------------
export async function getAuth(jwtToken) {
  return await route("auth", { jwtToken });
}

export async function getHook(name, payload = {}) {
  return await route("hook", { name, payload });
}

export async function getMap(mapName) {
  return await route("map", { mapName });
}

export async function callHelper(helperName, payload = {}) {
  return await route("helper", { helperName, payload });
}

// ------------------------------------------------------------
// ⭐ GLOBAL ERROR INTERCEPTOR (A → A2)
// ------------------------------------------------------------
let healingInProgress = false;

window.addEventListener("error", async (event) => {
  if (healingInProgress) return;

  const msg = event.message || "";
  const parsed = parseMissingField(msg);
  if (!parsed) return;

  const { table, field } = parsed;

  healingInProgress = true;

  console.warn("[PageScanner] Missing:", `${table}.${field}`);

  try {
    await route("fetchField", {
      table,
      field,
      message: msg,
      page: window.location.pathname
    });
  } catch (err) {
    console.error("[PageScanner] Router fetch failed:", err);
  }

  healingInProgress = false;

  event.preventDefault();
}, true);

// ------------------------------------------------------------
// ⭐ PARSER: Extract Firestore table + field from JS error
// ------------------------------------------------------------
function parseMissingField(message) {
  let match = message.match(/reading '([^']+)'/);
  if (match) return { table: "Users", field: match[1] };

  match = message.match(/([^ ]+) is not defined/);
  if (match) return { table: "Users", field: match[1] };

  match = message.match(/property '([^']+)'/);
  if (match) return { table: "Users", field: match[1] };

  return null;
}
