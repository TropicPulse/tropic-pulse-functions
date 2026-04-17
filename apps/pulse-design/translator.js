// FILE: tropic-pulse-functions/apps/pulse-design/translator.js

//
// ------------------------------------------------------
// 📘 PAGE INDEX — Source of Truth for This File
// ------------------------------------------------------
//
// ROLE:
//   Translator — top‑level orchestrator for the VS/HTML → JS → Manifest
//   translation pipeline. This module coordinates RepoWalker,
//   FileClassifier, and ManifestWriter to produce the canonical
//   pulse_project.json manifest.
//
// PURPOSE:
//   • Provide a single entry point for generating the Pulse project manifest
//   • Make the entire system AI‑readable and human‑readable
//   • Produce deterministic, drift‑proof architecture snapshots
//
// OUTPUT:
//   • /pulse_project.json — the canonical architecture manifest
//
// RESPONSIBILITIES:
//   • Walk the repo (via RepoWalker)
//   • Classify files (via FileClassifier)
//   • Write manifest (via ManifestWriter)
//   • Enforce deterministic ordering and stable output
//
// SAFETY RULES (CRITICAL):
//   • READ‑ONLY except for writing the manifest output
//   • NO eval(), NO Function(), NO dynamic imports
//   • NO executing scanned code
//   • NO network calls
//   • Deterministic output only
//
// ------------------------------------------------------
// Translator — Pipeline Orchestrator
// ------------------------------------------------------

import path from "path";
import { walkRepo } from "./repoWalker.js";
import { writeManifest } from "./manifestWriter.js";

/**
 * buildPulseManifest(rootDir)
 * @param {string} rootDir — absolute path to project root
 * @returns {object} result metadata
 */
export async function buildPulseManifest(rootDir) {
  if (!rootDir) {
    throw new Error("translator: missing rootDir");
  }

  const absRoot = path.resolve(rootDir);

  // ------------------------------------------------------
  // Step 1 — Walk repo + classify files
  // ------------------------------------------------------
  const classifiedFiles = walkRepo(absRoot);

  // ------------------------------------------------------
  // Step 2 — Write manifest
  // ------------------------------------------------------
  const result = writeManifest(absRoot, classifiedFiles);

  return {
    success: true,
    ...result,
  };
}
