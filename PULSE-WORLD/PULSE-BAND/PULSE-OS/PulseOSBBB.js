// ============================================================================
//  PULSE OS v11 — OUTER BLOOD–BRAIN BARRIER (Outer BBB)
//  Perivascular Shield • Shell Gatekeeper • Environmental Filter
//  PURE PERMISSION. NO BACKEND. NO NETWORK. NO UI.
//  DUALBAND: SYMBOLIC SURFACE + BINARY-AWARE METADATA (NO BINARY EXECUTION)
// ============================================================================
//
//  IDENTITY — OUTER BBB (v11):
//  ---------------------------
//  • First defensive membrane of the PulseOS organism.
//  • Filters environmental context before it reaches the cortex (PulseOSBrain).
//  • Determines whether PulseBand / PNS nervous system may exist on this route.
//  • Distinguishes SAFE vs UNSAFE environments.
//  • Blocks identity access unless conditions are met.
//  • Protects the inner BBB (Identity Organ) from contamination.
//  • Fully LOCAL-FIRST — zero backend, zero network dependency.
//  • Drift-proof, deterministic, offline-capable.
//  • Pure shell-state engine — no side effects.
//  • Dualband-aware: symbolic routing surface + binary compression metadata.
//    (Binary is a post-render compression pass elsewhere, never here.)
//
//  ROLE IN THE DIGITAL BODY (v11):
//  -------------------------------
//  • Environmental Filter → Screens unsafe routes.
//  • Shell Gatekeeper → Controls PulseBand existence.
//  • Identity Sentinel → Blocks unauthorized identity flow.
//  • Permission Valve → Determines anon/auth/no-shell modes.
//  • Cortex Perimeter → Protects PulseOSBrain + Identity Organ.
//  • Offline Autonomy → Works even with WiFi OFF.
//  • **Outer BBB = Shell Permission + Trust Boundary + Continuance Guard**.
//
//  WHAT THIS FILE IS (v11):
//  ------------------------
//  • Global shell boundary for PulseOS.
//  • Single source of truth for shell state.
//  • Permission engine for PulseBand existence.
//  • Identity-access gate for the frontend layer.
//  • Environmental classifier for all routes.
//  • First line of defense in the trust chain.
//  • Fully local — no backend calls required.
//  • Pure logic — no side effects, no mutations.
//  • Deterministic continuance membrane (never blocks the organism, only shapes access).
//  • Dualband contract surface for CNS + Router + SendSystem.
//
//  WHAT THIS FILE IS NOT (v11):
//  ----------------------------
//  • NOT a backend module.
//  • NOT an identity loader.
//  • NOT a UI renderer.
//  • NOT a healing engine.
//  • NOT a session validator.
//  • NOT a compute engine.
//  • NOT a place for dynamic imports or eval.
//  • NOT dependent on network state.
//  • NOT allowed to mutate identity or memory.
//  • NOT a binary executor (binary is post-render compression elsewhere).
//
//  SAFETY CONTRACT (v11):
//  ----------------------
//  • No backend calls.
//  • No identity mutation.
//  • No UI logic.
//  • No compute.
//  • No dynamic imports.
//  • Deterministic, drift-proof shell-state behavior only.
//  • Local-only permission logic.
//  • Offline continuity guaranteed.
//  • Pure function purity — no side effects.
//  • Compatible with:
//      - PulseOS v11
//      - PulseRouter-v11
//      - PulseSendSystem-v11
//      - PulseGPU-v11 (metadata only, no GPU calls)
// ============================================================================
// ============================================================================
//  PulseOSOuterBBB-v12.3-Spine.js
//  OUTER BLOOD–BRAIN BARRIER — OS SHELL PERIMETER (v12.3-SPINE)
//  Dualband, Presence-Aware, Chunk/Prewarm-Aware, Deterministic Shell Gate
// ============================================================================
/*
AI_EXPERIENCE_META = {
  identity: "PulseOSBBB",
  version: "v14-IMMORTAL",
  layer: "os_bridge",
  role: "binary_symbolic_bridge",
  lineage: "PulseOS-v14",

  evo: {
    dualBand: true,
    symbolicPrimary: true,
    binaryAware: true,

    deterministic: true,
    driftProof: true,
    zeroNetwork: true,
    zeroFilesystem: true,

    bandAware: true,
    chunkAware: true,
    prewarmAware: true,

    safeRouteFree: true,
    zeroMutationOfInput: true
  },

  contract: {
    always: [
      "PulseOSBrain",
      "PulseBinaryOS",
      "PulseChunker"
    ],
    never: [
      "legacyOSBBB",
      "safeRoute",
      "fetchViaCNS"
    ]
  }
}
*/

export const PulseOSOuterBBBMeta = Object.freeze({
  layer: "PulseOSOuterBBB",
  role: "OS_OUTER_BBB_ORGAN",
  version: "v12.3-SPINE",
  identity: "PulseOSOuterBBB-v12.3-SPINE",

  guarantees: Object.freeze({
    deterministic: true,
    driftProof: true,
    multiInstanceReady: true,

    // Barrier laws
    pureShellStateEngine: true,
    purePermissionEngine: true,
    environmentalFilter: true,
    identitySentinel: true,
    permissionValve: true,
    cortexPerimeter: true,
    offlineAutonomy: true,

    // Safety contract
    zeroNetwork: true,
    zeroBackend: true,
    zeroFilesystem: true,
    zeroCompute: true,
    zeroUI: true,
    zeroIdentityMutation: true,
    zeroDynamicImports: true,
    zeroEval: true,
    zeroBinaryExecution: true,
    zeroMutationOutsideOrgan: true,

    // Dualband + presence + performance awareness
    dualBandAware: true,
    symbolicSurface: true,
    binaryCompressionSurface: true,
    presenceFieldAware: true,
    bluetoothPresenceAware: true,
    meshPresenceRelayAware: true,
    routeChunkingAware: true,
    routePrewarmAware: true,
    cachePolicyAware: true,

    // Continuance + loop
    loopTheoryAware: true,
    continuanceAware: true,

    // Environment
    worldLensAware: false
  }),

  contract: Object.freeze({
    input: [
      "RouteContext",
      "ShellEnvironment",
      "DualBandContext",
      "PresenceContext",      // presence field + bluetooth presence
      "MeshPresenceContext"   // mesh presence relay / topology
    ],
    output: [
      "OuterBBBPermissionState",
      "OuterBBBRouteClassification",
      "OuterBBBDiagnostics",
      "OuterBBBSignatures",
      "OuterBBBCacheHints",        // chunk/prewarm hints for shell
      "OuterBBBPresenceDirectives" // presence/mesh directives (metadata only)
    ]
  }),

  lineage: Object.freeze({
    root: "PulseOS-v12.3-SPINE",
    parent: "PulseOS-v12.0-SPINE",
    ancestry: [
      "PulseOSOuterBBB-v9",
      "PulseOSOuterBBB-v10",
      "PulseOSOuterBBB-v11",
      "PulseOSOuterBBB-v11.2-EVO",
      "PulseOSOuterBBB-v12.3-SPINE"
    ]
  }),

  bands: Object.freeze({
    supported: ["symbolic"],
    default: "symbolic",
    behavior: "metadata-only"
  }),

  architecture: Object.freeze({
    pattern: "A-B-A",
    baseline: "environmental filter → shell permission → identity gate",
    adaptive:
      "dualband metadata surfaces (symbolic + binary compression) + presence/mesh hints + chunk/prewarm hints",
    return:
      "deterministic shell permission + route classification + cache/presence directives"
  })
});


// ============================================================================
//  OUTER BBB ROLE — Dualband, organism-wide contract surface (v12.3-SPINE)
//  (Metadata only; no imports, no side effects)
// ============================================================================
export const PulseRole = {
  type: "Barrier",
  subsystem: "OS",
  layer: "OuterBBB",
  version: "12.3-SPINE",
  identity: "PulseOSOuterBBB",

  evo: {
    deterministic: true,
    driftProof: true,
    multiInstanceReady: true,
    unifiedAdvantageField: true,
    zeroNetwork: true,
    zeroBackend: true,
    zeroFilesystem: true,
    zeroMutationOutsideOrgan: true,

    // Dualband awareness (symbolic + binary metadata)
    dualBand: true,
    symbolicSurface: true,
    binaryCompressionSurface: true,

    // Presence / mesh / performance metadata
    presenceFieldAware: true,
    bluetoothPresenceAware: true,
    meshPresenceRelayAware: true,
    routeChunkingAware: true,
    routePrewarmAware: true,
    cachePolicyAware: true,

    // Loop + continuance
    loopTheoryAware: true,
    continuanceAware: true,

    // Organism-wide contracts (v12.3-SPINE)
    routingContract: "PulseRouter-v12.3",
    osOrganContract: "PulseOS-v12.3-SPINE",
    earnCompatibility: "PulseEarn-v12",
    sendCompatibility: "PulseSendSystem-v12",
    gpuCompatibility: "PulseGPU-v12.3",
    bbbCompatibility: "PulseOSOuterBBB-v12.3-SPINE"
  }
};


// ============================================================================
//  FACTORY — ALL DEPENDENCIES ARE INJECTED BY THE CNS BRAIN
//  (BBB MUST HAVE ZERO IMPORTS)
// ============================================================================
export function createPulseOSBBB({ log }) {
  const BBBMeta = {
    PulseRole,
    layer: "OuterBBB",
    version: "12.3-SPINE",
    generation: "v12.3",
    dualBand: true,
    symbolicSurface: true,
    binaryCompressionSurface: true
  };

  // ========================================================================
  //  SHELL STATE ENUM (v12.3-SPINE)
  // ========================================================================
  const SHELL_STATES = {
    NO_SHELL: "no-shell",      // PulseBand forbidden
    ANON_SHELL: "anon-shell",  // PulseBand allowed, identity blocked
    AUTH_SHELL: "auth-shell"   // PulseBand + identity allowed
  };

  // ========================================================================
  //  ROUTE CLASSIFICATION (v12.3-SPINE)
  // ========================================================================
  const HARD_NO_SHELL_ROUTES = new Set([
    "login",
    "404",
    "expired",
    "maintenance",
    "offline",
    "fatal",
    "panic"
  ]);

  const ANON_SHELL_ROUTES = new Set([
    "main",
    "landing",
    "marketing",
    "moat",
    "public",
    "welcome"
  ]);

  const PRESENCE_PRIORITY_ROUTES = new Set([
    "main",
    "home",
    "dashboard",
    "play",
    "session",
    "party"
  ]);

  const PREFETCH_PRIORITY_ROUTES = new Set([
    "main",
    "home",
    "dashboard",
    "library",
    "store"
  ]);

  // ========================================================================
  //  determineShellState — pure shell-state engine
  // ========================================================================
  function determineShellState({ routeName, hasIdentity }) {
    const route = (routeName || "").toLowerCase();

    if (HARD_NO_SHELL_ROUTES.has(route)) {
      return SHELL_STATES.NO_SHELL;
    }

    if (ANON_SHELL_ROUTES.has(route)) {
      return SHELL_STATES.ANON_SHELL;
    }

    if (hasIdentity) {
      return SHELL_STATES.AUTH_SHELL;
    }

    return SHELL_STATES.ANON_SHELL;
  }

  // ========================================================================
  //  guardPulseBand — shapes PulseBand + identity access
  // ========================================================================
  function guardPulseBand(ctx) {
    const shellState = determineShellState(ctx);

    return {
      shellState,
      allowPulseBand:
        shellState === SHELL_STATES.ANON_SHELL ||
        shellState === SHELL_STATES.AUTH_SHELL,
      allowIdentity: shellState === SHELL_STATES.AUTH_SHELL
    };
  }

  // ========================================================================
  //  buildCacheHints — route-level chunk/prewarm hints (metadata only)
// ========================================================================
  function buildCacheHints({ routeName }) {
    const route = (routeName || "").toLowerCase();

    const prewarm = PREFETCH_PRIORITY_ROUTES.has(route);
    const presenceCritical = PRESENCE_PRIORITY_ROUTES.has(route);

    return {
      route,
      prewarmChunks: prewarm,
      prewarmPresence: presenceCritical,
      suggestedBands: {
        symbolic: true,
        binary: true
      }
    };
  }

  // ========================================================================
  //  buildPresenceDirectives — presence/mesh directives (metadata only)
// ========================================================================
  function buildPresenceDirectives({
    routeName,
    hasIdentity,
    bluetoothAvailable,
    meshAvailable
  }) {
    const route = (routeName || "").toLowerCase();
    const presenceCritical = PRESENCE_PRIORITY_ROUTES.has(route);

    const enablePresenceField =
      presenceCritical && (hasIdentity || route === "party");

    const enableBluetoothPresence =
      enablePresenceField && !!bluetoothAvailable;

    const enableMeshPresence =
      enablePresenceField && !!meshAvailable;

    return {
      route,
      enablePresenceField,
      enableBluetoothPresence,
      enableMeshPresence
    };
  }

  // ========================================================================
  //  PUBLIC BBB INTERFACE (v12.3-SPINE)
// ========================================================================
  return {
    PulseRole,
    BBBMeta,
    SHELL_STATES,
    determineShellState,
    guardPulseBand,
    buildCacheHints,
    buildPresenceDirectives
  };
}
