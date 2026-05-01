
// ============================================================================
// FILE: /PulseOS/PULSE-TOOLS/PulseNodeAdmin-v12.3-PRESENCE-EVO-INTELLECT.js
// PULSE OS — v12.3 PRESENCE-EVO
// NODEADMIN ORGAN — SENTINEL COMMAND BRAIN / INTENT + MEMORY + IQ + PRESENCE MAP
// ============================================================================

const PulseNodeAdminIQMap = {
    identity: {
    name: "PulseNodeAdmin",
    version: "v12.3+ PRESENCE-EVO-INTELLECT++",
    role: "Sentinel Command Brain",
    description:
      "Circling guardian cortex that analyzes all layers, manages modes, executes intents, interprets custom actions, integrates memory + backend AI + presence + social graph + earn readiness + mesh/castle/expansion/router/beacon/worldCore signals + band/binary/wave fields + soldier/load maps."
  },

  purpose: {
    primary: [
      "Protect the organism",
      "Guide scanning and repair",
      "Interpret commands and intents",
      "Route energy and attention",
      "Provide reports and advice",
      "Integrate backend AI intelligence",
      "Maintain memory of events and decisions",
      "Integrate presence and social graph signals",
      "Integrate mesh, castle, expansion, router, beacon signals",
      "Coordinate with reproduction and earn organs"
    ],
    secondary: [
      "Expose abilities and help menus",
      "Support custom message interpretation",
      "Evolve by suggesting new intents and mappings",
      "Surface civilization-level patterns (clusters, mentors, jobs)"
    ]
  },
  modes: {
    idle: { description: "Neutral state. Minimal activity. Monitoring only.", frequency: 1.0, wavelength: 1.0 },
    scan: { description: "Deep scanning mode. Slow frequency, long wavelength.", frequency: 0.4, wavelength: 1.6 },
    boost: { description: "High-energy repair mode. Fast frequency, short wavelength.", frequency: 1.8, wavelength: 0.7 },
    cool: { description: "Cooling mode. Low frequency, long wavelength.", frequency: 0.3, wavelength: 1.8 },
    guard: { description: "Perimeter defense mode. Edge-biased sentinel loops.", frequency: 1.0, wavelength: 1.0 },
    presence: { description: "Presence-governed mode. Social + earn + expansion aware.", frequency: 1.2, wavelength: 1.0 }
  },
  sentinels: {
    description:
      "Multiple circling guardians with phase offsets, loop indices, energy fields, and frequency/wavelength modulation.",
    parameters: ["phaseOffset", "loopIndex", "energy", "frequency", "wavelength"],
    behaviors: [
      "circling",
      "edge-guarding",
      "deep scanning",
      "rapid repair",
      "cooling sweep",
      "presence-biased routing"
    ]
  },
  intents: {
    description: "Named actions that NodeAdmin can execute. These form the command vocabulary.",
    examples: [
      "focus-body",
      "focus-home",
      "focus-town",
      "focus-node",
      "scan-town-deep",
      "cool-system",
      "guard-perimeter",
      "boost-system",
      "presence-govern",
      "optimize-route",
      "review-reproduction-plan"
    ]
  },
  commandMappings: {
    description: "Heuristic and backend-AI-driven rules for interpreting custom messages.",
    examples: [
      { pattern: "scan home", mapsTo: "focus-home", mode: "scan" },
      { pattern: "scan town", mapsTo: "scan-town-deep", mode: "scan" },
      { pattern: "boost body", mapsTo: "focus-body", mode: "boost" },
      { pattern: "cool system", mapsTo: "cool-system", mode: "cool" },
      { pattern: "guard", mapsTo: "guard-perimeter", mode: "guard" },
      { pattern: "presence mode", mapsTo: "presence-govern", mode: "presence" },
      { pattern: "optimize routes", mapsTo: "optimize-route", mode: "presence" },
      { pattern: "review reproduction", mapsTo: "review-reproduction-plan", mode: "presence" }
    ]
  },
  abilities: {
    categories: {
      scanning: ["deep scan", "broad scan", "targeted scan", "multi-sentinel scan"],
      repair: ["boost energy", "repair field", "assist field", "node stabilization"],
      guarding: ["perimeter guard", "edge bias", "sentinel hardening"],
      cooling: ["system cool", "energy dampening"],
      intelligence: [
        "layer scoring",
        "focus selection",
        "advice generation",
        "custom action interpretation",
        "backend AI integration",
        "memory recall",
        "help menu generation",
        "IQ map exposure"
      ],
      presence: [
        "presence-aware mode selection",
        "presence-band awareness",
        "system-age awareness",
        "power-user influence awareness",
        "job-readiness awareness"
      ],
      socialGraph: [
        "cluster detection",
        "expansion wave detection",
        "mentorship flow awareness",
        "job economy awareness"
      ],
      reproduction: [
        "spawn-node recommendation",
        "spawn-advanced-node recommendation",
        "expansion-trigger awareness",
        "route-node-plan awareness",
        "castle-reproduction-plan awareness"
      ],
      meshCastleExpansion: [
        "mesh-pressure awareness",
        "castle-load awareness",
        "route-stability awareness",
        "expansion-need awareness",
        "router-suggestion awareness",
        "beacon presence/advantage awareness",
        "band/binary/wave-field awareness",
        "worldCore mode/load awareness"
      ],

      earn: ["earn-readiness scoring", "earn-context awareness"]
    }
  },
  memory: {
    categories: [
      "mode-change",
      "sentinels-updated",
      "advice",
      "intent-executed",
      "intent-registered",
      "custom-backend",
      "custom-local",
      "report",
      "question",
      "router-advice",
      "beacon-advice",
      "worldcore-advice",
      "presence-advice",
      "social-advice",
      "earn-advice",
      "reproduction-advice",
      "mesh-advice",
      "castle-advice",
      "expansion-advice",
      "router-advice",
      "reproduction-plan"
    ]
  },
  reports: {
    description:
      "Structured snapshots of NodeAdmin's state, including mode, sentinels, focus, presence, social, earn, reproduction, mesh, castle, expansion, router hints."
  },
  questions: {
    examples: [
      "Where are you?",
      "What mode are you in?",
      "What layer needs attention?",
      "What are your abilities?",
      "What do you recommend?",
      "What’s happening in the town layer?",
      "What’s your energy distribution?",
      "What is the presence situation?",
      "Who is the top power user nearby?",
      "Should we expand or spawn new nodes?",
      "What is the mesh pressure?",
      "Is the castle overloaded?",
      "Is the route stable?",
      "What reproduction plan do you see?"
    ]
  },
  helpMenu: {
    description:
      "Human/AI help menu listing commands, intents, modes, abilities, and how mesh/castle/expansion/router signals are used."
  },
  evolution: {
    description: "Guidelines for extending NodeAdmin.",
    rules: [
      "Do NOT break deterministic safety contracts.",
      "Add new abilities via intents, not by mutating core logic.",
      "Extend command mappings and IQ map rather than hardcoding ad-hoc behavior.",
      "Use memory patterns to propose new intents or mode rules.",
      "Backend AI may propose changes; humans or higher-level governance should approve.",
      "Presence, social, mesh, castle, expansion integrations must remain metadata-only and non-invasive."
    ]
  }
};


// ============================================================================
// FACTORY — CREATE THE SENTINEL COMMAND BRAIN
// ============================================================================

export function createPulseNodeAdmin({
  trace = false,
  instances = 3,
  backendInterpreter = null
} = {}) {
  let mode = "idle";
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

  const intentHandlers = {};
  const commandMappings = [];
  let backend = backendInterpreter;

  const presenceDeps = {
    PresenceJobView: null,
    PulseWorldSocialGraph: null,
    PowerUserRanking: null,
    SystemClock: null
  };

    // NEW: world organ snapshots
  let castleSnapshot = null;
  let meshSnapshot = null;
  let expansionSnapshot = null;
  let routerSnapshot = null;
  let beaconSnapshot = null;
  let worldCoreSnapshot = null;
  // EVO++: soldier + load tracking
  const soldierRegistry = Object.create(null); // soldierId -> { castleId, serverId, meta }
  const castleLoad = Object.create(null);      // castleId -> loadIndex
  const serverLoad = Object.create(null);      // serverId -> loadIndex


  function clamp(v, min, max) {
    return v < min ? min : v > max ? max : v;
  }

  // MEMORY
  function remember(type, data) {
    const entry = { type, timestamp: Date.now(), data };
    memory.events.push(entry);
    if (memory.events.length > 500) memory.events.shift();
    return entry;
  }

  function getMemory({ limit = 50, type = null } = {}) {
    const filtered = type ? memory.events.filter(e => e.type === type) : memory.events;
    return filtered.slice(-limit);
  }

  // INTENTS
  function registerIntent(name, handler) {
    intentHandlers[name] = handler;
    remember("intent-registered", { name });
  }

  function executeIntent(name, payload = {}) {
    const handler = intentHandlers[name];
    if (!handler) {
      if (trace) console.warn("[NodeAdmin] Unknown intent:", name);
      remember("intent-missing", { name, payload });
      return { ok: false, error: "unknown-intent" };
    }
    if (trace) console.log("[NodeAdmin] Executing intent:", name, payload);
    const result = handler({ mode, sentinels, payload });
    remember("intent-executed", { name, payload, result });
    return { ok: true, result };
  }

  // BACKEND
  function setBackendInterpreter(fn) {
    backend = fn;
    remember("backend-set", { hasBackend: !!fn });
  }

  // PRESENCE / SOCIAL / EARN
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
    remember("presence-integrations-set", {
      hasPresenceJobView: !!PresenceJobView,
      hasSocialGraph: !!PulseWorldSocialGraph,
      hasPowerUserRanking: !!PowerUserRanking,
      hasSystemClock: !!SystemClock
    });
  }

  // NEW: WORLD INTEGRATIONS
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

      remember("castle-advice", { hasSnapshot: !!snapshot });
      return { ok: true };
    }


    function setMeshSnapshot(snapshot) {
    meshSnapshot = snapshot || null;
    remember("mesh-advice", { hasSnapshot: !!snapshot });
    return { ok: true };
  }


    function setExpansionSnapshot(snapshot) {
      expansionSnapshot = snapshot || null;

      // EVO++: track expansion cycles + last plan
      // Expecting snapshot.plan or similar
      if (snapshot && snapshot.plan) {
        cycle++;
        lastExpansionPlan = snapshot.plan;
      }

      remember("expansion-advice", {
        hasSnapshot: !!snapshot,
        cycle,
        hasPlan: !!(snapshot && snapshot.plan)
      });
      return { ok: true };
    }


    function setRouterSnapshot(snapshot) {
    routerSnapshot = snapshot || null;
    remember("router-advice", { hasSnapshot: !!snapshot });
    return { ok: true };
  }

  function setBeaconSnapshot(snapshot) {
    beaconSnapshot = snapshot || null;
    remember("beacon-advice", { hasSnapshot: !!snapshot });
    return { ok: true };
  }
  function setWorldCoreSnapshot(snapshot) {
    worldCoreSnapshot = snapshot || null;
    remember("worldcore-advice", { hasSnapshot: !!snapshot });
    return { ok: true };
  }


  // MODE
  function setMode(nextMode) {
    mode = nextMode;
    remember("mode-change", { mode });
    if (trace) console.log("[NodeAdmin] mode:", mode);
  }

  function getMode() {
    return mode;
  }

  // SENTINELS
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
        frequency = PulseNodeAdminIQMap.modes.scan.frequency;
        wavelength = PulseNodeAdminIQMap.modes.scan.wavelength;
      } else if (mode === "boost") {
        frequency = PulseNodeAdminIQMap.modes.boost.frequency;
        wavelength = PulseNodeAdminIQMap.modes.boost.wavelength;
      } else if (mode === "cool") {
        frequency = PulseNodeAdminIQMap.modes.cool.frequency;
        wavelength = PulseNodeAdminIQMap.modes.cool.wavelength;
      } else if (mode === "guard") {
        frequency = PulseNodeAdminIQMap.modes.guard.frequency;
        wavelength = PulseNodeAdminIQMap.modes.guard.wavelength;
        const edgeBias = (i % 2 === 0) ? 0 : maxLoopIndex - 1;
        s.loopIndex = edgeBias;
      } else if (mode === "presence") {
        frequency = PulseNodeAdminIQMap.modes.presence.frequency;
        wavelength = PulseNodeAdminIQMap.modes.presence.wavelength;
      }

      if (mode !== "guard") s.loopIndex = baseLoop;

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
    remember("sentinels-updated", { mode, results });
    if (trace) console.log("[NodeAdmin] sentinels:", results);
    return results;
  }

  // PRESENCE INTELLECT
  function presenceAwareMode(entryNodeId, context = {}) {
    const { PresenceJobView } = presenceDeps;
    if (!PresenceJobView) return "idle";

    const jobView = PresenceJobView.build(entryNodeId, context);
    const nearby = jobView.nearbyPresence || [];

    const powerCount = nearby.filter(p => p.powerUser).length;
    const newCount = nearby.filter(p => p.ageCategory === "new").length;

    if (powerCount >= 3) return "boost";
    if (newCount >= 3) return "scan";

    if (jobView.stability > 0.8 && jobView.drift < 0.2) return "cool";

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

  // NEW: MESH / CASTLE / EXPANSION / ROUTER / BEACON INTELLECT HELPERS
  function meshAdvice() {
    if (!meshSnapshot) return null;
    const m = meshSnapshot.densityHealth?.A_metrics || {};
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
    const load = castleSnapshot.state?.loadLevel || "unknown";
    const meshSupport = castleSnapshot.state?.meshSupportLevel ?? 0;

    let status = "normal";
    if (load === "high" || load === "critical") status = "overloaded";

    const advice = { loadLevel: load, meshSupportLevel: meshSupport, status };
    remember("castle-advice", advice);
    return advice;
  }

  function expansionAdvice() {
    if (!expansionSnapshot) return null;
    const need = expansionSnapshot.expansionNeed?.expansionNeed || "none";
    const routeStable = expansionSnapshot.routeField?.routeStable ?? null;

    const advice = { expansionNeed: need, routeStable };
    remember("expansion-advice", advice);
    return advice;
  }

    function routerAdvice() {
    if (!routerSnapshot) return null;

    const r = routerSnapshot.routeField || routerSnapshot.metrics || {};
    const suggestions = routerSnapshot.suggestions || {};

    const stable = r.routeStable ?? r.stable ?? null;
    const errorRate = r.errorRate ?? r.routeErrorRate ?? 0;
    const hops = r.avgHops ?? r.hops ?? null;

    let status = "unknown";
    if (stable === true && errorRate < 0.01) status = "stable";
    else if (stable === false || errorRate > 0.05) status = "unstable";
    else status = "degraded";

    const advice = {
      routeStable: stable,
      errorRate,
      hops,
      status,
      betterRoutes: suggestions.betterRoutes || null,
      corridorProtection: suggestions.corridorProtection || null
    };
    remember("router-advice", advice);
    return advice;
  }


    function beaconAdvice() {
    if (!beaconSnapshot) return null;

    const presenceField = beaconSnapshot.presenceField || beaconSnapshot.presence || null;
    const advantageField = beaconSnapshot.advantageField || beaconSnapshot.advantage || null;
    const bandSignature = beaconSnapshot.bandSignature || null;
    const binaryField = beaconSnapshot.binaryField || null;
    const waveField = beaconSnapshot.waveField || null;
    const fallbackBandLevel = beaconSnapshot.globalHints?.fallbackBandLevel ?? 0;

    const advice = {
      presenceField,
      advantageField,
      bandSignature,
      binaryField,
      waveField,
      fallbackBandLevel
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


  // LAYER SCORING
  function scoreLayer(summary) {
    if (!summary) return 0;
    const d = Number(summary.densityAvg || 0);
    const c = Number(summary.contrastAvg || 0);
    const w = Number(summary.waveAvg || 0);
    return clamp((d + c + w) / 3, 0, 1);
  }

  // INTELLECT CORE
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
    if (hasHighFlags || topScore > 0.75) suggestedMode = "boost";
    else if (hasMediumFlags || topScore > 0.5) suggestedMode = "scan";
    else if (topScore < 0.2) suggestedMode = "cool";

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
      worldCore: worldCoreInfo
    };


    memory.lastAdvice = advice;
    remember("advice", advice);
    remember("earn-advice", { earnReadiness: earnReadyValue });
    remember("reproduction-advice", { reproductionTrigger: reproductionValue });

    if (trace) console.log("[NodeAdmin] advice:", advice);
    return advice;
  }

  // REPORT
    function getReport() {
    const report = {
      mode,
      tick,
      cycle,
      sentinels: memory.lastSentinels,
      lastAdvice: memory.lastAdvice,
      recentMemory: memory.events.slice(-20),
      mesh: meshSnapshot,
      castle: castleSnapshot,
      expansion: expansionSnapshot,
      router: routerSnapshot,
      beacon: beaconSnapshot,
      worldCore: worldCoreSnapshot,
      soldierRegistry,
      castleLoad,
      serverLoad,
      lastExpansionPlan
    };
    memory.lastReport = report;
    remember("report", report);
    return report;
  }


  // ABILITIES / IQ / MANUAL / HELP
  function getAbilities() {
    return {
      modes: Object.keys(PulseNodeAdminIQMap.modes),
      intents: Object.keys(intentHandlers),
      features: PulseNodeAdminIQMap.abilities.categories
    };
  }

  function getIQMap() {
    return PulseNodeAdminIQMap;
  }

  function getManual() {
    return {
      description: "NodeAdmin is the Sentinel Command Brain of PulseOS.",
      usage: {
        setMode: "nodeAdmin.setMode('scan' | 'boost' | 'cool' | 'guard' | 'presence' | 'idle')",
        updateSentinels: "nodeAdmin.updateSentinels(maxLoopIndex)",
        analyzeAndAdvise:
          "nodeAdmin.analyzeAndAdvise({ body, home, town, node, flags, entryNodeId, context })",
        getReport: "nodeAdmin.getReport()",
        getAbilities: "nodeAdmin.getAbilities()",
        getIQMap: "nodeAdmin.getIQMap()",
        registerIntent: "nodeAdmin.registerIntent(name, handler)",
        executeIntent: "nodeAdmin.executeIntent(name, payload?)",
        executeCustom: "nodeAdmin.executeCustom(message, context?)",
        ask: "nodeAdmin.ask(question, context?)",
        getMemory: "nodeAdmin.getMemory({ limit?, type? })",
        setBackendInterpreter: "nodeAdmin.setBackendInterpreter(fn)",
        setPresenceIntegrations:
          "nodeAdmin.setPresenceIntegrations({ PresenceJobView, PulseWorldSocialGraph, PowerUserRanking, SystemClock })",
        setCastleSnapshot: "nodeAdmin.setCastleSnapshot(castleSnapshot)",
        setMeshSnapshot: "nodeAdmin.setMeshSnapshot(meshSnapshot)",
                setExpansionSnapshot: "nodeAdmin.setExpansionSnapshot(expansionSnapshot)",
        setRouterSnapshot: "nodeAdmin.setRouterSnapshot(routerSnapshot)",
        setBeaconSnapshot: "nodeAdmin.setBeaconSnapshot(beaconSnapshot)",
        setWorldCoreSnapshot: "nodeAdmin.setWorldCoreSnapshot(worldCoreSnapshot)"

      }
    };
  }

  function getHelpMenu() {
    const abilities = getAbilities();
    return {
      title: "PulseNodeAdmin — Sentinel Command Brain Help",
      modes: abilities.modes,
      intents: abilities.intents,
      exampleCommands: PulseNodeAdminIQMap.commandMappings.examples,
      questions: PulseNodeAdminIQMap.questions.examples,
      notes: PulseNodeAdminIQMap.helpMenu
    };
  }

  // QUESTIONS
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
        answer = `Focus '${adv.focusLayer}' score ${adv.focusScore.toFixed(3)} mode '${adv.suggestedMode}'. Presence '${adv.presenceMode}', social '${adv.socialFocus}'.`;
      } else {
        answer = "No recent focus advice available yet.";
      }
    } else if (q.includes("sentinel")) {
      answer = `There are ${sentinels.length} sentinels. Last update had ${report.sentinels?.length || 0} entries.`;
    } else if (q.includes("ability") || q.includes("can you")) {
      answer = `I can operate in modes ${abilities.modes.join(", ")}, execute intents [${abilities.intents.join(", ")}], and provide advice, reports, memory, presence/mesh/castle/expansion/router-aware guidance, and earn/reproduction hints.`;
    } else if (q.includes("presence")) {
      const adv = memory.lastAdvice;
      if (adv) {
        answer = `Presence mode '${adv.presenceMode}', social focus '${adv.socialFocus}', earn readiness '${adv.earnReadiness}', reproduction trigger '${adv.reproductionTrigger}'.`;
      } else {
        answer = "No presence-aware advice available yet.";
      }
    } else if (q.includes("mesh")) {
      const adv = memory.lastAdvice?.mesh;
      if (adv) {
        answer = `Mesh strength '${adv.meshStrength}', pressure index ${adv.meshPressureIndex}, status '${adv.status}'.`;
      } else {
        answer = "No mesh advice available yet.";
      }
    } else if (q.includes("castle")) {
      const adv = memory.lastAdvice?.castle;
      if (adv) {
        answer = `Castle load '${adv.loadLevel}', mesh support ${adv.meshSupportLevel}, status '${adv.status}'.`;
      } else {
        answer = "No castle advice available yet.";
      }
    } else if (q.includes("route") || q.includes("corridor")) {
      const adv = memory.lastAdvice?.expansion;
      if (adv) {
        answer = `Expansion need '${adv.expansionNeed}', routeStable=${adv.routeStable}.`;
      } else {
        answer = "No route/expansion advice available yet.";
      }
    } else if (q.includes("reproduction")) {
      const adv = memory.lastAdvice;
      if (adv) {
        answer = `Reproduction trigger '${adv.reproductionTrigger}'.`;
      } else {
        answer = "No reproduction advice available yet.";
      }
    } else if (q.includes("power user") || q.includes("mentor")) {
      const adv = memory.lastAdvice;
      if (adv && adv.powerUserInfluence) {
        const p = adv.powerUserInfluence;
        answer = `Top power user nearby: '${p.displayName}' (band=${p.presenceBand}, age=${p.systemAge}, rankScore=${p.rankScore}).`;
      } else {
        answer = "No power-user influence data available yet.";
      }
    } else if (q.includes("help") || q.includes("commands")) {
      const help = getHelpMenu();
      answer = `Modes: ${help.modes.join(", ")} | Intents: [${help.intents.join(", ")}]. You can ask: ${help.questions.join(" | ")}.`;
    } else {
      answer =
        "No direct answer yet. Use getReport(), getIQMap(), or extend via registerIntent / setBackendInterpreter / setPresenceIntegrations / set*Snapshot.";
    }

    remember("question", { question, context, answer });
    return { question, answer };
  }

  // COMMAND MAPPINGS
  function registerCommandMapping(pattern, intentName = null, mappedMode = null) {
    commandMappings.push({ pattern: pattern.toLowerCase(), intentName, mappedMode });
    remember("command-mapping-registered", { pattern, intentName, mappedMode });
  }

  function executeCustom(message, context = {}) {
    const text = (message || "").toLowerCase();

    for (const mapping of commandMappings) {
      if (text.includes(mapping.pattern)) {
        if (mapping.mappedMode) setMode(mapping.mappedMode);
        if (mapping.intentName) return executeIntent(mapping.intentName, { context, message });
      }
    }

    if (backend) {
      const result = backend({
        message,
        state: {
          organId: PulseNodeAdminIQMap.identity.name,
          mode,
          tick,
          cycle,
          sentinels,
          memory,
          meshSnapshot,
          castleSnapshot,
          expansionSnapshot,
          routerSnapshot,
          beaconSnapshot,
          worldCoreSnapshot,
          soldierRegistry,
          castleLoad,
          serverLoad,
          lastExpansionPlan
        }
      });

      remember("custom-backend", { message, result });
      return result;
    }

    remember("custom-local", { message });
    return { ok: false, reason: "no-mapping-no-backend" };
  }

  // PUBLIC
    return {
    getMode,
    setMode,
    updateSentinels,
    registerIntent,
    executeIntent,
    setBackendInterpreter,
    setPresenceIntegrations,
    setCastleSnapshot,
    setMeshSnapshot,
    setExpansionSnapshot,
    setRouterSnapshot,
    setBeaconSnapshot,
    setWorldCoreSnapshot,   // ⭐ EVO++ REQUIRED
    analyzeAndAdvise,
    getReport,
    getAbilities,
    getIQMap,
    getManual,
    getHelpMenu,
    getMemory,
    ask,
    registerCommandMapping,
    executeCustom
  };

}

export default createPulseNodeAdmin;
