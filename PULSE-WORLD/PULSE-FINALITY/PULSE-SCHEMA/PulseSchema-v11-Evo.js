/**
 * PulseSchema-v11-Evo.js
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
 * META {
 *   organ: "PulseSchema",
 *   root: "PULSE-FINALITY",
 *   mode: "substrate",
 *   target: "schema-unification",
 *   version: "v11-EVO",
 *
 *   role: "Canonical, host-agnostic schema brain. All external schemas translate into this.",
 *
 *   guarantees: {
 *     determinism: true,
 *     hostAgnostic: true,
 *     reversibleBinary: true,
 *     noRandomness: true,
 *     noHostLogic: true
 *   },
 *
 *   contracts: {
 *     input: [
 *       "FirestoreSchema",
 *       "SQLSchema",
 *       "BinarySchema"
 *     ],
 *     output: [
 *       "PulseSchema",
 *       "PulseSchemaBinary"
 *     ]
 *   },
 *
 *   integration: {
 *     upstream: [
 *       "PulseGrid (optional for Continuance Physics)",
 *       "PulseNet (optional for routing)"
 *     ],
 *     downstream: [
 *       "PulseOmniHosting",
 *       "PulseContinuance",
 *       "DeltaEngine",
 *       "SnapshotPhysics",
 *       "LineageEngine"
 *     ]
 *   },
 *
 *   notes: [
 *     "PulseSchema is the ONLY canonical schema.",
 *     "All hosts must translate INTO PulseSchema.",
 *     "All targets must be generated FROM PulseSchema.",
 *     "This organ defines the universal data language of Pulse OS."
 *   ]
 * }
 */

export class PulseField {
  constructor({
    type,
    required = false,
    defaultValue = undefined,
    constraints = {},
    meta = {},
  }) {
    this.type = type; // "string" | "number" | "boolean" | "object" | "array" | "binary" | ...
    this.required = !!required;
    this.defaultValue = defaultValue;
    this.constraints = constraints || {};
    this.meta = meta || {};
  }
}

/**
 * PulseSchema
 * The canonical schema for any entity/table/collection.
 *
 * fields:   map of fieldName -> PulseField
 * version:  monotonically increasing version number
 * lineage:  optional lineage identifier (for schema evolution tracking)
 * region:   optional region identifier (for region-aware schemas)
 * meta:     free-form metadata
 */
export class PulseSchema {
  constructor({
    fields = {},
    version = 1,
    lineage = null,
    region = null,
    meta = {},
  }) {
    this.fields = fields; // { [key: string]: PulseField }
    this.version = version;
    this.lineage = lineage;
    this.region = region;
    this.meta = meta;
  }
}

// -------------------------
// Type Helpers
// -------------------------

/**
 * Map host-specific types to PulseField types.
 * This MUST be deterministic.
 */
function mapHostTypeToPulseType(hostType) {
  const t = String(hostType || "").toLowerCase();

  if (["string", "varchar", "text", "char"].some((x) => t.includes(x))) {
    return "string";
  }
  if (["int", "integer", "bigint", "smallint", "number", "numeric", "decimal", "float", "double"].some((x) => t.includes(x))) {
    return "number";
  }
  if (["bool", "boolean"].some((x) => t.includes(x))) {
    return "boolean";
  }
  if (["json", "object"].some((x) => t.includes(x))) {
    return "object";
  }
  if (["array"].some((x) => t.includes(x))) {
    return "array";
  }
  if (["binary", "blob", "bytea"].some((x) => t.includes(x))) {
    return "binary";
  }
  if (["timestamp", "datetime", "date"].some((x) => t.includes(x))) {
    return "string"; // ISO timestamp as string
  }

  // Fallback: treat as string
  return "string";
}

// -------------------------
// Firestore → PulseSchema
// -------------------------

/**
 * unifyFromFirestore
 *
 * Input: Firestore-like document schema description.
 *   Example shape (symbolic, not enforced):
 *   {
 *     fields: {
 *       name: { type: "string", required: true },
 *       age:  { type: "number" },
 *       ...
 *     },
 *     meta: { ... }
 *   }
 *
 * Output: PulseSchema
 */
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
      meta: def.meta || {},
    });
  }

  return new PulseSchema({
    fields,
    version: firestoreSchema.version || 1,
    lineage: firestoreSchema.lineage || null,
    region: firestoreSchema.region || null,
    meta: firestoreSchema.meta || {},
  });
}

// -------------------------
// SQL → PulseSchema
// -------------------------

/**
 * unifyFromSQL
 *
 * Input: SQL-like schema description.
 *   Example shape:
 *   {
 *     tableName: "users",
 *     columns: [
 *       { name: "id", type: "BIGINT", nullable: false },
 *       { name: "email", type: "VARCHAR(255)", nullable: false },
 *       ...
 *     ],
 *     meta: { ... }
 *   }
 *
 * Output: PulseSchema
 */
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
        scale: col.scale,
      },
      meta: col.meta || {},
    });
  }

  return new PulseSchema({
    fields,
    version: sqlSchema.version || 1,
    lineage: sqlSchema.lineage || null,
    region: sqlSchema.region || null,
    meta: sqlSchema.meta || {},
  });
}

// -------------------------
// Binary → PulseSchema
// -------------------------

/**
 * unifyFromBinary
 *
 * Input: binary buffer that encodes a schema.
 * For v11-Evo, we assume a simple, deterministic encoding:
 *   - JSON string → UTF-8 → binary
 *   - JSON shape matches PulseSchema-like structure
 *
 * Output: PulseSchema
 *
 * NOTE:
 *   This is intentionally simple and deterministic.
 *   Future versions can swap the encoding as long as it remains reversible.
 */
export function unifyFromBinary(binaryBuffer) {
  if (!binaryBuffer) {
    return new PulseSchema({});
  }

  let decoded;
  try {
    const jsonStr =
      typeof binaryBuffer === "string"
        ? binaryBuffer
        : new TextDecoder("utf-8").decode(binaryBuffer);
    decoded = JSON.parse(jsonStr);
  } catch (e) {
    // If decoding fails, return an empty schema with meta error.
    return new PulseSchema({
      fields: {},
      version: 1,
      meta: { error: "Failed to decode binary schema", detail: String(e) },
    });
  }

  // If the decoded object already looks like a PulseSchema, normalize it.
  const fields = {};
  const srcFields = decoded.fields || {};
  for (const [key, def] of Object.entries(srcFields)) {
    fields[key] = new PulseField({
      type: def.type,
      required: !!def.required,
      defaultValue: def.defaultValue,
      constraints: def.constraints || {},
      meta: def.meta || {},
    });
  }

  return new PulseSchema({
    fields,
    version: decoded.version || 1,
    lineage: decoded.lineage || null,
    region: decoded.region || null,
    meta: decoded.meta || {},
  });
}

// -------------------------
// PulseSchema → Binary
// -------------------------

/**
 * unifyToBinary
 *
 * Input: PulseSchema
 * Output: binary buffer (Uint8Array) encoding the schema deterministically.
 *
 * Encoding:
 *   - JSON.stringify(PulseSchema-like object)
 *   - UTF-8 encode
 */
export function unifyToBinary(pulseSchema) {
  const safe = {
    fields: {},
    version: pulseSchema.version || 1,
    lineage: pulseSchema.lineage || null,
    region: pulseSchema.region || null,
    meta: pulseSchema.meta || {},
  };

  for (const [key, field] of Object.entries(pulseSchema.fields || {})) {
    safe.fields[key] = {
      type: field.type,
      required: !!field.required,
      defaultValue: field.defaultValue,
      constraints: field.constraints || {},
      meta: field.meta || {},
    };
  }

  const jsonStr = JSON.stringify(safe);
  return new TextEncoder().encode(jsonStr);
}

// -------------------------
// Schema Merging
// -------------------------

/**
 * mergeSchemas
 *
 * Deterministically merge two PulseSchemas.
 *
 * Rules:
 *   - If a field exists in only one schema → include it.
 *   - If a field exists in both:
 *       - types must match; if not, prefer schemaB and record conflict in meta.
 *       - required = a.required || b.required
 *       - constraints are shallow-merged (b overrides a).
 *       - meta is shallow-merged (b overrides a).
 *   - version = max(a.version, b.version) + 1
 *   - lineage/region/meta can be composed as needed (here we keep from b, note a in meta).
 */
export function mergeSchemas(schemaA, schemaB) {
  const mergedFields = {};
  const allKeys = new Set([
    ...Object.keys(schemaA.fields || {}),
    ...Object.keys(schemaB.fields || {}),
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

    // Both exist
    if (fa.type !== fb.type) {
      conflicts.push({ field: key, from: fa.type, to: fb.type });
    }

    mergedFields[key] = new PulseField({
      type: fb.type || fa.type,
      required: !!(fa.required || fb.required),
      defaultValue: fb.defaultValue !== undefined ? fb.defaultValue : fa.defaultValue,
      constraints: { ...(fa.constraints || {}), ...(fb.constraints || {}) },
      meta: { ...(fa.meta || {}), ...(fb.meta || {}) },
    });
  }

  const version = Math.max(schemaA.version || 1, schemaB.version || 1) + 1;

  const meta = {
    ...(schemaA.meta || {}),
    ...(schemaB.meta || {}),
  };

  if (conflicts.length > 0) {
    meta.schemaConflicts = conflicts;
  }

  return new PulseSchema({
    fields: mergedFields,
    version,
    lineage: schemaB.lineage || schemaA.lineage || null,
    region: schemaB.region || schemaA.region || null,
    meta,
  });
}

// -------------------------
// Exported API Surface
// -------------------------

/**
 * Public API
 *
 * This is the only surface other organs should touch.
 */
const PulseSchemaAPI = {
  PulseField,
  PulseSchema,
  unifyFromFirestore,
  unifyFromSQL,
  unifyFromBinary,
  unifyToBinary,
  mergeSchemas,
};

export default PulseSchemaAPI;
