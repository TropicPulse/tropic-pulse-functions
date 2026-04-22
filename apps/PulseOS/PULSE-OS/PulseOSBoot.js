// ============================================================
//  PULSE OS BOOTSTRAP — ENTRYPOINT
//  Loads IntentMap, OrganismMap, Understanding, then Brain.
// ============================================================

import { PulseIntentMap } from "./PULSE-OS/PulseIntentMap.js";
import { PulseOrganismMap } from "./PULSE-OS/PulseOrganismMap.js";
import { PulseUnderstanding } from "./PULSE-OS/PulseUnderstanding.js";
import { cognitiveBootstrap } from "./PULSE-OS/PulseOSBrain.js";

export function bootPulseOS() {

  // 1. Load founder laws (WHY)
  const intent = PulseIntentMap;

  // 2. Load organism structure (WHAT + WHERE)
  const organism = PulseOrganismMap;

  // 3. Bind maps together (HOW)
  const understanding = new PulseUnderstanding(intent, organism);

  // 4. Start the Brain (WHO)
  const brain = cognitiveBootstrap({
    intent,
    organism,
    understanding
  });

  return brain;
}
