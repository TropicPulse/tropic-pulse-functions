import fs from "fs";
import path from "path";

// Look one folder back, then scan forward into all subfolders
const ROOT = path.resolve(process.cwd(), "..");

// v12.3‑EVO aware patterns — minimal, non‑redundant
const META_PATTERNS = [
  // Organ identity
  /ORGAN:\s*([A-Za-z0-9_-]+)/i,
  /identity:\s*["']?([A-Za-z0-9.\-]+)["']?/i,

  // Versioning (v11, v12, v12.3, EVO, Presence, Harmonics)
  /VERSION:\s*([A-Za-z0-9.\-]+)/i,
  /v\d+(?:\.\d+)?(?:\.\d+)?-?(?:EVO|Presence|Harmonics)?/i,

  // Pulse organ naming (Behavior, BinaryBehavior, Scanner, Cortex, HeatMap, etc.)
  /Pulse[A-Za-z0-9_-]+-v\d+(?:\.\d+)?(?:\.\d+)?-?(?:EVO|Presence|Harmonics)?/i,

  // Layer / Cortex / Mode tags
  /layer:\s*["']?([A-Za-z0-9_-]+)["']?/i,
  /cortex:\s*["']?([A-Za-z0-9_-]+)["']?/i,
  /presence:\s*["']?([A-Za-z0-9._-]+)["']?/i,
  /harmonics:\s*["']?([A-Za-z0-9._-]+)["']?/i,
  /dualband:\s*["']?([A-Za-z0-9._-]+)["']?/i
];

function scanFile(filePath) {
  const text = fs.readFileSync(filePath, "utf8");
  const results = [];

  for (const pattern of META_PATTERNS) {
    const match = text.match(pattern);
    if (match) {
      results.push({
        pattern: pattern.toString(),
        match: match[1] || match[0]
      });
    }
  }

  return results;
}

function walk(dir, results = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const full = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      walk(full, results);
    } else if (entry.isFile() && full.endsWith(".js")) {
      const meta = scanFile(full);
      if (meta.length > 0) {
        results.push({
          file: full.replace(ROOT, "."),
          meta
        });
      }
    }
  }

  return results;
}

const output = walk(ROOT);

console.log("=== Pulse Metadata Scan (v12.3‑EVO) ===");
output.forEach((item) => {
  console.log(`\nFILE: ${item.file}`);
  item.meta.forEach((m) => {
    console.log(`  → ${m.match}`);
  });
});
