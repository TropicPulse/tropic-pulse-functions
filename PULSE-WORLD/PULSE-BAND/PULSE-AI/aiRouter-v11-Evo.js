// ============================================================================
//  PULSE OS v16-IMMORTAL-ORGANISM — AI ROUTER ORGAN
//  AI Router • Organism-Aware • Persona Selector • Archetype Map • Failover Brain
//  PURE ROUTING • ZERO MUTATION • ZERO RANDOMNESS • DUALBAND‑AWARE • ORGANISM‑AWARE
//  ROUTING ARTERY v4 • BINARY SNAPSHOT AWARE • HOT-PATH CACHED • HEALTH-SCORE DRIVEN
// ============================================================================

/*
AI_EXPERIENCE_META = {
  identity: "aiRouter",
  version: "v16-IMMORTAL-ORGANISM",
  layer: "ai_core",
  role: "ai_router_organism",
  lineage: "aiRouter-v10 → v13.0-PRESENCE-ADV → v16-IMMORTAL-ORGANISM",

  evo: {
    routingEngine: true,
    organRouting: true,
    organismAware: true,
    castleAware: true,
    meshAware: true,
    expansionAware: true,
    serverAware: true,
    worldCoreAware: true,
    earnAware: true,
    dualBandAware: true,
    binarySendAware: true,
    routerHealthAware: true,

    symbolicPrimary: true,
    binaryAware: true,
    dualBand: true,

    deterministic: true,
    driftProof: true,
    pureCompute: true,
    zeroNetwork: true,
    zeroFilesystem: true,
    zeroMutationOfInput: true
  },

  AI_ROUTER_ORGANISM_AWARENESS: {
    readsCastle: true,
    readsMesh: true,
    readsExpansion: true,
    readsServer: true,
    readsWorldCore: true,
    readsEarn: true,
    readsDualBand: true,
    readsBinarySend: true,
    readsRuntime: true,
    readsScheduler: true
  },

  AI_ROUTER_FAILOVER_BEHAVIOR: {
    canTakeOverAIRouting: true,
    watchesRouterHealth: true,
    watchesOrganismStress: true
  },

  AI_ROUTER_STRESS_OVERRIDES: {
    personaOverrideOnStress: true,
    safetyOverrideOnFallbackBand: true,
    symbolicFallbackOnBinaryPressure: true
  },

  AI_ROUTER_HEALTH_SCORE_SYSTEM: {
    enabled: true,
    compositeOrganismScore: true
  },

  contract: {
    always: ["aiEngine", "aiCortex", "aiContext"],
    never: ["safeRoute", "fetchViaCNS"]
  }
}
*/

// ============================================================================
//  IMPORTS — Personas / Overmind / NodeAdmin
// ============================================================================

import { Personas, getPersona } from "./persona.js";
import Overmind from "./aiOvermindPrime.js";
import NodeAdmin from "../PULSE-TOOLS/PulseNodeAdmin-v11-Evo.js";

// ============================================================================
//  IMPORTS — Organism Context (HYBRID: attach OR pull)
//  NOTE: these are symbolic-only; router never mutates them.
// ============================================================================

// WorldCore / User
import { PulseWorldCoreMeta, createPulseWorldCore} from "../PULSE-EXPANSION/PulseUser-v12.3-Presence.js";

// Castle / Mesh / BeaconMesh / Expansion / Server / Router
import { PulseCastleMeta } from "../PULSE-EXPANSION/PulseCastle-v12.3-Presence.js";
import createPulseMesh, { PulseMeshMeta} from "../PULSE-MESH/PulseMesh-v11-Evo.js";
import PulseBeaconMesh, { PulseBeaconMeshMeta} from "../PULSE-EXPANSION/PulseBeaconMesh-v12.3-Presence.js";
import PulseBeaconEngine from "../PULSE-EXPANSION/PulseBeaconEngine-v12.3-Presence.js";
import { PulseExpansionMeta } from "../PULSE-EXPANSION/PulseExpansion-v12.3-Presence.js";
import { PulseServerMeta } from "../PULSE-EXPANSION/PulseServer-v12.3-Presence.js";
import { PulseRouterMeta } from "../PULSE-EXPANSION/PulseRouter-v12.3-Presence.js";

// Earn / Band / Send
import { getEarnContext } from "../PULSE-EARN/PulseEarn-v12.3-Presence.js";
import { createDualBandOrganism as PulseBinaryOrganismBoot } from "../PULSE-AI/aiDualBand-v11-Evo.js";
import { createBinarySend as PulseSendBin } from "../PULSE-SEND/PulseBinarySend-v11-EVO.js";
import createBinaryRouter           from "../PULSE-ROUTER/PulseBinaryRouter-v11-Evo.js";
import PulseRouter           from "../PULSE-ROUTER/PulseRouter-v11-Evo.js";
// Runtime / Scheduler (symbolic context only)
import PulseRuntimeV2 from "../PULSE-X/PulseRuntime-v2-Evo.js";
import { createPulseScheduler } from "../PULSE-X/PulseScheduler-v2.js";

const { getRuntimeStateV2: getRuntimeStateV2Context} = PulseRuntimeV2;

// ============================================================================
//  META — AI Router Identity
// ============================================================================

export const AIRouterMeta = Object.freeze({
  layer: "PulseAIRouter",
  role: "CNS_ROUTER_ORGANISM",
  version: "v16-IMMORTAL-ORGANISM",
  identity: "aiRouter-v16-IMMORTAL-ORGANISM",

  evo: Object.freeze({
    driftProof: true,
    deterministic: true,
    dualband: true,
    binaryAware: true,
    symbolicAware: true,
    personaAware: true,
    boundaryAware: true,
    permissionAware: true,
    archetypeAware: true,
    routingAware: true,
    routingArteryAware: true,
    overmindAware: true,
    safetyAware: true,
    personalAware: true,
    multiInstanceReady: true,
    cacheAware: true,
    prewarmReady: true,
    organismAware: true,
    failoverAware: true,
    healthScoreAware: true,
    epoch: "v16-IMMORTAL-ORGANISM"
  }),

  contract: Object.freeze({
    purpose:
      "Decode intent, select persona, map archetypes, integrate dual-band + organism routing hints, compute routing artery metrics v4, and optionally enrich with Overmind + NodeAdmin meta in an async advanced path.",

    never: Object.freeze([
      "mutate request",
      "mutate persona",
      "mutate boundaries",
      "mutate permissions",
      "introduce randomness",
      "override cortex decisions",
      "override execution engine decisions",
      "perform cognition",
      "perform analysis",
      "perform writes",
      "generate symbolic state"
    ]),

    always: Object.freeze([
      "normalize intent deterministically",
      "extract flags deterministically",
      "select persona safely",
      "map archetypes deterministically",
      "integrate organism snapshot metrics",
      "compute routing artery metrics v4",
      "produce dual-band routing hints",
      "produce organism health score",
      "surface safety + overmind hints",
      "return frozen routing packets",
      "remain drift-proof",
      "remain non-blocking on sync path",
      "support async enrichment via advanced path",
      "support hot-path caching and prewarm"
    ])
  })
});

// ============================================================================
//  ARCHETYPE PAGE MAP (STATIC METADATA)
// ============================================================================

const ArchetypePages = Object.freeze({
  ARCHITECT: "aiArchitect.js",
  ASSISTANT: "aiAssistant.js",
  BINARY_AGENT: "aiBinaryAgent.js",
  CLINICIAN: "aiClinician.js",
  DEBUG: "aiDebug.js",
  DIAGNOSTICS: "aiDiagnostics.js",
  DIAGNOSTICS_WRITE: "aiDiagnosticsWrite.js",
  DOCTOR: "aiDoctorAssistant.js",
  DOCTOR_ARCHITECT: "aiDoctorArchitect.js",
  EARN: "aiEarn.js",
  ENTREPRENEUR: "aiEntrepreneur.js",
  ENVIRONMENT: "aiEnvironment.js",
  EVOLUTION: "aiEvolution.js",
  EVOLUTIONARY: "aiEvolutionary.js",
  LAWYER: "aiLawAssistant.js",
  POWER: "aiPower.js",
  SURGEON: "aiSurgeon.js",
  TOURIST: "aiTourist.js",
  VETERINARIAN: "aiVeterinarian.js"
});

// ============================================================================
//  LIGHTWEIGHT HOT-PATH CACHE (PURELY IN-MEMORY, NON-PERSISTENT)
//  NOTE: sync-only, no async, no I/O. Prewarm is optional.
// ============================================================================

const _MAX_CACHE_ENTRIES = 128;
const _routingCache = new Map();

/**
 * Deterministic cache key: request + dualBand snapshot signature + coarse organism bits.
 * No bodies, no large blobs — just flags + persona-relevant bits.
 */
function _buildCacheKey(request = {}, dualBand = null, organismHealth = null) {
  const {
    intent = "analyze",
    touchesBackend = false,
    touchesFrontend = false,
    touchesSchemas = false,
    touchesFiles = false,
    touchesLogs = false,
    touchesRoutes = false,
    touchesErrors = false,
    touchesTourism = false,
    touchesUsers = false,
    touchesArchitecture = false,
    touchesEvolution = false,
    touchesEnvironment = false,
    touchesPower = false,
    touchesEarn = false,
    touchesPulse = false,
    touchesHistory = false,
    touchesSettings = false,
    userIsOwner = false,
    safetyMode: requestedSafetyMode = null
  } = request;

  let organismSig = 0;
  if (dualBand?.organism?.organismSnapshot) {
    const snapshot = dualBand.organism.organismSnapshot();
    if (typeof snapshot === "string") {
      // cheap, deterministic signature
      organismSig = snapshot.length;
    }
  }

  const healthBucket =
    organismHealth && typeof organismHealth.compositeScore === "number"
      ? Math.round(organismHealth.compositeScore * 10)
      : 0;

  return JSON.stringify({
    intent: String(intent || "").toLowerCase(),
    touchesBackend,
    touchesFrontend,
    touchesSchemas,
    touchesFiles,
    touchesLogs,
    touchesRoutes,
    touchesErrors,
    touchesTourism,
    touchesUsers,
    touchesArchitecture,
    touchesEvolution,
    touchesEnvironment,
    touchesPower,
    touchesEarn,
    touchesPulse,
    touchesHistory,
    touchesSettings,
    userIsOwner,
    requestedSafetyMode: requestedSafetyMode || null,
    organismSig,
    healthBucket
  });
}

function _cacheGet(key) {
  if (!_routingCache.has(key)) return null;
  const value = _routingCache.get(key);
  // LRU bump
  _routingCache.delete(key);
  _routingCache.set(key, value);
  return value;
}

function _cacheSet(key, value) {
  if (_routingCache.has(key)) {
    _routingCache.delete(key);
  } else if (_routingCache.size >= _MAX_CACHE_ENTRIES) {
    // delete oldest
    const firstKey = _routingCache.keys().next().value;
    if (firstKey !== undefined) _routingCache.delete(firstKey);
  }
  _routingCache.set(key, value);
}

/**
 * Prewarm hook: allow caller to seed cache with known patterns.
 * This does NOT mutate behavior, only primes hot paths.
 * NOTE: sync-only; we do not call advanced/async path here.
 */
export function prewarmAIRouter(samples = [], dualBand = null, organismHealth = null) {
  if (!Array.isArray(samples)) return;
  for (const req of samples) {
    try {
      const key = _buildCacheKey(req, dualBand, organismHealth);
      if (_cacheGet(key)) continue;
      const result = routeAIRequest(req, dualBand, { organismHealth });
      _cacheSet(key, result);
    } catch {
      // prewarm must never throw
    }
  }
}

// ============================================================================
//  ORGANISM SNAPSHOT ATTACHMENT (HYBRID MODE)
//  - If attached: use snapshots
//  - If not: router remains functional and can run with dualBand-only
// ============================================================================

// ATTACHED SNAPSHOTS (OPTIONAL, HYBRID MODE)
let _attachedCastleSnapshot = null;
let _attachedMeshSnapshot = null;
let _attachedExpansionSnapshot = null;
let _attachedServerSnapshot = null;
let _attachedWorldCoreSnapshot = null;
let _attachedDualBandOrganism = null;
let _attachedBinarySend = null;

// ATTACH API — called by Castle / Mesh / Expansion / Server / WorldCore / Band
export function attachCastleSnapshot(snapshot) {
  _attachedCastleSnapshot = snapshot || null;
  return { ok: true };
}

export function attachMeshSnapshot(snapshot) {
  _attachedMeshSnapshot = snapshot || null;
  return { ok: true };
}

export function attachExpansionSnapshot(snapshot) {
  _attachedExpansionSnapshot = snapshot || null;
  return { ok: true };
}

export function attachServerSnapshot(snapshot) {
  _attachedServerSnapshot = snapshot || null;
  return { ok: true };
}

export function attachWorldCoreSnapshot(snapshot) {
  _attachedWorldCoreSnapshot = snapshot || null;
  return { ok: true };
}

export function attachDualBandOrganism(organism) {
  _attachedDualBandOrganism = organism || null;
  return { ok: true };
}

export function attachBinarySend(binarySend) {
  _attachedBinarySend = binarySend || null;
  return { ok: true };
}

// ============================================================================
//  ORGANISM HEALTH HELPERS (SYNC, LIGHTWEIGHT, NO NETWORK)
//  NOTE: We only read snapshots; we never mutate them.
// ============================================================================

function _bucketLevel(v) {
  if (v >= 0.9) return "elite";
  if (v >= 0.75) return "high";
  if (v >= 0.5) return "medium";
  if (v >= 0.25) return "low";
  return "critical";
}

function _bucketPressure(v) {
  if (v >= 0.9) return "overload";
  if (v >= 0.7) return "high";
  if (v >= 0.4) return "medium";
  if (v > 0) return "low";
  return "none";
}

function _bucketCost(v) {
  if (v >= 0.8) return "heavy";
  if (v >= 0.5) return "moderate";
  if (v >= 0.2) return "light";
  if (v > 0) return "negligible";
  return "none";
}

// ORGANISM-AWARE: compute artery v4 using flags + binary load + organism stress
function computeRoutingArteryV4(flags, binaryLoad, personaId, organismHealth) {
  const flagValues = Object.values(flags || {});
  const activeFlags = flagValues.filter(Boolean).length;

  const flagDensity = Math.min(1, activeFlags / 16);
  const loadFactor = Math.min(1, binaryLoad);

  const basePressure = Math.max(0, Math.min(1, (flagDensity + loadFactor) / 2));

  // ORGANISM-AWARE: incorporate organism stress into pressure
  const organismStress =
    organismHealth && typeof organismHealth.compositeScore === "number"
      ? organismHealth.compositeScore
      : 0;

  const pressure = Math.max(
    0,
    Math.min(1, (basePressure + organismStress * 0.5) / 1.5)
  );

  let personaBias = 0;
  if (personaId === Personas.ARCHITECT) personaBias = 0.1;
  else if (personaId === Personas.OBSERVER) personaBias = 0.05;
  else if (personaId === Personas.TOURGUIDE) personaBias = -0.05;

  const throughputBase = Math.max(0, 1 - pressure);
  const throughput = Math.max(
    0,
    Math.min(1, throughputBase + personaBias)
  );

  const cost = Math.max(0, Math.min(1, pressure * (1 - throughput)));
  const budget = Math.max(0, Math.min(1, throughput - cost));

  return Object.freeze({
    activeFlags,
    flagDensity,
    binaryLoad,
    throughput,
    pressure,
    cost,
    budget,
    throughputBucket: _bucketLevel(throughput),
    pressureBucket: _bucketPressure(pressure),
    costBucket: _bucketCost(cost),
    budgetBucket: _bucketLevel(budget),
    organismStress
  });
}

// ORGANISM-AWARE: compute health score from attached snapshots + dualBand + binarySend
function computeOrganismHealth(dualBand = null) {
  const castle = _attachedCastleSnapshot;
  const mesh = _attachedMeshSnapshot;
  const expansion = _attachedExpansionSnapshot;
  const server = _attachedServerSnapshot;
  const worldCore = _attachedWorldCoreSnapshot;
  const binarySend = _attachedBinarySend;

  // Castle
  const castleLoadLevel = castle?.state?.loadLevel || "unknown";
  const castleLoadScore =
    castleLoadLevel === "critical"
      ? 1
      : castleLoadLevel === "high"
      ? 0.8
      : castleLoadLevel === "medium"
      ? 0.5
      : castleLoadLevel === "low"
      ? 0.2
      : 0.3;

  // Mesh
  const meshPressureIndex =
    mesh?.densityHealth?.A_metrics?.meshPressureIndex ?? 0;
  const meshPressureScore = Math.max(
    0,
    Math.min(1, meshPressureIndex / 100)
  );

  // Expansion
  const routeStable = expansion?.routeField?.routeStable;
  const expansionScore =
    routeStable === false ? 0.9 : routeStable === true ? 0.2 : 0.4;

  // WorldCore
  const fallbackBandLevel =
    worldCore?.advantageContext?.fallbackBandLevel ?? 0;
  const worldCoreFallbackScore = Math.max(
    0,
    Math.min(1, fallbackBandLevel / 4)
  );

  // Server
  const serverLoad =
    server?.meta?.guarantees?.multiInstanceBatchAware === true
      ? 0.4
      : 0.3; // symbolic placeholder; real load would come from server meta/state
  const serverScore = serverLoad;

  // DualBand
  let organismSnapshotBits = 0;
  let binaryLoad = 0;
  let binaryPressure = 0;

  const effectiveDualBand = dualBand || _attachedDualBandOrganism || null;
  if (effectiveDualBand?.organism?.organismSnapshot) {
    const snapshot = effectiveDualBand.organism.organismSnapshot();
    if (typeof snapshot === "string") {
      organismSnapshotBits = snapshot.length;
      binaryLoad = Math.min(1, organismSnapshotBits / 4096);
      binaryPressure = binaryLoad;
    }
  }

  const dualBandScore = binaryPressure;

  // BinarySend
  const sendQueueDepth = binarySend?.getQueueDepth?.() ?? 0;
  const sendScore = Math.max(0, Math.min(1, sendQueueDepth / 100));

  // Composite
  const components = {
    castleLoadScore,
    meshPressureScore,
    expansionScore,
    worldCoreFallbackScore,
    serverScore,
    dualBandScore,
    sendScore
  };

  const compositeScore = Math.max(
    0,
    Math.min(
      1,
      (
        castleLoadScore * 0.2 +
        meshPressureScore * 0.2 +
        expansionScore * 0.15 +
        worldCoreFallbackScore * 0.15 +
        serverScore * 0.1 +
        dualBandScore * 0.1 +
        sendScore * 0.1
      )
    )
  );

  return Object.freeze({
    compositeScore,
    components
  });
}

// ============================================================================
//  ARCHETYPE SELECTOR (DETERMINISTIC)
// ============================================================================

function selectPrimaryArchetypePage(personaId, flags) {
  const {
    touchesEnvironment,
    touchesPower,
    touchesEarn,
    touchesTourism,
    touchesUsers,
    touchesLogs,
    touchesRoutes,
    touchesErrors,
    touchesHistory,
    touchesPulse,
    touchesEvolution
  } = flags;

  if (personaId === Personas.ARCHITECT) {
    if (touchesEvolution && ArchetypePages.EVOLUTIONARY)
      return ArchetypePages.EVOLUTIONARY;
    return ArchetypePages.ARCHITECT || null;
  }

  if (personaId === Personas.OBSERVER) {
    if (
      (touchesLogs ||
        touchesRoutes ||
        touchesErrors ||
        touchesHistory ||
        touchesPulse) &&
      ArchetypePages.DIAGNOSTICS
    ) {
      return ArchetypePages.DIAGNOSTICS;
    }
    return ArchetypePages.DEBUG || ArchetypePages.DIAGNOSTICS || null;
  }

  if (personaId === Personas.TOURGUIDE) {
    if (touchesTourism && ArchetypePages.TOURIST)
      return ArchetypePages.TOURIST;
    return ArchetypePages.TOURIST || null;
  }

  if (personaId === Personas.NEUTRAL) {
    if (touchesEarn && ArchetypePages.EARN) return ArchetypePages.EARN;
    if (touchesUsers && ArchetypePages.ASSISTANT)
      return ArchetypePages.ASSISTANT;
    return ArchetypePages.ASSISTANT || ArchetypePages.ENTREPRENEUR || null;
  }

  return null;
}

// ============================================================================
//  DUAL‑BAND CNS ROUTER — symbolic + organism integration (SYNC, HOT-PATH)
//  NOTE: This is the main sync path. No async, no heavy pulls.
// ============================================================================

export function routeAIRequest(
  request = {},
  dualBand = null,
  options = {}
) {
  const reasoning = [];

  // ORGANISM-AWARE: compute organism health (lightweight, snapshot-only)
  const organismHealth =
    options.organismHealth || computeOrganismHealth(dualBand);

  // 0) Cache check (includes coarse organism health bucket)
  const cacheKey = _buildCacheKey(request, dualBand, organismHealth);
  const cached = _cacheGet(cacheKey);
  if (cached) {
    reasoning.push("Cache hit: returning cached routing packet.");
    return Object.freeze({ ...cached, reasoning: cached.reasoning || [] });
  }

  // --------------------------------------------------------------------------
  // 1) Intent Normalization
  // --------------------------------------------------------------------------
  const intent = (request.intent || "analyze").toLowerCase();
  reasoning.push(`Intent detected: "${intent}"`);

  const {
    touchesBackend = false,
    touchesFrontend = false,
    touchesSchemas = false,
    touchesFiles = false,
    touchesLogs = false,
    touchesRoutes = false,
    touchesErrors = false,
    touchesTourism = false,
    touchesUsers = false,
    touchesArchitecture = false,
    touchesEvolution = false,
    touchesEnvironment = false,
    touchesPower = false,
    touchesEarn = false,
    touchesPulse = false,
    touchesHistory = false,
    touchesSettings = false,
    userIsOwner = false,
    safetyMode: requestedSafetyMode = null
  } = request;

  const flags = Object.freeze({
    touchesBackend,
    touchesFrontend,
    touchesSchemas,
    touchesFiles,
    touchesLogs,
    touchesRoutes,
    touchesErrors,
    touchesTourism,
    touchesUsers,
    touchesArchitecture,
    touchesEvolution,
    touchesEnvironment,
    touchesPower,
    touchesEarn,
    touchesPulse,
    touchesHistory,
    touchesSettings,
    userIsOwner
  });

  Object.entries(flags).forEach(([k, v]) => {
    if (v) reasoning.push(`Flag: ${k.toUpperCase()}`);
  });

  // --------------------------------------------------------------------------
  // 2) Persona Selection (request-driven baseline)
// --------------------------------------------------------------------------
  let personaId = Personas.NEUTRAL;

  if (
    touchesArchitecture ||
    touchesEvolution ||
    touchesSchemas ||
    touchesBackend ||
    touchesFiles ||
    (touchesEnvironment && userIsOwner) ||
    (touchesPower && userIsOwner) ||
    (touchesEarn && userIsOwner) ||
    (touchesSettings && userIsOwner)
  ) {
    personaId = userIsOwner ? Personas.ARCHITECT : Personas.NEUTRAL;
    reasoning.push(
      userIsOwner
        ? "Routing to ARCHITECT persona (system-level request)."
        : "User not owner — cannot route to ARCHITECT persona."
    );
  } else if (
    touchesLogs ||
    touchesRoutes ||
    touchesErrors ||
    touchesHistory ||
    touchesPulse
  ) {
    personaId = Personas.OBSERVER;
    reasoning.push("Routing to OBSERVER persona (diagnostic request).");
  } else if (touchesTourism || touchesUsers || touchesEarn || touchesPulse) {
    personaId = Personas.TOURGUIDE;
    reasoning.push("Routing to TOUR GUIDE persona (user-facing request).");
  } else {
    personaId = Personas.NEUTRAL;
    reasoning.push("Routing to NEUTRAL persona (generic request).");
  }

  // --------------------------------------------------------------------------
  // 3) ORGANISM-DRIVEN PERSONA OVERRIDES (STRESS-AWARE)
// --------------------------------------------------------------------------
  const health = organismHealth;
  const h = health.components || {};

  // Mesh pressure high → OBSERVER
  if (h.meshPressureScore >= 0.7 && personaId !== Personas.OBSERVER) {
    reasoning.push(
      "ORGANISM-AWARE: mesh pressure high → overriding persona to OBSERVER."
    );
    personaId = Personas.OBSERVER;
  }

  // Castle load high → NEUTRAL
  if (h.castleLoadScore >= 0.7 && personaId === Personas.ARCHITECT) {
    reasoning.push(
      "ORGANISM-AWARE: castle load high → overriding persona to NEUTRAL."
    );
    personaId = Personas.NEUTRAL;
  }

  // Expansion unstable → DIAGNOSTICS (via OBSERVER)
  if (h.expansionScore >= 0.7 && personaId !== Personas.OBSERVER) {
    reasoning.push(
      "ORGANISM-AWARE: expansion route unstable → overriding persona to OBSERVER (diagnostics)."
    );
    personaId = Personas.OBSERVER;
  }

  // WorldCore fallbackBand high → SAFE persona (NEUTRAL with strict safety)
  if (h.worldCoreFallbackScore >= 0.6 && personaId !== Personas.NEUTRAL) {
    reasoning.push(
      "ORGANISM-AWARE: worldCore fallbackBand high → overriding persona to NEUTRAL (safe mode)."
    );
    personaId = Personas.NEUTRAL;
  }

  // DualBand binary pressure high → symbolic-friendly persona
  if (h.dualBandScore >= 0.7 && personaId === Personas.ARCHITECT) {
    reasoning.push(
      "ORGANISM-AWARE: dualBand binary pressure high → avoiding heavy ARCHITECT persona."
    );
    personaId = Personas.NEUTRAL;
  }

  // BinarySend congestion → low-binary persona (NEUTRAL / TOURGUIDE)
  if (h.sendScore >= 0.7 && personaId === Personas.OBSERVER) {
    reasoning.push(
      "ORGANISM-AWARE: binary send congestion high → avoiding heavy diagnostics persona."
    );
    personaId = Personas.NEUTRAL;
  }

  // Composite stress critical → ARCHITECT or OBSERVER depending on flags
  if (health.compositeScore >= 0.9) {
    if (
      touchesArchitecture ||
      touchesBackend ||
      touchesSchemas ||
      touchesEvolution
    ) {
      reasoning.push(
        "ORGANISM-AWARE: composite stress critical + system flags → forcing ARCHITECT persona."
      );
      personaId = Personas.ARCHITECT;
    } else {
      reasoning.push(
        "ORGANISM-AWARE: composite stress critical → forcing OBSERVER persona (diagnostics)."
      );
      personaId = Personas.OBSERVER;
    }
  }

  const persona = getPersona(personaId);
  const permissions = persona?.permissions || {};
  const boundaries = persona?.boundaries || {};

  reasoning.push(`Persona selected (after organism overrides): ${personaId}`);

  // --------------------------------------------------------------------------
  // 4) Archetype Mapping
  // --------------------------------------------------------------------------
  const primaryArchetypePage = selectPrimaryArchetypePage(personaId, flags);

  const archetypes = Object.freeze({
    primaryPage: primaryArchetypePage,
    pages: { ...ArchetypePages }
  });

  if (primaryArchetypePage) {
    reasoning.push(`Primary archetype page: ${primaryArchetypePage}`);
  }

  // --------------------------------------------------------------------------
  // 5) Dual‑Band Integration (Organism Snapshot Metrics)
// --------------------------------------------------------------------------
  let organismSnapshotBits = 0;
  let binaryLoad = 0;
  let binaryPressure = 0;

  const effectiveDualBand = dualBand || _attachedDualBandOrganism || null;

  if (effectiveDualBand?.organism?.organismSnapshot) {
    const snapshot = effectiveDualBand.organism.organismSnapshot();
    if (typeof snapshot === "string") {
      organismSnapshotBits = snapshot.length;
      binaryLoad = Math.min(1, organismSnapshotBits / 4096);
      binaryPressure = binaryLoad;

      reasoning.push(
        `Organism snapshot: bits=${organismSnapshotBits}, load=${binaryLoad}, pressure=${binaryPressure}`
      );
    }
  }

  // --------------------------------------------------------------------------
  // 6) Dual‑Band Routing Hints
  // --------------------------------------------------------------------------
  const dualBandHints = Object.freeze({
    primary: "binary",
    secondary: "symbolic",
    binaryPressure,
    binaryLoad,
    symbolicLoadAllowed:
      persona?.symbolicLoadAllowed ??
      (personaId === Personas.ARCHITECT
        ? 0.4
        : personaId === Personas.OBSERVER
        ? 0.3
        : personaId === Personas.TOURGUIDE
        ? 0.5
        : 0.3),
    binaryPressureOverride: persona?.binaryPressureOverride ?? false
  });

  reasoning.push(
    `Dual-band: binaryLoad=${binaryLoad}, binaryPressure=${binaryPressure}, symbolicLoad=${dualBandHints.symbolicLoadAllowed}`
  );

  // --------------------------------------------------------------------------
  // 7) Routing Artery v4 (organism-aware)
// --------------------------------------------------------------------------
  const artery = computeRoutingArteryV4(flags, binaryLoad, personaId, health);

  reasoning.push(
    `Routing artery v4: throughput=${artery.throughput.toFixed(
      2
    )} (${artery.throughputBucket}), pressure=${artery.pressure.toFixed(
      2
    )} (${artery.pressureBucket}), budget=${artery.budget.toFixed(
      2
    )} (${artery.budgetBucket}), organismStress=${artery.organismStress.toFixed(
      2
    )}`
  );

  // --------------------------------------------------------------------------
  // 8) Overmind + Safety + Personal Hints (SYNC HINTS ONLY)
// --------------------------------------------------------------------------
  const safetyMode =
    requestedSafetyMode || persona?.safetyMode || "standard";

  const overmindHints = Object.freeze({
    intent,
    personaId,
    safetyMode,
    flags,
    archetypePrimaryPage: primaryArchetypePage || null,
    organismHealth: health
  });

  const personaSafety = Object.freeze({
    safetyMode,
    boundaries,
    permissions
  });

  reasoning.push(`Safety mode: ${safetyMode}`);
  reasoning.push(
    `Organism health composite score: ${health.compositeScore.toFixed(2)}`
  );

  const packet = Object.freeze({
    meta: AIRouterMeta,
    personaId,
    persona,
    permissions,
    boundaries,
    archetypes,
    dualBand: dualBandHints,
    overmind: overmindHints,
    personaSafety,
    artery,
    organismHealth: health,
    reasoning
  });

  _cacheSet(cacheKey, packet);
  return packet;
}

// ============================================================================
//  ADVANCED ASYNC ROUTER — Overmind + NodeAdmin ENRICHMENT
//  NOTE: async path is optional and only used when explicitly called.
// ============================================================================

export async function routeAIRequestAdvanced(
  request = {},
  dualBand = null,
  options = {}
) {
  const base = routeAIRequest(request, dualBand, options);

  let overmindResult = null;
  let nodeAdminMeta = null;

  try {
    overmindResult = await Overmind.process(base.overmind);
  } catch (err) {
    // Overmind failures must not break routing
    nodeAdminMeta = { overmindError: String(err?.message || err || "unknown") };
  }

  try {
    if (overmindResult && overmindResult.meta) {
      nodeAdminMeta = await NodeAdmin.handleOvermindMeta(overmindResult.meta);
    }
  } catch (err) {
    // NodeAdmin failures must not break routing
    nodeAdminMeta = {
      ...(nodeAdminMeta || {}),
      nodeAdminError: String(err?.message || err || "unknown")
    };
  }

  return Object.freeze({
    ...base,
    overmindResult: overmindResult || null,
    nodeAdminMeta: nodeAdminMeta || null
  });
}

// ============================================================================
//  EXPLAIN ROUTING — Interpreter Summary (SYNC, LIGHTWEIGHT)
// ============================================================================

export function explainRoutingDecision(
  request = {},
  dualBand = null,
  options = {}
) {
  const result = routeAIRequest(request, dualBand, options);

  return Object.freeze({
    personaId: result.personaId,
    archetypePrimaryPage: result.archetypes?.primaryPage || null,
    dualBand: result.dualBand,
    safetyMode: result.personaSafety?.safetyMode || "standard",
    artery: result.artery,
    organismHealth: result.organismHealth,
    reasoning: result.reasoning
  });
}

// ============================================================================
//  DUAL‑MODE EXPORTS (ESM + CommonJS)
// ============================================================================

if (typeof module !== "undefined") {
  module.exports = {
    AIRouterMeta,
    routeAIRequest,
    routeAIRequestAdvanced,
    explainRoutingDecision,
    prewarmAIRouter,
    attachCastleSnapshot,
    attachMeshSnapshot,
    attachExpansionSnapshot,
    attachServerSnapshot,
    attachWorldCoreSnapshot,
    attachDualBandOrganism,
    attachBinarySend
  };
}
