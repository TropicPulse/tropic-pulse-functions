// FILE: tropic-pulse-functions/apps/pulse-design/manifestWriter.js

//
// ------------------------------------------------------
// 📘 PAGE INDEX — Source of Truth for This File
// ------------------------------------------------------
//
// ROLE:
//   ManifestWriter — deterministic, read‑only output module that takes the
//   classified file list from RepoWalker + FileClassifier and writes the
//   canonical Pulse project manifest.
//
// PURPOSE:
//   • Produce a stable, AI‑readable + human‑readable architecture snapshot
//   • Ensure deterministic ordering of all manifest sections
//   • Guarantee drift‑proof output for versioning + AI ingestion
//
// OUTPUT:
//   • /pulse_project.json — the canonical architecture manifest
//
// RESPONSIBILITIES:
//   • Accept classified file metadata
//   • Sort and structure manifest sections deterministically
//   • Write manifest to disk safely
//   • Never mutate input
//   • Never execute scanned code
//
// SAFETY RULES (CRITICAL):
//   • READ‑ONLY except for writing the manifest output
//   • NO eval(), NO Function(), NO dynamic imports
//   • NO executing user code
//   • NO network calls
//   • Deterministic output only
//
// ------------------------------------------------------
// ManifestWriter — Deterministic Manifest Output Engine
// ------------------------------------------------------

import fs from "fs";
import path from "path";

/**
 * writeManifest(rootDir, classifiedFiles)
 * @param {string} rootDir — absolute project root
 * @param {Array<object>} classifiedFiles — output from RepoWalker + FileClassifier
 * @returns {object} result metadata
 */
export function writeManifest(rootDir, classifiedFiles = []) {
  if (!rootDir) {
    throw new Error("manifestWriter: missing rootDir");
  }

  // ------------------------------------------------------
  // Build manifest structure
  // ------------------------------------------------------
  const manifest = {
    generatedAt: new Date().toISOString(),
    root: rootDir,
    fileCount: classifiedFiles.length,

    files: sortByPath(classifiedFiles),

    pages: sortByPath(classifiedFiles.filter(f => f.type === "page")),
    components: sortByPath(classifiedFiles.filter(f => f.type === "component")),
    layouts: sortByPath(classifiedFiles.filter(f => f.type === "layout")),
    apis: sortByPath(classifiedFiles.filter(f => f.type === "api")),

    pulseband: sortByPath(classifiedFiles.filter(f => f.usesPulseBand)),
    healingHooks: sortByPath(classifiedFiles.filter(f => f.usesHealing)),

    dataSources: extractDataSources(classifiedFiles),
  };

  // ------------------------------------------------------
  // Write manifest to disk
  // ------------------------------------------------------
  const outPath = path.join(rootDir, "pulse_project.json");

  fs.writeFileSync(outPath, JSON.stringify(manifest, null, 2), "utf8");

  return {
    success: true,
    manifestPath: outPath,
    fileCount: classifiedFiles.length,
  };
}

// ------------------------------------------------------
// sortByPath(list) — deterministic ordering
// ------------------------------------------------------
function sortByPath(list) {
  return [...list].sort((a, b) => a.path.localeCompare(b.path));
}

// ------------------------------------------------------
// extractDataSources(classifiedFiles)
// ------------------------------------------------------
function extractDataSources(files) {
  const out = [];

  for (const f of files) {
    if (Array.isArray(f.dataSources) && f.dataSources.length > 0) {
      for (const ds of f.dataSources) {
        out.push({
          file: f.path,
          ...ds,
        });
      }
    }
  }

  return sortByPath(out.map(ds => ({ path: ds.file, ...ds })));
}
