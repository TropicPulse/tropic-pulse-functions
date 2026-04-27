// ============================================================================
// FILE: /BACKEND/PulseChunker-v12-Evo.js
// PULSE CHUNKER — v12-Evo
// "BACKEND PAYLOAD CHUNK ENGINE • CACHE INTELLIGENCE • DELTA / FULL / SIZE"
// ============================================================================
//
// ROLE (v12-Evo):
// ---------------
// • Backend-only payload chunker (NEVER exposed to frontend / browser).
// • Creates PulseBand-style chunk sessions for large JSON payloads.
// • Intelligent cache resolver: FULL / DELTA / SIZE-ONLY.
// • Centralized generator registry for all cache types.
// • Deterministic session IDs (no Date.now in ID).
// • Firestore-backed session + chunk metadata.
// • Pure backend organ — no DOM, no browser, no OS imports.
//
// SAFETY CONTRACT (v12-Evo):
// --------------------------
// • No frontend imports, no bundler exposure, no public hosting.
// • No dynamic imports, no eval.
// • No timestamps in IDs (Date.now only for logging / freshness).
// • Deterministic session identity via payload hash.
// • All external effects go through Firestore (db) only.
// ============================================================================

import * as admin from "firebase-admin";
import * as crypto from "crypto";
import { onRequest } from "firebase-functions/v2/https";

const db = admin.firestore();

// ============================================================================
// META BLOCK — ORGAN IDENTITY
// ============================================================================
export const PulseChunkerMeta = Object.freeze({
  layer: "Backend",
  role: "PAYLOAD_CHUNK_ENGINE",
  version: "v12-Evo",
  identity: "PulseChunker-v12-Evo",
  guarantees: Object.freeze({
    deterministicSessionId: true,
    cacheAware: true,
    deltaAware: true,
    sizeOnlyAware: true,
    noFrontendExposure: true,
    noDynamicImports: true,
    noEval: true
  }),
  contract: Object.freeze({
    input: [
      "userId",
      "payload",
      "chunkSize",
      "baseVersion",
      "sizeOnly"
    ],
    output: [
      "sessionId",
      "totalChunks",
      "payloadBytes",
      "payloadHash"
    ]
  })
});

// ============================================================================
// CENTRAL GENERATOR REGISTRY
// ============================================================================
// NOTE: these generator functions must be defined/imported in this backend
// context only. They are NEVER imported by frontend code.
const CacheGenerators = {
  REQUEST_USERS_CACHE: generateUsersCache,
  REQUEST_USERS_CACHE_DELTA: generateUsersCache,

  REQUEST_BUSINESS_CACHE: generateBusinessesCache,
  REQUEST_BUSINESS_CACHE_DELTA: generateBusinessesCache,

  REQUEST_EVENTS_CACHE: generateEventsCache,
  REQUEST_EVENTS_CACHE_DELTA: generateEventsCache,

  REQUEST_ORDERS_CACHE: generateOrdersCache,
  REQUEST_ORDERS_CACHE_DELTA: generateOrdersCache,

  REQUEST_LOYALTY_CACHE: generateLoyaltyCache,
  REQUEST_LOYALTY_CACHE_DELTA: generateLoyaltyCache,

  REQUEST_HISTORY_CACHE: generateHistoryCache,
  REQUEST_HISTORY_CACHE_DELTA: generateHistoryCache,

  REQUEST_SETTINGS_CACHE: generateSettingsCache,
  REQUEST_SETTINGS_CACHE_DELTA: generateSettingsCache
};

// ============================================================================
// INTELLIGENT CACHE RESOLVER (FULL / DELTA / SIZE)
// ============================================================================
async function resolveCacheRequest(payload, baseVersion, sizeOnly) {
  if (typeof payload !== "string") return payload;

  const isDelta = payload.endsWith("_DELTA");
  const isFull = payload.endsWith("_CACHE");

  const fn = CacheGenerators[payload];
  if (!fn) return payload; // raw fallback

  // -------------------------------------------------------
  // 1. DELTA REQUESTS
  // -------------------------------------------------------
  if (isDelta) {
    // Missing baseVersion → fallback to full
    if (!baseVersion) {
      return sizeOnly
        ? await fn({ sizeOnly: true })
        : await fn();
    }

    const delta = await fn({ deltaRequest: true, sizeOnly: !!sizeOnly });

    if (sizeOnly) return delta;

    const added = delta?.added || [];
    const removed = delta?.removed || [];
    const changed = delta?.changed || [];

    const addedEmpty =
      (Array.isArray(added) && added.length === 0) ||
      (typeof added === "object" && !Array.isArray(added) && Object.keys(added).length === 0);

    const removedEmpty =
      (Array.isArray(removed) && removed.length === 0) ||
      (typeof removed === "object" && !Array.isArray(removed) && Object.keys(removed).length === 0);

    const changedEmpty =
      (Array.isArray(changed) && changed.length === 0) ||
      (typeof changed === "object" && !Array.isArray(changed) && Object.keys(changed).length === 0);

    const isEmpty = addedEmpty && removedEmpty && changedEmpty;

    if (isEmpty) {
      // No meaningful delta → fallback to full
      return await fn();
    }

    return delta;
  }

  // -------------------------------------------------------
  // 2. FULL REQUESTS
  // -------------------------------------------------------
  if (isFull) {
    return sizeOnly
      ? await fn({ sizeOnly: true })
      : await fn();
  }

  // -------------------------------------------------------
  // 3. SIZE ONLY (no delta/full specified)
  // -------------------------------------------------------
  if (sizeOnly) {
    // Try delta size first
    const deltaSizeRaw = await fn({ deltaRequest: true, sizeOnly: true });
    const deltaSize = Number(deltaSizeRaw || 0);

    if (deltaSize > 0) return deltaSize;

    // Fallback to full size
    return await fn({ sizeOnly: true });
  }

  // -------------------------------------------------------
  // 4. RAW PAYLOAD
  // -------------------------------------------------------
  return payload;
}

// ============================================================================
// HELPER: SIGN CHUNK
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
// CREATE PULSE BAND SESSION — MAIN ENTRY
// ============================================================================
export const createPulseBandSession = onRequest(
  { region: "us-central1", timeoutSeconds: 300, memory: "1GiB" },
  async (req, res) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    if (req.method === "OPTIONS") return res.status(204).send("");

    try {
      const body = req.body || {};
      let {
        userId,
        payload,
        chunkSize = 500,
        baseVersion,
        sizeOnly
      } = body;

      if (!userId || !payload) {
        return res.json({ success: false, error: "Missing userId or payload" });
      }

      if (typeof chunkSize !== "number" || chunkSize <= 0) {
        chunkSize = 500;
      }

      // Log session creation request
      await db.collection("pulseband_logs").add({
        type: "session_create_request",
        userId,
        payload,
        chunkSize,
        baseVersion: baseVersion || null,
        sizeOnly: !!sizeOnly,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

      // -------------------------------------------------------
      // 1. Resolve payload intelligently
      // -------------------------------------------------------
      let rawPayload;
      try {
        rawPayload = await resolveCacheRequest(payload, baseVersion, sizeOnly === true);
      } catch (err) {
        await db.collection("pulseband_errors").add({
          type: "payload_generation_error",
          userId,
          payload,
          error: err?.message || String(err),
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
        return res.json({ success: false, error: "Payload generation failed" });
      }

      // Size-only fast path when generator returns numeric size
      if (sizeOnly && typeof rawPayload === "number") {
        return res.json({
          success: true,
          sizeOnly: true,
          payloadSize: rawPayload
        });
      }

      const jsonString =
        typeof rawPayload === "string"
          ? rawPayload
          : JSON.stringify(rawPayload);

      // -------------------------------------------------------
      // 2. Convert payload to buffer + deterministic session ID
      // -------------------------------------------------------
      const buffer = Buffer.from(jsonString, "utf8");
      const payloadHash = crypto
        .createHash("sha256")
        .update(buffer)
        .digest("hex");

      const totalChunks = Math.ceil(buffer.length / chunkSize);

      // Deterministic sessionId (no Date.now in ID)
      const sessionId = `PB_${userId}_${payloadHash.slice(0, 16)}`;

      const sessionRef = db.collection("pulseband_sessions").doc(sessionId);
      const chunksRef = sessionRef.collection("chunks");

      // -------------------------------------------------------
      // 3. Create session metadata
      // -------------------------------------------------------
      await sessionRef.set({
        sessionId,
        userId,
        totalChunks,
        chunkSize,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        status: "pending",
        retries: 0,
        failures: 0,
        restarts: 0,
        payloadBytes: buffer.length,
        payloadHash,
        payloadType: payload,
        baseVersion: baseVersion || null
      });

      await db.collection("pulseband_logs").add({
        type: "session_created",
        sessionId,
        userId,
        totalChunks,
        chunkSize,
        payloadBytes: buffer.length,
        payloadHash,
        payloadType: payload,
        baseVersion: baseVersion || null,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

      // -------------------------------------------------------
      // 4. Chunk + batch write
      // -------------------------------------------------------
      let batch = db.batch();
      let batchCount = 0;

      for (let i = 0; i < totalChunks; i++) {
        const start = i * chunkSize;
        const end = start + chunkSize;

        try {
          const dataBase64 = buffer.slice(start, end).toString("base64");
          const signature = signChunk(userId, sessionId, i, dataBase64);

          const chunkDoc = chunksRef.doc(i.toString().padStart(5, "0"));
          batch.set(chunkDoc, {
            index: i,
            data: dataBase64,
            signature,
            status: "pending",
            createdAt: admin.firestore.FieldValue.serverTimestamp()
          });

          batchCount++;
          if (batchCount === 400) {
            await batch.commit();
            batch = db.batch();
            batchCount = 0;
          }
        } catch (err) {
          await db.collection("pulseband_errors").add({
            type: "chunk_generation_error",
            sessionId,
            userId,
            index: i,
            error: err?.message || String(err),
            createdAt: admin.firestore.FieldValue.serverTimestamp()
          });
          return res.json({ success: false, error: "Chunk generation failed" });
        }
      }

      if (batchCount > 0) {
        await batch.commit();
      }

      // -------------------------------------------------------
      // 5. Return session info
      // -------------------------------------------------------
      return res.json({
        success: true,
        sessionId,
        totalChunks,
        payloadBytes: buffer.length,
        payloadHash
      });

    } catch (err) {
      await db.collection("pulseband_errors").add({
        type: "session_creation_error",
        error: err?.message || String(err),
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

      return res.json({ success: false, error: err?.message || "Unknown error" });
    }
  }
);

// ============================================================================
// GET NEXT PULSE BAND CHUNK
// ============================================================================
export const getNextPulseBandChunk = onRequest(
  { region: "us-central1" },
  async (req, res) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    if (req.method === "OPTIONS") return res.status(204).send("");

    try {
      const { sessionId, userId } = req.query || {};

      if (!sessionId || !userId) {
        return res.json({ success: false, error: "Missing sessionId or userId" });
      }

      const sessionRef = db.collection("pulseband_sessions").doc(String(sessionId));
      const sessionSnap = await sessionRef.get();

      if (!sessionSnap.exists || sessionSnap.data().userId !== userId) {
        return res.json({ success: false, error: "Invalid session or user" });
      }

      const session = sessionSnap.data();

      // Too many failures → abort session
      if (session.failures >= 5) {
        await sessionRef.set(
          { status: "aborted", abortedAt: admin.firestore.FieldValue.serverTimestamp() },
          { merge: true }
        );

        await db.collection("pulseband_errors").add({
          sessionId,
          userId,
          type: "session_aborted",
          reason: "Too many failures",
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        return res.json({ success: false, error: "Session aborted" });
      }

      const chunksRef = sessionRef.collection("chunks");

      const snap = await chunksRef
        .where("status", "==", "pending")
        .orderBy("index", "asc")
        .limit(1)
        .get();

      // No pending chunks → complete
      if (snap.empty) {
        await sessionRef.set(
          { status: "complete", completedAt: admin.firestore.FieldValue.serverTimestamp() },
          { merge: true }
        );

        await db.collection("pulseband_logs").add({
          sessionId,
          userId,
          type: "session_complete",
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        return res.json({ success: true, done: true });
      }

      const doc = snap.docs[0];
      const data = doc.data();

      // Mark as sent
      await doc.ref.set(
        { status: "sent", sentAt: admin.firestore.FieldValue.serverTimestamp() },
        { merge: true }
      );

      return res.json({
        success: true,
        chunk: {
          index: data.index,
          data: data.data,
          signature: data.signature
        }
      });

    } catch (err) {
      await db.collection("pulseband_errors").add({
        type: "getNextChunk_error",
        error: err?.message || String(err),
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

      return res.json({ success: false, error: err?.message || "Unknown error" });
    }
  }
);

// ============================================================================
// ACK PULSE BAND CHUNK
// ============================================================================
export const ackPulseBandChunk = onRequest(
  { region: "us-central1" },
  async (req, res) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    if (req.method === "OPTIONS") return res.status(204).send("");

    try {
      const {
        sessionId,
        userId,
        index,
        signature,
        latencyMs,
        kbps
      } = req.body || {};

      if (!sessionId || !userId || index == null || !signature) {
        return res.json({ success: false, error: "Missing params" });
      }

      const sessionRef = db.collection("pulseband_sessions").doc(String(sessionId));
      const chunkRef = sessionRef
        .collection("chunks")
        .doc(index.toString().padStart(5, "0"));

      const snap = await chunkRef.get();
      if (!snap.exists) {
        return res.json({ success: false, error: "Chunk not found" });
      }

      const data = snap.data();

      // Signature mismatch = corrupted chunk
      if (data.signature !== signature) {
        await db.collection("pulseband_errors").add({
          sessionId,
          userId,
          index,
          latencyMs,
          kbps,
          type: "signature_mismatch",
          expected: data.signature,
          got: signature,
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        // Increment session failure count
        await sessionRef.set(
          { failures: admin.firestore.FieldValue.increment(1) },
          { merge: true }
        );

        return res.json({ success: false, error: "Signature mismatch" });
      }

      // Mark chunk as acked
      await chunkRef.set(
        {
          status: "acked",
          latencyMs: latencyMs ?? null,
          kbps: kbps ?? null,
          ackedAt: admin.firestore.FieldValue.serverTimestamp()
        },
        { merge: true }
      );

      return res.json({ success: true });

    } catch (err) {
      await db.collection("pulseband_errors").add({
        type: "ackChunk_error",
        error: err?.message || String(err),
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

      return res.json({ success: false, error: err?.message || "Unknown error" });
    }
  }
);

// ============================================================================
// LOG PULSE BAND REDOWNLOAD
// ============================================================================
export const logPulseBandRedownload = onRequest(
  { region: "us-central1" },
  async (req, res) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    if (req.method === "OPTIONS") return res.status(204).send("");

    try {
      const { sessionId, userId, reason } = req.body || {};

      const sessionRef = db.collection("pulseband_sessions").doc(String(sessionId));

      await db.collection("pulseband_redownloads").add({
        sessionId,
        userId,
        reason: reason || null,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

      // Track redownloads as failures
      await sessionRef.set(
        { failures: admin.firestore.FieldValue.increment(1) },
        { merge: true }
      );

      return res.json({ success: true });

    } catch (err) {
      await db.collection("pulseband_errors").add({
        type: "redownload_error",
        error: err?.message || String(err),
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

      return res.json({ success: false, error: err?.message || "Unknown error" });
    }
  }
);
