const PRODUCTS = {
  b25: { name: "Bûches 25 cm — stère", price: 9300, cubic: true, conversion: 0.6 },
  b33: { name: "Bûches 33 cm — stère", price: 8800, cubic: true, conversion: 0.7 },
  b50: { name: "Bûches 50 cm — stère", price: 8300, cubic: true, conversion: 0.8 },
  cp: { name: "Bois compressé — palette", price: 38000 },
  ck: { name: "Bois compressé — pack", price: 550 },
  gp: { name: "Granulés — palette", price: 43000 },
  gs: { name: "Granulés — sac 15 kg", price: 650 },
  fa: { name: "Allumage — filet", price: 500 },
  cl10: { name: "Bûches compressées classiques — Pack (10 kg)", price: 650 },
  sn12: { name: "Bûches compressées spécial nuit — Pack (12 kg)", price: 900 },
  pk10: { name: "Bûches compressées Pini Kay — Pack (10 kg)", price: 650 },
  pk240: { name: "Bûches compressées Pini Kay — 1/4 palette (240 kg)", price: 13900 },
  pk480: { name: "Bûches compressées Pini Kay — 1/2 palette (480 kg)", price: 26900 },
  pk720: { name: "Bûches compressées Pini Kay — 3/4 palette (720 kg)", price: 40900 },
  pk960: { name: "Bûches compressées Pini Kay — Palette complète (960 kg)", price: 48900 },
  ruf10: { name: "Briquettes RUF en hêtre — Sac (10 kg)", price: 269 },
  ruf960: { name: "Briquettes RUF en hêtre — Palette (960 kg)", price: 20659 },
  pkb10: { name: "Briquettes Pini Kay en chêne — Sac (10 kg)", price: 650 },
  pkb960: { name: "Briquettes Pini Kay en chêne — Palette (960 kg)", price: 49920 },
  gl5: { name: "Granulés de bois en lots et palettes — Lot de 5 sacs (75 kg)", price: 2750 },
  gl10: { name: "Granulés de bois en lots et palettes — Lot de 10 sacs (150 kg)", price: 5490 },
  gl33: { name: "Granulés de bois en lots et palettes — Demi-palette – 33 sacs (495 kg)", price: 17900 },
  gl65: { name: "Granulés de bois en lots et palettes — Palette – 65 sacs (975 kg)", price: 35500 },
  gv1: { name: "Granulés de bois en vrac — Livraison à la tonne (1 tonne)", price: 45000 },
  gv2: { name: "Granulés de bois en vrac — Livraison de deux tonnes (2 tonnes)", price: 88000 },
  /* Catalogue importé — doit rester identique à assets/catalogue-import.js (prix en centimes) */
  x01: { name: "Palette de granulés Crépito — palette", price: 29000 },
  x02: { name: "Palette de granulés Holz Harry — palette", price: 33000 },
  x03: { name: "Palette de granulés Piveteau HP+ — palette", price: 37000 },
  x04: { name: "Palette de granulés TotalEnergies — palette", price: 39500 },
  x05: { name: "Palette de granulés VERBA — palette", price: 28000 },
  x06: { name: "3 palettes de granulés Holz Harry — lot", price: 122500 },
  x07: { name: "3 palettes de granulés Piveteau HP+ — lot", price: 99000 },
  x08: { name: "3 palettes de granulés TotalEnergies — lot", price: 127500 },
  x09: { name: "3 palettes de granulés VERBA — lot", price: 89000 },
  x10: { name: "3 palettes de granulés Woodstock — lot", price: 100500 },
  x11: { name: "Palette de granulés DRAGON — palette", price: 29900 },
  x12: { name: "Palette de granulés EPH — palette", price: 22900 },
  x13: { name: "Palette de granulés FIREFLIES — palette", price: 18900 },
  x14: { name: "Palette de granulés GERMAN FLAMES — palette", price: 49900 },
  x15: { name: "Palette de granulés Giant Flames — palette", price: 42431 },
  x16: { name: "Palette de granulés HEIZFUXX Blue — palette", price: 25900 },
  x17: { name: "Palette de granulés HEIZFUXX Grey — palette", price: 19900 },
  x18: { name: "Palette de granulés HEIZFUXX Red — palette", price: 27900 },
  x19: { name: "Palette de granulés HIT — palette", price: 28500 },
  x20: { name: "Palette de granulés bois dur (chêne/hêtre) — palette", price: 49900 },
  x21: { name: "Palette de granulés HOYER — palette", price: 39000 },
  x23: { name: "Palette de granulés PELLINI — palette", price: 28500 },
  x24: { name: "Palette de granulés REKORD Premium A1 — palette", price: 36500 },
  x27: { name: "Palette de granulés REKORD Premium 6 mm — palette", price: 23900 },
  x28: { name: "Palette de granulés REZULT Premium — palette", price: 49900 },
  x29: { name: "Palette de granulés Saxonia — palette", price: 34900 },
  x30: { name: "Palette de granulés THÜRINGER HD — palette", price: 29900 },
  x25: { name: "Sac de granulés REKORD A1 15 kg — sac", price: 1236 },
  x26: { name: "Lot de 2 sacs de granulés REKORD A1 (2 × 15 kg) — lot", price: 1819 },
  x32: { name: "Bois de chauffage bouleau 25 cm – palette 1 stère — palette", price: 20246 },
  x34: { name: "Bois de chauffage bouleau 25 cm – palette 2 stères — palette", price: 28779 },
  x44: { name: "Bois de chauffage bouleau 25 cm – palette 800 kg — palette", price: 43284 },
  x40: { name: "Bois de chauffage bouleau 25 cm – demi-palette — demi-palette", price: 27925 },
  x33: { name: "Bois de chauffage bouleau 28 cm – 36 sacs 500 kg — palette", price: 28779 },
  x35: { name: "Bois de chauffage bouleau 28 cm – 36 sacs de 40 L — palette", price: 20246 },
  x62: { name: "Giant Flames – Bois de chauffage bouleau 25 cm – 88 filets — palette", price: 43284 },
  x36: { name: "Bois de chauffage hêtre 25 cm – palette 2 m³ — palette", price: 40799 },
  x41: { name: "Bois de chauffage hêtre 25 cm – palette — palette", price: 44138 },
  x37: { name: "Bois de chauffage hêtre 33 cm – palette 900 kg — palette", price: 36327 },
  x39: { name: "Bois de chauffage hêtre 25 cm – 2 palettes — lot", price: 73917 },
  x66: { name: "Holzat – Bois de chauffage hêtre 25 cm – 2 palettes — lot", price: 65085 },
  x56: { name: "Bois de chauffage hêtre 25 cm – demi-palette — demi-palette", price: 31338 },
  x53: { name: "Bois de chauffage hêtre 28 cm – 36 sacs 540 kg — palette", price: 20246 },
  x42: { name: "Bois de chauffage chêne 33 cm – palette 850 kg — palette", price: 43711 },
  x43: { name: "Bois de chauffage chêne 25 cm – palette 850 kg — palette", price: 44990 },
  x45: { name: "Bois de chauffage chêne 25 cm – demi-palette — demi-palette", price: 28779 },
  x54: { name: "Bois de chauffage chêne 25 cm – palette 2 m³ — palette", price: 38591 },
  x65: { name: "Bois de chauffage chêne 25 cm – palette 2 stères — palette", price: 33045 },
  x59: { name: "Giant Flames – Bois de chauffage chêne 25 cm – 88 filets — palette", price: 47551 },
  x46: { name: "Bois de chauffage frêne 25 cm – demi-palette — demi-palette", price: 27925 },
  x47: { name: "Bois de chauffage frêne 30–33 cm – 88 filets — palette", price: 41577 },
  x48: { name: "Bois de chauffage frêne 25 cm – palette 800 kg — palette", price: 37311 },
  x61: { name: "Giant Flames – Bois de chauffage frêne 25 cm – 88 filets — palette", price: 48404 },
  x49: { name: "Bois de chauffage charme 25 cm – demi-palette — demi-palette", price: 28779 },
  x63: { name: "Bois de chauffage charme 33 cm – palette 900 kg — palette", price: 44990 },
  x64: { name: "Bois de chauffage charme 25 cm – palette 900 kg — palette", price: 44990 },
  x57: { name: "Bois de chauffage aulne 25 cm – palette 800 kg — palette", price: 40723 },
  x58: { name: "Bois de chauffage aulne 25 cm – demi-palette 350 kg — demi-palette", price: 26220 },
  x60: { name: "Giant Flames – Bois de chauffage aulne 25 cm – 88 filets — palette", price: 39872 },
  x50: { name: "Bois de chauffage feuillus durs en mélange 25 cm – palette 2 m³ — palette", price: 34174 },
  x51: { name: "Bois de chauffage feuillus durs en mélange 25 cm – 2 palettes — lot", price: 73676 },
  x55: { name: "Bois de chauffage bouleau et frêne en mélange 25 cm – palette — palette", price: 29632 },
  x38: { name: "Chutes de hêtre – 1 m³ plein (750 kg) — lot", price: 34994 },
  x52: { name: "Pack bois de chauffage (3 × 12,5 dm³) — pack", price: 2037 },
  x31: { name: "Petit bois d'allumage résineux – palette (env. 450 dm³) — palette", price: 56798 },
  x67: { name: "Petit bois d'allumage REKORD – lot de 4 sacs de 20 L — lot", price: 1819 },
  x68: { name: "Petit bois d'allumage REKORD – lot de 5 sacs de 5 L — lot", price: 2183 },
  x82: { name: "5 palettes de briquettes de lignite REKORD (40 × 25 kg) — lot", price: 109127 },
  x77: { name: "10 palettes de briquettes de lignite REKORD (40 × 25 kg) — lot", price: 254800 },
  x78: { name: "15 palettes de briquettes de lignite REKORD (40 × 25 kg) — lot", price: 435708 },
  x79: { name: "20 palettes de briquettes de lignite REKORD (40 × 25 kg) — lot", price: 581308 },
  x80: { name: "25 palettes de briquettes de lignite REKORD (40 × 25 kg) — lot", price: 726180 },
  x81: { name: "30 palettes de briquettes de lignite REKORD (40 × 25 kg) — lot", price: 871416 },
  x85: { name: "Palette de briquettes de lignite REKORD (40 × 25 kg) — palette", price: 29094 },
  x88: { name: "Palette de briquettes de lignite REKORD 900 kg (90 × 10 kg) — palette", price: 41205 },
  x89: { name: "Briquettes de lignite REKORD 900 kg sous film, sur europalette — palette", price: 51480 },
  x90: { name: "Demi-palette de briquettes de lignite REKORD 450 kg (45 × 10 kg) — demi-palette", price: 27591 },
  x87: { name: "Briquettes de lignite REKORD – botte de 25 kg (44 briquettes) avec allume-feu — pack", price: 1710 },
  x86: { name: "Pack REKORD Basic XL : briquettes et petit bois (24 kg) — pack", price: 1848 },
  x83: { name: "Palette de briquettes Pini Kay 960 kg (96 sacs de 10 kg) — palette", price: 45845 },
  x84: { name: "Palette de briquettes de résineux (96 × 10 kg) — palette", price: 29630 },
  x91: { name: "Palette de briquettes de bois RUF 960 kg (96 × 10 kg) — palette", price: 48404 },
  x92: { name: "Palette de briquettes rondes de hêtre 960 kg (96 × 10 kg) — palette", price: 47551 },
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
    form.set("mode", "payment");
    // Paiement intégré au site (Embedded Checkout) : un seul return_url, utilisé après un paiement par redirection (Klarna, Bancontact, etc.) ou une authentification 3D Secure.
    form.set("return_url", `${site}/?checkout=success&session_id={CHECKOUT_SESSION_ID}#devis`);
    form.set("customer_email", email);
    form.set("billing_address_collection", "auto");
    form.set("custom_text[submit][message]", "Les frais et modalités de livraison, s’ils s’appliquent, sont confirmés séparément avant expédition.");
    form.set("metadata[customer_name]", name); form.set("metadata[customer_phone]", phone);
    form.set("metadata[delivery_address]", address); form.set("metadata[order_reference]", `ELN-${Date.now().toString(36).toUpperCase()}`);
    items.forEach((item, i) => { form.set(`line_items[${i}][price_data][currency]`, item.price_data.currency); form.set(`line_items[${i}][price_data][product_data][name]`, item.price_data.product_data.name); form.set(`line_items[${i}][price_data][unit_amount]`, String(item.price_data.unit_amount)); form.set(`line_items[${i}][quantity]`, String(item.quantity)); });
    // La valeur de ui_mode dépend de la version de l'API Stripe du compte : "embedded_page" (récente) ou "embedded" (ancienne).
    async function createSession(uiMode) {
      form.set("ui_mode", uiMode);
      const response = await fetch("https://api.stripe.com/v1/checkout/sessions", { method: "POST", headers: { Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}`, "Content-Type": "application/x-www-form-urlencoded" }, body: form });
      return { response, data: await response.json() };
    }
    let { response, data } = await createSession("embedded_page");
    if (!response.ok && data.error?.param === "ui_mode") ({ response, data } = await createSession("embedded"));
    if (!response.ok || !data.client_secret) { console.error("Stripe Checkout error", data.error?.type, data.error?.code, data.error?.param); return res.status(502).json({ error: "Stripe n’a pas pu préparer le paiement. Vérifiez la configuration du compte." }); }
    return res.status(200).json({ clientSecret: data.client_secret });
  } catch (error) {
    return res.status(400).json({ error: error.message || "Demande invalide." });
  }
}
