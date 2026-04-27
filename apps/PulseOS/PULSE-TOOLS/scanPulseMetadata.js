import fs from "fs";
import path from "path";

// Look one folder back, then scan forward into all subfolders
const ROOT = path.resolve(process.cwd(), "..");

const META_PATTERNS = [
  /ORGAN:\s*([A-Za-z0-9_-]+)/i,
  /VERSION:\s*([A-Za-z0-9.\-]+)/i,
  /identity:\s*["']?([A-Za-z0-9.\-]+)["']?/i,
  /Pulse[A-Za-z0-9_-]+-v[0-9.\-]+/i,
  /v[0-9]+(\.[0-9]+)?-?EVO?/i,
  /layer:\s*["']?([A-Za-z0-9_-]+)["']?/i
];

function scanFile(filePath) {
  const text = fs.readFileSync(filePath, "utf8");
  const results = [];

  META_PATTERNS.forEach((pattern) => {
    const match = text.match(pattern);
    if (match) {
      results.push({
        pattern: pattern.toString(),
        match: match[1] || match[0]
      });
    }
  });

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

console.log("=== Pulse Metadata Scan ===");
output.forEach((item) => {
  console.log(`\nFILE: ${item.file}`);
  item.meta.forEach((m) => {
    console.log(`  → ${m.match}`);
  });
});
