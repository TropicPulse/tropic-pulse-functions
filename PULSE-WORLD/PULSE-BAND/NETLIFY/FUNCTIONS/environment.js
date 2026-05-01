/* global log,warn,error */
// FILE: tropic-pulse-functions/PULSE-WORLD/netlify/functions/environment.js
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
//   Core environment engine logic for multipliers, insights, smart advice,
//   and full island environmental summaries.
//   This file is LOGIC‑ONLY — it must NOT contain Netlify handlers.
//   Handlers (if needed) must live in separate endpoint files.
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
//   This file is a pure logic module used by multiple environment endpoints
//
// DEPENDENCY RULES:
//   This file must remain side‑effect‑free (no initialization, no handlers)
//   Safe to import from any Netlify function or logic module
//
// SAFETY NOTES:
//   Keep deterministic; no global state
//   No external API calls unless explicitly approved
//   This module is foundational to the Environment Engine — keep stable
import { db, admin } from "./helpers.js";

/* ------------------------------------------------------
   1. ENVIRONMENTAL MULTIPLIERS
------------------------------------------------------ */
export async function applyEnvironmentalMultipliers(envSettings, envState) {
  if (!envSettings?.enabled) {
    return { totalMultiplier: 1, breakdown: [] };
  }

  const breakdown = [];
  let total = 1;

  const add = (label, value) => {
    if (typeof value !== "number" || isNaN(value)) return;
    breakdown.push({ label, value });
    total += value;
  };

  // WEATHER
  const w = envState.weather?.data?.current;
  if (w) {
    const temp = w.temperature_2m;
    const wind = w.wind_speed_10m;

    if (wind > 20) add("wind", envSettings.weather.wind);
    if (temp >= 30) add("heat", envSettings.weather.heat);
    if (temp <= 22) add("coldFront", envSettings.weather.coldFront);

    const perfect = temp >= 24 && temp <= 30 && wind < 15;
    if (perfect) add("perfectWeather", envSettings.weather.perfectWeather);
  }

  // HEAT INDEX
  const hi = envState.heatIndex?.data?.heatIndex;
  if (typeof hi === "number" && hi > 95) {
    add("heatIndex", envSettings.weather.heat);
  }

  // STORMS
  const storms = envState.storms?.data?.activeStorms ?? [];
  if (storms.length > 0) {
    const has = (str) =>
      storms.some(s => s.type?.toLowerCase().includes(str));

    if (has("hurricane")) add("hurricane", envSettings.storm.hurricane);
    else if (has("storm")) add("tropicalStorm", envSettings.storm.tropicalStorm);
    else if (has("wave")) add("tropicalWave", envSettings.storm.tropicalWave);
  }

  // SARGASSUM
  const sarg = envState.sargassum?.data?.value;
  if (typeof sarg === "number") {
    const level =
      sarg > 0.7 ? "high" :
      sarg > 0.3 ? "moderate" :
      "low";

    add(`sargassum_${level}`, envSettings.sargassum[level]);
  }

  // WAVES
  const waveFt = envState.waves?.data?.heightFt?.[0];
  if (typeof waveFt === "number") {
    const seaState =
      waveFt > 6 ? "dangerous" :
      waveFt > 3 ? "rough" :
      waveFt > 1.5 ? "moderate" :
      "calm";

    add(`sea_${seaState}`, envSettings.sea[seaState]);
  }

  // MOON
  const moon = envState.moon?.data?.phase;
  if (typeof moon === "number") {
    const phase =
      moon >= 0.4 && moon <= 0.6 ? "full" :
      moon < 0.1 ? "new" :
      moon < 0.25 ? "waxing_crescent" :
      moon < 0.4 ? "first_quarter" :
      moon < 0.75 ? "waning_gibbous" :
      "waning_crescent";

    add(`moon_${phase}`, envSettings.moon[phase]);
  }

  // CAP
  const maxCap = envSettings.multipliers?.maxTotalMultiplier || 3;
  const capped = Math.min(total, maxCap);

  return { totalMultiplier: capped, breakdown };
}

/* ------------------------------------------------------
   2. ENVIRONMENTAL INSIGHTS
------------------------------------------------------ */
export async function generateEnvironmentalInsights(envSettings, envState) {
  if (!envSettings?.enabled) return "";

  const insights = [];

  // WEATHER
  const w = envState.weather?.data?.current;
  if (w) {
    const temp = w.temperature_2m;
    const wind = w.wind_speed_10m;
    const code = w.weather_code;

    const skyMap = {
      0: "☀️ Clear skies over the island.",
      1: "🌤️ Mostly clear with soft sunlight.",
      2: "⛅ Partly cloudy with warm breezes.",
      3: "☁️ Overcast skies across the island.",
      45: "🌫️ Foggy patches this morning.",
      48: "🌫️ Dense fog in some areas.",
      51: "🌦️ Light drizzle passing through.",
      53: "🌦️ Drizzle around the island.",
      55: "🌧️ Heavy drizzle at times.",
      61: "🌧️ Light rain in the area.",
      63: "🌧️ Rain showers moving through.",
      65: "⛈️ Heavy rain in some spots.",
      80: "🌦️ Light showers nearby.",
      81: "🌧️ Scattered showers.",
      82: "⛈️ Heavy showers approaching."
    };

    insights.push(skyMap[code] ?? "🌤️ Typical island weather.");

    if (temp >= 30) insights.push("🔥 Warm day — stay hydrated.");
    if (temp <= 22) insights.push("❄️ Cooler breezes today.");
    if (wind > 20) insights.push("🍃 Strong winds — seas may stay lively.");
  }

  // WAVES
  const waveFt = envState.waves?.data?.heightFt?.[0];
  const dir = envState.waves?.data?.derived?.friendlyDirection;

  if (typeof waveFt === "number") {
    if (waveFt > 6) insights.push("🌊 Rough seas — tours may be limited.");
    else if (waveFt > 3) insights.push("🌊 A bit of chop on the water.");
    else insights.push("🌊 Calm seas — lovely for snorkeling.");

    if (dir) insights.push(`🌬️ Swell rolling ${dir}.`);
  }

  // SARGASSUM
  const sarg = envState.sargassum?.data?.value;
  if (typeof sarg === "number") {
    if (sarg > 0.7) insights.push("🟤 Heavy sargassum drifting in.");
    else if (sarg > 0.3) insights.push("🌾 Moderate sargassum today.");
    else insights.push("🏖️ Low sargassum — beaches looking clear.");
  }

  // STORMS
  const storms = envState.storms?.data?.activeStorms ?? [];
  if (storms.length > 0) insights.push("⛈️ Tropical activity nearby — stay aware.");

  // MOON
  const moon = envState.moon?.data?.phase;
  if (typeof moon === "number" && moon >= 0.4 && moon <= 0.6) {
    insights.push("🌕 Full moon glow tonight — magical evenings ahead.");
  }

  // WILDLIFE
  const wildlife = envState.wildlife?.data || {};

  const wildlifeIcons = {
    turtle: "🐢", dolphin: "🐬", manatee: "🦭",
    ray: "🐟", stingray: "🐟",
    shark: "🦈",
    iguana: "🦎",
    crab: "🦀",
    jellyfish: "🪼",
    crocodile: "🐊",
    fish: "🐠"
  };

  for (const [k, v] of Object.entries(wildlife)) {
    if (v === true) {
      const key = k.toLowerCase().replace(/s$/, "");
      const icon = wildlifeIcons[key] ?? "✨";
      const label = k.charAt(0).toUpperCase() + k.slice(1);
      insights.push(`${icon} ${label} spotted recently.`);
    }
  }

  return insights.join("<br>");
}

/* ------------------------------------------------------
   3. SMART ENVIRONMENTAL ADVICE
------------------------------------------------------ */
export async function generateSmartEnvironmentalAdvice(envSettings, envState, intent) {
  if (!envSettings?.enabled) return "";

  const tips = [];

  const beachIntents = ["beaches"];
  const tourIntents  = ["tours"];
  const eventIntents = ["events_today", "events_upcoming"];

  const waveFt = envState.waves?.data?.heightFt?.[0];
  const storms = envState.storms?.data?.activeStorms ?? [];
  const sarg = envState.sargassum?.data?.value;
  const w = envState.weather?.data?.current;
  const wildlife = envState.wildlife?.data || {};

  // BEACH
  if (beachIntents.includes(intent)) {
    if (waveFt > 3) {
      tips.push("💡 Seas are a bit lively — longer boat rides might feel bumpy.");
    }

    if (typeof sarg === "number") {
      if (sarg > 0.7) tips.push("💡 Some beaches may have heavy sargassum today.");
      else if (sarg > 0.3) tips.push("💡 A few patches of sargassum drifting around.");
    }
  }

  // TOURS
  if (tourIntents.includes(intent)) {
    if (storms.length > 0) {
      tips.push("💡 Might be worth checking with tour operators — weather can shift plans.");
    }
  }

  // EVENTS
  if (eventIntents.includes(intent)) {
    if (w?.temperature_2m >= 30) {
      tips.push("💡 Warm day ahead — outdoor events may feel extra hot, bring water.");
    }

    if (storms.length > 0) {
      tips.push("💡 Keep an eye on the weather — storms may affect outdoor events.");
    }
  }

  // WILDLIFE SAFETY
  const has = (name) => wildlife[name] || wildlife[name + "s"];

  if (has("jellyfish")) tips.push("💡 Jellyfish around — just keep an eye out while swimming.");
  if (has("crocodile") || has("croc")) tips.push("💡 Avoid lagoon edges — croc activity reported.");
  if (has("stingray")) tips.push("💡 Stingrays active — shuffle feet when entering shallow water.");
  if (has("shark")) tips.push("💡 Shark activity noted — stay aware offshore.");
  if (has("manatee")) tips.push("💡 Manatees nearby — gentle giants, enjoy from a distance.");
  if (has("dolphin")) tips.push("💡 Dolphins spotted — magical moments possible on the water.");

  return tips.join("<br>");
}

/* ------------------------------------------------------
   4. ENVIRONMENT SUMMARY (FULL ISLAND SNAPSHOT)
------------------------------------------------------ */
export function getEnvironmentSummary(envState = {}) {
  const cToF = c => (c * 9) / 5 + 32;
  const kmhToMph = kmh => kmh * 0.621371;

  // WEATHER
  const weather = envState.weather?.data || {};
  const tempC = weather.current?.temperature_2m ?? null;
  const humidity = weather.current?.relative_humidity_2m ?? null;
  const windKph = weather.current?.wind_speed_10m ?? null;

  const weatherLine =
    typeof tempC === "number"
      ? `• 🌦️ <b>Weather</b> — ${tempC}°C / ${cToF(tempC).toFixed(1)}°F`
      : `• 🌦️ <b>Weather</b> — Not Available`;

  const humidityLine =
    typeof humidity === "number"
      ? `• 💧 <b>Humidity</b> — ${humidity}%`
      : `• 💧 <b>Humidity</b> — Not Available`;

  const windLine =
    typeof windKph === "number"
      ? `• 🍃 <b>Wind</b> — ${windKph} KM/H / ${kmhToMph(windKph).toFixed(1)} MPH`
      : `• 🍃 <b>Wind</b> — Not Available`;

  // HEAT INDEX
  const hiC = envState.heatIndex?.data?.heatIndex ?? null;
  const hiF = typeof hiC === "number" ? cToF(hiC) : null;

  let heatLine = `• 🔥 <b>Heat Index</b> — Not Available`;

  if (typeof hiF === "number") {
    let danger = "Safe";
    let icon = "🌤️";

    if (hiF >= 103 && hiF < 125) {
      danger = "Danger";
      icon = "🔥";
    } else if (hiF >= 125) {
      danger = "Extreme Danger";
      icon = "🌋";
    } else if (hiF >= 90) {
      danger = "Caution";
      icon = "🌡️";
    }

    heatLine = `• ${icon} <b>Heat Index</b> — ${hiF.toFixed(1)}°F (${danger})`;
  }

  // WAVES
  const waves = envState.waves?.data || {};
  const heightFt = waves.heightFt?.[0] ?? null;
  const heightM = waves.heightM?.[0] ?? null;
  const dir = waves.derived?.friendlyDirection;
  const swell = waves.derived?.swellType;

  let waveLine = `• 🌊 <b>Sea</b> — Not Available`;

  if (typeof heightFt === "number") {
    let mood =
      heightFt < 1.5 ? "Calm" :
      heightFt < 3 ? "Moderate" :
      heightFt < 6 ? "Choppy" :
      "Rough";

    let vibe = "";
    if (dir) vibe += `, ${dir}`;
    if (swell) vibe += `, ${swell}`;

    waveLine = `• 🌊 <b>Sea</b> — ${mood} (${heightFt.toFixed(1)} FT / ${typeof heightM === "number" ? heightM.toFixed(2) : "N/A"} M${vibe ? " — " + vibe : ""})`;
  }

  // SARGASSUM
  const sarg = envState.sargassum?.data?.value ?? null;

  let sargLine = `• 🟤 <b>Sargassum</b> — Not Available`;

  if (typeof sarg === "number") {
    if (sarg > 0.7) sargLine = `• 🟤 <b>Sargassum</b> — Heavy`;
    else if (sarg > 0.3) sargLine = `• 🌾 <b>Sargassum</b> — Moderate`;
    else sargLine = `• 🏖️ <b>Sargassum</b> — Low`;
  }

  // STORMS
  const storms = envState.storms?.data?.activeStorms ?? [];

  let stormLine = `• ⛅ <b>Storms</b> — None Detected`;

  if (storms.length === 1) {
    const s = storms[0];
    stormLine = `• 🌀 <b>Storm</b> — ${s.type} (${s.name}) Detected`;
  } else if (storms.length > 1) {
    const names = storms.map(s => s.name).join(", ");
    stormLine = `• 🌀 <b>Storms</b> — ${storms.length} Active Systems (${names})`;
  }

  // MOON
  const moon = envState.moon?.data?.phase ?? null;

  let moonLine = `• 🌙 <b>Moon</b> — Not Available`;

  if (typeof moon === "number") {
    if (moon >= 0.4 && moon <= 0.6) moonLine = `• 🌕 <b>Moon</b> — Full Moon`;
    else if (moon < 0.1) moonLine = `• 🌑 <b>Moon</b> — New Moon`;
    else if (moon < 0.25) moonLine = `• 🌒 <b>Moon</b> — Waxing Crescent`;
    else if (moon < 0.4) moonLine = `• 🌓 <b>Moon</b> — First Quarter`;
    else if (moon < 0.75) moonLine = `• 🌖 <b>Moon</b> — Waning Gibbous`;
    else moonLine = `• 🌘 <b>Moon</b> — Waning Crescent`;
  }

  // WILDLIFE
  const wildlife = envState.wildlife?.data || {};

  const wildlifeIcons = {
    turtle: "🐢", turtles: "🐢",
    dolphin: "🐬", dolphins: "🐬",
    manatee: "🦭", manatees: "🦭",
    ray: "🐟", rays: "🐟", stingray: "🐟", stingrays: "🐟",
    shark: "🦈", sharks: "🦈",
    iguana: "🦎", iguanas: "🦎",
    crab: "🦀", crabs: "🦀",
    jellyfish: "🪼",
    crocodile: "🐊", crocodiles: "🐊", croc: "🐊", crocs: "🐊",
    fish: "🐠", fishes: "🐠"
  };

  const activeWildlife = Object.entries(wildlife)
    .filter(([, v]) => v === true)
    .map(([k]) => {
      const key = k.toLowerCase().replace(/s$/, "");
      const icon = wildlifeIcons[key] ?? "✨";
      return `${icon} ${k}`;
    });

  const wildlifeLine =
    activeWildlife.length > 0
      ? `• 🐾 <b>Wildlife</b> — ${activeWildlife.join(", ")}`
      : `• 🐾 <b>Wildlife</b> — No Recent Sightings`;

 
  // ------------------------------------
  // FINAL OUTPUT
  // ------------------------------------
  return [
    "📝 <b>Island Environment Summary</b><br><br>",
    weatherLine,
    humidityLine,
    windLine,
    heatLine,
    waveLine,
    sargLine,
    stormLine,
    moonLine,
    wildlifeLine
  ].join("<br>");
}

function mapWeatherCode(code) {
  if (code === null || code === undefined) return "Unknown";

  const c = Number(code);

  const map = {
    0: "Clear skies",
    1: "Mostly clear",
    2: "Partly cloudy",
    3: "Overcast",

    45: "Foggy",
    48: "Fog with rime",

    51: "Light drizzle",
    53: "Moderate drizzle",
    55: "Heavy drizzle",

    56: "Light freezing drizzle",
    57: "Heavy freezing drizzle",

    61: "Light rain",
    63: "Moderate rain",
    65: "Heavy rain",

    66: "Light freezing rain",
    67: "Heavy freezing rain",

    71: "Light snow",
    73: "Moderate snow",
    75: "Heavy snow",

    77: "Snow grains",

    80: "Light rain showers",
    81: "Moderate rain showers",
    82: "Heavy rain showers",

    85: "Light snow showers",
    86: "Heavy snow showers",

    95: "Thunderstorm",
    96: "Thunderstorm with light hail",
    99: "Thunderstorm with heavy hail"
  };

  return map[c] || "Unknown";
}
// -----------------------------
// 5. FUTURE SCENARIO ENGINE
// -----------------------------
async function generateFutureScenario(text, user, envState) {
  const out = [];
  const lower = text.toLowerCase();

  const w = envState.weather?.data?.current || {};
  const waves = envState.waves?.data || {};
  const sarg = envState.sargassum?.data?.value;
  const moon = envState.moon?.data?.phase;
  const storms = envState.storms?.data?.activeStorms ?? [];
  const wildlife = envState.wildlife?.data || {};

  const description = mapWeatherCode(w.weather_code || null);

  // WEATHER FUTURES
  if (description.includes("Thunderstorm")) {
    out.push("⛈️ <b>Storm Energy Lingers</b> — skies may stay dramatic for a bit.");
  }
  if (description.includes("Clear")) {
    out.push("☀️ <b>Clear Skies Ahead</b> — bright, open-feeling hours coming.");
  }
  if (description.includes("Mostly clear")) {
    out.push("🌤️ <b>Mostly Clear</b> — soft clouds drifting around.");
  }
  if (description.includes("Partly cloudy")) {
    out.push("⛅ <b>Patchy Clouds</b> — shifting light and cooler breezes.");
  }
  if (description.includes("Overcast")) {
    out.push("🌥️ <b>Overcast Mood</b> — mellow, steady temperatures.");
  }
  if (description.includes("Light rain")) {
    out.push("🌦️ <b>Light Showers</b> — quick sprinkles may pass through.");
  }
  if (description.includes("Moderate rain")) {
    out.push("🌧️ <b>Steady Rain</b> — expect on-and-off showers.");
  }
  if (description.includes("Heavy rain")) {
    out.push("🌧️ <b>Heavy Bursts</b> — visibility may dip at times.");
  }
  if (description.includes("Fog")) {
    out.push("🌫️ <b>Foggy Pockets</b> — morning haze lifting later.");
  }

  // DAY VIBES
  if (lower.includes("saturday")) {
    out.push("📅 <b>Saturday Energy</b> — livelier beaches and playful island rhythm.");
  }
  if (lower.includes("sunday")) {
    out.push("🌤️ <b>Slow Sunday Drift</b> — softer moods shaping the day.");
  }

  // WEATHER SIGNALS (FIXED)
  // No precipitation in normalized state — use humidity + weather code
  if (w.relative_humidity_2m > 85 && description.includes("rain")) {
    out.push("🌧️ <b>Passing Showers</b> — depends on cloud drift.");
  }

  if (w.wind_speed_10m > 18) {
    out.push("💨 <b>Breezy Hours</b> — seas may stay lively.");
  }

  if (w.apparent_temperature > 90) {
    out.push("🔥 <b>Warm Afternoon</b> — classic tropical heat.");
  }

  // WAVE FUTURES (HARDENED)
  const waveHeight = waves.heightFt?.[0];
  const dir = waves.derived?.friendlyDirection || null;
  const trend = waves.derived?.trend3h || null;

  if (typeof waveHeight === "number") {
    if (waveHeight > 2.0) {
      out.push("🌊 <b>Seas Staying Lively</b> — a bit of energy on the water.");
    } else if (waveHeight < 1.0) {
      out.push("🌊 <b>Glassier Waters Forming</b> — lovely for snorkeling.");
    }
    if (dir) out.push(`🌬️ Swell rolling ${dir}.`);
    if (trend) out.push(`📈 Seas look to be ${trend} soon.`);
  }

  // SARGASSUM FUTURES
  if (typeof sarg === "number") {
    if (sarg > 0.7) {
      out.push("🟤 <b>Sargassum Drift Likely</b> — winds may push more toward shore.");
    } else if (sarg < 0.3) {
      out.push("🌿 <b>Clearer Shores Ahead</b> — currents look friendly.");
    }
  }

  // MOON FUTURES
  if (typeof moon === "number") {
    if (moon >= 0.4 && moon <= 0.6) {
      out.push("🌕 <b>Full Moon Glow</b> — magical evenings incoming.");
    }
    if (moon < 0.1) {
      out.push("🌑 <b>New Moon Darkness</b> — great for stargazing.");
    }
  }

  // STORM FUTURES
  if (storms.length > 0) {
    out.push("🌀 <b>Storm Activity Nearby</b> — patterns may shift later.");
  }

  // WILDLIFE FUTURES (HARDENED)
  if (wildlife && Object.values(wildlife).some(v => v === true)) {
    out.push("🐾 <b>Wildlife Stirring</b> — movement near lagoons and mangroves.");
  }

  // EMOTIONAL FUTURES
  if (lower.includes("busy")) {
    out.push("✨ <b>Dynamic Flow</b> — island may feel more alive soon.");
  }
  if (lower.includes("quiet")) {
    out.push("🌙 <b>Softer Rhythm</b> — peaceful stretch forming.");
  }

  // TIME OF DAY
  const hour = new Date().getHours();
  if (hour < 10) {
    out.push("🌅 <b>Morning Unfolding</b> — gentle start to the day.");
  } else if (hour < 17) {
    out.push("🌞 <b>Afternoon Pulse</b> — heat and wind tend to peak.");
  } else {
    out.push("🌆 <b>Evening Drift</b> — softer breezes settling in.");
  }

  return out.join("<br>");
}

export async function getEnvironmentState() {
  try {
    const snap = await db.collection("environment").get();
    const state = {};

    // ------------------------------------
    // NORMALIZE ROOT DOCS
    // ------------------------------------
    snap.forEach(doc => {
      const raw = doc.data() || {};

      // Accept any of these shapes:
      // { data: {...} }
      // { raw: {...} }
      // { raw: { data: {...} } }
      // { ...fields }
      const normalized =
        raw.data ||
        raw.raw?.data ||
        raw.raw ||
        raw;

      state[doc.id] = normalized;
    });

    // ------------------------------------
    // WEATHER
    // ------------------------------------
    const w = state.weather || {};
    const weather = {
      data: {
        current: {
          temperature_2m: w.current?.temperature_2m ?? null,
          apparent_temperature: w.current?.apparent_temperature ?? null,
          weather_code: w.current?.weather_code ?? null,
          wind_speed_10m: w.current?.wind_speed_10m ?? null,
          relative_humidity_2m: w.current?.relative_humidity_2m ?? null
        },
        daily: w.daily ?? null
      }
    };

    // ------------------------------------
    // WAVES
    // ------------------------------------
    const wavesRaw = state.waves || {};
    const waves = {
      data: {
        heightFt: wavesRaw.heightFt ?? wavesRaw.data?.heightFt ?? [],
        heightM: wavesRaw.heightM ?? wavesRaw.data?.heightM ?? [],
        direction: wavesRaw.direction ?? wavesRaw.data?.direction ?? [],
        period: wavesRaw.period ?? wavesRaw.data?.period ?? [],
        derived: wavesRaw.derived ?? wavesRaw.data?.derived ?? {}
      }
    };

    // ------------------------------------
    // SARGASSUM
    // ------------------------------------
    const sargRaw = state.sargassum || {};
    const sargassum = {
      data: {
        value: sargRaw.value ?? sargRaw.data?.value ?? 0
      }
    };

    // ------------------------------------
    // MOON
    // ------------------------------------
    const moonRaw = state.moon || {};
    const moon = {
      data: {
        phase: moonRaw.phase ?? moonRaw.data?.phase ?? 0
      }
    };

    // ------------------------------------
    // STORMS
    // ------------------------------------
    const stormsRaw = state.storms || {};
    const storms = {
      data: {
        activeStorms:
          stormsRaw.activeStorms ??
          stormsRaw.data?.activeStorms ??
          stormsRaw.raw?.activeStorms ??
          []
      }
    };

    // ------------------------------------
    // WILDLIFE
    // ------------------------------------
    const wildlifeRaw = state.wildlife || {};
    const wildlife = {
      data: Object.fromEntries(
        Object.entries(wildlifeRaw)
          .filter(([k, v]) => typeof v === "boolean")
          .map(([k, v]) => [k.toLowerCase(), v])
      )
    };

    // ------------------------------------
    // HEAT INDEX
    // ------------------------------------
    const heatRaw = state.heatIndex || {};
    const heatIndex = {
      data: {
        heatIndex:
          heatRaw.heatIndex ??
          heatRaw.data?.heatIndex ??
          heatRaw.raw?.heatIndex ??
          null
      }
    };

    // ------------------------------------
    // FINAL NORMALIZED STATE
    // ------------------------------------
    return {
      weather,
      waves,
      sargassum,
      moon,
      storms,
      wildlife,
      heatIndex
    };

  } catch (err) {
    error("getEnvironmentState failed:", err);

    return {
      weather: { data: { current: {}, daily: null } },
      waves: { data: { heightFt: [], heightM: [], derived: {} } },
      sargassum: { data: { value: null } },
      moon: { data: { phase: null } },
      storms: { data: { activeStorms: [] } },
      wildlife: { data: {} },
      heatIndex: { data: { heatIndex: null } }
    };
  }
}
