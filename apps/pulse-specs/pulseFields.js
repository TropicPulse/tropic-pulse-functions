// FILE: tropic-pulse-functions/apps/pulse-specs/pulseFields.js

//
// ------------------------------------------------------
// 📘 PAGE INDEX — Source of Truth for This File
// ------------------------------------------------------
//
// ROLE:
//   PulseFields — the canonical, deterministic data specification for the
//   entire Pulse OS. This file defines the universal field language used
//   across SQL, Firestore, Pulse‑Fields, translators, AI reasoning,
//   healing, routing, and component generation.
//
// PURPOSE:
//   • Provide a single, stable, OS‑level data contract
//   • Define all PulseField types and validation rules
//   • Define SQL ↔ Pulse ↔ Firestore mapping rules
//   • Make the data layer AI‑readable and human‑readable
//   • Enable deterministic translation and healing
//
// OUTPUT:
//   • A structured JS object describing all PulseField types + rules
//
// RESPONSIBILITIES:
//   • Define canonical field types
//   • Define validation rules
//   • Define default values
//   • Define constraints
//   • Define mapping rules for SQL + Firestore
//   • Provide helper functions for translators
//
// SAFETY RULES (CRITICAL):
//   • READ‑ONLY — no file writes
//   • NO eval(), NO Function(), NO dynamic imports
//   • NO executing user code
//   • NO network calls
//   • Deterministic output only
//
// ------------------------------------------------------
// Pulse‑Fields v1 — Canonical Data Specification
// ------------------------------------------------------

/**
 * PulseField Types — the universal data language
 * These are the ONLY allowed field types in Pulse OS.
 */
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
};

/**
 * Validation rules for each field type.
 * These rules are deterministic and used by:
 *   • translators
 *   • healing engine
 *   • AI reasoning
 *   • component generators
 */
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
  json: {},
};

/**
 * SQL → PulseField mapping rules
 */
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
};

/**
 * Firestore → PulseField mapping rules
 */
export const FirestoreToPulse = {
  string: PulseFieldTypes.STRING,
  number: PulseFieldTypes.NUMBER,
  boolean: PulseFieldTypes.BOOLEAN,
  timestamp: PulseFieldTypes.TIMESTAMP,
  array: PulseFieldTypes.ARRAY,
  map: PulseFieldTypes.OBJECT,
  null: PulseFieldTypes.JSON,
};

/**
 * PulseField → SQL mapping rules
 */
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
};

/**
 * PulseField → Firestore mapping rules
 */
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
};

/**
 * validatePulseField(field)
 * Ensures a field definition follows PulseField rules.
 */
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
