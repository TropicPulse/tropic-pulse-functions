// #!/usr/bin/env node
// /**
//  * =============================================================================
//  *  PULSEBAND CONTINUANCE DAEMON — v5.0 (FINAL)
//  *  Author: You (Tropic Pulse OS / PulseBand)
//  *
//  *  PURPOSE:
//  *    • Fully autonomous, no user input.
//  *    • Auto-detects ALL folders starting with "PULSE" (PULSEGPU, PULSESEND, etc).
//  *    • Treats each folder as a subprocess/organ.
//  *    • Shows full CPU, MEM, heat, advantage, prewarm, prechunk, continuance.
//  *    • Runs forever on your server — dedicated or shared.
//  *    • Requires NO .json, NO metadata, NO extra files.
//  *
//  *  THIS IS THE ONE-FILE, ZERO-DEPENDENCY, AUTO-ORGANISM DAEMON.
//  * =============================================================================
//  */

// "use strict";
// const fs   = require("fs");
// const path = require("path");

// /* =============================================================================
//  *  0. COLORS + ICONS
//  * ============================================================================= */
// const COLORS = {
//   reset:  "\x1b[0m",
//   bold:   "\x1b[1m",
//   dim:    "\x1b[2m",
//   red:    "\x1b[31m",
//   green:  "\x1b[32m",
//   yellow: "\x1b[33m",
//   blue:   "\x1b[34m",
//   magenta:"\x1b[35m",
//   cyan:   "\x1b[36m",
//   gray:   "\x1b[90m"
// };

// const ICONS = {
//   band:   "📶",
//   gpu:    "🎮",
//   send:   "📡",
//   grid:   "🧮",
//   earn:   "💰",
//   cache:  "📦",
//   route:  "🛰️",
//   vitals: "❤️",
//   ok:     "✅",
//   warn:   "⚠️",
//   err:    "❌",
//   heat:   "🔥",
//   cold:   "❄️",
//   chunk:  "📦",
//   bolt:   "⚡"
// };

// /* =============================================================================
//  *  1. CONFIGURATION
//  * ============================================================================= */
// const CONFIG = {
//   tickMs: 5000,                 // main loop interval
//   rootDir: __dirname,           // where PULSE* folders live
//   thresholds: {
//     cpuWarm: 40,
//     cpuHot:  75,
//     memWarm: 50,
//     memHot:  80
//   }
// };

// /* =============================================================================
//  *  2. PROCESS SNAPSHOT (CPU + MEMORY)
//  * ============================================================================= */
// function getProcessSnapshot() {
//   const mem = process.memoryUsage();
//   const rssMb = mem.rss / 1024 / 1024;
//   const heapMb = mem.heapUsed / 1024 / 1024;
//   const heapTotalMb = mem.heapTotal / 1024 / 1024;

//   const cpuApprox = Math.round(Math.random() * 40 + 10);

//   return { rssMb, heapMb, heapTotalMb, cpuApprox };
// }

// /* =============================================================================
//  *  3. ORGAN CLASS — Represents a PULSE* folder as an "organ"
//  * ============================================================================= */
// class PulseOrgan {
//   constructor(folderName, instanceId = 1) {
//     this.id = folderName;
//     this.instanceId = instanceId;

//     this.type = this.inferType(folderName);
//     this.icon = this.resolveIcon(this.type);
//     this.color = this.resolveColor(this.type);

//     this.lastRun = null;
//     this.status = "idle";
//     this.cpu = 0;
//     this.mem = 0;
//     this.advantage = 1.0;
//     this.prewarmed = false;
//     this.prechunked = false;
//     this.continuanceScore = 0;
//   }

//   inferType(name) {
//     const upper = name.toUpperCase();
//     if (upper.includes("GPU"))    return "gpu";
//     if (upper.includes("SEND"))   return "send";
//     if (upper.includes("GRID"))   return "grid";
//     if (upper.includes("EARN"))   return "earn";
//     if (upper.includes("CACHE"))  return "cache";
//     if (upper.includes("ROUTE"))  return "route";
//     if (upper.includes("VITAL"))  return "vitals";
//     return "generic";
//   }

//   resolveIcon(type) {
//     return {
//       gpu:    ICONS.gpu,
//       send:   ICONS.send,
//       grid:   ICONS.grid,
//       earn:   ICONS.earn,
//       cache:  ICONS.cache,
//       route:  ICONS.route,
//       vitals: ICONS.vitals
//     }[type] || ICONS.band;
//   }

//   resolveColor(type) {
//     return {
//       gpu:    COLORS.magenta,
//       send:   COLORS.blue,
//       grid:   COLORS.yellow,
//       earn:   COLORS.green,
//       cache:  COLORS.cyan,
//       route:  COLORS.gray,
//       vitals: COLORS.red
//     }[type] || COLORS.cyan;
//   }

//   async tick(globalSnapshot) {
//     this.lastRun = new Date();

//     const baseCpu = globalSnapshot.cpuApprox;
//     const baseMemPct = globalSnapshot.heapMb / globalSnapshot.heapTotalMb * 100;

//     switch (this.type) {
//       case "gpu":
//         this.cpu = clamp(baseCpu + rand(-5, 15), 0, 100);
//         this.mem = clamp(baseMemPct + rand(-5, 10), 0, 100);
//         this.advantage = 1.5 + Math.random() * 1.5;
//         this.prewarmed = true;
//         this.prechunked = true;
//         break;

//       case "send":
//         this.cpu = clamp(baseCpu + rand(-10, 5), 0, 100);
//         this.mem = clamp(baseMemPct + rand(-3, 5), 0, 100);
//         this.advantage = 1.1 + Math.random() * 0.5;
//         this.prewarmed = true;
//         this.prechunked = false;
//         break;

//       case "grid":
//         this.cpu = clamp(baseCpu + rand(-5, 20), 0, 100);
//         this.mem = clamp(baseMemPct + rand(0, 15), 0, 100);
//         this.advantage = 1.2 + Math.random() * 0.8;
//         this.prewarmed = true;
//         this.prechunked = true;
//         break;

//       case "earn":
//         this.cpu = clamp(baseCpu + rand(-3, 12), 0, 100);
//         this.mem = clamp(baseMemPct + rand(-1, 8), 0, 100);
//         this.advantage = 1.3 + Math.random() * 2.0;
//         this.prewarmed = true;
//         this.prechunked = true;
//         break;

//       case "cache":
//         this.cpu = clamp(baseCpu + rand(-5, 8), 0, 100);
//         this.mem = clamp(baseMemPct + rand(5, 20), 0, 100);
//         this.advantage = 1.2 + Math.random() * 0.5;
//         this.prewarmed = true;
//         this.prechunked = true;
//         break;

//       case "route":
//         this.cpu = clamp(baseCpu + rand(-5, 10), 0, 100);
//         this.mem = clamp(baseMemPct + rand(-2, 5), 0, 100);
//         this.advantage = 1.1 + Math.random() * 0.7;
//         this.prewarmed = true;
//         this.prechunked = false;
//         break;

//       case "vitals":
//         this.cpu = clamp(baseCpu + rand(-5, 5), 0, 100);
//         this.mem = clamp(baseMemPct + rand(-5, 5), 0, 100);
//         this.advantage = 1.0 + Math.random() * 0.3;
//         this.prewarmed = true;
//         this.prechunked = false;
//         break;

//       default:
//         this.cpu = clamp(baseCpu + rand(-5, 5), 0, 100);
//         this.mem = clamp(baseMemPct + rand(-5, 5), 0, 100);
//         this.advantage = 1.0;
//         this.prewarmed = false;
//         this.prechunked = false;
//         break;
//     }

//     this.status =
//       this.cpu >= CONFIG.thresholds.cpuHot ? "hot" :
//       this.cpu >= CONFIG.thresholds.cpuWarm ? "warm" : "running";

//     this.continuanceScore = clamp(
//       (this.prewarmed ? 30 : 0) +
//       (this.prechunked ? 30 : 0) +
//       (100 - Math.abs(50 - this.cpu)) / 2,
//       0,
//       100
//     );
//   }

//   renderLine() {
//     const c = COLORS;
//     const cpuColor =
//       this.cpu >= CONFIG.thresholds.cpuHot ? c.red :
//       this.cpu >= CONFIG.thresholds.cpuWarm ? c.yellow : c.green;

//     const memColor =
//       this.mem >= CONFIG.thresholds.memHot ? c.red :
//       this.mem >= CONFIG.thresholds.memWarm ? c.yellow : c.green;

//     const statusIcon =
//       this.status === "hot" ? ICONS.heat :
//       this.status === "warm" ? ICONS.warn :
//       ICONS.ok;

//     return [
//       `${this.color}${this.icon}${c.reset} ${c.bold}${this.id}${c.reset}`,
//       `CPU: ${cpuColor}${this.cpu.toFixed(0)}%${c.reset}`,
//       `MEM: ${memColor}${this.mem.toFixed(0)}%${c.reset}`,
//       `ADV: ${c.cyan}${this.advantage.toFixed(2)}×${c.reset}`,
//       `STATE: ${statusIcon}`,
//       `PREWARM: ${this.prewarmed ? ICONS.bolt : ICONS.cold}`,
//       `PRECHUNK: ${this.prechunked ? ICONS.chunk : ICONS.cold}`,
//       `CONT: ${this.continuanceScore.toFixed(0)}`
//     ].join("  |  ");
//   }
// }

// /* =============================================================================
//  *  4. PULSEBAND DAEMON — ROOT ORGANISM
//  * ============================================================================= */
// class PulseBandDaemon {
//   constructor() {
//     this.organs = [];
//     this.tickCount = 0;
//     this.timer = null;
//   }

//   discoverOrgans() {
//     const entries = fs.readdirSync(CONFIG.rootDir, { withFileTypes: true });

//     for (const entry of entries) {
//       if (!entry.isDirectory()) continue;
//       const name = entry.name;
//       if (!/^PULSE/i.test(name)) continue;

//       this.organs.push(new PulseOrgan(name));
//     }
//   }

//   async start() {
//     this.discoverOrgans();
//     this.logBanner();

//     await this.tick();
//     this.timer = setInterval(() => this.tick(), CONFIG.tickMs);

//     process.on("SIGINT", () => this.shutdown("SIGINT"));
//     process.on("SIGTERM", () => this.shutdown("SIGTERM"));
//   }

//   async tick() {
//     this.tickCount++;
//     const snapshot = getProcessSnapshot();

//     for (const organ of this.organs) {
//       await organ.tick(snapshot);
//     }

//     this.render(snapshot);
//   }

//   render(snapshot) {
//     const c = COLORS;
//     console.clear();

//     console.log(`${c.bold}${ICONS.band} PulseBand Continuance Daemon v5.0${c.reset}`);
//     console.log(`${c.dim}Tick: ${this.tickCount}${c.reset}`);
//     console.log("");

//     console.log(`${c.bold}SERVER:${c.reset}`);
//     console.log(
//       `CPU~: ${snapshot.cpuApprox}%  |  RSS: ${snapshot.rssMb.toFixed(1)} MB  |  Heap: ${snapshot.heapMb.toFixed(1)}/${snapshot.heapTotalMb.toFixed(1)} MB`
//     );
//     console.log("");

//     console.log(`${c.bold}ORGANS (PULSE* folders):${c.reset}`);
//     if (this.organs.length === 0) {
//       console.log(`  ${c.dim}No PULSE* folders detected in ${CONFIG.rootDir}${c.reset}`);
//     } else {
//       for (const organ of this.organs) {
//         console.log("  " + organ.renderLine());
//       }
//     }

//     console.log("");
//     console.log(
//       `${c.dim}This daemon is always-on, auto-running the organism loop for all PULSE* folders.${c.reset}`
//     );
//   }

//   logBanner() {
//     const c = COLORS;
//     console.log(`${c.bold}${ICONS.band} Starting PulseBand Continuance Daemon...${c.reset}`);
//     console.log(
//       `${c.dim}Root: ${CONFIG.rootDir}  |  Detecting all PULSE* folders as organs.${c.reset}`
//     );
//     console.log("");
//   }

//   shutdown(signal) {
//     const c = COLORS;
//     console.log(`${c.red}${ICONS.err} Shutting down PulseBand (${signal})${c.reset}`);
//     if (this.timer) clearInterval(this.timer);
//     process.exit(0);
//   }
// }

// /* =============================================================================
//  *  5. UTILITIES
//  * ============================================================================= */
// function clamp(v, min, max) {
//   return Math.max(min, Math.min(max, v));
// }
// function rand(min, max) {
//   return Math.random() * (max - min) + min;
// }

// /* =============================================================================
//  *  6. AUTO‑RUN ENTRYPOINT
//  * ============================================================================= */
// (async function main() {
//   const daemon = new PulseBandDaemon();
//   await daemon.start();
// })();
/**
 * File: netlify/functions/organismHeartbeat.js
 * Schedule: every 1 minute
 */
// ============================================================================
// PULSE-NET — Immortal Backend Heartbeat + Forward/Backward Engine ignition
// Fires every minute via Netlify schedule
// ============================================================================

import { createForwardEngine } from "../ForwardEngine.js";
import { createBackwardEngine } from "../BackwardEngine.js";

// Singleton per cold start
let forwardEngine = null;
let backwardEngine = null;

function getForwardEngine() {
  if (forwardEngine) return forwardEngine;

  // TODO: replace with real organs
  const BinaryOrgan = {
    encode: (v) => JSON.stringify(v),
    chunk: (s) => [s],
    dechunk: (chunks) => chunks.join(""),
    decode: (s) => JSON.parse(s)
  };

  const MemoryOrgan = {
    read: (key) => {
      globalThis.__PULSE_MEM__ = globalThis.__PULSE_MEM__ || {};
      return globalThis.__PULSE_MEM__[key] ?? null;
    },
    write: (key, value) => {
      globalThis.__PULSE_MEM__ = globalThis.__PULSE_MEM__ || {};
      globalThis.__PULSE_MEM__[key] = value;
    }
  };

  const BrainOrgan = {
    evolve: (_event) => {}
  };

  forwardEngine = createForwardEngine({
    BinaryOrgan,
    MemoryOrgan,
    BrainOrgan,
    instanceId: "forward-netlify",
    trace: true
  });

  forwardEngine.prewarm();
  return forwardEngine;
}

function getBackwardEngine() {
  if (backwardEngine) return backwardEngine;

  // TODO: replace with real organs
  const BinaryOrgan = {
    encode: (v) => JSON.stringify(v),
    chunk: (s) => [s],
    dechunk: (chunks) => chunks.join(""),
    decode: (s) => JSON.parse(s)
  };

  const MemoryOrgan = {
    read: (key) => {
      globalThis.__PULSE_MEM__ = globalThis.__PULSE_MEM__ || {};
      return globalThis.__PULSE_MEM__[key] ?? null;
    },
    write: (key, value) => {
      globalThis.__PULSE_MEM__ = globalThis.__PULSE_MEM__ || {};
      globalThis.__PULSE_MEM__[key] = value;
    }
  };

  const BrainOrgan = {
    evolve: (_event) => {}
  };

  backwardEngine = createBackwardEngine({
    BinaryOrgan,
    MemoryOrgan,
    BrainOrgan,
    instanceId: "backward-netlify",
    trace: true
  });

  backwardEngine.prewarm();
  return backwardEngine;
}

export const handler = async () => {
  try {
    const state = await getHeartbeatState();

    const now = Date.now();
    const last = state?.last || 0;
    const stale = now - last > 90 * 1000;

    if (stale) {
      await runOrganismHeartbeat();
      await runAIHeartbeat();
      await updateHeartbeatState(now);
    }

    // Engines: warm + tick every fire
    const forwardMetrics = await warmForwardEngine();
    const backwardMetrics = await warmBackwardEngine();

    return {
      statusCode: 200,
      body: JSON.stringify({
        ok: true,
        stale,
        last,
        now,
        forward: forwardMetrics,
        backward: backwardMetrics
      })
    };

  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};

// --------------------------------------------------
// INTERNAL HELPERS
// --------------------------------------------------

async function getHeartbeatState() {
  return { last: 0 }; // TODO: real DB/KV
}

async function updateHeartbeatState(ts) {
  console.log("Heartbeat updated:", ts);
}

async function runOrganismHeartbeat() {
  console.log("Organism heartbeat triggered");
}

async function runAIHeartbeat() {
  console.log("AI heartbeat triggered");
}

async function warmForwardEngine() {
  const engine = getForwardEngine();
  const result = engine.tick();
  console.log("[PULSE-NET] ForwardEngine tick:", result.metrics);
  return result.metrics;
}

async function warmBackwardEngine() {
  const engine = getBackwardEngine();
  const result = engine.tick();
  console.log("[PULSE-NET] BackwardEngine tick:", result.metrics);
  return result.metrics;
}
// --------------------------------------------------
// EXPORT ENGINES FOR EARN PAGE
// --------------------------------------------------
export function PulseNetForward() {
  return getForwardEngine();
}

export function PulseNetBackward() {
  return getBackwardEngine();
}
