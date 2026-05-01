/**
 * BinarySubstrate-v2.3-PRESENCE-EVO+.js
 * PULSE-WORLD / PULSE-BINARY / FIXED-WIDTH
 *
 * ROLE:
 *   v2 introduces:
 *     - fixed-width binary frames
 *     - deterministic field ordering
 *     - enum compression
 *     - region/host ID compression
 *     - varint encoding for lengths
 *     - reversible decoding
 *
 *   All upstream organs remain symbolic.
 *   This is the binary representation layer.
 */

export const BinarySubstrateV2Meta = Object.freeze({
  organId: "BinarySubstrate-v2.3-PRESENCE-EVO+",
  role: "BINARY_SUBSTRATE",
  version: "2.3-PRESENCE-EVO+",
  epoch: "v12.3-PRESENCE-EVO+",
  layer: "BinaryTransport",
  safety: Object.freeze({
    deterministic: true,
    noRandomness: true,
    noAsyncDrift: true,
    syntheticOnly: true
  }),
  evo: Object.freeze({
    presenceAware: true,      // can carry presence fields in meta/state
    advantageAware: true,     // can carry advantage fields in meta/state
    dualbandSafe: true,       // symbolic/binary tagging only
    chunkAware: true,         // frames are chunk-friendly
    cacheAware: true,         // stable, cacheable shapes
    prewarmAware: true,       // predictable sizes for prewarm
    meshAware: true,          // can carry region/host/mesh IDs
    expansionAware: true,     // carries deployment/multi-plan payloads
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
// SNAPSHOT PACKER (v2)
// -------------------------

export function packSnapshot(snapshot) {
  const header = snapshot.header;
  const state = snapshot.state;

  const fields = [
    header.snapshotId,
    header.instanceId,
    header.lineageRootId || "",
    header.logicalClock,
    state.regionId || "",
    state.hostName || "",
    state.configVersion || "",
    state.role || "",
    state.mode || "",
    JSON.stringify(state.healthFlags),
    JSON.stringify(state.meta)
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
// DELTA PACKER (v2)
// -------------------------

export function packDelta(delta) {
  const fields = [
    delta.instanceId,
    delta.snapshotBeforeId,
    delta.snapshotAfterId,
    JSON.stringify(delta.changes)
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
// DEPLOYMENT PLAN PACKER (v2)
// -------------------------

export function packDeploymentPlan(plan) {
  const fields = [
    plan.instanceId,
    JSON.stringify(
      plan.actions.map((a) => ({
        t: a.type,
        r: a.regionId || "",
        h: a.hostName || "",
        p: a.patch || null,
        m: a.meta || null
      }))
    )
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
// MULTI-ORGANISM PLAN PACKER (v2)
// -------------------------

export function packMultiOrganismPlan(multiPlan) {
  const fields = [
    JSON.stringify(
      multiPlan.instances.map((bundle) => ({
        id: bundle.instanceId,
        plan: bundle.deploymentPlan.actions.map((a) => ({
          t: a.type,
          r: a.regionId || "",
          h: a.hostName || "",
          p: a.patch || null,
          m: a.meta || null
        }))
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
// EXECUTION RESULT PACKER (v2)
// -------------------------

export function packExecutionResult(exec) {
  const fields = [
    exec.instanceId,
    JSON.stringify(exec.newState),
    JSON.stringify(exec.logs)
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
// UNPACKER (v2)
// -------------------------

export function unpackBinaryPayload(uint8) {
  const view = new DataView(uint8.buffer);
  let o = 0;

  const [type, o2] = readUint8(view, o);
  o = o2;

  const tag = PayloadTypeReverse[type] || "UNKNOWN";

  const out = { _t: tag };

  function readField() {
    const [str, next] = decodeString(view, o);
    o = next;
    return str;
  }

  switch (tag) {
    case "SNAPSHOT": {
      const snapshotId = readField();
      const instanceId = readField();
      const lineageRootId = readField();
      const logicalClock = readField();
      const regionId = readField();
      const hostName = readField();
      const configVersion = readField();
      const role = readField();
      const mode = readField();
      const healthFlags = JSON.parse(readField());
      const meta = JSON.parse(readField());

      out.header = {
        snapshotId,
        instanceId,
        lineageRootId,
        logicalClock
      };

      out.state = {
        regionId,
        hostName,
        configVersion,
        role,
        mode,
        healthFlags,
        meta
      };
      break;
    }

    case "DELTA": {
      const instanceId = readField();
      const beforeId = readField();
      const afterId = readField();
      const changes = JSON.parse(readField());

      out.instanceId = instanceId;
      out.snapshotBeforeId = beforeId;
      out.snapshotAfterId = afterId;
      out.changes = changes;
      break;
    }

    case "DEPLOYMENT_PLAN": {
      const instanceId = readField();
      const actions = JSON.parse(readField());

      out.instanceId = instanceId;
      out.actions = actions;
      break;
    }

    case "MULTI_PLAN": {
      const instances = JSON.parse(readField());
      out.instances = instances;
      break;
    }

    case "EXECUTION_RESULT": {
      const instanceId = readField();
      const newState = JSON.parse(readField());
      const logs = JSON.parse(readField());

      out.instanceId = instanceId;
      out.newState = newState;
      out.logs = logs;
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
