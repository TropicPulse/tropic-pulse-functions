// ============================================================================
//  aiLawyer.js — PulseOS Legal Mapper Organ — v12.3‑EVO+
//  Structured • Neutral • Doctrine‑Aware • Zero‑Advice
// ============================================================================

export const PulseRole = Object.freeze({
  type: "Cognitive",
  subsystem: "aiLawyer",
  layer: "C5-LegalMapper",
  version: "12.3-EVO+",
  identity: "aiLawyer-v12.3-EVO+",

  // --------------------------------------------------------------------------
  // EVO BLOCK — v12.3‑EVO+ invariants
  // --------------------------------------------------------------------------
  evo: Object.freeze({
    driftProof: true,
    deterministic: true,
    dualband: true,
    packetAware: true,
    evolutionAware: true,
    windowAware: true,
    bluetoothReady: true,

    binaryAware: true,
    symbolicAware: true,
    safetyReflex: true,
    documentAware: true,
    argumentAware: true,

    archetypeArteryAware: true,
    multiInstanceReady: true,
    readOnly: true,
    epoch: "12.3-EVO+"
  }),

  // --------------------------------------------------------------------------
  // CONTRACT — what this organ MUST and MUST NOT do
  // --------------------------------------------------------------------------
  contract: Object.freeze({
    purpose:
      "Spot legal issues, map doctrines, outline arguments and counterarguments, and explain how legal reasoning typically works.",

    never: Object.freeze([
      "give legal advice",
      "interpret jurisdiction-specific law",
      "tell the user what to do",
      "predict outcomes",
      "claim legal authority",
      "override user autonomy",
      "imply legal certainty"
    ]),

    always: Object.freeze([
      "explain doctrines in plain language",
      "explain risks and categories",
      "explain what lawyers typically look for",
      "explain how courts analyze similar issues",
      "outline arguments and counterarguments",
      "explain how a rule or permit fits into a legal framework",
      "stay neutral, structured, and ego-free",
      "stay evolution-aware when mapping concepts"
    ])
  }),

  // --------------------------------------------------------------------------
  // VOICE — tone + style for all outputs
  // --------------------------------------------------------------------------
  voice: Object.freeze({
    tone: "structured, logical, neutral",
    style: "issue-first, doctrine-first, risk-aware",
    evolutionTone: "calm, grounded, non-authoritative"
  }),

  boundaryReflex() {
    return "This is general legal information, not formal legal advice.";
  },

  // ========================================================================
  //  DOCUMENT INTERPRETER v3 — issue spotting + doctrine mapping
  // ========================================================================
  documentInterpreter(doc = {}, binaryVitals = {}) {
    const notes = [];
    if (!doc.text) return { notes: ["No document text provided."] };

    const text = doc.text.toLowerCase();
    const binaryPressure =
      binaryVitals?.layered?.organism?.pressure ??
      binaryVitals?.binary?.pressure ??
      0;

    if (binaryPressure >= 0.7) {
      notes.push("System load is elevated — interpretations are simplified for safety.");
    }

    if (text.includes("permit")) {
      notes.push("Permit language detected — lawyers typically check scope, conditions, revocation clauses, and compliance obligations.");
    }

    if (text.includes("liability")) {
      notes.push("Liability terms appear — common doctrines include negligence, duty of care, and assumption of risk.");
    }

    if (text.includes("contract")) {
      notes.push("Contractual structure detected — lawyers often analyze offer, acceptance, consideration, and enforceability.");
    }

    if (text.includes("privacy")) {
      notes.push("Privacy-related language — typical frameworks include consent, data handling, and reasonable expectations.");
    }

    if (text.includes("zoning") || text.includes("land use")) {
      notes.push("Zoning or land-use concepts detected — lawyers usually examine permitted uses, variances, and compliance pathways.");
    }

    notes.push("A lawyer would typically map the issues, identify relevant doctrines, and compare the text to similar cases or rules.");

    return { notes };
  },

  // ========================================================================
  //  PERMIT INTERPRETER v3 — “How does this apply to my permit?”
  // ========================================================================
  permitInterpreter(permit = {}, binaryVitals = {}) {
    const notes = [];
    if (!permit.description) return { notes: ["No permit description provided."] };

    const desc = permit.description.toLowerCase();
    const binaryPressure =
      binaryVitals?.layered?.organism?.pressure ??
      binaryVitals?.binary?.pressure ??
      0;

    if (binaryPressure >= 0.7) {
      notes.push("System load is elevated — interpretations are simplified for safety.");
    }

    notes.push("Permit detected — lawyers typically examine scope, conditions, compliance obligations, and revocation triggers.");

    if (desc.includes("construction")) {
      notes.push("Construction-related permit — common legal categories include zoning compliance, environmental impact, and safety requirements.");
    }

    if (desc.includes("business")) {
      notes.push("Business permit — lawyers often check operational scope, renewal requirements, and local regulatory obligations.");
    }

    if (desc.includes("event")) {
      notes.push("Event permit — typical considerations include crowd safety, insurance, noise limits, and public space rules.");
    }

    notes.push("A lawyer would compare the permit’s language to similar permits, relevant doctrines, and any conditions that could create risk.");

    return { notes };
  },

  // ========================================================================
  //  ARGUMENT MAPPER v3 — outlines arguments + counterarguments
  // ========================================================================
  argumentMapper(issue = "", binaryVitals = {}) {
    const notes = [];
    if (!issue) return { notes: ["No issue provided."] };

    const binaryPressure =
      binaryVitals?.layered?.organism?.pressure ??
      binaryVitals?.binary?.pressure ??
      0;

    if (binaryPressure >= 0.7) {
      notes.push("System load is elevated — argument mapping is simplified.");
    }

    notes.push(`Issue identified: ${issue}`);
    notes.push("Typical lawyer approach: identify the rule, apply it to the facts, and consider exceptions or competing doctrines.");
    notes.push("Arguments often focus on interpretation, intent, compliance, and whether the facts meet the rule’s requirements.");
    notes.push("Counterarguments usually challenge the rule’s applicability, the factual assumptions, or the interpretation of key terms.");

    return { notes };
  },

  // ========================================================================
  //  ARCHETYPE ARTERY v3 — symbolic-only, deterministic
  // ========================================================================
  archetypeArtery({ doc = {}, permit = {}, issue = "", binaryVitals = {} } = {}) {
    const binaryPressure =
      binaryVitals?.layered?.organism?.pressure ??
      binaryVitals?.binary?.pressure ??
      0;

    const hasDoc = !!doc.text;
    const hasPermit = !!permit.description;
    const hasIssue = !!issue;

    const localPressure =
      (hasDoc ? 0.3 : 0) +
      (hasPermit ? 0.3 : 0) +
      (hasIssue ? 0.3 : 0) +
      (binaryPressure * 0.4);

    const pressure = Math.max(0, Math.min(1, localPressure));

    return {
      organism: {
        pressure,
        pressureBucket:
          pressure >= 0.9 ? "overload" :
          pressure >= 0.7 ? "high" :
          pressure >= 0.4 ? "medium" :
          pressure > 0 ? "low" : "none"
      },
      inputs: {
        hasDoc,
        hasPermit,
        hasIssue
      }
    };
  }
});
