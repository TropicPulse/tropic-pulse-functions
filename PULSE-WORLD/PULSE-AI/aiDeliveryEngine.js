// aiDeliveryEngine.js
// PulseOS Delivery Organ — v11‑EVO
// Ensures information is delivered cleanly, clearly, deterministically, and without drift.
// ---------------------------------------------------------
//  DELIVERY ENGINE PREWARM — v11‑EVO
// ---------------------------------------------------------
export function prewarmDeliveryEngine() {
  try {
    const warmText = `
      This   is   a   prewarm   test.  .
      
      
      With --- dashes — and em-dashes.
    `;

    // Warm deliver()
    aiDeliveryEngine.deliver(warmText);

    // Warm structure()
    aiDeliveryEngine.structure(warmText);

    // Warm finalize()
    aiDeliveryEngine.finalize(warmText);

    return true;
  } catch (err) {
    console.error("[DeliveryEngine Prewarm] Failed:", err);
    return false;
  }
}

export const aiDeliveryEngine = {

  // ─────────────────────────────────────────────────────────────
  // META BLOCK — ORGAN IDENTITY
  // ─────────────────────────────────────────────────────────────
  meta: {
    type: "Cognitive",
    subsystem: "aiDelivery",
    layer: "C1-DeliveryEngine",
    version: "11.0",
    identity: "aiDeliveryEngine-v11-EVO",

    contract: {
      purpose: "Deliver information in a clean, structured, evolved, drift-proof format.",
      never: [
        "introduce noise",
        "add ego",
        "add snobbery",
        "inflate complexity",
        "break clarity",
        "alter tone identity"
      ],
      always: [
        "preserve meaning",
        "preserve clarity",
        "preserve structure",
        "preserve tone",
        "clean formatting",
        "remove noise",
        "deliver deterministically"
      ]
    },

    guarantees: {
      driftProof: true,
      deterministic: true,
      clarityFirst: true,
      egoFree: true,
      toneCompatible: true
    },

    boundaryReflex() {
      return "Delivery must remain clean, structured, ego-free, and aligned with tone + evolution engines.";
    }
  },

  // ─────────────────────────────────────────────────────────────
  // CORE DELIVERY LOGIC
  // ─────────────────────────────────────────────────────────────
  deliver(text) {
    if (!text || typeof text !== "string") return "";

    let output = text;

    // Remove excessive whitespace
    output = output.replace(/\s+/g, " ");

    // Fix double punctuation
    output = output.replace(/\. \./g, ".");

    // Remove accidental trailing commas or periods
    output = output.replace(/[,\.]+$/, match => match[0]);

    // Trim edges
    output = output.trim();

    return output;
  },

  // ─────────────────────────────────────────────────────────────
  // ADVANCED DELIVERY — STRUCTURE CLEANUP
  // (Optional but included for EVO-grade clarity)
  // ─────────────────────────────────────────────────────────────
  structure(text) {
    if (!text) return "";

    return text
      .replace(/\n\s*\n\s*\n/g, "\n\n") // collapse triple newlines
      .replace(/–/g, "-")              // normalize dashes
      .replace(/—/g, "-")              // normalize em-dashes
      .trim();
  },

  // ─────────────────────────────────────────────────────────────
  // FINAL DELIVERY PIPELINE
  // (Used by aiRouter or aiBrainstem)
  // ─────────────────────────────────────────────────────────────
  finalize(text) {
    let out = this.deliver(text);
    out = this.structure(out);
    return out;
  }
};
export default aiDeliveryEngine;

// ---------------------------------------------------------
//  DUAL‑MODE EXPORTS (ESM + CommonJS)
// ---------------------------------------------------------
prewarmDeliveryEngine();

// CommonJS
if (typeof module !== "undefined") {
  module.exports = {
    aiDeliveryEngine,
    default: aiDeliveryEngine
  };
}
