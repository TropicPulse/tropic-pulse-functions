// ============================================================================
// FILE: /apps/PULSE-AI/PulseFileScanner-v11.2-EVO+.js
// PULSE AI — v11.2‑EVO+
// “THE FILE SCANNER ORGAN — SYMBOLIC COGNITION + STRUCTURAL ANALYSIS”
// ============================================================================
//
// ROLE:
//   • Symbolic-only file cognition organ
//   • Reads + analyzes file structure (when backend allowed)
//   • Detects drift, ESM/CJS conflicts, import surfaces
//   • NEVER executes code
//   • NEVER mutates files
//   • Cortex-safe (symbolic-only)
//   • Evolution-aware (lineage + drift tagging)
//   • Deterministic
//
// MODES:
//   • backendMode: true  → filesystem allowed (Node backend)
//   • backendMode: false → no filesystem (frontend / UI / browser)
// ============================================================================

export const PulseFileScannerMeta = Object.freeze({
  type: "Cognitive",
  subsystem: "aiFileScanner",
  layer: "PulseAICognition",
  role: "FILE_SCANNER_ORGAN",
  version: "11.2-EVO+",
  identity: "PulseFileScanner-v11.2-EVO+",

  evo: Object.freeze({
    deterministic: true,
    driftProof: true,
    dualband: true,
    symbolicPrimary: true,
    binaryAware: true,
    binaryNonExecutable: true,
    readOnly: true,
    mutationSafe: true,
    nonBlocking: true,
    multiInstanceReady: true,
    futureEvolutionReady: true,
    epoch: "11.2-EVO+"
  }),

  contract: Object.freeze({
    purpose: [
      "Provide symbolic-only file cognition",
      "Analyze file structure without execution",
      "Detect drift, ESM/CJS conflicts, and import surfaces",
      "Remain Cortex-safe and Evolution-aware"
    ],
    never: [
      "execute code",
      "mutate files",
      "modify filesystem",
      "introduce randomness",
      "block organism execution"
    ],
    always: [
      "remain deterministic",
      "remain symbolic-only",
      "respect backendMode",
      "emit drift + lineage signals when Evolution organ is present"
    ]
  }),

  boundaryReflex() {
    return "PulseFileScanner is symbolic-only — it never executes or mutates code.";
  }
});

// ============================================================================
// FACTORY — Cortex/Brain/Evolution inject environment
// ============================================================================
export function createPulseFileScanner({ backendMode = false, Evolution = null } = {}) {
  let fs = null;
  let path = null;

  if (backendMode) {
    fs = require("fs");
    path = require("path");
  }

  function scanFile(filePath) {
    if (!backendMode) {
      return {
        ok: false,
        error: "BACKEND_DISABLED",
        message: "File scanning requires backendMode=true",
        filePath
      };
    }

    const fullPath = path.resolve(process.cwd(), filePath);

    if (!fs.existsSync(fullPath)) {
      Evolution?.recordLineage?.("scanner-file-not-found", { filePath });
      return {
        ok: false,
        error: "FILE_NOT_FOUND",
        filePath,
        fullPath
      };
    }

    const content = fs.readFileSync(fullPath, "utf8");
    const report = analyzeContent(filePath, content);

    Evolution?.recordLineage?.("scanner-file-analyzed", { filePath });
    Evolution?.scanDrift?.({ scannerReport: report });

    return report;
  }

  return Object.freeze({
    meta: PulseFileScannerMeta,
    scanFile
  });
}

// ============================================================================
// ANALYSIS ENGINE — Pure symbolic cognition
// ============================================================================
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

  // ESM exports
  const esmExportRegex = /export\s+(?:const|function|class)\s+([A-Za-z0-9_]+)/g;
  let match;
  while ((match = esmExportRegex.exec(content)) !== null) {
    report.esmExports.push(match[1]);
  }

  // CJS exports
  const cjsExportRegex = /module\.exports\s*=\s*{([^}]+)}/;
  const cjsMatch = content.match(cjsExportRegex);

  if (cjsMatch) {
    const names = cjsMatch[1]
      .split(",")
      .map(s => s.trim().replace(/:.*$/, ""))
      .filter(Boolean);

    report.cjsExports.push(...names);
  }

  // Imports
  const importRegex = /import\s+.*?from\s+["'](.+?)["']/g;
  while ((match = importRegex.exec(content)) !== null) {
    report.imports.push(match[1]);
  }

  // Drift detection
  if (report.cjsExports.length > 0 && report.esmExports.length === 0) {
    report.drift.push("CJS_ONLY_ORGAN");
  }

  if (report.esmExports.length > 0 && report.cjsExports.length > 0) {
    report.drift.push("MIXED_MODULE_SYSTEM");
  }

  // Visibility
  report.visibility =
    report.esmExports.length > 0 ? "visible" : "invisible";

  // Summary
  report.summary = generateSummary(report);

  return report;
}

// ============================================================================
// SUMMARY GENERATOR — Pure symbolic output
// ============================================================================
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

// ---------------------------------------------------------------------------
//  DUAL EXPORT LAYER — CommonJS compatibility (v11.2‑EVO+ dualband)
// ---------------------------------------------------------------------------
/* c8 ignore next 10 */
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    PulseFileScannerMeta,
    createPulseFileScanner
  };
}
