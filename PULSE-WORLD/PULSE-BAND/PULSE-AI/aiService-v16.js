// ============================================================================
//  PULSE OS v16‑IMMORTAL‑ADV++ — AI SERVICE GATEWAY ORGAN
//  Universal Dual‑Band Entry Point • Safe Relay • Deterministic Execution
//  PURE RELAY. ZERO MUTATION. ZERO RANDOMNESS. ZERO DRIFT.
//  ORGANISM‑AWARE • ARTERY v5 • OWNER‑SUBORDINATE
// ============================================================================

/*
AI_EXPERIENCE_META = {
  identity: "aiService",
  version: "v16-Immortal-Adv++",
  layer: "ai_tools",
  role: "service_surface",
  lineage: "aiService-v10 → v12.3-Evo+ → v16-Immortal-Adv++",

  evo: {
    serviceSurface: true,
    taskMapping: true,
    symbolicPrimary: true,
    binaryAware: true,
    dualBand: true,

    deterministic: true,
    driftProof: true,
    pureCompute: true,
    zeroNetwork: true,
    zeroFilesystem: true,
    zeroMutationOfInput: true,

    arteryV5: true,
    organismAware: true,
    heartbeatAware: true,
    earnAware: true,
    genomeAware: true,
    governorAware: true,
    watchdogAware: true,
    cortexAware: true,
    memoryAware: true,
    safetyAware: true,

    routerAware: true,
    overmindAware: true,
    nodeAdminAware: true,
    slowdownAware: true,
    driftAware: true,
    schemaAware: true,
    tourismAware: true
  },

  contract: {
    always: ["aiAssistant", "aiContext", "aiCortex"],
    never: ["safeRoute", "fetchViaCNS"]
  }
}
*/

export const ServiceGatewayMeta = Object.freeze({
  layer: "PulseAIServiceGateway",
  role: "SERVICE_GATEWAY_ORGAN",
  version: "16-Immortal-Adv++",
  identity: "aiServiceGateway-v16-Immortal-Adv++",

  evo: Object.freeze({
    driftProof: true,
    deterministic: true,
    dualband: true,
    binaryAware: true,
    symbolicAware: true,
    relayOnly: true,
    analysisAware: true,
    schemaAware: true,
    lineageAware: true,
    slowdownAware: true,
    tourismAware: true,
    permissionAware: true,
    routerAware: true,
    overmindAware: true,
    nodeAdminAware: true,

    // organism vitals
    organismAware: true,
    heartbeatAware: true,
    earnAware: true,
    genomeAware: true,
    governorAware: true,
    watchdogAware: true,
    cortexAware: true,
    memoryAware: true,
    safetyAware: true,

    // arteries
    arteryAware: true,
    arteryV5: true,

    readOnly: true,
    multiInstanceReady: true,
    epoch: "16-Immortal-Adv++"
  }),

  contract: Object.freeze({
    purpose: [
      "Provide a deterministic, dual-band-safe relay for analysis, audit, schema validation, drift detection, slowdown detection, route/log/error analysis, and tourism queries.",
      "Fuse organism vitals into relay artery v5 for NodeAdmin/Overmind/Earn awareness.",
      "Surface soft spiral warnings when relay pressure or error rate becomes critical (non-blocking)."
    ],

    never: Object.freeze([
      "mutate context",
      "mutate data",
      "override router decisions",
      "override cortex decisions",
      "override safety frame decisions",
      "introduce randomness",
      "perform cognition",
      "perform intent logic",
      "perform writes",
      "perform deletes",
      "perform updates"
    ]),

    always: Object.freeze([
      "relay operations through runAI",
      "freeze all inputs",
      "freeze all outputs",
      "respect dual-band boundaries",
      "respect persona + permissions",
      "log deterministic steps",
      "return unified response packets",
      "compute relay artery metrics deterministically",
      "remain non-blocking and drift-proof"
    ])
  })
});

// ============================================================================
//  IMPORTS — Binary Engine + Tools
// ============================================================================

import { runAI } from "./aiEngine-v11-Evo.js";
import {
  analyzeFirestoreDoc,
  analyzeSQLSchema,
  detectDrift,
  detectSlowdownPatterns,
  validatePulseSchema
} from "./aiTools.js";

// ============================================================================
//  GLOBAL RELAY ARTERY REGISTRY — v16 IMMORTAL‑ADV++
// ============================================================================

const _globalRelayArteryRegistry = new Map();
/**
 * Registry key: `${id}#${instanceIndex}`
 */
function _registryKey(id, instanceIndex) {
  return `${id || ServiceGatewayMeta.identity}#${instanceIndex}`;
}

export function getGlobalRelayArteries() {
  const out = {};
  for (const [k, v] of _globalRelayArteryRegistry.entries()) {
    out[k] = v;
  }
  return out;
}

// ============================================================================
//  RELAY ARTERY HELPERS — v5
// ============================================================================

function relayBucketLevel(v) {
  if (v >= 0.9) return "elite";
  if (v >= 0.75) return "high";
  if (v >= 0.5) return "medium";
  if (v >= 0.25) return "low";
  return "critical";
}

function relayBucketPressure(v) {
  if (v >= 0.9) return "overload";
  if (v >= 0.7) return "high";
  if (v >= 0.4) return "medium";
  if (v > 0) return "low";
  return "none";
}

function relayBucketCost(v) {
  if (v >= 0.8) return "heavy";
  if (v >= 0.5) return "moderate";
  if (v >= 0.2) return "light";
  if (v > 0) return "negligible";
  return "none";
}

function clamp01(v) {
  const n = typeof v === "number" ? v : 0;
  if (n <= 0) return 0;
  if (n >= 1) return 1;
  return n;
}

// ============================================================================
//  RELAY ARTERY v5 — Organism‑Aware Fusion
// ============================================================================

function computeRelayArteryV5({
  calls,
  errors,
  slowCalls,
  windowMs,
  instanceIndex,
  instanceCount,
  heartbeat,
  earn,
  genome,
  governor,
  watchdog,
  cortex,
  memory,
  safety
}) {
  const total = calls.total;
  const window = calls.window;
  const errorRate = window > 0 ? clamp01(errors.window / window) : 0;
  const slowRate = window > 0 ? clamp01(slowCalls.window / window) : 0;

  const callsPerMs = window / Math.max(1, calls.elapsedMs);
  const callsPerSec = callsPerMs * 1000;

  const harmonicLoad =
    instanceCount > 0 ? callsPerSec / instanceCount : callsPerSec;

  const loadFactor = clamp01(harmonicLoad / 128);

  const heartbeatPressure = clamp01(heartbeat?.pressure ?? 0);
  const earnPressure = clamp01(earn?.pressure ?? 0);
  const genomePressure = clamp01(genome?.pressure ?? 0);
  const governorPressure = clamp01(governor?.pressure ?? 0);
  const watchdogPressure = clamp01(watchdog?.pressure ?? 0);
  const cortexPressure = clamp01(cortex?.pressure ?? 0);
  const memoryPressure = clamp01(memory?.pressure ?? 0);
  const safetyPressure = clamp01(safety?.pressure ?? 0);

  const organismPressure =
    (heartbeatPressure +
      earnPressure +
      genomePressure +
      governorPressure +
      watchdogPressure +
      cortexPressure +
      memoryPressure +
      safetyPressure) / 8;

  const pressure = clamp01(
    loadFactor * 0.4 +
      errorRate * 0.2 +
      slowRate * 0.2 +
      organismPressure * 0.2
  );

  const throughput = clamp01(1 - pressure);
  const cost = clamp01(pressure * (1 - throughput));
  const budget = clamp01(throughput - cost);

  return Object.freeze({
    instanceIndex,
    instanceCount,
    windowMs,

    calls: {
      total,
      window,
      callsPerSec,
      harmonicLoad
    },

    errors: {
      total: errors.total,
      window: errors.window,
      errorRate
    },

    slow: {
      window: slowCalls.window,
      slowRate
    },

    organism: {
      heartbeat,
      earn,
      genome,
      governor,
      watchdog,
      cortex,
      memory,
      safety
    },

    throughput,
    pressure,
    cost,
    budget,

    throughputBucket: relayBucketLevel(throughput),
    pressureBucket: relayBucketPressure(pressure),
    costBucket: relayBucketCost(cost),
    budgetBucket: relayBucketLevel(budget)
  });
}

// ============================================================================
//  SERVICE GATEWAY CORE — v16‑IMMORTAL‑ADV++
// ============================================================================

class AiServiceGatewayCore {
  /**
   * CONFIG INTENT:
   *   id, trace, scribe
   *   windowMs, slowThresholdMs
   *
   *   vitals providers (optional, read-only):
   *     heartbeatProvider  → () => { pressure?: number, ... }
   *     earnProvider       → () => { pressure?: number, ... }
   *     genomeProvider     → () => { pressure?: number, ... }
   *     governorProvider   → () => { pressure?: number, ... }
   *     watchdogProvider   → () => { pressure?: number, ... }
   *     cortexProvider     → () => { pressure?: number, ... }
   *     memoryProvider     → () => { pressure?: number, ... }
   *     safetyProvider     → () => { pressure?: number, ... }
   */
  constructor(config = {}) {
    this.id = config.id || "ai-service-gateway-v16";
    this.trace = !!config.trace;
    this.scribe = config.scribe || null;

    this.windowMs =
      typeof config.windowMs === "number" && config.windowMs > 0
        ? config.windowMs
        : 60000;

    this._windowStart = Date.now();
    this._windowCalls = 0;
    this._windowErrors = 0;
    this._windowSlowCalls = 0;
    this._totalCalls = 0;
    this._totalErrors = 0;

    this._slowThresholdMs =
      typeof config.slowThresholdMs === "number" && config.slowThresholdMs > 0
        ? config.slowThresholdMs
        : 1500;

    this.instanceIndex = AiServiceGatewayCore._registerInstance();

    // organism vitals providers (read-only)
    this.heartbeatProvider = config.heartbeatProvider || null;
    this.earnProvider = config.earnProvider || null;
    this.genomeProvider = config.genomeProvider || null;
    this.governorProvider = config.governorProvider || null;
    this.watchdogProvider = config.watchdogProvider || null;
    this.cortexProvider = config.cortexProvider || null;
    this.memoryProvider = config.memoryProvider || null;
    this.safetyProvider = config.safetyProvider || null;
  }

  // ---------------------------------------------------------
  //  STATIC INSTANCE REGISTRY
  // ---------------------------------------------------------

  static _registerInstance() {
    if (typeof AiServiceGatewayCore._instanceCount !== "number") {
      AiServiceGatewayCore._instanceCount = 0;
    }
    const index = AiServiceGatewayCore._instanceCount;
    AiServiceGatewayCore._instanceCount += 1;
    return index;
  }

  static getInstanceCount() {
    return typeof AiServiceGatewayCore._instanceCount === "number"
      ? AiServiceGatewayCore._instanceCount
      : 0;
  }

  // ---------------------------------------------------------
  //  WINDOW ROLLING
  // ---------------------------------------------------------

  _rollWindow(now) {
    if (now - this._windowStart >= this.windowMs) {
      this._windowStart = now;
      this._windowCalls = 0;
      this._windowErrors = 0;
      this._windowSlowCalls = 0;
    }
  }

  // ---------------------------------------------------------
  //  VITALS READERS (SAFE, READ‑ONLY)
// ---------------------------------------------------------

  _readVitals(provider) {
    if (!provider) return null;
    try {
      return provider() || null;
    } catch {
      return null;
    }
  }

  // ---------------------------------------------------------
  //  RELAY ARTERY SNAPSHOT
  // ---------------------------------------------------------

  _computeRelayArtery() {
    const now = Date.now();
    this._rollWindow(now);

    const elapsedMs = Math.max(1, now - this._windowStart);

    const artery = computeRelayArteryV5({
      calls: {
        total: this._totalCalls,
        window: this._windowCalls,
        elapsedMs
      },
      errors: {
        total: this._totalErrors,
        window: this._windowErrors
      },
      slowCalls: {
        window: this._windowSlowCalls
      },
      windowMs: this.windowMs,
      instanceIndex: this.instanceIndex,
      instanceCount: AiServiceGatewayCore.getInstanceCount(),

      heartbeat: this._readVitals(this.heartbeatProvider),
      earn: this._readVitals(this.earnProvider),
      genome: this._readVitals(this.genomeProvider),
      governor: this._readVitals(this.governorProvider),
      watchdog: this._readVitals(this.watchdogProvider),
      cortex: this._readVitals(this.cortexProvider),
      memory: this._readVitals(this.memoryProvider),
      safety: this._readVitals(this.safetyProvider)
    });

    const key = _registryKey(this.id, this.instanceIndex);
    _globalRelayArteryRegistry.set(key, artery);

    return artery;
  }

  getRelayArtery() {
    return this._computeRelayArtery();
  }

  // ---------------------------------------------------------
  //  RELAY WRAPPER (NON-BLOCKING, MONITORED)
// ---------------------------------------------------------

  async relay(intent, flags, operation, request = {}, dualBand = null) {
    const start = Date.now();

    try {
      const result = await runAI(
        Object.freeze({
          ...request,
          intent,
          ...flags
        }),
        operation,
        request.deps || {},
        dualBand
      );

      const duration = Date.now() - start;

      this._recordCall(duration, false);
      const artery = this._computeRelayArtery();

      if (
        artery.pressureBucket === "overload" ||
        artery.budgetBucket === "critical"
      ) {
        this._logSpiralWarning(intent, flags, artery);
      }

      this._trace("relay:success", {
        intent,
        flags,
        durationMs: duration,
        artery
      });

      return result;
    } catch (e) {
      const duration = Date.now() - start;

      this._recordCall(duration, true);
      const artery = this._computeRelayArtery();

      this._trace("relay:error", {
        intent,
        flags,
        durationMs: duration,
        error: String(e && e.message ? e.message : e),
        artery
      });

      if (
        artery.pressureBucket === "overload" ||
        artery.budgetBucket === "critical"
      ) {
        this._logSpiralWarning(intent, flags, artery, true);
      }

      throw e;
    }
  }

  _recordCall(durationMs, isError) {
    const now = Date.now();
    this._rollWindow(now);

    this._totalCalls += 1;
    this._windowCalls += 1;

    if (isError) {
      this._totalErrors += 1;
      this._windowErrors += 1;
    }

    if (durationMs >= this._slowThresholdMs) {
      this._windowSlowCalls += 1;
    }
  }

  _logSpiralWarning(intent, flags, artery, isError = false) {
    const payload = {
      intent,
      flags,
      isError,
      artery
    };

    this._trace("relay:spiral-warning", payload);

    try {
      this.scribe?.logSafety?.({
        type: "relay-spiral-warning",
        severity: "warn",
        payload
      });
    } catch {
      // best-effort only
    }
  }

  _trace(event, payload) {
    if (!this.trace) return;
    console.log(`[${this.id}#${this.instanceIndex}] ${event}`, payload);
  }
}

// ============================================================================
//  INTERNAL GATEWAY INSTANCE — v16‑IMMORTAL‑ADV++
// ============================================================================

const _gatewayCore = new AiServiceGatewayCore({ trace: false });

function callAI(intent, flags, operation, request = {}, dualBand = null) {
  return _gatewayCore.relay(intent, flags, operation, request, dualBand);
}

// ============================================================================
//  PUBLIC SERVICE OPERATIONS — API‑COMPATIBLE, INTERNALLY UPGRADED
// ============================================================================

export async function runAnalyzeFirestore(
  docData,
  request = {},
  dualBand = null
) {
  return callAI(
    "analyze",
    Object.freeze({ touchesSchemas: true }),
    async (context) => {
      const pulseSchema = analyzeFirestoreDoc(context, docData);
      detectSlowdownPatterns(context, docData);
      return pulseSchema;
    },
    request,
    dualBand
  );
}

export async function runAnalyzeSQL(sqlSchema, request = {}, dualBand = null) {
  return callAI(
    "analyze",
    Object.freeze({ touchesSchemas: true }),
    async (context) => {
      const pulseSchema = analyzeSQLSchema(context, sqlSchema);
      detectSlowdownPatterns(context, sqlSchema);
      return pulseSchema;
    },
    request,
    dualBand
  );
}

export async function runDetectDrift(
  pulseSchema,
  firestoreSchema,
  request = {},
  dualBand = null
) {
  return callAI(
    "analyze",
    Object.freeze({ touchesSchemas: true }),
    async (context) => {
      const drift = detectDrift(context, pulseSchema, firestoreSchema);
      return Object.freeze({ drift });
    },
    request,
    dualBand
  );
}

export async function runValidatePulse(
  pulseSchema,
  request = {},
  dualBand = null
) {
  return callAI(
    "analyze",
    Object.freeze({ touchesSchemas: true }),
    async (context) => {
      validatePulseSchema(context, pulseSchema);
      return Object.freeze({
        valid: context.diagnostics.mismatches.length === 0
      });
    },
    request,
    dualBand
  );
}

export async function runFullAudit(
  pulseSchema,
  firestoreDoc,
  request = {},
  dualBand = null
) {
  return callAI(
    "analyze",
    Object.freeze({ touchesSchemas: true }),
    async (context) => {
      context.logStep?.("Starting full audit...");

      const fsPulse = analyzeFirestoreDoc(context, firestoreDoc);
      validatePulseSchema(context, pulseSchema);
      detectDrift(context, pulseSchema, fsPulse);
      detectSlowdownPatterns(context, firestoreDoc);

      context.logStep?.("Full audit completed.");

      return Object.freeze({
        pulseFromFirestore: fsPulse,
        driftDetected: context.diagnostics.driftDetected,
        mismatches: context.diagnostics.mismatches,
        missingFields: context.diagnostics.missingFields,
        slowdownCauses: context.diagnostics.slowdownCauses
      });
    },
    request,
    dualBand
  );
}

export async function runAnalyzeRoutes(
  routeData,
  request = {},
  dualBand = null
) {
  return callAI(
    "analyze",
    Object.freeze({ touchesRoutes: true }),
    async (context) => {
      context.logStep?.("Analyzing routing decisions...");
      return Object.freeze({ routeData });
    },
    request,
    dualBand
  );
}

export async function runAnalyzeLogs(logs, request = {}, dualBand = null) {
  return callAI(
    "analyze",
    Object.freeze({ touchesLogs: true }),
    async (context) => {
      context.logStep?.("Analyzing logs...");
      return Object.freeze({ logs });
    },
    request,
    dualBand
  );
}

export async function runAnalyzeErrors(
  errors,
  request = {},
  dualBand = null
) {
  return callAI(
    "analyze",
    Object.freeze({ touchesErrors: true }),
    async (context) => {
      context.logStep?.("Analyzing errors...");
      return Object.freeze({ errors });
    },
    request,
    dualBand
  );
}

export async function runExplainOrgan(
  organMeta,
  request = {},
  dualBand = null
) {
  return callAI(
    "explain",
    Object.freeze({ touchesArchitecture: true }),
    async (context) => {
      context.logStep?.("Explaining organ...");
      return Object.freeze({ organMeta });
    },
    request,
    dualBand
  );
}

export async function runExplainPathway(
  pathway,
  request = {},
  dualBand = null
) {
  return callAI(
    "explain",
    Object.freeze({ touchesArchitecture: true }),
    async (context) => {
      context.logStep?.("Explaining pathway...");
      return Object.freeze({ pathway });
    },
    request,
    dualBand
  );
}

export async function runTourGuideQuery(
  query,
  request = {},
  dualBand = null
) {
  return callAI(
    "analyze",
    Object.freeze({ touchesTourism: true }),
    async (context) => {
      context.logStep?.("Running tour guide query...");
      return Object.freeze({ query });
    },
    request,
    dualBand
  );
}

// ============================================================================
//  DUAL‑MODE EXPORTS (ESM + CommonJS)
// ============================================================================

if (typeof module !== "undefined") {
  module.exports = {
    ServiceGatewayMeta,
    getGlobalRelayArteries,
    runAnalyzeFirestore,
    runAnalyzeSQL,
    runDetectDrift,
    runValidatePulse,
    runFullAudit,
    runAnalyzeRoutes,
    runAnalyzeLogs,
    runAnalyzeErrors,
    runExplainOrgan,
    runExplainPathway,
    runTourGuideQuery
  };
}
