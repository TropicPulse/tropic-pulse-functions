// ============================================================================
// FILE: tropic-pulse-functions/apps/pulse-earn/Earner.js
// LAYER: THE CITIZEN (Deterministic Worker + Safe Compute Participant)
// ============================================================================
//
// ROLE:
//   THE CITIZEN — Pulse‑Earn’s sandboxed compute participant.
//   • Receives assigned jobs from the Foreman (EarnEngine)
//   • Executes deterministic, rule‑bound compute tasks
//   • Returns safe, structured results
//   • Maintains personal healing metadata
//
// WHY “CITIZEN”?:
//   • Operates inside strict laws (no network, no mutation, no side effects)
//   • Performs labor assigned by the Foreman
//   • Maintains personal state + work history
//   • Represents a single worker in the Pulse‑Earn economy
//
// PURPOSE:
//   • Provide a deterministic, drift‑proof compute engine
//   • Guarantee safe execution of text/math/data/json operations
//   • Maintain healing metadata for Earn healers
//
// CONTRACT:
//   • PURE COMPUTE — no AI layers, no translation, no memory model
//   • READ‑ONLY except for healing metadata
//   • NO eval(), NO Function(), NO dynamic imports
//   • NO network access
//   • NO executing user code
//   • Deterministic output only
//
// SAFETY:
//   • v6.3 upgrade is COMMENTAL ONLY — NO LOGIC CHANGES
//   • All behavior remains identical to pre‑v6.3 Earner
// ============================================================================

// ------------------------------------------------------------
// CITIZEN CONTEXT METADATA
// ------------------------------------------------------------
const EARNER_CONTEXT = {
  layer: "Earner",
  role: "CITIZEN_WORKER",
  purpose: "Execute deterministic, sandboxed compute operations for Earn jobs",
  context: "Safe compute participant + healing metadata"
};

// ------------------------------------------------------------
// Healing Metadata — Citizen Work Log
// ------------------------------------------------------------
const healingState = {
  lastJobType: null,
  lastError: null,
  lastOutput: null,
  cycleCount: 0,
  lastTimestamp: null,
  executionState: "idle", // idle | dispatching | executing | returning | error
  ...EARNER_CONTEXT
};

// ------------------------------------------------------------
// computeWork(job) — Citizen performs assigned labor
// ------------------------------------------------------------
export async function computeWork(job) {
  const start = performance.now();
  healingState.cycleCount++;
  healingState.lastTimestamp = Date.now();
  healingState.executionState = "dispatching";

  try {
    if (!job || !job.type || !job.payload) {
      healingState.lastError = "invalid_job_structure";
      throw new Error("Invalid job structure");
    }

    const { type, payload } = job;
    healingState.lastJobType = type;

    let output;
    healingState.executionState = "executing";

    switch (type) {
      case "text.transform":
        output = textTransform(payload);
        break;

      case "math.compute":
        output = mathCompute(payload);
        break;

      case "data.aggregate":
        output = dataAggregate(payload);
        break;

      case "json.transform":
        output = jsonTransform(payload);
        break;

      default:
        healingState.lastError = "unknown_job_type";
        throw new Error(`Unknown job type: ${type}`);
    }

    healingState.lastOutput = output;
    healingState.lastError = null;
    healingState.executionState = "returning";

    return {
      success: true,
      output,
      durationMs: performance.now() - start,
      ...EARNER_CONTEXT
    };

  } catch (err) {
    healingState.lastError = err.message;
    healingState.executionState = "error";

    return {
      success: false,
      error: err.message,
      durationMs: performance.now() - start,
      ...EARNER_CONTEXT
    };
  }
}

// ------------------------------------------------------------
// SAFE COMPUTE MODULES — Citizen Skillset
// ------------------------------------------------------------
function textTransform({ text = "", mode = "upper" }) {
  switch (mode) {
    case "upper": return text.toUpperCase();
    case "lower": return text.toLowerCase();
    case "reverse": return text.split("").reverse().join("");
    default: throw new Error(`Unknown text mode: ${mode}`);
  }
}

function mathCompute({ operation, values = [] }) {
  switch (operation) {
    case "sum": return values.reduce((a, b) => a + b, 0);
    case "avg": return values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
    case "max": return Math.max(...values);
    case "min": return Math.min(...values);
    default: throw new Error(`Unknown math operation: ${operation}`);
  }
}

function dataAggregate({ items = [], field }) {
  if (!field) throw new Error("Missing field for data.aggregate");
  return items.map(item => item[field]);
}

function jsonTransform({ json, pick }) {
  if (!json || typeof json !== "object") {
    throw new Error("Invalid JSON payload");
  }

  if (!pick) return json;

  const out = {};
  for (const key of pick) {
    if (Object.prototype.hasOwnProperty.call(json, key)) {
      out[key] = json[key];
    }
  }
  return out;
}

// ------------------------------------------------------------
// Export healing metadata — Citizen Work History
// ------------------------------------------------------------
export function getEarnerHealingState() {
  return { ...healingState };
}
