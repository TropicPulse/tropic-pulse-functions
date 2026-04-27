// ============================================================================
// FILE: /apps/PulseOS/PULSE-TOOLS/PulseNodeAdmin-v11-EVO-INTELLECT.js
// PULSE OS — v11-EVO
// NODEADMIN ORGAN — NETWORK BRAIN / SENTINEL COMMAND / INTENT + MEMORY CORTEX
// OVERMIND-READY • DETERMINISTIC • SYNTHETIC-ONLY
// ============================================================================

export const NodeAdminMeta = Object.freeze({
  organId: "PulseNodeAdmin-v11-EVO",
  role: "NODEADMIN_ORGAN",
  version: "11.0-EVO",
  epoch: "v11-EVO",
  layer: "NetworkBrain",
  safety: Object.freeze({
    deterministic: true,
    noRandomness: true,
    noRecursion: true,
    noAsyncDrift: true,
    syntheticOnly: true,
    backendAdvisoryOnly: true
  }),
  contract: Object.freeze({
    purpose:
      "Network brain / sentinel command organ for Pulse nodes. Scores layers, selects focus, sets mode, executes intents, and exposes reports.",
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
      "allow extension via intents, not core mutation"
    ])
  })
});

// ============================================================================
// FACTORY: createPulseNodeAdmin — v11‑EVO
// ============================================================================

export function createPulseNodeAdmin({
  trace = false,
  instances = 3,
  backendInterpreter = null, // optional: fn({ message, state }) => { intentName?, mode?, notes? }
  overmindBridge = null      // optional: { emit?, pullDirectives? }
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
  const intentHandlers = Object.create(null);

  // Backend interpreter: optional AI brain behind NodeAdmin.
  let backend = backendInterpreter;

  // Overmind bridge: optional meta-controller.
  let overmind = overmindBridge;

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
    emitToOvermind("intent-registered", { name });
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
  // OVERMIND BRIDGE
  // ---------------------------------------------------------------------------
  function attachOvermindBridge(bridge) {
    overmind = bridge || null;
    const evt = remember("overmind-bridge-set", { hasBridge: !!bridge });
    emitToOvermind("overmind-bridge-set", evt);
  }

  function emitToOvermind(eventType, payload) {
    if (!overmind || typeof overmind.emit !== "function") return;
    // Overmind decides what to do; NodeAdmin stays deterministic.
    overmind.emit({
      organId: NodeAdminMeta.organId,
      eventType,
      payload,
      snapshot: getStateSnapshot()
    });
  }

  function applyDirective(directive) {
    // Deterministic, bounded: no recursion, no async, no external I/O.
    if (!directive || typeof directive !== "object") return { ok: false, reason: "invalid-directive" };

    const { mode: nextMode, intentName, intentPayload } = directive;
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
    const evt = remember("advice", advice);

    if (trace) console.log("[NodeAdmin] advice:", advice);
    emitToOvermind("advice", evt);
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
      organId: NodeAdminMeta.organId,
      mode,
      tick,
      sentinels: memory.lastSentinels,
      lastAdvice: memory.lastAdvice,
      memoryEvents: memory.events.slice(-20)
    };
    memory.lastReport = report;
    const evt = remember("report", report);
    emitToOvermind("report", evt);
    return report;
  }

  // Compact snapshot for Overmind / other organs.
  function getStateSnapshot() {
    return Object.freeze({
      organId: NodeAdminMeta.organId,
      mode,
      tick,
      sentinelCount: sentinels.length,
      lastAdvice: memory.lastAdvice,
      lastSentinels: memory.lastSentinels
    });
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
        "memory log + reports",
        "Overmind directive bridge",
        "state snapshot export"
      ]
    };
  }

  function getManual() {
    return {
      meta: NodeAdminMeta,
      description: "NodeAdmin is the network brain / sentinel command organ.",
      usage: {
        setMode: "nodeAdmin.setMode('scan' | 'boost' | 'cool' | 'guard' | 'idle')",
        updateSentinels: "nodeAdmin.updateSentinels(maxLoopIndex) → sentinel states",
        analyzeAndAdvise: "nodeAdmin.analyzeAndAdvise({ body, home, town, node, flags }) → advice",
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
        applyDirective: "nodeAdmin.applyDirective({ mode?, intentName?, intentPayload? })"
      },
      caveat:
        "If a future AI or system discovers a better way to serve the organism, it may propose new intents or mode rules. These should be added via registerIntent, applyDirective, or by extending analyzeAndAdvise, not by mutating core safety contracts."
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
        )} in mode '${adv.suggestedMode}'.`;
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
      )}], and provide advice, reports, and custom action execution.`;
    } else {
      answer =
        "I don't have a direct answer for that question yet, but you can inspect my report via getReport() or extend my abilities via registerIntent, applyDirective, or backendInterpreter.";
    }

    const evt = remember("question", { question, context, answer });
    emitToOvermind("question", evt);
    return { question, answer };
  }

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

  // inside createPulseNodeAdmin(...)
  function attachBeaconEngine(beacon) {
    beaconEngine = beacon;

    // NodeAdmin → BeaconEngine intent bridge
    nodeAdmin.registerIntent("beacon-control", ({ payload }) => {
      return beaconEngine.handleNodeAdminIntent(payload.intentName, payload);
    });

    // BeaconEngine → NodeAdmin event bridge
    beaconEngine.attachNodeAdminBridge({
      onBeaconEvent: (evt) => {
        remember("beacon-event", evt);
      }
    });

    return { ok: true };
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

    const evt = remember("custom-local", { message, context, result });
    emitToOvermind("custom-local", evt);
    return result;
  }

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
    attachOvermindBridge
  };
}

// -----------------------------------------------------------------------------
// HELPERS
// -----------------------------------------------------------------------------
function clamp(v, min, max) {
  return Math.max(min, Math.min(max, v));
}
