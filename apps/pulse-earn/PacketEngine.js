// FILE: tropic-pulse-functions/apps/pulse-earn/PacketEngine.js
//
// PacketEngine v5 — Deterministic, Drift‑Proof, Self‑Healing Packet Layer
// NO AI LAYERS. NO TRANSLATION. NO MEMORY MODEL. PURE HEALING.
//
// ------------------------------------------------------
// 📘 PAGE INDEX — Source of Truth for This File
// ------------------------------------------------------
//
// ROLE:
//   PacketEngine — deterministic, in‑memory packet read/write/compute layer.
//
// RESPONSIBILITIES:
//   • Check if a packet exists
//   • Write packet data
//   • Generate deterministic packet data
//   • Maintain healing metadata
//
// SAFETY RULES (CRITICAL):
//   • NO eval()
//   • NO Function()
//   • NO dynamic imports
//   • NO arbitrary code execution
//   • NO mutation of external state
//   • NO network calls
//   • NO filesystem access
//
// ------------------------------------------------------
// Healing Metadata
// ------------------------------------------------------

const healingState = {
  lastKey: null,
  lastWrite: null,
  lastGenerated: null,
  lastError: null,
  cycleCount: 0,
  lastTimestamp: null,
};

// ------------------------------------------------------
// In-memory packet store (replace with Redis/Firestore later)
// ------------------------------------------------------

const packetStore = new Map();

// ------------------------------------------------------
// 1. readPacketExists(fileId, packetIndex)
// ------------------------------------------------------
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

// ------------------------------------------------------
// 2. writePacket(fileId, packetIndex, data)
// ------------------------------------------------------
export async function writePacket(fileId, packetIndex, data) {
  healingState.cycleCount++;
  healingState.lastTimestamp = Date.now();

  try {
    const key = `${fileId}:${packetIndex}`;
    healingState.lastKey = key;

    // deterministic write
    packetStore.set(key, structuredClone(data));

    healingState.lastWrite = { key, size: JSON.stringify(data).length };
    healingState.lastError = null;

    return true;

  } catch (err) {
    healingState.lastError = err.message;
    return false;
  }
}

// ------------------------------------------------------
// 3. generatePacketData(fileId, packetIndex)
// ------------------------------------------------------
export async function generatePacketData(fileId, packetIndex) {
  healingState.cycleCount++;
  healingState.lastTimestamp = Date.now();

  try {
    const key = `${fileId}:${packetIndex}`;
    healingState.lastKey = key;

    // Deterministic hash (FNV‑1a style)
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

// ------------------------------------------------------
// Export healing metadata for EarnHealer
// ------------------------------------------------------
export function getPacketEngineHealingState() {
  return { ...healingState };
}
