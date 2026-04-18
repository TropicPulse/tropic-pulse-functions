// ============================================================================
// FILE: tropic-pulse-functions/apps/pulse-earn/PacketEngine.js
// LAYER: THE ARCHIVIST
// (Keeper of Packets + Guardian of Determinism + Memory of the Future)
// ============================================================================
//
// ROLE:
//   THE ARCHIVIST — Pulse‑Earn’s deterministic packet memory.
//   • Stores packet data in a safe, in‑memory archive
//   • Generates deterministic packet values (identity → future)
//   • Ensures reproducibility for healing + compute
//   • Maintains packet‑level healing metadata
//
// WHY “ARCHIVIST”?:
//   • Protects the smallest unit of truth (packets)
//   • Guarantees deterministic reconstruction of future data
//   • Acts as the vault for Earn’s memory substrate
//   • Supports healing by regenerating lost packets
//
// PURPOSE:
//   • Provide a deterministic, drift‑proof packet layer
//   • Guarantee safe read/write/compute operations
//   • Serve as the foundation for EarnHealer’s repair logic
//
// CONTRACT:
//   • PURE PACKET ENGINE — no AI layers, no translation, no memory model
//   • NO eval(), NO Function(), NO dynamic imports
//   • NO network calls, NO filesystem, NO external mutation
//   • Deterministic hashing + safe in‑memory storage only
//
// SAFETY:
//   • v6.3 upgrade is COMMENTAL ONLY — NO LOGIC CHANGES
//   • All behavior remains identical to pre‑v6.3 PacketEngine
// ============================================================================

// ---------------------------------------------------------------------------
// Healing Metadata — Archivist Log
// ---------------------------------------------------------------------------
const healingState = {
  lastKey: null,
  lastWrite: null,
  lastGenerated: null,
  lastError: null,
  cycleCount: 0,
  lastTimestamp: null,
};

// ---------------------------------------------------------------------------
// In‑Memory Archive — Packet Store
// ---------------------------------------------------------------------------
const packetStore = new Map();

// ---------------------------------------------------------------------------
// 1. readPacketExists — Archive Lookup
// ---------------------------------------------------------------------------
export async function readPacketExists(fileId, packetIndex) {
  healingState.cycleCount++;
  healingState.lastTimestamp = Date.now();

  try {
    const key = `${fileId}:${packetIndex}`;
    healingState.lastKey = key;

    return packetStore.has(key);

  } catch (err) {
    healingState.lastError = err.message;
    return false;
  }
}

// ---------------------------------------------------------------------------
// 2. writePacket — Archive Write
// ---------------------------------------------------------------------------
export async function writePacket(fileId, packetIndex, data) {
  healingState.cycleCount++;
  healingState.lastTimestamp = Date.now();

  try {
    const key = `${fileId}:${packetIndex}`;
    healingState.lastKey = key;

    packetStore.set(key, structuredClone(data));

    healingState.lastWrite = { key, size: JSON.stringify(data).length };
    healingState.lastError = null;

    return true;

  } catch (err) {
    healingState.lastError = err.message;
    return false;
  }
}

// ---------------------------------------------------------------------------
// 3. generatePacketData — Deterministic Future Generator
// ---------------------------------------------------------------------------
export async function generatePacketData(fileId, packetIndex) {
  healingState.cycleCount++;
  healingState.lastTimestamp = Date.now();

  try {
    const key = `${fileId}:${packetIndex}`;
    healingState.lastKey = key;

    // Deterministic FNV‑1a hash → future value
    let hash = 2166136261;
    for (let i = 0; i < key.length; i++) {
      hash ^= key.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }

    const value = (hash >>> 0) / 0xffffffff;

    const packet = {
      fileId,
      packetIndex,
      key,
      value,
      generatedAt: Date.now(),
    };

    healingState.lastGenerated = packet;
    healingState.lastError = null;

    return packet;

  } catch (err) {
    healingState.lastError = err.message;
    return null;
  }
}

// ---------------------------------------------------------------------------
// Export Healing Metadata — Archivist Report
// ---------------------------------------------------------------------------
export function getPacketEngineHealingState() {
  return { ...healingState };
}
