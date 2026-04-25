// ============================================================================
// FILE: tropic-pulse-functions/apps/PULSE-AI/aiDiagnosticsWrite.js
// LAYER: WRITE ORGAN (AI Logs)
// ============================================================================
//
// ROLE:
//   • Safely store AI runs into Firestore.
//   • Never store identity anchors.
//   • Deterministic, schema-locked writes.
//   • Only runs AFTER AI reasoning is complete.
// ============================================================================

export function createDiagnosticsWriteAPI({ context, db }) {

  function stripIdentity(obj) {
    if (!obj || typeof obj !== "object") return obj;
    const clone = { ...obj };
    delete clone.userId;
    delete clone.uid;
    delete clone.resendToken;
    delete clone.identityRoot;
    delete clone.sessionRoot;
    delete clone.deviceFingerprint;
    return clone;
  }

  return {
    async writeRun({ result, context }) {
      const timestamp = Date.now();
      const docId = `${context.personaId}-${timestamp}`;

      const safe = {
        personaId: context.personaId,
        userIsOwner: context.userIsOwner,
        timestamp,
        result: stripIdentity(result),
        diagnostics: stripIdentity(context.diagnostics),
        trace: [...context.trace],
        routing: stripIdentity(context.routing),
        scribeReport: stripIdentity(context.scribeReport),
        clinicianReport: stripIdentity(context.clinicianReport)
      };

      await db.write(`AI_LOGS/${docId}`, safe);
      return true;
    }
  };
}
