// ============================================================================
// FILE: PulseMeshSkinReflex.js
// [pulse:mesh] SKIN REFLEX LAYER — v15‑EVO‑IMMORTAL  // red‑white
// ----------------------------------------------------------------------------
// IDENTITY — MESH SKIN REFLEX (v15‑EVO‑IMMORTAL):
// -----------------------------------------------
// • First‑contact reflex arc for the Mesh layer (A3).
// • Captures mesh‑level anomalies: stalls, drops, errors, factoring spikes.
// • Emits reflex metadata ONLY — zero payload mutation.
// • Deterministic, drift‑proof, multi‑instance‑ready.
// • Presence‑aware, binary‑aware, dual‑band‑ready.
// • Unified‑advantage‑field, signal‑factoring‑aware, mesh‑pressure‑aware.
// • Zero randomness, zero timestamps, zero async, zero network.
// • Attaches at the top of the Mesh (PulseMesh / PulseMeshSpine).
//
// SAFETY CONTRACT (IMMORTAL v15):
// -------------------------------
// • No payload mutation.
// • No routing influence.
// • No compute (metadata only).
// • No async, no timers, no network, no FS.
// • Deterministic‑field: identical error → identical reflex metadata.
// • Zero side‑effects outside metadata.
// • Reflex only — never blocks routing.
// ============================================================================

export function createPulseMeshSkinReflex({
  log,
  warn,
  error,
  context = {}
} = {}) {

  // ---------------------------------------------------------------------------
  // IMMORTAL META BLOCK — attached to every reflex event
  // ---------------------------------------------------------------------------
  const meta = {
    layer: "PulseMeshSkinReflex",
    role: "MESH_SKIN_REFLEX",
    version: "15-EVO-IMMORTAL",
    target: "full-mesh",
    selfRepairable: true,

    evo: {
      // Awareness
      dualMode: true,
      binaryAware: true,
      symbolicAware: true,
      presenceAware: true,
      bandAware: true,
      localAware: true,
      internetAware: true,

      // Mesh‑layer awareness
      meshPressureAware: true,
      signalFactoringAware: true,
      flowAware: true,
      auraAware: true,
      driftAware: true,

      // IMMORTAL field guarantees
      deterministicField: true,
      unifiedAdvantageField: true,
      driftProof: true,
      multiInstanceReady: true,
      futureEvolutionReady: true,

      // Safety
      zeroCompute: true,
      zeroMutation: true,
      zeroRoutingInfluence: true,
      zeroNetworkFetch: true,
      zeroExternalMutation: true
    },

    contract: {
      always: [
        "PulseMeshFlow",
        "PulseMeshEndocrineSystem",
        "PulseMeshImmuneSystem",
        "PulseMeshCognition",
        "PulseMeshOrgans",
        "PulseMeshThalamus"
      ],
      never: [
        "legacyMeshScanner",
        "legacyMeshReflex",
        "safeRoute",
        "fetchViaCNS"
      ]
    }
  };

  // ---------------------------------------------------------------------------
  // INTERNAL REFLEX HANDLER (IMMORTAL)
  // ---------------------------------------------------------------------------
  function handleMeshError(evt) {
    const msg =
      evt?.message ||
      evt?.error?.message ||
      "unknown-mesh-error";

    const reflex = {
      type: "mesh_reflex",
      meta,
      message: msg,

      flags: {
        mesh_reflex_triggered: true,
        mesh_error: true,
        mesh_error_message: msg,

        // optional diagnostic surfaces
        mesh_stack: evt?.error?.stack || null,
        mesh_origin: evt?.filename || null,
        mesh_line: evt?.lineno || null,
        mesh_column: evt?.colno || null,

        // IMMORTAL advantage surfaces
        reflex_surface: true,
        prewarm_surface: true,
        chunk_surface: true,
        cache_surface: true
      }
    };

    warn?.("[MeshSkinReflex] Mesh reflex triggered", reflex);
    return reflex;
  }

  // ---------------------------------------------------------------------------
  // ATTACH REFLEX LISTENER (IMMORTAL)
  // ---------------------------------------------------------------------------
  function attach() {
    if (typeof window !== "undefined") {
      window.addEventListener("error", handleMeshError, true);
      log?.("[MeshSkinReflex] attached to window.error");
    }
  }

  // ---------------------------------------------------------------------------
  // PREWARM (IMMORTAL)
  // ---------------------------------------------------------------------------
  function prewarm() {
    log?.("[MeshSkinReflex] prewarm");
  }

  // ---------------------------------------------------------------------------
  // PUBLIC ORGAN API
  // ---------------------------------------------------------------------------
  return Object.freeze({
    meta,
    attach,
    prewarm
  });
}
