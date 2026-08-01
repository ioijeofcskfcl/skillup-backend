const Redis = require("ioredis");

// Railway bergan REDIS_URL bo'lsa shuni oladi, bo'lmasa local-ga ulanadi
const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

const redis = new Redis(redisUrl, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false,
});

redis.on("connect", () => console.log("✅ Redis Connected successfully!"));
redis.on("error", (err) => console.error("❌ Redis Error:", err.message));

// ioredis-da setEx yo'qligi uchun xavfsizlik chorasi:
redis.setEx = function (key, ttl, value) {
    return this.setex(key, ttl, value);
};

module.exports = redis;
