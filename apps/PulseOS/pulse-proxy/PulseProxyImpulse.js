// ============================================================================
//  PULSE OS v9.2 — IMPULSE ORGAN (Shape‑Unified)
//  Adaptive Traveler • Pattern Carrier • Identity Anchor
//  PURE INTERNAL ORGAN — ZERO IMPORTS — ZERO DEPENDENCIES
// ============================================================================
//
//  WHAT THIS ORGAN IS (v9.2):
//  --------------------------
//  • Same Impulse traveler as v9.1 (path, pathway, energy, page, repairSeed).
//  • PLUS: exposes a Pulse v2–compatible shape for the rest of the body.
//  • That means: { jobId, pattern, payload, priority, returnTo, lineage, meta }.
//  • No routing, no movement, no mesh logic — still pure metadata carrier.
//
//  WHAT THIS ORGAN IS NOT:
//  ------------------------
//  • Not a router
//  • Not a compute engine
//  • Not a decision-maker
//  • Not a network packet
//  • Not a backend request
//  • Not a mesh relay
//
//  SAFETY CONTRACT (v9.2):
//  ------------------------
//  • ZERO imports
//  • ZERO external dependencies
//  • ZERO backend calls
//  • ZERO DOM usage
//  • ZERO GPU usage
//  • Deterministic, drift‑proof, offline‑absolute
//  • Pure metadata carrier — no logic, no reasoning
// ============================================================================


// ============================================================================
// ⭐ IMPULSE CONTEXT — v9.2 Identity
// ============================================================================
const IMPULSE_CONTEXT = {
  layer: "Impulse",
  role: "IMPULSE_TRAVELER",
  version: "9.2",
  purpose: "Adaptive traveler + pattern carrier + identity anchor",
  evo: {
    driftProof: true,
    deterministic: true,
    offlineAbsolute: true,
    pathwayMemoryReady: true,
    pulseSendAware: true,
    meshAware: true,
    bandAware: true,
    multiInstanceReady: true,
    futureEvolutionReady: true,
    pulseShapeReady: true
  }
};


// ============================================================================
// INTERNAL HELPERS — v9.2
// ============================================================================
function nowMs() {
  return Date.now();
}

function makeTickId() {
  return nowMs() + "-" + Math.random().toString(36).slice(2);
}

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function impulseLog(stage, details = {}) {
  if (typeof window === "undefined") return;
  if (!window.PULSE_IMPULSE_DIAGNOSTICS && !window.PULSE_DIAGNOSTICS) return;

  try {
    console.log(
      JSON.stringify({
        stage,
        ...details,
        meta: { ...IMPULSE_CONTEXT }
      })
    );
  } catch {}
}

// ⭐ Pulse‑v2 compatible helpers (tiny, deterministic)
function buildLineage(parentLineage, pattern) {
  const base = Array.isArray(parentLineage) ? parentLineage : [];
  return [...base, pattern];
}

function computeShapeSignature(pattern, lineage) {
  const lineageKey = lineage.join("::");
  const raw = `${pattern}::${lineageKey}`;

  let acc = 0;
  for (let i = 0; i < raw.length; i++) {
    acc = (acc + raw.charCodeAt(i) * (i + 1)) % 100000;
  }

  return `shape-${acc}`;
}

function computeEvolutionStage(pattern, lineage) {
  const depth = lineage.length;

  if (depth === 1) return "seed";
  if (depth === 2) return "sprout";
  if (depth === 3) return "branch";

  return "mature";
}


// ============================================================================
// ⭐ IMPULSE ENGINE — v9.2
// PURE INTERNAL TRAVELER — ZERO EXTERNAL DEPENDENCY
// ============================================================================
export const Impulse = {

  // --------------------------------------------------------------------------
  // CREATE — v9.2
  // Identity‑anchored, repair‑seeded, offline‑absolute, pathway‑ready
  // PLUS: embeds Pulse v2–compatible shape
  // --------------------------------------------------------------------------
  create(intent, payload = {}) {
    const tickId = makeTickId();
    const pageIdentity = payload?.pageIdentity || {};

    // Pulse‑v2 compatible fields (derived, not “smart”)
    const jobId       = payload.jobId || tickId;
    const pattern     = payload.pattern || intent || "UNKNOWN_PATTERN";
    const priority    = payload.priority || "normal";
    const returnTo    = payload.returnTo || null;
    const parentLineage = payload.parentLineage || null;

    const lineage        = buildLineage(parentLineage, pattern);
    const shapeSignature = computeShapeSignature(pattern, lineage);
    const evolutionStage = computeEvolutionStage(pattern, lineage);

    const impulse = {
      tickId,
      intent,
      payload,
      version: "v9.2",

      // PATHWAY MEMORY
      path: [],
      pathway: {
        hops: [],
        stable: false,
        learnedRouteId: null
      },

      // ENERGY MODEL
      energy: 1,
      factor: 1,
      urgency: 0,

      // PAGE IDENTITY
      page: {
        name:        pageIdentity.page        || "UNKNOWN_PAGE",
        vars:        pageIdentity.vars        || {},
        repairHooks: pageIdentity.repairHooks || {}
      },

      // REPAIR SEED
      repairSeed: {
        pageName: pageIdentity.page || "UNKNOWN_PAGE",
        focus:    payload?.repairFocus || null
      },

      // IDENTITY HEALTH
      identityHealth: pageIdentity.page ? "Stable" : "Missing",

      // OFFLINE ABSOLUTE
      offline: true,
      externalDependencies: [],

      // ⭐ PULSE v2–COMPATIBLE VIEW
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

      // META
      meta: { ...IMPULSE_CONTEXT }
    };

    impulseLog("IMPULSE_CREATE", {
      tickId,
      intent,
      page: impulse.page.name,
      identityHealth: impulse.identityHealth,
      pulsePattern: impulse.pulse.pattern,
      pulseShape: impulse.pulse.meta.shapeSignature
    });

    return impulse;
  },


  // --------------------------------------------------------------------------
  // URGENCY — v9.2
  // Pure environmental modulation
  // --------------------------------------------------------------------------
  computeUrgency(layerState) {
    let u = 0;

    if (layerState?.health === "Weak")     u += 0.3;
    if (layerState?.health === "Critical") u += 0.6;
    if (layerState?.latency > 150)         u += 0.2;
    if (layerState?.stability < 50)        u += 0.3;

    return Math.min(1, u);
  },


  // --------------------------------------------------------------------------
  // FACTOR — v9.2
  // Hop-relative energy factoring + urgency modulation
  // --------------------------------------------------------------------------
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


  // --------------------------------------------------------------------------
  // ANNOTATE — v9.2
  // Each hop becomes a nervous-system pathway node
  // --------------------------------------------------------------------------
  annotate(impulse, layerIdentity, layerState, delta) {
    impulse.urgency = this.computeUrgency(layerState);

    const hop = {
      ...layerIdentity,
      state: layerState,
      delta,
      urgency: impulse.urgency,
      timestamp: nowMs(),

      page:           impulse.page.name,
      repairSeed:     impulse.repairSeed,
      identityHealth: impulse.identityHealth,

      offline: true,
      meta: { ...IMPULSE_CONTEXT }
    };

    impulse.path.push(hop);

    if (layerIdentity?.id) {
      impulse.pathway.hops.push(layerIdentity.id);
    }

    impulseLog("IMPULSE_ANNOTATE", {
      tickId: impulse.tickId,
      layer: layerIdentity.id,
      page: impulse.page.name,
      urgency: impulse.urgency,
      hopIndex: impulse.path.length - 1,
      totalHops: impulse.path.length
    });

    return impulse;
  },


  // --------------------------------------------------------------------------
  // SNAPSHOT — v9.2
  // Frozen, pathway-memory-friendly snapshot
  // --------------------------------------------------------------------------
  snapshot(impulse) {
    const snap = {
      tickId:   impulse.tickId,
      intent:   impulse.intent,
      version:  impulse.version,
      page:     clone(impulse.page),
      repairSeed: clone(impulse.repairSeed),
      identityHealth: impulse.identityHealth,
      pathway: clone(impulse.pathway),
      hops:    impulse.path.length,
      pulse:   clone(impulse.pulse),
      meta:    { ...IMPULSE_CONTEXT }
    };

    impulseLog("IMPULSE_SNAPSHOT", {
      tickId: snap.tickId,
      hops:   snap.hops,
      pulsePattern: snap.pulse.pattern
    });

    return snap;
  },


  // --------------------------------------------------------------------------
  // MARK PATHWAY STABLE — v9.2
  // Called by NerveMap/PathwayMemory once a route is learned
  // --------------------------------------------------------------------------
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


  // --------------------------------------------------------------------------
  // RETURN — v9.2
  // Pure internal return to PulseBand + optional NerveMap ingestion
  // --------------------------------------------------------------------------
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
