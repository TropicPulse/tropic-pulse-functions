// ============================================================================
// PulseOS Brain — v9.2 (CNS Master Brain)
// “Central Nervous System: Imports → Evolution → Routing → Validation → Attach”
// ============================================================================
//
// THIS IS THE MASTER ORGANISM BRAIN.
// • Imports EVERYTHING the organism ever uses
// • Provides ALL access to ALL subsystems
// • Evolves with the filesystem
// • Routes backend organs
// • Validates PulseRole identity
// • Prevents structural mutation
// • Provides Firebase access
// • Provides Kernel access (but is NOT the kernel itself)
// • Provides Evolution access
// • Provides BBB access
// • Provides Memory access
//
// ALL OTHER ORGANS MUST IMPORT ONLY FROM THIS FILE.
// ============================================================================

// ---------------------------------------------------------------------------
// GLOBAL IMPORTS (ALL ACCESS) — PRESERVED FOR IQ (NO DELETIONS)
// ---------------------------------------------------------------------------
import { log, warn, error as logError } from "../pulse-proxy/PulseProxyVitalsLogger.js";



// Kernel / BrainStem (OS kernel lives here, Brain only routes to it)
import { PulseOSKernel } from "./PulseOSBrainStem.js";

// Firebase (full access)
import * as firebase from "../netlify/functions/firebase.js";

// BBB (identity + shell + permissions)
import * as BBB from "./PulseOSBBB.js";

// Long-term memory fallback
import * as LongTermMemory from "./PulseOSLongTermMemory.js";

// Evolution (raw scanning)
import { evolveRaw } from "./PulseOSBrainEvolution.js";

// Any other global utilities
import { nanoid } from "nanoid";


// ============================================================================
//  IMPORTS — (unchanged, allowed for Spine)
// ============================================================================
import express from "express";
import fetch from "node-fetch";
import crypto from "crypto";
import nodemailer from "nodemailer";
import { createClient } from "redis";
import { getFirestore } from "firebase-admin/firestore";
import dotenv from "dotenv";
dotenv.config();

import { readdirSync, statSync } from "fs";
import { join } from "path";
// ============================================================================
// 0) BRAIN IDENTITY (PulseRole) — v9.2
// ============================================================================
export const PulseRole = {
  type: "Brain",
  subsystem: "OS",
  layer: "CNS",
  version: "9.2",
  identity: "PulseOSBrain",

  evo: {
    deterministicNeuron: true,
    driftProof: true,
    multiInstanceReady: true,
    advantageCascadeAware: true,
    unifiedAdvantageField: true,

    // Conceptual compatibility (no logic impact)
    routingContract: "PulseSend-v9.2",
    osOrganContract: "PulseOS-v9.2",
    earnCompatibility: "PulseEarn-v9.2",
    proxyCompatibility: "PulseProxySpine-v9.2",
    gpuCompatibility: "PulseGPU-v9.2"
  }
};


// ============================================================================
// 1) ROLE VALIDATION — CNS Gatekeeper
// ============================================================================
export function validatePulseRole(module, expectedType, expectedSubsystem) {
  if (!module?.PulseRole) return false;

  const role = module.PulseRole;

  const typeOk = expectedType
    ? role.type?.toLowerCase() === expectedType.toLowerCase()
    : true;

  const subsystemOk = expectedSubsystem
    ? role.subsystem?.toLowerCase() === expectedSubsystem.toLowerCase()
    : true;

  return typeOk && subsystemOk;
}


// ============================================================================
// 2) STRUCTURAL ERROR INTELLIGENCE — Drift Surface
// ============================================================================
export function structuralError(expected, found, extraContext = {}) {
  const payload = {
    error: "ROLE_MISMATCH",
    expectedType: expected.type,
    expectedSubsystem: expected.subsystem,
    foundType: found.type,
    foundSubsystem: found.subsystem,
    message: `Invalid attachment: expected ${expected.type}/${expected.subsystem} but found ${found.type}/${found.subsystem}`,
    severity: "warning",
    action: "fallbackToLongTermMemory",
    ...extraContext
  };

  warn("[STRUCTURAL_ERROR]", payload);
  return payload;
}


// ============================================================================
// 3) EVOLUTION + INTELLIGENCE — Design-Driven Organ Loading
// ============================================================================
export async function loadOrganByDesign(designIdentity, expectedType, expectedSubsys) {
  const raw = await evolveRaw(designIdentity);
  const expected = { type: expectedType, subsystem: expectedSubsys };

  const candidates = raw.filter(({ module }) =>
    validatePulseRole(module, expected.type, expected.subsystem)
  );

  if (candidates.length > 0) {
    const chosen = candidates[0];
    log(`🧠 [PulseOSBrain] Attached organ from ${chosen.path}`);
    return chosen.module;
  }

  return structuralError(expected, { type: null, subsystem: null }, { designIdentity });
}


// ============================================================================
//– 4) EXPORT EVERYTHING THE BODY NEEDS — CNS Surface (NOT Kernel)
// ============================================================================
export const Brain = {
  // Logging
  log,
  warn,
  logError,

  // Core infrastructure
  firebase,
  BBB,
  PulseOSKernel,
  LongTermMemory,
  evolveRaw,
  loadOrganByDesign,

  // Utilities (kept for historical IQ)
  nanoid,
  crypto,

  // FS primitives (preserved; used by evolution layer)
  readdirSync,
  statSync,
  join,

  // Identity
  PulseRole
};
