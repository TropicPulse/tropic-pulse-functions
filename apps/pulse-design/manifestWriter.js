// ============================================================================
// FILE: tropic-pulse-functions/apps/pulse-design/manifestWriter.js
// LAYER: THE SURVEYOR (Blueprint Generator + Canonical Output Layer)
// ============================================================================
//
// ROLE:
//   THE SURVEYOR — Produces the official architectural blueprint of Pulse OS
//   • Accepts classified file metadata from the Archivist
//   • Sorts and structures the manifest deterministically
//   • Writes the canonical pulse_project.json snapshot
//
// PURPOSE:
//   • Generate a stable, drift‑proof architecture manifest
//   • Make the system AI‑readable + human‑readable
//   • Provide the authoritative blueprint for the entire repo
//
// CONTRACT:
//   • READ‑ONLY except for writing manifest output
//   • NO eval(), NO Function(), NO dynamic imports
//   • NO executing user code
//   • NO network calls
//   • Deterministic output only
//
// SAFETY:
//   • v6.3 upgrade is COMMENTAL ONLY — NO LOGIC CHANGES
//   • All behavior remains identical to pre‑v6.3 manifestWriter
// ============================================================================

import fs from "fs";
import path from "path";

// ============================================================================
// PUBLIC API — Surveyor Output
// ============================================================================
export function writeManifest(rootDir, classifiedFiles = []) {
  if (!rootDir) {
    throw new Error("manifestWriter: missing rootDir");
  }

  // --------------------------------------------------------------------------
  // Build canonical blueprint
  // --------------------------------------------------------------------------
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

  // --------------------------------------------------------------------------
  // Write official blueprint to disk
  // --------------------------------------------------------------------------
  const outPath = path.join(rootDir, "pulse_project.json");

  fs.writeFileSync(outPath, JSON.stringify(manifest, null, 2), "utf8");

  return {
    success: true,
    manifestPath: outPath,
    fileCount: classifiedFiles.length,
  };
}

// ============================================================================
// SORTING — Deterministic Ordering
// ============================================================================
function sortByPath(list) {
  return [...list].sort((a, b) => a.path.localeCompare(b.path));
}

// ============================================================================
// DATA SOURCE EXTRACTION — Structured Survey Output
// ============================================================================
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
