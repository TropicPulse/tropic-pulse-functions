// FILE: tropic-pulse-functions/apps/pulse-ai/aiService.js

//
// ------------------------------------------------------
// 📘 PAGE INDEX — Source of Truth for This File
// ------------------------------------------------------
//
// ROLE:
//   PulseAIService — the public API for all AI operations inside Pulse OS.
//   Wraps aiEngine + aiTools to provide high‑level, safe AI services.
//
// PURPOSE:
//   • Provide simple functions for analyzing Firestore, SQL, Pulse schemas
//   • Detect mismatches, drift, missing fields, slowdown causes
//   • Return results + trace + diagnostics for debugging
//
// OUTPUT:
//   • { result, context } for every operation
//
// RESPONSIBILITIES:
//   • Wrap aiEngine with high‑level operations
//   • Provide a clean API for backend usage
//   • Ensure all operations produce diagnostics + trace
//
// SAFETY RULES (CRITICAL):
//   • READ‑ONLY — no file writes
//   • NO eval(), NO Function(), NO dynamic imports
//   • NO executing user code
//   • NO network calls
//   • Deterministic analysis only
//
// ------------------------------------------------------
// Pulse‑AI Service Layer
// ------------------------------------------------------

import { runAI } from "./aiEngine.js";
import {
  analyzeFirestoreDoc,
  analyzeSQLSchema,
  detectDrift,
  detectSlowdownPatterns,
  validatePulseSchema,
} from "./aiTools.js";

/**
 * Analyze a Firestore document and return:
 *   • PulseFields
 *   • mismatches
 *   • missing fields
 *   • slowdown causes
 *   • trace
 */
export async function runAnalyzeFirestore(docData, request = {}) {
  return runAI(
    {
      ...request,
      intent: "analyze",
      touchesBackend: false,
      touchesSchemas: true,
      touchesFiles: false,
    },
    async (context) => {
      const pulseSchema = analyzeFirestoreDoc(context, docData);
      detectSlowdownPatterns(context, docData);
      return pulseSchema;
    }
  );
}

/**
 * Analyze a SQL schema and return:
 *   • PulseFields
 *   • mismatches
 *   • drift
 *   • trace
 */
export async function runAnalyzeSQL(sqlSchema, request = {}) {
  return runAI(
    {
      ...request,
      intent: "analyze",
      touchesBackend: false,
      touchesSchemas: true,
      touchesFiles: false,
    },
    async (context) => {
      const pulseSchema = analyzeSQLSchema(context, sqlSchema);
      detectSlowdownPatterns(context, sqlSchema);
      return pulseSchema;
    }
  );
}

/**
 * Compare PulseFields ↔ FirestoreFields and detect drift.
 */
export async function runDetectDrift(pulseSchema, firestoreSchema, request = {}) {
  return runAI(
    {
      ...request,
      intent: "analyze",
      touchesBackend: false,
      touchesSchemas: true,
      touchesFiles: false,
    },
    async (context) => {
      const drift = detectDrift(context, pulseSchema, firestoreSchema);
      return { drift };
    }
  );
}

/**
 * Validate a Pulse schema and return mismatches + trace.
 */
export async function runValidatePulse(pulseSchema, request = {}) {
  return runAI(
    {
      ...request,
      intent: "analyze",
      touchesBackend: false,
      touchesSchemas: true,
      touchesFiles: false,
    },
    async (context) => {
      validatePulseSchema(context, pulseSchema);
      return { valid: context.diagnostics.mismatches.length === 0 };
    }
  );
}

/**
 * Full audit:
 *   • Analyze Firestore
 *   • Validate Pulse
 *   • Detect drift
 *   • Detect slowdown causes
 *   • Return EVERYTHING
 */
export async function runFullAudit(pulseSchema, firestoreDoc, request = {}) {
  return runAI(
    {
      ...request,
      intent: "analyze",
      touchesBackend: false,
      touchesSchemas: true,
      touchesFiles: false,
    },
    async (context) => {
      context.logStep("Starting full audit...");

      const fsPulse = analyzeFirestoreDoc(context, firestoreDoc);
      validatePulseSchema(context, pulseSchema);
      detectDrift(context, pulseSchema, fsPulse);
      detectSlowdownPatterns(context, firestoreDoc);

      context.logStep("Full audit completed.");

      return {
        pulseFromFirestore: fsPulse,
        driftDetected: context.diagnostics.driftDetected,
        mismatches: context.diagnostics.mismatches,
        missingFields: context.diagnostics.missingFields,
        slowdownCauses: context.diagnostics.slowdownCauses,
      };
    }
  );
}
