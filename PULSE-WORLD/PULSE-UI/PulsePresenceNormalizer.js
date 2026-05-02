// ============================================================================
//  PulsePresenceNormalizer-v1.0
//  Universal de-chunker — converts DNA back to browser-usable primitives
//  Images • HTML • CSS • JS • JSON • Binary
// ============================================================================

function unwrapDNA(value) {
  if (value && typeof value === "object" && value.__dna) {
    return value.__dna;
  }
  if (value && typeof value === "object" && value.__chunk) {
    return value.__chunk;
  }
  return value;
}

function unwrapCommon(value) {
  // Generic wrappers: { data }, { chunk }, { value }
  if (value && typeof value === "object") {
    if (value.data !== undefined) return value.data;
    if (value.chunk !== undefined) return value.chunk;
    if (value.value !== undefined) return value.value;
  }
  return value;
}

function toText(value) {
  if (typeof value === "string") return value;

  value = unwrapDNA(value);
  value = unwrapCommon(value);

  if (typeof value === "string") return value;

  if (value instanceof Uint8Array) {
    return new TextDecoder("utf-8").decode(value);
  }

  if (value instanceof ArrayBuffer) {
    return new TextDecoder("utf-8").decode(new Uint8Array(value));
  }

  return null;
}

function toJSON(value) {
  const text = toText(value);
  if (!text) return null;
  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function toBlob(value, mime = "application/octet-stream") {
  value = unwrapDNA(value);
  value = unwrapCommon(value);

  if (value instanceof Blob) return value;

  if (value instanceof Uint8Array) {
    return new Blob([value], { type: mime });
  }

  if (value instanceof ArrayBuffer) {
    return new Blob([value], { type: mime });
  }

  return null;
}

function toObjectURL(value, mime = "application/octet-stream") {
  const blob = toBlob(value, mime);
  if (!blob) return null;
  return URL.createObjectURL(blob);
}

export function normalizeImage(value) {
  // 1. Direct URL string
  if (typeof value === "string") {
    return value;
  }

  // 2. Base64 object
  if (value && typeof value === "object" && typeof value.base64 === "string") {
    return `data:image/png;base64,${value.base64}`;
  }

  // 3. Unwrap DNA / common wrappers
  value = unwrapDNA(value);
  value = unwrapCommon(value);

  // 4. Uint8Array / ArrayBuffer / Blob → object URL
  if (value instanceof Uint8Array ||
      value instanceof ArrayBuffer ||
      value instanceof Blob) {
    return toObjectURL(value, "image/png");
  }

  // 5. { url }
  if (value && typeof value === "object" && typeof value.url === "string") {
    return value.url;
  }

  return null;
}

function normalizeHTML(value) {
  return toText(value);
}

function normalizeCSS(value) {
  return toText(value);
}

function normalizeJS(value) {
  return toText(value);
}

function normalizeJSON(value) {
  return toJSON(value);
}

function normalizeBinary(value, mime = "application/octet-stream") {
  return toBlob(value, mime);
}

// ============================================================================
//  UNIVERSAL NORMALIZER
//  typeHint: "image" | "html" | "css" | "js" | "json" | "binary" | null
// ============================================================================
export function normalizeChunkValue(value, typeHint = null, options = {}) {
  switch (typeHint) {
    case "image":
      return normalizeImage(value);
    case "html":
      return normalizeHTML(value);
    case "css":
      return normalizeCSS(value);
    case "js":
      return normalizeJS(value);
    case "json":
      return normalizeJSON(value);
    case "binary":
      return normalizeBinary(value, options.mime || "application/octet-stream");
    default:
      // Fallback: try text, then image, then JSON
      const text = toText(value);
      if (text !== null) return text;

      const img = normalizeImage(value);
      if (img !== null) return img;

      const json = normalizeJSON(value);
      if (json !== null) return json;

      return value;
  }
}

export const PulseChunkNormalizer = {
  normalizeChunkValue,
  normalizeImage,
  normalizeHTML,
  normalizeCSS,
  normalizeJS,
  normalizeJSON,
  normalizeBinary,
  unwrapDNA,
  unwrapCommon,
  toText,
  toJSON,
  toBlob,
  toObjectURL
};

export default PulseChunkNormalizer;
