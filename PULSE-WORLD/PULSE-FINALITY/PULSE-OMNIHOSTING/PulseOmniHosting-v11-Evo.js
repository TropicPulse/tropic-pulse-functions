/**
 * META {
 *   organ: "PulseOmniHosting",
 *   root: "PULSE-FINALITY",
 *   mode: "substrate",
 *   target: "omnidirectional-hosting",
 *   version: "v11-EVO",
 *
 *   role: "Universal hosting mesh. Determines where an organism can run, move, replicate, or failover.",
 *
 *   guarantees: {
 *     deterministic: true,
 *     hostAgnostic: true,
 *     multiInstanceReady: true,
 *     zeroBackend: true,
     zeroNetwork: true,
 *     reversiblePlacement: true,
 *     noRandomness: true
 *   },
 *
 *   contracts: {
 *     input: [
 *       "PulseSchema",
 *       "HostDescriptor",
 *       "RegionDescriptor"
 *     ],
 *     output: [
 *       "PlacementPlan",
 *       "FailoverPlan",
 *       "HostCapabilityMatrix"
 *     ]
 *   },
 *
 *   upstream: [
 *     "PulseSchema",
 *     "RegioningPhysics",
 *     "EnvironmentPhysics"
 *   ],
 *
 *   downstream: [
 *     "PulseContinuance",
 *     "DeploymentPhysics",
 *     "DeltaEngine",
 *     "SnapshotPhysics",
 *     "LineageEngine"
 *   ],
 *
 *   notes: [
 *     "OmniHosting is the universal hosting mesh.",
 *     "Hosts are interchangeable. No host defines truth.",
 *     "Placement is deterministic and reversible.",
 *     "Failover is schema-aware and region-aware.",
 *     "This organ enables multi-instance minimal survival."
 *   ]
 * }
 */

/**
 * PulseOmniHosting-v11-Evo.js
 * PULSE-FINALITY / PULSE-OMNIHOSTING
 *
 * ROLE:
 *   The universal hosting mesh for Pulse OS.
 *   Determines where an organism can run, replicate, or move.
 *   Provides deterministic failover and multi-instance placement.
 *
 * NEVER:
 *   - Never embed host-specific logic.
 *   - Never use randomness.
 *   - Never mutate host descriptors.
 *
 * ALWAYS:
 *   - Always use PulseSchema as truth.
 *   - Always evaluate hosts deterministically.
 *   - Always produce reversible placement plans.
 */

// -------------------------
// Host Descriptor
// -------------------------

/**
 * HostDescriptor
 *
 * A symbolic description of a host.
 * This is NOT the host itself — only its capabilities.
 *
 * name: unique host name
 * type: "firebase" | "sql" | "netlify" | "vercel" | "cloudflare" | "custom"
 * region: region identifier
 * capabilities: {
 *   read: boolean,
 *   write: boolean,
 *   binary: boolean,
 *   compute: boolean,
 *   storage: boolean
 * }
 * meta: free-form metadata
 */
export class HostDescriptor {
  constructor({
    name,
    type,
    region,
    capabilities = {},
    meta = {}
  }) {
    this.name = name;
    this.type = type;
    this.region = region;
    this.capabilities = {
      read: !!capabilities.read,
      write: !!capabilities.write,
      binary: !!capabilities.binary,
      compute: !!capabilities.compute,
      storage: !!capabilities.storage
    };
    this.meta = meta;
  }
}

// -------------------------
// Capability Matrix
// -------------------------

/**
 * buildCapabilityMatrix
 *
 * Input: array of HostDescriptor
 * Output: deterministic matrix describing host capabilities
 */
export function buildCapabilityMatrix(hosts = []) {
  const matrix = {};

  for (const host of hosts) {
    matrix[host.name] = {
      type: host.type,
      region: host.region,
      capabilities: { ...host.capabilities }
    };
  }

  return matrix;
}

// -------------------------
// Placement Logic
// -------------------------

/**
 * evaluateHostForSchema
 *
 * Determines if a host can support a given PulseSchema.
 * This is symbolic — no host-specific logic allowed.
 */
export function evaluateHostForSchema(host, pulseSchema) {
  // If schema contains binary fields, host must support binary
  const requiresBinary = Object.values(pulseSchema.fields).some(
    (f) => f.type === "binary"
  );

  if (requiresBinary && !host.capabilities.binary) {
    return false;
  }

  // If schema requires compute (object/array), host must support compute
  const requiresCompute = Object.values(pulseSchema.fields).some(
    (f) => f.type === "object" || f.type === "array"
  );

  if (requiresCompute && !host.capabilities.compute) {
    return false;
  }

  return true;
}

/**
 * buildPlacementPlan
 *
 * Input:
 *   - hosts: array of HostDescriptor
 *   - pulseSchema: PulseSchema
 *   - minInstances: minimum number of instances to maintain
 *
 * Output:
 *   - deterministic placement plan
 */
export function buildPlacementPlan(hosts, pulseSchema, minInstances = 1) {
  const eligible = hosts.filter((h) =>
    evaluateHostForSchema(h, pulseSchema)
  );

  // Deterministic sort by name
  eligible.sort((a, b) => a.name.localeCompare(b.name));

  const selected = eligible.slice(0, minInstances);

  return {
    selectedHosts: selected.map((h) => h.name),
    eligibleHosts: eligible.map((h) => h.name),
    minInstances,
    schemaVersion: pulseSchema.version
  };
}

// -------------------------
// Failover Logic
// -------------------------

/**
 * buildFailoverPlan
 *
 * Input:
 *   - hosts: array of HostDescriptor
 *   - pulseSchema: PulseSchema
 *   - failedHostName: string
 *
 * Output:
 *   - deterministic failover plan
 */
export function buildFailoverPlan(hosts, pulseSchema, failedHostName) {
  const remaining = hosts.filter((h) => h.name !== failedHostName);

  const eligible = remaining.filter((h) =>
    evaluateHostForSchema(h, pulseSchema)
  );

  eligible.sort((a, b) => a.name.localeCompare(b.name));

  return {
    failedHost: failedHostName,
    failoverTargets: eligible.map((h) => h.name),
    schemaVersion: pulseSchema.version
  };
}

// -------------------------
// Exported API
// -------------------------

const PulseOmniHostingAPI = {
  HostDescriptor,
  buildCapabilityMatrix,
  evaluateHostForSchema,
  buildPlacementPlan,
  buildFailoverPlan
};

export default PulseOmniHostingAPI;
