// ============================================================================
// FILE: tropic-pulse-functions/PULSE-WORLD/PULSE-DESIGN/manifestBuilder.js
// LAYER: THE ARCHIVIST (System Historian + Canonical Recorder + Genome Builder)
// ============================================================================
//
// ROLE (v10.4):
//   THE ARCHIVIST — Deterministic repo‑wide scanner + cataloger.
//   • Walks the entire project directory (via repoWalker).
//   • Classifies files using THE ANATOMIST (fileClassifier.js).
//   • Extracts structural + behavioral metadata.
//   • Produces the canonical architecture manifest.
//   • Acts as the “genome archivist” of the digital organism.
//
// CONTRACT:
//   • READ‑ONLY — no writes except manifest output.
//   • PURE — no eval(), no Function(), no dynamic imports.
//   • NO executing user code.
//   • NO network calls.
//   • Deterministic output only.
// ============================================================================

import path from "path";
import { walkRepo } from "./repoWalker.js";
import { classifyFile } from "./fileClassifier.js";
import { writeManifest } from "./manifestWriter.js";

// ============================================================================
// PUBLIC API — Build Canonical Architecture Manifest
// ============================================================================
export async function buildManifest(rootDir) {
  const manifest = {
    generatedAt: new Date().toISOString(),
    root: rootDir,

    // Canonical v10.4 fields
    files: [],
    pages: [],
    components: [],
    layouts: [],
    apis: [],
    pulseband: [],
    healingHooks: [],
    dataSources: [],

    // Evolutionary metadata (v10.4)
    lineage: [],
    patterns: [],
    organs: [],
    drift: [],
    routing: [],
  };

  // Deterministic repo walk
  const filePaths = walkRepo(rootDir);

  for (const absPath of filePaths) {
    const relPath = path.relative(rootDir, absPath);

    // Skip build artifacts
    if (
      relPath.includes("node_modules") ||
      relPath.includes(".next") ||
      relPath.includes("dist")
    ) {
      continue;
    }

    // Anatomical classification
    const fileInfo = classifyFile(absPath);

    manifest.files.push(fileInfo);

    // Structural categorization
    if (fileInfo.type === "page") manifest.pages.push(fileInfo);
    if (fileInfo.type === "component") manifest.components.push(fileInfo);
    if (fileInfo.type === "layout") manifest.layouts.push(fileInfo);
    if (fileInfo.type === "api") manifest.apis.push(fileInfo);

    // Feature categorization
    if (fileInfo.usesPulseBand) manifest.pulseband.push(fileInfo);
    if (fileInfo.usesHealing) manifest.healingHooks.push(fileInfo);

    if (fileInfo.dataSources.length > 0) {
      manifest.dataSources.push(...fileInfo.dataSources);
    }
  }

  // Write canonical manifest
  const outPath = writeManifest(rootDir, manifest);

  return {
    success: true,
    manifestPath: outPath,
    fileCount: manifest.files.length,
  };
}
