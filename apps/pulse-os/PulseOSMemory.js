// ============================================================================
//  PULSE OS MEMORY v6.3
//  “THE LIVER” — C‑LAYER (OS MEMORY + RESTORE ENGINE)
//  Deterministic OS Memory + Restore Points
//  PURE STATE CAPTURE. NO AI. NO COMPUTE. NO MARKETPLACE.
// ============================================================================
//
// BODY THEME — ORGAN ROLE:
//  ------------------------
//  PulseOSMemory is the **LIVER** of Tropic Pulse.
//  It is the **METABOLIC ARCHIVE + RESTORE ORGAN** of the OS.
//
//  • Stores long-term “biochemical” state (snapshots per subsystem).
//  • Records “toxicity / damage signatures” (drift signatures).
//  • Builds “time machine vials” (restore points).
//  • Generates “treatment plans” (restore plans).
//  • Acts as the historical archive of how the OS has actually lived.
//
//  This is not mood, not emotion — it is **identity history**:
//  how the organism has been configured, stressed, damaged, and restored.
//
// WHAT THIS FILE IS:
//  -------------------
//  • The OS memory engine for Tropic Pulse.
//  • The subsystem snapshot recorder.
//  • The drift signature recorder.
//  • The restore point generator.
//  • The restore plan generator.
//  • The historical archive of the OS (long-term state).
//
// WHAT THIS FILE IS NOT:
//  -----------------------
//  • NOT a compute engine.
//  • NOT a miner.
//  • NOT a scheduler.
//  • NOT a runtime.
//  • NOT a marketplace adapter.
//  • NOT a blockchain client.
//  • NOT a wallet.
//  • NOT a place for user-provided logic.
//  • NOT a place for dynamic imports or eval.
//
// SAFETY CONTRACT:
//  ----------------
//  • No eval().
//  • No dynamic imports.
//  • No arbitrary code execution.
//  • No compute.
//  • No GPU work.
//  • No marketplace calls.
//  • Deterministic, drift-proof memory only.
//  • Always behaves like a stable organ: same inputs → same stored state.
//
// ============================================================================
//  OS‑v6 CONTEXT METADATA — ORGAN IDENTITY
// ============================================================================
const MEMORY_CONTEXT = {
  layer: "PulseOSMemory",
  role: "OS_LIVER",
  purpose:
    "Store OS + subsystem snapshots, drift signatures, restore points (metabolic archive)",
  context: "Deterministic OS memory + restore engine (long-term state organ)",
  version: 6.3,
  target: "os-core",
  selfRepairable: true
};

console.log(
  "%c🟦 PulseOSMemory v6.3 online — LIVER / OS archival engine active.",
  "color:#03A9F4; font-weight:bold;"
);

// ============================================================================
//  Collections — Where the “biochemical records” live
// ============================================================================
export const OS_SNAPSHOTS_COLLECTION = "OSSnapshots";
export const OS_RESTORE_POINTS_COLLECTION = "OSRestorePoints";
export const DRIFT_SIGNATURES_COLLECTION = "DriftSignatures";

// Snapshot retention — how much history this organ keeps
export const MAX_SNAPSHOTS_PER_SUBSYSTEM = 50;
export const MAX_RESTORE_POINTS = 20;

import { getFirestore, Timestamp } from "firebase-admin/firestore";
const db = getFirestore();

/* ============================================================================
   1. SNAPSHOTS — OS + Subsystem State Capture
   The liver stores “current blood chemistry” as snapshots.
   ============================================================================ */

/**
 * saveSnapshot(subsystem, payload)
 * Records a point-in-time state for a subsystem — like a lab panel.
 */
export async function saveSnapshot(subsystem, payload) {
  const now = Date.now();

  try {
    const ref = await db.collection(OS_SNAPSHOTS_COLLECTION).add({
      subsystem,
      payload,
      ts: now,
      createdAt: Timestamp.fromMillis(now),
      ...MEMORY_CONTEXT
    });

    console.log(
      `%c🟦 SNAPSHOT SAVED → ${subsystem}`,
      "color:#03A9F4; font-weight:bold;"
    );

    // Trim old snapshots — the liver keeps history, but not infinite.
    const snap = await db
      .collection(OS_SNAPSHOTS_COLLECTION)
      .where("subsystem", "==", subsystem)
      .orderBy("ts", "desc")
      .offset(MAX_SNAPSHOTS_PER_SUBSYSTEM)
      .get();

    if (!snap.empty) {
      console.log(
        `%c🟧 SNAPSHOT TRIM → ${subsystem} | removing ${snap.size} old snapshots`,
        "color:#FF9800; font-weight:bold;"
      );
    }

    const batch = db.batch();
    snap.forEach((doc) => batch.delete(doc.ref));
    if (!snap.empty) await batch.commit();

    return ref.id;
  } catch (err) {
    console.error(
      `%c🟥 SNAPSHOT ERROR`,
      "color:#FF5252; font-weight:bold;",
      err
    );
    throw err;
  }
}

/**
 * getLatestSnapshot(subsystem)
 * Fetches the most recent “lab panel” for a subsystem.
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

  console.log(
    `%c🟦 LATEST SNAPSHOT FETCHED → ${subsystem}`,
    "color:#03A9F4; font-weight:bold;"
  );

  return { id: doc.id, ...doc.data() };
}

/* ============================================================================
   2. DRIFT SIGNATURES — OS-Level Drift Recording
   The liver records “toxicity / damage signatures” over time.
   ============================================================================ */

/**
 * recordDriftSignature(subsystem, signature)
 * Logs a drift event — like recording a toxic exposure or injury pattern.
 */
export async function recordDriftSignature(subsystem, signature) {
  const now = Date.now();

  try {
    await db.collection(DRIFT_SIGNATURES_COLLECTION).add({
      subsystem,
      type: signature.type ?? "unknown",
      severity: signature.severity ?? "info",
      details: signature.details ?? null,
      relatedSnapshotId: signature.relatedSnapshotId ?? null,
      ts: now,
      createdAt: Timestamp.fromMillis(now),
      ...MEMORY_CONTEXT
    });

    console.log(
      `%c🟨 DRIFT SIGNATURE → ${subsystem} / ${signature.type}`,
      "color:#FFC107; font-weight:bold;"
    );
  } catch (err) {
    console.error(
      `%c🟥 DRIFT SIGNATURE ERROR`,
      "color:#FF5252; font-weight:bold;",
      err
    );
  }
}

/**
 * getRecentDriftSignatures(subsystem, limit = 20)
 * Returns recent “injury / toxicity records” for a subsystem.
 */
export async function getRecentDriftSignatures(subsystem, limit = 20) {
  const snap = await db
    .collection(DRIFT_SIGNATURES_COLLECTION)
    .where("subsystem", "==", subsystem)
    .orderBy("ts", "desc")
    .limit(limit)
    .get();

  console.log(
    `%c🟨 FETCH DRIFT SIGNATURES → ${subsystem} (${snap.size})`,
    "color:#FFC107; font-weight:bold;"
  );

  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/* ============================================================================
   3. RESTORE POINTS — OS Time Machine
   The liver bottles “vials of time” — full-state restore kits.
   ============================================================================ */

/**
 * createRestorePoint(label, subsystems)
 * Creates a multi-organ restore kit from latest snapshots.
 */
export async function createRestorePoint(label, subsystems = []) {
  const now = Date.now();
  const payload = {};

  try {
    console.log(
      `%c🟦 CREATING RESTORE POINT → ${label}`,
      "color:#03A9F4; font-weight:bold;"
    );

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
      createdAt: Timestamp.fromMillis(now),
      ...MEMORY_CONTEXT
    });

    console.log(
      `%c🟩 RESTORE POINT CREATED → ${label}`,
      "color:#4CAF50; font-weight:bold;"
    );

    // Trim old restore points — limited “time machine capacity”.
    const snap = await db
      .collection(OS_RESTORE_POINTS_COLLECTION)
      .orderBy("ts", "desc")
      .offset(MAX_RESTORE_POINTS)
      .get();

    if (!snap.empty) {
      console.log(
        `%c🟧 RESTORE POINT TRIM → removing ${snap.size} old restore points`,
        "color:#FF9800; font-weight:bold;"
      );
    }

    const batch = db.batch();
    snap.forEach((doc) => batch.delete(doc.ref));
    if (!snap.empty) await batch.commit();

    return ref.id;
  } catch (err) {
    console.error(
      `%c🟥 RESTORE POINT ERROR`,
      "color:#FF5252; font-weight:bold;",
      err
    );
    throw err;
  }
}

/**
 * getRestorePoint(id)
 * Fetches a specific “time vial” by ID.
 */
export async function getRestorePoint(id) {
  const doc = await db.collection(OS_RESTORE_POINTS_COLLECTION).doc(id).get();
  if (!doc.exists) return null;

  console.log(
    `%c🟦 RESTORE POINT FETCHED → ${id}`,
    "color:#03A9F4; font-weight:bold;"
  );

  return { id: doc.id, ...doc.data() };
}

/**
 * listRestorePoints(limit = 20)
 * Lists recent “time vials” available for restoration.
 */
export async function listRestorePoints(limit = 20) {
  const snap = await db
    .collection(OS_RESTORE_POINTS_COLLECTION)
    .orderBy("ts", "desc")
    .limit(limit)
    .get();

  console.log(
    `%c🟦 RESTORE POINT LIST FETCHED (${snap.size})`,
    "color:#03A9F4; font-weight:bold;"
  );

  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/* ============================================================================
   4. RESTORE INTENT (READ-ONLY) — OS Time Machine Plan
   The liver prepares a **treatment plan** from a chosen time vial.
   ============================================================================ */

/**
 * getRestorePlan(restorePointId)
 * Builds a read-only plan describing how to restore subsystems.
 */
export async function getRestorePlan(restorePointId) {
  const rp = await getRestorePoint(restorePointId);
  if (!rp) return null;

  console.log(
    `%c🟦 RESTORE PLAN GENERATED → ${restorePointId}`,
    "color:#03A9F4; font-weight:bold;"
  );

  const plan = {
    restorePointId: rp.id,
    label: rp.label,
    subsystems: [],
    createdAt: rp.createdAt,
    ts: rp.ts,
    ...MEMORY_CONTEXT
  };

  for (const subsystem of rp.subsystems || []) {
    const entry = rp.payload?.[subsystem];
    if (!entry) continue;

    plan.subsystems.push({
      subsystem,
      snapshotId: entry.snapshotId,
      snapshotTs: entry.ts,
      payloadPreview: entry.payload ? Object.keys(entry.payload) : [],
      ...MEMORY_CONTEXT
    });
  }

  return plan;
}
