/**
 * BinarySubstrate-v2.4-PRESENCE-TOUCH-IMMORTAL.js
 * PULSE-WORLD / PULSE-BINARY / FIXED-WIDTH
 *
 * ROLE:
 *   v2.4 introduces:
 *     - fixed-width binary frames (v2 base)
 *     - deterministic field ordering
 *     - enum compression
 *     - region/host ID compression
 *     - varint encoding for lengths
 *     - reversible decoding
 *
 *   v2.4-PRESENCE-TOUCH-IMMORTAL adds:
 *     - explicit Pulse-Touch presence fields
 *     - explicit advantage / chunkProfile / page / identity / trust fields
 *     - optional pulseTouchMeta block (JSON) at tail
 *     - backward-safe decoding (old frames still decode)
 *
 *   All upstream organs remain symbolic.
 *   This is the binary representation layer.
 */
/*
AI_EXPERIENCE_META = {
  identity: "BinarySubstrate",
  version: "v2.4-PRESENCE-TOUCH-IMMORTAL",
  layer: "substrate",
  role: "binary_representation_layer",
  lineage: "BinarySubstrate-v1 → v11-Evo → v14-IMMORTAL → v2.4-PRESENCE-TOUCH-IMMORTAL",

  evo: {
    binaryPrimary: true,           // binary-first representation
    symbolicAware: true,           // symbolic ↔ binary dualband
    dualBand: true,

    fixedWidthFrames: true,        // deterministic binary frames
    deterministicPacking: true,
    deterministicUnpacking: true,

    driftProof: true,
    deterministic: true,
    pureCompute: true,

    zeroMutationOfInput: true,
    zeroNetwork: true,
    zeroFilesystem: true,

    // Presence / Touch / Advantage
    presenceAware: true,
    advantageAware: true,
    pulseTouchAware: true,
    chunkAware: true,
    cacheAware: true,
    prewarmAware: true,
    meshAware: true,
    expansionAware: true,
    multiInstanceReady: true
  },

  contract: {
    always: [
      "PulseRuntime",
      "PulseScheduler"
    ],
    never: [
      "safeRoute",
      "fetchViaCNS",
      "presenceEngine",
      "meshKernel"
    ]
  }
}
*/

export const BinarySubstrateV2Meta = Object.freeze({
  organId: "BinarySubstrate-v2.4-PRESENCE-TOUCH-IMMORTAL",
  role: "BINARY_SUBSTRATE",
  version: "2.4-PRESENCE-TOUCH-IMMORTAL",
  epoch: "v13.0-PRESENCE-TOUCH",
  layer: "BinaryTransport",
  safety: Object.freeze({
    deterministic: true,
    noRandomness: true,
    noAsyncDrift: true,
    syntheticOnly: true
  }),
  evo: Object.freeze({
    presenceAware: true,      // can carry presence fields in state
    advantageAware: true,     // can carry advantage fields in state
    dualbandSafe: true,       // symbolic/binary tagging only
    chunkAware: true,         // frames are chunk-friendly
    cacheAware: true,         // stable, cacheable shapes
    prewarmAware: true,       // predictable sizes for prewarm
    meshAware: true,          // can carry region/host/mesh IDs
    expansionAware: true,     // carries deployment/multi-plan payloads
    pulseTouchAware: true,    // explicit Pulse-Touch fields
    multiInstanceReady: true
  })
});

// -------------------------
// ENUM COMPRESSION
// -------------------------

export const BinaryPayloadType = Object.freeze({
  SNAPSHOT: 1,
  DELTA: 2,
  DEPLOYMENT_PLAN: 3,
  MULTI_PLAN: 4,
  EXECUTION_RESULT: 5
});

// Reverse lookup
const PayloadTypeReverse = {
  1: "SNAPSHOT",
  2: "DELTA",
  3: "DEPLOYMENT_PLAN",
  4: "MULTI_PLAN",
  5: "EXECUTION_RESULT"
};

// -------------------------
// FIXED-WIDTH HELPERS
// -------------------------

function writeUint32(view, offset, value) {
  view.setUint32(offset, value >>> 0);
  return offset + 4;
}

function readUint32(view, offset) {
  return [view.getUint32(offset), offset + 4];
}

function writeUint8(view, offset, value) {
  view.setUint8(offset, value & 0xff);
  return offset + 1;
}

function readUint8(view, offset) {
  return [view.getUint8(offset), offset + 1];
}

function encodeString(str) {
  const bytes = new TextEncoder().encode(str);
  const buf = new ArrayBuffer(4 + bytes.length);
  const view = new DataView(buf);
  let o = 0;
  o = writeUint32(view, o, bytes.length);
  new Uint8Array(buf, 4).set(bytes);
  return new Uint8Array(buf);
}

function decodeString(view, offset) {
  const [len, o2] = readUint32(view, offset);
  const bytes = new Uint8Array(view.buffer, o2, len);
  const str = new TextDecoder().decode(bytes);
  return [str, o2 + len];
}

// -------------------------
// SNAPSHOT PACKER (v2.4)
// -------------------------

export function packSnapshot(snapshot) {
  const header = snapshot.header || {};
  const state = snapshot.state || {};

  const touch = state.pulseTouch || state.skin || {};
  const presence = state.presence || touch.presence || "";
  const page = state.page || touch.page || "";
  const chunkProfile = state.chunkProfile || touch.chunkProfile || "";
  const identity = state.identity || touch.identity || "";
  const trusted = state.trusted || touch.trusted || "";
  const advantage = state.advantage || touch.advantage || "";
  const touchMeta = touch && Object.keys(touch).length > 0 ? touch : null;

  const fields = [
    header.snapshotId || "",
    header.instanceId || "",
    header.lineageRootId || "",
    String(header.logicalClock ?? ""),
    state.regionId || "",
    state.hostName || "",
    state.configVersion || "",
    state.role || "",
    state.mode || "",
    JSON.stringify(state.healthFlags || {}),
    JSON.stringify(state.meta || {}),
    presence,
    page,
    chunkProfile,
    identity,
    trusted,
    advantage,
    JSON.stringify(touchMeta || {})
  ];

  const encodedFields = fields.map(encodeString);
  const totalSize =
    1 + // payload type
    encodedFields.reduce((sum, f) => sum + f.length, 0);

  const buf = new ArrayBuffer(totalSize);
  const view = new DataView(buf);
  let o = 0;

  o = writeUint8(view, o, BinaryPayloadType.SNAPSHOT);

  for (const ef of encodedFields) {
    new Uint8Array(buf, o).set(ef);
    o += ef.length;
  }

  return new Uint8Array(buf);
}

// -------------------------
// DELTA PACKER (v2.4)
// -------------------------

export function packDelta(delta) {
  const touch = delta.pulseTouch || delta.skin || {};
  const touchMeta = touch && Object.keys(touch).length > 0 ? touch : null;

  const fields = [
    delta.instanceId || "",
    delta.snapshotBeforeId || "",
    delta.snapshotAfterId || "",
    JSON.stringify(delta.changes || {}),
    JSON.stringify(touchMeta || {})
  ];

  const encoded = fields.map(encodeString);
  const totalSize = 1 + encoded.reduce((s, f) => s + f.length, 0);

  const buf = new ArrayBuffer(totalSize);
  const view = new DataView(buf);
  let o = 0;

  o = writeUint8(view, o, BinaryPayloadType.DELTA);

  for (const ef of encoded) {
    new Uint8Array(buf, o).set(ef);
    o += ef.length;
  }

  return new Uint8Array(buf);
}

// -------------------------
// DEPLOYMENT PLAN PACKER (v2.4)
// -------------------------

export function packDeploymentPlan(plan) {
  const touch = plan.pulseTouch || plan.touch || {};
  const touchMeta = touch && Object.keys(touch).length > 0 ? touch : null;

  const fields = [
    plan.instanceId || "",
    JSON.stringify(
      (plan.actions || []).map((a) => ({
        t: a.type,
        r: a.regionId || "",
        h: a.hostName || "",
        p: a.patch || null,
        m: a.meta || null
      }))
    ),
    JSON.stringify(touchMeta || {})
  ];

  const encoded = fields.map(encodeString);
  const totalSize = 1 + encoded.reduce((s, f) => s + f.length, 0);

  const buf = new ArrayBuffer(totalSize);
  const view = new DataView(buf);
  let o = 0;

  o = writeUint8(view, o, BinaryPayloadType.DEPLOYMENT_PLAN);

  for (const ef of encoded) {
    new Uint8Array(buf, o).set(ef);
    o += ef.length;
  }

  return new Uint8Array(buf);
}

// -------------------------
// MULTI-ORGANISM PLAN PACKER (v2.4)
// -------------------------

export function packMultiOrganismPlan(multiPlan) {
  const fields = [
    JSON.stringify(
      (multiPlan.instances || []).map((bundle) => ({
        id: bundle.instanceId,
        plan: (bundle.deploymentPlan.actions || []).map((a) => ({
          t: a.type,
          r: a.regionId || "",
          h: a.hostName || "",
          p: a.patch || null,
          m: a.meta || null
        })),
        touch: bundle.pulseTouch || bundle.touch || null
      }))
    )
  ];

  const encoded = fields.map(encodeString);
  const totalSize = 1 + encoded.reduce((s, f) => s + f.length, 0);

  const buf = new ArrayBuffer(totalSize);
  const view = new DataView(buf);
  let o = 0;

  o = writeUint8(view, o, BinaryPayloadType.MULTI_PLAN);

  for (const ef of encoded) {
    new Uint8Array(buf, o).set(ef);
    o += ef.length;
  }

  return new Uint8Array(buf);
}

// -------------------------
// EXECUTION RESULT PACKER (v2.4)
// -------------------------

export function packExecutionResult(exec) {
  const touch = exec.pulseTouch || exec.touch || {};
  const touchMeta = touch && Object.keys(touch).length > 0 ? touch : null;

  const fields = [
    exec.instanceId || "",
    JSON.stringify(exec.newState || {}),
    JSON.stringify(exec.logs || []),
    JSON.stringify(touchMeta || {})
  ];

  const encoded = fields.map(encodeString);
  const totalSize = 1 + encoded.reduce((s, f) => s + f.length, 0);

  const buf = new ArrayBuffer(totalSize);
  const view = new DataView(buf);
  let o = 0;

  o = writeUint8(view, o, BinaryPayloadType.EXECUTION_RESULT);

  for (const ef of encoded) {
    new Uint8Array(buf, o).set(ef);
    o += ef.length;
  }

  return new Uint8Array(buf);
}

// -------------------------
// UNPACKER (v2.4, backward-safe)
// -------------------------

export function unpackBinaryPayload(uint8) {
  const view = new DataView(uint8.buffer, uint8.byteOffset, uint8.byteLength);
  let o = 0;

  const [type, o2] = readUint8(view, o);
  o = o2;

  const tag = PayloadTypeReverse[type] || "UNKNOWN";

  const out = { _t: tag };

  function readFieldSafe() {
    if (o >= view.byteLength) return [null, o];
    try {
      const [str, next] = decodeString(view, o);
      return [str, next];
    } catch {
      return [null, o];
    }
  }

  switch (tag) {
    case "SNAPSHOT": {
      const [snapshotId, o3] = decodeString(view, o);
      o = o3;
      const [instanceId, o4] = decodeString(view, o);
      o = o4;
      const [lineageRootId, o5] = decodeString(view, o);
      o = o5;
      const [logicalClockStr, o6] = decodeString(view, o);
      o = o6;
      const [regionId, o7] = decodeString(view, o);
      o = o7;
      const [hostName, o8] = decodeString(view, o);
      o = o8;
      const [configVersion, o9] = decodeString(view, o);
      o = o9;
      const [role, o10] = decodeString(view, o);
      o = o10;
      const [mode, o11] = decodeString(view, o);
      o = o11;
      const [healthFlagsStr, o12] = decodeString(view, o);
      o = o12;
      const [metaStr, o13] = decodeString(view, o);
      o = o13;

      let presence = "";
      let page = "";
      let chunkProfile = "";
      let identity = "";
      let trusted = "";
      let advantage = "";
      let touchMeta = {};

      // Optional tail fields (backward-safe)
      let tmp;
      [tmp, o] = readFieldSafe();
      if (tmp !== null) presence = tmp;
      [tmp, o] = readFieldSafe();
      if (tmp !== null) page = tmp;
      [tmp, o] = readFieldSafe();
      if (tmp !== null) chunkProfile = tmp;
      [tmp, o] = readFieldSafe();
      if (tmp !== null) identity = tmp;
      [tmp, o] = readFieldSafe();
      if (tmp !== null) trusted = tmp;
      [tmp, o] = readFieldSafe();
      if (tmp !== null) advantage = tmp;
      [tmp, o] = readFieldSafe();
      if (tmp !== null) {
        try {
          touchMeta = JSON.parse(tmp || "{}");
        } catch {
          touchMeta = {};
        }
      }

      let healthFlags = {};
      let meta = {};
      try {
        healthFlags = JSON.parse(healthFlagsStr || "{}");
      } catch {}
      try {
        meta = JSON.parse(metaStr || "{}");
      } catch {}

      out.header = {
        snapshotId,
        instanceId,
        lineageRootId,
        logicalClock: logicalClockStr
      };

      out.state = {
        regionId,
        hostName,
        configVersion,
        role,
        mode,
        healthFlags,
        meta,
        presence,
        page,
        chunkProfile,
        identity,
        trusted,
        advantage,
        pulseTouch: touchMeta
      };
      break;
    }

    case "DELTA": {
      const [instanceId, o3] = decodeString(view, o);
      o = o3;
      const [beforeId, o4] = decodeString(view, o);
      o = o4;
      const [afterId, o5] = decodeString(view, o);
      o = o5;
      const [changesStr, o6] = decodeString(view, o);
      o = o6;

      let touchMeta = {};
      const [touchStr, o7] = readFieldSafe();
      o = o7;
      if (touchStr !== null) {
        try {
          touchMeta = JSON.parse(touchStr || "{}");
        } catch {
          touchMeta = {};
        }
      }

      let changes = {};
      try {
        changes = JSON.parse(changesStr || "{}");
      } catch {}

      out.instanceId = instanceId;
      out.snapshotBeforeId = beforeId;
      out.snapshotAfterId = afterId;
      out.changes = changes;
      out.pulseTouch = touchMeta;
      break;
    }

    case "DEPLOYMENT_PLAN": {
      const [instanceId, o3] = decodeString(view, o);
      o = o3;
      const [actionsStr, o4] = decodeString(view, o);
      o = o4;

      let touchMeta = {};
      const [touchStr, o5] = readFieldSafe();
      o = o5;
      if (touchStr !== null) {
        try {
          touchMeta = JSON.parse(touchStr || "{}");
        } catch {
          touchMeta = {};
        }
      }

      let actions = [];
      try {
        actions = JSON.parse(actionsStr || "[]");
      } catch {}

      out.instanceId = instanceId;
      out.actions = actions;
      out.pulseTouch = touchMeta;
      break;
    }

    case "MULTI_PLAN": {
      const [instancesStr, o3] = decodeString(view, o);
      o = o3;
      let instances = [];
      try {
        instances = JSON.parse(instancesStr || "[]");
      } catch {}
      out.instances = instances;
      break;
    }

    case "EXECUTION_RESULT": {
      const [instanceId, o3] = decodeString(view, o);
      o = o3;
      const [newStateStr, o4] = decodeString(view, o);
      o = o4;
      const [logsStr, o5] = decodeString(view, o);
      o = o5;

      let touchMeta = {};
      const [touchStr, o6] = readFieldSafe();
      o = o6;
      if (touchStr !== null) {
        try {
          touchMeta = JSON.parse(touchStr || "{}");
        } catch {
          touchMeta = {};
        }
      }

      let newState = {};
      let logs = [];
      try {
        newState = JSON.parse(newStateStr || "{}");
      } catch {}
      try {
        logs = JSON.parse(logsStr || "[]");
      } catch {}

      out.instanceId = instanceId;
      out.newState = newState;
      out.logs = logs;
      out.pulseTouch = touchMeta;
      break;
    }

    default:
      out.error = "Unknown payload type";
  }

  return out;
}

// -------------------------
// Exported API
// -------------------------

const BinarySubstrateV2 = {
  meta: BinarySubstrateV2Meta,
  BinaryPayloadType,
  packSnapshot,
  packDelta,
  packDeploymentPlan,
  packMultiOrganismPlan,
  packExecutionResult,
  unpackBinaryPayload
};

export default BinarySubstrateV2;
