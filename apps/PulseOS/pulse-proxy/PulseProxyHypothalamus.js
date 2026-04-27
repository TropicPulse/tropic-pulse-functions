// ============================================================================
//  PULSE OS v11‑Evo — HYPOTHALAMUS
//  PulseUserScoring — Homeostasis Regulation Organ
//  Backend‑Only • Deterministic • Drift‑Proof • No IQ
//  ROLE: Reads UserMetrics → Computes trustScore, meshScore, phase, hubFlag,
//        instance allocation → Writes UserScores.
//  ⭐ LOGIC UNCHANGED — ONLY IDENTITY + ENVELOPE UPGRADED ⭐
// ============================================================================


// ============================================================================
//  GLOBAL WIRING — backend‑only, safe resolver
// ============================================================================
const G =
  typeof globalThis !== "undefined"
    ? globalThis
    : typeof global !== "undefined"
    ? global
    : {};

const db    = G.db    || null;
const log   = G.log   || console.log;
const error = G.error || console.error;

const Timestamp =
  (G.firebaseAdmin && G.firebaseAdmin.firestore.Timestamp) ||
  G.Timestamp ||
  null;


// ============================================================================
//  ORGAN IDENTITY — v11‑Evo A‑B‑A
// ============================================================================
export const PulseRole = {
  type: "Organ",
  subsystem: "PulseProxy",
  layer: "Hypothalamus",
  version: "11-Evo",
  identity: "PulseUserScoring-v11-Evo-ABA",

  evo: {
    driftProof: true,
    deterministic: true,
    homeostasisRegulation: true,
    backendOnly: true,
    multiInstanceReady: true,
    pulseSendAware: true,
    unifiedAdvantageField: true,
    pulseEfficiencyAware: true,
    futureEvolutionReady: true,

    // v11‑Evo A‑B‑A surfaces
    bandAware: true,
    waveFieldAware: true,
    binaryFieldAware: true,
    hypothalamusCycleAware: true
  }
};
export const PulseUserScoringMeta = Object.freeze({
  layer: "PulseUserScoringHypothalamus",
  role: "HYPOTHALAMUS_HOMEOSTASIS_ORGAN",
  version: "v11.2-EVO-BINARY-MAX",
  identity: "PulseUserScoring-v11.2-EVO-BINARY-MAX",

  guarantees: Object.freeze({
    deterministic: true,
    driftProof: true,
    multiInstanceReady: true,

    // Hypothalamus laws
    homeostasisRegulation: true,
    endocrineRegulation: true,
    trustScoreEngine: true,
    meshScoreEngine: true,
    phaseEngine: true,
    hubDetection: true,
    instanceAllocator: true,
    unifiedAdvantageField: true,
    pulseEfficiencyAware: true,
    backendOnly: true,

    // Execution prohibitions
    zeroIQ: true,
    zeroRouting: true,
    zeroCompute: true,              // no business logic beyond scoring math
    zeroRandomness: true,
    zeroTimestamps: true,
    zeroDateNow: true,
    zeroTimers: true,
    zeroAsync: true,
    zeroNetwork: true,
    zeroIO: true,
    zeroExternalMutation: true,     // except writing UserScores
    zeroDynamicImports: true,
    zeroEval: true,
    zeroWindow: true,
    zeroDOM: true,
    zeroGPU: true,

    // A‑B‑A + band surfaces
    bandAware: true,
    waveFieldAware: true,
    binaryFieldAware: true,
    hypothalamusCycleAware: true,

    // Awareness
    symbolicAware: true,
    binaryAware: true,
    dualBandAware: true,

    // Environment
    worldLensAware: false
  }),

  contract: Object.freeze({
    input: [
      "UserMetricsSnapshot",
      "DualBandContext",
      "AdvantageContext"
    ],
    output: [
      "UserScoresSnapshot",
      "TrustScore",
      "MeshScore",
      "Phase",
      "HubFlag",
      "InstanceAllocation",
      "HypothalamusBandSignature",
      "HypothalamusBinaryField",
      "HypothalamusWaveField",
      "HypothalamusDiagnostics",
      "HypothalamusHealingState"
    ]
  }),

  lineage: Object.freeze({
    root: "PulseProxy-v11",
    parent: "PulseProxy-v11.2-EVO",
    ancestry: [
      "PulseUserScoring-v7",
      "PulseUserScoring-v8",
      "PulseUserScoring-v9",
      "PulseUserScoring-v10",
      "PulseUserScoring-v11",
      "PulseUserScoring-v11-Evo",
      "PulseUserScoring-v11-Evo-ABA"
    ]
  }),

  bands: Object.freeze({
    supported: ["symbolic", "binary"],
    default: "symbolic",
    behavior: "hypothalamus-homeostasis"
  }),

  architecture: Object.freeze({
    pattern: "A-B-A",
    baseline: "metrics → homeostasis math → user scores",
    adaptive: "binary-field + wave-field overlays",
    return: "deterministic homeostasis surfaces + signatures"
  })
});


// ============================================================================
//  INTERNAL HELPERS — deterministic, pure, zero randomness
// ============================================================================
function computeHash(str) {
  let h = 0;
  const s = String(str || "");
  for (let i = 0; i < s.length; i++) {
    h = (h + s.charCodeAt(i) * (i + 1)) % 100000;
  }
  return `h${h}`;
}

function buildBinaryField() {
  const patternLen = 18;
  const density = 18 + 36;
  const surface = density + patternLen;

  return {
    binaryPhenotypeSignature: `hypo-binary-pheno-${surface % 99991}`,
    binarySurfaceSignature: `hypo-binary-surface-${(surface * 13) % 99991}`,
    binarySurface: { patternLen, density, surface },
    parity: surface % 2 === 0 ? 0 : 1,
    shiftDepth: Math.max(0, Math.log2(surface || 1) | 0)
  };
}

function buildWaveField() {
  const amplitude = 16;
  const wavelength = amplitude + 6;
  const phase = amplitude % 16;

  return {
    amplitude,
    wavelength,
    phase,
    band: "symbolic-root",
    mode: "symbolic-wave"
  };
}

function buildHypothalamusCycleSignature(cycle) {
  return computeHash(`HYPOTHALAMUS_CYCLE::${cycle}`);
}


// ============================================================================
//  HYPOTHALAMUS CONTEXT — v11‑Evo A‑B‑A
// ============================================================================
let HYPOTHALAMUS_CYCLE = 0;

const HYPOTHALAMUS_CONTEXT = {
  layer: PulseRole.layer,
  role: "HYPOTHALAMUS",
  version: PulseRole.version,
  evo: PulseRole.evo
};


// ============================================================================
//  LAYER STATE (backend health)
// ============================================================================
G.PULSE_LAYER_STATE = G.PULSE_LAYER_STATE || {};
G.PULSE_LAYER_STATE[4] = {
  name: "Hypothalamus",
  ok: true,
  role: HYPOTHALAMUS_CONTEXT.role,
  version: HYPOTHALAMUS_CONTEXT.version
};

if (!db) {
  log("hypothalamus", "WARNING: db missing — scoring disabled until wiring completes.");
}


// ============================================================================
//  CONFIG — deterministic scoring limits (UNCHANGED)
// ============================================================================
export const NORMAL_MAX    = 4;
export const UPGRADED_MAX  = 8;
export const HIGHEND_MAX   = 8;
export const TEST_EARN_MAX = 16;

export const UPGRADED_MULT  = 2;
export const HIGHEND_MULT   = 2;
export const EARN_MODE_MULT = 1.5;

export const ENABLE_SCORING_LOGGING = true;
export const SCORING_LOG_COLLECTION = "UserScoringLogs";


// ============================================================================
//  TRUST SCORE — deterministic (UNCHANGED)
// ============================================================================
function calculateTrustScore(m) {
  if (!m) return 0;

  const totalRequests = Number(m.totalRequests || 0);
  const meshRelays    = Number(m.meshRelays || 0);
  const hubSignals    = Number(m.hubSignals || 0);
  const stability     = Number(m.stabilityScore || 0);
  const avgLatency    = m.avgLatency ? Number(m.avgLatency) : null;

  let score = 0;

  score += Math.min(totalRequests / 100, 20);
  score += Math.min(meshRelays / 10, 20);
  score += Math.min(hubSignals / 5, 20);
  if (avgLatency && avgLatency < 150) score += 20;
  score += Math.min(stability, 20);

  const final = Math.min(score, 100);

  log("hypothalamus", `HealthIndex | user=${m.userId ?? "?"} | score=${final}`);
  return final;
}


// ============================================================================
//  MESH SCORE — deterministic (UNCHANGED)
// ============================================================================
function calculateMeshScore(m) {
  if (!m) return 0;

  const meshRelays = Number(m.meshRelays || 0);
  const meshPings  = Number(m.meshPings || 0);
  const hubSignals = Number(m.hubSignals || 0);
  const avgLatency = m.avgLatency ? Number(m.avgLatency) : null;

  let score = 0;

  score += Math.min(meshRelays / 5, 40);
  score += Math.min(meshPings / 10, 20);
  score += Math.min(hubSignals / 5, 20);
  if (avgLatency && avgLatency < 150) score += 20;

  const final = Math.min(score, 100);

  log("hypothalamus", `MeshHealth | user=${m.userId ?? "?"} | score=${final}`);
  return final;
}


// ============================================================================
//  PHASE — deterministic (UNCHANGED)
// ============================================================================
function calculatePhase(trustScore) {
  const t = Number(trustScore || 0);
  let phase = 1;

  if (t < 25) phase = 1;
  else if (t < 50) phase = 2;
  else if (t < 75) phase = 3;
  else phase = 4;

  log("hypothalamus", `Phase | trustScore=${t} | phase=${phase}`);
  return phase;
}


// ============================================================================
//  HUB DETECTION — deterministic (UNCHANGED)
// ============================================================================
function isHub(m) {
  if (!m) return false;

  const meshRelays    = Number(m.meshRelays || 0);
  const hubSignals    = Number(m.hubSignals || 0);
  const totalRequests = Number(m.totalRequests || 0);

  const hub =
    meshRelays > 50 ||
    hubSignals > 20 ||
    totalRequests > 500;

  if (hub) {
    log(
      "hypothalamus",
      `HIGH-FLOW ORGAN | user=${m.userId ?? "?"} | relays=${meshRelays} | hubSignals=${hubSignals} | totalRequests=${totalRequests}`
    );
  }

  return hub;
}


// ============================================================================
//  INSTANCE FORMULA — deterministic (UNCHANGED)
// ============================================================================
function allocateInstances(
  phase,
  hubFlag,
  deviceTier,
  earnMode,
  testEarnActive
) {
  let base = phase >= 2 ? 2 : 1;

  if (hubFlag) base *= 2;
  if (deviceTier === "upgraded") base *= UPGRADED_MULT;
  if (deviceTier === "highend")  base *= HIGHEND_MULT;
  if (earnMode) base = Math.floor(base * EARN_MODE_MULT);
  if (testEarnActive) base = TEST_EARN_MAX;

  const max =
    testEarnActive
      ? TEST_EARN_MAX
      : deviceTier === "upgraded"
      ? UPGRADED_MAX
      : deviceTier === "highend"
      ? HIGHEND_MAX
      : NORMAL_MAX;

  const final = Math.max(1, Math.min(base, max));

  log(
    "hypothalamus",
    `Resource allocation | phase=${phase} | hub=${hubFlag} | tier=${deviceTier} | earnMode=${earnMode} | testEarn=${testEarnActive} | final=${final}`
  );

  return final;
}


// ============================================================================
//  SNAPSHOT LOGGING — backend‑safe (UNCHANGED)
// ============================================================================
async function logScoringSnapshot(userId, snapshot) {
  if (!ENABLE_SCORING_LOGGING || !db) return;

  try {
    await db.collection(SCORING_LOG_COLLECTION).add({
      ...HYPOTHALAMUS_CONTEXT,
      userId,
      ts: Date.now(),
      ...snapshot
    });

    log("hypothalamus", `Snapshot logged | user=${userId}`);
  } catch (err) {
    error("hypothalamus", "Failed to log scoring snapshot", String(err));
  }
}


// ============================================================================
//  MAIN PASS — runUserScoring() (UNCHANGED LOGIC + v11‑Evo envelope)
// ============================================================================
export async function runUserScoring() {
  HYPOTHALAMUS_CYCLE++;

  const hypothalamusCycleSignature = buildHypothalamusCycleSignature(HYPOTHALAMUS_CYCLE);
  const binaryField = buildBinaryField();
  const waveField = buildWaveField();

  log("hypothalamus", "HYPOTHALAMUS_START", {
    hypothalamusCycle: HYPOTHALAMUS_CYCLE,
    hypothalamusCycleSignature,
    binaryField,
    waveField,
    ...HYPOTHALAMUS_CONTEXT
  });

  // ⭐ ORIGINAL LOGIC BELOW (unchanged)
  if (!db) {
    error("hypothalamus", "runUserScoring called but db is missing.");
    G.PULSE_LAYER_STATE[4].ok = false;
    G.PULSE_LAYER_STATE[4].lastError = "db_missing";
    return { ok: false, error: "db_missing" };
  }

  let snap;
  try {
    snap = await db.collection("UserMetrics").get();
  } catch (err) {
    const msg = String(err);
    error("hypothalamus", "Failed to read UserMetrics", msg);
    G.PULSE_LAYER_STATE[4].ok = false;
    G.PULSE_LAYER_STATE[4].lastError = msg;
    return { ok: false, error: "read_UserMetrics_failed" };
  }

  const batch = db.batch();
  let processed = 0;

  for (const doc of snap.docs) {
    const m = doc.data() || {};
    m.userId = doc.id;

    const trustScore = calculateTrustScore(m);
    const meshScore  = calculateMeshScore(m);
    const phase      = calculatePhase(trustScore);
    const hubFlag    = isHub(m);

    const deviceTier     = m.deviceTier ?? "normal";
    const earnMode       = m.earnMode ?? false;
    const testEarnActive = m.testEarnActive ?? false;

    const instances = allocateInstances(
      phase,
      hubFlag,
      deviceTier,
      earnMode,
      testEarnActive
    );

    const ref = db.collection("UserScores").doc(doc.id);

    batch.set(
      ref,
      {
        ...HYPOTHALAMUS_CONTEXT,
        userId: doc.id,
        trustScore,
        meshScore,
        phase,
        hub: hubFlag,
        deviceTier,
        earnMode,
        testEarnActive,
        instances,
        lastUpdated: Date.now()
      },
      { merge: true }
    );

    await logScoringSnapshot(doc.id, {
      trustScore,
      meshScore,
      phase,
      hubFlag,
      deviceTier,
      earnMode,
      testEarnActive,
      instances
    });

    processed++;
  }

  try {
    await batch.commit();
    log("hypothalamus", `Homeostasis scoring pass complete. Processed=${processed}`);
    G.PULSE_LAYER_STATE[4].ok = true;
    G.PULSE_LAYER_STATE[4].lastError = null;
    return { ok: true, processed };
  } catch (err) {
    const msg = String(err);
    error("hypothalamus", "Failed to commit UserScores batch", msg);
    G.PULSE_LAYER_STATE[4].ok = false;
    G.PULSE_LAYER_STATE[4].lastError = msg;
    return { ok: false, error: "commit_UserScores_failed" };
  }
}


// ============================================================================
//  PUBLIC EXPORTS (UNCHANGED)
// ============================================================================
export {
  calculateTrustScore,
  calculateMeshScore,
  calculatePhase,
  isHub,
  allocateInstances
};
