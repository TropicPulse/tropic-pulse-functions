/*
===============================================================================
FILE: /PULSE-UI/PulseEvolutionaryImpulse-v16.js
LAYER: UI → CNS SIGNAL ORGAN
===============================================================================
AI_EXPERIENCE_META = {
  identity: "PulseUI.EvolutionaryImpulse",
  version: "v16-Immortal",
  layer: "pulse_ui",
  role: "ui_to_cns_signal_layer",
  lineage: "PulseEvolutionaryImpulse-v11.3-Evo-Prime → v14-Immortal → v15-Immortal → v16-Immortal",

  evo: {
    impulseOrgan: true,
    dualBand: true,
    binaryAware: true,
    symbolicAware: true,
    routeAware: true,
    lineageAware: true,
    cnsAware: true,
    unifiedAdvantageField: true,
    tierAware: true,
    channelAware: true,
    signatureAware: true,
    envelopeAware: true,
    schemaVersioned: true,
    errorAware: true,
    bandMetricsAware: true,
    contextAware: true,
    futureEvolutionReady: true,

    deterministic: true,
    driftProof: true,
    pureCompute: true,

    zeroNetwork: true,
    zeroFilesystem: true,
    zeroMutationOfInput: true
  },

  contract: {
    always: [
      "PulseUI.Evolution",
      "PulseUI.RouteOrgan",
      "PulseCore.CNS",
      "PulseDesign.Manifest"
    ],
    never: [
      "eval",
      "Function",
      "dynamicImport",
      "fetchViaCNS",
      "safeRoute"
    ]
  }
}
===============================================================================
EXPORT_META = {
  organ: "PulseUI.EvolutionaryImpulse",
  layer: "pulse_ui",
  stability: "IMMORTAL",
  deterministic: true,
  pure: true,

  consumes: [
    "SymbolicPayload",
    "BinaryPayload",
    "ImpulseContext",
    "RouteOrgan",
    "Evolution"
  ],

  produces: [
    "ImpulseEnvelope",
    "ImpulseSignature",
    "ImpulseTier",
    "ImpulseChannel",
    "ImpulseAdvantage"
  ],

  sideEffects: "cns_emit_only",
  network: "none",
  filesystem: "none"
}
*/

// Global handle
const g =
  typeof globalThis !== "undefined"
    ? globalThis
    : typeof global !== "undefined"
    ? global
    : typeof window !== "undefined"
    ? window
    : typeof g !== "undefined"
    ? g
    : {};

// Prefer global db if present (logger page / server)
const db =
  (g && g.db) ||
  (typeof global !== "undefined" && global.db) ||
  (typeof globalThis !== "undefined" && globalThis.db) ||
  (typeof window !== "undefined" && window.db) ||
  null;

export const ImpulseRole = {
  type: "Organ",
  subsystem: "UI",
  layer: "Impulse",
  version: "16.0-Immortal",
  identity: "PulseEvolutionaryImpulse",

  evo: {
    driftProof: true,
    deterministic: true,
    dualBand: true,
    binaryAware: true,
    symbolicAware: true,
    impulseEmitter: true,
    routeAware: true,
    lineageAware: true,
    unifiedAdvantageField: true,
    tierAware: true,
    channelAware: true,
    signatureAware: true,
    envelopeAware: true,
    schemaVersioned: true,
    errorAware: true,
    bandMetricsAware: true,
    contextAware: true,
    futureEvolutionReady: true
  }
};

const IMPULSE_SCHEMA_VERSION = "v3";

// ============================================================================
// INTERNAL: deterministic signature generator (no randomness)
// ============================================================================
function deterministicSignature(obj) {
  const json = JSON.stringify(obj || {});
  let hash = 0;
  for (let i = 0; i < json.length; i++) {
    hash = (hash * 31 + json.charCodeAt(i)) >>> 0;
  }
  return "SIG_" + hash.toString(16).padStart(8, "0");
}

// ============================================================================
// INTERNAL: impulse tiers (structural layer)
// ============================================================================
const ImpulseTiers = Object.freeze({
  info: "info",
  action: "action",
  warning: "warning",
  critical: "critical",
  immortal: "immortal"
});

// ============================================================================
// INTERNAL: impulse channels (structural layer)
// ============================================================================
const ImpulseChannels = Object.freeze({
  ui: "ui",
  system: "system",
  memory: "memory",
  evolution: "evolution",
  router: "router",
  earn: "earn"
});

// ============================================================================
// INTERNAL: band metrics + advantage (deterministic)
// ============================================================================
function computeBandMetrics(payload, binaryPayload) {
  const symJson = JSON.stringify(payload || {});
  const symSize = symJson.length;

  const binSize = Array.isArray(binaryPayload) ? binaryPayload.length : 0;

  const total = symSize + binSize || 1;
  const symbolicWeight = symSize / total;
  const binaryWeight = binSize / total;

  const advantage =
    0.4 * symbolicWeight +
    0.6 * binaryWeight;

  return {
    symbolicSize: symSize,
    binarySize: binSize,
    symbolicWeight,
    binaryWeight,
    advantage
  };
}

// deterministic tier classifier from context + payload
function classifyTier({ payload, context }) {
  const p = payload || {};
  const c = context || {};

  const severity =
    (c.severity === "critical" && 1.0) ||
    (c.severity === "warning" && 0.7) ||
    (c.severity === "action" && 0.5) ||
    (c.severity === "info" && 0.2) ||
    0.2;

  if (severity >= 0.95) return ImpulseTiers.immortal;
  if (severity >= 0.75) return ImpulseTiers.critical;
  if (severity >= 0.55) return ImpulseTiers.warning;
  if (severity >= 0.35) return ImpulseTiers.action;
  return ImpulseTiers.info;
}

// deterministic channel classifier from context + route
function classifyChannel({ context, route }) {
  const c = context || {};
  const r = route || "";

  if (c.channel && ImpulseChannels[c.channel]) return c.channel;

  if (r.startsWith("/earn")) return ImpulseChannels.earn;
  if (r.startsWith("/router")) return ImpulseChannels.router;
  if (r.startsWith("/evo")) return ImpulseChannels.evolution;
  if (r.startsWith("/mem")) return ImpulseChannels.memory;
  if (r.startsWith("/sys")) return ImpulseChannels.system;

  return ImpulseChannels.ui;
}

// ============================================================================
// FACTORY — creates the impulse organ
// ============================================================================
export function createPulseEvolutionaryImpulse({
  CNS,
  Evolution,
  RouteOrgan,
  log = console.log,
  warn = console.warn
} = {}) {

  const ImpulseState = {
    lastImpulse: null,
    lastModeKind: null,
    lastRoute: null,
    lastSignature: null,
    lastTier: null,
    lastChannel: null,
    lastAdvantage: null,
    lastError: null,
    eventSeq: 0
  };

  function nextSeq() {
    ImpulseState.eventSeq += 1;
    return ImpulseState.eventSeq;
  }

  function safeLog(stage, details = {}) {
    try {
      log(
        "[PulseEvolutionaryImpulse]",
        stage,
        JSON.stringify({
          schemaVersion: IMPULSE_SCHEMA_VERSION,
          seq: ImpulseState.eventSeq,
          ...details
        })
      );
    } catch {}
  }

  // --------------------------------------------------------------------------
  // BUILD IMPULSE ENVELOPE — deterministic, binary-native, tier-aware
  // --------------------------------------------------------------------------
  function buildImpulseEnvelope({
    source,
    payload,
    binaryPayload,
    context,
    tier,
    channel
  }) {
    const modeKind = binaryPayload ? "dual" : "symbolic";
    const lineage = Evolution?.getPageLineage?.() || {};
    const route = RouteOrgan?.RouterState?.currentRoute || "unknown";
    const bootPath = Evolution?.getBootPath?.() || "unknown";

    const bandMetrics = computeBandMetrics(payload, binaryPayload);
    const autoTier = tier || classifyTier({ payload, context });
    const autoChannel = channel || classifyChannel({ context, route });

    const envelope = {
      schemaVersion: IMPULSE_SCHEMA_VERSION,
      source,
      modeKind,
      route,
      bootPath,
      lineage,
      tier: autoTier,
      channel: autoChannel,
      payload: payload || {},
      binary: binaryPayload || null,
      context: context || {},
      bandMetrics,
      advantage: bandMetrics.advantage,
      version: ImpulseRole.version,
      timestamp: "NO_TIMESTAMP_v16"
    };

    envelope.signature = deterministicSignature(envelope);
    envelope.impulseId = "IMP_" + envelope.signature.slice(4);

    return envelope;
  }

  // --------------------------------------------------------------------------
  // EMIT IMPULSE — deterministic, dual-band, CNS-aware
  // --------------------------------------------------------------------------
  function emit({
    source = "UI",
    payload = {},
    binaryPayload = null,
    context = {},
    tier = null,
    channel = null
  } = {}) {
    nextSeq();

    const envelope = buildImpulseEnvelope({
      source,
      payload,
      binaryPayload,
      context,
      tier,
      channel
    });

    ImpulseState.lastImpulse = envelope;
    ImpulseState.lastModeKind = envelope.modeKind;
    ImpulseState.lastRoute = envelope.route;
    ImpulseState.lastSignature = envelope.signature;
    ImpulseState.lastTier = envelope.tier;
    ImpulseState.lastChannel = envelope.channel;
    ImpulseState.lastAdvantage = envelope.advantage;

    try {
      CNS?.emitImpulse?.("PulseEvolutionaryImpulse", envelope);
      safeLog("IMPULSE_OK", {
        modeKind: envelope.modeKind,
        route: envelope.route,
        tier: envelope.tier,
        channel: envelope.channel,
        advantage: envelope.advantage
      });
      return {
        ok: true,
        signature: envelope.signature,
        impulseId: envelope.impulseId,
        tier: envelope.tier,
        channel: envelope.channel,
        advantage: envelope.advantage
      };
    } catch (err) {
      const msg = String(err);
      ImpulseState.lastError = msg;
      warn("[PulseEvolutionaryImpulse] EMIT_ERROR", msg);
      safeLog("IMPULSE_ERROR", { error: msg });
      return { ok: false, error: "EmitError" };
    }
  }

  const PulseEvolutionaryImpulse = {
    ImpulseRole,
    ImpulseState,
    emit,
    Tiers: ImpulseTiers,
    Channels: ImpulseChannels
  };

  safeLog("INIT", {
    identity: ImpulseRole.identity,
    version: ImpulseRole.version,
    schemaVersion: IMPULSE_SCHEMA_VERSION
  });

  return PulseEvolutionaryImpulse;
}

try {
  if (typeof window !== "undefined") {
    window.PulseEvolutionaryImpulse = createPulseEvolutionaryImpulse;
  }
  if (typeof globalThis !== "undefined") {
    globalThis.PulseEvolutionaryImpulse = createPulseEvolutionaryImpulse;
  }
  if (typeof global !== "undefined") {
    global.PulseEvolutionaryImpulse = createPulseEvolutionaryImpulse;
  }
  if (typeof g !== "undefined") {
    g.PulseEvolutionaryImpulse = createPulseEvolutionaryImpulse;
  }
} catch {}
