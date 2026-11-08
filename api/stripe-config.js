export default function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  if (req.method !== "GET") return res.status(405).json({ error: "Méthode non autorisée." });
  const publishable = process.env.STRIPE_PUBLISHABLE_KEY || "";
  const secret = process.env.STRIPE_SECRET_KEY || "";
  if (!/^pk_(test|live)_[A-Za-z0-9]+$/.test(publishable)) return res.status(503).json({ error: "Paiement non configuré." });
  // La clé publiable et la clé secrète doivent être du même mode (test ou live).
  if (publishable.startsWith("pk_live_") !== secret.startsWith("sk_live_")) return res.status(503).json({ error: "Configuration de paiement incohérente." });
  return res.status(200).json({ publishableKey: publishable });
}
