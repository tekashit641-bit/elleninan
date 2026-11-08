import { noStore, requireAdmin } from "./_admin-auth.js";

function stripeHeaders() {
  return { Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}` };
}

export default async function handler(req, res) {
  noStore(res);
  if (req.method !== "GET") return res.status(405).json({ error: "Méthode non autorisée." });
  if (!requireAdmin(req, res)) return;
  const key = process.env.STRIPE_SECRET_KEY || "";
  if (!key.startsWith("sk_")) return res.status(503).json({ error: "STRIPE_SECRET_KEY n’est pas configurée dans Vercel." });

  const cursor = String(req.query?.starting_after || "");
  if (cursor && !/^cs_(?:test|live)_[A-Za-z0-9]+$/.test(cursor)) return res.status(400).json({ error: "Curseur invalide." });
  const query = new URLSearchParams({ status: "complete", limit: "100" });
  query.append("expand[]", "data.line_items");
  if (cursor) query.set("starting_after", cursor);

  try {
    const response = await fetch(`https://api.stripe.com/v1/checkout/sessions?${query}`, { headers: stripeHeaders() });
    const result = await response.json();
    if (!response.ok) {
      console.error("Admin Stripe list error", result.error?.type, result.error?.code);
      return res.status(502).json({ error: "Impossible de charger les commandes depuis Stripe. Vérifiez la clé du compte." });
    }
    const orders = (result.data || []).filter((session) => session.mode === "payment" && /^ELN-/.test(session.metadata?.order_reference || "")).map((session) => ({
      id: session.id,
      reference: session.metadata.order_reference,
      created: session.created,
      amount: session.amount_total || 0,
      currency: session.currency || "eur",
      paymentStatus: session.payment_status || "unpaid",
      paymentMethods: session.payment_method_types || [],
      customerName: session.metadata.customer_name || session.customer_details?.name || "",
      email: session.customer_details?.email || session.customer_email || "",
      phone: session.metadata.customer_phone || session.customer_details?.phone || "",
      address: session.metadata.delivery_address || "",
      fulfillmentStatus: session.metadata.fulfillment_status || "À confirmer",
      fulfillmentUpdatedAt: session.metadata.fulfillment_updated_at || "",
      items: (session.line_items?.data || []).map((item) => ({
        name: item.description || item.price?.product?.name || "Article",
        quantity: item.quantity || 0,
        amount: item.amount_total || 0,
        currency: item.currency || session.currency || "eur"
      }))
    }));
    const last = result.data?.[result.data.length - 1];
    return res.status(200).json({ orders, nextCursor: result.has_more && last ? last.id : null, testMode: key.startsWith("sk_test_") });
  } catch (_) {
    return res.status(502).json({ error: "Stripe est momentanément indisponible. Réessayez." });
  }
}