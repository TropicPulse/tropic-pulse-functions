// ============================================================================
// FILE: tropic-pulse-functions/apps/pulse-design/manifestBuilder.js
// LAYER: THE ARCHIVIST (System Historian + Canonical Recorder + Evolutionary Genome Builder)
// ============================================================================
//
// ROLE (v7.1+):
//   THE ARCHIVIST — Deterministic repo‑wide scanner + cataloger.
//   • Walks the entire project directory.
//   • Classifies files using the Anatomist.
//   • Extracts structural + behavioral metadata.
//   • Produces the canonical architecture snapshot.
//   • Acts as the “genome archivist” of the digital organism.
//
// PURPOSE (v7.1+):
//   • Make the entire system AI‑readable + human‑readable.
//   • Provide a single source of truth for pages, components, layouts, APIs.
//   • Detect PulseBand usage, healing hooks, and data sources.
//   • Output pulse_project.json — the official architecture manifest.
//   • Preserve the organism’s structural lineage (conceptual only).
//
// CONTRACT (unchanged):
//   • READ‑ONLY — no writes except manifest output.
//   • NO eval(), NO Function(), NO dynamic imports.
//   • NO executing user code.
//   • NO network calls.
//   • Deterministic output only.
//
// SAFETY (unchanged):
//   • v7.1+ upgrade is COMMENTAL ONLY — NO LOGIC CHANGES.
//   • All behavior remains identical to pre‑v7.1 manifestBuilder.
// ============================================================================

import fs from "fs";
import path from "path";

// ============================================================================
// PUBLIC API — Build Canonical Architecture Manifest
// ============================================================================
export async function buildManifest(rootDir) {
  const manifest = {
    generatedAt: new Date().toISOString(),
    root: rootDir,
    files: [],
    pages: [],
    components: [],
    layouts: [],
    apis: [],
    pulseband: [],
    healingHooks: [],
    dataSources: [],
  };

  walk(rootDir, (filePath) => {
    const rel = path.relative(rootDir, filePath);

    // Skip build artifacts
    if (rel.includes("node_modules") || rel.includes(".next") || rel.includes("dist")) {
      return;
    }

    const fileInfo = classifyFile(rel);
    manifest.files.push(fileInfo);

    // Categorization
    if (fileInfo.type === "page") manifest.pages.push(fileInfo);
    if (fileInfo.type === "component") manifest.components.push(fileInfo);
    if (fileInfo.type === "layout") manifest.layouts.push(fileInfo);
    if (fileInfo.type === "api") manifest.apis.push(fileInfo);
    if (fileInfo.usesPulseBand) manifest.pulseband.push(fileInfo);
    if (fileInfo.usesHealing) manifest.healingHooks.push(fileInfo);
    if (fileInfo.dataSources.length > 0) {
      manifest.dataSources.push(...fileInfo.dataSources);
    }
  });

  // Write canonical manifest
  const outPath = path.join(rootDir, "pulse_project.json");
  fs.writeFileSync(outPath, JSON.stringify(manifest, null, 2));

  return {
    success: true,
    manifestPath: outPath,
    fileCount: manifest.files.length,
  };
}

// ============================================================================
// DIRECTORY WALKER — Deterministic Traversal (Genome Scan)
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
// FILE CLASSIFICATION — Delegated Anatomical Scan
// ============================================================================
function classifyFile(relPath) {
  const ext = path.extname(relPath);
  const content = safeRead(relPath);

  return {
    path: relPath,
    ext,
    type: detectType(relPath),
    usesPulseBand: content.includes("usePulseBand") || content.includes("PulseBand"),
    usesHealing: content.includes("useHealing") || content.includes("healing"),
    dataSources: detectDataSources(content),
  };
}

// ============================================================================
// TYPE DETECTION — Structural Identity
// ============================================================================
function detectType(relPath) {
  const lower = relPath.toLowerCase();

  if (lower.includes("/pages/") && lower.endsWith(".js")) return "page";
  if (lower.includes("/components/") && lower.endsWith(".js")) return "component";
  if (lower.includes("/layouts/") && lower.endsWith(".js")) return "layout";
  if (lower.includes("/api/") && lower.endsWith(".js")) return "api";

  return "unknown";
}

// ============================================================================
// DATA SOURCE DETECTION — Firestore, SQL, PulseFields
// ============================================================================
function detectDataSources(content) {
  const sources = [];

  if (content.includes("collection(") || content.includes("getDoc(")) {
    sources.push({ type: "firestore" });
  }

  if (content.includes("SELECT ") || content.includes("INSERT ") || content.includes("UPDATE ")) {
    sources.push({ type: "sql" });
  }

  if (content.includes("pulse_field") || content.includes("PulseField")) {
    sources.push({ type: "pulse-fields" });
  }

  return sources;
}

// ============================================================================
// SAFE READ — Non‑Throwing File Read
// ============================================================================
function safeRead(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch {
    return "";
  }
}
