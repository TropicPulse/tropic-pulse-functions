// ============================================================================
//  PULSE OS MEMORY v7.3
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
// SAFETY CONTRACT (unchanged):
//  ----------------------------
//  • No eval()
//  • No dynamic imports
//  • No arbitrary code execution
//  • No compute
//  • No GPU work
//  • No marketplace calls
//  • Deterministic, drift-proof memory only
//  • Always behaves like a stable organ: same inputs → same stored state
//
// ADVANTAGE CASCADE (v7.3):
//  -------------------------
//  • Dual-mode: mental + system
//  • Local-aware: node-level metabolic context
//  • Internet-aware: cluster/mesh/global metabolic context
//  • Advantage-cascade-aware: inherits ANY safe advantage
//  • Unified-advantage-field: ALL advantages ON unless unsafe
//  • Future-evolution-ready: new safe advantages auto-inherited
// ============================================================================
//  OS‑v7.3 CONTEXT METADATA — ORGAN IDENTITY
// ============================================================================
const MEMORY_CONTEXT = {
  organ: "PulseOSMemory",
  layer: "C-Layer",
  role: "OS_LIVER",
  purpose:
    "Store OS + subsystem snapshots, drift signatures, restore points (metabolic archive)",
  context: "Deterministic OS memory + restore engine (long-term state organ)",
  version: "7.3",
  generation: "v7",
  target: "os-core",
  selfRepairable: true,
  evo: {
    dualMode: true,
    localAware: true,
    internetAware: true,
    advantageCascadeAware: true,
    pulseEfficiencyAware: true,
    driftProof: true,
    multiInstanceReady: true,
    unifiedAdvantageField: true,
    futureEvolutionReady: true
  }
};

log(
  "%c🟦 PulseOSMemory v7.3 online — LIVER / OS archival engine active.",
  "color:#03A9F4; font-weight:bold;"
);

// ============================================================================
//  Collections — Where the “biochemical records” live
// ============================================================================
export const OS_SNAPSHOTS_COLLECTION = "OSSnapshots";
export const OS_RESTORE_POINTS_COLLECTION = "OSRestorePoints";
export const DRIFT_SIGNATURES_COLLECTION = "DriftSignatures";

export const MAX_SNAPSHOTS_PER_SUBSYSTEM = 50;
export const MAX_RESTORE_POINTS = 20;

import { getFirestore, Timestamp } from "firebase-admin/firestore";
const db = getFirestore();

/* ============================================================================  
   1. SNAPSHOTS — OS + Subsystem State Capture  
   ============================================================================ */

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

    log(
      `%c🟦 SNAPSHOT SAVED → ${subsystem}`,
      "color:#03A9F4; font-weight:bold;"
    );

    const snap = await db
      .collection(OS_SNAPSHOTS_COLLECTION)
      .where("subsystem", "==", subsystem)
      .orderBy("ts", "desc")
      .offset(MAX_SNAPSHOTS_PER_SUBSYSTEM)
      .get();

    if (!snap.empty) {
      log(
        `%c🟧 SNAPSHOT TRIM → ${subsystem} | removing ${snap.size} old snapshots`,
        "color:#FF9800; font-weight:bold;"
      );
    }

    const batch = db.batch();
    snap.forEach((doc) => batch.delete(doc.ref));
    if (!snap.empty) await batch.commit();

    return ref.id;
  } catch (err) {
    error(
      `%c🟥 SNAPSHOT ERROR`,
      "color:#FF5252; font-weight:bold;",
      err
    );
    throw err;
  }
}

export async function getLatestSnapshot(subsystem) {
  const snap = await db
    .collection(OS_SNAPSHOTS_COLLECTION)
    .where("subsystem", "==", subsystem)
    .orderBy("ts", "desc")
    .limit(1)
    .get();

  if (snap.empty) return null;

  const doc = snap.docs[0];

  log(
    `%c🟦 LATEST SNAPSHOT FETCHED → ${subsystem}`,
    "color:#03A9F4; font-weight:bold;"
  );

  return { id: doc.id, ...doc.data() };
}

/* ============================================================================  
   2. DRIFT SIGNATURES — OS-Level Drift Recording  
   ============================================================================ */

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

    log(
      `%c🟨 DRIFT SIGNATURE → ${subsystem} / ${signature.type}`,
      "color:#FFC107; font-weight:bold;"
    );
  } catch (err) {
    error(
      `%c🟥 DRIFT SIGNATURE ERROR`,
      "color:#FF5252; font-weight:bold;",
      err
    );
  }
}

export async function getRecentDriftSignatures(subsystem, limit = 20) {
  const snap = await db
    .collection(DRIFT_SIGNATURES_COLLECTION)
    .where("subsystem", "==", subsystem)
    .orderBy("ts", "desc")
    .limit(limit)
    .get();

  log(
    "osmemory",
    `🟨 FETCH DRIFT SIGNATURES → ${subsystem} (${snap.size})`
  );

  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/* ============================================================================  
   3. RESTORE POINTS — OS Time Machine  
   ============================================================================ */

export async function createRestorePoint(label, subsystems = []) {
  const now = Date.now();
  const payload = {};

  try {
    log("osmemory", `🟦 CREATING RESTORE POINT → ${label}`);

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

    log("osmemory", `🟩 RESTORE POINT CREATED → ${label}`);

    const snap = await db
      .collection(OS_RESTORE_POINTS_COLLECTION)
      .orderBy("ts", "desc")
      .offset(MAX_RESTORE_POINTS)
      .get();

    if (!snap.empty) {
      warn(
        "osmemory",
        `🟧 RESTORE POINT TRIM → removing ${snap.size} old restore points`
      );
    }

    const batch = db.batch();
    snap.forEach((doc) => batch.delete(doc.ref));
    if (!snap.empty) await batch.commit();

    return ref.id;

  } catch (err) {
    error("osmemory", "🟥 RESTORE POINT ERROR", err);
    throw err;
  }
}

export async function getRestorePoint(id) {
  const doc = await db.collection(OS_RESTORE_POINTS_COLLECTION).doc(id).get();
  if (!doc.exists) return null;

  log("osmemory", `🟦 RESTORE POINT FETCHED → ${id}`);

  return { id: doc.id, ...doc.data() };
}

export async function listRestorePoints(limit = 20) {
  const snap = await db
    .collection(OS_RESTORE_POINTS_COLLECTION)
    .orderBy("ts", "desc")
    .limit(limit)
    .get();

  log("osmemory", `🟦 RESTORE POINT LIST FETCHED (${snap.size})`);

  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

/* ============================================================================  
   4. RESTORE INTENT (READ-ONLY) — OS Time Machine Plan  
   ============================================================================ */

export async function getRestorePlan(restorePointId) {
  const rp = await getRestorePoint(restorePointId);
  if (!rp) return null;

  log("osmemory", `🟦 RESTORE PLAN GENERATED → ${restorePointId}`);

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
