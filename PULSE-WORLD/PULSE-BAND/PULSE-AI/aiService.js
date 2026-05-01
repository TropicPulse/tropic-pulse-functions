// ============================================================================
//  PULSE OS v12.3‑EVO+ — AI SERVICE GATEWAY ORGAN
//  Dual‑Band Entry Point • Safe Relay • Deterministic Execution
//  PURE RELAY. ZERO MUTATION. ZERO RANDOMNESS. HARMONIC, MONITORED LOAD.
// ============================================================================
export const ServiceGatewayMeta = Object.freeze({
  layer: "PulseAIServiceGateway",
  role: "SERVICE_GATEWAY_ORGAN",
  version: "12.3-EVO+",
  identity: "aiServiceGateway-v12.3-EVO+",

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
    readOnly: true,
    multiInstanceReady: true,
    epoch: "12.3-EVO+"
  }),

  contract: Object.freeze({
    purpose: [
      "Provide a deterministic, dual-band-safe relay for analysis, audit, schema validation, drift detection, slowdown detection, route/log/error analysis, and tourism queries.",
      "Expose relay artery metrics (throughput, pressure, cost, budget) for organism-level awareness.",
      "Surface soft spiral warnings when relay pressure or error rate becomes critical (non-blocking)."
    ],

    never: Object.freeze([
      "mutate context",
      "mutate data",
      "override router decisions",
      "override cortex decisions",
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

import { runAI } from "./aiEngine-v11-Evo.js";
import {
  analyzeFirestoreDoc,
  analyzeSQLSchema,
  detectDrift,
  detectSlowdownPatterns,
  validatePulseSchema
} from "./aiTools.js";

// ============================================================================
//  RELAY ARTERY HELPERS — v3 (PURE, STATELESS)
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

// ============================================================================
//  SERVICE GATEWAY CORE — v12.3‑EVO+
// ============================================================================

class AiServiceGatewayCore {
  constructor(config = {}) {
    this.id = config.id || "ai-service-gateway";
    this.trace = !!config.trace;
    this.scribe = config.scribe || null;

    // rolling window for relay artery
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

    // multi-instance identity
    this.instanceIndex = AiServiceGatewayCore._registerInstance();
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
  //  RELAY ARTERY SNAPSHOT
  // ---------------------------------------------------------

  _computeRelayArtery() {
    const now = Date.now();
    this._rollWindow(now);

    const elapsedMs = Math.max(1, now - this._windowStart);
    const callsPerMs = this._windowCalls / elapsedMs;
    const callsPerSec = callsPerMs * 1000;

    const instanceCount = AiServiceGatewayCore.getInstanceCount();
    const harmonicLoad =
      instanceCount > 0 ? callsPerSec / instanceCount : callsPerSec;

    const errorRate =
      this._windowCalls > 0
        ? Math.min(1, this._windowErrors / this._windowCalls)
        : 0;

    const slowRate =
      this._windowCalls > 0
        ? Math.min(1, this._windowSlowCalls / this._windowCalls)
        : 0;

    const loadFactor = Math.min(1, harmonicLoad / 128);
    const pressureBase = Math.max(
      0,
      Math.min(1, (loadFactor + errorRate + slowRate) / 3)
    );
    const pressure = pressureBase;

    const throughputBase = Math.max(0, 1 - pressure);
    const throughput = Math.max(0, Math.min(1, throughputBase));

    const cost = Math.max(0, Math.min(1, pressure * (1 - throughput)));
    const budget = Math.max(0, Math.min(1, throughput - cost));

    const artery = {
      instanceIndex: this.instanceIndex,
      instanceCount,

      windowMs: this.windowMs,
      windowCalls: this._windowCalls,
      windowErrors: this._windowErrors,
      windowSlowCalls: this._windowSlowCalls,
      totalCalls: this._totalCalls,
      totalErrors: this._totalErrors,
      callsPerSec,
      harmonicLoad,
      errorRate,
      slowRate,

      throughput,
      pressure,
      cost,
      budget,

      throughputBucket: relayBucketLevel(throughput),
      pressureBucket: relayBucketPressure(pressure),
      costBucket: relayBucketCost(cost),
      budgetBucket: relayBucketLevel(budget)
    };

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
    let error = null;

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

      const end = Date.now();
      const duration = end - start;

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
      const end = Date.now();
      const duration = end - start;
      error = e;

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

// ---------------------------------------------------------------------------
// INTERNAL — Deterministic Relay Wrapper (v12.3‑EVO+)
// ---------------------------------------------------------------------------
const _gatewayCore = new AiServiceGatewayCore({ trace: false });

function callAI(intent, flags, operation, request = {}, dualBand = null) {
  return _gatewayCore.relay(intent, flags, operation, request, dualBand);
}

// ============================================================================
// FIRESTORE ANALYSIS — Dual‑Band Gateway
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

// ============================================================================
// SQL ANALYSIS — Dual‑Band Gateway
// ============================================================================
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

// ============================================================================
// DRIFT DETECTION — Dual‑Band Gateway
// ============================================================================
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

// ============================================================================
// PULSE SCHEMA VALIDATION — Dual‑Band Gateway
// ============================================================================
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

// ============================================================================
// FULL AUDIT — Dual‑Band Gateway
// ============================================================================
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

// ============================================================================
// ROUTE ANALYSIS — Dual‑Band Gateway
// ============================================================================
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

// ============================================================================
// LOG ANALYSIS — Dual‑Band Gateway
// ============================================================================
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

// ============================================================================
// ERROR ANALYSIS — Dual‑Band Gateway
// ============================================================================
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

// ============================================================================
// ARCHITECTURE EXPLANATION — Dual‑Band Gateway
// ============================================================================
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

// ============================================================================
// TOUR GUIDE — Dual‑Band Gateway
// ============================================================================
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
// DUAL‑MODE EXPORTS (ESM + CommonJS)
// ============================================================================
if (typeof module !== "undefined") {
  module.exports = {
    ServiceGatewayMeta,
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
