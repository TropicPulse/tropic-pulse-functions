// PulseIdentity.js (FRONTEND)
// Universal identity grabber for all pages

export async function identity() {
  try {
    const res = await fetch("/.netlify/functions/CheckIdentity", {
      method: "GET",
      credentials: "include"
    });

    if (!res.ok) return null;

    const data = await res.json();
    return data || null;
  } catch (err) {
    console.error("Identity fetch failed:", err);
    return null;
  }
}
