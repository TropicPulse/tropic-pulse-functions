// ============================================================
//  PulseChunks-v1.js
//  Frontend Chunker Firewall Layer
//  Prevents backend + long-term memory from ever being chunked
// ============================================================

console.log("[PulseChunks-v1] Loaded pre-page chunk firewall");

// ------------------------------------------------------------
// OUTLIER RULES — THE SAFETY FENCE
// ------------------------------------------------------------
function shouldSkipChunk(filePath, fileSize = 0) {
  if (!filePath) return true;

  // Never chunk backend long-term memory
  if (filePath.includes("PulseOSLongTermMemory.js")) {
    console.warn("[PulseChunks-v1] BLOCKED: Long-term memory file");
    return true;
  }

  // Never chunk backend index.js (firebase-admin lives here)
  if (filePath.includes("index.js")) {
    console.warn("[PulseChunks-v1] BLOCKED: Backend index.js");
    return true;
  }

  // Never chunk firebase-admin or server imports
  if (filePath.includes("firebase-admin")) {
    console.warn("[PulseChunks-v1] BLOCKED: firebase-admin");
    return true;
  }

  // Only chunk frontend assets
  if (!filePath.startsWith("/public") && !filePath.startsWith("/frontend")) {
    console.warn("[PulseChunks-v1] BLOCKED: Outside frontend scope");
    return true;
  }

  // Never chunk huge files (>1MB)
  if (fileSize > 1024 * 1024) {
    console.warn("[PulseChunks-v1] BLOCKED: File too large");
    return true;
  }

  return false;
}

// ------------------------------------------------------------
// CHUNKER ENTRY — SAFE WRAPPER
// ------------------------------------------------------------
async function PulseChunker(filePath, fileSize = 0) {
  if (shouldSkipChunk(filePath, fileSize)) {
    return null; // Do nothing
  }

  console.log("[PulseChunks-v1] Chunking allowed:", filePath);

  // Fetch file safely
  const res = await fetch(filePath);
  const text = await res.text();

  // Extract ONLY the function name (hook)
  const functionName = extractFunctionName(text);

  return {
    functionName,
    chunked: true,
    safe: true
  };
}

// ------------------------------------------------------------
// Extract ONLY the function name — NOT the whole file
// ------------------------------------------------------------
function extractFunctionName(fileText) {
  // Look for: export async function NAME(
  const match = fileText.match(/export\s+async\s+function\s+([A-Za-z0-9_]+)/);

  if (!match) return null;

  return match[1];
}

// ------------------------------------------------------------
// Expose to window
// ------------------------------------------------------------
window.PulseChunker = PulseChunker;

console.log("[PulseChunks-v1] Ready.");
