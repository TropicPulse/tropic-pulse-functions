// scan-apps.js
// Scans /apps and prints:
//  - all top-level folders
//  - all .js files inside each folder (first level only)
//  - all .html files at any depth

import fs from "fs";
import path from "path";

const ROOT = path.join(process.cwd(), "apps");

function listHtmlFiles(dir, prefix = "") {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      listHtmlFiles(full, prefix + "  ");
    } else if (entry.name.endsWith(".html")) {
      console.log(prefix + "- " + full.replace(ROOT, ""));
    }
  }
}

function scanApps() {
  console.log("📁 /apps directory scan\n");

  const folders = fs.readdirSync(ROOT, { withFileTypes: true })
    .filter(e => e.isDirectory());

  for (const folder of folders) {
    const folderPath = path.join(ROOT, folder.name);
    console.log("📂 " + folder.name);

    const files = fs.readdirSync(folderPath, { withFileTypes: true });

    // First-level JS files
    const jsFiles = files
      .filter(f => f.isFile() && f.name.endsWith(".js"))
      .map(f => f.name);

    if (jsFiles.length > 0) {
      console.log("  JS Files:");
      jsFiles.forEach(f => console.log("    - " + f));
    } else {
      console.log("  (no JS files in first level)");
    }

    // HTML files (any depth)
    console.log("  HTML Files:");
    listHtmlFiles(folderPath, "    ");

    console.log("");
  }
}

scanApps();
