// ============================================================================
// PulseOrganismMap.js — v10.4
// Evolutionary Intelligence Blueprint for the PulseOS Organism
// Deterministic • Static • Zero-Call • Zero-Discovery • Genome-Level Truth
// ============================================================================

export const PulseOrganismMap = {
  version: "10.4-deterministic",

  // ========================================================================
  // SYSTEMS — The organism’s macro-structure
  // ========================================================================
  systems: {
    // ----------------------------------------------------------------------
    // pulse-os — Core CNS, Memory, Reflex, Immune, Membranes, Survival
    // ----------------------------------------------------------------------
    "pulse-os": {
      role: "Core Operating System / CNS / Memory / Reflex / Immune / Membranes / Survival",
      root: "pulse-os",
      organs: [
        "PulseOrganismMap",
        "PulseIntentMap",
        "PulseIQMap",
        "PulseOSBBB",
        "PulseOSBrain",
        "PulseOSBrainCortex",
        "PulseOSBrainEvolution",
        "PulseOSBrainStem",
        "PulseSDN",                     // NEW — Software-Defined Nervous System
        "PulseOSFightFlightResponse",
        "PulseOSGovernor",
        "PulseOSImmuneSystem",
        "PulseOSInflammatoryResponse",
        "PulseOSLiverMemory",
        "PulseOSLongTermMemory",
        "PulseOSMucusMembrane",
        "PulseOSOrganMembrane",
        "PulseOSSensoryCortex",
        "PulseOSShortTermMemory",
        "PulseOSSkinReflex",
        "PulseOSSurvivalInstincts",
        "PulseOSThymus",
        "PulseOSTissueMembrane",
        "RouteDownAlert"
      ]
    },

    // ----------------------------------------------------------------------
    // pulse-design — Repo, Manifest, Classification, Translation
    // ----------------------------------------------------------------------
    "pulse-design": {
      role: "Design / Repo / Manifest / Code Translator / File Classification",
      root: "pulse-design",
      organs: [
        "fileClassifier",
        "manifestBuilder",
        "manifestWriter",
        "translator",
        "repoWalker"
      ]
    },

    // ----------------------------------------------------------------------
    // pulse-earn — Economy, Rewards, Market, Biological Earn Engine
    // ----------------------------------------------------------------------
    "pulse-earn": {
      role: "Economy / Rewards / Market / Biological Earn Engine",
      root: "pulse-earn",
      organs: [
        "PulseEarn",
        "PulseEarnCell",
        "PulseEarnCirculatorySystem",
        "PulseEarnCustomReceptor",
        "PulseEarnEndocrineSystem",
        "PulseEarnGeneticMemory",
        "PulseEarnGenome",
        "PulseEarnHeart",
        "PulseEarnImmuneSystem",
        "PulseEarnLymphNodes",
        "PulseEarnMetabolism",
        "PulseEarnMktAmbassador",
        "PulseEarnMktAuctioneer",
        "PulseEarnMktBroker",
        "PulseEarnMktConsulate",
        "PulseEarnMktCourier",
        "PulseEarnMktEmbassyLedger",
        "PulseEarnMktForager",
        "PulseEarnMuscleSystem",
        "PulseEarnNervousSystem",
        "PulseEarnReceptor",
        "PulseEarnReflex",
        "PulseEarnReflexRouter",
        "PulseEarnSkeletalSystem",
        "PulseEarnSurvivalInstincts",
        "PulseEarnSendSystem",          // v10.4 governed Earn → Pulse → Send
        "PulseEarnContinuancePulse",    // v10.4 Earn continuance / legacy bridge
        "PulseEarnTest"
      ]
    },

    // ----------------------------------------------------------------------
    // pulse-gpu — v10.4 Deterministic GPU Organ
    // ----------------------------------------------------------------------
    "pulse-gpu": {
      role: "GPU / Acceleration / Deterministic Compute",
      root: "pulse-gpu",
      organs: [
        "PulseGPUv10"                   // replaces all astral GPU stack
      ]
    },

    // ----------------------------------------------------------------------
    // pulse-mesh — Aura, Cognition, Endocrine, Immune, Cortex, Senses
    // ----------------------------------------------------------------------
    "pulse-mesh": {
      role: "Mesh / Aura / Cognition / Endocrine / Immune / Cortex / Senses / Survival",
      root: "pulse-mesh",
      organs: [
        "PulseMeshAura",
        "PulseMeshAwareness",
        "PulseMeshCognition",
        "PulseMeshCortex",
        "PulseMeshEcho",
        "PulseMeshEndocrineSystem",
        "PulseMeshEnvironmentalField",
        "PulseMeshEvolutionaryWiring",
        "PulseMeshOrgans",
        "PulseMeshFlow",
        "PulseMeshHormones",
        "PulseMeshImmuneMembrane",
        "PulseMeshImmuneSystem",
        "PulseMeshSenses",
        "PulseMeshSkin",
        "PulseMeshSpine",
        "PulseMeshSurvivalInstincts",
        "PulseMeshTendons",
        "PulseMeshThalamus"
      ]
    },

    // ----------------------------------------------------------------------
    // pulse-proxy — Edge, Adrenal, Pressure, Vitals, Spine, Blood
    // ----------------------------------------------------------------------
    "pulse-proxy": {
      role: "Proxy / Edge / Adrenal / Pressure / Vitals / Spine / Blood",
      root: "pulse-proxy",
      organs: [
        "CheckBand",
        "CheckIdentity",
        "CheckRouterMemory",
        "PulseProxyAdrenalSystem",
        "PulseProxyBBB",
        "PulseProxyBloodPressure",
        "PulseProxyBloodStream",
        "PulseProxyCirculatorySystem",
        "PulseProxyHeart",
        "PulseProxyHeartBeat",
        "PulseProxyHypothalamus",
        "PulseProxyImpulse",
        "PulseProxyLimbic",
        "PulseProxyOuterAgent",
        "PulseProxySpine",
        "PulseProxySynapse",
        "PulseProxyVitalsLogger",
        "PulseProxyVitalsMonitor",
        "PulseProxyWBCells"
      ]
    },

    // ----------------------------------------------------------------------
    // pulse-router — Evolutionary Routing Thought
    // ----------------------------------------------------------------------
    "pulse-router": {
      role: "Routing / Evolutionary Thought",
      root: "pulse-router",
      organs: [
        "PulseRouterEvolutionaryThought"
      ]
    },

    // ----------------------------------------------------------------------
    // pulse-send — Outbound Delivery (v10.4 Deterministic)
    // ----------------------------------------------------------------------
    "pulse-send": {
      role: "Outbound / Delivery / Deterministic Send",
      root: "pulse-send",
      organs: [
        "PulseSendSystem"               // replaces legacy send stack
      ]
    },

    // ----------------------------------------------------------------------
    // pulse-shifter — Evolutionary Pulse Shifting
    // ----------------------------------------------------------------------
    "pulse-shifter": {
      role: "Shifting / Evolutionary Pulse",
      root: "pulse-shifter",
      organs: [
        "PulseShifterEvolutionaryPulse"
      ]
    },

    // ----------------------------------------------------------------------
    // pulse-specs — DNA, Genome, Specs
    // ----------------------------------------------------------------------
    "pulse-specs": {
      role: "Specs / DNA / Genome",
      root: "pulse-specs",
      organs: [
        "PulseSpecsDNAGenome"
      ]
    },

    // ----------------------------------------------------------------------
    // pulse-translator — RNA, Intake, Output
    // ----------------------------------------------------------------------
    "pulse-translator": {
      role: "Translator / RNA / Skeletal Intake / Output",
      root: "pulse-translator",
      organs: [
        "PulseTranslatorRNAIntake",
        "PulseTranslatorRNAOutput",
        "PulseTranslatorSkeletalIntake",
        "PulseTranslatorSkeletalOutput"
      ]
    }
  },

  // ========================================================================
  // ORGANS — Evolutionary Biological + System-Level Intelligence Map
  // ========================================================================
  organs: {
    // ======================================================================
    // pulse-os — Core CNS, Reflex, Memory, Immune, Membranes, Survival
    // ======================================================================
    PulseBrainInstincts:        { bio: "CNS / Instinct Cortex",          system: "pulse-os", file: "pulse-os/PulseBrainInstincts.js" },
    PulseIQ:                    { bio: "CNS / Intelligence Core",        system: "pulse-os", file: "pulse-os/PulseIQMap.js" },
    PulseOSBBB:                 { bio: "Membrane / Blood-Brain Barrier", system: "pulse-os", file: "pulse-os/PulseOSBBB.js" },
    PulseOSBrain:               { bio: "CNS / Brain",                    system: "pulse-os", file: "pulse-os/PulseOSBrain.js" },
    PulseOSBrainCortex:         { bio: "CNS / Cortex",                   system: "pulse-os", file: "pulse-os/PulseOSBrainCortex.js" },
    PulseOSBrainEvolution:      { bio: "CNS / Evolution Layer",          system: "pulse-os", file: "pulse-os/PulseOSBrainEvolution.js" },
    PulseOSBrainStem:           { bio: "CNS / Brain Stem",               system: "pulse-os", file: "pulse-os/PulseOSBrainStem.js" },
    PulseSDN:                   { bio: "CNS / Software-Defined Nervous System", system: "pulse-os", file: "pulse-sdn/PulseSDN.js" },
    PulseOSFightFlightResponse: { bio: "Reflex / Adrenal / Survival",    system: "pulse-os", file: "pulse-os/PulseOSFightFlightResponse.js" },
    PulseOSGovernor:            { bio: "CNS / Executive Function",       system: "pulse-os", file: "pulse-os/PulseOSGovernor.js" },
    PulseOSImmuneSystem:        { bio: "Immune System",                  system: "pulse-os", file: "pulse-os/PulseOSImmuneSystem.js" },
    PulseOSInflammatoryResponse:{ bio: "Immune / Inflammation",          system: "pulse-os", file: "pulse-os/PulseOSInflammatoryResponse.js" },
    PulseOSLiverMemory:         { bio: "Metabolic / Memory",             system: "pulse-os", file: "pulse-os/PulseOSLiverMemory.js" },
    PulseOSLongTermMemory:      { bio: "Memory / Long-Term",             system: "pulse-os", file: "pulse-os/PulseOSLongTermMemory.js" },
    PulseOSMucusMembrane:       { bio: "Membrane / Mucosal Defense",     system: "pulse-os", file: "pulse-os/PulseOSMucusMembrane.js" },
    PulseOSOrganMembrane:       { bio: "Membrane / Organ Barrier",       system: "pulse-os", file: "pulse-os/PulseOSOrganMembrane.js" },
    PulseOSSensoryCortex:       { bio: "CNS / Sensory Cortex",           system: "pulse-os", file: "pulse-os/PulseOSSensoryCortex.js" },
    PulseOSShortTermMemory:     { bio: "Memory / Short-Term",            system: "pulse-os", file: "pulse-os/PulseOSShortTermMemory.js" },
    PulseOSSkinReflex:          { bio: "Reflex / Skin",                  system: "pulse-os", file: "pulse-os/PulseOSSkinReflex.js" },
    PulseOSSurvivalInstincts:   { bio: "Survival / Instinct Engine",     system: "pulse-os", file: "pulse-os/PulseOSSurvivalInstincts.js" },
    PulseOSThymus:              { bio: "Immune / Thymus",                system: "pulse-os", file: "pulse-os/PulseOSThymus.js" },
    PulseOSTissueMembrane:      { bio: "Membrane / Tissue Layer",        system: "pulse-os", file: "pulse-os/PulseOSTissueMembrane.js" },
    RouteDownAlert:             { bio: "Alert / System Down",            system: "pulse-os", file: "pulse-os/RouteDownAlert.js" },

    // ======================================================================
    // pulse-design — Repo, Manifest, Classification, Translation
    // ======================================================================
    fileClassifier:   { bio: "Design / Classification", system: "pulse-design", file: "pulse-design/fileClassifier.js" },
    manifestBuilder:  { bio: "Design / Manifest Build", system: "pulse-design", file: "pulse-design/manifestBuilder.js" },
    manifestWriter:   { bio: "Design / Manifest Write", system: "pulse-design", file: "pulse-design/manifestWriter.js" },
    translator:       { bio: "Design / Translator",     system: "pulse-design", file: "pulse-design/translator.js" },
    repoWalker:       { bio: "Design / Repo Walker",    system: "pulse-design", file: "pulse-design/repoWalker.js" },

    // ======================================================================
    // pulse-earn — Economy, Market, Rewards, Biological Earn Engine
    // ======================================================================
    PulseEarn:                   { bio: "Economy / Core",               system: "pulse-earn", file: "pulse-earn/PulseEarn.js" },
    PulseEarnCell:               { bio: "Cellular / Earn Cell",         system: "pulse-earn", file: "pulse-earn/PulseEarnCell.js" },
    PulseEarnCirculatorySystem:  { bio: "Circulatory",                  system: "pulse-earn", file: "pulse-earn/PulseEarnCirculatorySystem.js" },
    PulseEarnCustomReceptor:     { bio: "Receptor / Custom",            system: "pulse-earn", file: "pulse-earn/PulseEarnCustomReceptor.js" },
    PulseEarnEndocrineSystem:    { bio: "Endocrine",                    system: "pulse-earn", file: "pulse-earn/PulseEarnEndocrineSystem.js" },
    PulseEarnGeneticMemory:      { bio: "Memory / Genetic",             system: "pulse-earn", file: "pulse-earn/PulseEarnGeneticMemory.js" },
    PulseEarnGenome:             { bio: "Genome",                       system: "pulse-earn", file: "pulse-earn/PulseEarnGenome.js" },
    PulseEarnHeart:              { bio: "Circulatory / Heart",          system: "pulse-earn", file: "pulse-earn/PulseEarnHeart.js" },
    PulseEarnImmuneSystem:       { bio: "Immune",                       system: "pulse-earn", file: "pulse-earn/PulseEarnImmuneSystem.js" },
    PulseEarnLymphNodes:         { bio: "Immune / Lymph Nodes",         system: "pulse-earn", file: "pulse-earn/PulseEarnLymphNodes.js" },
    PulseEarnMetabolism:         { bio: "Metabolism",                   system: "pulse-earn", file: "pulse-earn/PulseEarnMetabolism.js" },
    PulseEarnMktAmbassador:      { bio: "Market / Ambassador",          system: "pulse-earn", file: "pulse-earn/PulseEarnMktAmbassador.js" },
    PulseEarnMktAuctioneer:      { bio: "Market / Auctioneer",          system: "pulse-earn", file: "pulse-earn/PulseEarnMktAuctioneer.js" },
    PulseEarnMktBroker:          { bio: "Market / Broker",              system: "pulse-earn", file: "pulse-earn/PulseEarnMktBroker.js" },
    PulseEarnMktConsulate:       { bio: "Market / Consulate",           system: "pulse-earn", file: "pulse-earn/PulseEarnMktConsulate.js" },
    PulseEarnMktCourier:         { bio: "Market / Courier",             system: "pulse-earn", file: "pulse-earn/PulseEarnMktCourier.js" },
    PulseEarnMktEmbassyLedger:   { bio: "Market / Ledger",              system: "pulse-earn", file: "pulse-earn/PulseEarnMktEmbassyLedger.js" },
    PulseEarnMktForager:         { bio: "Market / Forager",             system: "pulse-earn", file: "pulse-earn/PulseEarnMktForager.js" },
    PulseEarnMuscleSystem:       { bio: "Muscular",                     system: "pulse-earn", file: "pulse-earn/PulseEarnMuscleSystem.js" },
    PulseEarnNervousSystem:      { bio: "Nervous",                      system: "pulse-earn", file: "pulse-earn/PulseEarnNervousSystem.js" },
    PulseEarnReceptor:           { bio: "Receptor",                     system: "pulse-earn", file: "pulse-earn/PulseEarnReceptor.js" },
    PulseEarnReflex:             { bio: "Reflex",                       system: "pulse-earn", file: "pulse-earn/PulseEarnReflex.js" },
    PulseEarnReflexRouter:       { bio: "Reflex / Router",              system: "pulse-earn", file: "pulse-earn/PulseEarnReflexRouter.js" },
    PulseEarnSkeletalSystem:     { bio: "Skeletal",                     system: "pulse-earn", file: "pulse-earn/PulseEarnSkeletalSystem.js" },
    PulseEarnSurvivalInstincts:  { bio: "Survival",                     system: "pulse-earn", file: "pulse-earn/PulseEarnSurvivalInstincts.js" },
    PulseEarnSendSystem:         { bio: "Outbound / Earn → Pulse → Send", system: "pulse-earn", file: "pulse-earn/PulseEarnSendSystem.js" },
    PulseEarnContinuancePulse:   { bio: "Continuance / Legacy Bridge",  system: "pulse-earn", file: "pulse-earn/PulseEarnContinuancePulse.js" },
    PulseEarnTest:               { bio: "Testing",                      system: "pulse-earn", file: "pulse-earn/PulseEarnTest.js" },

    // ======================================================================
    // pulse-gpu — v10.4 Deterministic GPU Organ
    // ======================================================================
    PulseGPUv10:                 { bio: "GPU / Deterministic Organ",    system: "pulse-gpu", file: "pulse-gpu/PulseGPUv10.js" },

    // ======================================================================
    // pulse-mesh — Aura, Cognition, Endocrine, Immune, Cortex, Senses
    // ======================================================================
    PulseMeshAura:               { bio: "Aura",                         system: "pulse-mesh", file: "pulse-mesh/PulseMeshAura.js" },
    PulseMeshAwareness:          { bio: "Awareness",                    system: "pulse-mesh", file: "pulse-mesh/PulseMeshAwareness.js" },
    PulseMeshCognition:          { bio: "Cognition",                    system: "pulse-mesh", file: "pulse-mesh/PulseMeshCognition.js" },
    PulseMeshCortex:             { bio: "Cortex",                       system: "pulse-mesh", file: "pulse-mesh/PulseMeshCortex.js" },
    PulseMeshEcho:               { bio: "Echo / Feedback",              system: "pulse-mesh", file: "pulse-mesh/PulseMeshEcho.js" },
    PulseMeshEndocrineSystem:    { bio: "Endocrine",                    system: "pulse-mesh", file: "pulse-mesh/PulseMeshEndocrineSystem.js" },
    PulseMeshEnvironmentalField: { bio: "Environmental Field",          system: "pulse-mesh", file: "pulse-mesh/PulseMeshEnvironmentalField.js" },
    PulseMeshEvolutionaryWiring: { bio: "Evolutionary Wiring",          system: "pulse-mesh", file: "pulse-mesh/PulseMeshEvolutionaryWiring.js" },
    PulseMeshOrgans:             { bio: "Organ Layer",                  system: "pulse-mesh", file: "pulse-mesh/PulseMeshOrgans.js" },
    PulseMeshFlow:               { bio: "Flow / Circulation",           system: "pulse-mesh", file: "pulse-mesh/PulseMeshFlow.js" },
    PulseMeshHormones:           { bio: "Endocrine / Hormones",         system: "pulse-mesh", file: "pulse-mesh/PulseMeshHormones.js" },
    PulseMeshImmuneMembrane:     { bio: "Immune / Membrane",            system: "pulse-mesh", file: "pulse-mesh/PulseMeshImmuneMembrane.js" },
    PulseMeshImmuneSystem:       { bio: "Immune",                       system: "pulse-mesh", file: "pulse-mesh/PulseMeshImmuneSystem.js" },
    PulseMeshSenses:             { bio: "Sensory",                      system: "pulse-mesh", file: "pulse-mesh/PulseMeshSenses.js" },
    PulseMeshSkin:               { bio: "Skin",                         system: "pulse-mesh", file: "pulse-mesh/PulseMeshSkin.js" },
    PulseMeshSpine:              { bio: "Spine",                        system: "pulse-mesh", file: "pulse-mesh/PulseMeshSpine.js" },
    PulseMeshSurvivalInstincts:  { bio: "Survival",                     system: "pulse-mesh", file: "pulse-mesh/PulseMeshSurvivalInstincts.js" },
    PulseMeshTendons:            { bio: "Tendons",                      system: "pulse-mesh", file: "pulse-mesh/PulseMeshTendons.js" },
    PulseMeshThalamus:           { bio: "Thalamus",                     system: "pulse-mesh", file: "pulse-mesh/PulseMeshThalamus.js" },

    // ======================================================================
    // pulse-proxy — Edge, Adrenal, Pressure, Vitals, Spine, Blood
    // ======================================================================
    CheckBand:                   { bio: "Healer / Band Check",          system: "pulse-proxy", file: "pulse-proxy/CheckBand.js" },
    CheckIdentity:               { bio: "Healer / Identity Check",      system: "pulse-proxy", file: "pulse-proxy/CheckIdentity.js" },
    CheckRouterMemory:           { bio: "Healer / Router Memory Check", system: "pulse-proxy", file: "pulse-proxy/CheckRouterMemory.js" },
    PulseProxyAdrenalSystem:     { bio: "Adrenal / Stress",             system: "pulse-proxy", file: "pulse-proxy/PulseProxyAdrenalSystem.js" },
    PulseProxyBBB:               { bio: "Proxy / BBB",                  system: "pulse-proxy", file: "pulse-proxy/PulseProxyBBB.js" },
    PulseProxyBloodPressure:     { bio: "Proxy / Blood Pressure",       system: "pulse-proxy", file: "pulse-proxy/PulseProxyBloodPressure.js" },
    PulseProxyBloodStream:       { bio: "Proxy / Blood Stream",         system: "pulse-proxy", file: "pulse-proxy/PulseProxyBloodStream.js" },
    PulseProxyCirculatorySystem: { bio: "Proxy / Circulatory",          system: "pulse-proxy", file: "pulse-proxy/PulseProxyCirculatorySystem.js" },
    PulseProxyHeart:             { bio: "Proxy / Heart",                system: "pulse-proxy", file: "pulse-proxy/PulseProxyHeart.js" },
    PulseProxyHeartBeat:         { bio: "Proxy / HeartBeat",            system: "pulse-proxy", file: "pulse-proxy/PulseProxyHeartBeat.js" },
    PulseProxyHypothalamus:      { bio: "Proxy / Hypothalamus",         system: "pulse-proxy", file: "pulse-proxy/PulseProxyHypothalamus.js" },
    PulseProxyImpulse:           { bio: "Proxy / Impulse",              system: "pulse-proxy", file: "pulse-proxy/PulseProxyImpulse.js" },
    PulseProxyLimbic:            { bio: "Proxy / Limbic",               system: "pulse-proxy", file: "pulse-proxy/PulseProxyLimbic.js" },
    PulseProxyOuterAgent:        { bio: "Proxy / Outer Agent",          system: "pulse-proxy", file: "pulse-proxy/PulseProxyOuterAgent.js" },
    PulseProxySpine:             { bio: "Proxy / Spine",                system: "pulse-proxy", file: "pulse-proxy/PulseProxySpine.js" },
    PulseProxySynapse:           { bio: "Proxy / Synapse",              system: "pulse-proxy", file: "pulse-proxy/PulseProxySynapse.js" },
    PulseProxyVitalsLogger:      { bio: "Proxy / Vitals Logger",        system: "pulse-proxy", file: "pulse-proxy/PulseProxyVitalsLogger.js" },
    PulseProxyVitalsMonitor:     { bio: "Proxy / Vitals Monitor",       system: "pulse-proxy", file: "pulse-proxy/PulseProxyVitalsMonitor.js" },
    PulseProxyWBCells:           { bio: "Proxy / White Blood Cells",    system: "pulse-proxy", file: "pulse-proxy/PulseProxyWBCells.js" },

    // ======================================================================
    // pulse-router — Evolutionary Routing Thought
    // ======================================================================
    PulseRouterEvolutionaryThought: {
      bio: "Routing / Evolutionary Thought",
      system: "pulse-router",
      file: "pulse-router/PulseRouterEvolutionaryThought.js"
    },

    // ======================================================================
    // pulse-send — Outbound / Deterministic Send
    // ======================================================================
    PulseSendSystem: {
      bio: "Outbound / Deterministic Send System",
      system: "pulse-send",
      file: "pulse-send/PulseSendSystem.js"
    },

    // ======================================================================
    // pulse-shifter — Evolutionary Pulse Shifting
    // ======================================================================
    PulseShifterEvolutionaryPulse: {
      bio: "Shifting / Evolutionary Pulse",
      system: "pulse-shifter",
      file: "pulse-shifter/PulseShifterEvolutionaryPulse.js"
    },

    // ======================================================================
    // pulse-specs — DNA, Genome, Specs
    // ======================================================================
    PulseSpecsDNAGenome: {
      bio: "Specs / DNA / Genome",
      system: "pulse-specs",
      file: "pulse-specs/PulseSpecsDNAGenome.js"
    },

    // ======================================================================
    // pulse-translator — RNA, Intake, Output
    // ======================================================================
    PulseTranslatorRNAIntake: {
      bio: "Translator / RNA Intake",
      system: "pulse-translator",
      file: "pulse-translator/PulseTranslatorRNAIntake.js"
    },
    PulseTranslatorRNAOutput: {
      bio: "Translator / RNA Output",
      system: "pulse-translator",
      file: "pulse-translator/PulseTranslatorRNAOutput.js"
    },
    PulseTranslatorSkeletalIntake: {
      bio: "Translator / Skeletal Intake",
      system: "pulse-translator",
      file: "pulse-translator/PulseTranslatorSkeletalIntake.js"
    },
    PulseTranslatorSkeletalOutput: {
      bio: "Translator / Skeletal Output",
      system: "pulse-translator",
      file: "pulse-translator/PulseTranslatorSkeletalOutput.js"
    }
  },

  // ========================================================================
  // BASE LAYER + ROUTING LAYER — OLD NAMES → NEW ORGANISM NAMES
  // ========================================================================
  aliases: {
    // ----------------------------------------------------------------------
    // BASE LAYERS — The original Pulse foundation (old → new)
    // ----------------------------------------------------------------------
    base: {
      PulseBand: {
        old: ["PulseBand.js", "PulseBand"],
        now: [
          "PulseOSSkinReflex",
          "PulseOSSensoryCortex",
          "PulseProxyImpulse"
        ],
        note: "UI → Pulse entry point (touch, senses, impulse)"
      },

      PulseNet: {
        old: ["PulseNet.js", "PulseNet"],
        now: ["PulseSDN"],
        note: "Network intelligence → Software-Defined Nervous System"
      },

      PulseClient: {
        old: ["PulseClient.js", "PulseClient"],
        now: ["PulseProxyImpulse", "PulseProxySpine"],
        note: "Frontend router → Impulse + backend spine"
      },

      PulseUpdate: {
        old: ["PulseUpdate.js", "PulseUpdate"],
        now: ["PulseOSBrainEvolution", "PulseIQ"],
        note: "Self‑update → Brain evolution + intelligence"
      },

      PulseIdentity: {
        old: ["PulseIdentity.js", "PulseIdentity"],
        now: ["PulseProxyBBB.js", "PulseProxyBBB"],
        note: "Identity → Membrane + validator"
      }
    },

    // ----------------------------------------------------------------------
    // ROUTING LAYERS — The original routing chain (old → new)
    // ----------------------------------------------------------------------
    routing: {
      Router: {
        old: ["router.js", "Router", "PulseRouter.js"],
        now: ["PulseRouterEvolutionaryThought"],
        note: "Routing engine → Evolutionary routing thought"
      },

      RouterMemory: {
        old: ["RouterMemory.js", "RouterMemory"],
        now: ["PulseOSShortTermMemory", "PulseOSTissueMembrane"],
        note: "Routing memory → Reflex memory + tissue membrane"
      },

      CheckRouterMemory: {
        old: ["CheckRouterMemory.js", "CheckRouterMemory"],
        now: ["CheckRouterMemory"],
        note: "Backend memory healer (same name)"
      },

      BackendEndpoint: {
        old: ["endpoint.js", "Endpoint"],
        now: ["PulseProxyOuterAgent"],
        note: "Backend entry → Outer agent"
      },

      BackendRouter: {
        old: ["index.js", "BackendRouter"],
        now: ["PulseProxySpine"],
        note: "Backend router → Proxy spine"
      }
    },

    // ----------------------------------------------------------------------
    // ROUTE CHAIN — Old → New (for humans + AI)
    // ----------------------------------------------------------------------
    routeChain: {
      old: [
        "PulseBand",
        "PulseNet",
        "PulseClient",
        "router.js",
        "organ",
        "PulseSend",
        "backend"
      ],
      now: [
        "PulseOSSkinReflex / PulseOSSensoryCortex",
        "PulseSDN",
        "PulseProxyImpulse",
        "PulseRouterEvolutionaryThought",
        "Organ (from PulseOrganismMap)",
        "PulseSendSystem",
        "PulseProxySpine"
      ],
      note: "This is the true nervous system route chain."
    }
  }
};
