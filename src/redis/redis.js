const Redis = require("ioredis");

// Railway yuborayotgan REDIS_URL ni o'qiymiz
const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";

console.log("📌 Ishlatilayotgan Redis URL:", redisUrl);

const redis = new Redis(redisUrl, {
    maxRetriesPerRequest: null,
    // Railway tarmoq muammolari uchun retry sozlamasi
    retryStrategy(times) {
        const delay = Math.min(times * 50, 2000);
        return delay;
    },
});

redis.on("connect", () => console.log("✅ Redis Connected successfully!"));
redis.on("error", (err) => console.error("❌ Redis Error:", err.message));

module.exports = redis;
