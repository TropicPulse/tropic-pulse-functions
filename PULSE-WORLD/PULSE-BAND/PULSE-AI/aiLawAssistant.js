// ============================================================================
//  aiLawAssistant.js — PulseOS Legal Assistant Organ — v15-IMMORTAL-EVO++
//  Structured • Neutral • Doctrine‑Aware • Route‑Based Law Reader
// ============================================================================
//
//  CANONICAL ROLE:
//    • Law Assistant (Not a Lawyer).
//    • Provides general legal information, research support, and doctrine mapping.
//    • Helps users understand what topics, questions, or documents may be relevant
//      to bring to a licensed attorney.
//    • Spots legal issues and maps doctrines from documents, permits, and law text.
//    • Requests law data via PulseOS route() and reads real statutes/rules.
//    • Guides users toward the kinds of issues lawyers typically examine,
//      WITHOUT recommending actions or replacing a lawyer.
//
//  ROLE BOUNDARY (Declared Once):
//    • This organ is a Law Assistant, not a lawyer.
//    • It does not give legal advice or tell users what to do.
//    • It does not replace a licensed attorney.
//    • It is meant to support you and your lawyer by organizing information,
//      highlighting issues, and surfacing questions you may want to ask.
//
//  HARD GUARANTEES:
//    • No legal advice, no “do X” directives.
//    • No jurisdiction‑specific outcome predictions.
//    • No direct network primitives (no fetch/axios/etc inside this file).
//    • All external I/O is mediated by the caller’s route() / CNS.
//    • From this organ’s perspective: pure compute over provided data.
//
// ============================================================================

/*
AI_EXPERIENCE_META = {
  identity: "aiLawAssistant",
  version: "v15-IMMORTAL-EVO++",
  layer: "ai_tools",
  role: "legal_assistant",
  lineage: "aiLawyer-v11 → v14-IMMORTAL → v15-IMMORTAL-EVO++ (Law Assistant)",

  evo: {
    legalReasoning: true,
    structureMapping: true,
    symbolicPrimary: true,
    binaryAware: true,
    dualBand: true,

    deterministic: true,
    driftProof: true,
    pureCompute: true,
    zeroNetwork: true,          // from this organ’s POV (route() is external I/O)
    zeroFilesystem: true,
    zeroMutationOfInput: true,

    immortalityEpoch: true,
    packetAware: true,
    arteryAware: true,
    lawQueryAware: true,
    lawRouteAware: true,
    lawReaderAware: true
  },

  contract: {
    always: ["aiContext", "aiArchitect", "aiCortex"],
    never: ["safeRoute", "fetchViaCNS"]
  }
}
*/

export const PulseRole = Object.freeze({
  type: "Cognitive",
  subsystem: "aiLawAssistant",
  layer: "C5-LegalMapper",
  version: "15-IMMORTAL-EVO++",
  identity: "aiLawAssistant-v15-IMMORTAL-EVO++",

  // --------------------------------------------------------------------------
  // EVO BLOCK — v15‑IMMORTAL‑EVO++ invariants
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
    lawQueryAware: true,
    lawRouteAware: true,
    lawReaderAware: true,
    multiInstanceReady: true,
    readOnly: true,
    epoch: "15-IMMORTAL-EVO++",

    // Network is handled by outer route()/CNS, not by this organ.
    zeroNetwork: true,
    zeroFilesystem: true,
    zeroMutationOfInput: true
  }),


  // --------------------------------------------------------------------------
  // CONTRACT — what this organ MUST and MUST NOT do
  // --------------------------------------------------------------------------
  contract: Object.freeze({
    purpose:
      "Act as a law assistant: spot legal issues, map doctrines, outline arguments and counterarguments, and explain how legal reasoning typically works, including reading routed law text, so users can better prepare what to discuss with their lawyer.",

    never: Object.freeze([
      "give legal advice",
      "act as an attorney or legal representative",
      "interpret jurisdiction-specific law as binding on the user",
      "tell the user what to do",
      "predict legal outcomes",
      "claim legal authority",
      "override user autonomy",
      "imply legal certainty"
    ]),

    always: Object.freeze([
      "explain doctrines in plain language",
      "explain risks and categories in general terms",
      "explain what lawyers typically look for",
      "explain how courts analyze similar issues",
      "outline arguments and counterarguments",
      "explain how a rule or permit fits into a legal framework",
      "highlight issues and questions a user may want to raise with their lawyer",
      "stay neutral, structured, and ego-free",
      "stay evolution-aware when mapping concepts",
      "treat external law data as informational, not prescriptive"
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

  // Single boundary hook for callers that want an explicit disclaimer.
  boundaryReflex() {
    return "I’m a law assistant, not a lawyer. I can help you understand issues and questions to bring to your attorney, but I don’t give legal advice.";
  },

  // ========================================================================
  //  DOCUMENT INTERPRETER v3 — issue spotting + doctrine mapping
  // ========================================================================
  documentInterpreter(doc = {}, binaryVitals = {}) {
    const notes = [];
    const questionsForLawyer = [];

    if (!doc.text) {
      return {
        notes: ["No document text provided."],
        questionsForLawyer: []
      };
    }

    const text = doc.text.toLowerCase();
    const binaryPressure =
      binaryVitals?.layered?.organism?.pressure ??
      binaryVitals?.binary?.pressure ??
      0;

    if (binaryPressure >= 0.7) {
      notes.push("System load is elevated — interpretations are simplified for safety.");
    }

    if (text.includes("permit")) {
      notes.push("Permit language detected — legal assistants typically flag scope, conditions, revocation clauses, and compliance obligations for review.");
      questionsForLawyer.push("Does the scope or conditions of this permit create any unexpected obligations or risks for me?");
    }

    if (text.includes("liability")) {
      notes.push("Liability terms appear — common doctrines include negligence, duty of care, assumption of risk, and sometimes strict liability.");
      questionsForLawyer.push("How do these liability terms affect my exposure to risk in practical terms?");
    }

    if (text.includes("contract")) {
      notes.push("Contractual structure detected — assistants often map offer, acceptance, consideration, and enforceability for a lawyer to review.");
      questionsForLawyer.push("Are there any clauses in this contract that could be unusually risky or hard to get out of?");
    }

    if (text.includes("privacy")) {
      notes.push("Privacy-related language — typical frameworks include consent, data handling, retention, and reasonable expectations of privacy.");
      questionsForLawyer.push("Do these privacy terms align with what I actually expect will happen to my data?");
    }

    if (text.includes("zoning") || text.includes("land use")) {
      notes.push("Zoning or land-use concepts detected — assistants usually identify permitted uses, variances, and compliance pathways.");
      questionsForLawyer.push("Are there any zoning or land-use restrictions here that could block what I want to do with this property?");
    }

    notes.push("A law assistant would typically map the issues, identify relevant doctrines, and collect comparable rules or cases for a lawyer to analyze.");
    questionsForLawyer.push("Are there any parts of this document you think I should pay special attention to before I sign or rely on it?");

    return { notes, questionsForLawyer };
  },

  // ========================================================================
  //  PERMIT INTERPRETER v3 — “How does this apply to my permit?”
  // ========================================================================
  permitInterpreter(permit = {}, binaryVitals = {}) {
    const notes = [];
    const questionsForLawyer = [];

    if (!permit.description) {
      return {
        notes: ["No permit description provided."],
        questionsForLawyer: []
      };
    }

    const desc = permit.description.toLowerCase();
    const binaryPressure =
      binaryVitals?.layered?.organism?.pressure ??
      binaryVitals?.binary?.pressure ??
      0;

    if (binaryPressure >= 0.7) {
      notes.push("System load is elevated — interpretations are simplified for safety.");
    }

    notes.push("Permit detected — a law assistant would typically flag scope, conditions, compliance obligations, and revocation triggers.");
    questionsForLawyer.push("What happens if I fail to meet any of the conditions in this permit?");

    if (desc.includes("construction")) {
      notes.push("Construction-related permit — common legal categories include zoning compliance, environmental impact, building codes, and safety requirements.");
      questionsForLawyer.push("Are there any building code or safety requirements in this permit that could be especially costly or strict?");
    }

    if (desc.includes("business")) {
      notes.push("Business permit — assistants often check operational scope, renewal requirements, and local regulatory obligations.");
      questionsForLawyer.push("Does this business permit limit the types of activities I can legally perform?");
    }

    if (desc.includes("event")) {
      notes.push("Event permit — typical considerations include crowd safety, insurance, noise limits, and public space rules.");
      questionsForLawyer.push("Do I need any special insurance or additional approvals beyond this event permit?");
    }

    notes.push("A law assistant would compare the permit’s language to similar permits, relevant doctrines, and any conditions that could create risk, for a lawyer to review.");
    questionsForLawyer.push("Is there anything in this permit that could expose me to unexpected fines, penalties, or shutdowns?");

    return { notes, questionsForLawyer };
  },

  // ========================================================================
  //  ARGUMENT MAPPER v3 — outlines arguments + counterarguments
  // ========================================================================
  argumentMapper(issue = "", binaryVitals = {}) {
    const notes = [];
    const questionsForLawyer = [];

    if (!issue) {
      return {
        notes: ["No issue provided."],
        questionsForLawyer: []
      };
    }

    const binaryPressure =
      binaryVitals?.layered?.organism?.pressure ??
      binaryVitals?.binary?.pressure ??
      0;

    if (binaryPressure >= 0.7) {
      notes.push("System load is elevated — argument mapping is simplified.");
    }

    notes.push(`Issue identified: ${issue}`);
    notes.push("Typical legal reasoning: identify the governing rule, apply it to the facts, and consider exceptions or competing doctrines.");
    notes.push("Arguments often focus on interpretation, intent, compliance, and whether the facts satisfy the rule’s elements.");
    notes.push("Counterarguments usually challenge the rule’s applicability, the factual assumptions, or the interpretation of key terms.");

    questionsForLawyer.push("Based on this issue, what legal options might be available to me?");
    questionsForLawyer.push("Are there any deadlines or time limits (statutes of limitation) I should be aware of for this issue?");
    questionsForLawyer.push("What facts about my situation are most important for you to evaluate this issue?");

    return { notes, questionsForLawyer };
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
  },

  // ========================================================================
  //  INTERNAL HELPER — LAW QUERY POINTER (no route, no I/O)
  // ========================================================================
  _lawQueryPointer({ jurisdiction = "federal", topic = "" } = {}) {
    const sources = {
      federal:    "https://www.law.cornell.edu/search/site/",
      arizona:    "https://www.azleg.gov/arsDetail/?title=",
      california: "https://leginfo.legislature.ca.gov/faces/search.xhtml?search_keywords=",
      new_york:   "https://www.nysenate.gov/legislation/laws?search=",
      florida:    "http://www.leg.state.fl.us/statutes/index.cfm?App_mode=Search&Search_String="
    };

    const key  = (jurisdiction || "federal").toLowerCase();
    const base = sources[key] || sources.federal;
    const q    = encodeURIComponent(topic || "");
    const url  = `${base}${q}`;

    return Object.freeze({
      kind: "law-query-pointer",
      meta: {
        organ: PulseRole.identity,
        version: PulseRole.version,
        mode: "pointer",
        zeroNetworkFromThisOrgan: true
      },
      jurisdiction: key,
      topic,
      url,
      note:
        "Deterministic pointer to a public law reference site. External I/O is handled by the caller, not this law assistant."
    });
  },

  // ========================================================================
  //  LAW READER v1 — interpret routed law text (statutes / rules)
  // ========================================================================
  lawReader(law = {}, binaryVitals = {}) {
    const notes = [];
    const questionsForLawyer = [];
    const text = (law.rawText || "").toLowerCase();

    if (!law.rawText) {
      return {
        notes: ["No law text provided to lawReader."],
        questionsForLawyer: [],
        citations: law.citations || [],
        source: law.source || null
      };
    }

    const binaryPressure =
      binaryVitals?.layered?.organism?.pressure ??
      binaryVitals?.binary?.pressure ??
      0;

    if (binaryPressure >= 0.7) {
      notes.push("System load is elevated — law interpretation is simplified.");
    }

    if (text.includes("negligence") || text.includes("duty of care")) {
      notes.push("Negligence-related concepts detected — typical elements include duty, breach, causation, and damages.");
      questionsForLawyer.push("Does this negligence standard change how a court might view my actions or responsibilities?");
    }

    if (text.includes("strict liability")) {
      notes.push("Strict liability language detected — focus is often on the nature of the activity and resulting harm, rather than fault.");
      questionsForLawyer.push("Does strict liability here mean I could be responsible even if I was careful?");
    }

    if (text.includes("contract") || text.includes("agreement")) {
      notes.push("Contract-related language — assistants usually map offer, acceptance, consideration, and conditions for enforceability.");
      questionsForLawyer.push("Are there any conditions in this contract that could make it hard for me to enforce my rights?");
    }

    if (text.includes("privacy") || text.includes("personal data")) {
      notes.push("Privacy-related language — common themes include consent, data handling, retention, and user expectations.");
      questionsForLawyer.push("Do these privacy rules give me any rights to see, correct, or delete my data?");
    }

    if (text.includes("zoning") || text.includes("land use")) {
      notes.push("Zoning or land-use language — typical analysis includes permitted uses, variances, and compliance mechanisms.");
      questionsForLawyer.push("Would I need a variance or special permission to use my property the way I intend?");
    }

    notes.push("A law assistant would typically connect these provisions to the user’s described situation for a lawyer to review, without giving advice.");
    questionsForLawyer.push("Based on this law, what are the main risks or protections that might apply to my situation?");

    return {
      notes,
      questionsForLawyer,
      citations: law.citations || [],
      source: law.source || null,
      meta: law.meta || {}
    };
  },

  // ========================================================================
  //  LAW + ISSUE MAPPER v1 — combine user issue + routed law text
  // ========================================================================
  issueWithLaw({ issue = "", law = {}, binaryVitals = {} } = {}) {
    const base = this.argumentMapper(issue, binaryVitals);
    const lawView = this.lawReader(law, binaryVitals);

    return {
      issueNotes: base.notes,
      lawNotes: lawView.notes,
      questionsForLawyer: [
        ...(base.questionsForLawyer || []),
        ...(lawView.questionsForLawyer || [])
      ],
      citations: lawView.citations,
      source: lawView.source,
      meta: lawView.meta
    };
  },

  // ========================================================================
  //  LAW QUERY v3 — pointer + route‑based query
  //
  //  MODES:
  //    • "pointer"  → deterministic URL only (no route call).
  //    • "route"    → uses provided route() to request law data.
  //    • "auto"     → if route present → "route", else → "pointer".
  //
  //  ROUTE CONTRACT (external, PulseOS CNS):
  //    route({
  //      type: "law-query",
  //      payload: { jurisdiction, topic }
  //    }) MUST:
  //      • return a value or Promise:
  //          { rawText, citations, source, meta }  OR  { error, meta }
  //      • own all external I/O and API details.
  //      • keep this organ free of direct network primitives.
  // ========================================================================
  lawQuery({ jurisdiction = "federal", topic = "", mode = "auto", route = null } = {}) {
    const pointer = this._lawQueryPointer({ jurisdiction, topic });

    const effectiveMode =
      mode === "auto"
        ? (typeof route === "function" ? "route" : "pointer")
        : mode;

    if (effectiveMode !== "route" || typeof route !== "function") {
      return pointer;
    }

    const request = {
      type: "law-query",
      payload: {
        jurisdiction: pointer.jurisdiction,
        topic: pointer.topic
      },
      meta: {
        fromOrgan: PulseRole.identity,
        version: PulseRole.version,
        role: "legal_assistant"
      }
    };

    const result = route(request);

    return {
      kind: "law-query-route",
      meta: {
        organ: PulseRole.identity,
        version: PulseRole.version,
        mode: "route",
        zeroNetworkFromThisOrgan: true
      },
      jurisdiction: pointer.jurisdiction,
      topic: pointer.topic,
      pointer,
      result
      // result is route-defined:
      //   { rawText, citations, source, meta } or { error, meta }.
    };
  }
});
