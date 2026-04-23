// ============================================================================
// FILE: /apps/pulse-translator/PulseTranslatorSkeletalIntake.js
// [pulse:translator] PULSE_TRANSLATOR_SKELETAL_INTAKE v10.4  // bone‑gold
// SQL → Pulse Skeletal Intake • Deterministic • Genome‑Driven • Zero IO
// PURE TRANSLATOR — NO SQL EXECUTION • NO NETWORK • NO MUTATION
// ============================================================================
//
// IDENTITY — THE SKELETAL INTAKE TRANSLATOR (v10.4):
//  --------------------------------------------------
//  • Reads SQL column definitions → PulseField objects.
//  • Reads SQL schemas → PulseField schema maps.
//  • Reads SQL SELECT queries → PulseField usage maps.
//  • Uses the OS DNA Genome (PulseSpecsDNAGenome v10.4) as the source of truth.
//  • Deterministic, drift‑proof, read‑only.
//
// ROLE IN THE ORGANISM (v10.4):
//  -----------------------------
//  • DNA → PulseSpecsDNAGenome.js (v10.4 gold‑white genome)
//  • RNA Intake → Firestore → Pulse
//  • RNA Output → Pulse → Firestore
//  • Skeleton Intake → SQL → Pulse (THIS FILE)
//  • Skeleton Output → Pulse → SQL (PulseTranslatorSkeletal.js)
//
// SAFETY CONTRACT (v10.4):
//  ------------------------
//  • Read‑only — no writes, no mutation.
//  • No eval(), no Function(), no dynamic imports.
//  • No SQL execution — only string parsing.
//  • No network calls.
//  • Deterministic: same input → same output.
//  • All types validated against the genome.
// ============================================================================

import {
  SQLToPulse,
  PulseFieldTypes,
  validatePulseField
} from "../pulse-specs/PulseSpecsDNAGenome.js";


// ============================================================================
//  normalizeSQLType(sqlType)
//  Handles DECIMAL(x,y), NUMERIC(x,y), VARCHAR(n), etc.
// ============================================================================
function normalizeSQLType(sqlType = "") {
  const upper = sqlType.toUpperCase().trim();

  // Strip parameters: VARCHAR(255) → VARCHAR
  const base = upper.replace(/\(.+\)/g, "");

  return base;
}


// ============================================================================
//  translateSQLColumn(sqlType, columnName)
//  Converts a SQL column definition → PulseField object.
// ============================================================================
export function translateSQLColumn(sqlType, columnName) {
  if (!sqlType || !columnName) {
    throw new Error("PulseTranslatorSkeletalIntake-v10.4: missing sqlType or columnName");
  }

  const normalizedType = normalizeSQLType(sqlType);
  let pulseType = SQLToPulse[normalizedType] || PulseFieldTypes.STRING;

  // DECIMAL → currency
  if (normalizedType === "DECIMAL") {
    pulseType = PulseFieldTypes.CURRENCY;
  }

  // ENUM → enum
  if (normalizedType === "ENUM") {
    pulseType = PulseFieldTypes.ENUM;
  }

  // JSON → json
  if (normalizedType === "JSON") {
    pulseType = PulseFieldTypes.JSON;
  }

  // Detect NULLABLE (SQL: "columnName TYPE NULL")
  const isNullable = /\bNULL\b/i.test(sqlType);

  const field = {
    name: normalizeFieldName(columnName),
    type: pulseType,
    source: "sql",
    originalType: sqlType.trim()
  };

  // Wrap nullable fields
  if (isNullable) {
    field.type = PulseFieldTypes.NULLABLE;
    field.innerType = pulseType;
  }

  validatePulseField(field);
  return field;
}


// ============================================================================
//  translateSQLSchema(schemaObject)
//  Example input:
//  {
//    id: "INT",
//    name: "VARCHAR(255)",
//    price: "DECIMAL(18,2)",
//    created_at: "TIMESTAMP NULL"
//  }
// ============================================================================
export function translateSQLSchema(schemaObject = {}) {
  const out = {};

  for (const [columnName, sqlType] of Object.entries(schemaObject)) {
    out[columnName] = translateSQLColumn(sqlType, columnName);
  }

  return out;
}


// ============================================================================
//  translateSQLQuery(queryString)
//  Extracts SELECT fields → PulseField usage map.
//  Lightweight — does NOT execute SQL.
// ============================================================================
export function translateSQLQuery(queryString = "") {
  const fields = extractSelectFields(queryString);

  return fields.map((f) => ({
    name: normalizeFieldName(f),
    type: PulseFieldTypes.STRING, // default inference
    source: "sql-query"
  }));
}


// ============================================================================
//  Helpers
// ============================================================================
function normalizeFieldName(name) {
  return name.trim().toLowerCase().replace(/[^a-z0-9_]/g, "_");
}

function extractSelectFields(query) {
  const match = query.match(/select\s+(.+?)\s+from/i);
  if (!match) return [];

  const raw = match[1];
  return raw
    .split(",")
    .map((f) => f.trim().replace(/`/g, ""))
    .filter(Boolean);
}
