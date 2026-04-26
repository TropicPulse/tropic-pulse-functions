// ============================================================================
//  PULSE OS v11‑EVO — THE SCRIBE
//  Dual‑Band Diagnostic Recorder • Forensic Historian • Organism Snapshot
//  PURE FORMATTING + SUMMARIZATION. ZERO MUTATION. ZERO RANDOMNESS.
// ============================================================================

export const SCRIBE_META = Object.freeze({
  layer: "PulseAIScribe",
  role: "SCRIBE_ORGAN",
  version: "11.0-EVO",
  identity: "aiScribe-v11-EVO",

  evo: Object.freeze({
    driftProof: true,
    deterministic: true,
    dualband: true,

    // Awareness
    binaryAware: true,
    symbolicAware: true,
    organismAware: true,
    diagnosticsAware: true,
    routingAware: true,
    cortexAware: true,
    pulseAware: true,
    historian: true,

    // Safety
    identitySafe: true,
    readOnly: true,

    // Lifecycle
    multiInstanceReady: true,
    epoch: "v11-EVO"
  })
});


// ============================================================================
// PUBLIC API — Build Debug Report (Object)
// ============================================================================
export function formatDebugReport(context = {}, dualBand = null) {
  const { trace = [], diagnostics = {} } = context;

  const organismSnapshot = buildOrganismSnapshot(dualBand);
  const binarySnapshot = organismSnapshot?.binary || null;
  const symbolicSnapshot = organismSnapshot?.symbolic || null;

  return Object.freeze({
    meta: SCRIBE_META,

    summary: buildSummary(diagnostics, binarySnapshot),

    trace: [...trace],

    mismatches: [...(diagnostics.mismatches || [])],
    missingFields: [...(diagnostics.missingFields || [])],
    slowdownCauses: [...(diagnostics.slowdownCauses || [])],
    driftDetected: diagnostics.driftDetected === true,

    // NEW v11‑EVO — Dual‑Band Layers
    binary: binarySnapshot,
    symbolic: symbolicSnapshot,
    organism: organismSnapshot,

    // Evolutionary Layers
    evolution: buildEvolutionaryNotes(context, organismSnapshot),

    // CNS Layers
    organs: buildOrganSnapshot(context),
    routing: buildRoutingSnapshot(context),
    cortex: buildCortexSnapshot(context),

    // Pulse lineage
    pulse: buildPulseSnapshot(context)
  });
}

// ============================================================================
// SUMMARY BUILDER — Dual‑Band Summary Lines (v11‑EVO)
// ============================================================================
function buildSummary(diagnostics, binary) {
  const summary = [];

  if (binary) {
    summary.push(
      `🧠 Binary load=${binary.metabolic?.load ?? 0}, pressure=${binary.metabolic?.pressure ?? 0}`
    );
  }

  if (diagnostics.mismatches?.length > 0)
    summary.push(`⚠️ ${diagnostics.mismatches.length} field mismatches detected`);

  if (diagnostics.missingFields?.length > 0)
    summary.push(`⚠️ ${diagnostics.missingFields.length} missing fields detected`);

  if (diagnostics.driftDetected)
    summary.push(`⚠️ Schema drift detected`);

  if (diagnostics.slowdownCauses?.length > 0)
    summary.push(`🐢 Slowdown causes: ${diagnostics.slowdownCauses.map(s => s.reason).join(", ")}`);

  if (summary.length === 0)
    summary.push("✅ No issues detected");

  return summary;
}

// ============================================================================
// ORGANISM SNAPSHOT — Dual‑Band (v11‑EVO)
// ============================================================================
function buildOrganismSnapshot(dualBand) {
  if (!dualBand) return null;

  return Object.freeze({
    timestamp: Date.now(),

    binary: dualBand.binary?.vitals?.snapshot?.() || null,

    symbolic: {
      persona: dualBand.symbolic?.personaEngine?.getActivePersona?.() || null,
      boundaryMode: dualBand.symbolic?.boundariesEngine?.getMode?.() || null,
      permissions: dualBand.symbolic?.permissionsEngine?.snapshot?.() || null
    }
  });
}

// ============================================================================
// EVOLUTIONARY NOTES — Dual‑Band Historian (v11‑EVO)
// ============================================================================
function buildEvolutionaryNotes(context, organismSnapshot) {
  const notes = [];

  if (organismSnapshot?.binary?.metabolic) {
    notes.push(
      `Binary metabolic pressure=${organismSnapshot.binary.metabolic.pressure}`
    );
  }

  if (context.pulse?.pattern)
    notes.push(`Pattern: ${context.pulse.pattern}`);

  if (Array.isArray(context.pulse?.lineage))
    notes.push(`Lineage depth: ${context.pulse.lineage.length}`);

  if (context.diagnostics?.driftDetected)
    notes.push("Evolutionary drift detected");

  return notes;
}

// ============================================================================
// ORGAN SNAPSHOT — Persona + Boundaries + Permissions (v11‑EVO)
// ============================================================================
function buildOrganSnapshot(context) {
  return Object.freeze({
    persona: context.persona || null,
    boundaryMode: context.boundaryMode || null,
    permissions: context.permissions || null
  });
}

// ============================================================================
// ROUTING SNAPSHOT — Dual‑Band Router Decisions (v11‑EVO)
// ============================================================================
function buildRoutingSnapshot(context) {
  if (!context.routing) return null;

  return Object.freeze({
    personaId: context.routing.personaId,
    dualBand: context.routing.dualBand || null,
    reasoning: [...(context.routing.reasoning || [])]
  });
}

// ============================================================================
// CORTEX SNAPSHOT — Dual‑Band Cognition (v11‑EVO)
// ============================================================================
function buildCortexSnapshot(context) {
  if (!context.cortexPacket) return null;

  return Object.freeze({
    pattern: context.cortexPacket.pattern,
    decision: context.cortexPacket.decision,
    binary: context.cortexPacket.binary,
    symbolic: context.cortexPacket.symbolic,
    band: context.cortexPacket.band,
    bitLength: context.cortexPacket.bitLength
  });
}

// ============================================================================
// PULSE SNAPSHOT — Pulse lineage + pattern (v11‑EVO)
// ============================================================================
function buildPulseSnapshot(context) {
  if (!context.pulse) return null;

  return Object.freeze({
    pulseType: context.pulse.pulseType || null,
    pattern: context.pulse.pattern || null,
    lineageDepth: Array.isArray(context.pulse.lineage)
      ? context.pulse.lineage.length
      : 0
  });
}

// ============================================================================
// STRING FORMATTER — Pretty Printed Debug Report (v11‑EVO)
// ============================================================================
export function formatDebugString(context, dualBand = null) {
  const report = formatDebugReport(context, dualBand);

  let out = "\n=== AI DEBUG REPORT (v11‑EVO) ===\n\n";

  out += "SUMMARY:\n";
  report.summary.forEach(line => {
    out += `  - ${line}\n`;
  });

  out += "\nTRACE:\n";
  report.trace.forEach((step, i) => {
    out += `  ${i + 1}. ${step}\n`;
  });

  out += "\nBINARY VITALS:\n";
  out += JSON.stringify(report.binary, null, 2) + "\n";

  out += "\nSYMBOLIC SNAPSHOT:\n";
  out += JSON.stringify(report.symbolic, null, 2) + "\n";

  out += "\nROUTING:\n";
  out += JSON.stringify(report.routing, null, 2) + "\n";

  out += "\nCORTEX PACKET:\n";
  out += JSON.stringify(report.cortex, null, 2) + "\n";

  out += "\nEVOLUTIONARY NOTES:\n";
  report.evolution.forEach(n => {
    out += `  - ${n}\n`;
  });

  out += "\n========================\n";

  return out;
}
