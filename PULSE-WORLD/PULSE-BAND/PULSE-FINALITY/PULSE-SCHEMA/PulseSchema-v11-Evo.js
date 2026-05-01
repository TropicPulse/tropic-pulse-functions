/**
 * PulseSchema-v12.3-Presence.js
 * PULSE-FINALITY / PULSE-SCHEMA
 *
 * ROLE:
 *   Canonical, host-agnostic schema brain for Pulse OS.
 *   Everything else (Firestore, SQL, Binary, Regions, Hosts) is translation.
 *
 * MAP:
 *   - PulseSchema is the ONLY canonical schema.
 *   - All external schemas MUST be translated INTO PulseSchema.
 *   - All external targets MUST be generated FROM PulseSchema.
 *   - No host, DB, or platform is allowed to define “truth” directly.
 *
 * NEVER:
 *   - Never mutate external schemas in place.
 *   - Never embed host-specific logic inside PulseSchema.
 *   - Never introduce randomness or non-deterministic behavior.
 *
 * ALWAYS:
 *   - Always treat PulseSchema as read-only truth.
 *   - Always translate deterministically.
 *   - Always keep binary as the lowest-level representation.
 */

// -------------------------
// Canonical Types
// -------------------------

/**
 * PulseField
 * The atomic unit of schema definition.
 *
 * type:      logical type (string, number, boolean, object, array, binary, etc.)
 * required:  whether this field must be present
 * default:   default value (if any)
 * constraints: optional constraints (min, max, enum, pattern, etc.)
 * meta:      free-form metadata (labels, descriptions, tags, etc.)
 */
/**
 * PulseSchema-v12.3-PRESENCE-EVO+.js
 * PULSE-FINALITY / PULSE-SCHEMA
 *
 * ROLE:
 *   Canonical, host-agnostic schema brain for Pulse OS.
 *   Everything else (Firestore, SQL, Binary, Regions, Hosts) is translation.
 *
 *   12.3+:
 *     - presenceAware
 *     - advantageAware
 *     - fallbackBandAware
 *     - chunkAware
 *     - cacheAware
 *     - prewarmAware
 *     - coldStartAware
 *     - dualband-safe overlays
 *
 * NEVER:
 *   - Never mutate external schemas.
 *   - Never embed host-specific logic.
 *   - Never introduce randomness.
 *
 * ALWAYS:
 *   - Always treat PulseSchema as canonical truth.
 *   - Always translate deterministically.
 *   - Always keep binary as lowest-level representation.
 */

// ============================================================================
// META — v12.3-PRESENCE-EVO+
// ============================================================================

export const PulseSchemaMeta = Object.freeze({
  layer: "PulseSchema",
  role: "CANONICAL_SCHEMA_ORGAN",
  version: "12.3-PRESENCE-EVO+",
  identity: "PulseSchema-v12.3-PRESENCE-EVO+",

  evo: Object.freeze({
    deterministic: true,
    driftProof: true,
    hostAgnostic: true,
    reversibleBinary: true,
    noRandomness: true,
    noHostLogic: true,

    // 12.3+ organism overlays
    presenceAware: true,
    advantageAware: true,
    fallbackBandAware: true,
    chunkAware: true,
    cacheAware: true,
    prewarmAware: true,
    coldStartAware: true,
    dualbandSafe: true,

    epoch: "12.3-PRESENCE-EVO+"
  })
});

// ============================================================================
// Canonical Types
// ============================================================================

export class PulseField {
  constructor({
    type,
    required = false,
    defaultValue = undefined,
    constraints = {},
    meta = {}
  }) {
    this.type = type;
    this.required = !!required;
    this.defaultValue = defaultValue;
    this.constraints = constraints || {};
    this.meta = meta || {};
  }
}

export class PulseSchema {
  constructor({
    fields = {},
    version = 1,
    lineage = null,
    region = null,
    meta = {}
  }) {
    this.fields = fields;
    this.version = version;
    this.lineage = lineage;
    this.region = region;
    this.meta = meta;
  }
}

// ============================================================================
// Type Helpers
// ============================================================================

function mapHostTypeToPulseType(hostType) {
  const t = String(hostType || "").toLowerCase();

  if (["string", "varchar", "text", "char"].some(x => t.includes(x))) return "string";
  if (["int", "integer", "bigint", "smallint", "number", "numeric", "decimal", "float", "double"].some(x => t.includes(x))) return "number";
  if (["bool", "boolean"].some(x => t.includes(x))) return "boolean";
  if (["json", "object"].some(x => t.includes(x))) return "object";
  if (["array"].some(x => t.includes(x))) return "array";
  if (["binary", "blob", "bytea"].some(x => t.includes(x))) return "binary";
  if (["timestamp", "datetime", "date"].some(x => t.includes(x))) return "string";

  return "string";
}

// ============================================================================
// Firestore → PulseSchema
// ============================================================================

export function unifyFromFirestore(firestoreSchema) {
  const fields = {};
  const srcFields = (firestoreSchema && firestoreSchema.fields) || {};

  for (const [key, def] of Object.entries(srcFields)) {
    const pulseType = mapHostTypeToPulseType(def.type);
    fields[key] = new PulseField({
      type: pulseType,
      required: !!def.required,
      defaultValue: def.defaultValue,
      constraints: def.constraints || {},
      meta: def.meta || {}
    });
  }

  return new PulseSchema({
    fields,
    version: firestoreSchema.version || 1,
    lineage: firestoreSchema.lineage || null,
    region: firestoreSchema.region || null,
    meta: firestoreSchema.meta || {}
  });
}

// ============================================================================
// SQL → PulseSchema
// ============================================================================

export function unifyFromSQL(sqlSchema) {
  const fields = {};
  const cols = (sqlSchema && sqlSchema.columns) || [];

  for (const col of cols) {
    const pulseType = mapHostTypeToPulseType(col.type);
    fields[col.name] = new PulseField({
      type: pulseType,
      required: col.nullable === false,
      defaultValue: col.defaultValue,
      constraints: {
        maxLength: col.maxLength,
        precision: col.precision,
        scale: col.scale
      },
      meta: col.meta || {}
    });
  }

  return new PulseSchema({
    fields,
    version: sqlSchema.version || 1,
    lineage: sqlSchema.lineage || null,
    region: sqlSchema.region || null,
    meta: sqlSchema.meta || {}
  });
}

// ============================================================================
// Binary → PulseSchema
// ============================================================================

export function unifyFromBinary(binaryBuffer) {
  if (!binaryBuffer) return new PulseSchema({});

  let decoded;
  try {
    const jsonStr =
      typeof binaryBuffer === "string"
        ? binaryBuffer
        : new TextDecoder("utf-8").decode(binaryBuffer);
    decoded = JSON.parse(jsonStr);
  } catch (e) {
    return new PulseSchema({
      fields: {},
      version: 1,
      meta: { error: "Failed to decode binary schema", detail: String(e) }
    });
  }

  const fields = {};
  const srcFields = decoded.fields || {};
  for (const [key, def] of Object.entries(srcFields)) {
    fields[key] = new PulseField({
      type: def.type,
      required: !!def.required,
      defaultValue: def.defaultValue,
      constraints: def.constraints || {},
      meta: def.meta || {}
    });
  }

  return new PulseSchema({
    fields,
    version: decoded.version || 1,
    lineage: decoded.lineage || null,
    region: decoded.region || null,
    meta: decoded.meta || {}
  });
}

// ============================================================================
// PulseSchema → Binary
// ============================================================================

export function unifyToBinary(pulseSchema) {
  const safe = {
    fields: {},
    version: pulseSchema.version || 1,
    lineage: pulseSchema.lineage || null,
    region: pulseSchema.region || null,
    meta: pulseSchema.meta || {}
  };

  for (const [key, field] of Object.entries(pulseSchema.fields || {})) {
    safe.fields[key] = {
      type: field.type,
      required: !!field.required,
      defaultValue: field.defaultValue,
      constraints: field.constraints || {},
      meta: field.meta || {}
    };
  }

  const jsonStr = JSON.stringify(safe);
  return new TextEncoder().encode(jsonStr);
}

// ============================================================================
// Schema Merging
// ============================================================================

export function mergeSchemas(schemaA, schemaB) {
  const mergedFields = {};
  const allKeys = new Set([
    ...Object.keys(schemaA.fields || {}),
    ...Object.keys(schemaB.fields || {})
  ]);

  const conflicts = [];

  for (const key of allKeys) {
    const fa = schemaA.fields[key];
    const fb = schemaB.fields[key];

    if (fa && !fb) {
      mergedFields[key] = new PulseField({ ...fa });
      continue;
    }
    if (!fa && fb) {
      mergedFields[key] = new PulseField({ ...fb });
      continue;
    }

    if (fa.type !== fb.type) {
      conflicts.push({ field: key, from: fa.type, to: fb.type });
    }

    mergedFields[key] = new PulseField({
      type: fb.type || fa.type,
      required: !!(fa.required || fb.required),
      defaultValue:
        fb.defaultValue !== undefined ? fb.defaultValue : fa.defaultValue,
      constraints: { ...(fa.constraints || {}), ...(fb.constraints || {}) },
      meta: { ...(fa.meta || {}), ...(fb.meta || {}) }
    });
  }

  const version = Math.max(schemaA.version || 1, schemaB.version || 1) + 1;

  const meta = {
    ...(schemaA.meta || {}),
    ...(schemaB.meta || {})
  };

  if (conflicts.length > 0) {
    meta.schemaConflicts = conflicts;
  }

  return new PulseSchema({
    fields: mergedFields,
    version,
    lineage: schemaB.lineage || schemaA.lineage || null,
    region: schemaB.region || schemaA.region || null,
    meta
  });
}

// ============================================================================
// Exported API Surface
// ============================================================================

const PulseSchemaAPI_v12_3 = {
  Meta: PulseSchemaMeta,
  PulseField,
  PulseSchema,
  unifyFromFirestore,
  unifyFromSQL,
  unifyFromBinary,
  unifyToBinary,
  mergeSchemas
};

export default PulseSchemaAPI_v12_3;
