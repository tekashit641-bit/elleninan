import { clearAdminCookie, noStore, sameOrigin } from "./_admin-auth.js";

export default function handler(req, res) {
  noStore(res);
  if (req.method !== "POST") return res.status(405).json({ error: "Méthode non autorisée." });
  if (!sameOrigin(req)) return res.status(403).json({ error: "Origine refusée." });
  clearAdminCookie(req, res);
  return res.status(200).json({ ok: true });
}