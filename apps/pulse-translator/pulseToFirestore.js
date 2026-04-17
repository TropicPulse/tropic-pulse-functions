// FILE: tropic-pulse-functions/apps/pulse-translator/pulseToFirestore.js

//
// ------------------------------------------------------
// 📘 PAGE INDEX — Source of Truth for This File
// ------------------------------------------------------
//
// ROLE:
//   PulseToFirestore — deterministic, read‑only translator that converts
//   PulseField definitions and PulseField schemas into Firestore‑safe
//   document structures.
//
// PURPOSE:
//   • Convert PulseField objects → Firestore value types
//   • Convert PulseField schemas → Firestore document payloads
//   • Provide a stable, AI‑readable + human‑readable translation layer
//   • Enable backend AI to generate Firestore writes safely
//
// OUTPUT:
//   • Firestore‑safe values
//   • Firestore document objects
//   • Deterministic translation results
//
// RESPONSIBILITIES:
//   • Map PulseField types → Firestore types
//   • Normalize field names
//   • Validate PulseField definitions
//   • Produce deterministic Firestore payloads
//
// SAFETY RULES (CRITICAL):
//   • READ‑ONLY — no Firestore writes
//   • NO eval(), NO Function(), NO dynamic imports
//   • NO executing Firestore code
//   • NO network calls
//   • Deterministic translation only
//
// ------------------------------------------------------
// Pulse → Firestore Translator
// ------------------------------------------------------

import {
  PulseToFirestore,
  PulseFieldTypes,
  validatePulseField,
} from "../pulse-specs/pulseFields.js";

/**
 * translatePulseFieldToFirestore(field, value)
 * Converts a PulseField + value into a Firestore‑safe value.
 */
export function translatePulseFieldToFirestore(field, value) {
  validatePulseField(field);

  const fsType = PulseToFirestore[field.type] || "string";

  switch (fsType) {
    case "string":
      return value != null ? String(value) : "";
    case "number":
      return Number(value) || 0;
    case "boolean":
      return Boolean(value);
    case "timestamp":
      return value instanceof Date ? value : new Date(value || Date.now());
    case "array":
      return Array.isArray(value) ? value : [];
    case "map":
      return typeof value === "object" && value !== null ? value : {};
    default:
      return value;
  }
}

/**
 * translatePulseSchemaToFirestore(schemaObject, dataObject)
 * Converts a PulseField schema + data into a Firestore document.
 *
 * Example:
 * schema = {
 *   id: { name: "id", type: "id" },
 *   name: { name: "name", type: "string" }
 * }
 *
 * data = {
 *   id: "123",
 *   name: "Aldwyn"
 * }
 */
export function translatePulseSchemaToFirestore(schemaObject = {}, dataObject = {}) {
  const out = {};

  for (const [key, field] of Object.entries(schemaObject)) {
    const value = dataObject[key];
    out[key] = translatePulseFieldToFirestore(field, value);
  }

  return out;
}

/**
 * generateFirestoreWritePayload(schemaObject, dataObject)
 * Produces a Firestore‑ready payload for setDoc/updateDoc.
 */
export function generateFirestoreWritePayload(schemaObject = {}, dataObject = {}) {
  return translatePulseSchemaToFirestore(schemaObject, dataObject);
}

// ------------------------------------------------------
// Helpers
// ------------------------------------------------------

function normalizeFieldName(name) {
  return name.trim().toLowerCase().replace(/[^a-z0-9_]/g, "_");
}
