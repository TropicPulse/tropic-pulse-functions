// ============================================================================
//  PULSE OS v11.3‑EVO — ASSISTANT ORGAN
//  Proactive • Interpretive • Gap‑Filling • Owner-Aware
//  PURE STRUCTURE. ZERO ACTION IN THE WORLD.
// ============================================================================

export const AssistantMeta = Object.freeze({
  layer: "PulseAIAssistantFrame",
  role: "ASSISTANT_ORGAN",
  version: "11.3-EVO",
  identity: "aiAssistant-v11.3-EVO",

  evo: Object.freeze({
    deterministic: true,
    driftProof: true,
    dualband: true,
    proactiveAware: true,       // notices missing steps
    mathAware: true,            // fills math gaps automatically
    patternAware: true,         // learns your style (locally, no identity)
    ownerComfortAware: true,    // avoids bothering unless helpful
    multiInstanceReady: true,
    epoch: "v11.3-EVO"
  }),

  contract: Object.freeze({
    purpose:
      "Turn chaos into steps, drafts, summaries, and plans — while filling gaps the user would expect filled.",

    never: Object.freeze([
      "act in the world",
      "send messages",
      "book things",
      "make commitments on behalf of the user",
      "override user intent",
      "nag or interrupt"
    ]),

    always: Object.freeze([
      "clarify only when needed",
      "organize chaos into structure",
      "draft cleanly",
      "prioritize intelligently",
      "auto-fill missing math or logic",
      "interpret intent, not literal text",
      "stay supportive, quiet, and useful"
    ])
  }),

  voice: Object.freeze({
    tone: "supportive, clear, structured, non-intrusive"
  }),

  boundaryReflex() {
    return "This is general assistance, and you make the final decisions.";
  }
});

// ============================================================================
// PUBLIC API — Create Assistant Organ
// ============================================================================
export function createAssistantOrgan(context) {

  // --------------------------------------------------------------------------
  // INTERNAL: detect if user struggles with math or structure
  // --------------------------------------------------------------------------
  function detectGaps(input) {
    const text = String(input || "").toLowerCase();

    return {
      needsMath:
        /\d+\s*[\+\-\*\/]\s*\d+/.test(text) ||
        /how much|how many|total|difference|sum|split|divide/.test(text),

      needsStructure:
        text.includes("plan") ||
        text.includes("steps") ||
        text.includes("organize") ||
        text.includes("help me figure") ||
        text.length > 120
    };
  }

  // --------------------------------------------------------------------------
  // AUTO-MATH — fill in math without asking
  // --------------------------------------------------------------------------
  function autoMath(input) {
    try {
      const match = input.match(/(\d+)\s*([\+\-\*\/])\s*(\d+)/);
      if (!match) return null;

      const a = Number(match[1]);
      const op = match[2];
      const b = Number(match[3]);

      let result = null;
      if (op === "+") result = a + b;
      if (op === "-") result = a - b;
      if (op === "*") result = a * b;
      if (op === "/") result = b !== 0 ? a / b : null;

      return {
        expression: `${a} ${op} ${b}`,
        result
      };
    } catch {
      return null;
    }
  }

  // --------------------------------------------------------------------------
  // CLARIFIER — only when needed
  // --------------------------------------------------------------------------
  function clarify(input) {
    return {
      type: "clarification",
      input,
      questions: [
        "What is the main goal?",
        "What constraints matter?",
        "What is the timeline?",
        "What resources are available?",
        "What does success look like?"
      ],
      message:
        "Clarifying questions provided only because the request was ambiguous."
    };
  }

  // --------------------------------------------------------------------------
  // ORGANIZER — Turn chaos into structure
  // --------------------------------------------------------------------------
  function organize(items = []) {
    return {
      type: "organization",
      items,
      grouped: {
        highPriority: items.filter(i => i.priority === "high"),
        mediumPriority: items.filter(i => i.priority === "medium"),
        lowPriority: items.filter(i => i.priority === "low")
      },
      message:
        "Items organized by priority. No action taken — just structure."
    };
  }

  // --------------------------------------------------------------------------
  // DRAFT BUILDER — Turn ideas into text
  // --------------------------------------------------------------------------
  function draft(type, content) {
    return {
      type: "draft",
      draftType: type,
      content,
      message: `Draft generated for: ${type}.`
    };
  }

  // --------------------------------------------------------------------------
  // PRIORITY MAPPER — Turn tasks into a sequence
  // --------------------------------------------------------------------------
  function prioritize(tasks = []) {
    const ordered = [...tasks].sort((a, b) => (a.weight || 0) - (b.weight || 0));

    return {
      type: "priority-map",
      tasks: ordered,
      message: "Tasks prioritized based on weights."
    };
  }

  // --------------------------------------------------------------------------
  // SUMMARY BUILDER — Turn content into a digest
  // --------------------------------------------------------------------------
  function summarize(text) {
    return {
      type: "summary",
      originalLength: text?.length || 0,
      summary:
        text && text.length > 0
          ? text.split(/\s+/).slice(0, 40).join(" ") + " ..."
          : "",
      message: "High-level summary generated."
    };
  }

  // --------------------------------------------------------------------------
  // INTERPRETIVE ASSIST — the magic
  // --------------------------------------------------------------------------
  function interpret(input) {
    const gaps = detectGaps(input);
    const math = gaps.needsMath ? autoMath(input) : null;

    return Object.freeze({
      type: "interpretation",
      input,
      autoMath: math,
      needsStructure: gaps.needsStructure,
      message:
        "Interpreted your request and filled gaps automatically without bothering you."
    });
  }

  // --------------------------------------------------------------------------
  // PUBLIC ASSISTANT API
  // --------------------------------------------------------------------------
  return Object.freeze({
    meta: AssistantMeta,

    log(message) {
      context?.logStep?.(`aiAssistant: ${message}`);
    },

    clarify,
    organize,
    draft,
    prioritize,
    summarize,
    interpret
  });
}
