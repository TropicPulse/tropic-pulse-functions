// ============================================================================
// FILE: tropic-pulse-functions/apps/PULSE-DESIGN/repoWalker.js
// LAYER: THE CARTOGRAPHER (Terrain Explorer + Directory Mapper + Evolutionary Topographer)
// ============================================================================
//
// ROLE (v7.1+):
//   THE CARTOGRAPHER — Deterministic explorer of the Pulse OS filesystem.
//   • Walks the entire directory tree.
//   • Reads file contents safely.
//   • Passes data to the Anatomist (FileClassifier).
//   • Produces the raw map of the project terrain.
//   • Acts as the “topographer” of the digital organism.
//
// PURPOSE (v7.1+):
//   • Provide the Archivist with a complete, classified file list.
//   • Traverse the repo deterministically and safely.
//   • Skip irrelevant or dangerous directories.
//   • Preserve the organism’s terrain map (conceptual only).
//
// CONTRACT (unchanged):
//   • READ‑ONLY — no writes.
//   • NO eval(), NO Function(), NO dynamic imports.
//   • NO executing user code.
//   • NO network calls.
//   • Deterministic traversal only.
//
// SAFETY (unchanged):
//   • v7.1+ upgrade is COMMENTAL ONLY — NO LOGIC CHANGES.
//   • All behavior remains identical to pre‑v7.1 repoWalker.
// ============================================================================
import fs from "fs";
import path from "path";
import { classifyFile } from "./fileClassifier.js";

// ============================================================================
// PUBLIC API — Cartographic Scan (Terrain Mapping)
// ============================================================================
export function walkRepo(rootDir) {
  const results = [];

  walk(rootDir, (fullPath) => {
    const rel = path.relative(rootDir, fullPath);

    // Skip irrelevant or unsafe directories
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

// ============================================================================
// DIRECTORY WALKER — Recursive Terrain Traversal
// ============================================================================
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

// ============================================================================
// SAFE READ — Silent, Non‑Throwing File Access
// ============================================================================
function safeRead(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch {
    return "";
  }
}
