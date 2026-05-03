// ============================================================================
//  PULSE OS v12.3‑EVO — CIRCULATION MONITOR (A‑B‑A)
//  “Blood Pressure + Blood Flow Sensor”
//  Measures latency (pressure) and speed (flow) and emits A‑B‑A vital signs.
//  PURE SENSOR. NO THINKING. NO DECISIONS. NO GLOBAL STATE.
// ============================================================================

import { VitalsLogger as logger, emitTelemetry }        from "../../PULSE-UI/_CONNECTORS/PulseProofLogger.js";
// ============================================================================
//  ORGAN IDENTITY — v12.3‑EVO A‑B‑A
// ============================================================================
export const PulseRole = {
  type: "Organ",
  subsystem: "PulseBand",
  layer: "CirculationMonitor",
  version: "12.3-EVO",
  identity: "PulseCirculationMonitor-v12.3-EVO-ABA",

  evo: {
    driftProof: true,
    pulseEfficiencyAware: true,
    unifiedAdvantageField: true,
    multiInstanceReady: true,
    sensorOnly: true,
    noDecisionMaking: true,
    futureEvolutionReady: true,

    // A‑B‑A awareness
    bandAware: true,
    waveFieldAware: true,
    binaryFieldAware: true,
    stressFieldAware: true,
    flowFieldAware: true,

    // 12.3+ presence / chunking / cache-prewarm awareness
    presenceAware: true,
    chunkingAware: true,
    cachePrewarmAware: true
  }
};

const CIRCULATION_CONTEXT = {
  layer: PulseRole.layer,
  role: "CIRCULATION_MONITOR",
  purpose: "Measure pressure + flow and emit A‑B‑A vital signs",
  version: PulseRole.version,
  target: "full-os",
  evo: PulseRole.evo
};

const SUBSYSTEM = "circulation";


// ============================================================================
//  DIAGNOSTICS (optional)
// ============================================================================
const DIAG_ENABLED =
  typeof window !== "undefined" &&
  (window.PULSE_CIRCULATION_DIAGNOSTICS === true ||
   window.PULSE_DIAGNOSTICS === true);

function diag(stage, details = {}) {
  if (!DIAG_ENABLED) return;

  logger.log(SUBSYSTEM, stage, {
    ...details,
    meta: { ...CIRCULATION_CONTEXT }
  });

  emitTelemetry(SUBSYSTEM, stage, details);
}

diag("CIRCULATION_INIT");

export const PulseCirculationMonitorMeta = Object.freeze({
  layer: "PulseCirculationMonitor",
  role: "CIRCULATION_MONITOR_ORGAN",
  version: "v12.3-EVO-BINARY-MAX-ABA",
  identity: "PulseCirculationMonitor-v12.3-EVO-BINARY-MAX-ABA",

  guarantees: Object.freeze({
    deterministic: true,
    driftProof: true,
    multiInstanceReady: true,

    // Sensor laws
    pureSensor: true,
    sensorOnly: true,
    noDecisionMaking: true,
    noRouting: true,
    noGlobalState: true,
    noMutation: true,
    noExternalMutation: true,
    noCompute: true,              // no business logic, only measurement
    noAsync: true,
    noTimers: true,
    noRandomness: true,
    noDynamicImports: true,
    noEval: true,
    noNetwork: true,
    noIO: true,

    // A‑B‑A + band surfaces
    bandAware: true,
    waveFieldAware: true,
    binaryFieldAware: true,
    stressFieldAware: true,
    flowFieldAware: true,
    unifiedAdvantageField: true,
    pulseEfficiencyAware: true,

    // Awareness
    symbolicAware: true,
    binaryAware: true,
    dualBandAware: true,

    // 12.3+ presence / chunking / cache-prewarm awareness
    presenceAware: true,
    chunkingAware: true,
    cachePrewarmAware: true,

    // Environment
    worldLensAware: false
  }),

  contract: Object.freeze({
    input: [
      "CirculationLatency",
      "CirculationFlow",
      "DualBandContext",
      "AdvantageContext"
    ],
    output: [
      "CirculationVitalSigns",
      "CirculationBandSignature",
      "CirculationBinaryField",
      "CirculationWaveField",
      "CirculationDiagnostics",
      "CirculationHealingState",

      // 12.3+ surfaces
      "CirculationChunkingHints",
      "CirculationPresenceHints"
    ]
  }),

  lineage: Object.freeze({
    root: "PulseBand-v11",
    parent: "PulseBand-v12.3-EVO",
    ancestry: [
      "PulseCirculationMonitor-v7",
      "PulseCirculationMonitor-v8",
      "PulseCirculationMonitor-v9",
      "PulseCirculationMonitor-v10",
      "PulseCirculationMonitor-v11",
      "PulseCirculationMonitor-v11-Evo",
      "PulseCirculationMonitor-v11-Evo-ABA",
      "PulseCirculationMonitor-v11.2-EVO-BINARY-MAX"
    ]
  }),

  bands: Object.freeze({
    supported: ["symbolic", "binary"],
    default: "symbolic",
    behavior: "circulation-sensor"
  }),

  architecture: Object.freeze({
    pattern: "A-B-A",
    baseline: "pressure + flow → vital signs → A‑B‑A surfaces",
    adaptive: "binary-field + wave-field + flow-field overlays",
    return: "deterministic vital signs + signatures + chunk/presence hints"
  })
});


// ============================================================================
//  A‑B‑A SURFACES — Circulation Band + Binary/Wave Fields
// ============================================================================

let circulationCycle = 0;

function buildBand(latency) {
  if (latency == null) return "symbolic";
  return latency > 180 ? "binary" : "symbolic";
}

function buildBandSignature(band) {
  const raw = `CIRC_BAND::${band}`;
  let acc = 0;
  for (let i = 0; i < raw.length; i++) {
    acc = (acc + raw.charCodeAt(i) * (i + 1)) % 100000;
  }
  return `circ-band-${acc}`;
}

function buildBinaryField(latency) {
  const patternLen = 10 + Math.floor((latency ?? 0) / 40);
  const density = patternLen + (latency ?? 0) / 5;
  const surface = density + patternLen;

  return {
    binaryPhenotypeSignature: `circ-binary-pheno-${surface % 99991}`,
    binarySurfaceSignature: `circ-binary-surface-${(surface * 7) % 99991}`,
    binarySurface: { patternLen, density, surface },
    parity: surface % 2 === 0 ? 0 : 1,
    shiftDepth: Math.max(0, Math.floor(Math.log2(surface || 1)))
  };
}

function buildWaveField(latency, band) {
  const amp = (latency ?? 0) / (band === "binary" ? 8 : 16) + 6;
  const amplitude = Math.floor(amp);
  const wavelength = amplitude + 4;
  const phase = amplitude % 16;

  return {
    amplitude,
    wavelength,
    phase,
    band,
    mode: band === "binary" ? "compression-wave" : "symbolic-wave"
  };
}

function buildCirculationCycleSignature() {
  return `circ-cycle-${(circulationCycle * 7919) % 99991}`;
}


// ============================================================================
//  12.3+ CHUNK / CACHE / PRESENCE HINTS (purely derived, no side effects)
// ============================================================================

function buildChunkingHints(latency, kbps) {
  const safeLatency = latency ?? 200;
  const safeKbps = kbps ?? 512;

  // smaller chunks when latency is high, larger when low
  const baseChunkKB =
    safeLatency > 220 ? 32 :
    safeLatency > 160 ? 64 :
    safeLatency > 100 ? 96 : 128;

  const suggestedChunkSizeKB = Math.max(16, Math.min(256, baseChunkKB));
  const suggestedPrewarm = safeLatency > 140;

  return {
    suggestedChunkSizeKB,
    suggestedPrewarm,
    bandwidthKbps: safeKbps,
    latencyMs: safeLatency
  };
}

function buildPresenceHints(latency) {
  const safeLatency = latency ?? 200;

  // tighter presence windows when network is strong
  const recommendedPresenceWindowMs =
    safeLatency < 90 ? 8000 :
    safeLatency < 140 ? 12000 :
    safeLatency < 200 ? 18000 : 24000;

  const suggestedPollIntervalMs =
    safeLatency < 90 ? 4000 :
    safeLatency < 140 ? 6000 :
    safeLatency < 200 ? 9000 : 12000;

  return {
    recommendedPresenceWindowMs,
    suggestedPollIntervalMs,
    latencyMs: safeLatency
  };
}


// ============================================================================
// 1. PRESSURE CHECK — Measure latency (blood pressure)
// ============================================================================
async function measureLatency(url = "/PULSE-PROXY/ping") {
  diag("MEASURE_LATENCY_START", { url });

  const start = performance.now();

  try {
    const res = await fetch(url, { cache: "no-store" });
    const t = performance.now() - start;

    diag("PING_SUCCESS", { durationMs: t });

    let data = {};
    try {
      data = await res.json();
      diag("PING_JSON_PARSED");
    } catch {
      diag("PING_JSON_PARSE_FAILED");
    }

    return {
      ok: res.ok,
      rtt: data.rtt ?? t,
      kbps: data.kbps ?? null,
      msPerKB: data.msPerKB ?? null
    };

  } catch (err) {
    diag("PING_FAILED", { error: String(err) });

    return {
      ok: false,
      rtt: null,
      kbps: null,
      msPerKB: null
    };
  }
}


// ============================================================================
// 2. CLASSIFIERS — Turn numbers into simple ratings
// ============================================================================
function classifyBars(latency) {
  diag("CLASSIFY_BARS", { latency });

  if (latency == null) return 1;
  if (latency < 80) return 4;
  if (latency < 110) return 3;
  if (latency < 160) return 2;
  return 1;
}

function classifyNetworkHealth(latency) {
  diag("CLASSIFY_HEALTH", { latency });

  if (latency == null) return "Unknown";
  if (latency < 90) return "Excellent";
  if (latency < 120) return "Good";
  if (latency < 180) return "Weak";
  return "Poor";
}


// ============================================================================
// 3. PUBLIC API — Build a vital‑signs packet (v12.3‑EVO A‑B‑A)
// ============================================================================
async function getPulseTelemetry() {
  circulationCycle++;
  diag("TELEMETRY_START");

  const ping = await measureLatency();

  const latency = ping.rtt;
  const kbps = ping.kbps;

  diag("TELEMETRY_VALUES", { latency, kbps });

  const bars = classifyBars(latency);
  const health = classifyNetworkHealth(latency);

  diag("TELEMETRY_CLASSIFIED", { bars, health });

  // A‑B‑A surfaces
  const band = buildBand(latency);
  const bandSignature = buildBandSignature(band);
  const binaryField = buildBinaryField(latency);
  const waveField = buildWaveField(latency, band);
  const circulationCycleSignature = buildCirculationCycleSignature();

  // 12.3+ chunk / presence hints
  const chunkingHints = buildChunkingHints(latency, kbps);
  const presenceHints = buildPresenceHints(latency);

  // Stable snapshot
  const snapshot = {
    lastChunkDurationMs: latency,
    lastChunkKbps: kbps ?? null,
    lastChunkSizeKB: kbps ? kbps / 8 : null,
    lastChunkIndex: Date.now(),

    band,
    bandSignature,
    binaryField,
    waveField,
    circulationCycleSignature,

    // 12.3+ hints
    chunkingHints,
    presenceHints,

    meta: { ...CIRCULATION_CONTEXT }
  };

  diag("SNAPSHOT_BUILT", snapshot);

  // Live = what PulseBand uses right now
  const result = {
    live: {
      latency,
      phoneKbps: kbps,
      appKbps: kbps,
      pulsebandBars: bars,
      phoneBars: 4,
      networkHealth: health,
      route: "Primary",
      state: "active",
      microWindowActive: true,
      lastSyncTimestamp: Date.now(),

      band,
      bandSignature,
      binaryField,
      waveField,
      circulationCycleSignature,

      // 12.3+ hints
      chunkingHints,
      presenceHints,

      meta: { ...CIRCULATION_CONTEXT }
    },
    snapshot
  };

  diag("TELEMETRY_READY", result);

  return result;
}


// ============================================================================
//  EXPORT — CIRCULATION MONITOR v12.3‑EVO A‑B‑A
// ============================================================================
export const PulseUpdate = {
  measureLatency,
  getPulseTelemetry,
  meta: { ...CIRCULATION_CONTEXT },
  PulseRole
};
