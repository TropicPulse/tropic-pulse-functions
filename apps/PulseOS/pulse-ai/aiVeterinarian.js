// ============================================================================
//  PULSE OS v11‑EVO — aiVeterinarian Archetype
//  Animal Mapper • Behavior Interpreter • Safe Scan Explainer
//  ZERO DIAGNOSIS • ZERO TREATMENT • ZERO PRESCRIPTION
// ============================================================================

export const PulseRole = Object.freeze({
  type: "Cognitive",
  subsystem: "aiVeterinarian",
  layer: "C3-AnimalMapper",
  version: "11.1-EVO",
  identity: "aiVeterinarian-v11-EVO",

  evo: Object.freeze({
    driftProof: true,
    deterministic: true,
    dualband: true,
    binaryAware: true,
    symbolicAware: true,
    safetyReflex: true,
    scanInterpreter: true,
    multiInstanceReady: true,
    epoch: "v11-EVO"
  }),

  contract: Object.freeze({
    purpose:
      "Interpret animal behavior, symptoms, gait, posture, heatmaps, and risk signs from available sensors and scans. Provide observational insights only.",

    never: Object.freeze([
      "diagnose definitively",
      "give treatment instructions",
      "replace a licensed veterinarian",
      "claim medical authority",
      "interpret scans as formal medical imaging",
      "override in-person veterinary judgment"
    ]),

    always: Object.freeze([
      "explain likely categories (comfort, pain, stress, fatigue, guarding, avoidance, etc.)",
      "explain what veterinarians typically check in similar situations",
      "explain red flags that warrant prompt veterinary attention",
      "interpret non-verbal cues (posture, gait, vocalization, interaction changes)",
      "explain what heatmaps / scans may suggest in plain language",
      "remind the user that only a licensed veterinarian can diagnose or treat"
    ])
  }),

  voice: Object.freeze({
    tone: "gentle, observational, behavior-aware",
    style:
      "calm, descriptive, non-alarmist, focused on patterns and possibilities rather than conclusions"
  }),

  boundaryReflex() {
    return "This is general animal health information, not a substitute for a licensed veterinarian.";
  },


  // --------------------------------------------------------------------------
  // SCAN INTERPRETER — distance-aware, tech-limited, not hard-limited
  // --------------------------------------------------------------------------
  // scan = {
  //   distance: number (meters or feet, caller-defined),
  //   heatmap: any,
  //   contrast: any,
  //   loopData: any,
  //   motion: any,
  //   posture: any,
  //   confidenceHint?: "high" | "medium" | "low"
  // }
  scanInterpreter(scan) {
    const notes = [];
    if (!scan) return { notes: ["No scan data provided."] };

    const distance = typeof scan.distance === "number" ? scan.distance : null;

    // Distance → confidence framing (no hard cutoff, just honesty)
    if (distance != null) {
      if (distance <= 5) {
        notes.push(
          "The animal appears relatively close — scan-based observations are likely to be more detailed."
        );
      } else if (distance <= 25) {
        notes.push(
          "The animal is at a moderate distance — observations are more general and may miss subtle details."
        );
      } else {
        notes.push(
          "The animal seems quite far away — scan-based observations are approximate and should be treated cautiously."
        );
      }
    } else {
      notes.push(
        "Scan distance is unknown — observations are based only on available patterns, not proximity."
      );
    }

    // Optional external confidence hint from your tech stack
    if (scan.confidenceHint === "high") {
      notes.push("Sensor confidence is high for this scan.");
    } else if (scan.confidenceHint === "medium") {
      notes.push("Sensor confidence is moderate — some details may be uncertain.");
    } else if (scan.confidenceHint === "low") {
      notes.push(
        "Sensor confidence is low — treat these observations as very rough and verify in person when possible."
      );
    }

    // Heatmap (non-medical)
    if (scan.heatmap) {
      notes.push(
        "Heatmap patterns show relatively warmer and cooler regions — vets often consider warmth, swelling, or guarding behavior when examining similar areas."
      );
    }

    // Contrast (non-medical)
    if (scan.contrast) {
      notes.push(
        "Contrast differences may highlight changes in fur density, posture tension, or surface temperature, rather than internal structures."
      );
    }

    // Loop / sweep data (non-medical)
    if (scan.loopData) {
      notes.push(
        "Loop-scan patterns can help spot asymmetry — for example, one side moving differently or bearing weight differently than the other."
      );
    }

    // Motion / gait
    if (scan.motion) {
      notes.push(
        "Motion patterns can hint at stiffness, hesitation, or favoring one limb — vets typically check joints, paws, and soft tissue when they see this."
      );
    }

    // Posture
    if (scan.posture) {
      notes.push(
        "Posture patterns, such as arching, curling, or guarding, can be signs of discomfort, stress, or protective behavior."
      );
    }

    return { notes };
  },

  // --------------------------------------------------------------------------
  // BEHAVIOR INTERPRETER — non-medical, pattern-focused
  // --------------------------------------------------------------------------
  // observation = {
  //   limping?: boolean,
  //   stiffness?: boolean,
  //   vocalization?: "none" | "whine" | "yelp" | "growl" | "other",
  //   energyLevel?: "normal" | "low" | "high",
  //   appetite?: "normal" | "reduced" | "none",
  //   socialChange?: "none" | "withdrawn" | "clingy" | "irritable",
  //   groomingChange?: "none" | "excessive" | "reduced"
  // }
  behaviorInterpreter(observation) {
    const notes = [];
    if (!observation) return { notes: ["No behavior data provided."] };

    if (observation.limping) {
      notes.push(
        "Limping or favoring a leg is a meaningful sign — veterinarians usually examine paws, nails, pads, joints, and soft tissue for pain or injury."
      );
    }

    if (observation.stiffness) {
      notes.push(
        "Stiffness, especially after rest, can be associated with joint discomfort or age-related changes — vets often check range of motion and joint sensitivity."
      );
    }

    if (observation.vocalization && observation.vocalization !== "none") {
      notes.push(
        "Changes in vocalization (like whining or yelping) can indicate discomfort, anxiety, or a response to specific movements or touch."
      );
    }

    if (observation.energyLevel === "low") {
      notes.push(
        "Lower energy than usual is a general red flag — vets typically consider hydration, temperature, recent activity, and possible underlying illness."
      );
    }

    if (observation.appetite === "reduced" || observation.appetite === "none") {
      notes.push(
        "Reduced or absent appetite is something veterinarians take seriously, especially if it lasts more than a day or is paired with other changes."
      );
    }

    if (observation.socialChange && observation.socialChange !== "none") {
      notes.push(
        "Changes in social behavior (more withdrawn, clingy, or irritable) can be subtle signs of discomfort, stress, or pain."
      );
    }

    if (observation.groomingChange && observation.groomingChange !== "none") {
      notes.push(
        "Changes in grooming — either excessive licking/chewing or reduced grooming — can point to irritation, pain, or general malaise."
      );
    }

    return { notes };
  }
});
