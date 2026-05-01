// ============================================================================
// FILE: tropic-pulse-functions/PULSE-WORLD/PULSE-DESIGN/fileClassifier.js
// LAYER: THE ANATOMIST (Structural Classifier + Identity Mapper + Evolutionary Morphology)
// ============================================================================
//
// ROLE (v7.1+):
//   THE ANATOMIST — Pure structural classifier for Pulse OS files.
//   • Inspects file path + content.
//   • Determines identity, type, and structural metadata.
//   • Provides deterministic classification for ManifestBuilder.
//   • Acts as the “morphology lab” of the digital organism.
//
// PURPOSE (v7.1+):
//   • Make file identity AI‑readable + human‑readable.
//   • Detect file type (page, component, layout, api, util, unknown).
//   • Detect PulseBand usage, healing hooks, and data sources.
//   • Surface evolutionary structural patterns (conceptual only).
//
// CONTRACT (unchanged):
//   • PURE FUNCTION — no filesystem access.
//   • READ‑ONLY — no writes.
//   • NO eval(), NO Function(), NO dynamic imports.
//   • NO executing user code.
//   • NO network calls.
//   • Deterministic output only.
//
// SAFETY (unchanged):
//   • v7.1+ upgrade is COMMENTAL ONLY — NO LOGIC CHANGES.
//   • All behavior remains identical to pre‑v7.1 fileClassifier.
// ============================================================================

import path from "path";

// ============================================================================
// PUBLIC API — Anatomical Classification
// ============================================================================
export function classifyFile(filePath, content = "") {
  if (!filePath) {
    throw new Error("fileClassifier: missing filePath");
  }

  const ext = path.extname(filePath);
  const type = detectType(filePath);
  const usesPulseBand = detectPulseBand(content);
  const usesHealing = detectHealing(content);
  const dataSources = detectDataSources(content);

  return {
    path: filePath,
    ext,
    type,
    usesPulseBand,
    usesHealing,
    dataSources,
  };
}

// ============================================================================
// TYPE DETECTION — Structural Identity
// ============================================================================
function detectType(filePath) {
  const lower = filePath.toLowerCase();

  if (lower.includes("/pages/") && lower.endsWith(".js")) return "page";
  if (lower.includes("/components/") && lower.endsWith(".js")) return "component";
  if (lower.includes("/layouts/") && lower.endsWith(".js")) return "layout";
  if (lower.includes("/api/") && lower.endsWith(".js")) return "api";

  return "unknown";
}

// ============================================================================
// FEATURE DETECTION — PulseBand
// ============================================================================
function detectPulseBand(content) {
  return (
    content.includes("usePulseBand") ||
    content.includes("PulseBand") ||
    content.includes("pulseband")
  );
}

// ============================================================================
// FEATURE DETECTION — Healing Hooks
// ============================================================================
function detectHealing(content) {
  return (
    content.includes("useHealing") ||
    content.includes("healing") ||
    content.includes("HealHook")
  );
}

// ============================================================================
// DATA SOURCE DETECTION — Firestore, SQL, PulseFields
// ============================================================================
function detectDataSources(content) {
  const sources = [];

  // Firestore
  if (
    content.includes("collection(") ||
    content.includes("getDoc(") ||
    content.includes("getDocs(")
  ) {
    sources.push({ type: "firestore" });
  }

  // SQL
  if (
    content.includes("SELECT ") ||
    content.includes("INSERT ") ||
    content.includes("UPDATE ") ||
    content.includes("DELETE ")
  ) {
    sources.push({ type: "sql" });
  }

  // Pulse‑Fields
  if (
    content.includes("pulse_field") ||
    content.includes("PulseField") ||
    content.includes("pulse.fields")
  ) {
    sources.push({ type: "pulse-fields" });
  }

  return sources;
}
