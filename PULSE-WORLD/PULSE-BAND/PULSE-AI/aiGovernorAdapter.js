// ============================================================================
//  aiGovernorAdapter.js — Pulse OS v16‑IMMORTAL++
//  Dualband Membrane • Packet Router • Evolution‑Safe Adapter • Trust‑Aware
//  PURE MEMBRANE. ZERO INTERPRETATION. ZERO MUTATION. ZERO RANDOMNESS.
// ============================================================================

/*
AI_EXPERIENCE_META = {
  identity: "aiGovernorAdaptor",
  version: "v16-Immortal++",
  layer: "ai_core",
  role: "governor_adaptor",
  lineage: "aiGovernorAdaptor-v11 → v14-Immortal → v16-Immortal++",

  evo: {
    governorAdaptor: true,
    policyMapping: true,
    symbolicPrimary: true,
    binaryAware: true,
    dualBand: true,

    deterministic: true,
    driftProof: true,
    pureCompute: true,
    zeroNetwork: true,
    zeroFilesystem: true,
    zeroMutationOfInput: true,

    trustFabricAware: true,
    juryAware: true,
    arteryAware: true,
    packetAware: true,
    windowAware: true
  },

  contract: {
    always: ["aiEngine", "aiBoundariesEngine", "aiBrainstem", "aiTrustFabric", "aiJuryFrame"],
    never: ["safeRoute", "fetchViaCNS"]
  }
}
*/

export const GovernorAdapterMeta = Object.freeze({
  layer: "OrganismMembrane",
  role: "GOVERNOR_ADAPTER",
  version: "16-Immortal++",
  identity: "aiGovernorAdapter-v16-Immortal++",

  evo: Object.freeze({
    deterministic: true,
    driftProof: true,
    dualband: true,
    membrane: true,

    packetAware: true,
    presenceAware: true,
    evolutionAware: true,
    windowAware: true,
    bluetoothReady: true,

    binaryAware: true,
    governorAware: true,
    pipelineAware: true,
    reflexAware: true,
    arteryAware: true,
    organismAware: true,

    trustFabricAware: true,
    juryAware: true,

    chunkingAware: true,
    gpuFriendly: true,

    pureCompute: true,
    zeroNetwork: true,
    zeroFilesystem: true,
    zeroMutationOfInput: true,

    identitySafe: true,
    readOnly: true,
    multiInstanceReady: true,
    epoch: "16-Immortal++"
  }),

  contract: Object.freeze({
    purpose:
      "Provide a deterministic membrane between the evolution layer and the Governor, without interpreting or mutating packets.",

    never: Object.freeze([
      "decode binary",
      "interpret binary",
      "mutate binary",
      "apply policy logic",
      "override Governor decisions",
      "modify pipeline or reflex behavior",
      "introduce randomness",
      "alter packet meaning",
      "inject symbolic metadata",
      "auto-connect bluetooth"
    ]),

    always: Object.freeze([
      "validate binary input",
      "wrap packets deterministically",
      "forward packets without interpretation",
      "remain pure and minimal",
      "act as a safe membrane between layers",
      "expose membrane artery metrics",
      "emit trust + jury evidence packets",
      "prepare for future binary membrane channels"
    ])
  })
});

// ============================================================================
//  PACKET EMITTER — deterministic, membrane-scoped
// ============================================================================
function emitGovernorAdapterPacket(type, payload) {
  return Object.freeze({
    meta: {
      version: GovernorAdapterMeta.version,
      epoch: GovernorAdapterMeta.evo.epoch,
      identity: GovernorAdapterMeta.identity,
      layer: GovernorAdapterMeta.layer,
      role: GovernorAdapterMeta.role
    },
    packetType: `gov-adapter-${type}`,
    timestamp: Date.now(),
    ...payload
  });
}

// ============================================================================
//  PREWARM — v16‑IMMORTAL++
// ============================================================================
export function prewarmGovernorAdapter(
  dualBand = null,
  { trace = false, trustFabric = null, juryFrame = null } = {}
) {
  try {
    const pressure = dualBand?.binary?.metabolic?.pressure ?? 0;

    const packet = emitGovernorAdapterPacket("prewarm", {
      message: "Governor adapter prewarmed and membrane artery aligned.",
      binaryPressure: pressure
    });

    trustFabric?.recordGovernorAdapterPrewarm?.({ pressure });
    juryFrame?.recordEvidence?.("governor-adapter-prewarm", packet);

    if (trace) console.log("[aiGovernorAdapter] prewarm", packet);
    return packet;
  } catch (err) {
    const packet = emitGovernorAdapterPacket("prewarm-error", {
      error: String(err),
      message: "Governor adapter prewarm failed."
    });

    juryFrame?.recordEvidence?.("governor-adapter-prewarm-error", packet);
    return packet;
  }
}

// ============================================================================
//  ORGAN IMPLEMENTATION — v16 IMMORTAL++
// ============================================================================
export class AIBinaryGovernorAdapter {
  constructor(config = {}) {
    this.id = config.id || "governor-adapter";

    this.encoder  = config.encoder;
    this.governor = config.governor;
    this.pipeline = config.pipeline || null;
    this.reflex   = config.reflex   || null;
    this.logger   = config.logger   || null;

    this.bluetooth = config.bluetooth || null;
    this.trustFabric = config.trustFabric || null;
    this.juryFrame = config.juryFrame || null;

    this.trace = !!config.trace;

    if (!this.encoder?.encode) {
      throw new Error("AIBinaryGovernorAdapter requires aiBinaryAgent encoder");
    }
    if (!this.governor?.handle) {
      throw new Error("AIBinaryGovernorAdapter requires a Governor organ with .handle()");
    }

    this.artery = {
      packetsIn: 0,
      packetsOut: 0,
      lastPacketBits: 0,
      snapshot: () => Object.freeze(this._snapshotArtery())
    };
  }

  // ========================================================================
  //  ARTERY SNAPSHOT
  // ========================================================================
  _snapshotArtery() {
    const { packetsIn, packetsOut, lastPacketBits } = this.artery;
    const load = Math.min(1, (packetsIn + packetsOut) / 1000);
    const pressure = Math.min(1, lastPacketBits / 65536);

    return {
      packetsIn,
      packetsOut,
      lastPacketBits,
      load,
      loadBucket: this._bucketLoad(load),
      pressure,
      pressureBucket: this._bucketPressure(pressure)
    };
  }

  _bucketLoad(v) {
    if (v >= 0.9) return "saturated";
    if (v >= 0.7) return "high";
    if (v >= 0.4) return "medium";
    if (v > 0)   return "low";
    return "idle";
  }

  _bucketPressure(v) {
    if (v >= 0.9) return "overload";
    if (v >= 0.7) return "high";
    if (v >= 0.4) return "medium";
    if (v > 0)   return "low";
    return "none";
  }

  // ========================================================================
  //  FORWARD BINARY → GOVERNOR (PURE MEMBRANE)
// ========================================================================
  forwardBinaryToGovernor(binaryStr) {
    this._assertBinary(binaryStr);

    const packet = emitGovernorAdapterPacket("forward-in", {
      bits: binaryStr,
      bitLength: binaryStr.length,
      bluetooth: {
        ready: !!this.bluetooth,
        channel: null
      }
    });

    this._trace("forwardBinaryToGovernor", packet);

    this.artery.packetsIn++;
    this.artery.lastPacketBits = packet.bitLength;

    this.trustFabric?.recordGovernorAdapterIn?.({
      bitLength: packet.bitLength
    });

    this.juryFrame?.recordEvidence?.("governor-adapter-in", packet);

    this.governor.handle({
      type: "binary-event",
      bits: packet.bits,
      bitLength: packet.bitLength,
      timestamp: packet.timestamp,
      bluetooth: packet.bluetooth
    });
  }

  // ========================================================================
  //  FORWARD GOVERNOR DECISION → PIPELINE / REFLEX
  // ========================================================================
  forwardGovernorDecision(decisionObj) {
    const json = JSON.stringify(decisionObj);
    const binary = this.encoder.encode(json);

    const packet = emitGovernorAdapterPacket("forward-out", {
      decision: decisionObj,
      bits: binary,
      bitLength: binary.length
    });

    this._trace("forwardGovernorDecision", packet);

    this.artery.packetsOut++;
    this.artery.lastPacketBits = binary.length;

    this.trustFabric?.recordGovernorAdapterOut?.({
      bitLength: binary.length
    });

    this.juryFrame?.recordEvidence?.("governor-adapter-out", packet);

    if (this.pipeline) this.pipeline.run(binary);
    if (this.reflex)   this.reflex.run(binary);
    if (this.logger)   this.logger.logBinary(binary, { source: "Governor" });

    return binary;
  }

  // ========================================================================
  //  ATTACHMENT HOOKS
  // ========================================================================
  attachToPipeline(pipeline) {
    pipeline.addObserver(({ output }) => {
      this.forwardBinaryToGovernor(output);
    });

    this._trace("attachToPipeline", { pipeline: pipeline.id });
  }

  attachToReflex(reflex) {
    const originalRun = reflex.run.bind(reflex);

    reflex.run = (binaryInput) => {
      const result = originalRun(binaryInput);

      if (result !== null && typeof result === "string") {
        this.forwardBinaryToGovernor(result);
      }

      return result;
    };

    this._trace("attachToReflex", { reflex: reflex.id });
  }

  // ========================================================================
  //  SNAPSHOT
  // ========================================================================
  snapshotMembrane() {
    const artery = this._snapshotArtery();

    const packet = emitGovernorAdapterPacket("snapshot", {
      artery
    });

    this.juryFrame?.recordEvidence?.("governor-adapter-snapshot", packet);

    return packet;
  }

  // ========================================================================
  //  INTERNAL
  // ========================================================================
  _assertBinary(str) {
    if (typeof str !== "string" || !/^[01]+$/.test(str)) {
      throw new TypeError("expected binary string");
    }
  }

  _trace(event, payload) {
    if (!this.trace) return;
    console.log(`[${this.id}] ${event}`, payload);
  }
}

// ============================================================================
// FACTORY
// ============================================================================
export function createAIBinaryGovernorAdapter(config) {
  return new AIBinaryGovernorAdapter(config);
}

if (typeof module !== "undefined") {
  module.exports = {
    AIBinaryGovernorAdapter,
    createAIBinaryGovernorAdapter,
    GovernorAdapterMeta,
    prewarmGovernorAdapter
  };
}
