import { Elysia, file } from "elysia";
import mariadb from "@/lib/db";
import redis from "@/lib/redis";

import routes from "./routes/route";

const app = new Elysia()
  .get("/", ({ status }) => {
    const res_status = 200;
    status(res_status);
    return {
      status: res_status,
      message: "Welcome to Labs API!",
      notes: {
        for_developers:
          "Please visit /app for API documentation and Developer Portal.",
        for_users:
          "Please visit https://ponlponl123.com for more information about our services.",
        for_contributors:
          "If you are interested in contributing, please visit our GitHub repository.",
      },
      buy_me_a_coffee: "https://www.buymeacoffee.com/ponlponl123",
    };
  })
  .get("/health", () => "OK")
  .get("/favicon.ico", () => file("./public/favicon.ico"))
  .use(routes)
  .listen(3000);

const dbClient = mariadb.getConnection();
dbClient
  .getConnection()
  .then((conn) => {
    console.log("MariaDB connected");
    conn.release();
  })
  .catch((err) => {
    console.error("MariaDB connection error:", err);
  });

const redisClient = redis.getClient();
redisClient.on("connect", () => {
  console.log("Redis connected");
});
redisClient.on("error", (err) => {
  console.error("Redis connection error:", err);
});

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
