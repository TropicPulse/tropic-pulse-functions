// ============================================================================
// PulseOS Evolution Engine — v9.2
// “Evolution that evolves itself”
// ============================================================================
//
//  ROLE IN THE ORGANISM (v9.2):
//  ----------------------------
//  • Discovers pulse-* organs across the filesystem
//  • Exposes raw organ candidates to the CNS Brain
//  • Lets the CNS perform final PulseRole validation + attachment
//  • Provides deterministic, drift‑proof organ evolution
//  • Zero compute, zero AI, zero autonomy
//
//  SAFETY CONTRACT (v9.2):
//  ------------------------
//  • No dynamic eval
//  • No arbitrary execution
//  • No backend calls
//  • No network
//  • Deterministic scanning + importing only
//
//  IDENTITY (v9.2):
//  ----------------
//  • organ: EvolutionEngine
//  • layer: CNS
//  • subsystem: OS
//  • version: 9.2
//  • generation: v9
// ============================================================================

import { readdirSync, statSync } from "fs";
import { join } from "path";
import { validatePulseRole, structuralError } from "./PulseOSBrain.js";

// ============================================================================
//  PulseRole — Evolution Engine Identity (for CNS awareness)
// ============================================================================
export const PulseRole = {
  type: "EvolutionEngine",
  subsystem: "OS",
  layer: "CNS",
  version: "9.2",
  identity: "PulseOSEvolutionEngine",

  evo: {
    deterministicScan: true,
    driftProof: true,
    multiInstanceReady: true,
    advantageCascadeAware: true,
    unifiedAdvantageField: true,
    zeroNetwork: true
  }
};

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
// 2. RAW EVOLUTIONARY DISCOVERY (NO FILTERING)
//    Returns all candidate modules whose filenames match designIdentity.
//    CNS Brain is responsible for PulseRole validation + selection.
// ---------------------------------------------------------------------------
export async function evolveRaw(designIdentity) {
  const id = designIdentity?.toLowerCase() || null;

  const PULSE_FOLDERS = discoverPulseFolders(join(process.cwd(), "apps"));
  const candidates = [];

  for (const folder of PULSE_FOLDERS) {
    try {
      const files = await import.meta.glob(`${folder}/*.js`);

      for (const path in files) {
        const filename = path.toLowerCase();

        if (id && !filename.includes(id)) continue;

        const module = await files[path]();
        candidates.push({ path, module });
      }
    } catch {
      // fail‑open: a bad folder never blocks evolution
      continue;
    }
  }

  return candidates;
}

// ---------------------------------------------------------------------------
// 3. LEGACY HELPER — evolveOrgan (filtered, single organ)
//    Kept for backward compatibility. New CNS uses evolveRaw().
// ---------------------------------------------------------------------------
export async function evolveOrgan(designIdentity, expectedType, expectedSubsystem) {
  const expected = { type: expectedType, subsystem: expectedSubsystem };
  const raw = await evolveRaw(designIdentity);

  const filtered = raw.filter(({ module }) =>
    validatePulseRole(module, expected.type, expected.subsystem)
  );

  if (filtered.length > 0) {
    return filtered[0].module;
  }

  return structuralError(
    expected,
    { type: null, subsystem: null },
    { designIdentity }
  );
}
