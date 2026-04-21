// ============================================================================
// PulseOS Evolution Engine — v4.0
// “Evolution that evolves itself”
// ============================================================================

import { readdirSync, statSync } from "fs";
import { join } from "path";
import { validatePulseRole, structuralError } from "./PulseOSBrain.js";

// ---------------------------------------------------------------------------
// 1. AUTO-DISCOVER ALL pulse-* FOLDERS
// ---------------------------------------------------------------------------
function discoverPulseFolders(rootDir) {
  const entries = readdirSync(rootDir);
  const pulseFolders = [];

  for (const entry of entries) {
    if (!entry.startsWith("pulse-")) continue;

    const fullPath = join(rootDir, entry);
    if (!statSync(fullPath).isDirectory()) continue;

    const functionsPath = join(fullPath, "functions");
    pulseFolders.push(functionsPath);
  }

  return pulseFolders;
}

// ---------------------------------------------------------------------------
// 2. EVOLUTIONARY ORGAN DISCOVERY (ALL 4 LEVELS)
// ---------------------------------------------------------------------------
export async function evolveOrgan(designIdentity, expectedType, expectedSubsystem) {
  const id = designIdentity?.toLowerCase();
  const expected = { type: expectedType, subsystem: expectedSubsystem };

  // ⭐ EVOLUTIONARY DISCOVERY
  const PULSE_FOLDERS = discoverPulseFolders(join(process.cwd(), "apps"));

  const candidates = [];

  // ⭐ 1. SEARCH — discover all matching files
  for (const folder of PULSE_FOLDERS) {
    try {
      const files = await import.meta.glob(`${folder}/*.js`);

      for (const path in files) {
        const filename = path.toLowerCase();

        if (id && !filename.includes(id)) continue;

        const module = await files[path]();

        // ⭐ 2. INTELLECT — identity + subsystem filtering
        if (!validatePulseRole(module, expected.type, expected.subsystem)) continue;

        candidates.push({ path, module });
      }
    } catch {
      continue;
    }
  }

  // ⭐ 3. ROLE VALIDATION — choose best candidate
  if (candidates.length > 0) {
    return candidates[0].module;
  }

  // ⭐ 4. STRUCTURAL ERROR INTELLIGENCE
  return structuralError(
    expected,
    { type: null, subsystem: null },
    { designIdentity }
  );
}
