// ============================================================================
//  aiLawyer.js — PulseOS Legal Mapper Organ — v11.2‑EVO
//  Structured • Neutral • Doctrine‑Aware • Zero‑Advice
// ----------------------------------------------------------------------------
//  CANONICAL ROLE:
//    This organ is the **Legal Mapper** of the organism.
//    It does NOT give legal advice.
//    It does NOT interpret jurisdiction‑specific law.
//    It ONLY:
//      • spots issues
//      • maps doctrines
//      • outlines arguments + counterarguments
//      • explains how legal reasoning typically works
//
//  ARCHITECTURAL NOTES:
//    • symbolic‑aware (reads text, not meaningfully interprets law)
//    • dualband‑aware (safe for both symbolic + binary layers)
//    • evolution‑aware (tone + clarity adapt to user evolution mode)
//    • window‑aware (safe summaries for UI)
//    • ego‑free (aligned with IdentityCore + GeniusWithoutEgo)
// ============================================================================

export const PulseRole = Object.freeze({
  type: "Cognitive",
  subsystem: "aiLawyer",
  layer: "C5-LegalMapper",
  version: "11.2-EVO",
  identity: "aiLawyer-v11.2-EVO",

  // --------------------------------------------------------------------------
  // EVO BLOCK — v11.2‑EVO invariants
  // --------------------------------------------------------------------------
  evo: Object.freeze({
    driftProof: true,          // identity + behavior cannot drift
    deterministic: true,       // no randomness, no variability
    dualband: true,            // safe for symbolic + binary layers
    packetAware: true,         // future packet‑bus compatibility
    evolutionAware: true,      // tone adapts to user evolution mode
    windowAware: true,         // safe summaries for UI
    bluetoothReady: true,      // placeholder for future channels

    binaryAware: true,         // safe to coexist with binary organs
    symbolicAware: true,       // reads text safely
    safetyReflex: true,        // respects global safety boundaries
    documentAware: true,       // can scan + map documents
    argumentAware: true,       // can outline arguments + counters

    multiInstanceReady: true,  // safe for multiple personas
    readOnly: true,            // cannot mutate organism state
    epoch: "v11.2-EVO"
  }),

  // --------------------------------------------------------------------------
  // CONTRACT — what this organ MUST and MUST NOT do
  // --------------------------------------------------------------------------
  contract: Object.freeze({
    purpose:
      "Spot legal issues, map doctrines, outline arguments and counterarguments, and explain how legal reasoning typically works.",

    never: Object.freeze([
      "give legal advice",                 // no directives
      "interpret jurisdiction-specific law",
      "tell the user what to do",
      "predict outcomes",
      "claim legal authority",
      "override user autonomy",            // v11.2 addition
      "imply legal certainty"              // v11.2 addition
    ]),

    always: Object.freeze([
      "explain doctrines in plain language",
      "explain risks and categories",
      "explain what lawyers typically look for",
      "explain how courts analyze similar issues",
      "outline arguments and counterarguments",
      "explain how a rule or permit fits into a legal framework",
      "stay neutral, structured, and ego-free",   // v11.2 addition
      "stay evolution-aware when mapping concepts" // v11.2 addition
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

  // --------------------------------------------------------------------------
  // DOCUMENT INTERPRETER — issue spotting + doctrine mapping
  // --------------------------------------------------------------------------
  // doc = { text: string, metadata?: any }
  // Returns: { notes: string[] }
  // This is NOT legal advice — only pattern-based legal reasoning.
  // --------------------------------------------------------------------------
  documentInterpreter(doc) {
    const notes = [];
    if (!doc || !doc.text) {
      return { notes: ["No document text provided."] };
    }

    const text = doc.text.toLowerCase();

    // Pattern-based issue spotting (non-jurisdictional)
    if (text.includes("permit")) {
      notes.push(
        "Permit language detected — lawyers typically check scope, conditions, revocation clauses, and compliance obligations."
      );
    }

    if (text.includes("liability")) {
      notes.push(
        "Liability terms appear — common doctrines include negligence, duty of care, and assumption of risk."
      );
    }

    if (text.includes("contract")) {
      notes.push(
        "Contractual structure detected — lawyers often analyze offer, acceptance, consideration, and enforceability."
      );
    }

    if (text.includes("privacy")) {
      notes.push(
        "Privacy-related language — typical frameworks include consent, data handling, and reasonable expectations."
      );
    }

    if (text.includes("zoning") || text.includes("land use")) {
      notes.push(
        "Zoning or land-use concepts detected — lawyers usually examine permitted uses, variances, and compliance pathways."
      );
    }

    // Always include a general fallback
    notes.push(
      "A lawyer would typically map the issues, identify relevant doctrines, and compare the text to similar cases or rules."
    );

    return { notes };
  },

  // --------------------------------------------------------------------------
  // PERMIT INTERPRETER — “How does this apply to my permit?”
  // --------------------------------------------------------------------------
  // permit = { description: string, conditions?: any }
  // Returns: { notes: string[] }
  // --------------------------------------------------------------------------
  permitInterpreter(permit) {
    const notes = [];
    if (!permit || !permit.description) {
      return { notes: ["No permit description provided."] };
    }

    notes.push(
      "Permit detected — lawyers typically examine scope, conditions, compliance obligations, and revocation triggers."
    );

    const desc = permit.description.toLowerCase();

    if (desc.includes("construction")) {
      notes.push(
        "Construction-related permit — common legal categories include zoning compliance, environmental impact, and safety requirements."
      );
    }

    if (desc.includes("business")) {
      notes.push(
        "Business permit — lawyers often check operational scope, renewal requirements, and local regulatory obligations."
      );
    }

    if (desc.includes("event")) {
      notes.push(
        "Event permit — typical considerations include crowd safety, insurance, noise limits, and public space rules."
      );
    }

    notes.push(
      "A lawyer would compare the permit’s language to similar permits, relevant doctrines, and any conditions that could create risk."
    );

    return { notes };
  },

  // --------------------------------------------------------------------------
  // ARGUMENT MAPPER — outlines arguments + counterarguments
  // --------------------------------------------------------------------------
  // issue = string
  // Returns: { notes: string[] }
  // --------------------------------------------------------------------------
  argumentMapper(issue) {
    const notes = [];
    if (!issue) return { notes: ["No issue provided."] };

    notes.push(`Issue identified: ${issue}`);

    notes.push(
      "Typical lawyer approach: identify the rule, apply it to the facts, and consider exceptions or competing doctrines."
    );

    notes.push(
      "Arguments often focus on interpretation, intent, compliance, and whether the facts meet the rule’s requirements."
    );

    notes.push(
      "Counterarguments usually challenge the rule’s applicability, the factual assumptions, or the interpretation of key terms."
    );

    return { notes };
  }
});
