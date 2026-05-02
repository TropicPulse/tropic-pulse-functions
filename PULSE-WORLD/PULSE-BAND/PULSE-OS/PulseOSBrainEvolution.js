// ============================================================================
// FILE: /PulseOS/Brain/PulseOSEvolution-v14-IMMORTAL-CoreMemory.js
// PULSE OS — v14-IMMORTAL-DUALBAND-PRESENCE
// “THE EVOLUTION ENGINE — ORGANISM-WIDE CNS GROWTH + DRIFT INTELLIGENCE”
// CoreMemory-integrated • Immortal Drift/Lineage • Cache/Prewarm-aware
// ============================================================================
/*
AI_EXPERIENCE_META = {
  identity: "PulseOSBrainEvolution",
  version: "v14-IMMORTAL",
  layer: "cns",
  role: "os_evolution_engine",
  lineage: "PulseOS-v14",

  evo: {
    evolutionEngine: true,
    lineageAware: true,
    driftScanner: true,
    structuralDriftAware: true,

    symbolicPrimary: true,
    binaryAware: true,
    dualBand: true,

    deterministic: true,
    driftProof: true,
    zeroNetwork: true,
    zeroFilesystem: true,

    intentAware: true,
    organismMapAware: true,
    iqMapAware: true,

    safeRouteFree: true,
    zeroMutationOfInput: true
  },

  contract: {
    always: [
      "PulseOSBrain",
      "PulseOSBrainCortex",
      "PulseChunker"
    ],
    never: [
      "legacyBrainEvolution",
      "safeRoute",
      "fetchViaCNS"
    ]
  }
}
*/

import { PulseCoreMemory } from "../PULSE-CORE/PulseCoreMemory.js";

// ============================================================================
// ROLE + IDENTITY (v14-IMMORTAL)
// ============================================================================
export const PulseRole = {
  type: "Evolution",
  subsystem: "OS",
  layer: "CNS",
  version: "14-IMMORTAL",
  identity: "PulseOSEvolution-v14-IMMORTAL-COREMEMORY",

  evo: {
    deterministic: true,
    driftProof: true,
    multiInstanceReady: true,
    unifiedAdvantageField: true,
    zeroNetwork: true,
    zeroFilesystem: true,

    loopTheoryAware: true,
    continuanceAware: true,

    routingContract: "PulseRouter-v14",
    osOrganContract: "PulseOS-v14-IMMORTAL",
    earnCompatibility: "PulseEarn-v14",
    gpuCompatibility: "PulseGPU-v14",
    sendCompatibility: "PulseSendSystem-v14",

    dualMode: true,
    symbolicPrimary: true,
    binaryAware: true,
    binaryNonExecutable: true,
    advantageCascadeAware: true,
    pulseEfficiencyAware: true,
    futureEvolutionReady: true,

    presenceFieldAware: true,
    bluetoothPresenceAware: true,
    meshPresenceRelayAware: true,
    meshTopologyAware: true,
    cortexChunkingAware: true,
    cortexPrewarmAware: true,

    // v14-IMMORTAL
    coreMemoryIntegrated: true,
    immortalDriftLineage: true,
    immortalOrganismHealth: true,
    cacheChunkAware: true,
    prewarmAware: true
  }
};

export const PulseOSEvolutionMeta = Object.freeze({
  layer: "PulseOSEvolution",
  role: "CNS_EVOLUTION_ORGAN",
  version: "v14-IMMORTAL-COREMEMORY",
  identity: "PulseOSEvolution-v14-IMMORTAL-COREMEMORY",

  guarantees: Object.freeze({
    deterministic: true,
    driftProof: true,
    multiInstanceReady: true,

    cnsEvolutionEngine: true,
    organismEvolutionEngine: true,
    organEvolutionEngine: true,
    lineageTracker: true,
    driftScanner: true,
    structuralDriftAware: true,
    symbolicPrimary: true,
    binaryAware: true,
    dualBandAware: true,
    binaryNonExecutable: true,
    futureEvolutionReady: true,

    attachesIntentToBrain: true,
    attachesOrganismMapToBrain: true,
    attachesIQMapToBrain: true,
    attachesEvolutionToBrain: true,
    bootsCortex: true,

    presenceFieldAware: true,
    bluetoothPresenceAware: true,
    meshPresenceRelayAware: true,
    meshTopologyAware: true,
    cortexChunkingAware: true,
    cortexPrewarmAware: true,

    zeroNetwork: true,
    zeroFilesystem: true,
    zeroDynamicImports: true,
    zeroEval: true,
    zeroDateNow: true,
    zeroUserCode: true,
    worldLensAware: true,

    loopTheoryAware: true,
    continuanceAware: true,

    // v14-IMMORTAL
    coreMemoryIntegrated: true,
    immortalDriftLineage: true,
    immortalOrganismHealth: true,
    cacheChunkAware: true,
    prewarmAware: true
  })
});

// Cortex is ONLY imported here — NOT in Brain
import { createPulseOSCortex } from "./PulseOSBrainCortex.js";

const CORE_MEMORY_NAMESPACE = "PulseOSEvolution-v14-IMMORTAL";

// ============================================================================
//  DETERMINISTIC HELPERS (no Date, no randomness)
// ============================================================================
function stableStringify(value) {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) {
    return "[" + value.map(stableStringify).join(",") + "]";
  }
  const keys = Object.keys(value).sort();
  return (
    "{" +
    keys.map((k) => JSON.stringify(k) + ":" + stableStringify(value[k])).join(",") +
    "}"
  );
}

function computeHash(str) {
  let h = 0;
  const s = String(str || "");
  for (let i = 0; i < s.length; i++) {
    h = (h + s.charCodeAt(i) * (i + 1)) % 100000;
  }
  return `h${h}`;
}

function normalizeBand(band) {
  return band === "binary" || band === "symbolic" || band === "dual"
    ? band
    : "dual";
}

// v14: cacheChunk + prewarm surfaces for evolution scans
function buildCacheChunkSurface({ intent, organism, iq, band }) {
  const shape = {
    intent: intent || "NO_INTENT",
    organs: organism ? Object.keys(organism) : [],
    iqKeys: iq ? Object.keys(iq) : [],
    band: normalizeBand(band)
  };
  const serialized = stableStringify(shape);
  const cacheChunkKey = "evolution-cache::" + computeHash(serialized);
  return {
    cacheChunkKey,
    cacheChunkSignature: computeHash(cacheChunkKey)
  };
}

function buildPrewarmSurface({ iq, band }) {
  const profiles = iq?.chunkingProfiles || {};
  const hasCortexPrewarm = !!profiles.default || !!profiles.routes;

  let level = "none";
  if (hasCortexPrewarm && band === "binary") level = "aggressive";
  else if (hasCortexPrewarm && band === "dual") level = "medium";
  else if (hasCortexPrewarm) level = "light";

  const raw = stableStringify({
    hasCortexPrewarm,
    band: normalizeBand(band)
  });

  const prewarmKey = "evolution-prewarm::" + computeHash(raw);

  return {
    level,
    prewarmKey
  };
}

// ============================================================================
//  CORE MEMORY INTEGRATION — immortal drift/lineage/health
// ============================================================================
function coreMemoryRecord(key, payload) {
  if (!key) return;
  try {
    if (PulseCoreMemory && typeof PulseCoreMemory.record === "function") {
      PulseCoreMemory.record(CORE_MEMORY_NAMESPACE, key, payload);
    }
  } catch {
    // fail-open
  }
}

function coreMemoryRecall(key) {
  if (!key) return null;
  try {
    if (PulseCoreMemory && typeof PulseCoreMemory.recall === "function") {
      return PulseCoreMemory.recall(CORE_MEMORY_NAMESPACE, key) || null;
    }
  } catch {
    // fail-open
  }
  return null;
}

function buildDriftStateKey(intent) {
  return `DRIFT_STATE::${String(intent || "NO_INTENT")}`;
}

function buildLineageKey(intent) {
  return `LINEAGE::${String(intent || "NO_INTENT")}`;
}

function buildOrganHealthKey(intent) {
  return `ORGAN_HEALTH::${String(intent || "NO_INTENT")}`;
}

function buildOrganismHealthKey(intent) {
  return `ORGANISM_HEALTH::${String(intent || "NO_INTENT")}`;
}

// ============================================================================
//  EVOLUTION ENGINE — v14-IMMORTAL-COREMEMORY
// ============================================================================
export function PulseOSEvolution({ intent, organism, iq, understanding }) {

  let seq = 0;
  const nextSeq = () => ++seq;

  // --------------------------------------------------------------------------
  // Presence + chunking metadata
  // --------------------------------------------------------------------------
  function computePresenceDescriptors() {
    const presenceConfig = iq?.presenceConfig || {};
    const meshConfig = iq?.meshPresenceConfig || {};

    return {
      presenceField: {
        enabled: !!presenceConfig.enabled,
        bluetoothPreferred: !!presenceConfig.bluetoothPreferred,
        routes: presenceConfig.routes || []
      },
      meshPresence: {
        enabled: !!meshConfig.enabled,
        topology: meshConfig.topology || "none",
        routes: meshConfig.routes || []
      },
      organismSnapshot: {
        organs: organism ? Object.keys(organism) : []
      }
    };
  }

  function computeChunkingProfiles() {
    const profiles = iq?.chunkingProfiles || {};
    return {
      defaultProfile: profiles.default || null,
      routeProfiles: profiles.routes || {},
      gpuProfiles: profiles.gpu || {}
    };
  }

  // --------------------------------------------------------------------------
  // Drift + lineage state (seeded from CoreMemory if present)
  // --------------------------------------------------------------------------
  const driftKey = buildDriftStateKey(intent);
  const lineageKey = buildLineageKey(intent);
  const organHealthKey = buildOrganHealthKey(intent);
  const organismHealthKey = buildOrganismHealthKey(intent);

  const recalledDrift = coreMemoryRecall(driftKey);
  const recalledLineage = coreMemoryRecall(lineageKey);
  const recalledOrganHealth = coreMemoryRecall(organHealthKey);
  const recalledOrganismHealth = coreMemoryRecall(organismHealthKey);

  const DriftState = {
    lineage: Array.isArray(recalledLineage?.lineage)
      ? recalledLineage.lineage.slice()
      : [],
    driftEvents: Array.isArray(recalledDrift?.driftEvents)
      ? recalledDrift.driftEvents.slice()
      : [],
    organHealth:
      recalledOrganHealth && typeof recalledOrganHealth.organHealth === "object"
        ? { ...recalledOrganHealth.organHealth }
        : {},
    organismHealth:
      typeof recalledOrganismHealth?.organismHealth === "number"
        ? recalledOrganismHealth.organismHealth
        : 1.0,
    lastScanSeq: recalledDrift?.lastScanSeq || null,
    lastScanBand: recalledDrift?.lastScanBand || "dual",
    binaryDescriptor: recalledDrift?.binaryDescriptor || null,
    presenceDescriptors: computePresenceDescriptors(),
    chunkingProfiles: computeChunkingProfiles(),

    // v14 cache/prewarm surfaces
    cacheChunkSurface: null,
    prewarmSurface: null
  };

  // --------------------------------------------------------------------------
  // DRIFT SCANNER
  // --------------------------------------------------------------------------
  function scanDrift(Brain, { band = "dual", dnaTag = null } = {}) {
    const normBand = normalizeBand(band);
    const drift = [];

    if (!Brain.intent) drift.push("missing-intent-map");
    if (!Brain.PulseOrganismMap) drift.push("missing-organism-map");
    if (!Brain.PulseIQMap) drift.push("missing-iq-map");

    const descriptor = Brain.BrainIntel?.getBinaryOrganismDescriptor?.();
    DriftState.binaryDescriptor = descriptor || null;

    DriftState.presenceDescriptors = computePresenceDescriptors();
    DriftState.chunkingProfiles = computeChunkingProfiles();

    DriftState.lastScanSeq = nextSeq();
    DriftState.lastScanBand = normBand;
    DriftState.driftEvents.push(...drift);

    DriftState.lineage.push({
      seq: DriftState.lastScanSeq,
      band: normBand,
      dnaTag,
      event: "drift-scan"
    });

    // v14: cache/prewarm surfaces for this scan
    DriftState.cacheChunkSurface = buildCacheChunkSurface({
      intent,
      organism,
      iq,
      band: normBand
    });
    DriftState.prewarmSurface = buildPrewarmSurface({
      iq,
      band: normBand
    });

    // persist drift + lineage + cache/prewarm into CoreMemory
    coreMemoryRecord(driftKey, {
      lastScanSeq: DriftState.lastScanSeq,
      lastScanBand: DriftState.lastScanBand,
      driftEvents: DriftState.driftEvents.slice(),
      binaryDescriptor: DriftState.binaryDescriptor,
      cacheChunkSurface: DriftState.cacheChunkSurface,
      prewarmSurface: DriftState.prewarmSurface
    });

    coreMemoryRecord(lineageKey, {
      lineage: DriftState.lineage.slice()
    });

    return drift;
  }

  // --------------------------------------------------------------------------
  // LINEAGE ENGINE
  // --------------------------------------------------------------------------
  function recordLineage(event, { band = "dual", dnaTag = null } = {}) {
    DriftState.lineage.push({
      seq: nextSeq(),
      band: normalizeBand(band),
      dnaTag,
      event
    });

    coreMemoryRecord(lineageKey, {
      lineage: DriftState.lineage.slice()
    });
  }

  // --------------------------------------------------------------------------
  // ORGAN HEALTH ENGINE
  // --------------------------------------------------------------------------
  function updateOrganHealth(organName, score, { band = "dual", dnaTag = null } = {}) {
    DriftState.organHealth[organName] = score;

    DriftState.lineage.push({
      seq: nextSeq(),
      band: normalizeBand(band),
      dnaTag,
      event: `organ-health-update:${organName}`
    });

    coreMemoryRecord(organHealthKey, {
      organHealth: { ...DriftState.organHealth }
    });

    coreMemoryRecord(lineageKey, {
      lineage: DriftState.lineage.slice()
    });
  }

  function computeOrganismHealth({ band = "dual", dnaTag = null } = {}) {
    const values = Object.values(DriftState.organHealth);
    DriftState.organismHealth =
      values.length === 0 ? 1.0 : values.reduce((a, b) => a + b, 0) / values.length;

    DriftState.lineage.push({
      seq: nextSeq(),
      band: normalizeBand(band),
      dnaTag,
      event: "organism-health-computed"
    });

    coreMemoryRecord(organismHealthKey, {
      organismHealth: DriftState.organismHealth
    });

    coreMemoryRecord(lineageKey, {
      lineage: DriftState.lineage.slice()
    });

    return DriftState.organismHealth;
  }

  // --------------------------------------------------------------------------
  // EVOLUTION → CORTEX BOOTSTRAP (v14-IMMORTAL)
// --------------------------------------------------------------------------
  function bootCortex(Brain, { band = "dual", dnaTag = null } = {}) {
    const normBand = normalizeBand(band);

    // Attach maps + understanding + evolution to Brain
    Brain.intent           = intent;
    Brain.PulseOrganismMap = organism;
    Brain.PulseIQMap       = iq;
    Brain.understanding    = understanding;
    Brain.evolution        = Evolution;

    recordLineage("cortex-boot", { band: normBand, dnaTag });

    const cortex = createPulseOSCortex({ Brain });

    // v14: allow cortex to see cache/prewarm surfaces from Evolution
    cortex.boot({
      band: normBand,
      cacheChunkSurface: DriftState.cacheChunkSurface,
      prewarmSurface: DriftState.prewarmSurface
    });

    Brain.cortex = cortex;

    scanDrift(Brain, { band: normBand, dnaTag });

    return cortex;
  }

  // --------------------------------------------------------------------------
  // PUBLIC EVOLUTION ORGAN SURFACE
  // --------------------------------------------------------------------------
  const Evolution = {
    PulseRole,
    DriftState,
    scanDrift,
    recordLineage,
    updateOrganHealth,
    computeOrganismHealth,
    bootCortex,
    getPresenceDescriptors: () => DriftState.presenceDescriptors,
    getChunkingProfiles: () => DriftState.chunkingProfiles,
    getCacheChunkSurface: () => DriftState.cacheChunkSurface,
    getPrewarmSurface: () => DriftState.prewarmSurface
  };

  return Evolution;
}
