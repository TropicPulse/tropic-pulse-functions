// ============================================================================
//  IMPULSE CONTEXT — keep as-is, bump when you move fully to v11
// ============================================================================
const IMPULSE_CONTEXT = { /* ...your existing object... */ };

// internal helpers: nowMs, buildLineage, computeShapeSignature, computeEvolutionStage
// keep them shared for all three versions



// ============================================================================
// 1) LEGACY IMPULSE — v9.3 (unchanged, frozen)
// ============================================================================
export const ImpulseLegacy = {
  create(intent, payload = {}) {
    // your current create implementation, exactly as-is
  },
  computeUrgency(layerState) { /* as-is */ },
  factorImpulse(impulse) { /* as-is */ },
  annotate(impulse, layerIdentity, layerState, delta) { /* as-is */ },
  snapshot(impulse) { /* as-is */ },
  markPathwayStable(impulse, learnedRouteId) { /* as-is */ },
  returnToPulseBand(impulse) { /* as-is */ }
};



// ============================================================================
// 2) BINARY CORE — v11+ (no window, no JSON, no random)
// ============================================================================
function makeDeterministicTickId(now, seed = "") {
  return `${now}-${seed}`;
}

function createBinaryImpulse(intent, payload = {}, now) {
  const pageIdentity = payload?.pageIdentity || {};

  const tickNow       = now || nowMs();
  const tickId        = makeDeterministicTickId(tickNow, payload.jobId || "");
  const jobId         = payload.jobId || tickId;
  const pattern       = payload.pattern || intent || "UNKNOWN_PATTERN";
  const priority      = payload.priority || "normal";
  const returnTo      = payload.returnTo || null;
  const parentLineage = payload.parentLineage || null;

  const lineage        = buildLineage(parentLineage, pattern);
  const shapeSignature = computeShapeSignature(pattern, lineage);
  const evolutionStage = computeEvolutionStage(pattern, lineage);

  return {
    tickId,
    intent,
    payload,
    version: "v11-binary",

    path: [],
    pathway: {
      hops: [],
      stable: false,
      learnedRouteId: null
    },

    energy: 1,
    factor: 1,
    urgency: 0,

    page: {
      name:        pageIdentity.page        || "UNKNOWN_PAGE",
      vars:        pageIdentity.vars        || {},
      repairHooks: pageIdentity.repairHooks || {}
    },

    repairSeed: {
      pageName: pageIdentity.page || "UNKNOWN_PAGE",
      focus:    payload?.repairFocus || null
    },

    identityHealth: pageIdentity.page ? "Stable" : "Missing",

    offline: true,
    externalDependencies: [],

    pulse: {
      jobId,
      pattern,
      payload,
      priority,
      returnTo,
      lineage,
      meta: {
        shapeSignature,
        evolutionStage
      }
    },

    meta: { ...IMPULSE_CONTEXT }
  };
}

function computeUrgencyBinary(layerState) {
  let u = 0;
  if (layerState?.health === "Weak")     u += 0.3;
  if (layerState?.health === "Critical") u += 0.6;
  if (layerState?.latency > 150)         u += 0.2;
  if (layerState?.stability < 50)        u += 0.3;
  return Math.min(1, u);
}

function annotateBinary(impulse, layerIdentity, layerState, delta, now) {
  impulse.urgency = computeUrgencyBinary(layerState);

  const hop = {
    ...layerIdentity,
    state: layerState,
    delta,
    urgency: impulse.urgency,
    timestamp: now || nowMs(),

    page:           impulse.page.name,
    repairSeed:     impulse.repairSeed,
    identityHealth: impulse.identityHealth,

    offline: true,
    meta: { ...IMPULSE_CONTEXT }
  };

  impulse.path.push(hop);
  if (layerIdentity?.id) impulse.pathway.hops.push(layerIdentity.id);
  return impulse;
}

export const ImpulseBinary = {
  create: createBinaryImpulse,
  computeUrgency: computeUrgencyBinary,
  annotate: annotateBinary,
  // factor/snapshot/markPathwayStable can be added here as pure transforms too
};



// ============================================================================
// 3) UPGRADED SYMBOLIC — v10.4–11 (wraps binary, adds logs + window hooks)
// ============================================================================
export const Impulse = {
  // upgraded nonbinary
  create(intent, payload = {}) {
    const impulse = ImpulseBinary.create(intent, payload, nowMs());

    impulseLog("IMPULSE_CREATE", {
      tickId: impulse.tickId,
      intent,
      page: impulse.page.name,
      identityHealth: impulse.identityHealth,
      pulsePattern: impulse.pulse.pattern,
      pulseShape: impulse.pulse.meta.shapeSignature
    });

    return impulse;
  },

  computeUrgency(layerState) {
    return ImpulseBinary.computeUrgency(layerState);
  },

  factorImpulse(impulse) {
    impulse.factor *= 0.5;
    impulse.energy *= impulse.factor;

    if (impulse.urgency > 0) {
      impulse.energy += impulse.urgency * 0.1;
    }

    impulseLog("IMPULSE_FACTOR", {
      tickId: impulse.tickId,
      factor: impulse.factor,
      energy: impulse.energy,
      urgency: impulse.urgency,
      hopsSoFar: impulse.path.length
    });

    return impulse;
  },

  annotate(impulse, layerIdentity, layerState, delta) {
    const updated = ImpulseBinary.annotate(impulse, layerIdentity, layerState, delta, nowMs());

    impulseLog("IMPULSE_ANNOTATE", {
      tickId: updated.tickId,
      layer: layerIdentity.id,
      page: updated.page.name,
      urgency: updated.urgency,
      hopIndex: updated.path.length - 1,
      totalHops: updated.path.length
    });

    return updated;
  },

  snapshot(impulse) {
    const snap = {
      tickId:   impulse.tickId,
      intent:   impulse.intent,
      version:  impulse.version,
      page:     { ...impulse.page },
      repairSeed: { ...impulse.repairSeed },
      identityHealth: impulse.identityHealth,
      pathway: { ...impulse.pathway, hops: [...impulse.pathway.hops] },
      hops:    impulse.path.length,
      pulse:   { ...impulse.pulse },
      meta:    { ...IMPULSE_CONTEXT }
    };

    impulseLog("IMPULSE_SNAPSHOT", {
      tickId: snap.tickId,
      hops:   snap.hops,
      pulsePattern: snap.pulse.pattern
    });

    return snap;
  },

  markPathwayStable(impulse, learnedRouteId) {
    impulse.pathway.stable = true;
    impulse.pathway.learnedRouteId = learnedRouteId || null;

    impulseLog("IMPULSE_PATHWAY_STABLE", {
      tickId: impulse.tickId,
      learnedRouteId,
      hops: impulse.pathway.hops.length
    });

    return impulse;
  },

  returnToPulseBand(impulse) {
    impulse.signature = "1001101010101010101";

    const snap = this.snapshot(impulse);

    impulseLog("IMPULSE_RETURN", {
      tickId: impulse.tickId,
      hops: impulse.path.length,
      page: impulse.page.name,
      identityHealth: impulse.identityHealth,
      pulsePattern: impulse.pulse.pattern
    });

    if (typeof window !== "undefined" && window.PulseBand?.receiveImpulseReturn) {
      window.PulseBand.receiveImpulseReturn(impulse, snap);
    }
    if (typeof window !== "undefined" && window.NerveMap?.ingestImpulse) {
      window.NerveMap.ingestImpulse(snap);
    }
    if (typeof window !== "undefined" && window.PathwayMemory?.recordImpulse) {
      window.PathwayMemory.recordImpulse(snap);
    }
  }
};

export const IMPULSE_META = { ...IMPULSE_CONTEXT };
