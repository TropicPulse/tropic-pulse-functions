// ======================================================
// PulseMarketplaceClient.js — Frontend Marketplace Client
// Lives in: /tropic-pulse/proxy/
// Public endpoint: https://tropicpulse.bz/proxy
// ======================================================

export class PulseMarketplaceClient {
  constructor({ deviceId, gpuInfo, baseUrl }) {
    this.deviceId = deviceId;
    this.gpuInfo = gpuInfo;

    // Your REAL backend endpoint
    this.baseUrl = baseUrl || "https://tropicpulse.bz/proxy";
  }

  // ---------------------------------------------
  // Register device with backend
  // ---------------------------------------------
  async register() {
    try {
      const res = await fetch(`${this.baseUrl}/registerDevice`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deviceId: this.deviceId,
          gpuInfo: this.gpuInfo
        })
      });

      return await res.json();
    } catch (err) {
      console.error("PulseMarketplaceClient.register() failed:", err);
      return { error: true, message: err.message };
    }
  }

  // ---------------------------------------------
  // Request a compute job from backend
  // ---------------------------------------------
  async requestJob() {
    try {
      const res = await fetch(
        `${this.baseUrl}/getJob?deviceId=${this.deviceId}`
      );

      return await res.json();
    } catch (err) {
      console.error("PulseMarketplaceClient.requestJob() failed:", err);
      return { error: true, message: err.message };
    }
  }

  // ---------------------------------------------
  // Submit job result back to backend
  // ---------------------------------------------
  async submitResult(jobId, result) {
    try {
      const res = await fetch(`${this.baseUrl}/submitJob`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          deviceId: this.deviceId,
          jobId,
          result
        })
      });

      return await res.json();
    } catch (err) {
      console.error("PulseMarketplaceClient.submitResult() failed:", err);
      return { error: true, message: err.message };
    }
  }

  // ---------------------------------------------
  // Sync credits (points/tokens/etc.)
  // ---------------------------------------------
  async syncCredits() {
    try {
      const res = await fetch(
        `${this.baseUrl}/syncCredits?deviceId=${this.deviceId}`
      );

      return await res.json();
    } catch (err) {
      console.error("PulseMarketplaceClient.syncCredits() failed:", err);
      return { error: true, message: err.message };
    }
  }
}