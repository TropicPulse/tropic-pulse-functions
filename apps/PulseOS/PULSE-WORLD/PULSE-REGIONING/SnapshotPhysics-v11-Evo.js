/**
 * META {
 *   organ: "SnapshotPhysics",
 *   root: "PULSE-WORLD",
 *   mode: "substrate",
 *   target: "organism-snapshot",
 *   version: "v11-EVO",
 *
 *   role: "Captures symbolic snapshots of an organism instance for comparison, restore, and deployment.",
 *
 *   guarantees: {
 *     deterministic: true,
 *     symbolic: true,
 *     hostAgnostic: true,
 *     regionAware: true,
 *     noRandomness: true
 *   },
 *
 *   contracts: {
 *     input: [
 *       "InstanceId",
 *       "CurrentInstanceState",
 *       "ConfigDescriptor",
 *       "RegionId",
 *       "HostName",
 *       "LogicalClockToken"
 *     ],
 *     output: [
 *       "SnapshotRecord",
 *       "SnapshotHeader",
 *       "SnapshotStateView"
 *     ]
 *   },
 *
 *   upstream: [
 *     "LineageEngine",
 *     "RegioningPhysics",
 *     "PulseSchema",
 *     "PulseOmniHosting"
 *   ],
 *
 *   downstream: [
 *     "DeltaEngine",
 *     "DeploymentPhysics",
 *     "MultiOrganismSupport"
 *   ],
 *
 *   notes: [
 *     "Snapshots are symbolic, not full memory dumps.",
 *     "Snapshots are designed to be diffed by DeltaEngine.",
 *     "LogicalClockToken is caller-provided, not real time.",
 *     "SnapshotPhysics never talks to real hosts or storage."
 *   ]
 * }
 */

/**
 * SnapshotPhysics-v11-Evo.js
 * PULSE-WORLD / PULSE-SNAPSHOT
 *
 * ROLE:
 *   Capture a compact, symbolic snapshot of an organism instance:
 *   - where it is (region, host)
 *   - what it is (config, version, role)
 *   - how it is (flags, health, mode)
 *
 * NEVER:
 *   - Never store heavy payloads.
 *   - Never depend on real time.
 *   - Never introduce randomness.
 *
 * ALWAYS:
 *   - Always be symbolic.
 *   - Always be deterministic.
 *   - Always be diff-friendly.
 */

// -------------------------
// Types
// -------------------------

/**
 * SnapshotHeader
 *
 * snapshotId: string          // deterministic id (caller-provided)
 * instanceId: string
 * lineageRootId?: string      // optional link to lineage root
 * logicalClock: string        // caller-provided logical token (e.g. seq, hash)
 */
export class SnapshotHeader {
  constructor({
    snapshotId,
    instanceId,
    lineageRootId = null,
    logicalClock
  }) {
    this.snapshotId = snapshotId;
    this.instanceId = instanceId;
    this.lineageRootId = lineageRootId;
    this.logicalClock = logicalClock;
  }
}

/**
 * SnapshotStateView
 *
 * regionId: string | null
 * hostName: string | null
 * configVersion: string | null
 * role: string | null
 * mode: string | null
 * healthFlags: string[]       // symbolic flags only
 * meta: object                // small symbolic metadata
 */
export class SnapshotStateView {
  constructor({
    regionId = null,
    hostName = null,
    configVersion = null,
    role = null,
    mode = null,
    healthFlags = [],
    meta = {}
  }) {
    this.regionId = regionId;
    this.hostName = hostName;
    this.configVersion = configVersion;
    this.role = role;
    this.mode = mode;
    this.healthFlags = Array.isArray(healthFlags)
      ? healthFlags.slice().sort()
      : [];
    this.meta = meta;
  }
}

/**
 * SnapshotRecord
 *
 * header: SnapshotHeader
 * state: SnapshotStateView
 */
export class SnapshotRecord {
  constructor({ header, state }) {
    this.header = header;
    this.state = state;
  }
}

// -------------------------
// Builders
// -------------------------

/**
 * buildSnapshotFromInstanceState
 *
 * Input:
 *   - snapshotId: string
 *   - logicalClock: string
 *   - currentInstanceState: CurrentInstanceState (from LineageEngine)
 *   - configDescriptor: {
 *       configVersion?: string,
 *       role?: string,
 *       mode?: string,
 *       healthFlags?: string[],
 *       meta?: object
 *     }
 *   - lineageRootId?: string
 *
 * Output:
 *   - SnapshotRecord
 */
export function buildSnapshotFromInstanceState({
  snapshotId,
  logicalClock,
  currentInstanceState,
  configDescriptor = {},
  lineageRootId = null
}) {
  const header = new SnapshotHeader({
    snapshotId,
    instanceId: currentInstanceState.instanceId,
    lineageRootId,
    logicalClock
  });

  const state = new SnapshotStateView({
    regionId: currentInstanceState.currentRegionId,
    hostName: currentInstanceState.currentHostName,
    configVersion: configDescriptor.configVersion || null,
    role: configDescriptor.role || null,
    mode: configDescriptor.mode || null,
    healthFlags: configDescriptor.healthFlags || [],
    meta: configDescriptor.meta || {}
  });

  return new SnapshotRecord({ header, state });
}

/**
 * cloneSnapshot
 *
 * Returns a deep, deterministic clone of a snapshot.
 */
export function cloneSnapshot(snapshotRecord) {
  const header = new SnapshotHeader({
    snapshotId: snapshotRecord.header.snapshotId,
    instanceId: snapshotRecord.header.instanceId,
    lineageRootId: snapshotRecord.header.lineageRootId,
    logicalClock: snapshotRecord.header.logicalClock
  });

  const state = new SnapshotStateView({
    regionId: snapshotRecord.state.regionId,
    hostName: snapshotRecord.state.hostName,
    configVersion: snapshotRecord.state.configVersion,
    role: snapshotRecord.state.role,
    mode: snapshotRecord.state.mode,
    healthFlags: snapshotRecord.state.healthFlags,
    meta: { ...snapshotRecord.state.meta }
  });

  return new SnapshotRecord({ header, state });
}

// -------------------------
// Lightweight Views
// -------------------------

/**
 * projectSnapshotForDelta
 *
 * Produces a minimal, stable object for DeltaEngine to diff.
 * No methods, no classes, just plain data.
 */
export function projectSnapshotForDelta(snapshotRecord) {
  return {
    header: {
      snapshotId: snapshotRecord.header.snapshotId,
      instanceId: snapshotRecord.header.instanceId,
      lineageRootId: snapshotRecord.header.lineageRootId,
      logicalClock: snapshotRecord.header.logicalClock
    },
    state: {
      regionId: snapshotRecord.state.regionId,
      hostName: snapshotRecord.state.hostName,
      configVersion: snapshotRecord.state.configVersion,
      role: snapshotRecord.state.role,
      mode: snapshotRecord.state.mode,
      healthFlags: snapshotRecord.state.healthFlags.slice().sort(),
      meta: { ...snapshotRecord.state.meta }
    }
  };
}

// -------------------------
// Exported API
// -------------------------

const SnapshotPhysicsAPI = {
  SnapshotHeader,
  SnapshotStateView,
  SnapshotRecord,
  buildSnapshotFromInstanceState,
  cloneSnapshot,
  projectSnapshotForDelta
};

export default SnapshotPhysicsAPI;
