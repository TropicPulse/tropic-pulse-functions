// ============================================================================
//  PulsePresenceNormalizer-SMART v2.0
//  Contract-driven bridge: A → Z
//  No guessing. No heuristics. No fallback decoding.
//  Fully aligned with PulseChunks-v2.0-MULTILANE-HYBRID
// ============================================================================

// SMART: unwrap ONLY ONE LAYER.
// Backend must declare the shape. No recursive peeling.
function unwrap(value) {
  if (!value || typeof value !== "object") return value;

  // Lore-wrapped DNA
  if (value.__dna !== undefined) return value.__dna;
  if (value.__chunk !== undefined) return value.__chunk;

  // Backend-declared wrappers
  if (value.data !== undefined) return value.data;
  if (value.chunk !== undefined) return value.chunk;
  if (value.value !== undefined) return value.value;

  return value;
}

// ============================================================================
//  SMART IMAGE CONSTRUCTOR — A → Z (image)
// ============================================================================
export function normalizeImage(value, mime = "image/png") {
  value = unwrap(value);

  // 1. Direct URL string
  if (typeof value === "string") return value;

  // 2. Base64 object
  if (value && typeof value.base64 === "string") {
    return `data:${mime};base64,${value.base64}`;
  }

  // 3. Uint8Array / ArrayBuffer → Blob URL
  if (value instanceof Uint8Array) {
    return URL.createObjectURL(new Blob([value], { type: mime }));
  }

  if (value instanceof ArrayBuffer) {
    return URL.createObjectURL(new Blob([new Uint8Array(value)], { type: mime }));
  }

  // 4. Blob → Blob URL
  if (value instanceof Blob) {
    return URL.createObjectURL(value);
  }

  // 5. { url }
  if (value && typeof value.url === "string") {
    return value.url;
  }

  // 6. Unknown → null (SMART: do NOT guess)
  return null;
}

// ============================================================================
//  SMART TEXT / HTML / CSS / JS
// ============================================================================
function normalizeText(value) {
  value = unwrap(value);
  return typeof value === "string" ? value : null;
}

// ============================================================================
//  SMART JSON
// ============================================================================
function normalizeJSON(value) {
  value = unwrap(value);
  return typeof value === "object" ? value : null;
}

// ============================================================================
//  SMART BINARY
// ============================================================================
function normalizeBinary(value, mime = "application/octet-stream") {
  value = unwrap(value);

  if (value instanceof Uint8Array) {
    return new Blob([value], { type: mime });
  }

  if (value instanceof ArrayBuffer) {
    return new Blob([new Uint8Array(value)], { type: mime });
  }

  if (value instanceof Blob) return value;

  return null;
}

// ============================================================================
//  SMART UNIVERSAL NORMALIZER
//  typeHint: "image" | "html" | "css" | "js" | "json" | "binary"
// ============================================================================
export function normalizeChunkValue(value, typeHint = null, options = {}) {
  const mime = options.mime || "application/octet-stream";

  switch (typeHint) {
    case "image":
      return normalizeImage(value, mime);

    case "html":
    case "css":
    case "js":
      return normalizeText(value);

    case "json":
      return normalizeJSON(value);

    case "binary":
      return normalizeBinary(value, mime);

    default:
      // SMART: no guessing. Return raw.
      return unwrap(value);
  }
}

// ============================================================================
//  EXPORTS
// ============================================================================
export const PulseChunkNormalizer = {
  normalizeChunkValue,
  normalizeImage,
  normalizeHTML: normalizeText,
  normalizeCSS: normalizeText,
  normalizeJS: normalizeText,
  normalizeJSON,
  normalizeBinary,
  unwrap
};

export default PulseChunkNormalizer;
