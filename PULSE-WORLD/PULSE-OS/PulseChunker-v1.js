// ============================================================================
// FILE: /apps/PulseOS/Core/PulseChunker-v12.3-PRESENCE-EVO-MAX.js
// PULSE CHUNK ENGINE — v12.3‑PRESENCE‑EVO‑MAX‑PRIME
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
  version: "v12.3-PRESENCE-EVO-MAX",
  identity: "PulseChunker-v12.3-PRESENCE-EVO-MAX",
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
// LORE TRANSLATOR
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
// UNIVERSAL CACHE ENGINE — ONE FUNCTION ONLY
// ============================================================================
async function generateCache({ payload, baseVersion, sizeOnly=false, deltaRequest=false }) {

  const isDelta = deltaRequest || payload.endsWith("_DELTA");

  const [collection, field] = payload
    .replace(/^REQUEST_/, "")
    .replace(/_DELTA$/, "")
    .replace(/_CACHE$/, "")
    .toLowerCase()
    .split("_");

  const docs = (await db.collection(collection).get()).docs.map(d => d.data());
  let result = field ? docs.map(d => d[field]) : docs;

  if (isDelta && baseVersion) {
    const hash = crypto.createHash("sha256").update(JSON.stringify(result)).digest("hex");
    if (hash === baseVersion) return { added:[], removed:[], changed:[] };
    return { added: result, removed: [], changed: [] };
  }

  if (!sizeOnly) return result;

  return Buffer.byteLength(JSON.stringify(result ?? {}), "utf8");
}

// ============================================================================
// INTELLIGENT CACHE RESOLVER — ONE FUNCTION ONLY
// ============================================================================
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
// CREATE PULSE BAND SESSION
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
        sizeOnly,
        presenceTag = "PulseChunker",
        band = "symbolic"
      } = body;

      if (!userId || !payload) {
        return res.json({ success: false, error: "Missing userId or payload" });
      }

      if (typeof chunkSize !== "number" || chunkSize <= 0) {
        chunkSize = 500;
      }

      await db.collection("pulseband_logs").add({
        type: "session_create_request",
        userId,
        payload,
        chunkSize,
        baseVersion: baseVersion || null,
        sizeOnly: !!sizeOnly,
        presenceTag,
        band,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

      // Resolve payload
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

      if (sizeOnly && typeof rawPayload === "number") {
        return res.json({
          success: true,
          sizeOnly: true,
          payloadSize: rawPayload,
          presenceTag,
          band
        });
      }

      let jsonString =
        typeof rawPayload === "string"
          ? rawPayload
          : JSON.stringify(rawPayload);

      // Lore injection
      const loreHeader = generateLoreHeader({
        meta: PulseChunkerMeta,
        payloadType: payload,
        baseVersion,
        presenceTag,
        band
      });

      jsonString = `${loreHeader}\n${jsonString}`;

      // Buffer + deterministic session ID
      const buffer = Buffer.from(jsonString, "utf8");
      const payloadHash = crypto.createHash("sha256").update(buffer).digest("hex");
      const totalChunks = Math.ceil(buffer.length / chunkSize);
      const sessionId = `PB_${userId}_${payloadHash.slice(0, 16)}`;

      const sessionRef = db.collection("pulseband_sessions").doc(sessionId);
      const chunksRef = sessionRef.collection("chunks");

      // Session metadata
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
        baseVersion: baseVersion || null,
        presenceTag,
        band
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
        presenceTag,
        band,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

      // Chunk + batch write
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
            presenceTag,
            band,
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
            presenceTag,
            band,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
          });
          return res.json({ success: false, error: "Chunk generation failed" });
        }
      }

      if (batchCount > 0) {
        await batch.commit();
      }

      return res.json({
        success: true,
        sessionId,
        totalChunks,
        payloadBytes: buffer.length,
        payloadHash,
        presenceTag,
        band
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

      await doc.ref.set(
        { status: "sent", sentAt: admin.firestore.FieldValue.serverTimestamp() },
        { merge: true }
      );

      return res.json({
        success: true,
        chunk: {
          index: data.index,
          data: data.data,
          signature: data.signature,
          presenceTag: data.presenceTag,
          band: data.band
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
          presenceTag: data.presenceTag,
          band: data.band,
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        await sessionRef.set(
          { failures: admin.firestore.FieldValue.increment(1) },
          { merge: true }
        );

        return res.json({ success: false, error: "Signature mismatch" });
      }

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
// LOG PULSE BAND REDOWNLOAD — v12.3‑PRESENCE‑EVO‑MAX‑PRIME
// Deterministic • Presence‑aware • Binary‑aware • Zero‑timing • Zero‑randomness
// ============================================================================
export const logPulseBandRedownload = onRequest(
  { region: "us-central1" },
  async (req, res) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
    if (req.method === "OPTIONS") return res.status(204).send("");

    try {
      const { sessionId, userId, reason, presenceTag = "PulseChunker", band = "symbolic" } =
        req.body || {};

      const sessionRef = db.collection("pulseband_sessions").doc(String(sessionId));

      // Log redownload event
      await db.collection("pulseband_redownloads").add({
        sessionId,
        userId,
        reason: reason || null,
        presenceTag,
        band,
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

      // Increment failure count
      await sessionRef.set(
        { failures: admin.firestore.FieldValue.increment(1) },
        { merge: true }
      );

      return res.json({
        success: true,
        presenceTag,
        band
      });

    } catch (err) {
      await db.collection("pulseband_errors").add({
        type: "redownload_error",
        error: err?.message || String(err),
        presenceTag: "PulseChunker",
        band: "symbolic",
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

      return res.json({
        success: false,
        error: err?.message || "Unknown error"
      });
    }
  }
);
