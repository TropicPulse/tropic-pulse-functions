
// ============================================================================
// FILE: tropic-pulse-functions/PULSE-WORLD/PULSE-EARN/PulseEarnEndocrineSystem-v12.3-PRESENCE-EVO+-AGGRESSIVE.js
// LAYER: THE ENDOCRINE SYSTEM (v12.3-PRESENCE-EVO+ AGGRESSIVE)
// (Performance Intelligence + Reputation Hormones + Trust Regulation)
// ============================================================================
//
// ROLE (v12.3-PRESENCE-EVO+ AGGRESSIVE):
//   THE ENDOCRINE SYSTEM — Pulse‑Earn’s long-term performance regulator.
//   • Tracks marketplace reliability and profitability (hormone sensing).
//   • Computes normalized performance signals (signal transduction).
//   • Applies weighted scoring to determine trust (hormonal modulation).
//   • Blends historical + recent performance (EMA).
//   • Modulates EMA aggressively using presence/advantage/hints surfaces.
//   • Maintains in‑memory reputation for long-term intelligence.
//   • Emits v12.3‑Presence‑EVO+ hormonal signatures + binary/wave fields.
//
// CONTRACT (v12.3-PRESENCE-EVO+):
//   • PURE INTELLIGENCE ENGINE — no AI layers, no translation, no memory model.
//   • READ-ONLY except deterministic reputation updates.
//   • NO eval(), NO Function(), NO dynamic imports.
//   • NO executing user code.
//   • NO filesystem, NO timestamps.
//   • Deterministic scoring only.
//   • Presence/advantage/hints are deterministic inputs.
// ============================================================================
export const PulseEarnEndocrineSystemMeta = Object.freeze({
  layer: "PulseEarnEndocrineSystem",
  role: "EARN_ENDOCRINE_ORGAN",
  version: "v12.3-PRESENCE-EVO+",
  identity: "PulseEarnEndocrineSystem-v12.3-PRESENCE-EVO+-AGGRESSIVE",

  guarantees: Object.freeze({
    deterministic: true,
    noRandomness: true,
    noRealTime: true,
    noExternalIO: true,
    pureIntelligenceEngine: true,
    reputationAware: true,
    dualBandAware: true,
    binaryAware: true,
    waveFieldAware: true,
    healingMetadataAware: true,
    presenceAware: true,
    advantageAware: true,
    hintsAware: true,
    meshAware: true,
    castleAware: true,
    regionAware: true,
    worldLensAware: false
  }),

  contract: Object.freeze({
    input: [
      "MarketplaceId",
      "EndocrineSignals",
      "DualBandContext",
      "GlobalHintsPresenceField"
    ],
    output: [
      "ReputationScore",
      "EndocrineDiagnostics",
      "EndocrineSignatures"
    ]
  }),

  lineage: Object.freeze({
    root: "PulseOS-v11-EVO",
    parent: "PulseEarn-v12.3-PRESENCE-EVO+",
    ancestry: [
      "PulseEarnEndocrineSystem-v10",
      "PulseEarnEndocrineSystem-v11",
      "PulseEarnEndocrineSystem-v11-Evo"
    ]
  }),

  bands: Object.freeze({
    supported: ["symbolic", "binary"],
    default: "symbolic",
    behavior: "metadata-only"
  }),

  architecture: Object.freeze({
    pattern: "A-B-A",
    baseline: "deterministic reputation scoring",
    adaptive: "EMA blending + binary/wave + presence/advantage modulation",
    return: "stable reputation signal for routing/selection"
  })
});

// ============================================================================
// Constants — Endocrine Baselines
// ============================================================================
const DEFAULT_REPUTATION = 0.5;

// In-memory endocrine hormone store (now keyed by `${id}::${band}`)
let reputation = new Map();

// ============================================================================
// Healing Metadata — Endocrine Activity Log (v12.3-PRESENCE-EVO+)
// ============================================================================
const endocrineHealing = {
  lastMarketplaceId: null,
  lastBand: "symbolic",
  lastReputationBefore: null,
  lastReputationAfter: null,
  lastSignals: null,
  lastLoadError: null,
  lastSaveError: null,
  cycleCount: 0,

  lastHormoneSignature: null,
  lastSignalSignature: null,
  lastReputationSignature: null,
  lastEndocrineCycleSignature: null,
  lastBandSignature: null,

  lastBinaryField: null,
  lastWaveField: null,

  // Presence-EVO+ aggressive additions
  lastPresenceField: null,
  lastAdvantageField: null,
  lastHintsField: null,
  lastHormonalFactors: null
};

// ============================================================================
// Deterministic Hash Helper
// ============================================================================
function computeHash(str) {
  let h = 0;
  const s = String(str || "");
  for (let i = 0; i < s.length; i++) {
    h = (h + s.charCodeAt(i) * (i + 1)) % 100000;
  }
  return `h${h}`;
}

function normalizeBand(band) {
  const b = String(band || "symbolic").toLowerCase();
  return b === "binary" ? "binary" : "symbolic";
}

function makeReputationKey(id, band) {
  return `${id}::${band}`;
}

// ============================================================================
// Presence / Advantage / Hints Surfaces (metadata-only inputs)
// ============================================================================
function buildPresenceField(globalHints = {}) {
  const gh = globalHints.presenceContext || {};
  const mesh = globalHints.meshSignals || {};
  const castle = globalHints.castleSignals || {};
  const region = globalHints.regionContext || {};

  return {
    bandPresence: gh.bandPresence || "unknown",
    routerPresence: gh.routerPresence || "unknown",
    devicePresence: gh.devicePresence || "unknown",
    meshPresence: mesh.meshStrength || "unknown",
    castlePresence: castle.castlePresence || "unknown",
    regionPresence: region.regionTag || "unknown",
    regionId: region.regionId || "unknown-region",
    castleId: castle.castleId || "unknown-castle",
    castleLoadLevel: castle.loadLevel || 0,
    meshStrength: mesh.meshStrength || 0,
    meshPressureIndex: mesh.meshPressureIndex || 0
  };
}

function buildAdvantageField(globalHints = {}) {
  const adv = globalHints.advantageContext || {};
  return {
    advantageScore: adv.score ?? 0,
    advantageBand: adv.band ?? "neutral",
    advantageTier: adv.tier ?? 0
  };
}

function buildHintsField(globalHints = {}) {
  return {
    fallbackBandLevel: globalHints.fallbackBandLevel ?? 0,
    chunkHints: globalHints.chunkHints || {},
    cacheHints: globalHints.cacheHints || {},
    prewarmHints: globalHints.prewarmHints || {},
    coldStartHints: globalHints.coldStartHints || {}
  };
}

// Aggressive hormonal factor computation (B2 profile)
function computeHormonalFactors({ band, presenceField, advantageField, hintsField }) {
  const meshPressure = presenceField.meshPressureIndex || 0;      // 0–100
  const castleLoad = presenceField.castleLoadLevel || 0;          // 0–100
  const regionPresence = presenceField.regionPresence || "unknown";

  const advantageTier = Number(advantageField.advantageTier || 0);
  const fallbackBandLevel = Number(hintsField.fallbackBandLevel || 0);

  // 1. Mesh Pressure → strong amplification
  const meshFactor = 1 + (meshPressure / 50); // 0..100 → 1..3

  // 2. Castle Load → strong dampening
  const castleFactor = 1 - (castleLoad / 100); // 0..100 → 1..0

  // 3. Advantage Tier → strong amplification
  const advantageFactor = 1 + (advantageTier * 0.15); // tier 3 → +45%

  // 4. Fallback Band Level → strong stabilizer
  const fallbackFactor = 1 - (fallbackBandLevel * 0.1); // level 3 → -30%

  // 5. Region Presence → bias
  let regionFactor = 1.0;
  if (regionPresence === "home") regionFactor = 1.1;
  else if (regionPresence === "foreign") regionFactor = 0.9;
  else regionFactor = 0.95;

  // 6. EMA blend based on band
  const emaBlend = band === "binary" ? 0.5 : 0.7;

  return {
    meshFactor,
    castleFactor,
    advantageFactor,
    fallbackFactor,
    regionFactor,
    emaBlend
  };
}

// ============================================================================
// Signature Builders
// ============================================================================
function buildHormoneSignature(id, cycle) {
  return computeHash(`ENDO::${id}::${cycle}`);
}

function buildSignalSignature(signals) {
  return computeHash(`SIG::${JSON.stringify(signals)}`);
}

function buildReputationSignature(id, rep, band) {
  return computeHash(`REP::${id}::${band}::${rep}`);
}

function buildEndocrineCycleSignature(cycle, band) {
  return computeHash(`ENDO_CYCLE::${cycle}::${band}`);
}

// ============================================================================
// Load reputation — Endocrine Memory Recall (in-memory only)
// ============================================================================
export function loadPulseEarnReputation() {
  reputation = reputation || new Map();
  endocrineHealing.lastLoadError = null;
}

// ============================================================================
// Save reputation — Endocrine Persistence (no-op)
// ============================================================================
function savePulseEarnReputation() {
  endocrineHealing.lastSaveError = null;
}

// ============================================================================
// Get current reputation — Hormone Level Lookup (band-aware)
// ============================================================================
export function getPulseEarnReputation(id, band = "symbolic") {
  const normalizedBand = normalizeBand(band);
  const key = makeReputationKey(id, normalizedBand);
  return Number(reputation.get(key)) || DEFAULT_REPUTATION;
}

// ============================================================================
// Update reputation — Endocrine Regulation Cycle (v12.3-PRESENCE-EVO+ AGGRESSIVE)
// signals: { latency, apiSuccess, jobQuality, profitability, jobSuccess, band? }
// globalHints: Presence/Advantage/Hints surfaces
// ============================================================================
export function updatePulseEarnReputation(id, signals, globalHints = {}) {
  endocrineHealing.cycleCount++;
  endocrineHealing.lastMarketplaceId = id;
  endocrineHealing.lastSignals = { ...signals };

  const band = normalizeBand(signals?.band);
  endocrineHealing.lastBand = band;
  endocrineHealing.lastBandSignature = computeHash(`BAND::${band}`);

  const current = getPulseEarnReputation(id, band);
  endocrineHealing.lastReputationBefore = current;

  endocrineHealing.lastSignalSignature = buildSignalSignature(signals);

  // Hormonal weighting coefficients (unchanged core endocrine math)
  const weights = {
    latency: 0.15,
    apiSuccess: 0.2,
    jobQuality: 0.25,
    profitability: 0.25,
    jobSuccess: 0.15
  };

  // Hormonal signal transduction (base score)
  const score =
    (signals.latency ?? 0) * weights.latency +
    (signals.apiSuccess ?? 0) * weights.apiSuccess +
    (signals.jobQuality ?? 0) * weights.jobQuality +
    (signals.profitability ?? 0) * weights.profitability +
    (signals.jobSuccess ?? 0) * weights.jobSuccess;

  // Presence/Advantage/Hints surfaces
  const presenceField = buildPresenceField(globalHints);
  const advantageField = buildAdvantageField(globalHints);
  const hintsField = buildHintsField(globalHints);

  // Aggressive hormonal factors
  const hormonalFactors = computeHormonalFactors({
    band,
    presenceField,
    advantageField,
    hintsField
  });

  // EMA blending with band-aware aggressiveness
  const emaBlend = hormonalFactors.emaBlend;
  let updated = current * emaBlend + score * (1 - emaBlend);

  // Aggressive modulation
  updated *= hormonalFactors.meshFactor;
  updated *= hormonalFactors.castleFactor;
  updated *= hormonalFactors.advantageFactor;
  updated *= hormonalFactors.fallbackFactor;
  updated *= hormonalFactors.regionFactor;

  const clamped = clamp(updated, 0, 1);

  const key = makeReputationKey(id, band);
  reputation.set(key, clamped);
  endocrineHealing.lastReputationAfter = clamped;

  endocrineHealing.lastHormoneSignature = buildHormoneSignature(
    id,
    endocrineHealing.cycleCount
  );

  endocrineHealing.lastReputationSignature = buildReputationSignature(
    id,
    clamped,
    band
  );

  endocrineHealing.lastEndocrineCycleSignature = buildEndocrineCycleSignature(
    endocrineHealing.cycleCount,
    band
  );

  // Binary surface for endocrine reputation (structural only)
  const surface = clamped * 1000 + endocrineHealing.cycleCount;
  const binaryField = {
    binaryReputationSignature: computeHash(
      `BREP::${id}::${band}::${clamped}`
    ),
    binarySurfaceSignature: computeHash(`BSURF::${surface}`),
    binarySurface: {
      reputation: clamped,
      cycle: endocrineHealing.cycleCount,
      surface
    },
    parity: surface % 2 === 0 ? 0 : 1,
    density: clamped,
    shiftDepth: Math.max(0, Math.floor(Math.log2(surface || 1)))
  };
  endocrineHealing.lastBinaryField = binaryField;

  // Wave field for endocrine reputation (wave-theory metadata)
  const waveField = {
    amplitude: clamped,
    wavelength: endocrineHealing.cycleCount,
    phase:
      (Math.floor(clamped * 100) + endocrineHealing.cycleCount) % 8,
    band,
    mode: band === "binary" ? "compression-wave" : "symbolic-wave"
  };
  endocrineHealing.lastWaveField = waveField;

  // Store presence/advantage/hints + hormonal factors in healing
  endocrineHealing.lastPresenceField = presenceField;
  endocrineHealing.lastAdvantageField = advantageField;
  endocrineHealing.lastHintsField = hintsField;
  endocrineHealing.lastHormonalFactors = hormonalFactors;

  savePulseEarnReputation();

  return clamped;
}

// ============================================================================
// Normalization Helpers — Endocrine Signal Processing
// ============================================================================
function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

export function computePulseEarnReputationSignals({
  latencyMs,
  apiErrors,
  jobsReturned,
  profitableJobs,
  jobSuccessRate,
  avgProfitPerJob
}) {
  return {
    latency: latencyMs != null ? normalizeLatency(latencyMs) : 0.5,
    apiSuccess: apiErrors != null ? normalizeApiErrors(apiErrors) : 0.5,
    jobQuality: jobsReturned != null ? normalizeJobQuality(jobsReturned) : 0.5,
    profitability:
      avgProfitPerJob != null ? normalizeProfit(avgProfitPerJob) : 0.5,
    jobSuccess: jobSuccessRate != null ? clamp(jobSuccessRate, 0, 1) : 0.5
  };
}

// ============================================================================
// Normalizers — Endocrine Signal Processing
// ============================================================================
function normalizeLatency(ms) {
  if (ms < 200) return 1;
  if (ms < 500) return 0.8;
  if (ms < 1000) return 0.6;
  if (ms < 1500) return 0.4;
  return 0.2;
}

function normalizeApiErrors(errors) {
  if (errors === 0) return 1;
  if (errors <= 2) return 0.8;
  if (errors <= 5) return 0.5;
  return 0.2;
}

function normalizeJobQuality(count) {
  if (count > 20) return 1;
  if (count > 10) return 0.8;
  if (count > 5) return 0.6;
  return 0.3;
}

function normalizeProfit(p) {
  if (p > 5) return 1;
  if (p > 2) return 0.8;
  if (p > 1) return 0.6;
  return 0.3;
}

// ============================================================================
// Export Healing Metadata — Endocrine Report (v12.3-PRESENCE-EVO+)
// ============================================================================
export function getPulseEarnReputationHealingState() {
  return { ...endocrineHealing };
}

// ============================================================================
// v12.3 COMPAT ALIASES — for Nervous System imports
// ============================================================================
export function updateMarketplaceReputation(id, signals, globalHints = {}) {
  return updatePulseEarnReputation(id, signals, globalHints);
}

export function computeReputationSignals(args) {
  return computePulseEarnReputationSignals(args);
}
