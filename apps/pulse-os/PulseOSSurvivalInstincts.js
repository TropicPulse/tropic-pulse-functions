// ============================================================================
// FILE: /apps/PulseOS/Organs/Instincts/PulseOSSurvivalInstincts.js
// PULSE OS — v9.2
// “THE SURVIVAL INSTINCTS / EVOLUTION ARCHIVE”
// STRUCTURAL MEMORY • IDENTITY ANCHOR • EVOLUTION SENTINEL
// ============================================================================
//
// ORGAN IDENTITY (v9.2):
//   • Organ Type: Instincts / Structural Memory
//   • Layer: Instinct Layer (I‑Layer)
//   • Biological Analog: Survival instincts + structural memory
//   • System Role: Remember last safe pathway + detect organism evolution
//
// SAFETY CONTRACT (v9.2):
//   • Pure structural memory — NEVER mutate impulses
//   • Never compute payloads or business logic
//   • Never depend on filenames or pages
//   • Store structure, not state
//   • Safe for organisms that grow new layers over time
//   • Zero network, zero routing, zero timers
// ============================================================================


// ============================================================================
// INTERNAL MEMORY STORE (long-term structural memory)
// ============================================================================
const _store = {
  pathway: null,
  signature: null,
  history: [],
  lastLearnedRouteId: null
};


// ============================================================================
// HELPERS
// ============================================================================
function computeSignature(hops) {
  return hops
    .map(h => `${h.layerId || "X"}:${h.layerVersion || "?"}`)
    .join("|");
}

function signaturesMatch(a, b) {
  return a === b;
}

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}


// ============================================================================
// SURVIVAL INSTINCT ENGINE — v9.2
// ============================================================================
export const PulseOSSurvivalInstincts = {

  meta: {
    organ: "PulseOSSurvivalInstincts",
    layer: "Instinct Layer",
    role: "Structural Memory / Evolution Archive",
    version: "9.2",
    generation: "v9",
    evo: {
      driftProof: true,
      deterministicNeuron: true,
      unifiedAdvantageField: true,
      multiInstanceReady: true,
      zeroNetwork: true,
      zeroMutation: true,
      zeroTiming: true,
      futureEvolutionReady: true
    }
  },

  // --------------------------------------------------------------------------
  // RECORD IMPULSE — structural memory only
  // --------------------------------------------------------------------------
  recordImpulse(snapshot) {
    if (!snapshot || !Array.isArray(snapshot?.pathway?.hops)) return;

    const hops = snapshot.pathway.hops;
    const newSignature = computeSignature(hops);

    // FIRST DISCOVERY
    if (!_store.pathway) {
      _store.pathway = clone(hops);
      _store.signature = newSignature;

      _store.history.push({
        timestamp: Date.now(),
        event: "INITIAL_DISCOVERY",
        signature: newSignature,
        hops: clone(hops),
        tickId: snapshot.tickId
      });

      return;
    }

    // NO EVOLUTION
    if (signaturesMatch(_store.signature, newSignature)) {
      return;
    }

    // EVOLUTION DETECTED
    _store.history.push({
      timestamp: Date.now(),
      event: "EVOLUTION_DETECTED",
      oldSignature: _store.signature,
      newSignature,
      oldHops: clone(_store.pathway),
      newHops: clone(hops),
      tickId: snapshot.tickId
    });

    _store.pathway = clone(hops);
    _store.signature = newSignature;
  },

  // --------------------------------------------------------------------------
  // ACCESSORS
  // --------------------------------------------------------------------------
  getPathway() {
    return clone(_store.pathway || []);
  },

  getHistory() {
    return clone(_store.history);
  },

  hasEvolved(snapshot) {
    if (!snapshot || !Array.isArray(snapshot?.pathway?.hops)) return false;
    const newSignature = computeSignature(snapshot.pathway.hops);
    return !signaturesMatch(_store.signature, newSignature);
  },

  setLearnedRouteId(routeId) {
    _store.lastLearnedRouteId = routeId;
  },

  getLearnedRouteId() {
    return _store.lastLearnedRouteId;
  },

  clear() {
    _store.pathway = null;
    _store.signature = null;
    _store.history = [];
    _store.lastLearnedRouteId = null;
  }
};
