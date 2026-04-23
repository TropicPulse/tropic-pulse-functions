// ============================================================================
// FILE: /apps/specs/PulseSpecsDNAGenome.js
// [pulse:specs] PULSE_SPECS_DNA_GENOME v10.4  // gold‑white
// OS Data Genome • Canonical Field Language • Deterministic Translation Spec
// PURE SPEC — NO IO • NO NETWORK • NO AI • NO RUNTIME
// ============================================================================
//
// IDENTITY — THE OS DNA GENOME (v10.4):
//  ------------------------------------
//  • Immutable genetic blueprint of Pulse OS.
//  • Canonical PulseField language for all v10.4 subsystems.
//  • Source of truth for SQL ↔ Pulse ↔ Firestore mappings.
//  • Validation rulebook for translators + healers.
//  • Schema cortex foundation for AI reasoning + component generation.
//  • Drift‑proof, deterministic, backwards‑compatible, evolution‑safe.
//
// ROLE IN THE ORGANISM (v10.4):
//  -----------------------------
//  • DNA → canonical data genome (this file)
//  • RNA → translators (sqlToPulse, pulseToSQL, firestoreToPulse, etc.)
//  • Proteins → actual data structures in the organism
//  • Healers → mutation correction + schema drift repair
//  • Cortex → uses genome to reason about structure + generate components
//
// SAFETY CONTRACT (v10.4):
//  ------------------------
//  • Read‑only spec — no writes, no mutation.
//  • No eval(), no Function(), no dynamic imports.
//  • No network calls.
//  • Deterministic, stable output only.
//  • Backwards‑compatible evolution only.
//  • All new types must degrade safely to existing primitives.
//  • Frozen snapshot — cannot be modified at runtime.
//
// THEME:
//  • Color: Gold‑White (genetic law + organism‑wide purity).
//  • Subtheme: Determinism, lineage, schema purity, evolutionary stability.
// ============================================================================

export const PULSE_FIELDS_CONTEXT = {
  layer: "PulseSpecs",
  role: "OS_DATA_GENOME",
  purpose: "Define canonical PulseField types, rules, and mappings",
  context: "Deterministic data language for all Pulse subsystems",
  version: 10.4,
  target: "os-core",
  selfRepairable: false,

  evolution: {
    "1.1": "Base genome: core types + SQL/Firestore mappings.",
    "1.2": "Extended numeric semantics (currency/percent) and enum support.",
    "1.3": "Explicit null handling + stricter URL/email patterns + frozen spec snapshot.",
    "10.4": "Identity uplift, organism alignment, gold‑white genome header, v10.4 contract sync."
  }
};


// ============================================================================
//  PulseField Types — the universal data language (GENETIC ALPHABET)
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
  JSON: "json",

  // v1.2+ extensions (backwards‑compatible)
  ENUM: "enum",
  CURRENCY: "currency",
  PERCENT: "percent",
  NULLABLE: "nullable"
};

// ============================================================================
//  Validation rules — GENETIC EXPRESSION RULES
// ============================================================================
export const PulseFieldRules = {
  string: { maxLength: 2048, trim: true },
  number: { allowFloat: true },
  boolean: {},
  date: { format: "YYYY-MM-DD" },
  timestamp: { format: "ISO8601" },
  array: { elementType: "any", maxLength: 1024 },
  object: { strict: false },
  id: { pattern: /^[A-Za-z0-9_-]+$/ },
  email: { pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
  phone: { pattern: /^[0-9+\-() ]+$/ },
  url: { pattern: /^https?:\/\/[^\s]+$/ },
  json: {},

  // v1.2+ extensions
  enum: {
    baseType: "string",
    allowedValues: [],
    maxLength: 255
  },
  currency: {
    baseType: "number",
    scale: 2,
    min: -90071992547409.91,
    max: 90071992547409.91
  },
  percent: {
    baseType: "number",
    normalized: false,
    min: 0,
    max: 100
  },
  nullable: {
    wrapper: true,
    allowNull: true
  }
};

// ============================================================================
//  SQL → PulseField mapping — RNA TRANSCRIPTION (SQL → Genome)
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
  JSON: PulseFieldTypes.JSON,

  DECIMAL: PulseFieldTypes.NUMBER,
  NUMERIC: PulseFieldTypes.NUMBER
};

// ============================================================================
//  Firestore → PulseField mapping — RNA TRANSCRIPTION (Firestore → Genome)
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
//  PulseField → SQL mapping — PROTEIN SYNTHESIS (Genome → SQL)
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
  json: "JSON",

  enum: "VARCHAR(255)",
  currency: "DECIMAL(18,2)",
  percent: "DOUBLE",
  nullable: "JSON"
};

// ============================================================================
//  PulseField → Firestore mapping — PROTEIN SYNTHESIS (Genome → Firestore)
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
  json: "map",

  enum: "string",
  currency: "number",
  percent: "number",
  nullable: "map"
};

// ============================================================================
//  validatePulseField(field) — GENETIC SANITY CHECK
// ============================================================================
export function validatePulseField(field) {
  if (!field || !field.type) {
    throw new Error("PulseField missing type");
  }

  const rules = PulseFieldRules[field.type];
  if (!rules) {
    throw new Error(`Unknown PulseField type: ${field.type}`);
  }

  if (field.type === "enum") {
    if (!Array.isArray(field.allowedValues) || field.allowedValues.length === 0) {
      throw new Error("PulseField enum requires non-empty allowedValues array");
    }
  }

  if (field.type === "nullable") {
    if (!field.innerType || !PulseFieldRules[field.innerType]) {
      throw new Error("PulseField nullable requires valid innerType");
    }
  }

  return true;
}

// ============================================================================
//  PULSE_FIELDS_SPEC — FROZEN GENOME SNAPSHOT
// ============================================================================
export const PULSE_FIELDS_SPEC = Object.freeze({
  ...PULSE_FIELDS_CONTEXT,
  types: Object.freeze({ ...PulseFieldTypes }),
  rules: Object.freeze({ ...PulseFieldRules }),
  sqlToPulse: Object.freeze({ ...SQLToPulse }),
  firestoreToPulse: Object.freeze({ ...FirestoreToPulse }),
  pulseToSQL: Object.freeze({ ...PulseToSQL }),
  pulseToFirestore: Object.freeze({ ...PulseToFirestore })
});
