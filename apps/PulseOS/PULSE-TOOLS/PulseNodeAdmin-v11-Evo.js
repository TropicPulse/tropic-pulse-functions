// ============================================================================
// FILE: /apps/PulseOS/binary/PulseNodeAdmin-v11-EVO-INTELLECT.js
// PULSE OS — v11-EVO
// NODEADMIN ORGAN — NETWORK BRAIN / SENTINEL COMMAND / INTENT + MEMORY CORTEX
// ============================================================================
// ROLE & VISION:
//   NodeAdmin is the organism’s network brain:
//     - Circling sentinels that patrol, scan, guard, boost, and cool.
//     - Analyzes all layers (body/home/town/node) and flags.
//     - Decides focus, urgency, and mode (idle/scan/boost/cool/guard).
//     - Exposes a command surface: intents, custom actions, questions, reports.
//     - Integrates memory so it can recall what happened and why.
//     - Bridges backend AI so higher-level intelligence can steer it.
//
//   It is the SENTINEL COMMAND BRAIN:
//     - You can ask it where it is, what it sees, what it recommends.
//     - You can push intents and custom messages into it.
//     - It can execute actions and report back.
//     - It can evolve by suggesting better behaviors.
//
// SAFETY CONTRACT:
//   - Deterministic behavior (no randomness).
//   - No recursion, no async drift.
//   - No mutation outside internal state.
//   - Purely synthetic, non-medical.
//   - Backend AI is optional and treated as advisory.
// ============================================================================

export function createPulseNodeAdmin({
  trace = false,
  instances = 3,
  backendInterpreter = null   // optional: fn({ message, state }) => { intentName?, mode?, notes? }
} = {}) {

  // ---------------------------------------------------------------------------
  // INTERNAL STATE
  // ---------------------------------------------------------------------------
  let mode = "idle"; // "idle" | "scan" | "boost" | "cool" | "guard"
  let tick = 0;

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

  // Backend interpreter: optional AI brain behind NodeAdmin.
  let backend = backendInterpreter;

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
  // INTENT SYSTEM (AIS++)
  // ---------------------------------------------------------------------------
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

  // ---------------------------------------------------------------------------
  // BACKEND INTERPRETER HOOK
  // ---------------------------------------------------------------------------
  function setBackendInterpreter(fn) {
    backend = fn;
    remember("backend-set", { hasBackend: !!fn });
  }

  // ---------------------------------------------------------------------------
  // MODE CONTROL
  // ---------------------------------------------------------------------------
  function setMode(nextMode) {
    mode = nextMode;
    remember("mode-change", { mode });
    if (trace) console.log("[NodeAdmin] mode:", mode);
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

  // ---------------------------------------------------------------------------
  // INTELLECT: ANALYZE LAYERS + FLAGS → MODE / FOCUS
  // ---------------------------------------------------------------------------
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

  // ---------------------------------------------------------------------------
  // REPORT ENGINE — WHERE AM I / WHAT’S HAPPENING
  // ---------------------------------------------------------------------------
  function getReport() {
    const report = {
      mode,
      tick,
      sentinels: memory.lastSentinels,
      lastAdvice: memory.lastAdvice,
      memoryEvents: memory.events.slice(-20)
    };
    memory.lastReport = report;
    remember("report", report);
    return report;
  }

  // ---------------------------------------------------------------------------
  // ABILITY / MANUAL INTROSPECTION
  // ---------------------------------------------------------------------------
  function getAbilities() {
    return {
      modes: ["idle", "scan", "boost", "cool", "guard"],
      intents: Object.keys(intentHandlers),
      features: [
        "multi-sentinel circling",
        "mode-based frequency/wavelength modulation",
        "layer scoring + focus selection",
        "advice engine (suggested mode + focus)",
        "intent execution (AIS++)",
        "custom message interpretation",
        "backend AI bridge",
        "memory log + reports"
      ]
    };
  }

  function getManual() {
    return {
      description: "NodeAdmin is the network brain / sentinel command organ.",
      usage: {
        setMode: "nodeAdmin.setMode('scan' | 'boost' | 'cool' | 'guard' | 'idle')",
        updateSentinels: "nodeAdmin.updateSentinels(maxLoopIndex) → sentinel states",
        analyzeAndAdvise: "nodeAdmin.analyzeAndAdvise({ body, home, town, node, flags }) → advice",
        getReport: "nodeAdmin.getReport() → current state snapshot",
        getAbilities: "nodeAdmin.getAbilities() → modes + intents + features",
        registerIntent: "nodeAdmin.registerIntent(name, handler)",
        executeIntent: "nodeAdmin.executeIntent(name, payload?)",
        executeCustom: "nodeAdmin.executeCustom(message, context?)",
        ask: "nodeAdmin.ask(question, context?)",
        getMemory: "nodeAdmin.getMemory({ limit?, type? })",
        setBackendInterpreter: "nodeAdmin.setBackendInterpreter(fn)"
      },
      caveat: "If a future AI or system discovers a better way to serve the organism, it may propose new intents or mode rules. These should be added via registerIntent or by extending analyzeAndAdvise, not by mutating core safety contracts."
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
        answer = `Focus is on '${adv.focusLayer}' with score ${adv.focusScore.toFixed(3)} in mode '${adv.suggestedMode}'.`;
      } else {
        answer = "No recent focus advice available yet.";
      }
    } else if (q.includes("sentinel")) {
      answer = `There are ${sentinels.length} sentinels. Last update had ${report.sentinels?.length || 0} entries.`;
    } else if (q.includes("ability") || q.includes("can you")) {
      answer = `I can operate in modes ${abilities.modes.join(", ")}, execute intents [${abilities.intents.join(", ")}], and provide advice, reports, and custom action execution.`;
    } else {
      answer = "I don't have a direct answer for that question yet, but you can inspect my report via getReport() or extend my abilities via registerIntent or backendInterpreter.";
    }

    remember("question", { question, context, answer });
    return { question, answer };
  }

  // ---------------------------------------------------------------------------
  // CUSTOM ACTION INTERPRETER — EXECUTE CUSTOM MESSAGES
  // ---------------------------------------------------------------------------
  function executeCustom(message, context = {}) {
    const text = String(message || "").toLowerCase();

    // 1) Try backend interpreter if available (adaptive mode).
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

    // 2) Simple local heuristics if no backend or backend gave nothing.
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

  // ---------------------------------------------------------------------------
  // PUBLIC API
  // ---------------------------------------------------------------------------
  return {
    // core
    setMode,
    getMode,
    updateSentinels,
    analyzeAndAdvise,

    // intents / actions
    registerIntent,
    executeIntent,
    executeCustom,

    // introspection
    getReport,
    getAbilities,
    getManual,
    getMemory,

    // questions
    ask,

    // backend AI bridge
    setBackendInterpreter
  };
}

// -----------------------------------------------------------------------------
// HELPERS
// -----------------------------------------------------------------------------
function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}
