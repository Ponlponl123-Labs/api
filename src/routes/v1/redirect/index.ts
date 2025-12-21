import db from "@/lib/db";
import redis from "@/lib/redis";
import Elysia, { t } from "elysia";
import record from "./record";

export const route = new Elysia({ prefix: "/redirect" }).get(
  "/:id?",
  async ({ params: { id }, headers, server, request }) => {
    if (!id) {
      return {
        status: 400,
        message: "Bad Request: Missing ID parameter.",
      };
    }
    const reqIp =
      headers["x-forwarded-for"] || server?.requestIP(request)?.address || "";
    // Try Redis cache first
    try {
      const redisClient = redis.getClient();
      const cached = await redisClient.get(`redirect:${id}`);
      if (cached) {
        await record(reqIp, headers as any, id);
        return {
          status: 302,
          redirect: cached,
        };
      }
    } catch (err: any) {
      console.error("Redis error while fetching redirect:", err);
      return {
        status: 500,
        message: "Internal Server Error: " + err.message,
      };
    }

    // Fallback to DB lookup
    try {
      const dbpool = db.redirector;
      const dbClient = dbpool.getConnection();
      const rows: any = await dbClient.query(
        "SELECT uri FROM endpoint WHERE url = ? AND (disabled IS NULL OR disabled = 0) LIMIT 1",
        [id]
      );

      if (Array.isArray(rows) && rows.length > 0) {
        const targetUrl = rows[0].uri;
        // Cache result for 1 hour
        try {
          await redis
            .getClient()
            .set(`redirect:${id}`, String(targetUrl), "EX", 3600);
        } catch {}

        await record(reqIp, headers as any, id);
        return {
          status: 302,
          redirect: targetUrl,
        };
      }

      return {
        status: 404,
        message: "Not Found: No redirect found for the given ID.",
      };
    } catch (err: any) {
      console.error("Error querying redirect endpoint:", err);
      return {
        status: 500,
        message: "Internal Server Error",
      };
    }
  },
  {
    params: t.Object({
      id: t.Optional(t.String()),
    }),
  }
);

export default route;
