// ============================================================================
// FILE: /PULSE-AI/PulseFileScanner-v12.3-EVO+.js
// PULSE AI — v12.3‑EVO+
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
//   • Emits FileScanner-Artery v3 (symbolic-only)
// ============================================================================

export const PulseFileScannerMeta = Object.freeze({
  type: "Cognitive",
  subsystem: "aiFileScanner",
  layer: "PulseAICognition",
  role: "FILE_SCANNER_ORGAN",
  version: "12.3-EVO+",
  identity: "PulseFileScanner-v12.3-EVO+",

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
    scannerArteryAware: true,
    futureEvolutionReady: true,
    epoch: "12.3-EVO+"
  }),

  contract: Object.freeze({
    purpose: [
      "Provide symbolic-only file cognition",
      "Analyze file structure without execution",
      "Detect drift, ESM/CJS conflicts, and import surfaces",
      "Emit symbolic-only FileScanner-Artery v3",
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
// HELPERS — BUCKETS + PRESSURE
// ============================================================================
function bucketPressure(v) {
  if (v >= 0.9) return "overload";
  if (v >= 0.7) return "high";
  if (v >= 0.4) return "medium";
  if (v > 0) return "low";
  return "none";
}

function extractBinaryPressure(binaryVitals = {}) {
  if (binaryVitals?.layered?.organism?.pressure != null)
    return binaryVitals.layered.organism.pressure;
  if (binaryVitals?.binary?.pressure != null)
    return binaryVitals.binary.pressure;
  return 0;
}

// ============================================================================
// FILE SCANNER FACTORY — v12.3‑EVO+
// ============================================================================
export function createPulseFileScanner({
  backendMode = false,
  Evolution = null,
  binaryVitals = {}
} = {}) {
  let fs = null;
  let path = null;

  if (backendMode) {
    fs = require("fs");
    path = require("path");
  }

  // Prewarm (symbolic-only)
  function prewarm() {
    return true;
  }

  // -------------------------------------------------------------------------
  // FILE SCAN (symbolic-only)
  // -------------------------------------------------------------------------
  function scanFile(filePath) {
    if (!backendMode) {
      return {
        ok: false,
        error: "BACKEND_DISABLED",
        message: "File scanning requires backendMode=true",
        filePath,
        artery: getScannerArterySnapshot({ ok: false, filePath, binaryVitals })
      };
    }

    const fullPath = path.resolve(process.cwd(), filePath);

    if (!fs.existsSync(fullPath)) {
      Evolution?.recordLineage?.("scanner-file-not-found", { filePath });
      return {
        ok: false,
        error: "FILE_NOT_FOUND",
        filePath,
        fullPath,
        artery: getScannerArterySnapshot({ ok: false, filePath, binaryVitals })
      };
    }

    const content = fs.readFileSync(fullPath, "utf8");
    const report = analyzeContent(filePath, content);

    Evolution?.recordLineage?.("scanner-file-analyzed", { filePath });
    Evolution?.scanDrift?.({ scannerReport: report });

    return {
      ...report,
      artery: getScannerArterySnapshot({
        ok: true,
        filePath,
        report,
        binaryVitals
      })
    };
  }

  return Object.freeze({
    meta: PulseFileScannerMeta,
    prewarm,
    scanFile,
    getScannerArterySnapshot
  });
}

// ============================================================================
// FILE SCANNER ARTERY v3 — Symbolic-only, deterministic
// ============================================================================
export function getScannerArterySnapshot({
  ok = false,
  filePath = "",
  report = null,
  binaryVitals = {}
} = {}) {
  const pressure = extractBinaryPressure(binaryVitals);

  const driftCount = report?.drift?.length || 0;
  const importCount = report?.imports?.length || 0;
  const esmCount = report?.esmExports?.length || 0;
  const cjsCount = report?.cjsExports?.length || 0;

  const localPressure =
    driftCount > 0 ? 0.6 :
    esmCount > 0 && cjsCount > 0 ? 0.5 :
    importCount > 10 ? 0.3 :
    0.1;

  const fusedPressure = Math.max(
    0,
    Math.min(1, 0.7 * localPressure + 0.3 * pressure)
  );

  return {
    organism: {
      pressure: fusedPressure,
      pressureBucket: bucketPressure(fusedPressure)
    },
    file: {
      ok,
      filePath,
      driftCount,
      esmCount,
      cjsCount,
      importCount
    },
    binary: {
      pressure,
      pressureBucket: bucketPressure(pressure)
    }
  };
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
//  DUAL EXPORT LAYER — CommonJS compatibility (v12.3‑EVO+ dualband)
// ---------------------------------------------------------------------------
/* c8 ignore next 10 */
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    PulseFileScannerMeta,
    createPulseFileScanner,
    getScannerArterySnapshot
  };
}
