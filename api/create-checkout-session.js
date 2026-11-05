const PRODUCTS = {
  b25: { name: "Bûches 25 cm — stère", price: 9300, cubic: true, conversion: 0.6 },
  b33: { name: "Bûches 33 cm — stère", price: 8800, cubic: true, conversion: 0.7 },
  b50: { name: "Bûches 50 cm — stère", price: 8300, cubic: true, conversion: 0.8 },
  cp: { name: "Bois compressé — palette", price: 38000 },
  ck: { name: "Bois compressé — pack", price: 550 },
  gp: { name: "Granulés — palette", price: 43000 },
  gs: { name: "Granulés — sac 15 kg", price: 650 },
  fa: { name: "Allumage — filet", price: 500 },
};
const hits = new Map();

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
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_SECRET_KEY.startsWith("sk_"))
    return res.status(503).json({ error: "Le paiement n’est pas configuré." });

  const ip = (req.headers["x-forwarded-for"] || "inconnu").split(",")[0].trim();
  const now = Date.now(), prior = hits.get(ip) || { start: now, count: 0 };
  if (now - prior.start > 5 * 60 * 1000) { prior.start = now; prior.count = 0; }
  if (++prior.count > 8) return res.status(429).json({ error: "Trop de tentatives. Réessayez dans quelques minutes." });
  hits.set(ip, prior);

  try {
    const { cart, customer } = req.body || {};
    if (!Array.isArray(cart) || cart.length < 1 || cart.length > 30) throw new Error("Panier invalide.");
    const name = String(customer?.name || "").trim().slice(0, 100);
    const email = String(customer?.email || "").trim().slice(0, 254);
    const phone = String(customer?.phone || "").trim().slice(0, 40);
    const address = String(customer?.address || "").trim().slice(0, 300);
    if (!name || !phone || !address || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new Error("Coordonnées client invalides.");

    const items = cart.map((line) => {
      const p = PRODUCTS[line?.id], qty = Number(line?.quantity);
      if (!p || !Number.isInteger(qty) || qty < 1 || qty > 50) throw new Error("Article ou quantité invalide.");
      let product = p;
      if (p.cubic && line.unit === "m³") product = { name: p.name.replace("stère", "m³ empilé"), price: Math.round(p.price / p.conversion) };
      else if (p.cubic && line.unit !== "stère" && line.unit !== undefined) throw new Error("Unité invalide.");
      if (!p.cubic && line.unit !== undefined) throw new Error("Unité invalide.");
      return { price_data: { currency: "eur", product_data: { name: product.name }, unit_amount: product.price }, quantity: qty };
    });
    const form = new URLSearchParams();
    form.set("mode", "payment"); form.set("success_url", `${site}/?checkout=success&session_id={CHECKOUT_SESSION_ID}#devis`);
    form.set("cancel_url", `${site}/?checkout=cancel#devis`); form.set("customer_email", email);
    form.set("billing_address_collection", "auto");
    form.set("custom_text[submit][message]", "Les frais et modalités de livraison, s’ils s’appliquent, sont confirmés séparément avant expédition.");
    form.set("metadata[customer_name]", name); form.set("metadata[customer_phone]", phone);
    form.set("metadata[delivery_address]", address); form.set("metadata[order_reference]", `ELN-${Date.now().toString(36).toUpperCase()}`);
    items.forEach((item, i) => { form.set(`line_items[${i}][price_data][currency]`, item.price_data.currency); form.set(`line_items[${i}][price_data][product_data][name]`, item.price_data.product_data.name); form.set(`line_items[${i}][price_data][unit_amount]`, String(item.price_data.unit_amount)); form.set(`line_items[${i}][quantity]`, String(item.quantity)); });
    const response = await fetch("https://api.stripe.com/v1/checkout/sessions", { method: "POST", headers: { Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`, "Content-Type": "application/x-www-form-urlencoded" }, body: form });
    const data = await response.json();
    if (!response.ok) { console.error("Stripe Checkout error", data.error?.type, data.error?.code); return res.status(502).json({ error: "Stripe n’a pas pu préparer le paiement. Vérifiez la configuration du compte." }); }
    return res.status(200).json({ url: data.url });
  } catch (error) {
    return res.status(400).json({ error: error.message || "Demande invalide." });
  }
}
