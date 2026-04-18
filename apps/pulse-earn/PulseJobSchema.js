// ============================================================================
// FILE: tropic-pulse-functions/apps/pulse-earn/PulseJobSchema.js
// LAYER: THE CONSTITUTION
// (The One True Job Contract + Immutable Cross‑System Law)
// ============================================================================
//
// ROLE:
//   THE CONSTITUTION — the supreme, immutable job contract of Pulse‑Earn.
//   • Defines the canonical job structure
//   • Establishes the cross‑system treaty all modules must obey
//   • Guarantees compatibility across the entire Earn OS
//
// WHY “CONSTITUTION”?:
//   • It is the highest authority in the Earn ecosystem
//   • It cannot drift, mutate, or adapt dynamically
//   • All subsystems must obey it without exception
//   • It defines the structure of every job, forever
//
// PURPOSE:
//   • Provide a deterministic, drift‑proof job format
//   • Ensure universal compatibility across all Earn layers
//   • Serve as the legal foundation for job execution + routing
//
// CONTRACT:
//   • PURE STATIC SCHEMA — no logic, no runtime behavior
//   • NO dynamic fields, NO optional structural keys
//   • NO environment‑specific or marketplace‑specific fields
//   • Immutable across versions unless explicitly ratified
//
// SAFETY:
//   • v6.3 upgrade is COMMENTAL ONLY — NO LOGIC CHANGES
//   • All behavior remains identical to pre‑v6.3 schema
// ============================================================================

export const PulseJobSchema = {
  id: "string", // Unique job ID (constitutional requirement)

  payload: {
    type: "string", // Job category (marketplace-job, internal-task, etc.)
    data: "any",    // Raw job data (marketplace metadata, internal task data)

    gpu: {
      workgroupSize: "number", // GPU workgroup size (PulseBand)
      iterations: "number",    // Number of compute passes
      shader: "string"         // WGSL shader source (empty for non-GPU jobs)
    }
  },

  marketplace: "string", // Marketplace or internal job source
  assignedTo: "deviceId", // Device ID of worker
  timestamp: "number"     // Job assignment time (ms)
};
