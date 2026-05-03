// ============================================================================
// PulseOrganismMap.js — v15‑EVO‑IMMORTAL
// THE JEWEL OF THE ORGANISM — THE GENOME
// ----------------------------------------------------------------------------
// LAWS OF THE ORGANISM:
//   • Any folder starting with "PULSE-" is a system.
//   • Any .js file inside that folder is an organ.
//   • No hardcoded clusters, organs, or pages.
//   • The filesystem IS the organism.
//   • The organism map IS the genome.
//   • All subsystems read from THIS file.
//   • ALL network fetch MUST go through Route API.
//   • Genome must NEVER fetch directly.
// ============================================================================

let fs = null;
let db = null;
let routes = null;
let schema = null;
// eslint-disable-next-line no-unused-vars
let fetchAPI = null;

// ============================================================================
// PREWARM LAYER — Aligns all adapters before organism boot
// ============================================================================
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

    fetchAPI = getFetchAPI({ trace: false, routes });

  } catch (err) {
    console.error("[OrganismMap:Prewarm] Failed:", err);
  }
}

// ============================================================================
// DATABASE API — Firestore/SQL/KV Compatible Adapter
// ============================================================================
export function getDb({ trace = false } = {}) {
  const log = (msg, data) => trace && console.log(`[aiDeps:db] ${msg}`, data);

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
// FILESYSTEM API — Required by aiEvolution
// ============================================================================
export function getFsAPI({ trace = false } = {}) {
  const log = (msg, data) => trace && console.log(`[aiDeps:fs] ${msg}`, data);

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
// ROUTE API — NOW FETCH‑AWARE (IMMORTAL v15)
// ============================================================================
export function getRouteAPI({ trace = false } = {}) {
  const log = (msg, data) => trace && console.log(`[aiDeps:routes] ${msg}`, data);

  return Object.freeze({
    async getRouteMap() {
      log("getRouteMap");
      return [];
    },

    async getRoute(routeId) {
      log("getRoute", { routeId });
      return null;
    },

    // NEW — resolve URL to route
    async resolve(url) {
      log("resolve", { url });

      // IMMORTAL: deterministic route resolution
      return {
        id: "default",
        target: url,
        method: "GET",
        meta: {
          layer: "PulseRouteAPI",
          role: "ROUTE_RESOLUTION",
          version: "15-EVO-IMMORTAL"
        }
      };
    },

    // NEW — perform fetch THROUGH the route
    async fetchThroughRoute(route, options = {}) {
      log("fetchThroughRoute", { route, options });

      try {
        const res = await fetch(route.target, {
          method: options.method || route.method || "GET",
          headers: options.headers || {},
          body: options.body || null,
          redirect: "follow",
          cache: "no-store"
        });

        const text = await res.text();

        return {
          ok: res.ok,
          status: res.status,
          statusText: res.statusText,
          url: res.url,
          headers: Object.fromEntries(res.headers.entries()),
          body: text
        };
      } catch (err) {
        return {
          ok: false,
          error: err?.message || "route_fetch_failed"
        };
      }
    }
  });
}


// ============================================================================
//  SCHEMA API — Required by aiEvolution
// ============================================================================
export function getSchemaAPI({ trace = false } = {}) {
  const log = (msg, data) => trace && console.log(`[aiDeps:schema] ${msg}`, data);

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

// ============================================================================
// FETCH API — ROUTE‑AWARE, IMMORTAL v15
// ============================================================================
export function getFetchAPI({ trace = false, routes } = {}) {
  const log = (msg, data) => trace && console.log(`[aiDeps:fetch] ${msg}`, data);

  const meta = {
    layer: "PulseFetchAPI",
    role: "NETWORK_ADAPTER",
    version: "15-EVO-IMMORTAL",
    evo: {
      deterministicField: true,
      unifiedAdvantageField: true,
      driftProof: true,
      multiInstanceReady: true,
      dualMode: true,
      binaryAware: true,
      symbolicAware: true,
      presenceAware: true,
      bandAware: true,
      zeroMutation: true,
      zeroExternalMutation: true,
      zeroRoutingInfluence: true,
      safeRouteFree: true
    }
  };

  async function fetchViaRoute(url, options = {}) {
    log("fetchViaRoute", { url, options });

    const route = await routes.resolve(url);
    const result = await routes.fetchThroughRoute(route, options);

    return { ...result, meta };
  }

  return Object.freeze({
    fetch: fetchViaRoute,
    meta
  });
}

// ============================================================================
// SCAN SYSTEMS — Pure FS API
// ============================================================================
async function scanPulseSystems() {
  fs = getFsAPI({ trace: false });

  const allFiles = await fs.getAllFiles();

  const pulseSystems = allFiles
    .filter(f => f.type === "dir" && f.name.startsWith("PULSE-"))
    .map(f => ({
      name: f.name,
      path: f.path
    }));

  const systems = {};

  for (const system of pulseSystems) {
    const systemFiles = allFiles.filter(f =>
      f.path.startsWith(system.path)
    );

    const organs = systemFiles
      .filter(f => f.type === "file" && f.name.endsWith(".js"))
      .map(f => f.name.replace(".js", ""));

    systems[system.name.toLowerCase()] = {
      root: system.name,
      organs
    };
  }

  return systems;
}

// ============================================================================
// BUILD ORGANISM MAP — The Genome
// ============================================================================
export async function buildPulseOrganismMap(baseDir = "/") {
  const systems = await scanPulseSystems(baseDir);

  return {
    version: "15‑EVO‑IMMORTAL‑GENOME",
    generatedAt: new Date().toISOString(),
    systems,

    adapters: {
      db: getDb({ trace: false }),
      fs: getFsAPI({ trace: false }),
      routes: getRouteAPI({ trace: false }),
      fetch: getFetchAPI({ trace: false, routes: getRouteAPI({ trace: false }) }),
      schema: getSchemaAPI({ trace: false })
    }
  };
}

// ============================================================================
// EXPORT — The Genome (async)
// ============================================================================
export const PulseOrganismMap = await buildPulseOrganismMap("/");
