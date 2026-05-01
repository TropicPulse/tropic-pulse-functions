// ============================================================================
// FILE: tropic-pulse-functions/PULSE-WORLD/PULSE-DESIGN/manifestWriter.js
// LAYER: THE SURVEYOR (Canonical Blueprint Writer)
// ============================================================================

import fs from "fs";
import path from "path";

// ============================================================================
// PUBLIC API — Write Canonical Manifest (v10.4)
// ============================================================================
export function writeManifest(rootDir, manifest) {
  if (!rootDir) {
    throw new Error("manifestWriter: missing rootDir");
  }
  if (!manifest) {
    throw new Error("manifestWriter: missing manifest object");
  }

  const outPath = path.join(rootDir, "pulse_project.json");

  // Deterministic write
  fs.writeFileSync(outPath, JSON.stringify(manifest, null, 2), "utf8");

  return {
    success: true,
    manifestPath: outPath,
    fileCount: manifest.files?.length || 0,
  };
}
