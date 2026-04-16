// FILE: tropic-pulse-functions/apps/pulse-gpu/PulseGPUEventEmitter.js
//
// INTENT-CHECK: If you paste this while confused or frustrated, gently re-read your INTENT.
//
// 📘 PAGE INDEX — Source of Truth for This File
//
// ROLE:
//   PulseGPUEventEmitter — a tiny, deterministic, in-memory event bus for Pulse-GPU.
//   Lets Engine, Runtime, Tracer, Memory, Advisor, Restorer, and Insights exchange
//   structured events without any external dependencies.
//
//   This file IS:
//     • A pure logic module (full GPU, API-agnostic)
//     • A minimal pub/sub system for Pulse-GPU
//     • A way to wire subsystems together without tight coupling
//     • v5-ready: events include metadata for self-repair + replay
//
//   This file IS NOT:
//     • A renderer
//     • A GPU runtime
//     • A WebGPU/WebGL interface
//     • A persistence layer
//     • A UI or notification system
//     • A backend module
//
// DEPLOYMENT:
//   Lives in /apps/pulse-gpu as part of the GPU subsystem.
//   Must remain ESM-only and side-effect-free (no global singletons).
//   Must be safe to run in both browser and server environments.
//
// SAFETY RULES:
//   • NO WebGPU/WebGL APIs
//   • NO DOM APIs
//   • NO Node.js APIs
//   • NO filesystem or network access
//   • NO randomness or timestamps
//   • FAIL-OPEN: invalid event types or handlers must not break the system
//   • SELF-REPAIR READY: events must contain enough metadata for replay + healing
//
// INTERNAL LOGIC SUMMARY (v4/v5-ready):
//   • Event shape:
//       {
//         type: string,
//         payload?: any,
//         meta: { layer, version, target }
//       }
//
//   • Core operations:
//       - on(eventType, handler)
//       - off(eventType, handler)
//       - emit(eventType, payload)
//       - clearAll()
//
//   • Intended event types (examples, not enforced):
//       - "session-started"
//       - "session-step-recorded"
//       - "session-ended"
//       - "performance-regression"
//       - "performance-improvement"
//       - "settings-restore-planned"
//       - "tier-upgrade-opportunity"
//       - "insights-available"
//
// ------------------------------------------------------
// PulseGPUEventEmitter (v4/v5-ready)
// ------------------------------------------------------

class PulseGPUEventEmitter {
  constructor() {
    // eventType -> Set<handler>
    this.handlers = new Map();
  }

  // ----------------------------------------------------
  // Subscribe to an event type (fail-open)
  // ----------------------------------------------------
  on(eventType, handler) {
    if (!eventType || typeof handler !== "function") {
      return; // fail-open: ignore invalid subscription
    }

    const type = String(eventType);
    let set = this.handlers.get(type);
    if (!set) {
      set = new Set();
      this.handlers.set(type, set);
    }

    set.add(handler);
  }

  // ----------------------------------------------------
  // Unsubscribe from an event type (fail-open)
  // ----------------------------------------------------
  off(eventType, handler) {
    if (!eventType || typeof handler !== "function") {
      return; // fail-open
    }

    const type = String(eventType);
    const set = this.handlers.get(type);
    if (!set) return;

    set.delete(handler);
    if (set.size === 0) {
      this.handlers.delete(type);
    }
  }

  // ----------------------------------------------------
  // Emit an event (v5-ready metadata)
  // ----------------------------------------------------
  emit(eventType, payload) {
    if (!eventType) return; // fail-open

    const type = String(eventType);
    const set = this.handlers.get(type);
    if (!set || set.size === 0) return;

    const eventObject = {
      type,
      payload,
      meta: {
        layer: "PulseGPUEventEmitter",
        version: 4,
        target: "full-gpu",
        selfRepairable: true
      }
    };

    // Synchronous, deterministic dispatch
    for (const handler of set) {
      handler(eventObject);
    }
  }

  // ----------------------------------------------------
  // Clear all handlers
  // ----------------------------------------------------
  clearAll() {
    this.handlers.clear();
  }
}

// ------------------------------------------------------
// EXPORTS
// ------------------------------------------------------

export {
  PulseGPUEventEmitter
};
