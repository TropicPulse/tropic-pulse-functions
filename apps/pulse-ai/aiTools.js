// FILE: tropic-pulse-functions/apps/pulse-ai/aiTools.js

//
// ------------------------------------------------------
// 📘 PAGE INDEX — Source of Truth for This File
// ------------------------------------------------------
//
// ROLE:
//   PulseAITools — safe utility functions the AI can use to analyze,
//   validate, translate, and diagnose data structures.
//
// PURPOSE:
//   • Provide safe analysis tools for Firestore + SQL + PulseFields
//   • Detect mismatches, missing fields, drift, slowdown causes
//   • Integrate with aiContext for logging + diagnostics
//
// OUTPUT:
//   • Pure functions that operate on data + context
//
// RESPONSIBILITIES:
//   • Analyze Firestore documents
//   • Analyze SQL schemas
//   • Validate PulseField definitions
//   • Detect drift between Pulse ↔ Firestore ↔ SQL
//   • Log diagnostic steps into aiContext
//
// SAFETY RULES (CRITICAL):
//   • READ‑ONLY — no file writes
//   • NO eval(), NO Function(), NO dynamic imports
//   • NO executing user code
//   • NO network calls
//   • Deterministic analysis only
//
// ------------------------------------------------------
// Pulse‑AI Tools
// ------------------------------------------------------

import {
  translateFirestoreDocument,
} from "../pulse-translator/firestoreToPulse.js";

import {
  translateSQLSchema,
} from "../pulse-translator/sqlToPulse.js";

import {
  PulseFieldTypes,
  validatePulseField,
} from "../pulse-specs/pulseFields.js";

/**
 * analyzeFirestoreDoc(context, docData)
 * Produces PulseFields + diagnostics.
 */
export function analyzeFirestoreDoc(context, docData = {}) {
  context.logStep("Analyzing Firestore document...");

  const pulseSchema = translateFirestoreDocument(docData);
  context.logStep("Translated Firestore → PulseFields.");

  // Detect mismatches + missing fields
  for (const [key, field] of Object.entries(pulseSchema)) {
    try {
      validatePulseField(field);
    } catch (err) {
      context.flagMismatch(key, "valid PulseField", "invalid PulseField");
    }

    // Detect empty or null fields
    if (docData[key] === null || docData[key] === undefined) {
      context.flagMissingField(key);
    }
  }

  // Detect slowdown patterns
  if (Object.keys(docData).length > 50) {
    context.flagSlowdown("Large Firestore document with many fields.");
  }

  return pulseSchema;
}

/**
 * analyzeSQLSchema(context, sqlSchema)
 * Produces PulseFields + diagnostics.
 */
export function analyzeSQLSchema(context, sqlSchema = {}) {
  context.logStep("Analyzing SQL schema...");

  const pulseSchema = translateSQLSchema(sqlSchema);
  context.logStep("Translated SQL → PulseFields.");

  for (const [key, field] of Object.entries(pulseSchema)) {
    try {
      validatePulseField(field);
    } catch (err) {
      context.flagMismatch(key, "valid PulseField", "invalid PulseField");
    }
  }

  return pulseSchema;
}

/**
 * detectDrift(context, pulseSchema, firestoreSchema)
 * Compares PulseFields ↔ FirestoreFields.
 */
export function detectDrift(context, pulseSchema = {}, firestoreSchema = {}) {
  context.logStep("Checking for schema drift...");

  for (const key of Object.keys(pulseSchema)) {
    if (!firestoreSchema[key]) {
      context.flagDrift(`Field "${key}" missing in Firestore.`);
      continue;
    }

    const expected = pulseSchema[key].type;
    const actual = firestoreSchema[key].type;

    if (expected !== actual) {
      context.flagDrift(
        `Field "${key}" type mismatch: expected ${expected}, got ${actual}`
      );
    }
  }

  return context.diagnostics.driftDetected;
}

/**
 * detectSlowdownPatterns(context, data)
 * Looks for common causes of slow AI reasoning.
 */
export function detectSlowdownPatterns(context, data) {
  context.logStep("Checking for slowdown patterns...");

  if (!data) {
    context.flagSlowdown("Null or undefined data object.");
    return;
  }

  if (Array.isArray(data) && data.length > 200) {
    context.flagSlowdown("Large array detected.");
  }

  if (typeof data === "object" && Object.keys(data).length > 100) {
    context.flagSlowdown("Large object with many keys.");
  }

  if (JSON.stringify(data).length > 50000) {
    context.flagSlowdown("Very large JSON payload.");
  }
}

/**
 * validatePulseSchema(context, schema)
 */
export function validatePulseSchema(context, schema = {}) {
  context.logStep("Validating Pulse schema...");

  for (const [key, field] of Object.entries(schema)) {
    try {
      validatePulseField(field);
    } catch (err) {
      context.flagMismatch(key, "valid PulseField", "invalid PulseField");
    }
  }
}
