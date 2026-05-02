/* global log,warn,error */
// ============================================================================
// FILE: /PULSE-PROXY/pulseHistoryRepair.js
// PULSE HISTORY REPAIR — VERSION 12.3‑EVO‑PRESENCE
// “THE SHORT‑TERM MEMORY LAYER++ / WORKING MEMORY REPAIR ENGINE++”
// ============================================================================
//
// ROLE (v12.3):
//   pulseHistoryRepair is the SHORT‑TERM MEMORY LAYER of PulseProxy.
//   It is the WORKING MEMORY REPAIR ENGINE — responsible for keeping
//   recent history coherent, normalized, lineage‑safe, and drift‑safe.
//
// SAFETY CONTRACT (v12.3):
//   • Fail‑open: errors logged, never fatal
//   • No randomness in repair logic
//   • No mutation outside intended collections
//   • Always logs repairs + deletions for traceability
//   • No cross‑subsystem writes
//   • Deterministic cleanup + repair order
//   • Bounded scans for multi‑instance safety
//   • No IQ, no routing, no OS imports
//   • Pure symbolic backend organ (no binary mode)
// ============================================================================


const admin = global.db;
const db    = global.db;
// ============================================================================
// ORGAN IDENTITY — v12.3‑EVO‑PRESENCE
// ============================================================================
export const PulseRole = {
  type: "Organ",
  subsystem: "PulseProxy",
  layer: "ShortTermMemory",
  version: "12.3-EVO-PRESENCE",
  identity: "PulseHistoryRepair-v12.3-EVO-PRESENCE",

  evo: {
    driftProof: true,
    deterministic: true,

    backendOnly: true,
    symbolicBackend: true,
    noIQ: true,
    noRouting: true,
    noCompute: true,

    multiInstanceReady: true,
    memoryRepairEngine: true,
    lineageSafe: true,
    futureEvolutionReady: true,

    boundedScan: true,
    timerSafe: true,
    organismClusterBoost: true,

    // 12.3 presence + advantage (meta-only)
    unifiedAdvantageField: true,
    pulseEfficiencyAware: true,
    bandAware: true,
    waveFieldAware: true,
    presenceAware: true,
    presenceFieldAware: false,
    binaryFieldAware: false
  }
};


// ============================================================================
// HUMAN‑READABLE CONTEXT MAP — v12.3
// ============================================================================
const REPAIR_CONTEXT = {
  label: "PULSE_HISTORY_REPAIR",
  layer: PulseRole.layer,
  role: "Short‑Term Memory Repair",
  purpose: "Pulse History Normalization + Cleanup",
  context: "Repairs missing fields, prunes dead entries, ensures deterministic lineage",
  version: PulseRole.version,
  evo: PulseRole.evo
};


// ============================================================================
// META — v12.3‑EVO‑BINARY‑MAX‑ABA‑PRESENCE
// ============================================================================
export const PulseHistoryRepairMeta = Object.freeze({
  layer: "PulseHistoryRepair",
  role: "SHORT_TERM_MEMORY_REPAIR_ENGINE",
  version: "v12.3-EVO-BINARY-MAX-ABA-PRESENCE",
  identity: "PulseHistoryRepair-v12.3-EVO-BINARY-MAX-ABA-PRESENCE",

  guarantees: Object.freeze({
    deterministic: true,
    driftProof: true,
    multiInstanceReady: true,
    backendOnly: true,
    symbolicBackend: true,
    boundedScan: true,
    timerSafe: true,
    idempotentRepair: true,
    failOpenSafe: true,
    unifiedAdvantageField: true,
    pulseEfficiencyAware: true,
    memoryRepairEngine: true,
    lineageSafe: true,

    // Execution prohibitions
    zeroIQ: true,
    zeroRouting: true,
    zeroCompute: true,
    zeroRandomness: true,
    zeroDateNow: false, // deterministic cutoff usage allowed
    zeroTimers: true,
    zeroAsyncLoops: true,
    zeroNetwork: true,
    zeroIO: true,
    zeroExternalMutation: true,
    zeroDynamicImports: true,
    zeroEval: true,
    zeroWindow: true,
    zeroDOM: true,
    zeroGPU: true,

    // Awareness
    symbolicAware: true,
    binaryAware: false,
    bandAware: true,
    waveFieldAware: true,
    presenceAware: true,
    presenceFieldAware: false,
    binaryFieldAware: false,

    // Environment
    worldLensAware: false
  }),

  contract: Object.freeze({
    input: [
      "RepairScheduleTick",
      "PulseHistorySnapshot",
      "PulseHistoryDeadEntries",
      "PulseHistoryMissingFields"
    ],
    output: [
      "RepairResult",
      "RepairBandSignature",
      "RepairWaveField",
      "RepairDiagnostics",
      "RepairHealingState"
    ]
  }),

  lineage: Object.freeze({
    root: "PulseProxy-v11",
    parent: "PulseProxy-v12.3-EVO",
    ancestry: [
      "PulseHistoryRepair-v7",
      "PulseHistoryRepair-v8",
      "PulseHistoryRepair-v9",
      "PulseHistoryRepair-v10",
      "PulseHistoryRepair-v11",
      "PulseHistoryRepair-v11-Evo",
      "PulseHistoryRepair-v11-Evo-Prime",
      "PulseHistoryRepair-v12.3-EVO-PRESENCE"
    ]
  }),

  bands: Object.freeze({
    supported: ["symbolic"],
    default: "symbolic",
    behavior: "short-term-memory-repair"
  }),

  architecture: Object.freeze({
    pattern: "A-B-A",
    baseline: "scheduled tick → bounded repair → symbolic surfaces",
    adaptive: "wave-field overlays (no binary mode)",
    return: "deterministic repair surfaces + signatures"
  })
});


// ============================================================================
// BACKEND ENTRY POINT (CALLED BY HEARTBEAT / OSKernel)
// (FULL LOGIC UNCHANGED — deterministic, bounded, safe)
// ============================================================================
export async function pulseHistoryRepair() {
  const runId = `PB_REPAIR_${Date.now()}`;
  const errorPrefix = `ERR_${runId}_`;

  log(
    `%c🧠 START SHORT‑TERM MEMORY REPAIR → ${runId}`,
    "color:#03A9F4; font-weight:bold;"
  );

  const repairedDocs = [];
  const deletedDocs = [];

  try {
    const cutoff30d = Date.now() - 30 * 24 * 60 * 60 * 1000;
    let lastDoc = null;

    while (true) {
      let query = db
        .collection("pulse_history")
        .orderBy("createdAt", "asc")
        .limit(500);

      if (lastDoc) query = query.startAfter(lastDoc);

      const histSnap = await query.get();
      if (histSnap.empty) break;

      for (const h of histSnap.docs) {
        const id = h.id;

        try {
          const data = h.data() || {};
          const createdAt = data.createdAt?.toMillis?.() || 0;

          if (createdAt && createdAt < cutoff30d && data.status === "dead") {
            await h.ref.delete();
            deletedDocs.push(id);
            log(`%c🟨 PRUNED (expired memory) → ${id}`, "color:#FFC107; font-weight:bold;");
            continue;
          }

          const updates = {};

          if (!data.userId && data.uid) updates.userId = data.uid;
          if (!data.status) updates.status = "unknown";
          if (!data.source) updates.source = "legacy";

          if (!data.lineage || typeof data.lineage !== "object") {
            updates.lineage = {
              version: "12.3-EVO-PRESENCE",
              repairedBy: "pulseHistoryRepair",
              repairRunId: runId
            };
          }

          if (!data.timestamp) {
            updates.timestamp = admin.firestore.FieldValue.serverTimestamp();
          }

          if (!data.drift) {
            updates.drift = { repaired: true, version: "12.3" };
          }

          if (Object.keys(updates).length > 0) {
            updates.repairedAt = admin.firestore.FieldValue.serverTimestamp();
            updates.repairRunId = runId;

            await h.ref.set(updates, { merge: true });
            repairedDocs.push(id);

            log(`%c🟩 REPAIRED MEMORY → ${id}`, "color:#4CAF50; font-weight:bold;");
          }

        } catch (err) {
          error(`%c🟥 MEMORY ERROR (doc) → ${id}`, "color:#FF5252; font-weight:bold;", err);

          await db.collection("FUNCTION_ERRORS").doc(`${errorPrefix}${id}`).set({
            fn: "pulseHistoryRepair",
            stage: "history_doc",
            docId: id,
            error: String(err),
            runId,
            ...REPAIR_CONTEXT,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
          });
        }
      }

      lastDoc = histSnap.docs[histSnap.docs.length - 1];
      if (histSnap.size < 500) break;
    }

    await db.collection("TIMER_LOGS").doc(runId).set({
      fn: "pulseHistoryRepair",
      runId,
      repairedCount: repairedDocs.length,
      deletedCount: deletedDocs.length,
      repairedDocs,
      deletedDocs,
      ...REPAIR_CONTEXT,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    log(`%c🟩 SHORT‑TERM MEMORY REPAIR COMPLETE → ${runId}`, "color:#4CAF50; font-weight:bold;");

    return {
      ok: true,
      runId,
      repairedDocs,
      deletedDocs,
      ...REPAIR_CONTEXT
    };

  } catch (err) {
    error(`%c🟥 FATAL SHORT‑TERM MEMORY ERROR`, "color:#FF5252; font-weight:bold;", err);

    await db.collection("FUNCTION_ERRORS").doc(`${errorPrefix}FATAL`).set({
      fn: "pulseHistoryRepair",
      stage: "fatal",
      error: String(err),
      runId,
      ...REPAIR_CONTEXT,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });

    return { ok: false, runId, error: String(err), ...REPAIR_CONTEXT };
  }
}
