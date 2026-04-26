// ============================================================================
// FILE: PulseUIErrors-v12-EVO.js
// UNIVERSAL ERROR SPINE — v12-EVO
// Membrane-Safe • Drift-Safe • Organism-Wide Error Unifier
// ============================================================================
//
// PURPOSE:
// --------
//  - Capture ALL errors from ALL layers without ever breaking execution.
//  - Normalize them into a single organism-wide error packet.
//  - Forward them safely to:
//        • Window Logger (PulseProofLogger)
//        • Understanding (PulseUnderstanding)
//        • Binary Shadow (window.PulseBinary)
//        • UI Flow (window.PulseUI)
//        • SkinReflex (window.PulseSkinReflex)
//  - Never throw, never interrupt, never cascade failures.
//
// CONTRACT:
// ---------
//  - NO exceptions thrown.
//  - NO rethrow.
//  - NO blocking.
//  - NO routing.
//  - NO identity.
//  - Purely: capture → normalize → broadcast.
// ============================================================================

export const PulseUIErrors = (() => {
  const spineMeta = Object.freeze({
    layer: "PulseUIErrors",
    role: "universal-error-spine",
    version: "12.0-EVO",
    evo: {
      driftSafe: true,
      membraneSafe: true,
      organismWide: true,
      dualBandAware: true,
      binaryAware: true,
      symbolicAware: true,
      uiFlowAware: true,
      skinReflexAware: true
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
    try {
      // Window logger
      window?.PulseLogger?.logError?.(packet);
    } catch {}

    try {
      // Understanding (symbolic OS)
      window?.Pulse?.SDN?.emitImpulse?.("ErrorSpine", {
        modeKind: "dual",
        executionContext: {
          sceneType: "error",
          workloadClass: "ui-error",
          dispatchSignature: "PulseUIErrors.v12",
          shapeSignature: "error-spine",
          extensionId: "PulseUIErrors"
        },
        errorPacket: packet
      });
    } catch {}

    try {
      // Binary shadow
      window?.PulseBinary?.Vitals?.generate?.(); // soft ping
    } catch {}

    try {
      // UI Flow
      window?.PulseUI?.Flow?.onError?.(packet);
    } catch {}

    try {
      // SkinReflex
      window?.PulseSkinReflex?.onError?.(packet);
    } catch {}
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

    // UI Flow internal errors
    try {
      window.PulseUI?.Flow?.registerErrorHandler?.((err) => {
        const packet = normalizeError(err, "ui.flow");
        broadcast(packet);
      });
    } catch {}

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
    try {
      installGlobalHandlers();
    } catch {}
  }

  // Auto-init
  if (typeof window !== "undefined") {
    init();
  }

  return {
    meta: spineMeta,
    normalize: normalizeError,
    broadcast,
    init
  };
})();

export default PulseUIErrors;
