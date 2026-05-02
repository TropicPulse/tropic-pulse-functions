// ============================================================================
// FILE: PulseUIErrors-v13-EVO-PRIME.js
// UNIVERSAL ERROR SPINE — v13-EVO-PRIME
// Membrane-Safe • Drift-Safe • Organism-Wide Error Unifier
// ============================================================================

export const PulseUIErrors = (() => {
  const spineMeta = Object.freeze({
    layer: "PulseUIErrors",
    role: "universal-error-spine",
    version: "13.0-EVO-PRIME",
    evo: {
      driftSafe: true,
      membraneSafe: true,
      organismWide: true,
      dualBandAware: true,
      binaryAware: true,
      symbolicAware: true,
      uiFlowAware: true,
      skinReflexAware: true,
      evolutionaryPageAware: true,
      cortexAware: true,
      routerAware: true
    }
  });

  // --------------------------------------------------------------------------
  // NORMALIZER — convert ANY error into a safe packet
  // --------------------------------------------------------------------------
  function normalizeError(err, origin = "unknown") {
    try {
      return {
        origin,
        message: err?.message ?? String(err),
        name: err?.name ?? "Error",
        stack: err?.stack ?? null,
        time: Date.now(),
        meta: spineMeta
      };
    } catch {
      return {
        origin,
        message: "Unknown error",
        name: "Unknown",
        stack: null,
        time: Date.now(),
        meta: spineMeta
      };
    }
  }

  // --------------------------------------------------------------------------
  // BROADCAST — send normalized error to all safe listeners
  // --------------------------------------------------------------------------
  function broadcast(packet) {
    // Window logger
    try { window?.PulseLogger?.logError?.(packet); } catch {}

    // EvolutionaryPage (v13)
    try { window?.PulseEvolutionaryPage?.onError?.(packet); } catch {}

    // UI Flow v13
    try { window?.PulseUIFlowV13?.onError?.(packet); } catch {}

    // RouterOrgan
    try { window?.PulseRouterOrgan?.onError?.(packet); } catch {}

    // Cortex
    try { window?.PulseCortex?.onError?.(packet); } catch {}

    // MemoryOrgan
    try { window?.PulseMemoryOrgan?.onError?.(packet); } catch {}

    // BinaryOrgan
    try { window?.PulseBinaryOrgan?.onError?.(packet); } catch {}

    // Understanding (SDN)
    try {
      window?.Pulse?.SDN?.emitImpulse?.("ErrorSpine", {
        modeKind: "dual",
        executionContext: {
          sceneType: "error",
          workloadClass: "ui-error",
          dispatchSignature: "PulseUIErrors.v13",
          shapeSignature: "error-spine",
          extensionId: "PulseUIErrors"
        },
        errorPacket: packet
      });
    } catch {}

    // Binary shadow
    try { window?.PulseBinary?.Vitals?.generate?.(); } catch {}

    // SkinReflex
    try { window?.PulseSkinReflex?.onError?.(packet); } catch {}
  }

  // --------------------------------------------------------------------------
  // CAPTURE — global listeners
  // --------------------------------------------------------------------------
  function installGlobalHandlers() {
    // JS runtime errors
    window.addEventListener("error", (e) => {
      const packet = normalizeError(e.error || e, "window.error");
      broadcast(packet);
    });

    // Promise rejections
    window.addEventListener("unhandledrejection", (e) => {
      const packet = normalizeError(e.reason || e, "window.unhandledrejection");
      broadcast(packet);
    });

    // SkinReflex internal errors
    try {
      window.PulseSkinReflex?.registerErrorHandler?.((err) => {
        const packet = normalizeError(err, "skin.reflex");
        broadcast(packet);
      });
    } catch {}
  }

  // --------------------------------------------------------------------------
  // INIT
  // --------------------------------------------------------------------------
  function init() {
    try { installGlobalHandlers(); } catch {}
  }

  // Auto-init
  if (typeof window !== "undefined") init();

  return {
    meta: spineMeta,
    normalizeError,
    broadcast,
    init
  };
})();

export default PulseUIErrors;
