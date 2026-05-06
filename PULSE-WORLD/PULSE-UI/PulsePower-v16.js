// ============================================================================
// FILE: /PULSE-PORTAL/PulsePower-v16.js
// LAYER: PULSE-PORTAL — PRESENTATION / POWER LAYER (IMMORTAL v16)
// ----------------------------------------------------------------------------
// ROLE:
//   - Presentation-side “Power” organ for Pulse OS v16.
//   - Takes all prewarm + chunking signals and turns them into:
//       * DOM hints (preload, prefetch, priority)
//       * Route + page + asset memory
//       * Cross-layer prewarm hints for router / pages / images / fonts
//   - Bridges 32-lane chunkers ↔ CoreMemory via coreMemoryBridge.
//   - Deterministic, symbolic, no randomness, no network fetch logic.
// ============================================================================
import { PulseProofBridge as PulseCoreMemoryBridge } from "./_BACKEND/PulseProofBridge.js";

export const PulsePowerRole = Object.freeze({
  type: "Organ",
  subsystem: "PulsePortal",
  layer: "PresentationPower",
  version: "v16-Immortal",
  identity: "PulsePower-v16",
  evo: Object.freeze({
    deterministic: true,
    driftProof: true,
    immortalReady: true,
    presentationLayer: true,
    prewarmAware: true,
    chunkFieldAware: true,
    routeMemoryAware: true,
    assetMemoryAware: true,
    multiPageAware: true,
    multiInstanceReady: true,

    dualBand: true,
    symbolicAware: true,
    binaryAware: false,

    zeroRandomness: true,
    zeroEval: true,
    zeroDynamicImports: true
  })
});

// ============================================================================
// CORE MEMORY BRIDGE (frontend-safe wrapper)
// ============================================================================

let coreMemory = PulseCoreMemoryBridge.coreMemory || null;

function cmRead(key, fallback = null) {
  if (!coreMemory || typeof coreMemory.read !== "function") return fallback;
  try {
    const v = coreMemory.read(key);
    return v == null ? fallback : v;
  } catch {
    return fallback;
  }
}

function cmWrite(key, value) {
  if (!coreMemory || typeof coreMemory.write !== "function") return false;
  try {
    return coreMemory.write(key, value);
  } catch {
    return false;
  }
}

function cmStart() {
  if (!coreMemory || typeof coreMemory.start !== "function") return false;
  try {
    return coreMemory.start();
  } catch {
    return false;
  }
}

// ============================================================================
// CONSTANTS / KEYS
// ============================================================================

const POWER_ROUTE_KEY = "pulse:power:v16";

const KEY_POWER_STATE = `${POWER_ROUTE_KEY}:state`;
const KEY_POWER_HISTORY = `${POWER_ROUTE_KEY}:history`;
const KEY_POWER_PREDICTIONS = `${POWER_ROUTE_KEY}:predictions`;
const KEY_POWER_ASSETS = `${POWER_ROUTE_KEY}:assets`;
const KEY_POWER_CHUNK_HINTS = `${POWER_ROUTE_KEY}:chunkHints`;

const DEFAULT_LANES = {
  frontChunkLanes: 32,
  backChunkLanes: 32,
  aiChunkLanes: 32,
  backendChunkLanes: 32 // if unused, stays symbolic
};

// ============================================================================
// TYPES (logical, not enforced)
// ============================================================================
//
// PowerState {
//   currentPageId: string
//   currentRoute: string
//   lastTouchTs: number
//   lanes: { frontChunkLanes, backChunkLanes, aiChunkLanes, backendChunkLanes }
// }
//
// PowerHistory {
//   pages: string[]
//   routes: string[]
// }
//
// PowerPredictions {
//   nextPages: string[]
//   nextRoutes: string[]
// }
//
// PowerAssets {
//   byPage: {
//     [pageId]: {
//       images: string[]
//       fonts: string[]
//       scripts: string[]
//       styles: string[]
//     }
//   }
// }
//
// PowerChunkHints {
//   lanes: { ...DEFAULT_LANES }
//   prewarmTargets: {
//     pages: string[]
//     routes: string[]
//     images: string[]
//     fonts: string[]
//   }
// }

// ============================================================================
// HELPERS
// ============================================================================

function nowTs() {
  // deterministic enough for ordering; not used for physics
  return Date.now ? Date.now() : 0;
}

function clone(obj) {
  try {
    return JSON.parse(JSON.stringify(obj || {}));
  } catch {
    return {};
  }
}

function uniqueList(list) {
  const seen = new Set();
  const out = [];
  for (const v of list || []) {
    if (v == null) continue;
    const s = String(v);
    if (seen.has(s)) continue;
    seen.add(s);
    out.push(s);
  }
  return out;
}

function safePush(list, value) {
  if (!value && value !== 0) return;
  list.push(value);
}

// ============================================================================
// POWER STATE LOAD / SAVE
// ============================================================================

function loadPowerState() {
  const state = cmRead(KEY_POWER_STATE, null);
  if (state && typeof state === "object") return state;

  const fresh = {
    currentPageId: null,
    currentRoute: null,
    lastTouchTs: 0,
    lanes: clone(DEFAULT_LANES)
  };
  cmWrite(KEY_POWER_STATE, fresh);
  return fresh;
}

function savePowerState(state) {
  cmWrite(KEY_POWER_STATE, state);
}

function loadPowerHistory() {
  const hist = cmRead(KEY_POWER_HISTORY, null);
  if (hist && typeof hist === "object") return hist;
  const fresh = { pages: [], routes: [] };
  cmWrite(KEY_POWER_HISTORY, fresh);
  return fresh;
}

function savePowerHistory(hist) {
  cmWrite(KEY_POWER_HISTORY, hist);
}

function loadPowerPredictions() {
  const pred = cmRead(KEY_POWER_PREDICTIONS, null);
  if (pred && typeof pred === "object") return pred;
  const fresh = { nextPages: [], nextRoutes: [] };
  cmWrite(KEY_POWER_PREDICTIONS, fresh);
  return fresh;
}

function savePowerPredictions(pred) {
  cmWrite(KEY_POWER_PREDICTIONS, pred);
}

function loadPowerAssets() {
  const assets = cmRead(KEY_POWER_ASSETS, null);
  if (assets && typeof assets === "object") return assets;
  const fresh = { byPage: {} };
  cmWrite(KEY_POWER_ASSETS, fresh);
  return fresh;
}

function savePowerAssets(assets) {
  cmWrite(KEY_POWER_ASSETS, assets);
}

function saveChunkHints(hints) {
  cmWrite(KEY_POWER_CHUNK_HINTS, hints);
}

// ============================================================================
// PREDICTION / ROUTE MEMORY
// ============================================================================

function updateHistoryAndPredictions({ pageId, route }) {
  const history = loadPowerHistory();
  const predictions = loadPowerPredictions();

  if (pageId) safePush(history.pages, pageId);
  if (route) safePush(history.routes, route);

  history.pages = history.pages.slice(-64);
  history.routes = history.routes.slice(-64);

  // naive prediction: last 4 pages/routes as “next”
  const nextPages = history.pages.slice(-4);
  const nextRoutes = history.routes.slice(-4);

  predictions.nextPages = uniqueList(nextPages);
  predictions.nextRoutes = uniqueList(nextRoutes);

  savePowerHistory(history);
  savePowerPredictions(predictions);

  return { history, predictions };
}

// ============================================================================
// ASSET REGISTRATION
// ============================================================================

function registerPageAssets(pageId, assets = {}) {
  if (!pageId) return;

  const powerAssets = loadPowerAssets();
  const byPage = powerAssets.byPage || {};

  const existing = byPage[pageId] || {
    images: [],
    fonts: [],
    scripts: [],
    styles: []
  };

  const merged = {
    images: uniqueList([...(existing.images || []), ...(assets.images || [])]),
    fonts: uniqueList([...(existing.fonts || []), ...(assets.fonts || [])]),
    scripts: uniqueList([
      ...(existing.scripts || []),
      ...(assets.scripts || [])
    ]),
    styles: uniqueList([...(existing.styles || []), ...(assets.styles || [])])
  };

  byPage[pageId] = merged;
  powerAssets.byPage = byPage;
  savePowerAssets(powerAssets);
}

function collectPrewarmAssets(predictions) {
  const powerAssets = loadPowerAssets();
  const byPage = powerAssets.byPage || {};

  const images = [];
  const fonts = [];

  for (const pid of predictions.nextPages || []) {
    const a = byPage[pid];
    if (!a) continue;
    for (const img of a.images || []) safePush(images, img);
    for (const f of a.fonts || []) safePush(fonts, f);
  }

  return {
    images: uniqueList(images),
    fonts: uniqueList(fonts)
  };
}

// ============================================================================
// CHUNK HINTS (32-lane fields)
// ============================================================================

function buildChunkHints({ state, predictions, assets }) {
  const lanes = state.lanes || clone(DEFAULT_LANES);

  const prewarmTargets = {
    pages: uniqueList(predictions.nextPages || []),
    routes: uniqueList(predictions.nextRoutes || []),
    images: uniqueList(assets.images || []),
    fonts: uniqueList(assets.fonts || [])
  };

  const hints = {
    lanes,
    prewarmTargets
  };

  saveChunkHints(hints);
  return hints;
}

// ============================================================================
// DOM INTEGRATION (presentation only, no network logic)
// ============================================================================

function safeDoc(doc) {
  if (!doc && typeof document !== "undefined") return document;
  return doc || null;
}

function ensureHead(doc) {
  const d = safeDoc(doc);
  if (!d) return null;
  return d.head || d.getElementsByTagName("head")[0] || null;
}

function createLink(doc, attrs) {
  const d = safeDoc(doc);
  if (!d) return null;
  const el = d.createElement("link");
  Object.entries(attrs || {}).forEach(([k, v]) => {
    if (v == null) return;
    el.setAttribute(k, String(v));
  });
  return el;
}

function applyPrewarmToDOM({ predictions, assets }, doc) {
  const d = safeDoc(doc);
  const head = ensureHead(d);
  if (!d || !head) return;

  // Mark body with power attributes
  if (d.body) {
    d.body.setAttribute("data-pulse-power-version", PulsePowerRole.version);
    d.body.setAttribute(
      "data-pulse-power-next-pages",
      (predictions.nextPages || []).join(",")
    );
    d.body.setAttribute(
      "data-pulse-power-next-routes",
      (predictions.nextRoutes || []).join(",")
    );
  }

  // Preload images
  for (const img of assets.images || []) {
    const link = createLink(d, {
      rel: "preload",
      as: "image",
      href: img
    });
    if (link) head.appendChild(link);
  }

  // Preload fonts
  for (const font of assets.fonts || []) {
    const link = createLink(d, {
      rel: "preload",
      as: "font",
      href: font,
      crossorigin: "anonymous"
    });
    if (link) head.appendChild(link);
  }
}

// ============================================================================
// TOUCH / ENTRYPOINT
// ============================================================================
//
// This is the “cookie touch” / early ping surface.
// Call this as early as possible (before page fully loads) with:
//   - pageId
//   - route
//   - assets (optional)
//   - doc (optional, for SSR/CSR flexibility)
//

export function pulsePowerTouch({
  pageId,
  route,
  assets,
  doc
} = {}) {
  cmStart(); // start core memory session if available

  const state = loadPowerState();
  state.currentPageId = pageId || state.currentPageId || null;
  state.currentRoute = route || state.currentRoute || null;
  state.lastTouchTs = nowTs();
  savePowerState(state);

  if (pageId && assets) {
    registerPageAssets(pageId, assets);
  }

  const { predictions } = updateHistoryAndPredictions({
    pageId: state.currentPageId,
    route: state.currentRoute
  });

  const prewarmAssets = collectPrewarmAssets(predictions);
  const chunkHints = buildChunkHints({
    state,
    predictions,
    assets: prewarmAssets
  });

  applyPrewarmToDOM({ predictions, assets: prewarmAssets }, doc);

  return {
    ok: true,
    role: PulsePowerRole.identity,
    state,
    predictions,
    prewarmAssets,
    chunkHints
  };
}

// ============================================================================
// FULL POWER SNAPSHOT (for other layers to read)
// ============================================================================

export function getPulsePowerSnapshot() {
  const state = loadPowerState();
  const history = loadPowerHistory();
  const predictions = loadPowerPredictions();
  const assets = loadPowerAssets();
  const chunkHints = cmRead(KEY_POWER_CHUNK_HINTS, {
    lanes: clone(DEFAULT_LANES),
    prewarmTargets: { pages: [], routes: [], images: [], fonts: [] }
  });

  return {
    role: PulsePowerRole,
    state,
    history,
    predictions,
    assets,
    chunkHints
  };
}

// ============================================================================
// DEFAULT EXPORT
// ============================================================================

const PulsePowerAPI = {
  PulsePowerRole,
  pulsePowerTouch,
  getPulsePowerSnapshot
};

export default PulsePowerAPI;
