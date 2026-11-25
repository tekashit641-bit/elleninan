/* Coordonnées bancaires affichées au client qui choisit le virement.
   Valeurs par défaut ci-dessous ; les variables Vercel BANK_HOLDER, BANK_IBAN et BANK_BIC les remplacent si elles existent. */
const DEFAULT = { holder: "David - André LE NINAN", iban: "BE76905934438995", bic: "TRWIBEB1XXX" };
export default function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  if (req.method !== "GET") return res.status(405).json({ error: "Méthode non autorisée." });
  const iban = String(process.env.BANK_IBAN || DEFAULT.iban).replace(/\s+/g, "").toUpperCase();
  if (!/^[A-Z]{2}\d{2}[A-Z0-9]{10,30}$/.test(iban)) return res.status(503).json({ error: "Coordonnées bancaires non configurées." });
  const bic = String(process.env.BANK_BIC || DEFAULT.bic).replace(/\s+/g, "").toUpperCase();
  return res.status(200).json({
    holder: String(process.env.BANK_HOLDER || DEFAULT.holder).trim().slice(0, 120),
    iban,
    bic: /^[A-Z0-9]{8}([A-Z0-9]{3})?$/.test(bic) ? bic : null
  });
}
