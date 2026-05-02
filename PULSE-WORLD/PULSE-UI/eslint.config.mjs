// eslint.config.mjs
import js from "@eslint/js";
import globals from "globals";

export default [
  {
    files: ["**/*.js", "**/*.cjs", "**/*.mjs"],
    ignores: [
      "PULSE-OS/PulseIntentMap.js",
      "PULSE-OS/PulseOrganismMap.js",
      "PULSE-OS/PulseIQMap.js",
      "PULSE-ROUTER/**",
      "pulse-gpu/**",
      "PULSE-OS/PulseOSBrain.js",
      "PULSE-OS/PulseOSBrainEvolution.js",
      "PULSE-OS/PulseOSSpinalCord.js",
      "PULSE-PROXY/**"
    ],

    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },

    rules: {
      // ============================================================
      // CRITICAL — KEEP STRICT (REAL BUGS)
      // ============================================================
      "no-undef": "error",
      "no-dupe-keys": "error",
      "no-dupe-args": "error",
      "preserve-caught-error": "error",

      // ============================================================
      // NOISE REDUCTION — WARN OR DISABLE
      // ============================================================

      // OS organs + maps often have unused vars by design
      "no-unused-vars": [
        "warn",
        { varsIgnorePattern: "^Pulse", argsIgnorePattern: "^_" }
      ],

      // Allow empty catch blocks in OS boot layers
      "no-empty": [
        "warn",
        { allowEmptyCatch: true }
      ],

      // These are harmless in your architecture
      "no-useless-assignment": "warn",
      "no-self-assign": "warn",
      "no-useless-escape": "warn",

      // ============================================================
      // REASONABLE DEFAULTS
      // ============================================================
      "no-constant-condition": "warn",
      "no-unreachable": "warn",
      "no-extra-semi": "warn",
    },
  },
];
