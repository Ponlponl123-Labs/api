import { Redis } from "ioredis";

class RedisSentinel {
  private client: Redis;

  constructor(autoConnect: boolean = false) {
    this.client = new Redis({
      sentinels: [
        {
          host: process.env.REDIS_SENTINEL_HOST || "localhost",
          port: parseInt(process.env.REDIS_SENTINEL_PORT || "26379"),
        },
      ],
      name: process.env.REDIS_MASTER_NAME || "mymaster",
      password: process.env.REDIS_PASSWORD || undefined,
      sentinelPassword: process.env.REDIS_SENTINEL_PASSWORD || undefined,
      host: process.env.REDIS_HOST || "localhost",
      port: parseInt(process.env.REDIS_PORT || "6379"),
      db: parseInt(process.env.REDIS_DB || "0"),
      connectTimeout: 10000,
      reconnectOnError: (err) => {
        {
          const targetError = "READONLY";
          if (err.message.includes(targetError)) {
            return true; // Reconnect on READONLY errors
          }
          return false;
        }
      },
    });

    if (autoConnect) {
      this.client.connect();
    }
  }

  public getClient() {
    return this.client;
  }
}

export const redis = new RedisSentinel();

export default redis;
