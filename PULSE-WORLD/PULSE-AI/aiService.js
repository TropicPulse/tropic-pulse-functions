// ============================================================================
//  PULSE OS v11‑EVO — AI SERVICE GATEWAY
//  Dual‑Band Entry Point • Safe Relay • Deterministic Execution
//  PURE RELAY. ZERO MUTATION. ZERO RANDOMNESS.
// ============================================================================
export const ServiceGatewayMeta = Object.freeze({
  layer: "PulseAIServiceGateway",
  role: "SERVICE_GATEWAY_ORGAN",
  version: "11.0-EVO",
  identity: "aiServiceGateway-v11-EVO",

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
    multiInstanceReady: true,
    epoch: "v11-EVO"
  }),

  contract: Object.freeze({
    purpose:
      "Provide a deterministic, dual-band-safe relay for analysis, audit, schema validation, drift detection, slowdown detection, route/log/error analysis, and tourism queries.",

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
      "return unified response packets"
    ])
  })
});

import { runAI } from "./aiEngine-v11-Evo.js";
import { analyzeFirestoreDoc, analyzeSQLSchema, detectDrift, detectSlowdownPatterns, validatePulseSchema } from "./aiTools.js";

// ---------------------------------------------------------------------------
// INTERNAL — Deterministic Relay Wrapper (v11‑EVO)
// ---------------------------------------------------------------------------
function callAI(intent, flags, operation, request = {}, dualBand = null) {
  return runAI(
    Object.freeze({
      ...request,
      intent,
      ...flags
    }),
    operation,
    request.deps || {},
    dualBand
  );
}

// ============================================================================
// FIRESTORE ANALYSIS — Dual‑Band Gateway
// ============================================================================
export async function runAnalyzeFirestore(docData, request = {}, dualBand = null) {
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
export async function runDetectDrift(pulseSchema, firestoreSchema, request = {}, dualBand = null) {
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
export async function runValidatePulse(pulseSchema, request = {}, dualBand = null) {
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
export async function runFullAudit(pulseSchema, firestoreDoc, request = {}, dualBand = null) {
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
export async function runAnalyzeRoutes(routeData, request = {}, dualBand = null) {
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
export async function runAnalyzeErrors(errors, request = {}, dualBand = null) {
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
export async function runExplainOrgan(organMeta, request = {}, dualBand = null) {
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

export async function runExplainPathway(pathway, request = {}, dualBand = null) {
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
export async function runTourGuideQuery(query, request = {}, dualBand = null) {
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
