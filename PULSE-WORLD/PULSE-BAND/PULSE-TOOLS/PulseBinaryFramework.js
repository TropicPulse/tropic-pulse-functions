// ============================================================================
// FILE: /OS/PULSE-UI/PulseBinaryFramework.js
// PULSE OS — v12.3‑EVO
// PAGE EVO ORGAN — SURFACE MEMBRANE + VISUAL CORTEX (DUAL-BAND + PRESENCE)
// ============================================================================
// ROLE (12.3‑EVO):
//   - Final UI-facing “skin” of the organism.
//   - Accepts layered blocks from ANY organ (scanner, behavior, nodeAdmin, etc).
//   - Applies, in order:
//        1) Loop Theory      → deterministic ordering / rotation
//        2) Wave Theory      → visibility modulation / contrast weighting
//        3) Admin Flags      → anomaly highlighting / alert emphasis
//        4) Node Energy      → global tint / organism mood (from harmonics)
//        5) Presence Overlay → subtle weighting for presence-aware surfaces
//   - Produces a final SURFACE OBJECT representing the organism’s visible state.
//
// NOTES:
//   - Not a UI framework. No HTML.
//   - Synthetic biological analog of SKIN + EYES.
//   - All values are synthetic, symbolic, and non-medical.
//   - Surface shape is kept v11-compatible: { layers, energyTint, flags }.
// ============================================================================

export function createPageEvo({ trace = false } = {}) {

  // ---------------------------------------------------------------------------
  // INTERNAL STATE — THE ORGANISM'S SURFACE
  // ---------------------------------------------------------------------------
  let surface = {
    layers: [],      // ordered + weighted blocks
    energyTint: 0,   // NodeAdmin‑EVO → organism mood (scalar 0–1)
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
  // WAVE THEORY — VISIBILITY / CONTRAST MODULATION (12.3‑EVO)
  // ========================================================================
  function applyWaveContrast(blocks, wave, presence = 0) {
    const phase = wave?.phase ?? 0;
    const amp   = wave?.amplitude ?? 0;

    // presence slightly stabilizes visibility (less flicker at high presence)
    const baseVisibility = Math.abs(Math.sin(phase)) * (0.5 + amp * 0.5);
    const visibility = clamp(
      baseVisibility * (0.8 + (1 - presence) * 0.2),
      0,
      1
    );

    return blocks.map(b => ({
      ...b,
      visibility,
      contrastBoost: amp
    }));
  }

  // ========================================================================
  // ADMIN FLAGS — ANOMALY HIGHLIGHTING (SEVERITY-AWARE)
// ========================================================================
  function applyAdminFlags(blocks, flags) {
    const byLayer = new Map();
    for (const f of flags) {
      if (!f.layer) continue;
      const prev = byLayer.get(f.layer) || "none";
      const sev  = f.severity || "low";

      const rank = sev === "high" ? 3 : sev === "medium" ? 2 : 1;
      const prevRank = prev === "highlight-strong" ? 3 :
                       prev === "highlight"        ? 2 :
                       prev === "soft"            ? 1 : 0;

      if (rank > prevRank) {
        byLayer.set(
          f.layer,
          rank === 3 ? "highlight-strong" :
          rank === 2 ? "highlight" :
                       "soft"
        );
      }
    }

    return blocks.map(b => ({
      ...b,
      alert: byLayer.get(b.id) || "none"
    }));
  }

  // ========================================================================
  // NODEADMIN ENERGY — GLOBAL TINT / ORGANISM MOOD (HARMONICS-AWARE)
// ========================================================================
  function applyEnergyTint(blocks, energy, presence = 0) {
    // presence slightly softens extreme moods
    const softenedEnergy = clamp(
      energy * (0.8 + (1 - presence) * 0.2),
      0,
      1
    );

    const mood =
      softenedEnergy > 0.8 ? "surge"   :
      softenedEnergy > 0.6 ? "charged" :
      softenedEnergy > 0.4 ? "active"  :
      softenedEnergy > 0.2 ? "steady"  :
                             "calm";

    return blocks.map(b => ({
      ...b,
      tint: softenedEnergy, // 0–1 → calm → intense
      mood
    }));
  }

  // ========================================================================
  // PRESENCE OVERLAY — SUBTLE WEIGHTING (NO NEW SURFACE FIELDS)
// ========================================================================
  function applyPresenceOverlay(blocks, presence = 0) {
    if (!presence) return blocks;

    // presenceWeight is per-block, but surface shape stays the same
    const weight = clamp(0.3 + presence * 0.7, 0.3, 1);

    return blocks.map(b => ({
      ...b,
      presenceWeight: weight
    }));
  }

  // ========================================================================
  // PUBLIC: EVOLVE SURFACE (MAIN ORGAN FUNCTION, 12.3‑EVO)
// ========================================================================
  // args:
  //   blocks[]      → required
  //   loopIndex     → from loopHistory
  //   wave          → { phase, amplitude } from Behavior/BinaryBehavior
  //   flags[]       → AdminInspector flags
  //   energy        → scalar nodeEnergy (already derived from harmonics)
  //   presence      → scalar presenceAvg (0–1) if available
  function evolve({
    blocks,
    loopIndex = 0,
    wave = { phase:0, amplitude:0 },
    flags = [],
    energy = 0,
    presence = 0
  }) {
    if (!Array.isArray(blocks)) {
      throw new Error("[PageEvo‑12.3‑EVO] evolve() requires blocks[]");
    }

    let out = blocks;

    // 1. Loop Theory → deterministic ordering
    out = orderBlocks(out, loopIndex);

    // 2. Wave Theory → visibility modulation (presence‑aware)
    out = applyWaveContrast(out, wave, presence);

    // 3. Admin Flags → highlight anomalies (severity‑aware)
    out = applyAdminFlags(out, flags);

    // 4. NodeAdmin Energy → tint / mood (presence‑softened)
    out = applyEnergyTint(out, energy, presence);

    // 5. Presence Overlay → subtle weighting (no new surface keys)
    out = applyPresenceOverlay(out, presence);

    // Update surface state (v11‑compatible shape)
    surface.layers = out;
    surface.energyTint = energy;
    surface.flags = flags;

    if (trace) {
      console.log("[PageEvo‑12.3‑EVO] Surface Update:", JSON.stringify(surface, null, 2));
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

// ---------------------------------------------------------------------------
// UTIL
// ---------------------------------------------------------------------------
function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}
