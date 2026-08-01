const Redis = require("ioredis");

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

const redis = new Redis(redisUrl, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    connectTimeout: 20000,
});

redis.on("connect", () => console.log("✅ Redis Connected successfully!"));
redis.on("error", (err) => console.error("❌ Redis Error:", err.message));

// setEx mosligi uchun:
redis.setEx = function (key, ttl, value) {
    return this.setex(key, ttl, value);
};

module.exports = redis;