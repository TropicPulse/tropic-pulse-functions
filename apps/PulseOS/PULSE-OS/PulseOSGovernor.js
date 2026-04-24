// ============================================================================
//  PulseOSGovernor.v11.js
//  Global Loop, Re-entry & Multi-Instance Governor (v11-Evo)
//  - No imports
//  - No routing
//  - No sending
//  - Pure guards + dynamic multi-instance slicing context
//  - Optional EarnReflex hook (window.PulseEarnReflex)
//  - Optional ReflexRouter hook (window.PulseEarnReflexRouter)
//  - Dual-band aware (symbolic + binary pulses)
// ============================================================================

export const GOVERNOR_CONTEXT_V11 = {
  organ: "PulseOSGovernor",
  layer: "C-Layer",
  role: "Global Loop & Re-entry Governor",
  version: "11.0-Evo",
  generation: "v11",
  organism: "PulseOS",
  evo: {
    dualMode: true,
    symbolicAware: true,
    binaryAware: true,
    driftProof: true,
    deterministicNeuron: true,
    unifiedAdvantageField: true,
    multiInstanceReady: true,
    zeroNetwork: true,
    zeroBackend: true,
    zeroRouting: true,
    zeroMarketplace: true,
    zeroTiming: true
  }
};

const activeOrgans     = new Set();
const activeModules    = new Set();
const pulseVisits      = new Map();
const instanceRegistry = new Map();

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

function getInstanceKey(organName, pulseOrImpulse) {
  const pulseId = getPulseId(pulseOrImpulse);
  return `${organName}::${pulseId}`;
}

function classifyBand(pulseOrImpulse) {
  // Pure metadata: no behavior change, just tagging
  const band = pulseOrImpulse?.band || pulseOrImpulse?.mode || null;
  if (band === "binary" || band === "bit" || band === "BAND_BINARY") {
    return "binary";
  }
  if (band === "symbolic" || band === "SYMBOLIC") {
    return "symbolic";
  }
  return "dual";
}

// ---------------------------------------------------------------------------
//  OPTIONAL: Emit EarnReflex + Route it if router is present
// ---------------------------------------------------------------------------
async function maybeEmitAndRouteEarnReflex(event, pulseOrImpulse, instanceContext) {
  try {
    if (typeof window === "undefined") return;

    const reflex = window.PulseEarnReflex;
    if (!reflex || typeof reflex.fromGovernorEvent !== "function") return;

    const { earnReflex } = await reflex.fromGovernorEvent(
      event,
      pulseOrImpulse,
      instanceContext
    );

    const router = window.PulseEarnReflexRouter;
    const earn   = window.Pulse?.Earn;

    if (router && typeof router.route === "function" && earn) {
      router.route(earnReflex, earn);
    }
  } catch {
    // fail-open: governor must never break
  }
}

// ---------------------------------------------------------------------------
//  Organ-level guard
// ---------------------------------------------------------------------------
export async function withOrganGuard(organName, pulseOrImpulse, fn) {
  const pulseId       = getPulseId(pulseOrImpulse);
  const instanceKey   = getInstanceKey(organName, pulseOrImpulse);
  const band          = classifyBand(pulseOrImpulse);

  let state = instanceRegistry.get(instanceKey);
  if (!state) {
    state = { count: 0 };
    instanceRegistry.set(instanceKey, state);
  }
  state.count += 1;

  const instanceIndex   = state.count - 1;
  const totalInstances  = state.count;
  const instanceContext = {
    ...GOVERNOR_CONTEXT_V11,
    band,
    organ: organName,
    pulseId,
    instanceKey,
    instanceIndex,
    totalInstances
  };

  function buildEvent(reason, extra = {}) {
    return {
      ok: false,
      blocked: true,
      reason,
      ...GOVERNOR_CONTEXT_V11,
      band,
      organ: organName,
      pulseId,
      instanceContext,
      ...extra
    };
  }

  // 1. Organ re-entry
  if (activeOrgans.has(organName)) {
    const event = buildEvent("organ_reentry");
    await maybeEmitAndRouteEarnReflex(event, pulseOrImpulse, instanceContext);
    return event;
  }

  // 2. Per-pulse revisit
  let visits = pulseVisits.get(pulseId);
  if (!visits) {
    visits = new Set();
    pulseVisits.set(pulseId, visits);
  } else if (visits.has(organName)) {
    const event = buildEvent("organ_already_visited_for_pulse");
    await maybeEmitAndRouteEarnReflex(event, pulseOrImpulse, instanceContext);
    return event;
  }

  // 3. Depth guards
  const lineageDepth = getLineageDepth(pulseOrImpulse);
  if (lineageDepth > MAX_LINEAGE_DEPTH) {
    const event = buildEvent("lineage_depth_exceeded", { lineageDepth });
    await maybeEmitAndRouteEarnReflex(event, pulseOrImpulse, instanceContext);
    return event;
  }

  const returnToDepth = getReturnToDepth(pulseOrImpulse);
  if (returnToDepth > MAX_RETURN_TO_DEPTH) {
    const event = buildEvent("return_to_depth_exceeded", { returnToDepth });
    await maybeEmitAndRouteEarnReflex(event, pulseOrImpulse, instanceContext);
    return event;
  }

  const fallbackDepth = getFallbackDepth(pulseOrImpulse);
  if (fallbackDepth > MAX_FALLBACK_DEPTH) {
    const event = buildEvent("fallback_depth_exceeded", { fallbackDepth });
    await maybeEmitAndRouteEarnReflex(event, pulseOrImpulse, instanceContext);
    return event;
  }

  // 4. Mark active + visited
  activeOrgans.add(organName);
  visits.add(organName);

  try {
    const result = await fn(instanceContext);
    return {
      ok: true,
      blocked: false,
      ...GOVERNOR_CONTEXT_V11,
      band,
      organ: organName,
      pulseId,
      instanceContext,
      result
    };
  } catch (error) {
    return {
      ok: false,
      blocked: false,
      ...GOVERNOR_CONTEXT_V11,
      band,
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
//  Module init guard
// ---------------------------------------------------------------------------
export async function withModuleInitGuard(moduleName, fn) {
  if (activeModules.has(moduleName)) {
    return {
      ok: false,
      blocked: true,
      reason: "module_init_reentry",
      ...GOVERNOR_CONTEXT_V11,
      module: moduleName
    };
  }

  activeModules.add(moduleName);
  try {
    const result = await fn();
    return {
      ok: true,
      blocked: false,
      ...GOVERNOR_CONTEXT_V11,
      module: moduleName,
      result
    };
  } catch (error) {
    return {
      ok: false,
      blocked: false,
      ...GOVERNOR_CONTEXT_V11,
      module: moduleName,
      error
    };
  } finally {
    activeModules.delete(moduleName);
  }
}
