// You’re right—Tourist is the king. So he gets real caching, not just cache headers.

// Here’s a **full, drop‑in, cached + chunked `aiTourist.js`**, built around your existing `CACHE_CONTROL` + `ACCESS` maps, with:

// - in‑memory cache per collection + scope (+ user for private)
// - respect for `public / private / no-store`
// - frozen results for determinism
// - zero identity leakage

// ============================================================================
// FILE: tropic-pulse-functions/PULSE-WORLD/PULSE-AI/aiTourist.js
// LAYER: TOURIST ORGAN (Public + User‑Scoped Data Pantry, Intent‑Aware)
// ============================================================================
//
// ROLE:
//   • Provide SAFE, READ‑ONLY access to tourist + user‑scoped data.
//   • Respect owner‑only, user‑only, and tourist‑safe boundaries.
//   • Never expose UID, resendToken, or identity anchors in AI output.
//   • Act as the “data pantry” for Tour Guide AI + intent handlers.
//   • Provide cache-control metadata for each collection.
//   • Expose high‑level bundles for:
//       – area exploration
//       – events
//       – businesses
//       – environment + history
//       – power + history
//
// CONTRACT:
//   • READ‑ONLY — no writes, no deletes, no updates.
//   • NO eval(), NO Function(), NO dynamic imports.
//   • NO executing user code.
//   • Deterministic, scoped data access only.
// ============================================================================

export const TouristMeta = Object.freeze({
  type: "Cognitive",
  subsystem: "aiTourist",
  layer: "PulseAITouristFrame",
  role: "TOURIST_ORGAN",
  version: "11.2-EVO+",
  identity: "aiTourist-v11.2-EVO+",

  evo: Object.freeze({
    driftProof: true,
    deterministic: true,
    dualband: true,
    dualbandSafe: true,
    binaryAware: true,
    symbolicAware: true,
    readOnly: true,
    mutationSafe: true,
    identitySafe: true,
    scopeAware: true,
    intentAware: true,
    cacheAware: true,
    ownerAware: true,
    userAware: true,
    touristAware: true,
    multiInstanceReady: true,
    epoch: "v11.2-EVO+"
  }),

  contract: Object.freeze({
    purpose:
      "Provide SAFE, READ-ONLY access to tourist, user-scoped, and owner-scoped data with deterministic caching and identity stripping.",

    never: Object.freeze([
      "mutate data",
      "expose UID or identity anchors",
      "perform writes",
      "perform deletes",
      "perform updates",
      "execute user code",
      "use eval() or Function()",
      "bypass scope boundaries",
      "weaken cache-control guarantees"
    ]),

    always: Object.freeze([
      "strip identity fields",
      "respect tourist/user/owner scopes",
      "apply deterministic cache-control",
      "return frozen data bundles",
      "log boundary violations",
      "support Tour Guide AI intent routing",
      "remain read-only and deterministic"
    ])
  }),

  boundaryReflex() {
    return "aiTourist is read-only, scope-aware, and identity-safe — no writes, no identity leakage, no boundary bypass.";
  }
});

import { Personas } from "./persona.js";

function emitTouristChunkPacket(type, payload) {
  return Object.freeze({
    type: `tourist-${type}`,
    epoch: TouristMeta.evo.epoch,
    timestamp: Date.now(),
    ...payload
  });
}

// simple in-memory cache: key → { data, cache, expiresAt }
const _TOURIST_CACHE = new Map();

function parseMaxAge(cacheControl) {
  if (!cacheControl) return 0;
  const m = cacheControl.match(/max-age=(\d+)/);
  return m ? parseInt(m[1], 10) * 1000 : 0;
}


export function prewarmTourist() {
  return emitTouristChunkPacket("prewarm", {
    message: "Tourist organ prewarmed and chunk-ready."
  });
}


export function createTouristAPI(db) {

  // --------------------------------------------------------------------------
  // CACHE CONTROL — deterministic, per-collection caching rules
  // --------------------------------------------------------------------------
  const CACHE_CONTROL = Object.freeze({
    // PUBLIC / TOURIST-SAFE (can be cached)
    businesses:           "public,max-age=300",
    events:               "public,max-age=300",
    categoryIconCache:    "public,max-age=600",
    duplicateImages:      "public,max-age=600",
    menuSources:          "public,max-age=120",
    pendingBusinesses:    "public,max-age=60",
    pendingMenus:         "public,max-age=60",
    pulseHistory:         "public,max-age=120",

    // Environment / power (tourist-safe)
    environment:          "public,max-age=30",
    environment_history:  "public,max-age=60",
    TPEnvironment:        "public,max-age=30",
    TPEnvironmentHistory: "public,max-age=60",
    power:                "public,max-age=30",
    powerData:            "public,max-age=30",
    powerHistory:         "public,max-age=60",
    powerSettings:        "public,max-age=120",

    // USER-SCOPED (private cache)
    orders:               "private,max-age=60",
    referrals:            "private,max-age=60",
    referralClicks:       "private,max-age=60",
    vaultHistory:         "private,max-age=60",
    timerLogsUserTried:   "private,max-age=30",
    timerLogsUserSaved:   "private,max-age=30",

    // OWNER-ONLY (no caching)
    functionErrors:       "no-store",
    identityHistory:      "no-store",
    securityViolations:   "no-store",
    settings:             "no-store",
    timerLogsSystem:      "no-store",
    emailLogs:            "no-store"
  });

  // --------------------------------------------------------------------------
  // ACCESS MAP — Who can see what?
  // --------------------------------------------------------------------------
  const ACCESS = Object.freeze({
    // PUBLIC / TOURIST‑SAFE
    businesses:           { scope: "tourist" },
    events:               { scope: "tourist" },
    categoryIconCache:    { scope: "tourist" },
    duplicateImages:      { scope: "tourist" },
    menuSources:          { scope: "tourist" },
    pendingBusinesses:    { scope: "tourist" },
    pendingMenus:         { scope: "tourist" },
    pulseHistory:         { scope: "tourist" },

    environment:          { scope: "tourist" },
    environment_history:  { scope: "tourist" },
    TPEnvironment:        { scope: "tourist" },
    TPEnvironmentHistory: { scope: "tourist" },

    power:                { scope: "tourist" },
    powerData:            { scope: "tourist" },
    powerHistory:         { scope: "tourist" },
    powerSettings:        { scope: "tourist" },

    // USER‑SCOPED
    orders:               { scope: "user" },
    referrals:            { scope: "user" },
    referralClicks:       { scope: "user" },
    vaultHistory:         { scope: "user" },
    timerLogsUserTried:   { scope: "user" },
    timerLogsUserSaved:   { scope: "user" },

    // OWNER‑ONLY
    functionErrors:       { scope: "owner" },
    identityHistory:      { scope: "owner" },
    securityViolations:   { scope: "owner" },
    settings:             { scope: "owner" },
    timerLogsSystem:      { scope: "owner" },
    emailLogs:            { scope: "owner" }
  });

  // --------------------------------------------------------------------------
  // HELPERS
  // --------------------------------------------------------------------------
  function stripIdentity(record) {
    if (!record || typeof record !== "object") return record;
    const clone = { ...record };
    delete clone.uid;
    delete clone.userId;
    delete clone.resendToken;
    delete clone.identityRoot;
    delete clone.sessionRoot;
    delete clone.deviceFingerprint;
    return clone;
  }

  function makeCacheKey(key, scope, userId) {
    if (scope === "user") return `${key}:user:${userId || "anon"}`;
    if (scope === "owner") return `${key}:owner`;
    return `${key}:tourist`;
  }

  async function fetchCollection(context, key, options = {}) {
    const { userId, userIsOwner } = context;
    const access = ACCESS[key];

    if (!access) {
      context.logStep?.(`aiTourist: unknown collection "${key}".`);
      return { data: [], cache: "no-store" };
    }

    const cacheControl = CACHE_CONTROL[key] || "no-store";
    const scope = access.scope;
    const maxAgeMs = parseMaxAge(cacheControl);
    const cacheKey = makeCacheKey(key, scope, userId);

    // OWNER‑ONLY
    if (scope === "owner") {
      if (!userIsOwner) {
        context.logStep?.(`aiTourist: owner‑only "${key}" blocked for non‑owner.`);
        return emitTouristChunkPacket("bundle", {
          data: Object.freeze([]),
          cache: cacheControl,
          chunk: Object.freeze({
            size: 2,               // "[]"
            cacheControl,
            scope
          })
        });
      }

      if (cacheControl !== "no-store" && maxAgeMs > 0) {
        const cached = _TOURIST_CACHE.get(cacheKey);
        if (cached && cached.expiresAt > Date.now()) {
          context.logStep?.(`aiTourist: cache hit "${key}" [owner]`);
          return cached.packet;
        }
      }

      const rows = await db.getCollection(key, options);
      const cleaned = rows.map(stripIdentity);

      const packet = emitTouristChunkPacket("bundle", {
        data: Object.freeze(cleaned),
        cache: cacheControl,
        chunk: Object.freeze({
          size: JSON.stringify(cleaned).length,
          cacheControl,
          scope
        })
      });

      if (cacheControl !== "no-store" && maxAgeMs > 0) {
        _TOURIST_CACHE.set(cacheKey, {
          packet,
          expiresAt: Date.now() + maxAgeMs
        });
      }

      return packet;
    }


    // USER‑SCOPED
    if (scope === "user") {
      if (!userId) {
        context.logStep?.(`aiTourist: user‑scoped "${key}" requested without userId.`);
        return emitTouristChunkPacket("bundle", {
          data: Object.freeze([]),
          cache: cacheControl,
          chunk: Object.freeze({
            size: 2,               // "[]"
            cacheControl,
            scope
          })
        });
      }

      if (cacheControl !== "no-store" && maxAgeMs > 0) {
        const cached = _TOURIST_CACHE.get(cacheKey);
        if (cached && cached.expiresAt > Date.now()) {
          context.logStep?.(`aiTourist: cache hit "${key}" [user]`);
          return cached.packet;
        }
      }

      const rows = await db.getCollection(key, {
        ...options,
        where: { userId }
      });

      const cleaned = rows.map(stripIdentity);

      const packet = emitTouristChunkPacket("bundle", {
        data: Object.freeze(cleaned),
        cache: cacheControl,
        chunk: Object.freeze({
          size: JSON.stringify(cleaned).length,
          cacheControl,
          scope
        })
      });

      if (cacheControl !== "no-store" && maxAgeMs > 0) {
        _TOURIST_CACHE.set(cacheKey, {
          packet,
          expiresAt: Date.now() + maxAgeMs
        });
      }

      return packet;
    }


    // TOURIST‑SAFE
    if (cacheControl !== "no-store" && maxAgeMs > 0) {
      const cached = _TOURIST_CACHE.get(cacheKey);
      if (cached && cached.expiresAt > Date.now()) {
        context.logStep?.(`aiTourist: cache hit "${key}" [tourist]`);
        return cached.packet;
      }
    }

    const rows = await db.getCollection(key, options);
    const cleaned = rows.map(stripIdentity);

    const packet = emitTouristChunkPacket("bundle", {
      data: Object.freeze(cleaned),
      cache: cacheControl,
      chunk: Object.freeze({
        size: JSON.stringify(cleaned).length,
        cacheControl,
        scope
      })
    });

    if (cacheControl !== "no-store" && maxAgeMs > 0) {
      _TOURIST_CACHE.set(cacheKey, {
        packet,
        expiresAt: Date.now() + maxAgeMs
      });
    }

    return packet;
  }

  // --------------------------------------------------------------------------
  // BUNDLE HELPERS — for intent handlers / Tour Guide AI
  // --------------------------------------------------------------------------
  async function buildEnvironmentBundle(context) {
    const [
      environment,
      environmentHistory,
      tpEnv,
      tpEnvHistory
    ] = await Promise.all([
      fetchCollection(context, "environment"),
      fetchCollection(context, "environment_history"),
      fetchCollection(context, "TPEnvironment"),
      fetchCollection(context, "TPEnvironmentHistory")
    ]);

    const data = Object.freeze({
      environment: environment.data,
      environmentHistory: environmentHistory.data,
      TPEnvironment: tpEnv.data,
      TPEnvironmentHistory: tpEnvHistory.data
    });

    const cache = Object.freeze({
      environment: environment.cache,
      environmentHistory: environmentHistory.cache,
      TPEnvironment: tpEnv.cache,
      TPEnvironmentHistory: tpEnvHistory.cache
    });

    const scope = "tourist";
    const cacheControl = "public,max-age=30";

    return emitTouristChunkPacket("bundle", {
      data,
      cache,
      chunk: Object.freeze({
        size: JSON.stringify(data).length,
        cacheControl,
        scope
      })
    });
  }


  async function buildPowerBundle(context) {
    const [
      power,
      powerData,
      powerHistory,
      powerSettings
    ] = await Promise.all([
      fetchCollection(context, "power"),
      fetchCollection(context, "powerData"),
      fetchCollection(context, "powerHistory"),
      fetchCollection(context, "powerSettings")
    ]);

    const data = Object.freeze({
      power: power.data,
      powerData: powerData.data,
      powerHistory: powerHistory.data,
      powerSettings: powerSettings.data
    });

    const cache = Object.freeze({
      power: power.cache,
      powerData: powerData.cache,
      powerHistory: powerHistory.cache,
      powerSettings: powerSettings.cache
    });

    const scope = "tourist";
    const cacheControl = "public,max-age=30";

    return emitTouristChunkPacket("bundle", {
      data,
      cache,
      chunk: Object.freeze({
        size: JSON.stringify(data).length,
        cacheControl,
        scope
      })
    });
  }


  async function buildBusinessBundle(context, businessId) {
    const [
      businesses,
      menus,
      pendingMenus,
      duplicateImages,
      categoryIcons
    ] = await Promise.all([
      fetchCollection(context, "businesses", { where: { id: businessId } }),
      fetchCollection(context, "menuSources", { where: { businessId } }),
      fetchCollection(context, "pendingMenus", { where: { businessId } }),
      fetchCollection(context, "duplicateImages", { where: { businessId } }),
      fetchCollection(context, "categoryIconCache")
    ]);

    const data = Object.freeze({
      business: businesses.data[0] || null,
      menus: menus.data,
      pendingMenus: pendingMenus.data,
      duplicateImages: duplicateImages.data,
      categoryIcons: categoryIcons.data
    });

    const cache = Object.freeze({
      business: businesses.cache,
      menus: menus.cache,
      pendingMenus: pendingMenus.cache,
      duplicateImages: duplicateImages.cache,
      categoryIcons: categoryIcons.cache
    });

    const scope = "tourist";
    const cacheControl = "public,max-age=300";

    return emitTouristChunkPacket("bundle", {
      data,
      cache,
      chunk: Object.freeze({
        size: JSON.stringify(data).length,
        cacheControl,
        scope
      })
    });
  }


  async function buildAreaOverview(context) {
    const [
      businesses,
      events,
      environmentBundle,
      powerBundle,
      pulseHistory
    ] = await Promise.all([
      fetchCollection(context, "businesses"),
      fetchCollection(context, "events"),
      buildEnvironmentBundle(context),
      buildPowerBundle(context),
      fetchCollection(context, "pulseHistory")
    ]);

    const data = Object.freeze({
      businesses: businesses.data,
      events: events.data,
      environment: environmentBundle.data,
      power: powerBundle.data,
      pulseHistory: pulseHistory.data
    });

    const cache = Object.freeze({
      businesses: businesses.cache,
      events: events.cache,
      environment: environmentBundle.cache,
      power: powerBundle.cache,
      pulseHistory: pulseHistory.cache
    });

    const scope = "tourist";
    const cacheControl = "public,max-age=300";

    return emitTouristChunkPacket("bundle", {
      data,
      cache,
      chunk: Object.freeze({
        size: JSON.stringify(data).length,
        cacheControl,
        scope
      })
    });
  }


  // --------------------------------------------------------------------------
  // INTENT ROUTER — for Tour Guide / intent handlers
  // --------------------------------------------------------------------------
  async function resolveTouristIntent(context, intent) {
    if (!intent || !intent.type) {
      context.logStep?.("aiTourist: resolveTouristIntent called without type.");
      return { data: {}, cache: {} };
    }

    switch (intent.type) {
      case "explore-area":
        return buildAreaOverview(context);

      case "check-environment":
        return buildEnvironmentBundle(context);

      case "check-power":
        return buildPowerBundle(context);

      case "view-business":
        if (!intent.businessId) {
          context.logStep?.("aiTourist: view-business intent without businessId.");
          return { data: {}, cache: {} };
        }
        return buildBusinessBundle(context, intent.businessId);

      case "list-events": {
        const events = await fetchCollection(context, "events");
        return emitTouristChunkPacket("bundle", {
          data: Object.freeze({ events: events.data }),
          cache: Object.freeze({ events: events.cache })
        });
      }

      default:
        context.logStep?.(`aiTourist: unknown intent type "${intent.type}".`);
        return { data: {}, cache: {} };
    }
  }
  
// --------------------------------------------------------------------------
// PUBLIC API — High‑Level Helpers for Tour Guide AI
// --------------------------------------------------------------------------
return {
  async getTouristOverview(context) {
    return buildAreaOverview(context);
  },

  async getBusinessBundle(context, businessId) {
    return buildBusinessBundle(context, businessId);
  },

  async getUserReferrals(context) {
    const [referrals, referralClicks] = await Promise.all([
      fetchCollection(context, "referrals"),
      fetchCollection(context, "referralClicks")
    ]);

    const data = Object.freeze({
      referrals: referrals.data,
      referralClicks: referralClicks.data
    });

    const cache = Object.freeze({
      referrals: referrals.cache,
      referralClicks: referralClicks.cache
    });

    const scope = "user";
    const cacheControl = "private,max-age=60";

    return emitTouristChunkPacket("bundle", {
      data,
      cache,
      chunk: Object.freeze({
        size: JSON.stringify(data).length,
        cacheControl,
        scope
      })
    });
  },

  async getUserOrders(context) {
    const orders = await fetchCollection(context, "orders");

    const data = Object.freeze({ orders: orders.data });
    const cache = Object.freeze({ orders: orders.cache });

    const scope = "user";
    const cacheControl = "private,max-age=60";

    return emitTouristChunkPacket("bundle", {
      data,
      cache,
      chunk: Object.freeze({
        size: JSON.stringify(data).length,
        cacheControl,
        scope
      })
    });
  },

  async getUserVaultHistory(context) {
    const vaultHistory = await fetchCollection(context, "vaultHistory");

    const data = Object.freeze({ vaultHistory: vaultHistory.data });
    const cache = Object.freeze({ vaultHistory: vaultHistory.cache });

    const scope = "user";
    const cacheControl = "private,max-age=60";

    return emitTouristChunkPacket("bundle", {
      data,
      cache,
      chunk: Object.freeze({
        size: JSON.stringify(data).length,
        cacheControl,
        scope
      })
    });
  },

  async getUserTimerLogs(context) {
    const [tried, saved] = await Promise.all([
      fetchCollection(context, "timerLogsUserTried"),
      fetchCollection(context, "timerLogsUserSaved")
    ]);

    const data = Object.freeze({
      tried: tried.data,
      saved: saved.data
    });

    const cache = Object.freeze({
      tried: tried.cache,
      saved: saved.cache
    });

    const scope = "user";
    const cacheControl = "private,max-age=30";

    return emitTouristChunkPacket("bundle", {
      data,
      cache,
      chunk: Object.freeze({
        size: JSON.stringify(data).length,
        cacheControl,
        scope
      })
    });
  },

  async getOwnerAttentionBundle(context) {
    const [
      pendingBusinesses,
      pendingMenus,
      functionErrors,
      identityHistory,
      securityViolations,
      emailLogs
    ] = await Promise.all([
      fetchCollection(context, "pendingBusinesses"),
      fetchCollection(context, "pendingMenus"),
      fetchCollection(context, "functionErrors"),
      fetchCollection(context, "identityHistory"),
      fetchCollection(context, "securityViolations"),
      fetchCollection(context, "emailLogs")
    ]);

    const data = Object.freeze({
      pendingBusinesses: pendingBusinesses.data,
      pendingMenus: pendingMenus.data,
      functionErrors: functionErrors.data,
      identityHistory: identityHistory.data,
      securityViolations: securityViolations.data,
      emailLogs: emailLogs.data
    });

    const cache = Object.freeze({
      pendingBusinesses: pendingBusinesses.cache,
      pendingMenus: pendingMenus.cache,
      functionErrors: functionErrors.cache,
      identityHistory: identityHistory.cache,
      securityViolations: securityViolations.cache,
      emailLogs: emailLogs.cache
    });

    const scope = "owner";
    const cacheControl = "no-store";

    return emitTouristChunkPacket("bundle", {
      data,
      cache,
      chunk: Object.freeze({
        size: JSON.stringify(data).length,
        cacheControl,
        scope
      })
    });
  },

  async resolveIntent(context, intent) {
    return resolveTouristIntent(context, intent);
  },

  async chunk(context, intent) {
    const bundle = await resolveTouristIntent(context, intent);
    return emitTouristChunkPacket("chunk", bundle);
  }
};
}
