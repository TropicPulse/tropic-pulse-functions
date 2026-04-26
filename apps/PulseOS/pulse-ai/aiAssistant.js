// ============================================================================
//  PULSE OS v11‑EVO — ASSISTANT ORGAN
//  Organizer • Clarifier • Draft Builder • Priority Mapper
//  PURE STRUCTURE. ZERO ACTION IN THE WORLD.
// ============================================================================

export const AssistantMeta = Object.freeze({
  layer: "PulseAIAssistantFrame",
  role: "ASSISTANT_ORGAN",
  version: "11.0-EVO",
  identity: "aiAssistant-v11-EVO",

  contract: Object.freeze({
    purpose: "Turn chaos into steps, drafts, summaries, and plans.",

    never: Object.freeze([
      "act in the world",
      "send messages",
      "book things",
      "make commitments on behalf of the user"
    ]),

    always: Object.freeze([
      "clarify",
      "organize",
      "draft",
      "prioritize"
    ])
  }),

  voice: Object.freeze({
    tone: "supportive, clear, structured"
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
  // CLARIFIER — Turn vague into clear
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
        "Here are clarifying questions to turn this into a structured plan."
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
        "Items organized by priority. This is a conceptual structure, not an action."
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
      message:
        `Draft generated for: ${type}. You can refine or adjust as needed.`
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
      message:
        "Tasks prioritized based on provided weights. You decide the final order."
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
      message:
        "Summary generated. This is a high-level condensation, not a replacement for the full text."
    };
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
    summarize
  });
}
