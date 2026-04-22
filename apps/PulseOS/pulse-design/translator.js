// ============================================================================
// FILE: tropic-pulse-functions/apps/pulse-design/translator.js
// LAYER: THE ARCHITECT (Master Orchestrator + System Translator + Evolutionary Blueprint Conductor)
// ============================================================================
//
// ROLE (v7.1+):
//   THE ARCHITECT — Top‑level orchestrator for the Pulse‑Design pipeline.
//   • Coordinates the Cartographer (RepoWalker).
//   • Delegates classification to the Anatomist (FileClassifier).
//   • Hands results to the Surveyor (ManifestWriter).
//   • Produces the canonical pulse_project.json manifest.
//   • Acts as the “chief architect” of the digital organism.
//
// PURPOSE (v7.1+):
//   • Provide a single entry point for generating the architecture snapshot.
//   • Translate raw filesystem structure → unified manifest.
//   • Make the entire system AI‑readable + human‑readable.
//   • Guarantee deterministic, drift‑proof output.
//   • Preserve the organism’s architectural lineage (conceptual only).
//
// CONTRACT (unchanged):
//   • READ‑ONLY except for writing manifest output.
//   • NO eval(), NO Function(), NO dynamic imports.
//   • NO executing scanned code.
//   • NO network calls.
//   • Deterministic orchestration only.
//
// SAFETY (unchanged):
//   • v7.1+ upgrade is COMMENTAL ONLY — NO LOGIC CHANGES.
//   • All behavior remains identical to pre‑v7.1 translator.js.
// ============================================================================

import path from "path";
import { walkRepo } from "./repoWalker.js";
import { writeManifest } from "./manifestWriter.js";

// ============================================================================
// PUBLIC API — Architectural Translation Pipeline (Master Orchestration)
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
