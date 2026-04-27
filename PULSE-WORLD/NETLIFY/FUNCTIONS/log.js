import { logToFirebase } from "../logToFirebase.js";

export async function handler(req, res) {
  try {
    const body = await req.json();

    await logToFirebase(body.level, body.message, body.rest);

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ ok: false, error: err.message }), { status: 500 });
  }
}
