// ============================================================================
//  PulseProxyFront-v11-Evo.js
//  Binary-First Proxy Front • Legacy Fallback • Earned Route Memory
//  Connects Proxy → Field (binary) OR Proxy → Legacy Router (symbolic)
// ============================================================================
//
//  SAFETY CONTRACT:
//  • No imports.
//  • No randomness.
//  • No timestamps.
//  • Pure deterministic logic.
//  • Zero mutation outside instance.
// ============================================================================


// ============================================================================
//  INTERNAL HELPERS — deterministic, pure
// ============================================================================

function computeHash(str) {
  let h = 0;
  const s = String(str || "");
  for (let i = 0; i < s.length; i++) {
    h = (h + s.charCodeAt(i) * (i + 1)) % 100000;
  }
  return `h${h}`;
}

function buildRouteKey({ pattern, pageId, sourceId }) {
  const safePattern = String(pattern || "");
  const safePageId = String(pageId || "NO_PAGE");
  const safeSourceId = String(sourceId || "NO_SOURCE");
  return computeHash(`ROUTEKEY::${safePattern}::${safePageId}::${safeSourceId}`);
}

function buildBinaryField(bits) {
  const len = Array.isArray(bits) ? bits.length : 0;
  const ones = Array.isArray(bits)
    ? bits.reduce((acc, b) => (b === 1 ? acc + 1 : acc), 0)
    : 0;
  const zeros = len - ones;
  const density = len === 0 ? 0 : ones / len;
  const surface = len + ones * 3 + zeros;

  return {
    length: len,
    ones,
    zeros,
    density,
    surface,
    binaryPhenotypeSignature: `front-binary-pheno-${surface % 99991}`,
    binarySurfaceSignature: `front-binary-surface-${(surface * 7) % 99991}`,
    parity: surface % 2 === 0 ? 0 : 1,
    shiftDepth: Math.max(0, Math.floor(Math.log2(surface || 1)))
  };
}

function buildWaveField(pattern) {
  const safePattern = String(pattern || "");
  const plen = safePattern.length;

  const amplitude = Math.max(4, plen % 16);
  const wavelength = amplitude + 6;
  const phase = (plen * 3) % 32;

  let band = "root";
  if (safePattern.includes("router")) band = "router";
  else if (safePattern.includes("mesh")) band = "mesh";
  else if (safePattern.includes("send")) band = "send";
  else if (safePattern.includes("proxy")) band = "proxy";

  return {
    pattern: safePattern,
    amplitude,
    wavelength,
    phase,
    band,
    mode: "symbolic-wave",
    waveSignature: computeHash(
      `WAVE::${safePattern}::${amplitude}::${wavelength}::${phase}::${band}`
    )
  };
}

function buildFrontCycleSignature(cycle) {
  return computeHash(`FRONT_CYCLE::${cycle}`);
}

function isPureBinary(bits) {
  if (!Array.isArray(bits)) return false;
  for (let i = 0; i < bits.length; i++) {
    if (bits[i] !== 0 && bits[i] !== 1) return false;
  }
  return true;
}


// ============================================================================
//  ROUTE PLANNER — binary-first, fallback-safe, deterministic
// ============================================================================

let frontCycle = 0;

export function planProxyRoute({
  bits,
  pattern,
  pageId,
  sourceId,
  previousRouteMemory
}) {
  frontCycle++;

  const routeKey = buildRouteKey({ pattern, pageId, sourceId });
  const binaryField = buildBinaryField(bits);
  const waveField = buildWaveField(pattern);
  const frontCycleSignature = buildFrontCycleSignature(frontCycle);

  const pureBinary = isPureBinary(bits);

  let usedMemory = false;
  let decision = { mode: "binary" };

  if (previousRouteMemory && previousRouteMemory.routeKey === routeKey) {
    usedMemory = true;
    decision = previousRouteMemory.decision;
  } else {
    if (!pureBinary) {
      decision = { mode: "legacy" };
    } else {
      decision = { mode: "binary" };
    }
  }

  const routeMemory = {
    routeKey,
    decision,
    binaryField,
    waveField,
    frontCycle,
    frontCycleSignature
  };

  return {
    routeKey,
    decision,
    routeMemory,
    usedMemory
  };
}


// ============================================================================
//  PROXY FRONT — orchestrates binary-first routing with fallback
// ============================================================================

export function proxyFrontRoute({
  bits,
  pattern,
  pageId = "NO_PAGE",
  sourceId = "NO_SOURCE",
  previousRouteMemory = null,

  // external wiring (you pass these in)
  fieldIngest,     // function(bits) → packet
  legacyCreate     // function(params) → proxyObject
}) {
  const plan = planProxyRoute({
    bits,
    pattern,
    pageId,
    sourceId,
    previousRouteMemory
  });

  if (plan.decision.mode === "binary") {
    const packet = fieldIngest(bits);

    return {
      mode: "binary",
      routeKey: plan.routeKey,
      packet,
      routeMemory: plan.routeMemory,
      usedMemory: plan.usedMemory
    };
  }

  const proxy = legacyCreate({
    jobId: "NO_JOB",
    pattern,
    payload: {},
    priority: "normal",
    returnTo: null,
    parentLineage: null,
    pageId
  });

  return {
    mode: "legacy",
    routeKey: plan.routeKey,
    proxy,
    routeMemory: plan.routeMemory,
    usedMemory: plan.usedMemory
  };
}
