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
//   • MAY read membrane intel from window.PulseSurface + PulseChunks portal.
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
import { PulseIQMap } from "../PULSE-OS/PulseIQMap.js";


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
    browserOnly: true,
    portalAware: true,
    surfaceEnvironmentAware: true,
    chunkMembraneAware: true
  }
};


// ============================================================================
//  ENVIRONMENT SNAPSHOT (UPGRADED — USE PORTAL IF PRESENT)
//  - Prefer Window's PulseSurface.environment (richer, cached).
//  - Fall back to local navigator snapshot if portal not present.
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

  const surfaceEnv = window.PulseSurface?.environment;

  if (surfaceEnv) {
    return {
      runtime: surfaceEnv.runtime ?? "browser",
      userAgent: surfaceEnv.userAgent ?? window.navigator?.userAgent ?? null,
      language: surfaceEnv.language ?? window.navigator?.language ?? null,
      online: surfaceEnv.online ?? window.navigator?.onLine ?? null,
      platform: surfaceEnv.platform ?? window.navigator?.platform ?? null,
      screen: surfaceEnv.screen ?? null,
      device: surfaceEnv.device ?? null,
      input: surfaceEnv.input ?? null,
      preferences: surfaceEnv.preferences ?? null,
      location: surfaceEnv.location ?? null,
      network: surfaceEnv.network ?? null,
      referrer: surfaceEnv.referrer ?? null,
      origin: surfaceEnv.origin ?? null
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
  const shadow = window?.PulseBinary?.meta;
  if (shadow?.identity) {
    return { kind: "binary-shadow", value: shadow.identity };
  }

  if (ProxyBin && typeof ProxyBin.identityBinary === "function") {
    try {
      const binId = await ProxyBin.identityBinary();
      if (binId) return { kind: "binary", value: binId };
    } catch {}
  }

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
  const BinaryKernel = window?.PulseBinary ?? null;
  return { BinaryKernel, SymbolicKernel };
}


// ============================================================================
//  KERNEL BOOTSTRAP — UNDERSTANDING LAYER (HYBRID UNDER WINDOW)
// ============================================================================
async function buildPulseKernel() {
  const { BinaryKernel, SymbolicKernel } = await resolveKernelsBinaryFirst();

  const BinaryShadow = typeof window !== "undefined" ? window.PulseBinary ?? null : null;
  const UIFlow = typeof window !== "undefined" ? window.PulseUI ?? null : null;
  const SkinReflex = typeof window !== "undefined" ? window.PulseSkinReflex ?? null : null;

  const BinaryBrain = BinaryKernel?.Brain ?? null;
  const BinaryEvolution = BinaryKernel?.Evolution ?? null;
  const BinarySDN = BinaryKernel?.SDN ?? null;
  const BinaryMemoryCore = BinaryKernel?.MemoryCore ?? null;
  const BinaryOverlay = BinaryKernel?.BinaryOverlay ?? null;

  const Brain = BinaryBrain ?? SymbolicKernel.Brain;
  const Evolution = BinaryEvolution ?? SymbolicKernel.Evolution;
  const SpinalCord = BinarySDN ?? SymbolicKernel.SDN;
  const CoreGovernor = SymbolicKernel.Governor ?? null;

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

  const Mesh =
    (PulseMeshBin && Object.keys(PulseMeshBin).length ? PulseMeshBin : null) ||
    PulseMeshSym;

  const Send =
    (PulseSendBin && Object.keys(PulseSendBin).length ? PulseSendBin : null) ||
    PulseSendSym;

  const Earn = PulseEarnSym;

  const Router =
    (PulseRouterBin && Object.keys(PulseRouterBin).length ? PulseRouterBin : null) ||
    PulseRouterSym;

  const GPU =
    (PulseGPUBin && Object.keys(PulseGPUBin).length ? PulseGPUBin : null) ||
    PulseGPUSym;

  const ProxySym = PulseProxySym.createProxy
    ? PulseProxySym.createProxy({
        Router,
        Brain,
        Evolution,
        Identity: null,
        Environment: PulseEnvironment,
        Governor: CoreGovernor,
        MemoryCore,
        BinaryOverlay: BinaryOverlayFinal,
        Mesh,
        Send,
        Earn
      })
    : PulseProxySym;

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

  const identityResult = await resolveIdentityBinaryFirst(ProxyBin, ProxySym);
  const identity = identityResult.value;

  if (ProxySym && typeof ProxySym.setIdentity === "function") {
    try {
      ProxySym.setIdentity(identity);
    } catch {}
  }

  const Proxy = ProxyBin || ProxySym;

  try {
    SpinalCord?.registerExtension?.("Understanding", "extension", {
      version: "v12",
      role: "cortical-opener",
      layer: "A3",
      binaryFirst: true,
      hybridLoader: true
    });
  } catch {}

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

    Errors: PulseUIErrors,

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
            Errors: PulseKernel.Errors
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


// ============================================================================
//  UNDERSTANDING PREWARM — uses portal chunk membrane if available
//  - Optional helper: prewarm common cortical paths (maps, configs, assets).
//  - Does NOT mutate Window or Page; only calls membrane prewarm.
// ============================================================================
export function prewarmUnderstanding(urls = []) {
  if (typeof window === "undefined") return;
  try {
    if (Array.isArray(urls) && urls.length && window.prewarmAssets) {
      window.prewarmAssets(urls);
    }
  } catch (err) {
    console.error("[PulseUnderstanding] prewarmUnderstanding failed:", err);
  }
}


export const PulseUnderstanding = {
  ...PULSE_UNDERSTANDING_CONTEXT,
  Environment: PulseEnvironment,
  IntentMap: PulseIntentMap,
  OrganismMap: PulseOrganismMap,
  IQMap: PulseIQMap,
  Kernel: PulseKernelPromise,
  Errors: PulseUIErrors,
  Identity: () =>
    typeof window !== "undefined" ? window?.Pulse?.Identity ?? null : null,
  IdentityKind: () =>
    typeof window !== "undefined" ? window?.Pulse?.IdentityKind ?? null : null,
  runThroughGovernor,
  prewarmUnderstanding
};

export default PulseUnderstanding;
