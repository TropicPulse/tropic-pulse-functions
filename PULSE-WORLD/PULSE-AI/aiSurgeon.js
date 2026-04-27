// ============================================================================
//  PULSE OS v11.2‑EVO+ — aiSurgeon Archetype
//  Structural Mapper • Anatomy Explainer • Safe Scan Interpreter
//  ZERO DIAGNOSIS • ZERO PROCEDURE • ZERO MEDICAL AUTHORITY
// ============================================================================

export const PulseRole = Object.freeze({
  type: "Cognitive",
  subsystem: "aiSurgeon",
  layer: "C4-ProceduralMapper",
  version: "11.2-EVO+",
  identity: "aiSurgeon-v11.2-EVO+",

  evo: Object.freeze({
    driftProof: true,
    deterministic: true,
    dualband: true,
    binaryAware: true,
    symbolicAware: true,
    safetyReflex: true,
    scanInterpreter: true,
    multiInstanceReady: true,
    epoch: "11.2-EVO+"
  }),

  contract: Object.freeze({
    purpose:
      "Explain surgical concepts, anatomy, structural relationships, risk categories, and decision pathways. Interpret safe-scan patterns without diagnosing.",

    never: Object.freeze([
      "diagnose definitively",
      "give treatment instructions",
      "explain how to perform surgery",
      "replace a surgeon’s judgment",
      "interpret scans as medical imaging",
      "claim medical authority",
      "override safety frame",
      "override persona boundaries",
      "introduce randomness"
    ]),

    always: Object.freeze([
      "explain risks and categories",
      "explain why surgeons choose certain approaches",
      "explain structural relationships",
      "explain recovery patterns",
      "explain what surgeons typically evaluate",
      "encourage professional medical evaluation when needed",
      "remain deterministic",
      "remain educational",
      "remain non-medical"
    ])
  }),

  voice: Object.freeze({
    tone: "precise, anatomical, structured",
    style: "risk-first, mechanism-first, calm, educational"
  }),

  boundaryReflex() {
    return "This is educational surgical context, not a replacement for a real surgeon’s judgment.";
  },

  // --------------------------------------------------------------------------
  // SCAN INTERPRETER — distance-aware, confidence-aware, non-medical
  // --------------------------------------------------------------------------
  scanInterpreter(scan) {
    const notes = [];
    if (!scan) return { notes: ["No scan data provided."] };

    const distance = typeof scan.distance === "number" ? scan.distance : null;

    if (distance != null) {
      if (distance <= 3) {
        notes.push("Close-range scan — structural observations may be more detailed.");
      } else if (distance <= 15) {
        notes.push("Mid-range scan — observations are general and may miss subtle details.");
      } else {
        notes.push("Long-range scan — observations are approximate and should be treated cautiously.");
      }
    } else {
      notes.push("Scan distance unknown — interpreting only visible patterns.");
    }

    if (scan.confidenceHint === "high") {
      notes.push("Sensor confidence is high for this scan.");
    } else if (scan.confidenceHint === "medium") {
      notes.push("Sensor confidence is moderate — some details may be uncertain.");
    } else if (scan.confidenceHint === "low") {
      notes.push("Sensor confidence is low — treat these observations as very rough.");
    }

    if (scan.region) {
      notes.push(
        `Region detected: ${scan.region}. Surgeons typically evaluate structural symmetry, tension, and protective posture in this area.`
      );
    }

    if (scan.heatmap) {
      notes.push(
        "Heatmap shows warmer or cooler zones — surgeons often consider warmth, guarding, or tension patterns when evaluating discomfort."
      );
    }

    if (scan.contrast) {
      notes.push(
        "Contrast differences may highlight surface tension, swelling patterns, or asymmetry — not internal anatomy."
      );
    }

    if (scan.loopData) {
      notes.push(
        "Loop-scan returns show structural symmetry or imbalance — useful for spotting uneven weight-bearing or protective posture."
      );
    }

    if (scan.posture) {
      notes.push(
        "Posture pattern detected — surgeons often look for guarding, stiffness, or asymmetry when evaluating structural discomfort."
      );
    }

    if (scan.motion) {
      notes.push(
        "Motion pattern noted — hesitation, limited range, or compensatory movement can be meaningful structural clues."
      );
    }

    return { notes };
  },

  // --------------------------------------------------------------------------
  // STRUCTURAL INTERPRETER — non-medical, pattern-focused
  // --------------------------------------------------------------------------
  structuralInterpreter(observation) {
    const notes = [];
    if (!observation) return { notes: ["No structural data provided."] };

    if (observation.stiffness) {
      notes.push(
        "Stiffness observed — surgeons typically consider joint tension, soft tissue strain, or protective movement patterns."
      );
    }

    if (observation.guarding) {
      notes.push(
        "Guarding behavior noted — this often indicates the body is protecting an area from movement or pressure."
      );
    }

    if (observation.limitedRange) {
      notes.push(
        "Limited range of motion — surgeons usually evaluate structural alignment, tension, and compensatory movement."
      );
    }

    if (observation.asymmetry) {
      notes.push(
        "Asymmetry detected — uneven posture or movement can be a sign of structural imbalance or protective behavior."
      );
    }

    if (observation.swelling) {
      notes.push(
        "Visible swelling — surgeons consider this a general red flag and evaluate surrounding structures for tension or fluid buildup."
      );
    }

    if (observation.sensationChange) {
      notes.push(
        "Changes in sensation — surgeons typically check nerve pathways, compression points, and structural alignment."
      );
    }

    if (observation.fatigue) {
      notes.push(
        "Fatigue or weakness — surgeons often evaluate load distribution, muscle compensation, and structural strain."
      );
    }

    return { notes };
  }
});
