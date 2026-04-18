// ============================================================================
// FILE: tropic-pulse-functions/apps/pulse-ai/aiService.js
// LAYER: THE GATEWAY (AI Service Layer + Safe Entry Point)
// ============================================================================
//
// ROLE:
//   THE GATEWAY — The public API for all Pulse AI operations
//   • Wraps the Cortex (aiEngine)
//   • Exposes high‑level AI services
//   • Ensures diagnostics + trace for every operation
//
// PURPOSE:
//   • Provide simple, deterministic AI analysis functions
//   • Detect mismatches, drift, missing fields, slowdown causes
//   • Return { result, context } for debugging + admin tools
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
//   • All behavior remains identical to pre‑v6.3 aiService
// ============================================================================

import { runAI } from "./aiEngine.js";
import {
  analyzeFirestoreDoc,
  analyzeSQLSchema,
  detectDrift,
  detectSlowdownPatterns,
  validatePulseSchema,
} from "./aiTools.js";

// ============================================================================
// FIRESTORE ANALYSIS — Gateway Wrapper
// ============================================================================
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

// ============================================================================
// SQL ANALYSIS — Gateway Wrapper
// ============================================================================
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

// ============================================================================
// DRIFT DETECTION — Gateway Wrapper
// ============================================================================
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

// ============================================================================
// PULSE SCHEMA VALIDATION — Gateway Wrapper
// ============================================================================
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

// ============================================================================
// FULL AUDIT — Gateway Wrapper
// ============================================================================
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
