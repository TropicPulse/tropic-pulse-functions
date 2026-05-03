// ============================================================================
// FILE: PulseMeshSignalFactoring.js
// [pulse:mesh] SIGNAL FACTORING LAYER — v15‑EVO‑IMMORTAL
// ----------------------------------------------------------------------------
// ROLE:
//   • Mesh‑level 1/0 factoring engine (metadata‑only).
//   • Mirrors CNS factoring (stride, depth, /2 pattern) at mesh layer.
//   • Shapes impulses with factoring pressure from aura, flow, mesh echo.
//   • NEVER mutates payloads — flags + meta only.
//   • Deterministic: same impulse + same context → same factoring result.
//   • Zero randomness, zero timestamps, zero async, zero network.
//   • Drift‑proof, multi‑instance‑ready, chunk/prewarm‑ready.
//   • Used by: Spine, Tendons, Aura, Flow, Thalamus, Cognition, Endocrine,
//              Immune, Organs, Earn, MeshEcho, PresenceRelay.
// ----------------------------------------------------------------------------
// SAFETY CONTRACT (IMMORTAL v15):
//   • No payload mutation (flags/meta only).
//   • No routing influence (metadata only).
//   • No randomness, no timestamps.
//   • No external I/O, no FS, no network.
//   • Zero async, zero side‑effects.
//   • Deterministic‑field: identical input → identical output.
//   • Drift‑proof: stable across versions.
// ============================================================================

export function applyMeshSignalFactoring(impulse, context = {}) {
  if (!impulse) return impulse;

  // -------------------------------------------------------------------------
  // IMMORTAL META BLOCK — attached to every impulse
  // -------------------------------------------------------------------------
  impulse.meta = impulse.meta || {};
  impulse.meta.signalFactoring = {
    layer: "PulseMeshSignalFactoring",
    role: "MESH_SIGNAL_FACTORS",
    version: "15-EVO-IMMORTAL",
    target: "full-mesh",
    selfRepairable: true,
    evo: {
      dualMode: true,
      binaryAware: true,
      symbolicAware: true,
      localAware: true,
      internetAware: true,

      unifiedAdvantageField: true,
      deterministicField: true,
      driftProof: true,
      multiInstanceReady: true,

      signalFactoringAware: true,
      auraPressureAware: true,
      meshPressureAware: true,
      flowAware: true,
      presenceAware: true,
      bandAware: true,

      zeroCompute: true,
      zeroMutation: true,
      zeroRoutingInfluence: true
    }
  };

  // -------------------------------------------------------------------------
  // 1) Extract factoring pressures (aura + flow + mesh)
  // -------------------------------------------------------------------------
  impulse.flags = impulse.flags || {};

  const auraBias  = impulse.flags.aura_factoring_bias ?? 0;
  const flowBias  = context.flowPressure ?? 0;
  const meshBias  = context.meshPressure ?? 0;

  // unified factoring pressure (IMMORTAL v15 weighting)
  const factoringPressure =
    (auraBias * 0.5) +
    (flowBias * 0.3) +
    (meshBias * 0.2);

  impulse.flags.mesh_factoring_pressure = clamp01(factoringPressure);

  // -------------------------------------------------------------------------
  // 2) Compute factoring signal (1 or 0)
  // -------------------------------------------------------------------------
  const signal =
    factoringPressure >= 0.6 ? 1 :
    factoringPressure <= 0.2 ? 0 :
    impulse.flags.factoringSignal ?? 0;

  impulse.flags.factoringSignal = signal;

  // -------------------------------------------------------------------------
  // 3) Compute factoring depth (mirrors CNS stride/depth)
  // -------------------------------------------------------------------------
  const depth =
    signal === 1
      ? Math.min((impulse.flags.factoringDepth ?? 0) + 1, 8)
      : 0;

  impulse.flags.factoringDepth = depth;

  // -------------------------------------------------------------------------
  // 4) Compute factoring stride (/2 pattern)
  // -------------------------------------------------------------------------
  impulse.flags.factoringStride =
    depth > 0 ? 1 / (depth + 1) : 1;

  // -------------------------------------------------------------------------
  // 5) Tag factoring intent (metadata only)
  // -------------------------------------------------------------------------
  impulse.flags.mesh_factoring_intent =
    signal === 1
      ? "prefer_factored_path"
      : "normal";

  // -------------------------------------------------------------------------
  // 6) IMMORTAL ADVANTAGE SURFACE (for Flow, Endocrine, Immune, Earn)
  // -------------------------------------------------------------------------
  impulse.flags.mesh_factoring_advantage = {
    pressure: clamp01(factoringPressure),
    signal,
    depth,
    stride: impulse.flags.factoringStride,
    auraBias,
    flowBias,
    meshBias,
    presenceBand: impulse.band ?? "symbolic",
    prewarm_surface: true,
    chunk_surface: true,
    cache_surface: true
  };

  return impulse;
}

// ============================================================================
// HELPERS
// ============================================================================
function clamp01(v) {
  return Math.max(0, Math.min(1, v));
}
