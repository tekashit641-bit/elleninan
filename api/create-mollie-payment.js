import { PRODUCTS } from "./_catalog.js";

/* Crée un paiement Mollie (page de paiement hébergée par Mollie) à partir du panier.
   Les prix viennent toujours du catalogue serveur, jamais du navigateur. */
const hits = new Map();
const LOCALES = { fr: "fr_FR", de: "de_DE", en: "en_US", es: "es_ES", nl: "nl_NL" };
const eur = (cents) => (cents / 100).toFixed(2);

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  if (req.method !== "POST") return res.status(405).json({ error: "Méthode non autorisée." });
  const site = process.env.SITE_URL;
  let validOrigin = false;
  try {
    const base = new URL(site);
    const origin = new URL(req.headers.origin);
    const domain = base.hostname.replace(/^www\./, "");
    validOrigin = origin.protocol === base.protocol && [domain, `www.${domain}`].includes(origin.hostname);
  } catch (_) {}
  if (!validOrigin) return res.status(403).json({ error: "Origine refusée." });
  const key = process.env.MOLLIE_API_KEY || "";
  if (!/^(test|live)_[A-Za-z0-9]+$/.test(key)) return res.status(503).json({ error: "Le paiement en ligne n’est pas configuré." });

  const ip = (req.headers["x-forwarded-for"] || "inconnu").split(",")[0].trim();
  const now = Date.now(), prior = hits.get(ip) || { start: now, count: 0 };
  if (now - prior.start > 5 * 60 * 1000) { prior.start = now; prior.count = 0; }
  if (++prior.count > 8) return res.status(429).json({ error: "Trop de tentatives. Réessayez dans quelques minutes." });
  hits.set(ip, prior);

  try {
    const { cart, customer, locale } = req.body || {};
    if (!Array.isArray(cart) || cart.length < 1 || cart.length > 30) throw new Error("Panier invalide.");
    const name = String(customer?.name || "").trim().slice(0, 100);
    const email = String(customer?.email || "").trim().slice(0, 254);
    const phone = String(customer?.phone || "").trim().slice(0, 40);
    const address = String(customer?.address || "").trim().slice(0, 300);
    if (!name || !phone || !address || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Coordonnées client invalides.");

    const lines = cart.map((line) => {
      const p = PRODUCTS[line?.id], qty = Number(line?.quantity);
      if (!p || !Number.isInteger(qty) || qty < 1 || qty > 50) throw new Error("Article ou quantité invalide.");
      let product = p;
      if (p.cubic && line.unit === "m³") product = { name: p.name.replace("stère", "m³ empilé"), price: Math.round(p.price / p.conversion) };
      else if (p.cubic && line.unit !== "stère" && line.unit !== undefined) throw new Error("Unité invalide.");
      if (!p.cubic && line.unit !== undefined) throw new Error("Unité invalide.");
      return { description: product.name.slice(0, 100), quantity: qty, unitPrice: { currency: "EUR", value: eur(product.price) }, totalAmount: { currency: "EUR", value: eur(product.price * qty) }, cents: product.price * qty };
    });
    const total = lines.reduce((s, l) => s + l.cents, 0);
    lines.forEach((l) => delete l.cents);
    const reference = `ELN-${Date.now().toString(36).toUpperCase()}`;

    const response = await fetch("https://api.mollie.com/v2/payments", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: { currency: "EUR", value: eur(total) },
        description: `Commande ${reference} – El Le Ninan`,
        redirectUrl: `${site}/?mollie=return&ref=${reference}#devis`,
        locale: LOCALES[locale] || "de_DE",
        lines,
        metadata: { order_reference: reference, customer_name: name, customer_email: email, customer_phone: phone, delivery_address: address }
      })
    });
    const data = await response.json().catch(() => ({}));
    const checkoutUrl = data?._links?.checkout?.href;
    if (!response.ok || !data.id || !checkoutUrl) {
      console.error("Mollie payment error", response.status, data.title, data.field, data.detail);
      const why = [data.field, data.detail].filter(Boolean).join(" : ");
      return res.status(502).json({ error: "Mollie n’a pas pu préparer le paiement." + (why ? ` (${why})` : "") });
    }
    return res.status(200).json({ id: data.id, checkoutUrl, reference, mode: data.mode });
  } catch (error) {
    return res.status(400).json({ error: error.message || "Demande invalide." });
  }
}
