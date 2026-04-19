// ============================================================================
// FILE: /apps/lib/Diagnostics/PathwayMemory.js
// LAYER: PATHWAY MEMORY (Living Map + Evolution Archive + Identity Anchor)
// ============================================================================
//
// ROLE:
//   PATHWAY MEMORY — Remembers the discovered nervous pathway
//   • Stores Nerve order (0..N, unbounded)
//   • Stores layer identity + stability + evolution markers
//   • Stores forward + return efficiency history
//   • Detects organism changes (growth, pruning, identity shifts)
//   • Updates pathway ONLY when the organism evolves
//   • Provides stable map to NerveMap + DiagnosticsPanel + RepairEngine
//
// VERSION: v7.0 (EVOLUTION MEMORY)
//   • v6.5: unbounded pathway semantics
//   • v7.0: adds evolution detection + historical deltas + stable caching
//
// CONTRACT:
//   • Pure memory — NEVER mutates impulses
//   • NEVER computes business logic
//   • NEVER computes payloads
//   • Stores structure, not state
//   • Safe for organisms that grow new layers over time
//
// SAFETY:
//   • Pathway is updated only when identity or structure changes
//   • Prevents recomputing identity every hop
//   • Prevents drift across impulses
// ============================================================================


// ============================================================================
// INTERNAL MEMORY STORE
// (In a real organism this is long-term memory; here it's a module-level cache)
// ============================================================================
const _pathwayStore = {
  pathway: null,        // last known pathway (array of nerves)
  signature: null,      // structural signature for evolution detection
  history: []           // evolution history snapshots
};


// ============================================================================
// HELPERS
// ============================================================================

// Compute a structural signature for evolution detection
function computeSignature(nerves) {
  return nerves
    .map(n => `${n.layerId || 'X'}:${n.layerName || 'X'}`)
    .join("|");
}

// Compare two signatures
function signaturesMatch(a, b) {
  return a === b;
}


// ============================================================================
// PATHWAY MEMORY ENGINE
// ============================================================================
export const PathwayMemory = {

  // --------------------------------------------------------------------------
  // Store a newly discovered pathway (from NerveMap.buildForward)
  // --------------------------------------------------------------------------
  store(pathway) {
    if (!Array.isArray(pathway)) return;

    const newSignature = computeSignature(pathway);

    // If no previous pathway exists → first discovery
    if (!_pathwayStore.pathway) {
      _pathwayStore.pathway = pathway;
      _pathwayStore.signature = newSignature;
      _pathwayStore.history.push({
        timestamp: Date.now(),
        event: "INITIAL_DISCOVERY",
        pathway
      });
      return;
    }

    // If structure is unchanged → no evolution
    if (signaturesMatch(_pathwayStore.signature, newSignature)) {
      return;
    }

    // Otherwise → organism evolved
    _pathwayStore.history.push({
      timestamp: Date.now(),
      event: "EVOLUTION_DETECTED",
      oldSignature: _pathwayStore.signature,
      newSignature,
      oldPathway: _pathwayStore.pathway,
      newPathway: pathway
    });

    // Update memory
    _pathwayStore.pathway = pathway;
    _pathwayStore.signature = newSignature;
  },


  // --------------------------------------------------------------------------
  // Retrieve the current pathway (stable, cached)
  // --------------------------------------------------------------------------
  get() {
    return _pathwayStore.pathway || [];
  },


  // --------------------------------------------------------------------------
  // Retrieve evolution history
  // --------------------------------------------------------------------------
  getHistory() {
    return [..._pathwayStore.history];
  },


  // --------------------------------------------------------------------------
  // Check if organism evolved since last impulse
  // --------------------------------------------------------------------------
  hasEvolved(pathway) {
    if (!Array.isArray(pathway)) return false;
    const newSignature = computeSignature(pathway);
    return !signaturesMatch(_pathwayStore.signature, newSignature);
  }
};
