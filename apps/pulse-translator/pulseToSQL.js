// FILE: tropic-pulse-functions/apps/pulse-translator/pulseToSQL.js

//
// ------------------------------------------------------
// 📘 PAGE INDEX — Source of Truth for This File
// ------------------------------------------------------
//
// ROLE:
//   PulseToSQL — deterministic, read‑only translator that converts PulseField
//   definitions into SQL column definitions, SQL table schemas, and SQL
//   migration fragments.
//
// PURPOSE:
//   • Convert PulseField objects → SQL column definitions
//   • Convert PulseField schemas → SQL CREATE TABLE statements
//   • Provide a stable, AI‑readable + human‑readable SQL translation layer
//   • Enable backend AI to generate SQL safely and deterministically
//
// OUTPUT:
//   • SQL column definitions
//   • SQL CREATE TABLE statements
//   • SQL ALTER TABLE migration fragments
//
// RESPONSIBILITIES:
//   • Map PulseField types → SQL types
//   • Normalize SQL identifiers
//   • Validate PulseField definitions
//   • Produce deterministic SQL output
//
// SAFETY RULES (CRITICAL):
//   • READ‑ONLY — no file writes
//   • NO eval(), NO Function(), NO dynamic imports
//   • NO executing SQL
//   • NO network calls
//   • Deterministic translation only
//
// ------------------------------------------------------
// Pulse → SQL Translator
// ------------------------------------------------------

import { PulseToSQL, validatePulseField } from "../pulse-specs/pulseFields.js";

/**
 * translatePulseField(field)
 * Converts a PulseField object into a SQL column definition.
 */
export function translatePulseField(field) {
  validatePulseField(field);

  const sqlType = PulseToSQL[field.type] || "VARCHAR(255)";
  const columnName = normalizeSQLName(field.name);

  return `${columnName} ${sqlType}`;
}

/**
 * translatePulseSchema(schemaObject)
 * Example input:
 * {
 *   id: { name: "id", type: "id" },
 *   name: { name: "name", type: "string" },
 *   created_at: { name: "created_at", type: "timestamp" }
 * }
 */
export function translatePulseSchema(schemaObject = {}) {
  const columns = [];

  for (const field of Object.values(schemaObject)) {
    columns.push(translatePulseField(field));
  }

  return columns;
}

/**
 * generateCreateTable(tableName, schemaObject)
 * Produces a full CREATE TABLE statement.
 */
export function generateCreateTable(tableName, schemaObject = {}) {
  const normalized = normalizeSQLName(tableName);
  const columns = translatePulseSchema(schemaObject);

  return `
CREATE TABLE ${normalized} (
  ${columns.join(",\n  ")}
);`.trim();
}

/**
 * generateAddColumn(tableName, field)
 * Produces a SQL migration fragment for adding a column.
 */
export function generateAddColumn(tableName, field) {
  validatePulseField(field);

  const normalized = normalizeSQLName(tableName);
  const columnDef = translatePulseField(field);

  return `ALTER TABLE ${normalized} ADD COLUMN ${columnDef};`;
}

/**
 * generateDropColumn(tableName, columnName)
 */
export function generateDropColumn(tableName, columnName) {
  const normalized = normalizeSQLName(tableName);
  const col = normalizeSQLName(columnName);

  return `ALTER TABLE ${normalized} DROP COLUMN ${col};`;
}

// ------------------------------------------------------
// Helpers
// ------------------------------------------------------

function normalizeSQLName(name) {
  return name.trim().toLowerCase().replace(/[^a-z0-9_]/g, "_");
}
