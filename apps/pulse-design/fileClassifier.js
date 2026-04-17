// FILE: tropic-pulse-functions/apps/pulse-design/fileClassifier.js

//
// ------------------------------------------------------
// 📘 PAGE INDEX — Source of Truth for This File
// ------------------------------------------------------
//
// ROLE:
//   FileClassifier — deterministic, read‑only module that inspects a file’s
//   path + content and returns a structured classification describing its
//   identity, purpose, and metadata.
//
// PURPOSE:
//   • Provide a clean, isolated classification engine for ManifestBuilder
//   • Make file identity AI‑readable and human‑readable
//   • Detect file type (page, component, layout, api, util, unknown)
//   • Detect PulseBand usage
//   • Detect healing hooks
//   • Detect data sources (SQL, Firestore, Pulse‑Fields)
//
// OUTPUT:
//   • A structured JS object describing the file
//
// RESPONSIBILITIES:
//   • Pure classification — NO filesystem access
//   • Accept filePath + fileContent as inputs
//   • Return deterministic metadata
//   • Never mutate input
//   • Never throw unless filePath is invalid
//
// SAFETY RULES (CRITICAL):
//   • READ‑ONLY — no file writes
//   • NO eval(), NO Function(), NO dynamic imports
//   • NO executing user code
//   • NO network calls
//   • Deterministic output only
//
// ------------------------------------------------------
// FileClassifier — Pure Classification Engine
// ------------------------------------------------------

import path from "path";

/**
 * classifyFile(filePath, content)
 * @param {string} filePath — relative path from project root
 * @param {string} content — file contents as UTF‑8 string
 * @returns {object} classification metadata
 */
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

// ------------------------------------------------------
// detectType(filePath)
// ------------------------------------------------------
function detectType(filePath) {
  const lower = filePath.toLowerCase();

  if (lower.includes("/pages/") && lower.endsWith(".js")) return "page";
  if (lower.includes("/components/") && lower.endsWith(".js")) return "component";
  if (lower.includes("/layouts/") && lower.endsWith(".js")) return "layout";
  if (lower.includes("/api/") && lower.endsWith(".js")) return "api";

  return "unknown";
}

// ------------------------------------------------------
// detectPulseBand(content)
// ------------------------------------------------------
function detectPulseBand(content) {
  return (
    content.includes("usePulseBand") ||
    content.includes("PulseBand") ||
    content.includes("pulseband")
  );
}

// ------------------------------------------------------
// detectHealing(content)
// ------------------------------------------------------
function detectHealing(content) {
  return (
    content.includes("useHealing") ||
    content.includes("healing") ||
    content.includes("HealHook")
  );
}

// ------------------------------------------------------
// detectDataSources(content)
// ------------------------------------------------------
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
