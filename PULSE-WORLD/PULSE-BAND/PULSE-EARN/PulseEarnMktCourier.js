// ============================================================================
// FILE: tropic-pulse-functions/PULSE-WORLD/PULSE-EARN/PulseEarnMktCourier-v13.0-PRESENCE-IMMORTAL.js
// LAYER: THE COURIER (v13.0 Presence + Advantage‑C + Prewarm)
// ============================================================================
/*
AI_EXPERIENCE_META = {
  identity: "PulseEarnMktCourier",
  version: "v14-IMMORTAL",
  layer: "earn_market",
  role: "market_courier",
  lineage: "PulseEarnMktCourier-v11 → v12.3 → v14-IMMORTAL",

  evo: {
    marketCourier: true,
    jobTransport: true,
    jobDelivery: true,
    dualBand: true,
    symbolicPrimary: true,
    binaryAware: true,

    deterministic: true,
    driftProof: true,
    pureCompute: true,
    zeroNetwork: true,
    zeroFilesystem: true,
    zeroMutationOfInput: true
  },

  contract: {
    always: [
      "PulseEarnMktBroker",
      "PulseEarnMktForager",
      "PulseEarnMktEmbassyLedger"
    ],
    never: [
      "safeRoute",
      "fetchViaCNS"
    ]
  }
}
*/

export const PulseEarnMktCourierMeta = Object.freeze({
  layer: "PulseEarnMktCourier",
  role: "EARN_MARKETPLACE_RECEPTOR",
  version: "v13.0-PRESENCE-IMMORTAL",
  identity: "PulseEarnMktCourier-v13.0-PRESENCE-IMMORTAL",

  guarantees: Object.freeze({
    deterministic: true,
    noRandomness: true,
    noRealTime: true,
    noExternalIO: true,
    pureReceptor: true,

    dualBandAware: true,
    binaryAware: true,
    waveFieldAware: true,
    presenceAware: true,
    advantageAware: true,
    chunkPrewarmAware: true,
    healingMetadataAware: true,

    worldLensAware: false,
    zeroNetwork: true,
    zeroAsync: true,
    zeroAI: true,
    zeroUserCode: true
  })
});

// ============================================================================
// Deterministic Hash Helper
// ============================================================================
function computeHash(str) {
  let h = 0;
  const s = String(str || "");
  for (let i = 0; i < s.length; i++)
    h = (h + s.charCodeAt(i) * (i + 1)) % 100000;
  return `h${h}`;
}

function normalizeBand(band) {
  const b = String(band || "symbolic").toLowerCase();
  return b === "binary" ? "binary" : "symbolic";
}

function buildBandSignature(band) {
  return computeHash(`COURIER_BAND::${normalizeBand(band)}`);
}

// ============================================================================
// Unified Earn v13 Presence Tier
// ============================================================================
function classifyPresenceTier(pressure) {
  if (pressure >= 150) return "critical";
  if (pressure >= 100) return "high";
  if (pressure >= 50) return "elevated";
  if (pressure > 0) return "soft";
  return "idle";
}

// ============================================================================
// Unified v13 Presence Field
// ============================================================================
function buildPresenceField(jobOrRaw, deviceProfile = {}, cycle, globalHints = {}) {
  const ghP = globalHints.presenceContext || {};
  const mesh = globalHints.meshSignals || {};
  const castle = globalHints.castleSignals || {};
  const region = globalHints.regionContext || {};

  const meshStrength = Number(mesh.meshStrength || 0);
  const meshPressureExternal = Number(mesh.meshPressureIndex || 0);
  const castleLoadExternal = Number(castle.loadLevel || 0);

  // Courier internal signal: job complexity
  const idLen = (jobOrRaw?.id || "").length;
  const typeLen = (jobOrRaw?.type || "").length;
  const stability = deviceProfile?.stabilityScore || 0.7;

  const internalComposite =
    idLen * 0.001 +
    typeLen * 0.001 +
    stability * 0.01;

  const internalPressure = Math.floor(internalComposite * 1000);

  const meshPressureIndex = meshPressureExternal + internalPressure;
  const castleLoadLevel = castleLoadExternal;

  const pressure = meshPressureIndex + castleLoadLevel;
  const presenceTier = classifyPresenceTier(pressure);

  return {
    presenceVersion: "v13.0-PRESENCE-IMMORTAL",
    presenceTier,

    bandPresence: ghP.bandPresence || "symbolic",
    routerPresence: ghP.routerPresence || "stable",
    devicePresence: ghP.devicePresence || "courier",

    meshPresence: ghP.meshPresence || (meshStrength > 0 ? "mesh-active" : "mesh-idle"),
    castlePresence: ghP.castlePresence || castle.castlePresence || "courier-region",
    regionPresence: ghP.regionPresence || region.regionTag || "unknown-region",

    regionId: region.regionId || "courier-region",
    castleId: castle.castleId || "courier-castle",

    meshStrength,
    meshPressureIndex,
    castleLoadLevel,

    idLen,
    typeLen,
    stability,
    cycle,

    presenceSignature: computeHash(
      `COURIER_PRESENCE::${presenceTier}::${meshPressureIndex}::${castleLoadLevel}::${idLen}::${typeLen}`
    )
  };
}

// ============================================================================
// Advantage‑C v13
// ============================================================================
function buildAdvantageField(jobOrRaw, deviceProfile, bandPack, presenceField, globalHints = {}) {
  const gpuScore = deviceProfile?.gpuScore || 0;
  const bandwidth = deviceProfile?.bandwidthMbps || 0;

  const density = bandPack.binaryField.binarySurface.density;
  const amplitude = bandPack.waveField.amplitude;

  const baseScore =
    gpuScore * 0.0005 +
    bandwidth * 0.0002 +
    density * 0.00001 +
    amplitude * 0.00001;

  const presenceBoost =
    presenceField.presenceTier === "critical" ? 0.02 :
    presenceField.presenceTier === "high" ? 0.015 :
    presenceField.presenceTier === "elevated" ? 0.01 :
    presenceField.presenceTier === "soft" ? 0.005 :
    0;

  const advantageScore = baseScore + presenceBoost;

  let advantageTier = 0;
  if (advantageScore >= 0.05) advantageTier = 3;
  else if (advantageScore >= 0.02) advantageTier = 2;
  else if (advantageScore > 0) advantageTier = 1;

  const fallbackBandLevel = globalHints.fallbackBandLevel ?? 0;

  return {
    advantageVersion: "C-13.0",
    band: bandPack.band,
    gpuScore,
    bandwidth,
    binaryDensity: density,
    waveAmplitude: amplitude,
    presenceTier: presenceField.presenceTier,
    advantageScore,
    advantageTier,
    fallbackBandLevel
  };
}

// ============================================================================
// Chunk / Cache / Prewarm Plan v13
// ============================================================================
function buildChunkPrewarmPlan(jobOrRaw, deviceProfile, presenceField, advantageField) {
  const basePriority =
    presenceField.presenceTier === "critical"
      ? 4
      : presenceField.presenceTier === "high"
      ? 3
      : presenceField.presenceTier === "elevated"
      ? 2
      : presenceField.presenceTier === "soft"
      ? 1
      : 0;

  const advantageBoost =
    advantageField.advantageTier >= 3 ? 2 :
    advantageField.advantageTier === 2 ? 1 :
    0;

  const priority = basePriority + advantageBoost;

  return {
    planVersion: "v13.0-Courier-AdvantageC",
    priority,
    band: presenceField.presenceTier,
    chunks: {
      receptorEnvelope: true,
      normalizationBlueprint: true
    },
    cache: {
      deviceProfile: true,
      courierDiagnostics: true
    },
    prewarm: {
      nervousSystem: true,
      muscleSystem: true,
      lymphNodes: true
    }
  };
}

// ============================================================================
// Healing State
// ============================================================================
const healingState = {
  lastPingMs: null,
  lastPingError: null,
  lastFetchCount: 0,
  lastFetchError: null,
  lastSubmitJobId: null,
  lastSubmitError: null,
  lastNormalizedJobId: null,
  lastNormalizationError: null,

  cycleCount: 0,
  lastCycleIndex: null,

  lastPingSignature: null,
  lastFetchSignature: null,
  lastNormalizationSignature: null,
  lastSubmitSignature: null,
  lastCourierCycleSignature: null,

  lastBand: "symbolic",
  lastBandSignature: null,
  lastBinaryField: null,
  lastWaveField: null,

  lastPresenceField: null,
  lastAdvantageField: null,
  lastChunkPrewarmPlan: null
};

let courierCycle = 0;

// ============================================================================
// Spheron DNA (unchanged deterministic payload)
// ============================================================================
const SPHERON_RECEPTOR_DNA = {
  pingLatency: 42,
  jobs: [
    {
      id: "spheron-001",
      payout: 0.05,
      cpu: 2,
      memory: 2048,
      estimatedSeconds: 300,
      gpu: false,
      type: "compute"
    },
    {
      id: "spheron-002",
      payout: 0.12,
      cpu: 4,
      memory: 4096,
      estimatedSeconds: 600,
      gpu: true,
      type: "compute"
    }
  ],
  version: "13.0-PRESENCE-IMMORTAL",
  lineage: "Courier-Spheron-v13.0-PRESENCE-IMMORTAL",
  phenotype: "MarketplaceReceptor"
};

// ============================================================================
// A‑B‑A Surfaces
// ============================================================================
function buildBinaryField(cycle, hasGpu, presenceField) {
  const patternLen = hasGpu ? 16 : 10;
  const baseDensity = patternLen + cycle + (hasGpu ? 25 : 8);
  const mesh = Number(presenceField?.meshPressureIndex || 0);
  const castle = Number(presenceField?.castleLoadLevel || 0);
  const density = baseDensity + mesh + castle;
  const surface = density + patternLen;

  return {
    binaryPhenotypeSignature: computeHash(`COURIER_BIN::${surface}`),
    binarySurfaceSignature: computeHash(`COURIER_BIN_SURF::${surface}`),
    binarySurface: {
      patternLen,
      density,
      meshPressureIndex: mesh,
      castleLoadLevel: castle,
      surface
    },
    parity: surface % 2 === 0 ? 0 : 1,
    shiftDepth: Math.max(0, Math.floor(Math.log2(surface || 1)))
  };
}

function buildWaveField(cycle, band, presenceField) {
  const mesh = Number(presenceField?.meshStrength || 0);
  const amplitude = (cycle + 1) * (band === "binary" ? 14 : 7) + mesh;
  const wavelength = amplitude + 5;
  const phase = (amplitude + (presenceField?.meshPressureIndex || 0)) % 16;

  return {
    amplitude,
    wavelength,
    phase,
    band,
    mode: band === "binary" ? "compression-wave" : "symbolic-wave"
  };
}

// ============================================================================
// COURIER ORGAN — v13.0‑PRESENCE‑IMMORTAL
// ============================================================================
export const PulseEarnMktCourier = {
  id: "spheron",
  name: "Spheron Compute",
  version: "v13.0-PRESENCE-IMMORTAL",
  lineage: "Courier-Spheron-v13.0-PRESENCE-IMMORTAL",

  // -------------------------------------------------------------------------
  // PING — unified v13 presence
  // -------------------------------------------------------------------------
  ping(deviceProfile = {}, globalHints = {}) {
    courierCycle++;
    healingState.cycleCount++;
    healingState.lastCycleIndex = courierCycle;

    const latency = SPHERON_RECEPTOR_DNA.pingLatency;

    const band = "symbolic";
    healingState.lastBand = band;
    healingState.lastBandSignature = buildBandSignature(band);

    const presenceField = buildPresenceField(null, deviceProfile, courierCycle, globalHints);
    const binaryField = buildBinaryField(courierCycle, false, presenceField);
    const waveField = buildWaveField(courierCycle, band, presenceField);

    const advantageField = buildAdvantageField(
      null,
      deviceProfile,
      { band, binaryField, waveField },
      presenceField,
      globalHints
    );

    const chunkPlan = buildChunkPrewarmPlan(null, deviceProfile, presenceField, advantageField);

    healingState.lastPingMs = latency;
    healingState.lastPingSignature = computeHash(`PING::${latency}`);
    healingState.lastBinaryField = binaryField;
    healingState.lastWaveField = waveField;
    healingState.lastPresenceField = presenceField;
    healingState.lastAdvantageField = advantageField;
    healingState.lastChunkPrewarmPlan = chunkPlan;

    return {
      latency,
      signature: healingState.lastPingSignature,
      bandSignature: healingState.lastBandSignature,
      binaryField,
      waveField,
      presenceField,
      advantageField,
      chunkPlan
    };
  },

  // -------------------------------------------------------------------------
  // FETCH JOBS — unified v13 presence
  // -------------------------------------------------------------------------
  fetchJobs(deviceProfile = {}, globalHints = {}) {
    courierCycle++;
    healingState.cycleCount++;
    healingState.lastCycleIndex = courierCycle;

    const rawJobs = SPHERON_RECEPTOR_DNA.jobs || [];
    const jobs = rawJobs
      .map(raw => this.normalizeJob(raw, deviceProfile, globalHints))
      .filter(j => j !== null);

    healingState.lastFetchCount = jobs.length;
    healingState.lastFetchSignature = computeHash(`FETCH::${jobs.length}`);

    const band = "symbolic";
    healingState.lastBand = band;
    healingState.lastBandSignature = buildBandSignature(band);

    const presenceField = buildPresenceField(null, deviceProfile, courierCycle, globalHints);
    const binaryField = buildBinaryField(courierCycle, false, presenceField);
    const waveField = buildWaveField(courierCycle, band, presenceField);

    const advantageField = buildAdvantageField(
      null,
      deviceProfile,
      { band, binaryField, waveField },
      presenceField,
      globalHints
    );

    const chunkPlan = buildChunkPrewarmPlan(null, deviceProfile, presenceField, advantageField);

    healingState.lastBinaryField = binaryField;
    healingState.lastWaveField = waveField;
    healingState.lastPresenceField = presenceField;
    healingState.lastAdvantageField = advantageField;
    healingState.lastChunkPrewarmPlan = chunkPlan;

    return {
      jobs,
      signature: healingState.lastFetchSignature,
      bandSignature: healingState.lastBandSignature,
      binaryField,
      waveField,
      presenceField,
      advantageField,
      chunkPlan
    };
  },

  // -------------------------------------------------------------------------
  // SUBMIT RESULT — unified v13 presence
  // -------------------------------------------------------------------------
  submitResult(job, result, deviceProfile = {}, globalHints = {}) {
    courierCycle++;
    healingState.cycleCount++;
    healingState.lastCycleIndex = courierCycle;

    const jobId = job?.id ?? null;

    const band = "symbolic";
    healingState.lastBand = band;
    healingState.lastBandSignature = buildBandSignature(band);

    const presenceField = buildPresenceField(job, deviceProfile, courierCycle, globalHints);
    const binaryField = buildBinaryField(courierCycle, false, presenceField);
    const waveField = buildWaveField(courierCycle, band, presenceField);

    const advantageField = buildAdvantageField(
      job,
      deviceProfile,
      { band, binaryField, waveField },
      presenceField,
      globalHints
    );

    const chunkPlan = buildChunkPrewarmPlan(job, deviceProfile, presenceField, advantageField);

    healingState.lastSubmitJobId = jobId;
    healingState.lastSubmitSignature = computeHash(`SUBMIT::${jobId}`);
    healingState.lastBinaryField = binaryField;
    healingState.lastWaveField = waveField;
    healingState.lastPresenceField = presenceField;
    healingState.lastAdvantageField = advantageField;
    healingState.lastChunkPrewarmPlan = chunkPlan;

    return {
      ok: true,
      marketplace: "spheron",
      jobId,
      cycleIndex: courierCycle,
      signature: healingState.lastSubmitSignature,
      bandSignature: healingState.lastBandSignature,
      binaryField,
      waveField,
      presenceField,
      advantageField,
      chunkPlan,
      result
    };
  },

    // -------------------------------------------------------------------------
  // NORMALIZE JOB — unified v13 presence
  // -------------------------------------------------------------------------
  normalizeJob(raw, deviceProfile = {}, globalHints = {}) {
    try {
      if (!raw || typeof raw !== "object" || !raw.id) {
        healingState.lastNormalizationError = "invalid_raw_job";
        healingState.lastNormalizedJobId = null;
        healingState.lastNormalizationSignature = computeHash("NORM::NONE");
        return null;
      }

      const payout = Number(raw.payout ?? 0);
      if (!Number.isFinite(payout) || payout <= 0) {
        healingState.lastNormalizationError = "non_positive_payout";
        healingState.lastNormalizedJobId = null;
        healingState.lastNormalizationSignature = computeHash("NORM::NONE");
        return null;
      }

      const cpuRequired = Number(raw.cpu ?? 1);
      const memoryRequired = Number(raw.memory ?? 1024);
      const estimatedSeconds = Number(raw.estimatedSeconds ?? 600);
      if (!Number.isFinite(estimatedSeconds) || estimatedSeconds <= 0) {
        healingState.lastNormalizationError = "non_positive_duration";
        healingState.lastNormalizedJobId = null;
        healingState.lastNormalizationSignature = computeHash("NORM::NONE");
        return null;
      }

      const gpuFlag = !!raw.gpu;
      const band = gpuFlag ? "binary" : "symbolic";

      const presenceField = buildPresenceField(raw, deviceProfile, courierCycle, globalHints);
      const binaryField = buildBinaryField(courierCycle, gpuFlag, presenceField);
      const waveField = buildWaveField(courierCycle, band, presenceField);

      const advantageField = buildAdvantageField(
        raw,
        deviceProfile,
        { band, binaryField, waveField },
        presenceField,
        globalHints
      );

      const chunkPlan = buildChunkPrewarmPlan(raw, deviceProfile, presenceField, advantageField);

      const normalized = {
        id: String(raw.id),
        marketplaceId: "spheron",

        payout,
        cpuRequired,
        memoryRequired,
        estimatedSeconds,

        minGpuScore: gpuFlag ? 300 : 100,
        bandwidthNeededMbps: 5,

        _abaBand: band,
        _abaBinaryDensity: binaryField.binarySurface.density,
        _abaWaveAmplitude: waveField.amplitude,

        presenceField,
        advantageField,
        chunkPlan
      };

      healingState.lastNormalizedJobId = normalized.id;
      healingState.lastNormalizationError = null;
      healingState.lastNormalizationSignature =
        computeHash(`NORM::${normalized.id}`);

      return normalized;

    } catch (err) {
      healingState.lastNormalizationError = err?.message || String(err);
      healingState.lastNormalizedJobId = null;
      healingState.lastNormalizationSignature = computeHash("NORM::NONE");
      return null;
    }
  }
};

