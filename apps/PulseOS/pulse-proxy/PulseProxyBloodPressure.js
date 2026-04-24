// ============================================================================
//  PULSE OS v11‑Evo — CIRCULATION MONITOR (A‑B‑A)
//  “Blood Pressure + Blood Flow Sensor”
//  Measures latency (pressure) and speed (flow) and emits A‑B‑A vital signs.
//  PURE SENSOR. NO THINKING. NO DECISIONS. NO GLOBAL STATE.
// ============================================================================


// ============================================================================
//  ORGAN IDENTITY — v11‑Evo A‑B‑A
// ============================================================================
export const PulseRole = {
  type: "Organ",
  subsystem: "PulseBand",
  layer: "CirculationMonitor",
  version: "11-Evo",
  identity: "PulseCirculationMonitor-v11-Evo-ABA",

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
    flowFieldAware: true
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
// 1. PRESSURE CHECK — Measure latency (blood pressure)
// ============================================================================
async function measureLatency(url = "/pulse-proxy/ping") {
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
// 3. PUBLIC API — Build a vital‑signs packet (v11‑Evo A‑B‑A)
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

      meta: { ...CIRCULATION_CONTEXT }
    },
    snapshot
  };

  diag("TELEMETRY_READY", result);

  return result;
}


// ============================================================================
//  EXPORT — CIRCULATION MONITOR v11‑Evo A‑B‑A
// ============================================================================
export const PulseUpdate = {
  measureLatency,
  getPulseTelemetry,
  meta: { ...CIRCULATION_CONTEXT },
  PulseRole
};
