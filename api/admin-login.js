import { clearAdminCookie, makeAdminCookie, noStore, passwordMatches, sameOrigin } from "./_admin-auth.js";

const attempts = new Map();
const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 8;

export default async function handler(req, res) {
  noStore(res);
  if (req.method !== "POST") return res.status(405).json({ error: "Méthode non autorisée." });
  if (!sameOrigin(req)) return res.status(403).json({ error: "Origine refusée." });
  if ((process.env.ADMIN_PASSWORD || "").length < 16 || (process.env.ADMIN_SESSION_SECRET || "").length < 32)
    return res.status(503).json({ error: "Espace admin non configuré. Ajoutez ADMIN_PASSWORD et ADMIN_SESSION_SECRET dans Vercel." });

  const ip = String(req.headers["x-forwarded-for"] || "inconnu").split(",")[0].trim();
  const now = Date.now();
  let state = attempts.get(ip);
  if (!state || now - state.started > WINDOW_MS) state = { started: now, count: 0 };
  if (state.count >= MAX_ATTEMPTS) {
    attempts.set(ip, state);
    res.setHeader("Retry-After", String(Math.ceil((WINDOW_MS - (now - state.started)) / 1000)));
    return res.status(429).json({ error: "Trop de tentatives. Réessayez dans quelques minutes." });
  }

  if (!passwordMatches(req.body?.password)) {
    state.count += 1;
    attempts.set(ip, state);
    return res.status(401).json({ error: "Mot de passe incorrect." });
  }
  attempts.delete(ip);
  try { makeAdminCookie(req, res); }
  catch (_) { clearAdminCookie(req, res); return res.status(503).json({ error: "Configuration de session invalide." }); }
  return res.status(200).json({ ok: true });
}