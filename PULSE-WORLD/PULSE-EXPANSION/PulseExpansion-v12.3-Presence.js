// ============================================================================
//  PULSE EXPANSION — v12.3-PRESENCE-EVO++
//  B‑Tier Presence Strategist (Region Governor)
// ============================================================================

import { logger } from "../PULSEProofLogger.js";
import { pulseCastle, PulseCastleMeta, summarizeCastlePresence } from "./PulseCastle-v12.3-Presence.js";
import { pulseServer, PulseServerMeta } from "./PulseServer-v12.3-Presence.js";

// ============================================================================
//  META
// ============================================================================
export const PulseExpansionMeta = Object.freeze({
  layer: "PulseExpansion",
  role: "PRESENCE_STRATEGIST_ORGAN",
  version: "v12.3-PRESENCE-EVO++",
  identity: "PulseExpansion-v12.3-PRESENCE-EVO++",

  guarantees: Object.freeze({
    deterministic: true,
    driftProof: true,
    multiRegionReady: true,
    multiCastleReady: true,
    meshAware: true,
    presenceFieldAware: true,
    advantageAware: true,
    chunkPrewarmAware: true,
    soldierAware: true,
    treasuryAware: true,
    capacitySignalAware: true,
    stressSignalAware: true,

    zeroRandomness: true,
    zeroDynamicImports: true,
    zeroEval: true,
    zeroNetworkFetch: true,
    zeroAI: true,
    zeroRouting: true,
    zeroComputeMath: true
  })
});

// ============================================================================
//  TYPES
// ============================================================================
export class ExpansionAction {
  constructor({
    regionId,
    hostHint = null,
    tier = "normal",
    reason = "capacity",
    desiredServers = 1,
    desiredSoldiers = 0 // NEW
  }) {
    this.type = "expand";
    this.regionId = regionId;
    this.hostHint = hostHint;
    this.tier = tier;
    this.reason = reason;
    this.desiredServers = desiredServers;
    this.desiredSoldiers = desiredSoldiers; // NEW
  }
}

export class ContractionAction {
  constructor({
    castleId,
    reason = "low_load",
    removeServers = 1,
    removeSoldiers = 0 // NEW
  }) {
    this.type = "contract";
    this.castleId = castleId;
    this.reason = reason;
    this.removeServers = removeServers;
    this.removeSoldiers = removeSoldiers; // NEW
  }
}

export class SoldierDelegationAction {
  constructor({
    castleId,
    spawn = 0,
    kill = 0,
    reason = "presence_adjustment"
  }) {
    this.type = "soldier_delegation";
    this.castleId = castleId;
    this.spawn = spawn;
    this.kill = kill;
    this.reason = reason;
  }
}

export class MeshRebalanceAction {
  constructor({ castleId, targetCastleId, action = "link" }) {
    this.type = "mesh_rebalance";
    this.castleId = castleId;
    this.targetCastleId = targetCastleId;
    this.action = action;
  }
}

export class ExpansionPlan {
  constructor({
    expansions = [],
    contractions = [],
    rebalanceLinks = [],
    soldierDelegation = [], // NEW
    regionPresence = {},    // NEW
    regionAdvantage = {},   // NEW
    regionChunkPlan = {},   // NEW
    bandSignature = null,   // NEW
    binaryField = null,     // NEW
    waveField = null,       // NEW
    meta = {}
  }) {
    this.expansions = expansions;
    this.contractions = contractions;
    this.rebalanceLinks = rebalanceLinks;
    this.soldierDelegation = soldierDelegation;
    this.regionPresence = regionPresence;
    this.regionAdvantage = regionAdvantage;
    this.regionChunkPlan = regionChunkPlan;
    this.bandSignature = bandSignature;
    this.binaryField = binaryField;
    this.waveField = waveField;
    this.meta = meta;
  }
}

// ============================================================================
//  INTERNAL HELPERS
// ============================================================================
function clamp01(x) {
  if (x == null || Number.isNaN(x)) return 0;
  return Math.max(0, Math.min(1, x));
}

function computeHash(str) {
  let h = 0;
  const s = String(str || "");
  for (let i = 0; i < s.length; i++)
    h = (h + s.charCodeAt(i) * (i + 1)) % 100000;
  return `h${h}`;
}

// A‑B‑A surfaces
function buildBinaryField(cycle) {
  const density = 10 + cycle * 3;
  const surface = density + 12;
  return {
    binaryPhenotypeSignature: computeHash(`BEXP::${surface}`),
    binarySurfaceSignature: computeHash(`BEXP_SURF::${surface}`),
    binarySurface: { density, surface, patternLen: 12 },
    parity: surface % 2,
    shiftDepth: Math.floor(Math.log2(surface || 1))
  };
}

function buildWaveField(cycle, band) {
  const amplitude = (cycle + 1) * (band === "binary" ? 9 : 5);
  return {
    amplitude,
    wavelength: amplitude + 3,
    phase: amplitude % 16,
    band,
    mode: band === "binary" ? "compression-wave" : "symbolic-wave"
  };
}

function buildBandSignature(band) {
  return computeHash(`EXP_BAND::${band}`);
}

// ============================================================================
//  REGION PRESENCE / ADVANTAGE / CHUNK PLAN
// ============================================================================
function buildRegionPresenceField(regionInfo, cycle) {
  const castleCount = regionInfo.castles.length;
  const totalServers = regionInfo.totalServers;
  const avgPresence =
    regionInfo.castles.reduce((a, c) => a + (c.presenceField?.presenceScore || 0), 0) /
    Math.max(1, castleCount);

  const composite =
    castleCount * 0.01 +
    totalServers * 0.005 +
    avgPresence * 0.02;

  const presenceTier =
    composite >= 0.5 ? "presence_high" :
    composite >= 0.2 ? "presence_mid" :
    "presence_low";

  return {
    presenceVersion: "v12.3",
    presenceTier,
    castleCount,
    totalServers,
    avgPresence,
    composite,
    cycle,
    presenceSignature: computeHash(
      `REGION_PRESENCE::${presenceTier}::${castleCount}::${totalServers}::${avgPresence}`
    )
  };
}

function buildRegionAdvantageField(regionInfo, presenceField, cycle) {
  const density = regionInfo.castles.length;
  const stress = regionInfo.castles.reduce(
    (a, c) => a + (c.presenceField?.stressIndex || 0),
    0
  );

  const advantageScore =
    density * 0.01 +
    stress * 0.005 +
    (presenceField.presenceTier === "presence_high" ? 0.1 : 0);

  return {
    advantageVersion: "C",
    density,
    stress,
    presenceTier: presenceField.presenceTier,
    advantageScore,
    cycle
  };
}

function buildRegionChunkPrewarmPlan(regionInfo, presenceField, advantageField) {
  const basePriority =
    presenceField.presenceTier === "presence_high"
      ? 3
      : presenceField.presenceTier === "presence_mid"
      ? 2
      : 1;

  const advantageBoost = advantageField.advantageScore > 0.1 ? 1 : 0;

  return {
    planVersion: "v12.3-Region-AdvantageC",
    priority: basePriority + advantageBoost,
    chunks: {
      castleEnvelope: true,
      serverEnvelope: true,
      soldierEnvelope: true
    },
    cache: {
      regionPresence: true,
      regionAdvantage: true
    },
    prewarm: {
      castleSpawn: true,
      serverSpawn: true,
      soldierSpawn: true
    }
  };
}

// ============================================================================
//  CORE ORGAN — PulseExpansion
// ============================================================================
export class PulseExpansion {
  constructor(config = {}) {
    this.config = {
      defaultMaxCastlesPerRegion: 8,
      defaultMinCastlesPerRegion: 1,
      defaultDesiredServersPerCastle: 1,
      defaultDesiredSoldiersPerCastle: 3, // NEW
      ...config
    };
    this.cycle = 0;
  }

  buildExpansionPlan({
    globalLoadIndex = 0,
    regionSignals = {},
    maxCastlesPerRegion = null,
    minCastlesPerRegion = null
  } = {}) {
    this.cycle++;

    const expansions = [];
    const contractions = [];
    const rebalanceLinks = [];
    const soldierDelegation = [];

    const { byRegion, meshLinksByCastleId } = summarizeCastlePresence();

    const effectiveMaxCastles =
      typeof maxCastlesPerRegion === "number" && maxCastlesPerRegion > 0
        ? maxCastlesPerRegion
        : this.config.defaultMaxCastlesPerRegion;

    const effectiveMinCastles =
      typeof minCastlesPerRegion === "number" && minCastlesPerRegion >= 0
        ? minCastlesPerRegion
        : this.config.defaultMinCastlesPerRegion;

    const globalLoad = clamp01(globalLoadIndex);

    const regionPresence = {};
    const regionAdvantage = {};
    const regionChunkPlan = {};

    // REGION LOOP
    for (const [regionId, regionInfo] of Object.entries(byRegion)) {
      const signal = regionSignals[regionId] || {};
      const avgLoadIndex = clamp01(signal.avgLoadIndex ?? globalLoad);
      const userDensityHint = signal.userDensityHint ?? 0;
      const stressHint = clamp01(signal.stressHint ?? globalLoad);

      // Build presence/advantage/chunk
      const presenceField = buildRegionPresenceField(regionInfo, this.cycle);
      const advantageField = buildRegionAdvantageField(regionInfo, presenceField, this.cycle);
      const chunkPlan = buildRegionChunkPrewarmPlan(regionInfo, presenceField, advantageField);

      regionPresence[regionId] = presenceField;
      regionAdvantage[regionId] = advantageField;
      regionChunkPlan[regionId] = chunkPlan;

      const castleCount = regionInfo.castles.length;

      // EXPANSION
      if (
        (avgLoadIndex >= 0.6 || userDensityHint >= 2000 || stressHint >= 0.6) &&
        castleCount < effectiveMaxCastles
      ) {
        expansions.push(
          new ExpansionAction({
            regionId,
            tier: presenceField.presenceTier,
            reason: "high_load_or_density",
            desiredServers: this.config.defaultDesiredServersPerCastle,
            desiredSoldiers: this.config.defaultDesiredSoldiersPerCastle // NEW
          })
        );
      }

      // CONTRACTION
      if (avgLoadIndex <= 0.2 && castleCount > effectiveMinCastles) {
        const candidate = regionInfo.castles[regionInfo.castles.length - 1];
        if (candidate) {
          contractions.push(
            new ContractionAction({
              castleId: candidate.castleId,
              reason: "low_load",
              removeServers: 1,
              removeSoldiers: 1 // NEW
            })
          );
        }
      }

      // SOLDIER DELEGATION (explicit)
      for (const c of regionInfo.castles) {
        const load = c.presenceField?.loadIndex ?? 0;
        const stress = c.presenceField?.stressIndex ?? 0;

        if (load >= 0.7 || stress >= 0.7) {
          soldierDelegation.push(
            new SoldierDelegationAction({
              castleId: c.castleId,
              spawn: 2,
              kill: 0,
              reason: "high_pressure"
            })
          );
        } else if (load <= 0.2 && stress <= 0.2) {
          soldierDelegation.push(
            new SoldierDelegationAction({
              castleId: c.castleId,
              spawn: 0,
              kill: 1,
              reason: "low_pressure"
            })
          );
        }
      }
    }

    // MESH REBALANCE
    for (const [regionId, regionInfo] of Object.entries(byRegion)) {
      const castles = regionInfo.castles;
      if (castles.length <= 1) continue;

      for (let i = 0; i < castles.length; i++) {
        const a = castles[i];
        const links = meshLinksByCastleId[a.castleId] || new Set();
        if (links.size === 0) {
          const b = castles[(i + 1) % castles.length];
          rebalanceLinks.push(
            new MeshRebalanceAction({
              castleId: a.castleId,
              targetCastleId: b.castleId,
              action: "link"
            })
          );
        }
      }
    }

    // A‑B‑A surfaces
    const band = "symbolic";
    const binaryField = buildBinaryField(this.cycle);
    const waveField = buildWaveField(this.cycle, band);
    const bandSignature = buildBandSignature(band);

    logger?.log?.("expansion", "plan_built", {
      cycle: this.cycle,
      expansions: expansions.length,
      contractions: contractions.length,
      soldierDelegation: soldierDelegation.length,
      rebalanceLinks: rebalanceLinks.length
    });

    return new ExpansionPlan({
      expansions,
      contractions,
      rebalanceLinks,
      soldierDelegation,
      regionPresence,
      regionAdvantage,
      regionChunkPlan,
      bandSignature,
      binaryField,
      waveField,
      meta: {
        expansionMeta: PulseExpansionMeta,
        castleMeta: PulseCastleMeta,
        serverMeta: PulseServerMeta
      }
    });
  }
}

// ============================================================================
//  PUBLIC API
// ============================================================================
export function createPulseExpansion(config = {}) {
  const core = new PulseExpansion(config);
  return Object.freeze({
    meta: PulseExpansionMeta,
    buildExpansionPlan(payload) {
      return core.buildExpansionPlan(payload);
    }
  });
}

export const pulseExpansion = createPulseExpansion();
