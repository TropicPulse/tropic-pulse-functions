// ============================================================================
//  PulseOSGovernor.js — Global Loop, Re-entry & Multi-Instance Governor (v3.1)
//  - No imports
//  - No routing
//  - No sending
//  - Pure guards + dynamic multi-instance slicing context
//  - Optional EarnReflex hook (if window.PulseEarnReflex is present)
// ============================================================================

const activeOrgans     = new Set();   // e.g. "EarnSystem", "PulseSendSystem"
const activeModules    = new Set();   // e.g. "PulseEarnLegacyPulse"
const pulseVisits      = new Map();   // pulseId -> Set(organName)
const instanceRegistry = new Map();   // instanceKey -> { count }

// Depth limits
const MAX_LINEAGE_DEPTH   = 16;
const MAX_RETURN_TO_DEPTH = 8;
const MAX_FALLBACK_DEPTH  = 1;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function getPulseId(pulseOrImpulse) {
  return (
    pulseOrImpulse?.pulseId ||
    pulseOrImpulse?.id ||
    pulseOrImpulse?.tickId ||
    pulseOrImpulse?.jobId ||
    "UNKNOWN_PULSE"
  );
}

function getLineageDepth(pulseOrImpulse) {
  const lineage = pulseOrImpulse?.lineage || pulseOrImpulse?.parentLineage || [];
  return Array.isArray(lineage) ? lineage.length : 0;
}

function getReturnToDepth(pulseOrImpulse) {
  const rt = pulseOrImpulse?.returnTo;
  if (!rt) return 0;
  if (Array.isArray(rt)) return rt.length;
  return 1;
}

function getFallbackDepth(pulseOrImpulse) {
  const fb = pulseOrImpulse?.fallback || pulseOrImpulse?.fallbackDepth;
  if (!fb) return 0;
  if (typeof fb === "number") return fb;
  return 1;
}

// Multi-instance identity: where we group instances for slicing
function getInstanceKey(organName, pulseOrImpulse) {
  const pulseId = getPulseId(pulseOrImpulse);
  return `${organName}::${pulseId}`;
}

// Optional: side-attach EarnReflex if present on window
async function maybeEmitEarnReflex(event, pulseOrImpulse, instanceContext) {
  try {
    if (typeof window === "undefined") return;
    const reflex = window.PulseEarnReflex;
    if (!reflex || typeof reflex.fromGovernorEvent !== "function") return;

    await reflex.fromGovernorEvent(event, pulseOrImpulse, instanceContext);
  } catch {
    // fail-open: governor must never break
  }
}

// ---------------------------------------------------------------------------
//  Organ-level guard: re-entry, per-pulse visits, multi-instance context
// ---------------------------------------------------------------------------
// fn(instanceContext) → result
export async function withOrganGuard(organName, pulseOrImpulse, fn) {
  const pulseId     = getPulseId(pulseOrImpulse);
  const instanceKey = getInstanceKey(organName, pulseOrImpulse);

  // 0. Multi-instance registry — track how many instances have spun up
  let state = instanceRegistry.get(instanceKey);
  if (!state) {
    state = { count: 0 };
    instanceRegistry.set(instanceKey, state);
  }
  state.count += 1;

  const instanceIndex   = state.count - 1; // 0-based index
  const totalInstances  = state.count;     // current known count for this key
  const instanceContext = {
    organ: organName,
    pulseId,
    instanceKey,
    instanceIndex,
    totalInstances
  };

  // Helper to build a governor event object
  function buildEvent(reason, extra = {}) {
    return {
      ok: false,
      blocked: true,
      reason,
      organ: organName,
      pulseId,
      instanceContext,
      ...extra
    };
  }

  // 1. Block organ re-entry (stack-based)
  if (activeOrgans.has(organName)) {
    const event = buildEvent("organ_reentry");
    await maybeEmitEarnReflex(event, pulseOrImpulse, instanceContext);
    return event;
  }

  // 2. Block per-pulse per-organ re-visits
  let visits = pulseVisits.get(pulseId);
  if (!visits) {
    visits = new Set();
    pulseVisits.set(pulseId, visits);
  } else if (visits.has(organName)) {
    const event = buildEvent("organ_already_visited_for_pulse");
    await maybeEmitEarnReflex(event, pulseOrImpulse, instanceContext);
    return event;
  }

  // 3. Lineage / returnTo / fallback depth guards
  const lineageDepth = getLineageDepth(pulseOrImpulse);
  if (lineageDepth > MAX_LINEAGE_DEPTH) {
    const event = buildEvent("lineage_depth_exceeded", { lineageDepth });
    await maybeEmitEarnReflex(event, pulseOrImpulse, instanceContext);
    return event;
  }

  const returnToDepth = getReturnToDepth(pulseOrImpulse);
  if (returnToDepth > MAX_RETURN_TO_DEPTH) {
    const event = buildEvent("return_to_depth_exceeded", { returnToDepth });
    await maybeEmitEarnReflex(event, pulseOrImpulse, instanceContext);
    return event;
  }

  const fallbackDepth = getFallbackDepth(pulseOrImpulse);
  if (fallbackDepth > MAX_FALLBACK_DEPTH) {
    const event = buildEvent("fallback_depth_exceeded", { fallbackDepth });
    await maybeEmitEarnReflex(event, pulseOrImpulse, instanceContext);
    return event;
  }

  // 4. Mark organ active + visited
  activeOrgans.add(organName);
  visits.add(organName);

  try {
    const result = await fn(instanceContext);
    return {
      ok: true,
      blocked: false,
      organ: organName,
      pulseId,
      instanceContext,
      result
    };
  } catch (error) {
    return {
      ok: false,
      blocked: false,
      organ: organName,
      pulseId,
      instanceContext,
      error
    };
  } finally {
    activeOrgans.delete(organName);
  }
}

// ---------------------------------------------------------------------------
//  Module init guard: prevent circular module loads
// ---------------------------------------------------------------------------
export async function withModuleInitGuard(moduleName, fn) {
  if (activeModules.has(moduleName)) {
    return {
      ok: false,
      blocked: true,
      reason: "module_init_reentry",
      module: moduleName
    };
  }

  activeModules.add(moduleName);
  try {
    const result = await fn();
    return {
      ok: true,
      blocked: false,
      module: moduleName,
      result
    };
  } catch (error) {
    return {
      ok: false,
      blocked: false,
      module: moduleName,
      error
    };
  } finally {
    activeModules.delete(moduleName);
  }
}
