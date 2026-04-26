// ============================================================================
//  v11‑EVO — PERMISSIONS ENGINE (Dual‑Band Safety Contract)
// ============================================================================

export const PermissionsMeta = Object.freeze({
  layer: "PulseAIPermissionsLayer",
  role: "PERMISSIONS_ENGINE",
  version: "11.1-EVO",
  identity: "aiPermissionsEngine-v11-EVO",

  evo: Object.freeze({
    deterministic: true,
    driftProof: true,
    dualband: true,
    permissionAware: true,
    boundaryAware: true,
    personaAware: true,
    multiInstanceReady: true,
    epoch: "v11-EVO"
  }),

  contract: Object.freeze({
    purpose:
      "Resolve permissions deterministically from persona, owner state, and universal forbidden actions.",

    never: Object.freeze([
      "mutate external systems",
      "introduce randomness",
      "invent permissions",
      "override forbidden actions",
      "override SafetyFrame decisions"
    ]),

    always: Object.freeze([
      "respect universal forbidden actions",
      "respect persona permissions",
      "respect owner override",
      "remain deterministic",
      "remain read-only"
    ])
  })
});

export function createPermissionsEngine({ context = {} } = {}) {
  const userIsOwner = context.userIsOwner === true;

  function resolve(personaId) {
    const persona = personaId || "neutral";
    const base = getPermissionsForPersona(persona, userIsOwner);

    // Apply universal forbidden actions
    const merged = Object.freeze({
      ...base,
      ...ForbiddenActions
    });

    return merged;
  }

  function check(personaId, action) {
    const perms = resolve(personaId);
    return perms[action] === true;
  }

  return Object.freeze({
    meta: PermissionsMeta,
    resolve,
    check
  });
}
