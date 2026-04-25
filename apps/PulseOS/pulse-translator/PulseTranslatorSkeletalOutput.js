// ============================================================================
// FILE: /apps/pulse-translator/PulseTranslatorSkeletal.js
// [pulse:translator] PULSE_TRANSLATOR_SKELETAL v11.0  // bone‑gold
// Pulse → SQL Skeletal Translator • Deterministic • Genome‑Driven • Zero IO
// PURE TRANSLATOR — NO SQL EXECUTION • NO NETWORK • NO MUTATION
// ============================================================================
//
// IDENTITY — THE SKELETAL TRANSLATOR (v11.0):
//  ------------------------------------------
//  • Converts PulseField definitions → SQL column definitions.
//  • Converts PulseField schemas → SQL CREATE TABLE statements.
//  • Converts PulseField changes → SQL migration fragments.
//  • Uses the OS DNA Genome (PulseSpecsDNAGenome v11.0) as the source of truth.
//  • Deterministic, drift‑proof, read‑only.
//
// ROLE IN THE ORGANISM (v11.0):
//  -----------------------------
//  • DNA → PulseSpecsDNAGenome.js (v11.0 gold‑white genome)
//  • RNA Intake → Firestore → Pulse
//  • RNA Output → Pulse → Firestore
//  • Skeleton → Pulse → SQL (THIS FILE)
//  • Bones → SQL tables, columns, migrations
//
// SAFETY CONTRACT (v11.0):
//  ------------------------
//  • Read‑only — no writes, no mutation.
//  • No eval(), no Function(), no dynamic imports.
//  • No SQL execution — only string generation.
//  • No network calls.
//  • Deterministic: same input → same output.
//  • All types validated against the genome.
// ============================================================================

import {
  PulseToSQL,
  PulseFieldTypes,
  validatePulseField
} from "../PULSE-SPECS/PulseSpecsDNAGenome.js";


// ============================================================================
//  translatePulseField(field)
//  Converts a PulseField → SQL column definition (bone).
// ============================================================================
export function translatePulseField(field) {
  validatePulseField(field);

  const columnName = normalizeSQLName(field.name);

  // --------------------------------------------------------------------------
  // NULLABLE WRAPPER → JSON bone storing { isNull, value }
  // --------------------------------------------------------------------------
  if (field.type === PulseFieldTypes.NULLABLE) {
    return `${columnName} JSON`;
  }

  // --------------------------------------------------------------------------
  // ENUM → VARCHAR(255)
  // --------------------------------------------------------------------------
  if (field.type === PulseFieldTypes.ENUM) {
    return `${columnName} VARCHAR(255)`;
  }

  // --------------------------------------------------------------------------
  // CURRENCY → DECIMAL(18,scale)
  // --------------------------------------------------------------------------
  if (field.type === PulseFieldTypes.CURRENCY) {
    return `${columnName} DECIMAL(18,${field.scale ?? 2})`;
  }

  // --------------------------------------------------------------------------
  // PERCENT → DOUBLE
  // --------------------------------------------------------------------------
  if (field.type === PulseFieldTypes.PERCENT) {
    return `${columnName} DOUBLE`;
  }

  // --------------------------------------------------------------------------
  // DEFAULT GENOME MAPPING
  // --------------------------------------------------------------------------
  const sqlType = PulseToSQL[field.type] || "VARCHAR(255)";
  return `${columnName} ${sqlType}`;
}


// ============================================================================
//  translatePulseSchema(schemaObject)
//  Converts a PulseField schema → array of SQL column definitions.
// ============================================================================
export function translatePulseSchema(schemaObject = {}) {
  const columns = [];

  for (const field of Object.values(schemaObject)) {
    columns.push(translatePulseField(field));
  }

  return columns;
}


// ============================================================================
//  generateCreateTable(tableName, schemaObject)
//  Produces a full CREATE TABLE statement (bone formation).
// ============================================================================
export function generateCreateTable(tableName, schemaObject = {}) {
  const normalized = normalizeSQLName(tableName);
  const columns = translatePulseSchema(schemaObject);

  return `
CREATE TABLE ${normalized} (
  ${columns.join(",\n  ")}
);`.trim();
}


// ============================================================================
//  generateAddColumn(tableName, field)
//  Produces a SQL migration fragment for adding a column (bone growth).
// ============================================================================
export function generateAddColumn(tableName, field) {
  validatePulseField(field);

  const normalized = normalizeSQLName(tableName);
  const columnDef = translatePulseField(field);

  return `ALTER TABLE ${normalized} ADD COLUMN ${columnDef};`;
}


// ============================================================================
//  generateDropColumn(tableName, columnName)
//  Produces a SQL migration fragment for removing a column (bone removal).
// ============================================================================
export function generateDropColumn(tableName, columnName) {
  const normalized = normalizeSQLName(tableName);
  const col = normalizeSQLName(columnName);

  return `ALTER TABLE ${normalized} DROP COLUMN ${col};`;
}


// ============================================================================
//  Helpers
// ============================================================================
function normalizeSQLName(name) {
  return name.trim().toLowerCase().replace(/[^a-z0-9_]/g, "_");
}
