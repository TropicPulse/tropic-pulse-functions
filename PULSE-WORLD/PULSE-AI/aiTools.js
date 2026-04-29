// ============================================================================
//  PULSE OS v12.3‑EVO+ — THE INSTRUMENTS
//  Cognitive Analysis Organ • Diagnostic Tools • Evolutionary Sensors
//  PURE ANALYSIS. ZERO MUTATION. ZERO TIME. ZERO RANDOMNESS.
// ============================================================================
//
// ROLE (v12.3‑EVO+):
//   The INSTRUMENTS organ provides:
//     • Schema analysis
//     • Drift detection
//     • Slowdown detection
//     • Route/log/error analysis
//     • Evolutionary pattern detection
//     • Binary → Pulse translation
//
//   These tools are PURE ANALYSIS ONLY.
//   They NEVER mutate data, NEVER modify external systems,
//   NEVER introduce randomness, and NEVER override Router/Cortex decisions.
//
// ARCHITECTURE (v12.3‑EVO+):
//   INSTRUMENTS = Cognitive Analysis Organ
//     → Reads data
//     → Translates to PulseFields
//     → Validates schema
//     → Detects drift + slowdown
//     → Reports diagnostics
//     → Feeds Cortex, Router, Evolution, Brain
//
// EVOLUTION POLICY:
//   • INSTRUMENTS contains ONLY analysis logic.
//   • NO cognitive logic lives here.
//   • NO intent logic lives here.
//   • NO assistant logic lives here.
//   • NO API logic lives here.
//   • ALL cognition lives in aiTools.js.
//   • INSTRUMENTS is imported BY aiTools.js.
//
// SECURITY POLICY (v12.3‑EVO+):
//   • This file contains NO secure logic.
//   • Secure CNS logic belongs ONLY in Brainstem.
//   • This file must remain pure, deterministic, and read‑only.
//
// CONTRACT:
//   • ZERO randomness.
//   • ZERO mutation.
//   • ZERO side effects.
//   • ZERO identity leakage.
//   • PURE deterministic analysis.
// ============================================================================

export const AI_INSTRUMENTS_META = Object.freeze({
  type: "Cognitive",
  subsystem: "aiInstruments",
  layer: "PulseAIInstruments",
  role: "INSTRUMENTS_ORGAN",
  version: "12.3-EVO+",
  identity: "aiInstruments-v12.3-EVO+",
  target: "full-mesh",

  evo: Object.freeze({
    driftProof: true,
    deterministic: true,
    dualband: true,
    dualbandSafe: true,
    binaryAware: true,
    symbolicAware: true,
    schemaAware: true,
    lineageAware: true,
    patternAware: true,
    advantageAware: true,
    evolutionAware: true,
    observerOnly: true,
    readOnly: true,
    mutationSafe: true,
    architectAware: true,
    multiInstanceReady: true,
    arteryAware: true,
    epoch: "v12.3-EVO+"
  }),

  contract: Object.freeze({
    purpose:
      "Provide PURE deterministic analysis for schemas, drift, slowdown, routes, logs, errors, and evolutionary patterns.",
    never: Object.freeze([
      "mutate data",
      "modify external systems",
      "introduce randomness",
      "override router decisions",
      "override cortex decisions",
      "perform cognition",
      "perform intent handling",
      "leak identity anchors"
    ]),
    always: Object.freeze([
      "analyze schemas",
      "detect drift",
      "detect slowdown",
      "analyze routes",
      "analyze logs",
      "analyze errors",
      "detect evolutionary patterns",
      "translate binary/symbolic → PulseFields",
      "remain read‑only",
      "remain deterministic",
      "report diagnostics only"
    ])
  }),

  boundaryReflex() {
    return "INSTRUMENTS is read‑only, deterministic, and analysis‑only — never mutating, never random, never overriding CNS decisions.";
  }
});

// ============================================================================
// SECTION 1 — IMPORTS
// ============================================================================
import { translateFirestoreDocument } from "../PULSE-translator/firestoreToPulse.js";
import { translateSQLSchema } from "../PULSE-translator/sqlToPulse.js";
import { validatePulseField } from "../PULSE-SPECS/pulseFields.js";

// ============================================================================
// SECTION 2 — ANALYSIS ARTERY v3 (PURE, STATELESS, PER‑PROCESS)
// ============================================================================

const _INSTRUMENTS_ARTERY = {
  windowMs: 60000,
  windowStart: Date.now(),
  windowAnalyses: 0,
  windowHeavyAnalyses: 0,
  totalAnalyses: 0,
  totalHeavyAnalyses: 0,
  instanceCount: 0
};

function _registerInstrumentsInstance() {
  const index = _INSTRUMENTS_ARTERY.instanceCount;
  _INSTRUMENTS_ARTERY.instanceCount += 1;
  return index;
}

export const AI_INSTRUMENTS_INSTANCE_INDEX = _registerInstrumentsInstance();

function _rollInstrumentsWindow(now) {
  if (now - _INSTRUMENTS_ARTERY.windowStart >= _INSTRUMENTS_ARTERY.windowMs) {
    _INSTRUMENTS_ARTERY.windowStart = now;
    _INSTRUMENTS_ARTERY.windowAnalyses = 0;
    _INSTRUMENTS_ARTERY.windowHeavyAnalyses = 0;
  }
}

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

function _computeInstrumentsArtery() {
  const now = Date.now();
  _rollInstrumentsWindow(now);

  const elapsedMs = Math.max(1, now - _INSTRUMENTS_ARTERY.windowStart);
  const analysesPerSec =
    (_INSTRUMENTS_ARTERY.windowAnalyses / elapsedMs) * 1000;

  const instanceCount = _INSTRUMENTS_ARTERY.instanceCount || 1;
  const harmonicLoad = analysesPerSec / instanceCount;

  const heavyRate =
    _INSTRUMENTS_ARTERY.windowAnalyses > 0
      ? _INSTRUMENTS_ARTERY.windowHeavyAnalyses /
        _INSTRUMENTS_ARTERY.windowAnalyses
      : 0;

  const pressure = Math.min(1, (harmonicLoad / 128 + heavyRate) / 2);
  const throughput = Math.max(0, 1 - pressure);
  const cost = Math.max(0, Math.min(1, pressure * (1 - throughput)));
  const budget = Math.max(0, Math.min(1, throughput - cost));

  return Object.freeze({
    instanceIndex: AI_INSTRUMENTS_INSTANCE_INDEX,
    instanceCount,
    analysesPerSec,
    harmonicLoad,
    heavyRate,
    pressure,
    throughput,
    cost,
    budget,
    pressureBucket: _bucketPressure(pressure),
    throughputBucket: _bucketLevel(throughput),
    costBucket: _bucketCost(cost),
    budgetBucket: _bucketLevel(budget)
  });
}

export function getInstrumentsArterySnapshot() {
  return _computeInstrumentsArtery();
}

function _markAnalysis({ heavy = false } = {}) {
  const now = Date.now();
  _rollInstrumentsWindow(now);
  _INSTRUMENTS_ARTERY.windowAnalyses += 1;
  _INSTRUMENTS_ARTERY.totalAnalyses += 1;
  if (heavy) {
    _INSTRUMENTS_ARTERY.windowHeavyAnalyses += 1;
    _INSTRUMENTS_ARTERY.totalHeavyAnalyses += 1;
  }

  const artery = _computeInstrumentsArtery();
  if (
    artery.pressureBucket === "overload" ||
    artery.budgetBucket === "critical"
  ) {
    // Soft spiral warning — non‑blocking, logging only
    // (keeps harmony, never blocks organism)
     
    console.log("[aiInstruments] spiral-warning", artery);
  }
}

// ============================================================================
// SECTION 3 — FIRESTORE ANALYSIS
// ============================================================================
export function analyzeFirestoreDoc(context, docData = {}) {
  _markAnalysis({ heavy: true });
  context.logStep?.("Analyzing Firestore document...");

  const pulseSchema = translateFirestoreDocument(docData);
  context.logStep?.("Translated Firestore → PulseFields.");

  for (const [key, field] of Object.entries(pulseSchema)) {
    try {
      validatePulseField(field);
    } catch {
      context.flagMismatch?.(key, "valid PulseField", "invalid PulseField");
    }

    if (docData[key] === null || docData[key] === undefined) {
      context.flagMissingField?.(key);
    }
  }

  detectSlowdownPatterns(context, docData);
  return pulseSchema;
}

// ============================================================================
// SECTION 4 — SQL ANALYSIS
// ============================================================================
export function analyzeSQLSchema(context, sqlSchema = {}) {
  _markAnalysis({ heavy: true });
  context.logStep?.("Analyzing SQL schema...");

  const pulseSchema = translateSQLSchema(sqlSchema);
  context.logStep?.("Translated SQL → PulseFields.");

  for (const [key, field] of Object.entries(pulseSchema)) {
    try {
      validatePulseField(field);
    } catch {
      context.flagMismatch?.(key, "valid PulseField", "invalid PulseField");
    }
  }

  detectSlowdownPatterns(context, sqlSchema);
  return pulseSchema;
}

// ============================================================================
// SECTION 5 — DRIFT DETECTION
// ============================================================================
export function detectDrift(context, pulseSchema = {}, firestoreSchema = {}) {
  _markAnalysis();
  context.logStep?.("Checking for schema drift...");

  for (const key of Object.keys(pulseSchema)) {
    if (!firestoreSchema[key]) {
      context.flagDrift?.(`Field "${key}" missing in Firestore.`);
      continue;
    }

    const expected = pulseSchema[key].type;
    const actual = firestoreSchema[key].type;

    if (expected !== actual) {
      context.flagDrift?.(
        `Field "${key}" type mismatch: expected ${expected}, got ${actual}`
      );
    }
  }

  return context.diagnostics?.driftDetected;
}

// ============================================================================
// SECTION 6 — SLOWDOWN DETECTION
// ============================================================================
export function detectSlowdownPatterns(context, data) {
  _markAnalysis();
  context.logStep?.("Checking for slowdown patterns...");

  if (!data) {
    context.flagSlowdown?.("Null or undefined data object.");
    return;
  }

  if (Array.isArray(data) && data.length > 200) {
    context.flagSlowdown?.("Large array detected.");
  }

  if (typeof data === "object" && Object.keys(data).length > 100) {
    context.flagSlowdown?.("Large object with many keys.");
  }

  if (JSON.stringify(data).length > 50000) {
    context.flagSlowdown?.("Very large JSON payload.");
  }
}

// ============================================================================
// SECTION 7 — PULSE SCHEMA VALIDATION
// ============================================================================
export function validatePulseSchema(context, schema = {}) {
  _markAnalysis();
  context.logStep?.("Validating Pulse schema...");

  for (const [key, field] of Object.entries(schema)) {
    try {
      validatePulseField(field);
    } catch {
      context.flagMismatch?.(key, "valid PulseField", "invalid PulseField");
    }
  }
}

// ============================================================================
// SECTION 8 — ROUTE ANALYSIS
// ============================================================================
export function analyzeRoute(context, pathway = {}) {
  _markAnalysis();
  context.logStep?.("Analyzing pathway descriptor...");

  if (!pathway || typeof pathway !== "object") {
    context.flagMismatch?.("pathway", "valid object", "invalid object");
    return null;
  }

  if (!Array.isArray(pathway.hops)) {
    context.flagMismatch?.("hops", "array", typeof pathway.hops);
  }

  if (pathway.reliability < 0.9) {
    context.flagSlowdown?.("Low reliability pathway detected.");
  }

  return pathway;
}

// ============================================================================
// SECTION 9 — LOG ANALYSIS
// ============================================================================
export function analyzeLogs(context, logs = []) {
  _markAnalysis();
  context.logStep?.("Analyzing logs...");

  if (!Array.isArray(logs)) {
    context.flagMismatch?.("logs", "array", typeof logs);
    return [];
  }

  if (logs.length > 500) {
    context.flagSlowdown?.("Large log set detected.");
  }

  return logs;
}

// ============================================================================
// SECTION 10 — ERROR ANALYSIS
// ============================================================================
export function analyzeErrors(context, errors = []) {
  _markAnalysis();
  context.logStep?.("Analyzing errors...");

  if (!Array.isArray(errors)) {
    context.flagMismatch?.("errors", "array", typeof errors);
    return [];
  }

  const critical = errors.filter((e) => e?.severity === "critical");
  if (critical.length > 0) {
    context.flagDrift?.("Critical errors detected in system logs.");
  }

  return errors;
}

// ============================================================================
// SECTION 11 — EVOLUTIONARY PATTERN DETECTION
// ============================================================================
export function detectEvolutionaryPatterns(context, pulse = {}) {
  _markAnalysis();
  context.logStep?.("Detecting evolutionary patterns...");

  if (pulse?.lineage && pulse.lineage.length > 20) {
    context.flagSlowdown?.("Deep lineage chain detected.");
  }

  if (pulse?.advantageField) {
    context.logStep?.("Advantage field active.");
  }

  return pulse;
}
