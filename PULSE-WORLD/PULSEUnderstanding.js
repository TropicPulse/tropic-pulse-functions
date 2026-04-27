// ============================================================================
//  PulseUnderstanding.js — v12-EVO-MAX (HYBRID LOADER)
//  Cortical Opener • Symbolic Kernel Loader • Binary Shadow Integrator
//  Deterministic Brainstem • Runtime/Scheduler/Substrate Unifier
// ============================================================================
//
//  v12-EVO HYBRID CONTRACT:
//  ------------------------
//   • DO NOT boot the binary organism (Window already did).
//   • DO load symbolic kernel + symbolic organs.
//   • DO integrate binary shadow from window.PulseBinary.
//   • DO integrate Flow (window.PulseUI) and PageScanner intel.
//   • DO unify runtime, scheduler, substrate.
//   • DO expose OS API (symbolic + binary shadow).
//   • DO NOT expose raw organs to the outside.
//   • DO NOT mutate Window or Page.
// ============================================================================
// ============================================================================
//  UNIVERSAL ERROR SPINE (PulseUIErrors-v12-EVO)
//  - Understanding integrates error packets from Window + Flow + Reflex.
// ============================================================================
import * as PulseUIErrors from "../PULSE-UI/PulseUIErrors-v12-EVO.js";


// ============================================================================
//  IMPORTS — MAPS (Intent, Organism, IQ)
// ============================================================================
import { PulseIntentMap } from "../PULSE-OS/PulseIntentMap.js";
import { PulseOrganismMap } from "../PULSE-OS/PulseOrganismMap.js";


// ============================================================================
//  IMPORTS — SYMBOLIC KERNEL + SYMBOLIC ORGANS
// ============================================================================
import { PulseOSv11Evo } from "../PULSE-OS/PulseOS-v11-Evo.js";

import * as PulseProxySym from "../PULSE-PROXY/PulseProxy-v11-EVO.js";
import * as PulseRouterSym from "../PULSE-ROUTER/PulseRouter-v11-EVO.js";
import * as PulseGPUSym from "../PULSE-GPU/PulseGPU-v11-EVO.js";
import * as PulseMeshSym from "../PULSE-MESH/PulseMesh-v11-EVO.js";
import * as PulseSendSym from "../PULSE-SEND/PulseSend-v11-EVO.js";
import * as PulseEarnSym from "../PULSE-EARN/PulseEarn-v11-EVO.js";


// ============================================================================
//  IMPORTS — BINARY SHADOW (NO BOOT HERE)
//  Window already booted ai-v11-Evo and exposed window.PulseBinary.
// ============================================================================
import { PulseBinaryOSv11Evo } from "../PULSE-OS/PulseBinaryOS-v11-EVO-MAX.js";
import * as PulseBinaryOrganismBoot from "../PULSE-AI/ai-v11-Evo.js";

import { createBinaryProxy } from "../PULSE-PROXY/PulseBinaryProxy-v11-EVO.js";
import * as PulseRouterBin from "../PULSE-ROUTER/PulseBinaryRouter-v11-EVO.js";
import * as PulseGPUBin from "../PULSE-GPU/PulseBinaryGPU-v11-Evo.js";
import * as PulseMeshBin from "../PULSE-MESH/PulseBinaryMesh-v11-EVO.js";
import * as PulseSendBin from "../PULSE-SEND/PulseBinarySend-v11-EVO.js";


// ============================================================================
//  CONTEXT — v12-EVO-MAX
// ============================================================================
const PULSE_UNDERSTANDING_CONTEXT = {
  layer: "PulseUnderstanding",
  role: "CORTICAL_OPENER",
  version: "12.0-EVO-MAX",
  lineage: "cortical-opener-core-v12",
  evo: {
    hybridLoader: true,
    symbolicKernel: true,
    binaryShadow: true,
    runtimeUnifier: true,
    schedulerUnifier: true,
    substrateUnifier: true,
    driftAware: true,
    flowAware: true,
    pageScannerAware: true,
    binaryFirstIdentity: true,
    dualBandAware: true,
    organismWideIdentityAware: true,
    browserOnly: true
  }
};


// ============================================================================
//  ENVIRONMENT SNAPSHOT (unchanged)
// ============================================================================
function buildEnvironmentSnapshot() {
  if (typeof window === "undefined") {
    return {
      runtime: "node-like",
      userAgent: null,
      language: null,
      online: null,
      platform: null
    };
  }

  return {
    runtime: "browser",
    userAgent: window.navigator?.userAgent || null,
    language: window.navigator?.language || null,
    online: window.navigator?.onLine ?? null,
    platform: window.navigator?.platform || null
  };
}

const PulseEnvironment = buildEnvironmentSnapshot();


// ============================================================================
//  GOVERNOR (symbolic only)
// ============================================================================
function runThroughGovernor(organName, pulseOrImpulse, fn) {
  return PulseOSv11Evo.runThroughGovernor(organName, pulseOrImpulse, fn);
}


// ============================================================================
//  BINARY-FIRST IDENTITY (HYBRID MODE)
//  - Try binary shadow identity first.
//  - Fall back to symbolic identity.
// ============================================================================
async function resolveIdentityBinaryFirst(ProxyBin, ProxySym) {
  // 1) binary shadow identity (from Window)
  const shadow = window?.PulseBinary?.meta;
  if (shadow?.identity) {
    return { kind: "binary-shadow", value: shadow.identity };
  }

  // 2) binary proxy identity
  if (ProxyBin && typeof ProxyBin.identityBinary === "function") {
    try {
      const binId = await ProxyBin.identityBinary();
      if (binId) return { kind: "binary", value: binId };
    } catch {}
  }

  // 3) symbolic identity
  if (ProxySym && typeof ProxySym.identity === "function") {
    try {
      const hybridId = await ProxySym.identity("hybrid");
      if (hybridId) return { kind: "hybrid", value: hybridId };
    } catch {}
  }

  return { kind: "none", value: null };
}


// ============================================================================
//  HYBRID KERNEL RESOLUTION (NO BINARY BOOT HERE)
//  - Symbolic kernel loads normally.
//  - Binary kernel is read from Window shadow.
// ============================================================================
async function resolveKernelsBinaryFirst() {
  const SymbolicKernel = await PulseOSv11Evo.Kernel;

  // Binary kernel is already booted by Window
  const BinaryKernel = window?.PulseBinary ?? null;

  return { BinaryKernel, SymbolicKernel };
}
// ============================================================================
//  KERNEL BOOTSTRAP — UNDERSTANDING LAYER (HYBRID UNDER WINDOW)
//  - Symbolic kernel + organs boot here.
//  - Binary organism is NOT booted here (Window already did).
//  - Binary shadow, Flow, and PageScanner intel are integrated from window.
// ============================================================================
async function buildPulseKernel() {
  const { BinaryKernel, SymbolicKernel } = await resolveKernelsBinaryFirst();

  // ---- binary shadow + flow + reflex (from Window) ----
  const BinaryShadow = typeof window !== "undefined" ? window.PulseBinary ?? null : null;
  const UIFlow = typeof window !== "undefined" ? window.PulseUI ?? null : null;
  const SkinReflex = typeof window !== "undefined" ? window.PulseSkinReflex ?? null : null;

  // ---- binary-first core organs (shadow-aware) ----
  const BinaryBrain = BinaryKernel?.Brain ?? null;
  const BinaryEvolution = BinaryKernel?.Evolution ?? null;
  const BinarySDN = BinaryKernel?.SDN ?? null;
  const BinaryMemoryCore = BinaryKernel?.MemoryCore ?? null;
  const BinaryOverlay = BinaryKernel?.BinaryOverlay ?? null;

  const Brain = BinaryBrain ?? SymbolicKernel.Brain;
  const Evolution = BinaryEvolution ?? SymbolicKernel.Evolution;
  const SpinalCord = BinarySDN ?? SymbolicKernel.SDN;
  const CoreGovernor = SymbolicKernel.Governor ?? null;

  // ---- memory / overlay (binary-first, fallback symbolic) ----
  const MemoryCore =
    BinaryMemoryCore ??
    SymbolicKernel.MemoryCore ??
    null;

  const BinaryOverlayFinal =
    BinaryOverlay ??
    SymbolicKernel.BinaryOverlay ??
    null;

  const EpisodicMemory =
    SymbolicKernel.EpisodicMemory ??
    (MemoryCore && MemoryCore.Episodic ? MemoryCore.Episodic : null);

  const SemanticMemory =
    SymbolicKernel.SemanticMemory ??
    (MemoryCore && MemoryCore.Semantic ? MemoryCore.Semantic : null);

  // ---- Mesh / Send / Earn (binary-first, fallback symbolic) ----
  const Mesh =
    (PulseMeshBin && Object.keys(PulseMeshBin).length ? PulseMeshBin : null) ||
    PulseMeshSym;

  const Send =
    (PulseSendBin && Object.keys(PulseSendBin).length ? PulseSendBin : null) ||
    PulseSendSym;

  // *** Earn is dual-band ONLY — no binary organ exists ***
  const Earn = PulseEarnSym;

  // ---- Router / GPU: binary-first, fallback symbolic ----
  const Router =
    (PulseRouterBin && Object.keys(PulseRouterBin).length ? PulseRouterBin : null) ||
    PulseRouterSym;

  const GPU =
    (PulseGPUBin && Object.keys(PulseGPUBin).length ? PulseGPUBin : null) ||
    PulseGPUSym;

  // ---- symbolic proxy base (for fallback + non-binary paths) ----
  const ProxySym = PulseProxySym.createProxy
    ? PulseProxySym.createProxy({
        Router,
        Brain,
        Evolution,
        Identity: null, // filled after identity resolution
        Environment: PulseEnvironment,
        Governor: CoreGovernor,
        MemoryCore,
        BinaryOverlay: BinaryOverlayFinal,
        Mesh,
        Send,
        Earn
      })
    : PulseProxySym;

  // ---- binary proxy (pure binary, with symbolic fallback) ----
  const encoder = SymbolicKernel.BinaryAgent ?? null;
  let ProxyBin = null;

  if (encoder) {
    ProxyBin = createBinaryProxy({
      encoder,
      fallbackProxyFactory: (job) => {
        if (typeof ProxySym.send === "function") {
          return ProxySym.send(job);
        }
        if (typeof ProxySym.exchange === "function") {
          return ProxySym.exchange(job);
        }
        return job;
      },
      trace: false
    });
  }

  // ---- identity (binary-first, using both proxies + shadow) ----
  const identityResult = await resolveIdentityBinaryFirst(ProxyBin, ProxySym);
  const identity = identityResult.value;

  if (ProxySym && typeof ProxySym.setIdentity === "function") {
    try {
      ProxySym.setIdentity(identity);
    } catch {}
  }

  const Proxy = ProxyBin || ProxySym;

  // ---- register Understanding on SDN ----
  try {
    SpinalCord?.registerExtension?.("Understanding", "extension", {
      version: "v12",
      role: "cortical-opener",
      layer: "A3",
      binaryFirst: true,
      hybridLoader: true
    });
  } catch {}

  // ---- optional Mesh / Send / Earn boot (symbolic + shadow-aware) ----
  try {
    if (Mesh && typeof Mesh.boot === "function") {
      Mesh.boot({
        Brain,
        Evolution,
        SDN: SpinalCord,
        MemoryCore,
        BinaryOverlay: BinaryOverlayFinal,
        BinaryShadow
      });
    }
  } catch {}

  try {
    if (Send && typeof Send.boot === "function") {
      Send.boot({
        Brain,
        Evolution,
        SDN: SpinalCord,
        MemoryCore,
        BinaryOverlay: BinaryOverlayFinal,
        Mesh,
        BinaryShadow
      });
    }
  } catch {}

  try {
    if (Earn && typeof Earn.boot === "function") {
      Earn.boot({
        Brain,
        Evolution,
        SDN: SpinalCord,
        MemoryCore,
        BinaryOverlay: BinaryOverlayFinal,
        Mesh,
        Send,
        BinaryShadow
      });
    }
  } catch {}

  // ---- dual-band impulse into SDN ----
  try {
    SpinalCord?.emitImpulse?.("Understanding", {
      modeKind: "dual",
      executionContext: {
        sceneType: "cortical-opener",
        workloadClass: "frontend-boot",
        dispatchSignature: "Understanding.v12-EVO-MAX",
        shapeSignature: "A3-layer",
        extensionId: "Understanding",
        identityKind: identityResult.kind
      },
      pressureSnapshot: {
        runtime: PulseEnvironment.runtime,
        online: PulseEnvironment.online
      }
    });
  } catch {}

  const meta = {
    ...PULSE_UNDERSTANDING_CONTEXT,
    identity,
    identityKind: identityResult.kind,
    environment: PulseEnvironment
  };

  const Pulse = {
    meta,
    Identity: identity,
    IdentityKind: identityResult.kind,
    Environment: PulseEnvironment,

    Brain,
    Evolution,
    Router,
    GPU,
    SDN: SpinalCord,
    Proxy,

    MemoryCore,
    BinaryOverlay: BinaryOverlayFinal,
    EpisodicMemory,
    SemanticMemory,

    Mesh,
    Send,
    Earn,

    BinaryShadow,
    UIFlow,
    SkinReflex,

    Errors: PulseUIErrors,   // ← NEW

    Governed: {
      run: runThroughGovernor
    }
  };


  return Pulse;
}

const PulseKernelPromise = buildPulseKernel();

// ============================================================================
//  GLOBAL BROADCAST
// ============================================================================
if (typeof window !== "undefined") {
  PulseKernelPromise
    .then((PulseKernel) => {
      window.Pulse = window.Pulse
        ? {
            ...window.Pulse,
            meta: PulseKernel.meta,
            Brain: PulseKernel.Brain,
            Evolution: PulseKernel.Evolution,
            Router: PulseKernel.Router,
            GPU: PulseKernel.GPU,
            SDN: PulseKernel.SDN,
            Proxy: PulseKernel.Proxy,
            Governed: PulseKernel.Governed,
            Environment: PulseKernel.Environment,
            Identity: PulseKernel.Identity,
            IdentityKind: PulseKernel.IdentityKind,
            MemoryCore: PulseKernel.MemoryCore,
            BinaryOverlay: PulseKernel.BinaryOverlay,
            EpisodicMemory: PulseKernel.EpisodicMemory,
            SemanticMemory: PulseKernel.SemanticMemory,
            Mesh: PulseKernel.Mesh,
            Send: PulseKernel.Send,
            Earn: PulseKernel.Earn,
            BinaryShadow: PulseKernel.BinaryShadow,
            UIFlow: PulseKernel.UIFlow,
            SkinReflex: PulseKernel.SkinReflex,
            Errors: PulseKernel.Errors   // ← NEW
          }
        : PulseKernel;
    })
    .catch((err) => {
      console.error(
        "[PulseUnderstanding v12-EVO-MAX] Kernel bootstrap failed:",
        err
      );
      
    });
    
}


export const PulseUnderstanding = {
  ...PULSE_UNDERSTANDING_CONTEXT,
  Environment: PulseEnvironment,
  IntentMap: PulseIntentMap,
  OrganismMap: PulseOrganismMap,
  IQMap: PulseIQMap,
  Kernel: PulseKernelPromise,
  Errors: PulseUIErrors,   // ← NEW
  Identity: () =>
    typeof window !== "undefined" ? window?.Pulse?.Identity ?? null : null,
  IdentityKind: () =>
    typeof window !== "undefined" ? window?.Pulse?.IdentityKind ?? null : null,
  runThroughGovernor
};


export default PulseUnderstanding;
