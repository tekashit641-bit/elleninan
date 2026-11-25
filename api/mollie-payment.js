/* Vérifie l'état d'un paiement Mollie au retour du client (GET ?id=tr_...),
   et indique si le paiement en ligne est disponible (GET sans id). */
export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("X-Content-Type-Options", "nosniff");
  if (req.method !== "GET") return res.status(405).json({ error: "Méthode non autorisée." });
  const key = process.env.MOLLIE_API_KEY || "";
  const configured = /^(test|live)_[A-Za-z0-9]+$/.test(key);
  const id = String(req.query?.id || "");
  if (!id) return res.status(200).json({ enabled: configured, mode: configured ? key.slice(0, 4) : null });
  if (!configured) return res.status(503).json({ error: "Paiement non configuré." });
  if (!/^tr_[A-Za-z0-9]+$/.test(id)) return res.status(400).json({ error: "Paiement invalide." });
  try {
    const response = await fetch(`https://api.mollie.com/v2/payments/${encodeURIComponent(id)}`, { headers: { Authorization: `Bearer ${key}` } });
    const data = await response.json();
    if (!response.ok) return res.status(502).json({ error: "Impossible de vérifier le paiement." });
    return res.status(200).json({ status: data.status, orderReference: data.metadata?.order_reference || null, amount: data.amount?.value || null, mode: data.mode });
  } catch (_) { return res.status(502).json({ error: "Impossible de vérifier le paiement." }); }
}
