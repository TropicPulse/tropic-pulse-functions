// ============================================================================
// FILE: /apps/lib/Connectors/Impulse.js
// LAYER: THE IMPULSE (Adaptive Traveler + Pattern Carrier + Identity Anchor)
// PULSE OS — v7.1
// OFFLINE‑ABSOLUTE • PURE TRAVELER • ZERO EXTERNAL DEPENDENCY
// ============================================================================
//
// ROLE (v7.1):
//   • Fired by PulseBand (Nervous System)
//   • Moves through each layer sequentially (UNBOUNDED PATHWAY)
//   • Each layer attaches identity + state + delta
//   • Factors its energy (1/0, 1/2) per hop
//   • Adapts urgency based on environmental conditions
//   • Returns to PulseBand with full organism snapshot
//   • v7.0: Guaranteed offline — no external stimuli required
//   • v7.1: Pathway‑memory ready (no hardcoded pages, no file maps)
//
// CONTRACT:
//   • Pure traveler — no imports from PulseNet, PulseUpdate, PulseClient
//   • No backend, no fetch, no network, no external state
//   • Deterministic, drift-proof, organism-safe
//   • Local-only, internal-only, self-contained
//
// SAFETY (v7.1):
//   • No randomness except tickId entropy
//   • No external calls
//   • No environment access (beyond window for local wiring)
//   • No timing loops
//   • No external stimuli required
// ============================================================================


// ============================================================================
// IMPULSE CONSTANTS
// ============================================================================
const IMPULSE_LAYER_ID   = "IMPULSE-LAYER";
const IMPULSE_LAYER_NAME = "THE IMPULSE";
const IMPULSE_LAYER_ROLE =
  "Adaptive Traveler + Pattern Carrier + Identity Anchor";

const IMPULSE_VERSION = "v7.1";

const IMPULSE_DIAGNOSTICS_ENABLED =
  window?.PULSE_IMPULSE_DIAGNOSTICS === true ||
  window?.PULSE_DIAGNOSTICS === true;

const impulseLog = (stage, details = {}) => {
  if (!IMPULSE_DIAGNOSTICS_ENABLED) return;

  log(
    JSON.stringify({
      impulseLayer:  IMPULSE_LAYER_ID,
      impulseName:   IMPULSE_LAYER_NAME,
      impulseRole:   IMPULSE_LAYER_ROLE,
      impulseVersion: IMPULSE_VERSION,
      stage,
      ...details
    })
  );
};

impulseLog("IMPULSE_INIT", {});


// ============================================================================
// INTERNAL HELPERS — v7.1
// ============================================================================
function makeTickId() {
  return Date.now() + "-" + Math.random().toString(36).slice(2);
}

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

// ============================================================================
// IMPULSE ENGINE — v7.1
// PURE INTERNAL TRAVELER — ZERO EXTERNAL DEPENDENCY
// ============================================================================
export const Impulse = {

  // --------------------------------------------------------------------------
  // CREATE — v7.1
  // Identity-aware, repair-seeded, offline-guaranteed, pathway-memory-ready
  // --------------------------------------------------------------------------
  create(intent, payload = {}) {
    const tickId = makeTickId();
    const pageIdentity = payload?.pageIdentity || {};

    const impulse = {
      tickId,
      intent,
      payload,

      version: IMPULSE_VERSION,

      // LIVING PATHWAY (unbounded)
      path: [],

      // Pathway memory (no hardcoded pages/files)
      pathway: {
        hops: [],          // sequence of layer ids
        stable: false,     // becomes true when NerveMap/PathwayMemory confirm
        learnedRouteId: null // optional id assigned by NerveMap
      },

      energy: 1,
      factor: 1,
      urgency: 0,
      signature: "1010101",

      // PAGE IDENTITY ANCHOR (soft — names are hints, not requirements)
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

      // v7.0 — OFFLINE ABSOLUTE
      offline: true,
      externalDependencies: []
    };

    if (!pageIdentity.page) {
      impulseLog("IMPULSE_IDENTITY_MISSING", {
        tickId,
        intent,
        warning: "PAGE IDENTITY MISSING — REPAIR MAY BE DEGRADED"
      });
    }

    impulseLog("IMPULSE_CREATE", {
      tickId,
      intent,
      page: impulse.page.name,
      identityHealth: impulse.identityHealth
    });

    return impulse;
  },


  // --------------------------------------------------------------------------
  // URGENCY — v7.1
  // Pure internal environmental response
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
  // FACTOR — v7.1
  // Hop-relative energy factoring + urgency modulation
  // --------------------------------------------------------------------------
  factorImpulse(impulse) {
    impulse.factor *= 0.5;
    impulse.energy *= impulse.factor;

    if (impulse.urgency > 0) {
      impulse.energy += impulse.urgency * 0.1;
    }

    impulseLog("IMPULSE_FACTOR", {
      tickId:    impulse.tickId,
      factor:    impulse.factor,
      energy:    impulse.energy,
      urgency:   impulse.urgency,
      hopsSoFar: impulse.path.length
    });

    return impulse;
  },


  // --------------------------------------------------------------------------
  // ANNOTATE — v7.1
  // Each hop becomes a nervous-system pathway node
  // --------------------------------------------------------------------------
  annotate(impulse, layerIdentity, layerState, delta) {
    impulse.urgency = this.computeUrgency(layerState);

    const hop = {
      ...layerIdentity,
      state: layerState,
      delta,
      urgency: impulse.urgency,
      timestamp: Date.now(),

      page:           impulse.page.name,
      repairSeed:     impulse.repairSeed,
      identityHealth: impulse.identityHealth,

      // v7.1 — OFFLINE ABSOLUTE
      offline: true
    };

    impulse.path.push(hop);

    // Pathway memory: record just the identity id (no file/page hardcoding)
    if (layerIdentity?.id) {
      impulse.pathway.hops.push(layerIdentity.id);
    }

    impulseLog("IMPULSE_ANNOTATE", {
      tickId:         impulse.tickId,
      layer:          layerIdentity.id,
      page:           impulse.page.name,
      urgency:        impulse.urgency,
      identityHealth: impulse.identityHealth,
      hopIndex:       impulse.path.length - 1,
      totalHops:      impulse.path.length
    });

    return impulse;
  },


  // --------------------------------------------------------------------------
  // SNAPSHOT — v7.1
  // Returns a frozen, pathway-memory-friendly snapshot
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
      hops:    impulse.path.length
    };

    impulseLog("IMPULSE_SNAPSHOT", {
      tickId: snap.tickId,
      hops:   snap.hops
    });

    return snap;
  },


  // --------------------------------------------------------------------------
  // MARK PATHWAY STABLE — v7.1
  // Called by NerveMap/PathwayMemory once a route is learned
  // --------------------------------------------------------------------------
  markPathwayStable(impulse, learnedRouteId) {
    impulse.pathway.stable = true;
    impulse.pathway.learnedRouteId = learnedRouteId || null;

    impulseLog("IMPULSE_PATHWAY_STABLE", {
      tickId:        impulse.tickId,
      learnedRouteId,
      hops: impulse.pathway.hops.length
    });

    return impulse;
  },


  // --------------------------------------------------------------------------
  // RETURN — v7.1
  // Pure internal return to PulseBand + optional NerveMap ingestion
  // --------------------------------------------------------------------------
  returnToPulseBand(impulse) {
    impulse.signature = "1001101010101010101";

    const snap = this.snapshot(impulse);

    impulseLog("IMPULSE_RETURN", {
      tickId:         impulse.tickId,
      hops:           impulse.path.length,
      page:           impulse.page.name,
      identityHealth: impulse.identityHealth
    });

    // Local-only wiring: no network, no backend
    if (window?.PulseBand?.receiveImpulseReturn) {
      window.PulseBand.receiveImpulseReturn(impulse, snap);
    }

    // Optional: feed NerveMap / PathwayMemory if present (still local-only)
    if (window?.NerveMap?.ingestImpulse) {
      window.NerveMap.ingestImpulse(snap);
    }

    if (window?.PathwayMemory?.recordImpulse) {
      window.PathwayMemory.recordImpulse(snap);
    }
  }
};
