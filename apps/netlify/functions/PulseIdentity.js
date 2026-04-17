// ============================================================================
// PulseIdentity.js
// Universal identity loader + backend healer + logout handler
// ============================================================================

// -----------------------------
// INTERNAL STATE
// -----------------------------
let _identity = null;
let _token    = null;
let _loading  = false;

// -----------------------------
// TIME SYNC (server → client offset)
// -----------------------------
let __serverTimeOffset = 0;

function setServerNow(serverNowMs) {
  __serverTimeOffset = serverNowMs - Date.now();
}

function setServerOffset(offsetMs) {
  __serverTimeOffset = offsetMs;
}

function nowMs() {
  return Date.now() + __serverTimeOffset;
}

// -----------------------------
// HELPERS
// -----------------------------
function mark(msg) {
  console.log("[PulseIdentity]", msg);
}

function loadLocal() {
  try {
    _identity = JSON.parse(localStorage.getItem("tp_identity_v4") || "{}");
  } catch {
    _identity = null;
  }

  _token = localStorage.getItem("tp_token_v4") || null;
}

function saveLocal(identity, token) {
  if (identity) {
    localStorage.setItem("tp_identity_v4", JSON.stringify(identity));
  }
  if (token) {
    localStorage.setItem("tp_token_v4", token);
  }
}

// -----------------------------
// LOGOUT HANDLING
// -----------------------------
function flagLogout(reason) {
  mark("FLAG LOGOUT: " + reason);
  localStorage.setItem("tp_logout_flag", reason);
}

function clearLocal() {
  localStorage.removeItem("tp_identity_v4");
  localStorage.removeItem("tp_token_v4");
  localStorage.removeItem("tp_device_token_v4");
  localStorage.removeItem("tp_last_active_v4");
}

// -----------------------------
// BACKEND CALLS
// -----------------------------
async function backend(type, payload = {}) {
  const res = await fetch("/.netlify/functions/endpoint", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type, payload })
  });

  return await res.json();
}

// ============================================================================
// MAIN IDENTITY LOADER (UPDATED WITH TIME OFFSET PERSISTENCE)
// ============================================================================
export async function identity() {
  // Prevent double-loading
  if (_loading) {
    return new Promise(resolve => {
      const check = setInterval(() => {
        if (!_loading) {
          clearInterval(check);
          resolve(_identity);
        }
      }, 20);
    });
  }

  _loading = true;
  mark("IDENTITY: START");

  // 1. Load local state
  loadLocal();

  // ⭐ 1A. If identity has saved timeOffsetMs → apply it immediately
  if (_identity && typeof _identity.timeOffsetMs === "number") {
    setServerOffset(_identity.timeOffsetMs);
  }

  // 2. If missing identity or token → backend repair
  if (!_identity || !_identity.uid || !_token) {
    mark("IDENTITY: Missing local identity → backend repair");

    const repaired = await backend("repairIdentity", {
      uid: _identity?.uid || null,
      token: _token || null
    });

    if (!repaired || !repaired.identity) {
      mark("IDENTITY: Backend could not repair → flag logout");
      flagLogout("identity_unrepairable");
      clearLocal();
      _loading = false;
      return null;
    }

    // ⭐ TIME SYNC (serverNow → offset)
    if (repaired.serverNow) {
      const offset = repaired.serverNow - Date.now();
      setServerOffset(offset);

      // Save offset into identity
      repaired.identity.timeOffsetMs = offset;
    }

    _identity = repaired.identity;
    _token    = repaired.token || _token;

    saveLocal(_identity, _token);
    _loading = false;
    return _identity;
  }

  // 3. Validate identity with backend
  mark("IDENTITY: Validating with backend");

  const check = await backend("validateIdentity", {
    uid: _identity.uid,
    token: _token
  });

  if (check.hardLogout) {
    mark("IDENTITY: Backend flagged danger → logout");
    flagLogout("backend_danger");
    clearLocal();
    _loading = false;
    return null;
  }

  // ⭐ TIME SYNC (serverNow → offset)
  if (check.serverNow) {
    const offset = check.serverNow - Date.now();
    setServerOffset(offset);

    // Save offset into identity if missing or changed
    _identity.timeOffsetMs = offset;
    saveLocal(_identity, _token);
  }

  // 4. Backend may return updated identity or token
  if (check.identity) {
    _identity = check.identity;
    saveLocal(_identity, _token);
  }

  if (check.newJwtToken) {
    _token = check.newJwtToken;
    saveLocal(_identity, _token);
  }

  // 5. Update last active
  localStorage.setItem("tp_last_active_v4", nowMs());

  _loading = false;
  return _identity;
}
