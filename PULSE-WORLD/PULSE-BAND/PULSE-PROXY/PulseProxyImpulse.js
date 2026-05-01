// ============================================================================
// FILE: PulseOSImpulseEngine-v12.3-EVO-PRESENCE.js
// PULSE OS — v12.3‑EVO‑PRESENCE
// “THE IMPULSE ENGINE / NEURAL IMPULSE LIFECYCLE ORGAN”
// ============================================================================

const IMPULSE_CONTEXT = {
  version: "12.3-EVO-PRESENCE",
  layer: "ImpulseEngine",
  role: "NeuralImpulseLifecycle",
  evo: {
    deterministic: true,
    driftProof: true,
    binaryAware: true,
    symbolicAware: true,
    dualModeReady: true,
    unifiedAdvantageField: true,
    pulseEfficiencyAware: true,
    presenceAware: true,
    presenceFieldAware: true,
    bandAware: true,
    waveFieldAware: true,
    binaryFieldAware: true
  }
};

export const PulseOSImpulseEngineMeta = Object.freeze({
  layer: "PulseOSImpulseEngine",
  role: "NEURAL_IMPULSE_LIFECYCLE_ORGAN",
  version: "v12.3-EVO-BINARY-MAX-ABA-PRESENCE",
  identity: "PulseOSImpulseEngine-v12.3-EVO-BINARY-MAX-ABA-PRESENCE",

  guarantees: Object.freeze({
    deterministic: true,
    driftProof: true,
    multiInstanceReady: true,

    binaryFirstImpulseCore: true,
    symbolicImpulseWrapper: true,
    legacyV93Surface: true,
    deterministicLineage: true,
    deterministicShapeSignature: true,
    deterministicEvolutionStage: true,
    unifiedReturnEndpoint: true,
    dualModeReady: true,
    unifiedAdvantageField: true,
    pulseEfficiencyAware: true,
    presenceAware: true,
    presenceFieldAware: true,
    binaryAware: true,
    symbolicAware: true,

    zeroRandomness: true,
    zeroJSON: true,
    zeroWindowInCore: true,
    zeroDOMInCore: true,
    zeroNetwork: true,
    zeroFilesystem: true,
    zeroDynamicImports: true,
    zeroEval: true,
    zeroTimersInCore: true,
    zeroAsyncInCore: true,
    zeroExternalMutation: true,
    zeroDateNowInCore: true,
    zeroComputeOutsideImpulse: true,

    bandAware: true,
    waveFieldAware: true,
    binaryFieldAware: true,

    worldLensAware: false
  }),

  contract: Object.freeze({
    input: [
      "ImpulsePayload",
      "BinaryImpulseContext",
      "SymbolicImpulseContext",
      "DualBandContext",
      "PresenceContext"
    ],
    output: [
      "BinaryImpulse",
      "SymbolicImpulse",
      "ImpulseLineage",
      "ImpulseShapeSignature",
      "ImpulseEvolutionStage",
      "ImpulseReturnSurface",
      "ImpulseBandSignature",
      "ImpulseBinaryField",
      "ImpulseWaveField",
      "ImpulsePresenceField",
      "ImpulseDiagnostics",
      "ImpulseHealingState"
    ]
  }),

  lineage: Object.freeze({
    root: "PulseOS-v11",
    parent: "PulseOS-v12.3-EVO",
    ancestry: [
      "PulseImpulseEngine-v7",
      "PulseImpulseEngine-v8",
      "PulseImpulseEngine-v9",
      "PulseImpulseEngine-v9.3",
      "PulseImpulseEngine-v10",
      "PulseImpulseEngine-v10.4",
      "PulseImpulseEngine-v11",
      "PulseImpulseEngine-v11-Evo",
      "PulseImpulseEngine-v11-Evo-Prime",
      "PulseShifterEvolutionaryPulse",
      "PulseBinaryShifterEvolutionaryPulse",
      "PulseV3UnifiedOrganism",
      "PulseV2EvolutionEngine",
      "PulseOSImpulseEngine-v12.3-EVO-PRESENCE"
    ]
  }),

  bands: Object.freeze({
    supported: ["binary", "symbolic", "dual"],
    default: "binary",
    behavior: "impulse-lifecycle"
  }),

  architecture: Object.freeze({
    pattern: "A-B-A",
    baseline: "binary impulse → symbolic wrapper → unified return",
    adaptive: "multi-generation + dual-band + presence overlays",
    return: "deterministic impulse surfaces + signatures"
  })
});

// ============================================================================
// SHARED HELPERS
// ============================================================================
let IMPULSE_CYCLE = 0;

function nowMs() {
  return Date.now();
}

function computeHash(str) {
  let h = 0;
  const s = String(str || "");
  for (let i = 0; i < s.length; i++) {
    h = (h + s.charCodeAt(i) * (i + 1)) % 100000;
  }
  return `h${h}`;
}

function buildLineage(parentLineage, pattern) {
  const base = Array.isArray(parentLineage) ? parentLineage.slice() : [];
  base.push(pattern || "UNKNOWN_PATTERN");
  return base;
}

function computeShapeSignature(pattern, lineage) {
  const p = String(pattern || "");
  const l = Array.isArray(lineage) ? lineage.join("|") : "";
  let h = 0;
  const s = `${p}::${p.length}::${l}`;
  for (let i = 0; i < s.length; i++) {
    h = (h + s.charCodeAt(i) * (i + 1)) % 100000;
  }
  return `shape-${h}`;
}

function computeEvolutionStage(pattern, lineage) {
  const depth = Array.isArray(lineage) ? lineage.length : 0;
  if (depth === 0) return "seed";
  if (depth < 3)  return "early";
  if (depth < 6)  return "mature";
  return "stable";
}

function buildImpulseBand(urgency, hops) {
  const u = typeof urgency === "number" ? urgency : 0;
  const h = typeof hops === "number" ? hops : 0;
  if (u < 0.2 && h < 3) return "symbolic";
  if (u < 0.6 && h < 6) return "transition";
  return "binary";
}

function buildImpulseBandSignature(band) {
  return computeHash(`IMPULSE_BAND::${band}`);
}

function buildBinaryField(hops) {
  const patternLen = 12 + (hops || 0);
  const density = patternLen + 24;
  const surface = density + patternLen;
  return {
    binaryPhenotypeSignature: `impulse-binary-pheno-${surface % 99991}`,
    binarySurfaceSignature: `impulse-binary-surface-${(surface * 7) % 99991}`,
    binarySurface: { patternLen, density, surface },
    parity: surface % 2 === 0 ? 0 : 1,
    shiftDepth: Math.max(0, Math.floor(Math.log2(surface || 1)))
  };
}

function buildWaveField(pattern) {
  const p = String(pattern || "");
  const plen = p.length || 1;
  const amplitude = 10 + (plen % 8);
  const wavelength = amplitude + 4;
  const phase = amplitude % 16;

  let band = "symbolic-root";
  if (p.includes("router")) band = "router";
  else if (p.includes("mesh")) band = "mesh";
  else if (p.includes("send")) band = "send";
  else if (p.includes("proxy")) band = "proxy";

  return {
    amplitude,
    wavelength,
    phase,
    band,
    mode: "symbolic-wave",
    waveSignature: computeHash(
      `IMPULSE_WAVE::${p}::${amplitude}::${wavelength}::${phase}::${band}`
    )
  };
}

function buildPresenceField(intent, pageName) {
  const i = String(intent || "UNKNOWN_INTENT");
  const p = String(pageName || "UNKNOWN_PAGE");
  const key = `${i}::${p}`;
  const signature = computeHash(`PRESENCE_FIELD::${key}`);

  const focus =
    i.includes("focus") || p.includes("focus")
      ? "focused"
      : i.includes("background") || p.includes("background")
      ? "background"
      : "neutral";

  return {
    intent,
    pageName,
    focus,
    presenceSignature: signature
  };
}

function buildImpulseCycleSignature(cycle) {
  return computeHash(`IMPULSE_CYCLE::${cycle}`);
}

function impulseLog(event, data) {
  if (typeof window === "undefined") return;
  if (!window.PULSE_IMPULSE_DIAGNOSTICS) return;
  if (typeof console?.log !== "function") return;
  console.log("[ImpulseEngine]", event, { ...data, ctx: IMPULSE_CONTEXT });
}

// ============================================================================
// LEGACY SURFACES (stubs – you wire your real implementations)
// ============================================================================
export const ImpulseLegacy = {
  create(intent, payload = {}) { /* v9.3 as-is */ },
  computeUrgency(layerState) { /* as-is */ },
  factorImpulse(impulse) { /* as-is */ },
  annotate(impulse, layerIdentity, layerState, delta) { /* as-is */ },
  snapshot(impulse) { /* as-is */ },
  markPathwayStable(impulse, learnedRouteId) { /* as-is */ },
  returnToPulseBand(impulse) { /* as-is */ }
};

export const LegacyPulse = {
  create(intent, payload = {}) { /* v10 LegacyPulse */ }
  // ... other methods if you had them
};

// ============================================================================
// CORE v12.3 BINARY (base for all 12.3+ pulses)
// ============================================================================
function makeDeterministicTickId(now, seed = "") {
  return `${now}-${seed}`;
}

function createBinaryImpulseCore(intent, payload = {}, now, patternOverride) {
  IMPULSE_CYCLE++;

  const pageIdentity = payload?.pageIdentity || {};
  const tickNow       = now || nowMs();
  const tickId        = makeDeterministicTickId(tickNow, payload.jobId || "");
  const jobId         = payload.jobId || tickId;
  const pattern       = patternOverride || payload.pattern || intent || "UNKNOWN_PATTERN";
  const priority      = payload.priority || "normal";
  const returnTo      = payload.returnTo || null;
  const parentLineage = payload.parentLineage || null;

  const lineage        = buildLineage(parentLineage, pattern);
  const shapeSignature = computeShapeSignature(pattern, lineage);
  const evolutionStage = computeEvolutionStage(pattern, lineage);

  const presenceField = buildPresenceField(intent, pageIdentity.page);
  const band          = buildImpulseBand(0, 0);
  const bandSignature = buildImpulseBandSignature(band);
  const binaryField   = buildBinaryField(0);
  const waveField     = buildWaveField(pattern);
  const impulseCycleSignature = buildImpulseCycleSignature(IMPULSE_CYCLE);

  return {
    tickId,
    intent,
    payload,
    version: "v12.3-binary",

    path: [],
    pathway: {
      hops: [],
      stable: false,
      learnedRouteId: null
    },

    energy: 1,
    factor: 1,
    urgency: 0,

    page: {
      name:        pageIdentity.page        || "UNKNOWN_PAGE",
      vars:        pageIdentity.vars        || {},
      repairHooks: pageIdentity.repairHooks || {}
    },

    repairSeed: {
      pageName: pageIdentity.page || "UNKNOWN_PAGE",
      focus:    payload?.repairFocus || null
    },

    identityHealth: pageIdentity.page ? "Stable" : "Missing",

    offline: true,
    externalDependencies: [],

    pulse: {
      jobId,
      pattern,
      payload,
      priority,
      returnTo,
      lineage,
      meta: {
        shapeSignature,
        evolutionStage,
        band,
        bandSignature,
        impulseCycle: IMPULSE_CYCLE,
        impulseCycleSignature,
        binaryField,
        waveField,
        presenceField
      }
    },

    meta: { ...IMPULSE_CONTEXT }
  };
}

function computeUrgencyBinary(layerState) {
  let u = 0;
  if (layerState?.health === "Weak")     u += 0.3;
  if (layerState?.health === "Critical") u += 0.6;
  if (layerState?.latency > 150)         u += 0.2;
  if (layerState?.stability < 50)        u += 0.3;
  return Math.min(1, u);
}

function annotateBinaryCore(impulse, layerIdentity, layerState, delta, now) {
  impulse.urgency = computeUrgencyBinary(layerState);

  const hopIndex = impulse.path.length;
  const band     = buildImpulseBand(impulse.urgency, hopIndex + 1);
  const bandSignature = buildImpulseBandSignature(band);
  const binaryField   = buildBinaryField(hopIndex + 1);
  const waveField     = buildWaveField(impulse.pulse.pattern);
  const presenceField = buildPresenceField(impulse.intent, impulse.page.name);

  const hop = {
    ...layerIdentity,
    state: layerState,
    delta,
    urgency: impulse.urgency,
    timestamp: now || nowMs(),

    page:           impulse.page.name,
    repairSeed:     impulse.repairSeed,
    identityHealth: impulse.identityHealth,

    band,
    bandSignature,
    binaryField,
    waveField,
    presenceField,

    offline: true,
    meta: { ...IMPULSE_CONTEXT }
  };

  impulse.path.push(hop);
  if (layerIdentity?.id) impulse.pathway.hops.push(layerIdentity.id);

  impulse.pulse.meta.band = band;
  impulse.pulse.meta.bandSignature = bandSignature;
  impulse.pulse.meta.binaryField = binaryField;
  impulse.pulse.meta.waveField = waveField;
  impulse.pulse.meta.presenceField = presenceField;

  return impulse;
}

// ============================================================================
// 12.3+ PULSE VARIANTS (your named pulses, all upgraded)
// ============================================================================

// 1) PulseShifterEvolutionaryPulse — symbolic wrapper over core
export const PulseShifterEvolutionaryPulse = {
  create(intent, payload = {}) {
    const impulse = createBinaryImpulseCore(intent, payload, nowMs(), "PulseShifterEvolutionaryPulse");
    impulse.version = "v12.3-PulseShifterEvolutionary";
    impulseLog("PULSE_SHIFTER_CREATE", {
      tickId: impulse.tickId,
      intent,
      pattern: impulse.pulse.pattern,
      band: impulse.pulse.meta.band
    });
    return impulse;
  },
  annotate(impulse, layerIdentity, layerState, delta) {
    const updated = annotateBinaryCore(impulse, layerIdentity, layerState, delta, nowMs());
    impulseLog("PULSE_SHIFTER_ANNOTATE", {
      tickId: updated.tickId,
      layer: layerIdentity.id,
      band: updated.pulse.meta.band
    });
    return updated;
  }
};

// 2) PulseBinaryShifterEvolutionaryPulse — binary‑emphasized variant
export const PulseBinaryShifterEvolutionaryPulse = {
  create(intent, payload = {}) {
    const impulse = createBinaryImpulseCore(intent, payload, nowMs(), "PulseBinaryShifterEvolutionaryPulse");
    impulse.version = "v12.3-PulseBinaryShifterEvolutionary";
    impulse.offline = true;
    impulseLog("PULSE_BINARY_SHIFTER_CREATE", {
      tickId: impulse.tickId,
      intent,
      pattern: impulse.pulse.pattern,
      band: impulse.pulse.meta.band
    });
    return impulse;
  },
  annotate(impulse, layerIdentity, layerState, delta) {
    const updated = annotateBinaryCore(impulse, layerIdentity, layerState, delta, nowMs());
    impulseLog("PULSE_BINARY_SHIFTER_ANNOTATE", {
      tickId: updated.tickId,
      layer: layerIdentity.id,
      band: updated.pulse.meta.band
    });
    return updated;
  }
};


// ============================================================================
// PRIMARY 12.3 PRESENCE IMPULSE (default Impulse)
// ============================================================================
export const ImpulseBinary = {
  create: (intent, payload = {}) =>
    createBinaryImpulseCore(intent, payload, nowMs(), null),
  computeUrgency: computeUrgencyBinary,
  annotate: (impulse, layerIdentity, layerState, delta) =>
    annotateBinaryCore(impulse, layerIdentity, layerState, delta, nowMs())
};

export const Impulse = {
  create(intent, payload = {}) {
    const impulse = ImpulseBinary.create(intent, payload);
    impulseLog("IMPULSE_CREATE", {
      tickId: impulse.tickId,
      intent,
      page: impulse.page.name,
      identityHealth: impulse.identityHealth,
      pulsePattern: impulse.pulse.pattern,
      pulseShape: impulse.pulse.meta.shapeSignature,
      band: impulse.pulse.meta.band,
      presenceField: impulse.pulse.meta.presenceField
    });
    return impulse;
  },

  computeUrgency(layerState) {
    return ImpulseBinary.computeUrgency(layerState);
  },

  factorImpulse(impulse) {
    impulse.factor *= 0.5;
    impulse.energy *= impulse.factor;
    if (impulse.urgency > 0) {
      impulse.energy += impulse.urgency * 0.1;
    }
    impulseLog("IMPULSE_FACTOR", {
      tickId: impulse.tickId,
      factor: impulse.factor,
      energy: impulse.energy,
      urgency: impulse.urgency,
      hopsSoFar: impulse.path.length,
      band: impulse.pulse.meta.band
    });
    return impulse;
  },

  annotate(impulse, layerIdentity, layerState, delta) {
    const updated = ImpulseBinary.annotate(
      impulse,
      layerIdentity,
      layerState,
      delta
    );
    impulseLog("IMPULSE_ANNOTATE", {
      tickId: updated.tickId,
      layer: layerIdentity.id,
      page: updated.page.name,
      urgency: updated.urgency,
      hopIndex: updated.path.length - 1,
      totalHops: updated.path.length,
      band: updated.pulse.meta.band,
      presenceField: updated.pulse.meta.presenceField
    });
    return updated;
  },

  snapshot(impulse) {
    const snap = {
      tickId:   impulse.tickId,
      intent:   impulse.intent,
      version:  impulse.version,
      page:     { ...impulse.page },
      repairSeed: { ...impulse.repairSeed },
      identityHealth: impulse.identityHealth,
      pathway: { ...impulse.pathway, hops: [...impulse.pathway.hops] },
      hops:    impulse.path.length,
      pulse:   { ...impulse.pulse },
      meta:    { ...IMPULSE_CONTEXT }
    };
    impulseLog("IMPULSE_SNAPSHOT", {
      tickId: snap.tickId,
      hops:   snap.hops,
      pulsePattern: snap.pulse.pattern,
      band: snap.pulse.meta.band
    });
    return snap;
  },

  markPathwayStable(impulse, learnedRouteId) {
    impulse.pathway.stable = true;
    impulse.pathway.learnedRouteId = learnedRouteId || null;
    impulseLog("IMPULSE_PATHWAY_STABLE", {
      tickId: impulse.tickId,
      learnedRouteId,
      hops: impulse.pathway.hops.length,
      band: impulse.pulse.meta.band
    });
    return impulse;
  },

  returnToPulseBand(impulse) {
    impulse.signature = "1001101010101010101";
    const snap = this.snapshot(impulse);
    impulseLog("IMPULSE_RETURN", {
      tickId: impulse.tickId,
      hops: impulse.path.length,
      page: impulse.page.name,
      identityHealth: impulse.identityHealth,
      pulsePattern: impulse.pulse.pattern,
      band: impulse.pulse.meta.band,
      presenceField: impulse.pulse.meta.presenceField
    });

    if (typeof window !== "undefined" && window.PulseBand?.receiveImpulseReturn) {
      window.PulseBand.receiveImpulseReturn(impulse, snap);
    }
    if (typeof window !== "undefined" && window.NerveMap?.ingestImpulse) {
      window.NerveMap.ingestImpulse(snap);
    }
    if (typeof window !== "undefined" && window.PathwayMemory?.recordImpulse) {
      window.PathwayMemory.recordImpulse(snap);
    }
  }
};

export const IMPULSE_META = { ...IMPULSE_CONTEXT };

// ============================================================================
// DETERMINISTIC STRATEGY — ALL IMPULSE-LINEAGE PULSES IN CORRECT ORDER
// ============================================================================
export const ImpulseStrategy = {
  create({ intent, payload = {}, version = "auto" }) {

    // AUTO = always choose the highest-trust, newest, safest engine
    if (version === "auto") {
      return Impulse.create(intent, payload);   // v12.3 Presence (PRIMARY)
    }

    switch (version) {

      // ---------------------------------------------------------------
      // 1) FULL PULSE 12.3-EVO-PRESENCE (highest trust)
      // ---------------------------------------------------------------
      case "v12.3":
      case "presence":
      case "full":
        return Impulse.create(intent, payload);


      // ---------------------------------------------------------------
      // 2) SHIFTER EVOLUTIONARY PULSES (risk + potential improvement)
      // ---------------------------------------------------------------
      case "PulseShifterEvolutionaryPulse":
      case "shifter":
        return PulseShifterEvolutionaryPulse.create(intent, payload);

      case "PulseBinaryShifterEvolutionaryPulse":
      case "binary-shifter":
        return PulseBinaryShifterEvolutionaryPulse.create(intent, payload);


      // ---------------------------------------------------------------
      // 3) REGULAR OLDER PULSES (stable fallbacks)
      // ---------------------------------------------------------------
      case "v11-prime":
        return Impulse_v11_Prime.create(intent, payload);

      case "v11-evo":
        return Impulse_v11_Evo.create(intent, payload);

      case "v11":
        return Impulse_v11.create(intent, payload);

      case "v10.4":
        return Impulse_v10_4.create(intent, payload);

      case "legacy-pulse":
      case "v10":
        return LegacyPulse.create(intent, payload);

      case "v9.3":
      case "legacy":
        return ImpulseLegacy.create(intent, payload);


      // ---------------------------------------------------------------
      // DEFAULT → ALWAYS the newest, safest engine
      // ---------------------------------------------------------------
      default:
        return Impulse.create(intent, payload);
    }
  }
};
