/* global log,warn,error */
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
      log(prefix + "- " + full.replace(ROOT, ""));
    }
  }
}

function scanApps() {
  log("📁 /apps directory scan\n");

  const folders = fs.readdirSync(ROOT, { withFileTypes: true })
    .filter(e => e.isDirectory());

  for (const folder of folders) {
    const folderPath = path.join(ROOT, folder.name);
    log("📂 " + folder.name);

    const files = fs.readdirSync(folderPath, { withFileTypes: true });

    // First-level JS files
    const jsFiles = files
      .filter(f => f.isFile() && f.name.endsWith(".js"))
      .map(f => f.name);

    if (jsFiles.length > 0) {
      log("  JS Files:");
      jsFiles.forEach(f => log("    - " + f));
    } else {
      log("  (no JS files in first level)");
    }

    // HTML files (any depth)
    log("  HTML Files:");
    listHtmlFiles(folderPath, "    ");

    log("");
  }
}

scanApps();
