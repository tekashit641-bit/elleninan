const ACTIVE_KEY = "eln:visitors:active";
const TOTAL_KEY = "eln:visitors:total";
const ACTIVE_WINDOW_SECONDS = 90;

function redisUrl(command) {
  const base = process.env.UPSTASH_REDIS_REST_URL;
  return base.replace(/\/$/, "") + "/" + command.map(function (part) { return encodeURIComponent(String(part)); }).join("/");
}

async function command(parts) {
  const response = await fetch(redisUrl(parts), {
    headers: { Authorization: "Bearer " + process.env.UPSTASH_REDIS_REST_TOKEN },
    cache: "no-store"
  });
  if (!response.ok) throw new Error("Redis request failed");
  const body = await response.json();
  if (body.error) throw new Error("Redis command failed");
  return body.result;
}

async function pipeline(commands) {
  const response = await fetch(process.env.UPSTASH_REDIS_REST_URL.replace(/\/$/, "") + "/pipeline", {
    method: "POST",
    headers: {
      Authorization: "Bearer " + process.env.UPSTASH_REDIS_REST_TOKEN,
      "Content-Type": "application/json"
    },
    body: JSON.stringify(commands),
    cache: "no-store"
  });
  if (!response.ok) throw new Error("Redis pipeline failed");
  const results = await response.json();
  if (!Array.isArray(results) || results.some(function (item) { return item.error; })) throw new Error("Redis pipeline failed");
  return results.map(function (item) { return item.result; });
}

export default async function handler(req, res) {
  res.setHeader("Cache-Control", "no-store, max-age=0");
  res.setHeader("X-Content-Type-Options", "nosniff");
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ error: "Method not allowed" });
  }
  const id = typeof req.query.id === "string" ? req.query.id : "";
  if (!/^[0-9a-f-]{36}$/i.test(id)) return res.status(400).json({ error: "Invalid visitor id" });
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return res.status(503).json({ error: "Visitor counter is not configured" });
  }
  try {
    const seen = await command(["SET", "eln:visitors:seen:" + id, "1", "NX", "EX", 86400]);
    const now = Math.floor(Date.now() / 1000);
    const cutoff = now - ACTIVE_WINDOW_SECONDS;
    const commands = [
      ["ZADD", ACTIVE_KEY, now, id],
      ["ZREMRANGEBYSCORE", ACTIVE_KEY, "-inf", cutoff]
    ];
    if (seen === "OK") commands.push(["INCR", TOTAL_KEY]);
    commands.push(["ZCARD", ACTIVE_KEY], ["GET", TOTAL_KEY]);
    const results = await pipeline(commands);
    const offset = seen === "OK" ? 3 : 2;
    return res.status(200).json({ online: Number(results[offset] || 0), total: Number(results[offset + 1] || 0) });
  } catch (error) {
    return res.status(503).json({ error: "Visitor counter temporarily unavailable" });
  }
}
