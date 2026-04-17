// FILE: tropic-pulse-functions/apps/pulse-design/manifestBuilder.js

//
// ------------------------------------------------------
// 📘 PAGE INDEX — Source of Truth for This File
// ------------------------------------------------------
//
// ROLE:
//   ManifestBuilder — deterministic, read‑only scanner that walks the repo,
//   classifies files, extracts metadata, and outputs a unified manifest
//   describing the entire Pulse project structure.
//
// PURPOSE:
//   • Make the system AI‑readable
//   • Make the system human‑readable
//   • Provide a single source of truth for routes, components, data usage,
//     PulseBand usage, healing hooks, and file types
//
// OUTPUT:
//   • /pulse_project.json — the canonical architecture snapshot
//
// RESPONSIBILITIES:
//   • Walk the repo deterministically
//   • Detect pages, components, layouts, API routes
//   • Detect PulseBand usage
//   • Detect healing hooks
//   • Detect data sources (SQL, Firestore, Pulse‑Fields)
//   • Classify file types (page, component, layout, api, util, unknown)
//   • Produce a stable manifest for AI + humans
//
// SAFETY RULES (CRITICAL):
//   • READ‑ONLY — no file writes except the manifest output
//   • NO eval(), NO Function(), NO dynamic imports
//   • NO executing user code
//   • NO network calls
//   • NO mutation of scanned files
//   • Deterministic output only
//
// ------------------------------------------------------
// ManifestBuilder — Deterministic Repo Scanner
// ------------------------------------------------------

import fs from "fs";
import path from "path";

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

    // Skip node_modules and build artifacts
    if (rel.includes("node_modules") || rel.includes(".next") || rel.includes("dist")) {
      return;
    }

    const fileInfo = classifyFile(rel);
    manifest.files.push(fileInfo);

    // Categorize
    if (fileInfo.type === "page") manifest.pages.push(fileInfo);
    if (fileInfo.type === "component") manifest.components.push(fileInfo);
    if (fileInfo.type === "layout") manifest.layouts.push(fileInfo);
    if (fileInfo.type === "api") manifest.apis.push(fileInfo);
    if (fileInfo.usesPulseBand) manifest.pulseband.push(fileInfo);
    if (fileInfo.usesHealing) manifest.healingHooks.push(fileInfo);
    if (fileInfo.dataSources.length > 0) manifest.dataSources.push(...fileInfo.dataSources);
  });

  // Write manifest
  const outPath = path.join(rootDir, "pulse_project.json");
  fs.writeFileSync(outPath, JSON.stringify(manifest, null, 2));

  return {
    success: true,
    manifestPath: outPath,
    fileCount: manifest.files.length,
  };
}

// ------------------------------------------------------
// walk(dir, callback) — deterministic directory walker
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
// classifyFile(filePath) — detect type + metadata
// ------------------------------------------------------
function classifyFile(relPath) {
  const ext = path.extname(relPath);
  const content = safeRead(relPath);

  const info = {
    path: relPath,
    ext,
    type: detectType(relPath),
    usesPulseBand: content.includes("usePulseBand") || content.includes("PulseBand"),
    usesHealing: content.includes("useHealing") || content.includes("healing"),
    dataSources: detectDataSources(content),
  };

  return info;
}

// ------------------------------------------------------
// detectType(relPath)
// ------------------------------------------------------
function detectType(relPath) {
  const lower = relPath.toLowerCase();

  if (lower.includes("/pages/") && lower.endsWith(".js")) return "page";
  if (lower.includes("/components/") && lower.endsWith(".js")) return "component";
  if (lower.includes("/layouts/") && lower.endsWith(".js")) return "layout";
  if (lower.includes("/api/") && lower.endsWith(".js")) return "api";

  return "unknown";
}

// ------------------------------------------------------
// detectDataSources(content)
// ------------------------------------------------------
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
