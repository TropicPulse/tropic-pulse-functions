// ============================================================================
// FILE: /apps/PulseOS/ui/PageEvo-v11-EVO.js
// PULSE OS — v11-EVO
// PAGE EVO ORGAN — SURFACE MEMBRANE + VISUAL CORTEX
// ============================================================================
// ROLE:
//   - The final UI-facing “skin” of the organism.
//   - Accepts layered blocks from ANY organ (scanner, behavior, nodeAdmin, etc).
//   - Applies:
//        1) Loop Theory      → deterministic ordering / rotation
//        2) Wave Theory      → visibility modulation / contrast weighting
//        3) Admin Flags      → anomaly highlighting / alert emphasis
//        4) Node Energy      → global tint / organism mood
//   - Produces a final SURFACE OBJECT representing the organism’s visible state.
//
// NOTES:
//   - This is NOT a UI framework.
//   - This is the synthetic biological analog of SKIN + EYES.
//   - It does NOT render HTML. It emits a structured “surface” object.
//   - All values are synthetic, symbolic, and non-medical.
// ============================================================================

export function createPageEvo({ trace = false } = {}) {

  // ---------------------------------------------------------------------------
  // INTERNAL STATE — THE ORGANISM'S SURFACE
  // ---------------------------------------------------------------------------
  let surface = {
    layers: [],      // ordered + weighted blocks
    energyTint: 0,   // NodeAdminPulse → organism mood
    flags: []        // AdminInspector → anomaly signals
  };

  // ========================================================================
  // LOOP THEORY — DETERMINISTIC ORDERING (ROTATION)
  // ========================================================================
  function orderBlocks(blocks, loopIndex) {
    if (!blocks.length) return blocks;

    const idx = loopIndex % blocks.length;
    const rotated = blocks.slice(idx).concat(blocks.slice(0, idx));

    return rotated.map((b, i) => ({
      ...b,
      order: i
    }));
  }

  // ========================================================================
  // WAVE THEORY — VISIBILITY / CONTRAST MODULATION
  // ========================================================================
  function applyWaveContrast(blocks, wave) {
    const phase = wave?.phase ?? 0;
    const amp   = wave?.amplitude ?? 0;

    const visibility = Math.abs(Math.sin(phase)) * (0.5 + amp * 0.5);

    return blocks.map(b => ({
      ...b,
      visibility,
      contrastBoost: amp
    }));
  }

  // ========================================================================
  // ADMIN FLAGS — ANOMALY HIGHLIGHTING
  // ========================================================================
  function applyAdminFlags(blocks, flags) {
    const flaggedLayers = new Set(flags.map(f => f.layer));

    return blocks.map(b => ({
      ...b,
      alert: flaggedLayers.has(b.id) ? "highlight" : "none"
    }));
  }

  // ========================================================================
  // NODEADMIN ENERGY — GLOBAL TINT / ORGANISM MOOD
  // ========================================================================
  function applyEnergyTint(blocks, energy) {
    return blocks.map(b => ({
      ...b,
      tint: energy,          // 0–1 → calm → intense
      mood: energy > 0.7 ? "charged" :
            energy > 0.4 ? "active" :
            "calm"
    }));
  }

  // ========================================================================
  // PUBLIC: EVOLVE SURFACE (MAIN ORGAN FUNCTION)
  // ========================================================================
  function evolve({ blocks, loopIndex = 0, wave = {phase:0, amplitude:0}, flags = [], energy = 0 }) {
    if (!Array.isArray(blocks)) {
      throw new Error("[PageEvo] evolve() requires blocks[]");
    }

    let out = blocks;

    // 1. Loop Theory → deterministic ordering
    out = orderBlocks(out, loopIndex);

    // 2. Wave Theory → visibility modulation
    out = applyWaveContrast(out, wave);

    // 3. Admin Flags → highlight anomalies
    out = applyAdminFlags(out, flags);

    // 4. NodeAdmin Energy → tint / mood
    out = applyEnergyTint(out, energy);

    // Update surface state
    surface.layers = out;
    surface.energyTint = energy;
    surface.flags = flags;

    if (trace) {
      console.log("[PageEvo-v11-EVO] Surface Update:", JSON.stringify(surface, null, 2));
    }

    return surface;
  }

  // ========================================================================
  // PUBLIC: GET CURRENT SURFACE
  // ========================================================================
  function getSurface() {
    return surface;
  }

  // ========================================================================
  // ORGAN EXPORT
  // ========================================================================
  return {
    evolve,
    getSurface
  };
}
