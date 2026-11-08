import { noStore, requireAdmin, sameOrigin } from "./_admin-auth.js";

const FULFILLMENT_STATES = new Set(["À confirmer", "En préparation", "Expédiée", "Livrée", "Annulée"]);
const STRIPE = "https://api.stripe.com/v1/checkout/sessions/";

export default async function handler(req, res) {
  noStore(res);
  if (req.method !== "POST") return res.status(405).json({ error: "Méthode non autorisée." });
  if (!requireAdmin(req, res)) return;
  if (!sameOrigin(req)) return res.status(403).json({ error: "Origine refusée." });
  const secret = process.env.STRIPE_SECRET_KEY || "";
  if (!secret.startsWith("sk_")) return res.status(503).json({ error: "STRIPE_SECRET_KEY n’est pas configurée dans Vercel." });

  const id = String(req.body?.id || "");
  const status = String(req.body?.status || "");
  if (!/^cs_(?:test|live)_[A-Za-z0-9]+$/.test(id) || !FULFILLMENT_STATES.has(status))
    return res.status(400).json({ error: "Commande ou état invalide." });

  const headers = { Authorization: `Bearer ${secret}`, "Content-Type": "application/x-www-form-urlencoded" };
  try {
    const existingResponse = await fetch(`${STRIPE}${encodeURIComponent(id)}`, { headers: { Authorization: `Bearer ${secret}` } });
    const existing = await existingResponse.json();
    if (!existingResponse.ok) return res.status(404).json({ error: "Commande introuvable dans Stripe." });
    if (existing.mode !== "payment" || existing.status !== "complete" || !/^ELN-/.test(existing.metadata?.order_reference || ""))
      return res.status(404).json({ error: "Cette session n’est pas une commande du site." });
    if (status !== "À confirmer" && status !== "Annulée" && existing.payment_status !== "paid")
      return res.status(409).json({ error: "Impossible de préparer une commande dont le paiement n’est pas confirmé." });

    const form = new URLSearchParams();
    form.set("metadata[fulfillment_status]", status);
    form.set("metadata[fulfillment_updated_at]", new Date().toISOString());
    const updateResponse = await fetch(`${STRIPE}${encodeURIComponent(id)}`, { method: "POST", headers, body: form });
    const updated = await updateResponse.json();
    if (!updateResponse.ok) {
      console.error("Admin Stripe update error", updated.error?.type, updated.error?.code);
      return res.status(502).json({ error: "Stripe n’a pas pu enregistrer le nouvel état." });
    }
    return res.status(200).json({ ok: true, status: updated.metadata?.fulfillment_status || status, updatedAt: updated.metadata?.fulfillment_updated_at || null });
  } catch (_) {
    return res.status(502).json({ error: "Stripe est momentanément indisponible. Réessayez." });
  }
}