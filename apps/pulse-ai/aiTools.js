// ============================================================================
// FILE: tropic-pulse-functions/apps/pulse-ai/aiTools.js
// LAYER: THE INSTRUMENTS (Natural Abilities + Diagnostic Tools)
// ============================================================================
//
// ROLE:
//   THE INSTRUMENTS — The AI’s built‑in abilities + diagnostic tools
//   • Analyze Firestore + SQL + Pulse schemas
//   • Detect mismatches, missing fields, drift, slowdown
//   • Log diagnostic steps into the Cognitive Frame
//
// PURPOSE:
//   • Provide deterministic, safe analysis utilities
//   • Serve as the AI’s “hands” and “tools”
//   • Integrate tightly with aiContext for trace + diagnostics
//
// CONTRACT:
//   • READ‑ONLY — no writes
//   • NO eval(), NO Function(), NO dynamic imports
//   • NO executing user code
//   • NO network calls
//   • Deterministic analysis only
//
// SAFETY:
//   • v6.3 upgrade is COMMENTAL + DIAGNOSTIC ONLY — NO LOGIC CHANGES
//   • All behavior remains identical to pre‑v6.3 aiTools
// ============================================================================

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

// ============================================================================
// FIRESTORE ANALYSIS — Instrument Procedure
// ============================================================================
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

    if (docData[key] === null || docData[key] === undefined) {
      context.flagMissingField(key);
    }
  }

  // Slowdown detection
  if (Object.keys(docData).length > 50) {
    context.flagSlowdown("Large Firestore document with many fields.");
  }

  return pulseSchema;
}

// ============================================================================
// SQL ANALYSIS — Instrument Procedure
// ============================================================================
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

// ============================================================================
// DRIFT DETECTION — Instrument Procedure
// ============================================================================
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

// ============================================================================
// SLOWDOWN DETECTION — Instrument Procedure
// ============================================================================
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

// ============================================================================
// PULSE SCHEMA VALIDATION — Instrument Procedure
// ============================================================================
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
