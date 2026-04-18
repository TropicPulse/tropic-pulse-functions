// ============================================================================
// FILE: tropic-pulse-functions/apps/pulse-design/translator.js
// LAYER: THE ARCHITECT (Master Orchestrator + System Translator)
// ============================================================================
//
// ROLE:
//   THE ARCHITECT — Top‑level orchestrator for the Pulse‑Design pipeline
//   • Coordinates the Cartographer (RepoWalker)
//   • Delegates classification to the Anatomist (FileClassifier)
//   • Hands results to the Surveyor (ManifestWriter)
//   • Produces the canonical pulse_project.json manifest
//
// PURPOSE:
//   • Provide a single entry point for generating the architecture snapshot
//   • Translate raw filesystem structure → unified manifest
//   • Make the entire system AI‑readable + human‑readable
//   • Guarantee deterministic, drift‑proof output
//
// CONTRACT:
//   • READ‑ONLY except for writing manifest output
//   • NO eval(), NO Function(), NO dynamic imports
//   • NO executing scanned code
//   • NO network calls
//   • Deterministic orchestration only
//
// SAFETY:
//   • v6.3 upgrade is COMMENTAL ONLY — NO LOGIC CHANGES
//   • All behavior remains identical to pre‑v6.3 translator.js
// ============================================================================

import path from "path";
import { walkRepo } from "./repoWalker.js";
import { writeManifest } from "./manifestWriter.js";

// ============================================================================
// PUBLIC API — Architectural Translation Pipeline
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
  // Step 2 — Surveyor: Write canonical manifest
  // --------------------------------------------------------------------------
  const result = writeManifest(absRoot, classifiedFiles);

  return {
    success: true,
    ...result,
  };
}
