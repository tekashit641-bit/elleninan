import crypto from "node:crypto";

// Vercel treats every JavaScript file under /api as a route. Keep this
// internal helper non-callable when requested directly.
export default function handler(_req, res) {
  res.setHeader("Cache-Control", "no-store, max-age=0");
  return res.status(404).json({ error: "Route introuvable." });
}

const COOKIE = "eln_admin_session";
const SESSION_TTL_SECONDS = 8 * 60 * 60;

export function noStore(res) {
  res.setHeader("Cache-Control", "no-store, max-age=0");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("Referrer-Policy", "no-referrer");
}

export function sameOrigin(req) {
  try {
    const expected = new URL(process.env.SITE_URL);
    const actual = new URL(req.headers.origin || "");
    return actual.protocol === expected.protocol && actual.host === expected.host;
  } catch (_) { return false; }
}

function sessionSecret() {
  const value = process.env.ADMIN_SESSION_SECRET || "";
  return value.length >= 32 ? value : null;
}

function signature(expiry, secret) {
  return crypto.createHmac("sha256", secret).update(`eln-admin:${expiry}`).digest("base64url");
}

export function makeAdminCookie(req, res) {
  const secret = sessionSecret();
  if (!secret) throw new Error("ADMIN_SESSION_SECRET must contain at least 32 characters.");
  const expiry = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const value = `${expiry}.${signature(expiry, secret)}`;
  const secure = process.env.NODE_ENV === "production" || req.headers["x-forwarded-proto"] === "https";
  res.setHeader("Set-Cookie", `${COOKIE}=${value}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${SESSION_TTL_SECONDS}${secure ? "; Secure" : ""}`);
}

export function clearAdminCookie(req, res) {
  const secure = process.env.NODE_ENV === "production" || req.headers["x-forwarded-proto"] === "https";
  res.setHeader("Set-Cookie", `${COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${secure ? "; Secure" : ""}`);
}

export function isAdmin(req) {
  const secret = sessionSecret();
  if (!secret) return false;
  const cookie = String(req.headers.cookie || "").split(";").map((part) => part.trim()).find((part) => part.startsWith(`${COOKIE}=`));
  if (!cookie) return false;
  const [expiryText, supplied] = cookie.slice(COOKIE.length + 1).split(".");
  const expiry = Number(expiryText);
  if (!Number.isSafeInteger(expiry) || expiry <= Math.floor(Date.now() / 1000) || !supplied) return false;
  const expected = Buffer.from(signature(expiry, secret));
  const received = Buffer.from(supplied);
  return expected.length === received.length && crypto.timingSafeEqual(expected, received);
}

export function requireAdmin(req, res) {
  if (isAdmin(req)) return true;
  res.status(401).json({ error: "Connexion administrateur requise." });
  return false;
}

export function passwordMatches(supplied) {
  const expected = process.env.ADMIN_PASSWORD || "";
  if (expected.length < 16 || typeof supplied !== "string") return false;
  const a = crypto.createHash("sha256").update(supplied).digest();
  const b = crypto.createHash("sha256").update(expected).digest();
  return crypto.timingSafeEqual(a, b);
}
