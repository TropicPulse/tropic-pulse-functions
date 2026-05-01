import { db } from "./helpers.js";

export async function handler(event) {
  try {
    const body = JSON.parse(event.body || "{}");

    await db.collection("PULSE_LOGS").add({
      level: body.level || "info",
      message: body.message || "",
      meta: body.meta || {},
      timestamp: Date.now()
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ ok: true })
    };

  } catch (err) {
    console.error("Firebase logging error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ ok: false, error: err.message })
    };
  }
}
