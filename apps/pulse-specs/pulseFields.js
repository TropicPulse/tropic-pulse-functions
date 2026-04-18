// ============================================================================
//  PULSE FIELDS v1.1
//  OS DATA GENOME + TRANSLATION SPEC
//  Deterministic, Drift‑Proof Canonical Field Language
//  PURE SPEC. NO IO. NO NETWORK. NO AI.
// ============================================================================
//
// WHAT THIS FILE IS:
//  -------------------
//  • The OS‑level data genome for Tropic Pulse.
//  • The canonical PulseField language for every subsystem.
//  • The source of truth for SQL ↔ Pulse ↔ Firestore mappings.
//  • The validation rulebook for translators + healers.
//  • The schema cortex for AI reasoning + component generation.
//
// WHAT THIS FILE IS NOT:
//  -----------------------
//  • NOT a compute engine.
//  • NOT a runtime.
//  • NOT a database client.
//  • NOT a network caller.
//  • NOT a place for user‑provided logic.
//  • NOT a place for eval / dynamic imports.
//
// SAFETY CONTRACT:
//  ----------------
//  • Read‑only spec — no file writes.
//  • No eval(), no Function(), no dynamic imports.
//  • No network calls.
//  • Deterministic, stable output only.
//  • Backwards‑compatible evolution only.
//
// ============================================================================
//  OS CONTEXT METADATA
// ============================================================================
export const PULSE_FIELDS_CONTEXT = {
  layer: "PulseSpecs",
  role: "OS_DATA_GENOME",
  purpose: "Define canonical PulseField types, rules, and mappings",
  context: "Deterministic data language for all Pulse subsystems",
  version: 1.1,
  target: "os-core",
  selfRepairable: false
};

// ============================================================================
//  PulseField Types — the universal data language
// ============================================================================
export const PulseFieldTypes = {
  STRING: "string",
  NUMBER: "number",
  BOOLEAN: "boolean",
  DATE: "date",
  TIMESTAMP: "timestamp",
  ARRAY: "array",
  OBJECT: "object",
  ID: "id",
  EMAIL: "email",
  PHONE: "phone",
  URL: "url",
  JSON: "json"
};

// ============================================================================
//  Validation rules for each field type
// ============================================================================
export const PulseFieldRules = {
  string: { maxLength: 2048 },
  number: { allowFloat: true },
  boolean: {},
  date: { format: "YYYY-MM-DD" },
  timestamp: { format: "ISO8601" },
  array: { elementType: "any" },
  object: { strict: false },
  id: { pattern: /^[A-Za-z0-9_-]+$/ },
  email: { pattern: /^[^@]+@[^@]+\.[^@]+$/ },
  phone: { pattern: /^[0-9+\-() ]+$/ },
  url: { pattern: /^https?:\/\// },
  json: {}
};

// ============================================================================
//  SQL → PulseField mapping rules
// ============================================================================
export const SQLToPulse = {
  VARCHAR: PulseFieldTypes.STRING,
  TEXT: PulseFieldTypes.STRING,
  INT: PulseFieldTypes.NUMBER,
  INTEGER: PulseFieldTypes.NUMBER,
  BIGINT: PulseFieldTypes.NUMBER,
  FLOAT: PulseFieldTypes.NUMBER,
  DOUBLE: PulseFieldTypes.NUMBER,
  BOOLEAN: PulseFieldTypes.BOOLEAN,
  DATE: PulseFieldTypes.DATE,
  TIMESTAMP: PulseFieldTypes.TIMESTAMP,
  JSON: PulseFieldTypes.JSON
};

// ============================================================================
//  Firestore → PulseField mapping rules
// ============================================================================
export const FirestoreToPulse = {
  string: PulseFieldTypes.STRING,
  number: PulseFieldTypes.NUMBER,
  boolean: PulseFieldTypes.BOOLEAN,
  timestamp: PulseFieldTypes.TIMESTAMP,
  array: PulseFieldTypes.ARRAY,
  map: PulseFieldTypes.OBJECT,
  null: PulseFieldTypes.JSON
};

// ============================================================================
//  PulseField → SQL mapping rules
// ============================================================================
export const PulseToSQL = {
  string: "VARCHAR(255)",
  number: "DOUBLE",
  boolean: "BOOLEAN",
  date: "DATE",
  timestamp: "TIMESTAMP",
  array: "JSON",
  object: "JSON",
  id: "VARCHAR(64)",
  email: "VARCHAR(255)",
  phone: "VARCHAR(32)",
  url: "VARCHAR(512)",
  json: "JSON"
};

// ============================================================================
//  PulseField → Firestore mapping rules
// ============================================================================
export const PulseToFirestore = {
  string: "string",
  number: "number",
  boolean: "boolean",
  date: "timestamp",
  timestamp: "timestamp",
  array: "array",
  object: "map",
  id: "string",
  email: "string",
  phone: "string",
  url: "string",
  json: "map"
};

// ============================================================================
//  validatePulseField(field) — schema sanity check
// ============================================================================
export function validatePulseField(field) {
  if (!field || !field.type) {
    throw new Error("PulseField missing type");
  }

  const rules = PulseFieldRules[field.type];
  if (!rules) {
    throw new Error(`Unknown PulseField type: ${field.type}`);
  }

  return true;
}

// ============================================================================
//  PULSE_FIELDS_SPEC — single export for translators + healers
// ============================================================================
export const PULSE_FIELDS_SPEC = {
  ...PULSE_FIELDS_CONTEXT,
  types: PulseFieldTypes,
  rules: PulseFieldRules,
  sqlToPulse: SQLToPulse,
  firestoreToPulse: FirestoreToPulse,
  pulseToSQL: PulseToSQL,
  pulseToFirestore: PulseToFirestore
};
