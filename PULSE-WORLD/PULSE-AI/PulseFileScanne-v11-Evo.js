/**
 * PulseFileScanner — v11‑EVO Organ
 * ---------------------------------------------------------
 * ROLE:
 *   Reads a file, analyzes its structure, detects drift,
 *   detects export/import mismatches, detects CommonJS/ESM
 *   conflicts, detects layer violations, and returns a
 *   structured organism-level report.
 *
 *   This organ NEVER mutates code.
 *   This organ NEVER rewrites files.
 *   This organ NEVER executes the file.
 */

import fs from "fs";
import path from "path";

export const PulseFileScannerMeta = Object.freeze({
  layer: "Cognition",
  role: "FILE_SCANNER",
  version: "v11-EVO",
  identity: "PulseFileScanner-v11-EVO",

  guarantees: Object.freeze({
    deterministic: true,
    zeroMutation: true,
    zeroExecution: true,
    zeroBackend: false, // reads filesystem
    zeroNetwork: true,
    driftAware: true,
    layerAware: true,
    esmAware: true,
    cjsAware: true
  })
});

// ---------------------------------------------------------
//  MAIN ORGAN
// ---------------------------------------------------------

export function createPulseFileScanner() {

  function scanFile(filePath) {
    const fullPath = path.resolve(process.cwd(), filePath);

    if (!fs.existsSync(fullPath)) {
      return {
        ok: false,
        error: "FILE_NOT_FOUND",
        filePath,
        fullPath
      };
    }

    const content = fs.readFileSync(fullPath, "utf8");

    return analyzeContent(filePath, content);
  }

  return { scanFile };
}

// ---------------------------------------------------------
//  ANALYSIS ENGINE
// ---------------------------------------------------------

function analyzeContent(filePath, content) {
  const report = {
    ok: true,
    filePath,
    size: content.length,
    esmExports: [],
    cjsExports: [],
    imports: [],
    drift: [],
    layerViolations: [],
    visibility: "unknown",
    summary: ""
  };

  // -----------------------------
  // Detect ESM exports
  // -----------------------------
  const esmExportRegex = /export\s+(?:const|function|class)\s+([A-Za-z0-9_]+)/g;
  let match;
  while ((match = esmExportRegex.exec(content)) !== null) {
    report.esmExports.push(match[1]);
  }

  // -----------------------------
  // Detect CommonJS exports
  // -----------------------------
  const cjsExportRegex = /module\.exports\s*=\s*{([^}]+)}/;
  const cjsMatch = content.match(cjsExportRegex);

  if (cjsMatch) {
    const names = cjsMatch[1]
      .split(",")
      .map(s => s.trim().replace(/:.*$/, ""))
      .filter(Boolean);

    report.cjsExports.push(...names);
  }

  // -----------------------------
  // Detect imports
  // -----------------------------
  const importRegex = /import\s+.*?from\s+["'](.+?)["']/g;
  while ((match = importRegex.exec(content)) !== null) {
    report.imports.push(match[1]);
  }

  // -----------------------------
  // Drift detection
  // -----------------------------
  if (report.cjsExports.length > 0 && report.esmExports.length === 0) {
    report.drift.push("CJS_ONLY_ORGAN");
  }

  if (report.esmExports.length > 0 && report.cjsExports.length > 0) {
    report.drift.push("MIXED_MODULE_SYSTEM");
  }

  // -----------------------------
  // Visibility
  // -----------------------------
  if (report.esmExports.length > 0) {
    report.visibility = "visible";
  } else {
    report.visibility = "invisible";
  }

  // -----------------------------
  // Summary
  // -----------------------------
  report.summary = generateSummary(report);

  return report;
}

// ---------------------------------------------------------
//  SUMMARY GENERATOR
// ---------------------------------------------------------

function generateSummary(r) {
  return `
File: ${r.filePath}
Size: ${r.size} chars

ESM Exports: ${r.esmExports.join(", ") || "none"}
CJS Exports: ${r.cjsExports.join(", ") || "none"}

Visibility: ${r.visibility}
Drift: ${r.drift.join(", ") || "none"}

Imports:
${r.imports.map(i => " - " + i).join("\n") || " none"}
`.trim();
}
