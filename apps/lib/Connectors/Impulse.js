// ============================================================================
// FILE: /apps/lib/Connectors/Impulse.js
// LAYER: THE IMPULSE (Adaptive Traveler + Pattern Carrier + Identity Anchor)
// ============================================================================
//
// ROLE:
//   THE IMPULSE — The adaptive traveling signal of Pulse OS
//   • Fired by PulseBand (Nervous System)
//   • Moves through each layer sequentially (UNBOUNDED PATHWAY, 0..N HOPS)
//   • Each layer attaches identity + state + delta
//   • Factors its energy (1/0, 1/2) per hop (no fixed hop count assumed)
//   • Adapts urgency based on environmental conditions (pattern-inspired)
//   • Returns to PulseBand with full organism snapshot
//
// v6.4+ UPGRADE:
//   • Adds PAGE IDENTITY (1 PAGE = 1 ORGAN = 1 IDENTITY)
//   • Adds REPAIR SEED (page-aware, layer-agnostic healing anchor)
//   • Adds PAGE CONTEXT to every hop
//   • Adds IDENTITY SAFETY GUARD when page is UNKNOWN
//   • Removes brittle PAGE=function dependency
//   • Spinal Cord (Impulse) becomes identity authority
//   • Nervous system becomes globally consistent + drift-proof
//
// v6.5 UPGRADE (LIVING PATHWAY):
//   • Formalizes impulse.path as a LIVING NERVOUS PATHWAY (dynamic length)
//   • Never assumes a fixed number of layers (no “6-layer spine” limit)
//   • Pathway length emerges from annotate() calls (organism growth-safe)
//   • Designed to be interpreted by NerveMap + PathwayMemory (evolving map)
//   • Energy/urgency are hop-relative, not tied to any max depth
//
// CONTRACT:
//   • Pure traveler — no imports from PulseNet, PulseUpdate, PulseClient
//   • No business logic — pattern only
//   • Deterministic, drift-proof, organism-safe
//
// SAFETY:
//   • v6.3 was COMMENTAL + DIAGNOSTIC ONLY
//   • v6.4 adds identity-only fields + safety guard (non-invasive)
//   • v6.5 adds explicit unbounded-pathway semantics (evolution-safe)
// ============================================================================


// ============================================================================
// IMPULSE CONSTANTS
// ============================================================================
const IMPULSE_LAYER_ID   = "IMPULSE-LAYER";
const IMPULSE_LAYER_NAME = "THE IMPULSE";
const IMPULSE_LAYER_ROLE =
  "Adaptive Traveler + Pattern Carrier + Identity Anchor";

const IMPULSE_DIAGNOSTICS_ENABLED =
  window?.PULSE_IMPULSE_DIAGNOSTICS === true ||
  window?.PULSE_DIAGNOSTICS === true;

const impulseLog = (stage, details = {}) => {
  if (!IMPULSE_DIAGNOSTICS_ENABLED) return;

  console.log(
    JSON.stringify({
      impulseLayer: IMPULSE_LAYER_ID,
      impulseName:  IMPULSE_LAYER_NAME,
      impulseRole:  IMPULSE_LAYER_ROLE,
      stage,
      ...details
    })
  );
};

impulseLog("IMPULSE_INIT", {});


// ============================================================================
// IMPULSE ENGINE
// ============================================================================
export const Impulse = {

  // --------------------------------------------------------------------------
  // Create a new impulse (v6.4+: identity-aware + repair-seeded + guarded)
  // v6.5: pathway-unbounded, ready for NerveMap + PathwayMemory
  // --------------------------------------------------------------------------
  create(intent, payload = {}) {
    const tickId =
      Date.now() + "-" + Math.random().toString(36).slice(2);

    const pageIdentity = payload?.pageIdentity || {};

    const impulse = {
      tickId,
      intent,
      payload,

      // LIVING PATHWAY:
      // path is an unbounded array of hops; length emerges from annotate() calls
      path: [],

      energy: 1,   // starts at full energy
      factor: 1,   // factoring multiplier
      urgency: 0,  // adaptive urgency (pattern-inspired)
      signature: "1010101", // forward genome

      // v6.4+ — PAGE IDENTITY ANCHOR
      page: {
        name:        pageIdentity.page        || "UNKNOWN_PAGE",
        vars:        pageIdentity.vars        || {},
        repairHooks: pageIdentity.repairHooks || {}
      },

      // v6.4+ — REPAIR FORMULA SEED
      repairSeed: {
        pageName: pageIdentity.page || "UNKNOWN_PAGE",
        focus:    payload?.repairFocus || null
      },

      // v6.4+ — IDENTITY SAFETY STATUS
      identityHealth: pageIdentity.page ? "Stable" : "Missing"
    };

    // HARD SAFETY: log critical if identity is missing
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
  // Adaptive urgency (pattern-inspired environmental response)
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
  // Apply factoring (1/0, 1/2 pattern) + urgency modulation
  // v6.5: hop-relative, works for any pathway depth
  // --------------------------------------------------------------------------
  factorImpulse(impulse) {
    impulse.factor *= 0.5;
    impulse.energy *= impulse.factor;

    if (impulse.urgency > 0) {
      impulse.energy += impulse.urgency * 0.1;
    }

    impulseLog("IMPULSE_FACTOR", {
      tickId:   impulse.tickId,
      factor:   impulse.factor,
      energy:   impulse.energy,
      urgency:  impulse.urgency,
      hopsSoFar: impulse.path.length
    });

    return impulse;
  },


  // --------------------------------------------------------------------------
  // Layer attaches identity + state + delta
  // v6.5: each annotate() call is a Nerve hop in a living pathway
  // --------------------------------------------------------------------------
  annotate(impulse, layerIdentity, layerState, delta) {
    impulse.urgency = this.computeUrgency(layerState);

    impulse.path.push({
      ...layerIdentity,
      state: layerState,
      delta,
      urgency: impulse.urgency,
      timestamp: Date.now(),

      // v6.4+ — PAGE CONTEXT ON EVERY HOP
      page: impulse.page.name,

      // v6.4+ — REPAIR SEED PROPAGATION
      repairSeed: impulse.repairSeed,

      // v6.4+ — IDENTITY HEALTH SNAPSHOT
      identityHealth: impulse.identityHealth
    });

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
  // Return impulse to PulseBand
  // v6.5: pathway length is emergent; NerveMap/PathwayMemory interpret it
  // --------------------------------------------------------------------------
  returnToPulseBand(impulse) {
    impulse.signature = "1001101010101010101"; // return genome

    impulseLog("IMPULSE_RETURN", {
      tickId:         impulse.tickId,
      hops:           impulse.path.length,
      page:           impulse.page.name,
      identityHealth: impulse.identityHealth
    });

    if (window?.PulseBand?.receiveImpulseReturn) {
      window.PulseBand.receiveImpulseReturn(impulse);
    }
  }
};
