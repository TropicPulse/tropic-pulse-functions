// FILE: tropic-pulse-functions/apps/pulse-design/repoWalker.js

//
// ------------------------------------------------------
// 📘 PAGE INDEX — Source of Truth for This File
// ------------------------------------------------------
//
// ROLE:
//   RepoWalker — deterministic, read‑only directory walker that scans the
//   project filesystem, reads file contents, and passes them to the
//   FileClassifier for structured metadata extraction.
//
// PURPOSE:
//   • Provide ManifestBuilder with a complete, classified file list
//   • Walk the repo deterministically
//   • Read files safely (UTF‑8 only)
//   • Skip build artifacts and irrelevant directories
//
// OUTPUT:
//   • Array of classified file objects
//
// RESPONSIBILITIES:
//   • Walk directories recursively
//   • Read file contents safely
//   • Pass filePath + content to FileClassifier
//   • Return structured metadata for each file
//
// SAFETY RULES (CRITICAL):
//   • READ‑ONLY — no file writes
//   • NO eval(), NO Function(), NO dynamic imports
//   • NO executing user code
//   • NO network calls
//   • NO mutation of scanned files
//   • Deterministic output only
//
// ------------------------------------------------------
// RepoWalker — Deterministic Directory Scanner
// ------------------------------------------------------

import fs from "fs";
import path from "path";
import { classifyFile } from "./fileClassifier.js";

/**
 * walkRepo(rootDir)
 * @param {string} rootDir — absolute path to project root
 * @returns {Array<object>} classified file metadata
 */
export function walkRepo(rootDir) {
  const results = [];

  walk(rootDir, (fullPath) => {
    const rel = path.relative(rootDir, fullPath);

    // Skip irrelevant directories
    if (
      rel.includes("node_modules") ||
      rel.includes(".next") ||
      rel.includes("dist") ||
      rel.includes("build") ||
      rel.includes(".git")
    ) {
      return;
    }

    const content = safeRead(fullPath);
    const classification = classifyFile(rel, content);

    results.push(classification);
  });

  return results;
}

// ------------------------------------------------------
// walk(dir, callback) — recursive directory walker
// ------------------------------------------------------
function walk(dir, callback) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      walk(fullPath, callback);
    } else {
      callback(fullPath);
    }
  }
}

// ------------------------------------------------------
// safeRead(filePath)
// ------------------------------------------------------
function safeRead(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch {
    return "";
  }
}
