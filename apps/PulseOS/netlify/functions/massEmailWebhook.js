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
          const eventImageUrl = "https://www.tropicpulse.bz/NewEvent.png?v8";

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
    payload.unsubscribeUrl = "https://www.tropicpulse.bz/unsubscribe";

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
        unsubscribeUrl: `https://www.tropicpulse.bz/unsubscribe?token=${encodeURIComponent(
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

//
// ------------------------------------------------------
// SIDE FUNCTIONS (unchanged, preserved, improved only)
// ------------------------------------------------------
// sendEmailToUser
// sendNoCreditsEmail
// createMassEmailPaymentLink
// etc.
//
