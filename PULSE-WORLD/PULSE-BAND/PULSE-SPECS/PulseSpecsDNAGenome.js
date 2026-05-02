// ============================================================================
// FILE: /specs/PulseSpecsDNAGenome-v14.0-PRESENCE-IMMORTAL.js
// [pulse:specs] PULSE_SPECS_DNA_GENOME v14.0-PRESENCE-IMMORTAL
// OS Data Genome • Canonical Field Language • Deterministic Translation Spec
// PURE SPEC — NO IO • NO NETWORK • NO AI • NO RUNTIME
// ============================================================================
//
// IDENTITY — THE OS DNA GENOME (v14.0-PRESENCE-IMMORTAL):
// ------------------------------------------------------
// • Immutable genetic blueprint of Pulse OS (v10.4 → v14 IMMORTAL).
// • Canonical PulseField language for all v12+ subsystems.
// • Source of truth for SQL ↔ Pulse ↔ Firestore mappings.
// • Validation rulebook for translators + healers + shifter engines.
// • Schema cortex foundation for AI reasoning + component generation.
// • Drift‑proof, deterministic, backwards‑compatible, evolution‑safe.
// • ⭐ Binary‑aware, pulse‑aware, dual‑band, shifter‑aware (symbolic + binary).
// • ⭐ Presence/harmonics/IMMORTAL band metadata surfaced as pure schema only.
// ============================================================================

export const PULSE_FIELDS_CONTEXT = {
  layer: "PulseSpecs",
  role: "OS_DATA_GENOME",
  purpose: "Define canonical PulseField types, rules, and mappings",
  context: "Deterministic data language for all Pulse subsystems",
  version: 14.0,
  target: "os-core-v14-PRESENCE-IMMORTAL",
  selfRepairable: false,

  evolution: {
    "1.1":  "Base genome: core types + SQL/Firestore mappings.",
    "1.2":  "Extended numeric semantics (currency/percent) and enum support.",
    "1.3":  "Explicit null handling + stricter URL/email patterns + frozen spec snapshot.",
    "10.4": "Identity uplift, organism alignment, gold‑white genome header, v10.4 contract sync.",
    "11.0": "Binary‑aware genome extension, v11‑Evo alignment, pulse/binary field layer (backwards‑compatible).",
    "12.3": "Every‑advantage period uplift: v12-core alignment, no new primitives, stricter determinism + drift guards.",
    "14.0": "IMMORTAL uplift: dual‑band + presence/harmonics/shifter surfaces, no breaking changes, symbolic/binary co‑existence."
  },

  // IMMORTAL / band metadata (schema‑only, no runtime behavior)
  immortal: {
    presenceAware: true,
    harmonicsAware: true,
    dualBandCompatible: true,
    epochStable: true,
    passivePrewarm: true,
    passiveCache: true,
    passiveChunk: true,
    passiveRemember: true,
    passiveForwarding: true,
    shifterPulseAware: true,
    binaryFrontEndReady: true,
    symbolicBackEndReady: true
  }
};


// ============================================================================
// PulseField Types — the universal data language (GENETIC ALPHABET)
// ============================================================================
// NOTE: v14 adds *no* breaking primitives. New types must degrade cleanly.
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
  NULLABLE: "nullable",

  // v11‑Evo binary/pulse extensions (must degrade to primitives)
  BINARY: "binary",            // degrades to string/bytes
  BITFIELD: "bitfield",        // degrades to number
  PULSE: "pulse",              // degrades to json/map
  PULSE_BINARY: "pulse_binary",// degrades to binary

  // v14 IMMORTAL band/shifter extensions (schema‑only, must degrade)
  BAND: "band",                // symbolic band descriptor (degrades to string)
  PRESENCE: "presence",        // presence band state (degrades to json/string)
  HARMONICS: "harmonics",      // harmonic drift/coherence (degrades to json/string)
  PULSE_SHIFTER: "pulse_shifter",          // symbolic shifter pulse snapshot (degrades to json)
  PULSE_SHIFTER_BINARY: "pulse_shifter_binary" // binary shifter pulse snapshot (degrades to binary)
};


// ============================================================================
// Validation rules — GENETIC EXPRESSION RULES
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
    max:  90071992547409.91
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
  },

  // v11‑Evo binary/pulse extensions
  binary: {
    baseType: "string",       // can be stored as base64 string or bytes
    encoding: "base64",
    maxLength: 8192
  },
  bitfield: {
    baseType: "number",
    min: 0
  },
  pulse: {
    baseType: "json",         // full pulse organism snapshot
    strict: false
  },
  pulse_binary: {
    baseType: "binary"        // binary‑encoded pulse snapshot
  },

  // v14 IMMORTAL band/shifter extensions
  band: {
    baseType: "string",       // e.g. "symbolic", "binary", "dual"
    allowedValues: ["symbolic", "binary", "dual"],
    maxLength: 32
  },
  presence: {
    baseType: "json",         // presence band state snapshot
    strict: false
  },
  harmonics: {
    baseType: "json",         // harmonic drift/coherence snapshot
    strict: false
  },
  pulse_shifter: {
    baseType: "json",         // PulseShifterEvolutionaryPulse-v12.3/v14 snapshot
    strict: false
  },
  pulse_shifter_binary: {
    baseType: "binary"        // binary‑encoded shifter pulse snapshot
  }
};


// ============================================================================
// SQL → PulseField mapping — RNA TRANSCRIPTION (SQL → Genome)
// ============================================================================
export const SQLToPulse = {
  VARCHAR:   PulseFieldTypes.STRING,
  TEXT:      PulseFieldTypes.STRING,
  INT:       PulseFieldTypes.NUMBER,
  INTEGER:   PulseFieldTypes.NUMBER,
  BIGINT:    PulseFieldTypes.NUMBER,
  FLOAT:     PulseFieldTypes.NUMBER,
  DOUBLE:    PulseFieldTypes.NUMBER,
  BOOLEAN:   PulseFieldTypes.BOOLEAN,
  DATE:      PulseFieldTypes.DATE,
  TIMESTAMP: PulseFieldTypes.TIMESTAMP,
  JSON:      PulseFieldTypes.JSON,

  DECIMAL:   PulseFieldTypes.NUMBER,
  NUMERIC:   PulseFieldTypes.NUMBER,

  // v11‑Evo binary mappings
  VARBINARY: PulseFieldTypes.BINARY,
  BLOB:      PulseFieldTypes.BINARY,
  BIT:       PulseFieldTypes.BITFIELD

  // NOTE: v14 IMMORTAL adds no new SQL primitives; shifter/presence/harmonics
  // are expressed via existing JSON/BINARY mappings at the DB layer.
};


// ============================================================================
// Firestore → PulseField mapping — RNA TRANSCRIPTION (Firestore → Genome)
// ============================================================================
export const FirestoreToPulse = {
  string:    PulseFieldTypes.STRING,
  number:    PulseFieldTypes.NUMBER,
  boolean:   PulseFieldTypes.BOOLEAN,
  timestamp: PulseFieldTypes.TIMESTAMP,
  array:     PulseFieldTypes.ARRAY,
  map:       PulseFieldTypes.OBJECT,
  null:      PulseFieldTypes.JSON,

  // v11‑Evo binary mapping
  bytes:     PulseFieldTypes.BINARY

  // v14 IMMORTAL: presence/harmonics/shifter all map to map/bytes at Firestore.
};


// ============================================================================
// PulseField → SQL mapping — PROTEIN SYNTHESIS (Genome → SQL)
// ============================================================================
export const PulseToSQL = {
  string:   "VARCHAR(255)",
  number:   "DOUBLE",
  boolean:  "BOOLEAN",
  date:     "DATE",
  timestamp:"TIMESTAMP",
  array:    "JSON",
  object:   "JSON",
  id:       "VARCHAR(64)",
  email:    "VARCHAR(255)",
  phone:    "VARCHAR(32)",
  url:      "VARCHAR(512)",
  json:     "JSON",

  enum:     "VARCHAR(255)",
  currency: "DECIMAL(18,2)",
  percent:  "DOUBLE",
  nullable: "JSON",

  // v11‑Evo binary/pulse
  binary:        "VARBINARY(8192)",
  bitfield:      "BIGINT",
  pulse:         "JSON",
  pulse_binary:  "VARBINARY(8192)",

  // v14 IMMORTAL band/shifter
  band:                 "VARCHAR(32)",     // symbolic band label
  presence:             "JSON",           // presence band snapshot
  harmonics:            "JSON",           // harmonic snapshot
  pulse_shifter:        "JSON",           // symbolic shifter pulse
  pulse_shifter_binary: "VARBINARY(8192)" // binary shifter pulse
};


// ============================================================================
// PulseField → Firestore mapping — PROTEIN SYNTHESIS (Genome → Firestore)
// ============================================================================
export const PulseToFirestore = {
  string:   "string",
  number:   "number",
  boolean:  "boolean",
  date:     "timestamp",
  timestamp:"timestamp",
  array:    "array",
  object:   "map",
  id:       "string",
  email:    "string",
  phone:    "string",
  url:      "string",
  json:     "map",

  enum:     "string",
  currency: "number",
  percent:  "number",
  nullable: "map",

  // v11‑Evo binary/pulse
  binary:        "bytes",
  bitfield:      "number",
  pulse:         "map",
  pulse_binary:  "bytes",

  // v14 IMMORTAL band/shifter
  band:                 "string",
  presence:             "map",
  harmonics:            "map",
  pulse_shifter:        "map",
  pulse_shifter_binary: "bytes"
};


// ============================================================================
// validatePulseField(field) — GENETIC SANITY CHECK
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
// PULSE_FIELDS_SPEC — FROZEN GENOME SNAPSHOT (v14.0-PRESENCE-IMMORTAL)
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
