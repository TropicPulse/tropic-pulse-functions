// FILE: tropic-pulse-functions/apps/pulse-earn/PulseJobSchema.js
//
// PulseJobSchema v5 — Deterministic, Drift‑Proof, Self‑Healing Canonical Job Format
// NO AI LAYERS. NO TRANSLATION. NO MEMORY MODEL. PURE HEALING.
//
// ------------------------------------------------------
// 📘 PAGE INDEX — Source of Truth for This File
// ------------------------------------------------------
//
// ROLE:
//   PulseJobSchema — the ONE TRUE job format used across the entire Pulse stack.
//
// RESPONSIBILITIES:
//   • Define the canonical job shape
//   • Remain stable across all subsystems
//   • Provide a cross‑system compatibility contract
//
// THIS FILE IS:
//   • A static schema
//   • A deterministic contract
//   • A cross‑system interface definition
//
// THIS FILE IS NOT:
//   • A validator
//   • A compute engine
//   • A scheduler
//   • A marketplace adapter
//   • A runtime
//
// SAFETY RULES (CRITICAL):
//   • NO dynamic fields
//   • NO optional structural keys
//   • NO runtime logic
//   • NO environment‑specific fields
//   • NO marketplace‑specific fields
//   • NO device‑specific fields
//
// ------------------------------------------------------
// PulseJobSchema — Canonical Pulse Job Format (v5)
// ------------------------------------------------------

export const PulseJobSchema = {
  id: "string", // Unique job ID

  payload: {
    type: "string", // e.g. "marketplace-job", "internal-task"
    data: "any",    // Raw job data (marketplace metadata, internal task data, etc.)

    gpu: {
      workgroupSize: "number", // GPU workgroup size (PulseBand uses this)
      iterations: "number",    // Number of compute passes
      shader: "string"         // WGSL shader source (empty string for non-GPU jobs)
    }
  },

  marketplace: "string", // Marketplace or internal job source
  assignedTo: "deviceId", // Device ID of worker
  timestamp: "number"     // Job assignment time (ms)
};
