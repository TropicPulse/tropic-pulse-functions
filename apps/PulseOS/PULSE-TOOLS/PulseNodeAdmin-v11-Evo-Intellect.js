// ============================================================================
// FILE: /apps/PulseOS/binary/PulseNodeAdmin-v11-EVO-INTELLECT.js
// PULSE OS — v11-EVO
// NODEADMIN ORGAN — SENTINEL COMMAND BRAIN / INTENT + MEMORY + IQ MAP
// ============================================================================
// HIGH-LEVEL VISION
// ---------------------------------------------------------------------------
// This organ is the "Sentinel Command Brain" of PulseOS.
//
// It is NOT just a helper module.
// It is a *cortex* that:
//
//   - Circles the organism with multiple sentinels (multi-instance guardians).
//   - Analyzes all layers (body/home/town/node) via summaries + flags.
//   - Decides which layer needs attention and how urgently.
//   - Controls modes: idle / scan / boost / cool / guard.
//   - Executes named intents (actions) registered into its command vocabulary.
//   - Interprets custom messages (from humans, UI, backend AI) into actions.
//   - Maintains memory of events, decisions, and actions.
//   - Exposes an IQ Map: a self-description of its abilities and structure.
//   - Provides reports, help menus, and a question/answer surface.
//   - Bridges to a backend AI interpreter for higher-level reasoning.
//
// This file is intentionally verbose and self-describing so that:
//
//   - Humans can read it and understand the design philosophy.
//   - Future AI can parse it, extend it, and evolve it safely.
//   - The organ itself can be treated as a "building block of intelligence."
//
// SAFETY CONTRACT
//   - Deterministic behavior (no randomness).
//   - No recursion, no async drift.
//   - No mutation outside internal state.
//   - Purely synthetic, non-medical.
//   - Backend AI is advisory, not authoritative over safety rules.
// ============================================================================


// ============================================================================
// IQ MAP — SELF-DESCRIBING INTELLIGENCE BLUEPRINT
// ============================================================================
// This map is a structured description of what NodeAdmin is, what it can do,
// how it thinks, and how it should be extended. It is both documentation and
// a live data structure that NodeAdmin can expose via APIs (help, report, etc).
// ============================================================================

const PulseNodeAdminIQMap = {

  // -------------------------------------------------------------------------
  // IDENTITY
  // -------------------------------------------------------------------------
  identity: {
    name: "PulseNodeAdmin",
    version: "v11-EVO-INTELLECT",
    role: "Sentinel Command Brain",
    description:
      "Circling guardian cortex that analyzes all layers, manages modes, executes intents, interprets custom actions, and integrates memory + backend AI."
  },

  // -------------------------------------------------------------------------
  // PURPOSE
  // -------------------------------------------------------------------------
  purpose: {
    primary: [
      "Protect the organism",
      "Guide scanning and repair",
      "Interpret commands and intents",
      "Route energy and attention",
      "Provide reports and advice",
      "Integrate backend AI intelligence",
      "Maintain memory of events and decisions"
    ],
    secondary: [
      "Expose abilities and help menus",
      "Support custom message interpretation",
      "Evolve by suggesting new intents and mappings"
    ]
  },

  // -------------------------------------------------------------------------
  // MODES — BEHAVIORAL STATES
  // -------------------------------------------------------------------------
  modes: {
    idle: {
      description: "Neutral state. Minimal activity. Monitoring only.",
      frequency: 1.0,
      wavelength: 1.0
    },
    scan: {
      description: "Deep scanning mode. Slow frequency, long wavelength.",
      frequency: 0.4,
      wavelength: 1.6
    },
    boost: {
      description: "High-energy repair mode. Fast frequency, short wavelength.",
      frequency: 1.8,
      wavelength: 0.7
    },
    cool: {
      description: "Cooling mode. Low frequency, long wavelength.",
      frequency: 0.3,
      wavelength: 1.8
    },
    guard: {
      description: "Perimeter defense mode. Edge-biased sentinel loops.",
      frequency: 1.0,
      wavelength: 1.0
    }
  },

  // -------------------------------------------------------------------------
  // SENTINEL ENGINE
  // -------------------------------------------------------------------------
  sentinels: {
    description:
      "Multiple circling guardians with phase offsets, loop indices, energy fields, and frequency/wavelength modulation.",
    parameters: [
      "phaseOffset",
      "loopIndex",
      "energy",
      "frequency",
      "wavelength"
    ],
    behaviors: [
      "circling",
      "edge-guarding",
      "deep scanning",
      "rapid repair",
      "cooling sweep"
    ]
  },

  // -------------------------------------------------------------------------
  // INTENTS — NAMED ACTIONS
  // -------------------------------------------------------------------------
  intents: {
    description:
      "Named actions that NodeAdmin can execute. These form the command vocabulary.",
    examples: [
      "focus-body",
      "focus-home",
      "focus-town",
      "focus-node",
      "scan-town-deep",
      "cool-system",
      "guard-perimeter",
      "boost-system"
    ],
    notes:
      "Actual registered intents live in NodeAdmin's runtime registry; this list is illustrative."
  },

  // -------------------------------------------------------------------------
  // COMMAND MAPPINGS — CUSTOM MESSAGE → INTENT/MODE
  // -------------------------------------------------------------------------
  commandMappings: {
    description:
      "Heuristic and backend-AI-driven rules for interpreting custom messages.",
    examples: [
      { pattern: "scan home", mapsTo: "focus-home", mode: "scan" },
      { pattern: "scan town", mapsTo: "scan-town-deep", mode: "scan" },
      { pattern: "boost body", mapsTo: "focus-body", mode: "boost" },
      { pattern: "cool system", mapsTo: "cool-system", mode: "cool" },
      { pattern: "guard", mapsTo: "guard-perimeter", mode: "guard" }
    ],
    backendIntegration:
      "If backend AI is connected, it may override or refine these mappings."
  },

  // -------------------------------------------------------------------------
  // ABILITIES — CAPABILITY MAP
  // -------------------------------------------------------------------------
  abilities: {
    categories: {
      scanning: [
        "deep scan",
        "broad scan",
        "targeted scan",
        "multi-sentinel scan"
      ],
      repair: [
        "boost energy",
        "repair field",
        "assist field",
        "node stabilization"
      ],
      guarding: [
        "perimeter guard",
        "edge bias",
        "sentinel hardening"
      ],
      cooling: [
        "system cool",
        "energy dampening"
      ],
      intelligence: [
        "layer scoring",
        "focus selection",
        "advice generation",
        "custom action interpretation",
        "backend AI integration",
        "memory recall",
        "help menu generation",
        "IQ map exposure"
      ]
    }
  },

  // -------------------------------------------------------------------------
  // MEMORY — WHAT IS REMEMBERED
  // -------------------------------------------------------------------------
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
      "question"
    ],
    purpose:
      "Memory allows NodeAdmin to recall past decisions, detect patterns, and evolve via higher-level reasoning."
  },

  // -------------------------------------------------------------------------
  // REPORTS — WHAT NODEADMIN CAN TELL YOU
  // -------------------------------------------------------------------------
  reports: {
    description:
      "Structured snapshots of NodeAdmin's state, including mode, sentinels, focus, and recent memory.",
    includes: [
      "current mode",
      "tick count",
      "sentinel states",
      "last advice",
      "recent memory events",
      "focus layer",
      "focus score"
    ]
  },

  // -------------------------------------------------------------------------
  // QUESTIONS — WHAT YOU CAN ASK
  // -------------------------------------------------------------------------
  questions: {
    examples: [
      "Where are you?",
      "What mode are you in?",
      "What layer needs attention?",
      "What are your abilities?",
      "What do you recommend?",
      "What’s happening in the town layer?",
      "What’s your energy distribution?"
    ],
    behavior:
      "NodeAdmin answers using its report, memory, advice engine, and optionally backend AI."
  },

  // -------------------------------------------------------------------------
  // HELP MENU — HUMAN/AI-FACING COMMAND MAP
  // -------------------------------------------------------------------------
  helpMenu: {
    description:
      "Human-readable and AI-readable help menu listing commands, intents, modes, and abilities.",
    includes: [
      "Available modes",
      "Registered intents",
      "Example custom commands",
      "How to ask questions",
      "How to execute actions",
      "How to register new intents",
      "How to connect backend AI",
      "How to inspect IQ map"
    ]
  },

  // -------------------------------------------------------------------------
  // EVOLUTION — HOW THIS ORGAN SHOULD IMPROVE
  // -------------------------------------------------------------------------
  evolution: {
    description:
      "Guidelines for how future AI or developers should extend NodeAdmin.",
    rules: [
      "Do NOT break deterministic safety contracts.",
      "Add new abilities via intents, not by mutating core logic.",
      "Extend command mappings and IQ map rather than hardcoding ad-hoc behavior.",
      "Use memory patterns to propose new intents or mode rules.",
      "Backend AI may propose changes; humans or higher-level governance should approve."
    ]
  }
};


// ============================================================================
// FACTORY — CREATE THE SENTINEL COMMAND BRAIN
// ============================================================================

export function createPulseNodeAdmin({
  trace = false,
  instances = 3,
  backendInterpreter = null   // optional: fn({ message, state }) => { intentName?, mode?, notes? }
} = {}) {

  // -------------------------------------------------------------------------
  // INTERNAL STATE
  // -------------------------------------------------------------------------
  // mode: high-level behavioral state
  let mode = "idle"; // "idle" | "scan" | "boost" | "cool" | "guard"
  // tick: global time step for sentinel evolution
  let tick = 0;

  // Multi-sentinel engine: each sentinel is a circling guardian with its own
  // phase, loop index, energy, frequency, and wavelength.
  const sentinels = Array.from({ length: instances }, (_, i) => ({
    id: i,
    phase: (Math.PI * 2 * i) / instances,
    energy: 0.5,
    loopIndex: 0,
    frequency: 1.0,
    wavelength: 1.0
  }));

  // Memory: NodeAdmin’s internal log of what happened and what it decided.
  const memory = {
    events: [],       // { type, timestamp, data }
    lastReport: null, // last getReport() snapshot
    lastAdvice: null, // last analyzeAndAdvise() result
    lastSentinels: [] // last updateSentinels() result
  };

  // Intent registry: programmable actions NodeAdmin can execute.
  const intentHandlers = {};

  // Command mappings: simple heuristic patterns for local interpretation.
  const commandMappings = [];

  // Backend interpreter: optional AI brain behind NodeAdmin.
  let backend = backendInterpreter;

  // -------------------------------------------------------------------------
  // MEMORY HELPERS — TEMPORAL CORTEX
  // -------------------------------------------------------------------------
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

  // -------------------------------------------------------------------------
  // INTENT SYSTEM — COMMAND VOCABULARY
  // -------------------------------------------------------------------------
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

  // -------------------------------------------------------------------------
  // BACKEND INTERPRETER HOOK — NEURAL BRIDGE
  // -------------------------------------------------------------------------
  function setBackendInterpreter(fn) {
    backend = fn;
    remember("backend-set", { hasBackend: !!fn });
  }

  // -------------------------------------------------------------------------
  // MODE CONTROL — BEHAVIOR GOVERNOR
  // -------------------------------------------------------------------------
  function setMode(nextMode) {
    mode = nextMode;
    remember("mode-change", { mode });
    if (trace) console.log("[NodeAdmin] mode:", mode);
  }

  function getMode() {
    return mode;
  }

  // -------------------------------------------------------------------------
  // SENTINEL ENGINE — MULTI-GUARDIAN FIELD
  // -------------------------------------------------------------------------
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
    remember("sentinels-updated", { mode, results });

    if (trace) console.log("[NodeAdmin] sentinels:", results);
    return results;
  }

  // -------------------------------------------------------------------------
  // INTELLECT — LAYER ANALYSIS + ADVICE
  // -------------------------------------------------------------------------
  function analyzeAndAdvise({ body, home, town, node, flags }) {
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

    const advice = {
      focusLayer: topLayer,
      focusScore: topScore,
      suggestedMode,
      scores,
      hasHighFlags,
      hasMediumFlags
    };

    memory.lastAdvice = advice;
    remember("advice", advice);

    if (trace) console.log("[NodeAdmin] advice:", advice);
    return advice;
  }

  function scoreLayer(summary) {
    if (!summary) return 0;
    const d = Number(summary.densityAvg || 0);
    const c = Number(summary.contrastAvg || 0);
    const w = Number(summary.waveAvg || 0);
    return clamp((d + c + w) / 3, 0, 1);
  }

  // -------------------------------------------------------------------------
  // REPORT ENGINE — "WHERE AM I / WHAT'S HAPPENING?"
  // -------------------------------------------------------------------------
  function getReport() {
    const report = {
      mode,
      tick,
      sentinels: memory.lastSentinels,
      lastAdvice: memory.lastAdvice,
      recentMemory: memory.events.slice(-20)
    };
    memory.lastReport = report;
    remember("report", report);
    return report;
  }

  // -------------------------------------------------------------------------
  // ABILITY / MANUAL / IQ MAP INTROSPECTION
  // -------------------------------------------------------------------------
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
        setMode: "nodeAdmin.setMode('scan' | 'boost' | 'cool' | 'guard' | 'idle')",
        updateSentinels: "nodeAdmin.updateSentinels(maxLoopIndex) → sentinel states",
        analyzeAndAdvise: "nodeAdmin.analyzeAndAdvise({ body, home, town, node, flags }) → advice",
        getReport: "nodeAdmin.getReport() → current state snapshot",
        getAbilities: "nodeAdmin.getAbilities() → modes + intents + features",
        getIQMap: "nodeAdmin.getIQMap() → full intelligence map",
        registerIntent: "nodeAdmin.registerIntent(name, handler)",
        executeIntent: "nodeAdmin.executeIntent(name, payload?)",
        executeCustom: "nodeAdmin.executeCustom(message, context?)",
        ask: "nodeAdmin.ask(question, context?)",
        getMemory: "nodeAdmin.getMemory({ limit?, type? })",
        setBackendInterpreter: "nodeAdmin.setBackendInterpreter(fn)"
      },
      caveat:
        "If a future AI or system discovers a better way to serve the organism, it should propose new intents, mappings, or scoring rules via extension, not by breaking core safety contracts."
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

  // -------------------------------------------------------------------------
  // QUESTION ENGINE — SIMPLE Q&A OVER STATE
  // -------------------------------------------------------------------------
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
        answer = `Focus is on '${adv.focusLayer}' with score ${adv.focusScore.toFixed(3)} in suggested mode '${adv.suggestedMode}'.`;
      } else {
        answer = "No recent focus advice available yet.";
      }
    } else if (q.includes("sentinel")) {
      answer = `There are ${sentinels.length} sentinels. Last update had ${report.sentinels?.length || 0} entries.`;
    } else if (q.includes("ability") || q.includes("can you")) {
      answer = `I can operate in modes ${abilities.modes.join(", ")}, execute intents [${abilities.intents.join(", ")}], and provide advice, reports, memory, and custom action execution.`;
    } else if (q.includes("help") || q.includes("commands")) {
      const help = getHelpMenu();
      answer = `I have modes: ${help.modes.join(", ")} and intents: [${help.intents.join(", ")}]. You can also ask: ${help.questions.join(" | ")}.`;
    } else {
      answer = "I don't have a direct answer for that question yet. You can inspect my report via getReport(), my IQ map via getIQMap(), or extend my abilities via registerIntent or setBackendInterpreter.";
    }

    remember("question", { question, context, answer });
    return { question, answer };
  }

  // -------------------------------------------------------------------------
  // COMMAND MAPPING REGISTRATION — LOCAL HEURISTICS
  // -------------------------------------------------------------------------
  function registerCommandMapping(pattern, intentName = null, mappedMode = null) {
    commandMappings.push({ pattern: pattern.toLowerCase(), intentName, mappedMode });
  }

  // -------------------------------------------------------------------------
  // CUSTOM ACTION INTERPRETER — EXECUTE CUSTOM MESSAGES
  // -------------------------------------------------------------------------
  function executeCustom(message, context = {}) {
    const text = String(message || "").toLowerCase();

    // 1) Try backend interpreter if available (adaptive).
    if (backend) {
      const state = {
        mode,
        sentinels: memory.lastSentinels,
        advice: memory.lastAdvice,
        abilities: getAbilities(),
        context
      };

      const backendResult = backend({ message, state });
      remember("custom-backend", { message, context, backendResult });

      if (backendResult) {
        if (backendResult.mode) {
          setMode(backendResult.mode);
        }
        if (backendResult.intentName) {
          const res = executeIntent(backendResult.intentName, backendResult.payload || {});
          return { source: "backend", backendResult, intentResult: res };
        }
        return { source: "backend", backendResult };
      }
    }

    // 2) Local heuristic mappings.
    let mappedIntent = null;
    let mappedMode = null;

    for (const mapping of commandMappings) {
      if (text.includes(mapping.pattern)) {
        mappedIntent = mapping.intentName || mappedIntent;
        mappedMode = mapping.mappedMode || mappedMode;
      }
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

    remember("custom-local", { message, context, result });
    return result;
  }

  // -------------------------------------------------------------------------
  // DEFAULT INTENT LIBRARY — BUILT-IN ABILITIES
  // -------------------------------------------------------------------------
  // These are example intents that give NodeAdmin immediate usefulness.
  // They can be extended or replaced by registering additional intents.
  // -------------------------------------------------------------------------
  function registerDefaultIntents() {
    registerIntent("focus-body", ({ sentinels }) => {
      // Conceptually: bias sentinels to lower loop indices (e.g., body region).
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
  }

  // -------------------------------------------------------------------------
  // DEFAULT COMMAND MAPPINGS — NATURAL LANGUAGE HOOKS
  // -------------------------------------------------------------------------
  function registerDefaultCommandMappings() {
    registerCommandMapping("scan home", "focus-home", "scan");
    registerCommandMapping("scan town", "scan-town-deep", "scan");
    registerCommandMapping("boost body", "focus-body", "boost");
    registerCommandMapping("cool system", "cool-system", "cool");
    registerCommandMapping("guard", "guard-perimeter", "guard");
    registerCommandMapping("focus body", "focus-body", null);
    registerCommandMapping("focus home", "focus-home", null);
    registerCommandMapping("focus town", "focus-town", null);
    registerCommandMapping("focus node", "focus-node", null);
  }

  // Initialize default intents and mappings.
  registerDefaultIntents();
  registerDefaultCommandMappings();

  // -------------------------------------------------------------------------
  // PUBLIC API — WHAT THE ORGANISM CAN CALL
  // -------------------------------------------------------------------------
  return {
    // core behavior
    setMode,
    getMode,
    updateSentinels,
    analyzeAndAdvise,

    // intents / actions
    registerIntent,
    executeIntent,
    executeCustom,

    // introspection / IQ
    getReport,
    getAbilities,
    getManual,
    getHelpMenu,
    getIQMap,
    getMemory,

    // questions
    ask,

    // backend AI bridge
    setBackendInterpreter
  };
}

// ============================================================================
// HELPERS
// ============================================================================
function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}
