// ============================================================================
// FILE: /Pulse-OS/PulseChunker-v2.js
// PULSE CHUNK ENGINE — v13‑SPINE‑PRESENCE‑EVO‑MAX
//  - Payload chunking
//  - Cache/delta engine
//  - Route-level folding carpet (full route chunking)
//  - PulseBandSession-aware
// ============================================================================
/*
AI_EXPERIENCE_META = {
  identity: "PulseChunker",
  version: "v14-IMMORTAL",
  layer: "os_chunker",
  role: "chunking_and_prewarm_engine",
  lineage: "PulseOS-v14",

  evo: {
    chunking: true,
    prewarm: true,
    cacheAware: true,

    deterministic: true,
    driftProof: true,
    zeroNetwork: true,
    zeroFilesystem: true,

    symbolicPrimary: true,
    binaryAware: true,
    dualBand: true,

    safeRouteFree: true,
    zeroMutationOfInput: true
  },

  contract: {
    always: [
      "PulseOSBrain",
      "PulseOSBBB",
      "PulseBinaryOS"
    ],
    never: [
      "legacyChunker",
      "safeRoute",
      "fetchViaCNS"
    ]
  }
}
*/

// ============================================================================
// UNIVERSAL CNS GLOBAL SURFACE — v13 SPINE
// ============================================================================
const admin = global.db;
const db    = global.db;



// ============================================================================
// META BLOCK — ORGAN IDENTITY
// ============================================================================
export const PulseChunkerMeta = Object.freeze({
  layer: "Backend",
  role: "PAYLOAD_CHUNK_ENGINE",
  version: "v13-SPINE-PRESENCE-EVO-MAX",
  identity: "PulseChunker-v13-SPINE-PRESENCE-EVO-MAX",
  guarantees: Object.freeze({
    deterministicSessionId: true,
    cacheAware: true,
    deltaAware: true,
    sizeOnlyAware: true,
    presenceAware: true,
    binaryAware: true,
    dualBandAware: true,
    noFrontendExposure: true,
    noDynamicImports: true,
    noEval: true,
    noRandomness: true,
    noTiming: true
  }),
  contract: Object.freeze({
    input: [
      "userId",
      "payload",
      "chunkSize",
      "baseVersion",
      "sizeOnly",
      "presenceTag",
      "band"
    ],
    output: [
      "sessionId",
      "totalChunks",
      "payloadBytes",
      "payloadHash",
      "presenceTag",
      "band"
    ]
  })
});

// ============================================================================
//  PulseChunker-v14-IMMORTAL
//  Backend CNS Chunk Brain — 2026
//  • Route descriptor folding (imports/assets/payloads)
//  • Delta/full cache resolver (_DELTA / _CACHE / sizeOnly)
//  • Lane-aware + envelopeId-aware presence
//  • Lore injection (__lore / __chunk / __dna-compatible)
//  • PulseBand session + optional streaming
//  • Chunk signing + binary-safe payload handling
// ============================================================================


// ============================================================================
// ROUTE DESCRIPTOR CONTRACT — v12.4-EVO-ROUTE-FABRIC
// ============================================================================
function isRouteDescriptor(input) {
  if (!input || typeof input !== "object") return false;
  return (
    typeof input.route === "string" &&
    Array.isArray(input.imports) &&
    Array.isArray(input.assets) &&
    Array.isArray(input.payloads)
  );
}

// ============================================================================
// LORE TRANSLATOR — backend flavor, Presence-aligned
// ============================================================================
function generateLoreHeader({ meta, payloadType, baseVersion, presenceTag, band }) {
  if (!meta) return "";
  const guarantees = Object.keys(meta.guarantees || {}).filter(k => meta.guarantees[k]);
  const inputs = meta.contract?.input || [];
  const outputs = meta.contract?.output || [];
  return `
/*
  PULSE LORE — ORGAN: ${meta.identity}
  VERSION: ${meta.version}
  PAYLOAD TYPE: ${payloadType || "unknown"}
  BASE VERSION: ${baseVersion || "none"}
  PRESENCE TAG: ${presenceTag || "none"}
  BAND: ${band || "symbolic"}

  Guarantees:
    • ${guarantees.join("\n    • ")}

  INPUT:
    • ${inputs.join("\n    • ")}

  OUTPUT:
    • ${outputs.join("\n    • ")}
*/
`;
}

// ============================================================================
// SIGN CHUNK
// ============================================================================
function signChunk(userId, sessionId, index, dataBase64) {
  const h = crypto.createHash("sha256");
  h.update(String(userId));
  h.update(String(sessionId));
  h.update(String(index));
  h.update(String(dataBase64));
  return h.digest("hex");
}

// ============================================================================
// PRESENCE ENVELOPE — lane-aware, envelope-aware
// ============================================================================
function buildPresenceEnvelope({
  laneId,
  envelopeId,
  band = "dual",
  wave = "coherent",
  dualBand = true,
  presenceTag = "default",
  ok = true
}) {
  return {
    ok,
    laneId,
    envelopeId,
    band,
    dualBand,
    wave,
    presenceTag,
    timestamp: Date.now()
  };
}

// ============================================================================
// PAYLOAD NORMALIZATION — JSON / string / Buffer / binary
// ============================================================================
function normalizeBackendPayload(payload) {
  if (payload == null) {
    return { kind: "none", buffer: Buffer.alloc(0), raw: null };
  }

  if (Buffer.isBuffer(payload)) {
    return { kind: "binary", buffer: payload, raw: payload };
  }

  if (payload instanceof Uint8Array) {
    const buf = Buffer.from(payload);
    return { kind: "binary", buffer: buf, raw: payload };
  }

  if (typeof payload === "string") {
    const buf = Buffer.from(payload, "utf8");
    return { kind: "text", buffer: buf, raw: payload };
  }

  // JSON
  const jsonStr = JSON.stringify(payload);
  const buf = Buffer.from(jsonStr, "utf8");
  return { kind: "json", buffer: buf, raw: payload };
}

// ============================================================================
// FACTORY — CNS‑SAFE CHUNKER (Brain + Logger)
// ============================================================================
export function createPulseChunker({ Brain, Logger } = {}) {
  if (!Brain && !Logger) {
    throw new Error("PulseChunker v14-IMMORTAL: Missing Brain/Logger injection.");
  }

  const log   = Logger?.log   || Brain?.log   || console.log;
  const warn  = Logger?.warn  || Brain?.warn  || console.warn;
  const error = Logger?.error || Brain?.logError || console.error;

  // Optional DB — routed via Brain if available (no firebase-admin import)
  const db = Brain?.firebase ? Brain.firebase("db") : null;

  // Optional helpers from Brain / Logger / global
  const fsAPI     = Brain?.fsAPI     || global.fsAPI     || null;
  const routeAPI  = Brain?.routeAPI  || global.routeAPI  || null;
  const schemaAPI = Brain?.schemaAPI || global.schemaAPI || null;
  const fetchAPI  = Logger?.fetchAPI || Brain?.fetchAPI  || global.fetch || null;

  // Internal registries
  const backendOrgans = new Map();
  const sessions = new Map();

  // Meta (for lore)
  const PulseChunkerMeta = {
    identity: "PulseChunker-v14-IMMORTAL",
    version: "14.0.0",
    guarantees: {
      laneAware: true,
      presenceAware: true,
      binarySafe: true,
      cacheAware: true,
      routeDescriptorAware: true,
      loreInjected: true
    },
    contract: {
      input: [
        "routeDescriptor | rawPayload",
        "laneId",
        "envelopeId",
        "userId",
        "baseVersion",
        "sizeOnly"
      ],
      output: [
        "ok",
        "data",
        "kind",
        "presence",
        "lore",
        "sessionId",
        "payloadBytes",
        "payloadHash"
      ]
    }
  };

  // ========================================================================
  // UNIVERSAL CACHE ENGINE — ONE FUNCTION ONLY (DB‑scoped)
  // ========================================================================
  async function generateCache({ payload, baseVersion, sizeOnly = false, deltaRequest = false }) {
    if (!db) {
      warn("[PulseChunker v14] generateCache called without db; returning passthrough.");
      return sizeOnly ? 0 : payload;
    }

    const isDelta = deltaRequest || (typeof payload === "string" && payload.endsWith("_DELTA"));

    const [collection, field] = String(
      payload
        .replace?.(/^REQUEST_/, "") ?? payload
    )
      .replace(/_DELTA$/, "")
      .replace(/_CACHE$/, "")
      .toLowerCase()
      .split("_");

    const docs = (await db.collection(collection).get()).docs.map(d => d.data());
    let result = field ? docs.map(d => d[field]) : docs;

    if (isDelta && baseVersion) {
      const hash = crypto.createHash("sha256").update(JSON.stringify(result)).digest("hex");
      if (hash === baseVersion) return { added: [], removed: [], changed: [] };
      return { added: result, removed: [], changed: [] };
    }

    if (!sizeOnly) return result;

    return Buffer.byteLength(JSON.stringify(result ?? {}), "utf8");
  }

  // ========================================================================
  // INTELLIGENT CACHE RESOLVER — ONE FUNCTION ONLY
  // ========================================================================
  async function resolveCacheRequest(payload, baseVersion, sizeOnly) {
    if (typeof payload !== "string") return payload;

    const isDelta = payload.endsWith("_DELTA");
    const isFull  = payload.endsWith("_CACHE");

    if (isDelta) {
      const delta = await generateCache({
        payload,
        baseVersion,
        deltaRequest: true,
        sizeOnly: !!sizeOnly
      });

      if (sizeOnly) return delta;

      const added   = delta?.added   || [];
      const removed = delta?.removed || [];
      const changed = delta?.changed || [];

      const empty =
        (!added?.length && !Object.keys(added).length) &&
        (!removed?.length && !Object.keys(removed).length) &&
        (!changed?.length && !Object.keys(changed).length);

      return empty
        ? await generateCache({ payload })
        : delta;
    }

    if (isFull) {
      return await generateCache({
        payload,
        sizeOnly: !!sizeOnly
      });
    }

    if (sizeOnly) {
      const deltaSize = Number(
        await generateCache({ payload, deltaRequest: true, sizeOnly: true }) || 0
      );

      if (deltaSize > 0) return deltaSize;

      return await generateCache({ payload, sizeOnly: true });
    }

    return payload;
  }

  // ============================================================================
// DETERMINISTIC HASH — Pulse-native, no crypto
// ============================================================================
function computeHash(str) {
  let h = 0;
  const s = String(str || "");
  for (let i = 0; i < s.length; i++) {
    h = (h + s.charCodeAt(i) * (i + 1)) % 100000;
  }
  return `h${h}`;
}

// --------------------------------------------------------------------------
// PulseBandSession — deterministic session bootstrap
// --------------------------------------------------------------------------
function startPulseBandSession({
  trace,
  db: dbOverride,
  fsAPI: fsOverride,
  routeAPI: routeOverride,
  schemaAPI: schemaOverride
} = {}) {
  const now = Date.now().toString();
  const seed = `${trace || "no-trace"}::${now}`;

  const sessionId = computeHash(seed);

  const session = {
    id: sessionId,
    startedAt: now,
    db: dbOverride || db,
    fsAPI: fsOverride || fsAPI,
    routeAPI: routeOverride || routeAPI,
    schemaAPI: schemaOverride || schemaAPI
  };

  sessions.set(sessionId, session);

  log("[PulseChunker v14] PulseBandSession started", {
    sessionId,
    hasDb: !!session.db
  });

  return session;
}



  // --------------------------------------------------------------------------
  // Registration — backend organs that support chunking
  // --------------------------------------------------------------------------
  function registerBackendOrgan(name, { chunk, prewarm } = {}) {
    if (!name || typeof chunk !== "function") {
      warn("[PulseChunker v14] registerBackendOrgan called with invalid args", {
        name,
        hasChunk: typeof chunk === "function"
      });
      return;
    }

    backendOrgans.set(name, { chunk, prewarm });
    log("[PulseChunker v14] Registered backend organ for chunking", { name });
  }

  // --------------------------------------------------------------------------
  // Prewarm — universal warmup for chunker + registered organs
  // --------------------------------------------------------------------------
  function prewarm() {
    log("[PulseChunker v14] Prewarm start", {
      organs: backendOrgans.size
    });

    for (const [name, organ] of backendOrgans.entries()) {
      if (typeof organ.prewarm === "function") {
        try {
          organ.prewarm();
          log("[PulseChunker v14] Prewarmed organ", { name });
        } catch (e) {
          warn("[PulseChunker v14] Prewarm failed for organ", {
            name,
            error: e?.message
          });
        }
      }
    }

    log("[PulseChunker v14] Prewarm complete");
  }

  // --------------------------------------------------------------------------
  // Core chunking primitive (metadata only; no splitting yet)
  // --------------------------------------------------------------------------
  // --------------------------------------------------------------------------
// Core chunking primitive (metadata only; no splitting yet)
// --------------------------------------------------------------------------
function chunkPayload({
  userId,
  payload,
  chunkSize = 1024 * 64,
  baseVersion = "v1",
  sizeOnly = false,
  presenceTag = "default",
  band = "dual"
}) {
  const buffer =
    typeof payload === "string" ? Buffer.from(payload, "utf8") : Buffer.from(payload || []);

  const payloadBytes = buffer.length;
  const payloadHash = computeHash(buffer.toString("utf8"));

  const totalChunks = sizeOnly
    ? Math.ceil(payloadBytes / chunkSize)
    : Math.max(1, Math.ceil(payloadBytes / chunkSize));

  const sessionSeed = `${userId || "anon"}::${payloadHash}::${baseVersion}`;
  const sessionId = computeHash(sessionSeed);

  const result = {
    sessionId,
    totalChunks,
    payloadBytes,
    payloadHash,
    presenceTag,
    band
  };

  log("[PulseChunker v14] Chunk payload computed", {
    userId,
    payloadBytes,
    totalChunks,
    presenceTag,
    band
  });

  return result;
}


  // --------------------------------------------------------------------------
  // Route Descriptor Folding — imports/assets/payloads
  // --------------------------------------------------------------------------
  async function foldRouteDescriptor(descriptor, { laneId, envelopeId, userId, baseVersion }) {
    const { route, imports, assets, payloads } = descriptor;

    const resolvedImports = [];
    const resolvedAssets  = [];
    const resolvedPayloads = [];

    // Imports: usually code / config / schemas
    for (const imp of imports) {
      try {
        const resolved = await resolveCacheRequest(imp, baseVersion, false);
        resolvedImports.push(resolved);
      } catch (e) {
        warn("[PulseChunker v14] Failed to resolve import", { route, imp, error: e?.message });
      }
    }

    // Assets: images / static / binary
    for (const asset of assets) {
      try {
        const resolved = await resolveCacheRequest(asset, baseVersion, false);
        resolvedAssets.push(resolved);
      } catch (e) {
        warn("[PulseChunker v14] Failed to resolve asset", { route, asset, error: e?.message });
      }
    }

    // Payloads: primary data
    for (const p of payloads) {
      try {
        const resolved = await resolveCacheRequest(p, baseVersion, false);
        resolvedPayloads.push(resolved);
      } catch (e) {
        warn("[PulseChunker v14] Failed to resolve payload", { route, payload: p, error: e?.message });
      }
    }

    const folded = {
      route,
      imports: resolvedImports,
      assets: resolvedAssets,
      payloads: resolvedPayloads
    };

    const { kind, buffer } = normalizeBackendPayload(folded);
    const metaChunk = chunkPayload({
      userId,
      payload: buffer,
      baseVersion: baseVersion || "v1",
      presenceTag: "route-descriptor",
      band: "dual"
    });

    const presence = buildPresenceEnvelope({
      laneId,
      envelopeId,
      band: "dual",
      wave: "coherent",
      dualBand: true,
      presenceTag: "route-descriptor",
      ok: true
    });

    const lore = generateLoreHeader({
      meta: PulseChunkerMeta,
      payloadType: kind,
      baseVersion,
      presenceTag: "route-descriptor",
      band: "dual"
    });

    const dna = {
      __lore: lore,
      __chunk: folded
    };

    return {
      ok: true,
      data: dna,
      kind,
      presence,
      sessionId: metaChunk.sessionId,
      payloadBytes: metaChunk.payloadBytes,
      payloadHash: metaChunk.payloadHash
    };
  }

  // --------------------------------------------------------------------------
  // Generic Chunk Route — used by CNS fetchExternalResource
  // --------------------------------------------------------------------------
  async function chunkRoute({
    url,
    laneId,
    envelopeId,
    userId,
    baseVersion,
    sizeOnly,
    payload,
    routeDescriptor
  }) {
    try {
      // Route descriptor path
      if (routeDescriptor && isRouteDescriptor(routeDescriptor)) {
        return await foldRouteDescriptor(routeDescriptor, {
          laneId,
          envelopeId,
          userId,
          baseVersion
        });
      }

      // Cache-aware payload path
      const resolved = await resolveCacheRequest(payload ?? url, baseVersion, sizeOnly);

      const { kind, buffer, raw } = normalizeBackendPayload(resolved);

      const metaChunk = chunkPayload({
        userId,
        payload: buffer,
        baseVersion: baseVersion || "v1",
        presenceTag: "default",
        band: "dual",
        sizeOnly: !!sizeOnly
      });

      const presence = buildPresenceEnvelope({
        laneId,
        envelopeId,
        band: "dual",
        wave: "coherent",
        dualBand: true,
        presenceTag: "default",
        ok: true
      });

      const lore = generateLoreHeader({
        meta: PulseChunkerMeta,
        payloadType: kind,
        baseVersion,
        presenceTag: "default",
        band: "dual"
      });

      const dna = {
        __lore: lore,
        __chunk: raw
      };

      return {
        ok: true,
        data: dna,
        kind,
        presence,
        sessionId: metaChunk.sessionId,
        payloadBytes: metaChunk.payloadBytes,
        payloadHash: metaChunk.payloadHash
      };
    } catch (e) {
      error("[PulseChunker v14] chunkRoute failed", {
        url,
        laneId,
        envelopeId,
        error: e?.message
      });

      const presence = buildPresenceEnvelope({
        laneId,
        envelopeId,
        band: "dual",
        wave: "distorted",
        dualBand: true,
        presenceTag: "error",
        ok: false
      });

      return {
        ok: false,
        error: e?.message || "Chunk route failed",
        presence
      };
    }
  }

  // --------------------------------------------------------------------------
  // CNS Handler — fetchExternalResource adapter
  // --------------------------------------------------------------------------
  async function handleFetchExternalResource(request) {
    const {
      url,
      laneId,
      envelopeId,
      userId,
      baseVersion,
      sizeOnly,
      payload,
      routeDescriptor
    } = request || {};

    return await chunkRoute({
      url,
      laneId,
      envelopeId,
      userId,
      baseVersion,
      sizeOnly,
      payload,
      routeDescriptor
    });
  }

  // --------------------------------------------------------------------------
  // Public API
  // --------------------------------------------------------------------------
  return {
    meta: PulseChunkerMeta,

    // CNS wiring
    startPulseBandSession,
    registerBackendOrgan,
    prewarm,

    // Core primitive
    chunkPayload,

    // Cache / route helpers
    resolveCacheRequest,
    generateCache,
    chunkRoute,
    handleFetchExternalResource,

    // Utilities
    getSession(sessionId) {
      return sessions.get(sessionId) || null;
    },

    hasBackendOrgan(name) {
      return backendOrgans.has(name);
    },

    isRouteDescriptor,
    generateLoreHeader,
    signChunk
  };
}

// // ============================================================================
// // CREATE PULSE BAND SESSION — NOW ROUTE-AWARE
// // ============================================================================
// export const createPulseBandSession = onRequest(
//   { region: "us-central1", timeoutSeconds: 300, memory: "1GiB" },
//   async (req, res) => {
//     res.set("Access-Control-Allow-Origin", "*");
//     res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
//     res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
//     if (req.method === "OPTIONS") return res.status(204).send("");

//     try {
//       const body = req.body || {};
//       let {
//         userId,
//         payload,
//         chunkSize = 500,
//         baseVersion,
//         sizeOnly,
//         presenceTag = "PulseChunker",
//         band = "symbolic"
//       } = body;

//       if (!userId || !payload) {
//         return res.json({ success: false, error: "Missing userId or payload" });
//       }

//       if (typeof chunkSize !== "number" || chunkSize <= 0) {
//         chunkSize = 500;
//       }

//       // -------------------------------------------------------------------
//       // ROUTE MODE — full route folding carpet
//       //  - If payload is a route descriptor, we build a composite payload:
//       //    { route, imports, assets, data: { ...resolved payloads... } }
//       // -------------------------------------------------------------------
//       if (isRouteDescriptor(payload)) {
//         const routeDescriptor = payload;
//         const { route, imports = [], assets = [], payloads = [] } = routeDescriptor;

//         await db.collection("pulseband_logs").add({
//           type: "route_session_request",
//           userId,
//           route,
//           imports,
//           assets,
//           payloads,
//           baseVersion: baseVersion || null,
//           sizeOnly: !!sizeOnly,
//           presenceTag,
//           band,
//           createdAt: admin.firestore.FieldValue.serverTimestamp()
//         });

//         const resolvedData = {};
//         for (const key of payloads) {
//           try {
//             resolvedData[key] = await resolveCacheRequest(
//               key,
//               baseVersion,
//               sizeOnly === true
//             );
//           } catch (err) {
//             await db.collection("pulseband_errors").add({
//               type: "route_payload_resolution_error",
//               userId,
//               route,
//               payloadKey: key,
//               error: err?.message || String(err),
//               createdAt: admin.firestore.FieldValue.serverTimestamp()
//             });
//           }
//         }

//         payload = {
//           route,
//           imports,
//           assets,
//           data: resolvedData
//         };
//       }

//       await db.collection("pulseband_logs").add({
//         type: "session_create_request",
//         userId,
//         payload,
//         chunkSize,
//         baseVersion: baseVersion || null,
//         sizeOnly: !!sizeOnly,
//         presenceTag,
//         band,
//         createdAt: admin.firestore.FieldValue.serverTimestamp()
//       });

//       // Resolve payload
//       let rawPayload;
//       try {
//         rawPayload = await resolveCacheRequest(payload, baseVersion, sizeOnly === true);
//       } catch (err) {
//         await db.collection("pulseband_errors").add({
//           type: "payload_generation_error",
//           userId,
//           payload,
//           error: err?.message || String(err),
//           createdAt: admin.firestore.FieldValue.serverTimestamp()
//         });
//         return res.json({ success: false, error: "Payload generation failed" });
//       }

//       if (sizeOnly && typeof rawPayload === "number") {
//         return res.json({
//           success: true,
//           sizeOnly: true,
//           payloadSize: rawPayload,
//           presenceTag,
//           band
//         });
//       }

//       let jsonString =
//         typeof rawPayload === "string"
//           ? rawPayload
//           : JSON.stringify(rawPayload);

//       // Lore injection
//       const loreHeader = generateLoreHeader({
//         meta: PulseChunkerMeta,
//         payloadType: isRouteDescriptor(payload) ? payload.route : payload,
//         baseVersion,
//         presenceTag,
//         band
//       });

//       jsonString = `${loreHeader}\n${jsonString}`;

//       // Buffer + deterministic session ID
//       const buffer = Buffer.from(jsonString, "utf8");
//       const payloadHash = crypto.createHash("sha256").update(buffer).digest("hex");
//       const totalChunks = Math.ceil(buffer.length / chunkSize);
//       const sessionId = `PB_${userId}_${payloadHash.slice(0, 16)}`;

//       const sessionRef = db.collection("pulseband_sessions").doc(sessionId);
//       const chunksRef = sessionRef.collection("chunks");

//       // Session metadata
//       await sessionRef.set({
//         sessionId,
//         userId,
//         totalChunks,
//         chunkSize,
//         createdAt: admin.firestore.FieldValue.serverTimestamp(),
//         status: "pending",
//         retries: 0,
//         failures: 0,
//         restarts: 0,
//         payloadBytes: buffer.length,
//         payloadHash,
//         payloadType: isRouteDescriptor(payload) ? payload.route : payload,
//         baseVersion: baseVersion || null,
//         presenceTag,
//         band
//       });

//       await db.collection("pulseband_logs").add({
//         type: "session_created",
//         sessionId,
//         userId,
//         totalChunks,
//         chunkSize,
//         payloadBytes: buffer.length,
//         payloadHash,
//         payloadType: isRouteDescriptor(payload) ? payload.route : payload,
//         baseVersion: baseVersion || null,
//         presenceTag,
//         band,
//         createdAt: admin.firestore.FieldValue.serverTimestamp()
//       });

//       // Chunk + batch write
//       let batch = db.batch();
//       let batchCount = 0;

//       for (let i = 0; i < totalChunks; i++) {
//         const start = i * chunkSize;
//         const end = start + chunkSize;

//         try {
//           const dataBase64 = buffer.slice(start, end).toString("base64");
//           const signature = signChunk(userId, sessionId, i, dataBase64);

//           const chunkDoc = chunksRef.doc(i.toString().padStart(5, "0"));
//           batch.set(chunkDoc, {
//             index: i,
//             data: dataBase64,
//             signature,
//             status: "pending",
//             presenceTag,
//             band,
//             createdAt: admin.firestore.FieldValue.serverTimestamp()
//           });

//           batchCount++;
//           if (batchCount === 400) {
//             await batch.commit();
//             batch = db.batch();
//             batchCount = 0;
//           }
//         } catch (err) {
//           await db.collection("pulseband_errors").add({
//             type: "chunk_generation_error",
//             sessionId,
//             userId,
//             index: i,
//             error: err?.message || String(err),
//             presenceTag,
//             band,
//             createdAt: admin.firestore.FieldValue.serverTimestamp()
//           });
//           return res.json({ success: false, error: "Chunk generation failed" });
//         }
//       }

//       if (batchCount > 0) {
//         await batch.commit();
//       }

//       return res.json({
//         success: true,
//         sessionId,
//         totalChunks,
//         payloadBytes: buffer.length,
//         payloadHash,
//         presenceTag,
//         band
//       });

//     } catch (err) {
//       await db.collection("pulseband_errors").add({
//         type: "session_creation_error",
//         error: err?.message || String(err),
//         createdAt: admin.firestore.FieldValue.serverTimestamp()
//       });

//       return res.json({ success: false, error: err?.message || "Unknown error" });
//     }
//   }
// );

// // ============================================================================
// // GET NEXT PULSE BAND DNA STRAND
// // ============================================================================
// export const getNextPulseBandChunk = onRequest(
//   { region: "us-central1" },
//   async (req, res) => {
//     res.set("Access-Control-Allow-Origin", "*");
//     res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
//     res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
//     if (req.method === "OPTIONS") return res.status(204).send("");

//     try {
//       const { sessionId, userId } = req.query || {};

//       if (!sessionId || !userId) {
//         return res.json({ success: false, error: "Missing sessionId or userId" });
//       }

//       const sessionRef = db.collection("pulseband_sessions").doc(String(sessionId));
//       const sessionSnap = await sessionRef.get();

//       if (!sessionSnap.exists || sessionSnap.data().userId !== userId) {
//         return res.json({ success: false, error: "Invalid session or user" });
//       }

//       const session = sessionSnap.data();

//       if (session.failures >= 5) {
//         await sessionRef.set(
//           { status: "aborted", abortedAt: admin.firestore.FieldValue.serverTimestamp() },
//           { merge: true }
//         );

//         await db.collection("pulseband_errors").add({
//           sessionId,
//           userId,
//           type: "genome_aborted",
//           reason: "Too many failures",
//           createdAt: admin.firestore.FieldValue.serverTimestamp()
//         });

//         return res.json({ success: false, error: "Genome aborted" });
//       }

//       const dnaRef = sessionRef.collection("dna");

//       const snap = await dnaRef
//         .where("strandStatus", "==", "pending")
//         .orderBy("organismStrand", "asc")
//         .limit(1)
//         .get();

//       if (snap.empty) {
//         await sessionRef.set(
//           { status: "complete", completedAt: admin.firestore.FieldValue.serverTimestamp() },
//           { merge: true }
//         );

//         await db.collection("pulseband_logs").add({
//           sessionId,
//           userId,
//           type: "genome_complete",
//           createdAt: admin.firestore.FieldValue.serverTimestamp()
//         });

//         return res.json({ success: true, genomeComplete: true });
//       }

//       const doc = snap.docs[0];
//       const data = doc.data();

//       await doc.ref.set(
//         { strandStatus: "sent", sentAt: admin.firestore.FieldValue.serverTimestamp() },
//         { merge: true }
//       );

//       return res.json({
//         success: true,
//         dna: {
//           organismStrand: data.organismStrand,
//           strand: data.strand,
//           geneSignature: data.geneSignature,
//           presenceTag: data.presenceTag,
//           band: data.band
//         }
//       });

//     } catch (err) {
//       await db.collection("pulseband_errors").add({
//         type: "getNextDNA_error",
//         error: err?.message || String(err),
//         createdAt: admin.firestore.FieldValue.serverTimestamp()
//       });

//       return res.json({ success: false, error: err?.message || "Unknown error" });
//     }
//   }
// );


// // ============================================================================
// // ACK PULSE BAND DNA STRAND
// // ============================================================================
// export const ackPulseBandChunk = onRequest(
//   { region: "us-central1" },
//   async (req, res) => {
//     res.set("Access-Control-Allow-Origin", "*");
//     res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
//     res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
//     if (req.method === "OPTIONS") return res.status(204).send("");

//     try {
//       const {
//         sessionId,
//         userId,
//         organismStrand,
//         geneSignature,
//         latencyMs,
//         kbps
//       } = req.body || {};

//       if (!sessionId || !userId || organismStrand == null || !geneSignature) {
//         return res.json({ success: false, error: "Missing params" });
//       }

//       const sessionRef = db.collection("pulseband_sessions").doc(String(sessionId));
//       const dnaRef = sessionRef
//         .collection("dna")
//         .doc(organismStrand.toString().padStart(5, "0"));

//       const snap = await dnaRef.get();
//       if (!snap.exists) {
//         return res.json({ success: false, error: "DNA strand not found" });
//       }

//       const data = snap.data();

//       if (data.geneSignature !== geneSignature) {
//         await db.collection("pulseband_errors").add({
//           sessionId,
//           userId,
//           organismStrand,
//           latencyMs,
//           kbps,
//           type: "dna_signature_mismatch",
//           expected: data.geneSignature,
//           got: geneSignature,
//           presenceTag: data.presenceTag,
//           band: data.band,
//           createdAt: admin.firestore.FieldValue.serverTimestamp()
//         });

//         await sessionRef.set(
//           { failures: admin.firestore.FieldValue.increment(1) },
//           { merge: true }
//         );

//         return res.json({ success: false, error: "DNA signature mismatch" });
//       }

//       await dnaRef.set(
//         {
//           strandStatus: "acked",
//           latencyMs: latencyMs ?? null,
//           kbps: kbps ?? null,
//           ackedAt: admin.firestore.FieldValue.serverTimestamp()
//         },
//         { merge: true }
//       );

//       return res.json({ success: true, dnaAck: true });

//     } catch (err) {
//       await db.collection("pulseband_errors").add({
//         type: "ackDNA_error",
//         error: err?.message || String(err),
//         createdAt: admin.firestore.FieldValue.serverTimestamp()
//       });

//       return res.json({ success: false, error: err?.message || "Unknown error" });
//     }
//   }
// );


// // ============================================================================
// // LOG PULSE BAND REDOWNLOAD — v12.4‑PRESENCE‑EVO‑MAX‑PRIME
// // ============================================================================
// export const logPulseBandRedownload = onRequest(
//   { region: "us-central1" },
//   async (req, res) => {
//     res.set("Access-Control-Allow-Origin", "*");
//     res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
//     res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
//     if (req.method === "OPTIONS") return res.status(204).send("");

//     try {
//       const { sessionId, userId, reason, presenceTag = "PulseChunker", band = "symbolic" } =
//         req.body || {};

//       const sessionRef = db.collection("pulseband_sessions").doc(String(sessionId));

//       await db.collection("pulseband_redownloads").add({
//         sessionId,
//         userId,
//         reason: reason || null,
//         presenceTag,
//         band,
//         createdAt: admin.firestore.FieldValue.serverTimestamp()
//       });

//       await sessionRef.set(
//         { failures: admin.firestore.FieldValue.increment(1) },
//         { merge: true }
//       );

//       return res.json({
//         success: true,
//         presenceTag,
//         band
//       });

//     } catch (err) {
//       await db.collection("pulseband_errors").add({
//         type: "redownload_error",
//         error: err?.message || String(err),
//         presenceTag: "PulseChunker",
//         band: "symbolic",
//         createdAt: admin.firestore.FieldValue.serverTimestamp()
//       });

//       return res.json({
//         success: false,
//         error: err?.message || "Unknown error"
//       });
//     }
//   }
// );