// ============================================================================
//  PulseUnderstanding.js — v11-EVO-BINARY-FIRST-ALL
//  Cortical Opener • Binary-First Organism Loader • Deterministic Brainstem
// ============================================================================

import { PulseIntentMap } from "./PULSE-OS/PulseIntentMap.js";
import { PulseOrganismMap } from "./PULSE-OS/PulseOrganismMap.js";
import { PulseIQMap } from "./PULSE-OS/PulseIQMap.js";

// ---------------- SYMBOLIC OS KERNEL ----------------
import { PulseOSv11Evo } from "./PULSE-OS/PulseOS-v11-Evo.js";

// ---------------- BINARY OS KERNEL ------------------
import { PulseBinaryOSv11Evo } from "./PULSE-OS/PulseBinaryOS-v11-EVO-MAX.js";

// ---------------- SYMBOLIC ORGANS -------------------
import * as PulseProxySym from "./PULSE-PROXY/PulseProxy-v11-EVO.js";
import * as PulseRouterSym from "./pulse-router/PulseRouter-v11-EVO.js";
import * as PulseGPUSym from "./PULSE-GPU/PulseGPU-v11-EVO.js";
import * as PulseMeshSym from "./PULSE-MESH/PulseMesh-v11-EVO.js";
import * as PulseSendSym from "./PULSE-SEND/PulseSend-v11-EVO.js";

// *** Earn is dual-band ONLY — this is the ONLY Earn organ ***
import * as PulseEarnSym from "./PULSE-EARN/PulseEarn-v11-EVO.js";

import * as PulseBinaryOrganismBoot from "./PULSE-AI/ai-v11-Evo.js";

// ---------------- BINARY ORGANS ---------------------
import { createBinaryProxy } from "./PULSE-PROXY/PulseBinaryProxy-v11-EVO.js";
import * as PulseRouterBin from "./pulse-router/PulseBinaryRouter-v11-EVO.js";
import * as PulseGPUBin from "./PULSE-GPU/PulseBinaryGPU-v11-Evo.js";
import * as PulseMeshBin from "./PULSE-MESH/PulseBinaryMesh-v11-EVO.js";
import * as PulseSendBin from "./PULSE-SEND/PulseBinarySend-v11-EVO.js";

// *** REMOVE THIS — Earn has no binary organ ***
// import * as PulseEarnBin from "../PULSE-EARN/PulseBinaryEarn-v11-EVO.js";

// ============================================================================
const PULSE_UNDERSTANDING_CONTEXT = {
  layer: "PulseUnderstanding",
  role: "KERNEL_OPENER",
  version: "11.0-EVO-BINARY-FIRST-ALL",
  lineage: "cortical-opener-core-v11",
  evo: {
    dualMode: true,
    browserOnly: true,
    driftProof: true,
    zeroDriftIdentity: true,
    organismLoader: true,
    corticalOpener: true,
    routeChainAware: true,
    organismWideIdentityAware: true,
    binaryAware: true,
    symbolicAware: true,
    dualBandAware: true,
    binaryFirstIdentity: true,
    proxyEvoReady: true,
    meshAware: true,
    gpuAware: true,
    sendEarnAware: true,
    spinalCordAware: true,
    memoryCoreAware: true,
    binaryOverlayAware: true,
    binaryKernelAware: true
  }
};


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

// symbolic governor only
function runThroughGovernor(organName, pulseOrImpulse, fn) {
  return PulseOSv11Evo.runThroughGovernor(organName, pulseOrImpulse, fn);
}

// ---------------- BINARY-FIRST IDENTITY ----------------
async function resolveIdentityBinaryFirst(ProxyBin, ProxySym) {
  // 1) binary identity if binary proxy exposes it
  if (ProxyBin && typeof ProxyBin.identityBinary === "function") {
    try {
      const binId = await ProxyBin.identityBinary();
      if (binId) return { kind: "binary", value: binId };
    } catch {}
  }

  // 2) symbolic/hybrid identity
  if (ProxySym && typeof ProxySym.identity === "function") {
    try {
      const hybridId = await ProxySym.identity("hybrid");
      if (hybridId) return { kind: "hybrid", value: hybridId };
    } catch {}
  }

  return { kind: "none", value: null };
}

// ---------------- BINARY-FIRST KERNELS ----------------
async function resolveKernelsBinaryFirst() {
  const BinaryKernel = await PulseBinaryOSv11Evo.Kernel;
  const SymbolicKernel = await PulseOSv11Evo.Kernel;
  return { BinaryKernel, SymbolicKernel };
}

// ============================================================================
//  KERNEL BOOTSTRAP — UNDERSTANDING LAYER (A1 UNDER WINDOW)
// ============================================================================
async function buildPulseKernel() {
  const { BinaryKernel, SymbolicKernel } = await resolveKernelsBinaryFirst();

  // ---- binary-first core organs ----
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
        // deterministic bridge into symbolic proxy
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

  // ---- identity (binary-first, using both proxies) ----
  const identityResult = await resolveIdentityBinaryFirst(ProxyBin, ProxySym);
  const identity = identityResult.value;

  // patch identity into symbolic proxy if it supports it
  if (ProxySym && typeof ProxySym.setIdentity === "function") {
    try {
      ProxySym.setIdentity(identity);
    } catch {}
  }

  // ---- unified Proxy handle: binary-first, fallback symbolic ----
  const Proxy = ProxyBin || ProxySym;

  // ---- register Understanding on SDN ----
  try {
    SpinalCord?.registerExtension?.("Understanding", "extension", {
      version: "v11",
      role: "cortical-opener",
      layer: "A1",
      binaryFirst: true
    });
  } catch {}

  // ---- optional Mesh / Send / Earn / BinaryOrganism boot ----
  try {
    if (Mesh && typeof Mesh.boot === "function") {
      Mesh.boot({
        Brain,
        Evolution,
        SDN: SpinalCord,
        MemoryCore,
        BinaryOverlay: BinaryOverlayFinal
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
        Mesh
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
        Send
      });
    }
  } catch {}

  try {
    if (typeof PulseBinaryOrganismBoot.boot === "function") {
      PulseBinaryOrganismBoot.boot({ trace: false });
    }
  } catch {}

  // ---- dual-band impulse into SDN ----
  try {
    SpinalCord?.emitImpulse?.("Understanding", {
      modeKind: "dual",
      executionContext: {
        sceneType: "cortical-opener",
        workloadClass: "frontend-boot",
        dispatchSignature: "Understanding.v11-EVO-BINARY-FIRST-ALL",
        shapeSignature: "A1-layer",
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
            Earn: PulseKernel.Earn
          }
        : PulseKernel;
    })
    .catch((err) => {
      console.error(
        "[PulseUnderstanding v11-EVO-BINARY-FIRST-ALL] Kernel bootstrap failed:",
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
  Identity: () =>
    typeof window !== "undefined" ? window?.Pulse?.Identity ?? null : null,
  IdentityKind: () =>
    typeof window !== "undefined" ? window?.Pulse?.IdentityKind ?? null : null,
  runThroughGovernor
};

export default PulseUnderstanding;
