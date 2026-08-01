const Redis = require("ioredis");

const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

// Railway va Local muhit uchun moslashuvchan ulanish
const redis = new Redis(redisUrl, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
    tls: redisUrl.startsWith("rediss://") ? { rejectUnauthorized: false } : undefined,
});

redis.on("connect", () => console.log("✅ Redis-ga muvaffaqiyatli ulanindi!"));
redis.on("error", (err) => console.error("❌ Redis Error:", err.message));

// ioredis-da setEx yo'qligi sababli moslashtirish (patch):
redis.setEx = function (key, ttl, value) {
    return this.setex(key, ttl, value);
};

module.exports = redis;