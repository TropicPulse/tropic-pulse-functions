/* global log,warn,error */
// FILE: tropic-pulse-functions/PULSE-WORLD/functions/stripe-webhook.js
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
//   Legacy Firebase HTTPS endpoint that processes Stripe webhook events.
//   Handles three major flows:
//     1. Vendor onboarding (account.created / account.updated)
//     2. Reserve system updates (payment_intent.succeeded)
//     3. Mass email credit purchases (checkout.session.completed)
//
//   This file IS a Firebase handler (legacy).
//   This file SHOULD NOT be expanded — all new Stripe logic must be migrated
//   to Netlify.
//
// WHAT THIS FILE IS:
//   • A Stripe webhook processor
//   • A Firestore mutation layer for vendor + wallet updates
//   • A legacy endpoint that must remain stable until replaced
//
// WHAT THIS FILE IS NOT:
//   • Not a Netlify function
//   • Not a business logic module
//   • Not a scoring engine
//   • Not allowed to contain new Stripe flows
//   • Not allowed to mutate identity documents outside intended fields
//
// DEPLOYMENT:
//   Runs ONLY on Firebase Functions (legacy).
//   Must remain stable until fully migrated to Netlify.
//   No new Firebase Functions should be added.
//
// SYNTAX RULES:
//   ESM JavaScript ONLY — no TypeScript, no CommonJS, no require().
//   Named exports ONLY — no default exports.
//
// IMPORT RULES:
//   Allowed:
//     • Stripe (official SDK)
//     • Firebase Admin SDK
//     • calculateReleaseDate from ./utils.js
//     • STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET from ./env.js
//
//   Forbidden:
//     • Twilio
//     • Netlify-specific modules
//     • Any new dependencies not explicitly approved
//
// INTERNAL LOGIC SUMMARY:
//   • Verifies Stripe webhook signatures using rawBody
//   • Vendor onboarding:
//       - Finds user by email
//       - Sets TPIdentity.role = "Vendor"
//       - Sets payout schedule to weekly (Monday)
//       - Logs CHANGES + IdentityHistory snapshots
//   • Reserve system:
//       - Reads vendorId + reserveAmount from metadata
//       - Increments reserveBalance
//       - Appends reserveHistory entry
//       - Logs CHANGES
//   • Mass email credits:
//       - Reads eventID from metadata
//       - Finds event + user
//       - Increments paidMassNotificationCredits
//       - Logs CHANGES
//
// SAFETY NOTES:
//   • Must ALWAYS verify Stripe signatures using rawBody
//   • Never expose Stripe secrets in logs
//   • Never mutate unrelated user fields
//   • Never assume metadata exists — validate defensively
//   • This endpoint is critical — changes affect payouts, reserves, and credits

import Stripe from "stripe";
import admin from "firebase-admin";
import { calculateReleaseDate } from "./utils.js";
import { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET } from "./env.js";

if (!admin.apps.length) {
  admin.initializeApp();
}

const db = admin.firestore();

export async function handler(event, context) {
  try {
    // Stripe requires rawBody for signature verification
    const rawBody = event.rawBody;
    const signature = event.headers["stripe-signature"];

    const stripe = new Stripe(STRIPE_SECRET_KEY);

    let stripeEvent;
    try {
      stripeEvent = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      error("Webhook signature verification failed:", err.message);
      return {
        statusCode: 400,
        body: JSON.stringify({
          success: false,
          error: "Webhook signature verification failed"
        })
      };
    }

    const eventObj = stripeEvent;

    // ---------------------------------------------------------
    // 1. VENDOR ONBOARDING
    // ---------------------------------------------------------
    if (eventObj.type === "account.created" || eventObj.type === "account.updated") {
      const account = eventObj.data.object;

      const stripeAccountID = account.id;
      const email = account.email;
      const country = account.country;

      if (email) {
        const snap = await db
          .collection("Users")
          .where("UserEmail", "==", email)
          .limit(1)
          .get();

        if (!snap.empty) {
          const userRef = snap.docs[0].ref;

          await userRef.set({
            UserCountry: country,

            TPIdentity: {
              role: "Vendor",
              stripeAccountID,
              stripeDashboardURL: null
            },

            TPNotifications: {
              receiveMassEmails: true
            },

            TPWallet: {
              payFrequency: "weekly",
              payDay: "monday"
            },

            updatedAt: admin.firestore.FieldValue.serverTimestamp()
          }, { merge: true });

          await db.collection("CHANGES").add({
            type: "vendorOnboarding",
            uid: userRef.id,
            stripeAccountID,
            country,
            reason: "stripe_vendor_onboarding",
            actor: "system",
            source: "stripeWebhook",
            createdAt: admin.firestore.FieldValue.serverTimestamp()
          });

          await db
            .collection("IdentityHistory")
            .doc(userRef.id)
            .collection("snapshots")
            .add({
              snapshotType: "vendorOnboarding",
              stripeAccountID,
              country,
              reason: "stripe_vendor_onboarding",
              actor: "system",
              source: "stripeWebhook",
              createdAt: admin.firestore.FieldValue.serverTimestamp()
            });

          await stripe.accounts.update(stripeAccountID, {
            settings: {
              payouts: {
                schedule: {
                  interval: "weekly",
                  weekly_anchor: "monday"
                }
              }
            }
          });

          log(`Vendor updated: ${email} → weekly payouts`);
        }
      }
    }

    // ---------------------------------------------------------
    // 2. RESERVE SYSTEM
    // ---------------------------------------------------------
    if (eventObj.type === "payment_intent.succeeded") {
      const pi = eventObj.data.object;
      const vendorId = pi.metadata?.vendorId;
      const reserveAmount = parseInt(pi.metadata?.reserveAmount || "0");

      let country = null;

      if (pi.transfer_data?.destination) {
        const acct = await stripe.accounts.retrieve(pi.transfer_data.destination);
        country = acct.country;
      }

      if (vendorId && reserveAmount) {
        const vendorRef = db.collection("Users").doc(vendorId);

        await vendorRef.set({
          UserCountry: country,

          TPWallet: {
            reserveBalance: admin.firestore.FieldValue.increment(reserveAmount),
            reserveHistory: admin.firestore.FieldValue.arrayUnion({
              amount: reserveAmount,
              date: new Date().toISOString(),
              orderId: pi.id,
              releaseDate: calculateReleaseDate(new Date(), 60),
              type: "reserve_add"
            })
          }
        }, { merge: true });

        await db.collection("CHANGES").add({
          type: "reserveAdd",
          uid: vendorId,
          amount: reserveAmount,
          orderId: pi.id,
          reason: "reserve_add",
          actor: "system",
          source: "stripeWebhook",
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        log(`Reserve added: Vendor ${vendorId} +${reserveAmount} cents`);
      } else {
        warn("Payment succeeded but missing vendorId or reserveAmount");
      }
    }

    // ---------------------------------------------------------
    // 3. MASS EMAIL CREDITS
    // ---------------------------------------------------------
    if (eventObj.type === "checkout.session.completed") {
      const session = eventObj.data.object;

      const eventID = session.metadata?.eventID;
      if (!eventID) {
        error("❌ checkout.session.completed missing eventID in metadata");
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "Missing eventID" })
        };
      }

      const eventRef = db.collection("Events").doc(eventID);
      const eventSnap = await eventRef.get();

      if (!eventSnap.exists) {
        error("❌ Event not found:", eventID);
        return {
          statusCode: 404,
          body: JSON.stringify({ error: "Event not found" })
        };
      }

      const eventData = eventSnap.data();
      const useremail = eventData.email;

      const snap = await db
        .collection("Users")
        .where("UserEmail", "==", useremail)
        .limit(1)
        .get();

      if (snap.empty) {
        return {
          statusCode: 404,
          body: JSON.stringify({ success: false, error: "Invalid token" })
        };
      }

      const userDoc = snap.docs[0];
      const userRef = userDoc.ref;
      const userID = userDoc.id;

      const lineItems = await stripe.checkout.sessions.listLineItems(session.id);
      const quantity = lineItems.data[0]?.quantity || 1;

      await userRef.set({
        TPNotifications: {
          paidMassNotificationCredits: admin.firestore.FieldValue.increment(quantity)
        }
      }, { merge: true });

      await db.collection("CHANGES").add({
        type: "massEmailCredits",
        uid: userID,
        quantity,
        eventID,
        reason: "mass_email_credit_purchase",
        actor: "system",
        source: "stripeWebhook",
        createdAt: admin.firestore.FieldValue.serverTimestamp()
      });

      log(`Added ${quantity} credits to user ${userID} for event ${eventID}`);
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, received: true })
    };

  } catch (err) {
    error("stripeWebhook error:", err.message);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false })
    };
  }
}