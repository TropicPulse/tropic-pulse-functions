// ============================================================================
// FILE: tropic-pulse-functions/apps/pulse-gpu/PulseGPUUXBridge.js
// PULSE GPU UX BRIDGE v7.7
// “INTELLIGENCE LAYER / COGNITIVE COMMUNICATION BRIDGE”
// ============================================================================
//
// SAFETY RULES (v7.7):
//   • NO randomness or timestamps
//   • NO DOM, WebGPU, Node, filesystem, or network APIs
//   • FAIL-OPEN: malformed advice/plan/insight must not break UXBridge
//   • SELF-REPAIR READY: notifications must be reconstructable + validateable
// ============================================================================

// ------------------------------------------------------
// ⭐ OS‑v7.7 Notification builder
// ------------------------------------------------------
function buildNotification({
  kind,
  severity,
  title,
  message,
  actions,
  meta
}) {
  const notif = {
    kind: kind || "performance",
    severity: severity || "low",
    title: title || "",
    message: message || "",
    meta: {
      layer: "PulseGPUUXBridge",
      version: 7.7,
      target: "full-gpu",
      selfRepairable: true,
      evo: {
        advantageCascadeAware: true,
        pulseEfficiencyAware: true,
        driftProof: true,
        multiInstanceReady: true
      },
      ...(meta || {})
    }
  };

  if (Array.isArray(actions) && actions.length > 0) {
    notif.actions = actions;
  }

  return notif;
}

// ------------------------------------------------------
// Notification validation (for healing layer)
// ------------------------------------------------------
function validateNotification(n) {
  if (!n || typeof n !== "object") return false;
  if (typeof n.kind !== "string") return false;
  if (typeof n.severity !== "string") return false;
  if (!n.meta || n.meta.layer !== "PulseGPUUXBridge") return false;
  return true;
}

// ------------------------------------------------------
// PulseGPUUXBridge v7.7 — Cognitive Communication Layer
// ------------------------------------------------------
class PulseGPUUXBridge {
  constructor() {}

  static meta = {
    layer: "PulseGPUUXBridge",
    version: 7.7,
    target: "full-gpu",
    selfRepairable: true,
    evo: {
      advantageCascadeAware: true,
      pulseEfficiencyAware: true,
      driftProof: true,
      multiInstanceReady: true
    }
  };

  // ----------------------------------------------------
  // Advisor result → notifications
  // ----------------------------------------------------
  fromAdvisorResult({ currentScore, baselineScore, deltaPercent, advice }) {
    if (!Array.isArray(advice) || advice.length === 0) return [];

    const notifications = [];

    advice.forEach((item) => {
      if (!item || typeof item !== "object") return;

      const { type, severity, deltaPercent: dp } = item;
      const gameId = item.gameProfile?.gameId || "this game";

      // REGRESSION
      if (type === "regression") {
        const title = "Performance drop detected";
        const message =
          typeof dp === "number"
            ? `Performance for ${gameId} is lower than your best-known configuration (${dp.toFixed(1)}%).`
            : `Performance for ${gameId} is lower than your best-known configuration.`;

        notifications.push(
          buildNotification({
            kind: "performance",
            severity,
            title,
            message,
            actions: [
              {
                label: "Restore best settings",
                actionType: "request-restore-best-settings",
                payload: {
                  gameProfile: item.gameProfile,
                  hardwareProfile: item.hardwareProfile,
                  tierProfile: item.tierProfile
                }
              }
            ],
            meta: {
              currentScore,
              baselineScore,
              deltaPercent: dp,
              repairHint: "restore-baseline-settings"
            }
          })
        );
      }

      // IMPROVEMENT
      else if (type === "improvement") {
        const title = "Performance improved";
        const message =
          typeof dp === "number"
            ? `Performance for ${gameId} is better than your previous best (${dp.toFixed(1)}%).`
            : `Performance for ${gameId} is better than your previous best.`;

        notifications.push(
          buildNotification({
            kind: "performance",
            severity,
            title,
            message,
            meta: {
              currentScore,
              baselineScore,
              deltaPercent: dp,
              repairHint: "promote-current-to-baseline"
            }
          })
        );
      }

      // SUBOPTIMAL
      else if (type === "suboptimal") {
        const title = "Better settings available";
        const message =
          typeof dp === "number"
            ? `Your current settings for ${gameId} are below your best-known configuration (${dp.toFixed(1)}% gap).`
            : `Your current settings for ${gameId} are below your best-known configuration.`;

        notifications.push(
          buildNotification({
            kind: "settings",
            severity,
            title,
            message,
            actions: [
              {
                label: "Apply optimal settings",
                actionType: "request-apply-optimal-settings",
                payload: {
                  gameProfile: item.gameProfile,
                  hardwareProfile: item.hardwareProfile,
                  tierProfile: item.tierProfile
                }
              }
            ],
            meta: {
              currentScore,
              baselineScore,
              deltaPercent: dp,
              repairHint: "suggest-baseline-settings"
            }
          })
        );
      }

      // TIER UPGRADE
      else if (type === "tier-upgrade-opportunity") {
        const title = "Higher tier performance available";
        const message =
          typeof dp === "number"
            ? `A higher tier configuration has historically delivered better performance for ${gameId} (~${dp.toFixed(1)}%).`
            : `A higher tier configuration has historically delivered better performance for ${gameId}.`;

        notifications.push(
          buildNotification({
            kind: "tier",
            severity,
            title,
            message,
            actions: [
              {
                label: "View tier options",
                actionType: "open-tier-upgrade-panel",
                payload: {
                  gameProfile: item.gameProfile,
                  hardwareProfile: item.hardwareProfile,
                  oldTierProfile: item.extra?.oldTierProfile,
                  newTierProfile: item.extra?.newTierProfile
                }
              }
            ],
            meta: {
              currentScore,
              baselineScore,
              deltaPercent: dp,
              repairHint: "upgrade-tier"
            }
          })
        );
      }
    });

    return notifications.filter(validateNotification);
  }

  // ----------------------------------------------------
  // Restore plan → notification
  // ----------------------------------------------------
  fromRestorePlan(plan) {
    if (!plan || typeof plan !== "object") return null;

    const { action, reason, extra } = plan;

    if (action === "noop") return null;

    if (action === "restore") {
      return buildNotification({
        kind: "settings",
        severity: "high",
        title: "Restore best-known settings",
        message:
          reason ||
          "Performance regressed; restoring best-known configuration is recommended.",
        actions: [
          {
            label: "Restore now",
            actionType: "apply-settings",
            payload: {
              mode: "restore",
              targetSettings: plan.targetSettings
            }
          }
        ],
        meta: {
          extra,
          repairHint: "restore-baseline-settings"
        }
      });
    }

    if (action === "apply-optimal") {
      return buildNotification({
        kind: "settings",
        severity: "medium",
        title: "Apply optimal settings",
        message:
          reason ||
          "Better settings are available based on your best-known performance.",
        actions: [
          {
            label: "Apply optimal settings",
            actionType: "apply-settings",
            payload: {
              mode: "optimal",
              targetSettings: plan.targetSettings
            }
          }
        ],
        meta: {
          extra,
          repairHint: "suggest-baseline-settings"
        }
      });
    }

    if (action === "upgrade-tier") {
      return buildNotification({
        kind: "tier",
        severity: "medium",
        title: "Tier upgrade opportunity",
        message:
          reason ||
          "A higher tier configuration has historically delivered better performance.",
        actions: [
          {
            label: "View tier options",
            actionType: "open-tier-upgrade-panel",
            payload: {
              oldTierProfile: extra?.oldTierProfile,
              newTierProfile: extra?.newTierProfile
            }
          }
        ],
        meta: {
          extra,
          repairHint: "upgrade-tier"
        }
      });
    }

    return null;
  }

  // ----------------------------------------------------
  // Insights → notifications
  // ----------------------------------------------------
  fromInsights(insights = []) {
    if (!Array.isArray(insights) || insights.length === 0) return [];

    const notifications = [];

    insights.forEach((insight) => {
      if (!insight || typeof insight !== "object") return;

      const { type, severity, message, stepId, deltaPercent } = insight;
      const gameId = insight.gameProfile?.gameId || "this game";

      if (type === "step-duration-change") {
        const faster = typeof deltaPercent === "number" && deltaPercent > 0;
        const title = faster
          ? "Faster experience detected"
          : "Slower experience detected";

        const msg =
          typeof deltaPercent === "number"
            ? `${message} For ${gameId}, step "${stepId}" changed by ${deltaPercent.toFixed(1)}%.`
            : `${message} For ${gameId}, step "${stepId}" changed.`;

        notifications.push(
          buildNotification({
            kind: "insight",
            severity,
            title,
            message: msg,
            meta: {
              stepId,
              deltaPercent,
              baselineAvgDurationMs: insight.baselineAvgDurationMs,
              currentAvgDurationMs: insight.currentAvgDurationMs,
              extra: insight.extra,
              repairHint: "recompute-insight"
            }
          })
        );
      }
    });

    return notifications.filter(validateNotification);
  }
}

// ------------------------------------------------------
// EXPORTS
// ------------------------------------------------------
export {
  PulseGPUUXBridge,
  buildNotification,
  validateNotification
};
