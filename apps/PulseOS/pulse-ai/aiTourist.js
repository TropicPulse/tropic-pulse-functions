// ============================================================================
// FILE: tropic-pulse-functions/apps/PULSE-AI/aiTourist.js
// LAYER: TOURIST ORGAN (Public + User‑Scoped Data Pantry)
// ============================================================================
//
// ROLE:
//   • Provide SAFE, READ‑ONLY access to tourist + user‑scoped data.
//   • Respect owner‑only, user‑only, and tourist‑safe boundaries.
//   • Never expose UID, resendToken, or identity anchors in AI output.
//   • Act as the “data pantry” for Tour Guide AI.
//   • Provide cache-control metadata for each collection.
//
// CONTRACT:
//   • READ‑ONLY — no writes, no deletes, no updates.
//   • NO eval(), NO Function(), NO dynamic imports.
//   • NO executing user code.
//   • Deterministic, scoped data access only.
// ============================================================================

import { Personas } from "./persona.js";

export function createTouristAPI(db) {

  // --------------------------------------------------------------------------
  // CACHE CONTROL — deterministic, per-collection caching rules
  // --------------------------------------------------------------------------
  const CACHE_CONTROL = Object.freeze({
    // PUBLIC / TOURIST-SAFE (can be cached)
    businesses:        "public,max-age=300",
    events:            "public,max-age=300",
    categoryIconCache: "public,max-age=600",
    duplicateImages:   "public,max-age=600",
    menuSources:       "public,max-age=120",
    pendingBusinesses: "public,max-age=60",
    pendingMenus:      "public,max-age=60",
    pulseHistory:      "public,max-age=120",
    environment:       "public,max-age=30",
    power:             "public,max-age=30",
    powerData:         "public,max-age=30",
    powerHistory:      "public,max-age=60",
    powerSettings:     "public,max-age=120",

    // USER-SCOPED (private cache)
    orders:            "private,max-age=60",
    referrals:         "private,max-age=60",
    referralClicks:    "private,max-age=60",
    vaultHistory:      "private,max-age=60",
    timerLogsUserTried:"private,max-age=30",
    timerLogsUserSaved:"private,max-age=30",

    // OWNER-ONLY (no caching)
    functionErrors:    "no-store",
    identityHistory:   "no-store",
    securityViolations:"no-store",
    settings:          "no-store",
    timerLogsSystem:   "no-store",
    emailLogs:         "no-store"
  });

  // --------------------------------------------------------------------------
  // ACCESS MAP — Who can see what?
  // --------------------------------------------------------------------------
  const ACCESS = Object.freeze({
    // PUBLIC / TOURIST‑SAFE
    businesses:        { scope: "tourist" },
    events:            { scope: "tourist" },
    categoryIconCache: { scope: "tourist" },
    duplicateImages:   { scope: "tourist" },
    menuSources:       { scope: "tourist" },
    pendingBusinesses: { scope: "tourist" },
    pendingMenus:      { scope: "tourist" },
    pulseHistory:      { scope: "tourist" },
    environment:       { scope: "tourist" },
    power:             { scope: "tourist" },
    powerData:         { scope: "tourist" },
    powerHistory:      { scope: "tourist" },
    powerSettings:     { scope: "tourist" },

    // USER‑SCOPED
    orders:            { scope: "user" },
    referrals:         { scope: "user" },
    referralClicks:    { scope: "user" },
    vaultHistory:      { scope: "user" },
    timerLogsUserTried:{ scope: "user" },
    timerLogsUserSaved:{ scope: "user" },

    // OWNER‑ONLY
    functionErrors:    { scope: "owner" },
    identityHistory:   { scope: "owner" },
    securityViolations:{ scope: "owner" },
    settings:          { scope: "owner" },
    timerLogsSystem:   { scope: "owner" },
    emailLogs:         { scope: "owner" }
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

  async function fetchCollection(context, key, options = {}) {
    const { userId, userIsOwner } = context;
    const access = ACCESS[key];

    if (!access) {
      context.logStep?.(`aiTourist: unknown collection "${key}".`);
      return { data: [], cache: "no-store" };
    }

    const cache = CACHE_CONTROL[key] || "no-store";

    // OWNER‑ONLY
    if (access.scope === "owner") {
      if (!userIsOwner) {
        context.logStep?.(`aiTourist: owner‑only "${key}" blocked for non‑owner.`);
        return { data: [], cache };
      }
      const rows = await db.getCollection(key, options);
      return { data: rows.map(stripIdentity), cache };
    }

    // USER‑SCOPED
    if (access.scope === "user") {
      if (!userId) {
        context.logStep?.(`aiTourist: user‑scoped "${key}" requested without userId.`);
        return { data: [], cache };
      }
      const rows = await db.getCollection(key, {
        ...options,
        where: { userId }
      });
      return { data: rows.map(stripIdentity), cache };
    }

    // TOURIST‑SAFE
    const rows = await db.getCollection(key, options);
    return { data: rows.map(stripIdentity), cache };
  }

  // --------------------------------------------------------------------------
  // PUBLIC API — High‑Level Helpers for Tour Guide AI
  // --------------------------------------------------------------------------
  return {
    // Tourist‑facing overview
    async getTouristOverview(context) {
      const [
        businesses,
        events,
        environment,
        power,
        pulseHistory
      ] = await Promise.all([
        fetchCollection(context, "businesses"),
        fetchCollection(context, "events"),
        fetchCollection(context, "environment"),
        fetchCollection(context, "power"),
        fetchCollection(context, "pulseHistory")
      ]);

      return {
        data: {
          businesses: businesses.data,
          events: events.data,
          environment: environment.data,
          power: power.data,
          pulseHistory: pulseHistory.data
        },
        cache: {
          businesses: businesses.cache,
          events: events.cache,
          environment: environment.cache,
          power: power.cache,
          pulseHistory: pulseHistory.cache
        }
      };
    },

    // Business bundle
    async getBusinessBundle(context, businessId) {
      const [
        businesses,
        menus,
        pendingMenus,
        duplicateImages
      ] = await Promise.all([
        fetchCollection(context, "businesses", { where: { id: businessId } }),
        fetchCollection(context, "menuSources", { where: { businessId } }),
        fetchCollection(context, "pendingMenus", { where: { businessId } }),
        fetchCollection(context, "duplicateImages", { where: { businessId } })
      ]);

      return {
        data: {
          business: businesses.data[0] || null,
          menus: menus.data,
          pendingMenus: pendingMenus.data,
          duplicateImages: duplicateImages.data
        },
        cache: {
          business: businesses.cache,
          menus: menus.cache,
          pendingMenus: pendingMenus.cache,
          duplicateImages: duplicateImages.cache
        }
      };
    },

    // User referrals
    async getUserReferrals(context) {
      const [referrals, referralClicks] = await Promise.all([
        fetchCollection(context, "referrals"),
        fetchCollection(context, "referralClicks")
      ]);

      return {
        data: {
          referrals: referrals.data,
          referralClicks: referralClicks.data
        },
        cache: {
          referrals: referrals.cache,
          referralClicks: referralClicks.cache
        }
      };
    },

    // User orders
    async getUserOrders(context) {
      const orders = await fetchCollection(context, "orders");
      return {
        data: { orders: orders.data },
        cache: { orders: orders.cache }
      };
    },

    // User vault history
    async getUserVaultHistory(context) {
      const vaultHistory = await fetchCollection(context, "vaultHistory");
      return {
        data: { vaultHistory: vaultHistory.data },
        cache: { vaultHistory: vaultHistory.cache }
      };
    },

    // User timer logs
    async getUserTimerLogs(context) {
      const [tried, saved] = await Promise.all([
        fetchCollection(context, "timerLogsUserTried"),
        fetchCollection(context, "timerLogsUserSaved")
      ]);

      return {
        data: {
          tried: tried.data,
          saved: saved.data
        },
        cache: {
          tried: tried.cache,
          saved: saved.cache
        }
      };
    },

    // Owner‑only bundle
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

      return {
        data: {
          pendingBusinesses: pendingBusinesses.data,
          pendingMenus: pendingMenus.data,
          functionErrors: functionErrors.data,
          identityHistory: identityHistory.data,
          securityViolations: securityViolations.data,
          emailLogs: emailLogs.data
        },
        cache: {
          pendingBusinesses: pendingBusinesses.cache,
          pendingMenus: pendingMenus.cache,
          functionErrors: functionErrors.cache,
          identityHistory: identityHistory.cache,
          securityViolations: securityViolations.cache,
          emailLogs: emailLogs.cache
        }
      };
    }
  };
}
