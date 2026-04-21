// ============================================================================
// FILE: /apps/pulse-translator/PulseTranslatorRNAIntake.js
// [pulse:translator] PULSE_TRANSLATOR_RNA_INTAKE v9.1  // silver-blue
// Firestore → Pulse Intake RNA • Deterministic • Drift‑Proof • Genome‑Driven
// PURE TRANSLATOR — NO IO • NO NETWORK • NO FIRESTORE EXECUTION
// ============================================================================
//
// IDENTITY — THE RNA INTAKE TRANSLATOR:
//  ------------------------------------
//  • Converts Firestore runtime values → canonical PulseField types.
//  • Converts Firestore document snapshots → PulseField schemas.
//  • Uses the OS DNA Genome (PulseSpecsDNAGenome) as the source of truth.
//  • Deterministic, safe, drift‑proof, read‑only.
//  • Zero Firestore execution — only interprets raw JS objects.
//
// ROLE IN THE ORGANISM (v9.1):
//  ----------------------------
//  • DNA → PulseSpecsDNAGenome.js
//  • RNA Intake → THIS FILE (Firestore → Pulse)
//  • RNA Output → PulseTranslatorRNAOutput.js (Pulse → Firestore)
//  • Proteins → actual data structures in the system
//
// SAFETY CONTRACT:
//  ----------------
//  • Read‑only — no writes, no mutation.
//  • No eval(), no Function(), no dynamic imports.
//  • No network calls.
//  • No Firestore execution — snapshot.data() only.
//  • Deterministic: same input → same output.
//  • All types validated against the genome.
// ============================================================================

import {
  PulseFieldTypes,
  validatePulseField
} from "../pulse-specs/PulseSpecsDNAGenome.js";

// ============================================================================
//  inferPulseTypeFromFirestore(value)
//  Genome‑driven type inference for Firestore runtime values.
// ============================================================================
export function inferPulseTypeFromFirestore(value) {
  if (value === null || value === undefined) {
    return PulseFieldTypes.NULLABLE;
  }

  const t = typeof value;

  if (t === "string") return PulseFieldTypes.STRING;
  if (t === "number") return PulseFieldTypes.NUMBER;
  if (t === "boolean") return PulseFieldTypes.BOOLEAN;

  // Firestore Timestamp
  if (value && value.toDate && typeof value.toDate === "function") {
    return PulseFieldTypes.TIMESTAMP;
  }

  if (Array.isArray(value)) return PulseFieldTypes.ARRAY;
  if (t === "object") return PulseFieldTypes.OBJECT;

  return PulseFieldTypes.JSON;
}

// ============================================================================
//  translateFirestoreField(fieldName, value)
//  Converts a Firestore field → canonical PulseField object.
// ============================================================================
export function translateFirestoreField(fieldName, value) {
  const pulseType = inferPulseTypeFromFirestore(value);

  const field = {
    name: normalizeFieldName(fieldName),
    type: pulseType,
    source: "firestore",
    originalValueType: typeof value,
    nullable: value === null || value === undefined
  };

  // Nullable wrapper
  if (field.nullable && field.type !== PulseFieldTypes.NULLABLE) {
    field.type = PulseFieldTypes.NULLABLE;
    field.innerType = PulseFieldTypes.JSON; // safe fallback
  }

  validatePulseField(field);
  return field;
}

// ============================================================================
//  translateFirestoreDocument(docData)
//  Converts a plain Firestore JS object → PulseField schema map.
// ============================================================================
export function translateFirestoreDocument(docData = {}) {
  const out = {};

  for (const [key, value] of Object.entries(docData)) {
    out[key] = translateFirestoreField(key, value);
  }

  return out;
}

// ============================================================================
//  translateFirestoreSnapshot(snapshot)
//  Accepts a Firestore DocumentSnapshot (read‑only).
// ============================================================================
export function translateFirestoreSnapshot(snapshot) {
  if (!snapshot || typeof snapshot.data !== "function") {
    throw new Error("PulseTranslatorRNAIntake: invalid snapshot");
  }

  const data = snapshot.data() || {};
  return translateFirestoreDocument(data);
}

// ============================================================================
//  Helpers
// ============================================================================
function normalizeFieldName(name) {
  return name.trim().toLowerCase().replace(/[^a-z0-9_]/g, "_");
}
