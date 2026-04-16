// FILE: pulse-os/PulseOSMemory.js
//
// PulseOSMemory v6 — Deterministic OS Memory + Restore Points
// NO AI. NO COMPUTE. NO MARKETPLACE. PURE STATE CAPTURE.
//
// ------------------------------------------------------
// ROLE:
//   • Store OS + subsystem health snapshots
//   • Store drift signatures + healing patterns
//   • Store restore points (system-level + subsystem-level)
//   • Provide deterministic read/write API for other OS layers
//
// SAFETY:
//   • NO eval()
//   • NO dynamic imports
//   • NO arbitrary code execution
//   • NO compute / GPU / marketplace / AI
// ------------------------------------------------------

// Collections
export const OS_SNAPSHOTS_COLLECTION = "OSSnapshots";
export const OS_RESTORE_POINTS_COLLECTION = "OSRestorePoints";
export const DRIFT_SIGNATURES_COLLECTION = "DriftSignatures";

// Snapshot retention
export const MAX_SNAPSHOTS_PER_SUBSYSTEM = 50;
export const MAX_RESTORE_POINTS = 20;

import { getFirestore, Timestamp } from "firebase-admin/firestore";
const db = getFirestore();

/* ------------------------------------------------------------
   1. SNAPSHOTS
   ------------------------------------------------------------ */

/**
 * saveSnapshot(subsystem, payload)
 * subsystem: "PulseBand" | "PulseNet" | "PulseClient" | "Proxy" | "OS"
 * payload:   arbitrary JSON-safe object (health, config, etc.)
 */
export async function saveSnapshot(subsystem, payload) {
  const now = Date.now();

  const ref = await db.collection(OS_SNAPSHOTS_COLLECTION).add({
    subsystem,
    payload,
    ts: now,
    createdAt: Timestamp.fromMillis(now)
  });

  // Trim old snapshots for this subsystem
  const snap = await db
    .collection(OS_SNAPSHOTS_COLLECTION)
    .where("subsystem", "==", subsystem)
    .orderBy("ts", "desc")
    .offset(MAX_SNAPSHOTS_PER_SUBSYSTEM)
    .get();

  const batch = db.batch();
  snap.forEach((doc) => batch.delete(doc.ref));
  if (!snap.empty) await batch.commit();

  return ref.id;
}

/**
 * getLatestSnapshot(subsystem)
 */
export async function getLatestSnapshot(subsystem) {
  const snap = await db
    .collection(OS_SNAPSHOTS_COLLECTION)
    .where("subsystem", "==", subsystem)
    .orderBy("ts", "desc")
    .limit(1)
    .get();

  if (snap.empty) return null;
  const doc = snap.docs[0];
  return { id: doc.id, ...doc.data() };
}

/* ------------------------------------------------------------
   2. DRIFT SIGNATURES
   ------------------------------------------------------------ */

/**
 * recordDriftSignature(subsystem, signature)
 * signature: { type, details, severity, relatedSnapshotId? }
 */
export async function recordDriftSignature(subsystem, signature) {
  const now = Date.now();

  await db.collection(DRIFT_SIGNATURES_COLLECTION).add({
    subsystem,
    type: signature.type ?? "unknown",
    severity: signature.severity ?? "info",
    details: signature.details ?? null,
    relatedSnapshotId: signature.relatedSnapshotId ?? null,
    ts: now,
    createdAt: Timestamp.fromMillis(now)
  });
}

/**
 * getRecentDriftSignatures(subsystem, limit = 20)
 */
export async function getRecentDriftSignatures(subsystem, limit = 20) {
  const snap = await db
    .collection(DRIFT_SIGNATURES_COLLECTION)
    .where("subsystem", "==", subsystem)
    .orderBy("ts", "desc")
    .limit(limit)
    .get();

  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/* ------------------------------------------------------------
   3. RESTORE POINTS
   ------------------------------------------------------------ */

/**
 * createRestorePoint(label, subsystems)
 * label: human-readable name, e.g. "pre-v6-upgrade"
 * subsystems: array of subsystem names to snapshot
 */
export async function createRestorePoint(label, subsystems = []) {
  const now = Date.now();
  const payload = {};

  for (const subsystem of subsystems) {
    const snap = await getLatestSnapshot(subsystem);
    if (snap) {
      payload[subsystem] = {
        snapshotId: snap.id,
        payload: snap.payload,
        ts: snap.ts
      };
    }
  }

  const ref = await db.collection(OS_RESTORE_POINTS_COLLECTION).add({
    label,
    subsystems,
    payload,
    ts: now,
    createdAt: Timestamp.fromMillis(now)
  });

  // Trim old restore points
  const snap = await db
    .collection(OS_RESTORE_POINTS_COLLECTION)
    .orderBy("ts", "desc")
    .offset(MAX_RESTORE_POINTS)
    .get();

  const batch = db.batch();
  snap.forEach((doc) => batch.delete(doc.ref));
  if (!snap.empty) await batch.commit();

  return ref.id;
}

/**
 * getRestorePoint(id)
 */
export async function getRestorePoint(id) {
  const doc = await db.collection(OS_RESTORE_POINTS_COLLECTION).doc(id).get();
  if (!doc.exists) return null;
  return { id: doc.id, ...doc.data() };
}

/**
 * listRestorePoints(limit = 20)
 */
export async function listRestorePoints(limit = 20) {
  const snap = await db
    .collection(OS_RESTORE_POINTS_COLLECTION)
    .orderBy("ts", "desc")
    .limit(limit)
    .get();

  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/* ------------------------------------------------------------
   4. RESTORE INTENT (READ-ONLY)
   ------------------------------------------------------------ */
/**
 * getRestorePlan(restorePointId)
 * Returns a deterministic plan describing what would be restored.
 * DOES NOT APPLY ANY CHANGES.
 */
export async function getRestorePlan(restorePointId) {
  const rp = await getRestorePoint(restorePointId);
  if (!rp) return null;

  const plan = {
    restorePointId: rp.id,
    label: rp.label,
    subsystems: [],
    createdAt: rp.createdAt,
    ts: rp.ts
  };

  for (const subsystem of rp.subsystems || []) {
    const entry = rp.payload?.[subsystem];
    if (!entry) continue;

    plan.subsystems.push({
      subsystem,
      snapshotId: entry.snapshotId,
      snapshotTs: entry.ts,
      // You can choose to omit payload here if you want a lighter plan
      payloadPreview: entry.payload ? Object.keys(entry.payload) : []
    });
  }

  return plan;
}
