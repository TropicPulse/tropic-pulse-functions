/* global log,warn,error */
// FILE: apps/netlify/functions/massEmailWebhook.js
//
// INTENT-CHECK:
//   If you paste this while confused or frustrated, pause and re-read your INTENT.
//   If this PAGE INDEX does not match your intent, update it BEFORE editing code.
//
// 📘 PAGE INDEX — Source of Truth for This Backend Function
//
// This PAGE INDEX defines the identity, purpose, boundaries, and allowed behavior
// of this backend mass-email webhook. It is the compressed representation of the
// entire file. Keep this updated as mass-email logic evolves.
//
// ROLE:
//   massEmailWebhook — the backend mass-email dispatch engine for Tropic Pulse.
//   This function is responsible for:
//     • Accepting ALL email types (newEvent, newBusiness, pulsePointRedemption, etc.)
//     • Validating incoming payload (email + eventID OR businessID OR emailType)
//     • Looking up or creating user records
//     • Checking free + paid credit availability
//     • Deducting credits (free or paid)
//     • Triggering the mass email send (event OR business OR redemption)
//     • Sending “no credits” email with Stripe link
//     • Returning status + optional payment link to connector
//
// THIS FILE IS:
//   • A backend action
//   • A credit validator
//   • A mass-email dispatcher
//   • A Firestore writer
//   • A dual-mode (event + business) email engine
//   • A multi-email-type engine
//
// THIS FILE IS NOT:
//   • A connector
//   • A frontend helper
//   • A UI renderer
//   • A compute engine
//   • A generic webhook forwarder
//
// INTERNAL LOGIC SUMMARY:
//   • Validate payload (email + eventID OR businessID OR emailType)
//   • Lookup user by TPIdentity.email (fallback to legacy Email)
//   • Create user if none exists
//   • Ensure TPNotifications fields exist
//   • Check free + paid credits
//   • If no credits → send payment email + return payment link
//   • Deduct credit
//   • Send mass email (event OR business OR redemption)
//   • Return status
//
// ------------------------------------------------------
// massEmailWebhook — Backend Mass Email Engine (A Layer)
// ------------------------------------------------------
import { admin, db } from "./helpers.js";
import { onRequest } from "firebase-functions/v2/https";
import { defineSecret } from "firebase-functions/params";
import nodemailer from "nodemailer";
import twilio from "twilio";
import { getStripe } from "./stripe.js";

const EMAIL_PASSWORD = defineSecret("EMAIL_PASSWORD");
const STRIPE_PASSWORD = defineSecret("STRIPE_SECRET_KEY");
const JWT_SECRET = defineSecret("JWT_SECRET");
// CLOUD RUN ENVIRONMENTS
const TP_API_KEY = window.TP_API_KEY;
const BASE_PAYMENT_URL = window.BASE_PAYMENT_URL;
const GOOGLE_MAPS_KEY = window.GOOGLE_MAPS_KEY;
const PLACEHOLDER_IMAGE_URL = window.PLACEHOLDER_IMAGE_URL;

const STRIPE_WEBHOOK_SECRET = defineSecret("STRIPE_SECRET_WEBHOOK");
const MESSAGING_SERVICE_SID = defineSecret("MESSAGING_SERVICE_SID");
const ACCOUNT_SID = defineSecret("ACCOUNT_SID");
const AUTH_TOKEN = defineSecret("AUTH_TOKEN");

// CONFIG
const PIN_COLLECTION = "Users";
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5;
const PIN_TTL_MS = MAX_REQUESTS_PER_WINDOW * RATE_LIMIT_WINDOW_MS; // 5 minutes

const corsHandler = pulseCors;
function pulseCors(req, res, next) {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Pulse-Device, X-Pulse-Remember");
  res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.status(204).send("");
  }

  next();
}


export async function createMassEmailPaymentLink(eventID, eventImageUrl) {
  const STRIPE_PASSWORD_VALUE = STRIPE_PASSWORD.value();
  const stripe = new getStripe(STRIPE_PASSWORD_VALUE);

  // 1. Update the product image dynamically
  await stripe.products.update("prod_TzIC2PMixkP2qf", {
    images: [ eventImageUrl ]
  });

  // 2. Create the Payment Link
  const link = await stripe.paymentLinks.create({
    line_items: [
      {
        price: "price_1T1JcWCt2lhjxca8hw0yppTF",   // BZ$10 per credit
        quantity: 1,
        adjustable_quantity: {
          enabled: true,
          minimum: 1,
          maximum: 99
        }
      }
    ],

    after_completion: {
      type: "redirect",
      redirect: {
        url: `https://www.tropicpulse.bze.bz/paymentSuccess.html?eventID=${eventID}`
      }
    },

    metadata: {
      eventID
    },

    allow_promotion_codes: false,
    phone_number_collection: { enabled: false },
    automatic_tax: { enabled: false }
  });

  return link.url;
}


async function sendNoCreditsEmail({
  email,
  paymentLink,
  eventID,
  logId,
  emailPassword,
  accountSid,
  authToken,
  messagingSid
}) {
  try {
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "Sales@TropicPulse.bz",
        pass: emailPassword
      }
    });

    const twilioClient = twilio(accountSid, authToken);

    const payload = {
      email,
      paymentLink,
      eventID,
      adminUser: "Automate",
      logId: logId || null
    };

    const template = emailTemplates["NoCredits"];
    if (!template) throw new Error("missing_template_NoCredits");

    // -----------------------------
    // Load user (NEW SCHEMA)
    // -----------------------------
    const userSnap = await db
      .collection("Users")
      .where("TPIdentity.email", "==", email)
      .limit(1)
      .get();

    if (userSnap.empty) throw new Error("User not found for NoCredits email");

    const doc = userSnap.docs[0];
    const userID = doc.id;
    const user = doc.data();
    const userRef = doc.ref;

    const subject = template.subject(payload);
    const html = template.html(payload);

    // -----------------------------
    // PHONE (NEW SCHEMA)
    // -----------------------------
    // Your schema does NOT include phone.
    // So SMS can ONLY be sent if you add TPIdentity.phone later.
    const phone = user.TPIdentity?.phone || null;

    // -----------------------------
    // SMS Opt-In (NEW SCHEMA)
    // -----------------------------
    const receiveSMS = user.TPNotifications?.receiveSMS === true;

    // -----------------------------
    // Send Email
    // -----------------------------
    await transporter.sendMail({
      from: `"Tropic Pulse" <Sales@TropicPulse.bz>`,
      to: email,
      bcc: "FordFamilyDelivery@Gmail.com",
      subject,
      html,
      headers: template.headers || {}
    });

    // -----------------------------
    // Log Email
    // -----------------------------
    const ts = admin.firestore.FieldValue.serverTimestamp();
    const ref = await db.collection("EmailLogs").add({
      date: ts,
      to: email,
      type: "NoCredits",
      emailType: "NoCredits",
      payload,
      html,
      subject,
      adminUser: "Automate",
      triggeredBy: "Automate",
      triggerSource: "sendNoCreditsEmail",
      status: "Sent",
      createdAt: ts,
      timestamp: ts
    });

    await ref.update({ logId: ref.id });

    console.log("Sent NO CREDITS email to:", email);

    // -----------------------------
    // SMS (NEW SCHEMA)
    // -----------------------------
    if (!receiveSMS || !phone) {
      console.log("🚫 SMS blocked (no phone or opted out)");
      return { success: true, sms: false };
    }

    await twilioClient.messages.create({
      to: phone,
      messagingServiceSid: messagingSid,
      body: `You're out of Mass Notification Credits!`
    });

    await userRef.update({
      "TPNotifications.lastSMSSentAt": admin.firestore.FieldValue.serverTimestamp()
    });

    console.log("Sent NO CREDITS SMS to:", phone);

    return { success: true, sms: true };

  } catch (err) {
    console.error("sendNoCreditsEmail error:", err);
    return { success: false, error: err.message };
  }
}

export const massEmailWebhook = onRequest(
  {
    region: "us-central1",
    timeoutSeconds: 540,
    memory: "512MiB",
    secrets: [
      STRIPE_PASSWORD,
      ACCOUNT_SID,
      AUTH_TOKEN,
      MESSAGING_SERVICE_SID,
      EMAIL_PASSWORD,
      STRIPE_WEBHOOK_SECRET
    ]
  },
  (req, res) => {
    corsHandler(req, res, async () => {
      try {
        log("🔵 [massEmailWebhook] START");

        const EMAIL_PASSWORD_VALUE = EMAIL_PASSWORD.value();
        const ACCOUNT_SID_VALUE = ACCOUNT_SID.value();
        const AUTH_TOKEN_VALUE = AUTH_TOKEN.value();
        const MESSAGING_SERVICE_SID_VALUE = MESSAGING_SERVICE_SID.value();

        const email =
          req.method === "GET" ? req.query.email : req.body.email;

        const eventID =
          req.method === "GET"
            ? req.query.eventID || req.query.eventId
            : req.body.eventID || req.body.eventId;

        const businessID =
          req.method === "GET"
            ? req.query.businessID
            : req.body.businessID;

        const businessName =
          req.method === "GET"
            ? req.query.businessName
            : req.body.businessName;

        const emailType =
          req.method === "GET"
            ? req.query.emailType
            : req.body.emailType;

        if (!email) {
          return res.status(400).send({ error: "Missing email" });
        }

        // ---------------------------------------------------------
        // LOOKUP USER (new schema → legacy fallback)
        // ---------------------------------------------------------
        let snap = await db
          .collection("Users")
          .where("TPIdentity.email", "==", email.toLowerCase())
          .limit(1)
          .get();

        if (snap.empty) {
          snap = await db
            .collection("Users")
            .where("Email", "==", email.toLowerCase())
            .limit(1)
            .get();
        }

        let userID;
        let userData;

        if (snap.empty) {
          const ref = await db.collection("Users").add({
            TPIdentity: {
              email: email.toLowerCase(),
              name: "New User",
              displayName: null,
              role: "Customer",
              identitySetAt: admin.firestore.FieldValue.serverTimestamp(),
              resendToken: null,
              trustedDevice: false,
              stripeAccountID: null,
              stripeDashboardURL: null,
              loginLink: null,
              paymentSetup: "Incomplete"
            },
            TPNotifications: {
              freeMassNotificationsLimit: 2,
              freeMassNotificationsUsed: 0,
              paidMassNotificationCredits: 0,
              receiveMassEmails: true,
              receiveSMS: true,
              lastEmailSentAt: null,
              lastSMSSentAt: null,
              emailPending: false
            },
            createdAt: admin.firestore.FieldValue.serverTimestamp()
          });

          userID = ref.id;
          userData = {
            TPIdentity: { name: "New User" },
            TPNotifications: {
              freeMassNotificationsLimit: 2,
              freeMassNotificationsUsed: 0,
              paidMassNotificationCredits: 0
            }
          };
        } else {
          const doc = snap.docs[0];
          userID = doc.id;
          userData = doc.data() || {};

          const TPNotifications = userData.TPNotifications || {};
          const updates = {};

          if (TPNotifications.freeMassNotificationsLimit == null) {
            updates["TPNotifications.freeMassNotificationsLimit"] = 2;
            TPNotifications.freeMassNotificationsLimit = 2;
          }

          if (TPNotifications.paidMassNotificationCredits == null) {
            updates["TPNotifications.paidMassNotificationCredits"] = 0;
            TPNotifications.paidMassNotificationCredits = 0;
          }

          if (TPNotifications.freeMassNotificationsUsed == null) {
            updates["TPNotifications.freeMassNotificationsUsed"] = 0;
            TPNotifications.freeMassNotificationsUsed = 0;
          }

          if (Object.keys(updates).length) {
            await db.collection("Users").doc(userID).update(updates);
          }

          userData.TPNotifications = TPNotifications;
        }

        const TPNotifications = userData.TPNotifications || {};
        const freeUsed = TPNotifications.freeMassNotificationsUsed || 0;
        const freeLimit = TPNotifications.freeMassNotificationsLimit || 2;
        const paidRemaining = TPNotifications.paidMassNotificationCredits || 0;

        const freeRemaining = Math.max(freeLimit - freeUsed, 0);

        // ---------------------------------------------------------
        // NO CREDITS → SEND PAYMENT EMAIL
        // ---------------------------------------------------------
        if (freeRemaining <= 0 && paidRemaining <= 0) {
          const eventImageUrl = "/NewEvent.png?v8";

          const paymentLink = await createMassEmailPaymentLink(
            eventID,
            eventImageUrl
          );

          await sendNoCreditsEmail({
            email,
            paymentLink,
            eventID,
            emailPassword: EMAIL_PASSWORD_VALUE,
            accountSid: ACCOUNT_SID_VALUE,
            authToken: AUTH_TOKEN_VALUE,
            messagingSid: MESSAGING_SERVICE_SID_VALUE
          });

          return res.json({ status: "no_credits", paymentLink });
        }

        // ---------------------------------------------------------
        // DEDUCT CREDIT
        // ---------------------------------------------------------
        const userRef = db.collection("Users").doc(userID);

        if (freeRemaining > 0) {
          await userRef.update({
            "TPNotifications.freeMassNotificationsUsed":
              admin.firestore.FieldValue.increment(1)
          });
        } else {
          await userRef.update({
            "TPNotifications.paidMassNotificationCredits":
              admin.firestore.FieldValue.increment(-1)
          });
        }

        // ---------------------------------------------------------
        // SEND MASS EMAIL (EVENT OR BUSINESS OR REDEMPTION)
        // ---------------------------------------------------------
        const sendResult = await sendMASSemail({
          email,
          emailType,
          eventID,
          businessID,
          businessName
        });

        if (sendResult.success) {
          return res.json({ status: "sent" });
        }

        return res.json({ status: "failed" });

      } catch (err) {
        error("❌ Mass Email Webhook Error:", err);
        return res.status(500).send({ error: "Internal error" });
      }
    });
  }
);

async function sendEmailToUser(email, emailType, payload = {}) {
  console.log("🔵 [sendEmailToUser] START");

  const normalizeEmail = (v) =>
    typeof v === "string" ? v.trim().toLowerCase() : null;

  const clean = (v) => {
    if (v === undefined || v === null) return null;
    const s = String(v).trim();
    return s === "" ? null : s;
  };

  try {
    // -----------------------------
    // Normalize + validate email
    // -----------------------------
    email = normalizeEmail(clean(email));
    if (!email) {
      return { success: false, error: "Invalid email" };
    }

    // -----------------------------
    // Validate emailType
    // -----------------------------
    if (!emailType || !emailTemplates[emailType]) {
      return { success: false, error: `Unknown emailType: ${emailType}` };
    }

    // -----------------------------
    // Lookup user (NEW SCHEMA)
    // -----------------------------
    const snap = await admin
      .firestore()
      .collection("Users")
      .where("TPIdentity.email", "==", email)
      .limit(1)
      .get();

    if (snap.empty) {
      return { success: false, error: `User not found: ${email}` };
    }

    const userDoc = snap.docs[0];
    const userRef = userDoc.ref;
    const user = userDoc.data() || {};
    const userID = userDoc.id;

    // -----------------------------
    // Opt-out (NEW SCHEMA)
    // -----------------------------
    if (user.TPNotifications?.receiveMassEmails === false) {
      return { success: false, error: "User opted out" };
    }

    // -----------------------------
    // Cooldown (NEW SCHEMA)
    // -----------------------------
    const lastSent = user.TPNotifications?.lastEmailSentAt?.toMillis?.() || 0;
    const nowMs = admin.firestore.Timestamp.now().toMillis();

    if (nowMs - lastSent < 60000) {
      return { success: true, skipped: true };
    }

    // -----------------------------
    // Build payload (NEW SCHEMA)
    // -----------------------------
    const name =
      clean(user.TPIdentity?.displayName) ||
      clean(user.TPIdentity?.name) ||
      "Friend";

    const resendToken = clean(user.TPIdentity?.resendToken);

    const unsubscribeUrl = resendToken
      ? `https://www.tropicpulse.bze.bz/unsubscribe?token=${encodeURIComponent(
          resendToken
        )}`
      : `https://www.tropicpulse.bze.bze.bz/unsubscribe`;

    const finalPayload = {
      ...payload,
      name,
      userID,
      adminUser: "Automate",
      unsubscribeUrl,
      logId: payload.logId || null
    };

    // -----------------------------
    // Render template
    // -----------------------------
    const template = emailTemplates[emailType];

    let html, subject;
    try {
      html = template.html(finalPayload);
      subject =
        typeof template.subject === "function"
          ? template.subject(finalPayload)
          : template.subject;
    } catch (err) {
      return {
        success: false,
        error: "Template rendering error: " + err.message
      };
    }

    const finalHeaders =
      template.headers ||
      (template.important
        ? {
            "X-Priority": "1",
            "X-MSMail-Priority": "High",
            Importance: "high"
          }
        : {});

    // -----------------------------
    // Send email
    // -----------------------------
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: "Sales@TropicPulse.bz",
        pass: EMAIL_PASSWORD.value()
      }
    });

    await transporter.sendMail({
      from: `"Tropic Pulse" <Sales@TropicPulse.bz>`,
      to: email,
      bcc: "FordFamilyDelivery@gmail.com",
      subject,
      html,
      headers: finalHeaders
    });

    // -----------------------------
    // Update user (NEW SCHEMA)
    // -----------------------------
    await userRef.update({
      "TPNotifications.lastEmailSentAt":
        admin.firestore.FieldValue.serverTimestamp()
    });

    // -----------------------------
    // Log email
    // -----------------------------
    const ts = admin.firestore.FieldValue.serverTimestamp();
    const ref = await db.collection("EmailLogs").add({
      date: ts,
      to: email,
      type: emailType,
      emailType,
      payload: finalPayload,
      html,
      subject,
      adminUser: "Automate",
      triggeredBy: "Automate",
      triggerSource: "sendEmailToUser",
      status: "Sent",
      name,
      createdAt: ts,
      timestamp: ts
    });

    await ref.update({ logId: ref.id });

    return { success: true };
  } catch (err) {
    console.error("❌ sendEmailToUser error:", err);
    return { success: false, error: err.message };
  }
}


function currency(amount, displayCurrency = "$") {
  let raw = String(amount || "").replace(/BZ?\$|\$/g, "").trim();
  const num = Number(raw);
  const safe = isNaN(num) ? "0.00" : num.toFixed(2);

  let cur = String(displayCurrency || "$").trim().toUpperCase();
  cur = cur === "USD" || cur === "$" || cur === "US$" ? "$" : "BZ$";

  return `${cur}${safe}`;
}


function formatDisplayAmount(displayCurrency, amount) {
  const safeAmount = Number(amount);
  const finalAmount = isNaN(safeAmount) ? "0.00" : safeAmount.toFixed(2);

  let cur = String(displayCurrency || "$").trim().toUpperCase();
  cur = cur === "USD" || cur === "$" || cur === "US$" ? "$" : "BZ$";

  return currency(finalAmount, cur);
}

//
// ------------------------------------------------------
// SIDE FUNCTION: sendMASSemail (original logic preserved)
// ------------------------------------------------------
//

/* ===========================
   BROADCAST EMAIL FOR NEW STUFF
=========================== */
async function sendMASSemail(reqBody) {
  log("🔵 [sendMASSemail] START");

  const ACCOUNT_SID_VALUE = ACCOUNT_SID.value();
  const AUTH_TOKEN_VALUE = AUTH_TOKEN.value();
  const MESSAGING_SERVICE_SID_VALUE = MESSAGING_SERVICE_SID.value();
  const EMAIL_PASSWORD_VALUE = EMAIL_PASSWORD.value();
  const JWT_SECRET_VALUE = JWT_SECRET.value();

  const normalizeEmail = (v) =>
    typeof v === "string" ? v.trim().toLowerCase() : null;

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

  const clean = (v, fallback = null) => {
    if (isGarbage(v)) return fallback;
    return String(v).trim();
  };

  const requiredFields = {
    newEvent: [
      "title",
      "summary",
      "description",
      "Fromdate",
      "Todate",
      "Fromtime",
      "Totime",
      "Venue",
      "eventID",
      "logId",
      "unsubscribeUrl",
      "language",
      "Category",
      "Price",
      "ImageUrl",
      "OwnerName",
      "OwnerBusiness",
      "OwnerEmail"
    ],
    newBusiness: [
      "busname",
      "summary",
      "description",
      "busemail",
      "location",
      "date",
      "busID",
      "logId",
      "unsubscribeUrl",
      "category",
      "phone",
      "website",
      "imageUrl",
      "ownerName",
      "ownerEmail"
    ]
  };

  function validatePayload(emailType, payload) {
    const missing = requiredFields[emailType].filter(
      (field) => payload[field] === undefined || payload[field] === ""
    );
    if (missing.length > 0) {
      throw new Error(
        `Missing required fields for ${emailType}: ${missing.join(", ")}`
      );
    }
  }

  try {
    const useremail = normalizeEmail(reqBody.useremail);
    const emailType = clean(reqBody.emailType, null);
    let payload = reqBody.payload || {};

    const eventID = clean(reqBody.eventID, null);
    const busID = clean(reqBody.busID, null);

    if (!useremail) {
      return { success: false, error: "Missing useremail" };
    }

    if (!emailType) {
      return { success: false, error: "Missing emailType" };
    }

    const allowedTypes = ["newEvent", "newBusiness"];
    if (!allowedTypes.includes(emailType)) {
      return {
        success: false,
        message: `Email type '${emailType}' is not supported.`
      };
    }

    // ------------------------------------
    // Load initiating user (NEW SCHEMA)
    // ------------------------------------
    const userSnap = await admin
      .firestore()
      .collection("Users")
      .where("TPIdentity.email", "==", useremail)
      .limit(1)
      .get();

    if (userSnap.empty) {
      log("❌ User not found:", useremail);
      return { success: false, error: "user_not_found" };
    }

    const initiatingUserDoc = userSnap.docs[0];
    const initiatingUser = initiatingUserDoc.data() || {};

    // ------------------------------------
    // EVENT PAYLOAD (NEW SCHEMA)
    // ------------------------------------
    if (emailType === "newEvent") {
      if (!eventID) {
        return { success: false, error: "Missing eventID" };
      }

      const eventDoc = await admin
        .firestore()
        .collection("Events")
        .doc(eventID)
        .get();

      if (!eventDoc.exists) {
        return { success: false, error: "Event not found" };
      }

      const ev = eventDoc.data() || {};

      payload.title = clean(ev.title, "");
      payload.summary = clean(ev.summary, "");
      payload.description = clean(ev.description, "");
      payload.language = clean(ev.language, "");

      payload.Fromdate = ev.Fromdate || "";
      payload.Todate = ev.Todate || "";
      payload.Fromtime = clean(ev.Fromtime, "");
      payload.Totime = clean(ev.Totime, "");
      payload.Venue = clean(ev.Venue ?? ev.resolvedName, "");

      payload.eventID = eventID;
      payload.Category = clean(ev.category, "");
      payload.Price = clean(ev.price, "");
      payload.ImageUrl = clean(ev.mainImage ?? ev.images?.[0] ?? "", "");

      payload.OwnerName = clean(ev.ownerName, "");
      payload.OwnerBusiness = clean(ev.ownerBusiness, "");
      payload.OwnerEmail = clean(ev.ownerEmail, "");
    }

    // ------------------------------------
    // BUSINESS PAYLOAD (NEW SCHEMA)
    // ------------------------------------
    if (emailType === "newBusiness") {
      if (!busID) {
        return { success: false, error: "Missing busID" };
      }

      const busDoc = await admin
        .firestore()
        .collection("Businesses")
        .doc(busID)
        .get();

      if (!busDoc.exists) {
        return { success: false, error: "Business not found" };
      }

      const bus = busDoc.data() || {};

      payload.busname = clean(bus.busname, "");
      payload.summary = clean(bus.summary, "");
      payload.description = clean(bus.description, "");
      payload.location = clean(bus.location, "");
      payload.busemail = clean(bus.busemail, "");

      let date = bus.date;
      if (date instanceof admin.firestore.Timestamp) {
        payload.date = date.toDate().toISOString();
      } else if (date instanceof Date) {
        payload.date = date.toISOString();
      } else if (typeof date === "string") {
        payload.date = new Date(date).toISOString();
      } else {
        payload.date = new Date().toISOString();
      }

      payload.busID = busID;
      payload.category = clean(bus.category, "");
      payload.phone = clean(bus.phone, "");
      payload.website = clean(bus.website, "");
      payload.imageUrl = clean(bus.mainImage ?? bus.images?.[0] ?? "", "");

      payload.ownerName = clean(bus.ownerName, "");
      payload.ownerEmail = clean(bus.ownerEmail, "");
    }

    // ------------------------------------
    // LOG ID + UNSUBSCRIBE URL
    // ------------------------------------
    const ts = admin.firestore.Timestamp.now().toMillis();
    payload.logId = payload.logId || `${emailType}-${ts}`;
    payload.unsubscribeUrl = "/unsubscribe";

    validatePayload(emailType, payload);

    // ------------------------------------
    // BROADCAST LOOP (NEW SCHEMA)
    // ------------------------------------
    const usersSnapshot = await admin.firestore().collection("Users").get();
    const sendPromises = [];

    usersSnapshot.forEach((doc) => {
      const u = doc.data() || {};

      const TPIdentity = u.TPIdentity || {};
      const TPNotifications = u.TPNotifications || {};

      const uEmail = normalizeEmail(TPIdentity.email);
      if (!uEmail) return;

      if (TPNotifications.receiveMassEmails === false) return;

      let resendToken = TPIdentity.resendToken;

      if (!resendToken) {
        resendToken = crypto.randomUUID();
        doc.ref.update({
          "TPIdentity.resendToken": resendToken
        }).catch((err) => {
          error("⚠️ Failed to set TPIdentity.resendToken for", uEmail, err.message);
        });
      }

      const userPayload = {
        ...payload,
        email: uEmail,
        userID: doc.id,
        unsubscribeUrl: `/unsubscribe?token=${encodeURIComponent(
          resendToken
        )}`
      };

      sendPromises.push(
        sendEmailToUser(uEmail, emailType, userPayload).catch((err) => {
          error("❌ Failed to send to:", uEmail, err.message);
        })
      );
    });

    await Promise.all(sendPromises);

    return {
      success: true,
      message: `Broadcast email sent to ${usersSnapshot.size} users.`
    };

  } catch (err) {
    error("❌ broadcastEmail error:", err);
    return {
      success: false,
      error: "Broadcast email failed",
      details: err.message || String(err)
    };
  }
}
//=======================================================================================================
//=======================================================================================================
// ----------------------
// EMAIL TEMPLATES
// ----------------------
// Each template receives a payload object and returns HTML.
// You can expand these with your full branded HTML later.

const emailTemplates = {
newUser: {
  subject: () => "Welcome to Tropic Pulse!",
  important: true,
  html: (payload) => {
    const { logId } = payload;

    const trackingPixel =
      logId && logId !== "Preview Mode"
        ? `<img src="https://www.tropicpulse.bze.bze.bz/emailopen?logId=${encodeURIComponent(
            logId
          )}" width="1" height="1" alt="" style="display:block; opacity:0;">`
        : "";

    return `<!DOCTYPE html>
<html>
  <body style="margin:0; padding:0; background-color:#f4f4f4; font-family:Arial, sans-serif;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" 
           style="background-color:#f4f4f4; padding:40px 0;">
      <tr>
        <td align="center" style="background-color:#f4f4f4;">

          <!-- Main Card -->
          <table width="600" border="0" cellspacing="0" cellpadding="0" 
                 style="background:#ffffff; border-radius:14px; overflow:hidden;">

            <!-- BIG HEADER IMAGE -->
            <tr>
              <td>
                <img src="https://www.tropicpulse.bze.bze.bz/Welcome.png?v8"
                     alt="Tropic Pulse Header"
                     width="600"
                     style="display:block; width:100%; max-width:600px;">
              </td>
            </tr>

            <!-- Inner Padding -->
            <tr>
              <td style="padding:30px;">

                <!-- Welcome Title -->
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td align="center" 
                        style="font-size:28px; font-weight:bold; color:#222;">
                      Welcome to Tropic Pulse!
                    </td>
                  </tr>

                  <tr>
                    <td align="center" 
                        style="font-size:16px; color:#666; padding-top:8px;">
                      Your account has been successfully created!
                    </td>
                  </tr>

                  <!-- Toucan Image -->
                  <tr>
                    <td align="center" style="padding:25px 0;">
                      <img src="https://www.tropicpulse.bze.bz/ToucanLogo-Mini.png?v8"
                           alt="Tropic Pulse Toucan"
                           width="180"
                           style="display:block; border-radius:12px;">
                    </td>
                  </tr>

                  <!-- Message -->
                  <tr>
                    <td align="center" 
                        style="font-size:18px; color:#555; padding:25px 20px 10px 20px; line-height:24px;">
                      You’re all set! Your Tropic Pulse account is ready to use.  
                      If you plan to accept payments for Tropic Pulse services,  
                      please check your email for important setup instructions.
                    </td>
                  </tr>

                  <!-- Social Media Section -->
                  <tr>
                    <td align="center" style="padding-top:20px;">
                      <div style="font-size:14px; color:#555; margin-bottom:10px;">
                        Enjoy these moments! Share your successes with Tropic Pulse on social media.
                      </div>
                      <a href="https://linktr.ee/tropicpulse" target="_blank">
                        <img src="../PULSE-UI/_PICTURES/SocialMedia.png?v8"
                             alt="Social Media Icons"
                             width="180"
                             style="display:block; margin:auto;">
                      </a>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>

          </table>

          ${trackingPixel}

        </td>
      </tr>
    </table>
  </body>
</html>`;
  }
},

  loyalty: {
  subject: (payload) => "Tropic Pulse: My Pulse Loyalty Enrollment Setup!",
  important: true,
  html: (payload) => {
    const { name, email, logId } = payload;

    const trackingPixel =
      logId && logId !== "Preview Mode"
        ? `<img src="../PULSE-UI/_PICTURES/emailopen?logId=${encodeURIComponent(
            logId
          )}" width="1" height="1" alt="" style="opacity:0; width:1px; height:1px;">`
        : "";

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>My Pulse Loyalty Enrollment Setup</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f3f5f7;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #1f2933;
    }
    .wrapper {
      width: 100%;
      background-color: #f3f5f7;
      padding: 24px 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(15, 23, 42, 0.12);
    }
    .header {
      background: linear-gradient(135deg, #00c2a8, #00a0ff);
      padding: 24px 24px 20px;
      text-align: left;
      color: #ffffff;
    }
    .logo-row {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .logo-circle {
      width: 70px;
      height: 70px;
      border-radius: 999px;
      background: none !important;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
    }
    .brand-text {
      font-size: 18px;
      font-weight: 600;
      letter-spacing: 0.03em;
    }
    .tagline {
      font-size: 12px;
      opacity: 0.9;
    }
    .header-title {
      margin-top: 18px;
      font-size: 22px;
      font-weight: 700;
    }
    .header-subtitle {
      margin-top: 6px;
      font-size: 14px;
      opacity: 0.95;
    }
    .content {
      padding: 24px 24px 8px;
      font-size: 14px;
      line-height: 1.6;
    }
    .content h2 {
      font-size: 20px;
      margin: 0 0 12px;
      color: #111827;
    }
    .pill {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 999px;
      background-color: #ecfdf5;
      color: #047857;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      margin-bottom: 10px;
    }
    .highlight-box {
      margin: 16px 0;
      padding: 12px 14px;
      border-radius: 12px;
      background-color: #f9fafb;
      border: 1px solid #e5e7eb;
    }
    .highlight-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #6b7280;
      margin-bottom: 4px;
    }
    .highlight-value {
      font-size: 13px;
      font-weight: 600;
      color: #111827;
    }
    .button-row {
      margin: 22px 0 10px;
      text-align: left;
    }
    .primary-button {
      display: inline-block;
      padding: 10px 18px;
      border-radius: 999px;
      background: linear-gradient(135deg, #00c2a8, #00a0ff);
      color: #ffffff !important;
      font-size: 13px;
      font-weight: 600;
      text-decoration: none;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }
    .secondary-note {
      font-size: 12px;
      color: #6b7280;
      margin-top: 8px;
    }
    .list-title {
      margin-top: 18px;
      font-size: 13px;
      font-weight: 600;
      color: #111827;
    }
    .list {
      margin: 8px 0 0;
      padding-left: 18px;
      font-size: 13px;
      color: #4b5563;
    }
    .footer {
      padding: 14px 24px 20px;
      font-size: 11px;
      color: #9ca3af;
      text-align: left;
      border-top: 1px solid #e5e7eb;
      background-color: #f9fafb;
    }
    .footer strong {
      color: #4b5563;
    }
    .footer-links {
      margin-top: 6px;
    }
    .footer-links span {
      margin-right: 10px;
    }
    @media (max-width: 600px) {
      .container {
        border-radius: 0;
      }
      .header, .content, .footer {
        padding-left: 18px;
        padding-right: 18px;
      }
    }
  </style>
</head>
<body>
  <div class="wrapper">
    <div class="container">
      <div class="header">
        <div class="logo-row">
          <div style="text-align:center; width:100%;">
            <div style="display:inline-block; text-align:center;">
              <div class="logo-circle" style="margin:0 auto 10px auto;">
                <img 
                  src="../PULSE-UI/_PICTURES/ToucanLogo-Mini.png?v8"
                  alt="Tropic Pulse Toucan"
                  width="60"
                  style="display:block; border-radius:50%;">
              </div>
              <div>
                <div class="brand-text">TROPIC PULSE</div>
                <div class="tagline">Enjoy these moments.</div>
              </div>
            </div>
          </div>
        </div>

        <div style="text-align:center; width:100%;">
          <div class="header-title" style="display:inline-block; text-align:center;">My Pulse Loyalty Enrollment</div>
          <div class="header-subtitle" style="display:inline-block; text-align:center;">
            Your rewards journey is ready—just complete your enrollment in the app.
          </div>
        </div>
      </div>

      <div class="content">
        <div style="text-align:center; width:100%;">
          <span class="pill">My Pulse Loyalty</span>
          <h2>Your Pulse Loyalty Enrollment</h2>
        </div>

        <p>Hi ${name || "there"},</p>

        <p>
          Your <strong>Pulse Loyalty</strong> setup is ready. Open the
          <strong>Tropic Pulse</strong> app and complete your enrollment in
          <strong>My Pulse Loyalty</strong> to start earning rewards on every eligible order and delivery.
        </p>

        <div class="highlight-box">
          <div class="highlight-label">Account email</div>
          <div class="highlight-value">${email || "N/A"}</div>
        </div>

        <div class="button-row">
          <div class="thebutton" style="text-align:center;">
            <a class="primary-button" href="https://linktr.ee/tropicpulse">
              Open Tropic Pulse App
            </a>
          </div>
          <div class="secondary-note">
            If the button doesn’t work, just open the Tropic Pulse app on your device and look for
            <strong>My Pulse Loyalty</strong> in the menu.
          </div>
        </div>

        <div class="list-title">Once you complete enrollment, you can:</div>
        <ul class="list">
          <li>Earn rewards automatically on eligible orders and deliveries</li>
          <li>View your Pulse Loyalty Member Card in the app</li>
          <li>Track your progress toward future perks and offers</li>
        </ul>

        <p style="margin-top: 18px;">
          If you didn’t request this or believe this email was sent in error, you can safely ignore it—your account
          will remain unchanged.
        </p>

        <p style="margin-top: 18px;">
          Welcome to the island’s most rewarding experience.
        </p>

        <p>
          <strong>Tropic Pulse</strong><br/>
          Enjoy these moments.
        </p>
      </div>

      <div class="footer">
        <div><strong>Tropic Pulse</strong> — San Pedro, Ambergris Caye</div>
        <div class="footer-links">
          <span>App: Tropic Pulse</span>
          <span>Category: My Pulse Loyalty</span>
        </div>
        <div style="margin-top: 6px;">
          You’re receiving this email because a Pulse Loyalty enrollment was started using this address.
        </div>
      </div>
    </div>

    ${trackingPixel}
  </div>
</body>
</html>`;
  }
},

  sendPayout: {
    subject: (payload) => {
  const { orderID, delivererEmail } = payload;
return `Tropic Pulse: Payout for your Delivery: ${orderID}`;
},
    html: (payload) => {
    const {payoutAmount, stripeAccountID, orderID, delivererEmail, pendingBalance, availableBalance,  displayCurrency, transferCurrency, displayAmount, logId } = payload;
    let formatted = displayAmount || payoutAmount;
    
    const payoutAmountFormatted = formatDisplayAmount(displayCurrency,formatted);
    const formattedavailable = formatDisplayAmount(displayCurrency,availableBalance);
    const formattedpending = formatDisplayAmount(displayCurrency,pendingBalance);
    const trackingPixel =
      logId && logId !== "Preview Mode"
        ? `<img src="../PULSE-UI/_PICTURES/emailopen?logId=${encodeURIComponent(
            logId
          )}" width="1" height="1" alt="" style="opacity:0; width:1px; height:1px;">`
        : "";
return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Your Payout Has Been Sent</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f3f5f7;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #1f2933;
    }
    .wrapper {
      width: 100%;
      background-color: #f3f5f7;
      padding: 24px 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(15, 23, 42, 0.12);
    }
    .header {
      background: linear-gradient(135deg, #00c2a8, #00a0ff);
      padding: 24px 24px 20px;
      text-align: center;
      color: #ffffff;
    }
    .brand-text {
      font-size: 18px;
      font-weight: 600;
      letter-spacing: 0.03em;
    }
    .tagline {
      font-size: 12px;
      opacity: 0.9;
    }
    .header-title {
      margin-top: 18px;
      font-size: 22px;
      font-weight: 700;
    }
    .header-subtitle {
      margin-top: 6px;
      font-size: 14px;
      opacity: 0.95;
    }
    .content {
      padding: 24px 24px 8px;
      font-size: 14px;
      line-height: 1.6;
    }
    .highlight-box {
      margin: 16px 0;
      padding: 12px 14px;
      border-radius: 12px;
      background-color: #f9fafb;
      border: 1px solid #e5e7eb;
    }
    .highlight-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #6b7280;
      margin-bottom: 4px;
    }
    .highlight-value {
      font-size: 13px;
      font-weight: 600;
      color: #111827;
    }
    .footer {
      padding: 14px 24px 20px;
      font-size: 11px;
      color: #9ca3af;
      text-align: left;
      border-top: 1px solid #e5e7eb;
      background-color: #f9fafb;
    }
    .footer strong {
      color: #4b5563;
    }
  </style>
</head>

<body>
  <div class="wrapper">
    <div class="container">

      <!-- HEADER -->
      <div class="header">

        <!-- Logo -->
        <img 
          src="../PULSE-UI/_PICTURES/ToucanLogo-Mini.png?v8"
          alt="Tropic Pulse Logo"
          width="70"
          height="70"
          style="display:block; margin:0 auto 14px auto; border-radius:50%; object-fit:cover;"
        >

        <div class="brand-text">TROPIC PULSE</div>
        <div class="tagline">Enjoy these moments.</div>

        <div class="header-title">Your Payout Has Been Sent!</div>
        <div class="header-subtitle">
          Your earnings have been transferred to your Stripe balance.
        </div>
      </div>

      <!-- CONTENT -->
      <div class="content">

        <!-- DETAILS -->
        <div class="highlight-box">
          <div class="highlight-label">Order ID</div>
          <div class="highlight-value">${orderID}</div>
        </div>

        <div class="highlight-box">
          <div class="highlight-label">Deliverer Email</div>
          <div class="highlight-value">${delivererEmail}</div>
        </div>

        <div class="highlight-box">
          <div class="highlight-label">Payout Amount</div>
          <div class="highlight-value" style="font-size:20px; font-weight:700;">
            ${payoutAmountFormatted}
          </div>
        </div>

        <div class="highlight-box">
          <div class="highlight-label">Current Wallet Balance</div>
          <div class="highlight-value">${formattedavailable}</div>
        </div>

        <div class="highlight-box">
          <div class="highlight-label">Pending Payments to Bank</div>
          <div class="highlight-value" style="color:green;">
            ${formattedpending}
          </div>
        </div>

        <p style="margin-top: 18px;">
          Your payout has been successfully deposited into your Stripe balance.  
          Funds will become available based on your Stripe payout schedule.
        </p>

        <p>
          <strong>Tropic Pulse</strong><br/>
          Enjoy these moments.
        </p>
      </div>

      <!-- FOOTER -->
      <div class="footer">
        <div><strong>Tropic Pulse</strong> — San Pedro, Ambergris Caye</div>
        <div style="margin-top: 6px;">
          You’re receiving this email because a payout was processed for your delivery.
        </div>
      </div>

    </div>

    ${trackingPixel}

  </div>
</body>
</html>`;
}
},

  stripeOnboarding: {
  subject: (payload) => "Tropic Pulse: Getting Paid Soon?!",
  important: true,
  html: (payload) => {
    const { email, getPaidLink, reSendLink, logId } = payload;

    const trackingPixel =
      logId && logId !== "Preview Mode"
        ? `<img src="/_PICTURES/emailopen?logId=${encodeURIComponent(
            logId
          )}" width="1" height="1" alt="" style="opacity:0; display:block;">`
        : "";

    return `<!DOCTYPE html>
<html>
  <body style="margin:0; padding:0; background-color:#f4f4f4; font-family:Arial, sans-serif;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" 
           style="background-color:#f4f4f4; padding:40px 0;">
      <tr>
        <td align="center">

          <!-- Main Card -->
          <table width="600" border="0" cellspacing="0" cellpadding="0" 
                 style="background:#ffffff; border-radius:14px; overflow:hidden;">

            <!-- Inner Padding -->
            <tr>
              <td style="padding:30px;">

                <!-- Header Text -->
                <table width="100%" border="0" cellspacing="0" cellpadding="0">
                  <tr>
                    <td align="center" 
                        style="font-size:28px; font-weight:bold; color:#222;">
                      Stripe + Tropic Pulse
                    </td>
                  </tr>

                  <tr>
                    <td align="center" 
                        style="font-size:18px; color:#666; padding-top:8px;">
                      Automated, Instant Payments for Vendors/Deliverers!
                    </td>
                  </tr>

                  <!-- Toucan Image -->
                  <tr>
                    <td align="center" style="padding:25px 0;">
                      <img src="/_PICTURES/ToucanLogo-Mini.png?v8"
                           alt="Tropic Pulse Toucan"
                           width="220"
                           style="display:block; border-radius:12px;">
                    </td>
                  </tr>

                  <!-- Message -->
                  <tr>
                    <td align="center" 
                        style="font-size:16px; color:#444; padding:0 20px 20px 20px; line-height:24px;">
                      To start receiving automated payouts through Tropic Pulse, please complete your
                      Stripe payment setup. This ensures we know exactly where to send your earnings.
                    </td>
                  </tr>

                  <!-- Get Paid Button -->
                  <tr>
                    <td align="center" style="padding-bottom:20px;">
                      <a href="${getPaidLink}"
                         style="background-color:#00a86b;
                                color:#ffffff;
                                padding:14px 32px;
                                text-decoration:none;
                                font-size:18px;
                                font-weight:bold;
                                border-radius:8px;
                                display:inline-block;">
                        Get Paid
                      </a>
                    </td>
                  </tr>

                  <!-- Expiration Note -->
                  <tr>
                    <td align="center" 
                        style="font-size:14px; color:#e63946; padding:0 20px 20px 20px; line-height:20px;">
                      Your Stripe payment link expires in 24 hours.  
                      If it expires or you need a new one, click below to resend your setup link.
                    </td>
                  </tr>

                  <!-- Resend Link Button -->
                  <tr>
                    <td align="center" style="padding-bottom:30px;">
                      <a href="${reSendLink}"
                         style="background-color:#007bff;
                                color:#ffffff;
                                padding:12px 28px;
                                text-decoration:none;
                                font-size:16px;
                                font-weight:bold;
                                border-radius:8px;
                                display:inline-block;">
                        Resend Stripe Link
                      </a>
                    </td>
                  </tr>

                  <!-- Footer Note -->
                  <tr>
                    <td align="center" 
                        style="font-size:12px; color:#777; line-height:18px; padding:0 20px;">
                      To receive payments through Tropic Pulse, you must complete your Stripe setup 
                      before accepting or delivering any orders.
                    </td>
                  </tr>

                  <!-- Social Media Section -->
                  <tr>
                    <td align="center" style="padding-top:30px;">
                      <div style="font-size:14px; color:#555; margin-bottom:10px;">
                        Enjoy these moments! Share your successes with Tropic Pulse on social media.
                      </div>
                      <a href="https://linktr.ee/tropicpulse" target="_blank">
                        <img src="/_PICTURES/SocialMedia.png?v8"
                             alt="Social Media Icons"
                             width="180"
                             style="display:block; margin:auto;">
                      </a>
                    </td>
                  </tr>

                </table>
              </td>
            </tr>

          </table>
          <!-- End Main Card -->

        </td>
      </tr>
    </table>

    ${trackingPixel}

  </body>
</html>`;
  }
},

  resendStripeLink: {
  subject: (payload) => "Tropic Pulse: Stripe Payments Link Resent!",
  important: true,
  html: (payload) => {
    const { email, getPaidLink, reSendLink, logId } = payload;

    const trackingPixel =
      logId && logId !== "Preview Mode"
        ? `<img src="/_PICTURES/emailopen?logId=${encodeURIComponent(
            logId
          )}" width="1" height="1" alt="" style="opacity:0; display:block;">`
        : "";

    return `<!DOCTYPE html>
<html>
  <body style="margin:0; padding:0; background-color:#f4f4f4; font-family:Arial, sans-serif;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" 
           style="background-color:#f4f4f4; padding:40px 0;">
      <tr>
        <td align="center">

          <!-- Main Card -->
          <table width="600" border="0" cellspacing="0" cellpadding="0" 
                 style="background:#ffffff; border-radius:14px; padding:30px;">

            <!-- Header -->
            <tr>
              <td align="center" 
                  style="font-size:28px; font-weight:bold; color:#222;">
                Tropic Pulse
              </td>
            </tr>

            <tr>
              <td align="center" 
                  style="font-size:18px; color:#666; padding-top:8px;">
                Your Stripe Payments Link Has Been Resent!
              </td>
            </tr>

            <!-- Toucan Image -->
            <tr>
              <td align="center" style="padding:25px 0;">
                <img src="/_PICTURES/ToucanLogo-Mini.png?v8"
                     alt="Tropic Pulse Toucan"
                     width="220"
                     style="display:block; border-radius:12px;">
              </td>
            </tr>

            <!-- Message -->
            <tr>
              <td align="center" 
                  style="font-size:16px; color:#444; padding:0 20px 20px 20px; line-height:24px;">
                We’ve generated a fresh Stripe onboarding link so you can complete your 
                payment setup and start receiving payouts through Tropic Pulse.
              </td>
            </tr>

            <!-- Get Paid Button -->
            <tr>
              <td align="center" style="padding-bottom:20px;">
                <a href="${getPaidLink}"
                   style="background-color:#00a86b;
                          color:#ffffff;
                          padding:14px 32px;
                          text-decoration:none;
                          font-size:18px;
                          font-weight:bold;
                          border-radius:8px;
                          display:inline-block;">
                  Get Paid
                </a>
              </td>
            </tr>

            <!-- Expiration Note -->
            <tr>
              <td align="center" 
                  style="font-size:14px; color:#e63946; padding:0 20px 20px 20px; line-height:20px;">
                Your Stripe payment link expires in 24 hours.  
                If it expires or you need a new one, click below to resend your setup link.
              </td>
            </tr>

            <!-- Resend Link Button -->
            <tr>
              <td align="center" style="padding-bottom:30px;">
                <a href="${reSendLink}"
                   style="background-color:#007bff;
                          color:#ffffff;
                          padding:10px 26px;
                          text-decoration:none;
                          font-size:14px;
                          border-radius:6px;
                          display:inline-block;">
                  Resend Stripe Link
                </a>
              </td>
            </tr>

            <!-- Footer Note -->
            <tr>
              <td align="center" 
                  style="font-size:12px; color:#777; line-height:18px; padding:0 20px;">
                To receive payments through Tropic Pulse, you must complete your Stripe setup 
                before accepting or delivering any orders.
              </td>
            </tr>

            <!-- Social Media Section -->
            <tr>
              <td align="center" style="padding-top:30px;">
                <div style="font-size:14px; color:#555; margin-bottom:10px;">
                  Enjoy these moments! Share your successes with Tropic Pulse on social media.
                </div>
                <a href="https://linktr.ee/tropicpulse" target="_blank">
                  <img src="https://www.tropicpulse.bze.bz/SocialMedia.png?v8"
                       alt="Social Media Icons"
                       width="180"
                       style="display:block; margin:auto;">
                </a>
              </td>
            </tr>

          </table>
          <!-- End Main Card -->

        </td>
      </tr>
    </table>

    ${trackingPixel}

  </body>
</html>`;
  }
},

  pulsePointRedemption: {
  subject: (payload) => {
    const { points } = payload;
    return `Redemption Requested: ${points} Pulse Points Redemption`;
  },
  important: true,
  html: (payload) => {
    const { 
      name, 
      email, 
      points, 
      availableBalance, 
      pendingBalance, 
      displayCurrency, 
      transferCurrency, 
      displayAmount, 
      logId 
    } = payload;

    const pointToMoney = points / 100;
    let formatted = pointToMoney || displayAmount;

    const payoutAmountFormatted = formatDisplayAmount(displayCurrency, formatted);
    const formattedavailable = formatDisplayAmount(displayCurrency, availableBalance);
    const formattedpending = formatDisplayAmount(displayCurrency, pendingBalance);

    // Correct 1x1 tracking pixel
    const trackingPixel =
      logId && logId !== "Preview Mode"
        ? `<img src="https://www.tropicpulse.bze.bz/emailopen?logId=${encodeURIComponent(
            logId
          )}" width="1" height="1" alt="" style="opacity:0; display:block;">`
        : "";

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Pulse Points Redemption Requested</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f3f5f7;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #1f2933;
    }
    .wrapper {
      width: 100%;
      background-color: #f3f5f7;
      padding: 24px 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(15, 23, 42, 0.12);
    }
    .header {
      background: linear-gradient(135deg, #00c2a8, #00a0ff);
      padding: 24px 24px 20px;
      text-align: center;
      color: #ffffff;
    }
    .logo-circle {
      width: 70px;
      height: 70px;
      border-radius: 999px;
      background: none !important;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
    }
    .brand-text {
      font-size: 18px;
      font-weight: 600;
      letter-spacing: 0.03em;
    }
    .tagline {
      font-size: 12px;
      opacity: 0.9;
    }
    .header-title {
      margin-top: 18px;
      font-size: 22px;
      font-weight: 700;
    }
    .header-subtitle {
      margin-top: 6px;
      font-size: 14px;
      opacity: 0.95;
    }
    .content {
      padding: 24px 24px 8px;
      font-size: 14px;
      line-height: 1.6;
    }
    .pill {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 999px;
      background-color: #ecfdf5;
      color: #047857;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      margin-bottom: 10px;
    }
    .highlight-box {
      margin: 16px 0;
      padding: 12px 14px;
      border-radius: 12px;
      background-color: #f9fafb;
      border: 1px solid #e5e7eb;
    }
    .highlight-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #6b7280;
      margin-bottom: 4px;
    }
    .highlight-value {
      font-size: 13px;
      font-weight: 600;
      color: #111827;
    }
    .footer {
      padding: 14px 24px 20px;
      font-size: 11px;
      color: #9ca3af;
      text-align: left;
      border-top: 1px solid #e5e7eb;
      background-color: #f9fafb;
    }
    .footer strong {
      color: #4b5563;
    }
  </style>
</head>

<body>
  <div class="wrapper">
    <div class="container">

      <!-- HEADER -->
      <div class="header">

        <table width="100%" border="0" cellspacing="0" cellpadding="0">
          <tr>
            <td align="center">
              <img 
                src="https://www.tropicpulse.bze.bz/ToucanLogo-Mini.png?v8"
                alt="Tropic Pulse Logo"
                width="70"
                height="70"
                style="
                  display:block;
                  margin:0 auto 14px auto;
                  border-radius:50%;
                  object-fit:cover;
                ">
            </td>
          </tr>

          <tr>
            <td align="center">
              <img 
                src="/_PICTURES/CointoWallet.png?v8"
                alt="Coin to Wallet"
                width="120"
                style="display:block; margin:0 auto 10px auto;">
            </td>
          </tr>
        </table>

        <div class="brand-text">TROPIC PULSE</div>
        <div class="tagline">Enjoy these moments.</div>

        <div class="header-title">Pulse Points Redemption Requested</div>
        <div class="header-subtitle">
          Your Pulse Points will be converted into Wallet Balance within 24–48 hours.
        </div>
      </div>

      <!-- CONTENT -->
      <div class="content">

        <div style="text-align:center; width:100%;">
          <span class="pill">Pulse Points</span>
          <h2>Redeeming ${points} Pulse Points</h2>
        </div>

        <p>Hi ${name},</p>

        <p>
          Tropic Pulse has received your request to convert 
          <strong>${points}</strong> Pulse Points into Wallet Balance.
          Your payout will be processed shortly.
        </p>

        <div class="highlight-box">
          <div class="highlight-label">User Email</div>
          <div class="highlight-value">${email}</div>
        </div>

        <div class="highlight-box">
          <div class="highlight-label">Pulse Points Redeemed</div>
          <div class="highlight-value">${points}</div>
        </div>

        <div class="highlight-box">
          <div class="highlight-label">Estimated Wallet Balance Added</div>
          <div class="highlight-value" style="font-size:20px; font-weight:700;">
            ${payoutAmountFormatted}
          </div>
        </div>

        <p style="margin-top: 18px;">
          Your Pulse Points have already been deducted from your account.  
          You will receive a confirmation once the wallet balance is updated.
        </p>

        <p>
          <strong>Tropic Pulse</strong><br/>
          Enjoy these moments.
        </p>
      </div>

      <div class="footer">
        <div><strong>Tropic Pulse</strong> — San Pedro, Ambergris Caye</div>
        <div style="margin-top: 6px;">
          You’re receiving this email because a Pulse Points redemption was requested.
        </div>
      </div>

    </div>

    ${trackingPixel}

  </div>
</body>
</html>`;
  }
},

pulsePointsGifted: {
  subject: (payload) => {
    const { points } = payload;
    return `Tropic Pulse: You have Earned ${points} Pulse Points!`;
  },
  important: true,
  html: (payload) => {
    const { 
      name, 
      email, 
      points, 
      tipAmount, 
      itemPrice, 
      totalPrice, 
      taxAmount, 
      shipping, 
      payoutAmount, 
      logId 
    } = payload;

    const num = (v) => {
      if (v == null) return 0;
      const decoded = decodeURIComponent(String(v));
      if (decoded.includes("|")) {
        return decoded
          .split("|")
          .map(x => Number(x) || 0)
          .reduce((a, b) => a + b, 0);
      }
      const n = Number(decoded);
      return isNaN(n) ? 0 : Number(n.toFixed(2));
    };

    const tip = num(tipAmount ?? payload.ordertip ?? payload.tip);
    const priceRaw = itemPrice ?? payload.orderprice ?? payload.orderamount ?? null;
    const price = num(priceRaw);

    let payout = num(payoutAmount);
    if (payout === 0) {
      payout = Number((tip + price * 0.05).toFixed(2));
    }

    const formattedordertotal  = `BZ$${Number(totalPrice).toFixed(2)}`;
    const formattedorderamount = `BZ$${price.toFixed(2)}`;
    const formattedtip         = `BZ$${Number(tipAmount).toFixed(2)}`;
    const formattedtax         = `BZ$${Number(taxAmount).toFixed(2)}`;

    // ✅ Correct 1×1 tracking pixel
    const trackingPixel =
      logId && logId !== "Preview Mode"
        ? `<img src="/_PICTURES/emailopen?logId=${encodeURIComponent(
            logId
          )}" width="1" height="1" alt="" style="opacity:0; display:block;">`
        : "";

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Pulse Points Awarded</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body {
      margin: 0;
      padding: 0;
      background-color: #f3f5f7;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #1f2933;
    }
    .wrapper {
      width: 100%;
      background-color: #f3f5f7;
      padding: 24px 0;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 10px 30px rgba(15, 23, 42, 0.12);
    }
    .header {
      background: linear-gradient(135deg, #00c2a8, #00a0ff);
      padding: 24px 24px 20px;
      text-align: left;
      color: #ffffff;
    }
    .logo-row {
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .logo-circle {
      width: 70px;
      height: 70px;
      border-radius: 999px;
      background: none !important;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 22px;
    }
    .brand-text {
      font-size: 18px;
      font-weight: 600;
      letter-spacing: 0.03em;
    }
    .tagline {
      font-size: 12px;
      opacity: 0.9;
    }
    .header-title {
      margin-top: 18px;
      font-size: 22px;
      font-weight: 700;
    }
    .header-subtitle {
      margin-top: 6px;
      font-size: 14px;
      opacity: 0.95;
    }
    .content {
      padding: 24px 24px 8px;
      font-size: 14px;
      line-height: 1.6;
    }
    .pill {
      display: inline-block;
      padding: 4px 10px;
      border-radius: 999px;
      background-color: #ecfdf5;
      color: #047857;
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      margin-bottom: 10px;
    }
    .highlight-box {
      margin: 16px 0;
      padding: 12px 14px;
      border-radius: 12px;
      background-color: #f9fafb;
      border: 1px solid #e5e7eb;
    }
    .highlight-label {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #6b7280;
      margin-bottom: 4px;
    }
    .highlight-value {
      font-size: 13px;
      font-weight: 600;
      color: #111827;
    }
    .footer {
      padding: 14px 24px 20px;
      font-size: 11px;
      color: #9ca3af;
      text-align: left;
      border-top: 1px solid #e5e7eb;
      background-color: #f9fafb;
    }
    .footer strong {
      color: #4b5563;
    }
  </style>
</head>

<body>
  <div class="wrapper">
    <div class="container">

      <div class="header">
        <div class="logo-row">
          <div style="text-align:center; width:100%;">
            <div style="display:inline-block; text-align:center;">
              <div class="logo-circle" style="margin:0 auto 10px auto;">
                <img 
                  src="/_PICTURES/ToucanLogo-Mini.png?v8"
                  alt="Tropic Pulse Toucan"
                  width="60"
                  style="display:block; border-radius:50%;">
              </div>
              <div>
                <div class="brand-text">TROPIC PULSE</div>
                <div class="tagline">Enjoy these moments.</div>
              </div>
            </div>
          </div>
        </div>

        <div style="text-align:center; width:100%;">
          <div class="header-title">Pulse Points Awarded</div>
          <div class="header-subtitle">
            Your delivery has earned you new Pulse Points.
          </div>
        </div>
      </div>

      <div class="content">

        <div style="text-align:center; width:100%;">
          <span class="pill">Pulse Points</span>
          <h2>You’ve Earned ${points || "0"} Pulse Points</h2>
        </div>

        <p>Hi ${name || "there"},</p>

        <p>
          Thank you for your service. Tropic Pulse has credited 
          <strong><span style="font-size:16px;">${points || "0"}</span> Pulse Points</strong>
          to your profile for your recent delivery.
        </p>

        <div class="highlight-box">
          <div class="highlight-label">Deliverer Email</div>
          <div class="highlight-value">${email || "N/A"}</div>
        </div>

        <div class="highlight-box">
          <div class="highlight-label">Order Item Price</div>
          <div class="highlight-value">${formattedorderamount}</div>
        </div>

        <div class="highlight-box">
          <div class="highlight-label">Belize Tax (12.5%)</div>
          <div class="highlight-value">${formattedtax}</div>
        </div>

        <div class="highlight-box">
          <div class="highlight-label">Tip</div>
          <div class="highlight-value" style="font-weight:bold; font-size:22px;">
            ${formattedtip}
          </div>
        </div>

        <div class="highlight-box">
          <div class="highlight-label">Order Total Price</div>
          <div class="highlight-value">${formattedordertotal}</div>
        </div>

        <p style="margin-top: 18px;">
          Stay tuned—your Pulse Points will soon unlock rewards, perks, and exclusive benefits.
        </p>

        <p>
          <strong>Tropic Pulse</strong><br/>
          Enjoy these moments.
        </p>
      </div>

      <div class="footer">
        <div><strong>Tropic Pulse</strong> — San Pedro, Ambergris Caye</div>
        <div style="margin-top: 6px;">
          You’re receiving this email because a delivery was completed using this address.
        </div>
      </div>
    </div>

    ${trackingPixel}

  </div>
</body>
</html>`;
  }
},

rolechange: {
  subject: (payload) => "Tropic Pulse: Role Change Requested",
  important: true,
  html: (payload) => {
    const { role, payFrequency, payDay, logId } = payload;

    const trackingPixel =
      logId && logId !== "Preview Mode"
        ? `<img src="/_PICTURES/emailopen?logId=${encodeURIComponent(
            logId
          )}" width="1" height="1" alt="" style="opacity:0;display:block;">`
        : "";

    const payDayRow = payDay
      ? `<tr>
          <td style="padding:10px 12px;border:1px solid #e2e2e2;background:#fafafa;width:40%;font-size:13px;color:#777;">
            Payday
          </td>
          <td style="padding:10px 12px;border:1px solid #e2e2e2;font-size:13px;color:#222;">
            ${payDay}
          </td>
        </tr>`
      : "";

    return `<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#f5f5f5;font-family:Arial,Helvetica,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:20px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;border:1px solid #e2e2e2;">
            
            <!-- Logo -->
            <tr>
              <td align="center" style="padding:20px 20px 10px 20px;">
                <img src="/_PICTURES/ToucanLogo-Mini.png?v8" alt="Tropic Pulse" style="max-width:180px;height:auto;display:block;">
              </td>
            </tr>

            <!-- Title -->
            <tr>
              <td style="padding:10px 20px 20px 20px;">
                <h2 style="margin:0 0 10px 0;font-size:20px;color:#222;text-align:center;">
                  Role & Pay Frequency Updated
                </h2>
                <p style="margin:0 0 16px 0;font-size:14px;color:#555;text-align:center;">
                  Your account details have been updated. Please review the changes below.
                </p>

                <!-- Data Table -->
                <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">

                  <tr>
                    <td style="padding:10px 12px;border:1px solid #e2e2e2;background:#fafafa;width:40%;font-size:13px;color:#777;">
                      Role
                    </td>
                    <td style="padding:10px 12px;border:1px solid #e2e2e2;font-size:13px;color:#222;">
                      ${role}
                    </td>
                  </tr>

                  <tr>
                    <td style="padding:10px 12px;border:1px solid #e2e2e2;background:#fafafa;width:40%;font-size:13px;color:#777;">
                      Pay Frequency
                    </td>
                    <td style="padding:10px 12px;border:1px solid #e2e2e2;font-size:13px;color:#222;">
                      ${payFrequency.toUpperCase()}
                    </td>
                  </tr>

                  ${payDayRow}

                </table>

                <p style="margin:16px 0 0 0;font-size:12px;color:#999;text-align:center;">
                  If you believe this change is incorrect, please contact <a href="mailto:Sales@TropicPulse.bz">Tropic Pulse support</a>.
                </p>
              </td>
            </tr>

          </table>
        </td>
        ${trackingPixel}
      </tr>
    </table>
  </body>
</html>`;
  }
},

  newEvent: {
  subject: (payload) => "New Event on Tropic Pulse",
  important: false,
  html: (payload) => {
    const { title, Fromdate, Todate, Fromtime, Totime, Venue, description, summary, unsubscribeUrl, language, logId } = payload;

    const trackingPixel =
      logId && logId !== "Preview Mode"
        ? `<img src="/_PICTURES/emailopen?logId=${encodeURIComponent(
            logId
          )}" width="1" height="1" alt="" style="opacity:0;display:block;">`
        : "";

    return `<!DOCTYPE html>
<html>
  <body style="margin:0; padding:0; background-color:#f4f4f4; font-family:Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f7f7;padding:30px 0;font-family:'Poppins',sans-serif;">
  <tr>
    <td align="center">

      <!-- Main Container -->
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:18px;overflow:hidden;border:3px solid #000;">
        
        <!-- Header -->
        <tr>
          <td align="center" style="background:#ffff99;padding:30px 20px;">
            <img src="/_PICTURES/ToucanLogo-Mini.png?v8" 
                 alt="Tropic Pulse Toucan" width="120" style="display:block;margin-bottom:10px;border-radius:50%;border:3px solid #000;">
            <h1 style="margin:0;font-size:26px;color:#000;">A New Event Just Hit Tropic Pulse!</h1>
          </td>
        </tr>

        <!-- Cartoon Event Icon -->
        <tr>
          <td align="center" style="padding:20px;">
            <img src="/_PICTURES/NewEvent.png?v8" 
                 alt="New Event Illustration" width="160" 
                 style="display:block;margin:0 auto 10px;">
          </td>
        </tr>

        <!-- Content -->
        <tr>
          <td style="padding:0 30px 30px;color:#333;font-size:16px;line-height:1.6;">
            <p style="margin-top:0;">
              A brand‑new event has just been added to Tropic Pulse — and you won’t want to miss it!
            </p>

            <div style="background:#f0faff;border:2px solid #00aaff;border-radius:12px;padding:18px;margin:20px 0;">
              <p style="margin:0;font-size:18px;font-weight:600;color:#000;">${title}</p>
              <p style="margin:6px 0 0;font-size:15px;color:#555;">
                <strong>${summary}</strong>
              </p>

              <p style="margin:6px 0 0;font-size:15px;color:#555;">
                <span style="color:green; font-size:16px;">Date:</span>
                <strong>${Fromdate} → ${Todate}</strong><br>
                <span style="color:green; font-size:16px;">Time:</span>
                <strong>${Fromtime} → ${Totime}</strong>
              </p>
              <p style="margin:6px 0 0;font-size:15px;color:#555;">
                <span style="color:green; font-size:16px;">Venue:</span>
                <strong>${Venue}</strong>
              </p>
              <p style="margin:6px 0 0;font-size:15px;color:#555;">
                <span style="color:green; font-size:16px;">Language:</span>
                <strong>${language}</strong>
              </p>
              <p style="margin:6px 0 0;font-size:15px;color:#555;">
                <span style="color:green; font-size:16px;">Description:</span>
                <strong>${description}</strong>
              </p>
            </div>

            <p>
              Open the Tropic Pulse app to get full details and stay in the loop with everything happening around San Pedro!
            </p>

            <p style="margin-top:25px;text-align:center;">
              <a href="https://linktr.ee/tropicpulse" 
                 style="background:#00aaff;color:#fff;padding:14px 24px;border-radius:10px;text-decoration:none;font-weight:600;display:inline-block;">
                View Event on Tropic Pulse
              </a>
            </p>
          </td>
        </tr>

        <!-- Footer -->
<tr>
  <td align="center" style="background:#fafafa; padding:20px; font-size:13px; color:#777; line-height:1.5;">
    Powered by Tropic Pulse • San Pedro’s Everything App<br><br>
    <em>This email was automatically generated because a new event was added to Tropic Pulse.</em>
  </td>
</tr>

<!-- Unsubscribe Footer -->
<tr>
  <td align="center" style="padding:10px;">

    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td align="center">

          <table width="500" cellpadding="0" cellspacing="0" border="0"
                 style="background:#ffffff; border:2px solid #e5e5e5; border-radius:14px; padding:10px;">
            <tr>
              <td align="center" style="padding:10px;">

                <img 
                  src="/_PICTURES/Welcome.png?v8"
                  alt="Tropic Pulse Logo"
                  width="120"
                  style="display:block; margin-bottom:10px; border-radius:12px;"
                />

                <p style="font-family:Arial, sans-serif; font-size:14px; color:#555;">
                  Don’t want to receive these updates?
                </p>

                <a href="${unsubscribeUrl}"
                   style="font-family:Arial, sans-serif; font-size:14px; color:#4a90e2; text-decoration:none; font-weight:bold;">
                   Unsubscribe from Tropic Pulse mass emails
                </a>

              </td>
            </tr>
          </table>

        </td>
      </tr>
    </table>

  </td>
</tr>
      </table>
    </td>
    ${trackingPixel}
  </tr>
</table>
</body>
</html>`;
  }
},

  newBusiness: {
  subject: (payload) => "New Business on Tropic Pulse",
  important: false,
  html: (payload) => {
    const { busname, summary, description, busemail, link, location, unsubscribeUrl, logId } = payload;

    const trackingPixel =
      logId && logId !== "Preview Mode"
        ? `<img src="/_PICTURES/emailopen?logId=${encodeURIComponent(
            logId
          )}" width="1" height="1" alt="" style="opacity:0;display:block;">`
        : "";

    return `<!DOCTYPE html>
<html>
  <body style="margin:0; padding:0; background-color:#f4f4f4; font-family:Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f7f7f7;padding:30px 0;font-family:'Poppins',sans-serif;">
  <tr>
    <td align="center">

      <!-- Main Container -->
      <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:18px;overflow:hidden;border:3px solid #000;">
        
        <!-- Header -->
        <tr>
          <td align="center" style="background:#ffff99;padding:30px 20px;">
            <img src="/_PICTURES/ToucanLogo-Mini.png?v8" 
                 alt="Tropic Pulse Toucan" width="120" style="display:block;margin-bottom:10px;border-radius:50%;border:3px solid #000;">
            <h1 style="margin:0;font-size:26px;color:#000;">A New Business Just Joined Tropic Pulse!</h1>
          </td>
        </tr>

        <!-- Cartoon Building -->
        <tr>
          <td align="center" style="padding:20px;">
            <img src="/_PICTURES/NewBusiness.png?v8" 
                 alt="New Business Illustration" width="160" 
                 style="display:block;margin:0 auto 10px;">
          </td>
        </tr>

        <!-- Content -->
        <tr>
          <td style="padding:0 30px 30px;color:#333;font-size:16px;line-height:1.6;">
            <p style="margin-top:0;">
              We’re excited to welcome a brand‑new local business to the Tropic Pulse community!
            </p>

            <div style="background:#f0faff;border:2px solid #00aaff;border-radius:12px;padding:18px;margin:20px 0;">
              <p style="margin:0;font-size:18px;font-weight:600;color:#000;">${busname}</p>
              <p style="margin:6px 0 0;font-size:15px;color:#555;">
                <strong>${summary}</strong>
              </p>

              <p style="margin:6px 0 0;font-size:15px;color:#555;">
                <span style="color:green; font-size:16px;">Location:</span>
                <strong>${location}</strong>
              </p>

              <p style="margin:6px 0 0;font-size:15px;color:#555;">
                <span style="color:green; font-size:16px;">Description:</span>
                <strong>${description}</strong>
              </p>

              <p style="margin:6px 0 0;font-size:15px;color:#555;">
                <span style="color:green; font-size:16px;">Email:</span>
                <strong>${busemail}</strong>
              </p>
            </div>

            <p>
              Be sure to check them out on the Tropic Pulse app and show your support for another amazing local business in San Pedro!
            </p>

            <p style="margin-top:25px;text-align:center;">
              <a href="https://linktr.ee/tropicpulse" 
                 style="background:#00aaff;color:#fff;padding:14px 24px;border-radius:10px;text-decoration:none;font-weight:600;display:inline-block;">
                Explore on Tropic Pulse
              </a>
            </p>
          </td>
        </tr>

        <!-- Footer -->
<tr>
  <td align="center" style="background:#fafafa; padding:20px; font-size:13px; color:#777; line-height:1.5;">
    Powered by Tropic Pulse • San Pedro’s Everything App<br><br>
    <em>This email was automatically generated because a new business was added to Tropic Pulse.</em>
  </td>
</tr>

<!-- Unsubscribe Footer -->
<tr>
  <td align="center" style="padding:10px;">

    <table width="100%" cellpadding="0" cellspacing="0" border="0">
      <tr>
        <td align="center">

          <table width="500" cellpadding="0" cellspacing="0" border="0"
                 style="background:#ffffff; border:2px solid #e5e5e5; border-radius:14px; padding:10px;">
            <tr>
              <td align="center" style="padding:10px;">

                <img 
                  src="/_PICTURES/Welcome.png?v8"
                  alt="Tropic Pulse Logo"
                  width="120"
                  style="display:block; margin-bottom:10px; border-radius:12px;"
                />

                <p style="font-family:Arial, sans-serif; font-size:14px; color:#555;">
                  Don’t want to receive these updates?
                </p>

                <a href="${unsubscribeUrl}"
                   style="font-family:Arial, sans-serif; font-size:14px; color:#4a90e2; text-decoration:none; font-weight:bold;">
                   Unsubscribe from Tropic Pulse mass emails
                </a>

              </td>
            </tr>
          </table>

        </td>
      </tr>
    </table>

  </td>
</tr>
      </table>
    </td>
    ${trackingPixel}
  </tr>
</table>
</body>
</html>`;
  }
},

adminPulseRedemptionNotice: {
  subject: "Pulse Points Redemption – Vault Credit Needed",
  html: ({ name, uid, points, walletAmount }) => `<!DOCTYPE html>
<html>
  <body style="margin:0; padding:0; background-color:#f4f4f4; font-family:Arial, sans-serif;">
    <table width="100%" border="0" cellspacing="0" cellpadding="0" 
           style="background-color:#f4f4f4; padding:40px 0;">
      <tr>
        <td align="center">

          <!-- Main Card -->
          <table width="600" border="0" cellspacing="0" cellpadding="0" 
                 style="background:#ffffff; border-radius:14px; overflow:hidden; border:1px solid #e0e0e0;">

            <!-- Header -->
            <tr>
              <td style="padding:25px; text-align:center; background:#fafafa; border-bottom:1px solid #e0e0e0;">
                <h2 style="margin:0; font-size:22px; color:#222;">
                  Pulse Points Redemption Alert
                </h2>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:30px;">

                <p style="font-size:16px; color:#333; margin-top:0;">
                  A user has redeemed Pulse Points and requires a manual credit to their <strong>Tropic Pulse Vault Wallet</strong>.
                </p>

                <table width="100%" border="0" cellspacing="0" cellpadding="0" 
                       style="background:#fafafa; padding:15px; border-radius:8px; border:1px solid #ddd; margin:20px 0;">
                  <tr>
                    <td style="font-size:15px; padding:5px 0;"><strong>Name:</strong> ${name}</td>
                  </tr>
                  <tr>
                    <td style="font-size:15px; padding:5px 0;"><strong>UID:</strong> ${uid}</td>
                  </tr>
                  <tr>
                    <td style="font-size:15px; padding:5px 0;"><strong>Points Redeemed:</strong> ${points}</td>
                  </tr>
                  <tr>
                    <td style="font-size:15px; padding:5px 0;"><strong>Vault Credit Amount:</strong> $${walletAmount}</td>
                  </tr>
                </table>

                <p style="font-size:15px; color:#333;">
                  Please credit this amount to the user's Tropic Pulse Vault Wallet.  
                  This manual credit should be completed within <strong>24–48 hours</strong>.
                </p>

                <p style="font-size:14px; color:#777; margin-top:30px;">
                  — Tropic Pulse System Notification
                </p>

              </td>
            </tr>

          </table>
          <!-- End Main Card -->

        </td>
      </tr>
    </table>
  </body>
</html>`
},

NoCredits: {
  subject: (payload) => "You're out of Mass Notification Credits",
  html: (payload) => {
    const { email, paymentLink, eventID, logId } = payload;

    const trackingPixel =
      logId && logId !== "Preview Mode"
        ? `<img src="/_PICTURES/emailopen?logId=${encodeURIComponent(
            logId
          )}" width="1" height="1" alt="" style="opacity:0;display:block;">`
        : "";

    return `<table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f9f9; padding:40px 0; font-family:Arial, sans-serif;">
  <tr>
    <td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="background:white; border-radius:12px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.08);">
        
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#00c6ff,#0072ff); padding:30px; text-align:center;">
            <img src="/_PICTURES/ToucanLogo-Mini.png?v8" alt="Tropic Pulse" width="90" style="margin-bottom:10px;">
            <h1 style="color:white; margin:0; font-size:26px; font-weight:bold;">
              You're Out of Credits
            </h1>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="padding:30px; color:#333;">
            <p style="font-size:16px; line-height:1.6; margin:0 0 20px;">
              Hey Friend,
            </p>

            <p style="font-size:16px; line-height:1.6; margin:0 0 20px;">
              You’ve used your free Mass Notification credits. To keep sending island‑wide announcements, you’ll need to purchase additional credits.
            </p>

            <p style="font-size:16px; line-height:1.6; margin:0 0 25px;">
              Each credit is <strong>BZ$10</strong> and lets you broadcast a new event or business update to the entire Tropic Pulse community.
            </p>

            <!-- Button -->
            <table cellpadding="0" cellspacing="0" style="margin:30px auto;">
              <tr>
                <td align="center" style="background:#00a86b; padding:14px 28px; border-radius:8px;">
                  <a href="${paymentLink}" 
                     style="color:white; text-decoration:none; font-size:18px; font-weight:bold; display:block;">
                    Buy Credits
                  </a>
                </td>
              </tr>
            </table>

            <p style="font-size:14px; color:#666; line-height:1.6; margin-top:20px;">
              Once your purchase is complete, your credits will be added instantly and you can continue sending notifications without interruption.
            </p>
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="background:#f0f7f7; padding:20px; text-align:center; font-size:12px; color:#777;">
            Tropic Pulse • San Pedro, Belize<br>
            You’re receiving this message because you attempted to send a Mass Notification.
          </td>
        </tr>

      </table>
      ${trackingPixel}
    </td>
  </tr>
</table>`;
  }
}
};