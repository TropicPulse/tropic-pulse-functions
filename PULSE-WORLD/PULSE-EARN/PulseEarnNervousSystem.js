// ============================================================================
//  PulseEarnNervousSystem-v12.3-PRESENCE-EVO+.js
//  THE NERVOUS SYSTEM + EXCHANGE OFFICE (v12.3 Presence + Advantage‑C)
//  Deterministic Job Intake + Result Forwarding + Reputation Updating
//  Dual-Band + Binary + Wave + Presence + Chunk/Prewarm
// ============================================================================

export const PulseEarnNervousSystemMeta = Object.freeze({
  layer: "PulseEarnNervousSystem",
  role: "EARN_NERVOUS_ORGAN",
  version: "v12.3-PRESENCE-EVO+",
  identity: "PulseEarnNervousSystem-v12.3-PRESENCE-EVO+",

  guarantees: Object.freeze({
    deterministic: true,
    noRandomness: true,
    noRealTime: true,
    noExternalIO: true,
    pureInterface: true,

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
    zeroUserCode: true,
    deterministicReputationUpdates: true,
    deterministicJobIntake: true,
    deterministicResultForwarding: true
  }),

  contract: Object.freeze({
    input: [
      "MarketplaceJob",
      "DeviceProfile",
      "DualBandContext",
      "ReputationSignals",
      "CirculatoryRouting",
      "DevicePhenotypePresence"
    ],
    output: [
      "NervousJobIntakeResult",
      "NervousResultForwardingResult",
      "NervousDiagnostics",
      "NervousSignatures",
      "NervousHealingState",
      "NervousPresenceField",
      "NervousAdvantageField",
      "NervousChunkPrewarmPlan"
    ]
  }),

  lineage: Object.freeze({
    root: "PulseOS-v12-PRESENCE",
    parent: "PulseEarn-v12.3-PRESENCE",
    ancestry: [
      "PulseEarnNervousSystem-v9",
      "PulseEarnNervousSystem-v10",
      "PulseEarnNervousSystem-v11",
      "PulseEarnNervousSystem-v11-Evo",
      "PulseEarnNervousSystem-v11.2-EVO"
    ]
  }),

  bands: Object.freeze({
    supported: ["symbolic", "binary"],
    default: "symbolic",
    behavior: "metadata-only"
  }),

  architecture: Object.freeze({
    pattern: "A-B-A",
    baseline: "deterministic sensory intake → deterministic motor output",
    adaptive: "binary/wave surfaces + dual-band signatures + presence/advantage fields",
    return: "deterministic job intake + deterministic result forwarding + prewarm hints"
  })
});

import { updateMarketplaceReputation, computeReputationSignals } from "./PulseEarnEndocrineSystem.js";
import { getNextJob } from "./PulseEarnCirculatorySystem.js";
import { getPulseEarnDeviceProfile } from "./PulseEarnSkeletalSystem.js";
import { PulseEarnMktEmbassyLedger as marketplaces } from "./PulseEarnMktEmbassyLedger.js";
import { sendResultToMarketplace } from "./PulseEarnLymphNodes.js";

// ============================================================================
// Healing Metadata — Neural Activity Log (v12.3-PRESENCE)
// ============================================================================
const nervousHealing = {
  lastFetchError: null,
  lastSubmitError: null,
  lastJobId: null,
  lastMarketplaceId: null,

  lastNervousSignature: null,
  lastJobIntakeSignature: null,
  lastResultForwardSignature: null,

  lastDevicePattern: null,
  lastJobPattern: null,

  cycleCount: 0,

  loopTheory: {
    routingCompletion: true,
    allowLoopfieldPropulsion: true,
    pulseComputeContinuity: true,
    errorRouteAround: true
  },

  // Dual-Band + Binary + Wave + Presence
  lastBand: "symbolic",
  lastBandSignature: null,
  lastBinaryField: null,
  lastWaveField: null,

  lastPresenceField: null,
  lastAdvantageField: null,
  lastChunkPrewarmPlan: null
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

// ============================================================================
// Pattern Builders
// ============================================================================
function buildDevicePattern(device) {
  return (
    `DEVICE::cpu:${device.cpuCores}` +
    `::mem:${device.memoryMB}` +
    `::gpu:${device.gpuScore}` +
    `::bw:${device.bandwidthMbps}` +
    `::stab:${device.stabilityScore}`
  );
}

function buildJobPattern(job) {
  if (!job) return "JOB::NONE";
  return (
    `JOB::${job.id}` +
    `::market:${job.marketplaceId}` +
    `::cpu:${job.cpuRequired ?? 0}` +
    `::mem:${job.memoryRequired ?? 0}` +
    `::sec:${job.estimatedSeconds ?? 0}`
  );
}

// ============================================================================
// Dual-Band + Binary + Wave Builder — v12.3 Presence
// ============================================================================
function buildNervousBandBinaryWave(job, result, cycleIndex, device) {
  const band = normalizeBand(
    result?.band ||
    job?.band ||
    job?.meta?.band ||
    device?.band ||
    "symbolic"
  );
  nervousHealing.lastBand = band;
  const bandSignature = computeHash(`BAND::NERVOUS::${band}::${cycleIndex}`);
  nervousHealing.lastBandSignature = bandSignature;

  const jobIdLength = (job?.id || "").length;
  const marketplaceLength = (job?.marketplaceId || "").length;
  const gpuScore = device?.gpuScore || 0;

  const surface = jobIdLength + marketplaceLength + gpuScore + cycleIndex;

  const binaryField = {
    binaryNervousSignature: computeHash(`BNERV::${surface}`),
    binarySurfaceSignature: computeHash(`BSURF_NERV::${surface}`),
    binarySurface: {
      jobIdLength,
      marketplaceLength,
      gpuScore,
      cycle: cycleIndex,
      surface
    },
    parity: surface % 2 === 0 ? 0 : 1,
    density: marketplaceLength + gpuScore,
    shiftDepth: Math.max(0, Math.floor(Math.log2(surface || 1)))
  };
  nervousHealing.lastBinaryField = binaryField;

  const waveField = {
    amplitude: marketplaceLength + gpuScore,
    wavelength: cycleIndex || 1,
    phase: (marketplaceLength + cycleIndex) % 16,
    band,
    mode: band === "binary" ? "compression-wave" : "symbolic-wave"
  };
  nervousHealing.lastWaveField = waveField;

  return { band, bandSignature, binaryField, waveField };
}

// ============================================================================
// Presence Field — v12.3
// ============================================================================
function buildNervousPresenceField(job, device, cycleIndex) {
  const jobLen = (job?.id || "").length;
  const marketLen = (job?.marketplaceId || "").length;
  const stability = device?.stabilityScore || 0.7;

  const composite =
    jobLen * 0.001 +
    marketLen * 0.001 +
    stability * 0.01;

  const presenceTier =
    composite >= 0.02 ? "presence_high" :
    composite >= 0.005 ? "presence_mid" :
    "presence_low";

  const presenceField = {
    presenceVersion: "v12.3",
    presenceTier,
    jobLen,
    marketLen,
    stability,
    cycleIndex,
    presenceSignature: computeHash(
      `NERV_PRESENCE::${presenceTier}::${jobLen}::${marketLen}::${cycleIndex}`
    )
  };

  nervousHealing.lastPresenceField = presenceField;
  return presenceField;
}

// ============================================================================
// Advantage‑C Field — v12.3
// ============================================================================
function buildNervousAdvantageField(job, device, bandPack, presenceField) {
  const gpuScore = device?.gpuScore || 0;
  const bandwidth = device?.bandwidthMbps || 0;
  const density = bandPack.binaryField.density;
  const amplitude = bandPack.waveField.amplitude;

  const advantageScore =
    gpuScore * 0.0005 +
    bandwidth * 0.0002 +
    density * 0.00001 +
    amplitude * 0.00001 +
    (presenceField.presenceTier === "presence_high" ? 0.01 : 0);

  const advantageField = {
    advantageVersion: "C",
    band: bandPack.band,
    gpuScore,
    bandwidth,
    binaryDensity: density,
    waveAmplitude: amplitude,
    presenceTier: presenceField.presenceTier,
    advantageScore
  };

  nervousHealing.lastAdvantageField = advantageField;
  return advantageField;
}

// ============================================================================
// Chunk / Cache / Prewarm Plan — v12.3
// ============================================================================
function buildNervousChunkPrewarmPlan(job, device, presenceField) {
  const basePriority =
    presenceField.presenceTier === "presence_high"
      ? 3
      : presenceField.presenceTier === "presence_mid"
      ? 2
      : 1;

  const gpuBoost = (device?.gpuScore || 0) > 600 ? 1 : 0;
  const priority = basePriority + gpuBoost;

  const plan = {
    planVersion: "v12.3-AdvantageC",
    priority,
    band: presenceField.presenceTier,
    chunks: {
      jobEnvelope: true,
      metabolismBlueprint: true,
      marketplaceHandshake: true
    },
    cache: {
      deviceProfile: true,
      nervousDiagnostics: true
    },
    prewarm: {
      survivalInstincts: true,
      circulatorySystem: presenceField.presenceTier !== "presence_low",
      lymphNodes: presenceField.presenceTier !== "presence_low"
    }
  };

  nervousHealing.lastChunkPrewarmPlan = plan;
  return plan;
}

// ============================================================================
// fetchJobFromMarketplace — Sensory Intake (v12.3-PRESENCE)
// ============================================================================
export function fetchJobFromMarketplace() {
  nervousHealing.cycleCount++;

  try {
    const device = getPulseEarnDeviceProfile();
    const devicePattern = buildDevicePattern(device);
    nervousHealing.lastDevicePattern = devicePattern;

    const capacity = {
      cpuAvailable: device.cpuCores,
      memoryAvailable: device.memoryMB
    };

    const job = getNextJob(marketplaces, capacity);

    if (job) {
      nervousHealing.lastJobId = job.id;
      nervousHealing.lastMarketplaceId = job.marketplaceId;
      nervousHealing.lastJobPattern = buildJobPattern(job);

      nervousHealing.lastJobIntakeSignature = computeHash(
        `${job.id}::${job.marketplaceId}::${nervousHealing.cycleCount}`
      );

      const bandPack = buildNervousBandBinaryWave(
        job,
        null,
        nervousHealing.cycleCount,
        device
      );
      const presenceField = buildNervousPresenceField(
        job,
        device,
        nervousHealing.cycleCount
      );
      const advantageField = buildNervousAdvantageField(
        job,
        device,
        bandPack,
        presenceField
      );
      const chunkPrewarmPlan = buildNervousChunkPrewarmPlan(
        job,
        device,
        presenceField
      );

      return {
        job,
        band: bandPack.band,
        bandSignature: bandPack.bandSignature,
        binaryField: bandPack.binaryField,
        waveField: bandPack.waveField,
        presenceField,
        advantageField,
        chunkPrewarmPlan
      };
    }

    return null;

  } catch (err) {
    nervousHealing.lastFetchError = err.message;
    return null;
  }
}

// ============================================================================
// getNextMarketplaceJob — Neural Encoding Layer (v12.3-PRESENCE)
// ============================================================================
export function getNextMarketplaceJob(deviceId) {
  const intake = fetchJobFromMarketplace();
  if (!intake || !intake.job) return null;

  const job = intake.job;

  if (!job.id || !job.marketplaceId) {
    nervousHealing.lastFetchError = "invalid_job_structure";
    return null;
  }

  return {
    id: job.id,

    payload: {
      type: "marketplace-job",
      data: {
        marketplaceId: job.marketplaceId,
        cpuRequired: job.cpuRequired ?? 0,
        memoryRequired: job.memoryRequired ?? 0,
        estimatedSeconds: job.estimatedSeconds ?? 0
      },
      gpu: {
        workgroupSize: 1,
        iterations: 1,
        shader: ""
      }
    },

    marketplace: job.marketplaceId,
    assignedTo: deviceId,

    cycleIndex: nervousHealing.cycleCount,

    band: intake.band,
    bandSignature: intake.bandSignature,
    binaryField: intake.binaryField,
    waveField: intake.waveField,
    presenceField: intake.presenceField,
    advantageField: intake.advantageField,
    chunkPrewarmPlan: intake.chunkPrewarmPlan
  };
}

// ============================================================================
// submitMarketplaceResult — Motor Output + Synaptic Update (v12.3-PRESENCE)
// ============================================================================
export function submitMarketplaceResult(job, result) {
  try {
    if (!job || !job.marketplaceId) {
      nervousHealing.lastSubmitError = "invalid_job_for_submission";
      return null;
    }

    const device = getPulseEarnDeviceProfile();

    const signals = computeReputationSignals({
      latencyMs: result.latencyMs ?? 0,
      apiErrors: result.apiErrors ?? 0,
      jobsReturned: result.jobsReturned ?? 0,
      profitableJobs: result.profitableJobs ?? 0,
      jobSuccessRate: result.jobSuccessRate ?? 0,
      avgProfitPerJob: result.avgProfitPerJob ?? 0
    });

    updateMarketplaceReputation(job.marketplaceId, signals);

    const submission = sendResultToMarketplace(job, result);

    nervousHealing.lastResultForwardSignature = computeHash(
      `${job.id}::${job.marketplaceId}::${result.jobSuccessRate ?? 0}`
    );

    const bandPack = buildNervousBandBinaryWave(
      job,
      result,
      nervousHealing.cycleCount,
      device
    );
    const presenceField = buildNervousPresenceField(
      job,
      device,
      nervousHealing.cycleCount
    );
    const advantageField = buildNervousAdvantageField(
      job,
      device,
      bandPack,
      presenceField
    );
    const chunkPrewarmPlan = buildNervousChunkPrewarmPlan(
      job,
      device,
      presenceField
    );

    return {
      submission,
      band: bandPack.band,
      bandSignature: bandPack.bandSignature,
      binaryField: bandPack.binaryField,
      waveField: bandPack.waveField,
      presenceField,
      advantageField,
      chunkPrewarmPlan
    };

  } catch (err) {
    nervousHealing.lastSubmitError = err.message;
    return null;
  }
}

// ============================================================================
// Nervous System Signature
// ============================================================================
function buildNervousSignature() {
  return computeHash(
    `${nervousHealing.lastJobId}::${nervousHealing.lastMarketplaceId}::${nervousHealing.cycleCount}`
  );
}

// ============================================================================
// Export Healing Metadata — Nervous System Health Report (v12.3-PRESENCE)
// ============================================================================
export function getPulseEarnNervousSystemHealingState() {
  nervousHealing.lastNervousSignature = buildNervousSignature();
  return { ...nervousHealing };
}
