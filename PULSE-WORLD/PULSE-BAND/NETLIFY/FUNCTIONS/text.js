// FILE: tropic-pulse-functions/PULSE-WORLD/netlify/functions/text.js
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
//   Shared text utility module providing currency formatting,
//   text sanitization, and the playful profanity replacer.
//   This file is LOGIC‑ONLY — it must NOT contain Netlify handlers.
//   Safe to import from any Netlify function or logic module.
//
// DEPLOYMENT:
//   PRIMARY HOST: Netlify (all backend execution runs here)
//   BACKUP HOSTS: Cloudflare + Firebase Hosting (static/CDN only)
//   Firebase Functions = deprecated — do NOT add new Firebase Functions code
//
// SYNTAX RULES:
//   ESM JavaScript ONLY — no TypeScript, no CommonJS, no require()
//   ALWAYS use named exports (`export const` or `export function`)
//   NEVER use default exports
//
// IMPORT RULES:
//   Only import modules that ALREADY exist in the repo
//   Do NOT assume new files or dependencies unless Aldwyn explicitly approves
//
// STRUCTURE:
//   Lives in /netlify/functions (flat) unless Aldwyn creates subfolders
//   This file is a pure logic module — no initialization, no handlers
//
// DEPENDENCY RULES:
//   This file may be imported by ANY Netlify function or logic module
//   Must remain deterministic and side‑effect‑free
//
// SAFETY NOTES:
//   No external API calls allowed
//   Keep profanity replacement playful, non‑offensive, and stable
//   This module is widely used — changes ripple across the system

/* ----------------------------------------------------
   CURRENCY FORMATTERS
---------------------------------------------------- */
export function currency(amount, displayCurrency = "$") {
  let raw = String(amount || "").replace(/BZ?\$|\$/g, "").trim();
  const num = Number(raw);
  const safe = isNaN(num) ? "0.00" : num.toFixed(2);

  let cur = String(displayCurrency || "$").trim().toUpperCase();
  cur = cur === "USD" || cur === "$" || cur === "US$" ? "$" : "BZ$";

  return `${cur}${safe}`;
}

export function formatDisplayAmount(displayCurrency, amount) {
  const safeAmount = Number(amount);
  const finalAmount = isNaN(safeAmount) ? "0.00" : safeAmount.toFixed(2);

  let cur = String(displayCurrency || "$").trim().toUpperCase();
  cur = cur === "USD" || cur === "$" || cur === "US$" ? "$" : "BZ$";

  return currency(finalAmount, cur);
}

/* ----------------------------------------------------
   TEXT SANITIZATION + PLAYFUL PROFANITY FILTER
---------------------------------------------------- */
export function sanitizeEverything(input) {
  if (!input) return "";

  let text = String(input);

  text = text.replace(/\s+/g, " ").trim();
  text = text.replace(/[\u200B-\u200F\uFEFF]/g, "");
  text = text.replace(/,/g, " • ");
  text = text.replace(/'/g, "’");
  text = text.replace(/\\/g, "");
  text = text.replace(/\.{2,}/g, ".");

  text = playfulClean(text);

  return text.trim();
}

export function playfulClean(input) {
  if (!input) return "";

  const dictionary = {
    word_f: {
      noun: ["pineapple","coconut","marshmallow","iguana nugget","hurricane dumpling","reef goblin"],
      verb: ["juggle","tap‑dance","boogie","shimmy","cha-cha","crab‑walk"],
      adj: ["spicy","wobbly","chaotic","sun‑kissed","unhinged","reef‑powered"]
    },
    word_s: {
      noun: ["guava","papaya","mango chunk","sand pebble","fruit catastrophe","tide‑sauce"],
      verb: ["splash","scoot","shuffle","wiggle","plop","sploosh"],
      adj: ["messy","funky","wonky","dusty","sticky","soggy"]
    },
    word_b: {
      noun: ["seashell","sunbeam","toucan","pelican","sass‑parrot","beach diva"],
      verb: ["chirp","wiggle","sass","squawk","side‑eye","strut"],
      adj: ["salty","spicy","sassy","stormy","feisty","sun‑dramatic"]
    },
    word_c: {
      noun: ["lava pearl","reef blossom","storm crystal","moon pebble","tidal rune","volcano sprinkle"],
      adj: ["ferocious","untamed","wild‑eyed","tempest‑touched","mythic","overdramatic"]
    },
    word_a: {
      noun: ["iguana","pelican","sand crab","reef turtle","snorkel gremlin","beach potato"],
      adj: ["chunky","sun‑kissed","sandy","reef‑brained","lumpy","tide‑soaked"]
    },
    word_d: {
      noun: ["sand dollar","reef pebble","tide pool","conch shell","sunburn moment","beach oopsie"],
      adj: ["breezy","sun‑drenched","tropical","warm‑hearted","dramatic","over‑toasted"]
    }
  };

  const alias = {
    damn: "word_d",
    darn: "word_d",
    dang: "word_d",
    fuck: "word_f",
    fucking: "word_f",
    shit: "word_s",
    bitch: "word_b",
    cunt: "word_c",
    ass: "word_a",
    asshole: "word_a"
  };

  const detectPOS = (words, i) => {
    const prev = words[i - 1]?.toLowerCase();
    if (prev && ["a","an","the","my","your","his","her","this","that"].includes(prev)) return "adj";
    if (prev && ["i","you","we","they","he","she","it"].includes(prev)) return "verb";
    return "noun";
  };

  const words = input.split(/\b/);

  const cleaned = words.map((word, i) => {
    const stripped = word.toLowerCase().replace(/^[^\w]+|[^\w]+$/g, "");
    const key = alias[stripped];
    if (!key) return word;

    const pos = detectPOS(words, i);
    const options = dictionary[key][pos] || dictionary[key].noun;
    const replacement = options[Math.floor(Math.random() * options.length)];

    return word[0] === word[0].toUpperCase()
      ? replacement.charAt(0).toUpperCase() + replacement.slice(1)
      : replacement;
  });

  return cleaned.join("");
}

export function BECLEAN(input) {
  return playfulClean(sanitizeEverything(input));
}