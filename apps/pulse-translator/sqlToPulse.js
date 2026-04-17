// FILE: tropic-pulse-functions/apps/pulse-translator/sqlToPulse.js

//
// ------------------------------------------------------
// 📘 PAGE INDEX — Source of Truth for This File
// ------------------------------------------------------
//
// ROLE:
//   SQLtoPulse — deterministic, read‑only translator that converts SQL
//   column definitions, query structures, and inferred types into the
//   canonical Pulse‑Fields specification.
//
// PURPOSE:
//   • Convert SQL schemas → PulseField definitions
//   • Convert SQL query structures → PulseField usage maps
//   • Provide a stable, AI‑readable + human‑readable data translation layer
//   • Enable backend + frontend AI to understand SQL data safely
//
// OUTPUT:
//   • PulseField objects
//   • PulseField type mappings
//   • Deterministic translation results
//
// RESPONSIBILITIES:
//   • Parse SQL column definitions
//   • Infer PulseField types from SQL types
//   • Normalize field names
//   • Validate against PulseField rules
//   • Produce deterministic PulseField objects
//
// SAFETY RULES (CRITICAL):
//   • READ‑ONLY — no file writes
//   • NO eval(), NO Function(), NO dynamic imports
//   • NO executing SQL
//   • NO network calls
//   • Deterministic translation only
//
// ------------------------------------------------------
// SQL → Pulse Translator
// ------------------------------------------------------

import { SQLToPulse, PulseFieldTypes, validatePulseField } from "../pulse-specs/pulseFields.js";

/**
 * translateSQLColumn(sqlType, columnName)
 * Converts a SQL column definition into a PulseField object.
 */
export function translateSQLColumn(sqlType, columnName) {
  if (!sqlType || !columnName) {
    throw new Error("sqlToPulse: missing sqlType or columnName");
  }

  const normalized = sqlType.toUpperCase().trim();
  const pulseType = SQLToPulse[normalized] || PulseFieldTypes.STRING;

  const field = {
    name: normalizeFieldName(columnName),
    type: pulseType,
    source: "sql",
    originalType: normalized,
  };

  validatePulseField(field);
  return field;
}

/**
 * translateSQLSchema(schemaObject)
 * Example input:
 * {
 *   id: "INT",
 *   name: "VARCHAR",
 *   created_at: "TIMESTAMP"
 * }
 */
export function translateSQLSchema(schemaObject = {}) {
  const out = {};

  for (const [columnName, sqlType] of Object.entries(schemaObject)) {
    out[columnName] = translateSQLColumn(sqlType, columnName);
  }

  return out;
}

/**
 * translateSQLQuery(queryString)
 * Extracts SELECT fields and infers PulseField types.
 * This is a lightweight parser — NOT a SQL executor.
 */
export function translateSQLQuery(queryString = "") {
  const fields = extractSelectFields(queryString);
  return fields.map((f) => ({
    name: normalizeFieldName(f),
    type: PulseFieldTypes.STRING, // default inference
    source: "sql-query",
  }));
}

// ------------------------------------------------------
// Helpers
// ------------------------------------------------------

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
