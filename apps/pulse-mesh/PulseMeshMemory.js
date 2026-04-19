// [pulse:mesh] COMMUNITY_MEMORY_LAYER  // yellow
// - long-term retention of routing patterns and impulse outcomes
// - stores metadata-only "memories" of what worked and what failed
// - used by Cortex, Tendons, Organs, and Immune for evolution
// - NEVER computes payloads, NEVER mutates data content
// - pure pattern retention for system-wide improvement

// -----------------------------------------------------------
// Memory Store (in-memory, metadata-only)
// -----------------------------------------------------------

const MemoryStore = {
  routes: new Map(),      // routeKey -> { success, fail, lastScore }
  earners: new Map(),     // earnerId -> { success, fail, avgScore }
  organs: new Map(),      // organId -> { count, anomalyCount }
  reflexes: new Map(),    // reflexName -> { triggered, drops }
};

// -----------------------------------------------------------
// Memory Helpers
// -----------------------------------------------------------

function getOrInit(map, key, init) {
  if (!map.has(key)) map.set(key, { ...init });
  return map.get(key);
}

// -----------------------------------------------------------
// Memory Pack: what we record
// -----------------------------------------------------------

export const PulseMemory = {
  // [pulse:mesh] MEMORY_ROUTE  // yellow
  // - remember how well a route performed
  recordRoute(impulse) {
    const key = `${impulse.entryNodeId}->${impulse.flags?.delivered_to ?? 'none'}`;
    const mem = getOrInit(MemoryStore.routes, key, {
      success: 0,
      fail: 0,
      lastScore: 0,
    });

    if (impulse.flags?.delivered_to) mem.success++;
    else mem.fail++;

    mem.lastScore = impulse.score || 0;
  },

  // [pulse:mesh] MEMORY_EARNER  // yellow
  // - remember how well an earner performed
  recordEarner(impulse) {
    const earnerId = impulse.flags?.delivered_to;
    if (!earnerId) return;

    const mem = getOrInit(MemoryStore.earners, earnerId, {
      success: 0,
      fail: 0,
      avgScore: 0,
    });

    mem.success++;
    mem.avgScore = (mem.avgScore + (impulse.score || 0)) / 2;
  },

  // [pulse:mesh] MEMORY_ORGAN  // yellow
  // - remember which organs were involved
  recordOrgans(impulse) {
    const organs = impulse.organs || [];
    for (const organId of organs) {
      const mem = getOrInit(MemoryStore.organs, organId, {
        count: 0,
        anomalyCount: 0,
      });

      mem.count++;
      if (impulse.flags?.cortex_anomaly) mem.anomalyCount++;
    }
  },

  // [pulse:mesh] MEMORY_REFLEX  // yellow
  // - remember reflex behavior (drops, triggers)
  recordReflexes(impulse) {
    const flags = impulse.flags || {};
    for (const key of Object.keys(flags)) {
      if (!key.startsWith('reflex_')) continue;

      const mem = getOrInit(MemoryStore.reflexes, key, {
        triggered: 0,
        drops: 0,
      });

      mem.triggered++;
      if (key.endsWith('_drop')) mem.drops++;
    }
  },
};

// -----------------------------------------------------------
// Memory Engine
// -----------------------------------------------------------

export function applyPulseMemory(impulse) {
  // [pulse:mesh] MEMORY_ENGINE  // yellow
  // - records long-term metadata about impulse behavior
  // - used by higher layers for evolutionary improvement
  // - metadata only, no compute

  PulseMemory.recordRoute(impulse);
  PulseMemory.recordEarner(impulse);
  PulseMemory.recordOrgans(impulse);
  PulseMemory.recordReflexes(impulse);

  impulse.flags = impulse.flags || {};
  impulse.flags['memory_recorded'] = true;

  return impulse;
}
