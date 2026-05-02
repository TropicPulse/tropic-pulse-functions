// ============================================================================
//  PulseUnderstanding.js — v13-EVO-MAX (HYBRID LOADER)
//  Cortical Opener • Symbolic Kernel Loader • Binary Shadow Integrator
//  Deterministic Brainstem • Runtime/Scheduler/Substrate Unifier
// ============================================================================
//
//  v13-EVO HYBRID CONTRACT:
//  ------------------------
//   • DO NOT boot the binary organism (Window already did).
//   • DO load symbolic kernel + symbolic organs (via User/OS chain).
//   • DO integrate binary shadow from window.PulseBinary.
//   • DO integrate Flow (window.PulseUI) and PageScanner intel.
//   • DO unify runtime, scheduler, substrate.
//   • DO expose OS API (symbolic + binary shadow).
//   • DO NOT expose raw organs to the outside.
//   • DO NOT mutate Window or Page.
//   • MAY read membrane intel from window.PulseSurface + PulseChunks portal.
// ============================================================================

console.log("Understanding");
// ============================================================================
//  UNIVERSAL ERROR SPINE (PulseUIErrors-v12-EVO)
//  - Understanding integrates error packets from Window + Flow + Reflex.
// ============================================================================
import PulseUIErrors from "./PulseUIErrors-v12-EVO.js";


// ============================================================================
//  IMPORTS — MAPS (Intent, Organism, IQ)
// ============================================================================
import { PulseIntentMap } from "../PULSE-OS/PulseIntentMap.js";
import { PulseOrganismMap } from "../PULSE-OS/PulseOrganismMap.js";
import { PulseIQMap } from "../PULSE-OS/PulseIQMap.js";


// ============================================================================
//  IMPORTS — USER / LOCAL OS ORCHESTRATOR (v13+)
//  - User pulls OS; OS pulls everything else.
//  - Understanding depends on User, not directly on OS barrels.
// ============================================================================
import createPulseWorldCore from "../PULSE-BAND/PULSE-EXPANSION/PulseUser-v12.3-Presence.js";


// ============================================================================
//  IMPORTS — SYMBOLIC / BINARY ORGANS (UNCHANGED)
//  - These are still the organ-level pieces we unify under the kernel.
// ============================================================================
import { createProxy as PulseProxySym } from "../PULSE-BAND/PULSE-PROXY/PulseProxy-v11-EVO.js";
import { PulseRouter as PulseRouterSym } from "../PULSE-BAND/PULSE-ROUTER/PulseRouter-v11-EVO.js";
import { createGPUDispatch as PulseGPUSym } from "../PULSE-BAND/PULSE-GPU/PulseGPU-v11-EVO.js";
import { createPulseMesh as PulseMeshSym } from "../PULSE-BAND/PULSE-MESH/PulseMesh-v11-EVO.js";
import { createPulseSend as PulseSendSym } from "../PULSE-BAND/PULSE-SEND/PulseSend-v11-EVO.js";
import { createEarn as PulseEarnSym } from "../PULSE-BAND/PULSE-EARN/PulseEarn-v12.3-Presence.js";


// ============================================================================
//  IMPORTS — BINARY SHADOW (NO BOOT HERE)
//  Window already booted ai-v11-Evo and exposed window.PulseBinary.
// ============================================================================
import { createDualBandOrganism as PulseBinaryOrganismBoot } from "../PULSE-AI/aiDualBand-v11-Evo.js";

import { createBinaryProxy } from "../PULSE-BAND/PULSE-PROXY/PulseBinaryProxy-v11-EVO.js";
import { createBinaryRouter as PulseRouterBin } from "../PULSE-BAND/PULSE-ROUTER/PulseBinaryRouter-v11-EVO.js";
import { PulseBinaryGPU as PulseGPUBin } from "../PULSE-BAND/PULSE-GPU/PulseBinaryGPU-v11-Evo.js";
import { createBinaryMesh as PulseMeshBin } from "../PULSE-BAND/PULSE-MESH/PulseBinaryMesh-v11-EVO.js";
import { createBinarySend as PulseSendBin } from "../PULSE-BAND/PULSE-SEND/PulseBinarySend-v11-EVO.js";


// ============================================================================
//  CONTEXT — v13-EVO-MAX
// ============================================================================
const PULSE_UNDERSTANDING_CONTEXT = {
  layer: "PulseUnderstanding",
  role: "CORTICAL_OPENER",
  version: "13.0-EVO-MAX",
  lineage: "cortical-opener-core-v13",
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
    chunkMembraneAware: true,
    userPulledOS: true // NEW: User → OS → Brain chain
  }
};


// ============================================================================
//  ENVIRONMENT SNAPSHOT (UPGRADED — USE PORTAL IF PRESENT)
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
//  USER / LOCAL OS CORE (SIDE-EFFECT LOAD)
//  - This is the "user pulls OS" connection.
//  - We don't call into it directly here; we just ensure it's loaded.
// ============================================================================
let PulseWorldCore = null;
try {
  PulseWorldCore = createPulseWorldCore({
    regionID: null,
    trace: false,
    serverMode: false
  });
} catch {
  // Understanding must not throw if user core fails; it degrades to window.PulseBinary-only.
  PulseWorldCore = null;
}


// ============================================================================
//  GOVERNOR (symbolic only, now via global Pulse if present)
//  - Previously: PulseOSv11Evo.runThroughGovernor(...)
//  - Now: delegate to window.Pulse.Governed.run if available, else direct fn.
// ============================================================================
function runThroughGovernor(organName, pulseOrImpulse, fn) {
  const governedRun =
    typeof window !== "undefined"
      ? window?.Pulse?.Governed?.run
      : null;

  if (typeof governedRun === "function") {
    return governedRun(organName, pulseOrImpulse, fn);
  }

  // Fallback: just run the function directly.
  return fn(pulseOrImpulse);
}


// ============================================================================
//  BINARY-FIRST IDENTITY (HYBRID MODE)
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
//  - Symbolic kernel is now resolved via User/OS chain or window.Pulse.
//  - Binary kernel is still read from window.PulseBinary.
// ============================================================================
async function resolveKernelsBinaryFirst() {
  const BinaryKernel =
    typeof window !== "undefined" ? window.PulseBinary ?? null : null;

  let SymbolicKernel = null;

  // Try to get symbolic kernel from User/OS chain first
  try {
    if (PulseWorldCore?.getPrimaryOSView) {
      const osView = PulseWorldCore.getPrimaryOSView();
      if (osView?.SymbolicKernel) {
        SymbolicKernel = osView.SymbolicKernel;
      }
    }
  } catch {}

  // Fallback: try window.Pulse.SymbolicKernel or window.Pulse.Kernel
  if (!SymbolicKernel && typeof window !== "undefined") {
    SymbolicKernel =
      window.Pulse?.SymbolicKernel ??
      window.Pulse?.Kernel ??
      null;
  }

  // If it's a promise-like, await it
  if (SymbolicKernel && typeof SymbolicKernel.then === "function") {
    SymbolicKernel = await SymbolicKernel;
  }

  return {
    BinaryKernel,
    SymbolicKernel: SymbolicKernel || {}
  };
}


// ============================================================================
//  KERNEL BOOTSTRAP — UNDERSTANDING LAYER (HYBRID UNDER WINDOW)
// ============================================================================
async function buildPulseKernel() {
  const { BinaryKernel, SymbolicKernel } = await resolveKernelsBinaryFirst();

  const BinaryShadow =
    typeof window !== "undefined" ? window.PulseBinary ?? null : null;
  const UIFlow =
    typeof window !== "undefined" ? window.PulseUI ?? null : null;
  const SkinReflex =
    typeof window !== "undefined" ? window.PulseSkinReflex ?? null : null;

  const BinaryBrain = BinaryKernel?.Brain ?? null;
  const BinaryEvolution = BinaryKernel?.Evolution ?? null;
  const BinarySDN = BinaryKernel?.SDN ?? null;
  const BinaryMemoryCore = BinaryKernel?.MemoryCore ?? null;
  const BinaryOverlay = BinaryKernel?.BinaryOverlay ?? null;

  const Brain = BinaryBrain ?? SymbolicKernel.Brain ?? null;
  const Evolution = BinaryEvolution ?? SymbolicKernel.Evolution ?? null;
  const SpinalCord = BinarySDN ?? SymbolicKernel.SDN ?? null;
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
      version: "v13",
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
    if (Brain && Mesh && typeof Brain.attachMesh === "function") {
      Brain.attachMesh(Mesh);
    }
    if (Mesh && typeof Mesh.attachBrain === "function") {
      Mesh.attachBrain(Brain);
    }
  } catch (err) {
    console.error("[PulseUnderstanding] Brain ↔ Mesh attach failed:", err);
  }

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
        dispatchSignature: "Understanding.v13-EVO-MAX",
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
        "[PulseUnderstanding v13-EVO-MAX] Kernel bootstrap failed:",
        err
      );
    });
}


// ============================================================================
//  UNDERSTANDING PREWARM — uses portal chunk membrane if available
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
