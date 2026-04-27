/**
 * PulseSchema-CoreMemoryIntegration-v1.js
 * PULSE-WORLD / PULSE-FINALITY / PULSE-SCHEMA + CORE MEMORY
 *
 * ROLE:
 *   Wraps PulseSchema physics with PulseCoreMemory hot caching.
 *   - Caches last unified schemas (Firestore, SQL, Binary)
 *   - Caches last merged schema + conflicts
 *   - Caches last binary encoding/decoding
 *   - Tracks hot fields / types (loop-theory friendly)
 *
 *   ZERO mutation of physics.
 *   ZERO randomness.
 *   PURE symbolic caching.
 */

import PulseSchemaAPI from "./PulseSchema-v11-Evo.js";
import { createPulseCoreMemory } from "../../PULSECORE/PulseCoreMemory.js";

const {
  PulseField,
  PulseSchema,
  unifyFromFirestore,
  unifyFromSQL,
  unifyFromBinary,
  unifyToBinary,
  mergeSchemas
} = PulseSchemaAPI;

// -------------------------
// Core Memory Setup
// -------------------------

const CoreMemory = createPulseCoreMemory();

const ROUTE = "schema-global";

const KEY_LAST_FIRESTORE = "last-unified-firestore-schema";
const KEY_LAST_SQL = "last-unified-sql-schema";
const KEY_LAST_BINARY = "last-unified-binary-schema";
const KEY_LAST_BINARY_BUFFER = "last-binary-buffer";

const KEY_LAST_MERGED = "last-merged-schema";
const KEY_LAST_CONFLICTS = "last-merge-conflicts";

const KEY_HOT_FIELDS = "hot-fields";
const KEY_HOT_TYPES = "hot-types";

// -------------------------
// Internal helpers
// -------------------------

function trackSchemaUsage(schema) {
  if (!schema || !schema.fields) return;

  const hotFields = CoreMemory.get(ROUTE, KEY_HOT_FIELDS) || {};
  const hotTypes = CoreMemory.get(ROUTE, KEY_HOT_TYPES) || {};

  for (const [name, field] of Object.entries(schema.fields)) {
    hotFields[name] = (hotFields[name] || 0) + 1;
    const t = field.type || "unknown";
    hotTypes[t] = (hotTypes[t] || 0) + 1;
  }

  CoreMemory.set(ROUTE, KEY_HOT_FIELDS, hotFields);
  CoreMemory.set(ROUTE, KEY_HOT_TYPES, hotTypes);
}

// -------------------------
// Wrapped API
// -------------------------

export function unifyFromFirestoreWithMemory(firestoreSchema) {
  CoreMemory.prewarm();

  const schema = unifyFromFirestore(firestoreSchema);

  CoreMemory.set(ROUTE, KEY_LAST_FIRESTORE, schema);
  trackSchemaUsage(schema);

  return schema;
}

export function unifyFromSQLWithMemory(sqlSchema) {
  CoreMemory.prewarm();

  const schema = unifyFromSQL(sqlSchema);

  CoreMemory.set(ROUTE, KEY_LAST_SQL, schema);
  trackSchemaUsage(schema);

  return schema;
}

export function unifyFromBinaryWithMemory(binaryBuffer) {
  CoreMemory.prewarm();

  const schema = unifyFromBinary(binaryBuffer);

  CoreMemory.set(ROUTE, KEY_LAST_BINARY, schema);
  CoreMemory.set(ROUTE, KEY_LAST_BINARY_BUFFER, binaryBuffer);
  trackSchemaUsage(schema);

  return schema;
}

export function unifyToBinaryWithMemory(pulseSchema) {
  CoreMemory.prewarm();

  const buffer = unifyToBinary(pulseSchema);

  CoreMemory.set(ROUTE, KEY_LAST_BINARY_BUFFER, buffer);
  CoreMemory.set(ROUTE, KEY_LAST_BINARY, pulseSchema);
  trackSchemaUsage(pulseSchema);

  return buffer;
}

export function mergeSchemasWithMemory(schemaA, schemaB) {
  CoreMemory.prewarm();

  const merged = mergeSchemas(schemaA, schemaB);

  CoreMemory.set(ROUTE, KEY_LAST_MERGED, merged);

  const conflicts =
    (merged.meta && merged.meta.schemaConflicts) || [];
  CoreMemory.set(ROUTE, KEY_LAST_CONFLICTS, conflicts);

  trackSchemaUsage(merged);

  return merged;
}

// -------------------------
// Hot Memory Accessors
// -------------------------

export function getLastSchemaState() {
  CoreMemory.prewarm();

  return {
    lastFirestoreSchema: CoreMemory.get(ROUTE, KEY_LAST_FIRESTORE),
    lastSQLSchema: CoreMemory.get(ROUTE, KEY_LAST_SQL),
    lastBinarySchema: CoreMemory.get(ROUTE, KEY_LAST_BINARY),
    lastBinaryBuffer: CoreMemory.get(ROUTE, KEY_LAST_BINARY_BUFFER),
    lastMergedSchema: CoreMemory.get(ROUTE, KEY_LAST_MERGED),
    lastMergeConflicts: CoreMemory.get(ROUTE, KEY_LAST_CONFLICTS),
    hotFields: CoreMemory.get(ROUTE, KEY_HOT_FIELDS),
    hotTypes: CoreMemory.get(ROUTE, KEY_HOT_TYPES)
  };
}

// -------------------------
// Exported Integration API
// -------------------------

const PulseSchemaCoreMemory = {
  PulseField,
  PulseSchema,

  unifyFromFirestoreWithMemory,
  unifyFromSQLWithMemory,
  unifyFromBinaryWithMemory,
  unifyToBinaryWithMemory,
  mergeSchemasWithMemory,

  getLastSchemaState,
  CoreMemory
};

export default PulseSchemaCoreMemory;
