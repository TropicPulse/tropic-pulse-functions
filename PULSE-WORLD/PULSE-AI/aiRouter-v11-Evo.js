// ============================================================================
//  PULSE OS v12.3‑EVO+ — AI ROUTER ORGAN
//  CNS Router • Intent Decoder • Persona Selector • Archetype Map
//  PURE ROUTING • ZERO MUTATION • ZERO RANDOMNESS • DUALBAND‑AWARE
//  ROUTING ARTERY v3 (throughput, pressure, cost, budget)
// ============================================================================

export const AIRouterMeta = Object.freeze({
  layer: "PulseAIRouter",
  role: "CNS_ROUTER_ORGAN",
  version: "12.3-EVO+",
  identity: "aiRouter-v12.3-EVO+",

  evo: Object.freeze({
    driftProof: true,
    deterministic: true,
    dualband: true,
    binaryAware: true,
    symbolicAware: true,
    personaAware: true,
    boundaryAware: true,
    permissionAware: true,
    archetypeAware: true,
    routingAware: true,
    routingArteryAware: true,
    overmindAware: true,
    safetyAware: true,
    personalAware: true,
    multiInstanceReady: true,
    epoch: "12.3-EVO+"
  }),

  contract: Object.freeze({
    purpose:
      "Decode intent, select persona, map archetypes, integrate dual-band routing hints, and compute routing artery metrics v3 for CNS execution.",

    never: Object.freeze([
      "mutate request",
      "mutate persona",
      "mutate boundaries",
      "mutate permissions",
      "introduce randomness",
      "override cortex decisions",
      "override execution engine decisions",
      "perform cognition",
      "perform analysis",
      "perform writes",
      "generate symbolic state"
    ]),

    always: Object.freeze([
      "normalize intent deterministically",
      "extract flags deterministically",
      "select persona safely",
      "map archetypes deterministically",
      "integrate organism snapshot metrics",
      "compute routing artery metrics v3",
      "produce dual-band routing hints",
      "surface safety + overmind hints",
      "return frozen routing packets",
      "remain drift-proof",
      "remain non-blocking"
    ])
  })
});

import { Personas, getPersona } from "./persona.js";

// ============================================================================
//  ARCHETYPE PAGE MAP (STATIC METADATA)
// ============================================================================
const ArchetypePages = Object.freeze({
  ARCHITECT: "aiArchitect.js",
  ASSISTANT: "aiAssistant.js",
  BINARY_AGENT: "aiBinaryAgent.js",
  CLINICIAN: "aiClinician.js",
  DEBUG: "aiDebug.js",
  DIAGNOSTICS: "aiDiagnostics.js",
  DIAGNOSTICS_WRITE: "aiDiagnosticsWrite.js",
  DOCTOR: "aiDoctor.js",
  DOCTOR_ARCHITECT: "aiDoctorArchitect.js",
  EARN: "aiEarn.js",
  ENTREPRENEUR: "aiEntrepreneur.js",
  ENVIRONMENT: "aiEnvironment.js",
  EVOLUTION: "aiEvolution.js",
  EVOLUTIONARY: "aiEvolutionary.js",
  LAWYER: "aiLawyer.js",
  POWER: "aiPower.js",
  SURGEON: "aiSurgeon.js",
  TOURIST: "aiTourist.js",
  VETERINARIAN: "aiVeterinarian.js"
});

// ============================================================================
//  ROUTING ARTERY HELPERS (PURE, STATELESS)
// ============================================================================
function _bucketLevel(v) {
  if (v >= 0.9) return "elite";
  if (v >= 0.75) return "high";
  if (v >= 0.5) return "medium";
  if (v >= 0.25) return "low";
  return "critical";
}

function _bucketPressure(v) {
  if (v >= 0.9) return "overload";
  if (v >= 0.7) return "high";
  if (v >= 0.4) return "medium";
  if (v > 0) return "low";
  return "none";
}

function _bucketCost(v) {
  if (v >= 0.8) return "heavy";
  if (v >= 0.5) return "moderate";
  if (v >= 0.2) return "light";
  if (v > 0) return "negligible";
  return "none";
}

function computeRoutingArtery(flags, binaryLoad, personaId) {
  const flagValues = Object.values(flags || {});
  const activeFlags = flagValues.filter(Boolean).length;

  const flagDensity = Math.min(1, activeFlags / 16);
  const loadFactor = Math.min(1, binaryLoad);

  const pressure = Math.max(0, Math.min(1, (flagDensity + loadFactor) / 2));

  let personaBias = 0;
  if (personaId === Personas.ARCHITECT) personaBias = 0.1;
  else if (personaId === Personas.OBSERVER) personaBias = 0.05;
  else if (personaId === Personas.TOURGUIDE) personaBias = -0.05;

  const throughputBase = Math.max(0, 1 - pressure);
  const throughput = Math.max(
    0,
    Math.min(1, throughputBase + personaBias)
  );

  const cost = Math.max(0, Math.min(1, pressure * (1 - throughput)));
  const budget = Math.max(0, Math.min(1, throughput - cost));

  return Object.freeze({
    activeFlags,
    flagDensity,
    binaryLoad,
    throughput,
    pressure,
    cost,
    budget,
    throughputBucket: _bucketLevel(throughput),
    pressureBucket: _bucketPressure(pressure),
    costBucket: _bucketCost(cost),
    budgetBucket: _bucketLevel(budget)
  });
}

// ============================================================================
//  ARCHETYPE SELECTOR (DETERMINISTIC)
// ============================================================================
function selectPrimaryArchetypePage(personaId, flags) {
  const {
    touchesEnvironment,
    touchesPower,
    touchesEarn,
    touchesTourism,
    touchesUsers,
    touchesLogs,
    touchesRoutes,
    touchesErrors,
    touchesHistory,
    touchesPulse,
    touchesEvolution
  } = flags;

  if (personaId === Personas.ARCHITECT) {
    if (touchesEvolution && ArchetypePages.EVOLUTIONARY)
      return ArchetypePages.EVOLUTIONARY;
    return ArchetypePages.ARCHITECT || null;
  }

  if (personaId === Personas.OBSERVER) {
    if (
      (touchesLogs ||
        touchesRoutes ||
        touchesErrors ||
        touchesHistory ||
        touchesPulse) &&
      ArchetypePages.DIAGNOSTICS
    ) {
      return ArchetypePages.DIAGNOSTICS;
    }
    return ArchetypePages.DEBUG || ArchetypePages.DIAGNOSTICS || null;
  }

  if (personaId === Personas.TOURGUIDE) {
    if (touchesTourism && ArchetypePages.TOURIST)
      return ArchetypePages.TOURIST;
    return ArchetypePages.TOURIST || null;
  }

  if (personaId === Personas.NEUTRAL) {
    if (touchesEarn && ArchetypePages.EARN) return ArchetypePages.EARN;
    if (touchesUsers && ArchetypePages.ASSISTANT)
      return ArchetypePages.ASSISTANT;
    return ArchetypePages.ASSISTANT || ArchetypePages.ENTREPRENEUR || null;
  }

  return null;
}

// ============================================================================
//  DUAL‑BAND CNS ROUTER — symbolic + organism integration
// ============================================================================
export function routeAIRequest(request = {}, dualBand = null) {
  const reasoning = [];

  // --------------------------------------------------------------------------
  // 1) Intent Normalization
  // --------------------------------------------------------------------------
  const intent = (request.intent || "analyze").toLowerCase();
  reasoning.push(`Intent detected: "${intent}"`);

  const {
    touchesBackend = false,
    touchesFrontend = false,
    touchesSchemas = false,
    touchesFiles = false,
    touchesLogs = false,
    touchesRoutes = false,
    touchesErrors = false,
    touchesTourism = false,
    touchesUsers = false,
    touchesArchitecture = false,
    touchesEvolution = false,
    touchesEnvironment = false,
    touchesPower = false,
    touchesEarn = false,
    touchesPulse = false,
    touchesHistory = false,
    touchesSettings = false,
    userIsOwner = false,
    safetyMode: requestedSafetyMode = null
  } = request;

  const flags = Object.freeze({
    touchesBackend,
    touchesFrontend,
    touchesSchemas,
    touchesFiles,
    touchesLogs,
    touchesRoutes,
    touchesErrors,
    touchesTourism,
    touchesUsers,
    touchesArchitecture,
    touchesEvolution,
    touchesEnvironment,
    touchesPower,
    touchesEarn,
    touchesPulse,
    touchesHistory,
    touchesSettings,
    userIsOwner
  });

  Object.entries(flags).forEach(([k, v]) => {
    if (v) reasoning.push(`Flag: ${k.toUpperCase()}`);
  });

  // --------------------------------------------------------------------------
  // 2) Persona Selection
  // --------------------------------------------------------------------------
  let personaId = Personas.NEUTRAL;

  if (
    touchesArchitecture ||
    touchesEvolution ||
    touchesSchemas ||
    touchesBackend ||
    touchesFiles ||
    (touchesEnvironment && userIsOwner) ||
    (touchesPower && userIsOwner) ||
    (touchesEarn && userIsOwner) ||
    (touchesSettings && userIsOwner)
  ) {
    personaId = userIsOwner ? Personas.ARCHITECT : Personas.NEUTRAL;
    reasoning.push(
      userIsOwner
        ? "Routing to ARCHITECT persona (system-level request)."
        : "User not owner — cannot route to ARCHITECT persona."
    );
  } else if (
    touchesLogs ||
    touchesRoutes ||
    touchesErrors ||
    touchesHistory ||
    touchesPulse
  ) {
    personaId = Personas.OBSERVER;
    reasoning.push("Routing to OBSERVER persona (diagnostic request).");
  } else if (touchesTourism || touchesUsers || touchesEarn || touchesPulse) {
    personaId = Personas.TOURGUIDE;
    reasoning.push("Routing to TOUR GUIDE persona (user-facing request).");
  } else {
    personaId = Personas.NEUTRAL;
    reasoning.push("Routing to NEUTRAL persona (generic request).");
  }

  const persona = getPersona(personaId);
  const permissions = persona?.permissions || {};
  const boundaries = persona?.boundaries || {};

  reasoning.push(`Persona selected: ${personaId}`);

  // --------------------------------------------------------------------------
  // 3) Archetype Mapping
  // --------------------------------------------------------------------------
  const primaryArchetypePage = selectPrimaryArchetypePage(personaId, flags);

  const archetypes = Object.freeze({
    primaryPage: primaryArchetypePage,
    pages: { ...ArchetypePages }
  });

  if (primaryArchetypePage) {
    reasoning.push(`Primary archetype page: ${primaryArchetypePage}`);
  }

  // --------------------------------------------------------------------------
  // 4) Dual‑Band Integration (Organism Snapshot Metrics)
// --------------------------------------------------------------------------
  let organismSnapshotBits = 0;
  let binaryPressure = 0;
  let binaryLoad = 0;

  if (dualBand?.organism?.organismSnapshot) {
    const snapshot = dualBand.organism.organismSnapshot();
    if (typeof snapshot === "string") {
      organismSnapshotBits = snapshot.length;

      binaryLoad = Math.min(1, organismSnapshotBits / 4096);
      binaryPressure = binaryLoad;

      reasoning.push(
        `Organism snapshot: bits=${organismSnapshotBits}, load=${binaryLoad}, pressure=${binaryPressure}`
      );
    }
  }

  // --------------------------------------------------------------------------
  // 5) Dual‑Band Routing Hints
  // --------------------------------------------------------------------------
  const dualBandHints = Object.freeze({
    primary: "binary",
    secondary: "symbolic",
    binaryPressure,
    binaryLoad,
    symbolicLoadAllowed:
      persona?.symbolicLoadAllowed ??
      (personaId === Personas.ARCHITECT
        ? 0.4
        : personaId === Personas.OBSERVER
        ? 0.3
        : personaId === Personas.TOURGUIDE
        ? 0.5
        : 0.3),
    binaryPressureOverride: persona?.binaryPressureOverride ?? false
  });

  reasoning.push(
    `Dual-band: binaryLoad=${binaryLoad}, binaryPressure=${binaryPressure}, symbolicLoad=${dualBandHints.symbolicLoadAllowed}`
  );

  // --------------------------------------------------------------------------
  // 6) Routing Artery v3 (pure, stateless)
// --------------------------------------------------------------------------
  const artery = computeRoutingArtery(flags, binaryLoad, personaId);

  reasoning.push(
    `Routing artery: throughput=${artery.throughput.toFixed(
      2
    )} (${artery.throughputBucket}), pressure=${artery.pressure.toFixed(
      2
    )} (${artery.pressureBucket}), budget=${artery.budget.toFixed(
      2
    )} (${artery.budgetBucket})`
  );

  // --------------------------------------------------------------------------
  // 7) Overmind + Safety + Personal Hints
  // --------------------------------------------------------------------------
  const safetyMode =
    requestedSafetyMode || persona?.safetyMode || "standard";

  const overmindHints = Object.freeze({
    intent,
    personaId,
    safetyMode,
    flags,
    archetypePrimaryPage: primaryArchetypePage || null
  });

  const personaSafety = Object.freeze({
    safetyMode,
    boundaries,
    permissions
  });

  reasoning.push(`Safety mode: ${safetyMode}`);

  // --------------------------------------------------------------------------
  // 8) Return Routing Packet
  // --------------------------------------------------------------------------
  return Object.freeze({
    meta: AIRouterMeta,
    personaId,
    persona,
    permissions,
    boundaries,
    archetypes,
    dualBand: dualBandHints,
    overmind: overmindHints,
    personaSafety,
    artery,
    reasoning
  });
}

// ============================================================================
//  EXPLAIN ROUTING — Interpreter Summary
// ============================================================================
export function explainRoutingDecision(request = {}, dualBand = null) {
  const result = routeAIRequest(request, dualBand);

  return Object.freeze({
    personaId: result.personaId,
    archetypePrimaryPage: result.archetypes?.primaryPage || null,
    dualBand: result.dualBand,
    safetyMode: result.personaSafety?.safetyMode || "standard",
    artery: result.artery,
    reasoning: result.reasoning
  });
}

// ============================================================================
//  DUAL‑MODE EXPORTS (ESM + CommonJS)
// ============================================================================
if (typeof module !== "undefined") {
  module.exports = {
    AIRouterMeta,
    routeAIRequest,
    explainRoutingDecision
  };
}
