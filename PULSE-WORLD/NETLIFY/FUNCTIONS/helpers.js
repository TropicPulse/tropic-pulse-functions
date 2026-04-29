/* global log,warn,error */
// FILE: tropic-pulse-functions/netlify/functions/helpers.js
//
// INTENT-CHECK: If you paste this while confused or frustrated, gently re-read your INTENT; if I am unsure of intent, I will ask you for the full INTENT paragraph.
// 📘 PAGE INDEX — Source of Truth for This File
//
// This PAGE INDEX defines the identity, purpose, boundaries, and allowed
// behavior of this file. It is the compressed representation of the entire
// page. Keep this updated as functions, responsibilities, and logic evolve.
//
// If AI becomes uncertain or drifts, request: "Rules Design (Trust/Data)"
//
// CONTENTS TO MAINTAIN:
//   • What this file IS
//   • What this file IS NOT
//   • Its responsibilities
//   • Its exported functions
//   • Its internal logic summary
//   • Allowed imports
//   • Forbidden imports
//   • Deployment rules
//   • Safety constraints
//
// The PAGE INDEX + SUB‑COMMENTS allow full reconstruction of the file
// without needing to paste the entire codebase. Keep summaries accurate.
// The comments are the source of truth — if code and comments disagree,
// the comments win.
//
// ROLE:
//   Master utility module for Tropic Pulse containing all shared helper logic,
//   including (but not limited to):
//     • safeFetchJson (timeout‑protected fetch wrapper)
//     • Google Places + Geocoding helpers
//     • fuzzy logic parsers (receiveSMS, receiveCommunication, parseSMSBoolean)
//     • safeDate utilities
//     • request sanitizers + input cleaners
//     • country normalization + geocode normalization
//     • sargassum, waves, wildlife, and environment helper functions
//     • any small deterministic helper used across the entire backend
//
//   This file is LOGIC‑ONLY — it must NOT contain Netlify handlers.
//   Safe to import from ANY Netlify function or logic module.
//
// DEPLOYMENT:
//   PRIMARY HOST: Netlify (all backend execution runs here)
//   BACKUP HOSTS: Cloudflare + Firebase Hosting (static/CDN only)
//   Firebase Functions = deprecated — do NOT add new Firebase Functions code
//
// EXTERNAL API RULES:
//   • All Google API calls must use server‑side keys only
//   • Must include required headers (X-Goog-Api-Key, Content-Type)
//   • Must NOT expose API keys in logs or responses
//   • Must follow 2025+ Places API schema (searchText endpoint)
//
// SYNTAX RULES:
//   ESM JavaScript ONLY — no TypeScript, no CommonJS, no require()
//   ALWAYS use named exports (`export function ...`)
//   NEVER use default exports
//
// IMPORT RULES:
//   Only import modules that ALREADY exist in the repo
//   This module should remain dependency‑light (built‑ins only)
//   Do NOT assume new files or dependencies unless Aldwyn explicitly approves
//
// STRUCTURE:
//   Lives in /netlify/functions (flat) unless Aldwyn creates subfolders
//   This file is a pure logic module — no initialization, no handlers
//
// DEPENDENCY RULES:
//   Must remain deterministic and side‑effect‑free
//   Must NOT store global state
//   Must NOT mutate external modules
//
// SAFETY NOTES:
//   • safeFetchJson MUST enforce timeout + UA header
//   • Fuzzy logic MUST remain stable and backward‑compatible
//   • All input sanitizers MUST be defensive and non‑destructive
//   • This module is foundational — changes ripple across the entire system
/* ----------------------------------------------------
   SAFE FETCH JSON (with timeout + UA header)
---------------------------------------------------- */

import { db, admin } from "./firebase.js";

export async function safeFetchJson(url, options = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        "User-Agent": "TropicPulse/1.0",
        "Accept": "application/json,text/plain,*/*",
        ...(options.headers || {})
      }
    });

    clearTimeout(timeout);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    clearTimeout(timeout);
    throw err;
  }
}

/* ----------------------------------------------------
   GOOGLE PLACES TEXT SEARCH
---------------------------------------------------- */
export async function searchPlacesText(query, apiKey) {
  const url = `https://places.googleapis.com/v1/places:searchText`;

  const body = {
    textQuery: query,
    languageCode: "en"
  };

  const res = await safeFetchJson(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey
    },
    body: JSON.stringify(body)
  });

  return res.places || [];
}

/* ----------------------------------------------------
   GOOGLE GEOCODING API
---------------------------------------------------- */
export async function geocodeAddress(address, apiKey) {
  const url =
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${apiKey}`;

  const data = await safeFetchJson(url);

  if (!data.results || data.results.length === 0) return null;

  return data.results[0];
}

/* ----------------------------------------------------
   FUZZY GEOCODER (Belize‑biased)
---------------------------------------------------- */
export async function fuzzyGeocode(venue, apiKey, knownLat = null, knownLng = null) {
  const cleaned = venue.trim();

  const attempts = [
    `${cleaned} San Pedro Belize`,
    `${cleaned} Ambergris Caye`,
    `${cleaned} Belize`,
    cleaned
  ];

  const haversine = (lat1, lng1, lat2, lng2) => {
    const R = 6371000;
    const toRad = x => x * Math.PI / 180;

    const dLat = toRad(lat2 - lat1);
    const dLng = toRad(lng2 - lng1);

    const a =
      Math.sin(dLat / 2) ** 2 +
      Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) ** 2;

    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  for (const query of attempts) {
    const results = await searchPlacesText(query, apiKey);
    if (!results || results.length === 0) continue;

    const candidates = results.filter(r => {
      if (!r.types) return false;

      if (
        r.types.includes("locality") ||
        r.types.includes("political") ||
        r.types.includes("sublocality") ||
        r.types.includes("neighborhood") ||
        r.types.includes("administrative_area_level_1") ||
        r.types.includes("administrative_area_level_2")
      ) {
        return false;
      }

      return r.types.some(t =>
        t === "bar" ||
        t === "restaurant" ||
        t === "night_club" ||
        t === "cafe" ||
        t === "point_of_interest" ||
        t === "establishment"
      );
    });

    if (candidates.length === 0) continue;

    let business = null;

    if (knownLat && knownLng) {
      let closest = null;
      let closestDist = Infinity;

      for (const r of candidates) {
        const lat = r.location.latitude;
        const lng = r.location.longitude;
        const dist = haversine(knownLat, knownLng, lat, lng);

        if (dist < closestDist) {
          closestDist = dist;
          closest = r;
        }
      }

      if (closest && closestDist <= 2000) {
        business = closest;
      } else if (closest && closestDist <= 3000) {
        business = closest;
      } else {
        continue;
      }
    } else {
      business = candidates[0];
    }

    let finalPlaceId = business.id;
    let lat = business.location.latitude;
    let lng = business.location.longitude;

    try {
      const canonical = await fetch(
        `https://places.googleapis.com/v1/places/${finalPlaceId}?fields=*`,
        { headers: { "X-Goog-Api-Key": apiKey } }
      ).then(r => r.json());

      if (canonical?.id) {
        finalPlaceId = canonical.id;
      }
    } catch {}

    return {
      formatted_address: business.formattedAddress,
      geometry: { location: { lat, lng } },
      place_id: finalPlaceId
    };
  }

  for (const query of attempts) {
    const geo = await geocodeAddress(query, apiKey);
    if (!geo) continue;

    if (knownLat && knownLng) {
      const lat = geo.geometry.location.lat;
      const lng = geo.geometry.location.lng;

      const dist = haversine(knownLat, knownLng, lat, lng);

      if (dist > 150) {
        return {
          formatted_address: geo.formatted_address,
          geometry: { location: { lat: knownLat, lng: knownLng } },
          place_id: null
        };
      }
    }

    return geo;
  }

  if (knownLat && knownLng) {
    return {
      formatted_address: venue,
      geometry: { location: { lat: knownLat, lng: knownLng } },
      place_id: null
    };
  }

  return null;
}

/* ----------------------------------------------------
   STATIC MAP URL BUILDER
---------------------------------------------------- */
export function buildStaticMapUrl(lat, lng, placeId, key, label = "") {
  const base =
    `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}` +
    `&zoom=17&size=600x400&scale=2&maptype=roadmap`;

  if (placeId) {
    return `${base}&markers=color:red|place_id:${placeId}&key=${key}`;
  }

  const labelPart = label
    ? `&markers=color:red|label:${encodeURIComponent(label)}|${lat},${lng}`
    : `&markers=color:red|${lat},${lng}`;

  return `${base}${labelPart}&key=${key}`;
}

/* ----------------------------------------------------
   COUNTRY NORMALIZER
---------------------------------------------------- */
export function normalizeCountry(input) {
  if (!input) return "BZ";

  const value = String(input).trim().toLowerCase();
  const cleaned = value.replace(/[\u{1F1E6}-\u{1F1FF}]/gu, "").trim();

  if (/^[a-z]{2}$/i.test(cleaned)) return cleaned.toUpperCase();

  const alpha3 = {
    usa: "US", can: "CA", mex: "MX", blz: "BZ", gbr: "GB",
    jam: "JM", tto: "TT", hnd: "HN", gtm: "GT", slv: "SV",
    nic: "NI", cri: "CR", pan: "PA", dom: "DO", prt: "PR",
    brb: "BB", lca: "LC", kna: "KN"
  };
  if (alpha3[cleaned]) return alpha3[cleaned];

  const map = {
    "belize": "BZ",
    "united states": "US",
    "united states of america": "US",
    "usa": "US",
    "us": "US",
    "mexico": "MX",
    "canada": "CA",
    "united kingdom": "GB",
    "great britain": "GB",
    "uk": "GB",
    "jamaica": "JM",
    "bahamas": "BS",
    "trinidad and tobago": "TT",
    "guatemala": "GT",
    "honduras": "HN",
    "el salvador": "SV",
    "nicaragua": "NI",
    "costa rica": "CR",
    "panama": "PA",
    "dominican republic": "DO",
    "puerto rico": "PR",
    "barbados": "BB",
    "saint lucia": "LC",
    "saint kitts and nevis": "KN",
    "germany": "DE",
    "france": "FR",
    "spain": "ES",
    "italy": "IT",
    "australia": "AU",
    "new zealand": "NZ",
    "india": "IN",
    "china": "CN",
    "japan": "JP",
    "south korea": "KR",
    "brazil": "BR",
    "argentina": "AR",
    "colombia": "CO",
    "chile": "CL"
  };

  return map[cleaned] || "BZ";
}

/* ----------------------------------------------------
   PARSE SMS BOOLEAN
---------------------------------------------------- */
export function parseSMSBoolean(value) {
  if (!value) return false;
  const v = String(value).toLowerCase().trim();
  return v === "i agree to receive sms!" || v === "true" || v === "1";
}

/* ----------------------------------------------------
   PARSE COMMUNICATION PREFERENCES
---------------------------------------------------- */
export function receiveCommunication(raw) {
  if (!raw || typeof raw !== "string") {
    return { receiveSMS: false, receiveMassEmails: false };
  }

  const cleaned = raw
    .split(",")
    .map(x => x.trim().toLowerCase())
    .filter(Boolean);

  const receiveSMS = cleaned.some(x => x.includes("sms"));
  const receiveMassEmails = cleaned.some(x =>
    x.includes("mass email") ||
    x.includes("mass-email") ||
    x.includes("mass_emails") ||
    x.includes("massemails")
  );

  return { receiveSMS, receiveMassEmails };
}

/* ----------------------------------------------------
   NEW: safeDate
---------------------------------------------------- */
export function safeDate(value) {
  if (!value) return null;

  if (typeof value.toDate === "function") {
    try {
      return value.toDate().toISOString();
    } catch {
      return null;
    }
  }

  if (typeof value === "object") {
    const sec = value.seconds ?? value._seconds;
    if (typeof sec === "number") {
      try {
        return new Date(sec * 1000).toISOString();
      } catch {
        return null;
      }
    }
  }

  try {
    const d = new Date(value);
    return isNaN(d.getTime()) ? null : d.toISOString();
  } catch {
    return null;
  }
}

/* ----------------------------------------------------
   NEW: calculateReleaseDate
---------------------------------------------------- */
export function calculateReleaseDate(deliveredAt, delayDays = 3) {
  try {
    if (!deliveredAt) return null;

    let date;

    if (typeof deliveredAt.toDate === "function") {
      date = deliveredAt.toDate();
    } else {
      date = new Date(deliveredAt);
    }

    if (isNaN(date.getTime())) return null;

    date.setDate(date.getDate() + delayDays);

    return admin.firestore.Timestamp.fromDate(date);
  } catch {
    return null;
  }
}

/* ----------------------------------------------------
   NEW: parseIncomingRequest
---------------------------------------------------- */
export async function parseIncomingRequest(req, db) {
  log("🔵 [parseIncomingRequest] START");

  let payload = {};
  let email = null;
  let emailType = null;
  let logId = null;

  const isGarbage = (v) => {
    if (!v) return true;
    const s = String(v);
    return (
      s.trim() === "" ||
      s.includes("{{") ||
      s.includes("add_more_field") ||
      s.includes("fieldLebal") ||
      s.includes("fieldValue") ||
      s.includes("*")
    );
  };

  const clean = (v) => (isGarbage(v) ? null : String(v).trim());
  const soft = (v, fb = null) => (v == null ? fb : String(v).trim() || fb);
  const temp = (v, fb = null) => (v == null ? fb : String(v).trim());

  // BODY JSON
  if (req.method === "POST" && req.body && typeof req.body === "object") {
    payload = req.body;
    email = payload.email || null;
    emailType = payload.emailType || payload.type || null;
    logId = payload.logId || null;
  }

  // MERGE QUERY PARAMS
  const merged = { ...payload, ...req.query };

  // CLEAN CORE FIELDS
  email = temp(merged.email || email, null);
  emailType = temp(merged.emailType || merged.type || emailType, "newUser");
  logId = temp(merged.logId || logId, null);

  if (!logId) {
    logId = db.collection("EmailLogs").doc().id;
  }

  const rawType = (merged.type || "").toLowerCase();
  const rawFunction = (merged.function || "").toLowerCase();
  const rawEmailType = (emailType || "").toLowerCase();

  const isUserFlow =
    rawType === "users" ||
    rawEmailType === "users" ||
    rawFunction === "newuser" ||
    rawFunction === "userupdate";

  const cleanFn = isUserFlow ? clean : soft;

  email = cleanFn(email, null);
  emailType = cleanFn(emailType, "newUser");

  const requiresEmail =
    rawType === "users" ||
    rawFunction === "sendemail" ||
    (rawEmailType && rawEmailType !== "newuser");

  if (requiresEmail && !email) {
    throw new Error("Missing Email");
  }

  if (email) {
    email = decodeURIComponent(email).trim().toLowerCase();
    if (!email.includes("@") || email.length < 5) {
      throw new Error("Invalid Email");
    }
  }

  if (emailType) {
    emailType = emailType.charAt(0).toLowerCase() + emailType.slice(1);
  }

  const finalPayload = {
    TPIdentity: {
      email,
      displayName: clean(merged.displayName),
      resendToken: clean(merged.resendToken)
    },

    TPNotifications: {
      receiveSMS:
        merged.receiveSMS === true ||
        merged.receiveSMS === "true" ||
        merged.receiveSMS === 1,

      receiveMassEmails:
        merged.receiveMassEmails === true ||
        merged.receiveMassEmails === "true" ||
        merged.receiveMassEmails === 1
    },

    TPWallet: {
      payFrequency: clean(merged.payFrequency),
      payDay: clean(merged.payDay)
    },

    TPLoyalty: {
      pointsBalance: Number(merged.pointsBalance || merged.points || 0)
    },

    meta: {
      type: clean(rawType),
      function: clean(rawFunction),
      logId
    }
  };

  log("✅ FINAL PARSED:", { email, emailType, logId, payload: finalPayload });

  return { email, emailType, logId, payload: finalPayload };
}
/* ----------------------------------------------------
   STRIPE: configurePayoutSettings
   Allows Belize banks by disabling instant payouts
---------------------------------------------------- */
export async function configurePayoutSettings(stripe, accountId, payFrequency, payDay, admin, db) {
  log("🔵 [configurePayoutSettings] START");

  const cleanLower = (v, fallback = null) => {
    if (!v) return fallback;
    const s = String(v).trim().toLowerCase();
    if (
      s === "" ||
      s.includes("{{") ||
      s.includes("add_more_field") ||
      s.includes("fieldLebal") ||
      s.includes("fieldValue") ||
      s.includes("*")
    ) return fallback;
    return s;
  };

  try {
    // Normalize inputs
    payFrequency = cleanLower(payFrequency, "daily");
    payDay = cleanLower(payDay, "monday");

    const allowedFreq = ["daily", "weekly"];
    if (!allowedFreq.includes(payFrequency)) payFrequency = "daily";

    const allowedDays = ["monday","tuesday","wednesday","thursday","friday"];
    if (payFrequency === "weekly" && !allowedDays.includes(payDay)) {
      payDay = "monday";
    }

    // Fetch Stripe account
    const account = await stripe.accounts.retrieve(accountId);

    // Lookup user by Stripe account ID
    const snap = await db
      .collection("Users")
      .where("TPIdentity.stripeAccountID", "==", accountId)
      .limit(1)
      .get();

    if (snap.empty) {
      throw new Error("Missing user for Stripe account");
    }

    const userDoc = snap.docs[0];
    const userRef = userDoc.ref;
    const userData = userDoc.data() || {};

    // Country normalization
    const country = normalizeCountry(
      account.country ??
      userData.TPIdentity?.country ??
      "BZ"
    );

    // Countries that support instant payouts
    const instantPayoutSupportedCountries = ["US", "GB", "CA", "AU"];

    // Build payout schedule
    const schedule = { interval: payFrequency };
    if (payFrequency === "weekly") {
      schedule.weekly_anchor = payDay;
    }

    const payoutSettings = {
      settings: {
        payouts: {
          schedule,
          ...(instantPayoutSupportedCountries.includes(country)
            ? {}
            : { debit_negative_balances: false })
        }
      }
    };

    // Update Stripe
    await stripe.accounts.update(accountId, payoutSettings);

    const now = admin.firestore.FieldValue.serverTimestamp();

    // Firestore update
    await userRef.set(
      {
        TPIdentity: {
          ...userData.TPIdentity,
          country,
          updatedAt: now
        },
        TPWallet: {
          ...userData.TPWallet,
          payouts: {
            frequency: payFrequency,
            day: payDay,
            updatedAt: now
          },
          updatedAt: now
        }
      },
      { merge: true }
    );

    log("✅ [configurePayoutSettings] COMPLETE");

    return {
      country,
      instantPayoutsEnabled: instantPayoutSupportedCountries.includes(country)
    };

  } catch (err) {
    error("❌ configurePayoutSettings error:", err.message);
    throw err;
  }
}
/* ----------------------------------------------------
   FETCH BUFFER (binary-safe)
---------------------------------------------------- */
export async function fetchBuffer(url) {
  try {
    const resp = await fetch(url, { redirect: "follow" });
    const status = resp.status;

    if (!resp.ok) {
      return { ok: false, status, error: `HTTP ${status}` };
    }

    const contentType = resp.headers.get("content-type") || "";
    const arrayBuf = await resp.arrayBuffer();

    // Convert ArrayBuffer → Node Buffer safely
    const buffer = Buffer.from(arrayBuf);

    return { ok: true, buffer, contentType, status };
  } catch (err) {
    return { ok: false, error: String(err) };
  }
}

/* ----------------------------------------------------
   SHA‑256 HASH (browser OR Node fallback)
---------------------------------------------------- */
export async function computeSha256Hex(buffer) {
  // Try Web Crypto first
  try {
    if (
      globalThis.crypto &&
      globalThis.crypto.subtle &&
      typeof globalThis.crypto.subtle.digest === "function"
    ) {
      let ab;

      if (buffer instanceof ArrayBuffer) {
        ab = buffer;
      } else if (ArrayBuffer.isView(buffer)) {
        ab = buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
      } else {
        ab = Buffer.from(buffer).buffer;
      }

      const hashBuf = await globalThis.crypto.subtle.digest("SHA-256", ab);
      const hashArr = Array.from(new Uint8Array(hashBuf));

      return hashArr.map(b => b.toString(16).padStart(2, "0")).join("");
    }
  } catch (e) {
    // fall through to Node fallback
  }

  // Node fallback (dynamic require)
  try {
    const crypto = require("crypto");

    const nodeBuf = Buffer.isBuffer(buffer)
      ? buffer
      : Buffer.from(buffer);

    return crypto.createHash("sha256").update(nodeBuf).digest("hex");
  } catch (err) {
    warn("⚠️ computeSha256Hex fallback failed:", err);
    return null;
  }
}
// ============================================================================
// 📘 PAGE INDEX — END OF FILE
//
// This boundary marks the end of the logic defined in this module.
// Any code below this line is considered a violation of the PAGE INDEX rules.
//
// RECONSTRUCTION GUARANTEE:
//   If this file is ever corrupted, partially deleted, or AI‑reconstructed,
//   the PAGE INDEX (top) + this END BLOCK (bottom) allow full restoration.
//
// RULES ENFORCED BY THIS BLOCK:
//   • No handlers may be added below this line
//   • No side‑effects may be added below this line
//   • No imports may appear below this line
//   • No exports may appear below this line
//   • No initialization code may appear below this line
//
// If additional helpers are needed, they MUST be placed ABOVE this block.
// ============================================================================