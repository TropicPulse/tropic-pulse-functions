// FILE: tropic-pulse-functions/apps/pulse-translator/firestoreToPulse.js

//
// ------------------------------------------------------
// 📘 PAGE INDEX — Source of Truth for This File
// ------------------------------------------------------
//
// ROLE:
//   FirestoreToPulse — deterministic, read‑only translator that converts
//   Firestore document values and inferred Firestore types into canonical
//   Pulse‑Field definitions.
//
// PURPOSE:
//   • Convert Firestore runtime values → PulseField types
//   • Convert Firestore document snapshots → PulseField schemas
//   • Provide a stable, AI‑readable + human‑readable translation layer
//   • Enable backend + frontend AI to understand Firestore safely
//
// OUTPUT:
//   • PulseField objects
//   • PulseField schema maps
//   • Deterministic translation results
//
// RESPONSIBILITIES:
//   • Infer PulseField types from Firestore values
//   • Normalize field names
//   • Validate PulseField definitions
//   • Produce deterministic PulseField objects
//
// SAFETY RULES (CRITICAL):
//   • READ‑ONLY — no file writes
//   • NO eval(), NO Function(), NO dynamic imports
//   • NO executing Firestore code
//   • NO network calls
//   • Deterministic translation only
//
// ------------------------------------------------------
// Firestore → Pulse Translator
// ------------------------------------------------------

import {
  FirestoreToPulse,
  PulseFieldTypes,
  validatePulseField,
} from "../pulse-specs/pulseFields.js";

/**
 * inferPulseTypeFromFirestore(value)
 * Determines the PulseField type based on Firestore runtime value.
 */
export function inferPulseTypeFromFirestore(value) {
  if (value === null || value === undefined) return PulseFieldTypes.JSON;

  const t = typeof value;

  if (t === "string") return PulseFieldTypes.STRING;
  if (t === "number") return PulseFieldTypes.NUMBER;
  if (t === "boolean") return PulseFieldTypes.BOOLEAN;

  // Firestore Timestamp
  if (value && value.toDate && typeof value.toDate === "function") {
    return PulseFieldTypes.TIMESTAMP;
  }

  // Array
  if (Array.isArray(value)) return PulseFieldTypes.ARRAY;

  // Map/Object
  if (t === "object") return PulseFieldTypes.OBJECT;

  return PulseFieldTypes.JSON;
}

/**
 * translateFirestoreField(fieldName, value)
 * Converts a Firestore field into a PulseField object.
 */
export function translateFirestoreField(fieldName, value) {
  const pulseType = inferPulseTypeFromFirestore(value);

  const field = {
    name: normalizeFieldName(fieldName),
    type: pulseType,
    source: "firestore",
    originalValueType: typeof value,
  };

  validatePulseField(field);
  return field;
}

/**
 * translateFirestoreDocument(docData)
 * Converts a Firestore document (plain JS object) into a PulseField schema.
 */
export function translateFirestoreDocument(docData = {}) {
  const out = {};

  for (const [key, value] of Object.entries(docData)) {
    out[key] = translateFirestoreField(key, value);
  }

  return out;
}

/**
 * translateFirestoreSnapshot(snapshot)
 * Accepts a Firestore DocumentSnapshot.
 */
export function translateFirestoreSnapshot(snapshot) {
  if (!snapshot || typeof snapshot.data !== "function") {
    throw new Error("firestoreToPulse: invalid snapshot");
  }

  const data = snapshot.data() || {};
  return translateFirestoreDocument(data);
}

// ------------------------------------------------------
// Helpers
// ------------------------------------------------------

function normalizeFieldName(name) {
  return name.trim().toLowerCase().replace(/[^a-z0-9_]/g, "_");
}
