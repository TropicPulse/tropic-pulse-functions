// ============================================================================
// FILE: /apps/pulse-translator/PulseTranslatorRNAOutput.js
// [pulse:translator] PULSE_TRANSLATOR_RNA_OUTPUT v10.4  // gold‑white
// Pulse → Firestore Output RNA • Deterministic • Drift‑Proof • Genome‑Driven
// PURE TRANSLATOR — NO IO • NO NETWORK • NO FIRESTORE EXECUTION
// ============================================================================
//
// IDENTITY — THE RNA OUTPUT TRANSLATOR (v10.4):
//  --------------------------------------------
//  • Converts PulseField definitions + values → Firestore‑safe payloads.
//  • Converts PulseField schemas → Firestore document objects.
//  • Uses the OS DNA Genome (PulseSpecsDNAGenome v10.4) as the source of truth.
//  • Deterministic, safe, drift‑proof, read‑only.
//  • Zero Firestore execution — only produces plain JS objects.
//
// ROLE IN THE ORGANISM (v10.4):
//  -----------------------------
//  • DNA → PulseSpecsDNAGenome.js (v10.4 gold‑white genome)
//  • RNA Intake → PulseTranslatorRNAIntake.js
//  • RNA Output → THIS FILE (Pulse → Firestore)
//  • Proteins → actual Firestore documents written by the system
//
// SAFETY CONTRACT (v10.4):
//  ------------------------
//  • Read‑only — no writes, no mutation.
//  • No eval(), no Function(), no dynamic imports.
//  • No network calls.
//  • No Firestore execution.
//  • Deterministic: same input → same output.
//  • All types validated against the genome.
// ============================================================================

import {
  PulseToFirestore,
  PulseFieldTypes,
  validatePulseField
} from "../pulse-specs/PulseSpecsDNAGenome.js";


// ============================================================================
//  translatePulseFieldToFirestore(field, value)
//  Converts a PulseField + value → Firestore‑safe value.
// ============================================================================
export function translatePulseFieldToFirestore(field, value) {
  validatePulseField(field);

  // --------------------------------------------------------------------------
  // NULLABLE WRAPPER
  // --------------------------------------------------------------------------
  if (field.type === PulseFieldTypes.NULLABLE) {
    if (value === null || value === undefined) {
      return { isNull: true, value: null };
    }

    return {
      isNull: false,
      value: translatePulseFieldToFirestore(
        { type: field.innerType || PulseFieldTypes.JSON },
        value
      )
    };
  }

  // --------------------------------------------------------------------------
  // ENUM → string
  // --------------------------------------------------------------------------
  if (field.type === PulseFieldTypes.ENUM) {
    return String(value ?? "");
  }

  // --------------------------------------------------------------------------
  // CURRENCY → number (fixed scale)
  // --------------------------------------------------------------------------
  if (field.type === PulseFieldTypes.CURRENCY) {
    const num = Number(value);
    return isNaN(num)
      ? 0
      : Number(num.toFixed(field.scale ?? 2));
  }

  // --------------------------------------------------------------------------
  // PERCENT → number (0–100 or normalized)
// --------------------------------------------------------------------------
  if (field.type === PulseFieldTypes.PERCENT) {
    const num = Number(value);
    if (isNaN(num)) return 0;

    return field.normalized
      ? Math.max(0, Math.min(1, num))
      : Math.max(0, Math.min(100, num));
  }

  // --------------------------------------------------------------------------
  // BASE TYPE MAPPING (Genome → Firestore)
// --------------------------------------------------------------------------
  const fsType = PulseToFirestore[field.type] || "string";

  switch (fsType) {
    case "string":
      return value != null ? String(value) : "";

    case "number":
      return Number(value) || 0;

    case "boolean":
      return Boolean(value);

    case "timestamp":
      // Deterministic timestamp conversion
      if (value instanceof Date) return value;
      if (typeof value === "number") return new Date(value);
      if (typeof value === "string") return new Date(value);
      return new Date();

    case "array":
      return Array.isArray(value) ? value : [];

    case "map":
      return typeof value === "object" && value !== null ? value : {};

    default:
      return value;
  }
}


// ============================================================================
//  translatePulseSchemaToFirestore(schemaObject, dataObject)
//  Converts a PulseField schema + data → Firestore document.
// ============================================================================
export function translatePulseSchemaToFirestore(schemaObject = {}, dataObject = {}) {
  const out = {};

  for (const [key, field] of Object.entries(schemaObject)) {
    const value = dataObject[key];
    out[key] = translatePulseFieldToFirestore(field, value);
  }

  return out;
}


// ============================================================================
//  generateFirestoreWritePayload(schemaObject, dataObject)
//  Produces a Firestore‑ready payload for setDoc/updateDoc.
// ============================================================================
export function generateFirestoreWritePayload(schemaObject = {}, dataObject = {}) {
  return translatePulseSchemaToFirestore(schemaObject, dataObject);
}


// ============================================================================
//  Helpers
// ============================================================================
function normalizeFieldName(name) {
  return name.trim().toLowerCase().replace(/[^a-z0-9_]/g, "_");
}
