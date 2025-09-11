import { createClient } from "redis";

const redisClient = createClient({
  url: process.env.REDIS_URL || "redis://127.0.0.1:6379",
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error", err);
});

await redisClient.connect();

const MAX_CONCURRENT_USERS = 100;

export const concurrencyLimiter = async (req, res, next) => {
  try {
    // Increase active users count
    const activeUsers = await redisClient.incr("active_users");

    if (activeUsers > MAX_CONCURRENT_USERS) {
      // Too many concurrent users -> rollback increment and block request
      await redisClient.decr("active_users");
      return res
        .status(503)
        .json({ error: "Server is busy. Please try again later." });
    }

    // When response finishes, decrease active users
    res.on("finish", async () => {
      await redisClient.decr("active_users");
    });

    next();
  } catch (err) {
    console.error("Concurrency limiter error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
