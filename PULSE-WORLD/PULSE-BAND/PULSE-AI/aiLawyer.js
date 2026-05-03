// ============================================================================
//  aiLawyer.js — PulseOS Legal Mapper Organ — v15-IMMORTAL-EVO++
//  Structured • Neutral • Doctrine‑Aware • Route‑Based Law Reader
// ============================================================================
//
//  CANONICAL ROLE:
//    • Legal issue spotter and doctrine mapper.
//    • Reads real law text (statutes / rules) when routed data is provided.
//    • Can request law data via the existing PulseOS route() mechanism.
//    • Never acts as a lawyer, never gives legal advice.
//    • Behaves as an intelligent legal assistant / legal mapper.
//
//  HARD GUARANTEES:
//    • No legal advice.
//    • No jurisdiction‑specific outcome predictions.
//    • No direct network primitives (no fetch/axios/etc inside this file).
//    • All external I/O is mediated by the caller’s route() / CNS.
//    • From this organ’s perspective: pure compute over provided data.
//
// ============================================================================

/*
AI_EXPERIENCE_META = {
  identity: "aiLawyer",
  version: "v15-IMMORTAL-EVO++",
  layer: "ai_tools",
  role: "legal_reasoner",
  lineage: "aiLawyer-v11 → v14-IMMORTAL → v15-IMMORTAL-EVO++",

  evo: {
    legalReasoning: true,
    structureMapping: true,
    symbolicPrimary: true,
    binaryAware: true,
    dualBand: true,

    deterministic: true,
    driftProof: true,
    pureCompute: true,
    zeroNetwork: true,          // from this organ’s POV (route() is external)
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
  subsystem: "aiLawyer",
  layer: "C5-LegalMapper",
  version: "15-IMMORTAL-EVO++",
  identity: "aiLawyer-v15-IMMORTAL-EVO++",

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
      "Spot legal issues, map doctrines, outline arguments and counterarguments, and explain how legal reasoning typically works, including reading routed law text.",

    never: Object.freeze([
      "give legal advice",
      "interpret jurisdiction-specific law as binding",
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
        zeroNetworkFromThisOrgan: true,
        zeroAdvice: true
      },
      jurisdiction: key,
      topic,
      url,
      note:
        "Deterministic pointer to a public law reference site. " +
        "This organ does not itself perform external I/O in pointer mode."
    });
  },

  // ========================================================================
  //  LAW READER v1 — interpret routed law text (statutes / rules)
  //  INPUT:
  //    law = {
  //      rawText: <string>,
  //      citations: [ ... ] (optional),
  //      source: <string> (optional),
  //      meta: { ... } (optional)
  //    }
  // ========================================================================
  lawReader(law = {}, binaryVitals = {}) {
    const notes = [];
    const text = (law.rawText || "").toLowerCase();

    if (!law.rawText) {
      return {
        notes: ["No law text provided to lawReader."],
        citations: law.citations || [],
        source: law.source || null
      };
    }

    const binaryPressure =
      binaryVitals?.layered?.organism?.pressure ??
      binaryVitals?.binary?.pressure ??
      0;

    if (binaryPressure >= 0.7) {
      notes.push("System load is elevated — law interpretation is simplified for safety.");
    }

    if (text.includes("negligence") || text.includes("duty of care")) {
      notes.push("Negligence-related concepts detected — typical elements include duty, breach, causation, and damages.");
    }

    if (text.includes("strict liability")) {
      notes.push("Strict liability language detected — focus is often on activity type and harm, not fault.");
    }

    if (text.includes("contract") || text.includes("agreement")) {
      notes.push("Contract-related language — lawyers usually examine offer, acceptance, consideration, and enforceability.");
    }

    if (text.includes("privacy") || text.includes("personal data")) {
      notes.push("Privacy-related language — common themes include consent, data handling, and reasonable expectations.");
    }

    if (text.includes("zoning") || text.includes("land use")) {
      notes.push("Zoning or land-use language — typical analysis includes permitted uses, variances, and compliance pathways.");
    }

    notes.push("A legal assistant would typically connect these provisions to the user’s facts, without giving advice or predicting outcomes.");

    return {
      notes,
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
        version: PulseRole.version
      }
    };

    const result = route(request);

    return {
      kind: "law-query-route",
      meta: {
        organ: PulseRole.identity,
        version: PulseRole.version,
        mode: "route",
        zeroNetworkFromThisOrgan: true,
        zeroAdvice: true
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
