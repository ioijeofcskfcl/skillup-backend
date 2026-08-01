const Redis = require("ioredis");

// Agar REDIS_URL bo'lsa shuni oladi, aks holda lokal localhost ga ulanadi
const redis = new Redis(process.env.REDIS_URL || "redis://localhost:6379");

redis.on("connect", () => console.log("✅ Redis Connected"));
redis.on("error", (err) => console.error("❌ Redis Error:", err.message));

module.exports = redis;
