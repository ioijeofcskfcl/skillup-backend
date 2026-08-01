const { createClient } = require("redis");

console.log("REDIS_URL:", process.env.REDIS_URL);

const redisClient = createClient({
    url: process.env.REDIS_URL,
});

redisClient.on("error", (err) => {
    console.log("Redis Error:", err);
});

(async () => {
    await redisClient.connect();
    console.log("Redis Connected");
})();
console.log("REDIS_URL:", process.env.REDIS_URL);
console.log("NODE_ENV:", process.env.NODE_ENV);
module.exports = redisClient;
