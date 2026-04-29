/* global log,warn,error */
// FILE: apps/netlify/functions/redeemPulsePoints.js
//
// INTENT-CHECK:
//   If you paste this while confused or frustrated, pause and re-read your INTENT.
//   If this PAGE INDEX does not match your intent, update it BEFORE editing code.
//
// 📘 PAGE INDEX — Source of Truth for This Backend Function
//
// This PAGE INDEX defines the identity, purpose, boundaries, and allowed behavior
// of this backend Pulse Points redemption handler. It is the compressed representation
// of the entire file. Keep this updated as loyalty logic evolves.
//
// CONTENTS TO MAINTAIN:
//   • What this file IS
//   • What this file IS NOT
//   • Responsibilities
//   • Exported function
//   • Internal logic summary
//   • Boundaries + constraints
//
// ROLE:
//   redeemPulsePoints — the backend Pulse Points redemption engine for Tropic Pulse.
//   This function is responsible for:
//     • Validating lineage token (TPIdentity.resendToken)
//     • Validating redemption rules (min 500, increments of 500)
//     • Validating user point balance
//     • Loading seasonal settings
//     • Updating TPLoyalty + TPWallet securely
//     • Logging PulseHistory entry
//     • Sending redemption confirmation email
//     • Returning updated balance to connector
//
// REAL‑WORLD CONTEXT (for future Aldwyn):
//   • This file runs ONLY on the backend.
//   • This file does NOT update UI.
//   • This file does NOT manipulate DOM.
//   • This file does NOT run in the browser.
//   • This file performs secure Firestore writes + history logging.
//   • This file MUST remain server-side due to protected fields + lineage validation.
//
// THIS FILE IS:
//   • A backend action
//   • A loyalty validator
//   • A Firestore writer
//   • A history logger
//   • A secure email trigger
//
// THIS FILE IS NOT:
//   • A connector
//   • A frontend helper
//   • A UI renderer
//   • A compute engine
//   • A generic webhook forwarder
//
// DEPLOYMENT:
//   Lives in apps/netlify/functions as part of the Tropic Pulse backend subsystem.
//   Must run in Node.js. Must remain deterministic and secure.
//
// INTERNAL LOGIC SUMMARY:
//   • Validate token + uid
//   • Load user + loyalty + wallet
//   • Validate redemption amount
//   • Load seasonal settings
//   • Update loyalty + wallet
//   • Log PulseHistory entry
//   • Send redemption email
//   • Return updated balance
//
// ------------------------------------------------------
// redeemPulsePoints — Backend Pulse Points Redemption Engine (A Layer)
// ------------------------------------------------------
import { db, admin } from "./firebase.js";
import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import Stripe from "stripe";
import nodemailer from "nodemailer";
import twilio from "twilio";


const EMAIL_PASSWORD = defineSecret("EMAIL_PASSWORD");
const STRIPE_PASSWORD = defineSecret("STRIPE_SECRET_KEY");
const JWT_SECRET = defineSecret("JWT_SECRET");


function getSeasonFromSettings(settings) {
  const today = new Date();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const mmdd = `${mm}-${dd}`;

  const periods = settings?.seasonalPeriods || {};

  const isInRange = (date, start, end) => {
    // Normal range
    if (start <= end) return date >= start && date <= end;
    // Wrap-around (e.g., Dec 15 → Jan 10)
    return date >= start || date <= end;
  };

  for (const key in periods) {
    const s = periods[key];
    if (!s?.start || !s?.end) continue;

    if (isInRange(mmdd, s.start, s.end)) {
      return {
        seasonalActive: true,
        seasonalName: s.name || "",
        seasonalMultiplier: Number(s.multiplier) || 1
      };
    }
  }

  return {
    seasonalActive: false,
    seasonalName: "",
    seasonalMultiplier: 1
  };
}


export const redeemPulsePoints = onRequest(
  {
    region: "us-central1",
    secrets: [JWT_SECRET],
    timeoutSeconds: 540,
    memory: "512MiB"
  },
  async (req, res) => {
    // CORS
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");
    res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");

    if (req.method === "OPTIONS") return res.status(204).send("");

    try {
      // ------------------------------------
      // LINEAGE VALIDATION (TPIdentity.resendToken)
      // ------------------------------------
      const authHeader = req.headers.authorization || "";
      const token = authHeader.replace("Bearer ", "").trim();
      const { uid, pointsToRedeem } = req.body || {};

      if (!token || !uid) {
        return res.status(403).json({
          success: false,
          error: "Missing uid or token"
        });
      }

      const userRef = db.collection("Users").doc(uid);
      const userSnap = await userRef.get();

      if (!userSnap.exists) {
        return res.status(404).json({
          success: false,
          error: "User not found"
        });
      }

      const user = userSnap.data() || {};
      const TPIdentity = user.TPIdentity || {};
      const TPLoyalty = user.TPLoyalty || {};
      const TPWallet = user.TPWallet || {};

      const storedToken = TPIdentity.resendToken || null;
      if (!storedToken || storedToken !== token) {
        return res.status(403).json({
          success: false,
          error: "Token mismatch"
        });
      }

      // ------------------------------------
      // VALIDATION (TPLoyalty as source of truth)
      // ------------------------------------
      const currentPoints = Number(TPLoyalty.pointsBalance) || 0;

      if (pointsToRedeem < 500 || pointsToRedeem % 500 !== 0) {
        return res.status(400).json({
          success: false,
          message: "Minimum redemption is 500 points, in increments of 500."
        });
      }

      if (currentPoints < pointsToRedeem) {
        return res.status(400).json({
          success: false,
          message: "Not enough points!"
        });
      }

      const newPoints = currentPoints - pointsToRedeem;
      const currentLifetime = Number(TPLoyalty.lifetimePoints) || 0;

      // ------------------------------------
      // LOAD SETTINGS (SEASONAL)
      // ------------------------------------
      const settingsSnap = await db.collection("TPSettings").doc("global").get();
      const settings = settingsSnap.data() || {};

      const {
        seasonalActive,
        seasonalName,
        seasonalMultiplier
      } = getSeasonFromSettings(settings);

      // ------------------------------------
      // UPDATE TPLoyalty + TPWallet
      // ------------------------------------
      await userRef.update({
        "TPLoyalty.pointsBalance": newPoints,
        "TPLoyalty.lifetimePoints": currentLifetime,
        "TPLoyalty.streakCount": 0,
        "TPLoyalty.updated": admin.firestore.FieldValue.serverTimestamp(),

        "TPWallet.pointsBalance": newPoints,
        "TPWallet.lifetimePoints": currentLifetime,
        "TPWallet.lastEarnedDate": TPWallet.lastEarnedDate || null
      });

      // ------------------------------------
      // HISTORY SNAPSHOT
      // ------------------------------------
      const snapshot = {
        seasonalName: TPLoyalty.seasonalName ?? seasonalName,
        seasonalMultiplier: TPLoyalty.seasonalMultiplier ?? seasonalMultiplier,
        seasonalActive: TPLoyalty.seasonalActive ?? seasonalActive,

        tier: TPLoyalty.tier || null,
        tierKey: TPLoyalty.tierKey || null,
        tierMultiplier: TPLoyalty.tierMultiplier || 1,

        streakCount: TPLoyalty.streakCount || 0,
        streakMultiplier: TPLoyalty.streakMultiplier || 1,
        streakExpires: TPLoyalty.streakExpires || null,

        calculationVersion: TPLoyalty.calculationVersion || 1,

        pointsBefore: currentPoints,
        pointsAfter: newPoints
      };

      // ------------------------------------
      // LOG HISTORY ENTRY
      // ------------------------------------
      await db
        .collection("PulseHistory")
        .doc(uid)
        .collection("entries")
        .add({
          type: "redeem",
          label: "Points Redeemed",
          amount: -pointsToRedeem,

          ts: admin.firestore.FieldValue.serverTimestamp(),
          createdAt: admin.firestore.FieldValue.serverTimestamp(),

          orderID: null,
          streakCount: 0,

          pulsepointsBefore: currentPoints,
          pulsepointsAfter: newPoints,

          seasonalName: snapshot.seasonalName,
          seasonalActive: snapshot.seasonalActive,

          calculationVersion: snapshot.calculationVersion,
          totalPointsEarned: -pointsToRedeem,

          pointsSnapshot: snapshot
        });

      // ------------------------------------
      // SEND USER EMAIL
      // ------------------------------------
      const userEmail = TPIdentity.email || null;
      const userName =
        TPIdentity.name ||
        TPIdentity.displayName ||
        "";

      if (userEmail) {
        const emailURL =
          "https://sendmassemail-ilx3agka5q-uc.a.run.app" +
          `?useremail=${encodeURIComponent(userEmail)}` +
          `&emailType=pulsePointRedemption` +
          `&points=${encodeURIComponent(pointsToRedeem)}` +
          `&name=${encodeURIComponent(userName)}` +
          `&uid=${encodeURIComponent(uid)}`;

        await fetch(emailURL);
      }

      // ------------------------------------
      // SUCCESS
      // ------------------------------------
      return res.json({
        success: true,
        pulsepoints: newPoints
      });

    } catch (err) {
      error("redeemPulsePoints error:", err);
      return res.json({
        success: false,
        error: "Server error: " + err.message
      });
    }
  }
);