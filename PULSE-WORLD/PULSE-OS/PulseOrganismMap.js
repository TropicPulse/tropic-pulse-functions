// -----------------------------------------------------------------------------
// PulseOrganismMap.js
// PulseOS v12.4+ / v13-EVO
// SELF-DESCRIBING ORGANISM GENOME
//
// LAW:
//   - Any folder starting with "PULSE-" is a system.
//   - Any .js file inside that folder is an organ.
//   - No hardcoded clusters.
//   - No hardcoded organs.
//   - No hardcoded pages.
//   - The filesystem IS the organism.
//
// This file IS the organism map.
// Every other subsystem (IQMap, Cortex, Earn, Router, Mesh, Presence)
// reads from THIS genome.
// -----------------------------------------------------------------------------
let fs = null;
let db = null;
let routes = null;
let schema = null;
let warmDualBand = null;
function emitDepsPacket(type = "snapshot", payload = {}) {
  const base = {
    type: "deps-snapshot",
    timestamp: Date.now(),
    adapters: ["db", "fs", "routes", "schema"]
  };

  return Object.freeze({
    meta: DepsMeta,
    packetType: `deps-${type}`,
    epoch: DepsMeta.evo.epoch,
    layer: DepsMeta.layer,
    role: DepsMeta.role,
    identity: DepsMeta.identity,
    ...base,
    ...payload,
    bits: null,
    bitLength: 0
  });
}
// ============================================================================
//  DATABASE API — Firestore/SQL/KV Compatible Adapter
// ============================================================================
export function getDb({ trace = false } = {}) {
  const log = (msg, data) => trace && console.log(`[OrganismMap:db] ${msg}`, data);

  return Object.freeze({
    async getCollection(collection, options = {}) {
      log("getCollection", { collection, options });
      return [];
    },

    async getDocument(collection, id) {
      log("getDocument", { collection, id });
      return null;
    }
  });
}

// ============================================================================
//  FILESYSTEM API — Required by aiEvolution
// ============================================================================
export function getFsAPI({ trace = false } = {}) {
  const log = (msg, data) => trace && console.log(`[OrganismMap:fs] ${msg}`, data);

  return Object.freeze({
    async getAllFiles() {
      log("getAllFiles");
      return [];
    },

    async getFile(path) {
      log("getFile", { path });
      return null;
    }
  });
}

// ============================================================================
//  ROUTE API — Required by aiEvolution
// ============================================================================
export function getRouteAPI({ trace = false } = {}) {
  const log = (msg, data) => trace && console.log(`[OrganismMap:routes] ${msg}`, data);

  return Object.freeze({
    async getRouteMap() {
      log("getRouteMap");
      return [];
    },

    async getRoute(routeId) {
      log("getRoute", { routeId });
      return null;
    }
  });
}

// ============================================================================
//  SCHEMA API — Required by aiEvolution
// ============================================================================
export function getSchemaAPI({ trace = false } = {}) {
  const log = (msg, data) => trace && console.log(`[OrganismMap:schema] ${msg}`, data);

  return Object.freeze({
    async getAllSchemas() {
      log("getAllSchemas");
      return [];
    },

    async getSchema(name) {
      log("getSchema", { name });
      return null;
    }
  });
}
export function prewarmLayer() {
  try {
    db = getDb({ trace: false });
    db.getCollection("prewarm");
    db.getDocument("prewarm", "id");

    fs = getFsAPI({ trace: false });
    fs.getAllFiles();
    fs.getFile("/prewarm");

    routes = getRouteAPI({ trace: false });
    routes.getRouteMap();
    routes.getRoute("prewarm");

    schema = getSchemaAPI({ trace: false });
    schema.getAllSchemas();
    schema.getSchema("prewarm");

    warmDualBand = {
      binary: { vitals: { snapshot: () => ({ load: 0, pressure: 0 }) } },
      symbolic: {
        personaEngine: { getActivePersona: () => "ARCHITECT" },
        boundariesEngine: { getMode: () => "safe" },
        permissionsEngine: { snapshot: () => ({ allow: true }) }
      }
    };

    return emitDepsPacket("prewarm", {
      message: "OrganismMap layer prewarmed and adapter pathways aligned."
    });
  } catch (err) {
    console.error("[Deps Prewarm] Failed:", err);
    return emitDepsPacket("prewarm-error", {
      error: String(err),
      message: "OrganismMap layer prewarm failed."
    });
  }
}

// -----------------------------------------------------------------------------
// Scan all PULSE-* systems and extract their organs
// -----------------------------------------------------------------------------
function scanPulseSystems(baseDir) {
  const entries = fs.readdirSync(baseDir, { withFileTypes: true });

  const pulseSystems = entries
    .filter(e => e.isDirectory() && e.name.startsWith("PULSE-"))
    .map(e => e.name);

  const systems = {};

  for (const system of pulseSystems) {
    const systemPath = path.join(baseDir, system);
    const files = fs.readdirSync(systemPath, { withFileTypes: true });

    const organs = files
      .filter(f => f.isFile() && f.name.endsWith(".js"))
      .map(f => f.name.replace(".js", ""));

    systems[system.toLowerCase()] = {
      root: system,
      organs
    };
  }

  return systems;
}

// -----------------------------------------------------------------------------
// Build the full organism map (v12.4+ / v13-EVO)
// -----------------------------------------------------------------------------
export function buildPulseOrganismMap(baseDir = aiDeps.getFsAPI()) {
  return {
    version: "12.4‑EVO‑SELF‑DESCRIBING‑ORGANISM",
    generatedAt: new Date().toISOString(),

    // The REAL organism: discovered from filesystem
    systems: scanPulseSystems(baseDir),

    // Lineage metadata (kept because it describes evolution, not structure)
    aliases: {
      base: {
        PulseBand: {
          old: ["PulseBand"],
          now: ["PulseOSSkinReflex","PulseOSSensoryCortex","PulseProxyImpulse"]
        },
        PulseNet: {
          old: ["PulseNet"],
          now: ["PulseSDN"]
        },
        PulseClient: {
          old: ["PulseClient"],
          now: ["PulseProxyImpulse","PulseProxySpine"]
        },
        PulseUpdate: {
          old: ["PulseUpdate"],
          now: ["PulseOSBrainEvolution","PulseIQ"]
        },
        PulseIdentity: {
          old: ["PulseIdentity"],
          now: ["PulseProxyBBB"]
        }
      },

      routing: {
        Router: {
          old: ["router.js","PulseRouter"],
          now: ["PulseRouterEvolutionaryThought"]
        },
        RouterMemory: {
          old: ["RouterMemory"],
          now: [
            "PulseOSShortTermMemory",
            "PulseOSTissueMembrane"
          ]
        },
        BackendEndpoint: {
          old: ["Endpoint"],
          now: ["PulseProxyOuterAgent"]
        },
        BackendRouter: {
          old: ["BackendRouter"],
          now: ["PulseProxySpine"]
        }
      },

      routeChain: {
        old: ["PulseBand","PulseNet","PulseClient","router.js","organ","PulseSend","backend"],
        now: [
          "PulseOSSkinReflex / PulseOSSensoryCortex",
          "PulseSDN",
          "PulseProxyImpulse",
          "PulseRouterEvolutionaryThought",
          "Organ (PulseOrganismMap)",
          "PulseSendSystem",
          "PulseProxySpine"
        ]
      },

      binaryRouteChain: {
        old: [],
        now: [
          "PulseOSSkinReflex / PulseOSSensoryCortex",
          "PulseSDN",
          "BinaryRouter-v12.3-PURE",
          "BinaryProxy-v12.3-PURE",
          "BinaryMesh-v12.3-PURE",
          "BinarySend-v12.3-PURE",
          "BinaryPulse-v12.3-PURE"
        ]
      }
    }
  };
}

// -----------------------------------------------------------------------------
// EXPORT: This IS the organism genome.
// -----------------------------------------------------------------------------
export const PulseOrganismMap = buildPulseOrganismMap();
