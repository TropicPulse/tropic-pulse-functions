// ============================================================================
//  ORGAN EXPORT — ⭐ PulseSendMover (v10.4‑Evo)
//  Provides BOTH:
//    • createPulseSendMover() factory
//    • Unified organ object (PulseSendMover) for PulseSend assembly
// ============================================================================

export const PulseSendMover = {
  PulseRole,

  // Placeholder until wired by PulseSend.js
  move({ pulse, targetOrgan, pathway, mode }) {

    // ⭐ Extract organism identity
    const pulseType = pulse?.pulseType || pulse?.PulseRole?.identity || "UNKNOWN_PULSE_TYPE";

    // ⭐ Deterministic diagnostics (allowed, zero compute)
    const pattern = pulse?.pattern || "NO_PATTERN";
    const lineageDepth = Array.isArray(pulse?.lineage) ? pulse.lineage.length : 0;
    const organLabel = targetOrgan || "NO_ORGAN";
    const pathwayLabel = pathway || "NO_PATHWAY";
    const modeLabel = mode || "NO_MODE";

    // ⭐ Advantage field (if present)
    const advantageField = pulse?.advantageField || null;

    throw new Error(
      `[PulseSendMover-v10.4‑Evo] move() called before initialization.\n` +
      `• pulseType: ${pulseType}\n` +
      `• pattern: ${pattern}\n` +
      `• lineageDepth: ${lineageDepth}\n` +
      `• targetOrgan: ${organLabel}\n` +
      `• pathway: ${pathwayLabel}\n` +
      `• mode: ${modeLabel}\n` +
      `• advantageField: ${JSON.stringify(advantageField)}\n` +
      `Use createPulseSendMover(...) to wire dependencies.`
    );
  }
};
