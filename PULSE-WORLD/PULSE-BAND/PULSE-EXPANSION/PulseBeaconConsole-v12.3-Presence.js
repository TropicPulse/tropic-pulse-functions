// ============================================================================
// PULSE-WORLD : PulseBeaconConsole-v14-IMMORTAL.js
// ROLE: Global expansion console + Overmind control surface
// VERSION: v14-IMMORTAL
// ============================================================================
//
// PURPOSE:
//   This page is the "brain" of PulseWorld expansion.
//   It controls global hints, modes, payload shaping, and expansion pulses.
//
//   It consumes (Beacon Engine v14-IMMORTAL):
//     - beacon.getStateSnapshot()
//     - beacon.getTelemetry()
//     - beacon.getGlobalHints()
//     - beacon.setGlobalHints()
//     - beacon.applyDirective()
//     - beacon.updatePayloadFromContext()
//     - beacon.broadcastOnce()
//     - beacon.buildPresenceField()
//     - beacon.buildAdvantageField()
//     - beacon.buildHintsField()
//     - beacon.buildBandField()
//     - beacon.buildChunkPrewarmField()
//
//   It produces:
//     - global organism hints (fallback/chunk/cache/prewarm/advantage/presence)
//     - mode changes
//     - payload updates
//     - expansion pulses (symbolic)
//     - region-scoped hint updates (symbolic)
//     - band / advantage / prewarm oriented directives
//
// CONTRACT:
//   - Never compute signal shaping.
//   - Never compute presence/advantage/band/chunk fields itself.
//   - Never mutate engine internals.
//   - Only call Beacon Engine APIs.
//   - Always deterministic.
//   - Pure symbolic Overmind surface.
// ============================================================================

/*
AI_EXPERIENCE_META = {
  identity: "PulseBeaconConsole",
  version: "v14-IMMORTAL",
  layer: "presence_console",
  role: "presence_debug_console",
  lineage: "PulsePresence-v14",

  evo: {
    presenceConsole: true,
    beaconAware: true,
    meshAware: true,
    bluetoothAware: true,
    regionAware: true,

    symbolicPrimary: true,
    binaryAware: true,
    dualBand: true,

    deterministic: true,
    driftProof: true,
    zeroMutationOfInput: true,
    zeroNetwork: true,
    zeroFilesystem: true
  },

  contract: {
    always: [
      "PulseBeaconEngine",
      "PulseBeaconMesh",
      "PulseExpansion"
    ],
    never: [
      "safeRoute",
      "fetchViaCNS"
    ]
  }
}
*/

export const PulseBeaconConsoleMeta = Object.freeze({
  layer: "OvermindConsole",
  role: "GLOBAL_EXPANSION_CONSOLE",
  version: "v14-IMMORTAL",
  identity: "PulseBeaconConsole-v14-IMMORTAL",
  guarantees: Object.freeze({
    deterministic: true,
    driftProof: true,
    zeroRandomness: true,
    zeroTimers: true,
    zeroAsync: true,
    zeroNetwork: true,
    zeroEval: true,
    zeroDynamicImports: true,
    zeroMutationOfEngine: true
  }),
  contract: Object.freeze({
    consumes: [
      "beacon.getStateSnapshot()",
      "beacon.getTelemetry()",
      "beacon.getGlobalHints()",
      "beacon.setGlobalHints()",
      "beacon.applyDirective()",
      "beacon.updatePayloadFromContext()",
      "beacon.broadcastOnce()",
      "beacon.buildPresenceField()",
      "beacon.buildAdvantageField()",
      "beacon.buildHintsField()",
      "beacon.buildBandField()",
      "beacon.buildChunkPrewarmField()"
    ],
    produces: [
      "globalHints",
      "modeChanges",
      "payloadUpdates",
      "expansionPulses",
      "regionScopedHints",
      "bandAdvantageDirectives"
    ]
  })
});

// ============================================================================
// HELPERS (symbolic, deterministic)
// ============================================================================
function clamp01(x) {
  if (x == null || Number.isNaN(x)) return 0;
  return Math.max(0, Math.min(1, x));
}

function stableHash(str) {
  let h = 0;
  const s = String(str || "");
  for (let i = 0; i < s.length; i++) {
    h = (h + s.charCodeAt(i) * (i + 1)) % 100000;
  }
  return `bc${h}`;
}

// Build a merged globalHints object without inventing new semantics.
// This is purely symbolic merging of caller-provided fields.
function mergeGlobalHints(prev = {}, patch = {}) {
  return {
    ...prev,
    presenceContext: {
      ...(prev.presenceContext || {}),
      ...(patch.presenceContext || {})
    },
    advantageContext: {
      ...(prev.advantageContext || {}),
      ...(patch.advantageContext || {})
    },
    fallbackContext: {
      ...(prev.fallbackContext || {}),
      ...(patch.fallbackContext || {})
    },
    chunkHints: {
      ...(prev.chunkHints || {}),
      ...(patch.chunkHints || {})
    },
    cacheHints: {
      ...(prev.cacheHints || {}),
      ...(patch.cacheHints || {})
    },
    prewarmHints: {
      ...(prev.prewarmHints || {}),
      ...(patch.prewarmHints || {})
    },
    regionChunkPlan: {
      ...(prev.regionChunkPlan || {}),
      ...(patch.regionChunkPlan || {})
    },
    bandSignature:
      patch.bandSignature != null
        ? patch.bandSignature
        : prev.bandSignature,
    // allow direct fallbackBandLevel override if present
    fallbackBandLevel:
      patch.fallbackBandLevel != null
        ? patch.fallbackBandLevel
        : prev.fallbackBandLevel
  };
}

// ============================================================================
// ORGAN: PulseBeaconConsole (v14-IMMORTAL)
// ============================================================================
export function PulseBeaconConsole({ beacon }) {
  if (!beacon) throw new Error("PulseBeaconConsole requires a Beacon Engine instance");

  const consoleIdentity = Object.freeze({
    consoleId: stableHash("PULSE_BEACON_CONSOLE_V14"),
    version: PulseBeaconConsoleMeta.version,
    role: PulseBeaconConsoleMeta.role
  });

  return Object.freeze({

    // ------------------------------------------------------------------------
    // META
    // ------------------------------------------------------------------------
    meta: PulseBeaconConsoleMeta,
    identity: consoleIdentity,

    // ------------------------------------------------------------------------
    // SNAPSHOT: Full engine state (presence, hints, mode, payload, telemetry)
    // ------------------------------------------------------------------------
    getSnapshot() {
      return beacon.getStateSnapshot();
    },

    getTelemetry() {
      return beacon.getTelemetry();
    },

    // ------------------------------------------------------------------------
    // PRESENCE / ADVANTAGE / HINTS / BAND / CHUNK FIELDS (delegated)
// ------------------------------------------------------------------------
    getPresenceField() {
      return beacon.buildPresenceField();
    },

    getAdvantageField() {
      return beacon.buildAdvantageField();
    },

    getHintsField() {
      return beacon.buildHintsField();
    },

    getBandField() {
      return beacon.buildBandField();
    },

    getChunkPrewarmField() {
      return beacon.buildChunkPrewarmField();
    },

    // ------------------------------------------------------------------------
    // GLOBAL HINTS: Set organism-level hints (hybrid v14 / region-aware)
// ------------------------------------------------------------------------
    setGlobalHints(globalHints) {
      return beacon.setGlobalHints(globalHints);
    },

    getGlobalHints() {
      return beacon.getGlobalHints();
    },

    // Symbolic helper: merge patch into existing global hints.
    mergeGlobalHints(patch = {}) {
      const current = beacon.getGlobalHints() || {};
      const merged = mergeGlobalHints(current, patch);
      return beacon.setGlobalHints(merged);
    },

    // Region-scoped hints: purely symbolic tagging, no physics here.
    setRegionScopedHints(regionId, {
      presenceTier,
      advantageScore,
      fallbackBandLevel,
      chunkPriority
    } = {}) {
      const current = beacon.getGlobalHints() || {};
      const regionHints = {
        ...(current.regionHints || {})
      };

      regionHints[regionId] = {
        presenceTier: presenceTier || regionHints[regionId]?.presenceTier || "presence_low",
        advantageScore:
          advantageScore != null
            ? advantageScore
            : regionHints[regionId]?.advantageScore ?? 0,
        fallbackBandLevel:
          fallbackBandLevel != null
            ? fallbackBandLevel
            : regionHints[regionId]?.fallbackBandLevel ?? 0,
        chunkPriority:
          chunkPriority != null
            ? chunkPriority
            : regionHints[regionId]?.chunkPriority ?? "normal"
      };

      const merged = {
        ...current,
        regionHints
      };

      return beacon.setGlobalHints(merged);
    },

    // ------------------------------------------------------------------------
    // MODE CONTROL: discovery | presence | adaptive | pulse-reach | pulse-storm | PULSE-MESH | pulse-expand
    // (delegated via directives or direct setMode if exposed)
// ------------------------------------------------------------------------
    setMode(mode) {
      // v14 engine exposes setMode; we just delegate.
      return beacon.setMode(mode);
    },

    setDiscoveryMode() {
      return beacon.setMode("discovery");
    },

    setPresenceMode() {
      return beacon.setMode("presence");
    },

    setAdaptiveMode() {
      return beacon.setMode("adaptive");
    },

    setMeshMode() {
      return beacon.setMode("PULSE-MESH");
    },

    setExpandMode() {
      return beacon.setMode("pulse-expand");
    },

    // ------------------------------------------------------------------------
    // PAYLOAD CONTROL: regionTag, castlePresence, meshStatus, loadHint, userProfile, etc.
// ------------------------------------------------------------------------
    updatePayload(payloadUpdate) {
      return beacon.updatePayloadFromContext(payloadUpdate);
    },

    updateRegionPayload(regionId, {
      meshStatus,
      loadHint,
      userProfile,
      advantageHint,
      fallbackBandLevel,
      coldStartPhase
    } = {}) {
      return beacon.updatePayloadFromContext({
        regionTag: regionId,
        meshStatus,
        loadHint,
        userProfile,
        advantageHint,
        fallbackBandLevel,
        coldStartPhase
      });
    },

    // ------------------------------------------------------------------------
    // EXPANSION PULSE: Fire a broadcast with optional context hints
    // (Bluetooth emission happens ONLY inside the engine/adapter organ)
// ------------------------------------------------------------------------
    pulse(contextHints = {}) {
      return beacon.broadcastOnce(contextHints);
    },

    pulseDiscovery(contextHints = {}) {
      beacon.setMode("discovery");
      return beacon.broadcastOnce(contextHints);
    },

    pulsePresence(contextHints = {}) {
      beacon.setMode("presence");
      return beacon.broadcastOnce(contextHints);
    },

    pulseMesh(contextHints = {}) {
      beacon.setMode("PULSE-MESH");
      return beacon.broadcastOnce(contextHints);
    },

    pulseExpand(contextHints = {}) {
      beacon.setMode("pulse-expand");
      return beacon.broadcastOnce(contextHints);
    },

    pulseRegion(regionId, {
      densityHint = "medium",
      demandHint = "medium",
      regionType = "venue",
      meshStatus = "unknown"
    } = {}) {
      return beacon.broadcastOnce({
        densityHint,
        demandHint,
        regionType,
        meshStatus,
        regionId
      });
    },

    // ------------------------------------------------------------------------
    // DIRECTIVES: Overmind-style multi-field updates
    // ------------------------------------------------------------------------
    directive(directive) {
      return beacon.applyDirective(directive);
    },

    regionDirective(regionId, {
      mode = null,
      payloadUpdate = {},
      globalHintsPatch = {},
      broadcastNow = false,
      contextHints = {}
    } = {}) {
      const patchedPayload = {
        ...payloadUpdate,
        regionTag: regionId
      };

      const currentHints = beacon.getGlobalHints() || {};
      const mergedHints = Object.keys(globalHintsPatch).length
        ? mergeGlobalHints(currentHints, {
            ...(globalHintsPatch || {}),
            regionHints: {
              ...(currentHints.regionHints || {}),
              [regionId]: {
                ...((currentHints.regionHints || {})[regionId] || {}),
                ...(globalHintsPatch.regionHints || {})
              }
            }
          })
        : undefined;

      const directive = {
        mode,
        payloadUpdate: patchedPayload,
        globalHints: mergedHints,
        broadcastNow,
        contextHints: {
          ...contextHints,
          regionId
        }
      };

      return beacon.applyDirective(directive);
    }
  });
}
