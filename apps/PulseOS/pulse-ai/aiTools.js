// ============================================================================
//  PULSE OS v10.4 — THE INSTRUMENTS
//  Natural Abilities • Diagnostic Tools • Evolutionary Sensors
//  PURE ANALYSIS. ZERO MUTATION. ZERO TIME. ZERO RANDOMNESS.
// ============================================================================

import { translateFirestoreDocument } from "../pulse-translator/firestoreToPulse.js";
import { translateSQLSchema } from "../pulse-translator/sqlToPulse.js";
import { validatePulseField } from "../PULSE-SPECS/pulseFields.js";

// ============================================================================
//  IDENTITY — THE INSTRUMENTS (v10.4)
// ============================================================================
export const AI_INSTRUMENTS_META = Object.freeze({
  layer: "PulseAIInstruments",
  role: "INSTRUMENTS",
  version: "10.4",
  target: "full-mesh",
  selfRepairable: true,
  evo: Object.freeze({
    driftProof: true,
    deterministicField: true,
    multiInstanceReady: true,
    unifiedAdvantageField: true,
    futureEvolutionReady: true,
    observerOnly: true,
    architectAware: true,
    schemaAware: true,
    lineageAware: true,
    patternAware: true
  })
});

// ============================================================================
//  FIRESTORE ANALYSIS — Instrument Procedure
// ============================================================================
export function analyzeFirestoreDoc(context, docData = {}) {
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
//  SQL ANALYSIS — Instrument Procedure
// ============================================================================
export function analyzeSQLSchema(context, sqlSchema = {}) {
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
//  DRIFT DETECTION — Instrument Procedure
// ============================================================================
export function detectDrift(context, pulseSchema = {}, firestoreSchema = {}) {
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
//  SLOWDOWN DETECTION — Instrument Procedure
// ============================================================================
export function detectSlowdownPatterns(context, data) {
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
//  PULSE SCHEMA VALIDATION — Instrument Procedure
// ============================================================================
export function validatePulseSchema(context, schema = {}) {
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
//  NEW v10.4 — ROUTE ANALYSIS
// ============================================================================
export function analyzeRoute(context, pathway = {}) {
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
//  NEW v10.4 — LOG ANALYSIS
// ============================================================================
export function analyzeLogs(context, logs = []) {
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
//  NEW v10.4 — ERROR ANALYSIS
// ============================================================================
export function analyzeErrors(context, errors = []) {
  context.logStep?.("Analyzing errors...");

  if (!Array.isArray(errors)) {
    context.flagMismatch?.("errors", "array", typeof errors);
    return [];
  }

  const critical = errors.filter(e => e?.severity === "critical");
  if (critical.length > 0) {
    context.flagDrift?.("Critical errors detected in system logs.");
  }

  return errors;
}

// ============================================================================
//  NEW v10.4 — EVOLUTIONARY PATTERN DETECTORS
// ============================================================================
export function detectEvolutionaryPatterns(context, pulse = {}) {
  context.logStep?.("Detecting evolutionary patterns...");

  if (pulse?.lineage && pulse.lineage.length > 20) {
    context.flagSlowdown?.("Deep lineage chain detected.");
  }

  if (pulse?.advantageField) {
    context.logStep?.("Advantage field active.");
  }

  return pulse;
}
