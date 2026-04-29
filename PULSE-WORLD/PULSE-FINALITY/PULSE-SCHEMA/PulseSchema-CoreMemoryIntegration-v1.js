/**
 * PulseSchema-CoreMemoryIntegration-v12.3-PRESENCE-EVO+.js
 * PULSE-WORLD / PULSE-FINALITY / PULSE-SCHEMA + CORE MEMORY
 *
 * ROLE:
 *   Wraps PulseSchema physics with PulseCoreMemory hot caching.
 *   - Caches last unified schemas (Firestore, SQL, Binary)
 *   - Caches last merged schema + conflicts
 *   - Caches last binary encoding/decoding
 *   - Tracks hot fields / types (loop-theory friendly)
 *
 *   12.3+:
 *     - presenceAware
 *     - advantageAware
 *     - fallbackBandAware
 *     - chunk/cache/prewarm hints
 *     - coldStartAware
 *     - dualband-safe symbolic overlays
 *
 *   ZERO mutation of physics.
 *   ZERO randomness.
 *   PURE symbolic caching.
 */

import PulseSchemaAPI from "./PulseSchema-v11-Evo.js";
import { createPulseCoreMemory } from "../../PULSE-CORE/PulseCoreMemory.js";

const {
  PulseField,
  PulseSchema,
  unifyFromFirestore,
  unifyFromSQL,
  unifyFromBinary,
  unifyToBinary,
  mergeSchemas
} = PulseSchemaAPI;

// ============================================================================
// META — v12.3-PRESENCE-EVO+
// ============================================================================

export const PulseSchemaCoreMemoryMeta = Object.freeze({
  layer: "PulseSchemaCoreMemory",
  role: "SCHEMA_MEMORY_ORGAN",
  version: "12.3-PRESENCE-EVO+",
  identity: "PulseSchema-CoreMemory-v12.3-PRESENCE-EVO+",

  evo: Object.freeze({
    deterministic: true,
    driftProof: true,
    schemaAware: true,
    binaryAware: true,
    firestoreAware: true,
    sqlAware: true,
    mergeAware: true,
    conflictAware: true,
    readOnly: true,

    // 12.3+ presence surfaces
    presenceAware: true,
    bandPresenceAware: true,
    routerPresenceAware: true,
    advantageAware: true,
    fallbackBandAware: true,
    chunkAware: true,
    cacheAware: true,
    prewarmAware: true,
    coldStartAware: true,

    hotMemoryOrgan: true,
    symbolicMemory: true,
    zeroMutationOfPhysics: true,
    zeroRandomness: true,
    epoch: "12.3-PRESENCE-EVO+"
  })
});

// ============================================================================
// CORE MEMORY SETUP
// ============================================================================

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

// 12.3+ presence / advantage / fallback / hints
const KEY_LAST_PRESENCE = "last-presence-field";
const KEY_LAST_ADVANTAGE = "last-advantage-field";
const KEY_LAST_FALLBACK = "last-fallback-band-level";
const KEY_LAST_CHUNK_HINTS = "last-chunk-hints";
const KEY_LAST_CACHE_HINTS = "last-cache-hints";
const KEY_LAST_PREWARM_HINTS = "last-prewarm-hints";

// ============================================================================
// INTERNAL HELPERS
// ============================================================================

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

function stampPresenceHints({
  presenceContext = {},
  advantageContext = {},
  fallbackBandLevel = 0,
  chunkHints = {},
  cacheHints = {},
  prewarmHints = {}
} = {}) {
  CoreMemory.set(ROUTE, KEY_LAST_PRESENCE, presenceContext);
  CoreMemory.set(ROUTE, KEY_LAST_ADVANTAGE, advantageContext);
  CoreMemory.set(ROUTE, KEY_LAST_FALLBACK, fallbackBandLevel);
  CoreMemory.set(ROUTE, KEY_LAST_CHUNK_HINTS, chunkHints);
  CoreMemory.set(ROUTE, KEY_LAST_CACHE_HINTS, cacheHints);
  CoreMemory.set(ROUTE, KEY_LAST_PREWARM_HINTS, prewarmHints);
}

// ============================================================================
// WRAPPED API — v12.3-PRESENCE-EVO+
// ============================================================================

export function unifyFromFirestoreWithMemory(firestoreSchema, hints = {}) {
  CoreMemory.prewarm();

  const schema = unifyFromFirestore(firestoreSchema);

  CoreMemory.set(ROUTE, KEY_LAST_FIRESTORE, schema);
  trackSchemaUsage(schema);
  stampPresenceHints(hints);

  return schema;
}

export function unifyFromSQLWithMemory(sqlSchema, hints = {}) {
  CoreMemory.prewarm();

  const schema = unifyFromSQL(sqlSchema);

  CoreMemory.set(ROUTE, KEY_LAST_SQL, schema);
  trackSchemaUsage(schema);
  stampPresenceHints(hints);

  return schema;
}

export function unifyFromBinaryWithMemory(binaryBuffer, hints = {}) {
  CoreMemory.prewarm();

  const schema = unifyFromBinary(binaryBuffer);

  CoreMemory.set(ROUTE, KEY_LAST_BINARY, schema);
  CoreMemory.set(ROUTE, KEY_LAST_BINARY_BUFFER, binaryBuffer);
  trackSchemaUsage(schema);
  stampPresenceHints(hints);

  return schema;
}

export function unifyToBinaryWithMemory(pulseSchema, hints = {}) {
  CoreMemory.prewarm();

  const buffer = unifyToBinary(pulseSchema);

  CoreMemory.set(ROUTE, KEY_LAST_BINARY_BUFFER, buffer);
  CoreMemory.set(ROUTE, KEY_LAST_BINARY, pulseSchema);
  trackSchemaUsage(pulseSchema);
  stampPresenceHints(hints);

  return buffer;
}

export function mergeSchemasWithMemory(schemaA, schemaB, hints = {}) {
  CoreMemory.prewarm();

  const merged = mergeSchemas(schemaA, schemaB);

  CoreMemory.set(ROUTE, KEY_LAST_MERGED, merged);

  const conflicts =
    (merged.meta && merged.meta.schemaConflicts) || [];
  CoreMemory.set(ROUTE, KEY_LAST_CONFLICTS, conflicts);

  trackSchemaUsage(merged);
  stampPresenceHints(hints);

  return merged;
}

// ============================================================================
// HOT MEMORY ACCESSORS
// ============================================================================

export function getLastSchemaState() {
  CoreMemory.prewarm();

  return {
    meta: PulseSchemaCoreMemoryMeta,

    lastFirestoreSchema: CoreMemory.get(ROUTE, KEY_LAST_FIRESTORE),
    lastSQLSchema: CoreMemory.get(ROUTE, KEY_LAST_SQL),
    lastBinarySchema: CoreMemory.get(ROUTE, KEY_LAST_BINARY),
    lastBinaryBuffer: CoreMemory.get(ROUTE, KEY_LAST_BINARY_BUFFER),
    lastMergedSchema: CoreMemory.get(ROUTE, KEY_LAST_MERGED),
    lastMergeConflicts: CoreMemory.get(ROUTE, KEY_LAST_CONFLICTS),

    hotFields: CoreMemory.get(ROUTE, KEY_HOT_FIELDS),
    hotTypes: CoreMemory.get(ROUTE, KEY_HOT_TYPES),

    presenceField: CoreMemory.get(ROUTE, KEY_LAST_PRESENCE),
    advantageField: CoreMemory.get(ROUTE, KEY_LAST_ADVANTAGE),
    fallbackBandLevel: CoreMemory.get(ROUTE, KEY_LAST_FALLBACK),

    chunkHints: CoreMemory.get(ROUTE, KEY_LAST_CHUNK_HINTS),
    cacheHints: CoreMemory.get(ROUTE, KEY_LAST_CACHE_HINTS),
    prewarmHints: CoreMemory.get(ROUTE, KEY_LAST_PREWARM_HINTS)
  };
}

// ============================================================================
// EXPORT
// ============================================================================

const PulseSchemaCoreMemory = {
  PulseField,
  PulseSchema,

  unifyFromFirestoreWithMemory,
  unifyFromSQLWithMemory,
  unifyFromBinaryWithMemory,
  unifyToBinaryWithMemory,
  mergeSchemasWithMemory,

  getLastSchemaState,
  CoreMemory,
  meta: PulseSchemaCoreMemoryMeta
};

export default PulseSchemaCoreMemory;
