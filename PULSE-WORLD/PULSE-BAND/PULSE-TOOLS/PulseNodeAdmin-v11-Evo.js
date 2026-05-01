// ============================================================================
// FILE: /PulseOS/PULSE-TOOLS/PulseNodeAdmin-v12.3+-PRESENCE-EVO-INTELLECT.js
// PULSE OS — v12.3+ PRESENCE-EVO
// NODEADMIN ORGAN — NETWORK BRAIN / SENTINEL COMMAND / INTENT + MEMORY CORTEX
// OVERMIND-READY • PRESENCE-AWARE • MESH/CASTLE/EXPANSION/ROUTER/BEACON-AWARE
// PREWARM/CACHE/CHUNK-AWARE • DETERMINISTIC • SYNTHETIC-ONLY
// ============================================================================
export const NodeAdminMeta = Object.freeze({
  organId: "PulseNodeAdmin-v12.3+-PRESENCE-EVO++",
  role: "NODEADMIN_ORGAN",
  version: "12.3-PRESENCE-EVO++",
  epoch: "v12.3-PRESENCE-EVO++",
  layer: "NetworkBrain",

  safety: Object.freeze({
    deterministic: true,
    noRandomness: true,
    noRecursion: true,
    noAsyncDrift: true,
    syntheticOnly: true,
    backendAdvisoryOnly: true
  }),

  // NEW: NodeAdmin must now legally consume these signals
  awareness: Object.freeze({
    presenceAware: true,
    advantageAware: true,
    chunkPrewarmAware: true,
    soldierAware: true,
    treasuryAware: true,
    castleAware: true,
    serverAware: true,
    expansionAware: true,
    meshAware: true,
    routeAware: true,
    bandAware: true,
    binaryFieldAware: true,
    waveFieldAware: true
  }),

  contract: Object.freeze({
    purpose:
      "Local coordinator for soldiers, servers, and castle load. Executes Expansion plans, manages soldier lifecycle, applies earning pressure, integrates presence/advantage/chunk/mesh/castle/server signals, and exposes deterministic snapshots.",

    never: Object.freeze([
      "mutate external state",
      "perform network I/O directly",
      "bypass Overmind or boundaries",
      "self-modify core safety rules",
      "introduce randomness or async drift"
    ]),

    always: Object.freeze([
      "remain deterministic",
      "log decisions to internal memory",
      "expose state via reports and snapshots",
      "treat backend AI as advisory only",
      "treat presence/social/earn/mesh/castle/expansion/router/beacon as metadata-only signals",
      "treat prewarm/cache/chunk plans as hints only, not imperative commands",
      "treat soldierDelegation and desiredSoldiers as advisory quotas",
      "treat treasury deltas as symbolic only"
    ])
  })
});
import PulseAdminInspector from "./PulseAdminInspector.js";
import PulseBehaviorScanner from "./PulseBehaviorScanner.js";
import PulseBinaryBehaviorScanner from "./PulseBinaryBehaviorScanner.js";
import PulseBinaryFramework from "./PulseBinaryFramework.js";
import PulseBinaryLoopScanner from "./PulseBinaryLoopScanner.js";
import PulseBinaryWaveScanner from "./PulseBinaryWaveScanner.js";
import PulseEvolutionaryScanner from "./PulseEvolutionaryScanner.js";
import PulseHeatMap from "./PulseHeatMap.js";
import PulseLoopScanner from "./PulseLoopScanner.js";
import PulseNodeAdminIntellect from "./PulseNodeAdmin-v11-Evo-Intellect.js";
import PulseWaveScanner from "./PulseWaveScanner.js";

// ============================================================================
// FACTORY: createPulseNodeAdmin — v12.3+ PRESENCE-EVO-INTELLECT
// ============================================================================

export function createPulseNodeAdmin({
  trace = false,
  instances = 3,
  backendInterpreter = null, // fn({ message, state }) => { intentName?, mode?, notes?, payload? }
  overmindBridge = null      // { emit?, pullDirectives? }
} = {}) {

  // ---------------------------------------------------------------------------
  // INTERNAL STATE
  // ---------------------------------------------------------------------------
  let mode = "idle"; // "idle" | "scan" | "boost" | "cool" | "guard" | "presence"
  let tick = 0;
  let cycle = 0;                 // EVO++: expansion/soldier cycles
  let lastExpansionPlan = null;  // EVO++: last applied expansion plan

  const sentinels = Array.from({ length: instances }, (_, i) => ({
    id: i,
    phase: (Math.PI * 2 * i) / instances,
    energy: 0.5,
    loopIndex: 0,
    frequency: 1.0,
    wavelength: 1.0
  }));

  const memory = {
    events: [],
    lastReport: null,
    lastAdvice: null,
    lastSentinels: []
  };

  const intentHandlers = Object.create(null);

  let backend = backendInterpreter;
  let overmind = overmindBridge;
  let beaconEngine = null;

  // Presence / social / earn deps (injected)
  const presenceDeps = {
    PresenceJobView: null,
    PulseWorldSocialGraph: null,
    PowerUserRanking: null,
    SystemClock: null
  };

  // World organ snapshots (mesh / castle / expansion / router / beacon / worldCore)
  let meshSnapshot = null;
  let castleSnapshot = null;
  let expansionSnapshot = null;
  let routerSnapshot = null;
  let beaconSnapshot = null;
  let worldCoreSnapshot = null;
  // EVO++: soldier + load tracking
  const soldierRegistry = Object.create(null); // soldierId -> { castleId, serverId, meta }
  const castleLoad = Object.create(null);      // castleId -> loadIndex
  const serverLoad = Object.create(null);      // serverId -> loadIndex

  // Prewarm / cache / chunk plans (hints only)
  const perfHints = {
    prewarm: {
      castle: null,
      expansion: null,
      mesh: null,
      router: null,
      worldCore: null
    },
    cache: {
      castle: null,
      expansion: null,
      mesh: null,
      router: null,
      worldCore: null
    },
    chunk: {
      castle: null,
      expansion: null,
      mesh: null,
      router: null,
      worldCore: null
    }
  };

  // ---------------------------------------------------------------------------
  // MEMORY HELPERS
  // ---------------------------------------------------------------------------
  function remember(type, data) {
    const entry = {
      type,
      timestamp: Date.now(),
      data
    };
    memory.events.push(entry);
    if (memory.events.length > 500) {
      memory.events.shift();
    }
    return entry;
  }

  function getMemory({ limit = 50, type = null } = {}) {
    const filtered = type
      ? memory.events.filter(e => e.type === type)
      : memory.events;
    return filtered.slice(-limit);
  }

  // ---------------------------------------------------------------------------
  // OVERMIND BRIDGE
  // ---------------------------------------------------------------------------
  function emitToOvermind(eventType, payload) {
    if (!overmind || typeof overmind.emit !== "function") return;
    overmind.emit({
      organId: NodeAdminMeta.organId,
      eventType,
      payload,
      snapshot: getStateSnapshot()
    });
  }

  function attachOvermindBridge(bridge) {
    overmind = bridge || null;
    const evt = remember("overmind-bridge-set", { hasBridge: !!bridge });
    emitToOvermind("overmind-bridge-set", evt);
  }

  function applyDirective(directive) {
    if (!directive || typeof directive !== "object") {
      return { ok: false, reason: "invalid-directive" };
    }

    const {
      mode: nextMode,
      intentName,
      intentPayload
    } = directive;

    let modeChanged = false;
    let intentResult = null;

    if (nextMode && typeof nextMode === "string") {
      setMode(nextMode);
      modeChanged = true;
    }

    if (intentName && typeof intentName === "string") {
      intentResult = executeIntent(intentName, intentPayload || {});
    }

    const result = { ok: true, modeChanged, intentResult };
    remember("directive-applied", { directive, result });
    emitToOvermind("directive-applied", { directive, result });
    return result;
  }

  // ---------------------------------------------------------------------------
  // INTENT SYSTEM (AIS++)
  // ---------------------------------------------------------------------------
  function registerIntent(name, handler) {
    intentHandlers[name] = handler;
    const evt = remember("intent-registered", { name });
    emitToOvermind("intent-registered", evt);
  }

  function executeIntent(name, payload = {}) {
    const handler = intentHandlers[name];
    if (!handler) {
      if (trace) console.warn("[NodeAdmin] Unknown intent:", name);
      const evt = remember("intent-missing", { name, payload });
      emitToOvermind("intent-missing", evt);
      return { ok: false, error: "unknown-intent" };
    }

    if (trace) console.log("[NodeAdmin] Executing intent:", name, payload);
    const result = handler({ mode, sentinels, payload });
    const evt = remember("intent-executed", { name, payload, result });
    emitToOvermind("intent-executed", evt);
    return { ok: true, result };
  }

  // ---------------------------------------------------------------------------
  // BACKEND INTERPRETER HOOK
  // ---------------------------------------------------------------------------
  function setBackendInterpreter(fn) {
    backend = fn;
    const evt = remember("backend-set", { hasBackend: !!fn });
    emitToOvermind("backend-set", evt);
  }

  // ---------------------------------------------------------------------------
  // PRESENCE / SOCIAL / EARN INTEGRATIONS
  // ---------------------------------------------------------------------------
  function setPresenceIntegrations({
    PresenceJobView = null,
    PulseWorldSocialGraph = null,
    PowerUserRanking = null,
    SystemClock = null
  } = {}) {
    presenceDeps.PresenceJobView = PresenceJobView;
    presenceDeps.PulseWorldSocialGraph = PulseWorldSocialGraph;
    presenceDeps.PowerUserRanking = PowerUserRanking;
    presenceDeps.SystemClock = SystemClock;

    const evt = remember("presence-integrations-set", {
      hasPresenceJobView: !!PresenceJobView,
      hasSocialGraph: !!PulseWorldSocialGraph,
      hasPowerUserRanking: !!PowerUserRanking,
      hasSystemClock: !!SystemClock
    });
    emitToOvermind("presence-integrations-set", evt);
  }

  // ---------------------------------------------------------------------------
  // WORLD ORGAN SNAPSHOT INTEGRATIONS
  // ---------------------------------------------------------------------------
  function setMeshSnapshot(snapshot) {
    meshSnapshot = snapshot || null;
    const evt = remember("mesh-snapshot-set", { hasSnapshot: !!snapshot });
    emitToOvermind("mesh-snapshot-set", evt);
    return { ok: true };
  }

    function setCastleSnapshot(snapshot) {
      castleSnapshot = snapshot || null;

      // EVO++: derive simple load map from castle presence fields if available
      // Expecting shape: { castlesById: { [castleId]: { presenceField?: { loadIndex? } } } }
      if (snapshot && snapshot.castlesById) {
        for (const [castleId, c] of Object.entries(snapshot.castlesById)) {
          const loadIndex = c.presenceField?.loadIndex;
          if (typeof loadIndex === "number") {
            castleLoad[castleId] = loadIndex;
          }
        }
      }

      const evt = remember("castle-snapshot-set", {
        hasSnapshot: !!snapshot,
        castleCount: snapshot?.castlesById ? Object.keys(snapshot.castlesById).length : 0
      });
      emitToOvermind("castle-snapshot-set", evt);
      return { ok: true };
    }


    function setExpansionSnapshot(snapshot) {
      expansionSnapshot = snapshot || null;

      // EVO++: track expansion cycles + last plan
      // Expecting snapshot to optionally carry an ExpansionPlan-like shape
      // { plan?: { expansions, contractions, soldierDelegation, bandSignature, ... } }
      if (snapshot && snapshot.plan) {
        cycle++;
        lastExpansionPlan = snapshot.plan;
      }

      const evt = remember("expansion-snapshot-set", {
        hasSnapshot: !!snapshot,
        cycle,
        hasPlan: !!(snapshot && snapshot.plan)
      });
      emitToOvermind("expansion-snapshot-set", evt);
      return { ok: true };
    }


  function setRouterSnapshot(snapshot) {
    routerSnapshot = snapshot || null;
    const evt = remember("router-snapshot-set", { hasSnapshot: !!snapshot });
    emitToOvermind("router-snapshot-set", evt);
    return { ok: true };
  }

  function setBeaconSnapshot(snapshot) {
    beaconSnapshot = snapshot || null;
    const evt = remember("beacon-snapshot-set", { hasSnapshot: !!snapshot });
    emitToOvermind("beacon-snapshot-set", evt);
    return { ok: true };
  }

  function setWorldCoreSnapshot(snapshot) {
    worldCoreSnapshot = snapshot || null;
    const evt = remember("worldcore-snapshot-set", { hasSnapshot: !!snapshot });
    emitToOvermind("worldcore-snapshot-set", evt);
    return { ok: true };
  }

  // ---------------------------------------------------------------------------
  // PREWARM / CACHE / CHUNK HINTS
  // ---------------------------------------------------------------------------
  function setPrewarmHints({ castle, expansion, mesh, router, worldCore } = {}) {
    if (castle !== undefined) perfHints.prewarm.castle = castle;
    if (expansion !== undefined) perfHints.prewarm.expansion = expansion;
    if (mesh !== undefined) perfHints.prewarm.mesh = mesh;
    if (router !== undefined) perfHints.prewarm.router = router;
    if (worldCore !== undefined) perfHints.prewarm.worldCore = worldCore;

    const evt = remember("prewarm-hints-set", { prewarm: perfHints.prewarm });
    emitToOvermind("prewarm-hints-set", evt);
    return { ok: true };
  }

  function setCacheHints({ castle, expansion, mesh, router, worldCore } = {}) {
    if (castle !== undefined) perfHints.cache.castle = castle;
    if (expansion !== undefined) perfHints.cache.expansion = expansion;
    if (mesh !== undefined) perfHints.cache.mesh = mesh;
    if (router !== undefined) perfHints.cache.router = router;
    if (worldCore !== undefined) perfHints.cache.worldCore = worldCore;

    const evt = remember("cache-hints-set", { cache: perfHints.cache });
    emitToOvermind("cache-hints-set", evt);
    return { ok: true };
  }

  function setChunkHints({ castle, expansion, mesh, router, worldCore } = {}) {
    if (castle !== undefined) perfHints.chunk.castle = castle;
    if (expansion !== undefined) perfHints.chunk.expansion = expansion;
    if (mesh !== undefined) perfHints.chunk.mesh = mesh;
    if (router !== undefined) perfHints.chunk.router = router;
    if (worldCore !== undefined) perfHints.chunk.worldCore = worldCore;

    const evt = remember("chunk-hints-set", { chunk: perfHints.chunk });
    emitToOvermind("chunk-hints-set", evt);
    return { ok: true };
  }

  // ---------------------------------------------------------------------------
  // MODE CONTROL
  // ---------------------------------------------------------------------------
  function setMode(nextMode) {
    mode = nextMode;
    const evt = remember("mode-change", { mode });
    if (trace) console.log("[NodeAdmin] mode:", mode);
    emitToOvermind("mode-change", evt);
  }

  function getMode() {
    return mode;
  }

  // ---------------------------------------------------------------------------
  // CORE UPDATE — SENTINEL ENGINE
  // ---------------------------------------------------------------------------
  function updateSentinels(maxLoopIndex) {
    tick++;

    const results = [];

    for (let i = 0; i < sentinels.length; i++) {
      const s = sentinels[i];

      const baseLoop = (tick + i * 7) % maxLoopIndex;
      const basePhase = s.phase + tick * 0.05;

      let frequency = 1.0;
      let wavelength = 1.0;

      if (mode === "scan") {
        frequency = 0.4;
        wavelength = 1.6;
      } else if (mode === "boost") {
        frequency = 1.8;
        wavelength = 0.7;
      } else if (mode === "cool") {
        frequency = 0.3;
        wavelength = 1.8;
      } else if (mode === "guard") {
        frequency = 1.0;
        wavelength = 1.0;
        const edgeBias = (i % 2 === 0) ? 0 : maxLoopIndex - 1;
        s.loopIndex = edgeBias;
      } else if (mode === "presence") {
        frequency = 1.2;
        wavelength = 1.0;
      }

      if (mode !== "guard") {
        s.loopIndex = baseLoop;
      }

      const phase = basePhase * frequency;
      let energy = 0.5 + 0.4 * Math.sin(phase / wavelength);

      s.energy = clamp(energy, 0, 1);
      s.frequency = frequency;
      s.wavelength = wavelength;

      results.push({
        id: s.id,
        loopIndex: s.loopIndex,
        energy: s.energy,
        phase,
        frequency,
        wavelength
      });
    }

    memory.lastSentinels = results;
    const evt = remember("sentinels-updated", { mode, results });

    if (trace) console.log("[NodeAdmin] sentinels:", results);
    emitToOvermind("sentinels-updated", evt);
    return results;
  }

  // ---------------------------------------------------------------------------
  // PRESENCE-AWARE INTELLECT HELPERS
  // ---------------------------------------------------------------------------
  function presenceAwareMode(entryNodeId, context = {}) {
    const { PresenceJobView } = presenceDeps;
    if (!PresenceJobView) return "idle";

    const jobView = PresenceJobView.build(entryNodeId, context);
    const nearby = jobView.nearbyPresence || [];

    const powerCount = nearby.filter(p => p.powerUser).length;
    const newCount = nearby.filter(p => p.ageCategory === "new").length;

    if (powerCount >= 3) return "boost";
    if (newCount >= 3) return "scan";

    if (jobView.stability > 0.8 && jobView.drift < 0.2) {
      return "cool";
    }

    return "idle";
  }

  function socialFocus(entryNodeId, context = {}) {
    const { PulseWorldSocialGraph } = presenceDeps;
    if (!PulseWorldSocialGraph) return "node";

    const snapshot = PulseWorldSocialGraph.snapshot();
    const nodes = snapshot.nodes || [];
    const edges = snapshot.edges || [];

    const clusterEdges = edges.filter(e => e.type === "presence");
    const jobEdges = edges.filter(e => e.type === "job");
    const mentorEdges = edges.filter(e => e.type === "mentor_request");

    const clusterDensity = clusterEdges.length / Math.max(nodes.length, 1);
    const jobFlow = jobEdges.length;
    const mentorshipFlow = mentorEdges.length;

    if (clusterDensity > 5) return "town";
    if (jobFlow > 10) return "home";
    if (mentorshipFlow > 5) return "body";

    return "node";
  }

  function earnReadiness(context = {}) {
    const impulse = context.impulse;
    if (!impulse || !impulse.flags) return "unknown";

    const ctx = impulse.flags.earner_context || {};
    const urgency = ctx.urgency || 1;
    const volatility = ctx.volatility || 0;

    if (urgency > 1.0 && volatility < 0.05) return "high";
    if (urgency > 0.7) return "medium";
    return "low";
  }

  function reproductionTrigger(entryNodeId, context = {}) {
    const { PresenceJobView } = presenceDeps;
    if (!PresenceJobView) return "none";

    const jobView = PresenceJobView.build(entryNodeId, context);
    const nearby = jobView.nearbyPresence || [];

    const newCount = nearby.filter(p => p.ageCategory === "new").length;
    if (newCount >= 5) return "spawn-node";

    const powerCount = nearby.filter(p => p.powerUser).length;
    if (powerCount >= 3) return "spawn-advanced-node";

    return "none";
  }

  function powerUserInfluence(entryNodeId, context = {}) {
    const { PresenceJobView, PowerUserRanking } = presenceDeps;
    if (!PresenceJobView || !PowerUserRanking) return null;

    const jobView = PresenceJobView.build(entryNodeId, context);
    const ranked = PowerUserRanking.rankNearby(jobView.nearbyPresence || []);
    const top = ranked[0];
    if (!top) return null;

    return {
      uid: top.uid,
      displayName: top.displayName,
      rankScore: top.rankScore,
      presenceBand: top.presenceBand,
      systemAge: top.systemAge
    };
  }

  // ---------------------------------------------------------------------------
  // WORLD-AWARE INTELLECT HELPERS (MESH / CASTLE / EXPANSION / ROUTER / BEACON / WORLDCORE)
  // ---------------------------------------------------------------------------
  function meshAdvice() {
    if (!meshSnapshot) return null;
    const m = meshSnapshot.DensityHealth?.A_metrics || meshSnapshot.metrics || {};
    const pressure = m.meshPressureIndex ?? 0;
    const strength = m.meshStrength || "unknown";

    let status = "normal";
    if (pressure >= 70) status = "high-pressure";
    else if (pressure >= 40) status = "elevated";

    const advice = { meshPressureIndex: pressure, meshStrength: strength, status };
    remember("mesh-advice", advice);
    return advice;
  }

  function castleAdvice() {
    if (!castleSnapshot) return null;
    const state = castleSnapshot.State?.A_baseline || castleSnapshot.state || {};
    const load = state.loadLevel || "unknown";
    const meshSupport = state.meshSupportLevel ?? 0;

    let status = "normal";
    if (load === "high" || load === "critical") status = "overloaded";

    const advice = { loadLevel: load, meshSupportLevel: meshSupport, status };
    remember("castle-advice", advice);
    return advice;
  }

  function expansionAdvice() {
    if (!expansionSnapshot) return null;
    const need = expansionSnapshot.MeshBrain?.B_expansionRules?.expansionNeed || expansionSnapshot.expansionNeed || "unknown";
    const routeStable = expansionSnapshot.routeField?.routeStable ?? null;

    const advice = { expansionNeed: need, routeStable };
    remember("expansion-advice", advice);
    return advice;
  }

    function routerAdvice() {
    if (!routerSnapshot) return null;

    const r = routerSnapshot.routeField || routerSnapshot.metrics || {};
    const stable = r.routeStable ?? r.stable ?? null;
    const errorRate = r.errorRate ?? r.routeErrorRate ?? 0;
    const hops = r.avgHops ?? r.hops ?? null;

    let status = "unknown";
    if (stable === true && errorRate < 0.01) status = "stable";
    else if (stable === false || errorRate > 0.05) status = "unstable";
    else status = "degraded";

    const advice = { routeStable: stable, errorRate, hops, status };
    remember("router-advice", advice);
    return advice;
  }

  function beaconAdvice() {
    if (!beaconSnapshot) return null;

    const presenceField = beaconSnapshot.presenceField || beaconSnapshot.presence || {};
    const advantageField = beaconSnapshot.advantageField || beaconSnapshot.advantage || {};
    const bandSignature = beaconSnapshot.bandSignature || null;
    const binaryField = beaconSnapshot.binaryField || null;
    const waveField = beaconSnapshot.waveField || null;

    const meshStatus = presenceField.meshStatus || "unknown";
    const regionTag = presenceField.regionTag || presenceField.region || "unknown";

    const advice = {
      meshStatus,
      regionTag,
      bandSignature,
      binaryField,
      waveField,
      presenceField,
      advantageField
    };

    remember("beacon-advice", advice);
    return advice;
  }

  function worldCoreAdvice() {
    if (!worldCoreSnapshot) return null;

    const mode = worldCoreSnapshot.mode || worldCoreSnapshot.stateMode || "unknown";
    const load = worldCoreSnapshot.loadLevel || worldCoreSnapshot.load || "unknown";

    let status = "normal";
    if (load === "high" || load === "critical") status = "stressed";

    const advice = { mode, loadLevel: load, status };
    remember("worldcore-advice", advice);
    return advice;
  }


  // ---------------------------------------------------------------------------
  // INTELLECT: ANALYZE LAYERS + FLAGS + PRESENCE + WORLD → MODE / FOCUS
  // ---------------------------------------------------------------------------
  function scoreLayer(summary) {
    if (!summary) return 0;
    const d = Number(summary.densityAvg || 0);
    const c = Number(summary.contrastAvg || 0);
    const w = Number(summary.waveAvg || 0);
    return clamp((d + c + w) / 3, 0, 1);
  }

  function analyzeAndAdvise({ body, home, town, node, flags, entryNodeId, context } = {}) {
    const scores = {
      body: scoreLayer(body),
      home: scoreLayer(home),
      town: scoreLayer(town),
      node: scoreLayer(node)
    };

    let topLayer = "body";
    let topScore = scores.body;

    for (const key of ["home", "town", "node"]) {
      if (scores[key] > topScore) {
        topScore = scores[key];
        topLayer = key;
      }
    }

    const hasHighFlags = (flags || []).some(f => f.severity === "high");
    const hasMediumFlags = (flags || []).some(f => f.severity === "medium");

    let suggestedMode = "idle";

    if (hasHighFlags || topScore > 0.75) {
      suggestedMode = "boost";
    } else if (hasMediumFlags || topScore > 0.5) {
      suggestedMode = "scan";
    } else if (topScore < 0.2) {
      suggestedMode = "cool";
    }

    const presenceModeValue = presenceAwareMode(entryNodeId, context || {});
    const socialFocusValue = socialFocus(entryNodeId, context || {});
    const earnReadyValue = earnReadiness(context || {});
    const reproductionValue = reproductionTrigger(entryNodeId, context || {});
    const influenceValue = powerUserInfluence(entryNodeId, context || {});

    const meshInfo = meshAdvice();
    const castleInfo = castleAdvice();
    const expansionInfo = expansionAdvice();
    const routerInfo = routerAdvice();
    const beaconInfo = beaconAdvice();
    const worldCoreInfo = worldCoreAdvice();

    const advice = {
      focusLayer: topLayer,
      focusScore: topScore,
      suggestedMode,
      scores,
      hasHighFlags,
      hasMediumFlags,
      presenceMode: presenceModeValue,
      socialFocus: socialFocusValue,
      earnReadiness: earnReadyValue,
      reproductionTrigger: reproductionValue,
      powerUserInfluence: influenceValue,
      mesh: meshInfo,
      castle: castleInfo,
      expansion: expansionInfo,
      router: routerInfo,
      beacon: beaconInfo,
      worldCore: worldCoreInfo,
      prewarmHints: perfHints.prewarm,
      cacheHints: perfHints.cache,
      chunkHints: perfHints.chunk
    };

    memory.lastAdvice = advice;
    const evt = remember("advice", advice);
    remember("presence-advice", {
      presenceMode: presenceModeValue,
      socialFocus: socialFocusValue
    });
    remember("earn-advice", { earnReadiness: earnReadyValue });
    remember("reproduction-advice", { reproductionTrigger: reproductionValue });

    if (trace) console.log("[NodeAdmin] advice:", advice);
    emitToOvermind("advice", evt);
    return advice;
  }

  // ---------------------------------------------------------------------------
  // REPORT ENGINE — WHERE AM I / WHAT’S HAPPENING
  // ---------------------------------------------------------------------------
  function getReport() {
    const report = {
      organId: NodeAdminMeta.organId,
      mode,
      tick,
      cycle,
      sentinels: memory.lastSentinels,
      lastAdvice: memory.lastAdvice,
      memoryEvents: memory.events.slice(-20),
      meshSnapshot,
      castleSnapshot,
      expansionSnapshot,
      routerSnapshot,
      beaconSnapshot,
      worldCoreSnapshot,
      perfHints,
      soldierRegistry,
      castleLoad,
      serverLoad,
      lastExpansionPlan
    };
    memory.lastReport = report;
    const evt = remember("report", report);
    emitToOvermind("report", evt);
    return report;
  }


  function getStateSnapshot() {
    return Object.freeze({
      organId: NodeAdminMeta.organId,
      mode,
      tick,
      cycle,
      sentinelCount: sentinels.length,
      lastAdvice: memory.lastAdvice,
      lastSentinels: memory.lastSentinels,
      soldierRegistry,
      castleLoad,
      serverLoad,
      lastExpansionPlan
    });
  }



  // ---------------------------------------------------------------------------
  // ABILITY / MANUAL INTROSPECTION
  // ---------------------------------------------------------------------------
  function getAbilities() {
    return {
      modes: ["idle", "scan", "boost", "cool", "guard", "presence"],
      intents: Object.keys(intentHandlers),
      features: [
        "multi-sentinel circling",
        "mode-based frequency/wavelength modulation",
        "layer scoring + focus selection",
        "advice engine (suggested mode + focus)",
        "intent execution (AIS++)",
        "custom message interpretation",
        "expansion-plan awareness",
        "soldier-delegation awareness",
        "castle-load map",
        "server-load map",
        "band/binary/wave awareness",
        "advantage-field awareness",
        "backend AI bridge",
        "memory log + reports",
        "Overmind directive bridge",
        "state snapshot export",
        "presence-aware mode selection",
        "social-graph-aware focus selection",
        "earn-readiness awareness",
        "reproduction trigger awareness",
        "power-user influence awareness",
        "mesh-pressure awareness",
        "castle-load awareness",
        "expansion-need awareness",
        "route-stability awareness",
        "beacon presence/advantage/fallback awareness",
        "worldCore UI/load awareness",
        "prewarm hint coordination",
        "cache hint coordination",
        "chunk hint coordination"
      ]
    };
  }

  function getManual() {
    return {
      meta: NodeAdminMeta,
      description: "NodeAdmin is the network brain / sentinel command organ.",
      usage: {
        setMode: "nodeAdmin.setMode('scan' | 'boost' | 'cool' | 'guard' | 'presence' | 'idle')",
        updateSentinels: "nodeAdmin.updateSentinels(maxLoopIndex) → sentinel states",
        analyzeAndAdvise:
          "nodeAdmin.analyzeAndAdvise({ body, home, town, node, flags, entryNodeId, context }) → advice",
        getReport: "nodeAdmin.getReport() → current state snapshot",
        getStateSnapshot: "nodeAdmin.getStateSnapshot() → compact state for Overmind",
        getAbilities: "nodeAdmin.getAbilities() → modes + intents + features",
        registerIntent: "nodeAdmin.registerIntent(name, handler)",
        executeIntent: "nodeAdmin.executeIntent(name, payload?)",
        executeCustom: "nodeAdmin.executeCustom(message, context?)",
        ask: "nodeAdmin.ask(question, context?)",
        getMemory: "nodeAdmin.getMemory({ limit?, type? })",
        setBackendInterpreter: "nodeAdmin.setBackendInterpreter(fn)",
        attachOvermindBridge: "nodeAdmin.attachOvermindBridge({ emit?, pullDirectives? })",
        applyDirective: "nodeAdmin.applyDirective({ mode?, intentName?, intentPayload? })",
        setPresenceIntegrations:
          "nodeAdmin.setPresenceIntegrations({ PresenceJobView, PulseWorldSocialGraph, PowerUserRanking, SystemClock })",
        setMeshSnapshot: "nodeAdmin.setMeshSnapshot(meshSnapshot)",
        setCastleSnapshot: "nodeAdmin.setCastleSnapshot(castleSnapshot)",
        setExpansionSnapshot: "nodeAdmin.setExpansionSnapshot(expansionSnapshot)",
        setRouterSnapshot: "nodeAdmin.setRouterSnapshot(routerSnapshot)",
        setBeaconSnapshot: "nodeAdmin.setBeaconSnapshot(beaconSnapshot)",
        setWorldCoreSnapshot: "nodeAdmin.setWorldCoreSnapshot(worldCoreSnapshot)",
        setPrewarmHints: "nodeAdmin.setPrewarmHints({ castle?, expansion?, mesh?, router?, worldCore? })",
        setCacheHints: "nodeAdmin.setCacheHints({ castle?, expansion?, mesh?, router?, worldCore? })",
        setChunkHints: "nodeAdmin.setChunkHints({ castle?, expansion?, mesh?, router?, worldCore? })",
        attachBeaconEngine: "nodeAdmin.attachBeaconEngine(beaconEngine)"
      },
      caveat:
        "Future AI or systems may propose new intents or mode rules. These should be added via registerIntent, applyDirective, or by extending analyzeAndAdvise, not by mutating core safety contracts."
    };
  }

  // ---------------------------------------------------------------------------
  // QUESTION ENGINE — SIMPLE Q&A OVER STATE
  // ---------------------------------------------------------------------------
  function ask(question, context = {}) {
    const q = (question || "").toLowerCase();
    const report = getReport();
    const abilities = getAbilities();

    let answer = null;

    if (q.includes("mode")) {
      answer = `Current mode is '${mode}'.`;
    } else if (q.includes("focus")) {
      const adv = memory.lastAdvice;
      if (adv) {
        answer = `Focus is on '${adv.focusLayer}' with score ${adv.focusScore.toFixed(
          3
        )} in mode '${adv.suggestedMode}'. Presence mode: '${adv.presenceMode}', social focus: '${adv.socialFocus}'.`;
      } else {
        answer = "No recent focus advice available yet.";
      }
    } else if (q.includes("sentinel")) {
      answer = `There are ${sentinels.length} sentinels. Last update had ${
        report.sentinels?.length || 0
      } entries.`;
    } else if (q.includes("ability") || q.includes("can you")) {
      answer = `I can operate in modes ${abilities.modes.join(
        ", "
      )}, execute intents [${abilities.intents.join(
        ", "
      )}], and provide advice, reports, presence/mesh/castle/expansion/router/worldCore-aware guidance, social-graph-aware focus, earn/reproduction hints, and prewarm/cache/chunk plans.`;
    } else if (q.includes("presence")) {
      const adv = memory.lastAdvice;
      if (adv) {
        answer = `Presence mode is '${adv.presenceMode}', social focus is '${adv.socialFocus}', earn readiness is '${adv.earnReadiness}', reproduction trigger is '${adv.reproductionTrigger}'.`;
      } else {
        answer = "No presence-aware advice available yet.";
      }
    } else if (q.includes("mesh")) {
      const adv = memory.lastAdvice?.mesh;
      if (adv) {
        answer = `Mesh strength is '${adv.meshStrength}', pressure index is ${adv.meshPressureIndex}, status '${adv.status}'.`;
      } else {
        answer = "No mesh advice available yet.";
      }
    } else if (q.includes("castle")) {
      const adv = memory.lastAdvice?.castle;
      if (adv) {
        answer = `Castle load is '${adv.loadLevel}', mesh support level is ${adv.meshSupportLevel}, status '${adv.status}'.`;
      } else {
        answer = "No castle advice available yet.";
      }
    } else if (q.includes("route") || q.includes("corridor") || q.includes("expansion")) {
      const adv = memory.lastAdvice?.expansion;
      if (adv) {
        answer = `Expansion need is '${adv.expansionNeed}', routeStable=${adv.routeStable}.`;
      } else {
        answer = "No route/expansion advice available yet.";
      }
    } else if (q.includes("prewarm") || q.includes("cache") || q.includes("chunk")) {
      const adv = memory.lastAdvice;
      if (adv) {
        answer = `Prewarm hints: ${JSON.stringify(
          adv.prewarmHints
        )}; cache hints: ${JSON.stringify(
          adv.cacheHints
        )}; chunk hints: ${JSON.stringify(adv.chunkHints)}.`;
      } else {
        answer = "No performance hints available yet.";
      }
    } else if (q.includes("power user") || q.includes("mentor")) {
      const adv = memory.lastAdvice;
      if (adv && adv.powerUserInfluence) {
        const p = adv.powerUserInfluence;
        answer = `Top power user nearby: '${p.displayName}' (band=${p.presenceBand}, age=${p.systemAge}, rankScore=${p.rankScore}).`;
      } else {
        answer = "No power-user influence data available yet.";
      }
    } else if (q.includes("reproduction")) {
      const adv = memory.lastAdvice;
      if (adv) {
        answer = `Reproduction trigger is '${adv.reproductionTrigger}'.`;
      } else {
        answer = "No reproduction advice available yet.";
      }
    } else {
      answer =
        "I don't have a direct answer for that question yet, but you can inspect my report via getReport() or extend my abilities via registerIntent, applyDirective, backendInterpreter, or setPresenceIntegrations()/set*Snapshot()/set*Hints().";
    }

    const evt = remember("question", { question, context, answer });
    emitToOvermind("question", evt);
    return { question, answer };
  }

  // ---------------------------------------------------------------------------
  // BEACON ENGINE BRIDGE
  // ---------------------------------------------------------------------------
  function handleOvermindMeta(meta) {
    if (!meta) return;

    const directive = meta.beaconDirective;
    if (!directive) return;

    if (beaconEngine && typeof beaconEngine.applyDirective === "function") {
      beaconEngine.applyDirective(directive);

      remember("beacon-directive-applied", {
        directive,
        ts: Date.now()
      });
    }
  }

  function attachBeaconEngine(beacon) {
    beaconEngine = beacon || null;
    const evt = remember("beacon-engine-set", { hasBeacon: !!beacon });
    emitToOvermind("beacon-engine-set", evt);

    if (!beaconEngine) return { ok: true };

    registerIntent("beacon-control", ({ payload }) => {
      return beaconEngine.handleNodeAdminIntent(payload.intentName, payload);
    });

    if (typeof beaconEngine.attachNodeAdminBridge === "function") {
      beaconEngine.attachNodeAdminBridge({
        onBeaconEvent: (evt) => {
          remember("beacon-event", evt);
        }
      });
    }

    return { ok: true };
  }

  // ---------------------------------------------------------------------------
  // CUSTOM ACTION INTERPRETER — EXECUTE CUSTOM MESSAGES
  // ---------------------------------------------------------------------------
  function executeCustom(message, context = {}) {
    const text = String(message || "").toLowerCase();

    // 1) Backend interpreter (adaptive, world-aware)
    if (backend) {
      const state = {
        mode,
        tick,
        sentinels: memory.lastSentinels,
        advice: memory.lastAdvice,
        abilities: getAbilities(),
        context,
        meshSnapshot,
        castleSnapshot,
        expansionSnapshot,
        routerSnapshot,
        beaconSnapshot,
        worldCoreSnapshot,
        perfHints
      };

      const backendResult = backend({ message, state });
      const evt = remember("custom-backend", { message, context, backendResult });
      emitToOvermind("custom-backend", evt);

      if (backendResult) {
        if (backendResult.mode) {
          setMode(backendResult.mode);
        }
        if (backendResult.intentName) {
          const res = executeIntent(
            backendResult.intentName,
            backendResult.payload || {}
          );
          return { source: "backend", backendResult, intentResult: res };
        }
        return { source: "backend", backendResult };
      }
    }

    // 2) Local heuristics
    let mappedIntent = null;
    let mappedMode = null;

    if (text.includes("scan") && text.includes("home")) {
      mappedMode = "scan";
      mappedIntent = "focus-home";
    } else if (text.includes("scan") && text.includes("town")) {
      mappedMode = "scan";
      mappedIntent = "focus-town";
    } else if (text.includes("boost") && text.includes("body")) {
      mappedMode = "boost";
      mappedIntent = "focus-body";
    } else if (text.includes("cool")) {
      mappedMode = "cool";
    } else if (text.includes("guard")) {
      mappedMode = "guard";
    } else if (text.includes("presence")) {
      mappedMode = "presence";
      mappedIntent = "presence-govern";
    }

    if (mappedMode) {
      setMode(mappedMode);
    }

    let intentResult = null;
    if (mappedIntent && intentHandlers[mappedIntent]) {
      intentResult = executeIntent(mappedIntent, { context });
    }

    const result = {
      source: "local",
      mappedMode,
      mappedIntent,
      intentResult
    };

    const evt = remember("custom-local", { message, context, result });
    emitToOvermind("custom-local", evt);
    return result;
  }

  // ---------------------------------------------------------------------------
  // DEFAULT INTENT LIBRARY
  // ---------------------------------------------------------------------------
  function registerDefaultIntents() {
    registerIntent("focus-body", ({ sentinels }) => {
      sentinels.forEach(s => { s.loopIndex = Math.max(0, s.loopIndex - 1); });
      return "Focusing sentinels toward body-related loops.";
    });

    registerIntent("focus-home", ({ sentinels }) => {
      sentinels.forEach(s => { s.loopIndex = s.loopIndex + 1; });
      return "Focusing sentinels toward home-related loops.";
    });

    registerIntent("focus-town", ({ sentinels }) => {
      sentinels.forEach(s => { s.loopIndex = s.loopIndex + 2; });
      return "Focusing sentinels toward town-related loops.";
    });

    registerIntent("focus-node", ({ sentinels }) => {
      sentinels.forEach(s => { s.loopIndex = Math.floor(s.loopIndex / 2); });
      return "Focusing sentinels toward node-related loops.";
    });

    registerIntent("scan-town-deep", () => {
      setMode("scan");
      return "Deep scanning town layer (mode=scan).";
    });

    registerIntent("cool-system", () => {
      setMode("cool");
      return "Cooling system (mode=cool).";
    });

    registerIntent("guard-perimeter", ({ sentinels }) => {
      setMode("guard");
      return `Guarding perimeter with ${sentinels.length} sentinels (mode=guard).`;
    });

    registerIntent("boost-system", () => {
      setMode("boost");
      return "Boosting system energy (mode=boost).";
    });

    registerIntent("presence-govern", () => {
      setMode("presence");
      return "Presence-governed mode engaged (mode=presence).";
    });
  }

  registerDefaultIntents();

  // ---------------------------------------------------------------------------
  // PUBLIC API
  // ---------------------------------------------------------------------------
  return {
    // meta
    meta: NodeAdminMeta,

    // core
    setMode,
    getMode,
    updateSentinels,
    analyzeAndAdvise,

    // intents / actions
    registerIntent,
    executeIntent,
    executeCustom,
    applyDirective,

    // introspection
    getReport,
    getStateSnapshot,
    getAbilities,
    getManual,
    getMemory,

    // questions
    ask,

    // backend AI bridge
    setBackendInterpreter,

    // Overmind bridge
    attachOvermindBridge,

    // presence / social / earn
    setPresenceIntegrations,

    // world snapshots
    setMeshSnapshot,
    setCastleSnapshot,
    setExpansionSnapshot,
    setRouterSnapshot,
    setBeaconSnapshot,
    setWorldCoreSnapshot,

    // perf hints
    setPrewarmHints,
    setCacheHints,
    setChunkHints,

    // beacon bridge
    attachBeaconEngine,
    handleOvermindMeta
  };
}

// -----------------------------------------------------------------------------
// HELPERS
// -----------------------------------------------------------------------------
function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}

export default createPulseNodeAdmin;
