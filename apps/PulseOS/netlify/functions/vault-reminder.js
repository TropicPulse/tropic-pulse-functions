// FILE: tropic-pulse-functions/functions/vault-reminders.js
//
// INTENT-CHECK: If you paste this while confused or frustrated, gently re-read
// your INTENT; if I am unsure of intent, I will ask you for the full INTENT paragraph.
//
// 📘 PAGE INDEX — Source of Truth for This File
//
// ROLE:
//   Pure logic module for the Vault Reminder Engine.
//   Provides deterministic parsing, trigger normalization, and confirmation UI
//   building. This module contains ZERO side effects and NEVER touches Firestore,
//   network, or UI directly.
//
// WHAT THIS FILE IS:
//   • The natural‑language reminder parser
//   • The trigger normalizer
//   • The confirmation bubble builder
//   • The canonical reminder object builder (NEW)
//
// WHAT THIS FILE IS NOT:
//   • Not an endpoint
//   • Not a Firestore writer
//   • Not a UI renderer
//   • Not a router or connector
//
// RESPONSIBILITIES:
//   • parseReminderText(raw) → extract text, trigger, time, location
//   • normalizeReminderTrigger(parsed) → canonical trigger form
//   • buildReminderConfirmation(text) → yes/no UI metadata
//   • buildParsedReminder(raw) → NEW unified reminder object
//
// ALLOWED IMPORTS:
//   • None (must remain pure)
//
// FORBIDDEN IMPORTS:
//   • Firestore
//   • fetch()
//   • router / connectors
//   • UI functions
//
// DEPLOYMENT:
//   Lives in /functions as a shared logic module.
//   Must remain ESM‑only and side‑effect‑free.
//
// SAFETY NOTES:
//   • Must NEVER mutate external state
//   • Must NEVER throw for normal user input
//   • Must ALWAYS return a stable object shape
//   • Must remain deterministic — same input → same output
//

/* ------------------------------------------------------
   NORMALIZE REMINDER TRIGGER
------------------------------------------------------ */
export function normalizeReminderTrigger(parsed) {
  if (!parsed) return { trigger: "nextVaultOpen" };

  if (parsed.trigger === "time") {
    return { trigger: "time", time: parsed.time };
  }

  const t = (parsed.text || "").trim();

  if (/next app|next open|app open/.test(t)) return { trigger: "nextAppOpen" };
  if (/next day|tomorrow/.test(t)) return { trigger: "nextDay" };
  if (/next week|in a week/.test(t)) return { trigger: "nextWeek" };
  if (/when i arrive|when i get there|when i reach/.test(t)) return { trigger: "location_enter" };
  if (/when i leave|when i go|when i exit/.test(t)) return { trigger: "location_exit" };

  return { trigger: "nextVaultOpen" };
}

/* ------------------------------------------------------
   BUILD CONFIRMATION BUBBLE METADATA
------------------------------------------------------ */
export function buildReminderConfirmation(text) {
  return {
    bubble: `Keeper… you want me to remember: <b>"${text}"</b>?`,
    options: [
      { label: "Yes, remember it", value: "reminder_confirmation_yes" },
      { label: "No, cancel it", value: "reminder_confirmation_no" }
    ]
  };
}

/* ------------------------------------------------------
   NATURAL LANGUAGE PARSER
------------------------------------------------------ */
export function parseReminderText(raw) {
  if (!raw) return null;

  const text = raw.toLowerCase().trim();

  // Cleaned text for display
  let cleaned = text
    .replace(/remind me|remember|set a reminder|please|to|that/i, "")
    .trim();

  // DEFAULT: next day at 9am
  let trigger = "nextDay";
  let time = null;
  let location = null;

  // Tomorrow
  if (/tomorrow|mañana/.test(text)) {
    trigger = "time";
    const t = new Date();
    t.setDate(t.getDate() + 1);
    t.setHours(9, 0, 0, 0);
    time = t.getTime();
  }

  // Tonight
  if (/tonight|esta noche/.test(text)) {
    trigger = "time";
    const t = new Date();
    t.setHours(20, 0, 0, 0);
    time = t.getTime();
  }

  // In X minutes/hours
  const inMatch = text.match(/in (\d+)\s?(minutes|minute|hours|hour)/i);
  if (inMatch) {
    trigger = "time";
    const amount = parseInt(inMatch[1]);
    const unit = inMatch[2];

    const t = new Date();
    if (unit.startsWith("hour")) t.setHours(t.getHours() + amount);
    else t.setMinutes(t.getMinutes() + amount);

    time = t.getTime();
  }

  // At specific time
  const timeMatch = text.match(/at (\d{1,2})(?::(\d{2}))?\s?(am|pm)?/i);
  if (timeMatch) {
    trigger = "time";
    const hour = parseInt(timeMatch[1]);
    const minute = timeMatch[2] ? parseInt(timeMatch[2]) : 0;
    const ampm = timeMatch[3];

    const t = new Date();
    let h = hour;

    if (ampm) {
      if (ampm.toLowerCase() === "pm" && h < 12) h += 12;
      if (ampm.toLowerCase() === "am" && h === 12) h = 0;
    }

    t.setHours(h, minute, 0, 0);
    time = t.getTime();
  }

  // Next X days
  const nextDaysMatch = text.match(/next (\d+)\s?days?/i);
  if (nextDaysMatch) {
    trigger = "time";
    const days = parseInt(nextDaysMatch[1]);
    const t = new Date();
    t.setDate(t.getDate() + days);
    t.setHours(9, 0, 0, 0);
    time = t.getTime();
  }

  // In X days
  const inDaysMatch = text.match(/in (\d+)\s?days?/i);
  if (inDaysMatch) {
    trigger = "time";
    const days = parseInt(inDaysMatch[1]);
    const t = new Date();
    t.setDate(t.getDate() + days);
    t.setHours(9, 0, 0, 0);
    time = t.getTime();
  }

  // Next week
  if (/next week/.test(text)) {
    trigger = "time";
    const t = new Date();
    t.setDate(t.getDate() + 7);
    t.setHours(9, 0, 0, 0);
    time = t.getTime();
  }

  // In X weeks
  const inWeeksMatch = text.match(/in (\d+)\s?weeks?/i);
  if (inWeeksMatch) {
    trigger = "time";
    const weeks = parseInt(inWeeksMatch[1]);
    const t = new Date();
    t.setDate(t.getDate() + weeks * 7);
    t.setHours(9, 0, 0, 0);
    time = t.getTime();
  }

  // Next app open
  if (/next app|next time i open|when i open the app/.test(text)) {
    trigger = "nextAppOpen";
  }

  // Next vault open
  if (/next vault|next time the vault opens|next time i open the vault/.test(text)) {
    trigger = "nextVaultOpen";
  }

  // Location-based
  const locMatch = text.match(/when i (arrive|reach|get to|go to|leave) (.+)/i);
  if (locMatch) {
    const action = locMatch[1];
    const place = locMatch[2];
    trigger = action === "leave" ? "location_exit" : "location_enter";
    location = place.trim();
  }

  if (!cleaned) cleaned = raw.trim();

  return { text: cleaned, trigger, time, location };
}

/* ------------------------------------------------------
   NEW: UNIFIED REMINDER OBJECT BUILDER
   (Pure, deterministic, no side effects)
------------------------------------------------------ */
export function buildParsedReminder(raw) {
  const parsed = parseReminderText(raw);
  const normalized = normalizeReminderTrigger(parsed);

  return {
    text: parsed?.text || "",
    trigger: normalized.trigger,
    time: normalized.time || parsed?.time || null,
    location: parsed?.location || null
  };
}