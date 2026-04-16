import { onRequest, onCall } from "firebase-functions/v2/https";
import { onDocumentWritten, onDocumentWrittenWithAuthContext } from "firebase-functions/v2/firestore";
import nodemailer from "nodemailer";
import { defineSecret } from "firebase-functions/params";
import admin from "firebase-admin";
import Stripe from "stripe";
import * as logger from "firebase-functions/logger";
import { onSchedule } from "firebase-functions/v2/scheduler";
import fetch from "node-fetch";
//import { Readable } from "node:stream";
import cors from "cors";
import express from "express";
import twilio from "twilio";
import jwt from "jsonwebtoken";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import sharp from "sharp";
import { fileURLToPath } from "url";
// Marketplace adapters (inside /pulse-earn/marketplaces/)
// import { marketplaceA } from "../pulse-earn/marketplaces/marketplaceA.js";
// import { marketplaceB } from "../pulse-earn/marketplaces/marketplaceB.js";
// import { marketplaceC } from "../pulse-earn/marketplaces/marketplaceC.js";

// // Remote scoring (ESM only)
// import { runUserScoring } from "../pulse-proxy/PulseUserScoring.js";

// // Reputation loader (inside /pulse-earn/)
// import { loadMarketplaceReputation } from "../pulse-earn/MarketplaceReputation.js";

// // Connector (inside /pulse-earn/)
// import { getNextJob } from "../pulse-earn/MarketplaceConnector.js";

// // Example: capacity for ONE worker instance
// const capacity = {
//   cpuAvailable: 2,
//   memoryAvailable: 2048
// };

// // Example: your marketplace clients (you will implement these)
// const marketplaces = [
//   marketplaceA,
//   marketplaceB,
//   marketplaceC
// ];

// async function schedulerTick() {
//   const job = await getNextJob(marketplaces, capacity);

//   if (!job) {
//     console.log("No jobs available right now.");
//     return;
//   }

//   console.log("Selected job:", job);

//   // TODO: hand this job to your worker execution layer
// }

// schedulerTick();

// loadMarketplaceReputation();

export const VAULT_PATCH_TWILIGHT = {
  signature: "Twilight",
  invoked: "2026-04-07T04:00:00-07:00", // 4 AM MST
  version: 2,
  type: "security-data-integrity",
  glyph: "🌒",
  description: "The first protective veil cast by the Vault Spirit during a 4 AM development session.",
  note: "Named 'Twilight' because it was created in the quiet hours before dawn."
};

function pulseCors(req, res, next) {
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Pulse-Device, X-Pulse-Remember");
  res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");

  if (req.method === "OPTIONS") {
    return res.status(204).send("");
  }

  next();
}
const EMAIL_PASSWORD = defineSecret("EMAIL_PASSWORD");
const STRIPE_PASSWORD = defineSecret("STRIPE_SECRET_KEY");
const JWT_SECRET = defineSecret("JWT_SECRET");
// CLOUD RUN ENVIRONMENTS
const TP_API_KEY = process.env.TP_API_KEY;
const BASE_PAYMENT_URL = process.env.BASE_PAYMENT_URL;
const GOOGLE_MAPS_KEY = process.env.GOOGLE_MAPS_KEY;
const PLACEHOLDER_IMAGE_URL = process.env.PLACEHOLDER_IMAGE_URL;

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



// Initialize Firebase ONCE
admin.initializeApp();
const db = admin.firestore();
const storage = admin.storage().bucket();
const app = express();

let stripeInstance = null;

const __filename = fileURLToPath(import.meta.url);