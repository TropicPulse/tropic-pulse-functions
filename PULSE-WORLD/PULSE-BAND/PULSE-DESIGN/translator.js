// ============================================================================
// FILE: tropic-pulse-functions/PULSE-WORLD/PULSE-DESIGN/translator.js
// LAYER: THE ARCHITECT (v10.4 Orchestrator + Genome Conductor)
// ============================================================================

import path from "path";
import { walkRepo } from "./repoWalker.js";
import { writeManifest } from "./manifestWriter.js";
import { buildOrganismMap } from "./organismMap.js";

// ============================================================================
// PUBLIC API — Full Architectural Translation Pipeline (v10.4)
// ============================================================================
export async function buildPulseManifest(rootDir) {
  if (!rootDir) {
    throw new Error("translator: missing rootDir");
  }

  const absRoot = path.resolve(rootDir);

  // --------------------------------------------------------------------------
  // Step 1 — Cartographer: Walk repo + classify files
  // --------------------------------------------------------------------------
  const classifiedFiles = walkRepo(absRoot);

  // --------------------------------------------------------------------------
  // Step 2 — Architect: Build organism map (v10.4)
  // --------------------------------------------------------------------------
  const organism = buildOrganismMap(classifiedFiles);

  // --------------------------------------------------------------------------
  // Step 3 — Surveyor: Write canonical manifest
  // --------------------------------------------------------------------------
  const manifest = {
    generatedAt: new Date().toISOString(),
    root: absRoot,
    files: classifiedFiles,
    organism,
  };

  const result = writeManifest(absRoot, manifest);

  return {
    success: true,
    manifestPath: result.manifestPath,
    fileCount: classifiedFiles.length,
    organism,
  };
}
