import crypto from "node:crypto";

export const config = { api: { bodyParser: false } };

async function rawBody(req) {
  const chunks = [];
  for await (const chunk of req) chunks.push(Buffer.from(chunk));
  return Buffer.concat(chunks);
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).send("Method not allowed");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) return res.status(503).send("Webhook not configured");
  const signature = req.headers["stripe-signature"] || "";
  const parts = Object.fromEntries(signature.split(",").map((p) => p.split("=")));
  const timestamp = Number(parts.t);
  if (!timestamp || Math.abs(Date.now() / 1000 - timestamp) > 300 || !parts.v1) return res.status(400).send("Invalid signature");
  const body = await rawBody(req);
  const expected = crypto.createHmac("sha256", secret).update(`${timestamp}.`).update(body).digest("hex");
  const a = Buffer.from(expected), b = Buffer.from(parts.v1);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return res.status(400).send("Invalid signature");
  let event;
  try { event = JSON.parse(body.toString("utf8")); } catch (_) { return res.status(400).send("Invalid JSON"); }
  if (["checkout.session.completed", "checkout.session.async_payment_succeeded"].includes(event.type)) {
    const session = event.data?.object;
    if (session?.payment_status === "paid") console.info("Stripe payment confirmed", session.id, session.metadata?.order_reference || "no-reference");
  }
  return res.status(200).json({ received: true });
}
