// ============================================================================
// FILE: tropic-pulse-functions/PULSE-WORLD/PULSE-EARN/PulseEarnMktAuctioneer-v12.3-PRESENCE-EVO+.js
// LAYER: MARKETPLACE AUCTIONEER (v12.3‑PRESENCE‑EVO+ A‑B‑A)
// Vast.ai Deterministic Adapter + Presence/Advantage/Hints Surfaces
// ============================================================================
//
// ROLE (v12.3‑PRESENCE‑EVO+ A‑B‑A):
//   • Deterministic Vast.ai → Pulse‑Earn adapter.
//   • Pure receptor phenotype: ping(), fetchJobs(), normalizeJob(), submitResult().
//   • Emits A‑B‑A bandSignature + binaryField + waveField + presence/advantage/hints.
//   • Emits deterministic volatility + healing metadata.
//   • Zero async, zero randomness, zero timestamps.
//
// CONTRACT:
//   • PURE RECEPTOR — deterministic, drift‑proof.
//   • NO network, NO fetch, NO async, NO randomness.
//   • NEVER mutate external objects.
//   • Presence/advantage/hints are metadata-only.
// ============================================================================\

export const PulseEarnMktAuctioneerMeta = Object.freeze({
  layer: "PulseEarnMktAuctioneer",
  role: "EARN_MARKETPLACE_RECEPTOR",
  version: "v12.3-PRESENCE-EVO+",
  identity: "PulseEarnMktAuctioneer-v12.3-PRESENCE-EVO+",

  guarantees: Object.freeze({
    deterministic: true,
    noRandomness: true,
    noRealTime: true,
    noExternalIO: true,
    pureReceptor: true,
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
    worldLensAware: false,
    zeroNetwork: true,
    zeroAsync: true,
    zeroAI: true,
    zeroUserCode: true,
    volatilityDeterministic: true
  }),

  contract: Object.freeze({
    input: [
      "VastAIDNA",
      "DualBandContext",
      "ReceptorNormalizationRules",
      "GlobalHintsPresenceField"
    ],
    output: [
      "ReceptorPingResult",
      "ReceptorJobList",
      "ReceptorSubmissionResult",
      "ReceptorNormalizationResult",
      "ReceptorSignatures",
      "AuctioneerHealingState"
    ]
  }),

  lineage: Object.freeze({
    root: "PulseOS-v11-EVO",
    parent: "PulseEarn-v12.3-PRESENCE-EVO+",
    ancestry: [
      "PulseEarnMktAuctioneer-v9",
      "PulseEarnMktAuctioneer-v10",
      "PulseEarnMktAuctioneer-v11",
      "PulseEarnMktAuctioneer-v11-Evo"
    ]
  }),

  bands: Object.freeze({
    supported: ["symbolic", "binary"],
    default: "symbolic",
    behavior: "metadata-only"
  }),

  architecture: Object.freeze({
    pattern: "A-B-A",
    baseline: "deterministic Vast.ai receptor phenotype",
    adaptive: "binary/wave surfaces + volatility + presence/advantage/hints",
    return: "deterministic ping/fetchJobs/normalizeJob/submitResult"
  })
});


// ============================================================================
// Healing Metadata — deterministic receptor log (v12.3‑PRESENCE‑EVO+ A‑B‑A)
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

  lastPayloadVersion: "11-Evo",
  lastJobType: null,
  lastGpuScore: null,
  lastResourceShape: null,
  lastBandwidthInference: null,

  priceVolatility: 0,
  listingVolatility: 0,

  cycleCount: 0,

  lastPingSignature: null,
  lastFetchSignature: null,
  lastNormalizationSignature: null,
  lastSubmitSignature: null,
  lastAuctioneerCycleSignature: null,

  // A‑B‑A surfaces
  lastBand: "symbolic",
  lastBandSignature: null,
  lastBinaryField: null,
  lastWaveField: null,

  // Presence‑EVO+ additions
  lastPresenceField: null,
  lastAdvantageField: null,
  lastHintsField: null,
  lastAuctioneerPresenceProfile: null,
  lastBinaryProfile: null,
  lastWaveProfile: null
};


// ============================================================================
// Deterministic Hash Helper — v12.3‑EVO
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


// ============================================================================
// Signature Builders — v12.3‑EVO
// ============================================================================
function buildPingSignature(latency) {
  return computeHash(`PING::${latency}`);
}

function buildFetchSignature(count) {
  return computeHash(`FETCH::${count}`);
}

function buildNormalizationSignature(jobId) {
  return computeHash(`NORM::${jobId || "NONE"}`);
}

function buildSubmitSignature(jobId) {
  return computeHash(`SUBMIT::${jobId || "NONE"}`);
}

function buildAuctioneerCycleSignature(cycle, presenceTier) {
  return computeHash(`AUCTIONEER_CYCLE::${cycle}::PTIER:${presenceTier}`);
}

function buildBandSignature(band) {
  return computeHash(`AUCTIONEER_BAND::${normalizeBand(band)}`);
}


// ============================================================================
// SAFE GET — deterministic path reader
// ============================================================================
function safeGet(obj, path, fallback = null) {
  try {
    return path
      .split(".")
      .reduce((o, k) => (o && o[k] !== undefined ? o[k] : null), obj) ?? fallback;
  } catch {
    return fallback;
  }
}


// ============================================================================
// A‑B‑A Binary + Wave Surfaces (Presence‑aware)
// ============================================================================
function buildBinaryField(presenceField) {
  const patternLen = 8;
  const mesh = Number(presenceField?.meshPressureIndex || 0);
  const castle = Number(presenceField?.castleLoadLevel || 0);

  const density =
    patternLen +
    healingState.lastFetchCount +
    (healingState.lastPingMs || 0) +
    mesh +
    castle;

  const surface = density + patternLen;

  const field = {
    binaryPhenotypeSignature: computeHash(`BAUCTIONEER::${surface}`),
    binarySurfaceSignature: computeHash(`BAUCTIONEER_SURF::${surface}`),
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

  healingState.lastBinaryField = field;
  return field;
}

function buildWaveField(band, presenceField) {
  const amplitudeBase = (healingState.lastFetchCount || 1) * 10;
  const mesh = Number(presenceField?.meshStrength || 0);
  const amplitude = amplitudeBase + mesh;
  const wavelength = (healingState.lastPingMs || 10) + 1;
  const phase = (amplitude + (presenceField?.meshPressureIndex || 0)) % 16;

  const field = {
    amplitude,
    wavelength,
    phase,
    band,
    mode: band === "binary" ? "compression-wave" : "symbolic-wave"
  };

  healingState.lastWaveField = field;
  return field;
}


// ============================================================================
// DETERMINISTIC VAST.AI DNA — v11-Evo baseline
// ============================================================================
const VAST_RECEPTOR_DNA = {
  pingLatency: 42,

  band: "symbolic",

  offers: [
    {
      id: "vast-001",
      dph_total: 0.12,
      cpu_cores: 4,
      ram_gb: 8,
      gpu_ram: 8,
      net_up: 50
    },
    {
      id: "vast-002",
      dph_total: 0.20,
      cpu_cores: 8,
      ram_gb: 16,
      gpu_ram: 16,
      net_up: 100
    }
  ],

  version: "11-Evo",
  lineage: "Auctioneer-Vast-v11-Evo",
  phenotype: "MarketplaceAuctioneer"
};


// ============================================================================
// Presence / Advantage / Hints Surfaces (auctioneer-level)
// ============================================================================
function buildPresenceField(globalHints = {}) {
  const ghP = globalHints.presenceContext || {};
  const mesh = globalHints.meshSignals || {};
  const castle = globalHints.castleSignals || {};
  const region = globalHints.regionContext || {};

  return {
    bandPresence: ghP.bandPresence || "unknown",
    routerPresence: ghP.routerPresence || "unknown",
    devicePresence: ghP.devicePresence || "unknown",
    meshPresence: ghP.meshPresence || mesh.meshStrength || "unknown",
    castlePresence: ghP.castlePresence || castle.castlePresence || "unknown",
    regionPresence: ghP.regionPresence || region.regionTag || "unknown",
    regionId: region.regionId || "unknown-region",
    castleId: castle.castleId || "unknown-castle",
    castleLoadLevel: castle.loadLevel || 0,
    meshStrength: mesh.meshStrength || 0,
    meshPressureIndex: mesh.meshPressureIndex || 0
  };
}

function buildAdvantageField(globalHints = {}) {
  const gh = globalHints.advantageContext || {};

  return {
    advantageScore: gh.score ?? 0,
    advantageBand: gh.band ?? "neutral",
    advantageTier: gh.tier ?? 0
  };
}

function buildHintsField(globalHints = {}) {
  return {
    fallbackBandLevel: globalHints.fallbackBandLevel ?? 0,
    chunkHints: { ...(globalHints.chunkHints || {}) },
    cacheHints: { ...(globalHints.cacheHints || {}) },
    prewarmHints: { ...(globalHints.prewarmHints || {}) },
    coldStartHints: { ...(globalHints.coldStartHints || {}) }
  };
}

function classifyAuctioneerPresenceTier(presenceField) {
  const mesh = Number(presenceField.meshPressureIndex || 0);
  const castle = Number(presenceField.castleLoadLevel || 0);
  const pressure = mesh + castle;

  if (pressure >= 150) return "critical";
  if (pressure >= 100) return "high";
  if (pressure >= 50) return "elevated";
  if (pressure > 0) return "soft";
  return "idle";
}


// ============================================================================
// Deterministic Cycle Counter
// ============================================================================
let auctioneerCycle = 0;


// ============================================================================
// VOLATILITY — deterministic
// ============================================================================
function updateVolatility(jobs) {
  const count = jobs.length;

  healingState.listingVolatility = Math.abs(
    count - (healingState.lastFetchCount || 0)
  );

  const payouts = jobs.map(j => j.payout);
  if (payouts.length > 1) {
    const avg = payouts.reduce((a, b) => a + b, 0) / payouts.length;
    const variance =
      payouts.reduce((a, b) => a + (b - avg) * (b - avg), 0) / payouts.length;
    healingState.priceVolatility = variance;
  }
}


// ============================================================================
// AUCTIONEER — Vast.ai Marketplace Adapter (v12.3‑PRESENCE‑EVO+ A‑B‑A)
// globalHints is optional; if omitted, defaults to {}
// ============================================================================
export const PulseEarnMktAuctioneer = {
  id: "vast",
  name: "Vast.ai",
  version: "14-IMMORTAL",
  lineage: "Auctioneer-Vast-v14-IMMORTAL",

  // -------------------------------------------------------------------------
  // PING — deterministic latency + A‑B‑A + presence surfaces
  // -------------------------------------------------------------------------
  ping(globalHints = {}) {
    auctioneerCycle++;
    healingState.cycleCount++;

    const latency = VAST_RECEPTOR_DNA.pingLatency;
    const band = normalizeBand(VAST_RECEPTOR_DNA.band);

    const presenceField = buildPresenceField({ globalHints });

    const advantageField = buildAdvantageField(globalHints);
    const hintsField = buildHintsField(globalHints);
    const presenceTier = classifyAuctioneerPresenceTier(presenceField);

    healingState.lastBand = band;
    healingState.lastPingMs = latency;
    healingState.lastPingError = null;

    healingState.lastPingSignature = buildPingSignature(latency);
    healingState.lastBandSignature = buildBandSignature(band);
    healingState.lastAuctioneerCycleSignature =
      buildAuctioneerCycleSignature(auctioneerCycle, presenceTier);

    const binaryField = buildBinaryField(presenceField);
    const waveField = buildWaveField(band, presenceField);

    const auctioneerPresenceProfile = {
      presenceTier,
      band,
      meshPressureIndex: presenceField.meshPressureIndex,
      castleLoadLevel: presenceField.castleLoadLevel,
      advantageTier: advantageField.advantageTier,
      fallbackBandLevel: hintsField.fallbackBandLevel
    };

    const binaryProfile = { binaryField, presenceTier };
    const waveProfile = { waveField, presenceTier };

    healingState.lastBinaryField = binaryField;
    healingState.lastWaveField = waveField;
    healingState.lastPresenceField = presenceField;
    healingState.lastAdvantageField = advantageField;
    healingState.lastHintsField = hintsField;
    healingState.lastAuctioneerPresenceProfile = auctioneerPresenceProfile;
    healingState.lastBinaryProfile = binaryProfile;
    healingState.lastWaveProfile = waveProfile;

    return {
      latency,
      signature: healingState.lastPingSignature,
      bandSignature: healingState.lastBandSignature,
      binaryField,
      waveField,
      presenceField,
      advantageField,
      hintsField,
      auctioneerPresenceProfile,
      binaryProfile,
      waveProfile
    };
  },

  // -------------------------------------------------------------------------
  // FETCH JOBS — deterministic offers + A‑B‑A + presence surfaces
  // -------------------------------------------------------------------------
  fetchJobs(globalHints = {}) {
    auctioneerCycle++;
    healingState.cycleCount++;

    const band = normalizeBand(VAST_RECEPTOR_DNA.band);
    const presenceField = buildPresenceField(globalHints);
    const advantageField = buildAdvantageField(globalHints);
    const hintsField = buildHintsField(globalHints);
    const presenceTier = classifyAuctioneerPresenceTier(presenceField);

    healingState.lastBand = band;

    try {
      const offers = VAST_RECEPTOR_DNA.offers || [];

      const jobs = offers
        .map(raw => this.normalizeJob(raw, globalHints))
        .filter(j => j !== null);

      updateVolatility(jobs);

      healingState.lastFetchError = null;
      healingState.lastFetchCount = jobs.length;
      healingState.lastFetchSignature = buildFetchSignature(jobs.length);
      healingState.lastBandSignature = buildBandSignature(band);
      healingState.lastAuctioneerCycleSignature =
        buildAuctioneerCycleSignature(auctioneerCycle, presenceTier);

      const binaryField = buildBinaryField(presenceField);
      const waveField = buildWaveField(band, presenceField);

      const auctioneerPresenceProfile = {
        presenceTier,
        band,
        meshPressureIndex: presenceField.meshPressureIndex,
        castleLoadLevel: presenceField.castleLoadLevel,
        advantageTier: advantageField.advantageTier,
        fallbackBandLevel: hintsField.fallbackBandLevel
      };

      const binaryProfile = { binaryField, presenceTier };
      const waveProfile = { waveField, presenceTier };

      healingState.lastBinaryField = binaryField;
      healingState.lastWaveField = waveField;
      healingState.lastPresenceField = presenceField;
      healingState.lastAdvantageField = advantageField;
      healingState.lastHintsField = hintsField;
      healingState.lastAuctioneerPresenceProfile = auctioneerPresenceProfile;
      healingState.lastBinaryProfile = binaryProfile;
      healingState.lastWaveProfile = waveProfile;

      return {
        jobs,
        signature: healingState.lastFetchSignature,
        bandSignature: healingState.lastBandSignature,
        binaryField,
        waveField,
        presenceField,
        advantageField,
        hintsField,
        auctioneerPresenceProfile,
        binaryProfile,
        waveProfile
      };

    } catch (err) {
      healingState.lastFetchError = err?.message || String(err);
      healingState.lastFetchCount = 0;
      healingState.lastFetchSignature = buildFetchSignature(0);

      const auctioneerPresenceProfile = {
        presenceTier,
        band,
        meshPressureIndex: presenceField.meshPressureIndex,
        castleLoadLevel: presenceField.castleLoadLevel,
        advantageTier: advantageField.advantageTier,
        fallbackBandLevel: hintsField.fallbackBandLevel
      };

      return {
        jobs: [],
        signature: healingState.lastFetchSignature,
        bandSignature: null,
        binaryField: null,
        waveField: null,
        presenceField,
        advantageField,
        hintsField,
        auctioneerPresenceProfile,
        binaryProfile: null,
        waveProfile: null
      };
    }
  },

  // -------------------------------------------------------------------------
  // SUBMIT RESULT — Vast.ai does NOT accept compute results (presence‑aware)
// -------------------------------------------------------------------------
  submitResult(job, result, globalHints = {}) {
    auctioneerCycle++;
    healingState.cycleCount++;

    const band = normalizeBand(VAST_RECEPTOR_DNA.band);
    const presenceField = buildPresenceField({ globalHints });

    const advantageField = buildAdvantageField(globalHints);
    const hintsField = buildHintsField(globalHints);
    const presenceTier = classifyAuctioneerPresenceTier(presenceField);

    const jobId = job?.id ?? null;

    healingState.lastSubmitJobId = jobId;
    healingState.lastSubmitError = null;
    healingState.lastSubmitSignature = buildSubmitSignature(jobId);
    healingState.lastBandSignature = buildBandSignature(band);
    healingState.lastAuctioneerCycleSignature =
      buildAuctioneerCycleSignature(auctioneerCycle, presenceTier);

    const binaryField = buildBinaryField(presenceField);
    const waveField = buildWaveField(band, presenceField);

    const auctioneerPresenceProfile = {
      presenceTier,
      band,
      meshPressureIndex: presenceField.meshPressureIndex,
      castleLoadLevel: presenceField.castleLoadLevel,
      advantageTier: advantageField.advantageTier,
      fallbackBandLevel: hintsField.fallbackBandLevel
    };

    const binaryProfile = { binaryField, presenceTier };
    const waveProfile = { waveField, presenceTier };

    healingState.lastBinaryField = binaryField;
    healingState.lastWaveField = waveField;
    healingState.lastPresenceField = presenceField;
    healingState.lastAdvantageField = advantageField;
    healingState.lastHintsField = hintsField;
    healingState.lastAuctioneerPresenceProfile = auctioneerPresenceProfile;
    healingState.lastBinaryProfile = binaryProfile;
    healingState.lastWaveProfile = waveProfile;

    return {
      ok: true,
      marketplace: "vast",
      jobId,
      result,
      signature: healingState.lastSubmitSignature,
      bandSignature: healingState.lastBandSignature,
      binaryField,
      waveField,
      presenceField,
      advantageField,
      hintsField,
      auctioneerPresenceProfile,
      binaryProfile,
      waveProfile,
      note: "Vast.ai does not accept compute results (v12.3-PRESENCE-EVO+ deterministic)."
    };
  },

  // -------------------------------------------------------------------------
  // NORMALIZE JOB — Vast → Pulse‑Earn schema (v14‑IMMORTAL)
  // Never returns null unless job is truly invalid.
  // Auto-fills missing fields, presence-aware, deterministic.
  // -------------------------------------------------------------------------
  normalizeJob(raw, globalHints = {}) {
    try {
      // -------------------------------------------------------------
      // 0. Build presence/advantage/hints surfaces (v14)
      // -------------------------------------------------------------
      const presenceField = buildPresenceField({ globalHints });
      const advantageField = buildAdvantageField({ globalHints });
      const hintsField = buildHintsField({ globalHints });
      const presenceTier = classifyAuctioneerPresenceTier(presenceField);

      // -------------------------------------------------------------
      // 1. Validate raw job
      // -------------------------------------------------------------
      if (!raw || typeof raw !== "object") {
        healingState.lastNormalizationError = "invalid_raw_job";
        healingState.lastNormalizationSignature = buildNormalizationSignature(null);
        return null;
      }

      // Vast sometimes uses id, sometimes uses "job_id", sometimes "id_str"
      const id =
        raw.id ??
        raw.job_id ??
        raw.id_str ??
        raw.offer_id ??
        null;

      if (!id) {
        healingState.lastNormalizationError = "missing_id";
        healingState.lastNormalizationSignature = buildNormalizationSignature(null);
        return null;
      }

      // -------------------------------------------------------------
      // 2. Extract payout (Vast uses many fields)
      // -------------------------------------------------------------
      const payout =
        Number(raw.dph_total) ||
        Number(raw.price_per_hour) ||
        Number(raw.dph) ||
        Number(raw.total_dph) ||
        0;

      if (!Number.isFinite(payout) || payout <= 0) {
        // v14: DO NOT return null — fallback to tiny payout
        healingState.lastNormalizationError = "non_positive_payout_fallback";
      }

      const finalPayout = payout > 0 ? payout : 0.01;

      // -------------------------------------------------------------
      // 3. Extract CPU / RAM / GPU / Bandwidth
      // Vast job shapes vary wildly — v14 normalizer handles all.
      // -------------------------------------------------------------
      const cpuRequired =
        Number(raw.cpu_cores) ||
        Number(raw.cpu) ||
        Number(raw.vcpu) ||
        1;

      const memoryRequired =
        (Number(raw.ram_gb) * 1024) ||
        Number(raw.memory_mb) ||
        Number(raw.mem) ||
        1024;

      const estimatedSeconds =
        Number(raw.estimated_seconds) ||
        Number(raw.duration) ||
        3600;

      // GPU score heuristic
      const gpuScore =
        Number(raw.gpu_ram) * 10 ||
        Number(raw.gpu_score) ||
        Number(raw.min_gpu_score) ||
        80;

      const bandwidth =
        Number(raw.net_up) ||
        Number(raw.bandwidth) ||
        Number(raw.net_mbps) ||
        5;

      // -------------------------------------------------------------
      // 4. Build normalized job (v14)
      // -------------------------------------------------------------
      const normalized = {
        id: String(id),
        marketplaceId: "vast",

        payout: finalPayout,
        cpuRequired,
        memoryRequired,
        estimatedSeconds,

        minGpuScore: gpuScore,
        bandwidthNeededMbps: bandwidth,

        // v14 presence-aware metadata
        presenceField,
        advantageField,
        hintsField,
        presenceTier,

        // v14 meta
        meta: {
          rawSource: "vast",
          rawJob: raw,
          version: "v14-IMMORTAL",
          band: raw.band || raw.meta?.band || "symbolic"
        }
      };

      // -------------------------------------------------------------
      // 5. Healing state updates
      // -------------------------------------------------------------
      healingState.lastNormalizedJobId = normalized.id;
      healingState.lastNormalizationError = null;
      healingState.lastNormalizationSignature =
        buildNormalizationSignature(normalized.id);

      return normalized;

    } catch (err) {
      healingState.lastNormalizationError = err.message;
      healingState.lastNormalizationSignature =
        buildNormalizationSignature(null);
      return null;
    }
  }

};


// ============================================================================
// HEALING STATE EXPORT — v12.3‑PRESENCE‑EVO+ A‑B‑A
// ============================================================================
export function getPulseEarnMktAuctioneerHealingState() {
  return { ...healingState };
}
