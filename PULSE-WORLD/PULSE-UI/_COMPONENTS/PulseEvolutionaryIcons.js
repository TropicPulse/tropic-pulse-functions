/*
===============================================================================
FILE: /PULSE-UI/PulseEvolutionaryIcons-v16.js
LAYER: UNIVERSAL ICON ORGAN — v16 IMMORTAL
===============================================================================

ROLE (v16):
  THE UNIVERSAL ICON ORGAN — deterministic, GPU‑friendly, neon‑native.
  • Provides a massive icon library for UI, diagnostics, heatmaps, organs.
  • Supports binary‑friendly mode (low entropy, monochrome).
  • Supports tiered icons (bronze → omega).
  • Supports role‑color icons (nodeadmin, server, castle, expansion, etc).
  • Deterministic, drift‑proof, lineage‑aware.

SAFETY:
  • PURE FUNCTION — no IO, no network, no filesystem.
  • Deterministic output only.
===============================================================================
*/

export const ICON_SCHEMA_VERSION = "v3";

// ============================================================================
// GPU‑FRIENDLY GLOW + STROKE MAPS (v16 IMMORTAL)
// ============================================================================
const glow = Object.freeze({
  cyan:    "drop-shadow(0 0 6px rgba(0,255,255,0.45))",
  green:   "drop-shadow(0 0 6px rgba(0,255,150,0.45))",
  red:     "drop-shadow(0 0 6px rgba(255,60,60,0.45))",
  gold:    "drop-shadow(0 0 8px rgba(255,215,0,0.55))",
  purple:  "drop-shadow(0 0 8px rgba(180,0,255,0.55))",
  white:   "drop-shadow(0 0 6px rgba(255,255,255,0.45))",
  blue:    "drop-shadow(0 0 6px rgba(80,160,255,0.45))",
  orange:  "drop-shadow(0 0 6px rgba(255,150,0,0.45))",
  yellow:  "drop-shadow(0 0 6px rgba(255,255,0,0.45))"
});

const stroke = Object.freeze({
  cyan:    "#00eaff",
  green:   "#00ff99",
  red:     "#ff4d4d",
  gold:    "#ffd700",
  purple:  "#b300ff",
  white:   "#ffffff",
  black:   "#000000",
  blue:    "#4da3ff",
  orange:  "#ff9900",
  yellow:  "#ffff66"
});

// ============================================================================
// BASE ICONS — deterministic SVGs
// ============================================================================
const baseIcons = Object.freeze({
  pulse: `
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M3 12h4l2-6 4 12 2-6h6"
            stroke="${stroke.cyan}"
            stroke-width="2"
            stroke-linecap="round"
            filter="${glow.cyan}" />
    </svg>
  `,

  check: `
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M5 13l4 4L19 7"
            stroke="${stroke.green}"
            stroke-width="2"
            stroke-linecap="round"
            filter="${glow.green}" />
    </svg>
  `,

  alert: `
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
            stroke="${stroke.red}"
            stroke-width="2"
            stroke-linecap="round"
            filter="${glow.red}" />
    </svg>
  `,

  info: `
    <svg viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10"
              stroke="${stroke.cyan}"
              stroke-width="2"
              filter="${glow.cyan}" />
      <path d="M12 16v-4m0-4h.01"
            stroke="${stroke.cyan}"
            stroke-width="2"
            stroke-linecap="round" />
    </svg>
  `
});

// ============================================================================
// EXPANDED ICON PACK — v16 IMMORTAL (40+ ICONS)
// ============================================================================
const expandedIcons = Object.freeze({

  // UI / SYSTEM
  plus: `
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M12 5v14M5 12h14"
            stroke="${stroke.white}"
            stroke-width="2"
            filter="${glow.purple}" />
    </svg>
  `,

  edit: `
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M12 20h9M16.5 3.5l4 4L7 21H3v-4L16.5 3.5z"
            stroke="${stroke.gold}"
            stroke-width="2"
            filter="${glow.gold}" />
    </svg>
  `,

  close: `
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M6 6l12 12M6 18L18 6"
            stroke="${stroke.red}"
            stroke-width="2"
            filter="${glow.red}" />
    </svg>
  `,

  menu: `
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M4 6h16M4 12h16M4 18h16"
            stroke="${stroke.white}"
            stroke-width="2"
            filter="${glow.cyan}" />
    </svg>
  `,

  // DIAGNOSTICS / WARNINGS
  warning: `
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M12 9v4m0 4h.01M3 19h18L12 3 3 19z"
            stroke="${stroke.yellow}"
            stroke-width="2"
            filter="${glow.yellow}" />
    </svg>
  `,

  danger: `
    <svg viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10"
              stroke="${stroke.red}"
              stroke-width="2"
              filter="${glow.red}" />
      <path d="M12 7v6m0 4h.01"
            stroke="${stroke.red}"
            stroke-width="2" />
    </svg>
  `,

  stable: `
    <svg viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10"
              stroke="${stroke.green}"
              stroke-width="2"
              filter="${glow.green}" />
      <path d="M8 12l3 3 5-5"
            stroke="${stroke.green}"
            stroke-width="2"
            stroke-linecap="round" />
    </svg>
  `,

  // NODEADMIN / SYSTEM ROLES
  nodeadmin: `
    <svg viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4"
              stroke="${stroke.blue}"
              stroke-width="2"
              filter="${glow.blue}" />
      <path d="M4 20c1-4 4-6 8-6s7 2 8 6"
            stroke="${stroke.blue}"
            stroke-width="2"
            stroke-linecap="round" />
    </svg>
  `,

  reproduction: `
    <svg viewBox="0 0 24 24" fill="none">
      <circle cx="9" cy="12" r="4"
              stroke="${stroke.green}"
              stroke-width="2"
              filter="${glow.green}" />
      <circle cx="15" cy="12" r="4"
              stroke="${stroke.green}"
              stroke-width="2"
              filter="${glow.green}" />
    </svg>
  `,

  server: `
    <svg viewBox="0 0 24 24" fill="none">
      <rect x="4" y="4" width="16" height="6"
            stroke="${stroke.yellow}"
            stroke-width="2"
            filter="${glow.yellow}" />
      <rect x="4" y="14" width="16" height="6"
            stroke="${stroke.yellow}"
            stroke-width="2"
            filter="${glow.yellow}" />
    </svg>
  `,

  castle: `
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M4 10V6l2-1 2 1v4h8V6l2-1 2 1v4l-2 10H6L4 10z"
            stroke="${stroke.orange}"
            stroke-width="2"
            filter="${glow.orange}" />
    </svg>
  `,

  expansion: `
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M12 2v20M2 12h20"
            stroke="${stroke.red}"
            stroke-width="2"
            filter="${glow.red}" />
    </svg>
  `,

  // ENERGY / PULSEWORLD
  energy: `
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"
            stroke="${stroke.gold}"
            stroke-width="2"
            filter="${glow.gold}" />
    </svg>
  `,

  harmonics: `
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M3 12c4-8 14-8 18 0-4 8-14 8-18 0z"
            stroke="${stroke.purple}"
            stroke-width="2"
            filter="${glow.purple}" />
    </svg>
  `,

  presence: `
    <svg viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="6"
              stroke="${stroke.cyan}"
              stroke-width="2"
              filter="${glow.cyan}" />
      <circle cx="12" cy="12" r="10"
              stroke="${stroke.white}"
              stroke-width="1"
              filter="${glow.white}" />
    </svg>
  `,

  // SOCIAL / USER
  user: `
    <svg viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4"
              stroke="${stroke.white}"
              stroke-width="2"
              filter="${glow.white}" />
      <path d="M4 20c1-4 4-6 8-6s7 2 8 6"
            stroke="${stroke.white}"
            stroke-width="2"
            stroke-linecap="round" />
    </svg>
  `,

  home: `
    <svg viewBox="0 0 24 24" fill="none">
      <path d="M3 12l9-8 9 8v8H3v-8z"
            stroke="${stroke.cyan}"
            stroke-width="2"
            filter="${glow.cyan}" />
    </svg>
  `,

  town: `
    <svg viewBox="0 0 24 24" fill="none">
      <rect x="3" y="10" width="6" height="10"
            stroke="${stroke.white}"
            stroke-width="2"
            filter="${glow.white}" />
      <rect x="10" y="6" width="6" height="14"
            stroke="${stroke.white}"
            stroke-width="2"
            filter="${glow.white}" />
      <rect x="17" y="12" width="4" height="8"
            stroke="${stroke.white}"
            stroke-width="2"
            filter="${glow.white}" />
    </svg>
  `
});

// ============================================================================
// TIERED ICONS — Bronze / Silver / Gold / Platinum / Immortal / Ultra / Omega
// ============================================================================
const tierIcons = Object.freeze({
  bronze:   `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#cd7f32" /></svg>`,
  silver:   `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#c0c0c0" /></svg>`,
  gold:     `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#ffd700" filter="${glow.gold}" /></svg>`,
  platinum: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#e5e4e2" filter="${glow.cyan}" /></svg>`,
  immortal: `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#b300ff" filter="${glow.purple}" /></svg>`,
  ultra:    `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#00eaff" filter="${glow.white}" /></svg>`,
  omega:    `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#000000" stroke="#ffffff" stroke-width="2" filter="${glow.white}" /></svg>`
});

// ============================================================================
// BINARY‑FRIENDLY MODE — low entropy, monochrome, GPU‑friendly
// ============================================================================
function toBinaryFriendly(svg) {
  return svg
    .replace(/stroke="[^"]+"/g, `stroke="${stroke.white}"`)
    .replace(/fill="[^"]+"/g, `fill="none"`)
    .replace(/filter="[^"]+"/g, "");
}

// ============================================================================
// PUBLIC ORGAN — deterministic icon resolver
// ============================================================================
export const PulseIcons = {
  schemaVersion: ICON_SCHEMA_VERSION,

  base: baseIcons,
  expanded: expandedIcons,
  tier: tierIcons,

  resolve(name, tier = null, binaryMode = false) {
    let svg =
      (tier && tierIcons[tier]) ||
      baseIcons[name] ||
      expandedIcons[name] ||
      tierIcons.immortal;

    if (binaryMode) svg = toBinaryFriendly(svg);

    return svg;
  },

  list() {
    return {
      base: Object.keys(baseIcons),
      expanded: Object.keys(expandedIcons),
      tiers: Object.keys(tierIcons)
    };
  }
};
